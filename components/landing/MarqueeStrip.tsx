"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { LANDING_CONTENT } from "@/lib/landing-content";

export function MarqueeStrip() {
  const items = LANDING_CONTENT.marqueeStrip;
  // Duplicate list twice to ensure seamless continuous loop
  const repeatedItems = [...items, ...items, ...items];

  return (
    <div
      aria-label="Services Ticker"
      className="relative w-full overflow-hidden border-y border-purple-100/80 bg-gradient-to-r from-purple-50 via-brand-lavender/50 to-pink-50 py-3.5 sm:py-4 dark:border-purple-900/60 dark:from-[#160D2C] dark:via-[#1F123B] dark:to-[#160D2C]"
    >
      {/* Infinite scrolling marquee track */}
      <div className="animate-marquee select-none items-center">
        {repeatedItems.map((item, index) => (
          <div key={item + index} className="inline-flex items-center px-4 sm:px-6">
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-brand-ink uppercase dark:text-purple-100 whitespace-nowrap">
              {item}
            </span>
            <Sparkles className="ml-4 sm:ml-6 h-3.5 w-3.5 text-brand-softgold flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
