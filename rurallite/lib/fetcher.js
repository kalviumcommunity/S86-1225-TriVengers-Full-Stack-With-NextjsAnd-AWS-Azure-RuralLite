/**
 * Fetcher utility for SWR with automatic token refresh
 * Handles API requests with authentication and error handling
 */

import { fetchWithAuth } from "./authClient";

/**
 * Optimized SWR configuration for better performance
 */
export const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 5000,
  focusThrottleInterval: 10000,
  errorRetryCount: 2,
  errorRetryInterval: 3000,
  keepPreviousData: true,
};

export const fetcher = async (url) => {
  // Check if endpoint is public (lessons)
  const isPublicEndpoint = url.includes("/api/lessons");

  const res = await fetchWithAuth(url, { skipAuth: isPublicEndpoint });

  if (!res.ok) {
    const error = new Error("Failed to fetch data");
    error.status = res.status;

    try {
      const errorData = await res.json();
      error.info = errorData;
      error.message = errorData.message || error.message;
    } catch (e) {
      // Response is not JSON
    }

    throw error;
  }

  const responseData = await res.json();

  // If response has success and data fields (from responseHandler), extract data
  if (responseData && responseData.success && responseData.data !== undefined) {
    return responseData.data;
  }

  // Otherwise return the whole response
  return responseData;
};

/**
 * Fetcher with custom method support (POST, PUT, DELETE)
 */
export const fetcherWithMethod =
  (method = "GET") =>
  async (url, body = null) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }

    if (body && method !== "GET") {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(url, options);

    if (!res.ok) {
      const error = new Error("Request failed");
      error.status = res.status;

      try {
        const errorData = await res.json();
        error.info = errorData;
        error.message = errorData.message || error.message;
      } catch (e) {
        // Response is not JSON
      }

      throw error;
    }

    return res.json();
  };
