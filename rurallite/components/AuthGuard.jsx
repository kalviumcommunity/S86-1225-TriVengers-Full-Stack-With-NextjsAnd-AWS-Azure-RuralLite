"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AuthGuard({ children, requireAuth = true }) {
    const router = useRouter();
    const { isAuthenticated, status } = useAuth();

    useEffect(() => {
        if (requireAuth && status !== "loading" && !isAuthenticated) {
            router.push("/login");
        }
    }, [requireAuth, isAuthenticated, status, router]);

    // Show loading spinner while checking auth
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
    if (requireAuth && !isAuthenticated) {
        return null; // Redirect will happen in useEffect
    }

    return children;
}