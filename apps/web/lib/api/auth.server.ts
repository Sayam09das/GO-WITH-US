import "server-only";

import type { PublicUser } from "@gowithus/types";
import { redirect } from "next/navigation";
import type { MeResponse } from "./auth";
import { ApiRequestError } from "./client";
import { serverApiFetch } from "./server";

export async function getAuthUser(): Promise<PublicUser | null> {
  try {
    const response = await serverApiFetch<MeResponse>("/auth/me");
    return response.user;
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 401) {
      return null;
    }
    return null;
  }
}

export async function requireAuthUser(): Promise<PublicUser> {
  const user = await getAuthUser();
  if (!user) {
    redirect("/sign-in");
  }
  return user;
}
