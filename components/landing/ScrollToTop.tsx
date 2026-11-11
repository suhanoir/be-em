"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll back to top of page"
      className="fixed right-6 bottom-24 lg:bottom-6 z-30 p-3 rounded-full bg-white/90 dark:bg-[#1A102F]/90 text-brand-royal dark:text-brand-softgold border border-purple-200/80 dark:border-purple-800 shadow-xl backdrop-blur-md hover:bg-brand-lavender hover:scale-110 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-brand-violet"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
