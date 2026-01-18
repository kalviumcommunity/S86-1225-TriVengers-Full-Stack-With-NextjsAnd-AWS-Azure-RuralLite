"use client";

import { useUIContext } from "../context/UIContext";

export function useUI() {
  const context = useUIContext();

  // Return only sidebar-related functions
  return {
    sidebarOpen: context.sidebarOpen,
    toggleSidebar: context.toggleSidebar,
    closeSidebar: context.closeSidebar
  };
}
