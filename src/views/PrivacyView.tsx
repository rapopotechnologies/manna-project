import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/data/products";
import { langAlternates, localPath, type Lang } from "@/i18n/lang";

const UPDATED = { en: "28 October 2026", id: "28 Oktober 2026" };

type Section = { id: string; title: string; body: React.ReactNode };

function sections(lang: Lang): Section[] {
  const L = (path: string) => localPath(lang, path);
  const email = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;
  if (lang === "id") {
    return [
      {
        id: "singkat",
        title: "Singkatnya",
        body: (
          <ul>
            <li>Kamu bisa memakai Manna Project tanpa akun. Tanpa akun, kami tidak menyimpan data pribadimu.</li>
            <li>Kami tidak memakai cookie iklan, tidak menjual data, dan tidak menampilkan iklan.</li>
            <li>Jika kamu membuat akun, kami menyimpan email dan progresmu supaya bisa dibuka di perangkat lain. Kamu bisa mengunduh atau menghapusnya kapan saja.</li>
          </ul>
        ),
      },
      {
        id: "tanpa-akun",
        title: "Tanpa akun",
        body: (
          <>
            <p>
              Toples manna, rak buku, kebun, bagan stiker, manna tersembunyi, renungan S.O.A.P., gambar anak-anak, dan ayat yang kamu temukan
              disimpan di browser perangkatmu saja. Kami tidak bisa melihatnya. Menghapus data browser akan menghapusnya.
            </p>
            <p>
              Kami menghitung kunjungan dan klik secara anonim (misalnya berapa kali ayat dibuka atau dibagikan hari ini), tanpa cookie dan tanpa
              data pribadi. Kami juga memakai Vercel Web Analytics, yang tidak memakai cookie dan hanya menampilkan angka gabungan.
            </p>
          </>
        ),
      },
      {
        id: "dengan-akun",
        title: "Dengan akun",
        body: (
          <>
            <p>Akun bersifat opsional. Jika kamu membuatnya, kami menyimpan:</p>
            <ul>
              <li>Alamat email, dan kata sandimu dalam bentuk terenkripsi (kami tidak bisa membacanya). Jika kamu masuk dengan Google, Google membagikan nama dan emailmu.</li>
              <li>Progresmu: toples, rak, kebun, bagan stiker, manna tersembunyi, ayat yang ditemukan, dan isi renungan S.O.A.P.-mu.</li>
              <li>Status persetujuan akunmu.</li>
              <li>Jika kamu menyalakan pengingat pagi: pilihanmu, zona waktumu, dan tanggal kunjungan terakhirmu (supaya kami tahu kapan mengirimnya). Setiap email punya tautan untuk mematikannya.</li>
            </ul>
            <p>Gambar anak-anak tidak pernah dikirim ke akunmu; gambar itu tetap di perangkat kecuali kamu membagikannya sendiri.</p>
            <p>
              Hanya kamu yang bisa melihat progres dan renunganmu. Tim kami bisa melihat emailmu dan tanggal pendaftaran untuk menyetujui akun.
            </p>
          </>
        ),
      },
      {
        id: "layanan",
        title: "Layanan yang kami pakai",
        body: (
          <ul>
            <li><b>Vercel</b> menjalankan situs ini, dan <b>Cloudflare</b> melindunginya.</li>
            <li><b>Supabase</b> menyimpan akun dan progres (server di Amerika Serikat).</li>
            <li><b>Resend</b> mengirim email konfirmasi, atur ulang kata sandi, persetujuan, dan pengingat pagi.</li>
            <li><b>Google</b>, hanya jika kamu memilih masuk dengan Google.</li>
            <li><b>OurManna</b> dan <b>YouVersion</b> menyediakan teks ayat. Server kami yang mengambilnya; datamu tidak dikirim ke mereka.</li>
            <li><b>Shopee</b> dan <b>Etsy</b> menangani pembelian dengan kebijakan privasi mereka sendiri. Kami tidak menerima data pembayaranmu.</li>
          </ul>
        ),
      },
      {
        id: "hakmu",
        title: "Hakmu",
        body: (
          <>
            <p>
              Di halaman <Link href={L("/account")}>Akunmu</Link> kamu bisa mengunduh semua datamu atau menghapus akun beserta isinya. Untuk
              pertanyaan, koreksi, atau permintaan lain tentang datamu, tulis ke {email}. Kami menghormati hak-hakmu menurut UU Pelindungan Data
              Pribadi (UU No. 27 Tahun 2022) dan aturan serupa di negara lain.
            </p>
            <p>Akun ditujukan untuk orang dewasa. Anak-anak bisa memakai Manna Kids bersama orang tua tanpa akun.</p>
          </>
        ),
      },
      {
        id: "ketentuan",
        title: "Ketentuan penggunaan",
        body: (
          <ul>
            <li>Ayat harian, pertanyaan Manna Kids, dan renungan gratis untuk dipakai pribadi, di rumah, dan di gereja. Silakan bagikan gambar dan tautannya.</li>
            <li>Teks Alkitab tetap milik pemegang hak ciptanya (NIV, TSI, ESV, dan lainnya) dan ditampilkan dengan izin atau dalam batas kutipan yang diperbolehkan.</li>
            <li>Produk dibeli lewat Shopee atau Etsy dan mengikuti ketentuan mereka. File digital untuk pemakaian pribadi; jangan dijual ulang atau dibagikan.</li>
            <li>Kami berusaha agar situs ini selalu tersedia dan akurat, tetapi tidak bisa menjaminnya.</li>
            <li>Jika kebijakan ini berubah, kami memperbarui tanggal di bawah. Perubahan besar akan kami kabarkan kepada pemilik akun lewat email.</li>
          </ul>
        ),
      },
    ];
  }
  return [
    {
      id: "short",
      title: "The short version",
      body: (
        <ul>
          <li>You can use Manna Project without an account. Without one, we don’t keep any personal data about you.</li>
          <li>No advertising cookies, no selling data, no ads.</li>
          <li>If you create an account, we keep your email and your progress so it follows you to other devices. You can download or delete it any time.</li>
        </ul>
      ),
    },
    {
      id: "no-account",
      title: "Without an account",
      body: (
        <>
          <p>
            Your manna jar, bookshelf, garden, sticker chart, hidden manna, S.O.A.P. reflections, kids’ drawings and found verses are saved in your
            browser on your device only. We can’t see them. Clearing your browser data removes them.
          </p>
          <p>
            We count visits and taps anonymously (for example, how many times today’s verse was opened or shared), with no cookies and no personal
            data. We also use Vercel Web Analytics, which uses no cookies and shows us only totals.
          </p>
        </>
      ),
    },
    {
      id: "account",
      title: "With an account",
      body: (
        <>
          <p>Accounts are optional. If you create one, we keep:</p>
          <ul>
            <li>Your email address, and your password in encrypted form (we can’t read it). If you sign in with Google, Google shares your name and email.</li>
            <li>Your progress: jar, shelf, garden, sticker chart, hidden manna, found verses, and the text of your S.O.A.P. reflections.</li>
            <li>Whether your account has been approved.</li>
            <li>If you turn on morning reminders: your choice, your time zone and the date of your last visit (so we know when to send). Every email has a link to turn them off.</li>
          </ul>
          <p>Kids’ drawings are never sent to your account; they stay on your device unless you share them yourself.</p>
          <p>Only you can see your progress and reflections. Our team can see your email and sign-up date in order to approve accounts.</p>
        </>
      ),
    },
    {
      id: "services",
      title: "Services we use",
      body: (
        <ul>
          <li><b>Vercel</b> runs the site, and <b>Cloudflare</b> protects it.</li>
          <li><b>Supabase</b> stores accounts and progress (servers in the United States).</li>
          <li><b>Resend</b> sends confirmation, password-reset, approval and morning reminder emails.</li>
          <li><b>Google</b>, only if you choose to sign in with Google.</li>
          <li><b>OurManna</b> and <b>YouVersion</b> provide verse text. Our server fetches it; none of your data is sent to them.</li>
          <li><b>Shopee</b> and <b>Etsy</b> handle purchases under their own privacy policies. We never receive your payment details.</li>
        </ul>
      ),
    },
    {
      id: "rights",
      title: "Your choices and rights",
      body: (
        <>
          <p>
            On <Link href="/account">your account page</Link> you can download all your data or delete your account and everything in it. For
            questions, corrections or any other request about your data, write to {email}. We respect your rights under Indonesia’s Personal
            Data Protection Law (Law No. 27 of 2022), the GDPR and similar laws.
          </p>
          <p>Accounts are meant for adults. Children can enjoy Manna Kids with a parent, no account needed.</p>
        </>
      ),
    },
    {
      id: "terms",
      title: "Terms of use",
      body: (
        <ul>
          <li>The daily verse, Manna Kids questions and reflections are free for personal, family and church use. Please share the images and links.</li>
          <li>Bible text belongs to its copyright holders (NIV, TSI, ESV and others) and is shown with permission or within allowed quotation limits.</li>
          <li>Products are bought through Shopee or Etsy under their terms. Digital files are for personal use; please don’t resell or redistribute them.</li>
          <li>We work to keep the site available and accurate, but can’t guarantee it.</li>
          <li>If this policy changes, we update the date below, and tell account holders by email about any significant change.</li>
        </ul>
      ),
    },
  ];
}

export function privacyMetadata(lang: Lang): Metadata {
  return {
    title: lang === "id" ? "Privasi & ketentuan" : "Privacy & terms",
    description:
      lang === "id"
        ? "Apa yang disimpan Manna Project, apa yang tidak, dan ketentuan penggunaan situs."
        : "What Manna Project keeps, what it doesn’t, and the terms for using the site.",
    alternates: langAlternates(lang, "/privacy"),
  };
}

export function PrivacyView({ lang }: { lang: Lang }) {
  const id = lang === "id";
  const list = sections(lang);
  return (
    <div className="wrap">
      <header className="plaque">
        <span className="label">{id ? "Privasi & ketentuan" : "Privacy & terms"}</span>
        <h1>
          {id ? (
            <>
              Datamu tetap <span className="brush">milikmu</span>.
            </>
          ) : (
            <>
              Your data stays <span className="brush">yours</span>.
            </>
          )}
        </h1>
      </header>
      <nav className="jump" aria-label={id ? "Di halaman ini" : "On this page"}>
        {list.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="jump-chip">{s.title}</a>
        ))}
      </nav>
      <div className="legal">
        {list.map((s) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`}>
            <h2 id={`${s.id}-h`}>{s.title}</h2>
            {s.body}
          </section>
        ))}
        <p className="muted-line">{id ? `Terakhir diperbarui ${UPDATED.id}.` : `Last updated ${UPDATED.en}.`}</p>
      </div>
    </div>
  );
}
