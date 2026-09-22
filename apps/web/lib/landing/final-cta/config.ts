export const FINAL_CTA_COPY = {
  eyebrow: "START YOUR NEXT CHAPTER",
  headline: "Where will you go next?",
  emoji: "✈️",
  supporting:
    "However you travel — curious, slow, or spontaneous — find the place first, then shape the days around it.",
  accordionTitle: "Choose your next move",
  primaryCta: "Explore destinations",
  primaryHref: "/destinations",
  secondaryCta: "Create a trip",
  secondaryHref: "/trips/new",
} as const;

export interface FinalCtaPrompt {
  id: string;
  question: string;
  answer: string;
  linkLabel: string;
  href: string;
}

export const FINAL_CTA_PROMPTS: FinalCtaPrompt[] = [
  {
    id: "explore-destinations",
    question: "I want to explore somewhere new",
    answer:
      "Browse destinations by region, mood, and season — then save the places that stay with you.",
    linkLabel: "Browse destinations",
    href: "/destinations",
  },
  {
    id: "find-a-stay",
    question: "I need a stay that feels like the trip",
    answer:
      "From cliffside houses to quiet canal rooms, discover stays chosen for character and location.",
    linkLabel: "View stays",
    href: "/stays",
  },
  {
    id: "plan-experiences",
    question: "I want experiences, not just sights",
    answer: "Find local rituals, guided walks, and moments that turn a destination into a memory.",
    linkLabel: "See experiences",
    href: "/experiences",
  },
  {
    id: "start-planning",
    question: "I'm ready to start planning the days",
    answer: "Create a trip, add what you've saved, and organize each day at your own pace.",
    linkLabel: "Create a trip",
    href: "/trips/new",
  },
];
