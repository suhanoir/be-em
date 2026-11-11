import React from "react";
import { db } from "@/lib/db";
import { Settings, Save, Clock, MapPin, Phone, Shield, Sparkles } from "lucide-react";

export default async function AdminSettingsPage() {
  const settingsList = await db.setting.findMany();
  const settingsMap = settingsList.reduce((acc: any, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {});

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-heading text-3xl font-bold text-brand-ink dark:text-white">
          Salon Sanctuary Settings &amp; Policies
        </h1>
        <p className="text-xs text-brand-muted">
          Configure operating hours, deposit percentages, cancellation windows, and distance travel surcharges
        </p>
      </div>

      <div className="rounded-3xl bg-white dark:bg-[#120822] p-8 border border-purple-100 dark:border-purple-900 shadow-sm space-y-6">
        <h2 className="font-heading text-xl font-bold text-brand-ink dark:text-white">
          Operating Hours &amp; Location
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-[11px] font-semibold text-brand-muted">Salon Opening Time (24h)</label>
            <input
              type="text"
              readOnly
              value={settingsMap["working_hours_open"] || "09:00"}
              className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 bg-gray-50 dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-brand-muted">Salon Closing Time (24h)</label>
            <input
              type="text"
              readOnly
              value={settingsMap["working_hours_close"] || "20:00"}
              className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 bg-gray-50 dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-[11px] font-semibold text-brand-muted">Sanctuary Address</label>
            <input
              type="text"
              readOnly
              value={settingsMap["salon_address"] || "Shop 12-14, Luxury Promenade, 100 Feet Road, Indiranagar, Bengaluru 560038"}
              className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 bg-gray-50 dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
            />
          </div>
        </div>

        <h2 className="font-heading text-xl font-bold text-brand-ink dark:text-white pt-4 border-t border-purple-100 dark:border-purple-900">
          Booking Policies &amp; Distance Tiers
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-[11px] font-semibold text-brand-muted">Standard Deposit %</label>
            <input
              type="text"
              readOnly
              value={`${settingsMap["deposit_percentage"] || "25"}%`}
              className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 bg-gray-50 dark:bg-[#150D27] dark:border-purple-800 dark:text-white font-bold"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-brand-muted">Bridal Date Hold Advance</label>
            <input
              type="text"
              readOnly
              value={`${settingsMap["bridal_deposit_percentage"] || "40"}%`}
              className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 bg-gray-50 dark:bg-[#150D27] dark:border-purple-800 dark:text-white font-bold text-brand-deep dark:text-brand-softgold"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-brand-muted">Cancellation Window</label>
            <input
              type="text"
              readOnly
              value={`${settingsMap["cancellation_window_hours"] || "4"} Hours`}
              className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 bg-gray-50 dark:bg-[#150D27] dark:border-purple-800 dark:text-white font-bold text-emerald-600"
            />
          </div>
        </div>

        {/* Distance Pricing Tiers */}
        <div className="pt-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-brand-muted block mb-2">
            Active Distance Tiers for Venue / Home Visits:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900">
              <p className="font-bold">0 – 5 km</p>
              <p className="text-brand-deep dark:text-brand-softgold font-semibold mt-0.5">₹500</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900">
              <p className="font-bold">5 – 15 km</p>
              <p className="text-brand-deep dark:text-brand-softgold font-semibold mt-0.5">₹1,200</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900">
              <p className="font-bold">15 – 30 km</p>
              <p className="text-brand-deep dark:text-brand-softgold font-semibold mt-0.5">₹2,500</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900">
              <p className="font-bold">30 – 50 km</p>
              <p className="text-brand-deep dark:text-brand-softgold font-semibold mt-0.5">₹4,500</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
