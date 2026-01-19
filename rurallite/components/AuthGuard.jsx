"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AuthErrorBoundary from "./AuthErrorBoundary";

export default function AuthGuard({ children, requireAuth = true }) {
  const router = useRouter();
  const { isAuthenticated, status } = useAuth();

  useEffect(() => {
    // Only redirect after auth status has been determined
    if (requireAuth && status === "unauthenticated") {
      router.push("/login");
    }
  }, [requireAuth, status, router]);

  // Show loading spinner while checking auth or during initial load
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // If auth is required but user is not authenticated, don't render children
  // The redirect will happen in useEffect
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  return <AuthErrorBoundary>{children}</AuthErrorBoundary>;
}
