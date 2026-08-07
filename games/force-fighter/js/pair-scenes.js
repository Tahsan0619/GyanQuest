/**
 * Force Fighter · Mission 3: Push & Pull Pairs - Canvas 2D (Newton 3).
 */
import { forceLabState, pulseFailFeedback, pulseSuccessFeedback } from "./force-state.js";
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
  const tw = ctx.measureText(text).width;
  const bw = tw + 24;
  const bh = opts.h || 26;
  ctx.fillStyle = opts.bg || "rgba(41,37,36,0.9)";
  roundRect(ctx, x - bw / 2, y - bh / 2, bw, bh, 10);
  ctx.fill();
  ctx.strokeStyle = opts.border || "rgba(167,139,250,0.5)";
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.fillStyle = opts.color || "#f5f3ff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y + 1);
}

function drawArrow(ctx, x1, y1, x2, y2, color) {
  const ang = Math.atan2(y2 - y1, x2 - x1);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 11 * Math.cos(ang - 0.4), y2 - 11 * Math.sin(ang - 0.4));
  ctx.lineTo(x2 - 11 * Math.cos(ang + 0.4), y2 - 11 * Math.sin(ang + 0.4));
  ctx.closePath();
  ctx.fill();
}

function drawSkater(ctx, x, y, facing = 1) {
  ctx.fillStyle = "#a78bfa";
  ctx.beginPath();
  ctx.arc(x, y - 28, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#c4b5fd";
  roundRect(ctx, x - 10, y - 16, 20, 28, 4);
  ctx.fill();
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x - 16 * facing, y + 14);
  ctx.lineTo(x + 16 * facing, y + 14);
  ctx.stroke();
}

function failFlash(ctx, w, h) {
  const until = forceLabState.failPulse;
  if (!until || performance.now() > until) return;
  ctx.fillStyle = `rgba(248,113,113,${Math.max(0, (until - performance.now()) / 420) * 0.28})`;
  ctx.fillRect(0, 0, w, h);
}
function successFlash(ctx, w, h) {
  const until = forceLabState.successPulse;
  if (!until || performance.now() > until) return;
  ctx.fillStyle = `rgba(167,139,250,${Math.max(0, (until - performance.now()) / 380) * 0.25})`;
  ctx.fillRect(0, 0, w, h);
}

export function registerPairScenes(arena) {
  if (!arena?.registerScene) return;

  arena.registerScene("pairMeet", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions, setIntentHandler, reducedMotion } =
      api;
    const startPhase = opts.phase || forceLabState.phase || "desk";
    forceLabState.phase = startPhase;
    const start = performance.now();
    setDescription("Push apart - equal and opposite pair forces.");

    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_TAP" && intent.meta?.action === "push") {
        forceLabState.recoil = Math.min(1, (forceLabState.recoil || 0) + 0.25);
        forceLabState.heat = forceLabState.recoil;
        pulseSuccessFeedback(280);
      }
    });

    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const t = reducedMotion ? 0 : (performance.now() - start) / 1000;
      const live = forceLabState.phase || startPhase;
      const r = forceLabState.recoil || forceLabState.heat || 0;
      drawBackdrop();
      const mid = w * 0.5;
      const cy = h * 0.4;
      const spread = 40 + r * 90;
      drawSkater(ctx, mid - spread, cy, 1);
      drawSkater(ctx, mid + spread, cy, -1);
      if (r > 0.15) {
        drawArrow(ctx, mid - 20, cy - 8, mid - spread + 20, cy - 8, "#f472b6");
        drawArrow(ctx, mid + 20, cy - 8, mid + spread - 20, cy - 8, "#38bdf8");
      }
      const tips = {
        desk: "Tap PUSH - skaters shove apart as a pair",
        pair: "Equal size arrows · opposite directions",
        glow: "Action & reaction - one interaction, two forces",
        settle: "Every push has a partner push back",
      };
      drawLabel(ctx, tips[live] || tips.desk, w * 0.5, layout.labelY);
      ctx.fillStyle = "#a78bfa";
      roundRect(ctx, mid - 40, layout.deskTop - 28, 80, 36, 8);
      ctx.fill();
      ctx.fillStyle = "#1c1917";
      ctx.font = "700 13px Segoe UI";
      ctx.textAlign = "center";
      ctx.fillText("PUSH!", mid, layout.deskTop - 8);
      setHitRegions([{ id: "push", shape: "rect", x: mid, y: layout.deskTop - 10, w: 90, h: 44, meta: { action: "push" } }]);
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("pairSort", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } =
      api;
    setDescription("Sort: Action, Reaction, or Interaction story.");
    const chips = [
      { id: "a1", text: "Foot pushes ground back", short: "Foot→", color: 0xf472b6 },
      { id: "r1", text: "Ground pushes foot forward", short: "←Ground", color: 0x38bdf8 },
      { id: "i1", text: "Walking pair", short: "Walk", color: 0xa78bfa },
      { id: "a2", text: "Exhaust gas down", short: "Exhaust", color: 0xf472b6 },
      { id: "r2", text: "Rocket pushed up", short: "Rocket↑", color: 0x38bdf8 },
      { id: "i2", text: "Rocket interaction", short: "Rocket", color: 0xa78bfa },
      { id: "a3", text: "You pull rope left", short: "You←", color: 0xf472b6 },
      { id: "r3", text: "Rope pulls you right", short: "Rope→", color: 0x38bdf8 },
    ];
    const accept = {
      action: ["a1", "a2", "a3"],
      reaction: ["r1", "r2", "r3"],
      interact: ["i1", "i2"],
    };
    const cardPos = {};
    chips.forEach((c) => {
      cardPos[c.id] = { x: 0, y: 0 };
    });
    let draggingId = null;
    let lastZones = [];

    function placeChip(chipId, zoneId) {
      if (!chipId || !zoneId) return false;
      if (!(accept[zoneId] || []).includes(chipId)) {
        pulseFailFeedback(400);
        return false;
      }
      forceLabState.placed = { ...(forceLabState.placed || {}), [chipId]: zoneId };
      forceLabState.selectedId = chipId;
      const session = getActiveSession();
      if (session?.dispatch) session.dispatch({ type: "PLACE_CHIP", chipId, zoneId, accept: accept[zoneId] });
      else forceLabState._placedVersion = (forceLabState._placedVersion || 0) + 1;
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
        forceLabState.selectedId = intent.meta.chipId;
      }
      if (intent.type === "CANVAS_DRAG" && intent.meta?.chipId && cardPos[intent.meta.chipId]) {
        draggingId = intent.meta.chipId;
        cardPos[intent.meta.chipId].x = intent.x;
        cardPos[intent.meta.chipId].y = intent.y;
      }
      if (intent.type === "CANVAS_TAP" && intent.meta?.chipId) forceLabState.selectedId = intent.meta.chipId;
      if (intent.type === "CANVAS_TAP" && intent.meta?.zoneId && forceLabState.selectedId) {
        placeChip(forceLabState.selectedId, intent.meta.zoneId);
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
        { id: "action", label: "Action", x: w * 0.03, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#f472b6" },
        { id: "reaction", label: "Reaction", x: w * 0.35, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#38bdf8" },
        { id: "interact", label: "Interaction", x: w * 0.67, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#a78bfa" },
      ];
      lastZones = zones;
      const hits = [];
      for (const z of zones) {
        ctx.fillStyle = "rgba(28,25,23,0.7)";
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
      const placed = forceLabState.placed || {};
      const byZone = {
        action: chips.filter((c) => placed[c.id] === "action").map((c) => c.id),
        reaction: chips.filter((c) => placed[c.id] === "reaction").map((c) => c.id),
        interact: chips.filter((c) => placed[c.id] === "interact").map((c) => c.id),
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
          const slot = sortSlotPositions({ x: z.x, y: z.y + 18, w: z.ww, h: z.hh - 22 }, Math.max(byZone[zoneKey].length, 1), idx);
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
        const selected = forceLabState.selectedId === c.id;
        ctx.fillStyle = selected ? "rgba(167,139,250,0.4)" : "rgba(41,37,36,0.95)";
        roundRect(ctx, prev.x - 48, prev.y - 16, 96, 32, 8);
        ctx.fill();
        ctx.strokeStyle = "#" + c.color.toString(16).padStart(6, "0");
        ctx.stroke();
        ctx.fillStyle = "#f5f3ff";
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
      drawLabel(ctx, "Action · Reaction · Interaction", w * 0.5, layout.labelY);
      setHitRegions(hits);
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("pairRocket", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } =
      api;
    const start = performance.now();
    setDescription("Drag thrust - exhaust down, rocket up (pair).");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
        const next = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
        forceLabState.heat = next;
        forceLabState.recoil = next;
      }
    });
    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const t = reducedMotion ? 0 : (performance.now() - start) / 1000;
      const thrust = forceLabState.heat ?? 0.3;
      drawBackdrop();
      const rx = w * 0.5;
      const ry = h * 0.55 - thrust * h * 0.25;
      // rocket
      ctx.fillStyle = "#e2e8f0";
      roundRect(ctx, rx - 14, ry - 40, 28, 60, 6);
      ctx.fill();
      ctx.fillStyle = "#a78bfa";
      ctx.beginPath();
      ctx.moveTo(rx - 14, ry - 40);
      ctx.lineTo(rx, ry - 60);
      ctx.lineTo(rx + 14, ry - 40);
      ctx.fill();
      // exhaust
      ctx.fillStyle = "#f97316";
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(rx + Math.sin(t * 8 + i) * 6, ry + 30 + i * 10 * thrust, 4 + thrust * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      if (thrust > 0.2) {
        drawArrow(ctx, rx, ry + 25, rx, ry + 25 + 40 + thrust * 30, "#f472b6");
        drawArrow(ctx, rx, ry - 50, rx, ry - 50 - 30 - thrust * 40, "#38bdf8");
      }
      const hx = w * 0.2 + thrust * w * 0.6;
      ctx.fillStyle = "#a78bfa";
      ctx.beginPath();
      ctx.arc(hx, layout.deskTop - 20, 14, 0, Math.PI * 2);
      ctx.fill();
      drawLabel(ctx, thrust > 0.7 ? "Exhaust↓ · Rocket↑ pair" : "Slide thrust - feel the pair", w * 0.5, layout.labelY);
      setHitRegions([{ id: "h", shape: "rect", x: hx, y: layout.deskTop - 20, w: 48, h: 48, meta: { action: "stretch" } }]);
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("pairRope", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    setDescription("Mid-rope scale - each side ~120 N, reading ~120 N (not 0 or 240).");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
        forceLabState.ropeT = Math.max(0.2, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
        forceLabState.heat = forceLabState.ropeT;
      }
    });
    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const T = forceLabState.ropeT ?? forceLabState.heat ?? 0.5;
      const N = Math.round(40 + T * 160);
      drawBackdrop();
      const cy = h * 0.4;
      ctx.strokeStyle = "#d6d3d1";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(w * 0.15, cy);
      ctx.lineTo(w * 0.85, cy);
      ctx.stroke();
      drawSkater(ctx, w * 0.18, cy, 1);
      drawSkater(ctx, w * 0.82, cy, -1);
      // scale
      ctx.fillStyle = "#fef3c7";
      roundRect(ctx, w * 0.5 - 40, cy - 28, 80, 40, 8);
      ctx.fill();
      ctx.fillStyle = "#1c1917";
      ctx.font = "700 14px Segoe UI";
      ctx.textAlign = "center";
      ctx.fillText(`${N} N`, w * 0.5, cy - 6);
      drawArrow(ctx, w * 0.42, cy - 40, w * 0.28, cy - 40, "#f472b6");
      drawArrow(ctx, w * 0.58, cy - 40, w * 0.72, cy - 40, "#38bdf8");
      drawLabel(ctx, `Each side ~${N} N · scale reads ~${N} N (not ${N * 2})`, w * 0.5, layout.labelY);
      const hx = w * 0.2 + T * w * 0.6;
      ctx.fillStyle = "#a78bfa";
      ctx.beginPath();
      ctx.arc(hx, cy + 60, 14, 0, Math.PI * 2);
      ctx.fill();
      setHitRegions([{ id: "h", shape: "rect", x: hx, y: cy + 60, w: 48, h: 48, meta: { action: "stretch" } }]);
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("pairWalk", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } =
      api;
    const start = performance.now();
    setDescription("Tap steps - foot pushes back, ground pushes forward.");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_TAP" && intent.meta?.action === "step") {
        forceLabState.walkStep = (forceLabState.walkStep || 0) + 1;
        forceLabState.heat = Math.min(1, forceLabState.walkStep / 6);
        pulseSuccessFeedback(200);
      }
    });
    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const t = reducedMotion ? 0 : (performance.now() - start) / 1000;
      const steps = forceLabState.walkStep || 0;
      drawBackdrop();
      const x = w * 0.25 + Math.min(steps, 6) * (w * 0.08);
      drawSkater(ctx, x, h * 0.42, 1);
      if (steps > 0) {
        drawArrow(ctx, x, h * 0.5, x - 40, h * 0.5, "#f472b6");
        drawArrow(ctx, x, h * 0.55, x + 40, h * 0.55, "#38bdf8");
      }
      drawLabel(ctx, steps >= 5 ? "Ground pushes you forward!" : "Tap to take steps - feel the pair", w * 0.5, layout.labelY);
      setHitRegions([{ id: "step", shape: "rect", x: w * 0.5, y: layout.deskTop - 10, w: 120, h: 44, meta: { action: "step" } }]);
      ctx.fillStyle = "#a78bfa";
      roundRect(ctx, w * 0.5 - 50, layout.deskTop - 28, 100, 36, 8);
      ctx.fill();
      ctx.fillStyle = "#1c1917";
      ctx.font = "700 13px Segoe UI";
      ctx.textAlign = "center";
      ctx.fillText("STEP", w * 0.5, layout.deskTop - 8);
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("pairRule", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription("Rule: forces come in equal & opposite pairs.");
    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const prog = forceLabState.tokenProgress || 0;
      drawBackdrop();
      const tokens = ["Equal", "&", "opposite", "pairs"];
      tokens.forEach((label, i) => {
        const x = w * 0.18 + i * (w * 0.18);
        const on = i < prog;
        ctx.fillStyle = on ? "rgba(167,139,250,0.4)" : "rgba(41,37,36,0.9)";
        roundRect(ctx, x - 48, h * 0.36 - 18, 96, 36, 10);
        ctx.fill();
        ctx.fillStyle = on ? "#f5f3ff" : "#a8a29e";
        ctx.font = "700 13px Segoe UI";
        ctx.textAlign = "center";
        ctx.fillText(label, x, h * 0.36);
      });
      drawLabel(ctx, "Newton’s third-law buddy rule", w * 0.5, layout.labelY);
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("pairStretch", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    const modes = ["balloon", "rower", "weight", "bug", "tug"];
    setDescription("Same pair idea in new places.");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_TAP" && intent.meta?.mode) {
        forceLabState.mode = intent.meta.mode;
        pulseSuccessFeedback(200);
      }
    });
    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const mode = forceLabState.mode || "balloon";
      drawBackdrop();
      const hits = [];
      modes.forEach((m, i) => {
        const x = w * 0.12 + i * (w * 0.17);
        ctx.fillStyle = m === mode ? "rgba(167,139,250,0.4)" : "#292524";
        roundRect(ctx, x - 36, layout.deskTop - 36, 72, 48, 10);
        ctx.fill();
        ctx.fillStyle = "#f5f3ff";
        ctx.font = "600 11px Segoe UI";
        ctx.textAlign = "center";
        ctx.fillText(m, x, layout.deskTop - 10);
        hits.push({ id: m, shape: "rect", x, y: layout.deskTop - 12, w: 72, h: 48, meta: { mode: m } });
      });
      const cy = h * 0.36;
      if (mode === "balloon") {
        ctx.fillStyle = "#f472b6";
        ctx.beginPath();
        ctx.ellipse(w * 0.5, cy, 28, 36, 0, 0, Math.PI * 2);
        ctx.fill();
        drawArrow(ctx, w * 0.5, cy + 36, w * 0.5, cy + 70, "#f472b6");
        drawArrow(ctx, w * 0.5, cy - 36, w * 0.5, cy - 70, "#38bdf8");
      } else if (mode === "rower") {
        drawSkater(ctx, w * 0.45, cy, 1);
        drawArrow(ctx, w * 0.55, cy, w * 0.7, cy, "#f472b6");
        drawArrow(ctx, w * 0.4, cy, w * 0.25, cy, "#38bdf8");
      } else {
        drawSkater(ctx, w * 0.5, cy, 1);
        drawArrow(ctx, w * 0.5, cy + 20, w * 0.5, cy + 60, "#f472b6");
        drawArrow(ctx, w * 0.5, cy - 40, w * 0.5, cy - 80, "#38bdf8");
      }
      const captions = {
        balloon: "Air rushes one way · balloon the other",
        rower: "Oar pushes water · water pushes boat",
        weight: "You pull Earth · Earth pulls you (pair)",
        bug: "Bug on glass - forces equal magnitude",
        tug: "Tug partners pull each other",
      };
      drawLabel(ctx, captions[mode], w * 0.5, layout.labelY);
      setHitRegions(hits);
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("pairMyth", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
    const myths = [
      { claim: "The bigger object wins the force pair", truth: "Pair forces are equal in size - accelerations differ by mass" },
      { claim: "Action happens first, then reaction", truth: "They are simultaneous - one interaction" },
      { claim: "A mid-rope scale should read zero", truth: "It reads the tension (~one side’s pull), not zero" },
      { claim: "You don’t push the Earth when you jump", truth: "You push Earth down; Earth pushes you up" },
      { claim: "Pairs cancel so nothing can move", truth: "Each force acts on a different object - they don’t cancel on one body" },
    ];
    setDescription("Bust pair myths.");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_TAP" && intent.meta?.action === "flip") {
        forceLabState.mythPhase = forceLabState.mythPhase === "truth" ? "claim" : "truth";
        if (forceLabState.mythPhase === "truth") pulseSuccessFeedback(220);
      }
    });
    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const idx = forceLabState.myth ?? 0;
      const phase = forceLabState.mythPhase || "claim";
      const m = myths[idx] || myths[0];
      drawBackdrop();
      ctx.fillStyle = phase === "truth" ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.18)";
      roundRect(ctx, w * 0.12, h * 0.28, w * 0.76, h * 0.28, 16);
      ctx.fill();
      drawLabel(ctx, phase === "truth" ? m.truth : `Myth: ${m.claim}`, w * 0.5, h * 0.42, { h: 42, font: "700 13px Segoe UI" });
      drawLabel(ctx, `Myth ${idx + 1} / 5 · Tap to flip`, w * 0.5, layout.labelY);
      setHitRegions([{ id: "card", shape: "rect", x: w * 0.5, y: h * 0.42, w: w * 0.76, h: h * 0.28, meta: { action: "flip" } }]);
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => setIntentHandler(null));
  });

  arena.registerScene("pairDrill", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription(forceLabState.prompt || "Pair drill");
    setTick(() => {
      const w = api.width;
      const h = api.height;
      drawBackdrop();
      drawLabel(ctx, forceLabState.prompt || "Equal & opposite!", w * 0.5, h * 0.2, { h: 32, font: "700 16px Segoe UI" });
      drawSkater(ctx, w * 0.4, h * 0.5, 1);
      drawSkater(ctx, w * 0.6, h * 0.5, -1);
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  arena.registerScene("pairMastery", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
    setDescription("Push & Pull Pairs mastery.");
    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const locked = forceLabState.masteryStep || 0;
      drawBackdrop();
      ["Meet", "Sort", "Rocket", "Rope", "Walk", "Team"].forEach((label, i) => {
        const x = w * 0.1 + i * (w * 0.14);
        ctx.fillStyle = i < locked ? "#a78bfa" : "rgba(148,163,184,0.35)";
        roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8);
        ctx.fill();
        ctx.fillStyle = "#1c1917";
        ctx.font = "600 10px Segoe UI";
        ctx.textAlign = "center";
        ctx.fillText(label, x, h * 0.78);
      });
      drawSkater(ctx, w * 0.42, h * 0.4, 1);
      drawSkater(ctx, w * 0.58, h * 0.4, -1);
      drawLabel(ctx, "Team Force!", w * 0.5, layout.labelY);
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });
}
