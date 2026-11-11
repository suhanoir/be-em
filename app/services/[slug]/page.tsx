import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Clock,
  Calendar,
  CheckCircle2,
  Star,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Heart,
} from "lucide-react";
import { db } from "@/lib/db";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const service = await db.service.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });
  if (!service) return { title: "Service Not Found" };
  return {
    title: `${service.name} | BEEM (Beauty Empire)`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const service = await db.service.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      reviews: { orderBy: { createdAt: "desc" }, take: 4 },
    },
  });

  if (!service) notFound();

  const relatedServices = await db.service.findMany({
    where: {
      categoryId: service.categoryId,
      id: { not: service.id },
      isActive: true,
    },
    take: 3,
  });

  return (
    <div className="py-10 bg-[#FAF7FD] dark:bg-[#0F081D] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-brand-muted">
          <Link href="/services" className="hover:text-brand-violet flex items-center gap-1">
            <ChevronLeft className="h-3.5 w-3.5" />
            All Services
          </Link>
          <span>/</span>
          <span>{service.category.name}</span>
          <span>/</span>
          <span className="text-brand-ink dark:text-white font-medium truncate">
            {service.name}
          </span>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Image & Details */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[16/10] border-4 border-white dark:border-purple-900">
              <Image
                src={service.image || "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800&q=80"}
                alt={service.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
              <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-black/80 backdrop-blur-md text-xs font-bold text-brand-deep dark:text-brand-orchid shadow-sm">
                {service.category.name}
              </div>
            </div>

            {/* Description & Treatment Philosophy */}
            <div className="rounded-3xl bg-white dark:bg-[#1A102F] p-8 border border-purple-100 dark:border-purple-900 shadow-sm space-y-6">
              <div>
                <h2 className="font-heading text-2xl font-bold text-brand-ink dark:text-white mb-3">
                  About This Experience
                </h2>
                <p className="text-sm text-brand-ink/80 dark:text-purple-200 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {service.prepInstructions && (
                <div className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-100 dark:border-purple-900">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-brand-deep dark:text-brand-orchid mb-2 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    Preparation & Care Instructions
                  </h3>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    {service.prepInstructions}
                  </p>
                </div>
              )}

              {/* Verified Reviews Section */}
              <div className="pt-6 border-t border-purple-100 dark:border-purple-900/60">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-xl font-bold text-brand-ink dark:text-white">
                    Client Reviews
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                    <Star className="h-4 w-4 fill-current" />
                    <span>5.0 (Verified Clients)</span>
                  </div>
                </div>

                {service.reviews.length === 0 ? (
                  <p className="text-xs text-brand-muted italic">
                    Be the first to review this service after your visit!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {service.reviews.map((r) => (
                      <div
                        key={r.id}
                        className="p-4 rounded-2xl bg-[#FAF7FD] dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900"
                      >
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-bold text-brand-ink dark:text-white">
                            {r.customerName}
                          </span>
                          <div className="flex text-amber-500">
                            {[...Array(r.rating)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-brand-muted leading-relaxed">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Booking Action Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-28 rounded-3xl bg-white dark:bg-[#1A102F] p-8 border border-purple-200/80 dark:border-purple-900 shadow-xl space-y-6">
              <div>
                <span className="text-[11px] font-bold text-brand-violet uppercase tracking-wider">
                  Luxury Salon Experience
                </span>
                <h1 className="font-heading text-3xl font-bold text-brand-ink dark:text-white mt-1">
                  {service.name}
                </h1>
              </div>

              {/* Price & Duration */}
              <div className="flex items-baseline justify-between py-4 border-y border-purple-100 dark:border-purple-900">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-brand-deep dark:text-brand-orchid">
                      ₹{(service.discountedPrice || service.price).toLocaleString("en-IN")}
                    </span>
                    {service.discountedPrice && (
                      <span className="text-sm text-brand-muted line-through">
                        ₹{service.price.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-brand-muted">All inclusive (Taxes included)</span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950 text-xs font-semibold text-brand-royal dark:text-brand-orchid">
                  <Clock className="h-4 w-4" />
                  <span>{service.durationMinutes} mins</span>
                </div>
              </div>

              {/* Trust Checklist */}
              <div className="space-y-2.5 text-xs text-brand-muted">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Includes face & skin undertone assessment</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Complimentary herbal beverage & scalp pressure points</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Free reschedule up to 4 hours before slot</span>
                </div>
              </div>

              {/* Booking CTA */}
              <Link
                href={`/book?service=${service.id}`}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-gradient-to-r from-brand-royal via-brand-violet to-purple-600 text-white font-bold text-sm shadow-soft hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Calendar className="h-4 w-4" />
                <span>Book This Service Now</span>
              </Link>

              <p className="text-center text-[11px] text-brand-muted">
                Fast confirmation • Pay online or at salon
              </p>
            </div>

            {/* Related Services */}
            {relatedServices.length > 0 && (
              <div className="rounded-3xl bg-white dark:bg-[#1A102F] p-6 border border-purple-100 dark:border-purple-900 shadow-sm space-y-4">
                <h3 className="font-heading text-lg font-bold text-brand-ink dark:text-white">
                  Other Popular {service.category.name} Services
                </h3>
                <div className="space-y-3">
                  {relatedServices.map((rs) => (
                    <Link
                      key={rs.id}
                      href={`/services/${rs.slug}`}
                      className="flex items-center justify-between p-3 rounded-2xl hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors border border-transparent hover:border-purple-100"
                    >
                      <div>
                        <p className="text-xs font-bold text-brand-ink dark:text-white">{rs.name}</p>
                        <p className="text-[11px] text-brand-muted">{rs.durationMinutes} mins</p>
                      </div>
                      <span className="text-xs font-bold text-brand-deep dark:text-brand-orchid">
                        ₹{(rs.discountedPrice || rs.price).toLocaleString("en-IN")}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
