export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {" "}
      <div className="text-center">
        {" "}
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mb-4"></div>{" "}
        <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>{" "}
        <p className="text-gray-500 mt-2">
          Please wait while we fetch your data
        </p>{" "}
      </div>{" "}
    </div>
  );
}
