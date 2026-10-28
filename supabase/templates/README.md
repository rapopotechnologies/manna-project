# Supabase Auth email templates

Branded versions of the emails Supabase Auth sends (sign-up confirmation, password reset,
email change), in English and Indonesian. They're not deployed from here: paste each one into
**Supabase → Authentication → Emails → Templates**, with its subject line.

| Template in Supabase | File | Subject |
|---|---|---|
| Confirm signup | `confirmation.html` | Confirm your email · Konfirmasi emailmu |
| Reset password | `recovery.html` | Choose a new password · Buat kata sandi baru |
| Change email address | `email_change.html` | Confirm your new email · Konfirmasi email barumu |

The language comes from the account's `lang` (`user_metadata.lang`), which the sign-up form
saves from the page's language (`/id` → `id`). Accounts without it, such as Google sign-ins and
older accounts, get English. Subjects are in both languages because the language can't be
chosen until the email is opened.

The site's own emails (approval, team-sent password reset, morning reminders) are in
`src/lib/email.ts` and use the same look.
