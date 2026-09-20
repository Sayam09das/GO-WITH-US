import type { Metadata } from "next";
import Link from "next/link";
import { buildNotFoundMetadata } from "@/lib/seo";

export const metadata: Metadata = buildNotFoundMetadata();

export default function NotFoundPage() {
  return (
    <main className="container-travel flex min-h-screen flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <h1 className="hero-heading text-3xl sm:text-4xl">Page not found</h1>
      <p className="max-w-md text-muted-foreground">
        This page isn&apos;t here — but there are plenty of places worth discovering.
      </p>
      <nav aria-label="Helpful links" className="flex flex-wrap items-center justify-center gap-4">
        <Link href="/" className="nav-link text-primary underline-offset-4 hover:underline">
          Back to home
        </Link>
        <Link
          href="/destinations"
          className="nav-link text-primary underline-offset-4 hover:underline"
        >
          Browse destinations
        </Link>
      </nav>
    </main>
  );
}
