import { getHiddenContent } from "@/lib/content";
import { FoundView, foundMetadata } from "@/views/FoundViews";

export async function generateStaticParams() {
  return (await getHiddenContent()).verses.map((v) => ({ verse: v.slug }));
}

export async function generateMetadata({ params }: PageProps<"/id/found/[verse]">) {
  return foundMetadata("id", (await params).verse);
}

export default async function Page({ params }: PageProps<"/id/found/[verse]">) {
  return <FoundView lang="id" slug={(await params).verse} />;
}
