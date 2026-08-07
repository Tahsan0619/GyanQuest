/**
 * Geometry \u00b7 Mission 1: Shape Studio - Canvas 2D scenes (Tiny Bits depth).
 * Triangle, square, circle props, side counts, BD shape stretch.
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
  ctx.fillStyle = opts.bg || "rgba(15, 23, 42, 0.92)";
  roundRect(ctx, x - tw / 2, y - bh / 2, tw, bh, 10);
  ctx.fill();
  ctx.strokeStyle = opts.border || "rgba(147,197,253,0.55)";
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.fillStyle = opts.color || "#dbeafe";
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
  ctx.fillStyle = `rgba(96,165,250,${Math.max(0, (until - performance.now()) / 380) * 0.22})`;
  ctx.fillRect(0, 0, w, h);
}

function drawTriangle(ctx, x, y, scale = 1, glow = false) {
  ctx.fillStyle = glow ? "#60a5fa" : "#3b82f6";
  ctx.beginPath();
  ctx.moveTo(x, y - 48 * scale);
  ctx.lineTo(x + 44 * scale, y + 36 * scale);
  ctx.lineTo(x - 44 * scale, y + 36 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#93c5fd"; ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = "#dbeafe"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center";
  ctx.fillText("3 sides", x, y + 56 * scale);
}
function drawSquareShape(ctx, x, y, scale = 1, glow = false) {
  const s = 70 * scale;
  ctx.fillStyle = glow ? "#60a5fa" : "#2563eb";
  roundRect(ctx, x - s / 2, y - s / 2, s, s, 4);
  ctx.fill();
  ctx.strokeStyle = "#93c5fd"; ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = "#dbeafe"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center";
  ctx.fillText("4 equal", x, y + s / 2 + 18);
}
function drawCircleShape(ctx, x, y, scale = 1, glow = false) {
  ctx.strokeStyle = glow ? "#93c5fd" : "#60a5fa";
  ctx.lineWidth = 5;
  ctx.beginPath(); ctx.arc(x, y, 40 * scale, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = "rgba(96,165,250,0.15)";
  ctx.beginPath(); ctx.arc(x, y, 40 * scale, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#dbeafe"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center";
  ctx.fillText("0 corners", x, y + 58 * scale);
}

export function registerShapeScenes(arena) {
  if (!arena?.registerScene) return;

  arena.registerScene("shapeMeet", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions } = api;
    labState.phase = opts.phase || labState.phase || "desk";
    setDescription("Shape Studio - sides and corners name shapes.");
    const props = { tri: { x: 0, y: 0 }, sq: { x: 0, y: 0 }, circ: { x: 0, y: 0 } };
    let inited = false;
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout;
      const live = labState.phase || "desk";
      const glow = live === "glow" || live === "settle";
      drawBackdrop();
      if (!inited) {
        props.tri.x = w * 0.22; props.tri.y = h * 0.42;
        props.sq.x = w * 0.5; props.sq.y = h * 0.42;
        props.circ.x = w * 0.78; props.circ.y = h * 0.42;
        inited = true;
      }
      ctx.fillStyle = "#1e3a8a";
      roundRect(ctx, w * 0.08, layout.deskTop - 8, w * 0.84, 18, 8);
      ctx.fill();
      drawTriangle(ctx, props.tri.x, props.tri.y, 1, glow);
      drawSquareShape(ctx, props.sq.x, props.sq.y, 1, glow);
      drawCircleShape(ctx, props.circ.x, props.circ.y, 1, glow);
      const tips = {
        desk: "Drag triangle, square, circle",
        glow: "Count sides: 3 \u00b7 4 \u00b7 round (0 corners)",
        settle: "Properties name the shape",
      };
      drawLabel(ctx, tips[live] || tips.desk, w * 0.5, layout.labelY);
      const hits = [];
      for (const [id, p] of Object.entries(props)) {
        hits.push({
          id, shape: "rect", x: p.x, y: p.y, w: 100, h: 110, meta: { propId: id },
          onDrag(pt) {
            p.x = Math.max(50, Math.min(w - 50, pt.x));
            p.y = Math.max(70, Math.min(layout.deskTop, pt.y));
          },
        });
      }
      setHitRegions(hits);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("shapeSort", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } = api;
    setDescription("Sort into triangle, square, circle, or not.");
    const chips = [
      { id: "yield", short: "Yield", color: 0x60a5fa },
      { id: "tile", short: "Tile", color: 0x3b82f6 },
      { id: "wheel", short: "Wheel", color: 0x93c5fd },
      { id: "roof", short: "Roof", color: 0x38bdf8 },
      { id: "pane", short: "Window", color: 0x2563eb },
      { id: "plate", short: "Plate", color: 0x7dd3fc },
      { id: "letter", short: "Letter", color: 0x94a3b8 },
      { id: "scrib", short: "Scribble", color: 0x78716c },
    ];
    const accept = {
      tri: ["yield", "roof"],
      sq: ["tile", "pane"],
      circ: ["wheel", "plate"],
      not: ["letter", "scrib"],
    };
    const cardPos = {}; chips.forEach((c) => (cardPos[c.id] = { x: 0, y: 0 }));
    let draggingId = null, lastZones = [];
    function placeChip(chipId, zoneId) {
      const okList = accept[zoneId] || [];
      if (!okList.includes(chipId)) { pulseFailFeedback(400); return false; }
      labState.placed = { ...(labState.placed || {}), [chipId]: zoneId };
      const session = getActiveSession();
      if (session?.dispatch) session.dispatch({ type: "PLACE_CHIP", chipId, zoneId, accept: okList });
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
        { id: "tri", label: "Triangle", x: w * 0.02, y: zoneY, ww: w * 0.23, hh: zoneH, color: "#60a5fa" },
        { id: "sq", label: "Square", x: w * 0.26, y: zoneY, ww: w * 0.23, hh: zoneH, color: "#3b82f6" },
        { id: "circ", label: "Circle", x: w * 0.5, y: zoneY, ww: w * 0.23, hh: zoneH, color: "#93c5fd" },
        { id: "not", label: "Not these", x: w * 0.74, y: zoneY, ww: w * 0.24, hh: zoneH, color: "#94a3b8" },
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
      const byZone = { tri: [], sq: [], circ: [], not: [] };
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
        ctx.fillStyle = labState.selectedId === c.id ? "rgba(96,165,250,0.4)" : "rgba(15,23,42,0.95)";
        roundRect(ctx, prev.x - 48, prev.y - 16, 96, 32, 8); ctx.fill();
        ctx.strokeStyle = "#" + c.color.toString(16).padStart(6, "0"); ctx.stroke();
        ctx.fillStyle = "#dbeafe"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(c.short, prev.x, prev.y);
        hits.push({ id: c.id, shape: "rect", x: prev.x, y: prev.y, w: 100, h: 36, meta: { chipId: c.id },
          onDrag(pt) { draggingId = c.id; prev.x = Math.max(30, Math.min(w - 30, pt.x)); prev.y = Math.max(30, Math.min(h - 30, pt.y)); } });
      });
      drawLabel(ctx, "Triangle \u00b7 Square \u00b7 Circle \u00b7 Not", w * 0.5, layout.labelY);
      setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("shapeLab", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    setDescription("Dial side-count clarity.");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
        labState.heat = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
        labState.sideCount = labState.heat < 0.33 ? 3 : labState.heat < 0.66 ? 4 : 0;
        labState.shapeKind = labState.sideCount === 3 ? "triangle" : labState.sideCount === 4 ? "square" : "circle";
      }
    });
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout;
      const heat = labState.heat ?? 0.3;
      const kind = labState.shapeKind || "triangle";
      drawBackdrop();
      if (kind === "triangle") drawTriangle(ctx, w * 0.5, h * 0.4, 1.1, heat > 0.5);
      else if (kind === "square") drawSquareShape(ctx, w * 0.5, h * 0.4, 1.1, heat > 0.5);
      else drawCircleShape(ctx, w * 0.5, h * 0.4, 1.1, heat > 0.5);
      const hx = w * 0.2 + heat * w * 0.6;
      ctx.fillStyle = "#60a5fa";
      ctx.beginPath(); ctx.arc(hx, h * 0.72, 14, 0, Math.PI * 2); ctx.fill();
      drawLabel(ctx, heat >= 0.6 ? "Properties clear: " + kind : "Drag - reveal side count", w * 0.5, layout.labelY);
      setHitRegions([{ id: "h", shape: "rect", x: hx, y: h * 0.72, w: 48, h: 48, meta: { action: "stretch" } }]);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("shapeRule", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription("Count sides + name.");
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout, prog = labState.tokenProgress || 0;
      drawBackdrop();
      ["Count", "sides", "+", "name"].forEach((label, i) => {
        const x = w * 0.18 + i * (w * 0.18);
        ctx.fillStyle = i < prog ? "rgba(96,165,250,0.4)" : "rgba(15,23,42,0.9)";
        roundRect(ctx, x - 44, h * 0.36 - 18, 88, 36, 10); ctx.fill();
        ctx.fillStyle = "#dbeafe"; ctx.font = "700 12px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.36);
      });
      drawTriangle(ctx, w * 0.3, h * 0.58, 0.85, true);
      drawSquareShape(ctx, w * 0.55, h * 0.58, 0.75, true);
      drawCircleShape(ctx, w * 0.78, h * 0.58, 0.75, true);
      drawLabel(ctx, "Shape rule", w * 0.5, layout.labelY);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("shapeStretch", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    const modes = ["signs", "tiles", "wheels", "kites", "windows"];
    setDescription("Same properties in Bangladesh shapes.");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_TAP" && intent.meta?.mode) { labState.mode = intent.meta.mode; pulseSuccessFeedback(200); }
    });
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout, mode = labState.mode || "signs";
      drawBackdrop();
      const hits = [];
      modes.forEach((m, i) => {
        const x = w * 0.12 + i * (w * 0.17);
        ctx.fillStyle = m === mode ? "rgba(96,165,250,0.4)" : "#1e3a8a";
        roundRect(ctx, x - 36, layout.deskTop - 36, 72, 48, 10); ctx.fill();
        ctx.fillStyle = "#dbeafe"; ctx.font = "600 11px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(m, x, layout.deskTop - 10);
        hits.push({ id: m, shape: "rect", x, y: layout.deskTop - 12, w: 72, h: 48, meta: { mode: m } });
      });
      drawTriangle(ctx, w * 0.28, h * 0.4, 0.9, true);
      drawCircleShape(ctx, w * 0.55, h * 0.4, 0.9, true);
      drawSquareShape(ctx, w * 0.78, h * 0.4, 0.8, true);
      const captions = {
        signs: "Road signs - triangles and circles",
        tiles: "Floor tiles - often squares",
        wheels: "Rickshaw wheels - circles",
        kites: "Kite outlines - triangles",
        windows: "Window panes - squares",
      };
      drawLabel(ctx, captions[mode], w * 0.5, layout.labelY);
      setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("shapeMyth", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    const myths = [
      { claim: "Every 4-sided shape is a square", truth: "Squares need equal sides and right angles" },
      { claim: "Circles have 4 corners", truth: "Circles are round - no corners" },
      { claim: "Triangles always look the same", truth: "Tall, wide, or right-angled - still 3 sides" },
      { claim: "Shape names are only for art", truth: "Signs, buildings, and tools use shape properties" },
      { claim: "Counting sides is useless", truth: "Side count is the first clue to the shape name" },
    ];
    setDescription("Bust shape myths.");
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
      ctx.fillStyle = phase === "truth" ? "rgba(96,165,250,0.2)" : "rgba(248,113,113,0.18)";
      roundRect(ctx, w * 0.12, h * 0.28, w * 0.76, h * 0.28, 16); ctx.fill();
      drawLabel(ctx, phase === "truth" ? m.truth : "Myth: " + m.claim, w * 0.5, h * 0.42, { h: 42, font: "700 13px Segoe UI" });
      drawLabel(ctx, "Myth " + (idx + 1) + " / 5 \u00b7 Tap to flip", w * 0.5, layout.labelY);
      setHitRegions([{ id: "card", shape: "rect", x: w * 0.5, y: h * 0.42, w: w * 0.76, h: h * 0.28, meta: { action: "flip" } }]);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("shapeDrill", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription(labState.prompt || "Shape drill");
    setTick(() => {
      const w = api.width, h = api.height;
      drawBackdrop();
      drawLabel(ctx, labState.prompt || "Shape drill", w * 0.5, h * 0.2, { h: 32, font: "700 16px Segoe UI" });
      drawTriangle(ctx, w * 0.5, h * 0.48, 1, true);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("shapeMastery", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription("Shape Scout mastery.");
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout, locked = labState.masteryStep || 0;
      drawBackdrop();
      ["Meet", "Sort", "Lab", "Rule", "Myth", "Scout"].forEach((label, i) => {
        const x = w * 0.1 + i * (w * 0.14);
        ctx.fillStyle = i < locked ? "#60a5fa" : "rgba(148,163,184,0.35)";
        roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8); ctx.fill();
        ctx.fillStyle = "#0f172a"; ctx.font = "600 10px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.78);
      });
      drawTriangle(ctx, w * 0.28, h * 0.4, 0.9, true);
      drawSquareShape(ctx, w * 0.52, h * 0.4, 0.85, true);
      drawCircleShape(ctx, w * 0.76, h * 0.4, 0.85, true);
      drawLabel(ctx, "Shape Scout!", w * 0.5, layout.labelY);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });
}
