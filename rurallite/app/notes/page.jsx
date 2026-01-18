"use client";
import React, { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/fetcher";
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    XMarkIcon,
    DocumentTextIcon,
    ClockIcon
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";

export default function NotesPage() {
    const { data: notes, error, isLoading } = useSWR("/api/notes", fetcher, {
        revalidateOnFocus: true,
        refreshInterval: 45000,
    });

    const [selectedNote, setSelectedNote] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: ""
    });
    const [isSaving, setIsSaving] = useState(false);

    // Auto-select first note when notes load
    useEffect(() => {
        if (notes && notes.length > 0 && !selectedNote) {
            setSelectedNote(notes[0]);
        }
    }, [notes]);

    const openCreateModal = () => {
        setFormData({ title: "", content: "" });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const openEditModal = (note) => {
        setFormData({ title: note.title, content: note.content });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ title: "", content: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.content.trim()) {
            toast.error("Title and content are required");
            return;
        }

        setIsSaving(true);

        try {
            const token = localStorage.getItem("authToken");
            const userId = localStorage.getItem("userId");

            if (isEditing && selectedNote) {
                // Update existing note
                const response = await fetch(`/api/notes?id=${selectedNote.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    toast.success("Note updated successfully!");
                    mutate("/api/notes");
                    setSelectedNote(data.data);
                    closeModal();
                } else {
                    toast.error(data.message || "Failed to update note");
                }
            } else {
                // Create new note
                const response = await fetch("/api/notes", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ...formData,
                        userId: userId,
                    }),
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    toast.success("Note created successfully!");
                    mutate("/api/notes");
                    setSelectedNote(data.data);
                    closeModal();
                } else {
                    toast.error(data.message || "Failed to create note");
                }
            }
        } catch (error) {
            console.error("Failed to save note:", error);
            toast.error("Network error. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (noteId) => {
        if (!confirm("Are you sure you want to delete this note?")) return;

        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`/api/notes?id=${noteId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success("Note deleted successfully!");
                mutate("/api/notes");
                if (selectedNote?.id === noteId) {
                    setSelectedNote(null);
                }
            } else {
                toast.error(data.message || "Failed to delete note");
            }
        } catch (error) {
            console.error("Failed to delete note:", error);
            toast.error("Network error. Please try again.");
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (error) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
                    <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 shadow-lg max-w-md">
                        <p className="text-red-600 font-bold text-lg">Failed to load notes</p>
                        <p className="text-red-500 text-sm mt-2">{error.message}</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
                <div className="flex h-screen">
                    {/* Sidebar */}
                    <div className="w-80 bg-white border-r-2 border-orange-100 shadow-xl flex flex-col">
                        {/* Sidebar Header */}
                        <div className="p-6 border-b-2 border-orange-100 bg-gradient-to-r from-orange-500 to-orange-600">
                            <h1 className="text-2xl font-bold text-white mb-4">My Notes</h1>
                            <button
                                onClick={openCreateModal}
                                className="w-full flex items-center justify-center gap-2 bg-white text-orange-600 px-4 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                            >
                                <PlusIcon className="h-5 w-5" />
                                Create New Note
                            </button>
                        </div>

                        {/* Notes List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {isLoading ? (
                                <div className="flex justify-center items-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-600"></div>
                                </div>
                            ) : notes && notes.length > 0 ? (
                                notes.map((note) => (
                                    <div
                                        key={note.id}
                                        onClick={() => setSelectedNote(note)}
                                        className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${selectedNote?.id === note.id
                                                ? "bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300 shadow-lg"
                                                : "bg-white border-orange-100 hover:border-orange-200 hover:shadow-md"
                                            }`}
                                    >
                                        <h3 className="font-semibold text-slate-800 text-sm line-clamp-1 mb-1">
                                            {note.title || "Untitled Note"}
                                        </h3>
                                        <p className="text-xs text-slate-500 line-clamp-2 mb-2">
                                            {note.content}
                                        </p>
                                        <div className="flex items-center gap-1 text-xs text-orange-600">
                                            <ClockIcon className="h-3 w-3" />
                                            <span>{formatDate(note.updatedAt || note.createdAt)}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <DocumentTextIcon className="h-16 w-16 text-orange-300 mx-auto mb-4" />
                                    <p className="text-slate-500 font-medium mb-2">No notes yet</p>
                                    <p className="text-slate-400 text-sm">Create your first note to get started!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col">
                        {selectedNote ? (
                            <>
                                {/* Note Header */}
                                <div className="bg-white border-b-2 border-orange-100 p-6 shadow-md">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h1 className="text-3xl font-bold text-slate-800 mb-2">
                                                {selectedNote.title || "Untitled Note"}
                                            </h1>
                                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                                <div className="flex items-center gap-1">
                                                    <ClockIcon className="h-4 w-4" />
                                                    <span>Updated {formatDate(selectedNote.updatedAt || selectedNote.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEditModal(selectedNote)}
                                                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-all duration-200 shadow-md hover:shadow-lg"
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(selectedNote.id)}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Note Content */}
                                <div className="flex-1 overflow-y-auto p-8">
                                    <div className="max-w-4xl mx-auto">
                                        <div className="bg-white rounded-2xl shadow-lg border-2 border-orange-100 p-8">
                                            <div className="prose prose-slate max-w-none">
                                                <div className="text-slate-700 text-base leading-relaxed whitespace-pre-wrap">
                                                    {selectedNote.content}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <DocumentTextIcon className="h-24 w-24 text-orange-300 mx-auto mb-6" />
                                    <h2 className="text-2xl font-bold text-slate-700 mb-2">No note selected</h2>
                                    <p className="text-slate-500 mb-6">Select a note from the sidebar or create a new one</p>
                                    <button
                                        onClick={openCreateModal}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        <PlusIcon className="h-5 w-5" />
                                        Create Your First Note
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Create/Edit Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 p-6 flex items-center justify-between border-b-2 border-orange-700">
                                <h2 className="text-2xl font-bold text-white">
                                    {isEditing ? "Edit Note" : "Create New Note"}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="text-white hover:bg-white hover:text-orange-600 rounded-lg p-2 transition-all duration-200"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Note Title
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Enter note title..."
                                        className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Note Content
                                    </label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        placeholder="Write your note content here..."
                                        rows={12}
                                        className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-200 resize-none"
                                        required
                                    />
                                </div>

                                {/* Modal Footer */}
                                <div className="flex gap-3 pt-4 border-t-2 border-orange-100">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-6 py-3 border-2 border-orange-300 text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-200"
                                        disabled={isSaving}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSaving ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                {isEditing ? "Updating..." : "Creating..."}
                                            </span>
                                        ) : (
                                            <span>{isEditing ? "Update Note" : "Create Note"}</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}