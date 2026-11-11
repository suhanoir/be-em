"use client";

import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageSquare, CheckCircle2, Send } from "lucide-react";
import { getSalonWhatsAppUrl } from "@/lib/notifications";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const whatsappUrl = getSalonWhatsAppUrl();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-16 bg-[#FAF7FD] dark:bg-[#0F081D] min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold tracking-widest text-brand-violet uppercase">
            Connect With Us
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-brand-ink dark:text-white mt-1">
            Visit or Inquire
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-2">
            Have questions regarding wedding dates, bespoke group packages, or hair consultations? Our concierge team responds within 15 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Contact Details Card */}
          <div className="md:col-span-5 rounded-3xl bg-white dark:bg-[#1A102F] p-8 border border-purple-100 dark:border-purple-900 shadow-sm space-y-6">
            <h2 className="font-heading text-2xl font-bold text-brand-ink dark:text-white">
              Salon Sanctuary
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-brand-muted">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-brand-violet mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-brand-ink dark:text-white">Physical Address</p>
                  <p className="mt-0.5">Shop 12-14, Luxury Promenade, 100 Feet Road, Indiranagar, Bengaluru 560038</p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Shop+12-14+Luxury+Promenade+100+Feet+Road+Indiranagar+Bengaluru"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-brand-violet hover:underline font-semibold mt-1"
                  >
                    <span>Get Directions on Google Maps →</span>
                  </a>
                  <p className="text-[11px] text-brand-violet font-semibold mt-0.5">Valet Parking Available</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-brand-violet mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-brand-ink dark:text-white">Sanctuary Hours</p>
                  <p className="mt-0.5">Monday – Sunday: 09:00 AM – 08:00 PM</p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Open All 7 Days</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-brand-violet mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-brand-ink dark:text-white">Direct Line</p>
                  <p className="mt-0.5">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-brand-violet mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-brand-ink dark:text-white">Concierge Email</p>
                  <p className="mt-0.5">contact@beem.test</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-purple-100 dark:border-purple-900">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Chat Instantly on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Message Form */}
          <div className="md:col-span-7 rounded-3xl bg-white dark:bg-[#1A102F] p-8 border border-purple-100 dark:border-purple-900 shadow-sm">
            {submitted ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
                <h3 className="font-heading text-2xl font-bold text-brand-ink dark:text-white">
                  Message Dispatched!
                </h3>
                <p className="text-xs text-brand-muted max-w-sm mx-auto">
                  Thank you, {form.name}. Our master concierge team will get in touch with you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2 rounded-full border border-purple-200 text-xs font-semibold text-brand-deep"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="hp_website"
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />
                <h2 className="font-heading text-2xl font-bold text-brand-ink dark:text-white mb-2">
                  Send an Inquiry
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-brand-muted">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Suhani Roy"
                      className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-brand-muted">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 00000"
                      className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-brand-muted">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="suhani@example.com"
                    className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-brand-muted">How may we pamper you? *</label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your wedding dates, preferred hair stylist, or party group size..."
                    className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-brand-violet text-white font-bold text-xs sm:text-sm hover:bg-brand-royal transition-all shadow-soft"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Key-free OpenStreetMap Interactive View */}
        <div className="rounded-3xl bg-white dark:bg-[#1A102F] p-6 border border-purple-100 dark:border-purple-900 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-heading text-xl font-bold text-brand-ink dark:text-white">
                Find Our Sanctuary
              </h3>
              <p className="text-xs text-brand-muted">
                100 Feet Road, Indiranagar, Bengaluru • Open 7 Days 09:00 AM – 08:00 PM
              </p>
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Shop+12-14+Luxury+Promenade+100+Feet+Road+Indiranagar+Bengaluru"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-brand-violet hover:underline flex items-center gap-1"
            >
              <span>Open in Google Maps →</span>
            </a>
          </div>

          <div className="w-full h-72 rounded-2xl overflow-hidden border border-purple-200 dark:border-purple-800">
            <iframe
              title="BEEM Salon Location"
              width="100%"
              height="100%"
              src="https://www.openstreetmap.org/export/embed.html?bbox=77.635%2C12.965%2C77.655%2C12.985&amp;layer=mapnik&amp;marker=12.975%2C77.645"
              className="w-full h-full filter saturate-150 contrast-105"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
