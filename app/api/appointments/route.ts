import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { createBookingSchema } from "@/lib/validators";
import { timeStringToMinutes, minutesToTimeString } from "@/lib/slots";
import { calculatePriceBreakdown } from "@/lib/pricing";
import { sendNotification, buildAppointmentConfirmedMessage } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

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
      items,
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
    } = result.data;

    const appointmentDate = new Date(`${date}T00:00:00.000Z`);

    // 1. Calculate duration and end time
    const totalDurationMinutes = items.reduce((acc, curr) => acc + curr.durationMinutes, 0);
    const startMinutes = timeStringToMinutes(startTime);
    const endMinutes = startMinutes + totalDurationMinutes;
    const endTime = minutesToTimeString(endMinutes);

    // 2. Base Amount
    const baseAmount = items.reduce((acc, curr) => acc + curr.price, 0);

    // 3. Check Promo Code
    let promoRecord = null;
    if (promoCode) {
      promoRecord = await db.promoCode.findUnique({
        where: { code: promoCode.toUpperCase().trim() },
      });
      if (promoRecord && (!promoRecord.isActive || promoRecord.validUntil < new Date())) {
        promoRecord = null;
      }
    }

    // 4. Check user membership & loyalty points
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

    // Check bridal deposit if applicable
    let bridalDepositRequired = 0;
    if (isBridal) {
      const bridalItem = items.find((i) => i.bridalPackageId);
      if (bridalItem?.bridalPackageId) {
        const pkg = await db.bridalPackage.findUnique({ where: { id: bridalItem.bridalPackageId } });
        if (pkg) bridalDepositRequired = pkg.advanceDeposit;
      }
    }

    // Price calculation
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
    const paymentStatus = balanceDue === 0 ? "COMPLETED" : amountPaid > 0 ? "PARTIAL" : "PENDING";

    // 5. Execute in database transaction to prevent double bookings
    const createdAppointment = await db.$transaction(async (tx) => {
      // Determine assigned stylist
      let assignedStylistId = stylistId;

      if (!assignedStylistId || assignedStylistId === "any") {
        // Find an active stylist who has no conflicting appointment
        const activeStylists = await tx.stylist.findMany({
          where: { isActive: true },
          include: {
            appointments: {
              where: {
                date: appointmentDate,
                status: { in: ["PENDING", "CONFIRMED"] },
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
            status: { in: ["PENDING", "CONFIRMED"] },
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
          status: "CONFIRMED",
          totalAmount: breakdown.finalTotal,
          discountAmount: breakdown.totalDiscount + breakdown.pointsDiscount,
          advancePaid: amountPaid,
          balanceDue,
          paymentStatus,
          paymentMethod,
          isBridal,
          isHomeVisit,
          venueAddress,
          distanceKm,
          distanceSurcharge: breakdown.distanceSurcharge,
          groupSize,
          notes,
          lookBoardId,
          items: {
            create: items.map((it) => ({
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
                status: amountPaid > 0 ? "SUCCESS" : "INITIATED",
                method: paymentMethod,
                transactionRef: `TXN-${Date.now()}-${randomSuffix}`,
                isMock: true,
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
              status: balanceDue === 0 ? "PAID" : "UNPAID",
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

      // Award points earned
      if (loggedInUserId && breakdown.pointsEarned > 0) {
        await tx.user.update({
          where: { id: loggedInUserId },
          data: { loyaltyPoints: { increment: breakdown.pointsEarned } },
        });
        await tx.loyaltyTransaction.create({
          data: {
            userId: loggedInUserId,
            points: breakdown.pointsEarned,
            type: "EARNED",
            description: `Earned 10% back on Appointment #${appointmentNumber}`,
            appointmentId: appt.id,
            balanceAfter: availableLoyaltyPoints - breakdown.pointsRedeemed + breakdown.pointsEarned,
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

    // 6. Send confirmation notification & log WhatsApp message
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
      title: `BEEM Appointment #${createdAppointment.appointmentNumber} Confirmed`,
      message: msg,
    });

    return NextResponse.json(
      {
        message: "Appointment confirmed successfully",
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
