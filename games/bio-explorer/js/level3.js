/**
 * Bio Explorer - Mission 3: Plant Power
 */
import { bioLabState, BIO_ASSET_PATHS } from "./bio-state.js";
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
} from "./bio-activities.js";

export const L3_META = {
 objective: "By the end of this mission, you'll be able to explain plants in your own words.",
 bdHook: "Bangladesh everyday: mango trees, rice paddies, bees on flowers - plants power food with light.",
 predict: {
 q: "What do green plants mainly need to make food?",
 options: [
 "Only soil and nothing else",
 "Light, water, and air (CO₂) working together",
 "Phone chargers and Wi‑Fi",
 ],
 ok: 1,
 },

 kidTitle: "Plant Power",
 theme: "plants",
 emoji: "🍃",
 rewardName: "Plant Explorer",
 intro: "Plants make food with light, water, and air - then grow flowers, fruit, and more plants.",
 everyday: ["Mango trees", "Rice paddies", "Bees visiting flowers"],
 subTitles: [
 "Meet Plant Power",
 "Sun Energy Lab",
 "Sort: Plant Needs",
 "Grow Stages",
 "Food vs Soil",
 "Name the Plant Rule",
 "Stretch: BD Stories",
 "Myth Bust",
 "Fluency Drill",
 "Plant Explorer Mastery",
 ],
};

export function runL3Sub(subIndex, api) {
 const { registerTryAgain } = api;
 bioLabState.reveal = false;
 bioLabState.tokenProgress = 0;
 bioLabState.masteryStep = 0;
 bioLabState.placed = {};
 bioLabState.selectedId = null;
 bioLabState.mythPhase = "claim";
 bioLabState.heat = 0.25;
 bioLabState.sun = 0.25;
 bioLabState.phase = "seed";
 bioLabState.mode = "mango";
 bioLabState.labFocus = "sun";

 const runners = [
 sub1_meet,
 sub2_sun,
 sub3_sort,
 sub4_grow,
 sub5_food,
 sub6_rule,
 sub7_stretch,
 sub8_myths,
 sub9_drill,
 sub10_mastery,
 ];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => {
 api.overlay.innerHTML = "";
 fn(api);
 });
 fn(api);
}

function sub1_meet({ overlay, setCoach, completeSub }) {
 setCoach("Hook: seeds wait, then light + water + air help plants make food.");
 mountMotionChain(overlay, {
 title: "Meet Plant Power",
 beats: [
 {
 scene: "plantMeet",
 sceneArgs: { phase: "seed" },
 dwellMs: 4000,
 html: `${badgeHtml(BIO_ASSET_PATHS.plant, "plant")}
 <p><strong>Act 1:</strong> A seed is a living plant waiting to grow.</p>`,
 },
 {
 scene: "plantMeet",
 sceneArgs: { phase: "leaf" },
 dwellMs: 4200,
 html: `<p><strong>Act 2:</strong> Leaves catch light - plant food factories.</p>`,
 },
 {
 scene: "plantMeet",
 sceneArgs: { phase: "flower" },
 dwellMs: 4000,
 html: `<p><strong>Act 3:</strong> Flowers and fruit help make more plants.</p>`,
 },
 {
 scene: "plantMeet",
 sceneArgs: { phase: "fruit" },
 dwellMs: 3800,
 html: `<p><strong>Act 4:</strong> Big idea - plants make food; they don’t eat candy.</p>`,
 },
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "plantMeet",
 sceneArgs: { phase: "fruit" },
 title: "Exit check",
 q: "Where does most of a plant’s food energy come from?",
 opts: ["Light (with water and air)", "Eating soil like a sandwich", "Phone chargers", "Only fertilizer packets"],
 ok: 0,
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "plantMeet",
 badge: BIO_ASSET_PATHS.plant,
 html: `<h3>Plant Power online</h3><p>Next: drag sun energy and watch growth.</p>`,
 onDone: completeSub,
 advanceAfterDone: true,
 });
 },
 });
 },
 });
}

function sub2_sun({ overlay, setCoach, completeSub }) {
 setCoach("Lab: more light energy -> more plant food / growth (kid level).");
 bioLabState.heat = 0.3;
 bioLabState.sun = 0.3;
 bioLabState.labFocus = "sun";
 mountHeatLab(overlay, {
 scene: "plantLab",
 title: "Sun Energy Lab",
 html: `<p>Drag the <strong>sun</strong> handle - watch leaves, flower, then fruit.</p>`,
 goalText: "Goal: sun ≥ 65%.",
 doneLabel: "Sun checked ▶",
 threshold: 0.65,
 startHeat: 0.3,
 axis: "x",
 canvasAction: "stretch",
 sliderLabel: "Sun energy",
 syncKey: "sun",
 readoutLabels: {
 cold: "Dim - slow growth",
 melting: "Leaves working",
 liquid: "Flowering",
 simmer: "Fruit time - plant power!",
 },
 badge: BIO_ASSET_PATHS.plant,
 onDone: completeSub,
 });
}

function sub3_sort({ overlay, setCoach, completeSub }) {
 setCoach("Sort must-haves, helpers, and not-plant-food.");
 mountTapContinue(overlay, {
 scene: "plantSort",
 html: `<h3>Plant needs</h3>
 <p><strong>Must have:</strong> sun, water, air (CO₂).</p>
 <p><strong>Helps:</strong> soil minerals, bees (some plants).</p>
 <p><strong>Not plant food:</strong> candy, chargers, toys.</p>`,
 onDone: () => {
 mountDragSort(overlay, {
 scene: "plantSort",
 title: "Sort plant needs",
 instructions: "Drag into Must have, Helps, or Not plant food.",
 successText: "Plants make food - they don’t eat candy!",
 chips: [
 { id: "sun", text: "Sunlight", short: "Sun", color: 0xfbbf24 },
 { id: "water", text: "Water", short: "Water", color: 0x38bdf8 },
 { id: "air", text: "Air (CO₂)", short: "Air", color: 0xa5b4fc },
 { id: "soil", text: "Soil minerals", short: "Soil", color: 0xa16207 },
 { id: "candy", text: "Candy", short: "Candy", color: 0xf472b6 },
 { id: "phone", text: "Phone charger", short: "Charger", color: 0x94a3b8 },
 { id: "bee", text: "Bees (some plants)", short: "Bees", color: 0xf59e0b },
 { id: "toys", text: "Toys", short: "Toys", color: 0x78716c },
 ],
 zones: [
 { id: "need", label: "Must have", accept: ["sun", "water", "air"] },
 { id: "help", label: "Helps", accept: ["soil", "bee"] },
 { id: "no", label: "Not plant food", accept: ["candy", "phone", "toys"] },
 ],
 onDone: completeSub,
 });
 },
 });
}

function sub4_grow({ overlay, setCoach, completeSub }) {
 setCoach("Push sun high - read Seed → Leaf → Flower → Fruit stage chips.");
 bioLabState.heat = 0.4;
 bioLabState.sun = 0.4;
 bioLabState.labFocus = "stages";
 mountHeatLab(overlay, {
 scene: "plantLab",
 title: "Grow Stages",
 html: `<p>Reach 80% sun energy to unlock full <strong>stage chips</strong> (seed → fruit).</p>`,
 goalText: "Goal: sun ≥ 80%.",
 doneLabel: "Stages seen ▶",
 threshold: 0.8,
 startHeat: 0.4,
 axis: "x",
 canvasAction: "stretch",
 sliderLabel: "Growth stages",
 syncKey: "sun",
 readoutLabels: {
 cold: "Stage: seed",
 melting: "Stage: leaf",
 liquid: "Stage: flower",
 simmer: "Stage: fruit",
 },
 badge: BIO_ASSET_PATHS.plant,
 onDone: () => {
 mountQuiz(overlay, {
 scene: "plantLab",
 title: "Check",
 q: "What order best matches plant stages?",
 opts: [
 "Seed → leaf → flower → fruit",
 "Fruit → seed → candy → phone",
 "Only flower forever",
 "Soil → candy → toy",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
}

function sub5_food({ overlay, setCoach, completeSub }) {
 setCoach("Soil helps with minerals - food is made with light.");
 mountOrderSteps(overlay, {
 scene: "plantMeet",
 sceneArgs: { phase: "leaf" },
 title: "Food vs soil",
 instructions: "Order how plant food is made (kid level).",
 items: [
 { id: "light", html: "Catch light" },
 { id: "water", html: "Use water" },
 { id: "air", html: "Use air (CO2)" },
 { id: "food", html: "Make plant food" },
 ],
 correctIds: ["light", "water", "air", "food"],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "plantMeet",
 sceneArgs: { phase: "leaf" },
 title: "Check",
 q: "Soil mainly gives plants...",
 opts: [
 "Minerals / anchorage - not the main ‘meal’ like light-made food",
 "Candy energy",
 "Phone signal",
 "Only darkness",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
}

function sub6_rule({ overlay, setCoach, completeSub }) {
 setCoach("Build the plant food rule.");
 mountEquationBuild(overlay, {
 scene: "plantRule",
 title: "Name the Plant Rule",
 instructions: "Tap tokens in order.",
 tokens: [
 { id: "a", html: "Light" },
 { id: "b", html: "+" },
 { id: "c", html: "water" },
 { id: "d", html: "+" },
 { id: "e", html: "air" },
 { id: "f", html: "-> food" },
 ],
 correctIds: ["a", "b", "c", "d", "e", "f"],
 badge: BIO_ASSET_PATHS.plantRule,
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "plantRule",
 badge: BIO_ASSET_PATHS.plantRule,
 html: `<h3>Plant rule locked</h3><p>Plants make food using light, water, and air.</p>`,
 onDone: completeSub,
 advanceAfterDone: true,
 });
 },
 });
}

function sub7_stretch({ overlay, setCoach, completeSub }) {
 setCoach("Mango, rice, rose, bamboo, algae - same plant power.");
 const modes = [
 { mode: "mango", html: `${badgeHtml(BIO_ASSET_PATHS.plant, "plant")}<p><strong>Mango:</strong> Leaves catch light for sweet fruit.</p>` },
 { mode: "rice", html: `<p><strong>Rice paddy:</strong> Plants feed a nation with light-made food.</p>` },
 { mode: "rose", html: `<p><strong>Rose:</strong> Flowers need light too.</p>` },
 { mode: "bamboo", html: `<p><strong>Bamboo:</strong> Fast-growing plant power.</p>` },
 { mode: "algae", html: `<p><strong>Algae:</strong> Tiny pond plants still make food with light.</p>` },
 ];
 let step = 0;
 function show() {
 if (step >= modes.length) {
 mountQuiz(overlay, {
 scene: "plantStretch",
 sceneArgs: { mode: "rice" },
 title: "Transfer",
 q: "Rice plants in a paddy mainly get food energy from...",
 opts: ["Sunlight (plus water & air)", "Eating mud", "Boat engines", "Only fertilizer bags"],
 ok: 0,
 onDone: completeSub,
 });
 return;
 }
 const m = modes[step];
 bioLabState.mode = m.mode;
 mountTapContinue(overlay, {
 scene: "plantStretch",
 sceneArgs: { mode: m.mode },
 html: `<div class="lab-demo__badge">Context ${step + 1} of ${modes.length}</div>${m.html}`,
 onDone: () => {
 step++;
 show();
 },
 });
 }
 show();
}

function sub8_myths({ overlay, setCoach, completeSub }) {
 setCoach("Bust plant myths.");
 mountMythCards(overlay, {
 scene: "plantMyth",
 title: "Myth Bust",
 badge: BIO_ASSET_PATHS.myth,
 myths: [
 { claim: "Plants eat soil for food", truth: "Soil helps with minerals - food is made with light", sceneMyth: 0 },
 { claim: "Plants don’t need air", truth: "Plants use air (CO₂) when they make food", sceneMyth: 1 },
 { claim: "Seeds are dead until they sprout", truth: "Seeds can be dormant living plants", sceneMyth: 2 },
 { claim: "Only green leaves matter", truth: "Roots, stems, and flowers are plant parts too", sceneMyth: 3 },
 { claim: "Bees make the plant’s food", truth: "Bees help pollinate - leaves still make food", sceneMyth: 4 },
 ],
 onDone: completeSub,
 });
}

function sub9_drill({ overlay, setCoach, completeSub }) {
 setCoach("Quick plant fluency.");
 mountSpeedDrill(overlay, {
 scene: "plantDrill",
 title: "Fluency Drill",
 passScene: "plantMastery",
 items: [
 { q: "Sunlight helps plants make food?", opts: ["Yes", "No"], ok: 0, prompt: "Sun" },
 { q: "Candy is plant food?", opts: ["Yes", "No"], ok: 1, prompt: "Candy" },
 { q: "Seeds can be living?", opts: ["Yes", "No"], ok: 0, prompt: "Seed" },
 { q: "Plants eat soil as their meal?", opts: ["Yes", "No"], ok: 1, prompt: "Soil" },
 { q: "Rice uses light energy?", opts: ["Yes", "No"], ok: 0, prompt: "Rice" },
 { q: "Bees replace photosynthesis?", opts: ["Yes", "No"], ok: 1, prompt: "Bees" },
 ],
 onDone: completeSub,
 });
}

function sub10_mastery({ overlay, setCoach, completeSub }) {
 setCoach("Mastery - Plant Explorer.");
 mountOrderSteps(overlay, {
 scene: "plantMastery",
 title: "Plant Explorer Mastery",
 instructions: "Order your Plant Power journey.",
 items: [
 { id: "meet", html: "Meet" },
 { id: "sort", html: "Sort" },
 { id: "lab", html: "Lab" },
 { id: "rule", html: "Rule" },
 { id: "myth", html: "Myth" },
 { id: "explorer", html: "Explorer" },
 ],
 correctIds: ["meet", "sort", "lab", "rule", "myth", "explorer"],
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "plantMastery",
 badge: BIO_ASSET_PATHS.plant,
 html: `<h3>🍃 Plant Explorer!</h3><p>You know plants make food with light - mango to rice.</p>`,
 onDone: completeSub,
 advanceAfterDone: true,
 });
 },
 });
}
