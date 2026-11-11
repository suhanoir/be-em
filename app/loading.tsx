import React from "react";
import { Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#FAF7FD] dark:bg-[#0F081D]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-14 w-14">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-violet opacity-40"></span>
          <div className="relative inline-flex rounded-full h-14 w-14 bg-gradient-to-tr from-brand-deep to-brand-violet items-center justify-center text-brand-softgold shadow-soft">
            <Sparkles className="h-6 w-6 animate-spin" />
          </div>
        </div>
        <p className="font-heading text-lg font-bold text-brand-deep dark:text-brand-orchid tracking-wide">
          Curating Elegance...
        </p>
      </div>
    </div>
  );
}
