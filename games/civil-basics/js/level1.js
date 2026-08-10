/**
 * Civil Basics - Mission 1: Strong Structures
 * 10 sub-levels, Bruner spiral: enactive -> iconic -> symbolic.
 * Accurate: triangles + wide base carry load (not chemistry melt / salt).
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
} from "./lab-activities.js?v=structqa1";

export const L1_META = {
 objective: "By the end of this mission, you'll be able to explain why triangles and a wide base keep frames strong under load.",
 bdHook:
 "Bangladesh everyday: shelf brackets at home, school model bridges, road trusses, warehouse racks - triangles and a stable base carry load, not magic height.",
 predict: {
 q: "Before we start - a tall bookshelf tips when you load the top. What is the most likely reason?",
 options: [
 "Gravity only works on books, never on frames",
 "A skinny base or missing braces leaves a weak load path",
 "Books always tip no matter the shelf shape",
 ],
 ok: 1,
 },

 kidTitle: "Strong Structures",
 theme: "triangles & load",
 emoji: "🏗️",
 rewardName: "Structure Scout",
 intro:
 "Triangles and good bases keep bridges and towers strong under load. We start with frames you can compare - then name a clear rule you can reuse on shelves, racks, and road bridges.",
 everyday: ["Bridge truss", "Shelf bracket", "Building frame"],
 subTitles: [
 "Meet Strong Shapes",
 "Strength Dial",
 "Sort Strong Ideas",
 "Stronger Bridge Lab",
 "Why It Holds",
 "Name the Structure Rule",
 "Stretch: Places",
 "Myth Bust",
 "Fluency Drill",
 "Structure Scout Mastery",
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
 labState.scale = 0;
 labState.heat = 0.25;
 labState.phase = "desk";
 labState.mode = "home";

 const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => {
 api.overlay.innerHTML = "";
 fn(api);
 });
 fn(api);
}

function s1({ overlay, setCoach, completeSub }) {
 setCoach(
 "Hook + light enactive: compare a triangle frame to a tall skinny tower - then watch load share through braces.",
 );
 mountMotionChain(overlay, {
 title: "Meet Strong Shapes",
 beats: [
 {
 scene: "structMeet",
 sceneArgs: { phase: "desk" },
 dwellMs: 4200,
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "struct")}
 <p><strong>Act 1 - Everyday frames:</strong> Drag the triangle and the tall skinny tower on the canvas.</p>
 <p>Same height idea - very different stability under a load block.</p>`,
 },
 {
 scene: "structMeet",
 sceneArgs: { phase: "glow" },
 dwellMs: 4500,
 html: `<p><strong>Act 2 - Load share:</strong> Triangles and a wide base send the force down members.</p>
 <p>Watch the arrows: load is not magic - it needs a path to the ground.</p>`,
 },
 {
 scene: "structMeet",
 sceneArgs: { phase: "brace" },
 dwellMs: 4000,
 html: `<p><strong>Act 3 - Braces lock:</strong> Extra members stop the frame from racking (leaning into a parallelogram).</p>`,
 },
 {
 scene: "structMeet",
 sceneArgs: { phase: "settle" },
 dwellMs: 4200,
 html: `<p><strong>Act 4 - Big idea:</strong> Bridges, shelves, and towers reuse the same claim.</p>
 <p><strong>Triangles + a stable base</strong> keep structures strong under load.</p>`,
 },
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "structMeet",
 sceneArgs: { phase: "settle" },
 title: "Exit check",
 q: "A strong simple structure often uses...",
 opts: [
 "Triangles and a stable base",
 "Only tall skinny stacks",
 "Cloud props instead of members",
 "Songs instead of braces",
 ],
 ok: 0,
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "structMeet",
 sceneArgs: { phase: "settle" },
 badge: LAB_ASSET_PATHS.m1,
 html: `<h3>You met Strong Shapes</h3><p>Next: dial braces and base width until the frame holds the load.</p>`,
 onDone: completeSub,
 advanceAfterDone: true,
 });
 },
 });
 },
 });
}

function s2({ overlay, setCoach, completeSub }) {
 setCoach("Enactive: drag strength until braces appear and the base widens - watch the lean shrink.");
 labState.heat = 0.2;
 mountHeatLab(overlay, {
 scene: "structLab",
 sceneArgs: { labMode: "intro" },
 title: "Strength Dial",
 html: `<p>A weak rectangle leans under load. Drag <strong>Strength</strong> (or the amber handle) until braces lock and the base widens.</p>
 <p>Goal: past ~60% - lean stops, triangles show.</p>`,
 goalText: "Goal: strength ≥ 60% so braces hold.",
 doneLabel: "Dial checked ▶",
 threshold: 0.6,
 startHeat: 0.2,
 axis: "x",
 canvasAction: "stretch",
 sliderLabel: "Strength (braces + base)",
 badge: LAB_ASSET_PATHS.m1,
 readoutLabels: {
 cold: "Tippy - skinny base, no braces",
 melting: "Base widening - still soft",
 liquid: "Braces locking - lean fading",
 simmer: "Strong - triangles holding load",
 },
 onDone: completeSub,
 });
}

function s3({ overlay, setCoach, completeSub }) {
 setCoach("Enactive sort: strong ideas lock shapes; weak ones tip; clouds/songs are not structure.");
 mountTapContinue(overlay, {
 scene: "structSort",
 html: `<h3>Strong vs weak vs not</h3>
 <p><strong>Strong:</strong> triangle, wide base, cross brace.</p>
 <p><strong>Weak:</strong> tall skinny, no brace, tippy stack.</p>
 <p><strong>Not structure:</strong> cloud prop, only a song - they do not carry load.</p>`,
 onDone: () => {
 mountDragSort(overlay, {
 scene: "structSort",
 title: "Sort Strong Ideas",
 instructions: "Drag into Strong / Weak / Not structure.",
 successText: "Structure ideas sorted!",
 chips: [
 { id: "tri", text: "Triangle brace", short: "Triangle", color: 0x22c55e },
 { id: "wide", text: "Wide base", short: "Wide base", color: 0x38bdf8 },
 { id: "brace", text: "Cross brace", short: "Brace", color: 0xfbbf24 },
 { id: "tall", text: "Tall skinny", short: "Tall skinny", color: 0xf97316 },
 { id: "nbrace", text: "No brace", short: "No brace", color: 0xef4444 },
 { id: "tip", text: "Tippy stack", short: "Tippy", color: 0xa78bfa },
 { id: "cloud", text: "Cloud prop", short: "Cloud", color: 0x94a3b8 },
 { id: "song", text: "Only a song", short: "Song", color: 0x78716c },
 ],
 zones: [
 { id: "strong", label: "Strong idea", accept: ["tri", "wide", "brace"] },
 { id: "weak", label: "Weak idea", accept: ["tall", "nbrace", "tip"] },
 { id: "not", label: "Not structure", accept: ["cloud", "song"] },
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "structSort",
 title: "Justify",
 q: "Why is “only a song” NOT a structure idea?",
 opts: [
 "It does not provide members or a load path to the ground",
 "Because songs are always quieter than braces",
 "Because music turns into concrete",
 "Because triangles hate rhythm",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function s4({ overlay, setCoach, completeSub }) {
 setCoach("Push further: build a clear truss load path - same dial, higher goal, visible force arrows.");
 labState.heat = 0.35;
 mountHeatLab(overlay, {
 scene: "structLab",
 sceneArgs: { labMode: "truss" },
 title: "Stronger Bridge Lab",
 html: `<p>Now aim for a <strong>truss</strong>: triangles + wide base + a visible path for load down to the ground.</p>
 <p>Use the slider or canvas handle to ≥ 75%.</p>`,
 goalText: "Goal: strength ≥ 75% - truss path clear.",
 doneLabel: "Lab done ▶",
 threshold: 0.75,
 startHeat: 0.35,
 axis: "x",
 canvasAction: "stretch",
 sliderLabel: "Strength (truss path)",
 badge: LAB_ASSET_PATHS.m1,
 readoutLabels: {
 cold: "Open frame - load has nowhere safe",
 melting: "Members appearing",
 liquid: "Triangles forming",
 simmer: "Truss path - load reaches ground",
 },
 onDone: () => {
 mountQuiz(overlay, {
 scene: "structLab",
 sceneArgs: { labMode: "truss" },
 title: "Conservation of path",
 q: "When braces and base improve, what happens to the load?",
 opts: [
 "It still must travel through members down to the ground - the path gets clearer",
 "The load disappears into the sky",
 "Load turns into a song",
 "Gravity switches off",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
}

function s5({ overlay, setCoach, completeSub }) {
 setCoach("Explain the causal chain: base → braces → load path → holds.");
 mountRevealSteps(overlay, {
 scene: "structMeet",
 sceneArgs: { phase: "base" },
 title: "Why It Holds",
 steps: [
 "Set a wide stable base so the frame resists tipping.",
 "Add triangle braces so the shape cannot rack into a lean.",
 "Load travels down the members as a clear force path.",
 "Result: the shape holds instead of tipping or buckling.",
 ],
 onStep: (i) => {
 const phases = ["base", "brace", "path", "hold"];
 labState.phase = phases[i] || "hold";
 },
 onDone: () => {
 mountOrderSteps(overlay, {
 scene: "structMeet",
 sceneArgs: { phase: "hold" },
 title: "Order the story",
 instructions: "Put the hold-story in order.",
 items: [
 { id: "base", html: "Set a wide stable base" },
 { id: "tri", html: "Add triangle braces" },
 { id: "path", html: "Load travels down the members" },
 { id: "hold", html: "Shape holds instead of tipping" },
 ],
 correctIds: ["base", "tri", "path", "hold"],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "structMeet",
 sceneArgs: { phase: "hold" },
 title: "Check",
 q: "Removing all braces from a frame usually...",
 opts: [
 "Makes it weaker under load",
 "Always makes it stronger",
 "Turns it into a cloud",
 "Removes gravity",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function s6({ overlay, setCoach, completeSub }) {
 setCoach("Symbolic: lock the structure rule, then scrub desk → members → STRUCTURE banner.");
 mountEquationBuild(overlay, {
 scene: "structRule",
 title: "Name the Structure Rule",
 instructions: "Tap tokens in order to build the Strong Structures rule.",
 tokens: [
 { id: "a", html: "Triangles" },
 { id: "b", html: "+" },
 { id: "c", html: "wide base" },
 { id: "d", html: "carry load" },
 ],
 correctIds: ["a", "b", "c", "d"],
 badge: LAB_ASSET_PATHS.rule,
 onDone: () => {
 mountScaleLab(overlay, {
 scene: "structRule",
 title: "Structure scale scrubber",
 html: `<p>Slide from everyday shelf/tower → braced members → <strong>STRUCTURE</strong> nameplate.</p>
 <p>The rule stays the same: triangles + wide base carry load.</p>`,
 start: 0,
 threshold: 0.85,
 sliderLabel: "Structure scale: desk → members → STRUCTURE",
 goalText: "Left canvas follows: everyday frames → load path → STRUCTURE banner.",
 readoutLabels: {
 low: "Everyday shelf & tippy tower",
 mid: "Members: triangles + wide base",
 high: "STRUCTURE - rule nameplate",
 },
 onDone: () => {
 mountQuiz(overlay, {
 scene: "structRule",
 title: "Rule check",
 q: "What is the main Strong Structures rule?",
 opts: [
 "Triangles + wide base carry load safely",
 "Taller is always stronger",
 "Only songs support bridges",
 "Clouds are the best braces",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function s7({ overlay, setCoach, completeSub }) {
 setCoach("Transfer: same structure idea at home, school, street, shop, and lab.");
 const modes = [
 {
 mode: "home",
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "home")}<p><strong>Home:</strong> Shelf brackets are mini-trusses - the diagonal turns bend into forces the wall can take.</p>`,
 },
 {
 mode: "school",
 html: `<p><strong>School:</strong> Model bridges in science class win when triangles lock the deck.</p>`,
 },
 {
 mode: "street",
 html: `<p><strong>Street:</strong> Road bridges use trusses and piers so deck load reaches the ground.</p>`,
 },
 {
 mode: "shop",
 html: `<p><strong>Shop:</strong> Warehouse racks need X-bracing so stacked goods do not lean the frame.</p>`,
 },
 {
 mode: "lab",
 html: `<p><strong>Lab:</strong> Compare a triangle frame to a skinny rectangle - same height, different rack.</p>`,
 },
 ];
 let step = 0;

 function show() {
 if (step >= modes.length) {
 mountQuiz(overlay, {
 scene: "structStretch",
 sceneArgs: { mode: "street" },
 title: "Transfer",
 q: "A tippy tall bookshelf often needs...",
 opts: [
 "Wider base or wall bracing",
 "Only louder music",
 "Fewer triangles always",
 "Cloud supports",
 ],
 ok: 0,
 onDone: completeSub,
 });
 return;
 }
 const m = modes[step];
 labState.mode = m.mode;
 mountTapContinue(overlay, {
 scene: "structStretch",
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

function s8({ overlay, setCoach, completeSub }) {
 setCoach("Misconceptions: claim first on canvas; truth appears only after you bust the myth.");
 mountMythCards(overlay, {
 scene: "structMyth",
 title: "Myth Bust",
 badge: LAB_ASSET_PATHS.myth,
 myths: [
 {
 sceneMyth: 0,
 title: "“Taller is always stronger”",
 claim: "Taller is always stronger",
 truth: "Tall skinny without braces can tip or buckle",
 },
 {
 sceneMyth: 1,
 title: "“Triangles are only for art”",
 claim: "Triangles are only for art class",
 truth: "Triangles lock shapes and carry load well",
 },
 {
 sceneMyth: 2,
 title: "“Base width does not matter”",
 claim: "Base width does not matter",
 truth: "A wider base resists tipping",
 },
 {
 sceneMyth: 3,
 title: "“Braces are decoration”",
 claim: "Braces are optional decoration",
 truth: "Braces share and redirect load paths",
 },
 {
 sceneMyth: 4,
 title: "“Only concrete matters”",
 claim: "Only concrete matters, not shape",
 truth: "Shape and load path matter as much as material",
 },
 ],
 onDone: completeSub,
 });
}

function s9({ overlay, setCoach, completeSub }) {
 setCoach("Fluency: quick application checks. Need about 80% to unlock Continue.");
 mountSpeedDrill(overlay, {
 scene: "structDrill",
 title: "Fluency Drill",
 passScene: "structMastery",
 passRatio: 0.8,
 items: [
 { prompt: "Triangle?", q: "Triangles help lock a shape?", opts: ["Yes", "No"], ok: 0 },
 { prompt: "Base?", q: "Wide base resists tipping?", opts: ["Yes", "No"], ok: 0 },
 { prompt: "Tall?", q: "Tall skinny is always safest?", opts: ["No", "Yes"], ok: 0 },
 { prompt: "Brace?", q: "Braces share load?", opts: ["Yes", "No"], ok: 0 },
 { prompt: "Cloud?", q: "Cloud prop is a structure idea?", opts: ["No", "Yes"], ok: 0 },
 { prompt: "Weak?", q: "No brace can weaken a frame?", opts: ["Yes", "No"], ok: 0 },
 { prompt: "Load path", q: "Load should travel…", opts: ["Down members to the ground", "Into a song", "Into empty air only", "Sideways forever"], ok: 0 },
 { prompt: "Shelf / home", q: "A shelf bracket diagonal is like…", opts: ["A mini-truss brace", "A cloud", "Pure decoration with no force", "A flashlight beam"], ok: 0 },
 ],
 onDone: completeSub,
 });
}

function s10({ overlay, setCoach, completeSub }) {
 setCoach("Mastery: rebuild the path, transfer to shelf + street bridge, then prove it.");
 playScene("structMastery");
 mountOrderSteps(overlay, {
 scene: "structMastery",
 title: "Structure Scout Mastery - learning path",
 instructions: "Tap Bruner order: meet → sort → lab → rule → stretch/myths.",
 items: [
 { id: "1", html: "Meet strong shapes (concrete)" },
 { id: "2", html: "Sort strong / weak / not" },
 { id: "3", html: "Dial braces & truss path (do it)" },
 { id: "4", html: "Name triangles + wide base rule" },
 { id: "5", html: "Stretch places + bust myths" },
 ],
 correctIds: ["1", "2", "3", "4", "5"],
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "structMastery",
 html: `<h3>Mixed case</h3>
 <p><strong>Bookshelf + street bridge:</strong> Both need a load path. The shelf uses a diagonal bracket; the bridge uses truss triangles - same rule, different place.</p>
 <p>Ready for the final checks?</p>`,
 onDone: () => {
 mountMultiQuiz(overlay, {
 scene: "structMastery",
 title: "Final mastery",
 doneTitle: "Structure Scout ready",
 items: [
 {
 q: "Shelf brackets, model bridges, and road trusses teach the same idea because...",
 opts: [
 "They use triangles / braces and a stable support so load reaches the ground",
 "They are unrelated magic tricks",
 "Only concrete blocks matter - never shape",
 "Songs hold them up",
 ],
 ok: 0,
 },
 {
 q: "A correct statement about tall skinny towers is...",
 opts: [
 "Without braces or a wide base they can tip or buckle under load",
 "Taller always means safer",
 "Height removes the need for a load path",
 "Clouds make them rigid",
 ],
 ok: 0,
 },
 {
 q: "Which belongs in “not a structure idea”?",
 opts: ["Only a song", "Cross brace", "Wide base", "Triangle member"],
 ok: 0,
 },
 ],
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "structMastery",
 badge: LAB_ASSET_PATHS.m1,
 html: `<h3>Mission 1 complete path</h3>
 <p>You earned the story arc from comparing frames to a reusable rule. Use step dots to replay any weak spot. Press <strong>Next</strong> in the dock to claim <strong>Structure Scout</strong>.</p>`,
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
