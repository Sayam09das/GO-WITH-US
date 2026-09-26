"use client";

import { useCallback, useEffect, useState } from "react";
import {
  NOTIFICATIONS_BADGE_POLL_INTERVAL_MS,
  NOTIFICATIONS_UPDATED_EVENT,
} from "@/lib/account/notifications/notifications-copy";
import { listNotifications } from "@/lib/api/notifications";

function useNotificationUnreadCount(): number {
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const response = await listNotifications();
      setUnreadCount(response.unreadCount);
    } catch {
      // Keep the last known count when the badge poll fails.
    }
  }, []);

  useEffect(() => {
    void refresh();

    const interval = window.setInterval(() => {
      if (document.visibilityState !== "visible") {
        return;
      }

      void refresh();
    }, NOTIFICATIONS_BADGE_POLL_INTERVAL_MS);

    const onUpdated = (event: Event) => {
      const detail = (event as CustomEvent<{ unreadCount?: number }>).detail;
      if (typeof detail?.unreadCount === "number") {
        setUnreadCount(detail.unreadCount);
        return;
      }

      void refresh();
    };

    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, onUpdated);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, onUpdated);
    };
  }, [refresh]);

  return unreadCount;
}

export { useNotificationUnreadCount };
