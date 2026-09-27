"use client";

import { useRouter } from "next/navigation";
import { ErrorState } from "@/components/states/error-state";

interface CatalogLoadErrorProps {
  title?: string;
  description?: string;
  className?: string;
}

function CatalogLoadError({
  title = "Unable to load content",
  description = "We could not reach the server. Check your connection and try again.",
  className,
}: CatalogLoadErrorProps) {
  const router = useRouter();

  return (
    <ErrorState
      className={className}
      title={title}
      description={description}
      onRetry={() => router.refresh()}
      retryLabel="Retry"
      homeAction={{ href: "/", label: "Go home" }}
    />
  );
}

export { CatalogLoadError };
