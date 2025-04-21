import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gemini Chat",
  description: "Chat with Google's Gemini AI model",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white">{children}</body>
    </html>
  );
}
