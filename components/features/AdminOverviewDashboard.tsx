"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Users,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowUpRight,
  UserX,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";

export function AdminOverviewDashboard({
  metrics,
  todayAppointments,
  revenueTrendData,
  serviceChartData,
  lowStockItems,
}: {
  metrics: any;
  todayAppointments: any[];
  revenueTrendData: any[];
  serviceChartData: any[];
  lowStockItems: any[];
}) {
  const [appointments, setAppointments] = useState(todayAppointments);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Low Stock Alert Banner */}
      {lowStockItems.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-950 dark:text-amber-200">
                Low Stock Warning: {lowStockItems.length} Products Running Low
              </p>
              <p className="text-[11px] text-amber-800 dark:text-amber-300">
                {lowStockItems.map((i) => `${i.name} (${i.currentStock} left)`).join(", ")}
              </p>
            </div>
          </div>
          <Link
            href="/admin/inventory"
            className="px-3.5 py-1.5 rounded-full bg-amber-500 text-brand-ink text-xs font-bold hover:bg-amber-400 shrink-0"
          >
            Manage Inventory
          </Link>
        </div>
      )}

      {/* 2. Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#120822] border border-purple-100 dark:border-purple-900 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-brand-muted">
            <span className="text-xs font-semibold">Today&apos;s Bookings</span>
            <Calendar className="h-4 w-4 text-brand-violet" />
          </div>
          <p className="text-3xl font-black text-brand-ink dark:text-white font-heading">
            {metrics.todayCount}
          </p>
          <span className="text-[11px] text-brand-muted">Across all stylists</span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#120822] border border-purple-100 dark:border-purple-900 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-brand-muted">
            <span className="text-xs font-semibold">Total Revenue (INR)</span>
            <CreditCard className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-emerald-600 font-heading">
            ₹{metrics.totalRevenue.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] text-brand-muted">Lifetime receipts</span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#120822] border border-purple-100 dark:border-purple-900 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-brand-muted">
            <span className="text-xs font-semibold">Registered Clients</span>
            <Users className="h-4 w-4 text-brand-royal" />
          </div>
          <p className="text-3xl font-black text-brand-ink dark:text-white font-heading">
            {metrics.totalCustomers}
          </p>
          <span className="text-[11px] text-brand-muted">With beauty profiles</span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#120822] border border-purple-100 dark:border-purple-900 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-brand-muted">
            <span className="text-xs font-semibold">No-Show Incidents</span>
            <UserX className="h-4 w-4 text-red-500" />
          </div>
          <p className="text-3xl font-black text-red-500 font-heading">
            {metrics.noShows}
          </p>
          <span className="text-[11px] text-brand-muted">Monitored for deposit policy</span>
        </div>
      </div>

      {/* 3. Recharts Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 7-Day Revenue Area Chart */}
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#120822] p-6 border border-purple-100 dark:border-purple-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-xl font-bold text-brand-ink dark:text-white">
                Revenue Trajectory (Past 7 Days)
              </h3>
              <p className="text-xs text-brand-muted">Daily collected revenue in INR</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData}>
                <defs>
                  <linearGradient id="purpleRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stop-color="#7C3AED" stop-opacity={0.4} />
                    <stop offset="95%" stop-color="#7C3AED" stop-opacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`₹${val}`, "Revenue"]}
                  contentStyle={{ backgroundColor: "#1A102F", color: "#FFF", borderRadius: "12px" }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#7C3AED"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#purpleRevGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Booked Services Bar Chart */}
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-[#120822] p-6 border border-purple-100 dark:border-purple-900 shadow-sm space-y-4">
          <div>
            <h3 className="font-heading text-xl font-bold text-brand-ink dark:text-white">
              Top Booked Services
            </h3>
            <p className="text-xs text-brand-muted">Popularity across appointments</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(val: any) => [val, "Bookings"]}
                  contentStyle={{ backgroundColor: "#1A102F", color: "#FFF", borderRadius: "12px" }}
                />
                <Bar dataKey="bookings" fill="#6D28D9" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Today's Appointment Feed with Quick Action Status Buttons */}
      <div className="rounded-3xl bg-white dark:bg-[#120822] p-6 border border-purple-100 dark:border-purple-900 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-xl font-bold text-brand-ink dark:text-white">
              Today&apos;s Appointments Stream
            </h3>
            <p className="text-xs text-brand-muted">
              Live updates with drag-free 1-click status actions
            </p>
          </div>
          <Link
            href="/admin/calendar"
            className="text-xs font-bold text-brand-royal dark:text-brand-orchid hover:underline flex items-center gap-1"
          >
            <span>Open Calendar View</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {appointments.length === 0 ? (
          <p className="text-xs text-brand-muted py-8 text-center italic">
            No bookings scheduled for today.
          </p>
        ) : (
          <div className="divide-y divide-purple-100 dark:divide-purple-900 overflow-x-auto">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-brand-royal dark:text-brand-orchid">
                      #{appt.appointmentNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        appt.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-800"
                          : appt.status === "CONFIRMED"
                          ? "bg-purple-100 text-brand-royal"
                          : appt.status === "CANCELLED"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {appt.status}
                    </span>
                  </div>
                  <p className="font-bold text-brand-ink dark:text-white text-sm">
                    {appt.customerName} ({appt.customerPhone})
                  </p>
                  <p className="text-brand-muted">
                    Time: <strong>{appt.startTime} – {appt.endTime}</strong> • Stylist: {appt.stylist?.name || "Unassigned"}
                  </p>
                  <p className="text-brand-muted">
                    Services: {appt.items.map((i: any) => i.name).join(", ")} • Total: ₹{appt.totalAmount}
                  </p>
                </div>

                {/* Quick Status Change Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    disabled={updatingId === appt.id}
                    onClick={() => handleUpdateStatus(appt.id, "CONFIRMED")}
                    className="px-3 py-1.5 rounded-lg border border-purple-200 text-brand-deep hover:bg-purple-50 text-[11px] font-semibold"
                  >
                    Confirm
                  </button>
                  <button
                    disabled={updatingId === appt.id}
                    onClick={() => handleUpdateStatus(appt.id, "COMPLETED")}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-[11px] font-semibold"
                  >
                    Complete
                  </button>
                  <button
                    disabled={updatingId === appt.id}
                    onClick={() => handleUpdateStatus(appt.id, "NO_SHOW")}
                    className="px-3 py-1.5 rounded-lg border border-amber-300 text-amber-800 hover:bg-amber-50 text-[11px] font-semibold"
                  >
                    No-Show
                  </button>
                  <button
                    disabled={updatingId === appt.id}
                    onClick={() => handleUpdateStatus(appt.id, "CANCELLED")}
                    className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-[11px] font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
