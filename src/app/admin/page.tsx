import Link from "next/link";
import { Suspense } from "react";
import { AdminLoading, AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/auth";
import { dayKeyFor, shiftDayKey } from "@/lib/day";

const VERCEL_ANALYTICS = "https://vercel.com/rapopotechnologies-projects/manna-project/analytics";

export default function AdminHome() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <Overview />
    </Suspense>
  );
}

const weekday = (key: string) =>
  new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "UTC" }).format(new Date(`${key}T12:00:00Z`));

async function Overview() {
  const admin = await requireAdmin();
  const { supabase } = admin;
  const today = dayKeyFor(new Date());
  const days = Array.from({ length: 7 }, (_, i) => shiftDayKey(today, i - 6));

  const [{ data: counts }, { data: products }, { data: changes }] = await Promise.all([
    supabase.from("daily_counts").select("day, metric, key, count").gte("day", days[0]),
    supabase.from("products").select("slug, name").order("sort_order"),
    supabase.from("change_log").select("id, at, actor, action, target_table, target_id").order("at", { ascending: false }).limit(6),
  ]);

  const rows = counts ?? [];
  const total = (metric: string) => rows.filter((r) => r.metric === metric).reduce((n, r) => n + r.count, 0);
  const perDay = days.map((d) => ({
    day: d,
    count: rows.filter((r) => r.metric === "verse_view" && r.day === d).reduce((n, r) => n + r.count, 0),
  }));
  const peak = Math.max(1, ...perDay.map((d) => d.count));
  const etsy = (products ?? [])
    .map((p) => ({ ...p, clicks: rows.filter((r) => r.metric === "etsy_click" && r.key === p.slug).reduce((n, r) => n + r.count, 0) }))
    .sort((a, b) => b.clicks - a.clicks);

  return (
    <AdminShell
      admin={admin}
      title="This week"
      intro="Totals from the last 7 days, counted privately: no cookies and no personal data."
      actions={<a className="btn" href={VERCEL_ANALYTICS} target="_blank" rel="noopener noreferrer">Full analytics on Vercel ↗</a>}
    >
      <div className="stat-row">
        <div className="stat"><b>{total("verse_view")}</b><span>Verse page visits</span></div>
        <div className="stat"><b>{total("qr_scan")}</b><span>QR code scans</span></div>
        <div className="stat"><b>{total("ig_share") + total("link_share")}</b><span>Shares</span></div>
        <div className="stat"><b>{total("etsy_click")}</b><span>Clicks to Etsy</span></div>
      </div>

      <div className="panel-grid">
        <section className="panel" aria-labelledby="visits">
          <h2 id="visits">Verse visits by day</h2>
          <div className="bars" role="img" aria-label={perDay.map((d) => `${weekday(d.day)} ${d.count}`).join(", ")}>
            {perDay.map((d) => (
              <div className="bar" key={d.day}>
                <em>{d.count}</em>
                <i style={{ height: `${Math.max(2, (d.count / peak) * 100)}px` }} />
                <span>{weekday(d.day)}</span>
              </div>
            ))}
          </div>
          <p className="muted" style={{ fontSize: "0.85rem" }}>
            Kids question visits: {total("kids_view")} · Hidden verses opened: {total("found_view")}
          </p>
        </section>

        <section className="panel" aria-labelledby="etsy">
          <h2 id="etsy">Etsy clicks by product</h2>
          <div className="table-scroll">
            <table className="admin-table">
              <tbody>
                {etsy.map((p) => (
                  <tr key={p.slug}>
                    <td><Link href={`/admin/products/${p.slug}`}>{p.name}</Link></td>
                    <td className="num">{p.clicks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="panel" aria-labelledby="recent">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1rem", flexWrap: "wrap" }}>
          <h2 id="recent">Recent changes</h2>
          <Link href="/admin/history">See all →</Link>
        </div>
        <ul className="history-list">
          {(changes ?? []).map((c) => (
            <li key={c.id}>
              <time dateTime={c.at}>{new Date(c.at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/Los_Angeles" })}</time>
              <span>
                <b>{c.actor}</b> {c.action === "insert" ? "added" : c.action === "delete" ? "removed" : "edited"} {c.target_table.replace("_", " ")} <code>{c.target_id}</code>
              </span>
              <span />
            </li>
          ))}
        </ul>
      </section>
    </AdminShell>
  );
}
