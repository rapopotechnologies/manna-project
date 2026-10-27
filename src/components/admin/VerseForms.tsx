"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveCollection, saveVerse, type FormState } from "@/app/admin/verses/actions";

type Verse = { slug: string; reference: string; translation: string; lines: string[]; collection_id: string | null };

export function VerseForm({ verse, collections }: { verse?: Verse; collections: { id: string; name: string }[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveVerse, {});
  const isNew = !verse;
  return (
    <form action={action} className="admin-form">
      {verse && <input type="hidden" name="original_slug" value={verse.slug} />}
      {state.error && <p className="notice notice-error" role="alert">{state.error}</p>}
      <section className="panel">
        <div className="field-row">
          <label className="field" htmlFor="reference">
            <span>Reference</span>
            <input id="reference" name="reference" required defaultValue={verse?.reference} placeholder="John 3:16" />
          </label>
          <label className="field" htmlFor="translation">
            <span>Translation</span>
            <input id="translation" name="translation" required defaultValue={verse?.translation ?? "NIV"} maxLength={6} />
          </label>
        </div>
        <label className="field" htmlFor="lines">
          <span>Verse text</span>
          <textarea id="lines" name="lines" required defaultValue={verse?.lines.join("\n")} style={{ minHeight: "10rem" }} />
          <small>Each line here becomes a line on the note. Copy the wording exactly as printed.</small>
        </label>
        <div className="field-row">
          <label className="field" htmlFor="slug">
            <span>Link name</span>
            <input id="slug" name="slug" defaultValue={verse?.slug} readOnly={!isNew} required pattern="[a-z0-9_]+" placeholder="john_3_16" />
            <small>
              bymannaproject.com/found/{verse?.slug ?? "…"}
              {isNew ? " · Use this in the QR code. It can’t change later." : " · Fixed, because it may be printed in a QR code."}
            </small>
          </label>
          <label className="field" htmlFor="collection_id">
            <span>Collection</span>
            <select id="collection_id" name="collection_id" defaultValue={verse?.collection_id ?? collections[0]?.id ?? ""}>
              <option value="">None</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
        </div>
      </section>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={pending}>{pending ? "Saving…" : isNew ? "Add verse" : "Save changes"}</button>
        <Link className="btn" href="/admin/verses">Cancel</Link>
      </div>
    </form>
  );
}

export function CollectionForm({ collection }: { collection?: { id: string; name: string; blurb: string } }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveCollection, {});
  return (
    <form action={action} className="admin-form">
      {collection && <input type="hidden" name="original_id" value={collection.id} />}
      {state.error && <p className="notice notice-error" role="alert">{state.error}</p>}
      <div className="field-row">
        <label className="field" htmlFor={`cname-${collection?.id ?? "new"}`}>
          <span>Name</span>
          <input id={`cname-${collection?.id ?? "new"}`} name="name" required defaultValue={collection?.name} placeholder="Advent 2026" />
        </label>
        <label className="field" htmlFor={`cblurb-${collection?.id ?? "new"}`}>
          <span>One-line description</span>
          <input id={`cblurb-${collection?.id ?? "new"}`} name="blurb" defaultValue={collection?.blurb} placeholder="Verses hidden in our Advent printables." />
        </label>
      </div>
      <div><button type="submit" className="btn btn-small" disabled={pending}>{pending ? "Saving…" : collection ? "Save collection" : "Add collection"}</button></div>
    </form>
  );
}
