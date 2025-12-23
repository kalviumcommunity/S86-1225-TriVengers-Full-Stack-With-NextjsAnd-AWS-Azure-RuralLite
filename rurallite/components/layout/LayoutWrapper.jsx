import Header from "./Header";
import Sidebar from "./Sidebar";

export default function LayoutWrapper({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto transition-colors duration-150">
          {children}
        </main>
      </div>
    </div>
  );
}
