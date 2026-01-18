import { getCollection } from "../../../lib/mongodb";
import { sendSuccess, sendError } from "../../../lib/responseHandler";
import { ERROR_CODES } from "../../../lib/errorCodes";
import { ObjectId } from "mongodb";
import { verifyToken } from "../../../lib/jwtUtils";

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
        const { quizId, quizTitle, subject, score, totalQuestions, answers } = body;

        if (!quizId || !quizTitle || !subject || score === undefined || !totalQuestions) {
            return sendError("Missing required fields", ERROR_CODES.VALIDATION_ERROR, 400);
        }

        const percentage = Math.round((score / totalQuestions) * 100);
        const historyCollection = await getCollection("quizHistory");

        const historyEntry = {
            userId: decoded.userId,
            userEmail: decoded.email,
            quizId,
            quizTitle,
            subject,
            score,
            totalQuestions,
            percentage,
            answers: answers || {},
            completedAt: new Date(),
            createdAt: new Date(),
        };

        const result = await historyCollection.insertOne(historyEntry);

        return sendSuccess(
            { id: result.insertedId.toString(), ...historyEntry },
            "Quiz result saved successfully",
            201
        );
    } catch (error) {
        console.error("Error saving quiz history:", error);
        return sendError(
            "Failed to save quiz result",
            ERROR_CODES.INTERNAL_ERROR,
            500,
            error?.message ?? error
        );
    }
}

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

        const { searchParams } = new URL(req.url);
        const subject = searchParams.get("subject");

        const historyCollection = await getCollection("quizHistory");

        // Build query
        const query = { userId: decoded.userId };
        if (subject) {
            query.subject = subject;
        }

        // Fetch quiz history
        const history = await historyCollection
            .find(query)
            .sort({ completedAt: -1 })
            .toArray();

        // Format results
        const formattedHistory = history.map((entry) => ({
            ...entry,
            id: entry._id.toString(),
            _id: undefined,
        }));

        return sendSuccess(
            formattedHistory,
            "Quiz history fetched successfully",
            200,
            {
                count: formattedHistory.length,
                totalAttempts: formattedHistory.length,
            }
        );
    } catch (error) {
        console.error("Error fetching quiz history:", error);
        return sendError(
            "Failed to fetch quiz history",
            ERROR_CODES.INTERNAL_ERROR,
            500,
            error?.message ?? error
        );
    }
}
