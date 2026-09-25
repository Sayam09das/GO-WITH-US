"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { DASHBOARD_USER, type DashboardUser } from "@/lib/account/dashboard/config";
import { mapUserProfileToDashboardUser } from "@/lib/api/dashboard-mappers";
import { getUserProfile } from "@/lib/api/users";

const DashboardUserContext = createContext<DashboardUser>(DASHBOARD_USER);

export function DashboardUserProvider({
  user: initialUser,
  children,
}: {
  user?: DashboardUser | null;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<DashboardUser>(initialUser ?? DASHBOARD_USER);

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
      return;
    }

    let cancelled = false;

    void getUserProfile().then((profile) => {
      if (!cancelled && profile) {
        setUser(mapUserProfileToDashboardUser(profile));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [initialUser]);

  return <DashboardUserContext.Provider value={user}>{children}</DashboardUserContext.Provider>;
}

export function useDashboardUser(): DashboardUser {
  return useContext(DashboardUserContext);
}
