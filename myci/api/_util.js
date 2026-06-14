// api/_util.js — response helpers, security headers, and post validation.

// Post types accepted by the API (mirrors POST_TYPES in myci-data.jsx).
const TYPE_LABELS = {
  offer:       "Offer",
  request:     "Request",
  skill_share: "Skill Share",
  barter:      "Barter",
  event:       "Event",
  mutual_aid:  "Mutual Aid",
};
const DEFAULT_ICON = {
  offer: "gift", request: "hand-palm", skill_share: "student",
  barter: "arrows-left-right", event: "calendar", mutual_aid: "heart",
};

function security(res) {
  // Defensive headers — small, but they signal "infrastructure thought through".
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Frame-Options", "DENY");
}

function send(res, status, body) {
  security(res);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  // Live data is public-read and same-origin; cache GETs briefly at the edge.
  if (status === 200) res.setHeader("Cache-Control", "public, max-age=0, s-maxage=10, stale-while-revalidate=30");
  res.status(status).send(JSON.stringify(body));
}

// Strip anything that could be interpreted as markup; React renders as text,
// but we sanitize at the boundary too (defense in depth).
function clean(str, max) {
  return String(str == null ? "" : str)
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, max);
}

function paginate(arr, page, perPage) {
  const start = page * perPage;
  const items = arr.slice(start, start + perPage);
  return { items, total: arr.length, hasMore: start + perPage < arr.length };
}

// Validate + normalize an incoming post. Returns { post } or { error }.
// We deliberately do NOT trust client-supplied identity: authorId is forced to
// Identity comes from the authenticated session (passed in as `author`), never
// from the client body — so a caller can't forge who posted.
function initialsOf(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "··";
  return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
}

function normalizePost(input, author) {
  if (!input || typeof input !== "object") return { error: "Body must be JSON." };

  const type = String(input.type || "");
  if (!TYPE_LABELS[type]) return { error: "Unknown post type." };

  const title = clean(input.title, 120);
  if (title.length < 3) return { error: "Title is too short." };

  const body = clean(input.body, 600);

  let tags = Array.isArray(input.tags) ? input.tags : [];
  tags = tags
    .map((t) => clean(t, 24).toLowerCase().replace(/[^a-z0-9-]/g, ""))
    .filter(Boolean)
    .slice(0, 6);

  const post = {
    type,
    typeLabel: TYPE_LABELS[type],
    category: clean(input.category, 40) || "Neighborly",
    icon: clean(input.icon, 40) || DEFAULT_ICON[type] || "gift",
    title,
    body,
    tags,
    // Identity is server-derived. Live posts carry self-contained author display
    // fields so the UI can render them without the static NEIGHBOR roster.
    authorId: (author && author.id) || "you",
    authorName: (author && author.name) || "You",
    authorInitials: initialsOf(author && author.name) || "ME",
    accept: clean(input.accept, 80) || "Nothing — a gift",
    visibility: clean(input.visibility, 40) || "My neighborhood",
    distance: "nearby",
    when: "just now",
    createdAt: new Date().toISOString(),
    live: true,
  };
  return { post };
}

module.exports = { send, paginate, normalizePost, security, TYPE_LABELS };
