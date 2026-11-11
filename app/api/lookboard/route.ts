import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const lookBoards = await db.lookBoard.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ lookBoards });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch look boards", message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, imageUrl, note, boardId } = await req.json();

    if (boardId && imageUrl) {
      // Add item to existing board
      const item = await db.lookBoardItem.create({
        data: {
          lookBoardId: boardId,
          imageUrl,
          note,
        },
      });
      return NextResponse.json({ message: "Inspiration look added", item });
    }

    // Create new board
    const newBoard = await db.lookBoard.create({
      data: {
        userId,
        title: title || "My Style Inspiration",
        description,
        ...(imageUrl
          ? {
              items: {
                create: [{ imageUrl, note }],
              },
            }
          : {}),
      },
      include: { items: true },
    });

    return NextResponse.json({ message: "Look Board created", lookBoard: newBoard });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create look board", message: error.message }, { status: 500 });
  }
}
