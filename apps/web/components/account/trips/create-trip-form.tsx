"use client";

import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiRequestError } from "@/lib/api/client";
import { createTrip } from "@/lib/api/trips";
import { useAuthSession } from "@/lib/auth";

interface CreateTripFormProps {
  defaultTitle?: string;
  destinationId?: string;
  destinationLabel?: string;
}

function defaultStartDate(): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + 21);
  return date.toISOString().slice(0, 10);
}

function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function CreateTripForm({ defaultTitle, destinationId, destinationLabel }: CreateTripFormProps) {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuthSession();
  const initialStart = useMemo(() => defaultStartDate(), []);
  const [title, setTitle] = useState(defaultTitle ?? "");
  const [startDate, setStartDate] = useState(initialStart);
  const [endDate, setEndDate] = useState(addDays(initialStart, 5));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    if (trimmedTitle.length < 2) {
      setError("Give your trip a name (at least 2 characters).");
      return;
    }

    if (endDate < startDate) {
      setError("End date must be on or after the start date.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createTrip({
        title: trimmedTitle,
        destinationId,
        startDate,
        endDate,
      });
      router.push("/trips");
      router.refresh();
    } catch (cause) {
      if (cause instanceof ApiRequestError && cause.status === 401) {
        setError("Sign in to create a trip.");
        return;
      }

      setError(
        cause instanceof ApiRequestError
          ? cause.message
          : "We couldn't create your trip right now. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isAuthLoading) {
    return (
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
        Checking your session…
      </div>
    );
  }

  if (!user) {
    const next = destinationId
      ? `/trips/new?destinationId=${destinationId}&title=${encodeURIComponent(defaultTitle ?? "")}`
      : "/trips/new";

    return (
      <div className="rounded-[1.25rem] border border-border/60 bg-background p-6">
        <p className="text-sm text-muted-foreground">
          Sign in to start planning. Your destination and dates will stay on this page.
        </p>
        <Button asChild className="mt-4">
          <Link href={`/sign-in?next=${encodeURIComponent(next)}`}>Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className="max-w-xl space-y-5 rounded-[1.25rem] border border-border/60 bg-background p-6 shadow-sm"
    >
      {destinationLabel ? (
        <p className="text-sm text-muted-foreground">
          Destination: <span className="font-medium text-heading">{destinationLabel}</span>
        </p>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="trip-title">Trip name</Label>
        <Input
          id="trip-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Summer in Mexico City"
          required
          minLength={2}
          maxLength={160}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="trip-start">Start date</Label>
          <Input
            id="trip-start"
            type="date"
            value={startDate}
            onChange={(event) => {
              const nextStart = event.target.value;
              setStartDate(nextStart);
              if (endDate < nextStart) {
                setEndDate(addDays(nextStart, 1));
              }
            }}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="trip-end">End date</Label>
          <Input
            id="trip-end"
            type="date"
            value={endDate}
            min={startDate}
            onChange={(event) => setEndDate(event.target.value)}
            required
          />
        </div>
      </div>

      {error ? (
        <p className="text-sm text-destructive">
          {error}{" "}
          {error.includes("Sign in") ? (
            <Link
              href="/sign-in?next=%2Ftrips%2Fnew"
              className="font-medium underline underline-offset-4"
            >
              Sign in
            </Link>
          ) : null}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
              Creating…
            </>
          ) : (
            "Create trip"
          )}
        </Button>
        <Button asChild variant="outline">
          <Link href="/trips">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}

export { CreateTripForm };
