import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { stylistId, startDate, endDate, reason } = await req.json();

    if (!stylistId) {
      return NextResponse.json({ error: "Stylist ID is required" }, { status: 400 });
    }

    const timeOff = await db.timeOff.create({
      data: {
        stylistId,
        startDate: new Date(`${startDate}T00:00:00.000Z`),
        endDate: new Date(`${endDate}T23:59:59.000Z`),
        reason: reason || "Personal Time Off",
      },
      include: { stylist: true },
    });

    return NextResponse.json({ message: "Time off created", timeOff }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create time off", message: error.message }, { status: 500 });
  }
}
