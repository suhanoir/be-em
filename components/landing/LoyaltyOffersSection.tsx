"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  Gift,
  Crown,
  Percent,
  Copy,
  Check,
  Award,
  ArrowRight,
} from "lucide-react";
import { LANDING_CONTENT } from "@/lib/landing-content";

export function LoyaltyOffersSection() {
  const loyalty = LANDING_CONTENT.loyaltyAndOffers;
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section
      id="offers"
      aria-label="Loyalty Program and Active Festival Offers"
      className="py-16 sm:py-24 bg-white dark:bg-[#0F081D]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-lavender text-brand-deep text-xs font-semibold uppercase tracking-wider dark:bg-purple-950 dark:text-purple-200">
            <Crown className="w-3.5 h-3.5 text-brand-softgold" />
            <span>{loyalty.badge}</span>
          </div>

          <h2 className="text-fluid-section font-heading font-bold text-brand-ink dark:text-white tracking-tight">
            {loyalty.title}
          </h2>

          <p className="text-base sm:text-lg text-brand-muted">
            {loyalty.pointsSummary}
          </p>
        </div>

        {/* 2-Column Showcase: Loyalty Card + Festival Promo Codes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          {/* Left: Interactive Royal Loyalty Card Visual */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="relative w-full max-w-md aspect-[1.58/1] rounded-3xl p-6 sm:p-8 bg-gradient-to-tr from-[#2E1065] via-brand-deep to-[#1E1035] text-white shadow-2xl border border-purple-500/30 flex flex-col justify-between overflow-hidden">
              {/* Shimmering Gold Watermark */}
              <div className="absolute right-4 top-4 opacity-10 pointer-events-none">
                <Crown className="w-48 h-48 text-brand-softgold" />
              </div>

              {/* Card Header */}
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <span className="font-script text-3xl sm:text-4xl text-brand-softgold font-bold">
                    BEEM
                  </span>
                  <p className="text-[10px] uppercase tracking-widest text-purple-200">
                    Royalty Circle VIP
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-amber-300 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>VIP Tier</span>
                </div>
              </div>

              {/* Progress Bar: Points filling up */}
              <div className="relative z-10 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Current Loyalty Points</span>
                  <span className="text-amber-300 font-bold">420 / 500 Pts</span>
                </div>
                <div className="w-full h-3 rounded-full bg-white/20 overflow-hidden p-0.5">
                  <motion.div
                    initial={shouldReduceMotion ? { width: "84%" } : { width: "0%" }}
                    whileInView={{ width: "84%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-brand-softgold shadow-sm"
                  />
                </div>
                <p className="text-[11px] text-purple-200">
                  Only 80 points to your next ₹500 instant treatment deduction!
                </p>
              </div>

              {/* Card Footer: 10th Visit Highlight */}
              <div className="relative z-10 pt-3 border-t border-white/15 flex items-center justify-between text-xs">
                <span className="text-purple-200">Visit 9 of 10 Completed</span>
                <span className="text-amber-300 font-bold flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  <span>Next Visit Free Spa!</span>
                </span>
              </div>
            </div>

            {/* Sub-label */}
            <p className="text-xs text-brand-muted text-center mt-3 max-w-sm">
              {loyalty.tenthVisitBenefit}
            </p>
          </div>

          {/* Right: Active Festival Promo Code Coupons */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="font-heading font-bold text-2xl text-brand-ink dark:text-white mb-2">
              Active Celebration Offers
            </h3>
            <p className="text-xs sm:text-sm text-brand-muted mb-4">
              Click any code to copy directly to your clipboard and apply at checkout for instant discounts.
            </p>

            <div className="space-y-3">
              {loyalty.activeFestivalOffers.map((offer) => {
                const isCopied = copiedCode === offer.code;

                return (
                  <div
                    key={offer.code}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-purple-50/60 dark:bg-[#1A102F] border border-purple-200/80 dark:border-purple-900/60 gap-3 hover:border-brand-violet transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-brand-royal text-white">
                          {offer.code}
                        </span>
                        <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                          {offer.discount}
                        </span>
                      </div>
                      <p className="text-xs text-brand-muted">{offer.desc}</p>
                    </div>

                    <button
                      onClick={() => handleCopy(offer.code)}
                      className={`flex-shrink-0 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                        isCopied
                          ? "bg-emerald-600 text-white"
                          : "bg-white dark:bg-purple-950 text-brand-deep dark:text-purple-200 border border-purple-200 dark:border-purple-800 hover:bg-brand-lavender"
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Link to Memberships and Gift Cards */}
            <div className="pt-2">
              <Link
                href="/memberships"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-royal hover:text-brand-violet dark:text-brand-orchid dark:hover:text-white transition-colors group"
              >
                <span>View Annual Memberships & Luxury Gift Cards</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
