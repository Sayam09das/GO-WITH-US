import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RECENTLY_VIEWED_EMPTY_COPY, RECENTLY_VIEWED_LINKS } from "@/lib/account";

function DashboardRecentEmpty() {
  return (
    <div
      data-dash-recent-card
      className="rounded-xl border border-dashed border-border/60 bg-muted/15 px-5 py-8 will-change-transform sm:px-6 sm:py-9"
    >
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 text-center">
        <h3 className="text-lg font-semibold tracking-tight text-heading">
          {RECENTLY_VIEWED_EMPTY_COPY.heading}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {RECENTLY_VIEWED_EMPTY_COPY.supporting}
        </p>
        <Button asChild variant="outline" size="sm" className="mt-1 rounded-full px-4">
          <Link href={RECENTLY_VIEWED_LINKS.explore}>
            {RECENTLY_VIEWED_EMPTY_COPY.action}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export { DashboardRecentEmpty };
