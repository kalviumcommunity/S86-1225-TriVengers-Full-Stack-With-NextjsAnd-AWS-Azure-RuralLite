"use client";
import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/fetcher";
import LessonForm from "@/components/lessons/LessonForm";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/hooks/useAuth";

export default function LessonsPage() {
  const { user } = useAuth();
  const {
    data: lessons,
    error,
    isLoading,
  } = useSWR("/api/lessons", fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 60000,
  });
  const { data: progressData } = useSWR("/api/progress", fetcher);
  const [showForm, setShowForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);

  const isTeacherOrAdmin = user && (
    user.role === "ADMIN" ||
    user.role === "TEACHER" ||
    user.role === "admin" ||
    user.role === "teacher"
  );

  const isLessonCompleted = (lessonId) => {
    if (!progressData) return false;
    const progress = progressData.find(p => p.lessonId === lessonId);
    return progress?.completed || false;
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;
    try {
      const response = await fetch(`/api/lessons?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (response.ok) {
        toast.success("Lesson deleted successfully");
        mutate("/api/lessons");
      } else {
        toast.error("Failed to delete lesson");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Network error");
    }
  };
  const handleSuccess = () => {
    setShowForm(false);
    setEditingLesson(null);
    mutate("/api/lessons");
  };
  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-white border-2 border-red-200 rounded-2xl shadow-lg p-8 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-3">Failed to Load Lessons</h2>
              <p className="text-slate-600 mb-6">
                We encountered an error while fetching the lessons.
              </p>
              <button
                onClick={() => mutate("/api/lessons")}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-md"
              >
                Retry Loading
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        {" "}
        <div className="flex items-center justify-center py-12">
          {" "}
          <div className="text-center">
            {" "}
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>{" "}
            <p className="mt-6 text-slate-600 font-semibold text-lg">
              Loading lessons...
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </div>
    );
  }
  return (
    <AuthGuard>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                {" "}
                <div className="flex items-center gap-3 mb-3">
                  {" "}
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
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
                  <h1 className="text-5xl font-black bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                    {" "}
                    Lessons{" "}
                  </h1>{" "}
                </div>{" "}
                <p className="text-slate-600 text-lg ml-15">
                  Explore and manage your learning content
                </p>{" "}
              </div>{" "}
              {isTeacherOrAdmin && (
                <button
                  onClick={() => {
                    setShowForm(!showForm);
                    setEditingLesson(null);
                  }}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2"
                >
                  {" "}
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {" "}
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
                    )}{" "}
                  </svg>{" "}
                  {showForm ? "Cancel" : "Create Lesson"}{" "}
                </button>
              )}{" "}
            </div>{" "}
          </div>{" "}
          {showForm && isTeacherOrAdmin && (
            <div className="mb-10 bg-white rounded-2xl shadow-xl border-2 border-orange-100 p-8">
              {" "}
              <LessonForm
                initialData={editingLesson}
                onSuccess={handleSuccess}
              />{" "}
            </div>
          )}{" "}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {" "}
            {lessons?.map((lesson) => (
              <div
                key={lesson.id}
                className="group bg-white rounded-2xl shadow-lg border-2 border-orange-100 overflow-hidden hover:shadow-2xl hover:scale-[1.02] hover:border-orange-300 transition-all duration-300 relative"
              >
                {" "}
                {/* Completion Badge */}
                {isLessonCompleted(lesson.id) && (
                  <div className="absolute top-2 right-2 z-10 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    ✓ Done
                  </div>
                )}
                {/* Card Header */}{" "}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4">
                  {" "}
                  <span className="inline-block px-3 py-1 bg-white/90 text-orange-700 text-xs font-bold rounded-full">
                    {" "}
                    {lesson.subject}{" "}
                  </span>{" "}
                </div>{" "}
                {/* Card Body */}{" "}
                <div className="p-6">
                  {" "}
                  <h3 className="text-2xl font-bold text-slate-800 mb-4 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {" "}
                    {lesson.title}{" "}
                  </h3>{" "}
                  {/* Metadata */}{" "}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    {" "}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 rounded-lg">
                      {" "}
                      <svg
                        className="w-4 h-4 text-orange-600"
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
                      <span className="text-sm font-semibold text-slate-700">
                        Grade {lesson.grade}
                      </span>{" "}
                    </div>{" "}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 rounded-lg">
                      {" "}
                      <svg
                        className="w-4 h-4 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {" "}
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />{" "}
                      </svg>{" "}
                      <span className="text-sm font-semibold text-slate-700">
                        {lesson.difficulty}
                      </span>{" "}
                    </div>{" "}
                  </div>{" "}
                  {/* Content Preview */}{" "}
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                    {" "}
                    {lesson.content}{" "}
                  </p>{" "}
                  {/* Action Buttons */}{" "}
                  <div className="flex gap-3 pt-4 border-t-2 border-orange-50">
                    {" "}
                    {isTeacherOrAdmin ? (
                      <>
                        {" "}
                        <button
                          onClick={() => {
                            setEditingLesson(lesson);
                            setShowForm(true);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-3 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                          {" "}
                          <svg
                            className="w-4 h-4"
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
                          Edit{" "}
                        </button>{" "}
                        <button
                          onClick={() => handleDelete(lesson.id)}
                          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                          {" "}
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            {" "}
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />{" "}
                          </svg>{" "}
                          Delete{" "}
                        </button>{" "}
                      </>
                    ) : (
                      <Link href={`/lessons/${lesson.id}`} className="w-full">
                        {" "}
                        <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-3 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                          {" "}
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            {" "}
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />{" "}
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />{" "}
                          </svg>{" "}
                          View Lesson{" "}
                        </button>{" "}
                      </Link>
                    )}{" "}
                  </div>{" "}
                </div>{" "}
              </div>
            ))}{" "}
          </div>{" "}
          {lessons && lessons.length === 0 && (
            <div className="text-center py-20">
              {" "}
              <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
                {" "}
                <svg
                  className="w-16 h-16 text-orange-500"
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
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                No lessons yet
              </h3>{" "}
              <p className="text-slate-600 text-lg mb-8">
                {" "}
                {isTeacherOrAdmin
                  ? "Start creating engaging content for your students"
                  : "No lessons available at the moment. Check back soon!"}{" "}
              </p>{" "}
              {isTeacherOrAdmin && (
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  {" "}
                  Create Your First Lesson
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
