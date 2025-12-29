
import prisma from "../../../lib/prisma";
import { sendSuccess, sendError } from "../../../lib/responseHandler";
import { ERROR_CODES } from "../../../lib/errorCodes";
import { checkRole } from "../../../lib/authMiddleware";
import { roles } from "../../../config/roles";

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

// Only admin and editor can create lessons
export async function POST(req) {
  try {
    const user = req.user || (req.headers && req.headers.user ? JSON.parse(req.headers.user) : null);
    const allowed = checkRole(user, ["admin", "editor"]);
    console.log(`[RBAC] ${user?.role || 'unknown'} attempted to CREATE lesson: ${allowed ? 'ALLOWED' : 'DENIED'}`);
    if (!allowed) {
      return sendError("Access denied: insufficient permissions.", ERROR_CODES.FORBIDDEN, 403);
    }
    // ...actual create logic here (not implemented for brevity)...
    return sendSuccess({}, "Lesson created (mock)", 201);
  } catch (error) {
    return sendError("Failed to create lesson", ERROR_CODES.INTERNAL_ERROR, 500, error?.message ?? error);
  }
}

// Only admin can delete lessons
export async function DELETE(req) {
  try {
    const user = req.user || (req.headers && req.headers.user ? JSON.parse(req.headers.user) : null);
    const allowed = checkRole(user, ["admin"]);
    console.log(`[RBAC] ${user?.role || 'unknown'} attempted to DELETE lesson: ${allowed ? 'ALLOWED' : 'DENIED'}`);
    if (!allowed) {
      return sendError("Access denied: insufficient permissions.", ERROR_CODES.FORBIDDEN, 403);
    }
    // ...actual delete logic here (not implemented for brevity)...
    return sendSuccess({}, "Lesson deleted (mock)", 200);
  } catch (error) {
    return sendError("Failed to delete lesson", ERROR_CODES.INTERNAL_ERROR, 500, error?.message ?? error);
  }
}
