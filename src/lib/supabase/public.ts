import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { SUPABASE_KEY, SUPABASE_URL } from "./env";

/** A client with no session, for reading public content inside cached functions. */
export function createPublicClient() {
  return createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
