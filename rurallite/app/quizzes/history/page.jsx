"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";

const fetcher = async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Failed to fetch");
    }
    const json = await res.json();
    return json.data;
};

export default function QuizHistoryPage() {
    const { data: quizHistory, error, isLoading } = useSWR("/api/quiz-history", fetcher);
    const [selectedSubject, setSelectedSubject] = useState(null);

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

    const filteredHistory = selectedSubject
        ? quizHistory?.filter(entry => entry.subject === selectedSubject)
        : quizHistory;

    const subjects = quizHistory
        ? [...new Set(quizHistory.map(entry => entry.subject))]
        : [];

    if (isLoading) {
        return (
            <AuthGuard>
                <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
                    <Navbar />
                    <div className="flex items-center justify-center h-screen">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-orange-600 font-semibold text-lg">Loading history...</p>
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
                                <h2 className="text-2xl font-bold">Error Loading History</h2>
                            </div>
                            <p className="text-slate-600">{error?.message || "Failed to fetch quiz history"}</p>
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    {/* Header */}
                    <div className="mb-8">
                        <Link href="/quizzes">
                            <button className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold mb-4 transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Quizzes
                            </button>
                        </Link>

                        <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-xl p-8">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold text-slate-800">Quiz History</h1>
                                    <p className="text-slate-600">{quizHistory?.length || 0} quiz attempts</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subject Filter */}
                    {subjects.length > 0 && (
                        <div className="mb-6 flex flex-wrap gap-3">
                            <button
                                onClick={() => setSelectedSubject(null)}
                                className={`px-5 py-2 rounded-full font-semibold transition-all ${!selectedSubject
                                        ? "bg-orange-600 text-white shadow-lg"
                                        : "bg-white text-orange-600 border-2 border-orange-200 hover:border-orange-400"
                                    }`}
                            >
                                All Subjects
                            </button>
                            {subjects.map(subject => (
                                <button
                                    key={subject}
                                    onClick={() => setSelectedSubject(subject)}
                                    className={`px-5 py-2 rounded-full font-semibold transition-all ${selectedSubject === subject
                                            ? "bg-orange-600 text-white shadow-lg"
                                            : "bg-white text-orange-600 border-2 border-orange-200 hover:border-orange-400"
                                        }`}
                                >
                                    {subject}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* History List */}
                    {filteredHistory && filteredHistory.length > 0 ? (
                        <div className="space-y-4">
                            {filteredHistory.map((entry) => {
                                const date = new Date(entry.completedAt);
                                const isPassed = entry.percentage >= 70;

                                return (
                                    <div
                                        key={entry.id}
                                        className="bg-white rounded-2xl border-2 border-orange-100 shadow-lg hover:shadow-xl transition p-6"
                                    >
                                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                                    <span
                                                        className={`inline-block px-4 py-1 bg-gradient-to-r ${getSubjectColor(
                                                            entry.subject
                                                        )} text-white text-sm font-semibold rounded-full shadow-md`}
                                                    >
                                                        {entry.subject}
                                                    </span>
                                                    <h3 className="text-xl font-bold text-slate-800">{entry.quizTitle}</h3>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mt-3">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {date.toLocaleDateString("en-US", {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        })}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {date.toLocaleTimeString("en-US", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                {/* Score Display */}
                                                <div
                                                    className={`text-center px-6 py-4 rounded-xl shadow-lg ${isPassed
                                                            ? "bg-gradient-to-br from-green-500 to-green-600"
                                                            : "bg-gradient-to-br from-red-500 to-red-600"
                                                        }`}
                                                >
                                                    <div className="text-3xl font-black text-white">{entry.percentage}%</div>
                                                    <div className="text-xs text-white/90 font-medium">
                                                        {entry.score}/{entry.totalQuestions} correct
                                                    </div>
                                                </div>

                                                {/* Retake Button */}
                                                <Link href={`/quizzes/${entry.quizId}`}>
                                                    <button className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-6 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                        </svg>
                                                        Retake
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="mt-4 pt-4 border-t border-orange-100">
                                            <span
                                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm ${isPassed
                                                        ? "bg-green-50 text-green-700 border border-green-200"
                                                        : "bg-red-50 text-red-700 border border-red-200"
                                                    }`}
                                            >
                                                {isPassed ? (
                                                    <>
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Passed - Lessons Completed ✅
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Failed - Try again to score 70%+
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="bg-white rounded-2xl border border-orange-200 shadow-xl p-12 max-w-md mx-auto">
                                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-3">No Quiz History</h3>
                                <p className="text-slate-600 mb-6">
                                    {selectedSubject
                                        ? `You haven't taken any ${selectedSubject} quizzes yet.`
                                        : "You haven't taken any quizzes yet."}
                                </p>
                                <Link href="/quizzes">
                                    <button className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl">
                                        Take Your First Quiz
                                    </button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthGuard>
    );
}
