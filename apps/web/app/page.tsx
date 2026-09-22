import { HomeHero } from "@/components/hero";
import { AboutSection } from "@/components/landing/about";
import { BuildYourJourneySection } from "@/components/landing/build-your-journey";
import { FeaturedExperiencesSection } from "@/components/landing/featured-experiences";
import { FinalCtaSection } from "@/components/landing/final-cta";
import { PlacesToStaySection } from "@/components/landing/places-to-stay";
import { PopularDestinationsSection } from "@/components/landing/popular-destinations";
import { TopDestinationSection } from "@/components/landing/top-destination";
import { TravelJournalSection } from "@/components/landing/travel-journal";
import { WhatWeGiveSection } from "@/components/landing/what-we-give";

export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <AboutSection />
      <WhatWeGiveSection />
      <TopDestinationSection />
      <PopularDestinationsSection />
      <PlacesToStaySection />
      <FeaturedExperiencesSection />
      <TravelJournalSection />
      <BuildYourJourneySection />
      <FinalCtaSection />
    </main>
  );
}
