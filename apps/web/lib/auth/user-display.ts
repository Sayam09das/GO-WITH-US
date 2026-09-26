import type { PublicUser } from "@gowithus/types";

export function getUserInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0]!.slice(0, 1).toUpperCase();
  }

  return `${parts[0]!.slice(0, 1)}${parts[parts.length - 1]!.slice(0, 1)}`.toUpperCase();
}

export function getUserFirstName(user: PublicUser): string {
  const first = user.fullName.trim().split(/\s+/)[0];
  return first || user.fullName || "Account";
}

export function notifyAuthSessionChanged(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event("gowithus:auth-changed"));
}
