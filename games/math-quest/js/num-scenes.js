/**
 * Math Quest Mission 1: Number Sense - Canvas 2D scenes.
 * Counting, bundling by tens, place value. No physics engine. Rect hits are center-origin.
 */
import {
 labState,
 pulseFailFeedback,
 pulseSuccessFeedback,
 NUM_TOTAL,
 NUM_SLOW_NEED,
 NUM_TENS_NEED,
 NUM_ONES_NEED,
 NUM_EXAMPLES,
 makeNumDots,
} from "./lab-state.js?v=numbersense1";

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
 ctx.font = opts.font || "600 12px Segoe UI, system-ui, sans-serif";
 const tw = ctx.measureText(text).width;
 const bw = Math.min(opts.maxW || 9999, tw + 22);
 const bh = opts.h || 26;
 ctx.fillStyle = opts.bg || "rgba(8,47,73,0.92)";
 roundRect(ctx, x - bw / 2, y - bh / 2, bw, bh, 10);
 ctx.fill();
 ctx.strokeStyle = opts.border || "rgba(125,211,252,0.55)";
 ctx.lineWidth = 1.3;
 ctx.stroke();
 ctx.fillStyle = opts.color || "#e0f2fe";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(text, x, y + 1);
}

function drawCanvasBtn(ctx, x, y, w, h, label, lit) {
 roundRect(ctx, x - w / 2, y - h / 2, w, h, 12);
 ctx.fillStyle = lit ? "#0284c7" : "#0c4a6e";
 ctx.fill();
 ctx.strokeStyle = "rgba(186,230,253,0.75)";
 ctx.lineWidth = 1.6;
 ctx.stroke();
 ctx.fillStyle = "#f0f9ff";
 ctx.font = "800 12px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(label, x, y + 1);
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

function fillMath(ctx, w, h) {
 const g = ctx.createLinearGradient(0, 0, 0, h);
 g.addColorStop(0, "#0c4a6e");
 g.addColorStop(0.55, "#082f49");
 g.addColorStop(1, "#0f172a");
 ctx.fillStyle = g;
 ctx.fillRect(0, 0, w, h);
}

function ensureDots() {
 if (!Array.isArray(labState.numDots) || labState.numDots.length !== NUM_TOTAL) {
 labState.numDots = makeNumDots();
 }
 return labState.numDots;
}

function drawDot(ctx, x, y, r, kind) {
 ctx.beginPath();
 ctx.arc(x, y, r, 0, Math.PI * 2);
 if (kind === "counted") ctx.fillStyle = "#38bdf8";
 else if (kind === "selected") ctx.fillStyle = "#facc15";
 else if (kind === "bundled") ctx.fillStyle = "#0ea5e9";
 else ctx.fillStyle = "#7dd3fc";
 ctx.fill();
 ctx.strokeStyle = "rgba(224,242,254,0.45)";
 ctx.lineWidth = 1;
 ctx.stroke();
}

function drawApple(ctx, x, y, lit) {
 ctx.save();
 ctx.translate(x, y);
 ctx.fillStyle = lit ? "#f87171" : "#ef4444";
 ctx.beginPath();
 ctx.ellipse(0, 4, 12, 14, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#166534";
 ctx.fillRect(-2, -14, 3, 8);
 ctx.fillStyle = "#22c55e";
 ctx.beginPath();
 ctx.ellipse(8, -10, 6, 3, 0.5, 0, Math.PI * 2);
 ctx.fill();
 if (lit) {
 ctx.strokeStyle = "#fde68a";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.arc(0, 4, 16, 0, Math.PI * 2);
 ctx.stroke();
 }
 ctx.restore();
}

function drawStar(ctx, x, y, s = 1) {
 ctx.save();
 ctx.translate(x, y);
 ctx.scale(s, s);
 ctx.fillStyle = "#facc15";
 ctx.beginPath();
 for (let i = 0; i < 5; i++) {
 const a = -Math.PI / 2 + i * (Math.PI * 2) / 5;
 const a2 = a + Math.PI / 5;
 if (i === 0) ctx.moveTo(Math.cos(a) * 12, Math.sin(a) * 12);
 ctx.lineTo(Math.cos(a) * 12, Math.sin(a) * 12);
 ctx.lineTo(Math.cos(a2) * 5, Math.sin(a2) * 5);
 }
 ctx.closePath();
 ctx.fill();
 ctx.restore();
}

function drawRod(ctx, x, y, scale = 1) {
 ctx.save();
 ctx.translate(x, y);
 ctx.scale(scale, scale);
 ctx.fillStyle = "#0ea5e9";
 roundRect(ctx, -8, -48, 16, 96, 4);
 ctx.fill();
 ctx.strokeStyle = "#0369a1";
 ctx.lineWidth = 2;
 ctx.stroke();
 for (let i = 0; i < 10; i++) {
 ctx.strokeStyle = "rgba(224,242,254,0.35)";
 ctx.beginPath();
 ctx.moveTo(-8, -48 + i * 9.6);
 ctx.lineTo(8, -48 + i * 9.6);
 ctx.stroke();
 }
 ctx.restore();
}

function drawCube(ctx, x, y, scale = 1) {
 ctx.save();
 ctx.translate(x, y);
 ctx.scale(scale, scale);
 ctx.fillStyle = "#38bdf8";
 roundRect(ctx, -10, -10, 20, 20, 4);
 ctx.fill();
 ctx.strokeStyle = "#0284c7";
 ctx.lineWidth = 2;
 ctx.stroke();
 ctx.restore();
}

function drawWorkbench(ctx, cx, cy, tens, ones, opts = {}) {
 const tw = opts.w || 240;
 const th = opts.h || 130;
 const x = cx - tw / 2;
 const y = cy - th / 2;
 ctx.fillStyle = "rgba(8,47,73,0.9)";
 roundRect(ctx, x, y, tw, th, 14);
 ctx.fill();
 ctx.strokeStyle = "#38bdf8";
 ctx.lineWidth = 2;
 ctx.stroke();
 ctx.fillStyle = "#7dd3fc";
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("Tens", x + tw * 0.28, y + 18);
 ctx.fillText("Ones", x + tw * 0.72, y + 18);
 ctx.fillStyle = tens >= NUM_TENS_NEED ? "#fde68a" : "#e0f2fe";
 ctx.font = "800 32px Segoe UI";
 ctx.fillText(String(tens), x + tw * 0.28, y + 52);
 ctx.fillStyle = ones >= NUM_ONES_NEED ? "#fde68a" : "#e0f2fe";
 ctx.fillText(String(ones), x + tw * 0.72, y + 52);
 ctx.strokeStyle = "rgba(125,211,252,0.4)";
 ctx.beginPath();
 ctx.moveTo(cx, y + 8);
 ctx.lineTo(cx, y + th - 8);
 ctx.stroke();
 const rodN = Math.min(9, tens);
 for (let i = 0; i < rodN; i++) drawRod(ctx, x + tw * 0.18 + (i % 4) * 16, y + th - 28, 0.28);
 const cubeN = Math.min(9, ones);
 for (let i = 0; i < cubeN; i++) drawCube(ctx, x + tw * 0.6 + (i % 4) * 16, y + th - 22 + Math.floor(i / 4) * 14, 0.55);
 return {
 tens: { x: x + tw * 0.28, y: y + th * 0.55, w: tw * 0.4, h: th * 0.7 },
 ones: { x: x + tw * 0.72, y: y + th * 0.55, w: tw * 0.4, h: th * 0.7 },
 };
}

function drawOdometer(ctx, cx, cy, value, digits = 4) {
 const s = String(value).padStart(digits, "0");
 const slotW = 36;
 const totalW = digits * (slotW + 6);
 let x = cx - totalW / 2;
 for (let i = 0; i < digits; i++) {
 roundRect(ctx, x, cy - 22, slotW, 44, 8);
 ctx.fillStyle = "#0f172a";
 ctx.fill();
 ctx.strokeStyle = "#38bdf8";
 ctx.stroke();
 ctx.fillStyle = "#e0f2fe";
 ctx.font = "800 22px Segoe UI";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(s[i], x + slotW / 2, cy);
 x += slotW + 6;
 }
}

function drawChaosDots(ctx, w, h, t, mode) {
 const dots = ensureDots();
 const jitter = mode === "chaos" ? 4 : 0;
 dots.forEach((d) => {
 let x = d.nx * w;
 let y = d.ny * h;
 if (jitter) {
 x += Math.sin(t * 3 + d.id) * jitter;
 y += Math.cos(t * 2.4 + d.id * 0.4) * jitter;
 }
 let kind = "loose";
 if (mode === "slow" && labState.numCounted[d.id]) kind = "counted";
 if (mode === "bundle") {
 if (labState.numBundled[d.id] != null) kind = "bundled";
 else if (labState.numSelected[d.id]) kind = "selected";
 }
 if (mode === "neat") {
 const bi = labState.numBundled[d.id];
 if (bi != null) {
 x = w * 0.18 + bi * 70 + (d.id % 10) * 5;
 y = h * 0.38;
 kind = "bundled";
 } else {
 const loose = dots.filter((q) => labState.numBundled[q.id] == null);
 const idx = loose.findIndex((q) => q.id === d.id);
 x = w * 0.18 + idx * 22;
 y = h * 0.62;
 }
 }
 drawDot(ctx, x, y, 6, kind);
 d._x = x;
 d._y = y;
 });
}

export function tapApple(id) {
 if (labState.numApples[id]) {
 pulseFailFeedback(200);
 labState.prompt = "Already counted - each one only counts once.";
 return;
 }
 const n = Object.keys(labState.numApples).length + 1;
 labState.numApples = { ...labState.numApples, [id]: n };
 pulseSuccessFeedback(160);
 labState.prompt = String(n);
 if (n >= 8) {
 labState.numCountDone = true;
 labState.prompt =
 "You just matched every single apple to exactly one counting word, in order. That's the entire definition of counting.";
 pulseSuccessFeedback(280);
 }
}

export function tapDotSlow(id) {
 if (labState.numBundlePhase !== "slow") return;
 if (labState.numCounted[id]) {
 pulseFailFeedback(180);
 labState.prompt = "Already counted - each one only counts once.";
 return;
 }
 labState.numCounted = { ...labState.numCounted, [id]: true };
 pulseSuccessFeedback(120);
 const n = Object.keys(labState.numCounted).length;
 if (n >= 10) labState.prompt = "Easy to lose track past about 10 or 15, isn't it?";
 else labState.prompt = `${n} counted.`;
 if (n >= NUM_SLOW_NEED) labState.numSlowDone = true;
}

export function countNextDot() {
 if (labState.numBundlePhase !== "slow") return;
 const next = ensureDots().find((d) => !labState.numCounted[d.id]);
 if (next) tapDotSlow(next.id);
}

export function startBundling() {
 if (!labState.numSlowDone) return;
 labState.numBundlePhase = "bundle";
 labState.numCounted = {};
 labState.numSelected = {};
 labState.numBundled = {};
 labState.numBundles = 0;
 labState.prompt = "Lasso ten dots at a time. They snap into a bundle.";
}

export function tapDotBundle(id) {
 if (labState.numBundlePhase !== "bundle" || labState.numBundleDone) return;
 if (labState.numBundled[id] != null) return;
 if (labState.numSelected[id]) {
 const next = { ...labState.numSelected };
 delete next[id];
 labState.numSelected = next;
 return;
 }
 if (Object.keys(labState.numSelected).length >= 10) return;
 labState.numSelected = { ...labState.numSelected, [id]: true };
 if (Object.keys(labState.numSelected).length >= 10) {
 const b = labState.numBundles || 0;
 const bundled = { ...labState.numBundled };
 Object.keys(labState.numSelected).forEach((k) => {
 bundled[k] = b;
 });
 labState.numBundled = bundled;
 labState.numSelected = {};
 labState.numBundles = b + 1;
 pulseSuccessFeedback(220);
 const left = NUM_TOTAL - labState.numBundles * 10;
 labState.prompt = `${labState.numBundles} bundles + ${left} leftover.`;
 if (labState.numBundles >= NUM_TENS_NEED) {
 labState.numBundleDone = true;
 labState.prompt =
 "Same pile. Same total. But counting 4 bundles and 7 leftovers is dramatically faster than counting 47 individual dots, and much harder to mess up.";
 pulseSuccessFeedback(300);
 }
 }
}

export function lassoNext() {
 if (labState.numBundlePhase !== "bundle") return;
 const next = ensureDots().find((d) => labState.numBundled[d.id] == null && !labState.numSelected[d.id]);
 if (next) tapDotBundle(next.id);
}

export function snapBundle() {
 if (labState.numBundlePhase !== "bundle" || labState.numBundleDone) return;
 const loose = ensureDots().filter((d) => labState.numBundled[d.id] == null);
 if (loose.length < 10) {
 pulseFailFeedback(200);
 labState.prompt = "Need ten loose dots for a bundle.";
 return;
 }
 const b = labState.numBundles || 0;
 const bundled = { ...labState.numBundled };
 loose.slice(0, 10).forEach((d) => {
 bundled[d.id] = b;
 });
 labState.numBundled = bundled;
 labState.numSelected = {};
 labState.numBundles = b + 1;
 pulseSuccessFeedback(220);
 const left = NUM_TOTAL - labState.numBundles * 10;
 labState.prompt = `${labState.numBundles} bundles + ${left} leftover.`;
 if (labState.numBundles >= NUM_TENS_NEED) {
 labState.numBundleDone = true;
 labState.prompt =
 "Same pile. Same total. But counting 4 bundles and 7 leftovers is dramatically faster than counting 47 individual dots, and much harder to mess up.";
 pulseSuccessFeedback(300);
 }
}

export function placeBlock(zone) {
 const pick = labState.numBuildPick;
 if (!pick) {
 labState.prompt = "Tap a ten-rod or a one-cube first.";
 return;
 }
 if (pick === "ten" && zone !== "tens") {
 pulseFailFeedback(240);
 labState.prompt = "Ten-rods go in the Tens column.";
 return;
 }
 if (pick === "one" && zone !== "ones") {
 pulseFailFeedback(240);
 labState.prompt = "One-cubes go in the Ones column.";
 return;
 }
 if (pick === "ten") {
 if ((labState.numBuildTens || 0) >= NUM_TENS_NEED) {
 pulseFailFeedback(200);
 labState.prompt = "This number needs exactly 4 tens.";
 return;
 }
 labState.numBuildTens = (labState.numBuildTens || 0) + 1;
 } else {
 if ((labState.numBuildOnes || 0) >= NUM_ONES_NEED) {
 pulseFailFeedback(200);
 labState.prompt = "This number needs exactly 7 ones.";
 return;
 }
 labState.numBuildOnes = (labState.numBuildOnes || 0) + 1;
 }
 labState.numBuildPick = null;
 pulseSuccessFeedback(180);
 labState.tens = labState.numBuildTens;
 labState.ones = labState.numBuildOnes;
 if (labState.numBuildTens === NUM_TENS_NEED && labState.numBuildOnes === NUM_ONES_NEED) {
 labState.numBuildDone = true;
 labState.prompt = "4 tens + 7 ones = 47. The position of each digit tells you exactly what it's worth.";
 pulseSuccessFeedback(280);
 } else {
 labState.prompt = `${labState.numBuildTens} tens + ${labState.numBuildOnes} ones.`;
 }
}

export function sortBank(side) {
 if (side === "L") labState.numBankL = true;
 if (side === "R") labState.numBankR = true;
 pulseSuccessFeedback(200);
 labState.prompt =
 labState.numBankL && labState.numBankR
 ? "Once sorted into tens and ones, comparing numbers stops being a guessing game."
 : "Sort the other bank too.";
}

export function pickBank(side) {
 if (!(labState.numBankL && labState.numBankR)) {
 pulseFailFeedback(240);
 labState.prompt = "Still a jumble. Sort into tens first.";
 return;
 }
 if (side !== "R") {
 pulseFailFeedback(240);
 labState.prompt = "Look at the tens first. 8 tens beats 3 tens.";
 return;
 }
 labState.numCompareDone = true;
 labState.prompt = "83 is more than 38. Tens first, then ones.";
 pulseSuccessFeedback(280);
}

export function registerNumScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("numOpen", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const start = performance.now();
 ensureDots();
 setDescription("A messy pile. How many dots?");
 setIntentHandler((intent) => {
 if (intent.type !== "CANVAS_TAP") return;
 if (intent.meta?.action === "find" && (labState.numOpenU >= 0.4 || labState.numSeen)) {
 labState.numSeen = true;
 pulseSuccessFeedback(200);
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 labState.numOpenU = Math.min(1, t / 2.4);
 fillMath(ctx, w, h);
 drawChaosDots(ctx, w, h, t, "chaos");
 drawLabel(ctx, "Quick challenge: how many dots are on this screen?", w * 0.5, 24, {
 h: 26,
 maxW: w * 0.94,
 });
 const ready = labState.numOpenU >= 0.4 || labState.numSeen;
 const fx = w * 0.5;
 const fy = h - 36;
 drawCanvasBtn(ctx, fx, fy, 210, 40, "Find the System", ready);
 setHitRegions(
 ready ? [{ id: "find", shape: "rect", x: fx, y: fy, w: 210, h: 40, meta: { action: "find" } }] : [],
 );
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("numCount", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 setDescription("Tap each apple once. Counting is one word per item.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.apple != null) tapApple(Number(intent.meta.apple));
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 fillMath(ctx, w, h);
 const hits = [];
 const n = Object.keys(labState.numApples || {}).length;
 for (let i = 0; i < 8; i++) {
 const x = w * 0.14 + i * (w * 0.1);
 const y = h * 0.46;
 drawApple(ctx, x, y, !!labState.numApples[i]);
 if (labState.numApples[i]) {
 ctx.fillStyle = "#e0f2fe";
 ctx.font = "800 14px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(String(labState.numApples[i]), x, y + 28);
 }
 hits.push({ id: `ap${i}`, shape: "ellipse", x, y, r: 22, meta: { apple: i } });
 }
 drawLabel(ctx, labState.prompt || `Counted ${n} of 8.`, w * 0.5, 26, { h: 26, maxW: w * 0.94 });
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("numAmount", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 const start = performance.now();
 setDescription("8 apples. 8 stars. The same number.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 const u = labState.phase === "card" ? 1 : Math.min(1, t / 2.2);
 fillMath(ctx, w, h);
 for (let i = 0; i < 8; i++) {
 const ax = w * 0.12 + i * (w * 0.045) + u * (w * 0.28 - i * w * 0.045);
 const ay = h * 0.38 + u * (h * 0.02);
 ctx.globalAlpha = 1 - u * 0.35;
 drawApple(ctx, ax, ay, true);
 ctx.globalAlpha = 1;
 const sx = w * 0.55 + i * (w * 0.045) - u * (i * w * 0.045 - w * 0.08);
 drawStar(ctx, sx, h * 0.38 + u * 8, 1 - u * 0.2);
 }
 ctx.globalAlpha = Math.max(0, (u - 0.45) / 0.55);
 ctx.fillStyle = "#e0f2fe";
 ctx.font = "800 72px Segoe UI";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText("8", w * 0.28, h * 0.62);
 ctx.fillText("8", w * 0.72, h * 0.62);
 ctx.globalAlpha = 1;
 if (labState.phase === "card") {
 drawLabel(ctx, "Number: an amount. Numeral: the symbol we write, like 8.", w * 0.5, 26, {
 h: 28,
 maxW: w * 0.94,
 });
 } else {
 drawLabel(ctx, "8 apples. 8 stars. Completely different things, but the exact same number.", w * 0.5, 26, {
 h: 28,
 maxW: w * 0.94,
 });
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("numBundle", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 ensureDots();
 if (!labState.numSlowStarted) labState.numSlowStarted = performance.now();
 setDescription("The slow way, then bundles of ten.");
 setIntentHandler((intent) => {
 if (intent.type !== "CANVAS_TAP") return;
 if (intent.meta?.dot == null) return;
 if (labState.numBundlePhase === "slow") tapDotSlow(Number(intent.meta.dot));
 else tapDotBundle(Number(intent.meta.dot));
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 fillMath(ctx, w, h);
 const mode = labState.numBundleDone ? "neat" : labState.numBundlePhase === "bundle" ? "bundle" : "slow";
 drawChaosDots(ctx, w, h, performance.now() / 1000, mode);
 const hits = [];
 ensureDots().forEach((d) => {
 hits.push({ id: `d${d.id}`, shape: "ellipse", x: d._x, y: d._y, r: 12, meta: { dot: d.id } });
 });
 const sec = Math.floor(((performance.now() - (labState.numSlowStarted || performance.now())) / 1000));
 const line =
 labState.prompt ||
 (mode === "slow" ? `One by one. Timer ${sec}s.` : `${labState.numBundles || 0} bundles + leftover.`);
 drawLabel(ctx, line, w * 0.5, 24, { h: 26, maxW: w * 0.94 });
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("numGroups", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 const start = performance.now();
 ensureDots();
 if (!labState.numBundles) {
 labState.numBundles = 4;
 ensureDots().forEach((d, i) => {
 if (i < 40) labState.numBundled[d.id] = Math.floor(i / 10);
 });
 }
 setDescription("Messy pile versus groups of ten.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 fillMath(ctx, w, h);
 ctx.save();
 ctx.beginPath();
 ctx.rect(0, 0, w * 0.5, h);
 ctx.clip();
 drawChaosDots(ctx, w * 0.92, h, t, "chaos");
 ctx.restore();
 ctx.save();
 ctx.beginPath();
 ctx.rect(w * 0.5, 0, w * 0.5, h);
 ctx.clip();
 ctx.translate(w * 0.02, 0);
 drawChaosDots(ctx, w * 0.92, h, t, "neat");
 ctx.restore();
 ctx.strokeStyle = "rgba(186,230,253,0.4)";
 ctx.beginPath();
 ctx.moveTo(w * 0.5, 40);
 ctx.lineTo(w * 0.5, h - 16);
 ctx.stroke();
 const line =
 labState.phase === "card"
 ? "4 bundles of ten, plus 7 leftover, is why 47 looks the way it does."
 : "Messy pile: hard to trust. Neat groups of ten: trustworthy at a glance.";
 drawLabel(ctx, line, w * 0.5, 24, { h: 28, maxW: w * 0.94 });
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("numBuild", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 setDescription("Build 47: 4 tens and 7 ones.");
 setIntentHandler((intent) => {
 if (intent.type !== "CANVAS_TAP") return;
 if (intent.meta?.pick) labState.numBuildPick = intent.meta.pick;
 if (intent.meta?.zone) placeBlock(intent.meta.zone);
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 fillMath(ctx, w, h);
 const tens = labState.numBuildTens || 0;
 const ones = labState.numBuildOnes || 0;
 const wb = drawWorkbench(ctx, w * 0.5, h * 0.42, tens, ones);
 drawRod(ctx, w * 0.18, h * 0.78, 0.55);
 drawCube(ctx, w * 0.82, h * 0.78, 1.1);
 if (labState.numBuildDone) {
 ctx.fillStyle = "#fde68a";
 ctx.font = "800 42px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("47", w * 0.5, h * 0.16);
 }
 drawLabel(ctx, labState.prompt || "4 tens + 7 ones. Drag rods and cubes into the columns.", w * 0.5, 24, {
 h: 26,
 maxW: w * 0.94,
 });
 setHitRegions([
 { id: "pick-ten", shape: "rect", x: w * 0.18, y: h * 0.78, w: 50, h: 110, meta: { pick: "ten" } },
 { id: "pick-one", shape: "rect", x: w * 0.82, y: h * 0.78, w: 44, h: 44, meta: { pick: "one" } },
 { id: "z-tens", shape: "rect", x: wb.tens.x, y: wb.tens.y, w: wb.tens.w, h: wb.tens.h, meta: { zone: "tens" } },
 { id: "z-ones", shape: "rect", x: wb.ones.x, y: wb.ones.y, w: wb.ones.w, h: wb.ones.h, meta: { zone: "ones" } },
 ]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("numPlace", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 const start = performance.now();
 setDescription("Every two-digit number tells the same story.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 const i = labState.phase === "card" ? 0 : Math.floor(t / 1.6) % NUM_EXAMPLES.length;
 const ex = NUM_EXAMPLES[i];
 fillMath(ctx, w, h);
 ctx.fillStyle = "#fde68a";
 ctx.font = "800 40px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(String(ex.n), w * 0.5, h * 0.16);
 drawWorkbench(ctx, w * 0.5, h * 0.5, ex.tens, ex.ones, { w: 260, h: 140 });
 const line =
 labState.phase === "card"
 ? "47 = (4 × 10) + (7 × 1). Place value: a digit's seat decides its worth."
 : `${ex.n} = ${ex.tens} tens + ${ex.ones} ones.`;
 drawLabel(ctx, line, w * 0.5, h - 28, { h: 28, maxW: w * 0.94 });
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("numCompare", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 setDescription("Which bank has more?");
 setIntentHandler((intent) => {
 if (intent.type !== "CANVAS_TAP") return;
 if (intent.meta?.sort) sortBank(intent.meta.sort);
 if (intent.meta?.bank) pickBank(intent.meta.bank);
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 fillMath(ctx, w, h);
 const banks = [
 { id: "L", x: w * 0.27, n: 38, tens: 3, ones: 8, sorted: labState.numBankL },
 { id: "R", x: w * 0.73, n: 83, tens: 8, ones: 3, sorted: labState.numBankR },
 ];
 const hits = [];
 banks.forEach((b) => {
 ctx.fillStyle = "#78350f";
 roundRect(ctx, b.x - 90, h * 0.28, 180, 150, 16);
 ctx.fill();
 ctx.fillStyle = "#fbbf24";
 roundRect(ctx, b.x - 70, h * 0.22, 140, 28, 8);
 ctx.fill();
 ctx.fillStyle = "#78350f";
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(b.id === "L" ? "Bank A" : "Bank B", b.x, h * 0.24);
 if (b.sorted) {
 drawWorkbench(ctx, b.x, h * 0.48, b.tens, b.ones, { w: 150, h: 90 });
 ctx.fillStyle = "#e0f2fe";
 ctx.font = "800 18px Segoe UI";
 ctx.fillText(String(b.n), b.x, h * 0.72);
 } else {
 for (let i = 0; i < 12; i++) {
 ctx.fillStyle = i % 3 ? "#f59e0b" : "#eab308";
 ctx.beginPath();
 ctx.arc(b.x - 50 + (i % 6) * 18 + (i % 2) * 4, h * 0.42 + Math.floor(i / 6) * 22, 7, 0, Math.PI * 2);
 ctx.fill();
 }
 }
 hits.push({ id: `bank-${b.id}`, shape: "rect", x: b.x, y: h * 0.48, w: 170, h: 120, meta: { bank: b.id } });
 drawCanvasBtn(ctx, b.x, h * 0.84, 148, 30, b.sorted ? "Sorted" : "Sort into Tens", b.sorted);
 hits.push({
 id: `sort-${b.id}`,
 shape: "rect",
 x: b.x,
 y: h * 0.84,
 w: 148,
 h: 30,
 meta: { sort: b.id },
 });
 });
 drawLabel(ctx, labState.prompt || "Which has more? Sort into tens, then tap the winner.", w * 0.5, 24, {
 h: 26,
 maxW: w * 0.94,
 });
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("numRoll", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 const start = performance.now();
 setDescription("Every rollover is place value, live.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 fillMath(ctx, w, h);
 const cycle = t % 9;
 let value = 9;
 if (cycle < 1.5) value = 9;
 else if (cycle < 3) value = 10;
 else if (cycle < 4.5) value = 99;
 else if (cycle < 6) value = 100;
 else if (cycle < 7.5) value = 999;
 else value = 1000;
 drawOdometer(ctx, w * 0.5, h * 0.42, value, 4);
 const line =
 labState.phase === "card"
 ? "Base 10: grouping in tens. Computers use base 2 with the same place-value logic."
 : "Every rollover on an odometer, a clock, or a counter is place value, happening live.";
 drawLabel(ctx, line, w * 0.5, 26, { h: 28, maxW: w * 0.94 });
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("numClose", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 const start = performance.now();
 ensureDots();
 if (!labState.numBundles) {
 labState.numBundles = 4;
 ensureDots().forEach((d, i) => {
 if (i < 40) labState.numBundled[d.id] = Math.floor(i / 10);
 });
 }
 setDescription("The trick was there all along.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 labState.numCloseU = Math.min(1, t / 3);
 fillMath(ctx, w, h);
 const u = labState.numCloseU;
 const mode = u < 0.35 ? "chaos" : u < 0.75 ? "neat" : "neat";
 drawChaosDots(ctx, w, h, t, mode);
 ctx.globalAlpha = Math.max(0, (u - 0.7) / 0.3);
 ctx.fillStyle = "#fde68a";
 ctx.font = "800 72px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("47", w * 0.5, h * 0.22);
 ctx.globalAlpha = 1;
 drawLabel(ctx, "A system of bundles and positions, hiding inside every number you read.", w * 0.5, 26, {
 h: 28,
 maxW: w * 0.94,
 });
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("numSpiral", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const stops = [
 { id: 1, label: "1 Count", caption: "Spiral 1: a number is a pure amount" },
 { id: 2, label: "2 Tens", caption: "Spiral 2: bundle by tens" },
 { id: 3, label: "3 Place", caption: "Spiral 3: tens and ones" },
 { id: 4, label: "4 Why", caption: "Spiral 4: compare, roll over, base 10" },
 ];
 setDescription("Recap map of the four Number Sense spirals.");
 setIntentHandler((intent) => {
 if (intent.type !== "CANVAS_TAP") return;
 if (intent.meta?.action === "spiral") {
 labState.spiralStop = Number(intent.meta.stop) || 0;
 labState.spiralUntil = performance.now() + 4500;
 }
 if (intent.meta?.action === "spiralFinish") labState.spiralFinish = true;
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
 const stop = labState.spiralStop || 0;
 fillMath(ctx, w, h);
 ctx.strokeStyle = "rgba(56,189,248,0.55)";
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
 ctx.fillStyle = "rgba(8,47,73,0.7)";
 ctx.fill();
 if (stop === 1) {
 drawApple(ctx, origin.cx - 12, origin.cy, true);
 drawStar(ctx, origin.cx + 14, origin.cy, 0.9);
 }
 if (stop === 2) {
 for (let i = 0; i < 4; i++) drawDot(ctx, origin.cx - 18 + i * 12, origin.cy, 6, "bundled");
 }
 if (stop === 3) drawWorkbench(ctx, origin.cx, origin.cy, 4, 7, { w: 90, h: 54 });
 if (stop === 4) drawOdometer(ctx, origin.cx, origin.cy, 100, 3);
 const hits = [];
 stops.forEach((s, i) => {
 const p = polar(i, w, h);
 ctx.fillStyle = stop === s.id ? "#0284c7" : "#0c4a6e";
 ctx.beginPath();
 ctx.arc(p.x, p.y, 22, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#e0f2fe";
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
 ctx.fillStyle = "#0284c7";
 ctx.fill();
 ctx.fillStyle = "#e0f2fe";
 ctx.font = "800 16px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText("Finish Number Sense", fx, fy);
 hits.push({ id: "spiral-finish", shape: "rect", x: fx, y: fy, w: fw, h: 44, meta: { action: "spiralFinish" } });
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("numMeet", (api) => {
 const { setTick, setDispose, setDescription, setHitRegions, setIntentHandler, ctx } = api;
 const start = performance.now();
 ensureDots();
 setDescription("A messy pile. How many dots?");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "find") {
 labState.numSeen = true;
 pulseSuccessFeedback(200);
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 labState.numOpenU = Math.min(1, t / 2.4);
 fillMath(ctx, w, h);
 drawChaosDots(ctx, w, h, t, "chaos");
 drawLabel(ctx, "Quick challenge: how many dots are on this screen?", w * 0.5, 24, {
 h: 26,
 maxW: w * 0.94,
 });
 const ready = labState.numOpenU >= 0.4 || labState.numSeen;
 drawCanvasBtn(ctx, w * 0.5, h - 36, 210, 40, "Find the System", ready);
 setHitRegions(
 ready ? [{ id: "find", shape: "rect", x: w * 0.5, y: h - 36, w: 210, h: 40, meta: { action: "find" } }] : [],
 );
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });
 arena.registerScene("numLab", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 setDescription("Build 47: 4 tens and 7 ones.");
 setIntentHandler((intent) => {
 if (intent.type !== "CANVAS_TAP") return;
 if (intent.meta?.pick) labState.numBuildPick = intent.meta.pick;
 if (intent.meta?.zone) placeBlock(intent.meta.zone);
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 fillMath(ctx, w, h);
 const tens = labState.numBuildTens || 0;
 const ones = labState.numBuildOnes || 0;
 const wb = drawWorkbench(ctx, w * 0.5, h * 0.42, tens, ones);
 drawRod(ctx, w * 0.18, h * 0.78, 0.55);
 drawCube(ctx, w * 0.82, h * 0.78, 1.1);
 drawLabel(ctx, labState.prompt || "4 tens + 7 ones.", w * 0.5, 24, { h: 26, maxW: w * 0.94 });
 setHitRegions([
 { id: "pick-ten", shape: "rect", x: w * 0.18, y: h * 0.78, w: 50, h: 110, meta: { pick: "ten" } },
 { id: "pick-one", shape: "rect", x: w * 0.82, y: h * 0.78, w: 44, h: 44, meta: { pick: "one" } },
 { id: "z-tens", shape: "rect", x: wb.tens.x, y: wb.tens.y, w: wb.tens.w, h: wb.tens.h, meta: { zone: "tens" } },
 { id: "z-ones", shape: "rect", x: wb.ones.x, y: wb.ones.y, w: wb.ones.w, h: wb.ones.h, meta: { zone: "ones" } },
 ]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });
 arena.registerScene("numSort", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 setDescription("Tap each apple once.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.apple != null) tapApple(Number(intent.meta.apple));
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 fillMath(ctx, w, h);
 const hits = [];
 for (let i = 0; i < 8; i++) {
 const x = w * 0.14 + i * (w * 0.1);
 drawApple(ctx, x, h * 0.46, !!labState.numApples[i]);
 hits.push({ id: `ap${i}`, shape: "ellipse", x, y: h * 0.46, r: 22, meta: { apple: i } });
 }
 drawLabel(ctx, labState.prompt || "Count the apples.", w * 0.5, 26, { h: 26, maxW: w * 0.94 });
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });
 arena.registerScene("numRule", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 setDescription("Place value chart.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 fillMath(ctx, w, h);
 drawWorkbench(ctx, w * 0.5, h * 0.48, 4, 7);
 drawLabel(ctx, "47 = 4 tens + 7 ones.", w * 0.5, 26, { h: 26, maxW: w * 0.94 });
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });
 arena.registerScene("numStretch", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 ensureDots();
 setDescription("Bundle by tens.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.dot != null) {
 if (labState.numBundlePhase === "slow") tapDotSlow(Number(intent.meta.dot));
 else tapDotBundle(Number(intent.meta.dot));
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 fillMath(ctx, w, h);
 drawChaosDots(ctx, w, h, performance.now() / 1000, labState.numBundlePhase === "bundle" ? "bundle" : "slow");
 const hits = ensureDots().map((d) => ({
 id: `d${d.id}`,
 shape: "ellipse",
 x: d._x,
 y: d._y,
 r: 12,
 meta: { dot: d.id },
 }));
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });
 arena.registerScene("numMyth", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 setDescription("Groups of ten.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 fillMath(ctx, w, h);
 drawWorkbench(ctx, w * 0.5, h * 0.48, 4, 7);
 drawLabel(ctx, "Grouping in tens is a convenient choice.", w * 0.5, 26, { h: 26, maxW: w * 0.94 });
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });
 arena.registerScene("numDrill", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 setDescription("Compare with tens and ones.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 fillMath(ctx, w, h);
 drawWorkbench(ctx, w * 0.28, h * 0.48, 3, 8, { w: 150, h: 90 });
 drawWorkbench(ctx, w * 0.72, h * 0.48, 8, 3, { w: 150, h: 90 });
 drawLabel(ctx, "38 vs 83. Tens first.", w * 0.5, 26, { h: 26, maxW: w * 0.94 });
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });
 arena.registerScene("numMastery", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const stops = [
 { id: 1, caption: "Spiral 1: a number is a pure amount" },
 { id: 2, caption: "Spiral 2: bundle by tens" },
 { id: 3, caption: "Spiral 3: tens and ones" },
 { id: 4, caption: "Spiral 4: why it matters" },
 ];
 setDescription("Recap map of the four Number Sense spirals.");
 setIntentHandler((intent) => {
 if (intent.type !== "CANVAS_TAP") return;
 if (intent.meta?.action === "spiral") {
 labState.spiralStop = Number(intent.meta.stop) || 0;
 labState.spiralUntil = performance.now() + 4500;
 }
 if (intent.meta?.action === "spiralFinish") labState.spiralFinish = true;
 });
 function polar(s, w, h) {
 const cx = w * 0.5;
 const cy = Math.min(h * 0.44, h - 118);
 const maxR = Math.min(w * 0.36, Math.max(70, h - 140) * 0.42, 150);
 const a = -0.55 + s * 1.28;
 const r = maxR * (0.55 + s * 0.15);
 return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
 }
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const stop = labState.spiralStop || 0;
 fillMath(ctx, w, h);
 ctx.strokeStyle = "rgba(56,189,248,0.55)";
 ctx.lineWidth = 3;
 ctx.beginPath();
 for (let s = 0; s <= 3.02; s += 0.04) {
 const p = polar(s, w, h);
 if (s === 0) ctx.moveTo(p.x, p.y);
 else ctx.lineTo(p.x, p.y);
 }
 ctx.stroke();
 const hits = [];
 stops.forEach((s, i) => {
 const p = polar(i, w, h);
 ctx.fillStyle = stop === s.id ? "#0284c7" : "#0c4a6e";
 ctx.beginPath();
 ctx.arc(p.x, p.y, 22, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#e0f2fe";
 ctx.font = "800 16px Segoe UI";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(String(s.id), p.x, p.y + 1);
 hits.push({ id: `stop-${s.id}`, shape: "ellipse", x: p.x, y: p.y, r: 36, meta: { action: "spiral", stop: s.id } });
 });
 if (stop) {
 const cap = stops.find((s) => s.id === stop);
 if (cap) drawLabel(ctx, cap.caption, w * 0.5, 28, { h: 28, maxW: w * 0.94 });
 }
 const fx = w * 0.5;
 const fy = h - 34;
 const fw = Math.min(260, w * 0.76);
 roundRect(ctx, fx - fw / 2, fy - 22, fw, 44, 12);
 ctx.fillStyle = "#0284c7";
 ctx.fill();
 ctx.fillStyle = "#e0f2fe";
 ctx.font = "800 16px Segoe UI";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText("Finish Number Sense", fx, fy);
 hits.push({ id: "spiral-finish", shape: "rect", x: fx, y: fy, w: fw, h: 44, meta: { action: "spiralFinish" } });
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });
}
