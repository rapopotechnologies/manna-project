import { Suspense } from "react";
import { AdminLoading, AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/auth";
import type { Json } from "@/lib/supabase/database.types";
import { restoreVersion } from "./actions";

export default function HistoryPage({ searchParams }: PageProps<"/admin/history">) {
  return (
    <Suspense fallback={<AdminLoading />}>
      <History searchParams={searchParams} />
    </Suspense>
  );
}

const TABLE_NAMES: Record<string, string> = {
  products: "product",
  hidden_verses: "hidden verse",
  collections: "collection",
  kids_questions: "kids question",
  admins: "team member",
};
const FIELD_NAMES: Record<string, string> = {
  pairs_with: "pairs well with",
  etsy_url: "Etsy link",
  sort_order: "order",
  collection_id: "collection",
};
const RESTORABLE = new Set(["products", "hidden_verses", "collections"]);

function changedFields(before: Json | null, after: Json | null): string[] {
  if (!before || !after || typeof before !== "object" || typeof after !== "object" || Array.isArray(before) || Array.isArray(after)) return [];
  return Object.keys(after)
    .filter((k) => k !== "updated_at" && JSON.stringify(before[k]) !== JSON.stringify(after[k]))
    .map((k) => FIELD_NAMES[k] ?? k.replace(/_/g, " "));
}

async function History({ searchParams }: { searchParams: PageProps<"/admin/history">["searchParams"] }) {
  const admin = await requireAdmin();
  const { restored, error } = await searchParams;
  const { data } = await admin.supabase.from("change_log").select("*").neq("actor", "system").order("at", { ascending: false }).limit(100);

  return (
    <AdminShell
      admin={admin}
      title="Change history"
      intro="Every change anyone on the team makes. Products, hidden verses and collections can be put back the way they were before a change."
    >
      {restored && <p className="notice notice-ok" role="status">Restored {String(restored)}. The site is updated.</p>}
      {error && <p className="notice notice-error" role="alert">That change can’t be restored.</p>}
      <section className="panel">
        {(data ?? []).length === 0 && <p className="muted">No changes yet. Edits made in the admin will show up here.</p>}
        <ul className="history-list">
          {(data ?? []).map((c) => {
            const fields = c.action === "update" ? changedFields(c.before, c.after) : [];
            if (c.action === "update" && fields.length === 0) return null;
            const verb = c.action === "insert" ? "added" : c.action === "delete" ? "removed" : "edited";
            return (
              <li key={c.id}>
                <time dateTime={c.at}>
                  {new Date(c.at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/Los_Angeles" })}
                </time>
                <span>
                  <b>{c.actor}</b> {verb} {TABLE_NAMES[c.target_table] ?? c.target_table} <code>{c.target_id}</code>
                  {fields.length > 0 && <span className="changed"> · {fields.join(", ")}</span>}
                </span>
                {RESTORABLE.has(c.target_table) && c.before ? (
                  <form action={restoreVersion}>
                    <input type="hidden" name="id" value={c.id} />
                    <button className="icon-btn" type="submit">Restore previous</button>
                  </form>
                ) : (
                  <span />
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </AdminShell>
  );
}
