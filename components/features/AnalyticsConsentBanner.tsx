"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, X } from "lucide-react";
import { isAnalyticsEnabled, setAnalyticsConsent, initScrollDepthTracking } from "@/lib/analytics";

export function AnalyticsConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only display if analytics is explicitly enabled via environment variable
    if (!isAnalyticsEnabled()) return;

    const existingConsent = localStorage.getItem("beem_analytics_consent");
    if (!existingConsent) {
      setShow(true);
    } else if (existingConsent === "granted") {
      const cleanup = initScrollDepthTracking();
      return cleanup;
    }
  }, []);

  const handleConsent = (granted: boolean) => {
    setAnalyticsConsent(granted);
    setShow(false);
    if (granted) {
      initScrollDepthTracking();
    }
  };

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Privacy and Analytics Preferences"
      className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 p-4 rounded-2xl bg-white/95 dark:bg-[#1A102F]/95 backdrop-blur-xl border border-purple-200 dark:border-purple-800 shadow-2xl animate-in slide-in-from-bottom duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-purple-100 text-brand-royal dark:bg-purple-950 dark:text-brand-orchid flex-shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>

        <div className="space-y-1 text-xs">
          <p className="font-bold text-brand-ink dark:text-white">
            Privacy & Anonymous Analytics
          </p>
          <p className="text-brand-muted leading-relaxed">
            We use privacy-friendly, cookieless metrics to optimize our booking speeds and luxury salon offerings. No personal data is ever sold or tracked.
          </p>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => handleConsent(true)}
              className="px-4 py-1.5 rounded-lg bg-brand-royal text-white font-semibold hover:bg-brand-deep transition-all active:scale-95"
            >
              Accept
            </button>
            <button
              onClick={() => handleConsent(false)}
              className="px-3 py-1.5 rounded-lg text-brand-muted hover:text-brand-ink dark:hover:text-white transition-colors"
            >
              Decline
            </button>
          </div>
        </div>

        <button
          onClick={() => handleConsent(false)}
          aria-label="Close privacy notice"
          className="text-brand-muted hover:text-brand-ink dark:hover:text-white ml-auto"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
