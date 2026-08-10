/**
 * Geometry & Trigonometry - Mission 1: Shape Studio (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
 mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
 mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L1_META = {
 objective: "By the end of this mission, you'll be able to explain polygons / sides & corners in your own words.",
 bdHook: "Bangladesh everyday: notice polygons / sides & corners around you - then connect it to Shape Studio.",
 predict: {
 q: "Before we start - what do you think matters most in Shape Studio?",
 options: [
 "Guessing without checking",
 "Looking for a clear pattern or rule",
 "Skipping the practice steps",
 ],
 ok: 1,
 },

 kidTitle: "Shape Studio",
 theme: "polygons / sides & corners",
 emoji: "\u25b3",
 rewardName: "Shape Scout",
 intro: "Shapes have rules: triangles have 3 sides, squares have 4 equal sides, circles are round with no corners.",
 everyday: ["Traffic signs", "Tiles on a floor", "Rickshaw wheels and windows"],
 subTitles: [
 "Meet the Shape Crew",
 "Build Side Count",
 "Sort: Triangle, Square, Circle",
 "Property Lab",
 "Why Properties Matter",
 "Name the Shape Rule",
 "Stretch: BD Shape Stories",
 "Myth Bust",
 "Fluency Drill",
 "Shape Scout Mastery",
 ],
};

export function runL1Sub(subIndex, api) {
 const { registerTryAgain } = api;
 labState.reveal = false; labState.tokenProgress = 0; labState.masteryStep = 0;
 labState.placed = {}; labState.selectedId = null; labState.mythPhase = "claim";
 labState.heat = 0.25; labState.phase = "desk"; labState.mode = "signs";
 labState.shapeKind = "triangle"; labState.sideCount = 3;
 const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => { api.overlay.innerHTML = ""; fn(api); });
 fn(api);
}

function s1({ overlay, setCoach, completeSub }) {
 setCoach("Hook: triangle, square, circle - count sides and corners.");
 mountMotionChain(overlay, {
 title: "Meet the Shape Crew",
 beats: [
 {
 scene: "shapeMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000,
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "shapes")}
 <p><strong>Act 1:</strong> Drag triangle, square, and circle on the desk.</p>`,
 },
 {
 scene: "shapeMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200,
 html: `<p><strong>Act 2:</strong> Count sides - 3, 4, and a round edge with 0 corners.</p>`,
 },
 {
 scene: "shapeMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000,
 html: `<p><strong>Act 3:</strong> Properties (sides, corners, equal length) name the shape.</p>`,
 },
 ],
 onDone: () => mountQuiz(overlay, {
 scene: "shapeMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
 q: "A triangle always has\u2026",
 opts: ["3 sides and 3 corners", "4 equal sides", "No corners ever", "Only curved edges"],
 ok: 0,
 onDone: () => mountTapContinue(overlay, {
 scene: "shapeMeet", badge: LAB_ASSET_PATHS.m1,
 html: `<h3>Shape crew ready</h3><p>Next: dial side count clarity.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 }),
 });
}

function s2({ overlay, setCoach, completeSub }) {
 setCoach("Dial until side-count idea is clear.");
 labState.heat = 0.25; labState.sideCount = 3;
 mountHeatLab(overlay, {
 scene: "shapeLab", title: "Build Side Count",
 html: `<p>Drag until shape property clarity \u2265 60%.</p>`,
 goalText: "Goal \u2265 60%", doneLabel: "Sides clear", threshold: 0.6, startHeat: 0.25,
 axis: "x", canvasAction: "stretch", sliderLabel: "Sides", badge: LAB_ASSET_PATHS.m1,
 readoutLabels: {
 cold: "Blurry sides - keep counting",
 melting: "Sides appearing\u2026",
 liquid: "Near clear count",
 simmer: "Properties locked!",
 },
 onDone: completeSub,
 });
}

function s3({ overlay, setCoach, completeSub }) {
 setCoach("Sort objects into triangle, square, circle, or not.");
 mountTapContinue(overlay, {
 scene: "shapeSort",
 html: `<h3>Which shape?</h3>
 <p><strong>Triangle:</strong> 3 sides (yield sign, roof peak).</p>
 <p><strong>Square:</strong> 4 equal sides (tile, window pane).</p>
 <p><strong>Circle:</strong> round, no corners (wheel, plate).</p>
 <p><strong>Not:</strong> letter S, random scribble.</p>`,
 onDone: () => mountDragSort(overlay, {
 scene: "shapeSort", title: "Sort: Triangle / Square / Circle / Not",
 instructions: "Drag each item into the matching bin.",
 successText: "Shapes sorted!",
 chips: [
 { id: "yield", text: "Yield road sign", short: "Yield", color: 0x60a5fa },
 { id: "tile", text: "Floor tile", short: "Tile", color: 0x3b82f6 },
 { id: "wheel", text: "Rickshaw wheel", short: "Wheel", color: 0x93c5fd },
 { id: "roof", text: "Roof peak", short: "Roof", color: 0x38bdf8 },
 { id: "pane", text: "Square window", short: "Window", color: 0x2563eb },
 { id: "plate", text: "Round plate", short: "Plate", color: 0x7dd3fc },
 { id: "letter", text: "Letter S", short: "Letter", color: 0x94a3b8 },
 { id: "scrib", text: "Scribble line", short: "Scribble", color: 0x78716c },
 ],
 zones: [
 { id: "tri", label: "Triangle", accept: ["yield", "roof"] },
 { id: "sq", label: "Square", accept: ["tile", "pane"] },
 { id: "circ", label: "Circle", accept: ["wheel", "plate"] },
 { id: "not", label: "Not these shapes", accept: ["letter", "scrib"] },
 ],
 onDone: completeSub,
 }),
 });
}

function s4({ overlay, setCoach, completeSub }) {
 setCoach("Push property clarity higher.");
 labState.heat = 0.4;
 mountHeatLab(overlay, {
 scene: "shapeLab", title: "Property Lab",
 html: `<p>Reach \u2265 75% - sides and corners labeled clearly.</p>`,
 goalText: "Goal \u2265 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
 axis: "x", canvasAction: "stretch", sliderLabel: "Clarity", badge: LAB_ASSET_PATHS.m1,
 onDone: completeSub,
 });
}

function s5({ overlay, setCoach, completeSub }) {
 setCoach("Order why properties matter.");
 mountOrderSteps(overlay, {
 scene: "shapeMeet", sceneArgs: { phase: "settle" }, title: "Why Properties Matter",
 instructions: "Order the shape story.",
 items: [
 { id: "look", html: "Look at the outline" },
 { id: "count", html: "Count sides and corners" },
 { id: "check", html: "Check equal sides if needed" },
 { id: "name", html: "Name the shape" },
 ],
 correctIds: ["look", "count", "check", "name"],
 onDone: () => mountQuiz(overlay, {
 scene: "shapeMeet", title: "Check",
 q: "A square is special among 4-sided shapes because\u2026",
 opts: ["All sides equal and right corners", "It has 3 sides", "It has no sides", "It is always a circle"],
 ok: 0, onDone: completeSub,
 }),
 });
}

function s6({ overlay, setCoach, completeSub }) {
 setCoach("Lock the shape rule.");
 mountEquationBuild(overlay, {
 scene: "shapeRule", title: "Name the Shape Rule", instructions: "Tap in order.",
 tokens: [
 { id: "a", html: "Count" }, { id: "b", html: "sides" },
 { id: "c", html: "+" }, { id: "d", html: "name" },
 ],
 correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
 onDone: () => mountTapContinue(overlay, {
 scene: "shapeRule", badge: LAB_ASSET_PATHS.rule,
 html: `<h3>Rule locked</h3><p>Count sides (and check equals) to name the shape.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 });
}

function s7({ overlay, setCoach, completeSub }) {
 setCoach("Signs, tiles, wheels, kites, windows - same properties.");
 mountTapContinue(overlay, {
 scene: "shapeStretch",
 html: `<h3>Bangladesh shape stretch</h3><p>Tap: signs, tiles, wheels, kites, windows.</p>`,
 onDone: () => mountQuiz(overlay, {
 scene: "shapeStretch", title: "Transfer",
 q: "A rickshaw wheel is closest to a\u2026",
 opts: ["Circle", "Triangle", "Square only", "Letter S"],
 ok: 0, onDone: completeSub,
 }),
 });
}

function s8({ overlay, setCoach, completeSub }) {
 setCoach("Bust shape myths.");
 mountMythCards(overlay, {
 scene: "shapeMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
 myths: [
 { claim: "Every 4-sided shape is a square", truth: "Rectangles and other quads exist - squares need equal sides + right angles", sceneMyth: 0 },
 { claim: "Circles have 4 corners", truth: "Circles are round - no corners", sceneMyth: 1 },
 { claim: "Triangles always look the same", truth: "Triangles can be tall, wide, or right-angled - still 3 sides", sceneMyth: 2 },
 { claim: "Shape names are only for art class", truth: "Signs, buildings, and tools use shape properties", sceneMyth: 3 },
 { claim: "Counting sides is useless", truth: "Side count is the first clue to the shape name", sceneMyth: 4 },
 ],
 onDone: completeSub,
 });
}

function s9({ overlay, setCoach, completeSub }) {
 setCoach("Quick shape fluency.");
 mountSpeedDrill(overlay, {
 scene: "shapeDrill", title: "Fluency Drill", passScene: "shapeMastery",
 items: [
 { q: "Triangle sides?", opts: ["3", "4", "0", "1"], ok: 0, prompt: "Tri" },
 { q: "Square sides?", opts: ["4 equal", "3", "Curved only", "5"], ok: 0, prompt: "Sq" },
 { q: "Circle corners?", opts: ["0", "4", "3", "2"], ok: 0, prompt: "Circ" },
 { q: "Yield sign shape?", opts: ["Triangle", "Circle only", "Square", "Line"], ok: 0, prompt: "Yield" },
 { q: "Wheel shape?", opts: ["Circle", "Square", "Triangle", "Letter"], ok: 0, prompt: "Wheel" },
 { q: "Letter S a polygon?", opts: ["No", "Yes square"], ok: 0, prompt: "Letter" },
 ],
 onDone: completeSub,
 });
}

function s10({ overlay, setCoach, completeSub }) {
 setCoach("Mastery - Shape Scout.");
 mountOrderSteps(overlay, {
 scene: "shapeMastery", title: "Shape Scout Mastery", instructions: "Order your journey.",
 items: [
 { id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" },
 { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "scout", html: "Scout" },
 ],
 correctIds: ["meet", "sort", "lab", "rule", "myth", "scout"],
 onDone: () => mountTapContinue(overlay, {
 scene: "shapeMastery", badge: LAB_ASSET_PATHS.m1,
 html: `<h3>\u25b3 Shape Scout!</h3><p>You can name shapes by sides, corners, and properties.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 });
}
