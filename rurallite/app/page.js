"use client";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { useUI } from "../hooks/useUI";

export default function Home() {
  const { isAuthenticated, user, status, logout } = useAuth();
  const { theme, toggleTheme, sidebarOpen, toggleSidebar } = useUI();

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-blue-50">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-extrabold text-gray-900 mb-6">
            RuralLite Learning Platform
          </h1>
          <p className="text-2xl text-gray-600 mb-10">
            Offline-First Educational Web App for Low-Bandwidth Rural Schools
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/signup">
              <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                Get Started
              </button>
            </Link>
            <Link href="/login">
              <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold border-2 border-green-600 hover:bg-green-50 transition">
                Login
              </button>
            </Link>
          </div>
        </div>

        {/* Context + Hooks Playground */}
        <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              UI State
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Theme and sidebar state are shared through UIContext.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Toggle Theme (now {theme})
              </button>
              <button
                type="button"
                onClick={toggleSidebar}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
              >
                {sidebarOpen ? "Hide" : "Show"} Sidebar
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Auth Snapshot
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Powered by AuthContext and the useAuth hook.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-700">
                Status: <span className="font-semibold">{status}</span>
              </p>
              <p className="text-sm text-gray-700">
                User:{" "}
                <span className="font-semibold">
                  {user?.email ?? "Not signed in"}
                </span>
              </p>
            </div>
            <div className="mt-4 flex gap-3">
              <Link
                href="/login"
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Go to Login
              </Link>
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={logout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  Logout
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Try It</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
              <li>Login to watch the Auth card update instantly.</li>
              <li>Toggle theme to flip UI variables globally.</li>
              <li>Collapse the sidebar to free up workspace.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
