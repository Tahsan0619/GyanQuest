/**
 * Mechanical Basics · Mission 1: Levers & Gears - Bruner spiral (DOM overlay).
 */
import { labState, pulseSuccessFeedback } from "./lab-state.js?v=lev4";
import { mountLever, syncLever, unmountLever } from "./lever-mount.js?v=lev4";

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
 setDescription(opts.description || "Levers & Gears");
 labState.levMode = mode;
 const bump = () => syncLever(mode, { onChange: bump, banner: opts.banner });
 const unmount = mountLever(viewport, bump);
 syncLever(mode, { onChange: bump, banner: opts.banner });
 setIntentHandler(() => {});
 setHitRegions([]);
 // Interactive: remount only via onChange/bump (not every RAF).
 setTick(() => {});
 setDispose(() => unmount());
}

function spiralRecapHandler(api) {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const stops = [
 { id: 1, label: "1 Lever", caption: "Spiral 1: bare hands fail - plank trades distance for force" },
 { id: 2, label: "2 Fulcrum", caption: "Spiral 2: fulcrum position - mechanical advantage" },
 { id: 3, label: "3 Gears", caption: "Spiral 3: speed vs torque - crank both directions" },
 { id: 4, label: "4 Everywhere", caption: "Spiral 4: levers and gears all around us" },
 ];
 setDescription("Recap map - four spirals of Levers & Gears.");
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
 g.addColorStop(0, "#7c2d12");
 g.addColorStop(1, "#0f172a");
 ctx.fillStyle = g;
 ctx.fillRect(0, 0, w, h);
 const cx = w * 0.5;
 const cy = h * 0.46;
 const r = Math.min(w, h) * 0.32;
 ctx.strokeStyle = "rgba(253,186,116,0.35)";
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
 ctx.fillStyle = lit ? "#c2410c" : "rgba(51,65,85,0.95)";
 roundRect(ctx, x - 40, y - 16, 80, 32, 10);
 ctx.fill();
 ctx.fillStyle = "#ffedd5";
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
 ctx.fillStyle = "#fdba74";
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

export function registerLeverScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("levOpen", (api) => {
 labState.levMode = "open";
 labState.levOpenReady = false;
 mountDomScene(api, "open", { description: "Boulder, plank, bicycle, steep hill.", staticStage: true });
 });

 arena.registerScene("levLever1", (api) => mountDomScene(api, "lever1", { description: "Lift by hand - then try the plank." }));
 arena.registerScene("levSeesaw1", (api) => mountDomScene(api, "seesaw1", { description: "Seesaw = same trade.", staticStage: true }));
 arena.registerScene("levTerms1", (api) => mountDomScene(api, "terms1", { description: "Lever vocabulary.", staticStage: true }));
 arena.registerScene("levFulcrum2", (api) => mountDomScene(api, "fulcrum2", { description: "Slide the fulcrum." }));
 arena.registerScene("levArms2", (api) => mountDomScene(api, "arms2", { description: "Long vs short effort arm.", staticStage: true }));
 arena.registerScene("levTerms2", (api) => mountDomScene(api, "terms2", { description: "Mechanical advantage.", staticStage: true }));
 arena.registerScene("levGears3", (api) => mountDomScene(api, "gears3", { description: "Crank gears both directions." }));
 arena.registerScene("levBike3", (api) => mountDomScene(api, "bike3", { description: "Bicycle gears on hills.", staticStage: true }));
 arena.registerScene("levTerms3", (api) => mountDomScene(api, "terms3", { description: "Gear, torque, ratio.", staticStage: true }));
 arena.registerScene("levSort4", (api) => mountDomScene(api, "sort4", { description: "Sort levers and gears." }));
 arena.registerScene("levMontage4", (api) => mountDomScene(api, "montage4", { description: "Boulder and hill solved.", staticStage: true }));
 arena.registerScene("levTerms4", (api) => mountDomScene(api, "terms4", { description: "Simple machines summary.", staticStage: true }));

 arena.registerScene("levClose", (api) => {
 const { setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const viewport = document.getElementById("viewport");
 const start = performance.now();
 setDescription("The right tool, not more strength.");
 labState.levMode = "close";
 const bump = () => syncLever("close");
 const unmount = mountLever(viewport, bump);
 syncLever("close");
 setIntentHandler(() => {});
 setHitRegions([]);
 setTick(() => {
 const t = (performance.now() - start) / 1000;
 labState.levCloseU = Math.min(1, t / 4);
 syncLever("close");
 });
 setDispose(() => unmount());
 });

 arena.registerScene("levSpiral", spiralRecapHandler);

 /** Legacy aliases */
 arena.registerScene("leverMeet", (api) => {
 labState.levMode = "open";
 labState.levOpenReady = false;
 mountDomScene(api, "open", { staticStage: true });
 });
 arena.registerScene("leverMastery", spiralRecapHandler);
}
