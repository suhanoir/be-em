import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { CustomerAccountView } from "@/components/features/CustomerAccountView";

export const metadata = {
  title: "My Account & Beauty Profile | BEEM (Beauty Empire)",
  description: "View your upcoming appointments, loyalty points, beauty profile, and downloadable invoices.",
};

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      appointments: {
        include: { items: true, stylist: true, invoice: true },
        orderBy: { date: "desc" },
      },
      loyaltyTransactions: {
        orderBy: { createdAt: "desc" },
        take: 8,
      },
      memberships: {
        include: { plan: true },
      },
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="py-12 bg-[#FAF7FD] dark:bg-[#0F081D] min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <CustomerAccountView user={user} />
      </div>
    </div>
  );
}
