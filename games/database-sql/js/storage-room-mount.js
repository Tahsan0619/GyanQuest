/**
 * Tables & Rows DOM overlay - storage room metaphor (database = organized shelves).
 * Continues Backend Builder: kitchen → storage room door.
 */
import { labState, pulseFailFeedback, pulseSuccessFeedback } from "./lab-state.js?v=stor2";

const ROOT_ID = "storage-room-root";

const CHAOS_SLIPS = [
 "Order #104 - A. Chen",
 "Order #88 - M. Lopez",
 "Order #12 - K. Singh",
 "Order #55 - J. Rivera",
 "Order #71 - T. Walsh",
 "Order #33 - R. Park",
 "Order #19 - L. Gomez",
 "Order #62 - D. Nguyen",
 "Order #41 - S. Ali",
 "Order #77 - P. Costa",
];

const HEADER_LABELS = [
 { id: "name", text: "Name" },
 { id: "email", text: "Email" },
 { id: "city", text: "City" },
];

const CARD_PRESETS = [
 { name: "Maria Chen", email: "maria@email.com", city: "Austin" },
 { name: "Sam Okonkwo", email: "sam@email.com", city: "Dhaka" },
 { name: "Nila Rahman", email: "nila@email.com", city: "Sylhet" },
];

/** Full Customers table used in schema + query spirals */
export const SAMPLE_CUSTOMERS = [
 { name: "Maria Chen", email: "maria@email.com", city: "Austin", phone: "5125550101" },
 { name: "J. Rivera", email: "j.rivera@email.com", city: "Austin", phone: "5125550102" },
 { name: "Priya Patel", email: "priya@email.com", city: "Austin", phone: "5125550188" },
 { name: "Alex Kim", email: "alex@email.com", city: "Seattle", phone: "2065550199" },
 { name: "Sam Okonkwo", email: "sam@email.com", city: "Dhaka", phone: "8801712345678" },
 { name: "Nila Rahman", email: "nila@email.com", city: "Sylhet", phone: "8801812345678" },
 { name: "Rafi Ahmed", email: "rafi@email.com", city: "Dhaka", phone: "8801912345678" },
 { name: "Maya Das", email: "maya@email.com", city: "Austin", phone: "5125550144" },
 { name: "Tom Wright", email: "tom@email.com", city: "Boston", phone: "6175550100" },
 { name: "Elena Ruiz", email: "elena@email.com", city: "Austin", phone: "5125550177" },
 { name: "Chris Lee", email: "chris@email.com", city: "Portland", phone: "5035550123" },
 { name: "Fatima Noor", email: "fatima@email.com", city: "Austin", phone: "5125550166" },
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
 if (!el) return;
 el.addEventListener(event, fn);
 liveHandlers.push(() => el.removeEventListener(event, fn));
}

function allRows() {
 const user = labState.dbRows || [];
 if (user.length >= 3) return [...user, ...SAMPLE_CUSTOMERS.slice(user.length)];
 return user.length ? [...user, ...SAMPLE_CUSTOMERS] : SAMPLE_CUSTOMERS;
}

function renderOpen() {
 const open = labState.dbDoorOpen;
 return `
 <div class="sr-open-scene">
 <div class="sr-kitchen-mini">
 <span>🍳 Kitchen (busy)</span>
 <div class="sr-storage-door ${open ? "is-open" : ""}">
 <span>Storage Room</span>
 ${!open ? '<button type="button" class="btn secondary" id="sr-open-door">Open the Storage Room →</button>' : ""}
 </div>
 </div>
 ${open ? '<p class="sr-caption">Every ingredient, customer, and order lives back here.</p>' : ""}
 </div>`;
}

function renderSearch() {
 if (labState.dbSearchPhase === "organized") {
 return `
 <div class="sr-search-scene">
 <p class="sr-hint">Find customer <strong>J. Rivera</strong> - one click on the R folder.</p>
 <div class="sr-folders">
 ${["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T"].map((l) =>
 `<button type="button" class="sr-folder ${labState.dbOrganizedFound && l === "R" ? "is-found" : ""}" data-folder="${l}">${l}</button>`,
 ).join("")}
 </div>
 ${labState.dbOrganizedFound ? '<p class="sr-note sr-note--ok">Instant. Same information - organized.</p>' : ""}
 </div>`;
 }
 const idx = labState.dbChaosClicks || 0;
 const shown = CHAOS_SLIPS.slice(0, Math.min(idx + 1, CHAOS_SLIPS.length));
 return `
 <div class="sr-search-scene">
 <p class="sr-hint">Chaotic pile - find <strong>J. Rivera</strong>. Click slips one at a time.</p>
 <div class="sr-chaos-pile">
 ${shown.map((s, i) => {
 const isTarget = s.includes("J. Rivera");
 const found = labState.dbFoundRivera && isTarget;
 return `<button type="button" class="sr-slip ${found ? "is-target" : ""}" data-slip="${i}">${esc(s)}</button>`;
 }).join("")}
 ${idx < CHAOS_SLIPS.length - 1 && !labState.dbFoundRivera ? '<button type="button" class="sr-slip sr-slip--more" id="sr-next-slip">Dig deeper…</button>' : ""}
 </div>
 ${labState.dbFoundRivera ? '<p class="sr-note">That took a while - and this pile only has a dozen slips.</p>' : ""}
 ${labState.dbFoundRivera && !labState.dbOrganizedReady ? '<button type="button" class="btn primary" id="sr-to-organized">Try the organized version →</button>' : ""}
 </div>`;
}

function renderShelves1() {
 return `
 <div class="sr-shelves">
 <div class="sr-shelf"><span>Customers</span></div>
 <div class="sr-shelf"><span>Orders</span></div>
 <div class="sr-shelf"><span>Ingredients</span></div>
 </div>
 <p class="sr-caption">One room. Many shelves. Each shelf holds exactly one kind of thing.</p>`;
}

function renderTerms1() {
 return `
 <ul class="sr-term-list">
 <li><strong>Database</strong> - organized information, structured to be stored, searched, and retrieved reliably</li>
 <li class="sr-term-note">A pile of information isn't a database. A structured, searchable one is.</li>
 </ul>`;
}

function renderBuild2() {
 const headers = labState.dbHeaders || [];
 const rows = labState.dbRows || [];
 const allH = headers.length >= 3;
 return `
 <div class="sr-build-scene">
 <div class="sr-shelf-block">
 <h4>Customers shelf</h4>
 <div class="sr-template">
 ${HEADER_LABELS.map((h) => {
 const filled = headers.includes(h.id);
 return `<div class="sr-header-slot ${filled ? "is-filled" : ""}" data-header="${h.id}">${filled ? h.text : "Drop header"}</div>`;
 }).join("")}
 </div>
 ${!allH ? `<div class="sr-tray">${HEADER_LABELS.filter((h) => !headers.includes(h.id)).map((h) => `<div class="sr-tray-chip" draggable="true" data-header-chip="${h.id}">${h.text}</div>`).join("")}</div>` : ""}
 <div class="sr-cards-on-shelf">
 ${rows.map((r, i) => `<div class="sr-card">${esc(r.name)} · ${esc(r.city)}</div>`).join("")}
 </div>
 ${allH && rows.length < 3 ? `
 <div class="sr-card-form">
 <p>Add card ${rows.length + 1} of 3:</p>
 <input type="text" placeholder="Name" id="sr-in-name" />
 <input type="email" placeholder="Email" id="sr-in-email" />
 <input type="text" placeholder="City" id="sr-in-city" />
 <button type="button" class="btn primary" id="sr-add-card">Place card on shelf</button>
 </div>` : ""}
 </div>
 </div>`;
}

function renderGrid2() {
 const rows = allRows().slice(0, 6);
 return `
 <div class="sr-grid-wrap">
 <table class="sr-grid">
 <thead><tr><th>Name</th><th>Email</th><th>City</th></tr></thead>
 <tbody>${rows.map((r) => `<tr><td>${esc(r.name)}</td><td>${esc(r.email)}</td><td>${esc(r.city)}</td></tr>`).join("")}</tbody>
 </table>
 </div>
 <p class="sr-caption">Shelf ↔ Table · Card ↔ Row · Header category ↔ Column</p>`;
}

function renderTerms2() {
 return `
 <ul class="sr-term-list">
 <li><strong>Table</strong> - named collection of related data in rows and columns</li>
 <li><strong>Row (record)</strong> - one individual entry</li>
 <li><strong>Column (field)</strong> - one shared category every row fills in</li>
 </ul>`;
}

function renderSchema3() {
 const rejected = labState.dbRejected;
 const accepted = labState.dbAcceptedRow;
 return `
 <div class="sr-schema-scene">
 <div class="sr-blueprint">📋 Blueprint</div>
 <div class="sr-card-form sr-card-form--schema">
 <input type="text" placeholder="Name (required)" id="sr-schema-name" value="${labState.dbSchemaName || ""}" />
 <input type="email" placeholder="Email" id="sr-schema-email" value="${labState.dbSchemaEmail || ""}" />
 <input type="text" placeholder="Phone (digits only)" id="sr-schema-phone" value="${labState.dbSchemaPhoneVal || ""}" />
 <button type="button" class="btn primary" id="sr-schema-submit">Place card on shelf</button>
 </div>
 ${rejected && !accepted ? '<p class="sr-note sr-note--err">Rejected: Name cannot be empty. Phone Number must contain only digits.</p>' : ""}
 ${accepted ? '<p class="sr-note sr-note--ok">Accepted - card follows the blueprint.</p>' : ""}
 </div>`;
}

function renderBlueprint3() {
 return `
 <div class="sr-blueprint-diagram">
 <div class="sr-bp-row"><span>Name</span><span>Text · Required ✓</span></div>
 <div class="sr-bp-row"><span>Email</span><span>Text · Required ✓</span></div>
 <div class="sr-bp-row"><span>Phone</span><span>Numbers only · Optional</span></div>
 </div>
 <p class="sr-caption">Every column has a job description: data type and whether it's required.</p>`;
}

function renderTerms3() {
 return `
 <ul class="sr-term-list">
 <li><strong>Schema</strong> - defined structure: columns, data types, and rules entries must follow</li>
 <li><strong>Data type</strong> - kind of value allowed (text, number, date)</li>
 <li class="sr-term-note">Schema is decided before real data is added - blueprint first.</li>
 </ul>`;
}

function renderQuery4() {
 const p = labState.dbQueryParts || {};
 const ready = p.select && p.from && p.where;
 const city = labState.dbQueryCity || "Austin";
 const results = ready ? allRows().filter((r) => r.city === city) : [];
 return `
 <div class="sr-query-scene">
 <div class="sr-query-form">
 <div class="sr-q-slot ${p.select ? "is-filled" : ""}"><span class="sr-q-label">Show me</span>${p.select ? "Name, Email" : "Drop columns"}</div>
 <div class="sr-q-slot ${p.from ? "is-filled" : ""}"><span class="sr-q-label">from</span>${p.from ? "Customers" : "Drop table"}</div>
 <div class="sr-q-slot ${p.where ? "is-filled" : ""}"><span class="sr-q-label">where</span>${p.where ? `City = ${city}` : "Drop condition"}</div>
 </div>
 ${!ready ? `
 <div class="sr-tray">
 ${!p.select ? '<div class="sr-tray-chip" draggable="true" data-q="select">Name, Email</div>' : ""}
 ${!p.from ? '<div class="sr-tray-chip" draggable="true" data-q="from">Customers</div>' : ""}
 ${!p.where ? '<div class="sr-tray-chip" draggable="true" data-q="where">City = Austin</div>' : ""}
 </div>` : `
 <div class="sr-query-results">
 <p>Matching cards:</p>
 ${results.map((r) => `<div class="sr-result-card">${esc(r.name)} · ${esc(r.email)}</div>`).join("")}
 ${labState.dbQueryResubmitted ? `<p class="sr-caption">Changed to City = ${esc(labState.dbQueryCityAlt || "Seattle")} - different rows pulled.</p>` : ""}
 ${!labState.dbQueryResubmitted ? '<button type="button" class="btn secondary" id="sr-requery">Change where → City = Seattle</button>' : ""}
 </div>`}
 </div>`;
}

function renderMorph4() {
 return `
 <pre class="sr-code"><code>SELECT Name, Email
FROM Customers
WHERE City = 'Austin';</code></pre>
 <p class="sr-caption">'Show me' → SELECT · 'from' → FROM · 'where' → WHERE</p>`;
}

function renderTerms4() {
 return `
 <pre class="sr-code"><code>SELECT Name, Email
FROM Customers
WHERE City = 'Austin';</code></pre>
 <ul class="sr-term-list">
 <li><strong>SQL</strong> - Structured Query Language</li>
 <li><strong>Query</strong> - a single SQL request</li>
 <li><strong>SELECT</strong> · <strong>FROM</strong> · <strong>WHERE</strong></li>
 <li class="sr-term-note"><em>Next: linking Customers to Orders - relationships between tables.</em></li>
 </ul>`;
}

function renderClose(u) {
 const t = Math.min(1, u || 0);
 return `
 <div class="sr-close-scene" style="--sr-close:${t}">
 <div class="sr-storage-door is-open is-lit">
 <span>Storage Room</span>
 <div class="sr-close-inner" style="opacity:${t}">
 <span>📚 Shelves</span><span>📋 Blueprints</span><span>📝 Query terminal</span>
 </div>
 </div>
 </div>`;
}

function renderStage(mode) {
 switch (mode) {
 case "open": return renderOpen();
 case "search": return renderSearch();
 case "shelves1": return renderShelves1();
 case "terms1": return renderTerms1();
 case "build2": return renderBuild2();
 case "grid2": return renderGrid2();
 case "terms2": return renderTerms2();
 case "schema3": return renderSchema3();
 case "blueprint3": return renderBlueprint3();
 case "terms3": return renderTerms3();
 case "query4": return renderQuery4();
 case "morph4": return renderMorph4();
 case "terms4": return renderTerms4();
 case "close": return renderClose(labState.dbCloseU);
 default: return renderOpen();
 }
}

function bindOpen(root, onChange) {
 track(root.querySelector("#sr-open-door"), "click", () => {
 labState.dbDoorOpen = true;
 pulseSuccessFeedback(220);
 syncStorageRoom("open", { onChange });
 setTimeout(() => {
 labState.dbOpenReady = true;
 onChange?.();
 }, 800);
 });
}

function bindSearch(root, onChange) {
 if (labState.dbSearchPhase === "organized") {
 root.querySelectorAll("[data-folder]").forEach((btn) => {
 track(btn, "click", () => {
 if (btn.dataset.folder === "R") {
 labState.dbOrganizedFound = true;
 pulseSuccessFeedback(240);
 syncStorageRoom("search", { onChange });
 onChange?.();
 } else {
 pulseFailFeedback(200);
 }
 });
 });
 return;
 }
 const advance = () => {
 if ((labState.dbChaosClicks || 0) < CHAOS_SLIPS.length - 1) {
 labState.dbChaosClicks = (labState.dbChaosClicks || 0) + 1;
 syncStorageRoom("search", { onChange });
 }
 };
 root.querySelectorAll("[data-slip]").forEach((btn) => {
 track(btn, "click", () => {
 const i = Number(btn.dataset.slip);
 const slip = CHAOS_SLIPS[i];
 if (slip?.includes("J. Rivera")) {
 labState.dbFoundRivera = true;
 pulseSuccessFeedback(260);
 syncStorageRoom("search", { onChange });
 onChange?.();
 } else {
 advance();
 pulseFailFeedback(160);
 }
 });
 });
 track(root.querySelector("#sr-next-slip"), "click", () => {
 advance();
 pulseFailFeedback(120);
 });
 track(root.querySelector("#sr-to-organized"), "click", () => {
 labState.dbSearchPhase = "organized";
 labState.dbOrganizedReady = true;
 syncStorageRoom("search", { onChange });
 onChange?.();
 });
}

function bindBuild2(root, onChange) {
 root.querySelectorAll("[data-header-chip]").forEach((chip) => {
 track(chip, "dragstart", (e) => {
 e.dataTransfer.setData("text/header", chip.dataset.headerChip);
 });
 });
 root.querySelectorAll("[data-header]").forEach((slot) => {
 track(slot, "dragover", (e) => e.preventDefault());
 track(slot, "drop", (e) => {
 e.preventDefault();
 const id = e.dataTransfer.getData("text/header");
 const headers = [...(labState.dbHeaders || [])];
 const expected = HEADER_LABELS[headers.length]?.id;
 if (id !== expected) {
 pulseFailFeedback(300);
 return;
 }
 labState.dbHeaders = [...headers, id];
 pulseSuccessFeedback(200);
 syncStorageRoom("build2", { onChange });
 onChange?.();
 });
 });
 track(root.querySelector("#sr-add-card"), "click", () => {
 const name = root.querySelector("#sr-in-name")?.value?.trim();
 const email = root.querySelector("#sr-in-email")?.value?.trim();
 const city = root.querySelector("#sr-in-city")?.value?.trim();
 if (!name || !email || !city) {
 pulseFailFeedback(280);
 return;
 }
 labState.dbRows = [...(labState.dbRows || []), { name, email, city }];
 pulseSuccessFeedback(220);
 syncStorageRoom("build2", { onChange });
 onChange?.();
 });
}

function bindSchema3(root, onChange) {
 track(root.querySelector("#sr-schema-submit"), "click", () => {
 const name = root.querySelector("#sr-schema-name")?.value?.trim() || "";
 const email = root.querySelector("#sr-schema-email")?.value?.trim() || "";
 const phone = root.querySelector("#sr-schema-phone")?.value?.trim() || "";
 labState.dbSchemaName = name;
 labState.dbSchemaEmail = email;
 labState.dbSchemaPhoneVal = phone;
 if (!name || /[^0-9]/.test(phone)) {
 labState.dbRejected = true;
 labState.dbAcceptedRow = false;
 pulseFailFeedback(320);
 } else {
 labState.dbAcceptedRow = true;
 pulseSuccessFeedback(260);
 }
 syncStorageRoom("schema3", { onChange });
 onChange?.();
 });
}

function bindQuery4(root, onChange) {
 root.querySelectorAll("[data-q]").forEach((chip) => {
 track(chip, "dragstart", (e) => {
 e.dataTransfer.setData("text/qpart", chip.dataset.q);
 });
 track(chip, "click", () => {
 const part = chip.dataset.q;
 if (!(labState.dbQueryParts || {})[part]) {
 labState.dbQueryParts = { ...(labState.dbQueryParts || {}), [part]: true };
 pulseSuccessFeedback(180);
 syncStorageRoom("query4", { onChange });
 onChange?.();
 }
 });
 });
 const keys = ["select", "from", "where"];
 root.querySelectorAll(".sr-q-slot").forEach((slot, i) => {
 track(slot, "dragover", (e) => e.preventDefault());
 track(slot, "drop", (e) => {
 e.preventDefault();
 const part = e.dataTransfer.getData("text/qpart");
 if (part !== keys[i]) {
 pulseFailFeedback(280);
 return;
 }
 labState.dbQueryParts = { ...(labState.dbQueryParts || {}), [part]: true };
 pulseSuccessFeedback(200);
 syncStorageRoom("query4", { onChange });
 onChange?.();
 });
 track(slot, "click", () => {
 const part = keys[i];
 if (!(labState.dbQueryParts || {})[part]) {
 labState.dbQueryParts = { ...(labState.dbQueryParts || {}), [part]: true };
 pulseSuccessFeedback(180);
 syncStorageRoom("query4", { onChange });
 onChange?.();
 }
 });
 });
 track(root.querySelector("#sr-requery"), "click", () => {
 labState.dbQueryCityAlt = "Seattle";
 labState.dbQueryCity = "Seattle";
 labState.dbQueryResubmitted = true;
 pulseSuccessFeedback(180);
 syncStorageRoom("query4", { onChange });
 onChange?.();
 });
}

function bindInteractions(root, onChange) {
 clearLiveHandlers();
 const mode = labState.dbMode;
 if (mode === "open") bindOpen(root, onChange);
 if (mode === "search") bindSearch(root, onChange);
 if (mode === "build2") bindBuild2(root, onChange);
 if (mode === "schema3") bindSchema3(root, onChange);
 if (mode === "query4") bindQuery4(root, onChange);
}

const BANNERS = {
 open: "The kitchen's storage room door - where every ingredient actually lives.",
 search: "Chaotic pile vs organized shelves - feel why databases exist.",
 shelves1: "Customers · Orders · Ingredients - one shelf per kind.",
 terms1: "Database = organized, searchable stored information.",
 build2: "Build the Customers shelf - headers, then cards.",
 grid2: "Same data as a spreadsheet grid.",
 terms2: "Table · Row · Column.",
 schema3: "Try to break the rules - blank name, bad phone.",
 blueprint3: "Column job descriptions: type and required.",
 terms3: "Schema · Data type · Blueprint first.",
 query4: "Fill the request form - Show me / from / where.",
 morph4: "Request form → real SQL.",
 terms4: "SELECT · FROM · WHERE - real SQL.",
 close: "Organized shelves, blueprints, query terminal - understood.",
};

export function mountStorageRoom(viewport, onChange) {
 if (!viewport) return () => {};
 unmountStorageRoom(viewport);

 const root = document.createElement("div");
 root.id = ROOT_ID;
 root.className = "storage-room-root";
 root.innerHTML = `<p class="sr-banner" id="sr-banner"></p><div class="sr-stage" id="sr-stage"></div>`;
 viewport.appendChild(root);
 viewport.classList.add("viewport--storage");

 syncStorageRoom(labState.dbMode || "open", { onChange });
 return () => unmountStorageRoom(viewport);
}

export function syncStorageRoom(mode, opts = {}) {
 labState.dbMode = mode || labState.dbMode || "open";
 const root = document.getElementById(ROOT_ID);
 if (!root) return;

 const renderKey = [
 labState.dbMode,
 labState.dbDoorOpen ? 1 : 0,
 labState.dbSearchPhase,
 labState.dbChaosClicks,
 labState.dbFoundRivera ? 1 : 0,
 labState.dbOrganizedFound ? 1 : 0,
 (labState.dbHeaders || []).join(","),
 (labState.dbRows || []).length,
 labState.dbRejected ? 1 : 0,
 labState.dbAcceptedRow ? 1 : 0,
 JSON.stringify(labState.dbQueryParts || {}),
 labState.dbQueryResubmitted ? 1 : 0,
 labState.dbQueryCity,
 Math.floor((labState.dbCloseU || 0) * 20),
 ].join("|");

 const stage = root.querySelector("#sr-stage");
 const banner = root.querySelector("#sr-banner");

 if (stage && renderKey !== lastRenderKey) {
 stage.innerHTML = renderStage(labState.dbMode);
 lastRenderKey = renderKey;
 bindInteractions(root, opts.onChange);
 } else if (labState.dbMode === "close" && stage) {
 stage.style.setProperty("--sr-close", String(labState.dbCloseU || 0));
 }

 if (banner) banner.textContent = opts.banner || BANNERS[labState.dbMode] || "";
}

export function unmountStorageRoom(viewport) {
 clearTimeout(openTimer);
 openTimer = null;
 lastRenderKey = "";
 clearLiveHandlers();
 document.getElementById(ROOT_ID)?.remove();
 viewport?.classList.remove("viewport--storage");
}
