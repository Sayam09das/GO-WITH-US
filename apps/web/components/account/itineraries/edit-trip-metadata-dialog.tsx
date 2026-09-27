"use client";

import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ApiRequestError } from "@/lib/api/client";
import { type TripDetailResponse, updateTrip } from "@/lib/api/trips";

interface EditTripMetadataDialogProps {
  trip: TripDetailResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

function EditTripMetadataDialog({
  trip,
  open,
  onOpenChange,
  onSaved,
}: EditTripMetadataDialogProps) {
  const [title, setTitle] = useState(trip.title);
  const [startDate, setStartDate] = useState(trip.startDate ?? "");
  const [endDate, setEndDate] = useState(trip.endDate ?? "");
  const [description, setDescription] = useState(trip.description ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setTitle(trip.title);
    setStartDate(trip.startDate ?? "");
    setEndDate(trip.endDate ?? "");
    setDescription(trip.description ?? "");
    setError(null);
  }, [open, trip]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    if (trimmedTitle.length < 2) {
      setError("Trip name must be at least 2 characters.");
      return;
    }

    if (startDate && endDate && endDate < startDate) {
      setError("End date must be on or after the start date.");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateTrip(trip.id, {
        title: trimmedTitle,
        description: description.trim() ? description.trim() : null,
        startDate: startDate.trim() ? startDate : null,
        endDate: endDate.trim() ? endDate : null,
      });
      onOpenChange(false);
      onSaved();
    } catch (cause) {
      if (cause instanceof ApiRequestError) {
        setError(cause.message);
      } else {
        setError("We couldn't update this trip. Try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit trip details</DialogTitle>
          <DialogDescription>
            Update the name, dates, and notes for this itinerary. Destination links stay tied to the
            trip record.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="trip-edit-title">Trip name</Label>
            <Input
              id="trip-edit-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="trip-edit-start">Start date</Label>
              <Input
                id="trip-edit-start"
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="trip-edit-end">End date</Label>
              <Input
                id="trip-edit-end"
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="trip-edit-description">Notes (optional)</Label>
            <Textarea
              id="trip-edit-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              placeholder="Travel goals, companions, reminders…"
            />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <DialogFooter>
            <Button type="submit" className="rounded-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save trip"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { EditTripMetadataDialog };
