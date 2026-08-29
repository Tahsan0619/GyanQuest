/**
 * Statistics & Probability / Mission 1: Mean & Mode - Bruner spiral DOM overlay.
 */
import { labState, pulseSuccessFeedback } from "./lab-state.js?v=mean3";
import { mountMean, syncMean, unmountMean } from "./mean-mount.js?v=mean3";

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
 setDescription("Mean & Mode");
 labState.meanMode = mode;
 const bump = () => syncMean(mode, { onChange: bump });
 const unmount = mountMean(viewport, bump);
 syncMean(mode, { onChange: bump });
 setIntentHandler(() => {});
 setHitRegions([]);
 setTick(() => {});
 setDispose(() => unmount());
}

function spiralRecapHandler(api) {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 unmountMean(document.getElementById("viewport"));
 const stops = [
  { id: 1, label: "1 Typical", caption: "Spiral 1: why we need one representative number" },
  { id: 2, label: "2 Mean", caption: "Spiral 2: share evenly - the balance average" },
  { id: 3, label: "3 Mode", caption: "Spiral 3: most frequent value (works on flavors)" },
  { id: 4, label: "4 Choose", caption: "Spiral 4: outliers skew mean; mode stays put" },
 ];
 setDescription("Recap map - four spirals of Mean & Mode.");
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
  g.addColorStop(0, "#78350f");
  g.addColorStop(1, "#1c1917");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const cx = w * 0.5;
  const cy = h * 0.46;
  const r = Math.min(w, h) * 0.32;
  ctx.strokeStyle = "rgba(251,191,36,0.35)";
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
   ctx.fillStyle = lit ? "#f59e0b" : "rgba(68,64,60,0.95)";
   roundRect(ctx, x - 42, y - 16, 84, 32, 10);
   ctx.fill();
   ctx.fillStyle = "#fef3c7";
   ctx.font = "700 10px Segoe UI, sans-serif";
   ctx.textAlign = "center";
   ctx.textBaseline = "middle";
   ctx.fillText(s.label, x, y);
   if (lit) {
    ctx.fillStyle = "#fde68a";
    ctx.font = "12px Segoe UI, sans-serif";
    ctx.fillText(s.caption.slice(0, 52), cx, h * 0.78);
   }
  });
  const hits = stops.map((s, i) => {
   const ang = -Math.PI / 2 + (i / 3.2) * Math.PI * 1.35;
   return {
    id: `spiral-${s.id}`,
    shape: "rect",
    x: cx + Math.cos(ang) * r * 0.92,
    y: cy + Math.sin(ang) * r * 0.92,
    w: 84,
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

export function registerMeanScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("meanOpen", (api) => {
  labState.meanMode = "open";
  labState.meanOpenReady = false;
  mountDomScene(api, "open");
 });
 arena.registerScene("meanPick1", (api) => mountDomScene(api, "pick1"));
 arena.registerScene("meanTwin1", (api) => mountDomScene(api, "twin1"));
 arena.registerScene("meanTerms1", (api) => mountDomScene(api, "terms1"));
 arena.registerScene("meanShare2", (api) => {
  labState.meanCups = [2, 3, 2, 5, 2, 3, 4];
  labState.meanShareDone = false;
  labState.meanPickCup = null;
  mountDomScene(api, "share2");
 });
 arena.registerScene("meanBeam2", (api) => mountDomScene(api, "beam2"));
 arena.registerScene("meanFormula2", (api) => mountDomScene(api, "formula2"));
 arena.registerScene("meanFlavors3", (api) => {
  labState.meanFlavorFail = false;
  labState.meanFlavorPlaced = {};
  labState.meanFlavorSelected = null;
  labState.meanFlavorDone = false;
  mountDomScene(api, "flavors3");
 });
 arena.registerScene("meanBars3", (api) => mountDomScene(api, "bars3"));
 arena.registerScene("meanTerms3", (api) => mountDomScene(api, "terms3"));
 arena.registerScene("meanOutlier4", (api) => {
  labState.meanOutCups = [2, 2, 3, 2, 3, 20];
  labState.meanOutShareDone = false;
  labState.meanOutTally = {};
  labState.meanOutTallyDone = false;
  labState.meanOutDone = false;
  mountDomScene(api, "outlier4");
 });
 arena.registerScene("meanCompare4", (api) => mountDomScene(api, "compare4"));
 arena.registerScene("meanTerms4", (api) => mountDomScene(api, "terms4"));

 arena.registerScene("meanClose", (api) => {
  const { setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
  const viewport = document.getElementById("viewport");
  const start = performance.now();
  setDescription("Mean and mode - both honest answers.");
  labState.meanMode = "close";
  const unmount = mountMean(viewport, () => syncMean("close"));
  syncMean("close");
  setIntentHandler(() => {});
  setHitRegions([]);
  setTick(() => {
   labState.meanCloseU = Math.min(1, (performance.now() - start) / 4000);
   syncMean("close");
  });
  setDispose(() => unmount());
 });

 arena.registerScene("meanSpiral", spiralRecapHandler);

 /** Legacy aliases for boot / finish screens */
 arena.registerScene("meanMeet", (api) => {
  labState.meanMode = "open";
  labState.meanOpenReady = false;
  mountDomScene(api, "open");
 });
 arena.registerScene("meanMastery", spiralRecapHandler);
 arena.registerScene("meanSort", (api) => mountDomScene(api, "pick1"));
 arena.registerScene("meanLab", (api) => mountDomScene(api, "share2"));
}
