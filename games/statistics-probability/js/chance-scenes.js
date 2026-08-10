/**
 * Statistics \u00b7 Mission 2: Chance Games - Canvas 2D scenes (Tiny Bits depth).
 * Coin, die, spinner, fair shares, BD chance stretch.
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
 ctx.fillStyle = opts.bg || "rgba(69, 26, 3, 0.92)";
 roundRect(ctx, x - tw / 2, y - bh / 2, tw, bh, 10);
 ctx.fill();
 ctx.strokeStyle = opts.border || "rgba(251,191,36,0.55)";
 ctx.lineWidth = 1.4;
 ctx.stroke();
 ctx.fillStyle = opts.color || "#fef3c7";
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
 ctx.fillStyle = `rgba(251,191,36,${Math.max(0, (until - performance.now()) / 380) * 0.22})`;
 ctx.fillRect(0, 0, w, h);
}

function drawCoin(ctx, x, y, bias, pulse) {
 ctx.fillStyle = "#fbbf24";
 ctx.beginPath(); ctx.arc(x, y, 36, 0, Math.PI * 2); ctx.fill();
 ctx.strokeStyle = "#b45309"; ctx.lineWidth = 3; ctx.stroke();
 ctx.fillStyle = "#78350f";
 ctx.font = "800 22px Segoe UI"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
 ctx.fillText(bias >= 0.45 && bias <= 0.55 ? "H/T" : bias > 0.55 ? "H!" : "T!", x, y);
 ctx.fillStyle = `rgba(253,230,138,${0.3 + pulse * 0.4})`;
 ctx.font = "700 11px Segoe UI";
 ctx.fillText("coin", x, y + 52);
}
function drawDie(ctx, x, y, face) {
 ctx.fillStyle = "#fef3c7";
 roundRect(ctx, x - 32, y - 32, 64, 64, 10); ctx.fill();
 ctx.strokeStyle = "#b45309"; ctx.lineWidth = 3; ctx.stroke();
 const dots = {
 1: [[0, 0]], 2: [[-12, -12], [12, 12]], 3: [[-12, -12], [0, 0], [12, 12]],
 4: [[-12, -12], [12, -12], [-12, 12], [12, 12]],
 5: [[-12, -12], [12, -12], [0, 0], [-12, 12], [12, 12]],
 6: [[-12, -12], [12, -12], [-12, 0], [12, 0], [-12, 12], [12, 12]],
 };
 ctx.fillStyle = "#78350f";
 (dots[face] || dots[1]).forEach(([dx, dy]) => {
 ctx.beginPath(); ctx.arc(x + dx, y + dy, 5, 0, Math.PI * 2); ctx.fill();
 });
 ctx.fillStyle = "#fef3c7"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("die 1/6", x, y + 50);
}
function drawSpinner(ctx, x, y, heat) {
 const rot = heat * Math.PI * 2;
 ctx.save();
 ctx.translate(x, y);
 ctx.rotate(rot);
 ["#fbbf24", "#f59e0b", "#fde68a", "#d97706"].forEach((c, i) => {
 ctx.fillStyle = c;
 ctx.beginPath();
 ctx.moveTo(0, 0);
 ctx.arc(0, 0, 40, (i / 4) * Math.PI * 2, ((i + 1) / 4) * Math.PI * 2);
 ctx.closePath();
 ctx.fill();
 });
 ctx.restore();
 ctx.fillStyle = "#0f172a";
 ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill();
 ctx.fillStyle = "#fef3c7"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("spinner", x, y + 56);
}

export function registerChanceScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("chanceMeet", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions } = api;
 labState.phase = opts.phase || labState.phase || "desk";
 setDescription("Chance Games - fair shares of outcomes.");
 const props = { coin: { x: 0, y: 0 }, die: { x: 0, y: 0 }, spin: { x: 0, y: 0 } };
 let inited = false;
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout;
 const live = labState.phase || "desk";
 const pulse = labState.heat || 0.4;
 const bias = labState.coinBias ?? 0.5;
 const face = labState.dieFace || 1;
 drawBackdrop();
 if (!inited) {
 props.coin.x = w * 0.22; props.coin.y = h * 0.42;
 props.die.x = w * 0.5; props.die.y = h * 0.42;
 props.spin.x = w * 0.78; props.spin.y = h * 0.42;
 inited = true;
 }
 ctx.fillStyle = "#78350f";
 roundRect(ctx, w * 0.08, layout.deskTop - 8, w * 0.84, 18, 8);
 ctx.fill();
 drawCoin(ctx, props.coin.x, props.coin.y, bias, pulse);
 drawDie(ctx, props.die.x, props.die.y, face);
 drawSpinner(ctx, props.spin.x, props.spin.y, live === "desk" ? 0.1 : pulse);
 if (live === "glow" || live === "settle") {
 ctx.strokeStyle = "rgba(251,191,36,0.55)";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.moveTo(props.coin.x + 36, props.coin.y);
 ctx.lineTo(props.die.x - 32, props.die.y);
 ctx.lineTo(props.spin.x - 40, props.spin.y);
 ctx.stroke();
 }
 const tips = {
 desk: "Drag coin, die, spinner - chance tools",
 glow: "Fair coin 1/2 \u00b7 fair die 1/6",
 settle: "P = favorable / possible (a share)",
 };
 drawLabel(ctx, tips[live] || tips.desk, w * 0.5, layout.labelY);
 const hits = [];
 for (const [id, p] of Object.entries(props)) {
 hits.push({
 id, shape: "rect", x: p.x, y: p.y, w: 90, h: 100, meta: { propId: id },
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

 arena.registerScene("chanceSort", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } = api;
 setDescription("Sort: likely, unlikely, or impossible.");
 const chips = [
 { id: "heads", short: "Heads", color: 0xfbbf24 },
 { id: "six", short: "Six", color: 0xf59e0b },
 { id: "seven", short: "Seven", color: 0xef4444 },
 { id: "both", short: "Both", color: 0xf87171 },
 { id: "any", short: "Any face", color: 0xfde68a },
 { id: "dbl", short: "2 sixes", color: 0xf97316 },
 { id: "rain", short: "Maybe rain", color: 0xd97706 },
 { id: "neg", short: "Neg face", color: 0x94a3b8 },
 ];
 const accept = {
 likely: ["heads", "six", "any", "rain"],
 unlikely: ["dbl"],
 impossible: ["seven", "both", "neg"],
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
 { id: "likely", label: "Likely / possible", x: w * 0.02, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#fbbf24" },
 { id: "unlikely", label: "Unlikely", x: w * 0.35, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#f97316" },
 { id: "impossible", label: "Impossible", x: w * 0.68, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#ef4444" },
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
 const byZone = { likely: [], unlikely: [], impossible: [] };
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
 ctx.fillStyle = labState.selectedId === c.id ? "rgba(251,191,36,0.4)" : "rgba(15,23,42,0.95)";
 roundRect(ctx, prev.x - 48, prev.y - 16, 96, 32, 8); ctx.fill();
 ctx.strokeStyle = "#" + c.color.toString(16).padStart(6, "0"); ctx.stroke();
 ctx.fillStyle = "#fef3c7"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
 ctx.fillText(c.short, prev.x, prev.y);
 hits.push({ id: c.id, shape: "rect", x: prev.x, y: prev.y, w: 100, h: 36, meta: { chipId: c.id },
 onDrag(pt) { draggingId = c.id; prev.x = Math.max(30, Math.min(w - 30, pt.x)); prev.y = Math.max(30, Math.min(h - 30, pt.y)); } });
 });
 drawLabel(ctx, "Likely \u00b7 Unlikely \u00b7 Impossible", w * 0.5, layout.labelY);
 setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("chanceLab", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 setDescription("Dial fairness - watch coin bias and trials.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
 labState.heat = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
 labState.coinBias = 0.2 + labState.heat * 0.6;
 labState.trials = Math.round(labState.heat * 40);
 labState.dieFace = 1 + Math.floor(labState.heat * 5.99);
 }
 });
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout;
 const heat = labState.heat ?? 0.3;
 const bias = labState.coinBias ?? 0.5;
 drawBackdrop();
 drawCoin(ctx, w * 0.28, h * 0.4, bias, heat);
 drawDie(ctx, w * 0.55, h * 0.4, labState.dieFace || 1);
 drawSpinner(ctx, w * 0.78, h * 0.4, heat);
 const hx = w * 0.2 + heat * w * 0.6;
 ctx.fillStyle = "#fbbf24";
 ctx.beginPath(); ctx.arc(hx, h * 0.72, 14, 0, Math.PI * 2); ctx.fill();
 const fair = bias >= 0.45 && bias <= 0.55;
 drawLabel(ctx, fair && heat >= 0.6 ? "Fair share ~1/2 \u00b7 trials " + (labState.trials || 0) : "Drag toward a fair coin share", w * 0.5, layout.labelY);
 setHitRegions([{ id: "h", shape: "rect", x: hx, y: h * 0.72, w: 48, h: 48, meta: { action: "stretch" } }]);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("chanceRule", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("P = favorable / possible.");
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout, prog = labState.tokenProgress || 0;
 drawBackdrop();
 ["Favorable", "/", "Possible", "= P"].forEach((label, i) => {
 const x = w * 0.18 + i * (w * 0.18);
 ctx.fillStyle = i < prog ? "rgba(251,191,36,0.4)" : "rgba(15,23,42,0.9)";
 roundRect(ctx, x - 48, h * 0.36 - 18, 96, 36, 10); ctx.fill();
 ctx.fillStyle = "#fef3c7"; ctx.font = "700 12px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.36);
 });
 drawCoin(ctx, w * 0.4, h * 0.58, 0.5, 0.7);
 drawDie(ctx, w * 0.65, h * 0.58, 6);
 drawLabel(ctx, "Chance rule", w * 0.5, layout.labelY);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("chanceStretch", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const modes = ["toss", "ludo", "spinner", "weather", "queue"];
 setDescription("Same chance idea in Bangladesh stories.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.mode) { labState.mode = intent.meta.mode; pulseSuccessFeedback(200); }
 });
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout, mode = labState.mode || "toss";
 drawBackdrop();
 const hits = [];
 modes.forEach((m, i) => {
 const x = w * 0.12 + i * (w * 0.17);
 ctx.fillStyle = m === mode ? "rgba(251,191,36,0.4)" : "#78350f";
 roundRect(ctx, x - 36, layout.deskTop - 36, 72, 48, 10); ctx.fill();
 ctx.fillStyle = "#fef3c7"; ctx.font = "600 11px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(m, x, layout.deskTop - 10);
 hits.push({ id: m, shape: "rect", x, y: layout.deskTop - 12, w: 72, h: 48, meta: { mode: m } });
 });
 drawCoin(ctx, w * 0.35, h * 0.4, 0.5, 0.5);
 drawDie(ctx, w * 0.65, h * 0.4, 4);
 const captions = {
 toss: "Cricket toss - fair coin ~1/2",
 ludo: "Ludo die - each face 1/6",
 spinner: "Fun-fair spinner - equal slices if fair",
 weather: "Rain chance - a share, not a promise",
 queue: "Who is next - equal turns if fair",
 };
 drawLabel(ctx, captions[mode], w * 0.5, layout.labelY);
 setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("chanceMyth", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const myths = [
 { claim: "After five heads, tails is due", truth: "Fair coin has no memory - still about 1/2" },
 { claim: "Probability can be bigger than 1", truth: "A share stays between 0 and 1" },
 { claim: "Die face 7 is just unlikely", truth: "Face 7 is impossible on a standard die" },
 { claim: "More trials never help", truth: "More fair trials usually settle closer to the true share" },
 { claim: "Only casinos use probability", truth: "Tosses, games, and weather all use chance ideas" },
 ];
 setDescription("Bust chance myths.");
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
 ctx.fillStyle = phase === "truth" ? "rgba(251,191,36,0.2)" : "rgba(248,113,113,0.18)";
 roundRect(ctx, w * 0.12, h * 0.28, w * 0.76, h * 0.28, 16); ctx.fill();
 drawLabel(ctx, phase === "truth" ? m.truth : "Myth: " + m.claim, w * 0.5, h * 0.42, { h: 42, font: "700 13px Segoe UI" });
 drawLabel(ctx, "Myth " + (idx + 1) + " / 5 \u00b7 Tap to flip", w * 0.5, layout.labelY);
 setHitRegions([{ id: "card", shape: "rect", x: w * 0.5, y: h * 0.42, w: w * 0.76, h: h * 0.28, meta: { action: "flip" } }]);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("chanceDrill", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription(labState.prompt || "Chance drill");
 setTick(() => {
 const w = api.width, h = api.height;
 drawBackdrop();
 drawLabel(ctx, labState.prompt || "Chance drill", w * 0.5, h * 0.2, { h: 32, font: "700 16px Segoe UI" });
 drawCoin(ctx, w * 0.5, h * 0.48, 0.5, 0.6);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("chanceMastery", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Chance Champ mastery.");
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout, locked = labState.masteryStep || 0;
 drawBackdrop();
 ["Meet", "Sort", "Lab", "Rule", "Myth", "Champ"].forEach((label, i) => {
 const x = w * 0.1 + i * (w * 0.14);
 ctx.fillStyle = i < locked ? "#fbbf24" : "rgba(148,163,184,0.35)";
 roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8); ctx.fill();
 ctx.fillStyle = "#0f172a"; ctx.font = "600 10px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.78);
 });
 drawCoin(ctx, w * 0.3, h * 0.4, 0.5, 0.8);
 drawDie(ctx, w * 0.55, h * 0.4, 6);
 drawSpinner(ctx, w * 0.78, h * 0.4, 0.7);
 drawLabel(ctx, "Chance Champ!", w * 0.5, layout.labelY);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });
}
