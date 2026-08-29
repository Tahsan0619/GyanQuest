/**
 * Solar Family - orbital family portrait DOM overlay (Bruner spirals).
 */
import { labState, pulseFailFeedback, pulseSuccessFeedback } from "./lab-state.js?v=solar3";

const ROOT_ID = "solar-root";
let lastRenderKey = "";
let liveHandlers = [];
let orbitAnim = null;

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
 if (orbitAnim) {
  cancelAnimationFrame(orbitAnim);
  orbitAnim = null;
 }
}

function track(el, event, fn) {
 if (!el) return;
 el.addEventListener(event, fn);
 liveHandlers.push(() => el.removeEventListener(event, fn));
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

const PLANETS = [
 { id: "mercury", name: "Mercury", group: "rocky", fact: "Closest to the Sun, cratered. No real atmosphere - wild day/night temperature swings." },
 { id: "venus", name: "Venus", group: "rocky", fact: "Hottest planet - thick toxic atmosphere traps heat, hotter than Mercury." },
 { id: "earth", name: "Earth", group: "rocky", fact: "Only known planet with liquid surface water and life. Home." },
 { id: "mars", name: "Mars", group: "rocky", fact: "The Red Planet - iron-rich dust. Evidence it once had flowing water." },
 { id: "jupiter", name: "Jupiter", group: "gas", fact: "Largest by far. Great Red Spot could swallow Earth; dozens of moons." },
 { id: "saturn", name: "Saturn", group: "gas", fact: "Spectacular rings of ice and rock chunks." },
 { id: "uranus", name: "Uranus", group: "gas", fact: "Tilted almost on its side - rolls around the Sun from an ancient collision." },
 { id: "neptune", name: "Neptune", group: "gas", fact: "Farthest and windiest - storms faster than anything on Earth." },
];

function body(id, size = "") {
 const sz = size ? ` sf-body--${size}` : "";
 return `<span class="sf-body sf-body--${id}${sz}" aria-hidden="true"></span>`;
}

function workflow(steps, activeIdx) {
 return `<div class="sf-workflow" role="list">${steps
  .map((s, i) => `<span class="sf-wf-step ${i === activeIdx ? "is-on" : i < activeIdx ? "is-done" : ""}" role="listitem">${s}</span>`)
  .join("")}</div>`;
}

function animatedSystem() {
 return `
 <div class="sf-system" id="sf-system">
  ${body("sun", "lg")}
  ${PLANETS.map((p) => `<div class="sf-orbit-ring">${body(p.id)}</div>`).join("")}
 </div>`;
}

function renderOpen() {
 const ready = labState.solarOpenReady;
 return `
 <div class="sf-open">
  ${workflow(["Meet", "Orbit", "Sort", "Gallery", "Scale"], 0)}
  ${animatedSystem()}
  <p class="sf-caption" id="sf-open-caption">${ready ? "Eight siblings around one star - time to meet them properly." : "Watch the family spin - then meet them properly."}</p>
  ${ready ? "" : `<button type="button" class="btn primary sf-pulse" id="sf-meet">Meet the Family →</button>`}
 </div>`;
}

function renderOrbit1() {
 const speed = labState.solarOrbitSpeed ?? 50;
 const outcome = labState.solarOrbitOutcome || "";
 const seen = labState.solarOrbitSeen || {};
 return `
 <div class="sf-orbit-lab">
  ${workflow(["Gravity", "Sideways", "Balance", "Orbit"], outcome === "orbit" ? 3 : 1)}
  <p class="sf-banner">Find the balance - too slow, too fast, then just right.</p>
  <div class="sf-orbit-stage" id="sf-orbit-stage">
   ${body("sun", "sm")}
   <div class="sf-planet-sm" id="sf-planet" data-outcome="${outcome}"></div>
   <svg class="sf-orbit-path" viewBox="0 0 200 200"><circle cx="100" cy="100" r="70" fill="none" stroke="rgba(125,211,252,0.25)" stroke-width="1" stroke-dasharray="4 4"/></svg>
  </div>
  <label class="sf-slider-label">Sideways speed
   <input type="range" id="sf-speed" min="0" max="100" value="${speed}" />
  </label>
  <button type="button" class="btn primary" id="sf-release">Release planet →</button>
  ${outcome === "slow" ? `<p class="sf-note sf-note--warn">Too slow - gravity wins. Watch it fall in.</p>` : ""}
  ${outcome === "fast" ? `<p class="sf-note sf-note--warn">Too fast - it escapes. Watch it fly off.</p>` : ""}
  ${outcome === "orbit" ? `<p class="sf-note sf-note--ok">Just right - gravity pulls in, motion carries it around.</p>` : ""}
  <p class="sf-hint">Tried: ${seen.slow ? "slow ✓" : "slow"} · ${seen.fast ? "fast ✓" : "fast"} · ${seen.orbit ? "orbit ✓" : "orbit"}</p>
 </div>`;
}

function renderDiagram1() {
 return `
 <div class="sf-diagram">
  ${workflow(["Pull in", "Carry sideways", "Curved path"], 2)}
  <p class="sf-banner">Pulled in, moving sideways - the result is a circle.</p>
  <svg class="sf-force-svg" viewBox="0 0 240 140" aria-hidden="true">
   <circle cx="70" cy="70" r="22" fill="#f59e0b"/>
   <circle cx="160" cy="70" r="14" fill="#38bdf8"/>
   <path class="sf-g-pull" d="M148 70 H96" stroke="#f87171" stroke-width="3" fill="none" marker-end="url(#sfArr)"/>
   <path class="sf-g-side" d="M160 56 V28" stroke="#a3e635" stroke-width="3" fill="none"/>
   <path class="sf-g-path" d="M160 70 A55 55 0 1 1 120 30" stroke="#7dd3fc" stroke-width="2" fill="none"/>
   <text x="100" y="62" fill="#fca5a5" font-size="10">gravity</text>
   <text x="166" y="26" fill="#bef264" font-size="10">sideways</text>
   <text x="150" y="128" fill="#7dd3fc" font-size="10">orbit</text>
  </svg>
  <p class="sf-caption">All eight planets: permanent tug-of-war resolved into a loop.</p>
 </div>`;
}

function renderTerms1() {
 return `
 <div class="sf-terms">
  ${workflow(["System", "Gravity", "Orbit"], 2)}
  ${animatedSystem()}
  <dl class="sf-def-list">
   <dt>Solar system</dt>
   <dd>The Sun plus everything gravitationally bound to it and orbiting it.</dd>
   <dt>Gravity</dt>
   <dd>The pull that keeps planets from flying off into space.</dd>
   <dt>Orbit</dt>
   <dd>A closed path around a heavier body - the balance of pull and sideways motion.</dd>
  </dl>
 </div>`;
}

function renderSort2() {
 const placed = labState.solarSortPlaced || {};
 const done = labState.solarSortDone;
 const left = PLANETS.filter((p) => !placed[p.id]);
 return `
 <div class="sf-sort">
  ${workflow(["Pick", "Bin", "Family sorted"], done ? 2 : 0)}
  <p class="sf-banner">Sort the family: Rocky &amp; Small vs Huge &amp; Gassy.</p>
  <div class="sf-bins">
   <div class="sf-bin" data-bin="rocky"><strong>Rocky &amp; Small</strong><div class="sf-bin-slot">${PLANETS.filter((p) => placed[p.id] === "rocky").map((p) => `${body(p.id)} <span>${p.name}</span>`).join("")}</div></div>
   <div class="sf-bin" data-bin="gas"><strong>Huge &amp; Gassy</strong><div class="sf-bin-slot">${PLANETS.filter((p) => placed[p.id] === "gas").map((p) => `${body(p.id)} <span>${p.name}</span>`).join("")}</div></div>
  </div>
  ${labState.solarSortHint ? `<p class="sf-note sf-note--warn">${labState.solarSortHint}</p>` : ""}
  ${
   !done
    ? `<div class="sf-tray">${left.map((p) => `<button type="button" class="sf-chip ${labState.solarSelected === p.id ? "is-selected" : ""}" data-planet="${p.id}">${body(p.id)} ${p.name}</button>`).join("")}</div>
       <p class="sf-hint">Tap a planet, then tap a bin.</p>`
    : `<p class="sf-note sf-note--ok">Four small rocky siblings close in. Four enormous gassy siblings farther out.</p>`
  }
 </div>`;
}

function renderSize2() {
 return `
 <div class="sf-size">
  ${workflow(["Near rock", "Frost line", "Far giants"], 1)}
  <p class="sf-banner">Close to the Sun: small and rocky. Far out: enormous and gaseous.</p>
  <div class="sf-size-row">
   <div class="sf-size-group">
    ${body("sun", "sm")}
    ${PLANETS.filter((p) => p.group === "rocky").map((p) => body(p.id)).join("")}
   </div>
   <div class="sf-size-group sf-size-group--giants">
    ${PLANETS.filter((p) => p.group === "gas").map((p) => body(p.id)).join("")}
   </div>
  </div>
  <p class="sf-caption">Near the Sun: only rock/metal could stay solid. Past the frost line: ice and gas built giants.</p>
 </div>`;
}

function renderGallery3() {
 const seen = labState.solarGallerySeen || {};
 const count = Object.keys(seen).length;
 const card = labState.solarGalleryCard ? PLANETS.find((p) => p.id === labState.solarGalleryCard) : null;
 return `
 <div class="sf-gallery">
  ${workflow(["Tap worlds", "Collect facts", "Portrait"], count >= 8 ? 2 : 0)}
  <p class="sf-banner">Build the family portrait - click each planet (${count}/8).</p>
  <div class="sf-system sf-system--click">
   ${body("sun", "lg")}
   ${PLANETS.map((p) => `<button type="button" class="sf-chip ${seen[p.id] ? "is-placed" : ""}" data-planet="${p.id}" title="${p.name}">${body(p.id)}</button>`).join("")}
  </div>
  ${card ? `<div class="sf-portrait">${body(card.id)} <strong>${card.name}</strong><p>${card.fact}</p></div>` : `<p class="sf-hint">Tap each world in turn.</p>`}
  <div class="sf-gallery-strip">${PLANETS.filter((p) => seen[p.id]).map((p) => body(p.id)).join("")}</div>
 </div>`;
}

function renderOrder3() {
 return `
 <div class="sf-order">
  ${workflow(["Order from Sun", "Traits", "Lineup"], 2)}
  <p class="sf-banner">Mercury · Venus · Earth · Mars · Jupiter · Saturn · Uranus · Neptune</p>
  <div class="sf-order-row">
   ${PLANETS.map((p, i) => `<div class="sf-order-card" style="animation-delay:${i * 0.06}s">${body(p.id)}<small>${p.name}</small></div>`).join("")}
  </div>
  <p class="sf-caption">In order outward from the Sun - each with a signature trait.</p>
 </div>`;
}

function renderScale4() {
 const guessed = labState.solarScaleGuessed;
 const revealed = labState.solarScaleRevealed;
 const pos = labState.solarScalePos ?? 15;
 return `
 <div class="sf-scale">
  ${workflow(["Guess", "Lock", "Reveal empty space"], revealed ? 2 : guessed ? 1 : 0)}
  <p class="sf-banner">If the Sun were a basketball, how far away is Earth?</p>
  <div class="sf-scale-track" id="sf-scale-track">
   <div class="sf-scale-sun-end">${body("sun", "sm")}</div>
   <button type="button" class="sf-marble-btn" id="sf-marble" style="left:${pos}%" title="Earth">${body("earth")}</button>
   ${revealed ? `<span class="sf-mark sf-reveal-zoom" style="left:72%">~30 m</span>` : ""}
  </div>
  ${
   !guessed
    ? `<p class="sf-hint">Slide Earth where you think it belongs - then lock.</p>
       <label class="sf-slider-label">Distance guess
        <input type="range" id="sf-scale-range" min="5" max="95" value="${pos}" />
       </label>
       <button type="button" class="btn primary" id="sf-lock-guess">Lock my guess →</button>`
    : !revealed
      ? `<button type="button" class="btn primary" id="sf-reveal-scale">Reveal the real distance →</button>`
      : `<p class="sf-note sf-note--ok">At this scale: Earth ~30 meters from a basketball Sun. Neptune nearly a kilometer away. Mostly empty space.</p>`
  }
 </div>`;
}

function renderExplore4() {
 return `
 <div class="sf-explore">
  ${workflow(["Visit", "Orbit", "Leave system"], 1)}
  <p class="sf-banner">We've already sent craft to visit almost every sibling.</p>
  <div class="sf-montage">
   <div class="sf-montage-card">Mars rover path</div>
   <div class="sf-montage-card">Saturn ring flyby</div>
   <div class="sf-montage-card">Probe past Neptune</div>
  </div>
  <p class="sf-caption">Fly past, orbit, land - some crafts even leave the solar system.</p>
 </div>`;
}

function renderTerms2() {
 return `
 <div class="sf-terms">
  ${workflow(["Rocky", "Gas giants", "Ice giants"], 2)}
  <dl class="sf-def-list">
   <dt>Terrestrial planets</dt>
   <dd>Small, rocky, dense, close to the Sun: Mercury, Venus, Earth, Mars.</dd>
   <dt>Gas giants</dt>
   <dd>Enormous planets of mostly hydrogen and helium: Jupiter, Saturn.</dd>
   <dt>Ice giants</dt>
   <dd>Large, cold planets of icy compounds: Uranus, Neptune.</dd>
  </dl>
 </div>`;
}

function renderTerms3() {
 return `
 <div class="sf-terms">
  ${workflow(["Names", "Order", "Extended family"], 2)}
  <ol class="sf-planet-list">
   ${PLANETS.map((p) => `<li><strong>${p.name}</strong> - ${p.fact.split(".")[0]}.</li>`).join("")}
  </ol>
  <p class="sf-note">Extended family: asteroid belt between Mars and Jupiter; beyond Neptune, the Kuiper Belt.</p>
 </div>`;
}

function renderTerms4() {
 return `
 <div class="sf-terms sf-terms--summary">
  ${workflow(["Habitable zone", "Home", "Beyond"], 1)}
  <dl class="sf-def-list">
   <dt>Habitable zone</dt>
   <dd>Distance range from a star where liquid water could exist on a planet's surface.</dd>
  </dl>
  <p class="sf-note sf-note--ok">Earth sits in the Sun's habitable zone - not too hot, not too cold.</p>
  <p class="sf-term-note"><em>Next: our Sun is one star. What's beyond the edge of our own family?</em></p>
 </div>`;
}

function renderClose() {
 const u = labState.solarCloseU || 0;
 return `
 <div class="sf-close" style="--sf-close:${u}">
  ${animatedSystem()}
  <p class="sf-caption">The whole family, labeled and orbiting - welcome home.</p>
 </div>`;
}

function playOrbitVisual(outcome) {
 if (orbitAnim) {
  cancelAnimationFrame(orbitAnim);
  orbitAnim = null;
 }
 const planet = document.getElementById("sf-planet");
 if (!planet) return;
 planet.classList.remove("is-falling", "is-escaping", "is-orbiting");
 planet.style.transform = "translate(-50%,-50%)";
 if (outcome === "slow") {
  planet.classList.add("is-falling");
  return;
 }
 if (outcome === "fast") {
  planet.classList.add("is-escaping");
  return;
 }
 planet.classList.add("is-orbiting");
 const t0 = performance.now();
 const loop = (now) => {
  const t = (now - t0) / 1000;
  const a = t * 2.4;
  const r = 72;
  planet.style.transform = `translate(calc(-50% + ${Math.cos(a) * r}px), calc(-50% + ${Math.sin(a) * r}px))`;
  if (t < 4) orbitAnim = requestAnimationFrame(loop);
 };
 orbitAnim = requestAnimationFrame(loop);
}

function renderStage(mode) {
 switch (mode) {
  case "open":
   return renderOpen();
  case "orbit1":
   return renderOrbit1();
  case "diagram1":
   return renderDiagram1();
  case "terms1":
   return renderTerms1();
  case "sort2":
   return renderSort2();
  case "size2":
   return renderSize2();
  case "terms2":
   return renderTerms2();
  case "gallery3":
   return renderGallery3();
  case "order3":
   return renderOrder3();
  case "terms3":
   return renderTerms3();
  case "scale4":
   return renderScale4();
  case "explore4":
   return renderExplore4();
  case "terms4":
   return renderTerms4();
  case "close":
   return renderClose();
  default:
   return renderOpen();
 }
}

const BANNERS = {
 open: "Meet the Sun's eight children.",
 orbit1: "Gravity vs sideways motion - find the orbit.",
 diagram1: "Pulled in + moving sideways = circle.",
 terms1: "Solar system · Gravity · Orbit",
 sort2: "Rocky siblings vs gas giants.",
 size2: "Size jump past the frost line.",
 terms2: "Terrestrial · Gas giants · Ice giants",
 gallery3: "Meet each family member.",
 order3: "The family in order from the Sun.",
 terms3: "Formal lineup + extended family.",
 scale4: "How empty is the solar system?",
 explore4: "We've already visited the family.",
 terms4: "Habitable zone - Earth's special place.",
 close: "The whole family, together.",
};

function applyOrbitOutcome(speed, onChange) {
 let outcome = "orbit";
 if (speed < 35) outcome = "slow";
 else if (speed > 70) outcome = "fast";
 labState.solarOrbitOutcome = outcome;
 labState.solarOrbitSeen = { ...(labState.solarOrbitSeen || {}), [outcome]: true };
 if (outcome === "orbit") pulseSuccessFeedback(280);
 else pulseFailFeedback(320);
 const all = labState.solarOrbitSeen.slow && labState.solarOrbitSeen.fast && labState.solarOrbitSeen.orbit;
 if (all) {
  labState.solarOrbitDone = true;
  advanceGate();
 }
 syncSolar("orbit1", { onChange });
 onChange?.();
}

function trySort(planetId, bin, onChange) {
 const p = PLANETS.find((x) => x.id === planetId);
 if (!p) return;
 labState.solarSelected = null;
 labState.solarSortHint = "";
 if (p.group !== bin) {
  labState.solarSortHint =
   p.group === "gas"
    ? `${p.name} is one of the biggest - try Huge & Gassy.`
    : `${p.name} is small and rocky - try Rocky & Small.`;
  pulseFailFeedback(320);
  syncSolar("sort2", { onChange });
  onChange?.();
  return;
 }
 labState.solarSortPlaced = { ...(labState.solarSortPlaced || {}), [planetId]: bin };
 pulseSuccessFeedback(140);
 if (PLANETS.every((x) => labState.solarSortPlaced[x.id])) {
  labState.solarSortDone = true;
  pulseSuccessFeedback(280);
  advanceGate();
 }
 syncSolar("sort2", { onChange });
 onChange?.();
}

function bindInteractions(root, onChange) {
 clearLiveHandlers();
 const mode = labState.solarMode;

 if (mode === "open") {
  track(root.querySelector("#sf-meet"), "click", () => {
   labState.solarOpenReady = true;
   pulseSuccessFeedback(220);
   syncSolar("open", { onChange });
   onChange?.();
   advanceGate();
  });
 }

 if (mode === "orbit1") {
  const speedEl = root.querySelector("#sf-speed");
  track(speedEl, "input", () => {
   labState.solarOrbitSpeed = Number(speedEl.value);
  });
  track(root.querySelector("#sf-release"), "click", () => {
   const speed = Number(speedEl?.value ?? labState.solarOrbitSpeed ?? 50);
   labState.solarOrbitSpeed = speed;
   applyOrbitOutcome(speed, onChange);
   const outcome = labState.solarOrbitOutcome || "orbit";
   // let DOM remount first, then animate
   requestAnimationFrame(() => playOrbitVisual(outcome));
  });
 }

 if (mode === "sort2") {
  root.querySelectorAll("[data-planet]").forEach((el) => {
   track(el, "click", () => {
    labState.solarSelected = el.dataset.planet;
    labState.solarSortHint = "";
    syncSolar("sort2", { onChange });
    onChange?.();
   });
  });
  root.querySelectorAll("[data-bin]").forEach((binEl) => {
   track(binEl, "click", () => {
    if (labState.solarSelected) trySort(labState.solarSelected, binEl.dataset.bin, onChange);
   });
  });
 }

 if (mode === "gallery3") {
  root.querySelectorAll("[data-planet]").forEach((el) => {
   track(el, "click", () => {
    const id = el.dataset.planet;
    labState.solarGalleryCard = id;
    labState.solarGallerySeen = { ...(labState.solarGallerySeen || {}), [id]: true };
    pulseSuccessFeedback(160);
    if (Object.keys(labState.solarGallerySeen).length >= 8) {
     labState.solarGalleryDone = true;
     advanceGate();
    }
    syncSolar("gallery3", { onChange });
    onChange?.();
   });
  });
 }

 if (mode === "scale4") {
  const range = root.querySelector("#sf-scale-range");
  track(range, "input", () => {
   labState.solarScalePos = Number(range.value);
   const marble = root.querySelector("#sf-marble");
   if (marble) marble.style.left = `${labState.solarScalePos}%`;
  });
  track(root.querySelector("#sf-lock-guess"), "click", () => {
   labState.solarScaleGuessed = true;
   pulseSuccessFeedback(160);
   syncSolar("scale4", { onChange });
   onChange?.();
  });
  track(root.querySelector("#sf-reveal-scale"), "click", () => {
   labState.solarScaleRevealed = true;
   labState.solarScaleDone = true;
   pulseSuccessFeedback(280);
   syncSolar("scale4", { onChange });
   onChange?.();
   advanceGate();
  });
 }
}

export function mountSolar(viewport, onChange) {
 if (!viewport) return () => {};
 unmountSolar(viewport);
 const root = document.createElement("div");
 root.id = ROOT_ID;
 root.className = "solar-root";
 root.innerHTML = `<p class="sf-banner" id="sf-banner"></p><div class="sf-stage" id="sf-stage"></div>`;
 viewport.appendChild(root);
 viewport.classList.add("viewport--solar");
 setCanvasOverlayMode(viewport, true);
 syncSolar(labState.solarMode || "open", { onChange });
 return () => unmountSolar(viewport);
}

function patchCloseFade(stage) {
 const u = String(labState.solarCloseU || 0);
 stage.style.setProperty("--sf-close", u);
 stage.querySelector(".sf-close")?.style.setProperty("--sf-close", u);
}

export function syncSolar(mode, opts = {}) {
 labState.solarMode = mode || labState.solarMode || "open";
 const root = document.getElementById(ROOT_ID);
 if (!root) return;

 const stage = root.querySelector("#sf-stage");
 const banner = root.querySelector("#sf-banner");
 const hasSystem = !!stage?.querySelector("#sf-system");

 // Never wipe #sf-system for open/close state flips - remounting restarts CSS orbits.
 if (labState.solarMode === "open" && hasSystem) {
  const caption = stage.querySelector("#sf-open-caption");
  const meetBtn = stage.querySelector("#sf-meet");
  if (labState.solarOpenReady) {
   if (caption) caption.textContent = "Eight siblings around one star - time to meet them properly.";
   meetBtn?.remove();
  } else if (!meetBtn) {
   stage.querySelector(".sf-open")?.insertAdjacentHTML(
    "beforeend",
    `<button type="button" class="btn primary sf-pulse" id="sf-meet">Meet the Family →</button>`,
   );
   bindInteractions(root, opts.onChange);
  }
  lastRenderKey = `open|${labState.solarOpenReady ? 1 : 0}|soft`;
  if (banner) banner.textContent = opts.banner || BANNERS.open || "";
  return;
 }

 if (labState.solarMode === "close" && hasSystem && stage.querySelector(".sf-close")) {
  patchCloseFade(stage);
  lastRenderKey = "close|soft";
  if (banner) banner.textContent = opts.banner || BANNERS.close || "";
  return;
 }

 // closeU must NOT be in the key - the tick updates it every frame and was remounting orbits.
 const renderKey = [
  labState.solarMode,
  labState.solarOpenReady ? 1 : 0,
  labState.solarOrbitOutcome || "",
  JSON.stringify(labState.solarOrbitSeen || {}),
  labState.solarOrbitDone ? 1 : 0,
  JSON.stringify(labState.solarSortPlaced || {}),
  labState.solarSortDone ? 1 : 0,
  labState.solarSortHint || "",
  labState.solarSelected || "",
  JSON.stringify(labState.solarGallerySeen || {}),
  labState.solarGalleryCard || "",
  labState.solarGalleryDone ? 1 : 0,
  labState.solarScaleGuessed ? 1 : 0,
  labState.solarScaleRevealed ? 1 : 0,
  labState.solarScalePos ?? 15,
 ].join("|");

 if (stage && renderKey !== lastRenderKey) {
  stage.innerHTML = renderStage(labState.solarMode);
  lastRenderKey = renderKey;
  bindInteractions(root, opts.onChange);
  if (labState.solarMode === "close") patchCloseFade(stage);
 } else if (labState.solarMode === "close" && stage) {
  patchCloseFade(stage);
 }

 if (banner) banner.textContent = opts.banner || BANNERS[labState.solarMode] || "";
}

export function unmountSolar(viewport) {
 lastRenderKey = "";
 clearLiveHandlers();
 document.getElementById(ROOT_ID)?.remove();
 viewport?.classList.remove("viewport--solar");
 setCanvasOverlayMode(viewport, false);
}
