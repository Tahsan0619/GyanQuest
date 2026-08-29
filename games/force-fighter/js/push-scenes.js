/**
 * Force Fighter Mission 2: Push Power
 * Script: Opening + 4 Bruner spirals (force → power ≠ strong → gears → why it matters).
 * Canvas 2D. Lazy rock bookends the lesson. Turtle/Rabbit and stalled car are new.
 */
import { forceLabState, pulseFailFeedback, pulseSuccessFeedback } from "./force-state.js?v=pairvis6";
import { drawLazyRock } from "./rock-scenes.js?v=pairvis6";

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

function failFlash(ctx, w, h) {
 const until = forceLabState.failPulse;
 if (!until || performance.now() > until) return;
 ctx.fillStyle = `rgba(248,113,113,${Math.max(0, (until - performance.now()) / 420) * 0.28})`;
 ctx.fillRect(0, 0, w, h);
}
function successFlash(ctx, w, h) {
 const until = forceLabState.successPulse;
 if (!until || performance.now() > until) return;
 ctx.fillStyle = `rgba(249,115,22,${Math.max(0, (until - performance.now()) / 380) * 0.25})`;
 ctx.fillRect(0, 0, w, h);
}

function fillSkyGrass(ctx, w, h, t = 0) {
 const g = ctx.createLinearGradient(0, 0, 0, h);
 g.addColorStop(0, "#7dd3fc");
 g.addColorStop(0.42, "#bae6fd");
 g.addColorStop(0.56, "#4ade80");
 g.addColorStop(1, "#166534");
 ctx.fillStyle = g;
 ctx.fillRect(0, 0, w, h);
 const ground = h * 0.62;
 ctx.fillStyle = "#15803d";
 ctx.fillRect(0, ground, w, h - ground);
 ctx.fillStyle = "rgba(21,128,61,0.35)";
 for (let i = 0; i < 16; i++) {
 const x = ((i * 73 + t * 8) % (w + 40)) - 20;
 ctx.fillRect(x, ground - 8, 2, 10);
 }
}

function paintAsphalt(ctx, x, y, bw, bh) {
 const g = ctx.createLinearGradient(0, y, 0, y + bh);
 g.addColorStop(0, "#52525b");
 g.addColorStop(0.18, "#3f3f46");
 g.addColorStop(1, "#18181b");
 ctx.fillStyle = g;
 ctx.fillRect(x, y, bw, bh);
 ctx.fillStyle = "rgba(24,24,27,0.45)";
 for (let i = 0; i < Math.ceil(bw / 7); i++) {
 ctx.fillRect(x + ((i * 47) % bw), y + ((i * 29) % bh), 3, 2);
 }
 ctx.fillStyle = "rgba(168,162,158,0.16)";
 for (let i = 0; i < Math.ceil(bw / 11); i++) {
 ctx.fillRect(x + ((i * 53) % bw), y + ((i * 17) % bh), 2, 2);
 }
}

function fillAsphalt(ctx, x, y, bw, bh) {
 paintAsphalt(ctx, x, y, bw, bh);
}

function markLane(ctx, x, y, bw, color = "#facc15") {
 ctx.strokeStyle = color;
 ctx.setLineDash([16, 14]);
 ctx.lineWidth = 3.5;
 ctx.beginPath();
 ctx.moveTo(x, y);
 ctx.lineTo(x + bw, y);
 ctx.stroke();
 ctx.setLineDash([]);
}

function drawDashedLine(ctx, x1, y1, x2, y2, color = "#facc15") {
 ctx.strokeStyle = color;
 ctx.setLineDash([16, 14]);
 ctx.lineWidth = 3.5;
 ctx.beginPath();
 ctx.moveTo(x1, y1);
 ctx.lineTo(x2, y2);
 ctx.stroke();
 ctx.setLineDash([]);
}

function fillSky(ctx, w, h, horizon) {
 const g = ctx.createLinearGradient(0, 0, 0, horizon);
 g.addColorStop(0, "#38bdf8");
 g.addColorStop(0.45, "#7dd3fc");
 g.addColorStop(1, "#e0f2fe");
 ctx.fillStyle = g;
 ctx.fillRect(0, 0, w, horizon);
}

function drawCloud(ctx, x, y, s = 1) {
 ctx.fillStyle = "rgba(255,255,255,0.88)";
 ctx.beginPath();
 ctx.arc(x, y, 14 * s, 0, Math.PI * 2);
 ctx.arc(x + 16 * s, y - 7 * s, 12 * s, 0, Math.PI * 2);
 ctx.arc(x + 32 * s, y, 14 * s, 0, Math.PI * 2);
 ctx.fill();
}

function drawGrassBank(ctx, x, y, bw, bh) {
 const g = ctx.createLinearGradient(0, y, 0, y + bh);
 g.addColorStop(0, "#4ade80");
 g.addColorStop(0.35, "#16a34a");
 g.addColorStop(1, "#14532d");
 ctx.fillStyle = g;
 ctx.fillRect(x, y, bw, bh);
 ctx.fillStyle = "rgba(21,128,61,0.55)";
 for (let i = 0; i < bw / 10; i++) {
 ctx.fillRect(x + i * 10 + 2, y, 2, 9);
 }
}

function roadOnGround(roadX, roadY, angle, scale) {
 const lift = 16 * (scale || 1);
 return {
 x: roadX + Math.sin(angle) * lift,
 y: roadY - Math.cos(angle) * lift,
 };
}

function drawHillWorld(ctx, w, h) {
 const horizon = h * 0.42;
 fillSky(ctx, w, h, h);
 drawCloud(ctx, w * 0.18, h * 0.1, 1.1);
 drawCloud(ctx, w * 0.72, h * 0.14, 0.85);
 const peak = { x: w * 0.07, y: h * 0.24 };
 const junction = { x: w * 0.44, y: h * 0.64 };
 const end = { x: w + 8, y: h * 0.64 };
 const half = Math.max(16, Math.min(26, h * 0.045));

 ctx.fillStyle = "#64748b";
 ctx.beginPath();
 ctx.moveTo(-10, h * 0.5);
 ctx.lineTo(w * 0.1, h * 0.16);
 ctx.lineTo(w * 0.2, h * 0.38);
 ctx.lineTo(w * 0.3, h * 0.14);
 ctx.lineTo(w * 0.42, h * 0.4);
 ctx.lineTo(w * 0.52, h * 0.28);
 ctx.lineTo(w * 0.7, h * 0.46);
 ctx.lineTo(-10, h * 0.46);
 ctx.closePath();
 ctx.fill();
 ctx.fillStyle = "#f8fafc";
 ctx.beginPath();
 ctx.moveTo(w * 0.1, h * 0.16);
 ctx.lineTo(w * 0.05, h * 0.26);
 ctx.lineTo(w * 0.15, h * 0.26);
 ctx.closePath();
 ctx.fill();
 ctx.beginPath();
 ctx.moveTo(w * 0.3, h * 0.14);
 ctx.lineTo(w * 0.25, h * 0.24);
 ctx.lineTo(w * 0.35, h * 0.24);
 ctx.closePath();
 ctx.fill();

 ctx.fillStyle = "#15803d";
 ctx.beginPath();
 ctx.moveTo(-8, h);
 ctx.lineTo(-8, h * 0.48);
 ctx.lineTo(peak.x, peak.y + 10);
 ctx.lineTo(junction.x, junction.y + 8);
 ctx.lineTo(w + 8, junction.y + 8);
 ctx.lineTo(w + 8, h);
 ctx.closePath();
 ctx.fill();
 ctx.fillStyle = "#166534";
 ctx.fillRect(0, junction.y + 8, w, h - junction.y);

 const pts = [peak, junction, end];
 function offsetPoly(sign) {
 return pts.map((p, i) => {
 const prev = pts[Math.max(0, i - 1)];
 const next = pts[Math.min(pts.length - 1, i + 1)];
 const dx = next.x - prev.x;
 const dy = next.y - prev.y;
 const len = Math.hypot(dx, dy) || 1;
 return { x: p.x - (dy / len) * half * sign, y: p.y + (dx / len) * half * sign };
 });
 }
 const left = offsetPoly(1);
 const right = offsetPoly(-1);
 ctx.beginPath();
 ctx.moveTo(left[0].x, left[0].y);
 left.forEach((p) => ctx.lineTo(p.x, p.y));
 right
 .slice()
 .reverse()
 .forEach((p) => ctx.lineTo(p.x, p.y));
 ctx.closePath();
 ctx.fillStyle = "#3f3f46";
 ctx.fill();
 ctx.save();
 ctx.clip();
 paintAsphalt(ctx, 0, Math.min(peak.y, junction.y) - 40, w, h);
 ctx.restore();
 ctx.strokeStyle = "#e7e5e4";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.moveTo(left[0].x, left[0].y);
 left.forEach((p) => ctx.lineTo(p.x, p.y));
 ctx.stroke();
 ctx.beginPath();
 ctx.moveTo(right[0].x, right[0].y);
 right.forEach((p) => ctx.lineTo(p.x, p.y));
 ctx.stroke();
 drawDashedLine(ctx, peak.x, peak.y, junction.x, junction.y, "#facc15");
 markLane(ctx, junction.x, junction.y, w - junction.x, "#facc15");

 ctx.fillStyle = "#365314";
 for (let i = 0; i < 5; i++) {
 const tx = w * (0.5 + i * 0.1);
 const ty = junction.y + 10;
 ctx.beginPath();
 ctx.moveTo(tx, ty - 28);
 ctx.lineTo(tx - 10, ty);
 ctx.lineTo(tx + 10, ty);
 ctx.closePath();
 ctx.fill();
 ctx.fillStyle = "#78350f";
 ctx.fillRect(tx - 2, ty - 6, 4, 8);
 ctx.fillStyle = "#365314";
 }

 return {
 peak,
 junction,
 end,
 hillAngle: Math.atan2(peak.y - junction.y, peak.x - junction.x),
 half,
 };
}

function drawStreet(ctx, w, h, roadY) {
 fillSky(ctx, w, h, roadY);
 drawCloud(ctx, w * 0.2, h * 0.12, 1);
 drawCloud(ctx, w * 0.78, h * 0.08, 0.8);
 drawGrassBank(ctx, 0, roadY - 28, w, 28);
 paintAsphalt(ctx, 0, roadY, w, h - roadY);
 ctx.strokeStyle = "#f8fafc";
 ctx.lineWidth = 4;
 ctx.beginPath();
 ctx.moveTo(0, roadY + 6);
 ctx.lineTo(w, roadY + 6);
 ctx.stroke();
 ctx.beginPath();
 ctx.moveTo(0, h - 8);
 ctx.lineTo(w, h - 8);
 ctx.stroke();
 markLane(ctx, 0, roadY + (h - roadY) * 0.45, w);
}

function drawBurst(ctx, x, y, u) {
 const t = Math.min(1, Math.max(0, u));
 for (let i = 0; i < 12; i++) {
 const a = (i / 12) * Math.PI * 2 + t;
 const r = 10 + t * 40;
 ctx.fillStyle = i % 2 ? "#facc15" : "#fb923c";
 ctx.beginPath();
 ctx.arc(x + Math.cos(a) * r, y + Math.sin(a) * r, 5 * (1 - t), 0, Math.PI * 2);
 ctx.fill();
 }
 ctx.fillStyle = "#fef3c7";
 ctx.font = "800 20px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText("FINISH!", x, y - 32);
}

function drawArrow(ctx, x1, y1, x2, y2, color = "#f97316", width = 4) {
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
 ctx.fillStyle = lit ? "#ea580c" : "#9a3412";
 ctx.fill();
 ctx.strokeStyle = "rgba(254,215,170,0.75)";
 ctx.lineWidth = 1.6;
 ctx.stroke();
 ctx.fillStyle = "#fff7ed";
 ctx.font = "800 13px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(label, x, y + 1);
}

function drawCrate(ctx, x, y, s = 1, opts = {}) {
 ctx.save();
 ctx.translate(x, y);
 ctx.scale(s, s);
 const spin = opts.moving ? performance.now() / 90 : 0;
 ctx.fillStyle = "rgba(28,25,23,0.32)";
 ctx.beginPath();
 ctx.ellipse(2, 28, 34, 8, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#9a3412";
 ctx.beginPath();
 ctx.moveTo(28, -26);
 ctx.lineTo(38, -14);
 ctx.lineTo(38, 16);
 ctx.lineTo(28, 8);
 ctx.closePath();
 ctx.fill();
 ctx.fillStyle = "#ea580c";
 ctx.beginPath();
 ctx.moveTo(-28, -26);
 ctx.lineTo(28, -26);
 ctx.lineTo(38, -14);
 ctx.lineTo(-18, -14);
 ctx.closePath();
 ctx.fill();
 ctx.fillStyle = "#c2410c";
 roundRect(ctx, -28, -14, 56, 32, 4);
 ctx.fill();
 ctx.strokeStyle = "rgba(254,215,170,0.75)";
 ctx.lineWidth = 1.5;
 ctx.beginPath();
 ctx.moveTo(-28, 2);
 ctx.lineTo(28, 2);
 ctx.moveTo(0, -14);
 ctx.lineTo(0, 18);
 ctx.stroke();
 ctx.fillStyle = "#78350f";
 ctx.font = "800 8px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.fillText("CRATE", 0, 8);
 drawWheel(ctx, -16, 20, 7, spin);
 drawWheel(ctx, 16, 20, 7, spin);
 ctx.restore();
}

function drawWheel(ctx, x, y, r, spin = 0) {
 ctx.fillStyle = "#0f172a";
 ctx.beginPath();
 ctx.arc(x, y, r, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "#44403c";
 ctx.lineWidth = Math.max(2, r * 0.22);
 ctx.stroke();
 ctx.fillStyle = "#a8a29e";
 ctx.beginPath();
 ctx.arc(x, y, r * 0.42, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "#e7e5e4";
 ctx.lineWidth = 1.4;
 for (let i = 0; i < 5; i++) {
 const a = spin + (i * Math.PI * 2) / 5;
 ctx.beginPath();
 ctx.moveTo(x, y);
 ctx.lineTo(x + Math.cos(a) * r * 0.78, y + Math.sin(a) * r * 0.78);
 ctx.stroke();
 }
 ctx.fillStyle = "#1c1917";
 ctx.beginPath();
 ctx.arc(x, y, r * 0.16, 0, Math.PI * 2);
 ctx.fill();
}

function drawCar(ctx, x, y, scale = 1, color = "#f97316", opts = {}) {
 ctx.save();
 ctx.translate(x, y);
 if (opts.flip) ctx.scale(-1, 1);
 ctx.rotate(opts.angle || 0);
 ctx.scale(scale, scale);
 ctx.fillStyle = "rgba(15,23,42,0.32)";
 ctx.beginPath();
 ctx.ellipse(6, 22, 70, 8, 0, 0, Math.PI * 2);
 ctx.fill();
 const spin = opts.moving ? performance.now() / 90 : 0;
 drawWheel(ctx, -40, 16, 14, spin);
 drawWheel(ctx, 46, 16, 14, spin);
 ctx.fillStyle = color;
 roundRect(ctx, -70, -24, 142, 34, 12);
 ctx.fill();
 ctx.fillStyle = "rgba(255,255,255,0.12)";
 roundRect(ctx, -66, -20, 134, 10, 6);
 ctx.fill();
 ctx.fillStyle = "#1e3a8a";
 roundRect(ctx, -14, -52, 78, 30, 10);
 ctx.fill();
 ctx.fillStyle = "#0c4a6e";
 roundRect(ctx, -8, -48, 30, 20, 5);
 ctx.fill();
 roundRect(ctx, 28, -48, 30, 20, 5);
 ctx.fill();
 ctx.fillStyle = "#fde68a";
 ctx.beginPath();
 ctx.arc(12, -38, 5, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#1c1917";
 ctx.beginPath();
 ctx.arc(10.5, -39, 1.3, 0, Math.PI * 2);
 ctx.arc(14, -39, 1.3, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#fde68a";
 roundRect(ctx, 62, -16, 14, 10, 3);
 ctx.fill();
 ctx.fillStyle = "#fecaca";
 roundRect(ctx, -70, -16, 10, 10, 3);
 ctx.fill();
 ctx.fillStyle = "#1c1917";
 roundRect(ctx, 48, -8, 18, 8, 2);
 ctx.fill();
 ctx.strokeStyle = "#e7e5e4";
 ctx.lineWidth = 1.4;
 ctx.beginPath();
 ctx.moveTo(50, -6);
 ctx.lineTo(64, -6);
 ctx.stroke();
 ctx.restore();
}

function drawTurtle(ctx, x, y, opts = {}) {
 const t = opts.moving ? performance.now() / 260 : 0;
 const walk = opts.moving ? Math.sin(t) : 0;
 ctx.save();
 ctx.translate(x, y);
 ctx.scale(opts.scale || 1, opts.scale || 1);
 ctx.fillStyle = "rgba(28,25,23,0.28)";
 ctx.beginPath();
 ctx.ellipse(2, 20, 26, 6, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#3f6212";
 ctx.beginPath();
 ctx.ellipse(-14 + walk * 3, 14, 7, 4, 0.25, 0, Math.PI * 2);
 ctx.ellipse(6 - walk * 3, 14, 7, 4, -0.2, 0, Math.PI * 2);
 ctx.ellipse(-6 - walk * 2, 12, 6, 3.5, 0.1, 0, Math.PI * 2);
 ctx.ellipse(14 + walk * 2, 12, 6, 3.5, -0.15, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#365314";
 ctx.beginPath();
 ctx.ellipse(0, 2, 22, 16, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#4d7c0f";
 ctx.beginPath();
 ctx.ellipse(-1, -1, 16, 11, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "#1a2e05";
 ctx.lineWidth = 1.3;
 ctx.beginPath();
 ctx.ellipse(0, 1, 10, 7, 0, 0, Math.PI * 2);
 ctx.moveTo(-8, -4);
 ctx.lineTo(8, 6);
 ctx.moveTo(8, -4);
 ctx.lineTo(-6, 7);
 ctx.stroke();
 ctx.fillStyle = "#65a30d";
 ctx.beginPath();
 ctx.ellipse(24, -2 + walk * 1.4, 9, 7, 0.2, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#14532d";
 ctx.beginPath();
 ctx.arc(27, -4 + walk * 1.4, 1.7, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "#14532d";
 ctx.lineWidth = 1.2;
 ctx.beginPath();
 ctx.moveTo(31, -1 + walk);
 ctx.lineTo(34, 1 + walk);
 ctx.stroke();
 ctx.fillStyle = "#3f6212";
 ctx.beginPath();
 ctx.ellipse(-20, 4, 6, 4.5, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.restore();
}

function drawRabbit(ctx, x, y, opts = {}) {
 const hop = opts.moving ? Math.abs(Math.sin(performance.now() / 110)) * 10 : 0;
 const lean = opts.moving ? 0.08 : 0;
 ctx.save();
 ctx.translate(x, y - hop);
 ctx.rotate(lean);
 ctx.scale(opts.scale || 1, opts.scale || 1);
 ctx.fillStyle = "rgba(28,25,23,0.24)";
 ctx.beginPath();
 ctx.ellipse(2, 20 + hop, 18, 5, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#e7e5e4";
 ctx.beginPath();
 ctx.ellipse(-4, -28, 4.5, 16, -0.18, 0, Math.PI * 2);
 ctx.ellipse(6, -28, 4.5, 16, 0.22, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#fda4af";
 ctx.beginPath();
 ctx.ellipse(-4, -28, 2.2, 10, -0.18, 0, Math.PI * 2);
 ctx.ellipse(6, -28, 2.2, 10, 0.22, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#d6d3d1";
 ctx.beginPath();
 ctx.ellipse(-2, 4, 18, 13, 0.1, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#a8a29e";
 ctx.beginPath();
 ctx.ellipse(-16, 10, 9, 5, 0.5, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#f5f5f4";
 ctx.beginPath();
 ctx.ellipse(-18, 10, 3, 3, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#f5f5f4";
 ctx.beginPath();
 ctx.arc(12, -10, 10, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#1c1917";
 ctx.beginPath();
 ctx.arc(10, -12, 1.7, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#fff";
 ctx.beginPath();
 ctx.arc(10.6, -12.6, 0.6, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#fb7185";
 ctx.beginPath();
 ctx.ellipse(16, -6, 2.6, 1.7, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "#44403c";
 ctx.lineWidth = 1.15;
 ctx.beginPath();
 ctx.moveTo(16, -5);
 ctx.quadraticCurveTo(26, -1, 30, 4);
 ctx.moveTo(16, -5);
 ctx.quadraticCurveTo(8, 1, 2, 6);
 ctx.moveTo(16, -6);
 ctx.quadraticCurveTo(28, 4, 32, 8);
 ctx.stroke();
 ctx.fillStyle = "#a8a29e";
 ctx.beginPath();
 ctx.ellipse(8, 12, 6, 3.5, 0.2, 0, Math.PI * 2);
 ctx.fill();
 ctx.restore();
}

function drawCompass(ctx, cx, cy, r) {
 ctx.save();
 ctx.translate(cx, cy);
 ctx.fillStyle = "rgba(15,23,42,0.2)";
 ctx.beginPath();
 ctx.ellipse(4, r * 0.08, r * 0.92, r * 0.18, 0, 0, Math.PI * 2);
 ctx.fill();
 const disc = ctx.createRadialGradient(0, 0, r * 0.15, 0, 0, r);
 disc.addColorStop(0, "#fff7ed");
 disc.addColorStop(1, "#fed7aa");
 ctx.fillStyle = disc;
 ctx.beginPath();
 ctx.arc(0, 0, r, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "#9a3412";
 ctx.lineWidth = Math.max(5, r * 0.06);
 ctx.stroke();
 ctx.strokeStyle = "#c2410c";
 for (let i = 0; i < 36; i++) {
 const a = (i * Math.PI) / 18 - Math.PI / 2;
 const inner = i % 9 === 0 ? r - 20 : r - 10;
 ctx.lineWidth = i % 9 === 0 ? 2.8 : 1;
 ctx.beginPath();
 ctx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
 ctx.lineTo(Math.cos(a) * (r - 5), Math.sin(a) * (r - 5));
 ctx.stroke();
 }
 ctx.fillStyle = "#7f1d1d";
 ctx.font = `800 ${Math.max(13, r * 0.14)}px Segoe UI, sans-serif`;
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText("N", 0, -r + 26);
 ctx.fillText("S", 0, r - 26);
 ctx.fillText("E", r - 26, 1);
 ctx.fillText("W", -r + 26, 1);
 ctx.fillStyle = "#ef4444";
 ctx.beginPath();
 ctx.moveTo(0, -r + 34);
 ctx.lineTo(8, 8);
 ctx.lineTo(-8, 8);
 ctx.closePath();
 ctx.fill();
 ctx.fillStyle = "#e7e5e4";
 ctx.beginPath();
 ctx.moveTo(0, r - 34);
 ctx.lineTo(8, 8);
 ctx.lineTo(-8, 8);
 ctx.closePath();
 ctx.fill();
 ctx.fillStyle = "#1c1917";
 ctx.beginPath();
 ctx.arc(0, 0, 6, 0, Math.PI * 2);
 ctx.fill();
 ctx.restore();
}

function drawEmojiFace(ctx, x, y, happy, lit) {
 const bounce = lit ? Math.sin(performance.now() / 160) * 4 : 0;
 ctx.save();
 ctx.translate(x, y + bounce);
 ctx.globalAlpha = lit ? 1 : 0.38;
 const s = lit ? 1.08 : 0.86;
 ctx.scale(s, s);
 ctx.fillStyle = "#facc15";
 ctx.beginPath();
 ctx.arc(0, 0, 26, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "#ca8a04";
 ctx.lineWidth = 2.4;
 ctx.stroke();
 ctx.fillStyle = "#1c1917";
 ctx.beginPath();
 ctx.arc(-8, -6, 3.4, 0, Math.PI * 2);
 ctx.arc(8, -6, 3.4, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "#1c1917";
 ctx.lineWidth = 2.8;
 ctx.lineCap = "round";
 ctx.beginPath();
 if (happy) ctx.arc(0, 4, 10, 0.15, Math.PI - 0.15);
 else ctx.arc(0, 16, 10, Math.PI + 0.2, -0.2);
 ctx.stroke();
 ctx.fillStyle = happy ? "#166534" : "#7f1d1d";
 ctx.font = "800 11px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(happy ? "GO!" : "STUCK", 0, 42);
 ctx.restore();
}

function drawMoodPair(ctx, x, y, mood) {
 drawEmojiFace(ctx, x - 36, y, false, mood === "sad");
 drawEmojiFace(ctx, x + 36, y, true, mood === "happy");
}

function drawMood(ctx, x, y, happy) {
 drawEmojiFace(ctx, x, y, happy, true);
}

function pictureFrame(ctx, x, y, cw, ch) {
 roundRect(ctx, x, y, cw, ch, 12);
 ctx.fillStyle = "#fff7ed";
 ctx.fill();
 ctx.strokeStyle = "rgba(154,52,18,0.45)";
 ctx.lineWidth = 2;
 ctx.stroke();
}

function drawDoorPush(ctx, cx, cy, s = 1) {
 ctx.save();
 ctx.translate(cx, cy);
 ctx.scale(s, s);
 ctx.fillStyle = "#78716c";
 roundRect(ctx, 8, -48, 8, 96, 2);
 ctx.fill();
 ctx.fillStyle = "#b45309";
 roundRect(ctx, 16, -46, 42, 92, 4);
 ctx.fill();
 ctx.strokeStyle = "#78350f";
 ctx.strokeRect(22, -36, 28, 28);
 ctx.strokeRect(22, 2, 28, 28);
 ctx.fillStyle = "#fbbf24";
 ctx.beginPath();
 ctx.arc(50, 4, 4, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#fde68a";
 ctx.beginPath();
 ctx.ellipse(-18, 8, 10, 8, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#fcd34d";
 for (let i = 0; i < 4; i++) {
 roundRect(ctx, -38, -6 + i * 5, 16, 4, 2);
 ctx.fill();
 }
 drawArrow(ctx, -48, 6, 8, 6, "#f97316", 4);
 ctx.restore();
}

function drawSailPush(ctx, cx, cy, s = 1) {
 ctx.save();
 ctx.translate(cx, cy);
 ctx.scale(s, s);
 ctx.fillStyle = "#38bdf8";
 ctx.beginPath();
 ctx.ellipse(8, 28, 48, 8, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#9a3412";
 ctx.beginPath();
 ctx.moveTo(-22, 18);
 ctx.lineTo(28, 18);
 ctx.lineTo(16, 28);
 ctx.lineTo(-12, 28);
 ctx.closePath();
 ctx.fill();
 ctx.strokeStyle = "#44403c";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.moveTo(0, 18);
 ctx.lineTo(0, -36);
 ctx.stroke();
 ctx.fillStyle = "#fff7ed";
 ctx.beginPath();
 ctx.moveTo(2, -34);
 ctx.lineTo(32, 8);
 ctx.lineTo(2, 12);
 ctx.closePath();
 ctx.fill();
 ctx.strokeStyle = "#7dd3fc";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.moveTo(-40, -8);
 ctx.lineTo(-18, -8);
 ctx.moveTo(-36, 0);
 ctx.lineTo(-14, 0);
 ctx.stroke();
 drawArrow(ctx, -42, -4, -6, -4, "#0ea5e9", 3);
 ctx.restore();
}

function drawDogPull(ctx, cx, cy, s = 1) {
 ctx.save();
 ctx.translate(cx, cy);
 ctx.scale(s, s);
 ctx.fillStyle = "#e7e5e4";
 ctx.beginPath();
 ctx.arc(-28, 4, 8, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#fde68a";
 roundRect(ctx, -36, 8, 12, 22, 3);
 ctx.fill();
 ctx.strokeStyle = "#44403c";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.moveTo(-20, 6);
 ctx.lineTo(10, 8);
 ctx.stroke();
 ctx.fillStyle = "#b45309";
 ctx.beginPath();
 ctx.ellipse(22, 10, 16, 10, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.beginPath();
 ctx.arc(34, 4, 8, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#78350f";
 ctx.beginPath();
 ctx.ellipse(32, -4, 4, 6, -0.3, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#1c1917";
 ctx.beginPath();
 ctx.arc(36, 3, 1.4, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#44403c";
 roundRect(ctx, 28, 8, 10, 3, 1);
 ctx.fill();
 ctx.fillStyle = "#b45309";
 ctx.fillRect(14, 18, 5, 10);
 ctx.fillRect(26, 18, 5, 10);
 drawArrow(ctx, 48, 6, 18, 6, "#fbbf24", 4);
 ctx.restore();
}

function drawAppleFall(ctx, cx, cy, s = 1) {
 ctx.save();
 ctx.translate(cx, cy);
 ctx.scale(s, s);
 ctx.fillStyle = "#365314";
 ctx.beginPath();
 ctx.moveTo(-16, -36);
 ctx.quadraticCurveTo(8, -50, 30, -22);
 ctx.lineTo(10, -16);
 ctx.closePath();
 ctx.fill();
 ctx.fillStyle = "#dc2626";
 ctx.beginPath();
 ctx.moveTo(0, -10);
 ctx.bezierCurveTo(22, -18, 26, 18, 4, 26);
 ctx.bezierCurveTo(-18, 28, -24, -16, 0, -10);
 ctx.fill();
 ctx.fillStyle = "rgba(254,226,226,0.55)";
 ctx.beginPath();
 ctx.ellipse(8, 2, 5, 9, -0.3, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "#78350f";
 ctx.lineWidth = 2.6;
 ctx.beginPath();
 ctx.moveTo(2, -10);
 ctx.quadraticCurveTo(6, -22, 4, -28);
 ctx.stroke();
 ctx.fillStyle = "#22c55e";
 ctx.beginPath();
 ctx.ellipse(12, -24, 9, 5, 0.5, 0, Math.PI * 2);
 ctx.fill();
 drawArrow(ctx, 4, 30, 4, 54, "#fb7185", 4);
 ctx.restore();
}

function drawBulbIcon(ctx, x, y) {
 ctx.save();
 ctx.translate(x, y);
 ctx.fillStyle = "rgba(250,204,21,0.25)";
 ctx.beginPath();
 ctx.arc(0, -8, 22, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#fde68a";
 ctx.beginPath();
 ctx.arc(0, -10, 14, Math.PI * 0.15, Math.PI - Math.PI * 0.15);
 ctx.lineTo(8, 8);
 ctx.lineTo(-8, 8);
 ctx.closePath();
 ctx.fill();
 ctx.fillStyle = "#a8a29e";
 roundRect(ctx, -7, 6, 14, 10, 2);
 ctx.fill();
 ctx.restore();
}

function drawWalkIcon(ctx, x, y) {
 ctx.save();
 ctx.translate(x, y);
 ctx.fillStyle = "#fde68a";
 ctx.beginPath();
 ctx.arc(0, -16, 7, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "#fdba74";
 ctx.lineWidth = 3.2;
 ctx.lineCap = "round";
 ctx.beginPath();
 ctx.moveTo(0, -8);
 ctx.lineTo(0, 8);
 ctx.moveTo(0, -2);
 ctx.lineTo(-10, 6);
 ctx.moveTo(0, -2);
 ctx.lineTo(12, 2);
 ctx.moveTo(0, 8);
 ctx.lineTo(-8, 20);
 ctx.moveTo(0, 8);
 ctx.lineTo(10, 20);
 ctx.stroke();
 ctx.restore();
}

function drawBikeIcon(ctx, x, y) {
 ctx.save();
 ctx.translate(x, y);
 ctx.strokeStyle = "#fb923c";
 ctx.lineWidth = 2.6;
 ctx.beginPath();
 ctx.arc(-16, 10, 10, 0, Math.PI * 2);
 ctx.arc(16, 10, 10, 0, Math.PI * 2);
 ctx.stroke();
 ctx.beginPath();
 ctx.moveTo(-16, 10);
 ctx.lineTo(0, 10);
 ctx.lineTo(8, -6);
 ctx.lineTo(16, 10);
 ctx.moveTo(0, 10);
 ctx.lineTo(-6, -8);
 ctx.stroke();
 ctx.fillStyle = "#fde68a";
 ctx.beginPath();
 ctx.arc(-2, -16, 5, 0, Math.PI * 2);
 ctx.fill();
 ctx.restore();
}

function drawRocketIcon(ctx, x, y) {
 ctx.save();
 ctx.translate(x, y);
 const flicker = 10 + Math.sin(performance.now() / 80) * 4;
 ctx.fillStyle = "#fb923c";
 ctx.beginPath();
 ctx.moveTo(0, 16);
 ctx.lineTo(-6, 16 + flicker);
 ctx.lineTo(6, 16 + flicker);
 ctx.closePath();
 ctx.fill();
 ctx.fillStyle = "#e7e5e4";
 ctx.beginPath();
 ctx.moveTo(0, -22);
 ctx.lineTo(10, 8);
 ctx.lineTo(-10, 8);
 ctx.closePath();
 ctx.fill();
 ctx.fillStyle = "#38bdf8";
 ctx.beginPath();
 ctx.arc(0, -4, 4, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#ef4444";
 ctx.beginPath();
 ctx.moveTo(-10, 4);
 ctx.lineTo(-18, 14);
 ctx.lineTo(-6, 10);
 ctx.fill();
 ctx.beginPath();
 ctx.moveTo(10, 4);
 ctx.lineTo(18, 14);
 ctx.lineTo(6, 10);
 ctx.fill();
 ctx.restore();
}

export function strengthWord(s) {
 if (s < 0.34) return "Weak";
 if (s < 0.7) return "Medium";
 return "Strong";
}

export function applyAimPush(dx, dy, w) {
 const mag = Math.hypot(dx, dy);
 const str = Math.min(1, mag / (w * 0.38));
 const ang = (Math.atan2(-dy, dx) * 180) / Math.PI;
 forceLabState.ppStr = str;
 forceLabState.ppAng = ang;
 const nx = dx / (mag || 1);
 const ny = dy / (mag || 1);
 forceLabState.ppRvx = nx * str * 0.032;
 forceLabState.ppRvy = ny * str * 0.032;
 const step = forceLabState.ppAimStep || 0;
 const done = (forceLabState.ppAimDone || [false, false, false]).slice();
 if (step === 0) {
 if (str < 0.22 || mag < 28) {
 done[0] = true;
 pulseSuccessFeedback(240);
 } else {
 pulseFailFeedback(280);
 return "Too strong. Try a short, weak drag.";
 }
 } else if (step === 1) {
 if (str >= 0.62) {
 done[1] = true;
 forceLabState.ppLastAng = ang;
 pulseSuccessFeedback(240);
 } else {
 pulseFailFeedback(280);
 return "Drag farther. This one needs to be strong.";
 }
 } else if (step === 2) {
 const d = Math.abs(((ang - (forceLabState.ppLastAng || 0) + 540) % 360) - 180);
 if (d > 40 && str >= 0.28) {
 done[2] = true;
 pulseSuccessFeedback(240);
 } else {
 pulseFailFeedback(280);
 return "Aim a clearly different direction than last time.";
 }
 }
 forceLabState.ppAimDone = done;
 return null;
}

export function registerPushScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("pushOpen", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 setDescription("A stalled car sits on the road. Net force is zero until you push.");
 setIntentHandler((intent) => {
 if ((intent.type === "CANVAS_TAP" || intent.type === "CANVAS_UP") && intent.meta?.action === "nudge") {
 forceLabState.ppNudged = true;
 forceLabState.ppRvx = 0.02;
 pulseSuccessFeedback(280);
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const roadY = h * 0.58;
 drawStreet(ctx, w, h, roadY);
 drawGrassBank(ctx, 0, roadY - 36, w * 0.22, 36);
 forceLabState.ppRx = (forceLabState.ppRx || 0.42) + (forceLabState.ppRvx || 0);
 forceLabState.ppRvx *= 0.94;
 if (Math.abs(forceLabState.ppRvx) < 0.0004) forceLabState.ppRvx = 0;
 forceLabState.ppRx = Math.max(0.22, Math.min(0.82, forceLabState.ppRx || 0.42));
 const moving = Math.abs(forceLabState.ppRvx || 0) > 0.001;
 const carX = (forceLabState.ppRx || 0.42) * w;
 const placed = roadOnGround(carX, roadY + 18, 0, 1.05);
 drawLazyRock(ctx, w * 0.12, roadY - 18, 0.82, { sleepy: true, moving: false });
 drawCar(ctx, placed.x, placed.y, 1.05, "#ef4444", { moving });
 if (forceLabState.ppNudged) {
 drawArrow(ctx, carX - 90, roadY, carX - 48, roadY, "#f97316", 5);
 }
 drawLabel(ctx, forceLabState.ppNudged ? "Net Force is not zero" : "Net Force = 0", w * 0.5, 28);
 drawLabel(ctx, "Last lesson's rock still waits on the grass.", w * 0.5, 56, {
 font: "600 12px Segoe UI, sans-serif",
 h: 24,
 });
 const hits = [];
 if (!forceLabState.ppNudged) {
 drawCanvasBtn(ctx, w * 0.5, h - 44, Math.min(240, w * 0.7), 44, "Give It a Push →", true);
 hits.push({ id: "nudge", shape: "rect", x: w * 0.5, y: h - 44, w: 250, h: 48, meta: { action: "nudge" } });
 hits.push({ id: "car", shape: "ellipse", x: placed.x, y: placed.y, r: 64, meta: { action: "nudge" } });
 }
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("pushAim", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 let drag = null;
 const trail = [];
 setDescription("A painted compass stays put. The crate travels the way you push.");
 setIntentHandler((intent) => {
 const w = api.width;
 if (intent.type === "CANVAS_DOWN" && intent.meta?.action === "body") {
 drag = { x0: intent.x, y0: intent.y };
 }
 if (intent.type === "CANVAS_UP" && drag) {
 const dx = intent.x - drag.x0;
 const dy = intent.y - drag.y0;
 const msg = applyAimPush(dx, dy, w);
 if (msg) forceLabState.prompt = msg;
 else forceLabState.prompt = "";
 drag = null;
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 fillSkyGrass(ctx, w, h);
 const cx = w * 0.5;
 const cy = h * 0.48;
 const cr = Math.min(w, h) * 0.32;
 drawCompass(ctx, cx, cy, cr);
 forceLabState.ppRx = (forceLabState.ppRx || 0.5) + (forceLabState.ppRvx || 0);
 forceLabState.ppRy = (forceLabState.ppRy || 0.5) + (forceLabState.ppRvy || 0);
 forceLabState.ppRvx *= 0.93;
 forceLabState.ppRvy *= 0.93;
 forceLabState.ppRx = Math.max(0.16, Math.min(0.84, forceLabState.ppRx));
 forceLabState.ppRy = Math.max(0.28, Math.min(0.7, forceLabState.ppRy));
 const x = forceLabState.ppRx * w;
 const y = forceLabState.ppRy * h;
 const moving = Math.hypot(forceLabState.ppRvx || 0, forceLabState.ppRvy || 0) > 0.001;
 if (trail.length && Math.hypot(x - trail[trail.length - 1].x, y - trail[trail.length - 1].y) > 80) {
 trail.length = 0;
 }
 if (moving) {
 trail.push({ x, y });
 if (trail.length > 18) trail.shift();
 }
 ctx.strokeStyle = "rgba(249,115,22,0.45)";
 ctx.lineWidth = 3;
 ctx.lineCap = "round";
 ctx.beginPath();
 trail.forEach((p, i) => {
 if (i === 0) ctx.moveTo(p.x, p.y);
 else ctx.lineTo(p.x, p.y);
 });
 ctx.stroke();
 drawCrate(ctx, x, y, 1.12, { moving });
 const str = forceLabState.ppStr || 0;
 if (str > 0.05) {
 const rad = (-(forceLabState.ppAng || 0) * Math.PI) / 180;
 drawArrow(ctx, x, y, x + Math.cos(rad) * (40 + str * 70), y + Math.sin(rad) * (40 + str * 70), "#f97316", 3 + str * 5);
 }
 roundRect(ctx, w * 0.18, 18, w * 0.64, 14, 7);
 ctx.fillStyle = "#1c1917";
 ctx.fill();
 ctx.fillStyle = "#f97316";
 roundRect(ctx, w * 0.18, 18, w * 0.64 * str, 14, 7);
 ctx.fill();
 const step = forceLabState.ppAimStep || 0;
 const hints = ["Short, weak drag.", "Long, strong drag.", "A clearly different angle."];
 drawLabel(
 ctx,
 forceLabState.prompt ||
 `Direction: ${Math.round(forceLabState.ppAng || 0)}°. Strength: ${strengthWord(str)}. ${hints[step]}`,
 w * 0.5,
 h - 28,
 { font: "600 12px Segoe UI, sans-serif", h: 28 },
 );
 setHitRegions([{ id: "body", shape: "ellipse", x, y, r: 56, meta: { action: "body" } }]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("pushForce", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 setDescription("Every push and pull is an arrow: direction plus strength.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const phase = forceLabState.phase || "collage";
 ctx.fillStyle = "#1c1917";
 ctx.fillRect(0, 0, w, h);
 if (phase === "word") {
 ctx.fillStyle = "#fb923c";
 ctx.font = "800 42px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.fillText("FORCE", w * 0.5, h * 0.32);
 drawArrow(ctx, w * 0.22, h * 0.58, w * 0.78, h * 0.58, "#f97316", 10);
 drawLabel(ctx, "A push or pull. Measured in newtons (N).", w * 0.5, h * 0.78, {
 font: "600 12px Segoe UI, sans-serif",
 h: 28,
 });
 } else {
 const cards = [
 { lab: "Hand on a heavy door", draw: drawDoorPush },
 { lab: "Wind on a sail", draw: drawSailPush },
 { lab: "Dog pulling a leash", draw: drawDogPull },
 { lab: "Gravity on an apple", draw: drawAppleFall },
 ];
 const gap = 10;
 const cw = (w - 36 - gap) / 2;
 const ch = (h - 88 - gap) / 2;
 cards.forEach((c, i) => {
 const col = i % 2;
 const row = Math.floor(i / 2);
 const x = 18 + col * (cw + gap);
 const y = 48 + row * (ch + gap);
 pictureFrame(ctx, x, y, cw, ch);
 c.draw(ctx, x + cw * 0.5, y + ch * 0.42, Math.min(cw, ch) / 140);
 ctx.fillStyle = "#7c2d12";
 ctx.font = "700 12px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(c.lab, x + cw * 0.5, y + ch - 16);
 });
 drawLabel(ctx, "Four real pushes and pulls. Each one is an arrow.", w * 0.5, 24);
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("pushRace", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 let turtleBoom = 0;
 let rabbitBoom = 0;
 setDescription("Two lanes. Tortoise slow and steady. Rabbit hops to the finish.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DOWN" && intent.meta?.action === "push") {
 forceLabState.ppPushing = true;
 if (!forceLabState.ppRaceT0) forceLabState.ppRaceT0 = performance.now();
 }
 if (intent.type === "CANVAS_UP" || intent.type === "CANVAS_TAP") {
 if (intent.meta?.action === "push") forceLabState.ppPushing = false;
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 fillSky(ctx, w, h, h);
 drawGrassBank(ctx, 0, h * 0.22, w, h * 0.78);
 const turtleY = h * 0.38;
 const rabbitY = h * 0.62;
 const laneH = Math.max(44, h * 0.14);
 paintAsphalt(ctx, 0, turtleY - laneH / 2, w, laneH);
 paintAsphalt(ctx, 0, rabbitY - laneH / 2, w, laneH);
 ctx.strokeStyle = "#f8fafc";
 ctx.lineWidth = 3;
 ctx.strokeRect(1, turtleY - laneH / 2, w - 2, laneH);
 ctx.strokeRect(1, rabbitY - laneH / 2, w - 2, laneH);
 markLane(ctx, 0, turtleY, w, "#facc15");
 markLane(ctx, 0, rabbitY, w, "#facc15");
 ctx.fillStyle = "#f8fafc";
 ctx.fillRect(w * 0.8, turtleY - laneH / 2 - 8, 8, laneH + 16);
 ctx.fillRect(w * 0.8, rabbitY - laneH / 2 - 8, 8, laneH + 16);
 ctx.fillStyle = "#ef4444";
 ctx.fillRect(w * 0.8 + 8, turtleY - 28, 36, 18);
 ctx.fillRect(w * 0.8 + 8, rabbitY - 28, 36, 18);
 ctx.fillStyle = "#fff7ed";
 ctx.font = "800 10px Segoe UI, sans-serif";
 ctx.textAlign = "left";
 ctx.fillText("END", w * 0.8 + 12, turtleY - 16);
 ctx.fillText("END", w * 0.8 + 12, rabbitY - 16);

 const who = forceLabState.ppRaceWho || "turtle";
 const turtleCap = 0.00085;
 const rabbitCap = 0.0072;
 if (forceLabState.ppPushing) {
 if (who === "turtle" && !forceLabState.ppTurtleDone) {
 forceLabState.ppTurtleX = Math.min(0.8, (forceLabState.ppTurtleX || 0.18) + turtleCap);
 }
 if (who === "rabbit" && !forceLabState.ppRabbitDone) {
 forceLabState.ppRabbitX = Math.min(0.8, (forceLabState.ppRabbitX || 0.18) + rabbitCap);
 }
 forceLabState.ppForceShow = 0.72;
 }
 const tx = (forceLabState.ppTurtleX || 0.18) * w;
 const rx = (forceLabState.ppRabbitX || 0.18) * w;
 const turtleGo = who === "turtle" && forceLabState.ppPushing && !forceLabState.ppTurtleDone;
 const rabbitGo = who === "rabbit" && forceLabState.ppPushing && !forceLabState.ppRabbitDone;
 drawCrate(ctx, tx, turtleY - 4, 0.92, { moving: turtleGo });
 drawTurtle(ctx, tx - 58, turtleY + 8, { moving: turtleGo, scale: 1.15 });
 drawCrate(ctx, rx, rabbitY - 4, 0.92, { moving: rabbitGo });
 drawRabbit(ctx, rx - 56, rabbitY + 6, { moving: rabbitGo, scale: 1.12 });

 const elapsed = forceLabState.ppRaceT0 ? (performance.now() - forceLabState.ppRaceT0) / 1000 : 0;
 if ((forceLabState.ppTurtleX || 0) >= 0.8 && !forceLabState.ppTurtleDone) {
 forceLabState.ppTurtleDone = true;
 forceLabState.ppTurtleT = elapsed;
 forceLabState.ppPushing = false;
 turtleBoom = performance.now();
 pulseSuccessFeedback(240);
 }
 if ((forceLabState.ppRabbitX || 0) >= 0.8 && !forceLabState.ppRabbitDone) {
 forceLabState.ppRabbitDone = true;
 forceLabState.ppRabbitT = elapsed;
 forceLabState.ppPushing = false;
 rabbitBoom = performance.now();
 pulseSuccessFeedback(240);
 }
 if (turtleBoom && performance.now() - turtleBoom < 900) {
 drawBurst(ctx, w * 0.8, turtleY, (performance.now() - turtleBoom) / 900);
 }
 if (rabbitBoom && performance.now() - rabbitBoom < 900) {
 drawBurst(ctx, w * 0.8, rabbitY, (performance.now() - rabbitBoom) / 900);
 }

 roundRect(ctx, w * 0.2, 16, w * 0.6, 14, 7);
 ctx.fillStyle = "#1c1917";
 ctx.fill();
 ctx.fillStyle = "#fb923c";
 roundRect(ctx, w * 0.2, 16, w * 0.6 * (forceLabState.ppForceShow || 0.72), 14, 7);
 ctx.fill();
 const tShow = (
 who === "turtle"
 ? forceLabState.ppTurtleDone
 ? forceLabState.ppTurtleT
 : elapsed
 : forceLabState.ppRabbitDone
 ? forceLabState.ppRabbitT
 : elapsed
 ).toFixed(1);
 drawLabel(
 ctx,
 `${who === "turtle" ? "Tortoise" : "Rabbit"} · same force meter · ${tShow}s`,
 w * 0.5,
 h - 28,
 { font: "600 12px Segoe UI, sans-serif", h: 28 },
 );
 if (forceLabState.ppReveal) {
 drawLabel(ctx, "Same push strength. Same job. Only TIME changed.", w * 0.5, 48, {
 font: "600 12px Segoe UI, sans-serif",
 h: 26,
 });
 }
 drawCanvasBtn(ctx, w * 0.5, h - 70, 180, 40, "Hold to push", !!forceLabState.ppPushing);
 setHitRegions([{ id: "push", shape: "rect", x: w * 0.5, y: h - 70, w: 190, h: 44, meta: { action: "push" } }]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("pushWork", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 const start = performance.now();
 setDescription("Same work, less time means more power.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = Math.min(1, (performance.now() - start) / 1400);
 const phase = forceLabState.phase || "bars";
 ctx.fillStyle = "#1c1917";
 ctx.fillRect(0, 0, w, h);
 if (phase === "word") {
 ctx.fillStyle = "#fdba74";
 ctx.font = "700 16px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.fillText("Work = Force × Distance  (joules)", w * 0.5, h * 0.34);
 ctx.fillText("Power = Work ÷ Time  (watts)", w * 0.5, h * 0.5);
 drawTurtle(ctx, w * 0.28, h * 0.72);
 drawRabbit(ctx, w * 0.72, h * 0.72);
 drawLabel(ctx, "Identical work. Only time, so power, differed.", w * 0.5, 28, {
 font: "600 12px Segoe UI, sans-serif",
 h: 28,
 });
 } else {
 const pairs = [
 { lab: "Work Done", tH: 110, rH: 110, c: "#fb923c" },
 { lab: "Time Taken", tH: 150, rH: 48, c: "#38bdf8" },
 { lab: "Power", tH: 44, rH: 150, c: "#facc15" },
 ];
 pairs.forEach((p, i) => {
 const y = 70 + i * 70;
 ctx.fillStyle = "#44403c";
 roundRect(ctx, w * 0.08, y, w * 0.38, 28, 6);
 ctx.fill();
 ctx.fillStyle = p.c;
 roundRect(ctx, w * 0.08, y, 36 + p.tH * t * 0.9, 28, 6);
 ctx.fill();
 ctx.fillStyle = "#44403c";
 roundRect(ctx, w * 0.54, y, w * 0.38, 28, 6);
 ctx.fill();
 ctx.fillStyle = p.c;
 roundRect(ctx, w * 0.54, y, 36 + p.rH * t * 0.9, 28, 6);
 ctx.fill();
 ctx.fillStyle = "#fff7ed";
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "left";
 ctx.fillText(p.lab, w * 0.1, y - 8);
 });
 ctx.fillStyle = "#fdba74";
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("Tortoise", w * 0.27, h - 24);
 ctx.fillText("Rabbit", w * 0.73, h - 24);
 drawLabel(ctx, "Same work, less time = more power.", w * 0.5, 28);
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("pushGears", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 setDescription("Fixed power. Trade force for speed with gears.");
 setIntentHandler((intent) => {
 if (intent.type !== "CANVAS_TAP") return;
 if (intent.meta?.action === "gear") {
 if (forceLabState.ppGearGo) return;
 forceLabState.ppGear = forceLabState.ppGear === "low" ? "high" : "low";
 }
 if (intent.meta?.action === "hill") {
 forceLabState.ppDest = "hill";
 startGearRun();
 }
 if (intent.meta?.action === "flat") {
 forceLabState.ppDest = "flat";
 startGearRun();
 }
 });
 function startGearRun() {
 forceLabState.ppGearGo = true;
 forceLabState.ppGearT0 = performance.now();
 forceLabState.ppCarX = 0;
 forceLabState.ppStalled = false;
 }
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const world = drawHillWorld(ctx, w, h);
 const gear = forceLabState.ppGear || "low";
 const dest = forceLabState.ppDest || "hill";
 const hill = dest === "hill";
 if (forceLabState.ppGearGo) {
 const elapsed = (performance.now() - (forceLabState.ppGearT0 || 0)) / 1000;
 if (hill && gear === "low") {
 forceLabState.ppStalled = false;
 forceLabState.ppCarX = Math.min(0.68, elapsed * 0.34);
 if (elapsed > 2.1) finishGear(true);
 } else if (hill && gear === "high") {
 if (elapsed < 0.9) {
 forceLabState.ppStalled = false;
 forceLabState.ppCarX = elapsed * 0.2;
 } else {
 forceLabState.ppStalled = true;
 forceLabState.ppCarX = Math.max(0, 0.18 - (elapsed - 0.9) * 0.32);
 }
 if (elapsed > 2.4) finishGear(false);
 } else {
 forceLabState.ppStalled = false;
 const vmax = gear === "high" ? 0.42 : 0.18;
 forceLabState.ppCarX = Math.min(0.78, elapsed * vmax);
 if (elapsed > 1.9) finishGear(true);
 }
 }
 function finishGear(ok) {
 if (!forceLabState.ppGearGo) return;
 forceLabState.ppGearGo = false;
 if (gear === "low" && hill) forceLabState.ppLowHill = true;
 if (gear === "high" && hill) forceLabState.ppHighHill = true;
 if (gear === "high" && !hill) forceLabState.ppHighFlat = true;
 if (gear === "low" && !hill) forceLabState.ppLowFlat = true;
 if (ok) pulseSuccessFeedback(220);
 else pulseFailFeedback(320);
 }
 const u = forceLabState.ppCarX || 0;
 let roadX;
 let roadY;
 let ang = 0;
 let flip = false;
 if (hill || (!forceLabState.ppGearGo && dest === "hill")) {
 roadX = world.junction.x + (world.peak.x - world.junction.x) * u;
 roadY = world.junction.y + (world.peak.y - world.junction.y) * u;
 ang = Math.atan2(world.junction.y - world.peak.y, world.junction.x - world.peak.x);
 flip = true;
 } else {
 roadX = world.junction.x + (world.end.x - world.junction.x) * Math.max(0.08, u);
 roadY = world.junction.y;
 ang = 0;
 }
 if (!forceLabState.ppGearGo && dest === "flat" && u < 0.02) {
 roadX = world.junction.x + 40;
 roadY = world.junction.y;
 ang = 0;
 flip = false;
 }
 const sit = 12;
 drawCar(ctx, roadX, roadY - sit, 0.9, gear === "low" ? "#f97316" : "#38bdf8", {
 angle: flip ? ang : 0,
 flip,
 moving: !!forceLabState.ppGearGo,
 });
 let mood = null;
 if ((hill && gear === "high" && (forceLabState.ppGearGo || forceLabState.ppStalled)) || forceLabState.ppStalled) {
 mood = "sad";
 } else if (forceLabState.ppGearGo || (hill && u > 0.4) || (!hill && u > 0.15)) {
 mood = "happy";
 }
 drawMoodPair(ctx, w - 78, 92, mood);
 const ax = roadX;
 const ay = roadY - 40;
 if (hill && gear === "high" && (forceLabState.ppStalled || forceLabState.ppGearGo)) {
 const down = Math.atan2(world.junction.y - world.peak.y, world.junction.x - world.peak.x);
 drawArrow(ctx, ax, ay, ax + Math.cos(down) * 56, ay + Math.sin(down) * 40, "#fb7185", 5);
 drawLabel(ctx, "gravity", ax + 18, ay - 22, { h: 22, font: "700 11px Segoe UI" });
 }
 if (hill && gear === "low" && forceLabState.ppGearGo) {
 const up = Math.atan2(world.peak.y - world.junction.y, world.peak.x - world.junction.x);
 drawArrow(ctx, ax, ay, ax + Math.cos(up) * 42, ay + Math.sin(up) * 32, "#22c55e", 4);
 }
 roundRect(ctx, w * 0.2, 16, w * 0.6, 16, 8);
 ctx.fillStyle = "#1c1917";
 ctx.fill();
 ctx.fillStyle = "#facc15";
 roundRect(ctx, w * 0.2, 16, w * 0.6 * 0.92, 16, 8);
 ctx.fill();
 drawLabel(ctx, "Power (fixed)", w * 0.5, 48, { h: 20, font: "700 11px Segoe UI" });
 const msg = forceLabState.ppStalled
 ? "High gear on the hill: gravity pushes the car back. Not enough force."
 : `${gear === "low" ? "Low gear: high force, low speed." : "High gear: low force, high speed."}`;
 drawLabel(ctx, msg, w * 0.5, h - 88, { font: "600 12px Segoe UI, sans-serif", h: 28 });
 drawCanvasBtn(ctx, w * 0.22, h - 40, 150, 40, gear === "low" ? "Gear: Low" : "Gear: High", true);
 drawCanvasBtn(ctx, w * 0.5, h - 40, 140, 40, "Climb hill", dest === "hill");
 drawCanvasBtn(ctx, w * 0.78, h - 40, 140, 40, "Cruise road", dest === "flat");
 setHitRegions([
 { id: "gear", shape: "rect", x: w * 0.22, y: h - 40, w: 160, h: 44, meta: { action: "gear" } },
 { id: "hill", shape: "rect", x: w * 0.5, y: h - 40, w: 150, h: 44, meta: { action: "hill" } },
 { id: "flat", shape: "rect", x: w * 0.78, y: h - 40, w: 150, h: 44, meta: { action: "flat" } },
 ]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("pushTrade", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 const start = performance.now();
 setDescription("For fixed power, force and speed trade off.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 const phase = forceLabState.phase || "see";
 ctx.fillStyle = "#1c1917";
 ctx.fillRect(0, 0, w, h);
 if (phase === "word") {
 ctx.fillStyle = "#fdba74";
 ctx.font = "700 18px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.fillText("Power = Force × Velocity", w * 0.5, h * 0.4);
 drawLabel(ctx, "If power stays fixed, more force means less speed.", w * 0.5, h * 0.62, {
 font: "600 12px Segoe UI, sans-serif",
 h: 28,
 });
 } else {
 const tilt = Math.sin(t * 0.9) * 0.28;
 const cx = w * 0.5;
 const cy = h * 0.52;
 ctx.fillStyle = "#facc15";
 ctx.beginPath();
 ctx.arc(cx, cy, 14, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "#fb923c";
 ctx.lineWidth = 10;
 ctx.beginPath();
 ctx.moveTo(cx - Math.cos(tilt) * 120, cy - Math.sin(tilt) * 120);
 ctx.lineTo(cx + Math.cos(tilt) * 120, cy + Math.sin(tilt) * 120);
 ctx.stroke();
 ctx.fillStyle = "#fff7ed";
 ctx.font = "700 14px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("Force", cx - 110, cy - 40);
 ctx.fillText("Speed", cx + 110, cy - 40);
 ctx.fillText("Power", cx, cy + 36);
 drawLabel(ctx, "The pivot never moves. That is the power budget.", w * 0.5, 28);
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("pushFriends", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 setDescription("Same stalled car. Alone is slow. Friends finish faster.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DOWN" && intent.meta?.action === "push") forceLabState.ppPushCar = true;
 if ((intent.type === "CANVAS_UP" || intent.type === "CANVAS_TAP") && intent.meta?.action === "push") {
 forceLabState.ppPushCar = false;
 }
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "friends") {
 if (!forceLabState.ppCarAloneDone) return;
 forceLabState.ppFriends = 4;
 forceLabState.ppCarPos = 0.2;
 forceLabState.ppPushCar = false;
 pulseSuccessFeedback(200);
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const roadY = h * 0.58;
 drawStreet(ctx, w, h, roadY);
 ctx.fillStyle = "#94a3b8";
 ctx.fillRect(w * 0.78, roadY - 36, 14, 36);
 const n = forceLabState.ppFriends || 1;
 const rate = n === 1 ? 0.0017 : 0.006;
 if (forceLabState.ppPushCar) {
 forceLabState.ppCarPos = Math.min(0.78, (forceLabState.ppCarPos || 0.2) + rate);
 }
 if ((forceLabState.ppCarPos || 0) >= 0.78) {
 if (n === 1) forceLabState.ppCarAloneDone = true;
 else forceLabState.ppCarFriendsDone = true;
 forceLabState.ppPushCar = false;
 }
 const x = (forceLabState.ppCarPos || 0.2) * w;
 const placed = roadOnGround(x, roadY + 16, 0, 1.05);
 drawCar(ctx, placed.x, placed.y, 1.05, "#64748b", { moving: !!forceLabState.ppPushCar });
 for (let i = 0; i < n; i++) {
 ctx.fillStyle = "#fde68a";
 ctx.beginPath();
 ctx.arc(x - 58 - i * 16, roadY - 4, 7, 0, Math.PI * 2);
 ctx.fill();
 }
 drawLabel(
 ctx,
 n === 1
 ? "Alone: modest force, long time. Same work still waits."
 : "Friends added. Same car, same distance, much less time. More power.",
 w * 0.5,
 28,
 { font: "600 12px Segoe UI, sans-serif", h: 32 },
 );
 drawCanvasBtn(ctx, w * 0.3, h - 40, 160, 40, "Hold to push", !!forceLabState.ppPushCar);
 drawCanvasBtn(ctx, w * 0.72, h - 40, 180, 40, n > 1 ? "Friends in" : "Recruit friends", n > 1);
 setHitRegions([
 { id: "push", shape: "rect", x: w * 0.3, y: h - 40, w: 170, h: 44, meta: { action: "push" } },
 { id: "friends", shape: "rect", x: w * 0.72, y: h - 40, w: 190, h: 44, meta: { action: "friends" } },
 ]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("pushScale", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 const start = performance.now();
 setDescription("Watts, from a stroll to a rocket.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const phase = forceLabState.phase || "scale";
 ctx.fillStyle = "#0f172a";
 ctx.fillRect(0, 0, w, h);
 if (phase === "card") {
 pictureFrame(ctx, w * 0.06, h * 0.18, w * 0.4, h * 0.56);
 pictureFrame(ctx, w * 0.54, h * 0.18, w * 0.4, h * 0.56);
 ctx.fillStyle = "#c2410c";
 ctx.font = "800 20px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.fillText("Force (N)", w * 0.26, h * 0.3);
 ctx.fillText("Power (W)", w * 0.74, h * 0.3);
 drawArrow(ctx, w * 0.12, h * 0.48, w * 0.4, h * 0.48, "#f97316", 7);
 ctx.save();
 ctx.translate(w * 0.74, h * 0.5);
 ctx.strokeStyle = "#facc15";
 ctx.lineWidth = 4;
 ctx.beginPath();
 ctx.arc(0, 0, 22, 0, Math.PI * 1.7);
 ctx.stroke();
 ctx.fillStyle = "#facc15";
 ctx.beginPath();
 ctx.moveTo(0, 0);
 ctx.lineTo(0, -14);
 ctx.lineTo(8, 0);
 ctx.fill();
 ctx.restore();
 ctx.fillStyle = "#7c2d12";
 ctx.font = "600 13px Segoe UI, sans-serif";
 ctx.fillText("a push or pull", w * 0.26, h * 0.64);
 ctx.fillText("how fast work gets done", w * 0.74, h * 0.64);
 drawLabel(ctx, "1 horsepower ≈ 746 watts", w * 0.5, h * 0.86);
 } else {
 const items = [
 { lab: "Lightbulb", sub: "~60 W", draw: drawBulbIcon },
 { lab: "Walking", sub: "~100 W", draw: drawWalkIcon },
 { lab: "Sprint bike", sub: "~350 W", draw: drawBikeIcon },
 { lab: "Car engine", sub: "~75 kW", draw: (c, x, y) => drawCar(c, x, y + 8, 0.42, "#64748b") },
 { lab: "Rocket", sub: "billions of W", draw: drawRocketIcon },
 ];
 const u = Math.min(1, (performance.now() - start) / 1400);
 const gap = 8;
 const cols = w < 540 ? 3 : 5;
 const cw = (w - 24 - gap * (cols - 1)) / cols;
 const ch = Math.min(h * 0.38, 170);
 items.forEach((it, i) => {
 if (u < i / items.length) return;
 const col = i % cols;
 const row = Math.floor(i / cols);
 const x = 12 + col * (cw + gap);
 const y = 48 + row * (ch + 10);
 pictureFrame(ctx, x, y, cw, ch);
 it.draw(ctx, x + cw / 2, y + ch * 0.42);
 ctx.fillStyle = "#7c2d12";
 ctx.font = "700 11px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.fillText(it.lab, x + cw / 2, y + ch - 36);
 ctx.fillStyle = "#c2410c";
 ctx.font = "800 13px Segoe UI, sans-serif";
 ctx.fillText(it.sub, x + cw / 2, y + ch - 16);
 });
 drawLabel(ctx, "Power is how fast something can do work.", w * 0.5, 28);
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("pushClose", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 const start = performance.now();
 setDescription("Force moves the rock. Power is how quickly the job is done.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 forceLabState.ppCloseU = Math.min(1, t / 3);
 fillSkyGrass(ctx, w, h, t);
 const gy = h * 0.62;
 const x = w * (0.28 + Math.min(0.4, t * 0.12));
 drawLazyRock(ctx, x, gy - 8, 1.1, { moving: true, sleepy: false });
 drawArrow(ctx, x - 70, gy - 20, x - 28, gy - 20, "#f97316", 6);
 if (t > 0.7) drawLabel(ctx, "Force", x - 80, gy - 48);
 if (t > 1.4) drawLabel(ctx, "distance", w * 0.55, gy + 36);
 if (t > 2.1) drawLabel(ctx, "Power (stopwatch)", w * 0.78, 40);
 ctx.fillStyle = "#fff7ed";
 ctx.font = "700 16px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(`${Math.min(9, Math.floor(t * 3))}s`, w * 0.78, 70);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("pushSpiral", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const start = performance.now();
 const stops = [
 { id: 1, label: "1 Force", caption: "Spiral 1: a push is direction plus strength" },
 { id: 2, label: "2 Power", caption: "Spiral 2: same work, less time, more power" },
 { id: 3, label: "3 Gears", caption: "Spiral 3: fixed power, force vs speed" },
 { id: 4, label: "4 Why", caption: "Spiral 4: friends, watts, horsepower" },
 ];
 setDescription("Recap map of the four Push Power spirals.");
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
 return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, cx, cy };
 }
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 const stop = forceLabState.spiralStop || 0;
 fillSkyGrass(ctx, w, h, t);
 ctx.strokeStyle = "rgba(249,115,22,0.55)";
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
 ctx.fillStyle = "rgba(41,37,36,0.55)";
 ctx.fill();
 if (stop === 1) drawArrow(ctx, origin.cx - 20, origin.cy, origin.cx + 22, origin.cy, "#f97316", 5);
 if (stop === 2) {
 drawTurtle(ctx, origin.cx - 16, origin.cy);
 drawRabbit(ctx, origin.cx + 18, origin.cy);
 }
 if (stop === 3) drawCar(ctx, origin.cx, origin.cy, 0.45);
 if (stop === 4) {
 ctx.fillStyle = "#facc15";
 ctx.font = "800 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("W", origin.cx, origin.cy + 4);
 }
 const hits = [];
 stops.forEach((s, i) => {
 const p = polar(i, w, h);
 ctx.fillStyle = stop === s.id ? "#f97316" : "#9a3412";
 ctx.beginPath();
 ctx.arc(p.x, p.y, 22, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#fff7ed";
 ctx.font = "800 16px Segoe UI";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(String(s.id), p.x, p.y + 1);
 hits.push({ id: `stop-${s.id}`, shape: "ellipse", x: p.x, y: p.y, r: 36, meta: { action: "spiral", stop: s.id } });
 });
 if (stop) {
 const cap = stops.find((s) => s.id === stop);
 if (cap) drawLabel(ctx, cap.caption, w * 0.5, 28, { font: "600 12px Segoe UI, sans-serif", h: 28 });
 }
 const fx = w * 0.5;
 const fy = h - 34;
 const fw = Math.min(280, w * 0.76);
 roundRect(ctx, fx - fw / 2, fy - 22, fw, 44, 12);
 ctx.fillStyle = "#ea580c";
 ctx.fill();
 ctx.fillStyle = "#fff7ed";
 ctx.font = "800 16px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.fillText("Finish Push Power", fx, fy);
 hits.push({ id: "spiral-finish", shape: "rect", x: fx, y: fy, w: fw, h: 44, meta: { action: "spiralFinish" } });
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 if (typeof arena.registerAlias === "function") {
 arena.registerAlias("pushMeet", "pushOpen");
 arena.registerAlias("pushSort", "pushForce");
 arena.registerAlias("pushCrate", "pushRace");
 arena.registerAlias("pushSim", "pushGears");
 arena.registerAlias("pushRule", "pushWork");
 arena.registerAlias("pushStretch", "pushTrade");
 arena.registerAlias("pushMyth", "pushScale");
 arena.registerAlias("pushDrill", "pushFriends");
 arena.registerAlias("pushMastery", "pushSpiral");
 }
}
