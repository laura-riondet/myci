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

function LandingScreen({ onJoin, onSignIn, onGuest }) {
  const { t } = useI18n();
  return (
    <div style={{
      position: "absolute", inset: 0, background: "#472C1C",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "space-between", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0, background:
          "radial-gradient(120% 70% at 50% 8%, #5a3a24 0%, #472C1C 46%, #3A2A1E 100%)",
      }} />

      {/* interconnected living network */}
      <div style={{ position: "absolute", inset: 0 }}>
        <MyceliumNet />
      </div>

      {/* brown radial under the title for separation */}
      <div aria-hidden style={{
        position: "absolute", left: "50%", top: "47%", transform: "translate(-50%,-50%)",
        width: 640, height: 540, pointerEvents: "none",
        background: "radial-gradient(ellipse 46% 40% at 50% 50%, rgba(58,36,22,.96) 0%, rgba(58,36,22,.86) 30%, rgba(58,36,22,0) 70%)",
      }} />

      <Grain opacity={0.08} />

      {/* top spacer keeps the wordmark centered on the brown gradient */}
      <div style={{ paddingTop: 92 }} />

      <div style={{ position: "relative", textAlign: "center", padding: "0 30px", marginBottom: 8 }}>
        <h1 style={{
          fontFamily: "var(--display)", fontSize: 74, color: "#FEF4D6",
          margin: 0, letterSpacing: ".005em", lineHeight: 0.95,
          textShadow: "0 3px 0 #2a1a0e, 0 7px 22px rgba(0,0,0,.5)",
        }}>Myci</h1>
        <p style={{
          fontFamily: "'Cutive', serif", fontSize: 17, color: "#E8DCC8",
          margin: "18px auto 0", maxWidth: 320, lineHeight: 1.5,
        }}>
          {t("landing.tagline1")}<br />{t("landing.tagline2")}
        </p>
      </div>

      <div style={{ position: "relative", width: "100%", padding: "0 28px 40px", boxSizing: "border-box" }}>
        <Btn full icon="sparkle" onClick={onJoin} style={{ fontSize: 17, padding: "16px" }}>
          {t("landing.join")}
        </Btn>

        {/* Guest path — judges & curious neighbors can look around with no account */}
        {onGuest && (
          <button onClick={onGuest} style={{
            width: "100%", marginTop: 12, padding: "13px", cursor: "pointer",
            background: "#FEF4D610", border: "1px solid #ffffff2e", borderRadius: 12,
            color: "#E8DCC8", fontFamily: "'Cutive', serif", fontSize: 15,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <Icon name="binoculars" size={17} style={{ color: "#D6AD08" }} /> {t("landing.guest")}
          </button>
        )}

        {onSignIn && (
          <button onClick={onSignIn} style={{
            display: "block", margin: "14px auto 0", background: "none", border: "none", cursor: "pointer",
            fontFamily: "'Cutive', serif", fontSize: 14.5, color: "#E8DCC8", minHeight: 44,
          }}>
            {t("landing.signin")}
          </button>
        )}

        <p style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 10.5, color: "#b79a6e", textAlign: "center", marginTop: 10 }}>
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
  return (
    <p style={{ fontFamily: "'Cutive', serif", fontSize: 10.5, color: "#9a8260", textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>
      {t("legal.agreePre")}{" "}
      <a href="/terms" target="_blank" rel="noopener noreferrer" style={link}>{t("legal.terms")}</a>{" "}
      {t("legal.and")}{" "}
      <a href="/privacy" target="_blank" rel="noopener noreferrer" style={link}>{t("legal.privacy")}</a>.
    </p>
  );
}

// ---- Onboarding: Location → What can you give? → What are you curious about? ----
const GIVE_CHIPS = ["Cooking", "Gardening", "Tools to lend", "Repairs", "Childcare", "Rides", "Teaching", "Spare produce", "Carpentry", "A spare hour", "Music", "Sewing"];
const CURIOUS_CHIPS = ["Woodworking", "Bread baking", "Bike repair", "Painting", "Composting", "A new language", "Foraging", "Pottery", "Beekeeping", "Knitting"];

function OnboardingScreen({ onDone }) {
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const [give, setGive] = useState(["Spare produce", "A spare hour"]);
  const [curious, setCurious] = useState(["Woodworking"]);
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
            <div style={{ marginTop: 24 }}>
              <FakeField icon="map-pin" label={t("ob.neighborhood")} value="Fernwood" />
              <FakeField icon="city" label={t("ob.city")} value="Riverside" />
              <div style={{
                marginTop: 16, borderRadius: 14, overflow: "hidden", height: 150, position: "relative",
                border: "1px solid #ffffff14",
              }}>
                <MiniMapField />
              </div>
            </div>
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
            <ChipField options={CURIOUS_CHIPS} selected={curious} onToggle={(v) => toggle(curious, setCurious, v)} tone="#8CA679" />
          </div>
        )}
      </div>

      <div style={{ padding: "12px 28px 40px", position: "relative", display: "flex", gap: 12, alignItems: "center" }}>
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} style={{
            background: "none", border: "none", cursor: "pointer", color: "#b79a6e",
            fontFamily: "'Cutive', serif", fontSize: 15, padding: "10px 4px",
          }}>{t("common.back")}</button>
        )}
        <div style={{ flex: 1 }} />
        <Btn icon={step === 2 ? "check" : "arrow-right"}
          onClick={() => (step === 2 ? onDone({ give, curious }) : setStep(step + 1))}>
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
function Sub({ children }) {
  return <p style={{ fontFamily: "'Cutive', serif", fontSize: 14.5, color: "#c4ab83", margin: "12px 0 0", lineHeight: 1.5 }}>{children}</p>;
}
function FakeField({ icon, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#FEF4D610", border: "1px solid #ffffff16", borderRadius: 12, padding: "13px 15px", marginBottom: 11 }}>
      <Icon name={icon} size={18} style={{ color: "var(--accent)" }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 9.5, letterSpacing: ".14em", color: "#9a7a52", textTransform: "uppercase" }}>{label}</div>
        <div style={{ fontFamily: "'Cutive', serif", fontSize: 16, color: "#FEF4D6", marginTop: 1 }}>{value}</div>
      </div>
      <Icon name="caret-down" weight="bold" size={14} style={{ color: "#9a7a52" }} />
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
            border: on ? "none" : "1px solid #ffffff22",
            boxShadow: on ? "0 2px 6px rgba(30,16,6,.3)" : "none",
            transition: "all .12s",
          }}>{on ? "✓ " : ""}{o}</button>
        );
      })}
    </div>
  );
}

// a tiny static mycelium-on-soil map used in onboarding
function MiniMapField() {
  const { t } = useI18n();
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(130% 100% at 40% 20%, #6f5436, #4a3722)" }}>
      <Grain opacity={0.1} />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {[[20,30,55,45],[55,45,80,28],[55,45,46,76],[46,76,24,84],[80,28,83,55]].map((e, i) => (
          <path key={i} d={threadPath(e[0], e[1], e[2], e[3], i + 2)} fill="none" stroke="#D6AD08" strokeOpacity={0.4} strokeWidth={0.5} />
        ))}
        {[[20,30],[55,45],[80,28],[46,76],[24,84],[83,55]].map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={i === 1 ? 2.6 : 1.6} fill={i === 1 ? "#D6AD08" : "#E8DCC8"} />
        ))}
      </svg>
      <div style={{ position: "absolute", left: "55%", top: "45%", transform: "translate(-50%,-160%)", fontFamily: "'Cutive Mono', monospace", fontSize: 9, color: "#FEF4D6", background: "#2a1a0eaa", padding: "2px 6px", borderRadius: 4 }}>{t("ob.youRoughly")}</div>
    </div>
  );
}

Object.assign(window, { LandingScreen, OnboardingScreen, MyceliumBloom, LegalLine });
