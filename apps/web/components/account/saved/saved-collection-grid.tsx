"use client";

import { ArrowRight, Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { SavedPlaceItem } from "@/lib/account/dashboard/saved-places-config";
import { SAVED_PAGE_COPY } from "@/lib/account/saved/saved-page-copy";
import { cn } from "@/lib/utils";

const GRID_SPANS = [
  "sm:col-span-2 sm:row-span-2",
  "sm:col-span-1",
  "sm:col-span-1",
  "sm:col-span-1 sm:row-span-2",
  "sm:col-span-2",
  "sm:col-span-1",
];

interface SavedCollectionCardProps {
  item: SavedPlaceItem;
  index: number;
  onRemove: (item: SavedPlaceItem) => Promise<void>;
}

function SavedCollectionCard({ item, index, onRemove }: SavedCollectionCardProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const spanClass = GRID_SPANS[index % GRID_SPANS.length];

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[1.25rem] border border-border/60 bg-card shadow-sm",
        spanClass,
      )}
    >
      <Link href={item.href} className="block h-full">
        <div className={cn("relative w-full", index % 3 === 0 ? "min-h-[18rem]" : "min-h-[14rem]")}>
          <Image
            src={item.image.src}
            alt={item.image.alt}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className={cn(
              "object-cover transition-transform duration-500 ease-out motion-reduce:transition-none",
              "group-hover:scale-[1.03]",
              item.image.objectPosition,
            )}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/75">
                {item.typeLabel}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-white sm:text-xl">{item.name}</h2>
              <p className="mt-1 text-sm text-white/80">
                {item.location}
                {item.country ? `, ${item.country}` : ""}
              </p>
            </div>
            <button
              type="button"
              aria-label="Remove from saved"
              disabled={isRemoving}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setIsRemoving(true);
                void onRemove(item).finally(() => setIsRemoving(false));
              }}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/40"
            >
              <Bookmark aria-hidden="true" className="size-4 fill-current" />
            </button>
          </div>
          <p className="line-clamp-2 text-sm text-white/75">{item.description}</p>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:opacity-100">
            {SAVED_PAGE_COPY.viewLabel}
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </span>
        </div>
      </Link>
    </article>
  );
}

interface SavedCollectionGridProps {
  items: SavedPlaceItem[];
  onRemove: (item: SavedPlaceItem) => Promise<void>;
}

function SavedCollectionGrid({ items, onRemove }: SavedCollectionGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <SavedCollectionCard key={item.id} item={item} index={index} onRemove={onRemove} />
      ))}
    </div>
  );
}

export { SavedCollectionGrid };
