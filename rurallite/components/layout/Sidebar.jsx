"use client";
import Link from "next/link";
import { useUI } from "../../hooks/useUI";

export default function Sidebar() {
  const { sidebarOpen } = useUI();
  const links = [
    { href: "/dashboard", label: "Overview" },
    { href: "/users", label: "Users" },
    { href: "/lessons", label: "Lessons" },
    { href: "/quizzes", label: "Quizzes" },
    { href: "/notes", label: "Notes" },
  ];

  if (!sidebarOpen) return null;

  return (
    <aside className="w-64 h-full bg-gray-100 border-r p-4">
      <h2 className="text-lg font-bold mb-4">Navigation</h2>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-gray-700 hover:text-blue-600"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
