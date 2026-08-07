/**
 * Green Tech - Mission 1: Clean Energy (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
  mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
  mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L1_META = {
  objective: "By the end of this mission, you'll be able to explain solar wind in your own words.",
  bdHook: "Bangladesh everyday: notice solar wind around you — then connect it to Clean Energy.",
  predict: {
    q: "Before we start — what do you think matters most in Clean Energy?",
    options: [
      "Guessing without checking",
      "Looking for a clear pattern or rule",
      "Skipping the practice steps",
    ],
    ok: 1,
  },

  kidTitle: "Clean Energy",
  theme: "solar wind",
  emoji: "\ud83c\udf2c\ufe0f",
  rewardName: "Clean Champ",
  intro: "Sun and wind can power homes without smoke from burning fuel.",
  everyday: ["Rooftop solar", "Wind turbine", "Solar lamp"],
  subTitles: [
    "Meet Clean Power", "Clean Dial Lab", "Sort Energy Sources", "More Clean Lab",
    "Why Clean Helps", "Name the Clean Rule", "Stretch: Places", "Myth Bust",
    "Fluency Drill", "Clean Champ Mastery",
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
  setCoach("Hook: sun and wind vs smoke.");
  mountMotionChain(overlay, {
    title: "Meet Clean Power",
    beats: [
      { scene: "cleanMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000, html: `${badgeHtml(LAB_ASSET_PATHS.m1, "clean")}<p><strong>Act 1:</strong> Meet sun, turbine, and smoky stack.</p>` },
      { scene: "cleanMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200, html: `<p><strong>Act 2:</strong> Clean sources power without smoke.</p>` },
      { scene: "cleanMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000, html: `<p><strong>Act 3:</strong> Homes can light from sun and wind.</p>` }
    ],
    onDone: () => mountQuiz(overlay, {
      scene: "cleanMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
      q: "Clean energy often means...",
      opts: ["Power with little or no fuel smoke", "Only coal forever", "Candles as the only grid", "Wishing without panels"],
      ok: 0, onDone: () => mountTapContinue(overlay, {
        scene: "cleanMeet", badge: LAB_ASSET_PATHS.m1,
        html: `<h3>Ready</h3><p>Next: dial clean power share.</p>`,
        onDone: completeSub, advanceAfterDone: true,
      }),
    }),
  });
}

function s2({ overlay, setCoach, completeSub }) {
  setCoach("Boost clean share until smoke fades.");
  labState.heat = 0.25;
  mountHeatLab(overlay, {
    scene: "cleanLab", title: "Clean Dial Lab",
    html: `<p>Drag until clean &gt;= 60%.</p>`,
    goalText: "Goal >= 60%", doneLabel: "Dial checked", threshold: 0.6, startHeat: 0.25,
    axis: "x", canvasAction: "stretch", sliderLabel: "Clean share", badge: LAB_ASSET_PATHS.m1,
    onDone: completeSub,
  });
}

function s3({ overlay, setCoach, completeSub }) {
  setCoach("Sort clean, smoky, or other.");
  mountTapContinue(overlay, {
    scene: "cleanSort",
    html: `<h3>Guide</h3><p><strong>Clean:</strong> solar, wind, hydro.<br><strong>Smoky:</strong> coal, diesel.<br><strong>Store/not:</strong> battery store, wishing, candle only.</p>`,
    onDone: () => mountDragSort(overlay, {
      scene: "cleanSort", title: "Sort Energy Sources",
      instructions: "Drag into Clean / Smoky / Store or not.",
      successText: "Energy sources sorted!",
      chips: [
        { id: "solar", text: "Solar panel", short: "Solar", color: 0x38bdf8 },
        { id: "wind", text: "Wind turbine", short: "Wind", color: 0x86efac },
        { id: "hydro", text: "Hydro dam", short: "Hydro", color: 0x22c55e },
        { id: "coal", text: "Coal smoke", short: "Coal", color: 0x78716c },
        { id: "diesel", text: "Diesel generator", short: "Diesel", color: 0xf97316 },
        { id: "bat", text: "Battery store", short: "Battery", color: 0xfbbf24 },
        { id: "wish", text: "Only wishing", short: "Wish", color: 0x94a3b8 },
        { id: "candle", text: "Candle only", short: "Candle", color: 0xa78bfa }
      ],
      zones: [
        { id: "clean", label: "Clean source", accept: ["solar", "wind", "hydro"] },
        { id: "dirty", label: "Smoky source", accept: ["coal", "diesel"] },
        { id: "other", label: "Store / not", accept: ["bat", "wish", "candle"] }
      ],
      onDone: completeSub,
    }),
  });
}

function s4({ overlay, setCoach, completeSub }) {
  setCoach("Push clean share higher.");
  labState.heat = 0.4;
  mountHeatLab(overlay, {
    scene: "cleanLab", title: "More Clean Lab", html: `<p>Reach &gt;= 75% clean.</p>`,
    goalText: "Goal >= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
    axis: "x", canvasAction: "stretch", sliderLabel: "Clean share", badge: LAB_ASSET_PATHS.m1,
    onDone: completeSub,
  });
}

function s5({ overlay, setCoach, completeSub }) {
  setCoach("Order why clean helps.");
  mountOrderSteps(overlay, {
    scene: "cleanMeet", sceneArgs: { phase: "settle" }, title: "Why Clean Helps",
    instructions: "Order the story.",
    items: [{ id: "cap", html: "Capture sun or wind" }, { id: "make", html: "Turn it into electricity" }, { id: "use", html: "Power lights and devices" }, { id: "smoke", html: "Skip burning fuel smoke" }],
    correctIds: ["cap", "make", "use", "smoke"],
    onDone: () => mountQuiz(overlay, {
      scene: "cleanMeet", title: "Check",
      q: "A battery on a solar home mostly...",
      opts: ["Stores energy for later use", "Creates coal smoke", "Replaces the need for any source forever with wishes", "Is only a candle"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s6({ overlay, setCoach, completeSub }) {
  setCoach("Lock the clean rule.");
  mountEquationBuild(overlay, {
    scene: "cleanRule", title: "Name the Clean Rule", instructions: "Tap in order.",
    tokens: [{ id: "a", html: "Sun" }, { id: "b", html: "/" }, { id: "c", html: "wind" }, { id: "d", html: "power clean" }],
    correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
    onDone: () => mountTapContinue(overlay, {
      scene: "cleanRule", badge: LAB_ASSET_PATHS.rule,
      html: `<h3>Rule locked</h3><p>Sun / wind can power clean without smoke.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}

function s7({ overlay, setCoach, completeSub }) {
  setCoach("Rooftop, school yard, street lamps, shop, lab.");
  mountTapContinue(overlay, {
    scene: "cleanStretch", html: `<h3>Places</h3><p>Tap each place - same clean idea.</p>`,
    onDone: () => mountQuiz(overlay, {
      scene: "cleanStretch", title: "Transfer",
      q: "A solar street lamp at night usually uses...",
      opts: ["Energy stored from daytime sun", "Only coal smoke at the lamp post", "Wishing with no panel", "A diesel hose forever"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s8({ overlay, setCoach, completeSub }) {
  setCoach("Bust clean-energy myths.");
  mountMythCards(overlay, {
    scene: "cleanMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
    myths: [
      { claim: "Solar only works in factories", truth: "Home rooftops can use solar panels too", sceneMyth: 0 },
      { claim: "Wind turbines make coal smoke", truth: "Wind power does not burn fuel for electricity", sceneMyth: 1 },
      { claim: "Clean energy cannot light a home", truth: "Sun and wind can power homes when systems connect", sceneMyth: 2 },
      { claim: "Batteries create energy from nothing", truth: "Batteries store energy gathered earlier", sceneMyth: 3 },
      { claim: "Coal smoke is required for all power", truth: "Many places mix or switch to cleaner sources", sceneMyth: 4 }
    ],
    onDone: completeSub,
  });
}

function s9({ overlay, setCoach, completeSub }) {
  setCoach("Quick clean fluency.");
  mountSpeedDrill(overlay, {
    scene: "cleanDrill", title: "Fluency Drill", passScene: "cleanMastery",
    items: [
      { q: "Solar is a clean source?", opts: ["Yes", "No"], ok: 0, prompt: "Solar?" },
      { q: "Coal smoke is clean?", opts: ["No", "Yes"], ok: 0, prompt: "Coal?" },
      { q: "Wind can make electricity?", opts: ["Yes", "No"], ok: 0, prompt: "Wind?" },
      { q: "Battery stores energy?", opts: ["Yes", "No"], ok: 0, prompt: "Battery?" },
      { q: "Wishing alone powers a grid?", opts: ["No", "Yes"], ok: 0, prompt: "Wish?" },
      { q: "Hydro can be a clean source?", opts: ["Yes", "No"], ok: 0, prompt: "Hydro?" }
    ],
    onDone: completeSub,
  });
}

function s10({ overlay, setCoach, completeSub }) {
  setCoach("Mastery - Clean Champ.");
  mountOrderSteps(overlay, {
    scene: "cleanMastery", title: "Clean Champ Mastery", instructions: "Order your journey.",
    items: [{ id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" }, { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "win", html: "Win" }],
    correctIds: ["meet", "sort", "lab", "rule", "myth", "win"],
    onDone: () => mountTapContinue(overlay, {
      scene: "cleanMastery", badge: LAB_ASSET_PATHS.m1,
      html: `<h3>\ud83c\udf2c\ufe0f Clean Champ!</h3><p>You can explain how sun and wind power without smoke.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}
