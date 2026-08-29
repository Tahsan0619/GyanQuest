/**
 * Math Quest · Mission 2: Fraction Friends - Canvas 2D scenes (Tiny Bits depth).
 * Pizza/roti shares, equal parts, halves/thirds/fourths, BD stretch.
 */
import { labState, pulseFailFeedback, pulseSuccessFeedback } from "./lab-state.js?v=numbersense1";
import { sortSlotPositions, getActiveSession } from "./activity-controller.js";

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

function drawLabel(ctx, text, x, y, opts = {}) {
 ctx.font = opts.font || "600 14px Segoe UI, system-ui, sans-serif";
 const tw = Math.min(ctx.measureText(text).width + 24, opts.maxW || 540);
 const bh = opts.h || 26;
 ctx.fillStyle = opts.bg || "rgba(67, 20, 7, 0.92)";
 roundRect(ctx, x - tw / 2, y - bh / 2, tw, bh, 10);
 ctx.fill();
 ctx.strokeStyle = opts.border || "rgba(251,146,60,0.55)";
 ctx.lineWidth = 1.4;
 ctx.stroke();
 ctx.fillStyle = opts.color || "#ffedd5";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(text, x, y + 1);
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

/** Draw a circle divided into n equal slices; shade `shaded` of them */
function drawFractionCircle(ctx, x, y, r, parts, shaded, colors = ["#fb923c", "#fdba74"]) {
 const n = Math.max(1, parts);
 for (let i = 0; i < n; i++) {
 const a0 = -Math.PI / 2 + (i / n) * Math.PI * 2;
 const a1 = -Math.PI / 2 + ((i + 1) / n) * Math.PI * 2;
 ctx.beginPath();
 ctx.moveTo(x, y);
 ctx.arc(x, y, r, a0, a1);
 ctx.closePath();
 ctx.fillStyle = i < shaded ? colors[0] : colors[1];
 ctx.fill();
 ctx.strokeStyle = "#9a3412";
 ctx.lineWidth = 2;
 ctx.stroke();
 }
}

function drawRotiBar(ctx, x, y, w, parts, shaded) {
 const n = Math.max(1, parts);
 const sw = w / n;
 for (let i = 0; i < n; i++) {
 ctx.fillStyle = i < shaded ? "#f59e0b" : "#fef3c7";
 roundRect(ctx, x + i * sw, y, sw - 3, 36, 6);
 ctx.fill();
 ctx.strokeStyle = "#b45309";
 ctx.stroke();
 }
}

export function registerFracScenes(arena) {
 if (!arena?.registerScene) return;

 arena.registerScene("fracMeet", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, opts, setHitRegions, setIntentHandler } = api;
 const startPhase = opts.phase || labState.phase || "desk";
 labState.phase = startPhase;
 if (labState.fracParts == null) labState.fracParts = 2;
 if (labState.fracShaded == null) labState.fracShaded = 1;
 setDescription("Fraction Friends - fair shares of a whole.");

 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "share") {
 labState.fracShaded = Math.min(labState.fracParts || 2, (labState.fracShaded || 0) + 1);
 pulseSuccessFeedback(180);
 }
 });

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const live = labState.phase || startPhase;
 const parts = labState.fracParts || 2;
 const shaded = labState.fracShaded || 1;
 drawBackdrop();
 ctx.fillStyle = "#7c2d12";
 roundRect(ctx, w * 0.08, layout.deskTop - 8, w * 0.84, 18, 8);
 ctx.fill();

 if (live === "desk") {
 drawFractionCircle(ctx, w * 0.35, h * 0.4, 70, 1, 1, ["#fb923c", "#fb923c"]);
 drawLabel(ctx, "Whole pizza / roti", w * 0.35, h * 0.58, { h: 22, font: "600 12px Segoe UI" });
 drawFractionCircle(ctx, w * 0.68, h * 0.4, 70, 2, 0, ["#fb923c", "#fed7aa"]);
 drawLabel(ctx, "Ready to share", w * 0.68, h * 0.58, { h: 22, font: "600 12px Segoe UI" });
 drawLabel(ctx, "A fraction names a fair share of a whole", w * 0.5, layout.labelY);
 } else if (live === "split" || live === "glow") {
 drawFractionCircle(ctx, w * 0.5, h * 0.4, 80, parts, shaded);
 drawLabel(ctx, `${shaded}/${parts} shaded - equal parts`, w * 0.5, layout.labelY);
 } else {
 drawFractionCircle(ctx, w * 0.5, h * 0.38, 78, 4, 1);
 drawLabel(ctx, "Big idea: equal parts · numerator / denominator", w * 0.5, layout.labelY);
 }
 setHitRegions([
 { id: "pie", shape: "rect", x: w * 0.5, y: h * 0.4, w: 160, h: 160, meta: { action: "share" } },
 ]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("fracSort", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler, reducedMotion } =
 api;
 setDescription("Sort: equal share, unequal cut, or not a fraction story.");
 const chips = [
 { id: "half", text: "1/2 pizza", short: "1/2", color: 0xfb923c },
 { id: "third", text: "1/3 roti", short: "1/3", color: 0xf59e0b },
 { id: "jagged", text: "Uneven split", short: "Uneven", color: 0xf87171 },
 { id: "fourth", text: "1/4 bar", short: "1/4", color: 0xfdba74 },
 { id: "whole", text: "Whole cake", short: "Whole", color: 0xfbbf24 },
 { id: "color", text: "Red color", short: "Color", color: 0x94a3b8 },
 { id: "twofour", text: "2/4 = half?", short: "2/4", color: 0xf97316 },
 { id: "letter", text: "Letter F", short: "Letter", color: 0x78716c },
 ];
 const accept = {
 equal: ["half", "third", "fourth", "twofour"],
 unequal: ["jagged"],
 not: ["color", "letter"],
 // whole is tricky - it's 1/1 or "whole" - put in equal as full share or separate
 };
 // treat whole as equal (1/1)
 accept.equal.push("whole");
 const cardPos = {};
 chips.forEach((c) => {
 cardPos[c.id] = { x: 0, y: 0 };
 });
 let draggingId = null;
 let lastZones = [];

 function placeChip(chipId, zoneId) {
 if (!chipId || !zoneId) return false;
 if (!(accept[zoneId] || []).includes(chipId)) {
 pulseFailFeedback(400);
 return false;
 }
 labState.placed = { ...(labState.placed || {}), [chipId]: zoneId };
 labState.selectedId = chipId;
 const session = getActiveSession();
 if (session?.dispatch) session.dispatch({ type: "PLACE_CHIP", chipId, zoneId, accept: accept[zoneId] });
 else labState._placedVersion = (labState._placedVersion || 0) + 1;
 pulseSuccessFeedback(220);
 return true;
 }
 function zoneAt(x, y) {
 for (const z of lastZones) {
 if (x >= z.x && x <= z.x + z.ww && y >= z.y && y <= z.y + z.hh) return z.id;
 }
 return null;
 }

 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DOWN" && intent.meta?.chipId) {
 draggingId = intent.meta.chipId;
 labState.selectedId = intent.meta.chipId;
 }
 if (intent.type === "CANVAS_DRAG" && intent.meta?.chipId && cardPos[intent.meta.chipId]) {
 draggingId = intent.meta.chipId;
 cardPos[intent.meta.chipId].x = intent.x;
 cardPos[intent.meta.chipId].y = intent.y;
 }
 if (intent.type === "CANVAS_TAP" && intent.meta?.chipId) labState.selectedId = intent.meta.chipId;
 if (intent.type === "CANVAS_TAP" && intent.meta?.zoneId && labState.selectedId) {
 placeChip(labState.selectedId, intent.meta.zoneId);
 }
 if (intent.type === "CANVAS_UP" && intent.meta?.chipId) {
 const zoneId = intent.dropMeta?.zoneId || zoneAt(intent.x, intent.y);
 if (zoneId) placeChip(intent.meta.chipId, zoneId);
 draggingId = null;
 } else if (intent.type === "CANVAS_UP") draggingId = null;
 });

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 drawBackdrop();
 const zoneH = Math.max(100, Math.min(h * 0.28, 130));
 const zoneY = Math.max(layout.labelY + 28, h * 0.09);
 const zones = [
 { id: "equal", label: "Equal shares", x: w * 0.03, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#fb923c" },
 { id: "unequal", label: "Unequal cut", x: w * 0.35, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#f87171" },
 { id: "not", label: "Not a fraction", x: w * 0.67, y: zoneY, ww: w * 0.3, hh: zoneH, color: "#94a3b8" },
 ];
 lastZones = zones;
 const hits = [];
 for (const z of zones) {
 ctx.fillStyle = "rgba(67,20,7,0.75)";
 roundRect(ctx, z.x, z.y, z.ww, z.hh, 12);
 ctx.fill();
 ctx.strokeStyle = z.color;
 ctx.lineWidth = 2.5;
 ctx.stroke();
 drawLabel(ctx, z.label, z.x + z.ww / 2, z.y + 16, { h: 20, font: "700 12px Segoe UI" });
 hits.push({
 id: "zone-" + z.id,
 shape: "rect",
 x: z.x + z.ww / 2,
 y: z.y + z.hh / 2,
 w: z.ww,
 h: z.hh,
 meta: { zoneId: z.id, accept: accept[z.id] },
 });
 }
 const placed = labState.placed || {};
 const byZone = {
 equal: chips.filter((c) => placed[c.id] === "equal").map((c) => c.id),
 unequal: chips.filter((c) => placed[c.id] === "unequal").map((c) => c.id),
 not: chips.filter((c) => placed[c.id] === "not").map((c) => c.id),
 };
 const bankIds = chips.filter((c) => typeof placed[c.id] !== "string").map((c) => c.id);
 const ease = reducedMotion ? 1 : 0.18;
 chips.forEach((c) => {
 let targetX;
 let targetY;
 const zoneKey = typeof placed[c.id] === "string" ? placed[c.id] : null;
 if (zoneKey && byZone[zoneKey]) {
 const z = zones.find((zz) => zz.id === zoneKey);
 const idx = byZone[zoneKey].indexOf(c.id);
 const slot = sortSlotPositions(
 { x: z.x, y: z.y + 18, w: z.ww, h: z.hh - 22 },
 Math.max(byZone[zoneKey].length, 1),
 idx,
 );
 targetX = slot.x;
 targetY = slot.y;
 } else {
 const idx = bankIds.indexOf(c.id);
 targetX = w * 0.14 + (idx % 4) * (w * 0.22);
 targetY = zoneY + zoneH + 36 + Math.floor(idx / 4) * 48;
 }
 const prev = cardPos[c.id];
 if (!prev.x && !prev.y) {
 prev.x = targetX;
 prev.y = targetY;
 }
 if (draggingId !== c.id) {
 prev.x += (targetX - prev.x) * ease;
 prev.y += (targetY - prev.y) * ease;
 }
 ctx.fillStyle = labState.selectedId === c.id ? "rgba(251,146,60,0.4)" : "rgba(67,20,7,0.95)";
 roundRect(ctx, prev.x - 48, prev.y - 16, 96, 32, 8);
 ctx.fill();
 ctx.strokeStyle = "#" + c.color.toString(16).padStart(6, "0");
 ctx.stroke();
 ctx.fillStyle = "#ffedd5";
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.textBaseline = "middle";
 ctx.fillText(c.short, prev.x, prev.y);
 hits.push({
 id: c.id,
 shape: "rect",
 x: prev.x,
 y: prev.y,
 w: 100,
 h: 36,
 meta: { chipId: c.id },
 onDrag(pt) {
 draggingId = c.id;
 prev.x = Math.max(30, Math.min(w - 30, pt.x));
 prev.y = Math.max(30, Math.min(h - 30, pt.y));
 },
 });
 });
 drawLabel(ctx, "Equal · unequal · not a fraction", w * 0.5, layout.labelY);
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("fracLab", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 setDescription("Drag to shade more equal parts of the whole.");
 if (labState.fracParts == null) labState.fracParts = 4;
 if (labState.fracShaded == null) labState.fracShaded = 1;

 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_DRAG" && intent.meta?.action === "stretch") {
 const next = Math.max(0, Math.min(1, (intent.x - api.width * 0.2) / (api.width * 0.6)));
 labState.heat = next;
 const parts = labState.fracParts || 4;
 labState.fracShaded = Math.max(0, Math.min(parts, Math.round(next * parts)));
 }
 if (intent.type === "CANVAS_TAP" && intent.meta?.parts) {
 labState.fracParts = intent.meta.parts;
 labState.fracShaded = Math.min(labState.fracShaded || 1, intent.meta.parts);
 pulseSuccessFeedback(160);
 }
 });

 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const parts = labState.fracParts || 4;
 const shaded = labState.fracShaded ?? 1;
 const heat = labState.heat ?? shaded / parts;
 drawBackdrop();
 drawFractionCircle(ctx, w * 0.38, h * 0.4, 78, parts, shaded);
 drawRotiBar(ctx, w * 0.58, h * 0.36, w * 0.32, parts, shaded);
 const hits = [
 { id: "h", shape: "rect", x: w * 0.2 + heat * w * 0.6, y: h * 0.7, w: 48, h: 48, meta: { action: "stretch" } },
 ];
 [2, 3, 4].forEach((p, i) => {
 const x = w * 0.25 + i * 0.2 * w;
 ctx.fillStyle = parts === p ? "rgba(251,146,60,0.45)" : "#7c2d12";
 roundRect(ctx, x - 28, layout.deskTop - 30, 56, 36, 8);
 ctx.fill();
 ctx.fillStyle = "#ffedd5";
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(`/${p}`, x, layout.deskTop - 10);
 hits.push({ id: "p" + p, shape: "rect", x, y: layout.deskTop - 12, w: 56, h: 36, meta: { parts: p } });
 });
 const hx = w * 0.2 + heat * w * 0.6;
 ctx.fillStyle = "#fb923c";
 ctx.beginPath();
 ctx.arc(hx, h * 0.7, 14, 0, Math.PI * 2);
 ctx.fill();
 drawLabel(ctx, `Shaded ${shaded}/${parts}` + (shaded / parts >= 0.5 ? " · half or more!" : " · drag to shade"), w * 0.5, layout.labelY);
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("fracRule", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Numerator over denominator - equal parts.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const prog = labState.tokenProgress || 0;
 drawBackdrop();
 const tokens = ["Equal", "parts", "→", "fraction"];
 tokens.forEach((label, i) => {
 const x = w * 0.18 + i * (w * 0.18);
 const on = i < prog;
 ctx.fillStyle = on ? "rgba(251,146,60,0.4)" : "rgba(67,20,7,0.9)";
 roundRect(ctx, x - 48, h * 0.36 - 18, 96, 36, 10);
 ctx.fill();
 ctx.fillStyle = on ? "#ffedd5" : "#fdba74";
 ctx.font = "700 12px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(label, x, h * 0.36);
 });
 drawFractionCircle(ctx, w * 0.5, h * 0.58, 55, 3, 1);
 drawLabel(ctx, "Fraction Friends rule", w * 0.5, layout.labelY);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("fracStretch", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const modes = ["roti", "chocolate", "class", "field", "time"];
 setDescription("Same fraction idea in new stories.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.mode) {
 labState.mode = intent.meta.mode;
 pulseSuccessFeedback(200);
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const mode = labState.mode || "roti";
 drawBackdrop();
 const hits = [];
 modes.forEach((m, i) => {
 const x = w * 0.12 + i * (w * 0.17);
 ctx.fillStyle = m === mode ? "rgba(251,146,60,0.4)" : "#7c2d12";
 roundRect(ctx, x - 36, layout.deskTop - 36, 72, 48, 10);
 ctx.fill();
 ctx.fillStyle = "#ffedd5";
 ctx.font = "600 11px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(m, x, layout.deskTop - 10);
 hits.push({ id: m, shape: "rect", x, y: layout.deskTop - 12, w: 72, h: 48, meta: { mode: m } });
 });
 drawFractionCircle(ctx, w * 0.5, h * 0.36, 70, 4, 1);
 const captions = {
 roti: "Share a roti equally - each friend gets a fair piece",
 chocolate: "Break a bar into equal squares before sharing",
 class: "1/4 of the class - equal groups of kids",
 field: "1/2 of the cricket field for practice",
 time: "1/2 hour is half of a clock’s hour turn",
 };
 drawLabel(ctx, captions[mode], w * 0.5, layout.labelY);
 setHitRegions(hits);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("fracMyth", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop, setHitRegions, setIntentHandler } = api;
 const myths = [
 { claim: "Bigger denominator means bigger piece", truth: "More equal parts → each piece is smaller (1/8 < 1/2)" },
 { claim: "Any cut is a fair fraction", truth: "Fractions need equal parts" },
 { claim: "1/2 is always more pizza than 1/3", truth: "True only for the same whole - compare same wholes" },
 { claim: "2/4 is different from 1/2 forever", truth: "2/4 names the same share as 1/2 of the same whole" },
 { claim: "Fractions are only for pizza", truth: "Roti, time, class groups - same fair-share idea" },
 ];
 setDescription("Bust fraction myths.");
 setIntentHandler((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "flip") {
 labState.mythPhase = labState.mythPhase === "truth" ? "claim" : "truth";
 if (labState.mythPhase === "truth") pulseSuccessFeedback(220);
 }
 });
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const idx = labState.myth ?? 0;
 const phase = labState.mythPhase || "claim";
 const m = myths[idx] || myths[0];
 drawBackdrop();
 ctx.fillStyle = phase === "truth" ? "rgba(251,146,60,0.2)" : "rgba(248,113,113,0.18)";
 roundRect(ctx, w * 0.12, h * 0.28, w * 0.76, h * 0.28, 16);
 ctx.fill();
 drawLabel(ctx, phase === "truth" ? m.truth : `Myth: ${m.claim}`, w * 0.5, h * 0.42, {
 h: 42,
 font: "700 13px Segoe UI",
 });
 drawLabel(ctx, `Myth ${idx + 1} / 5 · Tap to flip`, w * 0.5, layout.labelY);
 setHitRegions([
 { id: "card", shape: "rect", x: w * 0.5, y: h * 0.42, w: w * 0.76, h: h * 0.28, meta: { action: "flip" } },
 ]);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => setIntentHandler(null));
 });

 arena.registerScene("fracDrill", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription(labState.prompt || "Fraction drill");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 drawBackdrop();
 drawLabel(ctx, labState.prompt || "Fraction Friends drill", w * 0.5, h * 0.2, {
 h: 32,
 font: "700 16px Segoe UI",
 });
 drawFractionCircle(ctx, w * 0.5, h * 0.5, 70, labState.fracParts || 4, labState.fracShaded || 1);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });

 arena.registerScene("fracMastery", (api) => {
 const { ctx, setTick, setDispose, setDescription, drawBackdrop } = api;
 setDescription("Fraction Friend mastery.");
 setTick(() => {
 const w = api.width;
 const h = api.height;
 const layout = api.layout;
 const locked = labState.masteryStep || 0;
 drawBackdrop();
 ["Meet", "Sort", "Lab", "Rule", "Myth", "Friend"].forEach((label, i) => {
 const x = w * 0.1 + i * (w * 0.14);
 ctx.fillStyle = i < locked ? "#fb923c" : "rgba(148,163,184,0.35)";
 roundRect(ctx, x - 28, h * 0.78 - 12, 56, 24, 8);
 ctx.fill();
 ctx.fillStyle = "#7c2d12";
 ctx.font = "600 10px Segoe UI";
 ctx.textAlign = "center";
 ctx.fillText(label, x, h * 0.78);
 });
 drawFractionCircle(ctx, w * 0.5, h * 0.4, 70, 2, 1);
 drawLabel(ctx, "Fraction Friend!", w * 0.5, layout.labelY);
 failFlash(ctx, w, h);
 successFlash(ctx, w, h);
 });
 setDispose(() => {});
 });
}
