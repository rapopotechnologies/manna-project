"use client";

import { SHOPEE_SHOP_URL } from "@/data/products";
import { useLikelyIndonesia } from "@/lib/region";
import { track } from "@/lib/track";

type Props = { slug: string; etsyUrl: string; shopeeUrl?: string };

/** Etsy for everyone, Shopee for Indonesia. Visitors in Indonesia see Shopee first. */
export function BuyButtons({ slug, etsyUrl, shopeeUrl }: Props) {
  const indonesia = useLikelyIndonesia();
  const etsy = (
    <a
      key="etsy"
      className={`btn pdp-buy ${indonesia ? "" : "btn-primary"}`}
      href={etsyUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("etsy_click", slug)}
    >
      Buy on Etsy ↗<span className="buy-where">Worldwide</span>
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
      Buy on Shopee ↗<span className="buy-where">Indonesia</span>
    </a>
  );
  return <div className="buy-buttons">{indonesia ? [shopee, etsy] : [etsy, shopee]}</div>;
}
