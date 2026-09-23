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

export function getDashboardInspiration(): DashboardInspirationContent {
  const supporting = getSupportingJournalStories().slice(0, DASHBOARD_INSPIRATION_SUPPORTING_COUNT);

  return {
    featured: DASHBOARD_INSPIRATION_FEATURED,
    supporting,
  };
}
