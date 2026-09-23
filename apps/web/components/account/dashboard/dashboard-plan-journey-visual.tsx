"use client";

import Image from "next/image";
import { useState } from "react";
import { DASHBOARD_PLAN_JOURNEY_VISUAL } from "@/lib/account";
import { cn } from "@/lib/utils";

function DashboardPlanJourneyVisual() {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      data-dash-plan-visual
      className="relative min-h-[14rem] w-full overflow-hidden bg-soft-gray will-change-transform sm:min-h-[16rem] lg:min-h-[18rem] lg:w-[46%] lg:shrink-0"
    >
      <div data-dash-plan-image-inner className="absolute inset-0 will-change-transform">
        {hasError ? (
          <div
            role="img"
            aria-label={DASHBOARD_PLAN_JOURNEY_VISUAL.alt}
            className="size-full bg-gradient-to-br from-[#9aa8b8] via-[#6b7f8f] to-[#3f4f5c]"
          />
        ) : (
          <Image
            src={DASHBOARD_PLAN_JOURNEY_VISUAL.src}
            alt={DASHBOARD_PLAN_JOURNEY_VISUAL.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 46vw"
            quality={88}
            onError={() => setHasError(true)}
            className={cn("object-cover", DASHBOARD_PLAN_JOURNEY_VISUAL.objectPosition)}
          />
        )}
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent"
      />

      <p className="label-text absolute bottom-4 left-4 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-white/90 sm:bottom-5 sm:left-5">
        {DASHBOARD_PLAN_JOURNEY_VISUAL.moodLabel}
      </p>
    </div>
  );
}

export { DashboardPlanJourneyVisual };
