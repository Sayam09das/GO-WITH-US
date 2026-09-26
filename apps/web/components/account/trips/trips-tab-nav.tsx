"use client";

import type { MyTripsTabId } from "@/lib/account/trips/my-trips-copy";
import { MY_TRIPS_TABS } from "@/lib/account/trips/my-trips-copy";
import { cn } from "@/lib/utils";

interface TripsTabNavProps {
  activeTab: MyTripsTabId;
  onTabChange: (tab: MyTripsTabId) => void;
  counts: Record<MyTripsTabId, number>;
}

function TripsTabNav({ activeTab, onTabChange, counts }: TripsTabNavProps) {
  return (
    <nav aria-label="Trip status" className="mb-10">
      <div role="tablist" className="flex gap-8 border-b border-border/60">
        {MY_TRIPS_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = counts[tab.id];

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`trips-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`trips-panel-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative -mb-px pb-3 text-sm font-medium transition-colors",
                isActive ? "text-heading" : "text-muted-foreground hover:text-heading",
              )}
            >
              {tab.label}
              {count > 0 ? <span className="sr-only">{` (${count})`}</span> : null}
              {isActive ? (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary"
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export { TripsTabNav };
