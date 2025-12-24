import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "RuralLite",
  description: "RuralLite Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* Global Toast Provider */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
          }}
        />
      </body>
    </html>
  );
}
