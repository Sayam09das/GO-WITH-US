export function isDashboardNavActive(pathname: string, match: string): boolean {
  if (match === "/account") {
    return pathname === "/account";
  }

  return pathname === match || pathname.startsWith(`${match}/`);
}
