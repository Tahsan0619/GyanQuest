/**
 * Bio Explorer Mission 2: Cell City
 * Script: Opening + 4 Bruner spirals (cities of cells → animal workers → plant upgrades → cooperation) + recap.
 * Canvas 2D. No physics engine. Rect hits are center-origin.
 */
import {
 bioLabState,
 pulseFailFeedback,
 pulseSuccessFeedback,
 CELL_ORGANELLES,
 CELL_PLANT_ADDONS,
 CELL_LINE,
 CELL_THEORY,
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

function fillNightCity(ctx, w, h, t) {
 const g = ctx.createLinearGradient(0, 0, 0, h);
 g.addColorStop(0, "#0b1224");
 g.addColorStop(0.55, "#111827");
 g.addColorStop(1, "#020617");
 ctx.fillStyle = g;
 ctx.fillRect(0, 0, w, h);
 ctx.fillStyle = "#1e293b";
 ctx.fillRect(0, h * 0.62, w, h * 0.38);
 const pan = (t * 12) % 40;
 for (let i = 0; i < 18; i++) {
 const bx = ((i * 47 + pan) % (w + 40)) - 20;
 const bh = 28 + (i % 5) * 18;
 const by = h * 0.62 - bh;
 ctx.fillStyle = "#1f2937";
 ctx.fillRect(bx, by, 28, bh);
 for (let wy = by + 6; wy < by + bh - 4; wy += 8) {
 ctx.fillStyle = (i + wy) % 3 === 0 ? "#fbbf24" : "#334155";
 ctx.fillRect(bx + 4, wy, 6, 4);
 ctx.fillRect(bx + 16, wy, 6, 4);
 }
 }
 ctx.strokeStyle = "rgba(251,191,36,0.25)";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.moveTo(0, h * 0.72);
 ctx.lineTo(w, h * 0.68);
 ctx.stroke();
}

function drawTissueGrid(ctx, w, h, t, boxy) {
 // Animated "rack" of cells - cell theory: living things are made of cells
 const cols = 10;
 const rows = 7;
 const gap = 4;
 const cellW = (w - gap * (cols + 1)) / cols;
 const cellH = (h - 50 - gap * (rows + 1)) / rows;
 const pulse = (Math.sin(t * 2) + 1) * 0.5;
 for (let row = 0; row < rows; row++) {
 for (let col = 0; col < cols; col++) {
 const x = gap + col * (cellW + gap);
 const y = 36 + gap + row * (cellH + gap);
 const birth = ((row * cols + col) * 0.08);
 const grow = Math.max(0, Math.min(1, (t * 0.55 - birth)));
 if (grow <= 0.02) continue;
 const s = 0.35 + grow * 0.65;
 const cx = x + cellW / 2;
 const cy = y + cellH / 2;
 ctx.save();
 ctx.translate(cx, cy);
 ctx.scale(s, s);
 ctx.translate(-cx, -cy);
 if (boxy) {
 const g = ctx.createLinearGradient(x, y, x + cellW, y + cellH);
 g.addColorStop(0, "#86efac");
 g.addColorStop(1, "#166534");
 ctx.fillStyle = g;
 roundRect(ctx, x, y, cellW - 1, cellH - 1, 3);
 ctx.fill();
 ctx.strokeStyle = "rgba(20,83,45,0.65)";
 ctx.lineWidth = 1.5;
 ctx.stroke();
 // cell wall thickness
 ctx.strokeStyle = "rgba(163,230,53,0.55)";
 ctx.lineWidth = 2.5;
 roundRect(ctx, x + 2, y + 2, cellW - 5, cellH - 5, 2);
 ctx.stroke();
 } else {
 const g = ctx.createRadialGradient(cx - 3, cy - 3, 2, cx, cy, cellW * 0.45);
 g.addColorStop(0, `hsla(${145 + pulse * 8}, 70%, 58%, 0.85)`);
 g.addColorStop(1, "hsla(150, 55%, 28%, 0.9)");
 ctx.fillStyle = g;
 ctx.beginPath();
 ctx.ellipse(cx, cy, cellW * 0.42, cellH * 0.4, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "rgba(236,253,245,0.35)";
 ctx.lineWidth = 1.2;
 ctx.stroke();
 }
 // nucleus
 ctx.fillStyle = "#7c3aed";
 ctx.beginPath();
 ctx.arc(cx + (boxy ? 2 : 1), cy, Math.min(cellW, cellH) * 0.14, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#c4b5fd";
 ctx.beginPath();
 ctx.arc(cx + (boxy ? 2 : 1), cy, Math.min(cellW, cellH) * 0.06, 0, Math.PI * 2);
 ctx.fill();
 ctx.restore();
 }
 }
 drawLabel(ctx, "Cell theory live: cells pack into a living tissue rack", w * 0.5, 18, {
 font: "600 11px Segoe UI",
 h: 22,
 });
}

function drawHand(ctx, w, h, level) {
 const cx = w * 0.5;
 const cy = h * 0.55;
 // Realistic peach / tan skin (palm close-up under soft light)
 const skin = ctx.createRadialGradient(cx - 18, cy - 14, 8, cx, cy, 100);
 skin.addColorStop(0, "#f6d5c2");
 skin.addColorStop(0.4, "#e8b4a0");
 skin.addColorStop(0.75, "#c6866e");
 skin.addColorStop(1, "#8d5524");
 ctx.fillStyle = skin;
 ctx.beginPath();
 ctx.ellipse(cx, cy + 22, 80, 56, 0, 0, Math.PI * 2);
 ctx.fill();
 // soft highlight
 const hl = ctx.createRadialGradient(cx - 24, cy - 6, 4, cx - 10, cy + 10, 50);
 hl.addColorStop(0, "rgba(255,245,238,0.45)");
 hl.addColorStop(1, "rgba(255,245,238,0)");
 ctx.fillStyle = hl;
 ctx.beginPath();
 ctx.ellipse(cx - 10, cy + 8, 40, 28, 0, 0, Math.PI * 2);
 ctx.fill();
 // fingers
 for (let i = 0; i < 4; i++) {
 const fx = cx - 42 + i * 28;
 const fg = ctx.createLinearGradient(fx, cy - 72, fx, cy);
 fg.addColorStop(0, "#f3d0bd");
 fg.addColorStop(0.55, "#d4a574");
 fg.addColorStop(1, "#b07856");
 ctx.fillStyle = fg;
 ctx.beginPath();
 ctx.ellipse(fx, cy - 38, 11, 33, 0, 0, Math.PI * 2);
 ctx.fill();
 // nail bed
 ctx.fillStyle = "#f8e0d4";
 ctx.beginPath();
 ctx.ellipse(fx, cy - 62, 6, 4, 0, 0, Math.PI * 2);
 ctx.fill();
 // knuckle crease
 ctx.strokeStyle = "rgba(109,60,40,0.4)";
 ctx.lineWidth = 1.2;
 ctx.beginPath();
 ctx.arc(fx, cy - 18, 8, 0.2, Math.PI - 0.2);
 ctx.stroke();
 }
 // thumb
 const tg = ctx.createLinearGradient(cx - 85, cy, cx - 55, cy + 20);
 tg.addColorStop(0, "#e8b4a0");
 tg.addColorStop(1, "#a86b4f");
 ctx.fillStyle = tg;
 ctx.beginPath();
 ctx.ellipse(cx - 70, cy + 8, 14, 28, -0.7, 0, Math.PI * 2);
 ctx.fill();
 // palm print lines
 ctx.strokeStyle = "rgba(109,60,40,0.38)";
 ctx.lineWidth = 1.35;
 for (let i = 0; i < 5; i++) {
 ctx.beginPath();
 ctx.moveTo(cx - 55, cy - 4 + i * 10);
 ctx.quadraticCurveTo(cx, cy + 6 + i * 6, cx + 58, cy - 2 + i * 9);
 ctx.stroke();
 }
 // pores / texture flecks
 ctx.fillStyle = "rgba(109,60,40,0.12)";
 for (let i = 0; i < 40; i++) {
 const px = cx - 50 + (i * 17) % 100;
 const py = cy - 10 + ((i * 29) % 60);
 ctx.beginPath();
 ctx.arc(px, py, 0.8, 0, Math.PI * 2);
 ctx.fill();
 }
 if (level >= 1) {
 drawLabel(ctx, "Skin surface - living tissue", cx, h * 0.12, { h: 22 });
 }
 if (level >= 2) {
 ctx.strokeStyle = "rgba(22,163,74,0.8)";
 ctx.lineWidth = 1.2;
 for (let r = 0; r < 5; r++) {
 for (let c = 0; c < 7; c++) {
 const x = cx - 56 + c * 16;
 const y = cy - 18 + r * 14;
 ctx.beginPath();
 ctx.ellipse(x + 7, y + 6, 7, 5.5, 0, 0, Math.PI * 2);
 ctx.stroke();
 }
 }
 drawLabel(ctx, "Zoom: skin cells packed side by side", cx, h * 0.18, { h: 22 });
 }
 if (level >= 3) {
 for (let r = 0; r < 5; r++) {
 for (let c = 0; c < 7; c++) {
 const x = cx - 49 + c * 16;
 const y = cy - 12 + r * 14;
 const cg = ctx.createRadialGradient(x - 2, y - 2, 1, x, y, 8);
 cg.addColorStop(0, "rgba(134,239,172,0.85)");
 cg.addColorStop(1, "rgba(22,101,52,0.75)");
 ctx.fillStyle = cg;
 ctx.beginPath();
 ctx.ellipse(x, y, 7, 5.5, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#5b21b6";
 ctx.beginPath();
 ctx.arc(x, y, 2.2, 0, Math.PI * 2);
 ctx.fill();
 }
 }
 drawLabel(ctx, "Each unit is one living cell with a nucleus", cx, h * 0.24, { h: 22 });
 }
}

function drawLeaf(ctx, w, h, level) {
 const cx = w * 0.5;
 const cy = h * 0.5;
 const leaf = ctx.createRadialGradient(cx - 20, cy - 10, 8, cx, cy, 100);
 leaf.addColorStop(0, "#86efac");
 leaf.addColorStop(0.5, "#22c55e");
 leaf.addColorStop(1, "#14532d");
 ctx.fillStyle = leaf;
 ctx.beginPath();
 ctx.ellipse(cx, cy, 95, 52, -0.35, 0, Math.PI * 2);
 ctx.fill();
 // midrib + veins
 ctx.strokeStyle = "#14532d";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.moveTo(cx - 72, cy + 20);
 ctx.quadraticCurveTo(cx, cy, cx + 78, cy - 24);
 ctx.stroke();
 ctx.lineWidth = 1.2;
 for (let i = -3; i <= 3; i++) {
 if (!i) continue;
 ctx.beginPath();
 ctx.moveTo(cx + i * 8, cy + i * 2);
 ctx.quadraticCurveTo(cx + i * 22, cy + i * 10, cx + i * 28, cy + i * 18);
 ctx.stroke();
 }
 if (level >= 2) {
 ctx.strokeStyle = "rgba(236,253,245,0.55)";
 for (let r = 0; r < 4; r++) {
 for (let c = 0; c < 8; c++) {
 roundRect(ctx, cx - 64 + c * 16, cy - 24 + r * 14, 14, 12, 2);
 ctx.stroke();
 }
 }
 drawLabel(ctx, "Leaf cells in a green tissue layer", cx, 28, { h: 22 });
 }
 if (level >= 3) {
 for (let r = 0; r < 4; r++) {
 for (let c = 0; c < 8; c++) {
 const x = cx - 57 + c * 16;
 const y = cy - 18 + r * 14;
 ctx.fillStyle = "#4ade80";
 roundRect(ctx, x - 7, y - 6, 14, 12, 2);
 ctx.fill();
 ctx.fillStyle = "#166534";
 ctx.beginPath();
 ctx.ellipse(x - 2, y, 3, 2, 0.3, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#14532d";
 ctx.beginPath();
 ctx.arc(x + 3, y, 2, 0, Math.PI * 2);
 ctx.fill();
 }
 }
 drawLabel(ctx, "Plant cells: wall + chloroplasts + nucleus", cx, 54, { h: 22 });
 }
}

function cityZones(w, h, plant) {
 const cx = w * 0.5;
 const cy = h * 0.46;
 const z = {
 nucleus: { x: cx, y: cy - 8, r: 30 },
 mito: { x: cx - Math.min(110, w * 0.22), y: cy + 30, r: 24 },
 ribo: { x: cx + Math.min(100, w * 0.2), y: cy - 38, r: 22 },
 er: { x: cx + 18, y: cy + 46, r: 24 },
 golgi: { x: cx + Math.min(118, w * 0.24), y: cy + 16, r: 24 },
 membrane: { x: cx, y: cy + Math.min(h * 0.28, 96), r: 26 },
 };
 if (plant) {
 z.wall = { x: cx, y: cy + Math.min(h * 0.34, 114), r: 24 };
 z.chloro = { x: cx - Math.min(80, w * 0.16), y: cy - 50, r: 22 };
 z.vacuole = { x: cx - 6, y: cy + 10, r: 32 };
 }
 return z;
}

function drawOrganelleNucleus(ctx, x, y, diagram) {
 if (!diagram) {
 // city hall dome metaphor still readable, but richer
 const g = ctx.createRadialGradient(x - 6, y - 8, 2, x, y, 28);
 g.addColorStop(0, "#ddd6fe");
 g.addColorStop(0.55, "#7c3aed");
 g.addColorStop(1, "#4c1d95");
 ctx.fillStyle = g;
 ctx.beginPath();
 ctx.ellipse(x, y + 4, 26, 20, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#c4b5fd";
 ctx.beginPath();
 ctx.arc(x, y - 12, 16, Math.PI, 0);
 ctx.fill();
 ctx.fillStyle = "#5b21b6";
 ctx.beginPath();
 ctx.arc(x, y + 2, 6, 0, Math.PI * 2);
 ctx.fill();
 return;
 }
 // Biology diagram nucleus
 const g = ctx.createRadialGradient(x - 5, y - 5, 2, x, y, 22);
 g.addColorStop(0, "#e9d5ff");
 g.addColorStop(0.5, "#a78bfa");
 g.addColorStop(1, "#6d28d9");
 ctx.fillStyle = g;
 ctx.beginPath();
 ctx.arc(x, y, 20, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "rgba(255,255,255,0.45)";
 ctx.lineWidth = 2;
 ctx.stroke();
 // nucleolus
 ctx.fillStyle = "#4c1d95";
 ctx.beginPath();
 ctx.arc(x + 4, y - 2, 6, 0, Math.PI * 2);
 ctx.fill();
 // chromatin flecks
 ctx.fillStyle = "rgba(237,233,254,0.7)";
 for (let i = 0; i < 5; i++) {
 ctx.beginPath();
 ctx.ellipse(x - 8 + i * 4, y + 6 - (i % 2) * 4, 2.5, 1.4, 0.4, 0, Math.PI * 2);
 ctx.fill();
 }
}

function drawOrganelleMito(ctx, x, y) {
 ctx.save();
 ctx.translate(x, y);
 ctx.rotate(0.35);
 const outer = ctx.createLinearGradient(-18, 0, 18, 0);
 outer.addColorStop(0, "#fb923c");
 outer.addColorStop(0.5, "#ea580c");
 outer.addColorStop(1, "#c2410c");
 ctx.fillStyle = outer;
 ctx.beginPath();
 ctx.ellipse(0, 0, 18, 10, 0, 0, Math.PI * 2);
 ctx.fill();
 // cristae folds
 ctx.strokeStyle = "#fdba74";
 ctx.lineWidth = 1.4;
 for (let i = -2; i <= 2; i++) {
 ctx.beginPath();
 ctx.moveTo(-10, i * 3);
 ctx.quadraticCurveTo(-2, i * 3 - 4, 4, i * 3);
 ctx.quadraticCurveTo(10, i * 3 + 3, 12, i * 3);
 ctx.stroke();
 }
 ctx.restore();
}

function drawOrganelleRibo(ctx, x, y) {
 for (let i = 0; i < 5; i++) {
 const px = x - 12 + (i % 3) * 12;
 const py = y + Math.floor(i / 3) * 12 - 4;
 const g = ctx.createRadialGradient(px - 1, py - 1, 0.5, px, py, 5);
 g.addColorStop(0, "#e2e8f0");
 g.addColorStop(1, "#64748b");
 ctx.fillStyle = g;
 ctx.beginPath();
 ctx.arc(px, py, 5, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#334155";
 ctx.beginPath();
 ctx.arc(px + 1, py + 1, 2.2, 0, Math.PI * 2);
 ctx.fill();
 }
}

function drawOrganelleER(ctx, fromX, fromY, toX, toY) {
 ctx.strokeStyle = "#38bdf8";
 ctx.lineWidth = 3;
 ctx.lineCap = "round";
 // folded membrane sheets
 for (let i = 0; i < 3; i++) {
 ctx.beginPath();
 ctx.moveTo(fromX + 16, fromY + i * 5);
 ctx.bezierCurveTo(fromX + 50, fromY + 20 + i * 4, toX + 30, toY - 20 + i * 4, toX, toY + i * 4);
 ctx.stroke();
 }
 // ribosomes on rough ER
 ctx.fillStyle = "#94a3b8";
 for (let i = 0; i < 6; i++) {
 const u = i / 5;
 const px = fromX + 20 + u * (toX - fromX - 10);
 const py = fromY + 8 + u * (toY - fromY) + Math.sin(u * 6) * 8;
 ctx.beginPath();
 ctx.arc(px, py, 2.5, 0, Math.PI * 2);
 ctx.fill();
 }
}

function drawOrganelleGolgi(ctx, x, y) {
 for (let i = 0; i < 4; i++) {
 const ww = 38 - i * 4;
 const g = ctx.createLinearGradient(x - ww / 2, 0, x + ww / 2, 0);
 g.addColorStop(0, "#fef08a");
 g.addColorStop(0.5, "#facc15");
 g.addColorStop(1, "#ca8a04");
 ctx.fillStyle = g;
 roundRect(ctx, x - ww / 2, y - 16 + i * 10, ww, 8, 3);
 ctx.fill();
 ctx.strokeStyle = "rgba(113,63,18,0.35)";
 ctx.stroke();
 }
 // vesicles budding
 ctx.fillStyle = "#fde68a";
 ctx.beginPath();
 ctx.arc(x + 24, y + 18, 4, 0, Math.PI * 2);
 ctx.arc(x + 30, y + 8, 3, 0, Math.PI * 2);
 ctx.fill();
}

function drawOrganelleChloro(ctx, x, y) {
 ctx.save();
 ctx.translate(x, y);
 ctx.rotate(0.2);
 const g = ctx.createLinearGradient(-16, 0, 16, 0);
 g.addColorStop(0, "#86efac");
 g.addColorStop(0.5, "#22c55e");
 g.addColorStop(1, "#166534");
 ctx.fillStyle = g;
 ctx.beginPath();
 ctx.ellipse(0, 0, 16, 9, 0, 0, Math.PI * 2);
 ctx.fill();
 // thylakoid stacks
 ctx.strokeStyle = "#14532d";
 ctx.lineWidth = 1.2;
 for (let i = -2; i <= 2; i++) {
 ctx.beginPath();
 ctx.ellipse(i * 3, 0, 3, 5, 0, 0, Math.PI * 2);
 ctx.stroke();
 }
 ctx.restore();
}

function drawCityMap(ctx, w, h, opts = {}) {
 const plant = !!opts.plant;
 const morph = opts.morph || 0;
 const lit = opts.lit || null;
 const firm = plant && (opts.firm || bioLabState.cellPlantDone);
 const cx = w * 0.5;
 const cy = h * 0.46;
 const z = cityZones(w, h, plant);
 const rx = Math.min(w * 0.38, 170) + (firm ? 6 : 0);
 const ry = Math.min(h * 0.32, 110) + (firm ? 8 : 0);
 const diagram = morph >= 0.55;

 ctx.save();
 // cytoplasm fill
 if (firm) {
 roundRect(ctx, cx - rx, cy - ry, rx * 2, ry * 2, 10);
 } else {
 ctx.beginPath();
 ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
 }
 const cyto = ctx.createRadialGradient(cx - 20, cy - 20, 10, cx, cy, rx);
 cyto.addColorStop(0, "rgba(167,243,208,0.35)");
 cyto.addColorStop(1, "rgba(6,78,59,0.35)");
 ctx.fillStyle = cyto;
 ctx.fill();
 ctx.strokeStyle = lit === "membrane" ? "#fbbf24" : "#86efac";
 ctx.lineWidth = 4;
 ctx.stroke();
 // membrane bilayer hint
 ctx.strokeStyle = "rgba(52,211,153,0.45)";
 ctx.lineWidth = 1.5;
 if (firm) {
 roundRect(ctx, cx - rx + 4, cy - ry + 4, rx * 2 - 8, ry * 2 - 8, 8);
 ctx.stroke();
 } else {
 ctx.beginPath();
 ctx.ellipse(cx, cy, rx - 4, ry - 4, 0, 0, Math.PI * 2);
 ctx.stroke();
 }

 if (plant && (bioLabState.cellPlant.wall || opts.showPlant)) {
 ctx.strokeStyle = "#a3e635";
 ctx.lineWidth = 10;
 if (firm) {
 roundRect(ctx, cx - rx - 10, cy - ry - 10, rx * 2 + 20, ry * 2 + 20, 8);
 ctx.stroke();
 } else {
 ctx.beginPath();
 ctx.ellipse(cx, cy, rx + 12, ry + 12, 0, 0, Math.PI * 2);
 ctx.stroke();
 }
 drawLabel(ctx, "Cell wall: rigid support + protection", z.wall.x, z.wall.y + 36, {
 h: 20,
 font: "600 10px Segoe UI",
 });
 }

 if (plant && (bioLabState.cellPlant.vacuole || opts.showPlant)) {
 const vg = ctx.createRadialGradient(z.vacuole.x - 8, z.vacuole.y - 6, 4, z.vacuole.x, z.vacuole.y, 38);
 vg.addColorStop(0, "rgba(125,211,252,0.7)");
 vg.addColorStop(1, "rgba(2,132,199,0.55)");
 ctx.fillStyle = vg;
 ctx.beginPath();
 ctx.ellipse(z.vacuole.x, z.vacuole.y, 38, 30, 0, 0, Math.PI * 2);
 ctx.fill();
 drawLabel(ctx, "Vacuole: stores water, keeps cell firm", z.vacuole.x, z.vacuole.y + 42, {
 h: 20,
 font: "600 10px Segoe UI",
 });
 }

 drawOrganelleNucleus(ctx, z.nucleus.x, z.nucleus.y, diagram);
 drawOrganelleMito(ctx, z.mito.x, z.mito.y);
 drawOrganelleMito(ctx, z.mito.x + 22, z.mito.y + 18);
 drawOrganelleRibo(ctx, z.ribo.x, z.ribo.y);
 drawOrganelleER(ctx, z.nucleus.x, z.nucleus.y, z.er.x, z.er.y);
 drawOrganelleGolgi(ctx, z.golgi.x, z.golgi.y);

 if (plant && (bioLabState.cellPlant.chloro || opts.showPlant)) {
 drawOrganelleChloro(ctx, z.chloro.x, z.chloro.y);
 drawOrganelleChloro(ctx, z.chloro.x + 22, z.chloro.y + 14);
 drawLabel(ctx, "Chloroplast: sunlight → food", z.chloro.x, z.chloro.y - 22, {
 h: 20,
 font: "600 10px Segoe UI",
 });
 }

 // Always show small zone name tags so jobs stay readable
 const nameTags = {
 nucleus: "Nucleus",
 mito: "Mitochondria",
 ribo: "Ribosomes",
 er: "ER",
 golgi: "Golgi",
 membrane: "Membrane",
 wall: "Cell wall",
 chloro: "Chloroplast",
 vacuole: "Vacuole",
 };
 Object.keys(z).forEach((id) => {
 if (!nameTags[id]) return;
 if (plant && (id === "wall" || id === "chloro" || id === "vacuole")) {
 if (!(bioLabState.cellPlant[id] || opts.showPlant)) return;
 }
 const zz = z[id];
 ctx.font = "700 9px Segoe UI";
 ctx.fillStyle = lit === id ? "#fde047" : "rgba(236,253,245,0.85)";
 ctx.textAlign = "center";
 ctx.fillText(nameTags[id], zz.x, zz.y + zz.r + 12);
 });

 const jobTips = {
 nucleus: "Nucleus: DNA control center - directs the cell",
 mito: "Mitochondria: release energy (ATP) from food",
 ribo: "Ribosomes: build proteins from DNA instructions",
 er: "ER: folded highways that transport materials",
 golgi: "Golgi: packages and ships proteins",
 membrane: "Membrane: flexible gatekeeper - what goes in/out",
 wall: "Cell wall: rigid outer support + protection (plants)",
 chloro: "Chloroplasts: sunlight into food (photosynthesis)",
 vacuole: "Vacuole: stores water, keeps plant cell firm",
 };
 if (lit && z[lit]) {
 ctx.strokeStyle = "#facc15";
 ctx.lineWidth = 2.5;
 ctx.beginPath();
 ctx.arc(z[lit].x, z[lit].y, z[lit].r + 6, 0, Math.PI * 2);
 ctx.stroke();
 if (jobTips[lit]) {
 drawLabel(ctx, jobTips[lit], w * 0.5, 24, { h: 24, font: "600 12px Segoe UI" });
 }
 }
 ctx.restore();
 return z;
}

function visitTour(id) {
 const item = CELL_ORGANELLES.find((o) => o.id === id);
 if (!item) return;
 bioLabState.cellTourStop = id;
 bioLabState.cellTour = { ...bioLabState.cellTour, [id]: true };
 pulseSuccessFeedback(180);
 if (CELL_ORGANELLES.every((o) => bioLabState.cellTour[o.id])) {
 bioLabState.cellTourDone = true;
 pulseSuccessFeedback(280);
 }
}

function placePlant(id, zone) {
 const item = CELL_PLANT_ADDONS.find((p) => p.id === id);
 if (!item) return;
 if (item.drop !== zone) {
 pulseFailFeedback(260);
 bioLabState.prompt = "That add-on belongs on a different part of the city.";
 return;
 }
 bioLabState.prompt = "";
 bioLabState.cellPlant = { ...bioLabState.cellPlant, [id]: true };
 bioLabState.cellPlantPick = null;
 pulseSuccessFeedback(200);
 if (CELL_PLANT_ADDONS.every((p) => bioLabState.cellPlant[p.id])) {
 bioLabState.cellPlantDone = true;
 pulseSuccessFeedback(320);
 }
}

function sendLine(toId) {
 const step = CELL_LINE[bioLabState.cellLineStep || 0];
 if (!step) return;
 if (toId !== step.to) {
 pulseFailFeedback(240);
 bioLabState.prompt = "That department isn't ready for this yet.";
 return;
 }
 bioLabState.cellLineStep = (bioLabState.cellLineStep || 0) + 1;
 bioLabState.prompt = step.caption;
 pulseSuccessFeedback(200);
 if (bioLabState.cellLineStep >= CELL_LINE.length) {
 bioLabState.cellLineDone = true;
 pulseSuccessFeedback(320);
 }
}

export function registerCellScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("cellOpen", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const start = performance.now();
 setDescription("A city at night. Then the same busy pattern under a microscope.");
 setIntentHandler((intent) => {
 if (intent.type !== "CANVAS_TAP") return;
 if (intent.meta?.action === "enter") {
 bioLabState.cellSeen = true;
 pulseSuccessFeedback(200);
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 bioLabState.cellOpenU = Math.min(1, t / 1.6);
 const u = bioLabState.cellOpenU;
 fillNightCity(ctx, w, h, t);
 ctx.globalAlpha = Math.max(0, (u - 0.28) / 0.72);
 drawTissueGrid(ctx, w, h, t, false);
 ctx.globalAlpha = 1;
 drawLabel(
 ctx,
 u < 0.35 ? "A city at night. Countless small units, each doing a job." : "Living tissue. The same busy, lit-up pattern.",
 w * 0.5,
 26,
 { font: "600 12px Segoe UI, sans-serif", h: 28, maxW: w * 0.92 },
 );
 const ready = u >= 0.4 || bioLabState.cellSeen;
 drawCanvasBtn(ctx, w * 0.5, h - 36, 200, 40, "Enter the City", ready);
 setHitRegions([{ id: "enter", shape: "rect", x: w * 0.5, y: h - 36, w: 210, h: 44, meta: { action: "enter" } }]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("cellZoom", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 setDescription("The Zoom Tool. Skin, then packed cells.");
 setIntentHandler((intent) => {
 if (intent.type !== "CANVAS_TAP") return;
 if (intent.meta?.action === "zoom") {
 if (bioLabState.cellView === "leaf") {
 bioLabState.cellLeafClick = Math.min(3, (bioLabState.cellLeafClick || 0) + 1);
 } else {
 bioLabState.cellZoomClick = Math.min(3, (bioLabState.cellZoomClick || 0) + 1);
 }
 pulseSuccessFeedback(160);
 }
 if (intent.meta?.action === "unzoom") {
 if (bioLabState.cellView === "leaf") bioLabState.cellLeafClick = Math.max(0, (bioLabState.cellLeafClick || 0) - 1);
 else bioLabState.cellZoomClick = Math.max(0, (bioLabState.cellZoomClick || 0) - 1);
 }
 if (intent.meta?.action === "leaf") bioLabState.cellView = "leaf";
 if (intent.meta?.action === "hand") bioLabState.cellView = "hand";
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 fillLab(ctx, w, h);
 const leaf = bioLabState.cellView === "leaf";
 const level = leaf ? bioLabState.cellLeafClick || 0 : bioLabState.cellZoomClick || 0;
 if (leaf) drawLeaf(ctx, w, h, level);
 else drawHand(ctx, w, h, level);
 const msgs = leaf
 ? [
 "A green leaf. Solid, until you zoom.",
 "Leaf surface texture.",
 "A packed grid starts to appear.",
 "Boxy plant cells, wall to wall.",
 ]
 : [
 "The back of a hand.",
 "Texture and fine lines.",
 "A honeycomb pattern starts to emerge.",
 "You are looking at a city of cells.",
 ];
 drawLabel(ctx, msgs[Math.min(3, level)], w * 0.5, 24, { font: "600 12px Segoe UI, sans-serif", h: 28, maxW: w * 0.92 });
 const hits = [
 { id: "plus", shape: "rect", x: w * 0.62, y: h - 36, w: 70, h: 40, meta: { action: "zoom" } },
 { id: "minus", shape: "rect", x: w * 0.38, y: h - 36, w: 70, h: 40, meta: { action: "unzoom" } },
 ];
 drawCanvasBtn(ctx, w * 0.38, h - 36, 64, 36, "−", false);
 drawCanvasBtn(ctx, w * 0.62, h - 36, 64, 36, "+", true);
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("cellGrid", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 const start = performance.now();
 setDescription("City block beside a single cell. Then cell theory.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 const phase = bioLabState.phase || "see";
 fillLab(ctx, w, h);
 if (phase === "theory") {
 // Animated tissue rack + three cell-theory rules
 drawTissueGrid(ctx, w, h * 0.58, t, false);
 ctx.fillStyle = "#86efac";
 ctx.font = "800 16px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("Cell theory", w * 0.5, h * 0.62);
 CELL_THEORY.forEach((line, i) => {
 const reveal = t > 0.6 + i * 0.55;
 if (!reveal) return;
 drawLabel(ctx, `${i + 1}. ${line}`, w * 0.5, h * 0.68 + i * 34, {
 font: "600 10px Segoe UI, sans-serif",
 h: 28,
 maxW: w * 0.94,
 });
 });
 } else {
 fillNightCity(ctx, w * 0.48, h, t);
 ctx.save();
 ctx.beginPath();
 ctx.rect(w * 0.5, 0, w * 0.5, h);
 ctx.clip();
 ctx.translate(w * 0.5, 0);
 drawTissueGrid(ctx, w * 0.5, h, t, false);
 ctx.restore();
 ctx.strokeStyle = "#86efac";
 ctx.beginPath();
 ctx.moveTo(w * 0.5, 16);
 ctx.lineTo(w * 0.5, h - 16);
 ctx.stroke();
 drawLabel(ctx, "City block", w * 0.25, 28, { h: 22 });
 drawLabel(ctx, "Living tissue rack", w * 0.75, 28, { h: 22 });
 drawLabel(ctx, "Both: a complete unit that works by cooperating", w * 0.5, h - 28, {
 font: "600 11px Segoe UI, sans-serif",
 h: 26,
 maxW: w * 0.94,
 });
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("cellTour", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 setDescription("Tour the city. Six workers, six jobs.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.dept) visitTour(intent.meta.dept);
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 fillLab(ctx, w, h);
 const lit = bioLabState.cellTourStop;
 const z = drawCityMap(ctx, w, h, { lit });
 const item = CELL_ORGANELLES.find((o) => o.id === lit);
 const msg = bioLabState.cellTourDone
 ? "A cell only works because all six jobs run at once."
 : item
 ? `${item.city}. ${item.name}.`
 : "Tap a zone. City Hall, Power Plants, Factories, Highway, Post Office, Wall.";
 drawLabel(ctx, msg, w * 0.5, 22, { font: "600 11px Segoe UI, sans-serif", h: 28, maxW: w * 0.94 });
 const hits = CELL_ORGANELLES.map((o) => ({
 id: o.id,
 shape: "ellipse",
 x: z[o.id].x,
 y: z[o.id].y,
 r: z[o.id].r,
 meta: { dept: o.id },
 }));
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("cellMorph", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 const start = performance.now();
 setDescription("City map into a real diagram, then the formal names.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 const phase = bioLabState.phase || "morph";
 fillLab(ctx, w, h);
 if (phase === "card") {
 ctx.fillStyle = "#86efac";
 ctx.font = "800 16px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("Organelle: little organ", w * 0.5, 32);
 CELL_ORGANELLES.forEach((o, i) => {
 drawLabel(ctx, `${o.name}: ${o.def}`, w * 0.5, 70 + i * 36, {
 font: "600 10px Segoe UI, sans-serif",
 h: 30,
 maxW: w * 0.94,
 });
 });
 } else {
 const morph = 0.5 + 0.5 * Math.sin(t * 0.9);
 drawCityMap(ctx, w, h, { morph, lit: CELL_ORGANELLES[Math.floor(t / 1.6) % 6].id });
 const pairs = [
 "City Hall ↔ Nucleus",
 "Power Plant ↔ Mitochondria",
 "Factory ↔ Ribosome",
 "Highway ↔ Endoplasmic Reticulum",
 "Post Office ↔ Golgi Apparatus",
 "City Wall ↔ Cell Membrane",
 ];
 drawLabel(ctx, pairs[Math.floor(t / 1.6) % 6], w * 0.5, 24, { h: 26, maxW: w * 0.94 });
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("cellPlant", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 setDescription("Upgrade the city. Wall, solar panels, water tower.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.addon) bioLabState.cellPlantPick = intent.meta.addon;
 if (intent.type === "CANVAS_TAP" && intent.meta?.drop && bioLabState.cellPlantPick) {
 placePlant(bioLabState.cellPlantPick, intent.meta.drop);
 }
 if (intent.type === "CANVAS_UP" && intent.meta?.addon && intent.dropMeta?.drop) {
 placePlant(intent.meta.addon, intent.dropMeta.drop);
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 fillLab(ctx, w, h);
 const z = drawCityMap(ctx, w, h, { plant: true, showPlant: false, firm: bioLabState.cellPlantDone });
 const msg = bioLabState.cellPlantDone
 ? "Same core team. Three new specialists. The city firms up."
 : bioLabState.prompt || "Drag each new resident onto the city.";
 drawLabel(ctx, msg, w * 0.5, 22, { font: "600 11px Segoe UI, sans-serif", h: 26, maxW: w * 0.94 });
 const hits = [
 { id: "drop-wall", shape: "ellipse", x: z.wall.x, y: z.wall.y, r: z.wall.r, meta: { drop: "wall" } },
 { id: "drop-chloro", shape: "ellipse", x: z.chloro.x, y: z.chloro.y, r: z.chloro.r, meta: { drop: "chloro" } },
 { id: "drop-vac", shape: "ellipse", x: z.vacuole.x, y: z.vacuole.y, r: z.vacuole.r, meta: { drop: "vacuole" } },
 ];
 const unused = CELL_PLANT_ADDONS.filter((p) => !bioLabState.cellPlant[p.id]);
 unused.forEach((p, i) => {
 const x = w * (0.22 + i * 0.28);
 const y = h - 36;
 const sel = bioLabState.cellPlantPick === p.id;
 drawCanvasBtn(ctx, x, y, 150, 32, p.name, sel);
 hits.push({ id: `add-${p.id}`, shape: "rect", x, y, w: 154, h: 34, meta: { addon: p.id } });
 });
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("cellPair", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 setDescription("Animal cell beside plant cell. Same core team.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const phase = bioLabState.phase || "pair";
 fillLab(ctx, w, h);
 if (phase === "table") {
 const rows = [
 ["Shared team", "✓", "✓"],
 ["Cell wall", "✕", "✓"],
 ["Chloroplasts", "✕", "✓"],
 ["Large vacuole", "small only", "✓"],
 ];
 ctx.fillStyle = "#bbf7d0";
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("Animal", w * 0.5, 40);
 ctx.fillText("Plant", w * 0.78, 40);
 rows.forEach((r, i) => {
 const y = 78 + i * 36;
 ctx.textAlign = "left";
 ctx.fillStyle = "#dcfce7";
 ctx.fillText(r[0], w * 0.08, y);
 ctx.textAlign = "center";
 ctx.fillStyle = r[1] === "✓" ? "#4ade80" : "#f87171";
 ctx.fillText(r[1], w * 0.5, y);
 ctx.fillStyle = "#4ade80";
 ctx.fillText(r[2], w * 0.78, y);
 });
 } else {
 ctx.save();
 ctx.beginPath();
 ctx.rect(0, 0, w * 0.5, h);
 ctx.clip();
 drawCityMap(ctx, w * 0.92, h, { plant: false });
 ctx.restore();
 ctx.save();
 ctx.beginPath();
 ctx.rect(w * 0.5, 0, w * 0.5, h);
 ctx.clip();
 ctx.translate(w * 0.08, 0);
 drawCityMap(ctx, w * 0.92, h, { plant: true, showPlant: true, firm: true });
 ctx.restore();
 ctx.strokeStyle = "#86efac";
 ctx.beginPath();
 ctx.moveTo(w * 0.5, 12);
 ctx.lineTo(w * 0.5, h - 12);
 ctx.stroke();
 drawLabel(ctx, "Animal: soft membrane only", w * 0.25, 24, { h: 22 });
 drawLabel(ctx, "Plant: wall + chloro + vacuole", w * 0.75, 24, { h: 22 });
 drawLabel(ctx, "Same core team (nucleus, mito, ribo, ER, Golgi, membrane)", w * 0.5, h - 26, {
 h: 22,
 font: "600 10px Segoe UI",
 maxW: w * 0.94,
 });
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("cellLine", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 setDescription("Run the production line. Instructions, build, transport, package, ship.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.dept) sendLine(intent.meta.dept);
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 fillLab(ctx, w, h);
 const z = drawCityMap(ctx, w, h, {});
 const stepI = bioLabState.cellLineStep || 0;
 const at = stepI >= CELL_LINE.length ? "membrane" : CELL_LINE[stepI].from;
 const tok = z[at] || z.nucleus;
 ctx.fillStyle = "#facc15";
 ctx.beginPath();
 ctx.arc(tok.x, tok.y - 26, 8, 0, Math.PI * 2);
 ctx.fill();
 const msg = bioLabState.cellLineDone
 ? "You completed one full round of making and shipping a protein."
 : bioLabState.prompt || "Build Protein X. Send the order to the next department.";
 drawLabel(ctx, msg, w * 0.5, 22, { font: "600 11px Segoe UI, sans-serif", h: 28, maxW: w * 0.94 });
 const hits = CELL_ORGANELLES.map((o) => ({
 id: o.id,
 shape: "ellipse",
 x: z[o.id].x,
 y: z[o.id].y,
 r: z[o.id].r,
 meta: { dept: o.id },
 }));
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("cellScale", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 const start = performance.now();
 setDescription("Cell, tissue, organ, organism. Some cities stay independent.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 const phase = bioLabState.phase || "zoom";
 fillLab(ctx, w, h);
 if (phase === "card") {
 drawLabel(ctx, "Unicellular: one cell does every job (bacteria, amoeba)", w * 0.5, h * 0.32, {
 h: 30,
 maxW: w * 0.92,
 font: "600 12px Segoe UI, sans-serif",
 });
 drawLabel(ctx, "Multicellular: many cells work together (you, a tree, a mushroom)", w * 0.5, h * 0.5, {
 h: 30,
 maxW: w * 0.92,
 font: "600 12px Segoe UI, sans-serif",
 });
 drawLabel(ctx, "Next: what happens when City Hall's instructions get damaged?", w * 0.5, h * 0.7, {
 h: 30,
 maxW: w * 0.92,
 font: "600 12px Segoe UI, sans-serif",
 });
 } else {
 const shot = Math.min(3, Math.floor(t / 1.8));
 const labels = ["Cell", "Tissue", "Organ", "Organism"];
 if (shot === 0) drawCityMap(ctx, w, h, {});
 else if (shot === 1) {
 for (let i = 0; i < 6; i++) {
 ctx.save();
 ctx.translate((i % 3) * w * 0.22 + w * 0.16, Math.floor(i / 3) * h * 0.28 + h * 0.34);
 ctx.scale(0.38, 0.38);
 drawCityMap(ctx, w, h, {});
 ctx.restore();
 }
 } else if (shot === 2) {
 ctx.fillStyle = "#f87171";
 ctx.beginPath();
 ctx.moveTo(w * 0.5, h * 0.58);
 ctx.bezierCurveTo(w * 0.32, h * 0.4, w * 0.36, h * 0.22, w * 0.5, h * 0.32);
 ctx.bezierCurveTo(w * 0.64, h * 0.22, w * 0.68, h * 0.4, w * 0.5, h * 0.58);
 ctx.fill();
 } else {
 ctx.fillStyle = "#fbbf24";
 ctx.beginPath();
 ctx.ellipse(w * 0.5, h * 0.5, 28, 70, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.beginPath();
 ctx.arc(w * 0.5, h * 0.28, 18, 0, Math.PI * 2);
 ctx.fill();
 }
 ctx.fillStyle = "rgba(15,23,42,0.8)";
 roundRect(ctx, w * 0.72, h * 0.62, 90, 70, 10);
 ctx.fill();
 ctx.fillStyle = "#67e8f9";
 ctx.beginPath();
 ctx.ellipse(w * 0.82, h * 0.78, 22, 16, 0.2, 0, Math.PI * 2);
 ctx.fill();
 drawLabel(ctx, "city-state", w * 0.82, h * 0.66, { h: 18, font: "600 10px Segoe UI" });
 drawLabel(ctx, `${labels[shot]}  →  some stay independent city-states`, w * 0.5, 24, {
 h: 26,
 maxW: w * 0.94,
 });
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("cellClose", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 const start = performance.now();
 setDescription("You are a city of trillions.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 bioLabState.cellCloseU = Math.min(1, t / 3);
 fillNightCity(ctx, w, h, t);
 ctx.globalAlpha = 0.55 + 0.2 * Math.sin(t);
 drawTissueGrid(ctx, w, h, t, false);
 ctx.globalAlpha = 1;
 ctx.strokeStyle = "rgba(236,253,245,0.7)";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.ellipse(w * 0.5, h * 0.5, 36, 88, 0, 0, Math.PI * 2);
 ctx.stroke();
 ctx.beginPath();
 ctx.arc(w * 0.5, h * 0.22, 20, 0, Math.PI * 2);
 ctx.stroke();
 drawLabel(ctx, "A cooperating civilization of trillions of cells", w * 0.5, 28, {
 h: 26,
 maxW: w * 0.94,
 });
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("cellSpiral", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const stops = [
 { id: 1, label: "1 City", caption: "Spiral 1: every body is a city of cells" },
 { id: 2, label: "2 Jobs", caption: "Spiral 2: six workers inside an animal cell" },
 { id: 3, label: "3 Plant", caption: "Spiral 3: wall, chloroplasts, water tower" },
 { id: 4, label: "4 Team", caption: "Spiral 4: production line, then tissues and organisms" },
 ];
 setDescription("Recap map of the four Cell City spirals.");
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
 if (stop === 1) drawTissueGrid(ctx, 80, 80, 1, false);
 if (stop === 2) {
 ctx.fillStyle = "#a78bfa";
 ctx.beginPath();
 ctx.arc(origin.cx, origin.cy, 14, 0, Math.PI * 2);
 ctx.fill();
 }
 if (stop === 3) {
 ctx.fillStyle = "#22c55e";
 ctx.beginPath();
 ctx.ellipse(origin.cx, origin.cy, 16, 10, 0.2, 0, Math.PI * 2);
 ctx.fill();
 }
 if (stop === 4) {
 ctx.fillStyle = "#facc15";
 ctx.beginPath();
 ctx.arc(origin.cx, origin.cy, 8, 0, Math.PI * 2);
 ctx.fill();
 }
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
 ctx.fillText("Finish Cell City", fx, fy);
 hits.push({ id: "spiral-finish", shape: "rect", x: fx, y: fy, w: fw, h: 44, meta: { action: "spiralFinish" } });
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 if (typeof arena.registerAlias === "function") {
 arena.registerAlias("cellMeet", "cellOpen");
 arena.registerAlias("cellLab", "cellZoom");
 arena.registerAlias("cellSort", "cellGrid");
 arena.registerAlias("cellRule", "cellMorph");
 arena.registerAlias("cellStretch", "cellPair");
 arena.registerAlias("cellMyth", "cellScale");
 arena.registerAlias("cellDrill", "cellLine");
 arena.registerAlias("cellMastery", "cellSpiral");
 }
}
