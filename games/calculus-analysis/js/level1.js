/**
 * Calculus & Analysis - Mission 1: Slope Stories (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
  mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
  mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L1_META = {
  objective: "By the end of this mission, you'll be able to explain steep = faster change in your own words.",
  bdHook: "Bangladesh everyday: notice steep = faster change around you — then connect it to Slope Stories.",
  predict: {
    q: "Before we start — what do you think matters most in Slope Stories?",
    options: [
      "Guessing without checking",
      "Looking for a clear pattern or rule",
      "Skipping the practice steps",
    ],
    ok: 1,
  },

  kidTitle: "Slope Stories",
  theme: "steep = faster change",
  emoji: "\u26f7\ufe0f",
  rewardName: "Slope Scout",
  intro: "Steep means fast change - slope tells the rate.",
  everyday: ["Hill walk", "Graph in class", "Speed on a ramp"],
  subTitles: [
    "Meet Slope Stories",
    "Slope Clarity Lab",
    "Sort: Slope / Not",
    "Steeper Lab",
    "Why Slope Means Rate",
    "Name the Slope Rule",
    "Stretch: Hills & Graphs",
    "Myth Bust",
    "Fluency Drill",
    "Slope Scout Mastery",
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
  setCoach("Hook: steep means faster change.");
  mountMotionChain(overlay, {
    title: "Meet Slope Stories",
    beats: [
      { scene: "slopeMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000,
        html: `${badgeHtml(LAB_ASSET_PATHS.m1, "badge")}<p><strong>Act 1:</strong> See gentle, medium, and steep lines.</p>` },
      { scene: "slopeMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200,
        html: `<p><strong>Act 2:</strong> Steeper line = faster change (rate).</p>` },
      { scene: "slopeMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000,
        html: `<p><strong>Act 3:</strong> Slope tells the rate - rise over run.</p>` },
    ],
    onDone: () => mountQuiz(overlay, {
      scene: "slopeMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
      q: "A steeper line usually means...",
      opts: ["Faster change (higher rate)", "No change ever", "Only a favorite color", "A random song"],
      ok: 0, onDone: () => mountTapContinue(overlay, {
        scene: "slopeMeet", badge: LAB_ASSET_PATHS.m1,
        html: `<h3>Slope ready</h3><p>Next: slope clarity lab.</p>`,
        onDone: completeSub, advanceAfterDone: true,
      }),
    }),
  });
}

function s2({ overlay, setCoach, completeSub }) {
  setCoach("Dial until slope idea is clear.");
  labState.heat = 0.25;
  mountHeatLab(overlay, {
    scene: "slopeLab", title: "Slope Clarity Lab",
    html: `<p>Drag until slope/rate idea is clear (&gt;= 60%).</p>`,
    goalText: "Goal &gt;= 60%", doneLabel: "Slope clearer", threshold: 0.6, startHeat: 0.25,
    axis: "x", canvasAction: "stretch", sliderLabel: "Slope", badge: LAB_ASSET_PATHS.m1,
    onDone: completeSub,
  });
}

function s3({ overlay, setCoach, completeSub }) {
  setCoach("Sort slope ideas vs not-slope.");
  mountTapContinue(overlay, {
    scene: "slopeSort",
    html: `<h3>Slope or not?</h3><p><strong>Slope:</strong> steep, gentle, flat, rate, rise/run, graph.<br><strong>Not:</strong> color, song.</p>`,
    onDone: () => mountDragSort(overlay, {
      scene: "slopeSort", title: "Sort: Slope / Not",
      instructions: "Drag chips into the matching bin.",
      successText: "Slope sorted!",
      chips: [
        { id: "steep", text: "Steep hill = fast change", short: "Steep", color: 0xc4b5fd },
        { id: "gentle", text: "Gentle slope = slow", short: "Gentle", color: 0xa78bfa },
        { id: "flat", text: "Flat = no change", short: "Flat", color: 0x8b5cf6 },
        { id: "rate", text: "Slope = rate", short: "Rate", color: 0xddd6fe },
        { id: "rise", text: "Rise over run", short: "Rise/run", color: 0xfbbf24 },
        { id: "graph", text: "Line on graph", short: "Graph", color: 0x818cf8 },
        { id: "color", text: "Favorite color", short: "Color", color: 0x64748b },
        { id: "song", text: "Random song", short: "Song", color: 0x78716c },
      ],
      zones: [
        { id: "slope", label: "Slope idea", accept: ["steep", "gentle", "flat", "rate", "rise", "graph"] },
        { id: "not", label: "Not slope", accept: ["color", "song"] },
      ],
      onDone: completeSub,
    }),
  });
}

function s4({ overlay, setCoach, completeSub }) {
  setCoach("Push slope clarity higher.");
  labState.heat = 0.4;
  mountHeatLab(overlay, {
    scene: "slopeLab", title: "Steeper Lab", html: `<p>Reach &gt;= 75% - steep vs flat looks clear.</p>`,
    goalText: "Goal &gt;= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
    axis: "x", canvasAction: "stretch", sliderLabel: "Slope", badge: LAB_ASSET_PATHS.m1,
    onDone: completeSub,
  });
}

function s5({ overlay, setCoach, completeSub }) {
  setCoach("Order why slope means rate.");
  mountOrderSteps(overlay, {
    scene: "slopeMeet", sceneArgs: { phase: "settle" }, title: "Why Slope Means Rate",
    instructions: "Order the story.",
    items: [{ id: "look", html: "Look at the line" }, { id: "rise", html: "Check rise over run" }, { id: "rate", html: "Name the rate" }, { id: "steep", html: "Steeper = faster change" }],
    correctIds: ["look", "rise", "rate", "steep"],
    onDone: () => mountQuiz(overlay, {
      scene: "slopeMeet", title: "Check",
      q: "A flat line most nearly means...",
      opts: ["Little or no change", "Fastest change always", "A song title", "Only color"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s6({ overlay, setCoach, completeSub }) {
  setCoach("Lock the slope rule.");
  mountEquationBuild(overlay, {
    scene: "slopeRule", title: "Name the Slope Rule", instructions: "Tap in order.",
    tokens: [{ id: "a", html: "Slope" }, { id: "b", html: "=" }, { id: "c", html: "rate" }, { id: "d", html: "of change" }],
    correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
    onDone: () => mountTapContinue(overlay, {
      scene: "slopeRule", badge: LAB_ASSET_PATHS.rule,
      html: `<h3>Rule locked</h3><p>Slope = rate of change.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}

function s7({ overlay, setCoach, completeSub }) {
  setCoach("Hills and graphs - same slope idea.");
  mountTapContinue(overlay, {
    scene: "slopeStretch",
    html: `<h3>Hills and graphs</h3><p>Tap contexts - walking a hill and reading a graph share slope.</p>`,
    onDone: () => mountQuiz(overlay, {
      scene: "slopeStretch", title: "Transfer",
      q: "A steep ramp for a cart suggests...",
      opts: ["Faster height change per step", "Zero change forever", "A favorite song", "No rate idea"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s8({ overlay, setCoach, completeSub }) {
  setCoach("Bust slope myths.");
  mountMythCards(overlay, {
    scene: "slopeMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
    myths: [
      { claim: "Slope only means a hill outdoors", truth: "Slope also means rate of change on a graph", sceneMyth: 0 },
      { claim: "Flat lines change the fastest", truth: "Flat means little or no change", sceneMyth: 1 },
      { claim: "Steep always means slow", truth: "Steep usually means faster change", sceneMyth: 2 },
      { claim: "Rise over run is useless", truth: "Rise/run is the kid-friendly slope recipe", sceneMyth: 3 },
      { claim: "Songs measure slope", truth: "Graphs and rates measure slope - not songs", sceneMyth: 4 },
    ],
    onDone: completeSub,
  });
}

function s9({ overlay, setCoach, completeSub }) {
  setCoach("Quick slope fluency.");
  mountSpeedDrill(overlay, {
    scene: "slopeDrill", title: "Fluency Drill", passScene: "slopeMastery",
    items: [
      { q: "Steep => faster change?", opts: ["Yes", "No"], ok: 0, prompt: "Steep" },
      { q: "Flat => no/little change?", opts: ["Yes", "No"], ok: 0, prompt: "Flat" },
      { q: "Slope is a rate?", opts: ["Yes", "No"], ok: 0, prompt: "Rate" },
      { q: "Song measures slope?", opts: ["No", "Yes"], ok: 0, prompt: "Song" },
      { q: "Rise over run helps?", opts: ["Yes", "No"], ok: 0, prompt: "Rise" },
      { q: "Gentle slope is slow change?", opts: ["Yes", "No"], ok: 0, prompt: "Gentle" },
    ],
    onDone: completeSub,
  });
}

function s10({ overlay, setCoach, completeSub }) {
  setCoach("Mastery - Slope Scout.");
  mountOrderSteps(overlay, {
    scene: "slopeMastery", title: "Slope Scout Mastery", instructions: "Order your journey.",
    items: [{ id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" }, { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "win", html: "Win" }],
    correctIds: ["meet", "sort", "lab", "rule", "myth", "win"],
    onDone: () => mountTapContinue(overlay, {
      scene: "slopeMastery", badge: LAB_ASSET_PATHS.m1,
      html: `<h3>\u26f7\ufe0f Slope Scout!</h3><p>You can explain: slope tells the rate of change.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}
