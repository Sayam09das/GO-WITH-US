import type { DashboardOverview } from "@gowithus/types";
import { apiFetch } from "./client";

export async function getDashboardOverview(): Promise<DashboardOverview | null> {
  try {
    return await apiFetch<DashboardOverview>("/dashboard");
  } catch {
    return null;
  }
}
