"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Clock, Sparkles, Check, ArrowRight, Shield } from "lucide-react";

interface Design {
  id: string;
  title: string;
  slug: string;
  style: string;
  complexity: string;
  estimatedTime: string;
  price: number;
  image: string;
  tags: string;
  isFeatured: boolean;
}

const STYLES = ["All Styles", "Arabic", "Rajasthani", "Indo-Arabic", "Minimal", "Bridal Full-hand", "Kids"];

export function MehendiCatalog({ initialDesigns }: { initialDesigns: Design[] }) {
  const [selectedStyle, setSelectedStyle] = useState("All Styles");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = initialDesigns.filter((d) => {
    if (selectedStyle === "All Styles") return true;
    return d.style === selectedStyle;
  });

  return (
    <div className="space-y-8">
      {/* Style Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar justify-start sm:justify-center">
        {STYLES.map((style) => (
          <button
            key={style}
            onClick={() => setSelectedStyle(style)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-semibold transition-all ${
              selectedStyle === style
                ? "bg-brand-royal text-white shadow-soft"
                : "bg-white dark:bg-[#1A102F] border border-purple-100 dark:border-purple-900 text-brand-ink dark:text-purple-200 hover:border-brand-violet"
            }`}
          >
            {style}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((item) => {
          const isFav = Boolean(favorites[item.id]);

          return (
            <div
              key={item.id}
              className="group rounded-3xl overflow-hidden bg-white dark:bg-[#1A102F] border border-purple-100 dark:border-purple-900 hover:border-purple-300 dark:hover:border-purple-700 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md text-[11px] font-bold text-brand-deep dark:text-brand-orchid">
                    {item.style}
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    aria-label="Save Favorite"
                    className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-md flex items-center justify-center text-brand-muted hover:text-red-500 shadow-sm transition-colors"
                  >
                    <Heart className={`h-4 w-4 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
                  </button>
                </div>

                <div className="p-5">
                  <h3 className="font-heading text-lg font-bold text-brand-ink dark:text-white leading-snug">
                    {item.title}
                  </h3>

                  <div className="mt-2.5 flex items-center gap-3 text-[11px] text-brand-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-brand-violet" />
                      {item.estimatedTime}
                    </span>
                    <span>•</span>
                    <span className="font-medium">{item.complexity}</span>
                  </div>

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {item.tags.split(",").slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-brand-royal dark:text-purple-300"
                      >
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-purple-100 dark:border-purple-900/60 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-brand-deep dark:text-brand-orchid">
                      ₹{item.price.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <Link
                    href={`/book?mehendi=${item.id}`}
                    className="px-4 py-2 rounded-full bg-brand-violet text-white text-xs font-semibold hover:bg-brand-royal transition-colors shadow-sm"
                  >
                    Book Design
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
