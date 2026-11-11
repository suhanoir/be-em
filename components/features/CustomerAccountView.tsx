"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Sparkles,
  User,
  Share2,
  Copy,
  Check,
  FileText,
  Clock,
  Crown,
  Heart,
  AlertCircle,
  Save,
} from "lucide-react";
import { formatInKolkata } from "@/lib/timezone";

export function CustomerAccountView({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<"appointments" | "profile" | "loyalty" | "invoices">("appointments");
  const [copied, setCopied] = useState(false);

  // Beauty Profile state
  const [allergies, setAllergies] = useState(user.profile?.allergies || "");
  const [skinType, setSkinType] = useState(user.profile?.skinType || "Combination");
  const [hairType, setHairType] = useState(user.profile?.hairType || "Wavy");
  const [scalpType, setScalpType] = useState(user.profile?.scalpType || "Normal");
  const [beautyGoals, setBeautyGoals] = useState(user.profile?.beautyGoals || "");
  const [notes, setNotes] = useState(user.profile?.notes || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMsg("");

    try {
      const res = await fetch("/api/customer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          allergies,
          skinType,
          hairType,
          scalpType,
          beautyGoals,
          notes,
        }),
      });

      if (res.ok) {
        setProfileMsg("✓ Beauty Profile saved and shared with your stylists!");
      }
    } catch (err) {
      setProfileMsg("Failed to save profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const upcomingAppointments = user.appointments.filter(
    (a: any) => a.status === "CONFIRMED" || a.status === "PENDING"
  );
  const pastAppointments = user.appointments.filter(
    (a: any) => a.status === "COMPLETED" || a.status === "CANCELLED" || a.status === "NO_SHOW"
  );

  return (
    <div className="space-y-8">
      {/* Profile Header Banner */}
      <div className="rounded-3xl bg-white dark:bg-[#1A102F] p-6 sm:p-8 border border-purple-100 dark:border-purple-900 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-brand-deep to-brand-violet text-white flex items-center justify-center font-bold text-2xl shadow-soft">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-ink dark:text-white">
                {user.name}
              </h1>
              {user.memberships?.length > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-brand-ink text-[10px] font-black uppercase">
                  VIP Club
                </span>
              )}
            </div>
            <p className="text-xs text-brand-muted mt-0.5">{user.email} • {user.phone}</p>
          </div>
        </div>

        {/* Loyalty badge */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50/40 dark:from-purple-950/60 dark:to-[#150D27] border border-purple-100 dark:border-purple-900">
          <Sparkles className="h-6 w-6 text-brand-softgold" />
          <div>
            <p className="text-xs text-brand-muted">Loyalty Balance</p>
            <p className="text-xl font-black text-brand-deep dark:text-brand-softgold font-heading">
              {user.loyaltyPoints} Points (₹{user.loyaltyPoints})
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-purple-200 dark:border-purple-900 overflow-x-auto no-scrollbar gap-6 text-xs sm:text-sm font-semibold">
        {[
          { id: "appointments", label: `My Bookings (${user.appointments.length})` },
          { id: "profile", label: "Beauty Profile (Allergies & Preferences)" },
          { id: "loyalty", label: "Loyalty & Referral Rewards" },
          { id: "invoices", label: "Invoices & Receipts" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 whitespace-nowrap transition-colors relative ${
              activeTab === tab.id
                ? "text-brand-royal font-bold dark:text-brand-orchid"
                : "text-brand-muted hover:text-brand-ink"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-violet rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* 1. APPOINTMENTS TAB */}
      {activeTab === "appointments" && (
        <div className="space-y-6">
          {/* Upcoming */}
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-brand-ink dark:text-white">
              Upcoming Reserved Visits
            </h2>

            {upcomingAppointments.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white dark:bg-[#1A102F] border border-purple-100 dark:border-purple-900 text-center space-y-3">
                <Calendar className="h-8 w-8 text-brand-muted mx-auto opacity-50" />
                <p className="text-xs text-brand-muted">No upcoming appointments scheduled.</p>
                <Link
                  href="/book"
                  className="inline-block px-5 py-2.5 rounded-full bg-brand-violet text-white text-xs font-bold shadow-soft"
                >
                  Book New Appointment
                </Link>
              </div>
            ) : (
              upcomingAppointments.map((appt: any) => (
                <div
                  key={appt.id}
                  className="rounded-3xl bg-white dark:bg-[#1A102F] p-6 border border-purple-100 dark:border-purple-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
                      {appt.status}
                    </span>
                    <h3 className="font-heading text-lg font-bold text-brand-ink dark:text-white mt-1">
                      #{appt.appointmentNumber}
                    </h3>
                    <p className="text-xs text-brand-muted">
                      {formatInKolkata(appt.date, "EEEE, MMM dd, yyyy")} at {appt.startTime} – {appt.endTime}
                    </p>
                    <p className="text-xs text-brand-royal dark:text-brand-orchid font-medium">
                      Stylist: {appt.stylist?.name || "Assigned Master Stylist"}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {appt.items.map((i: any) => (
                        <span key={i.id} className="text-[11px] px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950 text-brand-ink dark:text-purple-200">
                          {i.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Link
                      href={`/booking/confirmation/${appt.id}`}
                      className="px-4 py-2 rounded-full border border-purple-200 dark:border-purple-800 text-xs font-semibold text-brand-deep dark:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950"
                    >
                      View Details &amp; Invoice
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Past Appointments */}
          {pastAppointments.length > 0 && (
            <div className="space-y-4 pt-6">
              <h2 className="font-heading text-xl font-bold text-brand-ink dark:text-white">
                Visit History
              </h2>
              <div className="space-y-3">
                {pastAppointments.map((appt: any) => (
                  <div
                    key={appt.id}
                    className="rounded-2xl bg-white dark:bg-[#1A102F] p-4 border border-purple-100 dark:border-purple-900 text-xs flex justify-between items-center opacity-85"
                  >
                    <div>
                      <p className="font-bold text-brand-ink dark:text-white">#{appt.appointmentNumber}</p>
                      <p className="text-brand-muted">
                        {formatInKolkata(appt.date, "MMM dd, yyyy")} • ₹{appt.totalAmount}
                      </p>
                    </div>
                    <span className="font-bold text-brand-muted uppercase text-[10px]">
                      {appt.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. BEAUTY PROFILE TAB */}
      {activeTab === "profile" && (
        <form
          onSubmit={handleSaveProfile}
          className="rounded-3xl bg-white dark:bg-[#1A102F] p-8 border border-purple-100 dark:border-purple-900 shadow-sm space-y-6 animate-in fade-in"
        >
          <div>
            <h2 className="font-heading text-2xl font-bold text-brand-ink dark:text-white">
              My Personal Beauty Profile
            </h2>
            <p className="text-xs text-brand-muted mt-1">
              This information is shared with your assigned stylists prior to treatments to ensure customized products and skin safety.
            </p>
          </div>

          {profileMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
              {profileMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-brand-muted">Skin Type</label>
              <select
                value={skinType}
                onChange={(e) => setSkinType(e.target.value)}
                className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
              >
                <option value="Combination">Combination</option>
                <option value="Dry">Dry / Dehydrated</option>
                <option value="Oily">Oily</option>
                <option value="Sensitive">Sensitive</option>
                <option value="Normal">Normal</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-brand-muted">Hair Type</label>
              <select
                value={hairType}
                onChange={(e) => setHairType(e.target.value)}
                className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
              >
                <option value="Straight">Straight</option>
                <option value="Wavy">Wavy</option>
                <option value="Curly">Curly</option>
                <option value="Coily">Coily</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-brand-muted">Scalp Type</label>
              <select
                value={scalpType}
                onChange={(e) => setScalpType(e.target.value)}
                className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
              >
                <option value="Normal">Normal</option>
                <option value="Dry">Dry / Flaky</option>
                <option value="Oily">Oily</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-brand-muted">
              Allergies &amp; Sensitivities (e.g. Ammonia, Fragrance, Nuts)
            </label>
            <textarea
              rows={2}
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g. Sensitive to ammonia; requires patch test before hair color..."
              className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-brand-muted">
              Beauty Goals &amp; Preferences
            </label>
            <textarea
              rows={2}
              value={beautyGoals}
              onChange={(e) => setBeautyGoals(e.target.value)}
              placeholder="e.g. Frizz control, long-lasting wedding glow, face-framing layers..."
              className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-brand-violet text-white text-xs font-bold hover:bg-brand-royal disabled:opacity-50 transition-all shadow-soft"
            >
              <Save className="h-4 w-4" />
              <span>{isSavingProfile ? "Saving..." : "Save Beauty Profile"}</span>
            </button>
          </div>
        </form>
      )}

      {/* 3. LOYALTY & REFERRALS TAB */}
      {activeTab === "loyalty" && (
        <div className="space-y-8 animate-in fade-in">
          {/* Share Referral Card */}
          <div className="rounded-3xl bg-gradient-to-r from-brand-deep via-brand-royal to-purple-800 p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-softgold">
                Give ₹200, Get 200 Points
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold">
                Share Your Exclusive Invite Code
              </h3>
              <p className="text-xs text-purple-200 max-w-md">
                When friends sign up with your code, they get +150 bonus loyalty points, and you receive 200 points on their first appointment!
              </p>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shrink-0">
              <span className="font-mono text-base font-bold text-brand-softgold px-3">
                {user.referralCode}
              </span>
              <button
                onClick={handleCopyReferral}
                className="px-4 py-2 rounded-xl bg-white text-brand-deep text-xs font-bold hover:bg-purple-50 transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied!" : "Copy Code"}</span>
              </button>
            </div>
          </div>

          {/* Transactions Log */}
          <div className="rounded-3xl bg-white dark:bg-[#1A102F] p-8 border border-purple-100 dark:border-purple-900 shadow-sm space-y-4">
            <h3 className="font-heading text-xl font-bold text-brand-ink dark:text-white">
              Loyalty Points Activity
            </h3>
            <div className="divide-y divide-purple-100 dark:divide-purple-900">
              {user.loyaltyTransactions?.map((txn: any) => (
                <div key={txn.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-semibold text-brand-ink dark:text-white">{txn.description}</p>
                    <p className="text-[11px] text-brand-muted">
                      {formatInKolkata(txn.createdAt, "MMM dd, yyyy")}
                    </p>
                  </div>
                  <span
                    className={`font-bold ${
                      txn.points > 0 ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {txn.points > 0 ? `+${txn.points}` : txn.points} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. INVOICES TAB */}
      {activeTab === "invoices" && (
        <div className="rounded-3xl bg-white dark:bg-[#1A102F] p-8 border border-purple-100 dark:border-purple-900 shadow-sm space-y-4 animate-in fade-in">
          <h2 className="font-heading text-xl font-bold text-brand-ink dark:text-white">
            Tax Invoices &amp; Receipts
          </h2>
          <div className="divide-y divide-purple-100 dark:divide-purple-900">
            {user.appointments
              .filter((a: any) => a.invoice)
              .map((a: any) => (
                <div key={a.id} className="py-4 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-brand-ink dark:text-white">
                      Invoice #{a.invoice.invoiceNumber}
                    </p>
                    <p className="text-brand-muted">
                      {formatInKolkata(a.date, "MMM dd, yyyy")} • ₹{a.invoice.totalAmount} (GST 18% inclusive)
                    </p>
                  </div>
                  <Link
                    href={`/booking/confirmation/${a.id}`}
                    className="px-4 py-2 rounded-full border border-purple-200 dark:border-purple-800 text-xs font-semibold text-brand-deep dark:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950"
                  >
                    Print / View
                  </Link>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
