/**
 * Backend Builder · Mission 1: Server Basics - Bruner spiral scenes (restaurant DOM).
 */
import { labState, pulseSuccessFeedback } from "./lab-state.js?v=rest2";
import { mountRestaurant, syncRestaurant, unmountRestaurant } from "./restaurant-mount.js?v=rest3";

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
 setDescription(opts.description || "Server Basics");
 labState.srvMode = mode;
 const bump = () => syncRestaurant(mode, { onChange: bump });
 const unmount = mountRestaurant(viewport, bump);
 syncRestaurant(mode, { onChange: bump, banner: opts.banner });
 setIntentHandler(() => {});
 setHitRegions([]);
 if (!opts.staticStage) {
 setTick(() => syncRestaurant(mode));
 } else {
 setTick(() => {});
 }
 setDispose(() => unmount());
}

export function registerServerScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("srvOpen", (api) => {
 labState.srvMode = "open";
 labState.srvLoadPhase = 0;
 labState.srvOpenReady = false;
 mountDomScene(api, "open", {
 description: "Click → blank flicker → page loads.",
 staticStage: true,
 });
 });

 arena.registerScene("srvKitchen1", (api) => mountDomScene(api, "kitchen1", { description: "Table without kitchen - then wire the kitchen." }));
 arena.registerScene("srvSplit1", (api) => mountDomScene(api, "split1", { description: "Client asks. Server provides." }));
 arena.registerScene("srvTerms1", (api) => mountDomScene(api, "terms1", { description: "Client, server, network." }));
 arena.registerScene("srvOrder2", (api) => mountDomScene(api, "order2", { description: "Order Homepage Special or Secret Page." }));
 arena.registerScene("srvLoop2", (api) => mountDomScene(api, "loop2", { description: "Request → server → response loop." }));
 arena.registerScene("srvTerms2", (api) => mountDomScene(api, "terms2", { description: "Request, response, status codes." }));
 arena.registerScene("srvBusy3", (api) => mountDomScene(api, "busy3", { description: "Six tables, one kitchen - busy shift." }));
 arena.registerScene("srvScale3", (api) => mountDomScene(api, "scale3", { description: "Many clients, one server." }));
 arena.registerScene("srvTerms3", (api) => mountDomScene(api, "terms3", { description: "Concurrent requests on dedicated hardware." }));
 arena.registerScene("srvDns4", (api) => mountDomScene(api, "dns4", { description: "Domain → DNS → IP → kitchen." }));
 arena.registerScene("srvMontage4", (api) => mountDomScene(api, "montage4", { description: "Website, app, speaker - same pattern." }));
 arena.registerScene("srvTerms4", (api) => mountDomScene(api, "terms4", { description: "Domain, IP, DNS." }));

 arena.registerScene("srvClose", (api) => {
 const { setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const viewport = document.getElementById("viewport");
 const start = performance.now();
 setDescription("The hidden restaurant behind every page load.");
 labState.srvMode = "close";
 const bump = () => syncRestaurant("close");
 const unmount = mountRestaurant(viewport, bump);
 syncRestaurant("close");
 setIntentHandler(() => {});
 setHitRegions([]);
 setTick(() => {
 const t = (performance.now() - start) / 1000;
 labState.srvCloseU = Math.min(1, t / 4);
 syncRestaurant("close");
 });
 setDispose(() => unmount());
 });

 arena.registerScene("srvSpiral", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const stops = [
 { id: 1, label: "1 Client/Server", caption: "Spiral 1: table + kitchen - who cooks?" },
 { id: 2, label: "2 Request/RES", caption: "Spiral 2: order ticket - 200 vs 404" },
 { id: 3, label: "3 Many tables", caption: "Spiral 3: one kitchen, six tables" },
 { id: 4, label: "4 DNS", caption: "Spiral 4: find the restaurant by name" },
 ];
 setDescription("Recap map of the four Server Basics spirals.");
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
 ctx.strokeStyle = "rgba(251,146,60,0.35)";
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
 ctx.fillStyle = lit ? "#ea580c" : "rgba(51,65,85,0.95)";
 roundRect(ctx, x - 44, y - 16, 88, 32, 10);
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
