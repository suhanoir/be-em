import React from "react";
import { db } from "@/lib/db";
import { formatInKolkata } from "@/lib/timezone";
import { AdminCalendarView } from "@/components/features/AdminCalendarView";

export default async function AdminCalendarPage() {
  const stylists = await db.stylist.findMany({
    where: { isActive: true },
  });

  const appointments = await db.appointment.findMany({
    include: { stylist: true, items: true },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-brand-ink dark:text-white">
          Stylist Appointment Calendar
        </h1>
        <p className="text-xs text-brand-muted">
          Review daily schedules across stylists with real-time status actions
        </p>
      </div>

      <AdminCalendarView stylists={stylists} initialAppointments={appointments} />
    </div>
  );
}
