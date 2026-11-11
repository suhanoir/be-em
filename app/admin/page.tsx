import React from "react";
import { db } from "@/lib/db";
import { formatInKolkata } from "@/lib/timezone";
import { AdminOverviewDashboard } from "@/components/features/AdminOverviewDashboard";

export default async function AdminOverviewPage() {
  const todayStr = formatInKolkata(new Date(), "yyyy-MM-dd");
  const todayStart = new Date(`${todayStr}T00:00:00.000Z`);

  const todayAppointments = await db.appointment.findMany({
    where: { date: todayStart },
    include: { stylist: true, items: true, payments: true },
    orderBy: { startTime: "asc" },
  });

  const totalBookingsCount = await db.appointment.count();
  const totalRevenue = (
    await db.appointment.aggregate({
      _sum: { advancePaid: true },
      where: { status: { not: "CANCELLED" } },
    })
  )._sum.advancePaid || 0;

  const totalCustomers = await db.user.count({ where: { role: "CUSTOMER" } });
  const noShows = await db.appointment.count({ where: { status: "NO_SHOW" } });

  const lowStockItems = await db.inventoryItem.findMany({
    where: { currentStock: { lte: 5 } },
  });

  // 7-day revenue trend data for Recharts
  const revenueTrendData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dStr = formatInKolkata(d, "yyyy-MM-dd");
    const dStart = new Date(`${dStr}T00:00:00.000Z`);

    const dayAppts = await db.appointment.findMany({
      where: { date: dStart, status: { not: "CANCELLED" } },
      select: { advancePaid: true, totalAmount: true },
    });

    const dayRev = dayAppts.reduce((sum, a) => sum + a.advancePaid, 0);
    revenueTrendData.push({
      date: formatInKolkata(d, "MMM dd"),
      revenue: dayRev,
      appointments: dayAppts.length,
    });
  }

  // Top services for Recharts
  const topItems = await db.appointmentItem.groupBy({
    by: ["name"],
    _count: { name: true },
    _sum: { price: true },
    orderBy: { _count: { name: "desc" } },
    take: 5,
  });

  const serviceChartData = topItems.map((ti) => ({
    name: ti.name.length > 18 ? ti.name.slice(0, 16) + "..." : ti.name,
    bookings: ti._count.name,
    revenue: ti._sum.price || 0,
  }));

  return (
    <div className="space-y-8">
      <AdminOverviewDashboard
        metrics={{
          todayCount: todayAppointments.length,
          totalRevenue,
          totalCustomers,
          noShows,
          totalBookingsCount,
        }}
        todayAppointments={todayAppointments}
        revenueTrendData={revenueTrendData}
        serviceChartData={serviceChartData}
        lowStockItems={lowStockItems}
      />
    </div>
  );
}
