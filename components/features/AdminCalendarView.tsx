"use client";

import React, { useState } from "react";
import { formatInKolkata } from "@/lib/timezone";
import { Calendar as CalendarIcon, Clock, Check, X, CheckCircle2, User, ChevronLeft, ChevronRight } from "lucide-react";

export function AdminCalendarView({
  stylists,
  initialAppointments,
}: {
  stylists: any[];
  initialAppointments: any[];
}) {
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [selectedStylist, setSelectedStylist] = useState<string>("all");
  const [appointments, setAppointments] = useState(initialAppointments);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setAppointments((prev: any[]) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDateChange = (daysDelta: number) => {
    const current = new Date(`${selectedDateStr}T00:00:00.000Z`);
    current.setDate(current.getDate() + daysDelta);
    setSelectedDateStr(current.toISOString().split("T")[0]);
  };

  const dayAppointments = appointments.filter((a: any) => {
    const dStr = formatInKolkata(a.date, "yyyy-MM-dd");
    const matchesDate = dStr === selectedDateStr;
    const matchesStylist = selectedStylist === "all" || a.stylistId === selectedStylist;
    return matchesDate && matchesStylist;
  });

  const hours = [
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
  ];

  return (
    <div className="space-y-6">
      {/* Date Navigation & Stylist Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-[#120822] border border-purple-100 dark:border-purple-900 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDateChange(-1)}
            aria-label="Previous day"
            className="p-2 rounded-xl border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950 text-brand-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-[#FAF7FD] dark:bg-purple-950/40">
            <CalendarIcon className="h-4 w-4 text-brand-violet" />
            <input
              type="date"
              value={selectedDateStr}
              onChange={(e) => setSelectedDateStr(e.target.value)}
              className="bg-transparent text-xs font-bold text-brand-ink dark:text-white focus:outline-none"
            />
          </div>
          <button
            onClick={() => handleDateChange(1)}
            aria-label="Next day"
            className="p-2 rounded-xl border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950 text-brand-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Stylist Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-brand-muted">Artisan Filter:</span>
          <select
            value={selectedStylist}
            onChange={(e) => setSelectedStylist(e.target.value)}
            className="rounded-full border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120822] px-4 py-2 text-xs font-semibold text-brand-ink dark:text-white focus:outline-none"
          >
            <option value="all">All Artisans ({stylists.length})</option>
            {stylists.map((st) => (
              <option key={st.id} value={st.id}>
                {st.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline Schedule Grid */}
      <div className="rounded-3xl bg-white dark:bg-[#120822] border border-purple-100 dark:border-purple-900 shadow-sm divide-y divide-purple-100 dark:divide-purple-900 overflow-hidden">
        {hours.map((hour) => {
          const matchingAppts = dayAppointments.filter((a: any) => {
            const startHour = a.startTime.split(":")[0];
            const currentHour = hour.split(":")[0];
            return startHour === currentHour;
          });

          return (
            <div key={hour} className="p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-start">
              {/* Hour Label */}
              <div className="w-24 shrink-0 font-mono text-xs font-bold text-brand-royal dark:text-brand-orchid pt-1">
                {hour} IST
              </div>

              {/* Slots/Bookings Container */}
              <div className="flex-1 w-full space-y-3">
                {matchingAppts.length === 0 ? (
                  <div className="text-[11px] text-brand-muted/70 italic py-1">
                    Slot Available
                  </div>
                ) : (
                  matchingAppts.map((appt: any) => (
                    <div
                      key={appt.id}
                      className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-brand-ink dark:text-white text-sm">
                            {appt.customerName}
                          </span>
                          <span className="font-mono text-[10px] text-brand-muted">
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
                        <p className="text-brand-muted mt-0.5">
                          {appt.startTime} – {appt.endTime} • Stylist: <strong>{appt.stylist?.name || "Unassigned"}</strong>
                        </p>
                        <p className="text-[11px] text-brand-royal dark:text-brand-orchid mt-0.5">
                          {appt.items.map((i: any) => i.name).join(", ")} (₹{appt.totalAmount})
                        </p>
                      </div>

                      {/* Quick Action Status Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleUpdateStatus(appt.id, "CONFIRMED")}
                          className="px-2.5 py-1 rounded-md border border-purple-300 text-brand-deep hover:bg-purple-100 text-[10px] font-semibold"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(appt.id, "COMPLETED")}
                          className="px-2.5 py-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 text-[10px] font-semibold"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(appt.id, "NO_SHOW")}
                          className="px-2.5 py-1 rounded-md border border-amber-300 text-amber-800 text-[10px] font-semibold"
                        >
                          No-Show
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(appt.id, "CANCELLED")}
                          className="px-2.5 py-1 rounded-md border border-red-200 text-red-600 hover:bg-red-50 text-[10px] font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
