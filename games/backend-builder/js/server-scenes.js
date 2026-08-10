/**
 * Backend Builder - Mission 1: Server Basics - themed Canvas 2D scenes (server).
 */
import { labState, pulseFailFeedback, pulseSuccessFeedback } from "./lab-state.js";
import { sortSlotPositions, getActiveSession } from "./activity-controller.js";

const ACCENT = "#fb923c";
const BORDER = "rgba(251,146,60,0.55)";
const FG = "#ffedd5";

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
 const tw = Math.min(ctx.measureText(text).width + 24, opts.maxW || 540);
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

function drawPhone(ctx, x, y, label = "Client") {
 ctx.fillStyle = "#0f172a";
 roundRect(ctx, x - 28, y - 48, 56, 96, 10); ctx.fill();
 ctx.strokeStyle = ACCENT; ctx.lineWidth = 2; ctx.stroke();
 ctx.fillStyle = "#1e293b";
 roundRect(ctx, x - 22, y - 38, 44, 70, 4); ctx.fill();
 ctx.fillStyle = FG; ctx.font = "700 10px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText(label, x, y + 58);
}
function drawServerRack(ctx, x, y, lit) {
 ctx.fillStyle = "#1e293b";
 roundRect(ctx, x - 40, y - 50, 80, 100, 8); ctx.fill();
 ctx.strokeStyle = ACCENT; ctx.lineWidth = 2.5; ctx.stroke();
 for (let i = 0; i < 4; i++) {
 ctx.fillStyle = lit ? "#22c55e" : "#64748b";
 roundRect(ctx, x - 28, y - 36 + i * 20, 56, 12, 3); ctx.fill();
 }
 ctx.fillStyle = FG; ctx.font = "700 10px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("Server", x, y + 62);
}
function drawPacket(ctx, x, y, label, on) {
 ctx.fillStyle = on ? "rgba(251,146,60,0.9)" : "rgba(51,65,85,0.9)";
 roundRect(ctx, x - 36, y - 14, 72, 28, 8); ctx.fill();
 ctx.fillStyle = "#fff7ed"; ctx.font = "700 11px Consolas, monospace"; ctx.textAlign = "center";
 ctx.fillText(label, x, y);
}
function drawBrowser(ctx, x, y) {
 ctx.fillStyle = "#0f172a";
 roundRect(ctx, x - 70, y - 48, 140, 96, 8); ctx.fill();
 ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 2; ctx.stroke();
 ctx.fillStyle = "#1e293b";
 roundRect(ctx, x - 62, y - 28, 124, 64, 4); ctx.fill();
 ctx.fillStyle = "#64748b";
 roundRect(ctx, x - 58, y - 40, 90, 8, 3); ctx.fill();
 ctx.fillStyle = FG; ctx.font = "700 10px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("Browser", x, y + 62);
}
function drawCloud(ctx, x, y) {
 ctx.fillStyle = "rgba(148,163,184,0.55)";
 ctx.beginPath();
 ctx.arc(x - 28, y, 22, 0, Math.PI * 2);
 ctx.arc(x, y - 10, 28, 0, Math.PI * 2);
 ctx.arc(x + 30, y + 2, 20, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = FG; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("Cloud server", x, y + 42);
}
function drawCake(ctx, x, y) {
 ctx.fillStyle = "#f472b6";
 roundRect(ctx, x - 36, y - 10, 72, 36, 6); ctx.fill();
 ctx.fillStyle = "#fda4af";
 roundRect(ctx, x - 40, y - 28, 80, 22, 8); ctx.fill();
 ctx.fillStyle = "#fbbf24";
 ctx.beginPath(); ctx.arc(x, y - 36, 6, 0, Math.PI * 2); ctx.fill();
 ctx.fillStyle = FG; ctx.font = "700 10px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("Cake?", x, y + 42);
}
function drawStatusBadge(ctx, x, y, code, ok) {
 ctx.fillStyle = ok ? "rgba(34,197,94,0.35)" : "rgba(248,113,113,0.35)";
 roundRect(ctx, x - 40, y - 16, 80, 32, 8); ctx.fill();
 ctx.strokeStyle = ok ? "#22c55e" : "#f87171"; ctx.lineWidth = 2; ctx.stroke();
 ctx.fillStyle = FG; ctx.font = "700 12px Consolas, monospace"; ctx.textAlign = "center";
 ctx.fillText(code, x, y);
}
function drawReqRes(ctx, w, h, heat, phase) {
 const y = h * 0.42;
 drawPhone(ctx, w * 0.22, y);
 drawServerRack(ctx, w * 0.78, y, heat > 0.45 || phase === "glow" || phase === "settle");
 const mid = w * 0.5;
 const on = heat > 0.35 || phase !== "desk";
 if (on) {
 ctx.strokeStyle = ACCENT; ctx.lineWidth = 3; ctx.setLineDash([6, 4]);
 ctx.beginPath(); ctx.moveTo(w * 0.28, y - 10); ctx.lineTo(w * 0.68, y - 10); ctx.stroke();
 ctx.beginPath(); ctx.moveTo(w * 0.68, y + 14); ctx.lineTo(w * 0.28, y + 14); ctx.stroke();
 ctx.setLineDash([]);
 drawPacket(ctx, mid, y - 22, "REQ", true);
 drawPacket(ctx, mid, y + 26, "RES", heat > 0.55 || phase === "settle");
 }
}

/** Mode-specific stretch showcase (home / school / shop / bd / lab). */
function drawStretchMode(ctx, w, h, mode, t) {
 const cx = w * 0.5;
 const cy = h * 0.34;
 if (mode === "home") {
 drawPhone(ctx, cx - 90, cy, "Weather");
 drawCloud(ctx, cx + 90, cy);
 drawPacket(ctx, cx, cy - 28, "GET /wx", true);
 drawPacket(ctx, cx, cy + 28, "JSON", true);
 } else if (mode === "school") {
 drawBrowser(ctx, cx - 100, cy);
 drawServerRack(ctx, cx + 100, cy, true);
 drawPacket(ctx, cx, cy - 20, "grades?", true);
 drawPacket(ctx, cx, cy + 24, "200 OK", true);
 } else if (mode === "shop") {
 // Cart box → order confirmation
 ctx.fillStyle = "#1e293b";
 roundRect(ctx, cx - 120, cy - 36, 72, 56, 8); ctx.fill();
 ctx.strokeStyle = ACCENT; ctx.lineWidth = 2; ctx.stroke();
 ctx.fillStyle = FG; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("CART", cx - 84, cy);
 drawServerRack(ctx, cx + 100, cy, true);
 drawPacket(ctx, cx, cy - 22, "POST /cart", true);
 drawPacket(ctx, cx, cy + 26, "order #42", true);
 } else if (mode === "bd") {
 // BD ticket / bKash style phone + ticket stub
 drawPhone(ctx, cx - 100, cy, "Ticket");
 ctx.fillStyle = "#0f172a";
 roundRect(ctx, cx + 40, cy - 40, 110, 70, 8); ctx.fill();
 ctx.strokeStyle = "#22c55e"; ctx.lineWidth = 2; ctx.stroke();
 ctx.fillStyle = FG; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("Seat A12", cx + 95, cy - 8);
 ctx.fillText("CONFIRMED", cx + 95, cy + 14);
 drawPacket(ctx, cx - 10, cy - 50, "REQ", true);
 } else {
 // API lab terminal
 ctx.fillStyle = "#0f172a";
 roundRect(ctx, cx - 130, cy - 50, 260, 100, 10); ctx.fill();
 ctx.strokeStyle = "#22c55e"; ctx.lineWidth = 2; ctx.stroke();
 ctx.fillStyle = "#4ade80"; ctx.font = "700 12px Consolas, monospace"; ctx.textAlign = "left";
 ctx.fillText("> GET /api/ping", cx - 110, cy - 18);
 ctx.fillText("< 200 { ok: true }", cx - 110, cy + 10);
 ctx.fillText("_", cx - 110 + ((t * 8) % 40), cy + 32);
 }
}

function drawMythDiagram(ctx, w, h, idx, phase, t) {
 const cx = w * 0.5;
 const cy = h * 0.38;
 if (idx === 0) {
 // Browser ≠ server
 drawBrowser(ctx, cx - 100, cy);
 drawServerRack(ctx, cx + 100, cy, phase === "truth");
 if (phase === "claim") {
 drawLabel(ctx, "Browser = server?", cx, cy - 70, { color: "#fecaca", border: "rgba(248,113,113,0.5)" });
 } else {
 ctx.strokeStyle = ACCENT; ctx.setLineDash([5, 4]); ctx.lineWidth = 2;
 ctx.beginPath(); ctx.moveTo(cx - 40, cy); ctx.lineTo(cx + 40, cy); ctx.stroke();
 ctx.setLineDash([]);
 drawLabel(ctx, "Client asks → server answers", cx, cy + 78, { color: "#bbf7d0" });
 }
 } else if (idx === 1) {
 // Pretty colors vs data
 if (phase === "claim") {
 ctx.fillStyle = "#a78bfa";
 roundRect(ctx, cx - 60, cy - 40, 120, 80, 12); ctx.fill();
 drawLabel(ctx, "Only CSS colors?", cx, cy + 70, { color: "#fecaca" });
 } else {
 drawServerRack(ctx, cx - 80, cy, true);
 drawStatusBadge(ctx, cx + 70, cy - 20, "200 OK", true);
 drawPacket(ctx, cx + 70, cy + 24, "{data}", true);
 drawLabel(ctx, "Status + data (CSS is look)", cx, cy + 78, { color: "#bbf7d0" });
 }
 } else if (idx === 2) {
 // Request needs response
 drawPhone(ctx, cx - 90, cy);
 drawServerRack(ctx, cx + 90, cy, true);
 drawPacket(ctx, cx, cy - 30, "REQ", true);
 if (phase === "claim") {
 drawLabel(ctx, "No RES needed?", cx, cy + 78, { color: "#fecaca" });
 } else {
 drawPacket(ctx, cx, cy + 20, "RES / err", true);
 drawLabel(ctx, "Apps wait for RES (or a clear error)", cx, cy + 78, { color: "#bbf7d0" });
 }
 } else if (idx === 3) {
 // Experts only
 drawPhone(ctx, cx - 70, cy);
 drawServerRack(ctx, cx + 70, cy, phase === "truth");
 if (phase === "claim") {
 drawLabel(ctx, "Only experts?", cx, cy + 78, { color: "#fecaca" });
 } else {
 drawLabel(ctx, "Kids: client asks, server answers", cx, cy + 78, { color: "#bbf7d0" });
 }
 } else {
 // Cake ≠ HTTP response
 if (phase === "claim") {
 drawCake(ctx, cx, cy);
 drawLabel(ctx, "Cake as HTTP RES?", cx, cy + 70, { color: "#fecaca" });
 } else {
 drawStatusBadge(ctx, cx - 60, cy, "200", true);
 drawStatusBadge(ctx, cx + 60, cy, "500", false);
 drawLabel(ctx, "Status + data - not snacks", cx, cy + 70, { color: "#bbf7d0" });
 }
 }
 void t;
}

function drawDrillVisual(ctx, w, h, prompt, t) {
 const p = (prompt || "").toLowerCase();
 const cx = w * 0.5;
 const cy = h * 0.4;
 if (/client/i.test(p)) {
 drawPhone(ctx, cx, cy);
 drawLabel(ctx, "Client sends REQ", cx, cy + 78, { color: "#bbf7d0" });
 } else if (/server/i.test(p)) {
 drawServerRack(ctx, cx, cy, true);
 drawPacket(ctx, cx, cy - 70, "RES", true);
 drawLabel(ctx, "Server answers", cx, cy + 78, { color: "#bbf7d0" });
 } else if (/css|color/i.test(p)) {
 ctx.fillStyle = "#ef4444";
 roundRect(ctx, cx - 50, cy - 30, 100, 60, 10); ctx.fill();
 drawLabel(ctx, "color:red = look, not RES", cx, cy + 60, { color: "#fde68a" });
 } else if (/200|ok|status/i.test(p)) {
 drawStatusBadge(ctx, cx, cy, "200 OK", true);
 drawLabel(ctx, "Response status", cx, cy + 50, { color: "#bbf7d0" });
 } else if (/error|err/i.test(p)) {
 drawStatusBadge(ctx, cx, cy, "500", false);
 drawLabel(ctx, "Errors still matter", cx, cy + 50, { color: "#fecaca" });
 } else if (/sock/i.test(p)) {
 ctx.fillStyle = "#94a3b8";
 roundRect(ctx, cx - 30, cy - 40, 60, 80, 20); ctx.fill();
 drawLabel(ctx, "Sock ≠ request body", cx, cy + 60, { color: "#fde68a" });
 } else if (/req|request/i.test(p)) {
 drawPhone(ctx, cx - 80, cy);
 drawPacket(ctx, cx + 40, cy, "REQ", true);
 } else {
 drawReqRes(ctx, w, h, 0.75, "settle");
 }
 void t;
}

export function registerServerScenes(arena) {
 if (!arena?.registerScene) return;
 const P = "server";

 arena.registerScene(P + "Meet", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions } = api;
 labState.phase = opts.phase || labState.phase || "desk";
 setDescription("Server Basics - client asks, server answers.");
 const props = { phone: { x: 0, y: 0 }, rack: { x: 0, y: 0 } };
 let inited = false;
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout;
 const live = labState.phase || "desk";
 const heat = labState.heat || 0.35;
 drawBackdrop();
 if (!inited) {
 props.phone.x = w * 0.25; props.phone.y = h * 0.42;
 props.rack.x = w * 0.75; props.rack.y = h * 0.42;
 inited = true;
 }
 drawReqRes(ctx, w, h, heat, live);
 drawPhone(ctx, props.phone.x, props.phone.y);
 drawServerRack(ctx, props.rack.x, props.rack.y, live !== "desk");
 const tips = {
 desk: "Drag phone (client) and rack (server)",
 glow: "REQ flies out - RES comes back",
 settle: "A request goes in - a response comes back"
 };
 drawLabel(ctx, tips[live] || tips.desk, w * 0.5, layout.labelY);
 const hits = [];
 for (const [id, p] of Object.entries(props)) {
 hits.push({
 id, shape: "rect", x: p.x, y: p.y, w: 90, h: 110, meta: { propId: id },
 onDrag(pt) {
 p.x = Math.max(50, Math.min(w - 50, pt.x));
 p.y = Math.max(80, Math.min(layout.deskTop, pt.y));
 },
 });
 }
 setHitRegions(hits);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene(P + "Sort", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } = api;
 setDescription("Sort request, response, or not server.");
 const chips = [
 { id: "get", short: "GET page", color: 0x22c55e },
 { id: "post", short: "POST form", color: 0x38bdf8 },
 { id: "json", short: "JSON body", color: 0xfbbf24 },
 { id: "ok", short: "200 OK", color: 0x4ade80 },
 { id: "err", short: "500 error", color: 0xf97316 },
 { id: "css", short: "color:red", color: 0xa78bfa },
 { id: "cake", short: "Cake", color: 0xf472b6 },
 { id: "sock", short: "Sock", color: 0x94a3b8 }
 ];
 const accept = {
 req: ["get", "post", "json"],
 res: ["ok", "err"],
 not: ["css", "cake", "sock"]
 };
 const cardPos = {}; chips.forEach((c) => (cardPos[c.id] = { x: 0, y: 0 }));
 let draggingId = null, lastZones = [];
 function placeChip(chipId, zoneId) {
 if (!(accept[zoneId] || []).includes(chipId)) { pulseFailFeedback(400); return false; }
 labState.placed = { ...(labState.placed || {}), [chipId]: zoneId };
 const session = getActiveSession();
 if (session?.dispatch) session.dispatch({ type: "PLACE_CHIP", chipId, zoneId, accept: accept[zoneId] });
 else labState._placedVersion = (labState._placedVersion || 0) + 1;
 pulseSuccessFeedback(220); return true;
 }
 function zoneAt(x, y) {
 for (const z of lastZones) if (x >= z.x && x <= z.x + z.ww && y >= z.y && y <= z.y + z.hh) return z.id;
 return null;
 }
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DOWN" && intent.meta?.chipId) { draggingId = intent.meta.chipId; labState.selectedId = intent.meta.chipId; }
 if (intent.type === "CANVAS_DRAG" && intent.meta?.chipId && cardPos[intent.meta.chipId]) {
 draggingId = intent.meta.chipId; cardPos[intent.meta.chipId].x = intent.x; cardPos[intent.meta.chipId].y = intent.y;
 }
 if (intent.type === "CANVAS_TAP" && intent.meta?.chipId) labState.selectedId = intent.meta.chipId;
 if (intent.type === "CANVAS_TAP" && intent.meta?.zoneId && labState.selectedId) placeChip(labState.selectedId, intent.meta.zoneId);
 if (intent.type === "CANVAS_UP" && intent.meta?.chipId) {
 const zoneId = intent.dropMeta?.zoneId || zoneAt(intent.x, intent.y);
 if (zoneId) placeChip(intent.meta.chipId, zoneId);
 draggingId = null;
 } else if (intent.type === "CANVAS_UP") draggingId = null;
 });
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout;
 drawBackdrop();
 const zoneH = Math.max(100, Math.min(h * 0.28, 130));
 const zoneY = Math.max(layout.labelY + 28, h * 0.09);
 const zones = [
 { id: "req", label: "Request", x: w * 0.02, y: zoneY, ww: w * 0.31, hh: zoneH, color: "#38bdf8" },
 { id: "res", label: "Response", x: w * 0.35, y: zoneY, ww: w * 0.31, hh: zoneH, color: "#22c55e" },
 { id: "not", label: "Not server", x: w * 0.68, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#94a3b8" }
 ];
 lastZones = zones;
 const hits = [];
 for (const z of zones) {
 ctx.fillStyle = "rgba(15,23,42,0.75)"; roundRect(ctx, z.x, z.y, z.ww, z.hh, 12); ctx.fill();
 ctx.strokeStyle = z.color; ctx.lineWidth = 2.5; ctx.stroke();
 drawLabel(ctx, z.label, z.x + z.ww / 2, z.y + 16, { h: 20, font: "700 11px Segoe UI" });
 hits.push({ id: "zone-" + z.id, shape: "rect", x: z.x + z.ww / 2, y: z.y + z.hh / 2, w: z.ww, h: z.hh, meta: { zoneId: z.id, accept: accept[z.id] } });
 }
 const placed = labState.placed || {};
 const byZone = { req: [], res: [], not: [] };
 chips.forEach((c) => { if (typeof placed[c.id] === "string" && byZone[placed[c.id]]) byZone[placed[c.id]].push(c.id); });
 const bankIds = chips.filter((c) => typeof placed[c.id] !== "string").map((c) => c.id);
 const ease = reducedMotion ? 1 : 0.18;
 chips.forEach((c) => {
 let targetX, targetY;
 const zoneKey = typeof placed[c.id] === "string" ? placed[c.id] : null;
 if (zoneKey && byZone[zoneKey]) {
 const z = zones.find((zz) => zz.id === zoneKey);
 const idx = byZone[zoneKey].indexOf(c.id);
 const slot = sortSlotPositions({ x: z.x, y: z.y + 18, w: z.ww, h: z.hh - 22 }, Math.max(byZone[zoneKey].length, 1), idx);
 targetX = slot.x; targetY = slot.y;
 } else {
 const idx = bankIds.indexOf(c.id);
 targetX = w * 0.14 + (idx % 4) * (w * 0.22);
 targetY = zoneY + zoneH + 36 + Math.floor(idx / 4) * 48;
 }
 const prev = cardPos[c.id];
 if (!prev.x && !prev.y) { prev.x = targetX; prev.y = targetY; }
 if (draggingId !== c.id) { prev.x += (targetX - prev.x) * ease; prev.y += (targetY - prev.y) * ease; }
 ctx.fillStyle = labState.selectedId === c.id ? "rgba(56,189,248,0.35)" : "rgba(15,23,42,0.95)";
 roundRect(ctx, prev.x - 48, prev.y - 16, 96, 32, 8); ctx.fill();
 ctx.strokeStyle = "#" + c.color.toString(16).padStart(6, "0"); ctx.stroke();
 ctx.fillStyle = FG; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
 ctx.fillText(c.short, prev.x, prev.y);
 hits.push({ id: c.id, shape: "rect", x: prev.x, y: prev.y, w: 100, h: 36, meta: { chipId: c.id },
 onDrag(pt) { draggingId = c.id; prev.x = Math.max(30, Math.min(w - 30, pt.x)); prev.y = Math.max(30, Math.min(h - 30, pt.y)); } });
 });
 drawLabel(ctx, "Request - Response - Not server", w * 0.5, layout.labelY);
 setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene(P + "Lab", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 setDescription("Dial - strengthen the request/response loop.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
 labState.heat = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
 }
 });
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout;
 const heat = labState.heat ?? 0.3;
 drawBackdrop();
 drawReqRes(ctx, w, h, heat, heat >= 0.6 ? "settle" : "glow");
 if (heat >= 0.55) drawStatusBadge(ctx, w * 0.5, h * 0.58, "200 OK", true);
 const hx = w * 0.2 + heat * w * 0.6;
 ctx.fillStyle = ACCENT; ctx.beginPath(); ctx.arc(hx, h * 0.72, 14, 0, Math.PI * 2); ctx.fill();
 ctx.fillStyle = "rgba(148,163,184,0.35)";
 roundRect(ctx, w * 0.2, h * 0.72 - 4, w * 0.6, 8, 4); ctx.fill();
 drawLabel(ctx, heat >= 0.6 ? "Loop clear - request and response linked" : "Drag - make the REQ/RES path stronger", w * 0.5, layout.labelY);
 setHitRegions([{ id: "h", shape: "rect", x: hx, y: h * 0.72, w: 48, h: 48, meta: { action: "stretch" } }]);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene(P + "Rule", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions } = api;
 setDescription("Request in, response out.");
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout;
 const prog = labState.tokenProgress || 0;
 const scale = labState.scale ?? 0;
 drawBackdrop();
 const cx = w * 0.5;
 const cy = h * 0.38;

 // Scale scrubber visuals: phone desk → REQ/RES packets → REQUEST IN / RESPONSE OUT banner
 // (ScaleLab starts slightly above 0 so we don't fall back to equation tokens.)
 if (scale > 0.02) {
 if (scale < 0.33) {
 drawPhone(ctx, cx - 80, cy);
 drawServerRack(ctx, cx + 80, cy, false);
 drawLabel(ctx, "Desk: client phone + server rack", cx, layout.labelY);
 } else if (scale < 0.66) {
 drawReqRes(ctx, w, h, 0.7, "glow");
 drawLabel(ctx, "Packets: REQ flies out, RES returns", cx, layout.labelY);
 } else {
 drawReqRes(ctx, w, h, 0.95, "settle");
 ctx.fillStyle = "rgba(34,197,94,0.28)";
 roundRect(ctx, cx - 160, h * 0.62, 320, 44, 12); ctx.fill();
 ctx.strokeStyle = "#22c55e"; ctx.lineWidth = 2.5; ctx.stroke();
 ctx.fillStyle = "#bbf7d0"; ctx.font = "800 16px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("REQUEST IN · RESPONSE OUT", cx, h * 0.62 + 24);
 drawLabel(ctx, "Rule locked", cx, layout.labelY, { color: "#86efac" });
 }
 // Scale track hit
 const hx = w * 0.2 + scale * w * 0.6;
 ctx.fillStyle = "rgba(148,163,184,0.35)";
 roundRect(ctx, w * 0.2, h * 0.78 - 4, w * 0.6, 8, 4); ctx.fill();
 ctx.fillStyle = ACCENT; ctx.beginPath(); ctx.arc(hx, h * 0.78, 12, 0, Math.PI * 2); ctx.fill();
 setHitRegions([{
 id: "scale", shape: "rect", x: hx, y: h * 0.78, w: 48, h: 40,
 onDrag(pt) {
 labState.scale = Math.max(0, Math.min(1, (pt.x - w * 0.2) / (w * 0.6)));
 },
 }]);
 } else {
 ["Request", "in", "Response", "out"].forEach((label, i) => {
 const x = w * 0.16 + i * (w * 0.2);
 ctx.fillStyle = i < prog ? "rgba(74,222,128,0.35)" : "rgba(15,23,42,0.9)";
 roundRect(ctx, x - 46, h * 0.28 - 18, 92, 36, 10); ctx.fill();
 ctx.fillStyle = FG; ctx.font = "700 12px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.28);
 });
 drawReqRes(ctx, w, h, prog >= 4 ? 0.9 : 0.4, prog >= 4 ? "settle" : "glow");
 drawLabel(ctx, "Server Basics rule", w * 0.5, layout.labelY);
 setHitRegions([]);
 }
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene(P + "Stretch", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const modes = ["home", "school", "shop", "bd", "lab"];
 const modeLabels = { home: "Home", school: "School", shop: "Shop", bd: "BD ticket", lab: "API lab" };
 const start = performance.now();
 setDescription("Same server idea in places you know.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.mode) { labState.mode = intent.meta.mode; pulseSuccessFeedback(200); }
 });
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout;
 const mode = labState.mode || modes[0];
 const t = (performance.now() - start) / 1000;
 drawBackdrop();
 const hits = [];
 modes.forEach((m, i) => {
 const x = w * 0.12 + i * (w * 0.17);
 const on = m === mode;
 ctx.fillStyle = on ? "rgba(56,189,248,0.4)" : "#1e293b";
 roundRect(ctx, x - 40, layout.deskTop - 36, 80, 48, 10); ctx.fill();
 ctx.strokeStyle = on ? "#38bdf8" : "#475569"; ctx.lineWidth = on ? 2 : 1; ctx.stroke();
 ctx.fillStyle = FG; ctx.font = "600 11px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText(modeLabels[m] || m, x, layout.deskTop - 10);
 hits.push({ id: m, shape: "rect", x, y: layout.deskTop - 12, w: 80, h: 48, meta: { mode: m } });
 });
 drawStretchMode(ctx, w, h, mode, t);
 const captions = {
 home: "App on phone asks a server for weather",
 school: "School portal: browser requests grades",
 shop: "Shop checkout: cart request, order response",
 bd: "bKash / ticket app - same request/response idea",
 lab: "API lab: send REQ, read RES"
 };
 drawLabel(ctx, captions[mode] || captions[modes[0]], w * 0.5, layout.labelY);
 setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene(P + "Myth", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const myths = [
 { claim: "The browser is the server", truth: "Browser is the client - server answers elsewhere" },
 { claim: "Servers only send pretty colors", truth: "Servers send data and status - CSS is look" },
 { claim: "A request never needs a response", truth: "Useful apps wait for a response (or a clear error)" },
 { claim: "Only experts can learn request/response", truth: "Kids can learn client asks, server answers" },
 { claim: "Cake is a valid HTTP response", truth: "Responses are status and data - not snacks" }
 ];
 const start = performance.now();
 setDescription("Bust server myths.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "flip") {
 labState.mythPhase = labState.mythPhase === "truth" ? "claim" : "truth";
 if (labState.mythPhase === "truth") pulseSuccessFeedback(220);
 }
 });
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout;
 const idx = labState.myth ?? 0, phase = labState.mythPhase || "claim";
 const m = myths[idx] || myths[0];
 const t = (performance.now() - start) / 1000;
 drawBackdrop();
 drawMythDiagram(ctx, w, h, idx, phase, t);
 drawLabel(ctx, phase === "truth" ? "TRUTH: " + m.truth : "Myth: " + m.claim, w * 0.5, layout.labelY, {
 color: phase === "truth" ? "#bbf7d0" : "#fecaca",
 border: phase === "truth" ? "rgba(74,222,128,0.5)" : "rgba(248,113,113,0.5)",
 h: 36,
 font: "700 12px Segoe UI",
 maxW: w * 0.9,
 });
 if (phase === "truth") {
 drawLabel(ctx, "MYTH BUSTED ✓", w * 0.5, h * 0.88, { color: "#86efac", font: "800 14px Segoe UI" });
 }
 drawLabel(ctx, "Myth " + (idx + 1) + " / 5", w * 0.5, h * 0.12, { h: 22, font: "600 11px Segoe UI" });
 setHitRegions([{ id: "card", shape: "rect", x: w * 0.5, y: h * 0.4, w: w * 0.8, h: h * 0.45, meta: { action: "flip" } }]);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene(P + "Drill", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 const start = performance.now();
 setDescription(labState.prompt || "Server drill");
 setTick(() => {
 const w = api.width, h = api.height;
 const t = (performance.now() - start) / 1000;
 drawBackdrop();
 drawLabel(ctx, labState.prompt || "Server drill", w * 0.5, h * 0.12, { h: 32, font: "700 16px Segoe UI" });
 drawDrillVisual(ctx, w, h, labState.prompt, t);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene(P + "Mastery", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Server Scout mastery.");
 setTick(() => {
 const w = api.width, h = api.height, layout = api.layout;
 const locked = labState.masteryStep || 0;
 drawBackdrop();
 // Path pips
 ["Meet", "Sort", "Lab", "Rule", "Myth", "Serve"].forEach((label, i) => {
 const x = w * 0.1 + i * (w * 0.14);
 ctx.fillStyle = i < locked ? ACCENT : "rgba(148,163,184,0.35)";
 roundRect(ctx, x - 28, h * 0.82 - 12, 56, 24, 8); ctx.fill();
 ctx.fillStyle = "#0f172a"; ctx.font = "600 10px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.82);
 });
 // Showcase trio: phone client, server rack, 200 OK badge
 drawPhone(ctx, w * 0.22, h * 0.4);
 drawServerRack(ctx, w * 0.5, h * 0.4, true);
 drawStatusBadge(ctx, w * 0.78, h * 0.4, "200 OK", true);
 ctx.strokeStyle = ACCENT; ctx.lineWidth = 2; ctx.setLineDash([5, 4]);
 ctx.beginPath(); ctx.moveTo(w * 0.28, h * 0.38); ctx.lineTo(w * 0.42, h * 0.38); ctx.stroke();
 ctx.beginPath(); ctx.moveTo(w * 0.58, h * 0.42); ctx.lineTo(w * 0.68, h * 0.42); ctx.stroke();
 ctx.setLineDash([]);
 // Banner
 ctx.fillStyle = "rgba(251,146,60,0.28)";
 roundRect(ctx, w * 0.5 - 120, layout.labelY - 18, 240, 36, 12); ctx.fill();
 ctx.strokeStyle = ACCENT; ctx.lineWidth = 2; ctx.stroke();
 ctx.fillStyle = FG; ctx.font = "800 15px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("Server Scout", w * 0.5, layout.labelY + 2);
 failFlash(ctx, w, h); successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });
}
