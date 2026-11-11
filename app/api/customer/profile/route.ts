import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { customerProfileSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        appointments: {
          include: { items: true, stylist: true },
          orderBy: { date: "desc" },
        },
        loyaltyTransactions: { orderBy: { createdAt: "desc" }, take: 10 },
        memberships: { include: { plan: true } },
        lookBoards: { include: { items: true } },
        favorites: { include: { service: true, mehendiDesign: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("Profile get error:", error);
    return NextResponse.json({ error: "Failed to fetch profile", message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = customerProfileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid profile data", details: result.error.flatten() }, { status: 400 });
    }

    const profile = await db.customerProfile.upsert({
      where: { userId },
      update: result.data,
      create: {
        userId,
        ...result.data,
      },
    });

    return NextResponse.json({ message: "Beauty Profile updated successfully", profile });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile", message: error.message }, { status: 500 });
  }
}
