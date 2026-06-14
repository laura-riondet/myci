# Myci — the network beneath your street

A reciprocal, offline-first mutual-aid network for one neighborhood at a time.
Give first, grow together: share food, tools, skills, time and energy with the
neighbors you already have. No money, no precise location, no ads.

> Hackathon 2026 — *Think globally, build locally.*

## Routes

| URL     | Serves        | What it is                                          |
| ------- | ------------- | --------------------------------------------------- |
| `/`     | `index.html`  | Public landing page (plain HTML/CSS, no JS needed). |
| `/app`  | `Myci.html`   | The prototype — a React PWA in a phone frame.       |
| `/api/*`| `api/*.js`    | Serverless backend (the live data layer).           |

Routing is configured in [`vercel.json`](./vercel.json). The shared design
system lives in [`globals.css`](./globals.css) and is used by both the landing
page and the app.

## Architecture

```
Browser (no build step — React + Babel from CDN)
  │
  ├── seed data ............ myci-data.jsx  (renders instantly, works offline)
  │
  └── DataService.api ...... fetch() → /api/*   (folds in real, live data)
                                   │
                                   ├── api/posts.js      GET list + POST create
                                   ├── api/neighbors.js  GET roster (paginated)
                                   ├── api/health.js     store status
                                   │
                                   └── api/_store.js → Redis (Vercel KV / Upstash)
                                                       or in-memory fallback
```

**Offline-first by design.** Every screen renders from the bundled seed the
instant it loads — no spinner, no network required. The API then *enhances*:
the feed folds in real posts neighbors have created, and Compose persists new
ones. If the backend is unreachable, the app silently keeps the seed. This is
challenge prompt #8 — *works offline-first, gets better the more it's shared.*

**One seam to go live.** Screens never touch raw arrays; they go through
`DataService`. The list methods return `{ items, total, hasMore }`, so
pagination/infinite-scroll is already a drop-in at the API layer — proven by
`GET /api/posts?page=&perPage=`.

## API

```
GET  /api/health                                  → { ok, store, livePosts }
GET  /api/neighbors?page=&perPage=                → { items, total, hasMore }
GET  /api/posts?type=&q=&page=&perPage=           → { items, total, hasMore }
POST /api/posts   { type, title, body, tags? }    → { item }    (201)
```

`POST /api/posts` is validated and normalized in [`api/_util.js`](./api/_util.js):

- `type` must be one of the known kinds; `title` 3–120 chars; `body` ≤ 600.
- Tags are lowercased and stripped to `[a-z0-9-]`, max 6.
- `< >` are stripped at the boundary (defense in depth; React already escapes).
- Payloads over 8 KB are rejected (`413`).
- **Client identity is not trusted** — `authorId` is forced server-side. In a
  real build this comes from the session, not the request body.
- Defensive headers on every response: `X-Content-Type-Options`,
  `X-Frame-Options`, `Referrer-Policy`. GETs are edge-cached briefly
  (`s-maxage=10, stale-while-revalidate=30`).

## Storage & scale

`api/_store.js` speaks to **serverless Redis over its REST API** (Vercel KV or
Upstash) when credentials are present, and falls back to an in-memory array
otherwise:

- **Redis mode** — durable, shared across all serverless instances, list
  capped at 5 000 and `LTRIM`med on write. Comfortably holds a neighborhood of
  10 000. This is the production path.
- **Memory mode** — zero-config. Survives only within one warm instance, so a
  post created in one request may not appear in the next. Fine for `vercel dev`
  and local demos; **not** for production. `GET /api/health` reports which mode
  is active.

No npm dependencies — the store calls the REST endpoint with the global
`fetch()` in Vercel's Node runtime.

### Enabling durable storage

1. In the Vercel dashboard → **Storage** → create a KV / Upstash Redis store and
   connect it to this project. Vercel injects the env vars automatically.
2. Or set them yourself (either naming scheme is accepted):

   ```
   KV_REST_API_URL=...            UPSTASH_REDIS_REST_URL=...
   KV_REST_API_TOKEN=...          UPSTASH_REDIS_REST_TOKEN=...
   ```

3. Redeploy. `GET /api/health` should now report `"store": "redis"`.

## Local development

```
npm i -g vercel      # one-time
vercel dev           # serves the static site + /api functions on localhost
```

Without a KV store connected, `vercel dev` runs in memory mode (single process,
so created posts persist for the life of that process). To exercise the durable
path locally, pull the env vars with `vercel env pull`.

## How it maps to the judging criteria

- **Scalable + secure** — pagination from day one, a durable Redis backend, a
  bounded write path, input validation, untrusted-client identity, and security
  headers. `/api/health` makes the infrastructure legible.
- **Universal** — neighborhood, categories, and copy are data, not hard-coded
  geography; the landing page is plain HTML that renders anywhere, on anything.
- **User-friendly** — three taps to join, big type, plain words; the app works
  before the network does.
- **Equitable** — no ads, no data resale, no money loop. Location is fuzzed to
  ±500 m and never stored precisely. You're the neighbor, never the product.
