"use client";

import React, { useState } from "react";
import { KeyRound, Copy, Check, MessageSquare, AlertCircle } from "lucide-react";

export function CustomerResetCodeButton({
  customerId,
  customerName,
  customerPhone,
}: {
  customerId: string;
  customerName: string;
  customerPhone: string;
}) {
  const [loading, setLoading] = useState(false);
  const [resetData, setResetData] = useState<{
    code: string;
    waLink: string | null;
    expiresAt: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/customers/${customerId}/reset-code`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to generate code");
      } else {
        setResetData(data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate code");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (!resetData) return;
    navigator.clipboard.writeText(resetData.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-2 border-t border-purple-100 dark:border-purple-900/60">
      {!resetData ? (
        <button
          type="button"
          disabled={loading}
          onClick={handleGenerate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-purple-200 dark:border-purple-800 text-[11px] font-semibold text-brand-deep dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors disabled:opacity-50"
        >
          <KeyRound className="h-3.5 w-3.5 text-brand-violet" />
          <span>{loading ? "Generating..." : "Generate Password Reset Code"}</span>
        </button>
      ) : (
        <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-brand-deep dark:text-purple-200">
              One-Time Reset Code (Expires in 2 hrs):
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-sm font-bold bg-white dark:bg-[#150D27] px-2 py-0.5 rounded border border-purple-300 text-brand-royal dark:text-brand-orchid">
                {resetData.code}
              </span>
              <button
                type="button"
                onClick={copyCode}
                className="p-1 hover:bg-purple-100 rounded text-brand-muted hover:text-brand-ink"
                title="Copy Code"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {resetData.waLink && (
            <a
              href={resetData.waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition-colors"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Share Code via WhatsApp</span>
            </a>
          )}
        </div>
      )}

      {error && (
        <div className="mt-1 flex items-center gap-1 text-[11px] text-red-600 font-semibold">
          <AlertCircle className="h-3 w-3 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
