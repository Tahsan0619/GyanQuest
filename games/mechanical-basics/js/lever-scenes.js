/**
 * Mechanical Basics - Mission 1: Levers & Gears
 */
import { labState, pulseFailFeedback, pulseSuccessFeedback } from "./lab-state.js";
import { sortSlotPositions, getActiveSession } from "./activity-controller.js";

const ACCENT = "#fdba74";

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

function drawLever(ctx, x, y, angle, heat) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#78716c";
  ctx.beginPath(); ctx.arc(0, 18, 10, 0, Math.PI * 2); ctx.fill();
  ctx.rotate(angle);
  ctx.strokeStyle = "#fdba74"; ctx.lineWidth = 8; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(-90, 0); ctx.lineTo(90, 0); ctx.stroke();
  ctx.fillStyle = "#38bdf8"; roundRect(ctx, -100, -14, 28, 28, 4); ctx.fill();
  ctx.fillStyle = "#f97316"; roundRect(ctx, 72, -18, 36, 36, 4); ctx.fill();
  ctx.restore();
  ctx.fillStyle = "#e2e8f0"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center";
  ctx.fillText("effort", x - 90, y - 28); ctx.fillText("load", x + 90, y - 28); ctx.fillText("fulcrum", x, y + 42);
}
function drawGear(ctx, x, y, r, rot, color) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.fillStyle = color;
  for (let i = 0; i < 8; i++) {
    ctx.rotate(Math.PI / 4);
    roundRect(ctx, -6, -r - 8, 12, 16, 2); ctx.fill();
  }
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#0f172a"; ctx.beginPath(); ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

export function registerLeverScenes(arena) {
  if (!arena?.registerScene) return;

  arena.registerScene("leverMeet", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions } = api;
    labState.phase = opts.phase || labState.phase || "desk";
    setDescription("Levers & Gears - fulcrum, load, effort.");
    const props = { beam: { x: 0, y: 0 }, g1: { x: 0, y: 0 }, g2: { x: 0, y: 0 } };
    let inited = false, t0 = performance.now();
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout;
      const live = labState.phase || "desk";
      const glow = live === "glow" || live === "settle";
      drawBackdrop();
      if (!inited) {
        props.beam.x = w * 0.28; props.beam.y = h * 0.42;
        props.g1.x = w * 0.62; props.g1.y = h * 0.4;
        props.g2.x = w * 0.78; props.g2.y = h * 0.4;
        inited = true;
      }
      const ang = glow ? Math.sin((performance.now() - t0) / 600) * 0.25 : -0.15;
      const rot = glow ? (performance.now() - t0) / 700 : 0;
      drawLever(ctx, props.beam.x, props.beam.y, ang, glow ? 0.8 : 0.3);
      drawGear(ctx, props.g1.x, props.g1.y, 28, rot, "#fdba74");
      drawGear(ctx, props.g2.x, props.g2.y, 18, -rot * 1.4, "#fbbf24");
      const tips = {
        desk: "Drag lever and gears - find fulcrum, load, effort",
        glow: "Long effort arm = easier lift; gears mesh and turn",
        settle: "Machines trade force, distance, and turn",
      };
      drawLabel(ctx, tips[live] || tips.desk, w * 0.5, layout.labelY);
      const hits = [];
      for (const [id, p] of Object.entries(props)) {
        hits.push({
          id, shape: "rect", x: p.x, y: p.y, w: 100, h: 80, meta: { propId: id },
          onDrag(pt) { p.x = Math.max(50, Math.min(w - 50, pt.x)); p.y = Math.max(70, Math.min(layout.deskTop, pt.y)); },
        });
      }
      setHitRegions(hits);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("leverSort", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } = api;
    setDescription("Sort lever / gear / neither");
    const chips = [
      { id: "see", short: "Seesaw", color: 0x38bdf8 },
      { id: "crow", short: "Crowbar", color: 0x22c55e },
      { id: "bike", short: "Bike gear", color: 0xfbbf24 },
      { id: "clock", short: "Clock gear", color: 0xfdba74 },
      { id: "glue", short: "Glue alone", color: 0x94a3b8 },
      { id: "mag", short: "Loose magnet", color: 0x78716c },
      { id: "scis", short: "Scissors", color: 0xa78bfa },
      { id: "ramp", short: "Ramp only", color: 0xf97316 }
    ];
    const accept = {
      lever: ["see", "crow", "scis"],
      gear: ["bike", "clock"],
      neither: ["glue", "mag", "ramp"]
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
        { id: "lever", label: "Lever", x: w * 0.020, y: zoneY, ww: w * 0.300, hh: zoneH, color: "#38bdf8" },
        { id: "gear", label: "Gear", x: w * 0.340, y: zoneY, ww: w * 0.300, hh: zoneH, color: "#fbbf24" },
        { id: "neither", label: "Neither", x: w * 0.660, y: zoneY, ww: w * 0.300, hh: zoneH, color: "#94a3b8" }
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
      const byZone = { lever: [], gear: [], neither: [] };
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
      drawLabel(ctx, "Sort lever / gear / neither", w * 0.5, layout.labelY);
      setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("leverLab", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    setDescription("Dial mechanical advantage - watch the load rise.");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
        labState.heat = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
      }
    });
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout;
      const heat = labState.heat ?? 0.3;
      drawBackdrop();
      const ang = -0.35 + heat * 0.55;
      drawLever(ctx, w * 0.35, h * 0.42, ang, heat);
      drawGear(ctx, w * 0.7, h * 0.4, 26, heat * 4, "#fdba74");
      drawGear(ctx, w * 0.82, h * 0.4, 16, -heat * 5.5, "#fbbf24");
      const hx = w * 0.2 + heat * w * 0.6;
      ctx.fillStyle = "#fdba74"; ctx.beginPath(); ctx.arc(hx, h * 0.72, 14, 0, Math.PI * 2); ctx.fill();
      drawLabel(ctx, heat >= 0.6 ? "Advantage rising - load lifts easier" : "Drag to boost mechanical advantage", w * 0.5, layout.labelY);
      setHitRegions([{ id: "h", shape: "rect", x: hx, y: h * 0.72, w: 48, h: 48, meta: { action: "stretch" } }]);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("leverRule", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription("Lever / gear rule");
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout, prog = labState.tokenProgress || 0;
      drawBackdrop();
      ["Lever", "trades", "force", "distance"].forEach((label, i) => {
        const x = w * 0.14 + i * (w * 0.2);
        ctx.fillStyle = i < prog ? "rgba(74,222,128,0.4)" : "rgba(15,23,42,0.9)";
        roundRect(ctx, x - 48, h * 0.36 - 18, 96, 36, 10); ctx.fill();
        ctx.fillStyle = "#e2e8f0"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.36);
      });
      drawLever(ctx, w * 0.5, h * 0.58, -0.2, 0.7);
      drawLabel(ctx, "Lever / gear rule", w * 0.5, layout.labelY);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("leverStretch", (api) => {
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
      drawLever(ctx, w * 0.35, h * 0.4, -0.2, 0.6); drawGear(ctx, w * 0.7, h * 0.4, 24, 0.4, '#fdba74');
      const captions = {
        home: "Bottle opener / scissors - lever at home",
        school: "Seesaw and science kit gears",
        street: "Crowbar lifting a drain cover",
        shop: "Bike shop - gear ratios on pedals",
        lab: "Lab: measure effort vs load arms"
      };
      drawLabel(ctx, captions[mode] || mode, w * 0.5, layout.labelY);
      setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("leverMyth", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    const myths = [
      { claim: "Levers only make things heavier", truth: "Levers trade distance for force - they help lift" },
      { claim: "Gears only look cool", truth: "Gears change speed and turn direction" },
      { claim: "Fulcrum position does not matter", truth: "Fulcrum place changes how hard you push" },
      { claim: "Only factories use levers", truth: "Seesaws, crowbars, and scissors are levers too" },
      { claim: "Bigger gear always means more force forever", truth: "Gear pairs trade speed and force together" }
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

  arena.registerScene("leverDrill", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription(labState.prompt || "Lever drill");
    setTick(() => {
      const w = api.width, h = api.height;
      drawBackdrop();
      drawLabel(ctx, labState.prompt || "Lever drill", w * 0.5, h * 0.2, { h: 32, font: "700 16px Segoe UI" });
      drawLever(ctx, w * 0.4, h * 0.48, -0.15, 0.7); drawGear(ctx, w * 0.7, h * 0.48, 22, 0.5, '#fdba74');
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("leverMastery", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription("Lever Learner!");
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout, locked = labState.masteryStep || 0;
      drawBackdrop();
      ["Meet", "Sort", "Lab", "Rule", "Myth", "Win"].forEach((label, i) => {
        const x = w * 0.1 + i * (w * 0.14);
        ctx.fillStyle = i < locked ? "#22c55e" : "rgba(148,163,184,0.35)";
        roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8); ctx.fill();
        ctx.fillStyle = "#0f172a"; ctx.font = "600 10px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.78);
      });
      drawLever(ctx, w * 0.4, h * 0.48, -0.15, 0.7); drawGear(ctx, w * 0.7, h * 0.48, 22, 0.5, '#fdba74');
      drawLabel(ctx, "Lever Learner!", w * 0.5, layout.labelY);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });
}
