/**
 * Strong Structures DOM overlay - shape, stability, load paths.
 */
import { labState, pulseFailFeedback, pulseSuccessFeedback } from "./lab-state.js?v=struct3";

const ROOT_ID = "struct-root";
const WEAK_FAIL_LOAD = 32;
const STRONG_FAIL_LOAD = 88;

let lastRenderKey = "";
let liveHandlers = [];

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

function square1Ready() {
 return labState.structSquarePushed && labState.structDiagonalAdded && labState.structBracedPushTried;
}

function renderOpen() {
 const collapsed = labState.structOpenReady;
 return `
 <div class="st-open-scene">
 <div class="st-square-frame ${collapsed ? "st-square-frame--collapsed" : ""}" aria-hidden="true">
 <span class="st-corner st-corner--tl"></span>
 <span class="st-corner st-corner--tr"></span>
 <span class="st-corner st-corner--bl"></span>
 <span class="st-corner st-corner--br"></span>
 </div>
 <p class="st-caption">${collapsed ? "Folded sideways - nothing broke, every rod still as strong." : "A gentle push - and the whole shape folds like paper."}</p>
 ${labState.structOpenReady ? "" : `<button type="button" class="btn primary" id="st-start-build">Start Building →</button>`}
 </div>`;
}

function renderSquare1() {
 if (!labState.structSquarePushed) {
 return `
 <div class="st-square-scene">
 <div class="st-square-frame st-square-frame--interactive" id="st-square-push" style="--st-skew:0deg">
 <span class="st-corner st-corner--tl"></span><span class="st-corner st-corner--tr"></span>
 <span class="st-corner st-corner--bl"></span><span class="st-corner st-corner--br"></span>
 </div>
 <p class="st-hint">Drag the slider to push the top of the square sideways.</p>
 <label class="st-range-label">Sideways push
 <input type="range" min="0" max="100" value="0" id="st-push-range" class="st-range" />
 </label>
 <p class="st-note">Four hinged corners - almost no resistance to folding.</p>
 </div>`;
 }
 if (!labState.structDiagonalAdded) {
 return `
 <div class="st-square-scene">
 <div class="st-square-frame st-square-frame--collapsed st-square-frame--braced-pending">
 <span class="st-corner st-corner--tl"></span><span class="st-corner st-corner--tr"></span>
 <span class="st-corner st-corner--bl"></span><span class="st-corner st-corner--br"></span>
 </div>
 <p class="st-hint">Add a diagonal rod - corner to corner - splitting it into two triangles.</p>
 <button type="button" class="btn primary" id="st-add-diagonal">Add diagonal brace →</button>
 </div>`;
 }
 if (!labState.structBracedPushTried) {
 return `
 <div class="st-square-scene">
 <div class="st-square-frame st-square-frame--rigid">
 <span class="st-corner st-corner--tl"></span><span class="st-corner st-corner--tr"></span>
 <span class="st-corner st-corner--bl"></span><span class="st-corner st-corner--br"></span>
 <span class="st-diagonal"></span>
 </div>
 <p class="st-hint">Try the <strong>same sideways push</strong> again.</p>
 <label class="st-range-label">Sideways push (braced)
 <input type="range" min="0" max="100" value="0" id="st-braced-push-range" class="st-range" />
 </label>
 <p class="st-note" id="st-braced-note"></p>
 </div>`;
 }
 return `
 <div class="st-success-scene">
 <div class="st-square-frame st-square-frame--rigid st-square-frame--small">
 <span class="st-diagonal"></span>
 </div>
 <p class="st-note st-note--ok">Same four rods. One diagonal. Now it genuinely will not fold.</p>
 </div>`;
}

function renderCompare1() {
 return `
 <div class="st-compare-row">
 <div class="st-compare-panel">
 <h4>Square</h4>
 <div class="st-square-frame st-square-frame--flex-demo">
 <span class="st-corner st-corner--tl"></span><span class="st-corner st-corner--tr"></span>
 <span class="st-corner st-corner--bl"></span><span class="st-corner st-corner--br"></span>
 </div>
 <p>Corner angles change freely - sides stay same length.</p>
 </div>
 <div class="st-compare-panel">
 <h4>Triangle</h4>
 <div class="st-triangle st-triangle--rigid"></div>
 <p>Angles locked - no fold without a side breaking.</p>
 </div>
 </div>
 <p class="st-caption">Triangles show up in bridges, towers, and roof frames - not decoration, geometry.</p>`;
}

function renderTerms1() {
 return `
 <ul class="st-term-list">
 <li><strong>Rigid shape</strong> - cannot change form without a side changing length</li>
 <li><strong>Truss</strong> - rigid framework built from triangles to support a load efficiently</li>
 <li class="st-term-note">Triangles are rigid on their own. Squares need a diagonal brace to become rigid too.</li>
 </ul>`;
}

function renderTower2() {
 const narrowToppled = labState.structWindNarrow;
 const wideRocked = labState.structWindWide;
 return `
 <div class="st-tower-row">
 <div class="st-tower-panel">
 <div class="st-tower st-tower--narrow ${narrowToppled ? "st-tower--toppled" : ""}">
 <div class="st-tower-body"></div>
 <div class="st-tower-base st-tower-base--narrow"></div>
 </div>
 <p>Narrow base</p>
 ${!narrowToppled ? `<button type="button" class="btn secondary" id="st-wind-narrow">Wind Gust →</button>` : `<p class="st-note st-note--fail">Toppled - rigid but unstable.</p>`}
 </div>
 <div class="st-tower-panel">
 <div class="st-tower st-tower--wide ${wideRocked ? "st-tower--rocked" : ""}">
 <div class="st-tower-body"></div>
 <div class="st-tower-base st-tower-base--wide"></div>
 </div>
 <p>Wide base</p>
 ${!wideRocked ? `<button type="button" class="btn secondary" id="st-wind-wide">Wind Gust →</button>` : `<p class="st-note st-note--ok">Rocked slightly - stayed upright.</p>`}
 </div>
 </div>
 <p class="st-hint">Same force, same height - only the base width changed.</p>`;
}

function renderCog2() {
 return `
 <div class="st-cog-row">
 <div class="st-cog-panel st-cog-panel--fail">
 <div class="st-tower st-tower--narrow st-tower--mini st-tower--toppled-static">
 <div class="st-cog-dot st-cog-dot--out"></div>
 </div>
 <div class="st-footprint st-footprint--narrow"></div>
 <p>CoG drifts outside base → topples</p>
 </div>
 <div class="st-cog-panel st-cog-panel--ok">
 <div class="st-tower st-tower--wide st-tower--mini">
 <div class="st-cog-dot"></div>
 </div>
 <div class="st-footprint st-footprint--wide"></div>
 <p>CoG stays over the wider footprint</p>
 </div>
 </div>
 <p class="st-caption">Topples the moment center of gravity leaves the base edge.</p>`;
}

function renderTerms2() {
 return `
 <ul class="st-term-list">
 <li><strong>Center of gravity</strong> - the point where a structure's entire weight balances</li>
 <li><strong>Base of support</strong> - the footprint on the ground</li>
 <li class="st-term-note">Stability rule: stay standing as long as center of gravity stays above the base of support.</li>
 </ul>`;
}

function renderBridge3() {
 if (!labState.structLoadGood) {
 return `
 <div class="st-bridge-scene">
 <div class="st-workflow"><span class="st-wf is-on">Drop load</span><span class="st-wf">Trace path</span><span class="st-wf">Compare</span></div>
 <div class="st-bridge st-bridge--good">
 <div class="st-bridge-deck"></div>
 <div class="st-truss"></div>
 <div class="st-pier st-pier--left"></div>
 <div class="st-pier st-pier--right"></div>
 <svg class="st-path-svg" viewBox="0 0 260 90" aria-hidden="true"><path class="st-load-path" d="M130 20 L130 45 L40 80 M130 45 L220 80" fill="none" stroke="#fbbf24" stroke-width="3"/></svg>
 </div>
 <p class="st-hint">Drop a weight on the middle of the bridge deck.</p>
 <button type="button" class="btn primary" id="st-drop-good">Drop weight →</button>
 </div>`;
 }
 if (!labState.structLoadWeak) {
 return `
 <div class="st-bridge-scene">
 <div class="st-workflow"><span class="st-wf">Good path</span><span class="st-wf is-on">Weak path</span><span class="st-wf">Fail</span></div>
 <div class="st-bridge st-bridge--good st-bridge--lit">
 <svg class="st-path-svg" viewBox="0 0 260 90" aria-hidden="true"><path class="st-load-path" d="M130 20 L130 45 L40 80 M130 45 L220 80" fill="none" stroke="#86efac" stroke-width="3"/></svg>
 <div class="st-bridge-deck"></div>
 <div class="st-truss"></div>
 </div>
 <div class="st-bridge st-bridge--weak">
 <div class="st-bridge-deck"></div>
 <div class="st-truss st-truss--thin"></div>
 <div class="st-pier st-pier--thin"></div>
 </div>
 <p class="st-hint">Same weight on a bridge with one thin off-center support.</p>
 <button type="button" class="btn primary" id="st-drop-weak">Drop weight on weak bridge →</button>
 </div>`;
 }
 return `
 <div class="st-success-scene">
 <div class="st-workflow"><span class="st-wf is-on">Load path failed</span></div>
 <div class="st-bridge st-bridge--weak st-bridge--buckled">
 <div class="st-pier st-pier--thin st-pier--crushed"></div>
 </div>
 <p class="st-note st-note--fail">All the weight funneled into one weak point - the column buckled.</p>
 </div>`;
}

function renderReal3() {
 return `
 <div class="st-real-montage">
 <div class="st-real-panel">
 <span class="st-real-icon">🌉</span>
 <p><strong>Truss bridge</strong> - load spreads through triangles into both piers.</p>
 </div>
 <div class="st-real-panel">
 <span class="st-real-icon">🏢</span>
 <p><strong>Building</strong> - roof weight travels down columns into a wide foundation.</p>
 </div>
 </div>
 <p class="st-caption">Every real bridge and building is doing this invisibly, right now.</p>`;
}

function renderTerms3() {
 return `
 <ul class="st-term-list">
 <li><strong>Load</strong> - any weight or force a structure must support</li>
 <li><strong>Load path</strong> - the route force travels through a structure down to the ground</li>
 <li><strong>Load distribution</strong> - spreading load across multiple supports, not one point</li>
 </ul>`;
}

function renderLoad4() {
 const load = labState.structLoadAmount || 0;
 const weakDead = load >= WEAK_FAIL_LOAD || labState.structWeakCollapsed;
 const weakClass = weakDead ? "st-bridge-mini--failed" : "";
 const strongFlex = load > 50 ? "st-bridge-mini--flex" : "";
 return `
 <div class="st-load-test">
 <div class="st-load-bridge-row">
 <div class="st-load-bridge-col">
 <p><strong>Weak design</strong></p>
 <div class="st-bridge-mini st-bridge-mini--weak ${weakClass}">
 <div class="st-bridge-mini-deck"></div>
 </div>
 <p class="st-load-readout">${weakDead ? `Failed at ~${WEAK_FAIL_LOAD} units` : "Unbraced square frame"}</p>
 </div>
 <div class="st-load-bridge-col">
 <p><strong>Strong design</strong></p>
 <div class="st-bridge-mini st-bridge-mini--strong ${strongFlex}">
 <div class="st-bridge-mini-deck"></div>
 <div class="st-bridge-mini-truss"></div>
 </div>
 <p class="st-load-readout">${load >= STRONG_FAIL_LOAD ? `Fails at ~${STRONG_FAIL_LOAD}` : `Holding at ${load} units`}</p>
 </div>
 </div>
 <label class="st-range-label">Add load to both bridges
 <input type="range" min="0" max="100" value="${load}" id="st-load-slider" class="st-range" />
 </label>
 <p class="st-hint">Push until the weak design fails - watch the strong design keep holding.</p>
 </div>`;
}

function renderSafe4() {
 return `
 <div class="st-safety-graph">
 <div class="st-graph-bar">
 <div class="st-graph-fail" style="--st-fail:88%"></div>
 <div class="st-graph-safe" style="--st-safe:45%"></div>
 </div>
 <div class="st-graph-labels">
 <span class="st-graph-label st-graph-label--safe">Safe working load</span>
 <span class="st-graph-label st-graph-label--fail">True failure point</span>
 </div>
 <p class="st-caption">Real structures never run near their breaking point - that gap is the <strong>safety factor</strong>.</p>
 </div>`;
}

function renderTerms4() {
 return `
 <ul class="st-term-list">
 <li><strong>Triangles/trusses</strong> → rigid shape, resists folding</li>
 <li><strong>Wide base</strong> → keeps center of gravity over the base, resists tipping</li>
 <li><strong>Load paths</strong> → spreads weight safely to the ground</li>
 <li><strong>Safety factor</strong> → designs carry far less than their true breaking point, on purpose</li>
 <li class="st-term-note">Next: what happens when a structure spans a gap with almost no support underneath - like an arch?</li>
 </ul>`;
}

function renderClose(u) {
 const p = Math.min(1, u || 0);
 return `
 <div class="st-close-scene" style="--st-close:${p}">
 <div class="st-close-steps">
 <span class="${p > 0.2 ? "st-close-lit" : ""}">▲ Brace</span>
 <span class="${p > 0.45 ? "st-close-lit" : ""}">◼ Wide base</span>
 <span class="${p > 0.7 ? "st-close-lit" : ""}">↓ Load path</span>
 <span class="${p > 0.9 ? "st-close-lit" : ""}">⚖ Holds weight</span>
 </div>
 <div class="st-square-frame st-square-frame--rigid st-square-frame--close ${p > 0.85 ? "st-square-frame--loaded" : ""}">
 <span class="st-diagonal"></span>
 </div>
 <p class="st-caption">Standing up isn't an accident - it's a decision, made shape by shape.</p>
 </div>`;
}

function renderStage(mode) {
 switch (mode) {
 case "open": return renderOpen();
 case "square1": return renderSquare1();
 case "compare1": return renderCompare1();
 case "terms1": return renderTerms1();
 case "tower2": return renderTower2();
 case "cog2": return renderCog2();
 case "terms2": return renderTerms2();
 case "bridge3": return renderBridge3();
 case "real3": return renderReal3();
 case "terms3": return renderTerms3();
 case "load4": return renderLoad4();
 case "safe4": return renderSafe4();
 case "terms4": return renderTerms4();
 case "close": return renderClose(labState.structCloseU);
 default: return renderOpen();
 }
}

function bindInteractions(root, onChange) {
 clearLiveHandlers();

 root.querySelector("#st-start-build")?.addEventListener("click", () => {
 labState.structOpenReady = true;
 pulseSuccessFeedback(320);
 onChange?.();
 advanceGate();
 });

 const pushRange = root.querySelector("#st-push-range");
 if (pushRange) {
 track(pushRange, "input", (e) => {
 const v = Number(e.target.value);
 const frame = root.querySelector("#st-square-push");
 if (frame) frame.style.setProperty("--st-skew", `${v * 0.18}deg`);
 if (v >= 75 && !labState.structSquarePushed) {
 labState.structSquarePushed = true;
 pulseFailFeedback(400);
 onChange?.();
 }
 });
 }

 root.querySelector("#st-add-diagonal")?.addEventListener("click", () => {
 labState.structDiagonalAdded = true;
 pulseSuccessFeedback(450);
 onChange?.();
 });

 const bracedRange = root.querySelector("#st-braced-push-range");
 if (bracedRange) {
 track(bracedRange, "input", (e) => {
 const v = Number(e.target.value);
 const note = root.querySelector("#st-braced-note");
 if (v >= 60) {
 bracedRange.value = "0";
 if (note) note.textContent = "Won't budge - the diagonal locked it into triangles.";
 if (!labState.structBracedPushTried) {
 labState.structBracedPushTried = true;
 pulseSuccessFeedback(400);
 onChange?.();
 if (square1Ready()) notifyGateReady();
 }
 } else if (note) {
 note.textContent = v > 20 ? "Still rigid - try pushing harder." : "";
 }
 });
 }

 root.querySelector("#st-wind-narrow")?.addEventListener("click", () => {
 labState.structWindNarrow = true;
 pulseFailFeedback(450);
 onChange?.();
 if (labState.structWindNarrow && labState.structWindWide) notifyGateReady();
 });

 root.querySelector("#st-wind-wide")?.addEventListener("click", () => {
 labState.structWindWide = true;
 pulseSuccessFeedback(350);
 onChange?.();
 if (labState.structWindNarrow && labState.structWindWide) notifyGateReady();
 });

 root.querySelector("#st-drop-good")?.addEventListener("click", () => {
 labState.structLoadGood = true;
 pulseSuccessFeedback(400);
 onChange?.();
 });

 root.querySelector("#st-drop-weak")?.addEventListener("click", () => {
 labState.structLoadWeak = true;
 pulseFailFeedback(500);
 onChange?.();
 if (labState.structLoadGood && labState.structLoadWeak) notifyGateReady();
 });

 const loadSlider = root.querySelector("#st-load-slider");
 if (loadSlider) {
 track(loadSlider, "input", (e) => {
 labState.structLoadAmount = Number(e.target.value);
 if (labState.structLoadAmount >= WEAK_FAIL_LOAD) labState.structWeakCollapsed = true;
 if (labState.structWeakCollapsed && labState.structLoadAmount >= WEAK_FAIL_LOAD + 5) {
 labState.structLoadTestDone = true;
 notifyGateReady();
 }
 onChange?.();
 });
 }
}

const BANNERS = {
 open: "Square frame folds - nothing broke, shape failed.",
 square1: "Push the square, brace it, push again.",
 compare1: "Square flexes; triangle stays rigid.",
 terms1: "Rigid shape · Truss.",
 tower2: "Rigid can still tip - base width matters.",
 cog2: "Center of gravity vs base footprint.",
 terms2: "CoG · Base of support · Stability rule.",
 bridge3: "Trace the load - spread it or funnel it.",
 real3: "Real bridges and buildings - same paths.",
 terms3: "Load · Load path · Load distribution.",
 load4: "Weak vs strong design - load until failure.",
 safe4: "Safe working load vs true failure - safety factor.",
 terms4: "Four ideas that explain why structures stand.",
 close: "Standing on purpose.",
};

function setCanvasOverlayMode(viewport, on) {
 const canvas = viewport?.querySelector("#c3d");
 if (!canvas) return;
 if (on) {
 canvas.dataset.structOverlay = "1";
 canvas.style.pointerEvents = "none";
 canvas.style.opacity = "0";
 } else if (canvas.dataset.structOverlay) {
 delete canvas.dataset.structOverlay;
 canvas.style.pointerEvents = "";
 canvas.style.opacity = "";
 }
}

export function mountStruct(viewport, onChange) {
 if (!viewport) return () => {};
 unmountStruct(viewport);

 const root = document.createElement("div");
 root.id = ROOT_ID;
 root.className = "struct-root";
 root.innerHTML = `<p class="st-banner" id="st-banner"></p><div class="st-stage" id="st-stage"></div>`;
 viewport.appendChild(root);
 viewport.classList.add("viewport--struct");
 setCanvasOverlayMode(viewport, true);

 syncStruct(labState.structMode || "open", { onChange });
 return () => unmountStruct(viewport);
}

export function syncStruct(mode, opts = {}) {
 labState.structMode = mode || labState.structMode || "open";
 const root = document.getElementById(ROOT_ID);
 if (!root) return;

 const renderKey = [
 labState.structMode,
 labState.structOpenReady ? 1 : 0,
 labState.structSquarePushed ? 1 : 0,
 labState.structDiagonalAdded ? 1 : 0,
 labState.structBracedPushTried ? 1 : 0,
 labState.structWindNarrow ? 1 : 0,
 labState.structWindWide ? 1 : 0,
 labState.structLoadGood ? 1 : 0,
 labState.structLoadWeak ? 1 : 0,
 labState.structLoadAmount,
 labState.structWeakCollapsed ? 1 : 0,
 labState.structLoadTestDone ? 1 : 0,
 Math.floor((labState.structCloseU || 0) * 20),
 ].join("|");

 const stage = root.querySelector("#st-stage");
 const banner = root.querySelector("#st-banner");

 if (stage && renderKey !== lastRenderKey) {
 stage.innerHTML = renderStage(labState.structMode);
 lastRenderKey = renderKey;
 bindInteractions(root, opts.onChange);
 if (labState.structMode === "open" && !labState.structOpenReady) {
 setTimeout(() => {
 if (!labState.structOpenReady && labState.structMode === "open") {
 labState.structOpenReady = true;
 opts.onChange?.();
 syncStruct("open", opts);
 }
 }, 4500);
 }
 } else if (labState.structMode === "close" && stage) {
 stage.style.setProperty("--st-close", String(labState.structCloseU || 0));
 }

 if (banner) banner.textContent = opts.banner || BANNERS[labState.structMode] || "";
}

export function unmountStruct(viewport) {
 lastRenderKey = "";
 clearLiveHandlers();
 document.getElementById(ROOT_ID)?.remove();
 viewport?.classList.remove("viewport--struct");
 setCanvasOverlayMode(viewport, false);
}
