import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import type * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-transparent font-sans text-[13px] font-semibold tracking-[0.01em] whitespace-nowrap transition-[transform,box-shadow,background-color,color,border-color] duration-[180ms] ease-out outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transform-none motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[var(--shadow-orange)] hover:bg-[#f55a0b] hover:-translate-y-px hover:shadow-[0_10px_28px_rgba(255,105,25,0.24)] active:translate-y-0",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground",
        secondary: "border-border bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "border-transparent hover:bg-secondary hover:text-secondary-foreground",
        link: "border-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 min-h-11 px-[22px] py-2 has-[>svg]:px-3",
        sm: "h-9 min-h-9 gap-1.5 rounded-lg px-3 text-xs has-[>svg]:px-2.5",
        lg: "h-12 min-h-12 rounded-lg px-6 text-sm has-[>svg]:px-4",
        icon: "size-11 min-h-11 min-w-11 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
    loadingText?: string;
  };

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  isLoading = false,
  loadingText,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  const isDisabled = disabled || isLoading;

  if (asChild) {
    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        aria-disabled={isDisabled || undefined}
        {...props}
      >
        {children}
      </Comp>
    );
  }

  return (
    <Comp
      data-slot="button"
      data-loading={isLoading ? "true" : undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      aria-disabled={isDisabled || undefined}
      {...props}
    >
      <span className="inline-grid place-items-center">
        <span
          className={cn(
            "col-start-1 row-start-1 inline-flex items-center justify-center gap-2",
            isLoading && "invisible",
          )}
        >
          {children}
        </span>
        {isLoading ? (
          <span className="col-start-1 row-start-1 inline-flex items-center justify-center gap-2">
            <Loader2
              aria-hidden="true"
              className="size-4 animate-spin motion-reduce:animate-none"
            />
            {loadingText ? <span>{loadingText}</span> : null}
          </span>
        ) : null}
      </span>
    </Comp>
  );
}

export { Button, type ButtonProps, buttonVariants };
