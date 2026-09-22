import { HomeHero } from "@/components/hero";
import { AboutSection } from "@/components/landing/about";
import { FeaturedExperiencesSection } from "@/components/landing/featured-experiences";
import { PopularDestinationsSection } from "@/components/landing/popular-destinations";
import { TopDestinationSection } from "@/components/landing/top-destination";
import { TravelInspirationSection } from "@/components/landing/travel-inspiration";
import { WhatWeGiveSection } from "@/components/landing/what-we-give";

export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <AboutSection />
      <WhatWeGiveSection />
      <TopDestinationSection />
      <PopularDestinationsSection />
      <FeaturedExperiencesSection />
      <TravelInspirationSection />
    </main>
  );
}
