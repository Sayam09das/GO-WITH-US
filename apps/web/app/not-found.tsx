import { MapPinOff } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { StateShell } from "@/components/states";
import { Button } from "@/components/ui/button";
import { buildNotFoundMetadata } from "@/lib/seo";
import { NOT_FOUND_COPY } from "@/lib/states";

export const metadata: Metadata = buildNotFoundMetadata();

export default function NotFoundPage() {
  return (
    <StateShell ariaLabel="Page not found">
      <div className="flex flex-col items-center gap-6 text-center">
        <div
          aria-hidden="true"
          className="flex size-14 items-center justify-center rounded-2xl bg-section text-primary"
        >
          <MapPinOff className="size-6" />
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="hero-heading text-3xl sm:text-4xl">{NOT_FOUND_COPY.title}</h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            {NOT_FOUND_COPY.description}
          </p>
        </div>

        <nav
          aria-label="Helpful links"
          className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center"
        >
          <Button asChild className="w-full sm:w-auto">
            <Link href="/destinations">{NOT_FOUND_COPY.primaryLabel}</Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/">{NOT_FOUND_COPY.secondaryLabel}</Link>
          </Button>
        </nav>
      </div>
    </StateShell>
  );
}
