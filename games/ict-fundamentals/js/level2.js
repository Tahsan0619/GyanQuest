/**
 * ICT - Mission 2: Input & Output (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
  mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
  mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L2_META = {
  objective: "By the end of this mission, you'll be able to explain devices in and out in your own words.",
  bdHook: "Bangladesh everyday: notice devices in and out around you — then connect it to Input & Output.",
  predict: {
    q: "Before we start — what do you think matters most in Input & Output?",
    options: [
      "Guessing without checking",
      "Looking for a clear pattern or rule",
      "Skipping the practice steps",
    ],
    ok: 1,
  },

  kidTitle: "Input & Output",
  theme: "devices in and out",
  emoji: "\u2328",
  rewardName: "I/O Ranger",
  intro: "Input sends data in. Output shows or plays results out. Some devices do both.",
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
  const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
  const fn = runners[subIndex] || runners[0];
  registerTryAgain(() => { api.overlay.innerHTML = ""; fn(api); });
  fn(api);
}

function s1({ overlay, setCoach, completeSub }) {
  setCoach("Hook: keyboard in / screen out.");
  mountMotionChain(overlay, {
    title: "Meet I/O Devices",
    beats: [
      { scene: "ioMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000,
        html: `${badgeHtml(LAB_ASSET_PATHS.m2, "io")}<p><strong>Act 1:</strong> Drag keyboard, screen, mic, speaker.</p>` },
      { scene: "ioMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200,
        html: `<p><strong>Act 2:</strong> Labels - IN vs OUT.</p>` },
      { scene: "ioMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000,
        html: `<p><strong>Act 3:</strong> You <-> devices <-> computer.</p>` },
    ],
    onDone: () => mountQuiz(overlay, {
      scene: "ioMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
      q: "A microphone is mainly...",
      opts: ["Input", "Output only", "Storage", "CPU"],
      ok: 0, onDone: () => mountTapContinue(overlay, {
        scene: "ioMeet", badge: LAB_ASSET_PATHS.m2,
        html: `<h3>I/O online</h3><p>Next: type to the screen.</p>`,
        onDone: completeSub, advanceAfterDone: true,
      }),
    }),
  });
}

function s2({ overlay, setCoach, completeSub }) {
  setCoach("Send input until the screen shows enough letters.");
  labState.heat = 0.2; labState.typed = 0;
  mountHeatLab(overlay, {
    scene: "ioLab", title: "Type -> Screen Lab",
    html: `<p>Drag or tap keyboard until signal >= 60%.</p>`,
    goalText: "Goal >= 60%", doneLabel: "Typed!", threshold: 0.6, startHeat: 0.2,
    axis: "x", canvasAction: "stretch", sliderLabel: "Signal", badge: LAB_ASSET_PATHS.m2,
    onDone: completeSub,
  });
}

function s3({ overlay, setCoach, completeSub }) {
  setCoach("Sort devices: input, output, both, or not.");
  mountTapContinue(overlay, {
    scene: "ioSort",
    html: `<h3>Guide</h3><p><strong>Input:</strong> keyboard, mouse, mic.<br><strong>Output:</strong> screen, speaker, printer.<br><strong>Both:</strong> touchscreen.<br><strong>Not:</strong> cake.</p>`,
    onDone: () => mountDragSort(overlay, {
      scene: "ioSort", title: "Sort I/O", instructions: "Drag into the right bin.",
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
      onDone: completeSub,
    }),
  });
}

function s4({ overlay, setCoach, completeSub }) {
  setCoach("Push the signal higher.");
  labState.heat = 0.4;
  mountHeatLab(overlay, {
    scene: "ioLab", title: "Signal Lab", html: `<p>Reach >= 75%.</p>`,
    goalText: "Goal >= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
    axis: "x", canvasAction: "stretch", sliderLabel: "Signal", badge: LAB_ASSET_PATHS.m2,
    onDone: completeSub,
  });
}

function s5({ overlay, setCoach, completeSub }) {
  setCoach("Order a keypress path.");
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
    onDone: completeSub,
  });
}

function s6({ overlay, setCoach, completeSub }) {
  setCoach("Lock the I/O rule.");
  mountEquationBuild(overlay, {
    scene: "ioRule", title: "Name the I/O Rule", instructions: "Tap in order.",
    tokens: [
      { id: "a", html: "Input" }, { id: "b", html: "->" },
      { id: "c", html: "Process" }, { id: "d", html: "-> Output" },
    ],
    correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
    onDone: () => mountTapContinue(overlay, {
      scene: "ioRule", badge: LAB_ASSET_PATHS.rule,
      html: `<h3>Rule locked</h3><p>Input -> Process -> Output.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}

function s7({ overlay, setCoach, completeSub }) {
  setCoach("Class, game, call, print, music.");
  mountTapContinue(overlay, {
    scene: "ioStretch", html: `<h3>Real life</h3><p>Tap each mode.</p>`,
    onDone: () => mountQuiz(overlay, {
      scene: "ioStretch", title: "Transfer",
      q: "On a video call, your mic is...",
      opts: ["Input", "Only output", "Storage", "A folder"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s8({ overlay, setCoach, completeSub }) {
  setCoach("Bust I/O myths.");
  mountMythCards(overlay, {
    scene: "ioMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
    myths: [
      { claim: "A monitor is an input device", truth: "A plain monitor is output", sceneMyth: 0 },
      { claim: "Speakers take typing in", truth: "Speakers output sound", sceneMyth: 1 },
      { claim: "Microphone is output", truth: "Mic is input", sceneMyth: 2 },
      { claim: "Printer is input", truth: "Printer outputs on paper", sceneMyth: 3 },
      { claim: "Touchscreen is only output", truth: "Touchscreen is both", sceneMyth: 4 },
    ],
    onDone: completeSub,
  });
}

function s9({ overlay, setCoach, completeSub }) {
  setCoach("Quick I/O fluency.");
  mountSpeedDrill(overlay, {
    scene: "ioDrill", title: "Fluency Drill", passScene: "ioMastery",
    items: [
      { q: "Keyboard is...", opts: ["Input", "Output"], ok: 0, prompt: "KB" },
      { q: "Speaker is...", opts: ["Output", "Input"], ok: 0, prompt: "SPK" },
      { q: "Mic is...", opts: ["Input", "Output"], ok: 0, prompt: "Mic" },
      { q: "Printer is...", opts: ["Output", "Input"], ok: 0, prompt: "Print" },
      { q: "Touchscreen can be...", opts: ["Both", "Neither"], ok: 0, prompt: "Touch" },
      { q: "Cake is an I/O device?", opts: ["No", "Yes"], ok: 0, prompt: "Cake" },
    ],
    onDone: completeSub,
  });
}

function s10({ overlay, setCoach, completeSub }) {
  setCoach("Mastery - I/O Ranger.");
  mountOrderSteps(overlay, {
    scene: "ioMastery", title: "I/O Ranger Mastery", instructions: "Order your journey.",
    items: [
      { id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" },
      { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "ranger", html: "Ranger" },
    ],
    correctIds: ["meet", "sort", "lab", "rule", "myth", "ranger"],
    onDone: () => mountTapContinue(overlay, {
      scene: "ioMastery", badge: LAB_ASSET_PATHS.m2,
      html: `<h3>I/O Ranger!</h3><p>You can sort input and output devices.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}
