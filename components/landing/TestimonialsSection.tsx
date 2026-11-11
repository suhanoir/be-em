"use client";

import React, { useState, useEffect } from "react";
import { Star, CheckCircle, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { LANDING_CONTENT, TestimonialItem } from "@/lib/landing-content";

export function TestimonialsSection() {
  const testimonials = LANDING_CONTENT.testimonials;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, testimonials.length]);

  const current = testimonials[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section
      id="testimonials"
      aria-label="Verified Client Testimonials"
      className="py-16 sm:py-24 bg-white dark:bg-[#0F081D] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-lavender text-brand-deep text-xs font-semibold uppercase tracking-wider dark:bg-purple-950 dark:text-purple-200">
            <Star className="w-3.5 h-3.5 text-brand-softgold fill-brand-softgold" />
            <span>4.9 Star Verified Client Stories</span>
          </div>

          <h2 className="text-fluid-section font-heading font-bold text-brand-ink dark:text-white tracking-tight">
            Loved by Brides & Connoisseurs
          </h2>

          <p className="text-base sm:text-lg text-brand-muted">
            Over 15,000 appointments completed with five-star precision and warmth.
          </p>
        </div>

        {/* Carousel Card */}
        <div className="max-w-4xl mx-auto relative">
          <div className="relative p-8 sm:p-12 rounded-3xl bg-[#FAF5FF] dark:bg-[#1A102F] border border-purple-100 dark:border-purple-900/60 shadow-soft text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-8 transition-all">
            {/* Quote Icon */}
            <div className="w-16 h-16 rounded-2xl bg-brand-lavender text-brand-royal dark:bg-purple-950 dark:text-brand-orchid flex items-center justify-center flex-shrink-0 shadow-sm">
              <Quote className="w-8 h-8" />
            </div>

            <div className="space-y-4 flex-1">
              {/* Star Rating */}
              <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-500">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              {/* Quote Text */}
              <p className="font-heading text-xl sm:text-2xl text-brand-ink dark:text-white italic leading-relaxed">
                “{current.quote}”
              </p>

              {/* Author & Verification */}
              <div className="pt-2 border-t border-purple-100 dark:border-purple-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-brand-ink dark:text-white flex items-center justify-center sm:justify-start gap-1.5">
                    <span>{current.name}</span>
                    {current.verified && (
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    )}
                  </h3>
                  <p className="text-xs text-brand-muted">
                    {current.role} • {current.occasion}
                  </p>
                </div>

                <span className="text-[11px] font-semibold text-brand-violet dark:text-brand-orchid bg-purple-100 dark:bg-purple-950/60 px-3 py-1 rounded-full w-fit mx-auto sm:mx-0">
                  {current.service}
                </span>
              </div>
            </div>
          </div>

          {/* Controls: Prev / Next Buttons */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="p-2.5 rounded-full bg-white dark:bg-[#1A102F] text-brand-ink dark:text-purple-200 border border-purple-100 dark:border-purple-800 shadow-sm hover:bg-brand-lavender transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    currentIndex === i
                      ? "w-8 bg-brand-royal"
                      : "w-2 bg-purple-200 dark:bg-purple-800"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              aria-label="Next testimonial"
              className="p-2.5 rounded-full bg-white dark:bg-[#1A102F] text-brand-ink dark:text-purple-200 border border-purple-100 dark:border-purple-800 shadow-sm hover:bg-brand-lavender transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
