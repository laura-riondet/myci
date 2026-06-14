// dev-server.js — local preview only (not deployed).
// Mirrors vercel.json routing and runs the /api functions, so the landing page,
// the app, and the live feed/compose all work without `vercel dev`.
//
//   node dev-server.js   →   http://localhost:3000

const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;

// ── Load .env (zero-dependency) so the live store / auth pick up local secrets.
// Vercel injects these in prod; this mirrors that for `node dev-server.js`.
(function loadEnv() {
  try {
    const txt = fs.readFileSync(path.join(ROOT, ".env"), "utf8");
    for (const line of txt.split("\n")) {
      if (line.trim().startsWith("#")) continue;
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (!m) continue;
      const val = m[2].trim().replace(/^["']|["']$/g, "");
      if (process.env[m[1]] === undefined) process.env[m[1]] = val;
    }
    console.log(".env loaded");
  } catch { /* no .env — fine, store falls back to in-memory */ }
})();

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".jsx": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

// Give the Vercel handlers the res.status().send() shim they expect.
function shim(res) {
  res.status = (s) => { res.statusCode = s; return res; };
  res.send = (b) => { res.end(b); return res; };
  return res;
}

function serveStatic(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) { res.statusCode = 404; res.end("Not found"); return; }
    res.setHeader("Content-Type", MIME[path.extname(filePath)] || "application/octet-stream");
    // Local dev only: never cache, so edits show on a plain reload (no hard-reload needed).
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const pathname = req.url.split("?")[0];

  // ── /api/* → serverless functions ──
  if (pathname.startsWith("/api/")) {
    const name = pathname.slice("/api/".length).replace(/\/$/, "");
    const modPath = path.join(ROOT, "api", name + ".js");
    if (!fs.existsSync(modPath)) { res.statusCode = 404; res.end("No such endpoint"); return; }
    try {
      const handler = require(modPath);
      Promise.resolve(handler(req, shim(res))).catch((e) => {
        res.statusCode = 500; res.end(String(e));
      });
    } catch (e) {
      res.statusCode = 500; res.end(String(e));
    }
    return;
  }

  // ── vercel.json rewrites ──
  if (pathname === "/")        return serveStatic(res, path.join(ROOT, "index.html"));
  if (pathname === "/app")     return serveStatic(res, path.join(ROOT, "Myci.html"));
  if (pathname === "/privacy") return serveStatic(res, path.join(ROOT, "privacy.html"));
  if (pathname === "/terms")   return serveStatic(res, path.join(ROOT, "terms.html"));

  // ── static files ──
  serveStatic(res, path.join(ROOT, pathname));
});

server.listen(PORT, () => {
  console.log(`Myci dev server → http://localhost:${PORT}  (landing) · http://localhost:${PORT}/app  (app)`);
});
