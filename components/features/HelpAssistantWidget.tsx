"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  X,
  Search,
  MessageCircle,
  Calendar,
  ChevronRight,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { LANDING_CONTENT } from "@/lib/landing-content";

interface PresetTopic {
  title: string;
  answer: string;
  icon: React.ElementType;
}

const PRESET_TOPICS: PresetTopic[] = [
  {
    title: "How do I book an appointment?",
    answer:
      "Click 'Book Appointment', select your desired service, choose your preferred master stylist (or 'Any Available'), select an open time slot, and confirm. The entire flow takes under 60 seconds.",
    icon: Calendar,
  },
  {
    title: "Pricing & Service Menu",
    answer:
      "Haircuts start at ₹800, French Balayage from ₹3,500, HydraGlow Facials from ₹2,200, and Bridal Packages from ₹14,999. All prices are fixed with zero hidden charges.",
    icon: Sparkles,
  },
  {
    title: "Bridal Packages & 24h Date Hold",
    answer:
      "We offer Silver, Gold, and Royal Maharani bridal packages. When you book a bridal date, it is tentatively held for 24 hours. Once your advance is confirmed by our team, the date is 100% locked exclusively.",
    icon: ShieldCheck,
  },
  {
    title: "How does UPI payment work?",
    answer:
      "Select 'Pay by UPI' during checkout. Scan our salon UPI QR code or transfer directly to beem.luxury@upi. Then enter your 12-digit UPI transaction reference (UTR) so reception confirms it.",
    icon: CreditCard,
  },
  {
    title: "Cancellation & Reschedule Policy",
    answer:
      "Regular appointments can be rescheduled or cancelled with 100% free refund up to 4 hours before the appointment. Bridal package advances are refundable up to 7 days before the wedding date.",
    icon: Clock,
  },
  {
    title: "Salon Location & Timings",
    answer:
      "BEEM is located at 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru. We are open Monday to Sunday, 9:00 AM to 9:00 PM with complimentary valet parking.",
    icon: MapPin,
  },
];

export function HelpAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<PresetTopic | null>(null);

  const salon = LANDING_CONTENT.salon;
  const whatsappUrl = `https://wa.me/${salon.phoneNumeric}?text=${encodeURIComponent(
    "Hello BEEM! I have a question regarding salon appointments."
  )}`;

  const filteredTopics = PRESET_TOPICS.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Floating Help Trigger Button */}
      <aside aria-label="Help and FAQ Assistant" className="fixed bottom-6 right-6 z-40 print:hidden">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setSelectedTopic(null);
          }}
          aria-label="Open Salon Help and FAQ Assistant"
          className="group flex items-center gap-2 px-4 py-3 rounded-full bg-brand-royal text-white shadow-soft hover:shadow-glow hover:scale-105 active:scale-95 transition-all"
        >
          <HelpCircle className="w-5 h-5 text-brand-softgold" />
          <span className="text-xs font-bold tracking-wide hidden sm:inline">Help & FAQ</span>
        </button>
      </aside>

      {/* Help Modal Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="BEEM Salon Help Desk"
          className="fixed bottom-20 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 max-h-[80vh] z-50 rounded-3xl bg-white dark:bg-[#1A102F] border border-purple-200 dark:border-purple-800 shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-brand-deep to-brand-royal text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-brand-softgold">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base leading-none text-brand-softgold">
                  BEEM Help Desk
                </h3>
                <p className="text-[10px] text-purple-200">Instant answers & booking guide</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close Help Assistant"
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Box */}
          <div className="p-3 border-b border-purple-100 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/30">
            <div className="relative">
              <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search pricing, bridal, UPI, timings..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedTopic(null);
                }}
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white dark:bg-[#0F081D] border border-purple-200 dark:border-purple-800 text-brand-ink dark:text-white placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-violet"
              />
            </div>
          </div>

          {/* Body Content */}
          <div className="p-4 overflow-y-auto flex-1 space-y-3 text-xs">
            {selectedTopic ? (
              /* Topic Answer Detail */
              <div className="space-y-3 animate-in fade-in duration-150">
                <button
                  onClick={() => setSelectedTopic(null)}
                  className="text-brand-violet dark:text-brand-orchid font-semibold flex items-center gap-1 hover:underline"
                >
                  ← Back to questions
                </button>
                <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-100 dark:border-purple-900/60">
                  <h4 className="font-heading font-bold text-sm text-brand-ink dark:text-white mb-2">
                    {selectedTopic.title}
                  </h4>
                  <p className="text-brand-muted leading-relaxed">{selectedTopic.answer}</p>
                </div>
              </div>
            ) : (
              /* Questions List */
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase font-bold tracking-wider text-brand-muted mb-2">
                  Frequently Asked
                </p>
                {filteredTopics.length > 0 ? (
                  filteredTopics.map((topic) => {
                    const Icon = topic.icon;
                    return (
                      <button
                        key={topic.title}
                        onClick={() => setSelectedTopic(topic)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-brand-lavender/50 dark:hover:bg-purple-950/60 text-left text-brand-ink dark:text-purple-100 transition-colors group"
                      >
                        <span className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 text-brand-royal dark:text-brand-orchid flex-shrink-0" />
                          <span className="line-clamp-1">{topic.title}</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-brand-muted group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    );
                  })
                ) : (
                  <p className="text-center text-brand-muted py-4">No matching topics found.</p>
                )}
              </div>
            )}
          </div>

          {/* Quick Actions Footer */}
          <div className="p-3 border-t border-purple-100 dark:border-purple-900/60 bg-white dark:bg-[#1A102F] flex items-center gap-2">
            <Link
              href="/book"
              onClick={() => setIsOpen(false)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-brand-royal text-white text-xs font-semibold hover:bg-brand-deep transition-all"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
