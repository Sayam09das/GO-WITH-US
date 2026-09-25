import { MapPin } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingRequestForm } from "@/components/catalog/booking-request-form";
import { ReviewsSection } from "@/components/catalog/reviews-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listStayReviews } from "@/lib/api/reviews";
import { getStayBySlug } from "@/lib/api/stays";
import { buildPageMetadata, buildPageTitle, buildStayTitle, trimDescription } from "@/lib/seo";
import { cn } from "@/lib/utils";

type StayDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: StayDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const stay = await getStayBySlug(slug);

  if (!stay) {
    return buildPageMetadata({
      title: buildPageTitle("Stay"),
      description: "Stay not found.",
      path: `/stays/${slug}`,
    });
  }

  return buildPageMetadata({
    title: buildStayTitle(stay.name, stay.destination),
    description: trimDescription(stay.description),
    path: `/stays/${stay.slug}`,
  });
}

export default async function StayDetailPage({ params }: StayDetailPageProps) {
  const { slug } = await params;
  const stay = await getStayBySlug(slug);

  if (!stay) {
    notFound();
  }

  const reviews = await listStayReviews(stay.id);

  return (
    <main>
      <section className="relative overflow-hidden bg-background">
        <div className="container-travel grid gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-14">
          <div className="flex flex-col gap-5">
            <Badge
              variant="secondary"
              className="w-fit text-[0.6875rem] uppercase tracking-[0.12em]"
            >
              {stay.propertyTypeLabel}
            </Badge>
            <h1 className="section-heading text-4xl text-heading sm:text-5xl">{stay.name}</h1>
            <p className="inline-flex items-center gap-2 text-muted-foreground">
              <MapPin aria-hidden="true" className="size-4 text-primary" />
              {stay.destination}
            </p>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
              {stay.description}
            </p>
            <Button asChild variant="outline" className="w-fit">
              <Link href="/stays">Browse all stays</Link>
            </Button>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
            <Image
              src={stay.heroImage}
              alt={stay.imageAlt}
              fill
              priority
              className={cn("object-cover", stay.objectPosition ?? "object-center")}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="travel-section bg-soft-gray">
        <div className="container-travel grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="section-heading text-2xl text-heading sm:text-3xl">About this stay</h2>
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
                {stay.description}
              </p>
            </div>
            <ReviewsSection data={reviews} />
          </div>

          <BookingRequestForm type="STAY" itemId={stay.id} itemName={stay.name} />
        </div>
      </section>
    </main>
  );
}
