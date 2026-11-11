"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Wand2,
  Camera,
  Bot,
  Heart,
  ArrowRight,
  Sparkles,
  Smartphone,
  CheckCircle,
} from "lucide-react";
import { LANDING_CONTENT } from "@/lib/landing-content";

export function SmartFeaturesSection() {
  const features = LANDING_CONTENT.smartFeatures;
  const shouldReduceMotion = useReducedMotion();

  // Color preview mock state for Try-On card
  const [selectedColor, setSelectedColor] = useState("#8B0000"); // Burgundy
  const hairColors = [
    { label: "Burgundy", hex: "#6b1426" },
    { label: "Caramel", hex: "#b87333" },
    { label: "Espresso", hex: "#2b1d0c" },
    { label: "Honey", hex: "#d4a373" },
  ];

  return (
    <section
      id="smart-features"
      aria-label="Smart Salon Innovations and AI Features"
      className="py-16 sm:py-24 bg-[#FAF5FF] dark:bg-[#140B24] transition-colors"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-lavender text-brand-deep text-xs font-semibold uppercase tracking-wider dark:bg-purple-950 dark:text-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-brand-softgold" />
            <span>Salon Tech Innovation</span>
          </div>

          <h2 className="text-fluid-section font-heading font-bold text-brand-ink dark:text-white tracking-tight">
            Smart Features Built for You
          </h2>

          <p className="text-base sm:text-lg text-brand-muted">
            From client-side virtual hair tints to personalized face-shape quizzes, discover beauty tools engineered to eliminate styling guesswork.
          </p>
        </div>

        {/* 4 Feature Interactive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Card 1: Virtual Try-On Studio */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1A102F] border border-purple-100 dark:border-purple-900/60 shadow-soft hover:shadow-glow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-brand-royal dark:bg-purple-950 dark:text-purple-200">
                  Virtual Studio
                </span>
                <Camera className="w-5 h-5 text-brand-violet" />
              </div>

              <h3 className="font-heading font-bold text-2xl text-brand-ink dark:text-white mb-2">
                Virtual Hairstyle & Color Studio
              </h3>

              <p className="text-xs sm:text-sm text-brand-muted mb-6">
                Upload your selfie and experiment with live canvas hair tints, dimensional balayage overlays, and trendy fringe cuts before touching scissors.
              </p>

              {/* Looping Mini Mock Swatch Bar */}
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 mb-6">
                <p className="text-[11px] font-semibold text-brand-ink dark:text-white mb-2.5">
                  Try live hair swatch preview:
                </p>
                <div className="flex items-center gap-3">
                  {hairColors.map((color) => (
                    <button
                      key={color.label}
                      onClick={() => setSelectedColor(color.hex)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        selectedColor === color.hex
                          ? "border-brand-royal scale-110 shadow-sm"
                          : "border-white/80 hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.label}
                      aria-label={`Select ${color.label} color`}
                    />
                  ))}
                  <div
                    className="ml-auto px-3 py-1 rounded-lg text-xs font-semibold text-white shadow-sm transition-colors"
                    style={{ backgroundColor: selectedColor }}
                  >
                    Simulated Tone
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/try-on"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-royal hover:text-brand-violet dark:text-brand-orchid dark:hover:text-white transition-colors group"
            >
              <span>Launch Virtual Try-On Studio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 2: AI Face-Shape Quiz */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1A102F] border border-purple-100 dark:border-purple-900/60 shadow-soft hover:shadow-glow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300">
                  AI Recommendation
                </span>
                <Wand2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>

              <h3 className="font-heading font-bold text-2xl text-brand-ink dark:text-white mb-2">
                Royal Style & Face-Shape Quiz
              </h3>

              <p className="text-xs sm:text-sm text-brand-muted mb-6">
                Take a 2-minute interactive questionnaire to analyze your face shape, undertones, and event style for algorithmic hair & makeup matches.
              </p>

              {/* Mock Quiz Step Badge Preview */}
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-amber-950 dark:text-amber-200">
                    Question 2 of 4: Face Structure
                  </p>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300/80">
                    Oval, Heart, Square, or Round?
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-200 text-amber-950 dark:bg-amber-900 dark:text-amber-100">
                  98% Accuracy
                </span>
              </div>
            </div>

            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-royal hover:text-brand-violet dark:text-brand-orchid dark:hover:text-white transition-colors group"
            >
              <span>Take Style Quiz Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 3: AI Beauty Concierge Chatbot */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1A102F] border border-purple-100 dark:border-purple-900/60 shadow-soft hover:shadow-glow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-900 dark:bg-rose-950/60 dark:text-rose-300">
                  Instant Assistant
                </span>
                <Bot className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>

              <h3 className="font-heading font-bold text-2xl text-brand-ink dark:text-white mb-2">
                24/7 AI Beauty Concierge
              </h3>

              <p className="text-xs sm:text-sm text-brand-muted mb-6">
                Ask about bridal dates, allergy safe treatments, hair color maintenance, or slot availability with instant intelligent responses.
              </p>

              {/* Chat snippet demo */}
              <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 mb-6 space-y-2">
                <div className="bg-white dark:bg-[#251540] p-2.5 rounded-xl text-xs text-brand-ink dark:text-purple-100 w-fit max-w-[85%] shadow-sm">
                  “Can I get organic mehendi done for my Sangeet this Thursday?”
                </div>
                <div className="bg-brand-royal text-white p-2.5 rounded-xl text-xs w-fit max-w-[85%] ml-auto shadow-sm">
                  “Yes! Master Meera has 2 afternoon slots available on Thursday.”
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                // Focus or click the chatbot widget button if present
                const chatBtn = document.querySelector('button[aria-label="Open AI Beauty Concierge"]') as HTMLElement;
                if (chatBtn) chatBtn.click();
              }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-royal hover:text-brand-violet dark:text-brand-orchid dark:hover:text-white transition-colors group self-start"
            >
              <span>Open Concierge Chat</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 4: Look Board */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1A102F] border border-purple-100 dark:border-purple-900/60 shadow-soft hover:shadow-glow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-violet-100 text-brand-deep dark:bg-violet-950/60 dark:text-violet-200">
                  Moodboard
                </span>
                <Heart className="w-5 h-5 text-brand-violet" />
              </div>

              <h3 className="font-heading font-bold text-2xl text-brand-ink dark:text-white mb-2">
                Personal Style Look Board
              </h3>

              <p className="text-xs sm:text-sm text-brand-muted mb-6">
                Save inspiration photos, Pinterest hairstyles, and bridal motifs directly to your profile so your stylist sees your dream aesthetic before you sit down.
              </p>

              {/* Look board preview cards */}
              <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 mb-6 flex items-center justify-around text-center">
                <div className="w-20 h-16 rounded-xl bg-gradient-to-tr from-purple-400 to-pink-300 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                  Balayage
                </div>
                <div className="w-20 h-16 rounded-xl bg-gradient-to-tr from-amber-400 to-rose-400 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                  Bridal HD
                </div>
                <div className="w-20 h-16 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                  Henna Cuff
                </div>
              </div>
            </div>

            <Link
              href="/lookboard"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-royal hover:text-brand-violet dark:text-brand-orchid dark:hover:text-white transition-colors group"
            >
              <span>Explore Look Board</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
