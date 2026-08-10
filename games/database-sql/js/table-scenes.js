/**
 * Database & SQL - Mission 1: Tables & Rows - themed Canvas 2D scenes.
 * Topic-specific: class register, contacts, shop sheet, find-glow, myth diagrams.
 */
import { labState, pulseFailFeedback, pulseSuccessFeedback } from "./lab-state.js";
import { sortSlotPositions, getActiveSession } from "./activity-controller.js";

const ACCENT = "#2dd4bf";
const BORDER = "rgba(45,212,191,0.55)";
const FG = "#ccfbf1";

const KIDS = [
 ["1", "Rafi", "Dhaka"],
 ["2", "Maya", "Ctg"],
 ["3", "Nila", "Sylhet"],
];
const HEADERS = ["id", "name", "city"];

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
 ctx.font = opts.font || "600 14px Segoe UI, system-ui, sans-serif";
 const tw = Math.min(ctx.measureText(text).width + 24, opts.maxW || 560);
 const bh = opts.h || 26;
 ctx.fillStyle = opts.bg || "rgba(15,23,42,0.92)";
 roundRect(ctx, x - tw / 2, y - bh / 2, tw, bh, 10);
 ctx.fill();
 ctx.strokeStyle = opts.border || BORDER;
 ctx.lineWidth = 1.4;
 ctx.stroke();
 ctx.fillStyle = opts.color || FG;
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(text, x, y + 1);
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
 ctx.fillStyle = `rgba(74,222,128,${Math.max(0, (until - performance.now()) / 380) * 0.22})`;
 ctx.fillRect(0, 0, w, h);
}

function drawPaperSheet(ctx, x, y, w, h) {
 ctx.fillStyle = "#f1f5f9";
 roundRect(ctx, x, y, w, h, 6);
 ctx.fill();
 ctx.strokeStyle = "#94a3b8";
 ctx.lineWidth = 1.5;
 ctx.stroke();
 ctx.strokeStyle = "rgba(148,163,184,0.45)";
 ctx.lineWidth = 1;
 for (let i = 1; i < 6; i++) {
 const yy = y + 18 + i * ((h - 28) / 6);
 ctx.beginPath();
 ctx.moveTo(x + 10, yy);
 ctx.lineTo(x + w - 10, yy);
 ctx.stroke();
 }
}

function drawStickyPile(ctx, x, y, count = 5) {
 const colors = ["#fef08a", "#fdba74", "#f9a8d4", "#a5f3fc", "#bbf7d0"];
 for (let i = 0; i < count; i++) {
 const ox = (i % 3) * 18 - 12;
 const oy = Math.floor(i / 3) * 14 - 6;
 ctx.save();
 ctx.translate(x + ox, y + oy);
 ctx.rotate(((i % 5) - 2) * 0.08);
 ctx.fillStyle = colors[i % colors.length];
 roundRect(ctx, -22, -16, 44, 32, 3);
 ctx.fill();
 ctx.fillStyle = "#334155";
 ctx.font = "600 8px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(["Maya?", "Ctg", "Rafi", "???", "Nila"][i] || "?", 0, 2);
 ctx.restore();
 }
}

function drawRegisterBook(ctx, x, y, open = 0.6) {
 ctx.fillStyle = "#0f766e";
 roundRect(ctx, x - 28, y - 36, 56, 72, 4);
 ctx.fill();
 ctx.fillStyle = "#f8fafc";
 roundRect(ctx, x - 20, y - 28, 40 * open + 8, 56, 3);
 ctx.fill();
 ctx.fillStyle = "#134e4a";
 ctx.font = "700 9px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("Register", x, y + 42);
}

function drawPhone(ctx, x, y, title = "Contacts") {
 ctx.fillStyle = "#0f172a";
 roundRect(ctx, x - 36, y - 58, 72, 116, 12);
 ctx.fill();
 ctx.strokeStyle = ACCENT;
 ctx.lineWidth = 2;
 ctx.stroke();
 ctx.fillStyle = "#134e4a";
 roundRect(ctx, x - 28, y - 48, 56, 18, 4);
 ctx.fill();
 ctx.fillStyle = FG;
 ctx.font = "700 9px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(title, x, y - 36);
 ctx.fillStyle = "#1e293b";
 for (let i = 0; i < 3; i++) {
 roundRect(ctx, x - 26, y - 18 + i * 22, 52, 18, 3);
 ctx.fill();
 ctx.fillStyle = FG;
 ctx.font = "600 8px Segoe UI";
 ctx.fillText(["Rafi · 017", "Maya · 018", "Nila · 019"][i], x, y - 6 + i * 22);
 ctx.fillStyle = "#1e293b";
 }
}

function drawShopShelf(ctx, x, y) {
 ctx.fillStyle = "#78350f";
 roundRect(ctx, x - 90, y - 50, 180, 100, 6);
 ctx.fill();
 const items = [
 ["Rice", "40"],
 ["Oil", "12"],
 ["Soap", "28"],
 ];
 items.forEach((it, i) => {
 const ix = x - 70 + i * 55;
 ctx.fillStyle = "#fef3c7";
 roundRect(ctx, ix, y - 30, 44, 50, 4);
 ctx.fill();
 ctx.fillStyle = "#78350f";
 ctx.font = "700 10px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(it[0], ix + 22, y - 8);
 ctx.fillText("×" + it[1], ix + 22, y + 10);
 });
 drawLabel(ctx, "sku · item · stock", x, y + 62, { h: 20, font: "600 10px Segoe UI" });
}

function drawFareBoard(ctx, x, y) {
 ctx.fillStyle = "#0f172a";
 roundRect(ctx, x - 110, y - 55, 220, 110, 8);
 ctx.fill();
 ctx.strokeStyle = "#22c55e";
 ctx.lineWidth = 2;
 ctx.stroke();
 ctx.fillStyle = FG;
 ctx.font = "700 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("Rickshaw fares", x, y - 38);
 const rows = [
 ["Mirpur", "Farmgate", "৳40"],
 ["Gulshan", "Motijheel", "৳80"],
 ["Uttara", "Airport", "৳60"],
 ];
 rows.forEach((r, i) => {
 ctx.fillStyle = i % 2 ? "rgba(45,212,191,0.2)" : "rgba(30,41,59,0.9)";
 roundRect(ctx, x - 100, y - 22 + i * 24, 200, 22, 3);
 ctx.fill();
 ctx.fillStyle = FG;
 ctx.font = "600 10px Segoe UI";
 ctx.fillText(r[0] + " → " + r[1] + " " + r[2], x, y - 8 + i * 24);
 });
}

function drawSqlTerminal(ctx, x, y, t = 0) {
 ctx.fillStyle = "#0f172a";
 roundRect(ctx, x - 130, y - 55, 260, 110, 10);
 ctx.fill();
 ctx.strokeStyle = "#22c55e";
 ctx.lineWidth = 2;
 ctx.stroke();
 ctx.fillStyle = "#4ade80";
 ctx.font = "700 12px Consolas, monospace";
 ctx.textAlign = "left";
 ctx.fillText("CREATE TABLE kids (", x - 110, y - 28);
 ctx.fillText(" id, name, city", x - 110, y - 6);
 ctx.fillText(");", x - 110, y + 16);
 ctx.fillText(" - rows = records" + (Math.floor(t * 2) % 2 ? "_" : ""), x - 110, y + 40);
}

function drawCake(ctx, x, y) {
 ctx.fillStyle = "#f9a8d4";
 roundRect(ctx, x - 35, y - 20, 70, 50, 8);
 ctx.fill();
 ctx.fillStyle = "#fbcfe8";
 roundRect(ctx, x - 40, y - 28, 80, 16, 6);
 ctx.fill();
 ctx.fillStyle = "#831843";
 ctx.font = "700 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("Cake?", x, y + 8);
}

function drawMathBook(ctx, x, y) {
 ctx.fillStyle = "#1e3a8a";
 roundRect(ctx, x - 40, y - 48, 80, 96, 4);
 ctx.fill();
 ctx.fillStyle = "#dbeafe";
 roundRect(ctx, x - 28, y - 36, 56, 72, 3);
 ctx.fill();
 ctx.fillStyle = "#1e3a8a";
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("Math", x, y);
 ctx.fillText("only?", x, y + 16);
}

/**
 * @param {object} opts
 * @param {string[]} [opts.headers]
 * @param {string[][]} [opts.data]
 * @param {number} [opts.heat] 0..1 how many rows show
 * @param {number|null} [opts.highlightCol]
 * @param {number|null} [opts.highlightRow]
 * @param {boolean} [opts.headersOnly]
 * @param {boolean} [opts.glowFind]
 * @param {number} [opts.alpha]
 */
function drawGrid(ctx, x, y, cols, rows, opts = {}) {
 const headers = opts.headers || HEADERS;
 const data = opts.data || KIDS;
 const heat = opts.heat ?? 0.9;
 const cw = opts.cw || 58;
 const rh = opts.rh || 24;
 const highlightCol = opts.highlightCol;
 const highlightRow = opts.highlightRow;
 const headersOnly = !!opts.headersOnly;
 const glowFind = !!opts.glowFind;

 ctx.fillStyle = "rgba(15,23,42,0.95)";
 roundRect(ctx, x - 10, y - 30, cols * cw + 20, rows * rh + 44, 10);
 ctx.fill();
 ctx.strokeStyle = ACCENT;
 ctx.lineWidth = 2;
 ctx.stroke();

 for (let c = 0; c < cols; c++) {
 const lit = highlightCol == null || c === highlightCol;
 ctx.fillStyle = lit ? "#134e4a" : "#1e293b";
 roundRect(ctx, x + c * cw, y - 22, cw - 4, rh - 2, 3);
 ctx.fill();
 if (highlightCol === c) {
 ctx.strokeStyle = "#fbbf24";
 ctx.lineWidth = 2;
 ctx.stroke();
 }
 ctx.fillStyle = FG;
 ctx.font = "700 11px Consolas, monospace";
 ctx.textAlign = "center";
 ctx.fillText(headers[c] || "c" + c, x + c * cw + cw / 2 - 2, y - 8);
 }

 if (headersOnly) return;

 const show = Math.max(0, Math.min(rows, Math.floor(heat * (rows + 0.01))));
 for (let r = 0; r < show; r++) {
 for (let c = 0; c < cols; c++) {
 const rowLit = highlightRow == null || r === highlightRow;
 const colLit = highlightCol == null || c === highlightCol;
 const cellFocus = glowFind && highlightRow === r && highlightCol === c;
 ctx.fillStyle = cellFocus
 ? "rgba(250,204,21,0.55)"
 : rowLit && colLit
 ? "rgba(45,212,191,0.38)"
 : rowLit
 ? "rgba(45,212,191,0.22)"
 : "rgba(30,41,59,0.9)";
 roundRect(ctx, x + c * cw, y + r * rh, cw - 4, rh - 2, 3);
 ctx.fill();
 if (cellFocus) {
 ctx.strokeStyle = "#fbbf24";
 ctx.lineWidth = 2;
 ctx.stroke();
 }
 ctx.fillStyle = FG;
 ctx.font = "600 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText((data[r] && data[r][c]) || "·", x + c * cw + cw / 2 - 2, y + r * rh + 14);
 }
 }
}

function drawModeChip(ctx, x, y, label, active) {
 ctx.fillStyle = active ? "rgba(56,189,248,0.45)" : "#1e293b";
 roundRect(ctx, x - 40, y - 22, 80, 44, 10);
 ctx.fill();
 ctx.strokeStyle = active ? "#38bdf8" : "rgba(148,163,184,0.4)";
 ctx.lineWidth = 1.5;
 ctx.stroke();
 ctx.fillStyle = FG;
 ctx.font = "600 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(label, x, y);
}

/** Mode-specific stretch showcase (contacts / register / shop / fare / SQL). */
function drawStretchMode(ctx, w, h, mode, t) {
 const cx = w * 0.5;
 const cy = h * 0.38;
 if (mode === "home") {
 drawPhone(ctx, cx - 100, cy, "Contacts");
 drawGrid(ctx, cx + 20, cy - 20, 3, 3, {
 headers: ["id", "name", "phone"],
 data: [
 ["1", "Rafi", "017…"],
 ["2", "Maya", "018…"],
 ["3", "Nila", "019…"],
 ],
 heat: 0.95,
 cw: 48,
 rh: 18,
 });
 } else if (mode === "school") {
 drawRegisterBook(ctx, cx - 110, cy, 0.85);
 drawGrid(ctx, cx - 20, cy - 30, 3, 3, { heat: 0.95, cw: 52, rh: 20 });
 } else if (mode === "shop") {
 drawShopShelf(ctx, cx - 90, cy);
 drawGrid(ctx, cx + 40, cy - 30, 3, 3, {
 headers: ["sku", "item", "stock"],
 data: [
 ["A1", "Rice", "40"],
 ["A2", "Oil", "12"],
 ["A3", "Soap", "28"],
 ],
 heat: 0.95,
 cw: 48,
 rh: 18,
 });
 } else if (mode === "bd") {
 drawFareBoard(ctx, cx, cy);
 } else {
 drawSqlTerminal(ctx, cx, cy, t);
 }
}

function drawMythDiagram(ctx, w, h, idx, phase) {
 const cx = w * 0.5;
 const cy = h * 0.48;
 if (idx === 0) {
 if (phase === "claim") {
 drawMathBook(ctx, cx, cy);
 } else {
 drawPhone(ctx, cx - 90, cy, "App");
 drawGrid(ctx, cx + 10, cy - 20, 3, 2, { heat: 1, cw: 44, rh: 16 });
 }
 } else if (idx === 1) {
 if (phase === "claim") drawStickyPile(ctx, cx, cy, 5);
 else drawGrid(ctx, cx - 80, cy - 30, 3, 2, { heat: 1, cw: 50, rh: 18 });
 } else if (idx === 2) {
 if (phase === "claim") {
 drawGrid(ctx, cx - 80, cy - 30, 3, 2, { heat: 0.7, cw: 50, rh: 18 });
 ctx.fillStyle = "rgba(248,113,113,0.35)";
 roundRect(ctx, cx - 90, cy - 50, 180, 90, 6);
 ctx.fill();
 drawLabel(ctx, "Row = column?", cx, cy + 70, { color: "#fecaca" });
 } else {
 drawGrid(ctx, cx - 90, cy - 40, 3, 3, {
 heat: 1,
 highlightRow: 1,
 highlightCol: 2,
 cw: 50,
 rh: 18,
 });
 drawLabel(ctx, "ROW = record · COLUMN = field", cx, cy + 70, { color: "#bbf7d0" });
 }
 } else if (idx === 3) {
 if (phase === "claim") {
 ctx.fillStyle = FG;
 ctx.font = "700 36px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("18+", cx, cy);
 } else {
 drawGrid(ctx, cx - 80, cy - 30, 3, 2, { heat: 1, cw: 50, rh: 18 });
 drawLabel(ctx, "Kids can read id · name · city", cx, cy + 60, { color: "#bbf7d0" });
 }
 } else if (phase === "claim") {
 drawCake(ctx, cx, cy);
 } else {
 drawGrid(ctx, cx - 80, cy - 30, 3, 2, {
 headers: ["id", "name", "city"],
 heat: 1,
 highlightCol: 1,
 cw: 50,
 rh: 18,
 });
 drawLabel(ctx, "Fields like name - not desserts", cx, cy + 60, { color: "#bbf7d0" });
 }
}

function drawDrillVisual(ctx, w, h, prompt) {
 const p = (prompt || "").toLowerCase();
 const cx = w * 0.5;
 const cy = h * 0.42;
 if (p.includes("mess")) {
 drawStickyPile(ctx, cx, cy, 5);
 drawLabel(ctx, "Mess ≠ neat table", cx, cy + 70, { color: "#fde68a" });
 } else if (p.includes("column")) {
 drawGrid(ctx, cx - 90, cy - 40, 3, 3, { heat: 0.9, highlightCol: 1 });
 drawLabel(ctx, "Column = named field", cx, cy + 80, { color: "#bbf7d0" });
 } else if (p.includes("one row") || p.includes("row")) {
 drawGrid(ctx, cx - 90, cy - 40, 3, 3, { heat: 0.9, highlightRow: 0 });
 drawLabel(ctx, "Row = one whole record", cx, cy + 80, { color: "#bbf7d0" });
 } else if (p.includes("cell") || p.includes("find") || p.includes("city")) {
 drawGrid(ctx, cx - 90, cy - 40, 3, 3, {
 heat: 1,
 highlightRow: 1,
 highlightCol: 2,
 glowFind: true,
 });
 drawLabel(ctx, "Cell = value at crossing", cx, cy + 80, { color: "#fde68a" });
 } else if (p.includes("id") || p.includes("key")) {
 drawGrid(ctx, cx - 90, cy - 40, 3, 3, { heat: 0.9, highlightCol: 0 });
 drawLabel(ctx, "id helps tell rows apart", cx, cy + 80, { color: "#fde68a" });
 } else if (p.includes("register")) {
 drawRegisterBook(ctx, cx - 100, cy, 0.85);
 drawGrid(ctx, cx - 10, cy - 30, 3, 2, { heat: 1, cw: 48, rh: 18 });
 } else if (p.includes("rule") || p.includes("table rule")) {
 drawGrid(ctx, cx - 90, cy - 40, 3, 3, { heat: 1 });
 ctx.fillStyle = "rgba(45,212,191,0.3)";
 roundRect(ctx, cx - 120, cy + 55, 240, 28, 8);
 ctx.fill();
 ctx.fillStyle = FG;
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("rows under named columns", cx, cy + 72);
 } else if (p.includes("cake")) {
 drawCake(ctx, cx, cy);
 drawLabel(ctx, "Not a field", cx, cy + 60, { color: "#fde68a" });
 } else {
 drawGrid(ctx, cx - 90, cy - 40, 3, 3, { heat: 0.9 });
 }
}

export function registerTableScenes(arena) {
 if (!arena?.registerScene) return;
 const P = "table";

 arena.registerScene(P + "Meet", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions, setIntentHandler } =
 api;
 labState.phase = opts.phase || labState.phase || "desk";
 const descs = {
 desk: "Tap the register or blank sheet - a grid appears on the desk.",
 columns: "Headers light up across: id, name, city are fields.",
 rows: "Each horizontal line is one kid record.",
 predict: "One whole kid - across a row, or down a column?",
 settle: "Useful data lives in neat rows and columns.",
 };
 setDescription(descs[labState.phase] || descs.desk);
 const props = { register: { x: 0, y: 0 }, sheet: { x: 0, y: 0 }, ready: false };
 let pour = 0;

 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && (intent.meta?.action === "pour" || intent.meta?.propId === "register")) {
 pour = Math.min(1, pour + 0.2);
 labState.scale = Math.min(1, (labState.scale || 0) + 0.15);
 pulseSuccessFeedback(180);
 }
 if (intent.type === "CANVAS_DRAG" && intent.meta?.propId === "register") {
 props.register.x = intent.x;
 props.register.y = intent.y;
 }
 });

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const live = labState.phase || "desk";
 drawBackdrop();
 if (!props.ready) {
 props.register.x = layout.leftProp?.x || w * 0.16;
 props.register.y = layout.deskTop || h * 0.72;
 props.sheet.x = w * 0.5;
 props.sheet.y = h * 0.42;
 props.ready = true;
 }

 drawRegisterBook(ctx, props.register.x, props.register.y, 0.5 + pour * 0.4);
 const gx = w * 0.28;
 const gy = h * 0.34;

 if (live === "desk") {
 drawPaperSheet(ctx, gx, gy - 10, 190, 130);
 if (pour > 0.15 || (labState.scale || 0) > 0.1) {
 drawGrid(ctx, gx + 12, gy + 28, 3, 3, { heat: 0.05, headersOnly: true });
 }
 } else if (live === "columns") {
 drawGrid(ctx, gx, gy, 3, 3, {
 heat: 0.05,
 headersOnly: false,
 highlightCol: Math.floor((performance.now() / 900) % 3),
 });
 } else if (live === "rows") {
 const pulseRow = Math.floor((performance.now() / 1100) % 3);
 drawGrid(ctx, gx, gy, 3, 3, { heat: 0.95, highlightRow: pulseRow });
 } else if (live === "predict") {
 drawGrid(ctx, gx, gy, 3, 3, { heat: 0.95, highlightRow: 1 });
 ctx.strokeStyle = "#fbbf24";
 ctx.lineWidth = 2;
 ctx.setLineDash([6, 4]);
 ctx.strokeRect(gx - 4, gy + 24, 170, 22);
 ctx.setLineDash([]);
 drawLabel(ctx, "Whole kid = one row across?", w * 0.5, gy + 110, {
 color: "#fde68a",
 font: "700 12px Segoe UI",
 });
 } else {
 drawGrid(ctx, gx, gy, 3, 3, { heat: 0.95 });
 }

 drawLabel(ctx, descs[live] || descs.desk, w * 0.5, layout.labelY, { maxW: w * 0.9 });
 setHitRegions([
 {
 id: "register",
 shape: "rect",
 x: props.register.x,
 y: props.register.y - 10,
 w: 70,
 h: 90,
 meta: { action: "pour", propId: "register" },
 },
 {
 id: "grid",
 shape: "rect",
 x: gx + 90,
 y: gy + 40,
 w: 180,
 h: 120,
 meta: { propId: "grid" },
 },
 ]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene(P + "Pattern", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions, setIntentHandler } =
 api;
 const assemble = opts.assemble ?? labState.reveal;
 setDescription("Messy notes become a class register with id, name, city.");
 const pile = { x: 0, y: 0, ready: false };
 let assembleT = assemble === true ? 1 : 0;

 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DRAG" && intent.meta?.propId === "pile") {
 pile.x = intent.x;
 pile.y = intent.y;
 }
 if (intent.type === "CANVAS_TAP" && intent.meta?.propId === "pile") {
 pulseSuccessFeedback(200);
 labState.scale = Math.min(1, (labState.scale || 0) + 0.1);
 }
 });

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 drawBackdrop();
 if (!pile.ready) {
 pile.x = w * 0.22;
 pile.y = h * 0.48;
 pile.ready = true;
 }

 const mode = assemble === true ? "grid" : assemble === "messy" ? "messy" : "start";
 if (mode === "grid") assembleT = Math.min(1, assembleT + 0.02);
 else if (mode === "messy") assembleT = Math.max(0, assembleT - 0.02);
 else assembleT = 0;

 if (mode !== "grid" || assembleT < 0.85) {
 drawStickyPile(ctx, pile.x, pile.y, 5);
 }

 if (mode === "messy") {
 drawLabel(ctx, "Mess holds facts - but hard to search", w * 0.5, layout.labelY);
 drawPaperSheet(ctx, w * 0.55, h * 0.32, 160, 110);
 } else if (mode === "grid") {
 const heat = 0.35 + assembleT * 0.65;
 drawGrid(ctx, w * 0.3, h * 0.34, 3, 3, { heat });
 drawRegisterBook(ctx, w * 0.16, layout.deskTop || h * 0.72, 0.7 + assembleT * 0.2);
 drawLabel(ctx, "Register assemble: rows under id · name · city", w * 0.5, layout.labelY);
 } else {
 drawLabel(ctx, "Sticky notes on the desk - find Maya’s city?", w * 0.5, layout.labelY);
 }

 setHitRegions([
 { id: "pile", shape: "rect", x: pile.x, y: pile.y, w: 100, h: 80, meta: { propId: "pile" } },
 ]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene(P + "Sort", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } =
 api;
 setDescription("Sort table parts, messy data, or not data.");
 const chips = [
 { id: "row", short: "Row", color: 0x22c55e },
 { id: "col", short: "Column", color: 0x38bdf8 },
 { id: "cell", short: "Cell", color: 0x2dd4bf },
 { id: "pk", short: "id key", color: 0xfbbf24 },
 { id: "pile", short: "Mess pile", color: 0xf97316 },
 { id: "scrap", short: "Scrap note", color: 0xef4444 },
 { id: "cake", short: "Cake", color: 0xf472b6 },
 { id: "sock", short: "Sock", color: 0x94a3b8 },
 ];
 const accept = {
 table: ["row", "col", "cell", "pk"],
 messy: ["pile", "scrap"],
 not: ["cake", "sock"],
 };
 const cardPos = {};
 chips.forEach((c) => (cardPos[c.id] = { x: 0, y: 0 }));
 let draggingId = null;
 let lastZones = [];

 function placeChip(chipId, zoneId) {
 if (!(accept[zoneId] || []).includes(chipId)) {
 pulseFailFeedback(400);
 return false;
 }
 labState.placed = { ...(labState.placed || {}), [chipId]: zoneId };
 const session = getActiveSession();
 if (session?.dispatch) session.dispatch({ type: "PLACE_CHIP", chipId, zoneId, accept: accept[zoneId] });
 else labState._placedVersion = (labState._placedVersion || 0) + 1;
 pulseSuccessFeedback(220);
 return true;
 }
 function zoneAt(x, y) {
 for (const z of lastZones) if (x >= z.x && x <= z.x + z.ww && y >= z.y && y <= z.y + z.hh) return z.id;
 return null;
 }

 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DOWN" && intent.meta?.chipId) {
 draggingId = intent.meta.chipId;
 labState.selectedId = intent.meta.chipId;
 }
 if (intent.type === "CANVAS_DRAG" && intent.meta?.chipId && cardPos[intent.meta.chipId]) {
 draggingId = intent.meta.chipId;
 cardPos[intent.meta.chipId].x = intent.x;
 cardPos[intent.meta.chipId].y = intent.y;
 }
 if (intent.type === "CANVAS_TAP" && intent.meta?.chipId) labState.selectedId = intent.meta.chipId;
 if (intent.type === "CANVAS_TAP" && intent.meta?.zoneId && labState.selectedId) {
 placeChip(labState.selectedId, intent.meta.zoneId);
 }
 if (intent.type === "CANVAS_UP" && intent.meta?.chipId) {
 const zoneId = intent.dropMeta?.zoneId || zoneAt(intent.x, intent.y);
 if (zoneId) placeChip(intent.meta.chipId, zoneId);
 draggingId = null;
 } else if (intent.type === "CANVAS_UP") draggingId = null;
 });

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 drawBackdrop();
 drawGrid(ctx, w * 0.72, h * 0.55, 3, 2, { heat: 0.7, cw: 36, rh: 16 });

 const zoneH = Math.max(100, Math.min(h * 0.28, 130));
 const zoneY = Math.max(layout.labelY + 28, h * 0.09);
 const zones = [
 { id: "table", label: "Table part", x: w * 0.02, y: zoneY, ww: w * 0.31, hh: zoneH, color: "#2dd4bf" },
 { id: "messy", label: "Messy data", x: w * 0.35, y: zoneY, ww: w * 0.31, hh: zoneH, color: "#f97316" },
 { id: "not", label: "Not data", x: w * 0.68, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#94a3b8" },
 ];
 lastZones = zones;
 const hits = [];
 for (const z of zones) {
 ctx.fillStyle = "rgba(15,23,42,0.75)";
 roundRect(ctx, z.x, z.y, z.ww, z.hh, 12);
 ctx.fill();
 ctx.strokeStyle = z.color;
 ctx.lineWidth = 2.5;
 ctx.stroke();
 drawLabel(ctx, z.label, z.x + z.ww / 2, z.y + 16, { h: 20, font: "700 11px Segoe UI" });
 hits.push({
 id: "zone-" + z.id,
 shape: "rect",
 x: z.x + z.ww / 2,
 y: z.y + z.hh / 2,
 w: z.ww,
 h: z.hh,
 meta: { zoneId: z.id, accept: accept[z.id] },
 });
 }
 const placed = labState.placed || {};
 const byZone = { table: [], messy: [], not: [] };
 chips.forEach((c) => {
 if (typeof placed[c.id] === "string" && byZone[placed[c.id]]) byZone[placed[c.id]].push(c.id);
 });
 const bankIds = chips.filter((c) => typeof placed[c.id] !== "string").map((c) => c.id);
 const ease = reducedMotion ? 1 : 0.18;
 chips.forEach((c) => {
 let targetX;
 let targetY;
 const zoneKey = typeof placed[c.id] === "string" ? placed[c.id] : null;
 if (zoneKey && byZone[zoneKey]) {
 const z = zones.find((zz) => zz.id === zoneKey);
 const idx = byZone[zoneKey].indexOf(c.id);
 const slot = sortSlotPositions(
 { x: z.x, y: z.y + 18, w: z.ww, h: z.hh - 22 },
 Math.max(byZone[zoneKey].length, 1),
 idx,
 );
 targetX = slot.x;
 targetY = slot.y;
 } else {
 const idx = bankIds.indexOf(c.id);
 targetX = w * 0.14 + (idx % 4) * (w * 0.22);
 targetY = zoneY + zoneH + 36 + Math.floor(idx / 4) * 48;
 }
 const prev = cardPos[c.id];
 if (!prev.x && !prev.y) {
 prev.x = targetX;
 prev.y = targetY;
 }
 if (draggingId !== c.id) {
 prev.x += (targetX - prev.x) * ease;
 prev.y += (targetY - prev.y) * ease;
 }
 ctx.fillStyle = labState.selectedId === c.id ? "rgba(56,189,248,0.35)" : "rgba(15,23,42,0.95)";
 roundRect(ctx, prev.x - 48, prev.y - 16, 96, 32, 8);
 ctx.fill();
 ctx.strokeStyle = "#" + c.color.toString(16).padStart(6, "0");
 ctx.stroke();
 ctx.fillStyle = FG;
 ctx.font = "700 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(c.short, prev.x, prev.y);
 hits.push({
 id: c.id,
 shape: "rect",
 x: prev.x,
 y: prev.y,
 w: 100,
 h: 36,
 meta: { chipId: c.id },
 onDrag(pt) {
 draggingId = c.id;
 prev.x = Math.max(30, Math.min(w - 30, pt.x));
 prev.y = Math.max(30, Math.min(h - 30, pt.y));
 },
 });
 });
 drawLabel(ctx, "Table · Messy · Not data", w * 0.5, layout.labelY);
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene(P + "Lab", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 setDescription("Dial - fill student rows under the same columns.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
 labState.heat = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const heat = labState.heat ?? 0.3;
 drawBackdrop();
 drawRegisterBook(ctx, w * 0.14, layout.deskTop || h * 0.72, 0.7);
 drawGrid(ctx, w * 0.28, h * 0.3, 3, 3, { heat });
 const hx = w * 0.2 + heat * w * 0.6;
 ctx.fillStyle = "rgba(148,163,184,0.35)";
 roundRect(ctx, w * 0.2, h * 0.72 - 4, w * 0.6, 8, 4);
 ctx.fill();
 ctx.fillStyle = ACCENT;
 ctx.beginPath();
 ctx.arc(hx, h * 0.72, 14, 0, Math.PI * 2);
 ctx.fill();
 const tip =
 heat < 0.25
 ? "Headers only - drag to add the first student row"
 : heat < 0.55
 ? "Rafi appears - keep filling"
 : heat < 0.75
 ? "Maya joins - almost a full register"
 : "Full grid - neat rows under named columns";
 drawLabel(ctx, tip, w * 0.5, layout.labelY);
 setHitRegions([{ id: "h", shape: "rect", x: hx, y: h * 0.72, w: 48, h: 48, meta: { action: "stretch" } }]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene(P + "Find", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Scan name → read across to city.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const phase = labState.phase || "headers";
 drawBackdrop();
 let highlightCol = null;
 let highlightRow = null;
 let glowFind = false;
 if (phase === "headers") highlightCol = 2;
 else if (phase === "scan") {
 highlightCol = 1;
 highlightRow = 1;
 } else if (phase === "cell") {
 highlightCol = 2;
 highlightRow = 1;
 glowFind = true;
 } else {
 highlightRow = 1;
 }
 drawGrid(ctx, w * 0.28, h * 0.32, 3, 3, { heat: 1, highlightCol, highlightRow, glowFind });
 const tips = {
 headers: "City column named - you know where to look",
 scan: "Scan down name until Maya",
 cell: "Read across → Ctg in the city cell",
 compare: "Scrap pile would take forever",
 };
 if (phase === "compare") {
 drawStickyPile(ctx, w * 0.78, h * 0.45, 4);
 }
 drawLabel(ctx, tips[phase] || tips.cell, w * 0.5, layout.labelY);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene(P + "Rule", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Useful data lives in neat rows under named columns.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const scale = labState.scale ?? 0;
 const prog = labState.tokenProgress || 0;
 drawBackdrop();

 if (scale < 0.33 && prog < 1) {
 drawPaperSheet(ctx, w * 0.32, h * 0.32, 200, 140);
 drawLabel(ctx, "Everyday blank sheet", w * 0.5, layout.labelY);
 } else if (scale < 0.66 && prog < 3) {
 drawGrid(ctx, w * 0.3, h * 0.36, 3, 3, { heat: 0.05, headersOnly: true });
 drawLabel(ctx, "Named columns (fields)", w * 0.5, layout.labelY);
 } else {
 drawGrid(ctx, w * 0.28, h * 0.32, 3, 3, {
 heat: 0.95,
 highlightRow: 1,
 highlightCol: 2,
 glowFind: scale >= 0.85 || prog >= 4,
 });
 ctx.fillStyle = "rgba(45,212,191,0.25)";
 roundRect(ctx, w * 0.22, h * 0.68, w * 0.56, 36, 10);
 ctx.fill();
 ctx.fillStyle = FG;
 ctx.font = "700 14px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("ROW = record · COLUMN = field", w * 0.5, h * 0.7);
 drawLabel(ctx, "Rows + cell/record highlighted", w * 0.5, layout.labelY);
 }

 ["Useful data", "neat rows", "record", "named columns"].forEach((label, i) => {
 const x = w * 0.14 + i * (w * 0.2);
 ctx.fillStyle = i < prog ? "rgba(74,222,128,0.4)" : "rgba(15,23,42,0.85)";
 roundRect(ctx, x - 48, h * 0.18 - 14, 96, 28, 8);
 ctx.fill();
 ctx.fillStyle = FG;
 ctx.font = "600 10px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(label, x, h * 0.18);
 });
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene(P + "Stretch", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, opts } =
 api;
 const modes = [
 { id: "home", label: "Contacts" },
 { id: "school", label: "Register" },
 { id: "shop", label: "Shop" },
 { id: "bd", label: "Fare" },
 { id: "lab", label: "SQL" },
 ];
 if (opts?.mode) labState.mode = opts.mode;
 const start = performance.now();
 setDescription("Same table idea in real lists.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.mode) {
 labState.mode = intent.meta.mode;
 pulseSuccessFeedback(200);
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const mode = labState.mode || "home";
 const t = (performance.now() - start) / 1000;
 drawBackdrop();
 const hits = [];
 modes.forEach((mm, i) => {
 const x = w * 0.1 + i * (w * 0.18);
 const y = (layout.deskTop || h * 0.78) - 8;
 drawModeChip(ctx, x, y, mm.label, mm.id === mode);
 hits.push({ id: mm.id, shape: "rect", x, y, w: 80, h: 48, meta: { mode: mm.id } });
 });
 drawStretchMode(ctx, w, h, mode, t);
 const captions = {
 home: "Phone contacts - name and number columns",
 school: "Class register - one row per student",
 shop: "Inventory - item + price + stock columns",
 bd: "Rickshaw fare list can be a table too",
 lab: "SQL tables: rows = records, columns = fields",
 };
 drawLabel(ctx, captions[mode] || captions.home, w * 0.5, layout.labelY);
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene(P + "Myth", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const myths = [
 {
 claim: "Tables are only for math class",
 truth: "Apps store people, products, and scores in tables",
 },
 {
 claim: "A messy pile of notes is a table",
 truth: "Tables need clear rows and columns",
 },
 {
 claim: "Columns and rows are the same",
 truth: "Columns are fields; rows are whole records",
 },
 {
 claim: "Only adults can read a table",
 truth: "Kids can read id, name, city grids",
 },
 {
 claim: "Cake is a database column",
 truth: "Columns are fields like name - not desserts",
 },
 ];
 setDescription("Bust table myths.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "flip") {
 labState.mythPhase = labState.mythPhase === "truth" ? "claim" : "truth";
 if (labState.mythPhase === "truth") pulseSuccessFeedback(220);
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const idx = labState.myth ?? 0;
 const phase = labState.mythPhase || "claim";
 const m = myths[idx] || myths[0];
 drawBackdrop();
 ctx.fillStyle = phase === "truth" ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.1)";
 roundRect(ctx, w * 0.08, h * 0.18, w * 0.84, h * 0.52, 16);
 ctx.fill();
 drawMythDiagram(ctx, w, h, idx, phase);
 drawLabel(ctx, phase === "truth" ? "TRUTH: " + m.truth : "Myth: " + m.claim, w * 0.5, layout.labelY, {
 color: phase === "truth" ? "#bbf7d0" : "#fecaca",
 border: phase === "truth" ? "rgba(74,222,128,0.5)" : "rgba(248,113,113,0.5)",
 h: 36,
 font: "700 12px Segoe UI",
 maxW: w * 0.9,
 });
 if (phase === "truth") {
 drawLabel(ctx, "MYTH BUSTED ✓", w * 0.5, h * 0.88, {
 color: "#86efac",
 font: "800 14px Segoe UI",
 });
 }
 drawLabel(ctx, "Myth " + (idx + 1) + " / 5 - Tap card to flip", w * 0.5, h * 0.12, {
 h: 22,
 font: "600 11px Segoe UI",
 });
 setHitRegions([
 { id: "card", shape: "rect", x: w * 0.5, y: h * 0.42, w: w * 0.8, h: h * 0.42, meta: { action: "flip" } },
 ]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene(P + "Drill", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription(labState.prompt || "Table drill");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 drawBackdrop();
 drawLabel(ctx, labState.prompt || "Table drill", w * 0.5, h * 0.12, {
 h: 32,
 font: "700 16px Segoe UI",
 });
 drawDrillVisual(ctx, w, h, labState.prompt);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene(P + "Mastery", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Table Scout mastery.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const locked = labState.masteryStep || 0;
 drawBackdrop();
 const path = ["Meet", "Register", "Fill", "Rule", "Myth"];
 path.forEach((label, i) => {
 const x = w * 0.12 + i * (w * 0.17);
 ctx.fillStyle = i < locked ? ACCENT : "rgba(148,163,184,0.35)";
 roundRect(ctx, x - 32, h * 0.78 - 12, 64, 24, 8);
 ctx.fill();
 ctx.fillStyle = i < locked ? "#0f172a" : FG;
 ctx.font = "600 10px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(label, x, h * 0.78);
 if (i < path.length - 1) {
 ctx.strokeStyle = i < locked - 1 ? ACCENT : "rgba(148,163,184,0.35)";
 ctx.beginPath();
 ctx.moveTo(x + 34, h * 0.78);
 ctx.lineTo(x + w * 0.17 - 34, h * 0.78);
 ctx.stroke();
 }
 });
 // Showcase trio: contacts phone + register grid + shop mini
 drawPhone(ctx, w * 0.16, h * 0.38, "Contacts");
 drawGrid(ctx, w * 0.34, h * 0.3, 3, 2, { heat: 1, cw: 42, rh: 16 });
 drawShopShelf(ctx, w * 0.78, h * 0.38);
 ctx.fillStyle = "rgba(45,212,191,0.3)";
 roundRect(ctx, w * 0.25, h * 0.58, w * 0.5, 40, 12);
 ctx.fill();
 ctx.fillStyle = FG;
 ctx.font = "700 16px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("Table Scout", w * 0.5, h * 0.605);
 drawLabel(ctx, "Same structure · different topics", w * 0.5, layout.labelY);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });
}
