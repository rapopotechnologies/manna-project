import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { SUPABASE_URL } from "./env";

/**
 * Full-access client using the Supabase secret key. Server only, and only after
 * checking the caller is the superadmin (or changing their own password).
 * It bypasses row-level security, so keep its use small.
 */
export function createServiceClient() {
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error("SUPABASE_SECRET_KEY is not set. Add it in Vercel and .env.local.");
  return createClient<Database>(SUPABASE_URL, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export const hasServiceKey = () => Boolean(process.env.SUPABASE_SECRET_KEY);
