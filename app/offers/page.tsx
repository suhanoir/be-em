import React from "react";
import Link from "next/link";
import { Tag, Sparkles, Gift, Crown, Share2, Calendar, CheckCircle2 } from "lucide-react";
import { db } from "@/lib/db";

export const metadata = {
  title: "Offers, Festive Specials & Promo Codes | BEEM (Beauty Empire)",
  description: "Exclusive salon discounts, wedding season packages, and loyalty reward perks.",
};

export default async function OffersPage() {
  const offers = await db.offer.findMany({
    where: { isActive: true },
    include: { promoCode: true },
  });

  const promoCodes = await db.promoCode.findMany({
    where: { isActive: true },
  });

  return (
    <div className="py-12 bg-[#FAF7FD] dark:bg-[#0F081D] min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lavender text-brand-deep dark:bg-purple-950 dark:text-purple-200 text-xs font-bold mb-2">
            <Tag className="h-3.5 w-3.5 text-brand-violet" />
            <span>Curated Privileges</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-brand-ink dark:text-white">
            Offers &amp; Festive Celebrations
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-2">
            Enjoy seasonal rewards across wedding dates, festivals, referral invites, and loyalty spends.
          </p>
        </div>

        {/* Featured Seasonal Offers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-purple-50 via-white to-pink-50/50 dark:from-[#1A102F] dark:via-[#150D27] dark:to-purple-950/40 border border-purple-200 dark:border-purple-800 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                {offer.isFestival && (
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-400 text-brand-ink text-[10px] font-extrabold uppercase">
                    {offer.festivalName || "Festive Special"}
                  </span>
                )}
                <h3 className="font-heading text-2xl font-bold text-brand-ink dark:text-white">
                  {offer.title}
                </h3>
                <p className="text-sm font-bold text-brand-deep dark:text-brand-orchid">
                  {offer.discountText}
                </p>
                <p className="text-xs text-brand-muted leading-relaxed">{offer.description}</p>
              </div>

              <div className="pt-6 border-t border-purple-100 dark:border-purple-900 mt-6 flex items-center justify-between">
                {offer.promoCode ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-brand-muted">Coupon:</span>
                    <span className="px-2.5 py-1 rounded-md bg-purple-100 dark:bg-purple-900 font-mono text-xs font-bold text-brand-royal dark:text-brand-orchid">
                      {offer.promoCode.code}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-brand-muted">Auto applied at salon</span>
                )}

                <Link
                  href="/book"
                  className="px-4 py-2 rounded-full bg-brand-violet text-white text-xs font-semibold hover:bg-brand-royal transition-colors shadow-sm"
                >
                  Book with Offer
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Loyalty & Referral Perks Grid */}
        <div className="rounded-3xl bg-white dark:bg-[#1A102F] p-8 border border-purple-100 dark:border-purple-900 shadow-xl space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-brand-ink dark:text-white">
              The BEEM Royalty Privilege Program
            </h2>
            <p className="text-xs text-brand-muted mt-1">
              Rewarding your consistent patronage every step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-[#FAF7FD] dark:bg-[#150D27] border border-purple-100 dark:border-purple-900 space-y-2 text-center">
              <Sparkles className="h-6 w-6 text-brand-violet mx-auto" />
              <h3 className="font-heading text-lg font-bold text-brand-ink dark:text-white">
                10% Loyalty Cash
              </h3>
              <p className="text-xs text-brand-muted">
                Earn 1 loyalty point for every ₹10 spent. Redeem points directly against future appointments!
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7FD] dark:bg-[#150D27] border border-purple-100 dark:border-purple-900 space-y-2 text-center">
              <Share2 className="h-6 w-6 text-emerald-600 mx-auto" />
              <h3 className="font-heading text-lg font-bold text-brand-ink dark:text-white">
                ₹200 Referral Bonus
              </h3>
              <p className="text-xs text-brand-muted">
                Share your personal code with friends. They get a welcome discount and you receive 200 points!
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7FD] dark:bg-[#150D27] border border-purple-100 dark:border-purple-900 space-y-2 text-center">
              <Gift className="h-6 w-6 text-pink-600 mx-auto" />
              <h3 className="font-heading text-lg font-bold text-brand-ink dark:text-white">
                Birthday &amp; 10th Visit
              </h3>
              <p className="text-xs text-brand-muted">
                Receive a complimentary blowout and head massage ritual on your birthday or every 10th visit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
