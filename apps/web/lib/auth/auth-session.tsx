"use client";

import type { PublicUser } from "@gowithus/types";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getMe } from "@/lib/api/auth";
import { ApiRequestError } from "@/lib/api/client";

type AuthSessionContextValue = {
  user: PublicUser | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  clearUser: () => void;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const response = await getMe();
      setUser(response.user);
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 401) {
        setUser(null);
        return;
      }
      setUser(null);
    }
  }, []);

  const clearUser = useCallback(() => {
    setUser(null);
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      await refreshUser();
      if (!cancelled) {
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [refreshUser]);

  useEffect(() => {
    const onAuthChanged = () => {
      void refreshUser();
    };

    window.addEventListener("gowithus:auth-changed", onAuthChanged);
    return () => window.removeEventListener("gowithus:auth-changed", onAuthChanged);
  }, [refreshUser]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      refreshUser,
      clearUser,
    }),
    [user, isLoading, refreshUser, clearUser],
  );

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

function useAuthSession(): AuthSessionContextValue {
  const context = useContext(AuthSessionContext);

  if (!context) {
    throw new Error("useAuthSession must be used within AuthSessionProvider.");
  }

  return context;
}

export { AuthSessionProvider, useAuthSession };
