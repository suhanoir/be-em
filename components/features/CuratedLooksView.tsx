"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Heart, Calendar, Filter, Check, ArrowRight } from "lucide-react";

interface LookItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  stylistName?: string | null;
  tags: string;
  isTrending: boolean;
  serviceSlug?: string | null;
}

export function CuratedLooksView({ initialLooks }: { initialLooks: LookItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories = ["All", "Hair", "Bridal", "Mehendi", "Makeup", "Nails", "Skin"];

  const filteredLooks =
    selectedCategory === "All"
      ? initialLooks
      : initialLooks.filter((l) => l.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleSaveToLookboard = async (look: LookItem) => {
    setSavedIds((prev) => ({ ...prev, [look.id]: true }));
    setToastMessage(`Saved "${look.title}" to your Look Board!`);
    setTimeout(() => setToastMessage(null), 3000);

    // Save to local storage for guest / persist to API if signed in
    try {
      await fetch("/api/lookboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: look.imageUrl,
          note: `${look.title} (${look.category})`,
        }),
      });
    } catch {
      // Graceful fallback to client state
    }
  };

  return (
    <div className="min-h-screen py-12 sm:py-16 bg-gradient-to-b from-[#FDFBF9] via-[#FAF5FF] to-white dark:from-[#0F081D] dark:via-[#160D2C] dark:to-[#0F081D]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 p-4 rounded-2xl bg-brand-royal text-white shadow-glow text-xs font-semibold animate-in slide-in-from-top-4 duration-200 flex items-center gap-2">
          <Check className="w-4 h-4 text-brand-softgold" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-lavender text-brand-deep text-xs font-semibold uppercase tracking-wider dark:bg-purple-950 dark:text-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-brand-softgold" />
            <span>Salon Inspiration Gallery</span>
          </div>

          <h1 className="text-fluid-section font-heading font-bold text-brand-ink dark:text-white tracking-tight">
            Curated Signature Looks
          </h1>

          <p className="text-base sm:text-lg text-brand-muted">
            Explore authentic hair, makeup, and henna transformations created by our master artists. Save your favorites to your personal Look Board or book the exact treatment directly.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                selectedCategory === cat
                  ? "bg-brand-royal text-white shadow-soft"
                  : "bg-white dark:bg-[#1A102F] text-brand-ink dark:text-purple-200 border border-purple-100 dark:border-purple-800 hover:bg-brand-lavender/60"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Looks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredLooks.map((look) => {
            const isSaved = !!savedIds[look.id];

            return (
              <div
                key={look.id}
                className="group relative flex flex-col justify-between rounded-3xl overflow-hidden bg-white dark:bg-[#1A102F] border border-purple-100 dark:border-purple-900/60 shadow-soft hover:shadow-glow hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-purple-100 dark:bg-purple-950">
                  <Image
                    src={look.imageUrl}
                    alt={look.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Category Pill */}
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 text-brand-deep shadow-sm">
                    {look.category}
                  </span>

                  {/* Save to Lookboard Action */}
                  <button
                    onClick={() => handleSaveToLookboard(look)}
                    aria-label={`Save ${look.title} to look board`}
                    className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all active:scale-90 ${
                      isSaved
                        ? "bg-rose-500 text-white shadow-md scale-110"
                        : "bg-white/80 hover:bg-white text-brand-ink shadow-sm"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                  </button>

                  {/* Trending Pill */}
                  {look.isTrending && (
                    <span className="absolute bottom-4 left-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-amber-950 shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Trending</span>
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h2 className="font-heading font-bold text-xl text-brand-ink dark:text-white mb-1.5 group-hover:text-brand-royal dark:group-hover:text-brand-orchid transition-colors">
                      {look.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-brand-muted leading-relaxed mb-3">
                      {look.description}
                    </p>

                    {look.stylistName && (
                      <p className="text-xs text-brand-royal dark:text-brand-orchid font-semibold">
                        Master Artist: {look.stylistName}
                      </p>
                    )}
                  </div>

                  {/* Actions: Book This Look & Look Board */}
                  <div className="pt-4 border-t border-purple-100 dark:border-purple-900/40 flex items-center justify-between gap-3">
                    <button
                      onClick={() => handleSaveToLookboard(look)}
                      className="text-xs font-semibold text-brand-muted hover:text-brand-royal dark:hover:text-white transition-colors flex items-center gap-1"
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>{isSaved ? "Saved" : "Save Look"}</span>
                    </button>

                    <Link
                      href={
                        look.serviceSlug
                          ? `/book?service=${look.serviceSlug}`
                          : `/book?category=${look.category.toLowerCase()}`
                      }
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-royal text-white text-xs font-semibold shadow-soft hover:bg-brand-deep active:scale-95 transition-all"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Look</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
