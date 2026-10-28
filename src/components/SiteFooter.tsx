import Link from "next/link";
import { cacheLife } from "next/cache";
import { CopyButton } from "@/components/CopyButton";
import { CONTACT_EMAIL, ETSY_SHOP_URL, SHOPEE_SHOP_URL } from "@/data/products";
import { localPath, type Lang } from "@/i18n/lang";
import { MOTTO, MOTTO_ID } from "@/lib/site";

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

const T = {
  en: {
    hello: "Say hello",
    copy: "Copy email",
    copied: "Copied",
    shop: "Shop",
    shopee: "Shopee (Indonesia) ↗",
    etsy: "Etsy (worldwide) ↗",
    support: "Support Manna Project",
    everyDay: "Every day",
    verse: "Today’s verse",
    kids: "Manna Kids question",
    jar: "My manna jar",
    account: "Your account",
    contact: "Contact & FAQ",
    powered: "Daily verse powered by",
  },
  id: {
    hello: "Sapa kami",
    copy: "Salin email",
    copied: "Tersalin",
    shop: "Toko",
    shopee: "Shopee (Indonesia) ↗",
    etsy: "Etsy (seluruh dunia) ↗",
    support: "Dukung Manna Project",
    everyDay: "Setiap hari",
    verse: "Ayat hari ini",
    kids: "Pertanyaan Manna Kids",
    jar: "Toples manna-ku",
    account: "Akunmu",
    contact: "Kontak & Tanya jawab",
    powered: "Ayat harian dari",
  },
};

export function SiteFooter({ lang }: { lang: Lang }) {
  const t = T[lang];
  const L = (path: string) => localPath(lang, path);
  return (
    <footer className="site-footer">
      <div className="wrap site-footer-inner">
        <div className="footer-motto">
          <span className="footer-sun" aria-hidden="true" />
          <p className="hand">{lang === "id" ? MOTTO_ID : MOTTO}.</p>
        </div>

        <div className="footer-cols">
          <div>
            <p className="label"><Link href={L("/contact")}>{t.hello}</Link></p>
            <p className="footer-email">
              <span className="selectable">{CONTACT_EMAIL}</span>
              <CopyButton text={CONTACT_EMAIL} label={t.copy} doneLabel={t.copied} className="btn btn-small btn-ghost" />
            </p>
          </div>
          <div>
            <p className="label">{t.shop}</p>
            <a href={SHOPEE_SHOP_URL} target="_blank" rel="noopener noreferrer">{t.shopee}</a>
            <a href={ETSY_SHOP_URL} target="_blank" rel="noopener noreferrer">{t.etsy}</a>
            <Link href={L("/support")}>{t.support}</Link>
          </div>
          <div>
            <p className="label">{t.everyDay}</p>
            <ul className="footer-links">
              <li><Link href={L("/daily")}>{t.verse}</Link></li>
              <li><Link href={L("/kids")}>{t.kids}</Link></li>
              <li><Link href={L("/my-manna")}>{t.jar}</Link></li>
              <li><Link href={L("/account")}>{t.account}</Link></li>
              <li><Link href={L("/contact")}>{t.contact}</Link></li>
            </ul>
          </div>
        </div>

        <p className="footer-legal">
          © <CurrentYear /> Manna Project. {t.powered}{" "}
          <a href="https://www.ourmanna.com/" target="_blank" rel="noopener noreferrer">OurManna.com</a>.
        </p>
      </div>
    </footer>
  );
}
