/**
 * ICT / Mission 2: Input & Output - kitchen windows (Bruner spirals).
 */
import { labState, pulseSuccessFeedback } from "./lab-state.js";
import { mountIoKitchen, syncIo, unmountIoKitchen } from "./io-mount.js";

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
 setDescription(opts.description || "Input & Output - kitchen windows");
 labState.ioMode = mode;
 const bump = () => syncIo(mode, { onChange: bump, banner: opts.banner });
 const unmount = mountIoKitchen(viewport, bump);
 syncIo(mode, { onChange: bump, banner: opts.banner });
 setIntentHandler(() => {});
 setHitRegions([]);
 if (mode === "inputGallery" || mode === "outputGallery") {
 let iv = setInterval(() => {
 labState.ioGalleryPhase = ((labState.ioGalleryPhase || 0) + 1) % (mode === "outputGallery" ? 3 : 5);
 bump();
 }, 2000);
 setDispose(() => {
 clearInterval(iv);
 unmount();
 });
 } else if (mode === "close") {
 setTick(() => {
 const start = labState._ioCloseStart || performance.now();
 if (!labState._ioCloseStart) labState._ioCloseStart = start;
 labState.ioCloseU = Math.min(1, (performance.now() - start) / 5000);
 bump();
 });
 setDispose(() => {
 labState._ioCloseStart = 0;
 unmount();
 });
 } else {
 // Interactive modes: sync once; remount only when labState changes (via onChange).
 setTick(() => {});
 setDispose(() => unmount());
 }
}

function spiralRecapHandler(api) {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 unmountIoKitchen();
 const stops = [
 { id: 1, label: "1 Input", caption: "Spiral 1: order window - information must have a path in" },
 { id: 2, label: "2 Output", caption: "Spiral 2: serving window - finished results must get out" },
 { id: 3, label: "3 Both", caption: "Spiral 3: touchscreens and controllers do both jobs" },
 { id: 4, label: "4 Connect", caption: "Spiral 4: full Input → CPU/RAM/Storage → Output loop" },
 ];
 setDescription("Recap map - four spirals of Input & Output.");
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
 ctx.fillStyle = "#dbeafe";
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

export function registerIoScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("ioOpen", (api) => {
 labState.ioMode = "open";
 labState.ioOpenReady = false;
 mountDomScene(api, "open", { description: "Sealed kitchen - no windows yet.", staticStage: true });
 });

 arena.registerScene("ioInput1", (api) =>
 mountDomScene(api, "input1", { description: "Cut an order window - type reaches the chef." })
 );
 arena.registerScene("ioInputGallery", (api) =>
 mountDomScene(api, "inputGallery", { description: "Input device gallery - arrows point in." })
 );
 arena.registerScene("ioTermsInput", (api) =>
 mountDomScene(api, "termsInput", { description: "Input device definition.", staticStage: true })
 );
 arena.registerScene("ioOutput1", (api) =>
 mountDomScene(api, "output1", { description: "Cut a serving window - dish reaches you." })
 );
 arena.registerScene("ioOutputGallery", (api) =>
 mountDomScene(api, "outputGallery", { description: "Output device gallery - arrows point out." })
 );
 arena.registerScene("ioTermsOutput", (api) =>
 mountDomScene(api, "termsOutput", { description: "Output device definition.", staticStage: true })
 );
 arena.registerScene("ioBoth1", (api) =>
 mountDomScene(api, "both1", { description: "Touchscreen both ways + sort devices." })
 );
 arena.registerScene("ioBothDiagram", (api) =>
 mountDomScene(api, "bothDiagram", { description: "Input / Output / Both zones.", staticStage: true })
 );
 arena.registerScene("ioTermsBoth", (api) =>
 mountDomScene(api, "termsBoth", { description: "I/O device definition.", staticStage: true })
 );
 arena.registerScene("ioCycle4", (api) =>
 mountDomScene(api, "cycle4", { description: "Full input → CPU → output cycle." })
 );
 arena.registerScene("ioAccess4", (api) =>
 mountDomScene(api, "access4", { description: "Accessible I/O in real life.", staticStage: true })
 );
 arena.registerScene("ioTermsCycle", (api) =>
 mountDomScene(api, "termsCycle", { description: "Complete I/O summary.", staticStage: true })
 );
 arena.registerScene("ioClose", (api) => mountDomScene(api, "close", { description: "The kitchen has windows now." }));

 arena.registerScene("ioSpiral", spiralRecapHandler);

 /** Legacy aliases */
 arena.registerScene("ioMeet", (api) => mountDomScene(api, "open", { staticStage: true }));
 arena.registerScene("ioLab", (api) => mountDomScene(api, "input1", { description: "I/O lab." }));
 arena.registerScene("ioSort", (api) => mountDomScene(api, "both1", { description: "Sort I/O." }));
 arena.registerScene("ioRule", (api) => mountDomScene(api, "termsCycle", { staticStage: true }));
 arena.registerScene("ioStretch", (api) => mountDomScene(api, "access4", { staticStage: true }));
 arena.registerScene("ioMyth", (api) => mountDomScene(api, "bothDiagram", { staticStage: true }));
 arena.registerScene("ioDrill", (api) => mountDomScene(api, "cycle4", { description: "I/O drill." }));
 arena.registerScene("ioMastery", spiralRecapHandler);
 arena.registerScene("pushMeet", (api) => mountDomScene(api, "open", { staticStage: true }));
 arena.registerScene("pushMastery", spiralRecapHandler);
}
