import { cn } from "@/lib/utils";

function formatNavCount(count: number): string | null {
  if (count <= 0) {
    return null;
  }

  if (count > 99) {
    return "99+";
  }

  return String(count);
}

interface NavCountBadgeProps {
  count: number;
  className?: string;
  variant?: "pill" | "dot";
}

function NavCountBadge({ count, className, variant = "pill" }: NavCountBadgeProps) {
  const label = formatNavCount(count);

  if (!label) {
    return null;
  }

  if (variant === "dot") {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "absolute -right-0.5 -top-0.5 size-2 rounded-full bg-primary ring-2 ring-background",
          className,
        )}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex min-h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-primary px-1 text-[0.625rem] font-semibold leading-none text-primary-foreground",
        className,
      )}
    >
      {label}
    </span>
  );
}

function navCountAriaSuffix(count: number, noun: "saved place" | "trip"): string {
  if (count <= 0) {
    return "";
  }

  const unit = count === 1 ? noun : `${noun}s`;
  return `, ${count} ${unit}`;
}

export { formatNavCount, NavCountBadge, navCountAriaSuffix };
