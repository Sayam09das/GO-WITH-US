import { ArrowRight, Compass, MapPin, Sparkles, Tent } from "lucide-react";
import Link from "next/link";
import { DashboardExplorePanel } from "@/components/account/dashboard/dashboard-explore-panel";
import { getExploreDestinations } from "@/lib/account";

const DISCOVER_QUICK_LINKS = [
  {
    href: "/destinations",
    label: "Destinations",
    description: "Browse regions, cities, and curated guides.",
    icon: MapPin,
  },
  {
    href: "/stays",
    label: "Places to stay",
    description: "Hotels, retreats, and stays worth the detour.",
    icon: Tent,
  },
  {
    href: "/experiences",
    label: "Experiences",
    description: "Guided moments, workshops, and local rituals.",
    icon: Sparkles,
  },
  {
    href: "/search",
    label: "Search",
    description: "Find anything across the GO WITH US catalog.",
    icon: Compass,
  },
] as const;

function AccountDiscoverContent() {
  const destinations = getExploreDestinations();

  return (
    <div className="flex flex-col gap-12 sm:gap-14">
      <section aria-labelledby="discover-browse-heading">
        <h2
          id="discover-browse-heading"
          className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
        >
          Browse catalogs
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {DISCOVER_QUICK_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex min-h-[7.5rem] flex-col justify-between rounded-[1.25rem] border border-border/60 bg-background p-5 shadow-sm transition-colors hover:border-border"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-section text-primary">
                    <Icon aria-hidden="true" className="size-5" />
                  </div>
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-heading"
                  />
                </div>
                <div className="mt-4">
                  <p className="font-medium text-heading">{item.label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="discover-picks-heading">
        <div className="max-w-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Editor&apos;s picks
          </p>
          <h2
            id="discover-picks-heading"
            className="mt-2 text-xl font-semibold tracking-tight text-heading sm:text-[1.375rem]"
          >
            Places worth going
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Start with a few destinations that pair well with unhurried planning.
          </p>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:grid-rows-2 lg:gap-5">
          {destinations.map((destination) => (
            <DashboardExplorePanel key={destination.id} destination={destination} />
          ))}
        </div>
      </section>
    </div>
  );
}

export { AccountDiscoverContent };
