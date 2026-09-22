"use client";

import Image from "next/image";
import { useState } from "react";
import { DESTINATIONS_HERO_IMAGE } from "@/lib/destinations";
import { cn } from "@/lib/utils";

function DestinationsHeroImage() {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      data-dest-image-mask
      className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] will-change-transform sm:aspect-[16/10] sm:rounded-[1.5rem] lg:aspect-[21/9] lg:rounded-[1.75rem]"
    >
      <div data-dest-image-inner className="absolute inset-0 will-change-transform">
        {hasError ? (
          <div
            role="img"
            aria-label={DESTINATIONS_HERO_IMAGE.alt}
            className="size-full bg-gradient-to-br from-[#fbbf7a] via-[#f97316] to-[#ea580c]"
          />
        ) : (
          <Image
            src={DESTINATIONS_HERO_IMAGE.src}
            alt={DESTINATIONS_HERO_IMAGE.alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
            quality={90}
            onError={() => setHasError(true)}
            className={cn("object-cover", DESTINATIONS_HERO_IMAGE.objectPosition)}
          />
        )}
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/55 via-black/20 to-transparent"
      />

      <div
        data-dest-location
        className="absolute bottom-5 left-5 will-change-transform sm:bottom-6 sm:left-6 lg:bottom-8 lg:left-8"
      >
        <p className="text-lg font-semibold tracking-tight text-white sm:text-xl">
          {DESTINATIONS_HERO_IMAGE.destinationName}
        </p>
        <p className="text-sm text-white/80 sm:text-[0.9375rem]">
          {DESTINATIONS_HERO_IMAGE.destinationCountry}
        </p>
      </div>
    </div>
  );
}

export { DestinationsHeroImage };
