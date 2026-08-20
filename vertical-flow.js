(function (global) {
  const LANE_NAMES = {
    ik: "İnsan Kaynakları",
    it: "IT Kullanıcısı",
    calisan: "Çalışan",
    onayci: "Onaycı",
    sistem: "Sistem",
    logo: "Logo ERP",
    ldap: "LDAP / AD",
  };

  function wrapLabel(label, max) {
    if (label.length <= max) return [label];
    const words = label.split(" ");
    const lines = [];
    let cur = "";
    words.forEach((w) => {
      const next = cur ? cur + " " + w : w;
      if (next.length > max && cur) {
        lines.push(cur);
        cur = w;
      } else cur = next;
    });
    if (cur) lines.push(cur);
    return lines.slice(0, 3);
  }

  function nodeSub(n) {
    if (n.sub) return n.sub;
    if (n.status) return n.status;
    return LANE_NAMES[n.lane] || "";
  }

  function fill(kind) {
    if (kind === "start" || kind === "end") return "var(--start)";
    if (kind === "decision") return "var(--decision)";
    if (kind === "exception") return "var(--exception)";
    if (kind === "auto" || kind === "integration") return "var(--system)";
    return "var(--process)";
  }

  function textFill(kind) {
    return kind === "start" || kind === "end" ? "var(--accent-text)" : "var(--text)";
  }

  function layout(flow) {
    const used = new Set();
    flow.edges.forEach((e) => {
      used.add(e.from);
      used.add(e.to);
    });
    const nodes = flow.nodes.filter((n) => used.has(n.id));
    const ids = nodes.map((n) => n.id);
    const incoming = Object.fromEntries(ids.map((id) => [id, []]));
    flow.edges.forEach((e) => {
      if (incoming[e.to]) incoming[e.to].push(e.from);
    });
    const rank = {};
    const visit = new Set();
    function getRank(id) {
      if (rank[id] != null) return rank[id];
      if (visit.has(id)) return 0;
      visit.add(id);
      const preds = incoming[id] || [];
      rank[id] = preds.length ? Math.max(...preds.map(getRank)) + 1 : 0;
      return rank[id];
    }
    ids.forEach(getRank);
    const byRank = {};
    ids.forEach((id) => {
      (byRank[rank[id]] ||= []).push(id);
    });
    const maxRank = Math.max(0, ...Object.keys(byRank).map(Number));
    const nodeWidth = 210;
    const nodeHeight = 78;
    const rankGap = 56;
    const nodeGap = 28;
    const padding = 40;
    let maxWidth = nodeWidth;
    for (let r = 0; r <= maxRank; r++) {
      const row = byRank[r] || [];
      maxWidth = Math.max(
        maxWidth,
        row.length * nodeWidth + Math.max(0, row.length - 1) * nodeGap
      );
    }
    const positions = {};
    for (let r = 0; r <= maxRank; r++) {
      const row = byRank[r] || [];
      const rowW = row.length * nodeWidth + Math.max(0, row.length - 1) * nodeGap;
      let x = padding + (maxWidth - rowW) / 2;
      const y = padding + r * (nodeHeight + rankGap);
      row.forEach((id) => {
        positions[id] = { x, y };
        x += nodeWidth + nodeGap;
      });
    }
    return {
      positions,
      nodeWidth,
      nodeHeight,
      width: maxWidth + padding * 2,
      height: padding * 2 + (maxRank + 1) * nodeHeight + maxRank * rankGap,
    };
  }

  function branchSide(label, index, count) {
    const s = (label || "").toLowerCase();
    if (
      s.includes("hayır") ||
      s.includes("red") ||
      s.includes("bakım") ||
      s.includes("hurda") ||
      s.includes("kullanılamaz") ||
      s.includes("1-2")
    )
      return "left";
    if (
      s.includes("evet") ||
      s.includes("onay") ||
      s.includes("uygun") ||
      s.includes("3. gün")
    )
      return "right";
    if (count === 2) return index === 0 ? "left" : "right";
    if (count === 3) return index === 0 ? "left" : index === 1 ? "bottom" : "right";
    return "bottom";
  }

  function anchor(pos, side, W, H) {
    const cx = pos.x + W / 2;
    const cy = pos.y + H / 2;
    if (side === "left") return { x: pos.x, y: cy };
    if (side === "right") return { x: pos.x + W, y: cy };
    if (side === "top") return { x: cx, y: pos.y };
    return { x: cx, y: pos.y + H };
  }

  function renderSwim(flow, title) {
    const L = layout(flow);
    const nodeMap = Object.fromEntries(flow.nodes.map((n) => [n.id, n]));
    const markerId = "m-" + String(title).replace(/\s+/g, "-");
    const outgoing = {};
    flow.edges.forEach((e) => {
      (outgoing[e.from] ||= []).push(e);
    });
    const sideOf = {};
    Object.keys(outgoing).forEach((from) => {
      const list = outgoing[from];
      list.forEach((e, i) => {
        sideOf[e.from + "->" + e.to] =
          list.length === 1 ? "bottom" : branchSide(e.label, i, list.length);
      });
      if (list.length === 2) {
        const a = sideOf[list[0].from + "->" + list[0].to];
        const b = sideOf[list[1].from + "->" + list[1].to];
        if (a === b) {
          sideOf[list[0].from + "->" + list[0].to] = "left";
          sideOf[list[1].from + "->" + list[1].to] = "right";
        }
      }
    });

    const lines = flow.edges
      .map((e) => {
        const a = L.positions[e.from];
        const b = L.positions[e.to];
        if (!a || !b) return "";
        const side = sideOf[e.from + "->" + e.to] || "bottom";
        const p1 = anchor(a, side, L.nodeWidth, L.nodeHeight);
        const p2 = anchor(b, "top", L.nodeWidth, L.nodeHeight);
        let d;
        if (side === "left" || side === "right") {
          const elbow = side === "left" ? p1.x - 18 : p1.x + 18;
          const midY = (p1.y + p2.y) / 2;
          d = `M ${p1.x} ${p1.y} L ${elbow} ${p1.y} L ${elbow} ${midY} L ${p2.x} ${midY} L ${p2.x} ${p2.y}`;
        } else {
          d = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
        }
        const color =
          e.tone === "no" ? "var(--no)" : e.tone === "yes" ? "var(--yes)" : "#9aa3ad";
        const lx =
          side === "left" ? p1.x - 22 : side === "right" ? p1.x + 22 : (p1.x + p2.x) / 2;
        const ly = side === "bottom" ? (p1.y + p2.y) / 2 - 6 : p1.y - 8;
        const lbl = e.label
          ? `<text x="${lx}" y="${ly}" text-anchor="middle" fill="${color}" font-size="11" font-weight="600">${e.label}</text>`
          : "";
        return `<g>
          <path d="${d}" fill="none" stroke="${color}" stroke-width="1.5" marker-end="url(#${markerId})" />
          ${lbl}
        </g>`;
      })
      .join("");

    const boxes = flow.nodes
      .filter((n) => L.positions[n.id])
      .map((n) => {
        const p = L.positions[n.id];
        const cx = p.x + L.nodeWidth / 2;
        const cy = p.y + L.nodeHeight / 2;
        const color = textFill(n.kind);
        const sub = nodeSub(n);
        const linesOf = wrapLabel(n.label, n.kind === "decision" ? 14 : 26);
        const shape =
          n.kind === "decision"
            ? `<polygon points="${cx},${p.y} ${p.x + L.nodeWidth},${cy} ${cx},${p.y + L.nodeHeight} ${p.x},${cy}" fill="${fill(n.kind)}" stroke="#9aa3ad" stroke-width="1.5" />`
            : `<rect x="${p.x}" y="${p.y}" width="${L.nodeWidth}" height="${L.nodeHeight}" rx="8" fill="${fill(n.kind)}" stroke="${n.kind === "start" || n.kind === "end" ? "var(--accent)" : "#9aa3ad"}" />`;
        const startY =
          sub && n.kind !== "decision"
            ? cy - 6 - (linesOf.length - 1) * 6
            : cy + 4 - linesOf.length * 7;
        const text = linesOf
          .map(
            (line, i) =>
              `<text x="${cx}" y="${startY + i * 14}" text-anchor="middle" fill="${color}" font-size="${n.kind === "decision" ? 11 : 12}" font-weight="600">${line}</text>`
          )
          .join("");
        const subText =
          sub && n.kind !== "decision"
            ? `<text x="${cx}" y="${cy + 18}" text-anchor="middle" fill="${n.kind === "start" || n.kind === "end" ? "#dbe4ff" : "#5c6570"}" font-size="10">${sub.length > 34 ? sub.slice(0, 32) + "…" : sub}</text>`
            : "";
        return `<g>${shape}${text}${subText}</g>`;
      })
      .join("");

    return `<div class="flow-wrap"><svg width="${L.width}" height="${L.height}">
        <defs><marker id="${markerId}" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#9aa3ad" />
        </marker></defs>
        ${lines}${boxes}
      </svg></div>`;
  }

  global.renderSwim = renderSwim;
})(window);
