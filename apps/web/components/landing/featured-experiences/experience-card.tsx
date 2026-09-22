"use client";

import { ArrowUpRight, MapPin } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { FEATURED_EXPERIENCES_COPY } from "@/lib/landing/featured-experiences";
import { cn } from "@/lib/utils";
import type { ExperienceListItem } from "@/types/experience";

interface ExperienceCardProps {
  experience: ExperienceListItem;
  index: number;
}

function ExperienceCard({ experience, index }: ExperienceCardProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div data-fe-card data-fe-card-index={index} className="h-full">
      <motion.div
        whileHover={reducedMotion ? undefined : { y: -4 }}
        transition={{ duration: 0.22, ease: [0, 0, 0.2, 1] }}
        className="h-full"
      >
        <Card className="h-full gap-0 overflow-hidden border-border/70 py-0 shadow-sm transition-shadow duration-200 hover:shadow-md">
          <div data-fe-image-mask className="relative aspect-[4/3] overflow-hidden bg-soft-gray">
            <motion.div
              className="absolute inset-0 will-change-transform"
              whileHover={reducedMotion ? undefined : { scale: 1.03 }}
              transition={{ duration: 0.45, ease: [0, 0, 0.2, 1] }}
            >
              <Image
                src={experience.heroImage}
                alt={experience.imageAlt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                quality={85}
                className={cn("object-cover", experience.objectPosition ?? "object-center")}
              />
            </motion.div>

            <Badge
              variant="secondary"
              className="absolute left-3 top-3 border-transparent bg-background/90 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-primary backdrop-blur-sm"
            >
              {experience.categoryLabel}
            </Badge>
          </div>

          <CardContent className="flex flex-col gap-2 px-4 pb-3 pt-4 sm:px-5 sm:pt-5">
            <h3
              data-fe-title
              className="line-clamp-2 text-base font-bold leading-snug text-heading sm:text-[1.0625rem]"
            >
              <Link
                href={`/experiences/${experience.slug}`}
                className="rounded-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                {experience.title}
              </Link>
            </h3>

            <p data-fe-location className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin aria-hidden="true" className="size-3.5 shrink-0 text-primary" />
              <span className="truncate">{experience.destination}</span>
            </p>

            <p
              data-fe-description
              className="line-clamp-2 text-sm leading-relaxed text-muted-foreground"
            >
              {experience.description}
            </p>
          </CardContent>

          <CardFooter className="px-4 pb-5 pt-0 sm:px-5 sm:pb-6">
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href={`/experiences/${experience.slug}`}>
                {FEATURED_EXPERIENCES_COPY.exploreLabel}
                <ArrowUpRight aria-hidden="true" className="size-3.5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

export { ExperienceCard };
