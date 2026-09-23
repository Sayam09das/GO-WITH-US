/** Dashboard routes use a dedicated header instead of global navbar/footer. */
export const ACCOUNT_DASHBOARD_PREFIX = "/account";

const DASHBOARD_CHROME_PATHS = ["/account", "/trips", "/saved"] as const;

export function isAccountDashboardPath(pathname: string): boolean {
  return DASHBOARD_CHROME_PATHS.some(
    (base) => pathname === base || pathname.startsWith(`${base}/`),
  );
}
