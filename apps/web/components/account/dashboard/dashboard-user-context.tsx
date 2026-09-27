"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { DashboardUser } from "@/lib/account/dashboard/config";
import { mapUserProfileToDashboardUser } from "@/lib/api/dashboard-mappers";
import { getUserProfile } from "@/lib/api/users";

const DashboardUserContext = createContext<DashboardUser | null>(null);

export function DashboardUserProvider({
  user: initialUser,
  children,
}: {
  user: DashboardUser;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<DashboardUser>(initialUser);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  useEffect(() => {
    let cancelled = false;

    void getUserProfile().then((profile) => {
      if (!cancelled && profile) {
        setUser(mapUserProfileToDashboardUser(profile));
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return <DashboardUserContext.Provider value={user}>{children}</DashboardUserContext.Provider>;
}

export function useDashboardUser(): DashboardUser {
  const context = useContext(DashboardUserContext);
  if (!context) {
    throw new Error("useDashboardUser must be used within DashboardUserProvider.");
  }
  return context;
}
