/**
 * Web Dev Studio · Mission 2: CSS Style - color, size, spacing make pages clear.
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
 ctx.fillStyle = `rgba(56,189,248,${Math.max(0, (until - performance.now()) / 380) * 0.22})`;
 ctx.fillRect(0, 0, w, h);
}

/** Styled preview card - heat drives color, size, and gap. */
function drawStyledPage(ctx, cx, cy, heat, phase) {
 const pad = 10 + heat * 18;
 const titleSize = 12 + heat * 14;
 const boxW = 160 + heat * 40;
 const boxH = 100 + heat * 30;
 const accent = heat < 0.35 ? "#64748b" : heat < 0.65 ? "#38bdf8" : "#22d3ee";
 ctx.fillStyle = "#0f172a";
 roundRect(ctx, cx - boxW / 2, cy - boxH / 2, boxW, boxH, 12);
 ctx.fill();
 ctx.strokeStyle = accent;
 ctx.lineWidth = 2 + heat * 2;
 ctx.stroke();
 ctx.fillStyle = accent;
 ctx.font = `700 ${titleSize}px Segoe UI`;
 ctx.textAlign = "center";
 ctx.fillText("Hello page", cx, cy - boxH / 2 + pad + titleSize);
 ctx.fillStyle = "#94a3b8";
 ctx.font = `${10 + heat * 4}px Segoe UI`;
 ctx.fillText("color · size · space", cx, cy - 4);
 // spacing bars
 const gap = 6 + heat * 16;
 ctx.fillStyle = "rgba(56,189,248,0.35)";
 roundRect(ctx, cx - boxW / 2 + 16, cy + 10, boxW - 32, 10, 4);
 ctx.fill();
 roundRect(ctx, cx - boxW / 2 + 16, cy + 10 + gap, boxW - 32, 10, 4);
 ctx.fill();
 if (phase === "glow" || phase === "settle" || heat > 0.5) {
 ctx.fillStyle = "#7dd3fc";
 ctx.font = "700 10px Consolas, monospace";
 ctx.fillText("color: " + (heat > 0.6 ? "sky" : "gray"), cx - 50, cy + boxH / 2 + 18);
 ctx.fillText("font-size", cx + 10, cy + boxH / 2 + 18);
 ctx.fillText("gap", cx + 70, cy + boxH / 2 + 18);
 }
}

function drawPaintPot(ctx, x, y, color, label) {
 ctx.fillStyle = color;
 roundRect(ctx, x - 22, y - 28, 44, 40, 8);
 ctx.fill();
 ctx.fillStyle = "#1e293b";
 roundRect(ctx, x - 14, y - 36, 28, 12, 4);
 ctx.fill();
 ctx.fillStyle = "#e0f2fe";
 ctx.font = "700 10px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(label, x, y + 28);
}

export function registerCssScenes(arena) {
 if (!arena?.registerScene) return;
 const P = "css";

 arena.registerScene(P + "Meet", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions } = api;
 labState.phase = opts.phase || labState.phase || "desk";
 setDescription("CSS Style - color, size, and spacing.");
 const pots = {
 color: { x: 0, y: 0, c: "#38bdf8", label: "color" },
 size: { x: 0, y: 0, c: "#a78bfa", label: "size" },
 space: { x: 0, y: 0, c: "#22c55e", label: "space" },
 };
 let inited = false;
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout;
 const live = labState.phase || "desk";
 const heat = labState.heat || (live === "settle" ? 0.7 : live === "glow" ? 0.5 : 0.25);
 drawBackdrop();
 if (!inited) {
 pots.color.x = w * 0.2; pots.color.y = h * 0.55;
 pots.size.x = w * 0.5; pots.size.y = h * 0.58;
 pots.space.x = w * 0.8; pots.space.y = h * 0.55;
 inited = true;
 }
 drawStyledPage(ctx, w * 0.5, h * 0.32, heat, live);
 for (const p of Object.values(pots)) drawPaintPot(ctx, p.x, p.y, p.c, p.label);
 if (live === "glow" || live === "settle") {
 ctx.strokeStyle = "rgba(56,189,248,0.5)";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.moveTo(pots.color.x, pots.color.y - 28);
 ctx.lineTo(w * 0.5, h * 0.32 + 40);
 ctx.lineTo(pots.size.x, pots.size.y - 28);
 ctx.moveTo(pots.space.x, pots.space.y - 28);
 ctx.lineTo(w * 0.5, h * 0.32 + 40);
 ctx.stroke();
 }
 const tips = {
 desk: "Drag paint pots - color, size, space",
 glow: "CSS paints the HTML rooms",
 settle: "Clear look = choose color, size, gap",
 };
 drawLabel(ctx, tips[live] || tips.desk, w * 0.5, layout.labelY);
 const hits = [];
 for (const [id, p] of Object.entries(pots)) {
 hits.push({
 id, shape: "rect", x: p.x, y: p.y, w: 56, h: 70, meta: { propId: id },
 onDrag(pt) {
 p.x = Math.max(40, Math.min(w - 40, pt.x));
 p.y = Math.max(70, Math.min(layout.deskTop, pt.y));
 },
 });
 }
 setHitRegions(hits);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene(P + "Sort", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } = api;
 setDescription("Sort: CSS look vs HTML structure vs not.");
 const chips = [
 { id: "color", short: "color", color: 0x38bdf8 },
 { id: "font", short: "font-size", color: 0x0ea5e9 },
 { id: "margin", short: "margin", color: 0x22c55e },
 { id: "bg", short: "background", color: 0x67e8f9 },
 { id: "h1", short: "<h1>", color: 0xea580c },
 { id: "p", short: "<p>", color: 0xf97316 },
 { id: "click", short: "onclick", color: 0xa78bfa },
 { id: "rice", short: "Rice", color: 0xf472b6 },
 ];
 const accept = {
 css: ["color", "font", "margin", "bg"],
 html: ["h1", "p"],
 not: ["click", "rice"],
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
 { id: "css", label: "CSS look", x: w * 0.02, y: zoneY, ww: w * 0.31, hh: zoneH, color: "#38bdf8" },
 { id: "html", label: "HTML structure", x: w * 0.35, y: zoneY, ww: w * 0.31, hh: zoneH, color: "#ea580c" },
 { id: "not", label: "Not CSS", x: w * 0.68, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#94a3b8" },
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
 const byZone = { css: [], html: [], not: [] };
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
 ctx.fillStyle = "#e0f2fe"; ctx.font = "700 11px Consolas, monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
 ctx.fillText(c.short, prev.x, prev.y);
 hits.push({ id: c.id, shape: "rect", x: prev.x, y: prev.y, w: 100, h: 36, meta: { chipId: c.id },
 onDrag(pt) { draggingId = c.id; prev.x = Math.max(30, Math.min(w - 30, pt.x)); prev.y = Math.max(30, Math.min(h - 30, pt.y)); } });
 });
 drawLabel(ctx, "CSS look · HTML structure · Not CSS", w * 0.5, layout.labelY);
 setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene(P + "Lab", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 setDescription("Dial style strength - watch color, size, gap grow.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
 labState.heat = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
 labState.styleHeat = labState.heat;
 }
 });
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout;
 const heat = labState.heat ?? 0.3;
 drawBackdrop();
 drawStyledPage(ctx, w * 0.5, h * 0.38, heat, heat >= 0.6 ? "settle" : "glow");
 drawPaintPot(ctx, w * 0.22, h * 0.58, "#38bdf8", "color");
 drawPaintPot(ctx, w * 0.5, h * 0.58, "#a78bfa", "size");
 drawPaintPot(ctx, w * 0.78, h * 0.58, "#22c55e", "space");
 const hx = w * 0.2 + heat * w * 0.6;
 ctx.fillStyle = "#38bdf8";
 ctx.beginPath(); ctx.arc(hx, h * 0.74, 14, 0, Math.PI * 2); ctx.fill();
 drawLabel(ctx, heat >= 0.6 ? "Style clear - page looks intentional" : "Drag - stronger CSS look", w * 0.5, layout.labelY);
 setHitRegions([{ id: "h", shape: "rect", x: hx, y: h * 0.74, w: 48, h: 48, meta: { action: "stretch" } }]);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene(P + "Rule", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Select · Style · Look · Clear.");
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout, prog = labState.tokenProgress || 0;
 drawBackdrop();
 ["Select", "Style", "Look", "Clear"].forEach((label, i) => {
 const x = w * 0.18 + i * (w * 0.18);
 ctx.fillStyle = i < prog ? "rgba(56,189,248,0.45)" : "rgba(15,23,42,0.9)";
 roundRect(ctx, x - 44, h * 0.3 - 18, 88, 36, 10); ctx.fill();
 ctx.fillStyle = "#e0f2fe"; ctx.font = "700 12px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.3);
 });
 drawStyledPage(ctx, w * 0.5, h * 0.55, 0.8, "settle");
 drawLabel(ctx, "CSS Style rule", w * 0.5, layout.labelY);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene(P + "Stretch", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const modes = [
 { id: "poster", label: "Poster" },
 { id: "school", label: "School" },
 { id: "shop", label: "Shop" },
 { id: "bd", label: "Rickshaw" },
 { id: "app", label: "App" },
 ];
 setDescription("Same CSS ideas on everyday surfaces.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.mode) { labState.mode = intent.meta.mode; pulseSuccessFeedback(200); }
 });
 function drawSurface(mode, cx, cy) {
 if (mode === "poster") {
 ctx.fillStyle = "#0ea5e9"; roundRect(ctx, cx - 70, cy - 55, 140, 110, 8); ctx.fill();
 ctx.fillStyle = "#fff"; ctx.font = "800 22px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("FAIR!", cx, cy - 10);
 ctx.font = "600 11px Segoe UI"; ctx.fillText("big size + bold color", cx, cy + 20);
 } else if (mode === "school") {
 ctx.fillStyle = "#1e293b"; roundRect(ctx, cx - 80, cy - 50, 160, 100, 8); ctx.fill();
 ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 2; ctx.stroke();
 ctx.fillStyle = "#e0f2fe"; ctx.font = "700 12px Segoe UI"; ctx.textAlign = "left";
 ctx.fillText("Notice", cx - 60, cy - 28);
 ctx.fillStyle = "#94a3b8"; ctx.font = "600 10px Segoe UI";
 ctx.fillText("Line one", cx - 60, cy - 6);
 ctx.fillText("Line two (gap)", cx - 60, cy + 18);
 ctx.fillText("Line three", cx - 60, cy + 42);
 } else if (mode === "shop") {
 ctx.fillStyle = "#0f172a"; roundRect(ctx, cx - 55, cy - 50, 110, 100, 10); ctx.fill();
 ctx.fillStyle = "#22d3ee"; roundRect(ctx, cx - 40, cy - 38, 80, 44, 6); ctx.fill();
 ctx.fillStyle = "#e0f2fe"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("Tk 120", cx, cy + 28);
 ctx.fillStyle = "rgba(56,189,248,0.4)"; roundRect(ctx, cx - 40, cy + 38, 80, 8, 3); ctx.fill();
 } else if (mode === "bd") {
 ctx.fillStyle = "#0369a1"; roundRect(ctx, cx - 90, cy - 40, 180, 80, 6); ctx.fill();
 ctx.fillStyle = "#fef08a"; ctx.font = "800 16px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("TEA 15৳", cx, cy - 5);
 ctx.fillStyle = "#bae6fd"; ctx.font = "600 11px Segoe UI";
 ctx.fillText("reads from far away", cx, cy + 22);
 } else {
 ctx.fillStyle = "#1e293b"; roundRect(ctx, cx - 45, cy - 70, 90, 140, 16); ctx.fill();
 ctx.fillStyle = "#38bdf8"; roundRect(ctx, cx - 32, cy - 50, 64, 90, 8); ctx.fill();
 ctx.fillStyle = "#0f172a"; ctx.font = "700 10px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("pad", cx, cy - 10);
 ctx.fillText("gap", cx, cy + 16);
 }
 }
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout, mode = labState.mode || "poster";
 drawBackdrop();
 const hits = [];
 modes.forEach((m, i) => {
 const x = w * 0.12 + i * (w * 0.17);
 ctx.fillStyle = m.id === mode ? "rgba(56,189,248,0.45)" : "#1e293b";
 roundRect(ctx, x - 36, layout.deskTop - 36, 72, 48, 10); ctx.fill();
 ctx.fillStyle = "#e0f2fe"; ctx.font = "600 11px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(m.label, x, layout.deskTop - 10);
 hits.push({ id: m.id, shape: "rect", x, y: layout.deskTop - 12, w: 72, h: 48, meta: { mode: m.id } });
 });
 drawSurface(mode, w * 0.5, h * 0.42);
 const captions = {
 poster: "Poster - big title size + bold color",
 school: "School notice - clear spacing between lines",
 shop: "Shop card - product color and gap",
 bd: "Rickshaw ad board - color must read from far",
 app: "Phone app - padding keeps taps readable",
 };
 drawLabel(ctx, captions[mode], w * 0.5, layout.labelY);
 setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene(P + "Myth", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const myths = [
 { claim: "More colors always look better", truth: "A few clear colors beat a messy rainbow", kind: "rainbow" },
 { claim: "CSS and HTML are the same file job", truth: "HTML structures; CSS styles the look", kind: "same" },
 { claim: "Tiny text is fine on phones", truth: "Readable size and spacing help everyone", kind: "tiny" },
 { claim: "Spacing does not matter", truth: "Gap and margin guide the eye", kind: "space" },
 { claim: "Only designers can learn CSS", truth: "Kids can learn color, size, and space", kind: "kids" },
 ];
 setDescription("Bust CSS myths.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "flip") {
 labState.mythPhase = labState.mythPhase === "truth" ? "claim" : "truth";
 if (labState.mythPhase === "truth") pulseSuccessFeedback(220);
 }
 });
 function drawMythDiagram(kind, phase, cx, cy) {
 if (phase === "claim") {
 if (kind === "rainbow") {
 ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7", "#ec4899"].forEach((c, i) => {
 ctx.fillStyle = c; roundRect(ctx, cx - 90 + i * 30, cy - 30, 26, 60, 4); ctx.fill();
 });
 } else if (kind === "same") {
 ctx.fillStyle = "rgba(248,113,113,0.35)";
 ctx.beginPath(); ctx.arc(cx, cy, 50, 0, Math.PI * 2); ctx.fill();
 ctx.fillStyle = "#fecaca"; ctx.font = "700 12px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("one messy file?", cx, cy + 4);
 } else if (kind === "tiny") {
 ctx.fillStyle = "#1e293b"; roundRect(ctx, cx - 40, cy - 60, 80, 120, 14); ctx.fill();
 ctx.fillStyle = "#64748b"; ctx.font = "600 7px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("tiny tiny tiny", cx, cy);
 } else if (kind === "space") {
 ctx.fillStyle = "#334155"; roundRect(ctx, cx - 70, cy - 40, 140, 80, 6); ctx.fill();
 ctx.fillStyle = "#f87171"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("CRAMMEDTEXTLINES", cx, cy);
 } else {
 ctx.fillStyle = "#334155"; roundRect(ctx, cx - 55, cy - 40, 110, 80, 8); ctx.fill();
 ctx.fillStyle = "#f87171"; ctx.font = "800 20px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("🎨?", cx, cy);
 }
 return;
 }
 if (kind === "rainbow") {
 ["#38bdf8", "#0ea5e9", "#0369a1"].forEach((c, i) => {
 ctx.fillStyle = c; roundRect(ctx, cx - 50 + i * 36, cy - 30, 30, 60, 4); ctx.fill();
 });
 ctx.fillStyle = "#e0f2fe"; ctx.font = "600 11px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("3 clear colors", cx, cy + 50);
 } else if (kind === "same") {
 ctx.fillStyle = "#ea580c"; roundRect(ctx, cx - 90, cy - 28, 80, 56, 8); ctx.fill();
 ctx.fillStyle = "#38bdf8"; roundRect(ctx, cx + 10, cy - 28, 80, 56, 8); ctx.fill();
 ctx.fillStyle = "#fff"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("HTML", cx - 50, cy); ctx.fillText("CSS", cx + 50, cy);
 } else if (kind === "tiny") {
 ctx.fillStyle = "#1e293b"; roundRect(ctx, cx - 40, cy - 60, 80, 120, 14); ctx.fill();
 ctx.fillStyle = "#7dd3fc"; ctx.font = "700 14px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("Hello", cx, cy - 10);
 ctx.font = "600 11px Segoe UI"; ctx.fillText("readable", cx, cy + 16);
 } else if (kind === "space") {
 ctx.fillStyle = "#0f172a"; roundRect(ctx, cx - 70, cy - 45, 140, 90, 8); ctx.fill();
 ctx.fillStyle = "#7dd3fc"; ctx.font = "700 12px Segoe UI"; ctx.textAlign = "left";
 ctx.fillText("Title", cx - 50, cy - 20);
 ctx.fillText("Gap →", cx - 50, cy + 8);
 ctx.fillText("Body text", cx - 50, cy + 32);
 } else {
 drawPaintPot(ctx, cx - 50, cy, "#38bdf8", "color");
 drawPaintPot(ctx, cx, cy, "#a78bfa", "size");
 drawPaintPot(ctx, cx + 50, cy, "#22c55e", "space");
 }
 }
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout;
 const idx = labState.myth ?? 0, phase = labState.mythPhase || "claim", m = myths[idx] || myths[0];
 drawBackdrop();
 ctx.fillStyle = phase === "truth" ? "rgba(56,189,248,0.22)" : "rgba(248,113,113,0.18)";
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
 setDescription(labState.prompt || "CSS drill");
 setTick(() => {
 const w = api.width, h = api.height;
 const prompt = (labState.prompt || "CSS").toLowerCase();
 drawBackdrop();
 drawLabel(ctx, labState.prompt || "CSS Style drill", w * 0.5, h * 0.14, { h: 32, font: "700 16px Segoe UI" });
 const cx = w * 0.5, cy = h * 0.48;
 if (prompt.includes("size")) {
 ctx.fillStyle = "#38bdf8"; ctx.font = "800 28px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("Aa", cx, cy);
 ctx.font = "600 12px Segoe UI"; ctx.fillText("font-size", cx, cy + 28);
 } else if (prompt.includes("margin") || prompt.includes("space")) {
 ctx.fillStyle = "#0f172a"; roundRect(ctx, cx - 60, cy - 40, 120, 80, 8); ctx.fill();
 ctx.strokeStyle = "#22c55e"; ctx.setLineDash([4, 3]); ctx.strokeRect(cx - 75, cy - 55, 150, 110); ctx.setLineDash([]);
 ctx.fillStyle = "#86efac"; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("margin / gap", cx, cy + 70);
 } else if (prompt.includes("h1")) {
 ctx.fillStyle = "#ea580c"; roundRect(ctx, cx - 50, cy - 20, 100, 40, 8); ctx.fill();
 ctx.fillStyle = "#fff"; ctx.font = "800 16px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("<h1>", cx, cy);
 } else if (prompt.includes("rice")) {
 ctx.fillStyle = "#f472b6"; roundRect(ctx, cx - 50, cy - 30, 100, 60, 12); ctx.fill();
 ctx.fillStyle = "#831843"; ctx.font = "700 14px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("🍚 Rice", cx, cy); ctx.font = "600 11px Segoe UI";
 ctx.fillText("not CSS", cx, cy + 20);
 } else {
 drawStyledPage(ctx, cx, cy, 0.8, "settle");
 }
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene(P + "Mastery", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Style Star mastery.");
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout, locked = labState.masteryStep || 0;
 drawBackdrop();
 ["Meet", "Sort", "Lab", "Rule", "Myth", "Star"].forEach((label, i) => {
 const x = w * 0.1 + i * (w * 0.14);
 ctx.fillStyle = i < locked ? "#38bdf8" : "rgba(148,163,184,0.35)";
 roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8); ctx.fill();
 ctx.fillStyle = "#0f172a"; ctx.font = "600 10px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.78);
 });
 drawStyledPage(ctx, w * 0.32, h * 0.4, 0.9, "settle");
 drawPaintPot(ctx, w * 0.58, h * 0.38, "#38bdf8", "color");
 drawPaintPot(ctx, w * 0.7, h * 0.38, "#a78bfa", "size");
 drawPaintPot(ctx, w * 0.82, h * 0.38, "#22c55e", "space");
 ctx.fillStyle = "rgba(56,189,248,0.9)";
 roundRect(ctx, w * 0.55, h * 0.52, w * 0.35, 36, 10); ctx.fill();
 ctx.fillStyle = "#0f172a"; ctx.font = "800 14px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("Style Star", w * 0.725, h * 0.55);
 drawLabel(ctx, "Style Star!", w * 0.5, layout.labelY);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });
}
