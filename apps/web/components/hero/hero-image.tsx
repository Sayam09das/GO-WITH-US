"use client";

import Image from "next/image";
import { useState } from "react";
import type { HeroImageConfig } from "@/lib/hero";
import { cn } from "@/lib/utils";

interface HeroImageProps {
  config: HeroImageConfig;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

function HeroImage({ config, className, priority = false, sizes = "50vw" }: HeroImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={config.alt}
        className={cn("size-full bg-gradient-to-br", config.gradient, className)}
      />
    );
  }

  return (
    <Image
      src={config.src}
      alt={config.alt}
      fill
      priority={priority}
      sizes={sizes}
      quality={85}
      onError={() => setHasError(true)}
      className={cn("object-cover", config.objectPosition, className)}
    />
  );
}

export { HeroImage };
