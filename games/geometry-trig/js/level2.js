/**
 * Geometry & Trigonometry - Mission 2: Angle Adventures (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
 mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
 mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L2_META = {
 objective: "By the end of this mission, you'll be able to explain angles / measuring turns in your own words.",
 bdHook: "Bangladesh everyday: notice angles / measuring turns around you - then connect it to Angle Adventures.",
 predict: {
 q: "Before we start - what do you think matters most in Angle Adventures?",
 options: [
 "Guessing without checking",
 "Looking for a clear pattern or rule",
 "Skipping the practice steps",
 ],
 ok: 1,
 },

 kidTitle: "Angle Adventures",
 theme: "angles / measuring turns",
 emoji: "\u2220",
 rewardName: "Angle Ace",
 intro: "An angle is a turn between two rays. Acute is under 90\u00b0, right is exactly 90\u00b0, obtuse is over 90\u00b0 but under 180\u00b0.",
 everyday: ["Clock hands", "Open door swing", "Roof pitch on houses"],
 subTitles: [
 "Meet the Turn",
 "Open the Angle",
 "Sort: Acute, Right, Obtuse",
 "Degree Lab",
 "Why We Measure Turns",
 "Name the Angle Rule",
 "Stretch: BD Angle Stories",
 "Myth Bust",
 "Fluency Drill",
 "Angle Ace Mastery",
 ],
};

export function runL2Sub(subIndex, api) {
 const { registerTryAgain } = api;
 labState.reveal = false; labState.tokenProgress = 0; labState.masteryStep = 0;
 labState.placed = {}; labState.selectedId = null; labState.mythPhase = "claim";
 labState.heat = 0.25; labState.phase = "desk"; labState.mode = "clock";
 labState.angleDeg = 45; labState.angleKind = "acute";
 const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => { api.overlay.innerHTML = ""; fn(api); });
 fn(api);
}

function s1({ overlay, setCoach, completeSub }) {
 setCoach("Hook: an angle is a turn between two rays.");
 mountMotionChain(overlay, {
 title: "Meet the Turn",
 beats: [
 {
 scene: "angleMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000,
 html: `${badgeHtml(LAB_ASSET_PATHS.m2, "angles")}
 <p><strong>Act 1:</strong> Drag the two rays - they meet at a vertex.</p>`,
 },
 {
 scene: "angleMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200,
 html: `<p><strong>Act 2:</strong> Watch acute, right, and obtuse light up.</p>`,
 },
 {
 scene: "angleMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000,
 html: `<p><strong>Act 3:</strong> Degrees measure the turn - 90\u00b0 is a square corner.</p>`,
 },
 ],
 onDone: () => mountQuiz(overlay, {
 scene: "angleMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
 q: "A right angle measures\u2026",
 opts: ["Exactly 90 degrees", "Less than 45", "More than 180", "Zero always"],
 ok: 0,
 onDone: () => mountTapContinue(overlay, {
 scene: "angleMeet", badge: LAB_ASSET_PATHS.m2,
 html: `<h3>Turns unlocked</h3><p>Next: open an angle on the dial.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 }),
 });
}

function s2({ overlay, setCoach, completeSub }) {
 setCoach("Open the angle toward a clear right-angle zone.");
 labState.heat = 0.25; labState.angleDeg = 45;
 mountHeatLab(overlay, {
 scene: "angleLab", title: "Open the Angle",
 html: `<p>Drag until angle clarity \u2265 60% (heading toward 90\u00b0).</p>`,
 goalText: "Goal \u2265 60%", doneLabel: "Angle opened", threshold: 0.6, startHeat: 0.25,
 axis: "x", canvasAction: "stretch", sliderLabel: "Open", badge: LAB_ASSET_PATHS.m2,
 readoutLabels: {
 cold: "Still acute - open more",
 melting: "Opening\u2026",
 liquid: "Near a right angle",
 simmer: "Turn measured!",
 },
 onDone: completeSub,
 });
}

function s3({ overlay, setCoach, completeSub }) {
 setCoach("Sort turns into acute, right, obtuse, or not an angle.");
 mountTapContinue(overlay, {
 scene: "angleSort",
 html: `<h3>Acute, right, or obtuse?</h3>
 <p><strong>Acute:</strong> sharp turn under 90\u00b0 (slice of pizza tip).</p>
 <p><strong>Right:</strong> square corner 90\u00b0 (book corner, tile).</p>
 <p><strong>Obtuse:</strong> wide turn over 90\u00b0 (open door).</p>
 <p><strong>Not:</strong> a color name, a straight temperature.</p>`,
 onDone: () => mountDragSort(overlay, {
 scene: "angleSort", title: "Sort: Acute / Right / Obtuse / Not",
 instructions: "Drag each example into the right bin.",
 successText: "Angles sorted!",
 chips: [
 { id: "slice", text: "Sharp pizza tip", short: "Sharp", color: 0x60a5fa },
 { id: "book", text: "Book corner", short: "Book", color: 0x3b82f6 },
 { id: "door", text: "Wide open door", short: "Door", color: 0xf59e0b },
 { id: "clock", text: "Clock at 1:00", short: "1:00", color: 0x38bdf8 },
 { id: "tile", text: "Floor tile corner", short: "Tile", color: 0x2563eb },
 { id: "roof", text: "Gentle roof pitch", short: "Roof", color: 0xfbbf24 },
 { id: "blue", text: "Blue color", short: "Color", color: 0x94a3b8 },
 { id: "temp", text: "30 C weather", short: "Temp", color: 0x78716c },
 ],
 zones: [
 { id: "acute", label: "Acute (under 90)", accept: ["slice", "clock"] },
 { id: "right", label: "Right (90)", accept: ["book", "tile"] },
 { id: "obtuse", label: "Obtuse (over 90)", accept: ["door", "roof"] },
 { id: "not", label: "Not an angle", accept: ["blue", "temp"] },
 ],
 onDone: completeSub,
 }),
 });
}

function s4({ overlay, setCoach, completeSub }) {
 setCoach("Push the dial - read degrees more clearly.");
 labState.heat = 0.4;
 mountHeatLab(overlay, {
 scene: "angleLab", title: "Degree Lab",
 html: `<p>Reach \u2265 75% - degrees and kind label stay clear.</p>`,
 goalText: "Goal \u2265 75%", doneLabel: "Degrees clear", threshold: 0.75, startHeat: 0.4,
 axis: "x", canvasAction: "stretch", sliderLabel: "Degrees", badge: LAB_ASSET_PATHS.m2,
 onDone: completeSub,
 });
}

function s5({ overlay, setCoach, completeSub }) {
 setCoach("Order why we measure turns.");
 mountOrderSteps(overlay, {
 scene: "angleMeet", sceneArgs: { phase: "settle" }, title: "Why We Measure Turns",
 instructions: "Order the angle story.",
 items: [
 { id: "rays", html: "Find two rays and the vertex" },
 { id: "open", html: "See how open the turn is" },
 { id: "deg", html: "Measure in degrees" },
 { id: "name", html: "Name acute / right / obtuse" },
 ],
 correctIds: ["rays", "open", "deg", "name"],
 onDone: () => mountQuiz(overlay, {
 scene: "angleMeet", title: "Check",
 q: "An angle of 120\u00b0 is\u2026",
 opts: ["Obtuse", "Acute", "Right", "Impossible"],
 ok: 0, onDone: completeSub,
 }),
 });
}

function s6({ overlay, setCoach, completeSub }) {
 setCoach("Lock the angle rule.");
 mountEquationBuild(overlay, {
 scene: "angleRule", title: "Name the Angle Rule", instructions: "Tap in order.",
 tokens: [
 { id: "a", html: "Turn" }, { id: "b", html: "in" },
 { id: "c", html: "degrees" }, { id: "d", html: "= angle" },
 ],
 correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
 onDone: () => mountTapContinue(overlay, {
 scene: "angleRule", badge: LAB_ASSET_PATHS.rule,
 html: `<h3>Rule locked</h3><p>Acute &lt; 90\u00b0, right = 90\u00b0, obtuse &gt; 90\u00b0 (and &lt; 180\u00b0).</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 });
}

function s7({ overlay, setCoach, completeSub }) {
 setCoach("Clock, door, roof, fan, book - same turns.");
 mountTapContinue(overlay, {
 scene: "angleStretch",
 html: `<h3>Bangladesh angle stretch</h3><p>Tap: clock, door, roof, fan, book.</p>`,
 onDone: () => mountQuiz(overlay, {
 scene: "angleStretch", title: "Transfer",
 q: "A square tile corner is a\u2026",
 opts: ["Right angle (90\u00b0)", "Always acute", "Always obtuse", "Not an angle"],
 ok: 0, onDone: completeSub,
 }),
 });
}

function s8({ overlay, setCoach, completeSub }) {
 setCoach("Bust angle myths.");
 mountMythCards(overlay, {
 scene: "angleMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
 myths: [
 { claim: "Bigger looking lines mean a bigger angle", truth: "Angle is the turn, not how long the rays are drawn", sceneMyth: 0 },
 { claim: "Acute means any angle under 180", truth: "Acute is under 90\u00b0; obtuse is over 90\u00b0", sceneMyth: 1 },
 { claim: "Right angles only exist in triangles", truth: "Right angles appear in squares, books, tiles, and more", sceneMyth: 2 },
 { claim: "Degrees are only for thermometers", truth: "Angle degrees measure turns; temperature is a different degree idea", sceneMyth: 3 },
 { claim: "You cannot spot angle kinds without a tool", truth: "You can often compare to a square corner by eye first", sceneMyth: 4 },
 ],
 onDone: completeSub,
 });
}

function s9({ overlay, setCoach, completeSub }) {
 setCoach("Quick angle fluency.");
 mountSpeedDrill(overlay, {
 scene: "angleDrill", title: "Fluency Drill", passScene: "angleMastery",
 items: [
 { q: "Right angle?", opts: ["90\u00b0", "45\u00b0", "120\u00b0", "0\u00b0"], ok: 0, prompt: "Right" },
 { q: "45\u00b0 is\u2026", opts: ["Acute", "Obtuse", "Right", "Straight"], ok: 0, prompt: "45" },
 { q: "120\u00b0 is\u2026", opts: ["Obtuse", "Acute", "Right", "Zero"], ok: 0, prompt: "120" },
 { q: "Book corner?", opts: ["Right", "Always obtuse", "Not angle", "Color"], ok: 0, prompt: "Book" },
 { q: "Angle = ?", opts: ["A turn", "A color", "A temperature", "A letter"], ok: 0, prompt: "Angle" },
 { q: "Longer rays = bigger angle?", opts: ["No", "Yes always"], ok: 0, prompt: "Rays" },
 ],
 onDone: completeSub,
 });
}

function s10({ overlay, setCoach, completeSub }) {
 setCoach("Mastery - Angle Ace.");
 mountOrderSteps(overlay, {
 scene: "angleMastery", title: "Angle Ace Mastery", instructions: "Order your journey.",
 items: [
 { id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" },
 { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "ace", html: "Ace" },
 ],
 correctIds: ["meet", "sort", "lab", "rule", "myth", "ace"],
 onDone: () => mountTapContinue(overlay, {
 scene: "angleMastery", badge: LAB_ASSET_PATHS.m2,
 html: `<h3>\u2220 Angle Ace!</h3><p>You can name acute, right, and obtuse turns in degrees.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 });
}
