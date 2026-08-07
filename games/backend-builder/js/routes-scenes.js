/**
 * Backend Builder - Mission 2: Routes & APIs - themed Canvas 2D scenes (routes).
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


function drawDoor(ctx, x, y, path, open) {
 ctx.fillStyle = open ? "rgba(251,146,60,0.35)" : "#1e293b";
 roundRect(ctx, x - 36, y - 50, 72, 100, 6); ctx.fill();
 ctx.strokeStyle = ACCENT; ctx.lineWidth = 2.5; ctx.stroke();
 ctx.fillStyle = open ? "#22c55e" : "#64748b";
 ctx.beginPath(); ctx.arc(x + 20, y, 5, 0, Math.PI * 2); ctx.fill();
 ctx.fillStyle = FG; ctx.font = "700 11px Consolas, monospace"; ctx.textAlign = "center";
 ctx.fillText(path, x, y + 62);
}
function drawRouteHall(ctx, w, h, heat, phase) {
 const y = h * 0.4;
 const doors = [
  { p: "/users", need: 0.2 },
  { p: "/posts", need: 0.45 },
  { p: "/login", need: 0.7 },
 ];
 doors.forEach((d, i) => {
  const x = w * 0.22 + i * w * 0.28;
  const open = heat >= d.need || phase === "settle" || (phase === "glow" && d.need <= 0.5);
  drawDoor(ctx, x, y, d.p, open);
 });
 ctx.fillStyle = FG; ctx.font = "700 12px Segoe UI"; ctx.textAlign = "center";
 ctx.fillText("API hallway - each door is a route", w * 0.5, y - 70);
}


export function registerRoutesScenes(arena) {
 if (!arena?.registerScene) return;
 const P = "routes";

 arena.registerScene(P + "Meet", (api) => {
  const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions } = api;
  labState.phase = opts.phase || labState.phase || "desk";
  setDescription("Routes & APIs - URLs are doors.");
  const props = { d1: { x: 0, y: 0, p: "/users" }, d2: { x: 0, y: 0, p: "/posts" }, d3: { x: 0, y: 0, p: "/login" } };
  let inited = false;
  setTick(() => {
   const w = api.width, h = api.height, layout = api.layout;
   const live = labState.phase || "desk";
   const heat = labState.heat || 0.35;
   drawBackdrop();
   if (!inited) {
    props.d1.x = w * 0.22; props.d1.y = h * 0.42;
    props.d2.x = w * 0.5; props.d2.y = h * 0.42;
    props.d3.x = w * 0.78; props.d3.y = h * 0.42;
    inited = true;
   }
   Object.values(props).forEach((d) => {
    drawDoor(ctx, d.x, d.y, d.p, live !== "desk");
   });
   const tips = {
    desk: "Drag the route doors - /users /posts /login",
    glow: "Each path is an endpoint with a job",
    settle: "URLs are doors - pick the right route"
   };
   drawLabel(ctx, tips[live] || tips.desk, w * 0.5, layout.labelY);
   const hits = [];
   for (const [id, p] of Object.entries(props)) {
    hits.push({
     id, shape: "rect", x: p.x, y: p.y, w: 80, h: 110, meta: { propId: id },
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
  setDescription("Sort route, method, or not API.");
  const chips = [
   { id: "users", short: "/users", color: 0x22c55e },
   { id: "posts", short: "/posts", color: 0x38bdf8 },
   { id: "login", short: "/login", color: 0xfbbf24 },
   { id: "get", short: "GET", color: 0x4ade80 },
   { id: "post", short: "POST", color: 0xf97316 },
   { id: "404", short: "404", color: 0xef4444 },
   { id: "paint", short: "Paint", color: 0xa78bfa },
   { id: "rice", short: "Rice", color: 0x94a3b8 }
  ];
  const accept = {
   route: ["users", "posts", "login"],
   method: ["get", "post", "404"],
   not: ["paint", "rice"]
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
    { id: "route", label: "Route path", x: w * 0.02, y: zoneY, ww: w * 0.31, hh: zoneH, color: "#38bdf8" },
    { id: "method", label: "Method/status", x: w * 0.35, y: zoneY, ww: w * 0.31, hh: zoneH, color: "#fbbf24" },
    { id: "not", label: "Not API", x: w * 0.68, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#94a3b8" }
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
   const byZone = { route: [], method: [], not: [] };
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
   drawLabel(ctx, "Route - Method/status - Not API", w * 0.5, layout.labelY);
   setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
  });
  setDispose(() => setIntentHandler(null));
 });

 arena.registerScene(P + "Lab", (api) => {
  const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
  setDescription("Dial - open more route doors.");
  setIntentHandler((intent) => {
   if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
    labState.heat = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
   }
  });
  setTick(() => {
   const w = api.width, h = api.height, layout = api.layout;
   const heat = labState.heat ?? 0.3;
   drawBackdrop();
   drawRouteHall(ctx, w, h, heat, heat >= 0.6 ? "settle" : "glow");
   const hx = w * 0.2 + heat * w * 0.6;
   ctx.fillStyle = ACCENT; ctx.beginPath(); ctx.arc(hx, h * 0.72, 14, 0, Math.PI * 2); ctx.fill();
   ctx.fillStyle = "rgba(148,163,184,0.35)";
   roundRect(ctx, w * 0.2, h * 0.72 - 4, w * 0.6, 8, 4); ctx.fill();
   drawLabel(ctx, heat >= 0.6 ? "Doors open - routes are clear" : "Drag - open more endpoint doors", w * 0.5, layout.labelY);
   setHitRegions([{ id: "h", shape: "rect", x: hx, y: h * 0.72, w: 48, h: 48, meta: { action: "stretch" } }]);
   failFlash(ctx, w, h); successFlash(ctx, w, h);
  });
  setDispose(() => setIntentHandler(null));
 });

 arena.registerScene(P + "Rule", (api) => {
  const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
  setDescription("Each route does a job.");
  setTick(() => {
   const w = api.width, h = api.height, layout = api.layout, prog = labState.tokenProgress || 0;
   drawBackdrop();
   ["Path", "Job", "Method", "Door"].forEach((label, i) => {
    const x = w * 0.16 + i * (w * 0.2);
    ctx.fillStyle = i < prog ? "rgba(74,222,128,0.35)" : "rgba(15,23,42,0.9)";
    roundRect(ctx, x - 46, h * 0.32 - 18, 92, 36, 10); ctx.fill();
    ctx.fillStyle = FG; ctx.font = "700 12px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.32);
   });
   drawRouteHall(ctx, w, h, prog >= 4 ? 0.9 : 0.4, prog >= 4 ? "settle" : "glow");
   drawLabel(ctx, "Routes & APIs rule", w * 0.5, layout.labelY);
   failFlash(ctx, w, h); successFlash(ctx, w, h);
  });
  setDispose(() => {});
 });

 arena.registerScene(P + "Stretch", (api) => {
  const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
  const modes = ["home", "school", "shop", "bd", "lab"];
  setDescription("Same route idea on real apps.");
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
   drawRouteHall(ctx, w, h, 0.8, "settle");
   const captions = {
    home: "Weather app calls /forecast",
    school: "Portal uses /grades and /attendance",
    shop: "Cart hits /products and /checkout",
    bd: "Ticket app route /trips for bus seats",
    lab: "Try /users then /posts in the API hallway"
   };
   drawLabel(ctx, captions[mode] || captions[modes[0]], w * 0.5, layout.labelY);
   setHitRegions(hits); failFlash(ctx, w, h); successFlash(ctx, w, h);
  });
  setDispose(() => setIntentHandler(null));
 });

 arena.registerScene(P + "Myth", (api) => {
  const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
  const myths = [
   { claim: "Every URL is the same job", truth: "Each route path usually does one clear job" },
   { claim: "404 means the server melted", truth: "404 means that route was not found" },
   { claim: "GET and POST are just colors", truth: "Methods say how you ask (read vs send)" },
   { claim: "Routes are only for experts", truth: "Kids can learn /users as a door with a job" },
   { claim: "Rice is a valid API route", truth: "Routes are paths like /users - not food" }
  ];
  setDescription("Bust route myths.");
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
  setDescription(labState.prompt || "Routes drill");
  setTick(() => {
   const w = api.width, h = api.height;
   drawBackdrop();
   drawLabel(ctx, labState.prompt || "Routes drill", w * 0.5, h * 0.18, { h: 32, font: "700 16px Segoe UI" });
   drawRouteHall(ctx, w, h, 0.8, "settle");
   failFlash(ctx, w, h); successFlash(ctx, w, h);
  });
  setDispose(() => {});
 });

 arena.registerScene(P + "Mastery", (api) => {
  const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
  setDescription("Route Ranger mastery.");
  setTick(() => {
   const w = api.width, h = api.height, layout = api.layout, locked = labState.masteryStep || 0;
   drawBackdrop();
   ["Meet", "Sort", "Lab", "Rule", "Myth", "Route"].forEach((label, i) => {
    const x = w * 0.1 + i * (w * 0.14);
    ctx.fillStyle = i < locked ? ACCENT : "rgba(148,163,184,0.35)";
    roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8); ctx.fill();
    ctx.fillStyle = "#0f172a"; ctx.font = "600 10px Segoe UI"; ctx.textAlign = "center"; ctx.fillText(label, x, h * 0.78);
   });
   drawRouteHall(ctx, w, h, 0.95, "settle");
   drawLabel(ctx, "Route Ranger!", w * 0.5, layout.labelY);
   failFlash(ctx, w, h); successFlash(ctx, w, h);
  });
  setDispose(() => {});
 });
}
