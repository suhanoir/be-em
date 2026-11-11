"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Instagram, Sliders } from "lucide-react";
import { LANDING_CONTENT, TransformationItem } from "@/lib/landing-content";

export function BeforeAfterSection() {
  const items = LANDING_CONTENT.transformations;
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
  const [activeItem, setActiveItem] = useState<TransformationItem>(items[0]);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pos);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setSliderPos((prev) => Math.max(0, prev - 5));
    } else if (e.key === "ArrowRight") {
      setSliderPos((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <section
      id="transformations"
      aria-label="Real Client Transformations and Before & After Gallery"
      className="py-16 sm:py-24 bg-[#FAF5FF] dark:bg-[#140B24] transition-colors"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-lavender text-brand-deep text-xs font-semibold uppercase tracking-wider dark:bg-purple-950 dark:text-purple-200">
              <Sparkles className="w-3.5 h-3.5 text-brand-softgold" />
              <span>Real Transformations</span>
            </div>
            <h2 className="text-fluid-section font-heading font-bold text-brand-ink dark:text-white tracking-tight">
              Before & After Artistry
            </h2>
            <p className="text-base sm:text-lg text-brand-muted">
              Slide to reveal the breathtaking difference tailored hair color, restorative skin therapy, and bridal architecture make.
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-royal hover:text-brand-violet dark:text-brand-orchid dark:hover:text-white transition-colors group self-start md:self-auto"
          >
            <Instagram className="w-4 h-4" />
            <span>View Full Instagram Gallery</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Transformation Selector Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-8">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveItem(item)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeItem.id === item.id
                  ? "bg-brand-royal text-white shadow-soft"
                  : "bg-white dark:bg-[#1A102F] text-brand-ink dark:text-purple-200 border border-purple-100 dark:border-purple-800 hover:bg-brand-lavender/50"
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* Interactive Comparison Slider */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <div
              ref={containerRef}
              role="slider"
              aria-label="Comparison slider between before and after results"
              aria-valuenow={Math.round(sliderPos)}
              aria-valuemin={0}
              aria-valuemax={100}
              tabIndex={0}
              onKeyDown={handleKeyDown}
              onMouseDown={() => (isDragging.current = true)}
              onMouseUp={() => (isDragging.current = false)}
              onMouseLeave={() => (isDragging.current = false)}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden cursor-ew-resize select-none border-2 border-purple-200/80 dark:border-purple-900 shadow-2xl focus:outline-none focus:ring-4 focus:ring-brand-violet"
            >
              {/* "After" Layer (Full Background) */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#3B0764] via-brand-deep to-[#7C3AED] flex flex-col items-center justify-center p-8 text-white text-center">
                <div className="max-w-md space-y-3 z-10">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-softgold text-amber-950 shadow-sm inline-block">
                    {activeItem.afterLabel} (After)
                  </span>
                  <h3 className="font-heading font-bold text-3xl sm:text-4xl text-white">
                    {activeItem.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-purple-100">
                    {activeItem.description}
                  </p>
                </div>
                {/* Visual texture */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#EDE9FE_1px,transparent_1px)] [background-size:16px_16px]" />
              </div>

              {/* "Before" Layer (Clipped by slider position) */}
              <div
                className="absolute inset-y-0 left-0 overflow-hidden bg-gradient-to-tr from-[#1F1630] via-[#2A1E40] to-[#45365C] flex flex-col items-center justify-center p-8 text-white text-center"
                style={{ width: `${sliderPos}%` }}
              >
                <div className="w-[100vw] max-w-[800px] space-y-3 text-center -ml-[50%] lg:-ml-0">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-zinc-700 text-zinc-200 inline-block">
                    {activeItem.beforeLabel} (Before)
                  </span>
                  <h3 className="font-heading font-bold text-3xl sm:text-4xl text-zinc-300">
                    Original Condition
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    Before bespoke treatment at BEEM Beauty Empire
                  </p>
                </div>
              </div>

              {/* Slider Handle Divider Line */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-glow pointer-events-none"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white dark:bg-[#1A102F] text-brand-royal dark:text-brand-softgold shadow-2xl flex items-center justify-center border-2 border-brand-violet">
                  <Sliders className="w-4 h-4 rotate-90" />
                </div>
              </div>

              {/* Helper tip */}
              <div className="absolute bottom-4 left-4 z-20 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[11px] text-white pointer-events-none">
                Drag slider or use Arrow keys to compare
              </div>
            </div>
          </div>

          {/* Details & Direct Booking Action */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1A102F] border border-purple-100 dark:border-purple-900/60 shadow-soft space-y-4">
              <span className="text-xs uppercase tracking-widest text-brand-muted font-bold block">
                Treatment Breakdown
              </span>

              <h4 className="font-heading font-bold text-2xl text-brand-ink dark:text-white">
                {activeItem.service}
              </h4>

              <div className="space-y-2 text-xs text-brand-muted">
                <p>
                  <strong className="text-brand-ink dark:text-white">Master Artist: </strong>
                  {activeItem.stylist}
                </p>
                <p>
                  <strong className="text-brand-ink dark:text-white">Category: </strong>
                  {activeItem.category}
                </p>
                <p>
                  <strong className="text-brand-ink dark:text-white">Results: </strong>
                  {activeItem.description}
                </p>
              </div>

              <div className="pt-4 border-t border-purple-100 dark:border-purple-900/40">
                <Link
                  href="/book"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-brand-royal text-white font-semibold text-xs shadow-soft hover:bg-brand-deep transition-all"
                >
                  <span>Book This Exact Treatment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
