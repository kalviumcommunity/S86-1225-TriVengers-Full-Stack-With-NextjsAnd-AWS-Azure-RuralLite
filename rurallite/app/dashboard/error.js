"use client";
export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      {" "}
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 max-w-lg text-center">
        {" "}
        <div className="text-6xl mb-4">🚨</div>{" "}
        <h2 className="text-2xl font-bold text-red-600 mb-3">
          {" "}
          Dashboard Error{" "}
        </h2>{" "}
        <p className="text-gray-700 mb-2">
          {" "}
          We encountered an issue loading your dashboard.{" "}
        </p>{" "}
        <p className="text-sm text-gray-600 mb-6 font-mono bg-red-100 p-3 rounded">
          {" "}
          {error.message || "Unknown error occurred"}{" "}
        </p>{" "}
        <div className="space-x-3">
          {" "}
          <button
            onClick={() => reset()}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            {" "}
            Try Again{" "}
          </button>{" "}
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {" "}
            Go Home{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
