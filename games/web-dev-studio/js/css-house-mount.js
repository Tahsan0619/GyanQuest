/**
 * CSS Style DOM overlay: paint, box model, size/align, cascade on the HTML house.
 */
import { labState, pulseFailFeedback, pulseSuccessFeedback } from "./lab-state.js?v=csspaint1";

const ROOT_ID = "css-house-root";
const COLORS = [
 { id: "sky", label: "Sky", hex: "#7dd3fc" },
 { id: "mint", label: "Mint", hex: "#6ee7b7" },
 { id: "cream", label: "Cream", hex: "#fef3c7" },
 { id: "coral", label: "Coral", hex: "#fda4af" },
 { id: "lav", label: "Lavender", hex: "#c4b5fd" },
];

let lastRenderKey = "";
let paintTimer = null;

function esc(s) {
 return String(s)
 .replace(/&/g, "&amp;")
 .replace(/</g, "&lt;")
 .replace(/>/g, "&gt;")
 .replace(/"/g, "&quot;");
}

function roomStyle(id, base = {}) {
 const colors = labState.cssRoomColors || {};
 const cozy = (labState.cssCozyRooms || []).includes(id);
 const override = id === "nook" && labState.cssOverrideNook;
 let bg = colors[id] || base.bg || "";
 if (cozy && !override) bg = labState.cssSheetColor || "#fff7ed";
 if (override) bg = "#fde68a";
 const parts = [];
 if (bg) parts.push(`background:${bg}`);
 if (base.padding != null) parts.push(`padding:${base.padding}px`);
 if (base.border != null) parts.push(`border:${base.border}px solid #334155`);
 if (base.margin != null) parts.push(`margin:${base.margin}px`);
 if (base.width) parts.push(`width:${base.width}px`);
 if (base.height) parts.push(`height:${base.height}px`);
 if (base.textAlign) parts.push(`text-align:${base.textAlign}`);
 if (base.borderRadius) parts.push(`border-radius:${base.borderRadius}px`);
 return parts.join(";");
}

function renderHouse(opts = {}) {
 const { outline = false, rooms = ["header", "hero", "main", "footer"], compact = false } = opts;
 const colors = labState.cssRoomColors || {};
 const cozy = labState.cssCozyRooms || [];
 const cls = outline ? "ch-house ch-house--outline" : "ch-house";
 const items = [
 { id: "header", tag: "header", label: "Site title" },
 { id: "hero", tag: "div.hero", label: "Welcome banner" },
 { id: "main", tag: "main", label: "Page content lives here" },
 { id: "footer", tag: "footer", label: "Contact · ©" },
 { id: "sidebar", tag: "aside", label: "Sidebar notes" },
 { id: "nook", tag: "#reading-nook", label: "Reading nook" },
 ];
 return `
 <div class="${cls} ${compact ? "ch-house--compact" : ""}">
 ${items
 .filter((r) => rooms.includes(r.id))
 .map((r) => {
 const sel = labState.cssSelectedRoom === r.id;
 const isCozy = cozy.includes(r.id);
 return `<div class="ch-room ch-room--${r.id} ${sel ? "is-selected" : ""} ${isCozy ? "is-cozy" : ""} ${outline ? "is-outline" : ""}"
 data-room="${r.id}" data-tag="${esc(r.tag)}"
 style="${roomStyle(r.id, isCozy ? { padding: 20, borderRadius: 10 } : {})}">
 <span class="ch-room-tag">&lt;${esc(r.tag.replace("#", "").replace(".hero", ""))}&gt;</span>
 <span class="ch-room-text">${esc(r.label)}</span>
 </div>`;
 })
 .join("")}
 </div>`;
}

function renderUnstyled() {
 return renderHouse({ outline: true, rooms: ["header", "hero", "main", "footer"] });
}

function renderPaint() {
 const phase = labState.cssPhase || 0;
 const focus = phase === 0 ? "main" : "header";
 return `
 <div class="ch-paint-scene">
 <p class="ch-hint">${phase === 0 ? "Click the pointer, then click &lt;main&gt;. Drag a color onto it." : "Now paint &lt;header&gt; a different color."}</p>
 ${renderHouse({ outline: !labState.cssPaintMain, rooms: phase === 0 ? ["main"] : ["header", "main"] })}
 <div class="ch-toolbar">
 <button type="button" class="ch-tool ${labState.cssPointerOn ? "is-on" : ""}" id="ch-pointer" title="Pointer">🎯 Pointer</button>
 <div class="ch-palette">
 ${COLORS.map((c) => `<button type="button" class="ch-swatch" draggable="true" data-color="${c.hex}" style="background:${c.hex}" title="${esc(c.label)}"></button>`).join("")}
 </div>
 </div>
 </div>`;
}

function renderRule() {
 return `
 <div class="ch-rule-diagram">
 <div class="ch-rule-room">main</div>
 <div class="ch-rule-arrow">→</div>
 <div class="ch-rule-card">background-color: lightblue;</div>
 <p class="ch-rule-caption">One style rule</p>
 </div>`;
}

function renderTerms() {
 return `
 <pre class="ch-code"><code>main {
  background-color: lightblue;
}</code></pre>
 <ul class="ch-term-list">
 <li><strong>Selector</strong>: main: which element(s)</li>
 <li><strong>Property</strong>: background-color (what to change)</li>
 <li><strong>Value</strong>: lightblue: change it to this</li>
 <li><strong>Declaration</strong>: property: value;</li>
 <li><strong>Rule</strong>: selector + { declarations }</li>
 </ul>`;
}

function renderBox() {
 const p = labState.cssPadding || 0;
 const b = labState.cssBorder || 0;
 const m = labState.cssMargin || 0;
 return `
 <div class="ch-box-scene">
 <div class="ch-box-wrap" style="margin:${m}px">
 <div class="ch-box-room" style="padding:${p}px;border:${b}px solid #38bdf8">
 <span class="ch-box-furniture">Hello content</span>
 </div>
 </div>
 <div class="ch-neighbor">Neighbor room</div>
 </div>
 <div class="ch-sliders">
 <label>Padding (inside) <input type="range" min="0" max="40" value="${p}" data-slider="padding" /></label>
 <label>Border (wall) <input type="range" min="0" max="12" value="${b}" data-slider="border" /></label>
 <label>Margin (outside) <input type="range" min="0" max="48" value="${m}" data-slider="margin" /></label>
 </div>`;
}

function renderBoxCut() {
 return `
 <div class="ch-cutaway">
 <div class="ch-layer ch-layer--margin"><span>Margin</span></div>
 <div class="ch-layer ch-layer--border"><span>Border</span></div>
 <div class="ch-layer ch-layer--padding"><span>Padding</span></div>
 <div class="ch-layer ch-layer--content"><span>Content</span></div>
 </div>
 <p class="ch-cut-caption">Content → Padding → Border → Margin: always in this order.</p>`;
}

function renderBoxCode() {
 return `
 <pre class="ch-code"><code>main {
  padding: 20px;
  border: 3px solid black;
  margin: 40px;
}</code></pre>
 <ul class="ch-term-list">
 <li><strong>Content</strong>: text and images inside</li>
 <li><strong>Padding</strong>: space between content and border</li>
 <li><strong>Border</strong>: visible edge of the element</li>
 <li><strong>Margin</strong>: space outside the border</li>
 </ul>`;
}

function renderResize() {
 const w = labState.cssWidth || 280;
 const h = labState.cssHeight || 160;
 const align = labState.cssAlign || "left";
 return `
 <div class="ch-resize-scene">
 <div class="ch-resize-room" style="width:${w}px;height:${h}px">
 <p class="ch-resize-text" style="text-align:${align}">Furniture text</p>
 </div>
 </div>
 <div class="ch-sliders">
 <label>width <input type="range" min="180" max="420" value="${w}" data-slider="width" /></label>
 <label>height <input type="range" min="100" max="260" value="${h}" data-slider="height" /></label>
 </div>
 <div class="ch-align-btns">
 <button type="button" class="ch-align ${align === "left" ? "is-on" : ""}" data-align="left">Left</button>
 <button type="button" class="ch-align ${align === "center" ? "is-on" : ""}" data-align="center">Center</button>
 <button type="button" class="ch-align ${align === "right" ? "is-on" : ""}" data-align="right">Right</button>
 </div>`;
}

function renderGallery() {
 return `
 <div class="ch-gallery">
 ${["left", "center", "right", "justify"]
 .map(
 (a) => `
 <div class="ch-gallery-card">
 <div class="ch-gallery-room"><p style="text-align:${a === "justify" ? "left" : a}">Same text</p></div>
 <span>${a}</span>
 </div>`,
 )
 .join("")}
 </div>`;
}

function renderSizeCode() {
 return `
 <pre class="ch-code"><code>main {
  width: 600px;
  height: 400px;
  text-align: center;
}</code></pre>`;
}

function renderCascade() {
 const cozy = labState.cssCozyRooms || [];
 const phase = labState.cssPhase || 0;
 return `
 <div class="ch-cascade-scene">
 ${renderHouse({ rooms: ["header", "main", "sidebar", "nook", "footer"], compact: true })}
 </div>
 <div class="ch-tray">
 ${phase === 0 ? `<button type="button" class="ch-rule-chip" draggable="true" data-rule="cozy">.cozy-room { background: cream; padding: 20px; }</button>` : ""}
 ${phase === 1 && cozy.length >= 3 ? `<button type="button" class="ch-rule-chip" draggable="true" data-rule="override">#reading-nook { background: gold; }</button>` : ""}
 <p class="ch-hint">${phase === 0 ? "Drag the class rule onto 3 rooms." : "Override just the reading nook with the id rule."}</p>
 </div>`;
}

function renderSheet() {
 const color = labState.cssSheetColor || "#fff7ed";
 return `
 <div class="ch-sheet-scene">
 <div class="ch-sheet-doc">
 <span class="ch-sheet-title">styles.css</span>
 <pre><code>.cozy-room {
  background-color: ${color};
  padding: 20px;
}</code></pre>
 <label>Change sheet color <input type="color" value="${color}" id="ch-sheet-color" /></label>
 </div>
 ${renderHouse({ rooms: cozyConnectedRooms(), compact: true })}
 </div>`;
}

function cozyConnectedRooms() {
 return (labState.cssCozyRooms || []).length ? labState.cssCozyRooms : ["main", "sidebar", "nook"];
}

function renderSummary() {
 return `
 <ul class="ch-term-list">
 <li><code>.cozy-room</code>: class selector, many elements</li>
 <li><code>#reading-nook</code>: id selector, one unique element</li>
 <li><strong>Cascading</strong>: more specific rules override general ones</li>
 <li>CSS = <strong>Cascading Style Sheets</strong></li>
 <li class="ch-term-note">Next: JavaScript makes the house react when you click.</li>
 </ul>`;
}

function renderClose(u) {
 const t = Math.min(1, u || 0);
 return `
 <div class="ch-close-scene" style="--ch-close:${t}">
 ${renderHouse({
 outline: t < 0.15,
 rooms: ["header", "hero", "main", "footer"],
 })}
 </div>`;
}

function renderStage(mode) {
 switch (mode) {
 case "unstyled":
 return renderUnstyled();
 case "paint":
 return renderPaint();
 case "rule":
 return renderRule();
 case "terms":
 return renderTerms();
 case "box":
 return renderBox();
 case "boxcut":
 return renderBoxCut();
 case "boxcode":
 return renderBoxCode();
 case "resize":
 return renderResize();
 case "gallery":
 return renderGallery();
 case "sizecode":
 return renderSizeCode();
 case "cascade":
 return renderCascade();
 case "sheet":
 return renderSheet();
 case "summary":
 return renderSummary();
 case "close":
 return renderClose(labState.cssCloseU);
 default:
 return renderUnstyled();
 }
}

function applyPaint(room, color, onChange) {
 if (!room || !color) return;
 labState.cssRoomColors = { ...(labState.cssRoomColors || {}), [room]: color };
 if (room === "main") {
 labState.cssPaintMain = true;
 labState.cssPhase = 1;
 labState.cssSelectedRoom = "";
 labState.cssPointerOn = false;
 }
 if (room === "header") labState.cssPaintHeader = true;
 pulseSuccessFeedback(240);
 onChange?.();
 syncCssHouse(labState.cssMode);
}

function bindInteractions(root, onChange) {
 root.querySelector("#ch-pointer")?.addEventListener("click", () => {
 labState.cssPointerOn = !labState.cssPointerOn;
 pulseSuccessFeedback(120);
 syncCssHouse("paint");
 });

 root.querySelectorAll(".ch-room[data-room]").forEach((el) => {
 el.addEventListener("click", () => {
 if (labState.cssMode !== "paint" || !labState.cssPointerOn) return;
 labState.cssSelectedRoom = el.dataset.room;
 pulseSuccessFeedback(160);
 syncCssHouse("paint");
 });
 el.addEventListener("dragover", (e) => e.preventDefault());
 el.addEventListener("drop", (e) => {
 e.preventDefault();
 const color = e.dataTransfer.getData("text/color");
 if (color && labState.cssSelectedRoom === el.dataset.room) {
 applyPaint(el.dataset.room, color, onChange);
 }
 });
 });

 root.querySelectorAll(".ch-swatch").forEach((sw) => {
 sw.addEventListener("dragstart", (e) => {
 e.dataTransfer.setData("text/color", sw.dataset.color);
 });
 sw.addEventListener("click", () => {
 if (labState.cssSelectedRoom) applyPaint(labState.cssSelectedRoom, sw.dataset.color, onChange);
 });
 });

 root.querySelectorAll("[data-slider]").forEach((sl) => {
 sl.addEventListener("input", () => {
 const v = Number(sl.value);
 const key = sl.dataset.slider;
 if (key === "padding") {
 labState.cssPadding = v;
 labState.cssPaddingTouched = v > 4;
 } else if (key === "border") {
 labState.cssBorder = v;
 labState.cssBorderTouched = v > 2;
 } else if (key === "margin") {
 labState.cssMargin = v;
 labState.cssMarginTouched = v > 4;
 } else if (key === "width") {
 labState.cssWidth = v;
 labState.cssSizeTouched = true;
 } else if (key === "height") {
 labState.cssHeight = v;
 labState.cssSizeTouched = true;
 }
 onChange?.();
 syncCssHouse(labState.cssMode);
 });
 });

 root.querySelectorAll(".ch-align").forEach((btn) => {
 btn.addEventListener("click", () => {
 const a = btn.dataset.align;
 labState.cssAlign = a;
 labState.cssAlignTried = { ...(labState.cssAlignTried || {}), [a]: true };
 pulseSuccessFeedback(180);
 onChange?.();
 syncCssHouse("resize");
 });
 });

 root.querySelectorAll(".ch-room[data-room]").forEach((el) => {
 if (labState.cssMode !== "cascade") return;
 el.addEventListener("dragover", (e) => e.preventDefault());
 el.addEventListener("drop", (e) => {
 e.preventDefault();
 const rule = e.dataTransfer.getData("text/rule");
 const room = el.dataset.room;
 if (rule === "cozy" && !labState.cssCozyRooms.includes(room)) {
 labState.cssCozyRooms = [...(labState.cssCozyRooms || []), room];
 if (labState.cssCozyRooms.length >= 3) labState.cssPhase = 1;
 pulseSuccessFeedback(220);
 } else if (rule === "override" && room === "nook") {
 labState.cssOverrideNook = true;
 pulseSuccessFeedback(220);
 } else if (rule) {
 pulseFailFeedback(280);
 }
 onChange?.();
 syncCssHouse("cascade");
 });
 });

 root.querySelectorAll(".ch-rule-chip").forEach((chip) => {
 chip.addEventListener("dragstart", (e) => {
 e.dataTransfer.setData("text/rule", chip.dataset.rule);
 });
 chip.addEventListener("click", () => {
 if (chip.dataset.rule === "cozy" && labState.cssCozyRooms.length < 3) {
 const pool = ["main", "sidebar", "nook", "footer"].filter((r) => !labState.cssCozyRooms.includes(r));
 if (pool.length) {
 labState.cssCozyRooms = [...labState.cssCozyRooms, pool[0]];
 if (labState.cssCozyRooms.length >= 3) labState.cssPhase = 1;
 pulseSuccessFeedback(200);
 syncCssHouse("cascade");
 onChange?.();
 }
 } else if (chip.dataset.rule === "override") {
 labState.cssOverrideNook = true;
 pulseSuccessFeedback(200);
 syncCssHouse("cascade");
 onChange?.();
 }
 });
 });

 root.querySelector("#ch-sheet-color")?.addEventListener("input", (e) => {
 labState.cssSheetColor = e.target.value;
 onChange?.();
 syncCssHouse("sheet");
 });
}

const BANNERS = {
 unstyled: "Structurally perfect: completely unlivable until CSS paints it.",
 paint: "Point at a room (selector), then pick a color (property + value).",
 rule: "Selector → which room. Property → what to change. Value → change it to this.",
 terms: "A rule = selector + declarations inside { }.",
 box: "Padding inside · Border is the wall · Margin pushes neighbors away.",
 boxcut: "Four nested layers: on every element, always in this order.",
 boxcode: "The box model: one of the most important ideas in CSS.",
 resize: "width / height = room size. text-align = furniture placement.",
 gallery: "Same room, same text: four different feelings from alignment alone.",
 sizecode: "Two lines of code: precise size and alignment.",
 cascade: "One class styles many rooms at once. Then override just one with an id.",
 sheet: "One stylesheet file: every connected room updates together.",
 summary: "Class · id · cascading: CSS stands for Cascading Style Sheets.",
 close: "From blueprint to home: color, space, alignment, one sheet.",
};

export function mountCssHouse(viewport, onChange) {
 if (!viewport) return () => {};
 if (document.getElementById(ROOT_ID)) return () => unmountCssHouse(viewport);

 const root = document.createElement("div");
 root.id = ROOT_ID;
 root.className = "css-house-root";
 root.innerHTML = `<p class="ch-banner" id="ch-banner"></p><div class="ch-stage" id="ch-stage"></div>`;
 viewport.appendChild(root);
 viewport.classList.add("viewport--csshouse");

 syncCssHouse(labState.cssMode || "unstyled", { onChange });

 return () => unmountCssHouse(viewport);
}

export function syncCssHouse(mode, opts = {}) {
 labState.cssMode = mode || labState.cssMode || "unstyled";
 const root = document.getElementById(ROOT_ID);
 if (!root) return;

 const renderKey = [
 labState.cssMode,
 labState.cssPhase,
 labState.cssSelectedRoom,
 labState.cssPaintMain ? 1 : 0,
 labState.cssPaintHeader ? 1 : 0,
 labState.cssPadding,
 labState.cssBorder,
 labState.cssMargin,
 labState.cssWidth,
 labState.cssHeight,
 labState.cssAlign,
 JSON.stringify(labState.cssAlignTried),
 (labState.cssCozyRooms || []).join(","),
 labState.cssOverrideNook ? 1 : 0,
 labState.cssSheetColor,
 Math.floor((labState.cssCloseU || 0) * 20),
 JSON.stringify(labState.cssRoomColors),
 ].join("|");

 const stage = root.querySelector("#ch-stage");
 const banner = root.querySelector("#ch-banner");

 if (stage && renderKey !== lastRenderKey) {
 stage.innerHTML = renderStage(labState.cssMode);
 lastRenderKey = renderKey;
 bindInteractions(root, opts.onChange);
 if (labState.cssMode === "unstyled" && !labState.cssOpenReady) {
 clearTimeout(paintTimer);
 paintTimer = setTimeout(() => {
 labState.cssOpenReady = true;
 opts.onChange?.();
 }, 2200);
 }
 } else if (labState.cssMode === "close" && stage) {
 stage.style.setProperty("--ch-close", String(labState.cssCloseU || 0));
 }

 if (banner) banner.textContent = opts.banner || BANNERS[labState.cssMode] || "";
}

export function unmountCssHouse(viewport) {
 clearTimeout(paintTimer);
 paintTimer = null;
 lastRenderKey = "";
 document.getElementById(ROOT_ID)?.remove();
 viewport?.classList.remove("viewport--csshouse");
}
