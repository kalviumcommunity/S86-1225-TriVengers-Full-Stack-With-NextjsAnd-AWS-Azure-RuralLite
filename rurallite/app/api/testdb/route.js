import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.user.count();
    const lessons = await prisma.lesson.count();
    const quizzes = await prisma.quiz.count();
    const questions = await prisma.question.count();
    const progress = await prisma.progress.count();
    const notes = await prisma.note.count();

    return NextResponse.json({
      success: true,
      counts: {
        users,
        lessons,
        quizzes,
        questions,
        progress,
        notes,
      },
      message: "Database connection successful",
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
