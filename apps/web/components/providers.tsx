"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { LenisProvider } from "@/lib/animation";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <TooltipProvider>
      <LenisProvider>{children}</LenisProvider>
    </TooltipProvider>
  );
}
