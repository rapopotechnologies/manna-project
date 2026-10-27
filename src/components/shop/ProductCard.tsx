import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";

type Props = { product: Product; showBlurb?: boolean; priority?: boolean };

export function ProductCard({ product, showBlurb = true, priority = false }: Props) {
  const href = `/shop/${product.slug}`;
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
      <span className="chip">{product.category}</span>
      <h3>
        <Link href={href} className="product-link">{product.name}</Link>
      </h3>
      {showBlurb && <p>{product.blurb}</p>}
    </article>
  );
}
