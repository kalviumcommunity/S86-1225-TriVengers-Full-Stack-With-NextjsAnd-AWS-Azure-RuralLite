"use client";

import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/fetcher";

export default function LessonsPage() {
  const { data: lessons, error, isLoading } = useSWR("/api/lessons", fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 60000, // Refresh every 60 seconds
  });

  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonContent, setNewLessonContent] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    if (!newLessonTitle.trim() || !newLessonContent.trim()) return;

    setIsCreating(true);

    // Optimistic update
    const tempLesson = {
      id: Date.now(),
      title: newLessonTitle,
      content: newLessonContent,
      createdAt: new Date().toISOString(),
    };

    mutate("/api/lessons", [...(lessons || []), tempLesson], false);

    try {
      await fetch("/api/lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          title: newLessonTitle,
          content: newLessonContent,
        }),
      });

      mutate("/api/lessons");
      setNewLessonTitle("");
      setNewLessonContent("");
    } catch (error) {
      console.error("Failed to create lesson:", error);
      mutate("/api/lessons");
    } finally {
      setIsCreating(false);
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-semibold">Failed to load lessons</p>
          <p className="text-red-500 text-sm mt-1">{error.message}</p>
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
            <p className="mt-4 text-gray-600">Loading lessons...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Lessons</h1>

      {/* Create Lesson Form */}
      <form
        onSubmit={handleCreateLesson}
        className="bg-white border rounded-lg p-4 mb-6"
      >
        <h2 className="text-lg font-semibold mb-3">Create New Lesson</h2>
        <div className="space-y-3">
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={newLessonTitle}
            onChange={(e) => setNewLessonTitle(e.target.value)}
            placeholder="Lesson title"
            disabled={isCreating}
          />
          <textarea
            className="w-full border px-3 py-2 rounded h-24"
            value={newLessonContent}
            onChange={(e) => setNewLessonContent(e.target.value)}
            placeholder="Lesson content"
            disabled={isCreating}
          />
          <button
            type="submit"
            disabled={isCreating}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {isCreating ? "Creating..." : "Create Lesson"}
          </button>
        </div>
      </form>

      {/* Lessons List */}
      <div className="space-y-4">
        {lessons && lessons.length > 0 ? (
          lessons.map((lesson) => (
            <div key={lesson.id} className="bg-white border rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-2">{lesson.title}</h3>
              <p className="text-gray-600 mb-2">{lesson.content}</p>
              <p className="text-sm text-gray-400">
                {new Date(lesson.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">No lessons found</div>
        )}
      </div>
    </div>
  );
}
