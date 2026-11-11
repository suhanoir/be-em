"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Crown, KeyRound, MessageSquare, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          code: code.trim(),
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to reset password");
      } else {
        setSuccess("Password updated successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const whatsappRequestLink = `https://wa.me/919876543210?text=${encodeURIComponent(
    `Hello BEEM Salon! I need a one-time password reset code for my account. My registered email is: ${email || "[Your Email]"}`
  )}`;

  return (
    <div className="py-16 bg-[#FAF7FD] dark:bg-[#0F081D] min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-md w-full px-4 sm:px-6">
        <div className="rounded-3xl bg-white dark:bg-[#1A102F] p-8 border border-purple-100 dark:border-purple-900 shadow-xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-brand-deep to-brand-violet text-brand-softgold flex items-center justify-center mx-auto shadow-soft">
              <KeyRound className="h-6 w-6 text-white" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-brand-ink dark:text-white">
              Reset Your Password
            </h1>
            <p className="text-xs text-brand-muted">
              Enter your registered email and the 6-digit code provided by the salon.
            </p>
          </div>

          {/* WhatsApp Helper Card */}
          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-xs space-y-2">
            <p className="font-bold text-brand-deep dark:text-purple-200 flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-emerald-600" />
              <span>Need a reset code?</span>
            </p>
            <p className="text-brand-muted leading-relaxed">
              Our salon uses key-free direct verification. Contact our reception on WhatsApp to receive an instant one-time code.
            </p>
            <a
              href={whatsappRequestLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-brand-violet dark:text-brand-orchid hover:underline mt-1"
            >
              <span>Tap here to request code on WhatsApp →</span>
            </a>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs font-semibold flex items-center gap-2 border border-red-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-2 border border-emerald-200">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-brand-muted">Registered Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. ananya@example.com"
                className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-brand-muted">6-Digit Salon Reset Code *</label>
              <input
                type="text"
                required
                maxLength={8}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="e.g. 582914"
                className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 text-xs font-mono font-bold tracking-widest text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-brand-muted">New Password *</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-brand-muted">Confirm New Password *</label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full bg-brand-violet hover:bg-brand-royal text-white text-xs font-bold transition-all shadow-soft disabled:opacity-50"
            >
              {isLoading ? "Updating Password..." : "Set New Password"}
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-muted hover:text-brand-ink"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
