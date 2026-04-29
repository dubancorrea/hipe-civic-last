import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SessionProvider from "@/components/SessionProvider";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "700", "800", "900"] });

export const metadata: Metadata = {
  title: "HIPE Civic",
  description: "Volunteerism, civic engagement, and advocacy for CUNY students.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-black antialiased min-h-screen`}>
        <SessionProvider>
          <Navbar />
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
