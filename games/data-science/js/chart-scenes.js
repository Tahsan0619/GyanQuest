/**
 * Data Science - Mission 1: Chart Stories (deepened Canvas 2D).
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
 ctx.strokeStyle = opts.border || "rgba(34,211,238,0.55)";
 ctx.lineWidth = 1.4;
 ctx.stroke();
 ctx.fillStyle = opts.color || "#ecfeff";
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

function drawHero(ctx, x, y, heat) {
 const h = heat ?? 0.5;
 const bars = [0.35, 0.55, 0.8 * h + 0.2, 0.45, 0.7];
 bars.forEach((b, i) => {
 const bh = 70 * b;
 ctx.fillStyle = i === 2 ? "#22d3ee" : "#0e7490";
 roundRect(ctx, x - 70 + i * 30, y + 30 - bh, 22, bh, 4); ctx.fill();
 });
 ctx.strokeStyle = "#67e8f9"; ctx.lineWidth = 2;
 ctx.beginPath(); ctx.moveTo(x - 80, y + 30); ctx.lineTo(x + 80, y + 30); ctx.stroke();
 ctx.fillStyle = "#ecfeff"; ctx.font = "700 12px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("Chart story", x, y + 52);
}

export function registerChartScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("chartMeet", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions } = api;
 labState.phase = opts.phase || labState.phase || "desk";
 setDescription("Chart Stories - meet the idea");
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout;
 const live = labState.phase || "desk";
 const heat = live === "glow" ? 0.75 : live === "settle" ? 1 : 0.35;
 drawBackdrop();
 drawHero(ctx, w * 0.5, h * 0.42, heat);
 const tips = {
 desk: "Hook: explore the props",
 glow: "Watch the idea light up",
 settle: "Big idea locked - ready to practice",
 };
 drawLabel(ctx, tips[live] || tips.desk, w * 0.5, layout.labelY);
 setHitRegions([{ id: "hero", shape: "rect", x: w * 0.5, y: h * 0.42, w: 160, h: 120, meta: { propId: "hero" } }]);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("chartSort", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } = api;
 setDescription("Drag into Chart part / Junk / Tricky.");
 const chips = [
 { id: "title", short: "Title", color: 2282478 },
 { id: "xaxis", short: "X-axis", color: 3718648 },
 { id: "yaxis", short: "Y-axis", color: 959977 },
 { id: "bars", short: "Bars", color: 2278750 },
 { id: "doodle", short: "Doodle", color: 9741240 },
 { id: "blank", short: "Blank", color: 7893356 },
 { id: "nolab", short: "No label", color: 16347926 },
 { id: "legend", short: "Legend", color: 10980346 }
 ];
 const accept = {
 part: ["title", "xaxis", "yaxis", "bars", "legend"],
 junk: ["doodle", "blank"],
 tricky: ["nolab"]
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
 { id: "part", label: "Chart part", x: w * 0.02, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#22d3ee" },
 { id: "junk", label: "Junk", x: w * 0.35, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#94a3b8" },
 { id: "tricky", label: "Tricky", x: w * 0.68, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#f97316" }
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
 const byZone = { part: [], junk: [], tricky: [] };
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
 ctx.fillStyle = labState.selectedId === c.id ? "rgba(255,255,255,0.18)" : "rgba(15,23,42,0.95)";
 roundRect(ctx, prev.x - 48, prev.y - 16, 96, 32, 8); ctx.fill();
 ctx.strokeStyle = "#" + c.color.toString(16).padStart(6, "0"); ctx.stroke();
 ctx.fillStyle = "#ecfeff"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
 ctx.fillText(c.short, prev.x, prev.y);
 hits.push({ id: c.id, shape: "rect", x: prev.x, y: prev.y, w: 100, h: 36, meta: { chipId: c.id },
 onDrag(pt) { draggingId = c.id; prev.x = Math.max(30, Math.min(w - 30, pt.x)); prev.y = Math.max(30, Math.min(h - 30, pt.y)); } });
 });
 drawLabel(ctx, "Drag into Chart part / Junk / Tricky.", w * 0.5, layout.labelY);
 setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("chartLab", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 setDescription("Chart Stories lab dial");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
 labState.heat = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
 }
 });
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout;
 const heat = labState.heat ?? 0.3;
 drawBackdrop();
 drawHero(ctx, w * 0.5, h * 0.4, heat);
 const hx = w * 0.2 + heat * w * 0.6;
 ctx.fillStyle = "#22d3ee";
 ctx.beginPath(); ctx.arc(hx, h * 0.72, 14, 0, Math.PI * 2); ctx.fill();
 drawLabel(ctx, heat >= 0.6 ? "Goal zone - looking good" : "Drag to raise the dial", w * 0.5, layout.labelY);
 setHitRegions([{ id: "h", shape: "rect", x: hx, y: h * 0.72, w: 48, h: 48, meta: { action: "stretch" } }]);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("chartRule", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Chart Stories rule");
 const tokens = ["Charts", "show", "number", "stories"];
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout, prog = labState.tokenProgress || 0;
 drawBackdrop();
 tokens.forEach((label, i) => {
 const x = w * 0.14 + i * (w * 0.2);
 ctx.fillStyle = i < prog ? "rgba(74,222,128,0.35)" : "rgba(15,23,42,0.9)";
 roundRect(ctx, x - 48, h * 0.36 - 18, 96, 36, 10); ctx.fill();
 ctx.fillStyle = "#ecfeff"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.36);
 });
 drawHero(ctx, w * 0.5, h * 0.58, Math.min(1, prog / 4));
 drawLabel(ctx, "Chart Stories rule", w * 0.5, layout.labelY);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("chartStretch", (api) => {
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
 ctx.fillStyle = m === mode ? "rgba(74,222,128,0.35)" : "#1e293b";
 roundRect(ctx, x - 36, layout.deskTop - 36, 72, 48, 10); ctx.fill();
 ctx.fillStyle = "#ecfeff"; ctx.font = "600 11px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(m, x, layout.deskTop - 10);
 hits.push({ id: m, shape: "rect", x, y: layout.deskTop - 12, w: 72, h: 48, meta: { mode: m } });
 });
 drawHero(ctx, w * 0.5, h * 0.4, 0.85);
 const captions = {
 home: "Class marks bar chart",
 school: "Rainfall line",
 street: "Shop sales bars",
 shop: "Local shop / market context",
 lab: "Classroom lab context"
 };
 drawLabel(ctx, captions[mode] || captions[modes[0]], w * 0.5, layout.labelY);
 setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("chartMyth", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const myths = [
 { claim: "Charts are only for adults", truth: "Kids can read simple bar and line stories" },
 { claim: "Taller bar always means worse", truth: "Taller usually means more of whatever the axis measures" },
 { claim: "Labels do not matter", truth: "Labels tell you what the numbers mean" },
 { claim: "One chart fits every question", truth: "Pick a chart that matches the question" },
 { claim: "Pretty doodles beat clear axes", truth: "Clear axes beat decoration" }
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
 ctx.fillStyle = phase === "truth" ? "rgba(74,222,128,0.18)" : "rgba(248,113,113,0.18)";
 roundRect(ctx, w * 0.12, h * 0.28, w * 0.76, h * 0.28, 16); ctx.fill();
 drawLabel(ctx, phase === "truth" ? m.truth : "Myth: " + m.claim, w * 0.5, h * 0.42, { h: 42, font: "700 13px Segoe UI" });
 drawLabel(ctx, "Myth " + (idx + 1) + " / 5 - Tap to flip", w * 0.5, layout.labelY);
 setHitRegions([{ id: "card", shape: "rect", x: w * 0.5, y: h * 0.42, w: w * 0.76, h: h * 0.28, meta: { action: "flip" } }]);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("chartDrill", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription(labState.prompt || "Chart Stories drill");
 setTick(() => {
 const w = api.width, h = api.height;
 drawBackdrop();
 drawLabel(ctx, labState.prompt || "Chart Stories drill", w * 0.5, h * 0.2, { h: 32, font: "700 16px Segoe UI" });
 drawHero(ctx, w * 0.5, h * 0.48, 0.9);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("chartMastery", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Chart Stories mastery.");
 const labels = ["Meet", "Sort", "Lab", "Rule", "Myth", "Chart"];
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout, locked = labState.masteryStep || 0;
 drawBackdrop();
 labels.forEach((label, i) => {
 const x = w * 0.1 + i * (w * 0.14);
 ctx.fillStyle = i < locked ? "#ecfeff" : "rgba(148,163,184,0.35)";
 roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8); ctx.fill();
 ctx.fillStyle = "#0f172a"; ctx.font = "600 10px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.78);
 });
 drawHero(ctx, w * 0.5, h * 0.4, 1);
 drawLabel(ctx, "Chart Stories!", w * 0.5, layout.labelY);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

}
