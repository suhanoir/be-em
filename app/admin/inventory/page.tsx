import React from "react";
import { db } from "@/lib/db";
import { AdminInventoryView } from "@/components/features/AdminInventoryView";

export default async function AdminInventoryPage() {
  const items = await db.inventoryItem.findMany({
    orderBy: { currentStock: "asc" },
  });

  return (
    <div className="space-y-6">
      <AdminInventoryView initialItems={items} />
    </div>
  );
}
