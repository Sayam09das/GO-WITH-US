import Image from "next/image";
import type { AboutImageConfig } from "@/lib/landing/about";
import { cn } from "@/lib/utils";

interface AboutImageProps {
  config: AboutImageConfig;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

function AboutImage({
  config,
  className,
  sizes = "(max-width: 1024px) 80vw, 40vw",
  priority = false,
}: AboutImageProps) {
  return (
    <Image
      src={config.src}
      alt={config.alt}
      fill
      priority={priority}
      sizes={sizes}
      quality={85}
      className={cn("object-cover", config.objectPosition, className)}
    />
  );
}

export { AboutImage };
