import prisma from "../../../lib/prisma";
import { sendSuccess, sendError } from "../../../lib/responseHandler";
import { ERROR_CODES } from "../../../lib/errorCodes";

export async function GET() {
  try {
    const users = await prisma.user.count();
    const lessons = await prisma.lesson.count();
    const quizzes = await prisma.quiz.count();
    const questions = await prisma.question.count();
    const progress = await prisma.progress.count();
    const notes = await prisma.note.count();

    return sendSuccess({ users, lessons, quizzes, questions, progress, notes }, "Database connection successful", 200);
  } catch (error) {
    return sendError("Test DB check failed", ERROR_CODES.INTERNAL_ERROR, 500, error?.message ?? error);
  }
}
