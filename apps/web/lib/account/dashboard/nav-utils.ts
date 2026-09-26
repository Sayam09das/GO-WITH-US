import { cn } from "@/lib/utils";

export function isDashboardNavActive(pathname: string, match: string): boolean {
  if (match === "/account") {
    return pathname === "/account";
  }

  return pathname === match || pathname.startsWith(`${match}/`);
}

/** Sidebar + help link surface — active route vs hover/focus. */
export function dashboardSidebarNavLinkClasses(active: boolean, className?: string): string {
  return cn(
    "flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none transition-[background-color,color,box-shadow] duration-200 ease-out",
    "focus-visible:ring-[3px] focus-visible:ring-ring/50",
    active
      ? "bg-primary/10 font-semibold text-heading shadow-[inset_3px_0_0_0_var(--color-primary)]"
      : "border border-transparent font-medium text-muted-foreground hover:border-border/50 hover:bg-muted/60 hover:text-heading active:bg-muted/75",
    className,
  );
}
