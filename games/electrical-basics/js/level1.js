/**
 * Electrical Basics - Mission 1: Circuit Loop
 * 10 sub-levels, Bruner spiral: enactive -> iconic -> symbolic.
 * Target: 45-60 minutes. Accurate: closed path lights the bulb.
 */
import { LAB_ASSET_PATHS, labState } from "./lab-state.js";
import {
 mountMotionChain,
 mountDragSort,
 mountHeatLab,
 mountRevealSteps,
 mountEquationBuild,
 mountQuiz,
 mountSpeedDrill,
 mountOrderSteps,
 mountMythCards,
 mountTapContinue,
 mountScaleLab,
 mountMultiQuiz,
 playScene,
 badgeHtml,
} from "./lab-activities.js";

export const L1_META = {
 objective: "By the end of this mission, you'll be able to explain why a closed path lights the bulb in your own words.",
 bdHook:
 "Bangladesh everyday: torch switch at night, room light needing the wall path intact, school kit failing if one clip is loose - closed path, not magic bulbs.",
 predict: {
 q: "Before we start - a torch bulb stays dark even with a fresh battery. What is the most likely reason?",
 options: [
 "The bulb is always broken forever",
 "An open switch or wire gap breaks the closed path",
 "Batteries only work for phones, never for torches",
 ],
 ok: 1,
 },

 kidTitle: "Circuit Loop",
 theme: "closed path lights the bulb",
 emoji: "🔌",
 rewardName: "Loop Learner",
 intro:
 "Current needs a closed loop - battery, wires, switch, and bulb connected so charge can leave one battery end and return to the other. We start with a torch and a lab kit, then name a rule you can reuse anywhere.",
 everyday: [
 "Torch switch clicking on at night",
 "Room light needing the wall path intact",
 "School lab kit failing if one clip is loose",
 ],
 subTitles: [
 "Meet the Loop",
 "Close the Path Lab",
 "Sort Loop Parts",
 "Brighter Loop Lab",
 "Why the Bulb Lights",
 "Name the Loop Rule",
 "Stretch: Places",
 "Myth Bust",
 "Fluency Drill",
 "Loop Learner Mastery",
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
 labState.phase = "desk";
 labState.heat = 0.25;

 const runners = [
 sub1_meet,
 sub2_closePath,
 sub3_sort,
 sub4_brighter,
 sub5_why,
 sub6_rule,
 sub7_stretch,
 sub8_myths,
 sub9_drill,
 sub10_mastery,
 ];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => {
 api.overlay.innerHTML = "";
 fn(api);
 });
 fn(api);
}

const LOOP_READOUTS = {
 cold: "Wide gap - path open, bulb dark",
 melting: "Closing… wires almost meet",
 liquid: "Nearly closed - bulb warming",
 simmer: "Closed loop - current can flow",
};

function sub1_meet({ overlay, setCoach, completeSub }) {
 setCoach(
 "Hook + light enactive: drag battery, switch, and bulb into a team - then close the path so the bulb can glow.",
 );
 mountMotionChain(overlay, {
 title: "Meet the Loop",
 beats: [
 {
 scene: "circuitMeet",
 sceneArgs: { phase: "desk" },
 dwellMs: 4200,
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "loop")}
 <p><strong>Act 1 - Desk kit:</strong> Drag the battery, switch, and bulb on the canvas.</p>
 <p>Four parts matter in this mission: battery, wires, switch, bulb. Right now the path is still open.</p>`,
 },
 {
 scene: "circuitMeet",
 sceneArgs: { phase: "glow" },
 dwellMs: 4500,
 html: `<p><strong>Act 2 - Close the path:</strong> Wires connect battery → switch → bulb → back to battery.</p>
 <p>With the switch ON, charge can travel the full loop. That is why the bulb lights.</p>`,
 },
 {
 scene: "circuitMeet",
 sceneArgs: { phase: "predict" },
 dwellMs: 3800,
 html: `<p><strong>Act 3 - Predict:</strong> If we open a gap (switch OFF or a broken wire), what happens to the bulb?</p>
 <p>Decide before we settle the big idea.</p>`,
 },
 {
 scene: "circuitMeet",
 sceneArgs: { phase: "settle" },
 dwellMs: 4200,
 html: `<p><strong>Act 4 - Big idea:</strong> Open gap = no light. Closed loop = bulb glows.</p>
 <p>Current needs a complete path from one battery end around and back to the other.</p>`,
 },
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "circuitMeet",
 sceneArgs: { phase: "settle" },
 title: "Exit check",
 q: "What must be true for the bulb to light?",
 opts: [
 "A closed loop from battery around and back",
 "Only a battery sitting alone",
 "Only an open wire gap",
 "A switch that stays open forever",
 ],
 ok: 0,
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "circuitMeet",
 sceneArgs: { phase: "glow" },
 badge: LAB_ASSET_PATHS.m1,
 html: `<h3>You met the Loop</h3><p>Next: close the path yourself until the bulb brightens.</p>`,
 onDone: completeSub,
 advanceAfterDone: true,
 });
 },
 });
 },
 });
}

function sub2_closePath({ overlay, setCoach, completeSub }) {
 setCoach("Enactive: drag the loop-close handle until the path is complete enough for the bulb to light.");
 labState.heat = 0.25;
 mountHeatLab(overlay, {
 scene: "circuitLab",
 badge: LAB_ASSET_PATHS.m1,
 title: "Close the Path Lab",
 html: `<p>An open gap keeps the bulb dark. Drag the yellow handle (or use the slider) to <strong>close the loop</strong>.</p>
 <p>Watch the switch and wires: when the path connects, the bulb can glow.</p>`,
 goalText: "Goal: close the path past ~60% and watch the bulb light.",
 doneLabel: "Path checked - continue ▶",
 threshold: 0.6,
 startHeat: 0.25,
 axis: "x",
 canvasAction: "stretch",
 sliderLabel: "Loop close",
 readoutLabels: LOOP_READOUTS,
 onDone: () => {
 mountQuiz(overlay, {
 scene: "circuitLab",
 title: "Gap check",
 q: "Why does closing the path matter?",
 opts: [
 "Charge needs a complete loop; a gap stops current and the bulb stays dark",
 "Closing the path removes the battery",
 "Gaps make the bulb brighter",
 "Wires only work when they are broken",
 ],
 ok: 0,
 onDone: () => {
 mountRevealSteps(overlay, {
 scene: "circuitLab",
 title: "Open → closed story",
 steps: [
 "Open: switch OFF or a broken wire leaves a gap.",
 "Closing: wires and switch reconnect the path.",
 "Closed: charge can leave one battery end and return to the other.",
 "Lesson: darkness usually means “gap,” not “mystery broken bulb.”",
 ],
 onStep: (i) => {
 const heat = 0.2 + i * 0.22;
 labState.heat = heat;
 labState.heatTarget = heat;
 },
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function sub3_sort({ overlay, setCoach, completeSub }) {
 setCoach("Enactive sort: closed-loop parts vs open/gap vs not a circuit at all.");
 labState.reveal = false;
 mountTapContinue(overlay, {
 scene: "circuitSort",
 html: `<h3>Closed vs open vs not</h3>
 <p><strong>Closed loop part:</strong> battery, connected wire, switch ON, bulb in the path.</p>
 <p><strong>Open / gap:</strong> switch OFF, broken wire - current cannot finish the trip.</p>
 <p><strong>Not a circuit:</strong> rubber eraser, wooden stick - they are not path parts here.</p>
 <p>Next: sort eight cases on the canvas or with chips.</p>`,
 onDone: () => {
 mountDragSort(overlay, {
 scene: "circuitSort",
 title: "Sort: Loop parts",
 instructions: "Drag into Closed loop / Open gap / Not a circuit.",
 successText: "Loop parts sorted!",
 chips: [
 { id: "bat", text: "Battery in the path", short: "Battery", color: 0xfacc15 },
 { id: "wire", text: "Connected wire", short: "Wire", color: 0x94a3b8 },
 { id: "swon", text: "Switch closed (ON)", short: "Switch ON", color: 0x22c55e },
 { id: "bulb", text: "Bulb in the loop", short: "Bulb", color: 0xfde68a },
 { id: "swoff", text: "Switch open (OFF)", short: "Switch OFF", color: 0xf97316 },
 { id: "break", text: "Broken wire gap", short: "Broken", color: 0xef4444 },
 { id: "erase", text: "Rubber eraser", short: "Eraser", color: 0xa78bfa },
 { id: "wood", text: "Wooden stick", short: "Wood", color: 0x78716c },
 ],
 zones: [
 { id: "closed", label: "Closed loop part", accept: ["bat", "wire", "swon", "bulb"] },
 { id: "open", label: "Open / gap", accept: ["swoff", "break"] },
 { id: "not", label: "Not a circuit", accept: ["erase", "wood"] },
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "circuitSort",
 title: "Justify",
 q: "Why is an open switch NOT a closed-loop part?",
 opts: [
 "It leaves a gap, so current cannot complete the path",
 "Because switches are made of wood",
 "Because batteries hate switches",
 "Because bulbs only work with erasers",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function sub4_brighter({ overlay, setCoach, completeSub }) {
 setCoach("Push the loop closer - tighter path, brighter bulb. Same idea as closing a torch switch firmly.");
 labState.heat = 0.4;
 mountHeatLab(overlay, {
 scene: "circuitLab",
 badge: LAB_ASSET_PATHS.m1,
 title: "Brighter Loop Lab",
 html: `<p>Loose clips and half-open switches keep the loop weak. Drag until the path is <strong>strongly closed</strong> (~75%).</p>
 <p>Brighter here means: better continuity, not a new kind of electricity.</p>`,
 goalText: "Goal: close past ~75% so the bulb clearly brightens.",
 doneLabel: "I can explain brighter ▶",
 threshold: 0.75,
 startHeat: 0.4,
 axis: "x",
 canvasAction: "stretch",
 sliderLabel: "Loop close",
 readoutLabels: LOOP_READOUTS,
 onDone: () => {
 mountRevealSteps(overlay, {
 scene: "circuitLab",
 title: "Causal chain",
 steps: [
 "Loose path: high resistance / gap - little or no current.",
 "Closing: contacts meet; the loop becomes continuous.",
 "Flow: charge travels battery → path → bulb → back.",
 "Bright: the bulb converts electrical energy to light when current flows.",
 ],
 onStep: (i) => {
 const heat = 0.35 + i * 0.18;
 labState.heat = heat;
 labState.heatTarget = heat;
 },
 onDone: () => {
 mountQuiz(overlay, {
 scene: "circuitLab",
 title: "Brightness check",
 q: "A brighter bulb in this lab mainly means…",
 opts: [
 "The closed path is more complete so current can flow better",
 "The battery became a new element",
 "Wood sticks started conducting",
 "Myths make bulbs glow",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function sub5_why({ overlay, setCoach, completeSub }) {
 setCoach("Iconic causal chain: battery push → closed path → switch ON → bulb lights.");
 mountOrderSteps(overlay, {
 scene: "circuitMeet",
 sceneArgs: { phase: "settle" },
 title: "Why the bulb lights",
 instructions: "Order the story from energy source to glow.",
 items: [
 { id: "bat", html: "Battery provides a push" },
 { id: "path", html: "Wires make a closed path" },
 { id: "sw", html: "Closed switch lets current through" },
 { id: "glow", html: "Bulb lights when current flows" },
 ],
 correctIds: ["bat", "path", "sw", "glow"],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "circuitMeet",
 sceneArgs: { phase: "desk" },
 title: "Check",
 q: "An open switch in the loop means…",
 opts: [
 "Gap - current stops, bulb dark",
 "Extra brightness always",
 "Battery disappears",
 "Wire becomes wood",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
}

function sub6_rule({ overlay, setCoach, completeSub }) {
 setCoach(
 "Symbolic: build the Circuit Loop rule, then scrub from everyday torch → parts → CLOSED LOOP claim.",
 );
 mountEquationBuild(overlay, {
 scene: "circuitRule",
 title: "Name the Loop Rule",
 instructions: "Tap tokens in order to build the Circuit Loop rule.",
 tokens: [
 { id: "a", html: "Closed" },
 { id: "b", html: "loop" },
 { id: "c", html: "=" },
 { id: "d", html: "current flows" },
 ],
 correctIds: ["a", "b", "c", "d"],
 badge: LAB_ASSET_PATHS.rule,
 onDone: () => {
 mountScaleLab(overlay, {
 scene: "circuitRule",
 title: "Loop scale scrubber",
 html: `<p>Slide from everyday torch → named parts → the reusable CLOSED LOOP rule.</p>
 <p>The rule is about a <strong>complete path</strong>, not magic bulbs.</p>`,
 start: 0,
 threshold: 0.85,
 sliderLabel: "Loop scale: torch → parts → CLOSED LOOP",
 goalText: "Left canvas follows: everyday → kit parts → rule banner.",
 readoutLabels: {
 low: "Everyday torch / room light",
 mid: "Battery, wires, switch, bulb",
 high: "CLOSED LOOP = current can flow",
 },
 onDone: () => {
 mountQuiz(overlay, {
 scene: "circuitRule",
 title: "Rule check",
 q: "What is the main Circuit Loop rule?",
 opts: [
 "A closed path lets current flow so the bulb can light",
 "Batteries alone always light bulbs",
 "Open gaps make circuits stronger",
 "Only experts understand loops",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function sub7_stretch({ overlay, setCoach, completeSub }) {
 setCoach("Transfer: same closed-loop idea at home, school, street, shop, and lab.");
 const modes = [
 {
 mode: "home",
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "torch")}<p><strong>Home torch:</strong> Click the switch - you close the battery-bulb loop inside the case.</p>`,
 },
 {
 mode: "school",
 html: `<p><strong>School kit:</strong> Battery, clip wires, and bulb on a board. One loose clip = open path.</p>`,
 },
 {
 mode: "street",
 html: `<p><strong>Street lamp:</strong> Supply wires must form a complete path or the lamp stays dark.</p>`,
 },
 {
 mode: "shop",
 html: `<p><strong>Shop sign:</strong> Sign lights when the circuit behind it is closed - same loop rule.</p>`,
 },
 {
 mode: "lab",
 html: `<p><strong>Lab board:</strong> Build one neat closed path; trace it with your finger before powering.</p>`,
 },
 ];
 let step = 0;

 function show() {
 if (step >= modes.length) {
 mountQuiz(overlay, {
 scene: "circuitStretch",
 sceneArgs: { mode: "home" },
 title: "Stretch check",
 q: "Which statement fits torch, kit, street lamp, shop sign, and lab board?",
 opts: [
 "They all need a closed path for current to light something",
 "Only school kits use loops",
 "Gaps are required for brightness",
 "Loops only exist in textbooks",
 ],
 ok: 0,
 onDone: completeSub,
 });
 return;
 }
 const m = modes[step];
 labState.mode = m.mode;
 mountTapContinue(overlay, {
 scene: "circuitStretch",
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

function sub8_myths({ overlay, setCoach, completeSub }) {
 setCoach("Misconceptions: claim first on canvas; truth appears only after you bust the myth.");
 mountMythCards(overlay, {
 scene: "circuitMyth",
 title: "Myth Bust",
 badge: LAB_ASSET_PATHS.myth,
 myths: [
 {
 sceneMyth: 0,
 title: "“Current stops at the bulb”",
 claim: "Current leaves the battery and stops forever at the bulb.",
 truth: "Current needs a full closed loop back to the battery.",
 },
 {
 sceneMyth: 1,
 title: "“Open switch still flows”",
 claim: "An open switch still lets current flow.",
 truth: "Open switch = gap; current stops and the bulb stays dark.",
 },
 {
 sceneMyth: 2,
 title: "“Any scrap wire is a circuit”",
 claim: "Any random wire scrap always makes a circuit.",
 truth: "Parts must connect into one closed path.",
 },
 {
 sceneMyth: 3,
 title: "“Broken wire still lights”",
 claim: "A broken wire still lights the bulb.",
 truth: "A gap breaks the loop - no light.",
 },
 {
 sceneMyth: 4,
 title: "“Only experts can build loops”",
 claim: "Only experts can build a simple loop.",
 truth: "Kids can build battery-wire-bulb loops carefully with adult help.",
 },
 ],
 onDone: completeSub,
 });
}

function sub9_drill({ overlay, setCoach, completeSub }) {
 setCoach("Fluency: quick application checks. Need about 80% to unlock Continue.");
 mountSpeedDrill(overlay, {
 scene: "circuitDrill",
 passScene: "circuitMastery",
 title: "Fluency Drill",
 passRatio: 0.8,
 items: [
 {
 prompt: "Closed loop?",
 q: "Is a closed loop needed for current?",
 opts: ["Yes", "No"],
 ok: 0,
 },
 {
 prompt: "Open switch",
 q: "An open switch means…",
 opts: ["Gap / no flow", "Always brighter"],
 ok: 0,
 },
 {
 prompt: "Battery alone",
 q: "Battery alone (no wires) lights a bulb?",
 opts: ["No", "Yes"],
 ok: 0,
 },
 {
 prompt: "Broken wire",
 q: "A broken wire is a…",
 opts: ["Gap", "Closed path"],
 ok: 0,
 },
 {
 prompt: "Bulb in path",
 q: "Must the bulb be in the path to light?",
 opts: ["Yes", "Never"],
 ok: 0,
 },
 {
 prompt: "Eraser",
 q: "Is a rubber eraser a circuit path part?",
 opts: ["No", "Yes"],
 ok: 0,
 },
 {
 prompt: "Loop rule",
 q: "Best Circuit Loop rule?",
 opts: [
 "Closed path → current can flow → bulb can light",
 "Open gaps make brighter bulbs",
 "Only metals without batteries work",
 "Myths light the bulb",
 ],
 ok: 0,
 },
 {
 prompt: "Torch dark",
 q: "A torch that will not light often has…",
 opts: [
 "An open path (switch off / dead cell / gap)",
 "Too many closed loops only",
 "No need for a battery ever",
 "Only wooden wires",
 ],
 ok: 0,
 },
 ],
 onDone: completeSub,
 });
}

function sub10_mastery({ overlay, setCoach, completeSub }) {
 setCoach("Mastery: rebuild the path, transfer to torch + kit, then prove it.");
 playScene("circuitMastery");
 mountOrderSteps(overlay, {
 scene: "circuitMastery",
 title: "Loop Learner Mastery - learning path",
 instructions: "Tap Bruner order: meet → sort → labs → rule → stretch/myths.",
 items: [
 { id: "1", html: "Meet the closed loop (concrete)" },
 { id: "2", html: "Sort closed / open / not" },
 { id: "3", html: "Close + brighten the path (do it)" },
 { id: "4", html: "Name the closed-loop rule" },
 { id: "5", html: "Stretch + bust myths" },
 ],
 correctIds: ["1", "2", "3", "4", "5"],
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "circuitMastery",
 html: `<h3>Mixed case</h3>
 <p><strong>Dark torch + loose lab clip:</strong> Both are open-path problems - switch off, dead cell, or a gap. Closing the path (not guessing the bulb is “cursed”) is the fix.</p>
 <p>Ready for the final checks?</p>`,
 onDone: () => {
 mountMultiQuiz(overlay, {
 scene: "circuitMastery",
 title: "Final mastery",
 doneTitle: "Loop Learner ready",
 items: [
 {
 q: "Torch, room light, and lab kit all teach the same idea because…",
 opts: [
 "They need a closed path for current to light something",
 "They are unrelated magic tricks",
 "Only torches use loops",
 "Gaps are required for brightness",
 ],
 ok: 0,
 },
 {
 q: "A correct statement about an open switch is…",
 opts: [
 "It is a controlled gap - current stops until you close it",
 "It adds extra brightness automatically",
 "It turns the battery into wood",
 "It removes the need for a bulb",
 ],
 ok: 0,
 },
 {
 q: "Which belongs in “not a circuit part” here?",
 opts: ["Rubber eraser", "Battery", "Connected wire", "Bulb in the loop"],
 ok: 0,
 },
 ],
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "circuitMastery",
 badge: LAB_ASSET_PATHS.m1,
 html: `<h3>Mission 1 complete path</h3>
 <p>You earned the story arc from a desk kit to a reusable closed-loop rule. Use step dots to replay any weak spot. Press <strong>Next</strong> in the dock to claim <strong>Loop Learner</strong>.</p>`,
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
