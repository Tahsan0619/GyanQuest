/**
 * Bio Explorer · Mission 3: Plant Power - Canvas 2D scenes.
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
 const bw = Math.min(tw + 24, opts.maxW || 520);
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

function drawPlant(ctx, x, y, scale, stage) {
 ctx.save();
 ctx.translate(x, y);
 ctx.scale(scale, scale);
 ctx.fillStyle = "#854d0e";
 ctx.fillRect(-4, 0, 8, 50);
 if (stage >= 1) {
 ctx.fillStyle = "#22c55e";
 ctx.beginPath();
 ctx.ellipse(-18, 10, 16, 8, -0.5, 0, Math.PI * 2);
 ctx.fill();
 ctx.beginPath();
 ctx.ellipse(18, 5, 16, 8, 0.5, 0, Math.PI * 2);
 ctx.fill();
 }
 if (stage >= 2) {
 ctx.fillStyle = "#fbbf24";
 ctx.beginPath();
 ctx.arc(0, -18, 14, 0, Math.PI * 2);
 ctx.fill();
 }
 if (stage >= 3) {
 ctx.fillStyle = "#f97316";
 ctx.beginPath();
 ctx.arc(-8, -28, 6, 0, Math.PI * 2);
 ctx.fill();
 ctx.beginPath();
 ctx.arc(8, -26, 6, 0, Math.PI * 2);
 ctx.fill();
 }
 ctx.restore();
}

function drawSeedOval(ctx, x, y) {
 ctx.fillStyle = "#a16207";
 ctx.beginPath();
 ctx.ellipse(x, y, 18, 12, 0, 0, Math.PI * 2);
 ctx.fill();
}

function drawMango(ctx, x, y) {
 drawPlant(ctx, x, y + 10, 1.2, 3);
 ctx.fillStyle = "#f59e0b";
 ctx.beginPath();
 ctx.ellipse(x + 28, y - 10, 14, 10, 0.4, 0, Math.PI * 2);
 ctx.fill();
}

function drawRicePaddy(ctx, x, y) {
 ctx.fillStyle = "rgba(56,189,248,0.35)";
 roundRect(ctx, x - 50, y + 10, 100, 24, 6);
 ctx.fill();
 for (let i = 0; i < 5; i++) {
 ctx.strokeStyle = "#4ade80";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.moveTo(x - 36 + i * 18, y + 18);
 ctx.lineTo(x - 36 + i * 18, y - 18);
 ctx.stroke();
 ctx.fillStyle = "#fef08a";
 ctx.beginPath();
 ctx.ellipse(x - 36 + i * 18, y - 22, 6, 3, -0.3, 0, Math.PI * 2);
 ctx.fill();
 }
}

function drawRose(ctx, x, y) {
 ctx.fillStyle = "#854d0e";
 ctx.fillRect(x - 3, y, 6, 40);
 ctx.fillStyle = "#22c55e";
 ctx.beginPath();
 ctx.ellipse(x - 14, y + 12, 12, 6, -0.4, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#f43f5e";
 for (let i = 0; i < 5; i++) {
 const a = (i / 5) * Math.PI * 2;
 ctx.beginPath();
 ctx.ellipse(x + Math.cos(a) * 8, y - 18 + Math.sin(a) * 8, 8, 5, a, 0, Math.PI * 2);
 ctx.fill();
 }
}

function drawBamboo(ctx, x, y) {
 for (let i = 0; i < 3; i++) {
 ctx.fillStyle = "#65a30d";
 roundRect(ctx, x - 24 + i * 20, y - 40, 10, 70, 3);
 ctx.fill();
 ctx.strokeStyle = "#365314";
 ctx.lineWidth = 1;
 for (let s = 0; s < 4; s++) {
 ctx.beginPath();
 ctx.moveTo(x - 24 + i * 20, y - 30 + s * 16);
 ctx.lineTo(x - 14 + i * 20, y - 30 + s * 16);
 ctx.stroke();
 }
 }
}

function drawAlgae(ctx, x, y) {
 ctx.fillStyle = "rgba(56,189,248,0.3)";
 ctx.beginPath();
 ctx.ellipse(x, y + 10, 48, 28, 0, 0, Math.PI * 2);
 ctx.fill();
 for (let i = 0; i < 6; i++) {
 ctx.fillStyle = "#4ade80";
 ctx.beginPath();
 ctx.ellipse(x - 30 + i * 12, y + (i % 2) * 8, 8, 4, 0.2, 0, Math.PI * 2);
 ctx.fill();
 }
}

function drawCandy(ctx, x, y) {
 ctx.fillStyle = "#f472b6";
 roundRect(ctx, x - 18, y - 10, 36, 20, 6);
 ctx.fill();
 ctx.fillStyle = "#fff";
 ctx.font = "700 10px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("candy", x, y + 3);
}

function drawBee(ctx, x, y) {
 ctx.fillStyle = "#fbbf24";
 ctx.beginPath();
 ctx.ellipse(x, y, 14, 10, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#0f172a";
 ctx.fillRect(x - 4, y - 10, 4, 20);
 ctx.fillRect(x + 2, y - 10, 4, 20);
 ctx.fillStyle = "rgba(255,255,255,0.7)";
 ctx.beginPath();
 ctx.ellipse(x - 12, y - 8, 8, 4, -0.5, 0, Math.PI * 2);
 ctx.fill();
}

function drawSoilBag(ctx, x, y) {
 ctx.fillStyle = "#a16207";
 roundRect(ctx, x - 40, y, 80, 28, 6);
 ctx.fill();
 ctx.fillStyle = "#78350f";
 for (let i = 0; i < 4; i++) {
 ctx.beginPath();
 ctx.arc(x - 24 + i * 16, y + 10, 3, 0, Math.PI * 2);
 ctx.fill();
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

export function registerPlantScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("plantMeet", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts } = api;
 const startPhase = opts.phase || bioLabState.phase || "seed";
 bioLabState.phase = startPhase;
 setDescription("Plant Power - plants make food with light.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const live = bioLabState.phase || startPhase;
 drawBackdrop();
 if (live === "seed" || live === "desk") {
 drawSeedOval(ctx, w * 0.5, h * 0.45);
 drawLabel(ctx, "A seed is a living plant waiting to grow", w * 0.5, layout.labelY);
 } else if (live === "leaf") {
 drawPlant(ctx, w * 0.5, h * 0.42, 1.6, 1);
 ctx.fillStyle = "rgba(251,191,36,0.7)";
 ctx.beginPath();
 ctx.arc(w * 0.78, h * 0.2, 28, 0, Math.PI * 2);
 ctx.fill();
 // Light rays into leaf
 ctx.strokeStyle = "rgba(251,191,36,0.55)";
 ctx.lineWidth = 2;
 for (let i = 0; i < 3; i++) {
 ctx.beginPath();
 ctx.moveTo(w * 0.72, h * 0.24);
 ctx.lineTo(w * 0.55 - i * 8, h * 0.38);
 ctx.stroke();
 }
 drawLabel(ctx, "Leaves catch light - plant food factories", w * 0.5, layout.labelY);
 } else if (live === "flower") {
 drawPlant(ctx, w * 0.5, h * 0.42, 1.6, 2);
 drawBee(ctx, w * 0.68, h * 0.28);
 drawLabel(ctx, "Flowers help make more plants", w * 0.5, layout.labelY);
 } else {
 drawPlant(ctx, w * 0.5, h * 0.42, 1.6, 3);
 drawCandy(ctx, w * 0.78, h * 0.5);
 ctx.strokeStyle = "#f87171";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.moveTo(w * 0.7, h * 0.42);
 ctx.lineTo(w * 0.86, h * 0.58);
 ctx.moveTo(w * 0.86, h * 0.42);
 ctx.lineTo(w * 0.7, h * 0.58);
 ctx.stroke();
 drawLabel(ctx, "Plants make food - they don’t eat candy", w * 0.5, layout.labelY);
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("plantSort", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } =
 api;
 setDescription("Sort plant needs vs extras.");
 const chips = [
 { id: "sun", text: "Sunlight", short: "Sun", color: 0xfbbf24 },
 { id: "water", text: "Water", short: "Water", color: 0x38bdf8 },
 { id: "air", text: "Air (CO₂)", short: "Air", color: 0xa5b4fc },
 { id: "soil", text: "Soil minerals", short: "Soil", color: 0xa16207 },
 { id: "candy", text: "Candy", short: "Candy", color: 0xf472b6 },
 { id: "phone", text: "Phone charger", short: "Charger", color: 0x94a3b8 },
 { id: "bee", text: "Bees (some plants)", short: "Bees", color: 0xf59e0b },
 { id: "toys", text: "Toys", short: "Toys", color: 0x78716c },
 ];
 const accept = {
 need: ["sun", "water", "air"],
 help: ["soil", "bee"],
 no: ["candy", "phone", "toys"],
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
 { id: "need", label: "Must have", x: w * 0.03, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#22c55e" },
 { id: "help", label: "Helps", x: w * 0.35, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#fbbf24" },
 { id: "no", label: "Not plant food", x: w * 0.67, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#94a3b8" },
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
 need: chips.filter((c) => placed[c.id] === "need").map((c) => c.id),
 help: chips.filter((c) => placed[c.id] === "help").map((c) => c.id),
 no: chips.filter((c) => placed[c.id] === "no").map((c) => c.id),
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
 drawLabel(ctx, "Plants don’t eat candy - they make food", w * 0.5, layout.labelY);
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("plantLab", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 setDescription("Drag sun energy - watch the plant grow.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
 const next = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
 bioLabState.heat = next;
 bioLabState.sun = next;
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const sun = bioLabState.heat ?? bioLabState.sun ?? 0.35;
 bioLabState.sun = sun;
 const focus = bioLabState.labFocus || "sun";
 drawBackdrop();
 const stage = sun > 0.75 ? 3 : sun > 0.5 ? 2 : sun > 0.25 ? 1 : 0;
 drawPlant(ctx, w * 0.5, h * 0.4, 1.5, stage);
 ctx.fillStyle = `rgba(251,191,36,${0.25 + sun * 0.6})`;
 ctx.beginPath();
 ctx.arc(w * 0.78, h * 0.18, 22 + sun * 12, 0, Math.PI * 2);
 ctx.fill();

 if (focus === "stages") {
 const labels = ["Seed", "Leaf", "Flower", "Fruit"];
 labels.forEach((lab, i) => {
 const x = w * 0.18 + i * (w * 0.2);
 const on = i <= stage;
 ctx.fillStyle = on ? "rgba(74,222,128,0.4)" : "rgba(30,41,59,0.55)";
 roundRect(ctx, x - 34, h * 0.2, 68, 24, 8);
 ctx.fill();
 ctx.fillStyle = "#dcfce7";
 ctx.font = "600 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(lab, x, h * 0.215);
 });
 drawLabel(ctx, sun > 0.75 ? "Full stages: seed → leaf → flower → fruit" : "Push sun to unlock plant stages", w * 0.5, layout.labelY);
 } else {
 drawLabel(ctx, sun > 0.7 ? "More light → more plant food" : "Drag sun energy for the plant", w * 0.5, layout.labelY);
 }

 const hx = w * 0.2 + sun * w * 0.6;
 ctx.fillStyle = "#fbbf24";
 ctx.beginPath();
 ctx.arc(hx, h * 0.68, 14, 0, Math.PI * 2);
 ctx.fill();
 setHitRegions([{ id: "h", shape: "rect", x: hx, y: h * 0.68, w: 48, h: 48, meta: { action: "stretch" } }]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("plantRule", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Plants make food using light.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const prog = bioLabState.tokenProgress || 0;
 drawBackdrop();
 const tokens = ["Light", "+", "water", "+", "air", "→ food"];
 tokens.forEach((label, i) => {
 const x = w * 0.12 + i * (w * 0.14);
 const on = i < prog;
 ctx.fillStyle = on ? "rgba(74,222,128,0.4)" : "rgba(20,83,45,0.9)";
 roundRect(ctx, x - 40, h * 0.36 - 18, 80, 36, 10);
 ctx.fill();
 ctx.fillStyle = on ? "#dcfce7" : "#86efac";
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(label, x, h * 0.36);
 });
 drawPlant(ctx, w * 0.5, h * 0.58, 1.2, 2);
 drawLabel(ctx, "Plant Power rule", w * 0.5, layout.labelY);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("plantStretch", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const modes = [
 { id: "mango", label: "Mango" },
 { id: "rice", label: "Rice" },
 { id: "rose", label: "Rose" },
 { id: "bamboo", label: "Bamboo" },
 { id: "algae", label: "Algae" },
 ];
 setDescription("Same plant idea in Bangladesh stories.");
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
 const mode = bioLabState.mode || "mango";
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
 if (mode === "mango") drawMango(ctx, w * 0.5, h * 0.36);
 else if (mode === "rice") drawRicePaddy(ctx, w * 0.5, h * 0.36);
 else if (mode === "rose") drawRose(ctx, w * 0.5, h * 0.36);
 else if (mode === "bamboo") drawBamboo(ctx, w * 0.5, h * 0.36);
 else drawAlgae(ctx, w * 0.5, h * 0.36);
 const captions = {
 mango: "Mango tree - leaves catch light for sweet fruit",
 rice: "Rice paddy - plants feed a nation",
 rose: "Rose - flowers need light too",
 bamboo: "Bamboo - fast-growing plant power",
 algae: "Pond algae - tiny plants making food",
 };
 drawLabel(ctx, captions[mode], w * 0.5, layout.labelY);
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("plantMyth", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const myths = [
 { claim: "Plants eat soil for food", truth: "Soil helps with minerals - food is made with light", claimVis: "soil", truthVis: "leaf" },
 { claim: "Plants don’t need air", truth: "Plants use air (CO₂) when they make food", claimVis: "leaf", truthVis: "air" },
 { claim: "Seeds are dead until they sprout", truth: "Seeds can be dormant living plants", claimVis: "seed", truthVis: "sprout" },
 { claim: "Only green leaves matter", truth: "Roots, stems, and flowers are plant parts too", claimVis: "leaf", truthVis: "full" },
 { claim: "Bees make the plant’s food", truth: "Bees help pollinate - leaves still make food", claimVis: "bee", truthVis: "leaf" },
 ];
 setDescription("Bust plant myths.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "flip") {
 bioLabState.mythPhase = bioLabState.mythPhase === "truth" ? "claim" : "truth";
 if (bioLabState.mythPhase === "truth") pulseSuccessFeedback(220);
 }
 });
 function drawMythVis(kind, x, y) {
 if (kind === "soil") drawSoilBag(ctx, x, y);
 else if (kind === "seed") drawSeedOval(ctx, x, y);
 else if (kind === "sprout") drawPlant(ctx, x, y, 1.1, 1);
 else if (kind === "full") drawPlant(ctx, x, y, 1.3, 3);
 else if (kind === "bee") drawBee(ctx, x, y);
 else if (kind === "air") {
 ctx.fillStyle = "rgba(165,180,252,0.5)";
 ctx.beginPath();
 ctx.arc(x - 16, y, 14, 0, Math.PI * 2);
 ctx.arc(x + 10, y - 8, 18, 0, Math.PI * 2);
 ctx.fill();
 drawLabel(ctx, "CO₂", x, y + 28, { h: 18, font: "700 11px Segoe UI" });
 } else drawPlant(ctx, x, y, 1.2, 1);
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

 arena.registerScene("plantDrill", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription(bioLabState.prompt || "Plant drill");
 function drillVis(prompt) {
 const p = (prompt || "").toLowerCase();
 if (p.includes("candy")) return "candy";
 if (p.includes("soil")) return "soil";
 if (p.includes("seed")) return "seed";
 if (p.includes("rice")) return "rice";
 if (p.includes("bee")) return "bee";
 if (p.includes("sun")) return "sun";
 return "plant";
 }
 setTick(() => {
 const w = api.width;
 const h = api.height;
 drawBackdrop();
 drawLabel(ctx, bioLabState.prompt || "Plant Power drill", w * 0.5, h * 0.18, { h: 32, font: "700 16px Segoe UI" });
 const kind = drillVis(bioLabState.prompt);
 if (kind === "candy") drawCandy(ctx, w * 0.5, h * 0.48);
 else if (kind === "soil") drawSoilBag(ctx, w * 0.5, h * 0.48);
 else if (kind === "seed") drawSeedOval(ctx, w * 0.5, h * 0.48);
 else if (kind === "rice") drawRicePaddy(ctx, w * 0.5, h * 0.48);
 else if (kind === "bee") drawBee(ctx, w * 0.5, h * 0.48);
 else if (kind === "sun") {
 ctx.fillStyle = "#fbbf24";
 ctx.beginPath();
 ctx.arc(w * 0.5, h * 0.42, 28, 0, Math.PI * 2);
 ctx.fill();
 drawPlant(ctx, w * 0.5, h * 0.58, 1.1, 1);
 } else drawPlant(ctx, w * 0.5, h * 0.5, 1.4, 2);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("plantMastery", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Plant Explorer mastery.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const locked = bioLabState.masteryStep || 0;
 drawBackdrop();
 ["Meet", "Sort", "Lab", "Rule", "Myth", "Explorer"].forEach((label, i) => {
 const x = w * 0.1 + i * (w * 0.14);
 ctx.fillStyle = i < locked ? "#22c55e" : "rgba(148,163,184,0.35)";
 roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8);
 ctx.fill();
 ctx.fillStyle = "#052e16";
 ctx.font = "600 10px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(label, x, h * 0.78);
 });
 drawMango(ctx, w * 0.28, h * 0.36);
 drawRicePaddy(ctx, w * 0.55, h * 0.38);
 drawAlgae(ctx, w * 0.8, h * 0.38);
 drawLabel(ctx, "Plant Explorer!", w * 0.5, layout.labelY);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });
}
