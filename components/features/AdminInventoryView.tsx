"use client";

import React, { useState } from "react";
import { Package, AlertTriangle, Plus, CheckCircle2 } from "lucide-react";

export function AdminInventoryView({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState(initialItems);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleRestock = async (id: string, qty: number) => {
    setLoadingId(id);
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, restockQuantity: qty }),
      });
      const data = await res.json();
      if (res.ok) {
        setItems((prev) => prev.map((it) => (it.id === id ? data.item : it)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-brand-ink dark:text-white">
          Product Inventory &amp; Stock Levels
        </h1>
        <p className="text-xs text-brand-muted">
          Track salon supplies (hair color tubes, wax tubs, serums, henna cones) with automatic threshold alerts
        </p>
      </div>

      <div className="rounded-3xl bg-white dark:bg-[#120822] border border-purple-100 dark:border-purple-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7FD] dark:bg-purple-950/40 text-[11px] font-bold uppercase tracking-wider text-brand-muted border-b border-purple-100 dark:border-purple-900">
              <tr>
                <th className="p-4">SKU / Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Current Stock</th>
                <th className="p-4">Unit Cost</th>
                <th className="p-4">Supplier</th>
                <th className="p-4 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100 dark:divide-purple-900">
              {items.map((it) => {
                const isLow = it.currentStock <= it.minStockAlert;

                return (
                  <tr key={it.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-brand-ink dark:text-white">{it.name}</p>
                      <p className="font-mono text-[10px] text-brand-muted">{it.sku}</p>
                    </td>
                    <td className="p-4 font-semibold text-brand-deep dark:text-brand-orchid">
                      {it.category}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold ${
                            isLow ? "text-red-600 text-sm" : "text-brand-ink dark:text-white"
                          }`}
                        >
                          {it.currentStock} {it.unit}
                        </span>
                        {isLow && (
                          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Low Stock
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-brand-ink dark:text-white">
                      ₹{it.costPrice}
                    </td>
                    <td className="p-4 text-brand-muted">{it.supplier || "Official Distributor"}</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        disabled={loadingId === it.id}
                        onClick={() => handleRestock(it.id, 5)}
                        className="px-2.5 py-1 rounded-lg border border-purple-200 text-brand-deep hover:bg-purple-50 text-[11px] font-semibold"
                      >
                        +5 Units
                      </button>
                      <button
                        disabled={loadingId === it.id}
                        onClick={() => handleRestock(it.id, 10)}
                        className="px-2.5 py-1 rounded-lg bg-brand-violet text-white hover:bg-brand-royal text-[11px] font-semibold"
                      >
                        +10 Units
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
