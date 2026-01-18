import { getCollection } from "../../../lib/mongodb";
import { sendSuccess, sendError } from "../../../lib/responseHandler";
import { ERROR_CODES } from "../../../lib/errorCodes";
import { ObjectId } from "mongodb";

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

        return sendSuccess(
            formattedQuizzes,
            "Quizzes fetched successfully",
            200,
            { count: formattedQuizzes.length }
        );
    } catch (error) {
        return sendError(
            "Failed to fetch quizzes",
            ERROR_CODES.INTERNAL_ERROR,
            500,
            error?.message ?? error
        );
    }
} 