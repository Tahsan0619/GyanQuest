/**
 * Machine Learning - Mission 1: Teach the Model (Bruner spiral, academy DOM).
 */
import { labState, pulseSuccessFeedback } from "./lab-state.js?v=acad6";
import { mountAcademy, syncAcademy, unmountAcademy } from "./academy-mount.js?v=acad6";

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
 setDescription(opts.description || "Teach the Model");
 labState.mlMode = mode;
 const bump = () => syncAcademy(mode, { onChange: bump, banner: opts.banner });
 const unmount = mountAcademy(viewport, bump);
 syncAcademy(mode, { onChange: bump, banner: opts.banner });
 setIntentHandler(() => {});
 setHitRegions([]);
 // Interactive: remount only via onChange/bump (not every RAF).
 setTick(() => {});
 setDispose(() => unmount());
}

export function registerMlScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("mlOpen", (api) => {
 labState.mlMode = "open";
 mountDomScene(api, "open", { description: "Training academy - enroll now.", staticStage: true });
 });

 arena.registerScene("mlClean1", (api) =>
 mountDomScene(api, "clean1", { description: "Clean the practice deck." }),
 );
 arena.registerScene("mlFunnel1", (api) =>
 mountDomScene(api, "funnel1", { description: "Raw data funnel.", staticStage: true }),
 );
 arena.registerScene("mlTerms1", (api) =>
 mountDomScene(api, "terms1", { description: "Dataset & cleaning.", staticStage: true }),
 );
 arena.registerScene("mlSplit2", (api) =>
 mountDomScene(api, "split2", { description: "Split before you start." }),
 );
 arena.registerScene("mlRooms2", (api) =>
 mountDomScene(api, "rooms2", { description: "Practice vs vault rooms.", staticStage: true }),
 );
 arena.registerScene("mlTerms2", (api) =>
 mountDomScene(api, "terms2", { description: "Train/test split.", staticStage: true }),
 );
 arena.registerScene("mlTrain3", (api) =>
 mountDomScene(api, "train3", { description: "Epochs and early stopping." }),
 );
 arena.registerScene("mlGraph3", (api) =>
 mountDomScene(api, "graph3", { description: "Sweet spot graph.", staticStage: true }),
 );
 arena.registerScene("mlTerms3", (api) =>
 mountDomScene(api, "terms3", { description: "Epoch · Loss · Early stopping.", staticStage: true }),
 );
 arena.registerScene("mlExam4", (api) =>
 mountDomScene(api, "exam4", { description: "Unlock the vault exam." }),
 );
 arena.registerScene("mlCycle4", (api) =>
 mountDomScene(api, "cycle4", { description: "Full ML cycle.", staticStage: true }),
 );
 arena.registerScene("mlTerms4", (api) =>
 mountDomScene(api, "terms4", { description: "Accuracy & summary.", staticStage: true }),
 );

 arena.registerScene("mlClose", (api) => {
 const { setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const viewport = document.getElementById("viewport");
 const start = performance.now();
 setDescription("The apprentice, properly trained.");
 labState.mlMode = "close";
 const bump = () => syncAcademy("close");
 const unmount = mountAcademy(viewport, bump);
 syncAcademy("close");
 setIntentHandler(() => {});
 setHitRegions([]);
 setTick(() => {
 const t = (performance.now() - start) / 1000;
 labState.mlCloseU = Math.min(1, t / 4);
 syncAcademy("close");
 });
 setDispose(() => unmount());
 });

 arena.registerScene("mlSpiral", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const stops = [
 { id: 1, label: "1 Cleaning", caption: "Spiral 1: clean material before training" },
 { id: 2, label: "2 Split", caption: "Spiral 2: seal the vault before practice" },
 { id: 3, label: "3 Epochs", caption: "Spiral 3: error falls - know when to stop" },
 { id: 4, label: "4 Evaluate", caption: "Spiral 4: honest final exam & cycle" },
 ];
 setDescription("Recap map - four spirals of Teach the Model.");
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
 g.addColorStop(0, "#831843");
 g.addColorStop(1, "#0f172a");
 ctx.fillStyle = g;
 ctx.fillRect(0, 0, w, h);
 const cx = w * 0.5;
 const cy = h * 0.46;
 const r = Math.min(w, h) * 0.32;
 ctx.strokeStyle = "rgba(244,114,182,0.35)";
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
 ctx.fillStyle = lit ? "#be185d" : "rgba(51,65,85,0.95)";
 roundRect(ctx, x - 44, y - 16, 88, 32, 10);
 ctx.fill();
 ctx.fillStyle = "#fce7f3";
 ctx.font = "700 10px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(s.label, x, y);
 });
 const stop = stops.find((s) => s.id === labState.spiralStop);
 if (stop && performance.now() < (labState.spiralUntil || 0)) {
 ctx.fillStyle = "rgba(15,23,42,0.88)";
 roundRect(ctx, w * 0.12, h * 0.72, w * 0.76, 36, 10);
 ctx.fill();
 ctx.fillStyle = "#fbcfe8";
 ctx.font = "600 12px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.fillText(stop.caption, w * 0.5, h * 0.72 + 18);
 }
 const hits = stops.map((s, i) => {
 const ang = -Math.PI / 2 + (i / 3.2) * Math.PI * 1.35;
 const x = cx + Math.cos(ang) * r * 0.92;
 const y = cy + Math.sin(ang) * r * 0.92;
 return { id: "spiral-" + s.id, shape: "rect", x, y, w: 92, h: 36, meta: { action: "spiral", stop: s.id } };
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
 });
}
