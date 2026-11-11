import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminPaymentQueue } from "@/components/admin/AdminPaymentQueue";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Verify UPI & Salon Payments | BEEM Admin",
  description: "Check bank deposits, verify UPI transaction references (UTR), and approve bookings.",
};

export default async function AdminPaymentsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any)?.role !== "ADMIN") {
    redirect("/admin");
  }

  const payments = await db.payment.findMany({
    include: {
      appointment: {
        include: {
          items: true,
          stylist: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const serializedPayments = payments.map((p) => ({
    id: p.id,
    amount: p.amount,
    currency: p.currency,
    status: p.status,
    method: p.method,
    utrNumber: p.utrNumber,
    screenshotUrl: p.screenshotUrl,
    verifiedAt: p.verifiedAt ? p.verifiedAt.toISOString() : null,
    verifiedBy: p.verifiedBy,
    rejectionReason: p.rejectionReason,
    createdAt: p.createdAt.toISOString(),
    appointment: {
      id: p.appointment.id,
      appointmentNumber: p.appointment.appointmentNumber,
      customerName: p.appointment.customerName,
      customerPhone: p.appointment.customerPhone,
      customerEmail: p.appointment.customerEmail,
      totalAmount: p.appointment.totalAmount,
      advancePaid: p.appointment.advancePaid,
      balanceDue: p.appointment.balanceDue,
      status: p.appointment.status,
      items: p.appointment.items.map((it) => ({ name: it.name })),
    },
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-brand-ink dark:text-white">
            UPI &amp; Salon Payment Verification
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Check your bank/UPI merchant app against submitted UTR numbers and approve appointments with zero external fees.
          </p>
        </div>
      </div>

      <AdminPaymentQueue initialPayments={serializedPayments} />
    </div>
  );
}
