/**
 * Bio Explorer · Mission 2: Cell City - Canvas 2D scenes.
 */
import { bioLabState, pulseFailFeedback, pulseSuccessFeedback } from "./bio-state.js";
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
 const tw = ctx.measureText(text).width;
 const bw = tw + 24;
 const bh = opts.h || 26;
 ctx.fillStyle = opts.bg || "rgba(20,83,45,0.9)";
 roundRect(ctx, x - bw / 2, y - bh / 2, bw, bh, 10);
 ctx.fill();
 ctx.strokeStyle = opts.border || "rgba(134,239,172,0.5)";
 ctx.lineWidth = 1.4;
 ctx.stroke();
 ctx.fillStyle = opts.color || "#dcfce7";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(text, x, y + 1);
}

function drawCell(ctx, x, y, scale, zoom, focus = "all") {
 ctx.save();
 ctx.translate(x, y);
 ctx.scale(scale, scale);
 const showMembrane = focus === "membrane" || focus === "all" || zoom > 0.45;
 const showNucleus = focus === "nucleus" || focus === "all" || (focus !== "membrane" && zoom > 0.3);
 ctx.strokeStyle = showMembrane && (focus === "membrane" || zoom > 0.7) ? "#fbbf24" : "#4ade80";
 ctx.lineWidth = showMembrane && focus === "membrane" ? 5 : 3;
 ctx.beginPath();
 ctx.ellipse(0, 0, 50, 36, 0, 0, Math.PI * 2);
 ctx.stroke();
 ctx.fillStyle = "rgba(74,222,128,0.15)";
 ctx.fill();
 if (showNucleus && zoom > 0.25) {
 ctx.fillStyle = "#a78bfa";
 ctx.beginPath();
 ctx.arc(-8, 0, 12, 0, Math.PI * 2);
 ctx.fill();
 drawLabel(ctx, "nucleus", -8, -22, { h: 16, font: "600 10px Segoe UI", bg: "rgba(15,23,42,0.7)" });
 }
 if (zoom > 0.55 && focus !== "membrane") {
 ctx.fillStyle = "#38bdf8";
 ctx.beginPath();
 ctx.ellipse(22, 8, 10, 5, 0.3, 0, Math.PI * 2);
 ctx.fill();
 }
 if (showMembrane && (focus === "membrane" || zoom > 0.65)) {
 ctx.strokeStyle = "#fbbf24";
 ctx.lineWidth = 2;
 ctx.setLineDash([4, 3]);
 ctx.beginPath();
 ctx.ellipse(0, 0, 54, 40, 0, 0, Math.PI * 2);
 ctx.stroke();
 ctx.setLineDash([]);
 drawLabel(ctx, "membrane door", 0, 48, { h: 16, font: "600 10px Segoe UI", bg: "rgba(15,23,42,0.75)" });
 }
 ctx.restore();
}

function drawBrickWall(ctx, w, h) {
 for (let r = 0; r < 3; r++) {
 for (let c = 0; c < 5; c++) {
 ctx.fillStyle = "#a8a29e";
 roundRect(ctx, w * 0.2 + c * 55, h * 0.3 + r * 36, 48, 28, 3);
 ctx.fill();
 ctx.strokeStyle = "#57534e";
 ctx.stroke();
 }
 }
}

function drawBodyCells(ctx, w, h) {
 // Soft body outline filled with many tiny cells
 ctx.strokeStyle = "rgba(134,239,172,0.5)";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.ellipse(w * 0.5, h * 0.4, 70, 90, 0, 0, Math.PI * 2);
 ctx.stroke();
 for (let i = 0; i < 18; i++) {
 const a = (i / 18) * Math.PI * 2;
 const cx = w * 0.5 + Math.cos(a) * 40;
 const cy = h * 0.4 + Math.sin(a) * 55;
 ctx.fillStyle = i % 3 === 0 ? "rgba(74,222,128,0.55)" : "rgba(134,239,172,0.4)";
 ctx.beginPath();
 ctx.ellipse(cx, cy, 10, 7, a, 0, Math.PI * 2);
 ctx.fill();
 }
}

function drawTissue(ctx, x, y) {
 for (let i = 0; i < 4; i++) {
 ctx.fillStyle = i % 2 ? "rgba(244,114,182,0.7)" : "rgba(251,113,133,0.7)";
 roundRect(ctx, x - 40 + i * 18, y - 16, 20, 32, 4);
 ctx.fill();
 }
}

function drawHeart(ctx, x, y) {
 ctx.fillStyle = "#f87171";
 ctx.beginPath();
 ctx.moveTo(x, y + 16);
 ctx.bezierCurveTo(x - 28, y - 4, x - 18, y - 28, x, y - 12);
 ctx.bezierCurveTo(x + 18, y - 28, x + 28, y - 4, x, y + 16);
 ctx.fill();
}

function drawAtomDot(ctx, x, y) {
 ctx.fillStyle = "#a78bfa";
 ctx.beginPath();
 ctx.arc(x, y, 8, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "#c4b5fd";
 ctx.beginPath();
 ctx.ellipse(x, y, 22, 10, 0.4, 0, Math.PI * 2);
 ctx.stroke();
}

function drawPhoneMini(ctx, x, y) {
 ctx.fillStyle = "#1e293b";
 roundRect(ctx, x - 12, y - 22, 24, 44, 4);
 ctx.fill();
 ctx.fillStyle = "#38bdf8";
 roundRect(ctx, x - 9, y - 18, 18, 32, 2);
 ctx.fill();
}

function drawLeafCell(ctx, x, y) {
 ctx.fillStyle = "#22c55e";
 ctx.beginPath();
 ctx.ellipse(x, y, 28, 16, -0.4, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#a78bfa";
 ctx.beginPath();
 ctx.arc(x - 4, y, 6, 0, Math.PI * 2);
 ctx.fill();
}

function drawPondDrop(ctx, x, y) {
 ctx.fillStyle = "rgba(56,189,248,0.35)";
 ctx.beginPath();
 ctx.ellipse(x, y, 40, 28, 0, 0, Math.PI * 2);
 ctx.fill();
 drawCell(ctx, x, y, 0.55, 0.7, "all");
}

function drawYeast(ctx, x, y) {
 ctx.fillStyle = "#fde68a";
 ctx.beginPath();
 ctx.arc(x - 10, y, 14, 0, Math.PI * 2);
 ctx.arc(x + 12, y + 4, 10, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#a78bfa";
 ctx.beginPath();
 ctx.arc(x - 10, y, 4, 0, Math.PI * 2);
 ctx.fill();
}

function drawBlood(ctx, x, y) {
 for (let i = 0; i < 5; i++) {
 ctx.fillStyle = "#ef4444";
 ctx.beginPath();
 ctx.ellipse(x - 30 + i * 16, y + (i % 2) * 8, 10, 6, 0, 0, Math.PI * 2);
 ctx.fill();
 }
}

function drawSkinPatch(ctx, x, y) {
 ctx.fillStyle = "#fbbf24";
 roundRect(ctx, x - 36, y - 24, 72, 48, 8);
 ctx.fill();
 for (let r = 0; r < 2; r++) {
 for (let c = 0; c < 3; c++) {
 ctx.strokeStyle = "#d97706";
 roundRect(ctx, x - 30 + c * 20, y - 18 + r * 18, 16, 14, 3);
 ctx.stroke();
 }
 }
}

function failFlash(ctx, w, h) {
 const until = bioLabState.failPulse;
 if (!until || performance.now() > until) return;
 ctx.fillStyle = `rgba(248,113,113,${Math.max(0, (until - performance.now()) / 420) * 0.28})`;
 ctx.fillRect(0, 0, w, h);
}
function successFlash(ctx, w, h) {
 const until = bioLabState.successPulse;
 if (!until || performance.now() > until) return;
 ctx.fillStyle = `rgba(74,222,128,${Math.max(0, (until - performance.now()) / 380) * 0.25})`;
 ctx.fillRect(0, 0, w, h);
}

export function registerCellScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("cellMeet", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions, setIntentHandler } = api;
 const startPhase = opts.phase || bioLabState.phase || "wall";
 bioLabState.phase = startPhase;
 setDescription("Cell City - bodies are made of tiny living rooms.");

 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "zoom") {
 bioLabState.cellZoom = Math.min(1, (bioLabState.cellZoom || 0.2) + 0.15);
 bioLabState.heat = bioLabState.cellZoom;
 pulseSuccessFeedback(220);
 }
 });

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const live = bioLabState.phase || startPhase;
 const zoom = bioLabState.cellZoom || bioLabState.heat || 0.2;
 drawBackdrop();
 if (live === "wall" || live === "desk") {
 drawBrickWall(ctx, w, h);
 drawLabel(ctx, "Bricks make a wall · cells make a body", w * 0.5, layout.labelY);
 } else if (live === "zoom") {
 drawBodyCells(ctx, w, h);
 drawCell(ctx, w * 0.5, h * 0.4, 1.1 + zoom * 0.35, Math.max(zoom, 0.45), "all");
 drawLabel(ctx, "Zoom into one cell - a tiny living room", w * 0.5, layout.labelY);
 } else {
 drawCell(ctx, w * 0.5, h * 0.38, 1.35, 0.85, "all");
 drawLabel(ctx, "Big idea: cells are the basic units of life", w * 0.5, layout.labelY);
 }
 setHitRegions([{ id: "z", shape: "rect", x: w * 0.5, y: h * 0.4, w: 160, h: 120, meta: { action: "zoom" } }]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("cellSort", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } =
 api;
 setDescription("Sort: cell, many cells, or not a cell story.");
 const chips = [
 { id: "skin", text: "Skin cell", short: "Skin", color: 0xfbbf24 },
 { id: "leaf", text: "Leaf cell", short: "Leaf", color: 0x22c55e },
 { id: "pond", text: "Pond microbe", short: "Microbe", color: 0x38bdf8 },
 { id: "brick", text: "Clay brick", short: "Brick", color: 0x78716c },
 { id: "atom", text: "Atom", short: "Atom", color: 0xa78bfa },
 { id: "tissue", text: "Muscle tissue", short: "Tissue", color: 0xf472b6 },
 { id: "organ", text: "Heart organ", short: "Organ", color: 0xf87171 },
 { id: "phone", text: "Phone", short: "Phone", color: 0x94a3b8 },
 ];
 const accept = {
 cell: ["skin", "leaf", "pond"],
 many: ["tissue", "organ"],
 not: ["brick", "atom", "phone"],
 };
 const cardPos = {};
 chips.forEach((c) => {
 cardPos[c.id] = { x: 0, y: 0 };
 });
 let draggingId = null;
 let lastZones = [];

 function placeChip(chipId, zoneId) {
 if (!chipId || !zoneId) return false;
 if (!(accept[zoneId] || []).includes(chipId)) {
 pulseFailFeedback(400);
 return false;
 }
 bioLabState.placed = { ...(bioLabState.placed || {}), [chipId]: zoneId };
 bioLabState.selectedId = chipId;
 const session = getActiveSession();
 if (session?.dispatch) session.dispatch({ type: "PLACE_CHIP", chipId, zoneId, accept: accept[zoneId] });
 else bioLabState._placedVersion = (bioLabState._placedVersion || 0) + 1;
 pulseSuccessFeedback(220);
 return true;
 }
 function zoneAt(x, y) {
 for (const z of lastZones) {
 if (x >= z.x && x <= z.x + z.ww && y >= z.y && y <= z.y + z.hh) return z.id;
 }
 return null;
 }

 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DOWN" && intent.meta?.chipId) {
 draggingId = intent.meta.chipId;
 bioLabState.selectedId = intent.meta.chipId;
 }
 if (intent.type === "CANVAS_DRAG" && intent.meta?.chipId && cardPos[intent.meta.chipId]) {
 draggingId = intent.meta.chipId;
 cardPos[intent.meta.chipId].x = intent.x;
 cardPos[intent.meta.chipId].y = intent.y;
 }
 if (intent.type === "CANVAS_TAP" && intent.meta?.chipId) bioLabState.selectedId = intent.meta.chipId;
 if (intent.type === "CANVAS_TAP" && intent.meta?.zoneId && bioLabState.selectedId) {
 placeChip(bioLabState.selectedId, intent.meta.zoneId);
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
 { id: "cell", label: "A cell", x: w * 0.03, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#22c55e" },
 { id: "many", label: "Many cells", x: w * 0.35, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#f472b6" },
 { id: "not", label: "Not a cell", x: w * 0.67, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#94a3b8" },
 ];
 lastZones = zones;
 const hits = [];
 for (const z of zones) {
 ctx.fillStyle = "rgba(5,46,22,0.7)";
 roundRect(ctx, z.x, z.y, z.ww, z.hh, 12);
 ctx.fill();
 ctx.strokeStyle = z.color;
 ctx.lineWidth = 2.5;
 ctx.stroke();
 drawLabel(ctx, z.label, z.x + z.ww / 2, z.y + 16, { h: 20, font: "700 12px Segoe UI" });
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
 const placed = bioLabState.placed || {};
 const byZone = {
 cell: chips.filter((c) => placed[c.id] === "cell").map((c) => c.id),
 many: chips.filter((c) => placed[c.id] === "many").map((c) => c.id),
 not: chips.filter((c) => placed[c.id] === "not").map((c) => c.id),
 };
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
 ctx.fillStyle = bioLabState.selectedId === c.id ? "rgba(74,222,128,0.4)" : "rgba(20,83,45,0.95)";
 roundRect(ctx, prev.x - 48, prev.y - 16, 96, 32, 8);
 ctx.fill();
 ctx.strokeStyle = "#" + c.color.toString(16).padStart(6, "0");
 ctx.stroke();
 ctx.fillStyle = "#dcfce7";
 ctx.font = "700 12px Segoe UI";
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
 drawLabel(ctx, "Cell · many cells · not a cell", w * 0.5, layout.labelY);
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("cellLab", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 setDescription("Microscope peek - membrane door and nucleus office (not particle zoom).");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
 const next = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
 bioLabState.heat = next;
 bioLabState.cellZoom = next;
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const zoom = bioLabState.heat ?? bioLabState.cellZoom ?? 0.3;
 const focus = bioLabState.labFocus || bioLabState.organelle || "all";
 drawBackdrop();
 // Microscope ring (biology lens, not chemistry particle cloud)
 ctx.strokeStyle = "rgba(148,163,184,0.55)";
 ctx.lineWidth = 10;
 ctx.beginPath();
 ctx.arc(w * 0.5, h * 0.38, 88, 0, Math.PI * 2);
 ctx.stroke();
 drawCell(ctx, w * 0.5, h * 0.38, 1.35, zoom, focus === "membrane" ? "membrane" : focus === "nucleus" ? "nucleus" : "all");
 const hx = w * 0.2 + zoom * w * 0.6;
 ctx.fillStyle = focus === "membrane" ? "#fbbf24" : "#4ade80";
 ctx.beginPath();
 ctx.arc(hx, h * 0.68, 14, 0, Math.PI * 2);
 ctx.fill();
 const tip =
 focus === "membrane"
 ? zoom > 0.7
 ? "Membrane = door / boundary"
 : "Peek the membrane edge"
 : zoom > 0.75
 ? "Cell City jobs visible"
 : "Microscope zoom into the living room";
 drawLabel(ctx, tip, w * 0.5, layout.labelY);
 setHitRegions([{ id: "h", shape: "rect", x: hx, y: h * 0.68, w: 48, h: 48, meta: { action: "stretch" } }]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("cellRule", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Cells are the basic units of life.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const prog = bioLabState.tokenProgress || 0;
 drawBackdrop();
 const tokens = ["Living", "things", "are made", "of cells"];
 tokens.forEach((label, i) => {
 const x = w * 0.18 + i * (w * 0.18);
 const on = i < prog;
 ctx.fillStyle = on ? "rgba(74,222,128,0.4)" : "rgba(20,83,45,0.9)";
 roundRect(ctx, x - 48, h * 0.36 - 18, 96, 36, 10);
 ctx.fill();
 ctx.fillStyle = on ? "#dcfce7" : "#86efac";
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(label, x, h * 0.36);
 });
 drawCell(ctx, w * 0.5, h * 0.58, 0.9, 0.8);
 drawLabel(ctx, "Cell rule: basic living units", w * 0.5, layout.labelY);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("cellStretch", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const modes = [
 { id: "pond", label: "Pond" },
 { id: "leaf", label: "Leaf" },
 { id: "skin", label: "Skin" },
 { id: "yeast", label: "Yeast" },
 { id: "blood", label: "Blood" },
 ];
 setDescription("Same cell idea in pond, leaf, skin, yeast, blood.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.mode) {
 bioLabState.mode = intent.meta.mode;
 pulseSuccessFeedback(200);
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const mode = bioLabState.mode || "pond";
 drawBackdrop();
 const hits = [];
 modes.forEach((m, i) => {
 const x = w * 0.12 + i * (w * 0.17);
 ctx.fillStyle = m.id === mode ? "rgba(74,222,128,0.4)" : "#14532d";
 roundRect(ctx, x - 36, layout.deskTop - 36, 72, 48, 10);
 ctx.fill();
 ctx.fillStyle = "#dcfce7";
 ctx.font = "600 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(m.label, x, layout.deskTop - 10);
 hits.push({ id: m.id, shape: "rect", x, y: layout.deskTop - 12, w: 72, h: 48, meta: { mode: m.id } });
 });
 if (mode === "pond") drawPondDrop(ctx, w * 0.5, h * 0.36);
 else if (mode === "leaf") drawLeafCell(ctx, w * 0.5, h * 0.36);
 else if (mode === "skin") drawSkinPatch(ctx, w * 0.5, h * 0.36);
 else if (mode === "yeast") drawYeast(ctx, w * 0.5, h * 0.36);
 else drawBlood(ctx, w * 0.5, h * 0.36);
 const captions = {
 pond: "Pond drop - often tiny living cells",
 leaf: "Mango leaf - many plant cells",
 skin: "Your skin - layers of animal cells",
 yeast: "Yeast - one-celled living fungus",
 blood: "Blood has living cells (not empty liquid)",
 };
 drawLabel(ctx, captions[mode], w * 0.5, layout.labelY);
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("cellMyth", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const myths = [
 { claim: "Only animals have cells", truth: "Plants, fungi, and microbes have cells too", claimVis: "skin", truthVis: "leaf" },
 { claim: "Cells are the same as atoms", truth: "Atoms are much smaller - cells are living units made of many molecules", claimVis: "atom", truthVis: "cell" },
 { claim: "Blood isn’t made of cells", truth: "Blood contains living cells (and liquid plasma)", claimVis: "blood", truthVis: "blood" },
 { claim: "A brick is like a cell", truth: "Bricks are analogy only - bricks aren’t alive", claimVis: "brick", truthVis: "cell" },
 { claim: "One cell can’t be a whole organism", truth: "Many pond microbes are whole living things with one cell", claimVis: "tissue", truthVis: "pond" },
 ];
 setDescription("Bust cell myths.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "flip") {
 bioLabState.mythPhase = bioLabState.mythPhase === "truth" ? "claim" : "truth";
 if (bioLabState.mythPhase === "truth") pulseSuccessFeedback(220);
 }
 });
 function drawMythVis(kind, x, y) {
 if (kind === "skin") drawSkinPatch(ctx, x, y);
 else if (kind === "leaf") drawLeafCell(ctx, x, y);
 else if (kind === "atom") drawAtomDot(ctx, x, y);
 else if (kind === "blood") drawBlood(ctx, x, y);
 else if (kind === "brick") {
 ctx.fillStyle = "#a8a29e";
 roundRect(ctx, x - 28, y - 16, 56, 32, 4);
 ctx.fill();
 } else if (kind === "tissue") drawTissue(ctx, x, y);
 else if (kind === "pond") drawPondDrop(ctx, x, y);
 else drawCell(ctx, x, y, 0.9, 0.8, "all");
 }
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const idx = bioLabState.myth ?? 0;
 const phase = bioLabState.mythPhase || "claim";
 const m = myths[idx] || myths[0];
 drawBackdrop();
 ctx.fillStyle = phase === "truth" ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.18)";
 roundRect(ctx, w * 0.12, h * 0.2, w * 0.76, h * 0.46, 16);
 ctx.fill();
 drawMythVis(phase === "truth" ? m.truthVis : m.claimVis, w * 0.5, h * 0.34);
 drawLabel(ctx, phase === "truth" ? m.truth : `Myth: ${m.claim}`, w * 0.5, h * 0.54, {
 h: 44,
 font: "700 12px Segoe UI",
 });
 drawLabel(ctx, `Myth ${idx + 1} / 5 · Tap to flip`, w * 0.5, layout.labelY);
 setHitRegions([{ id: "card", shape: "rect", x: w * 0.5, y: h * 0.42, w: w * 0.76, h: h * 0.46, meta: { action: "flip" } }]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("cellDrill", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription(bioLabState.prompt || "Cell drill");
 function drillVis(prompt) {
 const p = (prompt || "").toLowerCase();
 if (p.includes("brick")) return "brick";
 if (p.includes("atom")) return "atom";
 if (p.includes("heart")) return "heart";
 if (p.includes("phone")) return "phone";
 if (p.includes("microbe") || p.includes("pond")) return "pond";
 if (p.includes("skin")) return "skin";
 return "cell";
 }
 setTick(() => {
 const w = api.width;
 const h = api.height;
 drawBackdrop();
 drawLabel(ctx, bioLabState.prompt || "Cell City drill", w * 0.5, h * 0.18, { h: 32, font: "700 16px Segoe UI" });
 const kind = drillVis(bioLabState.prompt);
 if (kind === "brick") {
 ctx.fillStyle = "#a8a29e";
 roundRect(ctx, w * 0.5 - 40, h * 0.45 - 20, 80, 40, 4);
 ctx.fill();
 } else if (kind === "atom") drawAtomDot(ctx, w * 0.5, h * 0.48);
 else if (kind === "heart") drawHeart(ctx, w * 0.5, h * 0.48);
 else if (kind === "phone") drawPhoneMini(ctx, w * 0.5, h * 0.48);
 else if (kind === "pond") drawPondDrop(ctx, w * 0.5, h * 0.48);
 else if (kind === "skin") drawSkinPatch(ctx, w * 0.5, h * 0.48);
 else drawCell(ctx, w * 0.5, h * 0.48, 1.15, 0.8, "all");
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("cellMastery", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Cell Scout mastery.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const locked = bioLabState.masteryStep || 0;
 drawBackdrop();
 ["Meet", "Sort", "Lab", "Rule", "Myth", "Scout"].forEach((label, i) => {
 const x = w * 0.1 + i * (w * 0.14);
 ctx.fillStyle = i < locked ? "#22c55e" : "rgba(148,163,184,0.35)";
 roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8);
 ctx.fill();
 ctx.fillStyle = "#052e16";
 ctx.font = "600 10px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(label, x, h * 0.78);
 });
 drawCell(ctx, w * 0.28, h * 0.38, 0.9, 0.85, "all");
 drawTissue(ctx, w * 0.52, h * 0.38);
 drawHeart(ctx, w * 0.74, h * 0.36);
 drawLabel(ctx, "cell", w * 0.28, h * 0.56, { h: 18, font: "600 11px Segoe UI" });
 drawLabel(ctx, "tissue", w * 0.52, h * 0.56, { h: 18, font: "600 11px Segoe UI" });
 drawLabel(ctx, "organ", w * 0.74, h * 0.56, { h: 18, font: "600 11px Segoe UI" });
 drawLabel(ctx, "Cell Scout!", w * 0.5, layout.labelY);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });
}
