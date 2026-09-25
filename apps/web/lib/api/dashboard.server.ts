import "server-only";

import type { DashboardOverview } from "@gowithus/types";
import { serverApiFetch } from "./server";

export async function getDashboardOverview(): Promise<DashboardOverview | null> {
  try {
    return await serverApiFetch<DashboardOverview>("/dashboard");
  } catch {
    return null;
  }
}
