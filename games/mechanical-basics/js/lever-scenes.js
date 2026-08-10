/**
 * Mechanical Basics - Mission 1: Levers & Gears
 * Unique canvas scenes for desk meet, advantage lab, sort, rule scale,
 * place stretch, myth diagrams, prompt-aware drill, mastery showcase.
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

function drawLever(ctx, x, y, angle, heat, opts = {}) {
 const arm = opts.arm || 90;
 const showLabels = opts.labels !== false;
 ctx.save();
 ctx.translate(x, y);
 ctx.fillStyle = "#78716c";
 ctx.beginPath();
 ctx.arc(0, 18, 10, 0, Math.PI * 2);
 ctx.fill();
 ctx.rotate(angle);
 ctx.strokeStyle = "#fdba74";
 ctx.lineWidth = 8;
 ctx.lineCap = "round";
 ctx.beginPath();
 ctx.moveTo(-arm, 0);
 ctx.lineTo(arm, 0);
 ctx.stroke();
 ctx.fillStyle = "#38bdf8";
 roundRect(ctx, -arm - 10, -14, 28, 28, 4);
 ctx.fill();
 ctx.fillStyle = "#f97316";
 roundRect(ctx, arm - 18, -18, 36, 36, 4);
 ctx.fill();
 ctx.restore();
 if (showLabels) {
 ctx.fillStyle = "#e2e8f0";
 ctx.font = "700 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("effort", x - arm, y - 28);
 ctx.fillText("load", x + arm, y - 28);
 ctx.fillText("fulcrum", x, y + 42);
 }
}
function drawGear(ctx, x, y, r, rot, color) {
 ctx.save();
 ctx.translate(x, y);
 ctx.rotate(rot);
 ctx.fillStyle = color;
 for (let i = 0; i < 8; i++) {
 ctx.rotate(Math.PI / 4);
 roundRect(ctx, -6, -r - 8, 12, 16, 2);
 ctx.fill();
 }
 ctx.beginPath();
 ctx.arc(0, 0, r, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#0f172a";
 ctx.beginPath();
 ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
 ctx.fill();
 ctx.restore();
}

function drawBottleOpener(ctx, cx, cy) {
 // Cap + opener lever
 ctx.fillStyle = "#64748b";
 ctx.beginPath();
 ctx.ellipse(cx + 40, cy + 8, 18, 10, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "#fdba74";
 ctx.lineWidth = 7;
 ctx.lineCap = "round";
 ctx.beginPath();
 ctx.moveTo(cx - 70, cy - 20);
 ctx.lineTo(cx + 28, cy + 4);
 ctx.stroke();
 ctx.fillStyle = "#38bdf8";
 ctx.beginPath();
 ctx.arc(cx + 22, cy + 2, 7, 0, Math.PI * 2);
 ctx.fill();
 drawLabel(ctx, "opener = lever", cx - 10, cy + 48, { h: 20, font: "600 11px Segoe UI" });
}
function drawSeesaw(ctx, cx, cy, t) {
 const ang = Math.sin(t * 1.2) * 0.22;
 ctx.fillStyle = "#57534e";
 ctx.beginPath();
 ctx.moveTo(cx - 14, cy + 28);
 ctx.lineTo(cx + 14, cy + 28);
 ctx.lineTo(cx, cy + 4);
 ctx.closePath();
 ctx.fill();
 ctx.save();
 ctx.translate(cx, cy + 4);
 ctx.rotate(ang);
 ctx.strokeStyle = "#38bdf8";
 ctx.lineWidth = 10;
 ctx.beginPath();
 ctx.moveTo(-80, 0);
 ctx.lineTo(80, 0);
 ctx.stroke();
 ctx.fillStyle = "#fbbf24";
 ctx.beginPath();
 ctx.arc(-70, -14, 12, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#fb7185";
 ctx.beginPath();
 ctx.arc(70, -14, 12, 0, Math.PI * 2);
 ctx.fill();
 ctx.restore();
 drawLabel(ctx, "seesaw", cx, cy + 56, { h: 20, font: "600 11px Segoe UI" });
}
function drawCrowbar(ctx, cx, cy) {
 ctx.fillStyle = "#475569";
 roundRect(ctx, cx + 30, cy + 10, 70, 14, 4);
 ctx.fill();
 ctx.strokeStyle = "#22c55e";
 ctx.lineWidth = 8;
 ctx.lineCap = "round";
 ctx.beginPath();
 ctx.moveTo(cx - 80, cy - 30);
 ctx.quadraticCurveTo(cx - 10, cy + 20, cx + 40, cy + 16);
 ctx.stroke();
 ctx.fillStyle = "#78716c";
 ctx.beginPath();
 ctx.arc(cx + 20, cy + 22, 8, 0, Math.PI * 2);
 ctx.fill();
 drawLabel(ctx, "crowbar", cx, cy + 52, { h: 20, font: "600 11px Segoe UI" });
}
function drawBikeGears(ctx, cx, cy, t) {
 drawGear(ctx, cx - 36, cy, 32, t, "#fbbf24");
 drawGear(ctx, cx + 40, cy + 6, 18, -t * 1.7, "#fdba74");
 ctx.strokeStyle = "rgba(226,232,240,0.45)";
 ctx.lineWidth = 2;
 ctx.setLineDash([4, 4]);
 ctx.beginPath();
 ctx.ellipse(cx + 2, cy + 4, 58, 22, 0, 0, Math.PI * 2);
 ctx.stroke();
 ctx.setLineDash([]);
 drawLabel(ctx, "bike gear ratio", cx, cy + 56, { h: 20, font: "600 11px Segoe UI" });
}
function drawLabMeasure(ctx, cx, cy, heat) {
 const effort = 50 + heat * 50;
 const load = 90 - heat * 30;
 ctx.strokeStyle = "#94a3b8";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.moveTo(cx - 100, cy + 30);
 ctx.lineTo(cx + 100, cy + 30);
 ctx.stroke();
 for (let i = -4; i <= 4; i++) {
 ctx.beginPath();
 ctx.moveTo(cx + i * 22, cy + 24);
 ctx.lineTo(cx + i * 22, cy + 36);
 ctx.stroke();
 }
 drawLever(ctx, cx, cy, -0.15 - heat * 0.15, heat, { arm: Math.max(effort, load) * 0.7, labels: true });
 drawLabel(ctx, `effort arm ${Math.round(effort)} · load arm ${Math.round(load)}`, cx, cy + 62, {
 h: 20,
 font: "600 11px Segoe UI",
 });
}
function drawScissors(ctx, cx, cy) {
 ctx.strokeStyle = "#a78bfa";
 ctx.lineWidth = 5;
 ctx.beginPath();
 ctx.moveTo(cx - 50, cy - 30);
 ctx.lineTo(cx + 40, cy + 25);
 ctx.moveTo(cx - 50, cy + 30);
 ctx.lineTo(cx + 40, cy - 25);
 ctx.stroke();
 ctx.fillStyle = "#e2e8f0";
 ctx.beginPath();
 ctx.arc(cx, cy, 7, 0, Math.PI * 2);
 ctx.fill();
 drawLabel(ctx, "scissors = double lever", cx, cy + 52, { h: 20, font: "600 11px Segoe UI" });
}
function drawRamp(ctx, cx, cy) {
 ctx.fillStyle = "#f97316";
 ctx.beginPath();
 ctx.moveTo(cx - 70, cy + 30);
 ctx.lineTo(cx + 70, cy + 30);
 ctx.lineTo(cx + 70, cy - 10);
 ctx.closePath();
 ctx.fill();
 drawLabel(ctx, "ramp - not a gear", cx, cy + 56, { h: 20, font: "600 11px Segoe UI", border: "#f97316" });
}
function drawGlueBlob(ctx, cx, cy) {
 ctx.fillStyle = "#94a3b8";
 ctx.beginPath();
 ctx.ellipse(cx, cy, 36, 22, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "#f87171";
 ctx.lineWidth = 4;
 ctx.beginPath();
 ctx.moveTo(cx - 28, cy - 28);
 ctx.lineTo(cx + 28, cy + 28);
 ctx.moveTo(cx + 28, cy - 28);
 ctx.lineTo(cx - 28, cy + 28);
 ctx.stroke();
 drawLabel(ctx, "glue alone ≠ lever", cx, cy + 48, { h: 20, font: "600 11px Segoe UI", border: "#f87171" });
}

export function registerLeverScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("leverMeet", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions } = api;
 labState.phase = opts.phase || labState.phase || "desk";
 setDescription("Levers & Gears - fulcrum, load, effort.");
 const props = { beam: { x: 0, y: 0 }, g1: { x: 0, y: 0 }, g2: { x: 0, y: 0 } };
 let inited = false;
 let t0 = performance.now();
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const live = labState.phase || opts.phase || "desk";
 const glow = live === "glow" || live === "settle" || live === "predict";
 drawBackdrop();
 if (!inited) {
 props.beam.x = w * 0.28;
 props.beam.y = h * 0.42;
 props.g1.x = w * 0.62;
 props.g1.y = h * 0.4;
 props.g2.x = w * 0.78;
 props.g2.y = h * 0.4;
 inited = true;
 }
 const ang = glow ? Math.sin((performance.now() - t0) / 600) * 0.25 : -0.15;
 const rot = glow ? (performance.now() - t0) / 700 : 0;
 drawLever(ctx, props.beam.x, props.beam.y, ang, glow ? 0.8 : 0.3);
 drawGear(ctx, props.g1.x, props.g1.y, 28, rot, "#fdba74");
 drawGear(ctx, props.g2.x, props.g2.y, 18, -rot * 1.4, "#fbbf24");
 if (live === "predict") {
 drawLabel(ctx, "Predict: free force - or a trade?", w * 0.5, h * 0.18, {
 h: 28,
 font: "700 13px Segoe UI",
 border: "#38bdf8",
 });
 }
 const tips = {
 desk: "Drag lever and gears - find fulcrum, load, effort",
 glow: "Long effort arm = easier lift; gears mesh and turn",
 predict: "Decide before the big idea",
 settle: "Machines trade force, distance, and turn",
 };
 drawLabel(ctx, tips[live] || tips.desk, w * 0.5, layout.labelY);
 const hits = [];
 for (const [id, p] of Object.entries(props)) {
 hits.push({
 id,
 shape: "rect",
 x: p.x,
 y: p.y,
 w: 100,
 h: 80,
 meta: { propId: id },
 onDrag(pt) {
 p.x = Math.max(50, Math.min(w - 50, pt.x));
 p.y = Math.max(70, Math.min(layout.deskTop, pt.y));
 },
 });
 }
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
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
 { id: "ramp", short: "Ramp only", color: 0xf97316 },
 ];
 const accept = {
 lever: ["see", "crow", "scis"],
 gear: ["bike", "clock"],
 neither: ["glue", "mag", "ramp"],
 };
 const cardPos = {};
 chips.forEach((c) => (cardPos[c.id] = { x: 0, y: 0 }));
 let draggingId = null;
 let lastZones = [];
 function placeChip(chipId, zoneId) {
 const okList = accept[zoneId] || [];
 if (!okList.includes(chipId)) {
 pulseFailFeedback(400);
 return false;
 }
 labState.placed = { ...(labState.placed || {}), [chipId]: zoneId };
 const session = getActiveSession();
 if (session?.dispatch) session.dispatch({ type: "PLACE_CHIP", chipId, zoneId, accept: okList });
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
 { id: "lever", label: "Lever", x: w * 0.02, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#38bdf8" },
 { id: "gear", label: "Gear", x: w * 0.34, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#fbbf24" },
 { id: "neither", label: "Neither", x: w * 0.66, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#94a3b8" },
 ];
 lastZones = zones;
 const hits = [];
 for (const z of zones) {
 ctx.fillStyle = "rgba(15,23,42,0.75)";
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
 const byZone = { lever: [], gear: [], neither: [] };
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
 targetX = w * 0.12 + (idx % 4) * (w * 0.2);
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
 ctx.fillStyle = labState.selectedId === c.id ? "rgba(56,189,248,0.4)" : "rgba(15,23,42,0.95)";
 roundRect(ctx, prev.x - 48, prev.y - 16, 96, 32, 8);
 ctx.fill();
 ctx.strokeStyle = "#" + c.color.toString(16).padStart(6, "0");
 ctx.stroke();
 ctx.fillStyle = "#e2e8f0";
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
 drawLabel(ctx, "Sort lever / gear / neither", w * 0.5, layout.labelY);
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
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
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const heat = labState.heat ?? 0.3;
 drawBackdrop();
 const ang = -0.35 + heat * 0.55;
 const effortArm = 70 + heat * 40;
 drawLever(ctx, w * 0.35, h * 0.42, ang, heat, { arm: effortArm });
 drawGear(ctx, w * 0.7, h * 0.4, 26, heat * 4, "#fdba74");
 drawGear(ctx, w * 0.82, h * 0.4, 16, -heat * 5.5, "#fbbf24");
 const hx = w * 0.2 + heat * w * 0.6;
 ctx.fillStyle = "#fdba74";
 ctx.beginPath();
 ctx.arc(hx, h * 0.72, 14, 0, Math.PI * 2);
 ctx.fill();
 // Advantage readout bar
 ctx.fillStyle = "rgba(15,23,42,0.8)";
 roundRect(ctx, w * 0.2, h * 0.78, w * 0.6, 10, 5);
 ctx.fill();
 ctx.fillStyle = heat >= 0.6 ? "#22c55e" : "#fdba74";
 roundRect(ctx, w * 0.2, h * 0.78, w * 0.6 * heat, 10, 5);
 ctx.fill();
 drawLabel(
 ctx,
 heat >= 0.6 ? "Advantage rising - load lifts easier" : "Drag to boost mechanical advantage",
 w * 0.5,
 layout.labelY,
 );
 setHitRegions([{ id: "h", shape: "rect", x: hx, y: h * 0.72, w: 48, h: 48, meta: { action: "stretch" } }]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("leverRule", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 const start = performance.now();
 setDescription("Lever / gear rule - desk tools to MACHINE RULE");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const prog = labState.tokenProgress || 0;
 const scale = labState.scale || 0;
 const t = (performance.now() - start) / 1000;
 drawBackdrop();

 // Token strip always visible during equation build
 ["Lever", "trades", "force", "distance"].forEach((label, i) => {
 const x = w * 0.14 + i * (w * 0.2);
 ctx.fillStyle = i < prog ? "rgba(74,222,128,0.4)" : "rgba(15,23,42,0.9)";
 roundRect(ctx, x - 48, h * 0.22 - 18, 96, 36, 10);
 ctx.fill();
 ctx.fillStyle = "#e2e8f0";
 ctx.font = "700 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(label, x, h * 0.22);
 });

 const cx = w * 0.5;
 const cy = h * 0.52;
 if (scale <= 0.01 && prog < 4) {
 drawLever(ctx, cx - 40, cy, -0.2, 0.7);
 drawGear(ctx, cx + 90, cy, 22, t * 0.8, "#fdba74");
 drawLabel(ctx, "Build the rule tokens above", w * 0.5, layout.labelY);
 } else if (scale < 0.33) {
 drawSeesaw(ctx, cx - 80, cy, t);
 drawGear(ctx, cx + 90, cy, 26, t, "#fdba74");
 drawGear(ctx, cx + 130, cy + 8, 16, -t * 1.5, "#fbbf24");
 drawLabel(ctx, "Desk tools: seesaw + meshing gears", w * 0.5, layout.labelY);
 } else if (scale < 0.66) {
 drawLever(ctx, cx, cy, -0.18, 0.75);
 ctx.strokeStyle = "rgba(56,189,248,0.7)";
 ctx.lineWidth = 2;
 ctx.setLineDash([5, 4]);
 ctx.beginPath();
 ctx.moveTo(cx - 90, cy - 40);
 ctx.lineTo(cx, cy + 10);
 ctx.lineTo(cx + 90, cy - 40);
 ctx.stroke();
 ctx.setLineDash([]);
 drawLabel(ctx, "effort arm", cx - 90, cy - 52, { h: 18, font: "600 10px Segoe UI" });
 drawLabel(ctx, "load arm", cx + 90, cy - 52, { h: 18, font: "600 10px Segoe UI" });
 drawLabel(ctx, "Labeled fulcrum · effort · load", w * 0.5, layout.labelY);
 } else {
 ctx.fillStyle = "rgba(34,197,94,0.25)";
 roundRect(ctx, cx - 160, cy - 50, 320, 70, 14);
 ctx.fill();
 ctx.strokeStyle = "#22c55e";
 ctx.lineWidth = 2.5;
 ctx.stroke();
 ctx.fillStyle = "#e2e8f0";
 ctx.font = "800 18px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("MACHINE RULE", cx, cy - 18);
 ctx.font = "600 13px Segoe UI";
 ctx.fillText("trade force \u2194 distance / turn", cx, cy + 10);
 drawGear(ctx, cx - 120, cy + 70, 20, t, "#fdba74");
 drawGear(ctx, cx - 80, cy + 70, 14, -t * 1.4, "#fbbf24");
 drawLever(ctx, cx + 80, cy + 70, -0.2, 0.8, { arm: 60, labels: false });
 drawLabel(ctx, "Rule locked for levers and gears", w * 0.5, layout.labelY);
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("leverStretch", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const start = performance.now();
 const modes = ["home", "school", "street", "shop", "lab"];
 const modeLabels = { home: "Home", school: "School", street: "Street", shop: "Shop", lab: "Lab" };
 setDescription("Same lever/gear idea in places you know.");
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
 const t = (performance.now() - start) / 1000;
 const mode = labState.mode || api.opts?.mode || modes[0];
 drawBackdrop();
 const hits = [];
 modes.forEach((m, i) => {
 const x = w * 0.12 + i * (w * 0.17);
 ctx.fillStyle = m === mode ? "rgba(56,189,248,0.4)" : "#1e293b";
 roundRect(ctx, x - 36, layout.deskTop - 36, 72, 48, 10);
 ctx.fill();
 ctx.strokeStyle = m === mode ? "#38bdf8" : "#475569";
 ctx.lineWidth = m === mode ? 2 : 1;
 ctx.stroke();
 ctx.fillStyle = "#e2e8f0";
 ctx.font = "600 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(modeLabels[m] || m, x, layout.deskTop - 10);
 hits.push({ id: m, shape: "rect", x, y: layout.deskTop - 12, w: 72, h: 48, meta: { mode: m } });
 });

 const cx = w * 0.5;
 const cy = h * 0.38;
 if (mode === "home") drawBottleOpener(ctx, cx, cy);
 else if (mode === "school") {
 drawSeesaw(ctx, cx - 40, cy, t);
 drawGear(ctx, cx + 100, cy, 20, t, "#fdba74");
 } else if (mode === "street") drawCrowbar(ctx, cx, cy);
 else if (mode === "shop") drawBikeGears(ctx, cx, cy, t);
 else drawLabMeasure(ctx, cx, cy, labState.heat ?? 0.55);

 const captions = {
 home: "Bottle opener / scissors - lever at home",
 school: "Seesaw and science kit gears",
 street: "Crowbar lifting a drain cover",
 shop: "Bike shop - gear ratios on pedals",
 lab: "Lab: measure effort vs load arms",
 };
 drawLabel(ctx, captions[mode] || mode, w * 0.5, layout.labelY);
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("leverMyth", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 const start = performance.now();
 setDescription("Bust lever and gear myths - canvas shows the evidence.");
 const myths = [
 { claim: "Levers only make things heavier", truth: "Levers trade distance for force - they help lift", kind: "heavier" },
 { claim: "Gears only look cool", truth: "Gears change speed and turn direction", kind: "gears" },
 { claim: "Fulcrum position does not matter", truth: "Fulcrum place changes how hard you push", kind: "fulcrum" },
 { claim: "Only factories use levers", truth: "Seesaws, crowbars, and scissors are levers too", kind: "factory" },
 { claim: "Bigger gear always means infinite force", truth: "Gear pairs trade speed and force together", kind: "infinite" },
 ];
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const t = (performance.now() - start) / 1000;
 const idx = labState.myth ?? 0;
 const phase = labState.mythPhase || "claim";
 const m = myths[idx] || myths[0];
 drawBackdrop();
 ctx.fillStyle = phase === "truth" ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.18)";
 roundRect(ctx, w * 0.1, h * 0.1, w * 0.8, 44, 12);
 ctx.fill();
 drawLabel(ctx, phase === "truth" ? m.truth : "Myth: " + m.claim, w * 0.5, h * 0.12 + 12, {
 h: 28,
 font: "700 13px Segoe UI",
 });

 const cx = w * 0.5;
 const cy = h * 0.45;
 if (phase === "claim" || phase === "wrong") {
 ctx.fillStyle = "rgba(248,113,113,0.22)";
 ctx.beginPath();
 ctx.arc(cx, cy, 48, 0, Math.PI * 2);
 ctx.fill();
 drawLabel(ctx, "Claim looks simple…", cx, cy + 70, { h: 22, font: "600 12px Segoe UI" });
 } else if (m.kind === "heavier") {
 drawLever(ctx, cx, cy, -0.35, 0.85);
 drawLabel(ctx, "Load rises - trade, not heavier magic", cx, cy + 70, { h: 22, font: "600 12px Segoe UI" });
 } else if (m.kind === "gears") {
 drawGear(ctx, cx - 40, cy, 30, t, "#fdba74");
 drawGear(ctx, cx + 40, cy, 18, -t * 1.6, "#fbbf24");
 ctx.fillStyle = "#38bdf8";
 ctx.font = "700 14px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("\u21c4 speed / turn", cx, cy + 70);
 } else if (m.kind === "fulcrum") {
 drawLever(ctx, cx - 90, cy, -0.1, 0.4, { arm: 70 });
 drawLever(ctx, cx + 90, cy, -0.35, 0.85, { arm: 70 });
 drawLabel(ctx, "near load", cx - 90, cy + 70, { h: 18, font: "600 10px Segoe UI" });
 drawLabel(ctx, "far from load", cx + 90, cy + 70, { h: 18, font: "600 10px Segoe UI" });
 } else if (m.kind === "factory") {
 drawSeesaw(ctx, cx - 90, cy, t);
 drawScissors(ctx, cx + 80, cy);
 } else {
 drawGear(ctx, cx - 50, cy, 36, t * 0.5, "#fdba74");
 drawGear(ctx, cx + 50, cy, 20, -t * 0.9, "#fbbf24");
 drawLabel(ctx, "big gear \u2194 slow force · small \u2194 fast", cx, cy + 70, {
 h: 22,
 font: "600 12px Segoe UI",
 });
 }

 drawLabel(ctx, "Myth " + (idx + 1) + " / 5", w * 0.5, layout.labelY);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("leverDrill", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 const start = performance.now();
 setDescription(labState.prompt || "Lever drill");

 function drillVisual(prompt) {
 const p = (prompt || "").toLowerCase();
 if (p.includes("fulcrum")) return "fulcrum";
 if (p.includes("turn")) return "turn";
 if (p.includes("glue")) return "glue";
 if (p.includes("arm")) return "arm";
 if (p.includes("scissor")) return "scissors";
 if (p.includes("ramp")) return "ramp";
 return "default";
 }

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 drawBackdrop();
 const flash = labState.flashColor || 0x22c55e;
 ctx.fillStyle = `#${flash.toString(16).padStart(6, "0")}33`;
 ctx.fillRect(0, 0, w, h * 0.18);
 drawLabel(ctx, labState.prompt || "Lever drill", w * 0.5, h * 0.1, { h: 28, font: "700 16px Segoe UI" });

 const kind = drillVisual(labState.prompt);
 const cx = w * 0.5;
 const cy = h * 0.48;
 if (kind === "fulcrum") {
 drawLever(ctx, cx, cy, -0.15, 0.6);
 ctx.strokeStyle = "#fbbf24";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.arc(cx, cy + 18, 22, 0, Math.PI * 2);
 ctx.stroke();
 drawLabel(ctx, "pivot = fulcrum", cx, cy + 70, { h: 20, font: "600 12px Segoe UI" });
 } else if (kind === "turn") {
 drawGear(ctx, cx - 40, cy, 28, t, "#fdba74");
 drawGear(ctx, cx + 40, cy, 18, -t * 1.5, "#fbbf24");
 drawLabel(ctx, "meshed gears reverse turn", cx, cy + 70, { h: 20, font: "600 12px Segoe UI" });
 } else if (kind === "glue") drawGlueBlob(ctx, cx, cy);
 else if (kind === "arm") {
 drawLever(ctx, cx, cy, -0.25, 0.8, { arm: 110 });
 drawLabel(ctx, "long effort arm helps lift", cx, cy + 70, { h: 20, font: "600 12px Segoe UI" });
 } else if (kind === "scissors") drawScissors(ctx, cx, cy);
 else if (kind === "ramp") drawRamp(ctx, cx, cy);
 else {
 drawLever(ctx, cx - 40, cy, -0.15, 0.7);
 drawGear(ctx, cx + 90, cy, 22, t * 0.6, "#fdba74");
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("leverMastery", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 const start = performance.now();
 setDescription("Lever Learner mastery path");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const locked = labState.masteryStep || 0;
 const t = (performance.now() - start) / 1000;
 drawBackdrop();

 // Path pips
 ["Meet", "Sort", "Lab", "Rule", "Myth", "Win"].forEach((label, i) => {
 const x = w * 0.1 + i * (w * 0.14);
 ctx.fillStyle = i < locked ? "#22c55e" : "rgba(148,163,184,0.35)";
 roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8);
 ctx.fill();
 ctx.fillStyle = "#0f172a";
 ctx.font = "600 10px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(label, x, h * 0.78);
 if (i < 5) {
 ctx.strokeStyle = i < locked - 1 ? "#22c55e" : "rgba(148,163,184,0.35)";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.moveTo(x + 30, h * 0.78);
 ctx.lineTo(x + w * 0.14 - 30, h * 0.78);
 ctx.stroke();
 }
 });

 // Showcase trio
 drawLever(ctx, w * 0.28, h * 0.4, -0.2 + Math.sin(t) * 0.08, 0.75);
 drawBikeGears(ctx, w * 0.68, h * 0.38, t);
 ctx.fillStyle = "rgba(34,197,94,0.28)";
 roundRect(ctx, w * 0.5 - 120, h * 0.58, 240, 44, 12);
 ctx.fill();
 ctx.strokeStyle = "#22c55e";
 ctx.lineWidth = 2;
 ctx.stroke();
 ctx.fillStyle = "#e2e8f0";
 ctx.font = "800 16px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("Lever Learner", w * 0.5, h * 0.58 + 28);

 drawLabel(ctx, "Mastery: levers + gears trade to help", w * 0.5, layout.labelY);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });
}
