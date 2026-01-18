export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {" "}
      {/* Header Skeleton */}{" "}
      <div className="animate-pulse space-y-6">
        {" "}
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>{" "}
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>{" "}
        {/* Form Skeleton */}{" "}
        <div className="bg-white border rounded-lg p-4 space-y-3">
          {" "}
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>{" "}
          <div className="h-10 bg-gray-100 rounded"></div>{" "}
          <div className="h-10 bg-gray-100 rounded"></div>{" "}
          <div className="h-10 bg-gray-200 rounded w-32"></div>{" "}
        </div>{" "}
        {/* User List Skeleton */}{" "}
        <div className="space-y-3">
          {" "}
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-white border rounded-lg px-4 py-3"
            >
              {" "}
              <div className="flex-1 space-y-2">
                {" "}
                <div className="h-5 bg-gray-200 rounded w-1/4"></div>{" "}
                <div className="h-4 bg-gray-100 rounded w-1/3"></div>{" "}
              </div>{" "}
              <div className="h-8 bg-gray-200 rounded w-16"></div>{" "}
            </div>
          ))}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
