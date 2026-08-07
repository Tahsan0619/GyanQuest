/**
 * Green Tech - Mission 1: Clean Energy
 */
import { labState, pulseFailFeedback, pulseSuccessFeedback } from "./lab-state.js";
import { sortSlotPositions, getActiveSession } from "./activity-controller.js";

const ACCENT = "#86efac";

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

function drawSun(ctx, x, y, on) {
  ctx.fillStyle = on ? "#fde047" : "#64748b";
  ctx.beginPath(); ctx.arc(x, y, 22, 0, Math.PI * 2); ctx.fill();
  if (on) {
    ctx.strokeStyle = "#facc15"; ctx.lineWidth = 3;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * 28, y + Math.sin(a) * 28);
      ctx.lineTo(x + Math.cos(a) * 38, y + Math.sin(a) * 38); ctx.stroke();
    }
  }
}
function drawTurbine(ctx, x, y, spin, on) {
  ctx.fillStyle = "#94a3b8"; ctx.fillRect(x - 4, y, 8, 50);
  ctx.save(); ctx.translate(x, y); ctx.rotate(spin);
  ctx.fillStyle = on ? "#86efac" : "#64748b";
  for (let i = 0; i < 3; i++) {
    ctx.rotate((Math.PI * 2) / 3);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(8, -36); ctx.lineTo(-8, -36); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}
function drawPanel(ctx, x, y, on) {
  ctx.fillStyle = on ? "#0ea5e9" : "#334155";
  roundRect(ctx, x - 40, y - 18, 80, 36, 4); ctx.fill();
  ctx.strokeStyle = "#86efac"; ctx.lineWidth = 2; ctx.stroke();
  ctx.strokeStyle = "rgba(15,23,42,0.5)";
  ctx.beginPath(); ctx.moveTo(x - 40, y); ctx.lineTo(x + 40, y);
  ctx.moveTo(x, y - 18); ctx.lineTo(x, y + 18); ctx.stroke();
}
function drawSmokeStack(ctx, x, y, dirty) {
  ctx.fillStyle = "#57534e"; roundRect(ctx, x - 14, y - 10, 28, 60, 4); ctx.fill();
  if (dirty) {
    ctx.fillStyle = "rgba(100,116,139,0.55)";
    ctx.beginPath(); ctx.arc(x, y - 24, 16, 0, Math.PI * 2); ctx.arc(x + 18, y - 36, 14, 0, Math.PI * 2); ctx.fill();
  }
}

export function registerCleanScenes(arena) {
  if (!arena?.registerScene) return;

  arena.registerScene("cleanMeet", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions } = api;
    labState.phase = opts.phase || labState.phase || "desk";
    setDescription("Clean Energy - sun and wind without smoke.");
    const props = { sun: { x: 0, y: 0 }, turb: { x: 0, y: 0 }, stack: { x: 0, y: 0 } };
    let inited = false, t0 = performance.now();
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout;
      const live = labState.phase || "desk";
      const clean = live === "glow" || live === "settle";
      drawBackdrop();
      if (!inited) {
        props.sun.x = w * 0.22; props.sun.y = h * 0.28;
        props.turb.x = w * 0.5; props.turb.y = h * 0.38;
        props.stack.x = w * 0.78; props.stack.y = h * 0.4;
        inited = true;
      }
      drawSun(ctx, props.sun.x, props.sun.y, clean);
      drawPanel(ctx, props.sun.x, props.sun.y + 55, clean);
      drawTurbine(ctx, props.turb.x, props.turb.y, clean ? (performance.now() - t0) / 400 : 0, clean);
      drawSmokeStack(ctx, props.stack.x, props.stack.y, !clean);
      const tips = {
        desk: "Drag sun, turbine, and smoky stack",
        glow: "Sun and wind power without smoke",
        settle: "Clean sources can light homes",
      };
      drawLabel(ctx, tips[live] || tips.desk, w * 0.5, layout.labelY);
      const hits = [];
      for (const [id, p] of Object.entries(props)) {
        hits.push({ id, shape: "rect", x: p.x, y: p.y, w: 90, h: 90, meta: { propId: id },
          onDrag(pt) { p.x = Math.max(50, Math.min(w - 50, pt.x)); p.y = Math.max(70, Math.min(layout.deskTop, pt.y)); } });
      }
      setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("cleanSort", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } = api;
    setDescription("Sort clean / smoky / other");
    const chips = [
      { id: "solar", short: "Solar panel", color: 0x38bdf8 },
      { id: "wind", short: "Wind turbine", color: 0x86efac },
      { id: "hydro", short: "Hydro dam", color: 0x22c55e },
      { id: "coal", short: "Coal smoke", color: 0x78716c },
      { id: "diesel", short: "Diesel generator", color: 0xf97316 },
      { id: "bat", short: "Battery store", color: 0xfbbf24 },
      { id: "wish", short: "Only wishing", color: 0x94a3b8 },
      { id: "candle", short: "Candle only", color: 0xa78bfa }
    ];
    const accept = {
      clean: ["solar", "wind", "hydro"],
      dirty: ["coal", "diesel"],
      other: ["bat", "wish", "candle"]
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
        { id: "clean", label: "Clean source", x: w * 0.020, y: zoneY, ww: w * 0.300, hh: zoneH, color: "#22c55e" },
        { id: "dirty", label: "Smoky source", x: w * 0.340, y: zoneY, ww: w * 0.300, hh: zoneH, color: "#f97316" },
        { id: "other", label: "Store / not", x: w * 0.660, y: zoneY, ww: w * 0.300, hh: zoneH, color: "#94a3b8" }
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
      const byZone = { clean: [], dirty: [], other: [] };
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
      drawLabel(ctx, "Sort clean / smoky / other", w * 0.5, layout.labelY);
      setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("cleanLab", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    setDescription("Dial clean power - smoke fades as clean rises.");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
        labState.heat = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
      }
    });
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout;
      const heat = labState.heat ?? 0.3;
      const clean = heat >= 0.55;
      drawBackdrop();
      drawSun(ctx, w * 0.22, h * 0.3, clean);
      drawPanel(ctx, w * 0.22, h * 0.48, clean);
      drawTurbine(ctx, w * 0.5, h * 0.36, heat * 8, clean);
      drawSmokeStack(ctx, w * 0.78, h * 0.4, !clean);
      // home lights
      ctx.fillStyle = clean ? "#fde68a" : "#334155";
      roundRect(ctx, w * 0.42, h * 0.58, 50, 36, 4); ctx.fill();
      const hx = w * 0.2 + heat * w * 0.6;
      ctx.fillStyle = "#86efac"; ctx.beginPath(); ctx.arc(hx, h * 0.78, 14, 0, Math.PI * 2); ctx.fill();
      drawLabel(ctx, clean ? "Clean power up - home lights without smoke" : "Drag to boost clean energy share", w * 0.5, layout.labelY);
      setHitRegions([{ id: "h", shape: "rect", x: hx, y: h * 0.78, w: 48, h: 48, meta: { action: "stretch" } }]);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("cleanRule", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription("Clean energy rule");
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout, prog = labState.tokenProgress || 0;
      drawBackdrop();
      ["Sun", "/", "wind", "power clean"].forEach((label, i) => {
        const x = w * 0.14 + i * (w * 0.2);
        ctx.fillStyle = i < prog ? "rgba(74,222,128,0.4)" : "rgba(15,23,42,0.9)";
        roundRect(ctx, x - 48, h * 0.36 - 18, 96, 36, 10); ctx.fill();
        ctx.fillStyle = "#e2e8f0"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.36);
      });
      drawSun(ctx, w * 0.35, h * 0.55, true); drawTurbine(ctx, w * 0.65, h * 0.5, 0.4, true);
      drawLabel(ctx, "Clean energy rule", w * 0.5, layout.labelY);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("cleanStretch", (api) => {
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
      drawPanel(ctx, w * 0.35, h * 0.4, true); drawTurbine(ctx, w * 0.65, h * 0.36, 0.5, true);
      const captions = {
        home: "Rooftop solar can feed home lights",
        school: "School yard wind demo turbine",
        street: "Solar street lamps at night",
        shop: "Shop signs on clean grid mix",
        lab: "Lab: compare panel vs smoky generator"
      };
      drawLabel(ctx, captions[mode] || mode, w * 0.5, layout.labelY);
      setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("cleanMyth", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    const myths = [
      { claim: "Solar only works in factories", truth: "Home rooftops can use solar panels too" },
      { claim: "Wind turbines make coal smoke", truth: "Wind power does not burn fuel for electricity" },
      { claim: "Clean energy cannot light a home", truth: "Sun and wind can power homes when systems connect" },
      { claim: "Batteries create energy from nothing", truth: "Batteries store energy gathered earlier" },
      { claim: "Coal smoke is required for all power", truth: "Many places mix or switch to cleaner sources" }
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

  arena.registerScene("cleanDrill", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription(labState.prompt || "Clean drill");
    setTick(() => {
      const w = api.width, h = api.height;
      drawBackdrop();
      drawLabel(ctx, labState.prompt || "Clean drill", w * 0.5, h * 0.2, { h: 32, font: "700 16px Segoe UI" });
      drawSun(ctx, w * 0.4, h * 0.42, true); drawTurbine(ctx, w * 0.65, h * 0.42, 0.4, true);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("cleanMastery", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription("Clean Champ!");
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout, locked = labState.masteryStep || 0;
      drawBackdrop();
      ["Meet", "Sort", "Lab", "Rule", "Myth", "Win"].forEach((label, i) => {
        const x = w * 0.1 + i * (w * 0.14);
        ctx.fillStyle = i < locked ? "#22c55e" : "rgba(148,163,184,0.35)";
        roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8); ctx.fill();
        ctx.fillStyle = "#0f172a"; ctx.font = "600 10px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.78);
      });
      drawSun(ctx, w * 0.4, h * 0.42, true); drawTurbine(ctx, w * 0.65, h * 0.42, 0.4, true);
      drawLabel(ctx, "Clean Champ!", w * 0.5, layout.labelY);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });
}
