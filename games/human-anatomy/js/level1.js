/**
 * Human Anatomy - Mission 1: Body Map (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
 mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
 mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L1_META = {
 objective: "By the end of this mission, you'll be able to explain organs team up in your own words.",
 bdHook: "Bangladesh everyday: notice organs team up around you - then connect it to Body Map.",
 predict: {
 q: "Before we start - what do you think matters most in Body Map?",
 options: [
 "Guessing without checking",
 "Looking for a clear pattern or rule",
 "Skipping the practice steps",
 ],
 ok: 1,
 },

 kidTitle: "Body Map",
 theme: "organs team up",
 emoji: "\ud83d\uddfa\ufe0f",
 rewardName: "Body Mapper",
 intro: "Organs team up - heart, lungs, brain, stomach.",
 everyday: ["Feel your pulse", "Deep breath at school", "Meal digestion"],
 subTitles: [
 "Meet the Organ Team",
 "Map Clarity Lab",
 "Sort: Organ / Support / Not",
 "Teamwork Lab",
 "Why Organs Team",
 "Name the Body Rule",
 "Stretch: Daily Body",
 "Myth Bust",
 "Fluency Drill",
 "Body Mapper Mastery",
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
 setCoach("Hook: organs team up inside you.");
 mountMotionChain(overlay, {
 title: "Meet the Organ Team",
 beats: [
 { scene: "bodyMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000,
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "badge")}<p><strong>Act 1:</strong> Meet heart, lungs, brain, and stomach on the map.</p>` },
 { scene: "bodyMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200,
 html: `<p><strong>Act 2:</strong> Each organ has a job - and they help each other.</p>` },
 { scene: "bodyMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000,
 html: `<p><strong>Act 3:</strong> Your body is a team of organs and support parts.</p>` },
 ],
 onDone: () => mountQuiz(overlay, {
 scene: "bodyMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
 q: "Organs in the body mainly...",
 opts: ["Team up with different jobs", "Do nothing", "Are phone gadgets", "Only work as shoes"],
 ok: 0, onDone: () => mountTapContinue(overlay, {
 scene: "bodyMeet", badge: LAB_ASSET_PATHS.m1,
 html: `<h3>Map ready</h3><p>Next: map clarity lab.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 }),
 });
}

function s2({ overlay, setCoach, completeSub }) {
 setCoach("Dial until body-map idea is clear.");
 labState.heat = 0.25;
 mountHeatLab(overlay, {
 scene: "bodyLab", title: "Map Clarity Lab",
 html: `<p>Drag until organ map is clear (&gt;= 60%).</p>`,
 goalText: "Goal &gt;= 60%", doneLabel: "Map clearer", threshold: 0.6, startHeat: 0.25,
 axis: "x", canvasAction: "stretch", sliderLabel: "Map", badge: LAB_ASSET_PATHS.m1,
 onDone: completeSub,
 });
}

function s3({ overlay, setCoach, completeSub }) {
 setCoach("Sort organs, support parts, and not-body.");
 mountTapContinue(overlay, {
 scene: "bodySort",
 html: `<h3>Organ vs support</h3><p><strong>Organ:</strong> heart, lungs, brain, stomach.<br><strong>Support:</strong> bone, muscle.<br><strong>Not:</strong> phone, shoe.</p>`,
 onDone: () => mountDragSort(overlay, {
 scene: "bodySort", title: "Sort: Organ / Support / Not",
 instructions: "Drag chips into the matching bin.",
 successText: "Body map sorted!",
 chips: [
 { id: "heart", text: "Heart pumps", short: "Heart", color: 0xfb7185 },
 { id: "lungs", text: "Lungs breathe", short: "Lungs", color: 0x7dd3fc },
 { id: "brain", text: "Brain thinks", short: "Brain", color: 0xf9a8d4 },
 { id: "stomach", text: "Stomach digests", short: "Stomach", color: 0xfbbf24 },
 { id: "bone", text: "Bones support", short: "Bone", color: 0xe2e8f0 },
 { id: "muscle", text: "Muscles move", short: "Muscle", color: 0xf87171 },
 { id: "phone", text: "Phone gadget", short: "Phone", color: 0x64748b },
 { id: "shoe", text: "Shoe alone", short: "Shoe", color: 0x78716c },
 ],
 zones: [
 { id: "organ", label: "Organ", accept: ["heart", "lungs", "brain", "stomach"] },
 { id: "support", label: "Support/move", accept: ["bone", "muscle"] },
 { id: "not", label: "Not body part", accept: ["phone", "shoe"] },
 ],
 onDone: completeSub,
 }),
 });
}

function s4({ overlay, setCoach, completeSub }) {
 setCoach("Push map clarity higher.");
 labState.heat = 0.4;
 mountHeatLab(overlay, {
 scene: "bodyLab", title: "Teamwork Lab", html: `<p>Reach &gt;= 75% - organ teamwork looks clear.</p>`,
 goalText: "Goal &gt;= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
 axis: "x", canvasAction: "stretch", sliderLabel: "Map", badge: LAB_ASSET_PATHS.m1,
 onDone: completeSub,
 });
}

function s5({ overlay, setCoach, completeSub }) {
 setCoach("Order how organs team.");
 mountOrderSteps(overlay, {
 scene: "bodyMeet", sceneArgs: { phase: "settle" }, title: "Why Organs Team",
 instructions: "Order the story.",
 items: [{ id: "air", html: "Lungs take in air" }, { id: "pump", html: "Heart pumps blood" }, { id: "brain", html: "Brain sends signals" }, { id: "fuel", html: "Stomach helps fuel the team" }],
 correctIds: ["air", "pump", "brain", "fuel"],
 onDone: () => mountQuiz(overlay, {
 scene: "bodyMeet", title: "Check",
 q: "The heart's main job is to...",
 opts: ["Pump blood", "Think thoughts only", "Be a shoe", "Charge a phone"],
 ok: 0, onDone: completeSub,
 }),
 });
}

function s6({ overlay, setCoach, completeSub }) {
 setCoach("Lock the body-team rule.");
 mountEquationBuild(overlay, {
 scene: "bodyRule", title: "Name the Body Rule", instructions: "Tap in order.",
 tokens: [{ id: "a", html: "Organs" }, { id: "b", html: "team" }, { id: "c", html: "with" }, { id: "d", html: "jobs" }],
 correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
 onDone: () => mountTapContinue(overlay, {
 scene: "bodyRule", badge: LAB_ASSET_PATHS.rule,
 html: `<h3>Rule locked</h3><p>Organs team with different jobs.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 });
}

function s7({ overlay, setCoach, completeSub }) {
 setCoach("Pulse, breath, meals - same organ team.");
 mountTapContinue(overlay, {
 scene: "bodyStretch",
 html: `<h3>Daily body</h3><p>Tap contexts - pulse, breath, and meals use the same organ team.</p>`,
 onDone: () => mountQuiz(overlay, {
 scene: "bodyStretch", title: "Transfer",
 q: "Feeling your pulse most connects to the...",
 opts: ["Heart", "Phone only", "Shoe lace", "Flat rock"],
 ok: 0, onDone: completeSub,
 }),
 });
}

function s8({ overlay, setCoach, completeSub }) {
 setCoach("Bust body myths.");
 mountMythCards(overlay, {
 scene: "bodyMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
 myths: [
 { claim: "Only the heart matters", truth: "Organs team up - heart, lungs, brain, stomach, and more", sceneMyth: 0 },
 { claim: "Bones do nothing", truth: "Bones support and protect", sceneMyth: 1 },
 { claim: "The brain is not an organ", truth: "The brain is a key organ that controls the body", sceneMyth: 2 },
 { claim: "Phones are body organs", truth: "Gadgets are tools - not body organs", sceneMyth: 3 },
 { claim: "Organs work alone forever", truth: "Organs cooperate as a system", sceneMyth: 4 },
 ],
 onDone: completeSub,
 });
}

function s9({ overlay, setCoach, completeSub }) {
 setCoach("Quick body fluency.");
 mountSpeedDrill(overlay, {
 scene: "bodyDrill", title: "Fluency Drill", passScene: "bodyMastery",
 items: [
 { q: "Heart pumps blood?", opts: ["Yes", "No"], ok: 0, prompt: "Heart" },
 { q: "Lungs help breathe?", opts: ["Yes", "No"], ok: 0, prompt: "Lungs" },
 { q: "Brain is an organ?", opts: ["Yes", "No"], ok: 0, prompt: "Brain" },
 { q: "Phone is an organ?", opts: ["No", "Yes"], ok: 0, prompt: "Phone" },
 { q: "Bones support?", opts: ["Yes", "No"], ok: 0, prompt: "Bone" },
 { q: "Organs work alone only?", opts: ["No - they team", "Yes"], ok: 0, prompt: "Team" },
 ],
 onDone: completeSub,
 });
}

function s10({ overlay, setCoach, completeSub }) {
 setCoach("Mastery - Body Mapper.");
 mountOrderSteps(overlay, {
 scene: "bodyMastery", title: "Body Mapper Mastery", instructions: "Order your journey.",
 items: [{ id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" }, { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "win", html: "Win" }],
 correctIds: ["meet", "sort", "lab", "rule", "myth", "win"],
 onDone: () => mountTapContinue(overlay, {
 scene: "bodyMastery", badge: LAB_ASSET_PATHS.m1,
 html: `<h3>\ud83d\uddfa\ufe0f Body Mapper!</h3><p>You can map key organs and say they team up.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 });
}
