import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Crown, Sparkles, CheckCircle2, Calendar, Star, ShieldCheck, HeartHandshake, MapPin, Users } from "lucide-react";
import { db } from "@/lib/db";
import { BridalPlannerInteractive } from "@/components/features/BridalPlannerInteractive";

export const metadata = {
  title: "Royal Bridal Makeover & Trousseau Suites | BEEM (Beauty Empire)",
  description:
    "Experience bespoke luxury bridal packages: Silver Radiance, Gold Empress, and Diamond Imperial. Multi-person bridal entourage bookings and venue travel across Bengaluru.",
};

export default async function BridalPage() {
  const bridalPackages = await db.bridalPackage.findMany({
    orderBy: { price: "asc" },
  });

  const bridalGallery = await db.galleryItem.findMany({
    where: { category: "Bridal" },
    take: 6,
  });

  return (
    <div className="bg-[#FAF7FD] dark:bg-[#0F081D] min-h-screen">
      {/* 1. Bridal Hero */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-b from-[#25093E] via-[#3B1261] to-[#1F0734] text-white">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 text-brand-softgold text-xs font-bold border border-amber-400/40 mb-4 shadow-sm">
            <Crown className="h-4 w-4" />
            <span>The BEEM Royal Bridal Suite</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            Ethereal Bridal Transformations <br />
            <span className="text-brand-softgold">Designed for Eternity.</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-purple-200 max-w-3xl mx-auto leading-relaxed">
            Crafted for the discerning bride who demands cinematic perfection. Featuring airbrush HD bases, 
            exclusive celebrity artists, heirloom natural henna, and VIP private lounge suites.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="#packages"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-brand-ink font-bold text-sm shadow-gold hover:scale-105 active:scale-95 transition-all"
            >
              View Bridal Packages
            </a>
            <Link
              href="/book?service=bridal-consultation-trial"
              className="px-8 py-3.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white font-semibold text-sm transition-all"
            >
              Book Trial Makeup Session
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Three Bespoke Bridal Packages */}
      <section id="packages" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-brand-violet uppercase">
              Bespoke Tiers
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold text-brand-ink dark:text-white mt-1">
              Select Your Royal Package
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted mt-2">
              All packages include skin assessment, custom lash styling, dupatta draping, and jewelry setting.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {bridalPackages.map((bp) => {
              const inclusions: string[] = JSON.parse(bp.inclusions || "[]");
              const highlights: string[] = JSON.parse(bp.highlights || "[]");

              return (
                <div
                  key={bp.id}
                  className={`rounded-3xl p-8 border flex flex-col justify-between transition-all duration-300 ${
                    bp.isPopular
                      ? "bg-white dark:bg-[#1A102F] border-amber-400/90 shadow-gold scale-[1.03] relative"
                      : "bg-white dark:bg-[#1A102F] border-purple-100 dark:border-purple-900 shadow-sm hover:shadow-xl"
                  }`}
                >
                  {bp.isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-brand-ink text-xs font-black uppercase tracking-wider shadow-md">
                      Most Coveted Suite
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold tracking-widest text-brand-violet uppercase">
                        {bp.tier} Collection
                      </span>
                      <span className="text-xs text-brand-muted">{bp.durationHours} Hours Session</span>
                    </div>

                    <h3 className="font-heading text-2xl sm:text-3xl font-bold text-brand-ink dark:text-white">
                      {bp.name}
                    </h3>
                    <p className="text-xs text-brand-muted mt-1 leading-relaxed">{bp.tagline}</p>

                    <div className="my-6 py-4 border-y border-purple-100 dark:border-purple-900">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-brand-deep dark:text-brand-orchid">
                          ₹{bp.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold mt-1">
                        Advance Deposit to lock date: ₹{bp.advanceDeposit.toLocaleString("en-IN")}
                      </p>
                      <p className="text-[11px] text-brand-muted mt-0.5">
                        Guarantees date exclusivity (No double-booking)
                      </p>
                    </div>

                    {/* Inclusions */}
                    <div className="space-y-3 mb-6">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-brand-ink dark:text-white">
                        What&apos;s Included:
                      </h4>
                      {inclusions.map((inc, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-brand-muted leading-relaxed">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <Link
                      href={`/book?bridal=${bp.id}`}
                      className={`w-full block text-center py-3.5 rounded-full font-bold text-sm transition-all ${
                        bp.isPopular
                          ? "bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-brand-ink shadow-gold hover:scale-[1.02]"
                          : "bg-brand-violet hover:bg-brand-royal text-white shadow-soft"
                      }`}
                    >
                      Book & Hold Date
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Interactive Multi-Person & Venue Visit Distance Calculator */}
      <section className="py-16 bg-white dark:bg-[#130A21] border-y border-purple-100 dark:border-purple-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BridalPlannerInteractive packages={bridalPackages} />
        </div>
      </section>

      {/* 4. Soft-Gold Accented Bridal Gallery */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-widest text-brand-softgold uppercase">
              Gold Impressions
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brand-ink dark:text-white mt-1">
              Real BEEM Brides
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted mt-2">
              Captured across traditional South Indian Muhurthams, Sangeet cocktails, and grand palace receptions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bridalGallery.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-3xl overflow-hidden shadow-lg border-2 border-amber-200/60 dark:border-amber-900/60 aspect-[4/5]"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent p-6 flex flex-col justify-end text-white">
                  <div className="flex items-center gap-1.5 text-brand-softgold mb-1">
                    <Crown className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Royal Bride</span>
                  </div>
                  <h3 className="font-heading text-xl font-bold leading-snug">{item.title}</h3>
                  <p className="text-xs text-purple-200 line-clamp-2 mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
