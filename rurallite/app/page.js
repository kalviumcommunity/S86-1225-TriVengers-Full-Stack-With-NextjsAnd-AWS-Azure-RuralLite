"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useUI } from "../hooks/useUI";
import Navbar from "@/components/Navbar";
export default function Home() {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useUI();
  const [stats] = useState({ lessons: 5, quizzes: 5, students: 150 });
  const subjects = [
    {
      name: "Mathematics",
      icon: (
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
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
      color: "bg-sky-100",
      textColor: "text-sky-700",
    },
    {
      name: "Science",
      icon: (
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
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      ),
      color: "bg-teal-100",
      textColor: "text-teal-700",
    },
    {
      name: "English",
      icon: (
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
      ),
      color: "bg-orange-100",
      textColor: "text-orange-700",
    },
    {
      name: "Social Science",
      icon: (
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
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: "bg-sky-100",
      textColor: "text-sky-700",
    },
    {
      name: "Hindi",
      icon: (
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
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
          />
        </svg>
      ),
      color: "bg-teal-100",
      textColor: "text-teal-700",
    },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 via-sky-50 to-teal-50">
      {" "}
      <Navbar /> {/* Hero Section */}{" "}
      <section className="relative overflow-hidden py-20 lg:py-28 px-6">
        {" "}
        <div className="max-w-6xl mx-auto text-center">
          {" "}
          <div className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 bg-white/95 backdrop-blur-sm rounded-full border border-orange-200 shadow-lg">
            {" "}
            <svg
              className="w-5 h-5 text-orange-600"
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
            <span className="text-orange-800 font-semibold text-base">
              Empowering Rural Education | Class 10 CBSE
            </span>{" "}
          </div>{" "}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
            {" "}
            <span className="block bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent">
              {" "}
              Education Without Limits,{" "}
            </span>{" "}
            <span className="block bg-gradient-to-r from-sky-600 via-teal-500 to-sky-600 bg-clip-text text-transparent">
              {" "}
              Learning Without Borders{" "}
            </span>{" "}
          </h1>{" "}
          <p className="text-lg md:text-xl text-slate-700 mb-10 max-w-2xl mx-auto leading-relaxed">
            {" "}
            Master Class 10 CBSE curriculum anytime, anywhere. Download lessons,
            practice quizzes, and study offline with RuralLite - designed
            specifically for students in areas with limited internet
            connectivity.{" "}
          </p>{" "}
          <div className="flex flex-col sm:flex-row justify-center gap-5 mb-16">
            {" "}
            <Link href="/subjects">
              {" "}
              <button className="group bg-gradient-to-r from-orange-600 to-orange-500 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-orange-700 hover:to-orange-600 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                {" "}
                <span className="flex items-center justify-center gap-3">
                  {" "}
                  <svg
                    className="w-6 h-6"
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
                  <span>Start Learning Now</span>{" "}
                </span>{" "}
              </button>{" "}
            </Link>{" "}
            <Link href="/quizzes">
              {" "}
              <button className="group bg-white text-orange-700 px-10 py-4 rounded-xl font-bold text-lg border-2 border-orange-300 hover:border-sky-500 hover:bg-sky-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                {" "}
                <span className="flex items-center justify-center gap-3">
                  {" "}
                  <svg
                    className="w-6 h-6"
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
                  <span>Practice Quizzes</span>{" "}
                </span>{" "}
              </button>{" "}
            </Link>{" "}
          </div>{" "}
          {/* Stats */}{" "}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {" "}
            <div className="group bg-white backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-orange-200">
              {" "}
              <div className="text-5xl font-black bg-gradient-to-br from-orange-600 to-orange-500 bg-clip-text text-transparent mb-2">
                {stats.lessons}+
              </div>{" "}
              <div className="text-slate-600 font-medium text-base">
                Subjects Covered
              </div>{" "}
            </div>{" "}
            <div className="group bg-white backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-sky-200">
              {" "}
              <div className="text-5xl font-black bg-gradient-to-br from-sky-600 to-teal-500 bg-clip-text text-transparent mb-2">
                {stats.quizzes}+
              </div>{" "}
              <div className="text-slate-600 font-medium text-base">
                Interactive Quizzes
              </div>{" "}
            </div>{" "}
            <div className="group bg-white backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-teal-200">
              {" "}
              <div className="text-5xl font-black bg-gradient-to-br from-teal-600 to-sky-500 bg-clip-text text-transparent mb-2">
                {stats.students}+
              </div>{" "}
              <div className="text-slate-600 font-medium text-base">
                Active Learners
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* Subjects Section */}{" "}
      <section className="py-20 lg:py-24 px-6 bg-white">
        {" "}
        <div className="max-w-6xl mx-auto">
          {" "}
          <div className="text-center mb-16">
            {" "}
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-orange-900">
              {" "}
              Class 10 Subjects{" "}
            </h2>{" "}
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              {" "}
              Complete curriculum with detailed lessons, interactive quizzes,
              and comprehensive practice tests for all major subjects{" "}
            </p>{" "}
          </div>{" "}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {" "}
            {subjects.map((subject, idx) => (
              <Link href="/subjects" key={idx}>
                {" "}
                <div className="group cursor-pointer bg-beige-50 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-orange-100 hover:border-sky-400">
                  {" "}
                  <div
                    className={`text-4xl mb-4 ${subject.color} w-16 h-16 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300`}
                  >
                    {" "}
                    <span>{subject.icon}</span>{" "}
                  </div>{" "}
                  <h3
                    className={`text-base font-bold ${subject.textColor} text-center mb-1`}
                  >
                    {" "}
                    {subject.name}{" "}
                  </h3>{" "}
                  <p className="text-xs text-slate-500 text-center">
                    {" "}
                    1 Lesson • 1 Quiz{" "}
                  </p>{" "}
                </div>{" "}
              </Link>
            ))}{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* How It Works Section */}{" "}
      <section className="py-20 lg:py-24 px-6 bg-gradient-to-br from-sky-50 via-teal-50 to-orange-50">
        {" "}
        <div className="max-w-7xl mx-auto">
          {" "}
          <div className="text-center mb-16">
            {" "}
            <h2 className="text-4xl md:text-5xl font-black text-orange-900 mb-4">
              {" "}
              How RuralLite Works{" "}
            </h2>{" "}
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {" "}
              Simple, effective, and designed for offline-first learning in
              rural areas{" "}
            </p>{" "}
          </div>{" "}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {" "}
            <div className="text-center">
              {" "}
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                {" "}
                <span className="text-3xl font-black text-white">1</span>{" "}
              </div>{" "}
              <h3 className="text-xl font-bold text-orange-900 mb-3">
                {" "}
                Sign Up Free{" "}
              </h3>{" "}
              <p className="text-slate-600 leading-relaxed">
                {" "}
                Create your account in seconds. No credit card required, no
                hidden fees.{" "}
              </p>{" "}
            </div>{" "}
            <div className="text-center">
              {" "}
              <div className="w-20 h-20 bg-gradient-to-br from-sky-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                {" "}
                <span className="text-3xl font-black text-white">2</span>{" "}
              </div>{" "}
              <h3 className="text-xl font-bold text-orange-900 mb-3">
                {" "}
                Download Content{" "}
              </h3>{" "}
              <p className="text-slate-600 leading-relaxed">
                {" "}
                When connected, download lessons and quizzes for all your
                subjects at once.{" "}
              </p>{" "}
            </div>{" "}
            <div className="text-center">
              {" "}
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-sky-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                {" "}
                <span className="text-3xl font-black text-white">3</span>{" "}
              </div>{" "}
              <h3 className="text-xl font-bold text-orange-900 mb-3">
                {" "}
                Study Anywhere{" "}
              </h3>{" "}
              <p className="text-slate-600 leading-relaxed">
                {" "}
                Access all content offline. Study at your own pace, anytime,
                anywhere.{" "}
              </p>{" "}
            </div>{" "}
            <div className="text-center">
              {" "}
              <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                {" "}
                <span className="text-3xl font-black text-white">4</span>{" "}
              </div>{" "}
              <h3 className="text-xl font-bold text-orange-900 mb-3">
                {" "}
                Track Progress{" "}
              </h3>{" "}
              <p className="text-slate-600 leading-relaxed">
                {" "}
                Auto-sync your progress when online. Never lose your learning
                data.{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* Features Section */}{" "}
      <section className="py-20 lg:py-24 px-6 bg-white">
        {" "}
        <div className="max-w-7xl mx-auto">
          {" "}
          <div className="text-center mb-16">
            {" "}
            <h2 className="text-4xl md:text-5xl font-black text-orange-900 mb-4">
              {" "}
              Why Choose RuralLite?{" "}
            </h2>{" "}
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {" "}
              Everything you need for effective offline learning, designed
              specifically for rural students{" "}
            </p>{" "}
          </div>{" "}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {" "}
            <div className="bg-beige-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-sky-100">
              {" "}
              <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-teal-500 rounded-xl flex items-center justify-center mb-6 shadow-md">
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
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />{" "}
                </svg>{" "}
              </div>{" "}
              <h3 className="text-xl font-bold text-orange-900 mb-3">
                {" "}
                Complete Offline Access{" "}
              </h3>{" "}
              <p className="text-slate-600 leading-relaxed">
                {" "}
                Download all lessons, quizzes, and study materials to access
                them anytime without internet. Perfect for areas with limited
                connectivity.{" "}
              </p>{" "}
            </div>{" "}
            <div className="bg-beige-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-orange-100">
              {" "}
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
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
              <h3 className="text-xl font-bold text-orange-900 mb-3">
                {" "}
                Interactive Quizzes{" "}
              </h3>{" "}
              <p className="text-slate-600 leading-relaxed">
                {" "}
                Test your knowledge with subject-wise quizzes. Get instant
                feedback, detailed explanations, and track your improvement over
                time.{" "}
              </p>{" "}
            </div>{" "}
            <div className="bg-beige-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-teal-100">
              {" "}
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-sky-500 rounded-xl flex items-center justify-center mb-6 shadow-md">
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />{" "}
                </svg>{" "}
              </div>{" "}
              <h3 className="text-xl font-bold text-orange-900 mb-3">
                {" "}
                Smart Auto-Sync{" "}
              </h3>{" "}
              <p className="text-slate-600 leading-relaxed">
                {" "}
                Your progress automatically syncs when you connect to the
                internet. Study offline worry-free, never lose your work or
                scores.{" "}
              </p>{" "}
            </div>{" "}
            <div className="bg-beige-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-orange-100">
              {" "}
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
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
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />{" "}
                </svg>{" "}
              </div>{" "}
              <h3 className="text-xl font-bold text-orange-900 mb-3">
                {" "}
                AI Study Assistant{" "}
              </h3>{" "}
              <p className="text-slate-600 leading-relaxed">
                {" "}
                Get instant help with your doubts from our AI chatbot.
                Personalized explanations and guidance available 24/7 when
                online.{" "}
              </p>{" "}
            </div>{" "}
            <div className="bg-beige-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-sky-100">
              {" "}
              <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-teal-500 rounded-xl flex items-center justify-center mb-6 shadow-md">
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />{" "}
                </svg>{" "}
              </div>{" "}
              <h3 className="text-xl font-bold text-orange-900 mb-3">
                {" "}
                CBSE Aligned Content{" "}
              </h3>{" "}
              <p className="text-slate-600 leading-relaxed">
                {" "}
                All content follows the latest CBSE Class 10 syllabus.
                Comprehensive coverage of Mathematics, Science, English, Social
                Science, and Hindi.{" "}
              </p>{" "}
            </div>{" "}
            <div className="bg-beige-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-teal-100">
              {" "}
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-sky-500 rounded-xl flex items-center justify-center mb-6 shadow-md">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />{" "}
                </svg>{" "}
              </div>{" "}
              <h3 className="text-xl font-bold text-orange-900 mb-3">
                {" "}
                Lightning Fast & Lightweight{" "}
              </h3>{" "}
              <p className="text-slate-600 leading-relaxed">
                {" "}
                Optimized for low-end devices and slow connections. Minimal data
                usage, fast downloads, and smooth performance on any
                device.{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* Student Success Section */}{" "}
      <section className="py-20 lg:py-24 px-6 bg-gradient-to-br from-orange-50 via-beige-50 to-sky-50">
        {" "}
        <div className="max-w-7xl mx-auto">
          {" "}
          <div className="text-center mb-16">
            {" "}
            <h2 className="text-4xl md:text-5xl font-black text-orange-900 mb-4">
              {" "}
              Student Success Stories{" "}
            </h2>{" "}
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {" "}
              Hear from students who improved their grades with RuralLite{" "}
            </p>{" "}
          </div>{" "}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {" "}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-orange-200">
              {" "}
              <div className="flex items-center gap-4 mb-6">
                {" "}
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {" "}
                  R{" "}
                </div>{" "}
                <div>
                  {" "}
                  <h4 className="font-bold text-lg text-orange-900">
                    Rajesh Kumar
                  </h4>{" "}
                  <p className="text-sm text-slate-600">Class 10, Bihar</p>{" "}
                </div>{" "}
              </div>{" "}
              <p className="text-slate-700 leading-relaxed mb-4">
                {" "}
                "RuralLite changed my life! I live in a village with no
                internet, but now I can study all subjects offline. My math
                score improved from 60% to 92%!"{" "}
              </p>{" "}
              <div className="flex text-orange-500">
                {" "}
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    {" "}
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />{" "}
                  </svg>
                ))}{" "}
              </div>{" "}
            </div>{" "}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-sky-200">
              {" "}
              <div className="flex items-center gap-4 mb-6">
                {" "}
                <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {" "}
                  P{" "}
                </div>{" "}
                <div>
                  {" "}
                  <h4 className="font-bold text-lg text-orange-900">
                    Priya Sharma
                  </h4>{" "}
                  <p className="text-sm text-slate-600">
                    Class 10, Rajasthan
                  </p>{" "}
                </div>{" "}
              </div>{" "}
              <p className="text-slate-700 leading-relaxed mb-4">
                {" "}
                "The quizzes helped me practice every day. The AI chatbot
                explained difficult topics so clearly. I topped my school in
                science this year!"{" "}
              </p>{" "}
              <div className="flex text-orange-500">
                {" "}
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    {" "}
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />{" "}
                  </svg>
                ))}{" "}
              </div>{" "}
            </div>{" "}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-teal-200">
              {" "}
              <div className="flex items-center gap-4 mb-6">
                {" "}
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-sky-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {" "}
                  A{" "}
                </div>{" "}
                <div>
                  {" "}
                  <h4 className="font-bold text-lg text-orange-900">
                    Amit Patel
                  </h4>{" "}
                  <p className="text-sm text-slate-600">
                    Class 10, Gujarat
                  </p>{" "}
                </div>{" "}
              </div>{" "}
              <p className="text-slate-700 leading-relaxed mb-4">
                {" "}
                "Best app for rural students! Downloads work perfectly on 2G. I
                can study during my bus journey. Scored 95% in my board
                exams!"{" "}
              </p>{" "}
              <div className="flex text-orange-500">
                {" "}
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    {" "}
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />{" "}
                  </svg>
                ))}{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* CTA Section */}{" "}
      <section className="py-20 lg:py-24 px-6 bg-gradient-to-br from-orange-600 via-orange-500 to-orange-600 relative overflow-hidden">
        {" "}
        <div className="absolute inset-0 opacity-10">
          {" "}
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>{" "}
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>{" "}
        </div>{" "}
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {" "}
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            {" "}
            Ready to Start Your Learning Journey?{" "}
          </h2>{" "}
          <p className="text-xl text-white/95 mb-10 font-medium">
            {" "}
            Join thousands of students improving their grades with RuralLite.
            Start learning today, completely free!{" "}
          </p>{" "}
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            {" "}
            <Link href="/signup">
              {" "}
              <button className="bg-white text-orange-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-beige-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105">
                {" "}
                Sign Up Free - No Credit Card{" "}
              </button>{" "}
            </Link>{" "}
            <Link href="/subjects">
              {" "}
              <button className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all shadow-xl">
                {" "}
                Explore Subjects{" "}
              </button>{" "}
            </Link>{" "}
          </div>{" "}
          <p className="text-white/80 text-sm mt-6">
            {" "}
            ✓ No payment required ✓ Instant access ✓ Works offline{" "}
          </p>{" "}
        </div>{" "}
      </section>{" "}
      {/* Footer */}{" "}
      <footer className="bg-orange-900 text-beige-100 py-16 px-6 border-t border-orange-800">
        {" "}
        <div className="max-w-7xl mx-auto">
          {" "}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {" "}
            {/* Brand */}{" "}
            <div className="md:col-span-1">
              {" "}
              <h3 className="text-2xl font-black text-white mb-4">
                RuralLite
              </h3>{" "}
              <p className="text-beige-200 text-sm leading-relaxed mb-4">
                {" "}
                Empowering rural education through offline-first learning
                technology.{" "}
              </p>{" "}
              <div className="flex gap-3">
                {" "}
                <a
                  href="#"
                  className="w-10 h-10 bg-orange-800 hover:bg-orange-700 rounded-full flex items-center justify-center transition-all"
                >
                  {" "}
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {" "}
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />{" "}
                  </svg>{" "}
                </a>{" "}
                <a
                  href="#"
                  className="w-10 h-10 bg-orange-800 hover:bg-orange-700 rounded-full flex items-center justify-center transition-all"
                >
                  {" "}
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {" "}
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />{" "}
                  </svg>{" "}
                </a>{" "}
                <a
                  href="#"
                  className="w-10 h-10 bg-orange-800 hover:bg-orange-700 rounded-full flex items-center justify-center transition-all"
                >
                  {" "}
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {" "}
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />{" "}
                  </svg>{" "}
                </a>{" "}
              </div>{" "}
            </div>{" "}
            {/* Quick Links */}{" "}
            <div>
              {" "}
              <h4 className="text-white font-bold mb-4">Quick Links</h4>{" "}
              <ul className="space-y-2 text-sm">
                {" "}
                <li>
                  <Link
                    href="/subjects"
                    className="hover:text-white transition-colors"
                  >
                    Browse Subjects
                  </Link>
                </li>{" "}
                <li>
                  <Link
                    href="/lessons"
                    className="hover:text-white transition-colors"
                  >
                    All Lessons
                  </Link>
                </li>{" "}
                <li>
                  <Link
                    href="/quizzes"
                    className="hover:text-white transition-colors"
                  >
                    Practice Quizzes
                  </Link>
                </li>{" "}
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>{" "}
              </ul>{" "}
            </div>{" "}
            {/* Resources */}{" "}
            <div>
              {" "}
              <h4 className="text-white font-bold mb-4">Resources</h4>{" "}
              <ul className="space-y-2 text-sm">
                {" "}
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>{" "}
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    User Guide
                  </a>
                </li>{" "}
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Download for Android
                  </a>
                </li>{" "}
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Offline Mode Guide
                  </a>
                </li>{" "}
              </ul>{" "}
            </div>{" "}
            {/* Company */}{" "}
            <div>
              {" "}
              <h4 className="text-white font-bold mb-4">Company</h4>{" "}
              <ul className="space-y-2 text-sm">
                {" "}
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>{" "}
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>{" "}
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>{" "}
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>{" "}
              </ul>{" "}
            </div>{" "}
          </div>{" "}
          {/* Bottom Bar */}{" "}
          <div className="border-t border-orange-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            {" "}
            <p className="text-sm text-beige-200">
              {" "}
              © 2026 RuralLite Learning Platform. Empowering rural education
              through technology.{" "}
            </p>{" "}
            <div className="flex gap-6 text-sm">
              {" "}
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>{" "}
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>{" "}
              <a href="#" className="hover:text-white transition-colors">
                Sitemap
              </a>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </footer>{" "}
    </div>
  );
}
