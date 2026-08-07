/**
 * Civil Basics - Mission 1: Strong Structures
 */
import { labState, pulseFailFeedback, pulseSuccessFeedback } from "./lab-state.js";
import { sortSlotPositions, getActiveSession } from "./activity-controller.js";

const ACCENT = "#a8a29e";

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
  ctx.strokeStyle = opts.border || ACCENT;
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.fillStyle = opts.color || "#e2e8f0";
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
  ctx.fillStyle = `rgba(74,222,128,${Math.max(0, (until - performance.now()) / 380) * 0.25})`;
  ctx.fillRect(0, 0, w, h);
}

function drawTriangle(ctx, x, y, s, strong) {
  ctx.strokeStyle = strong ? "#22c55e" : "#f97316";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x, y - s);
  ctx.lineTo(x - s * 0.9, y + s * 0.7);
  ctx.lineTo(x + s * 0.9, y + s * 0.7);
  ctx.closePath();
  ctx.stroke();
  if (strong) {
    ctx.beginPath();
    ctx.moveTo(x, y - s);
    ctx.lineTo(x, y + s * 0.7);
    ctx.stroke();
  }
}
function drawBase(ctx, x, y, w, good) {
  ctx.fillStyle = good ? "#78716c" : "#57534e";
  roundRect(ctx, x - w / 2, y, w, 14, 4);
  ctx.fill();
  ctx.strokeStyle = good ? "#22c55e" : "#ef4444";
  ctx.lineWidth = 2;
  ctx.stroke();
}
function drawBridge(ctx, x, y, heat) {
  const strong = heat >= 0.55;
  drawBase(ctx, x, y + 40, 160 + heat * 40, strong);
  drawTriangle(ctx, x - 40, y, 28, strong);
  drawTriangle(ctx, x + 40, y, 28, strong);
  ctx.strokeStyle = "#a8a29e"; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(x - 80, y + 20); ctx.lineTo(x + 80, y + 20); ctx.stroke();
  // load arrow
  ctx.fillStyle = "#fbbf24";
  ctx.fillRect(x - 10, y - 50 - (1 - heat) * 20, 20, 24);
  ctx.fillStyle = "#e2e8f0"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center";
  ctx.fillText("load", x, y - 60);
}

export function registerStructScenes(arena) {
  if (!arena?.registerScene) return;

  arena.registerScene("structMeet", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions } = api;
    labState.phase = opts.phase || labState.phase || "desk";
    setDescription("Strong Structures - triangles and bases.");
    const props = { left: { x: 0, y: 0 }, right: { x: 0, y: 0 } };
    let inited = false;
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout;
      const live = labState.phase || "desk";
      const strong = live === "glow" || live === "settle";
      drawBackdrop();
      if (!inited) { props.left.x = w * 0.3; props.left.y = h * 0.42; props.right.x = w * 0.7; props.right.y = h * 0.42; inited = true; }
      drawTriangle(ctx, props.left.x, props.left.y, 36, strong);
      drawBase(ctx, props.left.x, props.left.y + 40, strong ? 110 : 50, strong);
      // weak tower comparison
      ctx.strokeStyle = strong ? "#64748b" : "#ef4444"; ctx.lineWidth = 3;
      ctx.strokeRect(props.right.x - 12, props.right.y - 50, 24, 90);
      drawBase(ctx, props.right.x, props.right.y + 40, 40, false);
      const tips = {
        desk: "Drag frames - compare triangle vs tall skinny",
        glow: "Triangles + wide base share the load",
        settle: "Strong shapes keep bridges and towers safe",
      };
      drawLabel(ctx, tips[live] || tips.desk, w * 0.5, layout.labelY);
      const hits = [];
      for (const [id, p] of Object.entries(props)) {
        hits.push({ id, shape: "rect", x: p.x, y: p.y, w: 100, h: 100, meta: { propId: id },
          onDrag(pt) { p.x = Math.max(50, Math.min(w - 50, pt.x)); p.y = Math.max(70, Math.min(layout.deskTop, pt.y)); } });
      }
      setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("structSort", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } = api;
    setDescription("Sort strong / weak / not");
    const chips = [
      { id: "tri", short: "Triangle", color: 0x22c55e },
      { id: "wide", short: "Wide base", color: 0x38bdf8 },
      { id: "brace", short: "Cross brace", color: 0xfbbf24 },
      { id: "tall", short: "Tall skinny", color: 0xf97316 },
      { id: "nbrace", short: "No brace", color: 0xef4444 },
      { id: "tip", short: "Tippy stack", color: 0xa78bfa },
      { id: "cloud", short: "Cloud prop", color: 0x94a3b8 },
      { id: "song", short: "Only a song", color: 0x78716c }
    ];
    const accept = {
      strong: ["tri", "wide", "brace"],
      weak: ["tall", "nbrace", "tip"],
      not: ["cloud", "song"]
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
        { id: "strong", label: "Strong idea", x: w * 0.020, y: zoneY, ww: w * 0.300, hh: zoneH, color: "#22c55e" },
        { id: "weak", label: "Weak idea", x: w * 0.340, y: zoneY, ww: w * 0.300, hh: zoneH, color: "#f97316" },
        { id: "not", label: "Not structure", x: w * 0.660, y: zoneY, ww: w * 0.300, hh: zoneH, color: "#94a3b8" }
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
      const byZone = { strong: [], weak: [], not: [] };
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
          targetX = w * 0.12 + (idx % 4) * (w * 0.200);
          targetY = zoneY + zoneH + 36 + Math.floor(idx / 4) * 48;
        }
        const prev = cardPos[c.id];
        if (!prev.x && !prev.y) { prev.x = targetX; prev.y = targetY; }
        if (draggingId !== c.id) { prev.x += (targetX - prev.x) * ease; prev.y += (targetY - prev.y) * ease; }
        ctx.fillStyle = labState.selectedId === c.id ? "rgba(56,189,248,0.4)" : "rgba(15,23,42,0.95)";
        roundRect(ctx, prev.x - 48, prev.y - 16, 96, 32, 8); ctx.fill();
        ctx.strokeStyle = "#" + c.color.toString(16).padStart(6, "0"); ctx.stroke();
        ctx.fillStyle = "#e2e8f0"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(c.short, prev.x, prev.y);
        hits.push({ id: c.id, shape: "rect", x: prev.x, y: prev.y, w: 100, h: 36, meta: { chipId: c.id },
          onDrag(pt) { draggingId = c.id; prev.x = Math.max(30, Math.min(w - 30, pt.x)); prev.y = Math.max(30, Math.min(h - 30, pt.y)); } });
      });
      drawLabel(ctx, "Sort strong / weak / not", w * 0.5, layout.labelY);
      setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("structLab", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    setDescription("Dial strength - watch the bridge hold the load.");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
        labState.heat = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
      }
    });
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout;
      const heat = labState.heat ?? 0.3;
      drawBackdrop();
      drawBridge(ctx, w * 0.5, h * 0.4, heat);
      const hx = w * 0.2 + heat * w * 0.6;
      ctx.fillStyle = "#a8a29e"; ctx.beginPath(); ctx.arc(hx, h * 0.72, 14, 0, Math.PI * 2); ctx.fill();
      drawLabel(ctx, heat >= 0.6 ? "Strong - load path held by triangles" : "Drag to brace and widen the base", w * 0.5, layout.labelY);
      setHitRegions([{ id: "h", shape: "rect", x: hx, y: h * 0.72, w: 48, h: 48, meta: { action: "stretch" } }]);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("structRule", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription("Structure rule");
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout, prog = labState.tokenProgress || 0;
      drawBackdrop();
      ["Triangles", "+", "wide base", "carry load"].forEach((label, i) => {
        const x = w * 0.14 + i * (w * 0.2);
        ctx.fillStyle = i < prog ? "rgba(74,222,128,0.4)" : "rgba(15,23,42,0.9)";
        roundRect(ctx, x - 48, h * 0.36 - 18, 96, 36, 10); ctx.fill();
        ctx.fillStyle = "#e2e8f0"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.36);
      });
      drawBridge(ctx, w * 0.5, h * 0.55, 0.85);
      drawLabel(ctx, "Structure rule", w * 0.5, layout.labelY);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("structStretch", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    const modes = ["home", "school", "street", "shop", "lab"];
    setDescription("Same idea in places you know.");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_TAP" && intent.meta?.mode) { labState.mode = intent.meta.mode; pulseSuccessFeedback(200); }
    });
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout, mode = labState.mode || modes[0];
      drawBackdrop();
      const hits = [];
      modes.forEach((m, i) => {
        const x = w * 0.12 + i * (w * 0.17);
        ctx.fillStyle = m === mode ? "rgba(56,189,248,0.4)" : "#1e293b";
        roundRect(ctx, x - 36, layout.deskTop - 36, 72, 48, 10); ctx.fill();
        ctx.fillStyle = "#e2e8f0"; ctx.font = "600 11px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(m, x, layout.deskTop - 10);
        hits.push({ id: m, shape: "rect", x, y: layout.deskTop - 12, w: 72, h: 48, meta: { mode: m } });
      });
      drawBridge(ctx, w * 0.5, h * 0.4, 0.7);
      const captions = {
        home: "Shelf brackets and table legs need a stable base",
        school: "Model bridges in science class",
        street: "Road bridges use triangles and supports",
        shop: "Warehouse racks need bracing",
        lab: "Lab: load a triangle vs a rectangle frame"
      };
      drawLabel(ctx, captions[mode] || mode, w * 0.5, layout.labelY);
      setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("structMyth", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    const myths = [
      { claim: "Taller is always stronger", truth: "Tall skinny without braces can tip or buckle" },
      { claim: "Triangles are only for art class", truth: "Triangles lock shapes and carry load well" },
      { claim: "Base width does not matter", truth: "A wider base resists tipping" },
      { claim: "Braces are optional decoration", truth: "Braces share and redirect load paths" },
      { claim: "Only concrete matters, not shape", truth: "Shape and load path matter as much as material" }
    ];
    setDescription("Bust myths.");
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
      ctx.fillStyle = phase === "truth" ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.18)";
      roundRect(ctx, w * 0.12, h * 0.28, w * 0.76, h * 0.28, 16); ctx.fill();
      drawLabel(ctx, phase === "truth" ? m.truth : "Myth: " + m.claim, w * 0.5, h * 0.42, { h: 42, font: "700 13px Segoe UI" });
      drawLabel(ctx, "Myth " + (idx + 1) + " / 5  -  Tap to flip", w * 0.5, layout.labelY);
      setHitRegions([{ id: "card", shape: "rect", x: w * 0.5, y: h * 0.42, w: w * 0.76, h: h * 0.28, meta: { action: "flip" } }]);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("structDrill", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription(labState.prompt || "Structure drill");
    setTick(() => {
      const w = api.width, h = api.height;
      drawBackdrop();
      drawLabel(ctx, labState.prompt || "Structure drill", w * 0.5, h * 0.2, { h: 32, font: "700 16px Segoe UI" });
      drawBridge(ctx, w * 0.5, h * 0.48, 0.9);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("structMastery", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription("Structure Scout!");
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout, locked = labState.masteryStep || 0;
      drawBackdrop();
      ["Meet", "Sort", "Lab", "Rule", "Myth", "Win"].forEach((label, i) => {
        const x = w * 0.1 + i * (w * 0.14);
        ctx.fillStyle = i < locked ? "#22c55e" : "rgba(148,163,184,0.35)";
        roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8); ctx.fill();
        ctx.fillStyle = "#0f172a"; ctx.font = "600 10px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.78);
      });
      drawBridge(ctx, w * 0.5, h * 0.48, 0.9);
      drawLabel(ctx, "Structure Scout!", w * 0.5, layout.labelY);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });
}
