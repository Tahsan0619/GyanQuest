/**
 * Chemistry Lab Mission 2 Element Hunt: Canvas 2D.
 * Script: Opening + 4 Bruner spirals (element identity → orbits → orbitals → personality) + recap map.
 */
import {
 chemLabState,
 elementForProtons,
 pulseFailFeedback,
 pulseSuccessFeedback,
} from "./atom-scenes.js?v=elemhunt7";

const SUP = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];
const AUFBAU = [
 [1, "s", 2],
 [2, "s", 2],
 [2, "p", 6],
 [3, "s", 2],
 [3, "p", 6],
 [4, "s", 2],
 [3, "d", 10],
 [4, "p", 6],
 [5, "s", 2],
 [4, "d", 10],
 [5, "p", 6],
 [6, "s", 2],
 [4, "f", 14],
 [5, "d", 10],
 [6, "p", 6],
 [7, "s", 2],
 [5, "f", 14],
 [6, "d", 10],
 [7, "p", 6],
];

export const HUNT_PROTON_SEQ = [1, 2, 6, 8, 10, 11, 17, 18];

export function supNum(n) {
 return String(n)
 .split("")
 .map((d) => SUP[Number(d)] || d)
 .join("");
}

export function configTerms(z) {
 let left = Math.max(0, Math.round(Number(z) || 0));
 const terms = [];
 for (const [n, l, cap] of AUFBAU) {
 if (left <= 0) break;
 const take = Math.min(cap, left);
 terms.push({ n, l, e: take });
 left -= take;
 }
 return terms;
}

export function configString(z) {
 return configTerms(z)
 .map((t) => `${t.n}${t.l}${supNum(t.e)}`)
 .join(" ");
}

export function valenceCount(z) {
 const terms = configTerms(z);
 if (!terms.length) return 0;
 const maxN = Math.max(...terms.map((t) => t.n));
 return terms.filter((t) => t.n === maxN).reduce((s, t) => s + t.e, 0);
}

export function fillingOrbital(z) {
 const terms = configTerms(z);
 const last = terms[terms.length - 1];
 return last ? `${last.n}${last.l}` : "1s";
}

export function periodicCell(z) {
 if (z < 1 || z > 118) return null;
 if (z >= 57 && z <= 71) return { c: z - 57 + 3, r: 8 };
 if (z >= 89 && z <= 103) return { c: z - 89 + 3, r: 9 };
 const main = {
 1: [0, 0],
 2: [17, 0],
 3: [0, 1],
 4: [1, 1],
 5: [12, 1],
 6: [13, 1],
 7: [14, 1],
 8: [15, 1],
 9: [16, 1],
 10: [17, 1],
 11: [0, 2],
 12: [1, 2],
 13: [12, 2],
 14: [13, 2],
 15: [14, 2],
 16: [15, 2],
 17: [16, 2],
 18: [17, 2],
 };
 if (main[z]) return { c: main[z][0], r: main[z][1] };
 if (z >= 19 && z <= 36) return { c: z - 19, r: 3 };
 if (z >= 37 && z <= 54) return { c: z - 37, r: 4 };
 if (z >= 55 && z <= 56) return { c: z - 55, r: 5 };
 if (z >= 72 && z <= 86) return { c: z - 72 + 3, r: 5 };
 if (z >= 87 && z <= 88) return { c: z - 87, r: 6 };
 if (z >= 104 && z <= 118) return { c: z - 104 + 3, r: 6 };
 return { c: (z - 1) % 18, r: 7 };
}

export function familyOf(z) {
 if ([2, 10, 18, 36, 54, 86, 118].includes(z)) return "noble";
 if ([3, 11, 19, 37, 55, 87].includes(z)) return "alkali";
 if ([9, 17, 35, 53, 85, 117].includes(z)) return "halogen";
 const cell = periodicCell(z);
 if (cell && cell.r >= 8) return "other";
 if (cell && cell.c >= 2 && cell.c <= 11 && z >= 21 && z <= 112) return "transition";
 return "other";
}

const FAM_COLOR = {
 alkali: "#a78bfa",
 noble: "#2dd4bf",
 halogen: "#fb923c",
 transition: "#94a3b8",
 other: "#1e4970",
};
const FAM_LABEL = {
 alkali: "Alkali Metals",
 noble: "Noble Gases",
 halogen: "Halogens",
 transition: "Transition Metals",
};

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
 const padX = 10;
 const bw = tw + padX * 2;
 const bh = opts.h || 24;
 ctx.fillStyle = opts.bg || "rgba(8,47,73,0.88)";
 roundRect(ctx, x - bw / 2, y - bh / 2, bw, bh, 9);
 ctx.fill();
 ctx.strokeStyle = opts.border || "rgba(45,212,191,0.45)";
 ctx.lineWidth = 1.3;
 ctx.stroke();
 ctx.fillStyle = opts.color || "#e0f2fe";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(text, x, y + 1);
}

function fillNight(ctx, w, h) {
 const g = ctx.createLinearGradient(0, 0, 0, h);
 g.addColorStop(0, "#0c4a6e");
 g.addColorStop(0.45, "#082f49");
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
 ctx.fillStyle = `rgba(45,212,191,${a})`;
 ctx.fillRect(0, 0, w, h);
}

function tableMetrics(w, h) {
 const padX = 16;
 const padTop = 44;
 const padBot = 36;
 const cols = 18;
 const rows = 10;
 const cw = (w - padX * 2) / cols;
 const ch = (h - padTop - padBot) / rows;
 return { padX, padTop, cw, ch };
}

function cellXY(z, w, h) {
 const pos = periodicCell(z);
 if (!pos) return null;
 const m = tableMetrics(w, h);
 return {
 x: m.padX + (pos.c + 0.5) * m.cw,
 y: m.padTop + (pos.r + 0.5) * m.ch,
 cw: m.cw,
 ch: m.ch,
 };
}

function drawTile(ctx, z, x, y, cw, ch, t, opts = {}) {
 const labeled = !!opts.labeled;
 const family = familyOf(z);
 const hot = opts.heat;
 let col = opts.unlabeled ? "#38bdf8" : FAM_COLOR[family] || FAM_COLOR.other;
 if (hot === "calm") col = "#38bdf8";
 if (hot === "eager") col = "#f97316";
 if (hot === "mid") col = "#fbbf24";
 const pulse = 0.55 + Math.sin(t * 2 + z * 0.2) * 0.2;
 ctx.fillStyle = col;
 ctx.globalAlpha = opts.unlabeled ? 0.35 + pulse * 0.35 : 0.85;
 roundRect(ctx, x - cw * 0.42, y - ch * 0.38, cw * 0.84, ch * 0.76, 3);
 ctx.fill();
 ctx.globalAlpha = 1;
 if (opts.selected) {
 ctx.strokeStyle = "#ef4444";
 ctx.lineWidth = 2.6;
 ctx.stroke();
 }
 if (labeled) {
 const el = elementForProtons(z);
 const sym = el.symbol === "?" ? String(z) : el.symbol;
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 if (opts.selected) {
 ctx.fillStyle = "#7f1d1d";
 ctx.font = `800 ${Math.max(8, Math.floor(cw * 0.38))}px Segoe UI, sans-serif`;
 ctx.fillText(sym, x, y);
 } else {
 ctx.fillStyle = "#0f172a";
 ctx.font = `700 ${Math.max(7, Math.floor(cw * 0.28))}px Segoe UI, sans-serif`;
 ctx.fillText(sym, x, y);
 }
 }
}

function drawTable(ctx, w, h, t, opts = {}) {
 const hits = [];
 for (let z = 1; z <= 118; z++) {
 const p = cellXY(z, w, h);
 if (!p) continue;
 const fam = familyOf(z);
 let heat = null;
 if (opts.heat) {
 if (fam === "noble") heat = "calm";
 else if (fam === "alkali" || fam === "halogen") heat = "eager";
 else heat = "mid";
 }
 const selected = opts.selectedZ === z || opts.family === fam;
 if (opts.skipZ === z || (opts.skipZs && opts.skipZs.includes(z))) {
 hits.push({
 id: `z-${z}`,
 shape: "rect",
 x: p.x,
 y: p.y,
 w: p.cw,
 h: p.ch,
 meta: { action: "tile", z, family: fam },
 });
 continue;
 }
 drawTile(ctx, z, p.x, p.y, p.cw, p.ch, t, {
 unlabeled: opts.unlabeled,
 labeled: opts.labeled,
 selected,
 heat,
 });
 hits.push({
 id: `z-${z}`,
 shape: "rect",
 x: p.x,
 y: p.y,
 w: p.cw,
 h: p.ch,
 meta: { action: "tile", z, family: fam },
 });
 }
 return hits;
}

function project(x, y, z, rotX, rotY, scale) {
 const cy = Math.cos(rotY);
 const sy = Math.sin(rotY);
 const cx = Math.cos(rotX);
 const sx = Math.sin(rotX);
 const x1 = x * cy - z * sy;
 const z1 = x * sy + z * cy;
 const y1 = y * cx - z1 * sx;
 const z2 = y * sx + z1 * cx;
 const persp = 3.2 / (3.2 + z2);
 return { x: x1 * persp * scale, y: y1 * persp * scale, z: z2, a: persp };
}

function rgbOfKind(kind) {
 if (kind === "s") return [56, 189, 248];
 if (kind === "p") return [167, 139, 250];
 if (kind === "d") return [251, 146, 60];
 return [244, 114, 182];
}

function pOrbitalLobes() {
 const r = 0.42;
 const d = 0.4;
 return [
 { x: d, y: 0, z: 0, r, axis: 0 },
 { x: -d, y: 0, z: 0, r, axis: 0 },
 { x: 0, y: d, z: 0, r, axis: 1 },
 { x: 0, y: -d, z: 0, r, axis: 1 },
 { x: 0, y: 0, z: d, r, axis: 2 },
 { x: 0, y: 0, z: -d, r, axis: 2 },
 ];
}

function dOrbitalLobes(dIndex) {
 const r = 0.36;
 const d = 0.5;
 const diag = d / Math.SQRT2;
 const v = dIndex % 5;
 if (v === 0) {
 return [
 { x: diag, y: diag, z: 0, r },
 { x: -diag, y: diag, z: 0, r },
 { x: diag, y: -diag, z: 0, r },
 { x: -diag, y: -diag, z: 0, r },
 ];
 }
 if (v === 1) {
 return [
 { x: diag, y: 0, z: diag, r },
 { x: -diag, y: 0, z: diag, r },
 { x: diag, y: 0, z: -diag, r },
 { x: -diag, y: 0, z: -diag, r },
 ];
 }
 if (v === 2) {
 return [
 { x: 0, y: diag, z: diag, r },
 { x: 0, y: -diag, z: diag, r },
 { x: 0, y: diag, z: -diag, r },
 { x: 0, y: -diag, z: -diag, r },
 ];
 }
 if (v === 3) {
 return [
 { x: d, y: 0, z: 0, r },
 { x: -d, y: 0, z: 0, r },
 { x: 0, y: d, z: 0, r },
 { x: 0, y: -d, z: 0, r },
 ];
 }
 const ring = [];
 for (let i = 0; i < 8; i++) {
 const a = (i / 8) * Math.PI * 2;
 ring.push({ x: Math.cos(a) * 0.42, y: Math.sin(a) * 0.42, z: 0, r: 0.16 });
 }
 return [{ x: 0, y: 0, z: 0.5, r: 0.36 }, { x: 0, y: 0, z: -0.5, r: 0.36 }, ...ring];
}

function fOrbitalLobes() {
 const r = 0.26;
 const d = 0.5;
 const lobes = [];
 for (const sx of [-1, 1]) {
 for (const sy of [-1, 1]) {
 for (const sz of [-1, 1]) {
 lobes.push({ x: sx * d * 0.55, y: sy * d * 0.55, z: sz * d * 0.55, r });
 }
 }
 }
 return lobes;
}

function drawLobeSphere(ctx, x, y, rad, rgb, a) {
 if (rad < 1.5) return;
 const [rr, gg, bb] = rgb;
 const g = ctx.createRadialGradient(x - rad * 0.3, y - rad * 0.34, rad * 0.08, x, y, rad);
 g.addColorStop(0, `rgba(255,255,255,${0.55 * a})`);
 g.addColorStop(0.18, `rgba(${rr},${gg},${bb},${0.92 * a})`);
 g.addColorStop(0.62, `rgba(${rr},${gg},${bb},${0.4 * a})`);
 g.addColorStop(1, `rgba(${rr},${gg},${bb},0)`);
 ctx.beginPath();
 ctx.arc(x, y, rad, 0, Math.PI * 2);
 ctx.fillStyle = g;
 ctx.fill();
}

function drawOrbitalCloud(ctx, cx, cy, kind, t, optScale) {
 const rotX = chemLabState.huntRotX || 0.35;
 const rotY = chemLabState.huntRotY || 0;
 const scale = optScale != null ? optScale : Math.min(cx, cy) * 0.92;
 const rgb = rgbOfKind(kind);
 const on = chemLabState.huntPLobes || [true, false, false];
 let lobes;
 if (kind === "s") lobes = [{ x: 0, y: 0, z: 0, r: 0.78, axis: 0 }];
 else if (kind === "p") {
 lobes = pOrbitalLobes().filter((l) => on[l.axis]);
 if (!lobes.length) lobes = pOrbitalLobes().filter((l) => l.axis === 0);
 }
 else if (kind === "d") lobes = dOrbitalLobes(chemLabState.huntDIndex || 0);
 else lobes = fOrbitalLobes();

 const drawn = lobes.map((l) => {
 const p = project(l.x, l.y, l.z, rotX, rotY, scale);
 return { ...l, p, rad: l.r * scale * p.a };
 });
 drawn.sort((a, b) => a.p.z - b.p.z);

 if (kind === "p") {
 const byAxis = {};
 drawn.forEach((l) => {
 (byAxis[l.axis] ||= []).push(l);
 });
 Object.values(byAxis).forEach((pair) => {
 if (pair.length < 2) return;
 ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.4)`;
 ctx.lineWidth = Math.max(3, scale * 0.045);
 ctx.lineCap = "round";
 ctx.beginPath();
 ctx.moveTo(cx + pair[0].p.x, cy + pair[0].p.y);
 ctx.lineTo(cx + pair[1].p.x, cy + pair[1].p.y);
 ctx.stroke();
 });
 }

 for (const l of drawn) {
 const a = 0.55 + l.p.a * 0.45;
 if (kind === "p") {
 const ang = Math.atan2(l.p.y, l.p.x);
 ctx.save();
 ctx.translate(cx + l.p.x, cy + l.p.y);
 ctx.rotate(ang);
 ctx.scale(1.42, 0.66);
 drawLobeSphere(ctx, 0, 0, l.rad, rgb, a);
 ctx.restore();
 } else {
 drawLobeSphere(ctx, cx + l.p.x, cy + l.p.y, l.rad, rgb, a);
 }
 }

 if (kind === "s") {
 ctx.beginPath();
 for (let i = 0; i <= 48; i++) {
 const a = (i / 48) * Math.PI * 2;
 const p = project(Math.cos(a) * 0.78, 0, Math.sin(a) * 0.78, rotX, rotY, scale);
 if (i === 0) ctx.moveTo(cx + p.x, cy + p.y);
 else ctx.lineTo(cx + p.x, cy + p.y);
 }
 ctx.strokeStyle = "rgba(186,230,253,0.6)";
 ctx.lineWidth = 1.5;
 ctx.stroke();
 }

 if (kind === "d" && (chemLabState.huntDIndex || 0) % 5 === 4) {
 ctx.beginPath();
 for (let i = 0; i <= 48; i++) {
 const a = (i / 48) * Math.PI * 2;
 const p = project(Math.cos(a) * 0.42, Math.sin(a) * 0.42, 0, rotX, rotY, scale);
 if (i === 0) ctx.moveTo(cx + p.x, cy + p.y);
 else ctx.lineTo(cx + p.x, cy + p.y);
 }
 ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.75)`;
 ctx.lineWidth = 2.2;
 ctx.stroke();
 }

 ctx.fillStyle = "#fb7185";
 ctx.beginPath();
 ctx.arc(cx, cy, Math.max(3.2, scale * 0.032), 0, Math.PI * 2);
 ctx.fill();
 void t;
}

function drawRedCross(ctx, x, y, inner, outer) {
 ctx.save();
 ctx.strokeStyle = "#ef4444";
 ctx.lineCap = "round";
 ctx.lineJoin = "round";
 ctx.shadowColor = "rgba(127,29,29,0.85)";
 ctx.shadowBlur = 10;
 ctx.lineWidth = Math.max(3.2, outer * 0.085);
 ctx.beginPath();
 const dirs = [
 [1, 0],
 [-1, 0],
 [0, 1],
 [0, -1],
 ];
 dirs.forEach(([dx, dy]) => {
 ctx.moveTo(x + dx * inner, y + dy * inner);
 ctx.lineTo(x + dx * outer, y + dy * outer);
 });
 ctx.stroke();
 ctx.shadowBlur = 8;
 ctx.lineWidth = Math.max(2.8, outer * 0.07);
 ctx.beginPath();
 ctx.arc(x, y, (inner + outer) * 0.5, 0, Math.PI * 2);
 ctx.stroke();
 ctx.restore();
}

function drawGuidedStopMark(ctx, z, w, h, t, stops, opts = {}) {
 const p = cellXY(z, w, h);
 if (!p) return;
 const done = (z === 10 && stops.ne) || (z === 11 && stops.na) || (z === 17 && stops.cl);
 if (!opts.skipTile) {
 drawTile(ctx, z, p.x, p.y, p.cw, p.ch, t, { labeled: true });
 }
 if (done) {
 ctx.fillStyle = "#4ade80";
 ctx.font = `800 ${Math.max(10, Math.floor(p.cw * 0.38))}px Segoe UI, sans-serif`;
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText("✓", p.x + p.cw * 0.32, p.y - p.ch * 0.28);
 } else {
 const pulse = 0.55 + Math.sin(t * 3) * 0.45;
 ctx.strokeStyle = `rgba(250,204,21,${pulse})`;
 ctx.lineWidth = 2.4;
 roundRect(ctx, p.x - p.cw * 0.46, p.y - p.ch * 0.42, p.cw * 0.92, p.ch * 0.84, 4);
 ctx.stroke();
 }
}

export function sampleSnap() {
 let u = 0;
 let v = 0;
 while (!u) u = Math.random();
 while (!v) v = Math.random();
 const r = Math.sqrt(-2 * Math.log(u)) * 0.28;
 const th = 2 * Math.PI * v;
 return { x: r * Math.cos(th), y: r * Math.sin(th) * 0.82 };
}

export function registerElementScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("elemOpen", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const start = performance.now();
 setDescription("118 unlabeled glowing tiles. Tap Begin.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "begin") {
 chemLabState.huntBegin = true;
 pulseSuccessFeedback(280);
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 const hits = drawTable(ctx, w, h, t, { unlabeled: true });
 const mid = cellXY(26, w, h) || { x: w * 0.5, y: h * 0.5 };
 drawLabel(ctx, "Begin →", mid.x, mid.y, { font: "800 14px Segoe UI, sans-serif", h: 28 });
 hits.push({
 id: "begin",
 shape: "rect",
 x: mid.x,
 y: mid.y,
 w: 120,
 h: 40,
 meta: { action: "begin" },
 });
 ctx.restore();
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("elemFamilies", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions } = api;
 const start = performance.now();
 setDescription("Periodic table families. Tap a colored region.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 const hits = drawTable(ctx, w, h, t, {
 labeled: false,
 family: chemLabState.huntFamily,
 });
 const fam = chemLabState.huntFamily;
 if (fam && FAM_LABEL[fam]) {
 drawLabel(ctx, FAM_LABEL[fam], w * 0.5, 22, { font: "700 14px Segoe UI, sans-serif", h: 28 });
 if (fam === "noble") {
 drawLabel(ctx, "Already full. Calm. Barely reacts.", w * 0.5, h - 22);
 } else if (fam === "alkali") {
 drawLabel(ctx, "One easy-to-lose outer electron. Reactive spark.", w * 0.5, h - 22);
 } else if (fam === "halogen") {
 drawLabel(ctx, "One open spot. Eager to grab an electron.", w * 0.5, h - 22);
 } else if (fam === "transition") {
 drawLabel(ctx, "Filling d orbitals. The wide middle block.", w * 0.5, h - 22);
 }
 } else {
 drawLabel(ctx, "Tap a colored family", w * 0.5, 22);
 }
 ctx.restore();
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("elemCarbon", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 setDescription("Carbon’s periodic table entry.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 const bw = Math.min(280, w * 0.55);
 const bh = Math.min(280, h * 0.62);
 const x = (w - bw) / 2;
 const y = (h - bh) / 2 + 8;
 roundRect(ctx, x, y, bw, bh, 16);
 ctx.fillStyle = "#0ea5e9";
 ctx.fill();
 ctx.fillStyle = "#082f49";
 ctx.font = "700 22px Segoe UI, sans-serif";
 ctx.textAlign = "left";
 ctx.fillText("6", x + 18, y + 36);
 ctx.font = "800 72px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.fillText("C", w * 0.5, y + bh * 0.52);
 ctx.font = "600 18px Segoe UI, sans-serif";
 ctx.fillText("Carbon", w * 0.5, y + bh * 0.78);
 ctx.fillStyle = "#e0f2fe";
 ctx.font = "600 14px Segoe UI, sans-serif";
 ctx.fillText("Period 2, Group 14", w * 0.5, y + bh + 28);
 drawLabel(ctx, "Atomic number 6 (protons)", w * 0.5, 26);
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("elemShells", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 let drag = null;
 setDescription("Fill Sodium’s shells: 2, then 8, then 1.");
 setIntentHandler((intent) => {
 const w = api.width;
 const h = api.height;
 const cx = w * 0.5;
 const cy = h * 0.42;
 const caps = [2, 8, 8];
 const shells = chemLabState.huntShells || [0, 0, 0];
 if (intent.type === "CANVAS_DOWN" && intent.meta?.action === "eToken") {
 drag = { x: intent.x, y: intent.y };
 }
 if (intent.type === "CANVAS_DRAG" && drag) {
 drag.x = intent.x;
 drag.y = intent.y;
 }
 if (intent.type === "CANVAS_UP" && drag) {
 const dist = Math.hypot(intent.x - cx, intent.y - cy);
 let ring = -1;
 if (dist < 48) ring = 0;
 else if (dist < 78) ring = 1;
 else if (dist < 110) ring = 2;
 if (ring >= 0) {
 if (shells[ring] >= caps[ring]) {
 pulseFailFeedback(360);
 chemLabState.huntBounce = { x: intent.x, y: intent.y, t0: performance.now() };
 } else {
 shells[ring] += 1;
 chemLabState.huntShells = shells.slice();
 pulseSuccessFeedback(180);
 }
 }
 drag = null;
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = performance.now() / 1000;
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 const cx = w * 0.5;
 const cy = h * 0.42;
 const radii = [36, 64, 94];
 const caps = [2, 8, 8];
 const shells = chemLabState.huntShells || [0, 0, 0];
 ctx.fillStyle = "#fb7185";
 ctx.beginPath();
 ctx.arc(cx, cy, 12, 0, Math.PI * 2);
 ctx.fill();
 radii.forEach((r, i) => {
 ctx.strokeStyle = "rgba(125,211,252,0.4)";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.arc(cx, cy, r, 0, Math.PI * 2);
 ctx.stroke();
 ctx.fillStyle = "#7dd3fc";
 ctx.font = "600 11px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.fillText(`${shells[i]}/${caps[i]}`, cx, cy - r - 8);
 for (let k = 0; k < shells[i]; k++) {
 const a = t * (1.2 - i * 0.2) + (k / Math.max(1, shells[i])) * Math.PI * 2;
 ctx.fillStyle = "#38bdf8";
 ctx.beginPath();
 ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 5, 0, Math.PI * 2);
 ctx.fill();
 }
 });
 const placed = shells[0] + shells[1] + shells[2];
 drawLabel(
 ctx,
 `Shell 1: 2 max. Shell 2: 8 max. Shell 3: 8 max (for now). Placed ${placed}/11`,
 w * 0.5,
 24,
 { font: "600 12px Segoe UI, sans-serif", h: 28 },
 );
 const tx = w * 0.5;
 const ty = h - 36;
 if (placed < 11) {
 ctx.fillStyle = "#38bdf8";
 ctx.beginPath();
 ctx.arc(tx, ty, 10, 0, Math.PI * 2);
 ctx.fill();
 drawLabel(ctx, "Drag onto a ring", tx, ty - 22, { h: 20, font: "600 11px Segoe UI, sans-serif" });
 }
 if (drag) {
 ctx.fillStyle = "#38bdf8";
 ctx.beginPath();
 ctx.arc(drag.x, drag.y, 10, 0, Math.PI * 2);
 ctx.fill();
 }
 const bounce = chemLabState.huntBounce;
 if (bounce) {
 const u = Math.min(1, (performance.now() - bounce.t0) / 380);
 const bx = bounce.x + (tx - bounce.x) * u;
 const by = bounce.y + (ty - bounce.y) * u;
 ctx.fillStyle = "#f87171";
 ctx.beginPath();
 ctx.arc(bx, by, 10, 0, Math.PI * 2);
 ctx.fill();
 if (u >= 1) chemLabState.huntBounce = null;
 }
 ctx.restore();
 const hits = [];
 if (placed < 11) hits.push({ id: "e-token", shape: "ellipse", x: tx, y: ty, r: 22, meta: { action: "eToken" } });
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("elemCloud", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const start = performance.now();
 setDescription("Orbit rings smear into an orbital cloud. Tap snapshots.");
 setIntentHandler((intent) => {
 if (intent.type !== "CANVAS_TAP" || intent.meta?.action !== "snap") return;
 if (chemLabState.phase !== "snaps") return;
 const snaps = chemLabState.huntSnaps || [];
 if (snaps.length >= 40) return;
 chemLabState.huntSnaps = snaps.concat([sampleSnap()]);
 pulseSuccessFeedback(120);
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 const phase = chemLabState.phase || "ring";
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 const cx = w * 0.5;
 const cy = h * 0.48;
 if (phase === "snaps" || phase === "words") chemLabState.huntSmear = 1;
 else chemLabState.huntSmear = Math.min(1, (performance.now() - start) / 4000);
 const smear = chemLabState.huntSmear || 0;
 if (phase === "words") {
 roundRect(ctx, w * 0.08, h * 0.22, w * 0.38, h * 0.5, 14);
 ctx.fillStyle = "rgba(14,165,233,0.25)";
 ctx.fill();
 ctx.strokeStyle = "#38bdf8";
 ctx.beginPath();
 ctx.arc(w * 0.27, h * 0.42, 48, 0, Math.PI * 2);
 ctx.stroke();
 ctx.fillStyle = "#e0f2fe";
 ctx.font = "700 18px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.fillText("ORBIT", w * 0.27, h * 0.62);
 roundRect(ctx, w * 0.54, h * 0.22, w * 0.38, h * 0.5, 14);
 ctx.fillStyle = "rgba(45,212,191,0.22)";
 ctx.fill();
 const g = ctx.createRadialGradient(w * 0.73, h * 0.42, 8, w * 0.73, h * 0.42, 70);
 g.addColorStop(0, "rgba(125,211,252,0.7)");
 g.addColorStop(1, "rgba(125,211,252,0)");
 ctx.fillStyle = g;
 ctx.beginPath();
 ctx.arc(w * 0.73, h * 0.42, 70, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#e0f2fe";
 ctx.fillText("ORBITAL", w * 0.73, h * 0.62);
 drawLabel(ctx, "Orbit: imagined path. Orbital: real region of probability.", w * 0.5, 26, {
 h: 28,
 font: "600 12px Segoe UI, sans-serif",
 });
 setHitRegions([]);
 } else {
 ctx.fillStyle = "#fb7185";
 ctx.beginPath();
 ctx.arc(cx, cy, 10, 0, Math.PI * 2);
 ctx.fill();
 const ringA = 1 - Math.min(1, smear);
 if (ringA > 0.02) {
 ctx.globalAlpha = ringA;
 ctx.strokeStyle = "#38bdf8";
 ctx.lineWidth = 2;
 [40, 68, 96].forEach((r, i) => {
 ctx.beginPath();
 ctx.arc(cx, cy, r, 0, Math.PI * 2);
 ctx.stroke();
 for (let k = 0; k < (i === 0 ? 2 : i === 1 ? 8 : 1); k++) {
 const a = t * 1.4 + k;
 ctx.fillStyle = "#38bdf8";
 ctx.beginPath();
 ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 4, 0, Math.PI * 2);
 ctx.fill();
 }
 });
 ctx.globalAlpha = 1;
 }
 const cloudA = Math.min(1, smear);
 if (cloudA > 0.02) {
 const g = ctx.createRadialGradient(cx, cy, 8, cx, cy, 110);
 g.addColorStop(0, `rgba(125,211,252,${0.55 * cloudA})`);
 g.addColorStop(1, "rgba(125,211,252,0)");
 ctx.fillStyle = g;
 ctx.beginPath();
 ctx.arc(cx, cy, 110, 0, Math.PI * 2);
 ctx.fill();
 }
 const snaps = chemLabState.huntSnaps || [];
 snaps.forEach((s) => {
 ctx.fillStyle = "rgba(254,240,138,0.9)";
 ctx.beginPath();
 ctx.arc(cx + s.x * 110, cy + s.y * 110, 3, 0, Math.PI * 2);
 ctx.fill();
 });
 if (phase === "snaps") {
 drawLabel(ctx, `Snapshots: ${snaps.length}. Each tap is one possible electron location.`, w * 0.5, 24, {
 h: 28,
 font: "600 12px Segoe UI, sans-serif",
 });
 const bx = w * 0.5;
 const by = h - 34;
 roundRect(ctx, bx - 70, by - 20, 140, 40, 12);
 ctx.fillStyle = "#0284c7";
 ctx.fill();
 ctx.fillStyle = "#f0f9ff";
 ctx.font = "800 14px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText("Take snapshot", bx, by);
 setHitRegions([{ id: "snap", shape: "rect", x: bx, y: by, w: 140, h: 40, meta: { action: "snap" } }]);
 } else if (smear >= 1) {
 drawLabel(
 ctx,
 "We can never know exactly where an electron is, only how likely it is to be in a given spot.",
 w * 0.5,
 24,
 { h: 32, font: "600 11px Segoe UI, sans-serif" },
 );
 setHitRegions([]);
 } else {
 drawLabel(ctx, "Watch the neat rings smear into a cloud.", w * 0.5, 24);
 setHitRegions([]);
 }
 }
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("elemOrbitals", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 let dragging = false;
 let last = null;
 setDescription("Rotate s, p, d, and optional f orbital shapes.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DOWN") {
 dragging = true;
 last = { x: intent.x, y: intent.y };
 }
 if (intent.type === "CANVAS_DRAG" && dragging && last) {
 chemLabState.huntRotY += (intent.x - last.x) * 0.01;
 chemLabState.huntRotX += (intent.y - last.y) * 0.01;
 last = { x: intent.x, y: intent.y };
 const k = chemLabState.huntOrbital || "s";
 if (k === "s" || k === "p" || k === "d") {
 chemLabState.huntSpun = { ...(chemLabState.huntSpun || {}), [k]: true };
 }
 }
 if (intent.type === "CANVAS_UP") dragging = false;
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = performance.now() / 1000;
 if (chemLabState.huntAutoRotate && !api.reducedMotion) chemLabState.huntRotY += 0.008;
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 const kind = chemLabState.huntOrbital || "s";
 drawOrbitalCloud(ctx, w * 0.5, h * 0.48, kind, t);
 const dCaps = [
 "d orbital: a four-leaf clover, lying in the xy plane.",
 "d orbital: a four-leaf clover, standing in the xz plane.",
 "d orbital: a four-leaf clover, standing in the yz plane.",
 "d orbital: a four-leaf clover, pointing along x and y.",
 "d orbital: two lobes plus a doughnut ring around the middle.",
 ];
 const captions = {
 s: "s orbital: a sphere. Spin it: the outline stays a circle from every angle.",
 p: "p orbital: a dumbbell. Two round lobes with a pinch at the nucleus. Turn on y and z to see the set of three.",
 d: dCaps[(chemLabState.huntDIndex || 0) % 5],
 f: "f orbitals: eight lobes, wilder still. Optional look, not a list to memorize.",
 };
 drawLabel(ctx, captions[kind] || captions.s, w * 0.5, 26, { h: 30, font: "600 12px Segoe UI, sans-serif" });
 drawLabel(ctx, "Drag to spin. Auto-rotate is in the panel.", w * 0.5, h - 22, {
 h: 22,
 font: "600 11px Segoe UI, sans-serif",
 });
 ctx.restore();
 setHitRegions([{ id: "spin", shape: "rect", x: w * 0.5, y: h * 0.5, w, h, meta: { action: "spin" } }]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("elemBuildup", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 setDescription("Electrons fill 1s → 2s → 2p → 3s → 3p → 4s → 3d, up to iron.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = performance.now() / 1000;
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 const z = Math.max(1, Math.min(26, chemLabState.huntFillZ || 1));
 const el = elementForProtons(z);
 const orb = fillingOrbital(z);
 drawOrbitalCloud(ctx, w * 0.32, h * 0.5, orb.includes("d") ? "d" : orb.includes("p") ? "p" : "s", t);
 ctx.fillStyle = "#e0f2fe";
 ctx.textAlign = "left";
 ctx.font = "700 22px Segoe UI, sans-serif";
 ctx.fillText(`${el.name} (${el.symbol})`, w * 0.58, h * 0.32);
 ctx.font = "600 14px Segoe UI, sans-serif";
 ctx.fillText(`Electrons: ${z}`, w * 0.58, h * 0.42);
 ctx.fillText(`Now filling: ${orb}`, w * 0.58, h * 0.52);
 if (orb === "3d") {
 ctx.fillText("This is why iron looks different", w * 0.58, h * 0.64);
 ctx.fillText("from the simple start of the table.", w * 0.58, h * 0.72);
 }
 drawLabel(ctx, configString(z), w * 0.5, 26, { h: 28, font: "700 13px Segoe UI, sans-serif" });
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("elemMood", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions } = api;
 const start = performance.now();
 setDescription("Inspect Neon, Sodium, and Chlorine. Then see the reactivity map.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 const phase = chemLabState.phase || "inspect";
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 if (phase === "valence") {
 ctx.fillStyle = "#e0f2fe";
 ctx.textAlign = "center";
 ctx.font = "700 18px Segoe UI, sans-serif";
 ctx.fillText("Na: 1 valence electron", w * 0.3, h * 0.28);
 for (let i = 0; i < 1; i++) {
 ctx.fillStyle = "#fbbf24";
 ctx.beginPath();
 ctx.arc(w * 0.3, h * 0.42, 10, 0, Math.PI * 2);
 ctx.fill();
 }
 ctx.fillStyle = "#e0f2fe";
 ctx.fillText("Cl: 7 valence electrons", w * 0.7, h * 0.28);
 for (let i = 0; i < 7; i++) {
 const a = -Math.PI / 2 + (i / 7) * Math.PI * 2;
 ctx.fillStyle = "#38bdf8";
 ctx.beginPath();
 ctx.arc(w * 0.7 + Math.cos(a) * 34, h * 0.48 + Math.sin(a) * 34, 8, 0, Math.PI * 2);
 ctx.fill();
 }
 ctx.font = "600 14px Segoe UI, sans-serif";
 ctx.fillText("Together they can reach a full 8.", w * 0.5, h * 0.78);
 drawLabel(ctx, "Valence electrons: outermost shell, the ones in reactions.", w * 0.5, 26, {
 h: 28,
 font: "600 12px Segoe UI, sans-serif",
 });
 setHitRegions([]);
 } else if (phase === "heat") {
 const hits = drawTable(ctx, w, h, t, { labeled: true, heat: true });
 drawLabel(ctx, "Cool blue: calm (full). Hot orange: eager to give or grab.", w * 0.5, 22, {
 h: 26,
 font: "600 12px Segoe UI, sans-serif",
 });
 setHitRegions(hits);
 } else {
 const z = chemLabState.huntInspectZ;
 const stops = chemLabState.huntStops || {};
 if (z) {
 const guided = [10, 11, 17];
 ctx.save();
 ctx.filter = "blur(8px)";
 ctx.globalAlpha = 0.5;
 drawTable(ctx, w, h, t, { labeled: true, skipZs: [z, ...guided] });
 ctx.restore();
 const p = cellXY(z, w, h);
 if (p) {
 const pop = Math.min(1, (performance.now() - (chemLabState.huntInspectAt || 0)) / 220);
 const sc = 1.08 + 0.1 * pop;
 const holeR = Math.max(p.cw, p.ch) * sc * 1.15;
 const veil = ctx.createRadialGradient(p.x, p.y, holeR * 0.4, p.x, p.y, Math.max(w, h) * 0.92);
 veil.addColorStop(0, "rgba(4,14,32,0)");
 veil.addColorStop(0.18, "rgba(4,14,32,0.18)");
 veil.addColorStop(0.42, "rgba(4,14,32,0.62)");
 veil.addColorStop(1, "rgba(4,14,32,0.82)");
 ctx.fillStyle = veil;
 ctx.fillRect(0, 0, w, h);
 ctx.save();
 ctx.translate(p.x, p.y);
 ctx.scale(sc, sc);
 ctx.translate(-p.x, -p.y);
 ctx.shadowColor = "rgba(239,68,68,0.8)";
 ctx.shadowBlur = 18;
 drawTile(ctx, z, p.x, p.y, p.cw, p.ch, t, { labeled: true, selected: true });
 ctx.restore();
 const inner = Math.max(p.cw, p.ch) * sc * 0.5;
 drawRedCross(ctx, p.x, p.y, inner, inner * 1.42);
 guided.forEach((gz) => {
 if (gz !== z) drawGuidedStopMark(ctx, gz, w, h, t, stops);
 });
 }
 const hits = [];
 for (let zz = 1; zz <= 118; zz++) {
 const q = cellXY(zz, w, h);
 if (!q) continue;
 hits.push({
 id: `z-${zz}`,
 shape: "rect",
 x: q.x,
 y: q.y,
 w: q.cw,
 h: q.ch,
 meta: { action: "tile", z: zz, family: familyOf(zz) },
 });
 }
 const el = elementForProtons(z);
 const val = valenceCount(z);
 const fam = familyOf(z);
 const cardH = 104;
 const tileY = p ? p.y : h * 0.5;
 const cardY = tileY > h * 0.56 ? 12 : h - cardH - 10;
 roundRect(ctx, 10, cardY, w - 20, cardH, 12);
 ctx.fillStyle = "rgba(8, 47, 73, 0.96)";
 ctx.fill();
 ctx.strokeStyle = "rgba(239,68,68,0.85)";
 ctx.lineWidth = 2;
 ctx.stroke();
 ctx.fillStyle = "#fef2f2";
 ctx.font = "800 16px Segoe UI, sans-serif";
 ctx.textAlign = "left";
 ctx.textBaseline = "top";
 const title = `${el.symbol === "?" ? "Z " + z : el.symbol}  ${el.name}`;
 ctx.fillText(title, 22, cardY + 8);
 ctx.fillStyle = "#e0f2fe";
 ctx.font = "600 12px Segoe UI, sans-serif";
 ctx.fillText(`Atomic number ${z} (protons).  ${configString(z)}`, 22, cardY + 30);
 ctx.fillText(`Valence electrons: ${val}.  ${FAM_LABEL[fam] || "elsewhere on the table"}`, 22, cardY + 48);
 let cap = "Outer orbital fullness is why this element behaves the way it does.";
 if (z === 10) cap = "Nothing missing, nothing extra. Noble gases barely react.";
 if (z === 11) cap = "One lonely electron, easy to lose. Sodium reacts eagerly.";
 if (z === 17) cap = "Almost full, desperate to grab one more. Chlorine is reactive too.";
 ctx.fillStyle = "#fde68a";
 ctx.fillText(cap, 22, cardY + 68);
 ctx.fillStyle = "#94a3b8";
 ctx.font = "600 11px Segoe UI, sans-serif";
 ctx.fillText("Tap another element to inspect it. Red cross marks this one.", 22, cardY + 86);
 const orb = fillingOrbital(z);
 ctx.save();
 ctx.beginPath();
 ctx.rect(w - 108, cardY + 6, 88, cardH - 12);
 ctx.clip();
 drawOrbitalCloud(ctx, w - 64, cardY + cardH / 2, orb.includes("d") ? "d" : orb.includes("p") ? "p" : "s", t, 36);
 ctx.restore();
 setHitRegions(hits);
 } else {
 const hits = drawTable(ctx, w, h, t, { labeled: true });
 [10, 11, 17].forEach((gz) => drawGuidedStopMark(ctx, gz, w, h, t, stops, { skipTile: true }));
 const all = stops.ne && stops.na && stops.cl;
 drawLabel(ctx, "Tap any element. The table will blur. A red cross marks the one you picked.", w * 0.5, 22, {
 h: 28,
 font: "600 12px Segoe UI, sans-serif",
 });
 drawLabel(
 ctx,
 all
 ? "Neon, Sodium, and Chlorine inspected. Open the heat map when you are ready."
 : "Guided stops (gold ring): Neon, Sodium, Chlorine.",
 w * 0.5,
 h - 22,
 {
 h: 24,
 font: "600 12px Segoe UI, sans-serif",
 },
 );
 setHitRegions(hits);
 }
 }
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("elemClose", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 const start = performance.now();
 setDescription("The 118-element map, labeled and color-coded.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 const u = Math.min(1, t / 6);
 chemLabState.scale = u;
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 drawTable(ctx, w, h, t, { labeled: u > 0.45, unlabeled: u < 0.25 });
 drawLabel(ctx, "A map you can actually read.", w * 0.5, 24);
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("elemSpiral", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const start = performance.now();
 const stops = [
 { id: 1, label: "1 Identity", caption: "Spiral 1: protons decide the element" },
 { id: 2, label: "2 Clouds", caption: "Spiral 2: orbit to orbital" },
 { id: 3, label: "3 Shapes", caption: "Spiral 3: s, p, d, and f rooms" },
 { id: 4, label: "4 Moods", caption: "Spiral 4: full or empty outer shape" },
 ];
 setDescription("Recap map of the four Element Hunt spirals.");
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
 ctx.strokeStyle = "rgba(45,212,191,0.5)";
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
 ctx.fillStyle = "rgba(8,47,73,0.55)";
 ctx.fill();
 if (stop === 1) {
 for (let i = 0; i < 9; i++) {
 const col = i % 3;
 const row = Math.floor(i / 3);
 ctx.fillStyle = "#38bdf8";
 ctx.globalAlpha = 0.45 + Math.sin(t * 2 + i) * 0.15;
 roundRect(ctx, origin.cx - 28 + col * 18, origin.cy - 26 + row * 16, 14, 12, 2);
 ctx.fill();
 }
 ctx.globalAlpha = 1;
 }
 if (stop === 2) {
 const g = ctx.createRadialGradient(origin.cx, origin.cy, 6, origin.cx, origin.cy, 50);
 g.addColorStop(0, "rgba(125,211,252,0.7)");
 g.addColorStop(1, "rgba(125,211,252,0)");
 ctx.fillStyle = g;
 ctx.beginPath();
 ctx.arc(origin.cx, origin.cy, 50, 0, Math.PI * 2);
 ctx.fill();
 }
 if (stop === 3) drawOrbitalCloud(ctx, origin.cx, origin.cy, "p", t);
 if (stop === 4) {
 ctx.fillStyle = "#f97316";
 ctx.beginPath();
 ctx.arc(origin.cx - 18, origin.cy, 10, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#38bdf8";
 ctx.beginPath();
 ctx.arc(origin.cx + 18, origin.cy, 10, 0, Math.PI * 2);
 ctx.fill();
 }
 const hits = [];
 stops.forEach((s, i) => {
 const p = polar(i, w, h);
 ctx.fillStyle = stop === s.id ? "#2dd4bf" : "#0ea5e9";
 ctx.beginPath();
 ctx.arc(p.x, p.y, 22, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#f0f9ff";
 ctx.font = "800 16px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(String(s.id), p.x, p.y);
 const lx = Math.min(w - 70, Math.max(70, p.x + Math.cos(p.a) * 42));
 const ly = Math.min(h - 88, Math.max(58, p.y + Math.sin(p.a) * 36));
 drawLabel(ctx, s.label, lx, ly, { font: "600 12px Segoe UI, sans-serif", h: 22 });
 hits.push({ id: `stop-${s.id}`, shape: "ellipse", x: p.x, y: p.y, r: 36, meta: { action: "spiral", stop: s.id } });
 });
 drawLabel(ctx, stop ? stops[stop - 1].caption : "Your four spirals. Tap a number, then Finish Element Hunt.", w * 0.5, 28, {
 h: 32,
 font: "700 13px Segoe UI, sans-serif",
 });
 const fx = w * 0.5;
 const fy = h - 34;
 const fw = Math.min(260, w * 0.72);
 roundRect(ctx, fx - fw / 2, fy - 22, fw, 44, 12);
 ctx.fillStyle = "#0f766e";
 ctx.fill();
 ctx.fillStyle = "#f0f9ff";
 ctx.font = "800 16px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText("Finish Element Hunt", fx, fy);
 hits.push({ id: "spiral-finish", shape: "rect", x: fx, y: fy, w: fw, h: 44, meta: { action: "spiralFinish" } });
 setHitRegions(hits);
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 if (typeof arena.registerAlias === "function") {
 arena.registerAlias("elemMeet", "elemOpen");
 arena.registerAlias("elemIron", "elemFamilies");
 arena.registerAlias("elemSort", "elemFamilies");
 arena.registerAlias("elemCopper", "elemShells");
 arena.registerAlias("elemOxygen", "elemCloud");
 arena.registerAlias("elemRule", "elemCarbon");
 arena.registerAlias("elemStretch", "elemOrbitals");
 arena.registerAlias("elemMyth", "elemBuildup");
 arena.registerAlias("elemDrill", "elemMood");
 arena.registerAlias("elemMastery", "elemSpiral");
 }
}

export const ELEM_ASSET_PATHS = {
 hunt: "/games/chemistry-lab/assets/element-hunt.svg",
 iron: "/games/chemistry-lab/assets/iron-lattice.svg",
 copper: "/games/chemistry-lab/assets/copper-wire.svg",
 oxygen: "/games/chemistry-lab/assets/oxygen-pair.svg",
 rule: "/games/chemistry-lab/assets/element-rule.svg",
 orbit: "/games/chemistry-lab/assets/atom-orbit.svg",
 myth: "/games/chemistry-lab/assets/myth-bust.svg",
};
