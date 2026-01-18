"use client";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { registerServiceWorker } from "../lib/pwa/registerSW";
import { setupHardRefreshDetection, clearOfflineData } from "../lib/utils/cacheManager";
import OfflineIndicator from "../components/offline/OfflineIndicator";
import SyncStatus from "../components/offline/SyncStatus";
import { AuthProvider } from "../context/AuthContext";
import { UIProvider } from "../context/UIContext";
import ErrorBoundary from "../components/ErrorBoundary";
import { clientDevLog } from "../lib/utils/devLogger";

function ToasterWrapper() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 4000,
                className: 'light-toast',
                style: {
                    background: '#FFFFFF',
                    color: '#1F2937',
                    border: '2px solid #F97316',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    boxShadow: '0 10px 25px rgba(249, 115, 22, 0.15)',
                },
                success: {
                    iconTheme: {
                        primary: '#10B981',
                        secondary: '#FFFFFF',
                    },
                    style: {
                        border: '2px solid #10B981',
                    },
                },
                error: {
                    iconTheme: {
                        primary: '#EF4444',
                        secondary: '#FFFFFF',
                    },
                    style: {
                        border: '2px solid #EF4444',
                    },
                },
            }}
        />
    );
}

export default function RootLayout({ children }) {
    useEffect(() => {
        // Register service worker for PWA
        registerServiceWorker();

        // Setup hard refresh detection and cache clearing
        setupHardRefreshDetection();

        // Clear offline/stale data on mount (optional - for faster performance)
        const lastCleared = localStorage.getItem('lastCacheCleared');
        const now = Date.now();
        const oneDayInMs = 24 * 60 * 60 * 1000;

        // Clear offline data once per day for better performance
        if (!lastCleared || now - parseInt(lastCleared) > oneDayInMs) {
            clearOfflineData().then(() => {
                localStorage.setItem('lastCacheCleared', now.toString());
                clientDevLog('✅ [Cache] Daily cache maintenance completed');
            });
        }
    }, []);

    return (
        <html lang="en" className="" suppressHydrationWarning>
            <head>
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#F97316" />
                <meta
                    name="description"
                    content="Offline-First Educational Web App for Low-Bandwidth Rural Schools"
                />
            </head>
            <body className="bg-white text-gray-900 transition-colors duration-200">
                <ErrorBoundary>
                    <UIProvider>
                        <AuthProvider>
                            {children}
                            {/* Global Toast Provider */}
                            <ToasterWrapper />
                            {/* Offline Indicator */}
                            <OfflineIndicator />
                            {/* Sync Status */}
                            <SyncStatus />
                        </AuthProvider>
                    </UIProvider>
                </ErrorBoundary>
            </body>
        </html>
    );
} 