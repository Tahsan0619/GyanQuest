/**
 * Genetics & Biotech - Mission 1: Trait Tokens (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
 mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
 mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L1_META = {
 objective: "By the end of this mission, you'll be able to explain inherited vs not in your own words.",
 bdHook: "Bangladesh everyday: notice inherited vs not around you - then connect it to Trait Tokens.",
 predict: {
 q: "Before we start - what do you think matters most in Trait Tokens?",
 options: [
 "Guessing without checking",
 "Looking for a clear pattern or rule",
 "Skipping the practice steps",
 ],
 ok: 1,
 },

 kidTitle: "Trait Tokens",
 theme: "inherited vs not",
 emoji: "\ud83d\udc6a",
 rewardName: "Trait Tracker",
 intro: "Traits can pass from parents - eye color clues.",
 everyday: ["Family eye colors", "Hair in the mirror", "Classmate dimples"],
 subTitles: [
 "Meet Trait Tokens",
 "Trait Clarity Lab",
 "Sort: Inherit / Not",
 "Family Clue Lab",
 "Why Traits Pass",
 "Name the Trait Rule",
 "Stretch: Family Stories",
 "Myth Bust",
 "Fluency Drill",
 "Trait Tracker Mastery",
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
 setCoach("Hook: some traits can pass from parents.");
 mountMotionChain(overlay, {
 title: "Meet Trait Tokens",
 beats: [
 { scene: "traitMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000,
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "badge")}<p><strong>Act 1:</strong> Meet eye, hair, and dimple clue tokens.</p>` },
 { scene: "traitMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200,
 html: `<p><strong>Act 2:</strong> Some traits can come from parents via genes.</p>` },
 { scene: "traitMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000,
 html: `<p><strong>Act 3:</strong> Learned skills and scars are not inherited traits.</p>` },
 ],
 onDone: () => mountQuiz(overlay, {
 scene: "traitMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
 q: "An inherited trait clue is most like...",
 opts: ["Eye color from family", "A scar from a fall", "A favorite hat", "A learned math skill only"],
 ok: 0, onDone: () => mountTapContinue(overlay, {
 scene: "traitMeet", badge: LAB_ASSET_PATHS.m1,
 html: `<h3>Traits ready</h3><p>Next: trait clarity lab.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 }),
 });
}

function s2({ overlay, setCoach, completeSub }) {
 setCoach("Dial until trait idea is clear.");
 labState.heat = 0.25;
 mountHeatLab(overlay, {
 scene: "traitLab", title: "Trait Clarity Lab",
 html: `<p>Drag until inherit idea is clear (&gt;= 60%).</p>`,
 goalText: "Goal &gt;= 60%", doneLabel: "Traits clearer", threshold: 0.6, startHeat: 0.25,
 axis: "x", canvasAction: "stretch", sliderLabel: "Trait", badge: LAB_ASSET_PATHS.m1,
 onDone: completeSub,
 });
}

function s3({ overlay, setCoach, completeSub }) {
 setCoach("Sort inherited clues vs not inherited.");
 mountTapContinue(overlay, {
 scene: "traitSort",
 html: `<h3>Inherit or not?</h3><p><strong>Can inherit:</strong> eyes, hair, dimples, parents, genes.<br><strong>Not:</strong> learned skill, scar, hat.</p>`,
 onDone: () => mountDragSort(overlay, {
 scene: "traitSort", title: "Sort: Inherit / Not",
 instructions: "Drag chips into the matching bin.",
 successText: "Traits sorted!",
 chips: [
 { id: "eye", text: "Eye color clue", short: "Eyes", color: 0x67e8f9 },
 { id: "hair", text: "Hair type clue", short: "Hair", color: 0x22d3ee },
 { id: "dimple", text: "Dimples trait", short: "Dimple", color: 0xa5f3fc },
 { id: "parent", text: "From parents", short: "Parents", color: 0xfbbf24 },
 { id: "gene", text: "Gene tokens", short: "Genes", color: 0x2dd4bf },
 { id: "learn", text: "Learned skill", short: "Learned", color: 0x94a3b8 },
 { id: "scar", text: "Scar from fall", short: "Scar", color: 0x78716c },
 { id: "hat", text: "Favorite hat", short: "Hat", color: 0x64748b },
 ],
 zones: [
 { id: "inherit", label: "Can inherit", accept: ["eye", "hair", "dimple", "parent", "gene"] },
 { id: "not", label: "Not inherited", accept: ["learn", "scar", "hat"] },
 ],
 onDone: completeSub,
 }),
 });
}

function s4({ overlay, setCoach, completeSub }) {
 setCoach("Push trait clarity higher.");
 labState.heat = 0.4;
 mountHeatLab(overlay, {
 scene: "traitLab", title: "Family Clue Lab", html: `<p>Reach &gt;= 75% - inherited vs not looks clear.</p>`,
 goalText: "Goal &gt;= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
 axis: "x", canvasAction: "stretch", sliderLabel: "Trait", badge: LAB_ASSET_PATHS.m1,
 onDone: completeSub,
 });
}

function s5({ overlay, setCoach, completeSub }) {
 setCoach("Order why traits can pass.");
 mountOrderSteps(overlay, {
 scene: "traitMeet", sceneArgs: { phase: "settle" }, title: "Why Traits Pass",
 instructions: "Order the story.",
 items: [{ id: "parent", html: "Parents have gene tokens" }, { id: "pass", html: "Tokens can pass to kids" }, { id: "show", html: "Traits may show (eyes, hair)" }, { id: "not", html: "Scars/skills are different" }],
 correctIds: ["parent", "pass", "show", "not"],
 onDone: () => mountQuiz(overlay, {
 scene: "traitMeet", title: "Check",
 q: "A scar from a fall is...",
 opts: ["Not an inherited trait", "A gene from parents", "Always eye color", "A hat style gene"],
 ok: 0, onDone: completeSub,
 }),
 });
}

function s6({ overlay, setCoach, completeSub }) {
 setCoach("Lock the trait rule.");
 mountEquationBuild(overlay, {
 scene: "traitRule", title: "Name the Trait Rule", instructions: "Tap in order.",
 tokens: [{ id: "a", html: "Genes" }, { id: "b", html: "can" }, { id: "c", html: "pass" }, { id: "d", html: "traits" }],
 correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
 onDone: () => mountTapContinue(overlay, {
 scene: "traitRule", badge: LAB_ASSET_PATHS.rule,
 html: `<h3>Rule locked</h3><p>Genes can pass traits from parents.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 });
}

function s7({ overlay, setCoach, completeSub }) {
 setCoach("Family stories - same inherit idea.");
 mountTapContinue(overlay, {
 scene: "traitStretch",
 html: `<h3>Family stories</h3><p>Tap contexts - family eye colors use the same inherit idea.</p>`,
 onDone: () => mountQuiz(overlay, {
 scene: "traitStretch", title: "Transfer",
 q: "Comparing parent and child eye color is about...",
 opts: ["Possible inherited traits", "Only hat fashion", "Only scars", "Phone chargers"],
 ok: 0, onDone: completeSub,
 }),
 });
}

function s8({ overlay, setCoach, completeSub }) {
 setCoach("Bust trait myths.");
 mountMythCards(overlay, {
 scene: "traitMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
 myths: [
 { claim: "Everything about you is inherited", truth: "Skills, scars, and choices are not gene traits", sceneMyth: 0 },
 { claim: "Traits never come from parents", truth: "Many traits can pass from parents via genes", sceneMyth: 1 },
 { claim: "Eye color is only a hat choice", truth: "Eye color is a classic inherited clue", sceneMyth: 2 },
 { claim: "A scar is a gene trait", truth: "A scar is from an event - not inherited", sceneMyth: 3 },
 { claim: "Only adults have traits", truth: "Kids show inherited traits too", sceneMyth: 4 },
 ],
 onDone: completeSub,
 });
}

function s9({ overlay, setCoach, completeSub }) {
 setCoach("Quick trait fluency.");
 mountSpeedDrill(overlay, {
 scene: "traitDrill", title: "Fluency Drill", passScene: "traitMastery",
 items: [
 { q: "Eye color can be inherited?", opts: ["Yes", "No"], ok: 0, prompt: "Eyes" },
 { q: "Scar inherited?", opts: ["No", "Yes"], ok: 0, prompt: "Scar" },
 { q: "Genes can pass traits?", opts: ["Yes", "No"], ok: 0, prompt: "Genes" },
 { q: "Favorite hat a gene trait?", opts: ["No", "Yes"], ok: 0, prompt: "Hat" },
 { q: "Dimples can be a trait clue?", opts: ["Yes", "No"], ok: 0, prompt: "Dimple" },
 { q: "Learned skill = gene trait?", opts: ["No", "Yes"], ok: 0, prompt: "Learn" },
 ],
 onDone: completeSub,
 });
}

function s10({ overlay, setCoach, completeSub }) {
 setCoach("Mastery - Trait Tracker.");
 mountOrderSteps(overlay, {
 scene: "traitMastery", title: "Trait Tracker Mastery", instructions: "Order your journey.",
 items: [{ id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" }, { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "win", html: "Win" }],
 correctIds: ["meet", "sort", "lab", "rule", "myth", "win"],
 onDone: () => mountTapContinue(overlay, {
 scene: "traitMastery", badge: LAB_ASSET_PATHS.m1,
 html: `<h3>\ud83d\udc6a Trait Tracker!</h3><p>You can sort inherited trait clues from non-inherited ones.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 });
}
