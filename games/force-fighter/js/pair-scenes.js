/**
 * Force Fighter Mission 3: Push & Pull
 * Canvas 2D. Realistic door, rope, bridge, and Newton 3 examples.
 */
import { forceLabState, pulseFailFeedback, pulseSuccessFeedback } from "./force-state.js?v=pairvis6";
import { mountDoor3D, syncDoor3D } from "./door-3d-mount.js?v=pairvis6";

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
 ctx.strokeStyle = opts.border || "rgba(167,139,250,0.55)";
 ctx.lineWidth = 1.4;
 ctx.stroke();
 ctx.fillStyle = opts.color || "#f5f3ff";
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
 ctx.fillStyle = `rgba(167,139,250,${Math.max(0, (until - performance.now()) / 380) * 0.25})`;
 ctx.fillRect(0, 0, w, h);
}

function drawArrow(ctx, x1, y1, x2, y2, color = "#a78bfa", width = 4) {
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
 ctx.fillStyle = lit ? "#7c3aed" : "#4c1d95";
 ctx.fill();
 ctx.strokeStyle = "rgba(221,214,254,0.75)";
 ctx.lineWidth = 1.6;
 ctx.stroke();
 ctx.fillStyle = "#f5f3ff";
 ctx.font = "800 13px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(label, x, y + 1);
}

function pictureFrame(ctx, x, y, cw, ch) {
 roundRect(ctx, x, y, cw, ch, 12);
 ctx.fillStyle = "#fff7ed";
 ctx.fill();
 ctx.strokeStyle = "rgba(124,58,237,0.35)";
 ctx.lineWidth = 2;
 ctx.stroke();
}

function fillHallway(ctx, w, h) {
 const g = ctx.createLinearGradient(0, 0, 0, h);
 g.addColorStop(0, "#e7e5e4");
 g.addColorStop(0.45, "#d6d3d1");
 g.addColorStop(1, "#a8a29e");
 ctx.fillStyle = g;
 ctx.fillRect(0, 0, w, h);
 ctx.fillStyle = "#78716c";
 ctx.fillRect(0, h * 0.74, w, h * 0.26);
 ctx.fillStyle = "#57534e";
 for (let i = 0; i < w / 42; i++) {
 ctx.fillRect(i * 42, h * 0.74, 40, h * 0.26);
 ctx.fillStyle = "rgba(28,25,23,0.12)";
 ctx.fillRect(i * 42 + 20, h * 0.74, 2, h * 0.26);
 ctx.fillStyle = "#57534e";
 }
 ctx.fillStyle = "#fafaf9";
 ctx.fillRect(0, 0, w, h * 0.12);
 ctx.fillStyle = "#d4d4d8";
 ctx.fillRect(0, h * 0.12, w, 6);
 ctx.fillStyle = "rgba(124,58,237,0.08)";
 ctx.fillRect(w * 0.08, h * 0.14, w * 0.84, h * 0.58);
}

function drawDoorIcon(ctx, cx, cy) {
 ctx.save();
 ctx.translate(cx - 11, cy - 17);
 ctx.fillStyle = "#92400e";
 roundRect(ctx, 0, 0, 22, 34, 3);
 ctx.fill();
 ctx.fillStyle = "#fbbf24";
 ctx.beginPath();
 ctx.arc(17, 17, 2.5, 0, Math.PI * 2);
 ctx.fill();
 ctx.restore();
}

function drawCoilSpring(ctx, x0, y, x1, squeezed) {
 const coils = 14;
 const amp = squeezed ? 14 : 22;
 ctx.strokeStyle = "#71717a";
 ctx.lineWidth = 4;
 ctx.lineCap = "round";
 ctx.beginPath();
 ctx.moveTo(x0, y);
 for (let i = 1; i <= coils * 2; i++) {
 const t = i / (coils * 2);
 const x = x0 + (x1 - x0) * t;
 ctx.lineTo(x, y + (i % 2 === 0 ? -amp : amp));
 }
 ctx.stroke();
 ctx.fillStyle = "#52525b";
 roundRect(ctx, x0 - 14, y - 28, 12, 56, 3);
 ctx.fill();
 ctx.fillStyle = "#7c3aed";
 ctx.beginPath();
 ctx.arc(x1, y, 12, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "#a8a29e";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.arc(x1, y, 5, 0, Math.PI * 2);
 ctx.stroke();
}

function drawBoxPush(ctx, cx, cy, s = 1) {
 ctx.save();
 ctx.translate(cx, cy);
 ctx.scale(s, s);
 ctx.fillStyle = "#d6d3d1";
 roundRect(ctx, -34, -22, 68, 44, 4);
 ctx.fill();
 ctx.strokeStyle = "#a8a29e";
 ctx.lineWidth = 1.5;
 ctx.beginPath();
 ctx.moveTo(-34, -6);
 ctx.lineTo(34, -6);
 ctx.moveTo(-34, 10);
 ctx.lineTo(34, 10);
 ctx.stroke();
 ctx.fillStyle = "#fde68a";
 roundRect(ctx, -18, -38, 36, 18, 3);
 ctx.fill();
 drawArrow(ctx, -58, 0, -38, 0, "#f97316", 4);
 ctx.restore();
}

function drawWagonPull(ctx, cx, cy, s = 1) {
 ctx.save();
 ctx.translate(cx, cy);
 ctx.scale(s, s);
 ctx.fillStyle = "#dc2626";
 roundRect(ctx, -30, -8, 60, 28, 6);
 ctx.fill();
 ctx.fillStyle = "#1c1917";
 ctx.beginPath();
 ctx.arc(-18, 22, 7, 0, Math.PI * 2);
 ctx.arc(18, 22, 7, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "#78716c";
 ctx.lineWidth = 4;
 ctx.beginPath();
 ctx.moveTo(30, 0);
 ctx.lineTo(52, -18);
 ctx.stroke();
 drawArrow(ctx, 62, -18, 42, -18, "#38bdf8", 4);
 ctx.restore();
}

function drawDoorPushMini(ctx, cx, cy, s = 1) {
 ctx.save();
 ctx.translate(cx, cy);
 ctx.scale(s, s);
 ctx.fillStyle = "#44403c";
 ctx.fillRect(-8, -38, 10, 76);
 ctx.fillStyle = "#92400e";
 roundRect(ctx, 2, -36, 28, 72, 3);
 ctx.fill();
 ctx.fillStyle = "#fbbf24";
 ctx.beginPath();
 ctx.arc(24, 0, 3, 0, Math.PI * 2);
 ctx.fill();
 drawArrow(ctx, -42, 0, -4, 0, "#f97316", 4);
 ctx.restore();
}

function drawDrawerPull(ctx, cx, cy, s = 1) {
 ctx.save();
 ctx.translate(cx, cy);
 ctx.scale(s, s);
 ctx.fillStyle = "#78716c";
 roundRect(ctx, -38, -28, 76, 56, 4);
 ctx.fill();
 ctx.fillStyle = "#a8a29e";
 roundRect(ctx, -32, -8, 64, 28, 3);
 ctx.fill();
 ctx.fillStyle = "#44403c";
 roundRect(ctx, -8, 2, 16, 6, 2);
 ctx.fill();
 drawArrow(ctx, 48, 6, 28, 6, "#38bdf8", 4);
 ctx.restore();
}

function drawCart(ctx, x, y) {
 ctx.fillStyle = "rgba(28,25,23,0.25)";
 ctx.beginPath();
 ctx.ellipse(x, y + 16, 34, 7, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#9a3412";
 roundRect(ctx, x - 32, y - 20, 64, 36, 5);
 ctx.fill();
 ctx.strokeStyle = "#fed7aa";
 ctx.lineWidth = 1.4;
 ctx.strokeRect(x - 26, y - 14, 52, 14);
 ctx.fillStyle = "#1c1917";
 ctx.beginPath();
 ctx.arc(x - 18, y + 14, 8, 0, Math.PI * 2);
 ctx.arc(x + 18, y + 14, 8, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#a8a29e";
 ctx.beginPath();
 ctx.arc(x - 18, y + 14, 3, 0, Math.PI * 2);
 ctx.arc(x + 18, y + 14, 3, 0, Math.PI * 2);
 ctx.fill();
}

function drawBraidedRope(ctx, x0, y0, x1, y1, crumple) {
 ctx.strokeStyle = "#d6d3d1";
 ctx.lineWidth = 5;
 ctx.lineCap = "round";
 ctx.beginPath();
 ctx.moveTo(x0, y0);
 const n = 16;
 for (let i = 1; i <= n; i++) {
 const t = i / n;
 const x = x0 + (x1 - x0) * t;
 const sag = crumple * 40 * Math.sin(t * Math.PI) + crumple * 10 * Math.sin(t * 11 + performance.now() / 120);
 ctx.lineTo(x, y0 + sag);
 }
 ctx.stroke();
 ctx.strokeStyle = "rgba(120,113,108,0.5)";
 ctx.lineWidth = 2;
 for (let i = 0; i < 8; i++) {
 const t = (i + 0.5) / 8;
 ctx.beginPath();
 ctx.moveTo(x0 + (x1 - x0) * t, y0 - 3);
 ctx.lineTo(x0 + (x1 - x0) * (t + 0.04), y0 + 3);
 ctx.stroke();
 }
}

function drawWoodenRod(ctx, x0, y, x1) {
 ctx.fillStyle = "#92400e";
 ctx.fillRect(x0, y - 6, x1 - x0, 12);
 ctx.strokeStyle = "#78350f";
 ctx.lineWidth = 1;
 for (let i = x0; i < x1; i += 14) {
 ctx.beginPath();
 ctx.moveTo(i, y - 6);
 ctx.lineTo(i, y + 6);
 ctx.stroke();
 }
}

function drawFloppy(ctx, x0, y0, x1, y1, crumple) {
 drawBraidedRope(ctx, x0, y0, x1, y1, crumple);
}

function drawSkater(ctx, x, y, facing = 1, heavy = false) {
 const s = heavy ? 1.15 : 1;
 ctx.fillStyle = "rgba(28,25,23,0.2)";
 ctx.beginPath();
 ctx.ellipse(x, y + 18, 14 * s, 4, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = facing > 0 ? "#7c3aed" : "#6366f1";
 ctx.beginPath();
 ctx.arc(x, y - 30 * s, 11 * s, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#e7e5e4";
 ctx.beginPath();
 ctx.arc(x, y - 32 * s, 9 * s, Math.PI, 0);
 ctx.fill();
 ctx.fillStyle = facing > 0 ? "#a78bfa" : "#818cf8";
 roundRect(ctx, x - 11 * s, y - 18 * s, 22 * s, 30 * s, 4);
 ctx.fill();
 ctx.strokeStyle = "#cbd5e1";
 ctx.lineWidth = 3;
 ctx.lineCap = "round";
 ctx.beginPath();
 ctx.moveTo(x - 14 * facing, y + 12 * s);
 ctx.lineTo(x + 18 * facing, y + 12 * s);
 ctx.stroke();
 ctx.fillStyle = "#1c1917";
 roundRect(ctx, x + 8 * facing, y - 16 * s, 14 * facing, 4, 2);
 ctx.fill();
}

function drawCarSmall(ctx, x, y) {
 ctx.fillStyle = "#64748b";
 roundRect(ctx, x - 22, y - 10, 44, 18, 5);
 ctx.fill();
 ctx.fillStyle = "#1e3a8a";
 roundRect(ctx, x - 6, y - 22, 24, 14, 4);
 ctx.fill();
 ctx.fillStyle = "#1c1917";
 ctx.beginPath();
 ctx.arc(x - 12, y + 10, 5, 0, Math.PI * 2);
 ctx.arc(x + 12, y + 10, 5, 0, Math.PI * 2);
 ctx.fill();
}

function drawSwimmerPair(ctx, cx, cy, s = 1) {
 ctx.save();
 ctx.translate(cx, cy);
 ctx.scale(s, s);
 ctx.fillStyle = "#0ea5e9";
 ctx.beginPath();
 ctx.ellipse(0, 18, 52, 14, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#fde68a";
 ctx.beginPath();
 ctx.arc(-8, -8, 10, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#ef4444";
 roundRect(ctx, -18, 2, 36, 20, 6);
 ctx.fill();
 ctx.strokeStyle = "#fde68a";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.moveTo(-20, 8);
 ctx.lineTo(-48, 14);
 ctx.moveTo(20, 8);
 ctx.lineTo(48, 14);
 ctx.stroke();
 drawArrow(ctx, -48, 14, -68, 14, "#f97316", 3);
 drawArrow(ctx, 8, -8, 38, -8, "#38bdf8", 3);
 ctx.restore();
}

function drawRowboatPair(ctx, cx, cy, s = 1) {
 ctx.save();
 ctx.translate(cx, cy);
 ctx.scale(s, s);
 ctx.fillStyle = "#38bdf8";
 ctx.beginPath();
 ctx.ellipse(0, 22, 50, 10, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#92400e";
 ctx.beginPath();
 ctx.moveTo(-42, 18);
 ctx.quadraticCurveTo(0, 34, 42, 18);
 ctx.lineTo(38, 12);
 ctx.lineTo(-38, 12);
 ctx.closePath();
 ctx.fill();
 ctx.fillStyle = "#fde68a";
 ctx.beginPath();
 ctx.arc(-6, -6, 8, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "#78716c";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.moveTo(8, 0);
 ctx.lineTo(36, -20);
 ctx.stroke();
 drawArrow(ctx, 36, -20, 56, -20, "#f97316", 3);
 drawArrow(ctx, -20, 8, 20, 8, "#38bdf8", 3);
 ctx.restore();
}

function drawRocketPair(ctx, cx, cy, s = 1) {
 ctx.save();
 ctx.translate(cx, cy);
 ctx.scale(s, s);
 const flicker = 12 + Math.sin(performance.now() / 70) * 5;
 ctx.fillStyle = "#fb923c";
 ctx.beginPath();
 ctx.moveTo(0, 28);
 ctx.lineTo(-10, 28 + flicker);
 ctx.lineTo(10, 28 + flicker);
 ctx.closePath();
 ctx.fill();
 ctx.fillStyle = "#e7e5e4";
 ctx.beginPath();
 ctx.moveTo(0, -28);
 ctx.lineTo(12, 16);
 ctx.lineTo(-12, 16);
 ctx.closePath();
 ctx.fill();
 ctx.fillStyle = "#38bdf8";
 ctx.beginPath();
 ctx.arc(0, -4, 5, 0, Math.PI * 2);
 ctx.fill();
 drawArrow(ctx, 0, 28, 0, 48, "#f97316", 3);
 drawArrow(ctx, 0, -28, 0, -48, "#38bdf8", 3);
 ctx.restore();
}

function drawWallPushPair(ctx, cx, cy, s = 1) {
 ctx.save();
 ctx.translate(cx, cy);
 ctx.scale(s, s);
 ctx.fillStyle = "#78716c";
 ctx.fillRect(24, -36, 18, 72);
 ctx.fillStyle = "#a8a29e";
 for (let row = 0; row < 6; row++) {
 for (let col = 0; col < 2; col++) {
 ctx.strokeRect(26 + col * 8 + (row % 2 ? 4 : 0), -34 + row * 12, 8, 10);
 }
 }
 ctx.fillStyle = "#fde68a";
 ctx.beginPath();
 ctx.arc(-16, -10, 9, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#6366f1";
 roundRect(ctx, -22, 0, 20, 28, 4);
 ctx.fill();
 drawArrow(ctx, -8, -6, 22, -6, "#f97316", 3);
 drawArrow(ctx, 22, -6, -8, -6, "#38bdf8", 3);
 ctx.restore();
}

function drawBridgeWorld(ctx, w, h) {
 const g = ctx.createLinearGradient(0, 0, 0, h);
 g.addColorStop(0, "#7dd3fc");
 g.addColorStop(0.55, "#bae6fd");
 g.addColorStop(1, "#0ea5e9");
 ctx.fillStyle = g;
 ctx.fillRect(0, 0, w, h);
 ctx.fillStyle = "#166534";
 ctx.fillRect(0, h * 0.68, w, h * 0.32);
 ctx.fillStyle = "#0ea5e9";
 ctx.fillRect(0, h * 0.62, w, h * 0.1);
 ctx.fillStyle = "rgba(125,211,252,0.35)";
 for (let i = 0; i < 6; i++) {
 ctx.beginPath();
 ctx.ellipse(w * (0.1 + i * 0.16), h * 0.66, 30, 6, 0, 0, Math.PI * 2);
 ctx.fill();
 }
}

function drawBridgeTower(ctx, x, baseY, hgt) {
 ctx.fillStyle = "#57534e";
 ctx.beginPath();
 ctx.moveTo(x - 18, baseY);
 ctx.lineTo(x - 12, baseY - hgt);
 ctx.lineTo(x + 12, baseY - hgt);
 ctx.lineTo(x + 18, baseY);
 ctx.closePath();
 ctx.fill();
 ctx.fillStyle = "#78716c";
 ctx.fillRect(x - 14, baseY - hgt + 8, 28, 8);
 ctx.fillStyle = "#a8a29e";
 ctx.beginPath();
 ctx.moveTo(x - 20, baseY - hgt - 4);
 ctx.lineTo(x, baseY - hgt - 16);
 ctx.lineTo(x + 20, baseY - hgt - 4);
 ctx.closePath();
 ctx.fill();
}

function cableBezierPoint(t, leftX, midX, rightX, topY, sagY) {
 const u = 1 - t;
 return {
 x: u * u * leftX + 2 * u * t * midX + t * t * rightX,
 y: u * u * topY + 2 * u * t * sagY + t * t * topY,
 };
}

function drawSuspensionBridge(ctx, w, h, opts = {}) {
 drawBridgeWorld(ctx, w, h);
 const leftX = w * 0.18;
 const rightX = w * 0.82;
 const midX = (leftX + rightX) / 2;
 const deckY = h * 0.52;
 const deckH = 14;
 const towerH = h * 0.28;
 const topY = deckY - towerH - 16;
 const sagY = deckY + 34;
 const span = rightX - leftX;

 if (opts.pillars && !opts.wrong) {
 ctx.fillStyle = "#78716c";
 ctx.fillRect(leftX - 10, deckY + deckH - 2, 20, h * 0.2);
 ctx.fillRect(rightX - 10, deckY + deckH - 2, 20, h * 0.2);
 ctx.fillStyle = "#57534e";
 ctx.fillRect(leftX - 14, deckY + h * 0.18, 28, 10);
 ctx.fillRect(rightX - 14, deckY + h * 0.18, 28, 10);
 }

 if (opts.cables && !opts.wrong) {
 ctx.fillStyle = "#44403c";
 ctx.fillRect(leftX - 6, deckY, span + 12, deckH);
 ctx.fillStyle = "#57534e";
 ctx.fillRect(leftX - 6, deckY + deckH - 3, span + 12, 3);

 ctx.strokeStyle = "#0f172a";
 ctx.lineWidth = 5;
 ctx.lineCap = "round";
 ctx.beginPath();
 ctx.moveTo(leftX, topY);
 ctx.quadraticCurveTo(midX, sagY, rightX, topY);
 ctx.stroke();
 ctx.strokeStyle = "#334155";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.moveTo(leftX, topY);
 ctx.quadraticCurveTo(midX, sagY, rightX, topY);
 ctx.stroke();

 const suspenderCount = 13;
 for (let i = 0; i <= suspenderCount; i++) {
 const t = i / suspenderCount;
 const p = cableBezierPoint(t, leftX, midX, rightX, topY, sagY);
 ctx.strokeStyle = "#44403c";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.moveTo(p.x, p.y);
 ctx.lineTo(p.x, deckY);
 ctx.stroke();
 ctx.fillStyle = "#78716c";
 ctx.fillRect(p.x - 3, deckY - 2, 6, 4);
 }

 ctx.fillStyle = "#facc15";
 ctx.setLineDash([10, 8]);
 ctx.strokeStyle = "#fde047";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.moveTo(leftX + 8, deckY + 7);
 ctx.lineTo(rightX - 8, deckY + 7);
 ctx.stroke();
 ctx.setLineDash([]);
 }

 if (opts.wrong) {
 ctx.fillStyle = "#44403c";
 ctx.fillRect(leftX - 6, deckY, span + 12, deckH);
 ctx.strokeStyle = "#a8a29e";
 ctx.lineWidth = 4;
 ctx.beginPath();
 ctx.moveTo(leftX, topY);
 ctx.quadraticCurveTo(midX, deckY + 52, rightX, topY);
 ctx.stroke();
 for (let i = 0; i <= 8; i++) {
 const t = i / 8;
 const p = cableBezierPoint(t, leftX, midX, rightX, topY, deckY + 52);
 ctx.strokeStyle = "#a8a29e";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.moveTo(p.x, p.y);
 ctx.lineTo(p.x, deckY);
 ctx.stroke();
 }
 drawLabel(ctx, "Floppy rope cannot hold the deck up.", w * 0.5, h * 0.18, { h: 24, font: "600 11px Segoe UI" });
 }

 drawBridgeTower(ctx, leftX, deckY, towerH);
 drawBridgeTower(ctx, rightX, deckY, towerH);

 return { deckY, deckH, leftX, rightX };
}

function drawCrane(ctx, cx, cy, s = 1) {
 ctx.save();
 ctx.translate(cx, cy);
 ctx.scale(s, s);
 ctx.fillStyle = "#facc15";
 ctx.fillRect(-8, -10, 16, 50);
 ctx.fillStyle = "#64748b";
 ctx.fillRect(-28, 36, 56, 8);
 ctx.fillStyle = "#475569";
 ctx.fillRect(-6, -40, 60, 8);
 ctx.strokeStyle = "#38bdf8";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.moveTo(30, -36);
 ctx.lineTo(30, 10);
 ctx.stroke();
 ctx.fillStyle = "#78716c";
 ctx.fillRect(24, 8, 12, 10);
 drawArrow(ctx, 30, 10, 30, 28, "#38bdf8", 3);
 ctx.fillStyle = "#57534e";
 ctx.fillRect(-6, -40, 8, 48);
 ctx.restore();
}

function drawTent(ctx, cx, cy, s = 1) {
 ctx.save();
 ctx.translate(cx, cy);
 ctx.scale(s, s);
 ctx.fillStyle = "#fde68a";
 ctx.beginPath();
 ctx.moveTo(0, -36);
 ctx.lineTo(-48, 28);
 ctx.lineTo(48, 28);
 ctx.closePath();
 ctx.fill();
 ctx.fillStyle = "#78716c";
 ctx.fillRect(-4, -36, 8, 64);
 ctx.strokeStyle = "#38bdf8";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.moveTo(0, -36);
 ctx.lineTo(-52, 28);
 ctx.moveTo(0, -36);
 ctx.lineTo(52, 28);
 ctx.stroke();
 ctx.fillStyle = "#57534e";
 ctx.fillRect(-6, 28, 12, 14);
 ctx.restore();
}

function drawArmBones(ctx, cx, cy, flex = 0.5) {
 ctx.save();
 ctx.translate(cx, cy);
 ctx.strokeStyle = "#fde68a";
 ctx.lineWidth = 12;
 ctx.lineCap = "round";
 ctx.beginPath();
 ctx.moveTo(-40, 10);
 ctx.lineTo(0, 0);
 ctx.lineTo(40, 10 + (flex - 0.5) * 50);
 ctx.stroke();
 ctx.fillStyle = "#c4b5fd";
 ctx.beginPath();
 ctx.arc(-20, 4, 8, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#a78bfa";
 roundRect(ctx, 8, -8 + (flex - 0.5) * 20, 18, 10, 3);
 ctx.fill();
 ctx.strokeStyle = "#7c3aed";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.moveTo(-20, 4);
 ctx.lineTo(0, 0);
 ctx.stroke();
 ctx.restore();
}

export function registerPairScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("pairOpen", (api) => {
 const { setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const viewport = document.getElementById("viewport");
 setDescription("A closed door. Push it, or pull it?");

 function doorMode() {
 if (!forceLabState.plDoorOpen) return "";
 return forceLabState.plDoorDir > 0 ? "push" : "pull";
 }

 function onDoorAction(mode) {
 forceLabState.plDoorDir = mode === "push" ? 1 : -1;
 forceLabState.plDoorOpen = true;
 pulseSuccessFeedback(240);
 syncDoor3D(doorMode());
 }

 const unmount = mountDoor3D(viewport, onDoorAction);
 syncDoor3D("");

 setIntentHandler(() => {});
 setHitRegions([]);
 setTick(() => syncDoor3D(doorMode()));
 setDispose(() => unmount());
 });

 arena.registerScene("pairSpring", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 setDescription("Squeeze the spring, then stretch it. It fights back both ways.");
 setIntentHandler((intent) => {
 const w = api.width;
 if (intent.type === "CANVAS_DOWN" && intent.meta?.action === "end") forceLabState.plSpringDrag = true;
 if (intent.type === "CANVAS_DRAG" && forceLabState.plSpringDrag) {
 const raw = Math.max(0.3, Math.min(0.78, intent.x / w));
 const rest = 0.52;
 forceLabState.plSpringX = rest + (raw - rest) * 0.72;
 if (forceLabState.plSpringX < 0.46) {
 forceLabState.plSpringPushed = true;
 pulseSuccessFeedback(160);
 }
 if (forceLabState.plSpringX > 0.58) {
 forceLabState.plSpringPulled = true;
 pulseSuccessFeedback(160);
 }
 }
 if (intent.type === "CANVAS_UP") forceLabState.plSpringDrag = false;
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "squeeze") {
 forceLabState.plSpringX = 0.34;
 forceLabState.plSpringPushed = true;
 pulseSuccessFeedback(220);
 }
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "stretch") {
 forceLabState.plSpringX = 0.72;
 forceLabState.plSpringPulled = true;
 pulseSuccessFeedback(220);
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 fillHallway(ctx, w, h);
 if (!forceLabState.plSpringDrag) {
 forceLabState.plSpringX += (0.52 - (forceLabState.plSpringX || 0.52)) * 0.08;
 }
 const wallX = w * 0.14;
 const y = h * 0.48;
 ctx.fillStyle = "#44403c";
 ctx.fillRect(wallX - 22, h * 0.18, 28, h * 0.52);
 const x1 = (forceLabState.plSpringX || 0.52) * w;
 const squeezed = (forceLabState.plSpringX || 0.52) < 0.5;
 drawCoilSpring(ctx, wallX + 8, y, x1, squeezed);
 if (squeezed) drawArrow(ctx, x1 + 20, y, x1 + 76, y, "#f97316", 5);
 else if ((forceLabState.plSpringX || 0.52) > 0.54) drawArrow(ctx, x1 - 20, y, x1 - 76, y, "#38bdf8", 5);
 const line = squeezed
 ? "You pushed it. It squeezed together and pushed back."
 : (forceLabState.plSpringX || 0.52) > 0.54
 ? "You pulled it. It stretched out and pulled back."
 : "Drag the free end: toward the wall to squeeze, away to stretch.";
 drawLabel(ctx, line, w * 0.5, 28, { font: "600 12px Segoe UI, sans-serif", h: 28 });
 drawCanvasBtn(ctx, w * 0.3, h - 40, 150, 40, "Squeeze", !!forceLabState.plSpringPushed);
 drawCanvasBtn(ctx, w * 0.7, h - 40, 150, 40, "Stretch", !!forceLabState.plSpringPulled);
 setHitRegions([
 { id: "end", shape: "ellipse", x: x1, y, r: 28, meta: { action: "end" } },
 { id: "squeeze", shape: "rect", x: w * 0.3, y: h - 40, w: 160, h: 44, meta: { action: "squeeze" } },
 { id: "stretch", shape: "rect", x: w * 0.7, y: h - 40, w: 160, h: 44, meta: { action: "stretch" } },
 ]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("pairDirs", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 setDescription("Push aims away from you. Pull aims toward you.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const phase = forceLabState.phase || "collage";
 ctx.fillStyle = "#1e1b4b";
 ctx.fillRect(0, 0, w, h);
 if (phase === "word") {
 ctx.fillStyle = "#c4b5fd";
 ctx.font = "800 22px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("PUSH", w * 0.28, h * 0.32);
 ctx.fillText("PULL", w * 0.72, h * 0.32);
 drawArrow(ctx, w * 0.16, h * 0.5, w * 0.4, h * 0.5, "#f97316", 8);
 drawArrow(ctx, w * 0.84, h * 0.5, w * 0.6, h * 0.5, "#38bdf8", 8);
 drawLabel(ctx, "Same force. Direction is the only real difference.", w * 0.5, h * 0.78, {
 font: "600 12px Segoe UI, sans-serif",
 h: 28,
 });
 } else {
 const cards = [
 { lab: "Push a box away", draw: drawBoxPush },
 { lab: "Pull a wagon toward you", draw: drawWagonPull },
 { lab: "Push a door away", draw: drawDoorPushMini },
 { lab: "Pull a drawer toward you", draw: drawDrawerPull },
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
 c.draw(ctx, x + cw * 0.5, y + ch * 0.46, Math.min(cw, ch) / 140);
 ctx.fillStyle = "#c4b5fd";
 ctx.font = "700 12px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(c.lab, x + cw * 0.5, y + ch - 16);
 });
 drawLabel(ctx, "Four everyday pushes and pulls stay on screen.", w * 0.5, 24);
 drawLabel(ctx, "Push: away from you. Pull: toward you.", w * 0.5, h - 28, {
 font: "600 12px Segoe UI, sans-serif",
 h: 28,
 });
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("pairRope", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 setDescription("A rope cannot push. The same rope can pull.");
 setIntentHandler((intent) => {
 const w = api.width;
 const mode = forceLabState.plRopeMode || "push";
 if (intent.type === "CANVAS_DOWN" && intent.meta?.action === "rope") forceLabState.plSpringDrag = true;
 if (intent.type === "CANVAS_DRAG" && forceLabState.plSpringDrag) {
 const nx = Math.max(0.22, Math.min(0.88, intent.x / w));
 forceLabState.plRopeEnd = nx;
 if (mode === "push") {
 forceLabState.plRopeCrumple = Math.min(1, forceLabState.plRopeCrumple + 0.04);
 if (forceLabState.plRopeCrumple > 0.45) {
 forceLabState.plRopePushTried = true;
 pulseFailFeedback(200);
 }
 } else if (mode === "pull") {
 if (!forceLabState.plRopePushTried) {
 pulseFailFeedback(280);
 forceLabState.prompt = "First try pushing. Watch the rope crumple.";
 return;
 }
 forceLabState.plRopeCrumple = Math.max(0, forceLabState.plRopeCrumple - 0.06);
 forceLabState.plCartX = Math.max(0.16, Math.min(0.55, nx - 0.22));
 if ((forceLabState.plCartX || 0.28) < 0.22) {
 forceLabState.plRopePullDone = true;
 pulseSuccessFeedback(220);
 }
 } else if (mode === "rod") {
 forceLabState.plCartX = Math.max(0.16, Math.min(0.7, nx - 0.18));
 forceLabState.plRodTried = true;
 pulseSuccessFeedback(160);
 }
 }
 if (intent.type === "CANVAS_UP") forceLabState.plSpringDrag = false;
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "pushTry") {
 forceLabState.plRopeMode = "push";
 forceLabState.plRopeCrumple = 0.85;
 forceLabState.plRopePushTried = true;
 pulseFailFeedback(280);
 }
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "pullTry") {
 if (!forceLabState.plRopePushTried) {
 pulseFailFeedback(280);
 forceLabState.prompt = "First try pushing. Watch the rope crumple.";
 return;
 }
 forceLabState.plRopeMode = "pull";
 forceLabState.plRopeCrumple = 0;
 forceLabState.plCartX = 0.18;
 forceLabState.plRopeEnd = 0.78;
 forceLabState.plRopePullDone = true;
 pulseSuccessFeedback(240);
 }
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "rod") {
 if (!forceLabState.plRopePullDone) {
 pulseFailFeedback(280);
 forceLabState.prompt = "Fail at pushing, then pull. The rod is optional after that.";
 return;
 }
 forceLabState.plRopeMode = "rod";
 forceLabState.plRodTried = true;
 forceLabState.plRopeCrumple = 0;
 pulseSuccessFeedback(200);
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const g = ctx.createLinearGradient(0, 0, 0, h);
 g.addColorStop(0, "#7dd3fc");
 g.addColorStop(0.5, "#bae6fd");
 g.addColorStop(1, "#4ade80");
 ctx.fillStyle = g;
 ctx.fillRect(0, 0, w, h);
 ctx.fillStyle = "#3f3f46";
 ctx.fillRect(0, h * 0.58, w, h * 0.42);
 ctx.strokeStyle = "#facc15";
 ctx.setLineDash([14, 12]);
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.moveTo(0, h * 0.62);
 ctx.lineTo(w, h * 0.62);
 ctx.stroke();
 ctx.setLineDash([]);
 const gy = h * 0.62;
 const cx = (forceLabState.plCartX || 0.28) * w;
 const ex = (forceLabState.plRopeEnd || 0.72) * w;
 drawCart(ctx, cx, gy - 8);
 const mode = forceLabState.plRopeMode || "push";
 if (mode === "rod") {
 drawWoodenRod(ctx, cx + 28, gy - 4, ex);
 drawArrow(ctx, ex, gy - 4, ex + 40, gy - 4, "#f97316", 4);
 } else {
 drawBraidedRope(ctx, cx + 28, gy - 4, ex, gy - 4, mode === "push" ? forceLabState.plRopeCrumple || 0.2 : 0.02);
 if (mode === "pull") drawArrow(ctx, ex, gy - 4, ex + 50, gy - 4, "#38bdf8", 4);
 }
 const msg = mode === "rod"
 ? "A stiff rod can push and pull. It stays straight either way."
 : mode === "pull" && forceLabState.plRopePullDone
 ? "Pulling through the same rope works. It goes tight and drags the cart."
 : forceLabState.plRopePushTried && mode === "push"
 ? "Pushing through a rope just makes it crumple. No force reaches the cart."
 : forceLabState.prompt || "Drag the free end toward the cart. Try to push it.";
 drawLabel(ctx, msg, w * 0.5, 28, { font: "600 12px Segoe UI, sans-serif", h: 32 });
 drawCanvasBtn(ctx, w * 0.2, h - 40, 130, 40, "Push rope", mode === "push");
 drawCanvasBtn(ctx, w * 0.5, h - 40, 130, 40, "Pull rope", mode === "pull");
 drawCanvasBtn(ctx, w * 0.8, h - 40, 130, 40, "Try a rod", mode === "rod");
 setHitRegions([
 { id: "rope", shape: "rect", x: (cx + ex) / 2, y: gy - 4, w: Math.max(80, Math.abs(ex - cx) + 20), h: 40, meta: { action: "rope" } },
 { id: "pushTry", shape: "rect", x: w * 0.2, y: h - 40, w: 140, h: 44, meta: { action: "pushTry" } },
 { id: "pullTry", shape: "rect", x: w * 0.5, y: h - 40, w: 140, h: 44, meta: { action: "pullTry" } },
 { id: "rod", shape: "rect", x: w * 0.8, y: h - 40, w: 140, h: 44, meta: { action: "rod" } },
 ]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("pairTension", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 setDescription("Pulling stretches. Pushing squeezes.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const phase = forceLabState.phase || "see";
 ctx.fillStyle = "#1e1b4b";
 ctx.fillRect(0, 0, w, h);
 if (phase === "word") {
 ctx.fillStyle = "#c4b5fd";
 ctx.font = "800 20px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("TENSION", w * 0.28, h * 0.34);
 ctx.fillText("COMPRESSION", w * 0.72, h * 0.34);
 ctx.fillStyle = "#ddd6fe";
 ctx.font = "600 13px Segoe UI";
 ctx.fillText("pull inside a stretch", w * 0.28, h * 0.5);
 ctx.fillText("push inside a squeeze", w * 0.72, h * 0.5);
 drawLabel(ctx, "Ropes handle tension. Rods handle compression.", w * 0.5, h * 0.74, {
 font: "600 12px Segoe UI, sans-serif",
 h: 28,
 });
 } else {
 pictureFrame(ctx, w * 0.06, h * 0.18, w * 0.4, h * 0.62);
 pictureFrame(ctx, w * 0.54, h * 0.18, w * 0.4, h * 0.62);
 drawBraidedRope(ctx, w * 0.12, h * 0.48, w * 0.4, h * 0.48, 0.02);
 drawBraidedRope(ctx, w * 0.12, h * 0.56, w * 0.4, h * 0.56, 0.02);
 drawArrow(ctx, w * 0.12, h * 0.52, w * 0.08, h * 0.52, "#38bdf8", 4);
 drawArrow(ctx, w * 0.4, h * 0.52, w * 0.44, h * 0.52, "#38bdf8", 4);
 ctx.fillStyle = "#78716c";
 ctx.fillRect(w * 0.62, h * 0.38, w * 0.24, h * 0.22);
 ctx.strokeStyle = "#57534e";
 for (let row = 0; row < 4; row++) {
 for (let col = 0; col < 5; col++) {
 ctx.strokeRect(w * 0.62 + col * 18 + (row % 2 ? 9 : 0), h * 0.38 + row * 14, 18, 14);
 }
 }
 drawArrow(ctx, w * 0.64, h * 0.64, w * 0.74, h * 0.64, "#f97316", 4);
 drawArrow(ctx, w * 0.84, h * 0.64, w * 0.74, h * 0.64, "#f97316", 4);
 ctx.fillStyle = "#c4b5fd";
 ctx.font = "700 13px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("rope in tension", w * 0.26, h * 0.72);
 ctx.fillText("pillar in compression", w * 0.74, h * 0.72);
 drawLabel(ctx, "Pull needs something that can go taut. Push needs something rigid.", w * 0.5, 28, {
 font: "600 12px Segoe UI, sans-serif",
 h: 32,
 });
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("pairSkate", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 setDescription("You act on one skater. Both still move.");
 function firePush() {
 forceLabState.plSkateMode = "push";
 forceLabState.plSkateL = 0.34;
 forceLabState.plSkateR = 0.66;
 forceLabState.plSkateLv = -0.0036;
 forceLabState.plSkateRv = 0.0036;
 forceLabState.plSkateGo = true;
 forceLabState.plSkateT0 = performance.now();
 pulseSuccessFeedback(240);
 }
 function firePull() {
 forceLabState.plSkateMode = "pull";
 forceLabState.plSkateL = 0.28;
 forceLabState.plSkateR = 0.72;
 forceLabState.plSkateLv = 0.0028;
 forceLabState.plSkateRv = -0.0028;
 forceLabState.plSkateGo = true;
 forceLabState.plSkateT0 = performance.now();
 pulseSuccessFeedback(240);
 }
 setIntentHandler((intent) => {
 if (intent.type !== "CANVAS_TAP") return;
 if (intent.meta?.action === "pushOff") firePush();
 if (intent.meta?.action === "pullIn") {
 if (!forceLabState.plPushOffDone) {
 pulseFailFeedback(280);
 forceLabState.prompt = "Do the push-off first.";
 return;
 }
 firePull();
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 ctx.fillStyle = "#0c4a6e";
 ctx.fillRect(0, 0, w, h * 0.58);
 ctx.fillStyle = "#e0f2fe";
 ctx.fillRect(0, h * 0.58, w, h * 0.42);
 ctx.strokeStyle = "rgba(148,163,184,0.5)";
 for (let i = 0; i < 10; i++) ctx.fillRect(20 + i * (w / 10), h * 0.58, 2, h * 0.3);
 ctx.fillStyle = "#dc2626";
 ctx.fillRect(0, h * 0.56, w, 6);
 ctx.fillRect(0, h * 0.58, w, 4);
 if (forceLabState.plSkateGo) {
 forceLabState.plSkateL += forceLabState.plSkateLv || 0;
 forceLabState.plSkateR += forceLabState.plSkateRv || 0;
 forceLabState.plSkateLv *= 0.988;
 forceLabState.plSkateRv *= 0.988;
 const mode = forceLabState.plSkateMode || "push";
 if (mode === "push") {
 forceLabState.plSkateL = Math.max(0.12, forceLabState.plSkateL);
 forceLabState.plSkateR = Math.min(0.88, forceLabState.plSkateR);
 if (performance.now() - (forceLabState.plSkateT0 || 0) > 900) {
 forceLabState.plPushOffDone = true;
 forceLabState.plSkateGo = false;
 }
 } else if (forceLabState.plSkateR - forceLabState.plSkateL < 0.12 || performance.now() - (forceLabState.plSkateT0 || 0) > 1400) {
 forceLabState.plSkateGo = false;
 forceLabState.plPullTogetherDone = true;
 forceLabState.plSkateLv = 0;
 forceLabState.plSkateRv = 0;
 }
 }
 const y = h * 0.54;
 const lx = (forceLabState.plSkateL || 0.34) * w;
 const rx = (forceLabState.plSkateR || 0.66) * w;
 if ((forceLabState.plSkateMode || "push") === "pull") {
 drawBraidedRope(ctx, lx + 14, y - 8, rx - 14, y - 8, 0.02);
 }
 drawSkater(ctx, lx, y, 1, false);
 drawSkater(ctx, rx, y, -1, false);
 if (forceLabState.plSkateGo && forceLabState.plSkateMode === "push") {
 drawArrow(ctx, lx + 20, y - 20, rx - 20, y - 20, "#f97316", 4);
 }
 const msg = forceLabState.plPullTogetherDone
 ? "You only pulled from one side. Both skaters still moved."
 : forceLabState.plPushOffDone && (forceLabState.plSkateMode || "push") === "push"
 ? "You only pushed one skater. Both skaters moved."
 : forceLabState.prompt || "Push off first, then pull together with the rope.";
 drawLabel(ctx, msg, w * 0.5, 28, { font: "600 12px Segoe UI, sans-serif", h: 32 });
 drawCanvasBtn(ctx, w * 0.3, h - 40, 160, 40, "Push-off", !!forceLabState.plPushOffDone);
 drawCanvasBtn(ctx, w * 0.7, h - 40, 170, 40, "Pull together", !!forceLabState.plPullTogetherDone);
 setHitRegions([
 { id: "pushOff", shape: "rect", x: w * 0.3, y: h - 40, w: 170, h: 44, meta: { action: "pushOff" } },
 { id: "pullIn", shape: "rect", x: w * 0.7, y: h - 40, w: 180, h: 44, meta: { action: "pullIn" } },
 ]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("pairThird", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 setDescription("Every force has an equal, opposite partner on another object.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const phase = forceLabState.phase || "montage";
 ctx.fillStyle = "#1e1b4b";
 ctx.fillRect(0, 0, w, h);
 if (phase === "word") {
 ctx.fillStyle = "#c4b5fd";
 ctx.font = "700 16px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("Newton's Third Law", w * 0.5, h * 0.28);
 ctx.font = "600 13px Segoe UI";
 ctx.fillStyle = "#f5f3ff";
 ctx.fillText("For every action, an equal and opposite reaction.", w * 0.5, h * 0.44);
 drawSkater(ctx, w * 0.36, h * 0.68, 1);
 drawSkater(ctx, w * 0.64, h * 0.68, -1);
 drawArrow(ctx, w * 0.42, h * 0.62, w * 0.32, h * 0.62, "#f97316", 5);
 drawArrow(ctx, w * 0.58, h * 0.62, w * 0.68, h * 0.62, "#38bdf8", 5);
 } else {
 const cards = [
 { lab: "Swimmer pushes water back", draw: drawSwimmerPair },
 { lab: "Rowboat pushes water back", draw: drawRowboatPair },
 { lab: "Rocket pushes exhaust down", draw: drawRocketPair },
 { lab: "You push wall, wall pushes you", draw: drawWallPushPair },
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
 c.draw(ctx, x + cw * 0.5, y + ch * 0.44, Math.min(cw, ch) / 130);
 ctx.fillStyle = "#c4b5fd";
 ctx.font = "700 11px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.fillText(c.lab, x + cw * 0.5, y + ch - 14);
 });
 drawLabel(ctx, "Four real pairs. Equal size, opposite direction, different objects.", w * 0.5, 24);
 drawLabel(ctx, "Two equal, opposite forces. One on each object. Every time.", w * 0.5, h - 28, {
 font: "600 12px Segoe UI, sans-serif",
 h: 28,
 });
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("pairBridge", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 setDescription("Cables pull. Pillars push. Neither can do the other's job.");
 setIntentHandler((intent) => {
 if (intent.type !== "CANVAS_TAP") return;
 if (intent.meta?.action === "cables") {
 forceLabState.plBridgeCables = true;
 forceLabState.plBridgeWrong = false;
 pulseSuccessFeedback(200);
 }
 if (intent.meta?.action === "pillars") {
 forceLabState.plBridgePillars = true;
 forceLabState.plBridgeWrong = false;
 pulseSuccessFeedback(200);
 }
 if (intent.meta?.action === "wrong") {
 forceLabState.plBridgeWrong = true;
 forceLabState.plBridgeOk = false;
 forceLabState.plBridgeCar = 0;
 pulseFailFeedback(320);
 }
 if (intent.meta?.action === "drive") {
 if (forceLabState.plBridgeCables && forceLabState.plBridgePillars && !forceLabState.plBridgeWrong) {
 forceLabState.plBridgeCar = 0.02;
 } else {
 forceLabState.plBridgeWrong = true;
 pulseFailFeedback(300);
 }
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const phase = forceLabState.phase || "build";
 if (phase === "arm") {
 ctx.fillStyle = "#1e1b4b";
 ctx.fillRect(0, 0, w, h);
 const flex = forceLabState.plArm ?? 0.5;
 drawArmBones(ctx, w * 0.5, h * 0.48, flex);
 drawLabel(ctx, flex < 0.45 ? "Bicep pulls. Arm bends." : flex > 0.55 ? "Tricep pulls. Arm straightens." : "Muscles only pull.", w * 0.5, 28);
 } else {
 const bridge = drawSuspensionBridge(ctx, w, h, {
 cables: forceLabState.plBridgeCables,
 pillars: forceLabState.plBridgePillars,
 wrong: forceLabState.plBridgeWrong,
 });
 if (forceLabState.plBridgeWrong) {
 drawLabel(ctx, "A floppy rope cannot stand in for a pillar.", w * 0.5, h * 0.12, { h: 24, font: "600 11px Segoe UI" });
 } else if (forceLabState.plBridgeCables && forceLabState.plBridgePillars) {
 drawLabel(ctx, "Cables pull the deck up. Pillars push the deck up.", w * 0.5, h * 0.12, { h: 24, font: "600 11px Segoe UI" });
 } else {
 drawLabel(ctx, "Hang tension cables. Stand compression pillars. Then drive.", w * 0.5, h * 0.12, { h: 24, font: "600 11px Segoe UI" });
 }
 if (forceLabState.plBridgeCar > 0 && !forceLabState.plBridgeWrong) {
 forceLabState.plBridgeCar = Math.min(1, forceLabState.plBridgeCar + 0.008);
 const cx = bridge.leftX + (bridge.rightX - bridge.leftX) * forceLabState.plBridgeCar;
 drawCarSmall(ctx, cx, bridge.deckY - 1);
 if (forceLabState.plBridgeCar >= 0.98) forceLabState.plBridgeOk = true;
 }
 drawCanvasBtn(ctx, w * 0.18, h - 40, 120, 40, "Cables", !!forceLabState.plBridgeCables);
 drawCanvasBtn(ctx, w * 0.42, h - 40, 120, 40, "Pillars", !!forceLabState.plBridgePillars);
 drawCanvasBtn(ctx, w * 0.64, h - 40, 110, 40, "Drive", forceLabState.plBridgeCar > 0);
 drawCanvasBtn(ctx, w * 0.86, h - 40, 110, 40, "Wrong rope", !!forceLabState.plBridgeWrong);
 setHitRegions([
 { id: "cables", shape: "rect", x: w * 0.18, y: h - 40, w: 130, h: 44, meta: { action: "cables" } },
 { id: "pillars", shape: "rect", x: w * 0.42, y: h - 40, w: 130, h: 44, meta: { action: "pillars" } },
 { id: "drive", shape: "rect", x: w * 0.64, y: h - 40, w: 120, h: 44, meta: { action: "drive" } },
 { id: "wrong", shape: "rect", x: w * 0.86, y: h - 40, w: 120, h: 44, meta: { action: "wrong" } },
 ]);
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("pairTeam", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 setDescription("Strong structures team pulling parts with pushing parts.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const phase = forceLabState.phase || "montage";
 ctx.fillStyle = "#1e1b4b";
 ctx.fillRect(0, 0, w, h);
 if (phase === "card") {
 ctx.fillStyle = "#c4b5fd";
 ctx.font = "800 20px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("Push → Compression", w * 0.5, h * 0.28);
 ctx.fillText("Pull → Tension", w * 0.5, h * 0.44);
 ctx.fillStyle = "#f5f3ff";
 ctx.font = "600 13px Segoe UI";
 ctx.fillText("Every push or pull → equal opposite partner", w * 0.5, h * 0.62);
 drawLabel(ctx, "Next: when pushes and pulls do not cancel, what happens?", w * 0.5, h * 0.8, {
 font: "600 12px Segoe UI, sans-serif",
 h: 28,
 });
 } else {
 const cards = [
 { lab: "Crane: cable pulls, boom pushes", draw: drawCrane },
 { lab: "Tent: guy-lines pull, pole pushes", draw: drawTent },
 { lab: "Arm: muscles pull, bones push", draw: (c, x, y, s) => drawArmBones(c, x, y, 0.35) },
 ];
 const gap = 12;
 const cw = (w - 48 - gap * 2) / 3;
 const ch = h * 0.55;
 cards.forEach((c, i) => {
 const x = 24 + i * (cw + gap);
 const y = h * 0.2;
 pictureFrame(ctx, x, y, cw, ch);
 c.draw(ctx, x + cw * 0.5, y + ch * 0.48, Math.min(cw, ch) / 120);
 ctx.fillStyle = "#c4b5fd";
 ctx.font = "700 11px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.fillText(c.lab, x + cw * 0.5, y + ch - 14);
 });
 drawLabel(ctx, "Pulling parts and pushing parts, working as a team.", w * 0.5, 28, { font: "600 12px Segoe UI, sans-serif", h: 32 });
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("pairClose", (api) => {
 const { setTick, setDispose, setDescription } = api;
 const viewport = document.getElementById("viewport");
 const start = performance.now();
 setDescription("Push and pull were never rivals. They are a team.");
 const unmount = mountDoor3D(viewport, null, { hideControls: true });
 syncDoor3D("push", {
 banner: "Push and pull were never rivals. They are a team.",
 caption: "",
 });
 setTick(() => {
 const t = (performance.now() - start) / 1000;
 forceLabState.plCloseU = Math.min(1, t / 3);
 let caption = "";
 if (t > 2) caption = "Equal and opposite";
 else if (t > 1.3) caption = "Push = Compression · Pull = Tension";
 else if (t > 0.6) caption = "Push = Compression";
 syncDoor3D("push", { caption });
 });
 setDispose(() => unmount());
 });

 arena.registerScene("pairSpiral", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const start = performance.now();
 const stops = [
 { id: 1, label: "1 Directions", caption: "Spiral 1: push and pull are one idea, two ways" },
 { id: 2, label: "2 Rope", caption: "Spiral 2: ropes pull. Rods can push." },
 { id: 3, label: "3 Pairs", caption: "Spiral 3: every force has a partner" },
 { id: 4, label: "4 Team", caption: "Spiral 4: cables pull, pillars push" },
 ];
 setDescription("Recap map of the four Push & Pull spirals.");
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
 const stop = forceLabState.spiralUntil > performance.now() ? forceLabState.spiralStop : 0;
 fillHallway(ctx, w, h);
 ctx.strokeStyle = "rgba(167,139,250,0.55)";
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
 if (stop === 1) drawDoorIcon(ctx, origin.cx, origin.cy);
 if (stop === 2) drawFloppy(ctx, origin.cx - 30, origin.cy, origin.cx + 30, origin.cy, 0.8);
 if (stop === 3) {
 drawSkater(ctx, origin.cx - 18, origin.cy + 8, 1);
 drawSkater(ctx, origin.cx + 18, origin.cy + 8, -1);
 }
 if (stop === 4) {
 ctx.strokeStyle = "#38bdf8";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.moveTo(origin.cx - 24, origin.cy - 10);
 ctx.quadraticCurveTo(origin.cx, origin.cy + 16, origin.cx + 24, origin.cy - 10);
 ctx.stroke();
 }
 const hits = [];
 stops.forEach((s, i) => {
 const p = polar(i, w, h);
 ctx.fillStyle = stop === s.id ? "#7c3aed" : "#4c1d95";
 ctx.beginPath();
 ctx.arc(p.x, p.y, 22, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#f5f3ff";
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
 ctx.fillStyle = "#7c3aed";
 ctx.fill();
 ctx.fillStyle = "#f5f3ff";
 ctx.font = "800 16px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.fillText("Finish Push & Pull", fx, fy);
 hits.push({ id: "spiral-finish", shape: "rect", x: fx, y: fy, w: fw, h: 44, meta: { action: "spiralFinish" } });
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 if (typeof arena.registerAlias === "function") {
 arena.registerAlias("pairMeet", "pairOpen");
 arena.registerAlias("pairSort", "pairDirs");
 arena.registerAlias("pairRocket", "pairSkate");
 arena.registerAlias("pairWalk", "pairBridge");
 arena.registerAlias("pairRule", "pairThird");
 arena.registerAlias("pairStretch", "pairTension");
 arena.registerAlias("pairMyth", "pairTeam");
 arena.registerAlias("pairDrill", "pairClose");
 arena.registerAlias("pairMastery", "pairSpiral");
 }
}
