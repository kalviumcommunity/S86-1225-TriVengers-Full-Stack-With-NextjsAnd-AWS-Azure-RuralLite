import Link from "next/link";

export default async function UserProfile({ params }) {
  const { id } = params;
  // Example: In a real app, fetch user using id
  const user = { id, name: `User ${id}` };

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-600 mb-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/users" className="hover:underline">
          Users
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{user.name}</span>
      </nav>
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <div className="bg-white border rounded-lg p-6">
        <p className="mb-2">
          <span className="font-semibold">ID:</span> {user.id}
        </p>
        <p>
          <span className="font-semibold">Name:</span> {user.name}
        </p>
      </div>
      <div className="mt-6">
        <Link href="/users" className="text-green-600 hover:text-green-700">
          ← Back to Users
        </Link>
      </div>
    </main>
  );
}
