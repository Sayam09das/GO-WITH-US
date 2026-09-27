"use client";

import { ArrowRight, Bookmark, LoaderCircle } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { IconButton } from "@/components/ui/icon-button";
import { EXPLORE_SECTION_COPY, type ExploreDestinationPanel } from "@/lib/account";
import { ApiRequestError } from "@/lib/api/client";
import { getDestinationBySlug } from "@/lib/api/destinations";
import { saveDestination, unsaveDestination } from "@/lib/api/users";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface DashboardExplorePanelProps {
  destination: ExploreDestinationPanel;
  initialSaved?: boolean;
}

function DashboardExplorePanel({ destination, initialSaved = false }: DashboardExplorePanelProps) {
  const reducedMotion = useReducedMotion();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isPending, setIsPending] = useState(false);
  const [catalogDestinationId, setCatalogDestinationId] = useState<string | null>(null);
  const isFeatured = destination.layout === "featured";

  const resolveCatalogDestinationId = useCallback(async (): Promise<string | null> => {
    if (catalogDestinationId) {
      return catalogDestinationId;
    }

    const detail = await getDestinationBySlug(destination.slug);
    if (!detail?.id) {
      return null;
    }

    setCatalogDestinationId(detail.id);
    return detail.id;
  }, [catalogDestinationId, destination.slug]);

  async function toggleSave() {
    if (isPending) {
      return;
    }

    setIsPending(true);

    try {
      const destinationId = await resolveCatalogDestinationId();
      if (!destinationId) {
        return;
      }

      if (isSaved) {
        await unsaveDestination(destinationId);
        setIsSaved(false);
      } else {
        await saveDestination(destinationId);
        setIsSaved(true);
      }
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 401) {
        return;
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <article
      data-dash-explore-panel
      className={cn(
        "group relative min-h-[16rem] overflow-hidden rounded-[1.25rem] will-change-transform sm:min-h-[18rem] sm:rounded-[1.375rem]",
        isFeatured ? "lg:col-span-7 lg:row-span-2 lg:min-h-full" : "lg:col-span-5",
      )}
    >
      <Link
        href={`/destinations/${destination.slug}`}
        className="relative block size-full focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={`${destination.name}, ${destination.country}. ${destination.descriptor}`}
      >
        <motion.div
          className="absolute inset-0 will-change-transform"
          whileHover={reducedMotion ? undefined : { scale: 1.04 }}
          transition={{ duration: 0.55, ease: [0, 0, 0.2, 1] }}
        >
          <Image
            src={destination.image.src}
            alt={destination.image.alt}
            fill
            sizes={
              isFeatured ? "(max-width: 1024px) 100vw, 58vw" : "(max-width: 1024px) 100vw, 42vw"
            }
            quality={88}
            className={cn("object-cover", destination.image.objectPosition)}
          />
        </motion.div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/5"
        />

        <motion.div
          className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-5 will-change-transform sm:p-6"
          whileHover={reducedMotion ? undefined : { y: -4 }}
          transition={{ duration: 0.28, ease: [0, 0, 0.2, 1] }}
        >
          <p className="label-text text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-white/80">
            {destination.location} — {destination.country}
          </p>
          <h3 className="hero-heading text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {destination.name}
          </h3>
          <p className="max-w-sm text-sm leading-relaxed text-white/78">{destination.descriptor}</p>
          <span
            className={cn(
              "mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-white transition-opacity duration-200",
              reducedMotion
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
            )}
          >
            {EXPLORE_SECTION_COPY.discover}
            <ArrowRight aria-hidden="true" className="size-4" />
          </span>
        </motion.div>
      </Link>

      <IconButton
        variant="ghost"
        label={isSaved ? EXPLORE_SECTION_COPY.unsaveLabel : EXPLORE_SECTION_COPY.saveLabel}
        icon={isPending ? LoaderCircle : Bookmark}
        aria-pressed={isSaved}
        disabled={isPending}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void toggleSave();
        }}
        className={cn(
          "absolute right-3 top-3 z-10 size-10 rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-sm hover:bg-black/40 hover:text-white",
          isSaved && "text-primary",
          isPending && "[&_svg]:animate-spin",
        )}
        iconClassName={cn("size-[1.125rem]", isSaved && !isPending && "fill-current")}
      />
    </article>
  );
}

export { DashboardExplorePanel };
