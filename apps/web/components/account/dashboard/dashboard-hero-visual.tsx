"use client";

import Image from "next/image";
import { useState } from "react";
import { DASHBOARD_HERO_VISUAL } from "@/lib/account";
import { cn } from "@/lib/utils";

function DashboardHeroVisual() {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      data-dash-hero-visual
      className="relative mx-auto aspect-[4/3] w-full max-w-[17.5rem] overflow-hidden rounded-xl will-change-transform sm:max-w-[19rem] lg:mx-0 lg:ml-auto lg:max-w-[16.5rem]"
    >
      <div data-dash-hero-image-inner className="absolute inset-0 will-change-transform">
        {hasError ? (
          <div
            role="img"
            aria-label={DASHBOARD_HERO_VISUAL.alt}
            className="size-full bg-gradient-to-br from-[#c4b5a5] via-[#8b7355] to-[#5c4a3a]"
          />
        ) : (
          <Image
            src={DASHBOARD_HERO_VISUAL.src}
            alt={DASHBOARD_HERO_VISUAL.alt}
            fill
            priority
            sizes="(max-width: 1024px) 304px, 264px"
            quality={90}
            onError={() => setHasError(true)}
            className={cn("object-cover", DASHBOARD_HERO_VISUAL.objectPosition)}
          />
        )}
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/50 via-black/15 to-transparent"
      />

      <div
        data-dash-hero-label
        className="absolute bottom-3.5 left-3.5 right-3.5 will-change-transform sm:bottom-4 sm:left-4 sm:right-auto"
      >
        <p className="label-text text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-white/95">
          {DASHBOARD_HERO_VISUAL.locationLabel}
        </p>
        <p className="mt-0.5 text-xs text-white/75">{DASHBOARD_HERO_VISUAL.locationTagline}</p>
      </div>
    </div>
  );
}

export { DashboardHeroVisual };
