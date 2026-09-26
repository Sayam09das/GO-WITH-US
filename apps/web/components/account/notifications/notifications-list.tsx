"use client";

import type { NotificationSummary } from "@gowithus/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  buildNotificationTimeline,
  formatNotificationTime,
  notificationIcon,
} from "@/lib/account/notifications/notification-display";
import { cn } from "@/lib/utils";

interface NotificationsListProps {
  items: NotificationSummary[];
  onMarkRead: (notificationId: string) => void;
}

function NotificationsList({ items, onMarkRead }: NotificationsListProps) {
  const sections = buildNotificationTimeline(items);

  return (
    <div className="flex flex-col gap-10">
      {sections.map((section) => (
        <section key={section.id} aria-labelledby={`notifications-${section.id}`}>
          <h2
            id={`notifications-${section.id}`}
            className="label-text mb-4 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
          >
            {section.label}
          </h2>
          <ul className="divide-y divide-border/60 border-y border-border/60">
            {section.items.map((item) => {
              const Icon = notificationIcon(item);

              return (
                <li key={item.id}>
                  <article className="flex gap-4 py-5 sm:gap-5 sm:py-6">
                    <div className="flex shrink-0 flex-col items-center gap-3 pt-0.5">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "size-2 rounded-full",
                          item.isRead
                            ? "bg-border"
                            : "bg-primary shadow-[0_0_0_3px_rgba(255,105,25,0.18)]",
                        )}
                      />
                      <div className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <Icon aria-hidden="true" className="size-4" />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <h3
                          className={cn(
                            "text-sm leading-snug text-heading sm:text-base",
                            item.isRead ? "font-medium" : "font-semibold",
                          )}
                        >
                          {item.title}
                        </h3>
                        <time
                          dateTime={item.createdAt}
                          className="shrink-0 text-xs text-muted-foreground"
                        >
                          {formatNotificationTime(item.createdAt)}
                        </time>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                      {item.action ? (
                        <Link
                          href={item.action.href}
                          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-[#f55a0b]"
                          onClick={() => {
                            if (!item.isRead) {
                              onMarkRead(item.id);
                            }
                          }}
                        >
                          {item.action.label}
                          <ArrowRight aria-hidden="true" className="size-3.5" />
                        </Link>
                      ) : !item.isRead ? (
                        <button
                          type="button"
                          className="mt-3 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-heading hover:underline"
                          onClick={() => onMarkRead(item.id)}
                        >
                          Mark as read
                        </button>
                      ) : null}
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

export { NotificationsList };
