/** Routes that use a minimal chrome layout without global navbar or footer. */
export const AUTH_CHROME_PATHS = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
] as const;

export function isAuthChromePath(pathname: string): boolean {
  return AUTH_CHROME_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}
