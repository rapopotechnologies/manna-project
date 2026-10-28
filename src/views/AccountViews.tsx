import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountPanel } from "@/components/account/AccountPanel";
import { ResetPassword } from "@/components/account/ResetPassword";
import { MyManna } from "@/components/progress/MyManna";
import { pick, type Lang } from "@/i18n/lang";

export const myMannaMetadata = (lang: Lang): Metadata => ({
  title: pick(lang, "My manna", "Manna-ku"),
  description: pick(lang, "Your manna jar, bookshelf and reflection garden.", "Toples manna, rak buku, dan kebun renunganmu."),
  robots: { index: false },
});

export function MyMannaView({ lang }: { lang: Lang }) {
  return (
    <div className="wrap">
      <header className="plaque">
        <span className="label">{pick(lang, "My manna", "Manna-ku")}</span>
        <h1>
          {lang === "id" ? (
            <>
              Sedikit, <span className="brush">setiap hari</span>.
            </>
          ) : (
            <>
              A little, <span className="brush">every day</span>.
            </>
          )}
        </h1>
        <p className="lede">
          {pick(
            lang,
            "Your jar, your shelf and your garden: a quiet record of the mornings you’ve spent with God’s word.",
            "Toples, rak, dan kebunmu: catatan sederhana tentang pagi-pagi yang kamu lewati bersama firman Tuhan.",
          )}
        </p>
      </header>
      <MyManna />
    </div>
  );
}

export const accountMetadata = (lang: Lang): Metadata => ({
  title: pick(lang, "Your account", "Akunmu"),
  description: pick(
    lang,
    "Keep your manna jar, bookshelf, garden and reflections on every device.",
    "Simpan toples manna, rak buku, kebun, dan renunganmu di semua perangkat.",
  ),
  robots: { index: false },
});

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

async function Panel({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const notice = sp.welcome ? "welcome" : sp.error === "link" ? "link" : sp.reset ? "reset" : undefined;
  return <AccountPanel notice={notice} />;
}

export function AccountView({ lang, searchParams }: { lang: Lang; searchParams: SearchParams }) {
  return (
    <div className="wrap">
      <header className="plaque">
        <span className="label">{pick(lang, "Your account", "Akunmu")}</span>
        <h1>
          {lang === "id" ? (
            <>
              Simpan manna-mu <span className="brush">di mana saja</span>.
            </>
          ) : (
            <>
              Keep your manna <span className="brush">everywhere</span>.
            </>
          )}
        </h1>
      </header>
      <Suspense fallback={<p className="lede">{pick(lang, "Checking your account…", "Memeriksa akunmu…")}</p>}>
        <Panel searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

export const resetMetadata = (lang: Lang): Metadata => ({
  title: pick(lang, "Choose a new password", "Buat kata sandi baru"),
  robots: { index: false },
});

export function ResetView({ lang }: { lang: Lang }) {
  return (
    <div className="wrap">
      <header className="plaque">
        <span className="label">{pick(lang, "Your account", "Akunmu")}</span>
        <h1>{pick(lang, "Choose a new password", "Buat kata sandi baru")}</h1>
      </header>
      <ResetPassword />
    </div>
  );
}
