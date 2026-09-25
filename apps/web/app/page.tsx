import { HomeHero } from "@/components/hero";
import { AboutSection } from "@/components/landing/about";
import { BuildYourJourneySection } from "@/components/landing/build-your-journey";
import { FeaturedExperiencesSection } from "@/components/landing/featured-experiences";
import { FinalCtaSection } from "@/components/landing/final-cta";
import { PlacesToStaySection } from "@/components/landing/places-to-stay";
import { PopularDestinationsSection } from "@/components/landing/popular-destinations";
import { StayInspiredSection } from "@/components/landing/stay-inspired";
import { TopDestinationSection } from "@/components/landing/top-destination";
import { TravelJournalSection } from "@/components/landing/travel-journal";
import { WhatWeGiveSection } from "@/components/landing/what-we-give";
import { getPopularDestinations } from "@/lib/api/destinations";
import { getFeaturedExperiences } from "@/lib/api/experiences";
import { getJournalStories } from "@/lib/api/journal";
import { getFeaturedStay, getSupportingStays } from "@/lib/api/stays";

export default async function HomePage() {
  const [destinations, featuredStay, supportingStays, experiences, journalStories] =
    await Promise.all([
      getPopularDestinations(6),
      getFeaturedStay(),
      getSupportingStays(),
      getFeaturedExperiences(),
      getJournalStories(),
    ]);

  return (
    <main>
      <HomeHero />
      <AboutSection />
      <WhatWeGiveSection />
      <TopDestinationSection />
      <PopularDestinationsSection destinations={destinations} />
      <PlacesToStaySection featured={featuredStay} supportingStays={supportingStays} />
      <FeaturedExperiencesSection experiences={experiences} />
      <TravelJournalSection stories={journalStories} />
      <BuildYourJourneySection />
      <FinalCtaSection />
      <StayInspiredSection />
    </main>
  );
}
