/**
 * Waste Watch - sorting station DOM overlay (Bruner spirals).
 * Growing asset: landfill only → +recycle → +compost → full station.
 */
import { labState, pulseFailFeedback, pulseSuccessFeedback } from "./lab-state.js?v=waste1";

const ROOT_ID = "waste-root";
let lastRenderKey = "";
let liveHandlers = [];

function advanceGate() {
 window.__gqSignalGateReady?.({ forceAdvance: true });
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

function esc(s) {
 return String(s)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");
}

function setCanvasOverlayMode(viewport, on) {
 const canvas = viewport?.querySelector?.("#c3d") || document.getElementById("c3d");
 if (!canvas) return;
 if (on) {
  canvas.style.pointerEvents = "none";
  canvas.style.opacity = "0";
 } else {
  canvas.style.pointerEvents = "";
  canvas.style.opacity = "";
 }
}

const RECYCLE_ITEMS = [
 { id: "al_can", label: "🥫 Aluminum can", bin: "recycle" },
 { id: "glass", label: "🍾 Glass bottle", bin: "recycle" },
 { id: "cardboard", label: "📦 Clean cardboard", bin: "recycle" },
 { id: "plastic", label: "🧴 Plastic bottle", bin: "recycle" },
 { id: "pizza", label: "🍕 Greasy pizza box", bin: "landfill", reject: "Grease contaminates the recycling batch - landfill instead." },
 { id: "foam", label: "☕ Foam coffee cup", bin: "landfill", reject: "This type of foam usually isn't accepted by most recycling programs." },
];

const COMPOST_ITEMS = [
 { id: "banana", label: "🍌 Banana peel", bin: "compost" },
 { id: "coffee", label: "☕ Coffee grounds", bin: "compost" },
 { id: "eggshell", label: "🥚 Eggshells", bin: "compost" },
 { id: "leaves", label: "🍂 Dead leaves", bin: "compost" },
 { id: "pfork", label: "🍴 Plastic fork", bin: "landfill", reject: "This doesn't naturally break down - recycling or landfill, not compost." },
 { id: "spoon", label: "🥄 Metal spoon", bin: "recycle", reject: "This doesn't naturally break down - recycling or landfill, not compost." },
];

const FULL_ITEMS = [
 { id: "candy", label: "🍬 Candy wrapper", bin: "landfill" },
 { id: "soda", label: "🥤 Soda can", bin: "recycle" },
 { id: "apple", label: "🍎 Apple core", bin: "compost" },
 { id: "mug", label: "🏺 Broken ceramic mug", bin: "landfill" },
 { id: "news", label: "📰 Newspaper", bin: "recycle" },
 { id: "napkin", label: "🧻 Used napkin", bin: "compost" },
 { id: "jar", label: "🫙 Glass jar", bin: "recycle" },
 { id: "chips", label: "🥔 Chip bag", bin: "landfill" },
 { id: "peel", label: "🍌 Banana peel", bin: "compost" },
 { id: "toy", label: "🧸 Plastic toy", bin: "landfill" },
];

function binsHtml(opts = {}) {
 const { recycle = false, compost = false, highlight = "" } = opts;
 return `
 <div class="ww-bins">
  <div class="ww-bin ww-bin--landfill ${highlight === "landfill" ? "is-lit" : ""}" data-bin="landfill">
   <span class="ww-bin-icon">🗻</span>
   <strong>Landfill</strong>
  </div>
  ${
   recycle
    ? `<div class="ww-bin ww-bin--recycle ${highlight === "recycle" ? "is-lit" : ""}" data-bin="recycle">
   <span class="ww-bin-icon">♻️</span>
   <strong>Recycle</strong>
  </div>`
    : ""
  }
  ${
   compost
    ? `<div class="ww-bin ww-bin--compost ${highlight === "compost" ? "is-lit" : ""}" data-bin="compost">
   <span class="ww-bin-icon">🌱</span>
   <strong>Compost</strong>
  </div>`
    : ""
  }
 </div>`;
}

function renderOpen() {
 const ready = labState.wasteOpenReady;
 return `
 <div class="ww-open">
  <div class="ww-trash ${ready ? "is-open" : ""}">
   <div class="ww-bottle">🧃</div>
   <div class="ww-lid"></div>
  </div>
  <p class="ww-caption">${ready ? "The lid closed - but that wasn't the end of the story." : "A juice bottle drops into a plain trash can. Lid closes…"}</p>
  ${ready ? "" : `<button type="button" class="btn primary ww-pulse" id="ww-open-station">Open the Sorting Station →</button>`}
 </div>`;
}

function renderFollow1() {
 const step = labState.wasteFollowStep || 0;
 const phases = ["Trash can (transparent lid)", "Pipe → garbage truck", "Landfill mountain", "Years later - still there"];
 return `
 <div class="ww-follow">
  <div class="ww-journey ww-journey--step${step}">
   ${step === 0 ? `<div class="ww-can-see"><span class="ww-bottle">🧃</span><span class="ww-pipe">↓</span></div>` : ""}
   ${step === 1 ? `<div class="ww-truck">🚛 → 🧃</div>` : ""}
   ${step >= 2 ? `<div class="ww-landfill"><div class="ww-mound" style="--h:${0.4 + step * 0.15}"></div><span class="ww-dozer">🚜</span><span class="ww-bottle-tiny">🧃</span></div>` : ""}
  </div>
  <p class="ww-caption">${phases[Math.min(step, phases.length - 1)]}</p>
  ${
   step < 3
    ? `<button type="button" class="btn primary" id="ww-follow">${step === 0 ? "Follow It →" : "Continue journey →"}</button>`
    : `<p class="ww-note ww-note--ok">This is where "away" actually leads, by default: a landfill. A real place. Getting bigger every day.</p>
       ${labState.wasteTimelapseSeen ? `<p class="ww-note">Some plastics can take hundreds of years to break down.</p>` : `<button type="button" class="btn secondary" id="ww-timelapse">Watch it sit there (optional)</button>`}`
  }
 </div>`;
}

function renderMap1() {
 const trucks = labState.wasteMapTrucks || 0;
 return `
 <div class="ww-map">
  <p class="ww-banner">One road out of the house. One destination, unless something changes.</p>
  <div class="ww-map-row">
   <div class="ww-house">🏠</div>
   <div class="ww-road">Away →</div>
   <div class="ww-landfill-map">
    <div class="ww-mound" style="--h:${0.35 + trucks * 0.12}"></div>
    <span>Landfill</span>
   </div>
  </div>
  <button type="button" class="btn secondary" id="ww-map-truck">Send another truck 🚛</button>
  <p class="ww-caption">Trucks arrived: ${trucks} - mound still growing.</p>
 </div>`;
}

function renderTerms1() {
 return `
 <div class="ww-terms">
  <dl class="ww-def-list">
   <dt>Waste</dt>
   <dd>Any material discarded after its original use, no longer wanted by whoever had it.</dd>
   <dt>Landfill</dt>
   <dd>A large, managed site where waste is buried - the default destination for anything not diverted elsewhere.</dd>
  </dl>
 </div>`;
}

function renderRecycle2() {
 const placed = labState.wasteRecyclePlaced || {};
 const reject = labState.wasteRejectMsg || "";
 const done = labState.wasteRecycleDone;
 const remaining = RECYCLE_ITEMS.filter((i) => !placed[i.id]);
 return `
 <div class="ww-sort-scene">
  <p class="ww-banner">Sort into Recycle - not everything that looks recyclable actually is.</p>
  ${binsHtml({ recycle: true, highlight: "recycle" })}
  ${reject ? `<p class="ww-note ww-note--warn">${esc(reject)}</p>` : ""}
  ${
   !done
    ? `<div class="ww-tray">
   ${remaining.map((i) => `<button type="button" class="ww-item" draggable="true" data-item="${i.id}">${i.label}</button>`).join("")}
  </div>
  <p class="ww-hint">Tap an item, then tap the Recycle bin (or Landfill if rejected).</p>`
    : `<p class="ww-note ww-note--ok">Four got a second life. Two didn't - grease and foam type matter.</p>`
  }
  <p class="ww-score">Sorted correctly: ${Object.keys(placed).filter((k) => RECYCLE_ITEMS.find((i) => i.id === k)?.bin === (placed[k] === "recycle" ? "recycle" : placed[k])).length} / 6 placed</p>
 </div>`;
}

function renderLoop2() {
 const u = labState.wasteLoopPhase || 0;
 const steps = ["Can collected", "Melted to metal", "New can shaped", "Filled & sold", "Used again", "Back to recycle"];
 return `
 <div class="ww-loop">
  <p class="ww-banner">Not a road to a dead end. A loop that keeps going.</p>
  <div class="ww-loop-ring">
   ${steps.map((s, i) => `<div class="ww-loop-step ${i === u % steps.length ? "is-active" : ""}">${s}</div>`).join("")}
  </div>
  <p class="ww-caption">Aluminum can: melt → reshape → use → recycle again.</p>
 </div>`;
}

function renderTerms2() {
 return `
 <div class="ww-terms">
  <dl class="ww-def-list">
   <dt>Recycling</dt>
   <dd>Collecting and reprocessing materials (metal, glass, paper, some plastics) into new products instead of discarding them.</dd>
   <dt>Contamination</dt>
   <dd>Food, grease, or liquid residue on an otherwise recyclable item - can ruin an entire batch.</dd>
  </dl>
 </div>`;
}

function renderCompost3() {
 const placed = labState.wasteCompostPlaced || {};
 const reject = labState.wasteRejectMsg || "";
 const sortDone = labState.wasteCompostSorted;
 const ff = labState.wasteCompostFF || 0;
 return `
 <div class="ww-sort-scene">
  <p class="ww-banner">Only things that were once alive belong in Compost.</p>
  ${binsHtml({ recycle: true, compost: true, highlight: "compost" })}
  ${reject ? `<p class="ww-note ww-note--warn">${esc(reject)}</p>` : ""}
  ${
   !sortDone
    ? `<div class="ww-tray">
   ${COMPOST_ITEMS.filter((i) => !placed[i.id])
    .map((i) => `<button type="button" class="ww-item" draggable="true" data-item="${i.id}">${i.label}</button>`)
    .join("")}
  </div>
  <p class="ww-hint">Tap item, then tap Compost (or another bin if rejected).</p>`
    : ff < 1
      ? `<div class="ww-compost-pile">
     <p class="ww-note ww-note--ok">Bin filled with organic scraps.</p>
     <button type="button" class="btn primary" id="ww-fast-forward">Fast-Forward the Bin →</button>
    </div>`
      : `<div class="ww-compost-pile is-soil">
     <div class="ww-worms">🪱🦠</div>
     <p class="ww-note ww-note--ok">No factory. No machine. Just time, worms, and microbes - scraps → dark crumbly soil.</p>
    </div>`
  }
 </div>`;
}

function renderNature3() {
 return `
 <div class="ww-nature-loop">
  <p class="ww-banner">Food → compost → soil → new plants → food again.</p>
  <div class="ww-nature-steps">
   <span>🍌 scraps</span><span>→</span><span>🌱 compost</span><span>→</span>
   <span>🟫 soil</span><span>→</span><span>🌿 plant</span><span>→</span><span>🍎 food</span>
  </div>
  <p class="ww-caption">A natural loop on decomposition - parallel to the recycling factory loop.</p>
 </div>`;
}

function renderTerms3() {
 return `
 <div class="ww-terms">
  <dl class="ww-def-list">
   <dt>Compost</dt>
   <dd>Decomposed organic material (food scraps, plant matter) turned into nutrient-rich soil.</dd>
   <dt>Decomposition</dt>
   <dd>Natural biological breakdown by microbes, fungi, and organisms like worms.</dd>
   <dt>Organic waste</dt>
   <dd>Waste that was once part of a living thing - and can naturally decompose.</dd>
  </dl>
 </div>`;
}

function renderFull4() {
 const idx = labState.wasteFullIdx || 0;
 const score = labState.wasteFullScore || 0;
 const done = labState.wasteFullDone;
 const item = FULL_ITEMS[idx];
 const reject = labState.wasteRejectMsg || "";
 return `
 <div class="ww-sort-scene">
  <p class="ww-banner">Run the full sorting station - all three roads.</p>
  ${binsHtml({ recycle: true, compost: true })}
  ${
   !done && item
    ? `<div class="ww-current">
   <p class="ww-hint">Item ${idx + 1} / 10</p>
   <button type="button" class="ww-item ww-item--big" draggable="true" data-item="${item.id}">${item.label}</button>
   <p class="ww-hint">Tap the correct bin.</p>
  </div>`
    : `<p class="ww-note ww-note--ok">${score} / 10 correctly sorted. Every correct sort is one less item headed to landfill unnecessarily.</p>`
  }
  ${reject ? `<p class="ww-note ww-note--warn">${esc(reject)}</p>` : ""}
  <p class="ww-score">Score: ${score}${done ? " (final)" : ""}</p>
 </div>`;
}

function renderSplit4() {
 return `
 <div class="ww-split">
  <p class="ww-banner">Same waste produced. Wildly different outcomes - based entirely on sorting.</p>
  <div class="ww-split-row">
   <div class="ww-split-side">
    <strong>Poor sorting</strong>
    <div class="ww-mound ww-mound--tall"></div>
    <small>Landfill fills fast - recyclables &amp; organics buried</small>
   </div>
   <div class="ww-split-side">
    <strong>Good sorting</strong>
    <div class="ww-mound ww-mound--small"></div>
    <div class="ww-side-facilities">♻️ facility · 🌱 compost yard</div>
    <small>Useful material keeps circulating</small>
   </div>
  </div>
 </div>`;
}

function renderTerms4() {
 return `
 <div class="ww-terms ww-terms--summary">
  <ul class="ww-summary-list">
   <li><strong>Waste → Landfill</strong> (buried, default) · <strong>Recycling</strong> (mechanically reprocessed) · <strong>Composting</strong> (naturally decomposed)</li>
   <li><em>Bonus:</em> Reduce, Reuse, Recycle - the most powerful is <strong>Reduce</strong>: not creating the waste in the first place.</li>
   <li class="ww-term-note">Next: what does it take to reduce waste before it's ever created?</li>
  </ul>
 </div>`;
}

function renderClose() {
 const u = labState.wasteCloseU || 0;
 return `
 <div class="ww-close" style="--ww-close:${u}">
  <div class="ww-close-paths">
   <div class="ww-path ww-path--landfill">🗻 Landfill</div>
   <div class="ww-path ww-path--recycle is-chosen">♻️ Recycle loop 🧃→🥫</div>
   <div class="ww-path ww-path--compost">🌱 Compost</div>
  </div>
  <p class="ww-caption">That bottle had three real options - sorting decided which road it took.</p>
 </div>`;
}

function renderStage(mode) {
 switch (mode) {
  case "open":
   return renderOpen();
  case "follow1":
   return renderFollow1();
  case "map1":
   return renderMap1();
  case "terms1":
   return renderTerms1();
  case "recycle2":
   return renderRecycle2();
  case "loop2":
   return renderLoop2();
  case "terms2":
   return renderTerms2();
  case "compost3":
   return renderCompost3();
  case "nature3":
   return renderNature3();
  case "terms3":
   return renderTerms3();
  case "full4":
   return renderFull4();
  case "split4":
   return renderSplit4();
  case "terms4":
   return renderTerms4();
  case "close":
   return renderClose();
  default:
   return renderOpen();
 }
}

const BANNERS = {
 open: "Away is never actually a place.",
 follow1: "Follow the bottle - where does away go?",
 map1: "One default road: bin → landfill.",
 terms1: "Waste · Landfill",
 recycle2: "Give it new life - sort into recycling.",
 loop2: "A loop that keeps going.",
 terms2: "Recycling · Contamination",
 compost3: "Let nature recycle.",
 nature3: "The ancient natural loop.",
 terms3: "Compost · Decomposition · Organic waste",
 full4: "The sorting station - all three roads.",
 split4: "Community-scale sorting impact.",
 terms4: "Full vocabulary + the Three R's.",
 close: "The journey, chosen well.",
};

function tryPlaceRecycle(itemId, bin, onChange) {
 const item = RECYCLE_ITEMS.find((i) => i.id === itemId);
 if (!item) return;
 labState.wasteRejectMsg = "";
 labState.wasteSelected = null;
 if (bin === "recycle" && item.bin !== "recycle") {
  labState.wasteRejectMsg = item.reject || "Not accepted in recycling.";
  pulseFailFeedback(400);
  syncWaste("recycle2", { onChange });
  onChange?.();
  return;
 }
 if (bin !== item.bin) {
  labState.wasteRejectMsg =
   item.bin === "recycle" ? "That one can be recycled - try Recycle." : "This one belongs in Landfill.";
  pulseFailFeedback(280);
  syncWaste("recycle2", { onChange });
  onChange?.();
  return;
 }
 labState.wasteRecyclePlaced = { ...(labState.wasteRecyclePlaced || {}), [itemId]: bin };
 pulseSuccessFeedback(160);
 if (RECYCLE_ITEMS.every((i) => labState.wasteRecyclePlaced[i.id])) {
  labState.wasteRecycleDone = true;
  pulseSuccessFeedback(280);
  advanceGate();
 }
 syncWaste("recycle2", { onChange });
 onChange?.();
}

function tryPlaceCompost(itemId, bin, onChange) {
 const item = COMPOST_ITEMS.find((i) => i.id === itemId);
 if (!item) return;
 labState.wasteRejectMsg = "";
 labState.wasteSelected = null;
 if (bin === "compost" && item.bin !== "compost") {
  labState.wasteRejectMsg = item.reject || "Doesn't belong in compost.";
  pulseFailFeedback(400);
  syncWaste("compost3", { onChange });
  onChange?.();
  return;
 }
 if (bin !== item.bin) {
  labState.wasteRejectMsg =
   item.bin === "compost" ? "That one is organic - try Compost." : `Try the ${item.bin} bin.`;
  pulseFailFeedback(280);
  syncWaste("compost3", { onChange });
  onChange?.();
  return;
 }
 labState.wasteCompostPlaced = { ...(labState.wasteCompostPlaced || {}), [itemId]: bin };
 pulseSuccessFeedback(160);
 if (COMPOST_ITEMS.every((i) => labState.wasteCompostPlaced[i.id])) {
  labState.wasteCompostSorted = true;
 }
 syncWaste("compost3", { onChange });
 onChange?.();
}

function tryPlaceFull(bin, onChange) {
 const idx = labState.wasteFullIdx || 0;
 const item = FULL_ITEMS[idx];
 if (!item || labState.wasteFullDone) return;
 labState.wasteRejectMsg = "";
 if (bin === item.bin) {
  labState.wasteFullScore = (labState.wasteFullScore || 0) + 1;
  pulseSuccessFeedback(140);
 } else {
  pulseFailFeedback(280);
  labState.wasteRejectMsg = `Usually goes to ${item.bin}.`;
 }
 labState.wasteFullIdx = idx + 1;
 if (labState.wasteFullIdx >= FULL_ITEMS.length) {
  labState.wasteFullDone = true;
  pulseSuccessFeedback(280);
  advanceGate();
 }
 syncWaste("full4", { onChange });
 onChange?.();
}

function bindInteractions(root, onChange) {
 clearLiveHandlers();
 const mode = labState.wasteMode;

 if (mode === "open") {
  track(root.querySelector("#ww-open-station"), "click", () => {
   labState.wasteOpenReady = true;
   pulseSuccessFeedback(220);
   syncWaste("open", { onChange });
   onChange?.();
   advanceGate();
  });
 }

 if (mode === "follow1") {
  track(root.querySelector("#ww-follow"), "click", () => {
   labState.wasteFollowStep = Math.min(3, (labState.wasteFollowStep || 0) + 1);
   pulseSuccessFeedback(160);
   syncWaste("follow1", { onChange });
   onChange?.();
   if (labState.wasteFollowStep >= 3) advanceGate();
  });
  track(root.querySelector("#ww-timelapse"), "click", () => {
   labState.wasteTimelapseSeen = true;
   pulseSuccessFeedback(160);
   syncWaste("follow1", { onChange });
   onChange?.();
  });
 }

 if (mode === "map1") {
  track(root.querySelector("#ww-map-truck"), "click", () => {
   labState.wasteMapTrucks = Math.min(5, (labState.wasteMapTrucks || 0) + 1);
   pulseSuccessFeedback(100);
   syncWaste("map1", { onChange });
   onChange?.();
  });
 }

 if (mode === "recycle2") {
  root.querySelectorAll(".ww-item").forEach((el) => {
   track(el, "click", () => {
    labState.wasteSelected = el.dataset.item;
    labState.wasteRejectMsg = "";
    syncWaste("recycle2", { onChange });
    onChange?.();
   });
   track(el, "dragstart", (e) => e.dataTransfer?.setData("text/plain", el.dataset.item));
  });
  root.querySelectorAll("[data-bin]").forEach((binEl) => {
   track(binEl, "dragover", (e) => e.preventDefault());
   track(binEl, "drop", (e) => {
    e.preventDefault();
    const id = e.dataTransfer?.getData("text/plain") || labState.wasteSelected;
    if (id) tryPlaceRecycle(id, binEl.dataset.bin, onChange);
   });
   track(binEl, "click", () => {
    if (labState.wasteSelected) tryPlaceRecycle(labState.wasteSelected, binEl.dataset.bin, onChange);
   });
  });
 }

 if (mode === "compost3") {
  root.querySelectorAll(".ww-item").forEach((el) => {
   track(el, "click", () => {
    labState.wasteSelected = el.dataset.item;
    labState.wasteRejectMsg = "";
    syncWaste("compost3", { onChange });
    onChange?.();
   });
   track(el, "dragstart", (e) => e.dataTransfer?.setData("text/plain", el.dataset.item));
  });
  root.querySelectorAll("[data-bin]").forEach((binEl) => {
   track(binEl, "dragover", (e) => e.preventDefault());
   track(binEl, "drop", (e) => {
    e.preventDefault();
    const id = e.dataTransfer?.getData("text/plain") || labState.wasteSelected;
    if (id) tryPlaceCompost(id, binEl.dataset.bin, onChange);
   });
   track(binEl, "click", () => {
    if (labState.wasteSelected) tryPlaceCompost(labState.wasteSelected, binEl.dataset.bin, onChange);
   });
  });
  track(root.querySelector("#ww-fast-forward"), "click", () => {
   labState.wasteCompostFF = 1;
   labState.wasteCompostDone = true;
   pulseSuccessFeedback(280);
   syncWaste("compost3", { onChange });
   onChange?.();
   advanceGate();
  });
 }

 if (mode === "full4") {
  root.querySelectorAll("[data-bin]").forEach((binEl) => {
   track(binEl, "click", () => tryPlaceFull(binEl.dataset.bin, onChange));
   track(binEl, "dragover", (e) => e.preventDefault());
   track(binEl, "drop", (e) => {
    e.preventDefault();
    tryPlaceFull(binEl.dataset.bin, onChange);
   });
  });
 }
}

export function mountWaste(viewport, onChange) {
 if (!viewport) return () => {};
 unmountWaste(viewport);
 const root = document.createElement("div");
 root.id = ROOT_ID;
 root.className = "waste-root";
 root.innerHTML = `<p class="ww-banner" id="ww-banner"></p><div class="ww-stage" id="ww-stage"></div>`;
 viewport.appendChild(root);
 viewport.classList.add("viewport--waste");
 setCanvasOverlayMode(viewport, true);
 syncWaste(labState.wasteMode || "open", { onChange });
 return () => unmountWaste(viewport);
}

export function syncWaste(mode, opts = {}) {
 labState.wasteMode = mode || labState.wasteMode || "open";
 const root = document.getElementById(ROOT_ID);
 if (!root) return;

 const renderKey = [
  labState.wasteMode,
  labState.wasteOpenReady ? 1 : 0,
  labState.wasteFollowStep || 0,
  labState.wasteTimelapseSeen ? 1 : 0,
  labState.wasteMapTrucks || 0,
  JSON.stringify(labState.wasteRecyclePlaced || {}),
  labState.wasteRecycleDone ? 1 : 0,
  labState.wasteLoopPhase || 0,
  JSON.stringify(labState.wasteCompostPlaced || {}),
  labState.wasteCompostSorted ? 1 : 0,
  labState.wasteCompostFF || 0,
  labState.wasteFullIdx || 0,
  labState.wasteFullScore || 0,
  labState.wasteFullDone ? 1 : 0,
  labState.wasteSelected || "",
  labState.wasteRejectMsg || "",
  Math.floor((labState.wasteCloseU || 0) * 20),
 ].join("|");

 const stage = root.querySelector("#ww-stage");
 const banner = root.querySelector("#ww-banner");

 if (stage && renderKey !== lastRenderKey) {
  stage.innerHTML = renderStage(labState.wasteMode);
  lastRenderKey = renderKey;
  bindInteractions(root, opts.onChange);
  if (labState.wasteMode === "open" && !labState.wasteOpenReady) {
   setTimeout(() => {
    if (!labState.wasteOpenReady && labState.wasteMode === "open") {
     labState.wasteOpenReady = true;
     opts.onChange?.();
     syncWaste("open", opts);
    }
   }, 4500);
  }
 } else if (labState.wasteMode === "close" && stage) {
  stage.style.setProperty("--ww-close", String(labState.wasteCloseU || 0));
 }

 if (banner) banner.textContent = opts.banner || BANNERS[labState.wasteMode] || "";
}

export function unmountWaste(viewport) {
 lastRenderKey = "";
 clearLiveHandlers();
 document.getElementById(ROOT_ID)?.remove();
 viewport?.classList.remove("viewport--waste");
 setCanvasOverlayMode(viewport, false);
}
