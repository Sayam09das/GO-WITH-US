"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { LenisProvider } from "@/lib/animation";
import { AuthSessionProvider } from "@/lib/auth";
import { NavCountsProvider } from "@/lib/navigation";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <TooltipProvider>
      <AuthSessionProvider>
        <NavCountsProvider>
          <LenisProvider>{children}</LenisProvider>
        </NavCountsProvider>
      </AuthSessionProvider>
    </TooltipProvider>
  );
}
