"use client";

import React, { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error boundary triggered:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4 bg-[#FAF7FD] dark:bg-[#0F081D]">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="h-16 w-16 rounded-full bg-red-100 text-red-600 dark:bg-red-950 flex items-center justify-center mx-auto">
          <AlertCircle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-red-600">
            System Notice
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-ink dark:text-white">
            Something Paused Our Pampering
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted max-w-sm mx-auto">
            An unexpected error occurred. Our technical concierge team has been notified.
          </p>
        </div>

        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-violet text-white text-xs font-bold hover:bg-brand-royal transition-all shadow-soft"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reload &amp; Try Again</span>
        </button>
      </div>
    </div>
  );
}
