import { getCollection } from "../../../lib/mongodb";
import { sendSuccess, sendError } from "../../../lib/responseHandler";
import { ERROR_CODES } from "../../../lib/errorCodes";
import { checkRole } from "../../../lib/authMiddleware";
import { ObjectId } from "mongodb";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const lessonsCollection = await getCollection("lessons");

        // If ID is provided, fetch single lesson
        if (id) {
            const lesson = await lessonsCollection.findOne({ _id: new ObjectId(id) });
            if (!lesson) {
                return sendError("Lesson not found", ERROR_CODES.NOT_FOUND, 404);
            }

            // Convert _id to id for frontend
            lesson.id = lesson._id.toString();
            delete lesson._id;

            return sendSuccess(lesson, "Lesson fetched successfully", 200);
        }

        // Fetch all lessons
        const lessons = await lessonsCollection
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        // Convert _id to id for each lesson
        const formattedLessons = lessons.map(lesson => ({
            ...lesson,
            id: lesson._id.toString(),
            _id: undefined
        }));

        return sendSuccess(
            formattedLessons,
            "Lessons fetched successfully",
            200,
            { count: formattedLessons.length }
        );
    } catch (error) {
        return sendError(
            "Failed to fetch lessons",
            ERROR_CODES.INTERNAL_ERROR,
            500,
            error?.message ?? error
        );
    }
}

// Admin and editor can create lessons
export async function POST(req) {
    try {
        const user = req.user || (req.headers && req.headers.get('x-user-role') ? { role: req.headers.get('x-user-role') } : null);
        const allowed = checkRole(user, ["ADMIN", "TEACHER"]);

        if (!allowed) {
            return sendError(
                "Access denied: insufficient permissions.",
                ERROR_CODES.FORBIDDEN,
                403
            );
        }

        const body = await req.json();
        const { title, subject, content, grade, difficulty } = body;

        if (!title || !subject || !content) {
            return sendError(
                "Missing required fields: title, subject, and content are required",
                ERROR_CODES.VALIDATION_ERROR,
                400
            );
        }

        const lessonsCollection = await getCollection("lessons");

        const newLesson = {
            title,
            subject,
            content,
            grade: grade || 10,
            difficulty: difficulty || "INTERMEDIATE",
            isOffline: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await lessonsCollection.insertOne(newLesson);

        const lesson = {
            ...newLesson,
            id: result.insertedId.toString(),
            _id: undefined
        };

        return sendSuccess(lesson, "Lesson created successfully", 201);
    } catch (error) {
        return sendError(
            "Failed to create lesson",
            ERROR_CODES.INTERNAL_ERROR,
            500,
            error?.message ?? error
        );
    }
}

// Admin can delete lessons
export async function DELETE(req) {
    try {
        const user = req.user || (req.headers && req.headers.get('x-user-role') ? { role: req.headers.get('x-user-role') } : null);
        const allowed = checkRole(user, ["ADMIN"]);

        if (!allowed) {
            return sendError(
                "Access denied: insufficient permissions.",
                ERROR_CODES.FORBIDDEN,
                403
            );
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return sendError(
                "Lesson ID is required",
                ERROR_CODES.VALIDATION_ERROR,
                400
            );
        }

        const lessonsCollection = await getCollection("lessons");
        const result = await lessonsCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return sendError("Lesson not found", ERROR_CODES.NOT_FOUND, 404);
        }

        return sendSuccess({}, "Lesson deleted successfully", 200);
    } catch (error) {
        return sendError(
            "Failed to delete lesson",
            ERROR_CODES.INTERNAL_ERROR,
            500,
            error?.message ?? error
        );
    }
}
