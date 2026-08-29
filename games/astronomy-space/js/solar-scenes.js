/**
 * Astronomy & Space / Mission 1: Solar Family - Bruner spiral DOM overlay.
 */
import { labState, pulseSuccessFeedback } from "./lab-state.js?v=solar4";
import { mountSolar, syncSolar, unmountSolar } from "./solar-mount.js?v=solar4";

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

function mountDomScene(api, mode) {
 const { setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const viewport = document.getElementById("viewport");
 setDescription("Solar Family");
 labState.solarMode = mode;
 const bump = () => syncSolar(mode, { onChange: bump });
 const unmount = mountSolar(viewport, bump);
 syncSolar(mode, { onChange: bump });
 setIntentHandler(() => {});
 setHitRegions([]);
 setTick(() => {});
 setDispose(() => unmount());
}

function spiralRecapHandler(api) {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 unmountSolar(document.getElementById("viewport"));
 const stops = [
  { id: 1, label: "1 Gravity", caption: "Spiral 1: orbit = gravity + sideways motion" },
  { id: 2, label: "2 Types", caption: "Spiral 2: terrestrial vs gas/ice giants" },
  { id: 3, label: "3 Members", caption: "Spiral 3: eight distinct personalities" },
  { id: 4, label: "4 Scale", caption: "Spiral 4: vast emptiness + habitable zone" },
 ];
 setDescription("Recap map - four spirals of Solar Family.");
 setIntentHandler((intent) => {
  if (intent.type !== "CANVAS_TAP") return;
  if (intent.meta?.action === "spiral") {
   labState.spiralStop = Number(intent.meta.stop) || 0;
   labState.spiralUntil = performance.now() + 4500;
   pulseSuccessFeedback(160);
  }
  if (intent.meta?.action === "spiralFinish") labState.spiralFinish = true;
 });
 setTick(() => {
  const w = api.width;
  const h = api.height;
  const g = ctx.createRadialGradient(w * 0.5, h * 0.35, 20, w * 0.5, h * 0.35, w * 0.65);
  g.addColorStop(0, "#1e3a5f");
  g.addColorStop(1, "#0f172a");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const cx = w * 0.5;
  const cy = h * 0.46;
  const r = Math.min(w, h) * 0.32;
  ctx.strokeStyle = "rgba(125,211,252,0.35)";
  ctx.lineWidth = 3;
  for (let i = 1; i <= 4; i++) {
   ctx.beginPath();
   ctx.arc(cx, cy, r * (i / 4), -Math.PI / 2, Math.PI * 1.1);
   ctx.stroke();
  }
  stops.forEach((s, i) => {
   const ang = -Math.PI / 2 + (i / 3.2) * Math.PI * 1.35;
   const x = cx + Math.cos(ang) * r * 0.92;
   const y = cy + Math.sin(ang) * r * 0.92;
   const lit = labState.spiralStop === s.id && performance.now() < (labState.spiralUntil || 0);
   ctx.fillStyle = lit ? "#0284c7" : "rgba(51,65,85,0.95)";
   roundRect(ctx, x - 40, y - 16, 80, 32, 10);
   ctx.fill();
   ctx.fillStyle = "#e0f2fe";
   ctx.font = "700 10px Segoe UI, sans-serif";
   ctx.textAlign = "center";
   ctx.textBaseline = "middle";
   ctx.fillText(s.label, x, y);
   if (lit) {
    ctx.fillStyle = "#bae6fd";
    ctx.font = "12px Segoe UI, sans-serif";
    ctx.fillText(s.caption.slice(0, 48), cx, h * 0.78);
   }
  });
  const hits = stops.map((s, i) => {
   const ang = -Math.PI / 2 + (i / 3.2) * Math.PI * 1.35;
   return {
    id: `spiral-${s.id}`,
    shape: "rect",
    x: cx + Math.cos(ang) * r * 0.92,
    y: cy + Math.sin(ang) * r * 0.92,
    w: 80,
    h: 32,
    meta: { action: "spiral", stop: s.id },
   };
  });
  hits.push({
   id: "spiral-finish",
   shape: "rect",
   x: w * 0.5,
   y: h * 0.88,
   w: w * 0.5,
   h: 40,
   meta: { action: "spiralFinish" },
  });
  setHitRegions(hits);
 });
 setDispose(() => {});
}

export function registerSolarScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("solarOpen", (api) => {
  labState.solarMode = "open";
  labState.solarOpenReady = false;
  mountDomScene(api, "open");
 });
 arena.registerScene("solarOrbit1", (api) => mountDomScene(api, "orbit1"));
 arena.registerScene("solarDiagram1", (api) => mountDomScene(api, "diagram1"));
 arena.registerScene("solarTerms1", (api) => mountDomScene(api, "terms1"));
 arena.registerScene("solarSort2", (api) => mountDomScene(api, "sort2"));
 arena.registerScene("solarSize2", (api) => mountDomScene(api, "size2"));
 arena.registerScene("solarTerms2", (api) => mountDomScene(api, "terms2"));
 arena.registerScene("solarGallery3", (api) => mountDomScene(api, "gallery3"));
 arena.registerScene("solarOrder3", (api) => mountDomScene(api, "order3"));
 arena.registerScene("solarTerms3", (api) => mountDomScene(api, "terms3"));
 arena.registerScene("solarScale4", (api) => mountDomScene(api, "scale4"));
 arena.registerScene("solarExplore4", (api) => mountDomScene(api, "explore4"));
 arena.registerScene("solarTerms4", (api) => mountDomScene(api, "terms4"));

 arena.registerScene("solarClose", (api) => {
  const { setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
  const viewport = document.getElementById("viewport");
  const start = performance.now();
  setDescription("The whole family, together.");
  labState.solarMode = "close";
  const unmount = mountSolar(viewport, () => syncSolar("close"));
  syncSolar("close");
  setIntentHandler(() => {});
  setHitRegions([]);
  setTick(() => {
   labState.solarCloseU = Math.min(1, (performance.now() - start) / 4000);
   syncSolar("close");
  });
  setDispose(() => unmount());
 });

 arena.registerScene("solarSpiral", spiralRecapHandler);

 /** Legacy aliases */
 arena.registerScene("solarMeet", (api) => {
  labState.solarMode = "open";
  labState.solarOpenReady = false;
  mountDomScene(api, "open");
 });
 arena.registerScene("solarMastery", spiralRecapHandler);
 arena.registerScene("solarSort", (api) => mountDomScene(api, "sort2"));
 arena.registerScene("solarLab", (api) => mountDomScene(api, "orbit1"));
}
