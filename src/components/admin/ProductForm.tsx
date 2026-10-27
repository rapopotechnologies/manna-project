"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { saveProduct, type FormState } from "@/app/admin/products/actions";
import { ImageManager, type ImageItem } from "./ImageManager";

export type ProductFormValues = {
  slug: string;
  name: string;
  category: string;
  blurb: string;
  description: string;
  includes: string[];
  details: { label: string; value: string }[];
  pairs_with: string[];
  etsy_url: string;
  images: ImageItem[];
  featured: boolean;
  published: boolean;
};

type Props = {
  product?: ProductFormValues;
  others: { slug: string; name: string }[];
};

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

export function ProductForm({ product, others }: Props) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveProduct, {});
  const isNew = !product;
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(false);

  return (
    <form action={action} className="admin-form">
      {product && <input type="hidden" name="original_slug" value={product.slug} />}
      {state.error && <p className="notice notice-error" role="alert">{state.error}</p>}

      <section className="panel">
        <h2>Basics</h2>
        <div className="field-row">
          <label className="field" htmlFor="name">
            <span>Name</span>
            <input
              id="name"
              name="name"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (isNew && !slugTouched) setSlug(slugify(e.target.value));
              }}
            />
          </label>
          <label className="field" htmlFor="category">
            <span>Category</span>
            <select id="category" name="category" defaultValue={product?.category ?? "Journals"}>
              <option>Journals</option>
              <option>Bookmarks</option>
              <option>Stickers</option>
            </select>
          </label>
        </div>
        <label className="field" htmlFor="slug">
          <span>Web address</span>
          <input
            id="slug"
            name="slug"
            value={slug}
            readOnly={!isNew}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(slugify(e.target.value));
            }}
          />
          <small>bymannaproject.com/shop/{slug || "…"}{!isNew && " · Fixed once created, so shared links keep working."}</small>
        </label>
        <label className="field" htmlFor="etsy_url">
          <span>Etsy listing link</span>
          <input id="etsy_url" name="etsy_url" type="url" required defaultValue={product?.etsy_url} placeholder="https://www.etsy.com/listing/…" />
        </label>
        <div className="check-list">
          <label className="check"><input type="checkbox" name="published" defaultChecked={product?.published ?? true} /> Show in the shop</label>
          <label className="check"><input type="checkbox" name="featured" defaultChecked={product?.featured ?? false} /> Feature on the home page</label>
        </div>
      </section>

      <section className="panel">
        <ImageManager initial={product?.images ?? []} folder={`products/${slug || "new"}`} />
      </section>

      <section className="panel">
        <h2>Words</h2>
        <label className="field" htmlFor="blurb">
          <span>Short line</span>
          <input id="blurb" name="blurb" maxLength={160} defaultValue={product?.blurb} />
          <small>One sentence for shop cards.</small>
        </label>
        <label className="field" htmlFor="description">
          <span>Description</span>
          <textarea id="description" name="description" defaultValue={product?.description} />
        </label>
        <label className="field" htmlFor="includes">
          <span>What’s included</span>
          <textarea id="includes" name="includes" defaultValue={product?.includes.join("\n")} />
          <small>One item per line.</small>
        </label>
        <label className="field" htmlFor="details">
          <span>Details</span>
          <textarea id="details" name="details" defaultValue={product?.details.map((d) => `${d.label}: ${d.value}`).join("\n")} />
          <small>One per line, written as Label: value. For example, Format: Printable PDF.</small>
        </label>
      </section>

      {others.length > 0 && (
        <section className="panel">
          <h2>Pairs well with</h2>
          <div className="check-list">
            {others.map((o) => (
              <label className="check" key={o.slug}>
                <input type="checkbox" name="pairs_with" value={o.slug} defaultChecked={product?.pairs_with.includes(o.slug)} /> {o.name}
              </label>
            ))}
          </div>
        </section>
      )}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={pending}>{pending ? "Saving…" : isNew ? "Add product" : "Save changes"}</button>
        <Link className="btn" href="/admin/products">Cancel</Link>
      </div>
    </form>
  );
}
