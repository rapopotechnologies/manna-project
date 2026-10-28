import Image from "next/image";
import Link from "next/link";
import { CATEGORY_LABELS_ID, type Product } from "@/data/products";
import { localPath, type Lang } from "@/i18n/lang";
import { cardPrice, productCopy } from "@/lib/product-copy";

type Props = { product: Product; showBlurb?: boolean; priority?: boolean; lang?: Lang };

export function ProductCard({ product, showBlurb = true, priority = false, lang = "en" }: Props) {
  const href = localPath(lang, `/shop/${product.slug}`);
  const copy = productCopy(product, lang);
  const price = cardPrice(product, lang);
  return (
    <article className="product">
      <Link className="product-photo" href={href} tabIndex={-1} aria-hidden="true">
        <Image
          src={product.images[0].src}
          alt=""
          width={1000}
          height={800}
          sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 360px"
          priority={priority}
        />
        {product.images.length > 1 && (
          <Image
            className="product-photo-alt"
            src={product.images[1].src}
            alt=""
            width={1000}
            height={800}
            sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 360px"
          />
        )}
      </Link>
      <span className="chip">{lang === "id" ? CATEGORY_LABELS_ID[product.category] : product.category}</span>
      <h3 lang={copy.lang}>
        <Link href={href} className="product-link">{copy.name}</Link>
      </h3>
      {showBlurb && <p lang={copy.lang}>{copy.blurb}</p>}
      {price && <p className="product-price">{price}</p>}
    </article>
  );
}
