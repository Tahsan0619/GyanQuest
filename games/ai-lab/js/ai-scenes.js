/**
 * Artificial Intelligence - Mission 1: What is AI?
 * Topic-specific Canvas 2D: examples → patterns → guesses (not chemistry particle zoom).
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
 const tw = Math.min(ctx.measureText(text).width + 24, opts.maxW || 560);
 const bh = opts.h || 26;
 ctx.fillStyle = opts.bg || "rgba(15,23,42,0.92)";
 roundRect(ctx, x - tw / 2, y - bh / 2, tw, bh, 10);
 ctx.fill();
 ctx.strokeStyle = opts.border || "rgba(34,211,238,0.55)";
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
 ctx.fillStyle = `rgba(74,222,128,${Math.max(0, (until - performance.now()) / 380) * 0.22})`;
 ctx.fillRect(0, 0, w, h);
}

/** Phone gallery with cat photo tags */
function drawPhone(ctx, x, y, clarity = 0.5) {
 ctx.fillStyle = "#1e293b";
 roundRect(ctx, x - 28, y - 48, 56, 96, 10);
 ctx.fill();
 ctx.fillStyle = "#0f172a";
 roundRect(ctx, x - 22, y - 40, 44, 72, 6);
 ctx.fill();
 // photo tiles
 const tags = clarity > 0.55 ? ["cat", "cat", "cat"] : clarity > 0.25 ? ["cat", "?", "dog"] : ["?", "?", "?"];
 tags.forEach((t, i) => {
 const px = x - 16 + (i % 2) * 18;
 const py = y - 32 + Math.floor(i / 2) * 22;
 ctx.fillStyle = t === "cat" ? "rgba(251,146,60,0.85)" : t === "dog" ? "rgba(148,163,184,0.7)" : "rgba(100,116,139,0.6)";
 roundRect(ctx, px, py, 14, 18, 3);
 ctx.fill();
 ctx.fillStyle = "#f8fafc";
 ctx.font = "700 8px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(t, px + 7, py + 11);
 });
 ctx.fillStyle = "#94a3b8";
 ctx.font = "600 10px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("Photos", x, y + 58);
}

/** Voice mic helper */
function drawMic(ctx, x, y, active = 0.5) {
 ctx.fillStyle = "#334155";
 roundRect(ctx, x - 14, y - 28, 28, 44, 14);
 ctx.fill();
 ctx.strokeStyle = active > 0.4 ? "#22d3ee" : "#64748b";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.arc(x, y + 20, 16, Math.PI, 0);
 ctx.stroke();
 ctx.beginPath();
 ctx.moveTo(x, y + 20);
 ctx.lineTo(x, y + 36);
 ctx.stroke();
 if (active > 0.3) {
 for (let i = 0; i < 4; i++) {
 const h = 8 + active * 18 * Math.sin(performance.now() / 180 + i);
 ctx.fillStyle = "rgba(34,211,238,0.7)";
 roundRect(ctx, x + 22 + i * 8, y - h / 2, 5, h, 2);
 ctx.fill();
 }
 }
 ctx.fillStyle = "#94a3b8";
 ctx.font = "600 10px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("Voice", x, y + 58);
}

/** Map with route suggestion */
function drawMap(ctx, x, y, confidence = 0.5) {
 ctx.fillStyle = "#0f766e";
 roundRect(ctx, x - 40, y - 36, 80, 72, 8);
 ctx.fill();
 ctx.strokeStyle = confidence > 0.5 ? "#fbbf24" : "#94a3b8";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.moveTo(x - 28, y + 20);
 ctx.quadraticCurveTo(x - 10, y - 10, x + 8, y);
 ctx.quadraticCurveTo(x + 22, y + 8, x + 30, y - 18);
 ctx.stroke();
 ctx.fillStyle = "#f87171";
 ctx.beginPath();
 ctx.arc(x - 28, y + 20, 5, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#22c55e";
 ctx.beginPath();
 ctx.arc(x + 30, y - 18, 5, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#ccfbf1";
 ctx.font = "600 10px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("Maps", x, y + 52);
}

/** Example → pattern → guess pipeline node */
function drawPipeNode(ctx, x, y, label, on) {
 ctx.fillStyle = on ? "rgba(34,211,238,0.35)" : "rgba(30,41,59,0.9)";
 roundRect(ctx, x - 48, y - 22, 96, 44, 12);
 ctx.fill();
 ctx.strokeStyle = on ? "#22d3ee" : "#475569";
 ctx.lineWidth = 2;
 ctx.stroke();
 ctx.fillStyle = on ? "#ecfeff" : "#94a3b8";
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(label, x, y);
}

/** Scattered example chips that align as heat rises */
function drawExampleCloud(ctx, cx, cy, heat, count = 10) {
 const aligned = heat > 0.55;
 for (let i = 0; i < count; i++) {
 const a = (i / count) * Math.PI * 2 + (aligned ? 0 : Math.sin(i + heat * 3) * 0.8);
 const r = aligned ? 36 + (i % 3) * 8 : 28 + (i % 5) * 14 * (1 - heat * 0.4);
 const x = cx + Math.cos(a) * r;
 const y = cy + Math.sin(a) * r * 0.65;
 ctx.fillStyle = aligned
 ? `rgba(34,211,238,${0.55 + (i % 3) * 0.1})`
 : `rgba(148,163,184,${0.35 + heat * 0.3})`;
 roundRect(ctx, x - 10, y - 8, 20, 16, 4);
 ctx.fill();
 }
 if (aligned) {
 ctx.strokeStyle = "rgba(34,211,238,0.7)";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.ellipse(cx, cy, 58, 38, 0, 0, Math.PI * 2);
 ctx.stroke();
 }
}

export function registerAiScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("aiMeet", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions } = api;
 labState.phase = opts.phase || labState.phase || "desk";
 setDescription("What is AI? - meet everyday tools that guess from examples");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const live = opts.phase || labState.phase || "desk";
 drawBackdrop();
 const deskY = h * 0.42;
 drawPhone(ctx, w * 0.22, deskY, live === "desk" ? 0.2 : live === "glow" ? 0.7 : 0.9);
 drawMic(ctx, w * 0.5, deskY, live === "desk" ? 0.15 : live === "glow" ? 0.75 : 1);
 drawMap(ctx, w * 0.78, deskY, live === "desk" ? 0.2 : live === "glow" ? 0.65 : 0.95);

 if (live === "glow" || live === "settle") {
 ctx.strokeStyle = "rgba(34,211,238,0.55)";
 ctx.lineWidth = 2;
 ctx.setLineDash([6, 6]);
 ctx.beginPath();
 ctx.moveTo(w * 0.22, deskY - 10);
 ctx.lineTo(w * 0.5, deskY - 10);
 ctx.lineTo(w * 0.78, deskY - 10);
 ctx.stroke();
 ctx.setLineDash([]);
 drawLabel(ctx, "Similar inputs → similar guesses", w * 0.5, h * 0.22, {
 h: 28,
 font: "700 13px Segoe UI",
 border: "rgba(34,211,238,0.6)",
 });
 }
 if (live === "settle") {
 ctx.fillStyle = "rgba(34,211,238,0.18)";
 roundRect(ctx, w * 0.18, h * 0.62, w * 0.64, 44, 12);
 ctx.fill();
 ctx.fillStyle = "#ecfeff";
 ctx.font = "700 14px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("AI = pattern spotting from examples - not a human mind", w * 0.5, h * 0.62 + 26);
 }
 const tips = {
 desk: "Everyday tools: photos, voice, maps",
 glow: "Patterns light up across tools",
 settle: "Big idea: patterns from examples, not magic",
 };
 drawLabel(ctx, tips[live] || tips.desk, w * 0.5, layout.labelY);
 setHitRegions([
 { id: "phone", shape: "rect", x: w * 0.22, y: deskY, w: 70, h: 110, meta: { propId: "phone" } },
 { id: "mic", shape: "rect", x: w * 0.5, y: deskY, w: 70, h: 110, meta: { propId: "mic" } },
 { id: "map", shape: "rect", x: w * 0.78, y: deskY, w: 90, h: 100, meta: { propId: "map" } },
 ]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("aiSort", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } = api;
 setDescription("Drag into AI tool / Not AI / Tricky.");
 const chips = [
 { id: "photo", short: "Photos", color: 12616956 },
 { id: "voice", short: "Voice", color: 10980346 },
 { id: "map", short: "Maps", color: 3718648 },
 { id: "calc", short: "Calc", color: 9741240 },
 { id: "switch", short: "Switch", color: 7893356 },
 { id: "faq", short: "FAQ bot", color: 16347926 },
 { id: "spell", short: "Spell", color: 2278750 },
 { id: "clock", short: "Clock", color: 6583435 },
 ];
 const accept = {
 ai: ["photo", "voice", "map", "spell"],
 not: ["calc", "switch", "clock"],
 tricky: ["faq"],
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
 { id: "ai", label: "AI tool", x: w * 0.02, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#22d3ee" },
 { id: "not", label: "Not AI", x: w * 0.35, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#94a3b8" },
 { id: "tricky", label: "Tricky", x: w * 0.68, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#f97316" },
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
 const byZone = { ai: [], not: [], tricky: [] };
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
 ctx.fillStyle = labState.selectedId === c.id ? "rgba(255,255,255,0.18)" : "rgba(15,23,42,0.95)";
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
 drawLabel(ctx, "Drag into AI tool / Not AI / Tricky.", w * 0.5, layout.labelY);
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 /** Pattern clarity dial - messy examples → aligned pattern (not chemistry heat) */
 arena.registerScene("aiLab", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, opts } = api;
 const labMode = opts.labMode || labState.labMode || "clarity";
 setDescription(labMode === "strength" ? "Stronger pattern lab - more examples, clearer guess" : "Pattern clarity dial");
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
 drawBackdrop();
 const cx = w * 0.5;
 const cy = h * 0.36;

 if (labMode === "strength") {
 // Growing example pile + confidence bar
 const n = Math.max(3, Math.floor(3 + heat * 12));
 for (let i = 0; i < n; i++) {
 const col = i % 6;
 const row = Math.floor(i / 6);
 ctx.fillStyle = heat > 0.7 ? "rgba(34,211,238,0.75)" : "rgba(148,163,184,0.55)";
 roundRect(ctx, cx - 70 + col * 24, cy - 30 + row * 22, 18, 16, 3);
 ctx.fill();
 }
 drawPhone(ctx, w * 0.18, h * 0.55, heat);
 // Confidence meter
 ctx.fillStyle = "rgba(15,23,42,0.85)";
 roundRect(ctx, w * 0.55, h * 0.48, w * 0.32, 28, 8);
 ctx.fill();
 ctx.fillStyle = heat >= 0.75 ? "#22c55e" : "#22d3ee";
 roundRect(ctx, w * 0.55 + 4, h * 0.48 + 4, Math.max(8, (w * 0.32 - 8) * heat), 20, 6);
 ctx.fill();
 drawLabel(ctx, `Examples: ${n} · Guess confidence ${Math.round(heat * 100)}%`, w * 0.5, layout.labelY);
 } else {
 drawExampleCloud(ctx, cx, cy, heat, 12);
 drawPhone(ctx, w * 0.22, h * 0.58, heat);
 drawMic(ctx, w * 0.78, h * 0.58, heat);
 const tip =
 heat >= 0.6
 ? "Pattern clarity locked - guess looks solid"
 : heat >= 0.35
 ? "Examples starting to line up…"
 : "Messy examples - drag dial to clarify";
 drawLabel(ctx, tip, w * 0.5, layout.labelY);
 }

 const hx = w * 0.2 + heat * w * 0.6;
 ctx.fillStyle = "#22d3ee";
 ctx.beginPath();
 ctx.arc(hx, h * 0.78, 14, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "rgba(34,211,238,0.25)";
 roundRect(ctx, w * 0.2, h * 0.78 - 6, w * 0.6, 12, 6);
 ctx.fill();
 setHitRegions([{ id: "h", shape: "rect", x: hx, y: h * 0.78, w: 48, h: 48, meta: { action: "stretch" } }]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 /** Guess story pipeline */
 arena.registerScene("aiGuess", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts } = api;
 setDescription("Why AI guesses - examples → patterns → guess → check");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const step = opts.step ?? labState.guessStep ?? 0;
 drawBackdrop();
 const nodes = [
 { label: "Examples", x: w * 0.15 },
 { label: "Patterns", x: w * 0.38 },
 { label: "Guess", x: w * 0.62 },
 { label: "Check", x: w * 0.85 },
 ];
 nodes.forEach((n, i) => {
 drawPipeNode(ctx, n.x, h * 0.4, n.label, i <= step);
 if (i < nodes.length - 1) {
 ctx.strokeStyle = i < step ? "#22d3ee" : "#475569";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.moveTo(n.x + 50, h * 0.4);
 ctx.lineTo(nodes[i + 1].x - 50, h * 0.4);
 ctx.stroke();
 }
 });
 if (step >= 0) drawPhone(ctx, w * 0.15, h * 0.68, 0.4 + step * 0.15);
 if (step >= 1) drawExampleCloud(ctx, w * 0.38, h * 0.68, 0.7, 8);
 if (step >= 2) {
 ctx.fillStyle = "rgba(34,211,238,0.25)";
 roundRect(ctx, w * 0.52, h * 0.58, 80, 40, 10);
 ctx.fill();
 ctx.fillStyle = "#ecfeff";
 ctx.font = "700 14px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("cat?", w * 0.62, h * 0.68);
 }
 if (step >= 3) {
 ctx.fillStyle = "rgba(74,222,128,0.3)";
 roundRect(ctx, w * 0.75, h * 0.58, 80, 40, 10);
 ctx.fill();
 ctx.fillStyle = "#ecfeff";
 ctx.font = "700 14px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("✓ / fix", w * 0.85, h * 0.68);
 }
 drawLabel(ctx, "Causal chain: data fuels the guess", w * 0.5, layout.labelY);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 /** Rule: examples → patterns → guess (identity scale, not salt zoom) */
 arena.registerScene("aiRule", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Name the AI rule - examples → patterns → guess");
 const tokens = ["AI", "learns", "patterns", "from examples"];
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const prog = labState.tokenProgress || 0;
 const scale = labState.scale || 0;
 drawBackdrop();

 if (scale < 0.33) {
 if (scale <= 0.02 && prog > 0) {
 tokens.forEach((label, i) => {
 const x = w * 0.14 + i * (w * 0.2);
 ctx.fillStyle = i < prog ? "rgba(34,211,238,0.35)" : "rgba(15,23,42,0.9)";
 roundRect(ctx, x - 48, h * 0.28 - 18, 96, 36, 10);
 ctx.fill();
 ctx.fillStyle = "#e0f2fe";
 ctx.font = "700 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(label, x, h * 0.28);
 });
 }
 drawPhone(ctx, w * 0.22, h * 0.52, 0.35);
 drawMic(ctx, w * 0.5, h * 0.52, 0.35);
 drawMap(ctx, w * 0.78, h * 0.52, 0.35);
 drawLabel(
 ctx,
 scale <= 0.02 && prog > 0 ? "Build the rule · everyday tools" : "Everyday tools that learn from examples",
 w * 0.5,
 layout.labelY,
 );
 } else if (scale < 0.66) {
 drawExampleCloud(ctx, w * 0.5, h * 0.4, 0.85, 14);
 drawLabel(ctx, "Patterns emerge from many examples", w * 0.5, layout.labelY);
 } else {
 ctx.fillStyle = "rgba(34,211,238,0.22)";
 roundRect(ctx, w * 0.16, h * 0.28, w * 0.68, h * 0.3, 18);
 ctx.fill();
 ctx.strokeStyle = "#22d3ee";
 ctx.lineWidth = 3;
 roundRect(ctx, w * 0.16, h * 0.28, w * 0.68, h * 0.3, 18);
 ctx.stroke();
 ctx.fillStyle = "#ecfeff";
 ctx.font = "800 22px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("AI learns patterns", w * 0.5, h * 0.4);
 ctx.font = "600 14px Segoe UI";
 ctx.fillStyle = "#a5f3fc";
 ctx.fillText("from examples → then guesses on new cases", w * 0.5, h * 0.5);
 drawPhone(ctx, w * 0.5, h * 0.72, 0.95);
 drawLabel(ctx, "Rule locked - not magic, not a human mind", w * 0.5, layout.labelY);
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("aiStretch", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, opts } = api;
 const modes = ["home", "school", "street", "shop", "lab"];
 const modeLabels = { home: "Home", school: "School", street: "Street", shop: "Shop", lab: "Lab" };
 setDescription("Same AI idea in places you know.");
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
 const mode = labState.mode || opts.mode || modes[0];
 drawBackdrop();
 const hits = [];
 modes.forEach((m, i) => {
 const x = w * 0.12 + i * (w * 0.17);
 ctx.fillStyle = m === mode ? "rgba(34,211,238,0.35)" : "#1e293b";
 roundRect(ctx, x - 36, layout.deskTop - 36, 72, 48, 10);
 ctx.fill();
 ctx.strokeStyle = m === mode ? "#22d3ee" : "#475569";
 ctx.lineWidth = m === mode ? 2 : 1;
 ctx.stroke();
 ctx.fillStyle = "#e0f2fe";
 ctx.font = "600 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(modeLabels[m] || m, x, layout.deskTop - 10);
 hits.push({ id: m, shape: "rect", x, y: layout.deskTop - 12, w: 72, h: 48, meta: { mode: m } });
 });

 const cx = w * 0.5;
 const cy = h * 0.38;
 if (mode === "home") {
 drawPhone(ctx, cx, cy, 0.9);
 } else if (mode === "school") {
 // laptop + voice guess
 ctx.fillStyle = "#334155";
 roundRect(ctx, cx - 70, cy - 40, 140, 80, 8);
 ctx.fill();
 ctx.fillStyle = "#0f172a";
 roundRect(ctx, cx - 60, cy - 30, 120, 55, 4);
 ctx.fill();
 ctx.fillStyle = "#22d3ee";
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("next word…", cx, cy);
 drawMic(ctx, cx + 90, cy + 10, 0.8);
 } else if (mode === "street") {
 drawMap(ctx, cx, cy, 0.9);
 } else if (mode === "shop") {
 // shelf camera - BD shop context
 ctx.fillStyle = "#78716c";
 roundRect(ctx, cx - 80, cy - 20, 160, 70, 6);
 ctx.fill();
 for (let i = 0; i < 4; i++) {
 ctx.fillStyle = i === 2 ? "rgba(248,113,113,0.5)" : "rgba(251,191,36,0.7)";
 roundRect(ctx, cx - 70 + i * 38, cy - 8, 28, 40, 4);
 ctx.fill();
 }
 ctx.fillStyle = "#1e293b";
 roundRect(ctx, cx - 16, cy - 55, 32, 20, 4);
 ctx.fill();
 ctx.fillStyle = "#22d3ee";
 ctx.beginPath();
 ctx.arc(cx, cy - 45, 6, 0, Math.PI * 2);
 ctx.fill();
 drawLabel(ctx, "Shelf cam: empty?", cx, cy + 70, { h: 20, font: "600 11px Segoe UI" });
 } else {
 // classroom lab bench
 ctx.fillStyle = "#334155";
 roundRect(ctx, cx - 100, cy + 20, 200, 24, 4);
 ctx.fill();
 drawExampleCloud(ctx, cx, cy - 10, 0.9, 10);
 ctx.fillStyle = "#a5f3fc";
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("Class pattern lab", cx, cy + 60);
 }

 const captions = {
 home: "Home · phone photo tags from past examples",
 school: "School · voice / typing guesses next words",
 street: "Street · map suggests a faster route",
 shop: "BD shop · camera flags empty shelves from photos",
 lab: "Lab · same idea: examples → patterns → guess",
 };
 drawLabel(ctx, captions[mode] || captions.home, w * 0.5, layout.labelY);
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("aiMyth", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const myths = [
 { claim: "AI is a magic brain that thinks like humans", truth: "AI spots statistical patterns in examples", kind: "brain" },
 { claim: "AI never needs data", truth: "Good examples are the fuel for pattern learning", kind: "data" },
 { claim: "One wrong guess means AI is useless", truth: "Guesses improve with better data and checks", kind: "wrong" },
 { claim: "Every automated button is AI", truth: "Simple switches and fixed scripts are not AI", kind: "switch" },
 { claim: "Only adults can understand AI", truth: "Kids can learn: examples → patterns → guesses", kind: "kids" },
 ];
 setDescription("Bust AI myths with claim vs truth diagrams.");
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
 ctx.fillStyle = phase === "truth" ? "rgba(52,211,153,0.18)" : "rgba(248,113,113,0.16)";
 roundRect(ctx, w * 0.1, h * 0.1, w * 0.8, 44, 12);
 ctx.fill();
 drawLabel(ctx, phase === "truth" ? m.truth : `Myth: ${m.claim}`, w * 0.5, h * 0.12 + 12, {
 h: 28,
 font: "700 13px Segoe UI",
 maxW: w * 0.76,
 });

 const cx = w * 0.5;
 const cy = h * 0.45;
 if (phase === "claim") {
 if (m.kind === "brain") {
 ctx.fillStyle = "rgba(192,132,252,0.35)";
 ctx.beginPath();
 ctx.arc(cx, cy, 48, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#f8fafc";
 ctx.font = "800 28px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("?", cx, cy + 8);
 drawLabel(ctx, "Magic mind?", cx, cy + 70, { h: 20, font: "600 12px Segoe UI" });
 } else if (m.kind === "data") {
 ctx.strokeStyle = "#f87171";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.moveTo(cx - 40, cy - 20);
 ctx.lineTo(cx + 40, cy + 20);
 ctx.moveTo(cx + 40, cy - 20);
 ctx.lineTo(cx - 40, cy + 20);
 ctx.stroke();
 drawLabel(ctx, "No examples needed?", cx, cy + 50, { h: 20, font: "600 12px Segoe UI" });
 } else if (m.kind === "wrong") {
 ctx.fillStyle = "rgba(248,113,113,0.4)";
 roundRect(ctx, cx - 50, cy - 30, 100, 60, 12);
 ctx.fill();
 ctx.fillStyle = "#fecaca";
 ctx.font = "800 20px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("WRONG → trash?", cx, cy + 6);
 } else if (m.kind === "switch") {
 ctx.fillStyle = "#475569";
 roundRect(ctx, cx - 40, cy - 20, 80, 40, 8);
 ctx.fill();
 ctx.fillStyle = "#22c55e";
 roundRect(ctx, cx + 5, cy - 12, 28, 24, 6);
 ctx.fill();
 drawLabel(ctx, "Any button = AI?", cx, cy + 50, { h: 20, font: "600 12px Segoe UI" });
 } else {
 ctx.fillStyle = "rgba(248,113,113,0.25)";
 roundRect(ctx, cx - 70, cy - 30, 140, 60, 12);
 ctx.fill();
 ctx.fillStyle = "#fecaca";
 ctx.font = "700 16px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("Kids can't learn this", cx, cy + 6);
 }
 } else if (m.kind === "brain") {
 drawExampleCloud(ctx, cx, cy, 0.9, 12);
 drawLabel(ctx, "Statistics over examples", cx, cy + 70, { h: 20, font: "600 12px Segoe UI" });
 } else if (m.kind === "data") {
 for (let i = 0; i < 8; i++) {
 ctx.fillStyle = "rgba(34,211,238,0.7)";
 roundRect(ctx, cx - 70 + i * 18, cy - 10, 14, 20, 3);
 ctx.fill();
 }
 drawLabel(ctx, "Examples fuel learning", cx, cy + 50, { h: 20, font: "600 12px Segoe UI" });
 } else if (m.kind === "wrong") {
 drawPipeNode(ctx, cx - 60, cy, "wrong", true);
 ctx.strokeStyle = "#22d3ee";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.moveTo(cx - 10, cy);
 ctx.lineTo(cx + 10, cy);
 ctx.stroke();
 drawPipeNode(ctx, cx + 70, cy, "improve", true);
 } else if (m.kind === "switch") {
 // Switch vs photo AI
 ctx.fillStyle = "#475569";
 roundRect(ctx, cx - 100, cy - 20, 70, 40, 8);
 ctx.fill();
 ctx.fillStyle = "#94a3b8";
 ctx.font = "700 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("switch", cx - 65, cy + 5);
 drawPhone(ctx, cx + 50, cy, 0.9);
 drawLabel(ctx, "Fixed rule ≠ learned pattern", cx, cy + 70, { h: 20, font: "600 12px Segoe UI" });
 } else {
 drawPhone(ctx, cx - 50, cy, 0.8);
 drawMic(ctx, cx + 50, cy, 0.8);
 drawLabel(ctx, "examples → patterns → guesses", cx, cy + 70, { h: 20, font: "600 12px Segoe UI" });
 }

 drawLabel(ctx, `Myth ${idx + 1} / 5 - Tap to flip`, w * 0.5, layout.labelY);
 setHitRegions([{ id: "card", shape: "rect", x: w * 0.5, y: h * 0.45, w: w * 0.8, h: h * 0.5, meta: { action: "flip" } }]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("aiDrill", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription(labState.prompt || "What is AI? drill");

 function drillVisual(prompt) {
 const p = (prompt || "").toLowerCase();
 if (p.includes("spot") || p.includes("pattern")) return "pattern";
 if (p.includes("data") || p.includes("example")) return "data";
 if (p.includes("switch")) return "switch";
 if (p.includes("wrong")) return "wrong";
 if (p.includes("mind") || p.includes("human")) return "mind";
 if (p.includes("better")) return "better";
 return "pattern";
 }

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 drawBackdrop();
 drawLabel(ctx, labState.prompt || "What is AI? drill", w * 0.5, h * 0.12, { h: 28, font: "700 16px Segoe UI" });
 const kind = drillVisual(labState.prompt);
 const cx = w * 0.5;
 const cy = h * 0.45;
 if (kind === "pattern") drawExampleCloud(ctx, cx, cy, 0.9, 12);
 else if (kind === "data") {
 for (let i = 0; i < 6; i++) {
 ctx.fillStyle = "rgba(34,211,238,0.7)";
 roundRect(ctx, cx - 60 + i * 22, cy - 12, 18, 24, 4);
 ctx.fill();
 }
 } else if (kind === "switch") {
 ctx.fillStyle = "#475569";
 roundRect(ctx, cx - 40, cy - 20, 80, 40, 8);
 ctx.fill();
 ctx.fillStyle = "#f87171";
 ctx.font = "800 14px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("NOT AI", cx, cy + 6);
 } else if (kind === "wrong") {
 drawPipeNode(ctx, cx, cy, "can be wrong", true);
 } else if (kind === "mind") {
 ctx.fillStyle = "rgba(248,113,113,0.25)";
 ctx.beginPath();
 ctx.arc(cx, cy, 40, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#fecaca";
 ctx.font = "800 18px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("≠ mind", cx, cy + 6);
 } else {
 drawPhone(ctx, cx, cy, 0.95);
 }
 drawLabel(ctx, "Quick check - pick the AI idea", w * 0.5, layout.labelY);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("aiMastery", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("What is AI? mastery - prove the pattern rule.");
 const labels = ["Meet", "Sort", "Lab", "Rule", "Myth", "AI"];
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const locked = labState.masteryStep || 0;
 drawBackdrop();
 labels.forEach((label, i) => {
 const x = w * 0.1 + i * (w * 0.14);
 ctx.fillStyle = i < locked ? "#22d3ee" : "rgba(148,163,184,0.35)";
 roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8);
 ctx.fill();
 ctx.fillStyle = "#0f172a";
 ctx.font = "600 10px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(label, x, h * 0.78);
 });
 drawPhone(ctx, w * 0.22, h * 0.38, 0.95);
 drawMic(ctx, w * 0.5, h * 0.38, 0.95);
 drawMap(ctx, w * 0.78, h * 0.38, 0.95);
 ctx.fillStyle = "rgba(34,211,238,0.2)";
 roundRect(ctx, w * 0.28, h * 0.55, w * 0.44, 36, 10);
 ctx.fill();
 ctx.fillStyle = "#ecfeff";
 ctx.font = "700 14px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("AI Rookie · patterns from examples", w * 0.5, h * 0.55 + 22);
 drawLabel(ctx, "Mastery: teach the AI idea on mixed cases", w * 0.5, layout.labelY);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });
}
