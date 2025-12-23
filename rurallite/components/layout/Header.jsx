"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { useUI } from "../../hooks/useUI";

export default function Header() {
  const router = useRouter();
  const { toggleSidebar, toggleTheme, theme } = useUI();
  const { isAuthenticated, user, logout, status } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="w-full bg-blue-600 text-white px-6 py-3 flex items-center gap-4">
      <button
        type="button"
        onClick={toggleSidebar}
        className="inline-flex items-center justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20"
      >
        Menu
      </button>
      <h1 className="font-semibold text-lg flex-1">RuralLite</h1>
      <nav className="hidden md:flex gap-4 items-center">
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/users">Users</Link>
      </nav>
      <button
        type="button"
        onClick={toggleTheme}
        className="inline-flex items-center justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20"
      >
        {theme === "dark" ? "Light" : "Dark"} mode
      </button>
      {isAuthenticated ? (
        <div className="flex items-center gap-2">
          <span className="text-sm">{user?.name ?? "Logged in"}</span>
          <button
            type="button"
            onClick={handleLogout}
            disabled={status === "loading"}
            className="rounded-md bg-white text-blue-600 px-3 py-2 text-sm font-semibold hover:bg-gray-100 disabled:opacity-60"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link
          href="/login"
          className="rounded-md bg-white text-blue-600 px-3 py-2 text-sm font-semibold hover:bg-gray-100"
        >
          Login
        </Link>
      )}
    </header>
  );
}
