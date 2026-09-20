import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GO WITH US",
  description: "Premium travel discovery and trip planning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
