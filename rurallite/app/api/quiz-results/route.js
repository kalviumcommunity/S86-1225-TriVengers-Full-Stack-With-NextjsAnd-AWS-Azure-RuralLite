import { getCollection } from "../../../lib/mongodb";
import { sendSuccess, sendError } from "../../../lib/responseHandler";
import { ERROR_CODES } from "../../../lib/errorCodes";

export async function GET() {
  try {
    const quizResultsCollection = await getCollection("quizResults");
    const usersCollection = await getCollection("users");
    const quizzesCollection = await getCollection("quizzes");

    const results = await quizResultsCollection.find({}).sort({ completedAt: -1 }).toArray();

    // Fetch related user and quiz data
    const formattedResults = await Promise.all(
      results.map(async (result) => {
        const user = await usersCollection.findOne(
          { _id: result.userId },
          { projection: { _id: 1, name: 1, email: 1 } }
        );
        const quiz = await quizzesCollection.findOne(
          { _id: result.quizId },
          { projection: { _id: 1, title: 1, passingScore: 1 } }
        );

        return {
          id: result._id.toString(),
          userId: result.userId,
          quizId: result.quizId,
          score: result.score,
          totalQuestions: result.totalQuestions,
          percentage: result.percentage,
          completedAt: result.completedAt,
          user: user ? {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          } : null,
          quiz: quiz ? {
            id: quiz._id.toString(),
            title: quiz.title,
            passingScore: quiz.passingScore,
          } : null,
          answers: result.answers || [],
        };
      })
    );

    return sendSuccess(formattedResults, "Quiz results fetched successfully", 200, {
      count: formattedResults.length,
    });
  } catch (error) {
    return sendError(
      "Failed to fetch quiz results",
      ERROR_CODES.INTERNAL_ERROR,
      500,
      error?.message ?? error
    );
  }
}
