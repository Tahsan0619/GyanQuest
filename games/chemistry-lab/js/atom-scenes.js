/**
 * Chemistry Lab Mission 1 Tiny Bits: Canvas 2D.
 * Script: Opening + 4 Bruner spirals (enactive → iconic → symbolic) + zoom-out.
 * Reusable sprites: unlabeled dots, H₂O trios, Bohr atoms.
 */

const ASSET = "/games/chemistry-lab/assets";

export const ELEMENTS_BY_Z = {
 1: { name: "Hydrogen", symbol: "H" },
 2: { name: "Helium", symbol: "He" },
 3: { name: "Lithium", symbol: "Li" },
 4: { name: "Beryllium", symbol: "Be" },
 5: { name: "Boron", symbol: "B" },
 6: { name: "Carbon", symbol: "C" },
 7: { name: "Nitrogen", symbol: "N" },
 8: { name: "Oxygen", symbol: "O" },
 9: { name: "Fluorine", symbol: "F" },
 10: { name: "Neon", symbol: "Ne" },
 11: { name: "Sodium", symbol: "Na" },
 12: { name: "Magnesium", symbol: "Mg" },
 13: { name: "Aluminium", symbol: "Al" },
 14: { name: "Silicon", symbol: "Si" },
 15: { name: "Phosphorus", symbol: "P" },
 16: { name: "Sulfur", symbol: "S" },
 17: { name: "Chlorine", symbol: "Cl" },
 18: { name: "Argon", symbol: "Ar" },
 19: { name: "Potassium", symbol: "K" },
 20: { name: "Calcium", symbol: "Ca" },
 21: { name: "Scandium", symbol: "Sc" },
 22: { name: "Titanium", symbol: "Ti" },
 23: { name: "Vanadium", symbol: "V" },
 24: { name: "Chromium", symbol: "Cr" },
 25: { name: "Manganese", symbol: "Mn" },
 26: { name: "Iron", symbol: "Fe" },
 27: { name: "Cobalt", symbol: "Co" },
 28: { name: "Nickel", symbol: "Ni" },
 29: { name: "Copper", symbol: "Cu" },
 30: { name: "Zinc", symbol: "Zn" },
 31: { name: "Gallium", symbol: "Ga" },
 32: { name: "Germanium", symbol: "Ge" },
 33: { name: "Arsenic", symbol: "As" },
 34: { name: "Selenium", symbol: "Se" },
 35: { name: "Bromine", symbol: "Br" },
 36: { name: "Krypton", symbol: "Kr" },
 37: { name: "Rubidium", symbol: "Rb" },
 38: { name: "Strontium", symbol: "Sr" },
 39: { name: "Yttrium", symbol: "Y" },
 40: { name: "Zirconium", symbol: "Zr" },
 41: { name: "Niobium", symbol: "Nb" },
 42: { name: "Molybdenum", symbol: "Mo" },
 43: { name: "Technetium", symbol: "Tc" },
 44: { name: "Ruthenium", symbol: "Ru" },
 45: { name: "Rhodium", symbol: "Rh" },
 46: { name: "Palladium", symbol: "Pd" },
 47: { name: "Silver", symbol: "Ag" },
 48: { name: "Cadmium", symbol: "Cd" },
 49: { name: "Indium", symbol: "In" },
 50: { name: "Tin", symbol: "Sn" },
 51: { name: "Antimony", symbol: "Sb" },
 52: { name: "Tellurium", symbol: "Te" },
 53: { name: "Iodine", symbol: "I" },
 54: { name: "Xenon", symbol: "Xe" },
 55: { name: "Caesium", symbol: "Cs" },
 56: { name: "Barium", symbol: "Ba" },
 57: { name: "Lanthanum", symbol: "La" },
 58: { name: "Cerium", symbol: "Ce" },
 59: { name: "Praseodymium", symbol: "Pr" },
 60: { name: "Neodymium", symbol: "Nd" },
 61: { name: "Promethium", symbol: "Pm" },
 62: { name: "Samarium", symbol: "Sm" },
 63: { name: "Europium", symbol: "Eu" },
 64: { name: "Gadolinium", symbol: "Gd" },
 65: { name: "Terbium", symbol: "Tb" },
 66: { name: "Dysprosium", symbol: "Dy" },
 67: { name: "Holmium", symbol: "Ho" },
 68: { name: "Erbium", symbol: "Er" },
 69: { name: "Thulium", symbol: "Tm" },
 70: { name: "Ytterbium", symbol: "Yb" },
 71: { name: "Lutetium", symbol: "Lu" },
 72: { name: "Hafnium", symbol: "Hf" },
 73: { name: "Tantalum", symbol: "Ta" },
 74: { name: "Tungsten", symbol: "W" },
 75: { name: "Rhenium", symbol: "Re" },
 76: { name: "Osmium", symbol: "Os" },
 77: { name: "Iridium", symbol: "Ir" },
 78: { name: "Platinum", symbol: "Pt" },
 79: { name: "Gold", symbol: "Au" },
 80: { name: "Mercury", symbol: "Hg" },
 81: { name: "Thallium", symbol: "Tl" },
 82: { name: "Lead", symbol: "Pb" },
 83: { name: "Bismuth", symbol: "Bi" },
 84: { name: "Polonium", symbol: "Po" },
 85: { name: "Astatine", symbol: "At" },
 86: { name: "Radon", symbol: "Rn" },
 87: { name: "Francium", symbol: "Fr" },
 88: { name: "Radium", symbol: "Ra" },
 89: { name: "Actinium", symbol: "Ac" },
 90: { name: "Thorium", symbol: "Th" },
 91: { name: "Protactinium", symbol: "Pa" },
 92: { name: "Uranium", symbol: "U" },
 93: { name: "Neptunium", symbol: "Np" },
 94: { name: "Plutonium", symbol: "Pu" },
 95: { name: "Americium", symbol: "Am" },
 96: { name: "Curium", symbol: "Cm" },
 97: { name: "Berkelium", symbol: "Bk" },
 98: { name: "Californium", symbol: "Cf" },
 99: { name: "Einsteinium", symbol: "Es" },
 100: { name: "Fermium", symbol: "Fm" },
 101: { name: "Mendelevium", symbol: "Md" },
 102: { name: "Nobelium", symbol: "No" },
 103: { name: "Lawrencium", symbol: "Lr" },
 104: { name: "Rutherfordium", symbol: "Rf" },
 105: { name: "Dubnium", symbol: "Db" },
 106: { name: "Seaborgium", symbol: "Sg" },
 107: { name: "Bohrium", symbol: "Bh" },
 108: { name: "Hassium", symbol: "Hs" },
 109: { name: "Meitnerium", symbol: "Mt" },
 110: { name: "Darmstadtium", symbol: "Ds" },
 111: { name: "Roentgenium", symbol: "Rg" },
 112: { name: "Copernicium", symbol: "Cn" },
 113: { name: "Nihonium", symbol: "Nh" },
 114: { name: "Flerovium", symbol: "Fl" },
 115: { name: "Moscovium", symbol: "Mc" },
 116: { name: "Livermorium", symbol: "Lv" },
 117: { name: "Tennessine", symbol: "Ts" },
 118: { name: "Oganesson", symbol: "Og" },
};

export function elementForProtons(z) {
 const n = Math.max(0, Math.round(Number(z) || 0));
 if (n <= 0) return { name: "?", symbol: "?", z: 0 };
 return ELEMENTS_BY_Z[n] || { name: "beyond this lesson", symbol: "?", z: n };
}

export const chemLabState = {
 heat: 0.45,
 heatTarget: 0.45,
 energy: 0.45,
 energyTarget: 0.45,
 phase: "open",
 mode: "balloon",
 myth: 0,
 mythPhase: "claim",
 mythBusted: false,
 bustedAt: 0,
 reveal: false,
 prompt: "",
 flashColor: 0x38bdf8,
 animDuration: 3200,
 failPulse: 0,
 successPulse: 0,
 tokenProgress: 0,
 sortPlaced: 0,
 placed: {},
 selectedId: null,
 masteryStep: 0,
 scale: 0,
 reducedMotion: false,
 elemKind: "iron",
 elemPhase: "shelf",
 wireStretch: 0,
 o2Split: 0,
 huntFound: {},
 bondSnap: 0,
 magnetGap: 1,
 dropMerge: 0,
 bondKind: "ionic",
 zoomClick: 0,
 panelTemp: 0.45,
 caption: "",
 build: { o: false, hL: false, hR: false, snapped: false },
 formulaStep: 0,
 protons: 0,
 neutrons: 0,
 electrons: 0,
 builderChallenge: 1,
 explodeZ: 0,
 sparkAt: 0,
 sparkDone: false,
 eqStep: 0,
 spiralStop: 0,
 spiralUntil: 0,
 spiralFinish: false,
 zoomFlashUntil: 0,
 builderMode: "tiny",
 huntShells: [0, 0, 0],
 huntSnaps: [],
 huntSmear: 0,
 huntOrbital: "s",
 huntRotX: 0.35,
 huntRotY: 0.4,
 huntAutoRotate: true,
 huntPLobes: [true, false, false],
 huntDIndex: 0,
 huntFillZ: 1,
 huntInspectZ: 0,
 huntInspectAt: 0,
 huntFamily: "",
 huntSpun: { s: false, p: false, d: false },
 huntStops: { ne: false, na: false, cl: false },
 huntBegin: false,
 huntBounce: null,
};

if (typeof window !== "undefined") {
 window.__chemMirror = (s) => {
 if (!s) return;
 if (s.heat != null) {
 chemLabState.heat = s.heat;
 chemLabState.heatTarget = s.heat;
 }
 if (s.energy != null) {
 chemLabState.energy = s.energy;
 chemLabState.energyTarget = s.energy;
 }
 if (s.placed != null && s.placedVersion != null && s.placedVersion !== chemLabState._placedVersion) {
 chemLabState.placed = { ...s.placed };
 chemLabState.sortPlaced = Object.keys(s.placed).length;
 chemLabState._placedVersion = s.placedVersion;
 }
 if (s.selectedId !== undefined) chemLabState.selectedId = s.selectedId;
 if (s.reveal != null) chemLabState.reveal = s.reveal;
 if (s.tokenOrder) chemLabState.tokenProgress = s.tokenOrder.length;
 if (s.masteryOrder) chemLabState.masteryStep = s.masteryOrder.length;
 if (s.mythIndex != null) chemLabState.myth = s.mythIndex;
 if (s.mythPhase) chemLabState.mythPhase = s.mythPhase;
 if (s.bustedAt != null) chemLabState.bustedAt = s.bustedAt;
 chemLabState.mythBusted = s.mythPhase === "truth";
 if (s.prompt != null) chemLabState.prompt = s.prompt;
 if (s.mode) chemLabState.mode = s.mode;
 if (s.phase) chemLabState.phase = s.phase;
 if (s.scale != null) chemLabState.scale = s.scale;
 };
}

export function resetTinyBitsState() {
 chemLabState.zoomClick = 0;
 chemLabState.panelTemp = 0.45;
 chemLabState.heat = 0.45;
 chemLabState.heatTarget = 0.45;
 chemLabState.energy = 0.45;
 chemLabState.energyTarget = 0.45;
 chemLabState.caption = "";
 chemLabState.build = { o: false, hL: false, hR: false, snapped: false };
 chemLabState.formulaStep = 0;
 chemLabState.protons = 0;
 chemLabState.neutrons = 0;
 chemLabState.electrons = 0;
 chemLabState.builderChallenge = 1;
 chemLabState.explodeZ = 0;
 chemLabState.sparkAt = 0;
 chemLabState.sparkDone = false;
 chemLabState.eqStep = 0;
 chemLabState.spiralStop = 0;
 chemLabState.spiralUntil = 0;
 chemLabState.spiralFinish = false;
 chemLabState.zoomFlashUntil = 0;
 chemLabState.placed = {};
 chemLabState.sortPlaced = 0;
 chemLabState.selectedId = null;
 chemLabState.reveal = false;
 chemLabState.phase = "open";
 chemLabState.builderMode = "tiny";
}

export function resetElementHuntState() {
 chemLabState.protons = 0;
 chemLabState.neutrons = 0;
 chemLabState.electrons = 0;
 chemLabState.builderChallenge = 1;
 chemLabState.builderMode = "hunt";
 chemLabState.huntShells = [0, 0, 0];
 chemLabState.huntSnaps = [];
 chemLabState.huntSmear = 0;
 chemLabState.huntOrbital = "s";
 chemLabState.huntRotX = 0.35;
 chemLabState.huntRotY = 0.4;
 chemLabState.huntAutoRotate = true;
 chemLabState.huntPLobes = [true, false, false];
 chemLabState.huntDIndex = 0;
 chemLabState.huntFillZ = 1;
 chemLabState.huntInspectZ = 0;
 chemLabState.huntInspectAt = 0;
 chemLabState.huntFamily = "";
 chemLabState.huntSpun = { s: false, p: false, d: false };
 chemLabState.huntStops = { ne: false, na: false, cl: false };
 chemLabState.huntBegin = false;
 chemLabState.huntBounce = null;
 chemLabState.spiralStop = 0;
 chemLabState.spiralUntil = 0;
 chemLabState.spiralFinish = false;
 chemLabState.eqStep = 0;
 chemLabState.scale = 0;
 chemLabState.placed = {};
 chemLabState.selectedId = null;
 chemLabState.phase = "open";
}

export function easeOutCubic(t) {
 const x = Math.min(1, Math.max(0, t));
 return 1 - Math.pow(1 - x, 3);
}

export function easeInOutQuad(t) {
 const x = Math.min(1, Math.max(0, t));
 return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

export function setHeatTarget(h) {
 const v = Math.max(0, Math.min(1, h));
 chemLabState.heatTarget = v;
 chemLabState.energyTarget = v;
}

export function pulseFailFeedback(ms = 420) {
 chemLabState.failPulse = performance.now() + ms;
}

export function pulseSuccessFeedback(ms = 380) {
 chemLabState.successPulse = performance.now() + ms;
}

function lerpHeat() {
 chemLabState.heat += (chemLabState.heatTarget - chemLabState.heat) * 0.18;
 chemLabState.energy += (chemLabState.energyTarget - chemLabState.energy) * 0.18;
}

function hexToRgb(hex) {
 const n = typeof hex === "number" ? hex : parseInt(String(hex).replace("#", ""), 16);
 return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: (n >> 0) & 255 };
}

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

/** Reusable tiny-bit sprite used across all four spirals. */
export function drawDot(ctx, x, y, r, color, glow = true) {
 const { r: cr, g: cg, b: cb } = hexToRgb(color);
 if (glow) {
 const g = ctx.createRadialGradient(x, y, 0, x, y, r * 2.2);
 g.addColorStop(0, `rgba(${cr},${cg},${cb},0.42)`);
 g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
 ctx.fillStyle = g;
 ctx.beginPath();
 ctx.arc(x, y, r * 2.2, 0, Math.PI * 2);
 ctx.fill();
 }
 const core = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.08, x, y, r);
 core.addColorStop(0, "#f8fafc");
 core.addColorStop(0.38, `rgb(${cr},${cg},${cb})`);
 core.addColorStop(1, `rgb(${Math.max(0, cr - 50)},${Math.max(0, cg - 50)},${Math.max(0, cb - 30)})`);
 ctx.fillStyle = core;
 ctx.beginPath();
 ctx.arc(x, y, r, 0, Math.PI * 2);
 ctx.fill();
}

/** Joined H₂O unit (Mickey-mouse bent shape). */
export function drawH2O(ctx, x, y, scale = 1, rot = 0) {
 ctx.save();
 ctx.translate(x, y);
 ctx.rotate(rot);
 const s = scale;
 drawDot(ctx, 0, 0, 7.2 * s, 0xf87171, false);
 drawDot(ctx, -11 * s, 7.5 * s, 4.6 * s, 0x60a5fa, false);
 drawDot(ctx, 11 * s, 7.5 * s, 4.6 * s, 0x60a5fa, false);
 ctx.strokeStyle = "rgba(226,232,240,0.55)";
 ctx.lineWidth = 1.4 * s;
 ctx.beginPath();
 ctx.moveTo(-3 * s, 2 * s);
 ctx.lineTo(-8 * s, 6 * s);
 ctx.moveTo(3 * s, 2 * s);
 ctx.lineTo(8 * s, 6 * s);
 ctx.stroke();
 ctx.restore();
}

function drawO2(ctx, x, y, scale = 1, rot = 0) {
 ctx.save();
 ctx.translate(x, y);
 ctx.rotate(rot);
 drawDot(ctx, -8 * scale, 0, 6.5 * scale, 0xf87171, false);
 drawDot(ctx, 8 * scale, 0, 6.5 * scale, 0xf87171, false);
 ctx.strokeStyle = "rgba(226,232,240,0.6)";
 ctx.lineWidth = 2 * scale;
 ctx.beginPath();
 ctx.moveTo(-2 * scale, -2.5 * scale);
 ctx.lineTo(2 * scale, -2.5 * scale);
 ctx.moveTo(-2 * scale, 2.5 * scale);
 ctx.lineTo(2 * scale, 2.5 * scale);
 ctx.stroke();
 ctx.restore();
}

function drawCO2(ctx, x, y, scale = 1, rot = 0) {
 ctx.save();
 ctx.translate(x, y);
 ctx.rotate(rot);
 drawDot(ctx, 0, 0, 6.5 * scale, 0x94a3b8, false);
 drawDot(ctx, -16 * scale, 0, 5.8 * scale, 0xf87171, false);
 drawDot(ctx, 16 * scale, 0, 5.8 * scale, 0xf87171, false);
 ctx.strokeStyle = "rgba(226,232,240,0.55)";
 ctx.lineWidth = 1.6 * scale;
 ctx.beginPath();
 ctx.moveTo(-8 * scale, 0);
 ctx.lineTo(-11 * scale, 0);
 ctx.moveTo(8 * scale, 0);
 ctx.lineTo(11 * scale, 0);
 ctx.stroke();
 ctx.restore();
}

function drawGlucose(ctx, x, y, scale = 1, t = 0) {
 ctx.save();
 ctx.translate(x, y);
 ctx.rotate(t * 0.15);
 const n = 6;
 for (let i = 0; i < n; i++) {
 const a = (i / n) * Math.PI * 2 - Math.PI / 2;
 const px = Math.cos(a) * 16 * scale;
 const py = Math.sin(a) * 16 * scale;
 drawDot(ctx, px, py, 5.2 * scale, i % 2 ? 0xf87171 : 0x94a3b8, false);
 }
 ctx.restore();
}

function drawH2(ctx, x, y, scale = 1, rot = 0) {
 ctx.save();
 ctx.translate(x, y);
 ctx.rotate(rot);
 drawDot(ctx, -6 * scale, 0, 4.8 * scale, 0x60a5fa, false);
 drawDot(ctx, 6 * scale, 0, 4.8 * scale, 0x60a5fa, false);
 ctx.strokeStyle = "rgba(226,232,240,0.55)";
 ctx.lineWidth = 1.4 * scale;
 ctx.beginPath();
 ctx.moveTo(-2 * scale, 0);
 ctx.lineTo(2 * scale, 0);
 ctx.stroke();
 ctx.restore();
}

function drawLabel(ctx, text, x, y, opts = {}) {
 ctx.font = opts.font || "600 13px Segoe UI, system-ui, sans-serif";
 const tw = ctx.measureText(text).width;
 const padX = 10;
 const bw = tw + padX * 2;
 const bh = opts.h || 24;
 const bx = x - bw / 2;
 const by = y - bh / 2;
 ctx.fillStyle = opts.bg || "rgba(8,47,73,0.88)";
 roundRect(ctx, bx, by, bw, bh, 9);
 ctx.fill();
 ctx.strokeStyle = opts.border || "rgba(125,211,252,0.45)";
 ctx.lineWidth = 1.3;
 ctx.stroke();
 ctx.fillStyle = opts.color || "#e0f2fe";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(text, x, y + 1);
}

function failShake() {
 const until = chemLabState.failPulse;
 if (!until || performance.now() > until) return 0;
 return Math.sin(performance.now() * 0.08) * 6;
}

function successFlash(ctx, w, h) {
 const until = chemLabState.successPulse;
 if (!until || performance.now() > until) return;
 const a = Math.max(0, (until - performance.now()) / 380) * 0.25;
 ctx.fillStyle = `rgba(52,211,153,${a})`;
 ctx.fillRect(0, 0, w, h);
}

function failFlash(ctx, w, h) {
 const until = chemLabState.failPulse;
 if (!until || performance.now() > until) return;
 const a = Math.max(0, (until - performance.now()) / 420) * 0.28;
 ctx.fillStyle = `rgba(248,113,113,${a})`;
 ctx.fillRect(0, 0, w, h);
}

function fillNight(ctx, w, h) {
 const g = ctx.createLinearGradient(0, 0, 0, h);
 g.addColorStop(0, "#0c4a6e");
 g.addColorStop(0.5, "#082f49");
 g.addColorStop(1, "#0f172a");
 ctx.fillStyle = g;
 ctx.fillRect(0, 0, w, h);
}

function drawCaptionBar(ctx, w, h, text) {
 if (!text) return;
 ctx.font = "600 13px Segoe UI, system-ui, sans-serif";
 const pad = 12;
 const maxW = w - 32;
 const words = String(text).split(" ");
 const lines = [];
 let line = "";
 for (const word of words) {
 const next = line ? `${line} ${word}` : word;
 if (ctx.measureText(next).width > maxW && line) {
 lines.push(line);
 line = word;
 } else line = next;
 }
 if (line) lines.push(line);
 const bh = 16 + lines.length * 18;
 roundRect(ctx, 12, h - bh - 10, w - 24, bh, 10);
 ctx.fillStyle = "rgba(8,47,73,0.82)";
 ctx.fill();
 ctx.fillStyle = "#e0f2fe";
 ctx.textAlign = "center";
 ctx.textBaseline = "top";
 lines.forEach((ln, i) => ctx.fillText(ln, w / 2, h - bh - 2 + pad + i * 18));
}

/** Sunlit room + glass of water (opening / zoom-out). */
function drawSunlitRoom(ctx, w, h, t, opts = {}) {
 const focus = opts.focus || 0;
 ctx.fillStyle = "#c4b5a0";
 ctx.fillRect(0, 0, w, h);
 const wall = ctx.createLinearGradient(0, 0, 0, h * 0.62);
 wall.addColorStop(0, "#d6c4a8");
 wall.addColorStop(1, "#b9a48a");
 ctx.fillStyle = wall;
 ctx.fillRect(0, 0, w, h * 0.62);

 const wx = w * 0.58;
 const wy = h * 0.06;
 const ww = w * 0.32;
 const wh = h * 0.38;
 roundRect(ctx, wx, wy, ww, wh, 6);
 ctx.fillStyle = "#7dd3fc";
 ctx.fill();
 const sky = ctx.createLinearGradient(wx, wy, wx, wy + wh);
 sky.addColorStop(0, "#bae6fd");
 sky.addColorStop(1, "#38bdf8");
 ctx.fillStyle = sky;
 ctx.fill();
 ctx.strokeStyle = "#f8fafc";
 ctx.lineWidth = 8;
 ctx.stroke();
 ctx.beginPath();
 ctx.moveTo(wx + ww / 2, wy);
 ctx.lineTo(wx + ww / 2, wy + wh);
 ctx.moveTo(wx, wy + wh / 2);
 ctx.lineTo(wx + ww, wy + wh / 2);
 ctx.strokeStyle = "rgba(248,250,252,0.85)";
 ctx.lineWidth = 5;
 ctx.stroke();

 ctx.save();
 ctx.beginPath();
 ctx.moveTo(wx + 8, wy + 10);
 ctx.lineTo(w * 0.22, h * 0.92);
 ctx.lineTo(w * 0.48, h * 0.92);
 ctx.lineTo(wx + ww - 10, wy + 14);
 ctx.closePath();
 const beam = ctx.createLinearGradient(wx, wy, w * 0.3, h);
 beam.addColorStop(0, "rgba(254,243,199,0.38)");
 beam.addColorStop(1, "rgba(254,243,199,0)");
 ctx.fillStyle = beam;
 ctx.fill();
 ctx.restore();

 const nDust = opts.reduced ? 8 : 28;
 for (let i = 0; i < nDust; i++) {
 const dx = w * 0.28 + ((i * 47) % (w * 0.42)) + Math.sin(t * 0.4 + i) * 8;
 const dy = h * 0.18 + ((i * 31) % (h * 0.55)) + Math.cos(t * 0.35 + i * 0.7) * 6;
 ctx.fillStyle = `rgba(255,251,235,${0.25 + (i % 5) * 0.08})`;
 ctx.beginPath();
 ctx.arc(dx, dy, 1.2 + (i % 3) * 0.4, 0, Math.PI * 2);
 ctx.fill();
 }

 ctx.fillStyle = "#6b4f32";
 ctx.fillRect(0, h * 0.68, w, h * 0.32);
 ctx.fillStyle = "#8b6914";
 roundRect(ctx, w * 0.06, h * 0.62, w * 0.88, h * 0.1, 4);
 ctx.fill();
 ctx.fillStyle = "rgba(253,230,138,0.25)";
 ctx.fillRect(w * 0.06, h * 0.62, w * 0.88, 4);

 const gx = w * (0.32 - focus * 0.08);
 const gy = h * (0.52 - focus * 0.12);
 const gs = (0.9 + focus * 1.4) * Math.min(w, h) / 420;
 drawWaterGlass(ctx, gx, gy, gs, t);
}

function drawWaterGlass(ctx, x, y, s, t) {
 ctx.save();
 ctx.translate(x, y);
 ctx.scale(s, s);
 ctx.beginPath();
 ctx.moveTo(-42, -70);
 ctx.lineTo(-50, 70);
 ctx.quadraticCurveTo(0, 86, 50, 70);
 ctx.lineTo(42, -70);
 ctx.closePath();
 ctx.fillStyle = "rgba(186,230,253,0.18)";
 ctx.fill();
 ctx.strokeStyle = "rgba(224,242,254,0.85)";
 ctx.lineWidth = 4;
 ctx.stroke();
 ctx.beginPath();
 ctx.moveTo(-40, -8);
 ctx.lineTo(-46, 62);
 ctx.quadraticCurveTo(0, 76, 46, 62);
 ctx.lineTo(40, -8);
 ctx.closePath();
 const water = ctx.createLinearGradient(0, -8, 0, 76);
 water.addColorStop(0, "rgba(56,189,248,0.28)");
 water.addColorStop(1, "rgba(14,116,144,0.55)");
 ctx.fillStyle = water;
 ctx.fill();
 ctx.strokeStyle = "rgba(125,211,252,0.45)";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.ellipse(0, -8, 40, 8, 0, 0, Math.PI * 2);
 ctx.stroke();
 ctx.fillStyle = "rgba(255,255,255,0.35)";
 ctx.beginPath();
 ctx.ellipse(0, -70, 42, 9, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "rgba(255,255,255,0.55)";
 ctx.stroke();
 const rimX = 28;
 const rimY = -66;
 ctx.fillStyle = "rgba(125,211,252,0.85)";
 ctx.beginPath();
 ctx.ellipse(rimX, rimY, 9 + Math.sin(t) * 0.6, 6, -0.4, 0, Math.PI * 2);
 ctx.fill();
 ctx.restore();
}

function makeDots(n, mode, w, h) {
 const dots = [];
 const cols = Math.ceil(Math.sqrt(n * 1.2));
 const rows = Math.ceil(n / cols);
 for (let i = 0; i < n; i++) {
 const col = i % cols;
 const row = Math.floor(i / cols);
 let x;
 let y;
 if (mode === "steam") {
 x = 20 + Math.random() * (w - 40);
 y = 20 + Math.random() * (h - 40);
 } else {
 x = 24 + (col + 0.5) * ((w - 48) / cols) + (mode === "water" ? (Math.random() - 0.5) * 10 : 0);
 y = 28 + (row + 0.5) * ((h - 56) / rows);
 }
 dots.push({
 x,
 y,
 hx: x,
 hy: y,
 vx: (Math.random() - 0.5) * (mode === "steam" ? 2.2 : 0.4),
 vy: (Math.random() - 0.5) * (mode === "steam" ? 2.2 : 0.4),
 phase: Math.random() * Math.PI * 2,
 r: 3.2 + (i % 4) * 0.45,
 });
 }
 return dots;
}

function stepDots(dots, mode, w, h, t, reduced) {
 const jig = reduced ? 0.15 : 1;
 for (const d of dots) {
 if (mode === "ice") {
 d.x = d.hx + Math.sin(t * 3 + d.phase) * 1.1 * jig;
 d.y = d.hy + Math.cos(t * 2.4 + d.phase) * 0.9 * jig;
 } else if (mode === "water") {
 d.vx += (Math.random() - 0.5) * 0.08;
 d.vy += (Math.random() - 0.5) * 0.08;
 d.vx *= 0.96;
 d.vy *= 0.96;
 d.x += d.vx * jig;
 d.y += d.vy * jig;
 if (d.x < 12) { d.x = 12; d.vx *= -1; }
 if (d.x > w - 12) { d.x = w - 12; d.vx *= -1; }
 if (d.y < 18) { d.y = 18; d.vy *= -1; }
 if (d.y > h - 18) { d.y = h - 18; d.vy *= -1; }
 } else {
 d.vx += (Math.random() - 0.5) * 0.25;
 d.vy += (Math.random() - 0.5) * 0.25 - 0.01;
 d.vx *= 0.99;
 d.vy *= 0.99;
 d.x += d.vx * 1.6 * jig;
 d.y += d.vy * 1.6 * jig;
 if (d.x < 8 || d.x > w - 8) d.vx *= -1;
 if (d.y < 8 || d.y > h - 8) d.vy *= -1;
 d.x = Math.max(8, Math.min(w - 8, d.x));
 d.y = Math.max(8, Math.min(h - 8, d.y));
 }
 }
}

function drawDotField(ctx, dots, color = 0x7dd3fc) {
 for (const d of dots) drawDot(ctx, d.x, d.y, d.r, color, false);
}

function makeMolField(n, mode, w, h) {
 const mols = [];
 const cols = Math.ceil(Math.sqrt(n));
 const rows = Math.ceil(n / cols);
 for (let i = 0; i < n; i++) {
 const col = i % cols;
 const row = Math.floor(i / cols);
 const x = 28 + (col + 0.5) * ((w - 56) / cols);
 const y = 36 + (row + 0.5) * ((h - 72) / rows);
 mols.push({
 x,
 y,
 hx: x,
 hy: y,
 vx: (Math.random() - 0.5) * 0.5,
 vy: (Math.random() - 0.5) * 0.5,
 rot: Math.random() * Math.PI,
 phase: i,
 escaped: false,
 });
 }
 return mols;
}

function stepMols(mols, heat, w, h, reduced) {
 const jig = reduced ? 0.2 : 1;
 const ice = heat < 0.33;
 const gas = heat > 0.72;
 for (const m of mols) {
 if (ice) {
 m.x = m.hx + Math.sin(performance.now() / 400 + m.phase) * 1.2 * jig;
 m.y = m.hy + Math.cos(performance.now() / 450 + m.phase) * 1.0 * jig;
 m.rot += 0.002;
 m.escaped = false;
 } else if (!gas) {
 m.vx += (Math.random() - 0.5) * 0.07;
 m.vy += (Math.random() - 0.5) * 0.07;
 m.vx *= 0.97;
 m.vy *= 0.97;
 m.x += m.vx * (0.6 + heat) * jig;
 m.y += m.vy * (0.6 + heat) * jig;
 m.rot += 0.02 * jig;
 if (m.x < 18) { m.x = 18; m.vx *= -1; }
 if (m.x > w - 18) { m.x = w - 18; m.vx *= -1; }
 if (m.y < 28) { m.y = 28; m.vy *= -1; }
 if (m.y > h - 36) { m.y = h - 36; m.vy *= -1; }
 m.escaped = false;
 } else {
 m.vx += (Math.random() - 0.5) * 0.2;
 m.vy += (Math.random() - 0.5) * 0.2 - 0.04;
 m.x += m.vx * 2 * jig;
 m.y += m.vy * 2 * jig;
 m.rot += 0.05;
 if (m.y < -20) {
 m.y = h + 10;
 m.x = 20 + Math.random() * (w - 40);
 m.escaped = true;
 }
 if (m.x < 8) m.vx = Math.abs(m.vx);
 if (m.x > w - 8) m.vx = -Math.abs(m.vx);
 }
 }
}

function drawBohr(ctx, cx, cy, z, scale = 1, t = 0) {
 const el = elementForProtons(z);
 const eCount = z;
 const pCount = z;
 const nCount = z <= 1 ? 0 : z;
 ctx.save();
 ctx.translate(cx, cy);
 ctx.scale(scale, scale);
 ctx.strokeStyle = "rgba(125,211,252,0.35)";
 ctx.lineWidth = 1.2;
 ctx.beginPath();
 ctx.arc(0, 0, 28, 0, Math.PI * 2);
 ctx.stroke();
 if (eCount > 2) {
 ctx.beginPath();
 ctx.arc(0, 0, 46, 0, Math.PI * 2);
 ctx.stroke();
 }
 for (let i = 0; i < Math.min(pCount, 8); i++) {
 const a = (i / Math.max(1, Math.min(pCount, 8))) * Math.PI * 2;
 drawDot(ctx, Math.cos(a) * 5, Math.sin(a) * 5, 3.2, 0xfb7185, false);
 }
 const e1 = Math.min(2, eCount);
 const e2 = Math.max(0, Math.min(8, eCount - 2));
 const e3 = Math.max(0, eCount - 10);
 if (eCount > 10) {
 ctx.beginPath();
 ctx.arc(0, 0, 64, 0, Math.PI * 2);
 ctx.stroke();
 }
 for (let i = 0; i < e1; i++) {
 const a = t * 1.6 + (i / Math.max(1, e1)) * Math.PI * 2;
 drawDot(ctx, Math.cos(a) * 28, Math.sin(a) * 28, 2.4, 0x38bdf8, false);
 }
 for (let i = 0; i < e2; i++) {
 const a = -t * 1.1 + (i / Math.max(1, e2)) * Math.PI * 2;
 drawDot(ctx, Math.cos(a) * 46, Math.sin(a) * 46, 2.4, 0x38bdf8, false);
 }
 for (let i = 0; i < e3; i++) {
 const a = t * 0.9 + (i / Math.max(1, e3)) * Math.PI * 2;
 drawDot(ctx, Math.cos(a) * 64, Math.sin(a) * 64, 2.4, 0x38bdf8, false);
 }
 ctx.restore();
 return { el, nCount };
}

function drawZoomCounter(ctx, w, click) {
 const labels = ["×1", "×10", "×100", "×1,000", "×100,000", "×10,000,000"];
 drawLabel(ctx, labels[Math.max(0, Math.min(5, click))] || "×1", w - 78, 22, {
 font: "700 13px Segoe UI, sans-serif",
 });
}

export const ZOOM_LEVEL_LABELS = ["×1", "×10", "×100", "×1,000", "×100,000", "×10,000,000"];

function wrapText(ctx, text, x, y, maxW, lh) {
 const words = String(text).split(" ");
 let line = "";
 let yy = y;
 ctx.textAlign = "center";
 ctx.textBaseline = "top";
 for (const word of words) {
 const next = line ? `${line} ${word}` : word;
 if (ctx.measureText(next).width > maxW && line) {
 ctx.fillText(line, x, yy);
 yy += lh;
 line = word;
 } else line = next;
 }
 if (line) ctx.fillText(line, x, yy);
}

/**
 * @param {*} arena createArena2D result
 */
export function registerAtomScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("tinyOpen", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions } = api;
 const start = performance.now();
 setDescription("A glass of water on a table, sunlight, dust motes. Ready to zoom in.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 ctx.save();
 ctx.translate(failShake(), 0);
 drawSunlitRoom(ctx, w, h, t, { reduced: api.reducedMotion });
 drawLabel(ctx, "Look around you", w * 0.5, 28);
 const pulse = 0.92 + Math.sin(t * 3) * 0.08;
 const bw = 160 * pulse;
 const bh = 44 * pulse;
 roundRect(ctx, w * 0.5 - bw / 2, h * 0.88 - bh / 2, bw, bh, 14);
 ctx.fillStyle = "rgba(14,165,233,0.92)";
 ctx.fill();
 ctx.fillStyle = "#f0f9ff";
 ctx.font = "700 16px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText("Zoom In →", w * 0.5, h * 0.88);
 ctx.restore();
 setHitRegions([
 { id: "zoom-in", shape: "rect", x: w * 0.5, y: h * 0.88, w: 170, h: 50, meta: { action: "zoomIn" } },
 ]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("tinyZoom", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions } = api;
 const start = performance.now();
 let display = chemLabState.zoomClick || 0;
 let field = [];
 let fieldKey = "";
 setDescription("The Infinite Zoom Tool. Each click zooms 10× further into the water.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 const target = Math.max(0, Math.min(5, chemLabState.zoomClick || 0));
 display += (target - display) * (api.reducedMotion ? 1 : 0.12);
 const z = display;
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);

 if (z < 0.95) {
 const focus = z * 0.35;
 drawSunlitRoom(ctx, w, h, t, { focus, reduced: api.reducedMotion });
 ctx.save();
 ctx.globalAlpha = Math.min(1, z * 1.4);
 fillNight(ctx, w, h);
 drawWaterGlass(ctx, w * 0.5, h * 0.52, Math.min(w, h) / 220 * (1.1 + z * 0.8), t);
 ctx.restore();
 }

 if (z >= 0.6 && z < 2.2) {
 const a = Math.min(1, (z - 0.6) / 1.2);
 ctx.save();
 ctx.globalAlpha = a;
 const g = ctx.createRadialGradient(w * 0.5, h * 0.45, 10, w * 0.5, h * 0.45, w * 0.45);
 g.addColorStop(0, "rgba(56,189,248,0.55)");
 g.addColorStop(1, "rgba(8,47,73,0.4)");
 ctx.fillStyle = g;
 ctx.fillRect(0, 0, w, h);
 ctx.fillStyle = "rgba(186,230,253,0.5)";
 ctx.beginPath();
 ctx.ellipse(w * 0.5, h * 0.48, 90 + z * 20, 70 + z * 16, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.restore();
 }

 if (z >= 1.6 && z < 3.4) {
 const a = Math.min(1, (z - 1.6) / 0.9);
 ctx.save();
 ctx.globalAlpha = a;
 fillNight(ctx, w, h);
 for (let i = 0; i < 80; i++) {
 const gx = (i * 73) % w;
 const gy = (i * 51) % h;
 const n = 0.35 + Math.sin(t * 2 + i) * 0.08;
 ctx.fillStyle = `rgba(125,211,252,${0.15 + n * a})`;
 ctx.beginPath();
 ctx.arc(gx, gy, 4 + (i % 5), 0, Math.PI * 2);
 ctx.fill();
 }
 ctx.restore();
 }

 if (z >= 3.2) {
 const key = `${w|0}x${h|0}`;
 if (fieldKey !== key) {
 field = makeDots(90, "water", w, h);
 fieldKey = key;
 }
 stepDots(field, "water", w, h, t, api.reducedMotion);
 const a = Math.min(1, (z - 3.2) / 0.8);
 ctx.save();
 ctx.globalAlpha = a;
 fillNight(ctx, w, h);
 const waterH = h * (z >= 4.5 ? 0.72 : 0.92);
 ctx.fillStyle = "rgba(14,116,144,0.25)";
 ctx.fillRect(0, 0, w, waterH);
 for (const d of field) {
 if (z >= 4.5 && d.y < h * 0.22) {
 d.x += Math.sin(t + d.phase) * 0.4;
 }
 drawDot(ctx, d.x, d.y, d.r * (0.9 + a * 0.3), 0x7dd3fc, false);
 }
 if (z >= 4.5) {
 ctx.fillStyle = "rgba(186,230,253,0.08)";
 ctx.fillRect(0, 0, w, h * 0.2);
 drawLabel(ctx, "water meets air", w * 0.5, 36);
 }
 ctx.restore();
 }

 if (target === 4 && performance.now() < (chemLabState.zoomFlashUntil || 0)) {
 const a = Math.max(0, (chemLabState.zoomFlashUntil - performance.now()) / 1800);
 ctx.fillStyle = `rgba(254,243,199,${0.18 * a})`;
 ctx.fillRect(0, 0, w, h);
 drawLabel(ctx, "Whoa: we’re now smaller than a speck of dust…", w * 0.5, h * 0.12, {
 font: "700 14px Segoe UI, sans-serif",
 h: 32,
 });
 }

 drawZoomCounter(ctx, w, target);

 const plusX = w * 0.5;
 const plusY = h - 36;
 roundRect(ctx, plusX - 28, plusY - 20, 56, 40, 12);
 ctx.fillStyle = "rgba(14,165,233,0.9)";
 ctx.fill();
 ctx.fillStyle = "#f0f9ff";
 ctx.font = "800 22px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText("+", plusX, plusY);
 ctx.restore();

 setHitRegions([
 { id: "zoom-plus", shape: "rect", x: plusX, y: plusY, w: 64, h: 44, meta: { action: "zoom" } },
 ]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("tinyStates", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 const start = performance.now();
 const fields = { ice: [], water: [], steam: [] };
 let key = "";
 setDescription("Ice, water, and steam: the same tiny bits, three dances.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 const k = `${w|0}x${h|0}`;
 if (k !== key) {
 const pw = w / 3 - 16;
 const ph = h - 70;
 fields.ice = makeDots(48, "ice", pw, ph);
 fields.water = makeDots(48, "water", pw, ph);
 fields.steam = makeDots(36, "steam", pw, ph);
 key = k;
 }
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 const labels = ["Packed & still", "Close & sliding", "Far apart & fast"];
 const modes = ["ice", "water", "steam"];
 const titles = ["Ice cube", "Water", "Steam"];
 const temp = chemLabState.panelTemp ?? 0.45;
 for (let i = 0; i < 3; i++) {
 const x0 = 8 + i * (w / 3);
 const pw = w / 3 - 16;
 const ph = h - 78;
 roundRect(ctx, x0, 36, pw, ph, 12);
 ctx.fillStyle = "rgba(15,23,42,0.55)";
 ctx.fill();
 ctx.strokeStyle = "rgba(125,211,252,0.3)";
 ctx.stroke();
 ctx.save();
 ctx.beginPath();
 roundRect(ctx, x0, 36, pw, ph, 12);
 ctx.clip();
 ctx.translate(x0, 36);
 let mode = modes[i];
 if (i === 1) mode = temp < 0.28 ? "ice" : temp > 0.78 ? "steam" : "water";
 stepDots(fields[modes[i]], mode, pw, ph, t, api.reducedMotion);
 drawDotField(ctx, fields[modes[i]], 0x7dd3fc);
 ctx.restore();
 drawLabel(ctx, titles[i], x0 + pw / 2, 22, { font: "700 12px Segoe UI, sans-serif" });
 drawLabel(ctx, labels[i], x0 + pw / 2, h - 22, { font: "600 11px Segoe UI, sans-serif" });
 }
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("tinyAtomName", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 const start = performance.now();
 const field = [];
 setDescription("This tiny bit has a name: an atom.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 if (!field.length) {
 const tmp = makeDots(40, "water", w, h);
 field.push(...tmp);
 }
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 stepDots(field, "water", w, h, t, api.reducedMotion);
 for (let i = 1; i < field.length; i++) drawDot(ctx, field[i].x, field[i].y, field[i].r * 0.7, 0x38bdf8, false);
 const cx = w * 0.5;
 const cy = h * 0.46;
 const glow = 18 + Math.sin(t * 2) * 3;
 drawDot(ctx, cx, cy, glow, 0x7dd3fc, true);
 ctx.strokeStyle = "rgba(250,250,255,0.7)";
 ctx.lineWidth = 3;
 ctx.beginPath();
 ctx.arc(cx, cy, glow + 8, 0, Math.PI * 2);
 ctx.stroke();
 drawLabel(ctx, "This tiny bit has a name: an atom.", cx, h * 0.78, {
 font: "700 14px Segoe UI, sans-serif",
 h: 30,
 });
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("tinyCrowd", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 const start = performance.now();
 const colors = [0xf87171, 0x60a5fa, 0x94a3b8, 0xfbbf24];
 let dots = [];
 let key = "";
 setDescription("Wait: these dots aren’t all the same color…");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 const k = `${w|0}x${h|0}`;
 if (k !== key) {
 dots = makeDots(56, "water", w, h).map((d, i) => ({ ...d, color: colors[i % 4] }));
 key = k;
 }
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 stepDots(dots, "water", w, h, t, api.reducedMotion);
 for (const d of dots) drawDot(ctx, d.x, d.y, d.r + 1.2, d.color, false);
 drawLabel(ctx, "Wait: these dots aren’t all the same color…", w * 0.5, 28, { h: 28 });
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("tinySort", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const colors = {
 r: 0xf87171,
 b: 0x60a5fa,
 g: 0x94a3b8,
 };
 const ids = ["r1", "r2", "r3", "b1", "b2", "b3", "g1", "g2", "g3"];
 const balls = ids.map((id) => ({
 id,
 kind: id[0],
 x: 80,
 y: 80,
 laidOut: false,
 }));
 setDescription("Sort the tiny bits into matching-color bins.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DRAG" && intent.meta?.chipId) {
 const ball = balls.find((b) => b.id === intent.meta.chipId);
 if (ball && !chemLabState.placed[ball.id]) {
 ball.x = intent.x;
 ball.y = intent.y;
 }
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 const bins = [
 { id: "red", label: "Red", x: w * 0.18, color: 0xf87171 },
 { id: "blue", label: "Blue", x: w * 0.5, color: 0x60a5fa },
 { id: "grey", label: "Grey", x: w * 0.82, color: 0x94a3b8 },
 ];
 const binY = h - 58;
 const hits = [];
 for (const bin of bins) {
 roundRect(ctx, bin.x - 70, binY - 32, 140, 64, 12);
 ctx.fillStyle = "rgba(15,23,42,0.7)";
 ctx.fill();
 ctx.strokeStyle = `rgba(255,255,255,0.25)`;
 ctx.stroke();
 drawDot(ctx, bin.x - 36, binY, 10, bin.color, false);
 ctx.fillStyle = "#e0f2fe";
 ctx.font = "700 13px Segoe UI, sans-serif";
 ctx.textAlign = "left";
 ctx.textBaseline = "middle";
 ctx.fillText(bin.label, bin.x - 18, binY);
 hits.push({ id: `zone-${bin.id}`, shape: "rect", x: bin.x, y: binY, w: 140, h: 64, meta: { zoneId: bin.id } });
 }
 const placed = chemLabState.placed || {};
 const slotN = { red: 0, blue: 0, grey: 0 };
 for (const ball of balls) {
 if (!ball.laidOut) {
 const idx = ids.indexOf(ball.id);
 ball.x = 36 + (idx % 5) * ((w - 72) / 5);
 ball.y = 70 + Math.floor(idx / 5) * 56;
 ball.laidOut = true;
 }
 const zone = placed[ball.id];
 if (zone && typeof zone === "string") {
 const bin = bins.find((b) => b.id === zone);
 if (bin) {
 const n = slotN[zone]++;
 ball.x = bin.x - 30 + (n % 3) * 22;
 ball.y = binY - 8 + Math.floor(n / 3) * 18;
 }
 }
 drawDot(ctx, ball.x, ball.y, 14, colors[ball.kind], true);
 if (!zone) {
 hits.push({
 id: ball.id,
 shape: "ellipse",
 x: ball.x,
 y: ball.y,
 r: 16,
 meta: { chipId: ball.id, action: "chip" },
 });
 }
 }
 if (chemLabState.reveal) {
 drawLabel(ctx, "You just discovered something huge: there isn’t just one kind of atom. There are many kinds.", w * 0.5, 28, {
 font: "600 12px Segoe UI, sans-serif",
 h: 36,
 });
 }
 ctx.restore();
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("tinyBuild", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const pieces = [
 { id: "o", color: 0xf87171, r: 22, x: 80, y: 120, slot: "o" },
 { id: "hL", color: 0x60a5fa, r: 14, x: 80, y: 180, slot: "hL" },
 { id: "hR", color: 0x60a5fa, r: 14, x: 80, y: 230, slot: "hR" },
 ];
 setDescription("Build a water unit: two blue bits and one red bit in the bent outline.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DRAG" && intent.meta?.piece) {
 const p = pieces.find((x) => x.id === intent.meta.piece);
 const b = chemLabState.build || {};
 if (p && !b[p.id]) {
 p.x = intent.x;
 p.y = intent.y;
 }
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = performance.now() / 1000;
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 const ox = w * 0.58;
 const oy = h * 0.46;
 const slots = {
 o: { x: ox, y: oy, r: 24 },
 hL: { x: ox - 38, y: oy + 28, r: 16 },
 hR: { x: ox + 38, y: oy + 28, r: 16 },
 };
 ctx.strokeStyle = "rgba(226,232,240,0.35)";
 ctx.lineWidth = 2;
 ctx.setLineDash([6, 5]);
 for (const s of Object.values(slots)) {
 ctx.beginPath();
 ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
 ctx.stroke();
 }
 ctx.setLineDash([]);
 const b = chemLabState.build || { o: false, hL: false, hR: false, snapped: false };
 const hits = [];
 if (b.snapped) {
 const driftX = ox + Math.sin(t * 0.8) * 18;
 const driftY = oy + Math.cos(t * 0.6) * 10;
 drawH2O(ctx, driftX, driftY, 2.1, Math.sin(t) * 0.15);
 ctx.shadowColor = "rgba(125,211,252,0.8)";
 ctx.shadowBlur = 18;
 drawH2O(ctx, driftX, driftY, 2.1, Math.sin(t) * 0.15);
 ctx.shadowBlur = 0;
 } else {
 for (const p of pieces) {
 if (b[p.id]) {
 p.x = slots[p.slot].x;
 p.y = slots[p.slot].y;
 }
 drawDot(ctx, p.x, p.y, p.r, p.color, true);
 if (!b[p.id]) {
 hits.push({
 id: p.id,
 shape: "ellipse",
 x: p.x,
 y: p.y,
 r: p.r + 4,
 meta: { piece: p.id, action: "piece" },
 });
 }
 }
 }
 ctx.restore();
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("tinyGallery", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 const start = performance.now();
 let mols = [];
 let key = "";
 setDescription("Different combinations of tiny bits build everything.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 const k = `${w|0}x${h|0}`;
 if (k !== key) {
 mols = makeMolField(28, "water", w, h * 0.62);
 key = k;
 }
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 stepMols(mols, 0.48, w, h * 0.62, api.reducedMotion);
 for (const m of mols) drawH2O(ctx, m.x, m.y + 8, 1.05, m.rot);
 const gallery = Math.floor(t / 3) % 4;
 const gx = w * 0.5;
 const gy = h * 0.82;
 roundRect(ctx, 16, h * 0.68, w - 32, h * 0.28, 12);
 ctx.fillStyle = "rgba(15,23,42,0.55)";
 ctx.fill();
 if (gallery === 0) drawH2O(ctx, gx, gy, 1.8, t);
 else if (gallery === 1) drawCO2(ctx, gx, gy, 1.7, 0);
 else if (gallery === 2) drawGlucose(ctx, gx, gy, 1.4, t);
 else drawO2(ctx, gx, gy, 1.7, t * 0.2);
 drawLabel(ctx, "Different combinations of tiny bits build everything: water, the air you breathe, even sugar.", w * 0.5, 24, {
 font: "600 12px Segoe UI, sans-serif",
 h: 32,
 });
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("tinyFormula", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 setDescription("Chemists’ labels for the shapes you already built.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = performance.now() / 1000;
 const step = chemLabState.formulaStep || 0;
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 const cx = w * 0.5;
 const cy = h * 0.42;
 if (step <= 0) {
 drawH2O(ctx, cx, cy, 2.4, Math.sin(t) * 0.08);
 drawLabel(ctx, "blue ball → Hydrogen (H)", cx, h * 0.68);
 drawLabel(ctx, "red ball → Oxygen (O)", cx, h * 0.76);
 drawLabel(ctx, "Two Hydrogen + one Oxygen, joined = H₂O, a molecule", cx, h * 0.86, {
 font: "700 13px Segoe UI, sans-serif",
 h: 28,
 });
 } else if (step === 1) {
 drawO2(ctx, cx, cy, 2.6, t * 0.15);
 drawLabel(ctx, "O₂, a molecule", cx, h * 0.78, { font: "700 20px Segoe UI, sans-serif", h: 36 });
 } else {
 drawCO2(ctx, cx, cy, 2.4, 0);
 drawLabel(ctx, "CO₂, a molecule", cx, h * 0.78, { font: "700 20px Segoe UI, sans-serif", h: 36 });
 }
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("tinyBuilder", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 let drag = null;
 setDescription("Atom builder: protons and neutrons in the nucleus, electrons on the rings.");
 setIntentHandler((intent) => {
 const hunt = chemLabState.builderMode === "hunt";
 const maxP = hunt ? 18 : 12;
 if (intent.type === "CANVAS_DOWN" && intent.meta?.piece) {
 if (hunt && intent.meta.piece !== "proton") return;
 drag = { kind: intent.meta.piece, x: intent.x, y: intent.y };
 }
 if (intent.type === "CANVAS_DRAG" && drag) {
 drag.x = intent.x;
 drag.y = intent.y;
 }
 if (intent.type === "CANVAS_UP" && drag) {
 const w = api.width;
 const h = api.height;
 const cx = w * 0.5;
 const cy = h * 0.42;
 const dist = Math.hypot(intent.x - cx, intent.y - cy);
 if (drag.kind === "proton" && dist < 36) {
 chemLabState.protons = Math.min(maxP, (chemLabState.protons || 0) + 1);
 if (hunt) chemLabState.electrons = chemLabState.protons;
 }
 if (!hunt && drag.kind === "neutron" && dist < 36) chemLabState.neutrons = Math.min(12, (chemLabState.neutrons || 0) + 1);
 if (!hunt && drag.kind === "electron" && dist >= 36 && dist < 120) chemLabState.electrons = Math.min(12, (chemLabState.electrons || 0) + 1);
 if (dist > 130) {
 if (drag.kind === "proton") {
 chemLabState.protons = Math.max(0, (chemLabState.protons || 0) - 1);
 if (hunt) chemLabState.electrons = chemLabState.protons;
 }
 if (!hunt && drag.kind === "neutron") chemLabState.neutrons = Math.max(0, (chemLabState.neutrons || 0) - 1);
 if (!hunt && drag.kind === "electron") chemLabState.electrons = Math.max(0, (chemLabState.electrons || 0) - 1);
 }
 drag = null;
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = performance.now() / 1000;
 const hunt = chemLabState.builderMode === "hunt";
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 const cx = w * 0.5;
 const cy = h * 0.42;
 ctx.strokeStyle = "rgba(125,211,252,0.35)";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.arc(cx, cy, 32, 0, Math.PI * 2);
 ctx.stroke();
 if (hunt) {
 ctx.beginPath();
 ctx.arc(cx, cy, 50, 0, Math.PI * 2);
 ctx.stroke();
 ctx.beginPath();
 ctx.arc(cx, cy, 70, 0, Math.PI * 2);
 ctx.stroke();
 ctx.beginPath();
 ctx.arc(cx, cy, 92, 0, Math.PI * 2);
 ctx.stroke();
 } else {
 ctx.beginPath();
 ctx.arc(cx, cy, 62, 0, Math.PI * 2);
 ctx.stroke();
 ctx.beginPath();
 ctx.arc(cx, cy, 96, 0, Math.PI * 2);
 ctx.stroke();
 }
 const p = chemLabState.protons || 0;
 const n = hunt ? 0 : chemLabState.neutrons || 0;
 const e = hunt ? p : chemLabState.electrons || 0;
 for (let i = 0; i < p; i++) {
 const a = (i / Math.max(1, p)) * Math.PI * 2;
 drawDot(ctx, cx + Math.cos(a) * 8, cy + Math.sin(a) * 8, 5, 0xfb7185, false);
 }
 if (!hunt) {
 for (let i = 0; i < n; i++) {
 const a = (i / Math.max(1, n)) * Math.PI * 2 + 0.4;
 drawDot(ctx, cx + Math.cos(a) * 16, cy + Math.sin(a) * 16, 5, 0xcbd5e1, false);
 }
 }
 const e1 = Math.min(2, e);
 const e2 = hunt ? Math.max(0, Math.min(8, e - 2)) : Math.max(0, e - 2);
 const e3 = hunt ? Math.max(0, e - 10) : 0;
 const r1 = hunt ? 50 : 62;
 const r2 = hunt ? 70 : 96;
 for (let i = 0; i < e1; i++) {
 const a = t * 1.5 + (i / Math.max(1, e1)) * Math.PI * 2;
 drawDot(ctx, cx + Math.cos(a) * r1, cy + Math.sin(a) * r1, 3.4, 0x38bdf8, false);
 }
 for (let i = 0; i < e2; i++) {
 const a = -t * 1.05 + (i / Math.max(1, e2)) * Math.PI * 2;
 drawDot(ctx, cx + Math.cos(a) * r2, cy + Math.sin(a) * r2, 3.4, 0x38bdf8, false);
 }
 for (let i = 0; i < e3; i++) {
 const a = t * 0.85 + (i / Math.max(1, e3)) * Math.PI * 2;
 drawDot(ctx, cx + Math.cos(a) * 92, cy + Math.sin(a) * 92, 3.4, 0x38bdf8, false);
 }
 const el = elementForProtons(p);
 const live = hunt
 ? `Protons: ${p} → Element: ${p ? el.name : "?"} (${p ? el.symbol : "?"})`
 : `Protons: ${p}  |  Element: ${el.name}  |  This is now: ${p ? el.name : "?"}`;
 drawLabel(ctx, live, w * 0.5, 26, {
 font: "700 13px Segoe UI, sans-serif",
 h: 30,
 });
 const trayY = h - 42;
 const kinds = hunt
 ? [{ id: "proton", label: "Proton  +", color: 0xfb7185, x: w * 0.5 }]
 : [
 { id: "proton", label: "Proton  +", color: 0xfb7185, x: w * 0.22 },
 { id: "neutron", label: "Neutron", color: 0xcbd5e1, x: w * 0.5 },
 { id: "electron", label: "Electron  -", color: 0x38bdf8, x: w * 0.78 },
 ];
 const hits = [];
 for (const knd of kinds) {
 roundRect(ctx, knd.x - 58, trayY - 22, 116, 44, 12);
 ctx.fillStyle = "rgba(15,23,42,0.75)";
 ctx.fill();
 drawDot(ctx, knd.x - 38, trayY, 9, knd.color, false);
 ctx.fillStyle = "#e0f2fe";
 ctx.font = "600 12px Segoe UI, sans-serif";
 ctx.textAlign = "left";
 ctx.textBaseline = "middle";
 ctx.fillText(knd.label, knd.x - 24, trayY);
 hits.push({ id: knd.id, shape: "rect", x: knd.x, y: trayY, w: 116, h: 44, meta: { piece: knd.id } });
 }
 if (drag) drawDot(ctx, drag.x, drag.y, drag.kind === "electron" ? 5 : 8, drag.kind === "proton" ? 0xfb7185 : drag.kind === "neutron" ? 0xcbd5e1 : 0x38bdf8, true);
 ctx.restore();
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("tinyPeriodic", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions } = api;
 const zs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 setDescription("A mini periodic table: the first elements, as Bohr icons.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = performance.now() / 1000;
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 const explode = chemLabState.explodeZ || 0;
 const hits = [];
 if (explode) {
 drawBohr(ctx, w * 0.5, h * 0.42, explode, 1.6, t);
 const el = elementForProtons(explode);
 drawLabel(ctx, `${el.name} (${el.symbol}), protons: ${explode}`, w * 0.5, h * 0.82);
 drawLabel(ctx, "Tap canvas to return to the grid", w * 0.5, 28);
 hits.push({ id: "grid-back", shape: "rect", x: w * 0.5, y: h * 0.5, w: w, h: h, meta: { action: "explode", z: 0 } });
 } else {
 const cols = 5;
 const cellW = (w - 40) / cols;
 const cellH = (h - 80) / 2;
 zs.forEach((z, i) => {
 const col = i % cols;
 const row = Math.floor(i / cols);
 const x = 20 + col * cellW + cellW / 2;
 const y = 50 + row * cellH + cellH / 2;
 drawBohr(ctx, x, y - 8, z, 0.72, t);
 const el = elementForProtons(z);
 drawLabel(ctx, `${el.name}  ${el.symbol}`, x, y + cellH * 0.32, { font: "600 11px Segoe UI, sans-serif" });
 hits.push({ id: `el-${z}`, shape: "rect", x, y, w: cellW * 0.86, h: cellH * 0.8, meta: { action: "explode", z } });
 });
 }
 ctx.restore();
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("tinyCarbon", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 setDescription("Carbon: atomic number 6. Protons equal electrons in a neutral atom.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = performance.now() / 1000;
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 roundRect(ctx, w * 0.18, h * 0.12, w * 0.28, h * 0.7, 16);
 ctx.fillStyle = "rgba(15,23,42,0.65)";
 ctx.fill();
 ctx.strokeStyle = "rgba(125,211,252,0.45)";
 ctx.stroke();
 ctx.fillStyle = "#7dd3fc";
 ctx.font = "700 18px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.fillText("6", w * 0.32, h * 0.28);
 ctx.fillStyle = "#f8fafc";
 ctx.font = "800 64px Segoe UI, sans-serif";
 ctx.fillText("C", w * 0.32, h * 0.48);
 ctx.fillStyle = "#bae6fd";
 ctx.font = "600 16px Segoe UI, sans-serif";
 ctx.fillText("Carbon", w * 0.32, h * 0.66);
 drawBohr(ctx, w * 0.7, h * 0.45, 6, 1.35, t);
 ctx.strokeStyle = "rgba(250,204,21,0.85)";
 ctx.lineWidth = 2;
 ctx.beginPath();
 ctx.moveTo(w * 0.32, h * 0.32);
 ctx.lineTo(w * 0.58, h * 0.2);
 ctx.stroke();
 drawLabel(ctx, "Atomic number = number of protons", w * 0.62, h * 0.16, { font: "600 12px Segoe UI, sans-serif" });
 drawLabel(ctx, "Protons = Electrons in a neutral atom. Charges balance to zero.", w * 0.5, h * 0.88, {
 font: "600 12px Segoe UI, sans-serif",
 h: 28,
 });
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("tinyHeat", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions } = api;
 let mols = [];
 let key = "";
 setDescription("Heat lab: the same H₂O units lock, slide, or fly apart.");
 setTick(() => {
 lerpHeat();
 const w = api.width;
 const h = api.height;
 const heat = chemLabState.heat;
 const k = `${w|0}x${h|0}`;
 if (k !== key) {
 mols = makeMolField(22, "water", w - 24, h - 80);
 key = k;
 }
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 roundRect(ctx, 18, 40, w - 36, h - 100, 14);
 ctx.fillStyle = "rgba(15,23,42,0.45)";
 ctx.fill();
 ctx.strokeStyle = "rgba(125,211,252,0.35)";
 ctx.stroke();
 ctx.save();
 ctx.beginPath();
 roundRect(ctx, 18, 40, w - 36, h - 100, 14);
 ctx.clip();
 stepMols(mols, heat, w - 36, h - 100, api.reducedMotion);
 for (const m of mols) drawH2O(ctx, 18 + m.x, 40 + m.y, 1.15, m.rot);
 ctx.restore();
 const phase = heat < 0.33 ? "ice" : heat > 0.72 ? "gas/steam" : "liquid";
 drawLabel(ctx, phase, w * 0.5, 24);
 const hx = 40 + heat * (w - 80);
 roundRect(ctx, 24, h - 42, w - 48, 16, 8);
 ctx.fillStyle = "rgba(15,23,42,0.7)";
 ctx.fill();
 ctx.fillStyle = "#fb923c";
 ctx.beginPath();
 ctx.arc(hx, h - 34, 12, 0, Math.PI * 2);
 ctx.fill();
 drawLabel(ctx, "❄", 28, h - 34, { font: "16px sans-serif", bg: "transparent", border: "transparent" });
 drawLabel(ctx, "🔥", w - 28, h - 34, { font: "16px sans-serif", bg: "transparent", border: "transparent" });
 ctx.restore();
 setHitRegions([{ id: "heat", shape: "rect", x: w * 0.5, y: h - 34, w: w - 40, h: 36, meta: { action: "heat" } }]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("tinyReact", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 setDescription("Reaction lab: hydrogen and oxygen rearrange into water.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const now = performance.now();
 const t0 = chemLabState.sparkAt || 0;
 const elapsed = t0 ? now - t0 : 0;
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 const cx = w * 0.5;
 const cy = h * 0.45;
 if (!t0 || elapsed < 80) {
 drawH2(ctx, cx - 120, cy, 1.8, 0);
 drawH2(ctx, cx - 40, cy + 30, 1.8, 0.2);
 drawO2(ctx, cx + 90, cy, 1.8, 0);
 } else if (elapsed < 700) {
 const p = (elapsed - 80) / 620;
 drawDot(ctx, cx - 130 + p * 20, cy, 8, 0x60a5fa, true);
 drawDot(ctx, cx - 110 - p * 10, cy + 8, 8, 0x60a5fa, true);
 drawDot(ctx, cx - 50, cy + 24, 8, 0x60a5fa, true);
 drawDot(ctx, cx - 28, cy + 36, 8, 0x60a5fa, true);
 drawDot(ctx, cx + 78, cy - p * 12, 10, 0xf87171, true);
 drawDot(ctx, cx + 102, cy + p * 12, 10, 0xf87171, true);
 } else if (elapsed < 1700) {
 const swirl = (elapsed - 700) / 1000;
 const bits = [
 [0x60a5fa, 8],
 [0x60a5fa, 8],
 [0x60a5fa, 8],
 [0x60a5fa, 8],
 [0xf87171, 10],
 [0xf87171, 10],
 ];
 bits.forEach((bit, i) => {
 const a = swirl * 8 + i;
 const rad = 50 + Math.sin(swirl * 6 + i) * 18;
 drawDot(ctx, cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, bit[1], bit[0], true);
 });
 } else {
 const p = Math.min(1, (elapsed - 1700) / 600);
 drawH2O(ctx, cx - 70, cy, 1.6 + 0.4 * p, 0);
 drawH2O(ctx, cx + 70, cy + 10, 1.6 + 0.4 * p, 0.2);
 if (p > 0.4) {
 const a = (1 - p) * 0.5;
 ctx.fillStyle = `rgba(254,240,138,${a})`;
 ctx.beginPath();
 ctx.arc(cx, cy, 80 + p * 40, 0, Math.PI * 2);
 ctx.fill();
 }
 if (elapsed > 2300) {
 chemLabState.sparkDone = true;
 drawLabel(ctx, "Nothing was created. Nothing was destroyed. The same atoms, just rearranged and rejoined.", w * 0.5, h * 0.84, {
 font: "600 12px Segoe UI, sans-serif",
 h: 36,
 });
 }
 }
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("tinyRocket", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 const start = performance.now();
 setDescription("Split screen: the reaction you sparked, and a rocket engine igniting.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 ctx.fillStyle = "rgba(15,23,42,0.5)";
 ctx.fillRect(0, 0, w / 2 - 4, h);
 ctx.fillRect(w / 2 + 4, 0, w / 2 - 4, h);
 const cx = w * 0.25;
 const cy = h * 0.5;
 const cycle = (t % 3) / 3;
 if (cycle < 0.35) {
 drawH2(ctx, cx - 50, cy, 1.4, 0);
 drawH2(ctx, cx - 10, cy + 20, 1.4, 0);
 drawO2(ctx, cx + 50, cy, 1.4, 0);
 } else if (cycle < 0.7) {
 for (let i = 0; i < 6; i++) {
 const a = t * 4 + i;
 drawDot(ctx, cx + Math.cos(a) * 36, cy + Math.sin(a) * 28, i < 4 ? 6 : 8, i < 4 ? 0x60a5fa : 0xf87171, false);
 }
 } else {
 drawH2O(ctx, cx - 40, cy, 1.5, 0);
 drawH2O(ctx, cx + 40, cy, 1.5, 0.2);
 }
 drawLabel(ctx, "molecule view", w * 0.25, 24);
 const rx = w * 0.75;
 const ry = h * 0.42;
 ctx.fillStyle = "#94a3b8";
 ctx.beginPath();
 ctx.moveTo(rx, ry - 70);
 ctx.lineTo(rx + 28, ry + 40);
 ctx.lineTo(rx - 28, ry + 40);
 ctx.closePath();
 ctx.fill();
 ctx.fillStyle = "#64748b";
 ctx.fillRect(rx - 18, ry + 40, 36, 18);
 const flame = 30 + Math.sin(t * 12) * 10;
 const fg = ctx.createLinearGradient(rx, ry + 58, rx, ry + 58 + flame);
 fg.addColorStop(0, "#fde047");
 fg.addColorStop(0.5, "#fb923c");
 fg.addColorStop(1, "rgba(239,68,68,0)");
 ctx.fillStyle = fg;
 ctx.beginPath();
 ctx.moveTo(rx - 14, ry + 58);
 ctx.lineTo(rx + 14, ry + 58);
 ctx.lineTo(rx, ry + 58 + flame);
 ctx.closePath();
 ctx.fill();
 drawLabel(ctx, "illustrative: rocket igniting", w * 0.75, 24);
 drawLabel(ctx, "not a safety demo", w * 0.75, h - 24, { font: "600 11px Segoe UI, sans-serif" });
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("tinyEquation", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 setDescription("2H₂ + O₂ → 2H₂O");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = performance.now() / 1000;
 const step = chemLabState.eqStep || 0;
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 if (step < 2) {
 drawH2(ctx, w * 0.28, h * 0.55, 1.5, 0);
 drawH2(ctx, w * 0.42, h * 0.58, 1.5, 0.2);
 if (step >= 2) drawO2(ctx, w * 0.7, h * 0.55, 1.5, 0);
 } else if (step < 4) {
 drawH2(ctx, w * 0.22, h * 0.55, 1.4, 0);
 drawH2(ctx, w * 0.36, h * 0.58, 1.4, 0);
 drawO2(ctx, w * 0.62, h * 0.55, 1.5, t * 0.2);
 } else {
 drawH2O(ctx, w * 0.35, h * 0.55, 1.7, 0);
 drawH2O(ctx, w * 0.62, h * 0.58, 1.7, 0.15);
 }
 const terms = ["2H₂", "+", "O₂", "→", "2H₂O"];
 const shown = Math.min(terms.length, step);
 let x = w * 0.18;
 ctx.font = "800 28px Segoe UI, sans-serif";
 ctx.fillStyle = "#f0f9ff";
 ctx.textAlign = "left";
 ctx.textBaseline = "middle";
 for (let i = 0; i < shown; i++) {
 ctx.fillText(terms[i], x, h * 0.22);
 x += ctx.measureText(terms[i]).width + 16;
 }
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("tinyZoomOut", (api) => {
 const { ctx, setTick, setDispose, setDescription } = api;
 const start = performance.now();
 setDescription("Reverse zoom: molecule → droplet → glass → the sunlit room.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 const dur = api.reducedMotion ? 2.2 : 7.5;
 const p = Math.min(1, t / dur);
 chemLabState.scale = p;
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 if (p < 0.28) {
 drawH2O(ctx, w * 0.5, h * 0.5, 3.2 * (1 - p * 1.5), t);
 } else if (p < 0.55) {
 const u = (p - 0.28) / 0.27;
 fillNight(ctx, w, h);
 ctx.fillStyle = "rgba(56,189,248,0.35)";
 ctx.beginPath();
 ctx.ellipse(w * 0.5, h * 0.5, 40 + u * 80, 28 + u * 50, 0, 0, Math.PI * 2);
 ctx.fill();
 } else if (p < 0.78) {
 const u = (p - 0.55) / 0.23;
 drawSunlitRoom(ctx, w, h, t, { focus: 1 - u, reduced: api.reducedMotion });
 } else {
 drawSunlitRoom(ctx, w, h, t, { focus: 0, reduced: api.reducedMotion });
 }
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("tinySpiral", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const start = performance.now();
 const stops = [
 { id: 1, label: "1 Tiny bits", caption: "Spiral 1: everything is tiny bits" },
 { id: 2, label: "2 Many kinds", caption: "Spiral 2: atoms join into molecules" },
 { id: 3, label: "3 Inside", caption: "Spiral 3: protons decide the element" },
 { id: 4, label: "4 At work", caption: "Spiral 4: heat and rearranging" },
 ];
 let reelDots = [];
 let reelKey = "";
 setDescription("Recap map of the four spirals. Tap a number to replay, then Finish Tiny Bits.");
 setIntentHandler((intent) => {
 if (intent.type !== "CANVAS_TAP") return;
 if (intent.meta?.action === "spiral") {
 const n = Number(intent.meta.stop) || 0;
 if (n >= 1 && n <= 4) {
 chemLabState.spiralStop = n;
 chemLabState.spiralUntil = performance.now() + 4500;
 }
 }
 if (intent.meta?.action === "spiralFinish") {
 chemLabState.spiralFinish = true;
 }
 });
 function polar(t, w, h) {
 const cx = w * 0.5;
 const cy = Math.min(h * 0.44, h - 118);
 const maxR = Math.min(w * 0.36, Math.max(70, h - 140) * 0.42, 150);
 const a = -0.55 + t * 1.28;
 const r = maxR * (0.55 + t * 0.15);
 return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, a, r, cx, cy };
 }
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const t = (performance.now() - start) / 1000;
 const stop = chemLabState.spiralStop || 0;
 const playing = stop >= 1 && stop <= 4;
 fillNight(ctx, w, h);
 ctx.save();
 ctx.translate(failShake(), 0);
 const origin = polar(0, w, h);
 const cx = origin.cx;
 const cy = origin.cy;
 const innerR = Math.max(36, origin.r * 0.62);

 ctx.strokeStyle = "rgba(125,211,252,0.5)";
 ctx.lineWidth = 3;
 ctx.beginPath();
 for (let s = 0; s <= 3.02; s += 0.04) {
 const p = polar(s, w, h);
 if (s === 0) ctx.moveTo(p.x, p.y);
 else ctx.lineTo(p.x, p.y);
 }
 ctx.stroke();

 ctx.beginPath();
 ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
 ctx.fillStyle = "rgba(8,47,73,0.55)";
 ctx.fill();
 ctx.strokeStyle = "rgba(125,211,252,0.28)";
 ctx.lineWidth = 1.5;
 ctx.stroke();

 if (playing) {
 ctx.save();
 ctx.beginPath();
 ctx.arc(cx, cy, innerR - 2, 0, Math.PI * 2);
 ctx.clip();
 if (stop === 1) {
 const box = (innerR - 2) * 2;
 const k = `${box | 0}`;
 if (reelKey !== k) {
 reelDots = makeDots(16, "water", box, box);
 reelKey = k;
 }
 ctx.translate(cx - innerR + 2, cy - innerR + 2);
 stepDots(reelDots, "water", box, box, t, api.reducedMotion);
 drawDotField(ctx, reelDots);
 } else if (stop === 2) {
 drawH2O(ctx, cx - 22, cy + 4, 1.15, t);
 drawO2(ctx, cx + 26, cy + 4, 1.05, t);
 } else if (stop === 3) {
 drawBohr(ctx, cx, cy, 6, 0.72, t);
 } else {
 drawH2O(ctx, cx - 18, cy + 6, 0.95, 0);
 ctx.fillStyle = "#fbbf24";
 ctx.font = "28px sans-serif";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText("⚡", cx + 28, cy + 4);
 }
 ctx.restore();
 }

 const hits = [];
 stops.forEach((s, i) => {
 const p = polar(i, w, h);
 const on = stop === s.id;
 ctx.fillStyle = on ? "#38bdf8" : "#0ea5e9";
 ctx.beginPath();
 ctx.arc(p.x, p.y, 22, 0, Math.PI * 2);
 ctx.fill();
 if (on) {
 ctx.strokeStyle = "#fef08a";
 ctx.lineWidth = 3;
 ctx.stroke();
 }
 ctx.fillStyle = "#f0f9ff";
 ctx.font = "800 16px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(String(s.id), p.x, p.y);
 const lx = Math.min(w - 70, Math.max(70, p.x + Math.cos(p.a) * 42));
 const ly = Math.min(h - 88, Math.max(58, p.y + Math.sin(p.a) * 36));
 drawLabel(ctx, s.label, lx, ly, { font: "600 12px Segoe UI, sans-serif", h: 22 });
 hits.push({
 id: `stop-${s.id}`,
 shape: "ellipse",
 x: p.x,
 y: p.y,
 r: 36,
 meta: { action: "spiral", stop: s.id },
 });
 hits.push({
 id: `stop-label-${s.id}`,
 shape: "rect",
 x: lx,
 y: ly,
 w: 110,
 h: 28,
 meta: { action: "spiral", stop: s.id },
 });
 });

 const title = playing
 ? stops[stop - 1].caption
 : "Your four spirals. Tap a number, then Finish Tiny Bits.";
 drawLabel(ctx, title, w * 0.5, 28, { font: "700 14px Segoe UI, sans-serif", h: 32 });

 const fx = w * 0.5;
 const fy = h - 34;
 const fw = Math.min(240, w * 0.72);
 const fh = 44;
 roundRect(ctx, fx - fw / 2, fy - fh / 2, fw, fh, 12);
 ctx.fillStyle = "#0284c7";
 ctx.fill();
 ctx.strokeStyle = "rgba(186,230,253,0.7)";
 ctx.lineWidth = 1.5;
 ctx.stroke();
 ctx.fillStyle = "#f0f9ff";
 ctx.font = "800 16px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText("Finish Tiny Bits", fx, fy);
 hits.push({
 id: "spiral-finish",
 shape: "rect",
 x: fx,
 y: fy,
 w: fw,
 h: fh,
 meta: { action: "spiralFinish" },
 });
 setHitRegions(hits);
 ctx.restore();
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 if (typeof arena.registerAlias === "function") {
 arena.registerAlias("atomsMeet", "tinyOpen");
 arena.registerAlias("atomsSalt", "tinyStates");
 arena.registerAlias("atomsSort", "tinySort");
 arena.registerAlias("atomsIce", "tinyHeat");
 arena.registerAlias("atomsSteam", "tinyReact");
 arena.registerAlias("atomsRule", "tinyFormula");
 arena.registerAlias("atomsStretch", "tinyBuilder");
 arena.registerAlias("atomsMyth", "tinyPeriodic");
 arena.registerAlias("atomsDrill", "tinyEquation");
 arena.registerAlias("atomsMastery", "tinySpiral");
 }
}

export const ATOM_ASSET_PATHS = {
 orbit: `${ASSET}/atom-orbit.svg`,
 salt: `${ASSET}/salt-crystal.svg`,
 ice: `${ASSET}/ice-melt.svg`,
 steam: `${ASSET}/steam-cloud.svg`,
 magnify: `${ASSET}/magnify-atoms.svg`,
 myth: `${ASSET}/myth-bust.svg`,
 water: `${ASSET}/water-h2o.svg`,
};
