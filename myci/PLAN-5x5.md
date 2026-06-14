# Myci → 5/5 on every judging criterion — work plan

Goal: lift the build to a credible **5/5** on all four Green Hackathon criteria
(Scalability, Universality, User-Friendly, Equitable). Deadline: **Sun Jun 14, 2026**.

Legend: ✅ done & verified · 🟡 done in code, not yet verified end-to-end · ⬜ not started

---

## 1 · Scalability (durable + secure + 10k-ready)

- ✅ **Durable datastore** — Upstash Redis wired via `api/_store.js`; `/api/health`
  confirmed reporting `"store":"redis"` and posts persist to Upstash.
- ✅ **`.env` loader** added to `dev-server.js` so local runs pick up secrets
  (`.env` is gitignored; `.env.example` documents the vars).
- ✅ **Rate limiting** — `api/_ratelimit.js` (Redis fixed-window + in-memory
  fallback); wired into `POST /api/posts` (cap 8/min). Verified: trips at the cap (429).
- ✅ **Magic-link auth** — `api/auth/{request,verify,me,logout}.js` + `api/_auth.js`
  (Redis sessions, httpOnly cookie, single-use 15-min tokens). Verified end-to-end:
  request → verify (302 + Set-Cookie) → me → authed POST (201) → unauth POST (401).
- ✅ **Server-derived identity** — `authorId` now comes from the session, never the
  client body (`normalizePost(input, user)`); live posts carry author display fields.
- ✅ **Pluggable email** — `api/_email.js` uses Resend when keyed, else a dev
  fallback that returns the link (so auth works today without the email account).
- 🟡 **Auth UI gate in app** — `myci-auth-ui.jsx` (AuthProvider/useAuth + SignInScreen),
  posting/reach-out gated behind sign-in, `?auth=` magic-link return handled.
  *Needs: browser smoke test.*
- 🟡 **Entry screen** — landing now offers three paths: **Join** (onboarding/guest),
  **Explore as a guest** (jump straight to the feed, no account — great for judges),
  and **Sign in** (returning users → magic-link). Terms/Privacy links on landing +
  sign-in. *(Kept passwordless; no email+password, no Google OAuth — by decision.)*
- ⬜ **`privacy.html` + `terms.html`** — `/privacy` and `/terms` are routed (dev-server
  + presumably vercel.json) and linked from the UI, but the pages themselves must exist.
- ⬜ **Provision email provider (Resend)** — needs `RESEND_API_KEY` + from-address
  from you. Until then auth runs in dev-link fallback mode.
- ⬜ **Deploy env vars to Vercel** — add `UPSTASH_*` (and `RESEND_*`) in the Vercel
  dashboard so production runs in `redis` mode, not memory.
- ⬜ **Stretch (optional):** security headers/CSP on the HTML shells; per-session
  CSRF token on POSTs.

## 2 · Universality (works worldwide out of the box)

- ✅ **i18n engine** — `myci-i18n.jsx`: `t()` + `useI18n()`, locale auto-detect,
  localStorage override, **EN / ES / AR** dictionaries, RTL direction, and
  metric/imperial `formatDistance()`.
- ✅ **RTL** — `dir` applied on `<html>` and the app root; flips for Arabic.
- 🟡 **Copy externalized** across screens:
  - ✅ Bottom nav, landing, onboarding, feed (tabs/filters/empty/edge), sign-in,
    settings, compose, post detail, messages, notifications, thread headers.
  - ✅ Distances now run through `formatDistance` (feed, post card, post detail, map).
  - ⬜ **Long-tail strings still English** (no keys yet) — see "Untranslated" below.
- ✅ **Language + units switcher** built into Settings (`LanguageRow` / `UnitsRow`).
- 🟡 *Needs: browser check that switching language re-renders + RTL looks right.*

### Untranslated long-tail (left in English on purpose, listed for a follow-up pass)
- Onboarding chips: GIVE_CHIPS / CURIOUS_CHIPS (Cooking, Woodworking, …).
- Feed FILTER_TAGS labels (Surplus, Tools, Food, …).
- Map: "Beneath {neighborhood}", "threads grown", layer toggles
  (Threads/Posts/Resources — note the code compares `label === "Resources"`,
  so translating needs a small refactor), resource types, thread captions.
- Compose: "What would you accept in return?" + its pills, "Who can see this?" + pills,
  the per-type title placeholders (COMPOSE_PROMPTS).
- Post detail InfoCell labels "Shared with" / "Posted".
- Messages "Coordinating" eyebrow; "re: {title}" prefixes.
- Landing page `index.html` (marketing site) is English-only.

## 3 · User-Friendly (anyone, any age)

- 🟡 **aria-labels on icon-only buttons** — added across feed (bell/filters/clear),
  detail (back/bell/gear/send/links), map (bell/close/nodes), sign-in. Postcards are
  now keyboard-activatable (`role=button`, Enter/Space).
- 🟡 **Tap targets** — header/icon buttons bumped 38→44px in feed, detail, map.
- ⬜ **WCAG AA contrast pass** — NOT done. Several muted tones (e.g. `#9a7a52`,
  `#b79a6e`, `#cbb085` on brown/cream) likely fail AA for small text. Needs an audit
  + targeted darkening. *(Highest-value remaining UX item.)*
- ⬜ **Respect system text scaling / larger-text mode** — not addressed.
- ⬜ **Focus-visible styling** — relying on browser defaults; could add explicit rings.
- ⬜ Alt text review on PhotoSlot placeholders.

## 4 · Equitable (anti-extractive, reciprocal) — already strong

- ✅ **Export my data** — `api/account/export.js` + Settings action (downloads JSON
  of account + your posts).
- ✅ **Delete my account** — `api/account/delete.js` (erases user + sessions + all
  their posts) + Settings action with confirm.
- ✅ **Sign out** + signed-in state in Settings.
- ✅ **Privacy note** surfaced ("never sells your data, no ads").
- 🟡 *Needs: browser test of export download + delete round-trip.*

---

## Verification & ship

- ✅ All 11 JSX files pass an esbuild JSX syntax check.
- ⬜ **Browser smoke test** (the step in progress when paused): load `/app`, watch
  console for runtime errors, click through landing → onboarding → feed → post →
  sign-in → compose → settings; switch language to AR (RTL) and units; run
  export/delete. *(Needs a headless browser or your manual click-through.)*
- ⬜ **Commit on a branch** (not committed yet — git guidance is to commit only when
  you ask; nothing is staged/committed so far).
- ⬜ **Deploy to Vercel** with env vars; confirm `/api/health` = redis in prod.

---

## What I need from you
1. **Resend** `RESEND_API_KEY` + from-address (to send real magic-link emails).
2. Confirmation to **commit** (and whether to push / open a PR).
3. Add the env vars in **Vercel** before deploy (or hand me the deploy step).

## Files added/changed this session
**Added:** `api/_ratelimit.js`, `api/_auth.js`, `api/_email.js`,
`api/auth/request.js|verify.js|me.js|logout.js`, `api/account/export.js|delete.js`,
`myci-i18n.jsx`, `myci-auth-ui.jsx`, `.gitignore`, `myci/.env` (gitignored),
`myci/.env.example`, this file.
**Changed:** `api/_store.js`, `api/_util.js`, `api/posts.js`, `dev-server.js`,
`myci-data.jsx`, `myci-app.jsx`, `myci-postcard.jsx`, `Myci.html`,
`myci-screens-{intro,feed,map,detail}.jsx`.
