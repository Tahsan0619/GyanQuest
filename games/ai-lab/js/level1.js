/**
 * Artificial Intelligence - Mission 1: What is AI?
 * 10 sub-levels, Bruner spiral: enactive -> iconic -> symbolic.
 * Topic: patterns from examples, not magic - not chemistry particle zoom.
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
 mountMythCards,
 mountTapContinue,
 mountOrderSteps,
 mountScaleLab,
 mountMultiQuiz,
 playScene,
 badgeHtml,
} from "./lab-activities.js";

export const L1_META = {
 objective: "By the end of this mission, you'll be able to explain AI as patterns from examples, not magic, in your own words.",
 bdHook:
 "Bangladesh everyday: phone gallery tags, voice helper guesses, map routes in Dhaka traffic - tools that guess from past examples, not magic.",
 predict: {
 q: "Before we start - what makes a phone photo tagger work best?",
 options: [
 "A magic brain that feels like a person",
 "Many photo examples so it can spot patterns",
 "A light switch with no data",
 ],
 ok: 1,
 },

 kidTitle: "What is AI?",
 theme: "patterns from examples, not magic",
 emoji: "🧠",
 rewardName: "AI Rookie",
 intro:
 "AI spots patterns in examples - it is not magic and it does not think like a person. We start with phone tags, voice helpers, and maps - then name a clear rule you can reuse anywhere.",
 everyday: [
 "Phone photo tags",
 "Voice assistant guesses",
 "Map route suggestions",
 ],
 subTitles: [
 "Meet AI",
 "Watch Pattern Dial",
 "Sort: AI or Not?",
 "Stronger Pattern Lab",
 "Why AI Guesses",
 "Name the AI Rule",
 "Stretch: Places",
 "Myth Bust",
 "Fluency Drill",
 "AI Rookie Mastery",
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
 labState.guessStep = 0;
 labState.labMode = "clarity";

 const runners = [
 sub1_meet,
 sub2_dial,
 sub3_sort,
 sub4_stronger,
 sub5_guesses,
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
 setCoach("Hook + light enactive: meet photo tags, voice helpers, and maps - tools that guess from past examples.");
 mountMotionChain(overlay, {
 title: "Meet AI",
 beats: [
 {
 scene: "aiMeet",
 sceneArgs: { phase: "desk" },
 dwellMs: 4200,
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "ai")}
 <p><strong>Act 1 - Everyday tools:</strong> Phone photo tags, a voice helper, and a map route sit on the desk.</p>
 <p>Each one guesses from past examples - not from a tiny person inside.</p>`,
 },
 {
 scene: "aiMeet",
 sceneArgs: { phase: "glow" },
 dwellMs: 4500,
 html: `<p><strong>Act 2 - Patterns light up:</strong> Similar inputs lead to similar outputs across tools.</p>
 <p>That shared idea is <strong>pattern spotting</strong> - a toy model of how AI works.</p>`,
 },
 {
 scene: "aiMeet",
 sceneArgs: { phase: "settle" },
 dwellMs: 4200,
 html: `<p><strong>Act 3 - Big idea:</strong> AI spots patterns in examples, then guesses on new cases.</p>
 <p>It is not magic and it does not think like a human mind.</p>`,
 },
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "aiMeet",
 sceneArgs: { phase: "settle" },
 title: "Exit check",
 q: "What does AI mainly do with examples?",
 opts: [
 "Spot patterns to make a guess on new cases",
 "Feel emotions like a person",
 "Skip all data forever",
 "Only store passwords",
 ],
 ok: 0,
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "aiMeet",
 sceneArgs: { phase: "settle" },
 badge: LAB_ASSET_PATHS.m1,
 html: `<h3>You met AI</h3><p>Next we raise a pattern-clarity dial until the guess looks solid.</p>`,
 onDone: completeSub,
 advanceAfterDone: true,
 });
 },
 });
 },
 });
}

function sub2_dial({ overlay, setCoach, completeSub }) {
 setCoach("Enactive: raise pattern clarity until messy examples line up into a usable guess.");
 labState.heat = 0.2;
 labState.labMode = "clarity";
 mountHeatLab(overlay, {
 scene: "aiLab",
 sceneArgs: { labMode: "clarity" },
 badge: LAB_ASSET_PATHS.m1,
 title: "Watch Pattern Dial",
 html: `<p>Messy photo/voice examples start jumbled. Drag the <strong>Pattern clarity</strong> dial (or canvas handle) until examples line up.</p>
 <p>This is data quality - not melting ice or heating molecules.</p>`,
 goalText: "Goal: clarity past ~60% so the guess looks solid.",
 startHeat: 0.2,
 threshold: 0.6,
 doneLabel: "Pattern clear - continue ▶",
 axis: "x",
 canvasAction: "stretch",
 sliderLabel: "Pattern clarity",
 readoutLabels: {
 cold: "Messy examples - guess is noisy",
 melting: "Some examples lining up…",
 liquid: "Pattern forming - guess improving",
 simmer: "Clear pattern - guess looks solid",
 },
 onDone: () => {
 mountQuiz(overlay, {
 scene: "aiLab",
 sceneArgs: { labMode: "clarity" },
 title: "Dial check",
 q: "Raising pattern clarity mainly means…",
 opts: [
 "Examples line up better so the guess gets more reliable",
 "The AI grows feelings like a person",
 "We delete all data forever",
 "The phone becomes a plain light switch",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
}

function sub3_sort({ overlay, setCoach, completeSub }) {
 setCoach("Enactive sort: real AI tools vs fixed automation vs tricky lookalikes.");
 mountTapContinue(overlay, {
 scene: "aiSort",
 html: `<h3>AI vs not AI vs tricky</h3>
 <p><strong>AI tool:</strong> learns patterns from examples (photo tagger, voice helper, map suggest, spell suggest).</p>
 <p><strong>Not AI:</strong> fixed rules - calculator, light switch, wall clock.</p>
 <p><strong>Tricky:</strong> a scripted FAQ bot can look smart but only replays canned lines.</p>`,
 onDone: () => {
 mountDragSort(overlay, {
 scene: "aiSort",
 title: "Sort: AI or Not?",
 instructions: "Drag into AI tool / Not AI / Tricky.",
 successText: "AI sorts locked!",
 chips: [
 { id: "photo", text: "Photo tagger", short: "Photos", color: 12616956 },
 { id: "voice", text: "Voice helper", short: "Voice", color: 10980346 },
 { id: "map", text: "Map route guess", short: "Maps", color: 3718648 },
 { id: "calc", text: "Plain calculator", short: "Calc", color: 9741240 },
 { id: "switch", text: "Light switch", short: "Switch", color: 7893356 },
 { id: "faq", text: "Fixed FAQ bot", short: "FAQ bot", color: 16347926 },
 { id: "spell", text: "Spell check suggest", short: "Spell", color: 2278750 },
 { id: "clock", text: "Wall clock", short: "Clock", color: 6583435 },
 ],
 zones: [
 { id: "ai", label: "AI tool", accept: ["photo", "voice", "map", "spell"] },
 { id: "not", label: "Not AI", accept: ["calc", "switch", "clock"] },
 { id: "tricky", label: "Tricky", accept: ["faq"] },
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "aiSort",
 title: "Justify",
 q: "Why is a fixed FAQ chatbot tricky (not true AI learning)?",
 opts: [
 "It mostly replays canned scripts, not patterns learned from many new examples",
 "Because it uses electricity",
 "Because it is on a phone",
 "Because calculators are AI too",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function sub4_stronger({ overlay, setCoach, completeSub }) {
 setCoach("Push example count and guess confidence higher - stronger patterns need more good data.");
 labState.heat = 0.35;
 labState.labMode = "strength";
 mountHeatLab(overlay, {
 scene: "aiLab",
 sceneArgs: { labMode: "strength" },
 badge: LAB_ASSET_PATHS.m1,
 title: "Stronger Pattern Lab",
 html: `<p>Watch the example pile grow and the <strong>guess confidence</strong> bar rise. Drag until confidence ≥ 75%.</p>
 <p>More varied examples usually mean a sturdier pattern - still not a human mind.</p>`,
 goalText: "Goal: confidence past ~75% with a fuller example set.",
 startHeat: 0.35,
 threshold: 0.75,
 doneLabel: "Stronger pattern - continue ▶",
 axis: "x",
 canvasAction: "stretch",
 sliderLabel: "Guess confidence",
 readoutLabels: {
 cold: "Few examples - weak guess",
 melting: "Example pile growing…",
 liquid: "Confidence rising",
 simmer: "Strong pattern - guess looks reliable",
 },
 onDone: () => {
 mountRevealSteps(overlay, {
 scene: "aiLab",
 sceneArgs: { labMode: "strength" },
 title: "Why more examples help",
 steps: [
 "Sparse data → shaky patterns.",
 "More varied examples → clearer shared features.",
 "Clearer patterns → more confident guesses on new cases.",
 "Lesson: quality and variety of examples fuel AI - not magic.",
 ],
 onStep: (i) => {
 labState.heat = 0.4 + i * 0.15;
 labState.heatTarget = labState.heat;
 },
 onDone: completeSub,
 });
 },
 });
}

function sub5_guesses({ overlay, setCoach, completeSub }) {
 setCoach("Order how an AI guess is made: examples → patterns → guess → check.");
 labState.guessStep = 0;
 mountOrderSteps(overlay, {
 scene: "aiGuess",
 sceneArgs: { step: 0 },
 title: "Why AI Guesses",
 instructions: "Order the story of a guess.",
 items: [
 { id: "data", html: "Collect many examples" },
 { id: "pattern", html: "Find patterns in the data" },
 { id: "guess", html: "Make a guess on new input" },
 { id: "check", html: "Check and improve with feedback" },
 ],
 correctIds: ["data", "pattern", "guess", "check"],
 onDone: () => {
 labState.guessStep = 3;
 mountRevealSteps(overlay, {
 scene: "aiGuess",
 sceneArgs: { step: 3 },
 title: "Causal chain",
 steps: [
 "Examples are the fuel.",
 "Patterns are what the system extracts.",
 "A guess is applied to a new input.",
 "Feedback / checks improve later guesses - messy data can bias results.",
 ],
 onStep: (i) => {
 labState.guessStep = i;
 },
 onDone: () => {
 mountQuiz(overlay, {
 scene: "aiGuess",
 sceneArgs: { step: 3 },
 title: "Check",
 q: "If the examples are messy or biased, the AI guess often…",
 opts: [
 "Gets worse or biased",
 "Becomes perfect forever",
 "Stops needing data",
 "Turns into a light switch",
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
 setCoach("Symbolic: build the AI rule, then scrub tools → patterns → rule banner (not a salt-grain zoom).");
 mountEquationBuild(overlay, {
 scene: "aiRule",
 title: "Name the AI Rule",
 instructions: "Tap tokens in order to build the What is AI? rule.",
 tokens: [
 { id: "a", html: "AI" },
 { id: "b", html: "learns" },
 { id: "c", html: "patterns" },
 { id: "d", html: "from examples" },
 ],
 correctIds: ["a", "b", "c", "d"],
 badge: LAB_ASSET_PATHS.rule,
 onDone: () => {
 mountScaleLab(overlay, {
 scene: "aiRule",
 title: "Pattern scale scrubber",
 html: `<p>Scrub the left canvas: everyday tools → pattern cloud → the rule banner.</p>
 <p>This is identity of the AI idea - not Tiny Bits salt → ions → orbitals.</p>`,
 sliderLabel: "AI scale: tools → patterns → rule",
 goalText: "Canvas shows photo/voice/map tools, then a pattern cloud, then the AI rule.",
 readoutLabels: {
 low: "Everyday tools (photos, voice, maps)",
 mid: "Patterns emerging from examples",
 high: "Rule: AI learns patterns from examples",
 },
 start: 0.1,
 threshold: 0.85,
 onDone: () => {
 mountQuiz(overlay, {
 scene: "aiRule",
 title: "Model check",
 q: "What is the main What is AI? rule?",
 opts: [
 "AI learns patterns from examples, then guesses on new cases",
 "AI is a magic brain that feels like a person",
 "AI never needs data",
 "Every automated button is AI",
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
 setCoach("Transfer: same pattern rule at home, school, street, BD shop, and lab.");
 const modes = [
 {
 mode: "home",
 title: "Home - phone tags",
 blurb: "A gallery app tags your cat because it saw many cat-photo patterns before.",
 },
 {
 mode: "school",
 title: "School - next-word guess",
 blurb: "Voice or typing helpers guess the next word from past language examples.",
 },
 {
 mode: "street",
 title: "Street - map route",
 blurb: "Maps suggest a faster road from traffic patterns in past trips.",
 },
 {
 mode: "shop",
 title: "BD shop - shelf camera",
 blurb: "A shop camera that flags empty shelves learns from many past shelf photos - not magic.",
 },
 {
 mode: "lab",
 title: "Classroom lab",
 blurb: "Same core idea on the bench: examples → patterns → checked guesses.",
 },
 ];
 let step = 0;

 function show() {
 if (step >= modes.length) {
 mountQuiz(overlay, {
 scene: "aiStretch",
 sceneArgs: { mode: "shop" },
 title: "Stretch check",
 q: "A photo app tags your cat because…",
 opts: [
 "It saw many cat photo patterns before",
 "It feels love for cats",
 "It ignores all photos",
 "It is a plain light switch",
 ],
 ok: 0,
 onDone: completeSub,
 });
 return;
 }
 const m = modes[step];
 labState.mode = m.mode;
 mountTapContinue(overlay, {
 scene: "aiStretch",
 sceneArgs: { mode: m.mode },
 html: `<div class="lab-demo__badge">Context ${step + 1} of ${modes.length}</div>
 <h3>${m.title}</h3><p>${m.blurb}</p>
 <p>Tap the matching place chip on the canvas, then continue.</p>`,
 onDone: () => {
 step++;
 show();
 },
 });
 }
 show();
}

function sub8_myths({ overlay, setCoach, completeSub }) {
 setCoach("Misconceptions: claim first on canvas; truth diagram appears after you bust the myth.");
 mountMythCards(overlay, {
 scene: "aiMyth",
 title: "Myth Bust",
 badge: LAB_ASSET_PATHS.myth,
 myths: [
 {
 sceneMyth: 0,
 title: "“AI is a magic brain”",
 claim: "AI is a magic brain that thinks like humans.",
 truth: "AI spots statistical patterns in examples - not a human mind.",
 },
 {
 sceneMyth: 1,
 title: "“AI never needs data”",
 claim: "AI never needs data.",
 truth: "Good examples are the fuel for pattern learning.",
 },
 {
 sceneMyth: 2,
 title: "“One wrong guess = useless”",
 claim: "One wrong guess means AI is useless.",
 truth: "Guesses improve with better data and checks.",
 },
 {
 sceneMyth: 3,
 title: "“Every button is AI”",
 claim: "Every automated button is AI.",
 truth: "Simple switches and fixed scripts are not AI.",
 },
 {
 sceneMyth: 4,
 title: "“Only adults get AI”",
 claim: "Only adults can understand AI.",
 truth: "Kids can learn: examples → patterns → guesses.",
 },
 ],
 onDone: completeSub,
 });
}

function sub9_drill({ overlay, setCoach, completeSub }) {
 setCoach("Fluency: quick application checks. Need about 80% to unlock Continue.");
 mountSpeedDrill(overlay, {
 scene: "aiDrill",
 passScene: "aiMastery",
 passRatio: 0.8,
 title: "Fluency Drill",
 items: [
 { prompt: "Spot?", q: "AI mainly spots…?", opts: ["Patterns", "Feelings"], ok: 0 },
 { prompt: "Data?", q: "Does AI need examples?", opts: ["Yes", "Never"], ok: 0 },
 { prompt: "Switch?", q: "Is a light switch AI?", opts: ["No", "Yes"], ok: 0 },
 { prompt: "Wrong?", q: "Can AI guesses be wrong?", opts: ["Yes", "Never"], ok: 0 },
 { prompt: "Mind?", q: "Is AI the same as a human mind?", opts: ["No", "Yes"], ok: 0 },
 { prompt: "Better?", q: "Better examples can help?", opts: ["Yes", "No"], ok: 0 },
 {
 prompt: "Rule?",
 q: "Best What is AI? rule?",
 opts: ["Patterns from examples", "Magic brain feelings", "No data needed", "Every button is AI"],
 ok: 0,
 },
 {
 prompt: "FAQ bot?",
 q: "A fixed FAQ bot is best called…",
 opts: ["Tricky / scripted", "True pattern learning", "A human mind", "A map route"],
 ok: 0,
 },
 ],
 onDone: completeSub,
 });
}

function sub10_mastery({ overlay, setCoach, completeSub }) {
 setCoach("Mastery: rebuild the path, transfer to a mixed case, then prove it.");
 playScene("aiMastery");
 mountOrderSteps(overlay, {
 scene: "aiMastery",
 title: "AI Rookie Mastery - learning path",
 instructions: "Tap Bruner order: meet → sort → labs → rule → stretch/myths.",
 items: [
 { id: "1", html: "Meet everyday AI tools (concrete)" },
 { id: "2", html: "Sort AI / not AI / tricky" },
 { id: "3", html: "Dial clarity + stronger examples" },
 { id: "4", html: "Name the patterns-from-examples rule" },
 { id: "5", html: "Stretch places + bust myths" },
 ],
 correctIds: ["1", "2", "3", "4", "5"],
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "aiMastery",
 html: `<h3>Mixed case</h3>
 <p><strong>Phone tag + shop shelf cam:</strong> Both guess from past photo patterns; a wall switch does not. Same AI idea, different places.</p>
 <p>Ready for the final checks?</p>`,
 onDone: () => {
 mountMultiQuiz(overlay, {
 scene: "aiMastery",
 title: "Final mastery",
 doneTitle: "AI Rookie ready",
 items: [
 {
 q: "Photo tags, voice helpers, and map routes all teach the same idea because…",
 opts: [
 "They spot patterns in examples to guess on new cases",
 "They are magic brains with feelings",
 "They never use data",
 "They are the same as light switches",
 ],
 ok: 0,
 },
 {
 q: "A correct statement about AI vs a human mind here is…",
 opts: [
 "AI is pattern spotting from data - not a person thinking inside the box",
 "AI and human minds are identical",
 "AI never makes mistakes",
 "AI works without any examples",
 ],
 ok: 0,
 },
 {
 q: "Which belongs in “not AI”?",
 opts: ["A plain light switch", "A photo tagger", "A voice helper", "A map route suggester"],
 ok: 0,
 },
 ],
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "aiMastery",
 badge: LAB_ASSET_PATHS.m1,
 html: `<h3>Mission 1 complete path</h3>
 <p>You earned the story arc from everyday tools to a reusable rule. Use step dots to replay any weak spot. Press <strong>Next</strong> in the dock to claim <strong>AI Rookie</strong>.</p>`,
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
