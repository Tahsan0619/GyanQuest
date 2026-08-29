/**
 * Input & Output - kitchen windows metaphor DOM overlay (viewport).
 * Continues the same kitchen from Mission 1 (chef, counter, pantry).
 */
import { labState, pulseSuccessFeedback, pulseFailFeedback } from "./lab-state.js";

const ROOT_ID = "io-kitchen-root";
let liveHandlers = [];

function esc(s) {
 return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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
 window.__gqSignalGateReady?.({ forceAdvance: true });
}

/** Shared kitchen shell - sealed or with windows */
function renderKitchenShell(opts = {}) {
 const {
 orderWindow = false,
 servingWindow = false,
 showChef = true,
 showCounter = true,
 showPantry = true,
 dishReady = false,
 flowIn = false,
 flowOut = false,
 sealed = true,
 } = opts;
 return `
 <div class="bk-io-kitchen ${sealed ? "is-sealed" : "is-open"}">
 <div class="bk-io-wall bk-io-wall--left">
 ${orderWindow ? `<div class="bk-io-window bk-io-window--in" title="Order window"><span>⌨️ IN</span></div>` : ""}
 </div>
 <div class="bk-io-interior">
 ${showChef ? `<div class="bk-chef">👨‍🍳</div>` : ""}
 ${showCounter ? `<div class="bk-counter"><span class="bk-zone-label">Counter (RAM)</span></div>` : ""}
 ${showPantry ? `<div class="bk-pantry"><span class="bk-zone-label">Pantry (Storage)</span><span class="bk-ingredient">📦</span></div>` : ""}
 ${dishReady ? `<div class="bk-dish">🍽️</div>` : ""}
 </div>
 <div class="bk-io-wall bk-io-wall--right">
 ${servingWindow ? `<div class="bk-io-window bk-io-window--out" title="Serving window"><span>🖥️ OUT</span></div>` : ""}
 </div>
 ${flowIn ? `<div class="bk-io-arrow bk-io-arrow--in">→ letters in</div>` : ""}
 ${flowOut ? `<div class="bk-io-arrow bk-io-arrow--out">← result out</div>` : ""}
 </div>`;
}

function renderOpen() {
 const ready = labState.ioOpenReady;
 return `
 <div class="bk-open">
 ${renderKitchenShell({ sealed: !ready, showChef: true, showCounter: true, showPantry: true })}
 <p class="bk-caption">${ready ? "Chef ready - but no way in or out yet." : "A sealed kitchen: no order window, no serving counter."}</p>
 ${ready ? "" : `<button type="button" class="btn primary bk-pulse" id="io-open-windows">Open the Windows →</button>`}
 </div>`;
}

function renderInput1() {
 const hasWindow = labState.ioOrderWindow;
 const typed = labState.ioTypedText || "";
 const sealedFail = labState.ioTypedSealed;
 const windowOk = labState.ioTypedWindow;
 const canCutWindow = sealedFail && !hasWindow;
 return `
 <div class="bk-io-scene">
 ${renderKitchenShell({ orderWindow: hasWindow, sealed: !hasWindow, flowIn: windowOk })}
 <div class="bk-io-type-panel">
 <label class="bk-io-type-label">Type an instruction for the chef:</label>
 <input type="text" class="bk-io-type-input" id="io-type-cmd" maxlength="20" placeholder="e.g. make soup" value="${esc(typed)}" />
 <button type="button" class="btn primary" id="io-send-cmd">Send →</button>
 </div>
 ${sealedFail && !hasWindow ? `<p class="bk-note bk-note--warn">No opening in the wall. The instruction never reaches the chef.</p>` : ""}
 ${windowOk ? `<p class="bk-note bk-note--ok">Letters flowed through the order window - chef received it!</p>` : ""}
 ${
 canCutWindow
 ? `<div class="bk-io-drag-bank">
 <p class="bk-hint">Now cut an order window - tap or drag a keyboard onto the wall:</p>
 <button type="button" class="bk-draggable" draggable="true" data-device="keyboard" id="io-kb-drag">⌨️ Keyboard</button>
 <div class="bk-io-drop-zone" id="io-wall-drop">Drop here → cut order window</div>
 </div>`
 : !hasWindow
 ? `<p class="bk-hint">First: type something and tap Send (with the wall still sealed).</p>`
 : `<p class="bk-hint">Order window open. Type and send again.</p>`
 }
 </div>`;
}

const INPUT_GALLERY = [
 { icon: "⌨️", name: "Keyboard", kind: "letters & commands" },
 { icon: "🖱️", name: "Mouse", kind: "clicks & movement" },
 { icon: "🎤", name: "Microphone", kind: "sound" },
 { icon: "📷", name: "Camera", kind: "images" },
 { icon: "📱", name: "Touchscreen", kind: "touch (tap in)" },
];

function renderInputGallery() {
 const phase = labState.ioGalleryPhase || 0;
 return `
 <div class="bk-io-gallery">
 <p class="bk-banner">Different devices - every arrow points in.</p>
 <div class="bk-io-gallery-grid">
 ${INPUT_GALLERY.map((d, i) => `
 <div class="bk-io-gallery-item ${i === phase % INPUT_GALLERY.length ? "is-active" : ""}">
 <span class="bk-io-gallery-icon">${d.icon}</span>
 <strong>${d.name}</strong>
 <span class="bk-io-arrow-mini">outside → 👨‍🍳</span>
 <em>${d.kind}</em>
 </div>`).join("")}
 </div>
 </div>`;
}

function renderTermsInput() {
 return `
 <div class="bk-terms">
 ${renderKitchenShell({ orderWindow: true, sealed: false })}
 <dl class="bk-def-list">
 <dt>Input device</dt>
 <dd>Hardware that sends information or instructions <em>into</em> a computer from the outside world.</dd>
 <dt>Examples</dt>
 <dd>Keyboard, mouse, microphone, camera, touchscreen, game controller</dd>
 </dl>
 </div>`;
}

function renderOutput1() {
 const hasWindow = labState.ioServingWindow;
 const outs = labState.ioOutputsAdded || {};
 const attempts = labState.ioServeAttempts || 0;
 const servedOk = attempts >= 2 && outs.monitor;
 return `
 <div class="bk-io-scene">
 ${renderKitchenShell({ orderWindow: true, servingWindow: hasWindow && outs.monitor, sealed: false, dishReady: true, flowOut: servedOk })}
 ${
 attempts < 1
 ? `<button type="button" class="btn primary" id="io-serve-fail">Serve the dish</button>
 <p class="bk-note bk-note--warn">The chef finished - but there's nowhere for the result to go. Tap Serve to see it stuck.</p>`
 : !hasWindow
 ? `<p class="bk-note bk-note--warn">Stuck! Cut a serving window - tap or drag an output device onto the wall.</p>
 <div class="bk-io-drag-bank">
 <button type="button" class="bk-draggable" draggable="true" data-device="monitor">🖥️ Monitor</button>
 <button type="button" class="bk-draggable" draggable="true" data-device="speaker">🔊 Speaker</button>
 <button type="button" class="bk-draggable" draggable="true" data-device="printer">🖨️ Printer</button>
 <div class="bk-io-drop-zone" id="io-out-drop">Drop on wall → serving window</div>
 </div>`
 : `<div class="bk-io-output-test">
 ${!servedOk ? `<button type="button" class="btn primary" id="io-serve-ok">Serve → screen</button>` : `<p class="bk-note bk-note--ok">Result left through the serving window!</p>`}
 ${outs.speaker ? `<button type="button" class="btn secondary" id="io-test-speaker">Test speaker 🔊</button>` : `<button type="button" class="bk-draggable" draggable="true" data-device="speaker">🔊 Add speaker</button>`}
 ${outs.printer ? `<button type="button" class="btn secondary" id="io-test-printer">Test printer 🖨️</button>` : `<button type="button" class="bk-draggable" draggable="true" data-device="printer">🖨️ Add printer</button>`}
 <p class="bk-hint">${outs.monitor ? "Monitor ✓" : ""} ${outs.speaker ? "Speaker ✓" : ""} ${outs.printer ? "Printer ✓" : ""}</p>
 </div>`
 }
 </div>`;
}

const OUTPUT_GALLERY = [
 { icon: "🖥️", name: "Screen", kind: "images & text" },
 { icon: "🔊", name: "Speaker", kind: "sound" },
 { icon: "🖨️", name: "Printer", kind: "ink on paper" },
];

function renderOutputGallery() {
 const phase = labState.ioGalleryPhase || 0;
 return `
 <div class="bk-io-gallery">
 <p class="bk-banner">Different devices - every arrow points out.</p>
 <div class="bk-io-gallery-grid">
 ${OUTPUT_GALLERY.map((d, i) => `
 <div class="bk-io-gallery-item ${i === phase % OUTPUT_GALLERY.length ? "is-active" : ""}">
 <span class="bk-io-gallery-icon">${d.icon}</span>
 <strong>${d.name}</strong>
 <span class="bk-io-arrow-mini">👨‍🍳 → outside</span>
 <em>${d.kind}</em>
 </div>`).join("")}
 </div>
 </div>`;
}

function renderTermsOutput() {
 return `
 <div class="bk-terms">
 ${renderKitchenShell({ orderWindow: true, servingWindow: true, sealed: false, flowOut: true })}
 <dl class="bk-def-list">
 <dt>Output device</dt>
 <dd>Hardware that sends information <em>out</em> of a computer to the user or outside world.</dd>
 <dt>Examples</dt>
 <dd>Monitor/screen, speakers, printer, headphones</dd>
 </dl>
 </div>`;
}

function renderBoth1() {
 const touchIn = labState.ioTouchIn;
 const touchOut = labState.ioTouchOut;
 const sortDone = labState.ioSortDone;
 const placed = labState.ioSortPlaced || {};
 const selected = labState.ioSortSelected || null;
 const chips = [
 { id: "kb", label: "⌨️ Keyboard" },
 { id: "mon", label: "🖥️ Monitor" },
 { id: "mic", label: "🎤 Mic" },
 { id: "print", label: "🖨️ Printer" },
 { id: "spk", label: "🔊 Speaker" },
 { id: "pad", label: "🎮 Game pad" },
 ];
 const byZone = { input: [], output: [], both: [] };
 chips.forEach((c) => {
 if (placed[c.id] && byZone[placed[c.id]]) byZone[placed[c.id]].push(c);
 });
 function zoneHtml(zone, title) {
 return `<div class="bk-io-sort-zone" data-zone="${zone}">
 <strong>${title}</strong>
 <div class="bk-io-sort-slot" id="slot-${zone}">
 ${byZone[zone].map((c) => `<span class="bk-io-placed">${c.label}</span>`).join("")}
 </div>
 </div>`;
 }
 return `
 <div class="bk-io-scene">
 <div class="bk-io-touch-demo">
 <p class="bk-banner">Touchscreen - one device, two jobs</p>
 <button type="button" class="bk-io-touchscreen ${touchIn ? "has-in" : ""}" id="io-touch-tap">
 📱 Tap me
 ${touchIn ? `<span class="bk-io-arrow-mini bk-io-arrow-mini--in">tap → IN</span>` : ""}
 ${touchOut ? `<span class="bk-io-arrow-mini bk-io-arrow-mini--out">OUT ← display</span>` : ""}
 </button>
 ${touchIn && touchOut ? `<p class="bk-note bk-note--ok">One tap in. One result out. Same device, both jobs.</p>` : `<p class="bk-hint">Tap the screen - watch input in, then output back.</p>`}
 </div>
 ${
 !sortDone
 ? `<div class="bk-io-sort">
 <p class="bk-hint">Tap a device, then tap a bin (Input Only / Output Only / Both). Wrong bin is rejected.</p>
 <div class="bk-io-sort-zones">
 ${zoneHtml("input", "Input Only")}
 ${zoneHtml("output", "Output Only")}
 ${zoneHtml("both", "Both")}
 </div>
 <div class="bk-io-sort-bank">
 ${chips
 .filter((c) => !placed[c.id])
 .map(
 (c) =>
 `<button type="button" class="bk-draggable bk-io-chip ${selected === c.id ? "is-selected" : ""}" draggable="true" data-chip="${c.id}">${c.label}</button>`
 )
 .join("")}
 </div>
 </div>`
 : `<p class="bk-note bk-note--ok">Most devices do one job. A few genuinely do both.</p>`
 }
 </div>`;
}

function renderBothDiagram() {
 return `
 <div class="bk-io-venn">
 <p class="bk-banner">Most devices sit on one side. A few straddle both.</p>
 <div class="bk-io-venn-diagram">
 <div class="bk-io-venn-circle bk-io-venn-circle--in">
 <span>Input Only</span>
 <small>⌨️ 🎤 🖱️</small>
 </div>
 <div class="bk-io-venn-circle bk-io-venn-circle--out">
 <span>Output Only</span>
 <small>🖥️ 🔊 🖨️</small>
 </div>
 <div class="bk-io-venn-overlap">
 <span>Both</span>
 <small>📱 🎮</small>
 </div>
 </div>
 </div>`;
}

function renderTermsBoth() {
 return `
 <div class="bk-terms">
 <dl class="bk-def-list">
 <dt>I/O device (Input/Output)</dt>
 <dd>Hardware that performs both input and output functions.</dd>
 <dt>Examples</dt>
 <dd>Touchscreens, some game controllers, network cards, external drives</dd>
 </dl>
 </div>`;
}

function renderCycle4() {
 const step = labState.ioCycleStep || 0;
 const swap = labState.ioAccessibleSwap;
 const steps = ["Input at order window", "Chef + RAM + storage", "Output at serving window"];
 return `
 <div class="bk-io-scene">
 ${renderKitchenShell({
 orderWindow: true,
 servingWindow: true,
 sealed: false,
 flowIn: step >= 1,
 flowOut: step >= 3,
 dishReady: step >= 2,
 })}
 <p class="bk-banner">Input → CPU, using RAM and storage → Output</p>
 ${
 !labState.ioCycleDone
 ? `<ol class="bk-program-steps">
 ${steps.map((s, i) => `<li class="${i + 1 < step ? "is-done" : i + 1 === step ? "is-current" : ""}">${s}</li>`).join("")}
 </ol>
 <button type="button" class="btn primary" id="io-cycle-next">${step === 0 ? "Type command & start" : step < 3 ? "Next step →" : "Finish cycle"}</button>
 <button type="button" class="btn secondary" id="io-swap-accessible">Swap to accessible switch (optional)</button>
 ${swap ? `<span class="bk-note">Using 🔘 single-switch input - same path in.</span>` : ""}`
 : `<p class="bk-note bk-note--ok">Complete journey: keystroke (or switch) → chef → screen.</p>`
 }
 </div>`;
}

function renderAccess4() {
 return `
 <div class="bk-io-access">
 <p class="bk-banner">Different bodies, different needs - same input/output idea.</p>
 <div class="bk-io-access-grid">
 <div class="bk-io-access-card"><span>⠿</span><strong>Braille display</strong><p>Output you read by touch</p></div>
 <div class="bk-io-access-card"><span>🎤</span><strong>Voice input</strong><p>Hands-free commands in</p></div>
 <div class="bk-io-access-card"><span>🎮</span><strong>Controller rumble</strong><p>Buttons in, vibration out</p></div>
 </div>
 </div>`;
}

function renderTermsCycle() {
 return `
 <div class="bk-terms bk-terms--summary">
 <ul class="bk-summary-list">
 <li><strong>Input device</strong> - sends information in</li>
 <li><strong>Output device</strong> - sends information out</li>
 <li><strong>I/O device</strong> - does both</li>
 <li><strong>Input → CPU/RAM/Storage → Output</strong> - the complete loop</li>
 </ul>
 <p class="bk-note"><em>Next: what tells the chef which instructions to run? (Software & OS)</em></p>
 </div>`;
}

function renderClose() {
 const u = labState.ioCloseU || 0;
 return `
 <div class="bk-close-scene">
 ${renderKitchenShell({
 orderWindow: true,
 servingWindow: true,
 sealed: false,
 flowIn: u > 0.2,
 flowOut: u > 0.2,
 showChef: true,
 })}
 <p class="bk-caption">Order window and serving window - traffic flowing both ways.</p>
 </div>`;
}

const SORT_ANSWERS = {
 kb: "input",
 mon: "output",
 mic: "input",
 print: "output",
 spk: "output",
 pad: "both",
};

function bindMode(root, mode, onChange) {
 if (mode === "open") {
 track(root.querySelector("#io-open-windows"), "click", () => {
 labState.ioOpenReady = true;
 pulseSuccessFeedback(280);
 onChange();
 advanceGate();
 });
 }
 if (mode === "input1") {
 const input = root.querySelector("#io-type-cmd");
 track(input, "input", () => {
 labState.ioTypedText = input?.value || "";
 });
 track(root.querySelector("#io-send-cmd"), "click", () => {
 const txt = (input?.value || labState.ioTypedText || "").trim();
 if (!txt) return;
 labState.ioTypedText = txt;
 if (!labState.ioOrderWindow) {
 labState.ioTypedSealed = true;
 pulseSuccessFeedback(120);
 onChange();
 } else {
 labState.ioTypedWindow = true;
 pulseSuccessFeedback(280);
 onChange();
 advanceGate();
 }
 });
 const openWindow = () => {
 if (!labState.ioTypedSealed) return;
 labState.ioOrderWindow = true;
 pulseSuccessFeedback(200);
 onChange();
 };
 const drop = root.querySelector("#io-wall-drop");
 root.querySelectorAll("[data-device=keyboard]").forEach((el) => {
 track(el, "dragstart", (e) => e.dataTransfer?.setData("text/plain", "keyboard"));
 track(el, "click", openWindow);
 });
 if (drop) {
 track(drop, "dragover", (e) => e.preventDefault());
 track(drop, "drop", (e) => {
 e.preventDefault();
 openWindow();
 });
 }
 }
 if (mode === "output1") {
 track(root.querySelector("#io-serve-fail"), "click", () => {
 labState.ioServeAttempts = (labState.ioServeAttempts || 0) + 1;
 pulseSuccessFeedback(100);
 onChange();
 });
 const addOut = (dev) => {
 labState.ioOutputsAdded = { ...(labState.ioOutputsAdded || {}), [dev]: true };
 if (dev === "monitor") labState.ioServingWindow = true;
 pulseSuccessFeedback(160);
 onChange();
 };
 const drop = root.querySelector("#io-out-drop");
 root.querySelectorAll(".bk-draggable[data-device]").forEach((el) => {
 const dev = el.dataset.device;
 track(el, "dragstart", (e) => e.dataTransfer?.setData("text/plain", dev));
 track(el, "click", () => addOut(dev));
 });
 if (drop) {
 track(drop, "dragover", (e) => e.preventDefault());
 track(drop, "drop", (e) => {
 e.preventDefault();
 addOut(e.dataTransfer?.getData("text/plain") || "monitor");
 });
 }
 track(root.querySelector("#io-serve-ok"), "click", () => {
 labState.ioServeAttempts = Math.max(1, labState.ioServeAttempts || 0);
 if (!labState.ioServingWindow) return;
 labState.ioServeAttempts = 2;
 pulseSuccessFeedback(280);
 onChange();
 advanceGate();
 });
 track(root.querySelector("#io-test-speaker"), "click", () => {
 labState.ioOutputsAdded.speaker = true;
 pulseSuccessFeedback(120);
 onChange();
 });
 track(root.querySelector("#io-test-printer"), "click", () => {
 labState.ioOutputsAdded.printer = true;
 pulseSuccessFeedback(120);
 onChange();
 });
 }
 if (mode === "both1") {
 track(root.querySelector("#io-touch-tap"), "click", () => {
 if (!labState.ioTouchIn) {
 labState.ioTouchIn = true;
 pulseSuccessFeedback(160);
 onChange();
 setTimeout(() => {
 labState.ioTouchOut = true;
 pulseSuccessFeedback(160);
 onChange();
 if (labState.ioSortDone) advanceGate();
 }, 800);
 } else if (!labState.ioTouchOut) {
 labState.ioTouchOut = true;
 onChange();
 if (labState.ioSortDone) advanceGate();
 }
 });
 function tryPlace(chipId, zone) {
 if (!chipId || !zone) return;
 if (SORT_ANSWERS[chipId] !== zone) {
 pulseFailFeedback(400);
 return;
 }
 labState.ioSortPlaced = { ...(labState.ioSortPlaced || {}), [chipId]: zone };
 labState.ioSortSelected = null;
 labState.placed = { ...labState.ioSortPlaced };
 const all = Object.keys(SORT_ANSWERS);
 if (all.every((k) => labState.ioSortPlaced[k])) {
 labState.ioSortDone = true;
 pulseSuccessFeedback(280);
 onChange();
 if (labState.ioTouchIn && labState.ioTouchOut) advanceGate();
 } else {
 pulseSuccessFeedback(120);
 onChange();
 }
 }
 root.querySelectorAll(".bk-io-chip").forEach((chip) => {
 track(chip, "dragstart", (e) => {
 e.dataTransfer?.setData("text/plain", chip.dataset.chip);
 labState.ioSortSelected = chip.dataset.chip;
 });
 track(chip, "click", () => {
 labState.ioSortSelected = chip.dataset.chip;
 onChange();
 });
 });
 root.querySelectorAll(".bk-io-sort-zone").forEach((zoneEl) => {
 const zone = zoneEl.dataset.zone;
 track(zoneEl, "dragover", (e) => e.preventDefault());
 track(zoneEl, "drop", (e) => {
 e.preventDefault();
 const id = e.dataTransfer?.getData("text/plain") || labState.ioSortSelected;
 tryPlace(id, zone);
 });
 track(zoneEl, "click", () => {
 if (labState.ioSortSelected) tryPlace(labState.ioSortSelected, zone);
 });
 });
 }
 if (mode === "cycle4") {
 track(root.querySelector("#io-cycle-next"), "click", () => {
 if ((labState.ioCycleStep || 0) >= 3) {
 labState.ioCycleDone = true;
 pulseSuccessFeedback(280);
 onChange();
 advanceGate();
 return;
 }
 labState.ioCycleStep = (labState.ioCycleStep || 0) + 1;
 pulseSuccessFeedback(160);
 onChange();
 if (labState.ioCycleStep >= 3) {
 // leave button as Finish cycle for explicit confirm
 }
 });
 track(root.querySelector("#io-swap-accessible"), "click", () => {
 labState.ioAccessibleSwap = true;
 pulseSuccessFeedback(160);
 onChange();
 });
 }
}

function renderMode(mode) {
 switch (mode) {
 case "open":
 return renderOpen();
 case "input1":
 return renderInput1();
 case "inputGallery":
 return renderInputGallery();
 case "termsInput":
 return renderTermsInput();
 case "output1":
 return renderOutput1();
 case "outputGallery":
 return renderOutputGallery();
 case "termsOutput":
 return renderTermsOutput();
 case "both1":
 return renderBoth1();
 case "bothDiagram":
 return renderBothDiagram();
 case "termsBoth":
 return renderTermsBoth();
 case "cycle4":
 return renderCycle4();
 case "access4":
 return renderAccess4();
 case "termsCycle":
 return renderTermsCycle();
 case "close":
 return renderClose();
 default:
 return renderOpen();
 }
}

export function mountIoKitchen(viewport, onChange) {
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
 root?.remove();
 viewport.classList.remove("viewport--bits-kitchen");
 };
}

export function syncIo(mode, opts = {}) {
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
 const m = mode || labState.ioMode || "open";
 const banner = opts.banner ? `<p class="bk-banner">${esc(opts.banner)}</p>` : "";
 root.innerHTML = `${banner}<div class="bk-stage">${renderMode(m)}</div>`;
 bindMode(root, m, opts.onChange || (() => syncIo(m, opts)));
}

export function unmountIoKitchen() {
 clearLiveHandlers();
 document.getElementById(ROOT_ID)?.remove();
 document.getElementById("viewport")?.classList.remove("viewport--bits-kitchen");
}
