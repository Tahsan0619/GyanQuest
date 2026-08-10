/**
 * Web Dev Studio · Mission 3: JS Click - events make pages react.
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
 ctx.fillStyle = opts.color || "#fef9c3";
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

function drawBigButton(ctx, x, y, pressed, heat) {
 const lift = pressed ? 2 : 8;
 ctx.fillStyle = "#854d0e";
 roundRect(ctx, x - 70, y - 22 + lift, 140, 52, 14);
 ctx.fill();
 ctx.fillStyle = pressed ? "#eab308" : "#facc15";
 roundRect(ctx, x - 70, y - 22, 140, 52, 14);
 ctx.fill();
 ctx.strokeStyle = "#fef08a";
 ctx.lineWidth = 2;
 ctx.stroke();
 ctx.fillStyle = "#422006";
 ctx.font = "800 16px Segoe UI";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText("CLICK ME", x, y + 4);
 // spark rings by heat
 if (heat > 0.2) {
 ctx.strokeStyle = `rgba(250,204,21,${0.2 + heat * 0.6})`;
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.arc(x, y, 55 + heat * 40, 0, Math.PI * 2);
 ctx.stroke();
 }
}

function drawReactionBubble(ctx, x, y, text, on) {
 ctx.fillStyle = on ? "rgba(250,204,21,0.9)" : "rgba(30,41,59,0.85)";
 roundRect(ctx, x - 60, y - 18, 120, 36, 12);
 ctx.fill();
 ctx.fillStyle = on ? "#422006" : "#94a3b8";
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(text, x, y);
}

function drawCodeSpark(ctx, x, y, on) {
 ctx.fillStyle = on ? "#fde047" : "#334155";
 roundRect(ctx, x - 50, y - 24, 100, 48, 8);
 ctx.fill();
 ctx.fillStyle = on ? "#422006" : "#64748b";
 ctx.font = "700 11px Consolas, monospace";
 ctx.textAlign = "center";
 ctx.fillText("onClick()", x, y - 4);
 ctx.fillText("{ change }", x, y + 12);
}

export function registerJsScenes(arena) {
 if (!arena?.registerScene) return;
 const P = "js";

 arena.registerScene(P + "Meet", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions, setIntentHandler } = api;
 labState.phase = opts.phase || labState.phase || "desk";
 setDescription("JS Click - a click runs code that changes the page.");
 let pressed = false;
 let pressUntil = 0;
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "click") {
 pressed = true;
 pressUntil = performance.now() + 220;
 labState.clickCount = (labState.clickCount || 0) + 1;
 labState.heat = Math.min(1, (labState.heat || 0.2) + 0.12);
 pulseSuccessFeedback(200);
 }
 });
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout;
 const live = labState.phase || "desk";
 const heat = labState.heat || 0.25;
 if (performance.now() > pressUntil) pressed = false;
 drawBackdrop();
 drawBigButton(ctx, w * 0.5, h * 0.42, pressed || live === "glow", heat);
 drawCodeSpark(ctx, w * 0.22, h * 0.58, live !== "desk" || heat > 0.4);
 drawReactionBubble(ctx, w * 0.78, h * 0.58, heat > 0.4 ? "Changed!" : "Waiting...", heat > 0.4 || live === "settle");
 if (live === "glow" || live === "settle") {
 ctx.strokeStyle = "rgba(250,204,21,0.55)";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.moveTo(w * 0.5 - 70, h * 0.42);
 ctx.lineTo(w * 0.22 + 50, h * 0.58);
 ctx.lineTo(w * 0.78 - 60, h * 0.58);
 ctx.stroke();
 }
 const tips = {
 desk: "Tap CLICK ME - event starts here",
 glow: "Click runs code - page can change",
 settle: "Event · code · change = alive page",
 };
 drawLabel(ctx, tips[live] || tips.desk, w * 0.5, layout.labelY);
 setHitRegions([{ id: "btn", shape: "rect", x: w * 0.5, y: h * 0.42, w: 150, h: 60, meta: { action: "click" } }]);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene(P + "Sort", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } = api;
 setDescription("Sort: click reaction vs static vs not JS.");
 const chips = [
 { id: "btn", short: "Button click", color: 0xfacc15 },
 { id: "toggle", short: "Show/hide", color: 0xeab308 },
 { id: "count", short: "Score +1", color: 0xfde047 },
 { id: "alert", short: "Pop message", color: 0xfef08a },
 { id: "h1", short: "<h1>", color: 0xea580c },
 { id: "color", short: "color:red", color: 0x38bdf8 },
 { id: "rock", short: "Rock", color: 0x94a3b8 },
 { id: "tea", short: "Tea", color: 0xf472b6 },
 ];
 const accept = {
 react: ["btn", "toggle", "count", "alert"],
 static: ["h1", "color"],
 not: ["rock", "tea"],
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
 { id: "react", label: "Click reaction", x: w * 0.02, y: zoneY, ww: w * 0.31, hh: zoneH, color: "#facc15" },
 { id: "static", label: "Static look", x: w * 0.35, y: zoneY, ww: w * 0.31, hh: zoneH, color: "#38bdf8" },
 { id: "not", label: "Not JS", x: w * 0.68, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#94a3b8" },
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
 const byZone = { react: [], static: [], not: [] };
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
 ctx.fillStyle = "#fef9c3"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
 ctx.fillText(c.short, prev.x, prev.y);
 hits.push({ id: c.id, shape: "rect", x: prev.x, y: prev.y, w: 100, h: 36, meta: { chipId: c.id },
 onDrag(pt) { draggingId = c.id; prev.x = Math.max(30, Math.min(w - 30, pt.x)); prev.y = Math.max(30, Math.min(h - 30, pt.y)); } });
 });
 drawLabel(ctx, "Click reaction · Static look · Not JS", w * 0.5, layout.labelY);
 setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene(P + "Lab", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 setDescription("Dial click energy - watch the reaction grow.");
 let pressed = false;
 let pressUntil = 0;
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
 labState.heat = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
 labState.clickCount = Math.round((labState.heat || 0) * 10);
 }
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "click") {
 pressed = true;
 pressUntil = performance.now() + 200;
 labState.heat = Math.min(1, (labState.heat || 0) + 0.08);
 pulseSuccessFeedback(180);
 }
 });
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout;
 const heat = labState.heat ?? 0.3;
 if (performance.now() > pressUntil) pressed = false;
 drawBackdrop();
 drawBigButton(ctx, w * 0.5, h * 0.36, pressed, heat);
 drawReactionBubble(ctx, w * 0.5, h * 0.55, "Energy " + Math.round(heat * 100) + "%", heat >= 0.6);
 drawCodeSpark(ctx, w * 0.5, h * 0.68, heat >= 0.45);
 const hx = w * 0.2 + heat * w * 0.6;
 ctx.fillStyle = "#facc15";
 ctx.beginPath(); ctx.arc(hx, h * 0.82, 14, 0, Math.PI * 2); ctx.fill();
 drawLabel(ctx, heat >= 0.6 ? "Alive! Click energy is strong" : "Drag dial or tap the button", w * 0.5, layout.labelY);
 setHitRegions([
 { id: "h", shape: "rect", x: hx, y: h * 0.82, w: 48, h: 48, meta: { action: "stretch" } },
 { id: "btn", shape: "rect", x: w * 0.5, y: h * 0.36, w: 150, h: 60, meta: { action: "click" } },
 ]);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene(P + "Rule", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Event · Code · Change · Alive.");
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout, prog = labState.tokenProgress || 0;
 drawBackdrop();
 ["Event", "Code", "Change", "Alive"].forEach((label, i) => {
 const x = w * 0.18 + i * (w * 0.18);
 ctx.fillStyle = i < prog ? "rgba(250,204,21,0.45)" : "rgba(15,23,42,0.9)";
 roundRect(ctx, x - 44, h * 0.3 - 18, 88, 36, 10); ctx.fill();
 ctx.fillStyle = "#fef9c3"; ctx.font = "700 12px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.3);
 });
 drawBigButton(ctx, w * 0.5, h * 0.55, prog >= 3, 0.8);
 drawLabel(ctx, "JS Click rule", w * 0.5, layout.labelY);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene(P + "Stretch", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const modes = [
 { id: "game", label: "Game" },
 { id: "form", label: "Form" },
 { id: "kiosk", label: "Kiosk" },
 { id: "class", label: "Quiz" },
 { id: "home", label: "Lamp" },
 ];
 setDescription("Same click idea in real places.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.mode) { labState.mode = intent.meta.mode; pulseSuccessFeedback(200); }
 });
 function drawMode(mode, cx, cy) {
 if (mode === "game") {
 drawBigButton(ctx, cx, cy, false, 0.7);
 ctx.fillStyle = "#fef08a"; ctx.font = "700 12px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("START", cx, cy - 50);
 } else if (mode === "form") {
 ctx.fillStyle = "#1e293b"; roundRect(ctx, cx - 80, cy - 50, 160, 100, 10); ctx.fill();
 ctx.fillStyle = "#334155"; roundRect(ctx, cx - 60, cy - 30, 120, 24, 4); ctx.fill();
 ctx.fillStyle = "#facc15"; roundRect(ctx, cx - 40, cy + 20, 80, 28, 8); ctx.fill();
 ctx.fillStyle = "#422006"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("Submit", cx, cy + 36);
 } else if (mode === "kiosk") {
 ctx.fillStyle = "#334155"; roundRect(ctx, cx - 55, cy - 70, 110, 140, 8); ctx.fill();
 ctx.fillStyle = "#facc15"; roundRect(ctx, cx - 35, cy - 20, 70, 40, 8); ctx.fill();
 ctx.fillStyle = "#422006"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("TAP", cx, cy);
 ctx.fillStyle = "#94a3b8"; ctx.font = "600 10px Segoe UI";
 ctx.fillText("ticket →", cx, cy + 50);
 } else if (mode === "class") {
 ["A", "B", "C"].forEach((letter, i) => {
 ctx.fillStyle = i === 1 ? "#facc15" : "#334155";
 roundRect(ctx, cx - 70 + i * 50, cy - 24, 42, 48, 8); ctx.fill();
 ctx.fillStyle = i === 1 ? "#422006" : "#e2e8f0"; ctx.font = "800 16px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText(letter, cx - 49 + i * 50, cy);
 });
 } else {
 ctx.fillStyle = labState.heat > 0.4 ? "#fde047" : "#334155";
 ctx.beginPath(); ctx.arc(cx, cy - 20, 28, 0, Math.PI * 2); ctx.fill();
 ctx.fillStyle = "#facc15"; roundRect(ctx, cx - 35, cy + 30, 70, 28, 8); ctx.fill();
 ctx.fillStyle = "#422006"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("Toggle", cx, cy + 46);
 }
 }
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout, mode = labState.mode || "game";
 drawBackdrop();
 const hits = [];
 modes.forEach((m, i) => {
 const x = w * 0.12 + i * (w * 0.17);
 ctx.fillStyle = m.id === mode ? "rgba(250,204,21,0.45)" : "#1e293b";
 roundRect(ctx, x - 36, layout.deskTop - 36, 72, 48, 10); ctx.fill();
 ctx.fillStyle = "#fef9c3"; ctx.font = "600 11px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(m.label, x, layout.deskTop - 10);
 hits.push({ id: m.id, shape: "rect", x, y: layout.deskTop - 12, w: 72, h: 48, meta: { mode: m.id } });
 });
 drawMode(mode, w * 0.5, h * 0.42);
 const captions = {
 game: "Game Start button - click runs code",
 form: "Submit form - click sends your answer",
 kiosk: "BD ticket kiosk - tap to print ticket",
 class: "Quiz app - tap A/B/C to score",
 home: "Lamp switch app - tap toggles light",
 };
 drawLabel(ctx, captions[mode], w * 0.5, layout.labelY);
 setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene(P + "Myth", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const myths = [
 { claim: "Pages never need clicks", truth: "Many pages wake up when you click or tap", kind: "static" },
 { claim: "JavaScript is only for games", truth: "Forms, quizzes, and switches use it too", kind: "games" },
 { claim: "HTML alone makes buttons react", truth: "A reaction needs an event + code", kind: "html" },
 { claim: "Kids cannot learn click code", truth: "Event then change is a clear starter idea", kind: "kids" },
 { claim: "One click must do everything forever", truth: "Each click can run a small clear change", kind: "all" },
 ];
 setDescription("Bust JS myths.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "flip") {
 labState.mythPhase = labState.mythPhase === "truth" ? "claim" : "truth";
 if (labState.mythPhase === "truth") pulseSuccessFeedback(220);
 }
 });
 function drawMythDiagram(kind, phase, cx, cy) {
 if (phase === "claim") {
 if (kind === "static") {
 ctx.fillStyle = "#334155"; roundRect(ctx, cx - 70, cy - 40, 140, 80, 8); ctx.fill();
 ctx.fillStyle = "#94a3b8"; ctx.font = "700 12px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("Frozen page", cx, cy);
 ctx.fillText("(no click)", cx, cy + 20);
 } else if (kind === "game") {
 ctx.fillStyle = "#854d0e"; roundRect(ctx, cx - 40, cy - 40, 80, 80, 8); ctx.fill();
 ctx.fillStyle = "#fef08a"; ctx.font = "800 28px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("🎮", cx, cy + 8);
 } else if (kind === "html") {
 ctx.fillStyle = "#ea580c"; roundRect(ctx, cx - 60, cy - 24, 120, 48, 8); ctx.fill();
 ctx.fillStyle = "#fff"; ctx.font = "700 12px Consolas"; ctx.textAlign = "center";
 ctx.fillText("<button> alone", cx, cy);
 } else if (kind === "kids") {
 ctx.fillStyle = "#334155"; roundRect(ctx, cx - 50, cy - 40, 100, 80, 8); ctx.fill();
 ctx.fillStyle = "#f87171"; ctx.font = "800 28px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("🚫", cx, cy);
 } else {
 ctx.fillStyle = "#f87171"; roundRect(ctx, cx - 80, cy - 30, 160, 60, 10); ctx.fill();
 ctx.fillStyle = "#fff"; ctx.font = "700 12px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("ONE CLICK = ALL", cx, cy);
 }
 return;
 }
 if (kind === "static") {
 drawBigButton(ctx, cx, cy, true, 0.8);
 drawReactionBubble(ctx, cx, cy + 55, "Changed!", true);
 } else if (kind === "game") {
 drawBigButton(ctx, cx - 50, cy, false, 0.5);
 ctx.fillStyle = "#facc15"; roundRect(ctx, cx + 20, cy - 20, 70, 40, 8); ctx.fill();
 ctx.fillStyle = "#422006"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("Form too", cx + 55, cy);
 } else if (kind === "html") {
 drawBigButton(ctx, cx - 40, cy, true, 0.6);
 drawCodeSpark(ctx, cx + 70, cy, true);
 } else if (kind === "kids") {
 ctx.fillStyle = "#22c55e"; ctx.font = "700 14px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("Event → Code → Change", cx, cy);
 } else {
 ["+1", "hide", "msg"].forEach((t, i) => {
 ctx.fillStyle = "#facc15"; roundRect(ctx, cx - 90 + i * 65, cy - 20, 55, 40, 8); ctx.fill();
 ctx.fillStyle = "#422006"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText(t, cx - 62 + i * 65, cy);
 });
 }
 }
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout;
 const idx = labState.myth ?? 0, phase = labState.mythPhase || "claim", m = myths[idx] || myths[0];
 drawBackdrop();
 ctx.fillStyle = phase === "truth" ? "rgba(250,204,21,0.22)" : "rgba(248,113,113,0.18)";
 roundRect(ctx, w * 0.1, h * 0.12, w * 0.8, 40, 12); ctx.fill();
 drawLabel(ctx, phase === "truth" ? m.truth : "Myth: " + m.claim, w * 0.5, h * 0.14 + 10, { h: 28, font: "700 13px Segoe UI" });
 drawMythDiagram(m.kind, phase, w * 0.5, h * 0.48);
 drawLabel(ctx, "Myth " + (idx + 1) + " / 5 · Tap diagram to flip", w * 0.5, layout.labelY);
 setHitRegions([{ id: "card", shape: "rect", x: w * 0.5, y: h * 0.45, w: w * 0.8, h: h * 0.5, meta: { action: "flip" } }]);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene(P + "Drill", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription(labState.prompt || "JS drill");
 setTick(() => {
 const w = api.width, h = api.height;
 const prompt = (labState.prompt || "JS").toLowerCase();
 drawBackdrop();
 drawLabel(ctx, labState.prompt || "JS Click drill", w * 0.5, h * 0.14, { h: 32, font: "700 16px Segoe UI" });
 const cx = w * 0.5, cy = h * 0.48;
 if (prompt.includes("event")) {
 drawBigButton(ctx, cx, cy, true, 0.5);
 ctx.fillStyle = "#fef08a"; ctx.font = "700 12px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("← event", cx, cy + 55);
 } else if (prompt.includes("code")) {
 drawCodeSpark(ctx, cx, cy, true);
 } else if (prompt.includes("h1")) {
 ctx.fillStyle = "#ea580c"; roundRect(ctx, cx - 50, cy - 20, 100, 40, 8); ctx.fill();
 ctx.fillStyle = "#fff"; ctx.font = "800 16px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("<h1>", cx, cy);
 } else if (prompt.includes("score")) {
 ctx.fillStyle = "#facc15"; roundRect(ctx, cx - 50, cy - 30, 100, 60, 12); ctx.fill();
 ctx.fillStyle = "#422006"; ctx.font = "800 22px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("+1", cx, cy);
 } else if (prompt.includes("tea")) {
 ctx.fillStyle = "#f472b6"; roundRect(ctx, cx - 50, cy - 30, 100, 60, 12); ctx.fill();
 ctx.fillStyle = "#831843"; ctx.font = "700 14px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("🍵 Tea", cx, cy); ctx.font = "600 11px Segoe UI";
 ctx.fillText("not JS", cx, cy + 20);
 } else if (prompt.includes("alive")) {
 drawBigButton(ctx, cx, cy, true, 0.9);
 drawReactionBubble(ctx, cx, cy + 55, "Alive!", true);
 } else {
 drawBigButton(ctx, cx, cy, false, 0.75);
 }
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene(P + "Mastery", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Click Coder mastery.");
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout, locked = labState.masteryStep || 0;
 drawBackdrop();
 ["Meet", "Sort", "Lab", "Rule", "Myth", "Code"].forEach((label, i) => {
 const x = w * 0.1 + i * (w * 0.14);
 ctx.fillStyle = i < locked ? "#facc15" : "rgba(148,163,184,0.35)";
 roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8); ctx.fill();
 ctx.fillStyle = "#0f172a"; ctx.font = "600 10px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.78);
 });
 drawBigButton(ctx, w * 0.32, h * 0.38, true, 0.9);
 drawCodeSpark(ctx, w * 0.58, h * 0.32, true);
 drawReactionBubble(ctx, w * 0.78, h * 0.38, "Changed!", true);
 ctx.fillStyle = "rgba(250,204,21,0.92)";
 roundRect(ctx, w * 0.52, h * 0.52, w * 0.36, 40, 12); ctx.fill();
 ctx.fillStyle = "#422006"; ctx.font = "800 15px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("Click Coder", w * 0.7, h * 0.555);
 drawLabel(ctx, "Click Coder!", w * 0.5, layout.labelY);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });
}
