// api/auth/logout.js — POST → destroy the session and clear the cookie.

const { send } = require("../_util");
const { destroySession, clearSessionCookie } = require("../_auth");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { error: "Method not allowed." });
  }
  try {
    await destroySession(req);
    clearSessionCookie(req, res);
    return send(res, 200, { ok: true });
  } catch (err) {
    clearSessionCookie(req, res);
    return send(res, 200, { ok: true });
  }
};
