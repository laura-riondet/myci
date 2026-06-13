// myci-screens-detail.jsx — Post detail, Compose, Profile, Messages, Thread, Notifications, Settings

function ScreenHeader({ title, onBack, tone = "#472C1C", right, left }) {
  const leftEl = left !== undefined ? left : (onBack ? (
    <button onClick={onBack} style={{ position: "relative", background: "#FEF4D612", border: "1px solid #ffffff20", borderRadius: 10, width: 38, height: 38, cursor: "pointer", display: "grid", placeItems: "center", flexShrink: 0 }}>
      <Icon name="arrow-left" weight="bold" size={17} style={{ color: "#FEF4D6" }} />
    </button>
  ) : <div style={{ width: 38, flexShrink: 0 }} />);
  return (
    <div style={{ background: tone, padding: "52px 14px 12px", position: "relative", flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
      <Grain opacity={0.07} />
      {leftEl}
      <div style={{ flex: 1, position: "relative", fontFamily: "'Cutive', serif", fontSize: 15, color: "#FEF4D6", textAlign: "center" }}>{title}</div>
      <div style={{ position: "relative", display: "flex", justifyContent: "flex-end", gap: 8, minWidth: 38 }}>{right}</div>
    </div>
  );
}

function HeaderIconBtn({ icon, onClick, dot }) {
  return (
    <button onClick={onClick} style={{ position: "relative", background: "#FEF4D612", border: "1px solid #ffffff20", borderRadius: 10, width: 38, height: 38, cursor: "pointer", display: "grid", placeItems: "center", flexShrink: 0 }}>
      <Icon name={icon} weight="bold" size={17} style={{ color: "#FEF4D6" }} />
      {dot && <span style={{ position: "absolute", top: 7, right: 8, width: 8, height: 8, borderRadius: "50%", background: "#D6AD08", border: "1.5px solid #472C1C" }} />}
    </button>
  );
}

// ---------- POST DETAIL ----------
function PostDetailScreen({ post, onBack, onReachOut, onOpenProfile }) {
  const author = NEIGHBOR_BY_ID[post.authorId];
  const ty = POST_TYPES[post.type];
  const event = post.type === "event";
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: "#EADFCB" }}>
      <ScreenHeader title={post.typeLabel} onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 18px 120px", position: "relative" }}>
        <Grain opacity={0.04} />
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <Sticker icon={post.icon} tone={ty.tone} ink={ty.ink} size={66} variant="blob" outline={event} />
            <div style={{ flex: 1, paddingTop: 2 }}>
              <TypeTag type={post.type} />
              <h1 style={{ fontFamily: "'Trocchi', serif", fontWeight: 400, fontSize: 25, color: "#2A1A0E", margin: "9px 0 0", lineHeight: 1.16, textWrap: "balance" }}>{post.title}</h1>
            </div>
          </div>

          <button onClick={() => onOpenProfile(author.id)} style={{ marginTop: 18, width: "100%", display: "flex", alignItems: "center", gap: 12, background: "#fff5", border: "1px solid #472c1c1a", borderRadius: 14, padding: "11px 13px", cursor: "pointer" }}>
            <Avatar person={author} size={42} />
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ fontFamily: "'Trocchi', serif", fontSize: 16, color: "#2A1A0E" }}>{author.name}</div>
              <div style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 10, color: "#9a7a52", marginTop: 2 }}>here {author.here} · gave {author.gave} · asked {author.asked}</div>
            </div>
            <Icon name="caret-right" weight="bold" size={15} style={{ color: "#9a7a52" }} />
          </button>

          {post.photo && <div style={{ marginTop: 16 }}><PhotoSlot label={`photo — ${post.photo}`} height={170} /></div>}

          <p style={{ fontFamily: "'Trocchi', serif", fontSize: 15.5, lineHeight: 1.6, color: "#3f2f1f", margin: "18px 0 0" }}>{post.body}</p>

          <div style={{ display: "flex", gap: 7, marginTop: 16, flexWrap: "wrap" }}>
            {post.tags.map((tg) => <Tag key={tg}>{tg}</Tag>)}
          </div>

          <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <InfoCell icon="map-pin" label="Distance" value={post.distance} />
            <InfoCell icon="eye" label="Shared with" value={post.visibility} />
            <InfoCell icon="clock" label="Posted" value={post.when} />
            <InfoCell icon="handshake" label="In return" value={post.accept} />
          </div>
        </div>
      </div>

      {/* sticky CTA */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "14px 18px 26px", background: "linear-gradient(180deg, transparent, #EADFCB 26%)" }}>
        <Btn full icon="chat-circle" kind={post.type === "request" || post.type === "mutual_aid" ? "sage" : "primary"} onClick={() => onReachOut(post)}>
          {ctaFor(post.type)} — message {author.first}
        </Btn>
      </div>
    </div>
  );
}

function InfoCell({ icon, label, value }) {
  return (
    <div style={{ background: "#fff6", border: "1px solid #472c1c14", borderRadius: 12, padding: "10px 12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Icon name={icon} size={13} style={{ color: "#B27500" }} />
        <span style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "#9a7a52" }}>{label}</span>
      </div>
      <div style={{ fontFamily: "'Cutive', serif", fontSize: 13.5, color: "#2A1A0E", marginTop: 4, lineHeight: 1.2 }}>{value}</div>
    </div>
  );
}

// ---------- COMPOSE ----------
const COMPOSE_TYPES = [
  { type: "offer", icon: "gift", label: "Offer" },
  { type: "request", icon: "hand-palm", label: "Request" },
  { type: "skill_share", icon: "student", label: "Skill Share" },
  { type: "barter", icon: "arrows-left-right", label: "Barter" },
  { type: "event", icon: "fire", label: "Event" },
  { type: "mutual_aid", icon: "handshake", label: "Mutual Aid" },
];
const COMPOSE_PROMPTS = {
  offer: "What do you have to give, share, or lend?",
  request: "What do you need a hand with?",
  skill_share: "What could you teach a neighbor?",
  barter: "What would you like to trade, and for what?",
  event: "What's happening, and when?",
  mutual_aid: "What can you offer — and what would you need back?",
};

function ComposeScreen({ onBack, onPosted }) {
  const [type, setType] = useState("offer");
  const [title, setTitle] = useState("");
  const [done, setDone] = useState(false);
  const ty = POST_TYPES[type];

  if (done) {
    return (
      <div style={{ position: "absolute", inset: 0, background: "#472C1C", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 30, textAlign: "center" }}>
        <Grain opacity={0.08} />
        <div style={{ position: "relative", width: 90, height: 90, marginBottom: 6 }}><MyceliumBloom play={true} /></div>
        <h2 style={{ fontFamily: "'Trocchi', serif", fontWeight: 400, fontSize: 24, color: "#FEF4D6", margin: "6px 0 0", position: "relative" }}>You've seeded the Commons</h2>
        <p style={{ fontFamily: "'Cutive', serif", fontSize: 14.5, color: "#c4ab83", margin: "10px 0 24px", maxWidth: 250, position: "relative", lineHeight: 1.5 }}>Your post is live in {NEIGHBORHOOD}. When a neighbor takes you up on it, a new thread will grow on the map.</p>
        <Btn icon="arrow-left" kind="ghost" onClick={onPosted} style={{ position: "relative" }}>Back to the Commons</Btn>
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: "#EADFCB" }}>
      <ScreenHeader title="Share something" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 18px 30px", position: "relative" }}>
        <Grain opacity={0.04} />
        <div style={{ position: "relative" }}>
          <FieldLabel>What kind of post?</FieldLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 9, marginTop: 10 }}>
            {COMPOSE_TYPES.map((c) => {
              const on = c.type === type;
              const cty = POST_TYPES[c.type];
              return (
                <button key={c.type} onClick={() => setType(c.type)} style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 7, cursor: "pointer",
                  padding: "13px 6px", borderRadius: 13, border: on ? `2px solid ${cty.tone}` : "1px solid #472c1c1f",
                  background: on ? "#fff8" : "#fff4",
                }}>
                  <Sticker icon={c.icon} tone={cty.tone} ink={cty.ink} size={40} variant="blob" outline={c.type === "event"} />
                  <span style={{ fontFamily: "'Cutive', serif", fontSize: 12, color: "#2A1A0E" }}>{c.label}</span>
                </button>
              );
            })}
          </div>

          <FieldLabel style={{ marginTop: 22 }}>Title</FieldLabel>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={COMPOSE_PROMPTS[type]}
            style={inputStyle} />

          <FieldLabel style={{ marginTop: 18 }}>Tell your neighbors more</FieldLabel>
          <textarea rows={4} placeholder="A sentence or two — warm and specific works best." style={{ ...inputStyle, resize: "none", lineHeight: 1.5 }} />

          <FieldLabel style={{ marginTop: 18 }}>Add a photo (optional)</FieldLabel>
          <div style={{ marginTop: 8 }}><PhotoSlot label="tap to add a photo" height={92} /></div>

          <FieldLabel style={{ marginTop: 18 }}>What would you accept in return?</FieldLabel>
          <div style={{ display: "flex", gap: 8, marginTop: 9, flexWrap: "wrap" }}>
            {["Nothing — a gift", "Anything you like", "Something specific"].map((o, i) => (
              <Pill key={o} on={i === 0}>{o}</Pill>
            ))}
          </div>

          <FieldLabel style={{ marginTop: 18 }}>Who can see this?</FieldLabel>
          <div style={{ display: "flex", gap: 8, marginTop: 9 }}>
            {["My block", "My neighborhood", "My city"].map((o, i) => (
              <Pill key={o} on={i === 1}>{o}</Pill>
            ))}
          </div>

          <div style={{ marginTop: 26 }}>
            <Btn full icon="sparkle" onClick={() => setDone(true)}>Post to the Commons</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldLabel({ children, style = {} }) {
  return <div style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 10.5, letterSpacing: ".12em", textTransform: "uppercase", color: "#8a6f4a", ...style }}>{children}</div>;
}
const inputStyle = {
  width: "100%", boxSizing: "border-box", marginTop: 9, padding: "13px 14px",
  borderRadius: 12, border: "1px solid #472c1c26", background: "#FBF4E2",
  fontFamily: "'Trocchi', serif", fontSize: 15, color: "#2A1A0E", outline: "none",
  boxShadow: "inset 0 2px 4px rgba(30,16,6,.08)",
};
function Pill({ children, on }) {
  const [active, setActive] = useState(on);
  return (
    <button onClick={() => setActive((v) => !v)} style={{
      fontFamily: "'Cutive', serif", fontSize: 13, cursor: "pointer", padding: "8px 13px", borderRadius: 20,
      background: active ? "var(--accent)" : "#fff5", color: active ? "#3A2410" : "#6a5238",
      border: active ? "none" : "1px solid #472c1c22",
    }}>{children}</button>
  );
}

// ---------- PROFILE ----------
// Ego network: this person in the centre, everyone they've exchanged with orbiting.
function EgoNetwork({ person, exchanges, perspective }) {
  const map = {};
  exchanges.forEach((e) => {
    if (e.a !== person.id && e.b !== person.id) return;
    const otherId = e.a === person.id ? e.b : e.a;
    const dir = perspective(e);
    if (!map[otherId]) map[otherId] = { id: otherId, count: 0, dirs: {} };
    map[otherId].count++;
    map[otherId].dirs[dir] = (map[otherId].dirs[dir] || 0) + 1;
  });
  const partners = Object.values(map).map((p) => ({ ...p, person: NEIGHBOR_BY_ID[p.id] })).filter((p) => p.person);
  const c = partners.length;
  const caption = person.you
    ? (c === 0 ? "Plant your first thread to begin."
      : c <= 2 ? "Your mycelium is taking root…"
      : c <= 4 ? "Your mycelium network is growing…"
      : "You're well connected :)")
    : (c === 0 ? `${person.first} hasn't woven any threads yet.`
      : `${person.first} is woven to ${c} neighbour${c === 1 ? "" : "s"}.`);

  const R = 35;
  const pos = (i) => {
    const ang = (-90 + (i * 360) / Math.max(c, 1)) * Math.PI / 180;
    return { x: 50 + R * Math.cos(ang), y: 50 + R * Math.sin(ang) };
  };
  const avSize = c > 8 ? 26 : 32;
  const dirIcon = (d) => d.traded ? "arrows-left-right" : (d.gave && !d.received) ? "arrow-up" : (d.received && !d.gave) ? "arrow-down" : "arrows-left-right";
  const dirTone = (d) => d.traded ? "#C26A2B" : (d.gave && !d.received) ? "#D6AD08" : (d.received && !d.gave) ? "#8CA679" : "#C26A2B";

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 11 }}>
        <Icon name="graph" size={16} style={{ color: "#B27500" }} />
        <h3 style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "#5a4329", margin: 0 }}>{person.you ? "Your network" : `${person.first}'s network`}</h3>
      </div>
      <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 1", maxHeight: 300, borderRadius: 18, overflow: "hidden", background: "radial-gradient(circle at 50% 50%, #4a3724, #2e2016)", border: "1px solid #472c1c33", boxShadow: "inset 0 2px 10px rgba(0,0,0,.4)" }}>
        <Grain opacity={0.09} />
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
          {partners.map((p, i) => {
            const q = pos(i);
            return <path key={p.id} d={threadPath(50, 50, q.x, q.y, i + 2)} fill="none" stroke="#D6AD08" strokeOpacity={0.5} strokeWidth={0.55} strokeLinecap="round"
              style={{ strokeDasharray: 130, animation: `growThread 1s ease ${0.1 + i * 0.07}s both` }} />;
          })}
        </svg>
        {partners.map((p, i) => {
          const q = pos(i);
          return (
            <div key={p.id} style={{ position: "absolute", left: `${q.x}%`, top: `${q.y}%`, transform: "translate(-50%,-50%)", textAlign: "center" }}>
              <div style={{ position: "relative", display: "inline-block" }}>
                <Avatar person={p.person} size={avSize} ring />
                <span style={{ position: "absolute", right: -3, bottom: -3, width: 15, height: 15, borderRadius: "50%", background: dirTone(p.dirs), border: "1.5px solid #2e2016", display: "grid", placeItems: "center" }}>
                  <Icon name={dirIcon(p.dirs)} weight="bold" size={8} style={{ color: "#2A1A0E" }} />
                </span>
              </div>
              <div style={{ fontFamily: "'Cutive', serif", fontSize: 10, color: "#e8dcc8", marginTop: 4, whiteSpace: "nowrap" }}>{p.person.first}</div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", inset: -7, borderRadius: "50%", border: "2px solid #D6AD08", animation: "youPulse 2.6s ease-in-out infinite" }} />
            <Avatar person={person} size={c > 8 ? 42 : 48} ring />
          </div>
        </div>
        <div style={{ position: "absolute", left: 10, right: 10, bottom: 10, textAlign: "center" }}>
          <span style={{ fontFamily: "'Trocchi', serif", fontSize: 13.5, color: "#FEF4D6", background: "#2a1a0ecc", padding: "6px 13px", borderRadius: 20, display: "inline-block" }}>{caption}</span>
        </div>
      </div>
    </div>
  );
}

function ProfileScreen({ personId, exchanges, onBack, onOpenPost, onOpenSettings, onOpenNotifications }) {
  const n = NEIGHBOR_BY_ID[personId];
  const theirs = POSTS.filter((p) => p.authorId === n.id);
  const offers = theirs.filter((p) => p.type !== "request");
  const seeking = theirs.filter((p) => p.type === "request" || p.type === "mutual_aid");
  const history = exchanges.filter((e) => e.a === n.id || e.b === n.id);
  const thanks = history.slice(0, 3).map((e) => e.note).filter(Boolean);

  // direction of an exchange from this person's perspective
  const perspective = (e) => {
    if (e.dir === "traded") return "traded";
    const fromA = e.a === n.id ? e.dir : (e.dir === "gave" ? "received" : "gave");
    return fromA;
  };

  const headerRight = n.you
    ? <HeaderIconBtn icon="bell" onClick={onOpenNotifications} dot />
    : null;
  const headerLeft = n.you
    ? <HeaderIconBtn icon="gear-six" onClick={onOpenSettings} />
    : undefined;

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: "#EADFCB" }}>
      <ScreenHeader title={n.you ? "" : "Neighbor"} onBack={onBack} left={headerLeft} right={headerRight} />
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 110, position: "relative" }}>
        {/* identity band */}
        <div style={{ background: "linear-gradient(180deg,#472C1C,#3A2A1E)", padding: "18px 18px 22px", position: "relative" }}>
          <Grain opacity={0.08} />
          <div style={{ position: "relative", display: "flex", gap: 14, alignItems: "center" }}>
            <Avatar person={n} size={66} ring />
            <div>
              <h1 style={{ fontFamily: "'Trocchi', serif", fontWeight: 400, fontSize: 24, color: "#FEF4D6", margin: 0 }}>{n.name}{n.you ? "" : ""}</h1>
              <div style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 10.5, color: "#cbb085", marginTop: 4, letterSpacing: ".08em" }}>
                <Icon name="map-pin" weight="bold" size={11} style={{ verticalAlign: "-1px", marginRight: 3 }} />{NEIGHBORHOOD} · here {n.here}
              </div>
            </div>
          </div>
          {/* trust, shown not scored */}
          <div style={{ position: "relative", display: "flex", gap: 9, marginTop: 16 }}>
            <TrustCell big={n.gave} label="things given" tone="#D6AD08" />
            <TrustCell big={n.asked} label="times asked" tone="#8CA679" />
            <TrustCell big={history.length} label="threads" tone="#E8DCC8" />
          </div>
        </div>

        <div style={{ padding: "18px 18px 0", position: "relative" }}>
          <Grain opacity={0.04} />
          <div style={{ position: "relative" }}>
            <EgoNetwork person={n} exchanges={exchanges} perspective={perspective} />
            <Shelf title="Giving shelf" icon="gift" tone="#B27500">
              {offers.length ? offers.map((p) => <ShelfItem key={p.id} post={p} onOpen={() => onOpenPost(p.id)} />) : <Empty>Nothing on the shelf right now.</Empty>}
            </Shelf>
            <Shelf title="Seeking shelf" icon="binoculars" tone="#8CA679">
              {seeking.length ? seeking.map((p) => <ShelfItem key={p.id} post={p} onOpen={() => onOpenPost(p.id)} />) : <Empty>Not looking for anything at the moment.</Empty>}
            </Shelf>

            {thanks.length > 0 && (
              <Shelf title="Thank-you notes" icon="quotes" tone="#D6AD08">
                {thanks.map((tx, i) => (
                  <div key={i} style={{ background: "#fff6", border: "1px solid #472c1c14", borderRadius: 12, padding: "12px 14px", marginBottom: 9 }}>
                    <p style={{ fontFamily: "'Trocchi', serif", fontSize: 14, color: "#3f2f1f", margin: 0, lineHeight: 1.45 }}>“{tx}”</p>
                  </div>
                ))}
              </Shelf>
            )}

            <Shelf title="Exchange history" icon="path" tone="#5A3A24">
              {history.length ? history.map((e, i) => {
                const other = NEIGHBOR_BY_ID[e.a === n.id ? e.b : e.a];
                const dir = perspective(e);
                const meta = {
                  gave:     { label: n.you ? "You gave" : `${n.first} gave`, icon: "arrow-up", tone: "#B27500", bg: "#B2750020" },
                  received: { label: n.you ? "You received" : `${n.first} received`, icon: "arrow-down", tone: "#5e7a4c", bg: "#8CA67926" },
                  traded:   { label: "Traded", icon: "arrows-left-right", tone: "#C26A2B", bg: "#C26A2B22" },
                }[dir];
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 4px", borderBottom: i < history.length - 1 ? "1px solid #472c1c12" : "none" }}>
                    <Avatar person={other} size={32} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: meta.bg, color: meta.tone, fontFamily: "'Cutive Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", padding: "2px 6px 2px 5px", borderRadius: 5 }}>
                          <Icon name={meta.icon} weight="bold" size={10} /> {meta.label}
                        </span>
                        <span style={{ fontFamily: "'Cutive', serif", fontSize: 13.5, color: "#2A1A0E", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{other.name}</span>
                      </div>
                      <div style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 10, color: "#9a7a52", marginTop: 3 }}>{e.note} · {e.weeks === 0 ? "just now" : `${e.weeks}w ago`}</div>
                    </div>
                  </div>
                );
              }) : <Empty>No exchanges yet — the first thread is the hardest.</Empty>}
            </Shelf>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrustCell({ big, label, tone }) {
  return (
    <div style={{ flex: 1, background: "#FEF4D60f", border: "1px solid #ffffff18", borderRadius: 12, padding: "11px 8px", textAlign: "center" }}>
      <div style={{ fontFamily: "var(--display)", fontSize: 22, color: tone, lineHeight: 1 }}>{big}</div>
      <div style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 8.5, color: "#b79a6e", letterSpacing: ".08em", textTransform: "uppercase", marginTop: 5 }}>{label}</div>
    </div>
  );
}
function Shelf({ title, icon, tone, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 11 }}>
        <Icon name={icon} size={16} style={{ color: tone }} />
        <h3 style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "#5a4329", margin: 0 }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}
function ShelfItem({ post, onOpen }) {
  const ty = POST_TYPES[post.type];
  return (
    <button onClick={onOpen} style={{ width: "100%", display: "flex", alignItems: "center", gap: 11, background: "#fff6", border: "1px solid #472c1c14", borderRadius: 12, padding: "10px 12px", marginBottom: 9, cursor: "pointer" }}>
      <Sticker icon={post.icon} tone={ty.tone} ink={ty.ink} size={38} variant="blob" outline={post.type === "event"} />
      <div style={{ flex: 1, textAlign: "left" }}>
        <div style={{ fontFamily: "'Trocchi', serif", fontSize: 14.5, color: "#2A1A0E", lineHeight: 1.2 }}>{post.title}</div>
        <div style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 9.5, color: "#9a7a52", marginTop: 3 }}>{post.typeLabel} · {post.when}</div>
      </div>
      <Icon name="caret-right" weight="bold" size={14} style={{ color: "#9a7a52" }} />
    </button>
  );
}
function Empty({ children }) {
  return <p style={{ fontFamily: "'Cutive', serif", fontSize: 13.5, color: "#9a7a52", fontStyle: "italic", margin: "0 0 4px" }}>{children}</p>;
}

// ---------- MESSAGES ----------
function MessagesScreen({ convos, onOpenThread, onOpenNotifications }) {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: "#EADFCB" }}>
      <div style={{ background: "#472C1C", padding: "54px 18px 16px", position: "relative", flexShrink: 0 }}>
        <Grain opacity={0.08} />
        <div style={{ position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 10.5, letterSpacing: ".2em", color: "#D6AD08", textTransform: "uppercase" }}>Coordinating</div>
            <h1 style={{ fontFamily: "var(--display)", fontSize: 24, color: "#FEF4D6", margin: "3px 0 0" }}>Messages</h1>
          </div>
          <button onClick={onOpenNotifications} style={{ position: "relative", background: "#FEF4D612", border: "1px solid #ffffff20", borderRadius: 10, width: 38, height: 38, cursor: "pointer", display: "grid", placeItems: "center" }}>
            <Icon name="bell" size={17} style={{ color: "#FEF4D6" }} />
            <span style={{ position: "absolute", top: 7, right: 8, width: 8, height: 8, borderRadius: "50%", background: "#D6AD08", border: "1.5px solid #472C1C" }} />
          </button>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 14px 110px", position: "relative" }}>
        <Grain opacity={0.04} />
        <div style={{ position: "relative" }}>
          {convos.map((c) => {
            const n = NEIGHBOR_BY_ID[c.withId];
            const post = POST_BY_ID[c.postId];
            return (
              <button key={c.id} onClick={() => onOpenThread(c.id)} style={{ width: "100%", display: "flex", gap: 12, alignItems: "center", background: c.unread ? "#fff8" : "transparent", border: "1px solid #472c1c12", borderRadius: 14, padding: "12px 13px", marginBottom: 9, cursor: "pointer" }}>
                <Avatar person={n} size={46} />
                <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontFamily: "'Trocchi', serif", fontSize: 15.5, color: "#2A1A0E" }}>{n.name}</span>
                    {c.unread && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#B27500" }} />}
                  </div>
                  {post && <div style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 9.5, color: "#B27500", margin: "2px 0" }}>re: {post.title}</div>}
                  <div style={{ fontFamily: "'Cutive', serif", fontSize: 13, color: "#6a5238", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.thread[c.thread.length - 1].body}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------- THREAD ----------
function ThreadScreen({ convo, onBack, onComplete, completed }) {
  const n = NEIGHBOR_BY_ID[convo.withId];
  const post = POST_BY_ID[convo.postId];
  const [draft, setDraft] = useState("");
  const scrollRef = useRef(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [convo.thread.length]);

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: "#E3D5BC" }}>
      <ScreenHeader title={n.name} onBack={onBack} right={<Avatar person={n} size={34} />} />
      {post && (
        <div style={{ background: "#E0D2B8", borderBottom: "1px solid #472c1c1a", padding: "8px 16px", fontFamily: "'Cutive Mono', monospace", fontSize: 10.5, color: "#8a6f4a", flexShrink: 0 }}>
          re: {post.title}
        </div>
      )}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", position: "relative" }}>
        <Grain opacity={0.04} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 10 }}>
          {convo.thread.map((m, i) => {
            const mine = m.from === "you";
            return (
              <div key={i} style={{ alignSelf: mine ? "flex-end" : "flex-start", maxWidth: "78%" }}>
                <div style={{
                  fontFamily: "'Trocchi', serif", fontSize: 14.5, lineHeight: 1.45, padding: "10px 13px",
                  borderRadius: mine ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  background: mine ? "var(--accent)" : "#FBF4E2", color: mine ? "#3A2410" : "#2A1A0E",
                  boxShadow: "0 2px 4px rgba(30,16,6,.16)",
                }}>{m.body}</div>
                <div style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 9, color: "#9a7a52", marginTop: 3, textAlign: mine ? "right" : "left" }}>{m.when || "now"}</div>
              </div>
            );
          })}
          {completed && (
            <div style={{ alignSelf: "center", textAlign: "center", margin: "8px 0" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#8CA679", color: "#1c2614", fontFamily: "'Cutive', serif", fontSize: 12.5, padding: "7px 13px", borderRadius: 20 }}>
                <Icon name="check-circle" size={15} /> Exchange complete — a thread grew on the map
              </div>
            </div>
          )}
        </div>
      </div>

      {/* close-the-loop bar */}
      {!completed && (
        <div style={{ padding: "8px 14px 0", flexShrink: 0 }}>
          <button onClick={() => onComplete(convo)} style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer",
            background: "#8CA67925", border: "1.5px dashed #8CA679", borderRadius: 12, padding: "10px",
            fontFamily: "'Cutive', serif", fontSize: 13.5, color: "#4a6336",
          }}>
            <Icon name="plant" size={16} /> Done it? Close the loop & grow a thread
          </button>
        </div>
      )}

      {/* composer */}
      <div style={{ display: "flex", gap: 9, alignItems: "center", padding: "10px 14px 24px", flexShrink: 0 }}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="When works for you?"
          style={{ flex: 1, padding: "12px 14px", borderRadius: 22, border: "1px solid #472c1c22", background: "#FBF4E2", fontFamily: "'Trocchi', serif", fontSize: 14.5, outline: "none" }} />
        <button style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--accent)", border: "none", cursor: "pointer", display: "grid", placeItems: "center", boxShadow: "0 3px 0 #8a6f00" }}>
          <Icon name="paper-plane-tilt" size={18} style={{ color: "#3A2410" }} />
        </button>
      </div>
    </div>
  );
}

// ---------- NOTIFICATIONS ----------
function NotificationsScreen({ onBack, onOpenPost }) {
  const kinds = { response: "chat-circle", match: "sparkle", help: "hand-palm", thread: "plant", event: "fire" };
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: "#EADFCB" }}>
      <ScreenHeader title="Notifications" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px 30px", position: "relative" }}>
        <Grain opacity={0.04} />
        <div style={{ position: "relative" }}>
          {NOTIFICATIONS.map((nt) => {
            const who = NEIGHBOR_BY_ID[nt.whoId];
            return (
              <button key={nt.id} onClick={() => nt.postId && onOpenPost(nt.postId)} style={{ width: "100%", display: "flex", gap: 12, alignItems: "center", background: nt.unread ? "#fff8" : "transparent", border: "1px solid #472c1c12", borderRadius: 13, padding: "12px 13px", marginBottom: 8, cursor: nt.postId ? "pointer" : "default", textAlign: "left" }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#472C1C", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <Icon name={kinds[nt.kind]} size={17} style={{ color: "#D6AD08" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Trocchi', serif", fontSize: 14, color: "#2A1A0E", lineHeight: 1.35 }}>{nt.text}</div>
                  <div style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 9.5, color: "#9a7a52", marginTop: 3 }}>{nt.when}</div>
                </div>
                {nt.unread && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#B27500", flexShrink: 0 }} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------- SETTINGS ----------
function SettingsScreen({ onBack }) {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: "#EADFCB" }}>
      <ScreenHeader title="Settings" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px 40px", position: "relative" }}>
        <Grain opacity={0.04} />
        <div style={{ position: "relative" }}>
          <SettingsGroup title="Privacy">
            <ToggleRow label="Fuzz my location (±500m)" desc="Never show a precise pin" on />
            <SelectRow label="Profile visible to" value="My neighborhood" />
            <ToggleRow label="Show me on the map" desc="Opt in to an approximate node" on />
          </SettingsGroup>
          <SettingsGroup title="Notifications">
            <ToggleRow label="Someone responds to my post" on />
            <ToggleRow label="New offers that match me" on />
            <ToggleRow label="Requests I could help with" />
            <ToggleRow label="Weekly neighborhood digest" desc="A quiet Sunday email" on />
          </SettingsGroup>
          <SettingsGroup title="Account">
            <LinkRow label="Blocked neighbors" icon="prohibit" />
            <LinkRow label="Export my data" icon="download-simple" />
            <LinkRow label="Delete account" icon="trash" danger />
          </SettingsGroup>
          <p style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 10, color: "#9a7a52", textAlign: "center", marginTop: 22 }}>Myci · disputes handled by a real human · v0.1</p>
        </div>
      </div>
    </div>
  );
}
function SettingsGroup({ title, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "#8a6f4a", marginBottom: 9 }}>{title}</div>
      <div style={{ background: "#fff6", border: "1px solid #472c1c14", borderRadius: 14, overflow: "hidden" }}>{children}</div>
    </div>
  );
}
function ToggleRow({ label, desc, on = false }) {
  const [v, setV] = useState(on);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", borderBottom: "1px solid #472c1c0e" }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Cutive', serif", fontSize: 14.5, color: "#2A1A0E" }}>{label}</div>
        {desc && <div style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 9.5, color: "#9a7a52", marginTop: 2 }}>{desc}</div>}
      </div>
      <button onClick={() => setV((x) => !x)} style={{ width: 46, height: 27, borderRadius: 14, border: "none", cursor: "pointer", background: v ? "#8CA679" : "#472c1c2a", position: "relative", transition: "background .15s", flexShrink: 0 }}>
        <span style={{ position: "absolute", top: 3, left: v ? 22 : 3, width: 21, height: 21, borderRadius: "50%", background: "#FEF4D6", transition: "left .15s", boxShadow: "0 1px 3px rgba(0,0,0,.3)" }} />
      </button>
    </div>
  );
}
function SelectRow({ label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", borderBottom: "1px solid #472c1c0e" }}>
      <div style={{ flex: 1, fontFamily: "'Cutive', serif", fontSize: 14.5, color: "#2A1A0E" }}>{label}</div>
      <span style={{ fontFamily: "'Cutive', serif", fontSize: 13.5, color: "#B27500" }}>{value}</span>
      <Icon name="caret-down" weight="bold" size={13} style={{ color: "#9a7a52" }} />
    </div>
  );
}
function LinkRow({ label, icon, danger }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", borderBottom: "1px solid #472c1c0e", cursor: "pointer" }}>
      <Icon name={icon} size={17} style={{ color: danger ? "#a52339" : "#6a5238" }} />
      <div style={{ flex: 1, fontFamily: "'Cutive', serif", fontSize: 14.5, color: danger ? "#a52339" : "#2A1A0E" }}>{label}</div>
      <Icon name="caret-right" weight="bold" size={13} style={{ color: "#9a7a52" }} />
    </div>
  );
}

Object.assign(window, {
  PostDetailScreen, ComposeScreen, ProfileScreen, MessagesScreen,
  ThreadScreen, NotificationsScreen, SettingsScreen,
});
