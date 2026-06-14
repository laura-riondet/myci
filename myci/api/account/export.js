// api/account/export.js — GET → everything we hold about you, as JSON.
//
// Data sovereignty: a neighbor can take their data and leave at any time. This
// returns the user record plus every post they've authored — the same data the
// app would need to recreate their presence elsewhere.

const { send } = require("../_util");
const { getSession, publicUser } = require("../_auth");
const { store } = require("../_store");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return send(res, 405, { error: "Method not allowed." });
  }
  try {
    const user = await getSession(req);
    if (!user) return send(res, 401, { error: "Please sign in." });

    const posts = (await store.allPosts()).filter((p) => p.authorId === user.id);
    return send(res, 200, {
      exportedAt: new Date().toISOString(),
      account: publicUser(user),
      posts,
      note: "This is all the data Myci holds about you. No ads, no resale — yours to keep.",
    });
  } catch (err) {
    return send(res, 500, { error: "Export unavailable.", detail: String(err.message || err) });
  }
};
