import "server-only";

import { cookies } from "next/headers";
import { apiFetch } from "./client";

export async function serverApiFetch<T>(
  path: string,
  options: Parameters<typeof apiFetch>[1] = {},
): Promise<T> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((entry) => `${entry.name}=${entry.value}`)
    .join("; ");

  return apiFetch<T>(path, {
    ...options,
    headers: {
      ...options.headers,
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
  });
}
