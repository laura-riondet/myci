// api/auth/me.js — GET → { user } | { user: null }. The app calls this on load
// to decide whether to show a signed-in state or the sign-in prompt.

const { send } = require("../_util");
const { getSession, publicUser } = require("../_auth");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return send(res, 405, { error: "Method not allowed." });
  }
  try {
    const user = await getSession(req);
    return send(res, 200, { user: publicUser(user) });
  } catch (err) {
    return send(res, 200, { user: null });
  }
};
