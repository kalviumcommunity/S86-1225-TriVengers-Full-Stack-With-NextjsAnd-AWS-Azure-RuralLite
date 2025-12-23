"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const THEME_KEY = "uiTheme";
const SIDEBAR_KEY = "uiSidebarOpen";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(THEME_KEY);
  return stored === "dark" ? "dark" : "light";
};

const getInitialSidebarState = () => {
  if (typeof window === "undefined") return true;
  const stored = window.localStorage.getItem(SIDEBAR_KEY);
  if (stored === null) return true;
  return stored === "true";
};

const UIContext = createContext(undefined);

export function UIProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);
  const [sidebarOpen, setSidebarOpen] = useState(getInitialSidebarState);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SIDEBAR_KEY, String(sidebarOpen));
  }, [sidebarOpen]);

  const toggleTheme = useCallback(
    () => setTheme((prev) => (prev === "light" ? "dark" : "light")),
    []
  );

  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const value = useMemo(
    () => ({ theme, toggleTheme, sidebarOpen, toggleSidebar, closeSidebar }),
    [theme, sidebarOpen, toggleTheme, toggleSidebar, closeSidebar]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUIContext() {
  const context = useContext(UIContext);
  if (!context)
    throw new Error("useUIContext must be used within a UIProvider");
  return context;
}
