"use client";
export default function Error({ error, reset }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {" "}
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        {" "}
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 max-w-md">
          {" "}
          <div className="text-6xl mb-4">❓</div>{" "}
          <h2 className="text-2xl font-bold text-red-600 mb-3">
            {" "}
            Quiz Loading Failed{" "}
          </h2>{" "}
          <p className="text-gray-700 mb-2">
            {" "}
            Unable to fetch quizzes. Please try again.{" "}
          </p>{" "}
          <p className="text-sm text-gray-600 mb-6 font-mono bg-red-100 p-2 rounded">
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
              Retry{" "}
            </button>{" "}
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {" "}
              Refresh Page{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
