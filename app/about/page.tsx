import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Crown, Heart, ShieldCheck, Sparkles, Award, Users, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "About Our Salon & Philosophy | BEEM (Beauty Empire)",
  description: "Learn about the heritage, master artisans, and sustainable luxury philosophy behind BEEM Beauty Empire in Bengaluru.",
};

export default function AboutPage() {
  return (
    <div className="py-16 bg-[#FAF7FD] dark:bg-[#0F081D] min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lavender text-brand-deep dark:bg-purple-950 dark:text-purple-200 text-xs font-bold">
            <Crown className="h-3.5 w-3.5 text-brand-softgold" />
            <span>The BEEM Heritage</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-6xl font-bold text-brand-ink dark:text-white leading-tight">
            Crafting Unapologetic Radiance Since 2018.
          </h1>
          <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
            Founded in Indiranagar, Bengaluru, BEEM (Beauty Empire) was born from a singular conviction: 
            that luxury grooming should be an immersive sanctuary of self-celebration, clinical precision, 
            and heritage artisanal mastery.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-4 border-white dark:border-purple-900">
            <Image
              src="https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800&q=80"
              alt="BEEM Sanctuary Ambiance"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-4">
            <h2 className="font-heading text-3xl font-bold text-brand-ink dark:text-white">
              The Architecture of Care
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
              From our private bridal dressing suites with tailored lighting to our ergonomic backwash chairs 
              and organic herbal refreshments, every detail at BEEM is calibrated to restore tranquility.
            </p>
            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
              We never perform cookie-cutter cuts or heavy, cakey makeup. Every consultation begins with an 
              in-depth assessment of your face shape, skin undertone, lifestyle demands, and hair health.
            </p>

            <div className="space-y-2 pt-2 text-xs font-medium text-brand-ink dark:text-purple-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>100% Ammonia-Free European Formulations (L&apos;Oréal Inoa, Olaplex)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Chemical-Free Organic Sojat Henna Cones with 48h stain warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Hospital-Grade Autoclave Sterilization for all nail and metal instruments</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pillars of Excellence */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-white dark:bg-[#1A102F] p-8 border border-purple-100 dark:border-purple-900 shadow-sm text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-brand-violet mx-auto">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-xl font-bold text-brand-ink dark:text-white">
              Trained Virtuosos
            </h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Certified across London and Zurich academies with mandatory bi-annual runway trend masterclasses.
            </p>
          </div>

          <div className="rounded-3xl bg-white dark:bg-[#1A102F] p-8 border border-purple-100 dark:border-purple-900 shadow-sm text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-brand-violet mx-auto">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="font-heading text-xl font-bold text-brand-ink dark:text-white">
              Pure Formulations
            </h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Strictly cruelty-free, gentle on sensitive scalps, and safe for expectant and nursing mothers.
            </p>
          </div>

          <div className="rounded-3xl bg-white dark:bg-[#1A102F] p-8 border border-purple-100 dark:border-purple-900 shadow-sm text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-brand-violet mx-auto">
              <Heart className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="font-heading text-xl font-bold text-brand-ink dark:text-white">
              Uncompromising Luxury
            </h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Valet parking, private suites, and an intuitive 60-second digital booking engine with zero wait times.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
