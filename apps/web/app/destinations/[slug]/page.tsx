import { MapPin, Star } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DestinationDetailActions } from "@/components/destinations/detail/destination-detail-actions";
import { DestinationExperienceCard } from "@/components/destinations/detail/destination-experience-card";
import { DestinationRelatedGrid } from "@/components/destinations/detail/destination-related-grid";
import { DestinationStayCard } from "@/components/destinations/detail/destination-stay-card";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { getDestinationBySlugForPage } from "@/lib/api/destinations.server";
import {
  buildBreadcrumbJsonLd,
  buildDestinationJsonLd,
  buildDestinationTitle,
  buildPageMetadata,
  buildPageTitle,
  trimDescription,
} from "@/lib/seo";

type DestinationDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: DestinationDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestinationBySlugForPage(slug);

  if (!destination) {
    return buildPageMetadata({
      title: buildPageTitle("Destination"),
      description: "Destination not found.",
      path: `/destinations/${slug}`,
    });
  }

  return buildPageMetadata({
    title: buildDestinationTitle(destination.title),
    description: trimDescription(destination.overview),
    path: `/destinations/${destination.slug}`,
  });
}

export default async function DestinationDetailPage({ params }: DestinationDetailPageProps) {
  const { slug } = await params;
  const destination = await getDestinationBySlugForPage(slug);

  if (!destination) {
    notFound();
  }

  const hasStays = destination.stays.length > 0;
  const hasExperiences = destination.experiences.length > 0;

  return (
    <main>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Destinations", path: "/destinations" },
            { name: destination.title, path: `/destinations/${destination.slug}` },
          ]),
          buildDestinationJsonLd({
            name: destination.title,
            description: trimDescription(destination.overview),
            path: `/destinations/${destination.slug}`,
            image: destination.heroImage,
          }),
        ]}
      />
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
              <span className="rounded-full bg-soft-gray px-3 py-1 text-sm capitalize text-muted-foreground">
                {destination.budgetTier}
              </span>
              {destination.bestTimeToVisit ? (
                <span className="rounded-full bg-soft-gray px-3 py-1 text-sm text-muted-foreground">
                  Best: {destination.bestTimeToVisit}
                </span>
              ) : null}
            </div>

            <DestinationDetailActions
              destinationId={destination.id}
              destinationTitle={destination.title}
              initialSaved={destination.isSaved}
              primaryStaySlug={destination.stays[0]?.slug}
              primaryExperienceSlug={destination.experiences[0]?.slug}
            />
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
            {destination.currency ? (
              <div className="rounded-[1.25rem] bg-background p-5">
                <h3 className="font-semibold text-heading">Essentials</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Currency: {destination.currency}
                  {destination.primaryLanguage
                    ? ` · Language: ${destination.primaryLanguage}`
                    : null}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="travel-section bg-background">
        <div className="container-travel flex flex-col gap-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="section-heading text-2xl text-heading sm:text-3xl">
                Where to stay in {destination.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Open a stay to choose dates and submit a booking request — no payment until we
                confirm availability.
              </p>
            </div>
            <Button asChild variant="outline" className="shrink-0">
              <Link href="/stays">Browse all stays</Link>
            </Button>
          </div>

          {hasStays ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {destination.stays.map((stay) => (
                <DestinationStayCard key={stay.id} stay={stay} />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.25rem] border border-border/60 bg-soft-gray p-8 text-center">
              <p className="text-muted-foreground">Stays for this destination are being curated.</p>
              <Button asChild className="mt-4">
                <Link href="/stays">Explore stays</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="travel-section bg-soft-gray">
        <div className="container-travel flex flex-col gap-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="section-heading text-2xl text-heading sm:text-3xl">
                Experiences in {destination.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Pick an experience, choose a date, and request a booking from the detail page.
              </p>
            </div>
            <Button asChild variant="outline" className="shrink-0">
              <Link href="/experiences">Browse all experiences</Link>
            </Button>
          </div>

          {hasExperiences ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {destination.experiences.map((experience) => (
                <DestinationExperienceCard key={experience.id} experience={experience} />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.25rem] border border-border/60 bg-background p-8 text-center">
              <p className="text-muted-foreground">
                Experiences for this destination are being curated.
              </p>
              <Button asChild className="mt-4">
                <Link href="/experiences">Explore experiences</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {destination.relatedDestinations.length > 0 ? (
        <section className="travel-section bg-background">
          <div className="container-travel flex flex-col gap-6">
            <h2 className="section-heading text-2xl text-heading sm:text-3xl">
              Related destinations
            </h2>
            <DestinationRelatedGrid related={destination.relatedDestinations} />
          </div>
        </section>
      ) : null}

      <section className="border-t border-border/60 bg-soft-gray py-10">
        <div className="container-travel flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/destinations">Explore more destinations</Link>
          </Button>
          <Button asChild>
            <Link
              href={hasStays ? `/stays/${destination.stays[0]?.slug}#request-booking` : "/stays"}
            >
              {hasStays ? "Book a stay here" : "Find a stay"}
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
