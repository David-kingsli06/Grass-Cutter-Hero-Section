import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700", "800"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SILVERCLAD — Precision Lawn Care",
  description:
    "A full-screen, scroll-driven visual experience showcasing precision engineering, calm cinematic motion, and quiet lawn care.",
};

export const viewport: Viewport = {
  themeColor: "#14190F",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark antialiased`}>
      <body className="min-h-screen bg-[#14190F] text-[#F4F1EA] font-sans selection:bg-[#A9B79A] selection:text-[#14190F]">
        {children}
      </body>
    </html>
  );
}
