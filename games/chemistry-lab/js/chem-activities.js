/**
 * Chemistry Lab activity mounts - panel + canvas share chemLabState / intents.
 */
import { scaledDwellMs } from "/engine/js/timings.js";
import { clearConceptViz } from "/engine/js/concept-viz.js";
import {
 ATOM_ASSET_PATHS,
 chemLabState,
 setHeatTarget,
 pulseFailFeedback,
 pulseSuccessFeedback,
 ZOOM_LEVEL_LABELS,
 elementForProtons,
} from "./atom-scenes.js?v=bondbuddy1";
import { HUNT_PROTON_SEQ, configString, valenceCount, familyOf, fillingOrbital, sampleSnap } from "./element-scenes.js?v=bondbuddy1";
import { createActivitySession, stopActivitySession, heatPhase } from "./activity-controller.js";

let activeCleanup = null;

export function cancelActiveActivity() {
 if (typeof activeCleanup === "function") {
 try {
 activeCleanup();
 } catch {
 /* ignore */
 }
 }
 activeCleanup = null;
 stopActivitySession();
 const arena = window.__arena;
 // Clear panel intent only - scenes own hit regions + sceneIntent.
 arena?.setIntentHandler?.(null);
}

function trackCleanup(fn) {
 cancelActiveActivity();
 activeCleanup = fn || null;
 return fn;
}

function once(fn) {
 let done = false;
 return (...args) => {
 if (done) return;
 done = true;
 fn(...args);
 };
}

export function playScene(name, opts = {}) {
 const arena = window.__arena;
 Object.assign(chemLabState, opts);
 if (opts.phase) {
 chemLabState.phase = opts.phase;
 if (String(name).startsWith("elem")) chemLabState.elemPhase = opts.phase;
 if (String(name).startsWith("bond")) chemLabState.bondPhase = opts.phase;
 }
 if (opts.heat != null) {
 chemLabState.heatTarget = opts.heat;
 chemLabState.heat = opts.heat;
 }
 if (opts.energy != null) {
 chemLabState.energyTarget = opts.energy;
 chemLabState.energy = opts.energy;
 }
 if (opts.dwellMs != null) chemLabState.animDuration = opts.dwellMs;
 if (opts.placed) chemLabState.placed = { ...opts.placed };
 if (arena?.playExample) arena.playExample(name, opts);
 const hud = document.getElementById("viewport-hud");
 if (hud) clearConceptViz(hud);
}

export function badgeHtml(src, alt) {
 return `<img class="chem-asset" src="${src}" alt="${alt || ""}" width="56" height="56" />`;
}

export function mountMotionChain(host, cfg) {
 let i = 0;
 let cancelIv = null;
 let cancelled = false;
 const session = createActivitySession({ phase: cfg.beats[0]?.sceneArgs?.phase || "zoom" });

 function render() {
 if (cancelled) return;
 if (i >= cfg.beats.length) {
 cfg.onDone();
 return;
 }
 const b = cfg.beats[i];
 const total = cfg.beats.length;
 const minMs =
 b.rawDwellMs != null ? Math.max(0, b.rawDwellMs) : scaledDwellMs(b.dwellMs ?? 3200);
 chemLabState.animDuration = minMs;
 if (b.sceneArgs?.phase) {
 chemLabState.phase = b.sceneArgs.phase;
 chemLabState.elemPhase = b.sceneArgs.phase;
 chemLabState.bondPhase = b.sceneArgs.phase;
 session.dispatch({ type: "SET_PHASE", phase: b.sceneArgs.phase });
 }
 playScene(b.scene, { ...(b.sceneArgs || {}), dwellMs: minMs });
 host.innerHTML = `
 <div class="lab-demo lab-demo--chain chem-card">
 <div class="lab-demo__badge">Act ${i + 1} of ${total}</div>
 <h3 class="lab-chain-title">${cfg.title || "Watch the story unfold"}</h3>
 <div class="lab-demo__body">${b.html}</div>
 <p class="lab-demo__timer" id="chain-msg" aria-live="polite">Watch / interact with the canvas…</p>
 <div class="btn-row">
 <button type="button" class="btn secondary" id="chain-skip" ${i === 0 ? "disabled" : ""}>◀ Prev</button>
 <button type="button" class="btn primary" id="chain-go" disabled>Next ▶</button>
 </div>
 </div>`;
 const t0 = Date.now();
 const msg = host.querySelector("#chain-msg");
 const btn = host.querySelector("#chain-go");
 const prev = host.querySelector("#chain-skip");
 if (prev) {
 prev.onclick = () => {
 if (i > 0) {
 i--;
 if (cancelIv) clearInterval(cancelIv);
 render();
 }
 };
 }
 if (cancelIv) clearInterval(cancelIv);
 cancelIv = setInterval(() => {
 if (cancelled) {
 clearInterval(cancelIv);
 return;
 }
 const left = Math.max(0, Math.ceil((minMs - (Date.now() - t0)) / 1000));
 if (msg) msg.textContent = left > 0 ? `Explore act ${i + 1} (${left}s)…` : "Ready for next act!";
 if (Date.now() - t0 >= minMs && btn) btn.disabled = false;
 }, 250);
 btn.onclick = () => {
 if (btn.disabled) return;
 if (cancelIv) clearInterval(cancelIv);
 i++;
 render();
 };

 const arena = window.__arena;
 arena?.setIntentHandler?.((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "pour") {
 chemLabState.scale = Math.min(1, (chemLabState.scale || 0) + 0.12);
 }
 // Only auto-advance when tapping empty canvas, not props / tools / chips.
 if (intent.type === "CANVAS_TAP" && !btn.disabled) {
 const a = intent.meta?.action;
 const interactive =
 intent.meta?.propId ||
 intent.meta?.chipId ||
 intent.meta?.zoneId ||
 intent.meta?.pick ||
 intent.meta?.mode ||
 a === "pour" ||
 a === "heat" ||
 a === "pack" ||
 a === "link" ||
 a === "gap" ||
 a === "nudge" ||
 a === "merge" ||
 a === "split" ||
 a === "stretch" ||
 a === "snap" ||
 a === "focus" ||
 a === "scale";
 if (!interactive) btn.click();
 }
 });
 }

 render();
 return trackCleanup(() => {
 cancelled = true;
 if (cancelIv) clearInterval(cancelIv);
 session.stop();
 });
}

export function mountDragSort(host, cfg) {
 const finish = once(() => cfg.onDone());
 const chips = cfg.chips;
 const session = createActivitySession({ placed: {}, selectedId: null, placedVersion: 0 });
 chemLabState.placed = {};
 chemLabState.sortPlaced = 0;
 chemLabState.reveal = false;
 chemLabState.selectedId = null;
 chemLabState._placedVersion = 0;
 playScene(cfg.scene, {
 ...(cfg.sceneArgs || {}),
 items: chips.map((c) => ({
 id: c.id,
 label: c.short || c.text.split(" ")[0],
 matter: cfg.zones.find((z) => z.id === "yes")?.accept.includes(c.id),
 color: c.color || 0x38bdf8,
 })),
 itemCount: chips.length,
 });

 const zoneHtml = cfg.zones
 .map(
 (z) => `
 <div class="dz-wrap">
 <span class="dz-label" id="lbl-${z.id}">${z.label}</span>
 <div class="drop-zone drop-zone--multi" data-zone="${z.id}" data-accept="${z.accept.join(",")}"
 tabindex="0" role="listbox" aria-labelledby="lbl-${z.id}"></div>
 <button type="button" class="btn secondary chem-zone-btn" data-zone-btn="${z.id}">Place here</button>
 </div>`,
 )
 .join("");
 const chipsHtml = chips
 .map(
 (c) =>
 `<button type="button" class="chip" draggable="true" data-chip="${c.id}" aria-pressed="false">${c.text}</button>`,
 )
 .join("");
 host.innerHTML = `
 <div class="lab-drag chem-card">
 <h3>${cfg.title}</h3>
 <p class="lab-drag__hint">${cfg.instructions} Drag on the <strong>canvas</strong> or use chips here. Both stay in sync.</p>
 <div class="dz-row">${zoneHtml}</div>
 <div class="chip-bank" id="chip-bank" role="listbox" aria-label="Chips">${chipsHtml}</div>
 <p id="lab-drag-status" class="drag-hint" aria-live="polite">0 of ${chips.length} placed</p>
 <button type="button" class="btn secondary" id="sort-reset">Reset sort</button>
 </div>`;

 const bank = host.querySelector("#chip-bank");
 const status = host.querySelector("#lab-drag-status");
 let selectedId = null;
 let lastSyncKey = "";
 let finished = false;
 let raf = 0;

 function selectChip(id) {
 selectedId = id;
 chemLabState.selectedId = id;
 session.dispatch({ type: "SELECT_CHIP", id });
 host.querySelectorAll(".chip").forEach((c) => {
 const on = c.dataset.chip === id;
 c.classList.toggle("chip--selected", on);
 c.setAttribute("aria-pressed", on ? "true" : "false");
 });
 }

 function syncPlacedUI() {
 const placed = chemLabState.placed || {};
 chips.forEach((c) => {
 const chip = host.querySelector(`.chip[data-chip="${c.id}"]`);
 if (!chip) return;
 const zoneId = placed[c.id];
 if (zoneId && typeof zoneId === "string") {
 const zone = host.querySelector(`[data-zone="${zoneId}"]`);
 if (zone && chip.parentElement !== zone) zone.appendChild(chip);
 } else if (chip.parentElement !== bank) {
 bank.appendChild(chip);
 }
 });
 const n = Object.keys(placed).filter((k) => typeof placed[k] === "string").length;
 chemLabState.sortPlaced = n;
 if (status && !finished) status.textContent = `${n} of ${chips.length} placed`;
 }

 function checkComplete() {
 const placed = chemLabState.placed || {};
 if (Object.keys(placed).length < chips.length) return false;
 return chips.every((c) => {
 const zoneId = placed[c.id];
 const zdef = cfg.zones.find((z) => z.id === zoneId);
 return zdef?.accept.includes(c.id);
 });
 }

 function tryPlace(zoneId, id) {
 if (!id || !zoneId) return;
 const zdef = cfg.zones.find((z) => z.id === zoneId);
 if (!zdef?.accept.includes(id)) {
 status.textContent = "Hmm, that belongs in another bin.";
 pulseFailFeedback(480);
 return;
 }
 // Avoid double-success flash if canvas already placed this chip
 const already = chemLabState.placed?.[id] === zoneId;
 chemLabState.placed = { ...chemLabState.placed, [id]: zoneId };
 chemLabState.sortPlaced = Object.keys(chemLabState.placed).length;
 session.dispatch({ type: "PLACE_CHIP", chipId: id, zoneId, accept: zdef.accept });
 syncPlacedUI();
 if (!already) pulseSuccessFeedback(220);
 status.textContent = `${chemLabState.sortPlaced} of ${chips.length} placed`;
 if (!finished && checkComplete()) {
 finished = true;
 status.textContent = cfg.successText || "Nice sort: all chips placed!";
 chemLabState.reveal = true;
 session.dispatch({ type: "SET_REVEAL", value: true });
 pulseSuccessFeedback(400);
 finish();
 }
 }

 function tickSync() {
 const placed = chemLabState.placed || {};
 const key = `${chemLabState._placedVersion || 0}|${JSON.stringify(placed)}|${chemLabState.selectedId || ""}`;
 if (key !== lastSyncKey) {
 lastSyncKey = key;
 syncPlacedUI();
 host.querySelectorAll(".chip").forEach((c) => {
 const on = c.dataset.chip === chemLabState.selectedId;
 c.classList.toggle("chip--selected", on);
 c.setAttribute("aria-pressed", on ? "true" : "false");
 });
 selectedId = chemLabState.selectedId;
 if (!finished && checkComplete()) {
 finished = true;
 status.textContent = cfg.successText || "Nice sort: all chips placed!";
 chemLabState.reveal = true;
 session.dispatch({ type: "SET_REVEAL", value: true });
 pulseSuccessFeedback(400);
 finish();
 }
 }
 raf = requestAnimationFrame(tickSync);
 }
 raf = requestAnimationFrame(tickSync);

 host.querySelectorAll(".chip").forEach((chip) => {
 chip.addEventListener("dragstart", (e) => {
 e.dataTransfer.setData("text/plain", chip.dataset.chip);
 selectChip(chip.dataset.chip);
 });
 chip.addEventListener("click", () => selectChip(chip.dataset.chip));
 });

 host.querySelectorAll(".drop-zone").forEach((zone) => {
 zone.addEventListener("dragover", (e) => {
 e.preventDefault();
 zone.classList.add("dz-hover");
 });
 zone.addEventListener("dragleave", () => zone.classList.remove("dz-hover"));
 zone.addEventListener("drop", (e) => {
 e.preventDefault();
 zone.classList.remove("dz-hover");
 tryPlace(zone.dataset.zone, e.dataTransfer.getData("text/plain"));
 });
 zone.addEventListener("keydown", (e) => {
 if ((e.key === "Enter" || e.key === " ") && selectedId) {
 e.preventDefault();
 tryPlace(zone.dataset.zone, selectedId);
 }
 });
 });

 host.querySelectorAll("[data-zone-btn]").forEach((btn) => {
 btn.onclick = () => {
 if (selectedId) tryPlace(btn.dataset.zoneBtn, selectedId);
 else status.textContent = "Select a chip first, then place it.";
 };
 });

 host.querySelector("#sort-reset").onclick = () => {
 chemLabState.placed = {};
 chemLabState.sortPlaced = 0;
 chemLabState.reveal = false;
 finished = false;
 session.dispatch({ type: "RESET_SORT" });
 syncPlacedUI();
 status.textContent = "Sort reset.";
 lastSyncKey = "";
 };

 const arena = window.__arena;
 arena?.setIntentHandler?.((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.chipId) {
 selectChip(intent.meta.chipId);
 status.textContent = `Selected ${intent.meta.chipId}. Drop on a bin or Place here.`;
 }
 if (intent.type === "CANVAS_UP" && intent.meta?.chipId) {
 const zoneId = intent.dropMeta?.zoneId;
 if (zoneId) tryPlace(zoneId, intent.meta.chipId);
 else syncPlacedUI();
 }
 if (intent.type === "CANVAS_TAP" && intent.meta?.zoneId && selectedId) {
 tryPlace(intent.meta.zoneId, selectedId);
 }
 });

 return trackCleanup(() => {
 cancelAnimationFrame(raf);
 session.stop();
 arena?.setIntentHandler?.(null);
 });
}

export function mountHeatLab(host, cfg) {
 const finish = once(() => cfg.onDone());
 const startH = cfg.startHeat ?? 0.12;
 const threshold = cfg.threshold ?? 0.78;
 const axis = cfg.axis || "y";
 const canvasAction = cfg.canvasAction || "heat";
 const sliderLabel = cfg.sliderLabel || "Heat energy";
 const session = createActivitySession({ heat: startH, energy: startH });
 chemLabState.heat = startH;
 chemLabState.energy = startH;
 setHeatTarget(startH);
 playScene(cfg.scene, { heat: startH, energy: startH, ...(cfg.sceneArgs || {}) });

 host.innerHTML = `
 <div class="chem-card chem-heat">
 ${badgeHtml(cfg.badge || ATOM_ASSET_PATHS.ice, "heat lab")}
 <h3>${cfg.title}</h3>
 <p>${cfg.html}</p>
 <label class="chem-heat__label" for="chem-heat">${sliderLabel}</label>
 <div class="chem-heat__controls">
 <button type="button" class="btn secondary chem-heat__nudge" id="chem-heat-down" aria-label="Decrease">−</button>
 <input id="chem-heat" class="chem-heat__range" type="range" min="0" max="100" step="1"
 value="${Math.round(startH * 100)}" aria-valuemin="0" aria-valuemax="100"
 aria-valuenow="${Math.round(startH * 100)}" />
 <button type="button" class="btn secondary chem-heat__nudge" id="chem-heat-up" aria-label="Increase">+</button>
 </div>
 <p class="chem-heat__readout" id="chem-heat-read" aria-live="polite">Cold</p>
 <p class="chem-heat__goal">${cfg.goalText}</p>
 <button type="button" class="btn primary" id="chem-heat-go" disabled>${cfg.doneLabel || "Continue ▶"}</button>
 </div>`;

 const range = host.querySelector("#chem-heat");
 const read = host.querySelector("#chem-heat-read");
 const btn = host.querySelector("#chem-heat-go");
 let cancelled = false;
 const mustVisit = cfg.mustVisit || null;
 const visited = new Set();

 function applyHeat(raw) {
 const pct = Math.max(0, Math.min(100, Math.round(Number(raw) || 0)));
 const h = pct / 100;
 range.value = String(pct);
 range.setAttribute("aria-valuenow", String(pct));
 chemLabState.heat = h;
 chemLabState.energy = h;
 setHeatTarget(h);
 if (cfg.syncKey === "wireStretch") chemLabState.wireStretch = h;
 if (cfg.syncKey === "bondSnap") chemLabState.bondSnap = h;
 session.dispatch({ type: "SET_HEAT", value: h });
 const phase = heatPhase(h);
 const labels = cfg.readoutLabels || {
 cold: "Cold: molecules locked / slow",
 melting: "Melting: lattice softening",
 liquid: "Liquid: free to slide",
 simmer: "Hot: vapor escaping",
 };
 visited.add(phase);
 read.textContent = labels[phase] || "Working…";
 if (mustVisit) {
 const ok = mustVisit.every((p) => visited.has(p));
 btn.disabled = !ok;
 if (ok) read.textContent += ": ice, liquid, and steam visited";
 } else if (h >= threshold) {
 btn.disabled = false;
 read.textContent += ". Goal reached";
 } else btn.disabled = true;
 }

 range.addEventListener("input", () => applyHeat(range.value));
 range.addEventListener("change", () => applyHeat(range.value));
 host.querySelector("#chem-heat-down").onclick = () => applyHeat(Number(range.value) - 10);
 host.querySelector("#chem-heat-up").onclick = () => applyHeat(Number(range.value) + 10);
 applyHeat(startH * 100);

 const arena = window.__arena;
 arena?.setIntentHandler?.((intent) => {
 if (intent.type === "CANVAS_DRAG" && intent.meta?.action === canvasAction) {
 if (axis === "x") {
 const aw = arena.width || 640;
 const next = Math.max(0, Math.min(1, (intent.x - aw * 0.2) / (aw * 0.6)));
 applyHeat(next * 100);
 } else {
 const base = intent.meta.dragBaseHeat ?? chemLabState.heat;
 const next = Math.max(0, Math.min(1, base + (-(intent.dy || 0)) * 0.004));
 applyHeat(next * 100);
 }
 }
 if (intent.type === "CANVAS_DOWN" && intent.meta?.action === canvasAction) {
 intent.meta.dragBaseHeat = chemLabState.heat;
 }
 });

 const iv = setInterval(() => {
 if (cancelled) return;
 if (!mustVisit && chemLabState.heat >= threshold) {
 btn.disabled = false;
 applyHeat(chemLabState.heat * 100);
 }
 }, 200);

 btn.onclick = () => {
 cancelled = true;
 clearInterval(iv);
 finish();
 };

 return trackCleanup(() => {
 cancelled = true;
 clearInterval(iv);
 session.stop();
 arena?.setIntentHandler?.(null);
 });
}

export function mountRevealSteps(host, cfg) {
 playScene(cfg.scene, cfg.sceneArgs || {});
 let i = 0;
 let finished = false;
 host.innerHTML = `
 <div class="chem-card">
 <h3>${cfg.title}</h3>
 <ol class="chem-reveal" id="chem-reveal"></ol>
 <button type="button" class="btn primary" id="chem-reveal-btn">Reveal next ▶</button>
 </div>`;
 const list = host.querySelector("#chem-reveal");
 const btn = host.querySelector("#chem-reveal-btn");
 const finish = once(() => cfg.onDone());

 function stepHtml(step) {
 if (step == null) return "";
 if (typeof step === "string") return step;
 if (typeof step === "object") return step.html || step.text || "";
 return String(step);
 }

 btn.onclick = () => {
 if (finished) {
 finish();
 return;
 }
 if (i >= cfg.steps.length) {
 finished = true;
 btn.textContent = "Continue ▶";
 return;
 }
 const li = document.createElement("li");
 li.className = "chem-reveal__item";
 li.innerHTML = stepHtml(cfg.steps[i]);
 list.appendChild(li);
 if (cfg.onStep) cfg.onStep(i);
 i++;
 if (i >= cfg.steps.length) {
 finished = true;
 btn.textContent = "I get it. Continue ▶";
 }
 };
 btn.click();
 return trackCleanup(() => {});
}

export function mountEquationBuild(host, cfg) {
 const finish = once(() => cfg.onDone());
 const session = createActivitySession({ tokenOrder: [] });
 playScene(cfg.scene, cfg.sceneArgs || {});
 chemLabState.tokenProgress = 0;
 const order = [];
 host.innerHTML = `
 <div class="chem-card">
 ${cfg.badge ? badgeHtml(cfg.badge, "rule badge") : ""}
 <h3>${cfg.title}</h3>
 <p>${cfg.instructions}</p>
 <div class="chem-eq-bank" id="eq-bank">
 ${cfg.tokens.map((t) => `<button type="button" class="chip eq-chip" data-id="${t.id}">${t.html}</button>`).join("")}
 </div>
 <div class="chem-eq-rail" id="eq-rail" aria-label="Your sentence"></div>
 <p id="eq-status" class="drag-hint" aria-live="polite"></p>
 <div class="btn-row">
 <button type="button" class="btn secondary" id="eq-undo">Undo</button>
 <button type="button" class="btn secondary" id="eq-reset">Reset</button>
 <button type="button" class="btn primary hidden" id="eq-done">Continue ▶</button>
 </div>
 </div>`;
 const bank = host.querySelector("#eq-bank");
 const rail = host.querySelector("#eq-rail");
 const status = host.querySelector("#eq-status");
 const doneBtn = host.querySelector("#eq-done");
 const correct = cfg.correctIds;

 function refresh() {
 chemLabState.tokenProgress = order.length;
 session.dispatch({ type: "PATCH", patch: { tokenOrder: [...order] } });
 rail.innerHTML = order
 .map((id) => {
 const t = cfg.tokens.find((x) => x.id === id);
 return `<span class="eq-placed">${t?.html || id}</span>`;
 })
 .join(" ");
 bank.querySelectorAll(".eq-chip").forEach((b) => {
 b.disabled = order.includes(b.dataset.id);
 });
 if (order.length === correct.length) {
 const ok = order.every((id, idx) => id === correct[idx]);
 if (ok) {
 status.textContent = "Rule locked in. Continue to the scale scrubber.";
 status.classList.add("ok");
 pulseSuccessFeedback(400);
 doneBtn?.classList.remove("hidden");
 } else {
 status.textContent = "Almost - undo and rebuild the rule in order.";
 doneBtn?.classList.add("hidden");
 pulseFailFeedback(400);
 }
 } else {
 doneBtn?.classList.add("hidden");
 }
 }

 bank.querySelectorAll(".eq-chip").forEach((b) => {
 b.onclick = () => {
 if (order.includes(b.dataset.id)) return;
 order.push(b.dataset.id);
 refresh();
 };
 });
 host.querySelector("#eq-undo").onclick = () => {
 order.pop();
 status.textContent = "";
 refresh();
 };
 host.querySelector("#eq-reset").onclick = () => {
 order.length = 0;
 status.textContent = "";
 refresh();
 };
 doneBtn.onclick = () => finish();
 return trackCleanup(() => session.stop());
}

export function mountScaleLab(host, cfg) {
 const finish = once(() => cfg.onDone());
 chemLabState.scale = cfg.start ?? 0;
 playScene(cfg.scene, { ...(cfg.sceneArgs || {}), scale: chemLabState.scale });
 // Defaults keep Tiny Bits particle-zoom framing; Element Hunt (and others) pass overrides.
 const sliderLabel = cfg.sliderLabel || "Zoom scale: grain → ions → atom model";
 const goalText = cfg.goalText || "Left canvas follows the same order: grain → ions → orbitals.";
 const readouts = cfg.readoutLabels || {
 low: "Everyday salt grain",
 mid: "Crystal of ions (model)",
 high: "Optional simplified atom shells",
 };
 host.innerHTML = `
 <div class="chem-card chem-heat">
 <h3>${cfg.title}</h3>
 <p>${cfg.html}</p>
 <label class="chem-heat__label" for="chem-scale">${sliderLabel}</label>
 <input id="chem-scale" class="chem-heat__range" type="range" min="0" max="100" value="${Math.round((cfg.start || 0) * 100)}" />
 <p class="chem-heat__readout" id="chem-scale-read" aria-live="polite">${readouts.low}</p>
 <p class="chem-heat__goal">${goalText}</p>
 <button type="button" class="btn primary" id="chem-scale-go" disabled>Continue ▶</button>
 </div>`;
 const range = host.querySelector("#chem-scale");
 const read = host.querySelector("#chem-scale-read");
 const btn = host.querySelector("#chem-scale-go");
 function apply(v) {
 const s = Math.max(0, Math.min(1, v / 100));
 chemLabState.scale = s;
 chemLabState.tokenProgress = s < 0.33 ? 0 : s < 0.66 ? 1 : s < 0.9 ? 2 : 3;
 if (s < 0.33) read.textContent = readouts.low;
 else if (s < 0.66) read.textContent = readouts.mid;
 else read.textContent = readouts.high;
 if (s >= (cfg.threshold ?? 0.85)) btn.disabled = false;
 }
 range.oninput = () => apply(Number(range.value));
 apply(Number(range.value));
 btn.onclick = () => finish();
 return trackCleanup(() => {});
}

export function mountQuiz(host, cfg) {
 const finish = once(() => cfg.onDone());
 playScene(cfg.scene, cfg.sceneArgs || {});
 let timer = null;
 host.innerHTML = `
 <div class="chem-card chem-quiz">
 <h3>${cfg.title || "Check"}</h3>
 <p class="chem-quiz__q">${cfg.q}</p>
 <div class="chem-quiz__opts">
 ${cfg.opts
 .map((o, i) => `<button type="button" class="btn secondary chem-opt" data-i="${i}">${o}</button>`)
 .join("")}
 </div>
 <p id="quiz-status" class="drag-hint" aria-live="polite"></p>
 </div>`;
 const status = host.querySelector("#quiz-status");
 host.querySelectorAll(".chem-opt").forEach((btn) => {
 btn.onclick = () => {
 const i = Number(btn.dataset.i);
 if (i === cfg.ok) {
 btn.classList.add("chem-opt--ok");
 status.textContent = cfg.success || "Yes!";
 pulseSuccessFeedback(350);
 host.querySelectorAll(".chem-opt").forEach((b) => (b.disabled = true));
 timer = setTimeout(() => finish(), 650);
 } else {
 btn.classList.add("chem-opt--bad");
 status.textContent = cfg.fail || "Not quite - watch the canvas and try again.";
 pulseFailFeedback(480);
 }
 };
 });
 return trackCleanup(() => {
 if (timer) clearTimeout(timer);
 });
}

export function mountSpeedDrill(host, cfg) {
 let idx = 0;
 let correct = 0;
 const items = cfg.items;
 const passRatio = cfg.passRatio ?? 0.8;
 const finish = once(() => cfg.onDone());

 function render() {
 if (idx >= items.length) {
 const pass = correct / items.length >= passRatio;
 playScene(cfg.passScene || cfg.scene || "atomsMastery");
 host.innerHTML = `
 <div class="chem-card">
 <h3>${pass ? "Drill passed!" : "Almost - review & retry"}</h3>
 <p>You scored <strong>${correct}</strong> of <strong>${items.length}</strong> (${Math.round((correct / items.length) * 100)}%).</p>
 <p>${pass ? cfg.passMessage || "Nice fluency - keep going." : `Need ${Math.round(passRatio * 100)}% to continue.`}</p>
 <div class="btn-row">
 ${pass ? `<button type="button" class="btn primary" id="drill-done">Continue ▶</button>` : ""}
 <button type="button" class="btn secondary" id="drill-retry">Retry drill</button>
 </div>
 </div>`;
 host.querySelector("#drill-done")?.addEventListener("click", () => {
 try { window.__gqPed?.setFluencyScore?.(correct / items.length); } catch (e) {}
 finish();
 });
 host.querySelector("#drill-retry").onclick = () => {
 idx = 0;
 correct = 0;
 render();
 };
 return;
 }
 const it = items[idx];
 chemLabState.prompt = it.prompt || it.q;
 chemLabState.flashColor = 0x38bdf8;
 playScene(cfg.scene || "atomsDrill", { prompt: chemLabState.prompt, flashColor: chemLabState.flashColor });
 host.innerHTML = `
 <div class="chem-card chem-drill">
 <div class="lab-demo__badge">Q ${idx + 1} / ${items.length}</div>
 <p class="chem-drill__q">${it.q}</p>
 <div class="chem-quiz__opts">
 ${it.opts
 .map((o, i) => `<button type="button" class="btn secondary chem-opt" data-i="${i}">${o}</button>`)
 .join("")}
 </div>
 <p id="drill-status" class="drag-hint" aria-live="polite"></p>
 </div>`;
 const status = host.querySelector("#drill-status");
 host.querySelectorAll(".chem-opt").forEach((btn) => {
 btn.onclick = () => {
 const i = Number(btn.dataset.i);
 const isOk = i === it.ok;
 if (isOk) {
 correct++;
 status.textContent = "Correct!";
 pulseSuccessFeedback(280);
 } else {
 status.textContent = "Miss - try again.";
 pulseFailFeedback(320);
 }
 try { window.__gqPed?.recordAnswer?.(isOk); } catch (e) { /* ped optional */ }
 host.querySelectorAll(".chem-opt").forEach((b) => (b.disabled = true));
 setTimeout(() => {
 idx++;
 render();
 }, 450);
 };
 });
 }
 render();
 return trackCleanup(() => {});
}

export function mountOrderSteps(host, cfg) {
 const finish = once(() => cfg.onDone());
 playScene(cfg.scene, cfg.sceneArgs || {});
 chemLabState.masteryStep = 0;
 const shuffled = [...cfg.items].sort(() => Math.random() - 0.5);
 host.innerHTML = `
 <div class="chem-card">
 <h3>${cfg.title}</h3>
 <p>${cfg.instructions}</p>
 <div class="chem-order" id="chem-order">
 ${shuffled.map((it) => `<button type="button" class="chip order-chip" data-id="${it.id}">${it.html}</button>`).join("")}
 </div>
 <div class="chem-eq-rail" id="order-rail" aria-label="Story order"></div>
 <p id="order-status" class="drag-hint" aria-live="polite"></p>
 <button type="button" class="btn secondary" id="order-reset">Reset</button>
 </div>`;
 const picked = [];
 const rail = host.querySelector("#order-rail");
 const status = host.querySelector("#order-status");
 const bank = host.querySelector("#chem-order");

 function refresh() {
 chemLabState.masteryStep = picked.length;
 rail.innerHTML = picked
 .map((id) => {
 const it = cfg.items.find((x) => x.id === id);
 return `<span class="eq-placed">${it?.html || id}</span>`;
 })
 .join(" → ");
 bank.querySelectorAll(".order-chip").forEach((b) => {
 b.disabled = picked.includes(b.dataset.id);
 });
 if (picked.length === cfg.correctIds.length) {
 const ok = picked.every((id, i) => id === cfg.correctIds[i]);
 if (ok) {
 status.textContent = "Sequence locked - mastery path clear!";
 pulseSuccessFeedback(400);
 finish();
 } else {
 status.textContent = "Order is off - reset and try the story sequence again.";
 pulseFailFeedback(400);
 }
 }
 }

 bank.querySelectorAll(".order-chip").forEach((b) => {
 b.onclick = () => {
 picked.push(b.dataset.id);
 refresh();
 };
 });
 host.querySelector("#order-reset").onclick = () => {
 picked.length = 0;
 status.textContent = "";
 refresh();
 };
 return trackCleanup(() => {});
}

export function mountMythCards(host, cfg) {
 let i = 0;
 let cancelled = false;
 const finish = once(() => cfg.onDone());

 function show() {
 if (cancelled) return;
 if (i >= cfg.myths.length) {
 finish();
 return;
 }
 const m = cfg.myths[i];
 chemLabState.myth = m.sceneMyth;
 chemLabState.mythPhase = "claim";
 chemLabState.mythBusted = false;
 chemLabState.bustedAt = 0;
 playScene(cfg.scene || "atomsMyth", { myth: m.sceneMyth });
 host.innerHTML = `
 <div class="chem-card chem-myth">
 ${badgeHtml(ATOM_ASSET_PATHS.myth, "myth bust")}
 <div class="lab-demo__badge">Myth ${i + 1} of ${cfg.myths.length}</div>
 <h3>${m.title || `Myth ${i + 1}`}</h3>
 <p class="chem-myth__claim"><strong>Claim:</strong> ${m.claim}</p>
 <p>What do you think?</p>
 <div class="btn-row">
 <button type="button" class="btn secondary" data-v="myth">Sounds true</button>
 <button type="button" class="btn primary" data-v="bust">Bust it - it's false</button>
 </div>
 <p id="myth-status" class="drag-hint" aria-live="polite"></p>
 <div class="btn-row">
 <button type="button" class="btn primary hidden" id="myth-next">Next myth ▶</button>
 </div>
 </div>`;
 const status = host.querySelector("#myth-status");
 const nextBtn = host.querySelector("#myth-next");
 host.querySelectorAll("[data-v]").forEach((btn) => {
 btn.onclick = () => {
 if (btn.dataset.v === "bust") {
 chemLabState.mythPhase = "truth";
 chemLabState.mythBusted = true;
 chemLabState.bustedAt = performance.now();
 status.innerHTML = `<strong>Correct - you busted the myth.</strong><br/>Truth: ${m.truth}`;
 pulseSuccessFeedback(350);
 host.querySelectorAll("[data-v]").forEach((b) => (b.disabled = true));
 nextBtn.classList.remove("hidden");
 const last = i >= cfg.myths.length - 1;
 nextBtn.textContent = last ? "Continue ▶" : "Next myth ▶";
 nextBtn.onclick = () => {
 if (last) {
 finish();
 requestAnimationFrame(() => {
 document.getElementById("btn-next-dock")?.click();
 });
 return;
 }
 i++;
 show();
 };
 } else {
 chemLabState.mythPhase = "wrong";
 status.innerHTML = `<strong>That claim is a myth.</strong> Hit “Bust it” to see the evidence on the canvas.<br/><em>Hint:</em> ${m.truth}`;
 pulseFailFeedback(480);
 }
 };
 });
 }
 show();
 return trackCleanup(() => {
 cancelled = true;
 });
}

export function mountTapContinue(host, cfg) {
 playScene(cfg.scene, cfg.sceneArgs || {});
 host.innerHTML = `
 <div class="chem-card">
 ${cfg.badge ? badgeHtml(cfg.badge, "lesson badge") : ""}
 <div class="lab-demo__body">${cfg.html}</div>
 <button type="button" class="btn primary" id="tap-go">Continue ▶</button>
 </div>`;
 host.querySelector("#tap-go").onclick = once(() => {
 cfg.onDone();
 if (cfg.advanceAfterDone) {
 requestAnimationFrame(() => {
 document.getElementById("btn-next-dock")?.click();
 });
 }
 });
 return trackCleanup(() => {});
}

export function mountMultiQuiz(host, cfg) {
 let idx = 0;
 let correct = 0;
 const items = cfg.items;
 const finish = once(() => cfg.onDone());

 function render() {
 if (idx >= items.length) {
 host.innerHTML = `
 <div class="chem-card">
 <h3>${cfg.doneTitle || "Checks complete"}</h3>
 <p>Score: <strong>${correct}</strong> / ${items.length}</p>
 <button type="button" class="btn primary" id="mq-done">Continue ▶</button>
 </div>`;
 host.querySelector("#mq-done").onclick = () => finish();
 return;
 }
 const it = items[idx];
 playScene(it.scene || cfg.scene, it.sceneArgs || cfg.sceneArgs || {});
 host.innerHTML = `
 <div class="chem-card chem-quiz">
 <div class="lab-demo__badge">Check ${idx + 1} / ${items.length}</div>
 <h3>${it.title || cfg.title || "Check"}</h3>
 <p class="chem-quiz__q">${it.q}</p>
 <div class="chem-quiz__opts">
 ${it.opts.map((o, i) => `<button type="button" class="btn secondary chem-opt" data-i="${i}">${o}</button>`).join("")}
 </div>
 <p id="quiz-status" class="drag-hint" aria-live="polite"></p>
 </div>`;
 const status = host.querySelector("#quiz-status");
 host.querySelectorAll(".chem-opt").forEach((btn) => {
 btn.onclick = () => {
 const i = Number(btn.dataset.i);
 if (i === it.ok) {
 correct++;
 status.textContent = "Yes!";
 pulseSuccessFeedback(300);
 } else {
 status.textContent = it.fail || "Not quite.";
 pulseFailFeedback(400);
 }
 host.querySelectorAll(".chem-opt").forEach((b) => (b.disabled = true));
 setTimeout(() => {
 idx++;
 render();
 }, 550);
 };
 });
 }
 render();
 return trackCleanup(() => {});
}

function narrationHtml(text) {
 return `<p class="tiny-narration">${text}</p>`;
}

export function mountGate(host, cfg) {
 const finish = once(() => cfg.onDone());
 let cancelled = false;
 let iv = null;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 window.__arena?.setIntentHandler?.(null);
 });
 playScene(cfg.scene, cfg.sceneArgs || {});
 host.innerHTML = `
 <div class="chem-card tiny-card">
 ${cfg.badge ? `<div class="lab-demo__badge">${cfg.badge}</div>` : ""}
 ${cfg.title ? `<h3>${cfg.title}</h3>` : ""}
 ${cfg.html || ""}
 ${cfg.controlsHtml || ""}
 <p id="tiny-gate-status" class="drag-hint" aria-live="polite">${cfg.status || ""}</p>
 <button type="button" class="btn primary ${cfg.pulse ? "tiny-pulse" : ""}" id="tiny-gate-go" ${cfg.ready ? "disabled" : ""}>${cfg.doneLabel || "Continue ▶"}</button>
 </div>`;
 const btn = host.querySelector("#tiny-gate-go");
 const status = host.querySelector("#tiny-gate-status");
 iv = cfg.ready
 ? setInterval(() => {
 if (cancelled) return;
 if (cfg.ready()) {
 btn.disabled = false;
 if (cfg.readyText && status) status.textContent = cfg.readyText;
 }
 }, 120)
 : null;
 if (cfg.bind) cfg.bind(host, { finish, button: btn, status, playScene });
 btn.onclick = () => {
 if (btn.disabled) return;
 finish();
 };
}

export function mountZoomTool(host, cfg) {
 const finish = once(() => cfg.onDone());
 chemLabState.zoomClick = 0;
 playScene("tinyZoom");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 1: Enactive</div>
 <h3>The Infinite Zoom Tool</h3>
 ${narrationHtml("Each click or drag-tick zooms 10× further into the water.")}
 <p class="tiny-onscreen">Use <strong>+</strong> on the canvas or here. Watch the corner counter grow.</p>
 <div class="tiny-zoom-row">
 <button type="button" class="btn secondary" id="tiny-zoom-minus" aria-label="Zoom out">−</button>
 <input id="tiny-zoom" class="chem-heat__range" type="range" min="0" max="5" step="1" value="0" />
 <button type="button" class="btn primary tiny-pulse" id="tiny-zoom-plus" aria-label="Zoom in">+</button>
 </div>
 <p class="tiny-zoom-read" id="tiny-zoom-read" aria-live="polite">Zoom ${ZOOM_LEVEL_LABELS[0]}</p>
 <p id="tiny-zoom-cap" class="tiny-narration" hidden></p>
 <button type="button" class="btn primary" id="tiny-zoom-go" disabled>Continue ▶</button>
 </div>`;
 const range = host.querySelector("#tiny-zoom");
 const read = host.querySelector("#tiny-zoom-read");
 const cap = host.querySelector("#tiny-zoom-cap");
 const go = host.querySelector("#tiny-zoom-go");

 function setZoom(n) {
 const prev = chemLabState.zoomClick || 0;
 const next = Math.max(0, Math.min(5, Math.round(n)));
 if (prev < 4 && next >= 4) chemLabState.zoomFlashUntil = performance.now() + 1800;
 chemLabState.zoomClick = next;
 range.value = String(next);
 read.textContent = `Zoom ${ZOOM_LEVEL_LABELS[next]}`;
 if (next >= 5) {
 cap.hidden = false;
 cap.textContent =
 "You just did something no human eye can ever actually do: you zoomed in past the point where water stops looking smooth and starts looking like… this. Countless tiny dots, packed together, constantly jiggling. You didn’t just learn this. You found it, by zooming in yourself.";
 go.disabled = false;
 pulseSuccessFeedback(320);
 }
 }

 host.querySelector("#tiny-zoom-plus").onclick = () => setZoom((chemLabState.zoomClick || 0) + 1);
 host.querySelector("#tiny-zoom-minus").onclick = () => setZoom((chemLabState.zoomClick || 0) - 1);
 range.oninput = () => setZoom(Number(range.value));
 go.onclick = () => finish();

 const arena = window.__arena;
 arena?.setIntentHandler?.((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "zoom") {
 setZoom((chemLabState.zoomClick || 0) + 1);
 }
 });
 return trackCleanup(() => arena?.setIntentHandler?.(null));
}

export function mountTrueFalse(host, cfg) {
 const finish = once(() => cfg.onDone());
 playScene(cfg.scene, cfg.sceneArgs || {});
 host.innerHTML = `
 <div class="chem-card tiny-card chem-quiz">
 <div class="lab-demo__badge">${cfg.badge || "Quick check"}</div>
 <h3>${cfg.title || "True or false"}</h3>
 <p class="chem-quiz__q">${cfg.q}</p>
 <div class="btn-row tiny-tf">
 <button type="button" class="btn secondary" data-tf="true">True</button>
 <button type="button" class="btn secondary" data-tf="false">False</button>
 </div>
 <p id="tf-status" class="drag-hint" aria-live="polite"></p>
 <button type="button" class="btn primary hidden" id="tf-go">Continue ▶</button>
 </div>`;
 const status = host.querySelector("#tf-status");
 const go = host.querySelector("#tf-go");
 host.querySelectorAll("[data-tf]").forEach((btn) => {
 btn.onclick = () => {
 const saidTrue = btn.dataset.tf === "true";
 const ok = saidTrue === !!cfg.answerIsTrue;
 host.querySelectorAll("[data-tf]").forEach((b) => {
 b.disabled = true;
 });
 if (ok) {
 btn.classList.add("chem-opt--ok");
 pulseSuccessFeedback(350);
 } else {
 btn.classList.add("chem-opt--bad");
 pulseFailFeedback(400);
 }
 status.textContent = cfg.explain;
 go.classList.remove("hidden");
 };
 });
 go.onclick = () => finish();
 return trackCleanup(() => {});
}

export function mountGhostBuild(host, cfg) {
 const finish = once(() => cfg.onDone());
 chemLabState.build = { o: false, hL: false, hR: false, snapped: false };
 playScene("tinyBuild");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 2: Enactive</div>
 <h3>Build a water unit</h3>
 ${narrationHtml("Drag the two blue bits and one red bit into the bent ghost outline.")}
 <p id="build-status" class="drag-hint" aria-live="polite">Drop each bit onto its matching outline.</p>
 <button type="button" class="btn primary" id="build-go" disabled>Continue ▶</button>
 </div>`;
 const status = host.querySelector("#build-status");
 const go = host.querySelector("#build-go");
 go.onclick = () => finish();

 function snapIfClose(id, x, y) {
 const arena = window.__arena;
 const w = arena?.width || 640;
 const h = arena?.height || 360;
 const ox = w * 0.58;
 const oy = h * 0.46;
 const slots = {
 o: { x: ox, y: oy, r: 30 },
 hL: { x: ox - 38, y: oy + 28, r: 24 },
 hR: { x: ox + 38, y: oy + 28, r: 24 },
 };
 const b = chemLabState.build;
 function near(slot) {
 return Math.hypot(x - slot.x, y - slot.y) < slot.r;
 }
 if (id === "o" && near(slots.o)) b.o = true;
 else if (id === "hL" || id === "hR") {
 if (!b.hL && near(slots.hL)) b.hL = true;
 else if (!b.hR && near(slots.hR)) b.hR = true;
 else if (!b.hL && near(slots.hR)) b.hL = true;
 else if (!b.hR && near(slots.hL)) b.hR = true;
 }
 if (b.o && b.hL && b.hR && !b.snapped) {
 b.snapped = true;
 pulseSuccessFeedback(420);
 status.textContent =
 "Look what just happened: you took three separate tiny bits and joined them into one connected unit. That’s not an accident; that’s exactly what’s happening inside every drop of water you’ve ever touched.";
 go.disabled = false;
 }
 chemLabState.build = { ...b };
 }

 const arena = window.__arena;
 arena?.setIntentHandler?.((intent) => {
 if (intent.type === "CANVAS_UP" && intent.meta?.piece) {
 snapIfClose(intent.meta.piece, intent.x, intent.y);
 }
 });
 void cfg;
 return trackCleanup(() => arena?.setIntentHandler?.(null));
}

export function mountFormulaReveal(host, cfg) {
 const finish = once(() => cfg.onDone());
 chemLabState.formulaStep = 0;
 playScene("tinyFormula");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 2: Symbolic</div>
 <h3>Names for what you built</h3>
 ${narrationHtml(
 "Chemists have names and one- or two-letter symbols for every type of atom: hydrogen is ‘H,’ oxygen is ‘O.’ And when atoms join together like you just did, the joined group has its own name too: a molecule. The little number after a letter (that ‘2’ in H₂O) just tells you how many of that atom are in the group. You already built one. This is just the label for what you built.",
 )}
 <p id="formula-status" class="tiny-onscreen">blue ball → Hydrogen (H). red ball → Oxygen (O). joined = H₂O, a molecule</p>
 <button type="button" class="btn primary" id="formula-go">Show O₂</button>
 </div>`;
 const btn = host.querySelector("#formula-go");
 const status = host.querySelector("#formula-status");
 btn.onclick = () => {
 const step = chemLabState.formulaStep || 0;
 if (step === 0) {
 chemLabState.formulaStep = 1;
 playScene("tinyFormula");
 status.textContent = "O₂: the oxygen pair you saw in the gallery.";
 btn.textContent = "Show CO₂";
 pulseSuccessFeedback(280);
 } else if (step === 1) {
 chemLabState.formulaStep = 2;
 playScene("tinyFormula");
 status.textContent = "CO₂: grey + two reds, a straight line.";
 btn.textContent = "Continue ▶";
 pulseSuccessFeedback(280);
 } else {
 finish();
 }
 };
 void cfg;
 return trackCleanup(() => {});
}

export function mountAtomBuilder(host, cfg) {
 const finish = once(() => cfg.onDone());
 chemLabState.protons = 0;
 chemLabState.neutrons = 0;
 chemLabState.electrons = 0;
 chemLabState.builderChallenge = 1;
 playScene("tinyBuilder");
 const prompts = [
 "",
 "Add 1 proton and 1 electron. What did you just build?",
 "Now add 1 more proton, 2 neutrons, and 1 more electron. What is it now?",
 "Try 6 protons, 6 neutrons, 6 electrons.",
 "Free play: add or remove pieces and watch the name change (Oxygen is 8 protons, Nitrogen is 7).",
 ];
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 3: Enactive</div>
 <h3>Atom Builder</h3>
 ${narrationHtml("Remember, atoms were named ‘that which cannot be cut’? Turns out that name is a little wrong. Let’s crack one open and see what’s really inside.")}
 <p class="tiny-builder-read" id="ab-read" aria-live="polite"></p>
 <p id="ab-prompt" class="tiny-onscreen">${prompts[1]}</p>
 <p id="ab-note" class="drag-hint"></p>
 <div class="btn-row">
 <button type="button" class="btn secondary" id="ab-reset">Clear pieces</button>
 <button type="button" class="btn primary" id="ab-go" disabled>Continue ▶</button>
 </div>
 </div>`;
 const read = host.querySelector("#ab-read");
 const prompt = host.querySelector("#ab-prompt");
 const note = host.querySelector("#ab-note");
 const go = host.querySelector("#ab-go");
 let cancelled = false;
 let toldCarbon = false;

 function refresh() {
 const p = chemLabState.protons || 0;
 const n = chemLabState.neutrons || 0;
 const e = chemLabState.electrons || 0;
 const el = elementForProtons(p);
 read.textContent = `Protons: ${p} | Element: ${el.name} | This is now: ${p ? el.name : "?"}`;
 let ch = chemLabState.builderChallenge || 1;
 if (ch === 1 && p === 1 && e === 1) {
 chemLabState.builderChallenge = 2;
 prompt.textContent = prompts[2];
 note.textContent = "You built Hydrogen.";
 pulseSuccessFeedback(280);
 } else if (ch <= 2 && p === 2 && n === 2 && e === 2) {
 chemLabState.builderChallenge = 3;
 prompt.textContent = prompts[3];
 note.textContent = "You built Helium.";
 pulseSuccessFeedback(280);
 } else if (ch <= 3 && p === 6 && n === 6 && e === 6) {
 chemLabState.builderChallenge = 4;
 prompt.textContent = prompts[4];
 if (!toldCarbon) {
 toldCarbon = true;
 note.textContent =
 "Carbon: this is the atom in your pencil, and in you. Notice what’s actually deciding which element you’re building: it’s not the neutrons, and it’s not the electrons. It’s the number of protons. That one number is what makes carbon carbon and not something else.";
 }
 go.disabled = false;
 pulseSuccessFeedback(320);
 }
 }

 host.querySelector("#ab-reset").onclick = () => {
 chemLabState.protons = 0;
 chemLabState.neutrons = 0;
 chemLabState.electrons = 0;
 note.textContent = "Pieces cleared. Try the prompt again.";
 };
 go.onclick = () => finish();
 const iv = setInterval(() => {
 if (!cancelled) refresh();
 }, 200);
 refresh();
 void cfg;
 return trackCleanup(() => {
 cancelled = true;
 clearInterval(iv);
 });
}

export function mountSparkLab(host, cfg) {
 const finish = once(() => cfg.onDone());
 chemLabState.sparkAt = 0;
 chemLabState.sparkDone = false;
 playScene("tinyReact");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 4: Enactive</div>
 <h3>Reaction Lab</h3>
 ${narrationHtml("Two hydrogen pairs and one oxygen pair sit ready. Click Spark.")}
 <button type="button" class="btn primary tiny-pulse" id="tiny-spark">Spark ⚡</button>
 <p id="spark-status" class="tiny-onscreen" aria-live="polite"></p>
 <button type="button" class="btn primary" id="spark-go" disabled>Continue ▶</button>
 </div>`;
 const spark = host.querySelector("#tiny-spark");
 const status = host.querySelector("#spark-status");
 const go = host.querySelector("#spark-go");
 spark.onclick = () => {
 chemLabState.sparkAt = performance.now();
 chemLabState.sparkDone = false;
 spark.disabled = true;
 status.textContent = "Bonds breaking… atoms swirling…";
 };
 const iv = setInterval(() => {
 if (chemLabState.sparkDone) {
 status.textContent = "Nothing was created. Nothing was destroyed. The same atoms, just rearranged and rejoined.";
 go.disabled = false;
 }
 }, 120);
 go.onclick = () => finish();
 void cfg;
 return trackCleanup(() => clearInterval(iv));
}

export function mountSpiralMap(host, cfg) {
 const finish = once(() => cfg.onDone());
 const arena = window.__arena;
 let cancelled = false;
 let iv = null;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 arena?.setIntentHandler?.(null);
 });
 chemLabState.spiralStop = 0;
 chemLabState.spiralUntil = 0;
 chemLabState.spiralFinish = false;
 playScene(cfg.scene || "tinySpiral");
 const stops = cfg.stops || [
 { n: 1, label: "1: Tiny bits" },
 { n: 2, label: "2: Many kinds" },
 { n: 3, label: "3: Inside" },
 { n: 4, label: "4: At work" },
 ];
 const finishLabel = cfg.finishLabel || "Finish Tiny Bits ▶";
 const statusIdle = cfg.statusIdle || "Tap a number to replay, or finish now.";
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">${cfg.badge || "Closing"}</div>
 <h3>${cfg.title || "Your spiral map"}</h3>
 ${narrationHtml(
 cfg.narration ||
 "This last screen is a recap, not a new puzzle. The four numbers are the four loops you already finished. Tap a number (on the canvas or here) to replay a short highlight. When you are ready, tap Finish Tiny Bits.",
 )}
 <div class="tiny-spiral-stops">
 ${stops.map((s) => `<button type="button" class="btn secondary" data-stop="${s.n}">${s.label}</button>`).join("")}
 </div>
 <p id="spiral-status" class="drag-hint">${statusIdle}</p>
 <button type="button" class="btn primary tiny-pulse" id="spiral-go">${finishLabel}</button>
 </div>`;
 function playStop(n) {
 if (cancelled) return;
 chemLabState.spiralStop = n;
 chemLabState.spiralUntil = performance.now() + 4500;
 const status = host.querySelector("#spiral-status");
 if (status) status.textContent = `Replaying spiral ${n}. Tap another number, or ${finishLabel.replace(" ▶", "")}.`;
 }
 host.querySelectorAll("[data-stop]").forEach((btn) => {
 btn.onclick = () => playStop(Number(btn.dataset.stop));
 });
 host.querySelector("#spiral-go").onclick = () => finish();
 arena?.setIntentHandler?.((intent) => {
 if (intent.type !== "CANVAS_TAP") return;
 if (intent.meta?.action === "spiral") playStop(intent.meta.stop);
 if (intent.meta?.action === "spiralFinish") finish();
 });
 iv = setInterval(() => {
 if (!cancelled && chemLabState.spiralFinish) finish();
 }, 80);
}

export function mountTempPreview(host, cfg) {
 const finish = once(() => cfg.onDone());
 chemLabState.panelTemp = 0.45;
 playScene(cfg.scene || "tinyStates");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">${cfg.badge || "Spiral 1: Iconic"}</div>
 <h3>${cfg.title || "Same bits, three dances"}</h3>
 ${cfg.html || ""}
 <label class="chem-heat__label" for="tiny-temp">Temperature under the water panel (optional)</label>
 <input id="tiny-temp" class="chem-heat__range" type="range" min="0" max="100" value="45" />
 <p class="chem-heat__readout" id="tiny-temp-read">Close &amp; sliding</p>
 <button type="button" class="btn primary" id="tiny-temp-go">${cfg.doneLabel || "Continue ▶"}</button>
 </div>`;
 const range = host.querySelector("#tiny-temp");
 const read = host.querySelector("#tiny-temp-read");
 range.oninput = () => {
 const v = Number(range.value) / 100;
 chemLabState.panelTemp = v;
 read.textContent = v < 0.28 ? "Packed & still" : v > 0.78 ? "Far apart & fast" : "Close & sliding";
 };
 host.querySelector("#tiny-temp-go").onclick = () => finish();
 return trackCleanup(() => {});
}

const HUNT_SEQ_NAME = {
 1: "Hydrogen (H)",
 2: "Helium (He)",
 6: "Carbon (C)",
 8: "Oxygen (O)",
 10: "Neon (Ne)",
 11: "Sodium (Na)",
 17: "Chlorine (Cl)",
 18: "Argon (Ar)",
};

export function mountHuntProtonCounter(host, cfg) {
 const finish = once(() => cfg.onDone());
 const arena = window.__arena;
 let cancelled = false;
 let reached = 0;
 let iv = null;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 arena?.setIntentHandler?.(null);
 });
 chemLabState.builderMode = "hunt";
 chemLabState.protons = 0;
 chemLabState.electrons = 0;
 chemLabState.neutrons = 0;
 playScene("tinyBuilder");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 1: Enactive</div>
 <h3>Proton Counter</h3>
 ${narrationHtml("Drag protons one at a time into the nucleus. Electrons match automatically. The only thing that decides an element's identity is its number of protons.")}
 <p class="tiny-builder-read" id="hunt-p-read" aria-live="polite"></p>
 <p id="hunt-p-prompt" class="tiny-onscreen">Try 1.</p>
 <p id="hunt-p-note" class="drag-hint"></p>
 <div class="btn-row">
 <button type="button" class="btn secondary" id="hunt-p-reset">Clear protons</button>
 <button type="button" class="btn primary" id="hunt-p-go" disabled>Continue ▶</button>
 </div>
 </div>`;
 const read = host.querySelector("#hunt-p-read");
 const prompt = host.querySelector("#hunt-p-prompt");
 const note = host.querySelector("#hunt-p-note");
 const go = host.querySelector("#hunt-p-go");
 function refresh() {
 const p = chemLabState.protons || 0;
 const el = elementForProtons(p);
 read.textContent = `Protons: ${p} → Element: ${p ? el.name : "?"} (${p ? el.symbol : "?"})`;
 while (reached < HUNT_PROTON_SEQ.length && p >= HUNT_PROTON_SEQ[reached]) {
 const z = HUNT_PROTON_SEQ[reached];
 note.textContent = `That's ${HUNT_SEQ_NAME[z]}.`;
 pulseSuccessFeedback(220);
 reached += 1;
 }
 const next = HUNT_PROTON_SEQ[reached];
 if (next) prompt.textContent = `Now try ${next}.`;
 else {
 prompt.textContent = "You never needed a neutron count to change the element.";
 note.textContent =
 "Change the proton count by even one, and you have a completely different element, with completely different properties.";
 go.disabled = false;
 }
 }
 host.querySelector("#hunt-p-reset").onclick = () => {
 chemLabState.protons = 0;
 chemLabState.electrons = 0;
 reached = 0;
 go.disabled = true;
 prompt.textContent = "Try 1.";
 note.textContent = "Pieces cleared. Try the prompt again.";
 };
 go.onclick = () => finish();
 iv = setInterval(() => {
 if (!cancelled) refresh();
 }, 180);
 refresh();
}

export function mountFamilyExplorer(host, cfg) {
 const finish = once(() => cfg.onDone());
 const arena = window.__arena;
 let cancelled = false;
 const seen = { alkali: false, noble: false, halogen: false, transition: false };
 trackCleanup(() => {
 cancelled = true;
 arena?.setIntentHandler?.(null);
 });
 chemLabState.huntFamily = "";
 playScene("elemFamilies");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 1: Iconic</div>
 <h3>Family Explorer</h3>
 ${narrationHtml("The periodic table isn’t just a chart for memorizing. It’s a map. Elements in the same column tend to behave alike, because they arrange their electrons in strikingly similar patterns. Rows tell you something too: each new row means the atom just gained a whole new layer of space for electrons to live in.")}
 <p id="hunt-fam-status" class="tiny-onscreen">Tap a colored family on the canvas: Alkali Metals, Noble Gases, Halogens, Transition Metals.</p>
 <button type="button" class="btn primary" id="hunt-fam-go" disabled>Continue ▶</button>
 </div>`;
 const status = host.querySelector("#hunt-fam-status");
 const go = host.querySelector("#hunt-fam-go");
 function check() {
 const n = Object.values(seen).filter(Boolean).length;
 status.textContent =
 n >= 4
 ? "You’ve met the four named families. Continue when you’re ready."
 : `Families visited: ${n} / 4. Tap the violet, teal, orange, and blue-grey blocks.`;
 go.disabled = n < 4;
 }
 arena?.setIntentHandler?.((intent) => {
 if (cancelled || intent.type !== "CANVAS_TAP" || intent.meta?.action !== "tile") return;
 const fam = intent.meta.family || familyOf(intent.meta.z);
 chemLabState.huntFamily = fam;
 if (seen[fam] === false) {
 seen[fam] = true;
 pulseSuccessFeedback(220);
 }
 check();
 });
 go.onclick = () => finish();
 check();
}

export function mountShellFill(host, cfg) {
 const finish = once(() => cfg.onDone());
 let cancelled = false;
 let iv = null;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 });
 chemLabState.huntShells = [0, 0, 0];
 chemLabState.huntBounce = null;
 playScene("elemShells");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 2: Enactive</div>
 <h3>Fill the Shells</h3>
 ${narrationHtml("This is the orbit model: electrons pictured as tiny planets circling a sun. It’s simple, and it correctly predicts how many electrons fit in each layer. Drag 11 electrons onto Sodium’s rings. If a ring is full, the extra electron bounces off. Fill 2, then 8, then 1.")}
 <p id="hunt-sh-read" class="tiny-builder-read">Shell 1: 0/2. Shell 2: 0/8. Shell 3: 0/8 (for now).</p>
 <p id="hunt-sh-note" class="drag-hint"></p>
 <div class="btn-row">
 <button type="button" class="btn secondary" id="hunt-sh-reset">Clear electrons</button>
 <button type="button" class="btn primary" id="hunt-sh-go" disabled>Continue ▶</button>
 </div>
 </div>`;
 const read = host.querySelector("#hunt-sh-read");
 const note = host.querySelector("#hunt-sh-note");
 const go = host.querySelector("#hunt-sh-go");
 let told = false;
 iv = setInterval(() => {
 if (cancelled) return;
 const s = chemLabState.huntShells || [0, 0, 0];
 read.textContent = `Shell 1: ${s[0]}/2 max. Shell 2: ${s[1]}/8 max. Shell 3: ${s[2]}/8 max (for now).`;
 if (s[0] === 2 && s[1] === 8 && s[2] === 1) {
 go.disabled = false;
 if (!told) {
 told = true;
 note.textContent =
 "Locked: 2, 8, 1. Useful for counting. But real electrons don’t travel in neat circular paths. Next we find out what they actually do.";
 pulseSuccessFeedback(280);
 }
 }
 }, 160);
 host.querySelector("#hunt-sh-reset").onclick = () => {
 chemLabState.huntShells = [0, 0, 0];
 told = false;
 go.disabled = true;
 note.textContent = "Rings cleared. Fill 2, then 8, then 1.";
 };
 go.onclick = () => finish();
}

export function mountSnapshots(host, cfg) {
 const finish = once(() => cfg.onDone());
 const arena = window.__arena;
 let cancelled = false;
 let stage = "smear";
 trackCleanup(() => {
 cancelled = true;
 clearInterval(iv);
 arena?.setIntentHandler?.(null);
 });
 chemLabState.huntSnaps = [];
 chemLabState.huntSmear = 0;
 playScene("elemCloud", { phase: "ring" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 2: Iconic</div>
 <h3>Probability Reveal</h3>
 <div id="hunt-snap-body"></div>
 <button type="button" class="btn primary" id="hunt-snap-go" disabled>Continue ▶</button>
 </div>`;
 const body = host.querySelector("#hunt-snap-body");
 const go = host.querySelector("#hunt-snap-go");
 function render() {
 if (stage === "smear") {
 body.innerHTML = narrationHtml(
 "Watch the neat orbiting rings smear. Real electrons don’t travel in neat circular paths. The fuzzy cloud is probability: denser near the nucleus, fading out, with no fixed path.",
 );
 go.disabled = true;
 go.textContent = "Continue ▶";
 } else if (stage === "snaps") {
 body.innerHTML = `${narrationHtml(
 "That fuzzy cloud is called an orbital, not to be confused with orbit. An orbit is a path. An orbital is a region of space where an electron is likely to be found. Tap Take snapshot on the canvas (about 30 times) until the dots rebuild the cloud.",
 )}<p id="hunt-snap-count" class="tiny-onscreen">Snapshots: 0</p>
 <button type="button" class="btn secondary" id="hunt-snap-tap">Take snapshot</button>`;
 host.querySelector("#hunt-snap-tap").onclick = () => {
 if ((chemLabState.huntSnaps || []).length >= 40) return;
 chemLabState.huntSnaps = (chemLabState.huntSnaps || []).concat([sampleSnap()]);
 };
 go.disabled = true;
 } else {
 body.innerHTML = `${narrationHtml(
 "Keep these two words straight. Chemists use both, for different reasons: orbit as an easy mental picture for counting electrons, and orbital for what’s actually, physically true. From here on, we’re only talking about real orbitals.",
 )}<p class="tiny-onscreen">Orbit: an imagined fixed circular path (useful for counting, not physically real).</p>
 <p class="tiny-onscreen">Orbital: a real, probability-based region of space where an electron is most likely to be found.</p>`;
 go.disabled = false;
 go.textContent = "Continue ▶";
 }
 }
 render();
 go.onclick = () => {
 if (stage === "snaps") {
 stage = "words";
 chemLabState.phase = "words";
 render();
 return;
 }
 if (stage === "words") finish();
 };
 const iv = setInterval(() => {
 if (cancelled) return;
 if (stage === "smear" && (chemLabState.huntSmear || 0) >= 1) {
 stage = "snaps";
 chemLabState.phase = "snaps";
 render();
 }
 if (stage === "snaps") {
 const n = (chemLabState.huntSnaps || []).length;
 const count = host.querySelector("#hunt-snap-count");
 if (count) count.textContent = `Snapshots: ${n}`;
 if (n >= 30) go.disabled = false;
 }
 }, 120);
}

export function mountOrbitalGallery(host, cfg) {
 const finish = once(() => cfg.onDone());
 let cancelled = false;
 const seen = { s: false, p: false, d: false };
 const dwell = { s: 0, p: 0, d: 0 };
 trackCleanup(() => {
 cancelled = true;
 clearInterval(iv);
 });
 chemLabState.huntOrbital = "s";
 chemLabState.huntRotX = 0.35;
 chemLabState.huntRotY = 0.4;
 chemLabState.huntPLobes = [true, false, false];
 chemLabState.huntDIndex = 0;
 chemLabState.huntSpun = { s: false, p: false, d: false };
 chemLabState.huntAutoRotate = true;
 playScene("elemOrbitals");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 3: Enactive</div>
 <h3>Orbital Shape Gallery</h3>
 ${narrationHtml("s is a sphere (a circle from every angle). p is a dumbbell: two round lobes pinched at the nucleus, and they come as a set of three along x, y, and z. d is a four-leaf clover (five orientations; one of them is a dumbbell with a ring). f is optional. Drag to spin, or leave auto-rotate on.")}
 <div class="btn-row hunt-orb-row">
 <button type="button" class="btn secondary" data-orb="s">s sphere</button>
 <button type="button" class="btn secondary" data-orb="p">p dumbbell</button>
 <button type="button" class="btn secondary" data-orb="d">d clover</button>
 <button type="button" class="btn secondary" data-orb="f">f (optional)</button>
 </div>
 <label class="hunt-check"><input type="checkbox" id="hunt-auto" checked /> Auto-rotate</label>
 <div id="hunt-orb-extra"></div>
 <p id="hunt-orb-note" class="drag-hint">Spin (or auto-rotate) s, p, and d.</p>
 <button type="button" class="btn primary" id="hunt-orb-go" disabled>Continue ▶</button>
 </div>`;
 const extra = host.querySelector("#hunt-orb-extra");
 const note = host.querySelector("#hunt-orb-note");
 const go = host.querySelector("#hunt-orb-go");
 function extras() {
 const k = chemLabState.huntOrbital;
 if (k === "p") {
 extra.innerHTML = `<p class="tiny-onscreen">A dumbbell along x is on. Toggle y and z to add the other two directions.</p>
 <div class="btn-row">${[0, 1, 2]
 .map(
 (i) =>
 `<label class="hunt-check"><input type="checkbox" data-lobe="${i}" ${chemLabState.huntPLobes[i] ? "checked" : ""} /> ${["x", "y", "z"][i]}</label>`,
 )
 .join("")}</div>`;
 extra.querySelectorAll("[data-lobe]").forEach((box) => {
 box.onchange = () => {
 const lobes = chemLabState.huntPLobes.slice();
 lobes[Number(box.dataset.lobe)] = box.checked;
 chemLabState.huntPLobes = lobes;
 };
 });
 } else if (k === "d") {
 extra.innerHTML = `<p class="tiny-onscreen">Four of the five d shapes are clovers. One is a dumbbell with a ring. Cycle to see each.</p>
 <button type="button" class="btn secondary" id="hunt-d-next">Next d shape (${(chemLabState.huntDIndex || 0) + 1} / 5)</button>`;
 extra.querySelector("#hunt-d-next").onclick = () => {
 chemLabState.huntDIndex = ((chemLabState.huntDIndex || 0) + 1) % 5;
 extras();
 };
 } else if (k === "f") {
 extra.innerHTML = `<p class="tiny-onscreen">Seven in a set. Notice the escalating complexity. You don’t need to memorize all seven.</p>`;
 } else {
 extra.innerHTML = `<p class="tiny-onscreen">A sphere. Spin it: it stays a circle from every angle.</p>`;
 }
 }
 host.querySelectorAll("[data-orb]").forEach((btn) => {
 btn.onclick = () => {
 chemLabState.huntOrbital = btn.dataset.orb;
 if (seen[btn.dataset.orb] === false) seen[btn.dataset.orb] = true;
 extras();
 };
 });
 host.querySelector("#hunt-auto").onchange = (ev) => {
 chemLabState.huntAutoRotate = !!ev.target.checked;
 };
 go.onclick = () => finish();
 extras();
 const iv = setInterval(() => {
 if (cancelled) return;
 const k = chemLabState.huntOrbital;
 if (k === "s" || k === "p" || k === "d") {
 seen[k] = true;
 dwell[k] += 120;
 if (chemLabState.huntAutoRotate && dwell[k] >= 900) chemLabState.huntSpun[k] = true;
 }
 const spun = chemLabState.huntSpun || {};
 const ok =
 seen.s &&
 seen.p &&
 seen.d &&
 (spun.s || chemLabState.huntAutoRotate) &&
 (spun.p || chemLabState.huntAutoRotate) &&
 (spun.d || chemLabState.huntAutoRotate);
 go.disabled = !ok;
 note.textContent = ok
 ? "s, p, and d are in. f is optional. Every atom fills shapes like these, simplest first."
 : "Visit and spin s, p, and d (auto-rotate counts).";
 }, 120);
}

export function mountBuildupScrub(host, cfg) {
 const finish = once(() => cfg.onDone());
 let cancelled = false;
 let stage = "play";
 let auto = true;
 trackCleanup(() => {
 cancelled = true;
 clearInterval(iv);
 });
 chemLabState.huntFillZ = 1;
 playScene("elemBuildup");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 3: Iconic</div>
 <h3 id="hunt-bu-title">Orbital fill order</h3>
 <div id="hunt-bu-body"></div>
 <button type="button" class="btn primary" id="hunt-bu-go" disabled>Continue ▶</button>
 </div>`;
 const title = host.querySelector("#hunt-bu-title");
 const body = host.querySelector("#hunt-bu-body");
 const go = host.querySelector("#hunt-bu-go");
 function render() {
 if (stage === "play") {
 title.textContent = "Orbital fill order";
 body.innerHTML = `${narrationHtml(
 "This is the real reason the periodic table has the shape it does. The tall columns on the left and right are elements filling s and p orbitals. The wide block in the middle, the transition metals, is filling d orbitals. The shape of the periodic table is a direct map of orbital filling.",
 )}<label class="chem-heat__label" for="hunt-z">Scrub through Hydrogen to Iron (optional)</label>
 <input id="hunt-z" class="chem-heat__range" type="range" min="1" max="26" value="${chemLabState.huntFillZ || 1}" />
 <p id="hunt-z-read" class="chem-heat__readout"></p>`;
 const range = host.querySelector("#hunt-z");
 range.oninput = () => {
 auto = false;
 chemLabState.huntFillZ = Number(range.value);
 };
 go.disabled = (chemLabState.huntFillZ || 1) < 26;
 go.textContent = "See iron’s map ▶";
 } else if (stage === "config") {
 title.textContent = "Electron configuration";
 body.innerHTML = `${narrationHtml(
 "This string of letters and numbers is called an electron configuration, and you can now actually read it: the number is the shell, the letter is the orbital shape, and the small number on top is how many electrons are packed into that shape. This one line is a complete, precise map of exactly where every one of iron’s 26 electrons lives.",
 )}<p class="tiny-onscreen">${configString(26)}</p>`;
 chemLabState.huntFillZ = 26;
 go.disabled = false;
 go.textContent = "Ground rules (optional) ▶";
 } else {
 title.textContent = "Two ground rules";
 body.innerHTML = `${narrationHtml(
 "Two ground rules you can try to break: electrons fill the lowest energy orbital available first, and no two electrons in the same atom can be in the exact identical state.",
 )}<div class="btn-row">
 <button type="button" class="btn secondary" id="hunt-break-low">Try skipping 1s</button>
 <button type="button" class="btn secondary" id="hunt-break-same">Try three in one identical state</button>
 </div>
 <p id="hunt-pauli-note" class="drag-hint">Optional. Tap a rule, or skip.</p>
 <button type="button" class="btn secondary" id="hunt-pauli-skip">Skip this note ▶</button>`;
 host.querySelector("#hunt-break-low").onclick = () => {
 pulseFailFeedback(360);
 host.querySelector("#hunt-pauli-note").textContent =
 "Bounced. Electrons fill the lowest energy orbital available first.";
 };
 host.querySelector("#hunt-break-same").onclick = () => {
 pulseFailFeedback(360);
 host.querySelector("#hunt-pauli-note").textContent =
 "Bounced. No two electrons in the same atom can be in the exact identical state.";
 };
 host.querySelector("#hunt-pauli-skip").onclick = () => finish();
 go.disabled = false;
 go.textContent = "Continue ▶";
 }
 }
 render();
 go.onclick = () => {
 if (stage === "play") {
 stage = "config";
 render();
 return;
 }
 if (stage === "config") {
 stage = "pauli";
 render();
 return;
 }
 finish();
 };
 const iv = setInterval(() => {
 if (cancelled || stage !== "play") return;
 if (auto && (chemLabState.huntFillZ || 1) < 26) {
 chemLabState.huntFillZ = Math.min(26, (chemLabState.huntFillZ || 1) + 1);
 const range = host.querySelector("#hunt-z");
 if (range) range.value = String(chemLabState.huntFillZ);
 }
 const z = chemLabState.huntFillZ || 1;
 const el = elementForProtons(z);
 const read = host.querySelector("#hunt-z-read");
 if (read) read.textContent = `${el.name} (${el.symbol}), electrons ${z}. Now filling: ${fillingOrbital(z)}.`;
 if (z >= 26) go.disabled = false;
 }, 280);
}

export function mountInspector(host, cfg) {
 const finish = once(() => cfg.onDone());
 const arena = window.__arena;
 let cancelled = false;
 let stage = "inspect";
 trackCleanup(() => {
 cancelled = true;
 arena?.setIntentHandler?.(null);
 });
 chemLabState.huntInspectZ = 0;
 chemLabState.huntInspectAt = 0;
 chemLabState.huntStops = { ne: false, na: false, cl: false };
 chemLabState.phase = "inspect";
 chemLabState.huntPLobes = [true, false, false];
 chemLabState.huntDIndex = 0;
 chemLabState.huntAutoRotate = false;
 playScene("elemMood", { phase: "inspect" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 4</div>
 <h3 id="hunt-in-title">Element Inspector</h3>
 <div id="hunt-in-body"></div>
 <p id="hunt-in-status" class="tiny-onscreen"></p>
 <button type="button" class="btn primary" id="hunt-in-go" disabled>Continue ▶</button>
 </div>`;
 const title = host.querySelector("#hunt-in-title");
 const body = host.querySelector("#hunt-in-body");
 const status = host.querySelector("#hunt-in-status");
 const go = host.querySelector("#hunt-in-go");
 function render() {
 if (stage === "inspect") {
 title.textContent = "Element Inspector";
 body.innerHTML = narrationHtml(
 "Tap any element. The whole table blurs, then your pick pops sharp with a red cross around it so you can actually see the symbol. Neon, Sodium, and Chlorine keep gold rings until you visit them. Look at how full or empty that outermost orbital is: that is why some elements sit quietly and others react.",
 );
 go.disabled = true;
 go.textContent = "See the heat map ▶";
 tickStatus();
 } else if (stage === "heat") {
 title.textContent = "Electron moods";
 chemLabState.phase = "heat";
 body.innerHTML = narrationHtml(
 "Zoom out, and the entire periodic table starts to look less like a memorization chart and more like a map of electron moods: calm, eager to give an electron away, or eager to grab one. Every reaction you’ll ever study in chemistry, at its heart, comes down to atoms trying to fill or empty that outermost orbital shape.",
 );
 status.textContent = "Cool blue: already full. Hot orange: one electron to give or grab.";
 go.disabled = false;
 go.textContent = "Count valence electrons ▶";
 } else {
 title.textContent = "Valence electrons";
 chemLabState.phase = "valence";
 body.innerHTML = `${narrationHtml(
 "Chemists call these outer electrons valence electrons, and counting them is often all you need to predict how an element will behave. Sodium’s one lone electron and chlorine’s one open spot are a perfect match, and that exact pairing is the beginning of our very next hunt: how atoms actually bond together.",
 )}<p class="tiny-onscreen">Valence electrons: electrons in an atom’s outermost occupied shell, the ones involved in reactions.</p>
 <p class="tiny-onscreen">Na: 1 valence electron. Cl: 7 valence electrons. Together they can reach a full 8.</p>`;
 status.textContent = "";
 go.disabled = false;
 go.textContent = "Continue ▶";
 }
 }
 function tickStatus() {
 if (stage !== "inspect") return;
 const st = chemLabState.huntStops || {};
 const z = chemLabState.huntInspectZ;
 const el = elementForProtons(z);
 const extra = z ? ` Showing ${el.symbol} (${el.name}): ${configString(z)}, valence ${valenceCount(z)}.` : "";
 status.textContent = `Neon ${st.ne ? "yes" : "not yet"}. Sodium ${st.na ? "yes" : "not yet"}. Chlorine ${st.cl ? "yes" : "not yet"}.${extra}`;
 }
 render();
 arena?.setIntentHandler?.((intent) => {
 if (cancelled || stage !== "inspect" || intent.type !== "CANVAS_TAP" || intent.meta?.action !== "tile") return;
 const z = intent.meta.z;
 chemLabState.huntInspectZ = z;
 chemLabState.huntInspectAt = performance.now();
 if (z === 10) chemLabState.huntStops.ne = true;
 if (z === 11) chemLabState.huntStops.na = true;
 if (z === 17) chemLabState.huntStops.cl = true;
 pulseSuccessFeedback(180);
 const st = chemLabState.huntStops;
 go.disabled = !(st.ne && st.na && st.cl);
 const el = elementForProtons(z);
 const extra = ` Showing ${el.symbol} (${el.name}): ${configString(z)}, valence ${valenceCount(z)}.`;
 status.textContent = `Neon ${st.ne ? "yes" : "not yet"}. Sodium ${st.na ? "yes" : "not yet"}. Chlorine ${st.cl ? "yes" : "not yet"}.${extra}`;
 });
 go.onclick = () => {
 if (stage === "inspect") {
 stage = "heat";
 chemLabState.huntInspectZ = 0;
 render();
 return;
 }
 if (stage === "heat") {
 stage = "valence";
 render();
 return;
 }
 finish();
 };
}

export function mountBondMoods(host, cfg) {
 const finish = once(() => cfg.onDone());
 const arena = window.__arena;
 let cancelled = false;
 trackCleanup(() => {
 cancelled = true;
 arena?.setIntentHandler?.(null);
 });
 chemLabState.bondMoodI = 0;
 chemLabState.bondMoodOk = [false, false, false, false];
 chemLabState.bondMoodWrong = false;
 playScene("bondMood");
 const notes = [
 "Neon: full outer shell → Happy.",
 "Sodium: 1 lonely electron → Restless.",
 "Chlorine: 1 electron short of full → Restless.",
 "Oxygen: 2 electrons short of full → Restless.",
 ];
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 1: Enactive</div>
 <h3>Happy or Restless?</h3>
 ${narrationHtml("You already knew this from hunting elements. Restless atoms do not sit forever. They look for a fix. There are really only two moves: give electrons away, or share them.")}
 <p id="bond-mood-status" class="tiny-onscreen" aria-live="polite">Is this outer shell full?</p>
 <div class="btn-row bond-mood-row">
 <button type="button" class="btn secondary" id="bond-happy">Happy</button>
 <button type="button" class="btn secondary" id="bond-restless">Restless</button>
 </div>
 <button type="button" class="btn primary" id="bond-mood-go" disabled>Continue ▶</button>
 </div>`;
 const status = host.querySelector("#bond-mood-status");
 const go = host.querySelector("#bond-mood-go");
 const happyBtn = host.querySelector("#bond-happy");
 const restlessBtn = host.querySelector("#bond-restless");
 const wantHappy = [true, false, false, false];
 function guess(saidHappy) {
 if (cancelled) return;
 const i = chemLabState.bondMoodI || 0;
 if ((chemLabState.bondMoodOk || [])[i]) return;
 const ok = saidHappy === wantHappy[i];
 if (!ok) {
 chemLabState.bondMoodWrong = true;
 pulseFailFeedback(400);
 status.textContent = "Look again at whether the outer shell is full.";
 return;
 }
 chemLabState.bondMoodWrong = false;
 const arr = (chemLabState.bondMoodOk || [false, false, false, false]).slice();
 arr[i] = true;
 chemLabState.bondMoodOk = arr;
 pulseSuccessFeedback(280);
 status.textContent = notes[i];
 if (i >= 3) {
 go.disabled = false;
 happyBtn.disabled = true;
 restlessBtn.disabled = true;
 return;
 }
 setTimeout(() => {
 if (cancelled) return;
 chemLabState.bondMoodI = i + 1;
 chemLabState.bondMoodWrong = false;
 status.textContent = "Is this outer shell full?";
 }, 900);
 }
 happyBtn.onclick = () => guess(true);
 restlessBtn.onclick = () => guess(false);
 go.onclick = () => finish();
}

export function mountBondPaths(host, cfg) {
 const finish = once(() => cfg.onDone());
 const arena = window.__arena;
 let cancelled = false;
 let stage = "paths";
 let iv = null;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 arena?.setIntentHandler?.(null);
 });
 chemLabState.bondPathSeen = { transfer: false, share: false };
 chemLabState.bondPhase = "paths";
 playScene("bondPaths", { phase: "paths" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 1: Iconic</div>
 <h3 id="bond-path-title">Give or share</h3>
 <div id="bond-path-body"></div>
 <p id="bond-path-status" class="drag-hint" aria-live="polite"></p>
 <button type="button" class="btn primary" id="bond-path-go" disabled>Continue ▶</button>
 </div>`;
 const title = host.querySelector("#bond-path-title");
 const body = host.querySelector("#bond-path-body");
 const status = host.querySelector("#bond-path-status");
 const go = host.querySelector("#bond-path-go");
 function render() {
 if (stage === "paths") {
 title.textContent = "Give or share";
 body.innerHTML = narrationHtml(
 "Whether an atom transfers or shares usually comes down to how badly each atom wants its electrons. A metal like sodium holds its lone outer electron loosely and is happy to let it go. Two nonmetals both hold electrons tightly, so they compromise and share.",
 );
 status.textContent = "Tap both options on the canvas: transfer (ionic) and share (covalent).";
 go.disabled = true;
 go.textContent = "Name the rule ▶";
 } else {
 chemLabState.bondPhase = "lewis";
 playScene("bondPaths", { phase: "lewis" });
 title.textContent = "The octet rule";
 body.innerHTML = `${narrationHtml(
 "Chemists have a name for wanting a full outer shell: the octet rule. Most atoms are chasing a full set of eight outer electrons (two for the smallest atoms, like hydrogen and helium). The shorthand is a Lewis dot structure: just the symbol with dots for each valence electron.",
 )}<p class="tiny-onscreen">Octet rule: most stable with 8 outer electrons (2 for H and He).</p>
 <p class="tiny-onscreen">Lewis dots: valence electrons only, around the symbol.</p>`;
 status.textContent = "You'll be drawing these yourself very soon.";
 go.disabled = false;
 go.textContent = "Continue ▶";
 }
 }
 render();
 arena?.setIntentHandler?.((intent) => {
 if (cancelled || stage !== "paths" || intent.type !== "CANVAS_TAP" || intent.meta?.action !== "path") return;
 const seen = chemLabState.bondPathSeen || { transfer: false, share: false };
 if (intent.meta.id === "transfer") seen.transfer = true;
 if (intent.meta.id === "share") seen.share = true;
 chemLabState.bondPathSeen = { ...seen };
 if (seen.transfer && seen.share) {
 status.textContent = "Option A: transfer → ionic. Option B: share → covalent.";
 go.disabled = false;
 }
 });
 iv = setInterval(() => {
 if (cancelled || stage !== "paths") return;
 const seen = chemLabState.bondPathSeen || {};
 if (seen.transfer && seen.share) go.disabled = false;
 }, 160);
 go.onclick = () => {
 if (stage === "paths") {
 stage = "lewis";
 render();
 return;
 }
 finish();
 };
}

export function mountBondHandoff(host, cfg) {
 const finish = once(() => cfg.onDone());
 const arena = window.__arena;
 let cancelled = false;
 let iv = null;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 arena?.setIntentHandler?.(null);
 });
 chemLabState.bondHandoff = false;
 chemLabState.bondSnapPair = false;
 chemLabState.bondEx = null;
 chemLabState.bondEy = null;
 chemLabState.bondNaX = 0.3;
 chemLabState.bondClX = 0.7;
 chemLabState.bondDrag = "";
 playScene("bondHandoff");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 2: Enactive</div>
 <h3>The great electron handoff</h3>
 ${narrationHtml("Giving away that electron did not just fix sodium's problem. Sodium is now positively charged, and chlorine is negatively charged. Opposite charges attract, hard. That attraction is the bond.")}
 <p id="bond-hand-status" class="drag-hint" aria-live="polite">Drag Sodium's outer electron onto Chlorine.</p>
 <button type="button" class="btn primary" id="bond-hand-go" disabled>Continue ▶</button>
 </div>`;
 const status = host.querySelector("#bond-hand-status");
 const go = host.querySelector("#bond-hand-go");
 iv = setInterval(() => {
 if (cancelled) return;
 if (chemLabState.bondSnapPair) {
 status.textContent = "Locked pair. You did not just move an electron. You built the glue.";
 go.disabled = false;
 } else if (chemLabState.bondHandoff) {
 status.textContent = "Sodium: gave 1 electron away → now Na⁺. Chlorine: received 1 → now Cl⁻. Drag them together until they snap.";
 }
 }, 140);
 go.onclick = () => finish();
}

export function mountBondLattice(host, cfg) {
 const finish = once(() => cfg.onDone());
 let cancelled = false;
 let stage = "lattice";
 trackCleanup(() => {
 cancelled = true;
 });
 chemLabState.bondPhase = "lattice";
 chemLabState.bondLatShake = 0;
 playScene("bondLattice", { phase: "lattice" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 2: Iconic</div>
 <h3 id="bond-lat-title">A crystal of salt</h3>
 <div id="bond-lat-body"></div>
 <button type="button" class="btn primary" id="bond-lat-go">Name the ions ▶</button>
 </div>`;
 const title = host.querySelector("#bond-lat-title");
 const body = host.querySelector("#bond-lat-body");
 const go = host.querySelector("#bond-lat-go");
 body.innerHTML = `${narrationHtml(
 "Ionic bonds almost never stop at just two atoms. Opposite charges pull in every direction, so ions stack into a repeating 3D grid called a crystal lattice. That grain of table salt is not one molecule. It is trillions of sodium and chlorine ions locked into this pattern.",
 )}<p class="tiny-onscreen">Optional: drag the canvas to shake the grid. It holds its shape.</p>`;
 go.onclick = () => {
 if (cancelled) return;
 if (stage === "lattice") {
 stage = "words";
 chemLabState.bondPhase = "words";
 playScene("bondLattice", { phase: "words" });
 title.textContent = "Ions and NaCl";
 body.innerHTML = `${narrationHtml(
 "A charged atom is called an ion: a plus sign for one that lost electrons, a minus sign for one that gained them. The attraction between them is an ionic bond. When chemists write NaCl, that ratio is exactly what is needed for the charges to cancel to zero overall.",
 )}<p class="tiny-onscreen">Ion: atom with a charge (Na⁺, Cl⁻).</p>
 <p class="tiny-onscreen">Ionic bond: electrostatic attraction between opposite ions.</p>
 <p class="tiny-onscreen">Formula: NaCl (1:1).</p>`;
 go.textContent = "Continue ▶";
 return;
 }
 finish();
 };
}

export function mountBondCovalent(host, cfg) {
 const finish = once(() => cfg.onDone());
 const arena = window.__arena;
 let cancelled = false;
 let stage = "share";
 let iv = null;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 arena?.setIntentHandler?.(null);
 });
 chemLabState.bondHTried = false;
 chemLabState.bondHShare = false;
 chemLabState.bondEx = null;
 chemLabState.bondEy = null;
 chemLabState.bondH0 = 0.3;
 chemLabState.bondH1 = 0.7;
 chemLabState.bondShareCloud = false;
 playScene("bondShare");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 3: Enactive</div>
 <h3 id="bond-cov-title">Share, don't give</h3>
 <div id="bond-cov-body"></div>
 <p id="bond-cov-status" class="drag-hint" aria-live="polite"></p>
 <button type="button" class="btn primary" id="bond-cov-go" disabled>Continue ▶</button>
 </div>`;
 const title = host.querySelector("#bond-cov-title");
 const body = host.querySelector("#bond-cov-body");
 const status = host.querySelector("#bond-cov-status");
 const go = host.querySelector("#bond-cov-go");

 function snapIfClose(id, x, y) {
 const aw = arena?.width || 640;
 const ah = arena?.height || 360;
 const ox = aw * 0.58;
 const oy = ah * 0.46;
 const slots = {
 o: { x: ox, y: oy, r: 30 },
 hL: { x: ox - 38, y: oy + 28, r: 24 },
 hR: { x: ox + 38, y: oy + 28, r: 24 },
 };
 const b = chemLabState.build;
 function near(slot) {
 return Math.hypot(x - slot.x, y - slot.y) < slot.r;
 }
 if (id === "o" && near(slots.o)) b.o = true;
 else if (id === "hL" || id === "hR") {
 if (!b.hL && near(slots.hL)) b.hL = true;
 else if (!b.hR && near(slots.hR)) b.hR = true;
 else if (!b.hL && near(slots.hR)) b.hL = true;
 else if (!b.hR && near(slots.hL)) b.hR = true;
 }
 if (b.o && b.hL && b.hR && !b.snapped) {
 b.snapped = true;
 pulseSuccessFeedback(420);
 status.textContent =
 "Two separate shared pairs, one per O-H connection. This is what holds every water molecule together.";
 go.disabled = false;
 }
 chemLabState.build = { ...b };
 }

 function render() {
 if (stage === "share") {
 title.textContent = "Share, don't give";
 body.innerHTML = narrationHtml(
 "Two hydrogen atoms both want to hold onto their one electron, so instead of one giving up, they compromise: they share. That shared pair belongs to both atoms at once, and both count it toward stability.",
 );
 status.textContent = "First try transferring the electron (it should bounce). Then overlap the atoms.";
 go.disabled = true;
 go.textContent = "Build water ▶";
 playScene("bondShare");
 } else {
 chemLabState.bondShareCloud = true;
 chemLabState.build = { o: false, hL: false, hR: false, snapped: false };
 playScene("tinyBuild");
 title.textContent = "Build water, properly this time";
 body.innerHTML = narrationHtml(
 "The H₂O ghost outline from Tiny Bits is back. This time, dragging each Hydrogen next to Oxygen shows the shared-electron-pair cloud forming at each junction.",
 );
 status.textContent = "Drop two blue bits and one red bit onto the bent outline.";
 go.disabled = true;
 go.textContent = "Continue ▶";
 }
 }
 render();
 arena?.setIntentHandler?.((intent) => {
 if (cancelled) return;
 if (stage === "water" && intent.type === "CANVAS_UP" && intent.meta?.piece) {
 snapIfClose(intent.meta.piece, intent.x, intent.y);
 }
 });
 iv = setInterval(() => {
 if (cancelled || stage !== "share") return;
 if (chemLabState.bondHTried && !chemLabState.bondHShare) {
 status.textContent = "Both atoms want to keep this electron. Try overlapping them instead of transferring.";
 }
 if (chemLabState.bondHShare) {
 status.textContent = "Neither atom gave anything away. Both now count the same shared pair as their own.";
 go.disabled = false;
 }
 }, 140);
 go.onclick = () => {
 if (stage === "share") {
 stage = "water";
 render();
 return;
 }
 finish();
 };
}

export function mountBondPairs(host, cfg) {
 const finish = once(() => cfg.onDone());
 let stage = "gallery";
 trackCleanup(() => {});
 chemLabState.bondGallery = 0;
 chemLabState.bondPhase = "gallery";
 playScene("bondPairs", { phase: "gallery" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 3: Iconic</div>
 <h3 id="bond-pair-title">Single, double, triple</h3>
 <div id="bond-pair-body"></div>
 <button type="button" class="btn primary" id="bond-pair-go">Draw Lewis H₂O ▶</button>
 </div>`;
 const title = host.querySelector("#bond-pair-title");
 const body = host.querySelector("#bond-pair-body");
 const go = host.querySelector("#bond-pair-go");
 body.innerHTML = narrationHtml(
 "Atoms can share more than one pair if they both need to. One shared pair is a single bond, two pairs is a double bond, three is a triple bond. Each extra pair makes the bond stronger and shorter, which you can feel if you try pulling them apart.",
 );
 go.onclick = () => {
 if (stage === "gallery") {
 stage = "lewis";
 chemLabState.bondPhase = "lewis";
 playScene("bondPairs", { phase: "lewis" });
 title.textContent = "Lewis water, and a lopsided share";
 body.innerHTML = `${narrationHtml(
 "This lopsided sharing, where oxygen hogs the shared electrons slightly more than hydrogen, turns out to matter a lot. It is the difference between two flavors of covalent bond, which is exactly what we're hunting next.",
 )}<p class="tiny-onscreen">Covalent bond: sharing a pair of electrons between two atoms.</p>
 <p class="tiny-onscreen">Bonding pair (shared, drawn as a line) vs lone pair (unshared, drawn as dots).</p>
 <p class="tiny-onscreen">Some atoms pull shared electrons harder than others. That pulling power has a name…</p>`;
 go.textContent = "Continue ▶";
 return;
 }
 finish();
 };
}

export function mountBondTug(host, cfg) {
 const finish = once(() => cfg.onDone());
 const arena = window.__arena;
 let cancelled = false;
 let iv = null;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 arena?.setIntentHandler?.(null);
 });
 chemLabState.bondTugI = 0;
 chemLabState.bondTugHits = { hh: false, hcl: false, nacl: false };
 chemLabState.bondTugX = 0.5;
 chemLabState.bondDrag = "";
 playScene("bondTug");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 4: Enactive</div>
 <h3>Electronegativity tug-of-war</h3>
 ${narrationHtml("Ionic and covalent bonds are not two totally separate categories. They are two ends of the same spectrum. It all comes down to how unevenly two atoms pull on shared electrons.")}
 <p id="bond-tug-status" class="tiny-onscreen" aria-live="polite">H-H first: a perfectly even tug. Drag the marker to Equal sharing.</p>
 <button type="button" class="btn primary" id="bond-tug-go" disabled>Continue ▶</button>
 </div>`;
 const status = host.querySelector("#bond-tug-status");
 const go = host.querySelector("#bond-tug-go");
 iv = setInterval(() => {
 if (cancelled) return;
 const hits = chemLabState.bondTugHits || {};
 const i = chemLabState.bondTugI || 0;
 if (hits.hh && hits.hcl && hits.nacl) {
 status.textContent =
 "Pull perfectly evenly: nonpolar covalent. Uneven but not complete: polar covalent. Pull so hard the electron leaves: ionic.";
 go.disabled = false;
 } else if (i === 0) status.textContent = "H-H: perfectly even tug. Marker to the far left (nonpolar covalent).";
 else if (i === 1) status.textContent = "H-Cl: Chlorine pulls harder, but does not fully win (polar covalent).";
 else status.textContent = "Na-Cl: Sodium barely resists. The electron fully leaves (ionic).";
 }, 160);
 go.onclick = () => finish();
}

export function mountBondMaterials(host, cfg) {
 const finish = once(() => cfg.onDone());
 let stage = "mats";
 let cancelled = false;
 let iv = null;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 });
 chemLabState.bondPhase = "mats";
 chemLabState.bondShatter = false;
 chemLabState.bondDissolve = false;
 chemLabState.bondMelt = false;
 playScene("bondMaterials", { phase: "mats" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 4: Iconic</div>
 <h3 id="bond-mat-title">How materials behave</h3>
 <div id="bond-mat-body"></div>
 <p id="bond-mat-status" class="drag-hint" aria-live="polite">Tap the salt crystal, then the sugar cube.</p>
 <button type="button" class="btn primary" id="bond-mat-go" disabled>ΔEN numbers ▶</button>
 </div>`;
 const title = host.querySelector("#bond-mat-title");
 const body = host.querySelector("#bond-mat-body");
 const status = host.querySelector("#bond-mat-status");
 const go = host.querySelector("#bond-mat-go");
 body.innerHTML = narrationHtml(
 "This is not just an abstract electron game. The type of bond holding a material together decides how that material behaves in your hands. Ionic solids shatter and conduct electricity once dissolved. Covalent molecular substances tend to melt more easily and do not conduct.",
 );
 iv = setInterval(() => {
 if (cancelled || stage !== "mats") return;
 if (chemLabState.bondShatter && chemLabState.bondMelt) {
 status.textContent = "Ionic: brittle, conducts when dissolved. Covalent molecular: melts easier, does not conduct.";
 go.disabled = false;
 }
 }, 160);
 go.onclick = () => {
 if (stage === "mats") {
 stage = "den";
 chemLabState.bondPhase = "den";
 playScene("bondMaterials", { phase: "den" });
 title.textContent = "Electronegativity difference";
 body.innerHTML = `${narrationHtml(
 "Chemists put a number on pulling power: electronegativity. Subtract two atoms' values, and that difference tells you where their bond sits on the spectrum you just built with your hands. These are guidelines, not hard walls, because bonding is a spectrum, not separate boxes.",
 )}<p class="tiny-onscreen">Electronegativity: how strongly an atom pulls on shared electrons.</p>
 <p class="tiny-onscreen">ΔEN 0-0.4 → nonpolar covalent. 0.4-1.7 → polar covalent. 1.7+ → ionic.</p>`;
 status.textContent = "";
 go.disabled = false;
 go.textContent = "Continue ▶";
 return;
 }
 finish();
 };
}
