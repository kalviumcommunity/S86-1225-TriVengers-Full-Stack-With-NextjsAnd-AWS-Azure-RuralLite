"use client";

import React from "react";

class AuthErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Auth Error Boundary caught an error:", error, errorInfo);

    // Check if it's an auth-related error
    if (
      error?.message?.includes("auth") ||
      error?.message?.includes("token") ||
      error?.message?.includes("401") ||
      error?.message?.includes("unauthorized")
    ) {
      // Clear auth data and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <svg
              className="w-20 h-20 text-red-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Something Went Wrong
            </h2>
            <p className="text-slate-600 mb-6">
              We encountered an error. Please try refreshing the page.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
              >
                Refresh Page
              </button>
              <button
                onClick={() => (window.location.href = "/login")}
                className="flex-1 bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold border-2 border-orange-300 hover:bg-orange-50 transition"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AuthErrorBoundary;
