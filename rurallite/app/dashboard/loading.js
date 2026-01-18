export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {" "}
      <div className="max-w-7xl mx-auto">
        {" "}
        <div className="animate-pulse space-y-6">
          {" "}
          {/* Header Skeleton */}{" "}
          <div className="flex items-center justify-between">
            {" "}
            <div className="h-10 bg-gray-200 rounded w-1/4"></div>{" "}
            <div className="h-10 bg-gray-200 rounded w-32"></div>{" "}
          </div>{" "}
          {/* Welcome Card Skeleton */}{" "}
          <div className="bg-white rounded-lg shadow p-6 space-y-3">
            {" "}
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>{" "}
            <div className="h-4 bg-gray-100 rounded w-2/3"></div>{" "}
          </div>{" "}
          {/* Stats Grid Skeleton */}{" "}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {" "}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 space-y-3">
                {" "}
                <div className="h-5 bg-gray-200 rounded w-1/2"></div>{" "}
                <div className="h-10 bg-gray-100 rounded w-1/3"></div>{" "}
              </div>
            ))}{" "}
          </div>{" "}
          {/* Recent Activity Skeleton */}{" "}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            {" "}
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>{" "}
            <div className="space-y-3">
              {" "}
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  {" "}
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>{" "}
                  <div className="flex-1 space-y-2">
                    {" "}
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>{" "}
                    <div className="h-3 bg-gray-100 rounded w-1/3"></div>{" "}
                  </div>{" "}
                </div>
              ))}{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
