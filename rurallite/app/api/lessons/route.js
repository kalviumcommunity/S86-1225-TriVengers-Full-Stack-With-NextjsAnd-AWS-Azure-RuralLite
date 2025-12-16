import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const lessons = await prisma.lesson.findMany({
      include: {
        quizzes: {
          select: {
            id: true,
            title: true,
            passingScore: true,
          },
        },
        _count: {
          select: {
            progress: true,
            quizzes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: lessons,
      count: lessons.length,
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
