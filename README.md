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
| Your account | `/account` | Optional reader accounts (email + password; Google button behind `NEXT_PUBLIC_GOOGLE_SIGNIN=on`). Syncs progress via `src/lib/sync.ts` |
| Admin | `/admin` | Invite-only. Products, hidden verses, kids' questions, team, change history, traffic |

Each reader gets the day's content at their own midnight (`src/lib/reader-day.ts`). Pages include every day a reader could be on, and a tiny head script plus CSS shows the reader's own day at first paint (`src/components/DayVariants.tsx`).

The daily verse comes from an archive in Supabase (`daily_verses`). A database job (`pg_cron`, every hour at :05) fetches OurManna and saves the verse for that UTC date, skipping until OurManna has switched. Because OurManna publishes at about midnight UTC, readers ahead of UTC (Indonesia) get each new verse at about 7am local time. Admin traffic counts still use Pacific dates.

## Old URLs (do not remove)

`next.config.ts` permanently redirects every address from the 2023 static site, including the printed QR code:

- `/daily_verses/daily_verses.html` → `/daily?src=qr`
- `/hidden_verses/<verse>/` → `/found/<verse>`
- `/kids_journal/daily_questions.html` → `/kids`

Original image paths (`/bookmarks/…`, `/journals/…`, `/stickers/…`, `/logo_and_banner/…`) are still served from `public/`.

The original site is kept in `legacy-site/` for reference. Design source files are in `design-source/` (not public).

## Content and admin (Supabase)

Supabase project **manna-project** (`duucrnfjegoqbmkmtfoa`, free plan, us-east-1) holds products, hidden verses, collections, kids' questions, the admin team, a change log, and daily visit totals. Every table uses row-level security. Public pages read through `src/lib/content.ts`, cached and refreshed the moment an admin publishes; if Supabase is unreachable or paused, they fall back to the copies in `src/data/`.

The superadmin is `rapopotechnologies@gmail.com`.

### Admin sign-in (email + password)

- Only the superadmin creates logins. On `/admin/team`, adding an email creates the account with a temporary password that's shown once, to pass along. Nothing is emailed.
- At first sign-in, a temporary password must be replaced before anything else.
- Forgotten password: the superadmin clicks "Reset password" on the team page.
- Removing someone deletes their login.
- Google sign-in is planned for later.

Local development needs `.env.local` (not committed):

```
NEXT_PUBLIC_SUPABASE_URL=https://duucrnfjegoqbmkmtfoa.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_…
SUPABASE_SECRET_KEY=sb_secret_…   # server only; never prefix with NEXT_PUBLIC
```

### One-time setup

1. **Supabase → Project Settings → API Keys:** copy the secret key (`sb_secret_…`) into `.env.local` as `SUPABASE_SECRET_KEY`.
2. **Vercel → Project → Settings → Environment Variables:** add all three variables above for Production and Preview, then redeploy. Mark the secret key as sensitive.
3. **Supabase → Authentication → Sign In / Providers:** turn off "Allow new users to sign up". Logins are only created from the team page.
4. **Your superadmin login:** run `node scripts/create-superadmin-login.mjs`, sign in at `/admin/login` with the temporary password it prints, and choose your own.

### Reader accounts (one-time setup)

1. **Supabase → Authentication → Sign In / Providers:** turn "Allow new users to sign up" back on, and keep "Confirm email" on. Readers can sign up; admin rights still come only from the team list.
2. **Resend as Supabase's email sender:** in Resend, verify the `bymannaproject.com` domain (add its DNS records in Cloudflare). Then either use Resend's Supabase integration, or enter it by hand in **Supabase → Authentication → Emails → SMTP Settings**: host `smtp.resend.com`, port `465`, username `resend`, password = a Resend API key, sender `support@bymannaproject.com` (forwards to the team inbox, so replies arrive), name "Manna Project".
3. **Supabase → Authentication → URL Configuration:** Site URL `https://bymannaproject.com`; redirect URLs `https://bymannaproject.com/auth/callback`, `https://*.vercel.app/auth/callback`, `http://localhost:3000/auth/callback`.
4. **Later, Google:** create an OAuth client in Google Cloud with redirect URI `https://duucrnfjegoqbmkmtfoa.supabase.co/auth/v1/callback`, paste it into Supabase → Providers → Google, then set `NEXT_PUBLIC_GOOGLE_SIGNIN=on` in Vercel and redeploy.

## Deploy (Vercel)

1. Import this repo in Vercel (framework: Next.js, no settings to change).
2. In the Vercel project, add the domains `bymannaproject.com` and `www.bymannaproject.com` (redirect `www` to the bare domain).
3. In Cloudflare DNS, replace the current records with the ones Vercel shows. Set them to **DNS only** (grey cloud).
4. Turn on Web Analytics in the Vercel project.
5. Check: `https://bymannaproject.com/daily_verses/daily_verses.html` should land on `/daily`.
