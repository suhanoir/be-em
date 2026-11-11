"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, MapPin, Calculator, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { calculateDistanceSurcharge } from "@/lib/pricing";

interface BridalPkg {
  id: string;
  name: string;
  price: number;
  advanceDeposit: number;
}

export function BridalPlannerInteractive({ packages }: { packages: BridalPkg[] }) {
  const [selectedPkgId, setSelectedPkgId] = useState(packages[1]?.id || packages[0]?.id || "");
  const [groupSize, setGroupSize] = useState(1);
  const [isHomeVisit, setIsHomeVisit] = useState(false);
  const [distanceKm, setDistanceKm] = useState(8);

  const selectedPkg = packages.find((p) => p.id === selectedPkgId) || packages[0];
  const basePrice = selectedPkg?.price || 29999;

  // Add ₹3,500 per additional entourage guest
  const entourageAdditional = Math.max(0, groupSize - 1) * 3500;
  const rawSubtotal = basePrice + entourageAdditional;

  // 10% entourage discount if 3 or more people
  const entourageDiscount = groupSize >= 3 ? Math.round(rawSubtotal * 0.1) : 0;

  // Distance surcharge
  const travelSurcharge = isHomeVisit ? calculateDistanceSurcharge(distanceKm) : 0;

  const totalEstimate = rawSubtotal - entourageDiscount + travelSurcharge;
  const depositRequired = selectedPkg?.advanceDeposit || 10000;

  return (
    <div className="rounded-3xl bg-gradient-to-br from-amber-50/50 via-purple-50/30 to-pink-50/40 p-8 sm:p-12 border border-amber-200/80 dark:bg-[#1A102F] dark:border-purple-800 shadow-xl">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-200/60 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-xs font-bold mb-2">
          <Calculator className="h-3.5 w-3.5" />
          <span>Bridal Concierge Cost Estimator</span>
        </div>
        <h3 className="font-heading text-3xl sm:text-4xl font-bold text-brand-ink dark:text-white">
          Plan Your Wedding Party & Travel
        </h3>
        <p className="text-xs sm:text-sm text-brand-muted mt-2">
          Customize your bridal entourage and calculate distance travel to your wedding resort or banquet hall.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Select Package */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink dark:text-white mb-2">
              1. Choose Bridal Suite:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPkgId(pkg.id)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    selectedPkgId === pkg.id
                      ? "border-amber-500 bg-amber-100/60 dark:bg-amber-950/60 shadow-sm"
                      : "border-purple-200 dark:border-purple-900 bg-white dark:bg-[#150D27]"
                  }`}
                >
                  <p className="text-xs font-bold text-brand-ink dark:text-white">{pkg.name}</p>
                  <p className="text-sm font-bold text-brand-deep dark:text-brand-softgold mt-1">
                    ₹{pkg.price.toLocaleString("en-IN")}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Entourage Size */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-ink dark:text-white flex items-center gap-1.5">
                <Users className="h-4 w-4 text-brand-violet" />
                2. Bridal Entourage Size (Bride + Guests):
              </label>
              <span className="text-sm font-bold text-brand-royal dark:text-brand-orchid">
                {groupSize} {groupSize === 1 ? "Person (Bride Only)" : "People"}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              value={groupSize}
              onChange={(e) => setGroupSize(parseInt(e.target.value, 10))}
              className="w-full accent-brand-violet cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-brand-muted mt-1">
              <span>1 Bride</span>
              <span>3+ Guests (10% Entourage Discount)</span>
              <span>8 Max VIP</span>
            </div>
          </div>

          {/* Venue Travel Toggle */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#150D27] border border-purple-200 dark:border-purple-900 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-brand-ink dark:text-white flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-brand-violet" />
                  Venue / Home Visit Travel
                </p>
                <p className="text-xs text-brand-muted">
                  BEEM master artists travel directly to your hotel or wedding venue.
                </p>
              </div>
              <input
                type="checkbox"
                checked={isHomeVisit}
                onChange={(e) => setIsHomeVisit(e.target.checked)}
                className="h-5 w-5 accent-brand-violet rounded cursor-pointer"
              />
            </div>

            {isHomeVisit && (
              <div className="pt-3 border-t border-purple-100 dark:border-purple-900 space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-brand-muted">Approx Distance from Indiranagar:</span>
                  <span className="font-bold text-brand-deep dark:text-brand-softgold">
                    {distanceKm} km
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(parseInt(e.target.value, 10))}
                  className="w-full accent-brand-violet cursor-pointer"
                />
                <p className="text-[11px] text-brand-muted">
                  Distance tiers: 0-5km (₹500), 5-15km (₹1,200), 15-30km (₹2,500), 30-50km (₹4,500).
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Live Estimate Card */}
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-[#150D27] p-6 border border-amber-300 dark:border-amber-800 shadow-xl space-y-4">
          <h4 className="font-heading text-xl font-bold text-brand-ink dark:text-white pb-2 border-b border-purple-100 dark:border-purple-900">
            Estimated Investment
          </h4>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-brand-muted">{selectedPkg?.name}:</span>
              <span className="font-semibold text-brand-ink dark:text-white">
                ₹{basePrice.toLocaleString("en-IN")}
              </span>
            </div>

            {groupSize > 1 && (
              <div className="flex justify-between">
                <span className="text-brand-muted">{groupSize - 1} Additional Guest Makeovers:</span>
                <span className="font-semibold text-brand-ink dark:text-white">
                  +₹{entourageAdditional.toLocaleString("en-IN")}
                </span>
              </div>
            )}

            {entourageDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Entourage Group Discount (10%):</span>
                <span>-₹{entourageDiscount.toLocaleString("en-IN")}</span>
              </div>
            )}

            {isHomeVisit && (
              <div className="flex justify-between">
                <span className="text-brand-muted">On-Venue Travel Surcharge ({distanceKm} km):</span>
                <span className="font-semibold text-brand-ink dark:text-white">
                  +₹{travelSurcharge.toLocaleString("en-IN")}
                </span>
              </div>
            )}

            <div className="pt-3 border-t border-purple-100 dark:border-purple-900 flex justify-between items-baseline">
              <span className="text-sm font-bold text-brand-ink dark:text-white">Total Estimate:</span>
              <span className="text-2xl font-black text-brand-deep dark:text-brand-softgold">
                ₹{totalEstimate.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-[11px] text-amber-900 dark:text-amber-200">
              <p className="font-bold">Date Hold Advance: ₹{depositRequired.toLocaleString("en-IN")}</p>
              <p className="mt-0.5">Locks your wedding date exclusively. Remaining balance payable at service.</p>
            </div>
          </div>

          <Link
            href={`/book?bridal=${selectedPkg.id}&groupSize=${groupSize}&homeVisit=${isHomeVisit ? "1" : "0"}&distance=${distanceKm}`}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-brand-ink font-bold text-sm shadow-gold hover:scale-[1.02] transition-all"
          >
            <span>Proceed to Lock Date</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
