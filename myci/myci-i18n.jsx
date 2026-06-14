// myci-i18n.jsx — internationalization for Myci.
//
// UNIVERSALITY BY DESIGN
// ──────────────────────
// Place, language, units and the categories of sharing are all just data. The
// app reads every visible string through t("key"), picks a locale from the
// browser (override in Settings), flips to RTL for right-to-left scripts, and
// formats distances in metric or imperial. Dropping Myci into a new region is a
// translation file + a locale code — no code changes. Ships with English,
// Spanish and Arabic (RTL) to prove the seam end-to-end.

const STRINGS = {
  en: {
    "dir": "ltr",
    "lang.name": "English",

    // chrome / nav
    "nav.commons": "Commons", "nav.map": "Map", "nav.share": "Share",
    "nav.messages": "Messages", "nav.me": "Me",

    // common
    "common.back": "Back", "common.next": "Next", "common.cancel": "Cancel",
    "common.save": "Save", "common.clearAll": "Clear all", "common.close": "Close",
    "common.posts": "posts", "common.post": "post",

    // landing
    "landing.kicker": "{place} · est. now",
    "landing.tagline1": "Borrow more. Buy less.", "landing.tagline2": "Know your neighbors.",
    "landing.join": "Join your neighborhood",
    "landing.note": "no money · no ads · just neighbors",
    "landing.signin": "Already a neighbor? Sign in",
    "landing.guest": "Explore as a guest",
    "legal.agreePre": "By continuing you agree to our",
    "legal.and": "and", "legal.terms": "Terms", "legal.privacy": "Privacy Policy",

    // onboarding
    "ob.step1": "Step 1 · Where you are",
    "ob.where": "Which patch of ground is yours?",
    "ob.whereSub": "Approximate only. We fuzz your spot by ±500m — never a precise pin.",
    "ob.neighborhood": "Neighborhood", "ob.city": "City", "ob.youRoughly": "you, roughly",
    "ob.step2": "Step 2 · Give first",
    "ob.give": "What can you give your neighbors?",
    "ob.giveSub": "This comes first on purpose. You arrive as a giver, not a taker.",
    "ob.step3": "Step 3 · Stay curious",
    "ob.curious": "What would you love to learn?",
    "ob.curiousSub": "Curiosity, not need. We'll nudge you toward neighbors who teach it.",
    "ob.enter": "Enter the Commons",

    // feed
    "feed.commons": "The Commons",
    "feed.tab.all": "All", "feed.tab.offers": "Offers", "feed.tab.requests": "Requests",
    "feed.tab.events": "Events", "feed.tab.aid": "Mutual Aid",
    "feed.filters": "Filters",
    "feed.allCategories": "· all categories, within reach",
    "feed.within": "within {d}",
    "feed.empty": "Nothing matches those filters yet.",
    "feed.clearFilters": "Clear filters",
    "feed.edge": "· you've reached the edge of {place} ·",
    "feed.filterTitle": "Filter the Commons",
    "feed.search": "Search posts…",
    "feed.categories": "Categories", "feed.distance": "Distance", "feed.any": "any",
    "feed.show": "Show {n} {posts}",

    // compose
    "compose.title": "Share with your neighbors",
    "compose.whatType": "What are you sharing?",
    "compose.titleLabel": "Give it a title",
    "compose.titlePlaceholder": "e.g. Spare tomatoes from the garden",
    "compose.bodyLabel": "Tell your neighbors more",
    "compose.bodyPlaceholder": "A sentence or two — warm and specific works best.",
    "compose.photoLabel": "Add a photo (optional)",
    "compose.photoSlot": "tap to add a photo",
    "compose.submit": "Post to the Commons",
    "compose.posting": "Seeding…",
    "compose.doneTitle": "It's planted.",
    "compose.doneBody": "Your neighbors can see it now. The first thread starts with one offer.",
    "compose.doneBtn": "Back to the Commons",
    "compose.signInFirst": "Sign in to share with your neighbors",

    // post detail
    "post.reachOut": "Reach out", "post.theyAccept": "In return", "post.distanceAway": "{d} away",

    // profile
    "profile.gave": "gave", "profile.asked": "asked", "profile.here": "here {t}",
    "profile.settings": "Settings",

    // messages / thread
    "messages.title": "Messages", "messages.empty": "No conversations yet.",
    "thread.complete": "Mark exchange complete", "thread.completed": "Exchange complete",
    "thread.placeholder": "Write a message…",
    "thread.grew": "A new thread grew on the map",

    // notifications
    "notif.title": "Notifications", "notif.empty": "Nothing new.",

    // settings
    "settings.title": "Settings",
    "settings.account": "Account", "settings.language": "Language", "settings.units": "Distance units",
    "settings.units.metric": "Metric (km)", "settings.units.imperial": "Imperial (mi)",
    "settings.privacy": "Your data, your terms",
    "settings.privacyNote": "Myci never sells your data and shows no ads. You can take it with you or erase it, anytime.",
    "settings.export": "Export my data", "settings.delete": "Delete my account",
    "settings.signOut": "Sign out",
    "settings.deleteConfirm": "Delete your account and all your posts? This can't be undone.",
    "settings.deleted": "Your account and data were erased.",
    "settings.exported": "Your data downloaded.",
    "settings.region": "Language & region",
    "settings.signInPrompt": "Sign in to share and keep your threads",
    "settings.blocked": "Blocked neighbors",
    "settings.fuzz": "Fuzz my location (±500m)", "settings.fuzzDesc": "Never show a precise pin",
    "settings.visibleTo": "Profile visible to", "settings.visNeighborhood": "My neighborhood",
    "settings.showMap": "Show me on the map", "settings.showMapDesc": "Opt in to an approximate node",
    "settings.notifResponds": "Someone responds to my post",
    "settings.notifMatches": "New offers that match me",
    "settings.notifHelp": "Requests I could help with",
    "settings.notifDigest": "Weekly neighborhood digest", "settings.notifDigestDesc": "A quiet Sunday email",
    "settings.human": "Myci · disputes handled by a real human · v0.1",

    // auth
    "auth.title": "Sign in to Myci",
    "auth.sub": "We'll email you a link — no passwords, ever.",
    "auth.emailPlaceholder": "you@email.com",
    "auth.send": "Email me a link",
    "auth.sending": "Sending…",
    "auth.sent": "Check your email",
    "auth.sentSub": "We sent a sign-in link to {email}. It's good for 15 minutes.",
    "auth.devLink": "Dev mode — no email configured. Tap to sign in:",
    "auth.expired": "That link expired. Let's send a fresh one.",
    "auth.error": "Something went wrong. Please try again.",
    "auth.signedInAs": "Signed in as {name}",
    "auth.welcome": "Welcome to the neighborhood, {name}!",
  },

  es: {
    "dir": "ltr",
    "lang.name": "Español",

    "nav.commons": "Plaza", "nav.map": "Mapa", "nav.share": "Compartir",
    "nav.messages": "Mensajes", "nav.me": "Yo",

    "common.back": "Atrás", "common.next": "Siguiente", "common.cancel": "Cancelar",
    "common.save": "Guardar", "common.clearAll": "Borrar todo", "common.close": "Cerrar",
    "common.posts": "publicaciones", "common.post": "publicación",

    "landing.kicker": "{place} · desde ahora",
    "landing.tagline1": "Toma prestado más. Compra menos.", "landing.tagline2": "Conoce a tus vecinos.",
    "landing.join": "Únete a tu vecindario",
    "landing.note": "sin dinero · sin anuncios · solo vecinos",
    "landing.signin": "¿Ya eres vecino? Inicia sesión",
    "landing.guest": "Explorar como invitado",
    "legal.agreePre": "Al continuar aceptas nuestros",
    "legal.and": "y", "legal.terms": "Términos", "legal.privacy": "Política de privacidad",

    "ob.step1": "Paso 1 · Dónde estás",
    "ob.where": "¿Qué pedazo de tierra es tuyo?",
    "ob.whereSub": "Solo aproximado. Difuminamos tu punto ±500m — nunca exacto.",
    "ob.neighborhood": "Vecindario", "ob.city": "Ciudad", "ob.youRoughly": "tú, más o menos",
    "ob.step2": "Paso 2 · Da primero",
    "ob.give": "¿Qué puedes dar a tus vecinos?",
    "ob.giveSub": "Esto va primero a propósito. Llegas como quien da, no quien pide.",
    "ob.step3": "Paso 3 · Mantén la curiosidad",
    "ob.curious": "¿Qué te encantaría aprender?",
    "ob.curiousSub": "Curiosidad, no necesidad. Te acercaremos a vecinos que lo enseñan.",
    "ob.enter": "Entrar a la Plaza",

    "feed.commons": "La Plaza",
    "feed.tab.all": "Todo", "feed.tab.offers": "Ofertas", "feed.tab.requests": "Peticiones",
    "feed.tab.events": "Eventos", "feed.tab.aid": "Ayuda mutua",
    "feed.filters": "Filtros",
    "feed.allCategories": "· todas las categorías, cerca",
    "feed.within": "dentro de {d}",
    "feed.empty": "Nada coincide con esos filtros aún.",
    "feed.clearFilters": "Borrar filtros",
    "feed.edge": "· has llegado al borde de {place} ·",
    "feed.filterTitle": "Filtrar la Plaza",
    "feed.search": "Buscar publicaciones…",
    "feed.categories": "Categorías", "feed.distance": "Distancia", "feed.any": "cualquiera",
    "feed.show": "Ver {n} {posts}",

    "compose.title": "Comparte con tus vecinos",
    "compose.whatType": "¿Qué compartes?",
    "compose.titleLabel": "Ponle un título",
    "compose.titlePlaceholder": "ej. Tomates de más del jardín",
    "compose.bodyLabel": "Cuéntales más a tus vecinos",
    "compose.bodyPlaceholder": "Una o dos frases — cálido y específico funciona mejor.",
    "compose.photoLabel": "Añadir una foto (opcional)",
    "compose.photoSlot": "toca para añadir una foto",
    "compose.submit": "Publicar en la Plaza",
    "compose.posting": "Sembrando…",
    "compose.doneTitle": "Está plantado.",
    "compose.doneBody": "Tus vecinos ya pueden verlo. El primer hilo empieza con una oferta.",
    "compose.doneBtn": "Volver a la Plaza",
    "compose.signInFirst": "Inicia sesión para compartir con tus vecinos",

    "post.reachOut": "Contactar", "post.theyAccept": "A cambio", "post.distanceAway": "a {d}",

    "profile.gave": "dio", "profile.asked": "pidió", "profile.here": "aquí {t}",
    "profile.settings": "Ajustes",

    "messages.title": "Mensajes", "messages.empty": "Aún no hay conversaciones.",
    "thread.complete": "Marcar intercambio completo", "thread.completed": "Intercambio completo",
    "thread.placeholder": "Escribe un mensaje…",
    "thread.grew": "Un nuevo hilo creció en el mapa",

    "notif.title": "Notificaciones", "notif.empty": "Nada nuevo.",

    "settings.title": "Ajustes",
    "settings.account": "Cuenta", "settings.language": "Idioma", "settings.units": "Unidades de distancia",
    "settings.units.metric": "Métrico (km)", "settings.units.imperial": "Imperial (mi)",
    "settings.privacy": "Tus datos, tus reglas",
    "settings.privacyNote": "Myci nunca vende tus datos ni muestra anuncios. Puedes llevártelos o borrarlos cuando quieras.",
    "settings.export": "Exportar mis datos", "settings.delete": "Eliminar mi cuenta",
    "settings.signOut": "Cerrar sesión",
    "settings.deleteConfirm": "¿Eliminar tu cuenta y todas tus publicaciones? No se puede deshacer.",
    "settings.deleted": "Tu cuenta y datos fueron borrados.",
    "settings.exported": "Tus datos se descargaron.",
    "settings.region": "Idioma y región",
    "settings.signInPrompt": "Inicia sesión para compartir y guardar tus hilos",
    "settings.blocked": "Vecinos bloqueados",
    "settings.fuzz": "Difuminar mi ubicación (±500m)", "settings.fuzzDesc": "Nunca mostrar un punto exacto",
    "settings.visibleTo": "Perfil visible para", "settings.visNeighborhood": "Mi vecindario",
    "settings.showMap": "Mostrarme en el mapa", "settings.showMapDesc": "Aparecer como un nodo aproximado",
    "settings.notifResponds": "Alguien responde a mi publicación",
    "settings.notifMatches": "Nuevas ofertas que encajan conmigo",
    "settings.notifHelp": "Peticiones en las que podría ayudar",
    "settings.notifDigest": "Resumen semanal del vecindario", "settings.notifDigestDesc": "Un correo tranquilo de domingo",
    "settings.human": "Myci · disputas resueltas por una persona real · v0.1",

    "auth.title": "Inicia sesión en Myci",
    "auth.sub": "Te enviaremos un enlace por correo — sin contraseñas, nunca.",
    "auth.emailPlaceholder": "tu@correo.com",
    "auth.send": "Envíame un enlace",
    "auth.sending": "Enviando…",
    "auth.sent": "Revisa tu correo",
    "auth.sentSub": "Enviamos un enlace de acceso a {email}. Vale por 15 minutos.",
    "auth.devLink": "Modo dev — sin correo configurado. Toca para entrar:",
    "auth.expired": "Ese enlace caducó. Enviemos uno nuevo.",
    "auth.error": "Algo salió mal. Inténtalo de nuevo.",
    "auth.signedInAs": "Sesión de {name}",
    "auth.welcome": "¡Bienvenido al vecindario, {name}!",
  },

  ar: {
    "dir": "rtl",
    "lang.name": "العربية",

    "nav.commons": "الساحة", "nav.map": "الخريطة", "nav.share": "شارك",
    "nav.messages": "الرسائل", "nav.me": "أنا",

    "common.back": "رجوع", "common.next": "التالي", "common.cancel": "إلغاء",
    "common.save": "حفظ", "common.clearAll": "مسح الكل", "common.close": "إغلاق",
    "common.posts": "منشورات", "common.post": "منشور",

    "landing.kicker": "{place} · من الآن",
    "landing.tagline1": "استعِر أكثر. اشترِ أقل.", "landing.tagline2": "اعرف جيرانك.",
    "landing.join": "انضم إلى حيّك",
    "landing.note": "بلا مال · بلا إعلانات · جيران فقط",
    "landing.signin": "جار بالفعل؟ سجّل الدخول",
    "landing.guest": "تصفّح كضيف",
    "legal.agreePre": "بالمتابعة فإنك توافق على",
    "legal.and": "و", "legal.terms": "الشروط", "legal.privacy": "سياسة الخصوصية",

    "ob.step1": "خطوة ١ · أين أنت",
    "ob.where": "أي بقعة أرض هي لك؟",
    "ob.whereSub": "تقريبي فقط. نموّه موقعك بمقدار ±٥٠٠م — أبداً دبوس دقيق.",
    "ob.neighborhood": "الحي", "ob.city": "المدينة", "ob.youRoughly": "أنت، تقريباً",
    "ob.step2": "خطوة ٢ · أعطِ أولاً",
    "ob.give": "ماذا يمكنك أن تعطي جيرانك؟",
    "ob.giveSub": "هذا أولاً عن قصد. تصل كمن يعطي، لا كمن يأخذ.",
    "ob.step3": "خطوة ٣ · ابقَ فضولياً",
    "ob.curious": "ماذا تحب أن تتعلم؟",
    "ob.curiousSub": "فضول، لا حاجة. سنقرّبك من جيران يعلّمونه.",
    "ob.enter": "ادخل الساحة",

    "feed.commons": "الساحة",
    "feed.tab.all": "الكل", "feed.tab.offers": "عروض", "feed.tab.requests": "طلبات",
    "feed.tab.events": "فعاليات", "feed.tab.aid": "عون متبادل",
    "feed.filters": "تصفية",
    "feed.allCategories": "· كل الفئات، على مقربة",
    "feed.within": "ضمن {d}",
    "feed.empty": "لا شيء يطابق هذه التصفية بعد.",
    "feed.clearFilters": "مسح التصفية",
    "feed.edge": "· وصلت إلى حدود {place} ·",
    "feed.filterTitle": "تصفية الساحة",
    "feed.search": "ابحث في المنشورات…",
    "feed.categories": "الفئات", "feed.distance": "المسافة", "feed.any": "أي",
    "feed.show": "عرض {n} {posts}",

    "compose.title": "شارك مع جيرانك",
    "compose.whatType": "ماذا تشارك؟",
    "compose.titleLabel": "أعطه عنواناً",
    "compose.titlePlaceholder": "مثال: طماطم زائدة من الحديقة",
    "compose.bodyLabel": "أخبر جيرانك المزيد",
    "compose.bodyPlaceholder": "جملة أو اثنتان — الدفء والتحديد أفضل.",
    "compose.photoLabel": "أضف صورة (اختياري)",
    "compose.photoSlot": "انقر لإضافة صورة",
    "compose.submit": "انشر في الساحة",
    "compose.posting": "نزرع…",
    "compose.doneTitle": "زُرعت.",
    "compose.doneBody": "يمكن لجيرانك رؤيتها الآن. يبدأ أول خيط بعرض واحد.",
    "compose.doneBtn": "العودة إلى الساحة",
    "compose.signInFirst": "سجّل الدخول للمشاركة مع جيرانك",

    "post.reachOut": "تواصل", "post.theyAccept": "بالمقابل", "post.distanceAway": "على بُعد {d}",

    "profile.gave": "أعطى", "profile.asked": "طلب", "profile.here": "هنا منذ {t}",
    "profile.settings": "الإعدادات",

    "messages.title": "الرسائل", "messages.empty": "لا محادثات بعد.",
    "thread.complete": "وسم التبادل مكتملاً", "thread.completed": "اكتمل التبادل",
    "thread.placeholder": "اكتب رسالة…",
    "thread.grew": "نما خيط جديد على الخريطة",

    "notif.title": "الإشعارات", "notif.empty": "لا جديد.",

    "settings.title": "الإعدادات",
    "settings.account": "الحساب", "settings.language": "اللغة", "settings.units": "وحدات المسافة",
    "settings.units.metric": "متري (كم)", "settings.units.imperial": "إمبراطوري (ميل)",
    "settings.privacy": "بياناتك، بشروطك",
    "settings.privacyNote": "Myci لا تبيع بياناتك ولا تعرض إعلانات. يمكنك أخذها معك أو محوها في أي وقت.",
    "settings.export": "تصدير بياناتي", "settings.delete": "حذف حسابي",
    "settings.signOut": "تسجيل الخروج",
    "settings.deleteConfirm": "حذف حسابك وكل منشوراتك؟ لا يمكن التراجع.",
    "settings.deleted": "تم محو حسابك وبياناتك.",
    "settings.exported": "تم تنزيل بياناتك.",
    "settings.region": "اللغة والمنطقة",
    "settings.signInPrompt": "سجّل الدخول للمشاركة وحفظ خيوطك",
    "settings.blocked": "الجيران المحظورون",
    "settings.fuzz": "تمويه موقعي (±٥٠٠م)", "settings.fuzzDesc": "لا تُظهر نقطة دقيقة أبداً",
    "settings.visibleTo": "الملف مرئي لـ", "settings.visNeighborhood": "حيّي",
    "settings.showMap": "أظهرني على الخريطة", "settings.showMapDesc": "الظهور كعقدة تقريبية",
    "settings.notifResponds": "أحدهم يرد على منشوري",
    "settings.notifMatches": "عروض جديدة تناسبني",
    "settings.notifHelp": "طلبات يمكنني المساعدة فيها",
    "settings.notifDigest": "ملخص أسبوعي للحي", "settings.notifDigestDesc": "بريد هادئ يوم الأحد",
    "settings.human": "Myci · يدير النزاعات إنسان حقيقي · v0.1",

    "auth.title": "سجّل الدخول إلى Myci",
    "auth.sub": "سنرسل لك رابطاً بالبريد — بلا كلمات مرور أبداً.",
    "auth.emailPlaceholder": "you@email.com",
    "auth.send": "أرسل لي رابطاً",
    "auth.sending": "نرسل…",
    "auth.sent": "تفقّد بريدك",
    "auth.sentSub": "أرسلنا رابط دخول إلى {email}. صالح لمدة ١٥ دقيقة.",
    "auth.devLink": "وضع التطوير — لا بريد مُهيّأ. انقر للدخول:",
    "auth.expired": "انتهت صلاحية الرابط. لنرسل واحداً جديداً.",
    "auth.error": "حدث خطأ ما. حاول مرة أخرى.",
    "auth.signedInAs": "مسجّل كـ {name}",
    "auth.welcome": "أهلاً بك في الحي، {name}!",
  },
};

const SUPPORTED = Object.keys(STRINGS);

// Locales that default to imperial distance; everyone else gets metric.
const IMPERIAL_LOCALES = ["en-us", "en-gb", "my", "lr"];

function detectLang() {
  try {
    const saved = localStorage.getItem("myci.lang");
    if (saved && SUPPORTED.includes(saved)) return saved;
    const nav = (navigator.language || "en").toLowerCase();
    const base = nav.split("-")[0];
    if (SUPPORTED.includes(base)) return base;
  } catch {}
  return "en";
}

function detectUnits() {
  try {
    const saved = localStorage.getItem("myci.units");
    if (saved === "metric" || saved === "imperial") return saved;
    const nav = (navigator.language || "en").toLowerCase();
    return IMPERIAL_LOCALES.includes(nav) ? "imperial" : "metric";
  } catch {}
  return "metric";
}

// Module-level state so non-component code (data labels) can translate too.
let _lang = detectLang();
let _units = detectUnits();
const _subs = new Set();
function _notify() { _subs.forEach((fn) => fn()); }

function interpolate(str, vars) {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? vars[k] : `{${k}}`));
}

// Global translate — falls back to English, then to the key itself.
function t(key, vars) {
  const dict = STRINGS[_lang] || STRINGS.en;
  const val = dict[key] != null ? dict[key] : (STRINGS.en[key] != null ? STRINGS.en[key] : key);
  return interpolate(val, vars);
}

function getLang() { return _lang; }
function getDir() { return STRINGS[_lang] && STRINGS[_lang].dir === "rtl" ? "rtl" : "ltr"; }
function getUnits() { return _units; }

function setLang(l) {
  if (!SUPPORTED.includes(l) || l === _lang) return;
  _lang = l;
  try { localStorage.setItem("myci.lang", l); } catch {}
  applyDocument();
  _notify();
}
function setUnits(u) {
  if ((u !== "metric" && u !== "imperial") || u === _units) return;
  _units = u;
  try { localStorage.setItem("myci.units", u); } catch {}
  _notify();
}

// Format a distance given in miles (the seed's native unit) per current setting.
function formatDistance(mi) {
  const n = typeof mi === "number" ? mi : parseFloat(mi);
  if (Number.isNaN(n)) return String(mi || "");
  if (_units === "metric") {
    const km = n * 1.60934;
    return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
  }
  return `${n} mi`;
}

// Reflect language + direction on <html> so RTL and font rendering are global.
function applyDocument() {
  try {
    document.documentElement.lang = _lang;
    document.documentElement.dir = getDir();
  } catch {}
}
applyDocument();

// React glue: re-render subscribers on language/unit change.
function useI18n() {
  const [, force] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    _subs.add(force);
    return () => { _subs.delete(force); };
  }, []);
  return {
    t, lang: _lang, dir: getDir(), units: _units,
    setLang, setUnits, formatDistance,
    languages: SUPPORTED.map((code) => ({ code, name: STRINGS[code]["lang.name"] })),
  };
}

Object.assign(window, {
  t, useI18n, setLang, setUnits, getLang, getDir, getUnits,
  formatDistance, SUPPORTED_LANGS: SUPPORTED,
});
