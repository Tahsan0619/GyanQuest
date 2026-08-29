/**
 * Chemistry Lab Mission 3 Bond Buddies: Canvas 2D.
 * Script: Opening + 4 Bruner spirals (stability → ionic → covalent → spectrum) + recap map.
 */
import { chemLabState, pulseFailFeedback, pulseSuccessFeedback, drawH2O } from "./atom-scenes.js?v=bondbuddy1";

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
 ctx.font = opts.font || "600 13px Segoe UI, system-ui, sans-serif";
 const tw = ctx.measureText(text).width;
 const bw = Math.min((opts.maxW || 9999), tw + 22);
 const bh = opts.h || 26;
 ctx.fillStyle = opts.bg || "rgba(46,16,80,0.88)";
 roundRect(ctx, x - bw / 2, y - bh / 2, bw, bh, 10);
 ctx.fill();
 ctx.strokeStyle = opts.border || "rgba(167,139,250,0.5)";
 ctx.lineWidth = 1.4;
 ctx.stroke();
 ctx.fillStyle = opts.color || "#f5f3ff";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(text, x, y + 1);
}

function fillNight(ctx, w, h) {
 const g = ctx.createLinearGradient(0, 0, 0, h);
 g.addColorStop(0, "#2e1065");
 g.addColorStop(0.45, "#1e1b4b");
 g.addColorStop(1, "#0f172a");
 ctx.fillStyle = g;
 ctx.fillRect(0, 0, w, h);
}

function failShake() {
 const until = chemLabState.failPulse;
 if (!until || performance.now() > until) return 0;
 return Math.sin(performance.now() * 0.08) * 6;
}

function failFlash(ctx, w, h) {
 const until = chemLabState.failPulse;
 if (!until || performance.now() > until) return;
 const a = Math.max(0, (until - performance.now()) / 420) * 0.28;
 ctx.fillStyle = `rgba(248,113,113,${a})`;
 ctx.fillRect(0, 0, w, h);
}

function successFlash(ctx, w, h) {
 const until = chemLabState.successPulse;
 if (!until || performance.now() > until) return;
 const a = Math.max(0, (until - performance.now()) / 380) * 0.25;
 ctx.fillStyle = `rgba(167,139,250,${a})`;
 ctx.fillRect(0, 0, w, h);
}

function drawElectron(ctx, x, y, r = 5, color = "#c4b5fd") {
 ctx.fillStyle = color;
 ctx.beginPath();
 ctx.arc(x, y, r, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "rgba(255,255,255,0.45)";
 ctx.lineWidth = 1;
 ctx.stroke();
}

function drawCharge(ctx, x, y, sign) {
 const plus = sign === "+" || sign === "plus";
 ctx.fillStyle = plus ? "#fbbf24" : "#67e8f9";
 ctx.beginPath();
 ctx.arc(x, y, 11, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#0f172a";
 ctx.font = "800 14px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(plus ? "+" : "−", x, y + 1);
}

function drawBohr(ctx, x, y, shells, t, opts = {}) {
 const scale = opts.scale || 1;
 const jit = opts.jitter ? Math.sin(t * (opts.fast ? 18 : 12)) * (opts.fast ? 5 : 3) : 0;
 const gx = x + jit;
 const gy = y + (opts.jitter ? Math.cos(t * 10) * 2 : 0);
 const n = shells.length;
 if (opts.glow) {
 ctx.strokeStyle = "rgba(45,212,191,0.75)";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.arc(gx, gy, (28 + (n - 1) * 18) * scale + 14, 0, Math.PI * 2);
 ctx.stroke();
 }
 ctx.fillStyle = opts.nucleus || "#fb7185";
 ctx.beginPath();
 ctx.arc(gx, gy, 9 * scale, 0, Math.PI * 2);
 ctx.fill();
 if (opts.symbol) {
 ctx.fillStyle = "#0f172a";
 ctx.font = `700 ${Math.max(9, 11 * scale)}px Segoe UI, sans-serif`;
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(opts.symbol, gx, gy + 1);
 }
 shells.forEach((count, i) => {
 const r = (28 + i * 18) * scale;
 const valence = i === n - 1;
 ctx.strokeStyle = valence ? "rgba(196,181,253,0.9)" : "rgba(148,163,184,0.35)";
 ctx.lineWidth = valence ? 2.2 : 1.2;
 ctx.beginPath();
 ctx.arc(gx, gy, r, 0, Math.PI * 2);
 ctx.stroke();
 for (let k = 0; k < count; k++) {
 const a = t * (0.7 - i * 0.12) + (k / Math.max(1, count)) * Math.PI * 2;
 drawElectron(
 ctx,
 gx + Math.cos(a) * r,
 gy + Math.sin(a) * r,
 (valence ? 5 : 3.4) * scale,
 valence ? "#c4b5fd" : "#64748b",
 );
 }
 });
 if (opts.charge) drawCharge(ctx, gx + 38 * scale, gy - 30 * scale, opts.charge);
 return { x: gx, y: gy };
}

function lewisSlots(n) {
 const dirs = [
 [0, -1],
 [1, 0],
 [0, 1],
 [-1, 0],
 [0, -1],
 [1, 0],
 [0, 1],
 [-1, 0],
 ];
 return dirs.slice(0, Math.max(0, Math.min(8, n)));
}

function drawLewis(ctx, x, y, symbol, n, scale = 1) {
 ctx.fillStyle = "#f5f3ff";
 ctx.font = `800 ${18 * scale}px Segoe UI, sans-serif`;
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(symbol, x, y);
 const r = 22 * scale;
 lewisSlots(n).forEach((d, i) => {
 const pair = i >= 4 ? 5 : 0;
 const ox = d[0] * r + (d[0] === 0 ? (i >= 4 ? 5 : -5) : 0);
 const oy = d[1] * r + (d[1] === 0 ? (i >= 4 ? 5 : -5) : 0);
 drawElectron(ctx, x + ox, y + oy, 3.6 * scale);
 void pair;
 });
}

function drawSharedCloud(ctx, x1, y1, x2, y2, pairs = 1, pull = 0.5) {
 const mx = x1 + (x2 - x1) * pull;
 const my = y1 + (y2 - y1) * pull;
 const ang = Math.atan2(y2 - y1, x2 - x1);
 const dist = Math.hypot(x2 - x1, y2 - y1) || 1;
 ctx.save();
 ctx.translate(mx, my);
 ctx.rotate(ang);
 const thick = 8 + pairs * 5;
 const g = ctx.createRadialGradient(0, 0, 2, 0, 0, Math.max(16, dist * 0.28));
 g.addColorStop(0, `rgba(196,181,253,${0.45 + pairs * 0.18})`);
 g.addColorStop(1, "rgba(196,181,253,0)");
 ctx.fillStyle = g;
 ctx.beginPath();
 ctx.ellipse(0, 0, Math.max(18, dist * 0.26), thick, 0, 0, Math.PI * 2);
 ctx.fill();
 for (let p = 0; p < pairs; p++) {
 const yy = (p - (pairs - 1) / 2) * 7;
 drawElectron(ctx, -5, yy - 3, 3.1);
 drawElectron(ctx, 5, yy + 3, 3.1);
 }
 ctx.restore();
}

function drawCanvasBtn(ctx, x, y, w, h, label, lit) {
 roundRect(ctx, x - w / 2, y - h / 2, w, h, 12);
 ctx.fillStyle = lit ? "#6d28d9" : "#5b21b6";
 ctx.fill();
 ctx.strokeStyle = "rgba(216,180,254,0.7)";
 ctx.lineWidth = 1.6;
 ctx.stroke();
 ctx.fillStyle = "#f5f3ff";
 ctx.font = "800 14px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(label, x, y + 1);
}

const MOODS = [
 { id: "ne", symbol: "Ne", name: "Neon", shells: [2, 8], happy: true, note: "full outer shell → Happy" },
 { id: "na", symbol: "Na", name: "Sodium", shells: [2, 8, 1], happy: false, note: "1 lonely electron → Restless" },
 { id: "cl", symbol: "Cl", name: "Chlorine", shells: [2, 8, 7], happy: false, note: "1 electron short of full → Restless" },
 { id: "o", symbol: "O", name: "Oxygen", shells: [2, 6], happy: false, note: "2 electrons short of full → Restless" },
];

const TUGS = [
 { id: "hh", a: "H", b: "H", pull: 0.5, target: 0.08, type: "nonpolar covalent" },
 { id: "hcl", a: "H", b: "Cl", pull: 0.72, target: 0.38, type: "polar covalent" },
 { id: "nacl", a: "Na", b: "Cl", pull: 0.97, target: 0.9, type: "ionic" },
];

export function registerBondScenes(arena) {
 arena.registerScene("bondOpen", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const start = performance.now();
 setDescription("A restless atom. Bring a partner in.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "together") {
 chemLabState.bondTogether = true;
 pulseSuccessFeedback(320);
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 const together = chemLabState.bondTogether;
 const x1 = together ? w * 0.42 : w * 0.38 + Math.sin(t * 0.7) * Math.min(40, w * 0.06);
 const y1 = h * 0.46 + Math.cos(t * 0.9) * 8;
 drawBohr(ctx, x1, y1, [1], t, { symbol: "?", jitter: !together, scale: 1.05 });
 let x2 = w + 40;
 if (t > 1.1 || together) x2 = together ? w * 0.58 : w * 0.66 + Math.sin(t * 0.8 + 1) * 10;
 if (t > 1.1 || together) drawBohr(ctx, x2, h * 0.46 + Math.cos(t * 0.8) * 6, [1], t + 1, { symbol: "?", jitter: !together, scale: 1.05 });
 if (together) {
 ctx.strokeStyle = "rgba(196,181,253,0.7)";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.moveTo(x1 + 28, y1);
 ctx.lineTo(x2 - 28, h * 0.46);
 ctx.stroke();
 drawLabel(ctx, "They found a partner.", w * 0.5, 28);
 } else {
 drawLabel(ctx, "Its outer shell is almost empty. Restless, reactive, eager for company.", w * 0.5, 28, {
 font: "600 12px Segoe UI, sans-serif",
 h: 28,
 });
 }
 const hits = [];
 if (t > 1.2 && !together) {
 const bx = w * 0.5;
 const by = h - 42;
 drawCanvasBtn(ctx, bx, by, Math.min(260, w * 0.7), 44, "Bring Them Together →", true);
 hits.push({ id: "together", shape: "rect", x: bx, y: by, w: 260, h: 48, meta: { action: "together" } });
 }
 setHitRegions(hits);
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("bondMood", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 setDescription("Happy or restless? Read the outer shell.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = performance.now() / 1000;
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 const i = Math.max(0, Math.min(3, chemLabState.bondMoodI || 0));
 const m = MOODS[i];
 const ok = (chemLabState.bondMoodOk || [])[i];
 const wrong = chemLabState.bondMoodWrong;
 drawBohr(ctx, w * 0.5, h * 0.46, m.shells, t, {
 symbol: m.symbol,
 jitter: !m.happy && !ok,
 fast: wrong && !m.happy,
 glow: ok && m.happy,
 scale: 1.15,
 });
 drawLabel(ctx, `${m.name} (${m.symbol})`, w * 0.5, 26);
 if (ok) drawLabel(ctx, `${m.name}: ${m.note}`, w * 0.5, h - 28, { h: 26, font: "600 12px Segoe UI, sans-serif" });
 else drawLabel(ctx, "Look at the outer shell. Full, or not?", w * 0.5, h - 28, { h: 24, font: "600 12px Segoe UI, sans-serif" });
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("bondPaths", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 setDescription("Two moves: transfer or share.");
 setIntentHandler((intent) => {
 if (intent.type !== "CANVAS_TAP") return;
 const seen = chemLabState.bondPathSeen || { transfer: false, share: false };
 if (intent.meta?.action === "path") {
 if (intent.meta.id === "transfer") seen.transfer = true;
 if (intent.meta.id === "share") seen.share = true;
 chemLabState.bondPathSeen = { ...seen };
 pulseSuccessFeedback(200);
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = performance.now() / 1000;
 const phase = chemLabState.bondPhase || "paths";
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 const hits = [];
 if (phase === "lewis") {
 drawLewis(ctx, w * 0.32, h * 0.42, "Na", 1, 1.4);
 drawLewis(ctx, w * 0.68, h * 0.42, "Cl", 7, 1.4);
 drawLabel(ctx, "Lewis dots: only valence electrons around the symbol", w * 0.5, 26, {
 font: "600 12px Segoe UI, sans-serif",
 h: 28,
 });
 drawLabel(ctx, "Octet rule: most atoms chase 8 outer electrons (2 for H and He)", w * 0.5, h - 28, {
 font: "600 12px Segoe UI, sans-serif",
 h: 28,
 });
 } else {
 drawBohr(ctx, w * 0.5, h * 0.22, [2, 8, 1], t, { symbol: "?", scale: 0.7, jitter: true });
 const left = { x: w * 0.28, y: h * 0.62 };
 const right = { x: w * 0.72, y: h * 0.62 };
 ctx.strokeStyle = "rgba(196,181,253,0.55)";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.moveTo(w * 0.5, h * 0.34);
 ctx.lineTo(left.x, left.y - 50);
 ctx.moveTo(w * 0.5, h * 0.34);
 ctx.lineTo(right.x, right.y - 50);
 ctx.stroke();
 const seen = chemLabState.bondPathSeen || {};
 roundRect(ctx, left.x - 90, left.y - 48, 180, 96, 14);
 ctx.fillStyle = seen.transfer ? "rgba(109,40,217,0.55)" : "rgba(30,27,75,0.8)";
 ctx.fill();
 ctx.strokeStyle = "rgba(196,181,253,0.6)";
 ctx.stroke();
 drawBohr(ctx, left.x - 36, left.y, [1], t, { scale: 0.45, symbol: "Na" });
 drawBohr(ctx, left.x + 36, left.y, [7], t, { scale: 0.45, symbol: "Cl" });
 ctx.fillStyle = "#e9d5ff";
 ctx.font = "700 12px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.fillText("Option A: Transfer", left.x, left.y + 38);
 roundRect(ctx, right.x - 90, right.y - 48, 180, 96, 14);
 ctx.fillStyle = seen.share ? "rgba(14,116,144,0.55)" : "rgba(30,27,75,0.8)";
 ctx.fill();
 ctx.stroke();
 drawSharedCloud(ctx, right.x - 28, right.y - 8, right.x + 28, right.y - 8, 1, 0.5);
 ctx.fillStyle = "#e9d5ff";
 ctx.fillText("Option B: Share", right.x, right.y + 38);
 hits.push({ id: "p-a", shape: "rect", x: left.x, y: left.y, w: 180, h: 96, meta: { action: "path", id: "transfer" } });
 hits.push({ id: "p-b", shape: "rect", x: right.x, y: right.y, w: 180, h: 96, meta: { action: "path", id: "share" } });
 drawLabel(ctx, "Transfer → ionic bond. Share → covalent bond.", w * 0.5, 26, {
 font: "600 12px Segoe UI, sans-serif",
 h: 28,
 });
 }
 setHitRegions(hits);
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("bondHandoff", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 setDescription("Drag Sodium's outer electron onto Chlorine, then snap them together.");
 setIntentHandler((intent) => {
 const w = api.width;
 const h = api.height;
 const nay = h * 0.48;
 const cly = h * 0.48;
 const nax = (chemLabState.bondNaX || 0.3) * w;
 const clx = (chemLabState.bondClX || 0.7) * w;
 if (intent.type === "CANVAS_DOWN") {
 if (!chemLabState.bondHandoff && intent.meta?.action === "e") chemLabState.bondDrag = "e";
 else if (chemLabState.bondHandoff && !chemLabState.bondSnapPair && intent.meta?.action === "na") chemLabState.bondDrag = "na";
 else if (chemLabState.bondHandoff && !chemLabState.bondSnapPair && intent.meta?.action === "cl") chemLabState.bondDrag = "cl";
 }
 if (intent.type === "CANVAS_DRAG" && chemLabState.bondDrag === "e") {
 chemLabState.bondEx = intent.x / w;
 chemLabState.bondEy = intent.y / h;
 }
 if (intent.type === "CANVAS_DRAG" && chemLabState.bondDrag === "na") chemLabState.bondNaX = Math.max(0.12, Math.min(0.88, intent.x / w));
 if (intent.type === "CANVAS_DRAG" && chemLabState.bondDrag === "cl") chemLabState.bondClX = Math.max(0.12, Math.min(0.88, intent.x / w));
 if (intent.type === "CANVAS_UP") {
 if (chemLabState.bondDrag === "e") {
 const ex = (chemLabState.bondEx ?? 0.3) * w;
 const ey = (chemLabState.bondEy ?? 0.48) * h;
 if (Math.hypot(ex - clx, ey - cly) < 70) {
 chemLabState.bondHandoff = true;
 chemLabState.bondEx = null;
 chemLabState.bondEy = null;
 pulseSuccessFeedback(360);
 } else {
 chemLabState.bondEx = null;
 chemLabState.bondEy = null;
 }
 }
 if ((chemLabState.bondDrag === "na" || chemLabState.bondDrag === "cl") && chemLabState.bondHandoff) {
 const dx = Math.abs((chemLabState.bondNaX || 0.3) - (chemLabState.bondClX || 0.7)) * w;
 if (dx < 92) {
 chemLabState.bondSnapPair = true;
 chemLabState.bondNaX = 0.42;
 chemLabState.bondClX = 0.58;
 pulseSuccessFeedback(400);
 }
 }
 chemLabState.bondDrag = "";
 void nay;
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = performance.now() / 1000;
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 const done = chemLabState.bondHandoff;
 const snap = chemLabState.bondSnapPair;
 const nax = (chemLabState.bondNaX || 0.3) * w;
 const clx = (chemLabState.bondClX || 0.7) * w;
 const y = h * 0.48;
 if (done && !snap) {
 ctx.strokeStyle = "rgba(251,191,36,0.35)";
 ctx.lineWidth = 2;
 for (let i = 0; i < 5; i++) {
 const a = t * 2 + i;
 ctx.beginPath();
 ctx.ellipse((nax + clx) / 2, y, 40 + i * 10, 18 + i * 4, 0, 0, Math.PI * 2);
 ctx.stroke();
 void a;
 }
 }
 if (snap) {
 ctx.strokeStyle = "rgba(167,139,250,0.85)";
 ctx.lineWidth = 4;
 ctx.beginPath();
 ctx.moveTo(nax + 34, y);
 ctx.lineTo(clx - 34, y);
 ctx.stroke();
 }
 drawBohr(ctx, nax, y, done ? [2, 8] : [2, 8, chemLabState.bondDrag === "e" || chemLabState.bondEx != null ? 0 : 1], t, {
 symbol: "Na",
 scale: done ? 0.82 : 1,
 charge: done ? "+" : "",
 glow: done,
 });
 drawBohr(ctx, clx, y, done ? [2, 8, 8] : [2, 8, 7], t, {
 symbol: "Cl",
 scale: done ? 1.12 : 1,
 charge: done ? "−" : "",
 glow: done,
 });
 const hits = [];
 if (!done) {
 const homeX = nax + 46;
 const homeY = y - 18;
 const ex = chemLabState.bondEx != null ? chemLabState.bondEx * w : homeX;
 const ey = chemLabState.bondEy != null ? chemLabState.bondEy * h : homeY;
 drawElectron(ctx, ex, ey, 7, "#fde68a");
 hits.push({ id: "e-na", shape: "ellipse", x: ex, y: ey, r: 22, meta: { action: "e" } });
 drawLabel(ctx, "Drag Sodium's lonely electron onto Chlorine.", w * 0.5, 26, { font: "600 12px Segoe UI, sans-serif", h: 28 });
 } else if (!snap) {
 hits.push({ id: "na", shape: "ellipse", x: nax, y: y, r: 56, meta: { action: "na" } });
 hits.push({ id: "cl", shape: "ellipse", x: clx, y: y, r: 62, meta: { action: "cl" } });
 drawLabel(ctx, "Sodium: gave 1 electron away → now Na⁺. Chlorine: received 1 → now Cl⁻.", w * 0.5, 26, {
 font: "600 11px Segoe UI, sans-serif",
 h: 28,
 });
 drawLabel(ctx, "Opposite charges attract. Drag them close until they snap.", w * 0.5, h - 28, {
 font: "600 12px Segoe UI, sans-serif",
 h: 26,
 });
 } else {
 drawLabel(ctx, "That attraction is the ionic bond. You built the glue.", w * 0.5, 26);
 }
 setHitRegions(hits);
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("bondLattice", (api) => {
 const { ctx, setTick, setDispose, setDescription, setIntentHandler } = api;
 setDescription("Ionic pairs stack into a crystal lattice.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DRAG") {
 chemLabState.bondLatShake = 10;
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = performance.now() / 1000;
 const phase = chemLabState.bondPhase || "lattice";
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 if (phase === "words") {
 drawBohr(ctx, w * 0.32, h * 0.42, [2, 8], t, { symbol: "Na", charge: "+", scale: 0.9, glow: true });
 drawBohr(ctx, w * 0.68, h * 0.42, [2, 8, 8], t, { symbol: "Cl", charge: "−", scale: 1.05, glow: true });
 drawLabel(ctx, "Ion: an atom that gained or lost electrons (Na⁺, Cl⁻)", w * 0.5, 26, {
 font: "600 12px Segoe UI, sans-serif",
 h: 28,
 });
 drawLabel(ctx, "Ionic bond: attraction of opposite charges. Formula NaCl, a 1:1 ratio.", w * 0.5, h - 28, {
 font: "600 12px Segoe UI, sans-serif",
 h: 28,
 });
 } else {
 const shake = chemLabState.bondLatShake || 0;
 if (shake > 0) chemLabState.bondLatShake = shake * 0.9;
 const rot = t * 0.45;
 const cx = w * 0.5 + Math.sin(t * 8) * Math.min(shake, 4);
 const cy = h * 0.46;
 const s = Math.min(w, h) * 0.09;
 const cells = [];
 for (let i = 0; i < 3; i++) {
 for (let j = 0; j < 3; j++) {
 for (let k = 0; k < 3; k++) {
 const c = Math.cos(rot);
 const si = Math.sin(rot);
 const x = (i - 1) * s;
 const z = (k - 1) * s;
 const xr = x * c - z * si;
 const zr = x * si + z * c;
 const y = (j - 1) * s;
 cells.push({
 x: cx + xr * 0.9 - y * 0.18,
 y: cy + zr * 0.38 + y * 0.7,
 z: zr,
 na: (i + j + k) % 2 === 0,
 });
 }
 }
 }
 cells.sort((a, b) => a.z - b.z);
 cells.forEach((c) => {
 ctx.fillStyle = c.na ? "#c4b5fd" : "#6ee7b7";
 ctx.beginPath();
 ctx.arc(c.x, c.y, c.na ? 7 : 9, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#0f172a";
 ctx.font = "700 8px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(c.na ? "+" : "−", c.x, c.y + 1);
 });
 const grain = Math.min(1, Math.max(0, t / 4 - 0.4));
 if (grain > 0) {
 ctx.globalAlpha = grain * 0.85;
 ctx.fillStyle = "#e7e5e4";
 roundRect(ctx, w * 0.72, h * 0.62, 70, 54, 8);
 ctx.fill();
 ctx.fillStyle = "#a8a29e";
 ctx.fillRect(w * 0.74, h * 0.64, 20, 16);
 ctx.globalAlpha = 1;
 drawLabel(ctx, "table salt", w * 0.8, h * 0.86, { h: 20, font: "600 11px Segoe UI, sans-serif" });
 }
 drawLabel(ctx, "One ionic bond does not stop at a pair. It repeats in every direction.", w * 0.5, 26, {
 font: "600 12px Segoe UI, sans-serif",
 h: 28,
 });
 }
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("bondShare", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 setDescription("Hydrogen will not give the electron away. Overlap to share.");
 setIntentHandler((intent) => {
 const w = api.width;
 const h = api.height;
 const y = h * 0.48;
 const x0 = (chemLabState.bondH0 || 0.3) * w;
 const x1 = (chemLabState.bondH1 || 0.7) * w;
 if (intent.type === "CANVAS_DOWN") {
 if (!chemLabState.bondHTried && intent.meta?.action === "e") chemLabState.bondDrag = "e";
 else if (chemLabState.bondHTried && !chemLabState.bondHShare && intent.meta?.action === "h0") chemLabState.bondDrag = "h0";
 else if (chemLabState.bondHTried && !chemLabState.bondHShare && intent.meta?.action === "h1") chemLabState.bondDrag = "h1";
 }
 if (intent.type === "CANVAS_DRAG" && chemLabState.bondDrag === "e") {
 chemLabState.bondEx = intent.x / w;
 chemLabState.bondEy = intent.y / h;
 }
 if (intent.type === "CANVAS_DRAG" && chemLabState.bondDrag === "h0") chemLabState.bondH0 = Math.max(0.12, Math.min(0.8, intent.x / w));
 if (intent.type === "CANVAS_DRAG" && chemLabState.bondDrag === "h1") chemLabState.bondH1 = Math.max(0.2, Math.min(0.88, intent.x / w));
 if (intent.type === "CANVAS_UP") {
 if (chemLabState.bondDrag === "e") {
 const ex = (chemLabState.bondEx ?? 0.3) * w;
 const ey = (chemLabState.bondEy ?? 0.48) * h;
 if (Math.hypot(ex - x1, ey - y) < 64) {
 chemLabState.bondHTried = true;
 chemLabState.bondEx = null;
 chemLabState.bondEy = null;
 pulseFailFeedback(420);
 } else {
 chemLabState.bondEx = null;
 chemLabState.bondEy = null;
 }
 }
 if ((chemLabState.bondDrag === "h0" || chemLabState.bondDrag === "h1") && chemLabState.bondHTried) {
 const gap = Math.abs((chemLabState.bondH0 || 0.3) - (chemLabState.bondH1 || 0.7)) * w;
 if (gap < 78) {
 chemLabState.bondHShare = true;
 chemLabState.bondH0 = 0.44;
 chemLabState.bondH1 = 0.56;
 pulseSuccessFeedback(380);
 }
 }
 chemLabState.bondDrag = "";
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = performance.now() / 1000;
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 const x0 = (chemLabState.bondH0 || 0.3) * w;
 const x1 = (chemLabState.bondH1 || 0.7) * w;
 const y = h * 0.48;
 const share = chemLabState.bondHShare;
 const tried = chemLabState.bondHTried;
 if (share) drawSharedCloud(ctx, x0, y, x1, y, 1, 0.5);
 drawBohr(ctx, x0, y, [share ? 2 : 1], t, { symbol: "H", scale: 0.95, glow: share, jitter: !share });
 drawBohr(ctx, x1, y, [share ? 2 : 1], t + 0.4, { symbol: "H", scale: 0.95, glow: share, jitter: !share });
 const hits = [];
 if (!tried) {
 const homeX = x0 + 32;
 const homeY = y - 10;
 const ex = chemLabState.bondEx != null ? chemLabState.bondEx * w : homeX;
 const ey = chemLabState.bondEy != null ? chemLabState.bondEy * h : homeY;
 drawElectron(ctx, ex, ey, 7, "#fde68a");
 hits.push({ id: "e-h", shape: "ellipse", x: ex, y: ey, r: 22, meta: { action: "e" } });
 drawLabel(ctx, "Try dragging one Hydrogen's electron fully onto the other, like Sodium.", w * 0.5, 26, {
 font: "600 11px Segoe UI, sans-serif",
 h: 28,
 });
 } else if (!share) {
 hits.push({ id: "h0", shape: "ellipse", x: x0, y: y, r: 52, meta: { action: "h0" } });
 hits.push({ id: "h1", shape: "ellipse", x: x1, y: y, r: 52, meta: { action: "h1" } });
 drawLabel(ctx, "Both atoms want to keep this electron. Try overlapping them instead of transferring.", w * 0.5, 26, {
 font: "600 11px Segoe UI, sans-serif",
 h: 32,
 });
 } else {
 drawLabel(ctx, "Neither atom gave anything away. Both count the same shared pair as their own.", w * 0.5, 26, {
 font: "600 12px Segoe UI, sans-serif",
 h: 32,
 });
 }
 setHitRegions(hits);
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("bondPairs", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 let pull = 0;
 setDescription("Single, double, and triple shared pairs.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "mol") {
 chemLabState.bondGallery = intent.meta.i;
 pulseSuccessFeedback(160);
 }
 if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "pull") {
 pull = Math.min(48, Math.abs(intent.x - api.width * 0.5) * 0.25);
 }
 if (intent.type === "CANVAS_UP") pull *= 0.2;
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = performance.now() / 1000;
 const phase = chemLabState.bondPhase || "gallery";
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 const hits = [];
 if (phase === "lewis") {
 const ox = w * 0.5;
 const oy = h * 0.46;
 drawLewis(ctx, ox, oy, "O", 0, 1.5);
 drawLewis(ctx, ox - 70, oy + 36, "H", 0, 1.2);
 drawLewis(ctx, ox + 70, oy + 36, "H", 0, 1.2);
 ctx.strokeStyle = "#e9d5ff";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.moveTo(ox - 16, oy + 8);
 ctx.lineTo(ox - 52, oy + 28);
 ctx.moveTo(ox + 16, oy + 8);
 ctx.lineTo(ox + 52, oy + 28);
 ctx.stroke();
 drawElectron(ctx, ox - 10, oy - 28, 3.4);
 drawElectron(ctx, ox + 10, oy - 28, 3.4);
 drawElectron(ctx, ox + 28, oy - 8, 3.4);
 drawElectron(ctx, ox + 28, oy + 8, 3.4);
 drawSharedCloud(ctx, ox - 8, oy + 6, ox - 48, oy + 28, 1, 0.62);
 drawSharedCloud(ctx, ox + 8, oy + 6, ox + 48, oy + 28, 1, 0.38);
 drawLabel(ctx, "Covalent bond: sharing a pair. Lines = bonding pairs. Dots = lone pairs.", w * 0.5, 26, {
 font: "600 11px Segoe UI, sans-serif",
 h: 30,
 });
 drawLabel(ctx, "In H₂O, oxygen pulls the shared electrons closer than hydrogen does.", w * 0.5, h - 28, {
 font: "600 12px Segoe UI, sans-serif",
 h: 26,
 });
 } else {
 const mols = [
 { i: 0, label: "H₂", sub: "1 shared pair = single bond", pairs: 1, k: 0.55 },
 { i: 1, label: "O₂", sub: "2 shared pairs = double bond", pairs: 2, k: 0.32 },
 { i: 2, label: "N₂", sub: "3 shared pairs = triple bond", pairs: 3, k: 0.18 },
 ];
 const sel = chemLabState.bondGallery || 0;
 mols.forEach((m, idx) => {
 const cx = w * (0.22 + idx * 0.28);
 const cy = h * 0.46;
 const gap = 34 + pull * m.k;
 roundRect(ctx, cx - 70, cy - 78, 140, 150, 14);
 ctx.fillStyle = sel === idx ? "rgba(109,40,217,0.4)" : "rgba(30,27,75,0.55)";
 ctx.fill();
 ctx.strokeStyle = "rgba(196,181,253,0.45)";
 ctx.stroke();
 drawSharedCloud(ctx, cx - gap, cy, cx + gap, cy, m.pairs, 0.5);
 drawBohr(ctx, cx - gap, cy, m.i === 0 ? [1] : [2, m.i === 1 ? 6 : 5], t, {
 symbol: m.label[0],
 scale: 0.55,
 glow: true,
 });
 drawBohr(ctx, cx + gap, cy, m.i === 0 ? [1] : [2, m.i === 1 ? 6 : 5], t, {
 symbol: m.label[0],
 scale: 0.55,
 glow: true,
 });
 ctx.fillStyle = "#f5f3ff";
 ctx.font = "700 13px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.fillText(m.label, cx, cy + 52);
 ctx.font = "600 10px Segoe UI, sans-serif";
 ctx.fillStyle = "#c4b5fd";
 ctx.fillText(m.sub, cx, cy + 66);
 hits.push({ id: `mol-${idx}`, shape: "rect", x: cx, y: cy, w: 140, h: 150, meta: { action: "mol", i: idx } });
 });
 hits.push({ id: "pull", shape: "rect", x: w * 0.5, y: h * 0.46, w: w * 0.9, h: 160, meta: { action: "pull" } });
 drawLabel(ctx, "Each extra shared pair makes the bond stronger and shorter. Drag to tug.", w * 0.5, 26, {
 font: "600 12px Segoe UI, sans-serif",
 h: 28,
 });
 pull *= 0.92;
 }
 setHitRegions(hits);
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("bondTug", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 setDescription("Electronegativity tug-of-war. Place the marker on the spectrum.");
 setIntentHandler((intent) => {
 const w = api.width;
 const barX0 = w * 0.12;
 const barW = w * 0.76;
 if (intent.type === "CANVAS_DOWN" && intent.meta?.action === "mark") chemLabState.bondDrag = "mark";
 if (intent.type === "CANVAS_DRAG" && chemLabState.bondDrag === "mark") {
 chemLabState.bondTugX = Math.max(0, Math.min(1, (intent.x - barX0) / barW));
 }
 if (intent.type === "CANVAS_UP" && chemLabState.bondDrag === "mark") {
 const i = chemLabState.bondTugI || 0;
 const pair = TUGS[i];
 const x = chemLabState.bondTugX ?? 0.5;
 if (pair && Math.abs(x - pair.target) < 0.16) {
 chemLabState.bondTugX = pair.target;
 const hits = { ...(chemLabState.bondTugHits || {}) };
 hits[pair.id] = true;
 chemLabState.bondTugHits = hits;
 chemLabState.bondTugHoldUntil = performance.now() + 900;
 pulseSuccessFeedback(320);
 } else {
 pulseFailFeedback(360);
 }
 chemLabState.bondDrag = "";
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = performance.now() / 1000;
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 const i = Math.min(2, chemLabState.bondTugI || 0);
 const hitsMap = chemLabState.bondTugHits || {};
 const done = hitsMap.hh && hitsMap.hcl && hitsMap.nacl;
 const hold = chemLabState.bondTugHoldUntil || 0;
 if (hold && performance.now() > hold && hitsMap[TUGS[i].id] && i < 2) {
 chemLabState.bondTugI = i + 1;
 chemLabState.bondTugX = 0.5;
 chemLabState.bondTugHoldUntil = 0;
 }
 const pair = TUGS[Math.min(2, chemLabState.bondTugI || 0)];
 const y = h * 0.4;
 const xL = w * 0.28;
 const xR = w * 0.72;
 drawBohr(ctx, xL, y, pair.a === "Na" ? [2, 8, 1] : [pair.a === "Cl" ? 7 : 1], t, { symbol: pair.a, scale: 0.85 });
 drawBohr(ctx, xR, y, pair.b === "Cl" ? [2, 8, 7] : [1], t, { symbol: pair.b, scale: 0.85 });
 const pull = pair.id === "nacl" && hitsMap.nacl ? 0.98 : pair.pull;
 drawSharedCloud(ctx, xL + 30, y, xR - 30, y, 1, pull);
 ctx.fillStyle = "#c4b5fd";
 ctx.font = "700 12px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.fillText(pair.a === pair.b ? "even tug" : pair.b + " pulls harder", w * 0.5, y + 70);
 const barX0 = w * 0.12;
 const barY = h * 0.78;
 const barW = w * 0.76;
 roundRect(ctx, barX0, barY - 10, barW, 20, 8);
 const g = ctx.createLinearGradient(barX0, 0, barX0 + barW, 0);
 g.addColorStop(0, "#67e8f9");
 g.addColorStop(0.45, "#a78bfa");
 g.addColorStop(1, "#f59e0b");
 ctx.fillStyle = g;
 ctx.fill();
 ctx.fillStyle = "#e9d5ff";
 ctx.font = "600 11px Segoe UI, sans-serif";
 ctx.textAlign = "left";
 ctx.fillText("Equal sharing", barX0, barY - 20);
 ctx.textAlign = "right";
 ctx.fillText("Complete transfer", barX0 + barW, barY - 20);
 const mx = barX0 + (chemLabState.bondTugX ?? 0.5) * barW;
 ctx.fillStyle = "#f5f3ff";
 ctx.beginPath();
 ctx.moveTo(mx, barY - 18);
 ctx.lineTo(mx - 8, barY - 4);
 ctx.lineTo(mx + 8, barY - 4);
 ctx.closePath();
 ctx.fill();
 ctx.beginPath();
 ctx.arc(mx, barY, 9, 0, Math.PI * 2);
 ctx.fill();
 if (hitsMap[pair.id] || done) {
 drawLabel(ctx, `Correct. ${pair.type}, based on how one-sided the pull was.`, w * 0.5, 26, {
 font: "600 12px Segoe UI, sans-serif",
 h: 28,
 });
 } else {
 drawLabel(ctx, `${pair.a}-${pair.b}: drag the marker to where the tug belongs.`, w * 0.5, 26, {
 font: "600 12px Segoe UI, sans-serif",
 h: 28,
 });
 }
 const hits = [{ id: "mark", shape: "rect", x: barX0 + barW / 2, y: barY, w: barW, h: 52, meta: { action: "mark" } }];
 setHitRegions(hits);
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("bondMaterials", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 setDescription("Bond type decides how a material behaves.");
 setIntentHandler((intent) => {
 if (intent.type !== "CANVAS_TAP") return;
 if (intent.meta?.action === "shatter") {
 chemLabState.bondShatter = true;
 pulseSuccessFeedback(200);
 }
 if (intent.meta?.action === "dissolve") chemLabState.bondDissolve = true;
 if (intent.meta?.action === "melt") {
 chemLabState.bondMelt = true;
 pulseSuccessFeedback(200);
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = performance.now() / 1000;
 const phase = chemLabState.bondPhase || "mats";
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 const hits = [];
 if (phase === "den") {
 const barX0 = w * 0.12;
 const barY = h * 0.42;
 const barW = w * 0.76;
 roundRect(ctx, barX0, barY - 10, barW, 20, 8);
 const g = ctx.createLinearGradient(barX0, 0, barX0 + barW, 0);
 g.addColorStop(0, "#67e8f9");
 g.addColorStop(0.45, "#a78bfa");
 g.addColorStop(1, "#f59e0b");
 ctx.fillStyle = g;
 ctx.fill();
 ctx.fillStyle = "#f5f3ff";
 ctx.font = "700 13px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.fillText("ΔEN 0-0.4  nonpolar covalent", w * 0.5, barY + 36);
 ctx.fillText("ΔEN 0.4-1.7  polar covalent", w * 0.5, barY + 56);
 ctx.fillText("ΔEN 1.7+  ionic", w * 0.5, barY + 76);
 drawLabel(ctx, "Electronegativity: how strongly an atom pulls on shared electrons", w * 0.5, 26, {
 font: "600 12px Segoe UI, sans-serif",
 h: 28,
 });
 drawLabel(ctx, "These numbers are a useful map, not strict walls. Bonding is a spectrum.", w * 0.5, h - 28, {
 font: "600 12px Segoe UI, sans-serif",
 h: 28,
 });
 } else {
 const cols = [
 { x: w * 0.22, title: "Salt (ionic)", id: "shatter" },
 { x: w * 0.5, title: "Sugar (covalent)", id: "melt" },
 { x: w * 0.78, title: "Metal (preview)", id: "metal" },
 ];
 cols.forEach((c, idx) => {
 roundRect(ctx, c.x - 70, h * 0.22, 140, h * 0.52, 14);
 ctx.fillStyle = "rgba(30,27,75,0.7)";
 ctx.fill();
 ctx.strokeStyle = "rgba(196,181,253,0.4)";
 ctx.stroke();
 ctx.fillStyle = "#e9d5ff";
 ctx.font = "700 12px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.fillText(c.title, c.x, h * 0.28);
 if (idx === 0) {
 const sh = chemLabState.bondShatter;
 ctx.fillStyle = "#e7e5e4";
 if (!sh) {
 roundRect(ctx, c.x - 28, h * 0.4, 56, 56, 4);
 ctx.fill();
 } else {
 roundRect(ctx, c.x - 40, h * 0.38, 28, 40, 2);
 ctx.fill();
 roundRect(ctx, c.x + 4, h * 0.46, 30, 36, 2);
 ctx.fill();
 }
 if (chemLabState.bondDissolve) {
 for (let k = 0; k < 6; k++) {
 ctx.fillStyle = k % 2 ? "#c4b5fd" : "#6ee7b7";
 ctx.beginPath();
 ctx.arc(c.x - 24 + k * 10, h * 0.62 + Math.sin(t * 3 + k) * 6, 4, 0, Math.PI * 2);
 ctx.fill();
 }
 ctx.strokeStyle = "#fbbf24";
 ctx.lineWidth = 2;
 ctx.strokeRect(c.x - 30, h * 0.68, 60, 18);
 }
 hits.push({ id: "sh", shape: "rect", x: c.x, y: h * 0.48, w: 140, h: 120, meta: { action: "shatter" } });
 hits.push({ id: "dis", shape: "rect", x: c.x, y: h * 0.7, w: 80, h: 28, meta: { action: "dissolve" } });
 ctx.fillStyle = "#a5b4fc";
 ctx.font = "600 10px Segoe UI, sans-serif";
 ctx.fillText(sh ? "Tap again to dissolve" : "Tap to shatter", c.x, h * 0.7);
 } else if (idx === 1) {
 ctx.fillStyle = chemLabState.bondMelt ? "#fde68a" : "#fef3c7";
 if (chemLabState.bondMelt) {
 ctx.beginPath();
 ctx.ellipse(c.x, h * 0.52, 36, 18, 0, 0, Math.PI * 2);
 ctx.fill();
 } else {
 roundRect(ctx, c.x - 22, h * 0.42, 44, 44, 6);
 ctx.fill();
 }
 ctx.fillStyle = "#a5b4fc";
 ctx.font = "600 10px Segoe UI, sans-serif";
 ctx.fillText(chemLabState.bondMelt ? "melts, does not conduct" : "Tap to melt", c.x, h * 0.7);
 hits.push({ id: "melt", shape: "rect", x: c.x, y: h * 0.48, w: 140, h: 120, meta: { action: "melt" } });
 } else {
 ctx.fillStyle = "#94a3b8";
 roundRect(ctx, c.x - 30, h * 0.44, 60, 18, 4);
 ctx.fill();
 ctx.fillStyle = "#cbd5e1";
 roundRect(ctx, c.x - 26, h * 0.5, 52, 14, 4);
 ctx.fill();
 ctx.fillStyle = "#a5b4fc";
 ctx.font = "600 10px Segoe UI, sans-serif";
 ctx.fillText("bends, conducts as a solid", c.x, h * 0.66);
 ctx.fillText("metallic bonding: another day", c.x, h * 0.72);
 }
 });
 drawLabel(ctx, "How atoms bond decides how the whole material behaves.", w * 0.5, 26, {
 font: "600 12px Segoe UI, sans-serif",
 h: 28,
 });
 }
 setHitRegions(hits);
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("bondClose", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 const start = performance.now();
 setDescription("Every bond has a reason.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 chemLabState.bondCloseU = Math.min(1, t / 3.2);
 chemLabState.scale = chemLabState.bondCloseU;
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 drawBohr(ctx, w * 0.22, h * 0.38, [2, 8], t, { symbol: "Na", charge: "+", scale: 0.7, glow: true });
 drawBohr(ctx, w * 0.38, h * 0.38, [2, 8, 8], t, { symbol: "Cl", charge: "−", scale: 0.8, glow: true });
 drawSharedCloud(ctx, w * 0.58, h * 0.4, w * 0.78, h * 0.4, 1, 0.5);
 drawBohr(ctx, w * 0.58, h * 0.4, [2], t, { symbol: "H", scale: 0.55, glow: true });
 drawBohr(ctx, w * 0.78, h * 0.4, [2], t, { symbol: "H", scale: 0.55, glow: true });
 drawH2O(ctx, w * 0.5, h * 0.68, 2.2, Math.sin(t) * 0.1);
 drawLabel(ctx, "Give an electron away, or share one. Salt, water, and the air you breathe.", w * 0.5, 26, {
 font: "600 12px Segoe UI, sans-serif",
 h: 30,
 });
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("bondSpiral", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const start = performance.now();
 const stops = [
 { id: 1, label: "1 Why bond", caption: "Spiral 1: full outer shell, stability" },
 { id: 2, label: "2 Ionic", caption: "Spiral 2: give and take, then a crystal" },
 { id: 3, label: "3 Covalent", caption: "Spiral 3: share instead of giving" },
 { id: 4, label: "4 Spectrum", caption: "Spiral 4: one tug-of-war, every bond type" },
 ];
 setDescription("Recap map of the four Bond Buddies spirals.");
 setIntentHandler((intent) => {
 if (intent.type !== "CANVAS_TAP") return;
 if (intent.meta?.action === "spiral") {
 chemLabState.spiralStop = Number(intent.meta.stop) || 0;
 chemLabState.spiralUntil = performance.now() + 4500;
 }
 if (intent.meta?.action === "spiralFinish") chemLabState.spiralFinish = true;
 });
 function polar(s, w, h) {
 const cx = w * 0.5;
 const cy = Math.min(h * 0.44, h - 118);
 const maxR = Math.min(w * 0.36, Math.max(70, h - 140) * 0.42, 150);
 const a = -0.55 + s * 1.28;
 const r = maxR * (0.55 + s * 0.15);
 return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, a, cx, cy };
 }
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 const stop = chemLabState.spiralStop || 0;
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 const origin = polar(0, w, h);
 ctx.strokeStyle = "rgba(167,139,250,0.55)";
 ctx.lineWidth = 3;
 ctx.beginPath();
 for (let s = 0; s <= 3.02; s += 0.04) {
 const p = polar(s, w, h);
 if (s === 0) ctx.moveTo(p.x, p.y);
 else ctx.lineTo(p.x, p.y);
 }
 ctx.stroke();
 ctx.beginPath();
 ctx.arc(origin.cx, origin.cy, 48, 0, Math.PI * 2);
 ctx.fillStyle = "rgba(46,16,80,0.55)";
 ctx.fill();
 if (stop === 1) drawBohr(ctx, origin.cx, origin.cy, [2, 8, 1], t, { symbol: "?", scale: 0.45, jitter: true });
 if (stop === 2) {
 drawBohr(ctx, origin.cx - 16, origin.cy, [2, 8], t, { symbol: "Na", scale: 0.32, charge: "+" });
 drawBohr(ctx, origin.cx + 16, origin.cy, [2, 8, 8], t, { symbol: "Cl", scale: 0.36, charge: "−" });
 }
 if (stop === 3) {
 drawSharedCloud(ctx, origin.cx - 18, origin.cy, origin.cx + 18, origin.cy, 1, 0.5);
 drawBohr(ctx, origin.cx - 18, origin.cy, [2], t, { symbol: "H", scale: 0.28 });
 drawBohr(ctx, origin.cx + 18, origin.cy, [2], t, { symbol: "H", scale: 0.28 });
 }
 if (stop === 4) {
 roundRect(ctx, origin.cx - 36, origin.cy - 6, 72, 12, 6);
 const g = ctx.createLinearGradient(origin.cx - 36, 0, origin.cx + 36, 0);
 g.addColorStop(0, "#67e8f9");
 g.addColorStop(1, "#f59e0b");
 ctx.fillStyle = g;
 ctx.fill();
 }
 const hits = [];
 stops.forEach((s, i) => {
 const p = polar(i, w, h);
 ctx.fillStyle = stop === s.id ? "#c4b5fd" : "#7c3aed";
 ctx.beginPath();
 ctx.arc(p.x, p.y, 22, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#f5f3ff";
 ctx.font = "800 16px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(String(s.id), p.x, p.y);
 const lx = Math.min(w - 70, Math.max(70, p.x + Math.cos(p.a) * 42));
 const ly = Math.min(h - 88, Math.max(58, p.y + Math.sin(p.a) * 36));
 drawLabel(ctx, s.label, lx, ly, { font: "600 12px Segoe UI, sans-serif", h: 22 });
 hits.push({ id: `stop-${s.id}`, shape: "ellipse", x: p.x, y: p.y, r: 36, meta: { action: "spiral", stop: s.id } });
 });
 drawLabel(ctx, stop ? stops[stop - 1].caption : "Your four spirals. Tap a number, then Finish Bond Buddies.", w * 0.5, 28, {
 h: 32,
 font: "700 13px Segoe UI, sans-serif",
 });
 const fx = w * 0.5;
 const fy = h - 34;
 const fw = Math.min(280, w * 0.76);
 roundRect(ctx, fx - fw / 2, fy - 22, fw, 44, 12);
 ctx.fillStyle = "#6d28d9";
 ctx.fill();
 ctx.fillStyle = "#f5f3ff";
 ctx.font = "800 16px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText("Finish Bond Buddies", fx, fy);
 hits.push({ id: "spiral-finish", shape: "rect", x: fx, y: fy, w: fw, h: 44, meta: { action: "spiralFinish" } });
 setHitRegions(hits);
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 if (typeof arena.registerAlias === "function") {
 arena.registerAlias("bondMeet", "bondOpen");
 arena.registerAlias("bondMagnet", "bondHandoff");
 arena.registerAlias("bondSort", "bondMood");
 arena.registerAlias("bondSnap", "bondHandoff");
 arena.registerAlias("bondWater", "bondShare");
 arena.registerAlias("bondRule", "bondPaths");
 arena.registerAlias("bondStretch", "bondPairs");
 arena.registerAlias("bondMyth", "bondTug");
 arena.registerAlias("bondDrill", "bondMaterials");
 arena.registerAlias("bondMastery", "bondSpiral");
 }
}

export const BOND_ASSET_PATHS = {
 buddies: "/games/chemistry-lab/assets/bond-buddies.svg",
 magnet: "/games/chemistry-lab/assets/magnet-snap.svg",
 water: "/games/chemistry-lab/assets/water-h2o.svg",
 rule: "/games/chemistry-lab/assets/bond-rule.svg",
 magnify: "/games/chemistry-lab/assets/bond-magnify.svg",
 sugar: "/games/chemistry-lab/assets/sugar-bonds.svg",
 plastic: "/games/chemistry-lab/assets/plastic-chain.svg",
 protein: "/games/chemistry-lab/assets/protein-fold.svg",
 orbit: "/games/chemistry-lab/assets/atom-orbit.svg",
 myth: "/games/chemistry-lab/assets/myth-bust.svg",
};
