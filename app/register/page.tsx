"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Crown, Sparkles, AlertCircle, Phone, Mail, Lock, User, Tag } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [hpWebsite, setHpWebsite] = useState("");
  const [formTimestamp] = useState<number>(() => Date.now());

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          referralCode: referralCode.trim() || undefined,
          hp_website: hpWebsite,
          formTimestamp,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        setIsLoading(false);
      } else {
        // Automatically sign in upon registration
        await signIn("credentials", {
          redirect: false,
          email,
          password,
        });
        router.push("/account");
        router.refresh();
      }
    } catch (err: any) {
      setError("Registration failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="py-16 bg-[#FAF7FD] dark:bg-[#0F081D] min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-md w-full px-4 sm:px-6">
        <div className="rounded-3xl bg-white dark:bg-[#1A102F] p-8 border border-purple-100 dark:border-purple-900 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-brand-deep to-brand-violet text-brand-softgold flex items-center justify-center mx-auto shadow-soft">
              <Crown className="h-6 w-6" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-brand-ink dark:text-white">
              Join the Empire
            </h1>
            <p className="text-xs text-brand-muted">
              Get 100 Welcome Points instantly upon sign up
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="hp_website"
              value={hpWebsite}
              onChange={(e) => setHpWebsite(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />
            <div>
              <label className="text-[11px] font-semibold text-brand-muted">Full Name *</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ananya Roy"
                  className="w-full rounded-xl border border-purple-200 pl-10 pr-3 py-2.5 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-brand-muted">Email Address *</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ananya@example.com"
                  className="w-full rounded-xl border border-purple-200 pl-10 pr-3 py-2.5 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-brand-muted">Phone Number *</label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 00000"
                  className="w-full rounded-xl border border-purple-200 pl-10 pr-3 py-2.5 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-brand-muted">Create Password *</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full rounded-xl border border-purple-200 pl-10 pr-3 py-2.5 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-brand-muted">
                Referral Code (Optional) — Extra +150 Points!
              </label>
              <div className="relative mt-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  placeholder="e.g. ANANYA25"
                  className="w-full rounded-xl border border-purple-200 pl-10 pr-3 py-2.5 text-xs font-mono text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-brand-violet text-white text-xs font-bold hover:bg-brand-royal transition-all shadow-soft disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Create Account & Claim 100 Points"}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-purple-100 dark:border-purple-900 text-xs text-brand-muted">
            <span>Already have an account? </span>
            <Link href="/login" className="font-bold text-brand-violet hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
