"use client";

import Image from "next/image";
import { STAY_INSPIRED_VISUAL } from "@/lib/landing/stay-inspired";
import { cn } from "@/lib/utils";

interface StayInspiredVisualProps {
  className?: string;
}

function StayInspiredVisual({ className }: StayInspiredVisualProps) {
  return (
    <div
      data-si-visual
      className={cn(
        "relative mx-auto aspect-[4/5] w-full max-w-[18rem] will-change-transform sm:max-w-[20rem] lg:mx-0 lg:max-w-none",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute -inset-3 rounded-[1.75rem] bg-primary/10 blur-2xl"
      />

      <div className="relative h-full overflow-hidden rounded-[1.5rem] border border-border/70 bg-card shadow-sm">
        <Image
          data-si-visual-image
          src={STAY_INSPIRED_VISUAL.src}
          alt={STAY_INSPIRED_VISUAL.alt}
          fill
          sizes="(max-width: 1024px) 20rem, 24rem"
          className="object-cover object-[center_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/35 via-transparent to-transparent" />
      </div>

      <div
        aria-hidden="true"
        className="absolute -bottom-4 -left-3 hidden rounded-full border border-border/80 bg-card/90 px-3 py-1.5 text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-muted-foreground shadow-sm backdrop-blur-sm sm:block"
      >
        Weekly inspiration
      </div>
    </div>
  );
}

export { StayInspiredVisual };
