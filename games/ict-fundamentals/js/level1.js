/**
 * ICT - Mission 1: Computer Bits
 * Tiny Bits depth, hardware-specific interactions (CPU / RAM / storage).
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
 mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild, mountScaleLab,
 mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps,
 mountRevealSteps, mountMultiQuiz, badgeHtml,
} from "./lab-activities.js";

export const L1_META = {
 objective: "By the end of this mission, you'll be able to explain CPU / RAM / storage in your own words.",
 bdHook:
 "Bangladesh everyday: phone chip, school lab PC, saving a homework file - notice CPU / RAM / storage on every machine.",
 predict: {
 q: "Before we start - what mainly keeps a saved photo after you shut the PC down?",
 options: [
 "Open apps stay forever in RAM",
 "Storage keeps the saved file; RAM clears when power is off",
 "Only the screen stores homework",
 ],
 ok: 1,
 },

 kidTitle: "Computer Bits",
 theme: "CPU / RAM / storage",
 emoji: "\ud83d\udda5",
 rewardName: "Bit Scout",
 intro:
 "CPU thinks, RAM holds open work, storage keeps files after power off. We meet the inside team on a desk, fill RAM under load, then lock a rule you can reuse on phones and school PCs.",
 everyday: ["Phone chip", "Laptop upgrades", "Saving a school file"],
 subTitles: [
 "Meet the Inside Team", "Busy PC Lab", "Sort the Jobs", "RAM Fill Lab",
 "Why Three Parts", "Name the Bits Rule", "Stretch: Devices", "Myth Bust",
 "Fluency Drill", "Bit Scout Mastery",
 ],
};

export function runL1Sub(subIndex, api) {
 const { registerTryAgain } = api;
 labState.reveal = false; labState.tokenProgress = 0; labState.masteryStep = 0;
 labState.placed = {}; labState.selectedId = null; labState.mythPhase = "claim";
 labState.heat = 0.3; labState.phase = "desk"; labState.mode = "phone"; labState.scale = 0;
 const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => { api.overlay.innerHTML = ""; fn(api); });
 fn(api);
}

function s1({ overlay, setCoach, completeSub }) {
 setCoach("Hook: brain, desk pad, cupboard - CPU, RAM, storage on one machine.");
 mountMotionChain(overlay, {
 title: "Meet the Inside Team",
 beats: [
 {
 scene: "bitsMeet", sceneArgs: { phase: "desk" }, dwellMs: 4200,
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "bits")}
 <p><strong>Act 1 - Desk props:</strong> Drag the CPU chip, RAM stick, and storage disk.</p>
 <p>These are the three parts every computer needs to think, hold work, and keep files.</p>`,
 },
 {
 scene: "bitsMeet", sceneArgs: { phase: "glow" }, dwellMs: 4500,
 html: `<p><strong>Act 2 - Links:</strong> Watch the glow between CPU and RAM.</p>
 <p>Open apps need the CPU to run instructions and RAM to hold them right now.</p>`,
 },
 {
 scene: "bitsMeet", sceneArgs: { phase: "settle" }, dwellMs: 4200,
 html: `<p><strong>Act 3 - Power-off story:</strong> Storage is the cupboard that keeps photos and homework when power is off.</p>
 <p>RAM clears; the disk (or SSD) keeps what you saved.</p>`,
 },
 ],
 onDone: () => mountQuiz(overlay, {
 scene: "bitsMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
 q: "Which keeps a photo after you shut down?",
 opts: [
 "Storage (SSD/disk)",
 "Only RAM",
 "Only the screen",
 "The keyboard",
 ],
 ok: 0,
 onDone: () => mountTapContinue(overlay, {
 scene: "bitsMeet", sceneArgs: { phase: "settle" }, badge: LAB_ASSET_PATHS.m1,
 html: `<h3>Inside team ready</h3><p>Next: make the PC busy and watch RAM fill.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 }),
 });
}

function s2({ overlay, setCoach, completeSub }) {
 setCoach("Enactive: more CPU work opens more tasks - watch RAM fill (not a chemistry melt).");
 labState.heat = 0.25;
 mountHeatLab(overlay, {
 scene: "bitsLab", title: "Busy PC Lab",
 html: `<p>Drag the blue handle or use the slider. As <strong>CPU work</strong> rises, open tasks pile into <strong>RAM</strong>.</p>
 <p>This dial is workload - not temperature.</p>`,
 goalText: "Goal: push busy level past ~60% so RAM looks packed with open apps.",
 doneLabel: "Busy checked - continue", threshold: 0.6, startHeat: 0.25,
 axis: "x", canvasAction: "stretch", sliderLabel: "CPU work (open apps)",
 badge: LAB_ASSET_PATHS.m1,
 readoutLabels: {
 cold: "Idle - few open apps in RAM",
 melting: "Warming up - more tabs opening",
 liquid: "Busy - RAM holding lots of open work",
 simmer: "Maxed - CPU maxed, RAM nearly full",
 },
 onDone: () => mountQuiz(overlay, {
 scene: "bitsLab", title: "Busy check",
 q: "When the PC gets busier, what fills with open work?",
 opts: [
 "RAM holds the open apps; CPU keeps running them",
 "Only the printer fills up",
 "Storage melts like ice",
 "The keyboard stores the apps forever",
 ],
 ok: 0, onDone: completeSub,
 }),
 });
}

function s3({ overlay, setCoach, completeSub }) {
 setCoach("Enactive sort: CPU calculates, RAM holds now, storage keeps, snacks are not PC parts.");
 mountTapContinue(overlay, {
 scene: "bitsSort",
 html: `<h3>Jobs for the inside team</h3>
 <p><strong>CPU:</strong> calculate, run instructions.</p>
 <p><strong>RAM:</strong> hold an open app or scratch pad right now.</p>
 <p><strong>Storage:</strong> keep a file or live on an SSD/disk.</p>
 <p><strong>Not a PC part:</strong> snacks and wall paint.</p>`,
 onDone: () => mountDragSort(overlay, {
 scene: "bitsSort", title: "Sort the jobs",
 instructions: "Drag into CPU / RAM / Storage / Not a PC part.",
 successText: "Team sorted!",
 chips: [
 { id: "calc", text: "Do the math fast", short: "Calculate", color: 0x60a5fa },
 { id: "open", text: "Hold open app", short: "Open app", color: 0x22c55e },
 { id: "save", text: "Keep photo forever", short: "Save file", color: 0x94a3b8 },
 { id: "boot", text: "Run instructions", short: "Run code", color: 0x3b82f6 },
 { id: "temp", text: "Scratch pad now", short: "Scratch", color: 0x4ade80 },
 { id: "ssd", text: "SSD / hard disk", short: "Disk", color: 0x64748b },
 { id: "snack", text: "Eat a snack", short: "Snack", color: 0xf97316 },
 { id: "paint", text: "Wall paint color", short: "Paint", color: 0xa78bfa },
 ],
 zones: [
 { id: "cpu", label: "CPU job", accept: ["calc", "boot"] },
 { id: "ram", label: "RAM job", accept: ["open", "temp"] },
 { id: "storage", label: "Storage job", accept: ["save", "ssd"] },
 { id: "not", label: "Not a PC part", accept: ["snack", "paint"] },
 ],
 onDone: () => mountQuiz(overlay, {
 scene: "bitsSort", title: "Justify",
 q: "Why is \"eat a snack\" NOT a CPU / RAM / storage job?",
 opts: [
 "It is not a computer hardware job - snacks are not PC parts",
 "Because snacks live in RAM forever",
 "Because snacks are a kind of SSD",
 "Because only paint is a PC part",
 ],
 ok: 0, onDone: completeSub,
 }),
 }),
 });
}

function s4({ overlay, setCoach, completeSub }) {
 setCoach("Push RAM fill higher - open work vanishes from RAM when power cuts, not from storage.");
 labState.heat = 0.4;
 mountHeatLab(overlay, {
 scene: "bitsLab", title: "RAM Fill Lab",
 html: `<p>Crank CPU work until the green RAM bar is mostly full (&gt;= 75%).</p>
 <p>Remember: this is temporary workspace - not the place homework \"lives\" after shutdown.</p>`,
 goalText: "Goal: RAM fill past ~75%.",
 doneLabel: "RAM lab done", threshold: 0.75, startHeat: 0.4,
 axis: "x", canvasAction: "stretch", sliderLabel: "CPU work -> RAM fill",
 badge: LAB_ASSET_PATHS.m1,
 readoutLabels: {
 cold: "Light load - RAM mostly free",
 melting: "Opening apps - RAM rising",
 liquid: "Heavy load - RAM packed",
 simmer: "Near full - close apps or risk slowdown",
 },
 onDone: () => mountRevealSteps(overlay, {
 scene: "bitsLab",
 title: "Power-off story",
 steps: [
 "Busy PC: CPU runs instructions; RAM holds open apps.",
 "You save a file: a copy goes to storage (SSD/disk).",
 "Power off: RAM clears - open apps are gone until reopen.",
 "Storage stays: the saved file is still there next time.",
 ],
 onDone: () => mountQuiz(overlay, {
 scene: "bitsMeet", sceneArgs: { phase: "settle" }, title: "RAM vs storage",
 q: "After shutdown, open apps that were only in RAM...",
 opts: [
 "Are cleared (need reopen)",
 "Stay forever in RAM",
 "Become the CPU",
 "Delete storage",
 ],
 ok: 0, onDone: completeSub,
 }),
 }),
 });
}

function s5({ overlay, setCoach, completeSub }) {
 setCoach("Order why we need three parts - think, hold now, keep forever.");
 mountOrderSteps(overlay, {
 scene: "bitsMeet", sceneArgs: { phase: "settle" }, title: "Why three parts",
 instructions: "Order the story from thinking to power-off.",
 items: [
 { id: "think", html: "CPU runs instructions" },
 { id: "hold", html: "RAM holds open work" },
 { id: "keep", html: "Storage keeps files" },
 { id: "off", html: "Power off - RAM clears, storage stays" },
 ],
 correctIds: ["think", "hold", "keep", "off"],
 onDone: () => mountQuiz(overlay, {
 scene: "bitsMeet", sceneArgs: { phase: "settle" }, title: "Check",
 q: "Why do we need all three parts?",
 opts: [
 "CPU thinks, RAM holds now, storage keeps after power off",
 "Only the screen matters",
 "RAM alone keeps files forever",
 "Storage runs every instruction",
 ],
 ok: 0, onDone: completeSub,
 }),
 });
}

function s6({ overlay, setCoach, completeSub }) {
 setCoach("Symbolic: build the Computer Bits rule, then scrub desk -> open work -> storage stays.");
 mountEquationBuild(overlay, {
 scene: "bitsRule", title: "Name the Bits Rule", instructions: "Tap tokens in order.",
 tokens: [
 { id: "a", html: "CPU thinks" },
 { id: "b", html: "RAM holds now" },
 { id: "c", html: "Storage keeps" },
 { id: "d", html: "after power off" },
 ],
 correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
 onDone: () => mountScaleLab(overlay, {
 scene: "bitsRule",
 title: "Bits scale scrubber",
 html: `<p>Slide from whole desk PC -> open apps in RAM -> storage that survives shutdown.</p>
 <p>This is a hardware story - not a chemistry grain zoom.</p>`,
 start: 0,
 threshold: 0.85,
 sliderLabel: "Bits scale: desk PC -> open RAM -> storage stays",
 goalText: "Canvas follows: desk team -> busy RAM glow -> Bit Scout rule banner.",
 readoutLabels: {
 low: "Desk PC - CPU, RAM, storage together",
 mid: "Open work glowing in RAM",
 high: "Rule: storage keeps after power off",
 },
 onDone: () => mountQuiz(overlay, {
 scene: "bitsRule", title: "Rule check",
 q: "Best Computer Bits rule?",
 opts: [
 "CPU thinks, RAM holds now, storage keeps after power off",
 "RAM and storage are the same thing",
 "Phones have no CPU",
 "Only gaming PCs have storage",
 ],
 ok: 0, onDone: completeSub,
 }),
 }),
 });
}

function s7({ overlay, setCoach, completeSub }) {
 setCoach("Transfer: same inside team in phone, laptop, lab PC, game box, and class tablet.");
 const modes = [
 {
 mode: "phone",
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "phone")}<p><strong>Phone:</strong> A pocket computer - SoC (CPU), RAM, and flash storage.</p>`,
 },
 {
 mode: "laptop",
 html: `<p><strong>Laptop:</strong> Same team, bigger screen - save essays to storage, not just RAM.</p>`,
 },
 {
 mode: "lab",
 html: `<p><strong>School lab PC:</strong> Shared desktops still need CPU + RAM + a disk for your folder.</p>`,
 },
 {
 mode: "game",
 html: `<p><strong>Game console:</strong> Fast CPU + enough RAM for worlds; games install onto storage.</p>`,
 },
 {
 mode: "class",
 html: `<p><strong>Class tablet:</strong> Still CPU / RAM / storage - apps open in RAM, installs live on storage.</p>`,
 },
 ];
 let step = 0;
 function show() {
 if (step >= modes.length) {
 mountQuiz(overlay, {
 scene: "bitsStretch", sceneArgs: { mode: "phone" }, title: "Transfer",
 q: "A phone still has...",
 opts: [
 "CPU + RAM + storage",
 "Only a screen",
 "No memory ever",
 "Only a keyboard",
 ],
 ok: 0, onDone: completeSub,
 });
 return;
 }
 const m = modes[step];
 labState.mode = m.mode;
 mountTapContinue(overlay, {
 scene: "bitsStretch", sceneArgs: { mode: m.mode },
 html: `<div class="lab-demo__badge">Device ${step + 1} of ${modes.length}</div>${m.html}`,
 onDone: () => { step++; show(); },
 });
 }
 show();
}

function s8({ overlay, setCoach, completeSub }) {
 setCoach("Misconceptions: claim first on canvas; truth appears after you bust the myth.");
 mountMythCards(overlay, {
 scene: "bitsMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
 myths: [
 { claim: "RAM and storage are the same", truth: "RAM is temporary-fast; storage keeps files after power off", sceneMyth: 0 },
 { claim: "CPU is only for gaming", truth: "CPU runs all instructions - school apps too", sceneMyth: 1 },
 { claim: "More storage always opens apps faster", truth: "Open speed leans on CPU + RAM; storage holds files", sceneMyth: 2 },
 { claim: "Phones have no CPU", truth: "Phones have a CPU/SoC", sceneMyth: 3 },
 { claim: "Closing the lid deletes storage", truth: "Storage files stay; RAM clears when powered off", sceneMyth: 4 },
 ],
 onDone: completeSub,
 });
}

function s9({ overlay, setCoach, completeSub }) {
 setCoach("Fluency: quick CPU / RAM / storage checks. Need about 80% to continue.");
 mountSpeedDrill(overlay, {
 scene: "bitsDrill", title: "Fluency Drill", passScene: "bitsMastery", passRatio: 0.8,
 items: [
 { q: "CPU main job?", opts: ["Run instructions", "Store photos forever"], ok: 0, prompt: "CPU" },
 { q: "RAM after power off?", opts: ["Clears", "Keeps forever"], ok: 0, prompt: "RAM" },
 { q: "Where saved homework lives?", opts: ["Storage", "Only RAM"], ok: 0, prompt: "Save" },
 { q: "SSD is a kind of...", opts: ["Storage", "Keyboard"], ok: 0, prompt: "SSD" },
 { q: "Open apps sit mainly in...", opts: ["RAM", "Printer"], ok: 0, prompt: "Open" },
 { q: "Snack is a PC part?", opts: ["No", "Yes"], ok: 0, prompt: "Snack" },
 { q: "Best Bits rule?", opts: ["CPU thinks, RAM holds, storage keeps", "Only screens matter"], ok: 0, prompt: "Rule" },
 { q: "Phone has a CPU?", opts: ["Yes (SoC/chip)", "Never"], ok: 0, prompt: "Phone" },
 ],
 onDone: completeSub,
 });
}

function s10({ overlay, setCoach, completeSub }) {
 setCoach("Mastery: rebuild the path, transfer to phone + lab PC, then prove it.");
 mountOrderSteps(overlay, {
 scene: "bitsMastery", title: "Bit Scout Mastery",
 instructions: "Order your journey: meet -> sort -> lab -> rule -> myth/scout.",
 items: [
 { id: "meet", html: "Meet the inside team" },
 { id: "sort", html: "Sort CPU / RAM / storage jobs" },
 { id: "lab", html: "Busy PC + RAM fill labs" },
 { id: "rule", html: "Name the Bits rule" },
 { id: "myth", html: "Stretch devices + bust myths" },
 { id: "scout", html: "Claim Bit Scout" },
 ],
 correctIds: ["meet", "sort", "lab", "rule", "myth", "scout"],
 onDone: () => mountTapContinue(overlay, {
 scene: "bitsMastery",
 html: `<h3>Mixed case</h3>
 <p><strong>Phone + school lab:</strong> Both still have CPU (think), RAM (open now), and storage (save for later).</p>
 <p>Ready for the final checks?</p>`,
 onDone: () => mountMultiQuiz(overlay, {
 scene: "bitsMastery",
 title: "Final mastery",
 doneTitle: "Bit Scout ready",
 items: [
 {
 q: "CPU, RAM, and storage teach the same team idea because...",
 opts: [
 "They split think / hold-now / keep-after-power-off jobs",
 "They are all the same as a keyboard",
 "Only RAM keeps files forever",
 "Phones skip two of the three",
 ],
 ok: 0,
 },
 {
 q: "After shutdown, a photo you saved lives in...",
 opts: ["Storage", "Only RAM", "Only the CPU", "The snack drawer"],
 ok: 0,
 },
 {
 q: "Which is NOT a Computer Bits part?",
 opts: ["Wall paint color", "CPU", "RAM", "SSD storage"],
 ok: 0,
 },
 ],
 onDone: () => mountTapContinue(overlay, {
 scene: "bitsMastery", badge: LAB_ASSET_PATHS.m1,
 html: `<h3>Bit Scout!</h3>
 <p>You can explain CPU, RAM, and storage on phones and PCs. Press <strong>Next</strong> in the dock to claim the reward.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 }),
 }),
 });
}
