"use client";

import React, { use } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import {
    BookOpenIcon,
    ClockIcon,
    AcademicCapIcon,
    ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function SubjectDetailPage({ params }) {
    const unwrappedParams = use(params);
    const subject = decodeURIComponent(unwrappedParams.subject);

    const {
        data: allLessons,
        error,
        isLoading,
    } = useSWR("/api/lessons", fetcher);

    const { data: quizHistory } = useSWR("/api/quiz-history", fetcher);
    const { data: quizzes } = useSWR("/api/quizzes", fetcher);

    // Filter lessons by subject
    const lessons =
        allLessons?.filter((lesson) => lesson.subject === subject) || [];

    // Get lesson completion status
    const getLessonCompletion = (lessonId) => {
        if (!quizHistory || !quizzes) return null;

        // Find quiz for this subject
        const subjectQuiz = quizzes.find(q => q.subject === subject);
        if (!subjectQuiz) return null;

        // Find latest attempt for this quiz
        const attempts = quizHistory.filter(h => h.quizId === (subjectQuiz._id || subjectQuiz.id));
        if (attempts.length === 0) return null;

        const latestAttempt = attempts.sort((a, b) =>
            new Date(b.completedAt) - new Date(a.completedAt)
        )[0];

        // Check if passed (70% or higher)
        return {
            completed: latestAttempt.percentage >= 70,
            percentage: latestAttempt.percentage
        };
    };

    const getSubjectIcon = (subjectName) => {
        const icons = {
            Mathematics: (
                <svg
                    className="w-16 h-16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                </svg>
            ),
            Science: (
                <svg
                    className="w-16 h-16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                </svg>
            ),
            English: (
                <svg
                    className="w-16 h-16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                </svg>
            ),
            "Social Science": (
                <svg
                    className="w-16 h-16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            ),
            Hindi: (
                <svg
                    className="w-16 h-16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                </svg>
            ),
        };
        return (
            icons[subjectName] || (
                <svg
                    className="w-16 h-16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                </svg>
            )
        );
    };

    const getSubjectColor = (subjectName) => {
        const colors = {
            Mathematics: "from-blue-500 to-blue-600",
            Science: "from-green-500 to-green-600",
            English: "from-purple-500 to-purple-600",
            "Social Science": "from-yellow-500 to-yellow-600",
            Hindi: "from-pink-500 to-pink-600",
        };
        return colors[subjectName] || "from-orange-500 to-orange-600";
    };

    const getDifficultyBadge = (difficulty) => {
        const styles = {
            BEGINNER: "bg-green-100 text-green-700 border-green-200",
            INTERMEDIATE: "bg-yellow-100 text-yellow-700 border-yellow-200",
            ADVANCED: "bg-red-100 text-red-700 border-red-200",
        };
        return styles[difficulty] || styles.INTERMEDIATE;
    };

    if (error) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-beige-50 via-sky-50 to-teal-50 flex items-center justify-center">
                    <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 shadow-lg max-w-md">
                        <p className="text-red-600 font-bold text-lg">
                            Failed to load lessons
                        </p>
                        <p className="text-red-500 text-sm mt-2">{error.message}</p>
                    </div>
                </div>
            </>
        );
    }

    if (isLoading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-beige-50 via-sky-50 to-teal-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto mb-4"></div>
                        <p className="text-slate-700 font-medium">Loading lessons...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-beige-50 via-sky-50 to-teal-50">
                {/* Header */}
                <div
                    className={`bg-gradient-to-r ${getSubjectColor(subject)} py-12 px-6 shadow-lg`}
                >
                    <div className="max-w-6xl mx-auto">
                        <Link
                            href="/subjects"
                            className="inline-flex items-center gap-2 text-white text-sm mb-6 hover:opacity-80 transition-opacity bg-white/20 px-4 py-2 rounded-lg"
                        >
                            <ArrowLeftIcon className="h-4 w-4" />
                            Back to Subjects
                        </Link>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="text-white">{getSubjectIcon(subject)}</div>
                            <div>
                                <h1 className="text-5xl font-black text-white">{subject}</h1>
                                <p className="text-white/90 text-xl mt-2">
                                    {lessons.length} Lessons Available
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lessons List */}
                <div className="max-w-6xl mx-auto px-6 py-12">
                    {lessons.length > 0 ? (
                        <div className="grid gap-6">
                            {lessons.map((lesson, index) => {
                                const completion = getLessonCompletion(lesson.id);
                                const isCompleted = completion?.completed;

                                return (
                                    <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
                                        <div className={`bg-white rounded-2xl shadow-lg border-2 ${isCompleted ? 'border-green-200 bg-green-50/30' : 'border-orange-100'
                                            } p-6 hover:shadow-xl hover:border-orange-300 transition-all duration-200 cursor-pointer group`}>
                                            <div className="flex items-start gap-6">
                                                {/* S.No with completion badge */}
                                                <div className="flex-shrink-0 relative">
                                                    <div
                                                        className={`w-16 h-16 rounded-xl bg-gradient-to-br ${isCompleted ? 'from-green-500 to-green-600' : getSubjectColor(subject)
                                                            } flex items-center justify-center text-white text-2xl font-black shadow-lg group-hover:scale-110 transition-transform`}
                                                    >
                                                        {isCompleted ? (
                                                            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                        ) : (
                                                            index + 1
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Lesson Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-4 mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <h3 className="text-2xl font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                                                                {lesson.title}
                                                            </h3>
                                                            {isCompleted && (
                                                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                    </svg>
                                                                    Passed
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${getDifficultyBadge(lesson.difficulty)} flex-shrink-0`}
                                                        >
                                                            {lesson.difficulty}
                                                        </span>
                                                    </div>

                                                    <p className="text-slate-600 text-base mb-4 leading-relaxed line-clamp-2">
                                                        {lesson.description}
                                                    </p>

                                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                                        <div className="flex items-center gap-2">
                                                            <AcademicCapIcon className="h-4 w-4" />
                                                            <span>Grade {lesson.grade}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <ClockIcon className="h-4 w-4" />
                                                            <span>30 min read</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <BookOpenIcon className="h-4 w-4" />
                                                            <span className={`${isCompleted ? 'text-green-600' : 'text-orange-600'
                                                                } font-semibold group-hover:underline`}>
                                                                {isCompleted ? 'Review Lesson →' : 'Start Learning →'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <BookOpenIcon className="h-24 w-24 text-orange-300 mx-auto mb-6" />
                            <h2 className="text-3xl font-bold text-slate-700 mb-2">
                                No lessons available
                            </h2>
                            <p className="text-slate-500 text-lg">
                                Check back later for new content in {subject}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
