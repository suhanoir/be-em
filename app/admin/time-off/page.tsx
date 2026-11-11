import React from "react";
import { db } from "@/lib/db";
import { AdminTimeOffView } from "@/components/features/AdminTimeOffView";

export default async function AdminTimeOffPage() {
  const timeOffs = await db.timeOff.findMany({
    include: { stylist: true },
    orderBy: { startDate: "desc" },
  });

  const stylists = await db.stylist.findMany({
    where: { isActive: true },
  });

  return (
    <div className="space-y-6">
      <AdminTimeOffView initialTimeOffs={timeOffs} stylists={stylists} />
    </div>
  );
}
