import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatInKolkata } from "@/lib/timezone";
import { Search, Filter, Clock, CheckCircle2, XCircle } from "lucide-react";

export default async function AdminAppointmentsPage() {
  const appointments = await db.appointment.findMany({
    include: { stylist: true, items: true, payments: true, invoice: true },
    orderBy: { date: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-brand-ink dark:text-white">
            All Appointments
          </h1>
          <p className="text-xs text-brand-muted">
            Total of {appointments.length} records in system
          </p>
        </div>
      </div>

      <div className="rounded-3xl bg-white dark:bg-[#120822] border border-purple-100 dark:border-purple-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7FD] dark:bg-purple-950/40 text-[11px] font-bold uppercase tracking-wider text-brand-muted border-b border-purple-100 dark:border-purple-900">
              <tr>
                <th className="p-4">Appt No</th>
                <th className="p-4">Date &amp; Time</th>
                <th className="p-4">Client</th>
                <th className="p-4">Stylist</th>
                <th className="p-4">Treatments</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100 dark:divide-purple-900">
              {appointments.map((a) => (
                <tr key={a.id} className="hover:bg-purple-50/40 dark:hover:bg-purple-950/20 transition-colors">
                  <td className="p-4 font-mono font-bold text-brand-royal dark:text-brand-orchid">
                    #{a.appointmentNumber}
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-brand-ink dark:text-white">
                      {formatInKolkata(a.date, "MMM dd, yyyy")}
                    </p>
                    <p className="text-[11px] text-brand-muted">{a.startTime} – {a.endTime}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-brand-ink dark:text-white">{a.customerName}</p>
                    <p className="text-[11px] text-brand-muted">{a.customerPhone}</p>
                  </td>
                  <td className="p-4 font-medium text-brand-ink dark:text-white">
                    {a.stylist?.name || "Unassigned"}
                  </td>
                  <td className="p-4 max-w-xs">
                    <p className="truncate text-brand-ink dark:text-purple-200">
                      {a.items.map((i) => i.name).join(", ")}
                    </p>
                  </td>
                  <td className="p-4 font-bold text-brand-deep dark:text-brand-orchid">
                    ₹{a.totalAmount.toLocaleString("en-IN")}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        a.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-800"
                          : a.status === "CONFIRMED"
                          ? "bg-purple-100 text-brand-royal"
                          : a.status === "CANCELLED"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/booking/confirmation/${a.id}`}
                      className="text-xs font-bold text-brand-violet hover:underline"
                    >
                      Invoice
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
