"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, Clock, Calendar, Shield, Award, CheckCircle2 } from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function AdminStylistsView({ initialStylists }: { initialStylists: any[] }) {
  const [stylists, setStylists] = useState(initialStylists);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-brand-ink dark:text-white">
          Artisans &amp; Staff Management
        </h1>
        <p className="text-xs text-brand-muted">
          Manage senior creative directors, schedules, commission structures, and service capacity
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stylists.map((st) => (
          <div
            key={st.id}
            className="rounded-3xl bg-white dark:bg-[#120822] p-6 border border-purple-100 dark:border-purple-900 shadow-sm space-y-5"
          >
            <div className="flex items-start gap-4">
              <div className="relative h-16 w-16 rounded-2xl overflow-hidden shrink-0 shadow-md">
                <Image
                  src={st.avatar || "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80"}
                  alt={st.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-xl font-bold text-brand-ink dark:text-white">
                    {st.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Active Staff
                  </span>
                </div>
                <p className="text-xs text-brand-violet font-semibold">{st.email} • {st.phone}</p>
                <div className="flex items-center gap-3 text-xs text-brand-muted mt-1">
                  <span>{st.experienceYears}+ Yrs Exp</span>
                  <span>•</span>
                  <span>★ {st.rating.toFixed(2)} Rating</span>
                  <span>•</span>
                  <span>{(st.commissionRate * 100).toFixed(0)}% Commission</span>
                </div>
              </div>
            </div>

            {/* Specialties */}
            <div className="p-3 rounded-2xl bg-[#FAF7FD] dark:bg-purple-950/40 text-xs">
              <p className="font-bold text-brand-deep dark:text-brand-orchid text-[11px] uppercase tracking-wider">
                Specialties:
              </p>
              <p className="text-brand-ink/80 dark:text-purple-200 mt-0.5">{st.specialties}</p>
            </div>

            {/* 7-Day Schedule Matrix */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-brand-muted mb-2">
                Weekly Schedule:
              </p>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {DAYS.map((dayName, idx) => {
                  const sched = st.schedules.find((s: any) => s.dayOfWeek === idx);
                  const isWorking = sched ? sched.isWorkingDay : true;

                  return (
                    <div
                      key={dayName}
                      className={`p-2 rounded-xl border ${
                        isWorking
                          ? "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800 text-brand-deep dark:text-white"
                          : "bg-gray-100 dark:bg-gray-900 border-gray-200 text-gray-400"
                      }`}
                    >
                      <p className="font-bold text-[10px]">{dayName}</p>
                      <p className="text-[9px] mt-0.5 font-medium">{isWorking ? "09-19" : "OFF"}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
