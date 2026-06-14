// api/auth/verify.js — GET ?token=… → consume magic token, open a session.
//
// This is the URL inside the email. On success it sets the httpOnly session
// cookie and redirects into the app. Invalid/expired tokens bounce to /app with
// a flag the UI can surface.

const { consumeMagicToken, upsertUser, createSession, linkUid, setSessionCookie, originOf } = require("../_auth");

function redirect(res, url) {
  res.statusCode = 302;
  res.setHeader("Location", url);
  res.end();
}

module.exports = async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    const token = url.searchParams.get("token") || "";

    const email = await consumeMagicToken(token);
    if (!email) return redirect(res, `${originOf(req)}/app?auth=expired`);

    const user = await upsertUser(email);
    await linkUid(user.id, email);
    const session = await createSession(user.id);
    setSessionCookie(req, res, session);

    return redirect(res, `${originOf(req)}/app?auth=ok`);
  } catch (err) {
    return redirect(res, `${originOf(req)}/app?auth=error`);
  }
};
