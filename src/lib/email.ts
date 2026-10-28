import "server-only";
import { SITE_URL } from "@/lib/site";

// Sends the few emails the site itself sends (sign-up and password emails come from Supabase).
// Uses Resend's HTTP API with RESEND_API_KEY. Without the key, sending is skipped.

const FROM = "Manna Project <support@bymannaproject.com>";

export const canSendEmail = () => Boolean(process.env.RESEND_API_KEY);

async function send(to: string, subject: string, html: string, text: string, headers?: Record<string, string>): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [to], subject, html, text, ...(headers ? { headers } : {}) }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Manna's simple email layout: a sun, a heading, a paragraph (or a verse) and one button. */
function layout({
  heading,
  body,
  url,
  button,
  verse,
  footer,
  signOffText = "Cultivating faith, crafting grace.<br>The Manna Project team",
}: {
  heading: string;
  body: string;
  url: string;
  button: string;
  verse?: { text: string; reference: string };
  footer?: string;
  signOffText?: string;
}) {
  const verseHtml = verse
    ? `<p style="margin:8px 0 6px;font-size:21px;line-height:1.5;">“${esc(verse.text)}”</p>
            <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#8A6208;">${esc(verse.reference)}</p>`
    : "";
  const footerHtml = footer
    ? `<p style="margin:16px 0 0;font-family:Arial,sans-serif;font-size:12px;line-height:1.6;color:#8A8577;">${footer}</p>`
    : "";
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#F8F3E6;font-family:Georgia,'Times New Roman',serif;color:#1C1B17;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8F3E6;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#FFFCF3;border:1px solid #E6DFCC;border-radius:20px;">
          <tr><td style="padding:36px 32px 8px;">
            <div style="width:44px;height:44px;border-radius:50%;background:#E1AD37;"></div>
            <p style="margin:24px 0 4px;font-family:Arial,sans-serif;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#8A6208;">Manna Project</p>
            <h1 style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:28px;line-height:1.15;">${heading}</h1>
            <p style="margin:0 0 16px;font-size:17px;line-height:1.6;">${body}</p>
            ${verseHtml}
            <p style="margin:24px 0 28px;">
              <a href="${url}" style="display:inline-block;background:#1C1B17;color:#F8F3E6;text-decoration:none;font-family:Arial,sans-serif;font-size:13px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;padding:14px 22px;border-radius:999px;">${button}</a>
            </p>
          </td></tr>
          <tr><td style="padding:0 32px 32px;">
            <p style="margin:0;font-size:15px;line-height:1.6;color:#57534A;font-style:italic;">${signOffText}</p>
            ${footerHtml}
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

const signOff = ["", "Cultivating faith, crafting grace.", "The Manna Project team"];

/** "You're in" email after the team approves a reader. */
export function sendApprovedEmail(to: string) {
  const url = `${SITE_URL}/account`;
  const body =
    "Your account has been approved. From now on, your manna jar, bookshelf, garden and reflections save to your account, so they’re with you on every device.";
  const text = ["Welcome to Manna Project!", "", body, "", `Open your account: ${url}`, ...signOff].join("\n");
  const html = layout({ heading: "You’re in. Welcome!", body, url, button: "Open your account" });
  return send(to, "You’re in: your Manna Project account is approved", html, text);
}

/** A link to choose a new password, sent when the team resets a reader's password. */
export function sendResetEmail(to: string, url: string) {
  const body =
    "The Manna Project team sent you this link to choose a new password. It works once and expires in an hour. If you didn’t ask for this, you can ignore this email.";
  const text = ["Choose a new password", "", body, "", url, ...signOff].join("\n");
  const html = layout({ heading: "Choose a new password", body, url, button: "Choose a new password" });
  return send(to, "Choose a new password for Manna Project", html, text);
}

const REMINDER_COPY = {
  en: {
    daily: { subject: (ref: string) => `Today’s manna: ${ref}`, heading: "Good morning", body: "Here’s today’s verse, for a quiet minute before the day gets busy." },
    away: { subject: (ref: string) => `We saved you a verse: ${ref}`, heading: "We’ve missed you", body: "Here’s today’s verse, whenever you have a quiet minute. Your jar is waiting." },
    button: "Read & reflect",
    why: "You’re getting this because you turned on morning reminders.",
    stop: "Turn them off",
    signOff: "Cultivating faith, crafting grace.<br>The Manna Project team",
  },
  id: {
    daily: { subject: (ref: string) => `Manna hari ini: ${ref}`, heading: "Selamat pagi", body: "Ini ayat hari ini, untuk saat teduh sebentar sebelum hari mulai sibuk." },
    away: { subject: (ref: string) => `Kami simpan satu ayat untukmu: ${ref}`, heading: "Kami merindukanmu", body: "Ini ayat hari ini, kapan pun kamu punya waktu tenang. Toplesmu menunggu." },
    button: "Baca & renungkan",
    why: "Kamu menerima email ini karena mengaktifkan pengingat pagi.",
    stop: "Matikan pengingat",
    signOff: "Menumbuhkan iman, merangkai anugerah.<br>Tim Manna Project",
  },
};

/** The opt-in morning reminder, with today's verse and a one-click way to stop. */
export function sendReminderEmail(o: {
  to: string;
  lang: "en" | "id";
  mode: "daily" | "away";
  verse: { text: string; reference: string };
  url: string;
  /** Page with a "Turn off" button, for the link in the email. */
  turnOffUrl: string;
  /** Endpoint for mail apps' one-click Unsubscribe. */
  unsubscribeUrl: string;
}) {
  const c = REMINDER_COPY[o.lang];
  const m = c[o.mode];
  const text = [
    m.heading,
    "",
    m.body,
    "",
    `“${o.verse.text}”`,
    o.verse.reference,
    "",
    `${c.button}: ${o.url}`,
    "",
    `${c.why} ${c.stop}: ${o.turnOffUrl}`,
  ].join("\n");
  const html = layout({
    heading: m.heading,
    body: m.body,
    verse: o.verse,
    url: o.url,
    button: c.button,
    signOffText: c.signOff,
    footer: `${c.why} <a href="${o.turnOffUrl}" style="color:#8A6208;">${c.stop}</a>.`,
  });
  // One-click unsubscribe (RFC 8058): mail apps show their own "Unsubscribe" button.
  return send(o.to, m.subject(o.verse.reference), html, text, {
    "List-Unsubscribe": `<${o.unsubscribeUrl}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  });
}
