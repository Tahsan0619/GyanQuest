/**
 * JS Clicks DOM overlay - real event listeners on switches, bulbs, doorbell, toggle.
 * Continues the styled HTML house from CSS Style (structure → style → behavior).
 */
import { labState, pulseFailFeedback, pulseSuccessFeedback } from "./lab-state.js?v=jshouse1";

const ROOT_ID = "js-house-root";

const RECIPE_STEPS = [
 { id: "yellow", text: "Turn bulb color to yellow" },
 { id: "bright", text: "Change the room brightness to high" },
 { id: "sign", text: "Update the sign to say 'Lights ON'" },
];

const SWITCH_ROOMS = [
 { id: "kitchen", label: "Kitchen" },
 { id: "hallway", label: "Hallway" },
 { id: "bedroom", label: "Bedroom" },
];

let lastRenderKey = "";
let openTimer = null;
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
 el.addEventListener(event, fn);
 liveHandlers.push(() => el.removeEventListener(event, fn));
}

/** Painted house shell (CSS Style end-state colors). */
function renderStyledHouse(inner = "", opts = {}) {
 const { deadSwitch = false, showBulb = true, compact = false } = opts;
 const bulbOn = labState.jsBulbLit && !deadSwitch;
 return `
 <div class="jh-house ${compact ? "jh-house--compact" : ""}">
 <div class="jh-room jh-room--header" style="background:#7dd3fc"><span class="jh-tag">&lt;header&gt;</span>Site title</div>
 <div class="jh-room jh-room--hero" style="background:#c4b5fd"><span class="jh-tag">&lt;div.hero&gt;</span>Welcome banner</div>
 <div class="jh-room jh-room--main" style="background:#fef3c7">
 <span class="jh-tag">&lt;main&gt;</span>
 <div class="jh-switch-row">
 <button type="button" class="jh-switch ${deadSwitch ? "is-dead" : ""}" id="js-main-switch" aria-label="Light switch">⚡</button>
 ${showBulb ? `<div class="jh-bulb ${bulbOn ? "is-on" : ""}" id="js-main-bulb" aria-hidden="true"></div>` : ""}
 </div>
 ${inner}
 </div>
 <div class="jh-room jh-room--footer" style="background:#94a3b8"><span class="jh-tag">&lt;footer&gt;</span>Contact · ©</div>
 </div>`;
}

function renderOpen() {
 return renderStyledHouse("", { deadSwitch: true, showBulb: true });
}

function renderWire() {
 const wired = labState.jsWireDropped && labState.jsConnectorDropped;
 return `
 <div class="jh-wire-scene">
 <div class="jh-wire-col">
 <p class="jh-hint">Wire it up: drag the wire, drop the connector, then click the switch.</p>
 <div class="jh-wire-panel ${wired ? "is-wired" : ""}">
 <button type="button" class="jh-switch" id="js-switch-wired">⚡</button>
 <div class="jh-wire-slot ${labState.jsWireDropped ? "is-filled" : ""}" id="js-wire-slot">
 ${labState.jsWireDropped ? '<span class="jh-wire-line"></span>' : ""}
 </div>
 <div class="jh-connector-slot ${labState.jsConnectorDropped ? "is-filled" : ""}" id="js-connector-slot">
 ${!labState.jsConnectorDropped ? "" : '<span class="jh-connector-chip">When clicked → turn on</span>'}
 </div>
 <div class="jh-bulb ${labState.jsBulbLit ? "is-on" : ""}" id="js-bulb-wired"></div>
 </div>
 ${!labState.jsWireDropped ? '<div class="jh-tray-chip" draggable="true" data-drag="wire">🔌 Wire</div>' : ""}
 ${labState.jsWireDropped && !labState.jsConnectorDropped ? '<div class="jh-tray-chip" draggable="true" data-drag="connector">When clicked → turn on</div>' : ""}
 </div>
 <div class="jh-wire-col jh-wire-col--dim">
 <p class="jh-hint">Try without the wire:</p>
 <div class="jh-wire-panel">
 <button type="button" class="jh-switch" id="js-switch-unwired">⚡</button>
 <div class="jh-bulb" id="js-bulb-unwired"></div>
 </div>
 </div>
 </div>`;
}

function renderFlow1() {
 return `
 <div class="jh-flow">
 <div class="jh-flow-node">🖱 click happens</div>
 <div class="jh-flow-arrow">→</div>
 <div class="jh-flow-node">⚙ code runs</div>
 <div class="jh-flow-arrow">→</div>
 <div class="jh-flow-node jh-flow-node--lit">💡 bulb lights up</div>
 </div>
 <p class="jh-caption">Something happens (an event) → code runs → something changes on screen.</p>`;
}

function renderCode1() {
 return `
 <pre class="jh-code"><code>switch.addEventListener("click", function() {
  bulb.turnOn();
});</code></pre>
 <ul class="jh-term-list">
 <li><strong>Event</strong> - something that happens (click, hover, key press)</li>
 <li><strong>Event listener</strong> - code that listens for a specific event on an element</li>
 <li><strong>JavaScript</strong> - the language that makes webpages interactive</li>
 </ul>`;
}

function renderRecipe() {
 const placed = labState.jsRecipeSteps || [];
 const named = labState.jsRecipeNamed;
 const connected = labState.jsFunctionConnected || [];
 const allSteps = placed.length >= 3;
 return `
 <div class="jh-recipe-scene">
 <div class="jh-recipe-card ${allSteps ? "is-sealed" : ""}">
 <h4>${named ? "turnOnLight" : "New Instruction Set"}</h4>
 <ol class="jh-recipe-slots">
 ${[0, 1, 2].map((i) => {
 const step = placed[i];
 return `<li class="jh-recipe-slot ${step ? "is-filled" : ""}" data-slot="${i}">${step ? esc(RECIPE_STEPS.find((s) => s.id === step)?.text || step) : "Drop step here"}</li>`;
 }).join("")}
 </ol>
 ${allSteps && !named ? `<button type="button" class="btn secondary jh-name-btn" id="js-name-recipe">Name it: turnOnLight</button>` : ""}
 </div>
 ${!allSteps
 ? `<div class="jh-tray">${RECIPE_STEPS.filter((s) => !placed.includes(s.id)).map((s) => `<div class="jh-tray-chip" draggable="true" data-step="${s.id}">${esc(s.text)}</div>`).join("")}</div>`
 : ""}
 ${named ? `
 <div class="jh-switch-grid">
 ${SWITCH_ROOMS.map((r) => `
 <div class="jh-switch-room ${connected.includes(r.id) ? "is-connected" : ""}" data-room-switch="${r.id}">
 <span>${esc(r.label)}</span>
 <button type="button" class="jh-switch jh-switch--sm" data-switch="${r.id}">⚡</button>
 <div class="jh-bulb jh-bulb--sm ${(labState.jsRoomLit || {})[r.id] ? "is-on" : ""}" data-bulb="${r.id}"></div>
 ${!connected.includes(r.id) ? `<div class="jh-recipe-drop" data-drop-recipe="${r.id}">Drop turnOnLight here</div>` : ""}
 </div>`).join("")}
 </div>` : ""}
 </div>`;
}

function renderIconic2() {
 return `
 <div class="jh-iconic-recipe">
 <div class="jh-recipe-card is-sealed"><h4>turnOnLight</h4></div>
 <div class="jh-spoke-lines">
 ${SWITCH_ROOMS.map((r) => `<div class="jh-spoke"><span>${esc(r.label)}</span><div class="jh-bulb jh-bulb--sm is-on"></div></div>`).join("")}
 </div>
 </div>
 <p class="jh-caption">One function. Many callers. Change the recipe once - every switch updates.</p>`;
}

function renderCode2() {
 return `
 <pre class="jh-code"><code>function turnOnLight() {
  bulb.color = "yellow";
  room.brightness = "high";
  sign.text = "Lights ON";
}

kitchenSwitch.addEventListener("click", turnOnLight);
hallwaySwitch.addEventListener("click", turnOnLight);
bedroomSwitch.addEventListener("click", turnOnLight);</code></pre>
 <ul class="jh-term-list">
 <li><strong>Function</strong> - a named, reusable block of instructions</li>
 <li><strong>Calling a function</strong> - connecting its name to an event listener</li>
 </ul>`;
}

function renderDoorbell() {
 const count = labState.jsRingCount || 0;
 return `
 <div class="jh-doorbell-scene">
 <div class="jh-doorbell-panel">
 <div class="jh-display" id="js-ring-display">${count}</div>
 <button type="button" class="jh-doorbell" id="js-doorbell">🔔 Ring</button>
 <div class="jh-var-box"><span class="jh-var-label">ringCount</span><span class="jh-var-value" id="js-ring-value">${count}</span></div>
 </div>
 <button type="button" class="btn secondary jh-reset-btn" id="js-ring-reset">Reset to 0</button>
 </div>`;
}

function renderIconic3() {
 const count = labState.jsRingCount || 0;
 return `
 <div class="jh-var-demo">
 <div class="jh-var-box jh-var-box--large"><span class="jh-var-label">ringCount</span><span class="jh-var-value">${count}</span></div>
 <p class="jh-caption">The box's name never changes. What's inside it does - as many times as needed.</p>
 </div>`;
}

function renderCode3() {
 return `
 <pre class="jh-code"><code>let ringCount = 0;

doorbell.addEventListener("click", function() {
  ringCount = ringCount + 1;
  display.text = ringCount;
});</code></pre>
 <ul class="jh-term-list">
 <li><strong>Variable</strong> - a named container that stores a value</li>
 <li><code>let ringCount = 0;</code> - creates the box, starts at 0</li>
 <li><code>ringCount = ringCount + 1;</code> - read, add one, store back</li>
 </ul>`;
}

function renderToggle() {
 const p = labState.jsTogglePieces || {};
 const ready = p.variable && p.function && p.listener;
 const isOn = labState.jsIsOn;
 return `
 <div class="jh-toggle-scene">
 ${!ready ? `
 <p class="jh-hint">Build the toggle: drag all three pieces into the assembly row.</p>
 <div class="jh-assembly-row">
 <div class="jh-assembly-slot ${p.variable ? "is-filled" : ""}" data-slot="variable">${p.variable ? "isOn = false" : "Drop variable"}</div>
 <div class="jh-assembly-slot ${p.function ? "is-filled" : ""}" data-slot="function">${p.function ? "toggleLight()" : "Drop function"}</div>
 <div class="jh-assembly-slot ${p.listener ? "is-filled" : ""}" data-slot="listener">${p.listener ? "addEventListener" : "Drop listener"}</div>
 </div>
 <div class="jh-tray">
 ${!p.variable ? '<div class="jh-tray-chip" draggable="true" data-piece="variable">isOn = false</div>' : ""}
 ${!p.function ? '<div class="jh-tray-chip" draggable="true" data-piece="function">toggleLight()</div>' : ""}
 ${!p.listener ? '<div class="jh-tray-chip" draggable="true" data-piece="listener">addEventListener("click", …)</div>' : ""}
 </div>` : `
 <div class="jh-toggle-live">
 <button type="button" class="jh-switch" id="js-toggle-switch">⚡</button>
 <div class="jh-bulb ${isOn ? "is-on" : ""}" id="js-toggle-bulb"></div>
 <div class="jh-var-readout">isOn: <strong id="js-ison-readout">${isOn}</strong></div>
 </div>`}
 </div>`;
}

function renderMontage() {
 return `
 <div class="jh-montage">
 <div class="jh-montage-card"><span>📋 Dropdown opens on click</span></div>
 <div class="jh-montage-card"><span>🖼 Slider arrow advances</span></div>
 <div class="jh-montage-card"><span>✉ Form shows error on bad email</span></div>
 <div class="jh-montage-card"><span>❤ Like button + counter</span></div>
 </div>
 <p class="jh-caption">Every one: an event, a function, and usually a variable remembering something.</p>`;
}

function renderSummary() {
 return `
 <ul class="jh-term-list jh-term-list--summary">
 <li><strong>HTML</strong> - the structure (the rooms)</li>
 <li><strong>CSS</strong> - the style (paint and furniture)</li>
 <li><strong>JavaScript</strong> - the behavior (wiring that makes it react)</li>
 <li class="jh-term-note">Event + function + variable - the three ingredients behind web interactivity.</li>
 <li class="jh-term-note"><em>Next: what happens when JavaScript needs to remember a whole list of things?</em></li>
 </ul>`;
}

function renderClose(u) {
 const t = Math.min(1, u || 0);
 return `
 <div class="jh-close-scene" style="--jh-close:${t}">
 ${renderStyledHouse("", { showBulb: true, compact: true })}
 <div class="jh-close-fx" style="opacity:${t}">
 <span class="jh-close-chip">💡 lights toggle</span>
 <span class="jh-close-chip">🔔 doorbell counts</span>
 <span class="jh-close-chip">📋 panels open</span>
 </div>
 </div>`;
}

function renderStage(mode) {
 switch (mode) {
 case "open":
 return renderOpen();
 case "wire":
 return renderWire();
 case "flow1":
 return renderFlow1();
 case "code1":
 return renderCode1();
 case "recipe":
 return renderRecipe();
 case "iconic2":
 return renderIconic2();
 case "code2":
 return renderCode2();
 case "doorbell":
 return renderDoorbell();
 case "iconic3":
 return renderIconic3();
 case "code3":
 return renderCode3();
 case "toggle":
 return renderToggle();
 case "montage":
 return renderMontage();
 case "summary":
 return renderSummary();
 case "close":
 return renderClose(labState.jsCloseU);
 default:
 return renderOpen();
 }
}

function bindWire(root, onChange) {
 track(root.querySelector("#js-switch-wired"), "click", () => {
 if (labState.jsWireDropped && labState.jsConnectorDropped) {
 labState.jsBulbLit = true;
 labState.jsWired = true;
 pulseSuccessFeedback(260);
 syncJsHouse("wire", { onChange });
 onChange?.();
 } else {
 pulseFailFeedback(300);
 }
 });

 track(root.querySelector("#js-switch-unwired"), "click", () => {
 labState.jsWireTriedUnwired = true;
 pulseFailFeedback(220);
 onChange?.();
 });

 root.querySelectorAll("[data-drag]").forEach((chip) => {
 track(chip, "dragstart", (e) => {
 e.dataTransfer.setData("text/js-drag", chip.dataset.drag);
 });
 });

 ["js-wire-slot", "js-connector-slot"].forEach((id) => {
 const slot = root.querySelector(`#${id}`);
 if (!slot) return;
 track(slot, "dragover", (e) => e.preventDefault());
 track(slot, "drop", (e) => {
 e.preventDefault();
 const kind = e.dataTransfer.getData("text/js-drag");
 if (id === "js-wire-slot" && kind === "wire" && !labState.jsWireDropped) {
 labState.jsWireDropped = true;
 pulseSuccessFeedback(200);
 syncJsHouse("wire", { onChange });
 onChange?.();
 } else if (id === "js-connector-slot" && kind === "connector" && labState.jsWireDropped && !labState.jsConnectorDropped) {
 labState.jsConnectorDropped = true;
 pulseSuccessFeedback(200);
 syncJsHouse("wire", { onChange });
 onChange?.();
 }
 });
 });
}

function bindRecipe(root, onChange) {
 root.querySelectorAll("[data-step]").forEach((chip) => {
 track(chip, "dragstart", (e) => {
 e.dataTransfer.setData("text/step", chip.dataset.step);
 });
 });

 root.querySelectorAll(".jh-recipe-slot").forEach((slot) => {
 track(slot, "dragover", (e) => e.preventDefault());
 track(slot, "drop", (e) => {
 e.preventDefault();
 const stepId = e.dataTransfer.getData("text/step");
 if (!stepId) return;
 const placed = [...(labState.jsRecipeSteps || [])];
 const expected = RECIPE_STEPS[placed.length]?.id;
 if (stepId !== expected) {
 pulseFailFeedback(320);
 return;
 }
 labState.jsRecipeSteps = [...placed, stepId];
 pulseSuccessFeedback(220);
 syncJsHouse("recipe", { onChange });
 onChange?.();
 });
 });

 root.querySelector("#js-name-recipe")?.addEventListener("click", () => {
 labState.jsRecipeNamed = true;
 pulseSuccessFeedback(200);
 syncJsHouse("recipe", { onChange });
 onChange?.();
 });

 root.querySelectorAll("[data-drop-recipe]").forEach((zone) => {
 track(zone, "dragover", (e) => e.preventDefault());
 track(zone, "drop", (e) => {
 e.preventDefault();
 const room = zone.dataset.dropRecipe;
 if (!room || (labState.jsFunctionConnected || []).includes(room)) return;
 labState.jsFunctionConnected = [...(labState.jsFunctionConnected || []), room];
 pulseSuccessFeedback(200);
 syncJsHouse("recipe", { onChange });
 onChange?.();
 });
 });

 if (labState.jsRecipeNamed) {
 const card = root.querySelector(".jh-recipe-card");
 if (card) {
 card.setAttribute("draggable", "true");
 track(card, "dragstart", (e) => {
 e.dataTransfer.setData("text/recipe", "turnOnLight");
 });
 }
 root.querySelectorAll("[data-drop-recipe]").forEach((zone) => {
 const connect = () => {
 const room = zone.dataset.dropRecipe;
 if (!room || (labState.jsFunctionConnected || []).includes(room)) return;
 labState.jsFunctionConnected = [...(labState.jsFunctionConnected || []), room];
 pulseSuccessFeedback(200);
 syncJsHouse("recipe", { onChange });
 onChange?.();
 };
 track(zone, "click", connect);
 });
 }

 root.querySelectorAll("[data-switch]").forEach((btn) => {
 track(btn, "click", () => {
 const room = btn.dataset.switch;
 if (!(labState.jsFunctionConnected || []).includes(room)) return;
 labState.jsRoomLit = { ...(labState.jsRoomLit || {}), [room]: true };
 pulseSuccessFeedback(180);
 syncJsHouse("recipe", { onChange });
 });
 });
}

function bindDoorbell(root, onChange) {
 track(root.querySelector("#js-doorbell"), "click", () => {
 labState.jsRingCount = (labState.jsRingCount || 0) + 1;
 pulseSuccessFeedback(160);
 syncJsHouse("doorbell", { onChange });
 onChange?.();
 });
 track(root.querySelector("#js-ring-reset"), "click", () => {
 labState.jsRingCount = 0;
 labState.jsRingReset = true;
 pulseSuccessFeedback(120);
 syncJsHouse("doorbell", { onChange });
 onChange?.();
 });
}

function bindToggle(root, onChange) {
 root.querySelectorAll("[data-piece]").forEach((chip) => {
 track(chip, "dragstart", (e) => {
 e.dataTransfer.setData("text/piece", chip.dataset.piece);
 });
 });

 root.querySelectorAll(".jh-assembly-slot").forEach((slot) => {
 track(slot, "dragover", (e) => e.preventDefault());
 track(slot, "drop", (e) => {
 e.preventDefault();
 const piece = e.dataTransfer.getData("text/piece");
 const key = slot.dataset.slot;
 if (piece !== key) {
 pulseFailFeedback(280);
 return;
 }
 labState.jsTogglePieces = { ...(labState.jsTogglePieces || {}), [key]: true };
 pulseSuccessFeedback(220);
 syncJsHouse("toggle", { onChange });
 onChange?.();
 });
 });

 const sw = root.querySelector("#js-toggle-switch");
 if (sw) {
 track(sw, "click", () => {
 labState.jsIsOn = !labState.jsIsOn;
 labState.jsToggleFlips = (labState.jsToggleFlips || 0) + 1;
 pulseSuccessFeedback(180);
 syncJsHouse("toggle", { onChange });
 onChange?.();
 });
 }
}

function bindOpen(root, onChange) {
 track(root.querySelector("#js-main-switch"), "click", () => {
 pulseFailFeedback(280);
 labState.jsOpenTriedSwitch = true;
 onChange?.();
 });
}

function bindInteractions(root, onChange) {
 clearLiveHandlers();
 const mode = labState.jsMode;
 if (mode === "open") bindOpen(root, onChange);
 if (mode === "wire") bindWire(root, onChange);
 if (mode === "recipe") bindRecipe(root, onChange);
 if (mode === "doorbell") bindDoorbell(root, onChange);
 if (mode === "toggle") bindToggle(root, onChange);
}

const BANNERS = {
 open: "The house looks finished - but flip the switch. Nothing happens yet.",
 wire: "WHEN this switch is clicked, DO this. That's JavaScript.",
 flow1: "Event → code runs → something changes. Same pattern everywhere on the web.",
 code1: "addEventListener is the wire - listen for an event, run code.",
 recipe: "Write instructions once, name them, call them from many switches.",
 iconic2: "One master recipe card - any switch can point to it.",
 code2: "function turnOnLight() { ... } - written once, called everywhere.",
 doorbell: "ringCount is a labeled box - the house remembers between clicks.",
 iconic3: "One name, contents that change freely over time.",
 code3: "let ringCount = 0 - create the box, update it on each click.",
 toggle: "Event + variable + function = a real working toggle.",
 montage: "Dropdowns, sliders, forms, likes - same three ingredients.",
 summary: "HTML structure · CSS style · JavaScript behavior.",
 close: "The house is fully alive - every click means something.",
};

export function mountJsHouse(viewport, onChange) {
 if (!viewport) return () => {};
 if (document.getElementById(ROOT_ID)) return () => unmountJsHouse(viewport);

 const root = document.createElement("div");
 root.id = ROOT_ID;
 root.className = "js-house-root";
 root.innerHTML = `<p class="jh-banner" id="jh-banner"></p><div class="jh-stage" id="jh-stage"></div>`;
 viewport.appendChild(root);
 viewport.classList.add("viewport--jshouse");

 syncJsHouse(labState.jsMode || "open", { onChange });

 return () => unmountJsHouse(viewport);
}

export function syncJsHouse(mode, opts = {}) {
 labState.jsMode = mode || labState.jsMode || "open";
 const root = document.getElementById(ROOT_ID);
 if (!root) return;

 const renderKey = [
 labState.jsMode,
 labState.jsWireDropped ? 1 : 0,
 labState.jsConnectorDropped ? 1 : 0,
 labState.jsBulbLit ? 1 : 0,
 labState.jsWired ? 1 : 0,
 (labState.jsRecipeSteps || []).join(","),
 labState.jsRecipeNamed ? 1 : 0,
 (labState.jsFunctionConnected || []).join(","),
 JSON.stringify(labState.jsRoomLit || {}),
 labState.jsRingCount,
 labState.jsIsOn ? 1 : 0,
 JSON.stringify(labState.jsTogglePieces || {}),
 labState.jsToggleFlips || 0,
 Math.floor((labState.jsCloseU || 0) * 20),
 ].join("|");

 const stage = root.querySelector("#jh-stage");
 const banner = root.querySelector("#jh-banner");

 if (stage && renderKey !== lastRenderKey) {
 stage.innerHTML = renderStage(labState.jsMode);
 lastRenderKey = renderKey;
 bindInteractions(root, opts.onChange);
 if (labState.jsMode === "open" && !labState.jsOpenReady) {
 clearTimeout(openTimer);
 openTimer = setTimeout(() => {
 labState.jsOpenReady = true;
 opts.onChange?.();
 }, 2200);
 }
 } else if (labState.jsMode === "close" && stage) {
 stage.style.setProperty("--jh-close", String(labState.jsCloseU || 0));
 }

 if (banner) banner.textContent = opts.banner || BANNERS[labState.jsMode] || "";
}

export function unmountJsHouse(viewport) {
 clearTimeout(openTimer);
 openTimer = null;
 lastRenderKey = "";
 clearLiveHandlers();
 document.getElementById(ROOT_ID)?.remove();
 viewport?.classList.remove("viewport--jshouse");
}
