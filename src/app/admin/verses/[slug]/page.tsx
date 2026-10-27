import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminLoading, AdminShell } from "@/components/admin/AdminShell";
import { VerseForm } from "@/components/admin/VerseForms";
import { requireAdmin } from "@/lib/admin/auth";
import { deleteVerse } from "../actions";

export default function EditVersePage(props: PageProps<"/admin/verses/[slug]">) {
  return (
    <Suspense fallback={<AdminLoading />}>
      <EditVerse {...props} />
    </Suspense>
  );
}

async function EditVerse({ params, searchParams }: PageProps<"/admin/verses/[slug]">) {
  const admin = await requireAdmin();
  const { slug } = await params;
  const { error } = await searchParams;
  const isNew = slug === "new";
  const [{ data: verse }, { data: collections }] = await Promise.all([
    isNew ? Promise.resolve({ data: null }) : admin.supabase.from("hidden_verses").select("*").eq("slug", slug).maybeSingle(),
    admin.supabase.from("collections").select("id, name").order("sort_order"),
  ]);
  if (!isNew && !verse) notFound();

  return (
    <AdminShell
      admin={admin}
      title={isNew ? "Add a hidden verse" : `Edit ${verse!.reference}`}
      actions={!isNew ? <a className="btn" href={`/found/${slug}`} target="_blank" rel="noopener noreferrer">View note ↗</a> : undefined}
    >
      <VerseForm verse={verse ?? undefined} collections={collections ?? []} />
      {!isNew && (
        <section className="panel danger-zone" aria-labelledby="remove">
          <h2 id="remove">Remove this verse</h2>
          <p className="muted">If this verse is printed in a QR code, scanning it will show a “not found” page. Removals can be restored from Change history.</p>
          {error === "confirm" && <p className="notice notice-error">Tick the box to confirm.</p>}
          <form action={deleteVerse} className="admin-form">
            <input type="hidden" name="slug" value={slug} />
            <label className="check"><input type="checkbox" name="confirm" /> Yes, remove {verse!.reference}</label>
            <div><button className="btn btn-danger" type="submit">Remove verse</button></div>
          </form>
        </section>
      )}
    </AdminShell>
  );
}
