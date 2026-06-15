// myci-screens-intro.jsx — Landing + Onboarding (the "give first" sequence)

// Animated mycelium that grows outward from a central node.
function MyceliumBloom({ play = true }) {
  const branches = useMemo(() => {
    const out = [];
    const cx = 50, cy = 50;
    const N = 9;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2 + (i % 2) * 0.3;
      const r = 30 + (i % 3) * 9;
      const ex = cx + Math.cos(a) * r, ey = cy + Math.sin(a) * r;
      out.push({ d: threadPath(cx, cy, ex, ey, i + 1), ex, ey, delay: i * 0.13 });
      // sub-branch
      const a2 = a + (i % 2 ? 0.5 : -0.5);
      const r2 = r * 0.55;
      const sx = ex, sy = ey;
      const e2x = sx + Math.cos(a2) * r2, e2y = sy + Math.sin(a2) * r2;
      out.push({ d: threadPath(sx, sy, e2x, e2y, i + 11), ex: e2x, ey: e2y, delay: 0.7 + i * 0.1, thin: true });
    }
    return out;
  }, []);

  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", display: "block", overflow: "visible" }}>
      {branches.map((b, i) => (
        <g key={i}>
          <path d={b.d} fill="none" stroke="#D6AD08" strokeOpacity={b.thin ? 0.32 : 0.5}
            strokeWidth={b.thin ? 0.35 : 0.6} strokeLinecap="round"
            style={{
              strokeDasharray: 100, strokeDashoffset: play ? 0 : 100,
              transition: `stroke-dashoffset 1.1s ease ${b.delay}s`,
            }} />
          <circle cx={b.ex} cy={b.ey} r={b.thin ? 0.7 : 1.1} fill="#FEF4D6"
            style={{ opacity: play ? 0.85 : 0, transition: `opacity .5s ease ${b.delay + 0.9}s` }} />
        </g>
      ))}
      <circle cx="50" cy="50" r="2.4" fill="#D6AD08" style={{ filter: "drop-shadow(0 0 4px #d6ad0888)" }} />
    </svg>
  );
}

// Interconnected mycelium mesh that idles alive: flowing threads, pulsing nodes,
// and a couple of threads that slowly draw themselves in.
function MyceliumNet() {
  const { nodes, edges } = useMemo(() => {
    const nodes = [
      [12, 9], [34, 6], [55, 11], [78, 7], [92, 15],
      [6, 25], [27, 23], [47, 27], [67, 21], [87, 29],
      [15, 41], [38, 44], [58, 39], [80, 45], [95, 39],
      [9, 57], [30, 60], [50, 55], [72, 59], [90, 57],
      [19, 73], [42, 76], [62, 71], [83, 75],
      [12, 89], [34, 92], [55, 87], [76, 91], [93, 85],
    ];
    const edges = [];
    const TH = 25;
    for (let i = 0; i < nodes.length; i++) {
      const cand = [];
      for (let j = i + 1; j < nodes.length; j++) {
        const d = Math.hypot(nodes[i][0] - nodes[j][0], nodes[i][1] - nodes[j][1]);
        if (d < TH) cand.push([j, d]);
      }
      cand.sort((a, b) => a[1] - b[1]);
      cand.slice(0, 3).forEach(([j]) => edges.push([i, j]));
    }
    return { nodes, edges };
  }, []);

  return (
    <React.Fragment>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
        {edges.map(([a, b], i) => {
          const d = threadPath(nodes[a][0], nodes[a][1], nodes[b][0], nodes[b][1], i + 1);
          const grow = i % 9 === 4;
          const flow = !grow && i % 3 === 0;
          if (grow) return <path key={i} className="myc-grow" d={d} fill="none" stroke="#E6BE3E" strokeWidth="1.1" strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{ strokeDasharray: 560, strokeDashoffset: 0, opacity: 0.5, animationDelay: `${(i % 7) * 1.7}s` }} />;
          if (flow) return <path key={i} className="myc-flow" d={d} fill="none" stroke="#D6AD08" strokeOpacity={0.45} strokeWidth="1" strokeLinecap="round" strokeDasharray="3 7" vectorEffect="non-scaling-stroke" style={{ animationDuration: `${3.2 + (i % 5) * 0.9}s` }} />;
          return <path key={i} d={d} fill="none" stroke="#9c7d2e" strokeOpacity={0.28} strokeWidth="0.85" strokeLinecap="round" vectorEffect="non-scaling-stroke" />;
        })}
      </svg>
      {nodes.map((n, i) => {
        const lit = i % 3 === 1;
        return (
          <div key={i} style={{
            position: "absolute", left: `${n[0]}%`, top: `${n[1]}%`,
            width: lit ? 7 : 5, height: lit ? 7 : 5, borderRadius: "50%",
            background: lit ? "#FEF4D6" : "#D6AD08",
            boxShadow: lit ? "0 0 7px 1px #f2c94c88" : "none",
            transform: "translate(-50%,-50%)",
            opacity: lit ? 1 : 0.5,
            ...(lit ? { animation: "nodePulse 3.6s ease-in-out infinite", animationDelay: `${(i % 9) * 0.5}s` } : {}),
          }} />
        );
      })}
    </React.Fragment>
  );
}

// Brand logo mark — four colored mycelium threads meeting at a seed.
// Faithful port of the lockup mark on the landing page (index.html).
function LogoMark({ size = 54 }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden width={size} height={size} style={{ display: "block" }}>
      <g strokeLinecap="round">
        <path d="M24 24 C18 20 13 15 8 12"  stroke="#1E8A80" strokeWidth="2.4" />
        <path d="M24 24 C31 19 36 14 40 10" stroke="#7E9F56" strokeWidth="2.4" />
        <path d="M24 24 C19 30 14 35 10 40" stroke="#D26A3A" strokeWidth="2.4" />
        <path d="M24 24 C31 31 36 35 40 38" stroke="#E3A81B" strokeWidth="2.4" />
      </g>
      <g>
        <circle cx="8"  cy="12" r="3" fill="#1E8A80" />
        <circle cx="40" cy="10" r="3" fill="#7E9F56" />
        <circle cx="10" cy="40" r="3" fill="#D26A3A" />
        <circle cx="40" cy="38" r="3" fill="#E3A81B" />
        <circle cx="24" cy="24" r="5" fill="#FBF3DE" />
        <circle cx="24" cy="24" r="2.6" fill="#E3A81B" />
      </g>
    </svg>
  );
}

// Landing fonts — the same faces the public landing page (index.html) uses,
// so the in-app landing reads as one brand.
const LF = {
  wordmark: "'Super Mellow', 'Fraunces', Georgia, serif",
  display:  "'Fraunces', Georgia, serif",
  body:     "'Hanken Grotesk', system-ui, sans-serif",
  mono:     "'Space Mono', ui-monospace, monospace",
};

function LandingScreen({ onJoin, onSignIn, onGuest }) {
  const { t } = useI18n();
  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column",
      justifyContent: "space-between", overflow: "hidden", color: "#FBF3DE",
      background:
        "radial-gradient(80% 60% at 18% 8%, rgba(30,138,128,.34) 0%, transparent 55%)," +
        "radial-gradient(70% 60% at 92% 96%, rgba(210,106,58,.30) 0%, transparent 55%)," +
        "radial-gradient(110% 90% at 50% 40%, #3C2517 0%, #2E1B11 60%, #20120A 100%)",
    }}>
      {/* interconnected living network */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.72 }}>
        <MyceliumNet />
      </div>

      {/* brown radial under the title for separation */}
      <div aria-hidden style={{
        position: "absolute", left: "50%", top: "47%", transform: "translate(-50%,-50%)",
        width: 640, height: 540, pointerEvents: "none",
        background: "radial-gradient(ellipse 46% 42% at 50% 50%, rgba(46,27,17,.94) 0%, rgba(46,27,17,.72) 34%, rgba(46,27,17,0) 72%)",
      }} />

      <Grain opacity={0.08} />

      {/* top bar — the guest path lives up here now, centered clear of the notch */}
      <div style={{ position: "relative", display: "flex", justifyContent: "center", padding: "46px 18px 0" }}>
        {onGuest && (
          <button onClick={onGuest} style={{
            display: "inline-flex", alignItems: "center", gap: 7, cursor: "pointer",
            background: "#FEF4D610", border: "1px solid #ffffff2e", borderRadius: 999,
            color: "#E8DCC8", fontFamily: LF.body, fontWeight: 600, fontSize: 13.5,
            padding: "9px 15px",
          }}>
            <Icon name="binoculars" size={16} style={{ color: "#E3A81B" }} /> {t("landing.guest")}
          </button>
        )}
      </div>

      {/* centered hero — logo, eyebrow, wordmark, tagline, subline (mirrors index.html) */}
      <div style={{
        position: "relative", flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 30px",
      }}>
        <LogoMark size={54} />
        <p style={{
          fontFamily: LF.mono, textTransform: "uppercase", letterSpacing: ".22em",
          fontSize: 11, fontWeight: 700, color: "#3AAFA0", margin: "20px 0 0",
        }}>{t("landing.eyebrow")}</p>
        <h1 style={{
          fontFamily: LF.wordmark, fontWeight: "normal", fontSize: 76, color: "#FBF3DE",
          margin: "6px 0 0", letterSpacing: ".01em", lineHeight: 0.92,
          textShadow: "0 2px 30px rgba(0,0,0,.4)",
        }}>Myci</h1>
        <p style={{
          fontFamily: LF.display, fontWeight: 500, fontSize: 26, color: "#FBF3DE",
          margin: "16px auto 0", maxWidth: 320, lineHeight: 1.18, letterSpacing: "-.01em",
        }}>
          {t("landing.tagline1")}<br />{t("landing.tagline2")}
        </p>
        <p style={{
          fontFamily: LF.body, fontSize: 14.5, color: "#E9D7B8",
          margin: "14px auto 0", maxWidth: 320, lineHeight: 1.5,
        }}>{t("landing.subline")}</p>
      </div>

      <div style={{ position: "relative", width: "100%", padding: "0 28px 36px", boxSizing: "border-box" }}>
        <Btn full icon="sparkle" onClick={onJoin} style={{ fontFamily: LF.body, fontWeight: 600, fontSize: 17, padding: "16px" }}>
          {t("landing.join")}
        </Btn>

        {onSignIn && (
          <button onClick={onSignIn} style={{
            display: "block", margin: "14px auto 0", background: "none", border: "none", cursor: "pointer",
            fontFamily: LF.body, fontWeight: 600, fontSize: 14.5, color: "#E8DCC8", minHeight: 44,
          }}>
            {t("landing.signin")}
          </button>
        )}

        <p style={{ fontFamily: LF.mono, fontSize: 10.5, color: "#b79a6e", textAlign: "center", marginTop: 2, letterSpacing: ".04em" }}>
          {t("landing.note")}
        </p>
        <LegalLine />
      </div>
    </div>
  );
}

// Shared Terms / Privacy line — opens the static legal pages in a new tab.
function LegalLine() {
  const { t } = useI18n();
  const link = { color: "#cbb085", textDecoration: "underline" };
  const our = t("legal.our");
  return (
    <p style={{ fontFamily: LF.body, fontSize: 9, color: "#9a8260", textAlign: "center", marginTop: 10, lineHeight: 1.45 }}>
      {t("legal.agreePre")}<br />
      {our ? our + " " : ""}
      <a href="/terms" target="_blank" rel="noopener noreferrer" style={link}>{t("legal.terms")}</a>{" "}
      {t("legal.and")}{" "}
      <a href="/privacy" target="_blank" rel="noopener noreferrer" style={link}>{t("legal.privacy")}</a>.
    </p>
  );
}

// ---- Onboarding: Location → What can you give? → What you'd learn / could use help with ----
const GIVE_CHIPS = ["Cooking", "Gardening", "Tools to lend", "Repairs", "Childcare", "Rides", "Teaching", "Spare produce", "Carpentry", "A spare hour", "Music", "Sewing"];
const CURIOUS_CHIPS = ["Woodworking", "Bread baking", "Bike repair", "Painting", "Composting", "A new language", "Foraging", "Pottery", "Beekeeping", "Knitting"];
const NEED_CHIPS = ["Groceries", "Rides", "Repairs", "Tech help", "Yard work", "Company", "Heavy lifting", "A warm meal", "Childcare", "Paperwork"];

function OnboardingScreen({ onDone, onBack }) {
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const [loc, setLoc] = useState(null); // { lat, lng, neighborhood, city } — coords are already fuzzed
  const [give, setGive] = useState(["Spare produce", "A spare hour"]);
  const [curious, setCurious] = useState(["Woodworking"]);
  const [needs, setNeeds] = useState(["Rides"]);
  const steps = ["Where", "Give", "Curious"];

  const toggle = (arr, set, v) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <div style={{ position: "absolute", inset: 0, background: "#3A2A1E", display: "flex", flexDirection: "column" }}>
      <Grain opacity={0.07} />
      {/* progress */}
      <div style={{ display: "flex", gap: 8, padding: "62px 28px 0", position: "relative" }}>
        {steps.map((s, i) => (
          <div key={s} style={{ flex: 1, height: 5, borderRadius: 3, background: i <= step ? "var(--accent)" : "#ffffff1f", transition: "background .3s" }} />
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "30px 28px 20px", position: "relative" }}>
        {step === 0 && (
          <div>
            <Eyebrow>{t("ob.step1")}</Eyebrow>
            <Headline>{t("ob.where")}</Headline>
            <Sub>{t("ob.whereSub")}</Sub>
            <LocationStep loc={loc} onSet={setLoc} />
          </div>
        )}
        {step === 1 && (
          <div>
            <Eyebrow>{t("ob.step2")}</Eyebrow>
            <Headline>{t("ob.give")}</Headline>
            <Sub>{t("ob.giveSub")}</Sub>
            <ChipField options={GIVE_CHIPS} selected={give} onToggle={(v) => toggle(give, setGive, v)} tone="var(--accent)" />
          </div>
        )}
        {step === 2 && (
          <div>
            <Eyebrow>{t("ob.step3")}</Eyebrow>
            <Headline>{t("ob.curious")}</Headline>
            <Sub>{t("ob.curiousSub")}</Sub>
            <GroupLabel icon="leaf">{t("ob.learnLabel")}</GroupLabel>
            <ChipField options={CURIOUS_CHIPS} selected={curious} onToggle={(v) => toggle(curious, setCurious, v)} tone="#8CA679" />
            <GroupLabel icon="hand-heart">{t("ob.needLabel")}</GroupLabel>
            <ChipField options={NEED_CHIPS} selected={needs} onToggle={(v) => toggle(needs, setNeeds, v)} tone="#C08457" />
          </div>
        )}
      </div>

      <div style={{ padding: "12px 28px 40px", position: "relative", display: "flex", gap: 12, alignItems: "center" }}>
        <button onClick={() => (step === 0 ? onBack && onBack() : setStep(step - 1))} style={{
          background: "none", border: "none", cursor: "pointer", color: "#b79a6e",
          fontFamily: "'Cutive', serif", fontSize: 15, padding: "10px 4px",
          display: "flex", alignItems: "center", gap: 6,
        }}><Icon name="arrow-left" size={15} /> {t("common.back")}</button>
        <div style={{ flex: 1 }} />
        <Btn icon={step === 2 ? "check" : "arrow-right"}
          onClick={() => (step === 2 ? onDone({ location: loc, give, curious, needs }) : setStep(step + 1))}>
          {step === 2 ? t("ob.enter") : t("common.next")}
        </Btn>
      </div>
    </div>
  );
}

// onboarding bits
function Eyebrow({ children }) {
  return <div style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 11, letterSpacing: ".2em", color: "var(--accent)", textTransform: "uppercase" }}>{children}</div>;
}
function Headline({ children }) {
  return <h2 style={{ fontFamily: "'Trocchi', serif", fontWeight: 400, fontSize: 27, color: "#FEF4D6", margin: "12px 0 0", lineHeight: 1.12, textWrap: "balance" }}>{children}</h2>;
}
// Small caption that separates the two intents on the "curious / need" step.
function GroupLabel({ children, icon }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 28 }}>
      {icon && <Icon name={icon} size={14} style={{ color: "#9a7a52" }} />}
      <span style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 10.5, letterSpacing: ".16em", color: "#9a7a52", textTransform: "uppercase" }}>{children}</span>
    </div>
  );
}
function Sub({ children }) {
  return <p style={{ fontFamily: "'Cutive', serif", fontSize: 14.5, color: "#c4ab83", margin: "12px 0 0", lineHeight: 1.5 }}>{children}</p>;
}
// Read-only field showing a value the location flow filled in (no caret — it's
// derived from your spot, not a manual picker).
function ResultField({ icon, label, value, placeholder }) {
  const filled = !!value;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#FEF4D610", border: "1px solid #ffffff16", borderRadius: 12, padding: "13px 15px", marginBottom: 11 }}>
      <Icon name={icon} size={18} style={{ color: filled ? "var(--accent)" : "#7a6244" }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 9.5, letterSpacing: ".14em", color: "#9a7a52", textTransform: "uppercase" }}>{label}</div>
        <div style={{ fontFamily: "'Cutive', serif", fontSize: 16, color: filled ? "#FEF4D6" : "#8a7252", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {value || placeholder}
        </div>
      </div>
      {filled && <Icon name="check-circle" size={17} style={{ color: "#8CA679" }} />}
    </div>
  );
}
function ChipField({ options, selected, onToggle, tone }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginTop: 22 }}>
      {options.map((o) => {
        const on = selected.includes(o);
        return (
          <button key={o} onClick={() => onToggle(o)} style={{
            fontFamily: "'Cutive', serif", fontSize: 14, cursor: "pointer",
            padding: "9px 15px", borderRadius: 20,
            background: on ? tone : "#FEF4D60d",
            color: on ? "#2A1A0E" : "#E8DCC8",
            border: "1px solid",
            borderColor: on ? tone : "#ffffff22",
            boxShadow: on ? "0 2px 6px rgba(30,16,6,.3)" : "none",
            transition: "background .12s, color .12s, border-color .12s, box-shadow .12s",
          }}>{o}</button>
        );
      })}
    </div>
  );
}

// ── Geocoding (OpenStreetMap Nominatim — free, no API key) ───────────────────
const NOMINATIM = "https://nominatim.openstreetmap.org";
const DEFAULT_CENTER = [48.4277, -123.3568]; // Fernwood, Victoria BC — matches the Map tab

// Pull a neighborhood + city out of a Nominatim address object, walking the most
// specific tag down to the broadest so sparse rural results still fill in.
function pickPlace(addr = {}) {
  return {
    neighborhood: addr.neighbourhood || addr.suburb || addr.quarter || addr.city_district ||
      addr.residential || addr.hamlet || addr.village || addr.town || "",
    city: addr.city || addr.town || addr.municipality || addr.village || addr.county || addr.state || "",
  };
}

// Privacy fuzz: shift the real point by up to ~300m in a random direction so the
// circle we store and show is never centered on the exact home.
function fuzzCoords(lat, lng) {
  const r = 0.0008 + Math.random() * 0.0019;     // ~90m..300m
  const a = Math.random() * Math.PI * 2;
  const dLat = r * Math.cos(a);
  const dLng = (r * Math.sin(a)) / Math.max(0.2, Math.cos((lat * Math.PI) / 180));
  return { lat: lat + dLat, lng: lng + dLng };
}

// Build the fuzzed location object the rest of onboarding carries.
function toLoc(lat, lng, addr) {
  const f = fuzzCoords(lat, lng);
  return { lat: f.lat, lng: f.lng, ...pickPlace(addr) };
}

// The "Where you are" step: real OSM map + use-my-location + a country-scoped
// city / postcode search. Scoping to a country is what lets a bare postcode
// (e.g. "V8W") actually resolve — worldwide it's ambiguous and returns nothing.
function LocationStep({ loc, onSet }) {
  const { t, lang } = useI18n();
  const elRef = useRef(null);
  const mapRef = useRef(null);
  const circleRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | locating | error
  const [country, setCountry] = useState(""); // ISO alpha-2, "" until chosen
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const countries = useMemo(() => countryList(lang), [lang]);
  const countryName = useMemo(() => {
    const c = countries.find((x) => x.code === country);
    return c ? c.name : "";
  }, [countries, country]);

  // ── Build the map once ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!elRef.current || !window.L) return;
    const map = L.map(elRef.current, {
      zoomControl: false, attributionControl: true,
      scrollWheelZoom: false, doubleClickZoom: false, dragging: true,
      minZoom: 10, maxZoom: 17,
    }).setView(loc ? [loc.lat, loc.lng] : DEFAULT_CENTER, loc ? 14 : 12);
    mapRef.current = map;
    map.attributionControl.setPrefix(false);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: "© OpenStreetMap contributors © CARTO", subdomains: "abcd", maxZoom: 19,
    }).addTo(map);
    // settle size inside the transform-scaled, animating device frame
    const t1 = setTimeout(() => map.invalidateSize(), 60);
    const t2 = setTimeout(() => map.invalidateSize(), 400);
    return () => { clearTimeout(t1); clearTimeout(t2); map.remove(); mapRef.current = null; circleRef.current = null; };
  }, []);

  // ── Draw / move the ±500m fuzz ring when the chosen spot changes ─────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loc) return;
    if (circleRef.current) circleRef.current.remove();
    circleRef.current = L.circle([loc.lat, loc.lng], {
      radius: 500, color: "#D6AD08", weight: 1.5, opacity: 0.95,
      fillColor: "#D6AD08", fillOpacity: 0.16, dashArray: "4 6",
    }).addTo(map);
    map.flyTo([loc.lat, loc.lng], 14, { duration: 0.7 });
  }, [loc]);

  // ── Frame the map on the chosen country until a precise spot is picked ───────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !country || loc) return;
    fetch(`${NOMINATIM}/search?format=jsonv2&limit=1&countrycodes=${country}&q=${encodeURIComponent(countryName || country)}`)
      .then((r) => r.json())
      .then((list) => {
        const bb = list && list[0] && list[0].boundingbox;
        if (!bb || !mapRef.current || loc) return;
        const s = parseFloat(bb[0]), n = parseFloat(bb[1]), w = parseFloat(bb[2]), e = parseFloat(bb[3]);
        mapRef.current.fitBounds([[s, w], [n, e]]);
      })
      .catch(() => {});
  }, [country]);

  // ── Geolocation → reverse geocode (also fills in the country) ────────────────
  const useMyLocation = () => {
    if (!navigator.geolocation) { setStatus("error"); return; }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetch(`${NOMINATIM}/reverse?format=jsonv2&zoom=14&addressdetails=1&lat=${latitude}&lon=${longitude}`)
          .then((r) => r.json())
          .then((d) => {
            const cc = d.address && d.address.country_code;
            if (cc) setCountry(cc.toUpperCase());
            onSet(toLoc(latitude, longitude, d.address));
            setStatus("idle"); setResults([]); setQuery("");
          })
          .catch(() => setStatus("error"));
      },
      () => setStatus("error"),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  };

  // ── Country-scoped city / postcode search (debounced) ────────────────────────
  useEffect(() => {
    if (!country || query.trim().length < 3) { setResults([]); setSearching(false); return; }
    setSearching(true);
    const id = setTimeout(() => {
      fetch(`${NOMINATIM}/search?format=jsonv2&addressdetails=1&limit=6&countrycodes=${country}&q=${encodeURIComponent(query)}`)
        .then((r) => r.json())
        .then((list) => { setResults(Array.isArray(list) ? list : []); setSearching(false); })
        .catch(() => { setResults([]); setSearching(false); });
    }, 600);
    return () => clearTimeout(id);
  }, [query, country]);

  const pick = (item) => {
    onSet(toLoc(parseFloat(item.lat), parseFloat(item.lon), item.address));
    setResults([]); setQuery("");
    setStatus("idle");
  };

  const onCountry = (e) => { setCountry(e.target.value); setQuery(""); setResults([]); setStatus("idle"); };
  const searchEnabled = !!country;

  return (
    <div style={{ marginTop: 22 }}>
      {/* Use my location */}
      <Btn full kind="dark" icon="crosshair"
        onClick={useMyLocation}
        style={{ justifyContent: "center", opacity: status === "locating" ? 0.7 : 1 }}>
        {status === "locating" ? t("ob.locating") : t("ob.useLocation")}
      </Btn>

      {/* divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0" }}>
        <div style={{ flex: 1, height: 1, background: "#ffffff1c" }} />
        <span style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 10.5, letterSpacing: ".12em", color: "#9a7a52", textTransform: "uppercase" }}>{t("ob.orType")}</span>
        <div style={{ flex: 1, height: 1, background: "#ffffff1c" }} />
      </div>

      {/* Country first — scopes the search so postcodes resolve */}
      <div style={{ position: "relative", marginBottom: 11 }}>
        <Icon name="globe" size={18} style={{ position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)", color: "var(--accent)", pointerEvents: "none" }} />
        <select
          value={country}
          onChange={onCountry}
          aria-label={t("ob.country")}
          style={{
            width: "100%", boxSizing: "border-box", cursor: "pointer",
            background: "#FEF4D610", border: "1px solid #ffffff16", borderRadius: 12,
            padding: "14px 38px 14px 44px", color: country ? "#FEF4D6" : "#a98f68",
            fontFamily: "'Cutive', serif", fontSize: 15, outline: "none",
            WebkitAppearance: "none", MozAppearance: "none", appearance: "none",
          }}
        >
          <option value="" style={{ color: "#2A1A0E" }}>{t("ob.selectCountry")}</option>
          {countries.map((c) => (
            <option key={c.code} value={c.code} style={{ color: "#2A1A0E" }}>{c.name}</option>
          ))}
        </select>
        <Icon name="caret-down" weight="bold" size={14} style={{ position: "absolute", right: 15, top: "50%", transform: "translateY(-50%)", color: "#9a7a52", pointerEvents: "none" }} />
      </div>

      {/* City / postcode search (scoped to the chosen country) */}
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#FEF4D610", border: "1px solid #ffffff16", borderRadius: 12, padding: "12px 14px", opacity: searchEnabled ? 1 : 0.55 }}>
          <Icon name="magnifying-glass" size={17} style={{ color: "#9a7a52" }} />
          <input
            value={query}
            disabled={!searchEnabled}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchEnabled ? t("ob.addressPlaceholder") : t("ob.searchDisabled")}
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              color: "#FEF4D6", fontFamily: "'Cutive', serif", fontSize: 15,
              cursor: searchEnabled ? "text" : "not-allowed",
            }}
          />
          {searching && <Icon name="spinner-gap" size={15} className="myc-spin" style={{ color: "#9a7a52" }} />}
        </div>

        {/* results dropdown */}
        {searchEnabled && query.trim().length >= 3 && (results.length > 0 || !searching) && (
          <div style={{
            position: "absolute", left: 0, right: 0, top: "calc(100% + 6px)", zIndex: 50,
            background: "#2a1a0e", border: "1px solid #ffffff20", borderRadius: 12,
            overflow: "hidden", boxShadow: "0 12px 30px rgba(0,0,0,.5)",
          }}>
            {results.length === 0 && !searching ? (
              <div style={{ padding: "13px 15px", fontFamily: "'Cutive', serif", fontSize: 13.5, color: "#a98f68" }}>{t("ob.noResults")}</div>
            ) : (
              results.map((r, i) => (
                <button key={r.place_id || i} onClick={() => pick(r)} style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
                  background: "none", border: "none", cursor: "pointer",
                  padding: "11px 14px", borderTop: i ? "1px solid #ffffff12" : "none",
                }}>
                  <Icon name="map-pin" size={15} style={{ color: "var(--accent)", flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Cutive', serif", fontSize: 13.5, color: "#E8DCC8", lineHeight: 1.3 }}>{r.display_name}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {status === "error" && (
        <p style={{ fontFamily: "'Cutive', serif", fontSize: 12.5, color: "#d9a06a", margin: "10px 2px 0", display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="warning-circle" size={14} /> {t("ob.locateError")}
        </p>
      )}

      {/* resolved place */}
      <div style={{ marginTop: 16 }}>
        <ResultField icon="map-pin" label={t("ob.neighborhood")} value={loc && loc.neighborhood} placeholder="—" />
        <ResultField icon="city" label={t("ob.city")} value={loc && loc.city} placeholder="—" />
      </div>

      {/* real map with the fuzz ring */}
      <div style={{ marginTop: 5, borderRadius: 14, overflow: "hidden", height: 168, position: "relative", border: "1px solid #ffffff14" }}>
        <div ref={elRef} className="myci-map myci-map-mini" style={{ position: "absolute", inset: 0 }} />
        <div style={{
          position: "absolute", left: 10, top: 10, zIndex: 500, pointerEvents: "none",
          fontFamily: "'Cutive Mono', monospace", fontSize: 9, color: "#FEF4D6",
          background: "#2a1a0ecc", padding: "3px 8px", borderRadius: 6,
        }}>{loc ? t("ob.fuzzCaption") : t("ob.youRoughly")}</div>
      </div>

      {/* privacy reassurance */}
      <p style={{ fontFamily: "'Cutive', serif", fontSize: 12.5, color: "#a78a5e", margin: "12px 2px 0", lineHeight: 1.5, display: "flex", gap: 8 }}>
        <Icon name="lock-simple" size={15} style={{ color: "#8CA679", flexShrink: 0, marginTop: 1 }} />
        {t("ob.privacyLock")}
      </p>
    </div>
  );
}

Object.assign(window, { LandingScreen, OnboardingScreen, MyceliumBloom, LegalLine, MyceliumNet, LogoMark, LF });
