export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {" "}
      <div className="animate-pulse space-y-6">
        {" "}
        {/* Header Skeleton */}{" "}
        <div className="h-9 bg-gray-200 rounded w-1/5"></div>{" "}
        {/* Quizzes List Skeleton */}{" "}
        <div className="space-y-4">
          {" "}
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border rounded-lg p-4 space-y-3">
              {" "}
              <div className="h-6 bg-gray-200 rounded w-2/3"></div>{" "}
              <div className="h-4 bg-gray-100 rounded w-full"></div>{" "}
              <div className="h-4 bg-gray-100 rounded w-4/5"></div>{" "}
              <div className="flex items-center justify-between mt-3">
                {" "}
                <div className="h-4 bg-gray-100 rounded w-1/4"></div>{" "}
                <div className="h-10 bg-gray-200 rounded w-28"></div>{" "}
              </div>{" "}
            </div>
          ))}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
