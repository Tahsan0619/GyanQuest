/**
 * Geology & Earth - Mission 1: Rock Cycle Lite (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
 mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
 mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L1_META = {
 objective: "By the end of this mission, you'll be able to explain igneous / sedimentary / metamorphic in your own words.",
 bdHook: "Bangladesh everyday: notice igneous / sedimentary / metamorphic around you - then connect it to Rock Cycle Lite.",
 predict: {
 q: "Before we start - what do you think matters most in Rock Cycle Lite?",
 options: [
 "Guessing without checking",
 "Looking for a clear pattern or rule",
 "Skipping the practice steps",
 ],
 ok: 1,
 },

 kidTitle: "Rock Cycle Lite",
 theme: "igneous / sedimentary / metamorphic",
 emoji: "\ud83c\udf0b",
 rewardName: "Rock Ranger",
 intro: "Igneous, sedimentary, metamorphic - rocks transform.",
 everyday: ["River pebbles", "Brick / building stone", "Hill paths in BD"],
 subTitles: [
 "Meet Rock Types",
 "Cycle Clarity Lab",
 "Sort: Type / Form / Not",
 "Pressure Lab",
 "Why Rocks Transform",
 "Name the Cycle Rule",
 "Stretch: BD Rocks",
 "Myth Bust",
 "Fluency Drill",
 "Rock Ranger Mastery",
 ],
};

export function runL1Sub(subIndex, api) {
 const { registerTryAgain } = api;
 labState.reveal = false; labState.tokenProgress = 0; labState.masteryStep = 0;
 labState.placed = {}; labState.selectedId = null; labState.mythPhase = "claim";
 labState.heat = 0.25; labState.phase = "desk"; labState.mode = "home";
 const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => { api.overlay.innerHTML = ""; fn(api); });
 fn(api);
}

function s1({ overlay, setCoach, completeSub }) {
 setCoach("Hook: three rock types - and they can change.");
 mountMotionChain(overlay, {
 title: "Meet Rock Types",
 beats: [
 { scene: "rockMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000,
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "badge")}<p><strong>Act 1:</strong> Meet igneous, sedimentary, and metamorphic samples.</p>` },
 { scene: "rockMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200,
 html: `<p><strong>Act 2:</strong> Lava cools, layers press, heat remakes - rocks transform.</p>` },
 { scene: "rockMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000,
 html: `<p><strong>Act 3:</strong> The rock cycle links the three types.</p>` },
 ],
 onDone: () => mountQuiz(overlay, {
 scene: "rockMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
 q: "How many main rock types does this lab use?",
 opts: ["Three: igneous, sedimentary, metamorphic", "One forever", "Only plastic", "Zero"],
 ok: 0, onDone: () => mountTapContinue(overlay, {
 scene: "rockMeet", badge: LAB_ASSET_PATHS.m1,
 html: `<h3>Rocks ready</h3><p>Next: cycle clarity lab.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 }),
 });
}

function s2({ overlay, setCoach, completeSub }) {
 setCoach("Dial until rock-cycle idea is clear.");
 labState.heat = 0.25;
 mountHeatLab(overlay, {
 scene: "rockLab", title: "Cycle Clarity Lab",
 html: `<p>Drag until rock-cycle idea is clear (&gt;= 60%).</p>`,
 goalText: "Goal &gt;= 60%", doneLabel: "Cycle clearer", threshold: 0.6, startHeat: 0.25,
 axis: "x", canvasAction: "stretch", sliderLabel: "Cycle", badge: LAB_ASSET_PATHS.m1,
 onDone: completeSub,
 });
}

function s3({ overlay, setCoach, completeSub }) {
 setCoach("Sort rock types, how they form, and not-rocks.");
 mountTapContinue(overlay, {
 scene: "rockSort",
 html: `<h3>Type vs form</h3><p><strong>Type:</strong> igneous, sedimentary, metamorphic.<br><strong>Form:</strong> lava cools, sand layers, heat+pressure.<br><strong>Not:</strong> plastic, paper.</p>`,
 onDone: () => mountDragSort(overlay, {
 scene: "rockSort", title: "Sort: Type / Form / Not",
 instructions: "Drag chips into the matching bin.",
 successText: "Rocks sorted!",
 chips: [
 { id: "igneous", text: "Igneous from cooled lava", short: "Igneous", color: 0xf97316 },
 { id: "sed", text: "Sedimentary layered", short: "Sediment", color: 0xd6d3d1 },
 { id: "meta", text: "Metamorphic pressed", short: "Meta", color: 0xa8a29e },
 { id: "lava", text: "Hot lava cools", short: "Lava", color: 0xef4444 },
 { id: "sand", text: "Sand layers press", short: "Sand", color: 0xfbbf24 },
 { id: "heat", text: "Heat + pressure change", short: "Heat/P", color: 0xf59e0b },
 { id: "plastic", text: "Plastic bottle", short: "Plastic", color: 0x64748b },
 { id: "paper", text: "Paper scrap", short: "Paper", color: 0x78716c },
 ],
 zones: [
 { id: "type", label: "Rock type", accept: ["igneous", "sed", "meta"] },
 { id: "make", label: "How it forms", accept: ["lava", "sand", "heat"] },
 { id: "not", label: "Not a rock", accept: ["plastic", "paper"] },
 ],
 onDone: completeSub,
 }),
 });
}

function s4({ overlay, setCoach, completeSub }) {
 setCoach("Push cycle clarity higher.");
 labState.heat = 0.4;
 mountHeatLab(overlay, {
 scene: "rockLab", title: "Pressure Lab", html: `<p>Reach &gt;= 75% - heat and pressure story is clear.</p>`,
 goalText: "Goal &gt;= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
 axis: "x", canvasAction: "stretch", sliderLabel: "Cycle", badge: LAB_ASSET_PATHS.m1,
 onDone: completeSub,
 });
}

function s5({ overlay, setCoach, completeSub }) {
 setCoach("Order how rocks transform.");
 mountOrderSteps(overlay, {
 scene: "rockMeet", sceneArgs: { phase: "settle" }, title: "Why Rocks Transform",
 instructions: "Order the story.",
 items: [{ id: "melt", html: "Melt or lava cools" }, { id: "igneous", html: "Igneous rock forms" }, { id: "wear", html: "Wear into layers" }, { id: "change", html: "Heat/pressure can remake it" }],
 correctIds: ["melt", "igneous", "wear", "change"],
 onDone: () => mountQuiz(overlay, {
 scene: "rockMeet", title: "Check",
 q: "Cooled lava most often becomes...",
 opts: ["Igneous rock", "Plastic", "Paper", "Only clouds"],
 ok: 0, onDone: completeSub,
 }),
 });
}

function s6({ overlay, setCoach, completeSub }) {
 setCoach("Lock the rock-cycle rule.");
 mountEquationBuild(overlay, {
 scene: "rockRule", title: "Name the Cycle Rule", instructions: "Tap in order.",
 tokens: [{ id: "a", html: "Rocks" }, { id: "b", html: "can" }, { id: "c", html: "transform" }, { id: "d", html: "types" }],
 correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
 onDone: () => mountTapContinue(overlay, {
 scene: "rockRule", badge: LAB_ASSET_PATHS.rule,
 html: `<h3>Rule locked</h3><p>Rocks can transform between types.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 });
}

function s7({ overlay, setCoach, completeSub }) {
 setCoach("Pebbles, bricks, hills - same rock story.");
 mountTapContinue(overlay, {
 scene: "rockStretch",
 html: `<h3>BD rocks</h3><p>Tap home, school, street, bd, lab - pebbles and stone tell the same cycle.</p>`,
 onDone: () => mountQuiz(overlay, {
 scene: "rockStretch", title: "Transfer",
 q: "River pebbles are closest to...",
 opts: ["Rocks shaped by water and wear", "Plastic bottles", "Paper only", "Stars"],
 ok: 0, onDone: completeSub,
 }),
 });
}

function s8({ overlay, setCoach, completeSub }) {
 setCoach("Bust rock myths.");
 mountMythCards(overlay, {
 scene: "rockMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
 myths: [
 { claim: "All rocks are the same", truth: "Igneous, sedimentary, and metamorphic form differently", sceneMyth: 0 },
 { claim: "Rocks never change", truth: "Heat, pressure, melting, and layering transform rocks", sceneMyth: 1 },
 { claim: "Lava stays liquid forever", truth: "Lava cools and hardens into igneous rock", sceneMyth: 2 },
 { claim: "Plastic is a rock type", truth: "Plastic is human-made - not a rock cycle type", sceneMyth: 3 },
 { claim: "Only mountains have rocks", truth: "Rocks are under soil, rivers, and cities too", sceneMyth: 4 },
 ],
 onDone: completeSub,
 });
}

function s9({ overlay, setCoach, completeSub }) {
 setCoach("Quick rock fluency.");
 mountSpeedDrill(overlay, {
 scene: "rockDrill", title: "Fluency Drill", passScene: "rockMastery",
 items: [
 { q: "Igneous from cooled lava?", opts: ["Yes", "No"], ok: 0, prompt: "Igneous" },
 { q: "Sedimentary often layered?", opts: ["Yes", "No"], ok: 0, prompt: "Sed" },
 { q: "Heat+pressure can remake rock?", opts: ["Yes", "No"], ok: 0, prompt: "Meta" },
 { q: "Plastic a rock type?", opts: ["No", "Yes"], ok: 0, prompt: "Plastic" },
 { q: "Rocks can transform?", opts: ["Yes", "No"], ok: 0, prompt: "Cycle" },
 { q: "Lava stays liquid forever?", opts: ["No", "Yes"], ok: 0, prompt: "Lava" },
 ],
 onDone: completeSub,
 });
}

function s10({ overlay, setCoach, completeSub }) {
 setCoach("Mastery - Rock Ranger.");
 mountOrderSteps(overlay, {
 scene: "rockMastery", title: "Rock Ranger Mastery", instructions: "Order your journey.",
 items: [{ id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" }, { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "win", html: "Win" }],
 correctIds: ["meet", "sort", "lab", "rule", "myth", "win"],
 onDone: () => mountTapContinue(overlay, {
 scene: "rockMastery", badge: LAB_ASSET_PATHS.m1,
 html: `<h3>\ud83c\udf0b Rock Ranger!</h3><p>You can name three rock types and that they can change.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 });
}
