"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import Link from "next/link";

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch");
  }
  const json = await res.json();
  return json.data;
};

export default function QuizzesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectParam = searchParams.get("subject");

  const { data: quizzes, error, isLoading } = useSWR("/api/quizzes", fetcher);
  const { data: quizHistory } = useSWR("/api/quiz-history", fetcher);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const getSubjects = () => {
    if (!quizzes) return [];
    const subjectsSet = new Set();
    quizzes.forEach((quiz) => {
      if (quiz.subject) subjectsSet.add(quiz.subject);
    });
    return Array.from(subjectsSet);
  };

  // Auto-select subject from URL parameter
  useEffect(() => {
    if (subjectParam && quizzes) {
      const matchingSubject = getSubjects().find(s => s === subjectParam);
      if (matchingSubject) {
        setSelectedSubject(matchingSubject);
      }
    }
  }, [subjectParam, quizzes]);

  const subjects = getSubjects();

  // Get completion status for a quiz
  const getQuizCompletion = (quizId) => {
    if (!quizHistory) return null;

    // Find the most recent attempt for this quiz
    const attempts = quizHistory.filter(h => h.quizId === quizId);
    if (attempts.length === 0) return null;

    // Sort by completedAt descending and get the latest
    const latestAttempt = attempts.sort((a, b) =>
      new Date(b.completedAt) - new Date(a.completedAt)
    )[0];

    return {
      completed: true,
      score: latestAttempt.score,
      totalQuestions: latestAttempt.totalQuestions,
      percentage: latestAttempt.percentage,
      completedAt: latestAttempt.completedAt
    };
  };

  const getSubjectIcon = (subject) => {
    const icons = {
      Mathematics: (
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      Science: (
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      English: (
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      "Social Science": (
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      Hindi: (
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      ),
    };
    return icons[subject] || icons.Mathematics;
  };

  const getSubjectColor = (subject) => {
    const colors = {
      Mathematics: "from-blue-500 to-blue-600",
      Science: "from-green-500 to-green-600",
      English: "from-purple-500 to-purple-600",
      "Social Science": "from-yellow-500 to-yellow-600",
      Hindi: "from-pink-500 to-pink-600",
    };
    return colors[subject] || "from-orange-500 to-orange-600";
  };

  const backToSubjects = () => {
    setSelectedSubject(null);
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
          <Navbar />
          <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-orange-600 font-semibold text-lg">Loading quizzes...</p>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
          <Navbar />
          <div className="flex items-center justify-center h-screen">
            <div className="bg-white rounded-2xl border border-red-200 shadow-xl p-8 max-w-md">
              <div className="flex items-center gap-3 text-red-600 mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-bold">Error Loading Quizzes</h2>
              </div>
              <p className="text-slate-600">{error?.message || "Failed to fetch quizzes"}</p>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <Navbar />

        {!selectedSubject ? (
          // Subjects Selection View
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Page Header */}
            <div className="mb-10 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl opacity-10"></div>
              <div className="relative p-8">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                      Choose Your Subject
                    </h1>
                  </div>

                  {/* History Button */}
                  <Link href="/quizzes/history">
                    <button className="flex items-center gap-2 bg-white/95 border-2 border-orange-200 text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 hover:border-orange-300 transition shadow-lg hover:shadow-xl">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      View History
                    </button>
                  </Link>
                </div>
                <p className="text-slate-600 text-lg">Select a subject to see available quizzes</p>
              </div>
            </div>

            {/* Subjects Grid */}
            {subjects && subjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {subjects.map((subject, idx) => {
                  const subjectQuizzes = quizzes?.filter((q) => q.subject === subject) || [];
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedSubject(subject)}
                      className="group bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-orange-100 shadow-lg hover:shadow-2xl hover:scale-105 hover:border-orange-300 transition-all duration-300 p-8 text-center"
                    >
                      <div
                        className={`w-20 h-20 bg-gradient-to-br ${getSubjectColor(subject)} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-all`}
                      >
                        {getSubjectIcon(subject)}
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-orange-600 transition">
                        {subject}
                      </h3>
                      <p className="text-slate-600 text-sm">
                        {subjectQuizzes.length} {subjectQuizzes.length === 1 ? "Quiz" : "Quizzes"}
                      </p>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-orange-200 shadow-xl p-12 max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">No Subjects Available</h3>
                  <p className="text-slate-600">Check back later for new quizzes!</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Quizzes List for Selected Subject
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Back Button */}
            <button
              onClick={backToSubjects}
              className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold mb-6 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Subjects
            </button>

            {/* Page Header */}
            <div className="mb-10 relative">
              <div
                className={`absolute inset-0 bg-gradient-to-r ${getSubjectColor(selectedSubject)} rounded-2xl opacity-10`}
              ></div>
              <div className="relative p-8">
                <div className="flex items-center gap-4 mb-2">
                  <div className={`w-16 h-16 bg-gradient-to-br ${getSubjectColor(selectedSubject)} rounded-2xl flex items-center justify-center shadow-lg`}>
                    {getSubjectIcon(selectedSubject)}
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-slate-800">{selectedSubject} Quizzes</h1>
                    <p className="text-slate-600">Test your knowledge with these quizzes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quiz Cards Grid */}
            {quizzes?.filter((q) => q.subject === selectedSubject).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes
                  .filter((q) => q.subject === selectedSubject)
                  .map((quiz) => {
                    const completion = getQuizCompletion(quiz._id || quiz.id);
                    const isCompleted = completion !== null;

                    return (
                      <div
                        key={quiz.id || quiz._id}
                        className="group bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-orange-100 shadow-lg hover:shadow-2xl hover:scale-105 hover:border-orange-300 transition-all duration-300 overflow-hidden"
                      >
                        <div className="p-6">
                          {/* Quiz Info with Completion Badge */}
                          <div className="flex items-center justify-between mb-4">
                            <span
                              className={`inline-block px-3 py-1 bg-gradient-to-r ${getSubjectColor(selectedSubject)} text-white text-sm font-semibold rounded-full shadow-md`}
                            >
                              {quiz.questions?.length || 0} Questions
                            </span>

                            {isCompleted && (
                              <div className="flex items-center gap-2">
                                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  Passed
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Quiz Title */}
                          <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-orange-600 transition">
                            {quiz.title}
                          </h3>

                          {/* Description */}
                          {quiz.description && (
                            <p className="text-slate-600 text-sm mb-4 line-clamp-2">{quiz.description}</p>
                          )}

                          {/* Completion Info */}
                          {isCompleted && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-green-700 font-semibold">
                                  Score: {completion.score}/{completion.totalQuestions}
                                </span>
                                <span className="text-green-600 text-xs">
                                  {new Date(completion.completedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Start/View Button */}
                          <Link href={`/quizzes/${quiz._id || quiz.id}`}>
                            <button
                              className={`w-full ${isCompleted
                                ? 'bg-gradient-to-r from-green-500 to-green-600'
                                : `bg-gradient-to-r ${getSubjectColor(selectedSubject)}`
                                } text-white py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-md hover:shadow-lg flex items-center justify-center gap-2`}
                            >
                              <span>{isCompleted ? 'View Details' : 'Start Quiz'}</span>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </button>
                          </Link>
                        </div>

                        {/* Decorative Bottom Border */}
                        <div className={`h-2 bg-gradient-to-r ${isCompleted ? 'from-green-500 to-green-600' : getSubjectColor(selectedSubject)
                          }`}></div>
                      </div>
                    )
                  })}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-orange-200 shadow-xl p-12 max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">
                    No Quizzes for {selectedSubject}
                  </h3>
                  <p className="text-slate-600">Check back later for new quizzes in this subject!</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
