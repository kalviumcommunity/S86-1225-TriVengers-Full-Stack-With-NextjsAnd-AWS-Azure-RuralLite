"use client";

import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/fetcher";

export default function NotesPage() {
  const { data: notes, error, isLoading } = useSWR("/api/notes", fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 45000, // Refresh every 45 seconds
  });

  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    setIsCreating(true);

    // Optimistic update
    const tempNote = {
      id: Date.now(),
      title: newNoteTitle,
      content: newNoteContent,
      createdAt: new Date().toISOString(),
    };

    mutate("/api/notes", [...(notes || []), tempNote], false);

    try {
      await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          title: newNoteTitle,
          content: newNoteContent,
        }),
      });

      mutate("/api/notes");
      setNewNoteTitle("");
      setNewNoteContent("");
    } catch (error) {
      console.error("Failed to create note:", error);
      mutate("/api/notes");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    // Optimistic update - remove note from UI
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    mutate("/api/notes", updatedNotes, false);

    try {
      await fetch(`/api/notes?id=${noteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      mutate("/api/notes");
    } catch (error) {
      console.error("Failed to delete note:", error);
      // Revert on error
      mutate("/api/notes");
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-semibold">Failed to load notes</p>
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
            <p className="mt-4 text-gray-600">Loading notes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Notes</h1>

      {/* Create Note Form */}
      <form
        onSubmit={handleCreateNote}
        className="bg-white border rounded-lg p-4 mb-6"
      >
        <h2 className="text-lg font-semibold mb-3">Create New Note</h2>
        <div className="space-y-3">
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            placeholder="Note title"
            disabled={isCreating}
          />
          <textarea
            className="w-full border px-3 py-2 rounded h-32"
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Note content"
            disabled={isCreating}
          />
          <button
            type="submit"
            disabled={isCreating}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {isCreating ? "Creating..." : "Create Note"}
          </button>
        </div>
      </form>

      {/* Notes List */}
      <div className="space-y-4">
        {notes && notes.length > 0 ? (
          notes.map((note) => (
            <div key={note.id} className="bg-white border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">{note.title}</h3>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
              <p className="text-gray-600 mb-2 whitespace-pre-wrap">
                {note.content}
              </p>
              <p className="text-sm text-gray-400">
                {new Date(note.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">No notes found</div>
        )}
      </div>
    </div>
  );
}
