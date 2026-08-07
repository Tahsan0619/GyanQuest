/**
 * Astronomy & Space - Mission 1: Solar Family (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
  mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
  mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L1_META = {
  objective: "By the end of this mission, you'll be able to explain sun + planets orbit in your own words.",
  bdHook: "Bangladesh everyday: notice sun + planets orbit around you — then connect it to Solar Family.",
  predict: {
    q: "Before we start — what do you think matters most in Solar Family?",
    options: [
      "Guessing without checking",
      "Looking for a clear pattern or rule",
      "Skipping the practice steps",
    ],
    ok: 1,
  },

  kidTitle: "Solar Family",
  theme: "sun + planets orbit",
  emoji: "\ud83e\ude90",
  rewardName: "Orbit Scout",
  intro: "Planets orbit the Sun - our solar family.",
  everyday: ["Night sky peek", "School globe", "Dhaka clear evening"],
  subTitles: [
    "Meet the Solar Family",
    "Orbit Clarity Lab",
    "Sort: Planet / Sun / Other",
    "Closer Orbit Lab",
    "Why Planets Orbit",
    "Name the Orbit Rule",
    "Stretch: Sky Places",
    "Myth Bust",
    "Fluency Drill",
    "Orbit Scout Mastery",
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
  setCoach("Hook: Sun at center - planets orbit.");
  mountMotionChain(overlay, {
    title: "Meet the Solar Family",
    beats: [
      { scene: "solarMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000,
        html: `${badgeHtml(LAB_ASSET_PATHS.m1, "badge")}<p><strong>Act 1:</strong> See the Sun and planets on the desk.</p>` },
      { scene: "solarMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200,
        html: `<p><strong>Act 2:</strong> Planets circle the Sun on paths called orbits.</p>` },
      { scene: "solarMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000,
        html: `<p><strong>Act 3:</strong> Our solar family: Sun + planets (Earth included).</p>` },
    ],
    onDone: () => mountQuiz(overlay, {
      scene: "solarMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
      q: "What do planets do around the Sun?",
      opts: ["Orbit on paths around the Sun", "Sit still forever", "Orbit the Moon only", "Ignore the Sun"],
      ok: 0, onDone: () => mountTapContinue(overlay, {
        scene: "solarMeet", badge: LAB_ASSET_PATHS.m1,
        html: `<h3>Family ready</h3><p>Next: orbit clarity lab.</p>`,
        onDone: completeSub, advanceAfterDone: true,
      }),
    }),
  });
}

function s2({ overlay, setCoach, completeSub }) {
  setCoach("Dial until orbit idea is clear.");
  labState.heat = 0.25;
  mountHeatLab(overlay, {
    scene: "solarLab", title: "Orbit Clarity Lab",
    html: `<p>Drag until orbit idea is clear (&gt;= 60%).</p>`,
    goalText: "Goal &gt;= 60%", doneLabel: "Orbit clearer", threshold: 0.6, startHeat: 0.25,
    axis: "x", canvasAction: "stretch", sliderLabel: "Orbit", badge: LAB_ASSET_PATHS.m1,
    onDone: completeSub,
  });
}

function s3({ overlay, setCoach, completeSub }) {
  setCoach("Sort planets, Sun, moons/comets, and not-space.");
  mountTapContinue(overlay, {
    scene: "solarSort",
    html: `<h3>Who belongs where?</h3><p><strong>Planet:</strong> Mercury, Earth, Jupiter.<br><strong>Star:</strong> Sun.<br><strong>Other:</strong> Moon, comet.<br><strong>Not:</strong> car, ball.</p>`,
    onDone: () => mountDragSort(overlay, {
      scene: "solarSort", title: "Sort: Planet / Sun / Other / Not",
      instructions: "Drag each chip into the matching bin.",
      successText: "Solar family sorted!",
      chips: [
        { id: "merc", text: "Mercury near Sun", short: "Mercury", color: 0x94a3b8 },
        { id: "earth", text: "Earth with life", short: "Earth", color: 0x38bdf8 },
        { id: "jup", text: "Jupiter gas giant", short: "Jupiter", color: 0xfbbf24 },
        { id: "sun", text: "Sun at center", short: "Sun", color: 0xfacc15 },
        { id: "moon", text: "Moon orbits Earth", short: "Moon", color: 0xe2e8f0 },
        { id: "car", text: "Toy car on road", short: "Car", color: 0x78716c },
        { id: "ball", text: "Soccer ball", short: "Ball", color: 0x64748b },
        { id: "comet", text: "Comet visitor", short: "Comet", color: 0xa78bfa },
      ],
      zones: [
        { id: "planet", label: "Planet", accept: ["merc", "earth", "jup"] },
        { id: "star", label: "Star (Sun)", accept: ["sun"] },
        { id: "other", label: "Moon/comet", accept: ["moon", "comet"] },
        { id: "not", label: "Not space", accept: ["car", "ball"] },
      ],
      onDone: completeSub,
    }),
  });
}

function s4({ overlay, setCoach, completeSub }) {
  setCoach("Push orbit clarity higher.");
  labState.heat = 0.4;
  mountHeatLab(overlay, {
    scene: "solarLab", title: "Closer Orbit Lab", html: `<p>Reach &gt;= 75% - paths around the Sun look clear.</p>`,
    goalText: "Goal &gt;= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
    axis: "x", canvasAction: "stretch", sliderLabel: "Orbit", badge: LAB_ASSET_PATHS.m1,
    onDone: completeSub,
  });
}

function s5({ overlay, setCoach, completeSub }) {
  setCoach("Order why planets orbit.");
  mountOrderSteps(overlay, {
    scene: "solarMeet", sceneArgs: { phase: "settle" }, title: "Why Planets Orbit",
    instructions: "Order the story.",
    items: [{ id: "sun", html: "Sun sits near the center" }, { id: "path", html: "Gravity keeps a curved path" }, { id: "orbit", html: "Planet travels the orbit" }, { id: "year", html: "One full trip is a year for that planet" }],
    correctIds: ["sun", "path", "orbit", "year"],
    onDone: () => mountQuiz(overlay, {
      scene: "solarMeet", title: "Check",
      q: "Earth's year is mainly...",
      opts: ["One full orbit around the Sun", "One Moon spin only", "The Sun orbiting Earth", "A soccer game length"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s6({ overlay, setCoach, completeSub }) {
  setCoach("Lock the orbit rule.");
  mountEquationBuild(overlay, {
    scene: "solarRule", title: "Name the Orbit Rule", instructions: "Tap in order.",
    tokens: [{ id: "a", html: "Planets" }, { id: "b", html: "orbit" }, { id: "c", html: "the" }, { id: "d", html: "Sun" }],
    correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
    onDone: () => mountTapContinue(overlay, {
      scene: "solarRule", badge: LAB_ASSET_PATHS.rule,
      html: `<h3>Rule locked</h3><p>Planets orbit the Sun.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}

function s7({ overlay, setCoach, completeSub }) {
  setCoach("Home sky, school globe, street night, BD evening, lab model.");
  mountTapContinue(overlay, {
    scene: "solarStretch",
    html: `<h3>Sky places</h3><p>Tap home, school, street, bd, lab - same solar family.</p>`,
    onDone: () => mountQuiz(overlay, {
      scene: "solarStretch", title: "Transfer",
      q: "A school globe best helps you see...",
      opts: ["Earth as one planet in the family", "That cars orbit the Sun", "That the Moon is a star", "That Jupiter is a ball toy"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s8({ overlay, setCoach, completeSub }) {
  setCoach("Bust solar-system myths.");
  mountMythCards(overlay, {
    scene: "solarMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
    myths: [
      { claim: "The Sun orbits Earth", truth: "Earth and planets orbit the Sun", sceneMyth: 0 },
      { claim: "All planets are the same size", truth: "Sizes differ - Jupiter is huge, Mercury is small", sceneMyth: 1 },
      { claim: "The Moon is a planet", truth: "The Moon orbits Earth - it is a moon, not a planet", sceneMyth: 2 },
      { claim: "Stars and planets are the same", truth: "The Sun is a star; planets reflect its light", sceneMyth: 3 },
      { claim: "Only scientists can know orbits", truth: "Kids can learn: planets go around the Sun", sceneMyth: 4 },
    ],
    onDone: completeSub,
  });
}

function s9({ overlay, setCoach, completeSub }) {
  setCoach("Quick orbit fluency.");
  mountSpeedDrill(overlay, {
    scene: "solarDrill", title: "Fluency Drill", passScene: "solarMastery",
    items: [
      { q: "Planets orbit the Sun?", opts: ["Yes", "No"], ok: 0, prompt: "Orbit?" },
      { q: "Is the Sun a planet?", opts: ["No - a star", "Yes"], ok: 0, prompt: "Sun" },
      { q: "Moon is a planet?", opts: ["No", "Yes"], ok: 0, prompt: "Moon" },
      { q: "Jupiter is a...", opts: ["Planet", "Car"], ok: 0, prompt: "Jup" },
      { q: "Toy car in solar family?", opts: ["No", "Yes"], ok: 0, prompt: "Car" },
      { q: "Earth orbits Sun?", opts: ["Yes", "No"], ok: 0, prompt: "Earth" },
    ],
    onDone: completeSub,
  });
}

function s10({ overlay, setCoach, completeSub }) {
  setCoach("Mastery - Orbit Scout.");
  mountOrderSteps(overlay, {
    scene: "solarMastery", title: "Orbit Scout Mastery", instructions: "Order your journey.",
    items: [{ id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" }, { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "win", html: "Win" }],
    correctIds: ["meet", "sort", "lab", "rule", "myth", "win"],
    onDone: () => mountTapContinue(overlay, {
      scene: "solarMastery", badge: LAB_ASSET_PATHS.m1,
      html: `<h3>\ud83e\ude90 Orbit Scout!</h3><p>You can explain: planets orbit the Sun.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}
