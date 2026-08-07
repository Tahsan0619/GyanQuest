/**
 * Chemistry Lab · Level 1 (Tiny Bits) - Canvas 2D code-driven animations.
 * Bruner spiral: enactive → iconic → symbolic.
 * Accurate language: H₂O molecules, Na⁺/Cl⁻ ions, simplified shell model.
 */
import {
  heatPhase,
  shellCountsForProgress,
  pointOnRotatedEllipse,
  sortSlotPositions,
  getActiveSession,
} from "./activity-controller.js";
import {
  CUP_FOOT,
  BOTTLE_FOOT,
  PAN_FOOT,
  SHAKER_FOOT,
  footAlign,
} from "./scene-layout.js";

const ASSET = "/games/chemistry-lab/assets";

export const chemLabState = {
  heat: 0.12,
  heatTarget: 0.12,
  energy: 0.55,
  energyTarget: 0.55,
  phase: "zoom",
  mode: "balloon",
  myth: 0,
  mythPhase: "claim",
  mythBusted: false,
  bustedAt: 0,
  reveal: false,
  prompt: "Speed drill!",
  flashColor: 0x38bdf8,
  animDuration: 3200,
  failPulse: 0,
  successPulse: 0,
  tokenProgress: 0,
  sortPlaced: 0,
  placed: {},
  selectedId: null,
  masteryStep: 0,
  scale: 0,
  reducedMotion: false,
  /** Element Hunt */
  elemKind: "iron",
  elemPhase: "shelf",
  wireStretch: 0,
  o2Split: 0,
  huntFound: {},
  /** Bond Buddies */
  bondSnap: 0,
  magnetGap: 1,
  dropMerge: 0,
  bondKind: "ionic",
};

/** Keep chemLabState in sync with activity-controller sessions */
if (typeof window !== "undefined") {
  window.__chemMirror = (s) => {
    if (!s) return;
    if (s.heat != null) {
      chemLabState.heat = s.heat;
      chemLabState.heatTarget = s.heat;
    }
    if (s.energy != null) {
      chemLabState.energy = s.energy;
      chemLabState.energyTarget = s.energy;
    }
    if (s.placed != null && s.placedVersion != null && s.placedVersion !== chemLabState._placedVersion) {
      chemLabState.placed = { ...s.placed };
      chemLabState.sortPlaced = Object.keys(s.placed).length;
      chemLabState._placedVersion = s.placedVersion;
    }
    if (s.selectedId !== undefined) chemLabState.selectedId = s.selectedId;
    if (s.reveal != null) chemLabState.reveal = s.reveal;
    if (s.tokenOrder) chemLabState.tokenProgress = s.tokenOrder.length;
    if (s.masteryOrder) chemLabState.masteryStep = s.masteryOrder.length;
    if (s.mythIndex != null) chemLabState.myth = s.mythIndex;
    if (s.mythPhase) chemLabState.mythPhase = s.mythPhase;
    if (s.bustedAt != null) chemLabState.bustedAt = s.bustedAt;
    chemLabState.mythBusted = s.mythPhase === "truth";
    if (s.prompt != null) chemLabState.prompt = s.prompt;
    if (s.mode) chemLabState.mode = s.mode;
    if (s.phase) chemLabState.phase = s.phase;
    if (s.scale != null) chemLabState.scale = s.scale;
  };
}

export function easeOutCubic(t) {
  const x = Math.min(1, Math.max(0, t));
  return 1 - Math.pow(1 - x, 3);
}

export function easeInOutQuad(t) {
  const x = Math.min(1, Math.max(0, t));
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

export function setHeatTarget(h) {
  const v = Math.max(0, Math.min(1, h));
  chemLabState.heatTarget = v;
  chemLabState.energyTarget = v;
}

export function pulseFailFeedback(ms = 420) {
  chemLabState.failPulse = performance.now() + ms;
}

export function pulseSuccessFeedback(ms = 380) {
  chemLabState.successPulse = performance.now() + ms;
}

function lerpHeat() {
  chemLabState.heat += (chemLabState.heatTarget - chemLabState.heat) * 0.18;
  chemLabState.energy += (chemLabState.energyTarget - chemLabState.energy) * 0.18;
}

function animDurSec() {
  return Math.max(0.8, (chemLabState.animDuration || 3200) / 1000);
}

function hexToRgb(hex) {
  const n = typeof hex === "number" ? hex : parseInt(String(hex).replace("#", ""), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: (n >> 0) & 255 };
}

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

function drawAtom(ctx, x, y, r, color, t = 0, glow = true) {
  const { r: cr, g: cg, b: cb } = hexToRgb(color);
  if (glow) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 2.1);
    g.addColorStop(0, `rgba(${cr},${cg},${cb},0.4)`);
    g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r * 2.1, 0, Math.PI * 2);
    ctx.fill();
  }
  const core = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
  core.addColorStop(0, "#f0f9ff");
  core.addColorStop(0.4, `rgb(${cr},${cg},${cb})`);
  core.addColorStop(1, `rgb(${Math.max(0, cr - 45)},${Math.max(0, cg - 45)},${Math.max(0, cb - 25)})`);
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawMolecule(ctx, x, y, scale = 1, t = 0) {
  // H₂O-ish: O center + 2 H
  drawAtom(ctx, x, y, 5.5 * scale, 0xf87171, t, false);
  drawAtom(ctx, x - 9 * scale, y + 5 * scale, 3.5 * scale, 0xe0f2fe, t, false);
  drawAtom(ctx, x + 9 * scale, y + 5 * scale, 3.5 * scale, 0xe0f2fe, t, false);
  ctx.strokeStyle = "rgba(226,232,240,0.55)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(x - 4 * scale, y + 2 * scale);
  ctx.lineTo(x - 7 * scale, y + 4 * scale);
  ctx.moveTo(x + 4 * scale, y + 2 * scale);
  ctx.lineTo(x + 7 * scale, y + 4 * scale);
  ctx.stroke();
}

function drawLabel(ctx, text, x, y, opts = {}) {
  ctx.font = opts.font || "600 14px Segoe UI, system-ui, sans-serif";
  const tw = ctx.measureText(text).width;
  const padX = 12;
  const bw = tw + padX * 2;
  const bh = opts.h || 26;
  const bx = x - bw / 2;
  const by = y - bh / 2;
  ctx.fillStyle = opts.bg || "rgba(8,47,73,0.88)";
  roundRect(ctx, bx, by, bw, bh, 10);
  ctx.fill();
  ctx.strokeStyle = opts.border || "rgba(125,211,252,0.45)";
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.fillStyle = opts.color || "#e0f2fe";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y + 1);
}

function drawBottle(ctx, x, footY, fillColor = "#38bdf8", scale = 1) {
  ctx.save();
  ctx.translate(x, footAlign(footY, BOTTLE_FOOT * scale));
  ctx.scale(scale, scale);
  ctx.fillStyle = "rgba(2,6,23,0.25)";
  ctx.beginPath();
  ctx.ellipse(0, 48, 22, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = fillColor;
  roundRect(ctx, -18, -10, 36, 55, 8);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.22)";
  roundRect(ctx, -14, 0, 10, 35, 4);
  ctx.fill();
  ctx.fillStyle = "#64748b";
  roundRect(ctx, -10, -28, 20, 18, 4);
  ctx.fill();
  ctx.restore();
}

function drawCup(ctx, x, footY, fillColor = "#38bdf8", fillLevel = 0.55, scale = 1) {
  ctx.save();
  ctx.translate(x, footAlign(footY, CUP_FOOT * scale));
  ctx.scale(scale, scale);
  ctx.fillStyle = "rgba(2,6,23,0.22)";
  ctx.beginPath();
  ctx.ellipse(0, 30, 26, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  const level = Math.max(0, Math.min(1, fillLevel));
  if (level > 0) {
    const top = 24 - 46 * level;
    const inset = 3 + (1 - level) * 2;
    const water = ctx.createLinearGradient(0, top, 0, 26);
    water.addColorStop(0, "rgba(125,211,252,0.7)");
    water.addColorStop(0.55, fillColor);
    water.addColorStop(1, "rgba(2,132,199,0.9)");
    ctx.fillStyle = water;
    ctx.beginPath();
    ctx.moveTo(-18 + inset, top);
    ctx.quadraticCurveTo(0, top + 3, 18 - inset, top);
    ctx.lineTo(15, 25);
    ctx.quadraticCurveTo(0, 29, -15, 25);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(224,242,254,0.75)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(0, top, 18 - inset, 3.2, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(224,242,254,0.03)";
  ctx.beginPath();
  ctx.moveTo(-22, -26);
  ctx.lineTo(-16, 26);
  ctx.quadraticCurveTo(0, 31, 16, 26);
  ctx.lineTo(22, -26);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(224,242,254,0.92)";
  ctx.lineWidth = 2.4;
  ctx.stroke();
  ctx.strokeStyle = "rgba(224,242,254,0.92)";
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.ellipse(0, -26, 22, 4.5, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawPan(ctx, x, footY, hot = 0.4, scale = 1, opts = {}) {
  const stove = opts.stove !== false;
  const core = opts.core !== false;
  ctx.save();
  ctx.translate(x, footAlign(footY, PAN_FOOT * scale));
  ctx.scale(scale, scale);
  if (stove) {
    // Stove burner under pan
    ctx.fillStyle = "#1e293b";
    roundRect(ctx, -50, 10, 100, 14, 4);
    ctx.fill();
    if (core) {
      ctx.fillStyle = hot > 0.25 ? `rgba(249,115,22,${0.35 + hot * 0.45})` : "#334155";
      ctx.beginPath();
      ctx.arc(0, 14, 18, 0, Math.PI * 2);
      ctx.fill();
    }
    if (hot > 0.3) {
      ctx.fillStyle = `rgba(251,146,60,${0.3 + hot * 0.4})`;
      for (let i = 0; i < 5; i++) {
        const fx = -28 + i * 14;
        ctx.beginPath();
        ctx.moveTo(fx, 18);
        ctx.quadraticCurveTo(fx + 3, 32 + hot * 8, fx + 7, 18);
        ctx.fill();
      }
    }
  }
  ctx.fillStyle = "#475569";
  roundRect(ctx, -52, -8, 104, 16, 7);
  ctx.fill();
  ctx.fillStyle = `rgb(${70 + hot * 70},${70},${78 - hot * 15})`;
  ctx.beginPath();
  ctx.ellipse(0, -8, 46, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#64748b";
  roundRect(ctx, 46, -6, 38, 7, 3);
  ctx.fill();
  ctx.restore();
}

function drawSaltGrain(ctx, x, y, size = 18, t = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(t * 0.4) * 0.05);
  // Irregular crystal - not a white box
  ctx.fillStyle = "#f8fafc";
  ctx.beginPath();
  ctx.moveTo(-size * 0.45, -size * 0.15);
  ctx.lineTo(-size * 0.1, -size * 0.5);
  ctx.lineTo(size * 0.35, -size * 0.4);
  ctx.lineTo(size * 0.5, size * 0.05);
  ctx.lineTo(size * 0.2, size * 0.45);
  ctx.lineTo(-size * 0.3, size * 0.4);
  ctx.lineTo(-size * 0.5, size * 0.05);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(148,163,184,0.85)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = "rgba(226,232,240,0.9)";
  ctx.beginPath();
  ctx.moveTo(-size * 0.1, -size * 0.35);
  ctx.lineTo(size * 0.15, -size * 0.25);
  ctx.lineTo(0, size * 0.05);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawSaltShaker(ctx, x, footY, scale = 1, tilt = 0) {
  ctx.save();
  ctx.translate(x, footAlign(footY, SHAKER_FOOT * scale));
  ctx.rotate(tilt);
  ctx.scale(scale, scale);
  ctx.fillStyle = "rgba(2,6,23,0.2)";
  ctx.beginPath();
  ctx.ellipse(0, 20, 20, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(241,245,249,0.92)";
  roundRect(ctx, -16, -28, 32, 44, 9);
  ctx.fill();
  ctx.strokeStyle = "rgba(148,163,184,0.9)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#94a3b8";
  roundRect(ctx, -15, -36, 30, 12, 5);
  ctx.fill();
  ctx.fillStyle = "#334155";
  for (const dx of [-7, 0, 7]) {
    ctx.beginPath();
    ctx.arc(dx, -31, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#0f172a";
  ctx.font = "700 9px Segoe UI,sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("SALT", 0, 2);
  ctx.restore();
}

function drawMagnifier(ctx, x, y, radius, progress = 1) {
  ctx.save();
  ctx.globalAlpha = easeOutCubic(progress);
  ctx.strokeStyle = "#fbbf24";
  ctx.lineWidth = Math.max(5, radius * 0.1);
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "#f59e0b";
  ctx.lineWidth = Math.max(8, radius * 0.15);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x + radius * 0.7, y + radius * 0.7);
  ctx.lineTo(x + radius * 1.4, y + radius * 1.4);
  ctx.stroke();
  ctx.fillStyle = "rgba(186,230,253,0.12)";
  ctx.beginPath();
  ctx.arc(x, y, radius - 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawSteamCurl(ctx, x, y, t, index = 0, alpha = 0.65) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  const phase = t * 1.8 + index * 0.9;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.bezierCurveTo(
    x + Math.sin(phase) * 12,
    y - 18,
    x - Math.cos(phase) * 12,
    y - 36,
    x + Math.sin(phase + 1) * 8,
    y - 54,
  );
  ctx.stroke();
  ctx.restore();
}

function failShake() {
  const until = chemLabState.failPulse;
  if (!until || performance.now() > until) return 0;
  return Math.sin(performance.now() * 0.08) * 6;
}

function successFlash(ctx, w, h) {
  const until = chemLabState.successPulse;
  if (!until || performance.now() > until) return;
  const a = Math.max(0, (until - performance.now()) / 380) * 0.25;
  ctx.fillStyle = `rgba(52,211,153,${a})`;
  ctx.fillRect(0, 0, w, h);
}

function failFlash(ctx, w, h) {
  const until = chemLabState.failPulse;
  if (!until || performance.now() > until) return;
  const a = Math.max(0, (until - performance.now()) / 420) * 0.28;
  ctx.fillStyle = `rgba(248,113,113,${a})`;
  ctx.fillRect(0, 0, w, h);
}

function poolParticles(n, factory) {
  const arr = [];
  for (let i = 0; i < n; i++) arr.push(factory(i));
  return arr;
}

const SORT_ITEMS = [
  { id: "salt", label: "Salt", matter: true, color: 0xe2e8f0 },
  { id: "ice", label: "Ice", matter: true, color: 0x7dd3fc },
  { id: "steam", label: "Steam", matter: true, color: 0xf97316 },
  { id: "air", label: "Air", matter: true, color: 0x93c5fd },
  { id: "light", label: "Light", matter: false, color: 0xfbbf24 },
  { id: "idea", label: "Idea", matter: false, color: 0xc084fc },
  { id: "heat", label: "Heat", matter: false, color: 0xfb7185 },
  { id: "bottle", label: "Bottle", matter: true, color: 0x38bdf8 },
];

/**
 * @param {*} arena createArena2D result
 */
export function registerAtomScenes(arena) {
  if (!arena?.registerScene) return;

  /** 1 - Meet Tiny Bits */
  arena.registerScene("atomsMeet", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, reducedMotion, setHitRegions, setIntentHandler } = api;
    const phase = opts.phase || chemLabState.phase || "zoom";
    const start = performance.now();
    const atoms = poolParticles(26, (i) => ({
      a: (i / 26) * Math.PI * 2,
      r: 24 + (i % 6) * 9,
      speed: 0.55 + (i % 7) * 0.11,
      color: i % 3 === 0 ? 0x38bdf8 : i % 3 === 1 ? 0xa78bfa : 0x34d399,
      size: 4.5 + (i % 4),
    }));
    const pile = [];
    const shaker = { x: 0, y: 0, ready: false };
    const propPos = {};
    let dragProp = null;

    const descs = {
      zoom: "Drag the salt shaker. Tap it to pour. One grain is the focus.",
      cloud: "Drag the shaker or lens. Zoom into the grain until moving particles fill the view.",
      settle: "Drag salt, water, steam, and the desk - lines stay connected to the particle cloud.",
      predict: "Drag the shaker. Are those tiny bits frozen still, or always moving?",
    };
    setDescription(descs[phase] || descs.zoom);

    function clampProp(x, y, layout, w) {
      return {
        x: Math.max(36, Math.min(w - 36, x)),
        y: Math.max(48, Math.min(layout.deskTop + 8, y)),
      };
    }

    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_DOWN" && intent.meta?.propId != null) {
        dragProp = intent.meta.propId;
      }
      if (intent.type === "CANVAS_DRAG" && intent.meta?.propId === "shaker") {
        const layout = api.layout;
        const next = clampProp(intent.x, intent.y + 20, layout, api.width);
        shaker.x = next.x;
        shaker.y = next.y;
      }
      if (intent.type === "CANVAS_DRAG" && intent.meta?.propId != null && intent.meta.propId !== "shaker" && propPos[intent.meta.propId]) {
        const layout = api.layout;
        const next = clampProp(intent.x, intent.y, layout, api.width);
        propPos[intent.meta.propId].x = next.x;
        propPos[intent.meta.propId].y = next.y;
      }
      if (intent.type === "CANVAS_TAP" && intent.meta?.action === "pour") {
        chemLabState.scale = Math.min(1, (chemLabState.scale || 0) + 0.15);
      }
      if (intent.type === "CANVAS_UP") dragProp = null;
    });

    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const t = (performance.now() - start) / 1000;
      const dur = animDurSec();
      const shake = failShake();
      const live = chemLabState.phase || phase;
      if (!shaker.ready) {
        shaker.x = layout.leftProp.x;
        shaker.y = layout.deskTop;
        shaker.ready = true;
      }
      drawBackdrop();
      ctx.save();
      ctx.translate(shake, 0);

      const deskY = layout.deskTop;
      const hits = [];

      if (live === "zoom" || live === "predict") {
        const tip =
          dragProp === "shaker"
            ? 0.25
            : reducedMotion
              ? 0.35
              : Math.sin(Math.min(1, t / 1.2) * Math.PI) * 0.5;
        drawSaltShaker(ctx, shaker.x, shaker.y, 1.2, tip);
        const pour = reducedMotion ? 1 : easeInOutQuad(Math.min(1, t / Math.max(1, dur * 0.7)));
        const targetPile = Math.max(pile.length, Math.floor(pour * 18 + (chemLabState.scale || 0) * 12));
        while (pile.length < targetPile) {
          pile.push({
            x: shaker.x + 30 + (Math.random() - 0.3) * 90,
            y: shaker.y - 4 - Math.random() * 8,
            r: 2 + Math.random() * 2.5,
          });
        }
        for (const g of pile) {
          ctx.fillStyle = "#f8fafc";
          ctx.beginPath();
          ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
          ctx.fill();
        }
        const pulse = reducedMotion ? 1 : 1 + Math.sin(t * 5) * 0.12;
        const gx = shaker.x + 55;
        const gy = shaker.y - 6;
        ctx.strokeStyle = "rgba(250,204,21,0.8)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(gx, gy, 14 * pulse, 0, Math.PI * 2);
        ctx.stroke();
        drawLabel(
          ctx,
          live === "predict" ? "Still or always moving? Drag the shaker." : "Drag the salt shaker · tap to pour",
          w * 0.5,
          layout.labelY,
        );
        hits.push(
          { id: "grain", shape: "ellipse", x: gx, y: gy, r: 28, meta: { action: "focus" } },
          {
            id: "shaker",
            shape: "rect",
            x: shaker.x,
            y: shaker.y - 36,
            w: 84,
            h: 100,
            meta: { action: "pour", propId: "shaker" },
            onDrag(pt) {
              const next = clampProp(pt.x, pt.y + 20, layout, w);
              shaker.x = next.x;
              shaker.y = next.y;
            },
          },
        );
      } else if (live === "cloud") {
        const lensIn = reducedMotion ? 1 : easeOutCubic(Math.min(1, t / Math.max(0.6, dur * 0.25)));
        const reveal = reducedMotion
          ? 1
          : easeInOutQuad(Math.max(0, Math.min(1, (t - dur * 0.15) / (dur * 0.6))));
        if (!propPos.lens) {
          propPos.lens = { x: w * (0.78 - 0.28 * lensIn), y: h * (0.2 + 0.2 * lensIn) };
        }
        const lensX = propPos.lens.x;
        const lensY = propPos.lens.y;
        const lensR = 42 + reveal * Math.min(70, w * 0.1);
        drawSaltShaker(ctx, shaker.x, shaker.y, 0.85, 0);
        drawMagnifier(ctx, lensX, lensY, lensR, lensIn);
        ctx.save();
        ctx.beginPath();
        ctx.arc(lensX, lensY, lensR - 6, 0, Math.PI * 2);
        ctx.clip();
        const grainSize = 10 + reveal * 36;
        ctx.globalAlpha = 1 - reveal;
        drawSaltGrain(ctx, lensX, lensY, grainSize * 0.55, t);
        ctx.globalAlpha = 1;
        for (const a of atoms) {
          const ang = reducedMotion ? a.a : t * a.speed + a.a;
          const rr = a.r * reveal * 0.95;
          drawAtom(
            ctx,
            lensX + Math.cos(ang) * rr,
            lensY + Math.sin(ang * 1.15) * rr * 0.68,
            Math.max(1, a.size * reveal),
            a.color,
            t,
          );
        }
        ctx.restore();
        drawLabel(
          ctx,
          reveal < 0.5 ? "Drag the lens or shaker…" : "Particle model - always moving! Drag props.",
          w * 0.5,
          layout.labelY,
        );
        hits.push(
          {
            id: "shaker",
            shape: "rect",
            x: shaker.x,
            y: shaker.y - 32,
            w: 72,
            h: 92,
            meta: { action: "pour", propId: "shaker" },
            onDrag(pt) {
              const next = clampProp(pt.x, pt.y + 20, layout, w);
              shaker.x = next.x;
              shaker.y = next.y;
            },
          },
          {
            id: "lens",
            shape: "ellipse",
            x: lensX,
            y: lensY,
            r: lensR + 14,
            meta: { propId: "lens" },
            onDrag(pt) {
              propPos.lens.x = Math.max(40, Math.min(w - 40, pt.x));
              propPos.lens.y = Math.max(40, Math.min(h - 40, pt.y));
            },
          },
        );
      } else {
        const enter = reducedMotion ? 1 : easeOutCubic(Math.min(1, t / Math.max(0.7, dur * 0.45)));
        const cx = layout.center.x;
        const cy = h * 0.32;
        for (let i = 0; i < 16; i++) {
          const a = atoms[i];
          const ang = reducedMotion ? a.a : t * a.speed + a.a;
          drawAtom(
            ctx,
            cx + Math.cos(ang) * a.r * 0.5 * enter,
            cy + Math.sin(ang) * a.r * 0.55 * enter,
            a.size * 0.75,
            a.color,
            t,
          );
        }
        const cards = [
          { id: "salt", label: "Salt", draw: (x, y) => drawSaltShaker(ctx, x, y, 0.55, 0) },
          { id: "water", label: "Cool water", draw: (x, y) => drawCup(ctx, x, y, "#38bdf8", 0.55, 0.75) },
          {
            id: "steam",
            label: "Steam",
            draw: (x, y) => {
              drawPan(ctx, x, y, 0.55, 0.75, { stove: false });
              drawSteamCurl(ctx, x, y - 20, t, 1);
            },
          },
          {
            id: "desk",
            label: "Desk",
            draw: (x, y) => {
              ctx.fillStyle = "#64748b";
              roundRect(ctx, x - 28, y - 14, 56, 20, 4);
              ctx.fill();
            },
          },
        ];
        cards.forEach((c, i) => {
          if (!propPos[c.id]) {
            propPos[c.id] = { x: w * (0.15 + i * 0.23), y: deskY };
          }
          const x = propPos[c.id].x;
          const y = propPos[c.id].y;
          ctx.strokeStyle = `rgba(125,211,252,${0.25 + enter * 0.4})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(cx, cy + 24);
          ctx.quadraticCurveTo((cx + x) / 2, Math.min(cy, y) - 40, x, y - 28);
          ctx.stroke();
          c.draw(x, y);
          drawLabel(ctx, c.label, x, y + 28, { font: "600 11px Segoe UI,sans-serif", h: 22 });
          hits.push({
            id: `prop-${c.id}`,
            shape: "rect",
            x,
            y: y - 10,
            w: 84,
            h: 84,
            meta: { propId: c.id },
            onDrag(pt) {
              const next = clampProp(pt.x, pt.y, layout, w);
              propPos[c.id].x = next.x;
              propPos[c.id].y = next.y;
            },
          });
        });
        drawLabel(
          ctx,
          dragProp ? "Dragging - lines follow" : "Drag every prop - same tiny building blocks",
          w * 0.5,
          layout.labelY,
        );
      }

      setHitRegions(hits);
      ctx.restore();
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => {
      setHitRegions([]);
      setIntentHandler(null);
    });
  });

  /** 2 - Salt lattice */
  arena.registerScene("atomsSalt", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, reducedMotion, setHitRegions, setIntentHandler } = api;
    const assemble = opts.assemble !== false;
    const oilMode = opts.assemble === "oil";
    const start = performance.now();
    const ions = [];
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        const isNa = (x + y) % 2 === 0;
        ions.push({
          x,
          y,
          isNa,
          delay: (x + y * 4) * 0.05,
          color: isNa ? 0x38bdf8 : 0xf87171,
          size: isNa ? 11 : 9,
          label: isNa ? "Na⁺" : "Cl⁻",
        });
      }
    }
    const bottle = { x: 0, y: 0, ready: false };
    const shaker = { x: 0, y: 0, ready: false };
    const bowl = { x: 0, y: 0, ready: false };
    let oilSpill = 0;
    let oilDropX = 0;
    let oilDropY = 0;

    setDescription(
      oilMode
        ? "Oil also has particles, but not the neat crystal pattern of salt."
        : assemble
        ? "Drag the bottle or bowl. Sodium and chlorine ions lock into an ordered salt crystal lattice."
        : "Drag the salt shaker and bottle. Grains look simple from far away.",
    );

    function clampProp(x, y, layout, w) {
      return {
        x: Math.max(36, Math.min(w - 36, x)),
        y: Math.max(48, Math.min(layout.deskTop + 8, y)),
      };
    }

    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_DRAG" && intent.meta?.propId === "bottle") {
        const next = clampProp(intent.x, intent.y + 24, api.layout, api.width);
        bottle.x = next.x;
        bottle.y = next.y;
      }
      if (intent.type === "CANVAS_DRAG" && intent.meta?.propId === "shaker") {
        const next = clampProp(intent.x, intent.y + 20, api.layout, api.width);
        shaker.x = next.x;
        shaker.y = next.y;
      }
      if (intent.type === "CANVAS_DRAG" && intent.meta?.propId === "bowl") {
        const next = clampProp(intent.x, intent.y + 8, api.layout, api.width);
        bowl.x = next.x;
        bowl.y = next.y;
      }
      if (intent.type === "CANVAS_TAP" && intent.meta?.action === "pour") {
        chemLabState.scale = Math.min(1, (chemLabState.scale || 0) + 0.12);
      }
      if (oilMode && intent.type === "CANVAS_TAP" && intent.meta?.action === "oil-pour") {
        oilSpill = Math.min(1, oilSpill + 0.28);
        oilDropX = bottle.x + 72;
        oilDropY = bottle.y + 6;
      }
    });

    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const t = (performance.now() - start) / 1000;
      const dur = animDurSec();
      const shake = failShake();
      if (!bottle.ready) {
        bottle.x = layout.leftProp.x;
        bottle.y = layout.deskTop;
        bottle.ready = true;
      }
      if (!shaker.ready) {
        shaker.x = layout.midProp.x - 40;
        shaker.y = layout.deskTop;
        shaker.ready = true;
      }
      if (!bowl.ready) {
        bowl.x = layout.rightProp.x;
        bowl.y = layout.deskTop;
        bowl.ready = true;
      }
      drawBackdrop();
      ctx.save();
      ctx.translate(shake, 0);
      drawBottle(ctx, bottle.x, bottle.y, "#f59e0b", 1.05);
      ctx.fillStyle = "#e2e8f0";
      ctx.beginPath();
      ctx.ellipse(bowl.x, bowl.y - 4, 38, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      const hits = [
        {
          id: "bottle",
          shape: "rect",
          x: bottle.x,
          y: bottle.y - 50,
          w: 56,
          h: 110,
          meta: { propId: "bottle", action: oilMode ? "oil-pour" : undefined },
          onDrag(pt) {
            const next = clampProp(pt.x, pt.y + 24, layout, w);
            bottle.x = next.x;
            bottle.y = next.y;
          },
        },
        {
          id: "bowl",
          shape: "ellipse",
          x: bowl.x,
          y: bowl.y - 4,
          rx: 48,
          ry: 22,
          meta: { propId: "bowl" },
          onDrag(pt) {
            const next = clampProp(pt.x, pt.y + 8, layout, w);
            bowl.x = next.x;
            bowl.y = next.y;
          },
        },
      ];

      if (oilMode) {
        const spillAnim = reducedMotion ? 0.45 : easeInOutQuad(Math.min(0.45, t / Math.max(1.2, dur)));
        const spill = Math.max(oilSpill, spillAnim);
        const puddleX = oilDropX || bottle.x + 64;
        const puddleY = oilDropY || bottle.y + 2;
        if (oilSpill > 0.02) {
          ctx.strokeStyle = "rgba(251,191,36,0.5)";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(bottle.x + 16, bottle.y - 8);
          ctx.quadraticCurveTo(bottle.x + 34, bottle.y + 10, puddleX - 12, puddleY - 6);
          ctx.stroke();
        }
        // Oil spill stays on the desk, not attached to bottle movement.
        ctx.fillStyle = "rgba(245,158,11,0.75)";
        ctx.beginPath();
        ctx.ellipse(puddleX, puddleY, 18 + spill * 30, 5 + spill * 7, 0.12, 0, Math.PI * 2);
        ctx.fill();
        // Zoomed oil molecules: loose chains, not a crystal lattice
        const ox = layout.center.x + w * 0.06;
        const oy = h * 0.36;
        for (let chain = 0; chain < 4; chain++) {
          const baseY = oy - 36 + chain * 22;
          for (let j = 0; j < 5; j++) {
            const px = ox - 46 + j * 22 + Math.sin(t * 1.2 + chain + j * 0.4) * 3;
            const py = baseY + Math.cos(t * 1.1 + j + chain) * 4;
            drawAtom(ctx, px, py, 5.5, 0xfbbf24, t, false);
            if (j > 0) {
              ctx.strokeStyle = "rgba(253,224,71,0.6)";
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(px - 22, py);
              ctx.lineTo(px, py);
              ctx.stroke();
            }
          }
        }
        drawLabel(ctx, "Oil has particles too - loose molecules, not a salt crystal", w * 0.57, layout.labelY);
        drawLabel(ctx, "Oil drop", puddleX, puddleY + 18, { font: "600 10px Segoe UI,sans-serif", h: 16 });
        drawLabel(ctx, "Loose oil molecule chains", ox, oy + 62, {
          font: "600 10px Segoe UI,sans-serif",
          h: 16,
          color: "#fde68a",
        });
      } else if (!assemble) {
        drawSaltShaker(ctx, shaker.x, shaker.y, 1.05, Math.sin(Math.min(1, t) * Math.PI) * 0.4);
        const pour = reducedMotion ? 1 : easeInOutQuad(Math.min(1, t / Math.max(0.8, dur * 0.75)));
        const extra = (chemLabState.scale || 0) * 10;
        for (let i = 0; i < 16 + extra; i++) {
          const p = Math.max(0, Math.min(1, pour - i * 0.04));
          ctx.fillStyle = "#f8fafc";
          ctx.beginPath();
          ctx.arc(
            shaker.x + 20 + i * 5 + Math.sin(i) * 6,
            shaker.y - 8 - (1 - p) * 40,
            2.2 + (i % 3) * 0.6,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
        drawLabel(ctx, "Drag shaker / bottle · tap shaker to pour", w * 0.55, layout.labelY);
        hits.push({
          id: "shaker",
          shape: "rect",
          x: shaker.x,
          y: shaker.y - 36,
          w: 80,
          h: 96,
          meta: { action: "pour", propId: "shaker" },
          onDrag(pt) {
            const next = clampProp(pt.x, pt.y + 20, layout, w);
            shaker.x = next.x;
            shaker.y = next.y;
          },
        });
        hits.push({
          id: "bottle-pour",
          shape: "rect",
          x: bottle.x,
          y: bottle.y - 50,
          w: 56,
          h: 110,
          meta: { propId: "bottle" },
        });
      } else {
        const lx = layout.center.x + w * 0.08;
        const ly = h * 0.36;
        const cell = Math.min(26, w * 0.038);
        ctx.save();
        ctx.translate(lx, ly);
        for (let index = 0; index < ions.length; index++) {
          const ion = ions[index];
          const local = Math.max(0, t - ion.delay);
          const s = reducedMotion ? 1 : easeOutCubic(Math.min(1, local / Math.max(0.9, dur * 0.35)));
          if (s < 0.02) continue;
          const targetX = (ion.x - 1.5) * cell;
          const targetY = (ion.y - 1.5) * cell;
          const startAngle = index * 1.1;
          const startRadius = Math.min(w, h) * 0.22;
          const startX = Math.cos(startAngle) * startRadius;
          const startY = Math.sin(startAngle) * startRadius * 0.55;
          const px = startX + (targetX - startX) * s;
          const py = startY + (targetY - startY) * s;
          if (s > 0.72) {
            ctx.strokeStyle = `rgba(125,211,252,${(s - 0.72) * 2})`;
            ctx.lineWidth = 1.4;
            if (ion.x > 0) {
              ctx.beginPath();
              ctx.moveTo(px, py);
              ctx.lineTo(px - cell, py);
              ctx.stroke();
            }
            if (ion.y > 0) {
              ctx.beginPath();
              ctx.moveTo(px, py);
              ctx.lineTo(px, py - cell);
              ctx.stroke();
            }
          }
          drawAtom(ctx, px, py, ion.size * (0.55 + s * 0.45), ion.color, t);
          if (s > 0.78) {
            drawLabel(ctx, ion.isNa ? "Na+" : "Cl-", px, py + 16, {
              font: "700 10px Segoe UI,sans-serif",
              h: 16,
              color: ion.isNa ? "#bae6fd" : "#fecaca",
              border: "rgba(15,23,42,0.5)",
            });
          }
        }
        ctx.restore();
        drawLabel(
          ctx,
          t < dur * 0.4 ? "Ions find their places… drag bottle/bowl too" : "Na⁺ and Cl⁻ lock into a crystal",
          w * 0.58,
          layout.labelY,
        );
      }
      setHitRegions(hits);
      ctx.restore();
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => {
      setHitRegions([]);
      setIntentHandler(null);
    });
  });

  /** 3 - Sort matter vs not */
  arena.registerScene("atomsSort", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, reducedMotion, setHitRegions, setIntentHandler } = api;
    const start = performance.now();
    const items = (api.opts.items || SORT_ITEMS).slice(0, api.opts.itemCount || 8);
    const cardPos = {};
    items.forEach((it, i) => {
      cardPos[it.id] = { x: 0, y: 0, homeX: 0, homeY: 0, i };
    });
    let draggingId = null;

    setDescription("Sort matter (made of particles) versus energy or ideas.");
    setIntentHandler((intent) => {
      if (intent.type === "CANVAS_DOWN" && intent.meta?.chipId) {
        draggingId = intent.meta.chipId;
        chemLabState.selectedId = intent.meta.chipId;
      }
      if (intent.type === "CANVAS_DRAG" && intent.meta?.chipId && cardPos[intent.meta.chipId]) {
        draggingId = intent.meta.chipId;
        cardPos[intent.meta.chipId].x = intent.x;
        cardPos[intent.meta.chipId].y = intent.y;
      }
      if (intent.type === "CANVAS_TAP" && intent.meta?.chipId) {
        chemLabState.selectedId = intent.meta.chipId;
      }
      if (intent.type === "CANVAS_UP" && intent.meta?.chipId && intent.dropMeta?.zoneId) {
        const acceptList = intent.dropMeta.accept || [];
        if (acceptList.includes(intent.meta.chipId)) {
          chemLabState.placed = { ...chemLabState.placed, [intent.meta.chipId]: intent.dropMeta.zoneId };
          chemLabState.sortPlaced = Object.keys(chemLabState.placed).length;
          getActiveSession()?.dispatch?.({
            type: "PLACE_CHIP",
            chipId: intent.meta.chipId,
            zoneId: intent.dropMeta.zoneId,
            accept: acceptList,
          });
        } else {
          pulseFailFeedback(400);
        }
      }
      if (intent.type === "CANVAS_UP") draggingId = null;
    });

    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const t = (performance.now() - start) / 1000;
      const shake = failShake();
      drawBackdrop();
      ctx.save();
      ctx.translate(shake, 0);

      const yes = layout.sortZones.yes;
      const no = layout.sortZones.no;
      roundRect(ctx, yes.x, yes.y, yes.w, yes.h, 12);
      ctx.fillStyle = "rgba(14,165,233,0.2)";
      ctx.fill();
      drawLabel(ctx, "Matter (particles)", yes.x + yes.w / 2, yes.y + 16, { font: "600 12px Segoe UI,sans-serif", h: 22 });

      roundRect(ctx, no.x, no.y, no.w, no.h, 12);
      ctx.fillStyle = "rgba(251,191,36,0.16)";
      ctx.fill();
      drawLabel(ctx, "Not matter", no.x + no.w / 2, no.y + 16, { font: "600 12px Segoe UI,sans-serif", h: 22 });

      const placed = chemLabState.placed || {};
      const yesIds = items.filter((it) => placed[it.id] === "yes").map((it) => it.id);
      const noIds = items.filter((it) => placed[it.id] === "no").map((it) => it.id);
      const bankIds = items.filter((it) => !placed[it.id]).map((it) => it.id);

      const hits = [
        { id: "zone-yes", shape: "rect", x: yes.x + yes.w / 2, y: yes.y + yes.h / 2, w: yes.w, h: yes.h, meta: { zoneId: "yes", accept: items.filter((i) => i.matter).map((i) => i.id) } },
        { id: "zone-no", shape: "rect", x: no.x + no.w / 2, y: no.y + no.h / 2, w: no.w, h: no.h, meta: { zoneId: "no", accept: items.filter((i) => !i.matter).map((i) => i.id) } },
      ];

      items.forEach((it, i) => {
        let targetX;
        let targetY;
        if (placed[it.id] === "yes") {
          const idx = yesIds.indexOf(it.id);
          const slot = sortSlotPositions(yes, Math.max(yesIds.length, 1), idx);
          targetX = slot.x;
          targetY = slot.y + 8;
        } else if (placed[it.id] === "no") {
          const idx = noIds.indexOf(it.id);
          const slot = sortSlotPositions(no, Math.max(noIds.length, 1), idx);
          targetX = slot.x;
          targetY = slot.y + 8;
        } else {
          const idx = bankIds.indexOf(it.id);
          const cols = Math.min(4, bankIds.length || 1);
          const col = idx % cols;
          const row = Math.floor(idx / cols);
          targetX = w * 0.14 + col * (w * 0.2);
          targetY = layout.bankY + row * 58;
        }

        const prev = cardPos[it.id];
        if (!prev.x && !prev.y) {
          prev.x = targetX;
          prev.y = targetY;
        }
        if (draggingId !== it.id) {
          const ease = reducedMotion ? 1 : 0.18;
          prev.x += (targetX - prev.x) * ease;
          prev.y += (targetY - prev.y) * ease;
        }

        const selected = chemLabState.selectedId === it.id;
        ctx.fillStyle = it.matter ? "rgba(56,189,248,0.22)" : "rgba(251,191,36,0.2)";
        if (selected) ctx.fillStyle = "rgba(52,211,153,0.35)";
        roundRect(ctx, prev.x - 34, prev.y - 28, 68, 56, 10);
        ctx.fill();
        if (selected) {
          ctx.strokeStyle = "#34d399";
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }
        drawAtom(ctx, prev.x, prev.y - 4, 9, it.color, t, it.matter);
        drawLabel(ctx, it.label, prev.x, prev.y + 28, { font: "600 11px Segoe UI,sans-serif", h: 20 });

        if (chemLabState.reveal && it.matter) {
          for (let n = 0; n < 5; n++) {
            const ang = t * 1.5 + n;
            drawAtom(ctx, prev.x + Math.cos(ang) * 16, prev.y - 4 + Math.sin(ang) * 10, 3.5, 0x38bdf8, t);
          }
        }

        hits.push({
          id: `chip-${it.id}`,
          shape: "rect",
          x: prev.x,
          y: prev.y,
          w: 76,
          h: 64,
          meta: { chipId: it.id },
          onDrag(pt) {
            draggingId = it.id;
            prev.x = pt.x;
            prev.y = pt.y;
          },
        });
      });

      // Zones first in hit list would win last-to-first - chips already appended last so they win on overlap.
      setHitRegions(hits);
      const count = Object.keys(placed).length;
      drawLabel(
        ctx,
        chemLabState.reveal
          ? "Air and steam are matter too - light and ideas are not."
          : `${count} of ${items.length} sorted - drag cards into zones on the canvas`,
        w * 0.5,
        h * 0.92,
        { font: "600 12px Segoe UI,sans-serif", h: 24 },
      );
      ctx.restore();
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => {
      setHitRegions([]);
      setIntentHandler(null);
    });
  });

  /** 4 - Ice melting (H₂O molecules) */
  arena.registerScene("atomsIce", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, reducedMotion, setHitRegions, setIntentHandler } = api;
    const start = performance.now();
    let visualHeat = chemLabState.heat;
    const molecules = poolParticles(20, () => ({
      x: (Math.random() - 0.5) * 36,
      y: (Math.random() - 0.5) * 28,
      vx: 0,
      vy: 0,
      homeX: (Math.random() - 0.5) * 32,
      homeY: (Math.random() - 0.5) * 24,
    }));
    const steam = [];
    let steamBudget = 40;

    setDescription("Heat melts ice: H₂O molecules jiggle free into liquid water.");
    setTick(() => {
      lerpHeat();
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const t = (performance.now() - start) / 1000;
      visualHeat += (chemLabState.heat - visualHeat) * 0.2;
      const hv = visualHeat;
      const phase = heatPhase(hv);
      const melt = easeInOutQuad(Math.min(1, Math.max(0, (hv - 0.2) / 0.55)));
      const shake = failShake();
      drawBackdrop();
      ctx.save();
      ctx.translate(shake, 0);

      const cx = layout.midProp.x;
      const cupFoot = layout.deskTop;
      const waterLevel = 0.16 + melt * 0.44;
      drawCup(ctx, cx, cupFoot, "#38bdf8", waterLevel, 1.45);

      // Keep the ice block visibly above the rim, then let it melt down into the cup.
      const iceH = Math.max(0, 30 * (1 - melt));
      const iceW = 38 - melt * 8;
      const waterTopY = cupFoot - (10 + waterLevel * 46);
      const iceY = cupFoot - 62 - iceH * 0.35 + melt * 14;
      const iceCenterY = iceY + iceH * 0.5;
      if (iceH > 2) {
        ctx.globalAlpha = Math.max(0.08, 0.9 - melt * 0.75);
        const iceGradient = ctx.createLinearGradient(cx, iceY, cx, iceY + iceH);
        iceGradient.addColorStop(0, "#e0f2fe");
        iceGradient.addColorStop(1, "#7dd3fc");
        ctx.fillStyle = iceGradient;
        roundRect(ctx, cx - iceW / 2, iceY, iceW, iceH, 6);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        roundRect(ctx, cx - iceW / 2 + 4, iceY + 4, Math.max(8, iceW * 0.35), Math.max(4, iceH * 0.18), 4);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      const cupCy = cupFoot - 38;
      const waterBandY = Math.min(cupFoot - 18, waterTopY + 18);
      for (const m of molecules) {
        if (phase === "cold") {
          m.vx *= 0.85;
          m.vy *= 0.85;
          m.x += (m.homeX - m.x) * 0.08;
          m.y += (m.homeY - m.y) * 0.08;
          if (!reducedMotion) {
            m.x += Math.sin(t * 3 + m.homeX) * 0.15;
            m.y += Math.cos(t * 2.5 + m.homeY) * 0.12;
          }
        } else if (phase === "melting") {
          if (!reducedMotion) {
            m.vx += (Math.random() - 0.5) * 0.35;
            m.vy += (Math.random() - 0.5) * 0.35;
          }
          m.vx *= 0.92;
          m.vy *= 0.92;
          m.x += m.vx;
          m.y += m.vy;
        } else if (phase === "liquid") {
          // Settled liquid - gentle Brownian, stay in cup
          if (!reducedMotion) {
            m.vx += (Math.random() - 0.5) * 0.2;
            m.vy += (Math.random() - 0.5) * 0.15;
          }
          m.vx *= 0.94;
          m.vy *= 0.94;
          m.x += m.vx * 0.5;
          m.y += m.vy * 0.5;
        } else {
          // simmer - brief escape then settle; limited steam budget
          if (!reducedMotion) {
            m.vx += (Math.random() - 0.5) * 0.25;
            m.vy += (Math.random() - 0.5) * 0.2;
          }
          m.vx *= 0.93;
          m.vy *= 0.93;
          m.x += m.vx * 0.55;
          m.y += m.vy * 0.55;
          if (!reducedMotion && steamBudget > 0 && Math.random() < 0.015) {
            steam.push({ x: cx + m.x * 0.6, y: cupCy + m.y * 0.4, life: 1 });
            steamBudget--;
          }
        }
        m.x = Math.max(-22, Math.min(22, m.x));
        m.y = Math.max(-20, Math.min(18, m.y));
        let drawX = cx + m.x * 0.7;
        let drawY = cupCy + m.y * 0.55;
        let molScale = 0.82;
        let shouldDrawMolecule = false;
        if (phase === "cold") {
          drawX = cx + m.x * 0.48;
          drawY = iceCenterY + m.y * 0.32;
          molScale = 0.76;
          shouldDrawMolecule = true;
        } else if (phase === "melting") {
          const mix = Math.min(1, Math.max(0, (hv - 0.2) / 0.25));
          const topTrackY = iceCenterY + m.y * 0.28;
          const waterTrackY = waterBandY + m.y * 0.42;
          drawX = cx + m.x * (0.52 + mix * 0.18);
          drawY = topTrackY * (1 - mix) + waterTrackY * mix;
          molScale = 0.78 + mix * 0.06;
          shouldDrawMolecule = true;
        }
        if (shouldDrawMolecule) {
          drawMolecule(ctx, drawX, drawY, molScale, t);
        }
      }

      for (let i = steam.length - 1; i >= 0; i--) {
        const s = steam[i];
        s.y -= 1.1;
        s.x += Math.sin(t * 2 + i) * 0.35;
        s.life -= 0.02;
        ctx.globalAlpha = Math.max(0, s.life) * 0.7;
        drawAtom(ctx, s.x, s.y, 3.5, 0xe2e8f0, t, false);
        ctx.globalAlpha = 1;
        if (s.life <= 0) steam.splice(i, 1);
      }

      if (phase === "simmer" && hv > 0.62) {
        for (let i = 0; i < 2; i++) {
          drawSteamCurl(ctx, cx - 10 + i * 16, waterTopY - 2, t, i, 0.18 + (hv - 0.62) * 0.45);
        }
      }

      const phaseLabel = {
        cold: "Cold - H₂O molecules locked as ice",
        melting: "Melting - H₂O leaves the ice block and joins the water",
        liquid: "Liquid - free to slide, substance conserved",
        simmer: "Warm liquid - a little vapor lifts from the hot surface",
      };
      drawLabel(ctx, phaseLabel[phase], w * 0.5, layout.labelY);

      setHitRegions([]);

      ctx.restore();
      failFlash(ctx, w, h);
    });
    setDispose(() => {
      steam.length = 0;
      setHitRegions([]);
    });
  });

  /** 5 - Steam kinetic (no bottle) */
  arena.registerScene("atomsSteam", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, reducedMotion, setHitRegions, setIntentHandler } = api;
    const start = performance.now();
    let visualE = chemLabState.energy;
    const mols = poolParticles(22, () => ({
      x: (Math.random() - 0.5) * 70,
      y: Math.random() * 14,
      vx: (Math.random() - 0.5) * 1.2,
      vy: -Math.random() * 0.8,
      escaped: false,
    }));

    setDescription("Fast H₂O molecules leave the hot pan as vapor and steam mist.");
    setTick(() => {
      lerpHeat();
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const t = (performance.now() - start) / 1000;
      visualE += (chemLabState.energy - visualE) * 0.18;
      const e = visualE;
      const shake = failShake();
      drawBackdrop();
      ctx.save();
      ctx.translate(shake, 0);

      const px = layout.stove.x;
      const py = layout.deskTop;
      drawPan(ctx, px, py, e, 1.15, { core: false });
      // Small water puddle in pan
      ctx.fillStyle = `rgba(56,189,248,${0.35 + e * 0.2})`;
      ctx.beginPath();
      ctx.ellipse(px, py - 14, 32, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      for (const m of mols) {
        if (!reducedMotion) {
          const kick = e * 0.85;
          m.vx += (Math.random() - 0.5) * kick;
          m.vy += -Math.random() * kick * 0.7;
          m.vx *= 0.96;
          m.x += m.vx;
          m.y += m.vy;
          if (m.y < -h * 0.4 || Math.abs(m.x) > 110) {
            m.x = (Math.random() - 0.5) * 60;
            m.y = Math.random() * 12;
            m.vy = -Math.random() * 1.5 * e;
            m.escaped = e > 0.65;
          }
        }
        drawMolecule(ctx, px + m.x, py - 28 + m.y, 0.75, t);
      }
      if (e > 0.55) {
        for (let i = 0; i < 4; i++) drawSteamCurl(ctx, px - 20 + i * 14, py - 40, t, i, 0.35 + e * 0.4);
      }
      drawLabel(
        ctx,
        e < 0.4 ? "Warm pan - molecules jiggle in the water" : e < 0.7 ? "Evaporation - fastest molecules leave" : "Boiling - many molecules escape as vapor",
        w * 0.5,
        layout.labelY,
      );

      setHitRegions([]);

      ctx.restore();
      failFlash(ctx, w, h);
    });
    setDispose(() => {
      setHitRegions([]);
    });
  });

  /** 6 - Rule + simplified shells */
  arena.registerScene("atomsRule", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, reducedMotion, setHitRegions } = api;
    const start = performance.now();
    setDescription("Matter rule plus an optional simplified electron-shell model (not the particle-motion story).");

    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const t = (performance.now() - start) / 1000;
      const progress = Math.max(0, Math.min(4, chemLabState.tokenProgress || 0));
      const scale = chemLabState.scale || 0;
      const shake = failShake();
      drawBackdrop();
      ctx.save();
      ctx.translate(shake, 0);

      // Rule-builder visual: respond to token progress first, then scale scrubber later.
      const cx = layout.center.x;
      const cy = h * 0.36;
      if (scale <= 0.01) {
        if (progress <= 1) {
          const zoom = progress === 0 ? 1 : 1.32;
          drawSaltGrain(ctx, cx, cy, 24 * zoom, t);
          drawLabel(ctx, progress === 0 ? "Start with ordinary matter" : "Ordinary matter - zoom in", cx, layout.labelY);
        } else if (progress === 2) {
          drawSaltGrain(ctx, cx - 34, cy + 4, 18, t);
          for (let i = 0; i < 8; i++) {
            const ang = (i / 8) * Math.PI * 2 + t * 0.8;
            drawAtom(ctx, cx + 18 + Math.cos(ang) * 22, cy + Math.sin(ang) * 16, 5.5, i % 2 ? 0xf87171 : 0x38bdf8, t);
          }
          drawLabel(ctx, "Tiny bits inside the grain", cx, layout.labelY);
        } else if (progress === 3) {
          drawMolecule(ctx, cx, cy, 1.5, t);
          drawLabel(ctx, "A molecule can have three visible parts", cx, layout.labelY);
        } else {
          drawAtom(ctx, cx, cy, 13, 0xf472b6, t);
          const orbitRadii = [34, 52, 70];
          orbitRadii.forEach((r, oi) => {
            const rot = oi * 0.35;
            ctx.strokeStyle = "rgba(56,189,248,0.55)";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.08) {
              const p = pointOnRotatedEllipse(cx, cy, r, r * 0.55, rot, a);
              if (a === 0) ctx.moveTo(p.x, p.y);
              else ctx.lineTo(p.x, p.y);
            }
            ctx.stroke();
            const p = pointOnRotatedEllipse(cx, cy, r, r * 0.55, rot, reducedMotion ? 0 : t * (1.05 - oi * 0.12) + oi);
            drawAtom(ctx, p.x, p.y, 4.2, 0x38bdf8, t);
          });
          drawLabel(ctx, "Final token: orbital shell view", cx, layout.labelY);
        }
      } else if (scale < 0.33) {
        drawSaltGrain(ctx, cx, cy, 22 + scale * 12, t);
        drawLabel(ctx, "Salt grain (everyday)", cx, layout.labelY);
      } else if (scale < 0.66) {
        for (let i = 0; i < 8; i++) {
          const ang = (i / 8) * Math.PI * 2 + t;
          drawAtom(ctx, cx + Math.cos(ang) * 28, cy + Math.sin(ang) * 20, 7, i % 2 ? 0xf87171 : 0x38bdf8, t);
        }
        drawLabel(ctx, "Ions in a crystal (model)", cx, layout.labelY);
      } else {
        // Simplified shell model - matched rotation for ellipse + electrons
        drawAtom(ctx, cx, cy, 14, 0xf472b6, t);
        const counts = shellCountsForProgress(progress || (scale > 0.85 ? 3 : 2));
        const radii = layout.orbitRadii;
        counts.forEach((count, oi) => {
          const r = radii[oi] || 36 + oi * 22;
          const rot = oi * 0.35;
          ctx.strokeStyle = "rgba(56,189,248,0.5)";
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.08) {
            const p = pointOnRotatedEllipse(cx, cy, r, r * 0.55, rot, a);
            if (a === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
          ctx.stroke();
          for (let i = 0; i < count; i++) {
            const ang = reducedMotion
              ? (i / count) * Math.PI * 2
              : t * (1.1 - oi * 0.15) + (i / count) * Math.PI * 2;
            const p = pointOnRotatedEllipse(cx, cy, r, r * 0.55, rot, ang);
            drawAtom(ctx, p.x, p.y, 4.5, 0x38bdf8, t);
          }
        });
        drawLabel(ctx, "Simplified shells (electrons) - separate from motion rule", cx, layout.labelY, {
          font: "600 12px Segoe UI,sans-serif",
          h: 24,
        });
      }

      // Progress pips for sentence tokens
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = i < progress ? "#34d399" : "rgba(148,163,184,0.35)";
        ctx.beginPath();
        ctx.arc(cx - 42 + i * 28, h * 0.78, 7, 0, Math.PI * 2);
        ctx.fill();
      }
      const stageReadout =
        scale <= 0.01
          ? [
              "Token 1: ordinary matter",
              "Token 1: ordinary matter - zoomed",
              "Token 2: tiny bits appear",
              "Token 3: one molecule (3 parts)",
              "Token 4: orbital shell view",
            ][progress] || "Build the rule"
          : scale < 0.33
            ? "Scale: everyday grain"
            : scale < 0.66
              ? "Scale: ion crystal model"
              : "Scale: simplified orbital shells";
      drawLabel(ctx, stageReadout, cx, h * 0.72, {
        font: "600 11px Segoe UI,sans-serif",
        h: 20,
        color: "#bbf7d0",
      });
      drawLabel(ctx, "RULE: matter = tiny moving bits (atoms / molecules)", cx, h * 0.88, {
        font: "600 12px Segoe UI,sans-serif",
        h: 24,
      });

      // Scale slider hit region
      setHitRegions([
        {
          id: "scale",
          shape: "rect",
          x: cx,
          y: h * 0.92,
          w: w * 0.5,
          h: 30,
          meta: { action: "scale" },
        },
      ]);
      ctx.restore();
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => setHitRegions([]));
  });

  /** 7 - Stretch contexts */
  arena.registerScene("atomsStretch", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, reducedMotion, setHitRegions } = api;
    const mode = chemLabState.mode || opts.mode || "balloon";
    const start = performance.now();
    const movers = poolParticles(mode === "pencil" || mode === "steel" ? 28 : 20, (i) => ({
      phase: i * 0.4,
      r: 18 + Math.random() * 30,
      layer: Math.floor(i / 8),
      i,
    }));
    const titles = {
      balloon: "Air in a balloon = N₂ / O₂ molecules bouncing",
      pencil: "Pencil graphite = layers of carbon atoms",
      water: "Water droplet = H₂O molecules sliding",
      phone: "Phone glass = tightly packed particles",
      steel: "Steel spoon = metal atoms in a lattice",
    };
    setDescription(titles[mode] || "Same particle rule in a new context.");

    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const t = (performance.now() - start) / 1000;
      const shake = failShake();
      drawBackdrop();
      ctx.save();
      ctx.translate(shake, 0);
      const cx = layout.center.x;
      const cy = h * 0.38;
      const enter = reducedMotion ? 1 : easeOutCubic(Math.min(1, t / 0.8));

      if (mode === "balloon") {
        // Balloon grounded above desk with knot on the surface
        const balloonCy = layout.deskTop - 110;
        ctx.fillStyle = `rgba(248,113,113,${0.75 * enter})`;
        ctx.beginPath();
        ctx.ellipse(cx, balloonCy, 72 + Math.sin(t * 2) * 3, 88 + Math.cos(t * 2) * 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.beginPath();
        ctx.ellipse(cx - 22, balloonCy - 28, 14, 22, -0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(148,163,184,0.7)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, balloonCy + 88);
        ctx.lineTo(cx, layout.deskTop - 2);
        ctx.stroke();
        ctx.fillStyle = "#64748b";
        ctx.beginPath();
        ctx.moveTo(cx - 6, layout.deskTop - 8);
        ctx.lineTo(cx + 6, layout.deskTop - 8);
        ctx.lineTo(cx, layout.deskTop + 4);
        ctx.closePath();
        ctx.fill();
        for (const m of movers) {
          const ang = reducedMotion ? m.phase : t * 1.8 + m.phase;
          const bounce = 0.5 + 0.08 * Math.sin(t * 3 + m.phase);
          drawAtom(
            ctx,
            cx + Math.cos(ang) * m.r * bounce,
            balloonCy + Math.sin(ang * 1.15) * m.r * 0.7 * bounce,
            5,
            0x93c5fd,
            t,
          );
        }
      } else if (mode === "pencil") {
        // Pencil body on desk - graphite layers sit at the tip
        const tipX = cx + 100;
        const tipY = layout.deskTop - 7;
        ctx.fillStyle = "#ca8a04";
        roundRect(ctx, cx - 90, layout.deskTop - 18, 180, 22, 4);
        ctx.fill();
        ctx.fillStyle = "#78716c";
        ctx.beginPath();
        ctx.moveTo(cx + 90, layout.deskTop - 18);
        ctx.lineTo(cx + 118, tipY);
        ctx.lineTo(cx + 90, layout.deskTop + 4);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#1e293b";
        ctx.beginPath();
        ctx.moveTo(cx + 112, tipY - 3);
        ctx.lineTo(cx + 118, tipY);
        ctx.lineTo(cx + 112, tipY + 3);
        ctx.closePath();
        ctx.fill();
        // Graphite sheets nest at tip (not floating mid-canvas)
        for (const m of movers) {
          const col = m.i % 6;
          const layer = m.layer % 4;
          const px = tipX - 28 + col * 7;
          const py = tipY - 28 - layer * 9;
          const wobble = reducedMotion ? 0 : Math.sin(t * 2.2 + layer) * 1.2;
          drawAtom(ctx, px + wobble, py, 4.2, 0x475569, t, false);
          if (col < 5) {
            ctx.strokeStyle = "rgba(148,163,184,0.4)";
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px + 7, py);
            ctx.stroke();
          }
        }
        drawLabel(ctx, "Layers at the graphite tip", tipX - 10, tipY - 55, {
          font: "600 11px Segoe UI,sans-serif",
          h: 20,
        });
      } else if (mode === "phone") {
        ctx.fillStyle = "#0f172a";
        roundRect(ctx, cx - 40, cy - 70, 80, 140, 12);
        ctx.fill();
        ctx.fillStyle = "#1e293b";
        roundRect(ctx, cx - 34, cy - 58, 68, 110, 6);
        ctx.fill();
        for (let i = 0; i < 40; i++) {
          const col = i % 5;
          const row = Math.floor(i / 5);
          drawAtom(ctx, cx - 24 + col * 12, cy - 40 + row * 12, 3.5, 0x67e8f9, t, false);
        }
      } else if (mode === "steel") {
        ctx.fillStyle = "#94a3b8";
        roundRect(ctx, cx - 16, cy - 50, 32, 100, 4);
        ctx.fill();
        ctx.fillStyle = "#cbd5e1";
        ctx.beginPath();
        ctx.ellipse(cx, cy - 55, 22, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        for (const m of movers) {
          const col = m.i % 5;
          const row = Math.floor(m.i / 5);
          drawAtom(ctx, cx - 20 + col * 10, cy - 20 + row * 10, 4, 0x64748b, t, false);
        }
      } else {
        // water droplet
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.moveTo(cx, cy - 50);
        ctx.quadraticCurveTo(cx + 50, cy + 10, cx, cy + 45);
        ctx.quadraticCurveTo(cx - 50, cy + 10, cx, cy - 50);
        ctx.fill();
        for (const m of movers) {
          const ang = reducedMotion ? m.phase : t * 1.3 + m.phase;
          drawMolecule(ctx, cx + Math.cos(ang) * 28, cy + 8 + Math.abs(Math.sin(ang)) * 24, 0.7, t);
        }
      }
      drawLabel(ctx, titles[mode] || "Stretch case", cx, layout.labelY);
      ctx.restore();
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => setHitRegions([]));
  });

  /** 8 - Myth bust */
  arena.registerScene("atomsMyth", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, reducedMotion } = api;
    const myth = chemLabState.myth ?? opts.myth ?? 0;
    const start = performance.now();
    const movers = poolParticles(14, (i) => ({ phase: i * 0.45 }));
    const claims = [
      "MYTH: I can see atoms with my eyes",
      "MYTH: Atoms sit perfectly still in solids",
      "MYTH: Empty-looking air has no atoms",
      "MYTH: Steam is a brand-new substance",
      "MYTH: Heat is made of atoms",
    ];
    setDescription(claims[myth] || claims[0]);

    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const t = (performance.now() - start) / 1000;
      const phase = chemLabState.mythPhase || (chemLabState.mythBusted ? "truth" : "claim");
      const shake = failShake();
      drawBackdrop();
      ctx.save();
      ctx.translate(shake, 0);

      // Always show claim on left/center first
      drawLabel(ctx, claims[myth] || claims[0], w * 0.5, layout.labelY, { color: "#fecaca", border: "rgba(248,113,113,0.5)" });

      if (myth === 0) {
        drawAtom(ctx, w * 0.5, h * 0.42, 50, 0xf87171, t, false);
        drawLabel(ctx, "Huge ball = wrong picture", w * 0.5, h * 0.7, { color: "#fecaca" });
      } else if (myth === 1) {
        drawAtom(ctx, w * 0.5, h * 0.42, 24, 0xfbbf24, t, false);
        drawLabel(ctx, "Frozen forever?", w * 0.5, h * 0.7, { color: "#fde68a" });
      } else if (myth === 2) {
        drawLabel(ctx, "Looks empty…", w * 0.5, h * 0.42, { color: "#e2e8f0" });
      } else if (myth === 3) {
        drawPan(ctx, layout.center.x, layout.deskTop, 0.7, 1, { core: false });
        drawSteamCurl(ctx, layout.center.x, layout.deskTop - 30, t, 0);
        drawLabel(ctx, "Is steam a new substance?", w * 0.5, h * 0.28);
      } else {
        ctx.fillStyle = "rgba(249,115,22,0.5)";
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.42, 40, 0, Math.PI * 2);
        ctx.fill();
        drawLabel(ctx, "Is heat made of atoms?", w * 0.5, h * 0.7);
      }

      if (phase === "wrong") {
        drawLabel(ctx, "Not quite - that claim is a myth. Try Bust it!", w * 0.5, h * 0.85, {
          color: "#fecaca",
          border: "rgba(248,113,113,0.6)",
        });
      }

      if (phase === "truth") {
        const reveal = reducedMotion
          ? 1
          : easeOutCubic(Math.min(1, (performance.now() - (chemLabState.bustedAt || start)) / 700));
        ctx.save();
        ctx.globalAlpha = reveal;

        if (myth === 0) {
          drawAtom(ctx, w * 0.72, h * 0.42, 7, 0x38bdf8, t);
          drawLabel(ctx, "TRUTH: far too tiny", w * 0.72, h * 0.62, { color: "#bbf7d0" });
        } else if (myth === 1) {
          for (const m of movers) {
            const ang = reducedMotion ? m.phase : t * 2.4 + m.phase;
            drawAtom(ctx, w * 0.7 + Math.cos(ang) * 36, h * 0.42 + Math.sin(ang) * 24, 6, 0x34d399, t);
          }
          drawLabel(ctx, "TRUTH: always jiggling", w * 0.7, h * 0.68, { color: "#bbf7d0" });
        } else if (myth === 2) {
          for (const m of movers) {
            const ang = reducedMotion ? m.phase : t * 1.9 + m.phase;
            drawAtom(ctx, w * 0.5 + Math.cos(ang) * 55, h * 0.45 + Math.sin(ang) * 32, 5, 0x38bdf8, t);
          }
          drawLabel(ctx, "TRUTH: air is full of molecules", w * 0.5, h * 0.78, { color: "#bbf7d0" });
        } else if (myth === 3) {
          drawCup(ctx, w * 0.28, layout.deskTop, "#38bdf8", 0.6, 0.9);
          drawLabel(ctx, "Same H₂O - more motion", w * 0.5, h * 0.78, { color: "#bbf7d0" });
        } else {
          drawLabel(ctx, "TRUTH: heat is energy, not matter", w * 0.5, h * 0.78, { color: "#bbf7d0" });
        }
        drawLabel(ctx, "MYTH BUSTED ✓", w * 0.5, h * 0.9, { color: "#86efac", font: "800 14px Segoe UI,sans-serif" });
        ctx.restore();
      }

      ctx.restore();
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  /** 9 - Speed drill */
  arena.registerScene("atomsDrill", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, reducedMotion } = api;
    const start = performance.now();
    const particles = poolParticles(16, (i) => ({ a: i * 0.4, r: 36 + (i % 4) * 10 }));
    setDescription(chemLabState.prompt || opts.prompt || "Speed drill!");

    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const t = (performance.now() - start) / 1000;
      const shake = failShake();
      const prompt = chemLabState.prompt || opts.prompt || "Speed drill!";
      drawBackdrop();
      ctx.save();
      ctx.translate(shake, 0);
      const cx = layout.center.x;
      const cy = h * 0.38;

      if (/salt/i.test(prompt)) {
        for (let i = 0; i < 16; i++) {
          const col = i % 4;
          const row = Math.floor(i / 4);
          const snap = reducedMotion ? 1 : easeOutCubic(Math.min(1, t * 1.6 - i * 0.03));
          drawAtom(ctx, cx + (col - 1.5) * 24 * snap, cy + (row - 1.5) * 22 * snap, 7, (col + row) % 2 ? 0xf87171 : 0x38bdf8, t);
        }
      } else if (/ice|melt|water/i.test(prompt)) {
        drawCup(ctx, cx, layout.deskTop, "#38bdf8", 0.65, 1.25);
        particles.slice(0, 10).forEach((p, i) => {
          const a = reducedMotion ? p.a : t * 1.5 + p.a;
          drawMolecule(ctx, cx + Math.cos(a) * 22, layout.deskTop - 40 + Math.sin(a) * 14, 0.7, t);
        });
      } else if (/steam|vapor/i.test(prompt)) {
        drawPan(ctx, cx, layout.deskTop, 0.85, 1.1, { core: false });
        particles.slice(0, 12).forEach((p, i) => {
          const rise = reducedMotion ? i * 10 : (t * 40 + i * 16) % 140;
          drawMolecule(ctx, cx + Math.sin(t * 2 + i) * (10 + i), layout.deskTop - 20 - rise, 0.65, t);
        });
      } else if (/air|balloon/i.test(prompt)) {
        ctx.fillStyle = "rgba(248,113,113,0.75)";
        ctx.beginPath();
        ctx.ellipse(cx, cy, 70, 82, 0, 0, Math.PI * 2);
        ctx.fill();
        particles.slice(0, 12).forEach((p) => {
          const a = reducedMotion ? p.a : t * 2.2 + p.a;
          drawAtom(ctx, cx + Math.cos(a) * p.r * 0.65, cy + Math.sin(a) * p.r * 0.8, 5, 0x93c5fd, t);
        });
      } else if (/molecule|ion/i.test(prompt)) {
        drawMolecule(ctx, cx - 40, cy, 1.4, t);
        drawAtom(ctx, cx + 40, cy, 12, 0x38bdf8, t);
        drawLabel(ctx, "molecule vs atom", cx, cy + 50, { font: "600 12px Segoe UI,sans-serif" });
      } else {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const a = reducedMotion ? p.a : t * 2.4 + p.a;
          drawAtom(ctx, cx + Math.cos(a) * p.r, cy + Math.sin(a) * p.r * 0.68, 6, chemLabState.flashColor || 0x38bdf8, t);
        }
      }
      drawLabel(ctx, prompt, cx, layout.labelY);
      ctx.restore();
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });

  /** 10 - Mastery finale */
  arena.registerScene("atomsMastery", (api) => {
    const { ctx, setTick, setDispose, setDescription, drawBackdrop, reducedMotion } = api;
    const start = performance.now();
    const electrons = poolParticles(10, (i) => ({ phase: i * 0.62 }));
    const steps = ["Meet", "Sort", "Melt", "Rule", "Stretch"];
    setDescription("Tiny Bits mastery - salt, melt, rule, stretch, and myths united.");

    setTick(() => {
      const w = api.width;
      const h = api.height;
      const layout = api.layout;
      const t = (performance.now() - start) / 1000;
      const shake = failShake();
      const locked = Math.max(0, Math.min(5, chemLabState.masteryStep || 0));
      drawBackdrop();
      ctx.save();
      ctx.translate(shake, 0);

      drawSaltShaker(ctx, layout.leftProp.x, layout.deskTop, 0.85, 0);
      drawCup(ctx, layout.midProp.x - 30, layout.deskTop, "#38bdf8", 0.55, 0.95);
      drawPan(ctx, layout.rightProp.x, layout.deskTop, 0.65, 0.95, { core: false });
      drawSteamCurl(ctx, layout.rightProp.x, layout.deskTop - 28, t, 0, 0.55);

      const cx = w * 0.5;
      const cy = h * 0.28;
      drawAtom(ctx, cx, cy, 12, 0xf472b6, t);
      for (const e of electrons) {
        const ang = reducedMotion ? e.phase : t * 1.5 + e.phase;
        const p = pointOnRotatedEllipse(cx, cy, 42, 24, 0.2, ang);
        drawAtom(ctx, p.x, p.y, 4.5, 0x38bdf8, t);
      }

      steps.forEach((label, i) => {
        const x = w * 0.12 + i * (w * 0.17);
        const y = h * 0.82;
        ctx.fillStyle = i < locked ? "#34d399" : "rgba(148,163,184,0.35)";
        roundRect(ctx, x - 30, y - 12, 60, 24, 8);
        ctx.fill();
        ctx.fillStyle = "#0f172a";
        ctx.font = "600 11px Segoe UI,sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, x, y);
      });
      drawLabel(ctx, "Tiny Bits Mastered!", w * 0.5, layout.labelY);
      ctx.restore();
      failFlash(ctx, w, h);
      successFlash(ctx, w, h);
    });
    setDispose(() => {});
  });
}

export const ATOM_ASSET_PATHS = {
  orbit: `${ASSET}/atom-orbit.svg`,
  salt: `${ASSET}/salt-crystal.svg`,
  ice: `${ASSET}/ice-melt.svg`,
  steam: `${ASSET}/steam-cloud.svg`,
  magnify: `${ASSET}/magnify-atoms.svg`,
  myth: `${ASSET}/myth-bust.svg`,
};
