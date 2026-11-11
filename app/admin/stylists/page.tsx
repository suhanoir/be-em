import React from "react";
import { db } from "@/lib/db";
import { AdminStylistsView } from "@/components/features/AdminStylistsView";

export default async function AdminStylistsPage() {
  const stylists = await db.stylist.findMany({
    include: {
      schedules: { orderBy: { dayOfWeek: "asc" } },
      _count: { select: { appointments: true, reviews: true } },
    },
    orderBy: { experienceYears: "desc" },
  });

  return (
    <div className="space-y-6">
      <AdminStylistsView initialStylists={stylists} />
    </div>
  );
}
