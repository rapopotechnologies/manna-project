import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminLoading, AdminShell } from "@/components/admin/AdminShell";
import { ProductForm, type ProductFormValues } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin/auth";
import { deleteProduct } from "../actions";

export default function EditProductPage(props: PageProps<"/admin/products/[slug]">) {
  return (
    <Suspense fallback={<AdminLoading />}>
      <EditProduct {...props} />
    </Suspense>
  );
}

async function EditProduct({ params, searchParams }: PageProps<"/admin/products/[slug]">) {
  const admin = await requireAdmin();
  const { slug } = await params;
  const { error } = await searchParams;
  const isNew = slug === "new";

  const { data: all } = await admin.supabase.from("products").select("*").order("sort_order");
  const row = (all ?? []).find((p) => p.slug === slug);
  if (!isNew && !row) notFound();

  const product: ProductFormValues | undefined = row
    ? {
        slug: row.slug,
        name: row.name,
        category: row.category,
        blurb: row.blurb,
        description: row.description,
        includes: row.includes,
        details: Array.isArray(row.details) ? (row.details as ProductFormValues["details"]) : [],
        pairs_with: row.pairs_with,
        etsy_url: row.etsy_url,
        images: Array.isArray(row.images) ? (row.images as ProductFormValues["images"]) : [],
        featured: row.featured,
        published: row.published,
      }
    : undefined;

  const others = (all ?? []).filter((p) => p.slug !== slug).map((p) => ({ slug: p.slug, name: p.name }));

  return (
    <AdminShell
      admin={admin}
      title={isNew ? "Add a product" : `Edit ${row!.name}`}
      intro={isNew ? "Fill in the details from the Etsy listing. You can hide it until it’s ready." : undefined}
      actions={!isNew ? <a className="btn" href={`/shop/${slug}`} target="_blank" rel="noopener noreferrer">View in shop ↗</a> : undefined}
    >
      <ProductForm product={product} others={others} />

      {!isNew && (
        <section className="panel danger-zone" aria-labelledby="remove">
          <h2 id="remove">Remove from the shop</h2>
          <p className="muted">This deletes the product page. To take it down for a while instead, uncheck “Show in the shop”. Removals can be restored from Change history.</p>
          {error === "confirm" && <p className="notice notice-error">Tick the box to confirm.</p>}
          <form action={deleteProduct} className="admin-form">
            <input type="hidden" name="slug" value={slug} />
            <label className="check"><input type="checkbox" name="confirm" /> Yes, remove {row!.name}</label>
            <div><button className="btn btn-danger" type="submit">Remove product</button></div>
          </form>
        </section>
      )}
    </AdminShell>
  );
}
