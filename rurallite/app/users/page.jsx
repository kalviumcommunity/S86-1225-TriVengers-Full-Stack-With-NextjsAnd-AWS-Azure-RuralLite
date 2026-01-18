"use client";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useState } from "react";
import { mutate } from "swr";
import Navbar from "@/components/Navbar";

export default function UsersIndex() {
    const { data: users, error, isLoading } = useSWR("/api/users", fetcher, {
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        refreshInterval: 30000, // Refresh every 30 seconds
    });

    const [newUserName, setNewUserName] = useState("");
    const [newUserEmail, setNewUserEmail] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    // Handle optimistic user addition
    const handleAddUser = async (e) => {
        e.preventDefault();
        if (!newUserName.trim() || !newUserEmail.trim()) return;

        setIsAdding(true);

        // Optimistic update - add temporary user to UI
        const tempUser = {
            id: Date.now(),
            name: newUserName,
            email: newUserEmail,
            role: "student",
        };

        mutate(
            "/api/users",
            [...(users || []), tempUser],
            false // Don't revalidate immediately
        );

        try {
            // Actual API call
            await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
                body: JSON.stringify({
                    name: newUserName,
                    email: newUserEmail,
                    password: "defaultPassword123",
                    role: "student",
                }),
            });

            // Revalidate to get actual data from server
            mutate("/api/users");

            // Reset form
            setNewUserName("");
            setNewUserEmail("");
        } catch (error) {
            console.error("Failed to add user:", error);
            // Revert optimistic update on error
            mutate("/api/users");
        } finally {
            setIsAdding(false);
        }
    };

    if (error) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-10">
                    <div className="max-w-4xl mx-auto px-4">
                        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
                            <p className="text-red-600 font-bold text-lg">Failed to load users</p>
                            <p className="text-red-500 text-sm mt-2">{error.message}</p>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    if (isLoading) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-10">
                    <div className="max-w-4xl mx-auto px-4">
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
                                <p className="mt-6 text-slate-600 font-semibold text-lg">Loading users...</p>
                            </div>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-10">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="mb-10">
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-3">👥 Users</h1>
                        <p className="text-slate-600 text-lg">
                            This is a protected route. Click a user to view their profile.
                        </p>

                        {/* Add User Form */}
                        <form onSubmit={handleAddUser} className="bg-white border rounded-lg p-4 mb-6">
                            <h2 className="text-lg font-semibold mb-3">Add New User</h2>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    className="w-full border px-3 py-2 rounded"
                                    value={newUserName}
                                    onChange={(e) => setNewUserName(e.target.value)}
                                    placeholder="Enter user name"
                                    disabled={isAdding}
                                />
                                <input
                                    type="email"
                                    className="w-full border px-3 py-2 rounded"
                                    value={newUserEmail}
                                    onChange={(e) => setNewUserEmail(e.target.value)}
                                    placeholder="Enter user email"
                                    disabled={isAdding}
                                />
                                <button
                                    type="submit"
                                    disabled={isAdding}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {isAdding ? "Adding..." : "Add User"}
                                </button>
                            </div>
                        </form>

                        {/* User List */}
                        <ul className="space-y-3">
                            {users && users.length > 0 ? (
                                users.map((u) => (
                                    <li
                                        key={u.id}
                                        className="flex items-center justify-between bg-white border rounded-lg px-4 py-3"
                                    >
                                        <div>
                                            <span className="font-medium">{u.name}</span>
                                            <span className="text-gray-500 text-sm ml-2">({u.email})</span>
                                            {u.role && (
                                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                    {u.role}
                                                </span>
                                            )}
                                        </div>
                                        <Link
                                            href={`/users/${u.id}`}
                                            className="text-green-600 font-semibold hover:text-green-700"
                                        >
                                            View
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li className="text-center py-8 text-gray-500">No users found</li>
                            )}
                        </ul>
                    </div>
                </div>
            </main>
        </>
    );
} 