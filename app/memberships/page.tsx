import React from "react";
import { db } from "@/lib/db";
import { MembershipAndGiftCardView } from "@/components/features/MembershipAndGiftCardView";

export const metadata = {
  title: "Memberships & Luxury Gift Cards | BEEM (Beauty Empire)",
  description: "Join the VIP Imperial Club for 15-25% discounts or gift a pampering experience to someone special.",
};

export default async function MembershipsPage() {
  const plans = await db.membershipPlan.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" },
  });

  return (
    <div className="py-12 bg-[#FAF7FD] dark:bg-[#0F081D] min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <MembershipAndGiftCardView plans={plans} />
      </div>
    </div>
  );
}
