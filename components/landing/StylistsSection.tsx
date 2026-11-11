"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, Award, Calendar, ArrowRight, Sparkles } from "lucide-react";
import { LANDING_CONTENT } from "@/lib/landing-content";

export function StylistsSection() {
  const stylists = LANDING_CONTENT.stylists;

  return (
    <section
      id="stylists"
      aria-label="Meet Our Master Artists"
      className="py-16 sm:py-24 bg-[#FAF5FF] dark:bg-[#140B24] transition-colors"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-lavender text-brand-deep text-xs font-semibold uppercase tracking-wider dark:bg-purple-950 dark:text-purple-200">
              <Sparkles className="w-3.5 h-3.5 text-brand-softgold" />
              <span>Artistry in Residence</span>
            </div>
            <h2 className="text-fluid-section font-heading font-bold text-brand-ink dark:text-white tracking-tight">
              Meet the Master Stylists
            </h2>
            <p className="text-base sm:text-lg text-brand-muted">
              London & Mumbai trained directors, third-generation henna artists, and clinical aestheticians dedicated to your radiance.
            </p>
          </div>

          <Link
            href="/stylists"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-royal hover:text-brand-violet dark:text-brand-orchid dark:hover:text-white transition-colors group self-start md:self-auto"
          >
            <span>View All Artist Schedules</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4 Stylist Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stylists.map((st) => (
            <div
              key={st.id}
              className="group relative flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-[#1A102F] border border-purple-100 dark:border-purple-900/60 shadow-soft hover:shadow-glow hover:-translate-y-1.5 transition-all duration-300"
            >
              {/* Top Avatar Graphic Canvas */}
              <div>
                <div className="relative w-full aspect-square rounded-2xl bg-gradient-to-tr from-brand-deep via-brand-royal to-purple-400 p-4 flex flex-col justify-between text-white overflow-hidden mb-5 shadow-sm">
                  {/* Rating Badge */}
                  <div className="relative z-10 self-end flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-xs font-bold text-amber-300">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{st.rating.toFixed(2)}</span>
                  </div>

                  {/* Stylist Initials / Graphic Monogram */}
                  <div className="self-center font-heading font-bold text-5xl text-brand-softgold/80 group-hover:scale-110 transition-transform">
                    {st.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>

                  {/* Years Experience */}
                  <div className="relative z-10 text-[11px] font-semibold text-purple-200">
                    {st.experienceYears}+ Years Experience
                  </div>
                </div>

                <h3 className="font-heading font-bold text-xl text-brand-ink dark:text-white mb-1 group-hover:text-brand-royal dark:group-hover:text-brand-orchid transition-colors">
                  {st.name}
                </h3>

                <p className="text-xs font-semibold text-brand-violet dark:text-brand-orchid mb-2">
                  {st.role}
                </p>

                <p className="text-xs text-brand-muted leading-relaxed line-clamp-3 mb-4">
                  {st.bio}
                </p>

                <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[11px] text-brand-ink dark:text-purple-200 mb-6">
                  <span className="font-bold text-brand-deep dark:text-brand-softgold">Specialty: </span>
                  {st.specialty}
                </div>
              </div>

              {/* Direct Booking Button */}
              <Link
                href={`/book?stylist=${st.id}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-lavender text-brand-deep hover:bg-brand-royal hover:text-white dark:bg-purple-950/60 dark:text-purple-200 dark:hover:bg-brand-royal dark:hover:text-white text-xs font-semibold transition-all shadow-sm active:scale-95"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book with {st.name.split(" ")[0]}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
