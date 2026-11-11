import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { adminPaymentVerifySchema } from "@/lib/validators";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    const adminEmail = session?.user?.email || "admin@beem.luxury";

    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const body = await req.json();
    const parsed = adminPaymentVerifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid verification action", details: parsed.error }, { status: 400 });
    }

    const { action, rejectionReason } = parsed.data;

    const payment = await db.payment.findUnique({
      where: { id: params.id },
      include: { appointment: true },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
    }

    const now = new Date();

    const updated = await db.$transaction(async (tx) => {
      if (action === "CONFIRM") {
        const updatedPayment = await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: "CONFIRMED",
            verifiedAt: now,
            verifiedBy: adminEmail,
            rejectionReason: null,
          },
        });

        // Compute balances
        const currentAdvance = payment.appointment.advancePaid + payment.amount;
        const newBalance = Math.max(0, payment.appointment.totalAmount - currentAdvance);
        const newPaymentStatus = newBalance === 0 ? "COMPLETED" : "PARTIAL";

        const updatedAppointment = await tx.appointment.update({
          where: { id: payment.appointmentId },
          data: {
            status: "CONFIRMED",
            advancePaid: currentAdvance,
            balanceDue: newBalance,
            paymentStatus: newPaymentStatus,
          },
        });

        // Update invoice if exists
        await tx.invoice.updateMany({
          where: { appointmentId: payment.appointmentId },
          data: {
            status: newBalance === 0 ? "PAID" : "UNPAID",
          },
        });

        // Audit Log
        await tx.auditLog.create({
          data: {
            action: "PAYMENT_CONFIRM",
            entityType: "PAYMENT",
            entityId: payment.id,
            performedBy: adminEmail,
            details: JSON.stringify({
              appointmentNumber: payment.appointment.appointmentNumber,
              amount: payment.amount,
              utrNumber: payment.utrNumber,
              verifiedBy: adminEmail,
            }),
          },
        });

        return { payment: updatedPayment, appointment: updatedAppointment };
      } else {
        // REJECT
        const updatedPayment = await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: "REJECTED",
            rejectionReason: rejectionReason || "UTR verification failed or amount mismatch.",
            verifiedAt: now,
            verifiedBy: adminEmail,
          },
        });

        const updatedAppointment = await tx.appointment.update({
          where: { id: payment.appointmentId },
          data: {
            status: "PENDING_PAYMENT",
          },
        });

        // Audit Log
        await tx.auditLog.create({
          data: {
            action: "PAYMENT_REJECT",
            entityType: "PAYMENT",
            entityId: payment.id,
            performedBy: adminEmail,
            details: JSON.stringify({
              appointmentNumber: payment.appointment.appointmentNumber,
              amount: payment.amount,
              utrNumber: payment.utrNumber,
              reason: rejectionReason,
              verifiedBy: adminEmail,
            }),
          },
        });

        return { payment: updatedPayment, appointment: updatedAppointment };
      }
    });

    return NextResponse.json({
      success: true,
      message: action === "CONFIRM" ? "Payment verified and appointment confirmed!" : "Payment rejected.",
      data: updated,
    });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment", message: error.message },
      { status: 500 }
    );
  }
}
