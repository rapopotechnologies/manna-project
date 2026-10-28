"use client";

import { SHOPEE_SHOP_URL } from "@/data/products";
import { useLang } from "@/i18n/client";
import { useLikelyIndonesia } from "@/lib/region";
import { track } from "@/lib/track";

type Props = { slug: string; etsyUrl: string; shopeeUrl?: string };

/** Etsy for everyone, Shopee for Indonesia. Visitors in Indonesia see Shopee first. */
export function BuyButtons({ slug, etsyUrl, shopeeUrl }: Props) {
  const lang = useLang();
  const id = lang === "id";
  // Anyone reading in Indonesian sees Shopee first too.
  const indonesia = useLikelyIndonesia() || id;
  const etsy = (
    <a
      key="etsy"
      className={`btn pdp-buy ${indonesia ? "" : "btn-primary"}`}
      href={etsyUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("etsy_click", slug)}
    >
      {id ? "Beli di Etsy ↗" : "Buy on Etsy ↗"}<span className="buy-where">{id ? "Seluruh dunia" : "Worldwide"}</span>
    </a>
  );
  const shopee = (
    <a
      key="shopee"
      className={`btn pdp-buy ${indonesia ? "btn-primary" : ""}`}
      href={shopeeUrl || SHOPEE_SHOP_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("shopee_click", slug)}
    >
      {id ? "Beli di Shopee ↗" : "Buy on Shopee ↗"}<span className="buy-where">Indonesia</span>
    </a>
  );
  return <div className="buy-buttons">{indonesia ? [shopee, etsy] : [etsy, shopee]}</div>;
}
