"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Crown,
  Sparkles,
  CheckCircle2,
  CalendarCheck,
  ShieldCheck,
  Users,
  MapPin,
  ArrowRight,
  Clock,
} from "lucide-react";
import { LANDING_CONTENT, BridalPackageItem } from "@/lib/landing-content";

export function BridalSpotlight() {
  const bridal = LANDING_CONTENT.bridalSpotlight;
  const packages = bridal.packages;
  const [activeTier, setActiveTier] = useState<string>("gold-bridal");
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="bridal"
      aria-label="Bridal Couture Makeover Section"
      className="relative py-16 sm:py-24 overflow-hidden bg-gradient-to-b from-white via-amber-50/20 to-white dark:from-[#0F081D] dark:via-[#1B1229] dark:to-[#0F081D]"
    >
      {/* Decorative Gold Accent Elements */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-200/20 blur-3xl pointer-events-none dark:bg-amber-950/10"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 right-0 w-80 h-80 rounded-full bg-purple-200/20 blur-3xl pointer-events-none dark:bg-purple-950/10"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/70 border border-amber-300/60 text-amber-900 text-xs font-semibold tracking-wide dark:bg-amber-950/70 dark:border-amber-800 dark:text-amber-200">
            <Crown className="w-3.5 h-3.5 text-brand-softgold" />
            <span>{bridal.badge}</span>
          </div>

          <h2 className="text-fluid-section font-heading font-bold text-brand-ink dark:text-white tracking-tight">
            {bridal.title}
          </h2>

          <p className="text-base sm:text-lg text-brand-muted">
            {bridal.subtitle}
          </p>

          {/* Wedding Date Lock & Trial Makeup Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-brand-ink dark:text-purple-200">
            <div className="flex items-center gap-1.5 font-medium bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-full border border-amber-200 dark:border-amber-800/60">
              <CalendarCheck className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>Wedding Date Exclusively Held on Advance</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium bg-purple-50 dark:bg-purple-950/40 px-3 py-1.5 rounded-full border border-purple-200 dark:border-purple-800/60">
              <Sparkles className="w-4 h-4 text-brand-royal dark:text-brand-orchid" />
              <span>Full Makeup & Hair Trial Included</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium bg-rose-50 dark:bg-rose-950/40 px-3 py-1.5 rounded-full border border-rose-200 dark:border-rose-800/60">
              <Users className="w-4 h-4 text-rose-700 dark:text-rose-400" />
              <span>10% Off Group Entourage (3+ Guests)</span>
            </div>
          </div>
        </div>

        {/* Packages Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch mb-12">
          {packages.map((pkg) => {
            const isPopular = pkg.popular;

            return (
              <div
                key={pkg.id}
                className={`relative flex flex-col justify-between p-6 sm:p-8 rounded-3xl transition-all duration-300 ${
                  isPopular
                    ? "bg-gradient-to-b from-purple-50 via-white to-amber-50/30 border-2 border-brand-softgold/80 shadow-glow dark:from-[#1E1138] dark:via-[#160D2C] dark:to-[#221035] dark:border-amber-600"
                    : "bg-white dark:bg-[#1A102F] border border-purple-100 dark:border-purple-900/60 shadow-soft hover:shadow-glow"
                }`}
              >
                {/* Popular Pill */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-brand-softgold text-amber-950 text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Most Chosen by Brides</span>
                  </div>
                )}

                <div>
                  <div className="mb-4">
                    <span className="text-xs uppercase tracking-widest text-brand-muted font-bold block mb-1">
                      {pkg.tier} Collection
                    </span>
                    <h3 className="font-heading font-bold text-2xl sm:text-3xl text-brand-ink dark:text-white">
                      {pkg.name}
                    </h3>
                  </div>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-heading font-bold text-3xl sm:text-4xl text-brand-royal dark:text-brand-orchid">
                      ₹{pkg.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-brand-muted">
                      • {pkg.durationMin} mins duration
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-brand-muted leading-relaxed mb-6">
                    {pkg.description}
                  </p>

                  <div className="space-y-3 mb-8">
                    <p className="text-xs uppercase font-bold tracking-wider text-brand-ink dark:text-white">
                      Included Ceremonies:
                    </p>
                    {pkg.inclusions.map((inc) => (
                      <div key={inc} className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-ink/90 dark:text-purple-100">
                        <CheckCircle2 className="w-4 h-4 text-brand-softgold flex-shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="pt-4 border-t border-purple-100/60 dark:border-purple-900/40 mb-4 text-[11px] text-brand-muted">
                    <span className="font-semibold text-brand-ink dark:text-white">Ideal for: </span>
                    {pkg.idealFor}
                  </div>

                  <Link
                    href={`/book?package=${pkg.id}`}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-semibold transition-all ${
                      isPopular
                        ? "bg-gradient-to-r from-brand-royal to-purple-600 text-white shadow-soft hover:shadow-glow hover:scale-105 active:scale-95"
                        : "bg-brand-lavender text-brand-deep hover:bg-brand-royal hover:text-white dark:bg-purple-950/60 dark:text-purple-200 dark:hover:bg-brand-royal dark:hover:text-white active:scale-95"
                    }`}
                  >
                    <span>Reserve Package</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Shimmering Bridal Consultation CTA Banner */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#2E1065] via-brand-deep to-[#1E1035] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-heading font-bold text-2xl sm:text-3xl text-brand-softgold">
              Need a Custom Bridal Consultation or Venue Quote?
            </h3>
            <p className="text-xs sm:text-sm text-purple-200 max-w-xl">
              Meet directly with Creative Director Ananya Sharma to discuss outfit palettes, Muhurtham timelines, and multi-day ceremonies.
            </p>
          </div>

          <Link
            href="/bridal"
            className="flex-shrink-0 flex items-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 via-brand-softgold to-amber-500 text-amber-950 font-bold text-sm shadow-gold hover:scale-105 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Book Bridal Consultation</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
