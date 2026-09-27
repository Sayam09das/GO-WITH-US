import { FeaturedExperiencesSection } from "@/components/landing/featured-experiences";
import { PlacesToStaySection } from "@/components/landing/places-to-stay";
import { PopularDestinationsSection } from "@/components/landing/popular-destinations";
import { TravelInspirationSection } from "@/components/landing/travel-inspiration";
import { TravelJournalSection } from "@/components/landing/travel-journal";
import { getPopularDestinations } from "@/lib/api/destinations";
import { getAllExperiences } from "@/lib/api/experiences";
import { getInspirationStories } from "@/lib/api/inspiration";
import { getJournalStories } from "@/lib/api/journal";
import { getAllStays } from "@/lib/api/stays";
import { withApiFallback } from "@/lib/api/with-api-fallback";
import {
  FEATURED_EXPERIENCES_HOMEPAGE_SHOWCASE,
  mergeExperienceHomeCatalog,
} from "@/lib/landing/featured-experiences";
import { selectHomepageInspirationStories } from "@/lib/landing/travel-inspiration";

export async function HomeCatalogSections() {
  const [experiencesRaw, destinations, staysCatalog, inspirationStories, journalStories] =
    await Promise.all([
      withApiFallback(getAllExperiences(), []),
      getPopularDestinations(6),
      withApiFallback(getAllStays(), []),
      withApiFallback(getInspirationStories(), []),
      withApiFallback(getJournalStories(), []),
    ]);

  const experiences = mergeExperienceHomeCatalog(
    experiencesRaw,
    FEATURED_EXPERIENCES_HOMEPAGE_SHOWCASE,
  );

  const inspirationFeatured =
    inspirationStories.find((story) => story.isFeatured) ?? inspirationStories[0];

  const inspirationHome = selectHomepageInspirationStories(inspirationStories, inspirationFeatured);

  return (
    <>
      <PopularDestinationsSection destinations={destinations} />
      <PlacesToStaySection stays={staysCatalog} />
      <FeaturedExperiencesSection experiences={experiences} />
      <TravelInspirationSection
        featured={inspirationHome.featured}
        stories={inspirationHome.stories}
      />
      <TravelJournalSection stories={journalStories} />
    </>
  );
}
