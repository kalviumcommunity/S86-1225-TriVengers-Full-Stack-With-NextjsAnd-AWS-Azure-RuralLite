"use client";
import React from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import {
    BookOpenIcon,
    AcademicCapIcon,
    ChartBarIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function SubjectsPage() {
    const { data: lessons, error, isLoading } = useSWR("/api/lessons", fetcher);

    // Group lessons by subject
    const subjectGroups = {};
    if (lessons) {
        lessons.forEach((lesson) => {
            if (!subjectGroups[lesson.subject]) {
                subjectGroups[lesson.subject] = [];
            }
            subjectGroups[lesson.subject].push(lesson);
        });
    }

    const subjects = Object.keys(subjectGroups);

    const getSubjectIcon = (subject) => {
        const icons = {
            Mathematics: (
                <svg
                    className="w-8 h-8 text-white"
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
                    className="w-8 h-8 text-white"
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
                    className="w-8 h-8 text-white"
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
                    className="w-8 h-8 text-white"
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
                    className="w-8 h-8 text-white"
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
            icons[subject] || (
                <svg
                    className="w-8 h-8 text-white"
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

    if (error) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
                    <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 shadow-lg max-w-md">
                        <p className="text-red-600 font-bold text-lg">Failed to load subjects</p>
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
                <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto mb-4"></div>
                        <p className="text-slate-700 font-medium">Loading subjects...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-12 shadow-xl">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-4 mb-4">
                            <AcademicCapIcon className="h-16 w-16 text-white" />
                            <div>
                                <h1 className="text-5xl font-bold text-white mb-2">Browse Subjects</h1>
                                <p className="text-white text-lg opacity-90">
                                    Explore {subjects.length} subjects with {lessons?.length || 0} lessons
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subjects Grid */}
                <div className="max-w-7xl mx-auto px-4 py-12">
                    {subjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {subjects.map((subject) => (
                                <Link
                                    key={subject}
                                    href={`/subjects/${encodeURIComponent(subject)}`}
                                    className="group"
                                >
                                    <div className="bg-white rounded-3xl shadow-xl border-2 border-orange-100 p-8 hover:shadow-2xl hover:border-orange-300 transition-all duration-300 hover:transform hover:scale-105 h-full">
                                        {/* Subject Icon & Title */}
                                        <div className="flex items-center gap-4 mb-6">
                                            <div
                                                className={`w-20 h-20 bg-gradient-to-br ${getSubjectColor(
                                                    subject
                                                )} rounded-2xl flex items-center justify-center shadow-lg`}
                                            >
                                                {getSubjectIcon(subject)}
                                            </div>
                                            <div className="flex-1">
                                                <h2 className="text-2xl font-bold text-slate-800 group-hover:text-orange-600 transition-colors mb-1">
                                                    {subject}
                                                </h2>
                                                <div className="flex items-center gap-2">
                                                    <ChartBarIcon className="h-4 w-4 text-orange-600" />
                                                    <span className="text-sm text-orange-600 font-semibold">
                                                        {subjectGroups[subject].length} Lessons
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mb-4">
                                            <div className="w-full bg-orange-100 rounded-full h-3">
                                                <div
                                                    className={`bg-gradient-to-r ${getSubjectColor(
                                                        subject
                                                    )} h-3 rounded-full transition-all duration-300`}
                                                    style={{
                                                        width: `${Math.min(
                                                            (subjectGroups[subject].length / 5) * 100,
                                                            100
                                                        )}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Lesson Preview */}
                                        <div className="space-y-2">
                                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2">
                                                Latest Lessons:
                                            </p>
                                            {subjectGroups[subject].slice(0, 3).map((lesson, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-2 text-sm text-slate-600"
                                                >
                                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                                                    <span className="line-clamp-1">{lesson.title}</span>
                                                </div>
                                            ))}
                                            {subjectGroups[subject].length > 3 && (
                                                <p className="text-xs text-orange-600 font-semibold mt-2">
                                                    +{subjectGroups[subject].length - 3} more lessons
                                                </p>
                                            )}
                                        </div>

                                        {/* View Button */}
                                        <div className="mt-6 pt-6 border-t border-orange-100">
                                            <span className="text-orange-600 font-semibold group-hover:text-orange-700 flex items-center gap-2">
                                                Explore Lessons
                                                <svg
                                                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                                    />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <BookOpenIcon className="h-24 w-24 text-orange-300 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-slate-700 mb-2">
                                No subjects available
                            </h3>
                            <p className="text-slate-500">Check back later for new content</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
