import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { createBookingSchema } from "@/lib/validators";
import { timeStringToMinutes, minutesToTimeString, autoReleaseExpiredBridalHolds } from "@/lib/slots";
import { calculatePriceBreakdown } from "@/lib/pricing";
import { sendNotification, buildAppointmentConfirmedMessage } from "@/lib/notifications";
import { checkRateLimit, getClientIp, validateAntiBot } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    // 1. Sliding-window rate limit (10 booking attempts per 5 minutes per IP)
    const rateCheck = await checkRateLimit(`ip:${ip}:create_booking`, 10, 300);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many booking attempts. Please wait a few minutes before trying again." },
        { status: 429 }
      );
    }

    const session = await getServerSession(authOptions);
    const body = await req.json();

    // 2. Validate input schema
    const result = createBookingSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid booking details", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const {
      customerName,
      customerEmail,
      customerPhone,
      stylistId,
      date,
      startTime,
      items: rawItems,
      isBridal,
      isHomeVisit,
      venueAddress,
      distanceKm,
      groupSize,
      notes,
      lookBoardId,
      promoCode,
      loyaltyPointsToRedeem,
      payDepositOnly,
      paymentMethod,
      utrNumber,
      screenshotUrl,
      hp_website,
      formTimestamp,
    } = result.data;

    // 3. Anti-Bot honeypot & submission velocity check
    const botCheck = validateAntiBot({ hp_website, formTimestamp, minDurationSeconds: 1.5 });
    if (botCheck.isBot) {
      // Reject bot silently or return 400
      return NextResponse.json(
        { error: "Booking submission failed automated security verification." },
        { status: 400 }
      );
    }

    // 4. Check UTR uniqueness before transaction
    if (utrNumber && utrNumber.trim().length > 0) {
      const existingPayment = await db.payment.findUnique({
        where: { utrNumber: utrNumber.trim() },
      });
      if (existingPayment) {
        return NextResponse.json(
          {
            error: "Duplicate UTR Number",
            message: "This UPI Reference (UTR) has already been submitted for another booking. Please check your bank transaction or contact salon support.",
          },
          { status: 400 }
        );
      }
    }

    // 5. Authoritative Server-Side Item and Price Verification (Never trust client prices!)
    const validatedItems: {
      serviceId?: string | null;
      bridalPackageId?: string | null;
      mehendiDesignId?: string | null;
      name: string;
      price: number;
      durationMinutes: number;
    }[] = [];

    let bridalDepositRequired = 0;

    for (const it of rawItems) {
      if (it.bridalPackageId) {
        const pkg = await db.bridalPackage.findUnique({ where: { id: it.bridalPackageId } });
        if (!pkg) {
          return NextResponse.json({ error: `Selected bridal package not found: ${it.name}` }, { status: 400 });
        }
        validatedItems.push({
          bridalPackageId: pkg.id,
          name: pkg.name,
          price: pkg.price,
          durationMinutes: Math.round(pkg.durationHours * 60),
        });
        bridalDepositRequired = pkg.advanceDeposit;
      } else if (it.mehendiDesignId) {
        const des = await db.mehendiDesign.findUnique({ where: { id: it.mehendiDesignId } });
        if (!des) {
          return NextResponse.json({ error: `Selected mehendi design not found: ${it.name}` }, { status: 400 });
        }
        validatedItems.push({
          mehendiDesignId: des.id,
          name: des.title,
          price: des.price,
          durationMinutes: 60,
        });
      } else if (it.serviceId) {
        const svc = await db.service.findUnique({ where: { id: it.serviceId } });
        if (!svc || !svc.isActive) {
          return NextResponse.json({ error: `Selected service not available: ${it.name}` }, { status: 400 });
        }
        validatedItems.push({
          serviceId: svc.id,
          name: svc.name,
          price: svc.price,
          durationMinutes: svc.durationMinutes,
        });
      } else {
        return NextResponse.json({ error: "Invalid treatment selection." }, { status: 400 });
      }
    }

    const appointmentDate = new Date(`${date}T00:00:00.000Z`);

    // 6. Calculate total duration and end time
    const totalDurationMinutes = validatedItems.reduce((acc, curr) => acc + curr.durationMinutes, 0);
    const startMinutes = timeStringToMinutes(startTime);
    const endMinutes = startMinutes + totalDurationMinutes;
    const endTime = minutesToTimeString(endMinutes);

    // 7. Base Amount from authoritative DB items
    const baseAmount = validatedItems.reduce((acc, curr) => acc + curr.price, 0);

    // 8. Check Promo Code
    let promoRecord = null;
    if (promoCode) {
      promoRecord = await db.promoCode.findUnique({
        where: { code: promoCode.toUpperCase().trim() },
      });
      if (promoRecord && (!promoRecord.isActive || promoRecord.validUntil < new Date())) {
        promoRecord = null;
      }
    }

    // 9. Check user membership & loyalty points
    let membershipDiscountPercent = 0;
    let availableLoyaltyPoints = 0;
    const loggedInUserId = (session?.user as any)?.id || null;

    if (loggedInUserId) {
      const user = await db.user.findUnique({
        where: { id: loggedInUserId },
        include: {
          memberships: {
            where: { status: "ACTIVE", endDate: { gte: new Date() } },
            include: { plan: true },
          },
        },
      });

      if (user) {
        availableLoyaltyPoints = user.loyaltyPoints;
        if (user.memberships.length > 0) {
          membershipDiscountPercent = user.memberships[0].plan.discountPercent;
        }
      }
    }

    // 10. Compute authoritative price breakdown
    const breakdown = calculatePriceBreakdown({
      baseAmount,
      promoCode: promoRecord,
      membershipDiscountPercent,
      isHomeVisit,
      distanceKm,
      groupSize,
      loyaltyPointsToRedeem: Math.min(loyaltyPointsToRedeem, availableLoyaltyPoints),
      isBridal,
      bridalDepositRequired,
    });

    const amountPaid = payDepositOnly ? breakdown.depositAmount : breakdown.finalTotal;
    const balanceDue = Math.max(0, breakdown.finalTotal - amountPaid);

    // Determine booking and payment status
    let initialAppointmentStatus = "CONFIRMED";
    let paymentRecordStatus = "PENDING";

    if (paymentMethod === "UPI") {
      if (utrNumber && utrNumber.trim().length > 0) {
        initialAppointmentStatus = "PAYMENT_SUBMITTED";
        paymentRecordStatus = "SUBMITTED";
      } else {
        initialAppointmentStatus = "PENDING_PAYMENT";
        paymentRecordStatus = "PENDING";
      }
    } else {
      // SALON payment
      if (isBridal) {
        initialAppointmentStatus = "PENDING_PAYMENT";
      } else {
        initialAppointmentStatus = "CONFIRMED";
      }
      paymentRecordStatus = "PENDING";
    }

    // Tentative 24-hour hold for bridal appointments
    const holdExpiresAt = isBridal ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null;

    // 11. Database Transaction with slot conflict verification
    const createdAppointment = await db.$transaction(async (tx) => {
      // Auto-release expired bridal holds inside transaction
      await autoReleaseExpiredBridalHolds(tx);

      // Determine assigned stylist
      let assignedStylistId = stylistId;
      const blockingStatuses = ["PENDING", "PENDING_PAYMENT", "PAYMENT_SUBMITTED", "CONFIRMED"];

      if (!assignedStylistId || assignedStylistId === "any") {
        // Find an active stylist with no conflicting appointment
        const activeStylists = await tx.stylist.findMany({
          where: { isActive: true },
          include: {
            appointments: {
              where: {
                date: appointmentDate,
                status: { in: blockingStatuses },
              },
            },
          },
        });

        const freeStylist = activeStylists.find((s) => {
          return !s.appointments.some((appt) => {
            const apptStart = timeStringToMinutes(appt.startTime);
            const apptEnd = timeStringToMinutes(appt.endTime);
            return startMinutes < apptEnd && apptStart < endMinutes;
          });
        });

        if (!freeStylist) {
          throw new Error("DOUBLE_BOOKING_PREVENTED: No stylist is available for the selected slot and duration.");
        }
        assignedStylistId = freeStylist.id;
      } else {
        // Specific stylist chosen: verify conflict
        const conflict = await tx.appointment.findFirst({
          where: {
            stylistId: assignedStylistId,
            date: appointmentDate,
            status: { in: blockingStatuses },
          },
        });

        if (conflict) {
          const cStart = timeStringToMinutes(conflict.startTime);
          const cEnd = timeStringToMinutes(conflict.endTime);
          if (startMinutes < cEnd && cStart < endMinutes) {
            throw new Error("DOUBLE_BOOKING_PREVENTED: The selected stylist already has a booking during this slot.");
          }
        }
      }

      // Generate human-friendly appointment number
      const datePart = date.replace(/-/g, "");
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const appointmentNumber = `BEEM-${datePart}-${randomSuffix}`;
      const invoiceNumber = `INV-${datePart}-${randomSuffix}`;

      // Create Appointment
      const appt = await tx.appointment.create({
        data: {
          appointmentNumber,
          userId: loggedInUserId,
          customerName,
          customerPhone,
          customerEmail,
          stylistId: assignedStylistId,
          date: appointmentDate,
          startTime,
          endTime,
          status: initialAppointmentStatus,
          totalAmount: breakdown.finalTotal,
          discountAmount: breakdown.totalDiscount + breakdown.pointsDiscount,
          advancePaid: paymentMethod === "UPI" && utrNumber ? amountPaid : 0,
          balanceDue,
          paymentStatus: initialAppointmentStatus === "CONFIRMED" && balanceDue === 0 ? "COMPLETED" : "PENDING",
          paymentMethod: paymentMethod === "UPI" ? "UPI" : "SALON",
          utrNumber: utrNumber ? utrNumber.trim() : null,
          isBridal,
          holdExpiresAt,
          isHomeVisit,
          venueAddress,
          distanceKm,
          distanceSurcharge: breakdown.distanceSurcharge,
          groupSize,
          notes,
          lookBoardId,
          items: {
            create: validatedItems.map((it) => ({
              serviceId: it.serviceId ?? null,
              bridalPackageId: it.bridalPackageId ?? null,
              mehendiDesignId: it.mehendiDesignId ?? null,
              name: it.name,
              price: it.price,
              durationMinutes: it.durationMinutes,
            })),
          },
          payments: {
            create: [
              {
                amount: amountPaid,
                currency: "INR",
                status: paymentRecordStatus,
                method: paymentMethod === "UPI" ? "UPI" : "SALON",
                utrNumber: utrNumber ? utrNumber.trim() : null,
                screenshotUrl: screenshotUrl || null,
              },
            ],
          },
          invoice: {
            create: {
              invoiceNumber,
              subtotal: breakdown.preTaxSubtotal,
              taxAmount: breakdown.gstAmount,
              discountAmount: breakdown.totalDiscount + breakdown.pointsDiscount,
              totalAmount: breakdown.finalTotal,
              status: balanceDue === 0 && initialAppointmentStatus === "CONFIRMED" ? "PAID" : "UNPAID",
            },
          },
        },
        include: {
          items: true,
          stylist: true,
          invoice: true,
          payments: true,
        },
      });

      // Audit Log for appointment and payment
      await tx.auditLog.create({
        data: {
          action: "APPOINTMENT_CREATE",
          entityType: "APPOINTMENT",
          entityId: appt.id,
          performedBy: customerEmail,
          ipAddress: ip,
          details: JSON.stringify({
            appointmentNumber,
            method: paymentMethod,
            amount: breakdown.finalTotal,
            utr: utrNumber || null,
            status: initialAppointmentStatus,
          }),
        },
      });

      // Deduct redeemed loyalty points if any
      if (loggedInUserId && breakdown.pointsRedeemed > 0) {
        await tx.user.update({
          where: { id: loggedInUserId },
          data: { loyaltyPoints: { decrement: breakdown.pointsRedeemed } },
        });
        await tx.loyaltyTransaction.create({
          data: {
            userId: loggedInUserId,
            points: -breakdown.pointsRedeemed,
            type: "REDEEMED",
            description: `Redeemed on Appointment #${appointmentNumber}`,
            appointmentId: appt.id,
            balanceAfter: availableLoyaltyPoints - breakdown.pointsRedeemed,
          },
        });
      }

      // Increment promo usage
      if (promoRecord) {
        await tx.promoCode.update({
          where: { id: promoRecord.id },
          data: { timesUsed: { increment: 1 } },
        });
      }

      return appt;
    });

    // 12. Send confirmation notification & log WhatsApp message
    const msg = buildAppointmentConfirmedMessage({
      appointmentNumber: createdAppointment.appointmentNumber,
      customerName: createdAppointment.customerName,
      dateStr: date,
      timeStr: `${createdAppointment.startTime} - ${createdAppointment.endTime}`,
      services: createdAppointment.items.map((i) => i.name),
      stylistName: createdAppointment.stylist?.name || "Master Stylist",
      totalAmount: createdAppointment.totalAmount,
      balanceDue: createdAppointment.balanceDue,
    });

    await sendNotification({
      userId: loggedInUserId,
      recipient: customerPhone,
      type: "APPOINTMENT_CONFIRMED",
      title: `BEEM Appointment #${createdAppointment.appointmentNumber} Registered`,
      message: msg,
    });

    return NextResponse.json(
      {
        message: "Appointment created successfully",
        appointment: createdAppointment,
        priceBreakdown: breakdown,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Booking error:", error);
    if (error.message && error.message.includes("DOUBLE_BOOKING_PREVENTED")) {
      return NextResponse.json(
        { error: "Slot Conflict", message: error.message },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to book appointment", message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date");
    const status = searchParams.get("status");
    const stylistId = searchParams.get("stylistId");

    const userRole = (session?.user as any)?.role;
    const userId = (session?.user as any)?.id;

    const whereClause: any = {};

    if (userRole === "ADMIN" || userRole === "STYLIST") {
      if (dateStr) {
        whereClause.date = new Date(`${dateStr}T00:00:00.000Z`);
      }
      if (status) {
        whereClause.status = status;
      }
      if (stylistId) {
        whereClause.stylistId = stylistId;
      }
    } else if (userId) {
      whereClause.userId = userId;
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const appointments = await db.appointment.findMany({
      where: whereClause,
      include: {
        items: true,
        stylist: true,
        invoice: true,
        payments: true,
      },
      orderBy: [{ date: "desc" }, { startTime: "asc" }],
    });

    return NextResponse.json({ appointments });
  } catch (error: any) {
    console.error("Fetch appointments error:", error);
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}
