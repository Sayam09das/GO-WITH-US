import { FeaturedExperiencesSection } from "@/components/landing/featured-experiences";
import { PlacesToStaySection } from "@/components/landing/places-to-stay";
import { PopularDestinationsSection } from "@/components/landing/popular-destinations";
import { TravelInspirationSection } from "@/components/landing/travel-inspiration";
import { TravelJournalSection } from "@/components/landing/travel-journal";
import { getPopularDestinations } from "@/lib/api/destinations";
import { getFeaturedExperiences } from "@/lib/api/experiences";
import { getInspirationStories } from "@/lib/api/inspiration";
import { getJournalStories } from "@/lib/api/journal";
import { getFeaturedStay, getSupportingStays } from "@/lib/api/stays";
import { withApiFallback } from "@/lib/api/with-api-fallback";
import { FEATURED_EXPERIENCES_HOMEPAGE_SHOWCASE } from "@/lib/landing/featured-experiences";

export async function HomeCatalogSections() {
  const [
    experiencesRaw,
    destinations,
    featuredStay,
    supportingStays,
    inspirationStories,
    journalStories,
  ] = await Promise.all([
    getFeaturedExperiences(),
    getPopularDestinations(6),
    withApiFallback(getFeaturedStay(), undefined),
    withApiFallback(getSupportingStays(), []),
    withApiFallback(getInspirationStories(), []),
    withApiFallback(getJournalStories(), []),
  ]);

  const experiences =
    experiencesRaw.length > 0 ? experiencesRaw : FEATURED_EXPERIENCES_HOMEPAGE_SHOWCASE;

  const inspirationFeatured =
    inspirationStories.find((story) => story.isFeatured) ?? inspirationStories[0];

  return (
    <>
      <PopularDestinationsSection destinations={destinations} />
      <PlacesToStaySection featured={featuredStay} supportingStays={supportingStays} />
      <FeaturedExperiencesSection experiences={experiences} />
      <TravelInspirationSection featured={inspirationFeatured} stories={inspirationStories} />
      <TravelJournalSection stories={journalStories} />
    </>
  );
}
