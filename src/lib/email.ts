import "server-only";
import { SITE_URL } from "@/lib/site";

// Sends the few emails the site itself sends (sign-up and password emails come from Supabase).
// Uses Resend's HTTP API with RESEND_API_KEY. Without the key, sending is skipped.

const FROM = "Manna Project <support@bymannaproject.com>";

export const canSendEmail = () => Boolean(process.env.RESEND_API_KEY);

async function send(to: string, subject: string, html: string, text: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [to], subject, html, text }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** "You're in" email after the team approves a reader. */
export function sendApprovedEmail(to: string) {
  const url = `${SITE_URL}/account`;
  const text = [
    "Welcome to Manna Project!",
    "",
    "Your account has been approved. From now on, your manna jar, bookshelf, garden and reflections save to your account, so they're with you on every device.",
    "",
    `Open your account: ${url}`,
    "",
    "Cultivating faith, crafting grace.",
    "The Manna Project team",
  ].join("\n");

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#F8F3E6;font-family:Georgia,'Times New Roman',serif;color:#1C1B17;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8F3E6;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#FFFCF3;border:1px solid #E6DFCC;border-radius:20px;">
          <tr><td style="padding:36px 32px 8px;">
            <div style="width:44px;height:44px;border-radius:50%;background:#E1AD37;"></div>
            <p style="margin:24px 0 4px;font-family:Arial,sans-serif;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#8A6208;">Manna Project</p>
            <h1 style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:28px;line-height:1.15;">You’re in. Welcome!</h1>
            <p style="margin:0 0 16px;font-size:17px;line-height:1.6;">Your account has been approved. From now on, your manna jar, bookshelf, garden and reflections save to your account, so they’re with you on every device.</p>
            <p style="margin:24px 0 28px;">
              <a href="${url}" style="display:inline-block;background:#1C1B17;color:#F8F3E6;text-decoration:none;font-family:Arial,sans-serif;font-size:13px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;padding:14px 22px;border-radius:999px;">Open your account</a>
            </p>
          </td></tr>
          <tr><td style="padding:0 32px 32px;">
            <p style="margin:0;font-size:15px;line-height:1.6;color:#57534A;font-style:italic;">Cultivating faith, crafting grace.<br>The Manna Project team</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  return send(to, "You’re in: your Manna Project account is approved", html, text);
}
