import { getCollection } from "../../../lib/mongodb";
import { sendSuccess, sendError } from "../../../lib/responseHandler";
import { ERROR_CODES } from "../../../lib/errorCodes";
import { ObjectId } from "mongodb";
import { checkRole } from "../../../lib/authMiddleware";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const quizzesCollection = await getCollection("quizzes");

    // If ID is provided, fetch single quiz
    if (id) {
      const quiz = await quizzesCollection.findOne({ _id: new ObjectId(id) });
      if (!quiz) {
        return sendError("Quiz not found", ERROR_CODES.NOT_FOUND, 404);
      }
      // Convert _id to id for frontend
      quiz.id = quiz._id.toString();
      delete quiz._id;
      return sendSuccess(quiz, "Quiz fetched successfully", 200);
    }

    // Fetch all quizzes
    const quizzes = await quizzesCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Convert _id to id for each quiz
    const formattedQuizzes = quizzes.map((quiz) => ({
      ...quiz,
      id: quiz._id.toString(),
      _id: undefined,
    }));

    return sendSuccess(formattedQuizzes, "Quizzes fetched successfully", 200, {
      count: formattedQuizzes.length,
    });
  } catch (error) {
    return sendError(
      "Failed to fetch quizzes",
      ERROR_CODES.INTERNAL_ERROR,
      500,
      error?.message ?? error
    );
  }
}

export async function POST(req) {
  try {
    // Get user from request
    const user =
      req.user ||
      (req.headers && req.headers.get("x-user-role")
        ? { role: req.headers.get("x-user-role") }
        : null);
    const allowed = checkRole(user, ["ADMIN", "TEACHER"]);

    if (!allowed) {
      return sendError(
        "Access denied: Only teachers and admins can create quizzes",
        ERROR_CODES.FORBIDDEN,
        403
      );
    }

    const body = await req.json();
    const { title, subject, description, questions } = body;

    // Validation
    if (!title || !subject || !questions || !Array.isArray(questions)) {
      return sendError(
        "Title, subject, and questions are required",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    if (questions.length === 0) {
      return sendError(
        "At least one question is required",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    // Validate each question
    for (const q of questions) {
      if (
        !q.question ||
        !q.options ||
        !Array.isArray(q.options) ||
        q.options.length < 2
      ) {
        return sendError(
          "Each question must have a question text and at least 2 options",
          ERROR_CODES.VALIDATION_ERROR,
          400
        );
      }
      if (q.correctAnswer === undefined || q.correctAnswer === null) {
        return sendError(
          "Each question must have a correct answer",
          ERROR_CODES.VALIDATION_ERROR,
          400
        );
      }
    }

    const quizzesCollection = await getCollection("quizzes");

    const newQuiz = {
      title,
      subject,
      description: description || "",
      questions,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await quizzesCollection.insertOne(newQuiz);

    return sendSuccess(
      { id: result.insertedId.toString(), ...newQuiz },
      "Quiz created successfully",
      201
    );
  } catch (error) {
    return sendError(
      "Failed to create quiz",
      ERROR_CODES.INTERNAL_ERROR,
      500,
      error?.message ?? error
    );
  }
}

export async function PUT(req) {
  try {
    // Get user from request
    const user =
      req.user ||
      (req.headers && req.headers.get("x-user-role")
        ? { role: req.headers.get("x-user-role") }
        : null);
    const allowed = checkRole(user, ["ADMIN", "TEACHER"]);

    if (!allowed) {
      return sendError(
        "Access denied: Only teachers and admins can update quizzes",
        ERROR_CODES.FORBIDDEN,
        403
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return sendError(
        "Quiz ID is required",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    const body = await req.json();
    const { title, subject, description, questions } = body;

    // Validation
    if (!title || !subject || !questions || !Array.isArray(questions)) {
      return sendError(
        "Title, subject, and questions are required",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    const quizzesCollection = await getCollection("quizzes");

    const updateData = {
      title,
      subject,
      description: description || "",
      questions,
      updatedAt: new Date(),
    };

    const result = await quizzesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return sendError("Quiz not found", ERROR_CODES.NOT_FOUND, 404);
    }

    return sendSuccess({ id, ...updateData }, "Quiz updated successfully", 200);
  } catch (error) {
    return sendError(
      "Failed to update quiz",
      ERROR_CODES.INTERNAL_ERROR,
      500,
      error?.message ?? error
    );
  }
}

export async function DELETE(req) {
  try {
    // Get user from request
    const user =
      req.user ||
      (req.headers && req.headers.get("x-user-role")
        ? { role: req.headers.get("x-user-role") }
        : null);
    const allowed = checkRole(user, ["ADMIN", "TEACHER"]);

    if (!allowed) {
      return sendError(
        "Access denied: Only teachers and admins can delete quizzes",
        ERROR_CODES.FORBIDDEN,
        403
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return sendError(
        "Quiz ID is required",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    const quizzesCollection = await getCollection("quizzes");

    const result = await quizzesCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return sendError("Quiz not found", ERROR_CODES.NOT_FOUND, 404);
    }

    return sendSuccess(null, "Quiz deleted successfully", 200);
  } catch (error) {
    return sendError(
      "Failed to delete quiz",
      ERROR_CODES.INTERNAL_ERROR,
      500,
      error?.message ?? error
    );
  }
}
