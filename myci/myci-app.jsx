// myci-app.jsx — router, chrome (status bar, bottom nav, FAB), exchange-growth flow, transitions, Tweaks

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "postCard": "pinned",
  "sticker": "blob",
  "accent": "#D6AD08",
  "grain": true
}/*EDITMODE-END*/;

const REACH_PREFILL = {
  offer: (n) => `Hi ${n.first}! I'd love to take you up on this — when's a good time?`,
  request: (n) => `Hi ${n.first}, I can help with this. When works for you?`,
  skill_share: (n) => `Hi ${n.first}! I'd really like to learn this. I'm free most evenings.`,
  barter: (n) => `Hi ${n.first} — I'd love to trade. Here's what I could offer in return…`,
  event: (n) => `Hi ${n.first}! Count me in. Anything I can bring?`,
  mutual_aid: (n) => `Hi ${n.first}, I'd be glad to help. Tell me what you need.`,
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const i18n = useI18n();
  const tr = i18n.t;
  const auth = useAuth();
  const [view, setView] = useState({ screen: "landing", anim: "fade", seq: 0 });
  const histRef = useRef([]);
  const seqRef = useRef(0);
  const [exchanges, setExchanges] = useState(SEED_EXCHANGES);
  const [convos, setConvos] = useState(MESSAGES);
  const [completed, setCompleted] = useState({});
  const [toast, setToast] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", t.accent);
  }, [t.accent]);

  // Handle the magic-link return (api/auth/verify redirects to /app?auth=…).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const a = params.get("auth");
    if (!a) return;
    if (a === "ok") {
      auth.refresh().then(() => {
        DataService.auth.me().then((u) => flash(tr("auth.welcome", { name: (u && u.name) || "" })));
      });
      tab("feed");
    } else if (a === "expired") flash(tr("auth.expired"));
    else if (a === "error") flash(tr("auth.error"));
    // strip the query so a refresh doesn't re-trigger
    window.history.replaceState({}, "", window.location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A gate for actions that need a signed-in neighbor. Returns true if allowed;
  // otherwise routes to sign-in with a contextual reason and returns false.
  function requireAuth(reason) {
    if (auth.user) return true;
    go("signin", { reason }, "modal");
    return false;
  }

  function nav(next, anim) { seqRef.current += 1; setView({ ...next, anim, seq: seqRef.current }); }
  function go(screen, params = {}, anim = "push") { histRef.current.push(view); nav({ screen, ...params }, anim); }
  function back() { const p = histRef.current.pop(); nav(p || { screen: "feed" }, "pop"); }
  function tab(screen, params = {}) { histRef.current = []; nav({ screen, ...params }, "fade"); }

  function flash(msg) { setToast(msg); clearTimeout(flash._t); flash._t = setTimeout(() => setToast(null), 2600); }

  function reachOut(post) {
    if (!requireAuth(tr("post.reachOut"))) return;
    const n = NEIGHBOR_BY_ID[post.authorId];
    let convo = convos.find((c) => c.withId === post.authorId && c.postId === post.id);
    if (!convo) {
      convo = {
        id: "c_" + post.id, postId: post.id, withId: post.authorId, unread: false,
        thread: [{ from: "you", body: (REACH_PREFILL[post.type] || REACH_PREFILL.offer)(n), when: "now" }],
      };
      setConvos((cs) => [convo, ...cs]);
    }
    go("thread", { threadId: convo.id });
  }

  function completeExchange(convo) {
    if (completed[convo.id]) return;
    const post = POST_BY_ID[convo.postId];
    const note = post ? post.title : "A neighborly exchange";
    const dir = !post ? "traded"
      : (post.type === "request" || post.type === "mutual_aid") ? "gave"
      : post.type === "barter" ? "traded" : "received";
    setCompleted((c) => ({ ...c, [convo.id]: true }));
    setExchanges((xs) => [...xs, ex("you", convo.withId, 0, note, dir)]);
    flash("A new thread grew on the map");
    setTimeout(() => tab("map"), 950);
  }

  const currentConvo = view.threadId ? convos.find((c) => c.id === view.threadId) : null;
  const s = view.screen;
  const mainTabs = ["feed", "map", "messages"];
  const showChrome = mainTabs.includes(s) || (s === "profile" && view.personId === "you");
  const openNotifs = () => go("notifications");
  const startCompose = () => { if (requireAuth(tr("compose.signInFirst"))) go("compose", {}, "modal"); };

  return (
    <div className={t.grain ? "" : "grainoff"} dir={i18n.dir} style={{ position: "absolute", inset: 0, overflow: "hidden", fontFamily: "'Trocchi', serif" }}>
      {/* status bar — hidden on the landing hero for a clean first impression */}
      {s !== "landing" && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 30, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", pointerEvents: "none" }}>
          <span style={{ fontFamily: "'Cutive', serif", fontSize: 13, color: "#FEF4D6", fontWeight: 600 }}>9:41</span>
          <span style={{ display: "flex", gap: 6, alignItems: "center", color: "#FEF4D6" }}>
            <Icon name="cell-signal-full" size={13} /><Icon name="wifi-high" size={13} /><Icon name="battery-high" size={15} />
          </span>
        </div>
      )}

      {/* animated screen container — re-keys on each navigation */}
      <div key={view.seq} className={`screen-anim anim-${view.anim}`} style={{ position: "absolute", inset: 0 }}>
        {s === "landing" && <LandingScreen onJoin={() => nav({ screen: "onboarding" }, "fade")} onSignIn={() => go("signin", {}, "modal")} onGuest={() => tab("feed")} />}
        {s === "onboarding" && <OnboardingScreen onDone={() => tab("feed")} />}
        {s === "feed" && <FeedScreen t={t} onOpen={(p) => go("post", { post: p })} onOpenNotifications={openNotifs} onSheet={setSheetOpen} />}
        {s === "map" && <MapScreen t={t} exchanges={exchanges} onOpenProfile={(id) => go("profile", { personId: id })} onOpenPost={(id) => go("post", { post: POST_BY_ID[id] })} onOpenNotifications={openNotifs} />}
        {s === "post" && <PostDetailScreen post={view.post} onBack={back} onReachOut={reachOut} onOpenProfile={(id) => go("profile", { personId: id })} />}
        {s === "compose" && <ComposeScreen onBack={back} onPosted={() => tab("feed")} />}
        {s === "profile" && <ProfileScreen personId={view.personId} exchanges={exchanges} onBack={view.personId === "you" ? null : back} onOpenPost={(id) => go("post", { post: POST_BY_ID[id] })} onOpenSettings={() => go("settings")} onOpenNotifications={openNotifs} />}
        {s === "messages" && <MessagesScreen convos={convos} onOpenThread={(id) => go("thread", { threadId: id })} onOpenNotifications={openNotifs} />}
        {s === "thread" && currentConvo && <ThreadScreen convo={currentConvo} onBack={back} onComplete={completeExchange} completed={!!completed[currentConvo.id]} />}
        {s === "notifications" && <NotificationsScreen onBack={back} onOpenPost={(id) => go("post", { post: POST_BY_ID[id] })} />}
        {s === "settings" && <SettingsScreen onBack={back} />}
        {s === "signin" && <SignInScreen onBack={back} reason={view.reason} />}
      </div>

      {/* bottom nav + FAB */}
      {showChrome && !sheetOpen && <BottomNav active={s === "profile" ? "you" : s} onTab={tab} onCompose={startCompose} />}

      {/* toast */}
      {toast && (
        <div style={{ position: "absolute", left: "50%", bottom: 96, transform: "translateX(-50%)", zIndex: 80, display: "flex", alignItems: "center", gap: 9, background: "#8CA679", color: "#1c2614", fontFamily: "'Cutive', serif", fontSize: 14, padding: "11px 18px", borderRadius: 24, boxShadow: "0 8px 20px rgba(0,0,0,.4)", animation: "toastIn .3s ease", whiteSpace: "nowrap" }}>
          <Icon name="plant" size={18} /> {toast}
        </div>
      )}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Post cards" />
        <TweakRadio label="Card style" value={t.postCard} options={["pinned", "ticket", "parchment"]} onChange={(v) => setTweak("postCard", v)} />
        <TweakRadio label="Stickers" value={t.sticker} options={["blob", "stamp", "tag"]} onChange={(v) => setTweak("sticker", v)} />
        <TweakSection label="Material" />
        <TweakColor label="Accent" value={t.accent} options={["#D6AD08", "#B27500", "#8CA679", "#C26A2B"]} onChange={(v) => setTweak("accent", v)} />
        <TweakToggle label="Paper grain" value={t.grain} onChange={(v) => setTweak("grain", v)} />
      </TweaksPanel>
    </div>
  );
}

function BottomNav({ active, onTab, onCompose }) {
  const { t: tr } = useI18n();
  const items = [
    { id: "feed", icon: "scroll", label: tr("nav.commons") },
    { id: "map", icon: "compass", label: tr("nav.map") },
    { id: "compose", icon: "plus", label: tr("nav.share"), fab: true },
    { id: "messages", icon: "chat-circle", label: tr("nav.messages") },
    { id: "you", icon: "user", label: tr("nav.me") },
  ];
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 50, background: "linear-gradient(180deg,#3A2A1E,#2e2016)", borderTop: "1px solid #ffffff12", padding: "9px 12px 24px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: `url("${GRAIN_URL}")`, backgroundSize: "160px 160px", opacity: 0.06, mixBlendMode: "overlay", pointerEvents: "none" }} className="om-grain" />
      {items.map((it) => {
        if (it.fab) {
          return (
            <button key={it.id} onClick={onCompose} className="fab-btn" style={{ position: "relative", width: 58, height: 58, marginTop: -26, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #f2c94c, #D6AD08)", border: "3px solid #2e2016", cursor: "pointer", display: "grid", placeItems: "center", boxShadow: "0 5px 14px rgba(214,173,8,.45), 0 3px 0 #8a6f00" }}>
              <Icon name="plus" weight="bold" size={26} style={{ color: "#3A2410" }} />
            </button>
          );
        }
        const on = active === it.id;
        return (
          <button key={it.id} onClick={() => onTab(it.id === "you" ? "profile" : it.id, it.id === "you" ? { personId: "you" } : {})} className="nav-item" style={{ position: "relative", flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 0" }}>
            <Icon name={it.icon} weight={on ? "fill" : "regular"} size={21} style={{ color: on ? "#D6AD08" : "#9a8260", transform: on ? "translateY(-1px) scale(1.08)" : "none", transition: "transform .18s, color .18s" }} />
            <span style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 8.5, letterSpacing: ".04em", color: on ? "#E8DCC8" : "#7a6244", textTransform: "uppercase" }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("app")).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
