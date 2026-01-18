"use client";
import { useState, useEffect } from "react";
import { dbManager, STORES } from "@/lib/db/indexedDB";

export default function SyncStatus() {
    const [pendingCount, setPendingCount] = useState(0);
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        checkPendingSync();

        // Listen for sync events
        const handleSyncRequired = () => {
            checkPendingSync();
        };

        window.addEventListener('sync-required', handleSyncRequired);

        // Check periodically
        const interval = setInterval(checkPendingSync, 30000); // Every 30 seconds

        return () => {
            window.removeEventListener('sync-required', handleSyncRequired);
            clearInterval(interval);
        };
    }, []);

    async function checkPendingSync() {
        try {
            const queue = await dbManager.getSyncQueue();
            setPendingCount(queue.length);
        } catch (error) {
            console.error('Error checking sync queue:', error);
        }
    }

    async function handleSync() {
        if (!navigator.onLine) {
            alert('Cannot sync while offline');
            return;
        }

        setIsSyncing(true);
        try {
            const queue = await dbManager.getSyncQueue();

            for (const item of queue) {
                try {
                    // Process sync item based on action
                    const response = await fetch(item.data.url, {
                        method: item.data.method,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
                        },
                        body: item.data.body ? JSON.stringify(item.data.body) : undefined
                    });

                    if (response.ok) {
                        await dbManager.markSynced(item.id);
                    }
                } catch (error) {
                    console.error('Sync item failed:', error);
                }
            }

            await checkPendingSync();
            alert('Sync completed successfully!');
        } catch (error) {
            console.error('Sync failed:', error);
            alert('Sync failed. Please try again.');
        } finally {
            setIsSyncing(false);
        }
    }

    if (pendingCount === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button
                onClick={handleSync}
                disabled={isSyncing}
                className="bg-sky-400 hover:bg-sky-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSyncing ? (
                    <>
                        <svg
                            className="animate-spin h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        <span>Syncing...</span>
                    </>
                ) : (
                    <>
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
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        <span>Sync {pendingCount} changes</span>
                    </>
                )}
            </button>
        </div>
    );
}
