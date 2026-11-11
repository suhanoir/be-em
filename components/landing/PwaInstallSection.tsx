"use client";

import React, { useState, useEffect } from "react";
import {
  Smartphone,
  Download,
  Share,
  CheckCircle,
  PlusSquare,
  Sparkles,
  Zap,
} from "lucide-react";
import { LANDING_CONTENT } from "@/lib/landing-content";

export function PwaInstallSection() {
  const pwa = LANDING_CONTENT.pwa;
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone mode
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleIos = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isAppleIos);

    // Listen for beforeinstallprompt event (Android / Chromium)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return null; // Cleanly hide if already installed
  }

  return (
    <section
      id="install-app"
      aria-label="Install BEEM Progressive Web App"
      className="py-16 sm:py-24 bg-white dark:bg-[#0F081D]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-purple-100 via-brand-lavender/60 to-pink-100 dark:from-[#1E1035] dark:via-[#160D2C] dark:to-[#1E1035] border border-purple-200/80 dark:border-purple-800 shadow-soft overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-purple-950 text-brand-royal dark:text-brand-orchid text-xs font-semibold uppercase tracking-wider shadow-sm">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Zero Storage Overhead PWA</span>
              </div>

              <h2 className="text-fluid-section font-heading font-bold text-brand-ink dark:text-white tracking-tight">
                {pwa.title}
              </h2>

              <p className="text-base sm:text-lg text-brand-muted">
                {pwa.subtitle}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {pwa.benefits.map((b) => (
                  <div key={b} className="flex items-center gap-2 text-xs sm:text-sm text-brand-ink dark:text-purple-100">
                    <CheckCircle className="w-4 h-4 text-brand-royal dark:text-brand-orchid flex-shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              {/* Install Trigger Button for Android / Chrome */}
              {deferredPrompt && (
                <div className="pt-4">
                  <button
                    onClick={handleInstallClick}
                    className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-brand-royal text-white font-semibold text-sm shadow-soft hover:shadow-glow hover:scale-105 active:scale-95 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Install BEEM on Home Screen</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right: Device Instructions (iOS or Android Guide) */}
            <div className="lg:col-span-5 flex justify-center">
              {isIos ? (
                /* iOS Instructions Card */
                <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#1A102F] p-6 border border-purple-100 dark:border-purple-800 shadow-xl space-y-4">
                  <p className="font-heading font-bold text-lg text-brand-ink dark:text-white text-center">
                    Quick iOS Safari Install
                  </p>
                  <div className="space-y-3 text-xs text-brand-muted">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60">
                      <div className="p-2 rounded-lg bg-white dark:bg-[#160D2C] text-brand-royal">
                        <Share className="w-4 h-4" />
                      </div>
                      <span>1. Tap the <strong>Share</strong> icon in Safari toolbar</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60">
                      <div className="p-2 rounded-lg bg-white dark:bg-[#160D2C] text-brand-royal">
                        <PlusSquare className="w-4 h-4" />
                      </div>
                      <span>2. Scroll down & select <strong>Add to Home Screen</strong></span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Native PWA Phone Mock */
                <div className="w-56 h-80 rounded-3xl border-4 border-purple-300 dark:border-purple-700 bg-white dark:bg-[#1A102F] p-4 flex flex-col items-center justify-between shadow-2xl">
                  <div className="w-16 h-3 rounded-full bg-purple-200 dark:bg-purple-800" />
                  <div className="text-center space-y-2">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-deep to-brand-violet text-brand-softgold mx-auto flex items-center justify-center shadow-soft">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <p className="font-script text-2xl text-brand-royal dark:text-brand-orchid">
                      BEEM App
                    </p>
                    <p className="text-[10px] text-brand-muted">
                      1-Tap Luxury Booking
                    </p>
                  </div>
                  <div className="w-full py-2 rounded-xl bg-brand-lavender/60 text-[10px] font-bold text-center text-brand-deep dark:bg-purple-950 dark:text-purple-200">
                    Ready to Install
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
