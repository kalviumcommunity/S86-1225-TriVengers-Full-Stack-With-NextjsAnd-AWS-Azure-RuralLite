"use client";

import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/fetcher";

export default function QuizzesPage() {
  const { data: quizzes, error, isLoading } = useSWR("/api/quizzes", fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 60000, // Refresh every 60 seconds
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Stop retrying after 3 attempts
      if (retryCount >= 3) return;
      // Retry after 2 seconds
      setTimeout(() => revalidate({ retryCount }), 2000);
    },
  });

  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitQuiz = async () => {
    if (!selectedQuiz) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/quiz-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          quizId: selectedQuiz.id,
          answers,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Quiz submitted! Score: ${result.score}%`);
        setSelectedQuiz(null);
        setAnswers({});
      }
    } catch (error) {
      console.error("Failed to submit quiz:", error);
      alert("Failed to submit quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-semibold">Failed to load quizzes</p>
          <p className="text-red-500 text-sm mt-1">{error.message}</p>
          <button
            onClick={() => mutate("/api/quizzes")}
            className="mt-3 text-sm text-red-700 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading quizzes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedQuiz) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <button
          onClick={() => setSelectedQuiz(null)}
          className="mb-4 text-green-600 hover:text-green-700"
        >
          ← Back to Quizzes
        </button>
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">{selectedQuiz.title}</h2>
          <p className="text-gray-600 mb-6">{selectedQuiz.description}</p>

          <div className="space-y-6">
            {selectedQuiz.questions?.map((question, idx) => (
              <div key={idx} className="border-b pb-4">
                <p className="font-medium mb-3">
                  {idx + 1}. {question.text}
                </p>
                <div className="space-y-2 ml-4">
                  {question.options?.map((option, optIdx) => (
                    <label key={optIdx} className="flex items-center">
                      <input
                        type="radio"
                        name={`question-${idx}`}
                        value={option}
                        checked={answers[idx] === option}
                        onChange={(e) =>
                          setAnswers({ ...answers, [idx]: e.target.value })
                        }
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmitQuiz}
            disabled={isSubmitting}
            className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Quizzes</h1>

      <div className="space-y-4">
        {quizzes && quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white border rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
              <p className="text-gray-600 mb-3">{quiz.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {quiz.questions?.length || 0} questions
                </span>
                <button
                  onClick={() => setSelectedQuiz(quiz)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Start Quiz
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No quizzes available
          </div>
        )}
      </div>
    </div>
  );
}
