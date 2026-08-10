/**
 * Electrical Basics - Mission 1: Circuit Loop - closed path lights the bulb.
 * Unique canvas: desk kit, gap/close lab, sort zones, scale rule, place modes,
 * myth diagrams, prompt-aware drill, mastery banner.
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
 ctx.fillStyle = opts.bg || "rgba(15,23,42,0.92)";
 roundRect(ctx, x - tw / 2, y - bh / 2, tw, bh, 10);
 ctx.fill();
 ctx.strokeStyle = opts.border || "rgba(250,204,21,0.55)";
 ctx.lineWidth = 1.4;
 ctx.stroke();
 ctx.fillStyle = opts.color || "#fde68a";
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
 ctx.fillStyle = `rgba(250,204,21,${Math.max(0, (until - performance.now()) / 380) * 0.22})`;
 ctx.fillRect(0, 0, w, h);
}

function drawBattery(ctx, x, y, scale = 1) {
 const s = scale;
 ctx.fillStyle = "#1e293b";
 roundRect(ctx, x - 28 * s, y - 36 * s, 56 * s, 72 * s, 6);
 ctx.fill();
 ctx.strokeStyle = "#facc15";
 ctx.lineWidth = 3;
 ctx.stroke();
 ctx.fillStyle = "#facc15";
 ctx.fillRect(x - 10 * s, y - 44 * s, 8 * s, 10 * s);
 ctx.fillRect(x + 4 * s, y - 40 * s, 8 * s, 6 * s);
 ctx.fillStyle = "#fde68a";
 ctx.font = `700 ${Math.round(14 * s)}px Segoe UI`;
 ctx.textAlign = "center";
 ctx.fillText("+", x, y - 8 * s);
 ctx.fillText("−", x, y + 18 * s);
 ctx.font = `700 ${Math.round(11 * s)}px Segoe UI`;
 ctx.fillText("Battery", x, y + 52 * s);
}
function drawSwitch(ctx, x, y, closed) {
 ctx.fillStyle = "#334155";
 roundRect(ctx, x - 36, y - 16, 72, 32, 6);
 ctx.fill();
 ctx.fillStyle = "#94a3b8";
 ctx.beginPath();
 ctx.arc(x - 22, y, 6, 0, Math.PI * 2);
 ctx.arc(x + 22, y, 6, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = closed ? "#22c55e" : "#f97316";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.moveTo(x - 22, y);
 if (closed) ctx.lineTo(x + 22, y);
 else ctx.lineTo(x + 10, y - 14);
 ctx.stroke();
 ctx.fillStyle = "#e2e8f0";
 ctx.font = "700 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(closed ? "Switch ON" : "Switch OFF", x, y + 36);
}
function drawBulb(ctx, x, y, lit, brightness = 1) {
 const glow = lit ? Math.max(0.35, Math.min(1, brightness)) : 0;
 if (glow > 0) {
 const g = ctx.createRadialGradient(x, y - 8, 8, x, y - 8, 48);
 g.addColorStop(0, `rgba(254,240,138,${0.55 * glow})`);
 g.addColorStop(1, "rgba(254,240,138,0)");
 ctx.fillStyle = g;
 ctx.beginPath();
 ctx.arc(x, y - 8, 48, 0, Math.PI * 2);
 ctx.fill();
 }
 ctx.fillStyle = lit ? "#fef08a" : "#64748b";
 ctx.beginPath();
 ctx.arc(x, y - 8, 22, 0, Math.PI * 2);
 ctx.fill();
 if (lit) {
 ctx.strokeStyle = `rgba(250,204,21,${0.55 + 0.35 * glow})`;
 ctx.lineWidth = 2;
 for (let i = 0; i < 6; i++) {
 const a = (i / 6) * Math.PI * 2;
 ctx.beginPath();
 ctx.moveTo(x + Math.cos(a) * 26, y - 8 + Math.sin(a) * 26);
 ctx.lineTo(x + Math.cos(a) * (30 + 8 * glow), y - 8 + Math.sin(a) * (30 + 8 * glow));
 ctx.stroke();
 }
 }
 ctx.fillStyle = "#475569";
 roundRect(ctx, x - 10, y + 12, 20, 14, 3);
 ctx.fill();
 ctx.fillStyle = lit ? "#fde68a" : "#cbd5e1";
 ctx.font = "700 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("Bulb", x, y + 42);
}
function drawWireSeg(ctx, x1, y1, x2, y2, on) {
 ctx.strokeStyle = on ? "#facc15" : "#64748b";
 ctx.lineWidth = 4;
 ctx.lineCap = "round";
 ctx.beginPath();
 ctx.moveTo(x1, y1);
 ctx.lineTo(x2, y2);
 ctx.stroke();
}
function drawGapMark(ctx, x, y) {
 ctx.strokeStyle = "#ef4444";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.moveTo(x - 10, y - 10);
 ctx.lineTo(x + 10, y + 10);
 ctx.moveTo(x + 10, y - 10);
 ctx.lineTo(x - 10, y + 10);
 ctx.stroke();
}
function drawTorch(ctx, x, y, on) {
 ctx.fillStyle = "#334155";
 roundRect(ctx, x - 18, y - 50, 36, 70, 8);
 ctx.fill();
 ctx.fillStyle = on ? "#fef08a" : "#64748b";
 ctx.beginPath();
 ctx.moveTo(x - 22, y - 50);
 ctx.lineTo(x + 22, y - 50);
 ctx.lineTo(x + 14, y - 72);
 ctx.lineTo(x - 14, y - 72);
 ctx.closePath();
 ctx.fill();
 if (on) {
 ctx.fillStyle = "rgba(254,240,138,0.35)";
 ctx.beginPath();
 ctx.moveTo(x - 20, y - 72);
 ctx.lineTo(x + 20, y - 72);
 ctx.lineTo(x + 40, y - 110);
 ctx.lineTo(x - 40, y - 110);
 ctx.closePath();
 ctx.fill();
 }
 ctx.fillStyle = "#fde68a";
 ctx.font = "700 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("Torch", x, y + 36);
}
function drawStreetLamp(ctx, x, y, on) {
 ctx.strokeStyle = "#94a3b8";
 ctx.lineWidth = 5;
 ctx.beginPath();
 ctx.moveTo(x, y + 50);
 ctx.lineTo(x, y - 20);
 ctx.lineTo(x + 28, y - 20);
 ctx.stroke();
 ctx.fillStyle = on ? "#fef08a" : "#475569";
 ctx.beginPath();
 ctx.arc(x + 28, y - 8, 16, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#e2e8f0";
 ctx.font = "700 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("Street", x + 10, y + 64);
}
function drawShopSign(ctx, x, y, on) {
 ctx.fillStyle = on ? "#facc15" : "#334155";
 roundRect(ctx, x - 70, y - 28, 140, 48, 8);
 ctx.fill();
 ctx.fillStyle = on ? "#0f172a" : "#94a3b8";
 ctx.font = "800 16px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(on ? "OPEN" : "dark sign", x, y);
 ctx.fillStyle = "#fde68a";
 ctx.font = "700 11px Segoe UI";
 ctx.fillText("Shop", x, y + 44);
}
function drawLabBoard(ctx, x, y, closed) {
 ctx.fillStyle = "#1e3a5f";
 roundRect(ctx, x - 90, y - 50, 180, 100, 10);
 ctx.fill();
 ctx.strokeStyle = "#38bdf8";
 ctx.lineWidth = 2;
 ctx.stroke();
 drawBattery(ctx, x - 50, y, 0.55);
 drawSwitch(ctx, x + 10, y - 10, closed);
 drawBulb(ctx, x + 55, y + 5, closed, closed ? 1 : 0);
 ctx.fillStyle = "#7dd3fc";
 ctx.font = "700 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("Lab board", x, y + 64);
}

export function registerCircuitScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("circuitMeet", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions } = api;
 labState.phase = opts.phase || labState.phase || "desk";
 setDescription("Circuit Loop - closed path lights the bulb.");
 const props = { bat: { x: 0, y: 0 }, sw: { x: 0, y: 0 }, bulb: { x: 0, y: 0 } };
 let inited = false;
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout;
 const live = labState.phase || "desk";
 const closed = live === "glow" || live === "settle";
 const predict = live === "predict";
 drawBackdrop();
 if (!inited) {
 props.bat.x = w * 0.2; props.bat.y = h * 0.42;
 props.sw.x = w * 0.5; props.sw.y = h * 0.28;
 props.bulb.x = w * 0.78; props.bulb.y = h * 0.42;
 inited = true;
 }
 ctx.fillStyle = "#1e293b";
 roundRect(ctx, w * 0.08, layout.deskTop - 8, w * 0.84, 18, 8);
 ctx.fill();
 if (closed) {
 drawWireSeg(ctx, props.bat.x + 28, props.bat.y, props.sw.x - 36, props.sw.y, true);
 drawWireSeg(ctx, props.sw.x + 36, props.sw.y, props.bulb.x - 22, props.bulb.y - 8, true);
 drawWireSeg(ctx, props.bulb.x, props.bulb.y + 26, props.bat.x, props.bat.y + 36, true);
 } else if (predict) {
 drawWireSeg(ctx, props.bat.x + 28, props.bat.y, props.sw.x - 36, props.sw.y, false);
 drawWireSeg(ctx, props.sw.x + 36, props.sw.y, props.bulb.x - 22, props.bulb.y - 8, false);
 drawGapMark(ctx, props.sw.x, props.sw.y - 28);
 }
 drawBattery(ctx, props.bat.x, props.bat.y);
 drawSwitch(ctx, props.sw.x, props.sw.y, closed);
 drawBulb(ctx, props.bulb.x, props.bulb.y, closed);
 const tips = {
 desk: "Drag battery, switch, bulb - build the team",
 glow: "Closed path: current can travel the loop",
 predict: "Predict: open gap → bulb dark?",
 settle: "Open gap = dark. Closed loop = light",
 };
 drawLabel(ctx, tips[live] || tips.desk, w * 0.5, layout.labelY);
 const hits = [];
 for (const [id, p] of Object.entries(props)) {
 hits.push({
 id, shape: "rect", x: p.x, y: p.y, w: 90, h: 90, meta: { propId: id },
 onDrag(pt) {
 p.x = Math.max(50, Math.min(w - 50, pt.x));
 p.y = Math.max(70, Math.min(layout.deskTop, pt.y));
 },
 });
 }
 setHitRegions(hits);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("circuitSort", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } = api;
 setDescription("Sort: closed loop, open gap, or not a circuit.");
 const chips = [
 { id: "bat", short: "Battery", color: 0xfacc15 },
 { id: "wire", short: "Wire", color: 0x94a3b8 },
 { id: "swon", short: "Switch ON", color: 0x22c55e },
 { id: "bulb", short: "Bulb", color: 0xfde68a },
 { id: "swoff", short: "Switch OFF", color: 0xf97316 },
 { id: "break", short: "Broken", color: 0xef4444 },
 { id: "erase", short: "Eraser", color: 0xa78bfa },
 { id: "wood", short: "Wood", color: 0x78716c },
 ];
 const accept = {
 closed: ["bat", "wire", "swon", "bulb"],
 open: ["swoff", "break"],
 not: ["erase", "wood"],
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
 { id: "closed", label: "Closed loop part", x: w * 0.02, y: zoneY, ww: w * 0.31, hh: zoneH, color: "#22c55e" },
 { id: "open", label: "Open / gap", x: w * 0.35, y: zoneY, ww: w * 0.31, hh: zoneH, color: "#f97316" },
 { id: "not", label: "Not a circuit", x: w * 0.68, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#94a3b8" },
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
 const byZone = { closed: [], open: [], not: [] };
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
 ctx.fillStyle = labState.selectedId === c.id ? "rgba(250,204,21,0.4)" : "rgba(15,23,42,0.95)";
 roundRect(ctx, prev.x - 48, prev.y - 16, 96, 32, 8); ctx.fill();
 ctx.strokeStyle = "#" + c.color.toString(16).padStart(6, "0"); ctx.stroke();
 ctx.fillStyle = "#fde68a"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
 ctx.fillText(c.short, prev.x, prev.y);
 hits.push({ id: c.id, shape: "rect", x: prev.x, y: prev.y, w: 100, h: 36, meta: { chipId: c.id },
 onDrag(pt) { draggingId = c.id; prev.x = Math.max(30, Math.min(w - 30, pt.x)); prev.y = Math.max(30, Math.min(h - 30, pt.y)); } });
 });
 drawLabel(ctx, "Closed loop / Open gap / Not a circuit", w * 0.5, layout.labelY);
 setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("circuitLab", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 setDescription("Close the path - watch the bulb brighten.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
 labState.heat = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
 }
 });
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout;
 const heat = labState.heat ?? 0.3;
 const closed = heat >= 0.55;
 drawBackdrop();
 drawBattery(ctx, w * 0.22, h * 0.4);
 drawSwitch(ctx, w * 0.5, h * 0.28, closed);
 drawBulb(ctx, w * 0.78, h * 0.4, closed, heat);
 if (closed) {
 drawWireSeg(ctx, w * 0.22 + 28, h * 0.4, w * 0.5 - 36, h * 0.28, true);
 drawWireSeg(ctx, w * 0.5 + 36, h * 0.28, w * 0.78 - 22, h * 0.4 - 8, true);
 drawWireSeg(ctx, w * 0.78, h * 0.4 + 26, w * 0.22, h * 0.4 + 36, true);
 } else {
 drawWireSeg(ctx, w * 0.22 + 28, h * 0.4, w * 0.42, h * 0.28, false);
 drawWireSeg(ctx, w * 0.58, h * 0.28, w * 0.78 - 22, h * 0.4 - 8, false);
 drawGapMark(ctx, w * 0.5, h * 0.28 - 28);
 }
 // Track bar
 ctx.fillStyle = "rgba(15,23,42,0.85)";
 roundRect(ctx, w * 0.2, h * 0.72 - 6, w * 0.6, 12, 6);
 ctx.fill();
 ctx.fillStyle = heat >= 0.6 ? "#22c55e" : "#facc15";
 roundRect(ctx, w * 0.2, h * 0.72 - 6, w * 0.6 * heat, 12, 6);
 ctx.fill();
 const hx = w * 0.2 + heat * w * 0.6;
 ctx.fillStyle = "#facc15";
 ctx.beginPath(); ctx.arc(hx, h * 0.72, 14, 0, Math.PI * 2); ctx.fill();
 const tip = heat >= 0.75
 ? `Strong loop ${Math.round(heat * 100)}% - bulb bright`
 : heat >= 0.55
 ? `Loop closing ${Math.round(heat * 100)}% - bulb lighting`
 : `Drag to close the path (${Math.round(heat * 100)}%)`;
 drawLabel(ctx, tip, w * 0.5, layout.labelY);
 setHitRegions([{ id: "h", shape: "rect", x: hx, y: h * 0.72, w: 48, h: 48, meta: { action: "stretch" } }]);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("circuitRule", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Closed loop = current flows.");
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout;
 const prog = labState.tokenProgress || 0;
 const scale = labState.scale ?? 0;
 drawBackdrop();

 if (scale > 0.02) {
 // Scale scrubber modes: torch → parts → CLOSED LOOP banner
 if (scale < 0.33) {
 drawTorch(ctx, w * 0.5, h * 0.48, true);
 drawLabel(ctx, "Everyday: torch needs a closed switch path", w * 0.5, layout.labelY);
 } else if (scale < 0.66) {
 drawBattery(ctx, w * 0.22, h * 0.42);
 drawSwitch(ctx, w * 0.5, h * 0.3, true);
 drawBulb(ctx, w * 0.78, h * 0.42, true);
 drawWireSeg(ctx, w * 0.22 + 28, h * 0.42, w * 0.5 - 36, h * 0.3, true);
 drawWireSeg(ctx, w * 0.5 + 36, h * 0.3, w * 0.78 - 22, h * 0.42 - 8, true);
 drawWireSeg(ctx, w * 0.78, h * 0.42 + 26, w * 0.22, h * 0.42 + 36, true);
 drawLabel(ctx, "Parts: battery · wires · switch · bulb", w * 0.5, layout.labelY);
 } else {
 ctx.fillStyle = "rgba(250,204,21,0.22)";
 roundRect(ctx, w * 0.14, h * 0.32, w * 0.72, h * 0.28, 16);
 ctx.fill();
 ctx.strokeStyle = "#facc15";
 ctx.lineWidth = 3;
 ctx.stroke();
 ctx.fillStyle = "#fef08a";
 ctx.font = "800 22px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("CLOSED LOOP", w * 0.5, h * 0.44);
 ctx.font = "600 14px Segoe UI";
 ctx.fillStyle = "#e2e8f0";
 ctx.fillText("= current flows → bulb can light", w * 0.5, h * 0.52);
 drawBulb(ctx, w * 0.5, h * 0.68, true, 1);
 drawLabel(ctx, "Rule locked: closed path lights the bulb", w * 0.5, layout.labelY);
 }
 } else {
 ["Closed", "loop", "=", "current flows"].forEach((label, i) => {
 const x = w * 0.14 + i * (w * 0.2);
 ctx.fillStyle = i < prog ? "rgba(250,204,21,0.4)" : "rgba(15,23,42,0.9)";
 roundRect(ctx, x - 48, h * 0.36 - 18, 96, 36, 10); ctx.fill();
 ctx.fillStyle = "#fde68a"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.36);
 });
 drawBulb(ctx, w * 0.5, h * 0.58, prog >= 4);
 drawLabel(ctx, "Circuit Loop rule", w * 0.5, layout.labelY);
 }
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("circuitStretch", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, opts } = api;
 const modes = ["home", "school", "street", "shop", "lab"];
 const labels = { home: "Home", school: "School", street: "Street", shop: "Shop", lab: "Lab" };
 if (opts?.mode) labState.mode = opts.mode;
 setDescription("Same closed-loop idea in places you know.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.mode) { labState.mode = intent.meta.mode; pulseSuccessFeedback(200); }
 });
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout, mode = labState.mode || "home";
 drawBackdrop();
 const hits = [];
 modes.forEach((m, i) => {
 const x = w * 0.12 + i * (w * 0.17);
 ctx.fillStyle = m === mode ? "rgba(250,204,21,0.4)" : "#1e293b";
 roundRect(ctx, x - 40, layout.deskTop - 36, 80, 48, 10); ctx.fill();
 ctx.fillStyle = "#fde68a"; ctx.font = "600 12px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText(labels[m], x, layout.deskTop - 10);
 hits.push({ id: m, shape: "rect", x, y: layout.deskTop - 12, w: 80, h: 48, meta: { mode: m } });
 });
 if (mode === "home") drawTorch(ctx, w * 0.5, h * 0.42, true);
 else if (mode === "school") {
 drawBattery(ctx, w * 0.28, h * 0.4, 0.75);
 drawSwitch(ctx, w * 0.5, h * 0.32, true);
 drawBulb(ctx, w * 0.72, h * 0.4, true);
 drawWireSeg(ctx, w * 0.28 + 22, h * 0.4, w * 0.5 - 36, h * 0.32, true);
 drawWireSeg(ctx, w * 0.5 + 36, h * 0.32, w * 0.72 - 22, h * 0.4 - 8, true);
 drawWireSeg(ctx, w * 0.72, h * 0.4 + 26, w * 0.28, h * 0.4 + 30, true);
 } else if (mode === "street") drawStreetLamp(ctx, w * 0.48, h * 0.4, true);
 else if (mode === "shop") drawShopSign(ctx, w * 0.5, h * 0.4, true);
 else drawLabBoard(ctx, w * 0.5, h * 0.4, true);
 const captions = {
 home: "Torch / room light - switch closes the loop",
 school: "Science kit - battery, wires, bulb",
 street: "Street lamp needs a complete supply path",
 shop: "Shop signs light when the circuit is closed",
 lab: "Lab boards: build one neat closed path",
 };
 drawLabel(ctx, captions[mode], w * 0.5, layout.labelY);
 setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("circuitMyth", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const myths = [
 { claim: "Current stops at the bulb forever", truth: "Current needs a full closed loop back to the battery" },
 { claim: "Open switch still lets current flow", truth: "Open switch = gap; current stops" },
 { claim: "Any scrap wire is always a full circuit", truth: "Parts must connect into one closed path" },
 { claim: "A broken wire still lights the bulb", truth: "A gap breaks the loop - no light" },
 { claim: "Only experts can build a simple loop", truth: "Kids can build battery-wire-bulb loops carefully" },
 ];
 setDescription("Bust circuit myths.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "flip") {
 labState.mythPhase = labState.mythPhase === "truth" ? "claim" : "truth";
 if (labState.mythPhase === "truth") pulseSuccessFeedback(220);
 }
 });
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout;
 const idx = labState.myth ?? 0, phase = labState.mythPhase || "claim", m = myths[idx] || myths[0];
 const truth = phase === "truth";
 drawBackdrop();

 // Per-myth diagram (unique visual for each claim/truth)
 const cy = h * 0.28;
 if (idx === 0) {
 drawBattery(ctx, w * 0.22, cy);
 drawBulb(ctx, w * 0.72, cy, truth);
 if (truth) {
 drawWireSeg(ctx, w * 0.22 + 28, cy, w * 0.72 - 22, cy - 8, true);
 drawWireSeg(ctx, w * 0.72, cy + 26, w * 0.22, cy + 36, true);
 drawLabel(ctx, "return path", w * 0.5, cy + 58, { h: 20, font: "700 11px Segoe UI" });
 } else {
 drawWireSeg(ctx, w * 0.22 + 28, cy, w * 0.72 - 22, cy - 8, false);
 drawLabel(ctx, "stops here?", w * 0.72, cy + 58, { h: 20, font: "700 11px Segoe UI", border: "rgba(248,113,113,0.7)" });
 }
 } else if (idx === 1) {
 drawSwitch(ctx, w * 0.5, cy, truth);
 drawBulb(ctx, w * 0.78, cy, truth);
 drawBattery(ctx, w * 0.22, cy);
 if (!truth) drawGapMark(ctx, w * 0.5, cy - 36);
 } else if (idx === 2) {
 if (truth) {
 drawBattery(ctx, w * 0.28, cy);
 drawBulb(ctx, w * 0.72, cy, true);
 drawWireSeg(ctx, w * 0.28 + 28, cy, w * 0.72 - 22, cy - 8, true);
 drawWireSeg(ctx, w * 0.72, cy + 26, w * 0.28, cy + 36, true);
 } else {
 // scrap wire alone
 ctx.strokeStyle = "#94a3b8";
 ctx.lineWidth = 6;
 ctx.lineCap = "round";
 ctx.beginPath();
 ctx.moveTo(w * 0.35, cy);
 ctx.lineTo(w * 0.65, cy - 20);
 ctx.stroke();
 drawLabel(ctx, "scrap only", w * 0.5, cy + 40, { h: 20, font: "700 11px Segoe UI" });
 }
 } else if (idx === 3) {
 drawBattery(ctx, w * 0.22, cy);
 drawBulb(ctx, w * 0.78, cy, truth);
 drawWireSeg(ctx, w * 0.22 + 28, cy, w * 0.42, cy - 10, !truth ? false : true);
 if (!truth) {
 drawGapMark(ctx, w * 0.5, cy - 10);
 drawWireSeg(ctx, w * 0.58, cy - 10, w * 0.78 - 22, cy - 8, false);
 } else {
 drawWireSeg(ctx, w * 0.22 + 28, cy, w * 0.78 - 22, cy - 8, true);
 drawWireSeg(ctx, w * 0.78, cy + 26, w * 0.22, cy + 36, true);
 }
 } else {
 if (truth) {
 drawLabBoard(ctx, w * 0.5, cy, true);
 } else {
 ctx.fillStyle = "rgba(248,113,113,0.2)";
 roundRect(ctx, w * 0.25, cy - 40, w * 0.5, 80, 12);
 ctx.fill();
 ctx.fillStyle = "#fca5a5";
 ctx.font = "700 16px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("Experts only?", w * 0.5, cy);
 }
 }

 ctx.fillStyle = truth ? "rgba(250,204,21,0.2)" : "rgba(248,113,113,0.18)";
 roundRect(ctx, w * 0.12, h * 0.52, w * 0.76, h * 0.2, 16); ctx.fill();
 drawLabel(ctx, truth ? m.truth : "Myth: " + m.claim, w * 0.5, h * 0.62, { h: 42, font: "700 13px Segoe UI", maxW: w * 0.7 });
 drawLabel(ctx, "Myth " + (idx + 1) + " / 5 - Tap to flip", w * 0.5, layout.labelY);
 setHitRegions([{ id: "card", shape: "rect", x: w * 0.5, y: h * 0.62, w: w * 0.76, h: h * 0.22, meta: { action: "flip" } }]);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("circuitDrill", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription(labState.prompt || "Loop drill");
 setTick(() => {
 const w = api.width, h = api.height;
 const prompt = (labState.prompt || "").toLowerCase();
 drawBackdrop();
 drawLabel(ctx, labState.prompt || "Circuit Loop drill", w * 0.5, h * 0.16, { h: 32, font: "700 16px Segoe UI" });

 if (prompt.includes("switch")) {
 drawSwitch(ctx, w * 0.5, h * 0.45, false);
 drawGapMark(ctx, w * 0.5, h * 0.45 - 36);
 } else if (prompt.includes("battery") || prompt.includes("alone")) {
 drawBattery(ctx, w * 0.5, h * 0.45);
 drawBulb(ctx, w * 0.78, h * 0.45, false);
 drawLabel(ctx, "no wires", w * 0.5, h * 0.72, { h: 20, font: "700 11px Segoe UI" });
 } else if (prompt.includes("broken") || (prompt.includes("gap") && prompt.includes("wire"))) {
 drawBattery(ctx, w * 0.25, h * 0.45);
 drawBulb(ctx, w * 0.75, h * 0.45, false);
 drawWireSeg(ctx, w * 0.25 + 28, h * 0.45, w * 0.42, h * 0.4, false);
 drawGapMark(ctx, w * 0.5, h * 0.4);
 drawWireSeg(ctx, w * 0.58, h * 0.4, w * 0.75 - 22, h * 0.45 - 8, false);
 } else if (prompt.includes("eraser")) {
 ctx.fillStyle = "#a78bfa";
 roundRect(ctx, w * 0.42, h * 0.38, w * 0.16, 50, 8);
 ctx.fill();
 ctx.fillStyle = "#fde68a";
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("Eraser", w * 0.5, h * 0.55);
 } else if (prompt.includes("torch") || prompt.includes("dark")) {
 drawTorch(ctx, w * 0.5, h * 0.48, false);
 } else if (prompt.includes("rule") || prompt.includes("loop")) {
 drawBattery(ctx, w * 0.28, h * 0.42);
 drawSwitch(ctx, w * 0.5, h * 0.32, true);
 drawBulb(ctx, w * 0.72, h * 0.42, true);
 drawWireSeg(ctx, w * 0.28 + 28, h * 0.42, w * 0.5 - 36, h * 0.32, true);
 drawWireSeg(ctx, w * 0.5 + 36, h * 0.32, w * 0.72 - 22, h * 0.42 - 8, true);
 drawWireSeg(ctx, w * 0.72, h * 0.42 + 26, w * 0.28, h * 0.42 + 36, true);
 } else if (prompt.includes("bulb")) {
 drawBulb(ctx, w * 0.5, h * 0.45, true);
 } else {
 drawBulb(ctx, w * 0.5, h * 0.48, true);
 }
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("circuitMastery", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Loop Learner mastery.");
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout, locked = labState.masteryStep || 0;
 drawBackdrop();
 // Path pips
 ["Meet", "Sort", "Lab", "Rule", "Myth"].forEach((label, i) => {
 const x = w * 0.12 + i * (w * 0.17);
 ctx.fillStyle = i < locked ? "#facc15" : "rgba(148,163,184,0.35)";
 roundRect(ctx, x - 32, h * 0.78 - 12, 64, 24, 8); ctx.fill();
 ctx.fillStyle = i < locked ? "#0f172a" : "#e2e8f0";
 ctx.font = "600 10px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText(label, x, h * 0.78);
 if (i < 4) {
 ctx.strokeStyle = i < locked - 1 ? "#facc15" : "rgba(148,163,184,0.35)";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.moveTo(x + 34, h * 0.78);
 ctx.lineTo(x + w * 0.17 - 34, h * 0.78);
 ctx.stroke();
 }
 });
 // Showcase closed loop + banner
 drawBattery(ctx, w * 0.22, h * 0.38);
 drawSwitch(ctx, w * 0.5, h * 0.28, true);
 drawBulb(ctx, w * 0.78, h * 0.38, true, 1);
 drawWireSeg(ctx, w * 0.22 + 28, h * 0.38, w * 0.5 - 36, h * 0.28, true);
 drawWireSeg(ctx, w * 0.5 + 36, h * 0.28, w * 0.78 - 22, h * 0.38 - 8, true);
 drawWireSeg(ctx, w * 0.78, h * 0.38 + 26, w * 0.22, h * 0.38 + 36, true);
 ctx.fillStyle = "rgba(250,204,21,0.25)";
 roundRect(ctx, w * 0.28, h * 0.55, w * 0.44, 40, 12);
 ctx.fill();
 ctx.strokeStyle = "#facc15";
 ctx.lineWidth = 2;
 ctx.stroke();
 ctx.fillStyle = "#fef08a";
 ctx.font = "800 18px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("Loop Learner", w * 0.5, h * 0.575);
 drawLabel(ctx, "Closed path lights the bulb", w * 0.5, layout.labelY);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });
}
