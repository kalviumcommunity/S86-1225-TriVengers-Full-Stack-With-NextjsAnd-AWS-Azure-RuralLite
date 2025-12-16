import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const results = await prisma.quizResult.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        quiz: {
          select: {
            id: true,
            title: true,
            passingScore: true,
          },
        },
        answers: {
          select: {
            id: true,
            selected: true,
            isCorrect: true,
          },
        },
      },
      orderBy: {
        completedAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: results,
      count: results.length,
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
