// myci-screens-map.jsx — The Commons: Map tab.
// A real OpenStreetMap (Leaflet) of the neighborhood, with the living mycelium
// network drawn on top: every completed exchange is a curved amber thread.

// typeKey → i18n key for the resource category (name stays as the proper noun).
const RESOURCES = [
  { id: "r_seed",   name: "Fernwood Seed Bank",    typeKey: "resource.seedBank",        icon: "leaf",    x: 38, y: 18 },
  { id: "r_repair", name: "Saturday Repair Café",  typeKey: "resource.repairCafe",      icon: "wrench",  x: 64, y: 72 },
  { id: "r_tools",  name: "Tool Library",          typeKey: "resource.toolLibrary",     icon: "toolbox", x: 86, y: 53 },
  { id: "r_pantry", name: "Little Free Pantry",    typeKey: "resource.freePantry",      icon: "basket",  x: 16, y: 47 },
  { id: "r_garden", name: "Community Garden",       typeKey: "resource.communityGarden", icon: "plant",   x: 58, y: 90 },
];

// ── Geo projection ───────────────────────────────────────────────────────────
// The seed data carries map positions as percentages (0–100) within an abstract
// field. We project them onto real-world coordinates centred on Fernwood so the
// same relative layout drops onto an actual street map. Swapping in real lat/lng
// from the API later is then just: replace project() with the row's own coords.
const MAP_CENTER = [48.4277, -123.3568]; // Fernwood, Victoria BC
const SPAN_LAT = 0.0115; // ~1.3 km tall
const SPAN_LNG = 0.0190; // ~1.4 km wide at this latitude

function project(x, y) {
  // x → longitude (left→right), y → latitude (top→bottom, so invert)
  return [
    MAP_CENTER[0] + ((50 - y) / 100) * SPAN_LAT,
    MAP_CENTER[1] + ((x - 50) / 100) * SPAN_LNG,
  ];
}

// thread visual style by age (weeks): newer = bright amber, older = faded sage
function threadStyle(age) {
  if (age <= 1) return { color: "#F2C94C", opacity: 0.95, weight: 3.2 };
  if (age <= 4) return { color: "#D6AD08", opacity: 0.72, weight: 2.4 };
  if (age <= 7) return { color: "#B6A24E", opacity: 0.55, weight: 1.9 };
  return { color: "#8CA679", opacity: 0.45, weight: 1.7 };
}

// Sample a cubic Bézier → array of [lat,lng]. Gives threads an organic curve
// instead of a dead-straight line between two nodes.
function sampleBezier(p0, c1, c2, p3, n) {
  const out = [];
  for (let i = 0; i <= n; i++) {
    const tt = i / n, mt = 1 - tt;
    const a = mt * mt * mt, b = 3 * mt * mt * tt, c = 3 * mt * tt * tt, d = tt * tt * tt;
    out.push([
      a * p0[0] + b * c1[0] + c * c2[0] + d * p3[0],
      a * p0[1] + b * c1[1] + c * c2[1] + d * p3[1],
    ]);
  }
  return out;
}

// Curved mycelium thread between two neighbors, in [lat,lng] points.
// Mirrors the wobble math of threadPath() but in geo space.
function threadLatLngs(na, nb, seed) {
  const A = project(na.x, na.y), B = project(nb.x, nb.y);
  // work with x=lng, y=lat for the perpendicular offset, then flip back
  const x1 = A[1], y1 = A[0], x2 = B[1], y2 = B[0];
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len, ny = dx / len;
  const wob = ((((seed * 37) % 10) - 5) / 9) * 0.06; // deterministic -0.0036..0.0029
  const off = len * (0.12 + wob);
  const c1 = [x1 + dx * 0.3 + nx * off, y1 + dy * 0.3 + ny * off];
  const c2 = [x1 + dx * 0.7 + nx * off * 0.7, y1 + dy * 0.7 + ny * off * 0.7];
  return sampleBezier([x1, y1], c1, c2, [x2, y2], 16).map(([x, y]) => [y, x]);
}

// ── Marker HTML (Leaflet divIcons replicate the React primitives) ────────────
function avatarHTML(person, size) {
  const grad = `radial-gradient(circle at 32% 28%, ${person.tone}, ${shade(person.tone, -22)})`;
  const shadow = person.you
    ? "0 0 0 3px #FEF4D6, 0 2px 6px rgba(30,16,6,.4)"
    : "0 2px 5px rgba(30,16,6,.38), inset 0 2px 2px rgba(255,255,255,.4)";
  const pulse = person.you
    ? `<div style="position:absolute;inset:-6px;border-radius:50%;border:2px solid #D6AD08;animation:youPulse 2.4s ease-in-out infinite"></div>`
    : "";
  return (
    `<div style="position:relative;width:${size}px;height:${size}px">${pulse}` +
    `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${grad};` +
    `display:grid;place-items:center;color:#2A1A0E;font-family:var(--display);` +
    `font-size:${size * 0.34}px;box-shadow:${shadow}">${person.initials}</div></div>`
  );
}

function postHTML(p, ty) {
  return (
    `<div style="width:22px;height:22px;border-radius:50% 50% 50% 2px;background:${ty.surface};` +
    `border:${p.type === "event" ? "1.5px solid #472C1C" : "none"};display:grid;place-items:center;` +
    `transform:rotate(45deg);box-shadow:0 3px 5px rgba(0,0,0,.4)">` +
    `<i class="ph-fill ph-${p.icon}" style="font-size:11px;color:${ty.ink};transform:rotate(-45deg)"></i></div>`
  );
}

function resourceHTML(r) {
  return (
    `<div style="width:26px;height:26px;border-radius:7px;background:#E8DCC8;border:1.5px solid #472C1C;` +
    `display:grid;place-items:center;box-shadow:0 2px 4px rgba(0,0,0,.4);transform:rotate(-4deg)">` +
    `<i class="ph-fill ph-${r.icon}" style="font-size:14px;color:#472C1C"></i></div>`
  );
}

// Note: translation comes from the global t() (window) — like the app's other
// stateless screens — so we deliberately don't take a `t` prop here (it would
// shadow the global translate fn). The screen re-renders with App on locale change.
function MapScreen({ exchanges, onOpenProfile, onOpenPost, onOpenNotifications }) {
  const [showPosts, setShowPosts] = useState(true);
  const [showThreads, setShowThreads] = useState(true);
  const [showResources, setShowResources] = useState(true);
  const [sel, setSel] = useState(null); // {kind:'neighbor'|'post'|'resource'|'thread', data}

  const elRef = useRef(null);
  const mapRef = useRef(null);
  const layersRef = useRef({}); // { threads, posts, resources, neighbors }

  // ── Build the map once on mount ────────────────────────────────────────────
  useEffect(() => {
    if (!elRef.current || !window.L) return;
    const map = L.map(elRef.current, {
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: true,
      minZoom: 13,
      maxZoom: 18,
    });
    mapRef.current = map;
    map.attributionControl.setPrefix(false);

    // CARTO Positron — a minimal, low-clutter basemap (muted landuse, no POI
    // icons, light labels). Much calmer than default OSM; the sepia filter in
    // Myci.html warms it into the app's earthy tone.
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: "© OpenStreetMap contributors © CARTO",
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    // Frame the neighborhood around all nodes.
    const all = [...NEIGHBORS, ...RESOURCES].map((n) => project(n.x, n.y));
    map.fitBounds(L.latLngBounds(all).pad(0.18));

    // ── Resources layer ──
    const resources = L.layerGroup();
    RESOURCES.forEach((r) => {
      L.marker(project(r.x, r.y), {
        icon: L.divIcon({ html: resourceHTML(r), className: "", iconSize: [26, 26], iconAnchor: [13, 13] }),
        zIndexOffset: 100,
        keyboard: false,
      }).on("click", () => setSel({ kind: "resource", data: r })).addTo(resources);
    });

    // ── Post pins (offset slightly from author node so both read) ──
    const posts = L.layerGroup();
    POSTS.forEach((p) => {
      const n = NEIGHBOR_BY_ID[p.authorId];
      if (!n) return;
      const ty = POST_TYPES[p.type];
      L.marker(project(n.x + 4.5, n.y - 5.5), {
        icon: L.divIcon({ html: postHTML(p, ty), className: "", iconSize: [22, 22], iconAnchor: [11, 11] }),
        zIndexOffset: 200,
        keyboard: false,
      }).on("click", () => setSel({ kind: "post", data: p })).addTo(posts);
    });

    // ── Neighbor nodes (always shown) ──
    const neighbors = L.layerGroup();
    NEIGHBORS.forEach((n) => {
      const size = n.you ? 36 : 28;
      L.marker(project(n.x, n.y), {
        icon: L.divIcon({ html: avatarHTML(n, size), className: "", iconSize: [size, size], iconAnchor: [size / 2, size / 2] }),
        zIndexOffset: n.you ? 400 : 300,
        keyboard: false,
        title: n.you ? `${n.name} (${t("common.you")})` : n.name,
      }).on("click", () => setSel({ kind: "neighbor", data: n })).addTo(neighbors);
    });
    neighbors.addTo(map);

    layersRef.current = { posts, resources, neighbors };

    // tapping empty map closes the preview sheet
    map.on("click", () => setSel(null));

    // The field is inside an animating, transform-scaled frame — recompute size
    // once it has settled so tiles/markers land in the right place.
    const t1 = setTimeout(() => map.invalidateSize(), 60);
    const t2 = setTimeout(() => map.invalidateSize(), 400);

    return () => {
      clearTimeout(t1); clearTimeout(t2);
      map.remove();
      mapRef.current = null;
      layersRef.current = {};
    };
  }, []);

  // ── Threads: rebuild when the set of exchanges changes ─────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const threads = L.layerGroup();
    exchanges.forEach((e, i) => {
      const na = NEIGHBOR_BY_ID[e.a], nb = NEIGHBOR_BY_ID[e.b];
      if (!na || !nb) return;
      const s = threadStyle(e.weeks);
      const line = L.polyline(threadLatLngs(na, nb, i + 3), {
        color: s.color, opacity: s.opacity, weight: s.weight,
        lineCap: "round", lineJoin: "round", interactive: true,
        className: e.weeks === 0 ? "myci-thread-fresh" : "",
      });
      line.on("click", () => setSel({ kind: "thread", data: e }));
      line.addTo(threads);
    });
    layersRef.current.threads = threads;
    if (showThreads) threads.addTo(map);
    return () => { threads.remove(); };
  }, [exchanges]);

  // ── Layer toggles ──────────────────────────────────────────────────────────
  useToggleLayer(mapRef, layersRef, "threads", showThreads);
  useToggleLayer(mapRef, layersRef, "posts", showPosts);
  useToggleLayer(mapRef, layersRef, "resources", showResources);

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: "#3A2A1E" }}>
      {/* header */}
      <div style={{ background: "#472C1C", padding: "54px 18px 13px", position: "relative", flexShrink: 0, zIndex: 5 }}>
        <Grain opacity={0.08} />
        <div style={{ position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 10.5, letterSpacing: ".2em", color: "#8CA679", textTransform: "uppercase" }}>
              {t("map.mapTab")}
            </div>
            <h1 style={{ fontFamily: "var(--display)", fontWeight: "normal", fontSize: 22, color: "#FEF4D6", margin: "3px 0 0" }}>
              {t("map.beneath", { place: NEIGHBORHOOD })}
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={onOpenNotifications} aria-label={t("notif.title")} style={{ position: "relative", background: "#FEF4D612", border: "1px solid #ffffff20", borderRadius: 10, width: 44, height: 44, cursor: "pointer", display: "grid", placeItems: "center" }}>
              <Icon name="bell" size={17} style={{ color: "#FEF4D6" }} />
              <span style={{ position: "absolute", top: 7, right: 8, width: 8, height: 8, borderRadius: "50%", background: "#D6AD08", border: "1.5px solid #472C1C" }} />
            </button>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "var(--display)", fontSize: 26, color: "#D6AD08", lineHeight: 1 }}>{exchanges.length}</div>
              <div style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 9, color: "#b79a6e", letterSpacing: ".1em", textTransform: "uppercase" }}>{t("map.threadsGrown")}</div>
            </div>
          </div>
        </div>
      </div>

      {/* the field — real Leaflet/OSM map fills it, UI overlays sit on top */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <div ref={elRef} className="myci-map" style={{ position: "absolute", inset: 0, zIndex: 0 }} />

        {/* legend / layer toggles */}
        <div style={{ position: "absolute", left: 12, bottom: 108, display: "flex", flexDirection: "column", gap: 6, zIndex: 1000 }}>
          <LayerToggle on={showThreads} onClick={() => setShowThreads((v) => !v)} swatch="#D6AD08" label={t("map.layer.threads")} />
          <LayerToggle on={showPosts} onClick={() => setShowPosts((v) => !v)} swatch="#B27500" label={t("map.layer.posts")} />
          <LayerToggle on={showResources} onClick={() => setShowResources((v) => !v)} swatch="#E8DCC8" label={t("map.layer.resources")} bordered />
        </div>

        {/* live caption */}
        <div style={{ position: "absolute", right: 12, bottom: 108, maxWidth: 144, textAlign: "right", zIndex: 1000, pointerEvents: "none" }}>
          <p style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 9.5, color: "#cbb085", lineHeight: 1.4, background: "#2a1a0ecc", padding: "6px 9px", borderRadius: 8 }}>
            {t("map.caption")}
          </p>
        </div>

        {/* selection sheet */}
        {sel && <PreviewSheet sel={sel} onClose={() => setSel(null)} onOpenProfile={onOpenProfile} onOpenPost={onOpenPost} />}
      </div>
    </div>
  );
}

// Add/remove a named layer group from the map as its toggle flips.
function useToggleLayer(mapRef, layersRef, key, on) {
  useEffect(() => {
    const map = mapRef.current, layer = layersRef.current[key];
    if (!map || !layer) return;
    if (on) layer.addTo(map);
    else map.removeLayer(layer);
  }, [on]);
}

function LayerToggle({ on, onClick, swatch, label, bordered }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 7, cursor: "pointer",
      background: on ? "#2a1a0ecc" : "#2a1a0e66", border: "1px solid #ffffff1a",
      borderRadius: 20, padding: "5px 11px 5px 7px", opacity: on ? 1 : 0.5,
    }}>
      <span style={{ width: 11, height: 11, borderRadius: "50%", background: swatch, border: bordered ? "1px solid #472C1C" : "none" }} />
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
          <div style={{ fontFamily: "'Trocchi', serif", fontSize: 18, color: "#2A1A0E" }}>{n.name}{n.you ? ` (${t("common.you")})` : ""}</div>
          <div style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 10.5, color: "#9a7a52", marginTop: 2 }}>
            {t("profile.here", { t: n.here })} · {t("profile.gave")} {n.gave} · {t("profile.asked")} {n.asked}
          </div>
          {theirs[0] && <div style={{ fontFamily: "'Cutive', serif", fontSize: 13, color: "#6a5238", marginTop: 4 }}>{t("map.offering")} {theirs[0].title}</div>}
        </div>
        <Btn small onClick={() => onOpenProfile(n.id)}>{t("map.profile")}</Btn>
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
        <Btn small onClick={() => onOpenPost(p.id)}>{t("map.open")}</Btn>
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
          <div style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "#9a7a52" }}>{t(r.typeKey)}</div>
          <div style={{ fontFamily: "'Trocchi', serif", fontSize: 17, color: "#2A1A0E", marginTop: 2 }}>{r.name}</div>
          <div style={{ fontFamily: "'Cutive', serif", fontSize: 12.5, color: "#6a5238", marginTop: 2 }}>{t("map.communityVerified")}</div>
        </div>
      </div>
    );
  } else if (sel.kind === "thread") {
    const e = sel.data;
    const na = NEIGHBOR_BY_ID[e.a], nb = NEIGHBOR_BY_ID[e.b];
    const completedLabel = { gave: t("map.completedGift"), received: t("map.completedGift"), traded: t("map.completedTrade") }[e.dir] || t("map.completedExchange");
    const ago = e.weeks === 0 ? t("time.justNow") : t(e.weeks === 1 ? "time.weekAgo" : "time.weeksAgo", { n: e.weeks });
    body = (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar person={na} size={34} /><Icon name="dots-three" size={16} style={{ color: "#9a7a52" }} /><Avatar person={nb} size={34} />
          <div style={{ marginLeft: 6 }}>
            <div style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 10, color: "#9a7a52", textTransform: "uppercase", letterSpacing: ".1em" }}>{completedLabel}</div>
            <div style={{ fontFamily: "'Trocchi', serif", fontSize: 15, color: "#2A1A0E", marginTop: 2 }}>{na.first} ↔ {nb.first}</div>
          </div>
        </div>
        <p style={{ fontFamily: "'Cutive', serif", fontSize: 13.5, color: "#5a4329", margin: "10px 0 0" }}>“{e.note}” · {ago}</p>
      </div>
    );
  }
  return (
    <div style={{ position: "absolute", left: 12, right: 12, bottom: 108, zIndex: 1001 }}>
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
