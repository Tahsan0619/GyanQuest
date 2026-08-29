/**
 * Force Fighter Canvas 2D arena - layout-aware, hit-testable, resize-safe.
 */
import { computeLabLayout } from "./scene-layout.js";

export function createArena2D(canvas, theme = {}) {
 const ctx = canvas.getContext("2d", { alpha: false });
 if (!ctx) throw new Error("Canvas 2D not available");

 const SCENES = {};
 let playOpts = {};
 let extraTick = null;
 let sceneDispose = null;
 let w = 640;
 let h = 360;
 let dpr = 1;
 let cssW = 640;
 let cssH = 360;
 let layout = computeLabLayout(w, h);
 let lastSceneName = theme.defaultScene || "atomsMeet";
 let hitRegions = [];
 let dragState = null;
 /** Scene-owned intents (heat handle, pour, etc.) - not cleared by panel mounts. */
 let sceneIntent = null;
 /** Panel/activity intents - may stack with sceneIntent. */
 let panelIntent = null;

 const reducedMotion =
 typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

 function clearScene() {
 if (typeof sceneDispose === "function") {
 try {
 sceneDispose();
 } catch {
 /* ignore */
 }
 sceneDispose = null;
 }
 extraTick = null;
 hitRegions = [];
 dragState = null;
 sceneIntent = null;
 // Keep panelIntent - activity cleanup owns clearing it.
 }

 function drawLabBackdrop() {
 const g = ctx.createLinearGradient(0, 0, 0, h);
 g.addColorStop(0, "#14532d");
 g.addColorStop(0.4, "#052e16");
 g.addColorStop(1, "#022c22");
 ctx.fillStyle = g;
 ctx.fillRect(0, 0, w, h);

 const rg = ctx.createRadialGradient(w * 0.5, h * 0.2, 12, w * 0.5, h * 0.4, w * 0.7);
 rg.addColorStop(0, "rgba(74,222,128,0.14)");
 rg.addColorStop(1, "rgba(74,222,128,0)");
 ctx.fillStyle = rg;
 ctx.fillRect(0, 0, w, h);

 // Floor / road
 ctx.fillStyle = "#14532d";
 ctx.fillRect(0, layout.floorY, w, h - layout.floorY);
 ctx.strokeStyle = "rgba(134,239,172,0.35)";
 ctx.lineWidth = 3;
 ctx.setLineDash([18, 14]);
 ctx.beginPath();
 ctx.moveTo(w * 0.08, layout.floorY + 18);
 ctx.lineTo(w * 0.92, layout.floorY + 18);
 ctx.stroke();
 ctx.setLineDash([]);

 // Desk / platform
 ctx.fillStyle = "#166534";
 roundDesk(ctx, w * 0.08, layout.deskTop, w * 0.84, layout.deskH, 6);
 ctx.fill();
 ctx.fillStyle = "#052e16";
 ctx.fillRect(w * 0.14, layout.deskTop + layout.deskH, w * 0.07, h * 0.12);
 ctx.fillRect(w * 0.79, layout.deskTop + layout.deskH, w * 0.07, h * 0.12);

 ctx.strokeStyle = "rgba(187,247,208,0.35)";
 ctx.lineWidth = 1.5;
 ctx.beginPath();
 ctx.moveTo(w * 0.08, layout.deskTop + 2);
 ctx.lineTo(w * 0.92, layout.deskTop + 2);
 ctx.stroke();
 }

 function roundDesk(c, x, y, ww, hh, r) {
 c.beginPath();
 c.moveTo(x + r, y);
 c.arcTo(x + ww, y, x + ww, y + hh, r);
 c.arcTo(x + ww, y + hh, x, y + hh, r);
 c.arcTo(x, y + hh, x, y, r);
 c.arcTo(x, y, x + ww, y, r);
 c.closePath();
 }

 function setDescription(text) {
 const description = text || "2D biology animation stage";
 canvas.setAttribute("aria-label", description);
 const live = document.getElementById("bio-scene-live") || document.getElementById("chem-scene-live");
 if (live) live.textContent = description;
 }

 function setHitRegions(regions) {
 hitRegions = Array.isArray(regions) ? regions : [];
 }

 function setSceneIntentHandler(fn) {
 sceneIntent = typeof fn === "function" ? fn : null;
 }

 /** Panel/activity handler. Prefer this from chem-activities; scenes use setSceneIntentHandler. */
 function setIntentHandler(fn) {
 panelIntent = typeof fn === "function" ? fn : null;
 }

 function cssToCanvas(clientX, clientY) {
 const rect = canvas.getBoundingClientRect();
 return {
 x: ((clientX - rect.left) / rect.width) * w,
 y: ((clientY - rect.top) / rect.height) * h,
 };
 }

 function pointInRegion(r, x, y) {
 if (!r) return false;
 if (r.shape === "ellipse") {
 const dx = (x - r.x) / (r.rx || r.r || 20);
 const dy = (y - r.y) / (r.ry || r.r || 20);
 return dx * dx + dy * dy <= 1;
 }
 const rw = r.w || 40;
 const rh = r.h || 40;
 // Tiny Bits uses shape:"rect" with (x,y) as CENTER.
 // Element Hunt / Bond Buddies omit shape and pass TOP-LEFT + size.
 if (r.shape === "rect" || r.origin === "center") {
 return x >= r.x - rw / 2 && x <= r.x + rw / 2 && y >= r.y - rh / 2 && y <= r.y + rh / 2;
 }
 // Default / shape:"box": top-left origin AABB
 return x >= r.x && x <= r.x + rw && y >= r.y && y <= r.y + rh;
 }

 function hitTest(x, y, excludeId = null) {
 for (let i = hitRegions.length - 1; i >= 0; i--) {
 const r = hitRegions[i];
 if (!r || (excludeId && r.id === excludeId)) continue;
 if (pointInRegion(r, x, y)) return r;
 }
 return null;
 }

 /** Prefer drop zones / accept targets under the pointer (for drag-sort). */
 function hitTestDrop(x, y, excludeId = null) {
 // Prefer zones (scan all); inflate box slightly so drops near edges still count.
 let best = null;
 for (let i = 0; i < hitRegions.length; i++) {
 const r = hitRegions[i];
 if (!r?.meta?.zoneId || (excludeId && r.id === excludeId)) continue;
 if (pointInRegion(r, x, y) || pointInRegion(inflateRegion(r, 12), x, y)) {
 best = r;
 }
 }
 if (best) return best;
 return hitTest(x, y, excludeId);
 }

 function inflateRegion(r, pad) {
 if (!r) return r;
 if (r.shape === "ellipse") {
 return { ...r, r: (r.r || 20) + pad, rx: (r.rx || r.r || 20) + pad, ry: (r.ry || r.r || 20) + pad };
 }
 if (r.shape === "rect" || r.origin === "center") {
 return { ...r, w: (r.w || 40) + pad * 2, h: (r.h || 40) + pad * 2 };
 }
 return { ...r, x: r.x - pad, y: r.y - pad, w: (r.w || 40) + pad * 2, h: (r.h || 40) + pad * 2 };
 }

 function emit(intent) {
 try {
 sceneIntent?.(intent);
 } catch {
 /* ignore */
 }
 try {
 panelIntent?.(intent);
 } catch {
 /* ignore */
 }
 }

 function onPointerDown(e) {
 const pt = cssToCanvas(e.clientX, e.clientY);
 const hit = hitTest(pt.x, pt.y);
 if (!hit) return;
 try {
 canvas.setPointerCapture?.(e.pointerId);
 } catch {
 /* ignore */
 }
 dragState = {
 id: hit.id,
 pointerId: e.pointerId,
 startX: pt.x,
 startY: pt.y,
 hit,
 moved: false,
 };
 canvas.style.cursor = "grabbing";
 if (hit.onDown) hit.onDown(pt, hit);
 emit({ type: "CANVAS_DOWN", id: hit.id, x: pt.x, y: pt.y, meta: hit.meta });
 e.preventDefault();
 }

 function onPointerMove(e) {
 const pt = cssToCanvas(e.clientX, e.clientY);
 if (!dragState) {
 const hit = hitTest(pt.x, pt.y);
 canvas.style.cursor = hit ? "grab" : "crosshair";
 return;
 }
 if (dragState.pointerId != null && e.pointerId !== dragState.pointerId) return;
 const dx = pt.x - dragState.startX;
 const dy = pt.y - dragState.startY;
 if (Math.abs(dx) + Math.abs(dy) > 3) dragState.moved = true;
 if (dragState.hit.onDrag) dragState.hit.onDrag(pt, dragState.hit, dx, dy);
 emit({
 type: "CANVAS_DRAG",
 id: dragState.id,
 x: pt.x,
 y: pt.y,
 dx,
 dy,
 meta: dragState.hit.meta,
 });
 e.preventDefault();
 }

 function endDrag(e) {
 if (!dragState) return;
 if (e && dragState.pointerId != null && e.pointerId !== dragState.pointerId) return;
 const pt = e ? cssToCanvas(e.clientX, e.clientY) : { x: dragState.startX, y: dragState.startY };
 const drop = hitTestDrop(pt.x, pt.y, dragState.id);
 if (dragState.hit.onUp) dragState.hit.onUp(pt, dragState.hit, drop);
 emit({
 type: "CANVAS_UP",
 id: dragState.id,
 x: pt.x,
 y: pt.y,
 dropId: drop?.id || null,
 moved: dragState.moved,
 meta: dragState.hit.meta,
 dropMeta: drop?.meta,
 });
 if (!dragState.moved) {
 emit({ type: "CANVAS_TAP", id: dragState.id, x: pt.x, y: pt.y, meta: dragState.hit.meta });
 }
 dragState = null;
 canvas.style.cursor = "grab";
 }

 function onPointerUp(e) {
 endDrag(e);
 }

 canvas.style.touchAction = "none";
 canvas.style.cursor = "grab";
 canvas.addEventListener("pointerdown", onPointerDown);
 canvas.addEventListener("pointermove", onPointerMove);
 canvas.addEventListener("pointerup", onPointerUp);
 canvas.addEventListener("pointercancel", (e) => endDrag(e));
 canvas.addEventListener("lostpointercapture", (e) => {
 if (dragState) endDrag(e);
 });

 function registerAlias(alias, targetName) {
 SCENES[alias] = function runAlias() {
 const fn = SCENES[targetName];
 if (fn) fn();
 };
 }

 function registerScene(name, builder) {
 SCENES[name] = function runScene() {
 builder({
 ctx,
 canvas,
 get width() {
 return w;
 },
 get height() {
 return h;
 },
 get layout() {
 return layout;
 },
 opts: playOpts,
 reducedMotion,
 setTick(fn) {
 extraTick = fn;
 },
 setDispose(fn) {
 sceneDispose = fn;
 },
 setDescription,
 setHitRegions,
 setIntentHandler: setSceneIntentHandler,
 setSceneIntentHandler,
 setPanelIntentHandler: setIntentHandler,
 drawBackdrop: drawLabBackdrop,
 });
 };
 }

 function playExample(name, opts = {}) {
 playOpts = opts || {};
 lastSceneName = name;
 canvas.dataset.scene = name;
 clearScene();
 const fn = SCENES[name] || SCENES[theme.defaultScene] || SCENES.lifeOpen;
 if (fn) fn();
 else extraTick = () => drawLabBackdrop();
 }

 function resize() {
 const parent = canvas.parentElement;
 cssW = Math.max(280, parent?.clientWidth || window.innerWidth);
 cssH = Math.max(200, parent?.clientHeight || Math.max(240, window.innerHeight * 0.4));
 dpr = Math.min(window.devicePixelRatio || 1, 2);
 canvas.width = Math.floor(cssW * dpr);
 canvas.height = Math.floor(cssH * dpr);
 canvas.style.width = `${cssW}px`;
 canvas.style.height = `${cssH}px`;
 ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
 w = cssW;
 h = cssH;
 layout = computeLabLayout(w, h);
 // Do NOT remount the scene - preserve simulation clocks.
 // Scenes read api.layout / width / height each tick.
 }

 function tick() {
 if (extraTick) extraTick();
 }

 function enterPlayground() {
 playExample("atomsMeet", { phase: "cloud" });
 }

 function exitPlayground() {
 clearScene();
 drawLabBackdrop();
 }

 function dispose() {
 canvas.removeEventListener("pointerdown", onPointerDown);
 canvas.removeEventListener("pointermove", onPointerMove);
 canvas.removeEventListener("pointerup", onPointerUp);
 canvas.removeEventListener("pointercancel", onPointerUp);
 clearScene();
 }

 resize();
 drawLabBackdrop();

 return {
 playExample,
 registerScene,
 registerAlias,
 tick,
 resize,
 clearExtras: clearScene,
 enterPlayground,
 exitPlayground,
 setDescription,
 setHitRegions,
 setIntentHandler,
 setSceneIntentHandler,
 dispose,
 hitTest,
 cssToCanvas,
 get width() {
 return w;
 },
 get height() {
 return h;
 },
 get layout() {
 return layout;
 },
 get reducedMotion() {
 return reducedMotion;
 },
 ctx,
 };
}

