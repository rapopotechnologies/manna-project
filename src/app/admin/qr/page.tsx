import { Suspense } from "react";
import { AdminLoading, AdminShell } from "@/components/admin/AdminShell";
import { QrMaker, type QrTarget } from "@/components/admin/QrMaker";
import { requireAdmin } from "@/lib/admin/auth";

export default function QrPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <QrAdmin />
    </Suspense>
  );
}

async function QrAdmin() {
  const admin = await requireAdmin();
  const [{ data: products }, { data: verses }] = await Promise.all([
    admin.supabase.from("products").select("slug, name").order("sort_order"),
    admin.supabase.from("hidden_verses").select("slug, reference").order("reference"),
  ]);

  const targets: QrTarget[] = [
    { group: "Every day", path: "/daily", label: "Today’s verse" },
    { group: "Every day", path: "/kids", label: "Manna Kids question" },
    { group: "Pages", path: "/", label: "Home page" },
    { group: "Pages", path: "/shop", label: "Shop" },
    { group: "Pages", path: "/about", label: "About" },
    { group: "Pages", path: "/support", label: "Support Manna Project" },
    ...(products ?? []).map((p) => ({ group: "Products", path: `/shop/${p.slug}`, label: p.name })),
    ...(verses ?? []).map((v) => ({ group: "Hidden verses", path: `/found/${v.slug}`, label: v.reference })),
  ];

  return (
    <AdminShell
      admin={admin}
      title="QR codes"
      intro="Make a QR code for any page, for printing on products, cards and posters. Every scan is counted on the overview."
    >
      <QrMaker targets={targets} />
    </AdminShell>
  );
}
