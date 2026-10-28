import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { langAlternates, localPath, type Lang } from "@/i18n/lang";

const shelf = [
  {
    src: "/journals/BRT/bible-reading-tracker-journal-3.jpg",
    alt: { en: "A S.O.A.P. journal page from the Bible Reading Tracker", id: "Halaman jurnal S.O.A.P. dari Bible Reading Tracker" },
  },
  {
    src: "/bookmarks/bundle/Bundle-Book-of-the-Bible-Bookmarks-4.jpg",
    alt: { en: "Four styles of Book of the Bible bookmarks", id: "Empat gaya pembatas buku kitab-kitab Alkitab" },
  },
  {
    src: "/stickers/basic_stickers/basic_stickers3.jpg",
    alt: { en: "Digital stickers on a journal page", id: "Stiker digital di halaman jurnal" },
  },
];

export function aboutMetadata(lang: Lang): Metadata {
  return {
    title: lang === "id" ? "Tentang kami" : "About",
    description:
      lang === "id"
        ? "Manna Project membuat jurnal, pembatas buku, dan stiker yang modern dan bermakna, untuk memberi ruang bagi iman di tengah hidup yang sibuk."
        : "Manna Project makes modern, purposeful journals, bookmarks and stickers that make room for faith in a busy life.",
    alternates: langAlternates(lang, "/about"),
  };
}

// The story is trimmed from the original About copy; wording kept where possible.
export function AboutView({ lang }: { lang: Lang }) {
  const L = (path: string) => localPath(lang, path);
  const id = lang === "id";

  return (
    <div className="wrap">
      <header className="plaque">
        <span className="label">{id ? "Tentang Manna Project" : "About Manna Project"}</span>
        <h1>
          {id ? (
            <>
              Hidup lebih dari sekadar <span className="brush">rutinitas</span>.
            </>
          ) : (
            <>
              Life is more than <span className="brush">the daily grind</span>.
            </>
          )}
        </h1>
      </header>

      <div className="about">
        {id ? (
          <div className="about-body">
            <p>
              Di dunia yang memuja kesibukan dan produktivitas tanpa henti, Manna Project memberi ruang bagi bagian hidup yang lebih
              dalam dan lebih bermakna.
            </p>
            <p>
              Kami membuat produk yang modern dan bermakna: jurnal, pembatas buku, dan stiker yang menemani hari-harimu. Kami suka rasa
              puas saat mencoret daftar tugas. Kami juga mencintai saat-saat tenang untuk merenung, dan kedekatan dengan Tuhan yang kami
              temukan lewat iman.
            </p>
            <p>
              Hidup bukan hanya soal menyelesaikan pekerjaan. Hidup juga tentang menemukan anugerah di setiap saat, sesibuk apa pun
              harinya. Terima kasih sudah berjalan bersama kami menuju hidup yang lebih bermakna dan berpusat pada iman.
            </p>
          </div>
        ) : (
          <div className="about-body">
            <p>
              In a world that celebrates busyness and endless productivity, Manna Project makes room for the deeper, more meaningful
              parts of life.
            </p>
            <p>
              We make modern, purposeful products: journals, bookmarks and stickers that work as daily companions. We love the
              satisfaction of crossing off a to-do list. We also love the quiet moments of reflection and the connection we find with
              God through our faith.
            </p>
            <p>
              Life isn’t only about getting things done. It’s also about finding grace in each moment, however busy the day. Thank you
              for joining us on the way to a more purposeful, faith-centered life.
            </p>
          </div>
        )}

        <aside className="about-name" aria-labelledby="why-manna">
          <span className="label">{id ? "Kenapa “manna”" : "Why “manna”"}</span>
          <h2 id="why-manna">{id ? "Cukup untuk hari ini" : "Enough for today"}</h2>
          <p>
            {id
              ? "Dalam Keluaran 16, Tuhan memberi umat-Nya manna setiap pagi, cukup untuk hari itu. Itulah gagasan di balik semua yang ada di sini: sedikit, setiap hari, bukan semuanya sekaligus."
              : "In Exodus 16, God gave His people manna each morning, enough for that day. That’s the idea behind everything here: a little, every day, rather than everything at once."}
          </p>
        </aside>
      </div>

      <section className="section" aria-label={id ? "Apa yang dilakukan Manna Project" : "What Manna Project does"}>
        <div className="halves-grid">
          <article className="half-card">
            <span className="half-sun" aria-hidden="true" />
            <h2>{id ? "Menumbuhkan iman" : "Cultivating faith"}</h2>
            <p>
              {id
                ? "Kebiasaan kecil setiap hari yang menjaga Tuhan tetap dekat di hari-hari sibuk. Semuanya gratis, tanpa perlu akun."
                : "Small daily rhythms that keep God close on busy days. All free, no account needed."}
            </p>
            <ul className="fixtures">
              {id ? (
                <>
                  <li><Link href={L("/daily")}>Satu ayat setiap pagi</Link>, dengan renungan singkat S.O.A.P.</li>
                  <li><Link href={L("/kids")}>Satu pertanyaan untuk anak-anak</Link> untuk dibicarakan saat makan malam</li>
                  <li>Sepuluh ayat tersembunyi, menunggu untuk kamu temukan</li>
                </>
              ) : (
                <>
                  <li><Link href="/daily">A verse every morning</Link>, with a short S.O.A.P. reflection</li>
                  <li><Link href="/kids">A question for the kids</Link> to talk about at dinner</li>
                  <li>Ten hidden verses, tucked away for you to find</li>
                </>
              )}
            </ul>
          </article>
          <article className="half-card">
            <span className="half-sun half-sun-sage" aria-hidden="true" />
            <h2>{id ? "Merangkai anugerah" : "Crafting grace"}</h2>
            <p>
              {id
                ? "Alat yang dirancang dengan cermat, supaya saat teduh menjadi sesuatu yang kamu nantikan."
                : "Thoughtfully designed tools that turn quiet time into something you look forward to."}
            </p>
            <ul className="fixtures">
              {id ? (
                <>
                  <li><Link href={L("/shop/bible-reading-tracker")}>Pelacak baca Alkitab</Link> dan jurnal S.O.A.P.</li>
                  <li><Link href={L("/shop/book-of-the-bible-bookmarks-bundle")}>Pembatas buku</Link> untuk ke-66 kitab Alkitab</li>
                  <li><Link href={`${L("/shop")}#planners`}>Planner cetak</Link> untuk harian, mingguan, dan tahunan</li>
                  <li><Link href={`${L("/shop")}#stickers`}>Stiker digital dan vinil</Link> untuk jurnal dan barang sehari-hari</li>
                </>
              ) : (
                <>
                  <li><Link href="/shop/bible-reading-tracker">A Bible reading tracker</Link> and S.O.A.P. journal</li>
                  <li><Link href="/shop/book-of-the-bible-bookmarks-bundle">Bookmarks</Link> for all 66 books of the Bible</li>
                  <li><Link href="/shop#planners">Printable planners</Link> for your days, weeks and year</li>
                  <li><Link href="/shop#stickers">Digital and vinyl stickers</Link> for journaling and everyday things</li>
                </>
              )}
            </ul>
          </article>
        </div>
      </section>

      <section className="section" aria-labelledby="made">
        <div className="section-head">
          <div>
            <span className="label">{id ? "Dari bengkel kami" : "From the workshop"}</span>
            <h2 id="made">{id ? "Buatan tangan" : "Made by hand"}</h2>
          </div>
          <Link href={L("/shop")}>{id ? "Kunjungi toko →" : "Visit the shop →"}</Link>
        </div>
        <div className="about-shelf">
          {shelf.map((img) => (
            <div className="product-photo" key={img.src}>
              <Image src={img.src} alt={img.alt[lang]} width={1000} height={800} sizes="(max-width: 760px) 100vw, 360px" />
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="about-strip">
          <div>
            <span className="label">{id ? "Sapa kami" : "Say hello"}</span>
            <h2>{id ? "Ada pertanyaan atau ide?" : "Questions or ideas?"}</h2>
          </div>
          <div className="about-strip-copy">
            <p>
              {id
                ? "Kami senang mendengar darimu, entah tentang pesanan atau tentang bagaimana Manna Project hadir dalam hari-harimu."
                : "We’d love to hear from you, whether it’s about an order or about how Manna Project fits into your day."}
            </p>
            <Link className="btn" href={L("/contact")}>{id ? "Hubungi kami" : "Get in touch"}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
