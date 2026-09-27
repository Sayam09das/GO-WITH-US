"use client";

import { useCallback, useEffect, useState } from "react";
import { ItineraryDayItem } from "@/components/account/itineraries/itinerary-day-item";
import { reorderItineraryItems, type TripDetailDay, type TripDetailDayItem } from "@/lib/api/trips";
import { cn } from "@/lib/utils";

interface ItineraryDayTimelineProps {
  tripId: string;
  day: TripDetailDay;
  allDays: TripDetailDay[];
  items: TripDetailDayItem[];
  formatTime: (startTime: string | null, timeSlot: string) => string;
  onEdit: (item: TripDetailDayItem) => void;
  onChanged: () => void;
}

function reorderList(
  list: TripDetailDayItem[],
  draggedId: string,
  targetId: string,
): TripDetailDayItem[] {
  if (draggedId === targetId) {
    return list;
  }

  const fromIndex = list.findIndex((entry) => entry.id === draggedId);
  const toIndex = list.findIndex((entry) => entry.id === targetId);
  if (fromIndex < 0 || toIndex < 0) {
    return list;
  }

  const next = [...list];
  const [moved] = next.splice(fromIndex, 1);
  if (!moved) {
    return list;
  }

  next.splice(toIndex, 0, moved);
  return next;
}

function ItineraryDayTimeline({
  tripId,
  day,
  allDays,
  items,
  formatTime,
  onEdit,
  onChanged,
}: ItineraryDayTimelineProps) {
  const [orderedItems, setOrderedItems] = useState(items);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  useEffect(() => {
    setOrderedItems(items);
  }, [items]);

  const persistOrder = useCallback(
    async (nextItems: TripDetailDayItem[], rollback: TripDetailDayItem[]) => {
      setIsReordering(true);
      setOrderedItems(nextItems);

      try {
        await reorderItineraryItems(
          tripId,
          day.id,
          nextItems.map((entry, position) => ({ id: entry.id, position })),
        );
        onChanged();
      } catch {
        setOrderedItems(rollback);
      } finally {
        setIsReordering(false);
        setDraggingId(null);
        setDropTargetId(null);
      }
    },
    [day.id, onChanged, tripId],
  );

  function handleDrop(targetId: string) {
    if (!draggingId) {
      return;
    }

    const next = reorderList(orderedItems, draggingId, targetId);
    if (next === orderedItems) {
      setDraggingId(null);
      setDropTargetId(null);
      return;
    }

    void persistOrder(next, orderedItems);
  }

  return (
    <ol
      className={cn("relative border-l border-border/70 pl-6", isReordering && "opacity-80")}
      aria-busy={isReordering}
    >
      {orderedItems.map((item) => (
        <ItineraryDayItem
          key={item.id}
          tripId={tripId}
          day={{ ...day, items: orderedItems }}
          item={item}
          totalItems={orderedItems.length}
          allDays={allDays}
          formatTime={formatTime}
          onEdit={onEdit}
          onChanged={onChanged}
          isDragging={draggingId === item.id}
          isDropTarget={dropTargetId === item.id && draggingId !== item.id}
          onDragHandleStart={() => setDraggingId(item.id)}
          onDragHandleEnd={() => {
            setDraggingId(null);
            setDropTargetId(null);
          }}
          onDragEnterTarget={() => setDropTargetId(item.id)}
          onDragLeaveTarget={() => {
            setDropTargetId((current) => (current === item.id ? null : current));
          }}
          onDropOnTarget={() => handleDrop(item.id)}
        />
      ))}
    </ol>
  );
}

export { ItineraryDayTimeline };
