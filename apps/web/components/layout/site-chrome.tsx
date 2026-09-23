"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { Navbar } from "@/components/navigation";
import { isAuthChromePath } from "@/lib/navigation/auth-routes";

interface SiteChromeProps {
  children: React.ReactNode;
}

function SiteChrome({ children }: SiteChromeProps) {
  const pathname = usePathname();
  const hideGlobalChrome = isAuthChromePath(pathname);

  if (hideGlobalChrome) {
    return children;
  }

  return (
    <>
      <Navbar />
      {children}
      <SiteFooter />
    </>
  );
}

export { SiteChrome };
