/**
 * Day & Night Sky - Canvas 2D scenes (deepened).
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


function drawHero(ctx, w, h, heat, phase) {
 const cx = w * 0.42, cy = h * 0.42;
 const glow = phase === "glow" || phase === "settle";
 // Sun
 ctx.fillStyle = "#facc15";
 ctx.beginPath(); ctx.arc(w * 0.78, h * 0.28, 22, 0, Math.PI * 2); ctx.fill();
 // Earth
 const rot = heat * Math.PI * 2;
 ctx.save();
 ctx.translate(cx, cy);
 ctx.rotate(rot * 0.15);
 const grd = ctx.createLinearGradient(-40, 0, 40, 0);
 grd.addColorStop(0, "#0f172a");
 grd.addColorStop(0.45, "#1e293b");
 grd.addColorStop(0.55, "#38bdf8");
 grd.addColorStop(1, "#7dd3fc");
 ctx.fillStyle = grd;
 ctx.beginPath(); ctx.arc(0, 0, 40, 0, Math.PI * 2); ctx.fill();
 ctx.strokeStyle = "#818cf8"; ctx.lineWidth = 2; ctx.stroke();
 ctx.restore();
 ctx.fillStyle = "#e2e8f0"; ctx.font = "700 12px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText(glow ? "Spinning Earth" : "Earth", cx, cy + 62);
 ctx.fillText("Sun", w * 0.78, h * 0.28 + 36);
 if (glow) {
 drawLabel(ctx, heat > 0.5 ? "Your side: DAY" : "Your side: NIGHT", w * 0.5, h * 0.62, { h: 22, font: "700 12px Segoe UI" });
 }
}


export function registerSkyScenes(arena) {
 if (!arena?.registerScene) return;
 const P = "sky";

 arena.registerScene(P + "Meet", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions } = api;
 labState.phase = opts.phase || labState.phase || "desk";
 setDescription("Day & Night Sky - meet");
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout;
 const live = labState.phase || "desk";
 drawBackdrop();
 drawHero(ctx, w, h, labState.heat || 0.35, live);
 const tips = {
 desk: "See Earth with a bright side and a dark side.",
 glow: "Earth spins - your place moves into light or shadow.",
 settle: "Day and night take turns because Earth rotates.",
 };
 drawLabel(ctx, tips[live] || tips.desk, w * 0.5, layout.labelY);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene(P + "Sort", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } = api;
 setDescription("Sort into the right bins");
 const chips = [
 { id: "day", short: "Day", color: 0xfacc15 },
 { id: "night", short: "Night", color: 0x818cf8 },
 { id: "spin", short: "Spin", color: 0x38bdf8 },
 { id: "sunside", short: "Sun side", color: 0xfde68a },
 { id: "shadow", short: "Shadow", color: 0x334155 },
 { id: "lamp", short: "Lamp", color: 0x94a3b8 },
 { id: "sleep", short: "Sleep", color: 0xa78bfa },
 { id: "flat", short: "Flat myth", color: 0x78716c },
 ];
 const accept = {
 cause: ["spin", "sunside", "shadow"],
 result: ["day", "night", "sleep"],
 not: ["lamp", "flat"],
 };
 const cardPos = {}; chips.forEach((c) => (cardPos[c.id] = { x: 0, y: 0 }));
 let draggingId = null, lastZones = [];
 function placeChip(chipId, zoneId) {
 if (!(accept[zoneId] || []).includes(chipId)) { pulseFailFeedback(400); return false; }
 labState.placed = { ...(labState.placed || {}), [chipId]: zoneId };
 const session = getActiveSession();
 if (session?.dispatch) session.dispatch({ type: "PLACE_CHIP", chipId, zoneId, accept: accept[zoneId] });
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
 { id: "cause", label: "Causes day/night", x: w * 0.02, y: zoneY, ww: w * 0.30, hh: zoneH, color: "#38bdf8" },
 { id: "result", label: "What we see", x: w * 0.34, y: zoneY, ww: w * 0.30, hh: zoneH, color: "#818cf8" },
 { id: "not", label: "Not the cause", x: w * 0.66, y: zoneY, ww: w * 0.32, hh: zoneH, color: "#94a3b8" },
 ];
 lastZones = zones;
 const hits = [];
 for (const z of zones) {
 ctx.fillStyle = "rgba(15,23,42,0.7)"; roundRect(ctx, z.x, z.y, z.ww, z.hh, 12); ctx.fill();
 ctx.strokeStyle = z.color; ctx.lineWidth = 2.5; ctx.stroke();
 drawLabel(ctx, z.label, z.x + z.ww / 2, z.y + 16, { h: 20, font: "700 11px Segoe UI" });
 hits.push({ id: "zone-" + z.id, shape: "rect", x: z.x + z.ww / 2, y: z.y + z.hh / 2, w: z.ww, h: z.hh, meta: { zoneId: z.id, accept: accept[z.id] } });
 }
 const placed = labState.placed || {};
 const byZone = { cause: [], result: [], not: [] };
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
 targetX = w * 0.14 + (idx % 3) * (w * 0.28);
 targetY = zoneY + zoneH + 40 + Math.floor(idx / 3) * 48;
 }
 const prev = cardPos[c.id];
 if (!prev.x && !prev.y) { prev.x = targetX; prev.y = targetY; }
 if (draggingId !== c.id) { prev.x += (targetX - prev.x) * ease; prev.y += (targetY - prev.y) * ease; }
 ctx.fillStyle = labState.selectedId === c.id ? "rgba(56,189,248,0.35)" : "rgba(15,23,42,0.95)";
 roundRect(ctx, prev.x - 48, prev.y - 16, 96, 32, 8); ctx.fill();
 ctx.strokeStyle = "#" + c.color.toString(16).padStart(6, "0"); ctx.stroke();
 ctx.fillStyle = "#e2e8f0"; ctx.font = "700 12px Segoe UI"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
 ctx.fillText(c.short, prev.x, prev.y);
 hits.push({ id: c.id, shape: "rect", x: prev.x, y: prev.y, w: 100, h: 36, meta: { chipId: c.id },
 onDrag(pt) { draggingId = c.id; prev.x = Math.max(30, Math.min(w - 30, pt.x)); prev.y = Math.max(30, Math.min(h - 30, pt.y)); } });
 });
 drawLabel(ctx, "Day & Night Sky sort", w * 0.5, layout.labelY);
 setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene(P + "Lab", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 setDescription("Drag the dial - watch the idea grow");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
 labState.heat = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
 }
 });
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout;
 const heat = labState.heat ?? 0.3;
 drawBackdrop();
 drawHero(ctx, w, h, heat, heat > 0.65 ? "settle" : heat > 0.4 ? "glow" : "desk");
 const hx = w * 0.2 + heat * w * 0.6;
 ctx.fillStyle = "#818cf8"; ctx.beginPath(); ctx.arc(hx, h * 0.72, 14, 0, Math.PI * 2); ctx.fill();
 const msg = heat > 0.75 ? "Sky locked" : heat > 0.55 ? "Spin clear" : heat > 0.3 ? "Day/night forming" : "Spin blurry";
 drawLabel(ctx, msg, w * 0.5, layout.labelY);
 setHitRegions([{ id: "h", shape: "rect", x: hx, y: h * 0.72, w: 48, h: 48, meta: { action: "stretch" } }]);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene(P + "Rule", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Build the rule");
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout, prog = labState.tokenProgress || 0;
 drawBackdrop();
 ["See", "Try", "Name", "Rule"].forEach((label, i) => {
 const x = w * 0.2 + i * (w * 0.2);
 ctx.fillStyle = i < prog ? "rgba(74,222,128,0.4)" : "rgba(15,23,42,0.9)";
 roundRect(ctx, x - 40, h * 0.4 - 18, 80, 36, 10); ctx.fill();
 ctx.fillStyle = "#e2e8f0"; ctx.font = "700 12px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.4);
 });
 drawHero(ctx, w, h, 0.5, "settle");
 drawLabel(ctx, "Day & Night Sky rule", w * 0.5, layout.labelY);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene(P + "Stretch", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const modes = ["home", "school", "street", "bd", "lab"];
 setDescription("Same idea, new contexts");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.mode) { labState.mode = intent.meta.mode; pulseSuccessFeedback(200); }
 });
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout, mode = labState.mode || "home";
 drawBackdrop();
 const hits = [];
 modes.forEach((m, i) => {
 const x = w * 0.12 + i * (w * 0.17);
 ctx.fillStyle = m === mode ? "rgba(56,189,248,0.4)" : "#0f172a";
 roundRect(ctx, x - 36, layout.deskTop - 36, 72, 48, 10); ctx.fill();
 ctx.fillStyle = "#e2e8f0"; ctx.font = "600 11px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(m, x, layout.deskTop - 10);
 hits.push({ id: m, shape: "rect", x, y: layout.deskTop - 12, w: 72, h: 48, meta: { mode: m } });
 });
 drawHero(ctx, w, h, 0.55, "glow");
 drawLabel(ctx, "Transfer: " + mode, w * 0.5, layout.labelY);
 setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene(P + "Myth", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const myths = [
 { claim: "The Sun goes to sleep at night", truth: "Earth rotates - your side turns away from the Sun" },
 { claim: "Night means the Sun is gone forever", truth: "The Sun is still there; your side is in shadow" },
 { claim: "Day and night need a room lamp", truth: "Day/night come from Earth's spin relative to the Sun" },
 { claim: "Earth does not rotate", truth: "Earth spins once per day - that makes day and night" },
 { claim: "Everyone has night at the same time", truth: "When BD has night, another place can have day" },
 ];
 setDescription("Bust myths");
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
 ctx.fillStyle = phase === "truth" ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.18)";
 roundRect(ctx, w * 0.12, h * 0.28, w * 0.76, h * 0.28, 16); ctx.fill();
 drawLabel(ctx, phase === "truth" ? m.truth : "Myth: " + m.claim, w * 0.5, h * 0.42, { h: 42, font: "700 13px Segoe UI", maxW: w * 0.7 });
 drawLabel(ctx, "Myth " + (idx + 1) + " / 5 / Tap to flip", w * 0.5, layout.labelY);
 setHitRegions([{ id: "card", shape: "rect", x: w * 0.5, y: h * 0.42, w: w * 0.76, h: h * 0.28, meta: { action: "flip" } }]);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene(P + "Drill", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription(labState.prompt || "Drill");
 setTick(() => {
 const w = api.width, h = api.height;
 drawBackdrop();
 drawLabel(ctx, labState.prompt || "Day & Night Sky drill", w * 0.5, h * 0.2, { h: 32, font: "700 16px Segoe UI" });
 drawHero(ctx, w, h, 0.7, "settle");
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene(P + "Mastery", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Mastery");
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout, locked = labState.masteryStep || 0;
 drawBackdrop();
 ["Meet", "Sort", "Lab", "Rule", "Myth", "Win"].forEach((label, i) => {
 const x = w * 0.1 + i * (w * 0.14);
 ctx.fillStyle = i < locked ? "#22c55e" : "rgba(148,163,184,0.35)";
 roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8); ctx.fill();
 ctx.fillStyle = "#0f172a"; ctx.font = "600 10px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.78);
 });
 drawHero(ctx, w, h, 0.85, "settle");
 drawLabel(ctx, "Day & Night Sky mastery!", w * 0.5, layout.labelY);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });
}
