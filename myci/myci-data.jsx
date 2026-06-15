// myci-data.jsx — neighborhood data + DataService
//
// ARCHITECTURE NOTE — scale to 10k
// ─────────────────────────────────
// All data access flows through DataService (below the raw arrays).
// When you're ready to go live, replace each DataService method body
// with an async fetch() call to your REST API — the screens never
// touch the arrays directly, so nothing else needs to change.
//
// Current limits (mock, no server):
//   NEIGHBORS  ~20   → API: GET /neighbors?lat=&lng=&radius=
//   POSTS      ~10   → API: GET /posts?{filters}&page=&perPage=
//   EXCHANGES  ~30   → API: GET /exchanges?userId=
//
// For 10k posts, the feed already paginates (DataService.getPosts returns
// a {items, total, hasMore} envelope). The FeedScreen consumes that shape
// so pagination / infinite-scroll is a drop-in at the API layer.

// ── Neighborhood ────────────────────────────────────────────────────────────

const NEIGHBORHOOD = "Fernwood";

// Map positions are percentages within the map field (0–100).
const NEIGHBORS = [
  { id: "you",     name: "Me",         first: "Me",      initials: "ME", tone: "#D6AD08", x: 50, y: 53, you: true,  here: "8 months", gave: 14, asked: 4 },
  { id: "sarah",   name: "Sarah K.",   first: "Sarah",   initials: "SK", tone: "#B27500", x: 33, y: 29, here: "2 years",   gave: 31, asked: 9 },
  { id: "devon",   name: "Devon M.",   first: "Devon",   initials: "DM", tone: "#8CA679", x: 69, y: 24, here: "5 months",  gave: 6,  asked: 11 },
  { id: "tomas",   name: "Tomás R.",   first: "Tomás",   initials: "TR", tone: "#8CA679", x: 21, y: 63, here: "4 years",   gave: 48, asked: 7 },
  { id: "priya",   name: "Priya N.",   first: "Priya",   initials: "PN", tone: "#D6AD08", x: 73, y: 61, here: "1 year",    gave: 22, asked: 13 },
  { id: "eleanor", name: "Eleanor W.", first: "Eleanor", initials: "EW", tone: "#B27500", x: 46, y: 79, here: "11 years",  gave: 63, asked: 19 },
  { id: "marcus",  name: "Marcus L.",  first: "Marcus",  initials: "ML", tone: "#8CA679", x: 61, y: 43, here: "3 years",   gave: 40, asked: 5 },
  { id: "aisha",   name: "Aisha B.",   first: "Aisha",   initials: "AB", tone: "#D6AD08", x: 39, y: 45, here: "1 year",    gave: 18, asked: 8 },
  { id: "theo",    name: "Theo G.",    first: "Theo",    initials: "TG", tone: "#B27500", x: 83, y: 39, here: "6 months",  gave: 9,  asked: 6 },
  { id: "joon",    name: "Joon P.",    first: "Joon",    initials: "JP", tone: "#8CA679", x: 28, y: 85, here: "2 years",   gave: 27, asked: 4 },
  { id: "noor",    name: "Noor A.",    first: "Noor",    initials: "NA", tone: "#8CA679", x: 15, y: 34, here: "1 year",    gave: 16, asked: 6 },
  { id: "hassan",  name: "Hassan E.",  first: "Hassan",  initials: "HE", tone: "#B27500", x: 88, y: 73, here: "3 years",   gave: 35, asked: 8 },
  { id: "wendy",   name: "Wendy T.",   first: "Wendy",   initials: "WT", tone: "#D6AD08", x: 56, y: 14, here: "7 months",  gave: 11, asked: 9 },
  { id: "gabriel", name: "Gabriel S.", first: "Gabriel", initials: "GS", tone: "#8CA679", x: 90, y: 20, here: "2 years",   gave: 24, asked: 5 },
  { id: "lena",    name: "Lena V.",    first: "Lena",    initials: "LV", tone: "#D6AD08", x: 11, y: 73, here: "5 years",   gave: 52, asked: 10 },
  { id: "otis",    name: "Otis B.",    first: "Otis",    initials: "OB", tone: "#B27500", x: 71, y: 89, here: "9 months",  gave: 13, asked: 7 },
  { id: "rosa",    name: "Rosa M.",    first: "Rosa",    initials: "RM", tone: "#8CA679", x: 86, y: 52, here: "4 years",   gave: 38, asked: 6 },
  { id: "sam",     name: "Sam D.",     first: "Sam",     initials: "SD", tone: "#D6AD08", x: 41, y: 67, here: "1 year",    gave: 19, asked: 8 },
];

const NEIGHBOR_BY_ID = Object.fromEntries(NEIGHBORS.map((n) => [n.id, n]));

// ── Post types ───────────────────────────────────────────────────────────────

const POST_TYPES = {
  offer:      { label: "Offer",       tone: "#D6AD08", surface: "#D6AD08", ink: "#3A2410" },
  request:    { label: "Request",     tone: "#8CA679", surface: "#8CA679", ink: "#23301a" },
  skill_share:{ label: "Skill Share", tone: "#B27500", surface: "#B27500", ink: "#33210a" },
  barter:     { label: "Barter",      tone: "#C26A2B", surface: "#C26A2B", ink: "#341704" },
  event:      { label: "Event",       tone: "#E8DCC8", surface: "#E8DCC8", ink: "#472C1C" },
  mutual_aid: { label: "Mutual Aid",  tone: "#5A3A24", surface: "#472C1C", ink: "#F4C73B" },
};

// ── Posts ────────────────────────────────────────────────────────────────────
// icon = Phosphor name. accept = what they'd take in return.

const POSTS = [
  {
    id: "p_cherries", authorId: "sarah", type: "offer", typeLabel: "Surplus",
    category: "Food", icon: "cherries", title: "A whole tree's worth of cherries",
    body: "My backyard tree went absolutely wild this year and I cannot eat them fast enough. Bring a bag or a bucket — come pick as many as you like before the birds get them.",
    tags: ["food", "surplus", "free"], distance: "0.2 mi", when: "2h ago",
    accept: "Nothing — it's a gift", visibility: "My block", photo: "cherries on the tree",
  },
  {
    id: "p_couch", authorId: "devon", type: "request", typeLabel: "Request",
    category: "Physical help", icon: "hand-palm", title: "Two hands to move a couch, Saturday",
    body: "Just need one strong neighbor for 30 minutes to help carry a couch down two flights and into a van. I'll have it wrapped and ready. Cold drinks on me.",
    tags: ["physical-help", "moving"], distance: "0.5 mi", when: "5h ago",
    accept: "I'll owe you one", visibility: "My neighborhood",
  },
  {
    id: "p_wood", authorId: "tomas", type: "skill_share", typeLabel: "Skill Share",
    category: "Skills", icon: "hammer", title: "I'll teach you to build a planter box",
    body: "Been doing woodworking for 20 years. I'll walk you through building a cedar planter from scratch — yours to keep — if you spend an afternoon helping me clear the back garden.",
    tags: ["skills", "woodworking", "gardening"], distance: "0.8 mi", when: "1d ago",
    accept: "An afternoon of garden help", visibility: "My neighborhood",
  },
  {
    id: "p_bbq", authorId: "priya", type: "event", typeLabel: "Event",
    category: "Events", icon: "fire", title: "Fernwood block BBQ — this Saturday, 5pm",
    body: "Grills are out front of #114. Bring a side, a chair, and an appetite. Kids and dogs welcome. Let's actually meet the people we wave at.",
    tags: ["events", "food", "gathering"], distance: "0.3 mi", when: "1d ago",
    accept: "Bring a dish to share", visibility: "My neighborhood", photo: "the block, set up for a BBQ",
  },
  {
    id: "p_garden", authorId: "eleanor", type: "mutual_aid", typeLabel: "Mutual Aid",
    category: "Gardening", icon: "plant", title: "I know gardens. My knees don't.",
    body: "I've grown food on this street for 40 years and I can teach you everything — but I can't bend down anymore. Trade my know-how for an hour of weeding now and then?",
    tags: ["gardening", "mutual-aid", "knowledge"], distance: "0.6 mi", when: "2d ago",
    accept: "An hour of weeding, here and there", visibility: "My block",
  },
  {
    id: "p_tools", authorId: "marcus", type: "offer", typeLabel: "Tool Loan",
    category: "Tools", icon: "wrench", title: "Borrow from my tool wall",
    body: "Drill, circular saw, orbital sander, a good ladder, hand tools. All labeled, all yours to borrow. Just bring it back clean and tell me what you made.",
    tags: ["tools", "lending", "diy"], distance: "0.4 mi", when: "3d ago",
    accept: "Bring it back clean", visibility: "My neighborhood",
  },
  {
    id: "p_art", authorId: "aisha", type: "barter", typeLabel: "Barter",
    category: "Crafts", icon: "paint-brush", title: "Art lessons for a home-cooked meal",
    body: "I teach watercolour and lino printing. I'd love to swap a lesson for a home-cooked meal, a jar of something, or a craft you made yourself. Let's trade what we're good at.",
    tags: ["crafts", "skills", "food"], distance: "0.7 mi", when: "3d ago",
    accept: "Homemade food or a handmade craft", visibility: "My neighborhood",
  },
  {
    id: "p_jam", authorId: "theo", type: "offer", typeLabel: "Surplus",
    category: "Food", icon: "jar", title: "Plum jam — six jars going spare",
    body: "Made way too much plum jam from the tree out back. Six jars looking for a good piece of toast. First come, first served — leave the empty jar on my porch when you're done.",
    tags: ["food", "preserves", "surplus"], distance: "0.9 mi", when: "4d ago",
    accept: "Return the empty jar", visibility: "My neighborhood", photo: "jars of plum jam on a sill",
  },
  {
    id: "p_bike", authorId: "joon", type: "skill_share", typeLabel: "Skill Share",
    category: "Skills", icon: "bicycle", title: "Free bike tune-ups on Sunday mornings",
    body: "I've got a stand and the tools. Roll your bike over Sunday morning and I'll true your wheels, adjust your brakes, and show you how to do it yourself next time.",
    tags: ["skills", "bikes", "repair"], distance: "1.1 mi", when: "5d ago",
    accept: "Nothing — pass it on", visibility: "My neighborhood",
  },
];

const POST_BY_ID = Object.fromEntries(POSTS.map((p) => [p.id, p]));

// ── Exchanges (mycelium threads) ─────────────────────────────────────────────
// dir is from `a`'s perspective: "gave" | "received" | "traded"

function ex(a, b, weeks, note, dir) { return { a, b, weeks, note, dir }; }

const SEED_EXCHANGES = [
  ex("sarah", "aisha",   6, "Cherries for a watercolour lesson",        "traded"),
  ex("aisha", "tomas",   5, "A lino print for a mended fence",          "traded"),
  ex("marcus", "devon",  4, "Lent the ladder",                          "gave"),
  ex("priya", "theo",    8, "BBQ help for a jar of jam",                 "traded"),
  ex("eleanor", "tomas", 3, "Garden wisdom for an afternoon weeding",   "traded"),
  ex("marcus", "you",    2, "Lent the circular saw",                    "gave"),
  ex("sarah", "you",     7, "A bag of cherries",                        "gave"),
  ex("joon", "eleanor",  5, "Bike tune-up for tomato seedlings",        "traded"),
  ex("priya", "marcus",  6, "A side dish for a borrowed drill",         "traded"),
  ex("joon", "tomas",    9, "Trued a wheel for scrap cedar",            "traded"),
  ex("noor", "sarah",    3, "Shared a sourdough starter",               "gave"),
  ex("noor", "aisha",    7, "A knitting lesson",                        "gave"),
  ex("hassan", "priya",  2, "Fixed a leaky tap",                        "gave"),
  ex("hassan", "rosa",   5, "Carpooled to the market",                  "traded"),
  ex("wendy", "devon",   4, "Helped paint a room",                      "gave"),
  ex("wendy", "sarah",   8, "Swapped tomato seedlings",                 "traded"),
  ex("gabriel", "theo",  3, "Shared a plum-jam recipe",                 "gave"),
  ex("gabriel", "devon", 6, "Jump-started a car",                       "gave"),
  ex("lena", "tomas",    4, "A pottery lesson for a planter box",       "traded"),
  ex("lena", "joon",     7, "Mended a jacket",                          "gave"),
  ex("otis", "eleanor",  2, "Mowed the verge",                          "gave"),
  ex("otis", "joon",     5, "Shared fishing gear",                      "gave"),
  ex("rosa", "marcus",   3, "Borrowed the sander",                      "received"),
  ex("rosa", "priya",    6, "Babysat on a Friday",                      "gave"),
  ex("sam", "aisha",     4, "A guitar lesson for an art lesson",        "traded"),
  ex("sam", "you",       5, "Shared garden tools",                      "gave"),
  ex("you", "theo",      3, "Dropped off sourdough",                    "gave"),
  ex("you", "aisha",     6, "Swapped jam for a print",                  "traded"),
];

// ── Messages & notifications ─────────────────────────────────────────────────

const MESSAGES = [
  {
    id: "m_sarah", postId: "p_cherries", withId: "sarah", unread: false,
    last: "Come by anytime before Sunday!",
    thread: [
      { from: "you",   body: "Hi Sarah! I'd love some cherries — when's good to swing by?", when: "Tue 9:14am" },
      { from: "sarah", body: "Anytime this week! Tree's right by the side gate, just let yourself in.", when: "Tue 9:31am" },
      { from: "you",   body: "Amazing. I'll bring a bucket and drop off some sourdough in return.", when: "Tue 9:33am" },
      { from: "sarah", body: "You really don't have to — but I won't say no to sourdough. Come by anytime before Sunday!", when: "Tue 9:40am" },
    ],
  },
  {
    id: "m_marcus", postId: "p_tools", withId: "marcus", unread: true,
    last: "It's on the hook by the door, grab it whenever.",
    thread: [
      { from: "you",    body: "Could I borrow the circular saw this weekend? Building a planter with Tomás.", when: "Mon 6:02pm" },
      { from: "marcus", body: "Of course. It's on the hook by the door, grab it whenever.", when: "Mon 6:20pm" },
    ],
  },
  {
    id: "m_tomas", postId: "p_wood", withId: "tomas", unread: false,
    last: "Saturday afternoon works for me.",
    thread: [
      { from: "you",   body: "I'd love to learn the planter build — and I'm happy to help clear the garden.", when: "Sun 11:00am" },
      { from: "tomas", body: "Perfect trade. Saturday afternoon works for me.", when: "Sun 12:15pm" },
    ],
  },
];

const NOTIFICATIONS = [
  { id: "n1", kind: "response", whoId: "marcus", text: "Marcus replied about the circular saw",                       when: "10m ago", unread: true,  postId: "p_tools" },
  { id: "n2", kind: "match",    whoId: "sarah",  text: "A new Surplus offer near you: cherries",                     when: "2h ago",  unread: true,  postId: "p_cherries" },
  { id: "n3", kind: "help",     whoId: "devon",  text: "Devon nearby could use a hand moving a couch",               when: "5h ago",  unread: false, postId: "p_couch" },
  { id: "n4", kind: "thread",   whoId: "tomas",  text: "You and Tomás completed an exchange — a new thread grew on the map", when: "1d ago", unread: false },
  { id: "n5", kind: "event",    whoId: "priya",  text: "Fernwood block BBQ is this Saturday at 5pm",                 when: "1d ago",  unread: false, postId: "p_bbq" },
];

// ── DataService ──────────────────────────────────────────────────────────────
//
// The single interface screens use to access data.
// Swap implementations for fetch() calls when you go live — no screen code changes.
//
// All list methods return: { items: T[], total: number, hasMore: boolean }
// so pagination is a drop-in at the API layer (pass page/perPage from the screen).

const DataService = {
  // Helpers
  _paginate(arr, page = 0, perPage = 50) {
    const start = page * perPage;
    const items = arr.slice(start, start + perPage);
    return { items, total: arr.length, hasMore: start + perPage < arr.length };
  },

  // Neighbors
  getNeighbors()        { return NEIGHBORS; },
  getNeighborById(id)   { return NEIGHBOR_BY_ID[id] || null; },

  // Pure filter over any post array (seed + live). Kept separate so the live
  // layer (DataService.api.listPosts) can be merged in and filtered identically.
  filterPosts(source, { tabMatch, tags, radius, query } = {}) {
    const q = (query || "").trim().toLowerCase();
    const blob = (p) =>
      ((p.tags || []).join(" ") + " " + p.typeLabel + " " + p.category + " " + p.type + " " + p.title).toLowerCase();
    const dist = (p) => parseFloat(p.distance) || 0;

    // de-dupe by id (live posts win over any seed collision)
    const seen = new Set();
    let results = source.filter((p) => (seen.has(p.id) ? false : seen.add(p.id)));

    if (tabMatch)     results = results.filter(tabMatch);
    if (tags?.length) results = results.filter((p) => tags.some((kw) => blob(p).includes(kw)));
    if (radius != null && radius < 3) results = results.filter((p) => dist(p) <= radius);
    if (q)            results = results.filter((p) => blob(p).includes(q) || (p.body || "").toLowerCase().includes(q));

    return results;
  },

  // Posts — filterable; perPage defaults to 50 (covers mock set; raise at API layer)
  getPosts({ page = 0, perPage = 50, ...opts } = {}) {
    return this._paginate(this.filterPosts(POSTS, opts), page, perPage);
  },
  getPostById(id) { return POST_BY_ID[id] || null; },

  // Exchanges
  getExchanges()  { return SEED_EXCHANGES; },

  // Messages / threads
  getMessages()   { return MESSAGES; },

  // Notifications
  getNotifications() { return NOTIFICATIONS; },

  // ── Live layer (real backend) ──────────────────────────────────────────────
  // Offline-first: screens render the seed instantly, then call these to fold
  // in real posts neighbors have created. Failures are non-fatal — the app just
  // shows the seed. See api/ for the serverless implementation.
  // Promise chains (not async/await) so the in-browser Babel transform never
  // needs a regenerator runtime — these run natively in every modern browser.
  api: {
    base: "/api",

    listPosts({ type, query, page = 0, perPage = 50 } = {}) {
      const qs = new URLSearchParams();
      if (type && type !== "all") qs.set("type", type);
      if (query) qs.set("q", query);
      qs.set("page", page); qs.set("perPage", perPage);
      return fetch(`${this.base}/posts?${qs}`).then((r) => {
        if (!r.ok) throw new Error(`posts ${r.status}`);
        return r.json(); // { items, total, hasMore }
      });
    },

    createPost(payload) {
      return fetch(`${this.base}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then((r) =>
        r.json().catch(() => ({})).then((data) => {
          if (!r.ok) throw new Error(data.error || `create ${r.status}`);
          return data.item;
        })
      );
    },

    health() {
      return fetch(`${this.base}/health`).then((r) => {
        if (!r.ok) throw new Error(`health ${r.status}`);
        return r.json();
      });
    },
  },

  // ── Auth (passwordless magic-link) ─────────────────────────────────────────
  // Identity is server-side: the session cookie is httpOnly, so the browser
  // never holds a token it could leak. credentials:"same-origin" sends the
  // cookie with each call. See api/auth/* for the implementation.
  auth: {
    base: "/api/auth",

    // Ask the server to email a sign-in link. In dev (no email provider) the
    // response carries devLink so the flow is testable without a mailbox.
    requestLink(email) {
      return fetch(`${this.base}/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }).then((r) =>
        r.json().catch(() => ({})).then((data) => {
          if (!r.ok) throw new Error(data.error || `request ${r.status}`);
          return data; // { ok, devLink? }
        })
      );
    },

    // Who am I? Resolves to a user object or null. Never throws.
    me() {
      return fetch(`${this.base}/me`, { credentials: "same-origin" })
        .then((r) => r.json())
        .then((d) => d.user || null)
        .catch(() => null);
    },

    logout() {
      return fetch(`${this.base}/logout`, { method: "POST", credentials: "same-origin" })
        .then(() => true).catch(() => false);
    },
  },

  // ── Account (data sovereignty: take it or erase it) ────────────────────────
  account: {
    base: "/api/account",

    // Returns the full JSON the server holds about you — for the Settings export.
    exportData() {
      return fetch(`${this.base}/export`, { credentials: "same-origin" })
        .then((r) => {
          if (!r.ok) throw new Error(`export ${r.status}`);
          return r.json();
        });
    },

    // Erase the account and all its posts. Irreversible.
    deleteAccount() {
      return fetch(`${this.base}/delete`, { method: "POST", credentials: "same-origin" })
        .then((r) => {
          if (!r.ok) throw new Error(`delete ${r.status}`);
          return r.json();
        });
    },
  },
};

// Resolve a person for display: a static neighbor, the signed-in user, or a
// self-contained author carried on a live post. Keeps the UI working whether a
// post came from the seed roster or a real signed-in neighbor.
function personFor(post, me) {
  if (!post) return null;
  const seed = NEIGHBOR_BY_ID[post.authorId];
  if (seed) return seed;
  if (me && post.authorId === me.id) {
    return { id: me.id, name: me.name, first: (me.name || "You").split(" ")[0], initials: initialsOf(me.name), tone: "#D6AD08", you: true };
  }
  if (post.authorName) {
    return { id: post.authorId, name: post.authorName, first: post.authorName.split(" ")[0], initials: post.authorInitials || initialsOf(post.authorName), tone: "#8CA679" };
  }
  return NEIGHBOR_BY_ID.you;
}

function initialsOf(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "··";
  return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
}

// ── Countries (ISO 3166-1 alpha-2) ───────────────────────────────────────────
// We keep only the 2-letter codes and let Intl.DisplayNames render the names in
// the user's chosen language — so the picker localizes for free (universality).
// The code is also exactly what Nominatim wants for `countrycodes=` scoping,
// which is what makes a bare postcode search actually resolve.
const COUNTRY_CODES = [
  "AF","AX","AL","DZ","AS","AD","AO","AI","AG","AR","AM","AW","AU","AT","AZ","BS","BH","BD","BB",
  "BY","BE","BZ","BJ","BM","BT","BO","BA","BW","BR","BN","BG","BF","BI","KH","CM","CA","CV","KY",
  "CF","TD","CL","CN","CO","KM","CG","CD","CR","CI","HR","CU","CW","CY","CZ","DK","DJ","DM","DO",
  "EC","EG","SV","GQ","ER","EE","SZ","ET","FJ","FI","FR","GF","PF","GA","GM","GE","DE","GH","GI",
  "GR","GL","GD","GP","GU","GT","GG","GN","GW","GY","HT","HN","HK","HU","IS","IN","ID","IR","IQ",
  "IE","IM","IL","IT","JM","JP","JE","JO","KZ","KE","KI","KP","KR","KW","KG","LA","LV","LB","LS",
  "LR","LY","LI","LT","LU","MO","MG","MW","MY","MV","ML","MT","MH","MQ","MR","MU","YT","MX","FM",
  "MD","MC","MN","ME","MS","MA","MZ","MM","NA","NR","NP","NL","NC","NZ","NI","NE","NG","MK","NO",
  "OM","PK","PW","PS","PA","PG","PY","PE","PH","PL","PT","PR","QA","RE","RO","RU","RW","WS","SM",
  "ST","SA","SN","RS","SC","SL","SG","SX","SK","SI","SB","SO","ZA","SS","ES","LK","SD","SR","SE",
  "CH","SY","TW","TJ","TZ","TH","TL","TG","TO","TT","TN","TR","TM","TC","TV","UG","UA","AE","GB",
  "US","UY","UZ","VU","VA","VE","VN","VG","VI","YE","ZM","ZW",
];

// [{ code, name }] sorted by localized name. Falls back to the raw code if the
// browser lacks Intl.DisplayNames or can't name a region.
function countryList(locale) {
  let dn = null;
  try { dn = new Intl.DisplayNames([locale || "en"], { type: "region" }); } catch (e) { dn = null; }
  return COUNTRY_CODES
    .map((code) => {
      let name = code;
      try { name = (dn && dn.of(code)) || code; } catch (e) { name = code; }
      return { code, name };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

// ── Expose to window (prototype uses global scope via Babel) ─────────────────
Object.assign(window, {
  NEIGHBORHOOD, NEIGHBORS, NEIGHBOR_BY_ID, POST_TYPES,
  POSTS, POST_BY_ID, SEED_EXCHANGES, MESSAGES, NOTIFICATIONS,
  DataService, ex, personFor,
  COUNTRY_CODES, countryList,
});
