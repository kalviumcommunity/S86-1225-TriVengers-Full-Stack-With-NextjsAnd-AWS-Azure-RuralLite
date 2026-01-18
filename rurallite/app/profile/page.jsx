"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import useSWR from "swr";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";
import { manualClearCache } from "@/lib/utils/cacheManager";

const fetcher = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch");
    const json = await res.json();
    return json.data;
};

export default function ProfilePage() {
    const { user, refreshUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: ""
    });
    const [loading, setLoading] = useState(false);

    // Fetch real analytics data
    const { data: quizHistory } = useSWR("/api/quiz-history", fetcher);
    const { data: progress } = useSWR("/api/progress", fetcher);

    // Calculate real statistics
    const stats = {
        lessonsCompleted: progress?.filter(p => p.completed)?.length || 0,
        quizzesTaken: quizHistory?.length || 0,
        averageScore: quizHistory?.length > 0
            ? Math.round(quizHistory.reduce((sum, quiz) => sum + quiz.percentage, 0) / quizHistory.length)
            : 0
    };

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || ""
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Update user profile API call would go here
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            // Refresh user data from server
            await refreshUser();
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            alert("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthGuard>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-beige-50 via-sky-50 to-teal-50">
                <div className="max-w-4xl mx-auto px-6 py-10">
                    {/* Header */}
                    <div className="mb-8">
                        <Link href="/dashboard">
                            <button className="flex items-center gap-2 text-orange-700 hover:text-orange-800 font-semibold mb-4">
                                <span className="text-xl">←</span>
                                <span>Back to Dashboard</span>
                            </button>
                        </Link>
                        <h1 className="text-4xl font-black text-orange-900">My Profile</h1>
                        <p className="text-slate-600 mt-2">Manage your account information</p>
                    </div>

                    {/* Profile Card */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Banner */}
                        <div className="bg-gradient-to-r from-orange-600 to-orange-500 h-32"></div>

                        {/* Profile Content */}
                        <div className="px-8 pb-8">
                            {/* Avatar */}
                            <div className="flex items-end justify-between -mt-16 mb-6">
                                <div className="bg-white rounded-full p-2 shadow-xl">
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-5xl font-black">
                                        {user?.name?.charAt(0).toUpperCase() || "?"}
                                    </div>
                                </div>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-all shadow-lg"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>

                            {!isEditing ? (
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">Name</label>
                                        <p className="text-2xl font-bold text-slate-900 mt-1">{user?.name || ""}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">Email</label>
                                        <p className="text-lg text-slate-700 mt-1">{user?.email || ""}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">Role</label>
                                        <p className="text-lg text-slate-700 mt-1">
                                            <span className="inline-flex items-center px-4 py-2 rounded-full bg-sky-100 text-sky-700 font-semibold">
                                                {user?.role || ""}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-all disabled:opacity-50"
                                        >
                                            {loading ? "Saving..." : "Save Changes"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setFormData({
                                                    name: user?.name || "",
                                                    email: user?.email || ""
                                                });
                                            }}
                                            className="flex-1 bg-white text-orange-700 px-6 py-3 rounded-lg font-semibold border-2 border-orange-300 hover:bg-orange-50 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Additional Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-orange-900 mb-4">Learning Stats</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Lessons Completed</span>
                                    <span className="font-bold text-orange-600 text-2xl">{stats.lessonsCompleted}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Quizzes Taken</span>
                                    <span className="font-bold text-sky-600 text-2xl">{stats.quizzesTaken}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Average Score</span>
                                    <span className="font-bold text-teal-600 text-2xl">{stats.averageScore}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-orange-900 mb-4">Account Settings</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={async () => {
                                        const confirmed = confirm('Are you sure you want to clear all cached data? This will reload the page with fresh data.');
                                        if (confirmed) {
                                            toast.loading('Clearing cache...');
                                            await manualClearCache();
                                            toast.success('Cache cleared! Reloading...');
                                        }
                                    }}
                                    className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:bg-orange-50 hover:border-orange-300 transition-all flex items-center justify-between"
                                >
                                    <span className="text-slate-700 font-medium">Clear Cache & Offline Data</span>
                                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                                <button className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:bg-orange-50 hover:border-orange-300 transition-all">
                                    <span className="text-slate-700 font-medium">Change Password</span>
                                </button>
                                <button className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:bg-orange-50 hover:border-orange-300 transition-all">
                                    <span className="text-slate-700 font-medium">Notification Settings</span>
                                </button>
                                <button className="w-full text-left px-4 py-3 rounded-lg border border-red-200 hover:bg-red-50 hover:border-red-300 transition-all">
                                    <span className="text-red-600 font-medium">Delete Account</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}