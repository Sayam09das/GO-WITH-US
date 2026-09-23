"use client";

import Image from "next/image";
import { useState } from "react";
import type { AuthVisualConfig } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface AuthVisualProps {
  visual: AuthVisualConfig;
}

function AuthVisual({ visual }: AuthVisualProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      data-auth-visual
      className="relative flex h-full min-h-[420px] w-full items-stretch will-change-transform lg:min-h-full"
    >
      <div className="sign-in-visual-shell relative flex-1 overflow-hidden bg-section">
        <div data-auth-visual-inner className="absolute inset-0 will-change-transform">
          {hasError ? (
            <div
              role="img"
              aria-label={visual.alt}
              className="size-full bg-gradient-to-br from-[#fbbf7a] via-[#f97316] to-[#ea580c]"
            />
          ) : (
            <Image
              src={visual.src}
              alt={visual.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              quality={90}
              onError={() => setHasError(true)}
              className={cn("object-cover", visual.objectPosition)}
            />
          )}
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/20"
        />

        <p
          data-auth-visual-copy
          className="absolute top-8 right-8 left-8 max-w-sm text-lg leading-snug font-medium text-white will-change-transform sm:text-xl lg:left-auto lg:max-w-xs lg:text-right"
        >
          {visual.quote}
        </p>
      </div>
    </div>
  );
}

export { AuthVisual };
