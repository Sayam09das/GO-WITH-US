import { Suspense } from "react";
import { HomeHero } from "@/components/hero";
import { AboutSection } from "@/components/landing/about";
import { BuildYourJourneySection } from "@/components/landing/build-your-journey";
import { FinalCtaSection } from "@/components/landing/final-cta";
import { HomeCatalogSections } from "@/components/landing/home-catalog-sections";
import { StayInspiredSection } from "@/components/landing/stay-inspired";
import { TopDestinationSection } from "@/components/landing/top-destination";
import { WhatWeGiveSection } from "@/components/landing/what-we-give";
import { CatalogPageSkeleton } from "@/components/states";

export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <AboutSection />
      <WhatWeGiveSection />
      <TopDestinationSection />
      <Suspense fallback={<CatalogPageSkeleton label="Loading featured places…" />}>
        <HomeCatalogSections />
      </Suspense>
      <BuildYourJourneySection />
      <FinalCtaSection />
      <StayInspiredSection />
    </main>
  );
}
