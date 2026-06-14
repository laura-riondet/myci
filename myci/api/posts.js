// api/posts.js — the live posts layer.
//   GET  /api/posts?type=&q=&page=&perPage=   → { items, total, hasMore }
//   POST /api/posts   { type, title, body, tags, ... }  → { item }
//
// Filtering + pagination happen here over the capped live set, so the API
// shape matches the documented contract and the feed can paginate as it grows.

const { store } = require("./_store");
const { send, paginate, normalizePost } = require("./_util");
const { limit, clientId } = require("./_ratelimit");
const { getSession } = require("./_auth");

const MAX_BODY = 8 * 1024; // 8KB — reject oversized payloads

function clampInt(v, def, min, max) {
  const n = parseInt(v, 10);
  if (Number.isNaN(n)) return def;
  return Math.max(min, Math.min(max, n));
}

async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body; // Vercel pre-parses
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > MAX_BODY) throw new Error("payload too large");
  }
  return raw ? JSON.parse(raw) : {};
}

module.exports = async (req, res) => {
  try {
    if (req.method === "GET") {
      const url = new URL(req.url, "http://localhost");
      const type = url.searchParams.get("type") || "";
      const q = (url.searchParams.get("q") || "").trim().toLowerCase();
      const page = clampInt(url.searchParams.get("page"), 0, 0, 10000);
      const perPage = clampInt(url.searchParams.get("perPage"), 50, 1, 100);

      let items = await store.allPosts();
      if (type && type !== "all") items = items.filter((p) => p.type === type);
      if (q) {
        items = items.filter((p) =>
          (p.title + " " + p.body + " " + (p.tags || []).join(" ")).toLowerCase().includes(q)
        );
      }
      return send(res, 200, paginate(items, page, perPage));
    }

    if (req.method === "POST") {
      // Posting requires a signed-in neighbor — reading stays public.
      const user = await getSession(req);
      if (!user) return send(res, 401, { error: "Please sign in to share with your neighbors." });

      // Abuse control: cap posts per neighbor (durable across instances on Redis).
      const rl = await limit(`post:${user.id}:${clientId(req)}`, { max: 8, windowSec: 60 });
      if (!rl.ok) {
        res.setHeader("Retry-After", rl.retryAfter);
        return send(res, 429, { error: "You're posting quickly — give it a moment and try again." });
      }

      let input;
      try {
        input = await readJson(req);
      } catch (e) {
        return send(res, /too large/.test(e.message) ? 413 : 400, { error: "Invalid request body." });
      }
      const { post, error } = normalizePost(input, user);
      if (error) return send(res, 422, { error });
      const item = await store.addPost(post);
      return send(res, 201, { item });
    }

    res.setHeader("Allow", "GET, POST");
    return send(res, 405, { error: "Method not allowed." });
  } catch (err) {
    return send(res, 500, { error: "Store unavailable.", detail: String(err.message || err) });
  }
};
