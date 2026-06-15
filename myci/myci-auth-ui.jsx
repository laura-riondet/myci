// myci-auth-ui.jsx — passwordless sign-in screen + auth context.
//
// Reading the Commons is public; posting / reaching out requires a session.
// The session cookie is httpOnly (set by api/auth/verify), so this UI only ever
// holds the public user object from /api/auth/me — never a token.

const AuthContext = React.createContext(null);

function AuthProvider({ children }) {
  // undefined = still checking, null = signed out, object = signed in
  const [user, setUser] = React.useState(undefined);

  const refresh = React.useCallback(() => DataService.auth.me().then(setUser), []);
  React.useEffect(() => { refresh(); }, [refresh]);

  const signOut = React.useCallback(
    () => DataService.auth.logout().then(() => { setUser(null); return true; }),
    []
  );

  const value = { user: user || null, loading: user === undefined, setUser, refresh, signOut };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  return React.useContext(AuthContext) || { user: null, loading: false, refresh: () => {}, signOut: () => {} };
}

// ── Sign-in screen ────────────────────────────────────────────────────────────
function SignInScreen({ onBack, reason }) {
  const { t } = useI18n();
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState("idle"); // idle | sending | sent | error
  const [devLink, setDevLink] = React.useState(null);
  const [errMsg, setErrMsg] = React.useState("");

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  function submit() {
    if (!valid || status === "sending") return;
    setStatus("sending"); setErrMsg("");
    DataService.auth.requestLink(email.trim())
      .then((res) => { setDevLink(res.devLink || null); setStatus("sent"); })
      .catch((e) => { setErrMsg(e.message || t("auth.error")); setStatus("error"); });
  }

  return (
    <div style={{
      position: "absolute", inset: 0, display: "flex", flexDirection: "column",
      overflow: "hidden", color: "#FBF3DE",
      background:
        "radial-gradient(80% 60% at 18% 8%, rgba(30,138,128,.34) 0%, transparent 55%)," +
        "radial-gradient(70% 60% at 92% 96%, rgba(210,106,58,.30) 0%, transparent 55%)," +
        "radial-gradient(110% 90% at 50% 40%, #3C2517 0%, #2E1B11 60%, #20120A 100%)",
    }}>
      {/* same living network + veil as the landing, so sign-in feels like one world */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
        <MyceliumNet />
      </div>
      <div aria-hidden style={{
        position: "absolute", left: "50%", top: "47%", transform: "translate(-50%,-50%)",
        width: 640, height: 540, pointerEvents: "none",
        background: "radial-gradient(ellipse 46% 42% at 50% 50%, rgba(46,27,17,.94) 0%, rgba(46,27,17,.72) 34%, rgba(46,27,17,0) 72%)",
      }} />
      <Grain opacity={0.08} />

      {onBack && (
        <div style={{ padding: "54px 18px 0", position: "relative" }}>
          <button onClick={onBack} aria-label={t("common.back")} style={{
            background: "#FEF4D612", border: "1px solid #ffffff20", borderRadius: 10,
            height: 44, minWidth: 44, cursor: "pointer", display: "grid", placeItems: "center",
            color: "#FEF4D6", fontFamily: LF.body, fontWeight: 600, fontSize: 14, padding: "0 14px", gap: 6,
          }}>
            <Icon name="arrow-left" size={16} />
          </button>
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto", padding: "40px 30px", position: "relative", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {/* mark */}
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <h1 style={{ fontFamily: LF.wordmark, fontWeight: "normal", fontSize: 70, color: "#FBF3DE", margin: 0, letterSpacing: ".01em", lineHeight: 0.92, textShadow: "0 2px 30px rgba(0,0,0,.4)" }}>Myci</h1>
        </div>

        {status !== "sent" ? (
          <React.Fragment>
            <h2 style={{ fontFamily: LF.display, fontWeight: 500, fontSize: 23, color: "#FBF3DE", margin: "18px 0 0", textAlign: "center", lineHeight: 1.18, letterSpacing: "-.01em" }}>
              {reason || t("auth.title")}
            </h2>
            <p style={{ fontFamily: LF.body, fontSize: 14.5, color: "#E9D7B8", margin: "12px 0 26px", textAlign: "center", lineHeight: 1.5 }}>
              {t("auth.sub")}
            </p>

            <label htmlFor="signin-email" style={{ fontFamily: LF.mono, fontSize: 11, fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", color: "#b79a6e" }}>
              Email
            </label>
            <input
              id="signin-email" type="email" inputMode="email" autoComplete="email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder={t("auth.emailPlaceholder")}
              style={{
                width: "100%", boxSizing: "border-box", marginTop: 8, marginBottom: 18,
                background: "#FEF4D610", border: "1px solid #ffffff22", borderRadius: 12,
                padding: "14px 15px", color: "#FEF4D6", fontFamily: LF.body, fontSize: 16, outline: "none",
              }}
            />

            <Btn full icon="paper-plane-tilt" onClick={submit} style={{ fontFamily: LF.body, fontWeight: 600, opacity: valid ? 1 : 0.55, fontSize: 16, padding: 15 }}>
              {status === "sending" ? t("auth.sending") : t("auth.send")}
            </Btn>

            {status === "error" && (
              <p role="alert" style={{ fontFamily: LF.body, fontSize: 13.5, color: "#E8A87C", textAlign: "center", marginTop: 14 }}>
                {errMsg || t("auth.error")}
              </p>
            )}

            <p style={{ fontFamily: LF.mono, fontSize: 10.5, color: "#b79a6e", textAlign: "center", marginTop: 22, letterSpacing: ".04em" }}>
              no passwords · no ads · just neighbors
            </p>
            <LegalLine />
          </React.Fragment>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 42 }}><Icon name="envelope-simple-open" size={44} style={{ color: "#E3A81B" }} /></div>
            <h2 style={{ fontFamily: LF.display, fontWeight: 500, fontSize: 23, color: "#FBF3DE", margin: "16px 0 0", letterSpacing: "-.01em" }}>
              {t("auth.sent")}
            </h2>
            <p style={{ fontFamily: LF.body, fontSize: 14.5, color: "#E9D7B8", margin: "12px 0 0", lineHeight: 1.5 }}>
              {t("auth.sentSub", { email: email.trim() })}
            </p>

            {/* Dev fallback — no email provider configured */}
            {devLink && (
              <div style={{ marginTop: 24, padding: 16, background: "#FEF4D60d", border: "1px dashed #ffffff2a", borderRadius: 12 }}>
                <p style={{ fontFamily: LF.mono, fontSize: 11, color: "#b79a6e", margin: "0 0 12px", lineHeight: 1.5 }}>
                  {t("auth.devLink")}
                </p>
                <a href={devLink} style={{ textDecoration: "none" }}>
                  <Btn full kind="sage" icon="arrow-right" style={{ fontFamily: LF.body, fontWeight: 600 }}>Sign in</Btn>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { AuthProvider, useAuth, AuthContext, SignInScreen });
