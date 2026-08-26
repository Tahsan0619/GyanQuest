/**
 * Chemistry Lab - Mission 3: Bond Buddies
 * 10 sub-levels, Bruner spiral. Theme: bonds hold atoms together as buddies.
 */
import { chemLabState } from "./atom-scenes.js?v=elemhunt7";
import { BOND_ASSET_PATHS } from "./bond-scenes.js?v=bond1";
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
} from "./chem-activities.js?v=elemhunt7";

export const L3_META = {
 objective: "By the end of this mission, you'll be able to explain bonds in your own words.",
 bdHook: "Bangladesh everyday: notice bonds around you - then connect it to Bond Buddies.",
 predict: {
 q: "Before we start - what do you think matters most in Bond Buddies?",
 options: [
 "Guessing without checking",
 "Looking for a clear pattern or rule",
 "Skipping the practice steps",
 ],
 ok: 1,
 },

 kidTitle: "Bond Buddies",
 theme: "bonds",
 emoji: "🤝",
 rewardName: "Bond Explorer",
 intro:
 "Atoms rarely live alone in everyday stuff. Bonds are the links that hold atom friends together - like magnets clicking or water droplets sticking. Hunt the idea, then name the rule.",
 everyday: [
 "Crane magnet pulling a cup closer",
 "Magnets clicking together",
 "Water droplets sticking in a bowl",
 ],
 subTitles: [
 "Meet Bond Buddies",
 "Attraction Pull",
 "Sort: Bond or Not?",
 "Magnet Snap Lab",
 "Why Water Sticks",
 "Name the Bond Rule",
 "Stretch: New Contexts",
 "Myth Bust",
 "Fluency Drill",
 "Bond Buddies Mastery",
 ],
};

export function runL3Sub(subIndex, api) {
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
 chemLabState.mode = "salt";
 chemLabState.bondSnap = 0;
 chemLabState.magnetGap = 1;
 chemLabState.dropMerge = 0;
 chemLabState.bondKind = "ionic";
 chemLabState.bondPhase = "desk";
 chemLabState.phase = "desk";
 chemLabState.heat = 0.12;
 chemLabState.heatTarget = 0.12;

 const runners = [
 sub1_meet,
 sub2_attract,
 sub3_sort,
 sub4_snap,
 sub5_water,
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
 setCoach("Hook: lonely atoms become bond buddies when a link forms - tap them on the canvas.");
 mountMotionChain(overlay, {
 title: "Meet Bond Buddies",
 beats: [
 {
 scene: "bondMeet",
 sceneArgs: { phase: "desk" },
 dwellMs: 4000,
 html: `${badgeHtml(BOND_ASSET_PATHS.buddies, "bonds")}
 <p><strong>Act 1 - Desk:</strong> Drag the magnets and cup - everyday clues that things pull and stick.</p>`,
 },
 {
 scene: "bondMeet",
 sceneArgs: { phase: "link" },
 dwellMs: 4500,
 html: `<p><strong>Act 2 - Link:</strong> Tap atoms A and B. A glowing link appears - that is our bond buddy model.</p>`,
 },
 {
 scene: "bondMeet",
 sceneArgs: { phase: "glow" },
 dwellMs: 4000,
 html: `<p><strong>Act 3 - Glow:</strong> Bonds are not craft glue. They are lasting electrical links between atoms.</p>`,
 },
 {
 scene: "bondMeet",
 sceneArgs: { phase: "settle" },
 dwellMs: 3800,
 html: `<p><strong>Act 4 - Big idea:</strong> Drag props - molecules exist because bonds hold atom friends together.</p>`,
 },
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "bondMeet",
 sceneArgs: { phase: "settle" },
 title: "Exit check",
 q: "In this lab, a bond is best described as...",
 opts: [
 "A lasting link that holds atoms together",
 "A flashlight beam",
 "A pile of sand with no atoms",
 "Only a drawing with no meaning",
 ],
 ok: 0,
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "bondMeet",
 sceneArgs: { phase: "desk" },
 badge: BOND_ASSET_PATHS.buddies,
 html: `<h3>You met Bond Buddies</h3><p>Next: pull opposite magnets closer - attraction buddy feel.</p>`,
 onDone: completeSub,
 advanceAfterDone: true,
 });
 },
 });
 },
 });
}

function sub2_attract({ overlay, setCoach, completeSub }) {
 setCoach("Watch, then pull: opposite magnets attract - a kid-friendly model for ionic pull.");
 chemLabState.magnetGap = 0.85;
 chemLabState.heat = 0.15;
 chemLabState.heatTarget = 0.15;
 mountMotionChain(overlay, {
 title: "Attraction Pull",
 beats: [
 {
 scene: "bondMagnet",
 dwellMs: 3600,
 html: `<p><strong>Act 1:</strong> Crane-style magnet and cup - forces can pull objects closer.</p>`,
 },
 {
 scene: "bondMagnet",
 dwellMs: 4000,
 html: `<p><strong>Act 2:</strong> N and S magnets model how opposite charges can buddy up.</p>`,
 },
 ],
 onDone: () => {
 mountHeatLab(overlay, {
 scene: "bondMagnet",
 title: "Pull them together",
 html: `<p>Drag each magnet on the canvas or use +/− / the slider until they nearly click (≥ 70%).</p>
 <p>Opposite poles = everyday analogy for attraction bonds.</p>`,
 goalText: "Goal: close the gap until the bond glow appears.",
 doneLabel: "Attraction felt ▶",
 threshold: 0.7,
 startHeat: 0.15,
 sliderLabel: "Attraction pull",
 readoutLabels: {
 cold: "Far apart - weak pull",
 melting: "Closing in...",
 liquid: "Strong pull - almost holding",
 simmer: "Held together - bond buddy feel",
 },
 badge: BOND_ASSET_PATHS.magnet,
 onDone: () => {
 mountQuiz(overlay, {
 scene: "bondMagnet",
 title: "Check",
 q: "Why do we show N and S magnets in a bonding lesson?",
 opts: [
 "As an everyday analogy for opposites attracting",
 "Because magnets are made of water only",
 "Because bonds are literally fridge magnets",
 "Because magnets create new elements",
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
 setCoach("Sort: real bonded molecules, attraction buddies, or no chemical bond (just nearby).");
 chemLabState.reveal = false;
 mountTapContinue(overlay, {
 scene: "bondSort",
 html: `<h3>Bond or not?</h3>
 <p><strong>Bonded:</strong> H₂O, O₂, CO₂ - atoms linked as molecules.</p>
 <p><strong>Attraction buddy:</strong> Na⁺/Cl⁻, magnet snap - useful models of pull.</p>
 <p><strong>No chemical bond:</strong> air gases near each other, sand in water - mixtures.</p>`,
 onDone: () => {
 mountDragSort(overlay, {
 scene: "bondSort",
 title: "Sort bond stories",
 instructions: "Drag into Bonded molecule, Attraction buddy, or No chemical bond.",
 successText: "Nice sort - bonded, attraction, or no bond!",
 chips: [
 { id: "h2o", text: "H₂O molecule", short: "H₂O", color: 0x60a5fa },
 { id: "o2", text: "O₂ pair", short: "O₂", color: 0x38bdf8 },
 { id: "co2", text: "CO₂ molecule", short: "CO₂", color: 0x94a3b8 },
 { id: "nacl", text: "Na⁺ Cl⁻ salt", short: "NaCl", color: 0xf472b6 },
 { id: "magnet", text: "N-S magnet snap", short: "Magnet", color: 0xef4444 },
 { id: "fe", text: "Lone Fe atom", short: "Fe", color: 0x94a3b8 },
 { id: "air", text: "N₂ near O₂ (air)", short: "Air", color: 0x93c5fd },
 { id: "sand", text: "Sand in water", short: "Sand", color: 0xfbbf24 },
 ],
 zones: [
 { id: "bonded", label: "Bonded molecule", accept: ["h2o", "o2", "co2"] },
 { id: "attraction", label: "Attraction buddy", accept: ["nacl", "magnet"] },
 { id: "nobond", label: "No chemical bond", accept: ["fe", "air", "sand"] },
 ],
 onDone: () => {
 chemLabState.reveal = true;
 mountQuiz(overlay, {
 scene: "bondSort",
 title: "Justify",
 q: "Sand sitting in water is not a chemical bond because...",
 opts: [
 "The grains and water stay separate substances - a mixture",
 "Sand becomes oxygen",
 "Water disappears",
 "Mixtures cannot contain atoms",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function sub4_snap({ overlay, setCoach, completeSub }) {
 setCoach("Try it: slide until magnets click - a hands-on snap for attraction bonds.");
 chemLabState.heat = 0.1;
 chemLabState.bondSnap = 0.1;
 mountHeatLab(overlay, {
 scene: "bondSnap",
 title: "Magnet Snap Lab",
 html: `<p>Drag the violet handle on the canvas or use +/− until the magnets <strong>click</strong> (≥ 75%).</p>
 <p>Opposite poles model how opposite charges can buddy up.</p>`,
 goalText: "Goal: snap ≥ 75% - bond glow appears.",
 doneLabel: "Snap complete ▶",
 threshold: 0.75,
 startHeat: 0.1,
 axis: "x",
 canvasAction: "snap",
 sliderLabel: "Magnet snap",
 syncKey: "bondSnap",
 readoutLabels: {
 cold: "Far apart - no click yet",
 melting: "Closing in...",
 liquid: "Almost touching",
 simmer: "SNAP! Buddy bond feel",
 },
 badge: BOND_ASSET_PATHS.magnet,
 onDone: () => {
 mountRevealSteps(overlay, {
 scene: "bondSnap",
 title: "What happened?",
 steps: [
 { html: "<p>You forced two opposites close enough to “click.”</p>" },
 { html: "<p>In chemistry, opposite charges can form ionic attractions.</p>" },
 { html: "<p>The model is a buddy story - real bonds use electrons & charge, not fridge toys only.</p>" },
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "bondSnap",
 title: "Check",
 q: "The magnet snap is mainly teaching...",
 opts: [
 "Attraction can hold partners together (bond buddy feel)",
 "That magnets create new elements",
 "That only gases can bond",
 "That bonds are beams of light",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function sub5_water({ overlay, setCoach, completeSub }) {
 setCoach("Explain: water droplets stick because H₂O molecules are bonded H-O-H buddies.");
 chemLabState.dropMerge = 0;
 mountMotionChain(overlay, {
 title: "Why Water Sticks",
 beats: [
 {
 scene: "bondWater",
 dwellMs: 4000,
 html: `${badgeHtml(BOND_ASSET_PATHS.water, "water")}
 <p><strong>Act 1:</strong> Cup on the desk - liquid water is countless H₂O molecules.</p>`,
 },
 {
 scene: "bondWater",
 dwellMs: 4500,
 html: `<p><strong>Act 2:</strong> Tap the models. Each molecule shows O bonded to two H atoms.</p>`,
 },
 {
 scene: "bondWater",
 dwellMs: 4000,
 html: `<p><strong>Act 3:</strong> Droplets stick to each other because molecules attract - still built from bonded atoms.</p>`,
 },
 ],
 onDone: () => {
 mountRevealSteps(overlay, {
 scene: "bondWater",
 title: "Chain it",
 steps: [
 { html: "<p>H and O are different atom kinds.</p>" },
 { html: "<p>Bonds link them into H₂O molecules.</p>" },
 { html: "<p>That is why water is a compound of bonded buddies - not a lone element.</p>" },
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "bondWater",
 title: "Check",
 q: "Water is a compound of bonded atoms because...",
 opts: [
 "Each molecule links hydrogen and oxygen atoms together",
 "Water is only heat energy",
 "Water is a pure element oxygen",
 "Droplets have no particles",
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
 setCoach("Symbolic: build the bond rule, then scrub magnets → atom link → BONDS.");
 mountEquationBuild(overlay, {
 scene: "bondRule",
 title: "Build the bond rule",
 instructions: "Tap tokens in order to build the rule sentence.",
 badge: BOND_ASSET_PATHS.rule,
 tokens: [
 { id: "a", html: "Atoms" },
 { id: "b", html: "link with" },
 { id: "c", html: "BONDS" },
 { id: "d", html: "as buddies" },
 ],
 correctIds: ["a", "b", "c", "d"],
 onDone: () => {
 mountScaleLab(overlay, {
 scene: "bondRule",
 title: "Name the Bond Rule",
 html: `<p>Scrub the left canvas: desk magnets → bonded atom pair → the word <strong>BONDS</strong>.</p>
 <p>Bonds are the lasting links that hold atom buddies together.</p>`,
 sliderLabel: "Bond scale: magnets → atom link → BONDS",
 goalText: "Canvas moves from everyday attraction → linked atoms → named bond rule.",
 readoutLabels: {
 low: "Desk magnets / cup (attraction analogy)",
 mid: "Atom pair held by a lasting link",
 high: "Name it: BONDS hold atoms together",
 },
 start: 0.1,
 threshold: 0.85,
 onDone: () => {
 mountQuiz(overlay, {
 scene: "bondRule",
 title: "Name it",
 q: "Best mission rule?",
 opts: [
 "Bonds are links that hold atoms together",
 "Bonds are only found in metals",
 "Bonds are beams of light",
 "Bonds mean nothing is matter",
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
 setCoach("Stretch: same bond idea on salt, O₂, sugar, plastic, protein - tap each on the canvas.");
 const modes = [
 { mode: "salt", title: "Salt lattice", blurb: "Na⁺ and Cl⁻ buddy up through ionic attraction.", badge: BOND_ASSET_PATHS.buddies },
 { mode: "o2", title: "Oxygen pair", blurb: "Two O atoms share a bond in O₂.", badge: BOND_ASSET_PATHS.water },
 { mode: "sugar", title: "Sugar", blurb: "Many C/H/O atoms bonded in sweet molecules.", badge: BOND_ASSET_PATHS.sugar },
 { mode: "plastic", title: "Plastic", blurb: "Long chains of bonded carbon backbones.", badge: BOND_ASSET_PATHS.plastic },
 { mode: "protein", title: "Protein", blurb: "Amino buddies bonded into folded chains.", badge: BOND_ASSET_PATHS.protein },
 ];
 let i = 0;
 function step() {
 if (i >= modes.length) {
 mountQuiz(overlay, {
 scene: "bondStretch",
 sceneArgs: { mode: "o2" },
 title: "Transfer",
 q: "Salt and O₂ both involve bonds because...",
 opts: [
 "Atoms are held together by lasting links (different bond styles)",
 "Both are mixtures of sand",
 "Both are only heat",
 "Neither contains atoms",
 ],
 ok: 0,
 onDone: completeSub,
 });
 return;
 }
 const m = modes[i++];
 chemLabState.mode = m.mode;
 mountTapContinue(overlay, {
 scene: "bondStretch",
 sceneArgs: { mode: m.mode },
 badge: m.badge,
 html: `<h3>${m.title}</h3><p>${m.blurb}</p><p>Tap the matching chip on the canvas, then continue.</p>`,
 onDone: step,
 });
 }
 step();
}

function sub8_myths({ overlay, setCoach, completeSub }) {
 setCoach("Myth bust: glue sticks, fridge magnets, mixtures, breaking bonds, solids-only.");
 mountMythCards(overlay, {
 scene: "bondMyth",
 title: "Bond myths",
 myths: [
 {
 title: "Glue myth",
 claim: "Bonds are tiny glue sticks between atoms.",
 truth: "Bonds are electrical attractions / shared electrons - not craft glue.",
 sceneMyth: 0,
 },
 {
 title: "Magnet myth",
 claim: "Fridge magnets are exactly the same as chemical bonds.",
 truth: "Magnets are a helpful analogy, not the full chemistry story.",
 sceneMyth: 1,
 },
 {
 title: "Mixture myth",
 claim: "Parts of a mixture are chemically bonded to each other.",
 truth: "Mixtures sit together without forming new bonded compounds between parts.",
 sceneMyth: 2,
 },
 {
 title: "Break myth",
 claim: "Breaking a bond creates brand-new elements.",
 truth: "Breaking bonds rearranges atoms - the atom kinds stay the same.",
 sceneMyth: 3,
 },
 {
 title: "Solid myth",
 claim: "Only solids have bonds.",
 truth: "Gases like O₂ and liquids like water also have bonded molecules.",
 sceneMyth: 4,
 },
 ],
 onDone: completeSub,
 });
}

function sub9_drill({ overlay, setCoach, completeSub }) {
 setCoach("Fluency drill - about 80% to pass.");
 mountSpeedDrill(overlay, {
 scene: "bondDrill",
 passScene: "bondMastery",
 title: "Bond Buddies Speed Drill",
 passRatio: 0.8,
 passMessage: "Nice fluency with bond buddies.",
 items: [
 { q: "A bond mainly...", opts: ["Holds atoms together", "Creates light only", "Deletes matter", "Is a thought"], ok: 0, prompt: "Bond does?" },
 { q: "H₂O is bonded because...", opts: ["H and O atoms are linked", "It is pure iron", "It is only heat", "It has no atoms"], ok: 0, prompt: "Water?" },
 { q: "Sand in water is...", opts: ["A mixture (no new bond)", "A new element", "Pure O₂", "Not matter"], ok: 0, prompt: "Sand water?" },
 { q: "Magnet snap in this lab is...", opts: ["An attraction analogy", "Exact full chemistry", "A compound of light", "Not useful"], ok: 0, prompt: "Magnets?" },
 { q: "O₂ has a bond between...", opts: ["Two oxygen atoms", "Iron and gold", "Sand and air", "Heat packets"], ok: 0, prompt: "O₂?" },
 { q: "Breaking bonds...", opts: ["Rearranges atoms", "Always makes new elements", "Removes all charge forever", "Stops motion forever"], ok: 0, prompt: "Break?" },
 { q: "Na⁺ and Cl⁻ buddy via...", opts: ["Ionic-style attraction", "Being the same element", "Being a mixture of rocks", "Photons only"], ok: 0, prompt: "Salt ions?" },
 { q: "Best bond rule?", opts: ["Links that hold atoms together", "Only solids shine", "Mixtures are bonds", "Bonds are glue sticks"], ok: 0, prompt: "Rule?" },
 ],
 onDone: () => {
 playScene("bondMastery");
 mountTapContinue(overlay, {
 scene: "bondMastery",
 html: `<h3>Drill cleared</h3><p>Ready for Bond Buddies mastery.</p>`,
 onDone: completeSub,
 advanceAfterDone: true,
 });
 },
 });
}

function sub10_mastery({ overlay, setCoach, completeSub }) {
 setCoach("Mastery: order the Bond Buddies path, then prove the rule.");
 playScene("bondMastery");
 mountOrderSteps(overlay, {
 scene: "bondMastery",
 title: "Path check",
 instructions: "Tap the story beats in the order you learned them.",
 items: [
 { id: "1", html: "Meet buddies" },
 { id: "2", html: "Attraction pull" },
 { id: "3", html: "Sort bond / not" },
 { id: "4", html: "Snap + water" },
 { id: "5", html: "Name the rule" },
 ],
 correctIds: ["1", "2", "3", "4", "5"],
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "bondMastery",
 html: `<h3>Mixed cases</h3><p>One more round - then claim Bond Explorer.</p>`,
 onDone: () => {
 mountMultiQuiz(overlay, {
 scene: "bondMastery",
 title: "Bond Explorer checks",
 items: [
 {
 q: "Which shows atoms held by a bond?",
 opts: ["H₂O molecule", "Sand resting in water", "A thought", "A pure light beam"],
 ok: 0,
 },
 {
 q: "Magnets in this mission are mainly...",
 opts: [
 "An everyday analogy for attraction",
 "Proof bonds are fridge toys",
 "Evidence water is an element",
 "A way to delete atoms",
 ],
 ok: 0,
 },
 {
 q: "Pick the bond rule.",
 opts: [
 "Bonds are links that hold atoms together",
 "Bonds only exist in mixtures of sand",
 "Bonds are heat without particles",
 "Bonds mean atoms disappear",
 ],
 ok: 0,
 },
 ],
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "bondMastery",
 badge: BOND_ASSET_PATHS.buddies,
 html: `<h3>🤝 Bond Buddies complete</h3>
 <p>You earned the path to <strong>Bond Explorer</strong>. Mixtures wait in Mix &amp; Match.</p>`,
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
