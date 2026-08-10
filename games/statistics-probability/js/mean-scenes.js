/**
 * Statistics · Mission 1: Mean & Mode - Canvas 2D scenes.
 * Data bars, mean balance line, mode peak stacks, outlier pull, BD data stretch.
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

function drawBars(ctx, cx, cy, vals, scale = 1, opts = {}) {
 const n = vals.length;
 const bw = (opts.bw || 18) * scale;
 const gap = (opts.gap || 10) * scale;
 const totalW = n * bw + (n - 1) * gap;
 const baseY = cy + 50 * scale;
 const highlight = opts.highlightIndex;
 vals.forEach((v, i) => {
 const h = Math.max(12, v * 12 * scale);
 const x = cx - totalW / 2 + i * (bw + gap);
 const isHi = highlight === i;
 ctx.fillStyle = isHi ? "#f97316" : i % 2 ? "#f59e0b" : "#fbbf24";
 roundRect(ctx, x, baseY - h, bw, h, 4);
 ctx.fill();
 if (isHi) {
 ctx.strokeStyle = "#fdba74";
 ctx.lineWidth = 2;
 ctx.stroke();
 }
 ctx.fillStyle = "#fef3c7";
 ctx.font = `700 ${Math.round(11 * scale)}px Segoe UI`;
 ctx.textAlign = "center";
 ctx.fillText(String(v), x + bw / 2, baseY - h - 10);
 });
 ctx.strokeStyle = "rgba(253,230,138,0.5)";
 ctx.beginPath();
 ctx.moveTo(cx - totalW / 2 - 8, baseY);
 ctx.lineTo(cx + totalW / 2 + 8, baseY);
 ctx.stroke();
 return { baseY, totalW };
}

function drawMeanLine(ctx, cx, cy, mean, pulse) {
 const y = cy + 50 - mean * 12;
 ctx.strokeStyle = `rgba(253,230,138,${0.45 + pulse * 0.4})`;
 ctx.lineWidth = 2;
 ctx.setLineDash([6, 4]);
 ctx.beginPath();
 ctx.moveTo(cx - 100, y);
 ctx.lineTo(cx + 100, y);
 ctx.stroke();
 ctx.setLineDash([]);
 drawLabel(ctx, "mean " + mean, cx + 78, y, { h: 20, font: "700 11px Segoe UI" });
 return y;
}

function drawModeStacks(ctx, x, y, modeVal, stackCount = 3) {
 const n = Math.max(1, Math.min(5, stackCount));
 for (let i = 0; i < n; i++) {
 ctx.fillStyle = i === n - 1 ? "#f59e0b" : "#fbbf24";
 ctx.beginPath();
 ctx.arc(x, y - i * 22, 12, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "rgba(69,26,3,0.35)";
 ctx.lineWidth = 1;
 ctx.stroke();
 }
 ctx.fillStyle = "#fef3c7";
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("mode " + modeVal, x, y + 36);
}

function drawNotebook(ctx, x, y, lines) {
 ctx.fillStyle = "#fef3c7";
 roundRect(ctx, x - 48, y - 40, 96, 72, 6);
 ctx.fill();
 ctx.strokeStyle = "#b45309";
 ctx.lineWidth = 1.5;
 ctx.stroke();
 ctx.fillStyle = "#78350f";
 ctx.font = "600 10px Segoe UI";
 ctx.textAlign = "left";
 lines.forEach((line, i) => {
 ctx.fillText(line, x - 38, y - 22 + i * 14);
 });
}

function meanOf(vals) {
 if (!vals.length) return 0;
 return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
}

function modeOf(vals) {
 const freq = {};
 vals.forEach((v) => {
 freq[v] = (freq[v] || 0) + 1;
 });
 let best = vals[0];
 let bestN = 0;
 Object.keys(freq).forEach((k) => {
 if (freq[k] > bestN) {
 bestN = freq[k];
 best = Number(k);
 }
 });
 return { mode: best, count: bestN };
}

export function registerMeanScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("meanMeet", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions } = api;
 labState.phase = opts.phase || labState.phase || "desk";
 if (!labState.dataVals) labState.dataVals = [2, 4, 4, 5, 5];
 setDescription("Mean & Mode - balance line and most-common peak.");
 const props = { bars: { x: 0, y: 0 }, mean: { x: 0, y: 0 }, mode: { x: 0, y: 0 } };
 let inited = false;
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const live = labState.phase || "desk";
 const vals = labState.dataVals || [2, 4, 4, 5, 5];
 const mean = labState.meanVal ?? meanOf(vals);
 const mode = labState.modeVal ?? modeOf(vals).mode;
 const pulse = labState.heat || 0.4;
 drawBackdrop();
 if (!inited) {
 props.bars.x = w * 0.35;
 props.bars.y = h * 0.4;
 props.mean.x = w * 0.35;
 props.mean.y = h * 0.4;
 props.mode.x = w * 0.72;
 props.mode.y = h * 0.48;
 inited = true;
 }
 ctx.fillStyle = "#92400e";
 roundRect(ctx, w * 0.08, layout.deskTop - 8, w * 0.84, 18, 8);
 ctx.fill();
 drawBars(ctx, props.bars.x, props.bars.y, vals);
 if (live === "glow" || live === "settle" || live === "predict") {
 drawMeanLine(ctx, props.mean.x, props.mean.y, mean, pulse);
 }
 if (live === "predict") {
 drawLabel(ctx, "Which value appears most?", props.mode.x, props.mode.y - 40, {
 h: 22,
 font: "700 12px Segoe UI",
 });
 ctx.globalAlpha = 0.35;
 drawModeStacks(ctx, props.mode.x, props.mode.y, "?", 2);
 ctx.globalAlpha = 1;
 }
 if (live === "settle" || live === "glow") {
 drawModeStacks(ctx, props.mode.x, props.mode.y, mode, 3);
 }
 const tips = {
 desk: "Drag data bars - each height is a value",
 glow: "Mean line balances the set (sum ÷ count)",
 predict: "Predict the mode before we crown it",
 settle: "Mode stacks highest - value that appears most",
 };
 drawLabel(ctx, tips[live] || tips.desk, w * 0.5, layout.labelY);
 const hits = [
 {
 id: "bars",
 shape: "rect",
 x: props.bars.x,
 y: props.bars.y,
 w: 160,
 h: 120,
 meta: { propId: "bars" },
 onDrag(pt) {
 props.bars.x = Math.max(80, Math.min(w - 80, pt.x));
 props.bars.y = Math.max(80, Math.min(layout.deskTop, pt.y));
 props.mean.x = props.bars.x;
 props.mean.y = props.bars.y;
 },
 },
 {
 id: "mode",
 shape: "rect",
 x: props.mode.x,
 y: props.mode.y,
 w: 80,
 h: 100,
 meta: { propId: "mode" },
 onDrag(pt) {
 props.mode.x = Math.max(50, Math.min(w - 50, pt.x));
 props.mode.y = Math.max(80, Math.min(layout.deskTop, pt.y));
 },
 },
 ];
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("meanSort", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } =
 api;
 setDescription("Sort: mean idea, mode idea, or not a summary.");
 const chips = [
 { id: "adddiv", short: "Add/div", color: 0xfbbf24 },
 { id: "peak", short: "Most", color: 0xf59e0b },
 { id: "balance", short: "Balance", color: 0xfde68a },
 { id: "stack", short: "Stack", color: 0xd97706 },
 { id: "share", short: "Share", color: 0xfbbf24 },
 { id: "color", short: "Color", color: 0x94a3b8 },
 { id: "guess", short: "Guess", color: 0x78716c },
 { id: "ties", short: "Tie mode", color: 0xf97316 },
 ];
 const accept = {
 mean: ["adddiv", "balance", "share"],
 mode: ["peak", "stack", "ties"],
 not: ["color", "guess"],
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
 if (intent.type === "CANVAS_TAP" && intent.meta?.zoneId && labState.selectedId) {
 placeChip(labState.selectedId, intent.meta.zoneId);
 }
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
 { id: "mean", label: "Mean idea", x: w * 0.02, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#fbbf24" },
 { id: "mode", label: "Mode idea", x: w * 0.35, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#f59e0b" },
 { id: "not", label: "Not a summary", x: w * 0.68, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#94a3b8" },
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
 const byZone = { mean: [], mode: [], not: [] };
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
 const slot = sortSlotPositions(
 { x: z.x, y: z.y + 18, w: z.ww, h: z.hh - 22 },
 Math.max(byZone[zoneKey].length, 1),
 idx,
 );
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
 ctx.fillStyle = labState.selectedId === c.id ? "rgba(251,191,36,0.4)" : "rgba(15,23,42,0.95)";
 roundRect(ctx, prev.x - 48, prev.y - 16, 96, 32, 8);
 ctx.fill();
 ctx.strokeStyle = "#" + c.color.toString(16).padStart(6, "0");
 ctx.stroke();
 ctx.fillStyle = "#fef3c7";
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
 drawLabel(ctx, "Mean · Mode · Not a summary", w * 0.5, layout.labelY);
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("meanLab", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, opts } = api;
 const labMode = opts.labMode || labState.labMode || "outlier";
 labState.labMode = labMode;
 setDescription(
 labMode === "peak"
 ? "Dial clarity - watch the mode peak stack tall."
 : "Dial outlier pull - watch the mean line move.",
 );
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

 let vals;
 let tip;
 if (labMode === "peak") {
 const peakH = 2 + Math.round(heat * 3);
 vals = [3, 3, peakH >= 3 ? 3 : 2, 8, 9];
 if (peakH >= 4) vals = [3, 3, 3, 3, 9];
 if (peakH >= 5) vals = [3, 3, 3, 3, 3];
 const mo = modeOf(vals);
 drawBars(ctx, w * 0.38, h * 0.36, vals);
 drawMeanLine(ctx, w * 0.38, h * 0.36, meanOf(vals), heat);
 drawModeStacks(ctx, w * 0.78, h * 0.42, mo.mode, Math.min(5, mo.count));
 tip = heat >= 0.75 ? "Mode peak clear · mean line visible" : "Drag - clarify the mode peak";
 } else {
 const base = [4, 4, 5, 5];
 const outlier = Math.round(5 + heat * 20);
 vals = [...base, outlier];
 labState.outlier = outlier;
 labState.dataVals = vals;
 const mean = meanOf(vals);
 labState.meanVal = mean;
 labState.modeVal = 4;
 drawBars(ctx, w * 0.38, h * 0.36, vals, 1, { highlightIndex: vals.length - 1 });
 drawMeanLine(ctx, w * 0.38, h * 0.36, mean, heat);
 drawModeStacks(ctx, w * 0.78, h * 0.42, 4, 2);
 drawLabel(ctx, "outlier " + outlier, w * 0.78, h * 0.62, { h: 20, font: "700 11px Segoe UI" });
 tip =
 heat >= 0.6
 ? "Mean pulled up · mode still with the crowd"
 : "Drag - grow the outlier, watch mean rise";
 }

 const hx = w * 0.2 + heat * w * 0.6;
 ctx.fillStyle = "#fbbf24";
 ctx.beginPath();
 ctx.arc(hx, h * 0.72, 14, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "#b45309";
 ctx.lineWidth = 2;
 ctx.stroke();
 drawLabel(ctx, tip, w * 0.5, layout.labelY);
 setHitRegions([{ id: "h", shape: "rect", x: hx, y: h * 0.72, w: 48, h: 48, meta: { action: "stretch" } }]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("meanRule", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Mean = sum / count · Mode = most common.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const prog = labState.tokenProgress || 0;
 const scale = labState.scale ?? 0;
 drawBackdrop();

 const vals = [2, 4, 4, 5];
 if (scale < 0.33) {
 drawNotebook(ctx, w * 0.22, h * 0.42, ["list:", "2, 4, 4, 5"]);
 drawBars(ctx, w * 0.58, h * 0.42, vals, 0.85);
 drawLabel(ctx, "Start with an honest list", w * 0.5, layout.labelY);
 } else if (scale < 0.66) {
 ["Sum", "/", "Count", "= Mean"].forEach((label, i) => {
 const x = w * 0.18 + i * (w * 0.18);
 ctx.fillStyle = i < Math.max(prog, 3) ? "rgba(251,191,36,0.45)" : "rgba(15,23,42,0.9)";
 roundRect(ctx, x - 44, h * 0.32 - 18, 88, 36, 10);
 ctx.fill();
 ctx.fillStyle = "#fef3c7";
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(label, x, h * 0.32);
 });
 drawBars(ctx, w * 0.5, h * 0.55, vals, 0.85);
 drawMeanLine(ctx, w * 0.5, h * 0.55, 3.8, 0.7);
 drawLabel(ctx, "Mean balances (sum ÷ count)", w * 0.5, layout.labelY);
 } else {
 drawBars(ctx, w * 0.38, h * 0.4, vals, 0.9);
 drawMeanLine(ctx, w * 0.38, h * 0.4, 3.8, 0.5);
 drawModeStacks(ctx, w * 0.72, h * 0.42, 4, 2);
 drawLabel(ctx, "Mode crowns the peak · mean still balances", w * 0.5, layout.labelY);
 }

 if (scale < 0.05 && prog > 0) {
 ["Sum", "/", "Count", "= Mean"].forEach((label, i) => {
 const x = w * 0.18 + i * (w * 0.18);
 ctx.fillStyle = i < prog ? "rgba(251,191,36,0.4)" : "rgba(15,23,42,0.9)";
 roundRect(ctx, x - 44, h * 0.36 - 18, 88, 36, 10);
 ctx.fill();
 ctx.fillStyle = "#fef3c7";
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(label, x, h * 0.36);
 });
 drawBars(ctx, w * 0.5, h * 0.58, vals, 0.85);
 drawLabel(ctx, "Mean & Mode rule", w * 0.5, layout.labelY);
 }

 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("meanStretch", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, opts } = api;
 const modes = ["marks", "cricket", "shop", "bus", "weather"];
 if (opts.mode) labState.mode = opts.mode;
 setDescription("Same summaries in Bangladesh data stories.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.mode) {
 labState.mode = intent.meta.mode;
 pulseSuccessFeedback(200);
 }
 });

 const datasets = {
 marks: { vals: [70, 80, 80, 75, 80], mode: 80, label: "marks" },
 cricket: { vals: [12, 24, 24, 8, 30], mode: 24, label: "runs" },
 shop: { vals: [10, 10, 40, 10, 25], mode: 10, label: "৳" },
 bus: { vals: [5, 5, 5, 20, 6], mode: 5, label: "min" },
 weather: { vals: [30, 31, 30, 29, 30], mode: 30, label: "°C" },
 };

 function drawProp(mode, cx, cy) {
 if (mode === "marks") {
 drawNotebook(ctx, cx, cy, ["70", "80", "80"]);
 } else if (mode === "cricket") {
 ctx.fillStyle = "#166534";
 ctx.beginPath();
 ctx.arc(cx, cy, 22, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "#fef3c7";
 ctx.lineWidth = 2;
 ctx.stroke();
 ctx.fillStyle = "#fef3c7";
 ctx.font = "700 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("🏏", cx, cy + 1);
 } else if (mode === "shop") {
 ctx.fillStyle = "#b45309";
 roundRect(ctx, cx - 28, cy - 20, 56, 40, 6);
 ctx.fill();
 ctx.fillStyle = "#fef3c7";
 ctx.font = "700 14px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("৳10", cx, cy + 2);
 } else if (mode === "bus") {
 ctx.fillStyle = "#1e3a8a";
 roundRect(ctx, cx - 36, cy - 16, 72, 32, 8);
 ctx.fill();
 ctx.fillStyle = "#93c5fd";
 roundRect(ctx, cx - 28, cy - 10, 20, 14, 3);
 ctx.fill();
 ctx.fillStyle = "#fef3c7";
 ctx.font = "600 10px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("BUS", cx + 12, cy + 2);
 } else {
 ctx.fillStyle = "#38bdf8";
 ctx.beginPath();
 ctx.arc(cx, cy - 8, 16, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#fef3c7";
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("30°", cx, cy + 22);
 }
 }

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const mode = labState.mode || "marks";
 const ds = datasets[mode] || datasets.marks;
 drawBackdrop();
 const hits = [];
 modes.forEach((m, i) => {
 const x = w * 0.12 + i * (w * 0.17);
 ctx.fillStyle = m === mode ? "rgba(251,191,36,0.45)" : "#78350f";
 roundRect(ctx, x - 36, layout.deskTop - 36, 72, 48, 10);
 ctx.fill();
 ctx.fillStyle = "#fef3c7";
 ctx.font = "600 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(m, x, layout.deskTop - 10);
 hits.push({ id: m, shape: "rect", x, y: layout.deskTop - 12, w: 72, h: 48, meta: { mode: m } });
 });
 drawProp(mode, w * 0.18, h * 0.4);
 const scaled = ds.vals.map((v) => Math.max(1, Math.round(v / (mode === "marks" || mode === "shop" ? 12 : mode === "weather" ? 6 : 4))));
 drawBars(ctx, w * 0.48, h * 0.38, scaled, 0.9);
 drawMeanLine(ctx, w * 0.48, h * 0.38, meanOf(scaled), 0.6);
 drawModeStacks(ctx, w * 0.78, h * 0.4, ds.mode, 3);
 const captions = {
 marks: "Class marks - mean score, mode mark",
 cricket: "Run totals - typical and most common",
 shop: "Price tags - average cost, common price",
 bus: "Wait times - mean wait, usual wait",
 weather: "Temperatures - average day, most common",
 };
 drawLabel(ctx, captions[mode], w * 0.5, layout.labelY);
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("meanMyth", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const myths = [
 {
 claim: "Mean and mode are always the same",
 truth: "They can differ - mean balances; mode is most common",
 draw(c, cx, cy, phase) {
 const vals = [2, 2, 2, 9];
 drawBars(c, cx - 40, cy, vals, 0.75);
 if (phase === "truth") {
 drawMeanLine(c, cx - 40, cy, meanOf(vals), 0.8);
 drawModeStacks(c, cx + 70, cy + 10, 2, 3);
 } else {
 drawLabel(c, "same?", cx + 60, cy, { h: 22, font: "700 12px Segoe UI" });
 }
 },
 },
 {
 claim: "Mode needs every value once",
 truth: "Mode is the value that appears most (ties ok)",
 draw(c, cx, cy, phase) {
 drawModeStacks(c, cx - 30, cy + 10, 4, phase === "truth" ? 3 : 1);
 drawModeStacks(c, cx + 40, cy + 10, 5, phase === "truth" ? 3 : 1);
 if (phase === "truth") drawLabel(c, "tie ok", cx + 5, cy - 50, { h: 20, font: "700 11px Segoe UI" });
 },
 },
 {
 claim: "Mean ignores the count",
 truth: "Mean divides by how many values you have",
 draw(c, cx, cy, phase) {
 drawLabel(c, phase === "truth" ? "sum ÷ count" : "sum only?", cx, cy, {
 h: 28,
 font: "700 14px Segoe UI",
 });
 drawBars(c, cx, cy + 50, [2, 4, 6], 0.7);
 },
 },
 {
 claim: "Only adults use averages",
 truth: "Kids use mean/mode for marks, scores, prices",
 draw(c, cx, cy) {
 drawNotebook(c, cx - 50, cy, ["marks", "80, 80"]);
 c.fillStyle = "#b45309";
 roundRect(c, cx + 30, cy - 16, 50, 32, 6);
 c.fill();
 c.fillStyle = "#fef3c7";
 c.font = "700 12px Segoe UI";
 c.textAlign = "center";
 c.fillText("৳10", cx + 55, cy + 2);
 },
 },
 {
 claim: "Outliers never move the mean",
 truth: "A very large or small value can pull the mean",
 draw(c, cx, cy, phase) {
 const vals = phase === "truth" ? [4, 4, 4, 20] : [4, 4, 4, 5];
 drawBars(c, cx, cy, vals, 0.8, { highlightIndex: 3 });
 drawMeanLine(c, cx, cy, meanOf(vals), 0.7);
 },
 },
 ];
 setDescription("Bust mean/mode myths.");
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
 ctx.fillStyle = phase === "truth" ? "rgba(251,191,36,0.18)" : "rgba(248,113,113,0.16)";
 roundRect(ctx, w * 0.08, h * 0.22, w * 0.84, h * 0.42, 16);
 ctx.fill();
 m.draw(ctx, w * 0.5, h * 0.38, phase);
 drawLabel(ctx, phase === "truth" ? m.truth : "Myth: " + m.claim, w * 0.5, h * 0.68, {
 h: 36,
 font: "700 12px Segoe UI",
 maxW: w * 0.82,
 });
 drawLabel(ctx, "Myth " + (idx + 1) + " / 5 · Tap card to flip", w * 0.5, layout.labelY);
 setHitRegions([
 { id: "card", shape: "rect", x: w * 0.5, y: h * 0.42, w: w * 0.84, h: h * 0.45, meta: { action: "flip" } },
 ]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("meanDrill", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription(labState.prompt || "Mean drill");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const prompt = (labState.prompt || "").toLowerCase();
 drawBackdrop();
 drawLabel(ctx, labState.prompt || "Mean & Mode drill", w * 0.5, h * 0.16, {
 h: 32,
 font: "700 16px Segoe UI",
 });

 if (prompt.includes("2,2,9") || prompt.includes("mode")) {
 drawBars(ctx, w * 0.4, h * 0.48, [2, 2, 9], 1);
 drawModeStacks(ctx, w * 0.75, h * 0.48, 2, 2);
 } else if (prompt.includes("3,5,7") || prompt.includes("mean")) {
 drawBars(ctx, w * 0.45, h * 0.48, [3, 5, 7], 1);
 drawMeanLine(ctx, w * 0.45, h * 0.48, 5, 0.7);
 } else if (prompt.includes("outlier")) {
 drawBars(ctx, w * 0.45, h * 0.48, [4, 4, 4, 18], 0.95, { highlightIndex: 3 });
 drawMeanLine(ctx, w * 0.45, h * 0.48, meanOf([4, 4, 4, 18]), 0.8);
 } else if (prompt.includes("color")) {
 ctx.fillStyle = "#94a3b8";
 roundRect(ctx, w * 0.35, h * 0.4, w * 0.3, 48, 10);
 ctx.fill();
 drawLabel(ctx, "not a summary", w * 0.5, h * 0.58, { h: 22, font: "700 12px Segoe UI" });
 } else if (prompt.includes("tie")) {
 drawModeStacks(ctx, w * 0.38, h * 0.48, 4, 3);
 drawModeStacks(ctx, w * 0.62, h * 0.48, 5, 3);
 } else if (prompt.includes("differ")) {
 drawBars(ctx, w * 0.4, h * 0.48, [2, 2, 2, 10], 0.9);
 drawMeanLine(ctx, w * 0.4, h * 0.48, 4, 0.7);
 drawModeStacks(ctx, w * 0.75, h * 0.48, 2, 3);
 } else {
 drawBars(ctx, w * 0.5, h * 0.48, [2, 4, 4, 5], 1);
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("meanMastery", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Mean Scout mastery.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const locked = labState.masteryStep || 0;
 drawBackdrop();
 ["Meet", "Sort", "Lab", "Rule", "Myth", "Scout"].forEach((label, i) => {
 const x = w * 0.1 + i * (w * 0.14);
 ctx.fillStyle = i < locked ? "#fbbf24" : "rgba(148,163,184,0.35)";
 roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8);
 ctx.fill();
 ctx.fillStyle = "#0f172a";
 ctx.font = "600 10px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(label, x, h * 0.78);
 });
 // Snack prices showcase: 10, 10, 40
 drawBars(ctx, w * 0.35, h * 0.38, [10, 10, 40].map((v) => Math.round(v / 5)), 1, {
 highlightIndex: 2,
 });
 drawMeanLine(ctx, w * 0.35, h * 0.38, 4, 0.7);
 drawModeStacks(ctx, w * 0.68, h * 0.4, 10, 2);
 drawLabel(ctx, "৳10, ৳10, ৳40 → mode 10 · mean 20", w * 0.5, h * 0.62, {
 h: 24,
 font: "700 12px Segoe UI",
 });
 drawLabel(ctx, "Mean Scout!", w * 0.5, layout.labelY);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });
}
