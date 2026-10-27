import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { MyManna } from "@/components/progress/MyManna";
import { dayKeyFor } from "@/lib/day";

export const metadata: Metadata = {
  title: "My manna",
  description: "Your manna jar, bookshelf and reflection garden.",
  robots: { index: false },
};

async function today() {
  "use cache";
  cacheLife({ stale: 300, revalidate: 900, expire: 3600 });
  return dayKeyFor(new Date());
}

export default async function MyMannaPage() {
  return (
    <div className="wrap">
      <header className="plaque">
        <span className="label">My manna</span>
        <h1>
          A little, <span className="brush">every day</span>.
        </h1>
        <p className="lede">Your jar, your shelf and your garden: a quiet record of the mornings you’ve spent with God’s word.</p>
      </header>
      <MyManna today={await today()} />
    </div>
  );
}
