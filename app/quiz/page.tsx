import React from "react";
import { StyleQuizWizard } from "@/components/features/StyleQuizWizard";

export const metadata = {
  title: "AI Style & Face Shape Quiz | BEEM (Beauty Empire)",
  description:
    "Discover bespoke haircuts, makeup palettes, and clinical facials calibrated to your face shape, undertone, and lifestyle.",
};

export default function QuizPage() {
  return (
    <div className="py-12 bg-[#FAF7FD] dark:bg-[#0F081D] min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <StyleQuizWizard />
      </div>
    </div>
  );
}
