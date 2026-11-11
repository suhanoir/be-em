"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  Calendar,
  Crown,
  ChevronDown,
  Star,
  CheckCircle2,
  Flower2,
  Flame,
  ArrowRight,
  Shield,
  Scissors,
} from "lucide-react";
import { LANDING_CONTENT } from "@/lib/landing-content";
import { royalTransition, snappyTransition } from "@/lib/motion-config";

export function HeroSection() {
  const content = LANDING_CONTENT.hero;
  const shouldReduceMotion = useReducedMotion();
  const [isLowPowerDevice, setIsLowPowerDevice] = useState(false);

  useEffect(() => {
    // Check if device is low-power (e.g. Save-Data, low cores)
    if (typeof navigator !== "undefined") {
      const isSaveData = (navigator as any).connection?.saveData;
      const lowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;
      const lowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
      if (isSaveData || lowMemory || lowCores) {
        setIsLowPowerDevice(true);
      }
    }
  }, []);

  // Split headline words for staggered animation
  const headlineWords = ["Where", "Every", "Look", "Becomes", "Royal."];

  return (
    <section
      id="hero"
      aria-label="BEEM Hero Section"
      className="relative flex flex-col justify-between min-h-[100svh] min-h-screen overflow-hidden bg-gradient-to-b from-[#FDFBF9] via-[#FAF5FF] to-white dark:from-[#0F081D] dark:via-[#160D2C] dark:to-[#0F081D] pt-8 pb-10"
    >
      {/* Decorative slow-moving gradient blobs */}
      {!shouldReduceMotion && !isLowPowerDevice && (
        <>
          <div
            aria-hidden="true"
            className="animate-float-slow absolute top-12 left-1/4 -translate-x-1/2 w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] rounded-full bg-gradient-to-tr from-purple-300/30 to-violet-400/20 blur-3xl pointer-events-none dark:from-purple-900/20 dark:to-violet-800/10"
          />
          <div
            aria-hidden="true"
            className="animate-float-reverse absolute bottom-16 right-5 sm:right-1/4 w-[280px] sm:w-[420px] h-[280px] sm:h-[420px] rounded-full bg-gradient-to-br from-pink-200/40 via-purple-200/25 to-amber-100/30 blur-3xl pointer-events-none dark:from-pink-950/20 dark:via-purple-900/10 dark:to-amber-950/10"
          />
          {/* Subtle floating gold sparkle dots */}
          <div
            aria-hidden="true"
            className="absolute top-24 right-1/3 w-2 h-2 rounded-full bg-brand-softgold/60 blur-[1px] animate-ping duration-1000 pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-32 left-1/6 w-2.5 h-2.5 rounded-full bg-brand-rosegold/50 blur-[1px] animate-pulse duration-700 pointer-events-none"
          />
        </>
      )}

      {/* Main Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-auto w-full py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline, Subtitle, Actions, Trust Metrics */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            {/* Pill Badge */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-lavender text-brand-deep text-xs sm:text-sm font-semibold tracking-wide border border-purple-200/80 shadow-sm dark:bg-purple-950/70 dark:text-purple-200 dark:border-purple-800"
            >
              <Crown className="h-4 w-4 text-brand-softgold flex-shrink-0" />
              <span>{content.badge}</span>
            </motion.div>

            {/* Headline with Staggered Word Reveal */}
            <h1 className="text-fluid-hero font-heading font-bold text-brand-ink dark:text-white tracking-tight">
              {headlineWords.map((word, idx) => {
                const isRoyal = word === "Royal.";
                return (
                  <motion.span
                    key={word + idx}
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: shouldReduceMotion ? 0 : 0.08 * idx,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`inline-block mr-2 sm:mr-3.5 ${
                      isRoyal
                        ? "bg-gradient-to-r from-brand-deep via-brand-royal to-brand-violet bg-clip-text text-transparent dark:from-brand-orchid dark:via-purple-300 dark:to-white"
                        : ""
                    }`}
                  >
                    {word}
                  </motion.span>
                );
              })}
            </h1>

            {/* Subline */}
            <motion.p
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-base sm:text-lg lg:text-xl text-brand-muted max-w-xl leading-relaxed"
            >
              {content.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-4 pt-2"
            >
              <Link
                href={content.primaryCta.href}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-brand-royal via-brand-violet to-purple-600 text-white font-semibold text-base shadow-soft hover:shadow-glow hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-brand-violet focus:ring-offset-2"
              >
                <Calendar className="h-5 w-5" />
                <span>{content.primaryCta.text}</span>
              </Link>

              <Link
                href={content.secondaryCta.href}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-purple-200 bg-white/80 hover:bg-brand-lavender/60 text-brand-deep font-semibold text-base shadow-sm dark:bg-purple-950/40 dark:border-purple-800 dark:text-purple-200 dark:hover:bg-purple-900/60 transition-all active:scale-95"
              >
                <span>{content.secondaryCta.text}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            {/* Trust Row Metrics */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="pt-4 grid grid-cols-3 gap-3 sm:gap-6 border-t border-purple-100 dark:border-purple-900/60 w-full max-w-lg"
            >
              {content.trustMetrics.map((item) => (
                <div key={item.label} className="flex flex-col items-center lg:items-start">
                  <span className="font-heading font-bold text-xl sm:text-2xl text-brand-ink dark:text-white">
                    {item.value}
                  </span>
                  <span className="text-xs font-medium text-brand-muted truncate">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-brand-muted/80 hidden sm:inline">
                    {item.subtext}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Royal Arch Visual & Floating Micro-Cards */}
          <div className="lg:col-span-5 relative flex items-center justify-center mt-4 lg:mt-0">
            {/* Arch-shaped Frame Container */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-[4/5] rounded-t-[140px] sm:rounded-t-[180px] rounded-b-3xl p-3 bg-gradient-to-b from-purple-200 via-pink-100 to-amber-100 shadow-2xl dark:from-purple-900/50 dark:via-purple-950/40 dark:to-pink-950/30"
            >
              {/* Inner Arch Content / SVG Visual Canvas */}
              <div className="relative w-full h-full rounded-t-[130px] sm:rounded-t-[170px] rounded-b-2xl overflow-hidden bg-gradient-to-b from-[#2E1065] via-[#4C1D95] to-[#1E1035] flex flex-col items-center justify-between p-6 text-white text-center">
                {/* Top Subtle Mandala SVG */}
                <div className="opacity-25 mt-4">
                  <svg className="w-24 h-24 text-brand-softgold" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
                    <circle cx="50" cy="50" r="40" strokeDasharray="3 3" />
                    <circle cx="50" cy="50" r="28" />
                    <polygon points="50,15 62,38 85,50 62,62 50,85 38,62 15,50 38,38" />
                  </svg>
                </div>

                {/* Central Royal Silhouette & Monogram */}
                <div className="space-y-2 z-10">
                  <div className="mx-auto w-20 h-20 rounded-full border border-amber-300/40 bg-gradient-to-tr from-amber-400/20 to-purple-400/20 backdrop-blur-md flex items-center justify-center text-brand-softgold shadow-gold">
                    <Crown className="w-10 h-10" />
                  </div>
                  <h2 className="font-script text-4xl sm:text-5xl text-brand-softgold">
                    Beauty Empire
                  </h2>
                  <p className="text-xs uppercase tracking-widest text-purple-200">
                    Artisanal Sanctuary
                  </p>
                </div>

                {/* Bottom Trust Badge */}
                <div className="w-full bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 flex items-center justify-around text-xs">
                  <div className="flex items-center gap-1.5 text-amber-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Pure Organics</span>
                  </div>
                  <div className="h-4 w-[1px] bg-white/20" />
                  <div className="flex items-center gap-1.5 text-purple-200">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Private Suites</span>
                  </div>
                </div>
              </div>

              {/* Floating Card 1: Bridal Makeup (Top Right) */}
              <motion.div
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        y: [-6, 6, -6],
                        rotate: [0, 2, 0],
                      }
                }
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut",
                }}
                className="absolute -top-4 -right-4 sm:-right-8 bg-white/95 dark:bg-[#1A102F]/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-purple-100 dark:border-purple-800 flex items-center gap-3 z-20"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 flex items-center justify-center">
                  <Crown className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-brand-ink dark:text-white">
                    Bridal Couture
                  </p>
                  <p className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold">
                    ★ 4.98 Master Artist
                  </p>
                </div>
              </motion.div>

              {/* Floating Card 2: Mehendi Art (Bottom Left) */}
              <motion.div
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        y: [6, -6, 6],
                        rotate: [0, -2, 0],
                      }
                }
                transition={{
                  repeat: Infinity,
                  duration: 7,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute -bottom-4 -left-4 sm:-left-8 bg-white/95 dark:bg-[#1A102F]/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-purple-100 dark:border-purple-800 flex items-center gap-3 z-20"
              >
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 flex items-center justify-center">
                  <Flower2 className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-brand-ink dark:text-white">
                    Organic Henna
                  </p>
                  <p className="text-[10px] text-brand-muted">
                    Triple-Filtered Sojat
                  </p>
                </div>
              </motion.div>

              {/* Floating Card 3: Hair Spa (Middle Right) */}
              <motion.div
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        y: [-4, 5, -4],
                      }
                }
                transition={{
                  repeat: Infinity,
                  duration: 5.5,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="hidden sm:flex absolute top-1/2 -right-10 bg-white/95 dark:bg-[#1A102F]/95 backdrop-blur-md rounded-2xl p-2.5 shadow-xl border border-purple-100 dark:border-purple-800 items-center gap-2 z-20"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-brand-royal dark:bg-purple-950/60 dark:text-purple-300 flex items-center justify-center">
                  <Scissors className="w-4 h-4" />
                </div>
                <div className="text-left pr-2">
                  <p className="text-[11px] font-bold text-brand-ink dark:text-white">
                    Balayage & Spa
                  </p>
                  <p className="text-[9px] text-brand-royal dark:text-brand-orchid font-semibold">
                    100% Ammonia-Free
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Hint Indicator */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center pt-2">
        <Link
          href="#services"
          aria-label="Scroll to services section"
          className="group flex flex-col items-center gap-1.5 text-xs text-brand-muted hover:text-brand-royal dark:hover:text-white transition-colors"
        >
          <span className="tracking-widest uppercase text-[10px] font-semibold">
            Scroll to Explore
          </span>
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    y: [0, 6, 0],
                  }
            }
            transition={{
              repeat: Infinity,
              duration: 1.8,
              ease: "easeInOut",
            }}
          >
            <ChevronDown className="w-4 h-4 text-brand-violet group-hover:text-brand-deep transition-colors" />
          </motion.div>
        </Link>
      </div>
    </section>
  );
}
