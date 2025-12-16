import prisma from "../../../lib/prisma";
import { sendSuccess, sendError } from "../../../lib/responseHandler";
import { ERROR_CODES } from "../../../lib/errorCodes";

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

    return sendSuccess(results, "Quiz results fetched successfully", 200, { count: results.length });
  } catch (error) {
    return sendError("Failed to fetch quiz results", ERROR_CODES.INTERNAL_ERROR, 500, error?.message ?? error);
  }
}
