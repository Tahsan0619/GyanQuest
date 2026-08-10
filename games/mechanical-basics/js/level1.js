/**
 * Mechanical Basics - Mission 1: Levers & Gears
 * 10 sub-levels, Bruner spiral: enactive -> iconic -> symbolic.
 * Gold-standard depth patterned on chemistry-lab Tiny Bits (level1.js).
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
 mountMotionChain,
 mountDragSort,
 mountHeatLab,
 mountRevealSteps,
 mountEquationBuild,
 mountQuiz,
 mountSpeedDrill,
 mountMythCards,
 mountTapContinue,
 mountOrderSteps,
 mountScaleLab,
 badgeHtml,
} from "./lab-activities.js";

export const L1_META = {
 objective: "By the end of this mission, you'll be able to explain how levers and gears trade force, distance, and turn in your own words.",
 bdHook:
 "Bangladesh everyday: park seesaw tip, bottle opener on a soft-drink cap, bike gears climbing a flyover - levers and gears trade force for distance or turn, not free energy.",
 predict: {
 q: "Before we start - a heavy drain cover won't budge with a short pry bar. What helps most?",
 options: [
 "Pushing with magic free force from nowhere",
 "A longer effort arm (or gear trade) so you push farther with less force",
 "Removing the fulcrum so the stick floats",
 ],
 ok: 1,
 },

 kidTitle: "Levers & Gears",
 theme: "simple machines",
 emoji: "\u2699\ufe0f",
 rewardName: "Lever Learner",
 intro:
 "Levers and gears make hard jobs easier by trading force, distance, and turn. We start with a seesaw and bike gears - then name a clear rule you can reuse anywhere.",
 everyday: ["Seesaw", "Bottle opener", "Bike gears"],
 subTitles: [
 "Meet Lever & Gear",
 "Advantage Dial",
 "Sort Machines",
 "Stronger Advantage",
 "Why It Helps",
 "Name the Machine Rule",
 "Stretch: Places",
 "Myth Bust",
 "Fluency Drill",
 "Lever Learner Mastery",
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
 labState.mode = "home";
 labState.heat = 0.25;
 labState.phase = "desk";

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
 "Hook + light enactive: drag the lever and meshing gears - meet fulcrum, load, and effort.",
 );
 mountMotionChain(overlay, {
 title: "Meet Lever & Gear",
 beats: [
 {
 scene: "leverMeet",
 sceneArgs: { phase: "desk" },
 dwellMs: 4200,
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "lever")}
 <p><strong>Act 1 - Desk machines:</strong> Drag the beam and the meshing gears on the canvas.</p>
 <p>Find three labels on the lever: <strong>fulcrum</strong> (pivot), <strong>load</strong>, and <strong>effort</strong>.</p>`,
 },
 {
 scene: "leverMeet",
 sceneArgs: { phase: "glow" },
 dwellMs: 4500,
 html: `<p><strong>Act 2 - Advantage glow:</strong> A longer effort arm lifts easier; gears mesh to change speed and turn.</p>
 <p>Watch the beam tip and the gear pair spin together.</p>`,
 },
 {
 scene: "leverMeet",
 sceneArgs: { phase: "predict" },
 dwellMs: 3800,
 html: `<p><strong>Act 3 - Predict:</strong> Do machines create free force from nowhere, or trade force for distance / turn?</p>
 <p>Decide before we name the big idea.</p>`,
 },
 {
 scene: "leverMeet",
 sceneArgs: { phase: "settle" },
 dwellMs: 4200,
 html: `<p><strong>Act 4 - Big idea:</strong> Seesaws, openers, and bike gears connect to one claim.</p>
 <p>Simple machines <strong>trade</strong> force, distance, and turn to help - they do not invent energy.</p>`,
 },
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "leverMeet",
 sceneArgs: { phase: "settle" },
 title: "Exit check",
 q: "What did the desk model suggest about levers and gears?",
 opts: [
 "They trade force, distance, and turn to help with jobs",
 "They create free force from nowhere",
 "You should remove the fulcrum forever",
 "Gears never change turn direction",
 ],
 ok: 0,
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "leverMeet",
 sceneArgs: { phase: "settle" },
 badge: LAB_ASSET_PATHS.m1,
 html: `<h3>You met Levers & Gears</h3><p>Next we dial mechanical advantage until the load lifts easier.</p>`,
 onDone: completeSub,
 advanceAfterDone: true,
 });
 },
 });
 },
 });
}

function s2({ overlay, setCoach, completeSub }) {
 setCoach("Enactive: dial mechanical advantage until the load lifts easier.");
 labState.heat = 0.25;
 mountHeatLab(overlay, {
 scene: "leverLab",
 title: "Advantage Dial",
 html: `<p>Drag the canvas handle or scrub the slider. Longer effort advantage makes the load rise with less push.</p>`,
 goalText: "Goal: boost advantage to at least 60%.",
 doneLabel: "Dial checked \u25b6",
 threshold: 0.6,
 startHeat: 0.25,
 axis: "x",
 canvasAction: "stretch",
 sliderLabel: "Mechanical advantage",
 badge: LAB_ASSET_PATHS.m1,
 readoutLabels: {
 cold: "Low advantage - hard push needed",
 melting: "Building advantage - load starts to tip",
 liquid: "Stronger trade - load rising",
 simmer: "High advantage - lift feels easier",
 },
 onDone: completeSub,
 });
}

function s3({ overlay, setCoach, completeSub }) {
 setCoach("Sort levers, gears, and neither - look for fulcrum/arms vs meshing teeth.");
 mountTapContinue(overlay, {
 scene: "leverSort",
 html: `<h3>Guide</h3><p><strong>Lever:</strong> seesaw, crowbar, scissors.<br><strong>Gear:</strong> bike/clock gears.<br><strong>Neither:</strong> glue alone, loose magnet, ramp only.</p>`,
 onDone: () =>
 mountDragSort(overlay, {
 scene: "leverSort",
 title: "Sort Machines",
 instructions: "Drag into Lever / Gear / Neither.",
 successText: "Machines sorted!",
 chips: [
 { id: "see", text: "Seesaw", short: "Seesaw", color: 0x38bdf8 },
 { id: "crow", text: "Crowbar", short: "Crowbar", color: 0x22c55e },
 { id: "bike", text: "Bike gear", short: "Bike gear", color: 0xfbbf24 },
 { id: "clock", text: "Clock gear", short: "Clock gear", color: 0xfdba74 },
 { id: "glue", text: "Glue alone", short: "Glue", color: 0x94a3b8 },
 { id: "mag", text: "Loose magnet", short: "Magnet", color: 0x78716c },
 { id: "scis", text: "Scissors", short: "Scissors", color: 0xa78bfa },
 { id: "ramp", text: "Ramp only", short: "Ramp", color: 0xf97316 },
 ],
 zones: [
 { id: "lever", label: "Lever", accept: ["see", "crow", "scis"] },
 { id: "gear", label: "Gear", accept: ["bike", "clock"] },
 { id: "neither", label: "Neither", accept: ["glue", "mag", "ramp"] },
 ],
 onDone: completeSub,
 }),
 });
}

function s4({ overlay, setCoach, completeSub }) {
 setCoach("Push advantage higher - watch the load rise and gears spin faster.");
 labState.heat = 0.4;
 mountHeatLab(overlay, {
 scene: "leverLab",
 title: "Stronger Advantage",
 html: `<p>Reach a stronger trade (&gt;= 75%). Same lever + gear model - bigger advantage means an easier lift.</p>`,
 goalText: "Goal: advantage at least 75%.",
 doneLabel: "Lab done \u25b6",
 threshold: 0.75,
 startHeat: 0.4,
 axis: "x",
 canvasAction: "stretch",
 sliderLabel: "Mechanical advantage",
 badge: LAB_ASSET_PATHS.m1,
 readoutLabels: {
 cold: "Still hard - keep dialing",
 melting: "Advantage climbing",
 liquid: "Load rising clearly",
 simmer: "Strong advantage locked in",
 },
 onDone: completeSub,
 });
}

function s5({ overlay, setCoach, completeSub }) {
 setCoach("Causal chain: fulcrum place \u2192 effort arm \u2192 load rises \u2192 gears can retune speed/turn.");
 mountOrderSteps(overlay, {
 scene: "leverMeet",
 sceneArgs: { phase: "settle" },
 title: "Why It Helps",
 instructions: "Order the story.",
 items: [
 { id: "f", html: "Place a fulcrum under the beam" },
 { id: "e", html: "Push on the long effort arm" },
 { id: "l", html: "Load rises on the short arm" },
 { id: "g", html: "Gears can change speed or turn" },
 ],
 correctIds: ["f", "e", "l", "g"],
 onDone: () => {
 mountRevealSteps(overlay, {
 scene: "leverMeet",
 sceneArgs: { phase: "glow" },
 title: "Causal chain",
 steps: [
 "Fulcrum is the pivot - without it the beam is just a stick.",
 "A longer effort arm means you push farther but with less force.",
 "The load on the short arm rises - that is the trade.",
 "Gears mesh to retune speed and turn direction for the same idea.",
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "leverMeet",
 sceneArgs: { phase: "settle" },
 title: "Check",
 q: "Moving the fulcrum closer to the load...",
 opts: [
 "Usually makes lifting easier (longer effort arm)",
 "Removes all force forever",
 "Stops gears from existing",
 "Deletes distance from the universe",
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
 setCoach("Symbolic: lock the machine rule, then scrub desk \u2192 labeled arms \u2192 RULE banner.");
 mountEquationBuild(overlay, {
 scene: "leverRule",
 title: "Name the Machine Rule",
 instructions: "Tap tokens in order to build the Levers & Gears rule.",
 tokens: [
 { id: "a", html: "Lever" },
 { id: "b", html: "trades" },
 { id: "c", html: "force" },
 { id: "d", html: "distance" },
 ],
 correctIds: ["a", "b", "c", "d"],
 badge: LAB_ASSET_PATHS.rule,
 onDone: () => {
 mountScaleLab(overlay, {
 scene: "leverRule",
 title: "Machine scale scrubber",
 html: `<p>Slide from everyday desk tools \u2192 labeled fulcrum / effort / load \u2192 the MACHINE RULE banner.</p>
 <p>Gears keep the same idea: trade speed and turn, not free energy.</p>`,
 start: 0,
 threshold: 0.85,
 sliderLabel: "Machine scale: desk tools \u2192 arms labeled \u2192 RULE",
 goalText: "Canvas follows: everyday lever/gears \u2192 labeled parts \u2192 MACHINE RULE.",
 readoutLabels: {
 low: "Desk: seesaw / opener + meshing gears",
 mid: "Labeled fulcrum, effort arm, load arm",
 high: "MACHINE RULE: trade force \u2194 distance / turn",
 },
 onDone: () => {
 mountQuiz(overlay, {
 scene: "leverRule",
 title: "Rule check",
 q: "What is the main Levers & Gears rule?",
 opts: [
 "Machines trade force, distance, and turn to help with jobs",
 "Levers create free force from nowhere",
 "Fulcrum position never matters",
 "Only factory robots use gears",
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
 setCoach("Transfer: same lever/gear rule at home, school, street, bike shop, and lab.");
 const modes = [
 {
 mode: "home",
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "home")}<p><strong>Home:</strong> A bottle opener is a lever - fulcrum near the cap multiplies your hand force.</p>`,
 },
 {
 mode: "school",
 html: `<p><strong>School:</strong> A seesaw is a class-1 lever; kit gears mesh to change turn.</p>`,
 },
 {
 mode: "street",
 html: `<p><strong>Street:</strong> A crowbar pries a drain cover - long effort arm, fulcrum close to the load.</p>`,
 },
 {
 mode: "shop",
 html: `<p><strong>Bike shop:</strong> Pedal gears trade cadence for torque - same force/distance idea in a circle.</p>`,
 },
 {
 mode: "lab",
 html: `<p><strong>Lab:</strong> Measure effort arm vs load arm - longer effort arm, smaller push needed.</p>`,
 },
 ];
 let step = 0;

 function show() {
 if (step >= modes.length) {
 mountQuiz(overlay, {
 scene: "leverStretch",
 sceneArgs: { mode: "home" },
 title: "Transfer check",
 q: "A bottle opener is mostly a...",
 opts: [
 "Lever with fulcrum near the cap",
 "Loose magnet only",
 "Broken belt",
 "Smoke stack",
 ],
 ok: 0,
 onDone: completeSub,
 });
 return;
 }
 const m = modes[step];
 labState.mode = m.mode;
 mountTapContinue(overlay, {
 scene: "leverStretch",
 sceneArgs: { mode: m.mode },
 html: `<div class="lab-demo__badge">Context ${step + 1} of ${modes.length}</div>${m.html}`,
 onDone: () => {
 step++;
 show();
 },
 });
 }
 show();
}

function s8({ overlay, setCoach, completeSub }) {
 setCoach("Misconceptions: claim first on canvas; truth diagram appears only after you bust the myth.");
 mountMythCards(overlay, {
 scene: "leverMyth",
 title: "Myth Bust",
 badge: LAB_ASSET_PATHS.myth,
 myths: [
 {
 sceneMyth: 0,
 title: "\u201cLevers only make things heavier\u201d",
 claim: "Levers only make things heavier",
 truth: "Levers trade distance for force - they help lift",
 },
 {
 sceneMyth: 1,
 title: "\u201cGears only look cool\u201d",
 claim: "Gears only look cool",
 truth: "Gears change speed and turn direction",
 },
 {
 sceneMyth: 2,
 title: "\u201cFulcrum position does not matter\u201d",
 claim: "Fulcrum position does not matter",
 truth: "Fulcrum place changes how hard you push",
 },
 {
 sceneMyth: 3,
 title: "\u201cOnly factories use levers\u201d",
 claim: "Only factories use levers",
 truth: "Seesaws, crowbars, and scissors are levers too",
 },
 {
 sceneMyth: 4,
 title: "\u201cBigger gear = infinite force\u201d",
 claim: "Bigger gear always means infinite force",
 truth: "Gear pairs trade speed and force together",
 },
 ],
 onDone: completeSub,
 });
}

function s9({ overlay, setCoach, completeSub }) {
 setCoach("Fluency: quick lever/gear checks. Need about 80% to unlock Continue.");
 mountSpeedDrill(overlay, {
 scene: "leverDrill",
 title: "Fluency Drill",
 passScene: "leverMastery",
 passRatio: 0.8,
 items: [
 { q: "Fulcrum is the pivot point?", opts: ["Yes", "No"], ok: 0, prompt: "Fulcrum?" },
 { q: "Gears can change turn direction?", opts: ["Yes", "No"], ok: 0, prompt: "Turn?" },
 { q: "Glue alone is a lever?", opts: ["No", "Yes"], ok: 0, prompt: "Glue?" },
 { q: "Longer effort arm can help lift?", opts: ["Yes", "No"], ok: 0, prompt: "Arm?" },
 { q: "Scissors are a double lever?", opts: ["Yes", "No"], ok: 0, prompt: "Scissors?" },
 { q: "Ramp alone is a gear?", opts: ["No", "Yes"], ok: 0, prompt: "Ramp?" },
 ],
 onDone: completeSub,
 });
}

function s10({ overlay, setCoach, completeSub }) {
 setCoach("Mastery - prove the lever/gear journey and claim your Lever Learner badge.");
 mountOrderSteps(overlay, {
 scene: "leverMastery",
 title: "Lever Learner Mastery",
 instructions: "Order your journey.",
 items: [
 { id: "meet", html: "Meet" },
 { id: "sort", html: "Sort" },
 { id: "lab", html: "Lab" },
 { id: "rule", html: "Rule" },
 { id: "myth", html: "Myth" },
 { id: "win", html: "Win" },
 ],
 correctIds: ["meet", "sort", "lab", "rule", "myth", "win"],
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "leverMastery",
 badge: LAB_ASSET_PATHS.m1,
 html: `<h3>\u2699\ufe0f Lever Learner!</h3><p>You can explain how levers and gears trade force, distance, and turn to make jobs easier.</p>`,
 onDone: completeSub,
 advanceAfterDone: true,
 });
 },
 });
}
