import { getProducts } from "@/lib/content";
import { ProductView, productMetadata } from "@/views/ShopViews";

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/id/shop/[slug]">) {
  return productMetadata("id", (await params).slug);
}

export default async function Page({ params }: PageProps<"/id/shop/[slug]">) {
  return <ProductView lang="id" slug={(await params).slug} />;
}
