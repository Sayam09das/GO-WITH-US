"use client";

import { GripVertical, LoaderCircle, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  deleteItineraryItem,
  moveItineraryItem,
  type TripDetailDay,
  type TripDetailDayItem,
} from "@/lib/api/trips";
import { cn } from "@/lib/utils";

interface ItineraryDayItemProps {
  tripId: string;
  day: TripDetailDay;
  item: TripDetailDayItem;
  totalItems: number;
  allDays: TripDetailDay[];
  formatTime: (startTime: string | null, timeSlot: string) => string;
  onEdit: (item: TripDetailDayItem) => void;
  onChanged: () => void;
  isDragging?: boolean;
  isDropTarget?: boolean;
  onDragHandleStart: () => void;
  onDragHandleEnd: () => void;
  onDragEnterTarget: () => void;
  onDragLeaveTarget: () => void;
  onDropOnTarget: () => void;
}

function ItineraryDayItem({
  tripId,
  day,
  item,
  allDays,
  formatTime,
  onEdit,
  onChanged,
  isDragging = false,
  isDropTarget = false,
  onDragHandleStart,
  onDragHandleEnd,
  onDragEnterTarget,
  onDragLeaveTarget,
  onDropOnTarget,
}: ItineraryDayItemProps) {
  const [isBusy, setIsBusy] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function runAction(action: () => Promise<void>) {
    if (isBusy) {
      return;
    }

    setIsBusy(true);
    try {
      await action();
      onChanged();
    } catch {
      // Parent reload handles error state on next action.
    } finally {
      setIsBusy(false);
    }
  }

  async function confirmDelete() {
    setDeleteOpen(false);
    await runAction(() => deleteItineraryItem(tripId, day.id, item.id));
  }

  function handleMoveToDay(targetDayId: string) {
    if (targetDayId === day.id) {
      return;
    }

    const targetDay = allDays.find((entry) => entry.id === targetDayId);
    if (!targetDay) {
      return;
    }

    void runAction(() =>
      moveItineraryItem(tripId, item.id, {
        targetDayId,
        position: targetDay.items.length,
      }),
    );
  }

  return (
    <li
      className={cn(
        "relative pb-8 last:pb-0 transition-[opacity,background-color] duration-150",
        isDragging && "opacity-50",
        isDropTarget && "rounded-xl bg-muted/40",
      )}
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        onDragEnterTarget();
      }}
      onDragLeave={onDragLeaveTarget}
      onDrop={(event) => {
        event.preventDefault();
        onDropOnTarget();
      }}
    >
      <span
        aria-hidden="true"
        className="absolute -left-[0.4375rem] top-1 size-2 rounded-full bg-primary"
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-1 gap-3">
          <button
            type="button"
            draggable
            aria-label={`Drag to reorder ${item.title}`}
            disabled={isBusy}
            onDragStart={(event) => {
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/plain", item.id);
              onDragHandleStart();
            }}
            onDragEnd={onDragHandleEnd}
            className="mt-0.5 inline-flex size-9 shrink-0 cursor-grab items-center justify-center rounded-full text-muted-foreground hover:bg-muted/60 active:cursor-grabbing disabled:opacity-50"
          >
            <GripVertical aria-hidden="true" className="size-4" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-heading">
              {formatTime(item.startTime, item.timeSlot)}
              {item.endTime ? ` – ${item.endTime}` : null}
            </p>
            <p className="mt-1 text-base font-medium text-heading">{item.title}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">
              {item.type}
            </p>
            {item.notes ? <p className="mt-2 text-sm text-muted-foreground">{item.notes}</p> : null}
          </div>
        </div>

        <div
          className={cn(
            "flex flex-wrap items-center gap-1 sm:max-w-[10rem] sm:justify-end",
            isBusy && "opacity-60",
          )}
        >
          {isBusy ? (
            <LoaderCircle
              aria-hidden="true"
              className="size-4 animate-spin text-muted-foreground"
            />
          ) : null}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 rounded-full"
            aria-label={`Edit ${item.title}`}
            disabled={isBusy}
            onClick={() => onEdit(item)}
          >
            <Pencil aria-hidden="true" className="size-4" />
          </Button>

          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9 rounded-full text-destructive hover:text-destructive"
                aria-label={`Remove ${item.title}`}
                disabled={isBusy}
              >
                <Trash2 aria-hidden="true" className="size-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove this activity?</AlertDialogTitle>
                <AlertDialogDescription>
                  &ldquo;{item.title}&rdquo; will be removed from Day{" "}
                  {String(day.dayIndex).padStart(2, "0")}. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={(event) => {
                    event.preventDefault();
                    void confirmDelete();
                  }}
                >
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {allDays.length > 1 ? (
        <div className="mt-3 max-w-xs pl-12">
          <Select
            disabled={isBusy}
            onValueChange={(value) => {
              handleMoveToDay(value);
            }}
          >
            <SelectTrigger className="h-9 rounded-full text-xs" aria-label="Move to another day">
              <SelectValue placeholder="Move to another day" />
            </SelectTrigger>
            <SelectContent>
              {allDays
                .filter((entry) => entry.id !== day.id)
                .map((entry) => (
                  <SelectItem key={entry.id} value={entry.id}>
                    Day {String(entry.dayIndex).padStart(2, "0")}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}
    </li>
  );
}

export { ItineraryDayItem };
