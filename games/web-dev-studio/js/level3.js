/**
 * Web Dev Studio - Mission 3: JS Click (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
 mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
 mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L3_META = {
 objective: "By the end of this mission, you'll be able to explain interaction in your own words.",
 bdHook:
 "Bangladesh everyday: game Start button, quiz tap A/B/C, BD ticket kiosk - notice click → code → page change.",
 predict: {
 q: "Before we start - what mainly makes a button react when you tap it?",
 options: [
 "Only painting CSS colors with no events",
 "An event (click/tap) runs JavaScript code that changes the page",
 "HTML headings alone always score the quiz",
 ],
 ok: 1,
 },

 kidTitle: "JS Click",
 theme: "interaction",
 emoji: "\u26a1",
 rewardName: "Click Coder",
 intro: "A click is an event. JavaScript runs code that changes the page - buttons come alive.",
 everyday: ["Game Start button", "Quiz tap A/B/C", "BD ticket kiosk tap"],
 subTitles: [
 "Meet the Click", "Click Energy Lab", "Sort Reactions", "Stronger Click Lab",
 "Why Pages React", "Name the Click Rule", "Stretch: Real Taps", "Myth Bust",
 "Fluency Drill", "Click Coder Mastery",
 ],
};

export function runL3Sub(subIndex, api) {
 const { registerTryAgain } = api;
 labState.reveal = false; labState.tokenProgress = 0; labState.masteryStep = 0;
 labState.placed = {}; labState.selectedId = null; labState.mythPhase = "claim";
 labState.heat = 0.2; labState.phase = "desk"; labState.mode = "game";
 labState.clickCount = 0;
 const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => { api.overlay.innerHTML = ""; fn(api); });
 fn(api);
}

function s1({ overlay, setCoach, completeSub }) {
 setCoach("Hook: tap CLICK ME - event runs code, page changes.");
 mountMotionChain(overlay, {
 title: "Meet the Click",
 beats: [
 { scene: "jsMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000,
 html: `${badgeHtml(LAB_ASSET_PATHS.m3, "js")}<p><strong>Act 1:</strong> Tap the big button on the canvas.</p>` },
 { scene: "jsMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200,
 html: `<p><strong>Act 2:</strong> See onClick() spark - code runs after the event.</p>` },
 { scene: "jsMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000,
 html: `<p><strong>Act 3:</strong> The bubble says Changed! - that is the reaction.</p>` },
 ],
 onDone: () => mountQuiz(overlay, {
 scene: "jsMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
 q: "What starts a button reaction?",
 opts: ["An event like a click/tap", "Only painting CSS forever", "Deleting HTML", "Turning off the screen"],
 ok: 0, onDone: () => mountTapContinue(overlay, {
 scene: "jsMeet", badge: LAB_ASSET_PATHS.m3,
 html: `<h3>Click online</h3><p>Next: build click energy on the dial.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 }),
 });
}

function s2({ overlay, setCoach, completeSub }) {
 setCoach("Dial or tap until click energy >= 60%.");
 labState.heat = 0.2;
 mountHeatLab(overlay, {
 scene: "jsLab", title: "Click Energy Lab",
 html: `<p>Drag the dial (or tap the button) until >= 60%.</p>`,
 goalText: "Goal >= 60%", doneLabel: "Energy up", threshold: 0.6, startHeat: 0.2,
 axis: "x", canvasAction: "stretch", sliderLabel: "Energy", badge: LAB_ASSET_PATHS.m3,
 readoutLabels: {
 cold: "Waiting… no event yet",
 melting: "Click sparking - code warming up",
 liquid: "onClick running - page changing",
 simmer: "Alive! Event → code → change",
 },
 onDone: completeSub,
 });
}

function s3({ overlay, setCoach, completeSub }) {
 setCoach("Sort click reactions vs static look vs not JS.");
 mountTapContinue(overlay, {
 scene: "jsSort",
 html: `<h3>Guide</h3><p><strong>Reaction:</strong> button click, show/hide, score +1, pop message.<br><strong>Static:</strong> &lt;h1&gt;, color:red.<br><strong>Not:</strong> rock, tea.</p>`,
 onDone: () => mountDragSort(overlay, {
 scene: "jsSort", title: "Sort Reactions",
 instructions: "Drag into Reaction / Static / Not.",
 successText: "Clicks sorted!",
 chips: [
 { id: "btn", text: "Button click", short: "Button click", color: 0xfacc15 },
 { id: "toggle", text: "Show or hide a box", short: "Show/hide", color: 0xeab308 },
 { id: "count", text: "Score goes up", short: "Score +1", color: 0xfde047 },
 { id: "alert", text: "Pop a message", short: "Pop message", color: 0xfef08a },
 { id: "h1", text: "Heading tag", short: "<h1>", color: 0xea580c },
 { id: "color", text: "A color style", short: "color:red", color: 0x38bdf8 },
 { id: "rock", text: "A rock", short: "Rock", color: 0x94a3b8 },
 { id: "tea", text: "A cup of tea", short: "Tea", color: 0xf472b6 },
 ],
 zones: [
 { id: "react", label: "Click reaction", accept: ["btn", "toggle", "count", "alert"] },
 { id: "static", label: "Static look", accept: ["h1", "color"] },
 { id: "not", label: "Not JS", accept: ["rock", "tea"] },
 ],
 onDone: completeSub,
 }),
 });
}

function s4({ overlay, setCoach, completeSub }) {
 setCoach("Push click energy higher.");
 labState.heat = 0.4;
 mountHeatLab(overlay, {
 scene: "jsLab", title: "Stronger Click Lab", html: `<p>Reach >= 75%.</p>`,
 goalText: "Goal >= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
 axis: "x", canvasAction: "stretch", sliderLabel: "Energy", badge: LAB_ASSET_PATHS.m3,
 readoutLabels: {
 cold: "Quiet button - need more taps",
 melting: "Sparks growing around the button",
 liquid: "Strong reaction - bubble lit",
 simmer: "Click energy max - page feels live",
 },
 onDone: completeSub,
 });
}

function s5({ overlay, setCoach, completeSub }) {
 setCoach("Order why pages react.");
 mountOrderSteps(overlay, {
 scene: "jsMeet", sceneArgs: { phase: "settle" }, title: "Why Pages React",
 instructions: "Order the story.",
 items: [
 { id: "tap", html: "You tap / click (event)" },
 { id: "run", html: "JavaScript runs code" },
 { id: "change", html: "Something on the page changes" },
 { id: "feel", html: "The page feels alive" },
 ],
 correctIds: ["tap", "run", "change", "feel"],
 onDone: () => mountQuiz(overlay, {
 scene: "jsMeet", title: "Check",
 q: "HTML alone (no event code) usually...",
 opts: ["Shows structure but does not react to clicks", "Always scores your quiz", "Deletes CSS", "Prints tickets by itself"],
 ok: 0, onDone: completeSub,
 }),
 });
}

function s6({ overlay, setCoach, completeSub }) {
 setCoach("Lock the JS click rule.");
 mountEquationBuild(overlay, {
 scene: "jsRule", title: "Name the Click Rule", instructions: "Tap in order.",
 tokens: [
 { id: "a", html: "Event" }, { id: "b", html: "Code" },
 { id: "c", html: "Change" }, { id: "d", html: "Alive" },
 ],
 correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
 onDone: () => mountTapContinue(overlay, {
 scene: "jsRule", badge: LAB_ASSET_PATHS.rule,
 html: `<h3>Rule locked</h3><p>Event / Code / Change / Alive.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 });
}

function s7({ overlay, setCoach, completeSub }) {
 setCoach("Game, form, kiosk, class, home - same click idea.");
 mountTapContinue(overlay, {
 scene: "jsStretch", html: `<h3>Real taps</h3><p>Tap each mode - event then change.</p>`,
 onDone: () => mountQuiz(overlay, {
 scene: "jsStretch", title: "Transfer",
 q: "A BD ticket kiosk tap is...",
 opts: ["An event that should run code", "Only an HTML heading", "Only a CSS color", "Not interaction"],
 ok: 0, onDone: completeSub,
 }),
 });
}

function s8({ overlay, setCoach, completeSub }) {
 setCoach("Bust JS myths.");
 mountMythCards(overlay, {
 scene: "jsMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
 myths: [
 { claim: "Pages never need clicks", truth: "Many pages wake up when you click or tap", sceneMyth: 0 },
 { claim: "JavaScript is only for games", truth: "Forms, quizzes, and switches use it too", sceneMyth: 1 },
 { claim: "HTML alone makes buttons react", truth: "A reaction needs an event plus code", sceneMyth: 2 },
 { claim: "Kids cannot learn click code", truth: "Event then change is a clear starter idea", sceneMyth: 3 },
 { claim: "One click must do everything", truth: "Each click can run a small clear change", sceneMyth: 4 },
 ],
 onDone: completeSub,
 });
}

function s9({ overlay, setCoach, completeSub }) {
 setCoach("Quick JS fluency.");
 mountSpeedDrill(overlay, {
 scene: "jsDrill", title: "Fluency Drill", passScene: "jsMastery",
 items: [
 { q: "A click is a kind of...", opts: ["Event", "Roof tile"], ok: 0, prompt: "Event" },
 { q: "Does JS run code after a click?", opts: ["Yes", "Never"], ok: 0, prompt: "Code" },
 { q: "Is <h1> mainly a click reaction?", opts: ["No", "Yes"], ok: 0, prompt: "h1" },
 { q: "Score +1 after tap is...", opts: ["A reaction", "Only CSS"], ok: 0, prompt: "Score" },
 { q: "Tea is JavaScript?", opts: ["No", "Yes"], ok: 0, prompt: "Tea" },
 { q: "Event + code makes pages...", opts: ["Alive", "Silent forever"], ok: 0, prompt: "Alive" },
 ],
 onDone: completeSub,
 });
}

function s10({ overlay, setCoach, completeSub }) {
 setCoach("Mastery - Click Coder.");
 mountOrderSteps(overlay, {
 scene: "jsMastery", title: "Click Coder Mastery", instructions: "Order your journey.",
 items: [
 { id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" },
 { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "win", html: "Code" },
 ],
 correctIds: ["meet", "sort", "lab", "rule", "myth", "win"],
 onDone: () => mountTapContinue(overlay, {
 scene: "jsMastery", badge: LAB_ASSET_PATHS.m3,
 html: `<h3>Click Coder!</h3><p>Event / Code / Change / Alive - buttons react.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 });
}
