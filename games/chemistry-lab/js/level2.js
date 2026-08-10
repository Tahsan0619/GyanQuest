/**
 * Chemistry Lab - Mission 2: Element Hunt
 * 10 sub-levels, Bruner spiral: enactive -> iconic -> symbolic.
 * Theme: an element is matter made of only one kind of atom.
 */
import { chemLabState } from "./atom-scenes.js";
import { ELEM_ASSET_PATHS } from "./element-scenes.js";
import {
 mountMotionChain,
 mountDragSort,
 mountHeatLab,
 mountRevealSteps,
 mountEquationBuild,
 mountQuiz,
 mountSpeedDrill,
 mountOrderSteps,
 mountMythCards,
 mountTapContinue,
 mountScaleLab,
 mountMultiQuiz,
 playScene,
 badgeHtml,
} from "./chem-activities.js?v=elemhunt6";

export const L2_META = {
 objective: "By the end of this mission, you'll be able to explain elements in your own words.",
 bdHook: "Bangladesh everyday: notice elements around you - then connect it to Element Hunt.",
 predict: {
 q: "Before we start - what do you think matters most in Element Hunt?",
 options: [
 "Guessing without checking",
 "Looking for a clear pattern or rule",
 "Skipping the practice steps",
 ],
 ok: 1,
 },

 kidTitle: "Element Hunt",
 theme: "elements",
 emoji: "🔎",
 rewardName: "Element Scout",
 intro:
 "Some everyday stuff is made of only one kind of atom - that is an element. Hunt iron-like metal, copper wire, and oxygen in air, then name a rule you can reuse anywhere.",
 everyday: [
 "Grey bottle = iron-like metal",
 "Amber bottle = copper-like wire metal",
 "Blue bottle = oxygen in air",
 ],
 subTitles: [
 "Meet Element Hunt",
 "Iron: One Atom Kind",
 "Sort: Element or Not?",
 "Copper Wire Lab",
 "Why O₂ Is Still an Element",
 "Name the Element Rule",
 "Stretch: New Contexts",
 "Myth Bust",
 "Fluency Drill",
 "Element Hunt Mastery",
 ],
};

/**
 * @param {number} subIndex
 * @param {{
 * overlay: HTMLElement,
 * setCoach: (html: string, aside?: string) => void,
 * completeSub: () => void,
 * registerTryAgain: (fn: () => void) => void,
 * }} api
 */
export function runL2Sub(subIndex, api) {
 const { registerTryAgain } = api;
 chemLabState.reveal = false;
 chemLabState.tokenProgress = 0;
 chemLabState.masteryStep = 0;
 chemLabState.sortPlaced = 0;
 chemLabState.placed = {};
 chemLabState.selectedId = null;
 chemLabState.mythBusted = false;
 chemLabState.mythPhase = "claim";
 chemLabState.scale = 0;
 chemLabState.mode = "gold";
 chemLabState.elemPhase = "shelf";
 chemLabState.phase = "shelf";
 chemLabState.elemKind = "iron";
 chemLabState.wireStretch = 0;
 chemLabState.o2Split = 0;
 chemLabState.huntFound = {};
 chemLabState.heat = 0.12;
 chemLabState.heatTarget = 0.12;

 const runners = [
 sub1_meet,
 sub2_iron,
 sub3_sort,
 sub4_copper,
 sub5_oxygen,
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
 setCoach(
 "Hook: three desk samples. Tap bottles on the canvas - each zoom cloud shows only one atom kind.",
 );
 mountMotionChain(overlay, {
 title: "Meet Element Hunt",
 beats: [
 {
 scene: "elemMeet",
 sceneArgs: { phase: "shelf" },
 dwellMs: 4200,
 html: `${badgeHtml(ELEM_ASSET_PATHS.hunt, "hunt")}
 <p><strong>Act 1 - Shelf hunt:</strong> Drag the grey, amber, and blue bottles. Tap one to inspect.</p>
 <p>We are hunting <em>pure</em> samples - candidates for elements.</p>`,
 },
 {
 scene: "elemMeet",
 sceneArgs: { phase: "zoom" },
 dwellMs: 4500,
 html: `<p><strong>Act 2 - Zoom:</strong> Drag the <strong>yellow magnifier</strong> over each bottle.</p>
 <p>Iron shows <strong>Fe</strong> atoms, copper shows <strong>Cu</strong>, oxygen shows <strong>O</strong> pairs - one kind each.</p>`,
 },
 {
 scene: "elemMeet",
 sceneArgs: { phase: "predict" },
 dwellMs: 4000,
 html: `<p><strong>Act 3 - Predict:</strong> Can oxygen gas (O₂) still be an element if atoms pair up?</p>
 <p>Hold that thought - we will settle it after copper and oxygen labs.</p>`,
 },
 {
 scene: "elemMeet",
 sceneArgs: { phase: "settle" },
 dwellMs: 3800,
 html: `<p><strong>Act 4 - Big idea:</strong> An <strong>element</strong> is matter made of only one kind of atom.</p>
 <p>Compounds mix atom kinds by bonding. Mixtures keep different substances side by side.</p>`,
 },
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "elemMeet",
 sceneArgs: { phase: "cloud" },
 title: "Exit check",
 q: "What makes a sample a candidate for an element in this lab?",
 opts: [
 "It is made of only one kind of atom",
 "It looks shiny",
 "It is always a gas",
 "It must be a mixture of metals",
 ],
 ok: 0,
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "elemMeet",
 sceneArgs: { phase: "shelf" },
 badge: ELEM_ASSET_PATHS.orbit,
 html: `<h3>You met Element Hunt</h3><p>Next: pack an iron-like lattice - every atom the same kind (Fe).</p>`,
 onDone: completeSub,
 advanceAfterDone: true,
 });
 },
 });
 },
 });
}

function sub2_iron({ overlay, setCoach, completeSub }) {
 setCoach("Iconic: iron-like metal is a packed lattice of identical Fe atoms - not a compound.");
 mountMotionChain(overlay, {
 title: "Iron: One Atom Kind",
 beats: [
 {
 scene: "elemIron",
 sceneArgs: { assemble: false },
 dwellMs: 3600,
 html: `${badgeHtml(ELEM_ASSET_PATHS.iron, "iron")}
 <p><strong>Act 1:</strong> Grey bottle on the desk stands for an iron-like metal sample.</p>`,
 },
 {
 scene: "elemIron",
 sceneArgs: { assemble: true },
 dwellMs: 4800,
 html: `<p><strong>Act 2 - Pack:</strong> Tap the metal or lattice on the canvas to add more Fe atoms.</p>
 <p>Every sphere is the same kind. That is why we call it an <strong>element</strong>.</p>`,
 },
 {
 scene: "elemIron",
 sceneArgs: { assemble: true },
 dwellMs: 4000,
 html: `<p><strong>Act 3:</strong> Rust later can turn iron into a compound - but pure metal starts as one atom kind.</p>`,
 },
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "elemIron",
 sceneArgs: { assemble: true },
 title: "Quick check",
 q: "Why does the iron lattice count as an element model?",
 opts: [
 "Every atom in the model is the same kind (Fe)",
 "Because metal is always hot",
 "Because bottles are always elements",
 "Because lattices only exist in compounds",
 ],
 ok: 0,
 onDone: () => {
 mountQuiz(overlay, {
 scene: "elemIron",
 title: "Compare",
 q: "Rust (iron + oxygen bonded) is best called...",
 opts: [
 "A compound - more than one atom kind bonded",
 "Still pure element iron",
 "Only a mixture of light",
 "Not matter at all",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function sub3_sort({ overlay, setCoach, completeSub }) {
 setCoach("Enactive sort: element vs compound vs mixture - drag on the canvas or use chips.");
 chemLabState.reveal = false;
 mountTapContinue(overlay, {
 scene: "elemSort",
 html: `<h3>Element / Compound / Mixture</h3>
 <p><strong>Element:</strong> one atom kind (Fe, Cu, O₂, He).</p>
 <p><strong>Compound:</strong> bonded different kinds (H₂O, NaCl).</p>
 <p><strong>Mixture:</strong> different substances side by side (air, brass).</p>`,
 onDone: () => {
 mountDragSort(overlay, {
 scene: "elemSort",
 title: "Sort the samples",
 instructions: "Drag each chip into Element, Compound, or Mixture.",
 successText: "Nice sort - element, compound, mixture!",
 chips: [
 { id: "fe", text: "Iron nail", short: "Fe", color: 0x94a3b8 },
 { id: "cu", text: "Copper wire", short: "Cu", color: 0xf59e0b },
 { id: "o2", text: "Oxygen gas", short: "O₂", color: 0x38bdf8 },
 { id: "he", text: "Helium balloon", short: "He", color: 0x67e8f9 },
 { id: "h2o", text: "Water H₂O", short: "H₂O", color: 0x60a5fa },
 { id: "nacl", text: "Table salt", short: "NaCl", color: 0xe2e8f0 },
 { id: "air", text: "Room air", short: "Air", color: 0x93c5fd },
 { id: "brass", text: "Brass Cu+Zn", short: "Brass", color: 0xfbbf24 },
 ],
 zones: [
 { id: "element", label: "Element", accept: ["fe", "cu", "o2", "he"] },
 { id: "compound", label: "Compound", accept: ["h2o", "nacl"] },
 { id: "mixture", label: "Mixture", accept: ["air", "brass"] },
 ],
 onDone: () => {
 chemLabState.reveal = true;
 mountQuiz(overlay, {
 scene: "elemSort",
 title: "Justify",
 q: "Why is room air a mixture, not an element?",
 opts: [
 "It blends several gases (N₂, O₂, ...) that keep their own identities",
 "Because air is invisible",
 "Because air is only oxygen",
 "Because mixtures cannot contain elements",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function sub4_copper({ overlay, setCoach, completeSub }) {
 setCoach("Try it: stretch copper wire - shape changes, atom kind stays Cu.");
 chemLabState.wireStretch = 0.1;
 chemLabState.heat = 0.1;
 chemLabState.heatTarget = 0.1;
 mountHeatLab(overlay, {
 scene: "elemCopper",
 title: "Copper Wire Lab",
 html: `<p>Drag the amber handle on the canvas or use +/− here. Stretch until the readout hits the goal.</p>
 <p>Atom kind stays <strong>Cu</strong> - only the shape changes.</p>`,
 goalText: "Goal: stretch ≥ 75% while watching Cu atoms on the wire.",
 doneLabel: "Wire stretched ▶",
 threshold: 0.75,
 startHeat: 0.1,
 axis: "x",
 canvasAction: "stretch",
 sliderLabel: "Wire stretch",
 syncKey: "wireStretch",
 readoutLabels: {
 cold: "Barely stretched",
 melting: "Pulling longer...",
 liquid: "Long wire - still Cu",
 simmer: "Fully stretched - still element copper",
 },
 badge: ELEM_ASSET_PATHS.copper,
 onDone: () => {
 mountRevealSteps(overlay, {
 scene: "elemCopper",
 title: "What stayed the same?",
 steps: [
 { html: "<p>The wire got longer - that is a physical change of shape.</p>" },
 { html: "<p>Every model atom is still copper (Cu) - one kind.</p>" },
 { html: "<p>So stretched copper is still the element copper.</p>" },
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "elemCopper",
 title: "Check",
 q: "Stretching copper wire mainly changes...",
 opts: [
 "Shape / arrangement - not which element it is",
 "Copper into oxygen",
 "An element into a mixture of light",
 "Atoms into thoughts",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function sub5_oxygen({ overlay, setCoach, completeSub }) {
 setCoach("Explain: O₂ pairs are still element oxygen - only O atoms, bonded in pairs.");
 chemLabState.o2Split = 0;
 mountMotionChain(overlay, {
 title: "Why O₂ Is Still an Element",
 beats: [
 {
 scene: "elemOxygen",
 sceneArgs: {},
 dwellMs: 4000,
 html: `${badgeHtml(ELEM_ASSET_PATHS.oxygen, "oxygen")}
 <p><strong>Act 1:</strong> Blue bottle = oxygen-rich air sample. Molecules drift as O₂ pairs.</p>`,
 },
 {
 scene: "elemOxygen",
 dwellMs: 4500,
 html: `<p><strong>Act 2:</strong> Tap the gas cloud. Pairs can loosen in the model - atoms are still oxygen.</p>
 <p>Element ≠ “must be single atoms floating alone.”</p>`,
 },
 {
 scene: "elemOxygen",
 dwellMs: 4000,
 html: `<p><strong>Act 3:</strong> Water (H₂O) needs hydrogen <em>and</em> oxygen - that is a compound.</p>`,
 },
 ],
 onDone: () => {
 mountRevealSteps(overlay, {
 scene: "elemOxygen",
 title: "Chain it",
 steps: [
 { html: "<p>O₂ contains only oxygen atoms.</p>" },
 { html: "<p>Bonding two O atoms does not create a new atom kind.</p>" },
 { html: "<p>Therefore O₂ is classified as the element oxygen.</p>" },
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "elemOxygen",
 title: "Check",
 q: "O₂ is an element because...",
 opts: [
 "It contains only one kind of atom (oxygen)",
 "It is a liquid at all times",
 "It contains hydrogen too",
 "Gases cannot be elements",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function sub6_rule({ overlay, setCoach, completeSub }) {
 setCoach("Symbolic: build the rule, then scrub sample → one atom kind → ELEMENT name.");
 mountEquationBuild(overlay, {
 scene: "elemRule",
 title: "Build the element rule",
 instructions: "Tap tokens in order to build the rule sentence.",
 tokens: [
 { id: "a", html: "One kind" },
 { id: "b", html: "of atom" },
 { id: "c", html: "makes an" },
 { id: "d", html: "ELEMENT" },
 ],
 correctIds: ["a", "b", "c", "d"],
 onDone: () => {
 mountScaleLab(overlay, {
 scene: "elemRule",
 title: "Name the Element Rule",
 html: `<p>Scrub the left canvas: desk samples → one-kind atom cloud → the word <strong>ELEMENT</strong>.</p>
 <p>You are naming identity - which samples are made of only one kind of atom.</p>`,
 sliderLabel: "Identity scale: sample → one atom kind → ELEMENT",
 goalText: "Canvas shows Fe / Cu / O₂ samples, then only one atom kind, then the element name.",
 readoutLabels: {
 low: "Desk samples (Fe, Cu, O₂ bottles)",
 mid: "One atom kind in the cloud (still Fe or Cu or O)",
 high: "Name it: ELEMENT = only one kind of atom",
 },
 start: 0.1,
 threshold: 0.85,
 onDone: () => {
 mountQuiz(overlay, {
 scene: "elemRule",
 title: "Name it",
 q: "Pick the best definition for this mission.",
 opts: [
 "An element is matter made of only one kind of atom",
 "An element is any shiny solid",
 "An element is any mixture of gases",
 "An element is heat without particles",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function sub7_stretch({ overlay, setCoach, completeSub }) {
 setCoach("Stretch: same one-kind rule on gold, foil, charcoal, helium, graphite - tap each object on the canvas.");
 const modes = [
 { mode: "gold", title: "Gold ring", blurb: "Jewelry gold is the element Au - one atom kind in a ring shape." },
 { mode: "foil", title: "Aluminum foil", blurb: "Kitchen foil is Al atoms packed flat - still an element." },
 { mode: "charcoal", title: "Charcoal", blurb: "Burnt-wood charcoal is mostly carbon (C) - one atom kind." },
 { mode: "helium", title: "Helium balloon", blurb: "Party balloons use He atoms - still an element (not air)." },
 { mode: "graphite", title: "Pencil graphite", blurb: "Pencil “lead” is carbon layers - still element C." },
 ];
 let i = 0;
 function step() {
 if (i >= modes.length) {
 mountQuiz(overlay, {
 scene: "elemStretch",
 sceneArgs: { mode: "helium" },
 title: "Transfer",
 q: "A helium balloon and an iron nail are both elements because...",
 opts: [
 "Each is made of only one kind of atom (He vs Fe)",
 "Both are metals",
 "Both are mixtures with air",
 "Both contain water",
 ],
 ok: 0,
 onDone: completeSub,
 });
 return;
 }
 const m = modes[i++];
 chemLabState.mode = m.mode;
 mountTapContinue(overlay, {
 scene: "elemStretch",
 sceneArgs: { mode: m.mode },
 html: `<h3>${m.title}</h3><p>${m.blurb}</p><p>Tap the matching sample chip on the canvas, then continue.</p>`,
 onDone: step,
 });
 }
 step();
}

function sub8_myths({ overlay, setCoach, completeSub }) {
 setCoach("Myth bust: water, air, salt, rust, and O₂ - claim first, then truth on the canvas.");
 mountMythCards(overlay, {
 scene: "elemMyth",
 title: "Element myths",
 myths: [
 {
 title: "Water myth",
 claim: "Water is an element.",
 truth: "Water is H₂O - a compound of hydrogen and oxygen.",
 sceneMyth: 0,
 },
 {
 title: "Air myth",
 claim: "Air is an element.",
 truth: "Air is a mixture of several gases, mainly N₂ and O₂.",
 sceneMyth: 1,
 },
 {
 title: "Salt myth",
 claim: "Table salt is an element.",
 truth: "Salt is NaCl - sodium and chlorine bonded (compound).",
 sceneMyth: 2,
 },
 {
 title: "Rust myth",
 claim: "Rust is still pure iron element.",
 truth: "Rust is a compound formed when iron reacts with oxygen.",
 sceneMyth: 3,
 },
 {
 title: "O₂ myth",
 claim: "O₂ cannot be an element because atoms are paired.",
 truth: "O₂ is still element oxygen - only one atom kind, bonded in pairs.",
 sceneMyth: 4,
 },
 ],
 onDone: completeSub,
 });
}

function sub9_drill({ overlay, setCoach, completeSub }) {
 setCoach("Fluency drill - about 80% correct to pass. Canvas flashes each prompt.");
 mountSpeedDrill(overlay, {
 scene: "elemDrill",
 passScene: "elemMastery",
 title: "Element Hunt Speed Drill",
 passRatio: 0.8,
 passMessage: "Nice fluency with the element rule.",
 items: [
 { q: "Iron nail (pure) -> ?", opts: ["Element", "Compound", "Mixture", "Not matter"], ok: 0, prompt: "Iron nail?" },
 { q: "Water H₂O -> ?", opts: ["Compound", "Element", "Only heat", "Mixture of light"], ok: 0, prompt: "Water?" },
 { q: "O₂ gas -> ?", opts: ["Element", "Compound of H and O", "Mixture only", "Not matter"], ok: 0, prompt: "O₂?" },
 { q: "Room air -> ?", opts: ["Mixture", "Single element", "Pure compound", "Idea"], ok: 0, prompt: "Air?" },
 { q: "Copper wire -> ?", opts: ["Element", "Compound NaCl", "Mixture brass", "Photon"], ok: 0, prompt: "Copper?" },
 { q: "Brass (Cu+Zn) -> ?", opts: ["Mixture (alloy)", "Element", "Single atom kind", "Not matter"], ok: 0, prompt: "Brass?" },
 { q: "Helium balloon -> ?", opts: ["Element", "Compound H₂O", "Mixture rust", "Salt"], ok: 0, prompt: "Helium?" },
 { q: "Best element definition?", opts: ["One atom kind", "Any liquid", "Any shiny rock", "Any gas mix"], ok: 0, prompt: "Definition?" },
 ],
 onDone: () => {
 playScene("elemMastery");
 mountTapContinue(overlay, {
 scene: "elemMastery",
 html: `<h3>Drill cleared</h3><p>You are fluent enough for the mastery path.</p>`,
 onDone: completeSub,
 advanceAfterDone: true,
 });
 },
 });
}

function sub10_mastery({ overlay, setCoach, completeSub }) {
 setCoach("Mastery: order the Element Hunt path, then prove the rule on mixed cases.");
 playScene("elemMastery");
 mountOrderSteps(overlay, {
 scene: "elemMastery",
 title: "Path check",
 instructions: "Tap the story beats in the order you learned them.",
 items: [
 { id: "1", html: "Meet samples" },
 { id: "2", html: "Iron lattice" },
 { id: "3", html: "Sort E / C / M" },
 { id: "4", html: "Copper + oxygen" },
 { id: "5", html: "Name the rule" },
 ],
 correctIds: ["1", "2", "3", "4", "5"],
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "elemMastery",
 html: `<h3>Mixed cases</h3><p>Apply the rule one more time - then claim Element Scout.</p>`,
 onDone: () => {
 mountMultiQuiz(overlay, {
 scene: "elemMastery",
 title: "Element Scout checks",
 items: [
 {
 q: "Gold ring vs salty water - which is the element?",
 opts: ["Gold ring", "Salty water", "Neither", "Both equally compounds"],
 ok: 0,
 },
 {
 q: "Why is O₂ an element but H₂O is not?",
 opts: [
 "O₂ has one atom kind; H₂O has two bonded kinds",
 "O₂ is heavier",
 "H₂O is a metal",
 "Gases cannot form compounds",
 ],
 ok: 0,
 },
 {
 q: "Pick the element rule.",
 opts: [
 "Matter made of only one kind of atom",
 "Any substance that pours",
 "Any mixture with air",
 "Anything on a desk",
 ],
 ok: 0,
 },
 ],
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "elemMastery",
 badge: ELEM_ASSET_PATHS.orbit,
 html: `<h3>🔎 Element Hunt complete</h3>
 <p>You earned the path to <strong>Element Scout</strong>. Compounds and bonds wait in Bond Buddies.</p>`,
 onDone: completeSub,
 advanceAfterDone: true,
 });
 },
 });
 },
 });
 },
 });
}
