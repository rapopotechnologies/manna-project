// Supabase connection details. The publishable key is safe to expose; access is
// controlled by row-level security in the database.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

/** False when the env vars are missing, e.g. a local build without .env.local. */
export const hasSupabase = Boolean(SUPABASE_URL && SUPABASE_KEY);
