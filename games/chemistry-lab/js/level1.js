/**
 * Chemistry Lab - Mission 1: Tiny Bits
 * 10 sub-levels, Bruner spiral: enactive -> iconic -> symbolic.
 * Target: 45-60 minutes. Accurate: molecules, ions, particles of matter.
 */
import { ATOM_ASSET_PATHS, chemLabState } from "./atom-scenes.js";
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
} from "./chem-activities.js";

export const L1_META = {
 objective: "By the end of this mission, you'll be able to explain particles of matter in your own words.",
 bdHook: "Bangladesh everyday: notice particles of matter around you - then connect it to Tiny Bits.",
 predict: {
 q: "Before we start - what do you think matters most in Tiny Bits?",
 options: [
 "Guessing without checking",
 "Looking for a clear pattern or rule",
 "Skipping the practice steps",
 ],
 ok: 1,
 },

 kidTitle: "Tiny Bits",
 theme: "particles of matter",
 emoji: "⚗️",
 rewardName: "Tiny Rookie",
 intro:
 "Everything you can touch (and even air) is made of tiny moving particles. We start with salt, ice, and steam - then name a clear rule you can reuse anywhere.",
 everyday: [
 "Salt grains next to the oil bottle",
 "Ice melting in a cup on the desk",
 "Steam rising above a hot pan",
 ],
 subTitles: [
 "Meet Tiny Bits",
 "Salt Crystal Pattern",
 "Sort: Matter or Not?",
 "Ice Melting Lab",
 "Why Steam Rises",
 "Name the Particle Rule",
 "Stretch: New Contexts",
 "Myth Bust",
 "Fluency Drill",
 "Tiny Bits Mastery",
 ],
};

/**
 * @param {{
 * overlay: HTMLElement,
 * setCoach: (html: string, aside?: string) => void,
 * completeSub: () => void,
 * registerTryAgain: (fn: () => void) => void,
 * }} api
 */
export function runL1Sub(subIndex, api) {
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
 chemLabState.mode = "balloon";
 chemLabState.phase = "zoom";

 const runners = [
 sub1_meet,
 sub2_salt,
 sub3_sort,
 sub4_ice,
 sub5_steam,
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
 "Hook + light enactive: pour salt, magnify a grain, and meet a particle model - not what your eyes see.",
 );
 mountMotionChain(overlay, {
 title: "Meet Tiny Bits",
 beats: [
 {
 scene: "atomsMeet",
 sceneArgs: { phase: "zoom" },
 dwellMs: 4200,
 html: `${badgeHtml(ATOM_ASSET_PATHS.magnify, "magnify")}
 <p><strong>Act 1 - Everyday salt:</strong> Tap the shaker on the canvas (or watch) as grains pile on the desk.</p>
 <p>One grain looks solid and still. That is our starting object.</p>`,
 },
 {
 scene: "atomsMeet",
 sceneArgs: { phase: "cloud" },
 dwellMs: 4500,
 html: `<p><strong>Act 2 - Zoom model:</strong> A lens magnifies the grain into moving colored spheres.</p>
 <p>Those spheres are a <strong>toy model</strong> of tiny particles - not literal photographs.</p>`,
 },
 {
 scene: "atomsMeet",
 sceneArgs: { phase: "predict" },
 dwellMs: 3800,
 html: `<p><strong>Act 3 - Predict:</strong> Are those tiny bits frozen still, or always moving?</p>
 <p>Watch the highlighted grain and decide before we reveal the big idea.</p>`,
 },
 {
 scene: "atomsMeet",
 sceneArgs: { phase: "settle" },
 dwellMs: 4200,
 html: `<p><strong>Act 4 - Big idea:</strong> Salt, cool water, steam, and the desk connect to one claim.</p>
 <p>Ordinary matter is packed with tiny moving particles (later we will name atoms and molecules).</p>`,
 },
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "atomsMeet",
 sceneArgs: { phase: "cloud" },
 title: "Exit check",
 q: "What did the zoom model suggest about everyday stuff?",
 opts: [
 "It is packed with tiny moving particles we model as spheres",
 "Salt is empty space with no bits",
 "We can see real atoms with our bare eyes",
 "Only salt has particles; water does not",
 ],
 ok: 0,
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "atomsMeet",
 sceneArgs: { phase: "settle" },
 badge: ATOM_ASSET_PATHS.orbit,
 html: `<h3>You met Tiny Bits</h3><p>Next we look inside a salt crystal - ordered ions, not one giant atom.</p>`,
 onDone: completeSub,
 advanceAfterDone: true,
 });
 },
 });
 },
 });
}

function sub2_salt({ overlay, setCoach, completeSub }) {
 setCoach("Iconic view: table salt is an ordered ionic lattice (Na⁺ and Cl⁻), not magic powder.");
 mountMotionChain(overlay, {
 title: "Salt Crystal Pattern",
 beats: [
 {
 scene: "atomsSalt",
 sceneArgs: { assemble: false },
 dwellMs: 3800,
 html: `${badgeHtml(ATOM_ASSET_PATHS.salt, "salt")}
 <p><strong>Act 1:</strong> Oil bottle and salt bowl on the desk. Grains look simple from far away.</p>`,
 },
 {
 scene: "atomsSalt",
 sceneArgs: { assemble: "oil" },
 dwellMs: 4200,
 html: `<p><strong>Act 2 - Oil comparison:</strong> Tap or drag the oil bottle and notice the spilled drop.</p>
 <p>Oil also has particles, but they are <strong>not arranged in a rigid Na+/Cl- crystal</strong>. We show a loose molecular picture instead.</p>`,
 },
 {
 scene: "atomsSalt",
 sceneArgs: { assemble: true },
 dwellMs: 5200,
 html: `<p><strong>Act 3 - Lattice assemble:</strong> Blue = Na⁺ (sodium ion), red = Cl⁻ (chloride ion).</p>
 <p>They lock into a repeating cube. Real salt has billions of these; we show a tiny model.</p>`,
 },
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "atomsSalt",
 sceneArgs: { assemble: true },
 title: "Quick check",
 q: "What did the growing cube show about salt grains?",
 opts: [
 "Salt is a neat pattern of many ions stuck together",
 "Salt is one giant solid atom",
 "Salt is empty space with no bits",
 "Salt only exists as a liquid",
 ],
 ok: 0,
 onDone: () => {
 mountQuiz(overlay, {
 scene: "atomsSalt",
 sceneArgs: { assemble: true },
 title: "Ion check",
 q: "In this intro model, Na⁺ and Cl⁻ are best described as...",
 opts: [
 "Charged particles (ions) in an ionic lattice",
 "Photons of light",
 "Heat energy packets",
 "Thoughts, not matter",
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
 setCoach("Enactive sort: matter occupies space and has mass. Light and ideas are not matter.");
 chemLabState.reveal = false;
 mountTapContinue(overlay, {
 scene: "atomsSort",
 html: `<h3>Matter vs not-matter</h3>
 <p><strong>Matter</strong> is stuff made of particles (atoms, often bonded as molecules or ions).</p>
 <p><strong>Not matter:</strong> light and heat are energy; a thought is information - not a pile of atoms on the desk.</p>
 <p>Next: sort eight cases on the canvas or with chips.</p>`,
 onDone: () => {
 mountDragSort(overlay, {
 scene: "atomsSort",
 title: "Sort: Matter or not?",
 instructions: "Drag into Matter vs Not matter.",
 chips: [
 { id: "salt", text: "Salt grains", short: "Salt", color: 0xe2e8f0 },
 { id: "ice", text: "Ice in the cup", short: "Ice", color: 0x7dd3fc },
 { id: "steam", text: "Steam above the pan", short: "Steam", color: 0xf97316 },
 { id: "air", text: "Air in the room", short: "Air", color: 0x93c5fd },
 { id: "bottle", text: "Plastic water bottle", short: "Bottle", color: 0x38bdf8 },
 { id: "light", text: "A flashlight beam", short: "Light", color: 0xfbbf24 },
 { id: "idea", text: "A thought in your head", short: "Idea", color: 0xc084fc },
 { id: "heat", text: "Heat from a stove", short: "Heat", color: 0xfb7185 },
 ],
 zones: [
 {
 id: "yes",
 label: "Matter (particles)",
 accept: ["salt", "ice", "steam", "air", "bottle"],
 },
 {
 id: "no",
 label: "Not matter",
 accept: ["light", "idea", "heat"],
 },
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "atomsSort",
 sceneArgs: {},
 title: "Justify",
 q: "Why is a flashlight beam NOT matter?",
 opts: [
 "It is energy (light), not a pile of particles sitting on the desk",
 "Because it is invisible in the dark only",
 "Because beams are made of steam",
 "Because light is a type of salt crystal",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function sub4_ice({ overlay, setCoach, completeSub }) {
 setCoach("Enactive KMT: heat H₂O molecules - same substance, freer motion. Drag the heat handle on the canvas too.");
 mountHeatLab(overlay, {
 scene: "atomsIce",
 badge: ATOM_ASSET_PATHS.ice,
 title: "Ice Melting Lab",
 html: `<p>Ice is <strong>H₂O molecules</strong> locked in a stiff pattern. Add heat - they jiggle free into liquid water. Nothing “vanishes.”</p>
 <p>Use the slider, +/−, or drag the orange heat handle on the canvas.</p>`,
 goalText: "Goal: melt past ~80% and watch the liquid settle (brief vapor only when very hot).",
 startHeat: 0.1,
 threshold: 0.78,
 doneLabel: "Ice melted - continue ▶",
 onDone: () => {
 mountQuiz(overlay, {
 scene: "atomsIce",
 title: "Conservation check",
 q: "When ice melts, what happens to the water particles?",
 opts: [
 "They stay the same kind of particles (H₂O) but move more freely",
 "They disappear into nothing",
 "They turn into pure heat atoms",
 "They become light beams",
 ],
 ok: 0,
 onDone: () => {
 mountRevealSteps(overlay, {
 scene: "atomsIce",
 title: "Solid -> liquid story",
 steps: [
 "Cold: molecules vibrate in place in a crystal lattice.",
 "Heat arrives: motion increases; attractions struggle to hold the lattice.",
 "Melt: lattice breaks; molecules slide as liquid - same H₂O.",
 "Lesson: phase change rearranges motion/arrangement, not “making new stuff.”",
 ],
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function sub5_steam({ overlay, setCoach, completeSub }) {
 setCoach("Explain: hot pan -> fast H₂O molecules -> vapor. No extra bottle - focus on the stove and pan.");
 mountHeatLab(overlay, {
 scene: "atomsSteam",
 badge: ATOM_ASSET_PATHS.steam,
 title: "Why Steam Rises",
 html: `<p>Steam is not magic smoke. The <strong>fastest water molecules</strong> leave the liquid as vapor. Visible mist is tiny droplets or cooling vapor.</p>`,
 goalText: "Goal: crank energy until molecules clearly boil upward (~72%).",
 startHeat: 0.35,
 threshold: 0.72,
 doneLabel: "I can explain steam ▶",
 onDone: () => {
 mountRevealSteps(overlay, {
 scene: "atomsSteam",
 title: "Causal chain",
 steps: [
 "Heat increases molecular motion in the pan water.",
 "Some molecules move fast enough to escape into the air (evaporation / boiling).",
 "That gas is still H₂O - same substance as ice and liquid water.",
 "Cooling vapor can form tiny droplets we see as “steam clouds.”",
 ],
 onStep: (i) => {
 const energy = 0.4 + i * 0.15;
 chemLabState.energy = energy;
 chemLabState.energyTarget = energy;
 chemLabState.heat = energy;
 chemLabState.heatTarget = energy;
 },
 onDone: () => {
 mountQuiz(overlay, {
 scene: "atomsSteam",
 title: "Same substance?",
 q: "Ice, liquid water, and steam are...",
 opts: [
 "Different forms of the same substance (H₂O) with different particle motion",
 "Three unrelated elements",
 "Proof that atoms vanish when heated",
 "Only steam has molecules",
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
 setCoach(
 "Symbolic: build the matter-particle rule. Shell diagram is an optional simplified electron model - separate from “bits always move.”",
 );
 mountEquationBuild(overlay, {
 scene: "atomsRule",
 title: "Name the Particle Rule",
 instructions: "Tap tokens in order to build the Tiny Bits rule.",
 tokens: [
 { id: "a", html: "Ordinary matter" },
 { id: "b", html: "is made of tiny bits" },
 { id: "c", html: "called atoms (often as molecules)" },
 { id: "d", html: "that are always moving" },
 ],
 correctIds: ["a", "b", "c", "d"],
 onDone: () => {
 mountScaleLab(overlay, {
 scene: "atomsRule",
 title: "Scale scrubber",
 html: `<p>Slide from everyday grain -> ion crystal model -> optional simplified shells.</p>
 <p>Shells show a later idea (electrons). The Tiny Bits rule is about <strong>particles of matter always moving</strong>.</p>`,
 start: 0,
 threshold: 0.85,
 onDone: () => {
 mountQuiz(overlay, {
 scene: "atomsRule",
 title: "Model check",
 q: "What is the main Tiny Bits rule?",
 opts: [
 "Matter is made of tiny moving particles (atoms / molecules)",
 "Atoms are big enough to see without tools",
 "Heat is made of atoms stacked in a pan",
 "Only solids contain particles",
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
 setCoach("Transfer: same particle rule in balloon air, graphite, water, glass, and steel.");
 const modes = [
 {
 mode: "balloon",
 html: `${badgeHtml(ATOM_ASSET_PATHS.orbit, "air")}<p><strong>Balloon:</strong> Squishy air is mostly N₂ and O₂ <em>molecules</em> bouncing inside the skin.</p>`,
 },
 {
 mode: "pencil",
 html: `<p><strong>Pencil tip:</strong> Graphite layers are carbon atoms that slide - that is why it writes.</p>`,
 },
 {
 mode: "water",
 html: `<p><strong>Water drop:</strong> Same H₂O molecules as ice and steam, clustered as a liquid.</p>`,
 },
 {
 mode: "phone",
 html: `<p><strong>Phone glass:</strong> Tightly packed particles make a hard, transparent solid - still matter.</p>`,
 },
 {
 mode: "steel",
 html: `<p><strong>Steel spoon:</strong> Metal atoms packed in a lattice - cold to the touch, still buzzing microscopically.</p>`,
 },
 ];
 let step = 0;

 function show() {
 if (step >= modes.length) {
 mountQuiz(overlay, {
 scene: "atomsStretch",
 sceneArgs: { mode: "water" },
 title: "Stretch check",
 q: "Which statement fits balloon air, graphite, water, glass, and steel?",
 opts: [
 "They are all made of moving particles of matter",
 "Only solids have particles",
 "Gases are empty of particles",
 "Particles only exist in chemistry class",
 ],
 ok: 0,
 onDone: completeSub,
 });
 return;
 }
 const m = modes[step];
 chemLabState.mode = m.mode;
 mountTapContinue(overlay, {
 scene: "atomsStretch",
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
 setCoach("Misconceptions: claim first on canvas; truth appears only after you bust the myth.");
 mountMythCards(overlay, {
 myths: [
 {
 sceneMyth: 0,
 title: "“I can see atoms with my eyes”",
 claim: "Atoms are little balls you can spot on the table.",
 truth: "Atoms are far too small - we use models and instruments.",
 },
 {
 sceneMyth: 1,
 title: "“Atoms sit perfectly still”",
 claim: "Once something is solid, its particles freeze forever.",
 truth: "Particles always jiggle. Heat = faster jiggle.",
 },
 {
 sceneMyth: 2,
 title: "“Empty air has no atoms”",
 claim: "If I cannot see stuff, there are no particles.",
 truth: "Air is full of molecules (mostly N₂ and O₂) zooming around.",
 },
 {
 sceneMyth: 3,
 title: "“Steam is a new substance”",
 claim: "Boiling creates a brand-new kind of matter.",
 truth: "Steam is still H₂O - same substance, more motion / different arrangement.",
 },
 {
 sceneMyth: 4,
 title: "“Heat is made of atoms”",
 claim: "Heat is a pile of tiny heat-atoms you can sort.",
 truth: "Heat is energy transferred - it is not a material you scoop like salt.",
 },
 ],
 onDone: completeSub,
 });
}

function sub9_drill({ overlay, setCoach, completeSub }) {
 setCoach("Fluency: quick application checks. Need about 80% to unlock Continue.");
 mountSpeedDrill(overlay, {
 passRatio: 0.8,
 items: [
 {
 prompt: "Salt crystal",
 q: "A salt grain is...",
 opts: ["A crystal of many ions", "One huge atom", "Pure energy", "A myth"],
 ok: 0,
 },
 {
 prompt: "Ice -> water",
 q: "When ice melts, H₂O molecules...",
 opts: ["Disappear", "Stay H₂O but move freer", "Turn into light", "Stop existing"],
 ok: 1,
 },
 {
 prompt: "Steam / vapor",
 q: "Steam rising means...",
 opts: ["Molecules got faster and escaped", "The pan created new atoms", "Gravity flipped", "Color left the water"],
 ok: 0,
 },
 {
 prompt: "Air / balloon",
 q: "Air in a balloon...",
 opts: ["Has no particles", "Is packed with moving molecules", "Is one atom", "Is only heat"],
 ok: 1,
 },
 {
 prompt: "Molecule vs atom",
 q: "Water is best described as...",
 opts: ["H₂O molecules (atoms bonded)", "A single oxygen atom only", "A flashlight beam", "Frozen heat"],
 ok: 0,
 },
 {
 prompt: "Not matter",
 q: "Which is NOT matter?",
 opts: ["Heat from a stove", "Ice cubes", "Salt grains", "Air"],
 ok: 0,
 },
 {
 prompt: "Tiny Bits rule",
 q: "Best Tiny Bits rule?",
 opts: [
 "Matter is made of tiny moving particles",
 "Only metals have particles",
 "Particles are visible glitter",
 "Particles hate moving",
 ],
 ok: 0,
 },
 {
 prompt: "Ion lattice",
 q: "In table salt’s lattice we modeled...",
 opts: ["Na⁺ and Cl⁻ ions in a pattern", "Photons stacked in cubes", "Thoughts crystallized", "Empty space only"],
 ok: 0,
 },
 ],
 onDone: completeSub,
 });
}

function sub10_mastery({ overlay, setCoach, completeSub }) {
 setCoach("Mastery: rebuild the path, transfer to iced tea + kettle, then prove it.");
 playScene("atomsMastery");
 mountOrderSteps(overlay, {
 scene: "atomsMastery",
 title: "Tiny Bits Mastery - learning path",
 instructions: "Tap Brunner order: meet -> sort -> melt/steam -> rule -> stretch/myths.",
 items: [
 { id: "1", html: "Meet particles in salt (concrete)" },
 { id: "2", html: "Sort matter vs not-matter" },
 { id: "3", html: "Melt ice / watch steam (do it)" },
 { id: "4", html: "Name the moving-particle rule" },
 { id: "5", html: "Stretch + bust myths" },
 ],
 correctIds: ["1", "2", "3", "4", "5"],
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "atomsMastery",
 html: `<h3>Mixed case</h3>
 <p><strong>Iced tea + kettle:</strong> Cold drink has slower H₂O motion; kettle steam is faster H₂O leaving as vapor - same substance family, different motion.</p>
 <p>Ready for the final checks?</p>`,
 onDone: () => {
 mountMultiQuiz(overlay, {
 scene: "atomsMastery",
 title: "Final mastery",
 doneTitle: "Tiny Rookie ready",
 items: [
 {
 q: "Salt, melting ice, and steam all teach the same idea because...",
 opts: [
 "They are forms of matter made of moving particles",
 "They are unrelated magic tricks",
 "Only steam has particles",
 "Particles only appear when we heat things",
 ],
 ok: 0,
 },
 {
 q: "A correct statement about atoms vs molecules here is...",
 opts: [
 "Water is H₂O molecules; atoms are the bonded building blocks",
 "Molecules and atoms are identical words with no difference",
 "Molecules are a type of light",
 "Atoms only exist inside myths",
 ],
 ok: 0,
 },
 {
 q: "Which belongs in “not matter”?",
 opts: ["A flashlight beam", "Air", "Ice", "A plastic bottle"],
 ok: 0,
 },
 ],
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "atomsMastery",
 badge: ATOM_ASSET_PATHS.orbit,
 html: `<h3>Mission 1 complete path</h3>
 <p>You earned the story arc from concrete salt to a reusable rule. Use step dots to replay any weak spot. Press <strong>Next</strong> in the dock to claim <strong>Tiny Rookie</strong>.</p>`,
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
