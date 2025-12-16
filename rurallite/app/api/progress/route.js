import prisma from "../../../lib/prisma";
import { sendSuccess, sendError } from "../../../lib/responseHandler";
import { ERROR_CODES } from "../../../lib/errorCodes";

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

    return sendSuccess(progress, "Progress fetched successfully", 200, { count: progress.length });
  } catch (error) {
    return sendError("Failed to fetch progress", ERROR_CODES.INTERNAL_ERROR, 500, error?.message ?? error);
  }
}
