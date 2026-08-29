/**
 * Web Dev Studio · Mission 3: JS Clicks - Bruner spiral scenes (DOM + recap map).
 */
import { labState, pulseSuccessFeedback } from "./lab-state.js?v=jshouse1";
import { mountJsHouse, syncJsHouse, unmountJsHouse } from "./js-house-mount.js?v=jshouse1";

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
 setDescription(opts.description || "JS Clicks");
 labState.jsMode = mode;
 const bump = () => syncJsHouse(mode, { onChange: bump });
 const unmount = mountJsHouse(viewport, bump);
 syncJsHouse(mode, { onChange: bump, banner: opts.banner });
 setIntentHandler(() => {});
 setHitRegions([]);
 if (!opts.staticStage) {
 setTick(() => syncJsHouse(mode));
 } else {
 setTick(() => {});
 }
 setDispose(() => unmount());
}

export function registerJsScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("jsOpen", (api) => {
 labState.jsMode = "open";
 labState.jsOpenReady = false;
 labState.jsBulbLit = false;
 mountDomScene(api, "open", {
 description: "Styled house - switch does nothing yet.",
 staticStage: true,
 });
 });

 arena.registerScene("jsWire", (api) => mountDomScene(api, "wire", { description: "Wire the switch to the bulb." }));
 arena.registerScene("jsFlow1", (api) => mountDomScene(api, "flow1", { description: "Event → code → change." }));
 arena.registerScene("jsCode1", (api) => mountDomScene(api, "code1", { description: "addEventListener in real syntax." }));
 arena.registerScene("jsRecipe", (api) => mountDomScene(api, "recipe", { description: "Write turnOnLight once, reuse it." }));
 arena.registerScene("jsIconic2", (api) => mountDomScene(api, "iconic2", { description: "One function, many callers." }));
 arena.registerScene("jsCode2", (api) => mountDomScene(api, "code2", { description: "function turnOnLight() { ... }" }));
 arena.registerScene("jsDoorbell", (api) => mountDomScene(api, "doorbell", { description: "ringCount remembers between rings." }));
 arena.registerScene("jsIconic3", (api) => mountDomScene(api, "iconic3", { description: "Labeled box, changing contents." }));
 arena.registerScene("jsCode3", (api) => mountDomScene(api, "code3", { description: "let ringCount = 0" }));
 arena.registerScene("jsToggle", (api) => mountDomScene(api, "toggle", { description: "Build event + variable + function." }));
 arena.registerScene("jsMontage", (api) => mountDomScene(api, "montage", { description: "Real features, same pattern." }));
 arena.registerScene("jsSummary", (api) => mountDomScene(api, "summary", { description: "HTML · CSS · JavaScript." }));

 arena.registerScene("jsClose", (api) => {
 const { setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const viewport = document.getElementById("viewport");
 const start = performance.now();
 setDescription("The house is fully alive.");
 labState.jsMode = "close";
 labState.jsBulbLit = true;
 const bump = () => syncJsHouse("close");
 const unmount = mountJsHouse(viewport, bump);
 syncJsHouse("close");
 setIntentHandler(() => {});
 setHitRegions([]);
 setTick(() => {
 const t = (performance.now() - start) / 1000;
 labState.jsCloseU = Math.min(1, t / 4);
 syncJsHouse("close");
 });
 setDispose(() => unmount());
 });

 arena.registerScene("jsSpiral", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const stops = [
 { id: 1, label: "1 Events", caption: "Spiral 1: wire a switch - event listener" },
 { id: 2, label: "2 Functions", caption: "Spiral 2: turnOnLight recipe card" },
 { id: 3, label: "3 Variables", caption: "Spiral 3: ringCount storage box" },
 { id: 4, label: "4 Toggle", caption: "Spiral 4: event + variable + function" },
 ];
 setDescription("Recap map of the four JS Clicks spirals.");
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
 });
}
