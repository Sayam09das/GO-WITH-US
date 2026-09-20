"use client";

import { useEffect } from "react";
import { ErrorState, StateShell } from "@/components/states";
import { GLOBAL_ERROR_COPY, logClientError } from "@/lib/states";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    logClientError(error, "route-error");
  }, [error]);

  return (
    <StateShell ariaLabel="Error">
      <ErrorState
        title={GLOBAL_ERROR_COPY.title}
        description={GLOBAL_ERROR_COPY.description}
        onRetry={reset}
        retryLabel={GLOBAL_ERROR_COPY.retryLabel}
        homeAction={{ href: "/", label: GLOBAL_ERROR_COPY.homeLabel }}
        referenceId={error.digest}
      />
    </StateShell>
  );
}
