/**
 * Human Anatomy - Mission 2: Heart Beat (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
  mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
  mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L2_META = {
  objective: "By the end of this mission, you'll be able to explain pump + oxygen blood in your own words.",
  bdHook: "Bangladesh everyday: notice pump + oxygen blood around you — then connect it to Heart Beat.",
  predict: {
    q: "Before we start — what do you think matters most in Heart Beat?",
    options: [
      "Guessing without checking",
      "Looking for a clear pattern or rule",
      "Skipping the practice steps",
    ],
    ok: 1,
  },

  kidTitle: "Heart Beat",
  theme: "pump + oxygen blood",
  emoji: "\ud83d\udc93",
  rewardName: "Pulse Pro",
  intro: "Heart pumps blood that carries oxygen.",
  everyday: ["Wrist pulse", "After running", "Calm breathing"],
  subTitles: [
    "Meet the Pump",
    "Pulse Clarity Lab",
    "Sort: Circulation / Notice / Not",
    "Stronger Pulse Lab",
    "Why Blood Moves",
    "Name the Pump Rule",
    "Stretch: Active Days",
    "Myth Bust",
    "Fluency Drill",
    "Pulse Pro Mastery",
  ],
};

export function runL2Sub(subIndex, api) {
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
  setCoach("Hook: heart pumps - blood carries oxygen.");
  mountMotionChain(overlay, {
    title: "Meet the Pump",
    beats: [
      { scene: "heartMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000,
        html: `${badgeHtml(LAB_ASSET_PATHS.m2, "badge")}<p><strong>Act 1:</strong> See the heart squeeze and push blood.</p>` },
      { scene: "heartMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200,
        html: `<p><strong>Act 2:</strong> Blood carries oxygen from the lungs.</p>` },
      { scene: "heartMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000,
        html: `<p><strong>Act 3:</strong> Pulse is the beat you can feel.</p>` },
    ],
    onDone: () => mountQuiz(overlay, {
      scene: "heartMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
      q: "The heart's main job here is to...",
      opts: ["Pump blood that can carry oxygen", "Charge phones", "Be a stone", "Stop all pulse forever"],
      ok: 0, onDone: () => mountTapContinue(overlay, {
        scene: "heartMeet", badge: LAB_ASSET_PATHS.m2,
        html: `<h3>Pulse ready</h3><p>Next: pulse clarity lab.</p>`,
        onDone: completeSub, advanceAfterDone: true,
      }),
    }),
  });
}

function s2({ overlay, setCoach, completeSub }) {
  setCoach("Dial until pulse idea is clear.");
  labState.heat = 0.25;
  mountHeatLab(overlay, {
    scene: "heartLab", title: "Pulse Clarity Lab",
    html: `<p>Drag until pump idea is clear (&gt;= 60%).</p>`,
    goalText: "Goal &gt;= 60%", doneLabel: "Pulse clearer", threshold: 0.6, startHeat: 0.25,
    axis: "x", canvasAction: "stretch", sliderLabel: "Pulse", badge: LAB_ASSET_PATHS.m2,
    onDone: completeSub,
  });
}

function s3({ overlay, setCoach, completeSub }) {
  setCoach("Sort circulation, what you notice, and not.");
  mountTapContinue(overlay, {
    scene: "heartSort",
    html: `<h3>Circulation vs notice</h3><p><strong>Circulation:</strong> pump, blood, vessels, oxygen.<br><strong>Notice:</strong> pulse, rest.<br><strong>Not:</strong> stone, charger.</p>`,
    onDone: () => mountDragSort(overlay, {
      scene: "heartSort", title: "Sort: Circulation / Notice / Not",
      instructions: "Drag chips into the matching bin.",
      successText: "Circulation sorted!",
      chips: [
        { id: "pump", text: "Heart pumps", short: "Pump", color: 0xfb7185 },
        { id: "blood", text: "Blood carries O2", short: "Blood", color: 0xf87171 },
        { id: "o2", text: "Oxygen from lungs", short: "Oxygen", color: 0x7dd3fc },
        { id: "pulse", text: "Pulse you feel", short: "Pulse", color: 0xf9a8d4 },
        { id: "vessel", text: "Blood vessels", short: "Vessel", color: 0xef4444 },
        { id: "rest", text: "Rest slows beat", short: "Rest", color: 0x94a3b8 },
        { id: "stone", text: "Garden stone", short: "Stone", color: 0x78716c },
        { id: "wire", text: "Phone charger", short: "Charger", color: 0x64748b },
      ],
      zones: [
        { id: "circ", label: "Circulation", accept: ["pump", "blood", "vessel", "o2"] },
        { id: "feel", label: "What you notice", accept: ["pulse", "rest"] },
        { id: "not", label: "Not circulation", accept: ["stone", "wire"] },
      ],
      onDone: completeSub,
    }),
  });
}

function s4({ overlay, setCoach, completeSub }) {
  setCoach("Push pulse clarity higher.");
  labState.heat = 0.4;
  mountHeatLab(overlay, {
    scene: "heartLab", title: "Stronger Pulse Lab", html: `<p>Reach &gt;= 75% - circulation path looks clear.</p>`,
    goalText: "Goal &gt;= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
    axis: "x", canvasAction: "stretch", sliderLabel: "Pulse", badge: LAB_ASSET_PATHS.m2,
    onDone: completeSub,
  });
}

function s5({ overlay, setCoach, completeSub }) {
  setCoach("Order why blood moves.");
  mountOrderSteps(overlay, {
    scene: "heartMeet", sceneArgs: { phase: "settle" }, title: "Why Blood Moves",
    instructions: "Order the story.",
    items: [{ id: "o2", html: "Lungs add oxygen" }, { id: "pump", html: "Heart pumps" }, { id: "move", html: "Blood moves in vessels" }, { id: "pulse", html: "You can feel a pulse" }],
    correctIds: ["o2", "pump", "move", "pulse"],
    onDone: () => mountQuiz(overlay, {
      scene: "heartMeet", title: "Check",
      q: "A wrist pulse is evidence of...",
      opts: ["The heart pumping", "A garden stone", "A phone charger", "No blood flow"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s6({ overlay, setCoach, completeSub }) {
  setCoach("Lock the pump rule.");
  mountEquationBuild(overlay, {
    scene: "heartRule", title: "Name the Pump Rule", instructions: "Tap in order.",
    tokens: [{ id: "a", html: "Heart" }, { id: "b", html: "pumps" }, { id: "c", html: "oxygen" }, { id: "d", html: "blood" }],
    correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
    onDone: () => mountTapContinue(overlay, {
      scene: "heartRule", badge: LAB_ASSET_PATHS.rule,
      html: `<h3>Rule locked</h3><p>Heart pumps oxygen-carrying blood.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}

function s7({ overlay, setCoach, completeSub }) {
  setCoach("Pulse at rest and after running - same pump.");
  mountTapContinue(overlay, {
    scene: "heartStretch",
    html: `<h3>Active days</h3><p>Tap contexts - rest vs run changes beat speed, same pump job.</p>`,
    onDone: () => mountQuiz(overlay, {
      scene: "heartStretch", title: "Transfer",
      q: "After a fast run, your pulse often...",
      opts: ["Beats faster for a while", "Turns into a stone", "Charges a phone", "Stops forever"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s8({ overlay, setCoach, completeSub }) {
  setCoach("Bust heart myths.");
  mountMythCards(overlay, {
    scene: "heartMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
    myths: [
      { claim: "The heart only makes feelings", truth: "The heart is a pump that moves blood", sceneMyth: 0 },
      { claim: "Blood does not carry oxygen", truth: "Blood carries oxygen from lungs to the body", sceneMyth: 1 },
      { claim: "You cannot feel a pulse", truth: "Pulse is the beat you can feel in wrist or neck", sceneMyth: 2 },
      { claim: "Rest never changes heart rate", truth: "Rest often slows the beat; activity can raise it", sceneMyth: 3 },
      { claim: "Chargers pump blood", truth: "Only the heart pumps blood in your body", sceneMyth: 4 },
    ],
    onDone: completeSub,
  });
}

function s9({ overlay, setCoach, completeSub }) {
  setCoach("Quick pulse fluency.");
  mountSpeedDrill(overlay, {
    scene: "heartDrill", title: "Fluency Drill", passScene: "heartMastery",
    items: [
      { q: "Heart pumps blood?", opts: ["Yes", "No"], ok: 0, prompt: "Pump" },
      { q: "Blood can carry oxygen?", opts: ["Yes", "No"], ok: 0, prompt: "O2" },
      { q: "Pulse is feelable?", opts: ["Yes", "No"], ok: 0, prompt: "Pulse" },
      { q: "Charger pumps blood?", opts: ["No", "Yes"], ok: 0, prompt: "Wire" },
      { q: "Rest can slow beat?", opts: ["Yes", "No"], ok: 0, prompt: "Rest" },
      { q: "Vessels carry blood?", opts: ["Yes", "No"], ok: 0, prompt: "Vessel" },
    ],
    onDone: completeSub,
  });
}

function s10({ overlay, setCoach, completeSub }) {
  setCoach("Mastery - Pulse Pro.");
  mountOrderSteps(overlay, {
    scene: "heartMastery", title: "Pulse Pro Mastery", instructions: "Order your journey.",
    items: [{ id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" }, { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "win", html: "Win" }],
    correctIds: ["meet", "sort", "lab", "rule", "myth", "win"],
    onDone: () => mountTapContinue(overlay, {
      scene: "heartMastery", badge: LAB_ASSET_PATHS.m2,
      html: `<h3>\ud83d\udc93 Pulse Pro!</h3><p>You can explain: heart pumps blood that carries oxygen.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}
