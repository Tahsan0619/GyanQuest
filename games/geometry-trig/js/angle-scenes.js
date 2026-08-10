/**
 * Geometry \u00b7 Mission 2: Angle Adventures - Canvas 2D scenes (Tiny Bits depth).
 * Rays, vertex, acute/right/obtuse, degrees, BD angle stretch.
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
 ctx.fillStyle = opts.bg || "rgba(15, 23, 42, 0.92)";
 roundRect(ctx, x - tw / 2, y - bh / 2, tw, bh, 10);
 ctx.fill();
 ctx.strokeStyle = opts.border || "rgba(147,197,253,0.55)";
 ctx.lineWidth = 1.4;
 ctx.stroke();
 ctx.fillStyle = opts.color || "#dbeafe";
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
 ctx.fillStyle = `rgba(96,165,250,${Math.max(0, (until - performance.now()) / 380) * 0.22})`;
 ctx.fillRect(0, 0, w, h);
}

function kindFromDeg(deg) {
 if (deg < 88) return "acute";
 if (deg <= 92) return "right";
 return "obtuse";
}

function drawAngle(ctx, x, y, deg, highlight) {
 const rad = (deg * Math.PI) / 180;
 const len = 90;
 ctx.strokeStyle = "#93c5fd";
 ctx.lineWidth = 5;
 ctx.lineCap = "round";
 ctx.beginPath();
 ctx.moveTo(x, y);
 ctx.lineTo(x + len, y);
 ctx.stroke();
 ctx.beginPath();
 ctx.moveTo(x, y);
 ctx.lineTo(x + Math.cos(-rad) * len, y + Math.sin(-rad) * len);
 ctx.stroke();
 ctx.fillStyle = highlight ? "rgba(96,165,250,0.35)" : "rgba(96,165,250,0.18)";
 ctx.beginPath();
 ctx.moveTo(x, y);
 ctx.arc(x, y, 36, 0, -rad, true);
 ctx.closePath();
 ctx.fill();
 if (Math.abs(deg - 90) < 3) {
 ctx.strokeStyle = "#60a5fa";
 ctx.lineWidth = 2;
 ctx.strokeRect(x + 8, y - 22, 18, 18);
 }
 const kind = kindFromDeg(deg);
 ctx.fillStyle = "#dbeafe";
 ctx.font = "700 13px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(Math.round(deg) + " deg \u00b7 " + kind, x + 40, y + 48);
}

export function registerAngleScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("angleMeet", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions } = api;
 labState.phase = opts.phase || labState.phase || "desk";
 if (labState.angleDeg == null) labState.angleDeg = 45;
 setDescription("Angle Adventures - turns between two rays.");
 const props = { a: { x: 0, y: 0 }, b: { x: 0, y: 0 }, c: { x: 0, y: 0 } };
 let inited = false;
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout;
 const live = labState.phase || "desk";
 drawBackdrop();
 if (!inited) {
 props.a.x = w * 0.2; props.a.y = h * 0.5;
 props.b.x = w * 0.45; props.b.y = h * 0.5;
 props.c.x = w * 0.7; props.c.y = h * 0.5;
 inited = true;
 }
 ctx.fillStyle = "#1e3a8a";
 roundRect(ctx, w * 0.08, layout.deskTop - 8, w * 0.84, 18, 8);
 ctx.fill();
 if (live === "desk") {
 drawAngle(ctx, props.a.x, props.a.y, 40, false);
 drawAngle(ctx, props.b.x, props.b.y, 90, false);
 drawLabel(ctx, "Two rays meet at a vertex", w * 0.5, layout.labelY);
 } else if (live === "glow") {
 drawAngle(ctx, w * 0.22, h * 0.48, 35, true);
 drawAngle(ctx, w * 0.48, h * 0.48, 90, true);
 drawAngle(ctx, w * 0.72, h * 0.48, 130, true);
 drawLabel(ctx, "Acute \u00b7 Right \u00b7 Obtuse", w * 0.5, layout.labelY);
 } else {
 drawAngle(ctx, w * 0.42, h * 0.48, 90, true);
 drawLabel(ctx, "Degrees measure the turn - 90 is a square corner", w * 0.5, layout.labelY);
 }
 const hits = [
 { id: "a", shape: "rect", x: props.a.x + 40, y: props.a.y - 20, w: 120, h: 100, meta: { propId: "a" },
 onDrag(pt) { props.a.x = Math.max(40, Math.min(w - 120, pt.x - 40)); props.a.y = Math.max(80, Math.min(layout.deskTop, pt.y)); } },
 { id: "b", shape: "rect", x: props.b.x + 40, y: props.b.y - 20, w: 120, h: 100, meta: { propId: "b" },
 onDrag(pt) { props.b.x = Math.max(40, Math.min(w - 120, pt.x - 40)); props.b.y = Math.max(80, Math.min(layout.deskTop, pt.y)); } },
 ];
 setHitRegions(hits);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("angleSort", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } = api;
 setDescription("Sort: acute, right, obtuse, or not an angle.");
 const chips = [
 { id: "slice", short: "Sharp", color: 0x60a5fa },
 { id: "book", short: "Book", color: 0x3b82f6 },
 { id: "door", short: "Door", color: 0xf59e0b },
 { id: "clock", short: "1:00", color: 0x38bdf8 },
 { id: "tile", short: "Tile", color: 0x2563eb },
 { id: "roof", short: "Roof", color: 0xfbbf24 },
 { id: "blue", short: "Color", color: 0x94a3b8 },
 { id: "temp", short: "Temp", color: 0x78716c },
 ];
 const accept = {
 acute: ["slice", "clock"],
 right: ["book", "tile"],
 obtuse: ["door", "roof"],
 not: ["blue", "temp"],
 };
 const cardPos = {}; chips.forEach((c) => (cardPos[c.id] = { x: 0, y: 0 }));
 let draggingId = null, lastZones = [];
 function placeChip(chipId, zoneId) {
 const okList = accept[zoneId] || [];
 if (!okList.includes(chipId)) { pulseFailFeedback(400); return false; }
 labState.placed = { ...(labState.placed || {}), [chipId]: zoneId };
 const session = getActiveSession();
 if (session?.dispatch) session.dispatch({ type: "PLACE_CHIP", chipId, zoneId, accept: okList });
 else labState._placedVersion = (labState._placedVersion || 0) + 1;
 pulseSuccessFeedback(220); return true;
 }
 function zoneAt(x, y) {
 for (const z of lastZones) if (x >= z.x && x <= z.x + z.ww && y >= z.y && y <= z.y + z.hh) return z.id;
 return null;
 }
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DOWN" && intent.meta?.chipId) { draggingId = intent.meta.chipId; labState.selectedId = intent.meta.chipId; }
 if (intent.type === "CANVAS_DRAG" && intent.meta?.chipId && cardPos[intent.meta.chipId]) {
 draggingId = intent.meta.chipId; cardPos[intent.meta.chipId].x = intent.x; cardPos[intent.meta.chipId].y = intent.y;
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
 const w = api.width, h = api.height, layout = api.layout;
 drawBackdrop();
 const zoneH = Math.max(100, Math.min(h * 0.28, 130));
 const zoneY = Math.max(layout.labelY + 28, h * 0.09);
 const zones = [
 { id: "acute", label: "Acute (under 90)", x: w * 0.02, y: zoneY, ww: w * 0.23, hh: zoneH, color: "#60a5fa" },
 { id: "right", label: "Right (90)", x: w * 0.26, y: zoneY, ww: w * 0.23, hh: zoneH, color: "#3b82f6" },
 { id: "obtuse", label: "Obtuse (over 90)", x: w * 0.5, y: zoneY, ww: w * 0.23, hh: zoneH, color: "#f59e0b" },
 { id: "not", label: "Not an angle", x: w * 0.74, y: zoneY, ww: w * 0.24, hh: zoneH, color: "#94a3b8" },
 ];
 lastZones = zones;
 const hits = [];
 for (const z of zones) {
 ctx.fillStyle = "rgba(15,23,42,0.75)"; roundRect(ctx, z.x, z.y, z.ww, z.hh, 12); ctx.fill();
 ctx.strokeStyle = z.color; ctx.lineWidth = 2.5; ctx.stroke();
 drawLabel(ctx, z.label, z.x + z.ww / 2, z.y + 16, { h: 20, font: "700 11px Segoe UI" });
 hits.push({ id: "zone-" + z.id, shape: "rect", x: z.x + z.ww / 2, y: z.y + z.hh / 2, w: z.ww, h: z.hh, meta: { zoneId: z.id, accept: accept[z.id] } });
 }
 const placed = labState.placed || {};
 const byZone = { acute: [], right: [], obtuse: [], not: [] };
 chips.forEach((c) => { if (typeof placed[c.id] === "string" && byZone[placed[c.id]]) byZone[placed[c.id]].push(c.id); });
 const bankIds = chips.filter((c) => typeof placed[c.id] !== "string").map((c) => c.id);
 const ease = reducedMotion ? 1 : 0.18;
 chips.forEach((c) => {
 let targetX, targetY;
 const zoneKey = typeof placed[c.id] === "string" ? placed[c.id] : null;
 if (zoneKey && byZone[zoneKey]) {
 const z = zones.find((zz) => zz.id === zoneKey);
 const idx = byZone[zoneKey].indexOf(c.id);
 const slot = sortSlotPositions({ x: z.x, y: z.y + 18, w: z.ww, h: z.hh - 22 }, Math.max(byZone[zoneKey].length, 1), idx);
 targetX = slot.x; targetY = slot.y;
 } else {
 const idx = bankIds.indexOf(c.id);
 targetX = w * 0.14 + (idx % 4) * (w * 0.22);
 targetY = zoneY + zoneH + 36 + Math.floor(idx / 4) * 48;
 }
 const prev = cardPos[c.id];
 if (!prev.x && !prev.y) { prev.x = targetX; prev.y = targetY; }
 if (draggingId !== c.id) { prev.x += (targetX - prev.x) * ease; prev.y += (targetY - prev.y) * ease; }
 ctx.fillStyle = labState.selectedId === c.id ? "rgba(96,165,250,0.4)" : "rgba(15,23,42,0.95)";
 roundRect(ctx, prev.x - 48, prev.y - 16, 96, 32, 8); ctx.fill();
 ctx.strokeStyle = "#" + c.color.toString(16).padStart(6, "0"); ctx.stroke();
 ctx.fillStyle = "#dbeafe"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
 ctx.fillText(c.short, prev.x, prev.y);
 hits.push({ id: c.id, shape: "rect", x: prev.x, y: prev.y, w: 100, h: 36, meta: { chipId: c.id },
 onDrag(pt) { draggingId = c.id; prev.x = Math.max(30, Math.min(w - 30, pt.x)); prev.y = Math.max(30, Math.min(h - 30, pt.y)); } });
 });
 drawLabel(ctx, "Acute \u00b7 Right \u00b7 Obtuse \u00b7 Not", w * 0.5, layout.labelY);
 setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("angleLab", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 setDescription("Open the angle - watch degrees and kind.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
 labState.heat = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
 labState.angleDeg = 20 + labState.heat * 140;
 labState.angleKind = kindFromDeg(labState.angleDeg);
 }
 });
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout;
 const heat = labState.heat ?? 0.3;
 const deg = labState.angleDeg ?? 45;
 drawBackdrop();
 drawAngle(ctx, w * 0.35, h * 0.5, deg, heat > 0.5);
 const hx = w * 0.2 + heat * w * 0.6;
 ctx.fillStyle = "#60a5fa";
 ctx.beginPath(); ctx.arc(hx, h * 0.72, 14, 0, Math.PI * 2); ctx.fill();
 drawLabel(ctx, heat >= 0.6 ? "Turn clear: " + Math.round(deg) + " deg (" + kindFromDeg(deg) + ")" : "Drag to open the angle", w * 0.5, layout.labelY);
 setHitRegions([{ id: "h", shape: "rect", x: hx, y: h * 0.72, w: 48, h: 48, meta: { action: "stretch" } }]);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("angleRule", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Turn in degrees = angle.");
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout, prog = labState.tokenProgress || 0;
 drawBackdrop();
 ["Turn", "in", "degrees", "= angle"].forEach((label, i) => {
 const x = w * 0.18 + i * (w * 0.18);
 ctx.fillStyle = i < prog ? "rgba(96,165,250,0.4)" : "rgba(15,23,42,0.9)";
 roundRect(ctx, x - 48, h * 0.36 - 18, 96, 36, 10); ctx.fill();
 ctx.fillStyle = "#dbeafe"; ctx.font = "700 12px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.36);
 });
 drawAngle(ctx, w * 0.42, h * 0.58, 90, true);
 drawLabel(ctx, "Angle rule", w * 0.5, layout.labelY);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("angleStretch", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const modes = ["clock", "door", "roof", "fan", "book"];
 setDescription("Same turns in Bangladesh angle stories.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.mode) { labState.mode = intent.meta.mode; pulseSuccessFeedback(200); }
 });
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout, mode = labState.mode || "clock";
 drawBackdrop();
 const hits = [];
 modes.forEach((m, i) => {
 const x = w * 0.12 + i * (w * 0.17);
 ctx.fillStyle = m === mode ? "rgba(96,165,250,0.4)" : "#1e3a8a";
 roundRect(ctx, x - 36, layout.deskTop - 36, 72, 48, 10); ctx.fill();
 ctx.fillStyle = "#dbeafe"; ctx.font = "600 11px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(m, x, layout.deskTop - 10);
 hits.push({ id: m, shape: "rect", x, y: layout.deskTop - 12, w: 72, h: 48, meta: { mode: m } });
 });
 const degByMode = { clock: 30, door: 120, roof: 110, fan: 60, book: 90 };
 drawAngle(ctx, w * 0.4, h * 0.5, degByMode[mode] || 45, true);
 const captions = {
 clock: "Clock hands make acute turns often",
 door: "Wide open door - often obtuse",
 roof: "Roof pitch can be obtuse at the peak",
 fan: "Fan blades sweep acute slices",
 book: "Book corner - right angle",
 };
 drawLabel(ctx, captions[mode], w * 0.5, layout.labelY);
 setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("angleMyth", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const myths = [
 { claim: "Longer rays mean a bigger angle", truth: "Angle is the turn, not ray length" },
 { claim: "Acute means any angle under 180", truth: "Acute is under 90; obtuse is over 90" },
 { claim: "Right angles only exist in triangles", truth: "Squares, books, and tiles have right angles too" },
 { claim: "Degrees are only for thermometers", truth: "Angle degrees measure turns" },
 { claim: "You need a tool to spot kinds", truth: "Compare to a square corner by eye first" },
 ];
 setDescription("Bust angle myths.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "flip") {
 labState.mythPhase = labState.mythPhase === "truth" ? "claim" : "truth";
 if (labState.mythPhase === "truth") pulseSuccessFeedback(220);
 }
 });
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout;
 const idx = labState.myth ?? 0, phase = labState.mythPhase || "claim", m = myths[idx] || myths[0];
 drawBackdrop();
 ctx.fillStyle = phase === "truth" ? "rgba(96,165,250,0.2)" : "rgba(248,113,113,0.18)";
 roundRect(ctx, w * 0.12, h * 0.28, w * 0.76, h * 0.28, 16); ctx.fill();
 drawLabel(ctx, phase === "truth" ? m.truth : "Myth: " + m.claim, w * 0.5, h * 0.42, { h: 42, font: "700 13px Segoe UI" });
 drawLabel(ctx, "Myth " + (idx + 1) + " / 5 \u00b7 Tap to flip", w * 0.5, layout.labelY);
 setHitRegions([{ id: "card", shape: "rect", x: w * 0.5, y: h * 0.42, w: w * 0.76, h: h * 0.28, meta: { action: "flip" } }]);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("angleDrill", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription(labState.prompt || "Angle drill");
 setTick(() => {
 const w = api.width, h = api.height;
 drawBackdrop();
 drawLabel(ctx, labState.prompt || "Angle drill", w * 0.5, h * 0.2, { h: 32, font: "700 16px Segoe UI" });
 drawAngle(ctx, w * 0.4, h * 0.5, 90, true);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("angleMastery", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Angle Ace mastery.");
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout, locked = labState.masteryStep || 0;
 drawBackdrop();
 ["Meet", "Sort", "Lab", "Rule", "Myth", "Ace"].forEach((label, i) => {
 const x = w * 0.1 + i * (w * 0.14);
 ctx.fillStyle = i < locked ? "#60a5fa" : "rgba(148,163,184,0.35)";
 roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8); ctx.fill();
 ctx.fillStyle = "#0f172a"; ctx.font = "600 10px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.78);
 });
 drawAngle(ctx, w * 0.22, h * 0.42, 40, true);
 drawAngle(ctx, w * 0.48, h * 0.42, 90, true);
 drawAngle(ctx, w * 0.72, h * 0.42, 130, true);
 drawLabel(ctx, "Angle Ace!", w * 0.5, layout.labelY);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });
}
