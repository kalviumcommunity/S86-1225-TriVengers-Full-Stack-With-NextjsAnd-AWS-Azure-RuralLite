"use client";

import { useState, useEffect, use, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import useSWR from "swr";
import Navbar from "@/components/Navbar";
import Chatbot from "@/components/Chatbot";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { clientDevLog, clientDevError } from "@/lib/utils/devLogger";

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  const json = await res.json();
  return json.data;
};

export default function LessonDetailPage({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [markingComplete, setMarkingComplete] = useState(false);

  // Fetch quiz history to check completion
  const { data: quizHistory } = useSWR("/api/quiz-history", fetcher);
  const { data: quizzes } = useSWR("/api/quizzes", fetcher);

  // Text-to-Speech states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [synthesis, setSynthesis] = useState(null);
  const [utterance, setUtterance] = useState(null);

  // Get quiz completion status for this lesson's subject
  const getQuizCompletionForLesson = () => {
    if (!lesson || !quizHistory || !quizzes) return null;

    // Find quiz for this lesson's subject
    const subjectQuiz = quizzes.find(q => q.subject === lesson.subject);
    if (!subjectQuiz) return null;

    // Find latest attempt for this quiz
    const attempts = quizHistory.filter(h => h.quizId === (subjectQuiz._id || subjectQuiz.id));
    if (attempts.length === 0) return null;

    const latestAttempt = attempts.sort((a, b) =>
      new Date(b.completedAt) - new Date(a.completedAt)
    )[0];

    return {
      completed: latestAttempt.percentage >= 70,
      score: latestAttempt.score,
      totalQuestions: latestAttempt.totalQuestions,
      percentage: latestAttempt.percentage
    };
  };

  const quizCompletion = getQuizCompletionForLesson();

  // Initialize Speech Synthesis
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSynthesis(window.speechSynthesis);
    }

    // Cleanup: stop speech when component unmounts
    return () => {
      if (synthesis) {
        synthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    clientDevLog("📚 [Lesson] Fetching lesson:", unwrappedParams.id);
    fetchLesson();
    fetchProgress();

    // Stop speech when switching lessons
    if (synthesis) {
      synthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, [unwrappedParams.id]);

  const fetchProgress = async () => {
    try {
      const response = await fetch("/api/progress");
      const data = await response.json();
      if (response.ok && data.success) {
        const lessonProgress = data.data.find(p => p.lessonId === unwrappedParams.id);
        if (lessonProgress?.completed) {
          setIsCompleted(true);
        }
      }
    } catch (error) {
      clientDevError("Error fetching progress:", error);
    }
  };

  const markAsComplete = async () => {
    if (markingComplete || isCompleted) return;

    setMarkingComplete(true);
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: unwrappedParams.id,
          completed: true,
          progress: 100
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setIsCompleted(true);
        alert("🎉 Lesson marked as complete!");
      }
    } catch (error) {
      clientDevError("Error marking complete:", error);
      alert("Failed to mark lesson as complete");
    } finally {
      setMarkingComplete(false);
    }
  };

  // Text-to-Speech functions
  const cleanTextForSpeech = (markdownText) => {
    if (!markdownText) return "";
    // Remove markdown syntax for cleaner speech
    let cleaned = markdownText
      .replace(/#{1,6}\s/g, "") // Remove heading markers
      .replace(/\*\*(.+?)\*\*/g, "$1") // Remove bold
      .replace(/\*(.+?)\*/g, "$1") // Remove italic
      .replace(/\[(.+?)\]\(.+?\)/g, "$1") // Remove links, keep text
      .replace(/```[\s\S]*?```/g, "") // Remove code blocks
      .replace(/`(.+?)`/g, "$1") // Remove inline code
      .replace(/[_~>|]/g, "") // Remove other markdown symbols
      .replace(/\n{3,}/g, "\n\n") // Reduce multiple line breaks
      .trim();

    // Limit length to avoid browser issues (max 32KB for some browsers)
    if (cleaned.length > 15000) {
      cleaned = cleaned.substring(0, 15000) + "... Content truncated for audio playback.";
    }

    return cleaned;
  };

  const startSpeaking = () => {
    if (!synthesis || !lesson?.content) {
      alert("Text-to-speech is not available in your browser");
      return;
    }

    if (isPaused) {
      synthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    // Stop any ongoing speech
    synthesis.cancel();

    try {
      const text = cleanTextForSpeech(lesson.content);

      if (!text || text.length === 0) {
        alert("No content available to read");
        return;
      }

      const newUtterance = new SpeechSynthesisUtterance(text);
      newUtterance.rate = speechRate;
      newUtterance.pitch = 1;
      newUtterance.volume = 1;
      newUtterance.lang = 'en-US';

      newUtterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      newUtterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };

      newUtterance.onerror = (event) => {
        clientDevError("Speech synthesis error:", event.error || event);
        setIsSpeaking(false);
        setIsPaused(false);

        // Show user-friendly error message
        if (event.error === 'interrupted') {
          // Don't show error for interruptions (normal behavior)
          return;
        }
        alert(`Audio playback error: ${event.error || 'Unknown error'}. Please try again.`);
      };

      setUtterance(newUtterance);
      synthesis.speak(newUtterance);
    } catch (error) {
      clientDevError("Error starting speech:", error);
      setIsSpeaking(false);
      setIsPaused(false);
      alert("Failed to start audio playback. Please try again.");
    }
  };

  const pauseSpeaking = () => {
    if (synthesis && isSpeaking) {
      synthesis.pause();
      setIsPaused(true);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (synthesis) {
      synthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  const changeSpeed = (newRate) => {
    setSpeechRate(newRate);
    if (isSpeaking || isPaused) {
      stopSpeaking();
      // Restart with new rate
      setTimeout(() => startSpeaking(), 100);
    }
  };

  // Track when lesson content is loaded
  useEffect(() => {
    if (lesson?.content) {
      clientDevLog(
        "🎉 [Lesson] Content loaded and ready for markdown rendering"
      );
      clientDevLog("📄 [Content] Length:", lesson.content.length, "chars");
      clientDevLog("📄 [Content] Preview:", lesson.content.substring(0, 150));
      clientDevLog(
        "🖊️ [Content] Has markdown headings:",
        /^#{1,3}\s/.test(lesson.content) ? "YES" : "NO"
      );
    }
  }, [lesson]);

  // Extract headings from markdown for table of contents
  const tableOfContents = useMemo(() => {
    if (!lesson?.content) return [];
    const headings = [];
    const lines = lesson.content.split("\n");
    lines.forEach((line, index) => {
      const match = line.match(/^(#{1,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2];
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        headings.push({ level, text, id });
      }
    });
    return headings;
  }, [lesson?.content]);

  // Scroll spy for active section
  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll("h1[id], h2[id], h3[id]");
      let currentSection = "";
      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 150) {
          currentSection = heading.id;
        }
      });
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const fetchLesson = async () => {
    try {
      const response = await fetch(`/api/lessons?id=${unwrappedParams.id}`);
      const data = await response.json();

      if (response.ok && data.success) {
        clientDevLog("✅ [Lesson] Loaded successfully:", data.data.title);
        clientDevLog(
          "📄 [Lesson] Content length:",
          data.data.content?.length,
          "chars"
        );
        clientDevLog("📄 [Lesson] Content type:", typeof data.data.content);
        setLesson(data.data);
      } else {
        clientDevError("❌ [Lesson] Failed to load:", data.message);
        setError(data.message || "Failed to load lesson");
      }
    } catch (err) {
      clientDevError("❌ [Lesson] Network error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-beige-50 via-sky-50 to-teal-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto mb-4"></div>
            <p className="text-slate-700 font-medium">Loading lesson...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !lesson) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-beige-50 via-sky-50 to-teal-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-orange-900 mb-2">
              Lesson Not Found
            </h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <Link href={`/subjects/${lesson.subject}`}>
              <button className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-600 transition-all">
                Back to {lesson.subject}
              </button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-beige-50 via-sky-50 to-teal-50">
        {/* Header */}
        <div className="bg-white border-b border-orange-200 sticky top-0 z-20 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href={`/subjects/${lesson.subject}`}>
              <button className="flex items-center gap-2 text-orange-700 hover:text-orange-800 font-semibold transition">
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
                <span>Back to {lesson.subject}</span>
              </button>
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition"
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-semibold">
                {lesson.subject}
              </span>
              <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold">
                Class {lesson.grade}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Table of Contents - FIXED POSITION */}
            <aside
              className={`${sidebarOpen ? "block" : "hidden"} lg:block lg:w-72 xl:w-80 flex-shrink-0`}
            >
              <div className="lg:sticky lg:top-24 bg-white rounded-2xl shadow-lg border-2 border-orange-100 p-6 max-h-[calc(100vh-8rem)] overflow-hidden flex flex-col overflow-x-hidden">
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                  <h2 className="text-xl font-bold text-orange-900 flex items-center gap-2">
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Lesson Outline
                  </h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden text-slate-500 hover:text-slate-700"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <nav
                  className="space-y-1 overflow-y-auto overflow-x-hidden flex-1 pr-2 
                                    scrollbar-thin scrollbar-thumb-gray-400/15 scrollbar-track-transparent 
                                    
                                    [&::-webkit-scrollbar]:w-1.5
                                    [&::-webkit-scrollbar-track]:bg-transparent
                                    [&::-webkit-scrollbar-thumb]:bg-gray-400/15
                                    [&::-webkit-scrollbar-thumb]:rounded-full
                                    [&::-webkit-scrollbar-thumb]:hover:bg-gray-400/25"
                >
                  {tableOfContents.map((heading, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToSection(heading.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${heading.level === 1
                        ? "font-bold"
                        : heading.level === 2
                          ? "font-semibold ml-3"
                          : "ml-6"
                        } ${activeSection === heading.id
                          ? "bg-orange-100 text-orange-700"
                          : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                        }`}
                    >
                      {heading.text}
                    </button>
                  ))}
                </nav>

                {/* Reading Progress */}
                <div className="mt-4 pt-4 border-t border-orange-100 flex-shrink-0">
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-medium">30 min read</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <span className="font-medium">{lesson.difficulty}</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0">
              {/* Text-to-Speech Controls */}
              {synthesis && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-lg border-2 border-blue-200 p-4 sm:p-6 mb-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-lg">🔊 Listen to Lesson</h4>
                        <p className="text-sm text-slate-600">Audio narration of lesson content</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap justify-center">
                      {/* Play/Pause/Resume Button */}
                      {!isSpeaking && !isPaused && (
                        <button
                          onClick={startSpeaking}
                          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Play
                        </button>
                      )}

                      {isSpeaking && (
                        <button
                          onClick={pauseSpeaking}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 animate-pulse"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Pause
                        </button>
                      )}

                      {isPaused && (
                        <button
                          onClick={startSpeaking}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          </svg>
                          Resume
                        </button>
                      )}

                      {(isSpeaking || isPaused) && (
                        <button
                          onClick={stopSpeaking}
                          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                          </svg>
                          Stop
                        </button>
                      )}

                      {/* Speed Control */}
                      <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow">
                        <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <select
                          value={speechRate}
                          onChange={(e) => changeSpeed(parseFloat(e.target.value))}
                          className="text-sm font-semibold text-slate-700 bg-transparent border-none outline-none cursor-pointer"
                        >
                          <option value="0.5">0.5x</option>
                          <option value="0.75">0.75x</option>
                          <option value="1">1x</option>
                          <option value="1.25">1.25x</option>
                          <option value="1.5">1.5x</option>
                          <option value="2">2x</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Lesson Content with Proper Markdown */}
              <div className="bg-white rounded-2xl shadow-lg border-2 border-orange-100 p-6 sm:p-8 mb-6">
                <MarkdownRenderer content={lesson.content} showLogs={true} />
              </div>

              {/* Quiz Button */}
              <div className="bg-white rounded-2xl shadow-lg border-2 border-orange-200 p-6 sm:p-8 mb-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                      {quizCompletion?.completed ? (
                        <>
                          <span className="text-2xl">✅</span>
                          Lesson Completed!
                        </>
                      ) : (
                        "Complete This Lesson"
                      )}
                    </h3>
                    <p className="text-slate-600 text-sm sm:text-base">
                      {quizCompletion?.completed
                        ? `You scored ${quizCompletion.percentage}% on the quiz!`
                        : isCompleted
                          ? "Take the quiz again to improve your score!"
                          : "Take the quiz to mark this lesson as complete"}
                    </p>
                    {quizCompletion && (
                      <div className="mt-2 inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Passed · Score: {quizCompletion.score}/{quizCompletion.totalQuestions}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={async () => {
                      // Fetch quizzes and navigate directly to the quiz detail page
                      try {
                        const response = await fetch('/api/quizzes');
                        const data = await response.json();
                        if (data.success && data.data) {
                          const subjectQuiz = data.data.find(q => q.subject === lesson.subject);
                          if (subjectQuiz) {
                            // Navigate directly to quiz detail page
                            router.push(`/quizzes/${subjectQuiz._id || subjectQuiz.id}`);
                          } else {
                            toast.error('No quiz available for this subject yet');
                          }
                        }
                      } catch (err) {
                        console.error('Failed to load quiz:', err);
                        toast.error('Failed to load quiz');
                      }
                    }}
                    className={`group relative ${quizCompletion?.completed
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-orange-600 hover:bg-orange-700'
                      } text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-3`}
                  >
                    {quizCompletion?.completed ? (
                      <>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        View Quiz Results
                      </>
                    ) : isCompleted ? (
                      <>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Retake Quiz
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Take Quiz & Complete
                      </>
                    )}
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Chatbot Component */}
      <Chatbot lessonTitle={lesson.title} lessonSubject={lesson.subject} />
    </>
  );
}
