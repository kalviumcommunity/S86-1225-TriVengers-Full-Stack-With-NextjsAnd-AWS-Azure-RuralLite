import { getCollection } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { sendSuccess, sendError } from "../../../lib/responseHandler";
import { ERROR_CODES } from "../../../lib/errorCodes";
import { verifyToken } from "../../../lib/jwtUtils";
import { devError } from "../../../lib/utils/devLogger";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return sendError("Unauthorized", ERROR_CODES.UNAUTHORIZED, 401);
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return sendError("Invalid token", ERROR_CODES.UNAUTHORIZED, 401);
    }

    // Get progress for the current user
    const progressCollection = await getCollection("progress");
    const lessonsCollection = await getCollection("lessons");

    const progressData = await progressCollection.find({ userId: decoded.userId }).toArray();

    // Fetch lesson details for each progress
    const progressWithLessons = await Promise.all(
      progressData.map(async (p) => {
        const lesson = await lessonsCollection.findOne(
          { _id: typeof p.lessonId === 'string' ? new ObjectId(p.lessonId) : p.lessonId },
          { projection: { _id: 1, title: 1, subject: 1 } }
        );
        return {
          id: p._id.toString(),
          userId: p.userId,
          lessonId: p.lessonId,
          completed: p.completed,
          progress: p.progress,
          lastAccessed: p.lastAccessed,
          lesson: lesson ? {
            id: lesson._id.toString(),
            title: lesson.title,
            subject: lesson.subject,
          } : null,
        };
      })
    );

    // Sort by lastAccessed
    progressWithLessons.sort((a, b) =>
      new Date(b.lastAccessed) - new Date(a.lastAccessed)
    );

    return sendSuccess(progressWithLessons, "Progress fetched successfully", 200, {
      count: progressWithLessons.length,
      completedCount: progressWithLessons.filter(p => p.completed).length,
    });
  } catch (error) {
    return sendError(
      "Failed to fetch progress",
      ERROR_CODES.INTERNAL_ERROR,
      500,
      error?.message ?? error
    );
  }
}

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return sendError("Unauthorized", ERROR_CODES.UNAUTHORIZED, 401);
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return sendError("Invalid token", ERROR_CODES.UNAUTHORIZED, 401);
    }

    const body = await req.json();
    const { lessonId, completed, progress: progressPercent } = body;

    if (!lessonId) {
      return sendError("Lesson ID is required", ERROR_CODES.VALIDATION_ERROR, 400);
    }

    // Upsert progress (create or update)
    const progressCollection = await getCollection("progress");
    const lessonsCollection = await getCollection("lessons");

    const filter = { userId: decoded.userId, lessonId: lessonId };
    const updateDoc = {
      $set: {
        completed: completed ?? false,
        progress: progressPercent ?? 0,
        lastAccessed: new Date(),
      },
      $setOnInsert: {
        userId: decoded.userId,
        lessonId: lessonId,
        createdAt: new Date(),
      },
    };

    const result = await progressCollection.findOneAndUpdate(
      filter,
      updateDoc,
      { upsert: true, returnDocument: "after" }
    );

    // Fetch lesson details
    const lesson = await lessonsCollection.findOne(
      { _id: typeof lessonId === 'string' ? new ObjectId(lessonId) : lessonId },
      { projection: { _id: 1, title: 1, subject: 1 } }
    );

    const progressData = {
      id: result._id.toString(),
      userId: result.userId,
      lessonId: result.lessonId,
      completed: result.completed,
      progress: result.progress,
      lastAccessed: result.lastAccessed,
      lesson: lesson ? {
        id: lesson._id.toString(),
        title: lesson.title,
        subject: lesson.subject,
      } : null,
    };

    return sendSuccess(
      progressData,
      completed ? "Lesson marked as complete!" : "Progress updated",
      200
    );
  } catch (error) {
    devError("Progress update error:", error);
    return sendError(
      "Failed to update progress",
      ERROR_CODES.INTERNAL_ERROR,
      500,
      error?.message ?? error
    );
  }
}
