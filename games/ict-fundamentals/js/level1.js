/**
 * ICT - Mission 1: Computer Bits (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
  mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
  mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L1_META = {
  objective: "By the end of this mission, you'll be able to explain CPU / RAM / storage in your own words.",
  bdHook: "Bangladesh everyday: notice CPU / RAM / storage around you — then connect it to Computer Bits.",
  predict: {
    q: "Before we start — what do you think matters most in Computer Bits?",
    options: [
      "Guessing without checking",
      "Looking for a clear pattern or rule",
      "Skipping the practice steps",
    ],
    ok: 1,
  },

  kidTitle: "Computer Bits",
  theme: "CPU / RAM / storage",
  emoji: "\ud83d\udda5",
  rewardName: "Bit Scout",
  intro: "CPU thinks, RAM holds open work, storage keeps files after power off.",
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
  labState.heat = 0.3; labState.phase = "desk"; labState.mode = "phone";
  const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
  const fn = runners[subIndex] || runners[0];
  registerTryAgain(() => { api.overlay.innerHTML = ""; fn(api); });
  fn(api);
}

function s1({ overlay, setCoach, completeSub }) {
  setCoach("Hook: brain, desk, cupboard - CPU, RAM, storage.");
  mountMotionChain(overlay, {
    title: "Meet the Inside Team",
    beats: [
      { scene: "bitsMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000,
        html: `${badgeHtml(LAB_ASSET_PATHS.m1, "bits")}<p><strong>Act 1:</strong> Drag CPU, RAM, and storage.</p>` },
      { scene: "bitsMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200,
        html: `<p><strong>Act 2:</strong> Watch the links - open work uses CPU + RAM.</p>` },
      { scene: "bitsMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000,
        html: `<p><strong>Act 3:</strong> Storage keeps files when power is off.</p>` },
    ],
    onDone: () => mountQuiz(overlay, {
      scene: "bitsMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
      q: "Which keeps a photo after you shut down?",
      opts: ["Storage (SSD/disk)", "Only RAM", "Only the screen", "The keyboard"],
      ok: 0, onDone: () => mountTapContinue(overlay, {
        scene: "bitsMeet", badge: LAB_ASSET_PATHS.m1,
        html: `<h3>Inside team ready</h3><p>Next: busy PC lab.</p>`,
        onDone: completeSub, advanceAfterDone: true,
      }),
    }),
  });
}

function s2({ overlay, setCoach, completeSub }) {
  setCoach("More CPU work fills RAM with open tasks.");
  labState.heat = 0.25;
  mountHeatLab(overlay, {
    scene: "bitsLab", title: "Busy PC Lab",
    html: `<p>Drag until RAM fill >= 60%.</p>`,
    goalText: "Goal >= 60%", doneLabel: "Busy checked", threshold: 0.6, startHeat: 0.25,
    axis: "x", canvasAction: "stretch", sliderLabel: "CPU work", badge: LAB_ASSET_PATHS.m1,
    onDone: completeSub,
  });
}

function s3({ overlay, setCoach, completeSub }) {
  setCoach("Sort jobs into CPU, RAM, storage, or not.");
  mountTapContinue(overlay, {
    scene: "bitsSort",
    html: `<h3>Jobs</h3><p><strong>CPU:</strong> calculate, run code.<br><strong>RAM:</strong> open app, scratch pad.<br><strong>Storage:</strong> save file, disk.<br><strong>Not:</strong> snack, paint.</p>`,
    onDone: () => mountDragSort(overlay, {
      scene: "bitsSort", title: "Sort the jobs",
      instructions: "Drag into CPU / RAM / Storage / Not.",
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
      onDone: completeSub,
    }),
  });
}

function s4({ overlay, setCoach, completeSub }) {
  setCoach("Push RAM fill higher.");
  labState.heat = 0.4;
  mountHeatLab(overlay, {
    scene: "bitsLab", title: "RAM Fill Lab", html: `<p>Reach >= 75%.</p>`,
    goalText: "Goal >= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
    axis: "x", canvasAction: "stretch", sliderLabel: "CPU work", badge: LAB_ASSET_PATHS.m1,
    onDone: completeSub,
  });
}

function s5({ overlay, setCoach, completeSub }) {
  setCoach("Order why we need three parts.");
  mountOrderSteps(overlay, {
    scene: "bitsMeet", sceneArgs: { phase: "settle" }, title: "Why three parts",
    instructions: "Order the story.",
    items: [
      { id: "think", html: "CPU runs instructions" },
      { id: "hold", html: "RAM holds open work" },
      { id: "keep", html: "Storage keeps files" },
      { id: "off", html: "Power off - RAM clears, storage stays" },
    ],
    correctIds: ["think", "hold", "keep", "off"],
    onDone: () => mountQuiz(overlay, {
      scene: "bitsMeet", title: "Check",
      q: "After shutdown, open apps in RAM...",
      opts: ["Are cleared (need reopen)", "Stay forever in RAM", "Become the CPU", "Delete storage"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s6({ overlay, setCoach, completeSub }) {
  setCoach("Lock the bits rule.");
  mountEquationBuild(overlay, {
    scene: "bitsRule", title: "Name the Bits Rule", instructions: "Tap in order.",
    tokens: [
      { id: "a", html: "CPU" }, { id: "b", html: "RAM" },
      { id: "c", html: "Storage" }, { id: "d", html: "Team" },
    ],
    correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
    onDone: () => mountTapContinue(overlay, {
      scene: "bitsRule", badge: LAB_ASSET_PATHS.rule,
      html: `<h3>Rule locked</h3><p>CPU / RAM / Storage work as a team.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}

function s7({ overlay, setCoach, completeSub }) {
  setCoach("Phone, laptop, lab, game, class.");
  mountTapContinue(overlay, {
    scene: "bitsStretch", html: `<h3>Devices</h3><p>Tap each mode - same inside team.</p>`,
    onDone: () => mountQuiz(overlay, {
      scene: "bitsStretch", title: "Transfer",
      q: "A phone still has...",
      opts: ["CPU + RAM + storage", "Only a screen", "No memory ever", "Only a keyboard"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s8({ overlay, setCoach, completeSub }) {
  setCoach("Bust computer myths.");
  mountMythCards(overlay, {
    scene: "bitsMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
    myths: [
      { claim: "RAM and storage are the same", truth: "RAM is temporary-fast; storage keeps files", sceneMyth: 0 },
      { claim: "CPU is only for gaming", truth: "CPU runs all instructions", sceneMyth: 1 },
      { claim: "More storage always opens apps faster", truth: "Open speed leans on CPU + RAM", sceneMyth: 2 },
      { claim: "Phones have no CPU", truth: "Phones have a CPU/SoC", sceneMyth: 3 },
      { claim: "Closing the lid deletes storage", truth: "Storage files stay", sceneMyth: 4 },
    ],
    onDone: completeSub,
  });
}

function s9({ overlay, setCoach, completeSub }) {
  setCoach("Quick bits fluency.");
  mountSpeedDrill(overlay, {
    scene: "bitsDrill", title: "Fluency Drill", passScene: "bitsMastery",
    items: [
      { q: "CPU main job?", opts: ["Run instructions", "Store photos forever"], ok: 0, prompt: "CPU" },
      { q: "RAM after power off?", opts: ["Clears", "Keeps forever"], ok: 0, prompt: "RAM" },
      { q: "Where saved homework lives?", opts: ["Storage", "Only RAM"], ok: 0, prompt: "Save" },
      { q: "SSD is a kind of...", opts: ["Storage", "Keyboard"], ok: 0, prompt: "SSD" },
      { q: "Open apps sit mainly in...", opts: ["RAM", "Printer"], ok: 0, prompt: "Open" },
      { q: "Snack is a PC part?", opts: ["No", "Yes"], ok: 0, prompt: "Snack" },
    ],
    onDone: completeSub,
  });
}

function s10({ overlay, setCoach, completeSub }) {
  setCoach("Mastery - Bit Scout.");
  mountOrderSteps(overlay, {
    scene: "bitsMastery", title: "Bit Scout Mastery", instructions: "Order your journey.",
    items: [
      { id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" },
      { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "scout", html: "Scout" },
    ],
    correctIds: ["meet", "sort", "lab", "rule", "myth", "scout"],
    onDone: () => mountTapContinue(overlay, {
      scene: "bitsMastery", badge: LAB_ASSET_PATHS.m1,
      html: `<h3>Bit Scout!</h3><p>You can explain CPU, RAM, and storage.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}
