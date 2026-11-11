"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Sparkles, X, Bookmark, Calendar } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string | null;
  likesCount: number;
}

const CATEGORIES = ["All", "Hair", "Bridal", "Mehendi", "Makeup", "Nails", "Skin"];

export function GalleryViewer({ initialItems }: { initialItems: GalleryItem[] }) {
  const [selectedCat, setSelectedCat] = useState("All");
  const [likes, setLikes] = useState<Record<string, number>>(
    initialItems.reduce((acc, it) => ({ ...acc, [it.id]: it.likesCount }), {})
  );
  const [userLiked, setUserLiked] = useState<Record<string, boolean>>({});
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleLike = (id: string) => {
    if (userLiked[id]) return;
    setUserLiked((prev) => ({ ...prev, [id]: true }));
    setLikes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleSaveToLookboard = (item: GalleryItem) => {
    // Save to localStorage Look Board
    const current = JSON.parse(localStorage.getItem("beem_lookboard") || "[]");
    current.push({
      imageUrl: item.imageUrl,
      title: item.title,
      category: item.category,
      savedAt: new Date().toISOString(),
    });
    localStorage.setItem("beem_lookboard", JSON.stringify(current));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const filtered = initialItems.filter((it) => {
    if (selectedCat === "All") return true;
    return it.category.toLowerCase() === selectedCat.toLowerCase();
  });

  return (
    <div className="space-y-8">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar justify-start sm:justify-center">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-semibold transition-all ${
              selectedCat === cat
                ? "bg-brand-royal text-white shadow-soft"
                : "bg-white dark:bg-[#1A102F] border border-purple-100 dark:border-purple-900 text-brand-ink dark:text-purple-200 hover:border-brand-violet"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group rounded-3xl overflow-hidden bg-white dark:bg-[#1A102F] border border-purple-100 dark:border-purple-900 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div
              className="relative aspect-[4/5] w-full overflow-hidden cursor-pointer"
              onClick={() => setActiveItem(item)}
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white">
                <span className="text-[10px] font-bold text-brand-softgold">{item.category}</span>
                <h3 className="font-heading text-base font-bold leading-tight">{item.title}</h3>
                <p className="text-[11px] text-purple-200 line-clamp-1 mt-0.5">
                  {item.description}
                </p>
              </div>

              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md text-[10px] font-bold text-brand-deep dark:text-brand-orchid">
                {item.category}
              </div>
            </div>

            <div className="p-4 flex items-center justify-between">
              <button
                onClick={() => handleLike(item.id)}
                className="flex items-center gap-1.5 text-xs text-brand-muted hover:text-pink-600 transition-colors"
              >
                <Heart
                  className={`h-4 w-4 ${
                    userLiked[item.id] ? "fill-pink-600 text-pink-600" : ""
                  }`}
                />
                <span>{likes[item.id] || 0}</span>
              </button>

              <button
                onClick={() => setActiveItem(item)}
                className="text-xs font-semibold text-brand-violet dark:text-brand-orchid hover:underline"
              >
                Inspect Look
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Lightbox */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-2xl w-full rounded-3xl bg-white dark:bg-[#1A102F] overflow-hidden shadow-2xl border border-purple-200 dark:border-purple-800">
            <button
              onClick={() => setActiveItem(null)}
              aria-label="Close Preview"
              className="absolute top-4 right-4 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative aspect-[4/5] md:aspect-auto h-80 md:h-full">
                <Image
                  src={activeItem.imageUrl}
                  alt={activeItem.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6 sm:p-8 flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-brand-deep dark:bg-purple-950 dark:text-purple-200 text-xs font-bold">
                    {activeItem.category}
                  </span>

                  <h3 className="font-heading text-2xl font-bold text-brand-ink dark:text-white leading-tight">
                    {activeItem.title}
                  </h3>

                  <p className="text-xs text-brand-muted leading-relaxed">
                    {activeItem.description || "Created with signature precision by BEEM master artists."}
                  </p>

                  {saveSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 animate-in fade-in">
                      ✓ Saved to your Inspiration Look Board!
                    </div>
                  )}
                </div>

                <div className="pt-6 space-y-3">
                  <button
                    onClick={() => handleSaveToLookboard(activeItem)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full border border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/40 text-xs font-semibold text-brand-deep dark:text-purple-200 transition-colors"
                  >
                    <Bookmark className="h-4 w-4 text-brand-violet" />
                    <span>Save to Look Board</span>
                  </button>

                  <Link
                    href={`/book?lookTitle=${encodeURIComponent(activeItem.title)}`}
                    onClick={() => setActiveItem(null)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-brand-violet text-white text-xs font-semibold hover:bg-brand-royal transition-colors shadow-soft"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Book an Appointment for this Look</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
