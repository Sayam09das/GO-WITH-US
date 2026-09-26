"use client";

import type { NotificationSummary } from "@gowithus/types";
import { Bell, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AccountTabNav } from "@/components/account/account-tab-nav";
import { EditorialPageHeader } from "@/components/account/editorial-page-header";
import { NotificationsList } from "@/components/account/notifications/notifications-list";
import { EmptyState } from "@/components/states";
import { Button } from "@/components/ui/button";
import {
  countNotificationsByTab,
  filterNotificationsByTab,
} from "@/lib/account/notifications/notification-display";
import {
  NOTIFICATIONS_EMPTY_COPY,
  NOTIFICATIONS_PAGE_COPY,
  NOTIFICATIONS_POLL_INTERVAL_MS,
  NOTIFICATIONS_TABS,
  NOTIFICATIONS_UPDATED_EVENT,
  type NotificationsTabId,
} from "@/lib/account/notifications/notifications-copy";
import { ApiRequestError } from "@/lib/api/client";
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/api/notifications";

function dispatchNotificationsUpdated(unreadCount: number) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(NOTIFICATIONS_UPDATED_EVENT, { detail: { unreadCount } }));
}

function NotificationsPageShell() {
  const [items, setItems] = useState<NotificationSummary[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState<NotificationsTabId>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadNotifications = useCallback(async (options?: { silent?: boolean }) => {
    if (options?.silent) {
      setIsRefreshing(true);
    }

    try {
      const response = await listNotifications();
      setItems(response.items);
      setUnreadCount(response.unreadCount);
      setLoadError(null);
      dispatchNotificationsUpdated(response.unreadCount);
    } catch (cause) {
      if (cause instanceof ApiRequestError && cause.status === 401) {
        setAuthError("Sign in to view your notifications.");
        return;
      }

      if (!options?.silent) {
        setLoadError("We couldn't load your notifications right now.");
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadNotifications();

    const interval = window.setInterval(() => {
      if (document.visibilityState !== "visible") {
        return;
      }

      void loadNotifications({ silent: true });
    }, NOTIFICATIONS_POLL_INTERVAL_MS);

    const onFocus = () => {
      void loadNotifications({ silent: true });
    };

    window.addEventListener("focus", onFocus);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [loadNotifications]);

  const tabCounts = useMemo(() => countNotificationsByTab(items), [items]);
  const visibleItems = useMemo(
    () => filterNotificationsByTab(items, activeTab),
    [activeTab, items],
  );

  async function handleMarkAllRead() {
    if (unreadCount === 0 || isMarkingAll) {
      return;
    }

    setIsMarkingAll(true);

    try {
      const remaining = await markAllNotificationsRead();
      setItems((current) =>
        current.map((item) => ({
          ...item,
          isRead: true,
        })),
      );
      setUnreadCount(remaining);
      dispatchNotificationsUpdated(remaining);
    } catch {
      setLoadError("We couldn't mark notifications as read. Try again.");
    } finally {
      setIsMarkingAll(false);
    }
  }

  async function handleMarkRead(notificationId: string) {
    const existing = items.find((item) => item.id === notificationId);
    if (!existing || existing.isRead) {
      return;
    }

    try {
      const updated = await markNotificationRead(notificationId);
      setItems((current) => current.map((item) => (item.id === notificationId ? updated : item)));
      const nextUnread = Math.max(0, unreadCount - 1);
      setUnreadCount(nextUnread);
      dispatchNotificationsUpdated(nextUnread);
    } catch {
      setLoadError("We couldn't update that notification.");
    }
  }

  if (authError) {
    return (
      <div className="container-travel py-10 sm:py-12 lg:py-14">
        <EmptyState title="Notifications unavailable" description={authError} icon={Bell} />
      </div>
    );
  }

  return (
    <div className="container-travel py-10 sm:py-12 lg:py-14">
      <EditorialPageHeader
        eyebrow={NOTIFICATIONS_PAGE_COPY.eyebrow}
        heading={NOTIFICATIONS_PAGE_COPY.heading}
        supporting={NOTIFICATIONS_PAGE_COPY.supporting}
        action={
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-full px-5 sm:w-auto"
            disabled={unreadCount === 0 || isMarkingAll}
            isLoading={isMarkingAll}
            loadingText="Updating…"
            onClick={() => void handleMarkAllRead()}
          >
            {NOTIFICATIONS_PAGE_COPY.markAllRead}
          </Button>
        }
      />

      {isLoading ? (
        <div className="mb-8 flex items-center gap-3 text-sm text-muted-foreground">
          <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
          Loading notifications…
        </div>
      ) : null}

      {loadError ? (
        <p
          role="status"
          className="mb-6 rounded-[1.25rem] border border-border/60 bg-muted/30 px-4 py-3 text-sm text-muted-foreground"
        >
          {loadError}
        </p>
      ) : null}

      {!isLoading ? (
        <>
          <div className="mb-8 flex items-center justify-end">
            {isRefreshing ? (
              <p className="text-xs text-muted-foreground" aria-live="polite">
                Checking for updates…
              </p>
            ) : null}
          </div>

          <AccountTabNav
            tabs={NOTIFICATIONS_TABS.map((tab) => ({
              id: tab.id,
              label: tab.label,
              count: tabCounts[tab.id],
            }))}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            ariaLabel="Notification categories"
          />

          <div className="mt-10 max-w-3xl">
            {items.length === 0 ? (
              <EmptyState
                icon={Bell}
                title={NOTIFICATIONS_EMPTY_COPY.title}
                description={NOTIFICATIONS_EMPTY_COPY.description}
              />
            ) : visibleItems.length === 0 ? (
              <EmptyState
                icon={Bell}
                title="No notifications in this category"
                description="Try another filter or check back when something new arrives."
              />
            ) : (
              <NotificationsList
                items={visibleItems}
                onMarkRead={(id) => void handleMarkRead(id)}
              />
            )}
          </div>

          <section className="mt-14 max-w-3xl border-t border-border/60 pt-10 text-center sm:text-left">
            <p className="text-sm text-muted-foreground">
              {NOTIFICATIONS_PAGE_COPY.settingsPrompt}
            </p>
            <Button asChild variant="link" className="mt-2 h-auto p-0 text-sm font-semibold">
              <Link href={NOTIFICATIONS_PAGE_COPY.settingsHref}>
                {NOTIFICATIONS_PAGE_COPY.settingsAction} →
              </Link>
            </Button>
          </section>
        </>
      ) : null}
    </div>
  );
}

export { NotificationsPageShell };
