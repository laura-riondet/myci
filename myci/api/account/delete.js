// api/account/delete.js — POST → erase the account and all its posts.
//
// Irreversible by design and complete: the user record, the id→email link, the
// session, and every post the user authored are removed. Anti-extractive means
// leaving has to be as easy as joining.

const { send } = require("../_util");
const { getSession, deleteUser, clearSessionCookie } = require("../_auth");
const { store } = require("../_store");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { error: "Method not allowed." });
  }
  try {
    const user = await getSession(req);
    if (!user) return send(res, 401, { error: "Please sign in." });

    const postsRemoved = await store.removeByAuthor(user.id);
    await deleteUser(req, user);
    clearSessionCookie(req, res);

    return send(res, 200, { ok: true, postsRemoved });
  } catch (err) {
    return send(res, 500, { error: "Deletion unavailable.", detail: String(err.message || err) });
  }
};
