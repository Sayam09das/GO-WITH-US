import { randomUUID } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";
import { AppError } from "./errors.js";

let client: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (!env.supabaseUrl || !env.supabaseSecretKey) {
    throw new AppError(
      503,
      "STORAGE_NOT_CONFIGURED",
      "File storage is not configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY.",
    );
  }

  if (!client) {
    client = createClient(env.supabaseUrl, env.supabaseSecretKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return client;
}

function sanitizeFileName(name: string): string {
  return name
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

export async function uploadUserFile(input: {
  bucket: string;
  userId: string;
  fileName: string;
  mimeType: string;
  buffer: Buffer;
}): Promise<{ storagePath: string; publicUrl: string }> {
  const supabase = getSupabaseClient();
  const safeName = sanitizeFileName(input.fileName);
  const storagePath = `${input.userId}/${randomUUID()}-${safeName}`;

  const { error } = await supabase.storage.from(input.bucket).upload(storagePath, input.buffer, {
    contentType: input.mimeType,
    upsert: false,
  });

  if (error) {
    throw new AppError(502, "STORAGE_UPLOAD_FAILED", error.message);
  }

  const { data } = supabase.storage.from(input.bucket).getPublicUrl(storagePath);

  return {
    storagePath,
    publicUrl: data.publicUrl,
  };
}

export async function deleteUserFile(input: {
  bucket: string;
  storagePath: string;
}): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.storage.from(input.bucket).remove([input.storagePath]);

  if (error) {
    throw new AppError(502, "STORAGE_DELETE_FAILED", error.message);
  }
}

export function isStorageConfigured(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseSecretKey);
}

export { env as storageEnv };
