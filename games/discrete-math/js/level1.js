/**
 * Discrete Math - Mission 1: Logic Lite (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
  mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
  mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L1_META = {
  objective: "By the end of this mission, you'll be able to explain AND / OR / NOT in your own words.",
  bdHook: "Bangladesh everyday: notice AND / OR / NOT around you — then connect it to Logic Lite.",
  predict: {
    q: "Before we start — what do you think matters most in Logic Lite?",
    options: [
      "Guessing without checking",
      "Looking for a clear pattern or rule",
      "Skipping the practice steps",
    ],
    ok: 1,
  },

  kidTitle: "Logic Lite",
  theme: "AND / OR / NOT",
  emoji: "\ud83d\udd00",
  rewardName: "Logic Learner",
  intro: "AND, OR, NOT - tiny rules that decide.",
  everyday: ["Both shoes on (AND)", "Bus or rickshaw (OR)", "Not raining"],
  subTitles: [
    "Meet AND OR NOT",
    "Logic Clarity Lab",
    "Sort: Logic / Not",
    "Gate Lab",
    "Why Gates Decide",
    "Name the Logic Rule",
    "Stretch: Daily Decide",
    "Myth Bust",
    "Fluency Drill",
    "Logic Learner Mastery",
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
  setCoach("Hook: AND, OR, NOT decide true/false.");
  mountMotionChain(overlay, {
    title: "Meet AND OR NOT",
    beats: [
      { scene: "logicMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000,
        html: `${badgeHtml(LAB_ASSET_PATHS.m1, "badge")}<p><strong>Act 1:</strong> Meet three tiny gates: AND, OR, NOT.</p>` },
      { scene: "logicMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200,
        html: `<p><strong>Act 2:</strong> AND needs both; OR needs one; NOT flips.</p>` },
      { scene: "logicMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000,
        html: `<p><strong>Act 3:</strong> These rules decide true or false.</p>` },
    ],
    onDone: () => mountQuiz(overlay, {
      scene: "logicMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
      q: "AND is true when...",
      opts: ["Both inputs are true", "Only one is true", "Never", "Soup is hot"],
      ok: 0, onDone: () => mountTapContinue(overlay, {
        scene: "logicMeet", badge: LAB_ASSET_PATHS.m1,
        html: `<h3>Logic ready</h3><p>Next: logic clarity lab.</p>`,
        onDone: completeSub, advanceAfterDone: true,
      }),
    }),
  });
}

function s2({ overlay, setCoach, completeSub }) {
  setCoach("Dial until logic idea is clear.");
  labState.heat = 0.25;
  mountHeatLab(overlay, {
    scene: "logicLab", title: "Logic Clarity Lab",
    html: `<p>Drag until AND/OR/NOT idea is clear (&gt;= 60%).</p>`,
    goalText: "Goal &gt;= 60%", doneLabel: "Logic clearer", threshold: 0.6, startHeat: 0.25,
    axis: "x", canvasAction: "stretch", sliderLabel: "Logic", badge: LAB_ASSET_PATHS.m1,
    onDone: completeSub,
  });
}

function s3({ overlay, setCoach, completeSub }) {
  setCoach("Sort logic pieces vs not-logic.");
  mountTapContinue(overlay, {
    scene: "logicSort",
    html: `<h3>Logic or not?</h3><p><strong>Logic:</strong> AND, OR, NOT, true, false, rule.<br><strong>Not:</strong> soup, cloud.</p>`,
    onDone: () => mountDragSort(overlay, {
      scene: "logicSort", title: "Sort: Logic / Not",
      instructions: "Drag chips into the matching bin.",
      successText: "Logic sorted!",
      chips: [
        { id: "and", text: "AND needs both", short: "AND", color: 0xf9a8d4 },
        { id: "or", text: "OR needs one", short: "OR", color: 0xf472b6 },
        { id: "not", text: "NOT flips", short: "NOT", color: 0xec4899 },
        { id: "true", text: "true gate open", short: "true", color: 0x22c55e },
        { id: "false", text: "false gate shut", short: "false", color: 0xef4444 },
        { id: "rule", text: "Tiny decide rule", short: "Rule", color: 0xfbcfe8 },
        { id: "soup", text: "Random soup", short: "Soup", color: 0x64748b },
        { id: "cloud", text: "Weather cloud", short: "Cloud", color: 0x78716c },
      ],
      zones: [
        { id: "logic", label: "Logic piece", accept: ["and", "or", "not", "true", "false", "rule"] },
        { id: "nots", label: "Not logic", accept: ["soup", "cloud"] },
      ],
      onDone: completeSub,
    }),
  });
}

function s4({ overlay, setCoach, completeSub }) {
  setCoach("Push logic clarity higher.");
  labState.heat = 0.4;
  mountHeatLab(overlay, {
    scene: "logicLab", title: "Gate Lab", html: `<p>Reach &gt;= 75% - gate decisions look clear.</p>`,
    goalText: "Goal &gt;= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
    axis: "x", canvasAction: "stretch", sliderLabel: "Logic", badge: LAB_ASSET_PATHS.m1,
    onDone: completeSub,
  });
}

function s5({ overlay, setCoach, completeSub }) {
  setCoach("Order how gates decide.");
  mountOrderSteps(overlay, {
    scene: "logicMeet", sceneArgs: { phase: "settle" }, title: "Why Gates Decide",
    instructions: "Order the story.",
    items: [{ id: "inputs", html: "Read the inputs" }, { id: "gate", html: "Pick AND / OR / NOT" }, { id: "decide", html: "Apply the tiny rule" }, { id: "out", html: "Get true or false" }],
    correctIds: ["inputs", "gate", "decide", "out"],
    onDone: () => mountQuiz(overlay, {
      scene: "logicMeet", title: "Check",
      q: "OR is true when...",
      opts: ["At least one input is true", "Both must be false", "NOT is soup", "Never"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s6({ overlay, setCoach, completeSub }) {
  setCoach("Lock the logic rule.");
  mountEquationBuild(overlay, {
    scene: "logicRule", title: "Name the Logic Rule", instructions: "Tap in order.",
    tokens: [{ id: "a", html: "AND" }, { id: "b", html: "OR" }, { id: "c", html: "NOT" }, { id: "d", html: "decide" }],
    correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
    onDone: () => mountTapContinue(overlay, {
      scene: "logicRule", badge: LAB_ASSET_PATHS.rule,
      html: `<h3>Rule locked</h3><p>AND, OR, NOT decide true/false.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}

function s7({ overlay, setCoach, completeSub }) {
  setCoach("Shoes, rides, rain - same AND/OR/NOT.");
  mountTapContinue(overlay, {
    scene: "logicStretch",
    html: `<h3>Daily decide</h3><p>Tap contexts - shoes (AND), ride choice (OR), not raining (NOT).</p>`,
    onDone: () => mountQuiz(overlay, {
      scene: "logicStretch", title: "Transfer",
      q: "Need left shoe AND right shoe is like...",
      opts: ["AND gate needing both", "OR needing only one", "A soup recipe only", "A cloud name"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s8({ overlay, setCoach, completeSub }) {
  setCoach("Bust logic myths.");
  mountMythCards(overlay, {
    scene: "logicMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
    myths: [
      { claim: "AND is the same as OR", truth: "AND needs both true; OR needs at least one", sceneMyth: 0 },
      { claim: "NOT does nothing", truth: "NOT flips true to false and false to true", sceneMyth: 1 },
      { claim: "Logic is only for computers forever", truth: "Kids use AND/OR/NOT in everyday decisions too", sceneMyth: 2 },
      { claim: "Soup is a logic gate", truth: "Soup is food - not an AND/OR/NOT gate", sceneMyth: 3 },
      { claim: "false means the gate is always open", truth: "false means the condition failed / shut", sceneMyth: 4 },
    ],
    onDone: completeSub,
  });
}

function s9({ overlay, setCoach, completeSub }) {
  setCoach("Quick logic fluency.");
  mountSpeedDrill(overlay, {
    scene: "logicDrill", title: "Fluency Drill", passScene: "logicMastery",
    items: [
      { q: "AND needs both true?", opts: ["Yes", "No"], ok: 0, prompt: "AND" },
      { q: "OR needs at least one?", opts: ["Yes", "No"], ok: 0, prompt: "OR" },
      { q: "NOT flips true/false?", opts: ["Yes", "No"], ok: 0, prompt: "NOT" },
      { q: "Soup is a logic gate?", opts: ["No", "Yes"], ok: 0, prompt: "Soup" },
      { q: "AND same as OR?", opts: ["No", "Yes"], ok: 0, prompt: "Same?" },
      { q: "false means condition failed?", opts: ["Yes", "No"], ok: 0, prompt: "false" },
    ],
    onDone: completeSub,
  });
}

function s10({ overlay, setCoach, completeSub }) {
  setCoach("Mastery - Logic Learner.");
  mountOrderSteps(overlay, {
    scene: "logicMastery", title: "Logic Learner Mastery", instructions: "Order your journey.",
    items: [{ id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" }, { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "win", html: "Win" }],
    correctIds: ["meet", "sort", "lab", "rule", "myth", "win"],
    onDone: () => mountTapContinue(overlay, {
      scene: "logicMastery", badge: LAB_ASSET_PATHS.m1,
      html: `<h3>\ud83d\udd00 Logic Learner!</h3><p>You can use AND, OR, and NOT as tiny decide rules.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}
