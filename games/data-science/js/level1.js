/**
 * Data Science - Mission 1: Chart Stories (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
 mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
 mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L1_META = {
 objective: "By the end of this mission, you'll be able to explain bars and lines turn numbers into stories in your own words.",
 bdHook: "Bangladesh everyday: notice bars and lines turn numbers into stories around you - then connect it to Chart Stories.",
 predict: {
 q: "Before we start - what do you think matters most in Chart Stories?",
 options: [
 "Guessing without checking",
 "Looking for a clear pattern or rule",
 "Skipping the practice steps",
 ],
 ok: 1,
 },

 kidTitle: "Chart Stories",
 theme: "bars and lines turn numbers into stories",
 emoji: "\ud83d\udcca",
 rewardName: "Chart Scout",
 intro: "Charts turn piles of numbers into a story you can see - compare bars, follow lines.",
 everyday: [
 "Class marks bar chart",
 "Rainfall line",
 "Shop sales bars"
 ],
 subTitles: [
 "Meet Charts",
 "Watch Story Dial",
 "Sort Chart Parts",
 "Clearer Chart Lab",
 "Why Charts Help",
 "Name the Chart Rule",
 "Stretch: Places",
 "Myth Bust",
 "Fluency Drill",
 "Chart Scout Mastery"
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
 setCoach("Hook: numbers become bars and lines you can read.");
 mountMotionChain(overlay, {
 title: "Meet Charts",
 beats: [
 { scene: "chartMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000, html: `${badgeHtml(LAB_ASSET_PATHS.m1, "chart")}<p><strong>Act 1:</strong> Meet a pile of scores - hard to compare by eye.</p>` },
 { scene: "chartMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200, html: `<p><strong>Act 2:</strong> Bars rise - taller means more.</p>` },
 { scene: "chartMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000, html: `<p><strong>Act 3:</strong> Read the story: who scored highest?</p>` }
 ],
 onDone: () => mountQuiz(overlay, {
 scene: "chartMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
 q: "What do charts mainly help you do?",
 opts: ["See number stories quickly", "Hide all the numbers forever", "Replace measuring tools", "Delete the title always"],
 ok: 0, onDone: () => mountTapContinue(overlay, {
 scene: "chartMeet", badge: LAB_ASSET_PATHS.m1,
 html: `<h3>Chart ready</h3><p>Next: dial chart clarity.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 }),
 });
}

function s2({ overlay, setCoach, completeSub }) {
 setCoach("Raise chart clarity until the story pops.");
 labState.heat = 0.25;
 mountHeatLab(overlay, {
 scene: "chartLab", title: "Watch Story Dial",
 html: `<p>Drag until chart clarity &gt;= 60%.</p>`,
 goalText: "Goal >= 60%", doneLabel: "Dial checked", threshold: 0.6, startHeat: 0.25,
 axis: "x", canvasAction: "stretch", sliderLabel: "Clarity", badge: LAB_ASSET_PATHS.m1,
 onDone: completeSub,
 });
}

function s3({ overlay, setCoach, completeSub }) {
 setCoach("Sort title/axis/bars vs junk vs tricky.");
 mountTapContinue(overlay, {
 scene: "chartSort",
 html: `<h3>Guide</h3><p><strong>Parts:</strong> title, axes, bars/points.<br><strong>Junk:</strong> random doodle, blank box.<br><strong>Tricky:</strong> chart with no labels.</p>`,
 onDone: () => mountDragSort(overlay, {
 scene: "chartSort", title: "Sort Chart Parts",
 instructions: "Drag into Chart part / Junk / Tricky.",
 successText: "Chart parts sorted!",
 chips: [
 { id: "title", text: "Chart title", short: "Title", color: 2282478 },
 { id: "xaxis", text: "X-axis labels", short: "X-axis", color: 3718648 },
 { id: "yaxis", text: "Y-axis scale", short: "Y-axis", color: 959977 },
 { id: "bars", text: "Bars or points", short: "Bars", color: 2278750 },
 { id: "doodle", text: "Random doodle", short: "Doodle", color: 9741240 },
 { id: "blank", text: "Blank box", short: "Blank", color: 7893356 },
 { id: "nolab", text: "No-label chart", short: "No label", color: 16347926 },
 { id: "legend", text: "Legend key", short: "Legend", color: 10980346 }
 ],
 zones: [
 { id: "part", label: "Chart part", accept: ["title", "xaxis", "yaxis", "bars", "legend"] },
 { id: "junk", label: "Junk", accept: ["doodle", "blank"] },
 { id: "tricky", label: "Tricky", accept: ["nolab"] }
 ],
 onDone: completeSub,
 }),
 });
}

function s4({ overlay, setCoach, completeSub }) {
 setCoach("Push clarity for a cleaner story.");
 labState.heat = 0.4;
 mountHeatLab(overlay, {
 scene: "chartLab", title: "Clearer Chart Lab", html: `<p>Reach chart clarity &gt;= 75%.</p>`,
 goalText: "Goal >= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
 axis: "x", canvasAction: "stretch", sliderLabel: "Clarity", badge: LAB_ASSET_PATHS.m1,
 onDone: completeSub,
 });
}

function s5({ overlay, setCoach, completeSub }) {
 setCoach("Order how a chart story is built.");
 mountOrderSteps(overlay, {
 scene: "chartMeet", sceneArgs: { phase: "settle" }, title: "Why Charts Help",
 instructions: "Order the story.",
 items: [
 { id: "ask", html: "Ask what to compare" },
 { id: "pick", html: "Pick a chart type" },
 { id: "label", html: "Add clear labels" },
 { id: "read", html: "Read the story aloud" }
 ],
 correctIds: ["ask", "pick", "label", "read"],
 onDone: () => mountQuiz(overlay, {
 scene: "chartMeet", title: "Check",
 q: "A chart without labels is hard because...",
 opts: ["You cannot tell what the numbers mean", "It always tells a perfect story", "Labels are never useful", "Bars cannot show amounts"],
 ok: 0, onDone: completeSub,
 }),
 });
}

function s6({ overlay, setCoach, completeSub }) {
 setCoach("Lock: charts show number stories.");
 mountEquationBuild(overlay, {
 scene: "chartRule", title: "Name the Chart Rule", instructions: "Tap in order.",
 tokens: [ { id: "a", html: "Charts" }, { id: "b", html: "show" }, { id: "c", html: "number" }, { id: "d", html: "stories" } ],
 correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
 onDone: () => mountTapContinue(overlay, {
 scene: "chartRule", badge: LAB_ASSET_PATHS.rule,
 html: `<h3>Rule locked</h3><p>Charts show number stories you can see and compare.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 });
}

function s7({ overlay, setCoach, completeSub }) {
 setCoach("Class, weather, shop, BD market, lab.");
 mountTapContinue(overlay, {
 scene: "chartStretch", html: `<h3>Places</h3><p>Tap each mode - same core idea.</p>`,
 onDone: () => mountQuiz(overlay, {
 scene: "chartStretch", title: "Transfer",
 q: "A rainfall line chart helps you...",
 opts: ["See how rain changed over time", "Hide weather forever", "Replace umbrellas", "Delete dates always"],
 ok: 0, onDone: completeSub,
 }),
 });
}

function s8({ overlay, setCoach, completeSub }) {
 setCoach("Bust chart myths.");
 mountMythCards(overlay, {
 scene: "chartMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
 myths: [
 { claim: "Charts are only for adults", truth: "Kids can read simple bar and line stories", sceneMyth: 0 },
 { claim: "Taller bar always means worse", truth: "Taller usually means more of whatever the axis measures", sceneMyth: 1 },
 { claim: "Labels do not matter", truth: "Labels tell you what the numbers mean", sceneMyth: 2 },
 { claim: "One chart fits every question", truth: "Pick a chart that matches the question", sceneMyth: 3 },
 { claim: "Pretty doodles beat clear axes", truth: "Clear axes beat decoration", sceneMyth: 4 }
 ],
 onDone: completeSub,
 });
}

function s9({ overlay, setCoach, completeSub }) {
 setCoach("Quick chart fluency.");
 mountSpeedDrill(overlay, {
 scene: "chartDrill", title: "Fluency Drill", passScene: "chartMastery",
 items: [
 { q: "Charts show stories?", opts: ["Yes", "No"], ok: 0, prompt: "Story?" },
 { q: "Need labels?", opts: ["Yes", "Never"], ok: 0, prompt: "Labels?" },
 { q: "Doodle = chart part?", opts: ["No", "Yes"], ok: 0, prompt: "Doodle?" },
 { q: "Bars compare amounts?", opts: ["Yes", "No"], ok: 0, prompt: "Bars?" },
 { q: "Lines show change?", opts: ["Yes", "No"], ok: 0, prompt: "Lines?" },
 { q: "No-label is clear?", opts: ["No", "Yes"], ok: 0, prompt: "Clear?" }
 ],
 onDone: completeSub,
 });
}

function s10({ overlay, setCoach, completeSub }) {
 setCoach("Mastery - Chart Scout.");
 mountOrderSteps(overlay, {
 scene: "chartMastery", title: "Chart Scout Mastery", instructions: "Order your journey.",
 items: [ { id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" }, { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "chart", html: "Chart" } ],
 correctIds: ["meet", "sort", "lab", "rule", "myth", "chart"],
 onDone: () => mountTapContinue(overlay, {
 scene: "chartMastery", badge: LAB_ASSET_PATHS.m1,
 html: `<h3>\ud83d\udcca Chart Scout!</h3><p>You can read a chart as a number story.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 });
}
