import { getSupportingJournalStories } from "@/lib/api/journal";
import type { JournalStory } from "@/types/journal";
import {
  DASHBOARD_INSPIRATION_FEATURED,
  DASHBOARD_INSPIRATION_SUPPORTING_COUNT,
  type DashboardInspirationFeatured,
} from "./inspiration-config";

export interface DashboardInspirationContent {
  featured: DashboardInspirationFeatured;
  supporting: JournalStory[];
}

export async function getDashboardInspiration(): Promise<DashboardInspirationContent> {
  const supporting = (await getSupportingJournalStories()).slice(
    0,
    DASHBOARD_INSPIRATION_SUPPORTING_COUNT,
  );

  return {
    featured: DASHBOARD_INSPIRATION_FEATURED,
    supporting,
  };
}
