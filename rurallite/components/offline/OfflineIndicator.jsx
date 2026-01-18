"use client";
import { useState, useEffect } from "react";
import { setupOnlineStatusListener } from "@/lib/pwa/registerSW";

export default function OfflineIndicator() {
    const [isOnline, setIsOnline] = useState(true);
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        const cleanup = setupOnlineStatusListener((online) => {
            const wasOnline = isOnline;
            setIsOnline(online);

            // Show notification on status change
            if (wasOnline !== online) {
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 3000);
            }
        });

        return cleanup;
    }, [isOnline]);

    if (!showNotification && isOnline) return null;

    return (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
            {isOnline ? (
                <div className="bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                    <span className="font-medium">Back Online</span>
                </div>
            ) : (
                <div className="bg-amber-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
                    <svg
                        className="w-6 h-6 animate-pulse"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3"
                        />
                    </svg>
                    <span className="font-medium">You're Offline</span>
                </div>
            )}
        </div>
    );
}
