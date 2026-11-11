import React from "react";
import { db } from "@/lib/db";
import { MehendiCatalog } from "@/components/features/MehendiCatalog";
import { Flower2, ShieldCheck, Clock, Sparkles } from "lucide-react";

export const metadata = {
  title: "Organic Mehendi & Henna Artistry Catalog | BEEM (Beauty Empire)",
  description:
    "Explore 100% natural Rajasthani, Arabic, Indo-Arabic, Minimalist, and Royal Bridal Henna designs with guaranteed rich mahogany stains.",
};

export default async function MehendiPage() {
  const designs = await db.mehendiDesign.findMany({
    orderBy: [{ isFeatured: "desc" }, { price: "asc" }],
  });

  return (
    <div className="py-12 bg-[#FAF7FD] dark:bg-[#0F081D] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-semibold mb-3">
            <ShieldCheck className="h-4 w-4" />
            <span>100% Chemical-Free Sojat Henna • Rich Dark Stain Guarantee</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-brand-ink dark:text-white">
            Artisan Mehendi & Henna Catalog
          </h1>
          <p className="text-sm sm:text-base text-brand-muted mt-3">
            Crafted by master henna artisan Fatima Noor. Filter by traditional Rajasthani figures, 
            contemporary Arabic negative space, or dainty minimalist wrist cuffs.
          </p>
        </div>

        {/* Client Catalog */}
        <MehendiCatalog initialDesigns={designs} />
      </div>
    </div>
  );
}
