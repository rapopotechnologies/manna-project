import Link from "next/link";
import { cacheLife } from "next/cache";
import { CopyButton } from "@/components/CopyButton";
import { CONTACT_EMAIL, ETSY_SHOP_URL } from "@/data/products";
import { MOTTO } from "@/lib/site";

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap site-footer-inner">
        <div className="footer-motto">
          <span className="footer-sun" aria-hidden="true" />
          <p className="hand">{MOTTO}.</p>
        </div>

        <div className="footer-cols">
          <div>
            <p className="label">Say hello</p>
            <p className="footer-email">
              <span className="selectable">{CONTACT_EMAIL}</span>
              <CopyButton text={CONTACT_EMAIL} label="Copy email" className="btn btn-small btn-ghost" />
            </p>
          </div>
          <div>
            <p className="label">Shop</p>
            <a href={ETSY_SHOP_URL} target="_blank" rel="noopener noreferrer">
              Manna Project on Etsy ↗
            </a>
          </div>
          <div>
            <p className="label">Every day</p>
            <ul className="footer-links">
              <li><Link href="/daily">Today’s verse</Link></li>
              <li><Link href="/kids">Manna Kids question</Link></li>
            </ul>
          </div>
        </div>

        <p className="footer-legal">
          © <CurrentYear /> Manna Project. Daily verse powered by{" "}
          <a href="https://www.ourmanna.com/" target="_blank" rel="noopener noreferrer">OurManna.com</a>.
        </p>
      </div>
    </footer>
  );
}
