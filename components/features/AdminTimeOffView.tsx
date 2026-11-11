"use client";

import React, { useState } from "react";
import { Calendar, Plus, Trash2, CheckCircle2, ShieldAlert } from "lucide-react";
import { formatInKolkata } from "@/lib/timezone";

export function AdminTimeOffView({
  initialTimeOffs,
  stylists,
}: {
  initialTimeOffs: any[];
  stylists: any[];
}) {
  const [timeOffs, setTimeOffs] = useState(initialTimeOffs);
  const [showModal, setShowModal] = useState(false);

  const [stylistId, setStylistId] = useState<string>("all");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [reason, setReason] = useState("");
  const [type, setType] = useState("HOLIDAY");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBlockDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/time-off", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stylistId: stylistId === "all" ? null : stylistId,
          startDate,
          endDate,
          reason,
          type,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setTimeOffs([data.timeOff, ...timeOffs]);
        setShowModal(false);
        setReason("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-brand-ink dark:text-white">
            Time-Off, Holidays &amp; Date Blocking
          </h1>
          <p className="text-xs text-brand-muted">
            Block specific stylist leave dates or mark salon-wide festive closures
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-violet text-white text-xs font-bold hover:bg-brand-royal transition-all shadow-soft"
        >
          <Plus className="h-4 w-4" />
          <span>Block Dates / Holiday</span>
        </button>
      </div>

      {/* List */}
      <div className="rounded-3xl bg-white dark:bg-[#120822] border border-purple-100 dark:border-purple-900 shadow-sm overflow-hidden">
        {timeOffs.length === 0 ? (
          <p className="text-xs text-brand-muted p-8 text-center italic">
            No active blocked dates or holidays recorded.
          </p>
        ) : (
          <div className="divide-y divide-purple-100 dark:divide-purple-900">
            {timeOffs.map((to) => (
              <div key={to.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-brand-ink dark:text-white text-sm">{to.reason}</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-brand-deep font-bold text-[10px]">
                      {to.type}
                    </span>
                  </div>
                  <p className="text-brand-muted mt-0.5">
                    Target: <strong>{to.stylist?.name || "Salon-Wide (All Stylists)"}</strong>
                  </p>
                  <p className="text-[11px] text-brand-royal dark:text-brand-orchid mt-0.5">
                    {formatInKolkata(to.startDate, "MMM dd, yyyy")} to {formatInKolkata(to.endDate, "MMM dd, yyyy")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="rounded-3xl bg-white dark:bg-[#1A102F] p-6 max-w-md w-full border border-purple-200 dark:border-purple-800 shadow-2xl space-y-4">
            <h3 className="font-heading text-2xl font-bold text-brand-ink dark:text-white">
              Block Dates / Add Holiday
            </h3>

            <form onSubmit={handleBlockDate} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-brand-muted">Target Scope</label>
                <select
                  value={stylistId}
                  onChange={(e) => setStylistId(e.target.value)}
                  className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
                >
                  <option value="all">Salon-Wide Holiday (All Stylists)</option>
                  {stylists.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} (Individual Leave)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-brand-muted">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-brand-muted">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-brand-muted">Reason / Holiday Name *</label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Diwali Salon Break or Annual Conference"
                  className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-full border border-purple-200 text-brand-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-full bg-brand-violet text-white font-bold hover:bg-brand-royal"
                >
                  {isSubmitting ? "Saving..." : "Confirm Block"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
