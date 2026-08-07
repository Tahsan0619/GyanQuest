/**
 * Database & SQL - Mission 3: Keys & Joins - themed Canvas 2D scenes (join).
 */
import { labState, pulseFailFeedback, pulseSuccessFeedback } from "./lab-state.js";
import { sortSlotPositions, getActiveSession } from "./activity-controller.js";

const ACCENT = "#2dd4bf";
const BORDER = "rgba(45,212,191,0.55)";
const FG = "#ccfbf1";

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


function drawMiniTable(ctx, x, y, title, rows) {
 ctx.fillStyle = "#0f172a";
 roundRect(ctx, x - 50, y - 40, 100, 90, 8); ctx.fill();
 ctx.strokeStyle = ACCENT; ctx.lineWidth = 2; ctx.stroke();
 ctx.fillStyle = FG; ctx.font = "700 11px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText(title, x, y - 24);
 rows.forEach((r, i) => {
  ctx.fillStyle = "rgba(45,212,191,0.25)";
  roundRect(ctx, x - 40, y - 10 + i * 22, 80, 18, 4); ctx.fill();
  ctx.fillStyle = FG; ctx.font = "600 10px Consolas, monospace";
  ctx.fillText(r, x, y + i * 22);
 });
}
function drawJoinLink(ctx, w, h, heat, phase) {
 drawMiniTable(ctx, w * 0.28, h * 0.42, "students", ["1 Rafi", "2 Maya"]);
 drawMiniTable(ctx, w * 0.72, h * 0.42, "classes", ["1 Math", "2 Science"]);
 const on = heat > 0.4 || phase === "glow" || phase === "settle";
 if (on) {
  ctx.strokeStyle = ACCENT; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(w * 0.38, h * 0.42); ctx.lineTo(w * 0.62, h * 0.42); ctx.stroke();
  ctx.fillStyle = FG; ctx.font = "700 12px Segoe UI"; ctx.textAlign = "center";
  ctx.fillText("key match", w * 0.5, h * 0.34);
 }
}


export function registerJoinScenes(arena) {
 if (!arena?.registerScene) return;
 const P = "join";

 arena.registerScene(P + "Meet", (api) => {
  const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions } = api;
  labState.phase = opts.phase || labState.phase || "desk";
  setDescription("Keys & Joins - link tables with matching keys.");
  const props = { left: { x: 0, y: 0 }, right: { x: 0, y: 0 } };
  let inited = false;
  setTick(() => {
   const w = api.width, h = api.height, layout = api.layout;
   const live = labState.phase || "desk";
   const heat = labState.heat || 0.35;
   drawBackdrop();
   if (!inited) {
    props.left.x = w * 0.3; props.left.y = h * 0.42;
    props.right.x = w * 0.7; props.right.y = h * 0.42;
    inited = true;
   }
   drawJoinLink(ctx, w, h, heat, live);
   const tips = {
    desk: "Two tables - students and classes",
    glow: "Matching keys draw a link",
    settle: "Keys keep related stories connected"
   };
   drawLabel(ctx, tips[live] || tips.desk, w * 0.5, layout.labelY);
   const hits = [];
   for (const [id, p] of Object.entries(props)) {
    hits.push({
     id, shape: "rect", x: p.x, y: p.y, w: 110, h: 100, meta: { propId: id },
     onDrag(pt) {
      p.x = Math.max(60, Math.min(w - 60, pt.x));
      p.y = Math.max(90, Math.min(layout.deskTop, pt.y));
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
  setDescription("Sort key, join, or not link.");
  const chips = [
   { id: "pk", short: "Primary key", color: 0x22c55e },
   { id: "fk", short: "Foreign key", color: 0x38bdf8 },
   { id: "id", short: "id", color: 0x2dd4bf },
   { id: "join", short: "JOIN", color: 0xfbbf24 },
   { id: "on", short: "ON match", color: 0x4ade80 },
   { id: "orphan", short: "Orphan row", color: 0xf97316 },
   { id: "glue", short: "Glue stick", color: 0xa78bfa },
   { id: "sock", short: "Sock", color: 0x94a3b8 }
  ];
  const accept = {
   key: ["pk", "fk", "id"],
   join: ["join", "on"],
   not: ["orphan", "glue", "sock"]
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
    { id: "key", label: "Key field", x: w * 0.02, y: zoneY, ww: w * 0.31, hh: zoneH, color: "#2dd4bf" },
    { id: "join", label: "Join action", x: w * 0.35, y: zoneY, ww: w * 0.31, hh: zoneH, color: "#fbbf24" },
    { id: "not", label: "Not a link", x: w * 0.68, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#94a3b8" }
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
   const byZone = { key: [], join: [], not: [] };
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
   drawLabel(ctx, "Key - Join - Not a link", w * 0.5, layout.labelY);
   setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
  });
  setDispose(() => setIntentHandler(null));
 });

 arena.registerScene(P + "Lab", (api) => {
  const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
  setDescription("Dial - strengthen the key match.");
  setIntentHandler((intent) => {
   if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
    labState.heat = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
   }
  });
  setTick(() => {
   const w = api.width, h = api.height, layout = api.layout;
   const heat = labState.heat ?? 0.3;
   drawBackdrop();
   drawJoinLink(ctx, w, h, heat, heat >= 0.6 ? "settle" : "glow");
   const hx = w * 0.2 + heat * w * 0.6;
   ctx.fillStyle = ACCENT; ctx.beginPath(); ctx.arc(hx, h * 0.72, 14, 0, Math.PI * 2); ctx.fill();
   ctx.fillStyle = "rgba(148,163,184,0.35)";
   roundRect(ctx, w * 0.2, h * 0.72 - 4, w * 0.6, 8, 4); ctx.fill();
   drawLabel(ctx, heat >= 0.6 ? "Keys match - tables linked" : "Drag - strengthen the key match line", w * 0.5, layout.labelY);
   setHitRegions([{ id: "h", shape: "rect", x: hx, y: h * 0.72, w: 48, h: 48, meta: { action: "stretch" } }]);
   failFlash(ctx, w, h); successFlash(ctx, w, h);
  });
  setDispose(() => setIntentHandler(null));
 });

 arena.registerScene(P + "Rule", (api) => {
  const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
  setDescription("Keys link related rows.");
  setTick(() => {
   const w = api.width, h = api.height, layout = api.layout, prog = labState.tokenProgress || 0;
   drawBackdrop();
   ["Key", "Match", "Join", "Link"].forEach((label, i) => {
    const x = w * 0.16 + i * (w * 0.2);
    ctx.fillStyle = i < prog ? "rgba(74,222,128,0.35)" : "rgba(15,23,42,0.9)";
    roundRect(ctx, x - 46, h * 0.32 - 18, 92, 36, 10); ctx.fill();
    ctx.fillStyle = FG; ctx.font = "700 12px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.32);
   });
   drawJoinLink(ctx, w, h, prog >= 4 ? 0.9 : 0.3, prog >= 4 ? "settle" : "desk");
   drawLabel(ctx, "Keys & Joins rule", w * 0.5, layout.labelY);
   failFlash(ctx, w, h); successFlash(ctx, w, h);
  });
  setDispose(() => {});
 });

 arena.registerScene(P + "Stretch", (api) => {
  const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
  const modes = ["home", "school", "shop", "bd", "lab"];
  setDescription("Same join idea in real links.");
  setIntentHandler((intent) => {
   if (intent.type === "CANVAS_TAP" && intent.meta?.mode) { labState.mode = intent.meta.mode; pulseSuccessFeedback(200); }
  });
  setTick(() => {
   const w = api.width, h = api.height, layout = api.layout, mode = labState.mode || modes[0];
   drawBackdrop();
   const hits = [];
   modes.forEach((m, i) => {
    const x = w * 0.12 + i * (w * 0.17);
    ctx.fillStyle = m === mode ? "rgba(56,189,248,0.4)" : "#1e293b";
    roundRect(ctx, x - 36, layout.deskTop - 36, 72, 48, 10); ctx.fill();
    ctx.fillStyle = FG; ctx.font = "600 11px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(m, x, layout.deskTop - 10);
    hits.push({ id: m, shape: "rect", x, y: layout.deskTop - 12, w: 72, h: 48, meta: { mode: m } });
   });
   drawJoinLink(ctx, w, h, 0.85, "settle");
   const captions = {
    home: "Family members linked to shared albums",
    school: "Student id links to class roster",
    shop: "Order id links to order items",
    bd: "Ticket id links passenger to seat",
    lab: "JOIN ON students.class_id = classes.id"
   };
   drawLabel(ctx, captions[mode] || captions[modes[0]], w * 0.5, layout.labelY);
   setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
  });
  setDispose(() => setIntentHandler(null));
 });

 arena.registerScene(P + "Myth", (api) => {
  const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
  const myths = [
   { claim: "Tables never need to link", truth: "Related stories use keys to stay connected" },
   { claim: "Any random number is a good key", truth: "Keys should uniquely identify a row" },
   { claim: "JOIN glues with tape", truth: "JOIN matches key values between tables" },
   { claim: "Orphan rows are fine forever", truth: "Missing key matches break the story link" },
   { claim: "Socks join tables", truth: "Keys and JOIN ON match fields - not socks" }
  ];
  setDescription("Bust join myths.");
  setIntentHandler((intent) => {
   if (intent.type === "CANVAS_TAP" && intent.meta?.action === "flip") {
    labState.mythPhase = labState.mythPhase === "truth" ? "claim" : "truth";
    if (labState.mythPhase === "truth") pulseSuccessFeedback(220);
   }
  });
  setTick(() => {
   const w = api.width, h = api.height, layout = api.layout;
   const idx = labState.myth ?? 0, phase = labState.mythPhase || "claim", m = myths[idx] || myths[0];
   drawBackdrop();
   ctx.fillStyle = phase === "truth" ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.18)";
   roundRect(ctx, w * 0.12, h * 0.28, w * 0.76, h * 0.28, 16); ctx.fill();
   drawLabel(ctx, phase === "truth" ? m.truth : "Myth: " + m.claim, w * 0.5, h * 0.42, { h: 42, font: "700 13px Segoe UI" });
   drawLabel(ctx, "Myth " + (idx + 1) + " / 5 - Tap to flip", w * 0.5, layout.labelY);
   setHitRegions([{ id: "card", shape: "rect", x: w * 0.5, y: h * 0.42, w: w * 0.76, h: h * 0.28, meta: { action: "flip" } }]);
   failFlash(ctx, w, h); successFlash(ctx, w, h);
  });
  setDispose(() => setIntentHandler(null));
 });

 arena.registerScene(P + "Drill", (api) => {
  const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
  setDescription(labState.prompt || "Join drill");
  setTick(() => {
   const w = api.width, h = api.height;
   drawBackdrop();
   drawLabel(ctx, labState.prompt || "Join drill", w * 0.5, h * 0.18, { h: 32, font: "700 16px Segoe UI" });
   drawJoinLink(ctx, w, h, 0.9, "settle");
   failFlash(ctx, w, h); successFlash(ctx, w, h);
  });
  setDispose(() => {});
 });

 arena.registerScene(P + "Mastery", (api) => {
  const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
  setDescription("Join Junior mastery.");
  setTick(() => {
   const w = api.width, h = api.height, layout = api.layout, locked = labState.masteryStep || 0;
   drawBackdrop();
   ["Meet", "Sort", "Lab", "Rule", "Myth", "Join"].forEach((label, i) => {
    const x = w * 0.1 + i * (w * 0.14);
    ctx.fillStyle = i < locked ? ACCENT : "rgba(148,163,184,0.35)";
    roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8); ctx.fill();
    ctx.fillStyle = "#0f172a"; ctx.font = "600 10px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.78);
   });
   drawJoinLink(ctx, w, h, 0.95, "settle");
   drawLabel(ctx, "Join Junior!", w * 0.5, layout.labelY);
   failFlash(ctx, w, h); successFlash(ctx, w, h);
  });
  setDispose(() => {});
 });
}
