// api/health.js — liveness + store status. Handy for the scalability story.
//   GET /api/health → { ok, store: "redis"|"memory", livePosts }

const { store } = require("./_store");
const { send } = require("./_util");

module.exports = async (req, res) => {
  try {
    const livePosts = await store.count();
    return send(res, 200, { ok: true, store: store.mode, livePosts });
  } catch (err) {
    return send(res, 500, { ok: false, store: store.mode, error: String(err.message || err) });
  }
};
