/**
 * Electrical Basics - Mission 2: Voltage & Current (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
  mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
  mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L2_META = {
  objective: "By the end of this mission, you'll be able to explain V pushes / I flows in your own words.",
  bdHook: "Bangladesh everyday: notice V pushes / I flows around you — then connect it to Voltage & Current.",
  predict: {
    q: "Before we start — what do you think matters most in Voltage & Current?",
    options: [
      "Guessing without checking",
      "Looking for a clear pattern or rule",
      "Skipping the practice steps",
    ],
    ok: 1,
  },

  kidTitle: "Voltage & Current",
  theme: "V pushes / I flows",
  emoji: "\ud83d\udd0b",
  rewardName: "Volt Scout",
  intro: "Voltage (V) is the push. Current (I) is the flow of charge in the loop.",
  everyday: ["Phone charger", "Car battery", "Flashlight cells"],
  subTitles: [
    "Meet V and I", "Push Dial Lab", "Sort V vs I", "Stronger Push Lab",
    "Push then Flow", "Name the V-I Rule", "Stretch: Power Uses", "Myth Bust",
    "Fluency Drill", "Volt Scout Mastery",
  ],
};

export function runL2Sub(subIndex, api) {
  const { registerTryAgain } = api;
  labState.reveal = false; labState.tokenProgress = 0; labState.masteryStep = 0;
  labState.placed = {}; labState.selectedId = null; labState.mythPhase = "claim";
  labState.heat = 0.2; labState.phase = "desk"; labState.mode = "phone";
  const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
  const fn = runners[subIndex] || runners[0];
  registerTryAgain(() => { api.overlay.innerHTML = ""; fn(api); });
  fn(api);
}

function s1({ overlay, setCoach, completeSub }) {
  setCoach("Hook: voltage pushes - current flows.");
  mountMotionChain(overlay, {
    title: "Meet V and I",
    beats: [
      { scene: "voltMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000,
        html: `${badgeHtml(LAB_ASSET_PATHS.m2, "volt")}<p><strong>Act 1:</strong> Drag battery (V) and watch flow arrows (I).</p>` },
      { scene: "voltMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200,
        html: `<p><strong>Act 2:</strong> More push (V) can mean stronger flow (I) in a simple loop.</p>` },
      { scene: "voltMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000,
        html: `<p><strong>Act 3:</strong> V is not the same as I - push vs flow.</p>` },
    ],
    onDone: () => mountQuiz(overlay, {
      scene: "voltMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
      q: "Voltage is best described as...",
      opts: ["The push that can drive current", "The light color only", "A wooden insulator", "The same word as current"],
      ok: 0, onDone: () => mountTapContinue(overlay, {
        scene: "voltMeet", badge: LAB_ASSET_PATHS.m2,
        html: `<h3>V and I online</h3><p>Next: push dial lab.</p>`,
        onDone: completeSub, advanceAfterDone: true,
      }),
    }),
  });
}

function s2({ overlay, setCoach, completeSub }) {
  setCoach("Raise voltage push until flow looks strong.");
  labState.heat = 0.2;
  mountHeatLab(overlay, {
    scene: "voltLab", title: "Push Dial Lab",
    html: `<p>Drag until push &gt;= 60%.</p>`,
    goalText: "Goal &gt;= 60%", doneLabel: "Push checked", threshold: 0.6, startHeat: 0.2,
    axis: "x", canvasAction: "stretch", sliderLabel: "Voltage push", badge: LAB_ASSET_PATHS.m2,
    onDone: completeSub,
  });
}

function s3({ overlay, setCoach, completeSub }) {
  setCoach("Sort voltage ideas, current ideas, both, or neither.");
  mountTapContinue(overlay, {
    scene: "voltSort",
    html: `<h3>Guide</h3><p><strong>Voltage:</strong> push, volts, battery strength.<br><strong>Current:</strong> flow, amps, charge moving.<br><strong>Both:</strong> closed loop with a working battery.<br><strong>Neither:</strong> snack, paint.</p>`,
    onDone: () => mountDragSort(overlay, {
      scene: "voltSort", title: "Sort V vs I",
      instructions: "Drag into Voltage / Current / Both / Neither.",
      successText: "V and I sorted!",
      chips: [
        { id: "push", text: "The electrical push", short: "Push", color: 0x38bdf8 },
        { id: "volts", text: "Measured in volts", short: "Volts", color: 0x60a5fa },
        { id: "flow", text: "Charge flowing in wire", short: "Flow", color: 0xfacc15 },
        { id: "amps", text: "Measured in amps", short: "Amps", color: 0xfde68a },
        { id: "bat", text: "Battery strength (V)", short: "Battery V", color: 0x0ea5e9 },
        { id: "move", text: "Electrons moving (I)", short: "Moving", color: 0xeab308 },
        { id: "loop", text: "Working closed loop", short: "Loop", color: 0x22c55e },
        { id: "snack", text: "Eat a snack", short: "Snack", color: 0xf97316 },
      ],
      zones: [
        { id: "volt", label: "Voltage (V)", accept: ["push", "volts", "bat"] },
        { id: "curr", label: "Current (I)", accept: ["flow", "amps", "move"] },
        { id: "both", label: "Needs both ideas", accept: ["loop"] },
        { id: "not", label: "Neither", accept: ["snack"] },
      ],
      onDone: completeSub,
    }),
  });
}

function s4({ overlay, setCoach, completeSub }) {
  setCoach("Push voltage higher.");
  labState.heat = 0.4;
  mountHeatLab(overlay, {
    scene: "voltLab", title: "Stronger Push Lab", html: `<p>Reach &gt;= 75%.</p>`,
    goalText: "Goal &gt;= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
    axis: "x", canvasAction: "stretch", sliderLabel: "Voltage push", badge: LAB_ASSET_PATHS.m2,
    onDone: completeSub,
  });
}

function s5({ overlay, setCoach, completeSub }) {
  setCoach("Order push then flow.");
  mountOrderSteps(overlay, {
    scene: "voltMeet", sceneArgs: { phase: "settle" }, title: "Push then flow",
    instructions: "Order the story.",
    items: [
      { id: "v", html: "Battery sets a voltage push" },
      { id: "path", html: "Closed path is ready" },
      { id: "i", html: "Current begins to flow" },
      { id: "load", html: "Bulb / device uses the flow" },
    ],
    correctIds: ["v", "path", "i", "load"],
    onDone: completeSub,
  });
}

function s6({ overlay, setCoach, completeSub }) {
  setCoach("Lock the V-I rule.");
  mountEquationBuild(overlay, {
    scene: "voltRule", title: "Name the V-I Rule", instructions: "Tap in order.",
    tokens: [
      { id: "a", html: "Voltage" }, { id: "b", html: "pushes" },
      { id: "c", html: "current" }, { id: "d", html: "flows" },
    ],
    correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
    onDone: () => mountTapContinue(overlay, {
      scene: "voltRule", badge: LAB_ASSET_PATHS.rule,
      html: `<h3>Rule locked</h3><p>Voltage pushes - current flows.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}

function s7({ overlay, setCoach, completeSub }) {
  setCoach("Phone, car, torch, charger, lab supply.");
  mountTapContinue(overlay, {
    scene: "voltStretch", html: `<h3>Power uses</h3><p>Tap each mode - same V push / I flow idea.</p>`,
    onDone: () => mountQuiz(overlay, {
      scene: "voltStretch", title: "Transfer",
      q: "A weak old battery often means...",
      opts: ["Less voltage push - dimmer or no run", "More current forever with no battery", "Wires turn into food", "Voltage equals snack"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s8({ overlay, setCoach, completeSub }) {
  setCoach("Bust V / I myths.");
  mountMythCards(overlay, {
    scene: "voltMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
    myths: [
      { claim: "Voltage and current are the same thing", truth: "Voltage is push; current is flow", sceneMyth: 0 },
      { claim: "Current is stored inside the wire like water in a bottle", truth: "Current is charge moving when a circuit is closed", sceneMyth: 1 },
      { claim: "Higher volts always means infinite current with no path", truth: "You still need a closed path; load and resistance matter", sceneMyth: 2 },
      { claim: "Amps measure voltage", truth: "Amps measure current; volts measure voltage", sceneMyth: 3 },
      { claim: "A dead battery still has full voltage push", truth: "A dead/flat battery cannot push well", sceneMyth: 4 },
    ],
    onDone: completeSub,
  });
}

function s9({ overlay, setCoach, completeSub }) {
  setCoach("Quick V-I fluency.");
  mountSpeedDrill(overlay, {
    scene: "voltDrill", title: "Fluency Drill", passScene: "voltMastery",
    items: [
      { q: "Voltage is the...", opts: ["Push", "Snack"], ok: 0, prompt: "V" },
      { q: "Current is the...", opts: ["Flow", "Paint color"], ok: 0, prompt: "I" },
      { q: "Volts measure...", opts: ["Voltage", "Only amps"], ok: 0, prompt: "Volts" },
      { q: "Amps measure...", opts: ["Current", "Only volts"], ok: 0, prompt: "Amps" },
      { q: "V and I are identical?", opts: ["No", "Yes"], ok: 0, prompt: "Same?" },
      { q: "Need a path for useful flow?", opts: ["Yes", "Never"], ok: 0, prompt: "Path" },
    ],
    onDone: completeSub,
  });
}

function s10({ overlay, setCoach, completeSub }) {
  setCoach("Mastery - Volt Scout.");
  mountOrderSteps(overlay, {
    scene: "voltMastery", title: "Volt Scout Mastery", instructions: "Order your journey.",
    items: [
      { id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" },
      { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "scout", html: "Scout" },
    ],
    correctIds: ["meet", "sort", "lab", "rule", "myth", "scout"],
    onDone: () => mountTapContinue(overlay, {
      scene: "voltMastery", badge: LAB_ASSET_PATHS.m2,
      html: `<h3>\ud83d\udd0b Volt Scout!</h3><p>You can tell push (V) from flow (I).</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}
