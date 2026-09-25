import { MapPin } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingRequestForm } from "@/components/catalog/booking-request-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getExperienceBySlug } from "@/lib/api/experiences";
import {
  buildExperienceTitle,
  buildPageMetadata,
  buildPageTitle,
  trimDescription,
} from "@/lib/seo";
import { cn } from "@/lib/utils";

type ExperienceDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ExperienceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const experience = await getExperienceBySlug(slug);

  if (!experience) {
    return buildPageMetadata({
      title: buildPageTitle("Experience"),
      description: "Experience not found.",
      path: `/experiences/${slug}`,
    });
  }

  return buildPageMetadata({
    title: buildExperienceTitle(experience.title, experience.destination),
    description: trimDescription(experience.description),
    path: `/experiences/${experience.slug}`,
  });
}

export default async function ExperienceDetailPage({ params }: ExperienceDetailPageProps) {
  const { slug } = await params;
  const experience = await getExperienceBySlug(slug);

  if (!experience) {
    notFound();
  }

  return (
    <main>
      <section className="relative overflow-hidden bg-background">
        <div className="container-travel grid gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-14">
          <div className="flex flex-col gap-5">
            <Badge
              variant="secondary"
              className="w-fit text-[0.6875rem] uppercase tracking-[0.12em]"
            >
              {experience.categoryLabel}
            </Badge>
            <h1 className="section-heading text-4xl text-heading sm:text-5xl">
              {experience.title}
            </h1>
            <p className="inline-flex items-center gap-2 text-muted-foreground">
              <MapPin aria-hidden="true" className="size-4 text-primary" />
              {experience.destination}
            </p>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
              {experience.description}
            </p>
            <Button asChild variant="outline" className="w-fit">
              <Link href="/experiences">Browse all experiences</Link>
            </Button>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
            <Image
              src={experience.heroImage}
              alt={experience.imageAlt}
              fill
              priority
              className={cn("object-cover", experience.objectPosition ?? "object-center")}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="travel-section bg-soft-gray">
        <div className="container-travel grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <div className="space-y-4">
            <h2 className="section-heading text-2xl text-heading sm:text-3xl">What to expect</h2>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
              {experience.description}
            </p>
          </div>

          <BookingRequestForm
            type="EXPERIENCE"
            itemId={experience.id}
            itemName={experience.title}
          />
        </div>
      </section>
    </main>
  );
}
