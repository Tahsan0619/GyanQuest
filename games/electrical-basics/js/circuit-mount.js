/**
 * Circuit Loop DOM overlay - electricity as water in a pipe loop.
 */
import { labState, pulseFailFeedback, pulseSuccessFeedback } from "./lab-state.js?v=loop4";

const ROOT_ID = "circuit-root";
const GAP_IDS = ["g1", "g2", "g3", "g4"];

let lastRenderKey = "";
let flowTimer = null;
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

function allGapsFilled() {
 return GAP_IDS.every((id) => labState.circGaps?.[id]);
}

function switchBlocksFlow() {
 return labState.circSwitchAdded && !labState.circSwitchClosed;
}

function isLoopClosed() {
 if (labState.circBulbRemoved) return allGapsFilled();
 if (switchBlocksFlow()) return false;
 return allGapsFilled() && !labState.circLoopBroken;
}

function bulbBrightness() {
 if (!isLoopClosed() || labState.circBulbRemoved) return 0;
 const b = labState.circBattery || "medium";
 let v = b === "weak" ? 0.28 : b === "strong" ? 1 : 0.62;
 if (labState.circWireThick) v = Math.min(1, v + 0.12);
 return v;
}

function renderBulb(lit) {
 const b = bulbBrightness();
 const on = lit && b > 0;
 return `
 <div class="ck-bulb ${on ? "is-lit" : ""}" style="--ck-glow:${b}">
 <div class="ck-bulb-glass">💡</div>
 <span class="ck-bulb-label">Bulb</span>
 </div>`;
}

function renderBattery() {
 const kind = labState.circBattery || "medium";
 const labels = { weak: "1.5 V", medium: "3 V", strong: "9 V" };
 return `
 <div class="ck-battery ck-battery--${kind}">
 <span class="ck-bat-plus">+</span>
 <span class="ck-bat-body">🔋</span>
 <span class="ck-bat-minus">−</span>
 <span class="ck-bat-label">${labels[kind] || "3 V"}</span>
 </div>`;
}

function renderGap(id, label) {
 const filled = !!labState.circGaps?.[id];
 const broken = labState.circLoopBroken && filled;
 const isSwitchSlot = id === "g3" && labState.circMode === "switch4";
 if (isSwitchSlot && labState.circSwitchAdded) {
 return `
 <div class="ck-gap ck-gap--switch">
 <button type="button" class="ck-switch ${labState.circSwitchClosed ? "is-closed" : "is-open"}" id="ck-toggle-switch" aria-pressed="${labState.circSwitchClosed}">
 <span class="ck-switch-lever"></span>
 <span class="ck-switch-label">${labState.circSwitchClosed ? "CLOSED" : "OPEN"}</span>
 </button>
 </div>`;
 }
 if (isSwitchSlot && !labState.circSwitchAdded) {
 return `
 <div class="ck-gap ck-gap--empty">
 <button type="button" class="btn secondary ck-add-switch" id="ck-add-switch">+ Add Switch</button>
 </div>`;
 }
 return `
 <button type="button" class="ck-gap ${filled ? "is-filled" : ""} ${broken ? "is-broken" : ""}" data-gap="${id}" ${filled && labState.circLoopClosed && !labState.circLoopBroken ? 'title="Click to break"' : ""}>
 ${filled ? `<span class="ck-wire-seg ${labState.circWireThick ? "is-thick" : ""}">〰 Wire</span>` : `<span class="ck-gap-label">${label}</span>`}
 </button>`;
}

function renderCircuitLoop(opts = {}) {
 const lit = isLoopClosed();
 const showFlow = lit && !labState.circBulbRemoved;
 return `
 <div class="ck-loop-scene ${showFlow ? "has-flow" : ""} ${labState.circWireThick ? "thick-wire" : ""}">
  <div class="ck-workflow">
   <span class="ck-wf ${allGapsFilled() ? "is-on" : ""}">Close loop</span>
   <span class="ck-wf ${showFlow ? "is-on" : ""}">Flow</span>
   <span class="ck-wf ${showFlow ? "is-on" : ""}">Work (glow)</span>
  </div>
  <div class="ck-loop-stack">
   ${renderBattery()}
   ${renderGap("g1", "Connect →")}
   ${labState.circBulbRemoved ? `<div class="ck-bypass">Plain wire bypass</div>` : renderBulb(lit)}
   ${renderGap("g2", "Connect ↓")}
   ${renderGap("g3", "Connect ←")}
   ${renderGap("g4", "Connect ↑")}
  </div>
  ${showFlow ? `
   <div class="ck-flow-ring" aria-hidden="true"></div>
   <div class="ck-particles" aria-hidden="true">
    <span class="ck-dot" style="--d:0"></span><span class="ck-dot" style="--d:1"></span>
    <span class="ck-dot" style="--d:2"></span><span class="ck-dot" style="--d:3"></span>
    <span class="ck-dot" style="--d:4"></span><span class="ck-dot" style="--d:5"></span>
   </div>` : ""}
  ${lit && !labState.circBulbRemoved ? '<p class="ck-note ck-note--ok">Complete loop - charge flows - bulb works.</p>' : ""}
  ${labState.circLoopBroken ? '<p class="ck-note ck-note--warn">One gap anywhere - instantly dark.</p>' : ""}
  ${opts.hint ? `<p class="ck-hint">${esc(opts.hint)}</p>` : ""}
 </div>`;
}

function renderOpen() {
 return `
 <div class="ck-open-scene">
 <div class="ck-open-parts">
 <div class="ck-part ck-part--dim">🔋<span>Battery</span></div>
 <div class="ck-part ck-part--dim">〰<span>Wire</span></div>
 <div class="ck-bulb"><div class="ck-bulb-glass">💡</div><span>Bulb (dark)</span></div>
 </div>
 <p class="ck-caption">All the ingredients for light - yet nothing happens until they form one unbroken loop.</p>
 ${labState.circOpenReady ? "" : `<button type="button" class="btn primary" id="ck-start-wire">Start Wiring →</button>`}
 </div>`;
}

function renderLoop1() {
 let hint = "Click each dashed gap to snap a wire segment - close the circle.";
 if (labState.circLoopEverClosed && !labState.circLoopBroken) {
 hint = "Loop closed! Now click any wire segment to break the loop.";
 }
 return renderCircuitLoop({ hint });
}

function renderPipe1() {
 return `
 <div class="ck-pipe-compare">
 <div class="ck-pipe-panel">
 <h4>Closed pipe loop</h4>
 <div class="ck-pipe-loop ck-pipe-loop--closed">
 <span class="ck-pump">⚙ Pump</span>
 <div class="ck-pipe-ring ck-pipe-ring--flow"></div>
 <span class="ck-wheel">⚙ Wheel</span>
 </div>
 <p>Water flows all the way around.</p>
 </div>
 <div class="ck-pipe-panel">
 <h4>Broken pipe loop</h4>
 <div class="ck-pipe-loop ck-pipe-loop--open">
 <span class="ck-pump">⚙ Pump</span>
 <div class="ck-pipe-ring ck-pipe-ring--spill"></div>
 <span class="ck-gap-mark">GAP</span>
 </div>
 <p>Flow stops the instant it hits the gap.</p>
 </div>
 </div>
 <p class="ck-caption">Electricity in wire behaves the same - just far too fast to see.</p>`;
}

function renderTerms1() {
 return `
 <ul class="ck-term-list">
 <li><strong>Circuit</strong> - a complete, unbroken path that allows electricity to flow</li>
 <li><strong>Closed circuit</strong> - no gaps; electricity flows</li>
 <li><strong>Open circuit</strong> - a gap anywhere; electricity does not flow</li>
 </ul>`;
}

function renderBattery2() {
 const tried = labState.circBatteriesTried || {};
 return `
 ${renderCircuitLoop({ hint: "Drag a battery into the slot - same loop, different push." })}
 <div class="ck-battery-tray">
 <p class="ck-tray-label">Swap the battery:</p>
 ${["weak", "medium", "strong"].map((k) => {
 const labels = { weak: "Weak · 1.5 V", medium: "Medium · 3 V", strong: "Strong · 9 V" };
 return `<button type="button" class="btn secondary ck-bat-chip ${labState.circBattery === k ? "is-active" : ""} ${tried[k] ? "was-tried" : ""}" data-battery="${k}">${labels[k]}</button>`;
 }).join("")}
 </div>
 <p class="ck-caption">More push → brighter bulb. Less push → dimmer bulb.</p>`;
}

function renderPump2() {
 return `
 <div class="ck-pump-row">
 ${[
 { k: "weak", label: "Weak pump", note: "Trickle - wheel barely turns" },
 { k: "medium", label: "Medium pump", note: "Steady flow - normal spin" },
 { k: "strong", label: "Strong pump", note: "Forceful flow - fast wheel" },
 ].map((p) => `
 <div class="ck-pump-card ck-pump-card--${p.k}">
 <div class="ck-pump-icon">⚙</div>
 <div class="ck-pump-flow ck-pump-flow--${p.k}"></div>
 <div class="ck-mini-wheel"></div>
 <strong>${p.label}</strong>
 <span>${p.note}</span>
 </div>`).join("")}
 </div>
 <p class="ck-caption">Pump strength ↔ battery voltage. Stronger push → brighter bulb downstream.</p>`;
}

function renderTerms2() {
 return `
 <ul class="ck-term-list">
 <li><strong>Battery</strong> - source of electrical push, driving electricity around a circuit</li>
 <li><strong>Voltage</strong> - how strongly a battery pushes, measured in <strong>volts (V)</strong></li>
 <li class="ck-term-note">AA battery ≈ 1.5 V · Car battery ≈ 12 V - a much stronger push.</li>
 </ul>`;
}

function renderFlow3() {
 let hint = "Watch the glowing particles flow around the loop.";
 if (!labState.circFlowSeen) hint = "Observe the particle stream, then try the actions below.";
 if (labState.circFlowSeen && !labState.circThickSwapped) hint = "Replace thin wire with thick wire - more flow gets through.";
 if (labState.circThickSwapped && !labState.circResistanceDone) hint = "Remove the bulb, then put it back - feel its resistance.";
 return `
 ${renderCircuitLoop({ hint })}
 <div class="ck-flow-actions">
 ${!labState.circFlowSeen ? `<button type="button" class="btn secondary" id="ck-see-flow">I'm watching the flow →</button>` : ""}
 ${labState.circFlowSeen && !labState.circThickSwapped ? `<button type="button" class="btn secondary" id="ck-thick-wire">Swap in thick wire →</button>` : ""}
 ${labState.circThickSwapped && !labState.circBulbRemoved ? `<button type="button" class="btn secondary" id="ck-remove-bulb">Remove bulb (plain wire) →</button>` : ""}
 ${labState.circBulbRemoved ? `<button type="button" class="btn primary" id="ck-restore-bulb">Put bulb back →</button>` : ""}
 </div>`;
}

function renderWheel3() {
 return `
 <div class="ck-wheel-scene">
 <div class="ck-wheel-pipe">
 <div class="ck-pipe-flow"></div>
 <div class="ck-water-wheel">⚙</div>
 <div class="ck-wheel-light">✨</div>
 </div>
 <p class="ck-caption">The wheel resists the flow just enough to spin - and that spin becomes light. The bulb does the same job electrically.</p>
 </div>`;
}

function renderTerms3() {
 return `
 <ul class="ck-term-list">
 <li><strong>Current</strong> - flow of electricity through a circuit, measured in <strong>amps (A)</strong></li>
 <li><strong>Resistance</strong> - anything that opposes the flow, measured in <strong>ohms (Ω)</strong></li>
 <li><strong>Wire</strong> - low-resistance path · <strong>Bulb (load)</strong> - useful resistance → light</li>
 <li class="ck-term-note">Bonus: voltage, current, and resistance connect as <strong>Ohm's Law</strong>.</li>
 </ul>`;
}

function renderSwitch4() {
 const hint = !labState.circSwitchAdded
 ? "Drag a switch into the gap - open position = dark."
 : labState.circSwitchClosed
 ? "Switch closed - loop complete. Toggle open to go dark."
 : "Switch open - deliberate gap. Flip closed to light up.";
 return `
 ${renderCircuitLoop({ hint })}
 ${labState.circSwitchAdded && labState.circSwitchClosed ? `<p class="ck-note ck-note--ok">Switch closed = loop complete = lit. On command.</p>` : ""}`;
}

function renderValve4() {
 return `
 <div class="ck-valve-compare">
 <div class="ck-valve-panel">
 <h4>Valve (water)</h4>
 <div class="ck-valve-diagram ${labState.circSwitchClosed ? "is-open" : "is-shut"}">
 <div class="ck-valve-body"></div>
 <span>${labState.circSwitchClosed ? "OPEN - flows" : "CLOSED - blocked"}</span>
 </div>
 </div>
 <div class="ck-valve-panel">
 <h4>Switch (electricity)</h4>
 <div class="ck-valve-diagram ${labState.circSwitchClosed ? "is-open" : "is-shut"}">
 <div class="ck-switch-mini ${labState.circSwitchClosed ? "is-closed" : "is-open"}"></div>
 <span>${labState.circSwitchClosed ? "CLOSED - flows" : "OPEN - blocked"}</span>
 </div>
 </div>
 </div>
 <p class="ck-caption">Same job, same idea - control the flow on command.</p>`;
}

function renderTerms4() {
 return `
 <ul class="ck-term-list">
 <li><strong>Circuit</strong> - the complete loop</li>
 <li><strong>Battery / Voltage</strong> - the push</li>
 <li><strong>Wire</strong> - the path · <strong>Current</strong> - the flow</li>
 <li><strong>Resistance / Bulb</strong> - converts flow into useful work</li>
 <li><strong>Switch</strong> - deliberate, controllable control over the loop</li>
 <li class="ck-term-note">Next: what happens with more than one bulb - series vs parallel?</li>
 </ul>`;
}

function renderClose(u) {
 const p = Math.min(1, u || 0);
 return `
 <div class="ck-close-scene" style="--ck-close:${p}">
 <div class="ck-close-loop">
 ${renderBattery()}
 ${renderBulb(p > 0.7)}
 <div class="ck-switch ck-switch--mini is-closed"></div>
 </div>
 <p class="ck-caption">Complete loop · push · resistance · control - the lights are on.</p>
 </div>`;
}

function renderStage(mode) {
 switch (mode) {
 case "open": return renderOpen();
 case "loop1": return renderLoop1();
 case "pipe1": return renderPipe1();
 case "terms1": return renderTerms1();
 case "battery2": return renderBattery2();
 case "pump2": return renderPump2();
 case "terms2": return renderTerms2();
 case "flow3": return renderFlow3();
 case "wheel3": return renderWheel3();
 case "terms3": return renderTerms3();
 case "switch4": return renderSwitch4();
 case "valve4": return renderValve4();
 case "terms4": return renderTerms4();
 case "close": return renderClose(labState.circCloseU);
 default: return renderOpen();
 }
}

function bindInteractions(root, onChange) {
 clearLiveHandlers();

 root.querySelector("#ck-start-wire")?.addEventListener("click", () => {
 labState.circOpenReady = true;
 pulseSuccessFeedback(320);
 onChange?.();
 advanceGate();
 });

 root.querySelectorAll("[data-gap]").forEach((btn) => {
 track(btn, "click", () => {
 const id = btn.dataset.gap;
 if (!labState.circGaps?.[id]) {
 labState.circGaps = { ...(labState.circGaps || {}), [id]: true };
 if (allGapsFilled()) {
 labState.circLoopClosed = true;
 labState.circLoopEverClosed = true;
 labState.circLoopBroken = false;
 pulseSuccessFeedback(400);
 }
 } else if (labState.circLoopClosed && !labState.circLoopBroken) {
 labState.circGaps = { ...(labState.circGaps || {}), [id]: false };
 labState.circLoopBroken = true;
 labState.circLoopClosed = false;
 pulseFailFeedback(420);
 }
 onChange?.();
 });
 });

 root.querySelectorAll("[data-battery]").forEach((btn) => {
 track(btn, "click", () => {
 labState.circBattery = btn.dataset.battery;
 labState.circBatteriesTried = { ...(labState.circBatteriesTried || {}), [btn.dataset.battery]: true };
 pulseSuccessFeedback(280);
 onChange?.();
 });
 });

 root.querySelector("#ck-see-flow")?.addEventListener("click", () => {
 labState.circFlowSeen = true;
 onChange?.();
 });

 root.querySelector("#ck-thick-wire")?.addEventListener("click", () => {
 labState.circWireThick = true;
 labState.circThickSwapped = true;
 pulseSuccessFeedback(300);
 onChange?.();
 });

 root.querySelector("#ck-remove-bulb")?.addEventListener("click", () => {
 labState.circBulbRemoved = true;
 pulseFailFeedback(350);
 onChange?.();
 });

 root.querySelector("#ck-restore-bulb")?.addEventListener("click", () => {
 labState.circBulbRemoved = false;
 labState.circResistanceDone = true;
 pulseSuccessFeedback(400);
 onChange?.();
 });

 root.querySelector("#ck-add-switch")?.addEventListener("click", () => {
 labState.circSwitchAdded = true;
 labState.circSwitchClosed = false;
 onChange?.();
 });

 root.querySelector("#ck-toggle-switch")?.addEventListener("click", () => {
 labState.circSwitchClosed = !labState.circSwitchClosed;
 labState.circSwitchToggles = (labState.circSwitchToggles || 0) + 1;
 if (labState.circSwitchClosed) {
 labState.circGaps = { ...(labState.circGaps || {}), g3: true };
 labState.circLoopClosed = allGapsFilled();
 labState.circLoopBroken = false;
 pulseSuccessFeedback(320);
 } else {
 labState.circGaps = { ...(labState.circGaps || {}), g3: false };
 labState.circLoopClosed = false;
 pulseFailFeedback(280);
 }
 onChange?.();
 });
}

const BANNERS = {
 open: "Battery, wire, bulb - disconnected. Why no light?",
 loop1: "Close the loop - then break it anywhere.",
 pipe1: "Closed pipe vs broken pipe - same rule as wire.",
 terms1: "Circuit · Closed circuit · Open circuit.",
 battery2: "Same loop - swap the battery's push.",
 pump2: "Pump strength ↔ battery voltage.",
 terms2: "Battery · Voltage · Volts (V).",
 flow3: "Watch the flow - thick wire, then the bulb's resistance.",
 wheel3: "Resistance becomes useful work - light.",
 terms3: "Current · Resistance · Wire · Load · Ohm's Law.",
 switch4: "Add a switch - a controllable gap.",
 valve4: "Valve ↔ Switch - control flow on command.",
 terms4: "Full vocabulary - circuit understood.",
 close: "The lights are on. You built the loop.",
};

export function mountCircuit(viewport, onChange) {
 if (!viewport) return () => {};
 unmountCircuit(viewport);

 const root = document.createElement("div");
 root.id = ROOT_ID;
 root.className = "circuit-root";
 root.innerHTML = `<p class="ck-banner" id="ck-banner"></p><div class="ck-stage" id="ck-stage"></div>`;
 viewport.appendChild(root);
 viewport.classList.add("viewport--circuit");

 syncCircuit(labState.circMode || "open", { onChange });
 return () => unmountCircuit(viewport);
}

export function syncCircuit(mode, opts = {}) {
 labState.circMode = mode || labState.circMode || "open";
 const root = document.getElementById(ROOT_ID);
 if (!root) return;

 const renderKey = [
 labState.circMode,
 JSON.stringify(labState.circGaps || {}),
 labState.circLoopClosed ? 1 : 0,
 labState.circLoopEverClosed ? 1 : 0,
 labState.circLoopBroken ? 1 : 0,
 labState.circBattery,
 JSON.stringify(labState.circBatteriesTried || {}),
 labState.circWireThick ? 1 : 0,
 labState.circBulbRemoved ? 1 : 0,
 labState.circFlowSeen ? 1 : 0,
 labState.circThickSwapped ? 1 : 0,
 labState.circResistanceDone ? 1 : 0,
 labState.circSwitchAdded ? 1 : 0,
 labState.circSwitchClosed ? 1 : 0,
 labState.circSwitchToggles || 0,
 labState.circOpenReady ? 1 : 0,
 Math.floor((labState.circCloseU || 0) * 20),
 ].join("|");

 const stage = root.querySelector("#ck-stage");
 const banner = root.querySelector("#ck-banner");

 if (stage && renderKey !== lastRenderKey) {
 stage.innerHTML = renderStage(labState.circMode);
 lastRenderKey = renderKey;
 bindInteractions(root, opts.onChange);
 if (labState.circMode === "open" && !labState.circOpenReady) {
 setTimeout(() => {
 if (!labState.circOpenReady && labState.circMode === "open") {
 labState.circOpenReady = true;
 opts.onChange?.();
 syncCircuit("open", opts);
 }
 }, 4500);
 }
 } else if (labState.circMode === "close" && stage) {
 stage.style.setProperty("--ck-close", String(labState.circCloseU || 0));
 }

 if (banner) banner.textContent = opts.banner || BANNERS[labState.circMode] || "";
}

export function unmountCircuit(viewport) {
 lastRenderKey = "";
 clearLiveHandlers();
 clearInterval(flowTimer);
 flowTimer = null;
 document.getElementById(ROOT_ID)?.remove();
 viewport?.classList.remove("viewport--circuit");
}
