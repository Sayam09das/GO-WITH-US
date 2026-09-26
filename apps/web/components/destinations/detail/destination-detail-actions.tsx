"use client";

import { Bookmark, CalendarPlus, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ApiRequestError } from "@/lib/api/client";
import { saveDestination, unsaveDestination } from "@/lib/api/users";

interface DestinationDetailActionsProps {
  destinationId: string;
  destinationTitle: string;
  initialSaved: boolean;
  primaryStaySlug?: string;
  primaryExperienceSlug?: string;
}

function buildPlanTripHref(destinationId: string, destinationTitle: string): string {
  const title = encodeURIComponent(`Trip to ${destinationTitle}`);
  return `/trips/new?destinationId=${destinationId}&title=${title}&destination=${encodeURIComponent(destinationTitle)}`;
}

function buildStayBookingHref(staySlug: string): string {
  return `/stays/${staySlug}#request-booking`;
}

function DestinationDetailActions({
  destinationId,
  destinationTitle,
  initialSaved,
  primaryStaySlug,
  primaryExperienceSlug,
}: DestinationDetailActionsProps) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggleSave() {
    setIsPending(true);
    setError(null);

    try {
      if (isSaved) {
        await unsaveDestination(destinationId);
        setIsSaved(false);
      } else {
        await saveDestination(destinationId);
        setIsSaved(true);
      }
    } catch (cause) {
      if (cause instanceof ApiRequestError && cause.status === 401) {
        setError("Sign in to save this destination.");
        return;
      }
      setError("We couldn't update your saved places.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <Button
        type="button"
        variant={isSaved ? "secondary" : "default"}
        className="min-h-11"
        disabled={isPending}
        onClick={() => void toggleSave()}
      >
        {isPending ? (
          <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
        ) : (
          <Bookmark aria-hidden="true" className={isSaved ? "size-4 fill-current" : "size-4"} />
        )}
        {isSaved ? "Saved" : "Save destination"}
      </Button>

      <Button asChild variant="outline" className="min-h-11">
        <Link href={buildPlanTripHref(destinationId, destinationTitle)}>
          <CalendarPlus aria-hidden="true" className="size-4" />
          Plan a trip
        </Link>
      </Button>

      {primaryStaySlug ? (
        <Button asChild className="min-h-11">
          <Link href={buildStayBookingHref(primaryStaySlug)}>Book a stay</Link>
        </Button>
      ) : null}

      {!primaryStaySlug && primaryExperienceSlug ? (
        <Button asChild className="min-h-11">
          <Link href={`/experiences/${primaryExperienceSlug}#request-booking`}>
            Book an experience
          </Link>
        </Button>
      ) : null}

      {error ? (
        <p className="w-full text-sm text-destructive">
          {error}{" "}
          {error.includes("Sign in") ? (
            <Link href="/sign-in" className="font-medium underline underline-offset-4">
              Sign in
            </Link>
          ) : null}
        </p>
      ) : (
        <p className="sr-only">Actions for {destinationTitle}</p>
      )}
    </div>
  );
}

export { DestinationDetailActions };
