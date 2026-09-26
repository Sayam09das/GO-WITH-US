"use client";

import { LoaderCircle, Plus } from "lucide-react";
import { useState } from "react";
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
import { addItineraryItem } from "@/lib/api/trips";

interface AddItineraryItemDialogProps {
  tripId: string;
  dayId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdded: () => void;
}

function AddItineraryItemDialog({
  tripId,
  dayId,
  open,
  onOpenChange,
  onAdded,
}: AddItineraryItemDialogProps) {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("09:30");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Add a title for this activity.");
      return;
    }

    setIsSubmitting(true);

    try {
      await addItineraryItem(tripId, dayId, {
        type: "custom",
        title: title.trim(),
        startTime,
        notes: notes.trim() || undefined,
      });
      setTitle("");
      setNotes("");
      onOpenChange(false);
      onAdded();
    } catch {
      setError("We couldn't add this to your itinerary. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to itinerary</DialogTitle>
          <DialogDescription>
            Add a custom stop for this day. You can link saved destinations and stays from discovery
            in a later update.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="itinerary-item-title">Activity</Label>
            <Input
              id="itinerary-item-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Explore Gion"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="itinerary-item-time">Start time</Label>
            <Input
              id="itinerary-item-time"
              type="time"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="itinerary-item-notes">Notes (optional)</Label>
            <Textarea
              id="itinerary-item-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
            />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <DialogFooter>
            <Button type="submit" className="rounded-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                  Adding…
                </>
              ) : (
                <>
                  <Plus aria-hidden="true" className="size-4" />
                  Add to day
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { AddItineraryItemDialog };
