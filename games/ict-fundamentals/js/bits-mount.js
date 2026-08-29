/**
 * Computer Bits - kitchen metaphor DOM overlay (viewport).
 */
import {
 labState,
 bitsBinaryString,
 bitsDecimalValue,
 pulseFailFeedback,
 pulseSuccessFeedback,
} from "./lab-state.js";

const ROOT_ID = "bits-kitchen-root";
let liveHandlers = [];
let animTimer = null;

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

function renderSwitchRow(interactive = true) {
 const bits = labState.bitsSwitches || [];
 return `
 <div class="bk-switch-row" role="group" aria-label="8 binary switches">
 ${bits
 .map(
 (on, i) => `
 <button type="button" class="bk-switch ${on ? "is-on" : ""}" data-bit="${i}" ${interactive ? "" : "disabled tabindex=-1"}
 aria-pressed="${on}" aria-label="Switch ${i + 1}, ${on ? "on" : "off"}">
 <span class="bk-switch-plate"></span>
 <span class="bk-switch-rocker"></span>
 </button>`
 )
 .join("")}
 </div>
 <div class="bk-readout">
 <span class="bk-binary">${bitsBinaryString()}</span>
 <span class="bk-decimal">= ${bitsDecimalValue()}</span>
 </div>`;
}

function renderOpen() {
 const ready = labState.bitsOpenReady;
 return `
 <div class="bk-open">
 <div class="bk-laptop ${ready ? "is-open is-awake" : ""}">
 <div class="bk-laptop-lid">
 <div class="bk-laptop-screen">
 ${ready ? `<div class="bk-laptop-icons"><span>📷</span><span>📄</span><span>🎮</span></div>` : ""}
 </div>
 </div>
 <div class="bk-laptop-base"></div>
 </div>
 <p class="bk-caption">${ready ? "Photo, document, and game loaded in under a second." : "A closed laptop on the table…"}</p>
 ${ready ? "" : `<button type="button" class="btn primary bk-pulse" id="bk-open-kitchen">Open the Kitchen →</button>`}
 </div>`;
}

function renderSwitches1() {
 return `
 <div class="bk-switches-scene">
 <p class="bk-banner">Every switch: only ON or OFF. Nothing in between.</p>
 ${renderSwitchRow(true)}
 <p class="bk-hint">Flip switches - watch the binary and decimal update live.</p>
 ${
 labState.bitsMaxFound
 ? `<p class="bk-note bk-note--ok">All 8 ON → 255. That's 256 unique patterns (counting zero).</p>`
 : `<button type="button" class="btn secondary" id="bk-find-max">Find the biggest number (optional)</button>`
 }
 </div>`;
}

function renderReinterpret1() {
 const bin = bitsBinaryString() || "01001101";
 const dec = bitsDecimalValue() || 77;
 const phase = labState.bitsReinterpretPhase || 0;
 const modes = [
 { icon: "🔢", label: "Number", value: dec },
 { icon: "🔤", label: "Letter", value: String.fromCharCode(dec % 256) },
 { icon: "🟦", label: "Pixel", value: `${Math.round((dec / 255) * 100)}% bright` },
 ];
 const m = modes[phase % 3];
 return `
 <div class="bk-reinterpret">
 <p class="bk-banner">Same pattern of switches - three different meanings.</p>
 ${renderSwitchRow(false)}
 <div class="bk-meaning-card bk-meaning-card--active">
 <span class="bk-meaning-icon">${m.icon}</span>
 <strong>${m.label}</strong>
 <span>${esc(String(m.value))}</span>
 </div>
 <div class="bk-meaning-tabs">
 ${modes.map((mm, i) => `<span class="bk-tab ${i === phase % 3 ? "is-active" : ""}">${mm.icon} ${mm.label}</span>`).join("")}
 </div>
 </div>`;
}

function renderTerms1() {
 return `
 <div class="bk-terms">
 <p class="bk-banner">Formal names for what you just flipped.</p>
 ${renderSwitchRow(false)}
 <dl class="bk-def-list">
 <dt>Bit</dt>
 <dd>A single binary digit: 0 or 1, off or on. The smallest unit of information.</dd>
 <dt>Byte</dt>
 <dd>A group of 8 bits - able to represent 256 different values.</dd>
 </dl>
 </div>`;
}

function renderChef2() {
 const speed = labState.bitsSpeedLevel || 0;
 const executed = labState.bitsChefExecuted;
 const dropped = labState.bitsChefDropped || {};
 const bothReady = !!(dropped["3"] && dropped["5"]);
 const counter = executed ? Math.floor(speed * 1200) : 0;
 return `
 <div class="bk-chef-scene">
 <div class="bk-kitchen-mini">
 <div class="bk-chef-station">
 <div class="bk-chef">👨‍🍳</div>
 <div class="bk-instruction-card">${executed && speed < 0.15 ? "Add these two numbers" : speed >= 0.15 ? "…" : "Add these two numbers"}</div>
 <div class="bk-ingredient-slots">
 <span class="bk-tile ${dropped["3"] || executed ? "is-used" : ""}">3</span>
 <span class="bk-op">+</span>
 <span class="bk-tile ${dropped["5"] || executed ? "is-used" : ""}">5</span>
 ${executed ? `<span class="bk-op">=</span><span class="bk-tile bk-tile--result">8</span>` : ""}
 </div>
 </div>
 </div>
 ${
 !executed
 ? `<div class="bk-chef-controls">
 <p class="bk-hint">Tap or drag 3 and 5 onto the station, then Execute.</p>
 <div class="bk-drag-bank">
 ${!dropped["3"] ? `<button type="button" class="bk-draggable" draggable="true" data-val="3">3</button>` : ""}
 ${!dropped["5"] ? `<button type="button" class="bk-draggable" draggable="true" data-val="5">5</button>` : ""}
 </div>
 <button type="button" class="btn primary" id="bk-execute" ${bothReady ? "" : "disabled"}>Execute</button>
 </div>`
 : `<div class="bk-speed-block">
 <p class="bk-hint">Now speed it up - real CPUs do billions per second.</p>
 <label class="bk-speed-label">Instruction speed
 <input type="range" class="bk-speed-range" id="bk-speed" min="0" max="100" value="${Math.round(speed * 100)}" />
 </label>
 <p class="bk-counter">${counter > 0 ? `${counter.toLocaleString()} instructions…` : "Slide toward fast →"}</p>
 </div>`
 }
 </div>`;
}

function renderLoop2() {
 const t = performance.now() / 1000;
 const speed = 1 + (labState.bitsSpeedLevel || 0.5) * 8;
 const phase = Math.floor((t * speed) % 4);
 const steps = ["Read Instruction", "Read Data", "Compute", "Produce Result"];
 const hz = Math.floor(1e9 * Math.min(1, 0.2 + (labState.bitsSpeedLevel || 0.5) * 0.8));
 return `
 <div class="bk-loop-scene">
 <p class="bk-banner">This 4-step loop, repeated billions of times per second, is all a CPU does.</p>
 <div class="bk-loop-diagram">
 ${steps
 .map(
 (s, i) => `
 <div class="bk-loop-step ${i === phase ? "is-active" : ""}">
 <span class="bk-loop-num">${i + 1}</span>
 <span>${s}</span>
 </div>
 ${i < 3 ? '<span class="bk-loop-arrow">→</span>' : ""}`
 )
 .join("")}
 <span class="bk-loop-arrow bk-loop-back">↻</span>
 </div>
 <p class="bk-speed-readout">~${(hz / 1e9).toFixed(1)} GHz</p>
 </div>`;
}

function renderTerms2() {
 return `
 <div class="bk-terms">
 <p class="bk-banner">That chef has a real name.</p>
 <div class="bk-chef-icon">👨‍🍳 → CPU</div>
 <dl class="bk-def-list">
 <dt>CPU (Central Processing Unit)</dt>
 <dd>Executes instructions and performs calculations - the computer's "brain."</dd>
 <dt>Instruction</dt>
 <dd>One single operation the CPU carries out (like adding two numbers).</dd>
 <dt>Clock speed</dt>
 <dd>Instruction cycles per second, measured in hertz (GHz = billions per second).</dd>
 </dl>
 </div>`;
}

function renderKitchen3() {
 const walk = labState.bitsPantryWalk || 0;
 const chefX = 30 + (labState.bitsFetchPantry && walk < 1 ? walk * 40 : 0);
 return `
 <div class="bk-kitchen-full">
 <div class="bk-kitchen-layout">
 <div class="bk-counter ${labState.bitsPowerOff ? "is-empty" : ""}">
 <span class="bk-zone-label">Countertop (RAM)</span>
 ${!labState.bitsPowerOff && labState.bitsFetchCounter ? `<span class="bk-ingredient bk-ingredient--fast">🥕 Salt</span>` : ""}
 ${labState.bitsPowerOff ? `<span class="bk-empty-note">Wiped clean</span>` : ""}
 </div>
 <div class="bk-chef-walker" style="--chef-x:${chefX}%">
 <span>👨‍🍳</span>
 </div>
 <div class="bk-pantry">
 <span class="bk-zone-label">Pantry (Storage)</span>
 <span class="bk-ingredient">🫙 Flour</span>
 <span class="bk-ingredient">🧈 Butter</span>
 </div>
 </div>
 <div class="bk-kitchen-actions">
 ${
 !labState.bitsFetchCounter
 ? `<button type="button" class="btn primary" id="bk-fetch-counter">Use ingredient on counter (fast)</button>`
 : !labState.bitsFetchPantry
 ? `<button type="button" class="btn primary" id="bk-fetch-pantry">Fetch from pantry (slower)</button>`
 : !labState.bitsPowerOff
 ? `<button type="button" class="btn secondary" id="bk-power-off">Power Off - close the kitchen</button>`
 : `<p class="bk-note bk-note--ok">Counter wiped. Pantry unchanged.</p>`
 }
 </div>
 </div>`;
}

function renderCompare3() {
 const power = labState.bitsPowerOff;
 return `
 <div class="bk-compare">
 <p class="bk-banner">Fast but forgetful. Slower but permanent. Every computer needs both.</p>
 <div class="bk-gauge-row">
 <div class="bk-gauge">
 <span>Countertop speed</span>
 <div class="bk-gauge-bar"><div class="bk-gauge-fill bk-gauge-fill--fast" style="width:92%"></div></div>
 </div>
 <div class="bk-gauge">
 <span>Pantry speed</span>
 <div class="bk-gauge-bar"><div class="bk-gauge-fill bk-gauge-fill--slow" style="width:35%"></div></div>
 </div>
 </div>
 <div class="bk-power-icons">
 <div class="bk-power-icon ${power ? "is-off" : "is-on"}">
 <span>⚡ Countertop</span>
 <span>${power ? "Empty" : "Stocked"}</span>
 </div>
 <div class="bk-power-icon is-on">
 <span>🏠 Pantry</span>
 <span>Always stocked</span>
 </div>
 </div>
 <button type="button" class="btn secondary" id="bk-toggle-power">${power ? "Power On" : "Power Off"}</button>
 <p class="bk-hint">Toggle power - countertop clears; pantry stays.</p>
 </div>`;
}

function renderTerms3() {
 return `
 <div class="bk-terms">
 <p class="bk-banner">Countertop and pantry - real names.</p>
 <dl class="bk-def-list">
 <dt>RAM (Random Access Memory)</dt>
 <dd>Fast, temporary working memory. <strong>Volatile</strong> - lost when power is off.</dd>
 <dt>Storage (SSD / hard drive)</dt>
 <dd>Slower, long-term memory. <strong>Non-volatile</strong> - stays without power.</dd>
 </dl>
 <p class="bk-note"><em>"Volatile" = disappears without power. RAM is volatile. Storage is not.</em></p>
 </div>`;
}

function renderProgram4() {
 const step = labState.bitsProgramStep || 0;
 const cramped = labState.bitsCrampedSeen;
 const steps = [
 "Fetch from storage → load onto counter (RAM)",
 "CPU processes - chef works through the data",
 "Result appears on screen - the running program",
 "Too little counter space - chef walks to pantry constantly (lag)",
 ];
 return `
 <div class="bk-program">
 <div class="bk-desktop-mini">
 <button type="button" class="bk-app-icon" ${step > 0 ? "disabled" : ""} id="bk-open-app">📂 Open Program</button>
 ${step >= 3 ? `<div class="bk-app-running">✨ Program running</div>` : ""}
 </div>
 ${
 step > 0 && step < 4
 ? `<ol class="bk-program-steps">
 ${steps
 .map(
 (s, i) =>
 `<li class="${i + 1 <= step ? "is-done" : i + 1 === step + 1 ? "is-current" : ""}">${s}</li>`
 )
 .join("")}
 </ol>
 <button type="button" class="btn primary" id="bk-program-next">Step ${step + 1} →</button>`
 : step >= 4 && !cramped
 ? `<div class="bk-cramped-kitchen">
 <p class="bk-banner">Not enough RAM - chef spends most time walking, not cooking.</p>
 <div class="bk-kitchen-layout bk-kitchen-layout--cramped">
 <div class="bk-counter bk-counter--tiny"><span class="bk-empty-note">Tiny counter</span></div>
 <div class="bk-chef-walker bk-chef-walker--busy"><span>👨‍🍳↔🫙</span></div>
 <div class="bk-pantry"><span class="bk-ingredient">📦 Program data</span></div>
 </div>
 <button type="button" class="btn primary" id="bk-see-cramped">See the slowdown</button>
 </div>`
 : cramped
 ? `<p class="bk-note bk-note--ok">That's exactly what "lag" is - not a broken computer, just a full counter.</p>`
 : `<p class="bk-hint">Tap Open Program to walk through all four steps.</p>`
 }
 </div>`;
}

function renderSpec4() {
 return `
 <div class="bk-spec">
 <p class="bk-banner">Now you can actually read a spec sheet.</p>
 <div class="bk-spec-sheet">
 <div class="bk-spec-line" data-link="ram"><strong>16GB RAM</strong><span class="bk-spec-arrow">↔ countertop size</span></div>
 <div class="bk-spec-line" data-link="storage"><strong>512GB SSD</strong><span class="bk-spec-arrow">↔ pantry size</span></div>
 <div class="bk-spec-line" data-link="cpu"><strong>3.5GHz CPU</strong><span class="bk-spec-arrow">↔ chef speed</span></div>
 </div>
 <div class="bk-spec-kitchen">
 <span class="bk-spec-part" id="bk-part-ram">Countertop</span>
 <span class="bk-spec-part" id="bk-part-storage">Pantry</span>
 <span class="bk-spec-part" id="bk-part-cpu">Chef</span>
 </div>
 </div>`;
}

function renderTerms4() {
 return `
 <div class="bk-terms bk-terms--summary">
 <p class="bk-banner">The whole kitchen, named.</p>
 <ul class="bk-summary-list">
 <li><strong>Bit → Byte</strong> - basic units of information</li>
 <li><strong>CPU</strong> - executes instructions (GHz)</li>
 <li><strong>RAM</strong> - fast, volatile working memory</li>
 <li><strong>Storage</strong> - slower, non-volatile long-term memory</li>
 </ul>
 <p class="bk-note"><em>Next: how does a result get to your screen or printer?</em></p>
 </div>`;
}

function renderClose() {
 const u = labState.bitsCloseU || 0;
 return `
 <div class="bk-close-scene">
 <div class="bk-laptop is-open is-awake">
 <div class="bk-laptop-lid">
 <div class="bk-laptop-screen">
 <div class="bk-laptop-icons"><span>📷</span><span>📄</span><span>🎮</span></div>
 ${u > 0.2 ? `<div class="bk-ghost-kitchen" style="opacity:${Math.min(0.7, u)}">
 <span>💡🔀👨‍🍳🧈</span>
 </div>` : ""}
 </div>
 </div>
 <div class="bk-laptop-base"></div>
 </div>
 <p class="bk-caption">Underneath: billions of switches, a chef in a blur, counter and pantry in perfect coordination.</p>
 </div>`;
}

function bindMode(root, mode, onChange) {
 if (mode === "open") {
 track(root.querySelector("#bk-open-kitchen"), "click", () => {
 labState.bitsOpenReady = true;
 pulseSuccessFeedback(280);
 onChange();
 advanceGate();
 });
 }
 if (mode === "switches1") {
 root.querySelectorAll(".bk-switch").forEach((btn) => {
 track(btn, "click", () => {
 const i = Number(btn.dataset.bit);
 labState.bitsSwitches[i] = labState.bitsSwitches[i] ? 0 : 1;
 labState.bitsSwitchFlips = (labState.bitsSwitchFlips || 0) + 1;
 if (labState.bitsSwitches.every((b) => b === 1)) labState.bitsMaxFound = true;
 pulseSuccessFeedback(120);
 onChange();
 if (labState.bitsSwitchFlips >= 2) advanceGate();
 });
 });
 track(root.querySelector("#bk-find-max"), "click", () => {
 labState.bitsSwitches = [1, 1, 1, 1, 1, 1, 1, 1];
 labState.bitsMaxFound = true;
 labState.bitsSwitchFlips = Math.max(labState.bitsSwitchFlips || 0, 2);
 pulseSuccessFeedback(200);
 onChange();
 advanceGate();
 });
 }
 if (mode === "chef2") {
 const execBtn = root.querySelector("#bk-execute");
 const dropZone = root.querySelector(".bk-chef-station");
 function placeVal(val) {
 if (!val || labState.bitsChefExecuted) return;
 labState.bitsChefDropped = { ...(labState.bitsChefDropped || {}), [val]: true };
 pulseSuccessFeedback(100);
 onChange();
 }
 root.querySelectorAll(".bk-draggable").forEach((el) => {
 track(el, "dragstart", (e) => {
 e.dataTransfer?.setData("text/plain", el.dataset.val || "");
 });
 track(el, "click", () => placeVal(el.dataset.val));
 });
 if (dropZone) {
 track(dropZone, "dragover", (e) => e.preventDefault());
 track(dropZone, "drop", (e) => {
 e.preventDefault();
 placeVal(e.dataTransfer?.getData("text/plain") || "");
 });
 }
 track(execBtn, "click", () => {
 const d = labState.bitsChefDropped || {};
 if (!(d["3"] && d["5"])) return;
 labState.bitsChefExecuted = true;
 pulseSuccessFeedback(280);
 onChange();
 });
 const speedEl = root.querySelector("#bk-speed");
 track(speedEl, "input", () => {
 labState.bitsSpeedLevel = Number(speedEl.value) / 100;
 // Avoid full remount while dragging the slider - update counter text only
 const counter = root.querySelector(".bk-counter");
 const n = Math.floor(labState.bitsSpeedLevel * 1200);
 if (counter) counter.textContent = n > 0 ? `${n.toLocaleString()} instructions…` : "Slide toward fast →";
 if (labState.bitsChefExecuted && labState.bitsSpeedLevel >= 0.5) advanceGate();
 });
 }
 if (mode === "kitchen3") {
 track(root.querySelector("#bk-fetch-counter"), "click", () => {
 labState.bitsFetchCounter = true;
 pulseSuccessFeedback(200);
 onChange();
 });
 track(root.querySelector("#bk-fetch-pantry"), "click", () => {
 labState.bitsFetchPantry = true;
 labState.bitsPantryWalk = 0;
 onChange();
 let t = 0;
 if (animTimer) clearInterval(animTimer);
 animTimer = setInterval(() => {
 t += 0.08;
 labState.bitsPantryWalk = Math.min(1, t);
 onChange();
 if (t >= 1) {
 clearInterval(animTimer);
 animTimer = null;
 }
 }, 80);
 });
 track(root.querySelector("#bk-power-off"), "click", () => {
 labState.bitsPowerOff = true;
 pulseSuccessFeedback(280);
 onChange();
 advanceGate();
 });
 }
 if (mode === "compare3") {
 track(root.querySelector("#bk-toggle-power"), "click", () => {
 labState.bitsPowerOff = !labState.bitsPowerOff;
 pulseSuccessFeedback(160);
 onChange();
 });
 }
 if (mode === "program4") {
 track(root.querySelector("#bk-open-app"), "click", () => {
 labState.bitsProgramStep = 1;
 pulseSuccessFeedback(160);
 onChange();
 });
 track(root.querySelector("#bk-program-next"), "click", () => {
 labState.bitsProgramStep = Math.min(4, (labState.bitsProgramStep || 0) + 1);
 pulseSuccessFeedback(160);
 onChange();
 });
 track(root.querySelector("#bk-see-cramped"), "click", () => {
 labState.bitsCrampedSeen = true;
 pulseSuccessFeedback(280);
 onChange();
 advanceGate();
 });
 }
 if (mode === "spec4") {
 root.querySelectorAll(".bk-spec-line").forEach((line) => {
 track(line, "mouseenter", () => {
 const link = line.dataset.link;
 root.querySelectorAll(".bk-spec-part").forEach((p) => p.classList.remove("is-lit"));
 root.querySelector(`#bk-part-${link}`)?.classList.add("is-lit");
 });
 });
 }
}

function renderMode(mode) {
 switch (mode) {
 case "open":
 return renderOpen();
 case "switches1":
 return renderSwitches1();
 case "reinterpret1":
 return renderReinterpret1();
 case "terms1":
 return renderTerms1();
 case "chef2":
 return renderChef2();
 case "loop2":
 return renderLoop2();
 case "terms2":
 return renderTerms2();
 case "kitchen3":
 return renderKitchen3();
 case "compare3":
 return renderCompare3();
 case "terms3":
 return renderTerms3();
 case "program4":
 return renderProgram4();
 case "spec4":
 return renderSpec4();
 case "terms4":
 return renderTerms4();
 case "close":
 return renderClose();
 default:
 return renderOpen();
 }
}

export function mountBitsKitchen(viewport, onChange) {
 if (!viewport) return () => {};
 viewport.classList.add("viewport--bits-kitchen");
 let root = document.getElementById(ROOT_ID);
 if (!root) {
 root = document.createElement("div");
 root.id = ROOT_ID;
 root.className = "bits-kitchen-root";
 viewport.appendChild(root);
 }
 return () => {
 clearLiveHandlers();
 if (animTimer) clearInterval(animTimer);
 animTimer = null;
 root?.remove();
 viewport.classList.remove("viewport--bits-kitchen");
 };
}

export function syncBits(mode, opts = {}) {
 const viewport = document.getElementById("viewport");
 let root = document.getElementById(ROOT_ID);
 if (!root && viewport) {
 root = document.createElement("div");
 root.id = ROOT_ID;
 root.className = "bits-kitchen-root";
 viewport.appendChild(root);
 viewport.classList.add("viewport--bits-kitchen");
 }
 if (!root) return;
 clearLiveHandlers();
 const m = mode || labState.bitsMode || "open";
 const banner = opts.banner ? `<p class="bk-banner">${esc(opts.banner)}</p>` : "";
 root.innerHTML = `${banner}<div class="bk-stage">${renderMode(m)}</div>`;
 bindMode(root, m, opts.onChange || (() => syncBits(m, opts)));
}

export function unmountBitsKitchen() {
 clearLiveHandlers();
 if (animTimer) clearInterval(animTimer);
 animTimer = null;
 document.getElementById(ROOT_ID)?.remove();
 document.getElementById("viewport")?.classList.remove("viewport--bits-kitchen");
}
