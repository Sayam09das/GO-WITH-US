"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavCountBadge } from "@/components/navigation/nav-count-badge";
import {
  dashboardSidebarNavLinkClasses,
  isDashboardNavActive,
  navCountForHref,
  useNavCounts,
} from "@/lib/account";
import { cn } from "@/lib/utils";

interface DashboardSidebarNavLinkProps {
  label: string;
  href: string;
  match: string;
  className?: string;
}

function DashboardSidebarNavLink({ label, href, match, className }: DashboardSidebarNavLinkProps) {
  const pathname = usePathname();
  const { counts } = useNavCounts();
  const active = isDashboardNavActive(pathname, match);
  const badgeCount = navCountForHref(href, counts);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={dashboardSidebarNavLinkClasses(active, cn("justify-between", className))}
    >
      <span>{label}</span>
      <NavCountBadge count={badgeCount} />
    </Link>
  );
}

export { DashboardSidebarNavLink };
