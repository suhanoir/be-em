"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Clock, ArrowRight, Sparkles, Filter } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  durationMinutes: number;
  price: number;
  discountedPrice?: number | null;
  image: string | null;
  isPopular: boolean;
  categoryId: string;
  category: Category;
}

export function ServicesCatalog({
  categories,
  initialServices,
}: {
  categories: Category[];
  initialServices: Service[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  const filteredServices = useMemo(() => {
    return initialServices
      .filter((s) => {
        const matchesCategory =
          selectedCategory === "all" || s.category.slug === selectedCategory;
        const matchesSearch =
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.category.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        const priceA = a.discountedPrice || a.price;
        const priceB = b.discountedPrice || b.price;
        if (sortBy === "price-asc") return priceA - priceB;
        if (sortBy === "price-desc") return priceB - priceA;
        if (a.isPopular && !b.isPopular) return -1;
        if (!a.isPopular && b.isPopular) return 1;
        return 0;
      });
  }, [initialServices, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-8">
      {/* Search and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-[#1A102F] border border-purple-100 dark:border-purple-900 shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search haircut, facial, balayage, wax..."
            className="w-full rounded-full border border-purple-200 dark:border-purple-800 bg-[#FAF7FD] dark:bg-purple-950/40 pl-11 pr-4 py-2.5 text-sm text-brand-ink dark:text-white placeholder-brand-muted focus:border-brand-violet focus:outline-none"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-sm">
          <span className="text-brand-muted text-xs">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-full border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#1A102F] px-4 py-2 text-xs font-semibold text-brand-ink dark:text-white focus:outline-none"
          >
            <option value="featured">Featured / Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-semibold transition-all ${
            selectedCategory === "all"
              ? "bg-brand-royal text-white shadow-soft"
              : "bg-white dark:bg-[#1A102F] border border-purple-100 dark:border-purple-900 text-brand-ink dark:text-purple-200 hover:border-brand-violet"
          }`}
        >
          All Categories ({initialServices.length})
        </button>

        {categories.map((cat) => {
          const count = initialServices.filter((s) => s.categoryId === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat.slug
                  ? "bg-brand-royal text-white shadow-soft"
                  : "bg-white dark:bg-[#1A102F] border border-purple-100 dark:border-purple-900 text-brand-ink dark:text-purple-200 hover:border-brand-violet"
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#1A102F] rounded-3xl border border-purple-100 dark:border-purple-900">
          <p className="text-base font-semibold text-brand-ink dark:text-white">
            No services found matching &quot;{searchQuery}&quot;
          </p>
          <p className="text-xs text-brand-muted mt-1">
            Try adjusting your search terms or select &quot;All Categories&quot;.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="mt-4 px-4 py-2 rounded-full bg-brand-violet text-white text-xs font-semibold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((svc) => (
            <div
              key={svc.id}
              className="group rounded-3xl overflow-hidden bg-white dark:bg-[#1A102F] border border-purple-100 dark:border-purple-900 hover:border-purple-300 dark:hover:border-purple-700 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={svc.image || "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600&q=80"}
                    alt={svc.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md text-xs font-semibold text-brand-deep dark:text-brand-orchid">
                    {svc.category.name}
                  </div>
                  {svc.isPopular && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-400 text-brand-ink text-[10px] font-extrabold uppercase shadow-sm">
                      Popular
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <Link href={`/services/${svc.slug}`}>
                    <h3 className="font-heading text-xl font-bold text-brand-ink dark:text-white group-hover:text-brand-violet transition-colors">
                      {svc.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-brand-muted line-clamp-2 mt-2 leading-relaxed">
                    {svc.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-purple-100 dark:border-purple-900/60 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-brand-deep dark:text-brand-orchid">
                        ₹{(svc.discountedPrice || svc.price).toLocaleString("en-IN")}
                      </span>
                      {svc.discountedPrice && (
                        <span className="text-xs text-brand-muted line-through">
                          ₹{svc.price.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-brand-muted mt-0.5">
                      <Clock className="h-3 w-3" />
                      <span>{svc.durationMinutes} mins</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/services/${svc.slug}`}
                      className="text-xs text-brand-muted hover:text-brand-violet font-medium px-2 py-1"
                    >
                      Details
                    </Link>
                    <Link
                      href={`/book?service=${svc.id}`}
                      className="px-4 py-2 rounded-full bg-brand-violet text-white text-xs font-semibold hover:bg-brand-royal transition-colors shadow-sm"
                    >
                      Book
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
