/**
 * Eco Guardian / Mission 1: Waste Watch - sorting station (Bruner spirals).
 */
import { labState, pulseSuccessFeedback } from "./lab-state.js?v=waste1";
import { mountWaste, syncWaste, unmountWaste } from "./waste-mount.js?v=waste1";

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

function mountDomScene(api, mode, opts = {}) {
 const { setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const viewport = document.getElementById("viewport");
 setDescription(opts.description || "Waste Watch");
 labState.wasteMode = mode;
 const bump = () => syncWaste(mode, { onChange: bump, banner: opts.banner });
 const unmount = mountWaste(viewport, bump);
 syncWaste(mode, { onChange: bump, banner: opts.banner });
 setIntentHandler(() => {});
 setHitRegions([]);
 setTick(() => {});
 setDispose(() => unmount());
}

function spiralRecapHandler(api) {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 unmountWaste(document.getElementById("viewport"));
 const stops = [
  { id: 1, label: "1 Away", caption: "Spiral 1: away leads to a real landfill by default" },
  { id: 2, label: "2 Recycle", caption: "Spiral 2: materials loop - contamination matters" },
  { id: 3, label: "3 Compost", caption: "Spiral 3: nature's recycle - organic only" },
  { id: 4, label: "4 Sort", caption: "Spiral 4: three roads - sorting changes the outcome" },
 ];
 setDescription("Recap map - four spirals of Waste Watch.");
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
  g.addColorStop(0, "#14532d");
  g.addColorStop(1, "#0f172a");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const cx = w * 0.5;
  const cy = h * 0.46;
  const r = Math.min(w, h) * 0.32;
  ctx.strokeStyle = "rgba(52,211,153,0.35)";
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
   ctx.fillStyle = lit ? "#059669" : "rgba(51,65,85,0.95)";
   roundRect(ctx, x - 40, y - 16, 80, 32, 10);
   ctx.fill();
   ctx.fillStyle = "#d1fae5";
   ctx.font = "700 10px Segoe UI, sans-serif";
   ctx.textAlign = "center";
   ctx.textBaseline = "middle";
   ctx.fillText(s.label, x, y);
   if (lit) {
    ctx.fillStyle = "#a7f3d0";
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

export function registerWasteScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("wasteOpen", (api) => {
  labState.wasteMode = "open";
  labState.wasteOpenReady = false;
  mountDomScene(api, "open", { description: "Bottle into trash - away is not a place." });
 });

 arena.registerScene("wasteFollow1", (api) =>
  mountDomScene(api, "follow1", { description: "Follow the bottle to the landfill." }),
 );
 arena.registerScene("wasteMap1", (api) => mountDomScene(api, "map1", { description: "Default road: house to landfill." }));
 arena.registerScene("wasteTerms1", (api) => mountDomScene(api, "terms1", { description: "Waste · Landfill." }));
 arena.registerScene("wasteRecycle2", (api) =>
  mountDomScene(api, "recycle2", { description: "Sort into recycling - watch contamination." }),
 );
 arena.registerScene("wasteLoop2", (api) => {
  labState.wasteLoopPhase = 0;
  const { setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
  const viewport = document.getElementById("viewport");
  setDescription("Recycling loop.");
  labState.wasteMode = "loop2";
  const bump = () => syncWaste("loop2", { onChange: bump });
  const unmount = mountWaste(viewport, bump);
  syncWaste("loop2", { onChange: bump });
  setIntentHandler(() => {});
  setHitRegions([]);
  let last = 0;
  setTick(() => {
   const t = performance.now();
   if (t - last > 900) {
    last = t;
    labState.wasteLoopPhase = ((labState.wasteLoopPhase || 0) + 1) % 6;
    bump();
   }
  });
  setDispose(() => unmount());
 });
 arena.registerScene("wasteTerms2", (api) => mountDomScene(api, "terms2", { description: "Recycling · Contamination." }));
 arena.registerScene("wasteCompost3", (api) =>
  mountDomScene(api, "compost3", { description: "Sort compost + fast-forward." }),
 );
 arena.registerScene("wasteNature3", (api) => mountDomScene(api, "nature3", { description: "Natural compost loop." }));
 arena.registerScene("wasteTerms3", (api) =>
  mountDomScene(api, "terms3", { description: "Compost · Decomposition · Organic waste." }),
 );
 arena.registerScene("wasteFull4", (api) => mountDomScene(api, "full4", { description: "Full three-bin sorting station." }));
 arena.registerScene("wasteSplit4", (api) => mountDomScene(api, "split4", { description: "Community sorting outcomes." }));
 arena.registerScene("wasteTerms4", (api) => mountDomScene(api, "terms4", { description: "Lesson summary + Three R's." }));

 arena.registerScene("wasteClose", (api) => {
  const { setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
  const viewport = document.getElementById("viewport");
  const start = performance.now();
  setDescription("The journey, chosen well.");
  labState.wasteMode = "close";
  const bump = () => syncWaste("close");
  const unmount = mountWaste(viewport, bump);
  syncWaste("close");
  setIntentHandler(() => {});
  setHitRegions([]);
  setTick(() => {
   labState.wasteCloseU = Math.min(1, (performance.now() - start) / 4000);
   syncWaste("close");
  });
  setDispose(() => unmount());
 });

 arena.registerScene("wasteSpiral", spiralRecapHandler);

 /** Legacy aliases */
 arena.registerScene("wasteMeet", (api) => {
  labState.wasteMode = "open";
  labState.wasteOpenReady = false;
  mountDomScene(api, "open", { description: "Waste Watch opening." });
 });
 arena.registerScene("wasteMastery", spiralRecapHandler);
 arena.registerScene("wasteSort", (api) => mountDomScene(api, "full4"));
 arena.registerScene("wasteLab", (api) => mountDomScene(api, "follow1"));
}
