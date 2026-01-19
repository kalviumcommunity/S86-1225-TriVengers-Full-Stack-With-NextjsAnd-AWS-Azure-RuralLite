"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { fetchWithAuth } from "@/lib/authClient";

export default function QuizForm({ onSuccess, initialData = null }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    subject: initialData?.subject || "",
    description: initialData?.description || "",
    questions: initialData?.questions || [
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
      },
    ],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      questions: newQuestions,
    }));
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setFormData((prev) => ({
      ...prev,
      questions: newQuestions,
    }));
  };

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
        },
      ],
    }));
  };

  const removeQuestion = (index) => {
    if (formData.questions.length <= 1) {
      toast.error("Quiz must have at least one question");
      return;
    }
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      questions: newQuestions,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate questions
      for (let i = 0; i < formData.questions.length; i++) {
        const q = formData.questions[i];
        if (!q.question.trim()) {
          toast.error(`Question ${i + 1} is empty`);
          setIsSubmitting(false);
          return;
        }
        const filledOptions = q.options.filter((opt) => opt.trim());
        if (filledOptions.length < 2) {
          toast.error(`Question ${i + 1} must have at least 2 options`);
          setIsSubmitting(false);
          return;
        }
      }

      const url = initialData
        ? `/api/quizzes?id=${initialData.id || initialData._id}`
        : "/api/quizzes";
      const method = initialData ? "PUT" : "POST";

      const response = await fetchWithAuth(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Please log in to manage quizzes");
        } else if (response.status === 403) {
          toast.error("You don't have permission to manage quizzes");
        } else {
          toast.error(data.message || "Unable to save quiz. Please try again.");
        }
        setIsSubmitting(false);
        return;
      }

      if (data.success) {
        toast.success(initialData ? "Quiz updated!" : "Quiz created!");
        if (onSuccess) onSuccess(data.data);
        if (!initialData) {
          setFormData({
            title: "",
            subject: "",
            description: "",
            questions: [
              {
                question: "",
                options: ["", "", "", ""],
                correctAnswer: 0,
              },
            ],
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
      className="bg-white border-2 border-orange-100 rounded-2xl p-8 shadow-xl space-y-6"
    >
      <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-6">
        {initialData ? "Edit Quiz" : "Create New Quiz"}
      </h2>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 bg-white text-slate-900 transition"
            placeholder="Quiz title"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Subject *
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 bg-white text-slate-900 transition"
            placeholder="Mathematics, Science, etc."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 bg-white text-slate-900 transition"
          placeholder="Brief description of the quiz..."
        />
      </div>

      {/* Questions */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800">Questions</h3>
          <button
            type="button"
            onClick={addQuestion}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-xl font-semibold transition shadow-md hover:shadow-lg flex items-center gap-2"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Question
          </button>
        </div>

        {formData.questions.map((question, qIndex) => (
          <div
            key={qIndex}
            className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-slate-800">
                Question {qIndex + 1}
              </h4>
              {formData.questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="text-red-600 hover:text-red-700 font-semibold transition"
                >
                  Remove
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Question Text *
              </label>
              <input
                type="text"
                value={question.question}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "question", e.target.value)
                }
                required
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 bg-white text-slate-900 transition"
                placeholder="Enter your question"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                Options (at least 2 required) *
              </label>
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={question.correctAnswer === oIndex}
                    onChange={() =>
                      handleQuestionChange(qIndex, "correctAnswer", oIndex)
                    }
                    className="w-5 h-5 text-orange-600 focus:ring-orange-500"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(qIndex, oIndex, e.target.value)
                    }
                    className="flex-1 px-4 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 bg-white text-slate-900 transition"
                    placeholder={`Option ${oIndex + 1}`}
                  />
                </div>
              ))}
              <p className="text-xs text-slate-600 mt-2">
                Select the radio button to mark the correct answer
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-6 border-t-2 border-orange-100">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-xl transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? "Saving..."
            : initialData
              ? "Update Quiz"
              : "Create Quiz"}
        </button>
      </div>
    </form>
  );
}
