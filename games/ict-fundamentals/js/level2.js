/**
 * ICT - Mission 2: Input & Output
 * Tiny Bits depth, I/O-specific interactions (devices in and out).
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
 mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild, mountScaleLab,
 mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps,
 mountRevealSteps, mountMultiQuiz, badgeHtml,
} from "./lab-activities.js";

export const L2_META = {
 objective: "By the end of this mission, you'll be able to explain devices in and out in your own words.",
 bdHook:
 "Bangladesh everyday: typing homework, video-call mic/speaker, class touchscreen - notice what goes in and what comes out.",
 predict: {
 q: "Before we start - when you type and letters appear on screen, what mainly happened?",
 options: [
 "The screen stored files forever by itself",
 "Input (keyboard) went in, computer processed, output (screen) came out",
 "Heat melted the keyboard into text",
 ],
 ok: 1,
 },

 kidTitle: "Input & Output",
 theme: "devices in and out",
 emoji: "\u2328",
 rewardName: "I/O Ranger",
 intro:
 "Input sends data in. Output shows or plays results out. Some devices do both. We meet keyboard and screen, type a signal path, then lock a rule you can reuse in class and on calls.",
 everyday: ["Typing homework", "Video call mic/speaker", "Touchscreen tablet"],
 subTitles: [
 "Meet I/O Devices", "Type -> Screen Lab", "Sort Input/Output", "Signal Lab",
 "Path of a Keypress", "Name the I/O Rule", "Stretch: Real Life", "Myth Bust",
 "Fluency Drill", "I/O Ranger Mastery",
 ],
};

export function runL2Sub(subIndex, api) {
 const { registerTryAgain } = api;
 labState.reveal = false; labState.tokenProgress = 0; labState.masteryStep = 0;
 labState.placed = {}; labState.selectedId = null; labState.mythPhase = "claim";
 labState.heat = 0.2; labState.phase = "desk"; labState.mode = "class"; labState.typed = 0;
 labState.scale = 0;
 const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => { api.overlay.innerHTML = ""; fn(api); });
 fn(api);
}

function s1({ overlay, setCoach, completeSub }) {
 setCoach("Hook: keyboard and mic send in; screen and speaker send out.");
 mountMotionChain(overlay, {
 title: "Meet I/O Devices",
 beats: [
 {
 scene: "ioMeet", sceneArgs: { phase: "desk" }, dwellMs: 4200,
 html: `${badgeHtml(LAB_ASSET_PATHS.m2, "io")}
 <p><strong>Act 1 - Desk devices:</strong> Drag keyboard, screen, mic, and speaker.</p>
 <p>These are the tools that let you talk to the computer and see/hear results.</p>`,
 },
 {
 scene: "ioMeet", sceneArgs: { phase: "glow" }, dwellMs: 4500,
 html: `<p><strong>Act 2 - Labels:</strong> IN devices send data toward the computer.</p>
 <p>OUT devices show pictures or play sound back to you.</p>`,
 },
 {
 scene: "ioMeet", sceneArgs: { phase: "settle" }, dwellMs: 4200,
 html: `<p><strong>Act 3 - Loop:</strong> You -> input device -> computer -> output device -> you.</p>
 <p>That loop is the heart of Input & Output.</p>`,
 },
 ],
 onDone: () => mountQuiz(overlay, {
 scene: "ioMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
 q: "A microphone is mainly...",
 opts: ["Input", "Output only", "Storage", "CPU"],
 ok: 0,
 onDone: () => mountTapContinue(overlay, {
 scene: "ioMeet", sceneArgs: { phase: "settle" }, badge: LAB_ASSET_PATHS.m2,
 html: `<h3>I/O online</h3><p>Next: type letters and watch them appear on the screen.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 }),
 });
}

function s2({ overlay, setCoach, completeSub }) {
 setCoach("Enactive: send input until the screen shows enough letters (signal, not heat).");
 labState.heat = 0.2; labState.typed = 0;
 mountHeatLab(overlay, {
 scene: "ioLab", title: "Type -> Screen Lab",
 html: `<p>Drag the signal handle or tap the keyboard. Letters appear on the <strong>output</strong> screen.</p>
 <p>This dial is signal strength - not melting temperature.</p>`,
 goalText: "Goal: push the signal past ~60% so \"Hello\" fills the screen.",
 doneLabel: "Typed - continue", threshold: 0.6, startHeat: 0.2,
 axis: "x", canvasAction: "stretch", sliderLabel: "Input signal",
 badge: LAB_ASSET_PATHS.m2,
 readoutLabels: {
 cold: "Quiet - waiting for keypresses",
 melting: "Typing - letters start to appear",
 liquid: "Strong signal - screen filling with text",
 simmer: "Full Hello - input clearly became output",
 },
 onDone: () => mountQuiz(overlay, {
 scene: "ioLab", title: "Path check",
 q: "When you type and letters show on screen, what happened?",
 opts: [
 "Input (keyboard) became output (screen)",
 "The screen stored files forever",
 "Heat melted the keyboard",
 "Only the CPU is an output device",
 ],
 ok: 0, onDone: completeSub,
 }),
 });
}

function s3({ overlay, setCoach, completeSub }) {
 setCoach("Sort devices: input in, output out, touchscreen both, cake neither.");
 mountTapContinue(overlay, {
 scene: "ioSort",
 html: `<h3>Guide</h3>
 <p><strong>Input:</strong> keyboard, mouse, mic - send data in.</p>
 <p><strong>Output:</strong> screen, speaker, printer - show or play results out.</p>
 <p><strong>Both:</strong> touchscreen - display and touch.</p>
 <p><strong>Not I/O:</strong> birthday cake.</p>`,
 onDone: () => mountDragSort(overlay, {
 scene: "ioSort", title: "Sort I/O", instructions: "Drag into Input / Output / Both / Not I/O.",
 successText: "I/O sorted!",
 chips: [
 { id: "kb", text: "Keyboard", short: "Keyboard", color: 0x38bdf8 },
 { id: "mouse", text: "Mouse", short: "Mouse", color: 0x60a5fa },
 { id: "screen", text: "Monitor", short: "Screen", color: 0x22c55e },
 { id: "speaker", text: "Speaker", short: "Speaker", color: 0x4ade80 },
 { id: "mic", text: "Microphone", short: "Mic", color: 0x0ea5e9 },
 { id: "printer", text: "Printer", short: "Printer", color: 0xa3e635 },
 { id: "touch", text: "Touchscreen", short: "Touch", color: 0xfbbf24 },
 { id: "cake", text: "Birthday cake", short: "Cake", color: 0xf472b6 },
 ],
 zones: [
 { id: "input", label: "Input", accept: ["kb", "mouse", "mic"] },
 { id: "output", label: "Output", accept: ["screen", "speaker", "printer"] },
 { id: "both", label: "Both", accept: ["touch"] },
 { id: "not", label: "Not I/O", accept: ["cake"] },
 ],
 onDone: () => mountQuiz(overlay, {
 scene: "ioSort", title: "Justify",
 q: "Why is a touchscreen \"both\"?",
 opts: [
 "It shows output and also takes touch as input",
 "Because it stores homework forever",
 "Because it is a CPU",
 "Because cakes are also both",
 ],
 ok: 0, onDone: completeSub,
 }),
 }),
 });
}

function s4({ overlay, setCoach, completeSub }) {
 setCoach("Push the signal higher - same input-to-output path, stronger flow.");
 labState.heat = 0.4;
 mountHeatLab(overlay, {
 scene: "ioLab", title: "Signal Lab",
 html: `<p>Crank the signal past ~75%. Watch letters grow on the screen as input becomes output.</p>`,
 goalText: "Goal: signal past ~75%.",
 doneLabel: "Signal lab done", threshold: 0.75, startHeat: 0.4,
 axis: "x", canvasAction: "stretch", sliderLabel: "Signal strength",
 badge: LAB_ASSET_PATHS.m2,
 readoutLabels: {
 cold: "Weak signal - screen mostly blank",
 melting: "Rising - more letters out",
 liquid: "Strong - clear text on screen",
 simmer: "Full path - input fully driving output",
 },
 onDone: () => mountRevealSteps(overlay, {
 scene: "ioLab",
 title: "Signal story",
 steps: [
 "You press keys (input).",
 "The computer processes the presses.",
 "The screen shows letters (output).",
 "You read the result - the I/O loop closes.",
 ],
 onDone: completeSub,
 }),
 });
}

function s5({ overlay, setCoach, completeSub }) {
 setCoach("Order a keypress path from finger to eyes.");
 mountOrderSteps(overlay, {
 scene: "ioMeet", sceneArgs: { phase: "settle" }, title: "Path of a keypress",
 instructions: "Order the flow.",
 items: [
 { id: "press", html: "Press a key (input)" },
 { id: "cpu", html: "Computer processes" },
 { id: "show", html: "Screen shows letter (output)" },
 { id: "read", html: "You read the result" },
 ],
 correctIds: ["press", "cpu", "show", "read"],
 onDone: () => mountQuiz(overlay, {
 scene: "ioMeet", sceneArgs: { phase: "settle" }, title: "Path check",
 q: "After you press a key, what must happen before you can read a letter?",
 opts: [
 "Computer processes, then screen shows output",
 "The cake prints the letter",
 "Storage deletes the key",
 "Only the speaker must beep forever",
 ],
 ok: 0, onDone: completeSub,
 }),
 });
}

function s6({ overlay, setCoach, completeSub }) {
 setCoach("Symbolic: build Input -> Process -> Output, then scrub you -> devices -> computer.");
 mountEquationBuild(overlay, {
 scene: "ioRule", title: "Name the I/O Rule", instructions: "Tap tokens in order.",
 tokens: [
 { id: "a", html: "Input in" },
 { id: "b", html: "->" },
 { id: "c", html: "Process" },
 { id: "d", html: "-> Output out" },
 ],
 correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
 onDone: () => mountScaleLab(overlay, {
 scene: "ioRule",
 title: "I/O scale scrubber",
 html: `<p>Slide from desk devices -> signal path -> full I/O rule banner.</p>
 <p>This is device flow - not a salt-grain chemistry zoom.</p>`,
 start: 0,
 threshold: 0.85,
 sliderLabel: "I/O scale: devices -> signal path -> rule",
 goalText: "Canvas follows: desk I/O -> keyed signal -> INPUT -> PROCESS -> OUTPUT.",
 readoutLabels: {
 low: "Desk devices - keyboard in, screen out",
 mid: "Signal path - keypress becomes text",
 high: "Rule: Input -> Process -> Output",
 },
 onDone: () => mountQuiz(overlay, {
 scene: "ioRule", title: "Rule check",
 q: "Best Input & Output rule?",
 opts: [
 "Input goes in, computer processes, output comes out",
 "Monitors are always input devices",
 "Cake is a required I/O device",
 "Speakers store homework files",
 ],
 ok: 0, onDone: completeSub,
 }),
 }),
 });
}

function s7({ overlay, setCoach, completeSub }) {
 setCoach("Transfer: class typing, games, calls, printing, and music all use I/O.");
 const modes = [
 {
 mode: "class",
 html: `${badgeHtml(LAB_ASSET_PATHS.m2, "class")}<p><strong>Class:</strong> Keyboard in, monitor out for homework.</p>`,
 },
 {
 mode: "game",
 html: `<p><strong>Game:</strong> Controller/keys in; screen and speakers out.</p>`,
 },
 {
 mode: "call",
 html: `<p><strong>Video call:</strong> Mic in (your voice); speaker out (their voice).</p>`,
 },
 {
 mode: "print",
 html: `<p><strong>Print:</strong> File ready in the computer; printer outputs onto paper.</p>`,
 },
 {
 mode: "music",
 html: `<p><strong>Music:</strong> Tap play (input); speakers/headphones output sound.</p>`,
 },
 ];
 let step = 0;
 function show() {
 if (step >= modes.length) {
 mountQuiz(overlay, {
 scene: "ioStretch", sceneArgs: { mode: "call" }, title: "Transfer",
 q: "On a video call, your mic is...",
 opts: ["Input", "Only output", "Storage", "A folder"],
 ok: 0, onDone: completeSub,
 });
 return;
 }
 const m = modes[step];
 labState.mode = m.mode;
 mountTapContinue(overlay, {
 scene: "ioStretch", sceneArgs: { mode: m.mode },
 html: `<div class="lab-demo__badge">Context ${step + 1} of ${modes.length}</div>${m.html}`,
 onDone: () => { step++; show(); },
 });
 }
 show();
}

function s8({ overlay, setCoach, completeSub }) {
 setCoach("Misconceptions: claim first; truth after you bust the myth.");
 mountMythCards(overlay, {
 scene: "ioMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
 myths: [
 { claim: "A monitor is an input device", truth: "A plain monitor is output (touchscreens can be both)", sceneMyth: 0 },
 { claim: "Speakers take typing in", truth: "Speakers output sound", sceneMyth: 1 },
 { claim: "Microphone is output", truth: "Mic is input - your voice goes in", sceneMyth: 2 },
 { claim: "Printer is input", truth: "Printer outputs onto paper", sceneMyth: 3 },
 { claim: "Touchscreen is only output", truth: "Touchscreen is both - show and touch", sceneMyth: 4 },
 ],
 onDone: completeSub,
 });
}

function s9({ overlay, setCoach, completeSub }) {
 setCoach("Fluency: quick I/O checks. Need about 80% to continue.");
 mountSpeedDrill(overlay, {
 scene: "ioDrill", title: "Fluency Drill", passScene: "ioMastery", passRatio: 0.8,
 items: [
 { q: "Keyboard is...", opts: ["Input", "Output"], ok: 0, prompt: "KB" },
 { q: "Speaker is...", opts: ["Output", "Input"], ok: 0, prompt: "SPK" },
 { q: "Mic is...", opts: ["Input", "Output"], ok: 0, prompt: "Mic" },
 { q: "Printer is...", opts: ["Output", "Input"], ok: 0, prompt: "Print" },
 { q: "Touchscreen can be...", opts: ["Both", "Neither"], ok: 0, prompt: "Touch" },
 { q: "Cake is an I/O device?", opts: ["No", "Yes"], ok: 0, prompt: "Cake" },
 { q: "Best I/O rule?", opts: ["Input -> Process -> Output", "Output -> delete Input"], ok: 0, prompt: "Rule" },
 { q: "Monitor (plain) is...", opts: ["Output", "Input only"], ok: 0, prompt: "Screen" },
 ],
 onDone: completeSub,
 });
}

function s10({ overlay, setCoach, completeSub }) {
 setCoach("Mastery: rebuild the path, transfer to call + print, then prove it.");
 mountOrderSteps(overlay, {
 scene: "ioMastery", title: "I/O Ranger Mastery",
 instructions: "Order your journey: meet -> sort -> lab -> rule -> myth/ranger.",
 items: [
 { id: "meet", html: "Meet I/O devices" },
 { id: "sort", html: "Sort input / output / both" },
 { id: "lab", html: "Type + signal labs" },
 { id: "rule", html: "Name the I/O rule" },
 { id: "myth", html: "Real life + bust myths" },
 { id: "ranger", html: "Claim I/O Ranger" },
 ],
 correctIds: ["meet", "sort", "lab", "rule", "myth", "ranger"],
 onDone: () => mountTapContinue(overlay, {
 scene: "ioMastery",
 html: `<h3>Mixed case</h3>
 <p><strong>Call + print:</strong> Mic is input on a call; printer is output for paper. Same rule both times.</p>
 <p>Ready for the final checks?</p>`,
 onDone: () => mountMultiQuiz(overlay, {
 scene: "ioMastery",
 title: "Final mastery",
 doneTitle: "I/O Ranger ready",
 items: [
 {
 q: "Keyboard, mic, screen, and speaker teach the same idea because...",
 opts: [
 "They either send data in or send results out (some do both)",
 "They are all storage devices",
 "They are all CPUs",
 "Only speakers matter",
 ],
 ok: 0,
 },
 {
 q: "On a video call, your speaker is mainly...",
 opts: ["Output", "Input only", "A folder", "Storage"],
 ok: 0,
 },
 {
 q: "Which is NOT an I/O device?",
 opts: ["Birthday cake", "Keyboard", "Monitor", "Microphone"],
 ok: 0,
 },
 ],
 onDone: () => mountTapContinue(overlay, {
 scene: "ioMastery", badge: LAB_ASSET_PATHS.m2,
 html: `<h3>I/O Ranger!</h3>
 <p>You can sort input and output devices and explain the path. Press <strong>Next</strong> to claim the reward.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 }),
 }),
 });
}
