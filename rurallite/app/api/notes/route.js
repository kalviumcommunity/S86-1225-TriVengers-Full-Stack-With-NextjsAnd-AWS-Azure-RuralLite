import prisma from "../../../lib/prisma";
import { sendSuccess, sendError } from "../../../lib/responseHandler";
import { ERROR_CODES } from "../../../lib/errorCodes";

export async function GET() {
  try {
    const notes = await prisma.note.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return sendSuccess(notes, "Notes fetched successfully", 200, { count: notes.length });
  } catch (error) {
    return sendError("Failed to fetch notes", ERROR_CODES.INTERNAL_ERROR, 500, error?.message ?? error);
  }
}
