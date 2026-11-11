import React from "react";
import { VirtualTryOnStudio } from "@/components/features/VirtualTryOnStudio";

export const metadata = {
  title: "Virtual Hair Color & Style Try-On Studio | BEEM (Beauty Empire)",
  description: "Preview trending hair colors, balayage tints, and cuts on your selfie before your appointment.",
};

export default function TryOnPage() {
  return (
    <div className="py-12 bg-[#FAF7FD] dark:bg-[#0F081D] min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <VirtualTryOnStudio />
      </div>
    </div>
  );
}
