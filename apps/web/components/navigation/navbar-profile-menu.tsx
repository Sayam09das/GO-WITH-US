"use client";

import type { PublicUser } from "@gowithus/types";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/api/auth";
import {
  getUserFirstName,
  getUserInitials,
  notifyAuthSessionChanged,
  useAuthSession,
} from "@/lib/auth";
import { isDarkOverlay, type NavbarOverlayTone, type NavbarVisualState } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const NAV_PROFILE_LINKS = [
  { label: "Account overview", href: "/account" },
  { label: "My profile", href: "/account/profile" },
  { label: "Settings", href: "/account/settings" },
] as const;

interface NavbarProfileMenuProps {
  user: PublicUser;
  visualState: NavbarVisualState;
  overlayTone?: NavbarOverlayTone;
  isActive: boolean;
  className?: string;
  onNavigate?: () => void;
}

function NavbarProfileMenu({
  user,
  visualState,
  overlayTone = "light",
  isActive,
  className,
  onNavigate,
}: NavbarProfileMenuProps) {
  const router = useRouter();
  const { clearUser } = useAuthSession();
  const firstName = getUserFirstName(user);
  const initials = getUserInitials(user.fullName);
  const onDark = isDarkOverlay(visualState, overlayTone);

  const handleLogout = async () => {
    onNavigate?.();
    try {
      await logout();
    } catch {
      // Still clear local session UI if the network call fails.
    } finally {
      clearUser();
      notifyAuthSessionChanged();
      router.push("/sign-in");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          aria-current={isActive ? "page" : undefined}
          className={cn(
            "inline-flex min-h-11 max-w-[12rem] items-center gap-2 rounded-full border py-1.5 pl-1 pr-2.5 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
            onDark
              ? "border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground"
              : "border-border/70 bg-card/80 text-heading shadow-xs",
            isActive && "ring-1 ring-primary/20",
            className,
          )}
        >
          <Avatar size="sm" className="size-9 bg-primary/10 text-primary">
            {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt="" /> : null}
            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden truncate text-sm font-medium sm:inline">{firstName}</span>
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "size-4 shrink-0",
              onDark ? "text-primary-foreground/80" : "text-muted-foreground",
            )}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        {NAV_PROFILE_LINKS.map((link) => (
          <DropdownMenuItem key={link.href} asChild>
            <Link href={link.href} onClick={onNavigate}>
              {link.label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => void handleLogout()}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { NavbarProfileMenu };
