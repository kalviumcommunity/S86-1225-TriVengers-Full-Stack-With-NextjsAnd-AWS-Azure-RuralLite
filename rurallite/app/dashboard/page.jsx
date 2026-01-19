"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import useSWR from "swr";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { fetcher, swrConfig } from "@/lib/fetcher";

export default function DashboardPage() {
  const { user } = useAuth();
  // Fix: Add open state for ConfirmModal if needed
  const [open, setOpen] = useState(false);

  // Determine user role
  const userRole = user?.role?.toUpperCase();
  const isAdmin = userRole === "ADMIN";
  const isTeacher = userRole === "TEACHER";
  const isStudent = userRole === "STUDENT" || (!isAdmin && !isTeacher);

  // Fetch data based on role
  const { data: quizHistory } = useSWR(
    isStudent ? "/api/quiz-history" : null,
    fetcher,
    swrConfig
  );
  const { data: quizzes } = useSWR("/api/quizzes", fetcher, swrConfig);
  const { data: lessons } = useSWR(
    isAdmin || isTeacher ? "/api/lessons" : null,
    fetcher,
    swrConfig
  );
  const { data: users } = useSWR(
    isAdmin ? "/api/users" : null,
    fetcher,
    swrConfig
  );

  // Student stats
  const studentStats = useMemo(() => {
    if (!isStudent || !quizHistory || !quizzes)
      return { lessonsCompleted: 0, quizzesTaken: 0, averageScore: 0 };

    const passedSubjects = new Set();
    quizHistory.forEach((attempt) => {
      if (attempt.percentage >= 70) {
        passedSubjects.add(attempt.subject);
      }
    });

    return {
      lessonsCompleted: passedSubjects.size,
      quizzesTaken: quizHistory.length,
      averageScore:
        quizHistory.length > 0
          ? Math.round(
              quizHistory.reduce((sum, quiz) => sum + quiz.percentage, 0) /
                quizHistory.length
            )
          : 0,
    };
  }, [isStudent, quizHistory, quizzes]);

  // Teacher/Admin stats
  const teacherStats = useMemo(() => {
    if (!lessons || !quizzes)
      return { totalSubjects: 0, totalLessons: 0, totalQuizzes: 0 };

    const subjects = new Set(lessons.map((l) => l.subject));
    return {
      totalSubjects: subjects.size,
      totalLessons: lessons.length,
      totalQuizzes: quizzes.length,
    };
  }, [lessons, quizzes]);

  // Admin stats
  const adminStats = useMemo(() => {
    if (!users) return { totalUsers: 0, totalStudents: 0, totalTeachers: 0 };

    return {
      totalUsers: users.length,
      totalStudents: users.filter((u) => u.role?.toUpperCase() === "STUDENT")
        .length,
      totalTeachers: users.filter((u) => u.role?.toUpperCase() === "TEACHER")
        .length,
    };
  }, [users]);

  return (
    <AuthGuard>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <div className="mb-10 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl opacity-10"></div>
            <div className="relative p-8">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-2">
                Welcome back, {user?.name || "User"}! 👋
              </h1>
              <p className="text-slate-600 text-lg">
                {isAdmin && "Manage your platform"}
                {isTeacher && "Manage your courses and students"}
                {isStudent && "Ready to continue your learning journey"}
              </p>
            </div>
          </div>

          {/* STUDENT DASHBOARD */}
          {isStudent && (
            <>
              {/* Student Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white rounded-2xl shadow-xl border-2 border-orange-100 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide">
                        Lessons Completed
                      </p>
                      <p className="text-5xl font-bold bg-gradient-to-br from-orange-600 to-orange-500 bg-clip-text text-transparent mt-3">
                        {studentStats.lessonsCompleted}
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
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
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border-2 border-orange-100 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide">
                        Quizzes Taken
                      </p>
                      <p className="text-5xl font-bold bg-gradient-to-br from-orange-600 to-orange-500 bg-clip-text text-transparent mt-3">
                        {studentStats.quizzesTaken}
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
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
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border-2 border-orange-100 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide">
                        Average Score
                      </p>
                      <p className="text-5xl font-bold bg-gradient-to-br from-orange-600 to-orange-500 bg-clip-text text-transparent mt-3">
                        {studentStats.averageScore}%
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
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
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Quick Actions */}
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link href="/subjects">
                  <div className="group bg-white rounded-2xl shadow-lg border-2 border-orange-100 p-6 hover:shadow-2xl hover:scale-105 hover:border-orange-300 transition-all duration-300 cursor-pointer">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <svg
                        className="w-7 h-7 text-white"
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
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-orange-600 transition">
                      Browse Subjects
                    </h3>
                    <p className="text-sm text-slate-500">
                      Explore lessons by subject
                    </p>
                  </div>
                </Link>

                <Link href="/quizzes">
                  <div className="group bg-white rounded-2xl shadow-lg border-2 border-orange-100 p-6 hover:shadow-2xl hover:scale-105 hover:border-orange-300 transition-all duration-300 cursor-pointer">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-orange-600 transition">
                      Take Quizzes
                    </h3>
                    <p className="text-sm text-slate-500">
                      Test your knowledge
                    </p>
                  </div>
                </Link>

                <Link href="/notes">
                  <div className="group bg-white rounded-2xl shadow-lg border-2 border-orange-100 p-6 hover:shadow-2xl hover:scale-105 hover:border-orange-300 transition-all duration-300 cursor-pointer">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-orange-600 transition">
                      My Notes
                    </h3>
                    <p className="text-sm text-slate-500">Review your notes</p>
                  </div>
                </Link>

                <Link href="/profile">
                  <div className="group bg-white rounded-2xl shadow-lg border-2 border-orange-100 p-6 hover:shadow-2xl hover:scale-105 hover:border-orange-300 transition-all duration-300 cursor-pointer">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-orange-600 transition">
                      My Profile
                    </h3>
                    <p className="text-sm text-slate-500">
                      Manage your account
                    </p>
                  </div>
                </Link>
              </div>
            </>
          )}

          {/* TEACHER DASHBOARD */}
          {isTeacher && (
            <>
              {/* Teacher Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide">
                        Total Subjects
                      </p>
                      <p className="text-5xl font-bold bg-gradient-to-br from-blue-600 to-blue-500 bg-clip-text text-transparent mt-3">
                        {teacherStats.totalSubjects}
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
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
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide">
                        Total Lessons
                      </p>
                      <p className="text-5xl font-bold bg-gradient-to-br from-blue-600 to-blue-500 bg-clip-text text-transparent mt-3">
                        {teacherStats.totalLessons}
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
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
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide">
                        Total Quizzes
                      </p>
                      <p className="text-5xl font-bold bg-gradient-to-br from-blue-600 to-blue-500 bg-clip-text text-transparent mt-3">
                        {teacherStats.totalQuizzes}
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
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
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Teacher Quick Actions */}
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Teacher Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/lessons">
                  <div className="group bg-white rounded-2xl shadow-lg border-2 border-blue-100 p-6 hover:shadow-2xl hover:scale-105 hover:border-blue-300 transition-all duration-300 cursor-pointer">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition">
                      Manage Lessons
                    </h3>
                    <p className="text-sm text-slate-500">
                      Create and edit lessons
                    </p>
                  </div>
                </Link>

                <Link href="/quizzes/manage">
                  <div className="group bg-white rounded-2xl shadow-lg border-2 border-blue-100 p-6 hover:shadow-2xl hover:scale-105 hover:border-blue-300 transition-all duration-300 cursor-pointer">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-purple-600 transition">
                      Manage Quizzes
                    </h3>
                    <p className="text-sm text-slate-500">
                      Create and edit quizzes
                    </p>
                  </div>
                </Link>

                <Link href="/subjects">
                  <div className="group bg-white rounded-2xl shadow-lg border-2 border-blue-100 p-6 hover:shadow-2xl hover:scale-105 hover:border-blue-300 transition-all duration-300 cursor-pointer">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition">
                      Manage Subjects
                    </h3>
                    <p className="text-sm text-slate-500">View all subjects</p>
                  </div>
                </Link>
              </div>
            </>
          )}

          {/* ADMIN DASHBOARD */}
          {isAdmin && (
            <>
              {/* Admin Stats Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-100 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide">
                        Total Users
                      </p>
                      <p className="text-5xl font-bold bg-gradient-to-br from-purple-600 to-purple-500 bg-clip-text text-transparent mt-3">
                        {adminStats.totalUsers}
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
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
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-100 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide">
                        Total Students
                      </p>
                      <p className="text-5xl font-bold bg-gradient-to-br from-purple-600 to-purple-500 bg-clip-text text-transparent mt-3">
                        {adminStats.totalStudents}
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
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
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-100 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide">
                        Total Teachers
                      </p>
                      <p className="text-5xl font-bold bg-gradient-to-br from-purple-600 to-purple-500 bg-clip-text text-transparent mt-3">
                        {adminStats.totalTeachers}
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
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
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Stats Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-100 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide">
                        Total Subjects
                      </p>
                      <p className="text-5xl font-bold bg-gradient-to-br from-purple-600 to-purple-500 bg-clip-text text-transparent mt-3">
                        {teacherStats.totalSubjects}
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
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
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-100 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide">
                        Total Lessons
                      </p>
                      <p className="text-5xl font-bold bg-gradient-to-br from-purple-600 to-purple-500 bg-clip-text text-transparent mt-3">
                        {teacherStats.totalLessons}
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
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
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-100 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide">
                        Total Quizzes
                      </p>
                      <p className="text-5xl font-bold bg-gradient-to-br from-purple-600 to-purple-500 bg-clip-text text-transparent mt-3">
                        {teacherStats.totalQuizzes}
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
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
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Quick Actions */}
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Admin Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link href="/users">
                  <div className="group bg-white rounded-2xl shadow-lg border-2 border-purple-100 p-6 hover:shadow-2xl hover:scale-105 hover:border-purple-300 transition-all duration-300 cursor-pointer">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-purple-600 transition">
                      Manage Users
                    </h3>
                    <p className="text-sm text-slate-500">View all users</p>
                  </div>
                </Link>

                <Link href="/signup?role=teacher">
                  <div className="group bg-white rounded-2xl shadow-lg border-2 border-purple-100 p-6 hover:shadow-2xl hover:scale-105 hover:border-purple-300 transition-all duration-300 cursor-pointer">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition">
                      Create Teacher
                    </h3>
                    <p className="text-sm text-slate-500">Add new teacher</p>
                  </div>
                </Link>

                <Link href="/signup?role=student">
                  <div className="group bg-white rounded-2xl shadow-lg border-2 border-purple-100 p-6 hover:shadow-2xl hover:scale-105 hover:border-purple-300 transition-all duration-300 cursor-pointer">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition">
                      Create Student
                    </h3>
                    <p className="text-sm text-slate-500">Add new student</p>
                  </div>
                </Link>

                <Link href="/lessons">
                  <div className="group bg-white rounded-2xl shadow-lg border-2 border-purple-100 p-6 hover:shadow-2xl hover:scale-105 hover:border-purple-300 transition-all duration-300 cursor-pointer">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-orange-600 transition">
                      Manage Lessons
                    </h3>
                    <p className="text-sm text-slate-500">
                      Create and edit lessons
                    </p>
                  </div>
                </Link>

                <Link href="/quizzes/manage">
                  <div className="group bg-white rounded-2xl shadow-lg border-2 border-purple-100 p-6 hover:shadow-2xl hover:scale-105 hover:border-purple-300 transition-all duration-300 cursor-pointer">
                    <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-pink-600 transition">
                      Manage Quizzes
                    </h3>
                    <p className="text-sm text-slate-500">
                      Create and edit quizzes
                    </p>
                  </div>
                </Link>

                <Link href="/subjects">
                  <div className="group bg-white rounded-2xl shadow-lg border-2 border-purple-100 p-6 hover:shadow-2xl hover:scale-105 hover:border-purple-300 transition-all duration-300 cursor-pointer">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition">
                      Manage Subjects
                    </h3>
                    <p className="text-sm text-slate-500">View all subjects</p>
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
