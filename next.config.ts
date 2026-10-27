import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,

  // Product photos are 600–700 KB JPEGs; serve resized AVIF/WebP instead.
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  // Old addresses from the original static site. These may be printed on
  // products (the daily verse QR code especially), so they must never break.
  // All are permanent (308).
  async redirects() {
    return [
      // Printed QR code for the daily verse
      { source: "/daily_verses/daily_verses.html", destination: "/daily?src=qr", permanent: true },
      { source: "/daily_verses", destination: "/daily", permanent: true },
      { source: "/daily_verses/:path*", destination: "/daily", permanent: true },

      // Hidden verses keep their slugs
      { source: "/hidden_verses/:verse/index.html", destination: "/found/:verse", permanent: true },
      { source: "/hidden_verses/:verse", destination: "/found/:verse", permanent: true },

      // Manna Kids
      { source: "/kids_journal/daily_questions.html", destination: "/kids", permanent: true },
      { source: "/kids_journal", destination: "/kids", permanent: true },
      { source: "/kids_journal/:path*", destination: "/kids", permanent: true },

      // Old home page file
      { source: "/index.html", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
