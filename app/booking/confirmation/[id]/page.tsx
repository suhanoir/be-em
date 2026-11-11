import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { BookingConfirmationView } from "@/components/features/BookingConfirmationView";

interface Props {
  params: { id: string };
}

export const metadata = {
  title: "Appointment Confirmed | BEEM (Beauty Empire)",
  description: "Your luxury beauty parlor appointment confirmation, invoice, and calendar invite.",
};

export default async function BookingConfirmationPage({ params }: Props) {
  const appointment = await db.appointment.findUnique({
    where: { id: params.id },
    include: {
      items: true,
      stylist: true,
      invoice: true,
      payments: true,
    },
  });

  if (!appointment) notFound();

  return (
    <div className="py-12 bg-[#FAF7FD] dark:bg-[#0F081D] min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <BookingConfirmationView appointment={appointment} />
      </div>
    </div>
  );
}
