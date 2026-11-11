"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Crown, Sparkles, AlertCircle, Mail, Lock, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hpWebsite, setHpWebsite] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 1-Click Demo Login
  const handleQuickLogin = async (demoEmail: string, demoPass: string) => {
    setIsLoading(true);
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email: demoEmail,
      password: demoPass,
    });
    if (res?.error) {
      setError(res.error);
      setIsLoading(false);
    } else {
      router.push(demoEmail.includes("admin") ? "/admin" : "/account");
      router.refresh();
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hpWebsite) {
      // Honeypot caught bot
      setError("Login rejected.");
      return;
    }

    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
      setIsLoading(false);
    } else {
      router.push("/account");
      router.refresh();
    }
  };

  return (
    <div className="py-16 bg-[#FAF7FD] dark:bg-[#0F081D] min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-md w-full px-4 sm:px-6">
        <div className="rounded-3xl bg-white dark:bg-[#1A102F] p-8 border border-purple-100 dark:border-purple-900 shadow-xl space-y-6">
          {/* Brand Emblem */}
          <div className="text-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-brand-deep to-brand-violet text-brand-softgold flex items-center justify-center mx-auto shadow-soft">
              <Crown className="h-6 w-6" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-brand-ink dark:text-white">
              Welcome to BEEM
            </h1>
            <p className="text-xs text-brand-muted">
              Access your appointments, beauty profile, and loyalty rewards
            </p>
          </div>

          {/* Quick Demo Credentials Bar */}
          <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-deep dark:text-purple-300 block">
              1-Click Demo Logins:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("customer@beem.test", "Customer@123")}
                className="flex-1 py-1.5 px-2 rounded-xl bg-white dark:bg-[#150D27] border border-purple-200 dark:border-purple-700 text-xs font-semibold text-brand-ink dark:text-purple-200 hover:border-brand-violet"
              >
                Customer Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("admin@beem.test", "Admin@123")}
                className="flex-1 py-1.5 px-2 rounded-xl bg-purple-200/70 dark:bg-purple-900 border border-purple-300 text-xs font-bold text-brand-deep dark:text-brand-orchid hover:border-brand-violet"
              >
                Admin Demo
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Email Sign In Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {/* Honeypot field */}
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
              <label className="text-[11px] font-semibold text-brand-muted">Email Address</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@beem.test"
                  className="w-full rounded-xl border border-purple-200 pl-10 pr-3 py-2.5 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-brand-muted">Password</label>
                <Link
                  href="/reset-password"
                  className="text-[11px] font-semibold text-brand-violet dark:text-brand-orchid hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-purple-200 pl-10 pr-3 py-2.5 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-brand-violet text-white text-xs font-bold hover:bg-brand-royal transition-all shadow-soft disabled:opacity-50"
            >
              {isLoading ? "Signing In..." : "Sign In to Account"}
            </button>
          </form>

          {/* Bottom link to Register */}
          <div className="text-center pt-2 border-t border-purple-100 dark:border-purple-900 text-xs text-brand-muted">
            <span>Don&apos;t have a BEEM account? </span>
            <Link href="/register" className="font-bold text-brand-violet hover:underline">
              Create Account (+100 pts)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
