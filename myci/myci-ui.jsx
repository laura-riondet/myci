// myci-ui.jsx — shared visual primitives for Myci
// Sticker, Avatar, TypeTag, Tag, Btn, Grain, and mycelium thread helpers.

const { useState, useEffect, useRef, useMemo } = React;

// ---- Phosphor icon ----------------------------------------------------------
function Icon({ name, weight = "fill", size, style, className = "" }) {
  const wclass = weight === "regular" ? "ph" : `ph-${weight}`;
  return (
    <i
      className={`${wclass} ph-${name} ${className}`}
      style={{ fontSize: size, lineHeight: 1, display: "inline-block", ...style }}
    />
  );
}

// ---- Organic sticker --------------------------------------------------------
// Three tweakable treatments: blob (cut-paper), stamp (rubber-stamp ring), tag (kraft tag).
const BLOB_RADII = [
  "47% 53% 63% 37% / 55% 48% 52% 45%",
  "58% 42% 45% 55% / 48% 58% 42% 52%",
  "42% 58% 52% 48% / 60% 45% 55% 40%",
];
function blobFor(seed) {
  return BLOB_RADII[Math.abs(seed) % BLOB_RADII.length];
}

function Sticker({ icon, tone, ink, size = 56, seed = 0, variant = "blob", outline = false }) {
  const common = {
    width: size, height: size, display: "grid", placeItems: "center",
    flexShrink: 0, position: "relative",
  };
  if (variant === "stamp") {
    return (
      <div style={{ ...common }}>
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          border: `2.5px solid ${tone}`, boxShadow: `inset 0 0 0 3px ${tone}22`,
          opacity: 0.9,
        }} />
        <Icon name={icon} size={size * 0.48} style={{ color: tone }} />
      </div>
    );
  }
  if (variant === "tag") {
    return (
      <div style={{
        ...common, width: size * 1.04, borderRadius: 9,
        background: outline ? "#E8DCC8" : tone,
        boxShadow: "0 2px 5px rgba(30,16,6,.32), inset 0 1px 0 rgba(255,255,255,.28)",
        border: outline ? "1.5px solid #472C1C" : "none",
      }}>
        <div style={{
          position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)",
          width: 7, height: 7, borderRadius: "50%", background: "#2A1A0E55",
        }} />
        <Icon name={icon} size={size * 0.46} style={{ color: ink || "#2A1A0E", marginTop: 6 }} />
      </div>
    );
  }
  // blob (default)
  return (
    <div style={{
      ...common, borderRadius: blobFor(seed),
      background: outline ? "#E8DCC8" : tone,
      border: outline ? "2px solid #472C1C" : "none",
      boxShadow: "0 3px 6px rgba(30,16,6,.34), inset 0 2px 3px rgba(255,255,255,.32), inset 0 -3px 5px rgba(0,0,0,.12)",
      transform: `rotate(${(seed % 5) - 2}deg)`,
    }}>
      <Icon name={icon} size={size * 0.46} style={{ color: ink || "#2A1A0E" }} />
    </div>
  );
}

// ---- Avatar (initials, neumorphic disc) ------------------------------------
function Avatar({ person, size = 40, ring = false }) {
  if (!person) return null;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: `radial-gradient(circle at 32% 28%, ${person.tone}, ${shade(person.tone, -22)})`,
      display: "grid", placeItems: "center",
      color: "#2A1A0E", fontFamily: "var(--display)",
      fontSize: size * 0.34, letterSpacing: ".02em",
      boxShadow: ring
        ? `0 0 0 3px #FEF4D6, 0 2px 6px rgba(30,16,6,.4)`
        : `0 2px 5px rgba(30,16,6,.38), inset 0 2px 2px rgba(255,255,255,.4)`,
    }}>
      {person.initials}
    </div>
  );
}

// ---- Type tag (typewriter label chip) --------------------------------------
function TypeTag({ type, small = false }) {
  const t = POST_TYPES[type] || POST_TYPES.offer;
  return (
    <span style={{
      fontFamily: "'Cutive Mono', monospace", textTransform: "uppercase",
      fontSize: small ? 9.5 : 11, letterSpacing: ".12em",
      padding: small ? "2px 7px" : "3px 9px", borderRadius: 4,
      background: t.surface, color: t.ink, fontWeight: 700,
      boxShadow: "0 1px 2px rgba(30,16,6,.25)", whiteSpace: "nowrap",
    }}>
      {t.label}
    </span>
  );
}

function Tag({ children }) {
  return (
    <span style={{
      fontFamily: "'Cutive Mono', monospace", fontSize: 11, color: "#7A5A38",
      background: "#00000008", padding: "2px 7px", borderRadius: 5,
      border: "1px solid #472c1c1f", whiteSpace: "nowrap",
    }}>#{children}</span>
  );
}

// ---- Button -----------------------------------------------------------------
function Btn({ children, onClick, kind = "primary", icon, full = false, small = false, style = {} }) {
  const [down, setDown] = useState(false);
  const palettes = {
    primary:  { bg: "var(--accent)", fg: "#3A2410", sh: "#8a6f00" },
    sage:     { bg: "#8CA679", fg: "#1c2614", sh: "#5e7a4c" },
    ghost:    { bg: "#FEF4D6", fg: "#472C1C", sh: "#d8c8a6" },
    dark:     { bg: "#472C1C", fg: "#FEF4D6", sh: "#23150c" },
  };
  const p = palettes[kind] || palettes.primary;
  return (
    <button
      onClick={onClick}
      onPointerDown={() => setDown(true)}
      onPointerUp={() => setDown(false)}
      onPointerLeave={() => setDown(false)}
      style={{
        fontFamily: "'Cutive', serif", fontWeight: 400,
        fontSize: small ? 13.5 : 15.5, letterSpacing: ".01em",
        padding: small ? "8px 14px" : "13px 20px", borderRadius: 12,
        width: full ? "100%" : "auto", border: "none", cursor: "pointer",
        background: p.bg, color: p.fg,
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        boxShadow: down
          ? `inset 0 3px 6px ${p.sh}, inset 0 1px 2px rgba(0,0,0,.25)`
          : `0 3px 0 ${p.sh}, 0 5px 10px rgba(30,16,6,.28)`,
        transform: down ? "translateY(2px)" : "none",
        transition: "transform .06s, box-shadow .06s",
        ...style,
      }}
    >
      {icon && <Icon name={icon} size={small ? 16 : 19} />}
      {children}
    </button>
  );
}

// ---- Grain + paper texture overlays ----------------------------------------
const GRAIN_URL =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>`
  );

function Grain({ opacity = 0.06, blend = "multiply", style = {} }) {
  return (
    <div aria-hidden className="om-grain" style={{
      position: "absolute", inset: 0, pointerEvents: "none",
      backgroundImage: `url("${GRAIN_URL}")`, backgroundSize: "160px 160px",
      opacity, mixBlendMode: blend, ...style,
    }} />
  );
}

// ---- Mycelium thread geometry ----------------------------------------------
// Organic curved path between two points; deterministic wobble from a seed.
function threadPath(x1, y1, x2, y2, seed = 1) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len, ny = dx / len;
  const wobble = ((seed * 37) % 10) - 5; // -5..4
  const off = (len * 0.10) + wobble;
  const c1x = x1 + dx * 0.3 + nx * off, c1y = y1 + dy * 0.3 + ny * off;
  const c2x = x1 + dx * 0.7 + nx * off * 0.7, c2y = y1 + dy * 0.7 + ny * off * 0.7;
  return `M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`;
}

// Image slot. With `src` it shows a real photo (the striped weave shows through
// while it loads / if it fails); without one it stays a labelled placeholder.
function PhotoSlot({ label, src, alt, height = 150, radius = 12 }) {
  const [failed, setFailed] = useState(false);
  const showImg = src && !failed;
  return (
    <div style={{
      height, borderRadius: radius, overflow: "hidden", position: "relative",
      background:
        "repeating-linear-gradient(135deg, #e3d4ba 0 14px, #dccbac 14px 28px)",
      border: "1px solid #472c1c22",
      display: "grid", placeItems: "center",
    }}>
      {showImg && (
        <img
          src={src} alt={alt || label} loading="lazy" onError={() => setFailed(true)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      )}
      {!showImg && (
        <span style={{
          fontFamily: "'Cutive Mono', monospace", fontSize: 11.5, color: "#8a6f4a",
          letterSpacing: ".05em", textTransform: "lowercase", padding: "0 16px", textAlign: "center",
        }}>{label}</span>
      )}
    </div>
  );
}

// ---- small color util -------------------------------------------------------
function shade(hex, amt) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  let r = (n >> 16) + amt, g = ((n >> 8) & 255) + amt, b = (n & 255) + amt;
  r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

Object.assign(window, {
  Icon, Sticker, Avatar, TypeTag, Tag, Btn, Grain, PhotoSlot,
  threadPath, blobFor, shade, GRAIN_URL,
});
