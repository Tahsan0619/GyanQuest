/**
 * Civil Basics - Mission 1: Strong Structures (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
  mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
  mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L1_META = {
  objective: "By the end of this mission, you'll be able to explain triangles & load in your own words.",
  bdHook: "Bangladesh everyday: notice triangles & load around you — then connect it to Strong Structures.",
  predict: {
    q: "Before we start — what do you think matters most in Strong Structures?",
    options: [
      "Guessing without checking",
      "Looking for a clear pattern or rule",
      "Skipping the practice steps",
    ],
    ok: 1,
  },

  kidTitle: "Strong Structures",
  theme: "triangles & load",
  emoji: "\ud83c\udf09",
  rewardName: "Structure Scout",
  intro: "Triangles and good bases keep bridges and towers strong under load.",
  everyday: ["Bridge truss", "Shelf bracket", "Building frame"],
  subTitles: [
    "Meet Strong Shapes", "Strength Dial", "Sort Strong Ideas", "Stronger Bridge Lab",
    "Why It Holds", "Name the Structure Rule", "Stretch: Places", "Myth Bust",
    "Fluency Drill", "Structure Scout Mastery",
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
  setCoach("Hook: triangles and bases carry load.");
  mountMotionChain(overlay, {
    title: "Meet Strong Shapes",
    beats: [
      { scene: "structMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000, html: `${badgeHtml(LAB_ASSET_PATHS.m1, "struct")}<p><strong>Act 1:</strong> Compare a triangle frame to a tall skinny tower.</p>` },
      { scene: "structMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200, html: `<p><strong>Act 2:</strong> Triangles and a wide base share the load.</p>` },
      { scene: "structMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000, html: `<p><strong>Act 3:</strong> Strong shapes keep bridges safe.</p>` }
    ],
    onDone: () => mountQuiz(overlay, {
      scene: "structMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
      q: "A strong simple structure often uses...",
      opts: ["Triangles and a stable base", "Only tall skinny stacks", "Cloud props", "Songs instead of braces"],
      ok: 0, onDone: () => mountTapContinue(overlay, {
        scene: "structMeet", badge: LAB_ASSET_PATHS.m1,
        html: `<h3>Ready</h3><p>Next: dial structure strength.</p>`,
        onDone: completeSub, advanceAfterDone: true,
      }),
    }),
  });
}

function s2({ overlay, setCoach, completeSub }) {
  setCoach("Brace until the bridge holds.");
  labState.heat = 0.25;
  mountHeatLab(overlay, {
    scene: "structLab", title: "Strength Dial",
    html: `<p>Drag until strength &gt;= 60%.</p>`,
    goalText: "Goal >= 60%", doneLabel: "Dial checked", threshold: 0.6, startHeat: 0.25,
    axis: "x", canvasAction: "stretch", sliderLabel: "Strength", badge: LAB_ASSET_PATHS.m1,
    onDone: completeSub,
  });
}

function s3({ overlay, setCoach, completeSub }) {
  setCoach("Sort strong, weak, or not structure.");
  mountTapContinue(overlay, {
    scene: "structSort",
    html: `<h3>Guide</h3><p><strong>Strong:</strong> triangle, wide base, cross brace.<br><strong>Weak:</strong> tall skinny, no brace, tippy stack.<br><strong>Not:</strong> cloud prop, only a song.</p>`,
    onDone: () => mountDragSort(overlay, {
      scene: "structSort", title: "Sort Strong Ideas",
      instructions: "Drag into Strong / Weak / Not structure.",
      successText: "Structure ideas sorted!",
      chips: [
        { id: "tri", text: "Triangle brace", short: "Triangle", color: 0x22c55e },
        { id: "wide", text: "Wide base", short: "Wide base", color: 0x38bdf8 },
        { id: "brace", text: "Cross brace", short: "Brace", color: 0xfbbf24 },
        { id: "tall", text: "Tall skinny", short: "Tall skinny", color: 0xf97316 },
        { id: "nbrace", text: "No brace", short: "No brace", color: 0xef4444 },
        { id: "tip", text: "Tippy stack", short: "Tippy", color: 0xa78bfa },
        { id: "cloud", text: "Cloud prop", short: "Cloud", color: 0x94a3b8 },
        { id: "song", text: "Only a song", short: "Song", color: 0x78716c }
      ],
      zones: [
        { id: "strong", label: "Strong idea", accept: ["tri", "wide", "brace"] },
        { id: "weak", label: "Weak idea", accept: ["tall", "nbrace", "tip"] },
        { id: "not", label: "Not structure", accept: ["cloud", "song"] }
      ],
      onDone: completeSub,
    }),
  });
}

function s4({ overlay, setCoach, completeSub }) {
  setCoach("Push strength higher.");
  labState.heat = 0.4;
  mountHeatLab(overlay, {
    scene: "structLab", title: "Stronger Bridge Lab", html: `<p>Reach &gt;= 75% strength.</p>`,
    goalText: "Goal >= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
    axis: "x", canvasAction: "stretch", sliderLabel: "Strength", badge: LAB_ASSET_PATHS.m1,
    onDone: completeSub,
  });
}

function s5({ overlay, setCoach, completeSub }) {
  setCoach("Order why the bridge holds.");
  mountOrderSteps(overlay, {
    scene: "structMeet", sceneArgs: { phase: "settle" }, title: "Why It Holds",
    instructions: "Order the story.",
    items: [{ id: "base", html: "Set a wide stable base" }, { id: "tri", html: "Add triangle braces" }, { id: "path", html: "Load travels down the members" }, { id: "hold", html: "Shape holds instead of tipping" }],
    correctIds: ["base", "tri", "path", "hold"],
    onDone: () => mountQuiz(overlay, {
      scene: "structMeet", title: "Check",
      q: "Removing all braces from a frame usually...",
      opts: ["Makes it weaker under load", "Always makes it stronger", "Turns it into a cloud", "Removes gravity"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s6({ overlay, setCoach, completeSub }) {
  setCoach("Lock the structure rule.");
  mountEquationBuild(overlay, {
    scene: "structRule", title: "Name the Structure Rule", instructions: "Tap in order.",
    tokens: [{ id: "a", html: "Triangles" }, { id: "b", html: "+" }, { id: "c", html: "wide base" }, { id: "d", html: "carry load" }],
    correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
    onDone: () => mountTapContinue(overlay, {
      scene: "structRule", badge: LAB_ASSET_PATHS.rule,
      html: `<h3>Rule locked</h3><p>Triangles + wide base carry load safely.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}

function s7({ overlay, setCoach, completeSub }) {
  setCoach("Home shelves, school models, street bridges, racks, lab.");
  mountTapContinue(overlay, {
    scene: "structStretch", html: `<h3>Places</h3><p>Tap each place - same structure idea.</p>`,
    onDone: () => mountQuiz(overlay, {
      scene: "structStretch", title: "Transfer",
      q: "A tippy tall bookshelf often needs...",
      opts: ["Wider base or wall bracing", "Only louder music", "Fewer triangles always", "Cloud supports"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s8({ overlay, setCoach, completeSub }) {
  setCoach("Bust structure myths.");
  mountMythCards(overlay, {
    scene: "structMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
    myths: [
      { claim: "Taller is always stronger", truth: "Tall skinny without braces can tip or buckle", sceneMyth: 0 },
      { claim: "Triangles are only for art class", truth: "Triangles lock shapes and carry load well", sceneMyth: 1 },
      { claim: "Base width does not matter", truth: "A wider base resists tipping", sceneMyth: 2 },
      { claim: "Braces are optional decoration", truth: "Braces share and redirect load paths", sceneMyth: 3 },
      { claim: "Only concrete matters, not shape", truth: "Shape and load path matter as much as material", sceneMyth: 4 }
    ],
    onDone: completeSub,
  });
}

function s9({ overlay, setCoach, completeSub }) {
  setCoach("Quick structure fluency.");
  mountSpeedDrill(overlay, {
    scene: "structDrill", title: "Fluency Drill", passScene: "structMastery",
    items: [
      { q: "Triangles help lock a shape?", opts: ["Yes", "No"], ok: 0, prompt: "Triangle?" },
      { q: "Wide base resists tipping?", opts: ["Yes", "No"], ok: 0, prompt: "Base?" },
      { q: "Tall skinny is always safest?", opts: ["No", "Yes"], ok: 0, prompt: "Tall?" },
      { q: "Braces share load?", opts: ["Yes", "No"], ok: 0, prompt: "Brace?" },
      { q: "Cloud prop is a structure idea?", opts: ["No", "Yes"], ok: 0, prompt: "Cloud?" },
      { q: "No brace can weaken a frame?", opts: ["Yes", "No"], ok: 0, prompt: "Weak?" }
    ],
    onDone: completeSub,
  });
}

function s10({ overlay, setCoach, completeSub }) {
  setCoach("Mastery - Structure Scout.");
  mountOrderSteps(overlay, {
    scene: "structMastery", title: "Structure Scout Mastery", instructions: "Order your journey.",
    items: [{ id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" }, { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "win", html: "Win" }],
    correctIds: ["meet", "sort", "lab", "rule", "myth", "win"],
    onDone: () => mountTapContinue(overlay, {
      scene: "structMastery", badge: LAB_ASSET_PATHS.m1,
      html: `<h3>\ud83c\udf09 Structure Scout!</h3><p>You can explain why triangles and bases keep structures strong.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}
