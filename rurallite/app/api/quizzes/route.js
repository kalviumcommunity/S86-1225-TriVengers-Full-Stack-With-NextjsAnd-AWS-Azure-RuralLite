import prisma from "../../../lib/prisma";
import { sendSuccess, sendError } from "../../../lib/responseHandler";
import { ERROR_CODES } from "../../../lib/errorCodes";

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

    return sendSuccess(quizzes, "Quizzes fetched successfully", 200, { count: quizzes.length });
  } catch (error) {
    return sendError("Failed to fetch quizzes", ERROR_CODES.INTERNAL_ERROR, 500, error?.message ?? error);
  }
}
