/**
 * Statistics \u00b7 Mission 1: Mean & Mode - Canvas 2D scenes (Tiny Bits depth).
 * Data bars, mean balance line, mode peak stacks, BD data stretch.
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
  ctx.fillStyle = opts.bg || "rgba(69, 26, 3, 0.92)";
  roundRect(ctx, x - tw / 2, y - bh / 2, tw, bh, 10);
  ctx.fill();
  ctx.strokeStyle = opts.border || "rgba(251,191,36,0.55)";
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.fillStyle = opts.color || "#fef3c7";
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
  ctx.fillStyle = `rgba(251,191,36,${Math.max(0, (until - performance.now()) / 380) * 0.22})`;
  ctx.fillRect(0, 0, w, h);
}

function drawBars(ctx, cx, cy, vals, scale = 1) {
  const n = vals.length;
  const bw = 18 * scale;
  const gap = 10 * scale;
  const totalW = n * bw + (n - 1) * gap;
  const baseY = cy + 50 * scale;
  vals.forEach((v, i) => {
    const h = Math.max(12, v * 12 * scale);
    const x = cx - totalW / 2 + i * (bw + gap);
    ctx.fillStyle = i % 2 ? "#f59e0b" : "#fbbf24";
    roundRect(ctx, x, baseY - h, bw, h, 4);
    ctx.fill();
    ctx.fillStyle = "#fef3c7";
    ctx.font = "700 11px Segoe UI";
    ctx.textAlign = "center";
    ctx.fillText(String(v), x + bw / 2, baseY - h - 10);
  });
  ctx.strokeStyle = "rgba(253,230,138,0.5)";
  ctx.beginPath();
  ctx.moveTo(cx - totalW / 2 - 8, baseY);
  ctx.lineTo(cx + totalW / 2 + 8, baseY);
  ctx.stroke();
}

function drawMeanLine(ctx, cx, cy, mean, pulse) {
  const y = cy + 50 - mean * 12;
  ctx.strokeStyle = `rgba(253,230,138,${0.45 + pulse * 0.4})`;
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(cx - 90, y);
  ctx.lineTo(cx + 90, y);
  ctx.stroke();
  ctx.setLineDash([]);
  drawLabel(ctx, "mean " + mean, cx + 70, y, { h: 20, font: "700 11px Segoe UI" });
}

function drawModeStacks(ctx, x, y, modeVal) {
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.arc(x, y - i * 22, 12, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#fef3c7";
  ctx.font = "700 12px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText("mode " + modeVal, x, y + 36);
}

export function registerMeanScenes(arena) {
  if (!arena?.registerScene) return;

  arena.registerScene("meanMeet", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions } = api;
    labState.phase = opts.phase || labState.phase || "desk";
    if (!labState.dataVals) labState.dataVals = [2, 4, 4, 5, 5];
    setDescription("Mean & Mode - balance line and most-common peak.");
    const props = { bars: { x: 0, y: 0 }, mean: { x: 0, y: 0 }, mode: { x: 0, y: 0 } };
    let inited = false;
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout;
      const live = labState.phase || "desk";
      const vals = labState.dataVals || [2, 4, 4, 5, 5];
      const mean = labState.meanVal ?? 4;
      const mode = labState.modeVal ?? 4;
      const pulse = labState.heat || 0.4;
      drawBackdrop();
      if (!inited) {
        props.bars.x = w * 0.35; props.bars.y = h * 0.4;
        props.mean.x = w * 0.35; props.mean.y = h * 0.4;
        props.mode.x = w * 0.72; props.mode.y = h * 0.48;
        inited = true;
      }
      ctx.fillStyle = "#78350f";
      roundRect(ctx, w * 0.08, layout.deskTop - 8, w * 0.84, 18, 8);
      ctx.fill();
      drawBars(ctx, props.bars.x, props.bars.y, vals);
      if (live === "glow" || live === "settle") drawMeanLine(ctx, props.mean.x, props.mean.y, mean, pulse);
      if (live === "settle" || live === "glow") drawModeStacks(ctx, props.mode.x, props.mode.y, mode);
      const tips = {
        desk: "Drag data bars - each height is a value",
        glow: "Mean line balances the set",
        settle: "Mode stacks highest - value that appears most",
      };
      drawLabel(ctx, tips[live] || tips.desk, w * 0.5, layout.labelY);
      const hits = [
        { id: "bars", shape: "rect", x: props.bars.x, y: props.bars.y, w: 160, h: 120, meta: { propId: "bars" },
          onDrag(pt) { props.bars.x = Math.max(80, Math.min(w - 80, pt.x)); props.bars.y = Math.max(80, Math.min(layout.deskTop, pt.y)); props.mean.x = props.bars.x; props.mean.y = props.bars.y; } },
        { id: "mode", shape: "rect", x: props.mode.x, y: props.mode.y, w: 80, h: 100, meta: { propId: "mode" },
          onDrag(pt) { props.mode.x = Math.max(50, Math.min(w - 50, pt.x)); props.mode.y = Math.max(80, Math.min(layout.deskTop, pt.y)); } },
      ];
      setHitRegions(hits);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("meanSort", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } = api;
    setDescription("Sort: mean idea, mode idea, or not a summary.");
    const chips = [
      { id: "adddiv", short: "Add/div", color: 0xfbbf24 },
      { id: "peak", short: "Most", color: 0xf59e0b },
      { id: "balance", short: "Balance", color: 0xfde68a },
      { id: "stack", short: "Stack", color: 0xd97706 },
      { id: "share", short: "Share", color: 0xfbbf24 },
      { id: "color", short: "Color", color: 0x94a3b8 },
      { id: "guess", short: "Guess", color: 0x78716c },
      { id: "ties", short: "Tie mode", color: 0xf97316 },
    ];
    const accept = {
      mean: ["adddiv", "balance", "share"],
      mode: ["peak", "stack", "ties"],
      not: ["color", "guess"],
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
        { id: "mean", label: "Mean idea", x: w * 0.02, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#fbbf24" },
        { id: "mode", label: "Mode idea", x: w * 0.35, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#f59e0b" },
        { id: "not", label: "Not a summary", x: w * 0.68, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#94a3b8" },
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
      const byZone = { mean: [], mode: [], not: [] };
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
        ctx.fillStyle = labState.selectedId === c.id ? "rgba(251,191,36,0.4)" : "rgba(15,23,42,0.95)";
        roundRect(ctx, prev.x - 48, prev.y - 16, 96, 32, 8); ctx.fill();
        ctx.strokeStyle = "#" + c.color.toString(16).padStart(6, "0"); ctx.stroke();
        ctx.fillStyle = "#fef3c7"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(c.short, prev.x, prev.y);
        hits.push({ id: c.id, shape: "rect", x: prev.x, y: prev.y, w: 100, h: 36, meta: { chipId: c.id },
          onDrag(pt) { draggingId = c.id; prev.x = Math.max(30, Math.min(w - 30, pt.x)); prev.y = Math.max(30, Math.min(h - 30, pt.y)); } });
      });
      drawLabel(ctx, "Mean \u00b7 Mode \u00b7 Not a summary", w * 0.5, layout.labelY);
      setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("meanLab", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    setDescription("Dial mean balance - watch bars and the mean line.");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
        labState.heat = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
      }
    });
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout;
      const heat = labState.heat ?? 0.3;
      const vals = [2, 3, 4, 5, 6].map((v) => Math.round(v * (0.6 + heat * 0.5)));
      const mean = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
      drawBackdrop();
      drawBars(ctx, w * 0.4, h * 0.38, vals);
      drawMeanLine(ctx, w * 0.4, h * 0.38, mean, heat);
      drawModeStacks(ctx, w * 0.75, h * 0.45, 4);
      const hx = w * 0.2 + heat * w * 0.6;
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath(); ctx.arc(hx, h * 0.72, 14, 0, Math.PI * 2); ctx.fill();
      drawLabel(ctx, heat >= 0.6 ? "Mean balanced \u00b7 mode peak visible" : "Drag - balance the mean", w * 0.5, layout.labelY);
      setHitRegions([{ id: "h", shape: "rect", x: hx, y: h * 0.72, w: 48, h: 48, meta: { action: "stretch" } }]);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("meanRule", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription("Mean = sum / count.");
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout, prog = labState.tokenProgress || 0;
      drawBackdrop();
      ["Sum", "/", "Count", "= Mean"].forEach((label, i) => {
        const x = w * 0.18 + i * (w * 0.18);
        ctx.fillStyle = i < prog ? "rgba(251,191,36,0.4)" : "rgba(15,23,42,0.9)";
        roundRect(ctx, x - 44, h * 0.36 - 18, 88, 36, 10); ctx.fill();
        ctx.fillStyle = "#fef3c7"; ctx.font = "700 12px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.36);
      });
      drawBars(ctx, w * 0.5, h * 0.58, [2, 4, 4, 5], 0.85);
      drawLabel(ctx, "Mean & Mode rule", w * 0.5, layout.labelY);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("meanStretch", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    const modes = ["marks", "cricket", "shop", "bus", "weather"];
    setDescription("Same summaries in Bangladesh data stories.");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_TAP" && intent.meta?.mode) { labState.mode = intent.meta.mode; pulseSuccessFeedback(200); }
    });
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout, mode = labState.mode || "marks";
      drawBackdrop();
      const hits = [];
      modes.forEach((m, i) => {
        const x = w * 0.12 + i * (w * 0.17);
        ctx.fillStyle = m === mode ? "rgba(251,191,36,0.4)" : "#78350f";
        roundRect(ctx, x - 36, layout.deskTop - 36, 72, 48, 10); ctx.fill();
        ctx.fillStyle = "#fef3c7"; ctx.font = "600 11px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(m, x, layout.deskTop - 10);
        hits.push({ id: m, shape: "rect", x, y: layout.deskTop - 12, w: 72, h: 48, meta: { mode: m } });
      });
      drawBars(ctx, w * 0.4, h * 0.38, [3, 4, 4, 5], 0.9);
      drawModeStacks(ctx, w * 0.72, h * 0.42, 4);
      const captions = {
        marks: "Class marks - mean score, mode mark",
        cricket: "Run totals - typical and most common",
        shop: "Price tags - average cost, common price",
        bus: "Wait times - mean wait, usual wait",
        weather: "Temperatures - average day, most common",
      };
      drawLabel(ctx, captions[mode], w * 0.5, layout.labelY);
      setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("meanMyth", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    const myths = [
      { claim: "Mean and mode are always the same", truth: "They can differ - mean balances; mode is most common" },
      { claim: "Mode needs every value once", truth: "Mode is the value that appears most (ties ok)" },
      { claim: "Mean ignores the count", truth: "Mean divides by how many values you have" },
      { claim: "Only adults use averages", truth: "Kids use mean/mode for marks, scores, prices" },
      { claim: "Outliers never move the mean", truth: "A very large or small value can pull the mean" },
    ];
    setDescription("Bust mean/mode myths.");
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
      ctx.fillStyle = phase === "truth" ? "rgba(251,191,36,0.2)" : "rgba(248,113,113,0.18)";
      roundRect(ctx, w * 0.12, h * 0.28, w * 0.76, h * 0.28, 16); ctx.fill();
      drawLabel(ctx, phase === "truth" ? m.truth : "Myth: " + m.claim, w * 0.5, h * 0.42, { h: 42, font: "700 13px Segoe UI" });
      drawLabel(ctx, "Myth " + (idx + 1) + " / 5 \u00b7 Tap to flip", w * 0.5, layout.labelY);
      setHitRegions([{ id: "card", shape: "rect", x: w * 0.5, y: h * 0.42, w: w * 0.76, h: h * 0.28, meta: { action: "flip" } }]);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("meanDrill", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription(labState.prompt || "Mean drill");
    setTick(() => {
      const w = api.width, h = api.height;
      drawBackdrop();
      drawLabel(ctx, labState.prompt || "Mean & Mode drill", w * 0.5, h * 0.2, { h: 32, font: "700 16px Segoe UI" });
      drawBars(ctx, w * 0.5, h * 0.48, [2, 4, 4, 5], 1);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("meanMastery", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription("Mean Scout mastery.");
    setTick(() => {
      const w = api.width, h = api.height, layout = api.layout, locked = labState.masteryStep || 0;
      drawBackdrop();
      ["Meet", "Sort", "Lab", "Rule", "Myth", "Scout"].forEach((label, i) => {
        const x = w * 0.1 + i * (w * 0.14);
        ctx.fillStyle = i < locked ? "#fbbf24" : "rgba(148,163,184,0.35)";
        roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8); ctx.fill();
        ctx.fillStyle = "#0f172a"; ctx.font = "600 10px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.78);
      });
      drawBars(ctx, w * 0.4, h * 0.4, [2, 4, 4, 5], 0.95);
      drawModeStacks(ctx, w * 0.72, h * 0.42, 4);
      drawLabel(ctx, "Mean Scout!", w * 0.5, layout.labelY);
      failFlash(ctx, w, h); successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });
}
