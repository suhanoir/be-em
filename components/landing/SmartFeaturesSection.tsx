"use client";

import React from "react";
import Link from "next/link";
import {
  Wand2,
  Sparkles,
  MessageSquare,
  Heart,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { getSalonWhatsAppUrl } from "@/lib/notifications";

export function SmartFeaturesSection() {
  const whatsappUrl = getSalonWhatsAppUrl("Hello BEEM Salon! I have a question about services and availability.");

  return (
    <section
      id="smart-features"
      aria-label="Handcrafted Salon Features and Guest Conveniences"
      className="py-16 sm:py-24 bg-[#FAF5FF] dark:bg-[#140B24] transition-colors"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-lavender text-brand-deep text-xs font-semibold uppercase tracking-wider dark:bg-purple-950 dark:text-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-brand-softgold" />
            <span>Salon Experience &amp; In-App Tools</span>
          </div>

          <h2 className="text-fluid-section font-heading font-bold text-brand-ink dark:text-white tracking-tight">
            Curated Features Built for You
          </h2>

          <p className="text-base sm:text-lg text-brand-muted">
            From verified lookboard inspirations to diagnostic style quizzes and 1-tap WhatsApp support, discover beauty conveniences designed to eliminate guesswork.
          </p>
        </div>

        {/* 4 Feature Interactive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Card 1: Curated Looks Inspiration */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1A102F] border border-purple-100 dark:border-purple-900/60 shadow-soft hover:shadow-glow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-brand-royal dark:bg-purple-950 dark:text-purple-200">
                  Style Inspiration
                </span>
                <Sparkles className="w-5 h-5 text-brand-violet" />
              </div>

              <h3 className="font-heading font-bold text-2xl text-brand-ink dark:text-white mb-2">
                Curated Looks Gallery
              </h3>

              <p className="text-xs sm:text-sm text-brand-muted mb-6">
                Browse verified haircut, makeup, and bridal inspirations handpicked by our master stylists. Save looks to your board or book the matching treatment in one click.
              </p>

              {/* Tag preview chips */}
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 mb-6 flex flex-wrap gap-2">
                {["#BridalImperial", "#ButterflyLayers", "#HoneyBalayage", "#GlassSkinFacial", "#ArabicMehendi"].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#150D27] text-xs font-semibold text-brand-royal dark:text-brand-orchid border border-purple-200 dark:border-purple-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href="/looks"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-royal hover:text-brand-violet dark:text-brand-orchid dark:hover:text-white transition-colors group"
            >
              <span>Explore Curated Looks</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 2: Signature Style Quiz */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1A102F] border border-purple-100 dark:border-purple-900/60 shadow-soft hover:shadow-glow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300">
                  Personalized Diagnostic
                </span>
                <Wand2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>

              <h3 className="font-heading font-bold text-2xl text-brand-ink dark:text-white mb-2">
                Signature Style &amp; Face-Shape Quiz
              </h3>

              <p className="text-xs sm:text-sm text-brand-muted mb-6">
                Take a 2-minute diagnostic questionnaire to analyze your facial bone structure, skin undertones, and event style for verified hair and makeup blueprints.
              </p>

              {/* Mock Quiz Step Preview */}
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
                  Diagnostic Logic
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

          {/* Card 3: Instant Help Desk */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1A102F] border border-purple-100 dark:border-purple-900/60 shadow-soft hover:shadow-glow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-900 dark:bg-rose-950/60 dark:text-rose-300">
                  Direct Support
                </span>
                <MessageSquare className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>

              <h3 className="font-heading font-bold text-2xl text-brand-ink dark:text-white mb-2">
                Instant Salon Help Desk
              </h3>

              <p className="text-xs sm:text-sm text-brand-muted mb-6">
                Have questions about wedding dates, hygiene protocols, organic mehendi, or cancellation terms? Search our database or chat with salon reception on WhatsApp.
              </p>

              {/* Chat snippet preview */}
              <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 mb-6 space-y-2">
                <div className="bg-white dark:bg-[#251540] p-2.5 rounded-xl text-xs text-brand-ink dark:text-purple-100 w-fit max-w-[85%] shadow-sm">
                  “Can I get organic mehendi done for my Sangeet this Thursday?”
                </div>
                <div className="bg-brand-royal text-white p-2.5 rounded-xl text-xs w-fit max-w-[85%] ml-auto shadow-sm">
                  “Yes! Master Meera has 2 afternoon slots available on Thursday.”
                </div>
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-royal hover:text-brand-violet dark:text-brand-orchid dark:hover:text-white transition-colors group"
            >
              <span>Chat with Salon Concierge</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Card 4: Personal Look Board */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1A102F] border border-purple-100 dark:border-purple-900/60 shadow-soft hover:shadow-glow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-brand-deep dark:bg-purple-950 dark:text-purple-300">
                  Moodboard Sync
                </span>
                <Heart className="w-5 h-5 text-brand-violet" />
              </div>

              <h3 className="font-heading font-bold text-2xl text-brand-ink dark:text-white mb-2">
                Personal Look Board
              </h3>

              <p className="text-xs sm:text-sm text-brand-muted mb-6">
                Curate your favorite bridal motifs, hair tones, and nail art into a unified look board. Your assigned stylist accesses it before you arrive at your appointment.
              </p>

              {/* Checklist items */}
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 mb-6 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-brand-ink dark:text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>One-click save from gallery &amp; curated looks</span>
                </div>
                <div className="flex items-center gap-2 text-brand-ink dark:text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Shared automatically with your assigned stylist</span>
                </div>
                <div className="flex items-center gap-2 text-brand-ink dark:text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Zero account sign-up needed to start curating</span>
                </div>
              </div>
            </div>

            <Link
              href="/lookboard"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-royal hover:text-brand-violet dark:text-brand-orchid dark:hover:text-white transition-colors group"
            >
              <span>Open My Look Board</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
