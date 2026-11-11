import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const items = await db.inventoryItem.findMany({
      orderBy: { currentStock: "asc" },
    });
    return NextResponse.json({ items });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch inventory", message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id, currentStock, restockQuantity } = await req.json();

    const dataToUpdate: any = {};
    if (restockQuantity) {
      dataToUpdate.currentStock = { increment: parseInt(restockQuantity, 10) };
      dataToUpdate.lastRestockedAt = new Date();
    } else if (currentStock !== undefined) {
      dataToUpdate.currentStock = parseInt(currentStock, 10);
    }

    const item = await db.inventoryItem.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ message: "Inventory updated", item });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update inventory", message: error.message }, { status: 500 });
  }
}
