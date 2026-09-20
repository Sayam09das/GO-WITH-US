import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const skeletonVariants = cva("animate-pulse bg-accent motion-reduce:animate-none", {
  variants: {
    variant: {
      default: "rounded-md",
      text: "h-4 w-full rounded-md",
      title: "h-6 w-3/4 rounded-md",
      caption: "h-3 w-1/2 rounded-md",
      image: "aspect-[4/3] w-full rounded-md",
      avatar: "size-10 rounded-full",
      button: "h-11 w-28 rounded-md",
      block: "h-24 w-full rounded-md",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

function Skeleton({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof skeletonVariants>) {
  return (
    <div
      aria-hidden="true"
      data-slot="skeleton"
      className={cn(skeletonVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Skeleton, skeletonVariants };
