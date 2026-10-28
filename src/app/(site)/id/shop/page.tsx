import { ShopView, shopMetadata } from "@/views/ShopViews";

export const metadata = shopMetadata("id");

export default function Page() {
  return <ShopView lang="id" />;
}
