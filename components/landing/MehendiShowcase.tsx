"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Heart,
  Feather,
  Sparkles,
  Clock,
  ArrowRight,
  Bookmark,
  Check,
} from "lucide-react";
import { LANDING_CONTENT, MehendiItem } from "@/lib/landing-content";

export function MehendiShowcase() {
  const mehendiList = LANDING_CONTENT.mehendiStyles;
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});
  const shouldReduceMotion = useReducedMotion();

  const toggleSave = (id: string) => {
    setSavedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section
      id="mehendi"
      aria-label="Organic Henna and Mehendi Artistry"
      className="py-16 sm:py-24 bg-white dark:bg-[#0F081D] overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Animated Henna Vine SVG Divider */}
        <div className="flex justify-center mb-10 opacity-70">
          <svg
            className="w-48 sm:w-72 h-10 text-brand-softgold"
            viewBox="0 0 300 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <motion.path
              d="M10,20 Q40,5 75,20 T150,20 T225,20 T290,20"
              initial={shouldReduceMotion ? {} : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
            {/* Small floral buds */}
            <circle cx="75" cy="20" r="3" fill="currentColor" />
            <circle cx="150" cy="20" r="3" fill="currentColor" />
            <circle cx="225" cy="20" r="3" fill="currentColor" />
          </svg>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-100/70 text-rose-900 text-xs font-semibold uppercase tracking-wider dark:bg-rose-950/70 dark:text-rose-200">
              <Feather className="w-3.5 h-3.5 text-brand-rosegold" />
              <span>Organic Henna Studio</span>
            </div>
            <h2 className="text-fluid-section font-heading font-bold text-brand-ink dark:text-white tracking-tight">
              Artisanal Rajasthani & Arabic Henna
            </h2>
            <p className="text-base sm:text-lg text-brand-muted">
              Handcrafted fresh weekly with 100% natural eucalyptus and triple-filtered Sojat leaves. Guaranteed mahogany stains with zero chemicals.
            </p>
          </div>

          <Link
            href="/mehendi"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-royal hover:text-brand-violet dark:text-brand-orchid dark:hover:text-white transition-colors group self-start md:self-auto"
          >
            <span>Explore All Henna Designs</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Staggered Cards Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mehendiList.map((item, index) => {
            const isSaved = !!savedIds[item.id];

            return (
              <motion.div
                key={item.id}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  delay: shouldReduceMotion ? 0 : 0.08 * index,
                  duration: 0.55,
                }}
                className="group relative flex flex-col justify-between rounded-3xl p-6 bg-[#FAF5FF] dark:bg-[#1A102F] border border-purple-100 dark:border-purple-900/60 shadow-soft hover:shadow-glow hover:-translate-y-1 transition-all duration-300"
              >
                {/* Visual Placeholder Art Canvas with Henna Pattern */}
                <div className={`relative w-full h-44 rounded-2xl bg-gradient-to-tr ${item.colorScheme} p-4 text-white overflow-hidden flex flex-col justify-between mb-5 shadow-inner`}>
                  {/* Subtle Henna Mandala Silhouette */}
                  <div className="absolute right-0 bottom-0 opacity-20 -mr-6 -mb-6 pointer-events-none">
                    <svg className="w-36 h-36" viewBox="0 0 100 100" fill="currentColor">
                      <polygon points="50,5 65,35 95,50 65,65 50,95 35,65 5,50 35,35" />
                      <circle cx="50" cy="50" r="16" />
                    </svg>
                  </div>

                  {/* Top Bar with Style Tag & Heart Micro-Interaction */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md border border-white/30 text-white">
                      {item.style}
                    </span>

                    <button
                      onClick={() => toggleSave(item.id)}
                      aria-label={isSaved ? "Remove from favorites" : "Save to favorites"}
                      className={`p-2 rounded-full backdrop-blur-md transition-all active:scale-90 ${
                        isSaved
                          ? "bg-rose-500 text-white shadow-md scale-110"
                          : "bg-white/25 text-white hover:bg-white/40"
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 transition-transform ${
                          isSaved ? "fill-current scale-110" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Bottom Duration Badge */}
                  <div className="relative z-10 flex items-center gap-1.5 text-xs text-purple-200">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.durationMin} mins session</span>
                  </div>
                </div>

                {/* Details */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="font-heading font-bold text-xl text-brand-ink dark:text-white group-hover:text-brand-royal dark:group-hover:text-brand-orchid transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-brand-muted leading-relaxed mb-5">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Row */}
                <div className="pt-4 border-t border-purple-100/70 dark:border-purple-900/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-brand-muted block">
                      Stain Investment
                    </span>
                    <span className="font-heading font-bold text-xl text-brand-royal dark:text-brand-orchid">
                      ₹{item.price.toLocaleString()}
                    </span>
                  </div>

                  <Link
                    href={`/book?category=mehendi&style=${item.style}`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-lavender text-brand-deep hover:bg-brand-royal hover:text-white dark:bg-purple-950/60 dark:text-purple-200 dark:hover:bg-brand-royal dark:hover:text-white text-xs font-semibold transition-all shadow-sm active:scale-95"
                  >
                    <span>Book Style</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
