/**
 * Electronics & Robotics - Mission 1: Sensor Bot
 */
import { labState, pulseFailFeedback, pulseSuccessFeedback } from "./lab-state.js";
import { sortSlotPositions, getActiveSession } from "./activity-controller.js";

const ACCENT = "#4ade80";

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

function drawBot(ctx, x, y, phase) {
 ctx.fillStyle = "#166534";
 roundRect(ctx, x - 40, y - 30, 80, 60, 12); ctx.fill();
 ctx.strokeStyle = "#4ade80"; ctx.lineWidth = 3; ctx.stroke();
 // eyes / sensors
 ctx.fillStyle = phase === "sense" || phase === "glow" || phase === "settle" ? "#38bdf8" : "#64748b";
 ctx.beginPath(); ctx.arc(x - 14, y - 8, 8, 0, Math.PI * 2); ctx.arc(x + 14, y - 8, 8, 0, Math.PI * 2); ctx.fill();
 // brain chip
 ctx.fillStyle = phase === "decide" || phase === "glow" || phase === "settle" ? "#fbbf24" : "#475569";
 roundRect(ctx, x - 16, y + 4, 32, 16, 4); ctx.fill();
 // wheels / actuators
 ctx.fillStyle = phase === "act" || phase === "glow" || phase === "settle" ? "#f97316" : "#334155";
 ctx.beginPath(); ctx.arc(x - 28, y + 36, 10, 0, Math.PI * 2); ctx.arc(x + 28, y + 36, 10, 0, Math.PI * 2); ctx.fill();
 ctx.fillStyle = "#e2e8f0"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("bot", x, y + 58);
}
function drawPipeline(ctx, w, h, heat) {
 const steps = ["Sense", "Decide", "Act"];
 steps.forEach((s, i) => {
 const x = w * 0.22 + i * w * 0.28;
 const on = heat > (i + 1) * 0.28;
 ctx.fillStyle = on ? "rgba(74,222,128,0.35)" : "rgba(15,23,42,0.9)";
 roundRect(ctx, x - 44, h * 0.28, 88, 40, 10); ctx.fill();
 ctx.strokeStyle = on ? "#4ade80" : "#64748b"; ctx.stroke();
 ctx.fillStyle = "#e2e8f0"; ctx.font = "700 13px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText(s, x, h * 0.28 + 24);
 if (i < 2) {
 ctx.strokeStyle = on ? "#4ade80" : "#475569"; ctx.lineWidth = 3;
 ctx.beginPath(); ctx.moveTo(x + 48, h * 0.28 + 20); ctx.lineTo(x + w * 0.28 - 48, h * 0.28 + 20); ctx.stroke();
 }
 });
}

export function registerBotScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("botMeet", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions } = api;
 labState.phase = opts.phase || labState.phase || "desk";
 setDescription("Sensor Bot - sense, decide, act.");
 const props = { bot: { x: 0, y: 0 } };
 let inited = false;
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout;
 const live = labState.phase || "desk";
 drawBackdrop();
 if (!inited) { props.bot.x = w * 0.5; props.bot.y = h * 0.42; inited = true; }
 const phaseMap = { desk: "sense", glow: "decide", settle: "act" };
 drawBot(ctx, props.bot.x, props.bot.y, phaseMap[live] || "sense");
 drawPipeline(ctx, w, h * 0.85, live === "desk" ? 0.2 : live === "glow" ? 0.55 : 0.95);
 const tips = {
 desk: "Sensors gather clues from the world",
 glow: "Code decides what the clues mean",
 settle: "Motors and LEDs act on the decision",
 };
 drawLabel(ctx, tips[live] || tips.desk, w * 0.5, layout.labelY);
 setHitRegions([{ id: "bot", shape: "rect", x: props.bot.x, y: props.bot.y, w: 100, h: 100, meta: { propId: "bot" },
 onDrag(pt) { props.bot.x = Math.max(50, Math.min(w - 50, pt.x)); props.bot.y = Math.max(70, Math.min(layout.deskTop, pt.y)); } }]);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("botSort", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } = api;
 setDescription("Sort sense / decide / act");
 const chips = [
 { id: "eye", short: "Light sensor", color: 0x38bdf8 },
 { id: "bump", short: "Bump sensor", color: 0x22c55e },
 { id: "mic", short: "Mic sensor", color: 0x4ade80 },
 { id: "code", short: "If/then code", color: 0xfbbf24 },
 { id: "motor", short: "Drive motor", color: 0xf97316 },
 { id: "servo", short: "Arm servo", color: 0xa78bfa },
 { id: "led", short: "LED output", color: 0xfde68a },
 { id: "plan", short: "Choose path", color: 0xfb923c }
 ];
 const accept = {
 sense: ["eye", "bump", "mic"],
 decide: ["code", "plan"],
 act: ["motor", "servo", "led"]
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
 { id: "sense", label: "Sense", x: w * 0.020, y: zoneY, ww: w * 0.300, hh: zoneH, color: "#38bdf8" },
 { id: "decide", label: "Decide", x: w * 0.340, y: zoneY, ww: w * 0.300, hh: zoneH, color: "#fbbf24" },
 { id: "act", label: "Act", x: w * 0.660, y: zoneY, ww: w * 0.300, hh: zoneH, color: "#f97316" }
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
 const byZone = { sense: [], decide: [], act: [] };
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
 targetX = w * 0.12 + (idx % 4) * (w * 0.200);
 targetY = zoneY + zoneH + 36 + Math.floor(idx / 4) * 48;
 }
 const prev = cardPos[c.id];
 if (!prev.x && !prev.y) { prev.x = targetX; prev.y = targetY; }
 if (draggingId !== c.id) { prev.x += (targetX - prev.x) * ease; prev.y += (targetY - prev.y) * ease; }
 ctx.fillStyle = labState.selectedId === c.id ? "rgba(56,189,248,0.4)" : "rgba(15,23,42,0.95)";
 roundRect(ctx, prev.x - 48, prev.y - 16, 96, 32, 8); ctx.fill();
 ctx.strokeStyle = "#" + c.color.toString(16).padStart(6, "0"); ctx.stroke();
 ctx.fillStyle = "#e2e8f0"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
 ctx.fillText(c.short, prev.x, prev.y);
 hits.push({ id: c.id, shape: "rect", x: prev.x, y: prev.y, w: 100, h: 36, meta: { chipId: c.id },
 onDrag(pt) { draggingId = c.id; prev.x = Math.max(30, Math.min(w - 30, pt.x)); prev.y = Math.max(30, Math.min(h - 30, pt.y)); } });
 });
 drawLabel(ctx, "Sort sense / decide / act", w * 0.5, layout.labelY);
 setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("botLab", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 setDescription("Dial the sense-decide-act loop.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
 labState.heat = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
 }
 });
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout;
 const heat = labState.heat ?? 0.3;
 drawBackdrop();
 drawPipeline(ctx, w, h, heat);
 const p = heat < 0.33 ? "sense" : heat < 0.66 ? "decide" : "act";
 drawBot(ctx, w * 0.5, h * 0.55, p);
 const hx = w * 0.2 + heat * w * 0.6;
 ctx.fillStyle = "#4ade80"; ctx.beginPath(); ctx.arc(hx, h * 0.78, 14, 0, Math.PI * 2); ctx.fill();
 drawLabel(ctx, heat >= 0.6 ? "Loop running - sense to act" : "Drag to complete sense-decide-act", w * 0.5, layout.labelY);
 setHitRegions([{ id: "h", shape: "rect", x: hx, y: h * 0.78, w: 48, h: 48, meta: { action: "stretch" } }]);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("botRule", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Sensor Bot rule");
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout, prog = labState.tokenProgress || 0;
 drawBackdrop();
 ["Sense", "->", "decide", "-> act"].forEach((label, i) => {
 const x = w * 0.14 + i * (w * 0.2);
 ctx.fillStyle = i < prog ? "rgba(74,222,128,0.4)" : "rgba(15,23,42,0.9)";
 roundRect(ctx, x - 48, h * 0.36 - 18, 96, 36, 10); ctx.fill();
 ctx.fillStyle = "#e2e8f0"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.36);
 });
 drawBot(ctx, w * 0.5, h * 0.58, 'act');
 drawLabel(ctx, "Sensor Bot rule", w * 0.5, layout.labelY);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("botStretch", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const modes = ["home", "school", "street", "shop", "lab"];
 setDescription("Same idea in places you know.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.mode) { labState.mode = intent.meta.mode; pulseSuccessFeedback(200); }
 });
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout, mode = labState.mode || modes[0];
 drawBackdrop();
 const hits = [];
 modes.forEach((m, i) => {
 const x = w * 0.12 + i * (w * 0.17);
 ctx.fillStyle = m === mode ? "rgba(56,189,248,0.4)" : "#1e293b";
 roundRect(ctx, x - 36, layout.deskTop - 36, 72, 48, 10); ctx.fill();
 ctx.fillStyle = "#e2e8f0"; ctx.font = "600 11px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(m, x, layout.deskTop - 10);
 hits.push({ id: m, shape: "rect", x, y: layout.deskTop - 12, w: 72, h: 48, meta: { mode: m } });
 });
 drawBot(ctx, w * 0.5, h * 0.4, 'act');
 const captions = {
 home: "Vacuum bot senses walls then turns",
 school: "Line-follower kit: sense line, decide, drive",
 street: "Traffic lights sense cars (simple loop)",
 shop: "Door sensor opens the gate",
 lab: "Lab: wire sensor to motor with code"
 };
 drawLabel(ctx, captions[mode] || mode, w * 0.5, layout.labelY);
 setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("botMyth", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const myths = [
 { claim: "Robots move with no sensing", truth: "Sensors feed data so the bot can decide" },
 { claim: "Code is optional decoration", truth: "Code decides what to do with sensor data" },
 { claim: "Motors sense the world alone", truth: "Motors act; sensors sense" },
 { claim: "Wishing hard steers the robot", truth: "Sense, decide, then act - not wishes" },
 { claim: "Only factory robots use this loop", truth: "School bots use sense-decide-act too" }
 ];
 setDescription("Bust myths.");
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
 drawLabel(ctx, phase === "truth" ? m.truth : "Myth: " + m.claim, w * 0.5, h * 0.42, { h: 42, font: "700 13px Segoe UI" });
 drawLabel(ctx, "Myth " + (idx + 1) + " / 5 - Tap to flip", w * 0.5, layout.labelY);
 setHitRegions([{ id: "card", shape: "rect", x: w * 0.5, y: h * 0.42, w: w * 0.76, h: h * 0.28, meta: { action: "flip" } }]);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("botDrill", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription(labState.prompt || "Bot drill");
 setTick(() => {
 const w = api.width, h = api.height;
 drawBackdrop();
 drawLabel(ctx, labState.prompt || "Bot drill", w * 0.5, h * 0.2, { h: 32, font: "700 16px Segoe UI" });
 drawBot(ctx, w * 0.5, h * 0.48, 'act');
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("botMastery", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Bot Builder!");
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout, locked = labState.masteryStep || 0;
 drawBackdrop();
 ["Meet", "Sort", "Lab", "Rule", "Myth", "Win"].forEach((label, i) => {
 const x = w * 0.1 + i * (w * 0.14);
 ctx.fillStyle = i < locked ? "#22c55e" : "rgba(148,163,184,0.35)";
 roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8); ctx.fill();
 ctx.fillStyle = "#0f172a"; ctx.font = "600 10px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.78);
 });
 drawBot(ctx, w * 0.5, h * 0.48, 'act');
 drawLabel(ctx, "Bot Builder!", w * 0.5, layout.labelY);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });
}
