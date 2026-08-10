/**
 * Force Fighter · Mission 2: Push Power - Canvas 2D (Newton 2 / F = m·a).
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
 ctx.strokeStyle = opts.border || "rgba(251,191,36,0.5)";
 ctx.lineWidth = 1.4;
 ctx.stroke();
 ctx.fillStyle = opts.color || "#fef3c7";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(text, x, y + 1);
}

function drawCrate(ctx, x, y, massLabel, color) {
 ctx.fillStyle = color;
 roundRect(ctx, x - 36, y - 28, 72, 56, 6);
 ctx.fill();
 ctx.strokeStyle = "#fef3c7";
 ctx.stroke();
 ctx.fillStyle = "#1c1917";
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(massLabel, x, y);
}

function drawCar(ctx, x, y, scale = 1, color = "#f97316") {
 ctx.save();
 ctx.translate(x, y);
 ctx.scale(scale, scale);
 ctx.fillStyle = color;
 roundRect(ctx, -40, -14, 80, 28, 8);
 ctx.fill();
 ctx.fillStyle = "#0ea5e9";
 roundRect(ctx, -18, -26, 36, 14, 4);
 ctx.fill();
 ctx.fillStyle = "#1c1917";
 ctx.beginPath();
 ctx.arc(-24, 14, 8, 0, Math.PI * 2);
 ctx.arc(24, 14, 8, 0, Math.PI * 2);
 ctx.fill();
 ctx.restore();
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
 ctx.fillStyle = `rgba(249,115,22,${Math.max(0, (until - performance.now()) / 380) * 0.25})`;
 ctx.fillRect(0, 0, w, h);
}

export function registerPushScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("pushMeet", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions, setIntentHandler, reducedMotion } =
 api;
 const startPhase = opts.phase || forceLabState.phase || "race";
 forceLabState.phase = startPhase;
 const start = performance.now();
 setDescription("Same push, different mass - light car pulls ahead.");

 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "go") {
 forceLabState.raceDone = true;
 forceLabState.heat = 1;
 pulseSuccessFeedback(300);
 }
 });

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const t = reducedMotion ? 0 : (performance.now() - start) / 1000;
 const live = forceLabState.phase || startPhase;
 const go = forceLabState.raceDone || (forceLabState.heat || 0) > 0.5;
 drawBackdrop();
 const laneY1 = h * 0.32;
 const laneY2 = h * 0.52;
 ctx.strokeStyle = "rgba(253,230,138,0.4)";
 ctx.setLineDash([10, 8]);
 ctx.beginPath();
 ctx.moveTo(w * 0.1, laneY1);
 ctx.lineTo(w * 0.9, laneY1);
 ctx.moveTo(w * 0.1, laneY2);
 ctx.lineTo(w * 0.9, laneY2);
 ctx.stroke();
 ctx.setLineDash([]);
 const carX = go ? w * 0.15 + Math.min(1, t * 0.35) * w * 0.55 : w * 0.18;
 const tankX = go ? w * 0.15 + Math.min(1, t * 0.12) * w * 0.55 : w * 0.18;
 drawCar(ctx, carX, laneY1, 0.9, "#f97316");
 drawCar(ctx, tankX, laneY2, 1.25, "#64748b");
 drawLabel(ctx, "Sports car · small m", carX, laneY1 - 36, { h: 18, font: "600 11px Segoe UI" });
 drawLabel(ctx, "Tank · big m", tankX, laneY2 - 40, { h: 18, font: "600 11px Segoe UI" });
 if (live === "predict") {
 drawLabel(ctx, "Predict: same push - which accelerates more?", w * 0.5, layout.labelY);
 } else if (live === "race") {
 drawLabel(ctx, go ? "Light mass → bigger a for same F" : "Tap GO to race same push", w * 0.5, layout.labelY);
 } else {
 drawLabel(ctx, "a = F / m · less mass, more acceleration", w * 0.5, layout.labelY);
 }
 setHitRegions([{ id: "go", shape: "rect", x: w * 0.5, y: layout.deskTop - 10, w: 100, h: 44, meta: { action: "go" } }]);
 ctx.fillStyle = "#f97316";
 roundRect(ctx, w * 0.5 - 40, layout.deskTop - 28, 80, 36, 8);
 ctx.fill();
 ctx.fillStyle = "#1c1917";
 ctx.font = "700 14px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("GO!", w * 0.5, layout.deskTop - 8);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("pushSort", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } =
 api;
 setDescription("Sort tokens into Force, Mass, or Acceleration.");
 const chips = [
 { id: "f1", text: "Push hard", short: "Push", color: 0xf97316 },
 { id: "f2", text: "Shove (N)", short: "Force", color: 0xfb923c },
 { id: "m1", text: "Heavy crate", short: "Mass", color: 0x94a3b8 },
 { id: "m2", text: "kg amount", short: "kg", color: 0xa8a29e },
 { id: "a1", text: "Speeds up", short: "a↑", color: 0x38bdf8 },
 { id: "a2", text: "m/s²", short: "m/s²", color: 0x0ea5e9 },
 { id: "f3", text: "Net force", short: "Fnet", color: 0xfbbf24 },
 { id: "a3", text: "Slows down", short: "a↓", color: 0x67e8f9 },
 ];
 const accept = {
 force: ["f1", "f2", "f3"],
 mass: ["m1", "m2"],
 accel: ["a1", "a2", "a3"],
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
 { id: "force", label: "Force F", x: w * 0.03, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#f97316" },
 { id: "mass", label: "Mass m", x: w * 0.35, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#94a3b8" },
 { id: "accel", label: "Accel a", x: w * 0.67, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#38bdf8" },
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
 force: chips.filter((c) => placed[c.id] === "force").map((c) => c.id),
 mass: chips.filter((c) => placed[c.id] === "mass").map((c) => c.id),
 accel: chips.filter((c) => placed[c.id] === "accel").map((c) => c.id),
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
 ctx.fillStyle = selected ? "rgba(249,115,22,0.4)" : "rgba(41,37,36,0.95)";
 roundRect(ctx, prev.x - 44, prev.y - 16, 88, 32, 8);
 ctx.fill();
 ctx.strokeStyle = "#" + c.color.toString(16).padStart(6, "0");
 ctx.stroke();
 ctx.fillStyle = "#fef3c7";
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(c.short, prev.x, prev.y);
 hits.push({
 id: c.id,
 shape: "rect",
 x: prev.x,
 y: prev.y,
 w: 92,
 h: 36,
 meta: { chipId: c.id },
 onDrag(pt) {
 draggingId = c.id;
 prev.x = Math.max(30, Math.min(w - 30, pt.x));
 prev.y = Math.max(30, Math.min(h - 30, pt.y));
 },
 });
 });
 drawLabel(ctx, "F · m · a - sort the words", w * 0.5, layout.labelY);
 if (forceLabState.reveal) drawLabel(ctx, "F = m · a", w * 0.5, zoneY + zoneH + 14);
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("pushCrate", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 setDescription("Drag force handle - heavier crate needs more F for the same a.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
 const next = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
 forceLabState.heat = next;
 forceLabState.pushForce = next;
 forceLabState.accel = next / Math.max(0.2, (forceLabState.massKg || 100) / 400);
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const F = forceLabState.heat ?? forceLabState.pushForce ?? 0.3;
 const m = forceLabState.massKg || 100;
 const a = (F * 2000) / m;
 forceLabState.accel = a;
 drawBackdrop();
 const cy = h * 0.4;
 drawCrate(ctx, w * 0.35, cy, `${m} kg`, m > 200 ? "#64748b" : "#f97316");
 const arrowLen = 40 + F * 100;
 ctx.strokeStyle = "#fbbf24";
 ctx.lineWidth = 5;
 ctx.beginPath();
 ctx.moveTo(w * 0.35 + 40, cy);
 ctx.lineTo(w * 0.35 + 40 + arrowLen, cy);
 ctx.stroke();
 drawLabel(ctx, `F ≈ ${Math.round(F * 2000)} N · a ≈ ${a.toFixed(1)} m/s²`, w * 0.5, cy - 60);
 const hx = w * 0.2 + F * w * 0.6;
 ctx.fillStyle = "#f97316";
 ctx.beginPath();
 ctx.arc(hx, cy + 70, 14, 0, Math.PI * 2);
 ctx.fill();
 drawLabel(ctx, F > 0.7 ? "Strong push - watch a rise" : "Slide to change push force", w * 0.5, layout.labelY);
 setHitRegions([{ id: "h", shape: "rect", x: hx, y: cy + 70, w: 48, h: 48, meta: { action: "stretch" } }]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("pushSim", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } =
 api;
 const start = performance.now();
 setDescription("Live F = m·a readout - drag handle for force.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
 forceLabState.heat = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
 forceLabState.pushForce = forceLabState.heat;
 }
 if (intent.type === "CANVAS_TAP" && intent.meta?.mass) {
 forceLabState.massKg = intent.meta.mass;
 pulseSuccessFeedback(200);
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const t = reducedMotion ? 0 : (performance.now() - start) / 1000;
 const F = (forceLabState.heat ?? 0.4) * 2000;
 const m = forceLabState.massKg || 100;
 const a = F / m;
 drawBackdrop();
 drawCar(ctx, w * 0.3 + Math.min(a, 12) * 8 * (0.5 + 0.5 * Math.sin(t)), h * 0.4, 1, "#f97316");
 drawLabel(ctx, `F = ${Math.round(F)} N`, w * 0.22, h * 0.22);
 drawLabel(ctx, `m = ${m} kg`, w * 0.5, h * 0.22);
 drawLabel(ctx, `a = ${a.toFixed(2)} m/s²`, w * 0.78, h * 0.22);
 drawLabel(ctx, "F = m · a", w * 0.5, layout.labelY, { h: 28, font: "700 16px Segoe UI" });
 const hx = w * 0.2 + (forceLabState.heat || 0.4) * w * 0.6;
 ctx.fillStyle = "#f97316";
 ctx.beginPath();
 ctx.arc(hx, h * 0.62, 14, 0, Math.PI * 2);
 ctx.fill();
 const hits = [
 { id: "h", shape: "rect", x: hx, y: h * 0.62, w: 48, h: 48, meta: { action: "stretch" } },
 { id: "m100", shape: "rect", x: w * 0.3, y: layout.deskTop - 10, w: 70, h: 40, meta: { mass: 100 } },
 { id: "m400", shape: "rect", x: w * 0.5, y: layout.deskTop - 10, w: 70, h: 40, meta: { mass: 400 } },
 { id: "m800", shape: "rect", x: w * 0.7, y: layout.deskTop - 10, w: 70, h: 40, meta: { mass: 800 } },
 ];
 ["100", "400", "800"].forEach((lab, i) => {
 const x = w * (0.3 + i * 0.2);
 ctx.fillStyle = m === Number(lab) ? "#f97316" : "#44403c";
 roundRect(ctx, x - 32, layout.deskTop - 28, 64, 36, 8);
 ctx.fill();
 ctx.fillStyle = "#fef3c7";
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(lab + "kg", x, layout.deskTop - 8);
 });
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("pushRule", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Build F = m · a on the canvas.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const prog = forceLabState.tokenProgress || 0;
 drawBackdrop();
 const tokens = ["F", "=", "m", "·", "a"];
 tokens.forEach((label, i) => {
 const x = w * 0.18 + i * (w * 0.14);
 const on = i < prog;
 ctx.fillStyle = on ? "rgba(249,115,22,0.4)" : "rgba(41,37,36,0.9)";
 roundRect(ctx, x - 28, h * 0.36 - 18, 56, 36, 10);
 ctx.fill();
 ctx.fillStyle = on ? "#fef3c7" : "#a8a29e";
 ctx.font = "700 18px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(label, x, h * 0.36);
 });
 drawLabel(ctx, "Second-law rule: net force = mass × acceleration", w * 0.5, layout.labelY);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("pushStretch", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const modes = ["truck", "bike", "sofa", "rocket", "elevator"];
 const modeLabels = { truck: "Truck", bike: "Bike", sofa: "Sofa", rocket: "Rocket", elevator: "Lift" };
 setDescription("Same F=ma idea in new contexts.");
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
 const mode = forceLabState.mode || "truck";
 drawBackdrop();
 const hits = [];
 modes.forEach((m, i) => {
 const x = w * 0.12 + i * (w * 0.17);
 ctx.fillStyle = m === mode ? "rgba(249,115,22,0.4)" : "#292524";
 roundRect(ctx, x - 36, layout.deskTop - 36, 72, 48, 10);
 ctx.fill();
 ctx.fillStyle = "#fef3c7";
 ctx.font = "600 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(modeLabels[m] || m, x, layout.deskTop - 10);
 hits.push({ id: m, shape: "rect", x, y: layout.deskTop - 12, w: 72, h: 48, meta: { mode: m } });
 });
 const cy = h * 0.36;
 if (mode === "bike") {
 drawCar(ctx, w * 0.5, cy, 0.65, "#22c55e");
 drawLabel(ctx, "Light m · big a", w * 0.5, cy + 50, { h: 18, font: "600 11px Segoe UI" });
 } else if (mode === "sofa") {
 ctx.fillStyle = "#a78bfa";
 roundRect(ctx, w * 0.5 - 55, cy - 20, 110, 50, 8);
 ctx.fill();
 drawLabel(ctx, "Heavy sofa", w * 0.5, cy + 50, { h: 18, font: "600 11px Segoe UI" });
 drawArrow(ctx, w * 0.35, cy, w * 0.45, cy, "#f97316");
 } else if (mode === "rocket") {
 ctx.fillStyle = "#e2e8f0";
 roundRect(ctx, w * 0.5 - 12, cy - 40, 24, 55, 6);
 ctx.fill();
 ctx.fillStyle = "#f97316";
 ctx.beginPath();
 ctx.moveTo(w * 0.5 - 10, cy + 18);
 ctx.lineTo(w * 0.5, cy + 40);
 ctx.lineTo(w * 0.5 + 10, cy + 18);
 ctx.fill();
 drawLabel(ctx, "Huge F · huge a", w * 0.5, cy + 60, { h: 18, font: "600 11px Segoe UI" });
 } else if (mode === "elevator") {
 ctx.fillStyle = "#64748b";
 roundRect(ctx, w * 0.5 - 40, cy - 45, 80, 90, 6);
 ctx.fill();
 ctx.strokeStyle = "#f97316";
 ctx.lineWidth = 3;
 ctx.strokeRect(w * 0.5 - 28, cy - 20, 56, 40);
 drawArrow(ctx, w * 0.5, cy + 50, w * 0.5, cy + 20, "#38bdf8");
 drawLabel(ctx, "Net F → a", w * 0.5, cy - 60, { h: 18, font: "600 11px Segoe UI" });
 } else {
 drawCar(ctx, w * 0.5, cy, 1.35, "#64748b");
 drawLabel(ctx, "Loaded truck · big m", w * 0.5, cy + 50, { h: 18, font: "600 11px Segoe UI" });
 }
 const captions = {
 truck: "Loaded truck - more m, smaller a for same F",
 bike: "Light bike - same kick, bigger a",
 sofa: "Heavy sofa needs bigger push",
 rocket: "Huge thrust → huge a",
 elevator: "Net F changes how fast you accelerate",
 };
 drawLabel(ctx, captions[mode], w * 0.5, layout.labelY);
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("pushMyth", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const myths = [
 { claim: "Heavier things always need more force to move at all", truth: "Any net F accelerates; heavier just gets smaller a", kind: "heavy" },
 { claim: "Force is the same as speed", truth: "Force changes velocity; speed is not force", kind: "speed" },
 { claim: "F = m + a", truth: "F = m · a (multiply, don’t add)", kind: "add" },
 { claim: "Zero force means zero velocity", truth: "Zero net F → constant velocity (incl. rest)", kind: "zero" },
 { claim: "Only rockets use F=ma", truth: "Every net force and mass pair follows it", kind: "rocket" },
 ];
 setDescription("Bust F=ma myths.");
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
 ctx.fillStyle = phase === "truth" ? "rgba(52,211,153,0.18)" : "rgba(248,113,113,0.16)";
 roundRect(ctx, w * 0.1, h * 0.1, w * 0.8, 44, 12);
 ctx.fill();
 drawLabel(ctx, phase === "truth" ? m.truth : `Myth: ${m.claim}`, w * 0.5, h * 0.12 + 10, {
 h: 28,
 font: "700 12px Segoe UI",
 });
 const cx = w * 0.5;
 const cy = h * 0.42;
 if (phase === "claim") {
 ctx.fillStyle = "rgba(248,113,113,0.22)";
 ctx.beginPath();
 ctx.arc(cx, cy, 48, 0, Math.PI * 2);
 ctx.fill();
 drawLabel(ctx, "Claim?", cx, cy + 70, { h: 20, font: "600 12px Segoe UI" });
 } else if (m.kind === "heavy") {
 drawCrate(ctx, cx - 60, cy, "400 kg", "#64748b");
 drawCrate(ctx, cx + 60, cy, "100 kg", "#f97316");
 drawLabel(ctx, "Same F → different a", cx, cy + 60, { h: 18, font: "600 11px Segoe UI" });
 } else if (m.kind === "speed") {
 drawLabel(ctx, "F → a → Δv", cx, cy - 20, { h: 28, font: "700 16px Segoe UI" });
 drawLabel(ctx, "Speed is not force", cx, cy + 30, { h: 20, font: "600 12px Segoe UI" });
 } else if (m.kind === "add") {
 drawLabel(ctx, "F = m · a ✓", cx, cy - 10, { h: 32, font: "700 18px Segoe UI" });
 drawLabel(ctx, "not m + a", cx, cy + 30, { h: 20, font: "600 12px Segoe UI" });
 } else if (m.kind === "zero") {
 drawCar(ctx, cx, cy, 1, "#f97316");
 drawLabel(ctx, "F_net = 0 · v can stay", cx, cy + 55, { h: 18, font: "600 11px Segoe UI" });
 } else {
 drawCar(ctx, cx - 70, cy, 0.8, "#f97316");
 ctx.fillStyle = "#e2e8f0";
 roundRect(ctx, cx + 50, cy - 30, 20, 50, 4);
 ctx.fill();
 drawLabel(ctx, "Chair, sofa, rocket - all F=ma", cx, cy + 55, { h: 18, font: "600 11px Segoe UI" });
 }
 drawLabel(ctx, `Myth ${idx + 1} / 5 · Tap to flip`, w * 0.5, layout.labelY);
 setHitRegions([{ id: "card", shape: "rect", x: w * 0.5, y: h * 0.42, w: w * 0.8, h: h * 0.45, meta: { action: "flip" } }]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("pushDrill", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription(forceLabState.prompt || "Push drill");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const p = String(forceLabState.prompt || "").toLowerCase();
 drawBackdrop();
 drawLabel(ctx, forceLabState.prompt || "F = m · a drill", w * 0.5, h * 0.14, { h: 28, font: "700 15px Segoe UI" });
 const cx = w * 0.5;
 const cy = h * 0.48;
 if (p.includes("unit") || p.includes("n equals")) {
 drawLabel(ctx, "1 N = 1 kg · m/s²", cx, cy, { h: 36, font: "700 18px Segoe UI" });
 } else if (p.includes("scale")) {
 drawLabel(ctx, "2× F → 2× a", cx, cy, { h: 36, font: "700 18px Segoe UI" });
 drawCar(ctx, cx, cy + 50, 0.9);
 } else {
 drawLabel(ctx, "F = m · a", cx, cy - 30, { h: 32, font: "700 20px Segoe UI" });
 drawCrate(ctx, cx, cy + 30, "150 kg", "#f97316");
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("pushMastery", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Push Power mastery.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const locked = forceLabState.masteryStep || 0;
 drawBackdrop();
 ["Race", "Sort", "Crate", "Sim", "Rule", "Star"].forEach((label, i) => {
 const x = w * 0.1 + i * (w * 0.14);
 ctx.fillStyle = i < locked ? "#f97316" : "rgba(148,163,184,0.35)";
 roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8);
 ctx.fill();
 ctx.fillStyle = "#1c1917";
 ctx.font = "600 10px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(label, x, h * 0.78);
 });
 drawCar(ctx, w * 0.28, h * 0.36, 0.85, "#f97316");
 drawCrate(ctx, w * 0.52, h * 0.38, "m", "#64748b");
 drawLabel(ctx, "F = m · a", w * 0.75, h * 0.38, { h: 28, font: "700 16px Segoe UI" });
 drawLabel(ctx, "Speed Star!", w * 0.5, layout.labelY);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });
}
