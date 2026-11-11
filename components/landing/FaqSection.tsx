"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { LANDING_CONTENT, FaqItem } from "@/lib/landing-content";

export function FaqSection() {
  const faqs = LANDING_CONTENT.faqs;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      aria-label="Frequently Asked Questions"
      className="py-16 sm:py-24 bg-[#FAF5FF] dark:bg-[#140B24] transition-colors"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-lavender text-brand-deep text-xs font-semibold uppercase tracking-wider dark:bg-purple-950 dark:text-purple-200">
            <HelpCircle className="w-3.5 h-3.5 text-brand-softgold" />
            <span>Got Questions?</span>
          </div>

          <h2 className="text-fluid-section font-heading font-bold text-brand-ink dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>

          <p className="text-base sm:text-lg text-brand-muted">
            Everything you need to know about salon policies, deposits, bridal trials, and organic henna safety.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={faq.question}
                className="rounded-2xl bg-white dark:bg-[#1A102F] border border-purple-100 dark:border-purple-900/60 shadow-soft overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left font-heading font-bold text-lg sm:text-xl text-brand-ink dark:text-white hover:text-brand-royal dark:hover:text-brand-orchid transition-colors focus:outline-none focus:ring-2 focus:ring-brand-violet"
                >
                  <span className="pr-4">{faq.question}</span>
                  <div
                    className={`p-1.5 rounded-full bg-brand-lavender text-brand-royal dark:bg-purple-950 dark:text-brand-orchid transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? "rotate-180 bg-brand-royal text-white dark:bg-brand-orchid dark:text-black" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    className="px-5 pb-6 sm:px-6 text-xs sm:text-sm text-brand-muted leading-relaxed border-t border-purple-50 dark:border-purple-900/40 pt-4 animate-in fade-in duration-200"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
