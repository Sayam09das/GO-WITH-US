"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { logout } from "@/lib/api/auth";
import { notifyAuthSessionChanged, useAuthSession } from "@/lib/auth";

export function useDashboardLogout() {
  const router = useRouter();
  const { clearUser } = useAuthSession();

  return useCallback(async () => {
    try {
      await logout();
    } catch {
      // Still clear local session UI if the network call fails.
    } finally {
      clearUser();
      notifyAuthSessionChanged();
      router.push("/sign-in");
    }
  }, [clearUser, router]);
}
