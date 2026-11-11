"use client";

import React from "react";
import { Phone, MessageCircle } from "lucide-react";
import { getSalonWhatsAppUrl } from "@/lib/notifications";

export function StickyContactButtons() {
  const whatsappUrl = getSalonWhatsAppUrl();
  const phone = process.env.NEXT_PUBLIC_SALON_PHONE || "+919876543210";

  return (
    <aside
      aria-label="Direct contact options"
      className="fixed bottom-6 left-6 z-30 flex flex-col gap-3 print:hidden"
    >
      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative flex h-13 w-13 p-3 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 hover:scale-110 active:scale-95 transition-all"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="pointer-events-none absolute left-14 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1 text-xs font-semibold text-white opacity-0 shadow-md group-hover:opacity-100 transition-opacity">
          Chat on WhatsApp
        </span>
      </a>

      {/* Call Button */}
      <a
        href={`tel:${phone}`}
        aria-label="Call salon directly"
        className="group relative flex h-13 w-13 p-3 items-center justify-center rounded-full bg-brand-royal text-white shadow-lg hover:bg-brand-deep hover:scale-110 active:scale-95 transition-all"
      >
        <Phone className="h-6 w-6" />
        <span className="pointer-events-none absolute left-14 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1 text-xs font-semibold text-white opacity-0 shadow-md group-hover:opacity-100 transition-opacity">
          Call +91 98765 43210
        </span>
      </a>
    </aside>
  );
}
