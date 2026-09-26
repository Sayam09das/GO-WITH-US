"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuthSession } from "@/lib/auth";
import {
  EMPTY_NAV_COUNTS,
  fetchNavCounts,
  type NavCounts,
} from "@/lib/navigation/fetch-nav-counts";
import { NAV_COUNTS_CHANGED_EVENT } from "@/lib/navigation/nav-counts-events";

type NavCountsContextValue = {
  counts: NavCounts;
  refreshNavCounts: () => Promise<void>;
};

const NavCountsContext = createContext<NavCountsContextValue | null>(null);

function NavCountsProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, isLoading: isAuthLoading } = useAuthSession();
  const [counts, setCounts] = useState<NavCounts>(EMPTY_NAV_COUNTS);

  const refreshNavCounts = useCallback(async () => {
    if (!user) {
      setCounts(EMPTY_NAV_COUNTS);
      return;
    }

    try {
      setCounts(await fetchNavCounts());
    } catch {
      // Keep the last known counts on transient failures.
    }
  }, [user]);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    void refreshNavCounts();
  }, [isAuthLoading, refreshNavCounts]);

  useEffect(() => {
    const onRefresh = () => {
      void refreshNavCounts();
    };

    window.addEventListener(NAV_COUNTS_CHANGED_EVENT, onRefresh);
    window.addEventListener("gowithus:auth-changed", onRefresh);

    return () => {
      window.removeEventListener(NAV_COUNTS_CHANGED_EVENT, onRefresh);
      window.removeEventListener("gowithus:auth-changed", onRefresh);
    };
  }, [refreshNavCounts]);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (pathname === "/saved" || pathname === "/trips" || pathname.startsWith("/account")) {
      void refreshNavCounts();
    }
  }, [pathname, refreshNavCounts, user]);

  const value = useMemo(
    () => ({
      counts,
      refreshNavCounts,
    }),
    [counts, refreshNavCounts],
  );

  return <NavCountsContext.Provider value={value}>{children}</NavCountsContext.Provider>;
}

function useNavCounts(): NavCountsContextValue {
  const context = useContext(NavCountsContext);

  if (!context) {
    throw new Error("useNavCounts must be used within NavCountsProvider.");
  }

  return context;
}

export { NavCountsProvider, useNavCounts };
