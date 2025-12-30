// Cloud Database Connection Test Endpoint
// This API route checks connectivity to your managed PostgreSQL instance (AWS RDS/Azure SQL)
// and returns counts for key tables. Use this to verify your DATABASE_URL setup.

import prisma from "../../../lib/prisma";
import { sendSuccess, sendError } from "../../../lib/responseHandler";
import { ERROR_CODES } from "../../../lib/errorCodes";

export async function GET() {
  try {
    // Fetch row counts for key tables to demonstrate DB connectivity
    const users = await prisma.user.count();
    const lessons = await prisma.lesson.count();
    const quizzes = await prisma.quiz.count();
    const questions = await prisma.question.count();
    const progress = await prisma.progress.count();
    const notes = await prisma.note.count();

    // Show which DB is connected (from env)
    const dbUrl = process.env.DATABASE_URL || "(not set)";
    const dbHost = dbUrl.split("@")[1]?.split(":")[0] || "unknown";

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
      "✅ Database connection successful. This confirms your Next.js app can reach the configured PostgreSQL instance.",
      200
    );
  } catch (error) {
    // Friendlier error for cloud DB troubleshooting
    return sendError(
      "❌ Test DB check failed. Please verify your DATABASE_URL, network access, and cloud DB status.",
      ERROR_CODES.INTERNAL_ERROR,
      500,
      error?.message ?? error
    );
  }
}
