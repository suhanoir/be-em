"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Crown, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import { LANDING_CONTENT, LandingStat } from "@/lib/landing-content";

function CounterItem({ stat }: { stat: LandingStat }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (isInView) {
      if (shouldReduceMotion) {
        setCount(stat.value);
        return;
      }
      let start = 0;
      const end = stat.value;
      const duration = 1600; // ms
      const stepTime = Math.max(Math.floor(duration / 40), 20);
      const increment = Math.ceil(end / (duration / stepTime));

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [isInView, stat.value, shouldReduceMotion]);

  return (
    <div
      ref={ref}
      className="p-6 rounded-3xl bg-white/70 border border-purple-100/70 shadow-soft hover:shadow-glow hover:-translate-y-1 transition-all duration-300 dark:bg-[#1A102F]/60 dark:border-purple-900/60 text-center"
    >
      <div className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-brand-royal dark:text-brand-orchid mb-1">
        {count.toLocaleString()}
        {stat.suffix}
      </div>
      <div className="font-semibold text-sm sm:text-base text-brand-ink dark:text-white mb-1">
        {stat.label}
      </div>
      <div className="text-xs text-brand-muted leading-relaxed">
        {stat.description}
      </div>
    </div>
  );
}

export function IntroStatsSection() {
  const stats = LANDING_CONTENT.stats;

  return (
    <section
      id="about-intro"
      aria-label="About BEEM and Salon Metrics"
      className="relative py-16 sm:py-24 bg-white dark:bg-[#0F081D]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Intro Copy */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-lavender/60 text-brand-deep text-xs font-semibold uppercase tracking-wider dark:bg-purple-950/60 dark:text-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-brand-softgold" />
            <span>The BEEM Philosophy</span>
          </div>

          <h2 className="text-fluid-section font-heading font-bold text-brand-ink dark:text-white tracking-tight">
            Crafted for Elegance.{" "}
            <span className="bg-gradient-to-r from-brand-royal to-purple-500 bg-clip-text text-transparent dark:from-brand-orchid dark:to-white">
              Designed for You.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
            BEEM was established with a singular conviction: luxury salon care should feel deeply personal, calm, and effortless. Whether you are stepping in for a 45-minute precision cut or preparing for your sacred wedding ceremony, our master artisans curate an experience worthy of royalty.
          </p>
        </div>

        {/* Animated Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat) => (
            <CounterItem key={stat.label} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
