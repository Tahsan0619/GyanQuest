/**
 * Chemistry Lab Mission 1: Tiny Bits
 * Script: Opening + 4 Bruner spirals (enactive → iconic → symbolic) + closing zoom-out.
 * Packed into the shared 10-step mission engine (N_SUBS = 10).
 */
import { chemLabState, resetTinyBitsState, ATOM_ASSET_PATHS } from "./atom-scenes.js?v=bondbuddy1";
import {
 mountDragSort,
 mountHeatLab,
 mountRevealSteps,
 mountTapContinue,
 mountGate,
 mountZoomTool,
 mountTrueFalse,
 mountGhostBuild,
 mountFormulaReveal,
 mountAtomBuilder,
 mountSparkLab,
 mountSpiralMap,
 mountTempPreview,
 badgeHtml,
} from "./chem-activities.js?v=bondbuddy1";

export const L1_META = {
 objective:
 "By the end of this mission, you'll be able to explain that everything is built from tiny bits called atoms, that atoms join into molecules, and that chemistry is those bits moving, joining, and rearranging.",
 bdHook: "Start with a glass of water, then shrink smaller than anything you can see.",
 predict: {
 q: "Before we start: what do you think everything around you is made of?",
 options: [
 "Totally different ingredients with nothing in common",
 "The same basic ingredients, just arranged differently",
 "Only solids are made of anything; air is empty",
 ],
 ok: 1,
 },
 kidTitle: "Tiny Bits",
 theme: "particles, atoms & molecules",
 emoji: "⚗️",
 rewardName: "Tiny Rookie",
 intro:
 "Everything you can see (a chair, the air, this screen, your hand) is built from the same basic ingredients, arranged differently. Today we shrink down to find those Tiny Bits.",
 everyday: [
 "A glass of water on a sunlit table",
 "Ice, water, and steam: same bits, different dance",
 "A spark that joins hydrogen and oxygen into water",
 ],
 subTitles: [
 "Zoom In",
 "Same bits, three dances",
 "This bit has a name",
 "Sort & join",
 "Molecules & formulas",
 "Crack open an atom",
 "Periodic IDs",
 "Heat & spark",
 "The equation",
 "The big zoom-out",
 ],
};

export function runL1Sub(subIndex, api) {
 const { registerTryAgain } = api;
 resetTinyBitsState();

 const runners = [
 sub1_openingZoom,
 sub2_states,
 sub3_atomName,
 sub4_sortJoin,
 sub5_molecules,
 sub6_atomBuilder,
 sub7_periodic,
 sub8_heatSpark,
 sub9_equation,
 sub10_closing,
 ];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => {
 api.overlay.innerHTML = "";
 resetTinyBitsState();
 fn(api);
 });
 fn(api);
}

function sub1_openingZoom({ overlay, setCoach, completeSub }) {
 setCoach("Look around you. Then zoom in, past anything the eye can see.");
 mountGate(overlay, {
 scene: "tinyOpen",
 badge: "Opening",
 title: "Tiny Bits",
 pulse: true,
 doneLabel: "Zoom In →",
 html: `${badgeHtml(ATOM_ASSET_PATHS.magnify, "zoom")}
 ${n(
 "Look around you right now. Your chair. The air you’re breathing. This screen. Your own hand. They all look completely solid and completely different from each other. But what if I told you that every single one of them (the chair, the air, the screen, your hand) is built out of the exact same basic ingredients, just arranged differently? Today we’re going to shrink ourselves down, smaller than anything you’ve ever imagined, and go find those ingredients. We’re calling them Tiny Bits. Ready to zoom in?",
 )}`,
 bind(_host, _api) {
 const arena = window.__arena;
 arena?.setIntentHandler?.((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "zoomIn") {
 document.getElementById("tiny-gate-go")?.click();
 }
 });
 },
 onDone: () => {
 mountZoomTool(overlay, { onDone: completeSub });
 },
 });
}

function sub2_states({ overlay, setCoach, completeSub }) {
 setCoach("Watch ice, water, and steam side by side: same dots, three dances.");
 mountTempPreview(overlay, {
 scene: "tinyStates",
 badge: "Spiral 1: Iconic",
 title: "Same bits, three dances",
 html: n(
 "Here’s the twist: ice, water, and steam are made of the exact same tiny bits. Nothing was added or removed. The only thing that changed is how those tiny bits are moving and how close together they’re packed. Solid, liquid, gas: it’s the same ingredients, just a different dance.",
 ),
 onDone: completeSub,
 });
}

function sub3_atomName({ overlay, setCoach, completeSub }) {
 setCoach("Scientists gave these tiny bits a name: atom.");
 mountGate(overlay, {
 scene: "tinyAtomName",
 badge: "Spiral 1: Symbolic",
 title: "This tiny bit has a name: an atom.",
 html: n(
 "Scientists gave these tiny bits a name over two thousand years ago: atom, from an old Greek word, atomos, meaning ‘that which cannot be cut.’ They believed if you kept slicing matter smaller and smaller, you’d eventually hit a piece so small it couldn’t be cut any further: an atom. They were mostly right, and it’s still the word we use today.",
 ),
 onDone: () => {
 mountTrueFalse(overlay, {
 scene: "tinyAtomName",
 badge: "Quick check",
 title: "True or false",
 q: "True or false: ice, water, and steam are made of different ingredients.",
 answerIsTrue: false,
 explain: "False: same atoms, different motion and spacing.",
 onDone: completeSub,
 });
 },
 });
}

function sub4_sortJoin({ overlay, setCoach, completeSub }) {
 setCoach("Spiral back: these dots aren’t all the same. Sort them, then join three into one unit.");
 mountGate(overlay, {
 scene: "tinyCrowd",
 badge: "Spiral 2: Enactive",
 title: "Wait: these dots aren’t all the same color…",
 html: "<p class=\"tiny-onscreen\">Next you’ll sort the tiny bits by color. No chemistry names yet.</p>",
 onDone: () => {
 mountDragSort(overlay, {
 scene: "tinySort",
 title: "Sort the Tiny Bits",
 instructions: "Drag each ball into the matching-color bin (canvas or chips).",
 successText: "You just discovered something huge: there isn’t just one kind of atom. There are many kinds.",
 chips: [
 { id: "r1", text: "Red bit", short: "Red", color: 0xf87171 },
 { id: "r2", text: "Red bit", short: "Red", color: 0xf87171 },
 { id: "r3", text: "Red bit", short: "Red", color: 0xf87171 },
 { id: "b1", text: "Blue bit", short: "Blue", color: 0x60a5fa },
 { id: "b2", text: "Blue bit", short: "Blue", color: 0x60a5fa },
 { id: "b3", text: "Blue bit", short: "Blue", color: 0x60a5fa },
 { id: "g1", text: "Grey bit", short: "Grey", color: 0x94a3b8 },
 { id: "g2", text: "Grey bit", short: "Grey", color: 0x94a3b8 },
 { id: "g3", text: "Grey bit", short: "Grey", color: 0x94a3b8 },
 ],
 zones: [
 { id: "red", label: "Red", accept: ["r1", "r2", "r3"] },
 { id: "blue", label: "Blue", accept: ["b1", "b2", "b3"] },
 { id: "grey", label: "Grey", accept: ["g1", "g2", "g3"] },
 ],
 onDone: () => {
 mountGhostBuild(overlay, { onDone: completeSub });
 },
 });
 },
 });
}

function sub5_molecules({ overlay, setCoach, completeSub }) {
 setCoach("Hundreds of joined trios, then the grown-up labels: H₂O, O₂, CO₂.");
 mountGate(overlay, {
 scene: "tinyGallery",
 badge: "Spiral 2: Iconic",
 title: "Joined units everywhere",
 html: `${n(
 "Different types of atoms, joined in different combinations and different numbers, is the entire secret behind why the world has so much variety, even though it’s all built from a small set of basic ingredients.",
 )}<p class="tiny-onscreen">Different combinations of tiny bits build everything: water, the air you breathe, even sugar.</p>`,
 onDone: () => {
 mountFormulaReveal(overlay, { onDone: completeSub });
 },
 });
}

function sub6_atomBuilder({ overlay, setCoach, completeSub }) {
 setCoach("Atoms were named ‘that which cannot be cut.’ Let’s crack one open.");
 mountAtomBuilder(overlay, { onDone: completeSub });
}

function sub7_periodic({ overlay, setCoach, completeSub }) {
 setCoach("Every element is a different proton count. Carbon is always 6.");
 chemLabState.explodeZ = 0;
 mountGate(overlay, {
 scene: "tinyPeriodic",
 badge: "Spiral 3: Iconic",
 title: "A mini periodic table",
 html: `${n(
 "Every single element you’ve ever heard of (gold, oxygen, carbon, helium in a balloon) is just a different number of protons packed into a nucleus, with electrons orbiting around it. Scientists have organized all known elements into a chart called the periodic table. You just built the first few entries in it yourself.",
 )}<p class="tiny-onscreen">Optional: tap an icon to explode it back into the proton / neutron / electron view.</p>`,
 bind() {
 const arena = window.__arena;
 arena?.setIntentHandler?.((intent) => {
 if (intent.type === "CANVAS_TAP" && intent.meta?.action === "explode") {
 chemLabState.explodeZ = intent.meta.z || 0;
 }
 });
 },
 onDone: () => {
 mountGate(overlay, {
 scene: "tinyCarbon",
 badge: "Spiral 3: Symbolic",
 title: "Atomic number",
 html: n(
 "Chemists call the number of protons an atom has its atomic number: it’s basically an atom’s ID number, and no two elements share one. Carbon is always atomic number 6, everywhere in the universe. You’ve now learned the actual rule that the entire periodic table is built on.",
 ),
 onDone: completeSub,
 });
 },
 });
}

function sub8_heatSpark({ overlay, setCoach, completeSub }) {
 setCoach("You already found ice, water, and steam. Now you cause it, then spark a reaction.");
 mountHeatLab(overlay, {
 scene: "tinyHeat",
 badge: ATOM_ASSET_PATHS.ice,
 title: "Heat Lab",
 html: n(
 "You already discovered back at the start that ice, water, and steam are the same tiny bits moving differently. Now you know why they move differently: heat. Heat doesn’t create new tiny bits, it just makes the ones you built move faster and spread further apart.",
 ),
 sliderLabel: "cold ❄ to hot 🔥",
 goalText: "Drag to the cold end, the middle, and the hot end so you cause ice, liquid, and steam.",
 startHeat: 0.62,
 threshold: 1,
 mustVisit: ["cold", "liquid", "simmer"],
 readoutLabels: {
 cold: "Cold: molecules lock into a tight, still grid (ice)",
 melting: "Warming: the grid is loosening",
 liquid: "Middle: molecules slide and bump (liquid)",
 simmer: "Hot: molecules fly apart and escape upward (gas/steam)",
 },
 doneLabel: "I caused all three ▶",
 onDone: () => {
 mountSparkLab(overlay, { onDone: completeSub });
 },
 });
}

function sub9_equation({ overlay, setCoach, completeSub }) {
 setCoach("The same reaction powers a rocket. Then chemistry writes it as one line.");
 mountGate(overlay, {
 scene: "tinyRocket",
 badge: "Spiral 4: Iconic",
 title: "The same idea, out in the world",
 html: n(
 "This exact reaction (hydrogen and oxygen combining into water) is one of the reactions that powers rocket engines. Every chemical reaction you’ll ever learn about, from digesting your lunch to rusting metal to photosynthesis in a leaf, is really just this same idea: atoms letting go of old partners and grabbing new ones.",
 ),
 onDone: () => {
 chemLabState.eqStep = 0;
 mountRevealSteps(overlay, {
 scene: "tinyEquation",
 title: "Chemistry’s shorthand",
 steps: [
 "2H₂: two hydrogen molecules (the pairs you sparked)",
 "+ O₂: plus one oxygen molecule",
 "The arrow (→) means they react",
 "2H₂O: two water molecules. The same atoms, rearranged.",
 ],
 onStep: (i) => {
 chemLabState.eqStep = i + 1;
 },
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "tinyEquation",
 html: `${n(
 "This line is chemistry’s shorthand for everything you just watched happen: two hydrogen molecules plus one oxygen molecule react to form two water molecules. Every chemical equation you’ll ever see is really just this same story: a before, an arrow, and an after, for a bunch of tiny bits rearranging themselves.",
 )}<p class="tiny-onscreen">2H₂ + O₂ → 2H₂O</p>`,
 onDone: completeSub,
 });
 },
 });
 },
 });
}

 function sub10_closing({ overlay, setCoach, completeSub }) {
 setCoach("We started at a glass of water. Watch the zoom-out, then open your recap map.");
 chemLabState.scale = 0;
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "tinyZoomOut",
 badge: "Closing",
 title: "The big zoom-out",
 html: n(
 "We started at a glass of water and shrank ourselves down past anything the eye can see. Along the way you discovered that everything is built from tiny bits called atoms, that atoms join into molecules, that atoms themselves are built from even tinier protons, neutrons, and electrons, and that all of chemistry (melting, boiling, burning, even breathing) is really just tiny bits moving, joining, and rearranging. Next time you drink a glass of water, you’ll know exactly what you’re really looking at.",
 ),
 ready: () => chemLabState.scale >= 0.95 || Date.now() - t0 > 9000,
 readyText: "Back at the sunlit window.",
 doneLabel: "Open the spiral map ▶",
 onDone: () => {
 setCoach("Last screen: a recap map of the four spirals you just finished. Tap a number to replay, then tap Finish Tiny Bits.");
 mountSpiralMap(overlay, { onDone: completeSub });
 },
 });
}

function n(text) {
 return `<p class="tiny-narration">${text}</p>`;
}
