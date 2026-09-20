/** Returns true when `pathname` matches a nav item, including nested routes. */
export function isNavItemActive(pathname: string, match: string): boolean {
  if (match === "/") {
    return pathname === "/";
  }

  return pathname === match || pathname.startsWith(`${match}/`);
}

export function isAccountActive(pathname: string): boolean {
  return pathname === "/sign-in" || pathname.startsWith("/account");
}
