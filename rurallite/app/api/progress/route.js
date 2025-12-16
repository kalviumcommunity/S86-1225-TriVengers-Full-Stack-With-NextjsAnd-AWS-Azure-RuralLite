import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const progress = await prisma.progress.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        lesson: {
          select: {
            id: true,
            title: true,
            subject: true,
          },
        },
      },
      orderBy: {
        lastAccessed: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: progress,
      count: progress.length,
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
