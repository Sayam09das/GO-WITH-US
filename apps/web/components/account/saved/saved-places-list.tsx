"use client";

import { Bookmark, LoaderCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/states";
import type { SavedPlaceItem } from "@/lib/account/dashboard/saved-places-config";
import { ApiRequestError } from "@/lib/api/client";
import { mapAllSavedPlaces } from "@/lib/api/dashboard-mappers";
import { listSavedDestinations, listSavedExperiences, listSavedStays } from "@/lib/api/users";

export function SavedPlacesList() {
  const [items, setItems] = useState<SavedPlaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void Promise.all([listSavedDestinations(), listSavedStays(), listSavedExperiences()])
      .then(([destinations, stays, experiences]) => {
        if (!cancelled) {
          setItems(mapAllSavedPlaces({ destinations, stays, experiences }));
        }
      })
      .catch((cause) => {
        if (!cancelled) {
          if (cause instanceof ApiRequestError && cause.status === 401) {
            setError("Sign in to view your saved places.");
            return;
          }
          setError("We couldn't load your saved places right now.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
        Loading saved places…
      </div>
    );
  }

  if (error) {
    return <EmptyState title="Saved places unavailable" description={error} icon={Bookmark} />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Nothing saved yet"
        description="When a place feels like somewhere you could go, save it here."
        icon={Bookmark}
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.id}
          className="overflow-hidden rounded-[1.25rem] border border-border/60 bg-background shadow-sm"
        >
          <Link href={item.href} className="block">
            <div className="relative aspect-[4/3]">
              <Image src={item.image.src} alt={item.image.alt} fill className="object-cover" />
            </div>
            <div className="space-y-2 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {item.typeLabel}
              </p>
              <h2 className="text-lg font-semibold text-heading">{item.name}</h2>
              <p className="text-sm text-muted-foreground">
                {item.location}
                {item.country ? `, ${item.country}` : ""}
              </p>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
