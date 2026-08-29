/**
 * Force Fighter Mission 1: The Lazy Rock
 * Script: Opening + 4 Bruner spirals (stillness → inertia → Newton 1 → why it matters) + recap.
 * Canvas 2D. The same boulder character is reused in every spiral.
 */
import { forceLabState, pulseFailFeedback, pulseSuccessFeedback } from "./force-state.js?v=pairvis6";

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
 const bw = Math.min(opts.maxW || 9999, tw + 22);
 const bh = opts.h || 26;
 ctx.fillStyle = opts.bg || "rgba(41,37,36,0.9)";
 roundRect(ctx, x - bw / 2, y - bh / 2, bw, bh, 10);
 ctx.fill();
 ctx.strokeStyle = opts.border || "rgba(251,191,36,0.5)";
 ctx.lineWidth = 1.4;
 ctx.stroke();
 ctx.fillStyle = opts.color || "#fef3c7";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(text, x, y + 1);
}

function failShake() {
 const until = forceLabState.failPulse;
 if (!until || performance.now() > until) return 0;
 return Math.sin(performance.now() * 0.08) * 5;
}

function failFlash(ctx, w, h) {
 const until = forceLabState.failPulse;
 if (!until || performance.now() > until) return;
 const a = Math.max(0, (until - performance.now()) / 420) * 0.28;
 ctx.fillStyle = `rgba(248,113,113,${a})`;
 ctx.fillRect(0, 0, w, h);
}

function successFlash(ctx, w, h) {
 const until = forceLabState.successPulse;
 if (!until || performance.now() > until) return;
 const a = Math.max(0, (until - performance.now()) / 380) * 0.22;
 ctx.fillStyle = `rgba(251,191,36,${a})`;
 ctx.fillRect(0, 0, w, h);
}

function fillSkyGrass(ctx, w, h, t = 0) {
 const g = ctx.createLinearGradient(0, 0, 0, h);
 g.addColorStop(0, "#7dd3fc");
 g.addColorStop(0.55, "#bae6fd");
 g.addColorStop(0.56, "#4ade80");
 g.addColorStop(1, "#166534");
 ctx.fillStyle = g;
 ctx.fillRect(0, 0, w, h);
 const ground = h * 0.62;
 ctx.fillStyle = "#15803d";
 ctx.fillRect(0, ground, w, h - ground);
 ctx.fillStyle = "rgba(21,128,61,0.45)";
 for (let i = 0; i < 18; i++) {
 const x = ((i * 73 + t * 8) % (w + 40)) - 20;
 ctx.fillRect(x, ground - 8, 2, 10);
 }
 ctx.fillStyle = "#0e7490";
 ctx.beginPath();
 ctx.moveTo(0, ground + 4);
 ctx.quadraticCurveTo(w * 0.1, ground + 18, 0, h * 0.92);
 ctx.closePath();
 ctx.fill();
 ctx.fillStyle = "rgba(125,211,252,0.4)";
 ctx.beginPath();
 ctx.moveTo(0, ground + 10);
 ctx.quadraticCurveTo(w * 0.07, ground + 16, 0, ground + 28);
 ctx.fill();
}

function eyeLook(opts = {}) {
 const t = performance.now() / 1000;
 const blink = !opts.sleepy && t % 3.5 > 3.28;
 const lookX = opts.lookX != null ? opts.lookX : opts.moving ? 1.7 : Math.sin(t * 0.9) * 1.35;
 const lookY = opts.lookY != null ? opts.lookY : opts.sleepy ? 0 : Math.sin(t * 0.55) * 0.35;
 return { blink, lookX, lookY, sleepy: !!opts.sleepy };
}

function drawPairEyes(ctx, y, spread, opts = {}) {
 const e = eyeLook(opts);
 const r = opts.r || 5.2;
 [-spread, spread].forEach((sx) => {
 ctx.fillStyle = "#fffbeb";
 ctx.beginPath();
 ctx.ellipse(sx, y, r, e.sleepy || e.blink ? r * 0.16 : r * 0.88, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "#1c1917";
 ctx.lineWidth = 1.2;
 ctx.stroke();
 if (e.sleepy || e.blink) {
 ctx.beginPath();
 ctx.moveTo(sx - r, y);
 ctx.quadraticCurveTo(sx, y + r * 0.7, sx + r, y);
 ctx.stroke();
 } else {
 ctx.fillStyle = "#0f172a";
 ctx.beginPath();
 ctx.arc(sx + e.lookX, y + e.lookY, r * 0.42, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#fff";
 ctx.beginPath();
 ctx.arc(sx + e.lookX - 0.7, y + e.lookY - 1.1, r * 0.15, 0, Math.PI * 2);
 ctx.fill();
 }
 });
}

function drawKid(ctx, x, y, opts = {}) {
 ctx.save();
 ctx.translate(x, y);
 const s = opts.scale || 1;
 ctx.scale(s, s);
 ctx.fillStyle = opts.shirt || "#f59e0b";
 roundRect(ctx, -7, 2, 14, 16, 4);
 ctx.fill();
 ctx.fillStyle = "#fde68a";
 ctx.beginPath();
 ctx.arc(0, -6, 8, 0, Math.PI * 2);
 ctx.fill();
 drawPairEyes(ctx, -6, 3.4, { r: 2.4, moving: opts.moving, sleepy: opts.sleepy, lookX: opts.lookX, lookY: opts.lookY });
 ctx.restore();
}

function fillIceLab(ctx, w, h, scroll = 0) {
 const g = ctx.createLinearGradient(0, 0, 0, h);
 g.addColorStop(0, "#0c4a6e");
 g.addColorStop(0.42, "#38bdf8");
 g.addColorStop(0.62, "#e0f2fe");
 g.addColorStop(1, "#bae6fd");
 ctx.fillStyle = g;
 ctx.fillRect(0, 0, w, h);
 ctx.fillStyle = "rgba(255,255,255,0.72)";
 ctx.fillRect(0, h * 0.6, w, h * 0.4);
 ctx.strokeStyle = "rgba(125,211,252,0.85)";
 ctx.lineWidth = 3;
 const shift = scroll * 40;
 for (let i = -2; i < 12; i++) {
 const x = i * (w / 8) - (shift % (w / 8));
 ctx.beginPath();
 ctx.moveTo(x, h * 0.6);
 ctx.lineTo(x + 52, h);
 ctx.stroke();
 }
 ctx.fillStyle = "rgba(255,255,255,0.9)";
 for (let i = 0; i < 16; i++) {
 const x = ((i * 47 + scroll * 12) % (w + 10)) - 5;
 ctx.beginPath();
 ctx.arc(x, h * 0.22 + (i % 4) * 16, 2.2, 0, Math.PI * 2);
 ctx.fill();
 }
}

function fillGravel(ctx, w, h, scroll = 0) {
 const g = ctx.createLinearGradient(0, 0, 0, h);
 g.addColorStop(0, "#44403c");
 g.addColorStop(0.5, "#78716c");
 g.addColorStop(1, "#a8a29e");
 ctx.fillStyle = g;
 ctx.fillRect(0, 0, w, h);
 ctx.fillStyle = "#57534e";
 ctx.fillRect(0, h * 0.6, w, h * 0.4);
 const stones = ["#a8a29e", "#d6d3d1", "#78716c", "#57534e"];
 for (let i = 0; i < 28; i++) {
 const x = ((i * 53 - scroll * 40) % (w + 24)) - 12;
 const y = h * 0.68 + (i % 5) * 12;
 ctx.fillStyle = stones[i % stones.length];
 ctx.beginPath();
 ctx.ellipse(x, y, 7 + (i % 4), 4 + (i % 3), 0.3, 0, Math.PI * 2);
 ctx.fill();
 }
}

function drawPageChrome(ctx, w, title, subtitle, ice) {
 ctx.save();
 ctx.fillStyle = ice ? "rgba(224,242,254,0.95)" : "rgba(245,245,244,0.95)";
 roundRect(ctx, w * 0.07, 6, w * 0.86, 62, 12);
 ctx.fill();
 ctx.strokeStyle = ice ? "#0369a1" : "#57534e";
 ctx.lineWidth = 3.2;
 ctx.stroke();
 ctx.fillStyle = ice ? "#0284c7" : "#44403c";
 for (let i = 0; i < 5; i++) {
 ctx.beginPath();
 ctx.arc(w * 0.12, 16 + i * 10, 3.2, 0, Math.PI * 2);
 ctx.fill();
 }
 ctx.fillStyle = ice ? "#0c4a6e" : "#1c1917";
 ctx.font = "800 20px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.fillText(title, w * 0.52, 32);
 ctx.font = "600 12px Segoe UI, sans-serif";
 ctx.fillStyle = ice ? "#075985" : "#44403c";
 ctx.fillText(subtitle, w * 0.52, 52);
 ctx.restore();
}

/** Canal-bank boulder: irregular facets, moss, wet sheen, living eyes. Ball stays a separate drawing. */
export function drawLazyRock(ctx, x, y, scale = 1, opts = {}) {
 const moving = !!opts.moving;
 const sleepy = opts.sleepy !== false && !moving;
 ctx.save();
 ctx.translate(x, y);
 ctx.scale(scale, scale);
 ctx.fillStyle = "rgba(28,25,23,0.3)";
 ctx.beginPath();
 ctx.ellipse(4, 26, 40, 9, 0, 0, Math.PI * 2);
 ctx.fill();
 const g = ctx.createLinearGradient(-22, -32, 26, 28);
 g.addColorStop(0, opts.tint || "#c4b5a5");
 g.addColorStop(0.4, "#8a8178");
 g.addColorStop(1, "#44403c");
 ctx.fillStyle = g;
 ctx.beginPath();
 ctx.moveTo(-38, 10);
 ctx.bezierCurveTo(-48, -2, -38, -26, -18, -31);
 ctx.bezierCurveTo(-2, -40, 18, -34, 30, -20);
 ctx.bezierCurveTo(46, -8, 48, 10, 34, 22);
 ctx.bezierCurveTo(16, 34, -10, 32, -24, 24);
 ctx.bezierCurveTo(-38, 20, -42, 16, -38, 10);
 ctx.closePath();
 ctx.fill();
 ctx.strokeStyle = "rgba(28,25,23,0.4)";
 ctx.lineWidth = 1.5;
 ctx.stroke();
 ctx.fillStyle = "rgba(255,255,255,0.18)";
 ctx.beginPath();
 ctx.ellipse(-12, -14, 13, 7, -0.5, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "rgba(186,230,253,0.4)";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.moveTo(-10, -18);
 ctx.quadraticCurveTo(8, -24, 20, -8);
 ctx.stroke();
 ctx.strokeStyle = "rgba(28,25,23,0.45)";
 ctx.lineWidth = 1.15;
 ctx.beginPath();
 ctx.moveTo(-8, 2);
 ctx.lineTo(6, 16);
 ctx.moveTo(12, -8);
 ctx.lineTo(22, 8);
 ctx.stroke();
 ctx.fillStyle = "#3f6212";
 ctx.beginPath();
 ctx.ellipse(16, 11, 9, 5, -0.45, 0, Math.PI * 2);
 ctx.ellipse(-22, 13, 7, 4, 0.35, 0, Math.PI * 2);
 ctx.fill();
 if (opts.eyes !== false) {
 drawPairEyes(ctx, -6, 9, { sleepy, moving, r: 5.2 });
 }
 ctx.strokeStyle = "#292524";
 ctx.lineWidth = 1.7;
 ctx.beginPath();
 ctx.ellipse(0, 11, 8, moving ? 5 : 3.1, 0, 0.12, Math.PI - 0.12);
 ctx.stroke();
 ctx.restore();
}

function drawBall(ctx, x, y, r = 16, opts = {}) {
 const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 2, x, y, r);
 g.addColorStop(0, "#fecaca");
 g.addColorStop(1, "#dc2626");
 ctx.fillStyle = g;
 ctx.beginPath();
 ctx.arc(x, y, r, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "rgba(127,29,29,0.45)";
 ctx.lineWidth = 1.2;
 ctx.stroke();
 if (opts.eyes) {
 ctx.save();
 ctx.translate(x, y);
 drawPairEyes(ctx, -r * 0.12, r * 0.32, { moving: opts.moving, sleepy: opts.sleepy, r: r * 0.2 });
 ctx.restore();
 }
}

function drawBrick(ctx, x, y, s = 1, opts = {}) {
 ctx.save();
 ctx.translate(x, y);
 ctx.scale(s, s);
 ctx.fillStyle = "rgba(28,25,23,0.25)";
 ctx.beginPath();
 ctx.ellipse(2, 16, 28, 6, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#9a3412";
 ctx.beginPath();
 ctx.moveTo(22, -16);
 ctx.lineTo(32, -8);
 ctx.lineTo(32, 12);
 ctx.lineTo(22, 6);
 ctx.closePath();
 ctx.fill();
 ctx.fillStyle = "#ea580c";
 ctx.beginPath();
 ctx.moveTo(-22, -16);
 ctx.lineTo(22, -16);
 ctx.lineTo(32, -8);
 ctx.lineTo(-12, -8);
 ctx.closePath();
 ctx.fill();
 ctx.fillStyle = "#c2410c";
 roundRect(ctx, -22, -8, 44, 22, 2);
 ctx.fill();
 ctx.strokeStyle = "rgba(254,215,170,0.55)";
 ctx.lineWidth = 1;
 ctx.beginPath();
 ctx.moveTo(-22, 2);
 ctx.lineTo(22, 2);
 ctx.moveTo(0, -8);
 ctx.lineTo(0, 14);
 ctx.stroke();
 if (opts.eyes) drawPairEyes(ctx, 2, 7, { moving: opts.moving, sleepy: opts.sleepy, r: 4.2 });
 ctx.restore();
}

function drawFootball(ctx, x, y, r = 18, opts = {}) {
 ctx.save();
 ctx.translate(x, y);
 ctx.fillStyle = "rgba(28,25,23,0.25)";
 ctx.beginPath();
 ctx.ellipse(2, r + 4, r * 0.9, 5, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#f8fafc";
 ctx.beginPath();
 ctx.arc(0, 0, r, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "#0f172a";
 ctx.lineWidth = 1.4;
 ctx.stroke();
 ctx.fillStyle = "#0f172a";
 ctx.beginPath();
 for (let i = 0; i < 5; i++) {
 const a = -Math.PI / 2 + i * (Math.PI * 2) / 5;
 const px = Math.cos(a) * r * 0.28;
 const py = Math.sin(a) * r * 0.28;
 if (i === 0) ctx.moveTo(px, py);
 else ctx.lineTo(px, py);
 }
 ctx.closePath();
 ctx.fill();
 ctx.strokeStyle = "#0f172a";
 ctx.lineWidth = 1.2;
 for (let i = 0; i < 5; i++) {
 const a = -Math.PI / 2 + i * (Math.PI * 2) / 5;
 ctx.beginPath();
 ctx.moveTo(Math.cos(a) * r * 0.28, Math.sin(a) * r * 0.28);
 ctx.lineTo(Math.cos(a) * r * 0.92, Math.sin(a) * r * 0.92);
 ctx.stroke();
 }
 if (opts.eyes) drawPairEyes(ctx, -r * 0.42, r * 0.28, { moving: opts.moving, sleepy: opts.sleepy, r: r * 0.16 });
 ctx.restore();
}

function drawMassItem(ctx, kind, x, y, opts = {}) {
 if (kind === "ball") drawBall(ctx, x, y - 2, 15, opts);
 else if (kind === "brick") drawBrick(ctx, x, y, 1, opts);
 else drawFootball(ctx, x, y - 2, 17, opts);
}

function drawWheel(ctx, x, y, r, spin) {
 ctx.fillStyle = "#1c1917";
 ctx.beginPath();
 ctx.arc(x, y, r, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#a8a29e";
 ctx.beginPath();
 ctx.arc(x, y, r * 0.42, 0, Math.PI * 2);
 ctx.fill();
 if (spin) {
 ctx.strokeStyle = "#e7e5e4";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.moveTo(x, y);
 ctx.lineTo(x + Math.cos(spin) * r * 0.85, y + Math.sin(spin) * r * 0.85);
 ctx.stroke();
 }
}

function drawCar(ctx, x, y, scale = 1, opts = {}) {
 ctx.save();
 ctx.translate(x, y);
 ctx.scale(scale, scale);
 const spin = opts.moving ? performance.now() / 120 : 0;
 drawWheel(ctx, -44, 16, 15, spin);
 drawWheel(ctx, 52, 16, 15, spin);
 ctx.fillStyle = opts.color || "#1d4ed8";
 roundRect(ctx, -74, -28, 152, 36, 12);
 ctx.fill();
 ctx.fillStyle = "#1e3a8a";
 roundRect(ctx, -8, -54, 78, 30, 10);
 ctx.fill();
 ctx.fillStyle = "#0c4a6e";
 roundRect(ctx, -2, -50, 30, 20, 4);
 ctx.fill();
 roundRect(ctx, 32, -50, 32, 20, 4);
 ctx.fill();
 ctx.fillStyle = "#fbbf24";
 roundRect(ctx, 68, -18, 12, 10, 2);
 ctx.fill();
 if (opts.passenger) {
 const px = opts.passX != null ? opts.passX : 10;
 drawKid(ctx, px, -40, {
 scale: 1.35,
 moving: opts.passMoving,
 sleepy: false,
 lookX: opts.passLookX,
 shirt: "#ef4444",
 });
 }
 if (opts.belt && opts.passenger) {
 ctx.strokeStyle = "#f59e0b";
 ctx.lineWidth = 3.2;
 ctx.beginPath();
 ctx.moveTo((opts.passX != null ? opts.passX : 10) - 4, -48);
 ctx.lineTo(-18, 4);
 ctx.stroke();
 }
 ctx.restore();
}

function drawBus(ctx, x, y, scale = 1, opts = {}) {
 ctx.save();
 ctx.translate(x, y);
 ctx.scale(scale, scale);
 const spin = opts.moving ? performance.now() / 140 : 0;
 drawWheel(ctx, -70, 20, 16, spin);
 drawWheel(ctx, 78, 20, 16, spin);
 ctx.fillStyle = "#facc15";
 roundRect(ctx, -112, -50, 224, 58, 12);
 ctx.fill();
 ctx.fillStyle = "#1e3a8a";
 roundRect(ctx, -112, -50, 34, 58, 10);
 ctx.fill();
 ctx.fillStyle = "#fbbf24";
 roundRect(ctx, 100, -28, 14, 10, 2);
 ctx.fill();
 ctx.fillStyle = "#0c4a6e";
 for (let i = 0; i < 4; i++) {
 roundRect(ctx, -68 + i * 40, -42, 32, 26, 4);
 ctx.fill();
 }
 if (opts.passenger) {
 const px = opts.passX != null ? opts.passX : -12;
 ctx.fillStyle = "#57534e";
 roundRect(ctx, px - 12, -18, 24, 10, 3);
 ctx.fill();
 drawKid(ctx, px, -36, {
 scale: 1.55,
 moving: opts.passMoving,
 lookX: opts.passLookX,
 shirt: "#ef4444",
 });
 }
 ctx.fillStyle = "#111827";
 ctx.font = "800 12px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.fillText("BUS", 12, 4);
 ctx.restore();
}

function drawRoad(ctx, w, h, y) {
 ctx.fillStyle = "#1e293b";
 ctx.fillRect(0, y, w, h - y);
 ctx.fillStyle = "#334155";
 ctx.fillRect(0, y, w, 8);
 ctx.strokeStyle = "#fbbf24";
 ctx.setLineDash([18, 16]);
 ctx.lineWidth = 4;
 ctx.beginPath();
 ctx.moveTo(0, y + (h - y) * 0.45);
 ctx.lineTo(w, y + (h - y) * 0.45);
 ctx.stroke();
 ctx.setLineDash([]);
}

function drawBrickWall(ctx, x, y, bw, bh) {
 ctx.fillStyle = "#7f1d1d";
 ctx.fillRect(x, y, bw, bh);
 ctx.strokeStyle = "#fecaca";
 ctx.lineWidth = 1;
 const rowH = 11;
 const colW = 18;
 for (let row = 0; row < Math.ceil(bh / rowH); row++) {
 const off = row % 2 ? colW / 2 : 0;
 for (let col = -1; col < Math.ceil(bw / colW) + 1; col++) {
 ctx.strokeRect(x + col * colW + off, y + row * rowH, colW, rowH);
 }
 }
}

function drawWrench(ctx, x, y, opts = {}) {
 ctx.save();
 ctx.translate(x, y);
 ctx.rotate(opts.rot || 0);
 ctx.fillStyle = "#94a3b8";
 roundRect(ctx, -26, -7, 52, 14, 4);
 ctx.fill();
 ctx.beginPath();
 ctx.arc(-24, 0, 12, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#0f172a";
 ctx.beginPath();
 ctx.arc(-24, 0, 6, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#cbd5e1";
 ctx.beginPath();
 ctx.arc(24, 0, 8, 0, Math.PI * 2);
 ctx.fill();
 if (opts.eyes) drawPairEyes(ctx, -1, 5.5, { r: 3.1, moving: opts.moving });
 ctx.restore();
}

function drawPuck(ctx, x, y, opts = {}) {
 ctx.fillStyle = "rgba(15,23,42,0.35)";
 ctx.beginPath();
 ctx.ellipse(x + 2, y + 8, 18, 5, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#1c1917";
 ctx.beginPath();
 ctx.ellipse(x, y + 3, 16, 7, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#44403c";
 ctx.beginPath();
 ctx.ellipse(x, y - 2, 16, 6.5, 0, 0, Math.PI * 2);
 ctx.fill();
 if (opts.eyes) {
 ctx.save();
 ctx.translate(x, y - 2);
 drawPairEyes(ctx, 0, 5.2, { r: 2.7, moving: opts.moving });
 ctx.restore();
 }
}

function drawCoinCard(ctx, x, y, yanked) {
 ctx.save();
 ctx.translate(x, y);
 ctx.save();
 if (yanked) {
 ctx.translate(90, 24);
 ctx.rotate(0.42);
 }
 ctx.fillStyle = "#e7e5e4";
 roundRect(ctx, -50, -34, 100, 68, 6);
 ctx.fill();
 ctx.strokeStyle = "#a8a29e";
 ctx.lineWidth = 2;
 ctx.stroke();
 ctx.restore();
 ctx.fillStyle = "#fbbf24";
 ctx.beginPath();
 ctx.arc(0, -2, 13, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "#b45309";
 ctx.lineWidth = 1.4;
 ctx.stroke();
 ctx.save();
 ctx.translate(0, -2);
 drawPairEyes(ctx, 0, 4.4, { r: 2.5, moving: yanked });
 ctx.restore();
 ctx.restore();
}

function drawEarthSat(ctx, cx, cy, t, boosted) {
 ctx.fillStyle = "#38bdf8";
 ctx.beginPath();
 ctx.arc(cx, cy, 36, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#16a34a";
 ctx.beginPath();
 ctx.ellipse(cx - 8, cy + 4, 16, 10, 0.4, 0, Math.PI * 2);
 ctx.fill();
 ctx.beginPath();
 ctx.ellipse(cx + 10, cy - 8, 10, 7, -0.3, 0, Math.PI * 2);
 ctx.fill();
 const a = t * (boosted ? 1.8 : 1.05);
 const sx = cx + Math.cos(a) * 78;
 const sy = cy + Math.sin(a) * 32;
 ctx.strokeStyle = "rgba(148,163,184,0.55)";
 ctx.setLineDash([5, 5]);
 ctx.beginPath();
 ctx.ellipse(cx, cy, 78, 32, 0, 0, Math.PI * 2);
 ctx.stroke();
 ctx.setLineDash([]);
 ctx.fillStyle = "#e2e8f0";
 roundRect(ctx, sx - 10, sy - 6, 20, 12, 3);
 ctx.fill();
 ctx.fillStyle = "#38bdf8";
 ctx.fillRect(sx - 18, sy - 3, 8, 6);
 ctx.fillRect(sx + 10, sy - 3, 8, 6);
 ctx.save();
 ctx.translate(sx, sy);
 drawPairEyes(ctx, 0, 4, { r: 2.2, moving: true });
 ctx.restore();
 return { x: sx, y: sy };
}

function busRidePose() {
 const mode = forceLabState.rockBusMode || "idle";
 const t0 = forceLabState.rockBusT0 || 0;
 const elapsed = t0 ? (performance.now() - t0) / 1000 : 0;
 let passX = -18;
 let passLookX = 0;
 let moving = false;
 let busXFrac = 0.42;
 if (mode === "start") {
 moving = true;
 const u = Math.min(1, elapsed / 1.12);
 passX = -18 - 24 * u;
 passLookX = -1.8;
 busXFrac = 0.3 + u * 0.18;
 if (elapsed >= 1.12) {
 forceLabState.rockBusMode = "cruise";
 forceLabState.rockBusT0 = performance.now();
 }
 } else if (mode === "cruise") {
 moving = true;
 passX = -18;
 busXFrac = 0.48 + 0.05 * Math.sin(elapsed * 1.4);
 } else if (mode === "brake") {
 const u = Math.min(1, elapsed / 1.05);
 moving = u < 1;
 passX = -18 + 38 * u;
 passLookX = 2.1;
 busXFrac = 0.48 - u * 0.06;
 if (elapsed >= 1.25) forceLabState.rockBusMode = "stopped";
 } else if (mode === "stopped") {
 passX = 16;
 passLookX = 1.3;
 busXFrac = 0.42;
 }
 return { passX, passLookX, moving, busXFrac, mode, elapsed };
}

function drawPebble(ctx, x, y, s = 1) {
 drawBall(ctx, x, y, 12 * s);
}

function drawBoulder(ctx, x, y, s = 1) {
 drawLazyRock(ctx, x, y, 1.45 * s, { tint: "#57534e", sleepy: true });
}

function drawArrow(ctx, x1, y1, x2, y2, color = "#fbbf24", width = 4) {
 const ang = Math.atan2(y2 - y1, x2 - x1);
 ctx.strokeStyle = color;
 ctx.fillStyle = color;
 ctx.lineWidth = width;
 ctx.lineCap = "round";
 ctx.beginPath();
 ctx.moveTo(x1, y1);
 ctx.lineTo(x2, y2);
 ctx.stroke();
 ctx.beginPath();
 ctx.moveTo(x2, y2);
 ctx.lineTo(x2 - 11 * Math.cos(ang - 0.4), y2 - 11 * Math.sin(ang - 0.4));
 ctx.lineTo(x2 - 11 * Math.cos(ang + 0.4), y2 - 11 * Math.sin(ang + 0.4));
 ctx.closePath();
 ctx.fill();
}

function drawCanvasBtn(ctx, x, y, w, h, label, lit) {
 roundRect(ctx, x - w / 2, y - h / 2, w, h, 12);
 ctx.fillStyle = lit ? "#d97706" : "#92400e";
 ctx.fill();
 ctx.strokeStyle = "rgba(253,230,138,0.7)";
 ctx.lineWidth = 1.6;
 ctx.stroke();
 ctx.fillStyle = "#fffbeb";
 ctx.font = "800 14px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(label, x, y + 1);
}

function groundY(h) {
 return h * 0.62;
}

function stepSlide(xKey, vKey, friction, w) {
 let x = forceLabState[xKey];
 let v = forceLabState[vKey];
 x += v;
 v *= friction;
 if (Math.abs(v) < 0.0004) v = 0;
 x = Math.max(0.08, Math.min(0.92, x));
 forceLabState[xKey] = x;
 forceLabState[vKey] = v;
 void w;
}

export function registerRockScenes(arena) {
 arena.registerScene("rockOpen", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const start = performance.now();
 setDescription("A canal-bank boulder sits still. Try nudging it.");
 setIntentHandler((intent) => {
 if ((intent.type === "CANVAS_TAP" || intent.type === "CANVAS_UP") && intent.meta?.action === "nudge") {
 forceLabState.rockNudged = true;
 forceLabState.rockAwake = true;
 pulseSuccessFeedback(280);
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 fillSkyGrass(ctx, w, h, t);
 ctx.save();
 ctx.translate(failShake(), 0);
 const gy = groundY(h);
 const wobble = forceLabState.rockNudged ? Math.sin(t * 6) * 3 * Math.max(0, 1.2 - t) : 0;
 drawLazyRock(ctx, w * 0.5 + wobble, gy - 8, 1.15, { sleepy: !forceLabState.rockNudged, moving: false });
 if (t > 2.2 && !forceLabState.rockNudged) {
 drawLabel(ctx, "Still sitting by the canal. Waiting.", w * 0.5, 28);
 } else if (!forceLabState.rockNudged) {
 drawLabel(ctx, "Here's a rock. It's not doing anything.", w * 0.5, 28);
 } else {
 drawLabel(ctx, "It only moved because you made it.", w * 0.5, 28);
 }
 const hits = [];
 if (!forceLabState.rockNudged) {
 const bx = w * 0.5;
 const by = h - 44;
 drawCanvasBtn(ctx, bx, by, Math.min(240, w * 0.7), 44, "Try Nudging It →", true);
 hits.push({ id: "nudge", shape: "rect", x: bx, y: by, w: 250, h: 48, meta: { action: "nudge" } });
 hits.push({ id: "rock", shape: "ellipse", x: w * 0.5, y: gy - 8, r: 48, meta: { action: "nudge" } });
 }
 setHitRegions(hits);
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("rockPoke", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 let drag = null;
 setDescription("Tap is not enough. Drag to push.");
 setIntentHandler((intent) => {
 const w = api.width;
 const h = api.height;
 const gy = groundY(h);
 const kind = forceLabState.rockKind || "rock";
 const x = kind === "ball" ? (forceLabState.rockBallX || 0.38) * w : (forceLabState.rockX || 0.38) * w;
 if (intent.type === "CANVAS_DOWN" && intent.meta?.action === "body") {
 drag = { x0: intent.x, y0: intent.y, moved: false };
 }
 if (intent.type === "CANVAS_DRAG" && drag) {
 if (Math.hypot(intent.x - drag.x0, intent.y - drag.y0) > 10) drag.moved = true;
 }
 if (intent.type === "CANVAS_UP" && drag) {
 const dx = intent.x - drag.x0;
 if (!drag.moved || Math.abs(dx) < 18) {
 forceLabState.rockTapTried = true;
 pulseFailFeedback(360);
 } else {
 const mass = kind === "ball" ? 0.32 : 1;
 const v = (dx / w) * (kind === "ball" ? 0.085 : 0.038) / mass;
 if (kind === "ball") {
 forceLabState.rockBallVx = v;
 forceLabState.rockBallPushed = true;
 } else {
 forceLabState.rockVx = v;
 forceLabState.rockPushed = true;
 forceLabState.rockDust = 12;
 }
 pulseSuccessFeedback(280);
 }
 drag = null;
 }
 void gy;
 void x;
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = performance.now() / 1000;
 fillSkyGrass(ctx, w, h, t);
 ctx.save();
 ctx.translate(failShake(), 0);
 const gy = groundY(h);
 const kind = forceLabState.rockKind || "rock";
 if (kind === "ball") {
 stepSlide("rockBallX", "rockBallVx", 0.988, w);
 } else {
 stepSlide("rockX", "rockVx", 0.94, w);
 if ((forceLabState.rockDust || 0) > 0) {
 forceLabState.rockDust -= 0.4;
 ctx.fillStyle = "rgba(180,83,9,0.4)";
 for (let i = 0; i < 6; i++) {
 ctx.beginPath();
 ctx.arc(
 (forceLabState.rockX || 0.38) * w - 20 - i * 6,
 gy + 6,
 2 + (i % 2),
 0,
 Math.PI * 2,
 );
 ctx.fill();
 }
 }
 }
 const x = kind === "ball" ? (forceLabState.rockBallX || 0.38) * w : (forceLabState.rockX || 0.38) * w;
 const v = kind === "ball" ? forceLabState.rockBallVx : forceLabState.rockVx;
 if (kind === "ball") drawBall(ctx, x, gy - 6, 16);
 else drawLazyRock(ctx, x, gy - 8, 1.05, { moving: Math.abs(v) > 0.001 });
 if (forceLabState.rockTapTried && !forceLabState.rockPushed && kind === "rock") {
 drawLabel(ctx, "A tap alone isn't enough. Try clicking and dragging to actually push it.", w * 0.5, 28, {
 font: "600 12px Segoe UI, sans-serif",
 h: 32,
 });
 } else if (kind === "rock" && forceLabState.rockPushed) {
 drawLabel(ctx, "You pushed it, it moved. You stopped pushing, it eventually stopped.", w * 0.5, 28, {
 font: "600 12px Segoe UI, sans-serif",
 h: 32,
 });
 } else if (kind === "ball") {
 drawLabel(ctx, "Same kind of push. The ball flies farther before it stops.", w * 0.5, 28, {
 font: "600 12px Segoe UI, sans-serif",
 h: 28,
 });
 } else {
 drawLabel(ctx, "Drag across the rock to push it.", w * 0.5, 28);
 }
 setHitRegions([{ id: "body", shape: "ellipse", x, y: gy - 8, r: 52, meta: { action: "body" } }]);
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("rockStates", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 const start = performance.now();
 setDescription("Stillness and steady motion are both a state.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 fillSkyGrass(ctx, w, h, t);
 ctx.save();
 ctx.translate(failShake(), 0);
 const phase = forceLabState.phase || "replay";
 const gy = groundY(h);
 if (phase === "words") {
 roundRect(ctx, w * 0.08, h * 0.22, w * 0.84, h * 0.5, 16);
 ctx.strokeStyle = "rgba(251,191,36,0.7)";
 ctx.setLineDash([8, 6]);
 ctx.stroke();
 ctx.setLineDash([]);
 ctx.fillStyle = "rgba(28,25,23,0.35)";
 ctx.fill();
 drawLazyRock(ctx, w * 0.3, gy - 40, 0.95, { sleepy: true });
 drawLabel(ctx, "State of rest", w * 0.3, gy + 28);
 drawBall(ctx, w * 0.7 + Math.sin(t * 2) * 18, gy - 36, 16);
 drawLabel(ctx, "State of motion", w * 0.7, gy + 28);
 drawLabel(ctx, "State", w * 0.5, h * 0.28);
 drawLabel(ctx, "Changing either one needs a cause.", w * 0.5, 28, {
 font: "600 12px Segoe UI, sans-serif",
 h: 28,
 });
 } else {
 ctx.fillStyle = "rgba(28,25,23,0.25)";
 ctx.fillRect(0, 0, w * 0.5, h);
 drawLazyRock(ctx, w * 0.25, gy - 8, 0.9, { moving: t < 1.6 });
 drawArrow(ctx, w * 0.12, gy - 70, w * 0.22, gy - 70, "#fbbf24", 5);
 drawArrow(ctx, w * 0.12, gy + 28, w * 0.28, gy + 28, "#38bdf8", 3);
 drawLabel(ctx, "the push", w * 0.25, gy - 92, { h: 20, font: "600 11px Segoe UI, sans-serif" });
 drawLabel(ctx, "kept going a bit", w * 0.25, gy + 48, { h: 20, font: "600 11px Segoe UI, sans-serif" });
 drawBall(ctx, w * 0.62 + Math.min(t, 2.4) * 40, gy - 8, 14);
 drawArrow(ctx, w * 0.55, gy - 70, w * 0.65, gy - 70, "#fbbf24", 5);
 drawArrow(ctx, w * 0.55, gy + 28, w * 0.88, gy + 28, "#38bdf8", 3);
 drawLabel(ctx, "the push", w * 0.72, gy - 92, { h: 20, font: "600 11px Segoe UI, sans-serif" });
 drawLabel(ctx, "kept going longer", w * 0.75, gy + 48, { h: 20, font: "600 11px Segoe UI, sans-serif" });
 drawLabel(ctx, "The push happens once and then it's over. The motion keeps going on its own.", w * 0.5, 28, {
 font: "600 11px Segoe UI, sans-serif",
 h: 32,
 });
 }
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("rockEffort", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 setDescription("Same push on a ball, a brick, and a football. Then try stopping them.");
 const kinds = ["ball", "brick", "football"];
 const names = ["Ball", "Brick", "Football"];
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = performance.now() / 1000;
 fillSkyGrass(ctx, w, h, t);
 ctx.save();
 ctx.translate(failShake(), 0);
 const gy = groundY(h);
 const phase = forceLabState.phase || "start";
 const i = phase === "stop" ? forceLabState.rockStopI || 0 : forceLabState.rockPushI || 0;
 const xs = [0.22, 0.5, 0.78];
 const slides = [0.16, 0.035, 0.1];
 if (phase === "stop") {
 const persist = [1.35, 0.38, 0.82];
 const braking = forceLabState.rockBraking;
 const tick = forceLabState.rockStopTick || 0;
 xs.forEach((px, n) => {
 const moved = n === i && braking ? Math.min(0.2, tick * 0.0011 * persist[n]) : 0;
 const x = (px + moved) * w;
 drawMassItem(ctx, kinds[n], x, gy - 8, { moving: n === i && braking, eyes: false });
 drawLabel(ctx, names[n], x, gy + 36, { h: 20, font: "600 11px Segoe UI, sans-serif" });
 if (n === i) {
 drawArrow(ctx, x - 40, gy - 70, x - 10, gy - 70, braking ? "#ef4444" : "#fbbf24");
 }
 });
 if (braking) forceLabState.rockStopTick = tick + 1;
 drawLabel(ctx, `${names[i]} already rolling. Hold brake. Stopping effort: ${tick}`, w * 0.5, 28, {
 font: "600 12px Segoe UI, sans-serif",
 h: 28,
 });
 } else {
 xs.forEach((px, n) => {
 const done = (forceLabState.rockPushDone || [])[n];
 const slide = done ? slides[n] : 0;
 const x = (px + slide) * w;
 drawMassItem(ctx, kinds[n], x, gy - 8, { moving: !!done, eyes: false });
 drawLabel(ctx, names[n], x, gy + 36, { h: 20, font: "600 11px Segoe UI, sans-serif" });
 if (n === i) {
 ctx.strokeStyle = "#fbbf24";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.arc(x, gy - 8, 48, 0, Math.PI * 2);
 ctx.stroke();
 }
 });
 const charge = forceLabState.rockCharge || 0;
 roundRect(ctx, w * 0.2, h - 52, w * 0.6, 16, 8);
 ctx.fillStyle = "#292524";
 ctx.fill();
 ctx.fillStyle = "#fbbf24";
 roundRect(ctx, w * 0.2, h - 52, w * 0.6 * charge, 16, 8);
 ctx.fill();
 drawLabel(ctx, `Same push. ${names[i]} is next. Size is not the same as mass.`, w * 0.5, 28, {
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

 arena.registerScene("rockInertia", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const start = performance.now();
 setDescription("Start the bus, then brake. Feel both kinds of stubbornness.");
 setIntentHandler((intent) => {
 if (intent.type !== "CANVAS_TAP") return;
 if (intent.meta?.action === "busStart") {
 forceLabState.rockBusMode = "start";
 forceLabState.rockBusT0 = performance.now();
 forceLabState.rockBusStarted = true;
 pulseSuccessFeedback(220);
 }
 if (intent.meta?.action === "busBrake") {
 if (!forceLabState.rockBusStarted) {
 pulseFailFeedback(280);
 return;
 }
 forceLabState.rockBusMode = "brake";
 forceLabState.rockBusT0 = performance.now();
 forceLabState.rockBusBraked = true;
 pulseSuccessFeedback(220);
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 const phase = forceLabState.phase || "bus";
 ctx.save();
 ctx.translate(failShake(), 0);
 const hits = [];
 if (phase === "word") {
 fillSkyGrass(ctx, w, h, t);
 const word = "INERTIA";
 const shown = Math.min(word.length, Math.floor(t * 3) + 1);
 ctx.fillStyle = "#fbbf24";
 ctx.font = "800 42px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.fillText(word.slice(0, shown), w * 0.5, 48);
 drawLabel(ctx, "A property of mass, not a force pushing back.", w * 0.5, 78, {
 font: "600 12px Segoe UI, sans-serif",
 h: 26,
 });
 const gy = groundY(h);
 [
 { k: "ball", x: 0.22, cap: "Light ball" },
 { k: "brick", x: 0.5, cap: "Heavy brick" },
 { k: "football", x: 0.78, cap: "Big, full of air" },
 ].forEach((m) => {
 drawMassItem(ctx, m.k, w * m.x, gy - 8, { eyes: true, sleepy: false });
 drawLabel(ctx, m.cap, w * m.x, gy + 38, { h: 22, font: "600 11px Segoe UI, sans-serif" });
 });
 } else {
 ctx.fillStyle = "#7dd3fc";
 ctx.fillRect(0, 0, w, h * 0.58);
 ctx.fillStyle = "#86efac";
 ctx.fillRect(0, h * 0.58, w, h * 0.12);
 drawRoad(ctx, w, h, h * 0.7);
 const ride = busRidePose();
 const bx = w * ride.busXFrac;
 const by = h * 0.7 + 2;
 drawBus(ctx, bx, by, 0.78, {
 moving: ride.moving,
 passenger: true,
 passX: ride.passX,
 passLookX: ride.passLookX,
 passMoving: ride.moving,
 });
 let caption = "You are on the bus. Start, then brake.";
 if (ride.mode === "start") caption = "Bus starts. You slide back. Your body wanted to stay still.";
 else if (ride.mode === "cruise") caption = "Now you and the bus share the same motion. Brake next.";
 else if (ride.mode === "brake" || ride.mode === "stopped") {
 caption = "Bus brakes. You lurch forward. Your body wanted to keep moving.";
 }
 drawLabel(ctx, caption, w * 0.5, 28, { font: "600 12px Segoe UI, sans-serif", h: 32 });
 const sx = w * 0.28;
 const brx = w * 0.72;
 const byBtn = h - 40;
 drawCanvasBtn(ctx, sx, byBtn, 150, 40, "Start the bus", ride.mode === "idle" || ride.mode === "stopped");
 drawCanvasBtn(ctx, brx, byBtn, 150, 40, "Brake the bus", ride.mode === "cruise" || ride.mode === "start");
 hits.push({ id: "busStart", shape: "rect", x: sx, y: byBtn, w: 160, h: 44, meta: { action: "busStart" } });
 hits.push({ id: "busBrake", shape: "rect", x: brx, y: byBtn, w: 160, h: 44, meta: { action: "busBrake" } });
 }
 setHitRegions(hits);
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("rockIce", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 let drag = null;
 setDescription("Frictionless ice, then flip back to gravel.");
 setIntentHandler((intent) => {
 const w = api.width;
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "toggle") {
 if (!forceLabState.rockIcePushed) {
 pulseFailFeedback(280);
 return;
 }
 forceLabState.rockGravelOn = !forceLabState.rockGravelOn;
 forceLabState.rockIce = !forceLabState.rockGravelOn;
 pulseSuccessFeedback(180);
 }
 if (intent.type === "CANVAS_DOWN" && intent.meta?.action === "body") drag = { x0: intent.x };
 if (intent.type === "CANVAS_UP" && drag) {
 const dx = intent.x - drag.x0;
 if (Math.abs(dx) > 16) {
 forceLabState.rockVx = (dx / w) * 0.045;
 forceLabState.rockIcePushed = true;
 pulseSuccessFeedback(240);
 }
 drag = null;
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const gravel = forceLabState.rockGravelOn;
 if (gravel) fillGravel(ctx, w, h, forceLabState.rockWorld || 0);
 else fillIceLab(ctx, w, h, forceLabState.rockWorld || 0);
 ctx.save();
 ctx.translate(failShake(), 0);
 const gy = groundY(h);
 const friction = gravel ? 0.955 : 1;
 if (forceLabState.rockIcePushed) {
 forceLabState.rockWorld = (forceLabState.rockWorld || 0) + (forceLabState.rockVx || 0) * 18;
 if (gravel) {
 forceLabState.rockVx *= friction;
 if (Math.abs(forceLabState.rockVx) < 0.0005) forceLabState.rockVx = 0;
 }
 }
 const x = w * 0.42;
 drawLazyRock(ctx, x, gy - 8, 1.05, { moving: Math.abs(forceLabState.rockVx || 0) > 0.0004, sleepy: false });
 drawPageChrome(
 ctx,
 w,
 gravel ? "PAGE: GRAVEL" : "PAGE: ICE",
 gravel ? "Rough stones. Friction bites the rock." : "Smooth ice. Almost nothing fights the motion.",
 !gravel,
 );
 if (!gravel) {
 ctx.fillStyle = "rgba(186,230,253,0.25)";
 ctx.fillRect(0, gy + 18, w, 8);
 }
 drawLabel(
 ctx,
 gravel
 ? "Gravel page. Friction, a real outside force, is slowing it."
 : "Ice page. Watch what the rock does when truly nothing else acts on it.",
 w * 0.5,
 84,
 { font: "600 12px Segoe UI, sans-serif", h: 28 },
 );
 const tx = w * 0.5;
 const ty = h - 40;
 drawCanvasBtn(ctx, tx, ty, 200, 40, gravel ? "Ice ⇄ Gravel" : "Ice ⇄ Gravel", true);
 ctx.fillStyle = "#fffbeb";
 ctx.font = "600 11px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.fillText(gravel ? "Surface: gravel" : "Surface: ice", tx, ty + 28);
 const hits = [
 { id: "body", shape: "ellipse", x, y: gy - 8, r: 52, meta: { action: "body" } },
 { id: "tog", shape: "rect", x: tx, y: ty, w: 210, h: 44, meta: { action: "toggle" } },
 ];
 setHitRegions(hits);
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("rockNewton", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const start = performance.now();
 setDescription("Nudge a wrench in space and a puck on a table. Then Newton's First Law.");
 setIntentHandler((intent) => {
 if (intent.type !== "CANVAS_TAP" && intent.type !== "CANVAS_UP") return;
 if (intent.meta?.action === "nudgeSpace") {
 forceLabState.rockSpaceVx = 0.014;
 forceLabState.rockNudgeSpace = true;
 pulseSuccessFeedback(200);
 }
 if (intent.meta?.action === "nudgeTable") {
 forceLabState.rockTableVx = 0.014;
 forceLabState.rockNudgeTable = true;
 pulseSuccessFeedback(200);
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 const phase = forceLabState.phase || "space";
 ctx.save();
 ctx.translate(failShake(), 0);
 const hits = [];
 if (phase === "law") {
 fillIceLab(ctx, w, h);
 drawLazyRock(ctx, w * 0.5, h * 0.62 - 8, 1.05, { sleepy: true });
 drawLabel(ctx, "Newton's First Law of Motion", w * 0.5, 28);
 ctx.fillStyle = "#fef3c7";
 ctx.font = "600 13px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 const lines = [
 "An object at rest stays at rest,",
 "and an object in motion stays in motion",
 "at a constant speed and direction,",
 "unless acted on by a net outside force.",
 ];
 lines.forEach((ln, i) => ctx.fillText(ln, w * 0.5, h * 0.28 + i * 22));
 drawLabel(ctx, "Also called the Law of Inertia.", w * 0.5, h - 36, { h: 24 });
 } else {
 ctx.fillStyle = "#020617";
 ctx.fillRect(0, 0, w * 0.5, h);
 ctx.fillStyle = "#f8fafc";
 for (let i = 0; i < 18; i++) {
 ctx.beginPath();
 ctx.arc((i * 37) % (w * 0.5), (i * 53) % (h * 0.7), 1.4, 0, Math.PI * 2);
 ctx.fill();
 }
 ctx.fillStyle = "#44403c";
 ctx.fillRect(w * 0.5, 0, w * 0.5, h);
 ctx.fillStyle = "#a8a29e";
 ctx.fillRect(w * 0.52, h * 0.58, w * 0.46, 16);
 ctx.fillStyle = "#fef3c7";
 ctx.font = "800 13px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.fillText("SPACE", w * 0.25, 22);
 ctx.fillText("TABLE", w * 0.75, 22);
 if (forceLabState.rockNudgeSpace) {
 forceLabState.rockSpaceX = (forceLabState.rockSpaceX || 0.2) + (forceLabState.rockSpaceVx || 0);
 if (forceLabState.rockSpaceX > 0.46) forceLabState.rockSpaceX = 0.08;
 }
 if (forceLabState.rockNudgeTable) {
 forceLabState.rockTableX = (forceLabState.rockTableX || 0.68) + (forceLabState.rockTableVx || 0);
 forceLabState.rockTableVx *= 0.96;
 if (Math.abs(forceLabState.rockTableVx) < 0.0004) forceLabState.rockTableVx = 0;
 forceLabState.rockTableX = Math.max(0.56, Math.min(0.9, forceLabState.rockTableX));
 }
 const wx = (forceLabState.rockSpaceX || 0.2) * w;
 const px = (forceLabState.rockTableX || 0.68) * w;
 drawWrench(ctx, wx, h * 0.48, { moving: Math.abs(forceLabState.rockSpaceVx) > 0.001, eyes: true });
 drawPuck(ctx, px, h * 0.54, { moving: Math.abs(forceLabState.rockTableVx) > 0.001, eyes: true });
 drawLabel(ctx, "Same nudge. Space keeps going. The table hides friction.", w * 0.5, 48, {
 font: "600 12px Segoe UI, sans-serif",
 h: 28,
 });
 const nsx = w * 0.25;
 const ntx = w * 0.75;
 const ny = h - 40;
 drawCanvasBtn(ctx, nsx, ny, 160, 40, "Nudge in space", true);
 drawCanvasBtn(ctx, ntx, ny, 160, 40, "Nudge on table", true);
 hits.push({ id: "nudgeSpace", shape: "rect", x: nsx, y: ny, w: 170, h: 44, meta: { action: "nudgeSpace" } });
 hits.push({ id: "nudgeTable", shape: "rect", x: ntx, y: ny, w: 170, h: 44, meta: { action: "nudgeTable" } });
 hits.push({ id: "wrench", shape: "ellipse", x: wx, y: h * 0.48, r: 36, meta: { action: "nudgeSpace" } });
 hits.push({ id: "puck", shape: "ellipse", x: px, y: h * 0.54, r: 32, meta: { action: "nudgeTable" } });
 }
 setHitRegions(hits);
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("rockCrash", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 setDescription("A sudden stop. The passenger keeps going until a force stops them too.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "drive") {
 forceLabState.rockCrashGo = true;
 forceLabState.rockCrashHit = false;
 forceLabState.rockCrashT0 = performance.now();
 }
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "belt") {
 forceLabState.rockBeltOn = !forceLabState.rockBeltOn;
 }
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "cloth") {
 forceLabState.rockClothYank = true;
 pulseSuccessFeedback(220);
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const phase = forceLabState.phase || "crash";
 ctx.save();
 ctx.translate(failShake(), 0);
 if (phase === "cloth") {
 fillSkyGrass(ctx, w, h);
 const yanked = forceLabState.rockClothYank;
 ctx.fillStyle = yanked ? "#fef3c7" : "#7c2d12";
 roundRect(ctx, w * 0.22, h * 0.42, w * 0.56, 18, 4);
 ctx.fill();
 ctx.fillStyle = "#e7e5e4";
 roundRect(ctx, w * 0.32, h * 0.34, 36, 28, 4);
 ctx.fill();
 ctx.save();
 ctx.translate(w * 0.32 + 18, h * 0.34 + 14);
 drawPairEyes(ctx, 0, 5, { r: 2.4, moving: yanked });
 ctx.restore();
 roundRect(ctx, w * 0.48, h * 0.32, 28, 32, 6);
 ctx.fillStyle = "#e7e5e4";
 ctx.fill();
 ctx.save();
 ctx.translate(w * 0.48 + 14, h * 0.32 + 14);
 drawPairEyes(ctx, 0, 4.4, { r: 2.3, moving: yanked });
 ctx.restore();
 roundRect(ctx, w * 0.62, h * 0.34, 36, 28, 4);
 ctx.fillStyle = "#e7e5e4";
 ctx.fill();
 ctx.save();
 ctx.translate(w * 0.62 + 18, h * 0.34 + 14);
 drawPairEyes(ctx, 0, 5, { r: 2.4, moving: yanked });
 ctx.restore();
 if (yanked) {
 ctx.fillStyle = "#7c2d12";
 roundRect(ctx, w * 0.7, h * 0.5, w * 0.22, 14, 3);
 ctx.fill();
 }
 drawLabel(ctx, yanked ? "The cloth moved. The dishes almost did not. Inertia." : "Yank the cloth. Dishes want to stay put.", w * 0.5, 28, {
 font: "600 12px Segoe UI, sans-serif",
 h: 28,
 });
 drawCanvasBtn(ctx, w * 0.5, h - 40, 180, 40, "Yank cloth →", true);
 setHitRegions([{ id: "cloth", shape: "rect", x: w * 0.5, y: h - 40, w: 190, h: 44, meta: { action: "cloth" } }]);
 } else {
 ctx.fillStyle = "#0f172a";
 ctx.fillRect(0, 0, w, h);
 ctx.fillStyle = "#1e293b";
 ctx.fillRect(0, 0, w, h * 0.42);
 ctx.fillStyle = "#fbbf24";
 for (let i = 0; i < 10; i++) {
 ctx.beginPath();
 ctx.arc((i * 73) % w, 16 + (i % 4) * 18, 1.3, 0, Math.PI * 2);
 ctx.fill();
 }
 drawRoad(ctx, w, h, h * 0.62);
 drawBrickWall(ctx, w * 0.82, h * 0.28, w * 0.18, h * 0.34);
 const go = forceLabState.rockCrashGo;
 const t0 = forceLabState.rockCrashT0 || 0;
 const elapsed = go && t0 ? (performance.now() - t0) / 1000 : 0;
 const carX = go ? Math.min(w * 0.7, w * 0.2 + elapsed * 210) : w * 0.2;
 const hit = carX >= w * 0.7 - 2;
 if (hit && !forceLabState.rockCrashHit) {
 forceLabState.rockCrashHit = true;
 if (forceLabState.rockBeltOn) forceLabState.rockCrashBeltRun = true;
 else forceLabState.rockSawNoBelt = true;
 }
 const belt = forceLabState.rockBeltOn;
 const hitTime = (w * 0.7 - w * 0.2) / 210;
 const flyT = hit && !belt ? Math.max(0, elapsed - hitTime) : 0;
 const u = Math.min(1, flyT / 0.72);
 const flying = u > 0.02;
 const carY = h * 0.68;
 const startX = carX + 18;
 const startY = carY - 42;
 const landX = Math.min(w * 0.76, carX + 78);
 const landY = carY + 4;
 const passWorldX = startX + (landX - startX) * u;
 const passWorldY = Math.min(landY, startY + (landY - startY) * u - 56 * 4 * u * (1 - u));
 drawCar(ctx, carX, carY, 0.78, {
 moving: go && !hit,
 passenger: !flying,
 passX: 10,
 belt: belt && !flying,
 passLookX: flying ? 2 : hit && belt ? -0.4 : 0,
 });
 if (flying) {
 ctx.strokeStyle = "rgba(251,191,36,0.85)";
 ctx.setLineDash([6, 5]);
 ctx.lineWidth = 2.4;
 ctx.beginPath();
 ctx.moveTo(startX, startY);
 ctx.quadraticCurveTo((startX + landX) / 2, startY - 70, passWorldX, passWorldY);
 ctx.stroke();
 ctx.setLineDash([]);
 drawKid(ctx, passWorldX, passWorldY, {
 moving: u < 1,
 lookX: u < 1 ? 2.2 : 0.4,
 scale: 1.15,
 sleepy: u >= 1,
 });
 }
 drawLabel(
 ctx,
 hit
 ? belt
 ? "The seatbelt supplied the missing outside force."
 : u >= 1
 ? "Thrown forward, then stopped on the road. The road was the outside force."
 : "The car stopped. The passenger kept the old motion, along that curve."
 : "Tap Drive. The wall is ahead.",
 w * 0.5,
 28,
 { font: "600 12px Segoe UI, sans-serif", h: 32 },
 );
 drawCanvasBtn(ctx, w * 0.28, h - 40, 140, 40, "Drive →", true);
 drawCanvasBtn(ctx, w * 0.7, h - 40, 180, 40, belt ? "Seatbelt on" : "Toggle seatbelt", belt);
 setHitRegions([
 { id: "drive", shape: "rect", x: w * 0.28, y: h - 40, w: 150, h: 44, meta: { action: "drive" } },
 { id: "belt", shape: "rect", x: w * 0.7, y: h - 40, w: 190, h: 44, meta: { action: "belt" } },
 ]);
 }
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("rockWhy", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const start = performance.now();
 setDescription("Try the bus, the coin, and the satellite. Same law, three costumes.");
 setIntentHandler((intent) => {
 if (intent.type !== "CANVAS_TAP") return;
 const a = intent.meta?.action;
 const tried = (forceLabState.rockWhyTried || [false, false, false]).slice();
 if (a === "pickBus") {
 forceLabState.rockWhyPick = 1;
 forceLabState.rockBusMode = "idle";
 forceLabState.rockBusT0 = 0;
 }
 if (a === "pickCoin") forceLabState.rockWhyPick = 2;
 if (a === "pickSat") forceLabState.rockWhyPick = 3;
 if (a === "whyStart") {
 forceLabState.rockBusMode = "start";
 forceLabState.rockBusT0 = performance.now();
 forceLabState.rockBusStarted = true;
 pulseSuccessFeedback(200);
 }
 if (a === "whyBrake") {
 if (!forceLabState.rockBusStarted) {
 pulseFailFeedback(260);
 return;
 }
 forceLabState.rockBusMode = "brake";
 forceLabState.rockBusT0 = performance.now();
 forceLabState.rockBusBraked = true;
 tried[0] = true;
 forceLabState.rockWhyTried = tried;
 pulseSuccessFeedback(200);
 }
 if (a === "whyYank") {
 forceLabState.rockCardYank = true;
 tried[1] = true;
 forceLabState.rockWhyTried = tried;
 pulseSuccessFeedback(200);
 }
 if (a === "whySat") {
 forceLabState.rockSatNudge = true;
 tried[2] = true;
 forceLabState.rockWhyTried = tried;
 pulseSuccessFeedback(200);
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 const phase = forceLabState.phase || "montage";
 ctx.save();
 ctx.translate(failShake(), 0);
 const hits = [];
 if (phase === "net") {
 fillSkyGrass(ctx, w, h, t);
 drawLazyRock(ctx, w * 0.5, h * 0.5, 1.15, { sleepy: true });
 drawLabel(ctx, "Net Force = 0", w * 0.22, h * 0.5);
 drawLabel(ctx, "No change in motion", w * 0.78, h * 0.5);
 drawArrow(ctx, w * 0.34, h * 0.5, w * 0.42, h * 0.5, "#fbbf24");
 drawArrow(ctx, w * 0.58, h * 0.5, w * 0.66, h * 0.5, "#fbbf24");
 drawLabel(ctx, "If net force is zero, motion does not change.", w * 0.5, 28, {
 font: "600 12px Segoe UI, sans-serif",
 h: 28,
 });
 } else {
 const pick = forceLabState.rockWhyPick || 0;
 const tried = forceLabState.rockWhyTried || [false, false, false];
 if (pick === 3) {
 ctx.fillStyle = "#020617";
 ctx.fillRect(0, 0, w, h);
 ctx.fillStyle = "#f8fafc";
 for (let i = 0; i < 20; i++) {
 ctx.beginPath();
 ctx.arc((i * 41) % w, (i * 29) % h, 1.3, 0, Math.PI * 2);
 ctx.fill();
 }
 const sat = drawEarthSat(ctx, w * 0.5, h * 0.48, t, !!forceLabState.rockSatNudge);
 drawLabel(
 ctx,
 forceLabState.rockSatNudge
 ? "It keeps circling. No engine needed. Motion stays motion."
 : "Tap the satellite. Give it a nudge and watch it keep going.",
 w * 0.5,
 28,
 { font: "600 12px Segoe UI, sans-serif", h: 32 },
 );
 drawCanvasBtn(ctx, w * 0.5, h - 78, 180, 36, "Nudge satellite →", true);
 hits.push({ id: "whySat", shape: "rect", x: w * 0.5, y: h - 78, w: 190, h: 40, meta: { action: "whySat" } });
 hits.push({ id: "satBody", shape: "ellipse", x: sat.x, y: sat.y, r: 28, meta: { action: "whySat" } });
 } else if (pick === 2) {
 fillSkyGrass(ctx, w, h, t);
 ctx.fillStyle = "#a8a29e";
 roundRect(ctx, w * 0.18, h * 0.58, w * 0.64, 16, 4);
 ctx.fill();
 drawCoinCard(ctx, w * 0.5, h * 0.46, !!forceLabState.rockCardYank);
 drawLabel(
 ctx,
 forceLabState.rockCardYank
 ? "The card moved. The coin wanted to stay put. Inertia."
 : "Yank the card. You are the force. The coin is the lazy rock.",
 w * 0.5,
 28,
 { font: "600 12px Segoe UI, sans-serif", h: 32 },
 );
 drawCanvasBtn(ctx, w * 0.5, h - 78, 160, 36, "Yank the card →", true);
 hits.push({ id: "whyYank", shape: "rect", x: w * 0.5, y: h - 78, w: 170, h: 40, meta: { action: "whyYank" } });
 } else if (pick === 1) {
 ctx.fillStyle = "#7dd3fc";
 ctx.fillRect(0, 0, w, h * 0.55);
 ctx.fillStyle = "#86efac";
 ctx.fillRect(0, h * 0.55, w, h * 0.12);
 drawRoad(ctx, w, h, h * 0.67);
 const ride = busRidePose();
 drawBus(ctx, w * ride.busXFrac, h * 0.7 + 2, 0.74, {
 moving: ride.moving,
 passenger: true,
 passX: ride.passX,
 passLookX: ride.passLookX,
 passMoving: ride.moving,
 });
 drawLabel(
 ctx,
 ride.mode === "brake" || ride.mode === "stopped"
 ? "You lurched forward. That is Newton's First Law in your seat."
 : ride.mode === "start" || ride.mode === "cruise"
 ? "You slid back, then rode along. Now brake."
 : "Start the bus, then brake. You are the passenger.",
 w * 0.5,
 28,
 { font: "600 12px Segoe UI, sans-serif", h: 32 },
 );
 drawCanvasBtn(ctx, w * 0.28, h - 78, 140, 36, "Start bus", true);
 drawCanvasBtn(ctx, w * 0.72, h - 78, 140, 36, "Brake", true);
 hits.push({ id: "whyStart", shape: "rect", x: w * 0.28, y: h - 78, w: 150, h: 40, meta: { action: "whyStart" } });
 hits.push({ id: "whyBrake", shape: "rect", x: w * 0.72, y: h - 78, w: 150, h: 40, meta: { action: "whyBrake" } });
 } else {
 fillSkyGrass(ctx, w, h, t);
 drawLabel(ctx, "Pick a real-life costume. You do the move, not a slideshow.", w * 0.5, 28, {
 font: "600 12px Segoe UI, sans-serif",
 h: 32,
 });
 drawBus(ctx, w * 0.2, h * 0.5, 0.38, { passenger: true });
 drawCoinCard(ctx, w * 0.5, h * 0.48, false);
 drawEarthSat(ctx, w * 0.8, h * 0.5, t, false);
 }
 const tabs = [
 { a: "pickBus", lab: tried[0] ? "Bus ✓" : "Bus", x: w * 0.2 },
 { a: "pickCoin", lab: tried[1] ? "Coin ✓" : "Coin", x: w * 0.5 },
 { a: "pickSat", lab: tried[2] ? "Satellite ✓" : "Satellite", x: w * 0.8 },
 ];
 tabs.forEach((tb, n) => {
 const lit = pick === n + 1 || tried[n];
 drawCanvasBtn(ctx, tb.x, h - 34, 120, 32, tb.lab, lit);
 hits.push({ id: tb.a, shape: "rect", x: tb.x, y: h - 34, w: 128, h: 36, meta: { action: tb.a } });
 });
 }
 setHitRegions(hits);
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("rockClose", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 const start = performance.now();
 setDescription("The rock was never really lazy. It was inertia.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 forceLabState.rockCloseU = Math.min(1, t / 3);
 fillSkyGrass(ctx, w, h, t);
 ctx.save();
 ctx.translate(failShake(), 0);
 const gy = groundY(h);
 drawLazyRock(ctx, w * 0.2, gy - 6, 0.82, { sleepy: false, moving: false });
 drawBall(ctx, w * 0.4, gy - 8, 16, { eyes: true });
 drawBrick(ctx, w * 0.58, gy - 4, 0.9, { eyes: true });
 drawFootball(ctx, w * 0.78, gy - 8, 17, { eyes: true });
 if (t > 0.8) drawLabel(ctx, "State of rest", w * 0.2, h * 0.28);
 if (t > 1.5) drawLabel(ctx, "Inertia", w * 0.5, h * 0.22);
 if (t > 2.2) drawLabel(ctx, "Net Force = 0", w * 0.78, h * 0.28);
 drawLabel(ctx, "Not a character flaw. A law of the universe.", w * 0.5, 28, {
 font: "600 12px Segoe UI, sans-serif",
 h: 28,
 });
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("rockSpiral", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const start = performance.now();
 const stops = [
 { id: 1, label: "1 Still / move", caption: "Spiral 1: rest and steady motion are both a state" },
 { id: 2, label: "2 Inertia", caption: "Spiral 2: mass resists any change" },
 { id: 3, label: "3 Newton 1", caption: "Spiral 3: ice vs gravel, the law of inertia" },
 { id: 4, label: "4 Why it matters", caption: "Spiral 4: seatbelts, buses, satellites" },
 ];
 setDescription("Recap map of the four Lazy Rock spirals.");
 setIntentHandler((intent) => {
 if (intent.type !== "CANVAS_TAP") return;
 if (intent.meta?.action === "spiral") {
 forceLabState.spiralStop = Number(intent.meta.stop) || 0;
 forceLabState.spiralUntil = performance.now() + 4500;
 }
 if (intent.meta?.action === "spiralFinish") forceLabState.spiralFinish = true;
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
 const stop = forceLabState.spiralStop || 0;
 fillSkyGrass(ctx, w, h, t);
 ctx.save();
 ctx.translate(failShake(), 0);
 const origin = polar(0, w, h);
 ctx.strokeStyle = "rgba(251,191,36,0.55)";
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
 ctx.fillStyle = "rgba(41,37,36,0.55)";
 ctx.fill();
 if (stop === 1) {
 drawLazyRock(ctx, origin.cx - 18, origin.cy + 4, 0.38, { sleepy: false });
 drawBall(ctx, origin.cx + 22, origin.cy + 6, 10, { eyes: true });
 }
 if (stop === 2) {
 drawBrick(ctx, origin.cx - 16, origin.cy + 4, 0.45, { eyes: true });
 drawFootball(ctx, origin.cx + 18, origin.cy + 4, 11, { eyes: true });
 ctx.fillStyle = "#fbbf24";
 ctx.font = "800 10px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.fillText("INERTIA", origin.cx, origin.cy - 22);
 }
 if (stop === 3) {
 ctx.fillStyle = "#7dd3fc";
 ctx.fillRect(origin.cx - 30, origin.cy + 10, 60, 8);
 drawLazyRock(ctx, origin.cx, origin.cy - 4, 0.35, { moving: true, sleepy: false });
 }
 if (stop === 4) {
 drawCar(ctx, origin.cx, origin.cy + 6, 0.32, { passenger: true, belt: true });
 }
 const hits = [];
 stops.forEach((s, i) => {
 const p = polar(i, w, h);
 ctx.fillStyle = stop === s.id ? "#fbbf24" : "#b45309";
 ctx.beginPath();
 ctx.arc(p.x, p.y, 22, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#fffbeb";
 ctx.font = "800 16px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(String(s.id), p.x, p.y);
 const lx = Math.min(w - 70, Math.max(70, p.x + Math.cos(p.a) * 42));
 const ly = Math.min(h - 88, Math.max(58, p.y + Math.sin(p.a) * 36));
 drawLabel(ctx, s.label, lx, ly, { font: "600 12px Segoe UI, sans-serif", h: 22 });
 hits.push({ id: `stop-${s.id}`, shape: "ellipse", x: p.x, y: p.y, r: 36, meta: { action: "spiral", stop: s.id } });
 });
 drawLabel(ctx, stop ? stops[stop - 1].caption : "Your four spirals. Tap a number, then Finish The Lazy Rock.", w * 0.5, 28, {
 h: 32,
 font: "700 13px Segoe UI, sans-serif",
 });
 const fx = w * 0.5;
 const fy = h - 34;
 const fw = Math.min(280, w * 0.76);
 roundRect(ctx, fx - fw / 2, fy - 22, fw, 44, 12);
 ctx.fillStyle = "#d97706";
 ctx.fill();
 ctx.fillStyle = "#fffbeb";
 ctx.font = "800 16px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText("Finish The Lazy Rock", fx, fy);
 hits.push({ id: "spiral-finish", shape: "rect", x: fx, y: fy, w: fw, h: 44, meta: { action: "spiralFinish" } });
 setHitRegions(hits);
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 if (typeof arena.registerAlias === "function") {
 arena.registerAlias("rockMeet", "rockOpen");
 arena.registerAlias("rockGlide", "rockIce");
 arena.registerAlias("rockSort", "rockStates");
 arena.registerAlias("rockWall", "rockCrash");
 arena.registerAlias("rockRule", "rockNewton");
 arena.registerAlias("rockStretch", "rockWhy");
 arena.registerAlias("rockMyth", "rockInertia");
 arena.registerAlias("rockDrill", "rockEffort");
 arena.registerAlias("rockMastery", "rockSpiral");
 }
}
