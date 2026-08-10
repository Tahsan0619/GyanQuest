/**
 * Interactive 2D concept overlays for curriculum games.
 * Used when 3D props alone cannot show a reaction / process clearly.
 * Gamified (CSS + interaction) - not a full 3D sim.
 */

const VIZ = {
 atoms: {
 title: "Atoms everywhere",
 hint: "Tap the cloud - matter is made of tiny bits.",
 html: `
 <div class="cviz cviz--atoms" data-cviz="atoms">
 <p class="cviz__title">Atoms everywhere</p>
 <p class="cviz__hint">Tap the cloud. Each spark is a tiny bit of matter.</p>
 <button type="button" class="cviz__stage" id="cviz-atoms-stage" aria-label="Atom cloud">
 <span class="cviz__particles" id="cviz-particles"></span>
 </button>
 <p class="cviz__readout" id="cviz-readout">Bits seen: 0</p>
 </div>`,
 bind(root) {
 const stage = root.querySelector("#cviz-atoms-stage");
 const cloud = root.querySelector("#cviz-particles");
 const readout = root.querySelector("#cviz-readout");
 let n = 0;
 for (let i = 0; i < 18; i++) {
 const s = document.createElement("span");
 s.className = "cviz__dot";
 s.style.setProperty("--x", `${10 + Math.random() * 80}%`);
 s.style.setProperty("--y", `${15 + Math.random() * 70}%`);
 s.style.setProperty("--d", `${0.8 + Math.random()}s`);
 cloud.appendChild(s);
 }
 stage?.addEventListener("click", () => {
 n += 3;
 readout.textContent = `Bits seen: ${n} - salt, ice, and steam are all made of atoms.`;
 cloud.querySelectorAll(".cviz__dot").forEach((d, i) => {
 d.classList.toggle("cviz__dot--flash", i % 3 === n % 3);
 });
 });
 },
 },

 elements: {
 title: "Element bottles",
 hint: "Tap each bottle - different elements, different jobs.",
 html: `
 <div class="cviz cviz--elements">
 <p class="cviz__title">Element hunt</p>
 <p class="cviz__hint">Tap a bottle. Each color stands for a different element.</p>
 <div class="cviz__row">
 <button type="button" class="cviz__flask cviz__flask--fe" data-el="Fe">Fe<span>Iron frame</span></button>
 <button type="button" class="cviz__flask cviz__flask--cu" data-el="Cu">Cu<span>Copper wire</span></button>
 <button type="button" class="cviz__flask cviz__flask--o" data-el="O">O<span>Air we breathe</span></button>
 </div>
 <p class="cviz__readout" id="cviz-readout">Pick a bottle…</p>
 </div>`,
 bind(root) {
 const facts = {
 Fe: "Iron (Fe) - strong metal in bike frames and CNG bodies.",
 Cu: "Copper (Cu) - wires carry current because electrons move easily.",
 O: "Oxygen (O) - in air; fuels fires and our breathing.",
 };
 const readout = root.querySelector("#cviz-readout");
 root.querySelectorAll("[data-el]").forEach((btn) => {
 btn.addEventListener("click", () => {
 root.querySelectorAll("[data-el]").forEach((b) => b.classList.remove("is-on"));
 btn.classList.add("is-on");
 readout.textContent = facts[btn.dataset.el] || "";
 });
 });
 },
 },

 bonds: {
 title: "Bond buddies",
 hint: "Drag the chips together - bonds hold atoms like magnets.",
 html: `
 <div class="cviz cviz--bonds">
 <p class="cviz__title">Make a bond</p>
 <p class="cviz__hint">Drag H onto O (or tap Join). Bonds stick atoms like magnets click.</p>
 <div class="cviz__bond-stage">
 <div class="cviz__atom cviz__atom--h" id="cviz-h" draggable="true">H</div>
 <div class="cviz__link" id="cviz-link" hidden>-</div>
 <div class="cviz__atom cviz__atom--o" id="cviz-o">O</div>
 </div>
 <button type="button" class="btn primary cviz__btn" id="cviz-join">Join atoms</button>
 <p class="cviz__readout" id="cviz-readout">Separate atoms…</p>
 </div>`,
 bind(root) {
 const link = root.querySelector("#cviz-link");
 const readout = root.querySelector("#cviz-readout");
 const join = () => {
 link.hidden = false;
 root.classList.add("cviz--bonded");
 readout.textContent = "Bonded! Like magnets clicking - or water holding droplets.";
 };
 root.querySelector("#cviz-join")?.addEventListener("click", join);
 const h = root.querySelector("#cviz-h");
 const o = root.querySelector("#cviz-o");
 h?.addEventListener("dragstart", (e) => e.dataTransfer.setData("text/plain", "H"));
 o?.addEventListener("dragover", (e) => e.preventDefault());
 o?.addEventListener("drop", (e) => {
 e.preventDefault();
 join();
 });
 },
 },

 mixtures: {
 title: "Mix & match",
 hint: "Toggle mix type - some mix, some layer.",
 html: `
 <div class="cviz cviz--mixtures">
 <p class="cviz__title">Mix or layer?</p>
 <p class="cviz__hint">Choose a mix. Watch the cup (3D) idea: oil bottle + cup.</p>
 <div class="cviz__row">
 <button type="button" class="btn secondary" data-mix="cha">Cha + milk</button>
 <button type="button" class="btn secondary" data-mix="oil">Oil + water</button>
 <button type="button" class="btn secondary" data-mix="sand">Sand + water</button>
 </div>
 <div class="cviz__beaker" id="cviz-beaker" data-mode="empty">
 <span class="cviz__layer cviz__layer--a"></span>
 <span class="cviz__layer cviz__layer--b"></span>
 <span class="cviz__swirl"></span>
 </div>
 <p class="cviz__readout" id="cviz-readout">Pick a mixture…</p>
 </div>`,
 bind(root) {
 const beaker = root.querySelector("#cviz-beaker");
 const readout = root.querySelector("#cviz-readout");
 const modes = {
 cha: ["mix", "Cha with milk mixes into one drink (solution-like)."],
 oil: ["layer", "Oil + water stay in layers - not a true mix."],
 sand: ["settle", "Sand in water settles - a suspension."],
 };
 root.querySelectorAll("[data-mix]").forEach((btn) => {
 btn.addEventListener("click", () => {
 const [mode, msg] = modes[btn.dataset.mix];
 beaker.dataset.mode = mode;
 readout.textContent = msg;
 });
 });
 },
 },

 reactions: {
 title: "Reaction time",
 hint: "Mix the reactants - watch bubbles & color change.",
 html: `
 <div class="cviz cviz--reactions">
 <p class="cviz__title">Start a reaction</p>
 <p class="cviz__hint">Tap Mix. Baking soda + lemon → fizz (gas!). Pan/bottle props show the lab idea.</p>
 <div class="cviz__react-pan" id="cviz-pan">
 <span class="cviz__liquid" id="cviz-liquid"></span>
 <span class="cviz__bubbles" id="cviz-bubbles"></span>
 </div>
 <div class="cviz__row">
 <button type="button" class="btn secondary" id="cviz-add-a">+ Baking soda</button>
 <button type="button" class="btn secondary" id="cviz-add-b">+ Lemon</button>
 <button type="button" class="btn primary" id="cviz-react">Mix!</button>
 </div>
 <p class="cviz__readout" id="cviz-readout">Add both reactants, then Mix.</p>
 </div>`,
 bind(root) {
 let a = false;
 let b = false;
 const liquid = root.querySelector("#cviz-liquid");
 const bubbles = root.querySelector("#cviz-bubbles");
 const readout = root.querySelector("#cviz-readout");
 const pan = root.querySelector("#cviz-pan");
 root.querySelector("#cviz-add-a")?.addEventListener("click", () => {
 a = true;
 liquid.classList.add("has-a");
 readout.textContent = a && b ? "Ready - tap Mix!" : "Baking soda in. Add lemon.";
 });
 root.querySelector("#cviz-add-b")?.addEventListener("click", () => {
 b = true;
 liquid.classList.add("has-b");
 readout.textContent = a && b ? "Ready - tap Mix!" : "Lemon in. Add baking soda.";
 });
 root.querySelector("#cviz-react")?.addEventListener("click", () => {
 if (!a || !b) {
 readout.textContent = "Need both reactants first.";
 return;
 }
 pan.classList.add("is-fizzing");
 bubbles.innerHTML = "";
 for (let i = 0; i < 14; i++) {
 const bub = document.createElement("i");
 bub.style.setProperty("--i", String(i));
 bubbles.appendChild(bub);
 }
 liquid.classList.add("reacted");
 readout.textContent = "Fizz! New gas formed - a chemical reaction changed the stuff.";
 });
 },
 },

 acids: {
 title: "Acid & base",
 hint: "Slide the pH - colors show sour vs slippery.",
 html: `
 <div class="cviz cviz--acids">
 <p class="cviz__title">Acid ↔ base</p>
 <p class="cviz__hint">Drag the slider. Red = acid (tamarind), blue = base (soap).</p>
 <input type="range" min="0" max="14" value="7" id="cviz-ph" class="cviz__slider" />
 <div class="cviz__ph-strip" id="cviz-strip"></div>
 <p class="cviz__readout" id="cviz-readout">pH 7 - neutral like pure water.</p>
 </div>`,
 bind(root) {
 const slider = root.querySelector("#cviz-ph");
 const strip = root.querySelector("#cviz-strip");
 const readout = root.querySelector("#cviz-readout");
 const paint = () => {
 const v = Number(slider.value);
 const hue = 0 + (v / 14) * 240;
 strip.style.background = `hsl(${hue} 80% 48%)`;
 let label = "neutral";
 if (v < 6) label = "acidic - sour like tamarind / lemon";
 else if (v > 8) label = "basic - slippery like soap";
 readout.textContent = `pH ${v} - ${label}`;
 };
 slider?.addEventListener("input", paint);
 paint();
 },
 },

 states: {
 title: "States of matter",
 hint: "Heat the sample - solid → liquid → gas.",
 html: `
 <div class="cviz cviz--states">
 <p class="cviz__title">Heat it up</p>
 <p class="cviz__hint">Slide heat. Apple = solid idea, cup = liquid, steam = gas.</p>
 <input type="range" min="0" max="2" step="1" value="0" id="cviz-heat" class="cviz__slider" />
 <div class="cviz__state-stage" id="cviz-state" data-state="0">
 <span class="cviz__ice"></span>
 <span class="cviz__water"></span>
 <span class="cviz__steam"></span>
 </div>
 <p class="cviz__readout" id="cviz-readout">Solid - particles packed tight (ice / apple).</p>
 </div>`,
 bind(root) {
 const heat = root.querySelector("#cviz-heat");
 const stage = root.querySelector("#cviz-state");
 const readout = root.querySelector("#cviz-readout");
 const msgs = [
 "Solid - particles packed tight (ice / apple).",
 "Liquid - particles slide (water in the cup).",
 "Gas - particles fly free (steam from a hot pan).",
 ];
 const paint = () => {
 const v = Number(heat.value);
 stage.dataset.state = String(v);
 readout.textContent = msgs[v];
 };
 heat?.addEventListener("input", paint);
 paint();
 },
 },

 periodic: {
 title: "Periodic path",
 hint: "Tap a group - metals, halogens, nobles.",
 html: `
 <div class="cviz cviz--periodic">
 <p class="cviz__title">Group the elements</p>
 <p class="cviz__hint">Tap a family. Boxes on the desk stand for grouped elements.</p>
 <div class="cviz__grid">
 <button type="button" data-g="metal">Metals</button>
 <button type="button" data-g="halo">Halogens</button>
 <button type="button" data-g="noble">Noble gases</button>
 </div>
 <p class="cviz__readout" id="cviz-readout">Pick a family…</p>
 </div>`,
 bind(root) {
 const facts = {
 metal: "Metals - shiny, conduct; iron frames & copper wire.",
 halo: "Halogens - reactive; bleach uses chlorine family chemistry.",
 noble: "Noble gases - stable; used in glowing bulbs.",
 };
 const readout = root.querySelector("#cviz-readout");
 root.querySelectorAll("[data-g]").forEach((btn) => {
 btn.addEventListener("click", () => {
 readout.textContent = facts[btn.dataset.g];
 });
 });
 },
 },

 safety: {
 title: "Lab safety",
 hint: "Tap the safe choices.",
 html: `
 <div class="cviz cviz--safety">
 <p class="cviz__title">Stay safe</p>
 <p class="cviz__hint">Tap each rule. Cone + desk props remind: caution first.</p>
 <div class="cviz__row cviz__row--wrap">
 <button type="button" class="cviz__chip" data-ok="1">Wear goggles</button>
 <button type="button" class="cviz__chip" data-ok="0">Taste chemicals</button>
 <button type="button" class="cviz__chip" data-ok="1">Wash hands</button>
 <button type="button" class="cviz__chip" data-ok="0">Smell closely</button>
 </div>
 <p class="cviz__readout" id="cviz-readout">Tap a choice…</p>
 </div>`,
 bind(root) {
 const readout = root.querySelector("#cviz-readout");
 root.querySelectorAll(".cviz__chip").forEach((btn) => {
 btn.addEventListener("click", () => {
 const ok = btn.dataset.ok === "1";
 btn.classList.toggle("is-good", ok);
 btn.classList.toggle("is-bad", !ok);
 readout.textContent = ok
 ? "Correct - safe labs use goggles and clean hands."
 : "Danger! Never taste or sniff chemicals up close.";
 });
 });
 },
 },

 synthesis: {
 title: "Chem boss kitchen",
 hint: "Combine props - cooking is chemistry.",
 html: `
 <div class="cviz cviz--synthesis">
 <p class="cviz__title">Cook a reaction</p>
 <p class="cviz__hint">Add oil bottle + pan heat + apple bits - cooking rearranges matter.</p>
 <div class="cviz__row">
 <button type="button" class="btn secondary" data-ing="oil">Oil bottle</button>
 <button type="button" class="btn secondary" data-ing="heat">Heat pan</button>
 <button type="button" class="btn secondary" data-ing="food">Apple / food</button>
 </div>
 <div class="cviz__cook" id="cviz-cook" data-step="0"></div>
 <p class="cviz__readout" id="cviz-readout">Add ingredients…</p>
 </div>`,
 bind(root) {
 const got = new Set();
 const cook = root.querySelector("#cviz-cook");
 const readout = root.querySelector("#cviz-readout");
 root.querySelectorAll("[data-ing]").forEach((btn) => {
 btn.addEventListener("click", () => {
 got.add(btn.dataset.ing);
 cook.dataset.step = String(got.size);
 if (got.size >= 3) {
 readout.textContent = "Done! Heat + ingredients → new smells & textures = chemistry.";
 cook.classList.add("is-done");
 } else {
 readout.textContent = `Added ${[...got].join(", ")}. Keep going (${got.size}/3).`;
 }
 });
 });
 },
 },

 // Generic subject helpers (non-chemistry packs)
 compare: {
 title: "Compare",
 hint: "Tap both sides.",
 html: `
 <div class="cviz cviz--compare">
 <p class="cviz__title">Compare the props</p>
 <p class="cviz__hint">Match what you see in 3D with the idea in the dock.</p>
 <div class="cviz__row">
 <button type="button" class="cviz__side" id="cviz-left">A</button>
 <button type="button" class="cviz__side" id="cviz-right">B</button>
 </div>
 <p class="cviz__readout" id="cviz-readout">Tap A and B - notice what differs.</p>
 </div>`,
 bind(root) {
 const readout = root.querySelector("#cviz-readout");
 let hits = 0;
 root.querySelectorAll(".cviz__side").forEach((btn) => {
 btn.addEventListener("click", () => {
 btn.classList.add("is-on");
 hits += 1;
 readout.textContent =
 hits >= 2 ? "Nice - use the dock text to name what changed." : "Now tap the other side.";
 });
 });
 },
 },

 nature: {
 title: "Living scene",
 hint: "Tap tree / plant ideas.",
 html: `
 <div class="cviz">
 <p class="cviz__title">Living systems</p>
 <p class="cviz__hint">Trees and plants in the 3D scene stand for living systems.</p>
 <p class="cviz__readout">Look left - match the dock example to a prop you can see.</p>
 </div>`,
 bind() {},
 },

 machines: {
 title: "Machine flow",
 hint: "Follow the conveyor idea.",
 html: `
 <div class="cviz">
 <p class="cviz__title">Systems & flow</p>
 <p class="cviz__hint">Factory props (conveyor, arm, boxes) show inputs → process → outputs.</p>
 <p class="cviz__readout">Trace left → right like a pipeline.</p>
 </div>`,
 bind() {},
 },
};

export function clearConceptViz(host) {
 if (!host) return;
 host.querySelectorAll("[data-cviz-root]").forEach((n) => n.remove());
}

export function mountConceptViz(host, vizKey) {
 if (!host) return null;
 clearConceptViz(host);
 const def = VIZ[vizKey];
 if (!def) return null;
 const wrap = document.createElement("div");
 wrap.dataset.cvizRoot = "1";
 wrap.className = "cviz-host";
 wrap.innerHTML = def.html;
 host.appendChild(wrap);
 try {
 def.bind?.(wrap);
 } catch (err) {
 console.warn("concept-viz bind failed", vizKey, err);
 }
 return wrap;
}

export function hasConceptViz(key) {
 return Boolean(VIZ[key]);
}

/**
 * Concept Constellation (Feature 5) - additive API.
 * Decision: concept-viz already serves chem overlay demos via mountConceptViz;
 * keep those intact and add constellation helpers here (Scenario B additive branch).
 */
export function pickRecallTerms(conceptLog, n = 3) {
 if (!Array.isArray(conceptLog) || !conceptLog.length) return [];
 const seen = new Set();
 const out = [];
 for (let i = conceptLog.length - 1; i >= 0; i--) {
 const e = conceptLog[i];
 const k = String(e.term || "").toLowerCase();
 if (!k || seen.has(k)) continue;
 seen.add(k);
 out.push(e);
 if (out.length >= n) break;
 }
 return out;
}

export function openConstellation(conceptLog = []) {
 document.getElementById("gq-constellation-root")?.remove();
 const root = document.createElement("div");
 root.id = "gq-constellation-root";
 root.className = "gq-constellation";
 const terms = pickRecallTerms(conceptLog, 40).reverse();
 const bySubject = {};
 for (const e of conceptLog || []) {
 const s = e.subject || "General";
 bySubject[s] = bySubject[s] || new Set();
 bySubject[s].add(e.term);
 }
 const shared = [];
 const subjects = Object.keys(bySubject);
 for (let i = 0; i < subjects.length; i++) {
 for (let j = i + 1; j < subjects.length; j++) {
 for (const t of bySubject[subjects[i]]) {
 if (bySubject[subjects[j]].has(t)) shared.push(t);
 }
 }
 }
 root.innerHTML = `
 <div class="gq-constellation__panel" role="dialog" aria-label="Concept constellation">
 <h3>Concept constellation</h3>
 <p>Terms you explored. Shared across subjects: ${
 shared.length ? shared.slice(0, 8).join(", ") : "none yet"
 }</p>
 <div class="gq-constellation__graph">
 ${
 terms.length
 ? terms
 .map((e) => `<span class="gq-constellation__node">${escapeCviz(e.term)}</span>`)
 .join("")
 : "<p>Explore book words to grow your map.</p>"
 }
 </div>
 <button type="button" class="btn primary" id="gq-constellation-close">Close</button>
 </div>`;
 document.body.appendChild(root);
 root.querySelector("#gq-constellation-close").onclick = () => root.remove();
 root.addEventListener("click", (e) => {
 if (e.target === root) root.remove();
 });
}

function escapeCviz(s) {
 return String(s ?? "")
 .replace(/&/g, "&amp;")
 .replace(/</g, "&lt;")
 .replace(/>/g, "&gt;")
 .replace(/"/g, "&quot;");
}
