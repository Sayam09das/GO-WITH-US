"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isDashboardNavActive } from "@/lib/account";
import { cn } from "@/lib/utils";

interface DashboardSidebarNavLinkProps {
  label: string;
  href: string;
  match: string;
  className?: string;
}

function DashboardSidebarNavLink({ label, href, match, className }: DashboardSidebarNavLinkProps) {
  const pathname = usePathname();
  const active = isDashboardNavActive(pathname, match);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-10 items-center rounded-lg px-3 py-2 text-sm transition-colors duration-200",
        active
          ? "bg-muted/60 font-semibold text-heading"
          : "font-medium text-muted-foreground hover:bg-muted/35 hover:text-heading",
        className,
      )}
    >
      {label}
    </Link>
  );
}

export { DashboardSidebarNavLink };
