/**
 * Mechanical Basics - Mission 1: Levers & Gears (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
  mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
  mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L1_META = {
  objective: "By the end of this mission, you'll be able to explain simple machines in your own words.",
  bdHook: "Bangladesh everyday: notice simple machines around you — then connect it to Levers & Gears.",
  predict: {
    q: "Before we start — what do you think matters most in Levers & Gears?",
    options: [
      "Guessing without checking",
      "Looking for a clear pattern or rule",
      "Skipping the practice steps",
    ],
    ok: 1,
  },

  kidTitle: "Levers & Gears",
  theme: "simple machines",
  emoji: "\u2699\ufe0f",
  rewardName: "Lever Learner",
  intro: "Levers and gears make hard jobs easier by trading force, distance, and turn.",
  everyday: ["Seesaw", "Bottle opener", "Bike gears"],
  subTitles: [
    "Meet Lever & Gear", "Advantage Dial", "Sort Machines", "Stronger Advantage",
    "Why It Helps", "Name the Machine Rule", "Stretch: Places", "Myth Bust",
    "Fluency Drill", "Lever Learner Mastery",
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
  setCoach("Hook: fulcrum, load, effort - gears mesh.");
  mountMotionChain(overlay, {
    title: "Meet Lever & Gear",
    beats: [
      { scene: "leverMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000, html: `${badgeHtml(LAB_ASSET_PATHS.m1, "lever")}<p><strong>Act 1:</strong> Drag the lever and meshing gears.</p>` },
      { scene: "leverMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200, html: `<p><strong>Act 2:</strong> Long effort arm lifts easier; gears change speed and turn.</p>` },
      { scene: "leverMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000, html: `<p><strong>Act 3:</strong> Machines trade force and distance to help.</p>` }
    ],
    onDone: () => mountQuiz(overlay, {
      scene: "leverMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
      q: "A lever helps most when...",
      opts: ["Fulcrum and arms trade force for distance", "You remove the fulcrum forever", "You only glue the load", "Gears never turn"],
      ok: 0, onDone: () => mountTapContinue(overlay, {
        scene: "leverMeet", badge: LAB_ASSET_PATHS.m1,
        html: `<h3>Ready</h3><p>Next: dial mechanical advantage.</p>`,
        onDone: completeSub, advanceAfterDone: true,
      }),
    }),
  });
}

function s2({ overlay, setCoach, completeSub }) {
  setCoach("Dial advantage until the load lifts easier.");
  labState.heat = 0.25;
  mountHeatLab(overlay, {
    scene: "leverLab", title: "Advantage Dial",
    html: `<p>Drag until advantage &gt;= 60%.</p>`,
    goalText: "Goal >= 60%", doneLabel: "Dial checked", threshold: 0.6, startHeat: 0.25,
    axis: "x", canvasAction: "stretch", sliderLabel: "Advantage", badge: LAB_ASSET_PATHS.m1,
    onDone: completeSub,
  });
}

function s3({ overlay, setCoach, completeSub }) {
  setCoach("Sort levers, gears, and neither.");
  mountTapContinue(overlay, {
    scene: "leverSort",
    html: `<h3>Guide</h3><p><strong>Lever:</strong> seesaw, crowbar, scissors.<br><strong>Gear:</strong> bike/clock gears.<br><strong>Neither:</strong> glue alone, loose magnet, ramp only.</p>`,
    onDone: () => mountDragSort(overlay, {
      scene: "leverSort", title: "Sort Machines",
      instructions: "Drag into Lever / Gear / Neither.",
      successText: "Machines sorted!",
      chips: [
        { id: "see", text: "Seesaw", short: "Seesaw", color: 0x38bdf8 },
        { id: "crow", text: "Crowbar", short: "Crowbar", color: 0x22c55e },
        { id: "bike", text: "Bike gear", short: "Bike gear", color: 0xfbbf24 },
        { id: "clock", text: "Clock gear", short: "Clock gear", color: 0xfdba74 },
        { id: "glue", text: "Glue alone", short: "Glue", color: 0x94a3b8 },
        { id: "mag", text: "Loose magnet", short: "Magnet", color: 0x78716c },
        { id: "scis", text: "Scissors", short: "Scissors", color: 0xa78bfa },
        { id: "ramp", text: "Ramp only", short: "Ramp", color: 0xf97316 }
      ],
      zones: [
        { id: "lever", label: "Lever", accept: ["see", "crow", "scis"] },
        { id: "gear", label: "Gear", accept: ["bike", "clock"] },
        { id: "neither", label: "Neither", accept: ["glue", "mag", "ramp"] }
      ],
      onDone: completeSub,
    }),
  });
}

function s4({ overlay, setCoach, completeSub }) {
  setCoach("Push advantage higher - load rises easier.");
  labState.heat = 0.4;
  mountHeatLab(overlay, {
    scene: "leverLab", title: "Stronger Advantage", html: `<p>Reach &gt;= 75% advantage.</p>`,
    goalText: "Goal >= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
    axis: "x", canvasAction: "stretch", sliderLabel: "Advantage", badge: LAB_ASSET_PATHS.m1,
    onDone: completeSub,
  });
}

function s5({ overlay, setCoach, completeSub }) {
  setCoach("Order why the lever helps.");
  mountOrderSteps(overlay, {
    scene: "leverMeet", sceneArgs: { phase: "settle" }, title: "Why It Helps",
    instructions: "Order the story.",
    items: [{ id: "f", html: "Place a fulcrum under the beam" }, { id: "e", html: "Push on the long effort arm" }, { id: "l", html: "Load rises on the short arm" }, { id: "g", html: "Gears can change speed or turn" }],
    correctIds: ["f", "e", "l", "g"],
    onDone: () => mountQuiz(overlay, {
      scene: "leverMeet", title: "Check",
      q: "Moving the fulcrum closer to the load...",
      opts: ["Usually makes lifting easier", "Removes all force forever", "Stops gears from existing", "Deletes distance"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s6({ overlay, setCoach, completeSub }) {
  setCoach("Lock the machine rule.");
  mountEquationBuild(overlay, {
    scene: "leverRule", title: "Name the Machine Rule", instructions: "Tap in order.",
    tokens: [{ id: "a", html: "Lever" }, { id: "b", html: "trades" }, { id: "c", html: "force" }, { id: "d", html: "distance" }],
    correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
    onDone: () => mountTapContinue(overlay, {
      scene: "leverRule", badge: LAB_ASSET_PATHS.rule,
      html: `<h3>Rule locked</h3><p>Lever trades force and distance; gears change speed/turn.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}

function s7({ overlay, setCoach, completeSub }) {
  setCoach("Home opener, school seesaw, street crowbar, bike shop, lab.");
  mountTapContinue(overlay, {
    scene: "leverStretch", html: `<h3>Places</h3><p>Tap each place - same lever/gear idea.</p>`,
    onDone: () => mountQuiz(overlay, {
      scene: "leverStretch", title: "Transfer",
      q: "A bottle opener is mostly a...",
      opts: ["Lever with fulcrum near the cap", "Loose magnet only", "Broken belt", "Smoke stack"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s8({ overlay, setCoach, completeSub }) {
  setCoach("Bust lever and gear myths.");
  mountMythCards(overlay, {
    scene: "leverMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
    myths: [
      { claim: "Levers only make things heavier", truth: "Levers trade distance for force - they help lift", sceneMyth: 0 },
      { claim: "Gears only look cool", truth: "Gears change speed and turn direction", sceneMyth: 1 },
      { claim: "Fulcrum position does not matter", truth: "Fulcrum place changes how hard you push", sceneMyth: 2 },
      { claim: "Only factories use levers", truth: "Seesaws, crowbars, and scissors are levers too", sceneMyth: 3 },
      { claim: "Bigger gear always means infinite force", truth: "Gear pairs trade speed and force together", sceneMyth: 4 }
    ],
    onDone: completeSub,
  });
}

function s9({ overlay, setCoach, completeSub }) {
  setCoach("Quick lever/gear fluency.");
  mountSpeedDrill(overlay, {
    scene: "leverDrill", title: "Fluency Drill", passScene: "leverMastery",
    items: [
      { q: "Fulcrum is the pivot point?", opts: ["Yes", "No"], ok: 0, prompt: "Fulcrum?" },
      { q: "Gears can change turn direction?", opts: ["Yes", "No"], ok: 0, prompt: "Turn?" },
      { q: "Glue alone is a lever?", opts: ["No", "Yes"], ok: 0, prompt: "Glue?" },
      { q: "Longer effort arm can help lift?", opts: ["Yes", "No"], ok: 0, prompt: "Arm?" },
      { q: "Scissors are a double lever?", opts: ["Yes", "No"], ok: 0, prompt: "Scissors?" },
      { q: "Ramp alone is a gear?", opts: ["No", "Yes"], ok: 0, prompt: "Ramp?" }
    ],
    onDone: completeSub,
  });
}

function s10({ overlay, setCoach, completeSub }) {
  setCoach("Mastery - Lever Learner.");
  mountOrderSteps(overlay, {
    scene: "leverMastery", title: "Lever Learner Mastery", instructions: "Order your journey.",
    items: [{ id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" }, { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "win", html: "Win" }],
    correctIds: ["meet", "sort", "lab", "rule", "myth", "win"],
    onDone: () => mountTapContinue(overlay, {
      scene: "leverMastery", badge: LAB_ASSET_PATHS.m1,
      html: `<h3>\u2699\ufe0f Lever Learner!</h3><p>You can explain how levers and gears make jobs easier.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}
