"use client";

import { useSWRConfig } from "swr";
import { useState, useEffect } from "react";

/**
 * SWR Cache Inspector Component
 * Displays cached SWR keys and provides insights into cache behavior
 * Useful for debugging and understanding SWR's caching mechanism
 */
export default function SWRCacheInspector() {
    const { cache } = useSWRConfig();
    const [cachedKeys, setCachedKeys] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Update cached keys every second
        const interval = setInterval(() => {
            if (cache && cache.keys) {
                setCachedKeys(Array.from(cache.keys()));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [cache]);

    if (process.env.NODE_ENV === "production") {
        return null; // Hide in production
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 flex items-center gap-2"
            >
                <span className="text-lg">🔍</span>
                <span>SWR Cache ({cachedKeys.length})</span>
            </button>

            {isOpen && (
                <div className="mt-2 bg-white border border-gray-300 rounded-lg shadow-xl p-4 max-w-md max-h-96 overflow-auto">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-lg">SWR Cache Inspector</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="mb-3 p-2 bg-blue-50 rounded text-sm">
                        <p className="text-blue-800">
                            <strong>Cache Hits:</strong> Data served instantly
                        </p>
                        <p className="text-blue-800">
                            <strong>Cache Misses:</strong> Triggers fetch request
                        </p>
                    </div>

                    {cachedKeys.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                            No cached data yet. Navigate to pages to populate cache.
                        </p>
                    ) : (
                        <div className="space-y-2">
                            <h4 className="font-semibold text-sm text-gray-700">
                                Cached Endpoints:
                            </h4>
                            <ul className="space-y-1">
                                {cachedKeys.map((key, idx) => (
                                    <li
                                        key={idx}
                                        className="text-xs bg-gray-100 p-2 rounded border border-gray-200 font-mono"
                                    >
                                        {key}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-gray-200">
                        <h4 className="font-semibold text-sm mb-2">Cache Stats:</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-green-50 p-2 rounded">
                                <p className="text-green-700 font-semibold">Total Keys</p>
                                <p className="text-2xl font-bold text-green-800">
                                    {cachedKeys.length}
                                </p>
                            </div>
                            <div className="bg-purple-50 p-2 rounded">
                                <p className="text-purple-700 font-semibold">Status</p>
                                <p className="text-sm font-bold text-purple-800">
                                    {cachedKeys.length > 0 ? "Active" : "Empty"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 p-2 bg-yellow-50 rounded text-xs text-yellow-800">
                        💡 <strong>Tip:</strong> Navigate between pages to see cache
                        behavior. Return to visited pages for instant loading!
                    </div>
                </div>
            )}
        </div>
    );
}
