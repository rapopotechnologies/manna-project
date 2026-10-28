import { ShopView, shopMetadata } from "@/views/ShopViews";

export const metadata = shopMetadata("en");

export default function Page() {
  return <ShopView lang="en" />;
}
