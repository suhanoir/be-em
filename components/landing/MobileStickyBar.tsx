"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Phone, MessageCircle } from "lucide-react";
import { LANDING_CONTENT } from "@/lib/landing-content";

export function MobileStickyBar() {
  const [show, setShow] = useState(false);
  const salon = LANDING_CONTENT.salon;
  const whatsappUrl = `https://wa.me/${salon.phoneNumeric}?text=${encodeURIComponent(
    salon.whatsappPrefill
  )}`;

  useEffect(() => {
    const handleScroll = () => {
      // Show once scrolled past hero (approx 350px)
      setShow(window.scrollY > 350);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!show) return null;

  return (
    <div
      aria-label="Mobile quick action bar"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0F081D]/95 backdrop-blur-xl border-t border-purple-200/80 dark:border-purple-900/80 px-4 py-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-2xl animate-in slide-in-from-bottom duration-300"
    >
      <div className="flex items-center gap-2 max-w-md mx-auto">
        {/* Call Salon Direct */}
        <a
          href={`tel:${salon.phoneNumeric}`}
          aria-label="Call BEEM salon"
          className="p-3 rounded-full bg-purple-50 text-brand-royal dark:bg-purple-950 dark:text-purple-200 border border-purple-200 dark:border-purple-800 hover:bg-brand-lavender active:scale-95 transition-all flex items-center justify-center flex-shrink-0"
        >
          <Phone className="w-5 h-5" />
        </a>

        {/* WhatsApp Direct */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp BEEM salon"
          className="p-3 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 active:scale-95 transition-all flex items-center justify-center flex-shrink-0"
        >
          <MessageCircle className="w-5 h-5" />
        </a>

        {/* Primary Book Appointment CTA */}
        <Link
          href="/book"
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-gradient-to-r from-brand-royal to-purple-600 text-white font-semibold text-sm shadow-soft active:scale-95 transition-all"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Now (60s)</span>
        </Link>
      </div>
    </div>
  );
}
