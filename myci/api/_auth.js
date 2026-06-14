// api/_auth.js — passwordless (magic-link) identity + sessions.
//
// Storage: Redis when configured (durable, shared across instances → real at
// 10k); per-instance in-memory Maps otherwise (dev / demo).
//
//   users    myci:user:{email}      → { id, email, name, createdAt, gave, asked }
//   magic    myci:magic:{token}     → email           (TTL 15m, single-use)
//   session  myci:sess:{token}      → userId          (TTL 30d)
//
// No npm deps — Node's crypto + the Redis REST helper from _store.js.

const crypto = require("crypto");
const { redis, HAS_REDIS } = require("./_store");

const MAGIC_TTL = 15 * 60;          // 15 minutes
const SESSION_TTL = 30 * 24 * 3600; // 30 days
const COOKIE = "myci_session";

// ── in-memory fallback ───────────────────────────────────────────────────────
const memUsers = new Map();   // email -> user
const memMagic = new Map();   // token -> { email, exp }
const memSess = new Map();    // token -> { userId, exp }

const token = () => crypto.randomBytes(24).toString("hex");
const userId = () => "u_" + crypto.randomBytes(6).toString("hex");
const normEmail = (e) => String(e || "").trim().toLowerCase();

// ── tiny redis json helpers ──────────────────────────────────────────────────
async function rSet(key, val, ttl) {
  const cmd = ["SET", key, JSON.stringify(val)];
  if (ttl) cmd.push("EX", ttl);
  await redis(cmd);
}
async function rGet(key) {
  const v = await redis(["GET", key]);
  if (v == null) return null;
  try { return JSON.parse(v); } catch { return null; }
}
const rDel = (key) => redis(["DEL", key]);

// ── users ────────────────────────────────────────────────────────────────────
async function upsertUser(email, name) {
  email = normEmail(email);
  const key = `myci:user:${email}`;
  if (HAS_REDIS) {
    const existing = await rGet(key);
    if (existing) return existing;
    const user = { id: userId(), email, name: name || email.split("@")[0], createdAt: new Date().toISOString(), gave: 0, asked: 0 };
    await rSet(key, user);
    return user;
  }
  if (memUsers.has(email)) return memUsers.get(email);
  const user = { id: userId(), email, name: name || email.split("@")[0], createdAt: new Date().toISOString(), gave: 0, asked: 0 };
  memUsers.set(email, user);
  return user;
}

async function getUserByEmail(email) {
  email = normEmail(email);
  return HAS_REDIS ? rGet(`myci:user:${email}`) : (memUsers.get(email) || null);
}

// ── magic tokens ─────────────────────────────────────────────────────────────
async function createMagicToken(email) {
  email = normEmail(email);
  const t = token();
  if (HAS_REDIS) await rSet(`myci:magic:${t}`, { email }, MAGIC_TTL);
  else memMagic.set(t, { email, exp: Date.now() + MAGIC_TTL * 1000 });
  return t;
}

async function consumeMagicToken(t) {
  if (!t) return null;
  if (HAS_REDIS) {
    const rec = await rGet(`myci:magic:${t}`);
    if (!rec) return null;
    await rDel(`myci:magic:${t}`); // single-use
    return rec.email;
  }
  const rec = memMagic.get(t);
  if (!rec || rec.exp < Date.now()) { memMagic.delete(t); return null; }
  memMagic.delete(t);
  return rec.email;
}

// ── sessions ─────────────────────────────────────────────────────────────────
async function createSession(uid) {
  const t = token();
  if (HAS_REDIS) await rSet(`myci:sess:${t}`, { userId: uid }, SESSION_TTL);
  else memSess.set(t, { userId: uid, exp: Date.now() + SESSION_TTL * 1000 });
  return t;
}

function parseCookies(req) {
  const out = {};
  const raw = req.headers.cookie || "";
  raw.split(";").forEach((p) => {
    const i = p.indexOf("=");
    if (i > -1) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim());
  });
  return out;
}

// Resolve the signed-in user from the request cookie, or null.
async function getSession(req) {
  const t = parseCookies(req)[COOKIE];
  if (!t) return null;
  let uid;
  if (HAS_REDIS) {
    const rec = await rGet(`myci:sess:${t}`);
    uid = rec && rec.userId;
  } else {
    const rec = memSess.get(t);
    if (rec && rec.exp < Date.now()) { memSess.delete(t); return null; }
    uid = rec && rec.userId;
  }
  if (!uid) return null;
  // resolve user record
  if (HAS_REDIS) {
    // scan-free: we stored by email, so keep a reverse map id->email in redis
    const email = await redis(["GET", `myci:uid:${uid}`]);
    if (!email) return null;
    return rGet(`myci:user:${email}`);
  }
  for (const u of memUsers.values()) if (u.id === uid) return u;
  return null;
}

// Persist the id→email reverse lookup (so getSession can resolve the user).
async function linkUid(uid, email) {
  if (HAS_REDIS) await redis(["SET", `myci:uid:${uid}`, normEmail(email)]);
}

async function destroySession(req) {
  const t = parseCookies(req)[COOKIE];
  if (!t) return;
  if (HAS_REDIS) await rDel(`myci:sess:${t}`);
  else memSess.delete(t);
}

// Erase a user record + reverse link + current session. Posts are removed by
// the caller via the store (it owns the posts list). Returns true if removed.
async function deleteUser(req, user) {
  if (!user) return false;
  const email = normEmail(user.email);
  if (HAS_REDIS) {
    await rDel(`myci:user:${email}`);
    await rDel(`myci:uid:${user.id}`);
  } else {
    memUsers.delete(email);
  }
  await destroySession(req);
  return true;
}

// ── cookie header builders ───────────────────────────────────────────────────
function sessionCookie(req, value, maxAge) {
  const https = String(req.headers["x-forwarded-proto"] || "").includes("https");
  const parts = [
    `${COOKIE}=${value}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ];
  if (https) parts.push("Secure");
  return parts.join("; ");
}

const setSessionCookie = (req, res, value) => res.setHeader("Set-Cookie", sessionCookie(req, value, SESSION_TTL));
const clearSessionCookie = (req, res) => res.setHeader("Set-Cookie", sessionCookie(req, "", 0));

// Public-safe user shape (no internal fields beyond what the app shows).
function publicUser(u) {
  if (!u) return null;
  return { id: u.id, email: u.email, name: u.name, gave: u.gave || 0, asked: u.asked || 0 };
}

function originOf(req) {
  const proto = String(req.headers["x-forwarded-proto"] || "http").split(",")[0];
  const host = req.headers.host || "localhost:3000";
  return `${proto}://${host}`;
}

module.exports = {
  upsertUser, getUserByEmail, createMagicToken, consumeMagicToken,
  createSession, getSession, destroySession, deleteUser, linkUid,
  setSessionCookie, clearSessionCookie, publicUser, originOf, normEmail,
};
