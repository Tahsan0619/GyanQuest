/**
 * Civil Basics - Mission 1: Strong Structures
 * Script: Opening + 4 Bruner spirals (shapes → stability → load paths → limits) + recap.
 */
import { labState, LAB_ASSET_PATHS, resetStructState, initStructSub } from "./lab-state.js?v=struct3";
import { mountGate, mountSpiralMap, mountTapContinue, badgeHtml } from "./lab-activities.js?v=struct3";

export const L1_META = {
 objective:
 "By the end of this mission, you'll explain rigid shapes, trusses, stability, load paths, load distribution, and safety factors - why shape decides whether something stands.",
 bdHook:
 "Shelf brackets, model bridges, warehouse racks - triangles and wide bases carry load through clear paths to the ground.",
 predict: {
 q: "A square frame made of strong rods collapses sideways when pushed. What's the honest reason?",
 options: [
 "Its corner angles can change without any rod breaking - the shape folds",
 "The rods magically got weaker when pushed",
 "Squares are always made of soft material",
 "Gravity turns off inside squares",
 ],
 ok: 0,
 },
 kidTitle: "Strong Structures",
 theme: "why shape decides whether something stands",
 emoji: "🏗️",
 rewardName: "Structure Scout",
 intro:
 "How strong something is has almost nothing to do with what it's made of - and everything to do with what shape it's arranged into. Today we build a real bridge, shape by shape.",
 everyday: ["Bridge truss", "Shelf bracket", "Building frame"],
 subTitles: [
 "Start Building",
 "Push the Square",
 "Why Triangles?",
 "Wind Gust Test",
 "Center of Gravity",
 "Trace the Load",
 "Real Structures",
 "Load Them Both",
 "Safety Factor",
 "Standing on Purpose",
 ],
};

export function runL1Sub(subIndex, api) {
 const { registerTryAgain } = api;
 initStructSub(subIndex);
 const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => {
 api.overlay.innerHTML = "";
 resetStructState();
 fn(api);
 });
 fn(api);
}

function n(text) {
 return `<p class="tiny-narration">${text}</p>`;
}

function square1Ready() {
 return labState.structSquarePushed && labState.structDiagonalAdded && labState.structBracedPushTried;
}

function windBothTried() {
 return labState.structWindNarrow && labState.structWindWide;
}

function s1_opening({ overlay, setCoach, completeSub }) {
 setCoach("Tap Start Building on the canvas - you'll advance automatically.");
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "structOpen",
 badge: "Opening",
 title: "Why Shape Decides Whether Something Stands",
 pulse: true,
 autoAdvanceOnReady: true,
 ready: () => labState.structOpenReady || Date.now() - t0 > 4500,
 readyText: "Shape matters more than material.",
 doneLabel: "Continue ▶",
 controlsHtml: `<p class="drag-hint">Or tap here:</p>
 <button type="button" class="btn secondary" id="gate-start-build">Start Building →</button>`,
 bind: (host, { finish, signalGateReady: signal }) => {
 host.querySelector("#gate-start-build")?.addEventListener("click", () => {
 labState.structOpenReady = true;
 signal?.({ forceAdvance: true });
 finish();
 });
 },
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "structure")}
 ${n(
 "Nothing broke in that collapse - every rod is exactly as strong as before. The whole shape folded like paper. Today we're going to build a real bridge and figure out exactly which shapes keep it standing.",
 )}`,
 onDone: completeSub,
 });
}

function s2_square({ overlay, setCoach, completeSub }) {
 setCoach("Push the square sideways, add the diagonal, then try pushing again.");
 mountGate(overlay, {
 scene: "structSquare1",
 badge: "Spiral 1 · Enactive",
 title: "Push the Square, Then Brace It",
 pulse: true,
 ready: square1Ready,
 readyText: "One diagonal - two triangles - genuinely rigid.",
 doneLabel: "Continue ▶",
 html: n(
 "Drag to push the square into a slanted parallelogram. Add a diagonal rod corner to corner. Try the same push - the frame won't budge.",
 ),
 onDone: completeSub,
 });
}

function s3_compare({ overlay, setCoach, completeSub }) {
 setCoach("Square corner angles change freely; triangle angles are locked by geometry.");
 mountGate(overlay, {
 scene: "structCompare1",
 badge: "Spiral 1 · Iconic",
 title: "Squares vs Triangles",
 ready: () => true,
 html: n(
 "A square's corners can swing into a new shape while every side stays the same length. A triangle cannot fold without a side stretching or breaking - that's pure geometry.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "structTerms1",
 html: `<h3>Spiral 1 · Symbolic</h3>
 <p><strong>Rigid shape</strong> · <strong>Truss</strong></p>
 <p>Triangles are rigid on their own. Squares need a diagonal brace.</p>`,
 onDone: completeSub,
 });
 },
 });
}

function s4_tower({ overlay, setCoach, completeSub }) {
 setCoach("Apply the wind gust to BOTH towers - narrow first, then wide.");
 mountGate(overlay, {
 scene: "structTower2",
 badge: "Spiral 2 · Enactive",
 title: "Wide Base, Strong Stand",
 pulse: true,
 ready: windBothTried,
 readyText: "Rigid and unbroken - yet the narrow one still toppled.",
 doneLabel: "Continue ▶",
 html: n(
 "Two identical rigid towers - same height, different base width. Wind gust the narrow one: it topples as one solid piece. Same gust on the wide base: it rocks but stays upright.",
 ),
 onDone: completeSub,
 });
}

function s5_cog({ overlay, setCoach, completeSub }) {
 setCoach("Watch center of gravity drift outside the base footprint - that's the tipping rule.");
 mountGate(overlay, {
 scene: "structCog2",
 badge: "Spiral 2 · Iconic",
 title: "Center of Gravity vs Base",
 ready: () => true,
 html: n(
 "Something topples the instant its center of gravity gets pushed outside its base. A wider base gives that point much more room to shift safely.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "structTerms2",
 html: `<h3>Spiral 2 · Symbolic</h3>
 <p><strong>Center of gravity</strong> · <strong>Base of support</strong></p>
 <p>Stay standing as long as CoG stays above the base.</p>`,
 onDone: completeSub,
 });
 },
 });
}

function s6_bridge({ overlay, setCoach, completeSub }) {
 setCoach("Drop weight on the good bridge, then on the one weak support.");
 mountGate(overlay, {
 scene: "structBridge3",
 badge: "Spiral 3 · Enactive",
 title: "Trace the Load",
 pulse: true,
 ready: () => labState.structLoadGood && labState.structLoadWeak,
 readyText: "Spread paths vs one funnel point - that's how structures fail.",
 doneLabel: "Continue ▶",
 html: n(
 "Drop a weight on the truss bridge - watch the load travel through triangles into wide piers. Then try a bridge with one thin off-center column - all the weight funnels there and it buckles.",
 ),
 onDone: completeSub,
 });
}

function s7_real({ overlay, setCoach, completeSub }) {
 setCoach("Same load-path idea runs invisibly inside every real bridge and building.");
 mountGate(overlay, {
 scene: "structReal3",
 badge: "Spiral 3 · Iconic",
 title: "Load Paths Everywhere",
 ready: () => true,
 html: n(
 "Your weight right now is traveling down through a load path exactly like this - spread out by design so no single point handles more than it safely can.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "structTerms3",
 html: `<h3>Spiral 3 · Symbolic</h3>
 <p><strong>Load</strong> · <strong>Load path</strong> · <strong>Load distribution</strong></p>`,
 onDone: completeSub,
 });
 },
 });
}

function s8_load({ overlay, setCoach, completeSub }) {
 setCoach("Slide load up until the weak design fails - watch the strong design keep holding.");
 mountGate(overlay, {
 scene: "structLoad4",
 badge: "Spiral 4 · Enactive",
 title: "Load Them Both",
 pulse: true,
 ready: () => labState.structLoadTestDone,
 readyText: "Same span - wildly different outcomes.",
 doneLabel: "Continue ▶",
 html: n(
 "Weak design: unbraced square, single narrow support. Strong design: triangle truss, wide dual supports. Add load gradually until the weak one fails.",
 ),
 onDone: completeSub,
 });
}

function s9_safe({ overlay, setCoach, completeSub }) {
 setCoach("Real engineers build in margin below the true breaking point - on purpose.");
 mountGate(overlay, {
 scene: "structSafe4",
 badge: "Spiral 4 · Iconic",
 title: "Safe Working Load",
 ready: () => true,
 html: n(
 "Real structures are never used anywhere near their true breaking point. That deliberate gap is called a safety factor - for weather, wear, and heavier-than-expected use.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "structTerms4",
 html: `<h3>Spiral 4 · Symbolic</h3>
 <p>Triangles · Wide base · Load paths · Safety factor</p>
 <p><em>Next: arches spanning gaps with almost no support underneath?</em></p>`,
 onDone: completeSub,
 });
 },
 });
}

function s10_closing({ overlay, setCoach, completeSub }) {
 setCoach("Watch the opening square rebuild on purpose - then open the recap map.");
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "structClose",
 badge: "Closing",
 title: "Standing on Purpose",
 html: n(
 "That square from the start folded because nothing was designed on purpose. Everything since was: triangles for geometry, base widened for stability, weight spread across strong paths. Standing up is a decision, shape by shape.",
 ),
 ready: () => labState.structCloseU >= 0.85 || Date.now() - t0 > 7000,
 readyText: "Rigid · Stable · Load path · Safety margin.",
 doneLabel: "Open the recap map ▶",
 onDone: () => {
 setCoach("Tap a spiral number to replay, then finish Strong Structures.");
 mountSpiralMap(overlay, {
 scene: "structSpiral",
 title: "Your recap map",
 finishLabel: "Finish Strong Structures ▶",
 narration: "Four spirals - shapes, stability, load paths, and limits. Tap a number to replay a highlight.",
 statusIdle: "Tap a number to replay, or finish now.",
 stops: [
 { n: 1, label: "1: Shapes" },
 { n: 2, label: "2: Base" },
 { n: 3, label: "3: Load" },
 { n: 4, label: "4: Limits" },
 ],
 onDone: completeSub,
 });
 },
 });
}

const s1 = s1_opening;
const s2 = s2_square;
const s3 = s3_compare;
const s4 = s4_tower;
const s5 = s5_cog;
const s6 = s6_bridge;
const s7 = s7_real;
const s8 = s8_load;
const s9 = s9_safe;
const s10 = s10_closing;
