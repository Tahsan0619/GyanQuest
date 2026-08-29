/**
 * Levers & Gears DOM overlay - trading distance for force / speed for torque.
 */
import { labState, pulseFailFeedback, pulseSuccessFeedback } from "./lab-state.js?v=lev4";

const ROOT_ID = "lever-root";

const SORT_ITEMS = [
 { id: "scissors", label: "✂️ Scissors", bin: "lever" },
 { id: "opener", label: "🍾 Bottle opener", bin: "lever" },
 { id: "wheelbarrow", label: "🛒 Wheelbarrow", bin: "lever" },
 { id: "seesaw", label: "⚖ Seesaw", bin: "lever" },
 { id: "clock", label: "⏰ Wind-up clock", bin: "gear" },
 { id: "gearshift", label: "🚗 Gear shift", bin: "gear" },
 { id: "bicycle", label: "🚲 Bicycle", bin: "both" },
];

let lastRenderKey = "";
let pushTimer = null;
let liveHandlers = [];

function esc(s) {
 return String(s)
 .replace(/&/g, "&amp;")
 .replace(/</g, "&lt;")
 .replace(/>/g, "&gt;")
 .replace(/"/g, "&quot;");
}

function clearLiveHandlers() {
 liveHandlers.forEach((fn) => {
 try {
 fn();
 } catch {
 /* ignore */
 }
 });
 liveHandlers = [];
}

function track(el, event, fn) {
 if (!el) return;
 el.addEventListener(event, fn);
 liveHandlers.push(() => el.removeEventListener(event, fn));
}

function advanceGate() {
 if (typeof window.__gqSignalGateReady === "function") {
 window.__gqSignalGateReady({ forceAdvance: true });
 }
}

function notifyGateReady() {
 if (typeof window.__gqSignalGateReady === "function") {
 window.__gqSignalGateReady({});
 }
}

function forceForFulcrum(pos) {
 return Math.round(20 + pos * 75);
}

function travelForFulcrum(pos) {
 return Math.round(90 - pos * 60);
}

function sortComplete() {
 const slots = labState.levSortSlots || {};
 return SORT_ITEMS.filter((i) => i.bin !== "both").every((i) => slots[i.id] === i.bin);
}

function renderOpen() {
 return `
 <div class="lv-open-scene">
 <div class="lv-scene-row">
 <span class="lv-boulder">🪨</span>
 <span class="lv-plank-icon">🪵</span>
 <span class="lv-bike-icon">🚲</span>
 </div>
 <div class="lv-hill">⛰ Steep hill</div>
 <p class="lv-caption">Too heavy to lift by hand. Too steep to pedal wrong. Both about to get easy - not with more strength, but smarter force.</p>
 ${labState.levOpenReady ? "" : `<button type="button" class="btn primary" id="lv-try-lift">Try Lifting It →</button>`}
 </div>`;
}

function renderLever1() {
 if (!labState.levHandFailed) {
 return `
 <div class="lv-hand-scene">
 <div class="lv-boulder-big">🪨</div>
 <p class="lv-hint">Hold <strong>Push</strong> directly against the boulder.</p>
 <button type="button" class="btn primary lv-push-btn" id="lv-hand-push">Push (hold)</button>
 <div class="lv-meter-wrap">
 <span class="lv-meter-label">Force</span>
 <div class="lv-meter"><div class="lv-meter-fill" id="lv-hand-meter" style="width:0%"></div></div>
 </div>
 <p class="lv-note" id="lv-hand-note"></p>
 </div>`;
 }
 if (!labState.levPlankUsed) {
 return `
 <div class="lv-plank-scene">
 <div class="lv-lever-diagram">
 <div class="lv-effort-arm">↓ Your push</div>
 <div class="lv-plank-bar">
 <span class="lv-fulcrum-mark">▲</span>
 <span class="lv-load-end">🪨</span>
 </div>
 </div>
 <p class="lv-hint">Push down on the <strong>far end</strong> of the plank.</p>
 <button type="button" class="btn primary" id="lv-plank-push">Push down on plank →</button>
 <div class="lv-meter-wrap">
 <span class="lv-meter-label">Force needed</span>
 <div class="lv-meter"><div class="lv-meter-fill lv-meter-fill--low" style="width:35%"></div></div>
 </div>
 </div>`;
 }
 return `
 <div class="lv-success-scene">
 <div class="lv-boulder-lifted">🪨 ↑</div>
 <p class="lv-note lv-note--ok">Same boulder. Far less force. Only the tool changed.</p>
 </div>`;
}

function renderSeesaw1() {
 return `
 <div class="lv-seesaw-scene">
 <div class="lv-seesaw">
 <div class="lv-seesaw-side lv-seesaw-side--effort">
 <span>Effort</span>
 <small>Long travel · small push</small>
 <div class="lv-arrow lv-arrow--down">↓↓↓↓</div>
 </div>
 <div class="lv-seesaw-pivot">▲ Fulcrum</div>
 <div class="lv-seesaw-side lv-seesaw-side--load">
 <span>Load</span>
 <small>Short travel · big lift</small>
 <div class="lv-arrow lv-arrow--up">↑</div>
 </div>
 </div>
 <p class="lv-caption">Same machine as the plank - trading distance for force.</p>
 </div>`;
}

function renderTerms1() {
 return `
 <ul class="lv-term-list">
 <li><strong>Lever</strong> - rigid bar pivoting around a fixed point, moving a load with less force</li>
 <li><strong>Fulcrum</strong> - the fixed pivot point</li>
 <li><strong>Effort</strong> - force you apply</li>
 <li><strong>Load</strong> - weight or resistance being moved</li>
 </ul>`;
}

function renderFulcrum2() {
 const pos = labState.levFulcrumPos ?? 0.25;
 const force = forceForFulcrum(pos);
 const travel = travelForFulcrum(pos);
 return `
 <div class="lv-fulcrum-scene">
 <div class="lv-plank-slider-wrap">
 <div class="lv-plank-bar lv-plank-bar--slide" style="--lv-fulcrum:${pos}">
 <span class="lv-fulcrum-draggable" id="lv-fulcrum-handle">▲ Fulcrum</span>
 <span class="lv-load-end">🪨</span>
 </div>
 </div>
 <label class="lv-range-label">Slide fulcrum: closer to load = easier push, longer travel
 <input type="range" min="0" max="100" value="${Math.round(pos * 100)}" id="lv-fulcrum-range" class="lv-range" />
 </label>
 <button type="button" class="btn secondary" id="lv-fulcrum-push">Push on effort end →</button>
 <div class="lv-meter-wrap">
 <span class="lv-meter-label">Force: ${force}% · Hand travels: ${travel}%</span>
 <div class="lv-meter"><div class="lv-meter-fill" style="width:${force}%"></div></div>
 </div>
 <p class="lv-hint">Try fulcrum near the load AND near your hand.</p>
 </div>`;
}

function renderArms2() {
 return `
 <div class="lv-arms-compare">
 <div class="lv-arm-panel">
 <h4>Long effort arm</h4>
 <div class="lv-mini-lever lv-mini-lever--long">
 <span class="lv-hand-sm">👋 small push</span>
 <span class="lv-travel-long">━━━━ long ↓</span>
 <span class="lv-rock-sm">🪨 up</span>
 </div>
 <p>Less force · more distance</p>
 </div>
 <div class="lv-arm-panel">
 <h4>Short effort arm</h4>
 <div class="lv-mini-lever lv-mini-lever--short">
 <span class="lv-hand-sm">👋 BIG push</span>
 <span class="lv-travel-short">━ short ↓</span>
 <span class="lv-rock-sm">🪨 up</span>
 </div>
 <p>More force · less distance</p>
 </div>
 </div>
 <p class="lv-caption">Same job done - different split between force and distance.</p>`;
}

function renderTerms2() {
 return `
 <ul class="lv-term-list">
 <li><strong>Mechanical advantage</strong> - how much a machine multiplies your force</li>
 <li class="lv-term-note">Longer effort arm vs load arm → more advantage → less force, but your hand moves further. Total work stays the same.</li>
 </ul>`;
}

function renderGears3() {
 if (!labState.levGearCranked) {
 return `
 <div class="lv-gear-scene">
 <div class="lv-workflow"><span class="lv-wf is-on">Crank small</span><span class="lv-wf">Lift slow</span><span class="lv-wf">Torque</span></div>
 <div class="lv-gear-pair">
 <div class="lv-gear-disc" id="lv-gear-small" aria-hidden="true"></div>
 <div class="lv-gear-disc lv-gear-disc--lg" aria-hidden="true"></div>
 <div class="lv-weight">Weight</div>
 </div>
 <p class="lv-hint">Crank the <strong>small</strong> gear - it spins fast, large gear lifts slowly with more torque.</p>
 <button type="button" class="btn primary" id="lv-crank-lift">Turn crank →</button>
 </div>`;
 }
 if (!labState.levGearReversed) {
 return `
 <div class="lv-gear-scene">
 <div class="lv-workflow"><span class="lv-wf">Crank large</span><span class="lv-wf is-on">Spin fast</span><span class="lv-wf">Speed</span></div>
 <div class="lv-gear-pair lv-gear-pair--reverse">
 <div class="lv-gear-disc lv-gear-disc--lg" id="lv-gear-large-drive" aria-hidden="true"></div>
 <div class="lv-gear-disc" aria-hidden="true"></div>
 <div class="lv-fan">Fan</div>
 </div>
 <p class="lv-hint">Now crank the <strong>large</strong> gear - small gear spins the fan fast.</p>
 <button type="button" class="btn primary" id="lv-crank-reverse">Turn large gear →</button>
 </div>`;
 }
 return `
 <div class="lv-success-scene">
 <div class="lv-workflow"><span class="lv-wf is-on">Torque</span><span class="lv-wf is-on">or</span><span class="lv-wf is-on">Speed</span></div>
 <p class="lv-note lv-note--ok">Small→large: torque for lifting. Large→small: speed for spinning. Same trade.</p>
 </div>`;
}

function renderBike3() {
 return `
 <div class="lv-bike-scene">
 <div class="lv-bike-profile">🚲</div>
 <div class="lv-bike-gears">
 <div class="lv-bike-mode">
 <strong>Big rear gear</strong>
 <span>⛰ Hill - easier pedaling, more turns</span>
 </div>
 <div class="lv-bike-mode">
 <strong>Small rear gear</strong>
 <span>🛣 Flat road - harder start, fewer turns, more speed</span>
 </div>
 </div>
 <p class="lv-caption">Why bicycles have gears - same speed/torque trade as meshed gears.</p>
 </div>`;
}

function renderTerms3() {
 return `
 <ul class="lv-term-list">
 <li><strong>Gear</strong> - toothed wheel meshing with another to transmit rotation</li>
 <li><strong>Torque</strong> - turning/twisting force</li>
 <li><strong>Gear ratio</strong> - size relationship between meshed gears; sets speed vs torque trade</li>
 <li class="lv-term-note">Small driving → large driven: more torque, less speed. The opposite for speed.</li>
 </ul>`;
}

function renderSort4() {
 const slots = labState.levSortSlots || {};
 const core = SORT_ITEMS.filter((i) => i.bin !== "both");
 const unsorted = core.filter((i) => !slots[i.id]);
 const bike = SORT_ITEMS.find((i) => i.id === "bicycle");
 return `
 <div class="lv-sort-scene">
 <p class="lv-hint">Tap <strong>Lever</strong> or <strong>Gear</strong> for each object.</p>
 <div class="lv-sort-list">
 ${core.filter((i) => slots[i.id]).map((i) => `<div class="lv-sorted-row lv-sorted-row--ok">${i.label} → <strong>${slots[i.id]}</strong></div>`).join("")}
 ${unsorted.map((i) => `
 <div class="lv-sort-row">
 <span>${i.label}</span>
 <button type="button" class="btn secondary lv-assign" data-item="${i.id}" data-bin="lever">Lever</button>
 <button type="button" class="btn secondary lv-assign" data-item="${i.id}" data-bin="gear">Gear</button>
 </div>`).join("")}
 </div>
 ${sortComplete() && bike && !slots.bicycle ? `
 <div class="lv-sort-row lv-sort-row--bonus">
 <span>${bike.label}</span>
 <button type="button" class="btn primary lv-assign" data-item="bicycle" data-bin="both">Both! →</button>
 </div>` : ""}
 ${sortComplete() ? `<p class="lv-note lv-note--ok">Simple machines everywhere - once you know what to look for.</p>` : ""}
 </div>`;
}

function renderMontage4() {
 return `
 <div class="lv-montage">
 <div class="lv-montage-panel">
 <span>🪨🪵</span>
 <p>Boulder lifted with the plank lever</p>
 </div>
 <div class="lv-montage-panel">
 <span>🚲⛰</span>
 <p>Bicycle crests the hill in low gear</p>
 </div>
 </div>
 <p class="lv-caption">Neither problem needed more strength - just the right machine.</p>`;
}

function renderTerms4() {
 return `
 <ul class="lv-term-list">
 <li><strong>Lever</strong> - trades distance for applied force (straight-line)</li>
 <li><strong>Gear</strong> - trades rotational speed for torque (spinning)</li>
 <li class="lv-term-note">Both are simple machines - they rearrange force, distance, speed, and torque. Next: pulleys?</li>
 </ul>`;
}

function renderClose(u) {
 const p = Math.min(1, u || 0);
 return `
 <div class="lv-close-scene" style="--lv-close:${p}">
 <div class="lv-close-row">
 <span>🪨 → cart</span>
 <span>🚲 hill crest</span>
 </div>
 <p class="lv-caption">The right tool, not more strength.</p>
 </div>`;
}

function renderStage(mode) {
 switch (mode) {
 case "open": return renderOpen();
 case "lever1": return renderLever1();
 case "seesaw1": return renderSeesaw1();
 case "terms1": return renderTerms1();
 case "fulcrum2": return renderFulcrum2();
 case "arms2": return renderArms2();
 case "terms2": return renderTerms2();
 case "gears3": return renderGears3();
 case "bike3": return renderBike3();
 case "terms3": return renderTerms3();
 case "sort4": return renderSort4();
 case "montage4": return renderMontage4();
 case "terms4": return renderTerms4();
 case "close": return renderClose(labState.levCloseU);
 default: return renderOpen();
 }
}

function bindInteractions(root, onChange) {
 clearLiveHandlers();
 clearInterval(pushTimer);
 pushTimer = null;

 root.querySelector("#lv-try-lift")?.addEventListener("click", () => {
 labState.levOpenReady = true;
 pulseSuccessFeedback(320);
 onChange?.();
 advanceGate();
 });

 const handPush = root.querySelector("#lv-hand-push");
 if (handPush) {
 let meter = 0;
 const tick = () => {
 meter = Math.min(100, meter + 4);
 const el = root.querySelector("#lv-hand-meter");
 if (el) el.style.width = `${meter}%`;
 if (meter >= 95) {
 clearInterval(pushTimer);
 labState.levHandPushed = true;
 labState.levHandFailed = true;
 const note = root.querySelector("#lv-hand-note");
 if (note) note.textContent = "Maximum effort. Barely any movement.";
 pulseFailFeedback(400);
 onChange?.();
 }
 };
 handPush.addEventListener("mousedown", () => {
 pushTimer = setInterval(tick, 80);
 });
 handPush.addEventListener("mouseup", () => {
 if (!labState.levHandFailed) clearInterval(pushTimer);
 });
 handPush.addEventListener("mouseleave", () => {
 if (!labState.levHandFailed) clearInterval(pushTimer);
 });
 handPush.addEventListener("touchstart", (e) => {
 e.preventDefault();
 pushTimer = setInterval(tick, 80);
 });
 handPush.addEventListener("touchend", () => {
 if (!labState.levHandFailed) clearInterval(pushTimer);
 });
 }

 root.querySelector("#lv-plank-push")?.addEventListener("click", () => {
 labState.levPlankUsed = true;
 pulseSuccessFeedback(450);
 onChange?.();
 if (labState.levHandFailed && labState.levPlankUsed) notifyGateReady();
 });

 root.querySelector("#lv-fulcrum-range")?.addEventListener("input", (e) => {
 labState.levFulcrumPos = Number(e.target.value) / 100;
 onChange?.();
 });

 root.querySelector("#lv-fulcrum-push")?.addEventListener("click", () => {
 const pos = labState.levFulcrumPos ?? 0.25;
 if (pos <= 0.35) labState.levFulcrumTriedNearLoad = true;
 if (pos >= 0.65) labState.levFulcrumTriedNearEffort = true;
 pulseSuccessFeedback(280);
 onChange?.();
 if (labState.levFulcrumTriedNearLoad && labState.levFulcrumTriedNearEffort) notifyGateReady();
 });

 root.querySelector("#lv-crank-lift")?.addEventListener("click", () => {
 labState.levGearCranked = true;
 pulseSuccessFeedback(400);
 onChange?.();
 });

 root.querySelector("#lv-crank-reverse")?.addEventListener("click", () => {
 labState.levGearReversed = true;
 pulseSuccessFeedback(400);
 onChange?.();
 if (labState.levGearCranked && labState.levGearReversed) notifyGateReady();
 });

 root.querySelectorAll(".lv-assign").forEach((btn) => {
 track(btn, "click", () => {
 const id = btn.dataset.item;
 const bin = btn.dataset.bin;
 const item = SORT_ITEMS.find((i) => i.id === id);
 if (!item) return;
 if (bin === "both" && item.bin === "both") {
 labState.levSortSlots = { ...(labState.levSortSlots || {}), [id]: "both" };
 labState.levBikeBothFound = true;
 pulseSuccessFeedback(350);
 } else if (bin === item.bin) {
 labState.levSortSlots = { ...(labState.levSortSlots || {}), [id]: bin };
 pulseSuccessFeedback(300);
 } else {
 pulseFailFeedback(350);
 return;
 }
 if (sortComplete()) labState.levSortDone = true;
 onChange?.();
 if (labState.levSortDone) notifyGateReady();
 });
 });
}

const BANNERS = {
 open: "Boulder, plank, bicycle - force applied cleverly.",
 lever1: "Bare hands fail. The plank trades distance for force.",
 seesaw1: "Seesaw = same machine as the plank.",
 terms1: "Lever · Fulcrum · Effort · Load.",
 fulcrum2: "Where the fulcrum sits changes the deal.",
 arms2: "Long arm vs short arm - same height reached.",
 terms2: "Mechanical advantage - force vs distance.",
 gears3: "Small gear fast, large gear strong - crank both ways.",
 bike3: "Bicycle gears = speed/torque trade on the road.",
 terms3: "Gear · Torque · Gear ratio.",
 sort4: "Sort everyday levers and gears on the workbench.",
 montage4: "Opening problems - solved with the right machine.",
 terms4: "Simple machines - same underlying trade.",
 close: "The right tool, not more strength.",
};

function setCanvasOverlayMode(viewport, on) {
 const canvas = viewport?.querySelector("#c3d");
 if (!canvas) return;
 if (on) {
 canvas.dataset.leverOverlay = "1";
 canvas.style.pointerEvents = "none";
 canvas.style.opacity = "0";
 } else if (canvas.dataset.leverOverlay) {
 delete canvas.dataset.leverOverlay;
 canvas.style.pointerEvents = "";
 canvas.style.opacity = "";
 }
}

export function mountLever(viewport, onChange) {
 if (!viewport) return () => {};
 unmountLever(viewport);

 const root = document.createElement("div");
 root.id = ROOT_ID;
 root.className = "lever-root";
 root.innerHTML = `<p class="lv-banner" id="lv-banner"></p><div class="lv-stage" id="lv-stage"></div>`;
 viewport.appendChild(root);
 viewport.classList.add("viewport--lever");
 setCanvasOverlayMode(viewport, true);

 syncLever(labState.levMode || "open", { onChange });
 return () => unmountLever(viewport);
}

export function syncLever(mode, opts = {}) {
 labState.levMode = mode || labState.levMode || "open";
 const root = document.getElementById(ROOT_ID);
 if (!root) return;

 const renderKey = [
 labState.levMode,
 labState.levOpenReady ? 1 : 0,
 labState.levHandFailed ? 1 : 0,
 labState.levPlankUsed ? 1 : 0,
 labState.levFulcrumPos,
 labState.levFulcrumTriedNearLoad ? 1 : 0,
 labState.levFulcrumTriedNearEffort ? 1 : 0,
 labState.levGearPhase,
 labState.levGearCranked ? 1 : 0,
 labState.levGearReversed ? 1 : 0,
 JSON.stringify(labState.levSortSlots || {}),
 labState.levSortDone ? 1 : 0,
 labState.levBikeBothFound ? 1 : 0,
 Math.floor((labState.levCloseU || 0) * 20),
 ].join("|");

 const stage = root.querySelector("#lv-stage");
 const banner = root.querySelector("#lv-banner");

 if (stage && renderKey !== lastRenderKey) {
 stage.innerHTML = renderStage(labState.levMode);
 lastRenderKey = renderKey;
 bindInteractions(root, opts.onChange);
 if (labState.levMode === "open" && !labState.levOpenReady) {
 setTimeout(() => {
 if (!labState.levOpenReady && labState.levMode === "open") {
 labState.levOpenReady = true;
 opts.onChange?.();
 syncLever("open", opts);
 }
 }, 4500);
 }
 } else if (labState.levMode === "close" && stage) {
 stage.style.setProperty("--lv-close", String(labState.levCloseU || 0));
 }

 if (banner) banner.textContent = opts.banner || BANNERS[labState.levMode] || "";
}

export function unmountLever(viewport) {
 lastRenderKey = "";
 clearLiveHandlers();
 clearInterval(pushTimer);
 pushTimer = null;
 document.getElementById(ROOT_ID)?.remove();
 viewport?.classList.remove("viewport--lever");
 setCanvasOverlayMode(viewport, false);
}
