import React from "react";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { CuratedLooksView } from "@/components/features/CuratedLooksView";

export const metadata: Metadata = {
  title: "Curated Looks & Inspiration | BEEM (Beauty Empire)",
  description:
    "Explore curated signature looks by BEEM master artists. Save looks to your personal Look Board and book your appointment directly.",
};

export const revalidate = 60;

export default async function LooksPage() {
  const looks = await db.curatedLook.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <CuratedLooksView initialLooks={looks} />;
}
