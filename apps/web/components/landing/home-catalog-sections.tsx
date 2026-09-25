import { FeaturedExperiencesSection } from "@/components/landing/featured-experiences";
import { PlacesToStaySection } from "@/components/landing/places-to-stay";
import { PopularDestinationsSection } from "@/components/landing/popular-destinations";
import { TravelJournalSection } from "@/components/landing/travel-journal";
import { getPopularDestinations } from "@/lib/api/destinations";
import { getFeaturedExperiences } from "@/lib/api/experiences";
import { getJournalStories } from "@/lib/api/journal";
import { getFeaturedStay, getSupportingStays } from "@/lib/api/stays";

export async function HomeCatalogSections() {
  const [destinations, featuredStay, supportingStays, experiences, journalStories] =
    await Promise.all([
      getPopularDestinations(6),
      getFeaturedStay(),
      getSupportingStays(),
      getFeaturedExperiences(),
      getJournalStories(),
    ]);

  return (
    <>
      <PopularDestinationsSection destinations={destinations} />
      <PlacesToStaySection featured={featuredStay} supportingStays={supportingStays} />
      <FeaturedExperiencesSection experiences={experiences} />
      <TravelJournalSection stories={journalStories} />
    </>
  );
}
