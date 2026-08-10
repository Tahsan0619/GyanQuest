/**
 * Chemistry Lab · Mission 2: Element Hunt - Canvas 2D scenes.
 * Pure substances made of one kind of atom (Fe, Cu, O₂, …).
 */
import { chemLabState, pulseFailFeedback, pulseSuccessFeedback } from "./atom-scenes.js";
import { BOTTLE_FOOT, footAlign } from "./scene-layout.js";
import { pointOnRotatedEllipse, sortSlotPositions, getActiveSession } from "./activity-controller.js";

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
 const padX = 12;
 const bw = tw + padX * 2;
 const bh = opts.h || 26;
 ctx.fillStyle = opts.bg || "rgba(8,47,73,0.88)";
 roundRect(ctx, x - bw / 2, y - bh / 2, bw, bh, 10);
 ctx.fill();
 ctx.strokeStyle = opts.border || "rgba(34,211,238,0.45)";
 ctx.lineWidth = 1.4;
 ctx.stroke();
 ctx.fillStyle = opts.color || "#e0f2fe";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(text, x, y + 1);
}

function drawAtom(ctx, x, y, r, color, t = 0, label = "") {
 const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 1, x, y, r);
 const hex = `#${color.toString(16).padStart(6, "0")}`;
 g.addColorStop(0, "#fff");
 g.addColorStop(0.35, hex);
 g.addColorStop(1, "#0f172a");
 ctx.fillStyle = g;
 ctx.beginPath();
 ctx.arc(x, y, r, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "rgba(255,255,255,0.35)";
 ctx.lineWidth = 1.2;
 ctx.stroke();
 if (label) {
 ctx.fillStyle = "#0f172a";
 ctx.font = `700 ${Math.max(8, Math.floor(r * 0.85))}px Segoe UI,sans-serif`;
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(label, x, y + 1);
 }
 if (t) {
 ctx.strokeStyle = "rgba(125,211,252,0.25)";
 ctx.beginPath();
 ctx.ellipse(x, y, r * 1.8, r * 0.7, t * 0.4, 0, Math.PI * 2);
 ctx.stroke();
 }
}

function drawMagnifier(ctx, x, y, radius) {
 ctx.save();
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
 ctx.fillStyle = "rgba(186,230,253,0.1)";
 ctx.beginPath();
 ctx.arc(x, y, radius - 4, 0, Math.PI * 2);
 ctx.fill();
 ctx.restore();
}

/** Soft drifting atoms of one kind (Fe / Cu / O) - used in cloud phase. */
function drawKindCloud(ctx, cx, cy, kind, t, count = 14) {
 const specs = {
 iron: { color: 0x94a3b8, label: "Fe", pair: false },
 copper: { color: 0xf59e0b, label: "Cu", pair: false },
 oxygen: { color: 0x38bdf8, label: "O", pair: true },
 };
 const s = specs[kind] || specs.iron;
 for (let i = 0; i < count; i++) {
 const a = (i / count) * Math.PI * 2 + t * (0.45 + (i % 3) * 0.08);
 const rr = 12 + (i % 5) * 7 + Math.sin(t * 1.2 + i) * 2;
 const x = cx + Math.cos(a) * rr;
 const y = cy + Math.sin(a * 1.1) * rr * 0.62;
 if (s.pair) {
 const gap = 7;
 drawAtom(ctx, x - gap, y, 6, s.color, t, "O");
 drawAtom(ctx, x + gap, y, 6, s.color, t, "O");
 ctx.strokeStyle = "rgba(125,211,252,0.75)";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.moveTo(x - gap + 5, y);
 ctx.lineTo(x + gap - 5, y);
 ctx.stroke();
 } else {
 drawAtom(ctx, x, y, 7, s.color, t, s.label);
 }
 }
}

/**
 * Orbital peek inside the magnifier: nucleus + shells.
 * Orbiting dots show the element name (Fe / Cu / O), not bare e⁻ balls.
 */
function drawElementOrbital(ctx, cx, cy, kind, t, maxR) {
 const specs = {
 iron: { color: 0x94a3b8, label: "Fe", shells: [2, 8, 8], dual: false },
 copper: { color: 0xf59e0b, label: "Cu", shells: [2, 8, 8], dual: false },
 oxygen: { color: 0x38bdf8, label: "O", shells: [2, 6], dual: true },
 };
 const s = specs[kind] || specs.iron;
 const scale = Math.max(0.55, Math.min(1, (maxR || 48) / 52));

 function oneAtom(ax, ay, localScale) {
 const nucleusR = 11 * localScale;
 drawAtom(ctx, ax, ay, nucleusR, s.color, t, s.label);
 s.shells.forEach((count, oi) => {
 const show = Math.min(count, oi === 0 ? 2 : oi === 1 ? 6 : 6);
 const rx = (18 + oi * 12) * localScale;
 const ry = rx * 0.55;
 const rot = oi * 0.4 + t * 0.08;
 ctx.strokeStyle = `rgba(186,230,253,${0.35 + oi * 0.1})`;
 ctx.lineWidth = 1.5;
 ctx.beginPath();
 for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.07) {
 const p = pointOnRotatedEllipse(ax, ay, rx, ry, rot, a);
 if (a === 0) ctx.moveTo(p.x, p.y);
 else ctx.lineTo(p.x, p.y);
 }
 ctx.stroke();
 for (let i = 0; i < show; i++) {
 const ang = t * (1.15 - oi * 0.18) + (i / show) * Math.PI * 2;
 const p = pointOnRotatedEllipse(ax, ay, rx, ry, rot, ang);
 // Named element tags instead of anonymous e⁻ balls
 drawAtom(ctx, p.x, p.y, 5.5 * localScale, s.color, t, s.label);
 }
 });
 }

 if (s.dual) {
 const gap = 22 * scale;
 oneAtom(cx - gap, cy, scale * 0.78);
 oneAtom(cx + gap, cy, scale * 0.78);
 ctx.strokeStyle = "rgba(125,211,252,0.8)";
 ctx.lineWidth = 2.5;
 ctx.beginPath();
 ctx.moveTo(cx - 8, cy);
 ctx.lineTo(cx + 8, cy);
 ctx.stroke();
 drawLabel(ctx, "O₂ · one atom kind", cx, cy + maxR * 0.72, {
 h: 18,
 font: "700 10px Segoe UI",
 bg: "rgba(8,47,73,0.7)",
 });
 } else {
 oneAtom(cx, cy, scale);
 drawLabel(ctx, `${s.label} atom · orbital model`, cx, cy + maxR * 0.78, {
 h: 18,
 font: "700 10px Segoe UI",
 bg: "rgba(8,47,73,0.7)",
 });
 }
}

function bottleUnderLens(lensX, lensY, props, lensR) {
 let best = null;
 let bestD = Infinity;
 for (const id of ["iron", "copper", "oxygen"]) {
 const p = props[id];
 if (!p) continue;
 const bx = p.x;
 const by = p.y - 28;
 const d = Math.hypot(lensX - bx, lensY - by);
 if (d < bestD && d < lensR + 62) {
 bestD = d;
 best = id;
 }
 }
 return best;
}

function drawBottle(ctx, x, footY, fillColor, scale = 1, label = "") {
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
 if (label) {
 ctx.fillStyle = "#0f172a";
 ctx.font = "700 11px Segoe UI,sans-serif";
 ctx.textAlign = "center";
 ctx.fillText(label, 0, 18);
 }
 ctx.restore();
}

function drawWireCoil(ctx, x, y, stretch, t) {
 ctx.save();
 ctx.strokeStyle = "#f59e0b";
 ctx.lineWidth = 4;
 ctx.lineCap = "round";
 const len = 40 + stretch * 90;
 ctx.beginPath();
 for (let i = 0; i < 8; i++) {
 const px = x - len / 2 + (i / 7) * len;
 const py = y + Math.sin(i * 1.2 + t * 2) * (4 - stretch * 2);
 if (i === 0) ctx.moveTo(px, py);
 else ctx.lineTo(px, py);
 }
 ctx.stroke();
 for (let i = 0; i < 6; i++) {
 drawAtom(ctx, x - len / 2 + 8 + i * (len / 7), y, 5, 0xf59e0b, t);
 }
 ctx.restore();
}

function drawO2Pair(ctx, x, y, split, t) {
 const gap = 10 + split * 36;
 drawAtom(ctx, x - gap / 2, y + Math.sin(t) * 2, 9, 0x38bdf8, t);
 drawAtom(ctx, x + gap / 2, y - Math.sin(t) * 2, 9, 0x38bdf8, t);
 if (split < 0.55) {
 ctx.strokeStyle = "rgba(125,211,252,0.7)";
 ctx.lineWidth = 2.5;
 ctx.beginPath();
 ctx.moveTo(x - gap / 2 + 8, y);
 ctx.lineTo(x + gap / 2 - 8, y);
 ctx.stroke();
 }
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
 ctx.fillStyle = `rgba(52,211,153,${a})`;
 ctx.fillRect(0, 0, w, h);
}

/**
 * Register Element Hunt scenes on the shared 2D arena.
 * @param {ReturnType<import('./arena-2d.js').createArena2D>} arena
 */
export function registerElementScenes(arena) {
 if (!arena?.registerScene) return;

 /** Meet Element Hunt - shelf → magnify zoom → same-atom cloud (phase-driven like Tiny Bits) */
 arena.registerScene("elemMeet", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions, setIntentHandler } =
 api;
 const startPhase = opts.phase || chemLabState.elemPhase || chemLabState.phase || "shelf";
 chemLabState.elemPhase = startPhase;
 chemLabState.phase = startPhase;
 const start = performance.now();
 const props = {
 iron: { x: 0, y: 0, ready: false },
 copper: { x: 0, y: 0, ready: false },
 oxygen: { x: 0, y: 0, ready: false },
 };
 const lens = { x: 0, y: 0, ready: false };
 let dragBottle = null;
 const bottles = [
 { id: "iron", color: "#94a3b8", label: "Fe", name: "Iron-like", atom: 0x94a3b8 },
 { id: "copper", color: "#f59e0b", label: "Cu", name: "Copper-like", atom: 0xf59e0b },
 { id: "oxygen", color: "#38bdf8", label: "O₂", name: "Oxygen air", atom: 0x38bdf8 },
 ];
 const descs = {
 shelf: "Drag the sample bottles. Tap one to pick a hunt target.",
 zoom: "Drag the yellow magnifier over each bottle - see Fe, Cu, or O atoms.",
 cloud: "Same-label spheres = same atom kind. That is the element clue.",
 predict: "Predict: can O₂ still be an element when atoms pair up?",
 settle: "Drag bottles - connectors stay tied to the one-kind idea.",
 };
 setDescription(descs[startPhase] || descs.shelf);

 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DOWN" && intent.meta?.propId && intent.meta.propId !== "lens") {
 dragBottle = intent.meta.propId;
 }
 if (intent.type === "CANVAS_DRAG" && dragBottle && props[dragBottle]) {
 props[dragBottle].x = Math.max(40, Math.min(api.width - 40, intent.x));
 props[dragBottle].y = Math.max(50, Math.min(api.layout.deskTop + 6, intent.y));
 }
 if (intent.type === "CANVAS_TAP" && intent.meta?.pick) {
 chemLabState.elemKind = intent.meta.pick;
 chemLabState.huntFound = { ...(chemLabState.huntFound || {}), [intent.meta.pick]: true };
 pulseSuccessFeedback(280);
 }
 if (intent.type === "CANVAS_UP") dragBottle = null;
 });

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const t = (performance.now() - start) / 1000;
 const live = chemLabState.phase || chemLabState.elemPhase || startPhase;
 chemLabState.elemPhase = live;
 if (!props.iron.ready) {
 props.iron = { x: layout.leftProp.x, y: layout.deskTop, ready: true };
 props.copper = { x: layout.midProp.x, y: layout.deskTop, ready: true };
 props.oxygen = { x: layout.rightProp.x, y: layout.deskTop, ready: true };
 }
 if (!lens.ready) {
 // Start above the iron bottle so the first peek is clearly Fe
 lens.x = props.iron.x;
 lens.y = Math.max(70, layout.deskTop - 110);
 lens.ready = true;
 }
 drawBackdrop();
 const hits = [];

 if (live === "shelf") {
 for (const b of bottles) {
 const p = props[b.id];
 const found = !!chemLabState.huntFound?.[b.id];
 drawBottle(ctx, p.x, p.y, b.color, found ? 1.12 : 1.05, b.label);
 if (found) {
 ctx.strokeStyle = "rgba(34,211,238,0.85)";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.arc(p.x, p.y - 24, 38, 0, Math.PI * 2);
 ctx.stroke();
 }
 hits.push({
 id: b.id,
 shape: "box",
 x: p.x - 28,
 y: p.y - 70,
 w: 56,
 h: 90,
 meta: { propId: b.id, pick: b.id },
 onDrag(pt) {
 p.x = Math.max(40, Math.min(w - 40, pt.x));
 p.y = Math.max(50, Math.min(layout.deskTop + 6, pt.y));
 },
 });
 drawLabel(ctx, b.name, p.x, layout.deskTop + 28, { font: "600 11px Segoe UI,sans-serif", h: 20 });
 }
 drawLabel(ctx, "Element Hunt · Drag & tap bottles", w * 0.5, layout.labelY);
 } else if (live === "zoom") {
 for (const b of bottles) {
 const p = props[b.id];
 const under = bottleUnderLens(lens.x, lens.y, props, 56) === b.id;
 drawBottle(ctx, p.x, p.y, b.color, under ? 1.05 : 0.85, b.label);
 if (under) {
 ctx.strokeStyle = "rgba(251,191,36,0.9)";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.arc(p.x, p.y - 24, 36, 0, Math.PI * 2);
 ctx.stroke();
 }
 hits.push({
 id: b.id,
 shape: "box",
 x: p.x - 24,
 y: p.y - 58,
 w: 48,
 h: 78,
 meta: { propId: b.id, pick: b.id },
 });
 }

 const lensR = 58;
 const overId = bottleUnderLens(lens.x, lens.y, props, lensR);
 if (overId) chemLabState.elemKind = overId;
 const kindMeta = bottles.find((b) => b.id === (overId || chemLabState.elemKind)) || bottles[0];

 // Glass contents: orbital model of the bottle under the lens
 ctx.save();
 ctx.beginPath();
 ctx.arc(lens.x, lens.y, lensR - 5, 0, Math.PI * 2);
 ctx.clip();
 ctx.fillStyle = "rgba(8,47,73,0.9)";
 ctx.fillRect(lens.x - lensR, lens.y - lensR, lensR * 2, lensR * 2);
 if (overId) {
 drawElementOrbital(ctx, lens.x, lens.y, overId, t, lensR - 8);
 } else {
 drawLabel(ctx, "Move over a bottle", lens.x, lens.y, {
 h: 22,
 font: "600 12px Segoe UI",
 bg: "rgba(15,23,42,0.55)",
 });
 }
 ctx.restore();
 drawMagnifier(ctx, lens.x, lens.y, lensR);

 // Lens last in hit list = highest priority; onDrag moves it (Tiny Bits pattern)
 hits.push({
 id: "lens",
 shape: "ellipse",
 x: lens.x,
 y: lens.y,
 r: lensR + 18,
 meta: { propId: "lens" },
 onDrag(pt) {
 lens.x = Math.max(48, Math.min(w - 48, pt.x));
 lens.y = Math.max(48, Math.min(h - 48, pt.y));
 },
 });

 // One coach label only (no overlap)
 const peek = overId
 ? overId === "oxygen"
 ? "On O₂ · orbital O atoms (same kind)"
 : `On ${kindMeta.label} · orbital ${kindMeta.label} atoms`
 : "Drag yellow magnifier over Fe · Cu · O₂";
 drawLabel(ctx, peek, w * 0.5, layout.labelY);
 } else if (live === "predict") {
 for (const b of bottles) {
 drawBottle(ctx, props[b.id].x, props[b.id].y, b.color, 0.7, b.label);
 hits.push({
 id: b.id,
 shape: "box",
 x: props[b.id].x - 24,
 y: props[b.id].y - 60,
 w: 48,
 h: 80,
 meta: { pick: b.id, propId: b.id },
 onDrag(pt) {
 props[b.id].x = Math.max(40, Math.min(w - 40, pt.x));
 props[b.id].y = Math.max(50, Math.min(layout.deskTop + 6, pt.y));
 },
 });
 }
 const cx = w * 0.5;
 const cy = Math.min(h * 0.3, layout.deskTop - 120);
 ctx.fillStyle = "rgba(8,47,73,0.75)";
 roundRect(ctx, cx - 150, cy - 48, 300, 96, 16);
 ctx.fill();
 ctx.strokeStyle = "rgba(251,191,36,0.7)";
 ctx.lineWidth = 2;
 ctx.stroke();
 drawO2Pair(ctx, cx - 40, cy, 0.2, t);
 drawLabel(ctx, "?", cx + 50, cy, { h: 36, font: "700 22px Segoe UI", bg: "rgba(251,191,36,0.35)" });
 drawLabel(ctx, "Predict: paired O atoms - still an element?", w * 0.5, layout.labelY);
 } else if (live === "settle") {
 for (const b of bottles) {
 const p = props[b.id];
 drawBottle(ctx, p.x, p.y, b.color, 0.9, b.label);
 hits.push({
 id: b.id,
 shape: "box",
 x: p.x - 28,
 y: p.y - 70,
 w: 56,
 h: 90,
 meta: { pick: b.id, propId: b.id },
 onDrag(pt) {
 p.x = Math.max(40, Math.min(w - 40, pt.x));
 p.y = Math.max(50, Math.min(layout.deskTop + 6, pt.y));
 },
 });
 }
 const cx = w * 0.5;
 const cy = Math.min(h * 0.28, layout.deskTop - 130);
 drawKindCloud(ctx, cx, cy, chemLabState.elemKind || "iron", t, 12);
 ctx.strokeStyle = "rgba(34,211,238,0.35)";
 ctx.lineWidth = 1.5;
 ctx.setLineDash([4, 4]);
 for (const b of bottles) {
 ctx.beginPath();
 ctx.moveTo(props[b.id].x, props[b.id].y - 50);
 ctx.lineTo(cx, cy + 40);
 ctx.stroke();
 }
 ctx.setLineDash([]);
 drawLabel(ctx, "Element = only one kind of atom", w * 0.5, layout.labelY);
 } else {
 // cloud: particle model above the desk - keep labels at TOP so bottles stay clear
 for (const b of bottles) {
 drawBottle(ctx, props[b.id].x, props[b.id].y, b.color, 0.75, b.label);
 hits.push({
 id: b.id,
 shape: "box",
 x: props[b.id].x - 24,
 y: props[b.id].y - 60,
 w: 48,
 h: 80,
 meta: { pick: b.id, propId: b.id },
 });
 }
 const kind = chemLabState.elemKind || "iron";
 const kindMeta = bottles.find((b) => b.id === kind) || bottles[0];
 const cx = w * 0.5;
 // Keep cloud well above the desk / bottles
 const cy = Math.min(h * 0.28, layout.deskTop - 130);
 drawKindCloud(ctx, cx, cy, kind, t, kind === "oxygen" ? 10 : 16);
 const tip =
 kind === "oxygen"
 ? "O₂ pairs still = element oxygen · tap a bottle to switch"
 : `All ${kindMeta.label} = one atom kind · tap Fe / Cu / O₂ to switch`;
 drawLabel(ctx, tip, w * 0.5, layout.labelY);
 }

 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 /** Iron metal - drag bottle + tap lattice to pack identical Fe atoms */
 arena.registerScene("elemIron", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions, setIntentHandler, reducedMotion } =
 api;
 const assemble = opts.assemble !== false;
 const start = performance.now();
 const bottle = { x: 0, y: 0, ready: false };
 setDescription("Drag the iron bottle. Tap metal or lattice to pack more Fe atoms.");

 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "pack") {
 chemLabState.scale = Math.min(1, (chemLabState.scale || 0) + 0.12);
 pulseSuccessFeedback(220);
 }
 });

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const t = reducedMotion ? 0 : (performance.now() - start) / 1000;
 if (!bottle.ready) {
 bottle.x = layout.leftProp.x;
 bottle.y = layout.deskTop;
 bottle.ready = true;
 }
 drawBackdrop();
 drawBottle(ctx, bottle.x, bottle.y, "#94a3b8", 1.1, "Fe");
 const progress = assemble ? Math.min(1, (chemLabState.scale || 0.2) + 0.15) : 0.15;
 const cols = 5;
 const rows = 4;
 const ox = w * 0.52;
 const oy = h * 0.32;
 for (let r = 0; r < rows; r++) {
 for (let c = 0; c < cols; c++) {
 if ((r * cols + c) / (rows * cols) > progress) continue;
 const x = ox + c * 22 + (r % 2) * 11;
 const y = oy + r * 20;
 drawAtom(ctx, x, y + Math.sin(t + c) * 1.2, 7, 0x94a3b8, t);
 }
 }
 // Connector from bottle to lattice
 ctx.strokeStyle = "rgba(148,163,184,0.4)";
 ctx.lineWidth = 1.5;
 ctx.setLineDash([4, 4]);
 ctx.beginPath();
 ctx.moveTo(bottle.x + 20, bottle.y - 40);
 ctx.lineTo(ox, oy + 40);
 ctx.stroke();
 ctx.setLineDash([]);
 drawLabel(ctx, "Iron-like metal · one atom kind (Fe)", w * 0.5, layout.labelY);
 drawLabel(ctx, "Drag bottle · tap to pack", bottle.x, layout.deskTop + 30, { h: 22, font: "600 12px Segoe UI" });
 setHitRegions([
 {
 id: "bottle",
 shape: "box",
 x: bottle.x - 40,
 y: bottle.y - 80,
 w: 80,
 h: 100,
 meta: { propId: "ironBottle", action: "pack" },
 onDrag(pt) {
 bottle.x = Math.max(40, Math.min(w * 0.4, pt.x));
 bottle.y = Math.max(50, Math.min(layout.deskTop + 6, pt.y));
 if (assemble) chemLabState.scale = Math.min(1, (chemLabState.scale || 0) + 0.004);
 },
 },
 { id: "lattice", shape: "box", x: ox - 20, y: oy - 20, w: 140, h: 110, meta: { action: "pack" } },
 ]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 /** Sort element / compound / mixture - drag/drop matched to Tiny Bits atomsSort */
 arena.registerScene("elemSort", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } = api;
 setDescription("Drag cards into Element, Compound, or Mixture zones.");

 const chips = [
 { id: "fe", text: "Iron nail", short: "Fe", color: 0x94a3b8 },
 { id: "cu", text: "Copper wire", short: "Cu", color: 0xf59e0b },
 { id: "o2", text: "Oxygen gas", short: "O₂", color: 0x38bdf8 },
 { id: "h2o", text: "Water H₂O", short: "H₂O", color: 0x60a5fa },
 { id: "nacl", text: "Table salt", short: "NaCl", color: 0xe2e8f0 },
 { id: "air", text: "Room air", short: "Air", color: 0x93c5fd },
 { id: "brass", text: "Brass Cu+Zn", short: "Brass", color: 0xfbbf24 },
 { id: "he", text: "Helium", short: "He", color: 0x67e8f9 },
 ];
 const accept = {
 element: ["fe", "cu", "o2", "he"],
 compound: ["h2o", "nacl"],
 mixture: ["air", "brass"],
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
 // Keep activity session + right panel in sync (placedVersion drives mirror)
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
 for (const z of lastZones) {
 if (x >= z.x - 10 && x <= z.x + z.ww + 10 && y >= z.y - 10 && y <= z.y + z.hh + 10) return z.id;
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
 drawBackdrop();

 const zoneH = Math.max(100, Math.min(h * 0.3, 140));
 const zoneY = Math.max(layout.labelY + 30, h * 0.09);
 const zones = [
 { id: "element", label: "Element", x: w * 0.03, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#22d3ee" },
 { id: "compound", label: "Compound", x: w * 0.35, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#a78bfa" },
 { id: "mixture", label: "Mixture", x: w * 0.67, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#fbbf24" },
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

 const placed = chemLabState.placed || {};
 const byZone = {
 element: chips.filter((c) => placed[c.id] === "element").map((c) => c.id),
 compound: chips.filter((c) => placed[c.id] === "compound").map((c) => c.id),
 mixture: chips.filter((c) => placed[c.id] === "mixture").map((c) => c.id),
 };
 const bankIds = chips.filter((c) => !placed[c.id]).map((c) => c.id);
 const bankTop = zoneY + zoneH + (chemLabState.reveal ? 50 : 30);

 chips.forEach((c) => {
 let targetX;
 let targetY;
 const zoneKey = placed[c.id];
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
 const ease = reducedMotion ? 1 : 0.18;
 prev.x += (targetX - prev.x) * ease;
 prev.y += (targetY - prev.y) * ease;
 }

 const selected = chemLabState.selectedId === c.id;
 const hex = "#" + c.color.toString(16).padStart(6, "0");
 ctx.fillStyle = selected ? "rgba(52,211,153,0.4)" : "rgba(30,41,59,0.95)";
 roundRect(ctx, prev.x - 48, prev.y - 20, 96, 40, 10);
 ctx.fill();
 ctx.strokeStyle = selected ? "#34d399" : hex;
 ctx.lineWidth = selected ? 2.5 : 1.6;
 ctx.stroke();
 ctx.fillStyle = "#e0f2fe";
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

 drawLabel(ctx, "Drag chips into the three bins", w * 0.5, layout.labelY);
 if (chemLabState.reveal) {
 drawLabel(
 ctx,
 "Elements = one atom kind · Compounds bond · Mixtures mix",
 w * 0.5,
 zoneY + zoneH + 16,
 { h: 22, font: "600 11px Segoe UI", bg: "rgba(8,47,73,0.92)" },
 );
 }

 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 /** Copper wire stretch lab */
 arena.registerScene("elemCopper", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const start = performance.now();
 setDescription("Drag the amber handle to stretch the copper wire - atoms stay Cu.");

 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
 const next = Math.max(0, Math.min(1, (intent.x - api.width * 0.3) / (api.width * 0.4)));
 chemLabState.heat = next;
 chemLabState.heatTarget = next;
 chemLabState.wireStretch = next;
 }
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "nudge") {
 const next = Math.min(1, (chemLabState.heat || 0) + 0.08);
 chemLabState.heat = next;
 chemLabState.heatTarget = next;
 chemLabState.wireStretch = next;
 }
 });

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const t = (performance.now() - start) / 1000;
 const stretch = chemLabState.heat ?? chemLabState.wireStretch ?? 0;
 chemLabState.wireStretch = stretch;
 drawBackdrop();
 drawBottle(ctx, layout.leftProp.x, layout.deskTop, "#f59e0b", 1, "Cu");
 const wx = w * 0.55;
 const wy = h * 0.36;
 drawWireCoil(ctx, wx, wy, stretch, t);
 const hx = w * 0.3 + stretch * w * 0.4;
 ctx.fillStyle = "#fbbf24";
 ctx.beginPath();
 ctx.arc(hx, wy + 48, 14, 0, Math.PI * 2);
 ctx.fill();
 drawLabel(ctx, "Stretch handle", hx, wy + 72, { h: 20, font: "600 11px Segoe UI" });
 drawLabel(ctx, stretch > 0.7 ? "Still copper atoms - shape changed, not the element" : "Copper wire · pull to stretch", w * 0.5, layout.labelY);
 setHitRegions([
 { id: "handle", shape: "box", x: hx - 24, y: wy + 28, w: 48, h: 48, meta: { action: "stretch" } },
 { id: "wire", shape: "box", x: wx - 80, y: wy - 30, w: 160, h: 60, meta: { action: "nudge" } },
 ]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 /** Oxygen O2 - drag bottle + tap/drag pairs */
 arena.registerScene("elemOxygen", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } =
 api;
 const start = performance.now();
 const bottle = { x: 0, y: 0, ready: false };
 const pairs = [];
 for (let i = 0; i < 5; i++) pairs.push({ x: 0, y: 0, ready: false });
 setDescription("Drag the O₂ bottle or pairs - two oxygen atoms bonded still count as element oxygen.");

 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "split") {
 chemLabState.o2Split = Math.min(1, (chemLabState.o2Split || 0) + 0.2);
 if (chemLabState.o2Split >= 0.8) pulseSuccessFeedback(300);
 }
 });

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const t = reducedMotion ? 0 : (performance.now() - start) / 1000;
 const split = chemLabState.o2Split || 0;
 if (!bottle.ready) {
 bottle.x = layout.rightProp.x;
 bottle.y = layout.deskTop;
 bottle.ready = true;
 }
 drawBackdrop();
 drawBottle(ctx, bottle.x, bottle.y, "#38bdf8", 1.1, "O₂");
 const hits = [
 {
 id: "bottle",
 shape: "box",
 x: bottle.x - 40,
 y: bottle.y - 80,
 w: 80,
 h: 100,
 meta: { propId: "o2Bottle", action: "split" },
 onDrag(pt) {
 bottle.x = Math.max(w * 0.55, Math.min(w - 40, pt.x));
 bottle.y = Math.max(50, Math.min(layout.deskTop + 6, pt.y));
 chemLabState.o2Split = Math.min(1, (chemLabState.o2Split || 0) + 0.005);
 },
 },
 ];
 for (let i = 0; i < 5; i++) {
 if (!pairs[i].ready) {
 pairs[i].x = w * 0.25 + i * 70;
 pairs[i].y = h * 0.32;
 pairs[i].ready = true;
 }
 const px = pairs[i].x;
 const py = pairs[i].y + Math.sin(t + i) * 6;
 drawO2Pair(ctx, px, py, split, t + i);
 hits.push({
 id: "pair" + i,
 shape: "box",
 x: px - 28,
 y: py - 20,
 w: 56,
 h: 40,
 meta: { propId: "pair" + i, action: "split" },
 onDrag(pt) {
 pairs[i].x = Math.max(40, Math.min(w - 40, pt.x));
 pairs[i].y = Math.max(60, Math.min(layout.deskTop - 40, pt.y));
 chemLabState.o2Split = Math.min(1, (chemLabState.o2Split || 0) + 0.008);
 },
 });
 }
 drawLabel(
 ctx,
 split > 0.6 ? "Even as separate O atoms, it is still element oxygen" : "O₂ = element (only oxygen atoms)",
 w * 0.5,
 layout.labelY,
 );
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 /** Name the rule - identity scale (sample → one kind → ELEMENT), not Tiny Bits grain zoom */
 arena.registerScene("elemRule", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 const start = performance.now();
 setDescription("Build the element rule, then scrub sample → one atom kind → ELEMENT.");

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const t = (performance.now() - start) / 1000;
 const prog = chemLabState.tokenProgress || 0;
 const scale = chemLabState.scale || 0;
 drawBackdrop();

 // Equation-build (scale ~0): light rule tokens above the hunt bottles.
 // Identity scrub low band: desk samples only (never Tiny Bits salt-grain zoom).
 if (scale < 0.33) {
 if (scale <= 0.02 && prog > 0) {
 const tokens = ["One kind", "of atom", "makes an", "ELEMENT"];
 tokens.forEach((label, i) => {
 const x = w * 0.18 + i * (w * 0.18);
 const on = i < prog;
 ctx.fillStyle = on ? "rgba(34,211,238,0.35)" : "rgba(30,41,59,0.8)";
 roundRect(ctx, x - 48, h * 0.28 - 18, 96, 36, 10);
 ctx.fill();
 ctx.strokeStyle = on ? "#22d3ee" : "#475569";
 ctx.stroke();
 ctx.fillStyle = on ? "#ecfeff" : "#94a3b8";
 ctx.font = "700 12px Segoe UI,sans-serif";
 ctx.textAlign = "center";
 ctx.fillText(label, x, h * 0.28);
 });
 }
 drawBottle(ctx, layout.leftProp.x, layout.deskTop, "#94a3b8", 1.05, "Fe");
 drawBottle(ctx, layout.midProp.x, layout.deskTop, "#f59e0b", 1.05, "Cu");
 drawBottle(ctx, layout.rightProp.x, layout.deskTop, "#38bdf8", 1.05, "O₂");
 drawLabel(ctx, "Iron-like", layout.leftProp.x, layout.deskTop + 28, { h: 18, font: "600 11px Segoe UI" });
 drawLabel(ctx, "Copper wire", layout.midProp.x, layout.deskTop + 28, { h: 18, font: "600 11px Segoe UI" });
 drawLabel(ctx, "Oxygen air", layout.rightProp.x, layout.deskTop + 28, { h: 18, font: "600 11px Segoe UI" });
 drawLabel(
 ctx,
 scale <= 0.02 && prog > 0
 ? "Build the rule · samples on the desk"
 : "Desk samples - candidates for elements",
 w * 0.5,
 layout.labelY,
 );
 } else if (scale < 0.66) {
 // Mid: only one atom kind in the cloud (identity, not shells)
 const kind = chemLabState.elemKind || "iron";
 drawKindCloud(ctx, w * 0.5, h * 0.38, kind, t, 16);
 const name = kind === "copper" ? "Cu only" : kind === "oxygen" ? "O only (pairs ok)" : "Fe only";
 drawLabel(ctx, `One atom kind: ${name}`, w * 0.5, layout.labelY);
 drawBottle(ctx, layout.midProp.x, layout.deskTop, kind === "copper" ? "#f59e0b" : kind === "oxygen" ? "#38bdf8" : "#94a3b8", 0.85, kind === "oxygen" ? "O₂" : kind === "copper" ? "Cu" : "Fe");
 } else {
 // High: name the classification
 ctx.fillStyle = "rgba(34,211,238,0.22)";
 roundRect(ctx, w * 0.18, h * 0.28, w * 0.64, h * 0.28, 18);
 ctx.fill();
 ctx.strokeStyle = "#22d3ee";
 ctx.lineWidth = 3;
 roundRect(ctx, w * 0.18, h * 0.28, w * 0.64, h * 0.28, 18);
 ctx.stroke();
 ctx.fillStyle = "#ecfeff";
 ctx.font = "800 28px Segoe UI,sans-serif";
 ctx.textAlign = "center";
 ctx.fillText("ELEMENT", w * 0.5, h * 0.4);
 ctx.font = "600 14px Segoe UI,sans-serif";
 ctx.fillStyle = "#a5f3fc";
 ctx.fillText("matter made of only one kind of atom", w * 0.5, h * 0.48);
 const kinds = [
 { c: 0x94a3b8, n: "Fe" },
 { c: 0xf59e0b, n: "Cu" },
 { c: 0x38bdf8, n: "O" },
 ];
 kinds.forEach((k, i) => {
 drawAtom(ctx, w * 0.35 + i * 70, h * 0.68, 11, k.c, t, k.n);
 });
 drawLabel(ctx, "Name it: ELEMENT (not a mixture, not a compound)", w * 0.5, layout.labelY);
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 /** Stretch contexts - distinct everyday objects, not anonymous atom rings */
 arena.registerScene("elemStretch", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const start = performance.now();
 const modes = ["gold", "foil", "charcoal", "helium", "graphite"];
 const modeLabels = { gold: "Gold", foil: "Foil", charcoal: "Charcoal", helium: "Helium", graphite: "Graphite" };
 setDescription("Tap each everyday sample. Same rule - one atom kind - new objects.");

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
 const t = (performance.now() - start) / 1000;
 const mode = chemLabState.mode || api.opts?.mode || "gold";
 drawBackdrop();
 const hits = [];
 modes.forEach((m, i) => {
 const x = w * 0.12 + i * (w * 0.17);
 const y = layout.deskTop;
 const on = m === mode;
 ctx.fillStyle = on ? "rgba(34,211,238,0.35)" : "#1e293b";
 roundRect(ctx, x - 36, y - 36, 72, 48, 10);
 ctx.fill();
 ctx.strokeStyle = on ? "#22d3ee" : "#475569";
 ctx.lineWidth = on ? 2 : 1;
 ctx.stroke();
 ctx.fillStyle = "#e0f2fe";
 ctx.font = "600 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(modeLabels[m] || m, x, y - 8);
 hits.push({ id: m, x: x - 36, y: y - 36, w: 72, h: 48, meta: { mode: m } });
 });

 const cx = w * 0.5;
 const cy = h * 0.34;

 if (mode === "gold") {
 // Gold ring
 ctx.strokeStyle = "#fbbf24";
 ctx.lineWidth = 14;
 ctx.beginPath();
 ctx.ellipse(cx, cy, 54, 22, 0, 0, Math.PI * 2);
 ctx.stroke();
 ctx.strokeStyle = "#f59e0b";
 ctx.lineWidth = 6;
 ctx.stroke();
 for (let i = 0; i < 8; i++) {
 const a = (i / 8) * Math.PI * 2 + t * 0.4;
 drawAtom(ctx, cx + Math.cos(a) * 48, cy + Math.sin(a) * 18, 6, 0xfbbf24, t, "Au");
 }
 } else if (mode === "foil") {
 // Crinkled aluminum sheet
 ctx.fillStyle = "rgba(203,213,225,0.85)";
 ctx.beginPath();
 ctx.moveTo(cx - 90, cy - 20);
 for (let i = 0; i <= 8; i++) {
 const x = cx - 90 + i * 22.5;
 const y = cy - 20 + Math.sin(t * 2 + i) * 6 + (i % 2 ? 8 : -4);
 ctx.lineTo(x, y);
 }
 ctx.lineTo(cx + 90, cy + 36);
 ctx.lineTo(cx - 90, cy + 36);
 ctx.closePath();
 ctx.fill();
 for (let i = 0; i < 10; i++) {
 drawAtom(ctx, cx - 70 + i * 15, cy + (i % 3) * 8, 5.5, 0xcbd5e1, t, "Al");
 }
 } else if (mode === "charcoal") {
 // Charcoal lump
 ctx.fillStyle = "#1e293b";
 roundRect(ctx, cx - 50, cy - 36, 100, 72, 18);
 ctx.fill();
 ctx.fillStyle = "#334155";
 roundRect(ctx, cx - 30, cy - 20, 40, 28, 8);
 ctx.fill();
 for (let i = 0; i < 9; i++) {
 const a = (i / 9) * Math.PI * 2 + t * 0.3;
 drawAtom(ctx, cx + Math.cos(a) * 28, cy + Math.sin(a) * 20, 6, 0x64748b, t, "C");
 }
 } else if (mode === "helium") {
 // Helium balloon
 const by = cy - 10;
 ctx.fillStyle = "rgba(103,232,249,0.8)";
 ctx.beginPath();
 ctx.ellipse(cx, by, 48, 58, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "#94a3b8";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.moveTo(cx, by + 58);
 ctx.lineTo(cx, layout.deskTop - 8);
 ctx.stroke();
 for (let i = 0; i < 7; i++) {
 const a = (i / 7) * Math.PI * 2 + t;
 drawAtom(ctx, cx + Math.cos(a) * 22, by + Math.sin(a) * 26, 6, 0x67e8f9, t, "He");
 }
 } else {
 // Pencil graphite tip
 ctx.fillStyle = "#fbbf24";
 roundRect(ctx, cx - 12, cy - 70, 24, 90, 4);
 ctx.fill();
 ctx.fillStyle = "#1e293b";
 ctx.beginPath();
 ctx.moveTo(cx - 14, cy + 20);
 ctx.lineTo(cx + 14, cy + 20);
 ctx.lineTo(cx, cy + 48);
 ctx.closePath();
 ctx.fill();
 for (let row = 0; row < 3; row++) {
 for (let i = 0; i < 5; i++) {
 drawAtom(ctx, cx - 28 + i * 14, cy - 40 + row * 14, 5, 0x475569, t, "C");
 }
 }
 }

 const captions = {
 gold: "Gold ring · only Au atoms → element",
 foil: "Aluminum foil · only Al atoms → element",
 charcoal: "Charcoal · carbon atoms (C) → element",
 helium: "Helium balloon · He atoms → element",
 graphite: "Pencil tip · carbon layers (still C) → element",
 };
 drawLabel(ctx, captions[mode] || "Stretch context", w * 0.5, layout.labelY);
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 /** Myths - claim vs truth with element / compound / mixture diagrams */
 arena.registerScene("elemMyth", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 const start = performance.now();
 setDescription("Bust the myth - canvas shows element vs compound vs mixture.");

 const myths = [
 { claim: "Water is an element", truth: "H₂O is a compound - two atom kinds", kind: "water" },
 { claim: "Air is an element", truth: "Air is a mixture of many gases", kind: "air" },
 { claim: "Salt is an element", truth: "NaCl is a compound of two ions", kind: "salt" },
 { claim: "Rust is pure iron", truth: "Rust is a compound (iron + oxygen)", kind: "rust" },
 { claim: "O₂ is not an element", truth: "O₂ is still element oxygen (one kind)", kind: "o2" },
 ];

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const t = (performance.now() - start) / 1000;
 const idx = chemLabState.myth ?? 0;
 const phase = chemLabState.mythPhase || "claim";
 const m = myths[idx] || myths[0];
 drawBackdrop();
 ctx.fillStyle = phase === "truth" ? "rgba(52,211,153,0.18)" : "rgba(248,113,113,0.16)";
 roundRect(ctx, w * 0.1, h * 0.12, w * 0.8, 44, 12);
 ctx.fill();
 drawLabel(ctx, phase === "truth" ? m.truth : `Myth: ${m.claim}`, w * 0.5, h * 0.14 + 12, {
 h: 28,
 font: "700 14px Segoe UI",
 });

 const cx = w * 0.5;
 const cy = h * 0.42;
 if (phase === "claim") {
 // Vague "single blob" misconception visual
 ctx.fillStyle = "rgba(248,113,113,0.25)";
 ctx.beginPath();
 ctx.arc(cx, cy, 50, 0, Math.PI * 2);
 ctx.fill();
 drawLabel(ctx, "Claim: one simple stuff?", cx, cy + 70, { h: 22, font: "600 12px Segoe UI" });
 } else if (m.kind === "water") {
 drawAtom(ctx, cx - 28, cy, 14, 0xf87171, t, "H");
 drawAtom(ctx, cx + 8, cy - 10, 16, 0x38bdf8, t, "O");
 drawAtom(ctx, cx + 36, cy + 12, 14, 0xf87171, t, "H");
 ctx.strokeStyle = "rgba(226,232,240,0.7)";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.moveTo(cx - 16, cy - 4);
 ctx.lineTo(cx - 2, cy - 8);
 ctx.moveTo(cx + 20, cy - 4);
 ctx.lineTo(cx + 28, cy + 6);
 ctx.stroke();
 drawLabel(ctx, "Compound: two atom kinds bonded", cx, cy + 70, { h: 22, font: "600 12px Segoe UI" });
 } else if (m.kind === "air") {
 const specs = [
 { n: "N₂", c: 0x94a3b8, x: -70 },
 { n: "O₂", c: 0x38bdf8, x: 0 },
 { n: "Ar", c: 0xa78bfa, x: 70 },
 ];
 specs.forEach((s) => {
 drawAtom(ctx, cx + s.x - 8, cy, 10, s.c, t, s.n.slice(0, 1));
 drawAtom(ctx, cx + s.x + 8, cy, 10, s.c, t, s.n.slice(0, 1));
 drawLabel(ctx, s.n, cx + s.x, cy + 36, { h: 18, font: "600 11px Segoe UI" });
 });
 drawLabel(ctx, "Mixture: several gases side by side", cx, cy + 70, { h: 22, font: "600 12px Segoe UI" });
 } else if (m.kind === "salt") {
 for (let i = 0; i < 4; i++) {
 for (let j = 0; j < 3; j++) {
 const even = (i + j) % 2 === 0;
 drawAtom(ctx, cx - 45 + i * 30, cy - 20 + j * 28, 10, even ? 0xf87171 : 0x38bdf8, t, even ? "Na" : "Cl");
 }
 }
 drawLabel(ctx, "Compound: Na⁺ and Cl⁻ bonded", cx, cy + 70, { h: 22, font: "600 12px Segoe UI" });
 } else if (m.kind === "rust") {
 drawAtom(ctx, cx - 24, cy, 14, 0x94a3b8, t, "Fe");
 drawAtom(ctx, cx + 18, cy - 12, 12, 0x38bdf8, t, "O");
 drawAtom(ctx, cx + 28, cy + 16, 12, 0x38bdf8, t, "O");
 ctx.strokeStyle = "rgba(251,146,60,0.8)";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.moveTo(cx - 12, cy - 4);
 ctx.lineTo(cx + 8, cy - 8);
 ctx.moveTo(cx - 10, cy + 6);
 ctx.lineTo(cx + 16, cy + 12);
 ctx.stroke();
 drawLabel(ctx, "Compound: iron + oxygen (not pure Fe)", cx, cy + 70, { h: 22, font: "600 12px Segoe UI" });
 } else {
 drawO2Pair(ctx, cx - 40, cy, 0.1, t);
 drawO2Pair(ctx, cx + 40, cy, 0.1, t + 1);
 drawLabel(ctx, "Still element oxygen - only O atoms", cx, cy + 70, { h: 22, font: "600 12px Segoe UI" });
 }

 drawLabel(ctx, `Myth ${idx + 1} / 5`, w * 0.5, layout.labelY);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 /** Drill flash - show the sample identity the prompt is asking about */
 arena.registerScene("elemDrill", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 const start = performance.now();
 setDescription(chemLabState.prompt || "Element Hunt drill");

 function drillVisual(prompt) {
 const p = (prompt || "").toLowerCase();
 if (p.includes("iron")) return { label: "Fe", color: 0x94a3b8, tag: "Iron nail", kind: "element" };
 if (p.includes("water")) return { label: "H₂O", color: 0x60a5fa, tag: "Water", kind: "compound" };
 if (p.includes("o₂") || p.includes("o2")) return { label: "O₂", color: 0x38bdf8, tag: "Oxygen gas", kind: "element" };
 if (p.includes("air")) return { label: "Air", color: 0x93c5fd, tag: "Room air", kind: "mixture" };
 if (p.includes("copper")) return { label: "Cu", color: 0xf59e0b, tag: "Copper wire", kind: "element" };
 if (p.includes("brass")) return { label: "Cu+Zn", color: 0xfbbf24, tag: "Brass alloy", kind: "mixture" };
 if (p.includes("helium")) return { label: "He", color: 0x67e8f9, tag: "Helium", kind: "element" };
 if (p.includes("definition")) return { label: "1 kind", color: 0x22d3ee, tag: "Element rule", kind: "rule" };
 return { label: "?", color: 0x22d3ee, tag: "Classify", kind: "rule" };
 }

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const t = (performance.now() - start) / 1000;
 drawBackdrop();
 const flash = chemLabState.flashColor || 0x22d3ee;
 ctx.fillStyle = `#${flash.toString(16).padStart(6, "0")}33`;
 ctx.fillRect(0, 0, w, h * 0.18);
 drawLabel(ctx, chemLabState.prompt || "Speed drill!", w * 0.5, h * 0.1, { h: 28, font: "700 16px Segoe UI" });
 const vis = drillVisual(chemLabState.prompt);
 const cx = w * 0.5;
 const cy = h * 0.42;
 if (vis.kind === "element") {
 for (let i = 0; i < 7; i++) {
 const a = (i / 7) * Math.PI * 2 + t;
 drawAtom(ctx, cx + Math.cos(a) * 36, cy + Math.sin(a) * 26, 10, vis.color, t, vis.label.slice(0, 2));
 }
 } else if (vis.kind === "compound") {
 drawAtom(ctx, cx - 22, cy, 12, 0xf87171, t, "H");
 drawAtom(ctx, cx + 6, cy - 8, 14, 0x38bdf8, t, "O");
 drawAtom(ctx, cx + 28, cy + 10, 12, 0xf87171, t, "H");
 } else if (vis.kind === "mixture") {
 drawAtom(ctx, cx - 40, cy, 11, 0x94a3b8, t, "N");
 drawAtom(ctx, cx, cy - 16, 11, 0x38bdf8, t, "O");
 drawAtom(ctx, cx + 40, cy + 8, 11, 0xfbbf24, t, "Zn");
 } else {
 ctx.fillStyle = "rgba(34,211,238,0.25)";
 roundRect(ctx, cx - 70, cy - 28, 140, 56, 12);
 ctx.fill();
 ctx.fillStyle = "#ecfeff";
 ctx.font = "800 22px Segoe UI,sans-serif";
 ctx.textAlign = "center";
 ctx.fillText("1 atom kind", cx, cy + 6);
 }
 drawLabel(ctx, `${vis.tag} · pick Element / Compound / Mixture`, w * 0.5, layout.labelY);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 /** Mastery - path + identity showcase */
 arena.registerScene("elemMastery", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 const start = performance.now();
 setDescription("Element Hunt mastery - apply the one-kind rule.");

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const t = (performance.now() - start) / 1000;
 const locked = chemLabState.masteryStep || 0;
 drawBackdrop();
 const steps = ["Meet", "Iron", "Sort", "Copper", "Oxygen", "Rule"];
 steps.forEach((label, i) => {
 const x = w * 0.1 + i * (w * 0.14);
 ctx.fillStyle = i < locked ? "#22d3ee" : "rgba(148,163,184,0.35)";
 roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8);
 ctx.fill();
 ctx.fillStyle = "#0f172a";
 ctx.font = "600 10px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(label, x, h * 0.78);
 });
 // Showcase: element samples vs crossed-out compound
 drawBottle(ctx, layout.leftProp.x, layout.deskTop, "#94a3b8", 0.95, "Fe");
 drawBottle(ctx, layout.midProp.x, layout.deskTop, "#f59e0b", 0.95, "Cu");
 drawBottle(ctx, layout.rightProp.x, layout.deskTop, "#38bdf8", 0.95, "O₂");
 drawKindCloud(ctx, w * 0.5, h * 0.32, "iron", t, 10);
 ctx.fillStyle = "rgba(34,211,238,0.2)";
 roundRect(ctx, w * 0.32, h * 0.52, w * 0.36, 36, 10);
 ctx.fill();
 ctx.fillStyle = "#ecfeff";
 ctx.font = "700 14px Segoe UI,sans-serif";
 ctx.textAlign = "center";
 ctx.fillText("Element Scout · one atom kind", w * 0.5, h * 0.52 + 22);
 drawLabel(ctx, "Mastery: prove the element rule on mixed cases", w * 0.5, layout.labelY);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });
}

export const ELEM_ASSET_PATHS = {
 hunt: "/games/chemistry-lab/assets/element-hunt.svg",
 iron: "/games/chemistry-lab/assets/iron-lattice.svg",
 copper: "/games/chemistry-lab/assets/copper-wire.svg",
 oxygen: "/games/chemistry-lab/assets/oxygen-pair.svg",
 rule: "/games/chemistry-lab/assets/element-rule.svg",
 orbit: "/games/chemistry-lab/assets/atom-orbit.svg",
 myth: "/games/chemistry-lab/assets/myth-bust.svg",
};
