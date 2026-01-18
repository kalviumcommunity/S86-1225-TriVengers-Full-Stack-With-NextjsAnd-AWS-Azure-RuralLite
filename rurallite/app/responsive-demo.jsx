import ThemeToggle from "../components/ThemeToggle";
export default function ResponsiveDemo() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-900 transition-colors">
      {" "}
      <ThemeToggle />{" "}
      <div className="p-4 md:p-8 lg:p-12 w-full max-w-2xl">
        {" "}
        <h1 className="text-lg md:text-2xl lg:text-3xl font-semibold mb-4 text-brand">
          {" "}
          Responsive & Themed Demo{" "}
        </h1>{" "}
        <p className="mb-2">
          {" "}
          Resize the window or toggle dark mode to see the effect.{" "}
        </p>{" "}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {" "}
          <div className="bg-brand-light p-4 rounded shadow">
            {" "}
            <p>Box 1</p>{" "}
          </div>{" "}
          <div className="bg-brand p-4 rounded shadow">
            {" "}
            <p>Box 2</p>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
