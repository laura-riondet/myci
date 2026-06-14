// api/_store.js — storage abstraction for Myci's live layer.
//
// SCALE NOTE
// ──────────
// The shipped neighborhood (NEIGHBORS/POSTS in myci-data.jsx) is the static
// seed that renders instantly, offline. This store holds the *live* layer:
// posts neighbors create now. It speaks to a serverless Redis over its REST
// API (Vercel KV / Upstash) when credentials are present, and falls back to a
// per-instance in-memory array otherwise.
//
//   • Redis mode  → durable, shared across instances, scales to 10k+.
//   • Memory mode → zero-config; survives within one warm instance only.
//                    Good for `vercel dev` and local demos, NOT for prod.
//
// No npm dependencies: we call the REST endpoint with the global fetch()
// that Vercel's Node runtime provides.

const crypto = require("crypto");

const POSTS_KEY = "myci:posts";
const POSTS_CAP = 5000; // bound memory / list length

// Accept either Vercel KV or raw Upstash env var names.
const REST_URL =
  process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const REST_TOKEN =
  process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";

const HAS_REDIS = Boolean(REST_URL && REST_TOKEN);

// ── Redis REST helper ───────────────────────────────────────────────────────
async function redis(command) {
  const res = await fetch(REST_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });
  if (!res.ok) throw new Error(`redis ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(`redis: ${json.error}`);
  return json.result;
}

// ── In-memory fallback (newest-first) ─────────────────────────────────────────
const mem = [];

// ── Public store API ──────────────────────────────────────────────────────────
const store = {
  mode: HAS_REDIS ? "redis" : "memory",

  async addPost(post) {
    const record = { ...post, id: post.id || "p_" + crypto.randomUUID().slice(0, 8) };
    if (HAS_REDIS) {
      await redis(["LPUSH", POSTS_KEY, JSON.stringify(record)]);
      await redis(["LTRIM", POSTS_KEY, 0, POSTS_CAP - 1]);
    } else {
      mem.unshift(record);
      if (mem.length > POSTS_CAP) mem.length = POSTS_CAP;
    }
    return record;
  },

  // Returns the live posts, newest first (capped). Handler filters/paginates.
  async allPosts() {
    if (HAS_REDIS) {
      const raw = await redis(["LRANGE", POSTS_KEY, 0, POSTS_CAP - 1]);
      return (raw || []).map((s) => {
        try { return JSON.parse(s); } catch { return null; }
      }).filter(Boolean);
    }
    return mem.slice();
  },

  async count() {
    if (HAS_REDIS) return (await redis(["LLEN", POSTS_KEY])) || 0;
    return mem.length;
  },

  // Remove every post by an author (account deletion / data erasure).
  // Rewrites the list atomically-enough for our scale; returns count removed.
  async removeByAuthor(authorId) {
    const all = await this.allPosts();
    const kept = all.filter((p) => p.authorId !== authorId);
    const removed = all.length - kept.length;
    if (!removed) return 0;
    if (HAS_REDIS) {
      await redis(["DEL", POSTS_KEY]);
      // re-push in original (newest-first) order
      for (let i = kept.length - 1; i >= 0; i--) {
        await redis(["LPUSH", POSTS_KEY, JSON.stringify(kept[i])]);
      }
    } else {
      mem.length = 0;
      kept.forEach((p) => mem.push(p));
    }
    return removed;
  },
};

module.exports = { store, HAS_REDIS, redis };
