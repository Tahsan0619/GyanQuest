/**
 * Astronomy & Space - Mission 1: Solar Family
 * 10 sub-levels, Bruner spiral: enactive -> iconic -> symbolic.
 * Target: 45-60 minutes. Accurate: Sun, planets, orbits, gravity path idea.
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
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
} from "./lab-activities.js";

export const L1_META = {
 objective: "By the end of this mission, you'll be able to explain sun + planets orbit in your own words.",
 bdHook:
 "Bangladesh everyday: a Dhaka rooftop planet hunt, a school globe as tiny Earth, a clear evening Venus/Jupiter glow - notice who goes around whom.",
 predict: {
 q: "Before we start - who mainly travels around whom in our solar family?",
 options: [
 "The Sun races around Earth each day",
 "Planets travel on paths (orbits) around the Sun",
 "Planets and the Sun sit still forever",
 ],
 ok: 1,
 },

 kidTitle: "Solar Family",
 theme: "sun + planets orbit",
 emoji: "🪐",
 rewardName: "Orbit Scout",
 intro:
 "On a clear Dhaka evening a bright 'star' may be a planet. We start with the Sun at the center - then name a clear orbit rule you can reuse anywhere.",
 everyday: [
 "Night sky peek from a rooftop",
 "School globe as a tiny Earth",
 "Dhaka clear evening planet hunt",
 ],
 subTitles: [
 "Meet the Solar Family",
 "Orbit Clarity Lab",
 "Sort: Planet / Sun / Other",
 "Closer Orbit Lab",
 "Why Planets Orbit",
 "Name the Orbit Rule",
 "Stretch: Sky Places",
 "Myth Bust",
 "Fluency Drill",
 "Orbit Scout Mastery",
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
 labState.reveal = false;
 labState.tokenProgress = 0;
 labState.masteryStep = 0;
 labState.sortPlaced = 0;
 labState.placed = {};
 labState.selectedId = null;
 labState.mythBusted = false;
 labState.mythPhase = "claim";
 labState.scale = 0;
 labState.mode = "home";
 labState.phase = "desk";
 labState.heat = 0.25;
 labState.labMode = "clarity";

 const runners = [
 sub1_meet,
 sub2_clarity,
 sub3_sort,
 sub4_closer,
 sub5_why,
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
 "Hook + light iconic: meet the Sun at center, watch planets on paths, then predict who orbits whom.",
 );
 mountMotionChain(overlay, {
 title: "Meet the Solar Family",
 beats: [
 {
 scene: "solarMeet",
 sceneArgs: { phase: "desk" },
 dwellMs: 4200,
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "solar family")}
 <p><strong>Act 1 - Desk model:</strong> See the bright Sun and a few planets laid out like a family map.</p>
 <p>This is a toy model - not to scale - so we can notice paths clearly.</p>`,
 },
 {
 scene: "solarMeet",
 sceneArgs: { phase: "glow" },
 dwellMs: 4500,
 html: `<p><strong>Act 2 - Orbits glow:</strong> Each planet travels a closed path around the Sun.</p>
 <p>Those loops are called <strong>orbits</strong>. Earth is one traveler in the family.</p>`,
 },
 {
 scene: "solarMeet",
 sceneArgs: { phase: "predict" },
 dwellMs: 3800,
 html: `<p><strong>Act 3 - Predict:</strong> Does the Sun race around Earth each day, or do planets travel around the Sun?</p>
 <p>Watch the highlighted Earth path and decide before we lock the big idea.</p>`,
 },
 {
 scene: "solarMeet",
 sceneArgs: { phase: "settle" },
 dwellMs: 4200,
 html: `<p><strong>Act 4 - Big idea:</strong> Our solar family has one star (the Sun) plus planets on orbits.</p>
 <p>Moons and comets visit too - but planets are the main orbiting siblings we sort next.</p>`,
 },
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "solarMeet",
 sceneArgs: { phase: "settle" },
 title: "Exit check",
 q: "What did the desk model suggest about planets and the Sun?",
 opts: [
 "Planets travel on paths (orbits) around the Sun",
 "The Sun orbits Earth once every day",
 "Planets sit still forever on a flat map",
 "Only Earth has an orbit; others float randomly",
 ],
 ok: 0,
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "solarMeet",
 sceneArgs: { phase: "settle" },
 badge: LAB_ASSET_PATHS.m1,
 html: `<h3>You met the Solar Family</h3><p>Next we dial orbit clarity - blurry paths become clear loops.</p>`,
 onDone: completeSub,
 advanceAfterDone: true,
 });
 },
 });
 },
 });
}

function sub2_clarity({ overlay, setCoach, completeSub }) {
 setCoach("Enactive: drag until orbit rings look sharp - paths around the Sun, not a blurry blob.");
 labState.heat = 0.2;
 labState.labMode = "clarity";
 mountHeatLab(overlay, {
 scene: "solarLab",
 sceneArgs: { labMode: "clarity" },
 badge: LAB_ASSET_PATHS.m1,
 title: "Orbit Clarity Lab",
 html: `<p>At first the family looks fuzzy. Drag the handle (or use the slider) until orbit rings look <strong>clear</strong>.</p>
 <p>Clear paths = planets circling the Sun on repeating loops.</p>`,
 goalText: "Goal: clarity past ~60% so rings and planet names read clearly.",
 startHeat: 0.2,
 threshold: 0.6,
 doneLabel: "Orbits look clear ▶",
 axis: "x",
 canvasAction: "stretch",
 sliderLabel: "Orbit clarity",
 readoutLabels: {
 cold: "Blurry - hard to see paths",
 melting: "Faint rings appearing",
 liquid: "Orbits clearer - names peek in",
 simmer: "Family locked - sharp orbit map",
 },
 onDone: () => {
 mountQuiz(overlay, {
 scene: "solarLab",
 sceneArgs: { labMode: "clarity" },
 title: "Clarity check",
 q: "When the orbit dial is clear, what are you seeing?",
 opts: [
 "Planets on repeating paths around the Sun",
 "Cars racing on a Dhaka road",
 "The Moon turning into a star",
 "Proof that planets never move",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
}

function sub3_sort({ overlay, setCoach, completeSub }) {
 setCoach("Enactive sort: planets vs star vs moon/comet vs everyday not-space objects.");
 labState.reveal = false;
 mountTapContinue(overlay, {
 scene: "solarSort",
 html: `<h3>Planet, Sun, other, or not?</h3>
 <p><strong>Planet:</strong> Mercury, Earth, Jupiter orbit the Sun.</p>
 <p><strong>Star:</strong> the Sun - our family's giant light source.</p>
 <p><strong>Other:</strong> Moon (orbits Earth) and comet (visitor).</p>
 <p><strong>Not space:</strong> toy car and soccer ball stay on Earth.</p>`,
 onDone: () => {
 mountDragSort(overlay, {
 scene: "solarSort",
 title: "Sort: Planet / Sun / Other / Not",
 instructions: "Drag each chip into the matching bin.",
 successText: "Solar family sorted!",
 chips: [
 { id: "merc", text: "Mercury near Sun", short: "Mercury", color: 0x94a3b8 },
 { id: "earth", text: "Earth with life", short: "Earth", color: 0x38bdf8 },
 { id: "jup", text: "Jupiter gas giant", short: "Jupiter", color: 0xfbbf24 },
 { id: "sun", text: "Sun at center", short: "Sun", color: 0xfacc15 },
 { id: "moon", text: "Moon orbits Earth", short: "Moon", color: 0xe2e8f0 },
 { id: "car", text: "Toy car on road", short: "Car", color: 0x78716c },
 { id: "ball", text: "Soccer ball", short: "Ball", color: 0x64748b },
 { id: "comet", text: "Comet visitor", short: "Comet", color: 0xa78bfa },
 ],
 zones: [
 { id: "planet", label: "Planet", accept: ["merc", "earth", "jup"] },
 { id: "star", label: "Star (Sun)", accept: ["sun"] },
 { id: "other", label: "Moon/comet", accept: ["moon", "comet"] },
 { id: "not", label: "Not space", accept: ["car", "ball"] },
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "solarSort",
 title: "Justify",
 q: "Why is the Moon NOT sorted as a planet here?",
 opts: [
 "It orbits Earth - moons are companions, not Sun-orbiting planets in this sort",
 "Because the Moon is made of cheese",
 "Because moons are stars",
 "Because only Jupiter counts as a planet",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function sub4_closer({ overlay, setCoach, completeSub }) {
 setCoach("Enactive distance model: pull a planet closer - shorter path, quicker year lap.");
 labState.heat = 0.35;
 labState.labMode = "closer";
 mountHeatLab(overlay, {
 scene: "solarLab",
 sceneArgs: { labMode: "closer" },
 badge: LAB_ASSET_PATHS.m1,
 title: "Closer Orbit Lab",
 html: `<p>Drag to pull the demo planet <strong>closer</strong> to the Sun. Watch the year lap get quicker.</p>
 <p>This is a model of distance vs orbit time - not real planet moving day-to-day.</p>`,
 goalText: "Goal: pull closer past ~75% so the year counter speeds up clearly.",
 startHeat: 0.35,
 threshold: 0.75,
 doneLabel: "Closer year makes sense ▶",
 axis: "x",
 canvasAction: "stretch",
 sliderLabel: "Orbit distance (closer)",
 readoutLabels: {
 cold: "Far path - long year",
 melting: "Moving inward - lap shortens",
 liquid: "Closer - year speeding up",
 simmer: "Near-Sun lap - quick year model",
 },
 onDone: () => {
 mountQuiz(overlay, {
 scene: "solarLab",
 sceneArgs: { labMode: "closer" },
 title: "Distance check",
 q: "In this model, a closer orbit means...",
 opts: [
 "A shorter path and a quicker year lap",
 "The planet turns into a star",
 "Gravity disappears",
 "The Sun orbits the planet instead",
 ],
 ok: 0,
 onDone: () => {
 mountRevealSteps(overlay, {
 scene: "solarLab",
 sceneArgs: { labMode: "closer" },
 title: "Distance -> year story",
 steps: [
 "Far from the Sun: wide path, long time for one full lap (year).",
 "Pull closer: the loop shrinks.",
 "Same idea in the real family: Mercury's year is short; Neptune's is huge.",
 "Lesson: distance changes lap time - planets still orbit the Sun.",
 ],
 onStep: (i) => {
 const energy = 0.35 + i * 0.16;
 labState.heat = energy;
 labState.heatTarget = energy;
 labState.labMode = "closer";
 },
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function sub5_why({ overlay, setCoach, completeSub }) {
 setCoach("Causal chain: Sun center -> gravity curves the path -> planet travels -> one lap = a year.");
 mountOrderSteps(overlay, {
 scene: "solarMeet",
 sceneArgs: { phase: "settle" },
 title: "Why Planets Orbit",
 instructions: "Tap the story beats in order.",
 items: [
 { id: "sun", html: "Sun sits near the center" },
 { id: "path", html: "Gravity keeps a curved path" },
 { id: "orbit", html: "Planet travels the orbit" },
 { id: "year", html: "One full trip is a year for that planet" },
 ],
 correctIds: ["sun", "path", "orbit", "year"],
 onDone: () => {
 mountRevealSteps(overlay, {
 scene: "solarMeet",
 sceneArgs: { phase: "glow" },
 title: "Causal chain",
 steps: [
 "The Sun's mass pulls strongly - planets do not fly off in a straight line.",
 "That pull plus sideways motion makes a closed curve: an orbit.",
 "Earth's year is mainly one full orbit around the Sun.",
 "Day/night is mostly Earth's spin - saved for the next sky mission.",
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "solarMeet",
 sceneArgs: { phase: "settle" },
 title: "Check",
 q: "Earth's year is mainly...",
 opts: [
 "One full orbit around the Sun",
 "One Moon spin only",
 "The Sun orbiting Earth",
 "A soccer game length",
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
 "Symbolic: build the orbit rule, then scrub desk model -> clear paths -> rule banner.",
 );
 mountEquationBuild(overlay, {
 scene: "solarRule",
 title: "Name the Orbit Rule",
 instructions: "Tap tokens in order to build the Solar Family rule.",
 tokens: [
 { id: "a", html: "Planets" },
 { id: "b", html: "orbit" },
 { id: "c", html: "the Sun" },
 { id: "d", html: "(our star)" },
 ],
 correctIds: ["a", "b", "c", "d"],
 badge: LAB_ASSET_PATHS.rule,
 onDone: () => {
 mountScaleLab(overlay, {
 scene: "solarRule",
 title: "Orbit scale scrubber",
 html: `<p>Slide from desk model -> clear orbit paths -> rule banner.</p>
 <p>The Solar Family rule is about <strong>who orbits whom</strong>: planets orbit the Sun.</p>`,
 sliderLabel: "Orbit scale: desk → paths → rule",
 goalText: "Left canvas follows: desk family → glowing orbits → PLANETS ORBIT THE SUN.",
 readoutLabels: {
 low: "Desk family model",
 mid: "Clear orbit paths",
 high: "Rule banner locked",
 },
 start: 0,
 threshold: 0.85,
 onDone: () => {
 mountQuiz(overlay, {
 scene: "solarRule",
 title: "Rule check",
 q: "What is the main Solar Family orbit rule?",
 opts: [
 "Planets orbit the Sun (our star)",
 "The Sun orbits Earth each day",
 "Only moons orbit the Sun",
 "Cars and balls are planets too",
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
 setCoach("Transfer: same solar family from home sky, school globe, street night, BD evening, and lab model.");
 const modes = [
 {
 mode: "home",
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "home")}<p><strong>Home rooftop:</strong> A bright 'star' that barely twinkles may be a planet reflecting sunlight.</p>`,
 },
 {
 mode: "school",
 html: `<p><strong>School globe:</strong> The globe is a tiny Earth - one planet in the family, not the center of everything.</p>`,
 },
 {
 mode: "street",
 html: `<p><strong>Street night:</strong> City lights hide faint stars, but bright planets can still shine - same Sun-centered family.</p>`,
 },
 {
 mode: "bd",
 html: `<p><strong>Dhaka clear evening:</strong> Spotting Venus or Jupiter still means: planets orbit the Sun.</p>`,
 },
 {
 mode: "lab",
 html: `<p><strong>Lab lamp model:</strong> Lamp = Sun, ball = Earth on a loop. The rule stays: planets orbit the Sun.</p>`,
 },
 ];
 let step = 0;

 function show() {
 if (step >= modes.length) {
 mountQuiz(overlay, {
 scene: "solarStretch",
 sceneArgs: { mode: "school" },
 title: "Stretch check",
 q: "Which statement fits home sky, school globe, street night, BD evening, and lab model?",
 opts: [
 "They all connect to the same idea: planets orbit the Sun",
 "Only scientists' labs have orbits",
 "Globes prove the Sun orbits Earth",
 "Street lights are planets",
 ],
 ok: 0,
 onDone: completeSub,
 });
 return;
 }
 const m = modes[step];
 labState.mode = m.mode;
 mountTapContinue(overlay, {
 scene: "solarStretch",
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
 scene: "solarMyth",
 title: "Myth Bust",
 badge: LAB_ASSET_PATHS.myth,
 myths: [
 {
 sceneMyth: 0,
 title: "“The Sun orbits Earth”",
 claim: "The Sun races around Earth each day.",
 truth: "Earth and planets orbit the Sun; day/night is mostly Earth's spin.",
 },
 {
 sceneMyth: 1,
 title: "“All planets are the same size”",
 claim: "Every planet is basically Earth-sized.",
 truth: "Sizes differ - Jupiter is huge, Mercury is small.",
 },
 {
 sceneMyth: 2,
 title: "“The Moon is a planet”",
 claim: "The Moon counts as a planet in the solar family.",
 truth: "The Moon orbits Earth - it is a moon, not a Sun-orbiting planet.",
 },
 {
 sceneMyth: 3,
 title: "“Stars and planets are the same”",
 claim: "Any bright sky light is the same kind of object.",
 truth: "The Sun is a star; planets reflect its light and orbit it.",
 },
 {
 sceneMyth: 4,
 title: "“Only scientists can know orbits”",
 claim: "Kids cannot understand who orbits whom.",
 truth: "Kids can learn the rule: planets go around the Sun.",
 },
 ],
 onDone: completeSub,
 });
}

function sub9_drill({ overlay, setCoach, completeSub }) {
 setCoach("Fluency: quick application checks. Need about 80% to unlock Continue.");
 mountSpeedDrill(overlay, {
 scene: "solarDrill",
 passScene: "solarMastery",
 passRatio: 0.8,
 items: [
 {
 prompt: "Orbit rule",
 q: "Planets mainly...",
 opts: ["Orbit the Sun", "Orbit the Moon only", "Sit still forever", "Orbit toy cars"],
 ok: 0,
 },
 {
 prompt: "Sun kind",
 q: "The Sun is best called a...",
 opts: ["Star", "Planet", "Moon", "Comet"],
 ok: 0,
 },
 {
 prompt: "Moon role",
 q: "Earth's Moon...",
 opts: ["Orbits Earth (not a planet here)", "Is a second Sun", "Is a gas giant planet", "Is empty of motion"],
 ok: 0,
 },
 {
 prompt: "Jupiter",
 q: "Jupiter is a...",
 opts: ["Planet (gas giant)", "Street lamp", "Soccer ball", "Thought only"],
 ok: 0,
 },
 {
 prompt: "Not space",
 q: "Which does NOT belong in the solar family sort?",
 opts: ["Toy car on a road", "Mercury", "Earth", "Jupiter"],
 ok: 0,
 },
 {
 prompt: "Earth year",
 q: "Earth's year is mainly...",
 opts: ["One full orbit around the Sun", "One spin only", "The Sun orbiting Earth", "A cricket match"],
 ok: 0,
 },
 {
 prompt: "Closer path",
 q: "In the closer-orbit model, a nearer path means...",
 opts: ["A quicker year lap", "No gravity", "A new star is born", "Planets freeze still"],
 ok: 0,
 },
 {
 prompt: "Comet",
 q: "A comet in our sort is...",
 opts: ["Other (visitor), not a planet bin", "The Sun", "A not-space toy", "Proof air has no sky objects"],
 ok: 0,
 },
 ],
 onDone: completeSub,
 });
}

function sub10_mastery({ overlay, setCoach, completeSub }) {
 setCoach("Mastery: rebuild the path, transfer to lamp-and-ball demo, then prove it.");
 playScene("solarMastery");
 mountOrderSteps(overlay, {
 scene: "solarMastery",
 title: "Orbit Scout Mastery - learning path",
 instructions: "Tap Bruner order: meet -> sort -> labs -> rule -> stretch/myths.",
 items: [
 { id: "1", html: "Meet Sun + planets (concrete)" },
 { id: "2", html: "Sort planet / Sun / other / not" },
 { id: "3", html: "Clarity + closer orbit labs (do it)" },
 { id: "4", html: "Name the planets-orbit-Sun rule" },
 { id: "5", html: "Stretch sky places + bust myths" },
 ],
 correctIds: ["1", "2", "3", "4", "5"],
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "solarMastery",
 html: `<h3>Mixed case</h3>
 <p><strong>Lamp + ball:</strong> Lamp stays the Sun; ball Earth loops the lamp. Same family rule outdoors on a Dhaka evening.</p>
 <p>Ready for the final checks?</p>`,
 onDone: () => {
 mountMultiQuiz(overlay, {
 scene: "solarMastery",
 title: "Final mastery",
 doneTitle: "Orbit Scout ready",
 items: [
 {
 q: "Sun, Earth, and Jupiter all fit the Solar Family idea because...",
 opts: [
 "Planets orbit the Sun (our star) on paths",
 "They are unrelated magic lights",
 "Only Earth moves; others are stickers",
 "The Sun orbits each planet in turn",
 ],
 ok: 0,
 },
 {
 q: "A correct statement about moons vs planets here is...",
 opts: [
 "Moons orbit planets; planets orbit the Sun",
 "Moons and planets are identical words",
 "Moons are a type of star",
 "Planets only exist inside myths",
 ],
 ok: 0,
 },
 {
 q: "Which belongs in “not space” for this mission's sort?",
 opts: ["A soccer ball", "Mercury", "The Sun", "A comet"],
 ok: 0,
 },
 ],
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "solarMastery",
 badge: LAB_ASSET_PATHS.m1,
 html: `<h3>Mission 1 complete path</h3>
 <p>You earned the story arc from desk family to a reusable orbit rule. Use step dots to replay any weak spot. Press <strong>Next</strong> in the dock to claim <strong>Orbit Scout</strong>.</p>`,
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
