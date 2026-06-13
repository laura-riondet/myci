// myci-screens-feed.jsx — The Commons: Feed tab (with filter menu)
//
// DATA FLOW
// Uses DataService.getPosts() so the filter/pagination logic is in one place.
// When you switch to a real API, DataService.getPosts becomes an async call
// and this component adds a loading state — no structural change needed here.

const { useState, useEffect, useCallback, useMemo } = React;

const FEED_TABS = [
  { id: "all",      label: "All",        match: () => true },
  { id: "offers",   label: "Offers",     match: (p) => ["offer", "skill_share", "barter"].includes(p.type) },
  { id: "requests", label: "Requests",   match: (p) => p.type === "request" },
  { id: "events",   label: "Events",     match: (p) => p.type === "event" },
  { id: "aid",      label: "Mutual Aid", match: (p) => p.type === "mutual_aid" },
];

const FILTER_TAGS = [
  { label: "Surplus",    kw: "surplus"  },
  { label: "Skill Share",kw: "skill"    },
  { label: "Tools",      kw: "tool"     },
  { label: "Food",       kw: "food"     },
  { label: "Gardening",  kw: "garden"   },
  { label: "Crafts",     kw: "craft"    },
  { label: "Barter",     kw: "barter"   },
  { label: "Events",     kw: "event"    },
  { label: "Mutual Aid", kw: "mutual"   },
  { label: "Free",       kw: "free"     },
  { label: "Repair",     kw: "repair"   },
];

function FeedScreen({ t, onOpen, onOpenNotifications, onSheet }) {
  const [tab, setTab]           = useState("all");
  const [radius, setRadius]     = useState(3);
  const [tags, setTags]         = useState([]);
  const [query, setQuery]       = useState("");
  const [filterOpen, setFilter] = useState(false);

  const openSheet  = useCallback(() => { setFilter(true);  onSheet && onSheet(true);  }, [onSheet]);
  const closeSheet = useCallback(() => { setFilter(false); onSheet && onSheet(false); }, [onSheet]);
  useEffect(() => () => { onSheet && onSheet(false); }, [onSheet]);

  const activeTab = useMemo(() => FEED_TABS.find((x) => x.id === tab) || FEED_TABS[0], [tab]);

  // DataService returns { items, total, hasMore } — ready for infinite scroll later
  const { items: list } = useMemo(
    () => DataService.getPosts({ tabMatch: activeTab.match, tags, radius, query }),
    [activeTab, tags, radius, query],
  );

  const activeCount = tags.length + (radius < 3 ? 1 : 0) + (query.trim() ? 1 : 0);

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: "#EADFCB" }}>
      {/* ── Header ── */}
      <div style={{ background: "#472C1C", padding: "54px 18px 14px", position: "relative", flexShrink: 0, zIndex: 5 }}>
        <Grain opacity={0.08} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
          <div>
            <div style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 10.5, letterSpacing: ".2em", color: "#D6AD08", textTransform: "uppercase" }}>
              The Commons
            </div>
            <h1 style={{ fontFamily: "var(--display)", fontSize: 24, color: "#FEF4D6", margin: "3px 0 0", letterSpacing: ".01em" }}>
              {NEIGHBORHOOD}
            </h1>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onOpenNotifications} style={iconBtnStyle}>
              <Icon name="bell" size={17} style={{ color: "#FEF4D6" }} />
              <span style={{ position: "absolute", top: 7, right: 8, width: 8, height: 8, borderRadius: "50%", background: "#D6AD08", border: "1.5px solid #472C1C" }} />
            </button>
            <button onClick={openSheet} style={{ ...iconBtnStyle, width: "auto", padding: "0 12px", gap: 6, display: "flex", alignItems: "center", color: "#E8DCC8", fontFamily: "'Cutive', serif", fontSize: 13 }}>
              <Icon name="sliders-horizontal" size={16} style={{ color: "#D6AD08" }} /> Filters
              {activeCount > 0 && (
                <span style={{ background: "#D6AD08", color: "#3A2410", fontFamily: "'Cutive Mono', monospace", fontSize: 10, fontWeight: 700, borderRadius: 9, padding: "1px 6px" }}>
                  {activeCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Segmented tabs */}
        <div style={{ display: "flex", gap: 6, marginTop: 16, position: "relative", overflowX: "auto", paddingBottom: 2 }} className="no-scrollbar">
          {FEED_TABS.map((x) => {
            const on = x.id === tab;
            return (
              <button key={x.id} onClick={() => setTab(x.id)} style={{
                fontFamily: "'Cutive', serif", fontSize: 13.5, cursor: "pointer", whiteSpace: "nowrap",
                padding: "8px 14px", borderRadius: 10, flexShrink: 0,
                background: on ? "var(--accent)" : "#FEF4D60f",
                color: on ? "#3A2410" : "#cbb085",
                border: on ? "none" : "1px solid #ffffff14",
                boxShadow: on ? "0 2px 5px rgba(0,0,0,.3)" : "none",
                transition: "all .12s",
              }}>{x.label}</button>
            );
          })}
        </div>
      </div>

      {/* ── Active-filter summary strip ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", background: "#E0D2B8", borderBottom: "1px solid #472c1c1a", flexShrink: 0, overflowX: "auto" }} className="no-scrollbar">
        <span style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 11, color: "#7a5a38", whiteSpace: "nowrap" }}>
          {list.length} posts
        </span>
        {activeCount === 0 ? (
          <span style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 11, color: "#a98f68", whiteSpace: "nowrap" }}>
            · all categories, within reach
          </span>
        ) : (
          <div style={{ display: "flex", gap: 6 }}>
            {radius < 3 && <SummaryPill onClear={() => setRadius(3)}>within {radius} mi</SummaryPill>}
            {query.trim() && <SummaryPill onClear={() => setQuery("")}>"{query}"</SummaryPill>}
            {tags.map((kw) => {
              const tg = FILTER_TAGS.find((f) => f.kw === kw);
              return (
                <SummaryPill key={kw} onClear={() => setTags(tags.filter((x) => x !== kw))}>
                  {tg ? tg.label : kw}
                </SummaryPill>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Feed list ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 16px 110px", position: "relative" }}>
        <Grain opacity={0.04} />
        <div style={{ display: "flex", flexDirection: "column", gap: 22, position: "relative" }}>
          {list.length ? (
            list.map((p, i) => (
              <div key={p.id} className="rise" style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}>
                <PostCard post={p} index={i} onOpen={onOpen} cardStyle={t.postCard} stickerStyle={t.sticker} />
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "50px 20px", fontFamily: "'Cutive', serif", color: "#8a6f4a" }}>
              <Icon name="leaf" size={34} style={{ color: "#b9a273", opacity: 0.6 }} />
              <p style={{ fontSize: 15, marginTop: 12 }}>Nothing matches those filters yet.</p>
              <button
                onClick={() => { setTags([]); setRadius(3); setQuery(""); }}
                style={{ marginTop: 4, background: "none", border: "none", color: "#B27500", fontFamily: "'Cutive', serif", fontSize: 14, cursor: "pointer", textDecoration: "underline" }}
              >Clear filters</button>
            </div>
          )}
        </div>
        {list.length > 0 && (
          <div style={{ textAlign: "center", marginTop: 26, fontFamily: "'Cutive Mono', monospace", fontSize: 10.5, color: "#9a7a52" }}>
            · you've reached the edge of {NEIGHBORHOOD} ·
          </div>
        )}
      </div>

      {/* ── Filter sheet ── */}
      {filterOpen && (
        <FilterSheet
          tags={tags} setTags={setTags}
          radius={radius} setRadius={setRadius}
          query={query} setQuery={setQuery}
          count={list.length}
          onClose={closeSheet}
          onClear={() => { setTags([]); setRadius(3); setQuery(""); }}
        />
      )}
    </div>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const iconBtnStyle = {
  position: "relative", background: "#FEF4D612", border: "1px solid #ffffff20",
  borderRadius: 10, height: 38, width: 38, cursor: "pointer", display: "grid", placeItems: "center",
};

// ── Sub-components ────────────────────────────────────────────────────────────

function SummaryPill({ children, onClear }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#D6AD0826", border: "1px solid #b2750040", color: "#7a5a38", fontFamily: "'Cutive Mono', monospace", fontSize: 10.5, padding: "3px 6px 3px 9px", borderRadius: 14, whiteSpace: "nowrap" }}>
      {children}
      <button onClick={onClear} style={{ background: "none", border: "none", cursor: "pointer", display: "grid", placeItems: "center", padding: 0 }}>
        <Icon name="x" weight="bold" size={9} style={{ color: "#9a7a52" }} />
      </button>
    </span>
  );
}

function FilterSheet({ tags, setTags, radius, setRadius, query, setQuery, count, onClose, onClear }) {
  const toggle = (kw) => setTags(tags.includes(kw) ? tags.filter((x) => x !== kw) : [...tags, kw]);
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 40 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "#1c0f06aa", animation: "fadeIn .2s ease" }} />
      <div className="sheet-up" style={{
        position: "absolute", left: 0, right: 0, bottom: 0, maxHeight: "82%", overflowY: "auto",
        background: "linear-gradient(180deg,#F3E8CF,#EADFCB)", borderRadius: "22px 22px 0 0",
        boxShadow: "0 -10px 30px rgba(0,0,0,.4)", padding: "10px 20px 26px",
      }}>
        <div style={{ width: 40, height: 5, borderRadius: 3, background: "#472c1c2a", margin: "0 auto 14px" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontFamily: "'Trocchi', serif", fontWeight: 400, fontSize: 21, color: "#2A1A0E", margin: 0 }}>Filter the Commons</h2>
          <button onClick={onClose} style={{ background: "#472c1c14", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", display: "grid", placeItems: "center" }}>
            <Icon name="x" weight="bold" size={13} style={{ color: "#6a5238" }} />
          </button>
        </div>

        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 16, background: "#FBF4E2", border: "1px solid #472c1c22", borderRadius: 12, padding: "11px 13px" }}>
          <Icon name="magnifying-glass" size={16} style={{ color: "#9a7a52" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts…"
            style={{ flex: 1, border: "none", background: "none", outline: "none", fontFamily: "'Trocchi', serif", fontSize: 15, color: "#2A1A0E" }}
          />
        </div>

        {/* Category chips */}
        <div style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#8a6f4a", margin: "20px 0 10px" }}>Categories</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {FILTER_TAGS.map((f) => {
            const on = tags.includes(f.kw);
            return (
              <button key={f.kw} onClick={() => toggle(f.kw)} style={{
                fontFamily: "'Cutive', serif", fontSize: 13.5, cursor: "pointer", padding: "8px 14px", borderRadius: 20,
                background: on ? "var(--accent)" : "#fff6", color: on ? "#3A2410" : "#5a4329",
                border: on ? "none" : "1px solid #472c1c22",
                boxShadow: on ? "0 2px 5px rgba(30,16,6,.25)" : "none", transition: "all .12s",
              }}>{on ? "✓ " : ""}{f.label}</button>
            );
          })}
        </div>

        {/* Distance — tucked inside the filter sheet */}
        <div style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#8a6f4a", margin: "22px 0 10px" }}>Distance</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Icon name="map-pin" size={16} style={{ color: "#B27500" }} />
          <input type="range" min="0.3" max="3" step="0.1" value={radius} onChange={(e) => setRadius(+e.target.value)} style={{ flex: 1, accentColor: "#B27500" }} />
          <span style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 12, color: "#5a4329", whiteSpace: "nowrap", minWidth: 56, textAlign: "right" }}>
            {radius >= 3 ? "any" : `${radius} mi`}
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 26 }}>
          <Btn kind="ghost" onClick={onClear} style={{ flex: 1 }}>Clear all</Btn>
          <Btn onClick={onClose} style={{ flex: 2 }}>Show {count} {count === 1 ? "post" : "posts"}</Btn>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { FeedScreen, FEED_TABS });
