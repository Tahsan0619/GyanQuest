/**
 * Electrical Basics · Mission 1: Circuit Loop - Bruner spiral (water-park DOM).
 */
import { labState, pulseSuccessFeedback } from "./lab-state.js?v=loop4";
import { mountCircuit, syncCircuit, unmountCircuit } from "./circuit-mount.js?v=loop4";

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
 setDescription(opts.description || "Circuit Loop");
 labState.circMode = mode;
 const bump = () => syncCircuit(mode, { onChange: bump, banner: opts.banner });
 const unmount = mountCircuit(viewport, bump);
 syncCircuit(mode, { onChange: bump, banner: opts.banner });
 setIntentHandler(() => {});
 setHitRegions([]);
 // Interactive: remount only via onChange/bump (not every RAF).
 setTick(() => {});
 setDispose(() => unmount());
}

export function registerCircuitScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("circOpen", (api) => {
 labState.circMode = "open";
 labState.circOpenReady = false;
 mountDomScene(api, "open", { description: "Disconnected battery, wire, bulb.", staticStage: true });
 });

 arena.registerScene("circLoop1", (api) => mountDomScene(api, "loop1", { description: "Close the loop - then break it." }));
 arena.registerScene("circPipe1", (api) => mountDomScene(api, "pipe1", { description: "Water pipe loop comparison.", staticStage: true }));
 arena.registerScene("circTerms1", (api) => mountDomScene(api, "terms1", { description: "Circuit vocabulary.", staticStage: true }));
 arena.registerScene("circBattery2", (api) => mountDomScene(api, "battery2", { description: "Swap weak, medium, strong batteries." }));
 arena.registerScene("circPump2", (api) => mountDomScene(api, "pump2", { description: "Pump strength ↔ voltage.", staticStage: true }));
 arena.registerScene("circTerms2", (api) => mountDomScene(api, "terms2", { description: "Battery and voltage.", staticStage: true }));
 arena.registerScene("circFlow3", (api) => mountDomScene(api, "flow3", { description: "Particle flow, thick wire, bulb resistance." }));
 arena.registerScene("circWheel3", (api) => mountDomScene(api, "wheel3", { description: "Water wheel ↔ bulb.", staticStage: true }));
 arena.registerScene("circTerms3", (api) => mountDomScene(api, "terms3", { description: "Current and resistance.", staticStage: true }));
 arena.registerScene("circSwitch4", (api) => mountDomScene(api, "switch4", { description: "Add and toggle a switch." }));
 arena.registerScene("circValve4", (api) => mountDomScene(api, "valve4", { description: "Valve ↔ switch.", staticStage: true }));
 arena.registerScene("circTerms4", (api) => mountDomScene(api, "terms4", { description: "Full circuit vocabulary.", staticStage: true }));

 arena.registerScene("circClose", (api) => {
 const { setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const viewport = document.getElementById("viewport");
 const start = performance.now();
 setDescription("The lights are on.");
 labState.circMode = "close";
 labState.circGaps = { g1: true, g2: true, g3: true, g4: true };
 labState.circLoopClosed = true;
 labState.circSwitchAdded = true;
 labState.circSwitchClosed = true;
 const bump = () => syncCircuit("close");
 const unmount = mountCircuit(viewport, bump);
 syncCircuit("close");
 setIntentHandler(() => {});
 setHitRegions([]);
 setTick(() => {
 const t = (performance.now() - start) / 1000;
 labState.circCloseU = Math.min(1, t / 4);
 syncCircuit("close");
 });
 setDispose(() => unmount());
 });

 arena.registerScene("circSpiral", spiralRecapHandler);

 /** Legacy aliases */
 arena.registerScene("circuitMeet", (api) => {
 labState.circMode = "open";
 labState.circOpenReady = false;
 mountDomScene(api, "open", { staticStage: true });
 });
 arena.registerScene("circuitMastery", spiralRecapHandler);
}

function spiralRecapHandler(api) {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const stops = [
 { id: 1, label: "1 Loop", caption: "Spiral 1: close the loop - break anywhere, all stops" },
 { id: 2, label: "2 Push", caption: "Spiral 2: battery push ↔ pump voltage" },
 { id: 3, label: "3 Flow", caption: "Spiral 3: current flow and bulb resistance" },
 { id: 4, label: "4 Switch", caption: "Spiral 4: switch as controllable gap" },
 ];
 setDescription("Recap map - four spirals of Circuit Loop.");
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
 g.addColorStop(0, "#422006");
 g.addColorStop(1, "#0f172a");
 ctx.fillStyle = g;
 ctx.fillRect(0, 0, w, h);
 const cx = w * 0.5;
 const cy = h * 0.46;
 const r = Math.min(w, h) * 0.32;
 ctx.strokeStyle = "rgba(250,204,21,0.35)";
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
 ctx.fillStyle = lit ? "#ca8a04" : "rgba(51,65,85,0.95)";
 roundRect(ctx, x - 40, y - 16, 80, 32, 10);
 ctx.fill();
 ctx.fillStyle = "#fef9c3";
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
 ctx.fillStyle = "#fde047";
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

