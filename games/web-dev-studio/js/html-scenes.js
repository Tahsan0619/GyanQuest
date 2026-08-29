/**
 * Web Dev Studio · Mission 1: HTML House: Bruner spiral scenes.
 * DOM house overlay for enactive steps; canvas for recap map.
 */
import { labState, pulseSuccessFeedback } from "./lab-state.js?v=html5";
import { mountHtmlHouse, syncHtmlHouse, unmountHtmlHouse } from "./html-house-mount.js?v=html5";

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

function failFlash(ctx, w, h) {
 const until = labState.failPulse;
 if (!until || performance.now() > until) return;
 ctx.fillStyle = `rgba(248,113,113,${Math.max(0, (until - performance.now()) / 420) * 0.28})`;
 ctx.fillRect(0, 0, w, h);
}

function successFlash(ctx, w, h) {
 const until = labState.successPulse;
 if (!until || performance.now() > until) return;
 ctx.fillStyle = `rgba(251,146,60,${Math.max(0, (until - performance.now()) / 380) * 0.22})`;
 ctx.fillRect(0, 0, w, h);
}

function mountDomScene(api, mode, opts = {}) {
 const { setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const viewport = document.getElementById("viewport");
 setDescription(opts.description || "HTML House");
 labState.htmlMode = mode;
 const bump = () => syncHtmlHouse(mode, { onChange: bump });
 const unmount = mountHtmlHouse(viewport, bump);
 syncHtmlHouse(mode, { onChange: bump, banner: opts.banner });
 setIntentHandler(() => {});
 setHitRegions([]);
 if (!opts.staticStage) {
 setTick(() => {
 if (mode === "close") {
 /* close scene manages its own tick */
 return;
 }
 syncHtmlHouse(mode);
 });
 } else {
 setTick(() => {});
 }
 setDispose(() => unmount());
}

export function registerHtmlScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("htmlOpen", (api) => {
 labState.htmlMode = "lot";
 labState.htmlOpenReady = false;
 mountDomScene(api, "lot", {
 description: "Empty lot. <html> types: a house frame rises.",
 staticStage: true,
 });
 });

 arena.registerScene("htmlRoom", (api) => {
 labState.htmlPhase = labState.htmlRoomBuilt ? 1 : 0;
 mountDomScene(api, "room", {
 description: "Build one room, then forget the closing tag.",
 });
 });

 arena.registerScene("htmlBlueprint", (api) => {
 mountDomScene(api, "blueprint", { description: "Blueprint ↔ HTML: same three parts." });
 });

 arena.registerScene("htmlTerms", (api) => {
 mountDomScene(api, "terms", { description: "Tag, opening tag, closing tag, element." });
 });

 arena.registerScene("htmlNest", (api) => {
 labState.htmlPhase = labState.htmlNestBuilt ? 1 : 0;
 mountDomScene(api, "nest", { description: "Nest rooms. Close inner before outer." });
 });

 arena.registerScene("htmlDolls", (api) => {
 mountDomScene(api, "dolls", { description: "Nesting dolls ↔ indented HTML." });
 });

 arena.registerScene("htmlNestCode", (api) => {
 mountDomScene(api, "nestcode", { description: "Valid vs invalid nesting." });
 });

 arena.registerScene("htmlFurnish", (api) => {
 mountDomScene(api, "furnish", { description: "Furnish the house: header, hero, main, footer, div." });
 });

 arena.registerScene("htmlLayout", (api) => {
 mountDomScene(api, "layout", { description: "House blueprint ↔ real webpage layout." });
 });

 arena.registerScene("htmlSemantic", (api) => {
 mountDomScene(api, "semantic", { description: "Semantic tags vs blank div." });
 });

 arena.registerScene("htmlIframe", (api) => {
 mountDomScene(api, "iframe", { description: "Cut an iframe window to another house." });
 });

 arena.registerScene("htmlMontage", (api) => {
 mountDomScene(api, "montage", { description: "Maps, videos, payments: iframe windows." });
 });

 arena.registerScene("htmlSummary", (api) => {
 mountDomScene(api, "summary", { description: "Summary: tags, semantic rooms, iframe, screen readers." });
 });

 arena.registerScene("htmlClose", (api) => {
 const { setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const viewport = document.getElementById("viewport");
 const start = performance.now();
 setDescription("The house is built. Zoom out replay.");
 labState.htmlMode = "close";
 const bump = () => syncHtmlHouse("close");
 const unmount = mountHtmlHouse(viewport, bump);
 syncHtmlHouse("close");
 setIntentHandler(() => {});
 setHitRegions([]);
 setTick(() => {
 const t = (performance.now() - start) / 1000;
 labState.htmlCloseU = Math.min(1, t / 4);
 syncHtmlHouse("close");
 });
 setDispose(() => unmount());
 });

 arena.registerScene("htmlSpiral", (api) => {
 const { ctx, setTick, setDispose, setDescription, setHitRegions, setIntentHandler } = api;
 const start = performance.now();
 const stops = [
 { id: 1, label: "1 Tags", caption: "Spiral 1: tags are rooms with doors in and out" },
 { id: 2, label: "2 Nesting", caption: "Spiral 2: last opened, first closed" },
 { id: 3, label: "3 Structure", caption: "Spiral 3: header, main, footer, div" },
 { id: 4, label: "4 iframe", caption: "Spiral 4: windows into other pages" },
 ];
 setDescription("Recap map of the four HTML House spirals.");
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
 g.addColorStop(0, "#1e293b");
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
 roundRect(ctx, x - 36, y - 16, 72, 32, 10);
 ctx.fill();
 ctx.fillStyle = "#ffedd5";
 ctx.font = "700 11px Segoe UI, sans-serif";
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
 ctx.fillStyle = "#94a3b8";
 ctx.font = "600 11px Segoe UI, sans-serif";
 ctx.textAlign = "center";
 ctx.fillText("Tap a number · Finish when ready", w * 0.5, h * 0.9);
 const hits = stops.map((s, i) => {
 const ang = -Math.PI / 2 + (i / 3.2) * Math.PI * 1.35;
 return {
 id: "sp" + s.id,
 shape: "rect",
 x: cx + Math.cos(ang) * r * 0.92,
 y: cy + Math.sin(ang) * r * 0.92,
 w: 80,
 h: 36,
 meta: { action: "spiral", stop: s.id },
 };
 });
 hits.push({
 id: "fin",
 shape: "rect",
 x: w * 0.5,
 y: h * 0.9,
 w: 200,
 h: 32,
 meta: { action: "spiralFinish" },
 });
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });
}
