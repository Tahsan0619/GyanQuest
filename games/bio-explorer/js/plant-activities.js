/**
 * Bio Explorer Mission 3: Plant Power panel mounts.
 */
import {
 chemLabState,
 pulseFailFeedback,
 pulseSuccessFeedback,
 PLANT_ORGANS,
 PLANT_KITCHEN_IN,
 PLANT_KITCHEN_OUT,
 PLANT_WATER_HOPS,
 PLANT_SUGAR_HOPS,
 PLANT_SEEDS,
} from "./bio-state.js?v=cellplant2";
import { playScene, once, trackCleanup, narrationHtml } from "./bio-activities.js?v=cellplant2";

export function mountPlantBuild(host, cfg) {
 const finish = once(() => cfg.onDone());
 let cancelled = false;
 let iv = null;
 let lastN = 0;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 });
 chemLabState.plantParts = {};
 chemLabState.plantPartPick = null;
 chemLabState.plantBuildDone = false;
 chemLabState.prompt = "";
 playScene("plantBuild");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 1: Enactive</div>
 <h3>Build a plant</h3>
 ${narrationHtml(
 "Assemble the basic body plan every flowering plant shares. You already had a rough idea what each part does. That rough idea is exactly where we're starting.",
 )}
 <p class="drag-hint">Tap a part, then its place on the silhouette. Wrong spots bounce back gently.</p>
 <div class="chip-bank" id="plant-build-bank"></div>
 <div class="btn-row">
 <button type="button" class="btn secondary" data-drop="roots">Soil</button>
 <button type="button" class="btn secondary" data-drop="stem">Upright</button>
 <button type="button" class="btn secondary" data-drop="leaves">Crown</button>
 <button type="button" class="btn secondary" data-drop="flower">Top</button>
 </div>
 <p id="plant-build-status" class="drag-hint" aria-live="polite">0 of 4 placed.</p>
 <button type="button" class="btn primary" id="plant-build-go" disabled>Continue ▶</button>
 </div>`;
 const bank = host.querySelector("#plant-build-bank");
 const status = host.querySelector("#plant-build-status");
 const go = host.querySelector("#plant-build-go");
 function renderBank() {
 bank.innerHTML = PLANT_ORGANS.filter((o) => !chemLabState.plantParts[o.id])
 .map((o) => `<button type="button" class="chip" data-part="${o.id}">${o.name}</button>`)
 .join("");
 bank.querySelectorAll("[data-part]").forEach((btn) => {
 btn.onclick = () => {
 chemLabState.plantPartPick = btn.dataset.part;
 chemLabState.prompt = "";
 const n = Object.keys(chemLabState.plantParts || {}).length;
 status.textContent = `${n} of 4 placed. Tap its spot on the silhouette.`;
 bank.querySelectorAll(".chip").forEach((el) => el.classList.toggle("chip--selected", el === btn));
 };
 });
 }
 function place(zone) {
 const id = chemLabState.plantPartPick;
 if (!id) {
 status.textContent = "Tap a part first.";
 return;
 }
 const item = PLANT_ORGANS.find((o) => o.id === id);
 if (item.drop !== zone) {
 pulseFailFeedback(240);
 chemLabState.prompt = "That part belongs somewhere else on the silhouette.";
 status.textContent = chemLabState.prompt;
 return;
 }
 chemLabState.prompt = item.snap;
 chemLabState.plantParts = { ...chemLabState.plantParts, [id]: true };
 chemLabState.plantPartPick = null;
 pulseSuccessFeedback(200);
 lastN = Object.keys(chemLabState.plantParts).length;
 if (PLANT_ORGANS.every((o) => chemLabState.plantParts[o.id])) chemLabState.plantBuildDone = true;
 status.textContent = chemLabState.plantBuildDone
 ? "You just built a complete plant using only the four parts almost anyone could name. Let's find out what each one is actually doing."
 : `${lastN} of 4. ${item.snap}`;
 if (chemLabState.plantBuildDone) go.disabled = false;
 renderBank();
 }
 host.querySelectorAll("[data-drop]").forEach((btn) => {
 btn.onclick = () => place(btn.dataset.drop);
 });
 renderBank();
 iv = setInterval(() => {
 if (cancelled) return;
 if (chemLabState.plantBuildDone) {
 go.disabled = false;
 return;
 }
 if (chemLabState.prompt) {
 status.textContent = chemLabState.prompt;
 }
 const n = Object.keys(chemLabState.plantParts || {}).length;
 if (n !== lastN) {
 lastN = n;
 renderBank();
 if (!chemLabState.prompt) status.textContent = `${n} of 4 placed.`;
 }
 }, 160);
 go.onclick = () => finish();
}

export function mountPlantOrgans(host, cfg) {
 const finish = once(() => cfg.onDone());
 let stage = "jobs";
 trackCleanup(() => {});
 chemLabState.phase = "jobs";
 playScene("plantOrgans", { phase: "jobs" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 1: Iconic</div>
 <h3 id="plant-org-title">Four parts, four jobs</h3>
 <div id="plant-org-body"></div>
 <button type="button" class="btn primary" id="plant-org-go">Lock the organ names ▶</button>
 </div>`;
 const title = host.querySelector("#plant-org-title");
 const body = host.querySelector("#plant-org-body");
 const go = host.querySelector("#plant-org-go");
 body.innerHTML = `${narrationHtml(
 "Four parts, four jobs: roots anchor and absorb, the stem supports and connects, leaves make food, and the flower makes the next generation. That's the whole plant in one sentence. Each of those one-liners is hiding a genuinely impressive process.",
 )}${PLANT_ORGANS.map((o) => `<p class="tiny-onscreen"><strong>${o.name}:</strong> ${o.job}.</p>`).join("")}`;
 go.onclick = () => {
 if (stage === "jobs") {
 stage = "card";
 chemLabState.phase = "card";
 playScene("plantOrgans", { phase: "card" });
 title.textContent = "Plant organs";
 body.innerHTML = `${narrationHtml(
 "Biologists call these four organs, just like your own heart or lungs. Each is a distinct structure built from many cells, cooperating to do one major job for the whole organism. We're going to explore all four, starting with the leaf.",
 )}${PLANT_ORGANS.map((o) => `<p class="tiny-onscreen"><strong>${o.name}</strong> - ${o.def}.</p>`).join("")}`;
 go.textContent = "Continue ▶";
 return;
 }
 finish();
 };
}

export function mountPlantKitchen(host, cfg) {
 const finish = once(() => cfg.onDone());
 let cancelled = false;
 let iv = null;
 let lastN = 0;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 });
 chemLabState.plantKitchen = {};
 chemLabState.plantKitchenPick = null;
 chemLabState.plantKitchenPhase = "in";
 chemLabState.plantKitchenDone = false;
 chemLabState.prompt = "";
 playScene("plantKitchen");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 2: Enactive</div>
 <h3>Stock the kitchen</h3>
 ${narrationHtml(
 "You are about to run the process happening in every green leaf on Earth: sunlight, water, and carbon dioxide go in, and sugar plus oxygen come out. Those green chloroplasts doing the work are the same structures you met inside a plant cell last lesson, multiplied by millions.",
 )}
 <p class="drag-hint" id="plant-kit-hint">Tap an ingredient, then its chute. All three inputs first.</p>
 <div class="chip-bank" id="plant-kit-bank"></div>
 <div class="btn-row" id="plant-kit-drops"></div>
 <p id="plant-kit-status" class="drag-hint" aria-live="polite">0 of 3 inputs placed.</p>
 <button type="button" class="btn primary" id="plant-kit-go" disabled>Continue ▶</button>
 </div>`;
 const bank = host.querySelector("#plant-kit-bank");
 const drops = host.querySelector("#plant-kit-drops");
 const status = host.querySelector("#plant-kit-status");
 const hint = host.querySelector("#plant-kit-hint");
 const go = host.querySelector("#plant-kit-go");
 function list() {
 return chemLabState.plantKitchenPhase === "out" ? PLANT_KITCHEN_OUT : PLANT_KITCHEN_IN;
 }
 function renderDrops() {
 const out = chemLabState.plantKitchenPhase === "out";
 drops.innerHTML = out
 ? `<button type="button" class="btn secondary" data-drop="stemOut">Stem pipe</button>
 <button type="button" class="btn secondary" data-drop="stomataOut">Pores out</button>`
 : `<button type="button" class="btn secondary" data-drop="chloro">Chloroplasts</button>
 <button type="button" class="btn secondary" data-drop="vein">From the stem</button>
 <button type="button" class="btn secondary" data-drop="stomata">Underside pores</button>`;
 drops.querySelectorAll("[data-drop]").forEach((btn) => {
 btn.onclick = () => place(btn.dataset.drop);
 });
 hint.textContent = out
 ? "Now drag sugar into the stem pipe, and oxygen back out through the pores."
 : "Tap an ingredient, then its chute. All three inputs first.";
 }
 function renderBank() {
 bank.innerHTML = list()
 .filter((p) => !chemLabState.plantKitchen[p.id])
 .map((p) => `<button type="button" class="chip" data-ing="${p.id}">${p.name}</button>`)
 .join("");
 bank.querySelectorAll("[data-ing]").forEach((btn) => {
 btn.onclick = () => {
 chemLabState.plantKitchenPick = btn.dataset.ing;
 chemLabState.prompt = "";
 const n = Object.keys(chemLabState.plantKitchen || {}).length;
 status.textContent =
 chemLabState.plantKitchenPhase === "out"
 ? `${Math.max(0, n - 3)} of 2 outputs. Tap the matching pipe.`
 : `${n} of 3 inputs. Tap the matching chute.`;
 bank.querySelectorAll(".chip").forEach((el) => el.classList.toggle("chip--selected", el === btn));
 };
 });
 }
 function place(zone) {
 const id = chemLabState.plantKitchenPick;
 if (!id) {
 status.textContent = "Tap an ingredient first.";
 return;
 }
 const item = list().find((p) => p.id === id);
 if (!item || item.drop !== zone) {
 pulseFailFeedback(260);
 chemLabState.prompt = "That ingredient belongs in a different chute.";
 status.textContent = chemLabState.prompt;
 return;
 }
 chemLabState.prompt = item.line;
 chemLabState.plantKitchen = { ...chemLabState.plantKitchen, [id]: true };
 chemLabState.plantKitchenPick = null;
 pulseSuccessFeedback(200);
 const ins = PLANT_KITCHEN_IN.every((p) => chemLabState.plantKitchen[p.id]);
 if (chemLabState.plantKitchenPhase !== "out" && ins) chemLabState.plantKitchenPhase = "out";
 if (ins && PLANT_KITCHEN_OUT.every((p) => chemLabState.plantKitchen[p.id])) chemLabState.plantKitchenDone = true;
 lastN = Object.keys(chemLabState.plantKitchen).length;
 status.textContent = chemLabState.plantKitchenDone
 ? "You just ran a complete round of photosynthesis: 3 ingredients in, 2 products out."
 : item.line;
 if (chemLabState.plantKitchenDone) go.disabled = false;
 renderBank();
 renderDrops();
 }
 renderDrops();
 renderBank();
 let lastPhase = "in";
 iv = setInterval(() => {
 if (cancelled) return;
 if (chemLabState.plantKitchenPhase !== lastPhase) {
 lastPhase = chemLabState.plantKitchenPhase;
 renderBank();
 renderDrops();
 }
 if (chemLabState.plantKitchenDone) {
 go.disabled = false;
 return;
 }
 if (chemLabState.prompt) {
 status.textContent = chemLabState.prompt;
 }
 const n = Object.keys(chemLabState.plantKitchen || {}).length;
 if (n !== lastN) {
 lastN = n;
 renderBank();
 if (!chemLabState.prompt) {
 status.textContent =
 chemLabState.plantKitchenPhase === "out" ? `${Math.max(0, n - 3)} of 2 outputs placed.` : `${n} of 3 inputs placed.`;
 }
 }
 }, 160);
 go.onclick = () => finish();
}

export function mountPlantPhoto(host, cfg) {
 const finish = once(() => cfg.onDone());
 let stage = "leaf";
 let iv = null;
 trackCleanup(() => {
 if (iv) clearInterval(iv);
 });
 chemLabState.phase = "leaf";
 chemLabState.plantPhotoSun = false;
 chemLabState.plantPhotoWater = false;
 chemLabState.plantPhotoCo2 = false;
 chemLabState.plantPhotoGlucoseSep = false;
 chemLabState.plantPhotoOxygenSep = false;
 chemLabState.prompt = "";
 playScene("plantPhoto", { phase: "leaf" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 2: Iconic</div>
 <h3 id="plant-ph-title">Leaf factory - run photosynthesis</h3>
 <div id="plant-ph-body"></div>
 <p id="plant-ph-status" class="drag-hint" aria-live="polite">Tap Sunlight, Water, and CO2 on the canvas.</p>
 <button type="button" class="btn primary" id="plant-ph-go" disabled>Build the equation ▶</button>
 </div>`;
 const title = host.querySelector("#plant-ph-title");
 const body = host.querySelector("#plant-ph-body");
 const status = host.querySelector("#plant-ph-status");
 const go = host.querySelector("#plant-ph-go");
 body.innerHTML = `${narrationHtml(
 "A real leaf is millions of chloroplast factories. Turn on sunlight so chloroplasts work, add water through the vein, and let carbon dioxide in through stomata. Then tap Glucose and Oxygen to separate the two products.",
 )}<p class="tiny-onscreen"><strong>On canvas:</strong> Sunlight · Water · CO₂ · then separate Glucose and Oxygen.</p>`;
 iv = setInterval(() => {
 if (stage !== "leaf") return;
 if (chemLabState.prompt) status.textContent = chemLabState.prompt;
 const ready =
 chemLabState.plantPhotoSun &&
 chemLabState.plantPhotoWater &&
 chemLabState.plantPhotoCo2 &&
 chemLabState.plantPhotoGlucoseSep &&
 chemLabState.plantPhotoOxygenSep;
 if (ready) {
 go.disabled = false;
 status.textContent = "Products separated. Build the equation next.";
 }
 }, 160);
 go.onclick = () => {
 if (stage === "leaf") {
 stage = "eq";
 chemLabState.phase = "eq";
 playScene("plantPhoto", { phase: "eq" });
 title.textContent = "Photosynthesis";
 body.innerHTML = `${narrationHtml(
 "This is photosynthesis. Chlorophyll inside chloroplasts captures light energy and feeds it into this reaction.",
 )}<p class="tiny-onscreen"><strong>Word equation:</strong> Carbon dioxide + Water + Light energy → Glucose + Oxygen</p>
 <p class="tiny-onscreen"><strong>Chemical equation:</strong> 6CO<sub>2</sub> + 6H<sub>2</sub>O + light → C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> + 6O<sub>2</sub></p>`;
 go.textContent = "Continue ▶";
 go.disabled = false;
 status.textContent = "";
 return;
 }
 finish();
 };
}

export function mountPlantTrace(host, cfg) {
 const finish = once(() => cfg.onDone());
 let cancelled = false;
 let iv = null;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 });
 chemLabState.plantTracePhase = "water";
 chemLabState.plantWaterStep = 0;
 chemLabState.plantSugarStep = 0;
 chemLabState.plantTraceDone = false;
 chemLabState.prompt = "";
 playScene("plantTrace");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 3: Enactive</div>
 <h3>Trace the routes</h3>
 ${narrationHtml(
 "These two journeys run in completely opposite directions, through two completely separate sets of tubes. One carries water and minerals up from the roots. The other carries the sugar you just helped make back down to every part that needs energy, including the roots, which can't photosynthesize in the dark soil.",
 )}
 <p class="drag-hint" id="plant-tr-hint">Water first: root hair → up the stem → leaf.</p>
 <div class="chip-bank" id="plant-tr-bank"></div>
 <p id="plant-tr-status" class="drag-hint" aria-live="polite">Water's journey. Start at a root hair.</p>
 <button type="button" class="btn primary" id="plant-tr-go" disabled>Continue ▶</button>
 </div>`;
 const bank = host.querySelector("#plant-tr-bank");
 const status = host.querySelector("#plant-tr-status");
 const hint = host.querySelector("#plant-tr-hint");
 const go = host.querySelector("#plant-tr-go");
 function hops() {
 return chemLabState.plantTracePhase === "sugar" ? PLANT_SUGAR_HOPS : PLANT_WATER_HOPS;
 }
 function renderBank() {
 const sugar = chemLabState.plantTracePhase === "sugar";
 hint.textContent = sugar
 ? "Sugar: leaf → down the stem → everywhere else."
 : "Water first: root hair → up the stem → leaf.";
 bank.innerHTML = hops()
 .map((h) => `<button type="button" class="chip" data-hop="${h.id}">${h.label}</button>`)
 .join("");
 bank.querySelectorAll("[data-hop]").forEach((btn) => {
 btn.onclick = () => send(btn.dataset.hop);
 });
 }
 function send(toId) {
 const water = chemLabState.plantTracePhase !== "sugar";
 const list = hops();
 const stepI = water ? chemLabState.plantWaterStep || 0 : chemLabState.plantSugarStep || 0;
 const step = list[stepI];
 if (!step || chemLabState.plantTraceDone) return;
 if (toId !== step.id) {
 pulseFailFeedback(240);
 chemLabState.prompt = "That stop isn't next on this route.";
 status.textContent = chemLabState.prompt;
 return;
 }
 if (water) chemLabState.plantWaterStep = stepI + 1;
 else chemLabState.plantSugarStep = stepI + 1;
 pulseSuccessFeedback(200);
 chemLabState.prompt = step.caption;
 status.textContent = step.caption;
 if (water && chemLabState.plantWaterStep >= list.length) {
 chemLabState.plantTracePhase = "sugar";
 renderBank();
 }
 if (!water && chemLabState.plantSugarStep >= list.length) {
 chemLabState.plantTraceDone = true;
 go.disabled = false;
 status.textContent = "Water: roots → up the stem → leaves. Sugar: leaves → down the stem → everywhere else.";
 }
 }
 renderBank();
 let lastTrace = "water";
 iv = setInterval(() => {
 if (cancelled) return;
 if (chemLabState.plantTracePhase !== lastTrace) {
 lastTrace = chemLabState.plantTracePhase;
 renderBank();
 }
 if (chemLabState.plantTraceDone) go.disabled = false;
 }, 160);
 go.onclick = () => finish();
}

export function mountPlantHighways(host, cfg) {
 const finish = once(() => cfg.onDone());
 let stage = "lanes";
 trackCleanup(() => {});
 chemLabState.phase = "lanes";
 playScene("plantHighways", { phase: "lanes" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 3: Iconic</div>
 <h3 id="plant-hw-title">Two one-way highways</h3>
 <div id="plant-hw-body"></div>
 <button type="button" class="btn primary" id="plant-hw-go">Name the tissues ▶</button>
 </div>`;
 const title = host.querySelector("#plant-hw-title");
 const body = host.querySelector("#plant-hw-body");
 const go = host.querySelector("#plant-hw-go");
 body.innerHTML = `${narrationHtml(
 "Picture two one-way highways built right next to each other, running the entire height of the plant. One only ever carrying water upward. The other only ever carrying sugar around to wherever it's needed. This is happening continuously, in every stem, all the time, with zero moving parts and no pump at all.",
 )}<p class="tiny-onscreen">Two separate one-way highways, running the full height of the plant, side by side, constantly.</p>`;
 go.onclick = () => {
 if (stage === "lanes") {
 stage = "names";
 chemLabState.phase = "names";
 playScene("plantHighways", { phase: "names" });
 title.textContent = "Xylem, phloem, transpiration";
 body.innerHTML = `${narrationHtml(
 "These two transport tissues have real names: xylem carries water up, phloem carries sugar around. And that pump-free trick for getting water all the way to the top of a tall tree has a name too: transpiration. Water constantly evaporating out through the leaves, pulling a steady thread of more water up behind it, all the way from the roots.",
 )}<p class="tiny-onscreen"><strong>Xylem</strong> - tube-like tissue that transports water and minerals upward, from roots to leaves.</p>
 <p class="tiny-onscreen"><strong>Phloem</strong> - tube-like tissue that transports sugar (food) throughout the plant, in any direction it's needed.</p>
 <p class="tiny-onscreen"><strong>Root hairs</strong> - tiny extensions on roots that massively increase the surface area available for absorbing water.</p>
 <p class="tiny-onscreen">Water rises with no pump partly because it constantly evaporates out through the leaves' stomata, pulling more water up behind it: transpiration.</p>`;
 go.textContent = "Continue ▶";
 return;
 }
 finish();
 };
}

export function mountPlantBloom(host, cfg) {
 const finish = once(() => cfg.onDone());
 let cancelled = false;
 let iv = null;
 let seedUi = false;
 trackCleanup(() => {
 cancelled = true;
 if (iv) clearInterval(iv);
 });
 chemLabState.plantBee = "idle";
 chemLabState.plantBloomPhase = "pollinate";
 chemLabState.plantSeedI = 0;
 chemLabState.plantSeedOk = {};
 chemLabState.plantBloomDone = false;
 chemLabState.prompt = "";
 playScene("plantBloom");
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 4: Enactive</div>
 <h3 id="plant-bl-title">Pollinate the flower</h3>
 ${narrationHtml(
 "You are walking a plant through its entire reproductive story: pollen moving from one flower to another is pollination, that pollen fertilizing the ovary produces a seed, and that seed then needs a way to travel so the next plant doesn't have to grow in direct competition with its parent.",
 )}
 <p class="drag-hint" id="plant-bl-hint">Send the bee to the stamen, then to the other flower's pistil.</p>
 <div class="btn-row" id="plant-bl-row"></div>
 <p id="plant-bl-status" class="drag-hint" aria-live="polite">Bee waiting.</p>
 <button type="button" class="btn primary" id="plant-bl-go" disabled>Continue ▶</button>
 </div>`;
 const title = host.querySelector("#plant-bl-title");
 const hint = host.querySelector("#plant-bl-hint");
 const row = host.querySelector("#plant-bl-row");
 const status = host.querySelector("#plant-bl-status");
 const go = host.querySelector("#plant-bl-go");
 function renderPollinate() {
 row.innerHTML = `<button type="button" class="btn secondary" data-spot="stamen">Stamen (pollen)</button>
 <button type="button" class="btn secondary" data-spot="pistil">Pistil (sticky tip)</button>`;
 row.querySelectorAll("[data-spot]").forEach((btn) => {
 btn.onclick = () => tapSpot(btn.dataset.spot);
 });
 }
 function renderSeed() {
 const seed = PLANT_SEEDS[chemLabState.plantSeedI] || PLANT_SEEDS[PLANT_SEEDS.length - 1];
 title.textContent = "Send the seed on its way";
 hint.textContent = `Match this ${seed.name.toLowerCase()} (${seed.hint}) to wind, animal, or water.`;
 row.innerHTML = `<button type="button" class="btn secondary" data-method="wind">Wind</button>
 <button type="button" class="btn secondary" data-method="animal">Animal</button>
 <button type="button" class="btn secondary" data-method="water">Water</button>`;
 row.querySelectorAll("[data-method]").forEach((btn) => {
 btn.onclick = () => dropSeed(btn.dataset.method);
 });
 }
 function tapSpot(target) {
 if (chemLabState.plantBloomPhase !== "pollinate") return;
 if (target === "stamen" && chemLabState.plantBee === "idle") {
 chemLabState.plantBee = "pollen";
 chemLabState.prompt = "The bee picked up glowing pollen grains.";
 status.textContent = chemLabState.prompt;
 pulseSuccessFeedback(200);
 return;
 }
 if (target === "pistil" && chemLabState.plantBee === "pollen") {
 chemLabState.plantBee = "pollinated";
 chemLabState.prompt =
 "Pollen moved from one flower's stamen to another flower's pistil. That's pollination.";
 status.textContent = chemLabState.prompt;
 pulseSuccessFeedback(280);
 return;
 }
 pulseFailFeedback(240);
 chemLabState.prompt = "Not yet. Pollen first, then the sticky landing pad.";
 status.textContent = chemLabState.prompt;
 }
 function dropSeed(method) {
 if (chemLabState.plantBloomPhase !== "seed" || chemLabState.plantBloomDone) return;
 const seed = PLANT_SEEDS[chemLabState.plantSeedI || 0];
 if (!seed) return;
 if (method !== seed.method) {
 pulseFailFeedback(240);
 chemLabState.prompt = "That travel method doesn't match this seed.";
 status.textContent = chemLabState.prompt;
 return;
 }
 chemLabState.plantSeedOk = { ...chemLabState.plantSeedOk, [seed.id]: true };
 chemLabState.plantSeedI = (chemLabState.plantSeedI || 0) + 1;
 pulseSuccessFeedback(220);
 chemLabState.prompt = `${seed.name} travels by ${seed.method}.`;
 if (chemLabState.plantSeedI >= PLANT_SEEDS.length) {
 chemLabState.plantBloomDone = true;
 go.disabled = false;
 status.textContent =
 "You walked a plant through pollination, a seed, and three ways that seed can travel.";
 } else {
 status.textContent = chemLabState.prompt;
 renderSeed();
 }
 }
 renderPollinate();
 iv = setInterval(() => {
 if (cancelled) return;
 if (chemLabState.plantBee === "pollinated" && chemLabState.plantBloomPhase === "pollinate" && !seedUi) {
 seedUi = true;
 window.setTimeout(() => {
 if (cancelled) return;
 chemLabState.plantBloomPhase = "seed";
 status.textContent = "Petals wilt. A seed forms. Now send it on its way.";
 renderSeed();
 }, 1600);
 }
 if (chemLabState.plantBloomDone) go.disabled = false;
 }, 160);
 go.onclick = () => finish();
}

export function mountPlantCycle(host, cfg) {
 const finish = once(() => cfg.onDone());
 let stage = "cycle";
 trackCleanup(() => {});
 chemLabState.phase = "cycle";
 playScene("plantCycle", { phase: "cycle" });
 host.innerHTML = `
 <div class="chem-card tiny-card">
 <div class="lab-demo__badge">Spiral 4: Iconic</div>
 <h3 id="plant-cy-title">One continuous cycle</h3>
 <div id="plant-cy-body"></div>
 <button type="button" class="btn primary" id="plant-cy-go">Name the last three words ▶</button>
 </div>`;
 const title = host.querySelector("#plant-cy-title");
 const body = host.querySelector("#plant-cy-body");
 const go = host.querySelector("#plant-cy-go");
 body.innerHTML = `${narrationHtml(
 "Zoom out far enough, and every single thing you learned today, the roots absorbing water, the leaves making food, the stem transporting it all, the flower reproducing, turns out to be one continuous loop, not four separate topics. Each organ exists to keep this exact cycle running.",
 )}<p class="tiny-onscreen">Every part of the plant you met today, roots, stem, leaves, flower, plays a role somewhere in this one continuous cycle.</p>`;
 go.onclick = () => {
 if (stage === "cycle") {
 stage = "card";
 chemLabState.phase = "card";
 playScene("plantCycle", { phase: "card" });
 title.textContent = "Pollination, fertilization, dispersal";
 body.innerHTML = `${narrationHtml(
 "One last thing worth sitting with: photosynthesis doesn't just feed the plant doing it. It's the source of the oxygen you're breathing this very second, and the base of almost every food chain on the planet. That windowsill plant from the start of this lesson isn't just quietly surviving. It's quietly running one of the most important processes on Earth.",
 )}<p class="tiny-onscreen"><strong>Pollination</strong> - transfer of pollen from a stamen to a pistil.</p>
 <p class="tiny-onscreen"><strong>Fertilization</strong> - pollen combining with an egg cell to form a seed.</p>
 <p class="tiny-onscreen"><strong>Seed dispersal</strong> - a seed traveling away from the parent plant (by wind, animal, or water).</p>
 <p class="tiny-onscreen">Every oxygen molecule you just breathed, and most of the food on Earth, traces back to this exact process, happening in plants, everywhere, right now.</p>`;
 go.textContent = "Continue ▶";
 return;
 }
 finish();
 };
}
