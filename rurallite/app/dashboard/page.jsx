"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import useSWR from "swr";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/hooks/useAuth";

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  const json = await res.json();
  return json.data;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  // Fetch real analytics data
  const { data: quizHistory } = useSWR("/api/quiz-history", fetcher);
  const { data: progress } = useSWR("/api/progress", fetcher);
  const { data: quizzes } = useSWR("/api/quizzes", fetcher);

  // Calculate lessons completed based on quiz history (70%+ pass rate)
  const calculateLessonsCompleted = () => {
    if (!quizHistory || !quizzes) return 0;

    // Get unique subjects from quiz history where user passed (70%+)
    const passedSubjects = new Set();
    quizHistory.forEach(attempt => {
      if (attempt.percentage >= 70) {
        passedSubjects.add(attempt.subject);
      }
    });

    return passedSubjects.size;
  };

  // Calculate real statistics
  const stats = {
    lessonsCompleted: calculateLessonsCompleted(),
    quizzesTaken: quizHistory?.length || 0,
    averageScore: quizHistory?.length > 0
      ? Math.round(quizHistory.reduce((sum, quiz) => sum + quiz.percentage, 0) / quizHistory.length)
      : 0
  };

  const handleDelete = async () => {
    setOpen(false);
    const toastId = toast.loading("Deleting...");
    try {
      await new Promise((res) => setTimeout(res, 1000));
      toast.success("Item deleted successfully", { id: toastId });
    } catch (error) {
      toast.error("Delete failed", { id: toastId });
    }
  };
  return (
    <AuthGuard>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header with gradient banner */}
          <div className="mb-10 relative">
            {" "}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl opacity-10"></div>{" "}
            <div className="relative p-8">
              {" "}
              <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-2">
                {" "}
                Welcome back, {user?.name || "Student"}! 👋{" "}
              </h1>{" "}
              <p className="text-slate-600 text-lg">
                {" "}
                Ready to continue your learning journey{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          {/* Quick Stats */}{" "}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {" "}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-orange-100 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              {" "}
              <div className="flex items-center justify-between">
                {" "}
                <div>
                  {" "}
                  <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide">
                    Lessons Completed
                  </p>{" "}
                  <p className="text-5xl font-bold bg-gradient-to-br from-orange-600 to-orange-500 bg-clip-text text-transparent mt-3">
                    {stats.lessonsCompleted}
                  </p>{" "}
                </div>{" "}
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  {" "}
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />{" "}
                  </svg>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-orange-100 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              {" "}
              <div className="flex items-center justify-between">
                {" "}
                <div>
                  {" "}
                  <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide">
                    Quizzes Taken
                  </p>{" "}
                  <p className="text-5xl font-bold bg-gradient-to-br from-orange-600 to-orange-500 bg-clip-text text-transparent mt-3">
                    {stats.quizzesTaken}
                  </p>{" "}
                </div>{" "}
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  {" "}
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />{" "}
                  </svg>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-orange-100 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              {" "}
              <div className="flex items-center justify-between">
                {" "}
                <div>
                  {" "}
                  <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide">
                    Average Score
                  </p>{" "}
                  <p className="text-5xl font-bold bg-gradient-to-br from-orange-600 to-orange-500 bg-clip-text text-transparent mt-3">
                    {stats.averageScore}%
                  </p>{" "}
                </div>{" "}
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  {" "}
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />{" "}
                  </svg>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          {/* Quick Actions */}{" "}
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Quick Actions
          </h2>{" "}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {" "}
            <Link href="/subjects">
              {" "}
              <div className="group bg-white rounded-2xl shadow-lg border-2 border-orange-100 p-6 hover:shadow-2xl hover:scale-105 hover:border-orange-300 transition-all duration-300 cursor-pointer">
                {" "}
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  {" "}
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />{" "}
                  </svg>{" "}
                </div>{" "}
                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-orange-600 transition">
                  Browse Subjects
                </h3>{" "}
                <p className="text-sm text-slate-500">
                  Explore lessons by subject
                </p>{" "}
              </div>{" "}
            </Link>{" "}
            <Link href="/quizzes">
              {" "}
              <div className="group bg-white rounded-2xl shadow-lg border-2 border-orange-100 p-6 hover:shadow-2xl hover:scale-105 hover:border-orange-300 transition-all duration-300 cursor-pointer">
                {" "}
                <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  {" "}
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />{" "}
                  </svg>{" "}
                </div>{" "}
                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-orange-600 transition">
                  Take Quizzes
                </h3>{" "}
                <p className="text-sm text-slate-500">
                  Test your knowledge
                </p>{" "}
              </div>{" "}
            </Link>{" "}
            <Link href="/notes">
              {" "}
              <div className="group bg-white rounded-2xl shadow-lg border-2 border-orange-100 p-6 hover:shadow-2xl hover:scale-105 hover:border-orange-300 transition-all duration-300 cursor-pointer">
                {" "}
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  {" "}
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />{" "}
                  </svg>{" "}
                </div>{" "}
                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-orange-600 transition">
                  My Notes
                </h3>{" "}
                <p className="text-sm text-slate-500">Review your notes</p>{" "}
              </div>{" "}
            </Link>{" "}
            <Link href="/profile">
              {" "}
              <div className="group bg-white rounded-2xl shadow-lg border-2 border-orange-100 p-6 hover:shadow-2xl hover:scale-105 hover:border-orange-300 transition-all duration-300 cursor-pointer">
                {" "}
                <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  {" "}
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />{" "}
                  </svg>{" "}
                </div>{" "}
                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-orange-600 transition">
                  My Profile
                </h3>{" "}
                <p className="text-sm text-slate-500">
                  Manage your account
                </p>{" "}
              </div>{" "}
            </Link>{" "}
          </div>{" "}
          <ConfirmModal
            open={open}
            title="Delete Item?"
            description="Are you sure you want to delete this item? This action cannot be undone."
            onConfirm={handleDelete}
            onClose={() => setOpen(false)}
          />
        </div>
      </div>
    </AuthGuard>
  );
}
