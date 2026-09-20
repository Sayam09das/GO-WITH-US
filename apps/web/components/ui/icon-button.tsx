"use client";

import type { VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import type * as React from "react";
import { Button, type buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type IconButtonProps = Omit<React.ComponentProps<typeof Button>, "children" | "size"> &
  VariantProps<typeof buttonVariants> & {
    /** Accessible name — required for icon-only controls. */
    label: string;
    icon: LucideIcon;
    /** Optional tooltip; use for supplementary context only. */
    tooltip?: string;
    iconClassName?: string;
  };

function IconButton({
  label,
  icon: Icon,
  tooltip,
  className,
  variant = "ghost",
  iconClassName,
  isLoading,
  ...props
}: IconButtonProps) {
  const button = (
    <Button
      type="button"
      variant={variant}
      size="icon"
      aria-label={label}
      isLoading={isLoading}
      className={cn("shrink-0", className)}
      {...props}
    >
      {!isLoading ? <Icon aria-hidden="true" className={cn("size-5", iconClassName)} /> : null}
    </Button>
  );

  if (!tooltip) {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

export { IconButton };
