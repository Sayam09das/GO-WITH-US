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
import { type TripDetailDayItem, updateItineraryItem } from "@/lib/api/trips";

interface EditItineraryItemDialogProps {
  tripId: string;
  dayId: string;
  item: TripDetailDayItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

function EditItineraryItemDialog({
  tripId,
  dayId,
  item,
  open,
  onOpenChange,
  onSaved,
}: EditItineraryItemDialogProps) {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCustom = item?.type === "custom";

  useEffect(() => {
    if (!item || !open) {
      return;
    }

    setTitle(item.title);
    setStartTime(item.startTime ?? "");
    setEndTime(item.endTime ?? "");
    setNotes(item.notes ?? "");
    setError(null);
  }, [item, open]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!item) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await updateItineraryItem(tripId, dayId, item.id, {
        ...(isCustom ? { title: title.trim() || item.title } : {}),
        startTime: startTime.trim() ? startTime : null,
        endTime: endTime.trim() ? endTime : null,
        notes: notes.trim() ? notes.trim() : null,
      });
      onOpenChange(false);
      onSaved();
    } catch {
      setError("We couldn't update this activity. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit activity</DialogTitle>
          <DialogDescription>
            {isCustom
              ? "Update the title, time, and notes for this stop."
              : "Adjust the schedule and notes for this catalog item."}
          </DialogDescription>
        </DialogHeader>

        {item ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isCustom ? (
              <div className="rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {item.type}
                </p>
                <p className="mt-1 font-medium text-heading">{item.title}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-itinerary-title">Activity</Label>
                <Input
                  id="edit-itinerary-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                />
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-itinerary-start">Start time</Label>
                <Input
                  id="edit-itinerary-start"
                  type="time"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-itinerary-end">End time</Label>
                <Input
                  id="edit-itinerary-end"
                  type="time"
                  value={endTime}
                  onChange={(event) => setEndTime(event.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-itinerary-notes">Notes</Label>
              <Textarea
                id="edit-itinerary-notes"
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
                    Saving…
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export { EditItineraryItemDialog };
