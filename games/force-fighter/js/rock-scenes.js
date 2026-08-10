/**
 * Force Fighter · Mission 1: The Lazy Rock - Canvas 2D scenes (Newton 1 / inertia).
 */
import { forceLabState, chemLabState, pulseFailFeedback, pulseSuccessFeedback } from "./force-state.js";
import { sortSlotPositions, getActiveSession } from "./activity-controller.js";

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
 const tw = ctx.measureText(text).width;
 const bw = tw + 24;
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

function drawRock(ctx, x, y, scale = 1, awake = false) {
 ctx.save();
 ctx.translate(x, y);
 ctx.scale(scale, scale);
 ctx.fillStyle = awake ? "#a8a29e" : "#78716c";
 ctx.beginPath();
 ctx.ellipse(0, 0, 36, 28, 0, 0, Math.PI * 2);
 ctx.fill();
 ctx.fillStyle = "#57534e";
 ctx.beginPath();
 ctx.ellipse(-10, -6, 10, 8, 0.2, 0, Math.PI * 2);
 ctx.fill();
 if (!awake) {
 ctx.fillStyle = "#fef3c7";
 ctx.font = "700 14px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText("z", 28, -22);
 ctx.fillText("z", 36, -34);
 } else {
 ctx.fillStyle = "#fbbf24";
 ctx.beginPath();
 ctx.arc(-8, -4, 3, 0, Math.PI * 2);
 ctx.arc(8, -4, 3, 0, Math.PI * 2);
 ctx.fill();
 }
 ctx.restore();
}

function drawArrow(ctx, x1, y1, x2, y2, color = "#fbbf24") {
 const ang = Math.atan2(y2 - y1, x2 - x1);
 ctx.strokeStyle = color;
 ctx.fillStyle = color;
 ctx.lineWidth = 4;
 ctx.lineCap = "round";
 ctx.beginPath();
 ctx.moveTo(x1, y1);
 ctx.lineTo(x2, y2);
 ctx.stroke();
 ctx.beginPath();
 ctx.moveTo(x2, y2);
 ctx.lineTo(x2 - 12 * Math.cos(ang - 0.4), y2 - 12 * Math.sin(ang - 0.4));
 ctx.lineTo(x2 - 12 * Math.cos(ang + 0.4), y2 - 12 * Math.sin(ang + 0.4));
 ctx.closePath();
 ctx.fill();
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
 ctx.fillStyle = `rgba(251,191,36,${Math.max(0, (until - performance.now()) / 380) * 0.25})`;
 ctx.fillRect(0, 0, w, h);
}

function failShake() {
 const until = forceLabState.failPulse;
 if (!until || performance.now() > until) return 0;
 return Math.sin(performance.now() * 0.08) * 6;
}

export function registerRockScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("rockMeet", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions, setIntentHandler, reducedMotion } =
 api;
 const startPhase = opts.phase || forceLabState.phase || "desk";
 forceLabState.phase = startPhase;
 const start = performance.now();
 const props = {
 door: { x: 0, y: 0, ready: false },
 ball: { x: 0, y: 0, ready: false },
 rock: { x: 0, y: 0, ready: false },
 };
 const descs = {
 desk: "Drag everyday clues - door, ball, sleepy rock.",
 wake: "Drag or flick the rock to wake it with a push.",
 glide: "Watch the rock coast - speed stays flat with no force.",
 settle: "Connect props to the inertia idea - still until unbalanced force.",
 };
 setDescription(descs[startPhase] || descs.desk);

 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "wake") {
 forceLabState.rockAwake = true;
 forceLabState.rockVx = Math.min(1, (forceLabState.rockVx || 0) + 0.25);
 pulseSuccessFeedback(280);
 }
 });

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const t = reducedMotion ? 0 : (performance.now() - start) / 1000;
 const live = forceLabState.phase || startPhase;
 const shake = failShake();
 if (!props.rock.ready) {
 props.door = { x: layout.leftProp.x, y: layout.deskTop - 20, ready: true };
 props.ball = { x: layout.midProp.x, y: layout.deskTop - 10, ready: true };
 props.rock = { x: layout.rightProp.x, y: layout.deskTop - 8, ready: true };
 }
 ctx.save();
 if (shake) ctx.translate(shake, 0);
 drawBackdrop();
 const hits = [];
 const awake = forceLabState.rockAwake || (forceLabState.rockVx || 0) > 0.05;

 if (live === "desk") {
 // Door
 ctx.fillStyle = "#92400e";
 roundRect(ctx, props.door.x - 18, props.door.y - 50, 36, 70, 4);
 ctx.fill();
 ctx.fillStyle = "#fbbf24";
 ctx.beginPath();
 ctx.arc(props.door.x + 10, props.door.y - 10, 4, 0, Math.PI * 2);
 ctx.fill();
 // Ball
 ctx.fillStyle = "#22c55e";
 ctx.beginPath();
 ctx.arc(props.ball.x, props.ball.y, 18, 0, Math.PI * 2);
 ctx.fill();
 drawRock(ctx, props.rock.x, props.rock.y, 0.85, false);
 drawLabel(ctx, "Lazy Rock · Drag clues on the desk", w * 0.5, layout.labelY);
 for (const [id, p] of Object.entries(props)) {
 hits.push({
 id,
 shape: "rect",
 x: p.x,
 y: p.y,
 w: 56,
 h: 70,
 meta: { propId: id },
 onDrag(pt) {
 p.x = Math.max(40, Math.min(w - 40, pt.x));
 p.y = Math.max(50, Math.min(layout.deskTop + 6, pt.y));
 },
 });
 }
 } else if (live === "wake") {
 const rx = w * (0.3 + (forceLabState.rockVx || 0) * 0.35);
 const ry = h * 0.42;
 drawRock(ctx, rx, ry, 1.1, awake);
 if (awake) drawArrow(ctx, rx - 70, ry, rx - 42, ry);
 drawLabel(ctx, awake ? "Awake! An unbalanced push started motion" : "Flick / tap the rock to push it awake", w * 0.5, layout.labelY);
 hits.push({
 id: "rock",
 shape: "rect",
 x: rx,
 y: ry,
 w: 80,
 h: 70,
 meta: { action: "wake", propId: "rock" },
 onDrag(pt) {
 const next = Math.max(0, Math.min(1, (pt.x - w * 0.25) / (w * 0.45)));
 forceLabState.rockVx = next;
 forceLabState.heat = next;
 forceLabState.rockAwake = next > 0.08;
 },
 });
 } else if (live === "glide") {
 const vx = forceLabState.rockVx || 0.55;
 const rx = ((t * 40 * vx) % (w * 0.7)) + w * 0.15;
 const ry = h * 0.42;
 // Glide lane
 ctx.fillStyle = "rgba(56,189,248,0.15)";
 roundRect(ctx, w * 0.1, ry - 40, w * 0.8, 80, 12);
 ctx.fill();
 ctx.strokeStyle = "rgba(56,189,248,0.5)";
 ctx.stroke();
 drawRock(ctx, rx, ry, 1, true);
 drawLabel(ctx, `Speed ~ constant · inertia (no net force)`, w * 0.5, layout.labelY);
 drawLabel(ctx, `v ≈ ${(vx * 8).toFixed(1)}`, rx, ry - 50, { h: 20, font: "700 12px Segoe UI" });
 } else {
 drawRock(ctx, props.rock.x, props.rock.y, 1, true);
 ctx.fillStyle = "#92400e";
 roundRect(ctx, props.door.x - 18, props.door.y - 50, 36, 70, 4);
 ctx.fill();
 ctx.fillStyle = "#22c55e";
 ctx.beginPath();
 ctx.arc(props.ball.x, props.ball.y, 16, 0, Math.PI * 2);
 ctx.fill();
 ctx.strokeStyle = "rgba(251,191,36,0.4)";
 ctx.setLineDash([4, 4]);
 ctx.beginPath();
 ctx.moveTo(props.door.x, props.door.y - 40);
 ctx.lineTo(w * 0.5, h * 0.32);
 ctx.moveTo(props.ball.x, props.ball.y - 16);
 ctx.lineTo(w * 0.5, h * 0.32);
 ctx.moveTo(props.rock.x, props.rock.y - 20);
 ctx.lineTo(w * 0.5, h * 0.32);
 ctx.stroke();
 ctx.setLineDash([]);
 drawLabel(ctx, "Stay still / coast until an unbalanced force acts", w * 0.5, layout.labelY);
 for (const [id, p] of Object.entries(props)) {
 hits.push({
 id,
 shape: "rect",
 x: p.x,
 y: p.y,
 w: 56,
 h: 70,
 meta: { propId: id },
 onDrag(pt) {
 p.x = Math.max(40, Math.min(w - 40, pt.x));
 p.y = Math.max(50, Math.min(layout.deskTop + 6, pt.y));
 },
 });
 }
 }
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 ctx.restore();
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("rockGlide", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } =
 api;
 const start = performance.now();
 setDescription("Drag the speed handle - coasting speed stays flat without a new force.");

 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
 const next = Math.max(0.1, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
 forceLabState.rockVx = next;
 forceLabState.heat = next;
 }
 });

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const t = reducedMotion ? 0 : (performance.now() - start) / 1000;
 const vx = forceLabState.heat ?? forceLabState.rockVx ?? 0.4;
 forceLabState.rockVx = vx;
 drawBackdrop();
 const ry = h * 0.4;
 ctx.fillStyle = "rgba(56,189,248,0.12)";
 roundRect(ctx, w * 0.08, ry - 36, w * 0.84, 72, 10);
 ctx.fill();
 const rx = ((t * 50 * vx) % (w * 0.65)) + w * 0.12;
 drawRock(ctx, rx, ry, 1, true);
 const hx = w * 0.2 + vx * w * 0.6;
 ctx.fillStyle = "#fbbf24";
 ctx.beginPath();
 ctx.arc(hx, ry + 70, 14, 0, Math.PI * 2);
 ctx.fill();
 drawLabel(ctx, "Coast speed", hx, ry + 95, { h: 18, font: "600 11px Segoe UI" });
 drawLabel(ctx, "No new force → speed stays about the same (inertia)", w * 0.5, layout.labelY);
 setHitRegions([{ id: "h", shape: "rect", x: hx, y: ry + 70, w: 48, h: 48, meta: { action: "stretch" } }]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("rockSort", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } =
 api;
 setDescription("Sort: no net force, balanced forces, or unbalanced push.");
 const chips = [
 { id: "drift", text: "Ice drift (no push)", short: "Drift", color: 0x38bdf8 },
 { id: "rest", text: "Rock at rest", short: "Rest", color: 0xa8a29e },
 { id: "shove", text: "Hard shove", short: "Shove", color: 0xfbbf24 },
 { id: "kick", text: "Kick a ball", short: "Kick", color: 0x22c55e },
 { id: "park", text: "Parked van", short: "Park", color: 0x94a3b8 },
 { id: "space", text: "Coast in space", short: "Space", color: 0xa78bfa },
 { id: "brake", text: "Sudden brake", short: "Brake", color: 0xf87171 },
 { id: "table", text: "Book on table", short: "Table", color: 0xd6d3d1 },
 ];
 const accept = {
 none: ["drift", "space"],
 balanced: ["rest", "park", "table"],
 unbalanced: ["shove", "kick", "brake"],
 };
 const cardPos = {};
 chips.forEach((c) => {
 cardPos[c.id] = { x: 0, y: 0 };
 });
 let draggingId = null;
 let lastZones = [];

 function placeChip(chipId, zoneId) {
 if (!chipId || !zoneId) return false;
 if (!(accept[zoneId] || []).includes(chipId)) {
 pulseFailFeedback(400);
 return false;
 }
 forceLabState.placed = { ...(forceLabState.placed || {}), [chipId]: zoneId };
 forceLabState.sortPlaced = Object.keys(forceLabState.placed).length;
 forceLabState.selectedId = chipId;
 const session = getActiveSession();
 if (session?.dispatch) session.dispatch({ type: "PLACE_CHIP", chipId, zoneId, accept: accept[zoneId] });
 else forceLabState._placedVersion = (forceLabState._placedVersion || 0) + 1;
 pulseSuccessFeedback(220);
 return true;
 }

 function zoneAt(x, y) {
 for (const z of lastZones) {
 if (x >= z.x && x <= z.x + z.ww && y >= z.y && y <= z.y + z.hh) return z.id;
 }
 return null;
 }

 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DOWN" && intent.meta?.chipId) {
 draggingId = intent.meta.chipId;
 forceLabState.selectedId = intent.meta.chipId;
 }
 if (intent.type === "CANVAS_DRAG" && intent.meta?.chipId && cardPos[intent.meta.chipId]) {
 draggingId = intent.meta.chipId;
 cardPos[intent.meta.chipId].x = intent.x;
 cardPos[intent.meta.chipId].y = intent.y;
 }
 if (intent.type === "CANVAS_TAP" && intent.meta?.chipId) forceLabState.selectedId = intent.meta.chipId;
 if (intent.type === "CANVAS_TAP" && intent.meta?.zoneId && forceLabState.selectedId) {
 placeChip(forceLabState.selectedId, intent.meta.zoneId);
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
 const zoneH = Math.max(100, Math.min(h * 0.28, 130));
 const zoneY = Math.max(layout.labelY + 28, h * 0.09);
 const zones = [
 { id: "none", label: "No net force / coast", x: w * 0.03, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#38bdf8" },
 { id: "balanced", label: "Balanced (stay put)", x: w * 0.35, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#a8a29e" },
 { id: "unbalanced", label: "Unbalanced push", x: w * 0.67, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#fbbf24" },
 ];
 lastZones = zones;
 const hits = [];
 for (const z of zones) {
 ctx.fillStyle = "rgba(28,25,23,0.7)";
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
 const placed = forceLabState.placed || {};
 const byZone = {
 none: chips.filter((c) => placed[c.id] === "none").map((c) => c.id),
 balanced: chips.filter((c) => placed[c.id] === "balanced").map((c) => c.id),
 unbalanced: chips.filter((c) => placed[c.id] === "unbalanced").map((c) => c.id),
 };
 const bankIds = chips.filter((c) => typeof placed[c.id] !== "string").map((c) => c.id);
 const bankTop = zoneY + zoneH + 30;
 const ease = reducedMotion ? 1 : 0.18;
 chips.forEach((c) => {
 let targetX;
 let targetY;
 const zoneKey = typeof placed[c.id] === "string" ? placed[c.id] : null;
 if (zoneKey && byZone[zoneKey]) {
 const z = zones.find((zz) => zz.id === zoneKey);
 const idx = byZone[zoneKey].indexOf(c.id);
 const slot = sortSlotPositions({ x: z.x, y: z.y + 18, w: z.ww, h: z.hh - 22 }, Math.max(byZone[zoneKey].length, 1), idx);
 targetX = slot.x;
 targetY = slot.y;
 } else {
 const idx = bankIds.indexOf(c.id);
 targetX = w * 0.14 + (idx % 4) * (w * 0.22);
 targetY = bankTop + Math.floor(idx / 4) * 48;
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
 const selected = forceLabState.selectedId === c.id;
 ctx.fillStyle = selected ? "rgba(251,191,36,0.35)" : "rgba(41,37,36,0.95)";
 roundRect(ctx, prev.x - 48, prev.y - 18, 96, 36, 10);
 ctx.fill();
 ctx.strokeStyle = "#" + c.color.toString(16).padStart(6, "0");
 ctx.stroke();
 ctx.fillStyle = "#fef3c7";
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(c.short, prev.x, prev.y);
 hits.push({
 id: c.id,
 shape: "rect",
 x: prev.x,
 y: prev.y,
 w: 100,
 h: 40,
 meta: { chipId: c.id },
 onDrag(pt) {
 draggingId = c.id;
 prev.x = Math.max(30, Math.min(w - 30, pt.x));
 prev.y = Math.max(30, Math.min(h - 30, pt.y));
 },
 });
 });
 drawLabel(ctx, "Force or not? Sort the stories", w * 0.5, layout.labelY);
 if (forceLabState.reveal) {
 drawLabel(ctx, "Unbalanced force changes motion · balanced/none keeps it", w * 0.5, zoneY + zoneH + 14, {
 h: 20,
 font: "600 11px Segoe UI",
 });
 }
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("rockWall", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } =
 api;
 const start = performance.now();
 setDescription("Slide the rock into the wall - wall force points opposite the motion.");

 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
 const next = Math.max(0, Math.min(1, (intent.x - api.width * 0.15) / (api.width * 0.55)));
 forceLabState.heat = next;
 forceLabState.rockVx = next;
 if (next > 0.85) {
 forceLabState.wallHit = 1;
 pulseSuccessFeedback(300);
 }
 }
 });

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const t = reducedMotion ? 0 : (performance.now() - start) / 1000;
 const prog = forceLabState.heat ?? 0;
 drawBackdrop();
 const ry = h * 0.4;
 const wallX = w * 0.78;
 ctx.fillStyle = "#78716c";
 ctx.fillRect(wallX, ry - 70, 28, 140);
 const rx = w * 0.18 + prog * (wallX - w * 0.18 - 50);
 drawRock(ctx, rx, ry, 1, true);
 if (prog > 0.2) drawArrow(ctx, rx - 50, ry, rx - 28, ry, "#fbbf24");
 if (prog > 0.85 || forceLabState.wallHit) {
 drawArrow(ctx, wallX - 8, ry, rx + 40, ry, "#38bdf8");
 drawLabel(ctx, "Wall pushes LEFT (opposite motion)", w * 0.5, ry - 70);
 }
 const hx = w * 0.15 + prog * w * 0.55;
 ctx.fillStyle = "#fbbf24";
 ctx.beginPath();
 ctx.arc(hx, ry + 75, 14, 0, Math.PI * 2);
 ctx.fill();
 drawLabel(ctx, prog > 0.85 ? "Hit! Force from wall stops the rock" : "Slide rock into the wall", w * 0.5, layout.labelY);
 setHitRegions([{ id: "h", shape: "rect", x: hx, y: ry + 75, w: 48, h: 48, meta: { action: "stretch" } }]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("rockRule", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 const start = performance.now();
 setDescription("Rule tokens: objects keep doing what they are doing until unbalanced force.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const t = (performance.now() - start) / 1000;
 const prog = forceLabState.tokenProgress || 0;
 drawBackdrop();
 const tokens = ["Stay still", "or coast", "until", "FORCE"];
 tokens.forEach((label, i) => {
 const x = w * 0.18 + i * (w * 0.18);
 const on = i < prog;
 ctx.fillStyle = on ? "rgba(251,191,36,0.35)" : "rgba(41,37,36,0.9)";
 roundRect(ctx, x - 48, h * 0.34 - 18, 96, 36, 10);
 ctx.fill();
 ctx.strokeStyle = on ? "#fbbf24" : "#57534e";
 ctx.stroke();
 ctx.fillStyle = on ? "#fef3c7" : "#a8a29e";
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(label, x, h * 0.34);
 });
 drawRock(ctx, w * 0.5, h * 0.58, 1, prog >= 3);
 drawLabel(ctx, "Inertia · Newton’s first law idea", w * 0.5, layout.labelY);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("rockStretch", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } =
 api;
 const start = performance.now();
 const modes = ["door", "ice", "space", "belt", "asteroid"];
 setDescription("Tap contexts - same inertia idea in new places.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.mode) {
 forceLabState.mode = intent.meta.mode;
 pulseSuccessFeedback(200);
 }
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "nudge") {
 forceLabState.rockVx = Math.min(1, (forceLabState.rockVx || 0) + 0.15);
 pulseSuccessFeedback(200);
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const t = reducedMotion ? 0 : (performance.now() - start) / 1000;
 const mode = forceLabState.mode || "door";
 drawBackdrop();
 const hits = [];
 const modeLabels = { door: "Door", ice: "Ice", space: "Space", belt: "Belt", asteroid: "Rock" };
 modes.forEach((m, i) => {
 const x = w * 0.12 + i * (w * 0.17);
 const on = m === mode;
 ctx.fillStyle = on ? "rgba(251,191,36,0.4)" : "#292524";
 roundRect(ctx, x - 36, layout.deskTop - 36, 72, 48, 10);
 ctx.fill();
 ctx.fillStyle = "#fef3c7";
 ctx.font = "600 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(modeLabels[m] || m, x, layout.deskTop - 10);
 hits.push({ id: m, shape: "rect", x, y: layout.deskTop - 12, w: 72, h: 48, meta: { mode: m } });
 });
 const cy = h * 0.34;
 if (mode === "space" || mode === "asteroid") {
 for (let i = 0; i < 12; i++) {
 ctx.fillStyle = "#fef3c7";
 ctx.beginPath();
 ctx.arc((i * 97 + t * 20) % w, 40 + (i % 5) * 18, 1.5, 0, Math.PI * 2);
 ctx.fill();
 }
 const ax = w * 0.35 + (forceLabState.rockVx || 0.3) * w * 0.3;
 drawRock(ctx, ax, cy, 0.7, true);
 hits.push({ id: "nudge", shape: "rect", x: ax, y: cy, w: 70, h: 60, meta: { action: "nudge" } });
 } else if (mode === "ice") {
 ctx.fillStyle = "rgba(125,211,252,0.25)";
 roundRect(ctx, w * 0.2, cy - 20, w * 0.6, 50, 8);
 ctx.fill();
 drawRock(ctx, w * 0.3 + ((t * 30) % (w * 0.4)), cy, 0.9, true);
 } else if (mode === "belt") {
 ctx.fillStyle = "#57534e";
 ctx.fillRect(w * 0.2, cy + 10, w * 0.6, 14);
 drawRock(ctx, w * 0.25 + ((t * 40) % (w * 0.5)), cy, 0.85, true);
 } else {
 ctx.fillStyle = "#92400e";
 roundRect(ctx, w * 0.42, cy - 40, 50, 80, 4);
 ctx.fill();
 drawArrow(ctx, w * 0.35, cy, w * 0.42, cy);
 }
 const captions = {
 door: "Door stays shut until you push",
 ice: "Ice glide - little friction, coasts longer",
 space: "Space coast - almost no force, keeps velocity",
 belt: "Conveyor adds a force that changes motion",
 asteroid: "Tap asteroid to nudge - force changes velocity",
 };
 drawLabel(ctx, captions[mode] || "Stretch", w * 0.5, layout.labelY);
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("rockMyth", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } = api;
 const start = performance.now();
 setDescription("Bust inertia myths - canvas shows push vs coast vs balance.");
 const myths = [
 { claim: "A kick keeps pushing the ball forever", truth: "Kick is short; then inertia + friction", kind: "kick" },
 { claim: "Moving things need a constant push to keep going", truth: "Coasting needs no net force", kind: "coast" },
 { claim: "Heavier objects fall because they want to stop more", truth: "Inertia resists change; gravity is separate", kind: "heavy" },
 { claim: "If something is moving there must be a force on it now", truth: "It can coast with zero net force", kind: "moving" },
 { claim: "Rest means no forces at all", truth: "Rest can mean balanced forces (net zero)", kind: "rest" },
 ];
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "flip") {
 forceLabState.mythPhase = forceLabState.mythPhase === "truth" ? "claim" : "truth";
 if (forceLabState.mythPhase === "truth") pulseSuccessFeedback(220);
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const t = reducedMotion ? 0 : (performance.now() - start) / 1000;
 const idx = forceLabState.myth ?? 0;
 const phase = forceLabState.mythPhase || "claim";
 const m = myths[idx] || myths[0];
 drawBackdrop();
 ctx.fillStyle = phase === "truth" ? "rgba(52,211,153,0.18)" : "rgba(248,113,113,0.16)";
 roundRect(ctx, w * 0.1, h * 0.1, w * 0.8, 44, 12);
 ctx.fill();
 drawLabel(ctx, phase === "truth" ? m.truth : `Myth: ${m.claim}`, w * 0.5, h * 0.12 + 10, {
 h: 28,
 font: "700 12px Segoe UI",
 });
 const cx = w * 0.5;
 const cy = h * 0.42;
 if (phase === "claim") {
 ctx.fillStyle = "rgba(248,113,113,0.22)";
 ctx.beginPath();
 ctx.arc(cx, cy, 48, 0, Math.PI * 2);
 ctx.fill();
 drawLabel(ctx, "Claim?", cx, cy + 70, { h: 20, font: "600 12px Segoe UI" });
 } else if (m.kind === "kick") {
 ctx.fillStyle = "#22c55e";
 ctx.beginPath();
 ctx.arc(cx - 40, cy, 16, 0, Math.PI * 2);
 ctx.fill();
 drawArrow(ctx, cx - 70, cy, cx - 50, cy, "#fbbf24");
 drawLabel(ctx, "Short kick only", cx - 40, cy - 40, { h: 18, font: "600 11px Segoe UI" });
 drawRock(ctx, cx + 50, cy, 0.7, true);
 drawLabel(ctx, "Then coasts", cx + 50, cy - 40, { h: 18, font: "600 11px Segoe UI" });
 } else if (m.kind === "coast") {
 ctx.fillStyle = "rgba(56,189,248,0.2)";
 roundRect(ctx, w * 0.2, cy - 24, w * 0.6, 48, 10);
 ctx.fill();
 const rx = cx - 60 + ((t * 40) % 120);
 drawRock(ctx, rx, cy, 0.85, true);
 drawLabel(ctx, "No forever-push arrow", cx, cy + 60, { h: 20, font: "600 11px Segoe UI" });
 } else if (m.kind === "heavy") {
 drawRock(ctx, cx - 50, cy, 1.2, true);
 drawRock(ctx, cx + 50, cy, 0.7, true);
 drawLabel(ctx, "Big m", cx - 50, cy + 50, { h: 18, font: "600 11px Segoe UI" });
 drawLabel(ctx, "Small m", cx + 50, cy + 50, { h: 18, font: "600 11px Segoe UI" });
 drawLabel(ctx, "Both resist change (inertia)", cx, cy - 55, { h: 20, font: "600 11px Segoe UI" });
 } else if (m.kind === "moving") {
 drawRock(ctx, cx, cy, 1, true);
 drawLabel(ctx, "v ≠ 0 · F_net can be 0", cx, cy + 55, { h: 20, font: "600 12px Segoe UI" });
 } else {
 drawRock(ctx, cx, cy, 1, false);
 drawArrow(ctx, cx - 70, cy + 40, cx - 20, cy + 40, "#38bdf8");
 drawArrow(ctx, cx + 70, cy + 40, cx + 20, cy + 40, "#fbbf24");
 drawLabel(ctx, "Balanced forces · still at rest", cx, cy - 50, { h: 20, font: "600 11px Segoe UI" });
 }
 drawLabel(ctx, `Myth ${idx + 1} / 5 · Tap diagram to flip`, w * 0.5, layout.labelY);
 setHitRegions([{ id: "card", shape: "rect", x: w * 0.5, y: h * 0.42, w: w * 0.8, h: h * 0.45, meta: { action: "flip" } }]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("rockDrill", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription(forceLabState.prompt || "Force drill");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const p = String(forceLabState.prompt || "").toLowerCase();
 drawBackdrop();
 ctx.fillStyle = "rgba(251,191,36,0.15)";
 ctx.fillRect(0, 0, w, h * 0.18);
 drawLabel(ctx, forceLabState.prompt || "Speed drill!", w * 0.5, h * 0.1, { h: 28, font: "700 15px Segoe UI" });
 const cx = w * 0.5;
 const cy = h * 0.48;
 if (p.includes("space")) {
 for (let i = 0; i < 10; i++) {
 ctx.fillStyle = "#fef3c7";
 ctx.beginPath();
 ctx.arc((i * 73) % w, 80 + (i % 4) * 20, 1.5, 0, Math.PI * 2);
 ctx.fill();
 }
 drawRock(ctx, cx, cy, 0.75, true);
 drawLabel(ctx, "Engines off · keeps v", cx, cy + 55, { h: 18, font: "600 11px Segoe UI" });
 } else if (p.includes("wall")) {
 ctx.fillStyle = "#78716c";
 ctx.fillRect(w * 0.72, cy - 50, 24, 100);
 drawRock(ctx, cx - 20, cy, 0.9, true);
 drawArrow(ctx, w * 0.7, cy, cx + 20, cy, "#38bdf8");
 } else {
 // book on table / balanced
 ctx.fillStyle = "#78716c";
 roundRect(ctx, cx - 70, cy + 10, 140, 16, 4);
 ctx.fill();
 ctx.fillStyle = "#fbbf24";
 roundRect(ctx, cx - 28, cy - 18, 56, 28, 4);
 ctx.fill();
 drawArrow(ctx, cx, cy + 40, cx, cy + 10, "#38bdf8");
 drawArrow(ctx, cx, cy - 40, cx, cy - 18, "#fbbf24");
 drawLabel(ctx, "Balanced ↑↓", cx, cy + 70, { h: 18, font: "600 11px Segoe UI" });
 }
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("rockMastery", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Lazy Rock mastery.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const locked = forceLabState.masteryStep || 0;
 drawBackdrop();
 ["Meet", "Glide", "Sort", "Wall", "Rule", "Badge"].forEach((label, i) => {
 const x = w * 0.1 + i * (w * 0.14);
 ctx.fillStyle = i < locked ? "#fbbf24" : "rgba(148,163,184,0.35)";
 roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8);
 ctx.fill();
 ctx.fillStyle = "#1c1917";
 ctx.font = "600 10px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(label, x, h * 0.78);
 });
 // Showcase: rest → push → coast
 drawRock(ctx, w * 0.22, h * 0.38, 0.85, false);
 drawLabel(ctx, "Rest", w * 0.22, h * 0.52, { h: 18, font: "600 11px Segoe UI" });
 drawArrow(ctx, w * 0.32, h * 0.38, w * 0.42, h * 0.38);
 drawRock(ctx, w * 0.52, h * 0.38, 0.95, true);
 drawLabel(ctx, "Push", w * 0.52, h * 0.52, { h: 18, font: "600 11px Segoe UI" });
 drawArrow(ctx, w * 0.62, h * 0.38, w * 0.72, h * 0.38, "#38bdf8");
 drawRock(ctx, w * 0.8, h * 0.38, 0.85, true);
 drawLabel(ctx, "Coast", w * 0.8, h * 0.52, { h: 18, font: "600 11px Segoe UI" });
 drawLabel(ctx, "Rock Rookie!", w * 0.5, layout.labelY);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });
}

// silence unused alias lint in some bundlers
void chemLabState;
