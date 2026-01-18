"use client";
import Link from "next/link";
import { useUI } from "../../hooks/useUI";
import { useAuth } from "../../hooks/useAuth";
export default function Sidebar() {
  const { sidebarOpen } = useUI();
  const { user } = useAuth();
  if (!sidebarOpen) return null;
  return (
    <aside className="w-64 h-full bg-gray-100 border-r p-4">
      {" "}
      <h2 className="text-lg font-bold mb-4">Navigation</h2>{" "}
      <ul className="space-y-2">
        {" "}
        <li>
          {" "}
          <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
            Overview
          </Link>{" "}
        </li>{" "}
        <li>
          {" "}
          <Link href="/subjects" className="text-gray-700 hover:text-blue-600">
            Browse Subjects
          </Link>{" "}
        </li>{" "}
        {/* Only admin/editor can see Users and Lessons */}{" "}
        {(() => {
          const allowed = ["admin", "editor"].includes(user?.role);
          if (typeof window !== "undefined") {
            console.log(
              `[RBAC-UI] ${user?.role || "unknown"} access to Users/Lessons links: ${allowed ? "ALLOWED" : "DENIED"}`
            );
          }
          return allowed ? (
            <>
              {" "}
              <li>
                {" "}
                <Link
                  href="/users"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Users
                </Link>{" "}
              </li>{" "}
              <li>
                {" "}
                <Link
                  href="/lessons"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Lessons
                </Link>{" "}
              </li>{" "}
            </>
          ) : null;
        })()}{" "}
        <li>
          {" "}
          <Link href="/quizzes" className="text-gray-700 hover:text-blue-600">
            Quizzes
          </Link>{" "}
        </li>{" "}
        <li>
          {" "}
          <Link href="/notes" className="text-gray-700 hover:text-blue-600">
            Notes
          </Link>{" "}
        </li>{" "}
      </ul>{" "}
    </aside>
  );
}
