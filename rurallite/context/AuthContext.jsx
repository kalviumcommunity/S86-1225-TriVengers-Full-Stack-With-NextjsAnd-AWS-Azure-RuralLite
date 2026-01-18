"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEYS = {
  token: "authToken",
  user: "user",
};

const AuthContext = createContext(undefined);

const readStoredUser = () => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEYS.user);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const readStoredToken = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEYS.token);
};

const persistSession = (token, user) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEYS.token, token);
  window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
};

const clearSession = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEYS.token);
  window.localStorage.removeItem(STORAGE_KEYS.user);
};

export function AuthProvider({ children }) {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [status, setStatus] = useState("unauthenticated");
  const [error, setError] = useState(null);

  // Initialize auth state only on client side to avoid hydration mismatch
  useEffect(() => {
    const storedUser = readStoredUser();
    const storedToken = readStoredToken();

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
      setStatus("authenticated");
    }

    setMounted(true);
  }, []);

  // Handle tab visibility changes and storage events for cross-tab sync
  useEffect(() => {
    if (!mounted) return;

    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEYS.user || e.key === STORAGE_KEYS.token) {
        const storedUser = readStoredUser();
        const storedToken = readStoredToken();

        if (!storedUser || !storedToken) {
          // User logged out in another tab
          setUser(null);
          setToken(null);
          setStatus("unauthenticated");
          setError(null);
        } else {
          // User logged in or updated in another tab
          setUser(storedUser);
          setToken(storedToken);
          setStatus("authenticated");
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Tab became visible, check if auth state is still valid
        const storedUser = readStoredUser();
        const storedToken = readStoredToken();

        if (status === "authenticated" && (!storedUser || !storedToken)) {
          setUser(null);
          setToken(null);
          setStatus("unauthenticated");
          setError(null);
        } else if (status !== "authenticated" && storedUser && storedToken) {
          setUser(storedUser);
          setToken(storedToken);
          setStatus("authenticated");
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [mounted, status]);

  const login = useCallback(async (credentials) => {
    if (!credentials?.email || !credentials?.password) {
      const message = "Email and password are required.";
      setError(message);
      setStatus("unauthenticated");
      return { success: false, message };
    }

    setStatus("loading");
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        const message = data?.message || "Login failed. Please try again.";
        setError(message);
        setStatus("unauthenticated");
        return { success: false, message };
      }

      const nextUser = data?.data?.user ?? null;
      const nextToken = data?.data?.token ?? null;

      if (!nextUser || !nextToken) {
        const message = "Login response was missing user data.";
        setError(message);
        setStatus("unauthenticated");
        return { success: false, message };
      }

      persistSession(nextToken, nextUser);
      setUser(nextUser);
      setToken(nextToken);
      setStatus("authenticated");
      return { success: true, user: nextUser };
    } catch (err) {
      const message = "Unable to login. Please try again.";
      setError(message);
      setStatus("unauthenticated");
      return { success: false, message, details: err?.message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore network errors during logout
    }

    clearSession();
    setUser(null);
    setToken(null);
    setStatus("unauthenticated");
    setError(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return null;

    setStatus((prev) => (prev === "authenticated" ? prev : "loading"));

    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data?.success && data?.data) {
        persistSession(token, data.data);
        setUser(data.data);
        setStatus("authenticated");
        return data.data;
      }

      setStatus("unauthenticated");
      return null;
    } catch (err) {
      setStatus("unauthenticated");
      return null;
    }
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      status,
      error,
      login,
      logout,
      refreshUser,
    }),
    [user, token, status, error, login, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthContext must be used within an AuthProvider");
  return context;
}
