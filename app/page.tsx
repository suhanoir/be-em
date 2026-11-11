import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Calendar,
  Crown,
  Heart,
  Star,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Scissors,
  Flower2,
  Gem,
  Award,
} from "lucide-react";
import { db } from "@/lib/db";

export const revalidate = 60; // ISR 60 seconds

export default async function HomePage() {
  // Fetch featured services, bridal packages, stylists, gallery, reviews, offers
  const services = await db.service.findMany({
    where: { isPopular: true, isActive: true },
    include: { category: true },
    take: 6,
  });

  const bridalPackages = await db.bridalPackage.findMany({
    orderBy: { price: "asc" },
  });

  const stylists = await db.stylist.findMany({
    where: { isActive: true },
    take: 4,
  });

  const galleryItems = await db.galleryItem.findMany({
    where: { isFeatured: true },
    take: 6,
  });

  const reviews = await db.review.findMany({
    where: { isVerified: true, rating: 5 },
    take: 3,
    include: { stylist: true },
  });

  const activeOffer = await db.offer.findFirst({
    where: { isActive: true },
    include: { promoCode: true },
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FDFBF9] via-[#FAF5FF] to-white dark:from-[#0F081D] dark:via-[#160D2C] dark:to-[#0F081D] py-16 sm:py-24 lg:py-28">
        {/* Soft Background Blur Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-300/20 dark:bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-pink-200/20 dark:bg-pink-950/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-lavender text-brand-deep text-xs font-semibold tracking-wide border border-purple-200/60 dark:bg-purple-950/60 dark:text-purple-200 dark:border-purple-800">
                <Crown className="h-3.5 w-3.5 text-brand-softgold" />
                <span>Bengaluru&apos;s Crown Luxury Beauty Sanctuary</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-brand-ink dark:text-white leading-[1.1]">
                Where Timeless <br />
                <span className="bg-gradient-to-r from-brand-deep via-brand-royal to-brand-violet bg-clip-text text-transparent dark:from-brand-orchid dark:via-purple-300 dark:to-white">
                  Royalty
                </span>{" "}
                Meets Modern Artistry.
              </h1>

              <p className="text-base sm:text-lg text-brand-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Step into an oasis of tailored haircare, glass-skin clinical facials, bespoke royal bridal makeovers, and heirloom Rajasthani mehendi. Designed to elevate your natural radiance.
              </p>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/book"
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-brand-royal via-brand-violet to-purple-600 text-white font-semibold text-base shadow-soft hover:shadow-glow hover:scale-105 active:scale-95 transition-all"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Book Appointment (Under 60s)</span>
                </Link>

                <Link
                  href="/bridal"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-amber-300/80 bg-gradient-to-r from-amber-50 to-orange-50/50 hover:bg-amber-100 text-amber-900 font-semibold text-base dark:from-amber-950/40 dark:to-purple-950/40 dark:border-amber-700/60 dark:text-amber-200 transition-all shadow-sm"
                >
                  <Crown className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span>Explore Bridal Suites</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-purple-100 dark:border-purple-900/50 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-brand-muted">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>100% Organic Henna</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span>4.95 Rating (600+ Reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-violet" />
                  <span>Valet & Private Bridal Lounge</span>
                </div>
              </div>
            </div>

            {/* Right Hero Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-purple-900 aspect-[4/5]">
                  <Image
                    src="https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800&q=80"
                    alt="BEEM Hair & Bridal Transformation"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    priority
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/80 via-transparent to-transparent" />
                  
                  {/* Floating Testimonial Tag */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-purple-100 dark:bg-[#1A102F]/95 dark:border-purple-800">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-brand-royal text-white flex items-center justify-center font-bold">
                        P
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1 text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-current" />
                          ))}
                        </div>
                        <p className="text-xs font-semibold text-brand-ink dark:text-white">
                          &quot;My wedding look exceeded every dream!&quot;
                        </p>
                        <p className="text-[10px] text-brand-muted">Priya M. • Real Bride</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative floating badge */}
                <div className="absolute -top-4 -right-4 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white p-3.5 shadow-gold animate-bounce duration-1000 hidden sm:block">
                  <Sparkles className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Offers & Promo Banner */}
      {activeOffer && (
        <section className="bg-gradient-to-r from-brand-deep via-brand-royal to-purple-800 py-3.5 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-softgold shrink-0 animate-pulse" />
              <p className="text-sm font-medium">
                <span className="font-bold text-brand-softgold">{activeOffer.discountText}</span> —{" "}
                {activeOffer.title}: {activeOffer.description}
              </p>
            </div>
            {activeOffer.promoCode && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-purple-200">Use Code:</span>
                <span className="px-2.5 py-1 rounded-md bg-white/20 font-mono text-xs font-bold tracking-wider text-brand-softgold border border-white/30">
                  {activeOffer.promoCode.code}
                </span>
                <Link
                  href="/book"
                  className="px-3 py-1 rounded-full bg-brand-softgold text-brand-ink text-xs font-bold hover:bg-yellow-300 transition-colors"
                >
                  Apply & Book
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3. Featured Services Section */}
      <section className="py-20 bg-white dark:bg-[#0F081D]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold tracking-widest text-brand-violet uppercase">
                Curated Indulgence
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-ink dark:text-white mt-1">
                Signature Experiences
              </h2>
            </div>
            <Link
              href="/services"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-brand-royal dark:text-brand-orchid hover:underline"
            >
              <span>Explore All 10 Categories</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((svc) => (
              <div
                key={svc.id}
                className="group flex flex-col rounded-3xl overflow-hidden border border-purple-100 bg-[#FAF7FD]/50 hover:bg-white shadow-sm hover:shadow-xl hover:border-purple-200 dark:bg-[#1A102F]/60 dark:border-purple-900/60 dark:hover:bg-[#1A102F] transition-all duration-300"
              >
                <div className="relative h-56 w-full overflow-hidden">
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
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-heading text-xl font-bold text-brand-ink dark:text-white group-hover:text-brand-violet transition-colors">
                      {svc.name}
                    </h3>
                  </div>

                  <p className="text-xs text-brand-muted line-clamp-2 mb-4 leading-relaxed">
                    {svc.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-purple-100 dark:border-purple-900/50 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-brand-deep dark:text-brand-orchid">
                          ₹{svc.discountedPrice || svc.price}
                        </span>
                        {svc.discountedPrice && (
                          <span className="text-xs text-brand-muted line-through">
                            ₹{svc.price}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-brand-muted">
                        <Clock className="h-3 w-3" />
                        <span>{svc.durationMinutes} mins</span>
                      </div>
                    </div>

                    <Link
                      href={`/book?service=${svc.id}`}
                      className="px-4 py-2 rounded-full bg-brand-violet text-white text-xs font-semibold hover:bg-brand-royal transition-colors shadow-sm"
                    >
                      Book Service
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Royal Bridal Teaser Section (Gold Highlights) */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#2A0845] via-[#4C1D95] to-[#2E1065] text-white py-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 text-brand-softgold text-xs font-bold border border-amber-400/30">
                <Crown className="h-4 w-4" />
                <span>The Imperial Bridal Suite</span>
              </div>

              <h2 className="font-heading text-4xl sm:text-5xl font-bold leading-tight">
                Your Fairy-Tale Walk Begins at BEEM.
              </h2>

              <p className="text-sm sm:text-base text-purple-200 leading-relaxed">
                From trial makeup consultations and pre-bridal glow schedules to luxury venue travel 
                and multi-person entourage care. Lock your auspicious dates with our advance protection.
              </p>

              <div className="space-y-2.5 text-sm text-purple-100">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-brand-softgold shrink-0" />
                  <span>3 Bespoke Packages: Silver Radiance, Gold Empress, Diamond Imperial</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-brand-softgold shrink-0" />
                  <span>Venue / Home visit option with distance-based pricing</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-brand-softgold shrink-0" />
                  <span>Bridal Party Entourage discount for mothers & sisters</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/bridal"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 text-brand-ink font-bold text-sm shadow-gold hover:scale-105 active:scale-95 transition-all"
                >
                  <span>Explore Bridal Packages</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Bridal Cards Preview */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {bridalPackages.map((bp) => (
                <div
                  key={bp.id}
                  className={`rounded-3xl p-5 border flex flex-col justify-between transition-all ${
                    bp.isPopular
                      ? "bg-gradient-to-b from-white/15 to-white/5 border-amber-400/80 shadow-gold scale-[1.02]"
                      : "bg-white/10 border-white/15 hover:border-white/30"
                  }`}
                >
                  <div>
                    {bp.isPopular && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-400 text-brand-ink text-[10px] font-extrabold uppercase mb-2">
                        Most Loved
                      </span>
                    )}
                    <h3 className="font-heading text-lg font-bold">{bp.name}</h3>
                    <p className="text-xs text-purple-200 mt-1 line-clamp-2">{bp.tagline}</p>
                    <div className="mt-4 mb-2">
                      <span className="text-2xl font-bold text-brand-softgold">
                        ₹{bp.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="text-[11px] text-purple-300">
                      Advance deposit: ₹{bp.advanceDeposit.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <Link
                    href={`/book?bridal=${bp.id}`}
                    className="mt-6 block text-center py-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-brand-deep text-xs font-semibold transition-all"
                  >
                    Select Package
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Master Stylists Section */}
      <section className="py-20 bg-[#FAF7FD] dark:bg-[#120924]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-widest text-brand-violet uppercase">
              Artisans of Excellence
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-ink dark:text-white mt-1">
              Meet Our Master Stylists
            </h2>
            <p className="text-sm text-brand-muted mt-2">
              Every BEEM artisan brings over 6+ years of international runway and celebrity salon experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stylists.map((st) => (
              <div
                key={st.id}
                className="group rounded-3xl overflow-hidden bg-white dark:bg-[#1A102F] border border-purple-100 dark:border-purple-900 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={st.avatar || "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80"}
                    alt={st.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    <span>{st.rating.toFixed(2)}</span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-heading text-xl font-bold text-brand-ink dark:text-white">
                    {st.name}
                  </h3>
                  <p className="text-xs text-brand-violet font-semibold mb-2">
                    {st.experienceYears}+ Years Experience
                  </p>
                  <p className="text-xs text-brand-muted line-clamp-2 mb-4 leading-relaxed">
                    {st.bio}
                  </p>
                  <Link
                    href={`/book?stylist=${st.id}`}
                    className="block text-center w-full py-2 rounded-full border border-purple-200 hover:bg-brand-violet hover:text-white hover:border-brand-violet text-xs font-semibold text-brand-deep dark:border-purple-800 dark:text-purple-200 transition-colors"
                  >
                    Book with {st.name.split(" ")[0]}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Instagram-Style Gallery Grid */}
      <section className="py-20 bg-white dark:bg-[#0F081D]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold tracking-widest text-brand-violet uppercase">
                Visual Portfolio
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brand-ink dark:text-white mt-1">
                Real Client Transformations
              </h2>
            </div>
            <Link
              href="/gallery"
              className="mt-3 sm:mt-0 text-xs sm:text-sm font-semibold text-brand-royal dark:text-brand-orchid hover:underline flex items-center gap-1"
            >
              <span>View Full Lookbook</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white">
                  <span className="text-[10px] font-bold text-brand-softgold">{item.category}</span>
                  <p className="text-xs font-semibold truncate">{item.title}</p>
                  <div className="flex items-center gap-1 text-[10px] text-pink-300 mt-1">
                    <Heart className="h-3 w-3 fill-current" />
                    <span>{item.likesCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Verified Customer Testimonials */}
      <section className="py-20 bg-[#FAF7FD] dark:bg-[#120924]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-widest text-brand-violet uppercase">
              Client Testimonials
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brand-ink dark:text-white mt-1">
              Loved by Bengaluru&apos;s Connoisseurs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="rounded-3xl bg-white dark:bg-[#1A102F] p-7 border border-purple-100 dark:border-purple-900 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-brand-ink/90 dark:text-purple-100 leading-relaxed italic">
                    &quot;{rev.comment}&quot;
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-purple-100 dark:border-purple-900/50 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-brand-ink dark:text-white">{rev.customerName}</p>
                    <p className="text-brand-muted">Verified Client</p>
                  </div>
                  {rev.ownerReply && (
                    <span className="text-[10px] text-brand-violet bg-brand-lavender px-2 py-0.5 rounded-full dark:bg-purple-900/50 dark:text-brand-orchid">
                      Owner Replied
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Location & Salon Sanctuary Hours */}
      <section className="py-16 bg-white dark:bg-[#0F081D] border-t border-purple-100 dark:border-purple-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-purple-50 via-pink-50/40 to-purple-50 dark:from-purple-950/40 dark:via-[#1A102F] dark:to-purple-950/40 p-8 sm:p-12 border border-purple-200/60 dark:border-purple-900">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <h3 className="font-heading text-3xl font-bold text-brand-deep dark:text-brand-orchid">
                  Experience Our Indiranagar Sanctuary
                </h3>
                <p className="text-sm text-brand-muted leading-relaxed">
                  Located on the iconic 100 Feet Road with dedicated valet parking, private bridal dressing 
                  suites, soothing aromatic tea service, and sterile hygiene protocols.
                </p>
                <div className="flex flex-wrap gap-6 text-sm text-brand-ink dark:text-purple-200">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-brand-violet" />
                    <span>Open 7 Days: 09:00 AM – 08:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-brand-violet" />
                    <span>Luxury Promenade, 100 Ft Rd, Indiranagar</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                <Link
                  href="/book"
                  className="text-center px-6 py-3.5 rounded-full bg-brand-violet text-white font-semibold text-sm hover:bg-brand-royal transition-colors shadow-soft"
                >
                  Reserve Your Visit
                </Link>
                <a
                  href="https://maps.google.com/?q=Indiranagar+Bengaluru"
                  target="_blank"
                  rel="noreferrer"
                  className="text-center px-6 py-3.5 rounded-full border border-purple-300 dark:border-purple-800 text-brand-deep dark:text-purple-200 font-semibold text-sm hover:bg-white dark:hover:bg-purple-950 transition-colors"
                >
                  Get Driving Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
