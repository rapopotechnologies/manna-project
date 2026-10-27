import Link from "next/link";
import { Suspense } from "react";
import { AdminLoading, AdminShell } from "@/components/admin/AdminShell";
import { CollectionForm } from "@/components/admin/VerseForms";
import { requireAdmin } from "@/lib/admin/auth";

export default function VersesPage({ searchParams }: PageProps<"/admin/verses">) {
  return (
    <Suspense fallback={<AdminLoading />}>
      <Verses searchParams={searchParams} />
    </Suspense>
  );
}

async function Verses({ searchParams }: { searchParams: PageProps<"/admin/verses">["searchParams"] }) {
  const admin = await requireAdmin();
  const { saved, removed } = await searchParams;
  const [{ data: verses }, { data: collections }] = await Promise.all([
    admin.supabase.from("hidden_verses").select("*").order("sort_order"),
    admin.supabase.from("collections").select("*").order("sort_order"),
  ]);

  return (
    <AdminShell
      admin={admin}
      title="Hidden verses"
      intro="Verses people find by scanning QR codes on your products. Each one lives at bymannaproject.com/found/ followed by its link name."
      actions={<Link className="btn btn-primary" href="/admin/verses/new">Add a verse</Link>}
    >
      {saved && <p className="notice notice-ok" role="status">Saved. The site is updated.</p>}
      {removed && <p className="notice notice-ok" role="status">Removed {String(removed)}.</p>}

      {(collections ?? []).map((c) => {
        const inCol = (verses ?? []).filter((v) => v.collection_id === c.id);
        return (
          <section className="panel" key={c.id} aria-labelledby={`col-${c.id}`}>
            <h2 id={`col-${c.id}`}>{c.name} <span className="pill">{inCol.length} verses</span></h2>
            <div className="table-scroll">
              <table className="admin-table">
                <tbody>
                  {inCol.map((v) => (
                    <tr key={v.slug}>
                      <td><Link href={`/admin/verses/${v.slug}`}><b>{v.reference}</b></Link> <span className="pill">{v.translation}</span></td>
                      <td className="muted">{v.lines.join(" ").slice(0, 90)}{v.lines.join(" ").length > 90 ? "…" : ""}</td>
                      <td><code>/found/{v.slug}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <details>
              <summary className="muted" style={{ cursor: "pointer" }}>Rename or describe this collection</summary>
              <div style={{ marginTop: "1rem" }}><CollectionForm collection={c} /></div>
            </details>
          </section>
        );
      })}

      {(verses ?? []).some((v) => !v.collection_id) && (
        <section className="panel">
          <h2>Not in a collection</h2>
          <ul>
            {(verses ?? []).filter((v) => !v.collection_id).map((v) => (
              <li key={v.slug}><Link href={`/admin/verses/${v.slug}`}>{v.reference}</Link></li>
            ))}
          </ul>
        </section>
      )}

      <section className="panel" aria-labelledby="new-col">
        <h2 id="new-col">Start a new collection</h2>
        <p className="muted">For a seasonal set, like verses hidden in your Advent printables. Add the collection, then add verses to it.</p>
        <CollectionForm />
      </section>
    </AdminShell>
  );
}
