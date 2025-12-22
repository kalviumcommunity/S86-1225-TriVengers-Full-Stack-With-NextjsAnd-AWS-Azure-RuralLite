import Link from "next/link";

export default function UsersIndex() {
  const sampleUsers = [
    { id: 1, name: "User 1" },
    { id: 2, name: "User 2" },
    { id: 3, name: "User 3" },
  ];

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      <p className="text-gray-600 mb-4">
        This is a protected route. Click a user to view their profile.
      </p>
      <ul className="space-y-3">
        {sampleUsers.map((u) => (
          <li
            key={u.id}
            className="flex items-center justify-between bg-white border rounded-lg px-4 py-3"
          >
            <span>{u.name}</span>
            <Link
              href={`/users/${u.id}`}
              className="text-green-600 font-semibold hover:text-green-700"
            >
              View
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
