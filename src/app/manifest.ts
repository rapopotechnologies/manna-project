import type { MetadataRoute } from "next";

// Lets people add Manna Project to their home screen like an app.
// It opens straight to today's verse.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Manna Project",
    short_name: "Manna",
    description: "A verse every morning from Manna Project.",
    start_url: "/daily?src=homescreen",
    display: "standalone",
    background_color: "#F8F3E6",
    theme_color: "#F8F3E6",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
