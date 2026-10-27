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
| Home | `/` | `src/app/(site)/page.tsx` |
| Today's verse | `/daily` | NIV from OurManna, cached 15 min, falls back to `src/data/fallback-verses.ts` |
| Share image | `/daily/card` | Portrait PNG of today's verse (`src/lib/verse-card.tsx`) |
| Shop | `/shop`, `/shop/[slug]` | Managed in `/admin/products` (Supabase). `src/data/products.ts` is the fallback copy |
| Manna Kids | `/kids` | Managed in `/admin/kids`. Same question for everyone each day |
| Hidden verses | `/found/[verse]`, `/found` | Managed in `/admin/verses`. Not in the menu or sitemap |
| About | `/about` | `src/app/(site)/about/page.tsx` |
| Contact & FAQ | `/contact` | `src/app/(site)/contact/page.tsx` |
| Support | `/support` | `src/app/(site)/support/page.tsx` (Stripe giving form not built yet) |
| My manna | `/my-manna` | Manna jar, 66-book shelf, reflection garden. Saved on the reader's device (`src/lib/progress.ts`) |
| Admin | `/admin` | Invite-only. Products, hidden verses, kids' questions, team, change history, traffic |

A "day" runs midnight to midnight Pacific time (`src/lib/day.ts`).

## Old URLs (do not remove)

`next.config.ts` permanently redirects every address from the 2023 static site, including the printed QR code:

- `/daily_verses/daily_verses.html` → `/daily?src=qr`
- `/hidden_verses/<verse>/` → `/found/<verse>`
- `/kids_journal/daily_questions.html` → `/kids`

Original image paths (`/bookmarks/…`, `/journals/…`, `/stickers/…`, `/logo_and_banner/…`) are still served from `public/`.

The original site is kept in `legacy-site/` for reference. Design source files are in `design-source/` (not public).

## Content and admin (Supabase)

Supabase project **manna-project** (`duucrnfjegoqbmkmtfoa`, free plan, us-east-1) holds products, hidden verses, collections, kids' questions, the admin team, a change log, and daily visit totals. Every table uses row-level security. Public pages read through `src/lib/content.ts`, cached and refreshed the moment an admin publishes; if Supabase is unreachable or paused, they fall back to the copies in `src/data/`.

The superadmin is `rapopotechnologies@gmail.com`. They invite other admins from `/admin/team`.

Local development needs `.env.local` (not committed):

```
NEXT_PUBLIC_SUPABASE_URL=https://duucrnfjegoqbmkmtfoa.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_…
```

### One-time setup before the admin works in production

1. **Vercel → Project → Settings → Environment Variables:** add the two variables above for Production and Preview, then redeploy.
2. **Supabase → Authentication → URL Configuration:** set Site URL to `https://bymannaproject.com`, and add these Redirect URLs: `https://bymannaproject.com/admin/auth/callback`, `https://*.vercel.app/admin/auth/callback`, `http://localhost:3000/admin/auth/callback`.
3. **Supabase → Authentication → Emails → SMTP:** connect a real email sender (for example Resend) with a Manna Project address. Until then Supabase only emails the account owner, so invited admins won't receive sign-in links.

## Deploy (Vercel)

1. Import this repo in Vercel (framework: Next.js, no settings to change).
2. In the Vercel project, add the domains `bymannaproject.com` and `www.bymannaproject.com` (redirect `www` to the bare domain).
3. In Cloudflare DNS, replace the current records with the ones Vercel shows. Set them to **DNS only** (grey cloud).
4. Turn on Web Analytics in the Vercel project.
5. Check: `https://bymannaproject.com/daily_verses/daily_verses.html` should land on `/daily`.
