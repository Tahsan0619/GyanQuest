/**
 * Web Dev Studio · Mission 1: HTML House - tags as rooms of a page.
 */
import { labState, pulseFailFeedback, pulseSuccessFeedback } from "./lab-state.js";
import { sortSlotPositions, getActiveSession } from "./activity-controller.js";

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}
function drawLabel(ctx, text, x, y, opts = {}) {
  ctx.font = opts.font || "600 14px Segoe UI, system-ui, sans-serif";
  const tw = Math.min(ctx.measureText(text).width + 24, opts.maxW || 540);
  const bh = opts.h || 26;
  ctx.fillStyle = opts.bg || "rgba(15,23,42,0.92)";
  roundRect(ctx, x - tw / 2, y - bh / 2, tw, bh, 10);
  ctx.fill();
  ctx.strokeStyle = opts.border || "rgba(251,146,60,0.55)";
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.fillStyle = opts.color || "#ffedd5";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y + 1);
}
function failFlash(ctx, w, h) {
  const until = labState.failPulse;
  if (!until || performance.now() > until) return;
  ctx.fillStyle = `rgba(248,113,113,${Math.max(0, (until - performance.now()) / 420) * 0.28})`;
  ctx.fillRect(0, 0, w, h);
}
function successFlash(ctx, w, h) {
  const until = labState.successPulse;
  if (!until || performance.now() > until) return;
  ctx.fillStyle = `rgba(251,146,60,${Math.max(0, (until - performance.now()) / 380) * 0.22})`;
  ctx.fillRect(0, 0, w, h);
}

/** House outline with optional room tags lighting up by heat/phase. */
function drawHtmlHouse(ctx, cx, cy, scale, heat, phase) {
  const s = scale;
  // roof
  ctx.fillStyle = "#c2410c";
  ctx.beginPath();
  ctx.moveTo(cx - 90 * s, cy - 20 * s);
  ctx.lineTo(cx, cy - 90 * s);
  ctx.lineTo(cx + 90 * s, cy - 20 * s);
  ctx.closePath();
  ctx.fill();
  // chimney
  ctx.fillStyle = "#9a3412";
  ctx.fillRect(cx + 40 * s, cy - 85 * s, 18 * s, 40 * s);
  // walls
  ctx.fillStyle = "#fed7aa";
  roundRect(ctx, cx - 80 * s, cy - 20 * s, 160 * s, 110 * s, 6 * s);
  ctx.fill();
  ctx.strokeStyle = "#ea580c";
  ctx.lineWidth = 2.5;
  ctx.stroke();
  // door
  ctx.fillStyle = "#9a3412";
  roundRect(ctx, cx - 18 * s, cy + 30 * s, 36 * s, 58 * s, 4 * s);
  ctx.fill();
  // windows
  const winOn = heat > 0.35 || phase === "glow" || phase === "settle";
  ctx.fillStyle = winOn ? "#fde68a" : "#78350f";
  roundRect(ctx, cx - 62 * s, cy - 5 * s, 32 * s, 28 * s, 3 * s);
  ctx.fill();
  roundRect(ctx, cx + 30 * s, cy - 5 * s, 32 * s, 28 * s, 3 * s);
  ctx.fill();
  // tag chips as rooms
  const tags = [
    { t: "<html>", x: cx, y: cy - 100 * s, need: 0 },
    { t: "<head>", x: cx - 55 * s, y: cy - 45 * s, need: 0.25 },
    { t: "<body>", x: cx + 55 * s, y: cy - 45 * s, need: 0.25 },
    { t: "<h1>", x: cx - 50 * s, y: cy + 20 * s, need: 0.5 },
    { t: "<p>", x: cx + 50 * s, y: cy + 20 * s, need: 0.65 },
    { t: "<img>", x: cx, y: cy + 55 * s, need: 0.8 },
  ];
  tags.forEach((tag) => {
    const on = heat >= tag.need || phase === "settle" || (phase === "glow" && tag.need <= 0.5);
    ctx.fillStyle = on ? "rgba(234,88,12,0.92)" : "rgba(15,23,42,0.55)";
    const tw = ctx.measureText ? Math.max(44, tag.t.length * 7) : 52;
    roundRect(ctx, tag.x - tw / 2, tag.y - 10, tw, 20, 6);
    ctx.fill();
    ctx.fillStyle = on ? "#fff7ed" : "#94a3b8";
    ctx.font = "700 10px Consolas, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(tag.t, tag.x, tag.y);
  });
}

function drawBrowserChrome(ctx, x, y, w, h, title) {
  ctx.fillStyle = "#1e293b";
  roundRect(ctx, x, y, w, h, 10);
  ctx.fill();
  ctx.fillStyle = "#334155";
  roundRect(ctx, x, y, w, 22, 10);
  ctx.fill();
  ctx.fillStyle = "#ef4444";
  ctx.beginPath(); ctx.arc(x + 12, y + 11, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#fbbf24";
  ctx.beginPath(); ctx.arc(x + 26, y + 11, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#22c55e";
  ctx.beginPath(); ctx.arc(x + 40, y + 11, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#94a3b8";
  ctx.font = "600 10px Segoe UI";
  ctx.textAlign = "left";
  ctx.fillText(title || "page.html", x + 54, y + 14);
}

export function registerHtmlScenes(arena) {
  if (!arena?.registerScene) return;
  const P = "html";

  arena.registerScene(P + "Meet", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions } = api;
    labState.phase = opts.phase || labState.phase || "desk";
    setDescription("HTML House - tags build the rooms of a page.");
    const props = {
      html: { x: 0, y: 0, label: "<html>" },
      head: { x: 0, y: 0, label: "<head>" },
      body: { x: 0, y: 0, label: "<body>" },
    };
    let inited = false;
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout;
      const live = labState.phase || "desk";
      const heat = labState.heat || 0.35;
      drawBackdrop();
      if (!inited) {
        props.html.x = w * 0.22; props.html.y = h * 0.42;
        props.head.x = w * 0.5; props.head.y = h * 0.36;
        props.body.x = w * 0.78; props.body.y = h * 0.42;
        inited = true;
      }
      drawBrowserChrome(ctx, w * 0.12, layout.deskTop - 20, w * 0.76, 16, "my-house.html");
      drawHtmlHouse(ctx, w * 0.5, h * 0.48, Math.min(w, h) / 420, heat, live);
      if (live === "glow" || live === "settle") {
        ctx.strokeStyle = "rgba(251,146,60,0.55)";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(props.html.x, props.html.y);
        ctx.lineTo(props.head.x, props.head.y);
        ctx.lineTo(props.body.x, props.body.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      for (const p of Object.values(props)) {
        ctx.fillStyle = live === "desk" ? "rgba(234,88,12,0.85)" : "rgba(251,146,60,0.95)";
        roundRect(ctx, p.x - 36, p.y - 14, 72, 28, 8);
        ctx.fill();
        ctx.fillStyle = "#fff7ed";
        ctx.font = "700 11px Consolas, monospace";
        ctx.textAlign = "center";
        ctx.fillText(p.label, p.x, p.y);
      }
      const tips = {
        desk: "Drag tags - they are the rooms of a page",
        glow: "<html> wraps · <head> meta · <body> what you see",
        settle: "Nested tags = a clear page house",
      };
      drawLabel(ctx, tips[live] || tips.desk, w * 0.5, layout.labelY);
      const hits = [];
      for (const [id, p] of Object.entries(props)) {
        hits.push({
          id, shape: "rect", x: p.x, y: p.y, w: 80, h: 36, meta: { propId: id },
          onDrag(pt) {
            p.x = Math.max(40, Math.min(w - 40, pt.x));
            p.y = Math.max(70, Math.min(layout.deskTop, pt.y));
          },
        });
      }
      setHitRegions(hits);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene(P + "Sort", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } = api;
    setDescription("Sort: structure tag, style/script, or not HTML?");
    const chips = [
      { id: "h1", short: "<h1>", color: 0xea580c },
      { id: "p", short: "<p>", color: 0xf97316 },
      { id: "img", short: "<img>", color: 0xfb923c },
      { id: "div", short: "<div>", color: 0xfdba74 },
      { id: "css", short: "color:red", color: 0x38bdf8 },
      { id: "js", short: "onclick", color: 0xa78bfa },
      { id: "cake", short: "Cake", color: 0xf472b6 },
      { id: "sock", short: "Sock", color: 0x94a3b8 },
    ];
    const accept = {
      struct: ["h1", "p", "img", "div"],
      style: ["css", "js"],
      not: ["cake", "sock"],
    };
    const cardPos = {}; chips.forEach((c) => (cardPos[c.id] = { x: 0, y: 0 }));
    let draggingId = null, lastZones = [];
    function placeChip(chipId, zoneId) {
      if (!(accept[zoneId] || []).includes(chipId)) { pulseFailFeedback(400); return false; }
      labState.placed = { ...(labState.placed || {}), [chipId]: zoneId };
      const session = getActiveSession();
      if (session?.dispatch) session.dispatch({ type: "PLACE_CHIP", chipId, zoneId, accept: accept[zoneId] });
      else labState._placedVersion = (labState._placedVersion || 0) + 1;
      pulseSuccessFeedback(220); return true;
    }
    function zoneAt(x, y) {
      for (const z of lastZones) if (x >= z.x && x <= z.x + z.ww && y >= z.y && y <= z.y + z.hh) return z.id;
      return null;
    }
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_DOWN" && intent.meta?.chipId) { draggingId = intent.meta.chipId; labState.selectedId = intent.meta.chipId; }
      if (intent.type === "CANVAS_DRAG" && intent.meta?.chipId && cardPos[intent.meta.chipId]) {
        draggingId = intent.meta.chipId; cardPos[intent.meta.chipId].x = intent.x; cardPos[intent.meta.chipId].y = intent.y;
      }
      if (intent.type === "CANVAS_TAP" && intent.meta?.chipId) labState.selectedId = intent.meta.chipId;
      if (intent.type === "CANVAS_TAP" && intent.meta?.zoneId && labState.selectedId) placeChip(labState.selectedId, intent.meta.zoneId);
      if (intent.type === "CANVAS_UP" && intent.meta?.chipId) {
        const zoneId = intent.dropMeta?.zoneId || zoneAt(intent.x, intent.y);
        if (zoneId) placeChip(intent.meta.chipId, zoneId);
        draggingId = null;
      } else if (intent.type === "CANVAS_UP") draggingId = null;
    });
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout;
      drawBackdrop();
      const zoneH = Math.max(100, Math.min(h * 0.28, 130));
      const zoneY = Math.max(layout.labelY + 28, h * 0.09);
      const zones = [
        { id: "struct", label: "Structure tag", x: w * 0.02, y: zoneY, ww: w * 0.31, hh: zoneH, color: "#ea580c" },
        { id: "style", label: "Style / script", x: w * 0.35, y: zoneY, ww: w * 0.31, hh: zoneH, color: "#38bdf8" },
        { id: "not", label: "Not HTML", x: w * 0.68, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#94a3b8" },
      ];
      lastZones = zones;
      const hits = [];
      for (const z of zones) {
        ctx.fillStyle = "rgba(15,23,42,0.75)"; roundRect(ctx, z.x, z.y, z.ww, z.hh, 12); ctx.fill();
        ctx.strokeStyle = z.color; ctx.lineWidth = 2.5; ctx.stroke();
        drawLabel(ctx, z.label, z.x + z.ww / 2, z.y + 16, { h: 20, font: "700 11px Segoe UI" });
        hits.push({ id: "zone-" + z.id, shape: "rect", x: z.x + z.ww / 2, y: z.y + z.hh / 2, w: z.ww, h: z.hh, meta: { zoneId: z.id, accept: accept[z.id] } });
      }
      const placed = labState.placed || {};
      const byZone = { struct: [], style: [], not: [] };
      chips.forEach((c) => { if (typeof placed[c.id] === "string" && byZone[placed[c.id]]) byZone[placed[c.id]].push(c.id); });
      const bankIds = chips.filter((c) => typeof placed[c.id] !== "string").map((c) => c.id);
      const ease = reducedMotion ? 1 : 0.18;
      chips.forEach((c) => {
        let targetX, targetY;
        const zoneKey = typeof placed[c.id] === "string" ? placed[c.id] : null;
        if (zoneKey && byZone[zoneKey]) {
          const z = zones.find((zz) => zz.id === zoneKey);
          const idx = byZone[zoneKey].indexOf(c.id);
          const slot = sortSlotPositions({ x: z.x, y: z.y + 18, w: z.ww, h: z.hh - 22 }, Math.max(byZone[zoneKey].length, 1), idx);
          targetX = slot.x; targetY = slot.y;
        } else {
          const idx = bankIds.indexOf(c.id);
          targetX = w * 0.14 + (idx % 4) * (w * 0.22);
          targetY = zoneY + zoneH + 36 + Math.floor(idx / 4) * 48;
        }
        const prev = cardPos[c.id];
        if (!prev.x && !prev.y) { prev.x = targetX; prev.y = targetY; }
        if (draggingId !== c.id) { prev.x += (targetX - prev.x) * ease; prev.y += (targetY - prev.y) * ease; }
        ctx.fillStyle = labState.selectedId === c.id ? "rgba(251,146,60,0.4)" : "rgba(15,23,42,0.95)";
        roundRect(ctx, prev.x - 48, prev.y - 16, 96, 32, 8); ctx.fill();
        ctx.strokeStyle = "#" + c.color.toString(16).padStart(6, "0"); ctx.stroke();
        ctx.fillStyle = "#ffedd5"; ctx.font = "700 11px Consolas, monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(c.short, prev.x, prev.y);
        hits.push({ id: c.id, shape: "rect", x: prev.x, y: prev.y, w: 100, h: 36, meta: { chipId: c.id },
          onDrag(pt) { draggingId = c.id; prev.x = Math.max(30, Math.min(w - 30, pt.x)); prev.y = Math.max(30, Math.min(h - 30, pt.y)); } });
      });
      drawLabel(ctx, "Structure · Style/script · Not HTML", w * 0.5, layout.labelY);
      setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene(P + "Lab", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    setDescription("Dial - open more rooms (tags) in the house.");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
        labState.heat = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
        labState.tagBuild = labState.heat;
      }
    });
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout;
      const heat = labState.heat ?? 0.3;
      drawBackdrop();
      drawBrowserChrome(ctx, w * 0.18, h * 0.12, w * 0.64, h * 0.52, "house.html");
      drawHtmlHouse(ctx, w * 0.5, h * 0.42, Math.min(w, h) / 480, heat, heat >= 0.6 ? "settle" : "glow");
      const hx = w * 0.2 + heat * w * 0.6;
      ctx.fillStyle = "#ea580c";
      ctx.beginPath(); ctx.arc(hx, h * 0.72, 14, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(234,88,12,0.35)";
      roundRect(ctx, w * 0.2, h * 0.72 - 4, w * 0.6, 8, 4);
      ctx.fill();
      drawLabel(ctx, heat >= 0.6 ? "Rooms open - page structure is clear" : "Drag - more tags = more rooms", w * 0.5, layout.labelY);
      setHitRegions([{ id: "h", shape: "rect", x: hx, y: h * 0.72, w: 48, h: 48, meta: { action: "stretch" } }]);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene(P + "Rule", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription("Tags nest and close - that is structure.");
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout, prog = labState.tokenProgress || 0;
      drawBackdrop();
      ["Tags", "Nest", "Close", "House"].forEach((label, i) => {
        const x = w * 0.18 + i * (w * 0.18);
        ctx.fillStyle = i < prog ? "rgba(234,88,12,0.45)" : "rgba(15,23,42,0.9)";
        roundRect(ctx, x - 44, h * 0.32 - 18, 88, 36, 10); ctx.fill();
        ctx.fillStyle = "#ffedd5"; ctx.font = "700 12px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.32);
      });
      drawHtmlHouse(ctx, w * 0.5, h * 0.58, Math.min(w, h) / 520, 0.85, "settle");
      drawLabel(ctx, "HTML House rule", w * 0.5, layout.labelY);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene(P + "Stretch", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    const modes = ["home", "school", "shop", "bd", "blog"];
    setDescription("Same tag house in pages you know.");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_TAP" && intent.meta?.mode) { labState.mode = intent.meta.mode; pulseSuccessFeedback(200); }
    });
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout, mode = labState.mode || "home";
      drawBackdrop();
      const hits = [];
      modes.forEach((m, i) => {
        const x = w * 0.12 + i * (w * 0.17);
        ctx.fillStyle = m === mode ? "rgba(251,146,60,0.45)" : "#1e293b";
        roundRect(ctx, x - 36, layout.deskTop - 36, 72, 48, 10); ctx.fill();
        ctx.fillStyle = "#ffedd5"; ctx.font = "600 11px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(m, x, layout.deskTop - 10);
        hits.push({ id: m, shape: "rect", x, y: layout.deskTop - 12, w: 72, h: 48, meta: { mode: m } });
      });
      drawHtmlHouse(ctx, w * 0.5, h * 0.42, Math.min(w, h) / 480, 0.7, "settle");
      const captions = {
        home: "Family homepage - still <html><body> rooms",
        school: "School notice board page - headings + paragraphs",
        shop: "Online shop - product cards are nested tags",
        bd: "BD news site - same tag house, Bangla text inside",
        blog: "Blog post - <h1> title, <p> story, <img> photo",
      };
      drawLabel(ctx, captions[mode], w * 0.5, layout.labelY);
      setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene(P + "Myth", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    const myths = [
      { claim: "HTML is only for experts", truth: "Kids can build page rooms with a few clear tags" },
      { claim: "Tags can stay open forever", truth: "Most tags need a matching close tag" },
      { claim: "Order of tags never matters", truth: "Nesting order builds the page house" },
      { claim: "CSS and HTML are the same", truth: "HTML = structure; CSS = look" },
      { claim: "One giant <div> is enough forever", truth: "Clear tags (h1, p, img) help people and browsers" },
    ];
    setDescription("Bust HTML myths.");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_TAP" && intent.meta?.action === "flip") {
        labState.mythPhase = labState.mythPhase === "truth" ? "claim" : "truth";
        if (labState.mythPhase === "truth") pulseSuccessFeedback(220);
      }
    });
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout;
      const idx = labState.myth ?? 0, phase = labState.mythPhase || "claim", m = myths[idx] || myths[0];
      drawBackdrop();
      ctx.fillStyle = phase === "truth" ? "rgba(251,146,60,0.22)" : "rgba(248,113,113,0.18)";
      roundRect(ctx, w * 0.12, h * 0.28, w * 0.76, h * 0.28, 16); ctx.fill();
      drawLabel(ctx, phase === "truth" ? m.truth : "Myth: " + m.claim, w * 0.5, h * 0.42, { h: 42, font: "700 13px Segoe UI" });
      drawLabel(ctx, "Myth " + (idx + 1) + " / 5 · Tap to flip", w * 0.5, layout.labelY);
      setHitRegions([{ id: "card", shape: "rect", x: w * 0.5, y: h * 0.42, w: w * 0.76, h: h * 0.28, meta: { action: "flip" } }]);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene(P + "Drill", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription(labState.prompt || "HTML drill");
    setTick(() => {
      const w = api.width, h = api.height;
      drawBackdrop();
      drawLabel(ctx, labState.prompt || "HTML House drill", w * 0.5, h * 0.18, { h: 32, font: "700 16px Segoe UI" });
      drawHtmlHouse(ctx, w * 0.5, h * 0.48, Math.min(w, h) / 460, 0.75, "settle");
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene(P + "Mastery", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription("HTML Builder mastery.");
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout, locked = labState.masteryStep || 0;
      drawBackdrop();
      ["Meet", "Sort", "Lab", "Rule", "Myth", "Build"].forEach((label, i) => {
        const x = w * 0.1 + i * (w * 0.14);
        ctx.fillStyle = i < locked ? "#ea580c" : "rgba(148,163,184,0.35)";
        roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8); ctx.fill();
        ctx.fillStyle = "#0f172a"; ctx.font = "600 10px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.78);
      });
      drawHtmlHouse(ctx, w * 0.5, h * 0.42, Math.min(w, h) / 460, 0.9, "settle");
      drawLabel(ctx, "HTML Builder!", w * 0.5, layout.labelY);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });
}
