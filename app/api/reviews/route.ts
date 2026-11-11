import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { createReviewSchema } from "@/lib/validators";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get("serviceId");
    const stylistId = searchParams.get("stylistId");

    const where: any = {};
    if (serviceId) where.serviceId = serviceId;
    if (stylistId) where.stylistId = stylistId;

    const reviews = await db.review.findMany({
      where,
      include: {
        service: { select: { name: true, slug: true } },
        stylist: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reviews });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch reviews", message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const result = createReviewSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid review", details: result.error.flatten() }, { status: 400 });
    }

    const userId = (session?.user as any)?.id || null;

    const review = await db.review.create({
      data: {
        userId,
        customerName: result.data.customerName,
        rating: result.data.rating,
        comment: result.data.comment,
        photoUrl: result.data.photoUrl,
        serviceId: result.data.serviceId ?? null,
        stylistId: result.data.stylistId ?? null,
        appointmentId: result.data.appointmentId ?? null,
        isVerified: true,
      },
    });

    return NextResponse.json({ message: "Review submitted successfully", review }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to submit review", message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin only." }, { status: 403 });
    }

    const { id, ownerReply } = await req.json();
    if (!id || !ownerReply) {
      return NextResponse.json({ error: "Missing review ID or reply text" }, { status: 400 });
    }

    const updated = await db.review.update({
      where: { id },
      data: {
        ownerReply,
        repliedAt: new Date(),
      },
    });

    return NextResponse.json({ message: "Owner reply added", review: updated });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to reply to review", message: error.message }, { status: 500 });
  }
}
