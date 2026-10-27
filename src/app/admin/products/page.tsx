import Link from "next/link";
import { Suspense } from "react";
import { AdminLoading, AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/auth";
import { moveProduct, toggleProduct } from "./actions";

export default function ProductsPage({ searchParams }: PageProps<"/admin/products">) {
  return (
    <Suspense fallback={<AdminLoading />}>
      <Products searchParams={searchParams} />
    </Suspense>
  );
}

function firstImage(images: unknown): string | null {
  return Array.isArray(images) && typeof images[0]?.src === "string" ? images[0].src : null;
}

async function Products({ searchParams }: { searchParams: PageProps<"/admin/products">["searchParams"] }) {
  const admin = await requireAdmin();
  const { saved, removed } = await searchParams;
  const { data: products } = await admin.supabase.from("products").select("*").order("sort_order").order("name");
  const list = products ?? [];

  return (
    <AdminShell
      admin={admin}
      title="Products"
      intro="What shows in the shop, in this order. Featured products appear on the home page."
      actions={<Link className="btn btn-primary" href="/admin/products/new">Add a product</Link>}
    >
      {saved && <p className="notice notice-ok" role="status">Saved. The site is updated.</p>}
      {removed && <p className="notice notice-ok" role="status">Removed {String(removed)} from the shop.</p>}

      <div className="panel table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th scope="col"><span className="sr-only">Photo</span></th>
              <th scope="col">Product</th>
              <th scope="col">Status</th>
              <th scope="col"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {list.map((p, i) => {
              const img = firstImage(p.images);
              return (
                <tr key={p.slug}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <td>{img ? <img src={img} alt="" /> : null}</td>
                  <td>
                    <Link href={`/admin/products/${p.slug}`}><b>{p.name}</b></Link>
                    <div className="muted">{p.category}</div>
                  </td>
                  <td>
                    <span className={`pill${p.published ? " live" : ""}`}>{p.published ? "In shop" : "Hidden"}</span>{" "}
                    {p.featured && <span className="pill on">Featured</span>}
                  </td>
                  <td>
                    <div className="row-actions">
                      <form action={moveProduct}>
                        <input type="hidden" name="slug" value={p.slug} />
                        <button className="icon-btn" name="dir" value="up" disabled={i === 0} aria-label={`Move ${p.name} up`}>↑</button>
                        <button className="icon-btn" name="dir" value="down" disabled={i === list.length - 1} aria-label={`Move ${p.name} down`}>↓</button>
                      </form>
                      <form action={toggleProduct}>
                        <input type="hidden" name="slug" value={p.slug} />
                        <input type="hidden" name="field" value="featured" />
                        <input type="hidden" name="value" value={String(!p.featured)} />
                        <button className="icon-btn">{p.featured ? "Unfeature" : "Feature"}</button>
                      </form>
                      <form action={toggleProduct}>
                        <input type="hidden" name="slug" value={p.slug} />
                        <input type="hidden" name="field" value="published" />
                        <input type="hidden" name="value" value={String(!p.published)} />
                        <button className="icon-btn">{p.published ? "Hide" : "Show"}</button>
                      </form>
                      <Link className="icon-btn" href={`/admin/products/${p.slug}`} style={{ display: "inline-grid", placeItems: "center", textDecoration: "none" }}>Edit</Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
