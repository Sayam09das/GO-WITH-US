import type { Metadata } from "next";
import { AppProviders } from "@/components/providers";
import { fontDisplay, fontSans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "GO WITH US — Travel Discovery & Trip Planning",
  description:
    "Discover destinations, explore stays and experiences, save places, and build personalized day-by-day travel itineraries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontDisplay.variable}`}>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
