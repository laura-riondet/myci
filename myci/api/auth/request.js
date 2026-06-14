// api/auth/request.js — POST { email } → emails a magic sign-in link.
//
// Rate-limited per IP+email to prevent inbox-bombing. We do NOT create the user
// here — the account is created only when the link is verified (proves the email
// is real). Always returns 200 to avoid leaking which addresses exist.

const { send } = require("../_util");
const { limit, clientId } = require("../_ratelimit");
const { createMagicToken, normEmail, originOf } = require("../_auth");
const { sendMagicLink } = require("../_email");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY = 4 * 1024;

async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  let raw = "";
  for await (const chunk of req) { raw += chunk; if (raw.length > MAX_BODY) throw new Error("too large"); }
  return raw ? JSON.parse(raw) : {};
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { error: "Method not allowed." });
  }
  try {
    let input;
    try { input = await readJson(req); } catch { return send(res, 400, { error: "Invalid request body." }); }

    const email = normEmail(input.email);
    if (!EMAIL_RE.test(email) || email.length > 200) {
      return send(res, 422, { error: "Please enter a valid email address." });
    }

    const rl = await limit(`authreq:${clientId(req)}:${email}`, { max: 5, windowSec: 600 });
    if (!rl.ok) {
      res.setHeader("Retry-After", rl.retryAfter);
      return send(res, 429, { error: "Too many requests. Try again in a few minutes." });
    }

    const token = await createMagicToken(email);
    const link = `${originOf(req)}/api/auth/verify?token=${token}`;

    let devLink;
    try {
      const result = await sendMagicLink(email, link);
      devLink = result.devLink; // present only in no-email-provider fallback
    } catch (e) {
      return send(res, 502, { error: "Couldn't send the email right now. Please try again." });
    }

    // devLink is returned ONLY when no email provider is configured (local dev).
    return send(res, 200, devLink ? { ok: true, devLink } : { ok: true });
  } catch (err) {
    return send(res, 500, { error: "Sign-in unavailable.", detail: String(err.message || err) });
  }
};
