"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const SIDEBAR_KEY = "uiSidebarOpen";

const getInitialSidebarState = () => {
  if (typeof window === "undefined") return true;
  const stored = window.localStorage.getItem(SIDEBAR_KEY);
  if (stored === null) return true;
  return stored === "true";
};

const UIContext = createContext(undefined);

export function UIProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(getInitialSidebarState);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SIDEBAR_KEY, String(sidebarOpen));
  }, [sidebarOpen]);

  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const value = useMemo(
    () => ({ sidebarOpen, toggleSidebar, closeSidebar }),
    [sidebarOpen, toggleSidebar, closeSidebar]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUIContext() {
  const context = useContext(UIContext);
  if (!context)
    throw new Error("useUIContext must be used within a UIProvider");
  return context;
}
