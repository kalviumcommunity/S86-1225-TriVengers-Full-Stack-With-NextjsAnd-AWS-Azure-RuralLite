// Cloud Database Connection Test Endpoint
// This API route checks connectivity to your MongoDB Atlas instance
// and returns counts for key collections. Use this to verify your DATABASE_URL setup.
import { getDatabase } from "../../../lib/mongodb";
import { sendSuccess, sendError } from "../../../lib/responseHandler";
import { ERROR_CODES } from "../../../lib/errorCodes";

export async function GET() {
    try {
        // Fetch counts for key collections to demonstrate DB connectivity
        const db = await getDatabase();

        const [users, lessons, quizzes, questions, progress, notes] = await Promise.all([
            db.collection("users").countDocuments(),
            db.collection("lessons").countDocuments(),
            db.collection("quizzes").countDocuments(),
            db.collection("questions").countDocuments(),
            db.collection("progress").countDocuments(),
            db.collection("notes").countDocuments(),
        ]);

        // Show which DB is connected (from env)
        const dbUrl = process.env.DATABASE_URL || "(not set)";
        const dbHost = dbUrl.includes("mongodb.net") ? "MongoDB Atlas" :
            dbUrl.split("@")[1]?.split("/")[0] || "unknown";

        return sendSuccess(
            {
                users,
                lessons,
                quizzes,
                questions,
                progress,
                notes,
                dbHost,
                env: process.env.NODE_ENV,
            },
            "✅ Database connection successful. This confirms your Next.js app can reach the configured MongoDB instance.",
            200
        );
    } catch (error) {
        // Friendlier error for cloud DB troubleshooting
        return sendError(
            "❌ Test DB check failed. Please verify your DATABASE_URL, network access, and MongoDB Atlas status.",
            ERROR_CODES.INTERNAL_ERROR,
            500,
            error?.message ?? error
        );
    }
}
