/**
 * Math Quest - Mission 1: Number Sense
 * 10 sub-levels, Bruner spiral: enactive -> iconic -> symbolic.
 * Target: 45-60 minutes. Accurate: tens, ones, place value (not chemistry).
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
 mountMultiQuiz,
 playScene,
 badgeHtml,
} from "./lab-activities.js";

export const L1_META = {
 objective: "By the end of this mission, you'll be able to explain tens & ones / place value in your own words.",
 bdHook:
 "Bangladesh everyday: egg cartons of 10, 10-taka notes, cricket scores - notice tens & ones, then connect it to Number Sense.",
 predict: {
 q: "Before we start - what mainly makes 23 different from 2 + 3?",
 options: [
 "Digits always add like 2 + 3 = 5",
 "Place names the value - 2 tens + 3 ones",
 "Only the ones digit matters",
 ],
 ok: 1,
 },

 kidTitle: "Number Sense",
 theme: "tens & ones / place value",
 emoji: "🔢",
 rewardName: "Number Scout",
 intro:
 "Numbers have places - tens and ones. A ten-rod is ten ones bundled together. We start with rods, cubes, and egg cartons - then name a place-value rule you can reuse anywhere.",
 everyday: ["Counting eggs in tens", "Reading a cricket score", "Making change with 10-taka notes"],
 subTitles: [
 "Meet Tens & Ones",
 "Build a Number",
 "Sort: Tens or Ones?",
 "Place Chart Lab",
 "Why Place Matters",
 "Name the Place Rule",
 "Stretch: BD Stories",
 "Myth Bust",
 "Fluency Drill",
 "Number Scout Mastery",
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
 labState.heat = 0.3;
 labState.scale = 0;
 labState.phase = "desk";
 labState.mode = "eggs";
 labState.tens = 2;
 labState.ones = 3;

 const runners = [
 sub1_meet,
 sub2_build,
 sub3_sort,
 sub4_chart,
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

function sub1_meet({ overlay, setCoach, completeSub }) {
 setCoach(
 "Hook + light enactive: drag a ten-rod, ones cubes, and an egg carton - then meet the place chart.",
 );
 mountMotionChain(overlay, {
 title: "Meet Tens & Ones",
 beats: [
 {
 scene: "numMeet",
 sceneArgs: { phase: "desk" },
 dwellMs: 4200,
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "number sense")}
 <p><strong>Act 1 - Counting tools:</strong> Drag the ten-rod, cubes, and egg carton on the canvas.</p>
 <p>A ten-rod is ten ones glued in a stick - not “just a longer cube.”</p>`,
 },
 {
 scene: "numMeet",
 sceneArgs: { phase: "glow" },
 dwellMs: 4500,
 html: `<p><strong>Act 2 - Place chart:</strong> Columns appear: <strong>TENS</strong> and <strong>ONES</strong>.</p>
 <p>Place is a name for value - where a digit sits changes what it is worth.</p>`,
 },
 {
 scene: "numMeet",
 sceneArgs: { phase: "group" },
 dwellMs: 3800,
 html: `<p><strong>Act 3 - Predict:</strong> If you see digit 2 and digit 3, is the total 2+3=5, or something bigger?</p>
 <p>Watch the chart and decide before we lock the big idea.</p>`,
 },
 {
 scene: "numMeet",
 sceneArgs: { phase: "settle" },
 dwellMs: 4200,
 html: `<p><strong>Act 4 - Big idea:</strong> 2 tens + 3 ones = <strong>23</strong>, not 2+3.</p>
 <p>Bundling ones into tens is how we write and read two-digit numbers.</p>`,
 },
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "numMeet",
 sceneArgs: { phase: "settle" },
 title: "Exit check",
 q: "In 23, the digit 2 stands for...",
 opts: [
 "2 tens (twenty)",
 "Just the number two",
 "2 ones",
 "Nothing - only 3 matters",
 ],
 ok: 0,
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "numMeet",
 sceneArgs: { phase: "settle" },
 badge: LAB_ASSET_PATHS.m1,
 html: `<h3>You met place value</h3><p>Next: build a number with the dial and tens/ones columns.</p>`,
 onDone: completeSub,
 advanceAfterDone: true,
 });
 },
 });
 },
 });
}

function sub2_build({ overlay, setCoach, completeSub }) {
 setCoach("Enactive lab: drag the build dial or tap TENS / ONES columns until the total reaches 25+.");
 labState.tens = 1;
 labState.ones = 5;
 labState.heat = 0.2;
 mountHeatLab(overlay, {
 scene: "numLab",
 title: "Build a Number",
 html: `<p>Use the slider, +/−, or drag the blue handle on the canvas. Tap the <strong>TENS</strong> or <strong>ONES</strong> chart boxes to nudge.</p>
 <p>Goal: make a number that is at least <strong>25</strong> by grouping tens and ones.</p>`,
 goalText: "Goal: total ≥ 25 (watch rods and cubes match the chart).",
 doneLabel: "Number built ▶",
 threshold: 0.35,
 startHeat: 0.2,
 axis: "x",
 canvasAction: "stretch",
 sliderLabel: "Build value",
 badge: LAB_ASSET_PATHS.m1,
 readoutLabels: {
 cold: "Small number - add tens",
 melting: "Growing...",
 liquid: "Near 25",
 simmer: "25+ - place value power!",
 },
 onDone: () => {
 mountQuiz(overlay, {
 scene: "numLab",
 title: "Check",
 q: "34 means...",
 opts: ["3 tens + 4 ones", "3 + 4", "34 ones only", "3 ones + 4 tens"],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
}

function sub3_sort({ overlay, setCoach, completeSub }) {
 setCoach("Enactive sort: tens stories, ones stories, or things that are not place value at all.");
 labState.reveal = false;
 mountTapContinue(overlay, {
 scene: "numSort",
 html: `<h3>Tens or ones?</h3>
 <p><strong>Tens:</strong> ten-rod, 2 rods, 10-taka note, bundle of 10 eggs.</p>
 <p><strong>Ones:</strong> single cube, 5 ones.</p>
 <p><strong>Not place value:</strong> letter A, blue color - they do not name a digit place.</p>`,
 onDone: () => {
 mountDragSort(overlay, {
 scene: "numSort",
 title: "Sort place-value stories",
 instructions: "Drag into Tens, Ones, or Not place value.",
 successText: "Sharp sort - tens vs ones!",
 chips: [
 { id: "rod", text: "One ten-rod", short: "Ten-rod", color: 0x0ea5e9 },
 { id: "cube", text: "One cube", short: "One", color: 0x38bdf8 },
 { id: "twenty", text: "2 ten-rods", short: "2 tens", color: 0x0284c7 },
 { id: "letter", text: "Letter A", short: "Letter", color: 0x94a3b8 },
 { id: "five", text: "5 ones", short: "5 ones", color: 0x7dd3fc },
 { id: "taka", text: "10-taka note", short: "10 taka", color: 0xfbbf24 },
 { id: "color", text: "Blue color", short: "Color", color: 0xa78bfa },
 { id: "bundle", text: "Bundle of 10 eggs", short: "10 eggs", color: 0xf59e0b },
 ],
 zones: [
 { id: "tens", label: "Tens (10s)", accept: ["rod", "twenty", "taka", "bundle"] },
 { id: "ones", label: "Ones (1s)", accept: ["cube", "five"] },
 { id: "not", label: "Not place value", accept: ["letter", "color"] },
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "numSort",
 title: "Justify",
 q: "Why is a 10-taka note a TENS story?",
 opts: [
 "It stands for one group of ten (like a ten-rod)",
 "Because it is yellow paper",
 "Because it is the letter T",
 "Because colors name place value",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function sub4_chart({ overlay, setCoach, completeSub }) {
 setCoach("Push the build higher - rods and cubes should match the place chart together.");
 labState.heat = 0.45;
 labState.tens = 2;
 labState.ones = 8;
 mountHeatLab(overlay, {
 scene: "numLab",
 title: "Place Chart Lab",
 html: `<p>Reach a clearer build (dial ≥ 70%). Notice rods (tens) and cubes (ones) update with the chart.</p>
 <p>Same idea as bundling eggs into tens for a market count.</p>`,
 goalText: "Goal: dial ≥ 70% and check that chart = blocks.",
 doneLabel: "Chart checked ▶",
 threshold: 0.7,
 startHeat: 0.45,
 axis: "x",
 canvasAction: "stretch",
 sliderLabel: "Build value",
 badge: LAB_ASSET_PATHS.m1,
 readoutLabels: {
 cold: "Low build - add tens",
 melting: "Chart updating...",
 liquid: "Strong tens showing",
 simmer: "Chart + blocks agree!",
 },
 onDone: () => {
 mountQuiz(overlay, {
 scene: "numLab",
 title: "Match check",
 q: "If the chart shows 4 tens and 2 ones, what did you build?",
 opts: ["42", "24", "6", "40"],
 ok: 0,
 onDone: () => {
 mountRevealSteps(overlay, {
 scene: "numLab",
 title: "Chart story",
 steps: [
 "Ones pile up as single cubes.",
 "Ten ones bundle into one ten-rod (or one 10-taka / egg decade).",
 "Write the count in columns: tens | ones.",
 "Read the total value from places - not by adding the digits as 4+2.",
 ],
 onStep: (i) => {
 const totals = [12, 20, 32, 42];
 const t = totals[Math.min(i, totals.length - 1)];
 labState.tens = Math.floor(t / 10);
 labState.ones = t % 10;
 labState.heat = Math.min(1, (t - 10) / 45);
 },
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function sub5_why({ overlay, setCoach, completeSub }) {
 setCoach("Order why place matters - then walk the compare story.");
 mountOrderSteps(overlay, {
 scene: "numMeet",
 sceneArgs: { phase: "settle" },
 title: "Why place matters",
 instructions: "Put the place-value story in order.",
 items: [
 { id: "bundle", html: "Bundle ones into tens" },
 { id: "columns", html: "Write tens | ones" },
 { id: "value", html: "Read the total value" },
 { id: "compare", html: "Compare 32 vs 23" },
 ],
 correctIds: ["bundle", "columns", "value", "compare"],
 onDone: () => {
 mountRevealSteps(overlay, {
 scene: "numMeet",
 sceneArgs: { phase: "settle" },
 title: "32 vs 23",
 steps: [
 "Same digits: 3 and 2.",
 "In 32, the 3 sits in tens (thirty); in 23, the 2 sits in tens (twenty).",
 "Place changes value - so 32 ≠ 23.",
 "Lesson: digits alone are not enough; place names the amount.",
 ],
 onStep: (i) => {
 if (i <= 1) {
 labState.tens = 3;
 labState.ones = 2;
 } else {
 labState.tens = 2;
 labState.ones = 3;
 }
 labState.phase = "settle";
 },
 onDone: () => {
 mountQuiz(overlay, {
 scene: "numMeet",
 sceneArgs: { phase: "settle" },
 title: "Check",
 q: "Why is 32 different from 23?",
 opts: [
 "Digits sit in different places (value changes)",
 "They use different ink",
 "32 is always odd",
 "Place never matters",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function sub6_rule({ overlay, setCoach, completeSub }) {
 setCoach("Symbolic: build the place-value rule, then scrub from ones → ten-rod → named place.");
 mountEquationBuild(overlay, {
 scene: "numRule",
 title: "Name the Place Rule",
 instructions: "Tap tokens in order to build the Number Sense rule.",
 tokens: [
 { id: "a", html: "10 ones" },
 { id: "b", html: "=" },
 { id: "c", html: "1 ten" },
 { id: "d", html: "· place names the value" },
 ],
 correctIds: ["a", "b", "c", "d"],
 badge: LAB_ASSET_PATHS.rule,
 onDone: () => {
 mountScaleLab(overlay, {
 scene: "numRule",
 title: "Place scrubber",
 html: `<p>Slide from loose ones → bundled ten-rod → place chart with a named value.</p>
 <p>The Number Sense rule: <strong>10 ones = 1 ten</strong>, and place tells what each digit is worth.</p>`,
 start: 0,
 threshold: 0.85,
 sliderLabel: "Place scale: ones → ten-rod → chart",
 goalText: "Left canvas follows: ones cubes → one ten → TENS|ONES chart.",
 readoutLabels: {
 low: "Loose ones (counting by 1)",
 mid: "Bundled into 1 ten-rod",
 high: "Place chart names the value",
 },
 onDone: () => {
 mountQuiz(overlay, {
 scene: "numRule",
 title: "Rule check",
 q: "What is the main Number Sense rule here?",
 opts: [
 "10 ones = 1 ten; place names each digit’s value",
 "Digits always add like 2+3=5 for 23",
 "Only ones matter in two-digit numbers",
 "Place is just decoration on a chart",
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
 setCoach("Transfer: same place-value idea in eggs, taka, cricket, bus seats, and beads.");
 const modes = [
 {
 mode: "eggs",
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "eggs")}<p><strong>Eggs:</strong> 25 eggs = 2 bundles of 10 + 5 ones - faster than counting one by one.</p>`,
 },
 {
 mode: "taka",
 html: `<p><strong>Taka:</strong> Two 10-taka notes + a 5 = 25 taka. Notes act like ten-rods.</p>`,
 },
 {
 mode: "cricket",
 html: `<p><strong>Cricket score:</strong> 25 runs - the scoreboard is already tens and ones.</p>`,
 },
 {
 mode: "bus",
 html: `<p><strong>Bus seats:</strong> Filling 25 seats - groups of ten help the conductor count fast.</p>`,
 },
 {
 mode: "beads",
 html: `<p><strong>Beads:</strong> Decade marks every 10 on a string - same bundling idea.</p>`,
 },
 ];
 let step = 0;

 function show() {
 if (step >= modes.length) {
 mountQuiz(overlay, {
 scene: "numStretch",
 sceneArgs: { mode: "eggs" },
 title: "Stretch check",
 q: "25 eggs as tens and ones is...",
 opts: ["2 tens + 5 ones", "25 tens", "5 tens + 2 ones", "Only ones"],
 ok: 0,
 onDone: completeSub,
 });
 return;
 }
 const m = modes[step];
 labState.mode = m.mode;
 labState.tens = 2;
 labState.ones = 5;
 mountTapContinue(overlay, {
 scene: "numStretch",
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
 scene: "numMyth",
 title: "Myth Bust",
 badge: LAB_ASSET_PATHS.myth,
 myths: [
 {
 sceneMyth: 0,
 title: "“23 means 2 + 3”",
 claim: "23 means 2 + 3",
 truth: "23 means 2 tens + 3 ones = 20 + 3",
 },
 {
 sceneMyth: 1,
 title: "“A ten-rod is just longer”",
 claim: "A ten-rod is just a longer one",
 truth: "A ten-rod stands for ten ones bundled",
 },
 {
 sceneMyth: 2,
 title: "“32 equals 23”",
 claim: "Place doesn’t matter - 32 = 23",
 truth: "Place changes value - 32 ≠ 23",
 },
 {
 sceneMyth: 3,
 title: "“Zero in ones is useless”",
 claim: "Zero in ones is useless",
 truth: "30 needs 0 to show 3 tens and no ones",
 },
 {
 sceneMyth: 4,
 title: "“Only school blocks teach this”",
 claim: "Only school blocks teach this",
 truth: "Eggs, taka, and scores use the same idea",
 },
 ],
 onDone: completeSub,
 });
}

function sub9_drill({ overlay, setCoach, completeSub }) {
 setCoach("Fluency: quick place-value checks. Need about 80% to unlock Continue.");
 mountSpeedDrill(overlay, {
 scene: "numDrill",
 passScene: "numMastery",
 passRatio: 0.8,
 items: [
 {
 prompt: "41",
 q: "In 41, the 4 means...",
 opts: ["4 tens", "4 ones", "41 tens", "Nothing"],
 ok: 0,
 tens: 4,
 ones: 1,
 },
 {
 prompt: "10 ones",
 q: "10 ones equal...",
 opts: ["1 ten", "10 tens", "0", "100"],
 ok: 0,
 tens: 1,
 ones: 0,
 },
 {
 prompt: "23 vs 32",
 q: "Is 23 the same as 32?",
 opts: ["No", "Yes"],
 ok: 0,
 tens: 2,
 ones: 3,
 },
 {
 prompt: "Taka",
 q: "A 10-taka note is like...",
 opts: ["1 ten", "1 one", "10 tens", "A letter"],
 ok: 0,
 tens: 1,
 ones: 0,
 },
 {
 prompt: "70",
 q: "In 70, the 0 means...",
 opts: ["0 ones (no ones)", "Delete the 7", "70 ones only", "Error"],
 ok: 0,
 tens: 7,
 ones: 0,
 },
 {
 prompt: "2 rods",
 q: "2 ten-rods show...",
 opts: ["20", "2", "12", "200"],
 ok: 0,
 tens: 2,
 ones: 0,
 },
 {
 prompt: "Place rule",
 q: "Best Number Sense rule?",
 opts: [
 "Place names digit value (10 ones = 1 ten)",
 "Digits always add as 2+3 for 23",
 "Zeros never matter",
 "Only rods count, never ones",
 ],
 ok: 0,
 tens: 2,
 ones: 3,
 },
 {
 prompt: "Eggs 25",
 q: "25 eggs as tens and ones?",
 opts: ["2 tens + 5 ones", "5 tens + 2 ones", "25 tens", "7 ones"],
 ok: 0,
 tens: 2,
 ones: 5,
 },
 ],
 onDone: completeSub,
 });
}

function sub10_mastery({ overlay, setCoach, completeSub }) {
 setCoach("Mastery: rebuild the path, transfer to a market + cricket case, then prove it.");
 playScene("numMastery");
 mountOrderSteps(overlay, {
 scene: "numMastery",
 title: "Number Scout Mastery - learning path",
 instructions: "Tap Bruner order: meet → sort → lab/chart → rule → stretch/myths.",
 items: [
 { id: "1", html: "Meet rods & ones (concrete)" },
 { id: "2", html: "Sort tens vs ones vs not" },
 { id: "3", html: "Build / chart lab (do it)" },
 { id: "4", html: "Name the place rule" },
 { id: "5", html: "Stretch + bust myths" },
 ],
 correctIds: ["1", "2", "3", "4", "5"],
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "numMastery",
 html: `<h3>Mixed case</h3>
 <p><strong>Market eggs + cricket board:</strong> 2 bundles of 10 eggs + 5 loose = 25; a score of 25 is the same tens|ones idea on a board.</p>
 <p>Ready for the final checks?</p>`,
 onDone: () => {
 mountMultiQuiz(overlay, {
 scene: "numMastery",
 title: "Final mastery",
 doneTitle: "Number Scout ready",
 items: [
 {
 q: "Eggs, taka notes, and cricket scores all teach the same idea because...",
 opts: [
 "They all use tens and ones (place value)",
 "They are unrelated magic tricks",
 "Only school rods have place value",
 "Place only matters for letters",
 ],
 ok: 0,
 },
 {
 q: "A correct statement about 10 ones is...",
 opts: [
 "10 ones bundle into 1 ten; place names the value",
 "10 ones always write as 010",
 "Ones and tens mean the same amount",
 "Zeros delete the tens digit",
 ],
 ok: 0,
 },
 {
 q: "Which is NOT a place-value story?",
 opts: ["The color blue", "A 10-taka note", "Two ten-rods", "5 ones cubes"],
 ok: 0,
 },
 ],
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "numMastery",
 badge: LAB_ASSET_PATHS.m1,
 html: `<h3>Mission 1 complete path</h3>
 <p>You earned the arc from concrete rods to a reusable place-value rule. Use step dots to replay any weak spot. Press <strong>Next</strong> in the dock to claim <strong>Number Scout</strong>.</p>`,
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
