/**
 * Math Quest · Mission 1: Number Sense - Canvas 2D scenes (Tiny Bits depth).
 * Tens rods + ones cubes, place-value chart, count lab, BD everyday stretch.
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
 ctx.fillStyle = opts.bg || "rgba(7, 32, 58, 0.92)";
 roundRect(ctx, x - tw / 2, y - bh / 2, tw, bh, 10);
 ctx.fill();
 ctx.strokeStyle = opts.border || "rgba(56,189,248,0.55)";
 ctx.lineWidth = 1.4;
 ctx.stroke();
 ctx.fillStyle = opts.color || "#e0f2fe";
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
 ctx.fillStyle = `rgba(56,189,248,${Math.max(0, (until - performance.now()) / 380) * 0.22})`;
 ctx.fillRect(0, 0, w, h);
}

/** Base-10 block: ten-rod (tall) or one-cube */
function drawRod(ctx, x, y, scale = 1) {
 ctx.save();
 ctx.translate(x, y);
 ctx.scale(scale, scale);
 ctx.fillStyle = "#0ea5e9";
 roundRect(ctx, -8, -48, 16, 96, 4);
 ctx.fill();
 ctx.strokeStyle = "#0369a1";
 ctx.lineWidth = 2;
 ctx.stroke();
 for (let i = 0; i < 10; i++) {
 ctx.strokeStyle = "rgba(224,242,254,0.35)";
 ctx.beginPath();
 ctx.moveTo(-8, -48 + i * 9.6);
 ctx.lineTo(8, -48 + i * 9.6);
 ctx.stroke();
 }
 ctx.restore();
}
function drawCube(ctx, x, y, scale = 1, color = "#38bdf8") {
 ctx.save();
 ctx.translate(x, y);
 ctx.scale(scale, scale);
 ctx.fillStyle = color;
 roundRect(ctx, -10, -10, 20, 20, 4);
 ctx.fill();
 ctx.strokeStyle = "#0284c7";
 ctx.lineWidth = 2;
 ctx.stroke();
 ctx.restore();
}

function drawPlaceChart(ctx, cx, cy, tens, ones) {
 const tw = 200;
 const th = 90;
 const x = cx - tw / 2;
 const y = cy - th / 2;
 ctx.fillStyle = "rgba(15,23,42,0.85)";
 roundRect(ctx, x, y, tw, th, 12);
 ctx.fill();
 ctx.strokeStyle = "#38bdf8";
 ctx.lineWidth = 2;
 ctx.stroke();
 ctx.fillStyle = "#7dd3fc";
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("TENS", x + tw * 0.28, y + 18);
 ctx.fillText("ONES", x + tw * 0.72, y + 18);
 ctx.fillStyle = "#e0f2fe";
 ctx.font = "800 28px Segoe UI";
 ctx.fillText(String(tens), x + tw * 0.28, y + 58);
 ctx.fillText(String(ones), x + tw * 0.72, y + 58);
 ctx.strokeStyle = "rgba(125,211,252,0.4)";
 ctx.beginPath();
 ctx.moveTo(cx, y + 8);
 ctx.lineTo(cx, y + th - 8);
 ctx.stroke();
}

function totalFromBlocks() {
 const tens = labState.tens ?? 2;
 const ones = labState.ones ?? 3;
 return tens * 10 + ones;
}

export function registerNumScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("numMeet", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions, setIntentHandler } = api;
 const startPhase = opts.phase || labState.phase || "desk";
 labState.phase = startPhase;
 if (labState.tens == null) labState.tens = 2;
 if (labState.ones == null) labState.ones = 3;
 setDescription("Number Sense - tens rods and ones cubes.");

 const props = {
 rod: { x: 0, y: 0 },
 c1: { x: 0, y: 0 },
 c2: { x: 0, y: 0 },
 egg: { x: 0, y: 0 },
 };
 let inited = false;

 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "nudge") {
 labState.ones = Math.min(9, (labState.ones || 0) + 1);
 pulseSuccessFeedback(180);
 }
 });

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const live = labState.phase || startPhase;
 drawBackdrop();
 if (!inited) {
 props.rod.x = w * 0.22;
 props.rod.y = h * 0.42;
 props.c1.x = w * 0.42;
 props.c1.y = h * 0.48;
 props.c2.x = w * 0.52;
 props.c2.y = h * 0.48;
 props.egg.x = w * 0.72;
 props.egg.y = h * 0.46;
 inited = true;
 }
 // desk
 ctx.fillStyle = "#0c4a6e";
 roundRect(ctx, w * 0.08, layout.deskTop - 8, w * 0.84, 18, 8);
 ctx.fill();

 drawRod(ctx, props.rod.x, props.rod.y, 0.85);
 drawCube(ctx, props.c1.x, props.c1.y, 1.1);
 drawCube(ctx, props.c2.x, props.c2.y, 1.1, "#7dd3fc");
 // egg carton metaphor (everyday count)
 ctx.fillStyle = "#fef3c7";
 roundRect(ctx, props.egg.x - 28, props.egg.y - 18, 56, 36, 8);
 ctx.fill();
 ctx.strokeStyle = "#d97706";
 ctx.stroke();
 for (let i = 0; i < 6; i++) {
 ctx.fillStyle = "#fde68a";
 ctx.beginPath();
 ctx.ellipse(props.egg.x - 16 + (i % 3) * 16, props.egg.y - 6 + Math.floor(i / 3) * 14, 6, 5, 0, 0, Math.PI * 2);
 ctx.fill();
 }

 if (live === "glow" || live === "group") {
 drawPlaceChart(ctx, w * 0.5, h * 0.22, labState.tens || 2, labState.ones || 3);
 }
 if (live === "settle") {
 const n = totalFromBlocks();
 drawPlaceChart(ctx, w * 0.5, h * 0.22, labState.tens || 2, labState.ones || 3);
 drawLabel(ctx, `Value = ${labState.tens || 2} tens + ${labState.ones || 3} ones = ${n}`, w * 0.5, layout.labelY, {
 h: 28,
 font: "700 14px Segoe UI",
 });
 } else {
 const tips = {
 desk: "Drag rods & cubes - a ten-rod is 10 ones glued",
 glow: "Group into tens and ones on the place chart",
 group: "Tens column · Ones column",
 settle: "Place value names the number",
 };
 drawLabel(ctx, tips[live] || tips.desk, w * 0.5, layout.labelY);
 }

 const hits = [];
 for (const [id, p] of Object.entries(props)) {
 hits.push({
 id,
 shape: "rect",
 x: p.x,
 y: p.y,
 w: id === "rod" ? 40 : 50,
 h: id === "rod" ? 110 : 44,
 meta: { propId: id },
 onDrag(pt) {
 p.x = Math.max(40, Math.min(w - 40, pt.x));
 p.y = Math.max(60, Math.min(layout.deskTop + 4, pt.y));
 },
 });
 }
 hits.push({
 id: "nudge",
 shape: "rect",
 x: w * 0.88,
 y: h * 0.22,
 w: 44,
 h: 44,
 meta: { action: "nudge" },
 });
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("numSort", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } =
 api;
 setDescription("Sort: tens story, ones story, or not place value.");
 const chips = [
 { id: "rod", text: "One ten-rod", short: "Ten-rod", color: 0x0ea5e9 },
 { id: "cube", text: "One cube", short: "One", color: 0x38bdf8 },
 { id: "twenty", text: "2 ten-rods", short: "2 tens", color: 0x0284c7 },
 { id: "letter", text: "Letter A", short: "Letter", color: 0x94a3b8 },
 { id: "five", text: "5 ones", short: "5 ones", color: 0x7dd3fc },
 { id: "taka", text: "10-taka note", short: "10 taka", color: 0xfbbf24 },
 { id: "color", text: "Blue color", short: "Color", color: 0xa78bfa },
 { id: "bundle", text: "Bundle of 10 eggs", short: "10 eggs", color: 0xf59e0b },
 ];
 const accept = {
 tens: ["rod", "twenty", "taka", "bundle"],
 ones: ["cube", "five"],
 not: ["letter", "color"],
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
 labState.placed = { ...(labState.placed || {}), [chipId]: zoneId };
 labState.selectedId = chipId;
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
 { id: "tens", label: "Tens (10s)", x: w * 0.03, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#0ea5e9" },
 { id: "ones", label: "Ones (1s)", x: w * 0.35, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#38bdf8" },
 { id: "not", label: "Not place value", x: w * 0.67, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#94a3b8" },
 ];
 lastZones = zones;
 const hits = [];
 for (const z of zones) {
 ctx.fillStyle = "rgba(7,32,58,0.75)";
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
 tens: chips.filter((c) => placed[c.id] === "tens").map((c) => c.id),
 ones: chips.filter((c) => placed[c.id] === "ones").map((c) => c.id),
 not: chips.filter((c) => placed[c.id] === "not").map((c) => c.id),
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
 ctx.fillStyle = labState.selectedId === c.id ? "rgba(56,189,248,0.4)" : "rgba(7,32,58,0.95)";
 roundRect(ctx, prev.x - 48, prev.y - 16, 96, 32, 8);
 ctx.fill();
 ctx.strokeStyle = "#" + c.color.toString(16).padStart(6, "0");
 ctx.stroke();
 ctx.fillStyle = "#e0f2fe";
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
 drawLabel(ctx, "Tens · Ones · Not a place-value story", w * 0.5, layout.labelY);
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("numLab", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 setDescription("Drag to build a number - tens and ones.");
 if (labState.tens == null) labState.tens = 1;
 if (labState.ones == null) labState.ones = 4;

 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
 const next = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
 labState.heat = next;
 // map heat to total 0..99-ish display goal: tens 0-9 from heat
 const total = Math.round(next * 45 + 10); // 10..55 range for kid goals
 labState.tens = Math.floor(total / 10);
 labState.ones = total % 10;
 labState.buildTotal = total;
 }
 if (intent.type === "CANVAS_TAP" && intent.meta?.col === "tens") {
 labState.tens = Math.min(9, (labState.tens || 0) + 1);
 labState.heat = Math.min(1, ((labState.tens * 10 + (labState.ones || 0)) - 10) / 45);
 pulseSuccessFeedback(160);
 }
 if (intent.type === "CANVAS_TAP" && intent.meta?.col === "ones") {
 labState.ones = ((labState.ones || 0) + 1) % 10;
 labState.heat = Math.min(1, ((labState.tens * 10 + labState.ones) - 10) / 45);
 pulseSuccessFeedback(160);
 }
 });

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const tens = labState.tens ?? 1;
 const ones = labState.ones ?? 4;
 const heat = labState.heat ?? (tens * 10 + ones - 10) / 45;
 drawBackdrop();
 drawPlaceChart(ctx, w * 0.5, h * 0.2, tens, ones);
 // visual blocks
 for (let i = 0; i < tens; i++) drawRod(ctx, w * 0.18 + i * 28, h * 0.48, 0.55);
 for (let i = 0; i < ones; i++) drawCube(ctx, w * 0.55 + (i % 5) * 24, h * 0.42 + Math.floor(i / 5) * 26, 0.9);
 const hx = w * 0.2 + Math.max(0, Math.min(1, heat)) * w * 0.6;
 ctx.fillStyle = "#38bdf8";
 ctx.beginPath();
 ctx.arc(hx, h * 0.72, 14, 0, Math.PI * 2);
 ctx.fill();
 const total = tens * 10 + ones;
 drawLabel(
 ctx,
 total >= 25 ? `Built ${total} - strong place value!` : `Build toward 25+ (now ${total}) · tap columns or drag`,
 w * 0.5,
 layout.labelY,
 );
 setHitRegions([
 { id: "h", shape: "rect", x: hx, y: h * 0.72, w: 48, h: 48, meta: { action: "stretch" } },
 { id: "t", shape: "rect", x: w * 0.36, y: h * 0.2, w: 70, h: 70, meta: { col: "tens" } },
 { id: "o", shape: "rect", x: w * 0.58, y: h * 0.2, w: 70, h: 70, meta: { col: "ones" } },
 ]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("numRule", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("A ten is a group of ten ones.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const prog = labState.tokenProgress || 0;
 const scale = labState.scale ?? 0;
 drawBackdrop();
 const tokens = ["10 ones", "=", "1 ten", "· place"];
 tokens.forEach((label, i) => {
 const x = w * 0.18 + i * (w * 0.18);
 const on = i < prog;
 ctx.fillStyle = on ? "rgba(56,189,248,0.4)" : "rgba(7,32,58,0.9)";
 roundRect(ctx, x - 48, h * 0.28 - 18, 96, 36, 10);
 ctx.fill();
 ctx.fillStyle = on ? "#e0f2fe" : "#7dd3fc";
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(label, x, h * 0.28);
 });
 // Place scrubber stages: loose ones → bundled rod → chart
 if (scale < 0.33) {
 for (let i = 0; i < 10; i++) {
 drawCube(ctx, w * 0.22 + (i % 5) * 28, h * 0.52 + Math.floor(i / 5) * 30, 0.85);
 }
 drawLabel(ctx, "Loose ones - count by 1", w * 0.5, layout.labelY);
 } else if (scale < 0.66) {
 drawRod(ctx, w * 0.42, h * 0.55, 0.95);
 for (let i = 0; i < 3; i++) drawCube(ctx, w * 0.62 + i * 24, h * 0.58, 0.7, "#7dd3fc");
 drawLabel(ctx, "10 ones bundle into 1 ten-rod", w * 0.5, layout.labelY);
 } else {
 drawPlaceChart(ctx, w * 0.5, h * 0.52, 1, 0);
 ctx.fillStyle = "rgba(56,189,248,0.25)";
 roundRect(ctx, w * 0.32, h * 0.68, w * 0.36, 36, 10);
 ctx.fill();
 ctx.fillStyle = "#e0f2fe";
 ctx.font = "800 16px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("PLACE names the value", w * 0.5, h * 0.7);
 drawLabel(ctx, "Number Sense rule: 10 ones = 1 ten", w * 0.5, layout.labelY);
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("numStretch", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, opts } = api;
 const modes = ["eggs", "taka", "cricket", "bus", "beads"];
 const friendly = { eggs: "Eggs", taka: "Taka", cricket: "Cricket", bus: "Bus", beads: "Beads" };
 setDescription("Same place-value idea in Bangladesh stories.");
 if (opts?.mode) labState.mode = opts.mode;
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
 const mode = labState.mode || "eggs";
 const tens = labState.tens ?? 2;
 const ones = labState.ones ?? 5;
 drawBackdrop();
 const hits = [];
 modes.forEach((m, i) => {
 const x = w * 0.12 + i * (w * 0.17);
 ctx.fillStyle = m === mode ? "rgba(56,189,248,0.4)" : "#0c4a6e";
 roundRect(ctx, x - 36, layout.deskTop - 36, 72, 48, 10);
 ctx.fill();
 ctx.fillStyle = "#e0f2fe";
 ctx.font = "600 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(friendly[m], x, layout.deskTop - 10);
 hits.push({ id: m, shape: "rect", x, y: layout.deskTop - 12, w: 72, h: 48, meta: { mode: m } });
 });
 drawPlaceChart(ctx, w * 0.72, h * 0.38, tens, ones);
 // Distinct everyday props per mode
 if (mode === "eggs") {
 ctx.fillStyle = "#fef3c7";
 roundRect(ctx, w * 0.18, h * 0.34, 120, 70, 10);
 ctx.fill();
 ctx.strokeStyle = "#d97706";
 ctx.stroke();
 for (let i = 0; i < 10; i++) {
 ctx.fillStyle = "#fde68a";
 ctx.beginPath();
 ctx.ellipse(w * 0.26 + (i % 5) * 18, h * 0.48 + Math.floor(i / 5) * 20, 7, 6, 0, 0, Math.PI * 2);
 ctx.fill();
 }
 for (let i = 0; i < 5; i++) {
 ctx.fillStyle = "#fbbf24";
 ctx.beginPath();
 ctx.ellipse(w * 0.28 + i * 16, h * 0.62, 6, 5, 0, 0, Math.PI * 2);
 ctx.fill();
 }
 } else if (mode === "taka") {
 for (let i = 0; i < 2; i++) {
 ctx.fillStyle = "#fbbf24";
 roundRect(ctx, w * 0.16 + i * 70, h * 0.38, 58, 34, 6);
 ctx.fill();
 ctx.fillStyle = "#78350f";
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("10৳", w * 0.16 + i * 70 + 29, h * 0.4);
 }
 ctx.fillStyle = "#fde68a";
 roundRect(ctx, w * 0.32, h * 0.55, 44, 28, 6);
 ctx.fill();
 ctx.fillStyle = "#78350f";
 ctx.font = "700 11px Segoe UI";
 ctx.fillText("5৳", w * 0.32 + 22, h * 0.57);
 } else if (mode === "cricket") {
 ctx.fillStyle = "#14532d";
 roundRect(ctx, w * 0.14, h * 0.34, 160, 90, 12);
 ctx.fill();
 ctx.fillStyle = "#86efac";
 ctx.font = "800 36px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(String(tens * 10 + ones), w * 0.14 + 80, h * 0.42);
 ctx.font = "600 12px Segoe UI";
 ctx.fillText("RUNS", w * 0.14 + 80, h * 0.52);
 } else if (mode === "bus") {
 ctx.fillStyle = "#0369a1";
 roundRect(ctx, w * 0.14, h * 0.36, 170, 70, 14);
 ctx.fill();
 for (let i = 0; i < 10; i++) {
 ctx.fillStyle = i < tens * 5 + Math.min(ones, 5) ? "#38bdf8" : "#0c4a6e";
 roundRect(ctx, w * 0.2 + (i % 5) * 26, h * 0.42 + Math.floor(i / 5) * 22, 20, 16, 4);
 ctx.fill();
 }
 } else {
 // beads string with decade marks
 ctx.strokeStyle = "#94a3b8";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.moveTo(w * 0.14, h * 0.48);
 ctx.lineTo(w * 0.55, h * 0.48);
 ctx.stroke();
 for (let i = 0; i < 25; i++) {
 const x = w * 0.16 + i * 14;
 ctx.fillStyle = i % 10 === 9 ? "#0ea5e9" : "#7dd3fc";
 ctx.beginPath();
 ctx.arc(x, h * 0.48, i % 10 === 9 ? 8 : 5, 0, Math.PI * 2);
 ctx.fill();
 }
 }
 const captions = {
 eggs: "25 eggs = 2 bundles of 10 + 5 ones",
 taka: "25 taka = two 10s + a 5",
 cricket: "25 runs - scoreboard is tens and ones",
 bus: "25 seats - groups of ten help count fast",
 beads: "25 beads - decade marks every 10",
 };
 drawLabel(ctx, captions[mode], w * 0.5, layout.labelY);
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("numMyth", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const myths = [
 { claim: "23 means 2 + 3", truth: "23 means 2 tens + 3 ones = 20 + 3" },
 { claim: "A ten-rod is just a longer one", truth: "A ten-rod stands for ten ones bundled" },
 { claim: "Place doesn’t matter - 32 = 23", truth: "Place changes value - 32 ≠ 23" },
 { claim: "Zero in ones means nothing useful", truth: "30 needs the 0 to show 3 tens and no ones" },
 { claim: "Only school blocks teach place value", truth: "Eggs, taka, and scoreboards use the same idea" },
 ];
 setDescription("Bust place-value myths.");
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
 const truth = phase === "truth";
 drawBackdrop();
 // Per-myth diagrams (claim vs truth)
 if (idx === 0) {
 if (!truth) {
 ctx.fillStyle = "#e0f2fe";
 ctx.font = "800 28px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("2 + 3 = 5 ?", w * 0.5, h * 0.36);
 } else {
 drawRod(ctx, w * 0.28, h * 0.4, 0.7);
 drawRod(ctx, w * 0.36, h * 0.4, 0.7);
 for (let i = 0; i < 3; i++) drawCube(ctx, w * 0.52 + i * 24, h * 0.42, 0.9);
 drawPlaceChart(ctx, w * 0.72, h * 0.38, 2, 3);
 }
 } else if (idx === 1) {
 if (!truth) {
 drawCube(ctx, w * 0.35, h * 0.4, 1.4, "#94a3b8");
 ctx.fillStyle = "#94a3b8";
 roundRect(ctx, w * 0.5, h * 0.28, 22, 110, 4);
 ctx.fill();
 drawLabel(ctx, "Just longer?", w * 0.5, h * 0.55, { h: 22 });
 } else {
 drawRod(ctx, w * 0.45, h * 0.4, 1);
 drawLabel(ctx, "10 ones bundled", w * 0.5, h * 0.58, { h: 22 });
 }
 } else if (idx === 2) {
 drawPlaceChart(ctx, w * 0.3, h * 0.38, 3, 2);
 drawPlaceChart(ctx, w * 0.7, h * 0.38, 2, 3);
 ctx.fillStyle = truth ? "#4ade80" : "#f87171";
 ctx.font = "800 22px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(truth ? "32 ≠ 23" : "32 = 23 ?", w * 0.5, h * 0.58);
 } else if (idx === 3) {
 if (!truth) {
 ctx.fillStyle = "#e0f2fe";
 ctx.font = "800 40px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("3_", w * 0.5, h * 0.4);
 drawLabel(ctx, "Drop the zero?", w * 0.5, h * 0.55, { h: 22 });
 } else {
 drawPlaceChart(ctx, w * 0.5, h * 0.38, 3, 0);
 for (let i = 0; i < 3; i++) drawRod(ctx, w * 0.3 + i * 28, h * 0.58, 0.55);
 }
 } else {
 // everyday transfer
 ctx.fillStyle = "#fef3c7";
 roundRect(ctx, w * 0.18, h * 0.32, 70, 44, 8);
 ctx.fill();
 ctx.fillStyle = "#fbbf24";
 roundRect(ctx, w * 0.42, h * 0.34, 50, 30, 6);
 ctx.fill();
 ctx.fillStyle = "#14532d";
 roundRect(ctx, w * 0.62, h * 0.32, 70, 44, 8);
 ctx.fill();
 ctx.fillStyle = truth ? "#e0f2fe" : "#fca5a5";
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("eggs", w * 0.18 + 35, h * 0.36);
 ctx.fillText("10৳", w * 0.42 + 25, h * 0.38);
 ctx.fillStyle = "#86efac";
 ctx.fillText("score", w * 0.62 + 35, h * 0.36);
 drawLabel(ctx, truth ? "Same place idea outside class" : "Only blocks?", w * 0.5, h * 0.55, { h: 22 });
 }
 ctx.fillStyle = truth ? "rgba(56,189,248,0.2)" : "rgba(248,113,113,0.18)";
 roundRect(ctx, w * 0.1, h * 0.66, w * 0.8, 48, 12);
 ctx.fill();
 drawLabel(ctx, truth ? m.truth : `Myth: ${m.claim}`, w * 0.5, h * 0.7, {
 h: 36,
 font: "700 12px Segoe UI",
 maxW: w * 0.76,
 });
 drawLabel(ctx, `Myth ${idx + 1} / 5 · Tap to flip`, w * 0.5, layout.labelY);
 setHitRegions([
 { id: "card", shape: "rect", x: w * 0.5, y: h * 0.48, w: w * 0.8, h: h * 0.5, meta: { action: "flip" } },
 ]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("numDrill", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription(labState.prompt || "Number drill");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const prompt = labState.prompt || "Number Sense drill";
 const tens = labState.tens ?? 3;
 const ones = labState.ones ?? 1;
 drawBackdrop();
 drawLabel(ctx, prompt, w * 0.5, h * 0.16, {
 h: 32,
 font: "700 16px Segoe UI",
 });
 drawPlaceChart(ctx, w * 0.5, h * 0.36, tens, ones);
 // Prompt-aware props
 const p = String(prompt).toLowerCase();
 if (p.includes("taka")) {
 ctx.fillStyle = "#fbbf24";
 roundRect(ctx, w * 0.42, h * 0.55, 70, 40, 8);
 ctx.fill();
 ctx.fillStyle = "#78350f";
 ctx.font = "800 16px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("10৳", w * 0.5, h * 0.58);
 } else if (p.includes("egg")) {
 ctx.fillStyle = "#fef3c7";
 roundRect(ctx, w * 0.35, h * 0.54, 120, 50, 8);
 ctx.fill();
 for (let i = 0; i < Math.min(10, tens * 10 + ones); i++) {
 ctx.fillStyle = "#fde68a";
 ctx.beginPath();
 ctx.ellipse(w * 0.42 + (i % 5) * 16, h * 0.6 + Math.floor(i / 5) * 14, 6, 5, 0, 0, Math.PI * 2);
 ctx.fill();
 }
 } else if (p.includes("rod")) {
 for (let i = 0; i < Math.max(1, tens); i++) drawRod(ctx, w * 0.35 + i * 30, h * 0.6, 0.65);
 } else if (p.includes("vs") || p.includes("23")) {
 drawPlaceChart(ctx, w * 0.28, h * 0.58, 2, 3);
 drawPlaceChart(ctx, w * 0.72, h * 0.58, 3, 2);
 } else {
 for (let i = 0; i < Math.min(9, tens); i++) drawRod(ctx, w * 0.22 + i * 26, h * 0.6, 0.45);
 for (let i = 0; i < Math.min(9, ones); i++) drawCube(ctx, w * 0.55 + (i % 5) * 22, h * 0.56 + Math.floor(i / 5) * 24, 0.75);
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("numMastery", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Number Scout mastery.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const locked = labState.masteryStep || 0;
 drawBackdrop();
 ["Meet", "Sort", "Lab", "Rule", "Myth", "Scout"].forEach((label, i) => {
 const x = w * 0.1 + i * (w * 0.14);
 ctx.fillStyle = i < locked ? "#38bdf8" : "rgba(148,163,184,0.35)";
 roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8);
 ctx.fill();
 ctx.fillStyle = i < locked ? "#0c4a6e" : "#64748b";
 ctx.font = "600 10px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(label, x, h * 0.78);
 });
 // Showcase: 2 tens + 3 ones = 23 + Number Scout banner
 drawRod(ctx, w * 0.28, h * 0.4, 0.75);
 drawRod(ctx, w * 0.36, h * 0.4, 0.75);
 for (let i = 0; i < 3; i++) drawCube(ctx, w * 0.48 + i * 24, h * 0.42, 1);
 drawPlaceChart(ctx, w * 0.78, h * 0.38, 2, 3);
 ctx.fillStyle = "rgba(56,189,248,0.28)";
 roundRect(ctx, w * 0.28, h * 0.58, w * 0.44, 40, 12);
 ctx.fill();
 ctx.strokeStyle = "#38bdf8";
 ctx.lineWidth = 2;
 ctx.stroke();
 ctx.fillStyle = "#e0f2fe";
 ctx.font = "800 18px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("🔢 Number Scout", w * 0.5, h * 0.6);
 drawLabel(ctx, "2 tens + 3 ones = 23 · place names the value", w * 0.5, layout.labelY, {
 h: 28,
 font: "700 13px Segoe UI",
 });
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });
}
