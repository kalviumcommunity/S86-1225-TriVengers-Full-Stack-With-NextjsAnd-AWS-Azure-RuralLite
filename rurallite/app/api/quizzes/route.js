import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            subject: true,
          },
        },
        questions: {
          select: {
            id: true,
            question: true,
            points: true,
          },
        },
        _count: {
          select: {
            questions: true,
            results: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: quizzes,
      count: quizzes.length,
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
