/**
 * Artificial Intelligence - Mission 1: What is AI? (Bruner spiral, apprentice DOM).
 */
import { labState, pulseSuccessFeedback } from "./lab-state.js?v=appr6";
import { mountApprentice, syncApprentice, unmountApprentice } from "./apprentice-mount.js?v=appr6";

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
 setDescription(opts.description || "What is AI?");
 labState.aiMode = mode;
 const bump = () => syncApprentice(mode, { onChange: bump, banner: opts.banner });
 const unmount = mountApprentice(viewport, bump);
 syncApprentice(mode, { onChange: bump, banner: opts.banner });
 setIntentHandler(() => {});
 setHitRegions([]);
 // Interactive: remount only via onChange/bump (not every RAF).
 setTick(() => {});
 setDispose(() => unmount());
}

export function registerAiScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("aiOpen", (api) => {
 labState.aiMode = "open";
 mountDomScene(api, "open", { description: "Photo tagged Dog instantly.", staticStage: true });
 });

 arena.registerScene("aiRules1", (api) =>
 mountDomScene(api, "rules1", { description: "Rulebook Employee vs Apprentice." }),
 );
 arena.registerScene("aiSplit1", (api) =>
 mountDomScene(api, "split1", { description: "Rules vs learned patterns.", staticStage: true }),
 );
 arena.registerScene("aiTerms1", (api) =>
 mountDomScene(api, "terms1", { description: "Programming · AI · ML.", staticStage: true }),
 );
 arena.registerScene("aiTrain2", (api) =>
 mountDomScene(api, "train2", { description: "Five training rounds." }),
 );
 arena.registerScene("aiGraph2", (api) =>
 mountDomScene(api, "graph2", { description: "Accuracy climbs over time.", staticStage: true }),
 );
 arena.registerScene("aiTerms2", (api) =>
 mountDomScene(api, "terms2", { description: "Training vocabulary.", staticStage: true }),
 );
 arena.registerScene("aiTest3", (api) =>
 mountDomScene(api, "test3", { description: "Two apprentices, new photos." }),
 );
 arena.registerScene("aiExam3", (api) =>
 mountDomScene(api, "exam3", { description: "Understanding vs memorizing.", staticStage: true }),
 );
 arena.registerScene("aiTerms3", (api) =>
 mountDomScene(api, "terms3", { description: "Generalization · Overfitting.", staticStage: true }),
 );
 arena.registerScene("aiMatch4", (api) =>
 mountDomScene(api, "match4", { description: "Match apps to training data." }),
 );
 arena.registerScene("aiMontage4", (api) =>
 mountDomScene(api, "montage4", { description: "Useful but not infallible.", staticStage: true }),
 );
 arena.registerScene("aiTerms4", (api) =>
 mountDomScene(api, "terms4", { description: "Full lesson summary.", staticStage: true }),
 );

 arena.registerScene("aiClose", (api) => {
 const { setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const viewport = document.getElementById("viewport");
 const start = performance.now();
 setDescription("The Apprentice, understood.");
 labState.aiMode = "close";
 const bump = () => syncApprentice("close");
 const unmount = mountApprentice(viewport, bump);
 syncApprentice("close");
 setIntentHandler(() => {});
 setHitRegions([]);
 setTick(() => {
 const t = (performance.now() - start) / 1000;
 labState.aiCloseU = Math.min(1, t / 4);
 syncApprentice("close");
 });
 setDispose(() => unmount());
 });

 arena.registerScene("aiSpiral", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const stops = [
 { id: 1, label: "1 Rules vs ML", caption: "Spiral 1: rulebook fails, apprentice learns from examples" },
 { id: 2, label: "2 Training", caption: "Spiral 2: guess → reveal → adjust until accurate" },
 { id: 3, label: "3 Test data", caption: "Spiral 3: 100% training ≠ real learning" },
 { id: 4, label: "4 Real AI", caption: "Spiral 4: apps around you + honest limits" },
 ];
 setDescription("Recap map - four spirals of What is AI?");
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
 g.addColorStop(0, "#581c87");
 g.addColorStop(1, "#0f172a");
 ctx.fillStyle = g;
 ctx.fillRect(0, 0, w, h);
 const cx = w * 0.5;
 const cy = h * 0.46;
 const r = Math.min(w, h) * 0.32;
 ctx.strokeStyle = "rgba(192,132,252,0.35)";
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
 ctx.fillStyle = lit ? "#7e22ce" : "rgba(51,65,85,0.95)";
 roundRect(ctx, x - 44, y - 16, 88, 32, 10);
 ctx.fill();
 ctx.fillStyle = "#f3e8ff";
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
 ctx.fillStyle = "#e9d5ff";
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
