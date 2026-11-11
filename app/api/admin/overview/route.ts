import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getNowInKolkata, formatInKolkata } from "@/lib/timezone";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const todayStr = formatInKolkata(new Date(), "yyyy-MM-dd");
    const todayStart = new Date(`${todayStr}T00:00:00.000Z`);

    // 1. Today's appointments
    const todayAppointments = await db.appointment.findMany({
      where: { date: todayStart },
      include: { stylist: true, items: true, payments: true },
      orderBy: { startTime: "asc" },
    });

    const todayBookingsCount = todayAppointments.length;
    const todayRevenue = todayAppointments
      .filter((a) => a.status !== "CANCELLED")
      .reduce((sum, a) => sum + a.advancePaid, 0);

    const noShowCount = todayAppointments.filter((a) => a.status === "NO_SHOW").length;

    // 2. Total customers count
    const totalCustomers = await db.user.count({ where: { role: "CUSTOMER" } });

    // 3. Low stock inventory alert
    const lowStockItems = await db.inventoryItem.findMany({
      where: {
        currentStock: { lte: 5 },
      },
    });

    // 4. Last 7 days revenue for Recharts
    const last7DaysData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = formatInKolkata(d, "yyyy-MM-dd");
      const dStart = new Date(`${dStr}T00:00:00.000Z`);

      const dayAppts = await db.appointment.findMany({
        where: { date: dStart, status: { not: "CANCELLED" } },
        select: { advancePaid: true, totalAmount: true },
      });

      const dayRevenue = dayAppts.reduce((sum, a) => sum + a.advancePaid, 0);
      last7DaysData.push({
        date: formatInKolkata(d, "MMM dd"),
        revenue: dayRevenue,
        bookings: dayAppts.length,
      });
    }

    // 5. Popular services breakdown
    const popularServices = await db.appointmentItem.groupBy({
      by: ["name"],
      _count: { name: true },
      _sum: { price: true },
      orderBy: { _count: { name: "desc" } },
      take: 5,
    });

    const serviceChartData = popularServices.map((ps) => ({
      name: ps.name.length > 20 ? ps.name.slice(0, 18) + "..." : ps.name,
      bookings: ps._count.name,
      revenue: ps._sum.price || 0,
    }));

    return NextResponse.json({
      metrics: {
        todayBookingsCount,
        todayRevenue,
        noShowCount,
        totalCustomers,
        lowStockAlertCount: lowStockItems.length,
      },
      todayAppointments,
      last7DaysData,
      serviceChartData,
      lowStockItems,
    });
  } catch (error: any) {
    console.error("Admin overview error:", error);
    return NextResponse.json({ error: "Failed to fetch admin overview", message: error.message }, { status: 500 });
  }
}
