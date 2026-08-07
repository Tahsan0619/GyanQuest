/**
 * Mechanical Basics - Mission 3: Forces at Work
 */
import { labState, pulseFailFeedback, pulseSuccessFeedback } from "./lab-state.js";
import { sortSlotPositions, getActiveSession } from "./activity-controller.js";

const ACCENT = "#f97316";

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

function drawCrate(ctx, x, y, moved) {
  ctx.fillStyle = "#a16207"; roundRect(ctx, x - 36, y - 28, 72, 56, 6); ctx.fill();
  ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = "#fde68a"; ctx.font = "700 12px Segoe UI"; ctx.textAlign = "center";
  ctx.fillText(moved ? "moved!" : "crate", x, y);
}
function drawArrow(ctx, x1, y1, x2, y2, color) {
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  const a = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath(); ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 12 * Math.cos(a - 0.4), y2 - 12 * Math.sin(a - 0.4));
  ctx.lineTo(x2 - 12 * Math.cos(a + 0.4), y2 - 12 * Math.sin(a + 0.4));
  ctx.closePath(); ctx.fill();
}

export function registerWorkScenes(arena) {
  if (!arena?.registerScene) return;

  arena.registerScene("workMeet", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions } = api;
    labState.phase = opts.phase || labState.phase || "desk";
    setDescription("Forces at Work - force through a distance.");
    const props = { crate: { x: 0, y: 0 } };
    let inited = false;
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout;
      const live = labState.phase || "desk";
      const moved = live === "glow" || live === "settle";
      drawBackdrop();
      if (!inited) { props.crate.x = w * (moved ? 0.62 : 0.35); props.crate.y = h * 0.45; inited = true; }
      if (moved && props.crate.x < w * 0.62) props.crate.x += (w * 0.62 - props.crate.x) * 0.08;
      drawArrow(ctx, w * 0.18, h * 0.45, props.crate.x - 50, h * 0.45, "#f97316");
      drawCrate(ctx, props.crate.x, props.crate.y, moved);
      ctx.fillStyle = "#e2e8f0"; ctx.font = "700 12px Segoe UI"; ctx.textAlign = "center";
      ctx.fillText("F", w * 0.2, h * 0.38); ctx.fillText("d", w * 0.5, h * 0.58);
      const tips = {
        desk: "Force arrow + crate - will it move a distance?",
        glow: "Force through a distance = work done",
        settle: "Push a wall with no move = force, not work",
      };
      drawLabel(ctx, tips[live] || tips.desk, w * 0.5, layout.labelY);
      setHitRegions([{ id: "crate", shape: "rect", x: props.crate.x, y: props.crate.y, w: 90, h: 70, meta: { propId: "crate" },
        onDrag(pt) { props.crate.x = Math.max(50, Math.min(w - 50, pt.x)); props.crate.y = Math.max(70, Math.min(layout.deskTop, pt.y)); } }]);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("workSort", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } = api;
    setDescription("Sort work / force-only / neither");
    const chips = [
      { id: "push", short: "Push crate far", color: 0x22c55e },
      { id: "lift", short: "Lift bag up", color: 0x38bdf8 },
      { id: "pull", short: "Pull wagon", color: 0xfbbf24 },
      { id: "wall", short: "Push wall", color: 0xf97316 },
      { id: "hold", short: "Hold still", color: 0xa78bfa },
      { id: "sit", short: "Sit resting", color: 0x94a3b8 },
      { id: "dream", short: "Just thinking", color: 0x78716c },
      { id: "slide", short: "Slide box", color: 0x4ade80 }
    ];
    const accept = {
      work: ["push", "lift", "pull", "slide"],
      force: ["wall", "hold"],
      none: ["sit", "dream"]
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
        { id: "work", label: "Does work", x: w * 0.020, y: zoneY, ww: w * 0.300, hh: zoneH, color: "#22c55e" },
        { id: "force", label: "Force, no work", x: w * 0.340, y: zoneY, ww: w * 0.300, hh: zoneH, color: "#f97316" },
        { id: "none", label: "Neither", x: w * 0.660, y: zoneY, ww: w * 0.300, hh: zoneH, color: "#94a3b8" }
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
      const byZone = { work: [], force: [], none: [] };
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
      drawLabel(ctx, "Sort work / force-only / neither", w * 0.5, layout.labelY);
      setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("workLab", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    setDescription("Dial force x distance - watch work grow.");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
        labState.heat = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
      }
    });
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout;
      const heat = labState.heat ?? 0.3;
      drawBackdrop();
      const cx = w * 0.28 + heat * w * 0.4;
      drawArrow(ctx, w * 0.16, h * 0.42, cx - 44, h * 0.42, "#f97316");
      drawCrate(ctx, cx, h * 0.42, heat >= 0.55);
      ctx.fillStyle = "#fde68a"; ctx.font = "700 14px Segoe UI"; ctx.textAlign = "center";
      ctx.fillText("W = F x d  (~" + Math.round(heat * 100) + "%)", w * 0.5, h * 0.62);
      const hx = w * 0.2 + heat * w * 0.6;
      ctx.fillStyle = "#f97316"; ctx.beginPath(); ctx.arc(hx, h * 0.72, 14, 0, Math.PI * 2); ctx.fill();
      drawLabel(ctx, heat >= 0.6 ? "Work rising - crate travels farther" : "Drag to increase force x distance", w * 0.5, layout.labelY);
      setHitRegions([{ id: "h", shape: "rect", x: hx, y: h * 0.72, w: 48, h: 48, meta: { action: "stretch" } }]);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("workRule", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription("Work rule");
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout, prog = labState.tokenProgress || 0;
      drawBackdrop();
      ["Work", "=", "force", "x distance"].forEach((label, i) => {
        const x = w * 0.14 + i * (w * 0.2);
        ctx.fillStyle = i < prog ? "rgba(74,222,128,0.4)" : "rgba(15,23,42,0.9)";
        roundRect(ctx, x - 48, h * 0.36 - 18, 96, 36, 10); ctx.fill();
        ctx.fillStyle = "#e2e8f0"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.36);
      });
      drawCrate(ctx, w * 0.5, h * 0.58, true);
      drawLabel(ctx, "Work rule", w * 0.5, layout.labelY);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("workStretch", (api) => {
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
      drawCrate(ctx, w * 0.5, h * 0.4, true); drawArrow(ctx, w*0.28, h*0.4, w*0.42, h*0.4, '#f97316');
      const captions = {
        home: "Carry grocery bags up stairs - work!",
        school: "Push desks across the room",
        street: "Rickshaw pulls a load a distance",
        shop: "Lift crates onto a shelf",
        lab: "Lab: measure force and distance"
      };
      drawLabel(ctx, captions[mode] || mode, w * 0.5, layout.labelY);
      setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("workMyth", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    const myths = [
      { claim: "Any push is always work", truth: "Work needs force AND distance in that direction" },
      { claim: "Holding a bag still does lots of work", truth: "No distance moved = no mechanical work" },
      { claim: "Pushing a wall hard moves it for you", truth: "If the wall does not move, work is ~0" },
      { claim: "Only huge machines do work", truth: "Kids do work lifting bags and sliding boxes" },
      { claim: "Distance does not matter for work", truth: "Work = force x distance" }
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

  arena.registerScene("workDrill", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription(labState.prompt || "Work drill");
    setTick(() => {
      const w = api.width, h = api.height;
      drawBackdrop();
      drawLabel(ctx, labState.prompt || "Work drill", w * 0.5, h * 0.2, { h: 32, font: "700 16px Segoe UI" });
      drawCrate(ctx, w * 0.5, h * 0.48, true);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("workMastery", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription("Work Warrior!");
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout, locked = labState.masteryStep || 0;
      drawBackdrop();
      ["Meet", "Sort", "Lab", "Rule", "Myth", "Win"].forEach((label, i) => {
        const x = w * 0.1 + i * (w * 0.14);
        ctx.fillStyle = i < locked ? "#22c55e" : "rgba(148,163,184,0.35)";
        roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8); ctx.fill();
        ctx.fillStyle = "#0f172a"; ctx.font = "600 10px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.78);
      });
      drawCrate(ctx, w * 0.5, h * 0.48, true);
      drawLabel(ctx, "Work Warrior!", w * 0.5, layout.labelY);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });
}
