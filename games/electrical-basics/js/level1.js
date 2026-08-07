/**
 * Electrical Basics - Mission 1: Circuit Loop (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
  mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
  mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L1_META = {
  objective: "By the end of this mission, you'll be able to explain closed path lights the bulb in your own words.",
  bdHook: "Bangladesh everyday: notice closed path lights the bulb around you — then connect it to Circuit Loop.",
  predict: {
    q: "Before we start — what do you think matters most in Circuit Loop?",
    options: [
      "Guessing without checking",
      "Looking for a clear pattern or rule",
      "Skipping the practice steps",
    ],
    ok: 1,
  },

  kidTitle: "Circuit Loop",
  theme: "closed path lights the bulb",
  emoji: "\ud83d\udd0c",
  rewardName: "Loop Learner",
  intro: "Current needs a closed loop - battery, wires, switch, and bulb connected.",
  everyday: ["Torch switch", "Room light", "School lab kit"],
  subTitles: [
    "Meet the Loop", "Close the Path Lab", "Sort Loop Parts", "Brighter Loop Lab",
    "Why the Bulb Lights", "Name the Loop Rule", "Stretch: Places", "Myth Bust",
    "Fluency Drill", "Loop Learner Mastery",
  ],
};

export function runL1Sub(subIndex, api) {
  const { registerTryAgain } = api;
  labState.reveal = false; labState.tokenProgress = 0; labState.masteryStep = 0;
  labState.placed = {}; labState.selectedId = null; labState.mythPhase = "claim";
  labState.heat = 0.25; labState.phase = "desk"; labState.mode = "home";
  const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
  const fn = runners[subIndex] || runners[0];
  registerTryAgain(() => { api.overlay.innerHTML = ""; fn(api); });
  fn(api);
}

function s1({ overlay, setCoach, completeSub }) {
  setCoach("Hook: battery, wire, switch, bulb - one closed path.");
  mountMotionChain(overlay, {
    title: "Meet the Loop",
    beats: [
      { scene: "circuitMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000,
        html: `${badgeHtml(LAB_ASSET_PATHS.m1, "loop")}<p><strong>Act 1:</strong> Drag battery, switch, bulb, and wire.</p>` },
      { scene: "circuitMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200,
        html: `<p><strong>Act 2:</strong> Close the path - current can travel the loop.</p>` },
      { scene: "circuitMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000,
        html: `<p><strong>Act 3:</strong> Open gap = no light. Closed loop = bulb glows.</p>` },
    ],
    onDone: () => mountQuiz(overlay, {
      scene: "circuitMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
      q: "What must be true for the bulb to light?",
      opts: ["A closed loop from battery around and back", "Only a battery sitting alone", "Only an open wire gap", "A switch that stays open forever"],
      ok: 0, onDone: () => mountTapContinue(overlay, {
        scene: "circuitMeet", badge: LAB_ASSET_PATHS.m1,
        html: `<h3>Loop ready</h3><p>Next: close the path lab.</p>`,
        onDone: completeSub, advanceAfterDone: true,
      }),
    }),
  });
}

function s2({ overlay, setCoach, completeSub }) {
  setCoach("Close the path until brightness is high enough.");
  labState.heat = 0.25;
  mountHeatLab(overlay, {
    scene: "circuitLab", title: "Close the Path Lab",
    html: `<p>Drag until loop completeness &gt;= 60%.</p>`,
    goalText: "Goal &gt;= 60%", doneLabel: "Path checked", threshold: 0.6, startHeat: 0.25,
    axis: "x", canvasAction: "stretch", sliderLabel: "Loop close", badge: LAB_ASSET_PATHS.m1,
    onDone: completeSub,
  });
}

function s3({ overlay, setCoach, completeSub }) {
  setCoach("Sort closed-loop parts, open/gap, or not a circuit.");
  mountTapContinue(overlay, {
    scene: "circuitSort",
    html: `<h3>Guide</h3><p><strong>Closed:</strong> battery, wire, closed switch, bulb.<br><strong>Open/gap:</strong> open switch, broken wire.<br><strong>Not:</strong> rubber eraser, wooden stick.</p>`,
    onDone: () => mountDragSort(overlay, {
      scene: "circuitSort", title: "Sort loop parts",
      instructions: "Drag into Closed loop / Open gap / Not a circuit.",
      successText: "Loop parts sorted!",
      chips: [
        { id: "bat", text: "Battery in the path", short: "Battery", color: 0xfacc15 },
        { id: "wire", text: "Connected wire", short: "Wire", color: 0x94a3b8 },
        { id: "swon", text: "Switch closed (ON)", short: "Switch ON", color: 0x22c55e },
        { id: "bulb", text: "Bulb in the loop", short: "Bulb", color: 0xfde68a },
        { id: "swoff", text: "Switch open (OFF)", short: "Switch OFF", color: 0xf97316 },
        { id: "break", text: "Broken wire gap", short: "Broken", color: 0xef4444 },
        { id: "erase", text: "Rubber eraser", short: "Eraser", color: 0xa78bfa },
        { id: "wood", text: "Wooden stick", short: "Wood", color: 0x78716c },
      ],
      zones: [
        { id: "closed", label: "Closed loop part", accept: ["bat", "wire", "swon", "bulb"] },
        { id: "open", label: "Open / gap", accept: ["swoff", "break"] },
        { id: "not", label: "Not a circuit", accept: ["erase", "wood"] },
      ],
      onDone: completeSub,
    }),
  });
}

function s4({ overlay, setCoach, completeSub }) {
  setCoach("Push the loop closer - brighter bulb.");
  labState.heat = 0.4;
  mountHeatLab(overlay, {
    scene: "circuitLab", title: "Brighter Loop Lab", html: `<p>Reach &gt;= 75% closed.</p>`,
    goalText: "Goal &gt;= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
    axis: "x", canvasAction: "stretch", sliderLabel: "Loop close", badge: LAB_ASSET_PATHS.m1,
    onDone: completeSub,
  });
}

function s5({ overlay, setCoach, completeSub }) {
  setCoach("Order why the bulb lights.");
  mountOrderSteps(overlay, {
    scene: "circuitMeet", sceneArgs: { phase: "settle" }, title: "Why the bulb lights",
    instructions: "Order the story.",
    items: [
      { id: "bat", html: "Battery provides a push" },
      { id: "path", html: "Wires make a closed path" },
      { id: "sw", html: "Closed switch lets current through" },
      { id: "glow", html: "Bulb lights when current flows" },
    ],
    correctIds: ["bat", "path", "sw", "glow"],
    onDone: () => mountQuiz(overlay, {
      scene: "circuitMeet", title: "Check",
      q: "An open switch in the loop means...",
      opts: ["Gap - current stops, bulb dark", "Extra brightness always", "Battery disappears", "Wire becomes wood"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s6({ overlay, setCoach, completeSub }) {
  setCoach("Lock the loop rule.");
  mountEquationBuild(overlay, {
    scene: "circuitRule", title: "Name the Loop Rule", instructions: "Tap in order.",
    tokens: [
      { id: "a", html: "Closed" }, { id: "b", html: "loop" },
      { id: "c", html: "=" }, { id: "d", html: "current flows" },
    ],
    correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
    onDone: () => mountTapContinue(overlay, {
      scene: "circuitRule", badge: LAB_ASSET_PATHS.rule,
      html: `<h3>Rule locked</h3><p>Closed loop = current flows (bulb can light).</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}

function s7({ overlay, setCoach, completeSub }) {
  setCoach("Home torch, school kit, street lamp, BD shop, lab.");
  mountTapContinue(overlay, {
    scene: "circuitStretch", html: `<h3>Places</h3><p>Tap each mode - same closed-loop idea.</p>`,
    onDone: () => mountQuiz(overlay, {
      scene: "circuitStretch", title: "Transfer",
      q: "A torch that will not light often has...",
      opts: ["An open path (switch off / dead battery / gap)", "Too many closed loops only", "No need for a battery ever", "Only wooden wires"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s8({ overlay, setCoach, completeSub }) {
  setCoach("Bust circuit myths.");
  mountMythCards(overlay, {
    scene: "circuitMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
    myths: [
      { claim: "Current leaves the battery and stops at the bulb", truth: "Current needs a full closed loop back to the battery", sceneMyth: 0 },
      { claim: "An open switch still lets current flow", truth: "Open switch = gap; current stops", sceneMyth: 1 },
      { claim: "Any random wire scrap always makes a circuit", truth: "Parts must connect into one closed path", sceneMyth: 2 },
      { claim: "A broken wire still lights the bulb", truth: "A gap breaks the loop - no light", sceneMyth: 3 },
      { claim: "Only experts can build a simple loop", truth: "Kids can build battery-wire-bulb loops with care", sceneMyth: 4 },
    ],
    onDone: completeSub,
  });
}

function s9({ overlay, setCoach, completeSub }) {
  setCoach("Quick loop fluency.");
  mountSpeedDrill(overlay, {
    scene: "circuitDrill", title: "Fluency Drill", passScene: "circuitMastery",
    items: [
      { q: "Closed loop needed for current?", opts: ["Yes", "No"], ok: 0, prompt: "Loop?" },
      { q: "Open switch means...", opts: ["Gap / no flow", "Always brighter"], ok: 0, prompt: "Switch" },
      { q: "Battery alone (no wires) lights bulb?", opts: ["No", "Yes"], ok: 0, prompt: "Alone" },
      { q: "Broken wire is a...", opts: ["Gap", "Closed path"], ok: 0, prompt: "Break" },
      { q: "Bulb needs to be in the path?", opts: ["Yes", "Never"], ok: 0, prompt: "Bulb" },
      { q: "Eraser is a circuit part?", opts: ["No", "Yes"], ok: 0, prompt: "Eraser" },
    ],
    onDone: completeSub,
  });
}

function s10({ overlay, setCoach, completeSub }) {
  setCoach("Mastery - Loop Learner.");
  mountOrderSteps(overlay, {
    scene: "circuitMastery", title: "Loop Learner Mastery", instructions: "Order your journey.",
    items: [
      { id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" },
      { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "loop", html: "Loop" },
    ],
    correctIds: ["meet", "sort", "lab", "rule", "myth", "loop"],
    onDone: () => mountTapContinue(overlay, {
      scene: "circuitMastery", badge: LAB_ASSET_PATHS.m1,
      html: `<h3>\ud83d\udd0c Loop Learner!</h3><p>You can explain why a closed loop lights a bulb.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}
