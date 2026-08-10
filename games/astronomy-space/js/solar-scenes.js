/**
 * Solar Family - Canvas 2D scenes (uniqueness + completion pass).
 */

import { labState, pulseFailFeedback, pulseSuccessFeedback } from "./lab-state.js";
import { sortSlotPositions, getActiveSession } from "./activity-controller.js";

function roundRect(ctx, x, y, w, h, r) {
 const rr = Math.min(r, w / 2, h / 2);
 ctx.beginPath();
 ctx.moveTo(x + rr, y);
 ctx.arcTo(x + w, y, x + w, y + h, rr);
 ctx.arcTo(x + w, y + h, x, y + h, rr);
 ctx.arcTo(x + w, y, x, y, rr);
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
 ctx.strokeStyle = opts.border || "#818cf8";
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
 ctx.fillStyle = `rgba(74,222,128,${Math.max(0, (until - performance.now()) / 380) * 0.22})`;
 ctx.fillRect(0, 0, w, h);
}

/** Meet / generic family map. heat spins planets; phase controls labels & highlight. */
function drawHero(ctx, w, h, heat, phase, opts = {}) {
 const cx = w * 0.5;
 const cy = h * 0.42;
 const glow = phase === "glow" || phase === "settle" || phase === "predict";
 const blur = opts.blur ?? 0;
 const highlightEarth = phase === "predict" || opts.highlightEarth;

 if (blur > 0.05) {
 ctx.save();
 ctx.globalAlpha = 0.35 + blur * 0.4;
 ctx.fillStyle = "rgba(148,163,184,0.25)";
 ctx.beginPath();
 ctx.ellipse(cx, cy, 110 + blur * 40, 78 + blur * 20, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.restore();
 }

 const sr = 28 + (opts.sunBoost || 0) * 10;
 ctx.fillStyle = glow ? "#fde68a" : "#facc15";
 ctx.beginPath();
 ctx.arc(cx, cy, sr, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "rgba(250,204,21,0.5)";
 ctx.lineWidth = 2;
 for (let i = 0; i < 8; i++) {
 const a = (i / 8) * Math.PI * 2 + heat;
 ctx.beginPath();
 ctx.moveTo(cx + Math.cos(a) * (sr + 4), cy + Math.sin(a) * (sr + 4));
 ctx.lineTo(cx + Math.cos(a) * (sr + 14), cy + Math.sin(a) * (sr + 14));
 ctx.stroke();
 }
 ctx.fillStyle = "#78350f";
 ctx.font = "700 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("Sun", cx, cy + 4);

 const orbitScale = opts.orbitScale ?? 1;
 const orbits = [
 { r: (55 + heat * 8) * orbitScale, col: "#94a3b8", name: "Merc", ang: 0.2, rad: 6 },
 { r: (78 + heat * 10) * orbitScale, col: "#38bdf8", name: "Earth", ang: 1.2, rad: 7 },
 { r: (105 + heat * 12) * orbitScale, col: "#fbbf24", name: "Jup", ang: 2.4, rad: 9 },
 ];
 orbits.forEach((o, idx) => {
 ctx.strokeStyle = blur > 0.45 ? `rgba(129,140,248,${0.12})` : "rgba(129,140,248,0.45)";
 ctx.lineWidth = blur > 0.45 ? 1 : 1.8;
 ctx.setLineDash(blur > 0.55 ? [4, 6] : []);
 ctx.beginPath();
 ctx.arc(cx, cy, o.r, 0, Math.PI * 2);
 ctx.stroke();
 ctx.setLineDash([]);
 const spin = heat * (opts.spinBoost || 2);
 const px = cx + Math.cos(o.ang + spin) * o.r;
 const py = cy + Math.sin(o.ang + spin) * o.r;
 if (highlightEarth && idx === 1) {
 ctx.strokeStyle = "#f472b6";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.arc(px, py, o.rad + 6, 0, Math.PI * 2);
 ctx.stroke();
 }
 ctx.fillStyle = o.col;
 ctx.beginPath();
 ctx.arc(px, py, o.rad, 0, Math.PI * 2);
 ctx.fill();
 if (glow && blur < 0.5) {
 ctx.fillStyle = "#e2e8f0";
 ctx.font = "600 10px Segoe UI";
 ctx.fillText(o.name, px, py - 12);
 }
 });
 return { cx, cy, sr };
}

function drawYearBadge(ctx, w, h, heat) {
 const yearMs = Math.max(0.35, 1.35 - heat);
 const lap = ((performance.now() / 1000) / yearMs) % 1;
 drawLabel(
 ctx,
 `Year lap model: ${Math.round(lap * 100)}% · path ${heat > 0.7 ? "close" : heat > 0.4 ? "mid" : "far"}`,
 w * 0.5,
 h * 0.88,
 { h: 28, font: "700 12px Segoe UI", border: "#38bdf8" },
 );
}

function drawStretchContext(ctx, w, h, mode) {
 const deskY = h * 0.62;
 if (mode === "home") {
 // Rooftop + night sky peep
 ctx.fillStyle = "#1e293b";
 roundRect(ctx, w * 0.12, deskY, w * 0.34, 48, 8);
 ctx.fill();
 ctx.fillStyle = "#334155";
 ctx.fillRect(w * 0.18, deskY - 28, w * 0.22, 28);
 ctx.fillStyle = "#fbbf24";
 ctx.beginPath();
 ctx.arc(w * 0.72, h * 0.28, 6, 0, Math.PI * 2);
 ctx.fill();
 drawLabel(ctx, "bright planet?", w * 0.72, h * 0.22, { h: 22, font: "600 11px Segoe UI" });
 } else if (mode === "school") {
 // Globe
 ctx.fillStyle = "#0ea5e9";
 ctx.beginPath();
 ctx.arc(w * 0.22, deskY + 10, 28, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "#166534";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.arc(w * 0.22, deskY + 10, 18, -0.4, 1.2);
 ctx.stroke();
 ctx.fillStyle = "#78716c";
 ctx.fillRect(w * 0.2, deskY + 38, 16, 14);
 drawLabel(ctx, "Earth globe", w * 0.22, deskY - 28, { h: 22, font: "600 11px Segoe UI" });
 } else if (mode === "street") {
 ctx.fillStyle = "#fbbf24";
 for (let i = 0; i < 4; i++) {
 const x = w * 0.15 + i * w * 0.12;
 ctx.fillRect(x, deskY - 20, 6, 40);
 ctx.beginPath();
 ctx.arc(x + 3, deskY - 26, 8, 0, Math.PI * 2);
 ctx.fill();
 }
 drawLabel(ctx, "city lights", w * 0.35, deskY - 48, { h: 22, font: "600 11px Segoe UI" });
 } else if (mode === "bd") {
 ctx.fillStyle = "#006a4e";
 roundRect(ctx, w * 0.12, deskY - 8, 56, 36, 6);
 ctx.fill();
 ctx.fillStyle = "#f42a41";
 ctx.beginPath();
 ctx.arc(w * 0.12 + 30, deskY + 10, 10, 0, Math.PI * 2);
 ctx.fill();
 drawLabel(ctx, "Dhaka evening", w * 0.22, deskY - 36, { h: 22, font: "600 11px Segoe UI" });
 } else if (mode === "lab") {
 // Lamp + ball
 ctx.fillStyle = "#fde68a";
 ctx.beginPath();
 ctx.arc(w * 0.2, deskY, 16, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#64748b";
 ctx.fillRect(w * 0.195, deskY + 16, 10, 22);
 ctx.fillStyle = "#38bdf8";
 ctx.beginPath();
 ctx.arc(w * 0.38, deskY + 8, 10, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "rgba(129,140,248,0.5)";
 ctx.beginPath();
 ctx.ellipse(w * 0.2, deskY, 70, 28, 0, 0, Math.PI * 2);
 ctx.stroke();
 drawLabel(ctx, "lamp = Sun", w * 0.28, deskY - 40, { h: 22, font: "600 11px Segoe UI" });
 }
}

function drawMythDiagram(ctx, w, h, idx, phase) {
 const cx = w * 0.5;
 const cy = h * 0.62;
 const truth = phase === "truth";
 if (idx === 0) {
 // Sun vs Earth who orbits whom
 ctx.fillStyle = truth ? "#facc15" : "#38bdf8";
 ctx.beginPath();
 ctx.arc(cx, cy, truth ? 22 : 14, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = truth ? "#38bdf8" : "#facc15";
 const ox = cx + (truth ? 55 : 48);
 ctx.beginPath();
 ctx.arc(ox, cy, truth ? 10 : 18, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "#e2e8f0";
 ctx.setLineDash([4, 4]);
 ctx.beginPath();
 ctx.arc(cx, cy, truth ? 55 : 48, 0, Math.PI * 2);
 ctx.stroke();
 ctx.setLineDash([]);
 drawLabel(ctx, truth ? "Earth orbits Sun" : "Myth: Sun around Earth", cx, cy - 48, {
 h: 24,
 font: "700 12px Segoe UI",
 border: truth ? "#4ade80" : "#f87171",
 });
 } else if (idx === 1) {
 // Size compare Mercury vs Jupiter
 ctx.fillStyle = "#94a3b8";
 ctx.beginPath();
 ctx.arc(cx - 50, cy, truth ? 8 : 18, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#fbbf24";
 ctx.beginPath();
 ctx.arc(cx + 40, cy, truth ? 28 : 18, 0, Math.PI * 2);
 ctx.fill();
 drawLabel(ctx, truth ? "Merc small · Jup huge" : "Myth: same size", cx, cy - 48, {
 h: 24,
 font: "700 12px Segoe UI",
 border: truth ? "#4ade80" : "#f87171",
 });
 } else if (idx === 2) {
 // Moon around Earth, Earth around Sun
 ctx.fillStyle = "#facc15";
 ctx.beginPath();
 ctx.arc(cx - 40, cy, 16, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#38bdf8";
 ctx.beginPath();
 ctx.arc(cx + 30, cy, 12, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#e2e8f0";
 ctx.beginPath();
 ctx.arc(cx + 48, cy - 14, 5, 0, Math.PI * 2);
 ctx.fill();
 if (truth) {
 ctx.strokeStyle = "rgba(226,232,240,0.6)";
 ctx.beginPath();
 ctx.arc(cx + 30, cy, 22, 0, Math.PI * 2);
 ctx.stroke();
 }
 drawLabel(ctx, truth ? "Moon orbits Earth" : "Myth: Moon = planet", cx, cy - 48, {
 h: 24,
 font: "700 12px Segoe UI",
 border: truth ? "#4ade80" : "#f87171",
 });
 } else if (idx === 3) {
 // Star glow vs planet reflect
 ctx.fillStyle = "#fde68a";
 ctx.beginPath();
 ctx.arc(cx - 45, cy, 18, 0, Math.PI * 2);
 ctx.fill();
 for (let i = 0; i < 6; i++) {
 const a = (i / 6) * Math.PI * 2;
 ctx.strokeStyle = "#fbbf24";
 ctx.beginPath();
 ctx.moveTo(cx - 45 + Math.cos(a) * 20, cy + Math.sin(a) * 20);
 ctx.lineTo(cx - 45 + Math.cos(a) * 30, cy + Math.sin(a) * 30);
 ctx.stroke();
 }
 ctx.fillStyle = "#38bdf8";
 ctx.beginPath();
 ctx.arc(cx + 40, cy, 12, 0, Math.PI * 2);
 ctx.fill();
 if (truth) {
 ctx.strokeStyle = "rgba(253,230,138,0.7)";
 ctx.beginPath();
 ctx.moveTo(cx - 24, cy);
 ctx.lineTo(cx + 26, cy);
 ctx.stroke();
 }
 drawLabel(ctx, truth ? "Star shines · planet reflects" : "Myth: same object", cx, cy - 48, {
 h: 24,
 font: "700 12px Segoe UI",
 border: truth ? "#4ade80" : "#f87171",
 });
 } else {
 // Kid + orbit book
 ctx.fillStyle = "#818cf8";
 roundRect(ctx, cx - 40, cy - 20, 80, 50, 10);
 ctx.fill();
 ctx.fillStyle = "#0f172a";
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(truth ? "I can learn!" : "???", cx, cy + 6);
 drawLabel(ctx, truth ? "Kids can learn orbits" : "Myth: only scientists", cx, cy - 48, {
 h: 24,
 font: "700 12px Segoe UI",
 border: truth ? "#4ade80" : "#f87171",
 });
 }
}

function drawDrillVisual(ctx, w, h, prompt) {
 const p = (prompt || "").toLowerCase();
 const cx = w * 0.5;
 const cy = h * 0.48;
 if (p.includes("sun")) {
 ctx.fillStyle = "#facc15";
 ctx.beginPath();
 ctx.arc(cx, cy, 28, 0, Math.PI * 2);
 ctx.fill();
 drawLabel(ctx, "STAR", cx, cy + 48, { border: "#facc15" });
 } else if (p.includes("moon")) {
 ctx.fillStyle = "#38bdf8";
 ctx.beginPath();
 ctx.arc(cx - 20, cy, 18, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#e2e8f0";
 ctx.beginPath();
 ctx.arc(cx + 18, cy - 10, 8, 0, Math.PI * 2);
 ctx.fill();
 drawLabel(ctx, "moon ≠ planet", cx, cy + 48);
 } else if (p.includes("jupiter") || p.includes("jup")) {
 ctx.fillStyle = "#fbbf24";
 ctx.beginPath();
 ctx.arc(cx, cy, 26, 0, Math.PI * 2);
 ctx.fill();
 drawLabel(ctx, "gas giant planet", cx, cy + 48, { border: "#fbbf24" });
 } else if (p.includes("not") || p.includes("car")) {
 ctx.fillStyle = "#78716c";
 roundRect(ctx, cx - 30, cy - 12, 60, 28, 6);
 ctx.fill();
 drawLabel(ctx, "not space", cx, cy + 40);
 } else if (p.includes("closer") || p.includes("path")) {
 drawHero(ctx, w, h, 0.85, "glow", { orbitScale: 0.65, spinBoost: 3.2 });
 } else if (p.includes("comet")) {
 ctx.fillStyle = "#a78bfa";
 ctx.beginPath();
 ctx.arc(cx + 20, cy, 8, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "#c4b5fd";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.moveTo(cx + 12, cy);
 ctx.lineTo(cx - 40, cy + 8);
 ctx.stroke();
 drawLabel(ctx, "visitor / other", cx, cy + 48, { border: "#a78bfa" });
 } else if (p.includes("year") || p.includes("earth")) {
 drawHero(ctx, w, h, 0.55, "settle", { highlightEarth: true });
 } else {
 drawHero(ctx, w, h, 0.65, "settle");
 }
}

export function registerSolarScenes(arena) {
 if (!arena?.registerScene) return;
 const P = "solar";

 arena.registerScene(P + "Meet", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts } = api;
 labState.phase = opts.phase || labState.phase || "desk";
 setDescription("Solar Family - meet");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const live = labState.phase || "desk";
 drawBackdrop();
 drawHero(ctx, w, h, labState.heat || 0.35, live, {
 highlightEarth: live === "predict",
 });
 const tips = {
 desk: "See the Sun and planets on the desk.",
 glow: "Planets circle the Sun on paths called orbits.",
 predict: "Predict: who orbits whom?",
 settle: "Our solar family: Sun + planets (Earth included).",
 };
 drawLabel(ctx, tips[live] || tips.desk, w * 0.5, layout.labelY);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene(P + "Sort", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } = api;
 setDescription("Sort into the right bins");
 const chips = [
 { id: "merc", short: "Mercury", color: 0x94a3b8 },
 { id: "earth", short: "Earth", color: 0x38bdf8 },
 { id: "jup", short: "Jupiter", color: 0xfbbf24 },
 { id: "sun", short: "Sun", color: 0xfacc15 },
 { id: "moon", short: "Moon", color: 0xe2e8f0 },
 { id: "car", short: "Car", color: 0x78716c },
 { id: "ball", short: "Ball", color: 0x64748b },
 { id: "comet", short: "Comet", color: 0xa78bfa },
 ];
 const accept = {
 planet: ["merc", "earth", "jup"],
 star: ["sun"],
 other: ["moon", "comet"],
 not: ["car", "ball"],
 };
 const cardPos = {};
 chips.forEach((c) => (cardPos[c.id] = { x: 0, y: 0 }));
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
 for (const z of lastZones) if (x >= z.x && x <= z.x + z.ww && y >= z.y && y <= z.y + z.hh) return z.id;
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
 if (intent.type === "CANVAS_TAP" && intent.meta?.zoneId && labState.selectedId) placeChip(labState.selectedId, intent.meta.zoneId);
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
 { id: "planet", label: "Planet", x: w * 0.02, y: zoneY, ww: w * 0.23, hh: zoneH, color: "#38bdf8" },
 { id: "star", label: "Star (Sun)", x: w * 0.26, y: zoneY, ww: w * 0.23, hh: zoneH, color: "#facc15" },
 { id: "other", label: "Moon/comet", x: w * 0.5, y: zoneY, ww: w * 0.23, hh: zoneH, color: "#a78bfa" },
 { id: "not", label: "Not space", x: w * 0.74, y: zoneY, ww: w * 0.24, hh: zoneH, color: "#94a3b8" },
 ];
 lastZones = zones;
 const hits = [];
 for (const z of zones) {
 ctx.fillStyle = "rgba(15,23,42,0.7)";
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
 const placed = labState.placed || {};
 const byZone = { planet: [], star: [], other: [], not: [] };
 chips.forEach((c) => {
 if (typeof placed[c.id] === "string" && byZone[placed[c.id]]) byZone[placed[c.id]].push(c.id);
 });
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
 targetX = w * 0.14 + (idx % 3) * (w * 0.28);
 targetY = zoneY + zoneH + 40 + Math.floor(idx / 3) * 48;
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
 ctx.fillStyle = labState.selectedId === c.id ? "rgba(56,189,248,0.35)" : "rgba(15,23,42,0.95)";
 roundRect(ctx, prev.x - 48, prev.y - 16, 96, 32, 8);
 ctx.fill();
 ctx.strokeStyle = "#" + c.color.toString(16).padStart(6, "0");
 ctx.stroke();
 ctx.fillStyle = "#e2e8f0";
 ctx.font = "700 12px Segoe UI";
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
 drawLabel(ctx, "Solar Family sort", w * 0.5, layout.labelY);
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene(P + "Lab", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, opts } = api;
 if (opts.labMode) labState.labMode = opts.labMode;
 setDescription("Drag the dial - watch the orbit idea grow");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
 labState.heat = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const heat = labState.heat ?? 0.3;
 const mode = labState.labMode || opts.labMode || "clarity";
 drawBackdrop();
 if (mode === "closer") {
 const pull = heat;
 drawHero(ctx, w, h, heat, heat > 0.65 ? "settle" : "glow", {
 orbitScale: 1.15 - pull * 0.55,
 spinBoost: 1.4 + pull * 2.4,
 sunBoost: pull * 0.4,
 });
 drawYearBadge(ctx, w, h, heat);
 const msg =
 heat > 0.75 ? "Near-Sun year - quick lap" : heat > 0.5 ? "Closer - year speeding" : "Far path - long year";
 drawLabel(ctx, msg, w * 0.5, layout.labelY, { border: "#38bdf8" });
 } else {
 const blur = Math.max(0, 1 - heat);
 drawHero(ctx, w, h, heat * 0.8, heat > 0.65 ? "settle" : heat > 0.4 ? "glow" : "desk", {
 blur,
 });
 const msg =
 heat > 0.75 ? "Family locked - sharp orbits" : heat > 0.55 ? "Orbits clear" : heat > 0.3 ? "Paths appearing" : "Orbit blurry";
 drawLabel(ctx, msg, w * 0.5, layout.labelY);
 }
 const hx = w * 0.2 + heat * w * 0.6;
 ctx.fillStyle = mode === "closer" ? "#38bdf8" : "#818cf8";
 ctx.beginPath();
 ctx.arc(hx, h * 0.72, 14, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#e2e8f0";
 ctx.font = "700 10px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(mode === "closer" ? "closer" : "clarity", hx, h * 0.72 + 28);
 setHitRegions([{ id: "h", shape: "rect", x: hx, y: h * 0.72, w: 48, h: 48, meta: { action: "stretch" } }]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene(P + "Rule", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Build the rule");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const prog = labState.tokenProgress || 0;
 const scale = labState.scale ?? 0;
 drawBackdrop();
 if (scale < 0.33) {
 drawHero(ctx, w, h, 0.35, "desk");
 drawLabel(ctx, "Desk family model", w * 0.5, layout.labelY);
 } else if (scale < 0.66) {
 drawHero(ctx, w, h, 0.55, "glow");
 drawLabel(ctx, "Clear orbit paths", w * 0.5, layout.labelY);
 } else {
 drawHero(ctx, w, h, 0.7, "settle");
 ctx.fillStyle = "rgba(74,222,128,0.22)";
 roundRect(ctx, w * 0.18, h * 0.7, w * 0.64, 44, 12);
 ctx.fill();
 ctx.strokeStyle = "#4ade80";
 ctx.lineWidth = 2;
 ctx.stroke();
 ctx.fillStyle = "#e2e8f0";
 ctx.font = "800 16px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("PLANETS ORBIT THE SUN", w * 0.5, h * 0.7 + 28);
 drawLabel(ctx, "Rule banner locked", w * 0.5, layout.labelY, { border: "#4ade80" });
 }
 ["See", "Try", "Name", "Rule"].forEach((label, i) => {
 const x = w * 0.2 + i * (w * 0.2);
 ctx.fillStyle = i < prog ? "rgba(74,222,128,0.4)" : "rgba(15,23,42,0.9)";
 roundRect(ctx, x - 40, h * 0.22 - 14, 80, 28, 8);
 ctx.fill();
 ctx.fillStyle = "#e2e8f0";
 ctx.font = "700 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(label, x, h * 0.22);
 });
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene(P + "Stretch", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, opts } = api;
 const modes = ["home", "school", "street", "bd", "lab"];
 if (opts.mode) labState.mode = opts.mode;
 setDescription("Same idea, new contexts");
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
 ctx.fillStyle = m === mode ? "rgba(56,189,248,0.4)" : "#0f172a";
 roundRect(ctx, x - 36, layout.deskTop - 36, 72, 48, 10);
 ctx.fill();
 ctx.fillStyle = "#e2e8f0";
 ctx.font = "600 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(m, x, layout.deskTop - 10);
 hits.push({ id: m, shape: "rect", x, y: layout.deskTop - 12, w: 72, h: 48, meta: { mode: m } });
 });
 drawHero(ctx, w, h * 0.85, 0.5, "glow", { orbitScale: 0.72 });
 drawStretchContext(ctx, w, h, mode);
 const tips = {
 home: "Transfer: rooftop planet peek",
 school: "Transfer: school globe = Earth",
 street: "Transfer: city lights ≠ planets",
 bd: "Transfer: Dhaka clear evening",
 lab: "Transfer: lamp-and-ball model",
 };
 drawLabel(ctx, tips[mode] || "Transfer: " + mode, w * 0.5, layout.labelY);
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene(P + "Myth", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const myths = [
 { claim: "The Sun orbits Earth", truth: "Earth and planets orbit the Sun" },
 { claim: "All planets are the same size", truth: "Sizes differ - Jupiter is huge, Mercury is small" },
 { claim: "The Moon is a planet", truth: "The Moon orbits Earth - it is a moon, not a planet" },
 { claim: "Stars and planets are the same", truth: "The Sun is a star; planets reflect its light" },
 { claim: "Only scientists can know orbits", truth: "Kids can learn: planets go around the Sun" },
 ];
 setDescription("Bust myths");
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
 ctx.fillStyle = phase === "truth" ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.18)";
 roundRect(ctx, w * 0.12, h * 0.2, w * 0.76, h * 0.22, 16);
 ctx.fill();
 drawLabel(ctx, phase === "truth" ? m.truth : "Myth: " + m.claim, w * 0.5, h * 0.31, {
 h: 42,
 font: "700 13px Segoe UI",
 maxW: w * 0.7,
 border: phase === "truth" ? "#4ade80" : "#f87171",
 });
 drawMythDiagram(ctx, w, h, idx, phase);
 drawLabel(ctx, "Myth " + (idx + 1) + " / 5 · Tap card to flip", w * 0.5, layout.labelY);
 setHitRegions([{ id: "card", shape: "rect", x: w * 0.5, y: h * 0.42, w: w * 0.76, h: h * 0.5, meta: { action: "flip" } }]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene(P + "Drill", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription(labState.prompt || "Drill");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 drawBackdrop();
 drawLabel(ctx, labState.prompt || "Solar Family drill", w * 0.5, h * 0.16, {
 h: 32,
 font: "700 16px Segoe UI",
 });
 drawDrillVisual(ctx, w, h, labState.prompt);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene(P + "Mastery", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Mastery");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const locked = labState.masteryStep || 0;
 drawBackdrop();
 drawHero(ctx, w, h, 0.85, "settle");
 ctx.fillStyle = "rgba(129,140,248,0.25)";
 roundRect(ctx, w * 0.22, h * 0.58, w * 0.56, 40, 12);
 ctx.fill();
 ctx.strokeStyle = "#818cf8";
 ctx.lineWidth = 2;
 ctx.stroke();
 ctx.fillStyle = "#e2e8f0";
 ctx.font = "800 15px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("Orbit Scout", w * 0.5, h * 0.58 + 26);
 ["Meet", "Sort", "Lab", "Rule", "Myth"].forEach((label, i) => {
 const x = w * 0.12 + i * (w * 0.17);
 ctx.fillStyle = i < locked ? "#22c55e" : "rgba(148,163,184,0.35)";
 roundRect(ctx, x - 28, h * 0.82 - 12, 56, 24, 8);
 ctx.fill();
 ctx.fillStyle = "#0f172a";
 ctx.font = "600 10px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(label, x, h * 0.82);
 });
 drawLabel(ctx, "Solar Family mastery!", w * 0.5, layout.labelY);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });
}
