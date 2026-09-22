"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { TRAVEL_INSPIRATION_COPY } from "@/lib/landing/travel-inspiration";
import { cn } from "@/lib/utils";
import type { InspirationStory } from "@/types/inspiration";

interface InspirationFeaturedStoryProps {
  story: InspirationStory;
}

function InspirationFeaturedStory({ story }: InspirationFeaturedStoryProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div data-ti-featured>
      <motion.div
        whileHover={reducedMotion ? undefined : { y: -4 }}
        transition={{ duration: 0.22, ease: [0, 0, 0.2, 1] }}
      >
        <Card className="gap-0 overflow-hidden border-border/70 py-0 shadow-sm transition-shadow duration-200 hover:shadow-md">
          <div
            data-ti-image-mask
            className="relative aspect-[16/10] overflow-hidden bg-soft-gray sm:aspect-[5/3]"
          >
            <motion.div
              className="absolute inset-0 will-change-transform"
              whileHover={reducedMotion ? undefined : { scale: 1.03 }}
              transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
            >
              <Image
                src={story.heroImage}
                alt={story.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                quality={85}
                className={cn("object-cover", story.objectPosition ?? "object-center")}
              />
            </motion.div>
          </div>

          <CardContent className="flex flex-col gap-3 px-5 py-5 sm:gap-4 sm:px-6 sm:py-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-[0.6875rem] uppercase tracking-[0.12em]">
                {story.category}
              </Badge>
              <span data-ti-read-label className="text-xs text-muted-foreground">
                {story.readLabel}
              </span>
            </div>

            <h3
              data-ti-title
              className="text-xl font-bold leading-snug tracking-tight text-heading sm:text-2xl lg:text-[1.75rem]"
            >
              <Link
                href={`/inspiration/${story.slug}`}
                className="rounded-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                {story.title}
              </Link>
            </h3>

            <p
              data-ti-excerpt
              className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base"
            >
              {story.excerpt}
            </p>

            <div data-ti-link className="pt-1">
              <Button asChild variant="outline" size="sm">
                <Link href={`/inspiration/${story.slug}`}>
                  {TRAVEL_INSPIRATION_COPY.readStory}
                  <ArrowUpRight aria-hidden="true" className="size-3.5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export { InspirationFeaturedStory };
