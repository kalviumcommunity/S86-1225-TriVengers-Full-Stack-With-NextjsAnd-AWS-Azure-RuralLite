"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import useSWR from "swr";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { clientDevError } from "@/lib/utils/devLogger";

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  const json = await res.json();
  return json.data;
};

export default function QuizDetailPage({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showPreviousResults, setShowPreviousResults] = useState(false);
  const [previousAttempt, setPreviousAttempt] = useState(null);

  const { data: quizHistory } = useSWR("/api/quiz-history", fetcher);

  useEffect(() => {
    fetchQuiz();
  }, [unwrappedParams.id]);

  useEffect(() => {
    // Check if user has already completed this quiz
    if (quiz && quizHistory) {
      const attempts = quizHistory.filter(h => h.quizId === (quiz._id || quiz.id));
      if (attempts.length > 0) {
        // Get latest attempt
        const latest = attempts.sort((a, b) =>
          new Date(b.completedAt) - new Date(a.completedAt)
        )[0];
        setPreviousAttempt(latest);
        setShowPreviousResults(true);
      }
    }
  }, [quiz, quizHistory]);

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/quizzes?id=${unwrappedParams.id}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setQuiz(data.data);
      } else {
        toast.error("Quiz not found");
      }
    } catch (err) {
      clientDevError("Failed to fetch quiz:", err);
      toast.error("Failed to load quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (submitted) return;

    const totalQuestions = quiz.questions?.length || 0;
    if (Object.keys(answers).length < totalQuestions) {
      toast.error("Please answer all questions before submitting");
      return;
    }

    let correctCount = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / totalQuestions) * 100);
    setScore(percentage);
    setSubmitted(true);

    const passed = percentage >= 70;

    // Save to quiz history (saves ALL attempts including failed)
    try {
      await fetch("/api/quiz-history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quizId: quiz._id || quiz.id,
          quizTitle: quiz.title,
          subject: quiz.subject,
          score: correctCount,
          totalQuestions,
          answers,
        }),
      });

      // Mark lessons complete if passed
      if (passed) {
        const lessonsResponse = await fetch("/api/lessons");
        const lessonsData = await lessonsResponse.json();

        if (lessonsData.success && lessonsData.data) {
          const subjectLessons = lessonsData.data.filter(l => l.subject === quiz.subject);

          for (const lesson of subjectLessons) {
            try {
              await fetch("/api/progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  lessonId: lesson.id || lesson._id,
                  completed: true,
                  progress: 100
                })
              });
            } catch (err) {
              console.error(`Failed to mark lesson ${lesson.id} complete:`, err);
            }
          }
        }
      }

      if (percentage >= 80) {
        toast.success(`🎉 Excellent! You scored ${correctCount}/${totalQuestions} (${percentage}%)${passed ? " - Lessons marked complete!" : ""}`);
      } else if (percentage >= 70) {
        toast.success(`✅ Good job! You scored ${correctCount}/${totalQuestions} (${percentage}%)${passed ? " - Lessons marked complete!" : ""}`);
      } else if (percentage >= 60) {
        toast.error(`You scored ${correctCount}/${totalQuestions} (${percentage}%). Score 70%+ to complete lessons!`);
      } else {
        toast.error(`You scored ${correctCount}/${totalQuestions} (${percentage}%). Keep practicing!`);
      }
    } catch (err) {
      console.error("Failed to save quiz result:", err);
      toast.error("Failed to save result");
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto mb-4"></div>
            <p className="text-orange-600 font-semibold text-lg">Loading quiz...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (!quiz) {
    return (
      <AuthGuard>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-orange-900 mb-2">Quiz Not Found</h2>
            <Link href="/quizzes">
              <button className="mt-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-600 transition">
                Back to Quizzes
              </button>
            </Link>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (submitted) {
    const passed = score >= 70;
    const correctCount = Math.round((score / 100) * (quiz.questions?.length || 0));

    return (
      <AuthGuard>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center px-4 py-10">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl w-full">
            <div className="text-center mb-8">
              <div className="mb-4">
                {passed ? (
                  <svg className="w-24 h-24 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-24 h-24 text-orange-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <h2 className="text-4xl font-black text-orange-900 mb-2">
                {passed ? "🎉 Congratulations!" : "Keep Learning!"}
              </h2>
              <div className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-2xl shadow-lg mt-4">
                <p className="text-3xl font-bold">{score}%</p>
                <p className="text-sm">Your Score</p>
              </div>
              <p className="text-slate-600 mt-4">
                You got {correctCount} out of {quiz.questions?.length} correct
              </p>
              {passed && (
                <p className="text-green-600 font-semibold mt-2">
                  ✅ All {quiz.subject} lessons marked as complete!
                </p>
              )}
            </div>

            {/* Question Review */}
            <div className="space-y-4 mb-8 max-h-96 overflow-y-auto">
              {quiz.questions.map((question, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === question.correctAnswer;

                return (
                  <div
                    key={index}
                    className={`p-5 rounded-xl border-2 ${isCorrect ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl flex-shrink-0">{isCorrect ? "✅" : "❌"}</span>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 mb-3">
                          {index + 1}. {question.question}
                        </p>
                        <div className="space-y-2">
                          <p className="text-sm">
                            <span className="font-semibold text-slate-700">Your answer:</span>{" "}
                            <span className={isCorrect ? "text-green-700 font-medium" : "text-red-700 font-medium"}>
                              {userAnswer || "Not answered"}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p className="text-sm">
                              <span className="font-semibold text-slate-700">Correct answer:</span>{" "}
                              <span className="text-green-700 font-medium">{question.correctAnswer}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/quizzes/history" className="flex-1">
                <button className="w-full bg-white text-orange-700 px-6 py-3 rounded-xl font-semibold border-2 border-orange-300 hover:bg-orange-50 transition-all shadow-md hover:shadow-lg">
                  View History
                </button>
              </Link>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setAnswers({});
                  setScore(0);
                  toast.success("Quiz reset! Try again.");
                }}
                className="flex-1 bg-orange-100 text-orange-700 px-6 py-3 rounded-xl font-semibold border-2 border-orange-200 hover:bg-orange-200 transition-all shadow-md hover:shadow-lg"
              >
                Retake Quiz
              </button>
              <Link href={`/subjects/${quiz.subject}`} className="flex-1">
                <button className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-orange-600 transition-all shadow-md hover:shadow-lg">
                  Back to Lessons
                </button>
              </Link>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  // Show previous results if quiz already completed
  if (showPreviousResults && previousAttempt && !submitted) {
    const passed = previousAttempt.percentage >= 70;

    return (
      <AuthGuard>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center px-4 py-10">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl w-full">
            <div className="text-center mb-8">
              <div className="mb-4">
                {passed ? (
                  <svg className="w-24 h-24 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-24 h-24 text-orange-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <h2 className="text-4xl font-black text-orange-900 mb-2">
                {passed ? "Quiz Completed!" : "Previous Attempt"}
              </h2>
              <div className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-2xl shadow-lg mt-4">
                <p className="text-3xl font-bold">{previousAttempt.percentage}%</p>
                <p className="text-sm">Your Score</p>
              </div>
              <p className="text-slate-600 mt-4">
                You got {previousAttempt.score} out of {previousAttempt.totalQuestions} correct
              </p>
              {passed && (
                <p className="text-green-600 font-semibold mt-2 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Passed · Completed on {new Date(previousAttempt.completedAt).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Question Review */}
            {previousAttempt.answers && (
              <div className="space-y-4 mb-8 max-h-96 overflow-y-auto">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Your Answers:</h3>
                {quiz.questions.map((question, index) => {
                  const userAnswer = previousAttempt.answers[index];
                  const isCorrect = userAnswer === question.correctAnswer;

                  return (
                    <div
                      key={index}
                      className={`p-5 rounded-xl border-2 ${isCorrect ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl flex-shrink-0">{isCorrect ? "✅" : "❌"}</span>
                        <div className="flex-1">
                          <p className="font-bold text-slate-900 mb-3">
                            {index + 1}. {question.question}
                          </p>
                          <div className="space-y-2">
                            <p className="text-sm">
                              <span className="font-semibold text-slate-700">Your answer:</span>{" "}
                              <span className={isCorrect ? "text-green-700 font-medium" : "text-red-700 font-medium"}>
                                {userAnswer || "Not answered"}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p className="text-sm">
                                <span className="font-semibold text-slate-700">Correct answer:</span>{" "}
                                <span className="text-green-700 font-medium">{question.correctAnswer}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowPreviousResults(false);
                  setAnswers({});
                  setSubmitted(false);
                }}
                className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-orange-600 transition-all shadow-md hover:shadow-lg"
              >
                Retake Quiz
              </button>
              <Link href="/quizzes/history" className="flex-1">
                <button className="w-full bg-white border-2 border-orange-200 text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-all">
                  View History
                </button>
              </Link>
              <Link href={`/subjects/${quiz.subject}`} className="flex-1">
                <button className="w-full bg-white border-2 border-orange-200 text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-all">
                  Back to Lessons
                </button>
              </Link>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Header */}
        <div className="bg-white border-b-2 border-orange-200 sticky top-0 z-20 shadow-md">
          <div className="max-w-5xl mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/quizzes">
                  <button className="text-orange-600 hover:text-orange-700 transition">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-orange-900">{quiz.title}</h1>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                      {quiz.subject}
                    </span>
                    <span className="text-sm text-slate-600">{quiz.questions?.length} Questions</span>
                  </div>
                </div>
              </div>
              <div className="text-center bg-orange-50 px-6 py-3 rounded-xl border-2 border-orange-200">
                <div className="text-lg font-bold text-orange-600">
                  {Object.keys(answers).length} / {quiz.questions?.length}
                </div>
                <div className="text-xs text-slate-600">Answered</div>
              </div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="space-y-6">
            {quiz.questions?.map((question, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border-2 border-orange-100 p-6 hover:shadow-xl transition">
                <div className="flex gap-4 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-lg font-semibold text-slate-900 flex-1 pt-1">
                    {question.question}
                  </p>
                </div>

                <div className="space-y-3 ml-14">
                  {question.options?.map((option, optionIndex) => {
                    const isSelected = answers[index] === option;

                    return (
                      <label
                        key={optionIndex}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                          ? "border-orange-500 bg-orange-50 shadow-md"
                          : "border-slate-200 hover:border-orange-300 hover:bg-orange-50/50"
                          }`}
                      >
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={option}
                          checked={isSelected}
                          onChange={() => handleAnswerChange(index, option)}
                          className="w-5 h-5 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-slate-700 font-medium">{option}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg border-2 border-orange-200 p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-slate-600">
                  Progress: <span className="font-bold text-orange-600">{Object.keys(answers).length} / {quiz.questions?.length}</span> answered
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {Object.keys(answers).length < quiz.questions?.length
                    ? `${quiz.questions?.length - Object.keys(answers).length} questions remaining`
                    : "All questions answered!"}
                </p>
              </div>
              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < quiz.questions?.length}
                className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-orange-700 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center gap-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Submit Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
