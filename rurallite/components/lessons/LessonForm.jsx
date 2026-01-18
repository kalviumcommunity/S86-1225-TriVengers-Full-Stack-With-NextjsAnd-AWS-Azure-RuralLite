"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
export default function LessonForm({ onSuccess, initialData = null }) {
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        subject: initialData?.subject || "",
        content: initialData?.content || "",
        grade: initialData?.grade || 1,
        difficulty: initialData?.difficulty || "BEGINNER",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "grade" ? parseInt(value) : value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const url = initialData
                ? `/api/lessons/${initialData.id}`
                : "/api/lessons";
            const method = initialData ? "PUT" : "POST";
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok && data.success) {
                toast.success(initialData ? "Lesson updated!" : "Lesson created!");
                if (onSuccess) onSuccess(data.data);
                if (!initialData) {
                    setFormData({
                        title: "",
                        subject: "",
                        content: "",
                        grade: 1,
                        difficulty: "BEGINNER",
                    });
                }
            } else {
                toast.error(data.message || "Operation failed");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Network error");
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200 rounded-lg p-6 shadow-lg space-y-4"
        >
            {" "}
            <h2 className="text-xl font-semibold text-brown-500 mb-4">
                {" "}
                {initialData ? "Edit Lesson" : "Create New Lesson"}{" "}
            </h2>{" "}
            <div>
                {" "}
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    {" "}
                    Title *{" "}
                </label>{" "}
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-400 bg-white text-slate-900"
                    placeholder="Lesson title"
                />{" "}
            </div>{" "}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {" "}
                <div>
                    {" "}
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        {" "}
                        Subject *{" "}
                    </label>{" "}
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-400 bg-white text-slate-900"
                        placeholder="Math, Science, etc."
                    />{" "}
                </div>{" "}
                <div>
                    {" "}
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        {" "}
                        Grade{" "}
                    </label>{" "}
                    <select
                        name="grade"
                        value={formData.grade}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-400 bg-white text-slate-900"
                    >
                        {" "}
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                            <option key={g} value={g}>
                                Grade {g}
                            </option>
                        ))}{" "}
                    </select>{" "}
                </div>{" "}
                <div>
                    {" "}
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        {" "}
                        Difficulty{" "}
                    </label>{" "}
                    <select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-400 bg-white text-slate-900"
                    >
                        {" "}
                        <option value="BEGINNER">Beginner</option>{" "}
                        <option value="INTERMEDIATE">Intermediate</option>{" "}
                        <option value="ADVANCED">Advanced</option>{" "}
                    </select>{" "}
                </div>{" "}
            </div>{" "}
            <div>
                {" "}
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    {" "}
                    Content *{" "}
                </label>{" "}
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-400 bg-white text-slate-900"
                    placeholder="Lesson content..."
                />{" "}
            </div>{" "}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brown-500 hover:bg-brown-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {" "}
                {isSubmitting
                    ? "Saving..."
                    : initialData
                        ? "Update Lesson"
                        : "Create Lesson"}{" "}
            </button>{" "}
        </form>
    );
}
