import React from "react";
import { db } from "@/lib/db";
import { BookingWizard } from "@/components/features/BookingWizard";

export const metadata = {
  title: "Book Appointment in Under 60 Seconds | BEEM (Beauty Empire)",
  description: "Reserve your haircut, bridal makeover, facial, or mehendi slot with real-time Asia/Kolkata conflict-free scheduling.",
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const services = await db.service.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: [{ categoryId: "asc" }, { price: "asc" }],
  });

  const bridalPackages = await db.bridalPackage.findMany({
    orderBy: { price: "asc" },
  });

  const mehendiDesigns = await db.mehendiDesign.findMany({
    orderBy: { price: "asc" },
  });

  const stylists = await db.stylist.findMany({
    where: { isActive: true },
    orderBy: { rating: "desc" },
  });

  return (
    <div className="py-10 bg-[#FAF7FD] dark:bg-[#0F081D] min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <BookingWizard
          services={services}
          bridalPackages={bridalPackages}
          mehendiDesigns={mehendiDesigns}
          stylists={stylists}
          initialParams={searchParams}
        />
      </div>
    </div>
  );
}
