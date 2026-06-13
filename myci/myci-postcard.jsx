// myci-postcard.jsx — the post card, with three tweakable treatments + sticker styles.

function ctaFor(type) {
  return {
    offer: "I'm interested", request: "I can help", skill_share: "I'm in",
    barter: "Offer a trade", event: "I'm coming", mutual_aid: "I can help",
  }[type] || "I'm interested";
}

function seedOf(id) {
  let s = 0; for (let i = 0; i < id.length; i++) s = (s * 31 + id.charCodeAt(i)) & 0xffff;
  return s;
}

function PostCard({ post, onOpen, cardStyle = "pinned", stickerStyle = "blob", index = 0 }) {
  const author = NEIGHBOR_BY_ID[post.authorId];
  const t = POST_TYPES[post.type];
  const seed = seedOf(post.id);
  const event = post.type === "event";
  const rot = cardStyle === "pinned" ? ((seed % 5) - 2) * 0.55 : 0;

  const surface = {
    position: "relative", borderRadius: 16, padding: "16px 16px 14px",
    background: "linear-gradient(180deg, #F3E8CF, #E8DCC8)",
    boxShadow: "0 4px 0 #cdb792, 0 10px 22px rgba(30,16,6,.22), inset 0 1px 0 rgba(255,255,255,.5)",
    border: "1px solid #ffffff55",
    transform: `rotate(${rot}deg)`,
    cursor: "pointer",
  };

  return (
    <article onClick={() => onOpen(post)} style={surface}>
      <Grain opacity={0.05} />
      {/* pushpin for pinned style */}
      {cardStyle === "pinned" && (
        <div style={{
          position: "absolute", top: -7, left: "50%", transform: "translateX(-50%)",
          width: 16, height: 16, borderRadius: "50%",
          background: "radial-gradient(circle at 35% 30%, #e7556a, #a52339)",
          boxShadow: "0 3px 5px rgba(30,16,6,.45), inset 0 1px 1px rgba(255,255,255,.6)",
          zIndex: 3,
        }} />
      )}
      {/* perforation for ticket style */}
      {cardStyle === "ticket" && (
        <div style={{
          position: "absolute", left: 12, right: 12, top: 52, height: 0,
          borderTop: "2px dashed #472c1c33",
        }} />
      )}

      {/* header */}
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", position: "relative" }}>
        <Sticker
          icon={post.icon} tone={t.tone} ink={t.ink} seed={seed}
          variant={stickerStyle} outline={event} size={52}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
            <TypeTag type={post.type} />
            <span style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 10.5, color: "#9a7a52" }}>
              {post.typeLabel}
            </span>
          </div>
          <h3 style={{
            margin: "7px 0 0", fontFamily: "'Trocchi', serif", fontWeight: 400,
            fontSize: 18.5, lineHeight: 1.18, color: "#2A1A0E", textWrap: "balance",
          }}>{post.title}</h3>
        </div>
      </div>

      {/* body */}
      <p style={{
        margin: "10px 0 0", fontFamily: "'Trocchi', serif", fontSize: 13.8,
        lineHeight: 1.5, color: "#4a3826",
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>{post.body}</p>

      {/* tags */}
      <div style={{ display: "flex", gap: 6, marginTop: 11, flexWrap: "wrap" }}>
        {post.tags.slice(0, 3).map((tg) => <Tag key={tg}>{tg}</Tag>)}
      </div>

      {/* divider */}
      <div style={{ height: 1, background: "#472c1c1a", margin: "13px 0 11px" }} />

      {/* footer */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar person={author} size={34} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Cutive', serif", fontSize: 13.5, color: "#2A1A0E", lineHeight: 1.1 }}>
            {author.name}
          </div>
          <div style={{ fontFamily: "'Cutive Mono', monospace", fontSize: 10, color: "#9a7a52", marginTop: 2 }}>
            <Icon name="map-pin" weight="bold" size={10} style={{ marginRight: 3, verticalAlign: "-1px" }} />
            {post.distance} · {post.when}
          </div>
        </div>
        <Btn small kind={event ? "dark" : post.type === "request" || post.type === "mutual_aid" ? "sage" : "primary"}
          onClick={(e) => { e.stopPropagation(); onOpen(post, true); }}>
          {ctaFor(post.type)}
        </Btn>
      </div>
    </article>
  );
}

Object.assign(window, { PostCard, ctaFor, seedOf });
