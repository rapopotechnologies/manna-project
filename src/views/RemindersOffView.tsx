import type { Metadata } from "next";
import Link from "next/link";
import { localPath, pick, type Lang } from "@/i18n/lang";

export const remindersOffMetadata = (lang: Lang): Metadata => ({
  title: pick(lang, "Morning reminders", "Pengingat pagi"),
  robots: { index: false },
});

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

/** Reached from the link in a reminder email: one button to turn reminders off (no sign-in needed). */
export async function RemindersOffView({ lang, searchParams }: { lang: Lang; searchParams: SearchParams }) {
  const sp = await searchParams;
  const id = lang === "id";
  const done = one(sp.done) === "1";
  const failed = one(sp.error) === "1";
  const u = one(sp.u);
  const t = one(sp.t);

  return (
    <div className="wrap">
      <header className="plaque">
        <span className="label">{pick(lang, "Morning reminders", "Pengingat pagi")}</span>
        <h1>
          {done
            ? pick(lang, "Reminders are off.", "Pengingat sudah dimatikan.")
            : failed || !u || !t
              ? pick(lang, "That link didn’t work.", "Tautan itu tidak berhasil.")
              : pick(lang, "Turn off morning reminders?", "Matikan pengingat pagi?")}
        </h1>
        <p className="lede">
          {done
            ? pick(lang, "You won’t get any more reminder emails. Today’s verse is always here when you want it.", "Kamu tidak akan menerima email pengingat lagi. Ayat hari ini selalu ada di sini kapan pun kamu mau.")
            : failed || !u || !t
              ? pick(lang, "That link didn’t work. You can turn reminders off on your account page.", "Tautan itu tidak berhasil. Kamu bisa mematikan pengingat di halaman akunmu.")
              : pick(lang, "You’ll stop getting the morning email. You can turn it back on any time on your account page.", "Kamu tidak akan menerima email pagi lagi. Kamu bisa menyalakannya lagi kapan saja di halaman akunmu.")}
        </p>
      </header>
      {!done && u && t && !failed ? (
        <form method="post" action="/api/reminders/unsubscribe" className="porch-ctas">
          <input type="hidden" name="u" value={u} />
          <input type="hidden" name="t" value={t} />
          <input type="hidden" name="lang" value={lang} />
          <input type="hidden" name="confirm" value="1" />
          <button type="submit" className="btn btn-primary">{pick(lang, "Turn off reminders", "Matikan pengingat")}</button>
          <Link className="btn" href={localPath(lang, "/daily")}>{pick(lang, "Keep them", "Biarkan menyala")}</Link>
        </form>
      ) : (
        <div className="porch-ctas">
          <Link className="btn btn-primary" href={localPath(lang, "/daily")}>{pick(lang, "Read today’s verse", "Baca ayat hari ini")}</Link>
          <Link className="btn" href={localPath(lang, "/account")}>{id ? "Akunmu" : "Your account"}</Link>
        </div>
      )}
    </div>
  );
}
