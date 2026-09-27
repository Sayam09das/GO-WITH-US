"use client";

import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useDashboardUser } from "@/components/account/dashboard/dashboard-user-context";
import { useDashboardLogout } from "@/components/account/dashboard/use-dashboard-logout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DASHBOARD_HEADER_COPY, DASHBOARD_PROFILE_NAV_LINKS } from "@/lib/account";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface DashboardProfileMenuProps {
  compact?: boolean;
  className?: string;
}

function DashboardProfileMenu({ compact = false, className }: DashboardProfileMenuProps) {
  const reducedMotion = useReducedMotion();
  const user = useDashboardUser();
  const handleLogout = useDashboardLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          type="button"
          aria-label={DASHBOARD_HEADER_COPY.profileMenuLabel}
          whileHover={reducedMotion ? undefined : { scale: 1.01 }}
          whileTap={reducedMotion ? undefined : { scale: 0.99 }}
          transition={{ duration: 0.18 }}
          className={cn(
            "inline-flex min-h-11 items-center gap-2 rounded-full border border-transparent py-1.5 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
            compact ? "pl-1 pr-2" : "border-border/70 bg-card/80 px-2 pr-3 shadow-xs",
            className,
          )}
        >
          <Avatar size="sm" className="size-9 bg-primary/10 text-primary">
            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
              {user.initials}
            </AvatarFallback>
          </Avatar>
          {!compact ? (
            <>
              <span className="hidden max-w-[8rem] truncate text-sm font-medium text-heading sm:inline">
                {user.firstName}
              </span>
              <ChevronDown aria-hidden="true" className="size-4 text-muted-foreground" />
            </>
          ) : null}
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        {DASHBOARD_PROFILE_NAV_LINKS.map((link) => (
          <DropdownMenuItem key={link.href} asChild>
            <Link href={link.href}>{link.label}</Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            void handleLogout();
          }}
        >
          {DASHBOARD_HEADER_COPY.profileLinks.logOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { DashboardProfileMenu };
