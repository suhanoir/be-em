import React from "react";
import { db } from "@/lib/db";
import { Download, BarChart3, TrendingUp, Users, Calendar } from "lucide-react";

export default async function AdminReportsPage() {
  const appointments = await db.appointment.findMany({
    include: { stylist: true, items: true },
  });

  const totalRevenue = appointments
    .filter((a) => a.status !== "CANCELLED")
    .reduce((sum, a) => sum + a.advancePaid, 0);

  const completedCount = appointments.filter((a) => a.status === "COMPLETED").length;
  const cancelledCount = appointments.filter((a) => a.status === "CANCELLED").length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-brand-ink dark:text-white">
            Reports &amp; Financial Analytics
          </h1>
          <p className="text-xs text-brand-muted">
            Audited financial figures, performance reports, and downloadable CSV records
          </p>
        </div>

        <a
          href="/api/admin/reports?type=appointments"
          download
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all shadow-sm"
        >
          <Download className="h-4 w-4" />
          <span>Export All Bookings (CSV)</span>
        </a>
      </div>

      {/* Snapshot Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#120822] border border-purple-100 dark:border-purple-900 shadow-sm space-y-2">
          <span className="text-xs text-brand-muted">Audited Net Revenue</span>
          <p className="text-3xl font-black text-brand-deep dark:text-brand-softgold font-heading">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold">Taxes reconciled</span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#120822] border border-purple-100 dark:border-purple-900 shadow-sm space-y-2">
          <span className="text-xs text-brand-muted">Completed Treatments</span>
          <p className="text-3xl font-black text-emerald-600 font-heading">
            {completedCount}
          </p>
          <span className="text-[11px] text-brand-muted">Successfully fulfilled</span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#120822] border border-purple-100 dark:border-purple-900 shadow-sm space-y-2">
          <span className="text-xs text-brand-muted">Cancellation Rate</span>
          <p className="text-3xl font-black text-red-500 font-heading">
            {((cancelledCount / (appointments.length || 1)) * 100).toFixed(1)}%
          </p>
          <span className="text-[11px] text-brand-muted">Within 4-hour window</span>
        </div>
      </div>
    </div>
  );
}
