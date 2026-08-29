/**
 * Civil Basics · Mission 1: Strong Structures - Bruner spiral (DOM overlay).
 */
import { labState, pulseSuccessFeedback } from "./lab-state.js?v=struct3";
import { mountStruct, syncStruct, unmountStruct } from "./struct-mount.js?v=struct3";

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
 setDescription(opts.description || "Strong Structures");
 labState.structMode = mode;
 const bump = () => syncStruct(mode, { onChange: bump, banner: opts.banner });
 const unmount = mountStruct(viewport, bump);
 syncStruct(mode, { onChange: bump, banner: opts.banner });
 setIntentHandler(() => {});
 setHitRegions([]);
 // Interactive: remount only via onChange/bump (not every RAF).
 setTick(() => {});
 setDispose(() => unmount());
}

function spiralRecapHandler(api) {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const stops = [
 { id: 1, label: "1 Shapes", caption: "Spiral 1: square folds - diagonal makes triangles rigid" },
 { id: 2, label: "2 Base", caption: "Spiral 2: rigid can still tip - wide base stabilizes" },
 { id: 3, label: "3 Load", caption: "Spiral 3: weight travels - spread paths vs one weak point" },
 { id: 4, label: "4 Limits", caption: "Spiral 4: load test + safety factor" },
 ];
 setDescription("Recap map - four spirals of Strong Structures.");
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
 g.addColorStop(0, "#44403c");
 g.addColorStop(1, "#0f172a");
 ctx.fillStyle = g;
 ctx.fillRect(0, 0, w, h);
 const cx = w * 0.5;
 const cy = h * 0.46;
 const r = Math.min(w, h) * 0.32;
 ctx.strokeStyle = "rgba(168,162,158,0.35)";
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
 ctx.fillStyle = lit ? "#57534e" : "rgba(51,65,85,0.95)";
 roundRect(ctx, x - 40, y - 16, 80, 32, 10);
 ctx.fill();
 ctx.fillStyle = "#e7e5e4";
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
 ctx.fillStyle = "#a8a29e";
 ctx.font = "600 12px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.fillText(stop.caption, w * 0.5, h * 0.72 + 18);
 }
 const hits = stops.map((s, i) => {
 const ang = -Math.PI / 2 + (i / 3.2) * Math.PI * 1.35;
 const x = cx + Math.cos(ang) * r * 0.92;
 const y = cy + Math.sin(ang) * r * 0.92;
 return { id: "spiral-" + s.id, shape: "rect", x, y, w: 84, h: 36, meta: { action: "spiral", stop: s.id } };
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

export function registerStructScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("structOpen", (api) => {
 labState.structMode = "open";
 labState.structOpenReady = false;
 mountDomScene(api, "open", { description: "Square frame folds sideways.", staticStage: true });
 });

 arena.registerScene("structSquare1", (api) => mountDomScene(api, "square1", { description: "Push square, add diagonal, push again." }));
 arena.registerScene("structCompare1", (api) => mountDomScene(api, "compare1", { description: "Square vs triangle rigidity.", staticStage: true }));
 arena.registerScene("structTerms1", (api) => mountDomScene(api, "terms1", { description: "Rigid shape · Truss.", staticStage: true }));
 arena.registerScene("structTower2", (api) => mountDomScene(api, "tower2", { description: "Wind gust - narrow vs wide base." }));
 arena.registerScene("structCog2", (api) => mountDomScene(api, "cog2", { description: "Center of gravity diagram.", staticStage: true }));
 arena.registerScene("structTerms2", (api) => mountDomScene(api, "terms2", { description: "Stability vocabulary.", staticStage: true }));
 arena.registerScene("structBridge3", (api) => mountDomScene(api, "bridge3", { description: "Trace the load path." }));
 arena.registerScene("structReal3", (api) => mountDomScene(api, "real3", { description: "Real bridges and buildings.", staticStage: true }));
 arena.registerScene("structTerms3", (api) => mountDomScene(api, "terms3", { description: "Load · path · distribution.", staticStage: true }));
 arena.registerScene("structLoad4", (api) => mountDomScene(api, "load4", { description: "Load weak vs strong designs." }));
 arena.registerScene("structSafe4", (api) => mountDomScene(api, "safe4", { description: "Safety factor graph.", staticStage: true }));
 arena.registerScene("structTerms4", (api) => mountDomScene(api, "terms4", { description: "Lesson summary.", staticStage: true }));

 arena.registerScene("structClose", (api) => {
 const { setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const viewport = document.getElementById("viewport");
 const start = performance.now();
 setDescription("Standing on purpose.");
 labState.structMode = "close";
 const bump = () => syncStruct("close");
 const unmount = mountStruct(viewport, bump);
 syncStruct("close");
 setIntentHandler(() => {});
 setHitRegions([]);
 setTick(() => {
 const t = (performance.now() - start) / 1000;
 labState.structCloseU = Math.min(1, t / 4);
 syncStruct("close");
 });
 setDispose(() => unmount());
 });

 arena.registerScene("structSpiral", spiralRecapHandler);

 /** Legacy aliases */
 arena.registerScene("structMeet", (api) => {
 labState.structMode = "open";
 labState.structOpenReady = false;
 mountDomScene(api, "open", { staticStage: true });
 });
 arena.registerScene("structMastery", spiralRecapHandler);
}
