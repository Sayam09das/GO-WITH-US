"use client";

import { LoaderCircle, Plus, Search } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  searchDestinationsApi,
  searchExperiencesApi,
  searchRestaurantsApi,
  searchStaysApi,
} from "@/lib/api/search";
import { addItineraryItem, type CreateItineraryItemInput } from "@/lib/api/trips";
import { cn } from "@/lib/utils";

type CatalogTab = Exclude<CreateItineraryItemInput["type"], "custom">;

type CatalogResult = {
  id: string;
  label: string;
  meta: string;
};

interface AddItineraryItemDialogProps {
  tripId: string;
  dayId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdded: () => void;
}

const CATALOG_TAB_LABELS: Record<CatalogTab, string> = {
  destination: "Destination",
  stay: "Stay",
  experience: "Experience",
  restaurant: "Restaurant",
};

async function searchCatalog(tab: CatalogTab, query: string): Promise<CatalogResult[]> {
  switch (tab) {
    case "destination": {
      const items = await searchDestinationsApi(query, 8);
      return items.map((item) => ({
        id: item.id,
        label: item.title,
        meta: `${item.location}, ${item.country}`,
      }));
    }
    case "stay": {
      const items = await searchStaysApi(query, 8);
      return items.map((item) => ({
        id: item.id,
        label: item.name,
        meta: item.destination,
      }));
    }
    case "experience": {
      const items = await searchExperiencesApi(query, 8);
      return items.map((item) => ({
        id: item.id,
        label: item.title,
        meta: item.destination,
      }));
    }
    case "restaurant": {
      const items = await searchRestaurantsApi(query, 8);
      return items.map((item) => ({
        id: item.id,
        label: item.name,
        meta: `${item.destination} · ${item.cuisine}`,
      }));
    }
  }
}

function buildCatalogPayload(
  tab: CatalogTab,
  catalogId: string,
  startTime: string,
  notes: string,
): CreateItineraryItemInput {
  const base = {
    type: tab,
    startTime: startTime.trim() || undefined,
    notes: notes.trim() || undefined,
  };

  switch (tab) {
    case "destination":
      return { ...base, destinationId: catalogId };
    case "stay":
      return { ...base, stayId: catalogId };
    case "experience":
      return { ...base, experienceId: catalogId };
    case "restaurant":
      return { ...base, restaurantId: catalogId };
  }
}

function AddItineraryItemDialog({
  tripId,
  dayId,
  open,
  onOpenChange,
  onAdded,
}: AddItineraryItemDialogProps) {
  const [activeTab, setActiveTab] = useState<string>("destination");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CatalogResult[]>([]);
  const [selectedCatalogId, setSelectedCatalogId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("09:30");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setQuery("");
    setResults([]);
    setSelectedCatalogId(null);
    setTitle("");
    setStartTime("09:30");
    setEndTime("");
    setNotes("");
    setError(null);
    setActiveTab("destination");
  }, [open]);

  useEffect(() => {
    if (!open || activeTab === "custom") {
      return;
    }

    const tab = activeTab as CatalogTab;
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setSelectedCatalogId(null);
      return;
    }

    let cancelled = false;
    setIsSearching(true);

    const timer = window.setTimeout(() => {
      void searchCatalog(tab, trimmed)
        .then((items) => {
          if (!cancelled) {
            setResults(items);
            setSelectedCatalogId((current) =>
              current && items.some((item) => item.id === current) ? current : null,
            );
          }
        })
        .catch(() => {
          if (!cancelled) {
            setResults([]);
          }
        })
        .finally(() => {
          if (!cancelled) {
            setIsSearching(false);
          }
        });
    }, 280);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [activeTab, open, query]);

  async function handleCatalogSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!selectedCatalogId) {
      setError("Choose an item from the catalog.");
      return;
    }

    setIsSubmitting(true);

    try {
      await addItineraryItem(
        tripId,
        dayId,
        buildCatalogPayload(activeTab as CatalogTab, selectedCatalogId, startTime, notes),
      );
      onOpenChange(false);
      onAdded();
    } catch {
      setError("We couldn't add this to your itinerary. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCustomSubmit(event: React.FormEvent) {
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
        startTime: startTime.trim() || undefined,
        endTime: endTime.trim() || undefined,
        notes: notes.trim() || undefined,
      });
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
      <DialogContent className="max-h-[min(90vh,40rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add to itinerary</DialogTitle>
          <DialogDescription>
            Pull from the GO WITH US catalog or add a custom activity for this day.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-muted/40 p-1">
            {(Object.keys(CATALOG_TAB_LABELS) as CatalogTab[]).map((tab) => (
              <TabsTrigger key={tab} value={tab} className="rounded-full text-xs sm:text-sm">
                {CATALOG_TAB_LABELS[tab]}
              </TabsTrigger>
            ))}
            <TabsTrigger value="custom" className="rounded-full text-xs sm:text-sm">
              Custom
            </TabsTrigger>
          </TabsList>

          {(Object.keys(CATALOG_TAB_LABELS) as CatalogTab[]).map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-4">
              <form onSubmit={handleCatalogSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor={`catalog-search-${tab}`}>Search</Label>
                  <div className="relative">
                    <Search
                      aria-hidden="true"
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id={`catalog-search-${tab}`}
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder={`Search ${CATALOG_TAB_LABELS[tab].toLowerCase()}s…`}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="max-h-48 overflow-y-auto rounded-xl border border-border/60">
                  {isSearching ? (
                    <p className="flex items-center gap-2 px-4 py-6 text-sm text-muted-foreground">
                      <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                      Searching…
                    </p>
                  ) : results.length === 0 ? (
                    <p className="px-4 py-6 text-sm text-muted-foreground">
                      {query.trim().length < 2
                        ? "Type at least two characters to search."
                        : "No matches yet. Try a different name or place."}
                    </p>
                  ) : (
                    <ul className="divide-y divide-border/60">
                      {results.map((result) => {
                        const isSelected = selectedCatalogId === result.id;
                        return (
                          <li key={result.id}>
                            <button
                              type="button"
                              onClick={() => setSelectedCatalogId(result.id)}
                              className={cn(
                                "flex w-full flex-col items-start gap-0.5 px-4 py-3 text-left transition-colors hover:bg-muted/50",
                                isSelected && "bg-primary/5",
                              )}
                            >
                              <span className="font-medium text-heading">{result.label}</span>
                              <span className="text-xs text-muted-foreground">{result.meta}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={`catalog-start-${tab}`}>Start time</Label>
                    <Input
                      id={`catalog-start-${tab}`}
                      type="time"
                      value={startTime}
                      onChange={(event) => setStartTime(event.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={`catalog-notes-${tab}`}>Notes (optional)</Label>
                    <Input
                      id={`catalog-notes-${tab}`}
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      placeholder="Meeting point, reservation…"
                    />
                  </div>
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
            </TabsContent>
          ))}

          <TabsContent value="custom" className="mt-4">
            <form onSubmit={handleCustomSubmit} className="flex flex-col gap-4">
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

              <div className="grid gap-4 sm:grid-cols-2">
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
                  <Label htmlFor="itinerary-item-end">End time</Label>
                  <Input
                    id="itinerary-item-end"
                    type="time"
                    value={endTime}
                    onChange={(event) => setEndTime(event.target.value)}
                  />
                </div>
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
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export { AddItineraryItemDialog };
