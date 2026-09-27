import { FeaturedExperiencesSection } from "@/components/landing/featured-experiences";
import { PlacesToStaySection } from "@/components/landing/places-to-stay";
import { PopularDestinationsSection } from "@/components/landing/popular-destinations";
import { TravelInspirationSection } from "@/components/landing/travel-inspiration";
import { TravelJournalSection } from "@/components/landing/travel-journal";
import { CatalogLoadError } from "@/components/states/catalog-load-error";
import { getPopularDestinations } from "@/lib/api/destinations";
import { getAllExperiences } from "@/lib/api/experiences";
import { getInspirationStories } from "@/lib/api/inspiration";
import { getJournalStories } from "@/lib/api/journal";
import { getAllStays } from "@/lib/api/stays";
import { tryApiLoad } from "@/lib/api/with-api-fallback";
import {
  FEATURED_EXPERIENCES_HOMEPAGE_SHOWCASE,
  mergeExperienceHomeCatalog,
} from "@/lib/landing/featured-experiences";
import { selectHomepageInspirationStories } from "@/lib/landing/travel-inspiration";

export async function HomeCatalogSections() {
  const [experiencesLoad, staysLoad, inspirationLoad, journalLoad] = await Promise.all([
    tryApiLoad(getAllExperiences()),
    tryApiLoad(getAllStays()),
    tryApiLoad(getInspirationStories()),
    tryApiLoad(getJournalStories()),
  ]);

  const destinations = await getPopularDestinations(6);

  const catalogFailed = !experiencesLoad.ok && !staysLoad.ok && destinations.length === 0;

  if (catalogFailed) {
    return (
      <section className="container py-16">
        <CatalogLoadError />
      </section>
    );
  }

  const experiences = experiencesLoad.ok
    ? mergeExperienceHomeCatalog(experiencesLoad.value, FEATURED_EXPERIENCES_HOMEPAGE_SHOWCASE)
    : mergeExperienceHomeCatalog([], FEATURED_EXPERIENCES_HOMEPAGE_SHOWCASE);

  const staysCatalog = staysLoad.ok ? staysLoad.value : [];
  const inspirationStories = inspirationLoad.ok ? inspirationLoad.value : [];
  const journalStories = journalLoad.ok ? journalLoad.value : [];

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
