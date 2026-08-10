/**
 * Chemistry Lab · Mission 3: Bond Buddies - Canvas 2D scenes.
 * Tiny Bits parity: phased meet, zoneId sort + PLACE_CHIP, prop drag, distinct stretch.
 */
import { chemLabState, pulseFailFeedback, pulseSuccessFeedback } from "./atom-scenes.js";
import { CUP_FOOT, footAlign } from "./scene-layout.js";
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
 ctx.fillStyle = opts.bg || "rgba(46,16,80,0.88)";
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

function drawAtom(ctx, x, y, r, color, t = 0, label = "") {
 const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 1, x, y, r);
 const hex = `#${color.toString(16).padStart(6, "0")}`;
 g.addColorStop(0, "#fff");
 g.addColorStop(0.4, hex);
 g.addColorStop(1, "#1e1b4b");
 ctx.fillStyle = g;
 ctx.beginPath();
 ctx.arc(x, y, r, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "rgba(255,255,255,0.35)";
 ctx.stroke();
 if (label) {
 ctx.fillStyle = "#0f172a";
 ctx.font = `700 ${Math.max(9, r)}px Segoe UI`;
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(label, x, y + 1);
 }
 if (t) {
 ctx.strokeStyle = "rgba(196,181,253,0.3)";
 ctx.beginPath();
 ctx.ellipse(x, y, r * 1.7, r * 0.65, t * 0.3, 0, Math.PI * 2);
 ctx.stroke();
 }
}

function drawBond(ctx, x1, y1, x2, y2, strength = 1) {
 ctx.strokeStyle = `rgba(167,139,250,${0.35 + strength * 0.55})`;
 ctx.lineWidth = 2 + strength * 3;
 ctx.lineCap = "round";
 ctx.beginPath();
 ctx.moveTo(x1, y1);
 ctx.lineTo(x2, y2);
 ctx.stroke();
}

function drawMagnet(ctx, x, y, pole, scale = 1) {
 ctx.save();
 ctx.translate(x, y);
 ctx.scale(scale, scale);
 ctx.fillStyle = pole === "N" ? "#ef4444" : "#3b82f6";
 roundRect(ctx, -18, -28, 36, 56, 6);
 ctx.fill();
 ctx.fillStyle = "#fff";
 ctx.font = "700 16px Segoe UI";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(pole, 0, 0);
 ctx.restore();
}

function drawCup(ctx, x, footY, fill = 0.5) {
 ctx.save();
 ctx.translate(x, footAlign(footY, CUP_FOOT));
 ctx.strokeStyle = "rgba(226,232,240,0.7)";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.moveTo(-22, -40);
 ctx.lineTo(-18, 20);
 ctx.lineTo(18, 20);
 ctx.lineTo(22, -40);
 ctx.stroke();
 ctx.fillStyle = "rgba(96,165,250,0.55)";
 ctx.fillRect(-16, 20 - fill * 50, 32, fill * 50);
 ctx.restore();
}

function failShake() {
 const until = chemLabState.failPulse;
 if (!until || performance.now() > until) return 0;
 return Math.sin(performance.now() * 0.08) * 6;
}

function failFlash(ctx, w, h) {
 const until = chemLabState.failPulse;
 if (!until || performance.now() > until) return;
 const a = Math.max(0, (until - performance.now()) / 420) * 0.28;
 ctx.fillStyle = `rgba(248,113,113,${a})`;
 ctx.fillRect(0, 0, w, h);
}

function successFlash(ctx, w, h) {
 const until = chemLabState.successPulse;
 if (!until || performance.now() > until) return;
 const a = Math.max(0, (until - performance.now()) / 380) * 0.25;
 ctx.fillStyle = `rgba(167,139,250,${a})`;
 ctx.fillRect(0, 0, w, h);
}

function clampXY(x, y, w, layout) {
 return {
 x: Math.max(36, Math.min(w - 36, x)),
 y: Math.max(48, Math.min(layout.deskTop + 8, y)),
 };
}

export function registerBondScenes(arena) {
 if (!arena?.registerScene) return;

 /** Meet Bond Buddies - desk → link → glow → settle (phase-driven like Tiny Bits) */
 arena.registerScene("bondMeet", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions, setIntentHandler, reducedMotion } =
 api;
 const startPhase = opts.phase || chemLabState.bondPhase || chemLabState.phase || "desk";
 chemLabState.bondPhase = startPhase;
 chemLabState.phase = startPhase;
 const start = performance.now();
 const magN = { x: 0, y: 0, ready: false };
 const magS = { x: 0, y: 0, ready: false };
 const cup = { x: 0, y: 0, ready: false };
 let linked = false;

 const descs = {
 desk: "Drag the magnets and cup. Everyday clues that things pull and stick.",
 link: "Tap atoms A and B so a bond buddy link forms between them.",
 glow: "Watch the bond glow - lasting links, not craft glue.",
 settle: "Drag props - lines stay tied to the bonded pair. Molecules need bonds.",
 predict: "Predict: do mixtures need chemical bonds between their parts?",
 };
 setDescription(descs[startPhase] || descs.desk);

 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "link") {
 linked = true;
 chemLabState.bondSnap = Math.min(1, (chemLabState.bondSnap || 0) + 0.35);
 pulseSuccessFeedback(280);
 }
 });

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const t = (performance.now() - start) / 1000;
 const live = chemLabState.phase || chemLabState.bondPhase || startPhase;
 chemLabState.bondPhase = live;
 const snap = chemLabState.bondSnap || 0;
 const shake = failShake();
 if (!magN.ready) {
 magN.x = layout.leftProp.x;
 magN.y = layout.deskTop - 10;
 magN.ready = true;
 magS.x = layout.rightProp.x;
 magS.y = layout.deskTop - 10;
 magS.ready = true;
 cup.x = layout.midProp.x;
 cup.y = layout.deskTop;
 cup.ready = true;
 }
 ctx.save();
 if (shake) ctx.translate(shake, 0);
 drawBackdrop();
 const hits = [];

 const ax = w * 0.32 + snap * 28;
 const bx = w * 0.68 - snap * 28;
 const cy = h * 0.34;

 if (live === "desk") {
 drawCup(ctx, cup.x, cup.y, 0.45);
 drawMagnet(ctx, magN.x, magN.y, "N", 0.95);
 drawMagnet(ctx, magS.x, magS.y, "S", 0.95);
 drawLabel(ctx, "N", magN.x, magN.y + 40, { h: 18, font: "700 11px Segoe UI" });
 drawLabel(ctx, "S", magS.x, magS.y + 40, { h: 18, font: "700 11px Segoe UI" });
 drawLabel(ctx, "Bond Buddies · Drag magnets & cup", w * 0.5, layout.labelY);
 hits.push(
 {
 id: "magN",
 shape: "rect",
 x: magN.x,
 y: magN.y,
 w: 48,
 h: 64,
 meta: { propId: "magN" },
 onDrag(pt) {
 const n = clampXY(pt.x, pt.y, w, layout);
 magN.x = n.x;
 magN.y = n.y;
 },
 },
 {
 id: "magS",
 shape: "rect",
 x: magS.x,
 y: magS.y,
 w: 48,
 h: 64,
 meta: { propId: "magS" },
 onDrag(pt) {
 const n = clampXY(pt.x, pt.y, w, layout);
 magS.x = n.x;
 magS.y = n.y;
 },
 },
 {
 id: "cup",
 shape: "rect",
 x: cup.x,
 y: cup.y - 10,
 w: 56,
 h: 70,
 meta: { propId: "cup" },
 onDrag(pt) {
 const n = clampXY(pt.x, pt.y, w, layout);
 cup.x = n.x;
 cup.y = n.y;
 },
 },
 );
 } else if (live === "link") {
 drawCup(ctx, cup.x, layout.deskTop, 0.4);
 drawMagnet(ctx, magN.x, layout.deskTop - 8, "N", 0.75);
 drawMagnet(ctx, magS.x, layout.deskTop - 8, "S", 0.75);
 if (snap > 0.25 || linked) drawBond(ctx, ax + 14, cy, bx - 14, cy, Math.max(0.4, snap));
 drawAtom(ctx, ax, cy, 18, 0x38bdf8, reducedMotion ? 0 : t, "A");
 drawAtom(ctx, bx, cy, 18, 0xf472b6, reducedMotion ? 0 : t, "B");
 drawLabel(
 ctx,
 snap > 0.5 || linked ? "Bond buddies linked!" : "Tap atoms A & B to form a bond",
 w * 0.5,
 layout.labelY,
 );
 hits.push(
 { id: "a", shape: "rect", x: ax, y: cy, w: 56, h: 56, meta: { action: "link" } },
 { id: "b", shape: "rect", x: bx, y: cy, w: 56, h: 56, meta: { action: "link" } },
 );
 } else if (live === "glow" || live === "predict") {
 const glow = live === "glow";
 if (glow || snap > 0.2) drawBond(ctx, ax + 14, cy, bx - 14, cy, 1);
 drawAtom(ctx, ax, cy, 18, 0x38bdf8, reducedMotion ? 0 : t, "A");
 drawAtom(ctx, bx, cy, 18, 0xf472b6, reducedMotion ? 0 : t, "B");
 if (glow) {
 ctx.strokeStyle = "rgba(196,181,253,0.55)";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.ellipse(w * 0.5, cy, 90 + Math.sin(t) * 4, 36, 0, 0, Math.PI * 2);
 ctx.stroke();
 }
 drawLabel(
 ctx,
 glow
 ? "Glow = lasting electrical link (not craft glue)"
 : "Predict: do sand + water need chemical bonds?",
 w * 0.5,
 layout.labelY,
 );
 if (!glow) {
 drawCup(ctx, layout.midProp.x, layout.deskTop, 0.5);
 drawLabel(ctx, "mixture clue", layout.midProp.x, layout.deskTop + 32, {
 h: 18,
 font: "600 11px Segoe UI",
 });
 }
 } else {
 // settle
 drawCup(ctx, cup.x, cup.y, 0.5);
 drawMagnet(ctx, magN.x, magN.y, "N", 0.85);
 drawMagnet(ctx, magS.x, magS.y, "S", 0.85);
 drawBond(ctx, ax + 14, cy, bx - 14, cy, 1);
 drawAtom(ctx, ax, cy, 16, 0x38bdf8, reducedMotion ? 0 : t, "A");
 drawAtom(ctx, bx, cy, 16, 0xf472b6, reducedMotion ? 0 : t, "B");
 ctx.strokeStyle = "rgba(167,139,250,0.35)";
 ctx.lineWidth = 1.5;
 ctx.setLineDash([4, 4]);
 ctx.beginPath();
 ctx.moveTo(magN.x, magN.y - 20);
 ctx.lineTo(ax, cy + 18);
 ctx.moveTo(magS.x, magS.y - 20);
 ctx.lineTo(bx, cy + 18);
 ctx.moveTo(cup.x, cup.y - 30);
 ctx.lineTo(w * 0.5, cy + 20);
 ctx.stroke();
 ctx.setLineDash([]);
 drawLabel(ctx, "Molecules exist because bonds hold atom friends", w * 0.5, layout.labelY);
 hits.push(
 {
 id: "magN",
 shape: "rect",
 x: magN.x,
 y: magN.y,
 w: 48,
 h: 64,
 meta: { propId: "magN" },
 onDrag(pt) {
 const n = clampXY(pt.x, pt.y, w, layout);
 magN.x = n.x;
 magN.y = n.y;
 },
 },
 {
 id: "magS",
 shape: "rect",
 x: magS.x,
 y: magS.y,
 w: 48,
 h: 64,
 meta: { propId: "magS" },
 onDrag(pt) {
 const n = clampXY(pt.x, pt.y, w, layout);
 magS.x = n.x;
 magS.y = n.y;
 },
 },
 {
 id: "cup",
 shape: "rect",
 x: cup.x,
 y: cup.y - 10,
 w: 56,
 h: 70,
 meta: { propId: "cup" },
 onDrag(pt) {
 const n = clampXY(pt.x, pt.y, w, layout);
 cup.x = n.x;
 cup.y = n.y;
 },
 },
 );
 }

 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 ctx.restore();
 });
 setDispose(() => setIntentHandler(null));
 });

 /** Attraction - independently draggable magnets */
 arena.registerScene("bondMagnet", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } =
 api;
 const start = performance.now();
 const magN = { x: 0, y: 0, ready: false };
 const magS = { x: 0, y: 0, ready: false };
 setDescription("Drag each magnet - opposite poles attract like ionic buddies.");

 function syncGapFromPositions(w) {
 const dist = Math.abs(magS.x - magN.x);
 const maxD = w * 0.55;
 const minD = 44;
 const g = Math.max(0, Math.min(1, (dist - minD) / (maxD - minD)));
 chemLabState.magnetGap = g;
 chemLabState.heat = 1 - g;
 chemLabState.heatTarget = 1 - g;
 }

 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "nudge") {
 chemLabState.magnetGap = Math.max(0, (chemLabState.magnetGap ?? 1) - 0.1);
 chemLabState.heat = 1 - chemLabState.magnetGap;
 const mid = api.width * 0.5;
 const spread = 40 + chemLabState.magnetGap * 90;
 magN.x = mid - spread;
 magS.x = mid + spread;
 }
 });

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const t = (performance.now() - start) / 1000;
 const shake = failShake();
 if (!magN.ready) {
 const gap0 = chemLabState.magnetGap ?? 1 - (chemLabState.heat || 0);
 const mid = w * 0.5;
 const cy = h * 0.38;
 const spread = 40 + gap0 * 90;
 magN.x = mid - spread;
 magN.y = cy;
 magS.x = mid + spread;
 magS.y = cy;
 magN.ready = true;
 magS.ready = true;
 }
 // Heat slider can drive magnets closer
 const heatPull = chemLabState.heat || 0;
 if (heatPull > 0.05 && !api._magDragging) {
 const mid = w * 0.5;
 const targetSpread = 40 + (1 - heatPull) * 90;
 const ease = reducedMotion ? 1 : 0.12;
 const cur = (magS.x - magN.x) / 2;
 const next = cur + (targetSpread - cur) * ease;
 magN.x = mid - next;
 magS.x = mid + next;
 }
 syncGapFromPositions(w);
 const gap = chemLabState.magnetGap ?? 0;

 ctx.save();
 if (shake) ctx.translate(shake, 0);
 drawBackdrop();
 drawMagnet(ctx, magN.x, magN.y, "N", 1.1);
 drawMagnet(ctx, magS.x, magS.y, "S", 1.1);
 if (gap < 0.35) {
 drawBond(ctx, magN.x + 20, magN.y, magS.x - 20, magS.y, 1 - gap);
 drawLabel(ctx, "Click! Attraction holds them", w * 0.5, magN.y - 60);
 }
 ctx.strokeStyle = "#94a3b8";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.moveTo(layout.leftProp.x, h * 0.12);
 ctx.lineTo(layout.leftProp.x, layout.deskTop - 50);
 ctx.stroke();
 drawCup(ctx, layout.leftProp.x, layout.deskTop, 0.4);
 drawLabel(
 ctx,
 gap < 0.3 ? "Held together - bond buddy feel" : "Drag each magnet closer (or use the slider)",
 w * 0.5,
 layout.labelY,
 );
 setHitRegions([
 {
 id: "magN",
 shape: "rect",
 x: magN.x,
 y: magN.y,
 w: 52,
 h: 70,
 meta: { propId: "magN" },
 onDrag(pt) {
 api._magDragging = true;
 magN.x = Math.max(40, Math.min(magS.x - 50, pt.x));
 magN.y = Math.max(60, Math.min(h * 0.55, pt.y));
 syncGapFromPositions(w);
 },
 },
 {
 id: "magS",
 shape: "rect",
 x: magS.x,
 y: magS.y,
 w: 52,
 h: 70,
 meta: { propId: "magS" },
 onDrag(pt) {
 api._magDragging = true;
 magS.x = Math.max(magN.x + 50, Math.min(w - 40, pt.x));
 magS.y = Math.max(60, Math.min(h * 0.55, pt.y));
 syncGapFromPositions(w);
 },
 },
 {
 id: "nudge",
 shape: "rect",
 x: w * 0.5,
 y: (magN.y + magS.y) / 2 + 70,
 w: 100,
 h: 36,
 meta: { action: "nudge" },
 },
 ]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 ctx.restore();
 });
 setDispose(() => {
 api._magDragging = false;
 setIntentHandler(null);
 });
 });

 /** Sort - zoneId strings + PLACE_CHIP (Tiny Bits / Element Hunt pattern) */
 arena.registerScene("bondSort", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } =
 api;
 setDescription("Drag cards: bonded molecule, ionic stick, or no bond / just mix.");

 const chips = [
 { id: "h2o", text: "H₂O molecule", short: "H₂O", color: 0x60a5fa },
 { id: "nacl", text: "Na⁺ Cl⁻ salt", short: "NaCl", color: 0xf472b6 },
 { id: "o2", text: "O₂ pair", short: "O₂", color: 0x38bdf8 },
 { id: "fe", text: "Lone Fe atom", short: "Fe", color: 0x94a3b8 },
 { id: "air", text: "N₂ near O₂ (air)", short: "Air", color: 0x93c5fd },
 { id: "magnet", text: "N-S magnet snap", short: "Magnet", color: 0xef4444 },
 { id: "sand", text: "Sand in water", short: "Sand", color: 0xfbbf24 },
 { id: "co2", text: "CO₂ molecule", short: "CO₂", color: 0xa78bfa },
 ];
 const accept = {
 bonded: ["h2o", "o2", "co2"],
 attraction: ["nacl", "magnet"],
 nobond: ["fe", "air", "sand"],
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
 chemLabState.placed = { ...(chemLabState.placed || {}), [chipId]: zoneId };
 chemLabState.sortPlaced = Object.keys(chemLabState.placed).length;
 chemLabState.selectedId = chipId;
 const session = getActiveSession();
 if (session?.dispatch) {
 session.dispatch({ type: "PLACE_CHIP", chipId, zoneId, accept: accept[zoneId] });
 } else {
 chemLabState._placedVersion = (chemLabState._placedVersion || 0) + 1;
 }
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
 if (intent.type === "CANVAS_TAP" && intent.meta?.zoneId && chemLabState.selectedId) {
 placeChip(chemLabState.selectedId, intent.meta.zoneId);
 }
 if (intent.type === "CANVAS_UP" && intent.meta?.chipId) {
 const zoneId = intent.dropMeta?.zoneId || zoneAt(intent.x, intent.y);
 if (zoneId) placeChip(intent.meta.chipId, zoneId);
 draggingId = null;
 } else if (intent.type === "CANVAS_UP") {
 draggingId = null;
 }
 });

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const shake = failShake();
 ctx.save();
 if (shake) ctx.translate(shake, 0);
 drawBackdrop();

 const zoneH = Math.max(100, Math.min(h * 0.3, 140));
 const zoneY = Math.max(layout.labelY + 30, h * 0.09);
 const zones = [
 { id: "bonded", label: "Bonded molecule", x: w * 0.03, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#a78bfa" },
 { id: "attraction", label: "Attraction buddy", x: w * 0.35, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#f472b6" },
 { id: "nobond", label: "No chemical bond", x: w * 0.67, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#94a3b8" },
 ];
 lastZones = zones;

 const hits = [];
 for (const z of zones) {
 ctx.fillStyle = "rgba(15,23,42,0.55)";
 roundRect(ctx, z.x, z.y, z.ww, z.hh, 12);
 ctx.fill();
 ctx.strokeStyle = z.color;
 ctx.lineWidth = 2.5;
 ctx.stroke();
 drawLabel(ctx, z.label, z.x + z.ww / 2, z.y + 16, { h: 20, font: "700 11px Segoe UI" });
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

 const placed = chemLabState.placed || {};
 const byZone = {
 bonded: chips.filter((c) => placed[c.id] === "bonded").map((c) => c.id),
 attraction: chips.filter((c) => placed[c.id] === "attraction").map((c) => c.id),
 nobond: chips.filter((c) => placed[c.id] === "nobond").map((c) => c.id),
 };
 const bankIds = chips.filter((c) => typeof placed[c.id] !== "string").map((c) => c.id);
 const bankTop = zoneY + zoneH + (chemLabState.reveal ? 50 : 30);
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
 const cols = Math.min(4, Math.max(1, bankIds.length));
 const col = idx % cols;
 const row = Math.floor(idx / cols);
 targetX = w * 0.14 + col * (w * 0.22);
 targetY = bankTop + row * 50;
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

 const selected = chemLabState.selectedId === c.id;
 const hex = "#" + c.color.toString(16).padStart(6, "0");
 ctx.fillStyle = selected ? "rgba(167,139,250,0.45)" : "rgba(30,27,75,0.95)";
 roundRect(ctx, prev.x - 48, prev.y - 20, 96, 40, 10);
 ctx.fill();
 ctx.strokeStyle = selected ? "#c4b5fd" : hex;
 ctx.lineWidth = selected ? 2.5 : 1.6;
 ctx.stroke();
 ctx.fillStyle = "#ede9fe";
 ctx.font = "700 12px Segoe UI,sans-serif";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(c.short || c.text, prev.x, prev.y);

 hits.push({
 id: c.id,
 shape: "rect",
 x: prev.x,
 y: prev.y,
 w: 100,
 h: 44,
 meta: { chipId: c.id, propId: c.id },
 onDrag(pt) {
 draggingId = c.id;
 prev.x = Math.max(30, Math.min(w - 30, pt.x));
 prev.y = Math.max(30, Math.min(h - 30, pt.y));
 },
 });
 });

 drawLabel(ctx, "Sort bond stories", w * 0.5, layout.labelY);
 if (chemLabState.reveal) {
 drawLabel(ctx, "Bonds = lasting atom links · Mixtures just sit nearby", w * 0.5, zoneY + zoneH + 16, {
 h: 22,
 font: "600 11px Segoe UI",
 bg: "rgba(46,16,80,0.92)",
 });
 }

 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 ctx.restore();
 });
 setDispose(() => setIntentHandler(null));
 });

 /** Magnet snap - horizontal handle (action snap, never heat) */
 arena.registerScene("bondSnap", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } =
 api;
 const start = performance.now();
 setDescription("Drag the violet handle until magnets click - model for opposites attracting.");

 function applySnap(next) {
 const v = Math.max(0, Math.min(1, next));
 chemLabState.heat = v;
 chemLabState.heatTarget = v;
 chemLabState.bondSnap = v;
 }

 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "snap") {
 applySnap((intent.x - api.width * 0.2) / (api.width * 0.6));
 }
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "nudge") {
 applySnap((chemLabState.heat || 0) + 0.1);
 }
 });

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const t = reducedMotion ? 0 : (performance.now() - start) / 1000;
 const snap = chemLabState.heat ?? chemLabState.bondSnap ?? 0;
 chemLabState.bondSnap = snap;
 const shake = failShake();
 ctx.save();
 if (shake) ctx.translate(shake, 0);
 drawBackdrop();
 const mid = w * 0.5;
 const cy = h * 0.4;
 const spread = 100 - snap * 85;
 drawMagnet(ctx, mid - spread, cy, "N", 1.15);
 drawMagnet(ctx, mid + spread, cy, "S", 1.15);
 drawAtom(ctx, mid - spread, cy - 70, 12, 0xf87171, t, "+");
 drawAtom(ctx, mid + spread, cy - 70, 12, 0x60a5fa, t, "−");
 if (snap > 0.7) {
 drawBond(ctx, mid - 20, cy - 70, mid + 20, cy - 70, 1);
 drawLabel(ctx, "SNAP! Buddy bond formed", mid, cy - 110);
 }
 const hx = w * 0.2 + snap * w * 0.6;
 ctx.fillStyle = "#c4b5fd";
 ctx.beginPath();
 ctx.arc(hx, cy + 70, 14, 0, Math.PI * 2);
 ctx.fill();
 drawLabel(ctx, "Bring together", hx, cy + 95, { h: 20, font: "600 11px Segoe UI" });
 drawLabel(ctx, snap > 0.75 ? "Ionic-style attraction click" : "Slide handle to click magnets", w * 0.5, layout.labelY);
 setHitRegions([
 { id: "h", shape: "rect", x: hx, y: cy + 70, w: 48, h: 48, meta: { action: "snap" } },
 { id: "m", shape: "rect", x: mid, y: cy, w: spread * 2 + 60, h: 90, meta: { action: "nudge" } },
 ]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 ctx.restore();
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("bondWater", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } =
 api;
 const start = performance.now();
 const dropPos = [];
 for (let i = 0; i < 4; i++) dropPos.push({ x: 0, y: 0, ready: false });
 setDescription("Drag droplets or tap - H and O stick as H₂O bond buddies.");

 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "merge") {
 chemLabState.dropMerge = Math.min(1, (chemLabState.dropMerge || 0) + 0.2);
 if (chemLabState.dropMerge >= 0.8) pulseSuccessFeedback(300);
 }
 });

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const t = reducedMotion ? 0 : (performance.now() - start) / 1000;
 const merge = chemLabState.dropMerge || 0;
 const shake = failShake();
 ctx.save();
 if (shake) ctx.translate(shake, 0);
 drawBackdrop();
 drawCup(ctx, layout.midProp.x, layout.deskTop, 0.35 + merge * 0.4);
 const hits = [
 {
 id: "cup",
 shape: "rect",
 x: layout.midProp.x,
 y: layout.deskTop - 10,
 w: 56,
 h: 70,
 meta: { action: "merge" },
 },
 ];
 for (let i = 0; i < 4; i++) {
 if (!dropPos[i].ready) {
 dropPos[i].x = w * 0.22 + i * 90;
 dropPos[i].y = h * 0.32;
 dropPos[i].ready = true;
 }
 const x = dropPos[i].x;
 const y = dropPos[i].y + Math.sin(t + i) * (reducedMotion ? 0 : 8);
 const hy1 = x - 18 + merge * 6;
 const hy2 = x + 18 - merge * 6;
 drawBond(ctx, hy1, y + 10, x, y, 0.6 + merge * 0.4);
 drawBond(ctx, hy2, y + 10, x, y, 0.6 + merge * 0.4);
 drawAtom(ctx, x, y, 11, 0xf87171, t, "O");
 drawAtom(ctx, hy1, y + 14, 7, 0x38bdf8, t, "H");
 drawAtom(ctx, hy2, y + 14, 7, 0x38bdf8, t, "H");
 hits.push({
 id: "drop" + i,
 shape: "rect",
 x,
 y: y + 4,
 w: 56,
 h: 48,
 meta: { propId: "drop" + i, action: "merge" },
 onDrag(pt) {
 dropPos[i].x = Math.max(40, Math.min(w - 40, pt.x));
 dropPos[i].y = Math.max(60, Math.min(layout.deskTop - 40, pt.y));
 chemLabState.dropMerge = Math.min(1, (chemLabState.dropMerge || 0) + 0.01);
 },
 });
 }
 drawLabel(
 ctx,
 merge > 0.7 ? "Droplets stick - molecules are bonded H₂O buddies" : "Drag or tap water models to strengthen bonds",
 w * 0.5,
 layout.labelY,
 );
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 ctx.restore();
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("bondRule", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 const start = performance.now();
 setDescription("Build the bond rule, then scrub magnets → atom link → BONDS.");

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const t = (performance.now() - start) / 1000;
 const prog = chemLabState.tokenProgress || 0;
 const scale = chemLabState.scale || 0;
 drawBackdrop();

 if (scale < 0.33) {
 if (scale <= 0.02 && prog > 0) {
 const tokens = ["Atoms", "link with", "BONDS", "as buddies"];
 tokens.forEach((label, i) => {
 const x = w * 0.18 + i * (w * 0.18);
 const on = i < prog;
 ctx.fillStyle = on ? "rgba(167,139,250,0.4)" : "rgba(30,27,75,0.85)";
 roundRect(ctx, x - 50, h * 0.28 - 18, 100, 36, 10);
 ctx.fill();
 ctx.strokeStyle = on ? "#a78bfa" : "#4c1d95";
 ctx.stroke();
 ctx.fillStyle = on ? "#f5f3ff" : "#a5b4fc";
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(label, x, h * 0.28);
 });
 }
 drawMagnet(ctx, layout.leftProp.x, layout.deskTop - 8, "N", 0.9);
 drawCup(ctx, layout.midProp.x, layout.deskTop, 0.55);
 drawMagnet(ctx, layout.rightProp.x, layout.deskTop - 8, "S", 0.9);
 drawLabel(
 ctx,
 scale <= 0.02 && prog > 0
 ? "Build the rule · magnets hint attraction"
 : "Desk magnets / cup - attraction analogy",
 w * 0.5,
 layout.labelY,
 );
 } else if (scale < 0.66) {
 drawAtom(ctx, w * 0.38, h * 0.38, 16, 0x38bdf8, t, "Na");
 drawAtom(ctx, w * 0.62, h * 0.38, 16, 0xf472b6, t, "Cl");
 drawBond(ctx, w * 0.38 + 18, h * 0.38, w * 0.62 - 18, h * 0.38, 1);
 drawLabel(ctx, "Atom buddies held by a lasting link", w * 0.5, layout.labelY);
 drawMagnet(ctx, layout.midProp.x, layout.deskTop - 4, "N", 0.55);
 } else {
 ctx.fillStyle = "rgba(167,139,250,0.22)";
 roundRect(ctx, w * 0.18, h * 0.28, w * 0.64, h * 0.28, 18);
 ctx.fill();
 ctx.strokeStyle = "#a78bfa";
 ctx.lineWidth = 3;
 roundRect(ctx, w * 0.18, h * 0.28, w * 0.64, h * 0.28, 18);
 ctx.stroke();
 ctx.fillStyle = "#f5f3ff";
 ctx.font = "800 28px Segoe UI,sans-serif";
 ctx.textAlign = "center";
 ctx.fillText("BONDS", w * 0.5, h * 0.4);
 ctx.font = "600 14px Segoe UI,sans-serif";
 ctx.fillStyle = "#ddd6fe";
 ctx.fillText("links that hold atoms together as buddies", w * 0.5, h * 0.48);
 drawAtom(ctx, w * 0.4, h * 0.68, 12, 0xa78bfa, t, "A");
 drawAtom(ctx, w * 0.6, h * 0.68, 12, 0xf472b6, t, "B");
 drawBond(ctx, w * 0.4 + 14, h * 0.68, w * 0.6 - 14, h * 0.68, 1);
 drawLabel(ctx, "Name it: BONDS (not glue sticks, not only magnets)", w * 0.5, layout.labelY);
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("bondStretch", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } =
 api;
 const start = performance.now();
 const modes = ["salt", "o2", "sugar", "plastic", "protein"];
 const modeLabels = { salt: "Salt", o2: "O₂", sugar: "Sugar", plastic: "Plastic", protein: "Protein" };
 setDescription("Tap each bonded context - same bond idea in new places.");

 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.mode) {
 chemLabState.mode = intent.meta.mode;
 pulseSuccessFeedback(200);
 }
 });

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const t = reducedMotion ? 0 : (performance.now() - start) / 1000;
 const mode = chemLabState.mode || api.opts?.mode || "salt";
 const shake = failShake();
 ctx.save();
 if (shake) ctx.translate(shake, 0);
 drawBackdrop();
 const hits = [];
 modes.forEach((m, i) => {
 const x = w * 0.12 + i * (w * 0.17);
 const on = m === mode;
 ctx.fillStyle = on ? "rgba(167,139,250,0.4)" : "#1e1b4b";
 roundRect(ctx, x - 36, layout.deskTop - 36, 72, 48, 10);
 ctx.fill();
 ctx.strokeStyle = on ? "#a78bfa" : "#4c1d95";
 ctx.lineWidth = on ? 2 : 1;
 ctx.stroke();
 ctx.fillStyle = "#ede9fe";
 ctx.font = "600 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(modeLabels[m] || m, x, layout.deskTop - 10);
 hits.push({ id: m, shape: "rect", x, y: layout.deskTop - 12, w: 72, h: 48, meta: { mode: m } });
 });

 const cy = h * 0.32;
 if (mode === "salt") {
 for (let r = 0; r < 3; r++) {
 for (let c = 0; c < 4; c++) {
 const x = w * 0.32 + c * 36;
 const y = cy - 20 + r * 28;
 const plus = (r + c) % 2 === 0;
 drawAtom(ctx, x, y, 9, plus ? 0x38bdf8 : 0xf472b6, t, plus ? "+" : "−");
 if (c < 3) drawBond(ctx, x + 10, y, x + 26, y, 0.7);
 }
 }
 } else if (mode === "o2") {
 drawAtom(ctx, w * 0.45, cy, 14, 0x38bdf8, t, "O");
 drawAtom(ctx, w * 0.55, cy, 14, 0x38bdf8, t, "O");
 drawBond(ctx, w * 0.45 + 14, cy - 3, w * 0.55 - 14, cy - 3, 1);
 drawBond(ctx, w * 0.45 + 14, cy + 3, w * 0.55 - 14, cy + 3, 1);
 } else if (mode === "sugar") {
 const ring = [
 [0, -28],
 [26, -14],
 [26, 14],
 [0, 28],
 [-26, 14],
 [-26, -14],
 ];
 ring.forEach(([dx, dy], i) => {
 const x = w * 0.5 + dx;
 const y = cy + dy;
 drawAtom(ctx, x, y, 8, i % 2 ? 0xf87171 : 0xa78bfa, t, i % 2 ? "O" : "C");
 const n = ring[(i + 1) % ring.length];
 drawBond(ctx, x, y, w * 0.5 + n[0], cy + n[1], 0.75);
 });
 drawAtom(ctx, w * 0.5, cy - 52, 6, 0x38bdf8, t, "H");
 drawBond(ctx, w * 0.5, cy - 28, w * 0.5, cy - 46, 0.5);
 } else if (mode === "plastic") {
 for (let i = 0; i < 7; i++) {
 const x = w * 0.22 + i * 48;
 const y = cy + Math.sin(i * 0.9 + t) * 6;
 drawAtom(ctx, x, y, 9, 0xa78bfa, t, "C");
 if (i < 6) drawBond(ctx, x + 10, y, x + 38, cy + Math.sin((i + 1) * 0.9 + t) * 6, 0.85);
 drawAtom(ctx, x, y - 22, 5, 0x38bdf8, t, "H");
 drawBond(ctx, x, y - 10, x, y - 18, 0.4);
 }
 } else {
 const pts = [];
 for (let i = 0; i < 8; i++) {
 const x = w * 0.22 + i * 42;
 const y = cy + Math.sin(i * 0.85) * 28;
 pts.push([x, y]);
 drawAtom(ctx, x, y, 8, 0xf472b6, t, "N");
 if (i % 2 === 0) {
 drawAtom(ctx, x + 8, y - 24, 6, 0xfbbf24, t, "R");
 drawBond(ctx, x, y - 8, x + 6, y - 18, 0.5);
 }
 }
 for (let i = 0; i < pts.length - 1; i++) {
 drawBond(ctx, pts[i][0] + 8, pts[i][1], pts[i + 1][0] - 8, pts[i + 1][1], 0.8);
 }
 }

 const captions = {
 salt: "Salt lattice · opposite charges buddy up → bonds",
 o2: "O₂ · two oxygen atoms share a double bond",
 sugar: "Sugar ring · many C/H/O atoms bonded",
 plastic: "Plastic chain · long bonded C backbone",
 protein: "Protein fold · bonded amino buddies",
 };
 drawLabel(ctx, captions[mode] || "Stretch", w * 0.5, layout.labelY);
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 ctx.restore();
 });
 setDispose(() => setIntentHandler(null));
 });

 /** Myths - claim vs truth with bond-specific diagrams */
 arena.registerScene("bondMyth", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const start = performance.now();
 setDescription("Bust bond myths - canvas shows glue vs link, mixture vs molecule, and more.");
 const myths = [
 {
 claim: "Bonds are tiny glue sticks",
 truth: "Bonds are electrical attractions / shared electrons - not craft glue",
 kind: "glue",
 },
 {
 claim: "Magnets = exact chemical bonds",
 truth: "Magnets are a helpful analogy, not the full chemistry story",
 kind: "magnet",
 },
 {
 claim: "Mixtures have chemical bonds between parts",
 truth: "Mixtures sit together without new bonded compounds",
 kind: "mixture",
 },
 {
 claim: "Breaking a bond creates new elements",
 truth: "Breaking bonds rearranges atoms - atom kinds stay the same",
 kind: "break",
 },
 {
 claim: "Only solids have bonds",
 truth: "Gases like O₂ and liquids like water also have bonded molecules",
 kind: "states",
 },
 ];

 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "flip") {
 chemLabState.mythPhase = chemLabState.mythPhase === "truth" ? "claim" : "truth";
 if (chemLabState.mythPhase === "truth") pulseSuccessFeedback(220);
 }
 });

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const t = (performance.now() - start) / 1000;
 const idx = chemLabState.myth ?? 0;
 const phase = chemLabState.mythPhase || "claim";
 const m = myths[idx] || myths[0];
 drawBackdrop();
 ctx.fillStyle = phase === "truth" ? "rgba(167,139,250,0.18)" : "rgba(248,113,113,0.16)";
 roundRect(ctx, w * 0.1, h * 0.1, w * 0.8, 44, 12);
 ctx.fill();
 drawLabel(ctx, phase === "truth" ? m.truth : `Myth: ${m.claim}`, w * 0.5, h * 0.12 + 12, {
 h: 28,
 font: "700 13px Segoe UI",
 });

 const cx = w * 0.5;
 const cy = h * 0.42;

 if (phase === "claim") {
 if (m.kind === "glue") {
 ctx.fillStyle = "#fbbf24";
 roundRect(ctx, cx - 40, cy - 50, 28, 70, 4);
 ctx.fill();
 ctx.fillStyle = "#f59e0b";
 ctx.beginPath();
 ctx.ellipse(cx - 26, cy + 28, 18, 10, 0, 0, Math.PI * 2);
 ctx.fill();
 drawAtom(ctx, cx + 30, cy - 10, 12, 0xf87171, t, "?");
 drawAtom(ctx, cx + 60, cy + 10, 12, 0x38bdf8, t, "?");
 drawLabel(ctx, "Claim: craft glue between atoms?", cx, cy + 70, { h: 22, font: "600 12px Segoe UI" });
 } else if (m.kind === "magnet") {
 drawMagnet(ctx, cx - 40, cy, "N", 1);
 drawMagnet(ctx, cx + 40, cy, "S", 1);
 drawLabel(ctx, "Claim: fridge magnets = full chemistry?", cx, cy + 70, { h: 22, font: "600 12px Segoe UI" });
 } else if (m.kind === "mixture") {
 drawAtom(ctx, cx - 50, cy, 10, 0x94a3b8, t, "N");
 drawAtom(ctx, cx, cy - 12, 10, 0x38bdf8, t, "O");
 drawAtom(ctx, cx + 50, cy + 8, 10, 0xfbbf24, t, "S");
 drawLabel(ctx, "Claim: nearby stuff must be bonded?", cx, cy + 70, { h: 22, font: "600 12px Segoe UI" });
 } else if (m.kind === "break") {
 drawAtom(ctx, cx - 30, cy, 14, 0xa78bfa, t, "A");
 drawAtom(ctx, cx + 30, cy, 14, 0xf472b6, t, "B");
 ctx.strokeStyle = "rgba(248,113,113,0.9)";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.moveTo(cx - 8, cy - 16);
 ctx.lineTo(cx + 8, cy + 16);
 ctx.moveTo(cx + 8, cy - 16);
 ctx.lineTo(cx - 8, cy + 16);
 ctx.stroke();
 drawLabel(ctx, "Claim: break → brand-new elements?", cx, cy + 70, { h: 22, font: "600 12px Segoe UI" });
 } else {
 ctx.fillStyle = "#64748b";
 roundRect(ctx, cx - 40, cy - 20, 80, 50, 6);
 ctx.fill();
 drawLabel(ctx, "Claim: only solids have bonds?", cx, cy + 70, { h: 22, font: "600 12px Segoe UI" });
 }
 } else if (m.kind === "glue") {
 drawAtom(ctx, cx - 36, cy, 14, 0x38bdf8, t, "Na");
 drawAtom(ctx, cx + 36, cy, 14, 0xf472b6, t, "Cl");
 drawBond(ctx, cx - 20, cy, cx + 20, cy, 1);
 // tiny e⁻ hint dots along the bond
 for (let i = 0; i < 3; i++) {
 const px = cx - 12 + i * 12;
 ctx.fillStyle = "rgba(250,204,21,0.85)";
 ctx.beginPath();
 ctx.arc(px, cy - 10 + Math.sin(t + i) * 3, 3, 0, Math.PI * 2);
 ctx.fill();
 }
 drawLabel(ctx, "Truth: charge / shared electrons (not glue)", cx, cy + 70, { h: 22, font: "600 12px Segoe UI" });
 } else if (m.kind === "magnet") {
 drawMagnet(ctx, cx - 70, cy, "N", 0.7);
 drawMagnet(ctx, cx - 30, cy, "S", 0.7);
 drawLabel(ctx, "analogy", cx - 50, cy + 48, { h: 18, font: "600 10px Segoe UI" });
 drawAtom(ctx, cx + 30, cy, 12, 0x38bdf8, t, "Na");
 drawAtom(ctx, cx + 70, cy, 12, 0xf472b6, t, "Cl");
 drawBond(ctx, cx + 42, cy, cx + 58, cy, 1);
 drawLabel(ctx, "chemistry", cx + 50, cy + 48, { h: 18, font: "600 10px Segoe UI" });
 drawLabel(ctx, "Truth: magnets hint attraction - bonds are deeper", cx, cy + 78, {
 h: 22,
 font: "600 12px Segoe UI",
 });
 } else if (m.kind === "mixture") {
 // left: mixture (no bond lines), right: molecule (with bond)
 drawAtom(ctx, cx - 70, cy - 8, 10, 0x94a3b8, t, "N");
 drawAtom(ctx, cx - 40, cy + 12, 10, 0x38bdf8, t, "O");
 drawLabel(ctx, "mixture", cx - 55, cy + 48, { h: 18, font: "600 10px Segoe UI" });
 drawAtom(ctx, cx + 30, cy, 11, 0xf87171, t, "H");
 drawAtom(ctx, cx + 58, cy - 8, 13, 0x38bdf8, t, "O");
 drawAtom(ctx, cx + 82, cy + 10, 11, 0xf87171, t, "H");
 drawBond(ctx, cx + 40, cy - 2, cx + 48, cy - 6, 0.9);
 drawBond(ctx, cx + 68, cy - 2, cx + 74, cy + 6, 0.9);
 drawLabel(ctx, "molecule", cx + 55, cy + 48, { h: 18, font: "600 10px Segoe UI" });
 drawLabel(ctx, "Truth: mixture parts stay separate substances", cx, cy + 78, {
 h: 22,
 font: "600 12px Segoe UI",
 });
 } else if (m.kind === "break") {
 drawAtom(ctx, cx - 50, cy, 14, 0xa78bfa, t, "A");
 drawAtom(ctx, cx + 10, cy, 14, 0xf472b6, t, "B");
 ctx.strokeStyle = "rgba(167,139,250,0.35)";
 ctx.setLineDash([4, 4]);
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.moveTo(cx - 34, cy);
 ctx.lineTo(cx - 6, cy);
 ctx.stroke();
 ctx.setLineDash([]);
 drawAtom(ctx, cx + 70, cy - 20, 10, 0xa78bfa, t, "A");
 drawAtom(ctx, cx + 70, cy + 20, 10, 0xf472b6, t, "B");
 drawLabel(ctx, "Truth: same atom kinds, new arrangement", cx, cy + 70, {
 h: 22,
 font: "600 12px Segoe UI",
 });
 } else {
 // gas O2 + liquid H2O
 drawAtom(ctx, cx - 60, cy - 8, 11, 0x38bdf8, t, "O");
 drawAtom(ctx, cx - 30, cy - 8, 11, 0x38bdf8, t, "O");
 drawBond(ctx, cx - 49, cy - 10, cx - 41, cy - 10, 1);
 drawBond(ctx, cx - 49, cy - 6, cx - 41, cy - 6, 1);
 drawLabel(ctx, "gas O₂", cx - 45, cy + 28, { h: 18, font: "600 10px Segoe UI" });
 drawAtom(ctx, cx + 20, cy, 10, 0xf87171, t, "H");
 drawAtom(ctx, cx + 48, cy - 8, 12, 0x38bdf8, t, "O");
 drawAtom(ctx, cx + 72, cy + 8, 10, 0xf87171, t, "H");
 drawBond(ctx, cx + 30, cy - 2, cx + 38, cy - 6, 0.9);
 drawBond(ctx, cx + 58, cy - 2, cx + 64, cy + 4, 0.9);
 drawLabel(ctx, "liquid H₂O", cx + 48, cy + 36, { h: 18, font: "600 10px Segoe UI" });
 drawLabel(ctx, "Truth: gases and liquids can have bonded molecules", cx, cy + 72, {
 h: 22,
 font: "600 12px Segoe UI",
 });
 }

 drawLabel(ctx, `Myth ${idx + 1} / 5`, w * 0.5, layout.labelY);
 setHitRegions([
 { id: "card", shape: "rect", x: w * 0.5, y: h * 0.42, w: w * 0.86, h: h * 0.55, meta: { action: "flip" } },
 ]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 /** Drill - prompt-aware bond identity visuals */
 arena.registerScene("bondDrill", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 const start = performance.now();
 setDescription(chemLabState.prompt || "Bond Buddies drill");

 function drillVisual(prompt) {
 const p = (prompt || "").toLowerCase();
 if (p.includes("water") || p.includes("h₂o") || p.includes("h2o")) return "water";
 if (p.includes("sand")) return "mixture";
 if (p.includes("magnet")) return "magnet";
 if (p.includes("o₂") || p.includes("o2")) return "o2";
 if (p.includes("break")) return "break";
 if (p.includes("salt") || p.includes("ion") || p.includes("na")) return "ionic";
 if (p.includes("rule") || p.includes("bond does") || p.includes("bond?")) return "rule";
 return "link";
 }

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const t = (performance.now() - start) / 1000;
 drawBackdrop();
 ctx.fillStyle = "rgba(167,139,250,0.22)";
 ctx.fillRect(0, 0, w, h * 0.18);
 drawLabel(ctx, chemLabState.prompt || "Speed drill!", w * 0.5, h * 0.1, { h: 28, font: "700 16px Segoe UI" });
 const kind = drillVisual(chemLabState.prompt);
 const cx = w * 0.5;
 const cy = h * 0.42;

 if (kind === "water") {
 drawAtom(ctx, cx - 28, cy, 12, 0xf87171, t, "H");
 drawAtom(ctx, cx + 6, cy - 10, 14, 0x38bdf8, t, "O");
 drawAtom(ctx, cx + 36, cy + 12, 12, 0xf87171, t, "H");
 drawBond(ctx, cx - 16, cy - 4, cx - 2, cy - 8, 0.9);
 drawBond(ctx, cx + 18, cy - 4, cx + 28, cy + 6, 0.9);
 drawLabel(ctx, "H₂O · bonded molecule", cx, layout.labelY);
 } else if (kind === "mixture") {
 ctx.fillStyle = "#fbbf24";
 for (let i = 0; i < 5; i++) {
 roundRect(ctx, cx - 70 + i * 18, cy + 10, 12, 10, 2);
 ctx.fill();
 }
 ctx.fillStyle = "rgba(96,165,250,0.5)";
 roundRect(ctx, cx - 50, cy - 30, 100, 40, 8);
 ctx.fill();
 drawLabel(ctx, "Sand in water · mixture (no new bond)", cx, layout.labelY);
 } else if (kind === "magnet") {
 drawMagnet(ctx, cx - 40, cy, "N", 0.9);
 drawMagnet(ctx, cx + 40, cy, "S", 0.9);
 drawLabel(ctx, "Magnet snap · attraction analogy", cx, layout.labelY);
 } else if (kind === "o2") {
 drawAtom(ctx, cx - 22, cy, 14, 0x38bdf8, t, "O");
 drawAtom(ctx, cx + 22, cy, 14, 0x38bdf8, t, "O");
 drawBond(ctx, cx - 8, cy - 4, cx + 8, cy - 4, 1);
 drawBond(ctx, cx - 8, cy + 4, cx + 8, cy + 4, 1);
 drawLabel(ctx, "O₂ · two oxygen atoms bonded", cx, layout.labelY);
 } else if (kind === "break") {
 drawAtom(ctx, cx - 40, cy, 13, 0xa78bfa, t, "A");
 drawAtom(ctx, cx + 40, cy, 13, 0xf472b6, t, "B");
 ctx.setLineDash([5, 5]);
 drawBond(ctx, cx - 26, cy, cx + 26, cy, 0.4);
 ctx.setLineDash([]);
 drawLabel(ctx, "Break bond · rearrange, same atom kinds", cx, layout.labelY);
 } else if (kind === "ionic") {
 drawAtom(ctx, cx - 30, cy, 14, 0x38bdf8, t, "+");
 drawAtom(ctx, cx + 30, cy, 14, 0xf472b6, t, "−");
 drawBond(ctx, cx - 14, cy, cx + 14, cy, 1);
 drawLabel(ctx, "Na⁺ / Cl⁻ · ionic-style attraction", cx, layout.labelY);
 } else if (kind === "rule") {
 ctx.fillStyle = "rgba(167,139,250,0.25)";
 roundRect(ctx, cx - 90, cy - 28, 180, 56, 12);
 ctx.fill();
 ctx.fillStyle = "#f5f3ff";
 ctx.font = "800 18px Segoe UI,sans-serif";
 ctx.textAlign = "center";
 ctx.fillText("BONDS = links", cx, cy + 6);
 drawLabel(ctx, "Hold atoms together as buddies", cx, layout.labelY);
 } else {
 drawAtom(ctx, cx - 28, cy, 14, 0xa78bfa, t, "A");
 drawAtom(ctx, cx + 28, cy, 14, 0xf472b6, t, "B");
 drawBond(ctx, cx - 12, cy, cx + 12, cy, 1);
 drawLabel(ctx, "Bond · lasting link between atoms", cx, layout.labelY);
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 /** Mastery - path + bond showcase */
 arena.registerScene("bondMastery", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 const start = performance.now();
 setDescription("Bond Buddies mastery - apply the link rule.");

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const t = (performance.now() - start) / 1000;
 const locked = chemLabState.masteryStep || 0;
 drawBackdrop();
 const steps = ["Meet", "Attract", "Sort", "Snap", "Water", "Rule"];
 steps.forEach((label, i) => {
 const x = w * 0.1 + i * (w * 0.14);
 ctx.fillStyle = i < locked ? "#a78bfa" : "rgba(148,163,184,0.35)";
 roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8);
 ctx.fill();
 ctx.fillStyle = "#0f172a";
 ctx.font = "600 10px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(label, x, h * 0.78);
 });

 // Showcase trio: H2O bonded, O2 bonded, mixture without bond
 drawAtom(ctx, w * 0.22, h * 0.32, 10, 0xf87171, t, "H");
 drawAtom(ctx, w * 0.28, h * 0.28, 12, 0x38bdf8, t, "O");
 drawAtom(ctx, w * 0.34, h * 0.34, 10, 0xf87171, t, "H");
 drawBond(ctx, w * 0.23, h * 0.31, w * 0.26, h * 0.29, 0.9);
 drawBond(ctx, w * 0.3, h * 0.29, w * 0.33, h * 0.33, 0.9);
 drawLabel(ctx, "H₂O bonded", w * 0.28, h * 0.48, { h: 18, font: "600 10px Segoe UI" });

 drawAtom(ctx, w * 0.48, h * 0.3, 12, 0x38bdf8, t, "O");
 drawAtom(ctx, w * 0.58, h * 0.3, 12, 0x38bdf8, t, "O");
 drawBond(ctx, w * 0.5, h * 0.28, w * 0.56, h * 0.28, 1);
 drawBond(ctx, w * 0.5, h * 0.32, w * 0.56, h * 0.32, 1);
 drawLabel(ctx, "O₂ bonded", w * 0.53, h * 0.48, { h: 18, font: "600 10px Segoe UI" });

 drawAtom(ctx, w * 0.72, h * 0.28, 10, 0x94a3b8, t, "N");
 drawAtom(ctx, w * 0.82, h * 0.34, 10, 0xfbbf24, t, "S");
 drawLabel(ctx, "mixture · no link", w * 0.77, h * 0.48, { h: 18, font: "600 10px Segoe UI" });

 drawMagnet(ctx, layout.leftProp.x, layout.deskTop - 8, "N", 0.75);
 drawCup(ctx, layout.midProp.x, layout.deskTop, 0.5);
 drawMagnet(ctx, layout.rightProp.x, layout.deskTop - 8, "S", 0.75);

 ctx.fillStyle = "rgba(167,139,250,0.22)";
 roundRect(ctx, w * 0.28, h * 0.55, w * 0.44, 32, 10);
 ctx.fill();
 ctx.fillStyle = "#f5f3ff";
 ctx.font = "700 13px Segoe UI,sans-serif";
 ctx.textAlign = "center";
 ctx.fillText("Bond Explorer · links hold atoms together", w * 0.5, h * 0.55 + 20);
 drawLabel(ctx, "Mastery: prove the bond rule on mixed cases", w * 0.5, layout.labelY);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });
}

export const BOND_ASSET_PATHS = {
 buddies: "/games/chemistry-lab/assets/bond-buddies.svg",
 magnet: "/games/chemistry-lab/assets/magnet-snap.svg",
 water: "/games/chemistry-lab/assets/water-h2o.svg",
 rule: "/games/chemistry-lab/assets/bond-rule.svg",
 magnify: "/games/chemistry-lab/assets/bond-magnify.svg",
 sugar: "/games/chemistry-lab/assets/sugar-bonds.svg",
 plastic: "/games/chemistry-lab/assets/plastic-chain.svg",
 protein: "/games/chemistry-lab/assets/protein-fold.svg",
 orbit: "/games/chemistry-lab/assets/atom-orbit.svg",
 myth: "/games/chemistry-lab/assets/myth-bust.svg",
};
