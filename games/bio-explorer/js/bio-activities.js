/**
 * Bio Explorer activity mounts - panel + canvas share forceLabState / intents.
 */
import { scaledDwellMs } from "/engine/js/timings.js";
import { clearConceptViz } from "/engine/js/concept-viz.js";
import {
 ATOM_ASSET_PATHS,
 chemLabState,
 setHeatTarget,
 pulseFailFeedback,
 pulseSuccessFeedback,
 LIFE_SORT_ITEMS,
 MRS_GREN,
 LIFE_PROVE_CARDS,
 LIFE_FLAME_EVIDENCE,
 LIFE_MARS,
 CELL_ORGANELLES,
 CELL_PLANT_ADDONS,
 CELL_LINE,
 CELL_THEORY,
} from "./bio-state.js?v=cellplant2";
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

export function trackCleanup(fn) {
 cancelActiveActivity();
 activeCleanup = fn || null;
 return fn;
}

export function once(fn) {
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
 session.dispatch({ type: "SET_PHASE", phase: b.sceneArgs.phase });
 }
 playScene(b.scene, { ...(b.sceneArgs || {}), dwellMs: minMs });
 host.innerHTML = `
 <div class="lab-demo lab-demo--chain chem-card">
 <div class="lab-demo__badge">Act ${i + 1} of ${total}</div>
 <h3 class="lab-chain-title">${cfg.title || "Watch the story unfold"}</h3>
 <div class="lab-demo__body">${b.html}</div>
 <p class="lab-demo__timer" id="chain-msg" aria-live="polite">Watch / interact with the canvas\u2026</p>
 <div class="btn-row">
 <button type="button" class="btn secondary" id="chain-skip" ${i === 0 ? "disabled" : ""}>Prev</button>
 <button type="button" class="btn primary" id="chain-go" disabled>Next</button>
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
 if (msg) msg.textContent = left > 0 ? `Explore act ${i + 1} (${left}s)\u2026` : "Ready for next act!";
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
 <p class="lab-drag__hint">${cfg.instructions} Drag on the <strong>canvas</strong> or use chips here - both stay in sync.</p>
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
 status.textContent = "Hmm - that belongs in another bin.";
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
 status.textContent = cfg.successText || "Nice sort - all chips placed!";
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
 status.textContent = cfg.successText || "Nice sort - all chips placed!";
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
 status.textContent = `Selected ${intent.meta.chipId} - drop on a bin or Place here.`;
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
 ${badgeHtml(cfg.badge || ATOM_ASSET_PATHS.life, "force lab")}
 <h3>${cfg.title}</h3>
 <p>${cfg.html}</p>
 <label class="chem-heat__label" for="chem-heat">${sliderLabel}</label>
 <div class="chem-heat__controls">
 <button type="button" class="btn secondary chem-heat__nudge" id="chem-heat-down" aria-label="Decrease">?\u2019</button>
 <input id="chem-heat" class="chem-heat__range" type="range" min="0" max="100" step="1"
 value="${Math.round(startH * 100)}" aria-valuemin="0" aria-valuemax="100"
 aria-valuenow="${Math.round(startH * 100)}" />
 <button type="button" class="btn secondary chem-heat__nudge" id="chem-heat-up" aria-label="Increase">+</button>
 </div>
 <p class="chem-heat__readout" id="chem-heat-read" aria-live="polite">Cold</p>
 <p class="chem-heat__goal">${cfg.goalText}</p>
 <button type="button" class="btn primary" id="chem-heat-go" disabled>${cfg.doneLabel || "Continue"}</button>
 </div>`;

 const range = host.querySelector("#chem-heat");
 const read = host.querySelector("#chem-heat-read");
 const btn = host.querySelector("#chem-heat-go");
 let cancelled = false;

 function applyHeat(raw) {
 const pct = Math.max(0, Math.min(100, Math.round(Number(raw) || 0)));
 const h = pct / 100;
 range.value = String(pct);
 range.setAttribute("aria-valuenow", String(pct));
 chemLabState.heat = h;
 chemLabState.energy = h;
 setHeatTarget(h);
 if (cfg.syncKey === "pushForce") chemLabState.pushForce = h;
 if (cfg.syncKey === "rockVx") chemLabState.rockVx = h;
 if (cfg.syncKey === "pairGap") {
 chemLabState.pairGap = 1 - h;
 chemLabState.recoil = h;
 }
 if (cfg.syncKey === "sprout") chemLabState.sprout = h;
 if (cfg.syncKey === "cellZoom") chemLabState.cellZoom = h;
 if (cfg.syncKey === "sun") chemLabState.sun = h;
 session.dispatch({ type: "SET_HEAT", value: h });
 const phase = heatPhase(h);
 const labels = cfg.readoutLabels || {
 cold: "Cold - molecules locked / slow",
 melting: "Melting - lattice softening",
 liquid: "Liquid - free to slide",
 simmer: "Hot - vapor escaping",
 };
 read.textContent = labels[phase] || "Working\u2026";
 if (h >= threshold) {
 btn.disabled = false;
 read.textContent += " - Goal reached";
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
 if (chemLabState.heat >= threshold) {
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
 <button type="button" class="btn primary" id="chem-reveal-btn">Reveal next</button>
 </div>`;
 const list = host.querySelector("#chem-reveal");
 const btn = host.querySelector("#chem-reveal-btn");
 const finish = once(() => cfg.onDone());

 btn.onclick = () => {
 if (finished) {
 finish();
 return;
 }
 if (i >= cfg.steps.length) {
 finished = true;
 btn.textContent = "Continue";
 return;
 }
 const li = document.createElement("li");
 li.className = "chem-reveal__item";
 li.innerHTML = cfg.steps[i];
 list.appendChild(li);
 if (cfg.onStep) cfg.onStep(i);
 i++;
 if (i >= cfg.steps.length) {
 finished = true;
 btn.textContent = "I get it - continue";
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
 <button type="button" class="btn primary hidden" id="eq-done">Continue</button>
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
 const sliderLabel = cfg.sliderLabel || "Zoom scale: grain ? ions ? atom model";
 const goalText = cfg.goalText || "Left canvas follows the same order: grain ? ions ? orbitals.";
 const readoutLabels = cfg.readoutLabels || {
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
 <p class="chem-heat__readout" id="chem-scale-read" aria-live="polite">${readoutLabels.low}</p>
 <p class="chem-heat__goal">${goalText}</p>
 <button type="button" class="btn primary" id="chem-scale-go" disabled>Continue</button>
 </div>`;
 const range = host.querySelector("#chem-scale");
 const read = host.querySelector("#chem-scale-read");
 const btn = host.querySelector("#chem-scale-go");
 function apply(v) {
 const s = Math.max(0, Math.min(1, v / 100));
 chemLabState.scale = s;
 chemLabState.tokenProgress = s < 0.33 ? 0 : s < 0.66 ? 1 : s < 0.9 ? 2 : 3;
 if (s < 0.33) read.textContent = readoutLabels.low;
 else if (s < 0.66) read.textContent = readoutLabels.mid;
 else read.textContent = readoutLabels.high;
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
 playScene(cfg.passScene || cfg.scene || "lifeMastery");
 host.innerHTML = `
 <div class="chem-card">
 <h3>${pass ? "Drill passed!" : "Almost - review & retry"}</h3>
 <p>You scored <strong>${correct}</strong> of <strong>${items.length}</strong> (${Math.round((correct / items.length) * 100)}%).</p>
 <p>${pass ? cfg.passMessage || "Nice fluency - keep going." : `Need ${Math.round(passRatio * 100)}% to continue.`}</p>
 <div class="btn-row">
 ${pass ? `<button type="button" class="btn primary" id="drill-done">Continue</button>` : ""}
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
 playScene(cfg.scene || "lifeDrill", { prompt: chemLabState.prompt, flashColor: chemLabState.flashColor });
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
 .join(" ?\u2019 ");
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
 playScene(cfg.scene || "lifeMyth", { myth: m.sceneMyth });
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
 <button type="button" class="btn primary hidden" id="myth-next">Next myth</button>
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
 nextBtn.textContent = last ? "Continue" : "Next myth";
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
 status.innerHTML = `<strong>That claim is a myth.</strong> Hit "Bust it" to see the evidence on the canvas.<br/><em>Hint:</em> ${m.truth}`;
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
 <button type="button" class="btn primary" id="tap-go">Continue</button>
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
 <button type="button" class="btn primary" id="mq-done">Continue</button>
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

export function narrationHtml(text) {
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
 <button type="button" class="btn primary ${cfg.pulse ? "tiny-pulse" : ""}" id="tiny-gate-go" ${cfg.ready ? "disabled" : ""}>${cfg.doneLabel || "Continue ?"}</button>
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
 playScene(cfg.scene || "lifeSpiral");
 const stops = cfg.stops || [];
 const finishLabel = cfg.finishLabel || "Finish Living or Not ?";
 const statusIdle = cfg.statusIdle || "Tap a number to replay, or finish now.";
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">${cfg.badge || "Closing"}</div>
 <h3>${cfg.title || "Your recap map"}</h3>
 ${narrationHtml(cfg.narration || "This last screen is a recap, not a new puzzle.")}
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
 const el = host.querySelector("#spiral-status");
 if (el) el.textContent = `Replaying spiral ${n}. Tap another number, or ${finishLabel.replace(" ?", "")}.`;
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

export function mountLifeSort(host, cfg) {
 const finish = once(() => cfg.onDone());
 let cancelled = false;
 let iv = null;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 });
 chemLabState.lifePlaced = {};
 chemLabState.lifeSortDone = false;
 chemLabState.lifeSelected = null;
 playScene("lifeSort");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 1: Enactive</div>
 <h3>Sort it yourself</h3>
 ${narrationHtml(
 "Eight everyday things. Put each into Living or Non-living using only what you can see on the canvas: dog, tree, mushroom, person vs rock, chair, car, cloud. No trick items yet.",
 )}
 <p class="drag-hint">Tap a thing on the canvas or here, then Living or Non-living.</p>
 <div class="chip-bank" id="life-sort-bank"></div>
 <div class="btn-row">
 <button type="button" class="btn secondary" id="life-bin-live">Living</button>
 <button type="button" class="btn secondary" id="life-bin-not">Non-living</button>
 </div>
 <p id="life-sort-status" class="drag-hint" aria-live="polite">0 of 8 sorted.</p>
 <button type="button" class="btn primary" id="life-sort-go" disabled>Continue</button>
 </div>`;
 const bank = host.querySelector("#life-sort-bank");
 const status = host.querySelector("#life-sort-status");
 const go = host.querySelector("#life-sort-go");
 function renderBank() {
 bank.innerHTML = LIFE_SORT_ITEMS.filter((c) => !chemLabState.lifePlaced[c.id])
 .map((c) => `<button type="button" class="chip" data-chip="${c.id}" title="${c.hint || ""}">${c.label}</button>`)
 .join("");
 bank.querySelectorAll("[data-chip]").forEach((btn) => {
 btn.onclick = () => {
 chemLabState.lifeSelected = btn.dataset.chip;
 bank.querySelectorAll(".chip").forEach((el) => el.classList.toggle("chip--selected", el === btn));
 const item = LIFE_SORT_ITEMS.find((c) => c.id === btn.dataset.chip);
 if (item?.hint) status.textContent = `${item.label}: ${item.hint}`;
 };
 });
 }
 function place(bin) {
 const id = chemLabState.lifeSelected;
 if (!id) {
 status.textContent = "Tap an item first.";
 return;
 }
 const item = LIFE_SORT_ITEMS.find((c) => c.id === id);
 if (item.bin !== bin) {
 pulseFailFeedback(280);
 status.textContent = "Gut check: try the other bin.";
 return;
 }
 chemLabState.lifePlaced = { ...chemLabState.lifePlaced, [id]: bin };
 chemLabState.lifeSelected = null;
 pulseSuccessFeedback(180);
 if (LIFE_SORT_ITEMS.every((c) => chemLabState.lifePlaced[c.id] === c.bin)) {
 chemLabState.lifeSortDone = true;
 }
 renderBank();
 }
 host.querySelector("#life-bin-live").onclick = () => place("living");
 host.querySelector("#life-bin-not").onclick = () => place("nonliving");
 renderBank();
 iv = setInterval(() => {
 if (cancelled) return;
 const n = Object.keys(chemLabState.lifePlaced || {}).length;
 status.textContent = chemLabState.lifeSortDone
 ? "You sorted these correctly. What were you actually looking for?"
 : `${n} of 8 sorted.`;
 if (chemLabState.lifeSortDone) go.disabled = false;
 }, 160);
 go.onclick = () => finish();
}

export function mountLifeCompare(host, cfg) {
 const finish = once(() => cfg.onDone());
 let stage = "see";
 trackCleanup(() => {});
 chemLabState.phase = "see";
 playScene("lifeCompare", { phase: "see" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 1: Iconic</div>
 <h3 id="life-cmp-title">Tree versus rock</h3>
 <div id="life-cmp-body"></div>
 <button type="button" class="btn primary" id="life-cmp-go">Name the pattern ?</button>
 </div>`;
 const title = host.querySelector("#life-cmp-title");
 const body = host.querySelector("#life-cmp-body");
 const go = host.querySelector("#life-cmp-go");
 body.innerHTML = `${narrationHtml(
 "Watch the outdoor scene: sunlight beams hit the tree, wind moves the canopy, and the tree grows taller and thicker frame by frame. The rock beside it never grows, never sways, never makes seeds.",
 )}<p class="tiny-onscreen">1. Tree grows under the sun. Rock stays the same size.</p>
 <p class="tiny-onscreen">2. Leaves sway in the wind. Rock does not respond.</p>
 <p class="tiny-onscreen">3. Mature tree drops seeds. Rock never reproduces.</p>`;
 go.onclick = () => {
 if (stage === "see") {
 stage = "word";
 chemLabState.phase = "word";
 playScene("lifeCompare", { phase: "word" });
 title.textContent = "A rough outline";
 body.innerHTML = `${narrationHtml(
 "That contrast is the rough outline biologists use: grow, use energy, respond, reproduce, and move parts of the body. Next we turn it into the named checklist MRS GREN.",
 )}<p class="tiny-onscreen">Living pattern: grow · use energy · respond · reproduce · move (at least sometime).</p>`;
 go.textContent = "Continue";
 return;
 }
 finish();
 };
}

export function mountLifeProve(host, cfg) {
 const finish = once(() => cfg.onDone());
 let cancelled = false;
 let iv = null;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 });
 chemLabState.lifeProve = {};
 chemLabState.lifeProvePick = null;
 chemLabState.lifeProveDone = false;
 playScene("lifeProve");
 const shuffled = [...LIFE_PROVE_CARDS].sort(() => Math.random() - 0.5);
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 2: Enactive</div>
 <h3>Prove it's alive</h3>
 ${narrationHtml(
 "Prove this mushroom is alive. Each correct clip fills a numbered slot and the mushroom on the canvas changes: stem taller, cap wider, spores, then a baby mushroom beside it.",
 )}
 <p class="drag-hint">Slots 1-7 have no names yet. Watch the mushroom change as slots fill.</p>
 <div class="chip-bank" id="life-prove-bank"></div>
 <div class="btn-row" id="life-prove-slots"></div>
 <p id="life-prove-status" class="drag-hint" aria-live="polite">Tap a clip, then a slot.</p>
 <button type="button" class="btn primary" id="life-prove-go" disabled>Continue ?</button>
 </div>`;
 const bank = host.querySelector("#life-prove-bank");
 const slotRow = host.querySelector("#life-prove-slots");
 const status = host.querySelector("#life-prove-status");
 const go = host.querySelector("#life-prove-go");
 slotRow.innerHTML = MRS_GREN.map(
 (t, i) => `<button type="button" class="btn secondary" data-trait="${t.id}">${i + 1}</button>`,
 ).join("");
 function renderBank() {
 bank.innerHTML = shuffled
 .filter((c) => !chemLabState.lifeProve[c.id])
 .map((c) => `<button type="button" class="chip" data-card="${c.id}">${c.label}</button>`)
 .join("");
 bank.querySelectorAll("[data-card]").forEach((btn) => {
 btn.onclick = () => {
 chemLabState.lifeProvePick = btn.dataset.card;
 bank.querySelectorAll(".chip").forEach((el) => el.classList.toggle("chip--selected", el === btn));
 };
 });
 }
 slotRow.querySelectorAll("[data-trait]").forEach((btn) => {
 btn.onclick = () => {
 const pick = chemLabState.lifeProvePick;
 if (!pick) {
 status.textContent = "Tap a clip first.";
 return;
 }
 const card = LIFE_PROVE_CARDS.find((c) => c.id === pick);
 if (card.trait !== btn.dataset.trait) {
 pulseFailFeedback(280);
 status.textContent = "That clip belongs on a different numbered slot.";
 return;
 }
 chemLabState.lifeProve = { ...chemLabState.lifeProve, [pick]: card.trait };
 chemLabState.lifeProvePick = null;
 pulseSuccessFeedback(180);
 if (LIFE_PROVE_CARDS.every((c) => chemLabState.lifeProve[c.id] === c.trait)) {
 chemLabState.lifeProveDone = true;
 }
 renderBank();
 };
 });
 renderBank();
 iv = setInterval(() => {
 if (cancelled) return;
 const n = Object.keys(chemLabState.lifeProve || {}).length;
 status.textContent = chemLabState.lifeProveDone
 ? "You built a complete case for the mushroom, using seven independent pieces of evidence."
 : `${n} of 7 clips placed.`;
 if (chemLabState.lifeProveDone) go.disabled = false;
 }, 160);
 go.onclick = () => finish();
}

export function mountLifeMrs(host, cfg) {
 const finish = once(() => cfg.onDone());
 let stage = "icons";
 trackCleanup(() => {});
 chemLabState.phase = "icons";
 playScene("lifeMrs", { phase: "icons" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 2: Iconic</div>
 <h3 id="life-mrs-title">MRS GREN</h3>
 <div id="life-mrs-body"></div>
 <button type="button" class="btn primary" id="life-mrs-go">Lock the definitions ?</button>
 </div>`;
 const title = host.querySelector("#life-mrs-title");
 const body = host.querySelector("#life-mrs-body");
 const go = host.querySelector("#life-mrs-go");
 body.innerHTML = `${narrationHtml(
 "MRS GREN is the memory trick for seven signs of life. On the canvas, each letter shows a concrete real-world example (dog running, seedling growing, mushroom spores, plant leaning to light).",
 )}<p class="tiny-onscreen">${MRS_GREN.map((t) => `${t.letter} ${t.name}`).join(" · ")}</p>`;
 go.onclick = () => {
 if (stage === "icons") {
 stage = "card";
 chemLabState.phase = "card";
 playScene("lifeMrs", { phase: "card" });
 title.textContent = "The official checklist";
 body.innerHTML = `${narrationHtml(
 "Lock each letter with its definition and a specific real example. Then we test hard cases: flame, crystal, virus, dormant seed.",
 )}${MRS_GREN.map((t) => `<p class="tiny-onscreen"><strong>${t.letter} ${t.name}</strong> - ${t.def}<br/><em>${t.example}</em></p>`).join("")}`;
 go.textContent = "Continue";
 return;
 }
 finish();
 };
}

function flameReady() {
 return LIFE_FLAME_EVIDENCE.every((e) => chemLabState.lifeMarks?.[e.trait]);
}

export function mountLifeSuspects(host, cfg) {
 const finish = once(() => cfg.onDone());
 let cancelled = false;
 let iv = null;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 });
 chemLabState.lifeSuspect = 0;
 chemLabState.lifeMarks = {};
 chemLabState.lifeFlameDone = false;
 chemLabState.lifeCrystalDone = false;
 chemLabState.lifeVirusDone = false;
 chemLabState.lifeSeedDone = false;
 chemLabState.lifeSeedWater = false;
 chemLabState.lifeSeedT0 = 0;
 chemLabState.lifeFlameFuel = 0;
 chemLabState.lifeFlameWind = 0;
 chemLabState.lifeFlameSmoke = 0;
 chemLabState.lifeFlameFlicker = 0;
 playScene("lifeSuspects");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 3: Enactive</div>
 <h3 id="life-sus-title">Suspect 1 of 4: flame</h3>
 <div id="life-sus-body"></div>
 <p id="life-sus-status" class="drag-hint" aria-live="polite">Place every flame behavior on the checklist.</p>
 <div id="life-sus-controls"></div>
 <button type="button" class="btn primary" id="life-sus-go" disabled>Score this suspect ?</button>
 </div>`;
 const title = host.querySelector("#life-sus-title");
 const body = host.querySelector("#life-sus-body");
 const status = host.querySelector("#life-sus-status");
 const controls = host.querySelector("#life-sus-controls");
 const go = host.querySelector("#life-sus-go");

 function setStage() {
 const i = chemLabState.lifeSuspect || 0;
 chemLabState.lifeMarks = {};
 go.disabled = true;
 if (i === 0) {
 title.textContent = "Suspect 1 of 4: flame";
 body.innerHTML = narrationHtml(
 "A flame fakes several signs of life. Tap each behavior and watch the canvas: fuel makes the flame grow taller, wind leans it, smoke rises. Two checklist slots stay empty on purpose (no true respiration, no true reproduction).",
 );
 controls.innerHTML = LIFE_FLAME_EVIDENCE.map(
 (e) => `<button type="button" class="btn secondary" data-ev="${e.id}">${e.label}</button>`,
 ).join("");
 controls.querySelectorAll("[data-ev]").forEach((btn) => {
 btn.onclick = () => {
 const ev = LIFE_FLAME_EVIDENCE.find((e) => e.id === btn.dataset.ev);
 chemLabState.lifeMarks = { ...chemLabState.lifeMarks, [ev.trait]: true };
 if (ev.effect === "fuel") chemLabState.lifeFlameFuel = Math.min(1, (chemLabState.lifeFlameFuel || 0) + 0.45);
 if (ev.effect === "wind") chemLabState.lifeFlameWind = 1;
 if (ev.effect === "smoke") chemLabState.lifeFlameSmoke = 1;
 if (ev.effect === "flicker") chemLabState.lifeFlameFlicker = 1;
 if (ev.effect === "consume") chemLabState.lifeFlameFuel = Math.max(0.15, (chemLabState.lifeFlameFuel || 0.5) * 0.7);
 pulseSuccessFeedback(160);
 btn.disabled = true;
 };
 });
 } else if (i === 1) {
 title.textContent = "Suspect 2 of 4: crystal";
 body.innerHTML = narrationHtml(
 "Crystals get larger by stacking mineral layers. That is not biological growth - no cells are built.",
 );
 controls.innerHTML = `<button type="button" class="btn secondary" id="life-layers">Adds mineral layers</button>`;
 controls.querySelector("#life-layers").onclick = () => {
 chemLabState.lifeMarks = { growth: true };
 pulseSuccessFeedback(160);
 };
 } else if (i === 2) {
 title.textContent = "Suspect 3 of 4: virus";
 body.innerHTML = narrationHtml(
 "The canvas shows a virus particle: a genetic shell with protein spikes. It can copy only by hijacking a living host cell. On its own it does not eat, respire, excrete, or grow.",
 );
 controls.innerHTML = `<button type="button" class="btn secondary" id="life-hijack">Hijacks a host cell</button>`;
 controls.querySelector("#life-hijack").onclick = () => {
 chemLabState.lifeMarks = { reproduction: "partial" };
 pulseSuccessFeedback(160);
 };
 } else {
 title.textContent = "Suspect 4 of 4: dormant seed";
 body.innerHTML = narrationHtml(
 "A dry seed looks inactive. Add water and watch the work cycle on the canvas: root, then shoot, then leaves opening - frame by frame. Life was paused, not missing.",
 );
 controls.innerHTML = `<button type="button" class="btn secondary tiny-pulse" id="life-water">Add water</button>`;
 controls.querySelector("#life-water").onclick = () => {
 chemLabState.lifeSeedWater = true;
 chemLabState.lifeSeedT0 = performance.now();
 const marks = {};
 MRS_GREN.forEach((t) => {
 marks[t.id] = true;
 });
 chemLabState.lifeMarks = marks;
 pulseSuccessFeedback(240);
 };
 }
 }

 go.onclick = () => {
 const i = chemLabState.lifeSuspect || 0;
 if (i === 0 && flameReady()) {
 chemLabState.lifeMarks = {
 ...chemLabState.lifeMarks,
 respiration: false,
 reproduction: false,
 };
 chemLabState.lifeFlameDone = true;
 chemLabState.lifeSuspect = 1;
 status.textContent = "5 out of 7. The 2 misses matter most: no cells, no true reproduction.";
 setStage();
 return;
 }
 if (i === 1 && chemLabState.lifeMarks?.growth) {
 chemLabState.lifeCrystalDone = true;
 chemLabState.lifeSuspect = 2;
 status.textContent = "1 out of 7. Not close.";
 setStage();
 return;
 }
 if (i === 2 && chemLabState.lifeMarks?.reproduction === "partial") {
 chemLabState.lifeVirusDone = true;
 chemLabState.lifeSuspect = 3;
 status.textContent = "Reproduces only by hijacking. Everything else: no, not on its own.";
 setStage();
 return;
 }
 if (i === 3 && chemLabState.lifeSeedWater && chemLabState.lifeSeedDone) {
 finish();
 }
 };

 iv = setInterval(() => {
 if (cancelled) return;
 const i = chemLabState.lifeSuspect || 0;
 if (i === 0 && flameReady()) {
 go.disabled = false;
 go.textContent = "Score this suspect ?";
 status.textContent = "All five flame behaviors are on the board.";
 }
 if (i === 1 && chemLabState.lifeMarks?.growth) {
 go.disabled = false;
 go.textContent = "Score this suspect ?";
 }
 if (i === 2 && chemLabState.lifeMarks?.reproduction === "partial") {
 go.disabled = false;
 go.textContent = "Score this suspect ?";
 }
 if (i === 3 && chemLabState.lifeSeedWater) {
 chemLabState.lifeSeedDone = true;
 go.disabled = false;
 go.textContent = "Continue ?";
 status.textContent = "It was not failing the checklist. It was paused, waiting for the right conditions.";
 }
 }, 160);
 setStage();
}

export function mountLifeScore(host, cfg) {
 const finish = once(() => cfg.onDone());
 let stage = "table";
 trackCleanup(() => {});
 chemLabState.phase = "table";
 playScene("lifeScore", { phase: "table" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 3: Iconic</div>
 <h3 id="life-sc-title">One clean scorecard</h3>
 <div id="life-sc-body"></div>
 <button type="button" class="btn primary" id="life-sc-go">The virus, formally ?</button>
 </div>`;
 const title = host.querySelector("#life-sc-title");
 const body = host.querySelector("#life-sc-body");
 const go = host.querySelector("#life-sc-go");
 body.innerHTML = `${narrationHtml(
 "Laid out like this, the picture becomes clear. Real living things do not just pass the checklist by accident here and there. They pass almost the entire thing, consistently, using their own internal machinery. Fire and crystals fake a trait or two through simple physics and chemistry, not biology.",
 )}<p class="tiny-onscreen">Living things do not just pass one or two checks by coincidence. They consistently pass nearly all seven, using their own cells, on their own terms.</p>`;
 go.onclick = () => {
 if (stage === "table") {
 stage = "virus";
 chemLabState.phase = "virus";
 playScene("lifeScore", { phase: "virus" });
 title.textContent = "On the border of life";
 body.innerHTML = `${narrationHtml(
 "Most biologists officially classify viruses as non-living, because they fail Respiration, Nutrition, Excretion, and independent Growth completely. They are essentially a set of genetic instructions in a protective shell, incapable of doing anything at all without hijacking a real living cell. Calling them on the edge of life is a fair way to describe them too.",
 )}<p class="tiny-onscreen">Viruses are usually classified as non-living: no metabolism of their own, and they can only reproduce by hijacking a living host.</p>
 <p class="tiny-onscreen">Some biologists prefer to call them on the border of life rather than firmly one or the other.</p>
 <p class="tiny-onscreen">This is not a gap in the checklist. It is the checklist doing exactly its job on a genuinely hard case.</p>`;
 go.textContent = "Continue ?";
 return;
 }
 finish();
 };
}

export function mountLifeMars(host, cfg) {
 const finish = once(() => cfg.onDone());
 let cancelled = false;
 let iv = null;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 });
 chemLabState.lifeMars = [null, null, null, null];
 chemLabState.lifeMarsI = 0;
 chemLabState.lifeMarsDone = false;
 chemLabState.lifeMarsOpt = false;
 playScene("lifeMars");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 4: Enactive</div>
 <h3 id="life-mars-title">Mars life-detector</h3>
 <div id="life-mars-body"></div>
 <p id="life-mars-status" class="drag-hint" aria-live="polite"></p>
 <div class="btn-row">
 <button type="button" class="btn secondary" data-flag="weak">Weak / inconclusive</button>
 <button type="button" class="btn secondary" data-flag="strong">Strong evidence</button>
 <button type="button" class="btn secondary" data-flag="none">No biological evidence</button>
 </div>
 <button type="button" class="btn primary" id="life-mars-go" disabled>Continue ?</button>
 <button type="button" class="btn secondary" id="life-mars-opt" hidden>Optional: warmed sample ?</button>
 </div>`;
 const title = host.querySelector("#life-mars-title");
 const body = host.querySelector("#life-mars-body");
 const status = host.querySelector("#life-mars-status");
 const go = host.querySelector("#life-mars-go");
 const opt = host.querySelector("#life-mars-opt");

 function showCase() {
 const i = chemLabState.lifeMarsI || 0;
 const item = LIFE_MARS[i];
 title.textContent = item.optional ? "Optional sensor" : `Sensor ${i + 1} of 3`;
 body.innerHTML = `${narrationHtml(
 "A Mars rover sends readings. You use the same MRS GREN checklist - there is no special alien rulebook. Look at the canvas: each sensor shows a clear picture of what was found. Flag it Weak, Strong, or No evidence.",
 )}<p class="tiny-onscreen"><strong>${item.title}.</strong> ${item.prompt}</p>
 <p class="tiny-onscreen">Hint: ${item.hint}</p>`;
 status.textContent = "Match the canvas picture to one flag below.";
 }

 host.querySelectorAll("[data-flag]").forEach((btn) => {
 btn.onclick = () => {
 const i = chemLabState.lifeMarsI || 0;
 const item = LIFE_MARS[i];
 if (btn.dataset.flag !== item.ok) {
 pulseFailFeedback(280);
 status.textContent = "Use MRS GREN. That flag does not fit this reading.";
 return;
 }
 const next = [...(chemLabState.lifeMars || [null, null, null, null])];
 next[i] = item.ok;
 chemLabState.lifeMars = next;
 pulseSuccessFeedback(200);
 status.textContent = "Same 7 questions. Same checklist. Just applied somewhere no one has checked in person.";
 if (item.optional) {
 chemLabState.lifeMarsOpt = true;
 go.disabled = false;
 return;
 }
 if (i < 2) {
 chemLabState.lifeMarsI = i + 1;
 showCase();
 } else {
 chemLabState.lifeMarsDone = true;
 go.disabled = false;
 opt.hidden = false;
 }
 };
 });
 opt.onclick = () => {
 chemLabState.lifeMarsI = 3;
 showCase();
 opt.hidden = true;
 };
 iv = setInterval(() => {
 if (cancelled) return;
 if (chemLabState.lifeMarsDone) go.disabled = false;
 }, 200);
 go.onclick = () => {
 if (!chemLabState.lifeMarsDone) return;
 finish();
 };
 showCase();
}

export function mountLifeStakes(host, cfg) {
 const finish = once(() => cfg.onDone());
 let stage = "montage";
 trackCleanup(() => {});
 chemLabState.phase = "montage";
 playScene("lifeStakes", { phase: "montage" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 4: Iconic</div>
 <h3 id="life-st-title">Why the line matters</h3>
 <div id="life-st-body"></div>
 <button type="button" class="btn primary" id="life-st-go">Keep the rule ?</button>
 </div>`;
 const title = host.querySelector("#life-st-title");
 const body = host.querySelector("#life-st-body");
 const go = host.querySelector("#life-st-go");
 body.innerHTML = `${narrationHtml(
 "Watch three real cases on the canvas. 1) Extremophiles in boiling vents are still alive by MRS GREN. 2) Antibiotics kill bacteria but fail on viruses - viruses are not living cells. 3) A robot vacuum moves and senses, but it is a machine, not an organism.",
 )}<p class="tiny-onscreen">Where you draw the alive / not-alive line changes medicine and the search for life in space.</p>`;
 go.onclick = () => {
 if (stage === "montage") {
 stage = "card";
 chemLabState.phase = "card";
 playScene("lifeStakes", { phase: "card" });
 title.textContent = "One checklist to keep";
 body.innerHTML = `${narrationHtml(
 "Keep this rule: something is alive if it can carry out essentially all seven MRS GREN traits using its own biology. Next question: what is the smallest unit inside a living thing that does that work?",
 )}<p class="tiny-onscreen"><strong>MRS GREN</strong> - Movement · Respiration · Sensitivity · Growth · Reproduction · Excretion · Nutrition</p>
 <p class="tiny-onscreen">Next hunt: the cell - the smallest living unit.</p>`;
 go.textContent = "Continue";
 return;
 }
 finish();
 };
}

export function mountCellZoom(host, cfg) {
 const finish = once(() => cfg.onDone());
 let cancelled = false;
 let iv = null;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 });
 chemLabState.cellZoomClick = 0;
 chemLabState.cellLeafClick = 0;
 chemLabState.cellView = "hand";
 playScene("cellZoom");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 1: Enactive</div>
 <h3>The Zoom Tool</h3>
 ${narrationHtml(
 "Zoom in far enough on your own skin, or on a leaf, and 'solid material' stops being the right way to describe it. What you're actually looking at is a packed city of individual living units.",
 )}
 <p class="drag-hint">Tap + three times on the hand. The leaf zoom is optional.</p>
 <div class="btn-row">
 <button type="button" class="btn secondary" id="cell-zoom-minus">-</button>
 <button type="button" class="btn primary tiny-pulse" id="cell-zoom-plus">+</button>
 </div>
 <div class="btn-row">
 <button type="button" class="btn secondary" id="cell-view-hand">Hand</button>
 <button type="button" class="btn secondary" id="cell-view-leaf">Optional: zoom a leaf ?</button>
 </div>
 <p id="cell-zoom-status" class="drag-hint" aria-live="polite">Zoom 0 of 3 on the hand.</p>
 <button type="button" class="btn primary" id="cell-zoom-go" disabled>Continue ?</button>
 </div>`;
 const status = host.querySelector("#cell-zoom-status");
 const go = host.querySelector("#cell-zoom-go");
 function bump(dir) {
 if (chemLabState.cellView === "leaf") {
 chemLabState.cellLeafClick = Math.max(0, Math.min(3, (chemLabState.cellLeafClick || 0) + dir));
 } else {
 chemLabState.cellZoomClick = Math.max(0, Math.min(3, (chemLabState.cellZoomClick || 0) + dir));
 }
 if (dir > 0) pulseSuccessFeedback(140);
 }
 host.querySelector("#cell-zoom-plus").onclick = () => bump(1);
 host.querySelector("#cell-zoom-minus").onclick = () => bump(-1);
 host.querySelector("#cell-view-hand").onclick = () => {
 chemLabState.cellView = "hand";
 };
 host.querySelector("#cell-view-leaf").onclick = () => {
 chemLabState.cellView = "leaf";
 };
 iv = setInterval(() => {
 if (cancelled) return;
 const n = chemLabState.cellZoomClick || 0;
 status.textContent =
 n >= 3
 ? "You're not looking at skin anymore. You're looking at a city: millions of individual cells, packed wall to wall."
 : `Zoom ${n} of 3 on the hand.${chemLabState.cellView === "leaf" ? " Leaf zoom is extra." : ""}`;
 if (n >= 3) go.disabled = false;
 }, 160);
 go.onclick = () => finish();
}

export function mountCellCompare(host, cfg) {
 const finish = once(() => cfg.onDone());
 let stage = "see";
 trackCleanup(() => {});
 chemLabState.phase = "see";
 playScene("cellGrid", { phase: "see" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 1: Iconic</div>
 <h3 id="cell-cmp-title">City block ? single cell</h3>
 <div id="cell-cmp-body"></div>
 <button type="button" class="btn primary" id="cell-cmp-go">Lock cell theory ?</button>
 </div>`;
 const title = host.querySelector("#cell-cmp-title");
 const body = host.querySelector("#cell-cmp-body");
 const go = host.querySelector("#cell-cmp-go");
 body.innerHTML = `${narrationHtml(
 "Every block in a city could technically survive alone for a little while, but a city only really works because thousands of blocks cooperate, share resources, and specialize. A body works the exact same way, except the blocks are cells, and there isn't just thousands. There's trillions of them, in you alone.",
 )}<p class="tiny-onscreen">City block ? single cell. Both: a complete, self-contained unit, that only works because thousands of them cooperate.</p>`;
 go.onclick = () => {
 if (stage === "see") {
 stage = "theory";
 chemLabState.phase = "theory";
 playScene("cellGrid", { phase: "theory" });
 title.textContent = "Cell theory";
 body.innerHTML = `${narrationHtml(
 "These three rules are called cell theory, and they're one of the most important ideas in all of biology. A cell is simply the smallest complete unit of a living thing.",
 )}${CELL_THEORY.map((line, i) => `<p class="tiny-onscreen"><strong>${i + 1}.</strong> ${line}.</p>`).join("")}`;
 go.textContent = "Continue ?";
 return;
 }
 finish();
 };
}

export function mountCellTour(host, cfg) {
 const finish = once(() => cfg.onDone());
 let cancelled = false;
 let iv = null;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 });
 chemLabState.cellTour = {};
 chemLabState.cellTourStop = null;
 chemLabState.cellTourDone = false;
 playScene("cellTour");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 2: Enactive</div>
 <h3>Tour the city</h3>
 ${narrationHtml(
 "None of these six workers could do the whole job alone. A cell only works because all six of these jobs run at once, constantly, in cooperation.",
 )}
 <p class="drag-hint">Visit all six zones. You can replay any stop afterward.</p>
 <div class="chip-bank" id="cell-tour-bank"></div>
 <p id="cell-tour-status" class="drag-hint" aria-live="polite">0 of 6 stops visited.</p>
 <button type="button" class="btn primary" id="cell-tour-go" disabled>Continue ?</button>
 </div>`;
 const bank = host.querySelector("#cell-tour-bank");
 const status = host.querySelector("#cell-tour-status");
 const go = host.querySelector("#cell-tour-go");
 bank.innerHTML = CELL_ORGANELLES.map(
 (o) => `<button type="button" class="chip" data-dept="${o.id}">${o.city}</button>`,
 ).join("");
 bank.querySelectorAll("[data-dept]").forEach((btn) => {
 btn.onclick = () => {
 const id = btn.dataset.dept;
 const item = CELL_ORGANELLES.find((o) => o.id === id);
 chemLabState.cellTourStop = id;
 chemLabState.cellTour = { ...chemLabState.cellTour, [id]: true };
 pulseSuccessFeedback(180);
 const n = Object.keys(chemLabState.cellTour).length;
 if (CELL_ORGANELLES.every((o) => chemLabState.cellTour[o.id])) {
 chemLabState.cellTourDone = true;
 go.disabled = false;
 }
 status.textContent = `${n} of 6. ${item.city} (${item.name}): ${item.cityLine}.`;
 };
 });
 iv = setInterval(() => {
 if (cancelled) return;
 if (chemLabState.cellTourDone) go.disabled = false;
 }, 160);
 go.onclick = () => finish();
}

export function mountCellMorph(host, cfg) {
 const finish = once(() => cfg.onDone());
 let stage = "morph";
 trackCleanup(() => {});
 chemLabState.phase = "morph";
 playScene("cellMorph", { phase: "morph" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 2: Iconic</div>
 <h3 id="cell-mo-title">The city map is a way in</h3>
 <div id="cell-mo-body"></div>
 <button type="button" class="btn primary" id="cell-mo-go">Formal names ?</button>
 </div>`;
 const title = host.querySelector("#cell-mo-title");
 const body = host.querySelector("#cell-mo-body");
 const go = host.querySelector("#cell-mo-go");
 body.innerHTML = `${narrationHtml(
 "The city map isn't a replacement for the real diagram. It's a way into it. Every real organelle you'll see on any biology diagram from now on maps directly onto a job you already understand.",
 )}<p class="tiny-onscreen">City Hall ? Nucleus. Power Plant ? Mitochondria. Factory ? Ribosome. Highway ? Endoplasmic Reticulum. Post Office ? Golgi Apparatus. City Wall ? Cell Membrane.</p>`;
 go.onclick = () => {
 if (stage === "morph") {
 stage = "card";
 chemLabState.phase = "card";
 playScene("cellMorph", { phase: "card" });
 title.textContent = "Organelles";
 body.innerHTML = `${narrationHtml(
 "Every one of these structures has a formal name: an organelle, meaning 'little organ,' since each does one specific job for the whole cell.",
 )}${CELL_ORGANELLES.map((o) => `<p class="tiny-onscreen"><strong>${o.name}</strong> - ${o.def}.</p>`).join("")}
 <p class="tiny-onscreen">Each of these structures inside a cell is called an organelle, literally 'little organ.'</p>`;
 go.textContent = "Continue ?";
 return;
 }
 finish();
 };
}

export function mountCellPlant(host, cfg) {
 const finish = once(() => cfg.onDone());
 let cancelled = false;
 let iv = null;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 });
 chemLabState.cellPlant = {};
 chemLabState.cellPlantPick = null;
 chemLabState.cellPlantDone = false;
 playScene("cellPlant");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 3: Enactive</div>
 <h3>Upgrade the city</h3>
 ${narrationHtml(
 "This city just got three new residents that only some cities have. Let's add them and see what changes. Notice this new city didn't lose anything. Those three additions are the entire difference between an animal cell and a plant cell.",
 )}
 <p class="drag-hint">Tap an add-on, then its place on the city. All three required.</p>
 <div class="chip-bank" id="cell-plant-bank"></div>
 <div class="btn-row">
 <button type="button" class="btn secondary" data-drop="wall">Outer wall</button>
 <button type="button" class="btn secondary" data-drop="chloro">Scatter solar panels</button>
 <button type="button" class="btn secondary" data-drop="vacuole">Center tank</button>
 </div>
 <p id="cell-plant-status" class="drag-hint" aria-live="polite">0 of 3 placed.</p>
 <button type="button" class="btn primary" id="cell-plant-go" disabled>Continue ?</button>
 </div>`;
 const bank = host.querySelector("#cell-plant-bank");
 const status = host.querySelector("#cell-plant-status");
 const go = host.querySelector("#cell-plant-go");
 function renderBank() {
 bank.innerHTML = CELL_PLANT_ADDONS.filter((p) => !chemLabState.cellPlant[p.id])
 .map((p) => `<button type="button" class="chip" data-addon="${p.id}">${p.name}</button>`)
 .join("");
 bank.querySelectorAll("[data-addon]").forEach((btn) => {
 btn.onclick = () => {
 chemLabState.cellPlantPick = btn.dataset.addon;
 bank.querySelectorAll(".chip").forEach((el) => el.classList.toggle("chip--selected", el === btn));
 };
 });
 }
 let lastN = 0;
 function place(zone) {
 const id = chemLabState.cellPlantPick;
 if (!id) {
 status.textContent = "Tap an add-on first.";
 return;
 }
 const item = CELL_PLANT_ADDONS.find((p) => p.id === id);
 if (item.drop !== zone) {
 pulseFailFeedback(260);
 chemLabState.prompt = "That add-on belongs on a different part of the city.";
 status.textContent = chemLabState.prompt;
 return;
 }
 chemLabState.prompt = "";
 chemLabState.cellPlant = { ...chemLabState.cellPlant, [id]: true };
 chemLabState.cellPlantPick = null;
 pulseSuccessFeedback(200);
 lastN = Object.keys(chemLabState.cellPlant).length;
 if (CELL_PLANT_ADDONS.every((p) => chemLabState.cellPlant[p.id])) chemLabState.cellPlantDone = true;
 status.textContent = chemLabState.cellPlantDone
 ? "Same City Hall, Power Plants, Factories, Highway, Post Office, and Wall. Plus three new residents."
 : `${lastN} of 3. ${item.hint}`;
 if (chemLabState.cellPlantDone) go.disabled = false;
 renderBank();
 }
 host.querySelectorAll("[data-drop]").forEach((btn) => {
 btn.onclick = () => place(btn.dataset.drop);
 });
 renderBank();
 iv = setInterval(() => {
 if (cancelled) return;
 if (chemLabState.cellPlantDone) {
 go.disabled = false;
 return;
 }
 if (chemLabState.prompt) {
 status.textContent = chemLabState.prompt;
 return;
 }
 const n = Object.keys(chemLabState.cellPlant || {}).length;
 if (n !== lastN) {
 lastN = n;
 status.textContent = `${n} of 3 placed.`;
 }
 }, 160);
 go.onclick = () => finish();
}

export function mountCellPair(host, cfg) {
 const finish = once(() => cfg.onDone());
 let stage = "pair";
 trackCleanup(() => {});
 chemLabState.phase = "pair";
 playScene("cellPair", { phase: "pair" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 3: Iconic</div>
 <h3 id="cell-pair-title">Same core team</h3>
 <div id="cell-pair-body"></div>
 <button type="button" class="btn primary" id="cell-pair-go">Build the table ?</button>
 </div>`;
 const title = host.querySelector("#cell-pair-title");
 const body = host.querySelector("#cell-pair-body");
 const go = host.querySelector("#cell-pair-go");
 body.innerHTML = `${narrationHtml(
 "A plant doesn't need to move around to find food the way an animal does, so its cells come equipped to make their own food from sunlight, store huge reserves of water, and hold a firm, rigid shape without a skeleton.",
 )}<p class="tiny-onscreen">Same core team. Three new specialists. One key difference in shape: plant cells are rigid boxes, animal cells are soft and round.</p>`;
 go.onclick = () => {
 if (stage === "pair") {
 stage = "table";
 chemLabState.phase = "table";
 playScene("cellPair", { phase: "table" });
 title.textContent = "Animal cell vs plant cell";
 body.innerHTML = `${narrationHtml(
 "Chloroplasts are where photosynthesis happens: turning sunlight, water, and carbon dioxide directly into food. Pair that with mitochondria, which every cell has: chloroplasts make food from sunlight, mitochondria release energy from that food. Plant cells often get to run both. Animal cells rely on mitochondria alone.",
 )}<p class="tiny-onscreen">Shared: nucleus, mitochondria, ribosomes, ER, Golgi, membrane.</p>
 <p class="tiny-onscreen">Plant only: cell wall (rigid, for structure and protection), chloroplasts (photosynthesis), large central vacuole (storage and shape).</p>
 <p class="tiny-onscreen">Animal cells have small vacuoles only, not one huge central tank.</p>`;
 go.textContent = "Continue ?";
 return;
 }
 finish();
 };
}

export function mountCellLine(host, cfg) {
 const finish = once(() => cfg.onDone());
 let cancelled = false;
 let iv = null;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 });
 chemLabState.cellLineStep = 0;
 chemLabState.cellLineDone = false;
 chemLabState.prompt = "";
 playScene("cellLine");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 4: Enactive</div>
 <h3>Run the production line</h3>
 ${narrationHtml(
 "City Hall just posted an order: Build Protein X. Send it through the departments in working order. A wrong stop gets a gentle 'not yet,' not a harsh fail.",
 )}
 <p class="drag-hint">Nucleus ? Ribosome ? ER ? Golgi ? Membrane.</p>
 <div class="chip-bank" id="cell-line-bank"></div>
 <p id="cell-line-status" class="drag-hint" aria-live="polite">Order waiting at City Hall.</p>
 <button type="button" class="btn primary" id="cell-line-go" disabled>Continue ?</button>
 </div>`;
 const bank = host.querySelector("#cell-line-bank");
 const status = host.querySelector("#cell-line-status");
 const go = host.querySelector("#cell-line-go");
 bank.innerHTML = CELL_ORGANELLES.map(
 (o) => `<button type="button" class="chip" data-dept="${o.id}">${o.city}</button>`,
 ).join("");
 function send(toId) {
 const step = CELL_LINE[chemLabState.cellLineStep || 0];
 if (!step || chemLabState.cellLineDone) return;
 if (toId !== step.to) {
 pulseFailFeedback(240);
 chemLabState.prompt = "That department isn't ready for this yet.";
 status.textContent = chemLabState.prompt;
 return;
 }
 chemLabState.cellLineStep = (chemLabState.cellLineStep || 0) + 1;
 pulseSuccessFeedback(200);
 chemLabState.prompt = step.caption;
 status.textContent = step.caption;
 if (chemLabState.cellLineStep >= CELL_LINE.length) {
 chemLabState.cellLineDone = true;
 go.disabled = false;
 }
 }
 bank.querySelectorAll("[data-dept]").forEach((btn) => {
 btn.onclick = () => send(btn.dataset.dept);
 });
 iv = setInterval(() => {
 if (cancelled) return;
 if (chemLabState.cellLineDone) {
 status.textContent =
 "You just completed one full round of a real process every living cell performs constantly, thousands of times a day: making and shipping a protein.";
 go.disabled = false;
 } else if (chemLabState.prompt) {
 status.textContent = chemLabState.prompt;
 }
 }, 160);
 go.onclick = () => finish();
}

export function mountCellScale(host, cfg) {
 const finish = once(() => cfg.onDone());
 let stage = "zoom";
 trackCleanup(() => {});
 chemLabState.phase = "zoom";
 playScene("cellScale", { phase: "zoom" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 4: Iconic</div>
 <h3 id="cell-sc-title">Some cities merge. Some stay city-states.</h3>
 <div id="cell-sc-body"></div>
 <button type="button" class="btn primary" id="cell-sc-go">Name the two strategies ?</button>
 </div>`;
 const title = host.querySelector("#cell-sc-title");
 const body = host.querySelector("#cell-sc-body");
 const go = host.querySelector("#cell-sc-go");
 body.innerHTML = `${narrationHtml(
 "Most of the cells you've met today are team players. They group into tissues, tissues group into organs, and organs group into an entire organism. But some organisms are just one single cell, doing every single job entirely on its own. Both strategies work.",
 )}<p class="tiny-onscreen">Cell ? Tissue ? Organ ? Organism. Some cities merge into countries. Some stay proud, independent city-states.</p>`;
 go.onclick = () => {
 if (stage === "zoom") {
 stage = "card";
 chemLabState.phase = "card";
 playScene("cellScale", { phase: "card" });
 title.textContent = "Unicellular and multicellular";
 body.innerHTML = `${narrationHtml(
 "Whether an organism is unicellular, running its entire life from one single cell, or multicellular, built from trillions of cooperating cells like you are, it all comes back to the exact same basic unit.",
 )}<p class="tiny-onscreen"><strong>Unicellular</strong> - an organism made of just one single cell (e.g., bacteria, amoeba).</p>
 <p class="tiny-onscreen"><strong>Multicellular</strong> - an organism made of many cells working together (e.g., you, a tree, a mushroom).</p>
 <p class="tiny-onscreen">Next question worth hunting: when City Hall's instructions get damaged or copied incorrectly, what actually happens to the whole city?</p>`;
 go.textContent = "Continue ?";
 return;
 }
 finish();
 };
}

