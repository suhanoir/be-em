"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Scissors,
  Palette,
  Crown,
  Feather,
  Sparkles,
  Hand,
  Flame,
  HeartPulse,
  ArrowRight,
  Clock,
  ChevronRight,
} from "lucide-react";
import { LANDING_CONTENT, LandingCategory } from "@/lib/landing-content";

// Map string icon names to Lucide components
const iconMap: Record<string, React.ElementType> = {
  Scissors,
  Palette,
  Crown,
  Feather,
  Sparkles,
  Hand,
  Flame,
  HeartPulse,
};

export function ServicesShowcase() {
  const categories = LANDING_CONTENT.servicesCategories;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="services"
      aria-label="Our Luxury Services"
      className="py-16 sm:py-24 bg-[#FAF5FF] dark:bg-[#140B24] transition-colors"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-lavender text-brand-deep text-xs font-semibold uppercase tracking-wider dark:bg-purple-950 dark:text-purple-200">
              <Sparkles className="w-3.5 h-3.5 text-brand-softgold" />
              <span>Tailored Menu</span>
            </div>
            <h2 className="text-fluid-section font-heading font-bold text-brand-ink dark:text-white tracking-tight">
              Bespoke Beauty Treatments
            </h2>
            <p className="text-base sm:text-lg text-brand-muted">
              Every appointment is a curated ritual with certified master artists, cruelty-free formulas, and transparent pricing.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-royal hover:text-brand-violet dark:text-brand-orchid dark:hover:text-white transition-colors group self-start md:self-auto"
          >
            <span>View Full Service Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Mobile Horizontal Snap-Carousel + Desktop Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat, index) => {
            const Icon = iconMap[cat.iconName] || Sparkles;

            return (
              <motion.div
                key={cat.id}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  delay: shouldReduceMotion ? 0 : 0.05 * index,
                  duration: 0.5,
                }}
                className="group relative flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-[#1A102F] border border-purple-100/80 dark:border-purple-900/60 shadow-soft hover:shadow-glow hover:-translate-y-1.5 active:scale-[0.98] transition-all duration-300"
              >
                {/* Top Badge & Icon */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-lavender text-brand-royal dark:bg-purple-950/80 dark:text-brand-orchid flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>

                    {cat.tag && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-purple-50 text-brand-royal border border-purple-200/60 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-800">
                        {cat.tag}
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading font-bold text-xl text-brand-ink dark:text-white mb-2 group-hover:text-brand-royal dark:group-hover:text-brand-orchid transition-colors">
                    {cat.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-brand-muted leading-relaxed mb-6">
                    {cat.shortDesc}
                  </p>
                </div>

                {/* Bottom Duration, Price, and Booking Link */}
                <div className="pt-4 border-t border-purple-50 dark:border-purple-900/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-brand-muted block">
                      Starting from
                    </span>
                    <span className="font-heading font-bold text-lg text-brand-ink dark:text-white">
                      ₹{cat.priceStarting.toLocaleString()}
                    </span>
                  </div>

                  <Link
                    href={`/book?category=${cat.id}`}
                    aria-label={`Book ${cat.name}`}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-lavender/60 hover:bg-brand-royal hover:text-white text-xs font-semibold text-brand-deep dark:bg-purple-950/60 dark:text-purple-200 dark:hover:bg-brand-royal dark:hover:text-white transition-all shadow-sm"
                  >
                    <span>Book</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
