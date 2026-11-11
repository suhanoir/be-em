import React from "react";
import { db } from "@/lib/db";
import { ReviewsFeed } from "@/components/features/ReviewsFeed";

export const metadata = {
  title: "Verified Client Reviews & Testimonials | BEEM (Beauty Empire)",
  description: "Read genuine verified reviews from real clients, brides, and patrons of BEEM Beauty Empire.",
};

export default async function ReviewsPage() {
  const reviews = await db.review.findMany({
    include: {
      service: { select: { name: true } },
      stylist: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="py-12 bg-[#FAF7FD] dark:bg-[#0F081D] min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <ReviewsFeed initialReviews={reviews} />
      </div>
    </div>
  );
}
