"use client";
import { useEffect } from "react";

export default function Error({ error, reset }) {
    useEffect(() => {
        // Log error to console or error reporting service
        console.error("Global error:", error);
    }, [error]);

    return (
        <html>
            <body>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 max-w-lg text-center">
                        <div className="text-7xl mb-4">💥</div>
                        <h1 className="text-3xl font-bold text-red-600 mb-3">
                            Something Went Wrong
                        </h1>
                        <p className="text-gray-700 mb-2">
                            We&apos;re sorry, but an unexpected error occurred.
                        </p>
                        <details className="text-left my-4">
                            <summary className="cursor-pointer text-sm font-semibold text-gray-700 mb-2">
                                Error Details
                            </summary>
                            <p className="text-xs text-gray-600 font-mono bg-red-100 p-3 rounded overflow-auto max-h-32">
                                {error.message || "Unknown error"}
                            </p>
                        </details>
                        <div className="space-x-3">
                            <button
                                onClick={() => reset()}
                                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => (window.location.href = "/")}
                                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
} 