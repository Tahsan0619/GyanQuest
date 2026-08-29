/**
 * Database & SQL · Mission 1: Tables & Rows - Bruner spiral (storage room DOM).
 */
import { labState, pulseSuccessFeedback } from "./lab-state.js?v=stor2";
import { mountStorageRoom, syncStorageRoom, unmountStorageRoom } from "./storage-room-mount.js?v=stor5";

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
 setDescription(opts.description || "Tables & Rows");
 labState.dbMode = mode;
 const bump = () => syncStorageRoom(mode, { onChange: bump });
 const unmount = mountStorageRoom(viewport, bump);
 syncStorageRoom(mode, { onChange: bump, banner: opts.banner });
 setIntentHandler(() => {});
 setHitRegions([]);
 if (!opts.staticStage) {
 setTick(() => syncStorageRoom(mode));
 } else {
 setTick(() => {});
 }
 setDispose(() => unmount());
}

export function registerTableScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("tblOpen", (api) => {
 labState.dbMode = "open";
 labState.dbDoorOpen = false;
 labState.dbOpenReady = false;
 mountDomScene(api, "open", { description: "Kitchen storage room door.", staticStage: true });
 });

 arena.registerScene("tblSearch", (api) => mountDomScene(api, "search", { description: "Chaotic pile vs organized shelves." }));
 arena.registerScene("tblShelves1", (api) => mountDomScene(api, "shelves1", { description: "Labeled shelves in the storage room." }));
 arena.registerScene("tblTerms1", (api) => mountDomScene(api, "terms1", { description: "What is a database?" }));
 arena.registerScene("tblBuild2", (api) => mountDomScene(api, "build2", { description: "Build the Customers shelf." }));
 arena.registerScene("tblGrid2", (api) => mountDomScene(api, "grid2", { description: "Shelf morphs into grid." }));
 arena.registerScene("tblTerms2", (api) => mountDomScene(api, "terms2", { description: "Table, row, column." }));
 arena.registerScene("tblSchema3", (api) => mountDomScene(api, "schema3", { description: "Schema enforcement." }));
 arena.registerScene("tblBlueprint3", (api) => mountDomScene(api, "blueprint3", { description: "Column job descriptions." }));
 arena.registerScene("tblTerms3", (api) => mountDomScene(api, "terms3", { description: "Schema and data types." }));
 arena.registerScene("tblQuery4", (api) => mountDomScene(api, "query4", { description: "Build a query request form." }));
 arena.registerScene("tblMorph4", (api) => mountDomScene(api, "morph4", { description: "Form becomes SQL." }));
 arena.registerScene("tblTerms4", (api) => mountDomScene(api, "terms4", { description: "SELECT, FROM, WHERE." }));

 arena.registerScene("tblClose", (api) => {
 const { setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const viewport = document.getElementById("viewport");
 const start = performance.now();
 setDescription("The storage room, understood.");
 labState.dbMode = "close";
 labState.dbDoorOpen = true;
 const bump = () => syncStorageRoom("close");
 const unmount = mountStorageRoom(viewport, bump);
 syncStorageRoom("close");
 setIntentHandler(() => {});
 setHitRegions([]);
 setTick(() => {
 const t = (performance.now() - start) / 1000;
 labState.dbCloseU = Math.min(1, t / 4);
 syncStorageRoom("close");
 });
 setDispose(() => unmount());
 });

 arena.registerScene("tblSpiral", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const stops = [
 { id: 1, label: "1 Database", caption: "Spiral 1: chaotic pile vs organized shelves" },
 { id: 2, label: "2 Table/Row", caption: "Spiral 2: Customers shelf and cards" },
 { id: 3, label: "3 Schema", caption: "Spiral 3: blueprint rejects bad cards" },
 { id: 4, label: "4 SQL", caption: "Spiral 4: request form → SELECT query" },
 ];
 setDescription("Recap map of the four Tables & Rows spirals.");
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
 g.addColorStop(0, "#134e4a");
 g.addColorStop(1, "#0f172a");
 ctx.fillStyle = g;
 ctx.fillRect(0, 0, w, h);
 const cx = w * 0.5;
 const cy = h * 0.46;
 const r = Math.min(w, h) * 0.32;
 ctx.strokeStyle = "rgba(45,212,191,0.35)";
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
 ctx.fillStyle = lit ? "#0d9488" : "rgba(51,65,85,0.95)";
 roundRect(ctx, x - 40, y - 16, 80, 32, 10);
 ctx.fill();
 ctx.fillStyle = "#ccfbf1";
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
 ctx.fillStyle = "#5eead4";
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
