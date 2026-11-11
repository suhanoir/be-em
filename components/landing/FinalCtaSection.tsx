"use client";

import React from "react";
import Link from "next/link";
import { Calendar, MessageCircle, Crown, Sparkles, Phone } from "lucide-react";
import { LANDING_CONTENT } from "@/lib/landing-content";

export function FinalCtaSection() {
  const salon = LANDING_CONTENT.salon;
  const whatsappUrl = `https://wa.me/${salon.phoneNumeric}?text=${encodeURIComponent(
    salon.whatsappPrefill
  )}`;

  return (
    <section
      id="final-cta"
      aria-label="Ready to Book Your Royal Look"
      className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-tr from-[#1F0E3D] via-brand-deep to-[#3B0764] text-white text-center"
    >
      {/* Decorative Orbs */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-violet/20 blur-3xl pointer-events-none"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-softgold text-xs font-semibold uppercase tracking-wider">
          <Crown className="w-4 h-4" />
          <span>Your Indiranagar Sanctuary Awaits</span>
        </div>

        <h2 className="text-fluid-section font-heading font-bold text-white tracking-tight">
          Your Royal Look Is One Tap Away
        </h2>

        <p className="text-base sm:text-lg text-purple-200 max-w-2xl mx-auto leading-relaxed">
          Experience Bengaluru’s most personalized luxury beauty parlor. Appointments take under 60 seconds with instant confirmation.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/book"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-9 py-4 rounded-full bg-gradient-to-r from-brand-softgold to-amber-400 text-amber-950 font-bold text-base shadow-gold hover:scale-105 active:scale-95 transition-all"
          >
            <Calendar className="w-5 h-5" />
            <span>Book Your Appointment Now</span>
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base shadow-soft hover:scale-105 active:scale-95 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-purple-300">
          <span>• 100% Free Cancellation up to 4h Prior</span>
          <span>• No Waiting Rooms</span>
          <span>• Organic Certified Sojat Henna</span>
        </div>
      </div>
    </section>
  );
}
