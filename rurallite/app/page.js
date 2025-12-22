import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-blue-50 flex items-center justify-center">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-extrabold text-gray-900 mb-6">
            RuralLite Learning Platform
          </h1>
          <p className="text-2xl text-gray-600 mb-10">
            Offline-First Educational Web App for Low-Bandwidth Rural Schools
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/signup">
              <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                Get Started
              </button>
            </Link>
            <Link href="/login">
              <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold border-2 border-green-600 hover:bg-green-50 transition">
                Login
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
