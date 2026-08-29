/**
 * HTML House DOM overlay: literal styled rooms for Mission 1 (Bruner spirals).
 * Medium matches message: tags are rooms, drag doorways in/out, nest, furnish.
 */
import { labState, pulseFailFeedback, pulseSuccessFeedback } from "./lab-state.js?v=html5";

const ROOT_ID = "html-house-root";

function esc(s) {
 return String(s)
 .replace(/&/g, "&amp;")
 .replace(/</g, "&lt;")
 .replace(/>/g, "&gt;")
 .replace(/"/g, "&quot;");
}

function pieceHtml(id, label, cls = "") {
 return `<button type="button" class="hh-piece ${cls}" draggable="true" data-piece="${id}">${esc(label)}</button>`;
}

function slotHtml(id, label, filled = "") {
 return `<div class="hh-slot" data-slot="${id}" data-label="${esc(label)}">${filled ? `<span class="hh-slot-fill">${esc(filled)}</span>` : `<span class="hh-slot-hint">${esc(label)}</span>`}</div>`;
}

function renderLot() {
 return `
 <div class="hh-lot">
 <p class="hh-code-line" id="hh-type-line">&nbsp;</p>
 <div class="hh-frame hh-frame--rise" id="hh-rise-frame">
 <div class="hh-frame-post hh-frame-post--l"></div>
 <div class="hh-frame-post hh-frame-post--r"></div>
 <div class="hh-frame-beam"></div>
 </div>
 </div>`;
}

function renderRoom(phase) {
 const needClose = phase === 0;
 return `
 <div class="hh-room-scene">
 <div class="hh-room ${labState.htmlRoomBuilt && phase === 0 ? "is-solid" : ""} ${phase === 1 && labState.htmlRoomFailed ? "is-leak" : ""}">
 ${slotHtml("open", "← opening tag")}
 <div class="hh-room-mid">${slotHtml("content", "furniture")}</div>
 ${needClose ? slotHtml("close", "closing tag →") : `<div class="hh-slot hh-slot--ghost" data-slot="close"><span class="hh-slot-hint">no closing tag</span></div>`}
 </div>
 ${phase === 1 && Object.keys(labState.htmlPlaced).length >= 2 ? `<div class="hh-leak-drift" aria-hidden="true">Extra stuff leaks in…</div>` : ""}
 </div>
 <div class="hh-tray" id="hh-tray"></div>`;
}

function renderNest(phase) {
 const broken = phase === 1 && labState.htmlNestFailed;
 return `
 <div class="hh-nest-scene">
 <div class="hh-room hh-room--outer ${labState.htmlNestBuilt && phase === 0 ? "is-solid" : ""} ${broken ? "is-crossed" : ""}">
 <span class="hh-room-label">outer room</span>
 <div class="hh-room hh-room--inner ${labState.htmlNestBuilt && phase === 0 ? "is-solid" : ""} ${broken ? "is-sliced" : ""}">
 <span class="hh-room-label">inner room</span>
 ${slotHtml("inner-open", "inner open")}
 ${slotHtml("inner-close", "inner close")}
 </div>
 ${slotHtml("outer-open", "outer open")}
 ${slotHtml("outer-close", "outer close")}
 </div>
 </div>
 <div class="hh-tray" id="hh-tray"></div>`;
}

function renderFurnish() {
 const zones = [
 { id: "header", label: "header zone (top)", tag: "<header>" },
 { id: "hero", label: "hero entryway", tag: "<div class=\"hero\">" },
 { id: "main", label: "main living space", tag: "<main>" },
 { id: "footer", label: "footer foundation", tag: "<footer>" },
 { id: "div", label: "anywhere in main", tag: "<div>" },
 ];
 const placed = labState.htmlPlaced || {};
 return `
 <div class="hh-blueprint">
 ${zones
 .map((z) => {
 const on = placed[z.id] === z.tag;
 return `<div class="hh-zone hh-zone--${z.id} ${on ? "is-lit" : ""}" data-zone="${z.id}">
 <span class="hh-zone-tag">${on ? esc(z.tag) : esc(z.label)}</span>
 </div>`;
 })
 .join("")}
 </div>
 <div class="hh-tray hh-tray--furnish" id="hh-tray"></div>`;
}

function renderIframe() {
 return `
 <div class="hh-iframe-scene">
 <div class="hh-house-row">
 <div class="hh-built-house ${labState.htmlIframeDone ? "has-window" : ""}">
 <div class="hh-built-zone hh-built-zone--header">Site</div>
 <div class="hh-built-zone hh-built-zone--main">
 ${slotHtml("iframe", "drop &lt;iframe&gt; here")}
 ${labState.htmlPlaced?.iframe ? slotHtml("src", "drop src address") : ""}
 </div>
 <div class="hh-built-zone hh-built-zone--footer">© info</div>
 </div>
 <div class="hh-neighbor-house" aria-label="neighbor house">
 <div class="hh-neighbor-roof"></div>
 <div class="hh-neighbor-body"><span>other-house.html</span></div>
 </div>
 </div>
 </div>
 <div class="hh-tray" id="hh-tray"></div>`;
}

function renderBlueprint() {
 return `
 <div class="hh-split">
 <div class="hh-blueprint-mini">
 <div class="hh-bp-door hh-bp-door--in">in</div>
 <div class="hh-bp-room">contents</div>
 <div class="hh-bp-door hh-bp-door--out">out</div>
 </div>
 <pre class="hh-code-sample" aria-label="HTML sample"><code>&lt;<span class="hh-k">div</span>&gt;
  Welcome!
&lt;/<span class="hh-k">div</span>&gt;</code></pre>
 </div>`;
}

function renderDolls() {
 return `
 <div class="hh-dolls">
 <div class="hh-doll hh-doll--3">&lt;div&gt;</div>
 <div class="hh-doll hh-doll--2">&lt;p&gt;</div>
 <div class="hh-doll hh-doll--1">Welcome!</div>
 </div>
 <pre class="hh-code-sample hh-code-sample--indent"><code>&lt;div&gt;
  &lt;p&gt;Welcome!&lt;/p&gt;
&lt;/div&gt;</code></pre>`;
}

function renderNestCode() {
 return `
 <div class="hh-code-compare">
 <div class="hh-code-card hh-code-card--ok">
 <h4>Valid nesting</h4>
 <pre><code>&lt;div&gt;
  &lt;p&gt;Welcome!&lt;/p&gt;
&lt;/div&gt;</code></pre>
 </div>
 <div class="hh-code-card hh-code-card--bad">
 <h4>Invalid (never do this)</h4>
 <pre><code>&lt;div&gt;
  &lt;p&gt;Welcome!&lt;/div&gt;
&lt;/p&gt;</code></pre>
 </div>
 </div>`;
}

function renderLayout() {
 return `
 <div class="hh-layout-pair">
 <div class="hh-blueprint hh-blueprint--lit">
 <div class="hh-zone hh-zone--header is-lit"><span>&lt;header&gt;</span></div>
 <div class="hh-zone hh-zone--hero is-lit"><span>hero</span></div>
 <div class="hh-zone hh-zone--main is-lit"><span>&lt;main&gt;</span></div>
 <div class="hh-zone hh-zone--footer is-lit"><span>&lt;footer&gt;</span></div>
 </div>
 <div class="hh-webpage-mock">
 <header class="hh-mock-header">My Site</header>
 <div class="hh-mock-hero">Welcome banner</div>
 <main class="hh-mock-main"><p>Articles &amp; images</p><div class="hh-mock-div">&lt;div&gt;</div></main>
 <footer class="hh-mock-footer">Contact · © 2026</footer>
 </div>
 </div>`;
}

function renderSemantic() {
 return `
 <ul class="hh-term-list">
 <li><code>&lt;header&gt;</code>: top intro (logo, title, nav)</li>
 <li><code>&lt;main&gt;</code>: primary unique content</li>
 <li><code>&lt;footer&gt;</code>: bottom closing info</li>
 <li><code>&lt;div&gt;</code>: blank room, no built-in job</li>
 <li class="hh-term-note">Semantic = meaningful name tells you the job.</li>
 </ul>`;
}

function renderMontage() {
 return `
 <div class="hh-montage">
 <div class="hh-montage-card"><span class="hh-montage-label">News + map</span><div class="hh-montage-frame"></div></div>
 <div class="hh-montage-card"><span class="hh-montage-label">Blog + video</span><div class="hh-montage-frame"></div></div>
 <div class="hh-montage-card"><span class="hh-montage-label">Checkout + payment</span><div class="hh-montage-frame"></div></div>
 </div>`;
}

function renderSummary() {
 return `
 <ul class="hh-term-list">
 <li><code>&lt;div&gt;</code> / <code>&lt;/div&gt;</code>: generic room</li>
 <li><code>&lt;header&gt;</code> · <code>&lt;main&gt;</code> · <code>&lt;footer&gt;</code>: semantic jobs</li>
 <li><code>&lt;iframe src="..."&gt;</code>: window into another page</li>
 <li class="hh-term-note">Screen readers use semantic tags to describe pages aloud.</li>
 </ul>`;
}

function renderClose(u) {
 const p = Math.min(1, u || 0);
 return `
 <div class="hh-close-scene" style="--hh-close: ${p}">
 <div class="hh-built-house hh-built-house--complete">
 <div class="hh-built-zone hh-built-zone--header is-lit">Header</div>
 <div class="hh-built-zone hh-built-zone--hero is-lit">Hero</div>
 <div class="hh-built-zone hh-built-zone--main is-lit">Main</div>
 <div class="hh-built-zone hh-built-zone--footer is-lit">Footer</div>
 <div class="hh-iframe-window is-lit"></div>
 </div>
 </div>`;
}

function renderTerms() {
 return `
 <ul class="hh-term-list">
 <li><strong>Tag</strong>: marks start or end: <code>&lt;div&gt;</code> or <code>&lt;/div&gt;</code></li>
 <li><strong>Opening tag</strong>: <code>&lt;div&gt;</code> (no slash)</li>
 <li><strong>Closing tag</strong>: <code>&lt;/div&gt;</code> (forward slash = done)</li>
 <li><strong>Element</strong>: opening + content + closing together</li>
 </ul>
 <pre class="hh-code-sample"><code>&lt;div&gt;Welcome!&lt;/div&gt;</code></pre>`;
}

function trayPieces(mode, phase) {
 if (mode === "room") {
 const pieces = [
 { id: "open", label: "<div>", slot: "open", text: "<div>" },
 { id: "content", label: "Welcome!", slot: "content", text: "Welcome!" },
 ];
 if (phase === 0) pieces.push({ id: "close", label: "</div>", slot: "close", text: "</div>" });
 return pieces;
 }
 if (mode === "nest") {
 return [
 { id: "outer-open", label: "<div>", slot: "outer-open", text: "<div>" },
 { id: "inner-open", label: "<p>", slot: "inner-open", text: "<p>" },
 { id: "inner-close", label: "</p>", slot: "inner-close", text: "</p>" },
 { id: "outer-close", label: "</div>", slot: "outer-close", text: "</div>" },
 ];
 }
 if (mode === "furnish") {
 return [
 { id: "header", label: "<header>", slot: "header", text: "<header>" },
 { id: "hero", label: "<div hero>", slot: "hero", text: '<div class="hero">' },
 { id: "main", label: "<main>", slot: "main", text: "<main>" },
 { id: "footer", label: "<footer>", slot: "footer", text: "<footer>" },
 { id: "div", label: "<div>", slot: "div", text: "<div>" },
 ];
 }
 if (mode === "iframe") {
 const t = [{ id: "iframe", label: "<iframe>", slot: "iframe", text: "<iframe>" }];
 if (labState.htmlPlaced?.iframe) t.push({ id: "src", label: 'src="other-house.html"', slot: "src", text: "other-house.html" });
 return t;
 }
 return [];
}

const ROOM_OK = { open: "<div>", content: "Welcome!", close: "</div>" };
const NEST_OK = ["outer-open", "inner-open", "inner-close", "outer-close"];
const NEST_BAD = ["outer-open", "inner-open", "outer-close", "inner-close"];
const FURNISH_SLOTS = ["header", "hero", "main", "footer", "div"];

function fillTray(root, mode, phase) {
 const tray = root.querySelector("#hh-tray");
 if (!tray) return;
 const placed = labState.htmlPlaced || {};
 const pieces = trayPieces(mode, phase).filter((p) => !placed[p.slot]);
 const key = pieces.map((p) => p.id).join(",");
 if (tray.dataset.trayKey === key) return;
 tray.dataset.trayKey = key;
 tray.innerHTML = pieces.map((p) => pieceHtml(p.id, p.label)).join("");
}

function applySlotFill(root) {
 const placed = labState.htmlPlaced || {};
 root.querySelectorAll(".hh-slot[data-slot]").forEach((el) => {
 const key = el.dataset.slot;
 const val = placed[key];
 const fillKey = val || "";
 if (el.dataset.fillKey === fillKey) return;
 el.dataset.fillKey = fillKey;
 if (val) {
 el.innerHTML = `<span class="hh-slot-fill">${esc(val)}</span>`;
 el.classList.add("is-filled");
 } else {
 const hint = el.dataset.label || key;
 el.innerHTML = `<span class="hh-slot-hint">${esc(hint)}</span>`;
 el.classList.remove("is-filled");
 }
 });
}

function checkRoomComplete(phase) {
 const p = labState.htmlPlaced || {};
 if (phase === 0) {
 return p.open === "<div>" && p.content === "Welcome!" && p.close === "</div>";
 }
 return p.open === "<div>" && p.content === "Welcome!" && !p.close;
}

function onPieceDrop(slot, pieceId, mode, phase, onChange) {
 const pieces = trayPieces(mode, phase);
 const piece = pieces.find((p) => p.id === pieceId);
 if (!piece || piece.slot !== slot) {
 pulseFailFeedback(320);
 return;
 }
 const placed = { ...(labState.htmlPlaced || {}) };
 if (placed[slot]) return;
 placed[slot] = piece.text;
 labState.htmlPlaced = placed;
 if (mode === "nest") {
 labState.htmlOrder = [...(labState.htmlOrder || []), slot];
 }
 pulseSuccessFeedback(220);

 if (mode === "room") {
 if (checkRoomComplete(phase)) {
 if (phase === 0) {
 labState.htmlRoomBuilt = true;
 labState.htmlPhase = 1;
 labState.htmlPlaced = {};
 labState.htmlOrder = [];
 } else {
 labState.htmlRoomFailed = true;
 }
 }
 } else if (mode === "nest") {
 const order = labState.htmlOrder || [];
 if (order.length === 4) {
 if (phase === 0 && order.every((k, i) => k === NEST_OK[i])) {
 labState.htmlNestBuilt = true;
 labState.htmlPhase = 1;
 labState.htmlPlaced = {};
 labState.htmlOrder = [];
 labState.prompt =
 "Good nesting. Now break it on purpose: close the OUTER room before the INNER room.";
 } else if (phase === 1 && order.every((k, i) => k === NEST_BAD[i])) {
 labState.htmlNestFailed = true;
 labState.prompt = "Walls crossed - that is broken nesting. Continue is unlocked.";
 pulseFailFeedback(480);
 } else if (phase === 0) {
 pulseFailFeedback(400);
 labState.prompt =
 "Order must be: outer open → inner open → inner close → outer close. Try again.";
 labState.htmlPlaced = {};
 labState.htmlOrder = [];
 } else if (phase === 1) {
 pulseFailFeedback(400);
 labState.prompt =
 "To break it: outer open → inner open → OUTER close → INNER close. Try again.";
 labState.htmlPlaced = {};
 labState.htmlOrder = [];
 }
 }
 } else if (mode === "furnish") {
 labState.htmlFurnishCount = FURNISH_SLOTS.filter((s) => labState.htmlPlaced[s]).length;
 } else if (mode === "iframe") {
 if (labState.htmlPlaced.iframe && labState.htmlPlaced.src) {
 labState.htmlIframeDone = true;
 }
 }

 onChange?.();
 syncHtmlHouse(labState.htmlMode);
}

let typeTimer = null;
let lastRenderKey = "";

function startLotTyping(onChange) {
 const line = document.getElementById("hh-type-line");
 if (!line) return;
 const text = "<html>";
 let i = 0;
 clearInterval(typeTimer);
 typeTimer = setInterval(() => {
 i += 1;
 line.textContent = text.slice(0, i);
 if (i >= text.length) {
 clearInterval(typeTimer);
 typeTimer = null;
 setTimeout(() => {
 labState.htmlOpenReady = true;
 onChange?.();
 }, 600);
 }
 }, 120);
}

function renderStage(mode) {
 const phase = labState.htmlPhase || 0;
 switch (mode) {
 case "lot":
 return renderLot();
 case "room":
 return renderRoom(phase);
 case "blueprint":
 return renderBlueprint();
 case "terms":
 return renderTerms();
 case "nest":
 return renderNest(phase);
 case "dolls":
 return renderDolls();
 case "nestcode":
 return renderNestCode();
 case "furnish":
 return renderFurnish();
 case "layout":
 return renderLayout();
 case "semantic":
 return renderSemantic();
 case "iframe":
 return renderIframe();
 case "montage":
 return renderMontage();
 case "summary":
 return renderSummary();
 case "close":
 return renderClose(labState.htmlCloseU);
 default:
 return renderLot();
 }
}

export function mountHtmlHouse(viewport, onChange) {
 if (!viewport) return () => {};
 unmountHtmlHouse(viewport);

 let root = document.createElement("div");
 root.id = ROOT_ID;
 root.className = "html-house-root";
 root.innerHTML = `
 <p class="hh-banner" id="hh-banner"></p>
 <div class="hh-stage" id="hh-stage"></div>`;

 viewport.appendChild(root);
 viewport.classList.add("viewport--htmlhouse");

 root.addEventListener("dragover", (e) => {
 e.preventDefault();
 e.dataTransfer.dropEffect = "move";
 });
 root.addEventListener("drop", (e) => {
 e.preventDefault();
 const slotEl = e.target.closest(".hh-slot[data-slot], .hh-zone[data-zone]");
 const pieceId = e.dataTransfer.getData("text/plain");
 if (!slotEl || !pieceId) return;
 const slot = slotEl.dataset.slot || slotEl.dataset.zone;
 onPieceDrop(slot, pieceId, labState.htmlMode, labState.htmlPhase || 0, onChange);
 });
 root.addEventListener("dragstart", (e) => {
 const btn = e.target.closest(".hh-piece[data-piece]");
 if (!btn) return;
 e.dataTransfer.setData("text/plain", btn.dataset.piece);
 e.dataTransfer.effectAllowed = "move";
 });

 let selectedPiece = null;
 root.addEventListener("click", (e) => {
 const pieceEl = e.target.closest(".hh-piece[data-piece]");
 const slotEl = e.target.closest(".hh-slot[data-slot], .hh-zone[data-zone]");
 if (pieceEl) {
 selectedPiece = pieceEl.dataset.piece;
 pieceEl.classList.add("is-selected");
 root.querySelectorAll(".hh-piece.is-selected").forEach((el) => {
 if (el !== pieceEl) el.classList.remove("is-selected");
 });
 return;
 }
 if (slotEl && selectedPiece) {
 const slot = slotEl.dataset.slot || slotEl.dataset.zone;
 onPieceDrop(slot, selectedPiece, labState.htmlMode, labState.htmlPhase || 0, onChange);
 selectedPiece = null;
 root.querySelectorAll(".hh-piece.is-selected").forEach((el) => el.classList.remove("is-selected"));
 }
 });

 syncHtmlHouse(labState.htmlMode, { onChange });

 return () => unmountHtmlHouse(viewport);
}

export function syncHtmlHouse(mode, opts = {}) {
 labState.htmlMode = mode || labState.htmlMode || "lot";
 const root = document.getElementById(ROOT_ID);
 if (!root) return;

 const stage = root.querySelector("#hh-stage");
 const banner = root.querySelector("#hh-banner");
 const renderKey = [
 labState.htmlMode,
 labState.htmlPhase,
 labState.htmlFurnishCount,
 labState.htmlIframeDone ? 1 : 0,
 Math.floor((labState.htmlCloseU || 0) * 20),
 Object.keys(labState.htmlPlaced || {}).length,
 (labState.htmlOrder || []).join(","),
 labState.htmlRoomBuilt ? 1 : 0,
 labState.htmlRoomFailed ? 1 : 0,
 labState.htmlNestBuilt ? 1 : 0,
 labState.htmlNestFailed ? 1 : 0,
 ].join("|");

 if (stage && renderKey !== lastRenderKey) {
 const prevMode = lastRenderKey.split("|")[0];
 stage.innerHTML = renderStage(labState.htmlMode);
 lastRenderKey = renderKey;
 if (labState.htmlMode === "lot" && !labState.htmlOpenReady && (prevMode !== "lot" || !typeTimer)) {
 startLotTyping(opts.onChange);
 }
 } else if (labState.htmlMode === "close" && stage) {
 stage.style.setProperty("--hh-close", String(labState.htmlCloseU || 0));
 }

 if (banner && opts.banner != null) banner.textContent = opts.banner;
 else if (banner) {
 const b = {
 lot: "Every webpage is a house built from tags.",
 room: labState.htmlPhase === 0 ? "Build one room: opening tag, content, closing tag." : "Now forget the closing tag. Watch what leaks in.",
 blueprint: "Blueprint doorway-in ↔ opening tag. Room contents ↔ your content.",
 terms: "Opening tag, closing tag, and element: your first vocabulary.",
 nest: labState.htmlNestBuilt && labState.htmlNestFailed
 ? "Both done: clean nest, then crossed walls."
 : labState.htmlPhase === 0
 ? "Part 1: drop in order outer open → inner open → inner close → outer close."
 : "Part 2: break it - outer open → inner open → OUTER close → INNER close.",
 dolls: "Nesting dolls open and close in reverse order. HTML follows the same rule.",
 nestcode: "Last opened, first closed: every webpage follows this rule.",
 furnish: "Drop each tag into its zone on the blueprint.",
 layout: "Real websites use this same top-to-bottom skeleton.",
 semantic: "Semantic tags carry meaning in their name.",
 iframe: "Cut a window in the wall. Point it at the neighbor house.",
 montage: "Maps, videos, payments: iframe windows everywhere.",
 summary: "Tags as rooms, nesting order, semantic jobs, iframe windows.",
 close: "The house is built: room by room.",
 };
 banner.textContent = b[labState.htmlMode] || "";
 }

 fillTray(root, labState.htmlMode, labState.htmlPhase || 0);
 applySlotFill(root);

 if (labState.htmlMode === "furnish") {
 root.querySelectorAll(".hh-zone[data-zone]").forEach((z) => {
 z.classList.toggle("is-lit", !!(labState.htmlPlaced || {})[z.dataset.zone]);
 const tag = z.querySelector(".hh-zone-tag");
 if (tag && labState.htmlPlaced?.[z.dataset.zone]) tag.textContent = labState.htmlPlaced[z.dataset.zone];
 });
 }
}

export function unmountHtmlHouse(viewport) {
 clearInterval(typeTimer);
 typeTimer = null;
 lastRenderKey = "";
 document.getElementById(ROOT_ID)?.remove();
 viewport?.classList.remove("viewport--htmlhouse");
}
