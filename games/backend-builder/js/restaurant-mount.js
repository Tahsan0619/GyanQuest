/**
 * Server Basics DOM overlay - restaurant metaphor (client table ? kitchen server).
 */
import { labState, pulseFailFeedback, pulseSuccessFeedback } from "./lab-state.js?v=rest2";

const ROOT_ID = "restaurant-root";

let lastRenderKey = "";
let openTimer = null;
let busyTimer = null;
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

function renderTable(opts = {}) {
 const { callBtn = true, label = "Table (Client)", hasFood = false } = opts;
 return `
 <div class="rs-table">
 <span class="rs-table-label">${esc(label)}</span>
 <div class="rs-customer">Guest</div>
 ${callBtn ? `<button type="button" class="rs-call-btn" id="rs-call-btn">Call</button>` : ""}
 ${hasFood ? '<div class="rs-plate is-arrived">Homepage Special</div>' : '<div class="rs-plate-slot"></div>'}
 </div>`;
}

function renderKitchen(opts = {}) {
 const { visible = true, busy = false, chefs = 1, queue = 0 } = opts;
 if (!visible) return "";
 return `
 <div class="rs-kitchen ${busy ? "is-busy" : ""}" id="rs-kitchen">
 <span class="rs-kitchen-label">Kitchen (Server)</span>
 <div class="rs-chefs">${chefs} chef${chefs === 1 ? "" : "s"} cooking</div>
 ${queue > 0 ? `<div class="rs-queue">${queue} ticket${queue === 1 ? "" : "s"} waiting</div>` : ""}
 </div>`;
}

function renderHallway(connected) {
 return connected
 ? '<div class="rs-hallway is-connected"><span>Network link</span></div>'
 : '<div class="rs-hallway-slot" id="rs-hallway-slot">Drop hallway here</div>';
}

function renderOpen() {
 const phase = labState.srvLoadPhase || 0;
 return `
 <div class="rs-open-scene">
 <div class="rs-browser">
 <div class="rs-url-bar">https://example.com</div>
 <div class="rs-page ${phase >= 2 ? "is-loaded" : phase >= 1 ? "is-blank" : ""}">
 ${phase >= 2 ? "<p>Welcome! Content loaded.</p><div class='rs-page-hero' aria-hidden='true'></div>" : phase >= 1 ? "<span class='rs-blank-flash'>...</span>" : "<p>Click a link...</p>"}
 </div>
 </div>
 ${phase === 0 ? '<button type="button" class="btn secondary rs-link-btn" id="rs-sim-click">Click link -></button>' : ""}
 </div>`;
}

function renderKitchen1() {
 const placed = labState.srvKitchenPlaced;
 const connected = labState.srvHallwayConnected;
 return `
 <div class="rs-floor rs-floor--single">
 ${renderTable({ hasFood: labState.srvCallWorked })}
 ${renderHallway(connected)}
 ${placed ? renderKitchen({ visible: true, busy: labState.srvCallWorked }) : '<div class="rs-kitchen-slot" id="rs-kitchen-slot">Drop kitchen here</div>'}
 </div>
 ${!placed ? '<div class="rs-tray-chip" draggable="true" data-drag="kitchen">Kitchen chip</div>' : ""}
 ${placed && !connected ? '<div class="rs-tray-chip" draggable="true" data-drag="hallway">Hallway chip</div>' : ""}
 ${labState.srvCallTriedEmpty && !connected ? '<p class="rs-note">You asked - but nothing on the other end can make the food.</p>' : ""}
 ${labState.srvCallWorked ? '<p class="rs-note rs-note--ok">Same button. Something existed on the other end, ready to respond.</p>' : ""}`;
}

function renderSplit1() {
 return `
 <div class="rs-split">
 <div class="rs-split-side"><span class="rs-split-icon">C</span><strong>Client</strong><p>asks for things</p></div>
 <div class="rs-split-line"><-></div>
 <div class="rs-split-side"><span class="rs-split-icon">S</span><strong>Server</strong><p>has &amp; provides</p></div>
 </div>
 <p class="rs-caption">Client: asks. Server: has, and provides.</p>`;
}

function renderTerms1() {
 return `
 <ul class="rs-term-list">
 <li><strong>Client</strong> - the program (often your browser) that requests information or services</li>
 <li><strong>Server</strong> - a program on a computer that listens for requests and provides what's asked for</li>
 <li><strong>Network</strong> - the connection carrying requests and responses back and forth</li>
 </ul>`;
}

function renderOrder2() {
 return `
 <div class="rs-order-scene">
 <div class="rs-floor rs-floor--order">
 ${renderTable({ callBtn: false, label: "Table + Menu" })}
 <div class="rs-rail">Ticket rail -></div>
 ${renderKitchen({ visible: true, busy: labState.srvTicketFlying })}
 </div>
 <div class="rs-menu">
 <button type="button" class="rs-menu-item" data-order="home">Homepage Special</button>
 <button type="button" class="rs-menu-item rs-menu-item--bad" data-order="secret">Secret Page - Not on Menu</button>
 </div>
 ${labState.srvOrderSuccess ? '<div class="rs-ticket rs-ticket--ok">200 - plate delivered</div>' : ""}
 ${labState.srvOrder404 ? '<div class="rs-ticket rs-ticket--err">404 - Sorry, we don\'t have that</div>' : ""}
 </div>`;
}

function renderLoop2() {
 return `
 <div class="rs-loop">
 <div class="rs-loop-node">Browser</div>
 <div class="rs-loop-arrow">Request -></div>
 <div class="rs-loop-node">Server</div>
 <div class="rs-loop-arrow"><- Response</div>
 <div class="rs-loop-node">Browser</div>
 </div>
 <p class="rs-caption">Browser -> Request -> Server <- Response -> Browser. Every webpage load.</p>`;
}

function renderTerms2() {
 return `
 <ul class="rs-term-list">
 <li><strong>Request</strong> - a message sent by the client, asking for something specific</li>
 <li><strong>Response</strong> - what the server sends back (data or why it couldn't)</li>
 <li><strong>Status code</strong> - short signal in every response: <code>200</code> = here's what you asked for, <code>404</code> = that doesn't exist</li>
 </ul>`;
}

function renderBusy3() {
 const tables = 6;
 const handled = labState.srvOrdersHandled || 0;
 const queue = labState.srvQueue || 0;
 const chefs = labState.srvSecondChef ? 2 : 1;
 return `
 <div class="rs-busy-scene">
 <div class="rs-busy-header">
 <span>6 tables, 1 kitchen</span>
 ${!labState.srvServiceStarted ? '<button type="button" class="btn primary" id="rs-start-service">Start Service</button>' : `<span class="rs-busy-stat">${handled}/${tables} served, queue: ${queue}</span>`}
 </div>
 <div class="rs-tables-grid">
 ${Array.from({ length: tables }, (_, i) => {
 const served = i < handled;
 return `<div class="rs-table rs-table--mini ${served ? "is-served" : ""}"><span>T${i + 1}</span>${served ? "OK" : labState.srvServiceStarted ? "..." : ""}</div>`;
 }).join("")}
 </div>
 ${renderKitchen({ visible: true, busy: queue > 0, chefs, queue })}
 ${labState.srvServiceStarted && !labState.srvSecondChef ? '<button type="button" class="btn secondary rs-chef-btn" id="rs-add-chef">+ Second chef (optional)</button>' : ""}
 </div>`;
}

function renderScale3() {
 return `
 <div class="rs-scale">
 <div class="rs-scale-hub">Server hub</div>
 <div class="rs-scale-rays"></div>
 </div>
 <p class="rs-caption">A popular website's server might do this thousands of times a second, all day.</p>`;
}

function renderTerms3() {
 return `
 <ul class="rs-term-list">
 <li><strong>Server</strong> - usually runs continuously on dedicated hardware, listening for many clients at once</li>
 <li><strong>Concurrent requests</strong> - multiple requests handled around the same time (queue, then serve in turn)</li>
 <li class="rs-term-note">Servers live on always-on hardware or cloud infrastructure - not a laptop that gets shut off at night.</li>
 </ul>`;
}

function renderDns4() {
 return `
 <div class="rs-dns-scene">
 <div class="rs-address-bar-wrap">
 <label>Find the restaurant:</label>
 <input type="text" class="rs-address-input" id="rs-domain-input" placeholder="PixelBistro.com" value="${labState.srvDomainEntered ? "PixelBistro.com" : ""}" ${labState.srvDnsDone ? "readonly" : ""} />
 ${!labState.srvDnsDone ? '<button type="button" class="btn primary" id="rs-dns-go">Go -></button>' : ""}
 </div>
 <div class="rs-dns-steps">
 <div class="rs-dns-step ${labState.srvDnsStep >= 1 ? "is-done" : ""}">1. Friendly name typed</div>
 <div class="rs-dns-step ${labState.srvDnsStep >= 2 ? "is-done" : ""}">2. DNS Directory Booth -> IP <code>192.0.2.42</code></div>
 <div class="rs-dns-step ${labState.srvDnsStep >= 3 ? "is-done" : ""}">3. Request reaches the right kitchen</div>
 </div>
 ${labState.srvDnsDone ? '<div class="rs-map-kitchen">Pixel Bistro kitchen found on map</div>' : '<div class="rs-map-fog">Restaurants everywhere...</div>'}
 </div>`;
}

function renderMontage4() {
 return `
 <div class="rs-montage">
 <div class="rs-montage-card"><span>Website address bar</span><small>name -> DNS -> server -> page</small></div>
 <div class="rs-montage-card"><span>App icon tap</span><small>same request -> response arc</small></div>
 <div class="rs-montage-card"><span>Smart speaker</span><small>ask -> cloud kitchen -> answer</small></div>
 </div>
 <p class="rs-caption">Website, app, smart speaker - same underlying pattern, every time.</p>`;
}

function renderTerms4() {
 return `
 <ul class="rs-term-list">
 <li><strong>Domain name</strong> - human-friendly address (e.g. pixelbistro.com)</li>
 <li><strong>IP address</strong> - real numeric address of the server</li>
 <li><strong>DNS</strong> - Domain Name System: the internet's directory booth</li>
 <li class="rs-term-note"><em>Next: once a request reaches the kitchen, where does it keep its ingredients - stored data?</em></li>
 </ul>`;
}

function renderClose(u) {
 const t = Math.min(1, u || 0);
 const steps = ["Click", "DNS lookup", "Request", "Server", "Response", "Page fills in"];
 const lit = Math.floor(t * steps.length);
 return `
 <div class="rs-close-scene" style="--rs-close:${t}">
 <div class="rs-browser">
 <div class="rs-page ${t > 0.8 ? "is-loaded" : "is-blank"}">
 ${t > 0.8 ? "<p>Content loaded - you see the whole trip now.</p>" : "..."}
 </div>
 </div>
 <div class="rs-close-steps">
 ${steps.map((s, i) => `<span class="rs-close-step ${i < lit ? "is-lit" : ""}">${s}</span>`).join("")}
 </div>
 </div>`;
}

function renderStage(mode) {
 switch (mode) {
 case "open": return renderOpen();
 case "kitchen1": return renderKitchen1();
 case "split1": return renderSplit1();
 case "terms1": return renderTerms1();
 case "order2": return renderOrder2();
 case "loop2": return renderLoop2();
 case "terms2": return renderTerms2();
 case "busy3": return renderBusy3();
 case "scale3": return renderScale3();
 case "terms3": return renderTerms3();
 case "dns4": return renderDns4();
 case "montage4": return renderMontage4();
 case "terms4": return renderTerms4();
 case "close": return renderClose(labState.srvCloseU);
 default: return renderOpen();
 }
}

function bindOpen(root, onChange) {
 track(root.querySelector("#rs-sim-click"), "click", () => {
 labState.srvLoadPhase = 1;
 syncRestaurant("open", { onChange });
 setTimeout(() => {
 labState.srvLoadPhase = 2;
 syncRestaurant("open", { onChange });
 onChange?.();
 }, 600);
 });
}

function bindKitchen1(root, onChange) {
 track(root.querySelector("#rs-call-btn"), "click", () => {
 if (labState.srvHallwayConnected && labState.srvKitchenPlaced) {
 labState.srvCallWorked = true;
 pulseSuccessFeedback(260);
 syncRestaurant("kitchen1", { onChange });
 onChange?.();
 } else {
 labState.srvCallTriedEmpty = true;
 pulseFailFeedback(280);
 syncRestaurant("kitchen1", { onChange });
 onChange?.();
 }
 });

 root.querySelectorAll("[data-drag]").forEach((chip) => {
 track(chip, "dragstart", (e) => {
 e.dataTransfer.setData("text/rest-drag", chip.dataset.drag);
 });
 });

 const kitchenSlot = root.querySelector("#rs-kitchen-slot");
 if (kitchenSlot) {
 track(kitchenSlot, "dragover", (e) => e.preventDefault());
 track(kitchenSlot, "drop", (e) => {
 e.preventDefault();
 if (e.dataTransfer.getData("text/rest-drag") === "kitchen") {
 labState.srvKitchenPlaced = true;
 pulseSuccessFeedback(200);
 syncRestaurant("kitchen1", { onChange });
 onChange?.();
 }
 });
 }

 const hallSlot = root.querySelector("#rs-hallway-slot");
 if (hallSlot) {
 track(hallSlot, "dragover", (e) => e.preventDefault());
 track(hallSlot, "drop", (e) => {
 e.preventDefault();
 if (e.dataTransfer.getData("text/rest-drag") === "hallway" && labState.srvKitchenPlaced) {
 labState.srvHallwayConnected = true;
 pulseSuccessFeedback(200);
 syncRestaurant("kitchen1", { onChange });
 onChange?.();
 }
 });
 }
}

function bindOrder2(root, onChange) {
 root.querySelectorAll("[data-order]").forEach((btn) => {
 track(btn, "click", () => {
 if (btn.dataset.order === "home" && !labState.srvOrderSuccess) {
 labState.srvTicketFlying = true;
 syncRestaurant("order2", { onChange });
 setTimeout(() => {
 labState.srvTicketFlying = false;
 labState.srvOrderSuccess = true;
 pulseSuccessFeedback(240);
 syncRestaurant("order2", { onChange });
 onChange?.();
 }, 900);
 } else if (btn.dataset.order === "secret" && !labState.srvOrder404) {
 labState.srvTicketFlying = true;
 syncRestaurant("order2", { onChange });
 setTimeout(() => {
 labState.srvTicketFlying = false;
 labState.srvOrder404 = true;
 pulseSuccessFeedback(180);
 syncRestaurant("order2", { onChange });
 onChange?.();
 }, 900);
 }
 });
 });
}

function startBusyShift(onChange) {
 if (busyTimer) clearInterval(busyTimer);
 labState.srvServiceStarted = true;
 labState.srvOrdersHandled = 0;
 labState.srvQueue = 0;
 let tick = 0;
 busyTimer = setInterval(() => {
 tick++;
 if (labState.srvQueue < 4 && tick % 2 === 0) labState.srvQueue++;
 if (labState.srvQueue > 0 && tick % (labState.srvSecondChef ? 1 : 2) === 0) {
 labState.srvQueue--;
 labState.srvOrdersHandled = Math.min(6, (labState.srvOrdersHandled || 0) + 1);
 pulseSuccessFeedback(100);
 }
 syncRestaurant("busy3", { onChange });
 onChange?.();
 if ((labState.srvOrdersHandled || 0) >= 6) {
 clearInterval(busyTimer);
 busyTimer = null;
 }
 }, 700);
}

function bindBusy3(root, onChange) {
 track(root.querySelector("#rs-start-service"), "click", () => startBusyShift(onChange));
 track(root.querySelector("#rs-add-chef"), "click", () => {
 labState.srvSecondChef = true;
 pulseSuccessFeedback(160);
 syncRestaurant("busy3", { onChange });
 onChange?.();
 });
}

function bindDns4(root, onChange) {
 const go = () => {
 const input = root.querySelector("#rs-domain-input");
 const val = (input?.value || "").trim().toLowerCase();
 if (!val.includes("pixelbistro")) {
 pulseFailFeedback(300);
 return;
 }
 labState.srvDomainEntered = true;
 labState.srvDnsStep = 1;
 syncRestaurant("dns4", { onChange });
 setTimeout(() => {
 labState.srvDnsStep = 2;
 syncRestaurant("dns4", { onChange });
 setTimeout(() => {
 labState.srvDnsStep = 3;
 labState.srvDnsDone = true;
 pulseSuccessFeedback(260);
 syncRestaurant("dns4", { onChange });
 onChange?.();
 }, 700);
 }, 700);
 };
 track(root.querySelector("#rs-dns-go"), "click", go);
 track(root.querySelector("#rs-domain-input"), "keydown", (e) => {
 if (e.key === "Enter") go();
 });
}

function bindInteractions(root, onChange) {
 clearLiveHandlers();
 const mode = labState.srvMode;
 if (mode === "open") bindOpen(root, onChange);
 if (mode === "kitchen1") bindKitchen1(root, onChange);
 if (mode === "order2") bindOrder2(root, onChange);
 if (mode === "busy3") bindBusy3(root, onChange);
 if (mode === "dns4") bindDns4(root, onChange);
}

const BANNERS = {
 open: "That blank flicker before a page loads - a round trip you barely notice.",
 kitchen1: "Same button - with or without a kitchen on the other end.",
 split1: "Client asks. Server has and provides.",
 terms1: "Browser = client. Kitchen = server. Hallway = network.",
 order2: "Place an order - ticket out, plate or error back.",
 loop2: "Request out, response back - every single time.",
 terms2: "200 = success. 404 = not found - still a complete response.",
 busy3: "Six tables, one kitchen - orders queue, none get lost.",
 scale3: "Thousands of requests per second on busy servers.",
 terms3: "Concurrent requests - core job of real servers.",
 dns4: "Friendly name -> DNS lookup -> real IP -> right kitchen.",
 montage4: "Website, app, speaker - same chain behind the scenes.",
 terms4: "Domain, IP, DNS - how clients find the right server.",
 close: "The restaurant was always there. Now you can see it.",
};

export function mountRestaurant(viewport, onChange) {
 if (!viewport) return () => {};
 unmountRestaurant(viewport);

 const root = document.createElement("div");
 root.id = ROOT_ID;
 root.className = "restaurant-root";
 root.innerHTML = `<p class="rs-banner" id="rs-banner"></p><div class="rs-stage" id="rs-stage"></div>`;
 viewport.appendChild(root);
 viewport.classList.add("viewport--restaurant");

 syncRestaurant(labState.srvMode || "open", { onChange });
 return () => unmountRestaurant(viewport);
}

export function syncRestaurant(mode, opts = {}) {
 labState.srvMode = mode || labState.srvMode || "open";
 const root = document.getElementById(ROOT_ID);
 if (!root) return;

 const renderKey = [
 labState.srvMode,
 labState.srvLoadPhase,
 labState.srvKitchenPlaced ? 1 : 0,
 labState.srvHallwayConnected ? 1 : 0,
 labState.srvCallTriedEmpty ? 1 : 0,
 labState.srvCallWorked ? 1 : 0,
 labState.srvOrderSuccess ? 1 : 0,
 labState.srvOrder404 ? 1 : 0,
 labState.srvTicketFlying ? 1 : 0,
 labState.srvServiceStarted ? 1 : 0,
 labState.srvOrdersHandled,
 labState.srvQueue,
 labState.srvSecondChef ? 1 : 0,
 labState.srvDnsStep,
 labState.srvDnsDone ? 1 : 0,
 Math.floor((labState.srvCloseU || 0) * 20),
 ].join("|");

 const stage = root.querySelector("#rs-stage");
 const banner = root.querySelector("#rs-banner");

 if (stage && renderKey !== lastRenderKey) {
 stage.innerHTML = renderStage(labState.srvMode);
 lastRenderKey = renderKey;
 bindInteractions(root, opts.onChange);
 if (labState.srvMode === "open" && !labState.srvOpenReady && (labState.srvLoadPhase || 0) >= 2) {
 clearTimeout(openTimer);
 openTimer = setTimeout(() => {
 labState.srvOpenReady = true;
 opts.onChange?.();
 }, 1200);
 }
 } else if (labState.srvMode === "close" && stage) {
 stage.style.setProperty("--rs-close", String(labState.srvCloseU || 0));
 }

 if (banner) banner.textContent = opts.banner || BANNERS[labState.srvMode] || "";
}

export function unmountRestaurant(viewport) {
 clearTimeout(openTimer);
 openTimer = null;
 if (busyTimer) clearInterval(busyTimer);
 busyTimer = null;
 lastRenderKey = "";
 clearLiveHandlers();
 document.getElementById(ROOT_ID)?.remove();
 viewport?.classList.remove("viewport--restaurant");
}
