"use client";

import { ArrowRight, Bookmark, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AccountTabNav } from "@/components/account/account-tab-nav";
import { SavedCollectionGrid } from "@/components/account/saved/saved-collection-grid";
import { EmptyState } from "@/components/states";
import { Button } from "@/components/ui/button";
import type { SavedPlaceItem } from "@/lib/account/dashboard/saved-places-config";
import {
  SAVED_BOTTOM_CTA,
  SAVED_EMPTY_COPY,
  SAVED_PAGE_COPY,
  SAVED_TABS,
  type SavedTabId,
} from "@/lib/account/saved/saved-page-copy";
import { ApiRequestError } from "@/lib/api/client";
import { mapAllSavedPlaces } from "@/lib/api/dashboard-mappers";
import {
  listSavedDestinations,
  listSavedExperiences,
  listSavedStays,
  unsaveDestination,
  unsaveExperience,
  unsaveStay,
} from "@/lib/api/users";
import { notifyNavCountsChanged } from "@/lib/navigation/nav-counts-events";

function filterByTab(items: SavedPlaceItem[], tab: SavedTabId): SavedPlaceItem[] {
  if (tab === "all") {
    return items;
  }
  if (tab === "story") {
    return [];
  }
  return items.filter((item) => item.type === tab);
}

function countByTab(items: SavedPlaceItem[]): Record<SavedTabId, number> {
  return {
    all: items.length,
    destination: items.filter((item) => item.type === "destination").length,
    stay: items.filter((item) => item.type === "stay").length,
    experience: items.filter((item) => item.type === "experience").length,
    story: 0,
  };
}

function SavedCollectionContent() {
  const [items, setItems] = useState<SavedPlaceItem[]>([]);
  const [activeTab, setActiveTab] = useState<SavedTabId>("all");
  const [toast, setToast] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const counts = useMemo(() => countByTab(items), [items]);
  const visibleItems = useMemo(() => filterByTab(items, activeTab), [items, activeTab]);

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
          if (cause instanceof ApiRequestError) {
            if (cause.status === 401) {
              setError("Sign in to view your saved places.");
              return;
            }
            if (cause.status >= 500) {
              setError(
                "We couldn't load your saves. Sign out and sign in again, and make sure the API is running locally.",
              );
              return;
            }
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

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function handleRemove(item: SavedPlaceItem) {
    if (item.type === "destination") {
      await unsaveDestination(item.catalogId);
    } else if (item.type === "stay") {
      await unsaveStay(item.catalogId);
    } else if (item.type === "experience") {
      await unsaveExperience(item.catalogId);
    }

    setItems((current) => current.filter((entry) => entry.id !== item.id));
    notifyNavCountsChanged();
    setToast(SAVED_PAGE_COPY.removedMessage);
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
        Loading your collection…
      </div>
    );
  }

  if (error) {
    return <EmptyState title="Saved unavailable" description={error} icon={Bookmark} />;
  }

  return (
    <>
      {toast ? (
        <p
          role="status"
          className="mb-6 rounded-full border border-border/60 bg-muted/40 px-4 py-2 text-sm text-heading"
        >
          {toast}
        </p>
      ) : null}

      <AccountTabNav
        tabs={SAVED_TABS.map((tab) => ({
          id: tab.id,
          label: tab.label,
          count: counts[tab.id],
        }))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        ariaLabel="Saved categories"
      />

      {items.length === 0 ? (
        <EmptyState
          title={SAVED_EMPTY_COPY.all.title}
          description={SAVED_EMPTY_COPY.all.description}
          icon={Bookmark}
          action={{
            href: SAVED_EMPTY_COPY.all.href,
            label: SAVED_EMPTY_COPY.all.action,
          }}
        />
      ) : visibleItems.length === 0 ? (
        <EmptyState
          title={SAVED_EMPTY_COPY.category.title}
          description={SAVED_EMPTY_COPY.category.description}
          icon={Bookmark}
          action={{
            href: SAVED_EMPTY_COPY.category.href,
            label: SAVED_EMPTY_COPY.category.action,
          }}
        />
      ) : (
        <SavedCollectionGrid items={visibleItems} onRemove={handleRemove} />
      )}

      <section className="mt-14 border-t border-border/60 pt-12 text-center">
        <h2 className="section-heading text-2xl text-heading sm:text-3xl">
          {SAVED_BOTTOM_CTA.heading}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
          {SAVED_BOTTOM_CTA.supporting}
        </p>
        <Button asChild variant="outline" className="mt-6 rounded-full px-5">
          <Link href={SAVED_BOTTOM_CTA.href}>
            {SAVED_BOTTOM_CTA.action}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Button>
      </section>
    </>
  );
}

export { SavedCollectionContent };
