/**
 * Bio Explorer Mission 1: Living or Not
 * Realistic Canvas 2D scenes (procedural art - no photo assets).
 */
import {
 bioLabState,
 pulseFailFeedback,
 pulseSuccessFeedback,
 LIFE_SORT_ITEMS,
 MRS_GREN,
 LIFE_PROVE_CARDS,
 LIFE_FLAME_EVIDENCE,
 LIFE_MARS,
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
 ctx.fillStyle = opts.bg || "rgba(20,83,45,0.92)";
 roundRect(ctx, x - bw / 2, y - bh / 2, bw, bh, 10);
 ctx.fill();
 ctx.strokeStyle = opts.border || "rgba(134,239,172,0.55)";
 ctx.lineWidth = 1.4;
 ctx.stroke();
 ctx.fillStyle = opts.color || "#dcfce7";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(text, x, y + 1);
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

function fillLab(ctx, w, h) {
 const g = ctx.createLinearGradient(0, 0, 0, h);
 g.addColorStop(0, "#14532d");
 g.addColorStop(0.55, "#052e16");
 g.addColorStop(1, "#022c22");
 ctx.fillStyle = g;
 ctx.fillRect(0, 0, w, h);
 ctx.fillStyle = "#166534";
 ctx.fillRect(0, h * 0.72, w, h * 0.28);
}

/** Outdoor meadow. Returns groundY (soil surface) so props can be planted. */
function fillOutdoor(ctx, w, h, t, opts = {}) {
 const sunX = opts.sunX ?? w * 0.78;
 const sunY = opts.sunY ?? h * 0.16;
 const groundY = opts.groundY ?? h * 0.7;
 const sky = ctx.createLinearGradient(0, 0, 0, groundY);
 sky.addColorStop(0, "#7dd3fc");
 sky.addColorStop(0.55, "#bae6fd");
 sky.addColorStop(1, "#86efac");
 ctx.fillStyle = sky;
 ctx.fillRect(0, 0, w, h);

 // Distant hills stay ABOVE the ground line (no fill-to-bottom float gap)
 ctx.fillStyle = "rgba(34,197,94,0.4)";
 ctx.beginPath();
 ctx.moveTo(0, groundY - h * 0.08);
 ctx.quadraticCurveTo(w * 0.25, groundY - h * 0.18, w * 0.5, groundY - h * 0.1);
 ctx.quadraticCurveTo(w * 0.75, groundY - h * 0.04, w, groundY - h * 0.12);
 ctx.lineTo(w, groundY);
 ctx.lineTo(0, groundY);
 ctx.closePath();
 ctx.fill();

 // Grass lip at the surface
 ctx.fillStyle = "#4d7c0f";
 ctx.fillRect(0, groundY - 6, w, 8);
 ctx.fillStyle = "#65a30d";
 ctx.fillRect(0, groundY - 4, w, 4);

 // Soil below ground
 const soil = ctx.createLinearGradient(0, groundY, 0, h);
 soil.addColorStop(0, "#854d0e");
 soil.addColorStop(0.4, "#713f12");
 soil.addColorStop(1, "#451a03");
 ctx.fillStyle = soil;
 ctx.fillRect(0, groundY, w, h - groundY);
 for (let i = 0; i < 28; i++) {
 ctx.fillStyle = i % 2 ? "rgba(120,53,15,0.35)" : "rgba(180,83,9,0.2)";
 ctx.fillRect((i * 37 + (t * 8) % 20) % w, groundY + 8 + (i % 5) * 8, 3 + (i % 4), 2);
 }

 // Sun disc + visible rays
 const pulse = 0.85 + Math.sin(t * 1.4) * 0.08;
 const glow = ctx.createRadialGradient(sunX, sunY, 4, sunX, sunY, 70 * pulse);
 glow.addColorStop(0, "rgba(254,249,195,1)");
 glow.addColorStop(0.35, "rgba(250,204,21,0.85)");
 glow.addColorStop(1, "rgba(250,204,21,0)");
 ctx.fillStyle = glow;
 ctx.beginPath();
 ctx.arc(sunX, sunY, 70 * pulse, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#fef08a";
 ctx.beginPath();
 ctx.arc(sunX, sunY, 18, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "rgba(253,224,71,0.45)";
 ctx.lineWidth = 2;
 for (let i = 0; i < 12; i++) {
 const a = (i / 12) * Math.PI * 2 + t * 0.15;
 const len = 34 + Math.sin(t * 2 + i) * 6;
 ctx.beginPath();
 ctx.moveTo(sunX + Math.cos(a) * 24, sunY + Math.sin(a) * 24);
 ctx.lineTo(sunX + Math.cos(a) * (24 + len), sunY + Math.sin(a) * (24 + len));
 ctx.stroke();
 }

 if (opts.beamTo) {
 const [bx, by] = opts.beamTo;
 const beam = ctx.createLinearGradient(sunX, sunY, bx, by);
 beam.addColorStop(0, "rgba(254,240,138,0.55)");
 beam.addColorStop(0.55, "rgba(253,224,71,0.18)");
 beam.addColorStop(1, "rgba(253,224,71,0)");
 ctx.strokeStyle = beam;
 ctx.lineWidth = 28;
 ctx.beginPath();
 ctx.moveTo(sunX, sunY);
 ctx.lineTo(bx, by);
 ctx.stroke();
 ctx.lineWidth = 10;
 ctx.strokeStyle = "rgba(254,249,195,0.35)";
 ctx.stroke();
 }

 if (opts.wind !== false) {
 ctx.strokeStyle = "rgba(255,255,255,0.28)";
 ctx.lineWidth = 1.5;
 for (let i = 0; i < 7; i++) {
 const y = h * 0.22 + i * 16;
 if (y > groundY - 20) break;
 const x0 = ((t * 40 + i * 55) % (w + 80)) - 40;
 ctx.beginPath();
 ctx.moveTo(x0, y);
 ctx.quadraticCurveTo(x0 + 30, y - 4, x0 + 60, y);
 ctx.stroke();
 }
 }
 return groundY;
}

/* ─── Realistic procedural icons ─── */

function iconFlame(ctx, x, y, s = 1, fx = {}) {
 const fuel = fx.fuel ?? 0;
 const wind = fx.wind ?? 0;
 const smoke = fx.smoke ?? 0;
 const flicker = fx.flicker ?? 1;
 const t = performance.now() / 1000;
 ctx.save();
 ctx.translate(x, y);
 ctx.scale(s, s);
 const lean = wind * (6 + Math.sin(t * 6) * 3);
 ctx.translate(lean, 0);
 // logs
 ctx.fillStyle = "#78350f";
 ctx.fillRect(-18, 18, 36, 8);
 ctx.fillStyle = "#92400e";
 ctx.fillRect(-14, 14, 28, 6);
 // smoke
 if (smoke > 0.1) {
 for (let i = 0; i < 4; i++) {
 ctx.fillStyle = `rgba(148,163,184,${0.15 + smoke * 0.2})`;
 const sy = -40 - i * 14 - ((t * 30 + i * 10) % 40);
 const sx = Math.sin(t * 2 + i) * 8;
 ctx.beginPath();
 ctx.ellipse(sx, sy, 6 + i * 2, 5 + i, 0, 0, Math.PI * 2);
 ctx.fill();
 }
 }
 const hScale = 1 + fuel * 0.85 + Math.sin(t * (8 + flicker * 4)) * 0.06 * flicker;
 const wScale = 1 + fuel * 0.35;
 // outer flame
 const g = ctx.createLinearGradient(0, 22, 0, -28 * hScale);
 g.addColorStop(0, "#ea580c");
 g.addColorStop(0.45, "#f97316");
 g.addColorStop(0.75, "#fbbf24");
 g.addColorStop(1, "#fef9c3");
 ctx.fillStyle = g;
 ctx.beginPath();
 ctx.moveTo(0, 20);
 ctx.bezierCurveTo(-18 * wScale, 8, -14 * wScale, -10 * hScale, -2, -26 * hScale);
 ctx.bezierCurveTo(2, -18 * hScale, 6 * wScale, -8 * hScale, 8 * wScale, 2);
 ctx.bezierCurveTo(16 * wScale, 10, 10 * wScale, 18, 0, 20);
 ctx.fill();
 // core
 ctx.fillStyle = "#fef3c7";
 ctx.beginPath();
 ctx.moveTo(0, 14);
 ctx.quadraticCurveTo(-6 * wScale, 4, 0, -8 * hScale);
 ctx.quadraticCurveTo(6 * wScale, 4, 0, 14);
 ctx.fill();
 ctx.restore();
}

function iconCrystal(ctx, x, y, s = 1) {
 ctx.save();
 ctx.translate(x, y);
 ctx.scale(s, s);
 const faces = [
 { pts: [[0, -28], [14, -6], [0, 4], [-8, -10]], c: "#a5f3fc" },
 { pts: [[0, -28], [8, -10], [18, 2], [14, -6]], c: "#67e8f9" },
 { pts: [[0, 4], [14, -6], [18, 2], [6, 22], [-6, 18]], c: "#22d3ee" },
 { pts: [[0, -28], [-8, -10], [-16, 0], [-6, 18], [0, 4]], c: "#06b6d4" },
 ];
 faces.forEach((f) => {
 ctx.beginPath();
 f.pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
 ctx.closePath();
 ctx.fillStyle = f.c;
 ctx.fill();
 ctx.strokeStyle = "rgba(236,254,255,0.7)";
 ctx.lineWidth = 1;
 ctx.stroke();
 });
 // shine
 ctx.strokeStyle = "rgba(255,255,255,0.85)";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.moveTo(-4, -18);
 ctx.lineTo(-2, -6);
 ctx.stroke();
 ctx.restore();
}

function iconVirus(ctx, x, y, s = 1) {
 ctx.save();
 ctx.translate(x, y);
 ctx.scale(s, s);
 const t = performance.now() / 1000;
 // soft halo (micrograph feel)
 const halo = ctx.createRadialGradient(0, 0, 4, 0, 0, 34);
 halo.addColorStop(0, "rgba(167,139,250,0.55)");
 halo.addColorStop(1, "rgba(76,29,149,0)");
 ctx.fillStyle = halo;
 ctx.beginPath();
 ctx.arc(0, 0, 34, 0, Math.PI * 2);
 ctx.fill();
 // envelope body
 const body = ctx.createRadialGradient(-4, -4, 2, 0, 0, 16);
 body.addColorStop(0, "#ddd6fe");
 body.addColorStop(0.55, "#8b5cf6");
 body.addColorStop(1, "#4c1d95");
 ctx.fillStyle = body;
 ctx.beginPath();
 ctx.arc(0, 0, 15, 0, Math.PI * 2);
 ctx.fill();
 // surface texture rings
 ctx.strokeStyle = "rgba(196,181,253,0.45)";
 ctx.lineWidth = 1;
 ctx.beginPath();
 ctx.arc(0, 0, 9, 0, Math.PI * 2);
 ctx.stroke();
 // glycoprotein spikes (corona-like)
 for (let i = 0; i < 14; i++) {
 const a = (i / 14) * Math.PI * 2 + t * 0.08;
 const x0 = Math.cos(a) * 15;
 const y0 = Math.sin(a) * 15;
 const x1 = Math.cos(a) * 24;
 const y1 = Math.sin(a) * 24;
 ctx.strokeStyle = "#c4b5fd";
 ctx.lineWidth = 2.4;
 ctx.beginPath();
 ctx.moveTo(x0, y0);
 ctx.lineTo(x1, y1);
 ctx.stroke();
 // spike head
 const sg = ctx.createRadialGradient(x1, y1, 0, x1, y1, 4);
 sg.addColorStop(0, "#f5f3ff");
 sg.addColorStop(1, "#7c3aed");
 ctx.fillStyle = sg;
 ctx.beginPath();
 ctx.arc(x1, y1, 3.4, 0, Math.PI * 2);
 ctx.fill();
 }
 ctx.restore();
}

function iconCat(ctx, x, y, s = 1) {
 ctx.save();
 ctx.translate(x, y);
 ctx.scale(s, s);
 // body curled sleeping
 ctx.fillStyle = "#b45309";
 ctx.beginPath();
 ctx.ellipse(0, 8, 26, 14, -0.15, 0, Math.PI * 2);
 ctx.fill();
 // head
 ctx.beginPath();
 ctx.ellipse(18, 0, 12, 11, 0, 0, Math.PI * 2);
 ctx.fill();
 // ears
 ctx.beginPath();
 ctx.moveTo(10, -6);
 ctx.lineTo(12, -18);
 ctx.lineTo(18, -4);
 ctx.fill();
 ctx.beginPath();
 ctx.moveTo(20, -4);
 ctx.lineTo(26, -16);
 ctx.lineTo(28, 0);
 ctx.fill();
 ctx.fillStyle = "#fbbf24";
 ctx.beginPath();
 ctx.moveTo(12, -6);
 ctx.lineTo(13, -14);
 ctx.lineTo(16, -5);
 ctx.fill();
 // closed eyes
 ctx.strokeStyle = "#451a03";
 ctx.lineWidth = 1.5;
 ctx.beginPath();
 ctx.moveTo(14, -1);
 ctx.quadraticCurveTo(17, 1, 20, -1);
 ctx.stroke();
 ctx.beginPath();
 ctx.moveTo(20, -1);
 ctx.quadraticCurveTo(23, 1, 26, -1);
 ctx.stroke();
 // nose
 ctx.fillStyle = "#fdba74";
 ctx.beginPath();
 ctx.ellipse(22, 3, 2, 1.5, 0, 0, Math.PI * 2);
 ctx.fill();
 // tail
 ctx.strokeStyle = "#92400e";
 ctx.lineWidth = 5;
 ctx.lineCap = "round";
 ctx.beginPath();
 ctx.moveTo(-24, 10);
 ctx.quadraticCurveTo(-34, 0, -28, -8);
 ctx.stroke();
 // stripes
 ctx.strokeStyle = "rgba(69,26,3,0.45)";
 ctx.lineWidth = 2;
 for (let i = 0; i < 3; i++) {
 ctx.beginPath();
 ctx.arc(-6 + i * 8, 4, 8, 0.2, 1.2);
 ctx.stroke();
 }
 ctx.restore();
}

function iconRock(ctx, x, y, s = 1) {
 ctx.save();
 ctx.translate(x, y);
 ctx.scale(s, s);
 const g = ctx.createLinearGradient(-22, -16, 20, 16);
 g.addColorStop(0, "#a8a29e");
 g.addColorStop(0.4, "#78716c");
 g.addColorStop(1, "#44403c");
 ctx.fillStyle = g;
 ctx.beginPath();
 ctx.moveTo(-22, 6);
 ctx.lineTo(-18, -10);
 ctx.lineTo(-4, -18);
 ctx.lineTo(12, -14);
 ctx.lineTo(22, 0);
 ctx.lineTo(16, 14);
 ctx.lineTo(-8, 16);
 ctx.closePath();
 ctx.fill();
 ctx.strokeStyle = "rgba(28,25,23,0.35)";
 ctx.lineWidth = 1.2;
 ctx.stroke();
 // mineral flecks
 ctx.fillStyle = "rgba(214,211,209,0.5)";
 ctx.fillRect(-8, -4, 3, 2);
 ctx.fillRect(4, 2, 4, 2);
 ctx.fillRect(-2, 8, 2, 2);
 ctx.fillStyle = "rgba(68,64,60,0.5)";
 ctx.fillRect(6, -8, 5, 2);
 ctx.restore();
}

/** Tree grows from the ground up: trunk first, then canopy. Local ground line is y=10. */
function iconTree(ctx, x, y, grow = 1, s = 1, wind = 0) {
 ctx.save();
 ctx.translate(x, y);
 ctx.scale(s, s);
 const g = Math.max(0, Math.min(1.2, grow));
 const ground = 10;

 // Dirt mound so the trunk is clearly planted (not hovering)
 ctx.fillStyle = "#78350f";
 ctx.beginPath();
 ctx.ellipse(0, ground + 2, 16 + g * 6, 5, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#4d7c0f";
 ctx.beginPath();
 ctx.ellipse(-10, ground, 6, 2.5, 0, 0, Math.PI * 2);
 ctx.ellipse(10, ground, 5, 2.2, 0, 0, Math.PI * 2);
 ctx.fill();

 const trunkH = 10 + g * 38;
 const trunkW = 2.5 + g * 7;
 const trunkTop = ground - trunkH;
 const trunk = ctx.createLinearGradient(-trunkW, 0, trunkW, 0);
 trunk.addColorStop(0, "#78350f");
 trunk.addColorStop(0.45, "#a16207");
 trunk.addColorStop(1, "#451a03");
 ctx.fillStyle = trunk;
 ctx.beginPath();
 ctx.moveTo(-trunkW / 2, ground);
 ctx.lineTo(-trunkW * 0.4, trunkTop);
 ctx.lineTo(trunkW * 0.4, trunkTop);
 ctx.lineTo(trunkW / 2, ground);
 ctx.closePath();
 ctx.fill();
 ctx.strokeStyle = "rgba(69,26,3,0.4)";
 ctx.lineWidth = 1;
 for (let i = 0; i < 2 + Math.floor(g * 2); i++) {
 ctx.beginPath();
 ctx.moveTo(-1.5, ground - 4 - i * (trunkH / 4));
 ctx.lineTo(1.5, ground - 8 - i * (trunkH / 4));
 ctx.stroke();
 }

 // Short roots into the mound
 ctx.strokeStyle = "#57534e";
 ctx.lineWidth = 1.5;
 ctx.beginPath();
 ctx.moveTo(-2, ground);
 ctx.quadraticCurveTo(-8, ground + 4, -12, ground + 6);
 ctx.moveTo(2, ground);
 ctx.quadraticCurveTo(7, ground + 5, 11, ground + 6);
 ctx.stroke();

 const leaf = Math.max(0, (g - 0.12) / 0.88);
 if (leaf > 0.02) {
 const r1 = 4 + leaf * 20;
 const r2 = 3 + leaf * 16;
 const r3 = 2 + leaf * 12;
 const c1 = trunkTop - r1 * 0.35;
 const c2 = trunkTop - r1 * 0.75;
 const c3 = trunkTop - r1 * 1.15;
 const layers = [
 { r: r1, y: c1, c0: "#166534", c1: "#22c55e" },
 { r: r2, y: c2, c0: "#15803d", c1: "#4ade80" },
 { r: r3, y: c3, c0: "#16a34a", c1: "#86efac" },
 ];
 layers.forEach((L, idx) => {
 if (leaf < 0.2 && idx > 0) return;
 if (leaf < 0.45 && idx > 1) return;
 const lg = ctx.createRadialGradient(-3, L.y - 3, 1, 0, L.y, L.r);
 lg.addColorStop(0, L.c1);
 lg.addColorStop(1, L.c0);
 ctx.fillStyle = lg;
 ctx.beginPath();
 ctx.ellipse(0, L.y, L.r, L.r * 0.82, 0, 0, Math.PI * 2);
 ctx.fill();
 });
 if (wind > 0 && leaf > 0.3) {
 ctx.fillStyle = "rgba(254,240,138,0.35)";
 const shimmer = Math.sin(performance.now() / 500) * wind * 1.2;
 for (let i = 0; i < 3 + Math.floor(leaf * 4); i++) {
 const a = i * 1.3;
 ctx.beginPath();
 ctx.ellipse(
 Math.cos(a) * (r2 * 0.55) + shimmer * Math.sin(i),
 c2 + Math.sin(a) * (r2 * 0.35),
 2,
 3,
 a,
 0,
 Math.PI * 2,
 );
 ctx.fill();
 }
 }
 }

 if (g > 0.9) {
 ctx.fillStyle = "#854d0e";
 ctx.beginPath();
 ctx.ellipse(14, ground - 1, 3, 2.2, 0.2, 0, Math.PI * 2);
 ctx.fill();
 ctx.beginPath();
 ctx.ellipse(-13, ground - 1, 3, 2.2, -0.2, 0, Math.PI * 2);
 ctx.fill();
 }
 ctx.restore();
}

/** Local ground line for iconTree (before scale). */
const TREE_LOCAL_GROUND = 10;

/** Mushroom: stem and cap stay aligned; lean tilts the whole fruiting body. */
function iconMushroom(ctx, x, y, s = 1, stage = 0) {
 ctx.save();
 ctx.translate(x, y);
 ctx.scale(s, s);
 const st = Math.max(0, Math.min(7, stage));
 const stemH = 12 + st * 3;
 const capW = 14 + st * 2.2;
 const capH = 8 + st * 0.85;
 const baseY = 14;

 // Log under the mushrooms (full local width)
 ctx.fillStyle = "#78350f";
 roundRect(ctx, -36, baseY, 72, 14, 5);
 ctx.fill();
 ctx.fillStyle = "#a16207";
 roundRect(ctx, -32, baseY - 2, 64, 7, 3);
 ctx.fill();
 ctx.strokeStyle = "rgba(69,26,3,0.45)";
 ctx.lineWidth = 1;
 for (let i = 0; i < 3; i++) {
 ctx.beginPath();
 ctx.moveTo(-28 + i * 18, baseY + 2);
 ctx.lineTo(-22 + i * 18, baseY + 10);
 ctx.stroke();
 }

 // Mycelium into the wood (nutrition)
 if (st >= 1) {
 ctx.strokeStyle = "rgba(226,232,240,0.75)";
 ctx.lineWidth = 1.3;
 for (let i = 0; i < 4; i++) {
 ctx.beginPath();
 ctx.moveTo(-14 + i * 9, baseY + 12);
 ctx.quadraticCurveTo(-10 + i * 9, baseY + 18, -6 + i * 7, baseY + 24);
 ctx.stroke();
 }
 }

 // Whole mushroom leans slightly toward light (sensitivity) - stem + cap together
 const leanRad = st >= 3 ? Math.min(0.22, (st - 2) * 0.05) : 0;
 ctx.save();
 ctx.translate(0, baseY);
 ctx.rotate(leanRad);
 ctx.translate(0, -baseY);

 // Stem centered on x=0
 const stemG = ctx.createLinearGradient(-6, 0, 6, 0);
 stemG.addColorStop(0, "#d6d3d1");
 stemG.addColorStop(0.5, "#fafaf9");
 stemG.addColorStop(1, "#a8a29e");
 ctx.fillStyle = stemG;
 const capY = baseY - stemH;
 roundRect(ctx, -5, capY, 10, stemH + 1, 3);
 ctx.fill();

 // Cap seated on stem top
 const cap = ctx.createRadialGradient(-3, capY - 2, 2, 0, capY, capW);
 cap.addColorStop(0, "#f87171");
 cap.addColorStop(0.55, "#dc2626");
 cap.addColorStop(1, "#7f1d1d");
 ctx.fillStyle = cap;
 ctx.beginPath();
 ctx.ellipse(0, capY, capW, capH, 0, Math.PI, 0);
 ctx.fill();
 // underside rim so cap meets stem
 ctx.fillStyle = "#991b1b";
 ctx.beginPath();
 ctx.ellipse(0, capY + 1, capW * 0.92, 2.5, 0, 0, Math.PI * 2);
 ctx.fill();

 // Spots
 if (st >= 2) {
 ctx.fillStyle = "rgba(255,255,255,0.9)";
 [[-6, -3], [5, -4], [-2, 1], [8, -1], [-9, 0]].forEach(([dx, dy]) => {
 ctx.beginPath();
 ctx.arc(dx, capY + dy, 2, 0, Math.PI * 2);
 ctx.fill();
 });
 }

 // Gills under cap, clipped to stem sides
 if (st >= 2) {
 ctx.strokeStyle = "rgba(253,186,116,0.85)";
 ctx.lineWidth = 1;
 for (let i = -5; i <= 5; i++) {
 if (Math.abs(i) < 1) continue;
 ctx.beginPath();
 ctx.moveTo(i * 2.2, capY + 2);
 ctx.lineTo(i * 1.1, capY + 6);
 ctx.stroke();
 }
 }

 // Spores drifting off the right gill edge (movement)
 if (st >= 4) {
 const t = performance.now() / 1000;
 ctx.fillStyle = "rgba(226,232,240,0.65)";
 for (let i = 0; i < 5; i++) {
 const px = capW * 0.55 + i * 4 + Math.sin(t * 2 + i) * 2;
 const py = capY - 4 - ((t * 28 + i * 11) % 26);
 ctx.beginPath();
 ctx.arc(px, py, 1.6, 0, Math.PI * 2);
 ctx.fill();
 }
 }

 // Moisture vapor (excretion)
 if (st >= 5) {
 ctx.strokeStyle = "rgba(148,163,184,0.55)";
 ctx.lineWidth = 1.5;
 ctx.beginPath();
 ctx.arc(-capW * 0.45, capY - 6, 7, Math.PI * 0.1, Math.PI * 1.1);
 ctx.stroke();
 }

 ctx.restore(); // end lean

 // Baby mushroom on the same log (reproduction) - own aligned stem+cap
 if (st >= 6) {
 ctx.fillStyle = "#e7e5e4";
 roundRect(ctx, 22, baseY - 10, 5, 10, 2);
 ctx.fill();
 ctx.fillStyle = "#b91c1c";
 ctx.beginPath();
 ctx.ellipse(24.5, baseY - 10, 8, 5, 0, Math.PI, 0);
 ctx.fill();
 }

 ctx.restore();
}

function iconSeed(ctx, x, y, sprout = 0, s = 1) {
 ctx.save();
 ctx.translate(x, y);
 ctx.scale(s, s);
 // soil mound
 ctx.fillStyle = "#78350f";
 ctx.beginPath();
 ctx.ellipse(0, 16, 22, 8, 0, 0, Math.PI * 2);
 ctx.fill();
 // seed coat
 const sg = ctx.createRadialGradient(-2, 6, 1, 0, 8, 12);
 sg.addColorStop(0, "#d97706");
 sg.addColorStop(1, "#78350f");
 ctx.fillStyle = sg;
 ctx.beginPath();
 ctx.ellipse(0, 10, 11, 8, -0.2, 0, Math.PI * 2);
 ctx.fill();
 const g = Math.max(0, Math.min(1, sprout));
 if (g > 0.05) {
 // root
 ctx.strokeStyle = "#a8a29e";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.moveTo(0, 14);
 ctx.quadraticCurveTo(6, 18 + g * 8, 2, 22 + g * 10);
 ctx.stroke();
 // shoot
 const shootH = g * 28;
 ctx.strokeStyle = "#16a34a";
 ctx.lineWidth = 3;
 ctx.lineCap = "round";
 ctx.beginPath();
 ctx.moveTo(0, 6);
 ctx.quadraticCurveTo(-4, -2, 0, 6 - shootH);
 ctx.stroke();
 // first leaves
 if (g > 0.35) {
 ctx.fillStyle = "#22c55e";
 ctx.beginPath();
 ctx.ellipse(-8, 6 - shootH + 2, 7 * g, 3.5 * g, -0.6, 0, Math.PI * 2);
 ctx.fill();
 ctx.beginPath();
 ctx.ellipse(8, 6 - shootH + 2, 7 * g, 3.5 * g, 0.6, 0, Math.PI * 2);
 ctx.fill();
 }
 // second leaf pair
 if (g > 0.7) {
 ctx.fillStyle = "#4ade80";
 ctx.beginPath();
 ctx.ellipse(-6, 6 - shootH - 6, 5, 2.5, -0.4, 0, Math.PI * 2);
 ctx.fill();
 ctx.beginPath();
 ctx.ellipse(6, 6 - shootH - 6, 5, 2.5, 0.4, 0, Math.PI * 2);
 ctx.fill();
 }
 }
 ctx.restore();
}

function iconDog(ctx, x, y, s = 1) {
 ctx.save();
 ctx.translate(x, y);
 ctx.scale(s || 1, s || 1);
 // body
 const fur = ctx.createLinearGradient(-16, -8, 16, 12);
 fur.addColorStop(0, "#f59e0b");
 fur.addColorStop(1, "#b45309");
 ctx.fillStyle = fur;
 ctx.beginPath();
 ctx.ellipse(0, 4, 18, 11, 0, 0, Math.PI * 2);
 ctx.fill();
 // head
 ctx.beginPath();
 ctx.ellipse(16, -4, 10, 9, 0, 0, Math.PI * 2);
 ctx.fill();
 // snout
 ctx.fillStyle = "#fbbf24";
 ctx.beginPath();
 ctx.ellipse(24, -2, 6, 4, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#1c1917";
 ctx.beginPath();
 ctx.arc(28, -2, 2, 0, Math.PI * 2);
 ctx.fill();
 // ear
 ctx.fillStyle = "#92400e";
 ctx.beginPath();
 ctx.ellipse(12, -10, 4, 7, -0.4, 0, Math.PI * 2);
 ctx.fill();
 // eye
 ctx.fillStyle = "#1c1917";
 ctx.beginPath();
 ctx.arc(18, -6, 1.6, 0, Math.PI * 2);
 ctx.fill();
 // legs
 ctx.fillStyle = "#b45309";
 [[-10, 12], [-2, 12], [6, 12], [12, 12]].forEach(([lx, ly]) => {
 roundRect(ctx, lx - 2, ly, 4, 8, 1);
 ctx.fill();
 });
 // tail
 ctx.strokeStyle = "#b45309";
 ctx.lineWidth = 3;
 ctx.lineCap = "round";
 ctx.beginPath();
 ctx.moveTo(-16, 0);
 ctx.quadraticCurveTo(-24, -10, -18, -14);
 ctx.stroke();
 ctx.restore();
}

function iconPerson(ctx, x, y, s = 1) {
 ctx.save();
 ctx.translate(x, y);
 ctx.scale(s || 1, s || 1);
 // head
 const skin = "#fcd34d";
 ctx.fillStyle = skin;
 ctx.beginPath();
 ctx.arc(0, -14, 8, 0, Math.PI * 2);
 ctx.fill();
 // hair
 ctx.fillStyle = "#292524";
 ctx.beginPath();
 ctx.arc(0, -16, 8, Math.PI, 0);
 ctx.fill();
 // torso
 const shirt = ctx.createLinearGradient(-10, -4, 10, 16);
 shirt.addColorStop(0, "#38bdf8");
 shirt.addColorStop(1, "#0284c7");
 ctx.fillStyle = shirt;
 roundRect(ctx, -9, -5, 18, 20, 4);
 ctx.fill();
 // arms
 ctx.fillStyle = skin;
 roundRect(ctx, -14, -2, 5, 14, 2);
 ctx.fill();
 roundRect(ctx, 9, -2, 5, 14, 2);
 ctx.fill();
 // legs
 ctx.fillStyle = "#1e3a8a";
 roundRect(ctx, -7, 14, 6, 12, 2);
 ctx.fill();
 roundRect(ctx, 1, 14, 6, 12, 2);
 ctx.fill();
 ctx.restore();
}

function iconChair(ctx, x, y, s = 1) {
 ctx.save();
 ctx.translate(x, y);
 ctx.scale(s || 1, s || 1);
 ctx.fillStyle = "#a16207";
 // seat
 roundRect(ctx, -14, 0, 28, 6, 2);
 ctx.fill();
 // back
 roundRect(ctx, -14, -20, 5, 20, 2);
 ctx.fill();
 ctx.fillStyle = "#78350f";
 // legs
 ctx.fillRect(-12, 6, 4, 12);
 ctx.fillRect(8, 6, 4, 12);
 ctx.fillRect(-12, -18, 3, 16);
 // wood grain
 ctx.strokeStyle = "rgba(69,26,3,0.35)";
 ctx.beginPath();
 ctx.moveTo(-10, 2);
 ctx.lineTo(10, 3);
 ctx.stroke();
 ctx.restore();
}

function iconCar(ctx, x, y, s = 1) {
 ctx.save();
 ctx.translate(x, y);
 ctx.scale(s || 1, s || 1);
 const body = ctx.createLinearGradient(0, -12, 0, 10);
 body.addColorStop(0, "#94a3b8");
 body.addColorStop(1, "#475569");
 ctx.fillStyle = body;
 roundRect(ctx, -22, -4, 44, 14, 4);
 ctx.fill();
 // cabin
 ctx.fillStyle = "#64748b";
 ctx.beginPath();
 ctx.moveTo(-8, -4);
 ctx.lineTo(-2, -14);
 ctx.lineTo(12, -14);
 ctx.lineTo(18, -4);
 ctx.closePath();
 ctx.fill();
 ctx.fillStyle = "#bae6fd";
 ctx.fillRect(-1, -12, 10, 6);
 // wheels
 ctx.fillStyle = "#1c1917";
 ctx.beginPath();
 ctx.arc(-12, 10, 5, 0, Math.PI * 2);
 ctx.arc(12, 10, 5, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#a8a29e";
 ctx.beginPath();
 ctx.arc(-12, 10, 2, 0, Math.PI * 2);
 ctx.arc(12, 10, 2, 0, Math.PI * 2);
 ctx.fill();
 // headlight
 ctx.fillStyle = "#fef08a";
 ctx.beginPath();
 ctx.arc(20, 0, 2.5, 0, Math.PI * 2);
 ctx.fill();
 ctx.restore();
}

function iconCloud(ctx, x, y, s = 1) {
 ctx.save();
 ctx.translate(x, y);
 ctx.scale(s || 1, s || 1);
 const g = ctx.createLinearGradient(0, -12, 0, 12);
 g.addColorStop(0, "#f8fafc");
 g.addColorStop(1, "#cbd5e1");
 ctx.fillStyle = g;
 ctx.beginPath();
 ctx.arc(-12, 2, 11, 0, Math.PI * 2);
 ctx.arc(2, -6, 13, 0, Math.PI * 2);
 ctx.arc(14, 2, 12, 0, Math.PI * 2);
 ctx.arc(0, 6, 10, 0, Math.PI * 2);
 ctx.fill();
 ctx.restore();
}

function drawItem(ctx, id, x, y, s = 0.85) {
 switch (id) {
 case "dog":
 iconDog(ctx, x, y, s);
 break;
 case "tree":
 iconTree(ctx, x, y, 1, s, 0.4);
 break;
 case "rock":
 iconRock(ctx, x, y, s);
 break;
 case "chair":
 iconChair(ctx, x, y, s);
 break;
 case "mushroom":
 iconMushroom(ctx, x, y, s, 4);
 break;
 case "car":
 iconCar(ctx, x, y, s);
 break;
 case "person":
 iconPerson(ctx, x, y, s);
 break;
 case "cloud":
 iconCloud(ctx, x, y, s);
 break;
 default:
 iconSeed(ctx, x, y, 0, s);
 }
}

/** Mini vignette for each MRS GREN letter. */
function drawMrsExample(ctx, traitId, x, y, s = 1) {
 ctx.save();
 ctx.translate(x, y);
 ctx.scale(s, s);
 if (traitId === "movement") {
 iconDog(ctx, -18, 4, 0.55);
 ctx.fillStyle = "rgba(226,232,240,0.7)";
 for (let i = 0; i < 4; i++) {
 ctx.beginPath();
 ctx.arc(14 + i * 5, -6 - i * 3, 1.5, 0, Math.PI * 2);
 ctx.fill();
 }
 } else if (traitId === "respiration") {
 ctx.strokeStyle = "#fbbf24";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.arc(0, 0, 12, 0, Math.PI * 2);
 ctx.stroke();
 ctx.fillStyle = "#4ade80";
 ctx.font = "700 10px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("O₂→ATP", 0, 4);
 } else if (traitId === "sensitivity") {
 iconTree(ctx, 0, 8, 0.7, 0.55, 0);
 ctx.fillStyle = "#fde047";
 ctx.beginPath();
 ctx.arc(18, -14, 6, 0, Math.PI * 2);
 ctx.fill();
 } else if (traitId === "growth") {
 iconSeed(ctx, -14, 6, 0.2, 0.55);
 iconSeed(ctx, 12, 4, 0.95, 0.55);
 } else if (traitId === "reproduction") {
 iconMushroom(ctx, -8, 4, 0.55, 7);
 } else if (traitId === "excretion") {
 ctx.fillStyle = "#94a3b8";
 ctx.beginPath();
 ctx.ellipse(0, -8, 8, 5, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#67e8f9";
 ctx.font = "700 9px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("CO₂ / O₂", 0, 10);
 } else if (traitId === "nutrition") {
 iconTree(ctx, 0, 6, 0.9, 0.5, 0);
 ctx.fillStyle = "#fde047";
 ctx.beginPath();
 ctx.arc(16, -12, 5, 0, Math.PI * 2);
 ctx.fill();
 }
 ctx.restore();
}

function drawChecklist(ctx, x, y, marks, named) {
 MRS_GREN.forEach((t, i) => {
 const yy = y + i * 24;
 roundRect(ctx, x, yy - 10, 210, 22, 6);
 ctx.fillStyle = "rgba(6,78,59,0.85)";
 ctx.fill();
 const m = marks[t.id];
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "left";
 ctx.fillStyle = "#ecfdf5";
 const label = named ? `${t.letter} ${t.name}` : `${i + 1}`;
 ctx.fillText(label, x + 10, yy + 1);
 ctx.textAlign = "right";
 if (m === "partial") {
 ctx.fillStyle = "#fbbf24";
 ctx.fillText("~", x + 198, yy + 1);
 } else if (m === true || m === "yes") {
 ctx.fillStyle = "#4ade80";
 ctx.fillText("✓", x + 198, yy + 1);
 } else if (m === false || m === "no") {
 ctx.fillStyle = "#f87171";
 ctx.fillText("✕", x + 198, yy + 1);
 } else {
 ctx.fillStyle = "#94a3b8";
 ctx.fillText("·", x + 198, yy + 1);
 }
 });
}

function placeSort(id, bin) {
 const item = LIFE_SORT_ITEMS.find((c) => c.id === id);
 if (!item) return;
 if (item.bin !== bin) {
 pulseFailFeedback(280);
 bioLabState.prompt = "Gut check: try the other bin.";
 return;
 }
 bioLabState.lifePlaced = { ...bioLabState.lifePlaced, [id]: bin };
 bioLabState.lifeSelected = null;
 pulseSuccessFeedback(180);
 if (LIFE_SORT_ITEMS.every((c) => bioLabState.lifePlaced[c.id] === c.bin)) {
 bioLabState.lifeSortDone = true;
 pulseSuccessFeedback(320);
 }
}

function placeProve(cardId, traitId) {
 const card = LIFE_PROVE_CARDS.find((c) => c.id === cardId);
 if (!card) return;
 if (card.trait !== traitId) {
 pulseFailFeedback(280);
 bioLabState.prompt = "That clip belongs on a different numbered slot.";
 return;
 }
 bioLabState.lifeProve = { ...bioLabState.lifeProve, [cardId]: traitId };
 bioLabState.lifeProvePick = null;
 pulseSuccessFeedback(180);
 if (LIFE_PROVE_CARDS.every((c) => bioLabState.lifeProve[c.id] === c.trait)) {
 bioLabState.lifeProveDone = true;
 pulseSuccessFeedback(320);
 }
}

function proveStage() {
 return Object.keys(bioLabState.lifeProve || {}).length;
}

export function registerLifeScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("lifeOpen", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const start = performance.now();
 const spots = [
 { id: "flame", label: "Flame", draw: (c, x, y) => iconFlame(c, x, y, 1.2, { fuel: 0.2, flicker: 1 }) },
 { id: "crystal", label: "Crystal", draw: iconCrystal },
 { id: "virus", label: "Virus particle", draw: iconVirus },
 { id: "cat", label: "Sleeping cat", draw: iconCat },
 ];
 setDescription("Four suspects. Which of these are alive?");
 setIntentHandler((intent) => {
 if (intent.type !== "CANVAS_TAP") return;
 if (intent.meta?.action === "spot") {
 bioLabState.lifeSpot = Number(intent.meta.i) || 0;
 bioLabState.lifeSeen = true;
 pulseSuccessFeedback(160);
 }
 if (intent.meta?.action === "start") {
 bioLabState.lifeSeen = true;
 pulseSuccessFeedback(200);
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 bioLabState.lifeOpenU = Math.min(1, t / 1.4);
 fillLab(ctx, w, h);
 // desk surface
 ctx.fillStyle = "#78350f";
 roundRect(ctx, w * 0.06, h * 0.58, w * 0.88, h * 0.2, 10);
 ctx.fill();
 ctx.fillStyle = "#a16207";
 roundRect(ctx, w * 0.08, h * 0.56, w * 0.84, 10, 6);
 ctx.fill();
 const auto = Math.floor(t / 1.15) % 4;
 const spot = bioLabState.lifeSeen ? bioLabState.lifeSpot : auto;
 const xs = [0.18, 0.4, 0.6, 0.82];
 const hits = [];
 spots.forEach((s, i) => {
 const x = w * xs[i];
 const y = h * 0.42;
 if (spot === i) {
 ctx.fillStyle = "rgba(253,224,71,0.18)";
 ctx.beginPath();
 ctx.arc(x, y, 52, 0, Math.PI * 2);
 ctx.fill();
 }
 s.draw(ctx, x, y, 1.2);
 drawLabel(ctx, s.label, x, y + 44, { h: 22, font: "700 11px Segoe UI" });
 hits.push({ id: `spot-${i}`, shape: "ellipse", x, y, r: 42, meta: { action: "spot", i } });
 });
 const tips = [
 "Flame: moves and needs fuel - but has no cells.",
 "Crystal: gets bigger by stacking minerals - not living growth.",
 "Virus: genetic shell with spikes - only copies inside a host cell.",
 "Sleeping cat: not moving now, but still a living animal.",
 ];
 drawLabel(ctx, tips[spot], w * 0.5, 28, { font: "600 12px Segoe UI, sans-serif", h: 28 });
 drawCanvasBtn(
 ctx,
 w * 0.5,
 h - 36,
 240,
 40,
 "Start the Investigation",
 bioLabState.lifeOpenU > 0 || !!bioLabState.lifeSeen,
 );
 hits.push({ id: "start", shape: "rect", x: w * 0.5, y: h - 36, w: 250, h: 44, meta: { action: "start" } });
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("lifeSort", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const cardPos = {};
 LIFE_SORT_ITEMS.forEach((c) => {
 cardPos[c.id] = { x: 0, y: 0 };
 });
 let draggingId = null;
 setDescription("Sort by gut instinct. Living or non-living. No trick items yet.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DOWN" && intent.meta?.chipId) {
 draggingId = intent.meta.chipId;
 bioLabState.lifeSelected = intent.meta.chipId;
 }
 if (intent.type === "CANVAS_DRAG" && intent.meta?.chipId && cardPos[intent.meta.chipId]) {
 cardPos[intent.meta.chipId].x = intent.x;
 cardPos[intent.meta.chipId].y = intent.y;
 }
 if (intent.type === "CANVAS_TAP" && intent.meta?.chipId) bioLabState.lifeSelected = intent.meta.chipId;
 if (intent.type === "CANVAS_TAP" && intent.meta?.bin && bioLabState.lifeSelected) {
 placeSort(bioLabState.lifeSelected, intent.meta.bin);
 }
 if (intent.type === "CANVAS_UP" && intent.meta?.chipId) {
 if (intent.dropMeta?.bin) placeSort(intent.meta.chipId, intent.dropMeta.bin);
 draggingId = null;
 } else if (intent.type === "CANVAS_UP") draggingId = null;
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 fillOutdoor(ctx, w, h, performance.now() / 1000, { wind: true, sunX: w * 0.88, sunY: h * 0.1 });
 // dim for UI
 ctx.fillStyle = "rgba(6,78,59,0.35)";
 ctx.fillRect(0, 0, w, h);
 const bins = [
 { id: "living", label: "Living", x: w * 0.26, color: "#4ade80" },
 { id: "nonliving", label: "Non-living", x: w * 0.74, color: "#94a3b8" },
 ];
 const bw = w * 0.42;
 const bh = h * 0.3;
 const by = h * 0.14;
 const hits = [];
 bins.forEach((b) => {
 roundRect(ctx, b.x - bw / 2, by, bw, bh, 12);
 ctx.fillStyle = "rgba(6,78,59,0.65)";
 ctx.fill();
 ctx.strokeStyle = b.color;
 ctx.lineWidth = 2.4;
 ctx.stroke();
 drawLabel(ctx, b.label, b.x, by + 16, { h: 22 });
 hits.push({
 id: `bin-${b.id}`,
 shape: "rect",
 x: b.x,
 y: by + bh / 2,
 w: bw,
 h: bh,
 meta: { bin: b.id },
 });
 });
 const placed = bioLabState.lifePlaced || {};
 const bank = LIFE_SORT_ITEMS.filter((c) => !placed[c.id]);
 LIFE_SORT_ITEMS.forEach((c) => {
 let tx;
 let ty;
 if (placed[c.id]) {
 const b = bins.find((z) => z.id === placed[c.id]);
 const inBin = LIFE_SORT_ITEMS.filter((x) => placed[x.id] === placed[c.id]);
 const idx = inBin.indexOf(c);
 tx = b.x - 60 + (idx % 2) * 70;
 ty = by + 55 + Math.floor(idx / 2) * 48;
 } else {
 const idx = bank.indexOf(c);
 tx = w * 0.14 + (idx % 4) * (w * 0.24);
 ty = h * 0.58 + Math.floor(idx / 4) * 52;
 }
 const p = cardPos[c.id];
 if (!p.x && !p.y) {
 p.x = tx;
 p.y = ty;
 }
 if (draggingId !== c.id) {
 p.x += (tx - p.x) * 0.2;
 p.y += (ty - p.y) * 0.2;
 }
 const sel = bioLabState.lifeSelected === c.id;
 roundRect(ctx, p.x - 48, p.y - 24, 96, 48, 10);
 ctx.fillStyle = sel ? "rgba(74,222,128,0.45)" : "rgba(15,23,42,0.88)";
 ctx.fill();
 ctx.strokeStyle = sel ? "#4ade80" : "rgba(148,163,184,0.35)";
 ctx.lineWidth = 1.5;
 ctx.stroke();
 drawItem(ctx, c.id, p.x - 22, p.y - 2, 0.72);
 ctx.fillStyle = "#ecfdf5";
 ctx.font = "700 11px Segoe UI";
 ctx.textAlign = "left";
 ctx.textBaseline = "middle";
 ctx.fillText(c.label, p.x - 2, p.y + 1);
 hits.push({
 id: c.id,
 shape: "rect",
 x: p.x,
 y: p.y,
 w: 100,
 h: 50,
 meta: { chipId: c.id },
 onDrag(pt) {
 draggingId = c.id;
 p.x = pt.x;
 p.y = pt.y;
 },
 });
 });
 const selItem = LIFE_SORT_ITEMS.find((c) => c.id === bioLabState.lifeSelected);
 const msg = bioLabState.lifeSortDone
 ? "Correct. You sorted by what actually stays alive."
 : selItem
 ? `${selItem.label}: ${selItem.hint}`
 : bioLabState.prompt || "Drag each thing into Living or Non-living.";
 drawLabel(ctx, msg, w * 0.5, 22, { font: "600 12px Segoe UI, sans-serif", h: 26 });
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("lifeCompare", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 const start = performance.now();
 setDescription("Tree versus rock. Watch growth under sun and wind.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 const phase = bioLabState.phase || "see";
 if (phase === "word") {
 fillLab(ctx, w, h);
 const bits = [
 "Grow (tree gets taller and thicker)",
 "Use energy (sunlight → sugar)",
 "Respond (leaves move with wind and light)",
 "Reproduce (new seeds)",
 "Move parts (branches sway; roots push)",
 ];
 ctx.fillStyle = "#bbf7d0";
 ctx.font = "800 16px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("Things living things actually do", w * 0.5, h * 0.16);
 bits.forEach((b, i) => drawLabel(ctx, `✓  ${b}`, w * 0.5, h * 0.3 + i * 34, { h: 28 }));
 } else {
 // Frame-by-frame growth 0 → 1 over ~6s
 const grow = Math.min(1.15, t / 5.5);
 const treeX = w * 0.3;
 const treeScale = 1.55;
 const rockX = w * 0.72;
 const groundY = h * 0.7;
 // Plant so local ground (y=10) lands exactly on the soil surface
 const treeY = groundY - TREE_LOCAL_GROUND * treeScale;
 const rockY = groundY - 4;
 fillOutdoor(ctx, w, h, t, {
 sunX: w * 0.82,
 sunY: h * 0.14,
 groundY,
 beamTo: [treeX, treeY - 40 - grow * 30],
 wind: true,
 });
 drawLabel(ctx, "Sunlight + wind", w * 0.82, h * 0.28, { h: 22, font: "600 11px Segoe UI" });
 iconTree(ctx, treeX, treeY, grow, treeScale, 0.35);
 iconRock(ctx, rockX, rockY, 1.45);
 drawLabel(ctx, "Living tree", treeX, Math.min(h - 18, groundY + 28), { h: 22 });
 drawLabel(ctx, "Non-living rock", rockX, Math.min(h - 18, groundY + 28), { h: 22 });
 const lines = [
 grow > 0.15 ? `Frame growth: trunk + canopy ${(grow * 100) | 0}% taller` : "Sun rays hit the tree. Watch it grow.",
 grow > 0.4 ? "Wind moves the leaves. The rock does not respond." : "",
 grow > 0.75 ? "Mature tree drops seeds. The rock never reproduces." : "",
 ].filter(Boolean);
 lines.forEach((line, i) => drawLabel(ctx, line, w * 0.5, 24 + i * 28, { h: 24 }));
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("lifeProve", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 setDescription("Prove the mushroom is alive. Each filled slot changes the mushroom.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.card) bioLabState.lifeProvePick = intent.meta.card;
 if (intent.type === "CANVAS_TAP" && intent.meta?.trait && bioLabState.lifeProvePick) {
 placeProve(bioLabState.lifeProvePick, intent.meta.trait);
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 fillLab(ctx, w, h);
 // Full-width forest floor so the log is not floating on a stub
 const floorY = h * 0.52;
 ctx.fillStyle = "#292524";
 ctx.fillRect(0, floorY, w, h - floorY);
 ctx.fillStyle = "#3f2a14";
 ctx.fillRect(0, floorY, w, 18);
 const stage = proveStage();
 iconMushroom(ctx, w * 0.22, floorY - 8, 2.2, stage);
 const stageTips = [
 "Empty case: place evidence clips into slots 1-7.",
 "Nutrition: threads feed on the wood.",
 "Growth: stem and cap get larger.",
 "Sensitivity: whole mushroom tilts toward light.",
 "Movement: spores puff into the air.",
 "Excretion: moisture leaves the tissues.",
 "Reproduction: a new mushroom sprouts.",
 "Complete: seven independent life signs.",
 ];
 drawLabel(ctx, stageTips[stage] || stageTips[0], w * 0.22, Math.min(h * 0.62, floorY + 36), {
 font: "600 11px Segoe UI",
 h: 24,
 maxW: w * 0.4,
 });
 const hits = [];
 MRS_GREN.forEach((t, i) => {
 const x = w * 0.72;
 const y = h * 0.12 + i * 30;
 const filled = Object.values(bioLabState.lifeProve || {}).includes(t.id);
 const card = LIFE_PROVE_CARDS.find((c) => c.trait === t.id && bioLabState.lifeProve[c.id]);
 roundRect(ctx, x - 118, y - 12, 236, 26, 8);
 ctx.fillStyle = filled ? "rgba(22,163,74,0.6)" : "rgba(6,78,59,0.7)";
 ctx.fill();
 ctx.fillStyle = "#ecfdf5";
 ctx.font = "700 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(filled ? `${i + 1} ✓ ${card?.label?.slice(0, 22) || t.name}` : `Slot ${i + 1} - empty`, x, y + 1);
 hits.push({ id: `slot-${t.id}`, shape: "rect", x, y, w: 236, h: 28, meta: { trait: t.id } });
 });
 const unused = LIFE_PROVE_CARDS.filter((c) => !bioLabState.lifeProve[c.id]);
 unused.forEach((c, i) => {
 const x = w * (0.12 + (i % 4) * 0.2);
 const y = h * 0.72 + Math.floor(i / 4) * 36;
 const sel = bioLabState.lifeProvePick === c.id;
 drawCanvasBtn(ctx, x, y, 150, 30, c.label.slice(0, 18), sel);
 hits.push({ id: `card-${c.id}`, shape: "rect", x, y, w: 154, h: 32, meta: { card: c.id } });
 });
 const msg = bioLabState.lifeProveDone
 ? "Full case: seven pieces of evidence. The mushroom changes with each slot."
 : bioLabState.prompt || "Tap a clip, then the numbered slot. Watch the mushroom change.";
 drawLabel(ctx, msg, w * 0.5, 22, { font: "600 12px Segoe UI, sans-serif", h: 26 });
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("lifeMrs", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 const start = performance.now();
 setDescription("MRS GREN with a real-life example for each letter.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 const phase = bioLabState.phase || "icons";
 fillLab(ctx, w, h);
 ctx.fillStyle = "#86efac";
 ctx.font = "800 22px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("MRS GREN", w * 0.5, 32);
 if (phase === "card") {
 MRS_GREN.forEach((tr, i) => {
 const y = 58 + i * 42;
 roundRect(ctx, w * 0.06, y - 16, w * 0.88, 38, 8);
 ctx.fillStyle = "rgba(6,78,59,0.75)";
 ctx.fill();
 ctx.fillStyle = "#bbf7d0";
 ctx.font = "800 12px Segoe UI";
 ctx.textAlign = "left";
 ctx.fillText(`${tr.letter}  ${tr.name}`, w * 0.1, y - 2);
 ctx.fillStyle = "#dcfce7";
 ctx.font = "600 10px Segoe UI";
 ctx.fillText(tr.example, w * 0.1, y + 12);
 });
 } else {
 const show = Math.min(7, 1 + Math.floor(t / 0.4));
 MRS_GREN.slice(0, show).forEach((tr, i) => {
 const col = i % 4;
 const row = Math.floor(i / 4);
 const x = w * (0.16 + col * 0.23);
 const y = h * (0.28 + row * 0.38);
 roundRect(ctx, x - 70, y - 48, 140, 100, 12);
 ctx.fillStyle = "rgba(15,23,42,0.75)";
 ctx.fill();
 drawMrsExample(ctx, tr.id, x, y - 8, 1.1);
 drawLabel(ctx, `${tr.letter}  ${tr.name}`, x, y + 36, { h: 22 });
 });
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("lifeSuspects", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 setDescription("Run the same checklist on four tricky suspects.");
 const suspects = [
 { id: "flame", label: "Flame", draw: null },
 { id: "crystal", label: "Crystal", draw: iconCrystal },
 { id: "virus", label: "Virus particle", draw: iconVirus },
 { id: "seed", label: "Dormant seed", draw: null },
 ];
 setIntentHandler((intent) => {
 if (intent.type !== "CANVAS_TAP") return;
 if (intent.meta?.action === "water") {
 bioLabState.lifeSeedWater = true;
 bioLabState.lifeSeedT0 = performance.now();
 pulseSuccessFeedback(220);
 }
 if (intent.meta?.ev) {
 const i = bioLabState.lifeSuspect || 0;
 if (i === 0) {
 const ev = LIFE_FLAME_EVIDENCE.find((e) => e.id === intent.meta.ev);
 if (ev) {
 bioLabState.lifeMarks = { ...bioLabState.lifeMarks, [ev.trait]: true };
 if (ev.effect === "fuel") bioLabState.lifeFlameFuel = Math.min(1, bioLabState.lifeFlameFuel + 0.45);
 if (ev.effect === "wind") bioLabState.lifeFlameWind = 1;
 if (ev.effect === "smoke") bioLabState.lifeFlameSmoke = 1;
 if (ev.effect === "flicker") bioLabState.lifeFlameFlicker = 1;
 if (ev.effect === "consume") bioLabState.lifeFlameFuel = Math.max(0.15, bioLabState.lifeFlameFuel * 0.7);
 pulseSuccessFeedback(160);
 }
 }
 if (i === 1 && intent.meta.ev === "layers") {
 bioLabState.lifeMarks = { growth: true };
 pulseSuccessFeedback(160);
 }
 if (i === 2 && intent.meta.ev === "hijack") {
 bioLabState.lifeMarks = { reproduction: "partial" };
 pulseSuccessFeedback(160);
 }
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 fillLab(ctx, w, h);
 const i = bioLabState.lifeSuspect || 0;
 const s = suspects[i];
 if (i === 0) {
 iconFlame(ctx, w * 0.22, h * 0.4, 1.7, {
 fuel: bioLabState.lifeFlameFuel || 0,
 wind: bioLabState.lifeFlameWind || 0,
 smoke: bioLabState.lifeFlameSmoke || 0,
 flicker: bioLabState.lifeFlameFlicker || 0.5,
 });
 if ((bioLabState.lifeMarks || {}).growth) {
 drawLabel(ctx, "Fuel added → flame grows taller", w * 0.22, h * 0.62, { h: 22 });
 }
 } else if (i === 3) {
 const sprout =
 bioLabState.lifeSeedWater && bioLabState.lifeSeedT0
 ? Math.min(1, (performance.now() - bioLabState.lifeSeedT0) / 4500)
 : 0;
 iconSeed(ctx, w * 0.22, h * 0.4, sprout, 1.6);
 if (bioLabState.lifeSeedWater) {
 drawLabel(
 ctx,
 sprout < 1 ? `Sprouting… ${(sprout * 100) | 0}%` : "Seedling leaves open - life was paused, not absent",
 w * 0.22,
 h * 0.64,
 { h: 22 },
 );
 }
 } else {
 s.draw(ctx, w * 0.22, h * 0.4, 1.7);
 }
 drawLabel(ctx, s.label, w * 0.22, h * 0.7, { h: 22 });
 drawChecklist(ctx, w * 0.42, h * 0.14, bioLabState.lifeMarks || {}, true);
 const hits = [];
 const msgs = [
 "Tap each flame behavior. Watch fuel make the flame grow; wind lean; smoke rise.",
 "Only Growth lights up - stacking minerals is not building living cells.",
 "Virus: spike-covered particle. Copies only by hijacking a living host cell.",
 bioLabState.lifeSeedWater
 ? "Water unlocked the cycle: root, shoot, then leaves - frame by frame."
 : "Dry seed looks dead. Add water and watch the work cycle start.",
 ];
 drawLabel(ctx, msgs[i], w * 0.5, 22, { font: "600 11px Segoe UI, sans-serif", h: 28 });
 if (i === 0) {
 LIFE_FLAME_EVIDENCE.forEach((e, n) => {
 const x = w * (0.14 + (n % 3) * 0.24);
 const y = h * 0.78 + Math.floor(n / 3) * 34;
 const lit = !!(bioLabState.lifeMarks || {})[e.trait];
 drawCanvasBtn(ctx, x, y, 150, 28, e.label.slice(0, 20), lit);
 hits.push({ id: e.id, shape: "rect", x, y, w: 154, h: 30, meta: { ev: e.id } });
 });
 }
 if (i === 1) {
 drawCanvasBtn(ctx, w * 0.22, h - 40, 180, 34, "Adds mineral layers", !!(bioLabState.lifeMarks || {}).growth);
 hits.push({ id: "layers", shape: "rect", x: w * 0.22, y: h - 40, w: 190, h: 36, meta: { ev: "layers" } });
 }
 if (i === 2) {
 drawCanvasBtn(
 ctx,
 w * 0.22,
 h - 40,
 200,
 34,
 "Hijacks a host cell",
 (bioLabState.lifeMarks || {}).reproduction === "partial",
 );
 hits.push({ id: "hijack", shape: "rect", x: w * 0.22, y: h - 40, w: 210, h: 36, meta: { ev: "hijack" } });
 }
 if (i === 3) {
 drawCanvasBtn(ctx, w * 0.22, h - 40, 170, 34, "Add water", !!bioLabState.lifeSeedWater);
 hits.push({ id: "water", shape: "rect", x: w * 0.22, y: h - 40, w: 180, h: 36, meta: { action: "water" } });
 }
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("lifeScore", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 setDescription("One scorecard. Real life passes nearly all seven on its own terms.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const phase = bioLabState.phase || "table";
 fillLab(ctx, w, h);
 if (phase === "virus") {
 iconVirus(ctx, w * 0.5, h * 0.28, 2.4);
 drawLabel(ctx, "Usually classified as non-living", w * 0.5, h * 0.52, { h: 26 });
 drawLabel(ctx, "Some biologists say: on the border of life", w * 0.5, h * 0.62, { h: 26 });
 drawLabel(ctx, "No own metabolism - only copies inside a host.", w * 0.5, h * 0.78, { h: 26 });
 } else {
 const cols = ["Flame", "Crystal", "Virus", "Seed"];
 const grid = [
 ["✓", "✕", "✕", "✓"],
 ["✕", "✕", "✕", "✓"],
 ["✓", "✕", "✕", "✓"],
 ["✓", "✓", "✕", "✓"],
 ["✕", "✕", "~", "✓"],
 ["✓", "✕", "✕", "✓"],
 ["✓", "✕", "✕", "✓"],
 ];
 ctx.fillStyle = "#bbf7d0";
 ctx.font = "700 11px Segoe UI";
 ctx.textAlign = "center";
 cols.forEach((c, i) => ctx.fillText(c, w * (0.34 + i * 0.16), 56));
 MRS_GREN.forEach((t, r) => {
 ctx.textAlign = "left";
 ctx.fillStyle = "#dcfce7";
 ctx.fillText(t.letter, w * 0.08, 86 + r * 28);
 grid[r].forEach((cell, c) => {
 ctx.textAlign = "center";
 ctx.fillStyle = cell === "✓" ? "#4ade80" : cell === "~" ? "#fbbf24" : "#f87171";
 ctx.fillText(cell, w * (0.34 + c * 0.16), 86 + r * 28);
 });
 });
 drawLabel(ctx, "Living things pass nearly all seven, using their own cells.", w * 0.5, h - 28, { h: 26 });
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("lifeMars", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 setDescription("Same MRS GREN checklist. Flag each Mars sensor reading.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const i = bioLabState.lifeMarsI || 0;
 const item = LIFE_MARS[i] || LIFE_MARS[0];
 const t = performance.now() / 1000;

 // Mars sky + ground
 const sky = ctx.createLinearGradient(0, 0, 0, h);
 sky.addColorStop(0, "#9a3412");
 sky.addColorStop(0.55, "#7c2d12");
 sky.addColorStop(1, "#431407");
 ctx.fillStyle = sky;
 ctx.fillRect(0, 0, w, h);
 ctx.fillStyle = "#c2410c";
 ctx.fillRect(0, h * 0.62, w, h * 0.38);
 // dunes
 ctx.fillStyle = "rgba(154,52,18,0.55)";
 ctx.beginPath();
 ctx.moveTo(0, h * 0.62);
 ctx.quadraticCurveTo(w * 0.3, h * 0.55, w * 0.55, h * 0.62);
 ctx.quadraticCurveTo(w * 0.8, h * 0.68, w, h * 0.58);
 ctx.lineTo(w, h);
 ctx.lineTo(0, h);
 ctx.fill();

 // Labeled rover (not two mystery boxes)
 const rx = w * 0.14;
 const ry = h * 0.58;
 ctx.fillStyle = "#cbd5e1";
 roundRect(ctx, rx - 28, ry - 12, 56, 22, 5);
 ctx.fill();
 ctx.fillStyle = "#64748b";
 roundRect(ctx, rx - 10, ry - 28, 28, 16, 3);
 ctx.fill();
 ctx.fillStyle = "#1e293b";
 ctx.beginPath();
 ctx.arc(rx - 16, ry + 12, 7, 0, Math.PI * 2);
 ctx.arc(rx + 16, ry + 12, 7, 0, Math.PI * 2);
 ctx.fill();
 // camera mast
 ctx.strokeStyle = "#e2e8f0";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.moveTo(rx + 8, ry - 28);
 ctx.lineTo(rx + 8, ry - 40);
 ctx.stroke();
 ctx.fillStyle = "#fbbf24";
 ctx.beginPath();
 ctx.arc(rx + 8, ry - 42, 4, 0, Math.PI * 2);
 ctx.fill();
 drawLabel(ctx, "Mars rover", rx, ry + 28, { h: 20, font: "700 10px Segoe UI" });

 // Case visual - center stage
 const cx = w * 0.58;
 const cy = h * 0.42;
 if (i === 0) {
 // Rock formation slowly changing shape
 const pulse = 0.85 + Math.sin(t * 0.8) * 0.12;
 ctx.fillStyle = "#78716c";
 ctx.beginPath();
 ctx.moveTo(cx - 40 * pulse, cy + 30);
 ctx.lineTo(cx - 20, cy - 10 * pulse);
 ctx.lineTo(cx + 5, cy - 28);
 ctx.lineTo(cx + 35 * pulse, cy - 5);
 ctx.lineTo(cx + 42, cy + 30);
 ctx.closePath();
 ctx.fill();
 ctx.fillStyle = "#a8a29e";
 ctx.beginPath();
 ctx.moveTo(cx - 10, cy + 30);
 ctx.lineTo(cx, cy - 5);
 ctx.lineTo(cx + 18, cy + 30);
 ctx.fill();
 drawLabel(ctx, "Rock slowly changing shape", cx, cy + 52, { h: 22 });
 drawLabel(ctx, "Looks like Growth only - weak signal", cx, cy + 78, { h: 22 });
 } else if (i === 1) {
 // Gas plume + rhythm bars
 ctx.fillStyle = "rgba(148,163,184,0.35)";
 for (let k = 0; k < 5; k++) {
 const gy = cy + 20 - k * 14 - Math.sin(t * 2 + k) * 4;
 ctx.beginPath();
 ctx.ellipse(cx, gy, 10 + k * 5, 6 + k * 2, 0, 0, Math.PI * 2);
 ctx.fill();
 }
 // daily rhythm graph
 ctx.strokeStyle = "#4ade80";
 ctx.lineWidth = 2;
 ctx.beginPath();
 for (let x = 0; x < 120; x++) {
 const px = cx - 60 + x;
 const py = cy + 55 + Math.sin(x * 0.2 + t) * 10 * (x % 40 < 20 ? 1 : 0.2);
 if (x === 0) ctx.moveTo(px, py);
 else ctx.lineTo(px, py);
 }
 ctx.stroke();
 drawLabel(ctx, "Gas plume on a daily rhythm", cx, cy - 50, { h: 22 });
 drawLabel(ctx, "Possible Respiration → strong evidence", cx, cy + 88, { h: 22 });
 } else if (i === 2) {
 // Smooth metal artifact
 const metal = ctx.createLinearGradient(cx - 40, cy - 30, cx + 40, cy + 30);
 metal.addColorStop(0, "#e2e8f0");
 metal.addColorStop(0.5, "#94a3b8");
 metal.addColorStop(1, "#475569");
 ctx.fillStyle = metal;
 roundRect(ctx, cx - 36, cy - 24, 72, 48, 8);
 ctx.fill();
 ctx.strokeStyle = "rgba(255,255,255,0.5)";
 ctx.lineWidth = 2;
 ctx.stroke();
 ctx.fillStyle = "rgba(255,255,255,0.35)";
 roundRect(ctx, cx - 20, cy - 12, 18, 8, 2);
 ctx.fill();
 drawLabel(ctx, "Smooth metal object", cx, cy + 48, { h: 22 });
 drawLabel(ctx, "None of the 7 life signs → not biology", cx, cy + 74, { h: 22 });
 } else {
 // Warmed sample dish
 ctx.fillStyle = "#e2e8f0";
 ctx.beginPath();
 ctx.ellipse(cx, cy + 8, 42, 14, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#86efac";
 ctx.beginPath();
 ctx.ellipse(cx, cy + 4, 28, 9, 0, 0, Math.PI * 2);
 ctx.fill();
 // heat waves
 ctx.strokeStyle = "rgba(251,191,36,0.7)";
 ctx.lineWidth = 2;
 for (let k = 0; k < 3; k++) {
 ctx.beginPath();
 ctx.moveTo(cx - 20 + k * 16, cy - 10);
 ctx.quadraticCurveTo(cx - 14 + k * 16, cy - 22 - Math.sin(t * 3 + k) * 4, cx - 20 + k * 16, cy - 34);
 ctx.stroke();
 }
 // water drop
 ctx.fillStyle = "#38bdf8";
 ctx.beginPath();
 ctx.ellipse(cx + 36, cy - 8, 6, 8, 0.2, 0, Math.PI * 2);
 ctx.fill();
 drawLabel(ctx, "Sample + water + warmth", cx, cy + 40, { h: 22 });
 drawLabel(ctx, "Metabolism chemistry → strong (like a seed waking)", cx, cy + 66, { h: 22 });
 }

 drawLabel(
 ctx,
 `Sensor ${item.optional ? "optional" : `${i + 1} of 3`}: ${item.title}`,
 w * 0.5,
 26,
 { h: 26, font: "700 13px Segoe UI" },
 );
 drawLabel(ctx, "Use the panel: Weak / Strong / No evidence", w * 0.5, h - 28, { h: 24 });
 const ans = (bioLabState.lifeMars || [])[i];
 if (ans) {
 const pretty = ans === "weak" ? "Weak / inconclusive" : ans === "strong" ? "Strong evidence" : "No biological evidence";
 drawLabel(ctx, `You flagged: ${pretty}`, w * 0.5, h - 56, { h: 24 });
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("lifeStakes", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 const start = performance.now();
 setDescription("Three real reasons the alive / not-alive line matters.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const phase = bioLabState.phase || "montage";
 const t = (performance.now() - start) / 1000;
 fillLab(ctx, w, h);

 if (phase === "card") {
 // Clean rule card with seven letters
 roundRect(ctx, w * 0.1, h * 0.14, w * 0.8, h * 0.62, 16);
 ctx.fillStyle = "rgba(6,78,59,0.85)";
 ctx.fill();
 ctx.strokeStyle = "rgba(134,239,172,0.55)";
 ctx.lineWidth = 2;
 ctx.stroke();
 ctx.fillStyle = "#86efac";
 ctx.font = "800 22px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("The rule to keep", w * 0.5, h * 0.24);
 ctx.fillStyle = "#bbf7d0";
 ctx.font = "700 14px Segoe UI";
 ctx.fillText("MRS GREN", w * 0.5, h * 0.34);
 MRS_GREN.forEach((tr, i) => {
 const x = w * (0.2 + (i % 4) * 0.2);
 const y = h * (0.44 + Math.floor(i / 4) * 0.12);
 drawLabel(ctx, `${tr.letter} ${tr.name}`, x, y, { h: 24, font: "700 11px Segoe UI" });
 });
 drawLabel(ctx, "Alive = can run essentially all seven using its own biology", w * 0.5, h * 0.72, {
 h: 26,
 font: "600 12px Segoe UI",
 });
 drawLabel(ctx, "Next mission: what tiny unit inside does that work?", w * 0.5, h * 0.88, { h: 24 });
 } else {
 const shot = Math.floor(t / 3.2) % 3;
 drawLabel(ctx, "Why drawing the line correctly matters", w * 0.5, 24, {
 h: 26,
 font: "700 13px Segoe UI",
 });
 // Progress dots
 for (let d = 0; d < 3; d++) {
 ctx.beginPath();
 ctx.arc(w * 0.5 - 24 + d * 24, 48, 5, 0, Math.PI * 2);
 ctx.fillStyle = d === shot ? "#4ade80" : "rgba(148,163,184,0.45)";
 ctx.fill();
 }

 if (shot === 0) {
 // Hydrothermal vent + microbes (extremophiles)
 const vx = w * 0.5;
 const vy = h * 0.58;
 // deep water
 const deep = ctx.createLinearGradient(0, h * 0.2, 0, h);
 deep.addColorStop(0, "#0c4a6e");
 deep.addColorStop(1, "#082f49");
 ctx.fillStyle = deep;
 ctx.fillRect(w * 0.08, h * 0.2, w * 0.84, h * 0.58);
 // vent chimney
 ctx.fillStyle = "#57534e";
 roundRect(ctx, vx - 18, vy - 70, 36, 90, 4);
 ctx.fill();
 // black smoker plume
 ctx.fillStyle = "rgba(15,23,42,0.55)";
 for (let k = 0; k < 6; k++) {
 ctx.beginPath();
 ctx.ellipse(
 vx + Math.sin(t * 2 + k) * 8,
 vy - 80 - k * 12,
 10 + k * 3,
 8 + k * 2,
 0,
 0,
 Math.PI * 2,
 );
 ctx.fill();
 }
 // glowing microbes near vent
 for (let k = 0; k < 8; k++) {
 ctx.fillStyle = k % 2 ? "#fbbf24" : "#4ade80";
 ctx.beginPath();
 ctx.arc(vx - 40 + k * 12, vy + 10 + Math.sin(t + k) * 3, 3, 0, Math.PI * 2);
 ctx.fill();
 }
 drawLabel(ctx, "1 · Extremophile bacteria", vx, h * 0.22, { h: 24 });
 drawLabel(ctx, "Alive in boiling vents - still passes MRS GREN", vx, h * 0.86, { h: 24 });
 } else if (shot === 1) {
 // Clinic: antibiotic bottle vs virus (won't work)
 const lx = w * 0.32;
 const rx = w * 0.68;
 const cy = h * 0.48;
 // pill bottle
 ctx.fillStyle = "#f8fafc";
 roundRect(ctx, lx - 28, cy - 40, 56, 70, 8);
 ctx.fill();
 ctx.fillStyle = "#dc2626";
 roundRect(ctx, lx - 22, cy - 48, 44, 14, 4);
 ctx.fill();
 ctx.fillStyle = "#0f172a";
 ctx.font = "700 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("Antibiotic", lx, cy + 8);
 ctx.fillStyle = "#22c55e";
 roundRect(ctx, lx - 14, cy + 18, 12, 8, 2);
 ctx.fill();
 roundRect(ctx, lx + 2, cy + 18, 12, 8, 2);
 ctx.fill();
 drawLabel(ctx, "Kills living bacteria", lx, cy + 55, { h: 22, font: "600 11px Segoe UI" });

 // big X between
 ctx.strokeStyle = "#f87171";
 ctx.lineWidth = 4;
 ctx.beginPath();
 ctx.moveTo(w * 0.48, cy - 16);
 ctx.lineTo(w * 0.52, cy + 16);
 ctx.moveTo(w * 0.52, cy - 16);
 ctx.lineTo(w * 0.48, cy + 16);
 ctx.stroke();

 // virus target
 iconVirus(ctx, rx, cy - 4, 1.8);
 drawLabel(ctx, "Virus - no cell to disrupt", rx, cy + 55, { h: 22, font: "600 11px Segoe UI" });

 drawLabel(ctx, "2 · Medicine", w * 0.5, h * 0.22, { h: 24 });
 drawLabel(ctx, "Antibiotics fail on viruses - they are not living cells", w * 0.5, h * 0.86, { h: 24 });
 } else {
 // Robot vacuum - clearly a machine
 const cx = w * 0.5;
 const cy = h * 0.5;
 // floor
 ctx.fillStyle = "#44403c";
 ctx.fillRect(w * 0.1, h * 0.55, w * 0.8, h * 0.25);
 ctx.fillStyle = "#57534e";
 for (let i = 0; i < 6; i++) ctx.fillRect(w * 0.12 + i * w * 0.12, h * 0.55, 2, h * 0.25);
 // disc body
 const body = ctx.createRadialGradient(cx - 8, cy - 8, 4, cx, cy, 48);
 body.addColorStop(0, "#e2e8f0");
 body.addColorStop(1, "#64748b");
 ctx.fillStyle = body;
 ctx.beginPath();
 ctx.arc(cx, cy, 48, 0, Math.PI * 2);
 ctx.fill();
 // bumper
 ctx.strokeStyle = "#0f172a";
 ctx.lineWidth = 6;
 ctx.beginPath();
 ctx.arc(cx, cy, 48, Math.PI * 0.15, Math.PI * 0.85);
 ctx.stroke();
 // sensor eye
 ctx.fillStyle = "#38bdf8";
 ctx.beginPath();
 ctx.arc(cx, cy - 10, 8, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#0ea5e9";
 ctx.beginPath();
 ctx.arc(cx, cy - 10, 3, 0, Math.PI * 2);
 ctx.fill();
 // button
 ctx.fillStyle = "#22c55e";
 ctx.beginPath();
 ctx.arc(cx, cy + 14, 6, 0, Math.PI * 2);
 ctx.fill();
 // wheels hint
 ctx.fillStyle = "#1c1917";
 ctx.beginPath();
 ctx.ellipse(cx - 28, cy + 36, 10, 5, 0, 0, Math.PI * 2);
 ctx.ellipse(cx + 28, cy + 36, 10, 5, 0, 0, Math.PI * 2);
 ctx.fill();
 // motion dashes
 ctx.strokeStyle = "rgba(226,232,240,0.5)";
 ctx.lineWidth = 2;
 for (let k = 0; k < 3; k++) {
 const ox = cx - 70 - k * 14 - ((t * 40) % 20);
 ctx.beginPath();
 ctx.moveTo(ox, cy);
 ctx.lineTo(ox + 10, cy);
 ctx.stroke();
 }
 drawLabel(ctx, "3 · Robot vacuum", w * 0.5, h * 0.2, { h: 24 });
 drawLabel(ctx, "Moves and senses - still a machine, not alive", w * 0.5, h * 0.86, { h: 24 });
 }
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("lifeClose", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 const start = performance.now();
 setDescription("The investigation, solved.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 bioLabState.lifeCloseU = Math.min(1, t / 3);
 fillLab(ctx, w, h);
 const items = [
 { draw: (c, x, y) => iconFlame(c, x, y, 1.2, { fuel: 0.3, flicker: 1 }), stamp: "✕", x: 0.18 },
 { draw: iconCrystal, stamp: "✕", x: 0.4 },
 { draw: iconVirus, stamp: "border", x: 0.6 },
 { draw: iconCat, stamp: "✓", x: 0.82 },
 ];
 items.forEach((it, i) => {
 if (t < 0.4 + i * 0.55) return;
 it.draw(ctx, w * it.x, h * 0.48, 1.2);
 const stamp = it.stamp === "border" ? "on the border" : it.stamp;
 drawLabel(ctx, stamp, w * it.x, h * 0.68, { h: 24 });
 });
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("lifeSpiral", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const stops = [
 { id: 1, label: "1 Gut", caption: "Spiral 1: living things grow, respond, reproduce" },
 { id: 2, label: "2 MRS", caption: "Spiral 2: MRS GREN, the official checklist" },
 { id: 3, label: "3 Tricky", caption: "Spiral 3: fire, crystals, viruses, dormant seeds" },
 { id: 4, label: "4 Stakes", caption: "Spiral 4: Mars, medicine, and machines" },
 ];
 setDescription("Recap map of the four Living or Not spirals.");
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
 if (stop === 1) iconTree(ctx, origin.cx, origin.cy, 1, 0.7, 0.5);
 if (stop === 2) {
 ctx.fillStyle = "#86efac";
 ctx.font = "800 13px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("MRS", origin.cx, origin.cy + 4);
 }
 if (stop === 3) iconVirus(ctx, origin.cx, origin.cy, 0.85);
 if (stop === 4) iconFlame(ctx, origin.cx, origin.cy, 0.7, { fuel: 0.3, flicker: 1 });
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
 if (cap) drawLabel(ctx, cap.caption, w * 0.5, 28, { font: "600 12px Segoe UI, sans-serif", h: 28 });
 }
 const fx = w * 0.5;
 const fy = h - 34;
 const fw = Math.min(280, w * 0.76);
 roundRect(ctx, fx - fw / 2, fy - 22, fw, 44, 12);
 ctx.fillStyle = "#16a34a";
 ctx.fill();
 ctx.fillStyle = "#ecfdf5";
 ctx.font = "800 16px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.fillText("Finish Living or Not", fx, fy);
 hits.push({ id: "spiral-finish", shape: "rect", x: fx, y: fy, w: fw, h: 44, meta: { action: "spiralFinish" } });
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 if (typeof arena.registerAlias === "function") {
 arena.registerAlias("lifeMeet", "lifeOpen");
 arena.registerAlias("lifeSprout", "lifeCompare");
 arena.registerAlias("lifeRule", "lifeMrs");
 arena.registerAlias("lifeStretch", "lifeMars");
 arena.registerAlias("lifeMyth", "lifeScore");
 arena.registerAlias("lifeDrill", "lifeStakes");
 arena.registerAlias("lifeMastery", "lifeSpiral");
 }
}
