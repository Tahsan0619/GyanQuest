/**
 * Artificial Intelligence - Mission 2: Pattern Predict (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
 mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
 mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L2_META = {
 objective: "By the end of this mission, you'll be able to explain see a pattern, predict the next piece in your own words.",
 bdHook: "Bangladesh everyday: notice see a pattern, predict the next piece around you - then connect it to Pattern Predict.",
 predict: {
 q: "Before we start - what do you think matters most in Pattern Predict?",
 options: [
 "Guessing without checking",
 "Looking for a clear pattern or rule",
 "Skipping the practice steps",
 ],
 ok: 1,
 },

 kidTitle: "Pattern Predict",
 theme: "see a pattern, predict the next piece",
 emoji: "\ud83d\udd2e",
 rewardName: "Pattern Pro",
 intro: "See a repeating pattern, then predict the next piece before it appears.",
 everyday: [
 "Bead necklace colors",
 "Traffic light order",
 "Class timetable blocks"
 ],
 subTitles: [
 "Meet Patterns",
 "Watch Predict Dial",
 "Sort Pattern Clues",
 "Stronger Predict Lab",
 "Why We Predict",
 "Name the Predict Rule",
 "Stretch: Places",
 "Myth Bust",
 "Fluency Drill",
 "Pattern Pro Mastery"
 ],
};

export function runL2Sub(subIndex, api) {
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
 setCoach("Hook: spot the repeat, then guess the next piece.");
 mountMotionChain(overlay, {
 title: "Meet Patterns",
 beats: [
 { scene: "predictMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000, html: `${badgeHtml(LAB_ASSET_PATHS.m2, "predict")}<p><strong>Act 1:</strong> Watch a short color sequence on the canvas.</p>` },
 { scene: "predictMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200, html: `<p><strong>Act 2:</strong> The repeat lights up - same order again.</p>` },
 { scene: "predictMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000, html: `<p><strong>Act 3:</strong> Predict the next piece before it shows.</p>` }
 ],
 onDone: () => mountQuiz(overlay, {
 scene: "predictMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
 q: "What should you do before naming the next piece?",
 opts: ["Find the repeating pattern first", "Guess randomly forever", "Ignore the sequence", "Only memorize one color"],
 ok: 0, onDone: () => mountTapContinue(overlay, {
 scene: "predictMeet", badge: LAB_ASSET_PATHS.m2,
 html: `<h3>Predict ready</h3><p>Next: dial prediction confidence.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 }),
 });
}

function s2({ overlay, setCoach, completeSub }) {
 setCoach("Raise prediction confidence to the goal zone.");
 labState.heat = 0.25;
 mountHeatLab(overlay, {
 scene: "predictLab", title: "Watch Predict Dial",
 html: `<p>Drag until prediction confidence &gt;= 60%.</p>`,
 goalText: "Goal >= 60%", doneLabel: "Dial checked", threshold: 0.6, startHeat: 0.25,
 axis: "x", canvasAction: "stretch", sliderLabel: "Confidence", badge: LAB_ASSET_PATHS.m2,
 onDone: completeSub,
 });
}

function s3({ overlay, setCoach, completeSub }) {
 setCoach("Sort true pattern clues vs noise vs tricky.");
 mountTapContinue(overlay, {
 scene: "predictSort",
 html: `<h3>Guide</h3><p><strong>Clue:</strong> repeat order, same gap, next-slot empty.<br><strong>Noise:</strong> random blot, one-off sticker.<br><strong>Tricky:</strong> almost-repeat with one twist.</p>`,
 onDone: () => mountDragSort(overlay, {
 scene: "predictSort", title: "Sort Pattern Clues",
 instructions: "Drag into Pattern clue / Noise / Tricky.",
 successText: "Pattern clues sorted!",
 chips: [
 { id: "rep", text: "Repeating order", short: "Repeat", color: 12616956 },
 { id: "gap", text: "Same gap each time", short: "Gap", color: 10980346 },
 { id: "next", text: "Empty next slot", short: "Next", color: 3718648 },
 { id: "blot", text: "Random blot", short: "Blot", color: 9741240 },
 { id: "once", text: "One-off sticker", short: "Once", color: 7893356 },
 { id: "twist", text: "Almost-repeat twist", short: "Twist", color: 16347926 },
 { id: "beat", text: "Steady beat count", short: "Beat", color: 2278750 },
 { id: "noise", text: "Static noise", short: "Noise", color: 6583435 }
 ],
 zones: [
 { id: "clue", label: "Pattern clue", accept: ["rep", "gap", "next", "beat"] },
 { id: "noise", label: "Noise", accept: ["blot", "once", "noise"] },
 { id: "tricky", label: "Tricky", accept: ["twist"] }
 ],
 onDone: completeSub,
 }),
 });
}

function s4({ overlay, setCoach, completeSub }) {
 setCoach("Push confidence higher for a sharper next-guess.");
 labState.heat = 0.4;
 mountHeatLab(overlay, {
 scene: "predictLab", title: "Stronger Predict Lab", html: `<p>Reach prediction confidence &gt;= 75%.</p>`,
 goalText: "Goal >= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
 axis: "x", canvasAction: "stretch", sliderLabel: "Confidence", badge: LAB_ASSET_PATHS.m2,
 onDone: completeSub,
 });
}

function s5({ overlay, setCoach, completeSub }) {
 setCoach("Order the predict path.");
 mountOrderSteps(overlay, {
 scene: "predictMeet", sceneArgs: { phase: "settle" }, title: "Why We Predict",
 instructions: "Order the story.",
 items: [
 { id: "see", html: "See the sequence" },
 { id: "find", html: "Find what repeats" },
 { id: "guess", html: "Predict the next piece" },
 { id: "check", html: "Check when it appears" }
 ],
 correctIds: ["see", "find", "guess", "check"],
 onDone: () => mountQuiz(overlay, {
 scene: "predictMeet", title: "Check",
 q: "A good prediction is based on...",
 opts: ["The repeating pattern you found", "A random lucky guess only", "Ignoring the sequence", "Deleting the next slot"],
 ok: 0, onDone: completeSub,
 }),
 });
}

function s6({ overlay, setCoach, completeSub }) {
 setCoach("Lock: see pattern -> predict next.");
 mountEquationBuild(overlay, {
 scene: "predictRule", title: "Name the Predict Rule", instructions: "Tap in order.",
 tokens: [ { id: "a", html: "See" }, { id: "b", html: "pattern" }, { id: "c", html: "->" }, { id: "d", html: "predict next" } ],
 correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
 onDone: () => mountTapContinue(overlay, {
 scene: "predictRule", badge: LAB_ASSET_PATHS.rule,
 html: `<h3>Rule locked</h3><p>See the pattern -> predict the next piece -> check.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 });
}

function s7({ overlay, setCoach, completeSub }) {
 setCoach("Beads, lights, timetable, shop queue, lab.");
 mountTapContinue(overlay, {
 scene: "predictStretch", html: `<h3>Places</h3><p>Tap each mode - same core idea.</p>`,
 onDone: () => mountQuiz(overlay, {
 scene: "predictStretch", title: "Transfer",
 q: "Traffic lights help you predict because...",
 opts: ["They follow a known order pattern", "They pick colors at random forever", "They hide the next light always", "They never repeat"],
 ok: 0, onDone: completeSub,
 }),
 });
}

function s8({ overlay, setCoach, completeSub }) {
 setCoach("Bust prediction myths.");
 mountMythCards(overlay, {
 scene: "predictMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
 myths: [
 { claim: "Predicting means you never need a pattern", truth: "Predictions ride on the repeating structure you noticed", sceneMyth: 0 },
 { claim: "One lucky guess equals mastery", truth: "Check against the real next piece", sceneMyth: 1 },
 { claim: "Noise is the same as a pattern clue", truth: "Noise does not reliably repeat", sceneMyth: 2 },
 { claim: "Only computers can predict sequences", truth: "Kids predict bead and light patterns every day", sceneMyth: 3 },
 { claim: "If you miss once, stop forever", truth: "Misses teach you to re-check the pattern", sceneMyth: 4 }
 ],
 onDone: completeSub,
 });
}

function s9({ overlay, setCoach, completeSub }) {
 setCoach("Quick predict fluency.");
 mountSpeedDrill(overlay, {
 scene: "predictDrill", title: "Fluency Drill", passScene: "predictMastery",
 items: [
 { q: "First step?", opts: ["Find pattern", "Ignore it"], ok: 0, prompt: "First?" },
 { q: "Predict means guess next?", opts: ["Yes", "No"], ok: 0, prompt: "Next?" },
 { q: "Is noise a reliable clue?", opts: ["No", "Yes"], ok: 0, prompt: "Noise?" },
 { q: "Should you check after?", opts: ["Yes", "Never"], ok: 0, prompt: "Check?" },
 { q: "Repeats help predict?", opts: ["Yes", "No"], ok: 0, prompt: "Repeat?" },
 { q: "Random blot = pattern?", opts: ["No", "Yes"], ok: 0, prompt: "Blot?" }
 ],
 onDone: completeSub,
 });
}

function s10({ overlay, setCoach, completeSub }) {
 setCoach("Mastery - Pattern Pro.");
 mountOrderSteps(overlay, {
 scene: "predictMastery", title: "Pattern Pro Mastery", instructions: "Order your journey.",
 items: [ { id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" }, { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "win", html: "Win" } ],
 correctIds: ["meet", "sort", "lab", "rule", "myth", "win"],
 onDone: () => mountTapContinue(overlay, {
 scene: "predictMastery", badge: LAB_ASSET_PATHS.m2,
 html: `<h3>\ud83d\udd2e Pattern Pro!</h3><p>You can spot a pattern and predict the next piece.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 });
}
