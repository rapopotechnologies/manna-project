import Link from "next/link";
import { localPath, type Lang } from "@/i18n/lang";

/** The 404 message. */
export function LostBody({ lang = "en" }: { lang?: Lang }) {
  const id = lang === "id";
  return (
    <div className="wrap lost">
      <span className="label">{id ? "Halaman tidak ditemukan" : "Page not found"}</span>
      <h1>
        {id ? (
          <>
            Ruangan ini masih <span className="brush">direnovasi</span>.
          </>
        ) : (
          <>
            This room is still <span className="brush">under renovation</span>.
          </>
        )}
      </h1>
      <p>
        {id
          ? "Halaman yang kamu cari sudah pindah atau tidak ada. Ayat hari ini selalu jadi tempat yang baik untuk memulai."
          : "The page you’re looking for has moved or doesn’t exist. Today’s verse is always a good place to start."}
      </p>
      <div className="porch-ctas">
        <Link className="btn btn-primary" href={localPath(lang, "/daily")}>{id ? "Baca ayat hari ini" : "Read today’s verse"}</Link>
        <Link className="btn" href={localPath(lang, "/")}>{id ? "Ke beranda" : "Go home"}</Link>
      </div>
    </div>
  );
}
