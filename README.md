# Manna Project

The web app behind [bymannaproject.com](https://bymannaproject.com): a daily verse, a daily Manna Kids question, ten hidden verses reached by QR code, and a showroom for the Etsy shop.

Built with Next.js 16 (App Router, React 19, TypeScript). Design direction: "Daybreak Farmhouse" (see the renovation brief).

## Run it

```sh
npm install
npm run dev        # http://localhost:3000
npm run build && npm run start   # production build
```

## Where things live

| Page | Route | Content |
| --- | --- | --- |
| Home | `/` | `src/app/page.tsx` |
| Today's verse | `/daily` | NIV from OurManna, cached 15 min, falls back to `src/data/fallback-verses.ts` |
| Share image | `/daily/card` | Portrait PNG of today's verse (`src/lib/verse-card.tsx`) |
| Shop | `/shop` | `src/data/products.ts` (add a product by adding one entry) |
| Manna Kids | `/kids` | `src/data/kids-questions.ts`, same question for everyone each day |
| Hidden verses | `/found/[verse]` | `src/data/hidden-verses.ts`, not in the menu or sitemap |
| About | `/about` | `src/app/about/page.tsx` |

A "day" runs midnight to midnight Pacific time (`src/lib/day.ts`).

## Old URLs (do not remove)

`next.config.ts` permanently redirects every address from the 2023 static site, including the printed QR code:

- `/daily_verses/daily_verses.html` → `/daily?src=qr`
- `/hidden_verses/<verse>/` → `/found/<verse>`
- `/kids_journal/daily_questions.html` → `/kids`

Original image paths (`/bookmarks/…`, `/journals/…`, `/stickers/…`, `/logo_and_banner/…`) are still served from `public/`.

The original site is kept in `legacy-site/` for reference. Design source files are in `design-source/` (not public).

## Deploy (Vercel)

1. Import this repo in Vercel (framework: Next.js, no settings to change).
2. In the Vercel project, add the domains `bymannaproject.com` and `www.bymannaproject.com` (redirect `www` to the bare domain).
3. In Cloudflare DNS, replace the current records with the ones Vercel shows. Set them to **DNS only** (grey cloud).
4. Turn on Web Analytics in the Vercel project.
5. Check: `https://bymannaproject.com/daily_verses/daily_verses.html` should land on `/daily`.
