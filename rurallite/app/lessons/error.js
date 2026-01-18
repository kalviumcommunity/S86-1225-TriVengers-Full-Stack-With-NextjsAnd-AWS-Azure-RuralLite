"use client";
import { BookOpenIcon } from "@heroicons/react/24/outline";
export default function Error({ error, reset }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {" "}
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        {" "}
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 max-w-md">
          {" "}
          <BookOpenIcon className="h-16 w-16 text-orange-500 mx-auto mb-4" />{" "}
          <h2 className="text-2xl font-bold text-red-600 mb-3">
            {" "}
            Failed to Load Lessons{" "}
          </h2>{" "}
          <p className="text-gray-700 mb-2">
            {" "}
            We encountered an error while fetching the lessons.{" "}
          </p>{" "}
          <p className="text-sm text-gray-600 mb-6 font-mono bg-red-100 p-2 rounded">
            {" "}
            {error.message || "Unknown error occurred"}{" "}
          </p>{" "}
          <button
            onClick={() => reset()}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            {" "}
            Retry Loading{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
