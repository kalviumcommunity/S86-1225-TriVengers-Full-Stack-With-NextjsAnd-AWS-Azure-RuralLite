import { NextResponse } from "next/server";
import { getCollection } from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { sendSuccess, sendError } from "../../../../lib/responseHandler";
import { ERROR_CODES } from "../../../../lib/errorCodes";
import { checkRole } from "../../../../lib/authMiddleware";

export async function PUT(req, { params }) {
  try {
    const user =
      req.user ||
      (req.headers && req.headers.get("x-user-role")
        ? { role: req.headers.get("x-user-role") }
        : null);
    const allowed = checkRole(user, ["ADMIN", "TEACHER"]);

    if (!allowed) {
      return sendError(
        "Access denied: insufficient permissions.",
        ERROR_CODES.FORBIDDEN,
        403
      );
    }

    const { id } = params;
    const body = await req.json();
    const { title, subject, content, grade, difficulty } = body;

    if (!ObjectId.isValid(id)) {
      return sendError("Invalid lesson ID", ERROR_CODES.VALIDATION_ERROR, 400);
    }

    const lessonsCollection = await getCollection("lessons");
    const updateData = {
      ...(title && { title }),
      ...(subject && { subject }),
      ...(content && { content }),
      ...(grade && { grade }),
      ...(difficulty && { difficulty }),
      updatedAt: new Date(),
    };

    const lesson = await lessonsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!lesson) {
      return sendError("Lesson not found", ERROR_CODES.NOT_FOUND, 404);
    }

    return sendSuccess(lesson, "Lesson updated successfully", 200);
  } catch (error) {
    return sendError(
      "Failed to update lesson",
      ERROR_CODES.INTERNAL_ERROR,
      500,
      error?.message ?? error
    );
  }
}

export async function GET(req, { params }) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return sendError("Invalid lesson ID", ERROR_CODES.VALIDATION_ERROR, 400);
    }

    const lessonsCollection = await getCollection("lessons");
    const lesson = await lessonsCollection.findOne({ _id: new ObjectId(id) });

    if (!lesson) {
      return sendError("Lesson not found", ERROR_CODES.NOT_FOUND, 404);
    }

    // Get associated quizzes
    const quizzesCollection = await getCollection("quizzes");
    const quizzes = await quizzesCollection
      .find({ subject: lesson.subject })
      .project({ _id: 1, title: 1, description: 1, passingScore: 1 })
      .toArray();

    const formattedLesson = {
      id: lesson._id.toString(),
      title: lesson.title,
      subject: lesson.subject,
      content: lesson.content,
      grade: lesson.grade,
      difficulty: lesson.difficulty,
      createdAt: lesson.createdAt,
      quizzes: quizzes.map(q => ({
        id: q._id.toString(),
        title: q.title,
        description: q.description,
        passingScore: q.passingScore,
      })),
    };

    return sendSuccess(formattedLesson, "Lesson fetched successfully", 200);
  } catch (error) {
    return sendError(
      "Failed to fetch lesson",
      ERROR_CODES.INTERNAL_ERROR,
      500,
      error?.message ?? error
    );
  }
}
