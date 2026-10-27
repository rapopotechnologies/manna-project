// One-time setup: creates (or resets) the superadmin's login with a temporary password.
// Run from the project folder:  node scripts/create-superadmin-login.mjs
// Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local.

import { readFileSync } from "node:fs";
import { randomInt } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const EMAIL = (process.argv[2] ?? "rapopotechnologies@gmail.com").toLowerCase();

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
);
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SECRET_KEY;
if (!url || !key) {
  console.error("Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY to .env.local first.");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

const { data: team } = await supabase.from("admins").select("role").eq("email", EMAIL).maybeSingle();
if (team?.role !== "superadmin") {
  console.error(`${EMAIL} isn't the superadmin in the admins table. Nothing changed.`);
  process.exit(1);
}

const ALPHABET = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const group = () => Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");
const password = `manna-${group()}-${group()}-${group()}`;

const { data: list, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
if (listError) throw listError;
const existing = list.users.find((u) => u.email?.toLowerCase() === EMAIL);
const attrs = { password, app_metadata: { must_change_password: true } };
const { error } = existing
  ? await supabase.auth.admin.updateUserById(existing.id, attrs)
  : await supabase.auth.admin.createUser({ email: EMAIL, email_confirm: true, ...attrs });
if (error) throw error;

console.log(`\n${existing ? "Reset" : "Created"} the login for ${EMAIL}.`);
console.log(`Temporary password: ${password}`);
console.log("Sign in at /admin/login. You'll be asked to choose your own password straight away.\n");
