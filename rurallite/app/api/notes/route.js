import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const notes = await prisma.note.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: notes,
      count: notes.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
