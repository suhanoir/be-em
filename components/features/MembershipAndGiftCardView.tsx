"use client";

import React, { useState } from "react";
import { Crown, Gift, CheckCircle2, Sparkles, CreditCard, Check } from "lucide-react";

export function MembershipAndGiftCardView({ plans }: { plans: any[] }) {
  const [activeTab, setActiveTab] = useState<"memberships" | "giftcards">("memberships");

  // Gift Card State
  const [giftAmount, setGiftAmount] = useState(5000);
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [purchasedCard, setPurchasedCard] = useState<any>(null);

  const handleBuyGiftCard = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `BEEM-GIFT-${Math.floor(1000 + Math.random() * 9000)}`;
    setPurchasedCard({
      code,
      amount: giftAmount,
      recipientName,
      message,
    });
  };

  return (
    <div className="space-y-10">
      {/* Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 rounded-full bg-white dark:bg-[#1A102F] border border-purple-200 dark:border-purple-800 shadow-sm">
          <button
            onClick={() => setActiveTab("memberships")}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeTab === "memberships"
                ? "bg-brand-violet text-white shadow-soft"
                : "text-brand-muted hover:text-brand-ink"
            }`}
          >
            VIP Memberships
          </button>
          <button
            onClick={() => setActiveTab("giftcards")}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeTab === "giftcards"
                ? "bg-brand-violet text-white shadow-soft"
                : "text-brand-muted hover:text-brand-ink"
            }`}
          >
            Luxury Gift Cards
          </button>
        </div>
      </div>

      {/* 1. VIP Memberships */}
      {activeTab === "memberships" && (
        <div className="space-y-8 animate-in fade-in">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold tracking-widest text-brand-violet uppercase">
              Exclusive Access
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-ink dark:text-white mt-1">
              The Imperial Privilege Clubs
            </h1>
            <p className="text-xs sm:text-sm text-brand-muted mt-2">
              Enjoy flat 15% to 25% discounts on every salon visit, complimentary quarterly facials, and VIP suite booking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan) => {
              const perks: string[] = JSON.parse(plan.perks || "[]");
              const isGold = plan.slug.includes("gold");

              return (
                <div
                  key={plan.id}
                  className={`rounded-3xl p-8 border flex flex-col justify-between transition-all ${
                    isGold
                      ? "bg-gradient-to-b from-white to-amber-50/40 dark:from-[#1A102F] dark:to-amber-950/20 border-amber-400 shadow-gold scale-102"
                      : "bg-white dark:bg-[#1A102F] border-purple-100 dark:border-purple-900 shadow-sm"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-violet">
                        {plan.period} PRIVILEGE
                      </span>
                      {isGold && (
                        <span className="px-3 py-1 rounded-full bg-amber-400 text-brand-ink text-[10px] font-black uppercase">
                          VIP Tier
                        </span>
                      )}
                    </div>

                    <h2 className="font-heading text-2xl font-bold text-brand-ink dark:text-white">
                      {plan.name}
                    </h2>
                    <p className="text-xs text-brand-muted">{plan.description}</p>

                    <div className="py-4 border-y border-purple-100 dark:border-purple-900">
                      <span className="text-3xl font-black text-brand-deep dark:text-brand-softgold font-heading">
                        ₹{plan.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-brand-muted"> / year</span>
                      <p className="text-xs text-emerald-600 font-bold mt-1">
                        Flat {plan.discountPercent}% OFF on all services
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-brand-ink dark:text-white">
                        Included Privileges:
                      </h4>
                      {perks.map((pk, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-brand-muted">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{pk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() =>
                        alert(
                          `Membership enrollment for ${plan.name} requested! A concierge will connect with you.`
                        )
                      }
                      className={`w-full py-3.5 rounded-full text-xs font-bold transition-all ${
                        isGold
                          ? "bg-gradient-to-r from-amber-400 to-yellow-600 text-brand-ink shadow-gold hover:scale-[1.02]"
                          : "bg-brand-violet text-white hover:bg-brand-royal"
                      }`}
                    >
                      Enroll in {plan.name}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Luxury Gift Cards */}
      {activeTab === "giftcards" && (
        <div className="space-y-8 animate-in fade-in max-w-2xl mx-auto">
          <div className="text-center">
            <span className="text-xs font-bold tracking-widest text-brand-violet uppercase">
              Gift of Elegance
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-ink dark:text-white mt-1">
              Give the Luxury BEEM Experience
            </h1>
            <p className="text-xs sm:text-sm text-brand-muted mt-2">
              The ultimate gift for birthdays, weddings, bridal showers, or festive appreciation.
            </p>
          </div>

          {purchasedCard ? (
            <div className="rounded-3xl bg-gradient-to-r from-brand-deep via-brand-royal to-purple-800 p-8 text-white shadow-2xl space-y-6 text-center animate-in zoom-in-95">
              <Sparkles className="h-10 w-10 text-brand-softgold mx-auto" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-softgold">
                  Digital Gift Certificate Issued
                </span>
                <h3 className="font-heading text-3xl font-bold mt-1">
                  ₹{purchasedCard.amount.toLocaleString("en-IN")} Voucher
                </h3>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                <p className="text-xs text-purple-200">Redeemable Code:</p>
                <p className="text-2xl font-mono font-bold text-brand-softgold tracking-wider mt-1">
                  {purchasedCard.code}
                </p>
              </div>

              <p className="text-xs text-purple-200">
                Recipient: <strong>{purchasedCard.recipientName}</strong>
              </p>
              {purchasedCard.message && (
                <p className="text-xs italic text-purple-100">&quot;{purchasedCard.message}&quot;</p>
              )}

              <button
                onClick={() => setPurchasedCard(null)}
                className="px-6 py-2 rounded-full bg-white text-brand-deep font-bold text-xs"
              >
                Purchase Another Gift Card
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleBuyGiftCard}
              className="rounded-3xl bg-white dark:bg-[#1A102F] p-8 border border-purple-100 dark:border-purple-900 shadow-xl space-y-5"
            >
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-brand-deep dark:text-purple-300 block mb-2">
                  Select Gift Value (INR):
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[2000, 5000, 10000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setGiftAmount(amt)}
                      className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all ${
                        giftAmount === amt
                          ? "border-brand-violet bg-purple-50 dark:bg-purple-950 text-brand-deep dark:text-white shadow-sm"
                          : "border-purple-100 dark:border-purple-900 bg-[#FAF7FD] dark:bg-[#150D27] text-brand-muted"
                      }`}
                    >
                      ₹{amt.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-brand-muted">Recipient Name *</label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Meera Sen"
                    className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-brand-muted">Recipient Email *</label>
                  <input
                    type="email"
                    required
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="meera@example.com"
                    className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-brand-muted">Personal Greeting Message</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Happy Birthday / Congratulations! Pamper yourself with love..."
                  className="w-full mt-1 rounded-xl border border-purple-200 p-2 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-brand-royal via-brand-violet to-purple-600 text-white font-bold text-xs sm:text-sm shadow-soft hover:shadow-glow transition-all"
              >
                Proceed to Checkout (₹{giftAmount.toLocaleString("en-IN")})
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
