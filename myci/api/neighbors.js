// api/neighbors.js — the neighborhood roster (read-only, paginated).
//   GET /api/neighbors?page=&perPage=  → { items, total, hasMore }
//
// Roster is a static seed here; in a live build this becomes a geo query:
//   GET /neighbors?lat=&lng=&radius=   (location fuzzed to ±500m, never precise).

const { send, paginate } = require("./_util");

// Public roster fields only — no contact details, no precise location.
const ROSTER = [
  { id: "you",     name: "Me",         initials: "ME", tone: "#D6AD08", here: "8 months", gave: 14, asked: 4 },
  { id: "sarah",   name: "Sarah K.",   initials: "SK", tone: "#B27500", here: "2 years",  gave: 31, asked: 9 },
  { id: "devon",   name: "Devon M.",   initials: "DM", tone: "#8CA679", here: "5 months", gave: 6,  asked: 11 },
  { id: "tomas",   name: "Tomás R.",   initials: "TR", tone: "#8CA679", here: "4 years",  gave: 48, asked: 7 },
  { id: "priya",   name: "Priya N.",   initials: "PN", tone: "#D6AD08", here: "1 year",   gave: 22, asked: 13 },
  { id: "eleanor", name: "Eleanor W.", initials: "EW", tone: "#B27500", here: "11 years", gave: 63, asked: 19 },
  { id: "marcus",  name: "Marcus L.",  initials: "ML", tone: "#8CA679", here: "3 years",  gave: 40, asked: 5 },
  { id: "aisha",   name: "Aisha B.",   initials: "AB", tone: "#D6AD08", here: "1 year",   gave: 18, asked: 8 },
];

function clampInt(v, def, min, max) {
  const n = parseInt(v, 10);
  if (Number.isNaN(n)) return def;
  return Math.max(min, Math.min(max, n));
}

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return send(res, 405, { error: "Method not allowed." });
  }
  const url = new URL(req.url, "http://localhost");
  const page = clampInt(url.searchParams.get("page"), 0, 0, 10000);
  const perPage = clampInt(url.searchParams.get("perPage"), 50, 1, 100);
  return send(res, 200, paginate(ROSTER, page, perPage));
};
