import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Search, Sparkles, Scissors, Crown, Flower2, Heart, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { ServicesCatalog } from "@/components/features/ServicesCatalog";

export const metadata = {
  title: "Salon Services & Treatment Menu | BEEM (Beauty Empire)",
  description: "Browse 10 luxury service categories including signature haircuts, balayage, HydraGlow facials, gel extensions, and Italian waxing.",
};

export default async function ServicesPage() {
  const categories = await db.serviceCategory.findMany({
    orderBy: { orderIndex: "asc" },
  });

  const services = await db.service.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: [{ categoryId: "asc" }, { price: "asc" }],
  });

  return (
    <div className="py-12 bg-[#FAF7FD] dark:bg-[#0F081D] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest text-brand-violet uppercase">
            Exquisite Menu
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-brand-ink dark:text-white mt-1">
            Our Luxury Salon Services
          </h1>
          <p className="text-sm sm:text-base text-brand-muted mt-3">
            Crafted with cruelty-free European formulations and executed by senior master artisans. 
            All treatments include personalized skin and hair consultations.
          </p>
        </div>

        {/* Client-side Catalog with Search & Category Filters */}
        <ServicesCatalog categories={categories} initialServices={services} />
      </div>
    </div>
  );
}
