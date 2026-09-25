"use client";

import { CalendarDays, CheckCircle2, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBooking } from "@/lib/api/bookings";
import { ApiRequestError } from "@/lib/api/client";

type BookingRequestFormProps = {
  type: "STAY" | "EXPERIENCE";
  itemId: string;
  itemName: string;
};

function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function defaultCheckIn(): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + 14);
  return date.toISOString().slice(0, 10);
}

export function BookingRequestForm({ type, itemId, itemName }: BookingRequestFormProps) {
  const initialCheckIn = defaultCheckIn();
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(addDays(initialCheckIn, 3));
  const [experienceDate, setExperienceDate] = useState(initialCheckIn);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createBooking({
        type,
        stayId: type === "STAY" ? itemId : undefined,
        experienceId: type === "EXPERIENCE" ? itemId : undefined,
        checkIn: type === "STAY" ? checkIn : undefined,
        checkOut: type === "STAY" ? checkOut : undefined,
        experienceDate: type === "EXPERIENCE" ? experienceDate : undefined,
        guests: { adults, children },
        idempotencyKey: crypto.randomUUID(),
      });

      setReference(result.booking.reference);
    } catch (cause) {
      if (cause instanceof ApiRequestError && cause.status === 401) {
        setError("Sign in to request a booking.");
        return;
      }

      setError("We couldn't create your booking right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (reference) {
    return (
      <div className="rounded-[1.25rem] border border-border/60 bg-background p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 text-primary" />
          <div className="space-y-2">
            <p className="font-semibold text-heading">Booking request received</p>
            <p className="text-sm text-muted-foreground">
              Reference <span className="font-medium text-heading">{reference}</span> for {itemName}
              .
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/account/bookings">View bookings</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[1.25rem] border border-border/60 bg-background p-5 shadow-sm"
    >
      <div className="flex items-center gap-2">
        <CalendarDays aria-hidden="true" className="size-4 text-primary" />
        <h2 className="text-lg font-semibold text-heading">Request a booking</h2>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Choose your dates and guest count. We&apos;ll confirm availability before anything is
        finalized.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {type === "STAY" ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="check-in">Check in</Label>
              <Input
                id="check-in"
                type="date"
                value={checkIn}
                onChange={(event) => {
                  const nextCheckIn = event.target.value;
                  setCheckIn(nextCheckIn);
                  if (checkOut <= nextCheckIn) {
                    setCheckOut(addDays(nextCheckIn, 1));
                  }
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="check-out">Check out</Label>
              <Input
                id="check-out"
                type="date"
                value={checkOut}
                min={addDays(checkIn, 1)}
                onChange={(event) => setCheckOut(event.target.value)}
                required
              />
            </div>
          </>
        ) : (
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="experience-date">Experience date</Label>
            <Input
              id="experience-date"
              type="date"
              value={experienceDate}
              onChange={(event) => setExperienceDate(event.target.value)}
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="adults">Adults</Label>
          <Input
            id="adults"
            type="number"
            min={1}
            max={20}
            value={adults}
            onChange={(event) => setAdults(Number.parseInt(event.target.value, 10) || 1)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="children">Children</Label>
          <Input
            id="children"
            type="number"
            min={0}
            max={10}
            value={children}
            onChange={(event) => setChildren(Number.parseInt(event.target.value, 10) || 0)}
          />
        </div>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-destructive">
          {error}{" "}
          {error.includes("Sign in") ? (
            <Link href="/sign-in" className="font-medium underline underline-offset-4">
              Sign in
            </Link>
          ) : null}
        </p>
      ) : null}

      <Button type="submit" className="mt-5 w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
            Submitting…
          </>
        ) : (
          "Request booking"
        )}
      </Button>
    </form>
  );
}
