"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  UserCheck,
  Calendar,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import { LANDING_CONTENT } from "@/lib/landing-content";

const stepIcons: Record<string, React.ElementType> = {
  Sparkles,
  UserCheck,
  Calendar,
  ShieldCheck,
};

export function HowItWorksSection() {
  const steps = LANDING_CONTENT.howItWorks;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="how-it-works"
      aria-label="How Booking Works in 4 Steps"
      className="py-16 sm:py-24 bg-gradient-to-b from-white via-purple-50/30 to-white dark:from-[#0F081D] dark:via-[#160D2C] dark:to-[#0F081D]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-lavender text-brand-deep text-xs font-semibold uppercase tracking-wider dark:bg-purple-950 dark:text-purple-200">
            <Calendar className="w-3.5 h-3.5 text-brand-softgold" />
            <span>Under 60 Seconds</span>
          </div>

          <h2 className="text-fluid-section font-heading font-bold text-brand-ink dark:text-white tracking-tight">
            How Royal Beauty Works
          </h2>

          <p className="text-base sm:text-lg text-brand-muted">
            No endless phone calls or waiting rooms. Lock your appointment in four seamless steps with instant real-time calendar confirmation.
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative">
          {/* Connecting Line (Horizontal on Desktop, Hidden on Mobile) */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-1/2 left-12 right-12 h-0.5 -translate-y-12 bg-gradient-to-r from-purple-200 via-brand-violet to-purple-200 dark:from-purple-900 dark:via-brand-orchid dark:to-purple-900 pointer-events-none z-0"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((item, index) => {
              const Icon = stepIcons[item.icon] || Sparkles;

              return (
                <motion.div
                  key={item.step}
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    delay: shouldReduceMotion ? 0 : 0.1 * index,
                    duration: 0.6,
                  }}
                  className="relative flex flex-col items-center text-center p-6 rounded-3xl bg-white/80 dark:bg-[#1A102F]/80 backdrop-blur-md border border-purple-100 dark:border-purple-900/60 shadow-soft hover:shadow-glow transition-all"
                >
                  {/* Step Number Circle */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-deep via-brand-royal to-brand-violet text-white flex items-center justify-center shadow-soft">
                      <Icon className="w-7 h-7 text-brand-softgold" />
                    </div>
                    <span className="absolute -top-2 -right-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-softgold text-amber-950 shadow-sm">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-xl text-brand-ink dark:text-white mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
