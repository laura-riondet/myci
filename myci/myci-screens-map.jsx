// myci-screens-map.jsx — The Commons: Map tab. The living mycelium network.

const RESOURCES = [
  { id: "r_seed",   name: "Fernwood Seed Bank",    type: "Seed bank",       icon: "leaf",       x: 38, y: 18 },
  { id: "r_repair", name: "Saturday Repair Café",  type: "Repair café",     icon: "wrench",     x: 64, y: 72 },
  { id: "r_tools",  name: "Tool Library",          type: "Tool library",    icon: "toolbox",    x: 86, y: 53 },
  { id: "r_pantry", name: "Little Free Pantry",    type: "Free pantry",     icon: "basket",     x: 16, y: 47 },
  { id: "r_garden", name: "Community Garden",       type: "Community garden", icon: "plant",      x: 58, y: 90 },
];

// thread visual style by age (weeks): newer = bright amber, older = faded sage
function threadStyle(age) {
  if (age <= 1) return { stroke: "#F2C94C", opacity: 0.95, width: 0.9 };
  if (age <= 4) return { stroke: "#D6AD08", opacity: 0.7, width: 0.65 };
  if (age <= 7) return { stroke: "#B6A24E", opacity: 0.5, width: 0.5 };
  return { stroke: "#8CA679", opacity: 0.4, width: 0.45 };
}

// Stylized neighborhood map drawn beneath the threads: parks, roads, blocks, a pond.
function NeighborhoodBase() {
  const roads = [
    "M -3 37 L 103 37", "M -3 70 L 103 70",      // avenues
    "M 47 -3 L 47 103", "M 78 -3 L 78 103",      // streets
    "M -3 96 L 35 66 L 78 70",                    // old mill rd (diagonal)
    "M 47 37 L 70 17 L 103 13",                   // ridge road
  ];
  const blocks = [
    [4, 42, 39, 24], [52, 42, 22, 24], [82, 42, 18, 24],
    [4, 74, 39, 22], [52, 74, 22, 22], [4, 8, 39, 22],
  ];
  return (
    <React.Fragment>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {/* building blocks */}
        {blocks.map((b, i) => (
          <rect key={"b" + i} x={b[0]} y={b[1]} width={b[2]} height={b[3]} rx="3"
            fill="#5b4329" opacity={0.28} />
        ))}
        {/* parks */}
        <rect x="3" y="5" width="24" height="23" rx="5" fill="#6f7d4f" opacity={0.5} />
        <rect x="60" y="74" width="31" height="23" rx="6" fill="#6f7d4f" opacity={0.5} />
        {/* pond */}
        <ellipse cx="16" cy="53" rx="8.5" ry="5.5" fill="#5f7468" opacity={0.55} />
        <ellipse cx="15" cy="52" rx="5" ry="3" fill="#7b8f81" opacity={0.4} />
        {/* community-garden rows */}
        {[0, 1, 2, 3].map((r) => (
          <line key={"g" + r} x1={64 + r * 2} y1="78" x2={64 + r * 2} y2="93" stroke="#7e6a3a" strokeWidth="1" opacity={0.5} />
        ))}
        {/* road casings then surfaces (constant width via non-scaling stroke) */}
        {roads.map((d, i) => (
          <path key={"rc" + i} d={d} fill="none" stroke="#33240f" strokeWidth="15"
            strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" opacity={0.55} />
        ))}
        {roads.map((d, i) => (
          <path key={"rs" + i} d={d} fill="none" stroke="#7c6038" strokeWidth="10"
            strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" opacity={0.6} />
        ))}
        {roads.slice(0, 4).map((d, i) => (
          <path key={"rd" + i} d={d} fill="none" stroke="#d9c290" strokeWidth="1"
            strokeDasharray="5 6" vectorEffect="non-scaling-stroke" opacity={0.4} />
        ))}
      </svg>
      {/* faint place labels (HTML so they don't stretch) */}
      {[["Linden Park", 14, 16], ["Community Garden", 75, 85], ["The Pond", 16, 60]].map((l) => (
        <div key={l[0]} style={{
          position: "absolute", left: `${l[1]}%`, top: `${l[2]}%`, transform: "translate(-50%,-50%)",
          fontFamily: "'Cutive Mono', monospace", fontSize: 8, letterSpacing: ".06em",
          color: "#e8dcc8", opacity: 0.32, whiteSpace: "nowrap", pointerEvents: "none",
        }}>{l[0]}</div>
      ))}
    </React.Fragment>
  );
}

function MapScreen({ t, exchanges, onOpenProfile, onOpenPost, onOpenNotifications }) {
  const [showPosts, setShowPosts] = useState(true);
  const [showThreads, setShowThreads] = useState(true);
  const [showResources, setShowResources] = useState(true);
  const [sel, setSel] = useState(null); // {kind:'neighbor'|'post'|'resource'|'thread', data}

  const postsWithAuthors = POSTS.map((p) => ({ p, n: NEIGHBOR_BY_ID[p.authorId] }));

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: "#3A2A1E" }}>
      {/* header */}
      <div style={{ background: "#472C1C", padding: "54px 18px 13px", position: "relative", flexShrink: 0, zIndex: 5 }}>
        <Grain opacity={0.08} />
        <div style={{ position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 10.5, letterSpacing: ".2em", color: "#8CA679", textTransform: "uppercase" }}>
              The Commons · Map
            </div>
            <h1 style={{ fontFamily: "var(--display)", fontSize: 22, color: "#FEF4D6", margin: "3px 0 0" }}>
              Beneath {NEIGHBORHOOD}
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={onOpenNotifications} aria-label={t("notif.title")} style={{ position: "relative", background: "#FEF4D612", border: "1px solid #ffffff20", borderRadius: 10, width: 44, height: 44, cursor: "pointer", display: "grid", placeItems: "center" }}>
              <Icon name="bell" size={17} style={{ color: "#FEF4D6" }} />
              <span style={{ position: "absolute", top: 7, right: 8, width: 8, height: 8, borderRadius: "50%", background: "#D6AD08", border: "1.5px solid #472C1C" }} />
            </button>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "var(--display)", fontSize: 26, color: "#D6AD08", lineHeight: 1 }}>{exchanges.length}</div>
              <div style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 9, color: "#b79a6e", letterSpacing: ".1em", textTransform: "uppercase" }}>threads grown</div>
            </div>
          </div>
        </div>
      </div>

      {/* the field */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(130% 100% at 42% 24%, #6b5236 0%, #4f3b24 55%, #3a2a1a 100%)" }} />
        {/* stylized neighborhood map behind the threads */}
        <NeighborhoodBase />
        <Grain opacity={0.11} />

        {/* mycelium threads */}
        {showThreads && (
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
            {exchanges.map((e, i) => {
              const na = NEIGHBOR_BY_ID[e.a], nb = NEIGHBOR_BY_ID[e.b];
              if (!na || !nb) return null;
              const s = threadStyle(e.weeks);
              const id = `${e.a}-${e.b}`;
              const fresh = e.weeks === 0; // a just-completed exchange grows in
              return (
                <path key={id} d={threadPath(na.x, na.y, nb.x, nb.y, i + 3)}
                  fill="none" stroke={s.stroke} strokeOpacity={s.opacity} strokeWidth={s.width}
                  strokeLinecap="round"
                  onClick={() => setSel({ kind: "thread", data: e })}
                  style={fresh
                    ? { cursor: "pointer", strokeDasharray: 140, animation: "growThread 1.4s ease forwards", filter: "drop-shadow(0 0 1.5px #f2c94c)" }
                    : { cursor: "pointer" }} />
              );
            })}
          </svg>
        )}

        {/* community resources */}
        {showResources && RESOURCES.map((r) => (
          <button key={r.id} onClick={() => setSel({ kind: "resource", data: r })}
            aria-label={r.name} style={{ ...nodeWrap(r.x, r.y), zIndex: 2 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 7, background: "#E8DCC8",
              border: "1.5px solid #472C1C", display: "grid", placeItems: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,.4)", transform: "rotate(-4deg)",
            }}>
              <Icon name={r.icon} size={14} style={{ color: "#472C1C" }} />
            </div>
          </button>
        ))}

        {/* post pins */}
        {showPosts && postsWithAuthors.map(({ p, n }) => {
          const ty = POST_TYPES[p.type];
          // offset pin slightly from author node so both are visible
          const ox = n.x + 4.5, oy = n.y - 5.5;
          return (
            <button key={p.id} onClick={() => setSel({ kind: "post", data: p })}
              aria-label={p.title} style={{ ...nodeWrap(ox, oy), zIndex: 3 }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50% 50% 50% 2px",
                background: ty.surface, border: p.type === "event" ? "1.5px solid #472C1C" : "none",
                display: "grid", placeItems: "center", transform: "rotate(45deg)",
                boxShadow: "0 3px 5px rgba(0,0,0,.4)",
              }}>
                <Icon name={p.icon} size={11} style={{ color: ty.ink, transform: "rotate(-45deg)" }} />
              </div>
            </button>
          );
        })}

        {/* neighbor nodes */}
        {NEIGHBORS.map((n) => (
          <button key={n.id} onClick={() => setSel({ kind: "neighbor", data: n })}
            aria-label={n.you ? `${n.name} (you)` : n.name} style={{ ...nodeWrap(n.x, n.y), zIndex: 4 }}>
            <div style={{ position: "relative" }}>
              {n.you && <div style={{ position: "absolute", inset: -6, borderRadius: "50%", border: "2px solid #D6AD08", animation: "youPulse 2.4s ease-in-out infinite" }} />}
              <Avatar person={n} size={n.you ? 36 : 28} ring />
            </div>
          </button>
        ))}

        {/* legend / layer toggles */}
        <div style={{ position: "absolute", left: 12, bottom: 86, display: "flex", flexDirection: "column", gap: 6, zIndex: 6 }}>
          <LayerToggle on={showThreads} onClick={() => setShowThreads((v) => !v)} swatch="#D6AD08" label="Threads" />
          <LayerToggle on={showPosts} onClick={() => setShowPosts((v) => !v)} swatch="#B27500" label="Posts" />
          <LayerToggle on={showResources} onClick={() => setShowResources((v) => !v)} swatch="#E8DCC8" label="Resources" />
        </div>

        {/* live caption */}
        <div style={{ position: "absolute", right: 12, bottom: 86, maxWidth: 144, textAlign: "right", zIndex: 6 }}>
          <p style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 9.5, color: "#cbb085", lineHeight: 1.4, background: "#2a1a0e88", padding: "6px 9px", borderRadius: 8 }}>
            every thread is one completed exchange. the more you give, the more it grows.
          </p>
        </div>

        {/* selection sheet */}
        {sel && <PreviewSheet sel={sel} onClose={() => setSel(null)} onOpenProfile={onOpenProfile} onOpenPost={onOpenPost} />}
      </div>
    </div>
  );
}

function nodeWrap(x, y) {
  return {
    position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)",
    background: "none", border: "none", padding: 0, cursor: "pointer",
  };
}

function LayerToggle({ on, onClick, swatch, label }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 7, cursor: "pointer",
      background: on ? "#2a1a0ecc" : "#2a1a0e66", border: "1px solid #ffffff1a",
      borderRadius: 20, padding: "5px 11px 5px 7px", opacity: on ? 1 : 0.5,
    }}>
      <span style={{ width: 11, height: 11, borderRadius: "50%", background: swatch, border: label === "Resources" ? "1px solid #472C1C" : "none" }} />
      <span style={{ fontFamily: "'Cutive', serif", fontSize: 12, color: "#FEF4D6" }}>{label}</span>
    </button>
  );
}

function PreviewSheet({ sel, onClose, onOpenProfile, onOpenPost }) {
  let body = null;
  if (sel.kind === "neighbor") {
    const n = sel.data;
    const theirs = POSTS.filter((p) => p.authorId === n.id);
    body = (
      <div style={{ display: "flex", gap: 13, alignItems: "center" }}>
        <Avatar person={n} size={50} ring />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Trocchi', serif", fontSize: 18, color: "#2A1A0E" }}>{n.name}{n.you ? " (you)" : ""}</div>
          <div style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 10.5, color: "#9a7a52", marginTop: 2 }}>
            {t("profile.here", { t: n.here })} · {t("profile.gave")} {n.gave} · {t("profile.asked")} {n.asked}
          </div>
          {theirs[0] && <div style={{ fontFamily: "'Cutive', serif", fontSize: 13, color: "#6a5238", marginTop: 4 }}>offering: {theirs[0].title}</div>}
        </div>
        <Btn small onClick={() => onOpenProfile(n.id)}>Profile</Btn>
      </div>
    );
  } else if (sel.kind === "post") {
    const p = sel.data, n = NEIGHBOR_BY_ID[p.authorId], ty = POST_TYPES[p.type];
    body = (
      <div style={{ display: "flex", gap: 13, alignItems: "center" }}>
        <Sticker icon={p.icon} tone={ty.tone} ink={ty.ink} size={46} variant="blob" outline={p.type === "event"} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <TypeTag type={p.type} small />
          <div style={{ fontFamily: "'Trocchi', serif", fontSize: 16, color: "#2A1A0E", marginTop: 4, lineHeight: 1.15 }}>{p.title}</div>
          <div style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 10, color: "#9a7a52", marginTop: 3 }}>{n.name} · {formatDistance(parseFloat(p.distance))}</div>
        </div>
        <Btn small onClick={() => onOpenPost(p.id)}>Open</Btn>
      </div>
    );
  } else if (sel.kind === "resource") {
    const r = sel.data;
    body = (
      <div style={{ display: "flex", gap: 13, alignItems: "center" }}>
        <div style={{ width: 46, height: 46, borderRadius: 11, background: "#E8DCC8", border: "1.5px solid #472C1C", display: "grid", placeItems: "center" }}>
          <Icon name={r.icon} size={22} style={{ color: "#472C1C" }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "#9a7a52" }}>{r.type}</div>
          <div style={{ fontFamily: "'Trocchi', serif", fontSize: 17, color: "#2A1A0E", marginTop: 2 }}>{r.name}</div>
          <div style={{ fontFamily: "'Cutive', serif", fontSize: 12.5, color: "#6a5238", marginTop: 2 }}>community-verified resource</div>
        </div>
      </div>
    );
  } else if (sel.kind === "thread") {
    const e = sel.data;
    const na = NEIGHBOR_BY_ID[e.a], nb = NEIGHBOR_BY_ID[e.b];
    const dirLabel = { gave: "a gift", received: "a gift", traded: "a trade" }[e.dir] || "an exchange";
    body = (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar person={na} size={34} /><Icon name="dots-three" size={16} style={{ color: "#9a7a52" }} /><Avatar person={nb} size={34} />
          <div style={{ marginLeft: 6 }}>
            <div style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 10, color: "#9a7a52", textTransform: "uppercase", letterSpacing: ".1em" }}>a completed {dirLabel}</div>
            <div style={{ fontFamily: "'Trocchi', serif", fontSize: 15, color: "#2A1A0E", marginTop: 2 }}>{na.first} ↔ {nb.first}</div>
          </div>
        </div>
        <p style={{ fontFamily: "'Cutive', serif", fontSize: 13.5, color: "#5a4329", margin: "10px 0 0" }}>“{e.note}” · {e.weeks === 0 ? "just now" : `${e.weeks} ${e.weeks === 1 ? "week" : "weeks"} ago`}</p>
      </div>
    );
  }
  return (
    <div style={{ position: "absolute", left: 12, right: 12, bottom: 86, zIndex: 20 }}>
      <div style={{ position: "relative", background: "linear-gradient(180deg,#F3E8CF,#E8DCC8)", borderRadius: 16, padding: "15px 16px", boxShadow: "0 -2px 0 #fff6, 0 12px 30px rgba(0,0,0,.5)", border: "1px solid #fff7" }}>
        <Grain opacity={0.05} />
        <button onClick={onClose} aria-label={t("common.close")} style={{ position: "absolute", top: 10, right: 10, background: "#472c1c14", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", display: "grid", placeItems: "center" }}>
          <Icon name="x" weight="bold" size={12} style={{ color: "#6a5238" }} />
        </button>
        <div style={{ position: "relative" }}>{body}</div>
      </div>
    </div>
  );
}

Object.assign(window, { MapScreen, RESOURCES });
