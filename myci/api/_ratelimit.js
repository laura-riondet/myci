// api/_ratelimit.js — fixed-window rate limiting (abuse control at scale).
//
// Redis-backed when available (shared across all serverless instances, so the
// limit holds at 10k users behind many cold starts); falls back to a per-
// instance in-memory window for `vercel dev` / local demos.

const { redis, HAS_REDIS } = require("./_store");

const mem = new Map(); // id -> { count, resetAt }

// Returns { ok, remaining, retryAfter(seconds) }.
async function limit(id, { max = 8, windowSec = 60 } = {}) {
  const key = `myci:rl:${id}`;

  if (HAS_REDIS) {
    const n = await redis(["INCR", key]);
    if (n === 1) await redis(["EXPIRE", key, windowSec]);
    let ttl = await redis(["TTL", key]);
    if (ttl == null || ttl < 0) ttl = windowSec;
    return { ok: n <= max, remaining: Math.max(0, max - n), retryAfter: ttl };
  }

  const now = Date.now();
  const rec = mem.get(id);
  if (!rec || rec.resetAt <= now) {
    mem.set(id, { count: 1, resetAt: now + windowSec * 1000 });
    return { ok: true, remaining: max - 1, retryAfter: windowSec };
  }
  rec.count += 1;
  return {
    ok: rec.count <= max,
    remaining: Math.max(0, max - rec.count),
    retryAfter: Math.ceil((rec.resetAt - now) / 1000),
  };
}

// Best-effort client identifier: real IP behind Vercel's proxy, else socket.
function clientId(req) {
  const xff = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return xff || (req.socket && req.socket.remoteAddress) || "anon";
}

module.exports = { limit, clientId };
