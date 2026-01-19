"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import QuizForm from "@/components/quizzes/QuizForm";
import { fetcher, swrConfig } from "@/lib/fetcher";
import { fetchWithAuth } from "@/lib/authClient";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function ManageQuizzesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    data: quizzes,
    error,
    isLoading,
  } = useSWR("/api/quizzes", fetcher, swrConfig);

  const [showForm, setShowForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);

  const isTeacherOrAdmin =
    user &&
    (user.role === "ADMIN" ||
      user.role === "TEACHER" ||
      user.role === "admin" ||
      user.role === "teacher");

  // Redirect if not teacher or admin
  if (user && !isTeacherOrAdmin) {
    router.push("/quizzes");
    return null;
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    try {
      const response = await fetchWithAuth(`/api/quizzes?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Quiz deleted successfully");
        mutate("/api/quizzes");
      } else {
        toast.error("Failed to delete quiz");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Network error");
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingQuiz(null);
    mutate("/api/quizzes");
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
          <Navbar />
          <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-orange-600 font-semibold text-lg">
                Loading quizzes...
              </p>
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
          <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="bg-white border-2 border-red-200 rounded-2xl shadow-lg p-8 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-3">
                Failed to Load Quizzes
              </h2>
              <p className="text-slate-600 mb-6">
                We encountered an error while fetching the quizzes.
              </p>
              <button
                onClick={() => mutate("/api/quizzes")}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-md"
              >
                Retry Loading
              </button>
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
          {/* Header Section */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
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
                  <h1 className="text-5xl font-black bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                    Manage Quizzes
                  </h1>
                </div>
                <p className="text-slate-600 text-lg ml-15">
                  Create, edit, and manage your quiz content
                </p>
              </div>

              <div className="flex gap-3">
                <Link href="/quizzes">
                  <button className="bg-white border-2 border-orange-200 text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 hover:border-orange-300 transition shadow-md flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    View Quizzes
                  </button>
                </Link>
                <button
                  onClick={() => {
                    setShowForm(!showForm);
                    setEditingQuiz(null);
                  }}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {showForm ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    )}
                  </svg>
                  {showForm ? "Cancel" : "Create Quiz"}
                </button>
              </div>
            </div>
          </div>

          {/* Quiz Form */}
          {showForm && (
            <div className="mb-10">
              <QuizForm initialData={editingQuiz} onSuccess={handleSuccess} />
            </div>
          )}

          {/* Quizzes List */}
          <div className="space-y-6">
            {quizzes && quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <div
                  key={quiz.id || quiz._id}
                  className="bg-white rounded-2xl shadow-lg border-2 border-orange-100 overflow-hidden hover:shadow-2xl hover:border-orange-300 transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="inline-block px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-full">
                            {quiz.subject}
                          </span>
                          <span className="text-sm text-slate-600">
                            {quiz.questions?.length || 0} Questions
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">
                          {quiz.title}
                        </h3>
                        {quiz.description && (
                          <p className="text-slate-600 text-sm">
                            {quiz.description}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setEditingQuiz(quiz);
                            setShowForm(true);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-md hover:shadow-lg flex items-center gap-2"
                        >
                          <svg
                            className="w-5 h-5"
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
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(quiz.id || quiz._id)}
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-md hover:shadow-lg flex items-center gap-2"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-16 h-16 text-orange-500"
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
                <h3 className="text-2xl font-bold text-slate-800 mb-3">
                  No quizzes yet
                </h3>
                <p className="text-slate-600 text-lg mb-8">
                  Start creating engaging quizzes for your students
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Create Your First Quiz
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
