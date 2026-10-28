import { getHiddenContent } from "@/lib/content";
import { FoundView, foundMetadata } from "@/views/FoundViews";

export async function generateStaticParams() {
  return (await getHiddenContent()).verses.map((v) => ({ verse: v.slug }));
}

export async function generateMetadata({ params }: PageProps<"/found/[verse]">) {
  return foundMetadata("en", (await params).verse);
}

export default async function Page({ params }: PageProps<"/found/[verse]">) {
  return <FoundView lang="en" slug={(await params).verse} />;
}
