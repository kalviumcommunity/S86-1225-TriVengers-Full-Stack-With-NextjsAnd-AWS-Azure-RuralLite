/**
 * Client-side Authentication Utilities with Token Refresh
 * 
 * Handles automatic token refresh when access token expires
 */

let isRefreshing = false;
let refreshSubscribers = [];

/**
 * Subscribe to token refresh completion
 * @param {Function} callback - Function to call when refresh completes
 */
function subscribeTokenRefresh(callback) {
    refreshSubscribers.push(callback);
}

/**
 * Notify all subscribers that token refresh is complete
 * @param {string} token - New access token
 */
function onRefreshed(token) {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
}

/**
 * Refresh access token using refresh token
 * @returns {Promise<string|null>} - New access token or null if refresh fails
 */
export async function refreshAccessToken() {
    try {
        const response = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include", // Include cookies
        });

        if (!response.ok) {
            throw new Error("Token refresh failed");
        }

        const data = await response.json();

        if (data.success && data.data?.accessToken) {
            // Store new access token
            if (typeof window !== "undefined") {
                localStorage.setItem("authToken", data.data.accessToken);
            }
            return data.data.accessToken;
        }

        return null;
    } catch (error) {
        console.error("Token refresh error:", error);

        // Clear auth data on refresh failure
        if (typeof window !== "undefined") {
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
        }

        return null;
    }
}

/**
 * Fetch with automatic token refresh on 401
 * @param {string} url - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} - Fetch response
 */
export async function fetchWithAuth(url, options = {}) {
    // Get current access token
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    // Add authorization header
    const headers = {
        ...options.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
    };

    // Make initial request
    let response = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
    });

    // If 401 Unauthorized, try to refresh token
    if (response.status === 401 && !options._retry) {
        if (isRefreshing) {
            // Wait for ongoing refresh to complete
            return new Promise((resolve) => {
                subscribeTokenRefresh((newToken) => {
                    // Retry original request with new token
                    resolve(
                        fetch(url, {
                            ...options,
                            headers: {
                                ...options.headers,
                                Authorization: `Bearer ${newToken}`,
                            },
                            credentials: "include",
                            _retry: true,
                        })
                    );
                });
            });
        }

        // Start refresh process
        isRefreshing = true;

        try {
            const newToken = await refreshAccessToken();

            if (newToken) {
                // Notify subscribers
                onRefreshed(newToken);
                isRefreshing = false;

                // Retry original request with new token
                return fetch(url, {
                    ...options,
                    headers: {
                        ...options.headers,
                        Authorization: `Bearer ${newToken}`,
                    },
                    credentials: "include",
                    _retry: true,
                });
            } else {
                // Refresh failed, redirect to login
                isRefreshing = false;

                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }

                return response;
            }
        } catch (error) {
            isRefreshing = false;
            throw error;
        }
    }

    return response;
}

/**
 * Enhanced SWR fetcher with automatic token refresh
 * Use with SWR: useSWR(url, fetcherWithAuth)
 * @param {string} url - API endpoint
 * @returns {Promise<any>} - Response data
 */
export const fetcherWithAuth = async (url) => {
    const response = await fetchWithAuth(url);

    if (!response.ok) {
        const error = new Error("Failed to fetch data");
        error.status = response.status;

        try {
            const errorData = await response.json();
            error.info = errorData;
            error.message = errorData.message || error.message;
        } catch (e) {
            // Response is not JSON
        }

        throw error;
    }

    return response.json();
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if authenticated
 */
export function isAuthenticated() {
    if (typeof window === "undefined") return false;

    const token = localStorage.getItem("authToken");
    return !!token;
}

/**
 * Get current user from localStorage
 * @returns {Object|null} - User object or null
 */
export function getCurrentUser() {
    if (typeof window === "undefined") return null;

    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    try {
        return JSON.parse(userStr);
    } catch (error) {
        return null;
    }
}

/**
 * Logout user (clear tokens and redirect)
 */
export async function logout() {
    try {
        // Call logout API to clear HTTP-only cookies
        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });
    } catch (error) {
        console.error("Logout API error:", error);
    }

    // Clear localStorage
    if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
    }
}

/**
 * Setup automatic token refresh before expiry
 * Refreshes token 1 minute before it expires
 */
export function setupAutoRefresh() {
    if (typeof window === "undefined") return;

    // Refresh every 14 minutes (access token expires in 15 minutes)
    const refreshInterval = 14 * 60 * 1000; // 14 minutes

    const intervalId = setInterval(async () => {
        if (isAuthenticated()) {
            console.log("Auto-refreshing token...");
            await refreshAccessToken();
        } else {
            clearInterval(intervalId);
        }
    }, refreshInterval);

    return intervalId;
}
