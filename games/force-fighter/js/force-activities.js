/**
 * Force Fighter activity mounts - panel + canvas share forceLabState / intents.
 */
import { scaledDwellMs } from "/engine/js/timings.js";
import { clearConceptViz } from "/engine/js/concept-viz.js";
import {
 ATOM_ASSET_PATHS,
 chemLabState,
 setHeatTarget,
 pulseFailFeedback,
 pulseSuccessFeedback,
} from "./force-state.js?v=pairvis6";
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
 const session = createActivitySession({ phase: cfg.beats[0]?.sceneArgs?.phase || "desk" });

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
 <p class="lab-demo__timer" id="chain-msg" aria-live="polite">Watch / interact with the canvas…</p>
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

/** Force dial (shared HeatLab shell) - defaults are push/pull, not melt chemistry. */
export function mountHeatLab(host, cfg) {
 const finish = once(() => cfg.onDone());
 const startH = cfg.startHeat ?? 0.12;
 const threshold = cfg.threshold ?? 0.78;
 const axis = cfg.axis || "y";
 const canvasAction = cfg.canvasAction || "stretch";
 const sliderLabel = cfg.sliderLabel || "Push / pull strength";
 const session = createActivitySession({ heat: startH, energy: startH });
 chemLabState.heat = startH;
 chemLabState.energy = startH;
 setHeatTarget(startH);
 playScene(cfg.scene, { heat: startH, energy: startH, ...(cfg.sceneArgs || {}) });

 host.innerHTML = `
 <div class="chem-card chem-heat">
 ${badgeHtml(cfg.badge || ATOM_ASSET_PATHS.rock, "force lab")}
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
 <p class="chem-heat__readout" id="chem-heat-read" aria-live="polite">Gentle</p>
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
 if (cfg.syncKey === "ropeT") chemLabState.ropeT = h;
 if (cfg.syncKey === "pairGap") {
 chemLabState.pairGap = 1 - h;
 chemLabState.recoil = h;
 }
 session.dispatch({ type: "SET_HEAT", value: h });
 const phase = heatPhase(h);
 const labels = cfg.readoutLabels || {
 cold: "Gentle - barely changing motion",
 melting: "Building - motion starting to change",
 liquid: "Strong - clear push or pull",
 simmer: "Peak - force clearly wins",
 };
 read.textContent = labels[phase] || "Working…";
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
 const sliderLabel = cfg.sliderLabel || "Force story scale";
 const goalText = cfg.goalText || "Scrub the dial - canvas follows the same story order.";
 const readoutLabels = cfg.readoutLabels || {
 low: "Everyday push / pull",
 mid: "Force arrows & magnitudes",
 high: "Named law / pair rule",
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

/** Alias - prefer this name in force levels (same dial shell). */
export const mountForceDial = mountHeatLab;

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
 playScene(cfg.passScene || cfg.scene || "rockMastery");
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
 playScene(cfg.scene || "rockDrill", { prompt: chemLabState.prompt, flashColor: chemLabState.flashColor });
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
 playScene(cfg.scene || "rockMyth", { myth: m.sceneMyth });
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
 playScene(cfg.scene || "rockSpiral");
 const stops = cfg.stops || [
 { n: 1, label: "1: Still / move" },
 { n: 2, label: "2: Inertia" },
 { n: 3, label: "3: Newton 1" },
 { n: 4, label: "4: Why it matters" },
 ];
 const finishLabel = cfg.finishLabel || "Finish The Lazy Rock ▶";
 const statusIdle = cfg.statusIdle || "Tap a number to replay, or finish now.";
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">${cfg.badge || "Closing"}</div>
 <h3>${cfg.title || "Your recap map"}</h3>
 ${narrationHtml(
 cfg.narration ||
 "This last screen is a recap, not a new puzzle. The four numbers are the four loops you already finished. Tap a number (on the canvas or here) to replay a short highlight. When you are ready, tap Finish The Lazy Rock.",
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
 const el = host.querySelector("#spiral-status");
 if (el) el.textContent = `Replaying spiral ${n}. Tap another number, or ${finishLabel.replace(" ▶", "")}.`;
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

export function mountRockPoke(host, cfg) {
 const finish = once(() => cfg.onDone());
 const arena = window.__arena;
 let cancelled = false;
 let stage = "rock";
 let iv = null;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 arena?.setIntentHandler?.(null);
 });
 chemLabState.rockKind = "rock";
 chemLabState.rockX = 0.38;
 chemLabState.rockVx = 0;
 chemLabState.rockPushed = false;
 chemLabState.rockTapTried = false;
 chemLabState.rockBallPushed = false;
 playScene("rockPoke");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 1: Enactive</div>
 <h3 id="rock-poke-title">Poke the rock</h3>
 <div id="rock-poke-body"></div>
 <p id="rock-poke-status" class="drag-hint" aria-live="polite"></p>
 <button type="button" class="btn secondary" id="rock-poke-shove">Give a shove →</button>
 <button type="button" class="btn primary" id="rock-poke-go" disabled>Now try a ball ▶</button>
 </div>`;
 const title = host.querySelector("#rock-poke-title");
 const body = host.querySelector("#rock-poke-body");
 const status = host.querySelector("#rock-poke-status");
 const go = host.querySelector("#rock-poke-go");
 const shove = host.querySelector("#rock-poke-shove");
 function applyShove() {
 const kind = chemLabState.rockKind || "rock";
 const mass = kind === "ball" ? 0.32 : 1;
 const v = (kind === "ball" ? 0.085 : 0.038) / mass * 0.45;
 if (kind === "ball") {
 chemLabState.rockBallVx = v;
 chemLabState.rockBallPushed = true;
 } else {
 chemLabState.rockVx = v;
 chemLabState.rockPushed = true;
 chemLabState.rockDust = 12;
 }
 pulseSuccessFeedback(280);
 }
 shove.onclick = () => applyShove();
 function render() {
 if (stage === "rock") {
 title.textContent = "Poke the rock";
 body.innerHTML = narrationHtml(
 "Two totally different results will come from a similar push. First the rock: a light tap will not do it. Click and drag across it to actually push.",
 );
 status.textContent = "Drag across the rock. Watch it slide, then slow on the grass.";
 go.disabled = true;
 go.textContent = "Now try a ball ▶";
 chemLabState.rockKind = "rock";
 playScene("rockPoke");
 } else {
 chemLabState.rockKind = "ball";
 chemLabState.rockBallX = 0.38;
 chemLabState.rockBallVx = 0;
 playScene("rockPoke");
 title.textContent = "Now try a ball";
 body.innerHTML = narrationHtml(
 "Same kind of push. The ball shoots off and keeps rolling much farther. Whatever is happening here is not just about the push. It is also about the object being pushed.",
 );
 status.textContent = "Drag to push the ball.";
 go.disabled = true;
 go.textContent = "Continue ▶";
 }
 }
 render();
 iv = setInterval(() => {
 if (cancelled) return;
 if (stage === "rock" && chemLabState.rockPushed) {
 status.textContent = "You pushed it, it moved. You stopped pushing, it eventually stopped.";
 go.disabled = false;
 }
 if (stage === "ball" && chemLabState.rockBallPushed) {
 status.textContent = "The rock barely budged. The ball kept rolling. Your hands found something worth explaining.";
 go.disabled = false;
 }
 }, 140);
 go.onclick = () => {
 if (stage === "rock") {
 stage = "ball";
 render();
 return;
 }
 finish();
 };
}

export function mountRockStates(host, cfg) {
 const finish = once(() => cfg.onDone());
 let stage = "replay";
 trackCleanup(() => {});
 chemLabState.phase = "replay";
 playScene("rockStates", { phase: "replay" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 1: Iconic</div>
 <h3 id="rock-st-title">The push ends. The state keeps going.</h3>
 <div id="rock-st-body"></div>
 <button type="button" class="btn primary" id="rock-st-go">Name the states ▶</button>
 </div>`;
 const title = host.querySelector("#rock-st-title");
 const body = host.querySelector("#rock-st-body");
 const go = host.querySelector("#rock-st-go");
 body.innerHTML = narrationHtml(
 "After you stop pushing, the object does not need anything else to keep doing what it is doing. The rock kept sliding a bit after your hand let go. The ball kept rolling long after that. Staying still and staying in motion turn out to be surprisingly similar: both are an object continuing on its own, undisturbed, until something else steps in.",
 );
 go.onclick = () => {
 if (stage === "replay") {
 stage = "words";
 chemLabState.phase = "words";
 playScene("rockStates", { phase: "words" });
 title.textContent = "One word: state of motion";
 body.innerHTML = `${narrationHtml(
 "Physicists lump both of these together under one term: an object's state of motion. Whether that state is sitting still or moving steadily, it is still just one state. Changing it, in either direction, is the thing that needs an explanation.",
 )}<p class="tiny-onscreen">State of rest: not moving, staying put.</p>
 <p class="tiny-onscreen">State of motion: moving steadily in some direction.</p>
 <p class="tiny-onscreen">Changing either one requires something to cause the change.</p>`;
 go.textContent = "Continue ▶";
 return;
 }
 finish();
 };
}

export function mountRockEffort(host, cfg) {
 const finish = once(() => cfg.onDone());
 let cancelled = false;
 let stage = "start";
 const needStop = [18, 90, 42];
 trackCleanup(() => {
 cancelled = true;
 });
 chemLabState.phase = "start";
 chemLabState.rockPushI = 0;
 chemLabState.rockPushDone = [false, false, false];
 chemLabState.rockCharge = 0;
 playScene("rockEffort", { phase: "start" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 2: Enactive</div>
 <h3 id="rock-ef-title">Same push, three objects</h3>
 <div id="rock-ef-body"></div>
 <p id="rock-ef-status" class="drag-hint" aria-live="polite">Hold Push to charge, then release on the highlighted object: ball, then brick, then football.</p>
 <button type="button" class="btn secondary" id="rock-ef-push">Hold to push</button>
 <button type="button" class="btn primary" id="rock-ef-go" disabled>Now try stopping them ▶</button>
 </div>`;
 const title = host.querySelector("#rock-ef-title");
 const body = host.querySelector("#rock-ef-body");
 const status = host.querySelector("#rock-ef-status");
 const pushBtn = host.querySelector("#rock-ef-push");
 const go = host.querySelector("#rock-ef-go");
 body.innerHTML = narrationHtml(
 "Notice the pattern: a small ball rolls far, a heavy brick barely budges, and a football looks big but is full of air so it moves more than the brick. Size is not the same as mass. The more mass something has, the more it resists both starting and stopping.",
 );
 let holdIv = null;
 pushBtn.onmousedown = pushBtn.ontouchstart = (ev) => {
 ev.preventDefault();
 if (stage !== "start") {
 chemLabState.rockBraking = true;
 return;
 }
 holdIv = setInterval(() => {
 chemLabState.rockCharge = Math.min(1, (chemLabState.rockCharge || 0) + 0.05);
 }, 40);
 };
 function releaseStart() {
 if (holdIv) {
 clearInterval(holdIv);
 holdIv = null;
 }
 if (stage === "start") {
 const i = chemLabState.rockPushI || 0;
 if ((chemLabState.rockCharge || 0) < 0.55) {
 status.textContent = "Charge the push a bit more, then release.";
 pulseFailFeedback(280);
 chemLabState.rockCharge = 0;
 return;
 }
 const done = (chemLabState.rockPushDone || [false, false, false]).slice();
 done[i] = true;
 chemLabState.rockPushDone = done;
 chemLabState.rockCharge = 0;
 pulseSuccessFeedback(240);
 const names = ["Ball: rolls far.", "Brick: barely moves.", "Football: looks big, but it is full of air."];
 status.textContent = `Same push. ${names[i]}`;
 if (i < 2) chemLabState.rockPushI = i + 1;
 else go.disabled = false;
 } else {
 chemLabState.rockBraking = false;
 const i = chemLabState.rockStopI || 0;
 const tick = chemLabState.rockStopTick || 0;
 if (tick < needStop[i]) {
 status.textContent = "Keep holding. The brick takes more stopping effort than the ball or the football.";
 return;
 }
 const done = (chemLabState.rockStopDone || [false, false, false]).slice();
 done[i] = true;
 chemLabState.rockStopDone = done;
 pulseSuccessFeedback(240);
 status.textContent = `Stopping effort used: ${tick}. ${["Ball stopped quickly.", "Brick took the most.", "Football took a medium amount."][i]}`;
 chemLabState.rockStopTick = 0;
 if (i < 2) chemLabState.rockStopI = i + 1;
 else go.disabled = false;
 }
 }
 pushBtn.onmouseup = pushBtn.onmouseleave = pushBtn.ontouchend = () => releaseStart();
 go.onclick = () => {
 if (cancelled) return;
 if (stage === "start") {
 stage = "stop";
 chemLabState.phase = "stop";
 chemLabState.rockStopI = 0;
 chemLabState.rockStopDone = [false, false, false];
 chemLabState.rockStopTick = 0;
 chemLabState.rockBraking = false;
 playScene("rockEffort", { phase: "stop" });
 title.textContent = "Now try stopping them";
 body.innerHTML = narrationHtml(
 "The brick is not being difficult on purpose. It is lazy about changing, because it has more mass. The football fooled the eye. The nickname is about stubbornness, and that stubbornness has a real name coming next.",
 );
 pushBtn.textContent = "Hold to brake";
 status.textContent = "Each one is already rolling at the same speed. Hold brake until it stops.";
 go.disabled = true;
 go.textContent = "Continue ▶";
 return;
 }
 finish();
 };
}

export function mountRockInertia(host, cfg) {
 const finish = once(() => cfg.onDone());
 let stage = "bus";
 let cancelled = false;
 let iv = null;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 });
 chemLabState.phase = "bus";
 chemLabState.rockBusMode = "idle";
 chemLabState.rockBusT0 = 0;
 chemLabState.rockBusStarted = false;
 chemLabState.rockBusBraked = false;
 playScene("rockInertia", { phase: "bus" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 2: Iconic</div>
 <h3 id="rock-in-title">Feel it on the bus</h3>
 <div id="rock-in-body"></div>
 <p id="rock-in-status" class="drag-hint" aria-live="polite">Start the bus, then brake. Watch the passenger.</p>
 <div class="btn-row">
 <button type="button" class="btn secondary" id="rock-in-start">Start the bus</button>
 <button type="button" class="btn secondary" id="rock-in-brake">Brake the bus</button>
 </div>
 <button type="button" class="btn primary" id="rock-in-go" disabled>Name it ▶</button>
 </div>`;
 const title = host.querySelector("#rock-in-title");
 const body = host.querySelector("#rock-in-body");
 const status = host.querySelector("#rock-in-status");
 const go = host.querySelector("#rock-in-go");
 body.innerHTML = `${narrationHtml(
 "When a bus starts, your body tries to stay still, so you slide back. When it brakes, your body tries to keep moving, so you lurch forward. That stubbornness is the same thing the brick showed: a refusal to change motion unless a force makes it.",
 )}<p class="tiny-onscreen">Still wants to stay still. Moving wants to keep moving. Both are inertia.</p>`;
 const startBtn = host.querySelector("#rock-in-start");
 const brakeBtn = host.querySelector("#rock-in-brake");
 startBtn.onclick = () => {
 chemLabState.rockBusMode = "start";
 chemLabState.rockBusT0 = performance.now();
 chemLabState.rockBusStarted = true;
 pulseSuccessFeedback(220);
 status.textContent = "You slid back. Your body wanted to stay at rest. Now brake.";
 };
 brakeBtn.onclick = () => {
 if (!chemLabState.rockBusStarted) {
 status.textContent = "Start the bus first, then brake.";
 pulseFailFeedback(280);
 return;
 }
 chemLabState.rockBusMode = "brake";
 chemLabState.rockBusT0 = performance.now();
 chemLabState.rockBusBraked = true;
 pulseSuccessFeedback(220);
 status.textContent = "You lurched forward. Your body wanted to keep moving.";
 };
 iv = setInterval(() => {
 if (cancelled || stage !== "bus") return;
 if (chemLabState.rockBusStarted && chemLabState.rockBusBraked) {
 go.disabled = false;
 status.textContent = "You felt both kinds of stubbornness. Now we can name it.";
 }
 }, 160);
 go.onclick = () => {
 if (stage === "bus") {
 stage = "word";
 chemLabState.phase = "word";
 playScene("rockInertia", { phase: "word" });
 title.textContent = "Inertia";
 body.innerHTML = `${narrationHtml(
 "Physicists call this stubbornness inertia. It is not a strange invisible force fighting you. It is a property that comes bundled with mass, automatically. The more massive something is, the more inertia it has. A brick has more than a ball. A football looks big, but air does not add much mass. Our lazy rock is lazy because it is massive.",
 )}<p class="tiny-onscreen">Inertia: an object's natural tendency to resist any change to its state of motion.</p>
 <p class="tiny-onscreen">More mass = more inertia.</p>
 <p class="tiny-onscreen">Inertia is not a force pushing back. It is a property every object has, just by having mass.</p>`;
 if (startBtn) startBtn.style.display = "none";
 if (brakeBtn) brakeBtn.style.display = "none";
 if (status) status.style.display = "none";
 go.disabled = false;
 go.textContent = "Continue ▶";
 return;
 }
 finish();
 };
}

export function mountRockIce(host, cfg) {
 const finish = once(() => cfg.onDone());
 const arena = window.__arena;
 let cancelled = false;
 let iv = null;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 arena?.setIntentHandler?.(null);
 });
 chemLabState.rockIce = true;
 chemLabState.rockGravelOn = false;
 chemLabState.rockIcePushed = false;
 chemLabState.rockVx = 0;
 chemLabState.rockWorld = 0;
 playScene("rockIce");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 3: Enactive</div>
 <h3>The frictionless push</h3>
 ${narrationHtml(
 "On the ICE page, the rock does not slow down at all. It just keeps going, in a straight line, at the same speed. That is the true, pure behavior of inertia with nothing else interfering. Flip to the GRAVEL page and it stops, but not because it ran out of motion. It stops because friction, a real outside force, quietly acted on it the whole time.",
 )}
 <p id="rock-ice-status" class="drag-hint" aria-live="polite">Push on the ice page first. Then flip Ice / Gravel mid-slide.</p>
 <div class="btn-row">
 <button type="button" class="btn secondary" id="rock-ice-push">Push on ice →</button>
 <button type="button" class="btn secondary" id="rock-ice-tog">Ice ⇄ Gravel</button>
 </div>
 <button type="button" class="btn primary" id="rock-ice-go" disabled>Continue ▶</button>
 </div>`;
 const status = host.querySelector("#rock-ice-status");
 const tog = host.querySelector("#rock-ice-tog");
 const go = host.querySelector("#rock-ice-go");
 const pushIce = host.querySelector("#rock-ice-push");
 pushIce.onclick = () => {
 chemLabState.rockVx = 0.028;
 chemLabState.rockIcePushed = true;
 pulseSuccessFeedback(240);
 status.textContent = "It keeps gliding. Now flip Ice / Gravel and watch it slow.";
 };
 tog.onclick = () => {
 if (!chemLabState.rockIcePushed) {
 status.textContent = "Push it on ice first, then flip the surface.";
 pulseFailFeedback(280);
 return;
 }
 chemLabState.rockGravelOn = !chemLabState.rockGravelOn;
 chemLabState.rockIce = !chemLabState.rockGravelOn;
 status.textContent = chemLabState.rockGravelOn
 ? "Gravel is back. Friction is the outside force that was missing on ice."
 : "Ice again. No friction, so no reason to slow down.";
 pulseSuccessFeedback(180);
 };
 iv = setInterval(() => {
 if (cancelled) return;
 if (chemLabState.rockIcePushed && chemLabState.rockGravelOn) {
 status.textContent = "Every lazy-rock stop you have seen in real life was never really on its own.";
 go.disabled = false;
 } else if (chemLabState.rockIcePushed) {
 status.textContent = "It keeps gliding. Now flip Ice / Gravel and watch it slow.";
 }
 }, 160);
 go.onclick = () => finish();
}

export function mountRockNewton(host, cfg) {
 const finish = once(() => cfg.onDone());
 let stage = "space";
 let cancelled = false;
 let iv = null;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 });
 chemLabState.phase = "space";
 chemLabState.rockNudgeSpace = false;
 chemLabState.rockNudgeTable = false;
 chemLabState.rockSpaceX = 0.2;
 chemLabState.rockTableX = 0.68;
 chemLabState.rockSpaceVx = 0;
 chemLabState.rockTableVx = 0;
 playScene("rockNewton", { phase: "space" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 3: Iconic</div>
 <h3 id="rock-n-title">Space vs a table</h3>
 <div id="rock-n-body"></div>
 <p id="rock-n-status" class="drag-hint" aria-live="polite">Nudge the wrench in space, then the puck on the table.</p>
 <div class="btn-row">
 <button type="button" class="btn secondary" id="rock-n-space">Nudge in space</button>
 <button type="button" class="btn secondary" id="rock-n-table">Nudge on table</button>
 </div>
 <button type="button" class="btn primary" id="rock-n-go" disabled>What Newton wrote ▶</button>
 </div>`;
 const title = host.querySelector("#rock-n-title");
 const body = host.querySelector("#rock-n-body");
 const status = host.querySelector("#rock-n-status");
 const go = host.querySelector("#rock-n-go");
 body.innerHTML = `${narrationHtml(
 "This is why objects in space can drift forever from the gentlest nudge, while everything on Earth eventually seems to want to stop. It is not that Earth's objects are less lazy. Earth is covered in invisible forces like friction and air resistance, constantly nudging things without you noticing.",
 )}<p class="tiny-onscreen">Same push, same physics. The only difference is how much hidden friction is fighting the motion.</p>`;
 host.querySelector("#rock-n-space").onclick = () => {
 chemLabState.rockSpaceVx = 0.014;
 chemLabState.rockNudgeSpace = true;
 pulseSuccessFeedback(200);
 status.textContent = "The wrench keeps going. Nothing is fighting it.";
 };
 host.querySelector("#rock-n-table").onclick = () => {
 chemLabState.rockTableVx = 0.014;
 chemLabState.rockNudgeTable = true;
 pulseSuccessFeedback(200);
 status.textContent = "The puck slows. Hidden friction is an outside force.";
 };
 iv = setInterval(() => {
 if (cancelled || stage !== "space") return;
 if (chemLabState.rockNudgeSpace && chemLabState.rockNudgeTable) {
 go.disabled = false;
 status.textContent = "Same nudge, two endings. That is the hidden-force story.";
 }
 }, 160);
 go.onclick = () => {
 if (stage === "space") {
 stage = "law";
 chemLabState.phase = "law";
 playScene("rockNewton", { phase: "law" });
 title.textContent = "Newton's First Law";
 body.innerHTML = `${narrationHtml(
 "Around 1687, Isaac Newton wrote this idea down formally. It is now called Newton's First Law of Motion, or simply the Law of Inertia. Notice it is really just a precise version of everything you already discovered today: no change without a cause. Rest stays rest, motion stays motion, until some outside force steps in.",
 )}<p class="tiny-onscreen">An object at rest stays at rest, and an object in motion stays in motion at a constant speed and direction, unless acted on by a net outside force.</p>`;
 host.querySelector("#rock-n-space").style.display = "none";
 host.querySelector("#rock-n-table").style.display = "none";
 if (status) status.style.display = "none";
 go.disabled = false;
 go.textContent = "Quick check ▶";
 return;
 }
 if (stage === "law") {
 stage = "quiz";
 mountQuiz(host, {
 scene: "rockNewton",
 sceneArgs: { phase: "law" },
 title: "Quick check",
 q: "A hockey puck slides across the ice and eventually stops. According to Newton's First Law, what does that tell you?",
 opts: [
 "A force, like friction, must have acted on it",
 "It ran out of motion",
 "Hockey pucks do not have inertia",
 ],
 ok: 0,
 success: "A force acted. It did not run out of motion.",
 fail: "Newton's First Law says motion keeps going unless a net outside force acts.",
 onDone: finish,
 });
 }
 };
}

export function mountRockCrash(host, cfg) {
 const finish = once(() => cfg.onDone());
 let cancelled = false;
 let stage = "crash";
 let iv = null;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 });
 chemLabState.phase = "crash";
 chemLabState.rockBeltOn = false;
 chemLabState.rockCrashGo = false;
 chemLabState.rockCrashHit = false;
 chemLabState.rockCrashBeltRun = false;
 chemLabState.rockSawNoBelt = false;
 chemLabState.rockCrashT0 = 0;
 playScene("rockCrash", { phase: "crash" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 4: Enactive</div>
 <h3 id="rock-cr-title">Sudden stop, no seatbelt</h3>
 <div id="rock-cr-body"></div>
 <p id="rock-cr-status" class="drag-hint" aria-live="polite">Tap Drive. Then toggle the seatbelt and Drive again.</p>
 <div class="btn-row">
 <button type="button" class="btn secondary" id="rock-cr-drive">Drive →</button>
 <button type="button" class="btn secondary" id="rock-cr-belt">Toggle seatbelt</button>
 </div>
 <button type="button" class="btn primary" id="rock-cr-go" disabled>Optional: tablecloth ▶</button>
 </div>`;
 const title = host.querySelector("#rock-cr-title");
 const body = host.querySelector("#rock-cr-body");
 const status = host.querySelector("#rock-cr-status");
 const go = host.querySelector("#rock-cr-go");
 const driveBtn = host.querySelector("#rock-cr-drive");
 const beltBtn = host.querySelector("#rock-cr-belt");
 body.innerHTML = narrationHtml(
 "This is Newton's First Law in a way that should feel familiar: your body does not know or care that the car stopped. It just keeps going, exactly like the lazy rock, until something applies a force to it too. A seatbelt is not just a rule. It is supplying the missing outside force your body needs to stop along with the car.",
 );
 driveBtn.onclick = () => {
 if (stage !== "crash") return;
 chemLabState.rockCrashGo = true;
 chemLabState.rockCrashHit = false;
 chemLabState.rockCrashT0 = performance.now();
 };
 beltBtn.onclick = () => {
 if (stage !== "crash") return;
 chemLabState.rockBeltOn = !chemLabState.rockBeltOn;
 beltBtn.textContent = chemLabState.rockBeltOn ? "Seatbelt on" : "Toggle seatbelt";
 };
 iv = setInterval(() => {
 if (cancelled || stage !== "crash") return;
 if (chemLabState.rockSawNoBelt && chemLabState.rockCrashBeltRun) {
 status.textContent = "No belt: the passenger keeps going. With a belt: an outside force stops them too.";
 go.disabled = false;
 } else if (chemLabState.rockCrashHit && !chemLabState.rockBeltOn) {
 status.textContent = "The car stopped. The passenger's body didn't. Toggle the seatbelt and Drive again.";
 }
 }, 160);
 go.onclick = () => {
 if (stage === "crash") {
 stage = "cloth";
 chemLabState.phase = "cloth";
 chemLabState.rockClothYank = false;
 playScene("rockCrash", { phase: "cloth" });
 title.textContent = "The tablecloth trick";
 body.innerHTML = narrationHtml(
 "Yank fast enough and the dishes barely move. Their inertia keeps them in place while only the cloth is forced to move. Optional, but it is the same lazy-rock idea in a party trick.",
 );
 status.textContent = "Yank the cloth, or skip ahead.";
 if (driveBtn) driveBtn.style.display = "none";
 if (beltBtn) beltBtn.style.display = "none";
 go.disabled = false;
 go.textContent = "Continue ▶";
 const yank = document.createElement("button");
 yank.type = "button";
 yank.className = "btn secondary";
 yank.id = "rock-cr-yank";
 yank.textContent = "Yank cloth →";
 yank.onclick = () => {
 chemLabState.rockClothYank = true;
 pulseSuccessFeedback(220);
 };
 go.before(yank);
 return;
 }
 finish();
 };
}

export function mountRockWhy(host, cfg) {
 const finish = once(() => cfg.onDone());
 let stage = "montage";
 let cancelled = false;
 let iv = null;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 });
 chemLabState.phase = "montage";
 chemLabState.rockWhyPick = 0;
 chemLabState.rockWhyTried = [false, false, false];
 chemLabState.rockCardYank = false;
 chemLabState.rockSatNudge = false;
 chemLabState.rockBusMode = "idle";
 chemLabState.rockBusStarted = false;
 chemLabState.rockBusBraked = false;
 playScene("rockWhy", { phase: "montage" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 4: Iconic</div>
 <h3 id="rock-w-title">You have felt this law your whole life</h3>
 <div id="rock-w-body"></div>
 <p id="rock-w-status" class="drag-hint" aria-live="polite">Do all three: ride the bus, yank the coin, nudge the satellite.</p>
 <div class="btn-row">
 <button type="button" class="btn secondary" id="rock-w-bus">Bus</button>
 <button type="button" class="btn secondary" id="rock-w-coin">Coin</button>
 <button type="button" class="btn secondary" id="rock-w-sat">Satellite</button>
 </div>
 <div class="btn-row" id="rock-w-act">
 <button type="button" class="btn secondary" id="rock-w-do">Try this →</button>
 </div>
 <button type="button" class="btn primary" id="rock-w-go" disabled>Net force = 0 ▶</button>
 </div>`;
 const title = host.querySelector("#rock-w-title");
 const body = host.querySelector("#rock-w-body");
 const status = host.querySelector("#rock-w-status");
 const go = host.querySelector("#rock-w-go");
 const doBtn = host.querySelector("#rock-w-do");
 body.innerHTML = narrationHtml(
 "Newton's First Law is not a sentence to memorize. It is the lurch when a bus brakes, the coin that stays when you yank the card, the satellite that keeps circling with no engine. Do each one. You are the force. The object is the lazy rock.",
 );
 function setPick(n) {
 chemLabState.rockWhyPick = n;
 if (n === 1) {
 chemLabState.rockBusMode = "idle";
 doBtn.textContent = "Start, then use Brake →";
 status.textContent = "You are the passenger. Start the bus, then brake.";
 } else if (n === 2) {
 doBtn.textContent = "Yank the card →";
 status.textContent = "Yank the card. Watch the coin stay put.";
 } else {
 doBtn.textContent = "Nudge satellite →";
 status.textContent = "Give the satellite a nudge. Motion stays motion.";
 }
 }
 host.querySelector("#rock-w-bus").onclick = () => setPick(1);
 host.querySelector("#rock-w-coin").onclick = () => setPick(2);
 host.querySelector("#rock-w-sat").onclick = () => setPick(3);
 doBtn.onclick = () => {
 const pick = chemLabState.rockWhyPick || 0;
 const tried = (chemLabState.rockWhyTried || [false, false, false]).slice();
 if (pick === 1) {
 if (!chemLabState.rockBusStarted) {
 chemLabState.rockBusMode = "start";
 chemLabState.rockBusT0 = performance.now();
 chemLabState.rockBusStarted = true;
 doBtn.textContent = "Brake the bus →";
 status.textContent = "You slid back. Now brake.";
 pulseSuccessFeedback(200);
 return;
 }
 chemLabState.rockBusMode = "brake";
 chemLabState.rockBusT0 = performance.now();
 chemLabState.rockBusBraked = true;
 tried[0] = true;
 chemLabState.rockWhyTried = tried;
 status.textContent = "You lurched forward. Bus costume: done.";
 pulseSuccessFeedback(200);
 } else if (pick === 2) {
 chemLabState.rockCardYank = true;
 tried[1] = true;
 chemLabState.rockWhyTried = tried;
 status.textContent = "The coin stayed. Coin costume: done.";
 pulseSuccessFeedback(200);
 } else if (pick === 3) {
 chemLabState.rockSatNudge = true;
 tried[2] = true;
 chemLabState.rockWhyTried = tried;
 status.textContent = "It keeps circling. Satellite costume: done.";
 pulseSuccessFeedback(200);
 } else {
 status.textContent = "Pick Bus, Coin, or Satellite first.";
 pulseFailFeedback(240);
 }
 };
 iv = setInterval(() => {
 if (cancelled || stage !== "montage") return;
 const tried = chemLabState.rockWhyTried || [];
 if (tried[0] && tried[1] && tried[2]) {
 go.disabled = false;
 status.textContent = "Three costumes, one law. Continue when you are ready.";
 }
 }, 160);
 go.onclick = () => {
 if (stage === "montage") {
 stage = "net";
 chemLabState.phase = "net";
 playScene("rockWhy", { phase: "net" });
 title.textContent = "If net force is zero";
 body.innerHTML = `${narrationHtml(
 "Physicists have a tidy shorthand for all of this: if the net force on something is zero, its motion does not change, full stop. Everything today has really just been one rule, discovered from every possible angle. What happens once that net force stops being zero? That is the very next question worth hunting down.",
 )}<p class="tiny-onscreen">Net force: the combined result of every force acting on an object at once.</p>
 <p class="tiny-onscreen">If net force = 0 → no change in motion (Newton's First Law, in short).</p>`;
 host.querySelector("#rock-w-bus").style.display = "none";
 host.querySelector("#rock-w-coin").style.display = "none";
 host.querySelector("#rock-w-sat").style.display = "none";
 doBtn.style.display = "none";
 if (status) status.style.display = "none";
 go.disabled = false;
 go.textContent = "Continue ▶";
 return;
 }
 finish();
 };
}

export function mountPushAim(host, cfg) {
 const finish = once(() => cfg.onDone());
 let cancelled = false;
 let iv = null;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 });
 chemLabState.ppAimStep = 0;
 chemLabState.ppAimDone = [false, false, false];
 chemLabState.ppRx = 0.5;
 chemLabState.ppRy = 0.5;
 chemLabState.ppRvx = 0;
 chemLabState.ppRvy = 0;
 chemLabState.prompt = "";
 playScene("pushAim");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 1: Enactive</div>
 <h3 id="pp-aim-title">Aim and push</h3>
 <div id="pp-aim-body"></div>
 <p id="pp-aim-status" class="drag-hint" aria-live="polite"></p>
 <div class="btn-row">
 <button type="button" class="btn secondary" id="pp-aim-do">Do this push →</button>
 </div>
 <button type="button" class="btn primary" id="pp-aim-go" disabled>Continue ▶</button>
 </div>`;
 const title = host.querySelector("#pp-aim-title");
 const body = host.querySelector("#pp-aim-body");
 const status = host.querySelector("#pp-aim-status");
 const go = host.querySelector("#pp-aim-go");
 const doBtn = host.querySelector("#pp-aim-do");
 const lines = [
 "Every push has two things baked in: a direction (which way you dragged) and a strength (how hard). The compass stays put. Start with a short, weak drag on the crate.",
 "Now a long, strong drag. The crate should shoot off quickly, still in the direction you pushed.",
 "Now push at a clearly different angle. The crate travels that new direction. The compass does not move.",
 ];
 function render() {
 const step = chemLabState.ppAimStep || 0;
 title.textContent = ["Short and weak", "Long and strong", "A new direction"][step];
 body.innerHTML = narrationHtml(lines[step]);
 status.textContent = "Drag from the crate, or tap Do this push.";
 doBtn.textContent = ["Weak shove →", "Strong shove →", "Side shove →"][step];
 }
 render();
 let holdUntil = 0;
 doBtn.onclick = () => {
 const arena = window.__arena;
 const w = arena?.width || 640;
 const step = chemLabState.ppAimStep || 0;
 const dx = step === 0 ? 36 : step === 1 ? w * 0.42 : 20;
 const dy = step === 2 ? -w * 0.28 : 0;
 const mag = Math.hypot(dx, dy) || 1;
 const str = Math.min(1, mag / (w * 0.38));
 const ang = (Math.atan2(-dy, dx) * 180) / Math.PI;
 chemLabState.ppStr = str;
 chemLabState.ppAng = ang;
 chemLabState.ppRvx = (dx / mag) * str * 0.032;
 chemLabState.ppRvy = (dy / mag) * str * 0.032;
 const done = (chemLabState.ppAimDone || [false, false, false]).slice();
 done[step] = true;
 chemLabState.ppAimDone = done;
 if (step === 1) chemLabState.ppLastAng = ang;
 pulseSuccessFeedback(240);
 };
 iv = setInterval(() => {
 if (cancelled) return;
 const step = chemLabState.ppAimStep || 0;
 const done = chemLabState.ppAimDone || [];
 if (!done[step]) {
 holdUntil = 0;
 return;
 }
 const word = step === 0 ? "Weak" : step === 1 ? "Strong" : "New angle";
 status.textContent = `Direction: ${Math.round(chemLabState.ppAng || 0)}°. Strength: ${word}.`;
 if (!holdUntil) holdUntil = performance.now() + 800;
 if (performance.now() < holdUntil) return;
 if (step < 2) {
 chemLabState.ppAimStep = step + 1;
 chemLabState.ppRx = 0.5;
 chemLabState.ppRy = 0.5;
 chemLabState.ppRvx = 0;
 chemLabState.ppRvy = 0;
 chemLabState.prompt = "";
 holdUntil = 0;
 render();
 } else go.disabled = false;
 }, 160);
 go.onclick = () => finish();
}

export function mountPushForce(host, cfg) {
 const finish = once(() => cfg.onDone());
 let stage = "collage";
 trackCleanup(() => {});
 chemLabState.phase = "collage";
 playScene("pushForce", { phase: "collage" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 1: Iconic</div>
 <h3 id="pp-f-title">Arrows everywhere</h3>
 <div id="pp-f-body"></div>
 <button type="button" class="btn primary" id="pp-f-go">Name it ▶</button>
 </div>`;
 const title = host.querySelector("#pp-f-title");
 const body = host.querySelector("#pp-f-body");
 const go = host.querySelector("#pp-f-go");
 body.innerHTML = `${narrationHtml(
 "Once you start looking for it, the world is full of pushes and pulls. The four pictures stay on screen: a hand on a door, wind on a sail, a dog on a leash, and gravity on an apple. Physicists draw every one the same way: an arrow.",
 )}<p class="tiny-onscreen">Direction + strength, drawn as an arrow. That arrow is how physicists picture every push and pull.</p>`;
 go.onclick = () => {
 if (stage === "collage") {
 stage = "word";
 chemLabState.phase = "word";
 playScene("pushForce", { phase: "word" });
 title.textContent = "Force, in newtons";
 body.innerHTML = `${narrationHtml(
 "In physics, push and pull both go by one formal name: force, measured in units called newtons, named after Isaac Newton. Every force you will ever study, from a gentle tap to a rocket launch, is a bigger or smaller version of the same arrow.",
 )}<p class="tiny-onscreen">Force: the physics word for any push or pull.</p>
 <p class="tiny-onscreen">Measured in newtons (N).</p>
 <p class="tiny-onscreen">Drawn as an arrow: length/thickness = strength, direction = which way.</p>`;
 go.textContent = "Continue ▶";
 return;
 }
 finish();
 };
}

export function mountPushRace(host, cfg) {
 const finish = once(() => cfg.onDone());
 let cancelled = false;
 let iv = null;
 let stage = "turtle";
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 });
 chemLabState.ppRaceWho = "turtle";
 chemLabState.ppCrateX = 0.18;
 chemLabState.ppTurtleX = 0.18;
 chemLabState.ppRabbitX = 0.18;
 chemLabState.ppTurtleDone = false;
 chemLabState.ppRabbitDone = false;
 chemLabState.ppRaceT0 = 0;
 chemLabState.ppPushing = false;
 chemLabState.ppReveal = false;
 playScene("pushRace");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 2: Enactive</div>
 <h3 id="pp-r-title">The crate race: Tortoise</h3>
 <div id="pp-r-body"></div>
 <p id="pp-r-status" class="drag-hint" aria-live="polite">Hold to push. The tortoise walks slowly, on its own lane.</p>
 <button type="button" class="btn secondary" id="pp-r-hold">Hold to push</button>
 <button type="button" class="btn primary" id="pp-r-go" disabled>Now the rabbit ▶</button>
 </div>`;
 const title = host.querySelector("#pp-r-title");
 const body = host.querySelector("#pp-r-body");
 const status = host.querySelector("#pp-r-status");
 const hold = host.querySelector("#pp-r-hold");
 const go = host.querySelector("#pp-r-go");
 body.innerHTML = narrationHtml(
 "Two lanes, two identical crates, the same distance. Push as the tortoise first, slowly, then as the rabbit, as fast as you can. Watch the force meter: it will look the same.",
 );
 hold.onmousedown = hold.ontouchstart = (ev) => {
 ev.preventDefault();
 chemLabState.ppPushing = true;
 if (!chemLabState.ppRaceT0) chemLabState.ppRaceT0 = performance.now();
 };
 function release() {
 chemLabState.ppPushing = false;
 }
 hold.onmouseup = hold.onmouseleave = hold.ontouchend = release;
 iv = setInterval(() => {
 if (cancelled) return;
 if (stage === "turtle" && chemLabState.ppTurtleDone) {
 status.textContent = `Tortoise: ${chemLabState.ppTurtleT.toFixed(1)} s. Same crate still to go for the rabbit.`;
 go.disabled = false;
 }
 if (stage === "rabbit" && chemLabState.ppRabbitDone) {
 status.textContent = `Tortoise: ${chemLabState.ppTurtleT.toFixed(1)} s. Rabbit: ${chemLabState.ppRabbitT.toFixed(1)} s. Same crates. Same distance. Very different time.`;
 go.disabled = false;
 }
 }, 160);
 go.onclick = () => {
 if (stage === "turtle") {
 stage = "rabbit";
 chemLabState.ppRaceWho = "rabbit";
 chemLabState.ppRabbitX = 0.18;
 chemLabState.ppRaceT0 = 0;
 chemLabState.ppPushing = false;
 playScene("pushRace");
 title.textContent = "The crate race: Rabbit";
 body.innerHTML = narrationHtml("Same crate, same distance, same force meter. This time the rabbit hops. Hold to push and watch it finish fast.");
 status.textContent = "Hold to push. No speed cap like the tortoise.";
 go.disabled = true;
 go.textContent = "Guess who was more powerful ▶";
 return;
 }
 if (stage === "rabbit") {
 stage = "guess";
 mountQuiz(host, {
 scene: "pushRace",
 title: "Guess first",
 q: "Which one was more POWERFUL: the tortoise or the rabbit?",
 opts: ["Tortoise", "Rabbit", "Same"],
 ok: 1,
 success: "The rabbit finished faster. That is more power. Now the twist.",
 fail: "Power is about how fast the job got done. The rabbit finished first.",
 onDone: () => {
 chemLabState.ppGuessed = true;
 chemLabState.ppReveal = true;
 playScene("pushRace");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 2: Enactive</div>
 <h3>Same push. Different time.</h3>
 ${narrationHtml(
 "Here is the twist worth sitting with: the rabbit was not stronger. Both pushed with identical force and moved the crate the identical distance, meaning they both did the exact same amount of work. The only thing that changed was how quickly that work got done. That difference, same job, different time, is exactly what power actually measures.",
 )}
 <p class="tiny-onscreen">Same push strength. Same total job done. The only difference was TIME.</p>
 <button type="button" class="btn primary" id="pp-r-fin">Continue ▶</button>
 </div>`;
 host.querySelector("#pp-r-fin").onclick = () => finish();
 },
 });
 }
 };
}

export function mountPushWork(host, cfg) {
 const finish = once(() => cfg.onDone());
 let stage = "bars";
 trackCleanup(() => {});
 chemLabState.phase = "bars";
 playScene("pushWork", { phase: "bars" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 2: Iconic</div>
 <h3 id="pp-w-title">Work squeezed into less time</h3>
 <div id="pp-w-body"></div>
 <button type="button" class="btn primary" id="pp-w-go">Name work and power ▶</button>
 </div>`;
 const title = host.querySelector("#pp-w-title");
 const body = host.querySelector("#pp-w-body");
 const go = host.querySelector("#pp-w-go");
 body.innerHTML = `${narrationHtml(
 "Picture power as work squeezed into a smaller window of time. Doing the identical job faster does not take more strength. It takes more power. Strength is about how hard you push. Power is about how fast you can finish the job with that push.",
 )}<p class="tiny-onscreen">Same work, less time = more power. Same work, more time = less power.</p>`;
 go.onclick = () => {
 if (stage === "bars") {
 stage = "word";
 chemLabState.phase = "word";
 playScene("pushWork", { phase: "word" });
 title.textContent = "Joules and watts";
 body.innerHTML = `${narrationHtml(
 "Physicists give the size of the job its own name, work, measured in joules, and how fast the job got done its own name too, power, measured in watts. The Turtle and the Rabbit did identical work. Only the Rabbit did it with more power, because power is work divided by time.",
 )}<p class="tiny-onscreen">Work = Force × Distance (joules): how big the job was.</p>
 <p class="tiny-onscreen">Power = Work ÷ Time (watts): how fast the job got done.</p>`;
 go.textContent = "Continue ▶";
 return;
 }
 finish();
 };
}

export function mountPushGears(host, cfg) {
 const finish = once(() => cfg.onDone());
 let cancelled = false;
 let iv = null;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 });
 chemLabState.ppGear = "low";
 chemLabState.ppLowHill = false;
 chemLabState.ppHighHill = false;
 chemLabState.ppHighFlat = false;
 chemLabState.ppLowFlat = false;
 chemLabState.ppGearGo = false;
 chemLabState.ppCarX = 0;
 playScene("pushGears");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 3: Enactive</div>
 <h3>Fixed power budget</h3>
 ${narrationHtml(
 "Nothing about the engine's power ever changes in these runs. You are simply trading force for speed using the gears. Low gear climbs the hill slowly. High gear on the same hill gets shoved back by gravity: watch the sad face. High gear on the flat road gets the smile.",
 )}
 <p id="pp-g-status" class="drag-hint" aria-live="polite">Required: Low gear on the hill, High gear on the hill, High gear on the road.</p>
 <div class="btn-row">
 <button type="button" class="btn secondary" id="pp-g-gear">Gear: Low</button>
 <button type="button" class="btn secondary" id="pp-g-hill">Climb hill</button>
 <button type="button" class="btn secondary" id="pp-g-flat">Cruise road</button>
 </div>
 <button type="button" class="btn primary" id="pp-g-go" disabled>Continue ▶</button>
 </div>`;
 const status = host.querySelector("#pp-g-status");
 const gearBtn = host.querySelector("#pp-g-gear");
 const go = host.querySelector("#pp-g-go");
 function startRun(dest) {
 chemLabState.ppDest = dest;
 chemLabState.ppGearGo = true;
 chemLabState.ppGearT0 = performance.now();
 chemLabState.ppCarX = 0;
 chemLabState.ppStalled = false;
 }
 gearBtn.onclick = () => {
 if (chemLabState.ppGearGo) return;
 chemLabState.ppGear = chemLabState.ppGear === "low" ? "high" : "low";
 gearBtn.textContent = chemLabState.ppGear === "low" ? "Gear: Low" : "Gear: High";
 };
 host.querySelector("#pp-g-hill").onclick = () => startRun("hill");
 host.querySelector("#pp-g-flat").onclick = () => startRun("flat");
 iv = setInterval(() => {
 if (cancelled) return;
 gearBtn.textContent = chemLabState.ppGear === "low" ? "Gear: Low" : "Gear: High";
 const bits = [];
 if (chemLabState.ppLowHill) bits.push("Low+hill");
 if (chemLabState.ppHighHill) bits.push("High+hill");
 if (chemLabState.ppHighFlat) bits.push("High+road");
 if (chemLabState.ppLowFlat) bits.push("Low+road (optional)");
 status.textContent = bits.length
 ? `Power stayed the same. Done: ${bits.join(", ")}.`
 : "Required: Low gear on the hill, High gear on the hill, High gear on the road.";
 if (chemLabState.ppLowHill && chemLabState.ppHighHill && chemLabState.ppHighFlat) go.disabled = false;
 }, 200);
 go.onclick = () => finish();
}

export function mountPushTrade(host, cfg) {
 const finish = once(() => cfg.onDone());
 let stage = "see";
 trackCleanup(() => {});
 chemLabState.phase = "see";
 playScene("pushTrade", { phase: "see" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 3: Iconic</div>
 <h3 id="pp-t-title">The pivot never moves</h3>
 <div id="pp-t-body"></div>
 <button type="button" class="btn primary" id="pp-t-go">Power = Force × Velocity ▶</button>
 </div>`;
 const title = host.querySelector("#pp-t-title");
 const body = host.querySelector("#pp-t-body");
 const go = host.querySelector("#pp-t-go");
 body.innerHTML = `${narrationHtml(
 "This is not just a car thing. Any time an engine, a motor, or even a muscle has a fixed power output, it is always making this same trade: more force means less speed, more speed means less force. The power itself, the pivot point, stays put.",
 )}<p class="tiny-onscreen">For a fixed amount of power, force and speed balance against each other. More of one always means less of the other.</p>`;
 go.onclick = () => {
 if (stage === "see") {
 stage = "word";
 chemLabState.phase = "word";
 playScene("pushTrade", { phase: "word" });
 title.textContent = "The same rule, written another way";
 body.innerHTML = `${narrationHtml(
 "There is a second, equally valid way to calculate power: force multiplied by velocity, velocity just meaning speed in a direction. Written this way, the trade-off you just drove becomes obvious: if power has to stay the same number, and force goes up, velocity is forced to come down to balance the equation, and vice versa.",
 )}<p class="tiny-onscreen">Power = Force × Velocity.</p>
 <p class="tiny-onscreen">If power stays fixed and force goes up, velocity has to come down.</p>`;
 go.textContent = "Continue ▶";
 return;
 }
 finish();
 };
}

export function mountPushFriends(host, cfg) {
 const finish = once(() => cfg.onDone());
 let cancelled = false;
 let iv = null;
 let stage = "alone";
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 });
 chemLabState.ppFriends = 1;
 chemLabState.ppCarPos = 0.2;
 chemLabState.ppCarAloneDone = false;
 chemLabState.ppCarFriendsDone = false;
 chemLabState.ppPushCar = false;
 playScene("pushFriends");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 4: Enactive</div>
 <h3 id="pp-c-title">Push the stalled car, alone</h3>
 <div id="pp-c-body"></div>
 <p id="pp-c-status" class="drag-hint" aria-live="polite">Hold to push. Your force is capped, so this will take a while.</p>
 <div class="btn-row">
 <button type="button" class="btn secondary" id="pp-c-hold">Hold to push</button>
 <button type="button" class="btn secondary" id="pp-c-friends" disabled>Recruit friends</button>
 </div>
 <button type="button" class="btn primary" id="pp-c-go" disabled>Optional: lift fast vs slow ▶</button>
 </div>`;
 const title = host.querySelector("#pp-c-title");
 const body = host.querySelector("#pp-c-body");
 const status = host.querySelector("#pp-c-status");
 const hold = host.querySelector("#pp-c-hold");
 const friends = host.querySelector("#pp-c-friends");
 const go = host.querySelector("#pp-c-go");
 body.innerHTML = narrationHtml(
 "This is why many hands make light work is not just a saying. More combined force doing the identical job in less time means more total power. The work (force times distance to the roadside) is the same. The time is not.",
 );
 hold.onmousedown = hold.ontouchstart = (ev) => {
 ev.preventDefault();
 chemLabState.ppPushCar = true;
 };
 hold.onmouseup = hold.onmouseleave = hold.ontouchend = () => {
 chemLabState.ppPushCar = false;
 };
 friends.onclick = () => {
 if (!chemLabState.ppCarAloneDone) return;
 chemLabState.ppFriends = 4;
 chemLabState.ppCarPos = 0.2;
 chemLabState.ppPushCar = false;
 stage = "friends";
 title.textContent = "Now with friends";
 status.textContent = "Same car, same distance. Hold to push together.";
 pulseSuccessFeedback(200);
 };
 iv = setInterval(() => {
 if (cancelled || stage === "lift") return;
 if (chemLabState.ppCarAloneDone) friends.disabled = false;
 if (chemLabState.ppFriends > 1 && stage === "alone") {
 stage = "friends";
 title.textContent = "Now with friends";
 status.textContent = "Same car, same distance. Hold to push together.";
 }
 if (chemLabState.ppCarAloneDone && chemLabState.ppCarFriendsDone) {
 status.textContent = "Alone: slow. With friends: fast. More combined force, more power, because the job got done quicker.";
 go.disabled = false;
 }
 }, 160);
 go.onclick = () => {
 if (stage !== "lift") {
 stage = "lift";
 title.textContent = "Lift it fast vs slow (optional)";
 body.innerHTML = `${narrationHtml(
 "Lift the same weight to the same height twice: once slow, once fast. Both lifts show identical work. The fast lift shows much higher power.",
 )}<div class="btn-row">
 <button type="button" class="btn secondary" id="pp-lift-slow">Slow lift</button>
 <button type="button" class="btn secondary" id="pp-lift-fast">Fast lift</button>
 </div>
 <p class="tiny-onscreen" id="pp-lift-readout">Work is the same either way. Power is not.</p>`;
 status.textContent = "Optional. Try both, or skip ahead.";
 friends.style.display = "none";
 hold.style.display = "none";
 go.disabled = false;
 go.textContent = "Continue ▶";
 host.querySelector("#pp-lift-slow")?.addEventListener("click", () => {
 chemLabState.ppLiftFast = false;
 const el = host.querySelector("#pp-lift-readout");
 if (el) el.textContent = "Slow lift: same work, low power.";
 });
 host.querySelector("#pp-lift-fast")?.addEventListener("click", () => {
 chemLabState.ppLiftFast = true;
 const el = host.querySelector("#pp-lift-readout");
 if (el) el.textContent = "Fast lift: same work, high power.";
 pulseSuccessFeedback(200);
 });
 return;
 }
 finish();
 };
}

export function mountPushScale(host, cfg) {
 const finish = once(() => cfg.onDone());
 let stage = "scale";
 trackCleanup(() => {});
 chemLabState.phase = "scale";
 playScene("pushScale", { phase: "scale" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 4: Iconic</div>
 <h3 id="pp-s-title">A scale that finally means something</h3>
 <div id="pp-s-body"></div>
 <button type="button" class="btn primary" id="pp-s-go">Force vs power ▶</button>
 </div>`;
 const title = host.querySelector("#pp-s-title");
 const body = host.querySelector("#pp-s-body");
 const go = host.querySelector("#pp-s-go");
 body.innerHTML = narrationHtml(
 "Once you place real examples on the same scale, the word power finally means something concrete. Five pictures sit side by side: a bulb, a walker, a bike, a car, and a rocket. A rocket is not remarkable only because it pushes hard. It can do an enormous amount of work in a very short time.",
 );
 go.onclick = () => {
 if (stage === "scale") {
 stage = "card";
 chemLabState.phase = "card";
 playScene("pushScale", { phase: "card" });
 title.textContent = "Two numbers, two jobs";
 body.innerHTML = `${narrationHtml(
 "So: force is the push itself. Power is how fast that push can get a job done. You will see both numbers on everything from car ads to lightbulb boxes, and now you know what they mean, and why a small, fast engine can genuinely be more powerful than a big, slow one.",
 )}<p class="tiny-onscreen">Force: a push or pull, measured in newtons.</p>
 <p class="tiny-onscreen">Power: how quickly work gets done, measured in watts (or horsepower: 1 horsepower ≈ 746 watts).</p>
 <p class="tiny-onscreen">Next question: where does the energy powering all of this actually come from?</p>`;
 go.textContent = "Continue ▶";
 return;
 }
 finish();
 };
}

export function mountPairSpring(host, cfg) {
 const finish = once(() => cfg.onDone());
 let cancelled = false;
 let iv = null;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 });
 chemLabState.plSpringX = 0.52;
 chemLabState.plSpringPushed = false;
 chemLabState.plSpringPulled = false;
 playScene("pairSpring");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 1: Enactive</div>
 <h3>Squeeze and stretch</h3>
 ${narrationHtml(
 "The spring did not just sit there either time. It fought back, in both directions. Push it, and it gets shorter and shoves back. Pull it, and it gets longer and tugs back. Same spring, same basic idea of force, just pointed two different ways.",
 )}
 <p id="pl-sp-status" class="drag-hint" aria-live="polite">Drag the free end, or tap Squeeze then Stretch.</p>
 <div class="btn-row">
 <button type="button" class="btn secondary" id="pl-sp-in">Squeeze →</button>
 <button type="button" class="btn secondary" id="pl-sp-out">Stretch →</button>
 </div>
 <button type="button" class="btn primary" id="pl-sp-go" disabled>Continue ▶</button>
 </div>`;
 const status = host.querySelector("#pl-sp-status");
 const go = host.querySelector("#pl-sp-go");
 host.querySelector("#pl-sp-in").onclick = () => {
 chemLabState.plSpringX = 0.34;
 chemLabState.plSpringPushed = true;
 pulseSuccessFeedback(200);
 };
 host.querySelector("#pl-sp-out").onclick = () => {
 chemLabState.plSpringX = 0.72;
 chemLabState.plSpringPulled = true;
 pulseSuccessFeedback(200);
 };
 iv = setInterval(() => {
 if (cancelled) return;
 const bits = [];
 if (chemLabState.plSpringPushed) bits.push("squeezed (pushed back)");
 if (chemLabState.plSpringPulled) bits.push("stretched (pulled back)");
 status.textContent = bits.length
 ? bits.join(". ") + "."
 : "Drag the free end, or tap Squeeze then Stretch.";
 if (chemLabState.plSpringPushed && chemLabState.plSpringPulled) go.disabled = false;
 }, 160);
 go.onclick = () => finish();
}

export function mountPairDirs(host, cfg) {
 const finish = once(() => cfg.onDone());
 let stage = "collage";
 trackCleanup(() => {});
 chemLabState.phase = "collage";
 playScene("pairDirs", { phase: "collage" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 1: Iconic</div>
 <h3 id="pl-d-title">Two directions, one ingredient</h3>
 <div id="pl-d-body"></div>
 <button type="button" class="btn primary" id="pl-d-go">Name push and pull ▶</button>
 </div>`;
 const title = host.querySelector("#pl-d-title");
 const body = host.querySelector("#pl-d-body");
 const go = host.querySelector("#pl-d-go");
 body.innerHTML = `${narrationHtml(
 "Pushing is a force sent outward, away from you, toward whatever you are pushing. Pulling is the same kind of force, just aimed back toward you instead. Same ingredient. Direction is the only thing that flips.",
 )}<p class="tiny-onscreen">Push: force pointing away from you, toward the object.</p>
 <p class="tiny-onscreen">Pull: force pointing toward you, drawing the object closer.</p>`;
 go.onclick = () => {
 if (stage === "collage") {
 stage = "word";
 chemLabState.phase = "word";
 playScene("pairDirs", { phase: "word" });
 title.textContent = "Same coin, flipped";
 body.innerHTML = `${narrationHtml(
 "So far, push and pull really are just the same coin, flipped. Both are still just forces, same units (newtons), same rules. Direction is the only real difference. That squeeze-versus-stretch difference is about to explain something you have probably never thought to ask.",
 )}<p class="tiny-onscreen">Push: a force applied away from the source, toward the object. Tends to squeeze or shorten.</p>
 <p class="tiny-onscreen">Pull: a force applied toward the source, drawing the object closer. Tends to stretch or lengthen.</p>`;
 go.textContent = "Continue ▶";
 return;
 }
 finish();
 };
}

export function mountPairRope(host, cfg) {
 const finish = once(() => cfg.onDone());
 let cancelled = false;
 let iv = null;
 let stage = "push";
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 });
 chemLabState.plRopeMode = "push";
 chemLabState.plRopePushTried = false;
 chemLabState.plRopePullDone = false;
 chemLabState.plRodTried = false;
 chemLabState.plCartX = 0.28;
 chemLabState.plRopeEnd = 0.72;
 chemLabState.plRopeCrumple = 0.15;
 chemLabState.prompt = "";
 playScene("pairRope");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 2: Enactive</div>
 <h3 id="pl-rp-title">Why can't you push a rope?</h3>
 <div id="pl-rp-body"></div>
 <p id="pl-rp-status" class="drag-hint" aria-live="polite">First: try to shove the cart through the rope.</p>
 <div class="btn-row">
 <button type="button" class="btn secondary" id="pl-rp-push">Push the rope →</button>
 <button type="button" class="btn secondary" id="pl-rp-pull" disabled>Now pull the rope →</button>
 </div>
 <button type="button" class="btn primary" id="pl-rp-go" disabled>Optional: try a rod ▶</button>
 </div>`;
 const title = host.querySelector("#pl-rp-title");
 const body = host.querySelector("#pl-rp-body");
 const status = host.querySelector("#pl-rp-status");
 const pullBtn = host.querySelector("#pl-rp-pull");
 const go = host.querySelector("#pl-rp-go");
 body.innerHTML = narrationHtml(
 "A rope is fantastic at pulling and completely useless at pushing. Try to shove something with a rope and it just folds up. That is not a random quirk. It is a real physical difference in how the rope handles force.",
 );
 host.querySelector("#pl-rp-push").onclick = () => {
 chemLabState.plRopeMode = "push";
 chemLabState.plRopeCrumple = 0.9;
 chemLabState.plRopePushTried = true;
 pulseFailFeedback(260);
 };
 pullBtn.onclick = () => {
 if (!chemLabState.plRopePushTried) return;
 chemLabState.plRopeMode = "pull";
 chemLabState.plRopeCrumple = 0;
 chemLabState.plCartX = 0.18;
 chemLabState.plRopeEnd = 0.8;
 chemLabState.plRopePullDone = true;
 pulseSuccessFeedback(240);
 };
 iv = setInterval(() => {
 if (cancelled || stage === "rod") return;
 if (chemLabState.plRopePushTried) {
 pullBtn.disabled = false;
 status.textContent = "Pushing through a rope just makes it crumple. No force ever reaches the cart.";
 }
 if (chemLabState.plRopePullDone) {
 status.textContent = "Pulling through the exact same rope works. The rope goes tight and drags the cart.";
 go.disabled = false;
 }
 }, 160);
 go.onclick = () => {
 if (stage !== "rod") {
 stage = "rod";
 title.textContent = "Now try a rigid rod (optional)";
 body.innerHTML = narrationHtml(
 "A stiff rod can do both, because it does not bend the way a rope does. Optional, then continue.",
 );
 status.textContent = "Tap Try a rod on the canvas or skip ahead.";
 pullBtn.style.display = "none";
 host.querySelector("#pl-rp-push").style.display = "none";
 go.disabled = false;
 go.textContent = "Continue ▶";
 chemLabState.plRopeMode = "rod";
 return;
 }
 finish();
 };
}

export function mountPairTension(host, cfg) {
 const finish = once(() => cfg.onDone());
 let stage = "see";
 trackCleanup(() => {});
 chemLabState.phase = "see";
 playScene("pairTension", { phase: "see" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 2: Iconic</div>
 <h3 id="pl-tn-title">Stretching versus squeezing</h3>
 <div id="pl-tn-body"></div>
 <button type="button" class="btn primary" id="pl-tn-go">Name tension and compression ▶</button>
 </div>`;
 const title = host.querySelector("#pl-tn-title");
 const body = host.querySelector("#pl-tn-body");
 const go = host.querySelector("#pl-tn-go");
 body.innerHTML = `${narrationHtml(
 "Pulling stretches whatever is transmitting the force, so anything that can go tight under a stretch (rope, cable, chain, string) can pull just fine. Pushing squeezes that material. A floppy material has nothing to resist that squeeze with, so it buckles. Only rigid materials, like rods or beams, can reliably push.",
 )}<p class="tiny-onscreen">Pulling stretches material. It needs something that can go taut.</p>
 <p class="tiny-onscreen">Pushing squeezes material. It needs something rigid enough to resist being crushed.</p>`;
 go.onclick = () => {
 if (stage === "see") {
 stage = "word";
 chemLabState.phase = "word";
 playScene("pairTension", { phase: "word" });
 title.textContent = "Tension and compression";
 body.innerHTML = `${narrationHtml(
 "Engineers have precise names for these: a material under a pulling force is in tension; a material under a pushing force is in compression. Knowing which one a material is good at is one of the most basic decisions in engineering, and you now understand it from having failed to push a rope yourself.",
 )}<p class="tiny-onscreen">Tension: the pulling force inside a stretched material (ropes, cables, chains, strings).</p>
 <p class="tiny-onscreen">Compression: the pushing force inside a material being pressed together (rods, beams, pillars).</p>`;
 go.textContent = "Continue ▶";
 return;
 }
 finish();
 };
}

export function mountPairSkate(host, cfg) {
 const finish = once(() => cfg.onDone());
 let cancelled = false;
 let iv = null;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 });
 chemLabState.plSkateMode = "push";
 chemLabState.plPushOffDone = false;
 chemLabState.plPullTogetherDone = false;
 chemLabState.plSkateL = 0.34;
 chemLabState.plSkateR = 0.66;
 chemLabState.plSkateGo = false;
 chemLabState.prompt = "";
 playScene("pairSkate");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 3: Enactive</div>
 <h3>Both skaters move</h3>
 ${narrationHtml(
 "You only acted on one skater in each case, yet both skaters moved, every single time, whether they were pushing apart or pulling together. That is not a coincidence, and it is not specific to skaters. That is one of the deepest rules in physics, and it applies to every push and every pull.",
 )}
 <p id="pl-sk-status" class="drag-hint" aria-live="polite">Required: push-off, then pull together. Do not skip either.</p>
 <div class="btn-row">
 <button type="button" class="btn secondary" id="pl-sk-push">Push-off →</button>
 <button type="button" class="btn secondary" id="pl-sk-pull" disabled>Pull together →</button>
 </div>
 <button type="button" class="btn primary" id="pl-sk-go" disabled>Continue ▶</button>
 </div>`;
 const status = host.querySelector("#pl-sk-status");
 const pullBtn = host.querySelector("#pl-sk-pull");
 const go = host.querySelector("#pl-sk-go");
 host.querySelector("#pl-sk-push").onclick = () => {
 chemLabState.plSkateMode = "push";
 chemLabState.plSkateL = 0.34;
 chemLabState.plSkateR = 0.66;
 chemLabState.plSkateLv = -0.0036;
 chemLabState.plSkateRv = 0.0036;
 chemLabState.plSkateGo = true;
 chemLabState.plSkateT0 = performance.now();
 chemLabState.plPushOffDone = true;
 pulseSuccessFeedback(200);
 };
 pullBtn.onclick = () => {
 if (!chemLabState.plPushOffDone) return;
 chemLabState.plSkateMode = "pull";
 chemLabState.plSkateL = 0.28;
 chemLabState.plSkateR = 0.72;
 chemLabState.plSkateLv = 0.0028;
 chemLabState.plSkateRv = -0.0028;
 chemLabState.plSkateGo = true;
 chemLabState.plSkateT0 = performance.now();
 chemLabState.plPullTogetherDone = true;
 pulseSuccessFeedback(200);
 };
 iv = setInterval(() => {
 if (cancelled) return;
 if (chemLabState.plPushOffDone) {
 pullBtn.disabled = false;
 status.textContent = "You only pushed one skater. Both skaters moved.";
 }
 if (chemLabState.plPullTogetherDone) {
 status.textContent = "You only pulled from one side. Both skaters still moved.";
 go.disabled = false;
 }
 }, 160);
 go.onclick = () => finish();
}

export function mountPairThird(host, cfg) {
 const finish = once(() => cfg.onDone());
 let stage = "montage";
 trackCleanup(() => {});
 chemLabState.phase = "montage";
 playScene("pairThird", { phase: "montage" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 3: Iconic</div>
 <h3 id="pl-th-title">Matched pairs, everywhere</h3>
 <div id="pl-th-body"></div>
 <button type="button" class="btn primary" id="pl-th-go">Name the law ▶</button>
 </div>`;
 const title = host.querySelector("#pl-th-title");
 const body = host.querySelector("#pl-th-body");
 const go = host.querySelector("#pl-th-go");
 body.innerHTML = `${narrationHtml(
 "A swimmer moves forward by pushing water backward. The water pushes right back, forward, on the swimmer. A rowboat moves the same way: oars push water back, water pushes the boat forward. A rocket pushes exhaust one way and gets pushed the opposite way in return. Force always seems to come in matched, equal, opposite pairs, one acting on each of two different objects.",
 )}<p class="tiny-onscreen">Two equal, opposite forces, one on each object, every time.</p>`;
 go.onclick = () => {
 if (stage === "montage") {
 stage = "word";
 chemLabState.phase = "word";
 playScene("pairThird", { phase: "word" });
 title.textContent = "Newton's Third Law";
 body.innerHTML = `${narrationHtml(
 "This is Newton's Third Law, and it does not care whether you are pushing or pulling. Every force you apply to anything has an equal partner force, pointed the opposite way, acting back on you. You have been feeling this your entire life every time you have stood on the ground.",
 )}<p class="tiny-onscreen">For every action, there is an equal and opposite reaction.</p>
 <p class="tiny-onscreen">More precisely: whenever A exerts a force on B, B exerts an equal force back on A, in the opposite direction.</p>`;
 go.textContent = "Quick check ▶";
 return;
 }
 mountQuiz(host, {
 scene: "pairThird",
 sceneArgs: { phase: "word" },
 title: "Why doesn't the wall move?",
 q: "When you push against a wall, the wall pushes back on you. Why doesn't the wall move?",
 opts: [
 "The wall does not feel a force",
 "It does feel an equal force, but its inertia and connection to the ground make the motion too small to notice",
 "The wall is not a real object in physics",
 ],
 ok: 1,
 success: "Right. The wall feels the pair force. Inertia (the lazy rock idea) plus the ground keep it still.",
 fail: "It does feel an equal force. Think back to inertia: a huge mass, stuck to the Earth, barely budges.",
 onDone: finish,
 });
 };
}

export function mountPairBridge(host, cfg) {
 const finish = once(() => cfg.onDone());
 let cancelled = false;
 let iv = null;
 let stage = "build";
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 });
 chemLabState.phase = "build";
 chemLabState.plBridgeCables = false;
 chemLabState.plBridgePillars = false;
 chemLabState.plBridgeWrong = false;
 chemLabState.plBridgeOk = false;
 chemLabState.plBridgeCar = 0;
 playScene("pairBridge", { phase: "build" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 4: Enactive</div>
 <h3 id="pl-br-title">Build a suspension bridge</h3>
 <div id="pl-br-body"></div>
 <p id="pl-br-status" class="drag-hint" aria-live="polite">Hang cables, stand pillars, then drive. Try the wrong rope for contrast.</p>
 <div class="btn-row">
 <button type="button" class="btn secondary" id="pl-br-c">Hang cables</button>
 <button type="button" class="btn secondary" id="pl-br-p">Stand pillars</button>
 <button type="button" class="btn secondary" id="pl-br-d">Drive car</button>
 <button type="button" class="btn secondary" id="pl-br-w">Wrong: floppy rope</button>
 </div>
 <button type="button" class="btn primary" id="pl-br-go" disabled>Optional: flex your arm ▶</button>
 </div>`;
 const title = host.querySelector("#pl-br-title");
 const body = host.querySelector("#pl-br-body");
 const status = host.querySelector("#pl-br-status");
 const go = host.querySelector("#pl-br-go");
 body.innerHTML = narrationHtml(
 "A suspension bridge only stands because tension and compression are both doing the job they are good at: cables pulling, pillars pushing. Neither one could do the other's job.",
 );
 host.querySelector("#pl-br-c").onclick = () => {
 chemLabState.plBridgeCables = true;
 chemLabState.plBridgeWrong = false;
 pulseSuccessFeedback(180);
 };
 host.querySelector("#pl-br-p").onclick = () => {
 chemLabState.plBridgePillars = true;
 chemLabState.plBridgeWrong = false;
 pulseSuccessFeedback(180);
 };
 host.querySelector("#pl-br-d").onclick = () => {
 if (chemLabState.plBridgeCables && chemLabState.plBridgePillars && !chemLabState.plBridgeWrong) {
 chemLabState.plBridgeCar = 0.02;
 chemLabState.plBridgeOk = true;
 pulseSuccessFeedback(180);
 } else {
 chemLabState.plBridgeWrong = true;
 pulseFailFeedback(280);
 }
 };
 host.querySelector("#pl-br-w").onclick = () => {
 chemLabState.plBridgeWrong = true;
 chemLabState.plBridgeOk = false;
 chemLabState.plBridgeCar = 0;
 pulseFailFeedback(300);
 };
 iv = setInterval(() => {
 if (cancelled || stage === "arm") return;
 if (chemLabState.plBridgeOk) {
 status.textContent = "Cables handle the pulling. Pillars handle the pushing.";
 go.disabled = false;
 } else if (chemLabState.plBridgeWrong) {
 status.textContent = "A floppy rope cannot stand in for a pillar.";
 }
 }, 160);
 go.onclick = () => {
 if (stage !== "arm") {
 stage = "arm";
 chemLabState.phase = "arm";
 playScene("pairBridge", { phase: "arm" });
 title.textContent = "Flex your arm (optional)";
 body.innerHTML = `${narrationHtml(
 "Muscles genuinely can only pull, never push. Every pushing motion your body makes, like straightening your arm, is secretly done by pulling a different muscle on the opposite side.",
 )}<div class="btn-row">
 <button type="button" class="btn secondary" id="pl-arm-bi">Contract bicep</button>
 <button type="button" class="btn secondary" id="pl-arm-tri">Contract tricep</button>
 </div>
 <p class="tiny-onscreen">Muscles can only pull. Bending and straightening both happen by pulling, on opposite sides of the joint.</p>`;
 status.textContent = "Optional. Try both, or skip ahead.";
 host.querySelector("#pl-br-c").style.display = "none";
 host.querySelector("#pl-br-p").style.display = "none";
 host.querySelector("#pl-br-d").style.display = "none";
 host.querySelector("#pl-br-w").style.display = "none";
 go.disabled = false;
 go.textContent = "Continue ▶";
 host.querySelector("#pl-arm-bi")?.addEventListener("click", () => {
 chemLabState.plArm = 0.2;
 pulseSuccessFeedback(160);
 });
 host.querySelector("#pl-arm-tri")?.addEventListener("click", () => {
 chemLabState.plArm = 0.8;
 pulseSuccessFeedback(160);
 });
 return;
 }
 finish();
 };
}

export function mountPairTeam(host, cfg) {
 const finish = once(() => cfg.onDone());
 let stage = "montage";
 trackCleanup(() => {});
 chemLabState.phase = "montage";
 playScene("pairTeam", { phase: "montage" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 4: Iconic</div>
 <h3 id="pl-tm-title">Teamwork you can see</h3>
 <div id="pl-tm-body"></div>
 <button type="button" class="btn primary" id="pl-tm-go">Keep three ideas ▶</button>
 </div>`;
 const title = host.querySelector("#pl-tm-title");
 const body = host.querySelector("#pl-tm-body");
 const go = host.querySelector("#pl-tm-go");
 body.innerHTML = `${narrationHtml(
 "Once you know to look for tension and compression, you will see this teamwork everywhere: bridges, cranes, tents, even the skeleton holding you up while your muscles quietly do all the pulling. Nothing here is a coincidence. It is the same two ideas from the start of this lesson, scaled up.",
 )}<p class="tiny-onscreen">Almost every strong structure, built or biological, is a teamwork of pulling parts and pushing parts.</p>`;
 go.onclick = () => {
 if (stage === "montage") {
 stage = "card";
 chemLabState.phase = "card";
 playScene("pairTeam", { phase: "card" });
 title.textContent = "Three ideas to keep";
 body.innerHTML = `${narrationHtml(
 "Pushing means compression and needs something rigid. Pulling means tension and can work through something flexible. And no matter which one you are doing, there is always an equal, opposite partner force acting back on you. What happens when all of these pushes and pulls on an object do not balance out evenly: that is exactly where we are headed next.",
 )}<p class="tiny-onscreen">Push → Compression (rods, pillars, bones).</p>
 <p class="tiny-onscreen">Pull → Tension (ropes, cables, muscles).</p>
 <p class="tiny-onscreen">Every push or pull → a matched, equal, opposite force on something else (Newton's Third Law).</p>`;
 go.textContent = "Continue ▶";
 return;
 }
 finish();
 };
}
