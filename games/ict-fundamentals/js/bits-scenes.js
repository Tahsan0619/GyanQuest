/**
 * ICT / Mission 1: Computer Bits - kitchen metaphor (Bruner spirals).
 */
import { labState, pulseSuccessFeedback } from "./lab-state.js";
import { mountBitsKitchen, syncBits, unmountBitsKitchen } from "./bits-mount.js";

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
 setDescription(opts.description || "Computer Bits - kitchen");
 labState.bitsMode = mode;
 const bump = () => syncBits(mode, { onChange: bump, banner: opts.banner });
 const unmount = mountBitsKitchen(viewport, bump);
 syncBits(mode, { onChange: bump, banner: opts.banner });
 setIntentHandler(() => {});
 setHitRegions([]);
 if (mode === "reinterpret1") {
 let iv = setInterval(() => {
 labState.bitsReinterpretPhase = ((labState.bitsReinterpretPhase || 0) + 1) % 3;
 bump();
 }, 2200);
 setDispose(() => {
 clearInterval(iv);
 unmount();
 });
 } else if (mode === "loop2" || mode === "close") {
 setTick(() => {
 if (mode === "close") {
 const start = labState._closeStart || performance.now();
 if (!labState._closeStart) labState._closeStart = start;
 labState.bitsCloseU = Math.min(1, (performance.now() - start) / 5000);
 }
 bump();
 });
 setDispose(() => {
 labState._closeStart = 0;
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
 unmountBitsKitchen();
 const stops = [
 { id: 1, label: "1 Bits", caption: "Spiral 1: switches - only on or off, yet 256 patterns from 8" },
 { id: 2, label: "2 CPU", caption: "Spiral 2: the chef - one instruction loop, billions per second" },
 { id: 3, label: "3 Memory", caption: "Spiral 3: counter fast & forgetful, pantry slow & permanent" },
 { id: 4, label: "4 Connect", caption: "Spiral 4: storage → RAM → CPU → screen; spec sheet decoded" },
 ];
 setDescription("Recap map - four spirals of Computer Bits.");
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
 ctx.strokeStyle = "rgba(96,165,250,0.35)";
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
 ctx.fillStyle = lit ? "#2563eb" : "rgba(51,65,85,0.95)";
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
 ctx.fillStyle = "#93c5fd";
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

export function registerBitsScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("bitsOpen", (api) => {
 labState.bitsMode = "open";
 labState.bitsOpenReady = false;
 mountDomScene(api, "open", { description: "Laptop wakes - billions of switches underneath.", staticStage: true });
 });

 arena.registerScene("bitsSwitches1", (api) =>
 mountDomScene(api, "switches1", { description: "Flip the switches - live binary readout." })
 );
 arena.registerScene("bitsReinterpret1", (api) =>
 mountDomScene(api, "reinterpret1", { description: "Same pattern - number, letter, pixel." })
 );
 arena.registerScene("bitsTerms1", (api) =>
 mountDomScene(api, "terms1", { description: "Bit and byte.", staticStage: true })
 );
 arena.registerScene("bitsChef2", (api) =>
 mountDomScene(api, "chef2", { description: "Give the chef an instruction - then speed it up." })
 );
 arena.registerScene("bitsLoop2", (api) => mountDomScene(api, "loop2", { description: "CPU instruction loop." }));
 arena.registerScene("bitsTerms2", (api) =>
 mountDomScene(api, "terms2", { description: "CPU, instruction, clock speed.", staticStage: true })
 );
 arena.registerScene("bitsKitchen3", (api) =>
 mountDomScene(api, "kitchen3", { description: "Counter vs pantry - speed and power-off." })
 );
 arena.registerScene("bitsCompare3", (api) =>
 mountDomScene(api, "compare3", { description: "Fast but forgetful vs slow but permanent.", staticStage: true })
 );
 arena.registerScene("bitsTerms3", (api) =>
 mountDomScene(api, "terms3", { description: "RAM and storage.", staticStage: true })
 );
 arena.registerScene("bitsProgram4", (api) =>
 mountDomScene(api, "program4", { description: "Open a program - step by step." })
 );
 arena.registerScene("bitsSpec4", (api) =>
 mountDomScene(api, "spec4", { description: "Read a spec sheet.", staticStage: true })
 );
 arena.registerScene("bitsTerms4", (api) =>
 mountDomScene(api, "terms4", { description: "Full summary.", staticStage: true })
 );
 arena.registerScene("bitsClose", (api) => mountDomScene(api, "close", { description: "The kitchen, fully understood." }));

 arena.registerScene("bitsSpiral", spiralRecapHandler);

 /** Legacy aliases for boot / QA */
 arena.registerScene("bitsMeet", (api) => {
 labState.bitsMode = "open";
 mountDomScene(api, "open", { staticStage: true });
 });
 arena.registerScene("bitsMastery", spiralRecapHandler);
 arena.registerScene("bitsLab", (api) => mountDomScene(api, "kitchen3", { description: "Kitchen lab." }));
 arena.registerScene("bitsRule", (api) => mountDomScene(api, "terms3", { staticStage: true }));
 arena.registerScene("bitsSort", (api) => mountDomScene(api, "switches1", { description: "Bits sort." }));
 arena.registerScene("bitsStretch", (api) => mountDomScene(api, "spec4", { staticStage: true }));
 arena.registerScene("bitsMyth", (api) => mountDomScene(api, "compare3", { staticStage: true }));
 arena.registerScene("bitsDrill", (api) => mountDomScene(api, "loop2", { description: "Bits drill." }));
}
