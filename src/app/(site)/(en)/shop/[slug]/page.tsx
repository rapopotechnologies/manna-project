import { getProducts } from "@/lib/content";
import { ProductView, productMetadata } from "@/views/ShopViews";

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[slug]">) {
  return productMetadata("en", (await params).slug);
}

export default async function Page({ params }: PageProps<"/shop/[slug]">) {
  return <ProductView lang="en" slug={(await params).slug} />;
}
