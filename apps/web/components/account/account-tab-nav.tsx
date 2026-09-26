"use client";

import { cn } from "@/lib/utils";

export interface AccountTabItem<T extends string> {
  id: T;
  label: string;
  count?: number;
}

interface AccountTabNavProps<T extends string> {
  tabs: readonly AccountTabItem<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  ariaLabel: string;
  className?: string;
}

function AccountTabNav<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  ariaLabel,
  className,
}: AccountTabNavProps<T>) {
  return (
    <nav aria-label={ariaLabel} className={cn("mb-8", className)}>
      <div role="tablist" className="flex flex-wrap gap-x-8 gap-y-2 border-b border-border/60">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative -mb-px pb-3 text-sm font-medium transition-colors",
                isActive ? "text-heading" : "text-muted-foreground hover:text-heading",
              )}
            >
              {tab.label}
              {tab.count != null && tab.count > 0 ? (
                <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                  · {tab.count}
                </span>
              ) : null}
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

export { AccountTabNav };
