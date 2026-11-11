import React from "react";
import { LookBoardView } from "@/components/features/LookBoardView";

export const metadata = {
  title: "Inspiration Look Board | BEEM (Beauty Empire)",
  description: "Curate your haircut, makeup, and henna inspiration looks and share them directly with your stylist.",
};

export default function LookBoardPage() {
  return (
    <div className="py-12 bg-[#FAF7FD] dark:bg-[#0F081D] min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <LookBoardView />
      </div>
    </div>
  );
}
