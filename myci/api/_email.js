// api/_email.js — transactional email for magic links.
//
// Uses Resend's REST API when RESEND_API_KEY is set (server-side only — the key
// is never exposed to the browser). Without a key, falls back to logging the
// link to the server console and returning it, so auth is fully testable in dev
// before the email account is wired up. Swap in any provider by editing send().

const FROM = process.env.AUTH_FROM_EMAIL || "Myci <onboarding@resend.dev>";
const KEY = process.env.RESEND_API_KEY || "";

function magicLinkEmail(link) {
  const text =
    `Welcome to Myci — the network beneath your street.\n\n` +
    `Tap to sign in (valid for 15 minutes):\n${link}\n\n` +
    `If you didn't request this, you can ignore it.`;
  const html =
    `<div style="font-family:Georgia,serif;max-width:440px;margin:auto;color:#2A1A0E">
       <h1 style="font-family:'Alfa Slab One',Georgia,serif;color:#472C1C">MYCI</h1>
       <p style="font-size:16px;line-height:1.5">Welcome to the network beneath your street.</p>
       <p style="font-size:16px;line-height:1.5">Tap below to sign in — the link is good for 15 minutes.</p>
       <p><a href="${link}" style="display:inline-block;background:#D6AD08;color:#3A2410;
          text-decoration:none;font-size:16px;padding:12px 22px;border-radius:10px">Sign in to Myci</a></p>
       <p style="font-size:13px;color:#8a6f4a">If you didn't request this, you can ignore it.</p>
     </div>`;
  return { text, html };
}

// Returns { sent: true } on success, or { sent: false, devLink } in fallback.
async function sendMagicLink(to, link) {
  const { text, html } = magicLinkEmail(link);

  if (!KEY) {
    console.log(`\n[magic-link] no RESEND_API_KEY — dev fallback.\n  to: ${to}\n  ${link}\n`);
    return { sent: false, devLink: link };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to, subject: "Your Myci sign-in link", html, text }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`email ${res.status} ${detail.slice(0, 200)}`);
  }
  return { sent: true };
}

module.exports = { sendMagicLink };
