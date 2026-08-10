/**
 * Electrical Basics - Mission 2: Voltage & Current - V pushes, I flows.
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
 ctx.strokeStyle = opts.border || "rgba(56,189,248,0.55)";
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
 ctx.fillStyle = `rgba(56,189,248,${Math.max(0, (until - performance.now()) / 380) * 0.22})`;
 ctx.fillRect(0, 0, w, h);
}

function drawVoltBattery(ctx, x, y, push) {
 ctx.fillStyle = "#1e293b";
 roundRect(ctx, x - 32, y - 40, 64, 80, 6);
 ctx.fill();
 ctx.strokeStyle = "#38bdf8";
 ctx.lineWidth = 3;
 ctx.stroke();
 ctx.fillStyle = `rgba(56,189,248,${0.25 + push * 0.6})`;
 roundRect(ctx, x - 24, y + 20 - 70 * push, 48, 70 * push, 4);
 ctx.fill();
 ctx.fillStyle = "#7dd3fc";
 ctx.font = "700 18px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("V", x, y);
 ctx.font = "700 11px Segoe UI";
 ctx.fillText("Voltage", x, y + 56);
}
function drawFlow(ctx, x1, y1, x2, y2, strength) {
 ctx.strokeStyle = `rgba(250,204,21,${0.3 + strength * 0.7})`;
 ctx.lineWidth = 3 + strength * 4;
 ctx.lineCap = "round";
 ctx.beginPath();
 ctx.moveTo(x1, y1);
 ctx.lineTo(x2, y2);
 ctx.stroke();
 const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
 ctx.fillStyle = "#facc15";
 ctx.beginPath();
 ctx.moveTo(mx + 10, my);
 ctx.lineTo(mx - 4, my - 8);
 ctx.lineTo(mx - 4, my + 8);
 ctx.closePath();
 ctx.fill();
}
function drawAmpMeter(ctx, x, y, flow) {
 ctx.fillStyle = "#334155";
 roundRect(ctx, x - 40, y - 28, 80, 56, 8);
 ctx.fill();
 ctx.strokeStyle = "#facc15";
 ctx.lineWidth = 2;
 ctx.stroke();
 ctx.fillStyle = "#fde68a";
 ctx.font = "700 16px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("I " + Math.round(flow * 100) + "%", x, y);
 ctx.font = "700 11px Segoe UI";
 ctx.fillText("Current", x, y + 40);
}

export function registerVoltScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("voltMeet", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions } = api;
 labState.phase = opts.phase || labState.phase || "desk";
 setDescription("Voltage pushes - current flows.");
 const props = { bat: { x: 0, y: 0 }, meter: { x: 0, y: 0 } };
 let inited = false;
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout;
 const live = labState.phase || "desk";
 const push = live === "desk" ? 0.35 : live === "glow" ? 0.75 : 0.9;
 drawBackdrop();
 if (!inited) {
 props.bat.x = w * 0.28; props.bat.y = h * 0.42;
 props.meter.x = w * 0.7; props.meter.y = h * 0.42;
 inited = true;
 }
 ctx.fillStyle = "#1e3a5f";
 roundRect(ctx, w * 0.08, layout.deskTop - 8, w * 0.84, 18, 8);
 ctx.fill();
 drawVoltBattery(ctx, props.bat.x, props.bat.y, push);
 if (live !== "desk") drawFlow(ctx, props.bat.x + 34, props.bat.y, props.meter.x - 40, props.meter.y, push);
 drawAmpMeter(ctx, props.meter.x, props.meter.y, live === "desk" ? 0.15 : push);
 const tips = {
 desk: "Drag battery (V) and meter (I)",
 glow: "More push (V) can drive stronger flow (I)",
 settle: "V is push - I is flow - not the same word",
 };
 drawLabel(ctx, tips[live] || tips.desk, w * 0.5, layout.labelY);
 const hits = [];
 for (const [id, p] of Object.entries(props)) {
 hits.push({
 id, shape: "rect", x: p.x, y: p.y, w: 100, h: 100, meta: { propId: id },
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

 arena.registerScene("voltSort", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } = api;
 setDescription("Sort voltage vs current ideas.");
 const chips = [
 { id: "push", short: "Push", color: 0x38bdf8 },
 { id: "volts", short: "Volts", color: 0x60a5fa },
 { id: "flow", short: "Flow", color: 0xfacc15 },
 { id: "amps", short: "Amps", color: 0xfde68a },
 { id: "bat", short: "Battery V", color: 0x0ea5e9 },
 { id: "move", short: "Moving", color: 0xeab308 },
 { id: "loop", short: "Loop", color: 0x22c55e },
 { id: "snack", short: "Snack", color: 0xf97316 },
 ];
 const accept = {
 volt: ["push", "volts", "bat"],
 curr: ["flow", "amps", "move"],
 both: ["loop"],
 not: ["snack"],
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
 { id: "volt", label: "Voltage (V)", x: w * 0.02, y: zoneY, ww: w * 0.23, hh: zoneH, color: "#38bdf8" },
 { id: "curr", label: "Current (I)", x: w * 0.26, y: zoneY, ww: w * 0.23, hh: zoneH, color: "#facc15" },
 { id: "both", label: "Needs both", x: w * 0.5, y: zoneY, ww: w * 0.23, hh: zoneH, color: "#22c55e" },
 { id: "not", label: "Neither", x: w * 0.74, y: zoneY, ww: w * 0.24, hh: zoneH, color: "#f97316" },
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
 const byZone = { volt: [], curr: [], both: [], not: [] };
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
 ctx.fillStyle = labState.selectedId === c.id ? "rgba(56,189,248,0.4)" : "rgba(15,23,42,0.95)";
 roundRect(ctx, prev.x - 48, prev.y - 16, 96, 32, 8); ctx.fill();
 ctx.strokeStyle = "#" + c.color.toString(16).padStart(6, "0"); ctx.stroke();
 ctx.fillStyle = "#dbeafe"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
 ctx.fillText(c.short, prev.x, prev.y);
 hits.push({ id: c.id, shape: "rect", x: prev.x, y: prev.y, w: 100, h: 36, meta: { chipId: c.id },
 onDrag(pt) { draggingId = c.id; prev.x = Math.max(30, Math.min(w - 30, pt.x)); prev.y = Math.max(30, Math.min(h - 30, pt.y)); } });
 });
 drawLabel(ctx, "Voltage / Current / Both / Neither", w * 0.5, layout.labelY);
 setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("voltLab", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 setDescription("Raise voltage push - watch current flow.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
 labState.heat = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
 }
 });
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout;
 const heat = labState.heat ?? 0.3;
 drawBackdrop();
 drawVoltBattery(ctx, w * 0.28, h * 0.4, heat);
 drawFlow(ctx, w * 0.28 + 34, h * 0.4, w * 0.68 - 40, h * 0.4, heat);
 drawAmpMeter(ctx, w * 0.72, h * 0.4, heat);
 const hx = w * 0.2 + heat * w * 0.6;
 ctx.fillStyle = "#38bdf8";
 ctx.beginPath(); ctx.arc(hx, h * 0.72, 14, 0, Math.PI * 2); ctx.fill();
 drawLabel(ctx, heat >= 0.6 ? "Strong push - stronger flow" : "Drag to raise voltage push", w * 0.5, layout.labelY);
 setHitRegions([{ id: "h", shape: "rect", x: hx, y: h * 0.72, w: 48, h: 48, meta: { action: "stretch" } }]);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("voltRule", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Voltage pushes - current flows.");
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout, prog = labState.tokenProgress || 0;
 drawBackdrop();
 ["Voltage", "pushes", "current", "flows"].forEach((label, i) => {
 const x = w * 0.16 + i * (w * 0.2);
 ctx.fillStyle = i < prog ? "rgba(56,189,248,0.4)" : "rgba(15,23,42,0.9)";
 roundRect(ctx, x - 44, h * 0.36 - 18, 88, 36, 10); ctx.fill();
 ctx.fillStyle = "#dbeafe"; ctx.font = "700 12px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.36);
 });
 drawVoltBattery(ctx, w * 0.4, h * 0.58, 0.7);
 drawAmpMeter(ctx, w * 0.65, h * 0.58, 0.7);
 drawLabel(ctx, "V-I rule", w * 0.5, layout.labelY);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("voltStretch", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const modes = ["phone", "car", "torch", "charge", "lab"];
 setDescription("Same V push / I flow in everyday power.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.mode) { labState.mode = intent.meta.mode; pulseSuccessFeedback(200); }
 });
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout, mode = labState.mode || "phone";
 drawBackdrop();
 const hits = [];
 modes.forEach((m, i) => {
 const x = w * 0.12 + i * (w * 0.17);
 ctx.fillStyle = m === mode ? "rgba(56,189,248,0.4)" : "#1e3a5f";
 roundRect(ctx, x - 36, layout.deskTop - 36, 72, 48, 10); ctx.fill();
 ctx.fillStyle = "#dbeafe"; ctx.font = "600 11px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(m, x, layout.deskTop - 10);
 hits.push({ id: m, shape: "rect", x, y: layout.deskTop - 12, w: 72, h: 48, meta: { mode: m } });
 });
 drawVoltBattery(ctx, w * 0.35, h * 0.4, 0.6);
 drawAmpMeter(ctx, w * 0.68, h * 0.4, 0.55);
 const captions = {
 phone: "Phone battery: voltage push for charging current",
 car: "Car battery: strong V for starter current",
 torch: "Torch cells: weak V means dim light",
 charge: "Charger sets a safe voltage for the device",
 lab: "Lab supply: set V carefully - watch I",
 };
 drawLabel(ctx, captions[mode], w * 0.5, layout.labelY);
 setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("voltMyth", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const myths = [
 { claim: "Voltage and current are the same", truth: "Voltage is push; current is flow" },
 { claim: "Current sits stored in the wire like bottled water", truth: "Current is charge moving when the circuit is closed" },
 { claim: "Higher volts means infinite current with no path", truth: "You still need a closed path; load matters" },
 { claim: "Amps measure voltage", truth: "Amps measure current; volts measure voltage" },
 { claim: "A dead battery still has full push", truth: "A flat battery cannot push well" },
 ];
 setDescription("Bust V / I myths.");
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
 ctx.fillStyle = phase === "truth" ? "rgba(56,189,248,0.2)" : "rgba(248,113,113,0.18)";
 roundRect(ctx, w * 0.12, h * 0.28, w * 0.76, h * 0.28, 16); ctx.fill();
 drawLabel(ctx, phase === "truth" ? m.truth : "Myth: " + m.claim, w * 0.5, h * 0.42, { h: 42, font: "700 13px Segoe UI" });
 drawLabel(ctx, "Myth " + (idx + 1) + " / 5 - Tap to flip", w * 0.5, layout.labelY);
 setHitRegions([{ id: "card", shape: "rect", x: w * 0.5, y: h * 0.42, w: w * 0.76, h: h * 0.28, meta: { action: "flip" } }]);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("voltDrill", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription(labState.prompt || "V-I drill");
 setTick(() => {
 const w = api.width, h = api.height;
 drawBackdrop();
 drawLabel(ctx, labState.prompt || "Voltage & Current drill", w * 0.5, h * 0.2, { h: 32, font: "700 16px Segoe UI" });
 drawVoltBattery(ctx, w * 0.5, h * 0.48, 0.65);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("voltMastery", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Volt Scout mastery.");
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout, locked = labState.masteryStep || 0;
 drawBackdrop();
 ["Meet", "Sort", "Lab", "Rule", "Myth", "Scout"].forEach((label, i) => {
 const x = w * 0.1 + i * (w * 0.14);
 ctx.fillStyle = i < locked ? "#38bdf8" : "rgba(148,163,184,0.35)";
 roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8); ctx.fill();
 ctx.fillStyle = "#0f172a"; ctx.font = "600 10px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.78);
 });
 drawVoltBattery(ctx, w * 0.35, h * 0.4, 0.8);
 drawAmpMeter(ctx, w * 0.68, h * 0.4, 0.75);
 drawLabel(ctx, "Volt Scout!", w * 0.5, layout.labelY);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });
}
