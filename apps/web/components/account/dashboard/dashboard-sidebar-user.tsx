"use client";

import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DASHBOARD_SIDEBAR_USER_COPY,
  DASHBOARD_SIDEBAR_USER_LINKS,
  DASHBOARD_USER,
} from "@/lib/account";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface DashboardSidebarUserProps {
  className?: string;
}

function DashboardSidebarUser({ className }: DashboardSidebarUserProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div data-dash-reveal className={cn("will-change-transform", className)}>
      <div aria-hidden="true" className="mb-4 border-t border-border/60" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.button
            type="button"
            aria-label={DASHBOARD_SIDEBAR_USER_COPY.menuLabel}
            whileHover={reducedMotion ? undefined : { scale: 1.005 }}
            whileTap={reducedMotion ? undefined : { scale: 0.995 }}
            transition={{ duration: 0.18 }}
            className="flex w-full min-h-11 items-center gap-3 rounded-xl px-2 py-2 text-left outline-none transition-colors hover:bg-muted/35 focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <Avatar className="size-10 bg-primary/10 text-primary">
              <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                {DASHBOARD_USER.initials}
              </AvatarFallback>
            </Avatar>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-heading">
                {DASHBOARD_USER.fullName}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                {DASHBOARD_SIDEBAR_USER_COPY.accountType}
              </span>
            </span>
            <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          </motion.button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="top" className="min-w-52">
          {DASHBOARD_SIDEBAR_USER_LINKS.map((link, index) => (
            <div key={link.href}>
              {index === DASHBOARD_SIDEBAR_USER_LINKS.length - 1 ? <DropdownMenuSeparator /> : null}
              <DropdownMenuItem asChild>
                <Link href={link.href}>{link.label}</Link>
              </DropdownMenuItem>
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export { DashboardSidebarUser };
