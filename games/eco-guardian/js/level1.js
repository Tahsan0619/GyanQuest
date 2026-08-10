/**
 * Eco Guardian - Mission 1: Waste Watch
 * 10 sub-levels, Bruner spiral: enactive -> iconic -> symbolic.
 * Target: 45-60 minutes. Topic-specific: bins, 3Rs, BD places - not chemistry zoom.
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
 mountMotionChain,
 mountDragSort,
 mountHeatLab,
 mountEquationBuild,
 mountQuiz,
 mountSpeedDrill,
 mountMythCards,
 mountTapContinue,
 mountOrderSteps,
 mountRevealSteps,
 mountScaleLab,
 mountMultiQuiz,
 playScene,
 badgeHtml,
} from "./lab-activities.js";

export const L1_META = {
 objective: "By the end of this mission, you'll be able to explain reduce / reuse / recycle in your own words.",
 bdHook:
 "Bangladesh everyday: kitchen peels, school paper, market plastic bags - notice which bin (or 3R choice) fits each one.",
 predict: {
 q: "Before we start - what mainly keeps Waste Watch working?",
 options: [
 "Dumping everything in one bag and hoping",
 "Reduce first, then reuse, then recycle - and put each item in the right bin",
 "Only recycling bottles forever",
 ],
 ok: 1,
 },

 kidTitle: "Waste Watch",
 theme: "reduce / reuse / recycle",
 emoji: "♻️",
 rewardName: "Waste Watcher",
 intro:
 "Litter has a right home. We start with kitchen peels, school paper, and market bags - then name a clear 3R rule you can reuse anywhere.",
 everyday: ["Kitchen peels", "School paper", "Market plastic bags"],
 subTitles: [
 "Meet the Bins",
 "Fill Recycle Goal",
 "Sort the Litter",
 "Clean-up Lab",
 "Why Reduce First",
 "Name the 3R Rule",
 "Stretch: BD Places",
 "Myth Bust",
 "Fluency Drill",
 "Waste Watcher Mastery",
 ],
};

/**
 * @param {{
 * overlay: HTMLElement,
 * setCoach: (html: string, aside?: string) => void,
 * completeSub: () => void,
 * registerTryAgain: (fn: () => void) => void,
 * }} api
 */
export function runL1Sub(subIndex, api) {
 const { registerTryAgain } = api;
 labState.reveal = false;
 labState.tokenProgress = 0;
 labState.masteryStep = 0;
 labState.sortPlaced = 0;
 labState.placed = {};
 labState.selectedId = null;
 labState.mythBusted = false;
 labState.mythPhase = "claim";
 labState.heat = 0.25;
 labState.recycleFill = 0.25;
 labState.scale = 0;
 labState.phase = "desk";
 labState.mode = "home";

 const runners = [
 s1_meet,
 s2_fill,
 s3_sort,
 s4_cleanup,
 s5_reduce,
 s6_rule,
 s7_stretch,
 s8_myths,
 s9_drill,
 s10_mastery,
 ];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => {
 api.overlay.innerHTML = "";
 fn(api);
 });
 fn(api);
}

function s1_meet({ overlay, setCoach, completeSub }) {
 setCoach(
 "Hook + light enactive: meet everyday litter, three bins, and the Reduce → Reuse → Recycle idea.",
 );
 mountMotionChain(overlay, {
 title: "Meet the Bins",
 beats: [
 {
 scene: "wasteMeet",
 sceneArgs: { phase: "desk" },
 dwellMs: 4200,
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "waste")}
 <p><strong>Act 1 - Everyday litter:</strong> Bottle, peel, bag, and can on the desk. Drag them around - they look like junk, but each has a better home.</p>`,
 },
 {
 scene: "wasteMeet",
 sceneArgs: { phase: "bins" },
 dwellMs: 4500,
 html: `<p><strong>Act 2 - Three bins:</strong> Recycle (clean packaging), Compost (food & leaves), Landfill / special (dirty wrappers, batteries).</p>
 <p>Sorting is a skill - not magic.</p>`,
 },
 {
 scene: "wasteMeet",
 sceneArgs: { phase: "glow" },
 dwellMs: 3800,
 html: `<p><strong>Act 3 - Predict:</strong> Which bin for a banana peel? Watch the compost bin glow while you decide.</p>`,
 },
 {
 scene: "wasteMeet",
 sceneArgs: { phase: "settle" },
 dwellMs: 4200,
 html: `<p><strong>Act 4 - Big idea:</strong> Best path is <strong>Reduce → Reuse → Recycle</strong>, then respect shared spaces.</p>
 <p>Recycling helps - but buying less junk first helps more.</p>`,
 },
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "wasteMeet",
 sceneArgs: { phase: "settle" },
 title: "Exit check",
 q: "What did the bins + big idea suggest about everyday litter?",
 opts: [
 "Each item has a smarter home - and reduce comes before recycle",
 "All trash is the same - dump it anywhere",
 "Only bottles matter; peels can go in rivers",
 "Recycling alone means we can buy unlimited plastic",
 ],
 ok: 0,
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "wasteMeet",
 sceneArgs: { phase: "settle" },
 badge: LAB_ASSET_PATHS.m1,
 html: `<h3>You met Waste Watch</h3><p>Next we fill a recycle goal dial - clean packaging going where it belongs.</p>`,
 onDone: completeSub,
 advanceAfterDone: true,
 });
 },
 });
 },
 });
}

function s2_fill({ overlay, setCoach, completeSub }) {
 setCoach("Enactive: drag the fill handle until the recycle bin hits the goal line.");
 labState.heat = 0.25;
 labState.recycleFill = 0.25;
 mountHeatLab(overlay, {
 scene: "wasteLab",
 title: "Fill Recycle Goal",
 html: `<p>Clean bottles and cans count toward recycle fill. Drag the green handle (or use the slider) until fill ≥ 60%.</p>
 <p>This is practice sorting volume - not melting anything.</p>`,
 goalText: "Goal: recycle fill ≥ 60%",
 doneLabel: "Recycle filled ▶",
 threshold: 0.6,
 startHeat: 0.25,
 axis: "x",
 canvasAction: "stretch",
 sliderLabel: "Recycle fill",
 readoutLabels: {
 cold: "Almost empty - keep sorting clean packaging",
 melting: "Bin rising - bottles & cans going in",
 liquid: "Solid progress - near the goal line",
 simmer: "Goal met - recycle bin looks healthy",
 },
 badge: LAB_ASSET_PATHS.m1,
 onDone: () => {
 mountQuiz(overlay, {
 scene: "wasteLab",
 title: "Quick check",
 q: "What does a fuller recycle bin mean in this lab?",
 opts: [
 "More clean packaging found the recycle home",
 "We heated trash until it melted",
 "Food peels belong in recycle too",
 "Filling recycle means reduce is optional",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
}

function s3_sort({ overlay, setCoach, completeSub }) {
 setCoach("Enactive sort: recycle clean packaging, compost organics, landfill / special for the rest.");
 labState.reveal = false;
 mountTapContinue(overlay, {
 scene: "wasteSort",
 html: `<h3>Bin guide</h3>
 <p><strong>Recycle:</strong> bottle, can, clean paper, glass.</p>
 <p><strong>Compost:</strong> peel, leaves.</p>
 <p><strong>Landfill / special:</strong> dirty chip bag, battery (batteries need careful handling).</p>
 <p>Next: sort eight items on the canvas or with chips.</p>`,
 onDone: () => {
 mountDragSort(overlay, {
 scene: "wasteSort",
 title: "Sort the litter",
 instructions: "Drag into Recycle, Compost, or Landfill / special.",
 successText: "Clean sort!",
 chips: [
 { id: "bottle", text: "Plastic bottle", short: "Bottle", color: 0x38bdf8 },
 { id: "peel", text: "Banana peel", short: "Peel", color: 0xfbbf24 },
 { id: "can", text: "Metal can", short: "Can", color: 0xa3e635 },
 { id: "paper", text: "Clean paper", short: "Paper", color: 0xe2e8f0 },
 { id: "bag", text: "Dirty chip bag", short: "Chip bag", color: 0x94a3b8 },
 { id: "leaf", text: "Dry leaves", short: "Leaves", color: 0x4ade80 },
 { id: "battery", text: "Battery", short: "Battery", color: 0xf87171 },
 { id: "glass", text: "Glass jar", short: "Glass", color: 0x67e8f9 },
 ],
 zones: [
 { id: "recycle", label: "Recycle", accept: ["bottle", "can", "paper", "glass"] },
 { id: "compost", label: "Compost", accept: ["peel", "leaf"] },
 { id: "landfill", label: "Landfill / special", accept: ["bag", "battery"] },
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "wasteSort",
 title: "Justify",
 q: "Why does a dirty chip bag usually skip the recycle bin?",
 opts: [
 "Food grease and mixed film often cannot be recycled cleanly",
 "Because bags are too colorful",
 "Because bags are always compost",
 "Because recycle bins only take batteries",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function s4_cleanup({ overlay, setCoach, completeSub }) {
 setCoach("Push recycle fill higher - then name why clean-up volume matters.");
 labState.heat = 0.4;
 labState.recycleFill = 0.4;
 mountHeatLab(overlay, {
 scene: "wasteLab",
 title: "Clean-up Lab",
 html: `<p>Reach ≥ 75% recycle fill. Watch bottles and cans stack into the green bin as fill rises.</p>`,
 goalText: "Goal: recycle fill ≥ 75%",
 doneLabel: "Lab done ▶",
 threshold: 0.75,
 startHeat: 0.4,
 axis: "x",
 canvasAction: "stretch",
 sliderLabel: "Recycle fill",
 readoutLabels: {
 cold: "Still sparse - keep sorting",
 melting: "Bin climbing - clean packaging in",
 liquid: "Strong fill - almost there",
 simmer: "Clean-up goal reached",
 },
 badge: LAB_ASSET_PATHS.m1,
 onDone: () => {
 mountQuiz(overlay, {
 scene: "wasteLab",
 title: "Conservation of care",
 q: "When recycle fill rises, what stayed true?",
 opts: [
 "The same items moved to a better home - they did not vanish",
 "Trash disappeared into empty air",
 "Peels became plastic bottles",
 "Landfill is always the first choice",
 ],
 ok: 0,
 onDone: () => {
 mountRevealSteps(overlay, {
 scene: "wasteLab",
 title: "Clean-up story",
 steps: [
 "Spot clean packaging on the desk or street.",
 "Check: is it dry / empty enough for recycle?",
 "Drop it in recycle - volume of good sort rises.",
 "Lesson: sorting rearranges where waste goes; it does not erase the need to reduce.",
 ],
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function s5_reduce({ overlay, setCoach, completeSub }) {
 setCoach("Order why reduce comes first - then lock the shopping habit.");
 mountOrderSteps(overlay, {
 scene: "wasteMeet",
 sceneArgs: { phase: "settle" },
 title: "Why reduce first",
 instructions: "Best waste path order.",
 items: [
 { id: "reduce", html: "Reduce what you buy/use" },
 { id: "reuse", html: "Reuse containers" },
 { id: "recycle", html: "Recycle what you can" },
 { id: "respect", html: "Respect shared spaces" },
 ],
 correctIds: ["reduce", "reuse", "recycle", "respect"],
 onDone: () => {
 mountRevealSteps(overlay, {
 scene: "wasteMeet",
 sceneArgs: { phase: "settle" },
 title: "Causal chain",
 steps: [
 "Buying less plastic means fewer bags exist to sort later.",
 "Reusable bottles cut single-use waste at the source.",
 "Recycling helps leftover packaging - it cannot fix over-buying alone.",
 "Respect keeps drains, parks, and rivers clear for everyone.",
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "wasteMeet",
 sceneArgs: { phase: "settle" },
 title: "Check",
 q: "Best first step when shopping?",
 opts: [
 "Carry a reusable bag (reduce)",
 "Buy more plastic then recycle later",
 "Dump near the drain",
 "Ignore packaging",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function s6_rule({ overlay, setCoach, completeSub }) {
 setCoach("Symbolic: build the Waste Watch rule, then scrub priority from pile → bins → 3R banner.");
 mountEquationBuild(overlay, {
 scene: "wasteRule",
 title: "Name the 3R Rule",
 instructions: "Tap tokens in order to build the Waste Watch rule.",
 lockedText: "Rule locked in. Continue to the priority scrubber.",
 tokens: [
 { id: "a", html: "Reduce" },
 { id: "b", html: "Reuse" },
 { id: "c", html: "Recycle" },
 { id: "d", html: "Respect" },
 ],
 correctIds: ["a", "b", "c", "d"],
 badge: LAB_ASSET_PATHS.rule,
 onDone: () => {
 mountScaleLab(overlay, {
 scene: "wasteRule",
 title: "Priority scrubber",
 html: `<p>Slide from messy pile → three bins → the Reduce → Reuse → Recycle banner.</p>
 <p>The Waste Watch rule is about <strong>priority order</strong>, not particle zoom.</p>`,
 start: 0,
 threshold: 0.85,
 sliderLabel: "Priority scale: pile → bins → 3R rule",
 goalText: "Canvas follows: litter pile → sort bins → Reduce→Reuse→Recycle banner.",
 readoutLabels: {
 low: "Messy litter pile - no plan yet",
 mid: "Three bins ready - sort is possible",
 high: "3R priority banner locked",
 },
 onDone: () => {
 mountQuiz(overlay, {
 scene: "wasteRule",
 title: "Rule check",
 q: "What is the main Waste Watch rule?",
 opts: [
 "Reduce first, then reuse, then recycle - and respect shared spaces",
 "Recycle everything first, then maybe reduce",
 "All waste belongs in the river",
 "Batteries are normal snack trash",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function s7_stretch({ overlay, setCoach, completeSub }) {
 setCoach("Transfer: same sort idea at home, school, market, park, and river.");
 const modes = [
 {
 mode: "home",
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "home")}<p><strong>Home kitchen:</strong> Peels → compost when you can. Bottles → rinse and recycle.</p>`,
 },
 {
 mode: "school",
 html: `<p><strong>School desk:</strong> Clean paper scraps go recycle. Food wrappers that are greasy skip recycle.</p>`,
 },
 {
 mode: "market",
 html: `<p><strong>Market stall:</strong> Ask for fewer plastic bags - reduce first. Reuse a sturdy bag next trip.</p>`,
 },
 {
 mode: "park",
 html: `<p><strong>Park path:</strong> Leaves can compost; snack wrappers often landfill. Leave no litter trail.</p>`,
 },
 {
 mode: "river",
 html: `<p><strong>River edge:</strong> Never dump. Litter harms fish, people, and flood drains.</p>`,
 },
 ];
 let step = 0;

 function show() {
 if (step >= modes.length) {
 mountQuiz(overlay, {
 scene: "wasteStretch",
 sceneArgs: { mode: "river" },
 title: "Stretch check",
 q: "Which statement fits home, school, market, park, and river?",
 opts: [
 "Same sort idea - reduce first, then put each item in the right home",
 "Only school trash matters",
 "Rivers safely wash litter away",
 "Recycling rules change randomly each place",
 ],
 ok: 0,
 onDone: completeSub,
 });
 return;
 }
 const m = modes[step];
 labState.mode = m.mode;
 mountTapContinue(overlay, {
 scene: "wasteStretch",
 sceneArgs: { mode: m.mode },
 html: `<div class="lab-demo__badge">Place ${step + 1} of ${modes.length}</div>${m.html}`,
 onDone: () => {
 step++;
 show();
 },
 });
 }
 show();
}

function s8_myths({ overlay, setCoach, completeSub }) {
 setCoach("Misconceptions: claim first on canvas; truth appears only after you bust the myth.");
 mountMythCards(overlay, {
 scene: "wasteMyth",
 title: "Myth Bust",
 badge: LAB_ASSET_PATHS.myth,
 myths: [
 {
 sceneMyth: 0,
 title: "“All plastic recycles”",
 claim: "Any plastic can go in the recycle bin.",
 truth: "Dirty or mixed plastics often cannot - clean & check labels.",
 },
 {
 sceneMyth: 1,
 title: "“Food scraps recycle”",
 claim: "Banana peels belong with bottles in recycle.",
 truth: "Food scraps usually compost - not recycle.",
 },
 {
 sceneMyth: 2,
 title: "“Recycle alone fixes it”",
 claim: "If I recycle sometimes, I can buy unlimited packaging.",
 truth: "Reduce and reuse come first; recycle helps leftovers.",
 },
 {
 sceneMyth: 3,
 title: "“Batteries are normal trash”",
 claim: "Toss batteries in the same bag as chip wrappers.",
 truth: "Batteries need special / careful disposal.",
 },
 {
 sceneMyth: 4,
 title: "“River litter washes away”",
 claim: "Dumping near water just floats off safely.",
 truth: "It harms fish, people, and flood drains.",
 },
 ],
 onDone: completeSub,
 });
}

function s9_drill({ overlay, setCoach, completeSub }) {
 setCoach("Fluency: quick application checks. Need about 80% to unlock Continue.");
 mountSpeedDrill(overlay, {
 scene: "wasteDrill",
 passScene: "wasteMastery",
 title: "Fluency Drill",
 passRatio: 0.8,
 items: [
 {
 prompt: "Bottle",
 q: "Clean plastic bottle → ?",
 opts: ["Recycle", "Compost", "River dump", "Battery bin"],
 ok: 0,
 },
 {
 prompt: "Peel",
 q: "Banana peel → ?",
 opts: ["Recycle with cans", "Compost", "Always landfill only", "Burn in class"],
 ok: 1,
 },
 {
 prompt: "3R",
 q: "Best first R?",
 opts: ["Recycle only", "Reduce", "Ignore packaging", "Dump first"],
 ok: 1,
 },
 {
 prompt: "Battery",
 q: "Battery in normal trash?",
 opts: ["Yes, always fine", "No - special care", "Compost it", "Feed to fish"],
 ok: 1,
 },
 {
 prompt: "Bag",
 q: "Dirty chip bag → often?",
 opts: ["Compost", "Clean recycle always", "Landfill / skip recycle", "Reuse as a water bottle"],
 ok: 2,
 },
 {
 prompt: "River",
 q: "River dumping OK?",
 opts: ["Yes if small", "No", "Only plastic", "Only peels"],
 ok: 1,
 },
 {
 prompt: "Paper",
 q: "Clean school paper → ?",
 opts: ["Recycle if dry", "Compost with batteries", "River", "Always landfill"],
 ok: 0,
 },
 {
 prompt: "Rule",
 q: "Best Waste Watch rule?",
 opts: [
 "Reduce → Reuse → Recycle (+ respect)",
 "Recycle first forever",
 "All trash is identical",
 "Myths beat sorting",
 ],
 ok: 0,
 },
 ],
 onDone: completeSub,
 });
}

function s10_mastery({ overlay, setCoach, completeSub }) {
 setCoach("Mastery: rebuild the path, transfer to kitchen + market bag, then prove it.");
 playScene("wasteMastery");
 mountOrderSteps(overlay, {
 scene: "wasteMastery",
 title: "Waste Watcher Mastery - learning path",
 instructions: "Tap Bruner order: meet → sort → lab → rule → stretch/myths.",
 items: [
 { id: "1", html: "Meet bins + litter (concrete)" },
 { id: "2", html: "Sort recycle / compost / landfill" },
 { id: "3", html: "Fill recycle lab (do it)" },
 { id: "4", html: "Name Reduce → Reuse → Recycle" },
 { id: "5", html: "Stretch places + bust myths" },
 ],
 correctIds: ["1", "2", "3", "4", "5"],
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "wasteMastery",
 html: `<h3>Mixed case</h3>
 <p><strong>Kitchen + market bag:</strong> Peels can compost; a reusable bag reduces plastic at the stall; bottles rinse into recycle - same 3R family, different items.</p>
 <p>Ready for the final checks?</p>`,
 onDone: () => {
 mountMultiQuiz(overlay, {
 scene: "wasteMastery",
 title: "Final mastery",
 doneTitle: "Waste Watcher ready",
 items: [
 {
 q: "Peels, bottles, and bags all teach the same idea because...",
 opts: [
 "Each item has a smarter home - and reduce still comes first",
 "They are unrelated magic tricks",
 "Only bottles have rules",
 "Sorting only matters in chemistry class",
 ],
 ok: 0,
 },
 {
 q: "A correct statement about the 3Rs here is...",
 opts: [
 "Reduce cuts waste at the source; reuse extends life; recycle handles leftovers",
 "Recycle and reduce mean the exact same action",
 "Reuse only applies to rivers",
 "Respect is optional forever",
 ],
 ok: 0,
 },
 {
 q: "Which does NOT belong in everyday recycle?",
 opts: ["Dirty chip bag with grease", "Clean dry paper", "Rinsed plastic bottle", "Empty metal can"],
 ok: 0,
 },
 ],
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "wasteMastery",
 badge: LAB_ASSET_PATHS.m1,
 html: `<h3>Mission 1 complete path</h3>
 <p>You earned the story arc from desk litter to a reusable 3R rule. Use step dots to replay any weak spot. Press <strong>Next</strong> in the dock to claim <strong>Waste Watcher</strong>.</p>`,
 onDone: completeSub,
 advanceAfterDone: true,
 });
 },
 });
 },
 });
 },
 });
}
