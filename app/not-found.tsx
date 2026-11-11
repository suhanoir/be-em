import React from "react";
import Link from "next/link";
import { Crown, ArrowLeft, Calendar } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4 bg-[#FAF7FD] dark:bg-[#0F081D]">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-brand-deep to-brand-violet text-brand-softgold flex items-center justify-center mx-auto shadow-soft">
          <Crown className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-violet">
            404 • Sanctuary Not Found
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-brand-ink dark:text-white">
            Lost in the Empire?
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted max-w-sm mx-auto">
            The page you are looking for has been moved, renamed, or temporarily tucked away.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-purple-200 dark:border-purple-800 text-xs font-semibold text-brand-deep dark:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return Home</span>
          </Link>
          <Link
            href="/book"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-violet text-white text-xs font-bold hover:bg-brand-royal transition-all shadow-soft"
          >
            <Calendar className="h-4 w-4" />
            <span>Book Appointment</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
