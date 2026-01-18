"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { useUI } from "../hooks/useUI";
export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, user, logout, status } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const handleLogout = async () => {
        await logout();
        router.push("/");
        setProfileDropdownOpen(false);
        setMobileMenuOpen(false);
    };
    useEffect(() => {
        const handleClickOutside = () => {
            setProfileDropdownOpen(false);
        };
        if (profileDropdownOpen) {
            document.addEventListener("click", handleClickOutside);
            return () => document.removeEventListener("click", handleClickOutside);
        }
    }, [profileDropdownOpen]);
    const isActivePath = (path) => pathname === path;
    const navLinks = [
        {
            href: "/dashboard",
            label: "Dashboard",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    {" "}
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />{" "}
                </svg>
            ),
            authRequired: true,
        },
        {
            href: "/subjects",
            label: "Subjects",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    {" "}
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />{" "}
                </svg>
            ),
            authRequired: true,
        },
        {
            href: "/quizzes",
            label: "Quizzes",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    {" "}
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />{" "}
                </svg>
            ),
            authRequired: true,
        },
        {
            href: "/notes",
            label: "Notes",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    {" "}
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />{" "}
                </svg>
            ),
            authRequired: true,
        },
    ];
    const allowedRoles = ["admin", "editor"];
    if (isAuthenticated && user?.role && allowedRoles.includes(user.role)) {
        navLinks.push({
            href: "/users",
            label: "Users",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    {" "}
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />{" "}
                </svg>
            ),
            authRequired: true,
            roleRequired: true,
        });
    }
    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
            {" "}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {" "}
                <div className="flex justify-between items-center h-16">
                    {" "}
                    {/* Logo */}{" "}
                    <Link href="/" className="flex items-center gap-3 group">
                        {" "}
                        <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-md group-hover:shadow-lg transition-all">
                            {" "}
                            <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {" "}
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />{" "}
                            </svg>{" "}
                        </div>{" "}
                        <span className="text-xl font-bold text-gray-900 tracking-tight">
                            RuralLite
                        </span>{" "}
                    </Link>{" "}
                    {/* Desktop Navigation */}{" "}
                    <div className="hidden md:flex items-center space-x-1">
                        {" "}
                        {navLinks.map((link) => {
                            if (link.authRequired && !isAuthenticated) return null;
                            const isActive = isActivePath(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}
                                >
                                    {" "}
                                    {link.icon} <span>{link.label}</span>{" "}
                                </Link>
                            );
                        })}{" "}
                    </div>{" "}
                    {/* Right Side Actions */}{" "}
                    <div className="flex items-center gap-3">
                        {" "}
                        {/* Auth Section */}{" "}
                        {isAuthenticated ? (
                            <div className="relative">
                                {" "}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setProfileDropdownOpen(!profileDropdownOpen);
                                    }}
                                    className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all"
                                >
                                    {" "}
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white text-sm font-semibold shadow-sm">
                                        {" "}
                                        {user?.name?.[0]?.toUpperCase() || "U"}{" "}
                                    </div>{" "}
                                    <div className="text-left">
                                        {" "}
                                        <div className="text-sm font-semibold text-gray-900">
                                            {user?.name || "User"}
                                        </div>{" "}
                                        {user?.role && (
                                            <div className="text-xs text-gray-500 capitalize">
                                                {user.role}
                                            </div>
                                        )}{" "}
                                    </div>{" "}
                                    <svg
                                        className={`w-4 h-4 text-gray-400 transition-transform ${profileDropdownOpen ? "rotate-180" : ""}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        {" "}
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />{" "}
                                    </svg>{" "}
                                </button>{" "}
                                {/* Profile Dropdown */}{" "}
                                {profileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                                        {" "}
                                        <Link
                                            href="/profile"
                                            onClick={() => setProfileDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            {" "}
                                            <svg
                                                className="w-5 h-5 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                {" "}
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />{" "}
                                            </svg>{" "}
                                            <span className="font-medium">My Profile</span>{" "}
                                        </Link>{" "}
                                        <div className="border-t border-gray-100 my-1"></div>{" "}
                                        <button
                                            onClick={handleLogout}
                                            disabled={status === "loading"}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left disabled:opacity-50"
                                        >
                                            {" "}
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                {" "}
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                />{" "}
                                            </svg>{" "}
                                            <span className="font-medium">Logout</span>{" "}
                                        </button>{" "}
                                    </div>
                                )}{" "}
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm hover:shadow-md"
                            >
                                {" "}
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    {" "}
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                    />{" "}
                                </svg>{" "}
                                <span>Login</span>{" "}
                            </Link>
                        )}{" "}
                        {/* Mobile Menu Button */}{" "}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
                            aria-label="Toggle menu"
                        >
                            {" "}
                            {mobileMenuOpen ? (
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    {" "}
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />{" "}
                                </svg>
                            ) : (
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    {" "}
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />{" "}
                                </svg>
                            )}{" "}
                        </button>{" "}
                    </div>{" "}
                </div>{" "}
            </div>{" "}
            {/* Mobile Menu */}{" "}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white">
                    {" "}
                    <div className="px-4 py-3 space-y-1">
                        {" "}
                        {navLinks.map((link) => {
                            if (link.authRequired && !isAuthenticated) return null;
                            const isActive = isActivePath(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}
                                >
                                    {" "}
                                    {link.icon} <span>{link.label}</span>{" "}
                                </Link>
                            );
                        })}{" "}
                        {/* Mobile Auth Section */}{" "}
                        {isAuthenticated ? (
                            <>
                                {" "}
                                <div className="border-t border-gray-100 my-2 pt-2">
                                    {" "}
                                    <div className="flex items-center gap-3 px-4 py-2 text-gray-700">
                                        {" "}
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white text-sm font-semibold">
                                            {" "}
                                            {user?.name?.[0]?.toUpperCase() || "U"}{" "}
                                        </div>{" "}
                                        <div>
                                            {" "}
                                            <div className="text-sm font-semibold">
                                                {user?.name || "User"}
                                            </div>{" "}
                                            {user?.role && (
                                                <div className="text-xs text-gray-500 capitalize">
                                                    {user.role}
                                                </div>
                                            )}{" "}
                                        </div>{" "}
                                    </div>{" "}
                                </div>{" "}
                                <Link
                                    href="/profile"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all text-sm font-medium"
                                >
                                    {" "}
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        {" "}
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />{" "}
                                    </svg>{" "}
                                    <span>My Profile</span>{" "}
                                </Link>{" "}
                                <button
                                    onClick={handleLogout}
                                    disabled={status === "loading"}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all w-full text-left disabled:opacity-50 text-sm font-medium"
                                >
                                    {" "}
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        {" "}
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                        />{" "}
                                    </svg>{" "}
                                    <span>Logout</span>{" "}
                                </button>{" "}
                            </>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm mt-2"
                            >
                                {" "}
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    {" "}
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                    />{" "}
                                </svg>{" "}
                                <span>Login</span>{" "}
                            </Link>
                        )}{" "}
                    </div>{" "}
                </div>
            )}{" "}
        </nav>
    );
}
