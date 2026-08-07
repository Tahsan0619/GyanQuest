/**
 * Eco Guardian · Mission 1: Waste Watch - Canvas 2D scenes (Tiny Bits depth).
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
  ctx.fillStyle = opts.bg || "rgba(6, 46, 32, 0.92)";
  roundRect(ctx, x - tw / 2, y - bh / 2, tw, bh, 10);
  ctx.fill();
  ctx.strokeStyle = opts.border || "rgba(52,211,153,0.55)";
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.fillStyle = opts.color || "#d1fae5";
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
  ctx.fillStyle = `rgba(52,211,153,${Math.max(0, (until - performance.now()) / 380) * 0.22})`;
  ctx.fillRect(0, 0, w, h);
}

function drawBin(ctx, x, y, color, label) {
  ctx.fillStyle = color;
  roundRect(ctx, x - 36, y - 40, 72, 70, 8);
  ctx.fill();
  ctx.strokeStyle = "#064e3b";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  roundRect(ctx, x - 28, y - 48, 56, 14, 4);
  ctx.fill();
  ctx.fillStyle = "#ecfdf5";
  ctx.font = "700 11px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText(label, x, y + 44);
}

function drawItem(ctx, kind, x, y) {
  ctx.save();
  ctx.translate(x, y);
  if (kind === "bottle") {
    ctx.fillStyle = "#38bdf8";
    roundRect(ctx, -10, -22, 20, 40, 6);
    ctx.fill();
    ctx.fillStyle = "#0ea5e9";
    roundRect(ctx, -6, -28, 12, 10, 3);
    ctx.fill();
  } else if (kind === "peel") {
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 10, 0.3, 0, Math.PI * 2);
    ctx.fill();
  } else if (kind === "bag") {
    ctx.fillStyle = "#94a3b8";
    roundRect(ctx, -16, -18, 32, 36, 4);
    ctx.fill();
  } else if (kind === "can") {
    ctx.fillStyle = "#a3e635";
    roundRect(ctx, -12, -20, 24, 40, 4);
    ctx.fill();
  } else if (kind === "paper") {
    ctx.fillStyle = "#e2e8f0";
    roundRect(ctx, -14, -18, 28, 36, 2);
    ctx.fill();
    ctx.strokeStyle = "#64748b";
    ctx.stroke();
  } else {
    ctx.fillStyle = "#f87171";
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function registerWasteScenes(arena) {
  if (!arena?.registerScene) return;

  arena.registerScene("wasteMeet", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions } = api;
    labState.phase = opts.phase || labState.phase || "desk";
    setDescription("Waste Watch - sort smart before it piles up.");
    const props = {
      bottle: { x: 0, y: 0 },
      peel: { x: 0, y: 0 },
      bag: { x: 0, y: 0 },
      can: { x: 0, y: 0 },
    };
    let inited = false;
    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const live = labState.phase || "desk";
      drawBackdrop();
      if (!inited) {
        props.bottle.x = w * 0.2;
        props.bottle.y = h * 0.45;
        props.peel.x = w * 0.4;
        props.peel.y = h * 0.48;
        props.bag.x = w * 0.58;
        props.bag.y = h * 0.46;
        props.can.x = w * 0.78;
        props.can.y = h * 0.45;
        inited = true;
      }
      ctx.fillStyle = "#065f46";
      roundRect(ctx, w * 0.08, layout.deskTop - 8, w * 0.84, 18, 8);
      ctx.fill();
      if (live === "bins" || live === "glow" || live === "settle") {
        drawBin(ctx, w * 0.25, h * 0.28, "#22c55e", "Recycle");
        drawBin(ctx, w * 0.5, h * 0.28, "#a3e635", "Compost");
        drawBin(ctx, w * 0.75, h * 0.28, "#64748b", "Landfill");
      }
      drawItem(ctx, "bottle", props.bottle.x, props.bottle.y);
      drawItem(ctx, "peel", props.peel.x, props.peel.y);
      drawItem(ctx, "bag", props.bag.x, props.bag.y);
      drawItem(ctx, "can", props.can.x, props.can.y);
      const tips = {
        desk: "Drag litter on the desk - what can be reused?",
        bins: "Three bins: recycle · compost · landfill",
        glow: "Right bin = less pollution",
        settle: "Reduce first, then reuse, then recycle",
      };
      drawLabel(ctx, tips[live] || tips.desk, w * 0.5, layout.labelY);
      const hits = [];
      for (const [id, p] of Object.entries(props)) {
        hits.push({
          id,
          shape: "rect",
          x: p.x,
          y: p.y,
          w: 48,
          h: 52,
          meta: { propId: id },
          onDrag(pt) {
            p.x = Math.max(40, Math.min(w - 40, pt.x));
            p.y = Math.max(60, Math.min(layout.deskTop + 4, pt.y));
          },
        });
      }
      setHitRegions(hits);
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("wasteSort", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } =
      api;
    setDescription("Sort waste into recycle, compost, or landfill.");
    const chips = [
      { id: "bottle", text: "Plastic bottle", short: "Bottle", color: 0x38bdf8 },
      { id: "peel", text: "Banana peel", short: "Peel", color: 0xfbbf24 },
      { id: "can", text: "Metal can", short: "Can", color: 0xa3e635 },
      { id: "paper", text: "Clean paper", short: "Paper", color: 0xe2e8f0 },
      { id: "bag", text: "Dirty chip bag", short: "Chip bag", color: 0x94a3b8 },
      { id: "leaf", text: "Dry leaves", short: "Leaves", color: 0x4ade80 },
      { id: "battery", text: "Battery", short: "Battery", color: 0xf87171 },
      { id: "glass", text: "Glass jar", short: "Glass", color: 0x67e8f9 },
    ];
    const accept = {
      recycle: ["bottle", "can", "paper", "glass"],
      compost: ["peel", "leaf"],
      landfill: ["bag", "battery"],
    };
    const cardPos = {};
    chips.forEach((c) => {
      cardPos[c.id] = { x: 0, y: 0 };
    });
    let draggingId = null;
    let lastZones = [];
    function placeChip(chipId, zoneId) {
      if (!(accept[zoneId] || []).includes(chipId)) {
        pulseFailFeedback(400);
        return false;
      }
      labState.placed = { ...(labState.placed || {}), [chipId]: zoneId };
      const session = getActiveSession();
      if (session?.dispatch) session.dispatch({ type: "PLACE_CHIP", chipId, zoneId, accept: accept[zoneId] });
      else labState._placedVersion = (labState._placedVersion || 0) + 1;
      pulseSuccessFeedback(220);
      return true;
    }
    function zoneAt(x, y) {
      for (const z of lastZones) {
        if (x >= z.x && x <= z.x + z.ww && y >= z.y && y <= z.y + z.hh) return z.id;
      }
      return null;
    }
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_DOWN" && intent.meta?.chipId) {
        draggingId = intent.meta.chipId;
        labState.selectedId = intent.meta.chipId;
      }
      if (intent.type === "CANVAS_DRAG" && intent.meta?.chipId && cardPos[intent.meta.chipId]) {
        draggingId = intent.meta.chipId;
        cardPos[intent.meta.chipId].x = intent.x;
        cardPos[intent.meta.chipId].y = intent.y;
      }
      if (intent.type === "CANVAS_TAP" && intent.meta?.chipId) labState.selectedId = intent.meta.chipId;
      if (intent.type === "CANVAS_TAP" && intent.meta?.zoneId && labState.selectedId) {
        placeChip(labState.selectedId, intent.meta.zoneId);
      }
      if (intent.type === "CANVAS_UP" && intent.meta?.chipId) {
        const zoneId = intent.dropMeta?.zoneId || zoneAt(intent.x, intent.y);
        if (zoneId) placeChip(intent.meta.chipId, zoneId);
        draggingId = null;
      } else if (intent.type === "CANVAS_UP") draggingId = null;
    });
    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      drawBackdrop();
      const zoneH = Math.max(100, Math.min(h * 0.28, 130));
      const zoneY = Math.max(layout.labelY + 28, h * 0.09);
      const zones = [
        { id: "recycle", label: "Recycle", x: w * 0.03, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#22c55e" },
        { id: "compost", label: "Compost", x: w * 0.35, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#a3e635" },
        { id: "landfill", label: "Landfill / special", x: w * 0.67, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#94a3b8" },
      ];
      lastZones = zones;
      const hits = [];
      for (const z of zones) {
        ctx.fillStyle = "rgba(6,46,32,0.75)";
        roundRect(ctx, z.x, z.y, z.ww, z.hh, 12);
        ctx.fill();
        ctx.strokeStyle = z.color;
        ctx.lineWidth = 2.5;
        ctx.stroke();
        drawLabel(ctx, z.label, z.x + z.ww / 2, z.y + 16, { h: 20, font: "700 12px Segoe UI" });
        hits.push({
          id: "zone-" + z.id,
          shape: "rect",
          x: z.x + z.ww / 2,
          y: z.y + z.hh / 2,
          w: z.ww,
          h: z.hh,
          meta: { zoneId: z.id, accept: accept[z.id] },
        });
      }
      const placed = labState.placed || {};
      const byZone = {
        recycle: chips.filter((c) => placed[c.id] === "recycle").map((c) => c.id),
        compost: chips.filter((c) => placed[c.id] === "compost").map((c) => c.id),
        landfill: chips.filter((c) => placed[c.id] === "landfill").map((c) => c.id),
      };
      const bankIds = chips.filter((c) => typeof placed[c.id] !== "string").map((c) => c.id);
      const ease = reducedMotion ? 1 : 0.18;
      chips.forEach((c) => {
        let targetX;
        let targetY;
        const zoneKey = typeof placed[c.id] === "string" ? placed[c.id] : null;
        if (zoneKey && byZone[zoneKey]) {
          const z = zones.find((zz) => zz.id === zoneKey);
          const idx = byZone[zoneKey].indexOf(c.id);
          const slot = sortSlotPositions(
            { x: z.x, y: z.y + 18, w: z.ww, h: z.hh - 22 },
            Math.max(byZone[zoneKey].length, 1),
            idx,
          );
          targetX = slot.x;
          targetY = slot.y;
        } else {
          const idx = bankIds.indexOf(c.id);
          targetX = w * 0.14 + (idx % 4) * (w * 0.22);
          targetY = zoneY + zoneH + 36 + Math.floor(idx / 4) * 48;
        }
        const prev = cardPos[c.id];
        if (!prev.x && !prev.y) {
          prev.x = targetX;
          prev.y = targetY;
        }
        if (draggingId !== c.id) {
          prev.x += (targetX - prev.x) * ease;
          prev.y += (targetY - prev.y) * ease;
        }
        ctx.fillStyle = labState.selectedId === c.id ? "rgba(52,211,153,0.4)" : "rgba(6,46,32,0.95)";
        roundRect(ctx, prev.x - 48, prev.y - 16, 96, 32, 8);
        ctx.fill();
        ctx.strokeStyle = "#" + c.color.toString(16).padStart(6, "0");
        ctx.stroke();
        ctx.fillStyle = "#d1fae5";
        ctx.font = "700 11px Segoe UI";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(c.short, prev.x, prev.y);
        hits.push({
          id: c.id,
          shape: "rect",
          x: prev.x,
          y: prev.y,
          w: 100,
          h: 36,
          meta: { chipId: c.id },
          onDrag(pt) {
            draggingId = c.id;
            prev.x = Math.max(30, Math.min(w - 30, pt.x));
            prev.y = Math.max(30, Math.min(h - 30, pt.y));
          },
        });
      });
      drawLabel(ctx, "Recycle · Compost · Landfill / special", w * 0.5, layout.labelY);
      setHitRegions(hits);
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("wasteLab", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    setDescription("Drag clean-up power - fill the recycle goal.");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
        labState.heat = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
        labState.recycleFill = labState.heat;
      }
    });
    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const heat = labState.heat ?? 0.3;
      drawBackdrop();
      drawBin(ctx, w * 0.5, h * 0.42, "#22c55e", "Recycle");
      ctx.fillStyle = `rgba(52,211,153,${0.2 + heat * 0.6})`;
      roundRect(ctx, w * 0.5 - 28, h * 0.42 - 30 + (1 - heat) * 50, 56, heat * 50, 6);
      ctx.fill();
      const hx = w * 0.2 + heat * w * 0.6;
      ctx.fillStyle = "#34d399";
      ctx.beginPath();
      ctx.arc(hx, h * 0.7, 14, 0, Math.PI * 2);
      ctx.fill();
      drawLabel(ctx, heat >= 0.6 ? "Recycle bin filling - great sort!" : "Drag to fill the recycle goal", w * 0.5, layout.labelY);
      setHitRegions([{ id: "h", shape: "rect", x: hx, y: h * 0.7, w: 48, h: 48, meta: { action: "stretch" } }]);
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("wasteRule", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription("Reduce → Reuse → Recycle.");
    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const prog = labState.tokenProgress || 0;
      drawBackdrop();
      ["Reduce", "Reuse", "Recycle", "Respect"].forEach((label, i) => {
        const x = w * 0.18 + i * (w * 0.18);
        const on = i < prog;
        ctx.fillStyle = on ? "rgba(52,211,153,0.4)" : "rgba(6,46,32,0.9)";
        roundRect(ctx, x - 44, h * 0.36 - 18, 88, 36, 10);
        ctx.fill();
        ctx.fillStyle = on ? "#d1fae5" : "#6ee7b7";
        ctx.font = "700 12px Segoe UI";
        ctx.textAlign = "center";
        ctx.fillText(label, x, h * 0.36);
      });
      drawBin(ctx, w * 0.5, h * 0.58, "#22c55e", "Smart bin");
      drawLabel(ctx, "Waste Watch rule", w * 0.5, layout.labelY);
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("wasteStretch", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    const modes = ["home", "school", "market", "park", "river"];
    setDescription("Same sort idea in BD places.");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_TAP" && intent.meta?.mode) {
        labState.mode = intent.meta.mode;
        pulseSuccessFeedback(200);
      }
    });
    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const mode = labState.mode || "home";
      drawBackdrop();
      const hits = [];
      modes.forEach((m, i) => {
        const x = w * 0.12 + i * (w * 0.17);
        ctx.fillStyle = m === mode ? "rgba(52,211,153,0.4)" : "#064e3b";
        roundRect(ctx, x - 36, layout.deskTop - 36, 72, 48, 10);
        ctx.fill();
        ctx.fillStyle = "#d1fae5";
        ctx.font = "600 11px Segoe UI";
        ctx.textAlign = "center";
        ctx.fillText(m, x, layout.deskTop - 10);
        hits.push({ id: m, shape: "rect", x, y: layout.deskTop - 12, w: 72, h: 48, meta: { mode: m } });
      });
      drawBin(ctx, w * 0.5, h * 0.38, "#22c55e", "Sort here");
      const captions = {
        home: "Kitchen peel → compost · bottles → recycle",
        school: "Paper scraps → recycle if clean",
        market: "Ask for less plastic bags - reduce first",
        park: "Leaves can compost - wrappers landfill",
        river: "Never dump - protect water for everyone",
      };
      drawLabel(ctx, captions[mode], w * 0.5, layout.labelY);
      setHitRegions(hits);
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("wasteMyth", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    const myths = [
      { claim: "All plastic can go in recycle", truth: "Dirty or mixed plastics often can’t - clean & check" },
      { claim: "Food waste belongs in recycle", truth: "Food scraps usually compost - not recycle" },
      { claim: "Recycling alone fixes everything", truth: "Reduce and reuse come first" },
      { claim: "Batteries are normal trash", truth: "Batteries need special / careful disposal" },
      { claim: "Litter in a river just washes away", truth: "It harms fish, people, and floods" },
    ];
    setDescription("Bust waste myths.");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_TAP" && intent.meta?.action === "flip") {
        labState.mythPhase = labState.mythPhase === "truth" ? "claim" : "truth";
        if (labState.mythPhase === "truth") pulseSuccessFeedback(220);
      }
    });
    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const idx = labState.myth ?? 0;
      const phase = labState.mythPhase || "claim";
      const m = myths[idx] || myths[0];
      drawBackdrop();
      ctx.fillStyle = phase === "truth" ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.18)";
      roundRect(ctx, w * 0.12, h * 0.28, w * 0.76, h * 0.28, 16);
      ctx.fill();
      drawLabel(ctx, phase === "truth" ? m.truth : `Myth: ${m.claim}`, w * 0.5, h * 0.42, {
        h: 42,
        font: "700 13px Segoe UI",
      });
      drawLabel(ctx, `Myth ${idx + 1} / 5 · Tap to flip`, w * 0.5, layout.labelY);
      setHitRegions([
        { id: "card", shape: "rect", x: w * 0.5, y: h * 0.42, w: w * 0.76, h: h * 0.28, meta: { action: "flip" } },
      ]);
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("wasteDrill", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription(labState.prompt || "Waste drill");
    setTick(() => {
      const w = api.width;
      const h = api.height;
      drawBackdrop();
      drawLabel(ctx, labState.prompt || "Waste Watch drill", w * 0.5, h * 0.22, {
        h: 32,
        font: "700 16px Segoe UI",
      });
      drawBin(ctx, w * 0.5, h * 0.5, "#22c55e", "Think bin");
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("wasteMastery", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription("Waste Watcher mastery.");
    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const locked = labState.masteryStep || 0;
      drawBackdrop();
      ["Meet", "Sort", "Lab", "Rule", "Myth", "Watch"].forEach((label, i) => {
        const x = w * 0.1 + i * (w * 0.14);
        ctx.fillStyle = i < locked ? "#34d399" : "rgba(148,163,184,0.35)";
        roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8);
        ctx.fill();
        ctx.fillStyle = "#064e3b";
        ctx.font = "600 10px Segoe UI";
        ctx.textAlign = "center";
        ctx.fillText(label, x, h * 0.78);
      });
      drawBin(ctx, w * 0.35, h * 0.4, "#22c55e", "R");
      drawBin(ctx, w * 0.5, h * 0.4, "#a3e635", "C");
      drawBin(ctx, w * 0.65, h * 0.4, "#64748b", "L");
      drawLabel(ctx, "Waste Watcher!", w * 0.5, layout.labelY);
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });
}
