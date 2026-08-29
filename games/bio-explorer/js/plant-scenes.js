/**
 * Bio Explorer Mission 3: Plant Power
 * Script: Opening + 4 Bruner spirals (plant body → kitchen → plumbing → next generation) + recap.
 * Canvas 2D. No physics engine. Rect hits are center-origin.
 */
import {
 bioLabState,
 pulseFailFeedback,
 pulseSuccessFeedback,
 PLANT_ORGANS,
 PLANT_KITCHEN_IN,
 PLANT_KITCHEN_OUT,
 PLANT_WATER_HOPS,
 PLANT_SUGAR_HOPS,
 PLANT_SEEDS,
} from "./bio-state.js?v=cellplant2";

function roundRect(ctx, x, y, w, h, r) {
 const rr = Math.max(0, Math.min(r, w / 2, h / 2));
 if (typeof ctx.roundRect === "function") {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, rr);
  return;
 }
 ctx.beginPath();
 ctx.moveTo(x + rr, y);
 ctx.arcTo(x + w, y, x + w, y + h, rr);
 ctx.arcTo(x + w, y + h, x, y + h, rr);
 ctx.arcTo(x, y + h, x, y, rr);
 ctx.arcTo(x, y, x + w, y, rr);
 ctx.closePath();
}

function drawLabel(ctx, text, x, y, opts = {}) {
 ctx.font = opts.font || "600 12px Segoe UI, system-ui, sans-serif";
 const tw = ctx.measureText(text).width;
 const bw = Math.min(opts.maxW || 9999, tw + 22);
 const bh = opts.h || 26;
 ctx.fillStyle = opts.bg || "rgba(15,23,42,0.9)";
 roundRect(ctx, x - bw / 2, y - bh / 2, bw, bh, 10);
 ctx.fill();
 ctx.strokeStyle = opts.border || "rgba(134,239,172,0.5)";
 ctx.lineWidth = 1.3;
 ctx.stroke();
 ctx.fillStyle = opts.color || "#dcfce7";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(text, x, y + 1);
}

function drawCanvasBtn(ctx, x, y, w, h, label, lit) {
 roundRect(ctx, x - w / 2, y - h / 2, w, h, 12);
 ctx.fillStyle = lit ? "#16a34a" : "#14532d";
 ctx.fill();
 ctx.strokeStyle = "rgba(187,247,208,0.75)";
 ctx.lineWidth = 1.6;
 ctx.stroke();
 ctx.fillStyle = "#ecfdf5";
 ctx.font = "800 12px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(label, x, y + 1);
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

function fillLab(ctx, w, h) {
 const g = ctx.createLinearGradient(0, 0, 0, h);
 g.addColorStop(0, "#14532d");
 g.addColorStop(0.55, "#052e16");
 g.addColorStop(1, "#022c22");
 ctx.fillStyle = g;
 ctx.fillRect(0, 0, w, h);
}

function fillSky(ctx, w, h) {
 const g = ctx.createLinearGradient(0, 0, 0, h);
 g.addColorStop(0, "#7dd3fc");
 g.addColorStop(0.5, "#bae6fd");
 g.addColorStop(1, "#86efac");
 ctx.fillStyle = g;
 ctx.fillRect(0, 0, w, h);
}

function drawChloro(ctx, x, y, s = 1) {
 ctx.save();
 ctx.translate(x, y);
 ctx.scale(s, s);
 ctx.rotate(0.25);
 const g = ctx.createLinearGradient(-16, 0, 16, 0);
 g.addColorStop(0, "#bbf7d0");
 g.addColorStop(0.45, "#22c55e");
 g.addColorStop(1, "#14532d");
 ctx.fillStyle = g;
 ctx.beginPath();
 ctx.ellipse(0, 0, 16, 9, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "rgba(20,83,45,0.5)";
 ctx.stroke();
 // thylakoid stacks (real chloroplast look)
 ctx.fillStyle = "#166534";
 for (let i = -2; i <= 2; i++) {
 ctx.beginPath();
 ctx.ellipse(i * 3.2, 0, 2.8, 5.5, 0, 0, Math.PI * 2);
 ctx.fill();
 }
 ctx.restore();
}

function drawBee(ctx, x, y) {
 ctx.fillStyle = "#facc15";
 ctx.beginPath();
 ctx.ellipse(x, y, 11, 7, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#0f172a";
 ctx.fillRect(x - 3, y - 7, 3, 14);
 ctx.fillRect(x + 2, y - 7, 3, 14);
 ctx.fillStyle = "rgba(255,255,255,0.75)";
 ctx.beginPath();
 ctx.ellipse(x - 5, y - 9, 7, 4, -0.45, 0, Math.PI * 2);
 ctx.fill();
}

function organZones(w, h) {
 const cx = w * 0.5;
 return {
 flower: { x: cx, y: h * 0.16, r: 30 },
 leaves: { x: cx, y: h * 0.36, r: 38 },
 stem: { x: cx, y: h * 0.54, r: 26 },
 roots: { x: cx, y: h * 0.78, r: 40 },
 };
}

function drawFlowerHead(ctx, x, y, open) {
 const spread = open ? 1 : 0.55;
 // petals with gradient
 for (let i = 0; i < 6; i++) {
 const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
 const px = x + Math.cos(a) * 12 * spread;
 const py = y + Math.sin(a) * 12 * spread;
 const g = ctx.createRadialGradient(px, py, 1, px, py, 10);
 g.addColorStop(0, "#fbcfe8");
 g.addColorStop(0.55, "#f472b6");
 g.addColorStop(1, "#be185d");
 ctx.fillStyle = g;
 ctx.beginPath();
 ctx.ellipse(px, py, 9, 5.5, a, 0, Math.PI * 2);
 ctx.fill();
 }
 // center / stigma
 const cg = ctx.createRadialGradient(x - 2, y - 2, 1, x, y, 8);
 cg.addColorStop(0, "#fef08a");
 cg.addColorStop(1, "#ca8a04");
 ctx.fillStyle = cg;
 ctx.beginPath();
 ctx.arc(x, y, 7, 0, Math.PI * 2);
 ctx.fill();
 if (open) {
 ctx.strokeStyle = "#854d0e";
 ctx.lineWidth = 1.2;
 for (let i = 0; i < 5; i++) {
 const a = (i / 5) * Math.PI * 2;
 ctx.beginPath();
 ctx.moveTo(x, y);
 ctx.lineTo(x + Math.cos(a) * 5, y + Math.sin(a) * 5);
 ctx.stroke();
 }
 }
}

function drawPlantBody(ctx, w, h, opts = {}) {
 const z = organZones(w, h);
 const parts = opts.parts || bioLabState.plantParts || {};
 const showAll = !!opts.showAll;
 const show = (id) => showAll || !!parts[id];
 const lit = opts.lit || null;
 const t = opts.t || 0;
 const cutaway = !!opts.cutaway;
 const ghost = opts.ghost || null;
 const grow = opts.grow != null ? opts.grow : 1;
 const water = opts.water || 0;
 const wind = opts.wind || 0;
 const skipBg = !!opts.skipBg;

 // sky + soil (unless nested in another scene)
 if (!skipBg) {
 const sky = ctx.createLinearGradient(0, 0, 0, h * 0.7);
 sky.addColorStop(0, "#7dd3fc");
 sky.addColorStop(1, "#86efac");
 ctx.fillStyle = sky;
 ctx.fillRect(0, 0, w, h * 0.72);
 ctx.fillStyle = "#fde047";
 ctx.beginPath();
 ctx.arc(w * 0.82, h * 0.14, 20, 0, Math.PI * 2);
 ctx.fill();
 if (wind) {
 ctx.strokeStyle = "rgba(255,255,255,0.35)";
 for (let i = 0; i < 5; i++) {
 const y = h * 0.22 + i * 16;
 const x0 = ((t * 50 + i * 40) % (w + 60)) - 30;
 ctx.beginPath();
 ctx.moveTo(x0, y);
 ctx.quadraticCurveTo(x0 + 24, y - 3, x0 + 48, y);
 ctx.stroke();
 }
 }
 const soil = ctx.createLinearGradient(0, h * 0.7, 0, h);
 soil.addColorStop(0, "#a16207");
 soil.addColorStop(1, "#451a03");
 ctx.fillStyle = soil;
 ctx.fillRect(0, h * 0.7, w, h * 0.3);
 ctx.fillStyle = "#4d7c0f";
 ctx.fillRect(0, h * 0.7 - 4, w, 6);
 }

 const sway = Math.sin(t * 2.2) * wind * 4;

 if (show("roots")) {
 ctx.strokeStyle = ghost === "roots" ? "#38bdf8" : "#92400e";
 ctx.lineWidth = ghost === "roots" ? 5 : 3.5;
 ctx.lineCap = "round";
 const rootN = 5;
 for (let i = 0; i < rootN; i++) {
 const side = i - 2;
 ctx.beginPath();
 ctx.moveTo(z.roots.x, h * 0.7);
 ctx.quadraticCurveTo(
 z.roots.x + side * 18 + Math.sin(t + i) * 2,
 z.roots.y - 4,
 z.roots.x + side * 28,
 z.roots.y + 14 + Math.abs(side) * 4,
 );
 ctx.stroke();
 }
 // root hairs
 if (opts.hair || lit === "roots") {
 ctx.strokeStyle = "#fde68a";
 ctx.lineWidth = 1.3;
 for (let i = 0; i < 8; i++) {
 ctx.beginPath();
 ctx.moveTo(z.roots.x - 30 + i * 8, z.roots.y + 6);
 ctx.lineTo(z.roots.x - 34 + i * 8, z.roots.y + 18);
 ctx.stroke();
 }
 }
 drawLabel(ctx, "Roots", z.roots.x - 50, z.roots.y, { h: 20, font: "700 11px Segoe UI" });
 }

 if (show("stem")) {
 const stemTop = z.leaves.y + 8;
 const stemBot = h * 0.7;
 const stemH = (stemBot - stemTop) * grow;
 const sg = ctx.createLinearGradient(z.stem.x - 10, 0, z.stem.x + 10, 0);
 sg.addColorStop(0, "#3f6212");
 sg.addColorStop(0.5, "#65a30d");
 sg.addColorStop(1, "#365314");
 ctx.fillStyle = sg;
 roundRect(ctx, z.stem.x - 8 + sway * 0.15, stemBot - stemH, 16, stemH, 6);
 ctx.fill();
 // bark marks
 ctx.strokeStyle = "rgba(20,83,45,0.4)";
 for (let i = 0; i < 4; i++) {
 ctx.beginPath();
 ctx.moveTo(z.stem.x - 4, stemBot - stemH * (0.2 + i * 0.2));
 ctx.lineTo(z.stem.x + 4, stemBot - stemH * (0.25 + i * 0.2));
 ctx.stroke();
 }
 if (cutaway) {
 ctx.fillStyle = "#38bdf8";
 roundRect(ctx, z.stem.x - 6, stemBot - stemH + 8, 5, stemH - 16, 2);
 ctx.fill();
 ctx.fillStyle = "#4ade80";
 roundRect(ctx, z.stem.x + 1, stemBot - stemH + 8, 5, stemH - 16, 2);
 ctx.fill();
 drawLabel(ctx, "Xylem up", z.stem.x - 40, z.stem.y - 10, { h: 18, font: "600 9px Segoe UI" });
 drawLabel(ctx, "Phloem down", z.stem.x + 48, z.stem.y + 10, { h: 18, font: "600 9px Segoe UI" });
 }
 drawLabel(ctx, "Stem", z.stem.x + 42, z.stem.y, { h: 20, font: "700 11px Segoe UI" });
 // water rising animation
 if (water > 0.1) {
 ctx.fillStyle = "rgba(56,189,248,0.75)";
 for (let i = 0; i < 4; i++) {
 const uy = stemBot - ((t * 40 + i * 28) % stemH);
 ctx.beginPath();
 ctx.arc(z.stem.x - 2, uy, 2.5, 0, Math.PI * 2);
 ctx.fill();
 }
 }
 }

 if (show("leaves")) {
 const tilt = -0.35 + Math.sin(t * 2) * wind * 0.12;
 const leafG = (ox, oy, rot, sc = 1) => {
 ctx.save();
 ctx.translate(ox + sway, oy);
 ctx.rotate(rot);
 const g = ctx.createRadialGradient(-6, -2, 2, 0, 0, 30 * sc);
 g.addColorStop(0, "#86efac");
 g.addColorStop(0.55, "#22c55e");
 g.addColorStop(1, "#166534");
 ctx.fillStyle = g;
 ctx.beginPath();
 ctx.ellipse(0, 0, 32 * grow * sc, 14 * grow * sc, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "#14532d";
 ctx.lineWidth = 1.2;
 ctx.beginPath();
 ctx.moveTo(-24 * sc, 4);
 ctx.quadraticCurveTo(0, 0, 26 * sc, -4);
 ctx.stroke();
 // side veins
 ctx.lineWidth = 0.8;
 for (let v = -2; v <= 2; v++) {
 if (!v) continue;
 ctx.beginPath();
 ctx.moveTo(-4, 0);
 ctx.quadraticCurveTo(v * 6, v * 4, v * 12, v * 7);
 ctx.stroke();
 }
 ctx.restore();
 };
 leafG(z.leaves.x - 34, z.leaves.y + 4, tilt);
 leafG(z.leaves.x + 34, z.leaves.y - 2, -tilt);
 if (grow > 0.55) leafG(z.leaves.x, z.leaves.y - 16, 0.1);
 if (grow > 0.8) {
 leafG(z.leaves.x - 50, z.leaves.y + 18, 0.4, 0.75);
 leafG(z.leaves.x + 50, z.leaves.y + 14, -0.4, 0.75);
 }
 drawLabel(ctx, "Leaves", z.leaves.x - 58, z.leaves.y - 8, { h: 20, font: "700 11px Segoe UI" });
 }

 if (show("flower") && grow > 0.55) {
 ctx.save();
 ctx.translate(sway * 0.6, 0);
 drawFlowerHead(ctx, z.flower.x, z.flower.y, lit === "flower" || showAll || grow > 0.85);
 ctx.restore();
 drawLabel(ctx, "Flower", z.flower.x + 48, z.flower.y, { h: 20, font: "700 11px Segoe UI" });
 }

 if (lit && z[lit]) {
 ctx.strokeStyle = "#facc15";
 ctx.lineWidth = 2.5;
 ctx.beginPath();
 ctx.arc(z[lit].x, z[lit].y, z[lit].r + 6, 0, Math.PI * 2);
 ctx.stroke();
 const tips = {
 roots: "Roots: absorb water + minerals, anchor plant",
 stem: "Stem: support + transport (xylem / phloem)",
 leaves: "Leaves: catch light, run photosynthesis",
 flower: "Flower: make seeds for the next generation",
 };
 if (tips[lit]) drawLabel(ctx, tips[lit], w * 0.5, 22, { h: 24, maxW: w * 0.92 });
 }
 return z;
}

function drawWindowsillPlant(ctx, w, h, t) {
 fillSky(ctx, w, h);
 // window frame
 ctx.fillStyle = "rgba(255,255,255,0.4)";
 ctx.fillRect(w * 0.08, h * 0.08, w * 0.84, h * 0.55);
 ctx.strokeStyle = "#e2e8f0";
 ctx.lineWidth = 6;
 ctx.strokeRect(w * 0.08, h * 0.08, w * 0.84, h * 0.55);
 ctx.beginPath();
 ctx.moveTo(w * 0.5, h * 0.08);
 ctx.lineTo(w * 0.5, h * 0.63);
 ctx.moveTo(w * 0.08, h * 0.35);
 ctx.lineTo(w * 0.92, h * 0.35);
 ctx.stroke();
 // sun + rays
 ctx.fillStyle = "#fde047";
 ctx.beginPath();
 ctx.arc(w * 0.78, h * 0.2, 22, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "rgba(253,224,71,0.45)";
 for (let i = 0; i < 8; i++) {
 const a = (i / 8) * Math.PI * 2 + t * 0.2;
 ctx.beginPath();
 ctx.moveTo(w * 0.78 + Math.cos(a) * 26, h * 0.2 + Math.sin(a) * 26);
 ctx.lineTo(w * 0.78 + Math.cos(a) * 38, h * 0.2 + Math.sin(a) * 38);
 ctx.stroke();
 }
 // sill + pot
 ctx.fillStyle = "#78350f";
 ctx.fillRect(0, h * 0.72, w, h * 0.28);
 ctx.fillStyle = "#b45309";
 roundRect(ctx, w * 0.36, h * 0.6, w * 0.28, h * 0.18, 6);
 ctx.fill();
 ctx.fillStyle = "#854d0e";
 ctx.fillRect(w * 0.38, h * 0.6, w * 0.24, 8);
 const u = Math.min(1.15, t / 3.2);
 // water drops watering
 if (u < 1) {
 ctx.fillStyle = "rgba(56,189,248,0.85)";
 for (let i = 0; i < 3; i++) {
 const dropY = h * 0.18 + ((t * 55 + i * 40) % (h * 0.42));
 ctx.beginPath();
 ctx.ellipse(w * 0.32 + i * 8, dropY, 4, 7, 0, 0, Math.PI * 2);
 ctx.fill();
 }
 }
 drawPlantBody(ctx, w, h, {
 showAll: true,
 grow: Math.max(0.25, u),
 water: u > 0.15 ? 1 : 0,
 wind: u > 0.35 ? 0.8 : 0,
 t,
 skipBg: true,
 });
 drawLabel(
 ctx,
 u < 0.35 ? "Water the plant - watch roots drink" : u < 0.75 ? "Stem and leaves grow in air + sun" : "Flower opens - plant life cycle ready",
 w * 0.5,
 22,
 { h: 24 },
 );
}

function placePart(id, zone) {
 const item = PLANT_ORGANS.find((o) => o.id === id);
 if (!item) return;
 if (item.drop !== zone) {
 pulseFailFeedback(240);
 bioLabState.prompt = "That part belongs somewhere else on the silhouette.";
 return;
 }
 bioLabState.prompt = item.snap;
 bioLabState.plantParts = { ...bioLabState.plantParts, [id]: true };
 bioLabState.plantPartPick = null;
 pulseSuccessFeedback(200);
 if (PLANT_ORGANS.every((o) => bioLabState.plantParts[o.id])) {
 bioLabState.plantBuildDone = true;
 pulseSuccessFeedback(280);
 }
}

function kitchenList() {
 return bioLabState.plantKitchenPhase === "out" ? PLANT_KITCHEN_OUT : PLANT_KITCHEN_IN;
}

function placeKitchen(id, zone) {
 const item = kitchenList().find((p) => p.id === id);
 if (!item) return;
 if (item.drop !== zone) {
 pulseFailFeedback(260);
 bioLabState.prompt = "That ingredient belongs in a different chute.";
 return;
 }
 bioLabState.prompt = item.line;
 bioLabState.plantKitchen = { ...bioLabState.plantKitchen, [id]: true };
 bioLabState.plantKitchenPick = null;
 pulseSuccessFeedback(200);
 const ins = PLANT_KITCHEN_IN.every((p) => bioLabState.plantKitchen[p.id]);
 if (bioLabState.plantKitchenPhase !== "out" && ins) {
 bioLabState.plantKitchenPhase = "out";
 }
 if (ins && PLANT_KITCHEN_OUT.every((p) => bioLabState.plantKitchen[p.id])) {
 bioLabState.plantKitchenDone = true;
 pulseSuccessFeedback(320);
 }
}

function sendTrace(toId) {
 const water = bioLabState.plantTracePhase !== "sugar";
 const hops = water ? PLANT_WATER_HOPS : PLANT_SUGAR_HOPS;
 const stepI = water ? bioLabState.plantWaterStep || 0 : bioLabState.plantSugarStep || 0;
 const step = hops[stepI];
 if (!step || bioLabState.plantTraceDone) return;
 if (toId !== step.id) {
 pulseFailFeedback(240);
 bioLabState.prompt = "That stop isn't next on this route.";
 return;
 }
 if (water) bioLabState.plantWaterStep = stepI + 1;
 else bioLabState.plantSugarStep = stepI + 1;
 bioLabState.prompt = step.caption;
 pulseSuccessFeedback(200);
 if (water && bioLabState.plantWaterStep >= hops.length) bioLabState.plantTracePhase = "sugar";
 if (!water && bioLabState.plantSugarStep >= hops.length) {
 bioLabState.plantTraceDone = true;
 pulseSuccessFeedback(300);
 }
}

function pollinate(target) {
 if (bioLabState.plantBloomPhase !== "pollinate") return;
 if (target === "stamen" && bioLabState.plantBee === "idle") {
 bioLabState.plantBee = "pollen";
 bioLabState.prompt = "The bee picked up glowing pollen grains.";
 pulseSuccessFeedback(200);
 return;
 }
 if (target === "pistil" && bioLabState.plantBee === "pollen") {
 bioLabState.plantBee = "pollinated";
 bioLabState.prompt = "Pollen moved from one flower's stamen to another flower's pistil. That's pollination.";
 pulseSuccessFeedback(280);
 return;
 }
 pulseFailFeedback(240);
 bioLabState.prompt = "Not yet. Pollen first, then the sticky landing pad.";
}

function sendSeed(method) {
 if (bioLabState.plantBloomPhase !== "seed" || bioLabState.plantBloomDone) return;
 const seed = PLANT_SEEDS[bioLabState.plantSeedI || 0];
 if (!seed) return;
 if (method !== seed.method) {
 pulseFailFeedback(240);
 bioLabState.prompt = "That travel method doesn't match this seed.";
 return;
 }
 bioLabState.plantSeedOk = { ...bioLabState.plantSeedOk, [seed.id]: true };
 bioLabState.plantSeedI = (bioLabState.plantSeedI || 0) + 1;
 bioLabState.prompt = `${seed.name} travels by ${seed.method}.`;
 pulseSuccessFeedback(220);
 if (bioLabState.plantSeedI >= PLANT_SEEDS.length) {
 bioLabState.plantBloomDone = true;
 pulseSuccessFeedback(300);
 }
}

export function registerPlantScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("plantOpen", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const start = performance.now();
 setDescription("A windowsill plant. Quiet, and busy.");
 setIntentHandler((intent) => {
 if (intent.type !== "CANVAS_TAP") return;
 if (intent.meta?.action === "meet") {
 bioLabState.plantSeen = true;
 pulseSuccessFeedback(200);
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 bioLabState.plantOpenU = Math.min(1, t / 2.4);
 drawWindowsillPlant(ctx, w, h, t);
 drawLabel(
 ctx,
 bioLabState.plantOpenU < 0.4
 ? "A plant that never eats a meal, and never leaves the sill."
 : "We've met a plant cell. Today: the whole machine.",
 w * 0.5,
 26,
 { font: "600 12px Segoe UI, sans-serif", h: 28, maxW: w * 0.92 },
 );
 const ready = bioLabState.plantOpenU >= 0.4 || bioLabState.plantSeen;
 drawCanvasBtn(ctx, w * 0.5, h - 36, 210, 40, "Meet the Plant", ready);
 setHitRegions([{ id: "meet", shape: "rect", x: w * 0.5, y: h - 36, w: 220, h: 44, meta: { action: "meet" } }]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("plantBuild", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 setDescription("Build a plant. Four parts, four places.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.part) bioLabState.plantPartPick = intent.meta.part;
 if (intent.type === "CANVAS_TAP" && intent.meta?.drop && bioLabState.plantPartPick) {
 placePart(bioLabState.plantPartPick, intent.meta.drop);
 }
 if (intent.type === "CANVAS_UP" && intent.meta?.part && intent.dropMeta?.drop) {
 placePart(intent.meta.part, intent.dropMeta.drop);
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 fillLab(ctx, w, h);
 // Soft ghost silhouette so students see where each organ goes
 const z = drawPlantBody(ctx, w, h, {
 t: performance.now() / 1000,
 lit: bioLabState.plantPartPick,
 ghost: bioLabState.plantPartPick,
 water: bioLabState.plantBuildDone ? 1 : 0,
 wind: bioLabState.plantBuildDone ? 0.5 : 0,
 });
 // Draw faint outlines for unplaced parts
 ["roots", "stem", "leaves", "flower"].forEach((id) => {
 if (bioLabState.plantParts[id]) return;
 const zz = z[id];
 ctx.strokeStyle = "rgba(134,239,172,0.45)";
 ctx.lineWidth = 2;
 ctx.setLineDash([5, 4]);
 ctx.beginPath();
 ctx.arc(zz.x, zz.y, zz.r, 0, Math.PI * 2);
 ctx.stroke();
 ctx.setLineDash([]);
 drawLabel(ctx, id[0].toUpperCase() + id.slice(1), zz.x + (id === "stem" || id === "flower" ? 48 : -48), zz.y, {
 h: 18,
 font: "600 10px Segoe UI",
 });
 });
 const msg = bioLabState.plantBuildDone
 ? "You just built a complete plant: roots, stem, leaves, and flower."
 : bioLabState.prompt || "Tap a part, then its place on the silhouette.";
 drawLabel(ctx, msg, w * 0.5, 22, { font: "600 11px Segoe UI, sans-serif", h: 28, maxW: w * 0.94 });
 const hits = PLANT_ORGANS.map((o) => ({
 id: `drop-${o.id}`,
 shape: "ellipse",
 x: z[o.id].x,
 y: z[o.id].y,
 r: z[o.id].r,
 meta: { drop: o.id },
 }));
 const unused = PLANT_ORGANS.filter((o) => !bioLabState.plantParts[o.id]);
 unused.forEach((o, i) => {
 const x = w * (0.16 + i * 0.23);
 const y = h - 34;
 const sel = bioLabState.plantPartPick === o.id;
 drawCanvasBtn(ctx, x, y, 92, 30, o.name, sel);
 hits.push({ id: `part-${o.id}`, shape: "rect", x, y, w: 96, h: 34, meta: { part: o.id } });
 });
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("plantOrgans", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 const start = performance.now();
 setDescription("Four parts, four jobs. Then the formal names.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 const phase = bioLabState.phase || "jobs";
 fillLab(ctx, w, h);
 if (phase === "card") {
 ctx.fillStyle = "#86efac";
 ctx.font = "800 16px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("Four plant organs", w * 0.5, 32);
 PLANT_ORGANS.forEach((o, i) => {
 drawLabel(ctx, `${o.name}: ${o.def}`, w * 0.5, 78 + i * 40, {
 font: "600 11px Segoe UI, sans-serif",
 h: 32,
 maxW: w * 0.94,
 });
 });
 } else {
 const lit = PLANT_ORGANS[Math.floor(t / 1.8) % 4].id;
 drawPlantBody(ctx, w, h, { showAll: true, lit, t, cutaway: lit === "stem", hair: lit === "roots" });
 const o = PLANT_ORGANS.find((p) => p.id === lit);
 drawLabel(ctx, `${o.name}: ${o.job}`, w * 0.5, 24, { h: 26, maxW: w * 0.94 });
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("plantKitchen", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 setDescription("Stock the kitchen. Three in, two out.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.ing) bioLabState.plantKitchenPick = intent.meta.ing;
 if (intent.type === "CANVAS_TAP" && intent.meta?.drop && bioLabState.plantKitchenPick) {
 placeKitchen(bioLabState.plantKitchenPick, intent.meta.drop);
 }
 if (intent.type === "CANVAS_UP" && intent.meta?.ing && intent.dropMeta?.drop) {
 placeKitchen(intent.meta.ing, intent.dropMeta.drop);
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 fillLab(ctx, w, h);
 const cx = w * 0.5;
 const cy = h * 0.46;
 // Realistic leaf kitchen
 const leafG = ctx.createRadialGradient(cx - 30, cy - 20, 10, cx, cy, 160);
 leafG.addColorStop(0, "#86efac");
 leafG.addColorStop(0.5, "#22c55e");
 leafG.addColorStop(1, "#14532d");
 ctx.fillStyle = leafG;
 ctx.beginPath();
 ctx.ellipse(cx, cy, Math.min(w * 0.36, 155), Math.min(h * 0.3, 95), -0.25, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "#052e16";
 ctx.lineWidth = 4;
 ctx.beginPath();
 ctx.moveTo(cx - 120, cy + 30);
 ctx.quadraticCurveTo(cx, cy, cx + 120, cy - 20);
 ctx.stroke();
 ctx.fillStyle = "#365314";
 ctx.fillRect(cx - 8, cy + 70, 16, 40);
 const chloro = { x: cx + 10, y: cy - 10 };
 const vein = { x: cx - 70, y: cy + 36 };
 const stomata = { x: cx, y: cy + 58 };
 const stemOut = { x: cx, y: cy + 92 };
 drawChloro(ctx, chloro.x - 18, chloro.y, 1);
 drawChloro(ctx, chloro.x + 8, chloro.y + 14, 0.9);
 drawChloro(ctx, chloro.x + 22, chloro.y - 12, 0.8);
 drawLabel(ctx, "Chloroplasts", chloro.x + 8, chloro.y - 28, { h: 18, font: "600 10px Segoe UI" });
 drawLabel(ctx, "Vein (water)", vein.x, vein.y + 22, { h: 18, font: "600 10px Segoe UI" });
 drawLabel(ctx, "Stomata", stomata.x, stomata.y + 22, { h: 18, font: "600 10px Segoe UI" });
 ctx.fillStyle = "#38bdf8";
 ctx.beginPath();
 ctx.arc(stomata.x - 18, stomata.y, 5, 0, Math.PI * 2);
 ctx.arc(stomata.x + 18, stomata.y, 5, 0, Math.PI * 2);
 ctx.fill();
 // placed ingredient markers
 const kit = bioLabState.plantKitchen || {};
 if (kit.sun) {
 ctx.fillStyle = "#fde047";
 ctx.beginPath();
 ctx.arc(chloro.x + 40, chloro.y - 30, 10, 0, Math.PI * 2);
 ctx.fill();
 }
 if (kit.water) {
 ctx.fillStyle = "#38bdf8";
 ctx.beginPath();
 ctx.ellipse(vein.x, vein.y - 12, 6, 9, 0, 0, Math.PI * 2);
 ctx.fill();
 }
 if (kit.co2) {
 ctx.fillStyle = "#7dd3fc";
 ctx.font = "700 10px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("CO₂", stomata.x - 40, stomata.y);
 }
 if (kit.glucose) {
 ctx.fillStyle = "#facc15";
 ctx.font = "700 10px Segoe UI";
 ctx.fillText("sugar ↓", stemOut.x + 40, stemOut.y);
 }
 if (kit.oxygen) {
 ctx.fillStyle = "#67e8f9";
 ctx.font = "700 10px Segoe UI";
 ctx.fillText("O₂ ↑", stomata.x + 48, stomata.y - 14);
 }
 const out = bioLabState.plantKitchenPhase === "out";
 const msg = bioLabState.plantKitchenDone
 ? "Complete photosynthesis: 3 ingredients in, 2 products out."
 : bioLabState.prompt || (out ? "Drag sugar and oxygen to their pipes." : "Stock the three input chutes.");
 drawLabel(ctx, msg, w * 0.5, 22, { font: "600 11px Segoe UI, sans-serif", h: 28, maxW: w * 0.94 });
 const hits = out
 ? [
 { id: "stemOut", shape: "ellipse", x: stemOut.x, y: stemOut.y, r: 28, meta: { drop: "stemOut" } },
 { id: "stomataOut", shape: "ellipse", x: stomata.x, y: stomata.y, r: 28, meta: { drop: "stomataOut" } },
 ]
 : [
 { id: "chloro", shape: "ellipse", x: chloro.x, y: chloro.y, r: 36, meta: { drop: "chloro" } },
 { id: "vein", shape: "ellipse", x: vein.x, y: vein.y, r: 28, meta: { drop: "vein" } },
 { id: "stomata", shape: "ellipse", x: stomata.x, y: stomata.y, r: 26, meta: { drop: "stomata" } },
 ];
 const bank = kitchenList().filter((p) => !bioLabState.plantKitchen[p.id]);
 bank.forEach((p, i) => {
 const x = w * (0.22 + i * 0.28);
 const y = h - 36;
 const sel = bioLabState.plantKitchenPick === p.id;
 drawCanvasBtn(ctx, x, y, 150, 32, p.name, sel);
 hits.push({ id: `ing-${p.id}`, shape: "rect", x, y, w: 154, h: 34, meta: { ing: p.id } });
 });
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("plantPhoto", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const start = performance.now();
 setDescription("Leaf factory: toggle sunlight, water, CO2 - then separate oxygen and glucose.");
 setIntentHandler((intent) => {
 if (intent.type !== "CANVAS_TAP") return;
 const a = intent.meta?.action;
 if (a === "sun") {
 bioLabState.plantPhotoSun = !bioLabState.plantPhotoSun;
 pulseSuccessFeedback(140);
 bioLabState.prompt = bioLabState.plantPhotoSun
 ? "Sunlight on - chloroplasts are capturing light energy."
 : "Sunlight off - the factory pauses.";
 }
 if (a === "water") {
 bioLabState.plantPhotoWater = !bioLabState.plantPhotoWater;
 pulseSuccessFeedback(140);
 bioLabState.prompt = bioLabState.plantPhotoWater
 ? "Water arriving through the leaf vein from the roots."
 : "Water supply paused.";
 }
 if (a === "co2") {
 bioLabState.plantPhotoCo2 = !bioLabState.plantPhotoCo2;
 pulseSuccessFeedback(140);
 bioLabState.prompt = bioLabState.plantPhotoCo2
 ? "CO2 entering through stomata (tiny pores)."
 : "Stomata closed - less CO2 in.";
 }
 if (a === "sepGlucose") {
 const ready =
 bioLabState.plantPhotoSun && bioLabState.plantPhotoWater && bioLabState.plantPhotoCo2;
 if (!ready) {
 pulseFailFeedback(220);
 bioLabState.prompt = "Turn on sunlight, water, and CO2 first - then products form.";
 return;
 }
 bioLabState.plantPhotoGlucoseSep = true;
 pulseSuccessFeedback(200);
 bioLabState.prompt = "Glucose separated: sugar travels down the vein into the stem.";
 }
 if (a === "sepOxygen") {
 const ready =
 bioLabState.plantPhotoSun && bioLabState.plantPhotoWater && bioLabState.plantPhotoCo2;
 if (!ready) {
 pulseFailFeedback(220);
 bioLabState.prompt = "Turn on sunlight, water, and CO2 first - then products form.";
 return;
 }
 bioLabState.plantPhotoOxygenSep = true;
 pulseSuccessFeedback(200);
 bioLabState.prompt = "Oxygen separated: O2 exits through stomata into the air.";
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 const phase = bioLabState.phase || "leaf";
 fillLab(ctx, w, h);
 if (phase === "eq") {
 drawLabel(ctx, "Carbon dioxide + Water + Light energy", w * 0.5, h * 0.28, { h: 28, maxW: w * 0.94 });
 drawLabel(ctx, "→  Glucose + Oxygen", w * 0.5, h * 0.42, { h: 28, maxW: w * 0.94 });
 drawLabel(ctx, "6CO2 + 6H2O + light  →  C6H12O6 + 6O2", w * 0.5, h * 0.58, {
 font: "600 11px Segoe UI, sans-serif",
 h: 28,
 maxW: w * 0.94,
 });
 drawLabel(ctx, "Chlorophyll captures the light that powers it.", w * 0.5, h * 0.74, { h: 26, maxW: w * 0.94 });
 setHitRegions([]);
 } else {
 const sun = !!bioLabState.plantPhotoSun;
 const water = !!bioLabState.plantPhotoWater;
 const co2 = !!bioLabState.plantPhotoCo2;
 const working = sun && water && co2;
 const gSep = !!bioLabState.plantPhotoGlucoseSep;
 const oSep = !!bioLabState.plantPhotoOxygenSep;

 // Realistic leaf cross-section body
 const leafG = ctx.createLinearGradient(0, h * 0.18, 0, h * 0.72);
 leafG.addColorStop(0, "#4ade80");
 leafG.addColorStop(0.45, "#16a34a");
 leafG.addColorStop(1, "#14532d");
 ctx.fillStyle = leafG;
 roundRect(ctx, w * 0.08, h * 0.16, w * 0.84, h * 0.58, 18);
 ctx.fill();
 // midrib
 ctx.strokeStyle = "#052e16";
 ctx.lineWidth = 5;
 ctx.beginPath();
 ctx.moveTo(w * 0.12, h * 0.48);
 ctx.quadraticCurveTo(w * 0.5, h * 0.44, w * 0.88, h * 0.48);
 ctx.stroke();

 if (sun) {
 const beam = ctx.createLinearGradient(w * 0.78, h * 0.08, w * 0.45, h * 0.5);
 beam.addColorStop(0, "rgba(254,240,138,0.7)");
 beam.addColorStop(1, "rgba(254,240,138,0)");
 ctx.fillStyle = beam;
 ctx.beginPath();
 ctx.moveTo(w * 0.68, h * 0.1);
 ctx.lineTo(w * 0.92, h * 0.1);
 ctx.lineTo(w * 0.58, h * 0.52);
 ctx.lineTo(w * 0.32, h * 0.52);
 ctx.fill();
 ctx.fillStyle = "#fde047";
 ctx.beginPath();
 ctx.arc(w * 0.84, h * 0.12, 18, 0, Math.PI * 2);
 ctx.fill();
 for (let i = 0; i < 6; i++) {
 const a = (i / 6) * Math.PI * 2 + t;
 ctx.strokeStyle = "rgba(253,224,71,0.55)";
 ctx.beginPath();
 ctx.moveTo(w * 0.84 + Math.cos(a) * 22, h * 0.12 + Math.sin(a) * 22);
 ctx.lineTo(w * 0.84 + Math.cos(a) * 32, h * 0.12 + Math.sin(a) * 32);
 ctx.stroke();
 }
 }

 // Chloroplasts - pulse when sun is on
 for (let r = 0; r < 3; r++) {
 for (let c = 0; c < 5; c++) {
 const px = w * 0.22 + c * w * 0.12;
 const py = h * 0.32 + r * 32;
 const pulse = sun ? 0.85 + 0.25 * Math.sin(t * 4 + r + c) : 0.7;
 drawChloro(ctx, px, py, pulse);
 if (sun) {
 ctx.fillStyle = `rgba(254,240,138,${0.15 + 0.2 * Math.sin(t * 5 + c)})`;
 ctx.beginPath();
 ctx.arc(px, py, 14, 0, Math.PI * 2);
 ctx.fill();
 }
 }
 }

 // Water droplets along vein
 if (water) {
 ctx.fillStyle = "rgba(56,189,248,0.85)";
 for (let i = 0; i < 5; i++) {
 const ux = w * 0.18 + ((t * 40 + i * 36) % (w * 0.64));
 ctx.beginPath();
 ctx.ellipse(ux, h * 0.48 + Math.sin(t * 3 + i) * 3, 4, 6, 0, 0, Math.PI * 2);
 ctx.fill();
 }
 drawLabel(ctx, "H2O in vein", w * 0.22, h * 0.4, { h: 18, font: "600 10px Segoe UI" });
 }

 // Stomata + CO2 / O2 flow
 const open = co2 ? 0.7 + 0.3 * Math.sin(t * 2.5) : 0.25;
 ctx.fillStyle = `rgba(15,23,42,${0.45 + open * 0.35})`;
 ctx.beginPath();
 ctx.ellipse(w * 0.32, h * 0.66, 10, 3 + open * 5, 0, 0, Math.PI * 2);
 ctx.ellipse(w * 0.5, h * 0.68, 10, 3 + open * 5, 0, 0, Math.PI * 2);
 ctx.ellipse(w * 0.68, h * 0.66, 10, 3 + open * 5, 0, 0, Math.PI * 2);
 ctx.fill();
 if (co2) {
 ctx.fillStyle = "#38bdf8";
 ctx.font = "700 11px Segoe UI";
 ctx.textAlign = "center";
 const gy = h * 0.62 + Math.sin(t * 3) * 4;
 ctx.fillText("CO₂ in ↑", w * 0.2, gy);
 }
 if (working) {
 ctx.fillStyle = "#67e8f9";
 ctx.font = "700 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("O₂ out ↓", w * 0.8, h * 0.58 + Math.sin(t * 2.8) * 4);
 ctx.fillStyle = "#facc15";
 ctx.fillText("Glucose forming…", w * 0.5, h * 0.38);
 }

 const msg =
 bioLabState.prompt ||
 (working
 ? "Factory running. Tap Glucose and Oxygen to separate the products."
 : "Toggle Sunlight, Water, and CO₂ to start the leaf factory.");
 drawLabel(ctx, msg, w * 0.5, 22, { h: 26, maxW: w * 0.94, font: "600 11px Segoe UI" });

 // Toggle buttons
 const btns = [
 { id: "sun", label: sun ? "Sun ON" : "Sunlight", x: w * 0.18, lit: sun },
 { id: "water", label: water ? "Water ON" : "Water", x: w * 0.5, lit: water },
 { id: "co2", label: co2 ? "CO₂ ON" : "CO₂", x: w * 0.82, lit: co2 },
 ];
 const hits = [];
 btns.forEach((b) => {
 drawCanvasBtn(ctx, b.x, h - 78, 100, 30, b.label, b.lit);
 hits.push({ id: `btn-${b.id}`, shape: "rect", x: b.x, y: h - 78, w: 104, h: 32, meta: { action: b.id } });
 });

 // Separable products
 const gX = gSep ? w * 0.22 : w * 0.42;
 const oX = oSep ? w * 0.78 : w * 0.58;
 const py = h - 36;
 ctx.fillStyle = working || gSep ? "#4ade80" : "#365314";
 roundRect(ctx, gX - 40, py - 14, 80, 28, 10);
 ctx.fill();
 ctx.fillStyle = "#0f172a";
 ctx.font = "800 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(gSep ? "Glucose → stem" : "Glucose", gX, py);
 hits.push({ id: "sep-g", shape: "rect", x: gX, y: py, w: 84, h: 30, meta: { action: "sepGlucose" } });

 ctx.fillStyle = working || oSep ? "#67e8f9" : "#0e7490";
 roundRect(ctx, oX - 40, py - 14, 80, 28, 10);
 ctx.fill();
 ctx.fillStyle = "#0f172a";
 ctx.fillText(oSep ? "Oxygen → air" : "Oxygen", oX, py);
 hits.push({ id: "sep-o", shape: "rect", x: oX, y: py, w: 84, h: 30, meta: { action: "sepOxygen" } });

 if (gSep && oSep) {
 drawLabel(ctx, "Products separated: sugar to stem, oxygen to air", w * 0.5, h * 0.78, {
 h: 22,
 font: "600 10px Segoe UI",
 });
 }

 setHitRegions(hits);
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("plantTrace", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 setDescription("Trace water up, then sugar down.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.hop) sendTrace(intent.meta.hop);
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 fillLab(ctx, w, h);
 const water = bioLabState.plantTracePhase !== "sugar";
 const z = drawPlantBody(ctx, w, h, {
 showAll: true,
 cutaway: true,
 hair: true,
 t: performance.now() / 1000,
 lit: water ? "roots" : "leaves",
 });
 const msg = bioLabState.plantTraceDone
 ? "Two journeys, opposite directions, two separate sets of tubes."
 : bioLabState.prompt ||
 (water ? "Water: roots, up the stem, into the leaf." : "Sugar: leaf, down the stem, everywhere else.");
 drawLabel(ctx, msg, w * 0.5, 22, { font: "600 11px Segoe UI, sans-serif", h: 28, maxW: w * 0.94 });
 const hops = water ? PLANT_WATER_HOPS : PLANT_SUGAR_HOPS;
 const pts = water
 ? [z.roots, z.stem, z.leaves]
 : [z.leaves, z.stem, z.roots];
 const hits = hops.map((hop, i) => ({
 id: hop.id,
 shape: "ellipse",
 x: pts[i].x,
 y: pts[i].y,
 r: pts[i].r,
 meta: { hop: hop.id },
 }));
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("plantHighways", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 const start = performance.now();
 setDescription("Two one-way highways. Then xylem and phloem.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 const phase = bioLabState.phase || "lanes";
 fillLab(ctx, w, h);
 if (phase === "names") {
 drawLabel(ctx, "Xylem: water and minerals up, roots to leaves", w * 0.5, h * 0.28, { h: 28, maxW: w * 0.94 });
 drawLabel(ctx, "Phloem: sugar throughout the plant, wherever needed", w * 0.5, h * 0.44, { h: 28, maxW: w * 0.94 });
 drawLabel(ctx, "Root hairs: extra surface for absorbing water", w * 0.5, h * 0.6, { h: 28, maxW: w * 0.94 });
 drawLabel(ctx, "Transpiration: water evaporates from leaves, pulling more up", w * 0.5, h * 0.76, {
 h: 28,
 maxW: w * 0.94,
 });
 } else {
 drawPlantBody(ctx, w, h, { showAll: true, cutaway: true, t });
 const y0 = h * 0.2;
 const y1 = h * 0.78;
 const drift = (t * 30) % 40;
 ctx.strokeStyle = "#38bdf8";
 ctx.lineWidth = 8;
 ctx.beginPath();
 ctx.moveTo(w * 0.22, y1);
 ctx.lineTo(w * 0.22, y0);
 ctx.stroke();
 ctx.strokeStyle = "#4ade80";
 ctx.beginPath();
 ctx.moveTo(w * 0.3, y0);
 ctx.lineTo(w * 0.3, y1);
 ctx.stroke();
 ctx.fillStyle = "#7dd3fc";
 ctx.beginPath();
 ctx.arc(w * 0.22, y1 - drift * 4, 5, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#86efac";
 ctx.beginPath();
 ctx.arc(w * 0.3, y0 + drift * 4, 5, 0, Math.PI * 2);
 ctx.fill();
 drawLabel(ctx, "Two separate one-way highways, full height, no pump.", w * 0.5, 24, {
 h: 26,
 maxW: w * 0.94,
 });
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("plantBloom", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 setDescription("Pollinate, then send the seed.");
 setIntentHandler((intent) => {
 if (intent.type !== "CANVAS_TAP") return;
 if (intent.meta?.spot) pollinate(intent.meta.spot);
 if (intent.meta?.method) sendSeed(intent.meta.method);
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 fillLab(ctx, w, h);
 const phase = bioLabState.plantBloomPhase || "pollinate";
 const hits = [];
 if (phase === "seed") {
 const seed = PLANT_SEEDS[Math.min(bioLabState.plantSeedI || 0, PLANT_SEEDS.length - 1)];
 ctx.fillStyle = seed.id === "coconut" ? "#a16207" : seed.id === "burr" ? "#78716c" : "#fde68a";
 ctx.beginPath();
 ctx.ellipse(w * 0.5, h * 0.4, seed.id === "coconut" ? 28 : 16, seed.id === "coconut" ? 18 : 10, 0, 0, Math.PI * 2);
 ctx.fill();
 const msg = bioLabState.plantBloomDone
 ? "The next plant doesn't have to grow in direct competition with its parent."
 : bioLabState.prompt || `Match this ${seed.name.toLowerCase()} (${seed.hint}) to how it travels.`;
 drawLabel(ctx, msg, w * 0.5, 24, { font: "600 11px Segoe UI, sans-serif", h: 28, maxW: w * 0.94 });
 ["wind", "animal", "water"].forEach((m, i) => {
 const x = w * (0.22 + i * 0.28);
 const y = h - 36;
 drawCanvasBtn(ctx, x, y, 120, 32, m, false);
 hits.push({ id: `m-${m}`, shape: "rect", x, y, w: 124, h: 34, meta: { method: m } });
 });
 } else {
 const ax = w * 0.32;
 const bx = w * 0.68;
 const fy = h * 0.42;
 drawFlowerHead(ctx, ax, fy, true);
 drawFlowerHead(ctx, bx, fy, true);
 ctx.fillStyle = "#4d7c0f";
 ctx.fillRect(ax - 3, fy + 14, 6, 50);
 ctx.fillRect(bx - 3, fy + 14, 6, 50);
 ctx.fillStyle = "#facc15";
 ctx.beginPath();
 ctx.arc(ax, fy - 22, 6, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#fb7185";
 ctx.beginPath();
 ctx.arc(bx, fy - 18, 7, 0, Math.PI * 2);
 ctx.fill();
 const beeX = bioLabState.plantBee === "idle" ? w * 0.5 : bioLabState.plantBee === "pollen" ? ax + 18 : bx - 18;
 const beeY = bioLabState.plantBee === "idle" ? h * 0.7 : fy - 8;
 drawBee(ctx, beeX, beeY);
 const msg =
 bioLabState.prompt || "Drag the bee to the stamen, then to the other flower's pistil.";
 drawLabel(ctx, msg, w * 0.5, 24, { font: "600 11px Segoe UI, sans-serif", h: 28, maxW: w * 0.94 });
 hits.push({ id: "stamen", shape: "ellipse", x: ax, y: fy - 22, r: 28, meta: { spot: "stamen" } });
 hits.push({ id: "pistil", shape: "ellipse", x: bx, y: fy - 18, r: 28, meta: { spot: "pistil" } });
 }
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("plantCycle", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 const start = performance.now();
 setDescription("One continuous cycle. Then the names.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 const phase = bioLabState.phase || "cycle";
 fillLab(ctx, w, h);
 if (phase === "card") {
 drawLabel(ctx, "Pollination: pollen from a stamen to a pistil", w * 0.5, h * 0.28, { h: 28, maxW: w * 0.94 });
 drawLabel(ctx, "Fertilization: pollen plus an egg cell makes a seed", w * 0.5, h * 0.46, { h: 28, maxW: w * 0.94 });
 drawLabel(ctx, "Seed dispersal: the seed travels by wind, animal, or water", w * 0.5, h * 0.64, {
 h: 28,
 maxW: w * 0.94,
 });
 } else {
 const labels = ["Seed", "Sprout", "Young plant", "Flowering", "Pollination", "New seed"];
 const shot = Math.floor(t / 1.6) % 6;
 const cx = w * 0.5;
 const cy = h * 0.52;
 ctx.strokeStyle = "rgba(74,222,128,0.55)";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.arc(cx, cy, Math.min(w, h) * 0.28, 0, Math.PI * 2);
 ctx.stroke();
 labels.forEach((lab, i) => {
 const a = -Math.PI / 2 + (i / 6) * Math.PI * 2;
 const x = cx + Math.cos(a) * Math.min(w, h) * 0.28;
 const y = cy + Math.sin(a) * Math.min(w, h) * 0.28;
 ctx.fillStyle = i === shot ? "#16a34a" : "#14532d";
 ctx.beginPath();
 ctx.arc(x, y, 16, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#ecfdf5";
 ctx.font = "700 10px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(String(i + 1), x, y + 3);
 });
 drawLabel(ctx, `${labels[shot]}. Every organ keeps this cycle running.`, w * 0.5, 24, {
 h: 26,
 maxW: w * 0.94,
 });
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("plantClose", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 const start = performance.now();
 setDescription("The whole machine. Nothing about a plant is actually still.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 bioLabState.plantCloseU = Math.min(1, t / 3);
 drawWindowsillPlant(ctx, w, h, t);
 const ghosts = ["roots", "leaves", "stem", "flower"];
 const g = ghosts[Math.floor(t / 0.8) % 4];
 ctx.save();
 ctx.globalAlpha = 0.55;
 drawPlantBody(ctx, w, h, { showAll: true, cutaway: true, ghost: g, t });
 ctx.restore();
 drawLabel(ctx, "Nothing about a plant is actually still. It's just quiet.", w * 0.5, 28, {
 h: 26,
 maxW: w * 0.94,
 });
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("plantSpiral", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const stops = [
 { id: 1, label: "1 Body", caption: "Spiral 1: roots, stem, leaves, flower" },
 { id: 2, label: "2 Kitchen", caption: "Spiral 2: photosynthesis in the leaf" },
 { id: 3, label: "3 Plumbing", caption: "Spiral 3: xylem up, phloem around" },
 { id: 4, label: "4 Next", caption: "Spiral 4: pollination, seeds, the cycle" },
 ];
 setDescription("Recap map of the four Plant Power spirals.");
 setIntentHandler((intent) => {
 if (intent.type !== "CANVAS_TAP") return;
 if (intent.meta?.action === "spiral") {
 bioLabState.spiralStop = Number(intent.meta.stop) || 0;
 bioLabState.spiralUntil = performance.now() + 4500;
 }
 if (intent.meta?.action === "spiralFinish") bioLabState.spiralFinish = true;
 });
 function polar(s, w, h) {
 const cx = w * 0.5;
 const cy = Math.min(h * 0.44, h - 118);
 const maxR = Math.min(w * 0.36, Math.max(70, h - 140) * 0.42, 150);
 const a = -0.55 + s * 1.28;
 const r = maxR * (0.55 + s * 0.15);
 return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, cx, cy };
 }
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const stop = bioLabState.spiralStop || 0;
 fillLab(ctx, w, h);
 ctx.strokeStyle = "rgba(74,222,128,0.55)";
 ctx.lineWidth = 3;
 ctx.beginPath();
 for (let s = 0; s <= 3.02; s += 0.04) {
 const p = polar(s, w, h);
 if (s === 0) ctx.moveTo(p.x, p.y);
 else ctx.lineTo(p.x, p.y);
 }
 ctx.stroke();
 const origin = polar(0, w, h);
 ctx.beginPath();
 ctx.arc(origin.cx, origin.cy, 48, 0, Math.PI * 2);
 ctx.fillStyle = "rgba(6,78,59,0.55)";
 ctx.fill();
 if (stop === 1) drawPlantBody(ctx, 90, 90, { showAll: true });
 if (stop === 2) drawChloro(ctx, origin.cx, origin.cy, 1.4);
 if (stop === 3) {
 ctx.fillStyle = "#38bdf8";
 ctx.fillRect(origin.cx - 8, origin.cy - 16, 6, 32);
 ctx.fillStyle = "#4ade80";
 ctx.fillRect(origin.cx + 2, origin.cy - 16, 6, 32);
 }
 if (stop === 4) drawFlowerHead(ctx, origin.cx, origin.cy, true);
 const hits = [];
 stops.forEach((s, i) => {
 const p = polar(i, w, h);
 ctx.fillStyle = stop === s.id ? "#16a34a" : "#14532d";
 ctx.beginPath();
 ctx.arc(p.x, p.y, 22, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#ecfdf5";
 ctx.font = "800 16px Segoe UI";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(String(s.id), p.x, p.y + 1);
 hits.push({ id: `stop-${s.id}`, shape: "ellipse", x: p.x, y: p.y, r: 36, meta: { action: "spiral", stop: s.id } });
 });
 if (stop) {
 const cap = stops.find((s) => s.id === stop);
 if (cap) drawLabel(ctx, cap.caption, w * 0.5, 28, { font: "600 12px Segoe UI, sans-serif", h: 28, maxW: w * 0.94 });
 }
 const fx = w * 0.5;
 const fy = h - 34;
 const fw = Math.min(260, w * 0.76);
 roundRect(ctx, fx - fw / 2, fy - 22, fw, 44, 12);
 ctx.fillStyle = "#16a34a";
 ctx.fill();
 ctx.fillStyle = "#ecfdf5";
 ctx.font = "800 16px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText("Finish Plant Power", fx, fy);
 hits.push({ id: "spiral-finish", shape: "rect", x: fx, y: fy, w: fw, h: 44, meta: { action: "spiralFinish" } });
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 if (typeof arena.registerAlias === "function") {
 arena.registerAlias("plantMeet", "plantOpen");
 arena.registerAlias("plantSort", "plantBuild");
 arena.registerAlias("plantLab", "plantKitchen");
 arena.registerAlias("plantRule", "plantPhoto");
 arena.registerAlias("plantStretch", "plantTrace");
 arena.registerAlias("plantMyth", "plantHighways");
 arena.registerAlias("plantDrill", "plantBloom");
 arena.registerAlias("plantMastery", "plantSpiral");
 }
}
