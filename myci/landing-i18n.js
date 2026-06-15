// landing-i18n.js — internationalization for the public pages (index / privacy / terms).
//
// UNIVERSALITY, ALL THE WAY TO THE FRONT DOOR
// ───────────────────────────────────────────
// The in-app i18n (myci-i18n.jsx) translates the product. This is its twin for
// the marketing + legal pages, which are plain static HTML with no React/Babel.
// It shares the SAME localStorage key ("myci.lang") as the app, so a language
// chosen on the landing page carries straight into the app, and vice-versa.
//
// How it works: every translatable node carries data-i18n / data-i18n-html /
// data-i18n-attr. On load (and whenever the switcher changes) we walk those
// nodes, swap in the active locale, set <html lang/dir> for RTL, and persist the
// choice. Ships English, Spanish and Arabic (RTL) — same three as the app.

(function () {
  "use strict";

  var STRINGS = {
    en: {
      "lang.name": "English", "dir": "ltr",

      // shared chrome
      "nav.openApp": "Open the app",
      "skip": "Skip to content",
      "lang.switchLabel": "Language",
      "footer.tagline": "Myci · borrow more, buy less, know your neighbors",
      "footer.openApp": "Open the app",
      "footer.how": "How it works",
      "footer.privacy": "Privacy",
      "footer.terms": "Terms",
      "footer.top": "Top",
      "footer.home": "Home",

      // ── index: meta ──
      "meta.title": "Myci — borrow more, buy less, know your neighbors",
      "meta.desc": "Myci is the give-first mutual-aid network for your street. Share tools, time, food and skills with the neighbors you already have. No money, no precise location, no ads.",

      // ── index: hero ──
      "hero.eyebrow": "Mutual aid, one street at a time",
      "hero.tagline": "Borrow more. Buy less.<br />Know your neighbors.",
      "hero.subline": "The give-first network for your street — share tools, time, food and skills with the people you already live beside.",
      "hero.join": "Join your neighborhood",
      "hero.see": "See how it works",
      "hero.note": "no money · no ads · just neighbors",

      // ── index: why ──
      "why.eyebrow": "Why Myci",
      "why.title": "Your neighbor has a drill you need.<br />You have the ladder they keep borrowing.",
      "why.lead": "A good drill sits in one garage while three people down the street each buy their own. Spare tomatoes go soft two doors from someone who'd happily cook them. The things your street needs are already on your street.",
      "why.punch": "<span class=\"hl\">Myci just helps you find each other.</span>",
      "why.illusAlt": "Two houses on a street connected by an underground mycelium thread, sharing a tomato and a book",

      // ── index: doom stat / counter-proof ──
      "stat.doomKicker": "The doom statistic",
      "stat.doomBig": "3 in 5",
      "stat.doomLabel": "of us can't name three neighbors on our own street.",
      "stat.proofKicker": "The counter-proof",
      "stat.proofBig": "One favor",
      "stat.proofLabel": "is all it takes to change that. Lend the drill, share the tomatoes — the rest tends to follow.",

      // ── index: the name ──
      "name.eyebrow": "Why &ldquo;Myci&rdquo;?",
      "name.mycBody": "The underground web of threads that links a whole forest — quietly passing food and signals from tree to tree, so nothing goes to waste and nobody goes without. It's how a neighborhood already works, once you can see it.",
      "name.cityBody": "And it's yours — my city, my street, my block. Hyperlocal by design, so the help is always a short walk away, never an app full of strangers across town.",
      "name.foot": "A living network, rooted right where you live.",

      // ── index: how it works ──
      "how.eyebrow": "How it works",
      "how.title": "Three taps from stranger to neighbor.",
      "how.s1t": "Give first",
      "how.s1b": "Start by offering something — a tool to lend, a skill, spare veg, a free hour. You arrive as a giver, not a taker.",
      "how.s2t": "Find a match",
      "how.s2b": "See what neighbors nearby are offering and asking for: food, tools, skills, rides, energy — even e-waste.",
      "how.s3t": "Watch it grow",
      "how.s3b": "Every swap draws a thread between two homes on your map. The more your street shares, the more it can find.",

      // ── index: what you can share ──
      "share.eyebrow": "What you can share",
      "share.title": "If a neighbor can spare it, Myci can pass it on.",
      "share.lead": "No cash changes hands. Just the everyday surplus a street already has, finally meeting the need next door.",
      "share.c1": "Spare food & meals",
      "share.c2": "Tools to lend",
      "share.c3": "Skills & teaching",
      "share.c4": "Barter & swaps",
      "share.c5": "A free hour",
      "share.c6": "Repairs & e-waste",
      "share.c7": "Rides & childcare",
      "share.c8": "Spare energy",

      // ── index: promises ──
      "promise.eyebrow": "What we promise",
      "promise.title": "Made for everyone on the street.",
      "promise.p1t": "Works on any street",
      "promise.p1b": "Place, language, and what people share are all just settings. Drop Myci into any neighborhood, anywhere, and it works.",
      "promise.p1k": "Works worldwide",
      "promise.p2t": "Easy at any age",
      "promise.p2b": "Big text, plain words, three taps to join. If you can send a text message, you can use Myci — at 12 or 92.",
      "promise.p2k": "Any age, no manual",
      "promise.p3t": "Built to grow",
      "promise.p3b": "It works offline first and gets better the more your street uses it. Holds one block today or a city of ten thousand tomorrow.",
      "promise.p3k": "Offline-first & scales",
      "promise.p4t": "You're never the product",
      "promise.p4b": "No ads. We never sell your data, and your location is fuzzed — never a precise pin. Myci gives back to the people who show up.",
      "promise.p4k": "No ads, no data resale",

      // ── index: one street → every street ──
      "pattern.eyebrow": "And then?",
      "pattern.title": "Start with your street.<br />Any street can copy it.",
      "pattern.lead": "Prove it on your block, and the same thing works next door — then the neighborhood, then anywhere. Small first, and then everywhere, the way mycelium spreads under a forest floor.",
      "pattern.t1": "Your street",
      "pattern.t2": "+ next block",
      "pattern.t3": "+ the neighborhood",
      "pattern.t4": "+ the city",
      "pattern.t5": "+ anywhere",

      // ── index: final CTA ──
      "final.title": "Give a little.<br />Get a neighborhood.",
      "final.sub": "It takes one favor to start the thread.",
      "final.cta": "Join your neighborhood",

      // ── privacy ──
      "pp.metaTitle": "Privacy Policy — Myci",
      "pp.metaDesc": "How Myci handles your data: no ads, no data resale, fuzzed location, and the least information we need to connect neighbors.",
      "pp.eyebrow": "The short version: you're never the product",
      "pp.h1": "Privacy Policy",
      "pp.updated": "Last updated 14 June 2026",
      "pp.tldr": "<strong>In plain words:</strong> Myci runs on the least information we need to connect you with neighbors. No ads, no selling your data, and your location is always fuzzed to a neighborhood — never a precise pin.",
      "pp.lead": "This policy explains what Myci collects, why, and the choices you have. Myci is a prototype built for the Green Hackathon 2026; we keep our data practices deliberately minimal.",
      "pp.h2collect": "What we collect",
      "pp.collect1": "<strong>Your profile</strong> — a display name and, optionally, a short bio and avatar. A real name is never required.",
      "pp.collect2": "<strong>Approximate location</strong> — the general area of your street so we can match you with nearby neighbors. We never store or share a precise GPS pin; locations are fuzzed before they leave your device.",
      "pp.collect3": "<strong>What you post</strong> — the offers, requests, and messages you choose to share, plus the swaps you complete.",
      "pp.collect4": "<strong>Basic technical data</strong> — the minimum needed to keep the service running and secure (e.g. a session token).",
      "pp.h2dont": "What we don't collect",
      "pp.dont1": "No advertising identifiers and no tracking pixels.",
      "pp.dont2": "No precise, continuous location tracking.",
      "pp.dont3": "No selling, renting, or trading your personal data — ever.",
      "pp.h2use": "How we use your information",
      "pp.use": "We use it only to make the service work: to show you relevant offers and requests nearby, to connect a surplus with a need, to let neighbors message each other, and to keep the network safe from abuse. That's it.",
      "pp.h2see": "What other neighbors can see",
      "pp.see": "Your display name, anything you choose to post, and your approximate area are visible to other neighbors so exchanges can happen. Your contact details and exact address are never shown. You decide what to share in each post.",
      "pp.h2share": "Sharing & third parties",
      "pp.share": "We don't sell your data. We share information only when strictly necessary to operate the service (for example, the hosting infrastructure that stores posts) or when required by law. Any provider we use is held to handling your data solely on our behalf.",
      "pp.h2retention": "Data retention",
      "pp.retention": "We keep your information for as long as your account is active. You can delete your posts at any time, and deleting your account removes your profile and content from the live service.",
      "pp.h2rights": "Your choices & rights",
      "pp.rights1": "Access, correct, or delete your profile and posts.",
      "pp.rights2": "Control your approximate location, or turn location matching off.",
      "pp.rights3": "Delete your account and the data tied to it.",
      "pp.h2children": "Children",
      "pp.children": "Myci is intended for the people on your street. If a younger neighbor uses it, we ask that a parent or guardian helps them and stays involved.",
      "pp.h2changes": "Changes to this policy",
      "pp.changes": "If we update this policy, we'll change the date above and, for meaningful changes, surface a notice in the app.",
      "pp.h2contact": "Contact",
      "pp.contact": "Questions about your privacy? Reach us at <a href=\"mailto:laura.riondet@gmail.com\">laura.riondet@gmail.com</a>.",
      "pp.seealso": "See also our <a href=\"/terms\">Terms of Service</a>.",

      // ── terms ──
      "tos.metaTitle": "Terms of Service — Myci",
      "tos.metaDesc": "The simple terms for using Myci: give first, be a good neighbor, and use the network in good faith.",
      "tos.eyebrow": "Be a good neighbor — that's most of it",
      "tos.h1": "Terms of Service",
      "tos.updated": "Last updated 14 June 2026",
      "tos.tldr": "<strong>In plain words:</strong> Give first, treat your neighbors well, share honestly, and use Myci in good faith. Exchanges happen directly between neighbors — Myci just helps you find each other.",
      "tos.lead": "By using Myci, you agree to these terms. They're meant to be readable, not lawyerly. Myci is a prototype built for the Green Hackathon 2026.",
      "tos.h2using": "1. Using Myci",
      "tos.using": "Myci is a give-first network that helps neighbors share tools, time, food, and skills. You may use it to make honest offers and requests, message neighbors, and arrange exchanges. You're responsible for what you post and do through your account.",
      "tos.h2good": "2. Be a good neighbor",
      "tos.goodLead": "You agree not to:",
      "tos.good1": "Harass, threaten, discriminate against, or endanger other neighbors.",
      "tos.good2": "Post anything illegal, unsafe, fraudulent, or misleading.",
      "tos.good3": "Use Myci to advertise, spam, or run a business as if it were mutual aid.",
      "tos.good4": "Offer items or services that are unsafe, stolen, or prohibited by law.",
      "tos.good5": "Misuse the platform, attempt to break its security, or collect others' data.",
      "tos.h2money": "3. No money changes hands",
      "tos.money": "Myci is built for sharing, lending, swapping, and giving — not for selling. There's no payment system, and Myci takes no cut of anything. Exchanges are gifts and favors between neighbors, made in good faith.",
      "tos.h2between": "4. Exchanges are between neighbors",
      "tos.between": "Myci helps you connect, but the actual exchange happens directly between you and another neighbor. We don't inspect, guarantee, or take responsibility for the items, services, or interactions arranged through the app. Use your judgement, meet safely, and treat borrowed things with care.",
      "tos.h2content": "5. Your content",
      "tos.content": "You keep ownership of what you post. By posting, you give Myci permission to display your content within the service so other neighbors can see and respond to it. You're responsible for having the right to share whatever you offer.",
      "tos.h2account": "6. Your account",
      "tos.account": "Keep your account details secure and don't impersonate anyone. We may suspend or remove accounts that break these terms or put other neighbors at risk.",
      "tos.h2asis": "7. The service is provided \"as is\"",
      "tos.asis": "Myci is an early prototype offered without warranties. To the fullest extent the law allows, we aren't liable for losses arising from exchanges between neighbors or from your use of the service. Nothing here removes rights you have under applicable law.",
      "tos.h2changes": "8. Changes",
      "tos.changes": "We may update these terms as Myci grows. We'll change the date above and, for meaningful changes, surface a notice in the app. Continuing to use Myci means you accept the updated terms.",
      "tos.h2contact": "9. Contact",
      "tos.contact": "Questions about these terms? Reach us at <a href=\"mailto:laura.riondet@gmail.com\">laura.riondet@gmail.com</a>.",
      "tos.seealso": "See also our <a href=\"/privacy\">Privacy Policy</a>.",
    },

    es: {
      "lang.name": "Español", "dir": "ltr",

      "nav.openApp": "Abrir la app",
      "skip": "Saltar al contenido",
      "lang.switchLabel": "Idioma",
      "footer.tagline": "Myci · toma prestado más, compra menos, conoce a tus vecinos",
      "footer.openApp": "Abrir la app",
      "footer.how": "Cómo funciona",
      "footer.privacy": "Privacidad",
      "footer.terms": "Términos",
      "footer.top": "Arriba",
      "footer.home": "Inicio",

      "meta.title": "Myci — toma prestado más, compra menos, conoce a tus vecinos",
      "meta.desc": "Myci es la red de ayuda mutua que da primero, para tu calle. Comparte herramientas, tiempo, comida y habilidades con los vecinos que ya tienes. Sin dinero, sin ubicación exacta, sin anuncios.",

      "hero.eyebrow": "Ayuda mutua, calle a calle",
      "hero.tagline": "Toma prestado más. Compra menos.<br />Conoce a tus vecinos.",
      "hero.subline": "La red que da primero, para tu calle: comparte herramientas, tiempo, comida y habilidades con las personas junto a las que ya vives.",
      "hero.join": "Únete a tu vecindario",
      "hero.see": "Mira cómo funciona",
      "hero.note": "sin dinero · sin anuncios · solo vecinos",

      "why.eyebrow": "Por qué Myci",
      "why.title": "Tu vecino tiene un taladro que necesitas.<br />Tú tienes la escalera que él no deja de pedir.",
      "why.lead": "Un buen taladro descansa en un garaje mientras tres personas de la misma calle compran el suyo. Los tomates de más se ablandan a dos puertas de alguien que los cocinaría encantado. Lo que tu calle necesita ya está en tu calle.",
      "why.punch": "<span class=\"hl\">Myci solo os ayuda a encontraros.</span>",
      "why.illusAlt": "Dos casas en una calle conectadas por un hilo subterráneo de micelio, compartiendo un tomate y un libro",

      "stat.doomKicker": "La estadística sombría",
      "stat.doomBig": "3 de 5",
      "stat.doomLabel": "no sabríamos nombrar a tres vecinos de nuestra propia calle.",
      "stat.proofKicker": "La prueba contraria",
      "stat.proofBig": "Un favor",
      "stat.proofLabel": "basta para cambiarlo. Presta el taladro, comparte los tomates — lo demás suele seguir.",

      "name.eyebrow": "¿Por qué &ldquo;Myci&rdquo;?",
      "name.mycBody": "La red subterránea de hilos que une todo un bosque — pasando en silencio comida y señales de árbol a árbol, para que nada se desperdicie y a nadie le falte. Así ya funciona un vecindario, en cuanto puedes verlo.",
      "name.cityBody": "Y es tuya — mi ciudad, mi calle, mi manzana. Hiperlocal por diseño, para que la ayuda esté siempre a un paseo corto, nunca una app llena de desconocidos al otro lado de la ciudad.",
      "name.foot": "Una red viva, arraigada justo donde vives.",

      "how.eyebrow": "Cómo funciona",
      "how.title": "Tres toques de desconocido a vecino.",
      "how.s1t": "Da primero",
      "how.s1b": "Empieza ofreciendo algo — una herramienta para prestar, una habilidad, verduras de más, una hora libre. Llegas como quien da, no quien pide.",
      "how.s2t": "Encuentra una coincidencia",
      "how.s2b": "Ve qué ofrecen y piden los vecinos cercanos: comida, herramientas, habilidades, transporte, energía — incluso residuos electrónicos.",
      "how.s3t": "Mira cómo crece",
      "how.s3b": "Cada intercambio dibuja un hilo entre dos hogares en tu mapa. Cuanto más comparte tu calle, más puede encontrar.",

      "share.eyebrow": "Qué puedes compartir",
      "share.title": "Si un vecino puede prescindir de algo, Myci puede pasarlo.",
      "share.lead": "No cambia dinero de manos. Solo el excedente cotidiano que una calle ya tiene, por fin encontrando la necesidad de al lado.",
      "share.c1": "Comida y platos de más",
      "share.c2": "Herramientas para prestar",
      "share.c3": "Habilidades y enseñanza",
      "share.c4": "Trueques e intercambios",
      "share.c5": "Una hora libre",
      "share.c6": "Reparaciones y residuos electrónicos",
      "share.c7": "Transporte y cuidado de niños",
      "share.c8": "Energía de sobra",

      "promise.eyebrow": "Lo que prometemos",
      "promise.title": "Hecho para todos en la calle.",
      "promise.p1t": "Funciona en cualquier calle",
      "promise.p1b": "El lugar, el idioma y lo que la gente comparte son solo ajustes. Pon Myci en cualquier vecindario, donde sea, y funciona.",
      "promise.p1k": "Funciona en todo el mundo",
      "promise.p2t": "Fácil a cualquier edad",
      "promise.p2b": "Texto grande, palabras claras, tres toques para unirse. Si sabes enviar un mensaje, sabes usar Myci — a los 12 o a los 92.",
      "promise.p2k": "Cualquier edad, sin manual",
      "promise.p3t": "Hecho para crecer",
      "promise.p3b": "Funciona sin conexión primero y mejora cuanto más lo usa tu calle. Sostiene una manzana hoy o una ciudad de diez mil mañana.",
      "promise.p3k": "Sin conexión y escalable",
      "promise.p4t": "Nunca eres el producto",
      "promise.p4b": "Sin anuncios. Nunca vendemos tus datos, y tu ubicación se difumina — nunca un punto exacto. Myci devuelve a quienes aparecen.",
      "promise.p4k": "Sin anuncios ni reventa de datos",

      "pattern.eyebrow": "¿Y después?",
      "pattern.title": "Empieza por tu calle.<br />Cualquier calle puede copiarlo.",
      "pattern.lead": "Demuéstralo en tu manzana, y lo mismo funciona en la de al lado — luego el vecindario, luego donde sea. Pequeño primero, y después en todas partes, como el micelio se extiende bajo el suelo del bosque.",
      "pattern.t1": "Tu calle",
      "pattern.t2": "+ la manzana siguiente",
      "pattern.t3": "+ el vecindario",
      "pattern.t4": "+ la ciudad",
      "pattern.t5": "+ donde sea",

      "final.title": "Da un poco.<br />Gana un vecindario.",
      "final.sub": "Basta un favor para empezar el hilo.",
      "final.cta": "Únete a tu vecindario",

      "pp.metaTitle": "Política de privacidad — Myci",
      "pp.metaDesc": "Cómo trata Myci tus datos: sin anuncios, sin reventa de datos, ubicación difuminada y la mínima información que necesitamos para conectar vecinos.",
      "pp.eyebrow": "La versión corta: nunca eres el producto",
      "pp.h1": "Política de privacidad",
      "pp.updated": "Última actualización: 14 de junio de 2026",
      "pp.tldr": "<strong>En pocas palabras:</strong> Myci funciona con la mínima información que necesitamos para conectarte con vecinos. Sin anuncios, sin vender tus datos, y tu ubicación siempre se difumina a un vecindario — nunca un punto exacto.",
      "pp.lead": "Esta política explica qué recopila Myci, por qué, y las opciones que tienes. Myci es un prototipo creado para el Green Hackathon 2026; mantenemos nuestras prácticas de datos deliberadamente mínimas.",
      "pp.h2collect": "Qué recopilamos",
      "pp.collect1": "<strong>Tu perfil</strong> — un nombre visible y, opcionalmente, una breve biografía y un avatar. Nunca se exige un nombre real.",
      "pp.collect2": "<strong>Ubicación aproximada</strong> — la zona general de tu calle para emparejarte con vecinos cercanos. Nunca guardamos ni compartimos un punto GPS exacto; las ubicaciones se difuminan antes de salir de tu dispositivo.",
      "pp.collect3": "<strong>Lo que publicas</strong> — las ofertas, peticiones y mensajes que eliges compartir, además de los intercambios que completas.",
      "pp.collect4": "<strong>Datos técnicos básicos</strong> — lo mínimo necesario para mantener el servicio en marcha y seguro (p. ej. un token de sesión).",
      "pp.h2dont": "Qué no recopilamos",
      "pp.dont1": "Sin identificadores publicitarios ni píxeles de rastreo.",
      "pp.dont2": "Sin rastreo de ubicación preciso y continuo.",
      "pp.dont3": "Sin vender, alquilar ni intercambiar tus datos personales — nunca.",
      "pp.h2use": "Cómo usamos tu información",
      "pp.use": "La usamos solo para que el servicio funcione: mostrarte ofertas y peticiones relevantes cerca, conectar un excedente con una necesidad, permitir que los vecinos se escriban y mantener la red a salvo del abuso. Eso es todo.",
      "pp.h2see": "Qué pueden ver otros vecinos",
      "pp.see": "Tu nombre visible, todo lo que eliges publicar y tu zona aproximada son visibles para otros vecinos para que ocurran los intercambios. Tus datos de contacto y tu dirección exacta nunca se muestran. Tú decides qué compartir en cada publicación.",
      "pp.h2share": "Compartir y terceros",
      "pp.share": "No vendemos tus datos. Compartimos información solo cuando es estrictamente necesario para operar el servicio (por ejemplo, la infraestructura de alojamiento que guarda las publicaciones) o cuando lo exige la ley. Cualquier proveedor que usemos está obligado a tratar tus datos únicamente en nuestro nombre.",
      "pp.h2retention": "Conservación de datos",
      "pp.retention": "Conservamos tu información mientras tu cuenta esté activa. Puedes borrar tus publicaciones en cualquier momento, y borrar tu cuenta elimina tu perfil y contenido del servicio en vivo.",
      "pp.h2rights": "Tus opciones y derechos",
      "pp.rights1": "Acceder, corregir o borrar tu perfil y tus publicaciones.",
      "pp.rights2": "Controlar tu ubicación aproximada, o desactivar el emparejamiento por ubicación.",
      "pp.rights3": "Borrar tu cuenta y los datos vinculados a ella.",
      "pp.h2children": "Menores",
      "pp.children": "Myci está pensado para la gente de tu calle. Si un vecino más joven lo usa, pedimos que un padre, madre o tutor le ayude y se mantenga involucrado.",
      "pp.h2changes": "Cambios en esta política",
      "pp.changes": "Si actualizamos esta política, cambiaremos la fecha de arriba y, para cambios importantes, mostraremos un aviso en la app.",
      "pp.h2contact": "Contacto",
      "pp.contact": "¿Preguntas sobre tu privacidad? Escríbenos a <a href=\"mailto:laura.riondet@gmail.com\">laura.riondet@gmail.com</a>.",
      "pp.seealso": "Consulta también nuestros <a href=\"/terms\">Términos de servicio</a>.",

      "tos.metaTitle": "Términos de servicio — Myci",
      "tos.metaDesc": "Los términos sencillos para usar Myci: da primero, sé buen vecino y usa la red de buena fe.",
      "tos.eyebrow": "Sé buen vecino — eso es casi todo",
      "tos.h1": "Términos de servicio",
      "tos.updated": "Última actualización: 14 de junio de 2026",
      "tos.tldr": "<strong>En pocas palabras:</strong> Da primero, trata bien a tus vecinos, comparte con honestidad y usa Myci de buena fe. Los intercambios ocurren directamente entre vecinos — Myci solo os ayuda a encontraros.",
      "tos.lead": "Al usar Myci, aceptas estos términos. Están pensados para leerse, no para abogados. Myci es un prototipo creado para el Green Hackathon 2026.",
      "tos.h2using": "1. Usar Myci",
      "tos.using": "Myci es una red que da primero y ayuda a los vecinos a compartir herramientas, tiempo, comida y habilidades. Puedes usarla para hacer ofertas y peticiones honestas, escribir a vecinos y organizar intercambios. Eres responsable de lo que publicas y haces a través de tu cuenta.",
      "tos.h2good": "2. Sé buen vecino",
      "tos.goodLead": "Aceptas no:",
      "tos.good1": "Acosar, amenazar, discriminar o poner en peligro a otros vecinos.",
      "tos.good2": "Publicar nada ilegal, inseguro, fraudulento o engañoso.",
      "tos.good3": "Usar Myci para anunciar, enviar spam o llevar un negocio como si fuera ayuda mutua.",
      "tos.good4": "Ofrecer artículos o servicios inseguros, robados o prohibidos por la ley.",
      "tos.good5": "Hacer mal uso de la plataforma, intentar romper su seguridad o recopilar datos de otros.",
      "tos.h2money": "3. No cambia dinero de manos",
      "tos.money": "Myci está hecho para compartir, prestar, intercambiar y dar — no para vender. No hay sistema de pago, y Myci no se queda con ninguna parte de nada. Los intercambios son regalos y favores entre vecinos, hechos de buena fe.",
      "tos.h2between": "4. Los intercambios son entre vecinos",
      "tos.between": "Myci te ayuda a conectar, pero el intercambio real ocurre directamente entre tú y otro vecino. No inspeccionamos, garantizamos ni asumimos responsabilidad por los artículos, servicios o interacciones organizados a través de la app. Usa tu criterio, queda con seguridad y trata con cuidado lo prestado.",
      "tos.h2content": "5. Tu contenido",
      "tos.content": "Conservas la propiedad de lo que publicas. Al publicar, das a Myci permiso para mostrar tu contenido dentro del servicio para que otros vecinos puedan verlo y responder. Eres responsable de tener el derecho de compartir lo que ofreces.",
      "tos.h2account": "6. Tu cuenta",
      "tos.account": "Mantén seguros los datos de tu cuenta y no suplantes a nadie. Podemos suspender o eliminar cuentas que incumplan estos términos o pongan en riesgo a otros vecinos.",
      "tos.h2asis": "7. El servicio se ofrece \"tal cual\"",
      "tos.asis": "Myci es un prototipo temprano ofrecido sin garantías. En la máxima medida que permite la ley, no somos responsables de pérdidas derivadas de intercambios entre vecinos o de tu uso del servicio. Nada de esto elimina los derechos que tengas según la ley aplicable.",
      "tos.h2changes": "8. Cambios",
      "tos.changes": "Podemos actualizar estos términos a medida que Myci crece. Cambiaremos la fecha de arriba y, para cambios importantes, mostraremos un aviso en la app. Seguir usando Myci significa que aceptas los términos actualizados.",
      "tos.h2contact": "9. Contacto",
      "tos.contact": "¿Preguntas sobre estos términos? Escríbenos a <a href=\"mailto:laura.riondet@gmail.com\">laura.riondet@gmail.com</a>.",
      "tos.seealso": "Consulta también nuestra <a href=\"/privacy\">Política de privacidad</a>.",
    },

    ar: {
      "lang.name": "العربية", "dir": "rtl",

      "nav.openApp": "افتح التطبيق",
      "skip": "تخطَّ إلى المحتوى",
      "lang.switchLabel": "اللغة",
      "footer.tagline": "Myci · استعِر أكثر، اشترِ أقل، اعرف جيرانك",
      "footer.openApp": "افتح التطبيق",
      "footer.how": "كيف يعمل",
      "footer.privacy": "الخصوصية",
      "footer.terms": "الشروط",
      "footer.top": "الأعلى",
      "footer.home": "الرئيسية",

      "meta.title": "Myci — استعِر أكثر، اشترِ أقل، اعرف جيرانك",
      "meta.desc": "‏Myci هي شبكة العون المتبادل التي تبدأ بالعطاء، لشارعك. شارك الأدوات والوقت والطعام والمهارات مع الجيران الذين لديك بالفعل. بلا مال، بلا موقع دقيق، بلا إعلانات.",

      "hero.eyebrow": "عون متبادل، شارعاً بعد شارع",
      "hero.tagline": "استعِر أكثر. اشترِ أقل.<br />اعرف جيرانك.",
      "hero.subline": "الشبكة التي تبدأ بالعطاء، لشارعك — شارك الأدوات والوقت والطعام والمهارات مع من تسكن بجوارهم بالفعل.",
      "hero.join": "انضم إلى حيّك",
      "hero.see": "شاهد كيف يعمل",
      "hero.note": "بلا مال · بلا إعلانات · جيران فقط",

      "why.eyebrow": "لماذا Myci",
      "why.title": "جارك لديه مثقاب تحتاجه.<br />وأنت لديك السُّلَّم الذي يستعيره دائماً.",
      "why.lead": "مثقاب جيد يقبع في مرآب واحد بينما يشتري ثلاثة في الشارع نفسه كلٌّ مثقابه. طماطم زائدة تذبل على بُعد بابين من شخص يطبخها بسرور. ما يحتاجه شارعك موجود في شارعك بالفعل.",
      "why.punch": "<span class=\"hl\">‏Myci فقط يساعدكم على إيجاد بعضكم.</span>",
      "why.illusAlt": "منزلان في شارع يربطهما خيط فطري تحت الأرض، يتشاركان طماطم وكتاباً",

      "stat.doomKicker": "الإحصائية المُقلِقة",
      "stat.doomBig": "٣ من ٥",
      "stat.doomLabel": "منا لا يستطيعون تسمية ثلاثة جيران في شارعهم نفسه.",
      "stat.proofKicker": "الدليل المضاد",
      "stat.proofBig": "معروف واحد",
      "stat.proofLabel": "يكفي لتغيير ذلك. أعِر المثقاب، شارِك الطماطم — والباقي عادةً ما يتبع.",

      "name.eyebrow": "لماذا &ldquo;Myci&rdquo;؟",
      "name.mycBody": "الشبكة الخيطية تحت الأرض التي تربط غابة بأكملها — تمرّر بهدوء الطعام والإشارات من شجرة إلى شجرة، فلا شيء يضيع ولا أحد يُحرَم. هكذا يعمل الحي بالفعل، حالما تستطيع رؤيته.",
      "name.cityBody": "وهي لك — مدينتي، شارعي، حارتي. محلية للغاية بالتصميم، فتكون المساعدة دائماً على بُعد مشية قصيرة، لا تطبيقاً مليئاً بالغرباء في الطرف الآخر من المدينة.",
      "name.foot": "شبكة حيّة، متجذّرة حيث تعيش تماماً.",

      "how.eyebrow": "كيف يعمل",
      "how.title": "ثلاث نقرات من غريب إلى جار.",
      "how.s1t": "أعطِ أولاً",
      "how.s1b": "ابدأ بعرض شيء — أداة تُعيرها، مهارة، خضار زائد، ساعة فراغ. تصل كمن يعطي، لا كمن يأخذ.",
      "how.s2t": "اعثر على تطابق",
      "how.s2b": "انظر ماذا يعرض ويطلب الجيران القريبون: طعام، أدوات، مهارات، توصيلات، طاقة — حتى النفايات الإلكترونية.",
      "how.s3t": "شاهده ينمو",
      "how.s3b": "كل تبادل يرسم خيطاً بين منزلين على خريطتك. كلما شارك شارعك أكثر، وجد أكثر.",

      "share.eyebrow": "ماذا يمكنك أن تشارك",
      "share.title": "إن كان لدى جار ما يفيض عنه، يستطيع Myci تمريره.",
      "share.lead": "لا مال يتبادل الأيدي. فقط الفائض اليومي الذي يملكه الشارع بالفعل، يلتقي أخيراً بالحاجة في الجوار.",
      "share.c1": "طعام ووجبات زائدة",
      "share.c2": "أدوات للإعارة",
      "share.c3": "مهارات وتعليم",
      "share.c4": "مقايضة وتبادل",
      "share.c5": "ساعة فراغ",
      "share.c6": "إصلاحات ونفايات إلكترونية",
      "share.c7": "توصيلات ورعاية أطفال",
      "share.c8": "طاقة فائضة",

      "promise.eyebrow": "ما نَعِد به",
      "promise.title": "مصنوع لكل من في الشارع.",
      "promise.p1t": "يعمل في أي شارع",
      "promise.p1b": "المكان واللغة وما يشاركه الناس كلها مجرد إعدادات. ضع Myci في أي حي، أينما كان، وسيعمل.",
      "promise.p1k": "يعمل في كل العالم",
      "promise.p2t": "سهل في أي عمر",
      "promise.p2b": "نص كبير، كلمات بسيطة، ثلاث نقرات للانضمام. إن كنت ترسل رسالة نصية، تستطيع استخدام Myci — في الثانية عشرة أو الثانية والتسعين.",
      "promise.p2k": "أي عمر، بلا دليل",
      "promise.p3t": "مبنيٌّ لينمو",
      "promise.p3b": "يعمل دون اتصال أولاً ويتحسّن كلما استخدمه شارعك أكثر. يحتمل حارة واحدة اليوم أو مدينة من عشرة آلاف غداً.",
      "promise.p3k": "يعمل دون اتصال ويتوسّع",
      "promise.p4t": "أنت لست المنتَج أبداً",
      "promise.p4b": "بلا إعلانات. لا نبيع بياناتك أبداً، وموقعك مموَّه — أبداً نقطة دقيقة. ‏Myci يردّ الجميل لمن يحضرون.",
      "promise.p4k": "بلا إعلانات ولا بيع بيانات",

      "pattern.eyebrow": "ثم ماذا؟",
      "pattern.title": "ابدأ بشارعك.<br />أي شارع يمكنه أن يحذو حذوه.",
      "pattern.lead": "أثبِته في حارتك، وينجح الأمر نفسه في الجوار — ثم الحي، ثم أي مكان. صغيراً أولاً، ثم في كل مكان، كما ينتشر الفطر تحت أرض الغابة.",
      "pattern.t1": "شارعك",
      "pattern.t2": "+ الحارة التالية",
      "pattern.t3": "+ الحي",
      "pattern.t4": "+ المدينة",
      "pattern.t5": "+ أي مكان",

      "final.title": "أعطِ قليلاً.<br />تكسب حيّاً كاملاً.",
      "final.sub": "يكفي معروف واحد لبدء الخيط.",
      "final.cta": "انضم إلى حيّك",

      "pp.metaTitle": "سياسة الخصوصية — Myci",
      "pp.metaDesc": "كيف يتعامل Myci مع بياناتك: بلا إعلانات، بلا بيع بيانات، موقع مموَّه، وأقل قدر من المعلومات نحتاجه لربط الجيران.",
      "pp.eyebrow": "النسخة المختصرة: أنت لست المنتَج أبداً",
      "pp.h1": "سياسة الخصوصية",
      "pp.updated": "آخر تحديث 14 يونيو 2026",
      "pp.tldr": "<strong>بكلمات بسيطة:</strong> يعمل Myci بأقل قدر من المعلومات نحتاجه لربطك بالجيران. بلا إعلانات، بلا بيع لبياناتك، وموقعك يُموَّه دائماً إلى حيّ — أبداً نقطة دقيقة.",
      "pp.lead": "توضّح هذه السياسة ما يجمعه Myci ولماذا، والخيارات المتاحة لك. ‏Myci نموذج أوّلي بُني لـ Green Hackathon 2026؛ ونُبقي ممارساتنا في البيانات قليلة عن قصد.",
      "pp.h2collect": "ما نجمعه",
      "pp.collect1": "<strong>ملفك الشخصي</strong> — اسم ظاهر، واختيارياً نبذة قصيرة وصورة رمزية. الاسم الحقيقي غير مطلوب أبداً.",
      "pp.collect2": "<strong>موقع تقريبي</strong> — المنطقة العامة لشارعك لنطابقك مع جيران قريبين. لا نخزّن أو نشارك نقطة GPS دقيقة أبداً؛ تُموَّه المواقع قبل أن تغادر جهازك.",
      "pp.collect3": "<strong>ما تنشره</strong> — العروض والطلبات والرسائل التي تختار مشاركتها، إضافةً إلى التبادلات التي تُكملها.",
      "pp.collect4": "<strong>بيانات تقنية أساسية</strong> — الحد الأدنى اللازم لإبقاء الخدمة تعمل وآمنة (مثل رمز الجلسة).",
      "pp.h2dont": "ما لا نجمعه",
      "pp.dont1": "بلا معرّفات إعلانية وبلا بكسلات تتبّع.",
      "pp.dont2": "بلا تتبّع دقيق ومستمر للموقع.",
      "pp.dont3": "بلا بيع أو تأجير أو مقايضة لبياناتك الشخصية — أبداً.",
      "pp.h2use": "كيف نستخدم معلوماتك",
      "pp.use": "نستخدمها فقط لجعل الخدمة تعمل: لنعرض لك عروضاً وطلبات قريبة ذات صلة، ولنربط فائضاً بحاجة، ولنتيح للجيران مراسلة بعضهم، ولنبقي الشبكة آمنة من الإساءة. هذا كل شيء.",
      "pp.h2see": "ما يستطيع الجيران الآخرون رؤيته",
      "pp.see": "اسمك الظاهر، وكل ما تختار نشره، ومنطقتك التقريبية مرئية للجيران الآخرين لتحدث التبادلات. تفاصيل اتصالك وعنوانك الدقيق لا تُعرض أبداً. أنت تقرّر ماذا تشارك في كل منشور.",
      "pp.h2share": "المشاركة والأطراف الثالثة",
      "pp.share": "لا نبيع بياناتك. نشارك المعلومات فقط عند الضرورة القصوى لتشغيل الخدمة (مثل بنية الاستضافة التي تخزّن المنشورات) أو عندما يقتضي القانون ذلك. أي مزوّد نستخدمه مُلزَم بمعالجة بياناتك نيابةً عنا فقط.",
      "pp.h2retention": "الاحتفاظ بالبيانات",
      "pp.retention": "نحتفظ بمعلوماتك ما دام حسابك نشطاً. يمكنك حذف منشوراتك في أي وقت، وحذف حسابك يزيل ملفك ومحتواك من الخدمة الحيّة.",
      "pp.h2rights": "خياراتك وحقوقك",
      "pp.rights1": "الوصول إلى ملفك ومنشوراتك أو تصحيحها أو حذفها.",
      "pp.rights2": "التحكم في موقعك التقريبي، أو إيقاف المطابقة بالموقع.",
      "pp.rights3": "حذف حسابك والبيانات المرتبطة به.",
      "pp.h2children": "الأطفال",
      "pp.children": "‏Myci مُعدٌّ لأهل شارعك. إذا استخدمه جار أصغر سناً، نرجو أن يساعده أحد الوالدين أو وليّ الأمر ويبقى مشاركاً.",
      "pp.h2changes": "تغييرات على هذه السياسة",
      "pp.changes": "إذا حدّثنا هذه السياسة، سنغيّر التاريخ أعلاه، وللتغييرات المهمة سنُظهر إشعاراً في التطبيق.",
      "pp.h2contact": "تواصل",
      "pp.contact": "أسئلة عن خصوصيتك؟ تواصل معنا على <a href=\"mailto:laura.riondet@gmail.com\">laura.riondet@gmail.com</a>.",
      "pp.seealso": "اطّلع أيضاً على <a href=\"/terms\">شروط الخدمة</a>.",

      "tos.metaTitle": "شروط الخدمة — Myci",
      "tos.metaDesc": "الشروط البسيطة لاستخدام Myci: أعطِ أولاً، كن جاراً طيباً، واستخدم الشبكة بحُسن نية.",
      "tos.eyebrow": "كن جاراً طيباً — هذا معظم الأمر",
      "tos.h1": "شروط الخدمة",
      "tos.updated": "آخر تحديث 14 يونيو 2026",
      "tos.tldr": "<strong>بكلمات بسيطة:</strong> أعطِ أولاً، عامل جيرانك بلطف، شارك بصدق، واستخدم Myci بحُسن نية. تحدث التبادلات مباشرةً بين الجيران — ‏Myci فقط يساعدكم على إيجاد بعضكم.",
      "tos.lead": "باستخدامك Myci، فإنك توافق على هذه الشروط. وُضعت لتُقرأ، لا لتكون قانونية معقّدة. ‏Myci نموذج أوّلي بُني لـ Green Hackathon 2026.",
      "tos.h2using": "١. استخدام Myci",
      "tos.using": "‏Myci شبكة تبدأ بالعطاء وتساعد الجيران على مشاركة الأدوات والوقت والطعام والمهارات. يمكنك استخدامها لتقديم عروض وطلبات صادقة، ومراسلة الجيران، وترتيب التبادلات. أنت مسؤول عمّا تنشره وتفعله عبر حسابك.",
      "tos.h2good": "٢. كن جاراً طيباً",
      "tos.goodLead": "توافق على ألّا:",
      "tos.good1": "تضايق أو تهدّد أو تميّز ضد جيران آخرين أو تعرّضهم للخطر.",
      "tos.good2": "تنشر أي شيء غير قانوني أو غير آمن أو احتيالي أو مضلّل.",
      "tos.good3": "تستخدم Myci للإعلان أو الإزعاج أو إدارة عمل تجاري كأنه عون متبادل.",
      "tos.good4": "تعرض أشياء أو خدمات غير آمنة أو مسروقة أو محظورة قانوناً.",
      "tos.good5": "تسيء استخدام المنصة أو تحاول كسر أمنها أو جمع بيانات الآخرين.",
      "tos.h2money": "٣. لا مال يتبادل الأيدي",
      "tos.money": "‏Myci مبنيّ للمشاركة والإعارة والتبادل والعطاء — لا للبيع. لا يوجد نظام دفع، ولا يأخذ Myci أي نسبة من أي شيء. التبادلات هدايا ومعروف بين الجيران، تُقدَّم بحُسن نية.",
      "tos.h2between": "٤. التبادلات بين الجيران",
      "tos.between": "يساعدك Myci على التواصل، لكن التبادل الفعلي يحدث مباشرةً بينك وبين جار آخر. لا نفحص أو نضمن أو نتحمّل مسؤولية الأشياء أو الخدمات أو التفاعلات المرتّبة عبر التطبيق. استخدم حُكمك، والتقِ بأمان، وعامل المُستعار بعناية.",
      "tos.h2content": "٥. محتواك",
      "tos.content": "تحتفظ بملكية ما تنشره. بنشرك، تمنح Myci إذناً لعرض محتواك داخل الخدمة ليراه الجيران الآخرون ويردّوا عليه. أنت مسؤول عن امتلاكك حق مشاركة ما تعرضه.",
      "tos.h2account": "٦. حسابك",
      "tos.account": "حافظ على أمان تفاصيل حسابك ولا تنتحل صفة أحد. قد نوقف أو نزيل الحسابات التي تخالف هذه الشروط أو تعرّض جيراناً آخرين للخطر.",
      "tos.h2asis": "٧. الخدمة مقدَّمة \"كما هي\"",
      "tos.asis": "‏Myci نموذج أوّلي مبكّر مقدَّم بلا ضمانات. إلى أقصى حدّ يسمح به القانون، لسنا مسؤولين عن خسائر ناتجة عن تبادلات بين الجيران أو عن استخدامك للخدمة. لا شيء هنا يزيل حقوقاً لك بموجب القانون المعمول به.",
      "tos.h2changes": "٨. التغييرات",
      "tos.changes": "قد نحدّث هذه الشروط مع نمو Myci. سنغيّر التاريخ أعلاه، وللتغييرات المهمة سنُظهر إشعاراً في التطبيق. الاستمرار في استخدام Myci يعني قبولك للشروط المحدَّثة.",
      "tos.h2contact": "٩. تواصل",
      "tos.contact": "أسئلة عن هذه الشروط؟ تواصل معنا على <a href=\"mailto:laura.riondet@gmail.com\">laura.riondet@gmail.com</a>.",
      "tos.seealso": "اطّلع أيضاً على <a href=\"/privacy\">سياسة الخصوصية</a>.",
    },
  };

  var SUPPORTED = Object.keys(STRINGS);

  function detectLang() {
    try {
      var saved = localStorage.getItem("myci.lang");
      if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
      var nav = (navigator.language || "en").toLowerCase().split("-")[0];
      if (SUPPORTED.indexOf(nav) !== -1) return nav;
    } catch (e) {}
    return "en";
  }

  var lang = detectLang();

  function dict() { return STRINGS[lang] || STRINGS.en; }
  function t(key) {
    var d = dict();
    if (d[key] != null) return d[key];
    return STRINGS.en[key] != null ? STRINGS.en[key] : key;
  }

  // Apply the active locale to every tagged node in the document.
  function apply() {
    var d = dict();
    document.documentElement.lang = lang;
    document.documentElement.dir = d.dir === "rtl" ? "rtl" : "ltr";

    // textContent
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    // innerHTML (content that carries its own inline markup: <br>, <strong>, <a>…)
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });
    // attributes — "attr=key;attr2=key2" (e.g. content=meta.desc; aria-label=…)
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var bits = pair.split("=");
        if (bits.length === 2) el.setAttribute(bits[0].trim(), t(bits[1].trim()));
      });
    });
  }

  function setLang(l) {
    if (SUPPORTED.indexOf(l) === -1 || l === lang) return;
    lang = l;
    try { localStorage.setItem("myci.lang", l); } catch (e) {}
    apply();
    syncSwitchers();
  }

  // Build the header language switcher into any [data-lang-switch] placeholder.
  function buildSwitchers() {
    document.querySelectorAll("[data-lang-switch]").forEach(function (host) {
      if (host.dataset.built) return;
      host.dataset.built = "1";
      host.classList.add("lang-switch");

      var globe = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      globe.setAttribute("viewBox", "0 0 24 24");
      globe.setAttribute("class", "lang-globe");
      globe.setAttribute("aria-hidden", "true");
      globe.innerHTML =
        '<circle cx="12" cy="12" r="9.2" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
        '<path d="M3 12h18M12 2.8c2.6 2.6 2.6 15.8 0 18.4M12 2.8c-2.6 2.6-2.6 15.8 0 18.4M4.7 6.5h14.6M4.7 17.5h14.6" ' +
        'fill="none" stroke="currentColor" stroke-width="1.4"/>';

      var sel = document.createElement("select");
      sel.setAttribute("aria-label", t("lang.switchLabel"));
      SUPPORTED.forEach(function (code) {
        var opt = document.createElement("option");
        opt.value = code;
        opt.textContent = STRINGS[code]["lang.name"];
        sel.appendChild(opt);
      });
      sel.value = lang;
      sel.addEventListener("change", function () { setLang(sel.value); });

      host.appendChild(globe);
      host.appendChild(sel);
    });
  }

  function syncSwitchers() {
    document.querySelectorAll("[data-lang-switch] select").forEach(function (sel) {
      sel.value = lang;
      sel.setAttribute("aria-label", t("lang.switchLabel"));
    });
  }

  function init() { buildSwitchers(); apply(); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
