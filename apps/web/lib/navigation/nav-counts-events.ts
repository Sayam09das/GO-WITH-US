export const NAV_COUNTS_CHANGED_EVENT = "gowithus:nav-counts-changed";

export function notifyNavCountsChanged(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(NAV_COUNTS_CHANGED_EVENT));
}
