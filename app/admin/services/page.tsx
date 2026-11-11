import React from "react";
import { db } from "@/lib/db";
import { AdminServicesManager } from "@/components/features/AdminServicesManager";

export default async function AdminServicesPage() {
  const services = await db.service.findMany({
    include: { category: true },
    orderBy: [{ categoryId: "asc" }, { price: "asc" }],
  });

  const categories = await db.serviceCategory.findMany({
    orderBy: { orderIndex: "asc" },
  });

  return (
    <div className="space-y-6">
      <AdminServicesManager initialServices={services} categories={categories} />
    </div>
  );
}
