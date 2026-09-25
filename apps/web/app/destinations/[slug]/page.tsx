import { MapPin, Star } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getDestinationBySlug } from "@/lib/api/destinations";
import { buildPageMetadata, buildPageTitle, trimDescription } from "@/lib/seo";

type DestinationDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: DestinationDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);

  if (!destination) {
    return buildPageMetadata({
      title: buildPageTitle("Destination"),
      description: "Destination not found.",
      path: `/destinations/${slug}`,
    });
  }

  return buildPageMetadata({
    title: buildPageTitle(destination.title),
    description: trimDescription(destination.overview),
    path: `/destinations/${destination.slug}`,
  });
}

export default async function DestinationDetailPage({ params }: DestinationDetailPageProps) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  return (
    <main>
      <section className="relative overflow-hidden bg-background">
        <div className="container-travel grid gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-14">
          <div className="flex flex-col gap-5">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Destination
            </p>
            <h1 className="section-heading text-4xl text-heading sm:text-5xl">
              {destination.title}
            </h1>
            <p className="inline-flex items-center gap-2 text-muted-foreground">
              <MapPin aria-hidden="true" className="size-4 text-primary" />
              {destination.region}, {destination.country}
            </p>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
              {destination.overview}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <Star aria-hidden="true" className="size-3.5 fill-current" />
                {destination.rating.toFixed(1)}
              </span>
              <span className="rounded-full bg-soft-gray px-3 py-1 text-sm text-muted-foreground">
                {destination.budgetTier}
              </span>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
            <Image
              src={destination.heroImage}
              alt={destination.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="travel-section bg-soft-gray">
        <div className="container-travel grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="section-heading text-2xl text-heading sm:text-3xl">Highlights</h2>
            <ul className="mt-5 space-y-3 text-muted-foreground">
              {destination.highlights.map((highlight) => (
                <li key={highlight} className="rounded-2xl bg-background px-4 py-3">
                  {highlight}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            {destination.bestTimeToVisit ? (
              <div className="rounded-[1.25rem] bg-background p-5">
                <h3 className="font-semibold text-heading">Best time to visit</h3>
                <p className="mt-2 text-sm text-muted-foreground">{destination.bestTimeToVisit}</p>
              </div>
            ) : null}
            {destination.transportTips ? (
              <div className="rounded-[1.25rem] bg-background p-5">
                <h3 className="font-semibold text-heading">Getting around</h3>
                <p className="mt-2 text-sm text-muted-foreground">{destination.transportTips}</p>
              </div>
            ) : null}
            <Button asChild>
              <Link href="/destinations">Explore more destinations</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
