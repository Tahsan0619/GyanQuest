/**
 * Astronomy & Space - Mission 2: Day & Night Sky (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
  mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
  mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L2_META = {
  objective: "By the end of this mission, you'll be able to explain Earth rotation = day / night in your own words.",
  bdHook: "Bangladesh everyday: notice Earth rotation = day / night around you — then connect it to Day & Night Sky.",
  predict: {
    q: "Before we start — what do you think matters most in Day & Night Sky?",
    options: [
      "Guessing without checking",
      "Looking for a clear pattern or rule",
      "Skipping the practice steps",
    ],
    ok: 1,
  },

  kidTitle: "Day & Night Sky",
  theme: "Earth rotation = day / night",
  emoji: "\ud83c\udf19",
  rewardName: "Sky Watcher",
  intro: "Earth spins - day and night take turns.",
  everyday: ["Sunrise window", "School timetable", "Dhaka evening lights"],
  subTitles: [
    "Meet Day and Night",
    "Spin Clarity Lab",
    "Sort: Cause / Result",
    "Faster Spin Lab",
    "Why Day Follows Night",
    "Name the Spin Rule",
    "Stretch: BD Times",
    "Myth Bust",
    "Fluency Drill",
    "Sky Watcher Mastery",
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
  setCoach("Hook: Earth spins - day and night swap.");
  mountMotionChain(overlay, {
    title: "Meet Day and Night",
    beats: [
      { scene: "skyMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000,
        html: `${badgeHtml(LAB_ASSET_PATHS.m2, "badge")}<p><strong>Act 1:</strong> See Earth with a bright side and a dark side.</p>` },
      { scene: "skyMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200,
        html: `<p><strong>Act 2:</strong> Earth spins - your place moves into light or shadow.</p>` },
      { scene: "skyMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000,
        html: `<p><strong>Act 3:</strong> Day and night take turns because Earth rotates.</p>` },
    ],
    onDone: () => mountQuiz(overlay, {
      scene: "skyMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
      q: "What mainly causes day and night?",
      opts: ["Earth rotating relative to the Sun", "The Sun turning off", "Clouds only", "A flat Earth"],
      ok: 0, onDone: () => mountTapContinue(overlay, {
        scene: "skyMeet", badge: LAB_ASSET_PATHS.m2,
        html: `<h3>Sky ready</h3><p>Next: spin clarity lab.</p>`,
        onDone: completeSub, advanceAfterDone: true,
      }),
    }),
  });
}

function s2({ overlay, setCoach, completeSub }) {
  setCoach("Dial until spin idea is clear.");
  labState.heat = 0.25;
  mountHeatLab(overlay, {
    scene: "skyLab", title: "Spin Clarity Lab",
    html: `<p>Drag until rotation idea is clear (&gt;= 60%).</p>`,
    goalText: "Goal &gt;= 60%", doneLabel: "Spin clearer", threshold: 0.6, startHeat: 0.25,
    axis: "x", canvasAction: "stretch", sliderLabel: "Spin", badge: LAB_ASSET_PATHS.m2,
    onDone: completeSub,
  });
}

function s3({ overlay, setCoach, completeSub }) {
  setCoach("Sort causes, what we see, and not-the-cause.");
  mountTapContinue(overlay, {
    scene: "skySort",
    html: `<h3>Cause vs result</h3><p><strong>Cause:</strong> spin, sunlit side, shadow side.<br><strong>Result:</strong> day, night, sleep time.<br><strong>Not:</strong> room lamp, flat-Earth myth.</p>`,
    onDone: () => mountDragSort(overlay, {
      scene: "skySort", title: "Sort: Cause / Result / Not",
      instructions: "Drag chips into the matching bin.",
      successText: "Day-night sorted!",
      chips: [
        { id: "day", text: "Bright sunny day", short: "Day", color: 0xfacc15 },
        { id: "night", text: "Dark starry night", short: "Night", color: 0x818cf8 },
        { id: "spin", text: "Earth spinning", short: "Spin", color: 0x38bdf8 },
        { id: "sunside", text: "Sunlit side", short: "Sun side", color: 0xfde68a },
        { id: "shadow", text: "Shadow side", short: "Shadow", color: 0x334155 },
        { id: "lamp", text: "Room lamp on/off", short: "Lamp", color: 0x94a3b8 },
        { id: "sleep", text: "Sleep at night", short: "Sleep", color: 0xa78bfa },
        { id: "flat", text: "Flat Earth myth", short: "Flat myth", color: 0x78716c },
      ],
      zones: [
        { id: "cause", label: "Causes day/night", accept: ["spin", "sunside", "shadow"] },
        { id: "result", label: "What we see", accept: ["day", "night", "sleep"] },
        { id: "not", label: "Not the cause", accept: ["lamp", "flat"] },
      ],
      onDone: completeSub,
    }),
  });
}

function s4({ overlay, setCoach, completeSub }) {
  setCoach("Push spin clarity higher.");
  labState.heat = 0.4;
  mountHeatLab(overlay, {
    scene: "skyLab", title: "Faster Spin Lab", html: `<p>Reach &gt;= 75% - day/night swap feels clear.</p>`,
    goalText: "Goal &gt;= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
    axis: "x", canvasAction: "stretch", sliderLabel: "Spin", badge: LAB_ASSET_PATHS.m2,
    onDone: completeSub,
  });
}

function s5({ overlay, setCoach, completeSub }) {
  setCoach("Order the day-night story.");
  mountOrderSteps(overlay, {
    scene: "skyMeet", sceneArgs: { phase: "settle" }, title: "Why Day Follows Night",
    instructions: "Order the story.",
    items: [{ id: "sun", html: "Sun keeps shining" }, { id: "spin", html: "Earth rotates" }, { id: "side", html: "Your side faces toward or away" }, { id: "dn", html: "You get day or night" }],
    correctIds: ["sun", "spin", "side", "dn"],
    onDone: () => mountQuiz(overlay, {
      scene: "skyMeet", title: "Check",
      q: "When your side faces away from the Sun you get...",
      opts: ["Night", "Always noon", "No Earth", "A new Sun"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s6({ overlay, setCoach, completeSub }) {
  setCoach("Lock the spin rule.");
  mountEquationBuild(overlay, {
    scene: "skyRule", title: "Name the Spin Rule", instructions: "Tap in order.",
    tokens: [{ id: "a", html: "Earth" }, { id: "b", html: "spins" }, { id: "c", html: "=" }, { id: "d", html: "day/night" }],
    correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
    onDone: () => mountTapContinue(overlay, {
      scene: "skyRule", badge: LAB_ASSET_PATHS.rule,
      html: `<h3>Rule locked</h3><p>Earth spins = day and night take turns.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}

function s7({ overlay, setCoach, completeSub }) {
  setCoach("Home, school, street, bd, lab - same rotation idea.");
  mountTapContinue(overlay, {
    scene: "skyStretch",
    html: `<h3>BD times</h3><p>Tap contexts - same spin makes Dhaka day while elsewhere may be night.</p>`,
    onDone: () => mountQuiz(overlay, {
      scene: "skyStretch", title: "Transfer",
      q: "If it is night in Dhaka, another place can have...",
      opts: ["Day at the same clock moment", "No Sun ever again", "A flat Earth", "Zero rotation forever"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s8({ overlay, setCoach, completeSub }) {
  setCoach("Bust day-night myths.");
  mountMythCards(overlay, {
    scene: "skyMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
    myths: [
      { claim: "The Sun goes to sleep at night", truth: "Earth rotates - your side turns away from the Sun", sceneMyth: 0 },
      { claim: "Night means the Sun is gone forever", truth: "The Sun is still there; your side is in shadow", sceneMyth: 1 },
      { claim: "Day and night need a room lamp", truth: "Day/night come from Earth's spin relative to the Sun", sceneMyth: 2 },
      { claim: "Earth does not rotate", truth: "Earth spins once per day - that makes day and night", sceneMyth: 3 },
      { claim: "Everyone has night at the same time", truth: "When BD has night, another place can have day", sceneMyth: 4 },
    ],
    onDone: completeSub,
  });
}

function s9({ overlay, setCoach, completeSub }) {
  setCoach("Quick day-night fluency.");
  mountSpeedDrill(overlay, {
    scene: "skyDrill", title: "Fluency Drill", passScene: "skyMastery",
    items: [
      { q: "Earth rotates once per day?", opts: ["Yes", "No"], ok: 0, prompt: "Spin?" },
      { q: "Sun turns off at night?", opts: ["No", "Yes"], ok: 0, prompt: "Sun" },
      { q: "Shadow side means...", opts: ["Night", "Always day"], ok: 0, prompt: "Shade" },
      { q: "Room lamp causes day?", opts: ["No", "Yes"], ok: 0, prompt: "Lamp" },
      { q: "Day follows night because...", opts: ["Earth spins", "Earth is flat"], ok: 0, prompt: "Why" },
      { q: "Everyone shares one night?", opts: ["No", "Yes"], ok: 0, prompt: "Same?" },
    ],
    onDone: completeSub,
  });
}

function s10({ overlay, setCoach, completeSub }) {
  setCoach("Mastery - Sky Watcher.");
  mountOrderSteps(overlay, {
    scene: "skyMastery", title: "Sky Watcher Mastery", instructions: "Order your journey.",
    items: [{ id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" }, { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "win", html: "Win" }],
    correctIds: ["meet", "sort", "lab", "rule", "myth", "win"],
    onDone: () => mountTapContinue(overlay, {
      scene: "skyMastery", badge: LAB_ASSET_PATHS.m2,
      html: `<h3>\ud83c\udf19 Sky Watcher!</h3><p>You can explain: Earth spins to make day and night.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}
