import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatInKolkata } from "@/lib/timezone";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "appointments";

    if (type === "appointments") {
      const appointments = await db.appointment.findMany({
        include: { stylist: true, items: true, payments: true },
        orderBy: { date: "desc" },
      });

      const headers = [
        "Appointment No",
        "Date",
        "Start Time",
        "End Time",
        "Customer Name",
        "Customer Phone",
        "Customer Email",
        "Stylist",
        "Services",
        "Total Amount (INR)",
        "Paid Amount (INR)",
        "Balance Due (INR)",
        "Status",
        "Payment Method",
      ];

      const rows = appointments.map((a) => [
        a.appointmentNumber,
        formatInKolkata(a.date, "yyyy-MM-dd"),
        a.startTime,
        a.endTime,
        `"${a.customerName.replace(/"/g, '""')}"`,
        a.customerPhone,
        a.customerEmail,
        `"${(a.stylist?.name || "Unassigned").replace(/"/g, '""')}"`,
        `"${a.items.map((i) => i.name).join("; ").replace(/"/g, '""')}"`,
        a.totalAmount,
        a.advancePaid,
        a.balanceDue,
        a.status,
        a.paymentMethod,
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

      return new Response(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="beem_appointments_${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({ error: "Unknown report type" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: "Export failed", message: error.message }, { status: 500 });
  }
}
