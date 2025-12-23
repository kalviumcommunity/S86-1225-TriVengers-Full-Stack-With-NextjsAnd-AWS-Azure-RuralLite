"use client";

import { useMemo } from "react";
import { useAuthContext } from "../context/AuthContext";

export function useAuth() {
  const context = useAuthContext();
  const isAuthenticated = useMemo(
    () => context.status === "authenticated" && !!context.user,
    [context.status, context.user]
  );

  return {
    ...context,
    isAuthenticated,
  };
}
