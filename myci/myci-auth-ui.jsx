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
    <div style={{ position: "absolute", inset: 0, background: "#3A2A1E", display: "flex", flexDirection: "column" }}>
      <Grain opacity={0.07} />

      {onBack && (
        <div style={{ padding: "54px 18px 0", position: "relative" }}>
          <button onClick={onBack} aria-label={t("common.back")} style={{
            background: "#FEF4D612", border: "1px solid #ffffff20", borderRadius: 10,
            height: 44, minWidth: 44, cursor: "pointer", display: "grid", placeItems: "center",
            color: "#FEF4D6", fontFamily: "'Cutive', serif", fontSize: 14, padding: "0 14px", gap: 6,
          }}>
            <Icon name="arrow-left" size={16} />
          </button>
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto", padding: "40px 30px", position: "relative", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {/* mark */}
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <h1 style={{ fontFamily: "var(--display)", fontSize: 52, color: "#FEF4D6", margin: 0, letterSpacing: ".01em", textShadow: "0 2px 0 #2a1a0e" }}>Myci</h1>
        </div>

        {status !== "sent" ? (
          <React.Fragment>
            <h2 style={{ fontFamily: "'Trocchi', serif", fontWeight: 400, fontSize: 24, color: "#FEF4D6", margin: "20px 0 0", textAlign: "center", lineHeight: 1.2 }}>
              {reason || t("auth.title")}
            </h2>
            <p style={{ fontFamily: "'Cutive', serif", fontSize: 15, color: "#c4ab83", margin: "12px 0 26px", textAlign: "center", lineHeight: 1.5 }}>
              {t("auth.sub")}
            </p>

            <label htmlFor="signin-email" style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "#9a7a52" }}>
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
                padding: "14px 15px", color: "#FEF4D6", fontFamily: "'Trocchi', serif", fontSize: 16, outline: "none",
              }}
            />

            <Btn full icon="paper-plane-tilt" onClick={submit} style={{ opacity: valid ? 1 : 0.55, fontSize: 16, padding: 15 }}>
              {status === "sending" ? t("auth.sending") : t("auth.send")}
            </Btn>

            {status === "error" && (
              <p role="alert" style={{ fontFamily: "'Cutive', serif", fontSize: 13.5, color: "#E8A87C", textAlign: "center", marginTop: 14 }}>
                {errMsg || t("auth.error")}
              </p>
            )}

            <p style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 10.5, color: "#b79a6e", textAlign: "center", marginTop: 22 }}>
              no passwords · no ads · just neighbors
            </p>
            <LegalLine />
          </React.Fragment>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 42 }}><Icon name="envelope-simple-open" size={44} style={{ color: "#D6AD08" }} /></div>
            <h2 style={{ fontFamily: "'Trocchi', serif", fontWeight: 400, fontSize: 24, color: "#FEF4D6", margin: "16px 0 0" }}>
              {t("auth.sent")}
            </h2>
            <p style={{ fontFamily: "'Cutive', serif", fontSize: 15, color: "#c4ab83", margin: "12px 0 0", lineHeight: 1.5 }}>
              {t("auth.sentSub", { email: email.trim() })}
            </p>

            {/* Dev fallback — no email provider configured */}
            {devLink && (
              <div style={{ marginTop: 24, padding: 16, background: "#FEF4D60d", border: "1px dashed #ffffff2a", borderRadius: 12 }}>
                <p style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 11, color: "#b79a6e", margin: "0 0 12px", lineHeight: 1.5 }}>
                  {t("auth.devLink")}
                </p>
                <a href={devLink} style={{ textDecoration: "none" }}>
                  <Btn full kind="sage" icon="arrow-right">Sign in</Btn>
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
