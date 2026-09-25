import { randomBytes } from "node:crypto";
import type { ItemType } from "../generated/client.js";

const REFERENCE_PREFIX = "GWU-";

export function generateBookingReference(): string {
  const suffix = randomBytes(3).toString("hex").toUpperCase();
  return `${REFERENCE_PREFIX}${suffix}`;
}

export function mapReviewTargetType(value: string): ItemType | null {
  switch (value.toUpperCase()) {
    case "DESTINATION":
      return "destination";
    case "STAY":
      return "stay";
    case "EXPERIENCE":
      return "experience";
    case "RESTAURANT":
      return "restaurant";
    default:
      return null;
  }
}

export function buildRatingDistribution(counts: Record<number, number>) {
  return {
    5: counts[5] ?? 0,
    4: counts[4] ?? 0,
    3: counts[3] ?? 0,
    2: counts[2] ?? 0,
    1: counts[1] ?? 0,
  };
}
