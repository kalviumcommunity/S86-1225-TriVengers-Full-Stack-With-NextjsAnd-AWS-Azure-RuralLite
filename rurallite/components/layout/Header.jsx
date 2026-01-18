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
    <header className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-3 flex items-center gap-4 shadow-lg">
      {" "}
      <button
        type="button"
        onClick={toggleSidebar}
        className="inline-flex items-center justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20 transition"
      >
        {" "}
        Menu{" "}
      </button>{" "}
      <h1 className="font-bold text-xl flex-1">RuralLite</h1>{" "}
      <nav className="hidden md:flex gap-4 items-center">
        {" "}
        <Link href="/" className="hover:text-orange-100 transition">
          Home
        </Link>{" "}
        <Link href="/dashboard" className="hover:text-orange-100 transition">
          Dashboard
        </Link>{" "}
        <Link href="/subjects" className="hover:text-orange-100 transition">
          Subjects
        </Link>{" "}
        <Link href="/quizzes" className="hover:text-orange-100 transition">
          Quizzes
        </Link>{" "}
        <Link href="/notes" className="hover:text-orange-100 transition">
          Notes
        </Link>{" "}
        {/* Only show Users link for admin/editor */}{" "}
        {(() => {
          const allowed = ["admin", "editor"].includes(user?.role);
          if (typeof window !== "undefined") {
            console.log(
              `[RBAC-UI] ${user?.role || "unknown"} access to Users link: ${allowed ? "ALLOWED" : "DENIED"}`
            );
          }
          return allowed ? (
            <Link href="/users" className="hover:text-orange-100 transition">
              Users
            </Link>
          ) : null;
        })()}{" "}
      </nav>{" "}
      <button
        type="button"
        onClick={toggleTheme}
        className="inline-flex items-center justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20 transition"
      >
        {" "}
        {theme === "dark" ? "Light" : "Dark"} mode{" "}
      </button>{" "}
      {isAuthenticated ? (
        <div className="flex items-center gap-2">
          {" "}
          <span className="text-sm">{user?.name ?? "Logged in"}</span>{" "}
          {user?.role && (
            <span className="text-xs bg-orange-800 text-white px-2 py-1 rounded ml-2">
              {user.role}
            </span>
          )}{" "}
          <button
            type="button"
            onClick={handleLogout}
            disabled={status === "loading"}
            className="rounded-md bg-white text-orange-600 px-3 py-2 text-sm font-semibold hover:bg-orange-50 transition disabled:opacity-60"
          >
            {" "}
            Logout{" "}
          </button>{" "}
        </div>
      ) : (
        <Link
          href="/login"
          className="rounded-md bg-white text-orange-600 px-3 py-2 text-sm font-semibold hover:bg-orange-50 transition"
        >
          {" "}
          Login{" "}
        </Link>
      )}{" "}
    </header>
  );
}
