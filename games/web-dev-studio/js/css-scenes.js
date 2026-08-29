/**
 * Web Dev Studio · Mission 2: CSS Style: Bruner spiral scenes.
 */
import { labState, pulseSuccessFeedback } from "./lab-state.js?v=csspaint1";
import { mountCssHouse, syncCssHouse, unmountCssHouse } from "./css-house-mount.js?v=csspaint1";

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
 setDescription(opts.description || "CSS Style");
 labState.cssMode = mode;
 const bump = () => syncCssHouse(mode, { onChange: bump });
 const unmount = mountCssHouse(viewport, bump);
 syncCssHouse(mode, { onChange: bump, banner: opts.banner });
 setIntentHandler(() => {});
 setHitRegions([]);
 if (!opts.staticStage) {
 setTick(() => syncCssHouse(mode));
 } else {
 setTick(() => {});
 }
 setDispose(() => unmount());
}

export function registerCssScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("cssOpen", (api) => {
 labState.cssMode = "unstyled";
 labState.cssOpenReady = false;
 mountDomScene(api, "unstyled", {
 description: "The HTML house: structured, but unstyled.",
 staticStage: true,
 });
 });

 arena.registerScene("cssPaint", (api) => {
 labState.cssPhase = labState.cssPaintMain ? 1 : 0;
 mountDomScene(api, "paint", { description: "Point at a room, then paint it." });
 });

 arena.registerScene("cssRule", (api) => mountDomScene(api, "rule", { description: "Selector → property → value." }));
 arena.registerScene("cssTerms", (api) => mountDomScene(api, "terms", { description: "Formal CSS rule vocabulary." }));
 arena.registerScene("cssBox", (api) => mountDomScene(api, "box", { description: "Padding, border, margin: three different spaces." }));
 arena.registerScene("cssBoxCut", (api) => mountDomScene(api, "boxcut", { description: "The four nested layers." }));
 arena.registerScene("cssBoxCode", (api) => mountDomScene(api, "boxcode", { description: "The box model in code." }));
 arena.registerScene("cssResize", (api) => mountDomScene(api, "resize", { description: "Resize the room, align the furniture." }));
 arena.registerScene("cssGallery", (api) => mountDomScene(api, "gallery", { description: "Same room: four alignments." }));
 arena.registerScene("cssSizeCode", (api) => mountDomScene(api, "sizecode", { description: "width, height, text-align." }));
 arena.registerScene("cssCascade", (api) => {
 labState.cssPhase = (labState.cssCozyRooms || []).length >= 3 ? 1 : 0;
 mountDomScene(api, "cascade", { description: "One class, many rooms, then override one." });
 });
 arena.registerScene("cssSheet", (api) => mountDomScene(api, "sheet", { description: "One stylesheet updates every connected room." }));
 arena.registerScene("cssSummary", (api) => mountDomScene(api, "summary", { description: "Class, id, cascading." }));

 arena.registerScene("cssClose", (api) => {
 const { setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const viewport = document.getElementById("viewport");
 const start = performance.now();
 setDescription("Blueprint transforms into a livable home.");
 labState.cssMode = "close";
 const bump = () => syncCssHouse("close");
 const unmount = mountCssHouse(viewport, bump);
 syncCssHouse("close");
 setIntentHandler(() => {});
 setHitRegions([]);
 setTick(() => {
 const t = (performance.now() - start) / 1000;
 labState.cssCloseU = Math.min(1, t / 4);
 if (t > 0.25) {
 labState.cssRoomColors = {
 header: "#7dd3fc",
 hero: "#c4b5fd",
 main: "#fef3c7",
 footer: "#94a3b8",
 };
 }
 syncCssHouse("close");
 });
 setDispose(() => unmount());
 });

 arena.registerScene("cssSpiral", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const stops = [
 { id: 1, label: "1 Selectors", caption: "Spiral 1: point at a room, change its color" },
 { id: 2, label: "2 Box model", caption: "Spiral 2: padding, border, margin" },
 { id: 3, label: "3 Size & align", caption: "Spiral 3: width, height, text-align" },
 { id: 4, label: "4 Cascade", caption: "Spiral 4: one stylesheet, many rooms" },
 ];
 setDescription("Recap map of the four CSS Style spirals.");
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
 g.addColorStop(0, "#0c4a6e");
 g.addColorStop(1, "#0f172a");
 ctx.fillStyle = g;
 ctx.fillRect(0, 0, w, h);
 const cx = w * 0.5;
 const cy = h * 0.46;
 const r = Math.min(w, h) * 0.32;
 ctx.strokeStyle = "rgba(56,189,248,0.35)";
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
 });
 const stop = stops.find((s) => s.id === labState.spiralStop);
 if (stop && performance.now() < (labState.spiralUntil || 0)) {
 ctx.fillStyle = "rgba(15,23,42,0.88)";
 roundRect(ctx, w * 0.12, h * 0.72, w * 0.76, 36, 10);
 ctx.fill();
 ctx.fillStyle = "#7dd3fc";
 ctx.font = "600 12px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.fillText(stop.caption, w * 0.5, h * 0.72 + 18);
 }
 ctx.fillStyle = "#94a3b8";
 ctx.font = "600 11px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.fillText("Tap a number · Finish when ready", w * 0.5, h * 0.9);
 setHitRegions(
 stops.map((s, i) => {
 const ang = -Math.PI / 2 + (i / 3.2) * Math.PI * 1.35;
 return {
 id: "csp" + s.id,
 shape: "rect",
 x: cx + Math.cos(ang) * r * 0.92,
 y: cy + Math.sin(ang) * r * 0.92,
 w: 88,
 h: 36,
 meta: { action: "spiral", stop: s.id },
 };
 }).concat([
 {
 id: "fin",
 shape: "rect",
 x: w * 0.5,
 y: h * 0.9,
 w: 200,
 h: 32,
 meta: { action: "spiralFinish" },
 },
 ]),
 );
 });
 setDispose(() => {});
 });
}
