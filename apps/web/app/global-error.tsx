"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/states/error-state";
import { GLOBAL_FATAL_ERROR_COPY, logClientError } from "@/lib/states";
import { fontSans } from "./fonts";
import "./globals.css";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    logClientError(error, "global-error");
  }, [error]);

  return (
    <html lang="en" className={fontSans.variable}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <main className="flex min-h-screen items-center justify-center px-6 py-16">
          <div className="mx-auto w-full max-w-lg">
            <ErrorState
              title={GLOBAL_FATAL_ERROR_COPY.title}
              description={GLOBAL_FATAL_ERROR_COPY.description}
              onRetry={reset}
              retryLabel={GLOBAL_FATAL_ERROR_COPY.retryLabel}
              homeAction={{ href: "/", label: GLOBAL_FATAL_ERROR_COPY.homeLabel }}
              referenceId={error.digest}
            />
          </div>
        </main>
      </body>
    </html>
  );
}
