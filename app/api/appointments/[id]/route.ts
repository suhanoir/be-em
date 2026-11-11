import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendNotification } from "@/lib/notifications";
import { timeStringToMinutes, minutesToTimeString } from "@/lib/slots";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const appointment = await db.appointment.findUnique({
      where: { id: params.id },
      include: {
        items: true,
        stylist: true,
        invoice: true,
        payments: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    const userId = (session?.user as any)?.id;
    const userRole = (session?.user as any)?.role;

    if (userRole !== "ADMIN" && userRole !== "STYLIST" && appointment.userId && appointment.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ appointment });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch appointment", message: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { action, status, cancellationReason, newDate, newStartTime } = body;

    const appointment = await db.appointment.findUnique({
      where: { id: params.id },
      include: { stylist: true, items: true },
    });

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    const userId = (session?.user as any)?.id;
    const userRole = (session?.user as any)?.role;
    const isAdmin = userRole === "ADMIN" || userRole === "STYLIST";

    // Action 1: Status change by Admin
    if (status && isAdmin) {
      const updated = await db.appointment.update({
        where: { id: params.id },
        data: {
          status,
          ...(status === "COMPLETED" ? { paymentStatus: "COMPLETED", balanceDue: 0 } : {}),
        },
      });

      return NextResponse.json({ message: "Status updated successfully", appointment: updated });
    }

    // Action 2: Cancel Appointment
    if (action === "CANCEL") {
      // Cancellation policy check: can cancel if at least 4 hours before slot
      const appointmentDateTime = new Date(appointment.date);
      const [h, m] = appointment.startTime.split(":").map(Number);
      appointmentDateTime.setHours(h, m, 0, 0);

      const hoursUntilAppointment = (appointmentDateTime.getTime() - Date.now()) / (1000 * 60 * 60);

      if (!isAdmin && hoursUntilAppointment < 4) {
        return NextResponse.json(
          {
            error: "Cancellation Policy",
            message: "Appointments can only be cancelled at least 4 hours prior to the booked time.",
          },
          { status: 400 }
        );
      }

      const updated = await db.appointment.update({
        where: { id: params.id },
        data: {
          status: "CANCELLED",
          cancellationReason: cancellationReason || "Customer requested cancellation",
        },
      });

      await sendNotification({
        userId: appointment.userId,
        recipient: appointment.customerPhone,
        type: "CANCELLATION",
        title: `Appointment #${appointment.appointmentNumber} Cancelled`,
        message: `Your appointment #${appointment.appointmentNumber} has been cancelled. Any eligible refund will be credited within 3-5 business days.`,
      });

      return NextResponse.json({ message: "Appointment cancelled successfully", appointment: updated });
    }

    // Action 3: Reschedule Appointment
    if (action === "RESCHEDULE") {
      if (!newDate || !newStartTime) {
        return NextResponse.json({ error: "newDate and newStartTime are required to reschedule" }, { status: 400 });
      }

      const targetDate = new Date(`${newDate}T00:00:00.000Z`);
      const totalDuration = appointment.items.reduce((acc, curr) => acc + curr.durationMinutes, 0);
      const startM = timeStringToMinutes(newStartTime);
      const endM = startM + totalDuration;
      const newEndTime = minutesToTimeString(endM);

      // Check conflict for the stylist
      if (appointment.stylistId) {
        const conflict = await db.appointment.findFirst({
          where: {
            id: { not: appointment.id },
            stylistId: appointment.stylistId,
            date: targetDate,
            status: { in: ["PENDING", "CONFIRMED"] },
          },
        });

        if (conflict) {
          const cStart = timeStringToMinutes(conflict.startTime);
          const cEnd = timeStringToMinutes(conflict.endTime);
          if (startM < cEnd && cStart < endM) {
            return NextResponse.json(
              { error: "Slot Conflict", message: "This slot is unavailable for the assigned stylist." },
              { status: 409 }
            );
          }
        }
      }

      const updated = await db.appointment.update({
        where: { id: params.id },
        data: {
          date: targetDate,
          startTime: newStartTime,
          endTime: newEndTime,
          status: "CONFIRMED",
        },
      });

      await sendNotification({
        userId: appointment.userId,
        recipient: appointment.customerPhone,
        type: "APPOINTMENT_CONFIRMED",
        title: `Appointment #${appointment.appointmentNumber} Rescheduled`,
        message: `Your appointment #${appointment.appointmentNumber} has been rescheduled to ${newDate} at ${newStartTime}. We look forward to seeing you!`,
      });

      return NextResponse.json({ message: "Appointment rescheduled successfully", appointment: updated });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Update appointment error:", error);
    return NextResponse.json({ error: "Failed to update appointment", message: error.message }, { status: 500 });
  }
}
