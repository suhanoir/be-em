import React from "react";
import { db } from "@/lib/db";
import { GalleryViewer } from "@/components/features/GalleryViewer";

export const metadata = {
  title: "Transformation Lookbook & Gallery | BEEM (Beauty Empire)",
  description: "Browse high-definition transformations across precision cuts, balayage, royal bridal makeup, and sculpted nail art.",
};

export default async function GalleryPage() {
  const items = await db.galleryItem.findMany({
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="py-12 bg-[#FAF7FD] dark:bg-[#0F081D] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest text-brand-violet uppercase">
            Artistry in Focus
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-brand-ink dark:text-white mt-1">
            The BEEM Lookbook
          </h1>
          <p className="text-sm text-brand-muted mt-2">
            Real clients, unfiltered elegance. Tap any look to save to your personal Look Board or book with the featured artisan.
          </p>
        </div>

        <GalleryViewer initialItems={items} />
      </div>
    </div>
  );
}
