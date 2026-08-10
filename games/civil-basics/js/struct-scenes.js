/**
 * Civil Basics - Mission 1: Strong Structures (unique canvas scenes)
 */
import { labState, pulseFailFeedback, pulseSuccessFeedback } from "./lab-state.js";
import { sortSlotPositions, getActiveSession } from "./activity-controller.js";

const ACCENT = "#a8a29e";

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
 const tw = Math.min(ctx.measureText(text).width + 24, opts.maxW || 560);
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

function drawTriangle(ctx, x, y, s, strong) {
 ctx.strokeStyle = strong ? "#22c55e" : "#f97316";
 ctx.lineWidth = 4;
 ctx.beginPath();
 ctx.moveTo(x, y - s);
 ctx.lineTo(x - s * 0.9, y + s * 0.7);
 ctx.lineTo(x + s * 0.9, y + s * 0.7);
 ctx.closePath();
 ctx.stroke();
 if (strong) {
 ctx.beginPath();
 ctx.moveTo(x, y - s);
 ctx.lineTo(x, y + s * 0.7);
 ctx.stroke();
 }
}
function drawBase(ctx, x, y, w, good) {
 ctx.fillStyle = good ? "#78716c" : "#57534e";
 roundRect(ctx, x - w / 2, y, w, 14, 4);
 ctx.fill();
 ctx.strokeStyle = good ? "#22c55e" : "#ef4444";
 ctx.lineWidth = 2;
 ctx.stroke();
}
function drawLoadBlock(ctx, x, y, wobble = 0) {
 ctx.fillStyle = "#fbbf24";
 ctx.fillRect(x - 12, y + wobble, 24, 22);
 ctx.fillStyle = "#e2e8f0";
 ctx.font = "700 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("load", x, y - 8 + wobble);
}
function drawLoadArrow(ctx, x1, y1, x2, y2, color = "#fbbf24") {
 ctx.strokeStyle = color;
 ctx.fillStyle = color;
 ctx.lineWidth = 2.5;
 ctx.beginPath();
 ctx.moveTo(x1, y1);
 ctx.lineTo(x2, y2);
 ctx.stroke();
 const ang = Math.atan2(y2 - y1, x2 - x1);
 ctx.beginPath();
 ctx.moveTo(x2, y2);
 ctx.lineTo(x2 - 10 * Math.cos(ang - 0.4), y2 - 10 * Math.sin(ang - 0.4));
 ctx.lineTo(x2 - 10 * Math.cos(ang + 0.4), y2 - 10 * Math.sin(ang + 0.4));
 ctx.closePath();
 ctx.fill();
}

/** Rectangle frame that gains braces + wider base with heat (0-1). */
function drawBracedFrame(ctx, x, y, heat, opts = {}) {
 const mode = opts.mode || "intro";
 const strong = heat >= 0.55;
 const baseW = 50 + heat * (mode === "truss" ? 130 : 100);
 const lean = (1 - heat) * 10;
 drawBase(ctx, x, y + 48, baseW, strong);

 ctx.strokeStyle = strong ? "#a8a29e" : "#ef4444";
 ctx.lineWidth = 5;
 ctx.beginPath();
 ctx.moveTo(x - 70 + lean, y + 48);
 ctx.lineTo(x - 55, y - 30);
 ctx.lineTo(x + 55, y - 30);
 ctx.lineTo(x + 70 - lean, y + 48);
 ctx.stroke();
 ctx.beginPath();
 ctx.moveTo(x - 55, y - 30);
 ctx.lineTo(x + 55, y - 30);
 ctx.stroke();

 if (heat >= 0.35) {
 ctx.strokeStyle = "#22c55e";
 ctx.lineWidth = 3.5;
 ctx.beginPath();
 ctx.moveTo(x - 55, y - 30);
 ctx.lineTo(x, y + 48);
 ctx.lineTo(x + 55, y - 30);
 ctx.stroke();
 }
 if (heat >= 0.55 || mode === "truss") {
 drawTriangle(ctx, x - 28, y + 8, 22, strong);
 drawTriangle(ctx, x + 28, y + 8, 22, strong);
 }
 if (mode === "truss" && heat >= 0.7) {
 ctx.strokeStyle = "#38bdf8";
 ctx.lineWidth = 2.5;
 ctx.setLineDash([4, 4]);
 ctx.beginPath();
 ctx.moveTo(x, y - 48);
 ctx.lineTo(x - 40, y + 20);
 ctx.lineTo(x, y + 48);
 ctx.lineTo(x + 40, y + 20);
 ctx.lineTo(x, y - 48);
 ctx.stroke();
 ctx.setLineDash([]);
 drawLoadArrow(ctx, x, y - 52, x - 36, y + 18, "#38bdf8");
 drawLoadArrow(ctx, x, y - 52, x + 36, y + 18, "#38bdf8");
 drawLoadArrow(ctx, x - 36, y + 18, x, y + 48, "#22c55e");
 drawLoadArrow(ctx, x + 36, y + 18, x, y + 48, "#22c55e");
 }

 const wobble = strong ? 0 : Math.sin(performance.now() / 180) * 4;
 drawLoadBlock(ctx, x, y - 72, wobble);
}

function drawShelfBracket(ctx, x, y, braced) {
 ctx.fillStyle = "#78716c";
 roundRect(ctx, x - 8, y - 70, 16, 90, 3);
 ctx.fill();
 ctx.fillStyle = "#a8a29e";
 roundRect(ctx, x - 8, y - 40, 70, 10, 3);
 ctx.fill();
 if (braced) {
 ctx.strokeStyle = "#22c55e";
 ctx.lineWidth = 4;
 ctx.beginPath();
 ctx.moveTo(x + 8, y - 30);
 ctx.lineTo(x + 50, y - 40);
 ctx.stroke();
 } else {
 ctx.strokeStyle = "#ef4444";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.moveTo(x + 8, y - 30);
 ctx.lineTo(x + 55, y - 55);
 ctx.stroke();
 }
 ctx.fillStyle = "#38bdf8";
 roundRect(ctx, x + 12, y - 58, 36, 14, 2);
 ctx.fill();
}

function drawSchoolModel(ctx, x, y) {
 drawTriangle(ctx, x - 30, y, 26, true);
 drawTriangle(ctx, x + 30, y, 26, true);
 drawBase(ctx, x, y + 36, 120, true);
 ctx.strokeStyle = "#a8a29e";
 ctx.lineWidth = 4;
 ctx.beginPath();
 ctx.moveTo(x - 54, y + 18);
 ctx.lineTo(x + 54, y + 18);
 ctx.stroke();
 ctx.fillStyle = "#fbbf24";
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("class model", x, y - 50);
}

function drawStreetBridge(ctx, x, y) {
 drawBase(ctx, x - 90, y + 40, 40, true);
 drawBase(ctx, x + 90, y + 40, 40, true);
 ctx.strokeStyle = "#94a3b8";
 ctx.lineWidth = 6;
 ctx.beginPath();
 ctx.moveTo(x - 100, y + 20);
 ctx.lineTo(x + 100, y + 20);
 ctx.stroke();
 for (let i = -2; i <= 2; i++) {
 drawTriangle(ctx, x + i * 36, y - 4, 18, true);
 }
 drawLoadBlock(ctx, x, y - 55, 0);
}

function drawWarehouseRack(ctx, x, y, braced) {
 ctx.strokeStyle = "#64748b";
 ctx.lineWidth = 4;
 ctx.strokeRect(x - 50, y - 60, 100, 100);
 ctx.beginPath();
 ctx.moveTo(x - 50, y - 20);
 ctx.lineTo(x + 50, y - 20);
 ctx.moveTo(x - 50, y + 20);
 ctx.lineTo(x + 50, y + 20);
 ctx.stroke();
 if (braced) {
 ctx.strokeStyle = "#22c55e";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.moveTo(x - 50, y - 60);
 ctx.lineTo(x + 50, y + 40);
 ctx.moveTo(x + 50, y - 60);
 ctx.lineTo(x - 50, y + 40);
 ctx.stroke();
 }
 ctx.fillStyle = "#f97316";
 roundRect(ctx, x - 30, y - 50, 60, 18, 3);
 ctx.fill();
}

function drawLabCompare(ctx, x, y) {
 // triangle vs rectangle side by side
 drawTriangle(ctx, x - 70, y, 32, true);
 drawBase(ctx, x - 70, y + 40, 90, true);
 ctx.strokeStyle = "#ef4444";
 ctx.lineWidth = 3;
 ctx.strokeRect(x + 40, y - 40, 50, 80);
 drawBase(ctx, x + 65, y + 40, 40, false);
 ctx.fillStyle = "#e2e8f0";
 ctx.font = "600 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("triangle OK", x - 70, y - 55);
 ctx.fillText("rack leans", x + 65, y - 55);
}

export function registerStructScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("structMeet", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions } = api;
 labState.phase = opts.phase || labState.phase || "desk";
 setDescription("Strong Structures - triangles and bases.");
 const props = { left: { x: 0, y: 0 }, right: { x: 0, y: 0 } };
 let inited = false;
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const live = labState.phase || opts.phase || "desk";
 drawBackdrop();
 if (!inited) {
 props.left.x = w * 0.28;
 props.left.y = h * 0.42;
 props.right.x = w * 0.72;
 props.right.y = h * 0.42;
 inited = true;
 }

 if (live === "desk") {
 drawTriangle(ctx, props.left.x, props.left.y, 36, false);
 drawBase(ctx, props.left.x, props.left.y + 40, 50, false);
 ctx.strokeStyle = "#ef4444";
 ctx.lineWidth = 3;
 ctx.strokeRect(props.right.x - 12, props.right.y - 50, 24, 90);
 drawBase(ctx, props.right.x, props.right.y + 40, 36, false);
 drawLoadBlock(ctx, props.right.x, props.right.y - 70, Math.sin(performance.now() / 160) * 5);
 } else if (live === "glow" || live === "brace") {
 drawTriangle(ctx, props.left.x, props.left.y, 36, true);
 drawBase(ctx, props.left.x, props.left.y + 40, 110, true);
 drawLoadArrow(ctx, props.left.x, props.left.y - 50, props.left.x - 28, props.left.y + 30, "#38bdf8");
 drawLoadArrow(ctx, props.left.x, props.left.y - 50, props.left.x + 28, props.left.y + 30, "#38bdf8");
 drawLoadArrow(ctx, props.left.x - 28, props.left.y + 30, props.left.x, props.left.y + 48, "#22c55e");
 drawLoadArrow(ctx, props.left.x + 28, props.left.y + 30, props.left.x, props.left.y + 48, "#22c55e");
 drawLoadBlock(ctx, props.left.x, props.left.y - 72, 0);
 ctx.strokeStyle = "#64748b";
 ctx.lineWidth = 3;
 ctx.strokeRect(props.right.x - 12, props.right.y - 50, 24, 90);
 drawBase(ctx, props.right.x, props.right.y + 40, 40, false);
 } else if (live === "base") {
 drawBase(ctx, w * 0.5, h * 0.55, 160, true);
 ctx.strokeStyle = "#a8a29e";
 ctx.lineWidth = 5;
 ctx.strokeRect(w * 0.5 - 18, h * 0.55 - 100, 36, 100);
 drawLabel(ctx, "Wide base first", w * 0.5, h * 0.28, { h: 24, font: "700 13px Segoe UI" });
 } else if (live === "path") {
 drawBracedFrame(ctx, w * 0.5, h * 0.42, 0.85, { mode: "truss" });
 } else if (live === "hold") {
 drawStreetBridge(ctx, w * 0.5, h * 0.42);
 drawLabel(ctx, "Shape holds - load reaches the ground", w * 0.5, h * 0.72, {
 h: 24,
 font: "600 12px Segoe UI",
 border: "#22c55e",
 });
 } else {
 // settle
 drawStreetBridge(ctx, w * 0.5, h * 0.4);
 drawTriangle(ctx, w * 0.18, h * 0.55, 22, true);
 drawBase(ctx, w * 0.18, h * 0.55 + 28, 70, true);
 }

 const tips = {
 desk: "Drag frames - triangle vs tall skinny tower",
 glow: "Triangles + wide base share the load",
 brace: "Braces lock the shape so it cannot rack",
 settle: "Strong shapes keep bridges and towers safe",
 base: "Set a wide stable base",
 path: "Load travels down the members",
 hold: "Shape holds instead of tipping",
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
 h: 100,
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

 arena.registerScene("structSort", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } = api;
 setDescription("Sort strong / weak / not");
 const chips = [
 { id: "tri", short: "Triangle", color: 0x22c55e },
 { id: "wide", short: "Wide base", color: 0x38bdf8 },
 { id: "brace", short: "Cross brace", color: 0xfbbf24 },
 { id: "tall", short: "Tall skinny", color: 0xf97316 },
 { id: "nbrace", short: "No brace", color: 0xef4444 },
 { id: "tip", short: "Tippy stack", color: 0xa78bfa },
 { id: "cloud", short: "Cloud prop", color: 0x94a3b8 },
 { id: "song", short: "Only a song", color: 0x78716c },
 ];
 const accept = {
 strong: ["tri", "wide", "brace"],
 weak: ["tall", "nbrace", "tip"],
 not: ["cloud", "song"],
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
 { id: "strong", label: "Strong idea", x: w * 0.02, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#22c55e" },
 { id: "weak", label: "Weak idea", x: w * 0.34, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#f97316" },
 { id: "not", label: "Not structure", x: w * 0.66, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#94a3b8" },
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
 const byZone = { strong: [], weak: [], not: [] };
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
 drawLabel(ctx, "Sort strong / weak / not", w * 0.5, layout.labelY);
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("structLab", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions, setIntentHandler } = api;
 setDescription("Dial strength - watch braces and base grow under load.");
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
 const mode = opts.labMode || "intro";
 drawBackdrop();
 drawBracedFrame(ctx, w * 0.5, h * 0.4, heat, { mode });
 const hx = w * 0.2 + heat * w * 0.6;
 ctx.fillStyle = "#a8a29e";
 ctx.beginPath();
 ctx.arc(hx, h * 0.72, 14, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "#fbbf24";
 ctx.lineWidth = 2;
 ctx.stroke();
 let tip = "Drag to brace and widen the base";
 if (heat >= 0.7) tip = mode === "truss" ? "Truss path clear - load reaches ground" : "Strong - triangles + base hold the load";
 else if (heat >= 0.45) tip = "Braces locking - less lean";
 drawLabel(ctx, tip, w * 0.5, layout.labelY);
 setHitRegions([{ id: "h", shape: "rect", x: hx, y: h * 0.72, w: 48, h: 48, meta: { action: "stretch" } }]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("structRule", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Structure rule - desk → members → STRUCTURE banner");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const prog = labState.tokenProgress || 0;
 const scale = labState.scale ?? 0;
 drawBackdrop();

 if (scale < 0.33) {
 // Everyday desk: shelf + tippy tower
 drawShelfBracket(ctx, w * 0.28, h * 0.48, false);
 ctx.strokeStyle = "#ef4444";
 ctx.lineWidth = 3;
 ctx.strokeRect(w * 0.65 - 10, h * 0.35, 20, 90);
 drawBase(ctx, w * 0.65, h * 0.55, 32, false);
 drawLabel(ctx, "Everyday: shelf & tippy tower", w * 0.5, h * 0.22, { h: 24, font: "600 12px Segoe UI" });
 } else if (scale < 0.66) {
 drawBracedFrame(ctx, w * 0.5, h * 0.4, 0.8, { mode: "truss" });
 drawLabel(ctx, "Members: triangles + wide base", w * 0.5, h * 0.22, { h: 24, font: "600 12px Segoe UI" });
 } else {
 drawStreetBridge(ctx, w * 0.5, h * 0.38);
 ctx.fillStyle = "rgba(34,197,94,0.25)";
 roundRect(ctx, w * 0.2, h * 0.58, w * 0.6, 48, 12);
 ctx.fill();
 ctx.strokeStyle = "#22c55e";
 ctx.lineWidth = 2;
 ctx.stroke();
 ctx.fillStyle = "#e2e8f0";
 ctx.font = "800 18px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("STRUCTURE", w * 0.5, h * 0.605);
 ctx.font = "600 12px Segoe UI";
 ctx.fillText("Triangles + wide base carry load", w * 0.5, h * 0.635);
 }

 if (prog > 0 && scale < 0.1) {
 ["Triangles", "+", "wide base", "carry load"].forEach((label, i) => {
 const x = w * 0.14 + i * (w * 0.2);
 ctx.fillStyle = i < prog ? "rgba(74,222,128,0.4)" : "rgba(15,23,42,0.9)";
 roundRect(ctx, x - 48, h * 0.78 - 18, 96, 36, 10);
 ctx.fill();
 ctx.fillStyle = "#e2e8f0";
 ctx.font = "700 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(label, x, h * 0.78);
 });
 }
 drawLabel(ctx, "Structure rule", w * 0.5, layout.labelY);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("structStretch", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const modes = [
 { id: "home", label: "Home" },
 { id: "school", label: "School" },
 { id: "street", label: "Street" },
 { id: "shop", label: "Shop" },
 { id: "lab", label: "Lab" },
 ];
 setDescription("Same structure idea in places you know.");
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
 ctx.fillStyle = m.id === mode ? "rgba(56,189,248,0.45)" : "#1e293b";
 roundRect(ctx, x - 36, layout.deskTop - 36, 72, 48, 10);
 ctx.fill();
 ctx.fillStyle = "#e2e8f0";
 ctx.font = "600 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(m.label, x, layout.deskTop - 10);
 hits.push({ id: m.id, shape: "rect", x, y: layout.deskTop - 12, w: 72, h: 48, meta: { mode: m.id } });
 });

 const cy = h * 0.4;
 if (mode === "home") drawShelfBracket(ctx, w * 0.45, cy, true);
 else if (mode === "school") drawSchoolModel(ctx, w * 0.5, cy);
 else if (mode === "street") drawStreetBridge(ctx, w * 0.5, cy);
 else if (mode === "shop") drawWarehouseRack(ctx, w * 0.5, cy, true);
 else drawLabCompare(ctx, w * 0.5, cy);

 const captions = {
 home: "Shelf brackets: diagonal brace + wall = mini-truss",
 school: "Science-class bridge models love triangles",
 street: "Road bridges: trusses carry deck load to piers",
 shop: "Warehouse racks need X-bracing against lean",
 lab: "Lab compare: triangle holds; skinny rectangle racks",
 };
 drawLabel(ctx, captions[mode] || mode, w * 0.5, layout.labelY);
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("structMyth", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const myths = [
 { claim: "Taller is always stronger", truth: "Tall skinny without braces can tip or buckle", kind: "tall" },
 { claim: "Triangles are only for art class", truth: "Triangles lock shapes and carry load well", kind: "art" },
 { claim: "Base width does not matter", truth: "A wider base resists tipping", kind: "base" },
 { claim: "Braces are optional decoration", truth: "Braces share and redirect load paths", kind: "brace" },
 { claim: "Only concrete matters, not shape", truth: "Shape and load path matter as much as material", kind: "material" },
 ];
 setDescription("Bust structure myths - canvas shows tip, brace, base, and load path.");
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
 ctx.fillStyle = phase === "truth" ? "rgba(74,222,128,0.18)" : "rgba(248,113,113,0.16)";
 roundRect(ctx, w * 0.1, h * 0.08, w * 0.8, 44, 12);
 ctx.fill();
 drawLabel(ctx, phase === "truth" ? m.truth : "Myth: " + m.claim, w * 0.5, h * 0.1 + 10, {
 h: 28,
 font: "700 13px Segoe UI",
 });

 const cx = w * 0.5;
 const cy = h * 0.42;

 if (m.kind === "tall") {
 if (phase === "claim") {
 ctx.strokeStyle = "#f97316";
 ctx.lineWidth = 4;
 ctx.strokeRect(cx - 10, cy - 70, 20, 120);
 drawBase(ctx, cx, cy + 50, 28, false);
 drawLoadBlock(ctx, cx, cy - 95, Math.sin(performance.now() / 140) * 6);
 drawLabel(ctx, "Claim: taller = stronger?", cx, cy + 80, { h: 22, font: "600 12px Segoe UI" });
 } else {
 drawBracedFrame(ctx, cx, cy, 0.85, { mode: "truss" });
 drawLabel(ctx, "Truth: braces + base beat bare height", cx, cy + 90, { h: 22, font: "600 12px Segoe UI", border: "#22c55e" });
 }
 } else if (m.kind === "art") {
 if (phase === "claim") {
 ctx.strokeStyle = "#a78bfa";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.moveTo(cx, cy - 40);
 ctx.lineTo(cx - 40, cy + 30);
 ctx.lineTo(cx + 40, cy + 30);
 ctx.closePath();
 ctx.stroke();
 ctx.fillStyle = "#e2e8f0";
 ctx.font = "600 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("art triangle?", cx, cy + 55);
 } else {
 drawTriangle(ctx, cx, cy, 40, true);
 drawBase(ctx, cx, cy + 45, 100, true);
 drawLoadArrow(ctx, cx, cy - 55, cx, cy + 45, "#38bdf8");
 drawLabel(ctx, "Truth: locked shape carries load", cx, cy + 80, { h: 22, font: "600 12px Segoe UI", border: "#22c55e" });
 }
 } else if (m.kind === "base") {
 if (phase === "claim") {
 ctx.strokeStyle = "#ef4444";
 ctx.lineWidth = 4;
 ctx.strokeRect(cx - 14, cy - 60, 28, 100);
 drawBase(ctx, cx, cy + 40, 30, false);
 const tip = Math.sin(performance.now() / 200) * 12;
 ctx.save();
 ctx.translate(cx, cy + 40);
 ctx.rotate(tip * 0.02);
 ctx.translate(-cx, -(cy + 40));
 ctx.strokeStyle = "rgba(248,113,113,0.6)";
 ctx.strokeRect(cx - 14, cy - 60, 28, 100);
 ctx.restore();
 } else {
 ctx.strokeStyle = "#22c55e";
 ctx.lineWidth = 4;
 ctx.strokeRect(cx - 14, cy - 60, 28, 100);
 drawBase(ctx, cx, cy + 40, 140, true);
 drawLabel(ctx, "Truth: wide base resists tipping", cx, cy + 80, { h: 22, font: "600 12px Segoe UI", border: "#22c55e" });
 }
 } else if (m.kind === "brace") {
 if (phase === "claim") {
 drawWarehouseRack(ctx, cx, cy, false);
 drawLabel(ctx, "Claim: braces are just decoration?", cx, cy + 80, { h: 22, font: "600 12px Segoe UI" });
 } else {
 drawWarehouseRack(ctx, cx, cy, true);
 drawLoadArrow(ctx, cx - 40, cy - 50, cx + 40, cy + 30, "#38bdf8");
 drawLabel(ctx, "Truth: braces redirect the load path", cx, cy + 80, { h: 22, font: "600 12px Segoe UI", border: "#22c55e" });
 }
 } else {
 // material
 if (phase === "claim") {
 ctx.fillStyle = "#78716c";
 roundRect(ctx, cx - 50, cy - 40, 100, 70, 8);
 ctx.fill();
 ctx.fillStyle = "#e2e8f0";
 ctx.font = "700 14px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("CONCRETE", cx, cy);
 drawLabel(ctx, "Claim: only material matters?", cx, cy + 60, { h: 22, font: "600 12px Segoe UI" });
 } else {
 drawLabCompare(ctx, cx, cy);
 drawLabel(ctx, "Truth: shape & path matter too", cx, cy + 80, { h: 22, font: "600 12px Segoe UI", border: "#22c55e" });
 }
 }

 drawLabel(ctx, "Myth " + (idx + 1) + " / 5 - Tap card or Bust it", w * 0.5, layout.labelY);
 setHitRegions([{ id: "card", shape: "rect", x: w * 0.5, y: h * 0.42, w: w * 0.76, h: h * 0.5, meta: { action: "flip" } }]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("structDrill", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription(labState.prompt || "Structure drill");
 function drillVisual(prompt) {
 const p = (prompt || "").toLowerCase();
 if (p.includes("triangle")) return "triangle";
 if (p.includes("base")) return "base";
 if (p.includes("tall")) return "tall";
 if (p.includes("brace")) return "brace";
 if (p.includes("cloud")) return "cloud";
 if (p.includes("weak") || p.includes("no brace")) return "weak";
 if (p.includes("load") || p.includes("path")) return "path";
 if (p.includes("shelf") || p.includes("home")) return "shelf";
 return "bridge";
 }
 setTick(() => {
 const w = api.width;
 const h = api.height;
 drawBackdrop();
 drawLabel(ctx, labState.prompt || "Structure drill", w * 0.5, h * 0.12, { h: 32, font: "700 16px Segoe UI" });
 const kind = drillVisual(labState.prompt);
 const cx = w * 0.5;
 const cy = h * 0.48;
 if (kind === "triangle") {
 drawTriangle(ctx, cx, cy, 42, true);
 drawBase(ctx, cx, cy + 45, 100, true);
 } else if (kind === "base") {
 ctx.strokeStyle = "#a8a29e";
 ctx.lineWidth = 4;
 ctx.strokeRect(cx - 14, cy - 50, 28, 90);
 drawBase(ctx, cx, cy + 40, 150, true);
 } else if (kind === "tall") {
 ctx.strokeStyle = "#ef4444";
 ctx.lineWidth = 3;
 ctx.strokeRect(cx - 10, cy - 60, 20, 110);
 drawBase(ctx, cx, cy + 50, 30, false);
 } else if (kind === "brace" || kind === "weak") {
 drawWarehouseRack(ctx, cx, cy, kind === "brace");
 } else if (kind === "cloud") {
 ctx.fillStyle = "rgba(148,163,184,0.5)";
 ctx.beginPath();
 ctx.arc(cx - 20, cy, 28, 0, Math.PI * 2);
 ctx.arc(cx + 10, cy - 10, 32, 0, Math.PI * 2);
 ctx.arc(cx + 30, cy + 8, 24, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#e2e8f0";
 ctx.font = "600 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("not a structure idea", cx, cy + 55);
 } else if (kind === "path") {
 drawBracedFrame(ctx, cx, cy, 0.9, { mode: "truss" });
 } else if (kind === "shelf") {
 drawShelfBracket(ctx, cx - 20, cy, true);
 } else {
 drawStreetBridge(ctx, cx, cy);
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("structMastery", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Structure Scout mastery - apply triangles & load.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const locked = labState.masteryStep || 0;
 drawBackdrop();

 // Showcase trio
 drawShelfBracket(ctx, w * 0.18, h * 0.4, true);
 drawSchoolModel(ctx, w * 0.5, h * 0.38);
 drawStreetBridge(ctx, w * 0.78, h * 0.4);

 ctx.fillStyle = "rgba(34,197,94,0.22)";
 roundRect(ctx, w * 0.22, h * 0.58, w * 0.56, 44, 12);
 ctx.fill();
 ctx.strokeStyle = "#22c55e";
 ctx.lineWidth = 2;
 roundRect(ctx, w * 0.22, h * 0.58, w * 0.56, 44, 12);
 ctx.stroke();
 ctx.fillStyle = "#e2e8f0";
 ctx.font = "800 16px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("Structure Scout", w * 0.5, h * 0.6);
 ctx.font = "600 11px Segoe UI";
 ctx.fillText("Triangles + wide base carry load", w * 0.5, h * 0.625);

 ["Meet", "Sort", "Lab", "Rule", "Myth", "Win"].forEach((label, i) => {
 const x = w * 0.1 + i * (w * 0.14);
 ctx.fillStyle = i < locked ? "#22c55e" : "rgba(148,163,184,0.35)";
 roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8);
 ctx.fill();
 ctx.fillStyle = "#0f172a";
 ctx.font = "600 10px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(label, x, h * 0.78);
 });
 drawLabel(ctx, "Structure Scout!", w * 0.5, layout.labelY);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });
}
