import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const services = await db.service.findMany({
      include: { category: true },
      orderBy: [{ categoryId: "asc" }, { price: "asc" }],
    });
    const categories = await db.serviceCategory.findMany({
      orderBy: { orderIndex: "asc" },
    });
    return NextResponse.json({ services, categories });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch services", message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { name, categoryId, description, durationMinutes, price, discountedPrice, image, isPopular } = body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const service = await db.service.create({
      data: {
        name,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        categoryId,
        description: description || "",
        durationMinutes: parseInt(durationMinutes, 10) || 45,
        price: parseFloat(price),
        discountedPrice: discountedPrice ? parseFloat(discountedPrice) : null,
        image: image || "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600&q=80",
        isPopular: Boolean(isPopular),
      },
    });

    return NextResponse.json({ message: "Service created successfully", service }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create service", message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { id, name, categoryId, description, durationMinutes, price, discountedPrice, image, isPopular, isActive } = body;

    const service = await db.service.update({
      where: { id },
      data: {
        name,
        categoryId,
        description,
        durationMinutes: parseInt(durationMinutes, 10),
        price: parseFloat(price),
        discountedPrice: discountedPrice ? parseFloat(discountedPrice) : null,
        image,
        isPopular: Boolean(isPopular),
        isActive: Boolean(isActive),
      },
    });

    return NextResponse.json({ message: "Service updated successfully", service });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update service", message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await db.service.delete({ where: { id } });
    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete service", message: error.message }, { status: 500 });
  }
}
