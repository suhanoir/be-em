import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Clock, Award, Scissors, Calendar, CheckCircle2 } from "lucide-react";
import { db } from "@/lib/db";

export const metadata = {
  title: "Master Stylists & Beauty Artisans | BEEM (Beauty Empire)",
  description:
    "Meet our creative directors and celebrity bridal makeup artists with 6-9+ years of international runway excellence.",
};

export default async function StylistsPage() {
  const stylists = await db.stylist.findMany({
    where: { isActive: true },
    include: {
      schedules: true,
      reviews: { take: 2, orderBy: { rating: "desc" } },
    },
  });

  return (
    <div className="py-12 bg-[#FAF7FD] dark:bg-[#0F081D] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-brand-violet uppercase">
            Artisans of Perfection
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-brand-ink dark:text-white mt-1">
            Meet the Masters of BEEM
          </h1>
          <p className="text-sm sm:text-base text-brand-muted mt-3">
            Our creative directors bring international academy training (Toni&Guy London, CIDESCO Zurich) 
            combined with heartfelt dedication to bespoke luxury.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stylists.map((st) => (
            <div
              key={st.id}
              className="rounded-3xl bg-white dark:bg-[#1A102F] p-6 sm:p-8 border border-purple-100 dark:border-purple-900 shadow-sm hover:shadow-xl transition-all flex flex-col sm:flex-row gap-6 items-start"
            >
              <div className="relative h-44 w-44 sm:h-52 sm:w-52 rounded-2xl overflow-hidden shrink-0 shadow-md">
                <Image
                  src={st.avatar || "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80"}
                  alt={st.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 208px"
                  className="object-cover"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between h-full space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-heading text-2xl font-bold text-brand-ink dark:text-white">
                      {st.name}
                    </h2>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>{st.rating.toFixed(2)}</span>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-brand-violet dark:text-brand-orchid mt-0.5">
                    {st.experienceYears}+ Years Experience • {st.reviewCount} Reviews
                  </p>

                  <p className="text-xs text-brand-muted mt-2.5 leading-relaxed">
                    {st.bio}
                  </p>

                  <div className="mt-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-brand-deep dark:text-purple-300">
                      Signature Specialties:
                    </p>
                    <p className="text-xs text-brand-ink/80 dark:text-purple-200 mt-0.5 font-medium">
                      {st.specialties}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-purple-100 dark:border-purple-900/60 flex items-center justify-between">
                  <div className="text-[11px] text-brand-muted">
                    <span>Working Hours: 09:00 - 19:00</span>
                  </div>

                  <Link
                    href={`/book?stylist=${st.id}`}
                    className="px-5 py-2.5 rounded-full bg-brand-violet text-white text-xs font-semibold hover:bg-brand-royal transition-colors shadow-soft"
                  >
                    Book with {st.name.split(" ")[0]}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
