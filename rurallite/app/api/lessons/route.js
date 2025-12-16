import prisma from "../../../lib/prisma";
import { sendSuccess, sendError } from "../../../lib/responseHandler";
import { ERROR_CODES } from "../../../lib/errorCodes";

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

    return sendSuccess(lessons, "Lessons fetched successfully", 200, { count: lessons.length });
  } catch (error) {
    return sendError("Failed to fetch lessons", ERROR_CODES.INTERNAL_ERROR, 500, error?.message ?? error);
  }
}
