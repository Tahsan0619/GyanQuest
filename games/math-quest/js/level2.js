/**
 * Math Quest - Mission 2: Fraction Friends (deepened)
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
 badgeHtml,
} from "./lab-activities.js";

export const L2_META = {
 objective: "By the end of this mission, you'll be able to explain equal shares / parts of a whole in your own words.",
 bdHook: "Bangladesh everyday: notice equal shares / parts of a whole around you - then connect it to Fraction Friends.",
 predict: {
 q: "Before we start - what do you think matters most in Fraction Friends?",
 options: [
 "Guessing without checking",
 "Looking for a clear pattern or rule",
 "Skipping the practice steps",
 ],
 ok: 1,
 },

 kidTitle: "Fraction Friends",
 theme: "equal shares / parts of a whole",
 emoji: "🍕",
 rewardName: "Fraction Friend",
 intro: "Fractions name fair shares - equal parts of one whole. Halves, thirds, fourths.",
 everyday: ["Sharing roti", "Chocolate bar squares", "Half an hour on the clock"],
 subTitles: [
 "Meet Fair Shares",
 "Shade the Whole",
 "Sort: Equal or Not?",
 "Parts Lab",
 "Name Numerator & Denominator",
 "Name the Fraction Rule",
 "Stretch: BD Stories",
 "Myth Bust",
 "Fluency Drill",
 "Fraction Friend Mastery",
 ],
};

export function runL2Sub(subIndex, api) {
 const { registerTryAgain } = api;
 labState.reveal = false;
 labState.tokenProgress = 0;
 labState.masteryStep = 0;
 labState.placed = {};
 labState.selectedId = null;
 labState.mythPhase = "claim";
 labState.heat = 0.25;
 labState.phase = "desk";
 labState.mode = "roti";
 labState.fracParts = 2;
 labState.fracShaded = 1;

 const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => {
 api.overlay.innerHTML = "";
 fn(api);
 });
 fn(api);
}

function s1({ overlay, setCoach, completeSub }) {
 setCoach("Hook: a fraction is a fair share of one whole.");
 mountMotionChain(overlay, {
 title: "Meet Fair Shares",
 beats: [
 {
 scene: "fracMeet",
 sceneArgs: { phase: "desk" },
 dwellMs: 4000,
 html: `${badgeHtml(LAB_ASSET_PATHS.m2, "fractions")}
 <p><strong>Act 1:</strong> Whole pizza/roti vs ready-to-share circle.</p>`,
 },
 {
 scene: "fracMeet",
 sceneArgs: { phase: "split" },
 dwellMs: 4200,
 html: `<p><strong>Act 2:</strong> Tap to shade equal parts - fair pieces.</p>`,
 },
 {
 scene: "fracMeet",
 sceneArgs: { phase: "settle" },
 dwellMs: 4000,
 html: `<p><strong>Act 3:</strong> Big idea - <strong>numerator / denominator</strong> (shaded / equal parts).</p>`,
 },
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "fracMeet",
 sceneArgs: { phase: "settle" },
 title: "Exit check",
 q: "For a fair fraction, the parts must be...",
 opts: ["Equal in size", "Any random sizes", "Only circles", "Always more than half"],
 ok: 0,
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "fracMeet",
 badge: LAB_ASSET_PATHS.m2,
 html: `<h3>Fair shares unlocked</h3><p>Next: shade a goal fraction on the dial.</p>`,
 onDone: completeSub,
 advanceAfterDone: true,
 });
 },
 });
 },
 });
}

function s2({ overlay, setCoach, completeSub }) {
 setCoach("Shade until you reach half or more of the whole.");
 labState.fracParts = 4;
 labState.fracShaded = 1;
 labState.heat = 0.25;
 mountHeatLab(overlay, {
 scene: "fracLab",
 title: "Shade the Whole",
 html: `<p>Pick /2 /3 /4, then drag to shade. Goal: shade ≥ half (dial ≥ 50%).</p>`,
 goalText: "Goal: shade ≥ 1/2",
 doneLabel: "Half reached",
 threshold: 0.5,
 startHeat: 0.25,
 axis: "x",
 canvasAction: "stretch",
 sliderLabel: "Shade",
 badge: LAB_ASSET_PATHS.m2,
 readoutLabels: {
 cold: "Small share",
 melting: "Growing shade",
 liquid: "Near half",
 simmer: "Half or more - fair share!",
 },
 onDone: completeSub,
 });
}

function s3({ overlay, setCoach, completeSub }) {
 setCoach("Sort equal shares vs uneven cuts vs not fractions.");
 mountTapContinue(overlay, {
 scene: "fracSort",
 html: `<h3>Equal or not?</h3>
 <p><strong>Equal:</strong> 1/2, 1/3, 1/4, 2/4, whole.</p>
 <p><strong>Unequal:</strong> jagged uneven split.</p>
 <p><strong>Not:</strong> color, letter.</p>`,
 onDone: () => {
 mountDragSort(overlay, {
 scene: "fracSort",
 title: "Sort fraction stories",
 instructions: "Drag into Equal / Unequal / Not a fraction.",
 successText: "Fair-share sorting!",
 chips: [
 { id: "half", text: "1/2 pizza", short: "1/2", color: 0xfb923c },
 { id: "third", text: "1/3 roti", short: "1/3", color: 0xf59e0b },
 { id: "jagged", text: "Uneven split", short: "Uneven", color: 0xf87171 },
 { id: "fourth", text: "1/4 bar", short: "1/4", color: 0xfdba74 },
 { id: "whole", text: "Whole cake", short: "Whole", color: 0xfbbf24 },
 { id: "color", text: "Red color", short: "Color", color: 0x94a3b8 },
 { id: "twofour", text: "2/4 = half?", short: "2/4", color: 0xf97316 },
 { id: "letter", text: "Letter F", short: "Letter", color: 0x78716c },
 ],
 zones: [
 { id: "equal", label: "Equal shares", accept: ["half", "third", "fourth", "twofour", "whole"] },
 { id: "unequal", label: "Unequal cut", accept: ["jagged"] },
 { id: "not", label: "Not a fraction", accept: ["color", "letter"] },
 ],
 onDone: completeSub,
 });
 },
 });
}

function s4({ overlay, setCoach, completeSub }) {
 setCoach("Parts lab - try thirds and fourths.");
 labState.fracParts = 3;
 labState.fracShaded = 1;
 labState.heat = 0.33;
 mountHeatLab(overlay, {
 scene: "fracLab",
 title: "Parts Lab",
 html: `<p>Switch to /3 or /4. Shade at least 2 parts (dial high enough).</p>`,
 goalText: "Goal: dial ≥ 65%",
 doneLabel: "Parts checked",
 threshold: 0.65,
 startHeat: 0.33,
 axis: "x",
 canvasAction: "stretch",
 sliderLabel: "Shade",
 badge: LAB_ASSET_PATHS.m2,
 onDone: () => {
 mountQuiz(overlay, {
 scene: "fracLab",
 title: "Check",
 q: "In 3/4, the 4 (denominator) tells...",
 opts: ["How many equal parts the whole is cut into", "How many you eat only", "The pizza brand", "Nothing"],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
}

function s5({ overlay, setCoach, completeSub }) {
 setCoach("Order numerator and denominator meaning.");
 mountOrderSteps(overlay, {
 scene: "fracMeet",
 sceneArgs: { phase: "settle" },
 title: "Name the parts",
 instructions: "Order how we read a fraction.",
 items: [
 { id: "whole", html: "Start with one whole" },
 { id: "cut", html: "Cut into equal parts" },
 { id: "den", html: "Denominator = count of parts" },
 { id: "num", html: "Numerator = parts we take" },
 ],
 correctIds: ["whole", "cut", "den", "num"],
 onDone: completeSub,
 });
}

function s6({ overlay, setCoach, completeSub }) {
 setCoach("Lock the fraction rule.");
 mountEquationBuild(overlay, {
 scene: "fracRule",
 title: "Name the Fraction Rule",
 instructions: "Tap tokens in order.",
 tokens: [
 { id: "a", html: "equal" },
 { id: "b", html: "parts" },
 { id: "c", html: "->" },
 { id: "d", html: "fraction" },
 ],
 correctIds: ["a", "b", "c", "d"],
 badge: LAB_ASSET_PATHS.rule,
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "fracRule",
 badge: LAB_ASSET_PATHS.rule,
 html: `<h3>Rule locked</h3><p>Equal parts make a fraction - numerator over denominator.</p>`,
 onDone: completeSub,
 advanceAfterDone: true,
 });
 },
 });
}

function s7({ overlay, setCoach, completeSub }) {
 setCoach("Roti, chocolate, class, field, time.");
 mountTapContinue(overlay, {
 scene: "fracStretch",
 html: `<h3>Stretch</h3><p>Tap roti, chocolate, class, field, time.</p>`,
 onDone: () => {
 mountQuiz(overlay, {
 scene: "fracStretch",
 title: "Transfer",
 q: "Half an hour is...",
 opts: ["1/2 of an hour", "2 hours", "Only for pizza", "Unequal minutes"],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
}

function s8({ overlay, setCoach, completeSub }) {
 setCoach("Bust fraction myths.");
 mountMythCards(overlay, {
 scene: "fracMyth",
 title: "Myth Bust",
 badge: LAB_ASSET_PATHS.myth,
 myths: [
 { claim: "Bigger denominator means bigger piece", truth: "More parts -> each piece is smaller", sceneMyth: 0 },
 { claim: "Any cut is a fair fraction", truth: "Fractions need equal parts", sceneMyth: 1 },
 { claim: "1/2 is always more pizza than 1/3", truth: "Compare only when wholes match", sceneMyth: 2 },
 { claim: "2/4 is forever different from 1/2", truth: "Same share of the same whole", sceneMyth: 3 },
 { claim: "Fractions are only for pizza", truth: "Roti, time, class groups - same idea", sceneMyth: 4 },
 ],
 onDone: completeSub,
 });
}

function s9({ overlay, setCoach, completeSub }) {
 setCoach("Quick fraction fluency.");
 mountSpeedDrill(overlay, {
 scene: "fracDrill",
 title: "Fluency Drill",
 passScene: "fracMastery",
 items: [
 { q: "Must fraction parts be equal?", opts: ["Yes", "No"], ok: 0, prompt: "Equal?" },
 { q: "In 1/4, the 1 is the...", opts: ["Numerator", "Denominator"], ok: 0, prompt: "1/4" },
 { q: "Is an uneven cut a fair fraction?", opts: ["No", "Yes"], ok: 0, prompt: "Uneven" },
 { q: "2/4 of the same pizza equals...", opts: ["1/2", "2", "4/2", "0"], ok: 0, prompt: "2/4" },
 { q: "Which is smaller of the same whole: 1/2 or 1/8?", opts: ["1/8", "1/2"], ok: 0, prompt: "Compare" },
 { q: "Can time use fractions?", opts: ["Yes", "No"], ok: 0, prompt: "Time" },
 ],
 onDone: completeSub,
 });
}

function s10({ overlay, setCoach, completeSub }) {
 setCoach("Mastery - Fraction Friend.");
 mountOrderSteps(overlay, {
 scene: "fracMastery",
 title: "Fraction Friend Mastery",
 instructions: "Order your Fraction Friends journey.",
 items: [
 { id: "meet", html: "Meet" },
 { id: "sort", html: "Sort" },
 { id: "lab", html: "Lab" },
 { id: "rule", html: "Rule" },
 { id: "myth", html: "Myth" },
 { id: "friend", html: "Friend" },
 ],
 correctIds: ["meet", "sort", "lab", "rule", "myth", "friend"],
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "fracMastery",
 badge: LAB_ASSET_PATHS.m2,
 html: `<h3>🍕 Fraction Friend!</h3><p>You can name equal shares - halves, thirds, fourths.</p>`,
 onDone: completeSub,
 advanceAfterDone: true,
 });
 },
 });
}
