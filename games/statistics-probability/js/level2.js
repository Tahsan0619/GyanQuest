/**
 * Statistics & Probability - Mission 2: Chance Games (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
 mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
 mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L2_META = {
 objective: "By the end of this mission, you'll be able to explain probability / fair shares of outcomes in your own words.",
 bdHook: "Bangladesh everyday: notice probability / fair shares of outcomes around you - then connect it to Chance Games.",
 predict: {
 q: "Before we start - what do you think matters most in Chance Games?",
 options: [
 "Guessing without checking",
 "Looking for a clear pattern or rule",
 "Skipping the practice steps",
 ],
 ok: 1,
 },

 kidTitle: "Chance Games",
 theme: "probability / fair shares of outcomes",
 emoji: "\u1f3af",
 rewardName: "Chance Champ",
 intro: "Probability is a fair share of outcomes. A fair coin is 1/2 heads; a fair die gives each face an equal shot.",
 everyday: ["Cricket toss coin", "Board-game die", "Spinner at a fun fair"],
 subTitles: [
 "Meet Chance Tools",
 "Fair Share Dial",
 "Sort: Likely, Unlikely, Impossible",
 "Trial Lab",
 "Why Probability is a Share",
 "Name the Chance Rule",
 "Stretch: BD Chance Stories",
 "Myth Bust",
 "Fluency Drill",
 "Chance Champ Mastery",
 ],
};

export function runL2Sub(subIndex, api) {
 const { registerTryAgain } = api;
 labState.reveal = false; labState.tokenProgress = 0; labState.masteryStep = 0;
 labState.placed = {}; labState.selectedId = null; labState.mythPhase = "claim";
 labState.heat = 0.25; labState.phase = "desk"; labState.mode = "toss";
 labState.coinBias = 0.5; labState.dieFace = 1; labState.trials = 0;
 const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => { api.overlay.innerHTML = ""; fn(api); });
 fn(api);
}

function s1({ overlay, setCoach, completeSub }) {
 setCoach("Hook: coin, die, spinner - chance as a share.");
 mountMotionChain(overlay, {
 title: "Meet Chance Tools",
 beats: [
 {
 scene: "chanceMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000,
 html: `${badgeHtml(LAB_ASSET_PATHS.m2, "chance")}
 <p><strong>Act 1:</strong> Drag the coin, die, and spinner - tools of chance.</p>`,
 },
 {
 scene: "chanceMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200,
 html: `<p><strong>Act 2:</strong> Fair tools split outcomes evenly - coin 1/2, die 1/6.</p>`,
 },
 {
 scene: "chanceMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000,
 html: `<p><strong>Act 3:</strong> Probability = favorable / possible (a share).</p>`,
 },
 ],
 onDone: () => mountQuiz(overlay, {
 scene: "chanceMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
 q: "Fair coin - P(heads) is\u2026",
 opts: ["1/2", "1/6", "Always 1", "Zero forever"],
 ok: 0,
 onDone: () => mountTapContinue(overlay, {
 scene: "chanceMeet", badge: LAB_ASSET_PATHS.m2,
 html: `<h3>Chance tools ready</h3><p>Next: dial a fair share.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 }),
 });
}

function s2({ overlay, setCoach, completeSub }) {
 setCoach("Dial toward a fair 50-50 coin share.");
 labState.heat = 0.25; labState.coinBias = 0.5;
 mountHeatLab(overlay, {
 scene: "chanceLab", title: "Fair Share Dial",
 html: `<p>Drag until fairness clarity \u2265 60% (near a fair coin).</p>`,
 goalText: "Goal \u2265 60%", doneLabel: "Fair checked", threshold: 0.6, startHeat: 0.25,
 axis: "x", canvasAction: "stretch", sliderLabel: "Fairness", badge: LAB_ASSET_PATHS.m2,
 readoutLabels: {
 cold: "Biased - push toward fair",
 melting: "Getting fairer\u2026",
 liquid: "Near 50-50",
 simmer: "Fair share - equal chance!",
 },
 onDone: completeSub,
 });
}

function s3({ overlay, setCoach, completeSub }) {
 setCoach("Sort events by how likely they are.");
 mountTapContinue(overlay, {
 scene: "chanceSort",
 html: `<h3>Likely, unlikely, impossible?</h3>
 <p><strong>Likely:</strong> fair coin heads, die shows a number 1-6.</p>
 <p><strong>Unlikely:</strong> die shows 6 twice in a row (harder).</p>
 <p><strong>Impossible:</strong> die shows 7, coin shows both sides at once.</p>`,
 onDone: () => mountDragSort(overlay, {
 scene: "chanceSort", title: "Sort: Likely / Unlikely / Impossible",
 instructions: "Drag each event into the right bin.",
 successText: "Chance sorted!",
 chips: [
 { id: "heads", text: "Fair coin heads", short: "Heads", color: 0xfbbf24 },
 { id: "six", text: "Die shows 6", short: "Six", color: 0xf59e0b },
 { id: "seven", text: "Die shows 7", short: "Seven", color: 0xef4444 },
 { id: "both", text: "Coin both sides", short: "Both", color: 0xf87171 },
 { id: "any", text: "Die any of 1-6", short: "Any face", color: 0xfde68a },
 { id: "dbl", text: "Two sixes in a row", short: "2 sixes", color: 0xf97316 },
 { id: "rain", text: "Rain tomorrow maybe", short: "Maybe rain", color: 0xd97706 },
 { id: "neg", text: "Negative die face", short: "Neg face", color: 0x94a3b8 },
 ],
 zones: [
 { id: "likely", label: "Likely / possible", accept: ["heads", "six", "any", "rain"] },
 { id: "unlikely", label: "Unlikely", accept: ["dbl"] },
 { id: "impossible", label: "Impossible", accept: ["seven", "both", "neg"] },
 ],
 onDone: completeSub,
 }),
 });
}

function s4({ overlay, setCoach, completeSub }) {
 setCoach("Run more trials - watch the share settle.");
 labState.heat = 0.4;
 mountHeatLab(overlay, {
 scene: "chanceLab", title: "Trial Lab",
 html: `<p>Push trials clarity \u2265 75% - more trials, clearer share.</p>`,
 goalText: "Goal \u2265 75%", doneLabel: "Trials done", threshold: 0.75, startHeat: 0.4,
 axis: "x", canvasAction: "stretch", sliderLabel: "Trials", badge: LAB_ASSET_PATHS.m2,
 onDone: completeSub,
 });
}

function s5({ overlay, setCoach, completeSub }) {
 setCoach("Order why probability is a share.");
 mountOrderSteps(overlay, {
 scene: "chanceMeet", sceneArgs: { phase: "settle" }, title: "Why Probability is a Share",
 instructions: "Order the chance story.",
 items: [
 { id: "list", html: "List possible outcomes" },
 { id: "fair", html: "Check if each outcome is equal" },
 { id: "count", html: "Count favorable outcomes" },
 { id: "share", html: "Write share favorable / possible" },
 ],
 correctIds: ["list", "fair", "count", "share"],
 onDone: () => mountQuiz(overlay, {
 scene: "chanceMeet", title: "Check",
 q: "Fair die - P(rolling a 4) is\u2026",
 opts: ["1/6", "1/2", "4/6", "1"],
 ok: 0, onDone: completeSub,
 }),
 });
}

function s6({ overlay, setCoach, completeSub }) {
 setCoach("Lock the chance rule.");
 mountEquationBuild(overlay, {
 scene: "chanceRule", title: "Name the Chance Rule", instructions: "Tap in order.",
 tokens: [
 { id: "a", html: "Favorable" }, { id: "b", html: "/" },
 { id: "c", html: "Possible" }, { id: "d", html: "= P" },
 ],
 correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
 onDone: () => mountTapContinue(overlay, {
 scene: "chanceRule", badge: LAB_ASSET_PATHS.rule,
 html: `<h3>Rule locked</h3><p>P = favorable / possible. Fair tools give equal shares.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 });
}

function s7({ overlay, setCoach, completeSub }) {
 setCoach("Toss, ludo, spinner, weather, queue - same idea.");
 mountTapContinue(overlay, {
 scene: "chanceStretch",
 html: `<h3>Bangladesh chance stretch</h3><p>Tap: toss, ludo, spinner, weather, queue.</p>`,
 onDone: () => mountQuiz(overlay, {
 scene: "chanceStretch", title: "Transfer",
 q: "Cricket toss with a fair coin - P(your call wins)?",
 opts: ["About 1/2", "Always 1", "Always 0", "1/6"],
 ok: 0, onDone: completeSub,
 }),
 });
}

function s8({ overlay, setCoach, completeSub }) {
 setCoach("Bust chance myths.");
 mountMythCards(overlay, {
 scene: "chanceMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
 myths: [
 { claim: "After five heads, tails is 'due'", truth: "Fair coin has no memory - still about 1/2", sceneMyth: 0 },
 { claim: "Probability can be bigger than 1", truth: "A share stays between 0 and 1", sceneMyth: 1 },
 { claim: "Die face 7 is just unlikely", truth: "Face 7 is impossible on a standard die", sceneMyth: 2 },
 { claim: "More trials never help", truth: "More fair trials usually settle closer to the true share", sceneMyth: 3 },
 { claim: "Only casinos use probability", truth: "Tosses, games, and weather all use chance ideas", sceneMyth: 4 },
 ],
 onDone: completeSub,
 });
}

function s9({ overlay, setCoach, completeSub }) {
 setCoach("Quick chance fluency.");
 mountSpeedDrill(overlay, {
 scene: "chanceDrill", title: "Fluency Drill", passScene: "chanceMastery",
 items: [
 { q: "Fair coin P(heads)?", opts: ["1/2", "1/6", "1", "0"], ok: 0, prompt: "Coin" },
 { q: "Fair die P(5)?", opts: ["1/6", "1/2", "5/6", "1"], ok: 0, prompt: "Die" },
 { q: "Die shows 7?", opts: ["Impossible", "Likely", "Certain", "1/2"], ok: 0, prompt: "Seven" },
 { q: "P = ?", opts: ["Favorable / possible", "Possible / favorable", "Always 2", "Color"], ok: 0, prompt: "Rule" },
 { q: "Coin 'due' after heads?", opts: ["No memory", "Yes due"], ok: 0, prompt: "Due?" },
 { q: "P can be 2?", opts: ["No", "Yes"], ok: 0, prompt: "P>1?" },
 ],
 onDone: completeSub,
 });
}

function s10({ overlay, setCoach, completeSub }) {
 setCoach("Mastery - Chance Champ.");
 mountOrderSteps(overlay, {
 scene: "chanceMastery", title: "Chance Champ Mastery", instructions: "Order your journey.",
 items: [
 { id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" },
 { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "champ", html: "Champ" },
 ],
 correctIds: ["meet", "sort", "lab", "rule", "myth", "champ"],
 onDone: () => mountTapContinue(overlay, {
 scene: "chanceMastery", badge: LAB_ASSET_PATHS.m2,
 html: `<h3>\u1f3af Chance Champ!</h3><p>You can read fair shares on coins, dice, and spinners.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 });
}
