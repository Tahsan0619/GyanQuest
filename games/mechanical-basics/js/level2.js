/**
 * Mechanical Basics - Mission 2: Motion Machines (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
  mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
  mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L2_META = {
  objective: "By the end of this mission, you'll be able to explain motion transfer in your own words.",
  bdHook: "Bangladesh everyday: notice motion transfer around you — then connect it to Motion Machines.",
  predict: {
    q: "Before we start — what do you think matters most in Motion Machines?",
    options: [
      "Guessing without checking",
      "Looking for a clear pattern or rule",
      "Skipping the practice steps",
    ],
    ok: 1,
  },

  kidTitle: "Motion Machines",
  theme: "motion transfer",
  emoji: "\ud83d\udeb2",
  rewardName: "Motion Scout",
  intro: "Wheels, belts, and chains pass motion along a linked path.",
  everyday: ["Bike chain", "Fan belt", "Conveyor"],
  subTitles: [
    "Meet Motion Links", "Belt Dial Lab", "Sort Transfer Parts", "Tighter Transfer",
    "Why Motion Passes", "Name the Transfer Rule", "Stretch: Places", "Myth Bust",
    "Fluency Drill", "Motion Scout Mastery",
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
  setCoach("Hook: wheels and belts pass motion.");
  mountMotionChain(overlay, {
    title: "Meet Motion Links",
    beats: [
      { scene: "motionMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000, html: `${badgeHtml(LAB_ASSET_PATHS.m2, "motion")}<p><strong>Act 1:</strong> Drag two wheels and find the belt.</p>` },
      { scene: "motionMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200, html: `<p><strong>Act 2:</strong> Tight link - both wheels spin together.</p>` },
      { scene: "motionMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000, html: `<p><strong>Act 3:</strong> Linked parts transfer motion along a path.</p>` }
    ],
    onDone: () => mountQuiz(overlay, {
      scene: "motionMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
      q: "Motion transfers best when...",
      opts: ["Parts are linked (belt/chain/axle)", "Everything is glued into one rock", "The belt is always broken", "You remove all wheels"],
      ok: 0, onDone: () => mountTapContinue(overlay, {
        scene: "motionMeet", badge: LAB_ASSET_PATHS.m2,
        html: `<h3>Ready</h3><p>Next: tighten the belt lab.</p>`,
        onDone: completeSub, advanceAfterDone: true,
      }),
    }),
  });
}

function s2({ overlay, setCoach, completeSub }) {
  setCoach("Tighten until transfer is strong.");
  labState.heat = 0.25;
  mountHeatLab(overlay, {
    scene: "motionLab", title: "Belt Dial Lab",
    html: `<p>Drag until transfer &gt;= 60%.</p>`,
    goalText: "Goal >= 60%", doneLabel: "Dial checked", threshold: 0.6, startHeat: 0.25,
    axis: "x", canvasAction: "stretch", sliderLabel: "Transfer", badge: LAB_ASSET_PATHS.m2,
    onDone: completeSub,
  });
}

function s3({ overlay, setCoach, completeSub }) {
  setCoach("Sort transfer, block, or neither.");
  mountTapContinue(overlay, {
    scene: "motionSort",
    html: `<h3>Guide</h3><p><strong>Transfer:</strong> belt, chain, wheel+axle, pulley.<br><strong>Block:</strong> brake, jammed belt.<br><strong>Neither:</strong> loose rock, glue blob.</p>`,
    onDone: () => mountDragSort(overlay, {
      scene: "motionSort", title: "Sort Transfer Parts",
      instructions: "Drag into Transfers / Blocks / Neither.",
      successText: "Motion parts sorted!",
      chips: [
        { id: "belt", text: "Belt drive", short: "Belt", color: 0xfbbf24 },
        { id: "chain", text: "Bike chain", short: "Chain", color: 0x22c55e },
        { id: "axle", text: "Wheel + axle", short: "Axle", color: 0x38bdf8 },
        { id: "pulley", text: "Pulley", short: "Pulley", color: 0xa78bfa },
        { id: "brake", text: "Brake lock", short: "Brake", color: 0xef4444 },
        { id: "jam", text: "Jammed belt", short: "Jam", color: 0xf97316 },
        { id: "rock", text: "Loose rock", short: "Rock", color: 0x94a3b8 },
        { id: "glue", text: "Glue blob", short: "Glue", color: 0x78716c }
      ],
      zones: [
        { id: "xfer", label: "Transfers motion", accept: ["belt", "chain", "axle", "pulley"] },
        { id: "block", label: "Blocks motion", accept: ["brake", "jam"] },
        { id: "neither", label: "Not a machine link", accept: ["rock", "glue"] }
      ],
      onDone: completeSub,
    }),
  });
}

function s4({ overlay, setCoach, completeSub }) {
  setCoach("Push transfer higher.");
  labState.heat = 0.4;
  mountHeatLab(overlay, {
    scene: "motionLab", title: "Tighter Transfer", html: `<p>Reach &gt;= 75% transfer.</p>`,
    goalText: "Goal >= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
    axis: "x", canvasAction: "stretch", sliderLabel: "Transfer", badge: LAB_ASSET_PATHS.m2,
    onDone: completeSub,
  });
}

function s5({ overlay, setCoach, completeSub }) {
  setCoach("Order how motion passes.");
  mountOrderSteps(overlay, {
    scene: "motionMeet", sceneArgs: { phase: "settle" }, title: "Why Motion Passes",
    instructions: "Order the story.",
    items: [{ id: "spin", html: "First wheel spins" }, { id: "link", html: "Belt or chain links the wheels" }, { id: "pass", html: "Second wheel receives the motion" }, { id: "block", html: "Brake or jam can stop the path" }],
    correctIds: ["spin", "link", "pass", "block"],
    onDone: () => mountQuiz(overlay, {
      scene: "motionMeet", title: "Check",
      q: "A loose slipping belt usually...",
      opts: ["Fails to transfer motion well", "Adds infinite speed", "Creates a lever fulcrum", "Removes gravity"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s6({ overlay, setCoach, completeSub }) {
  setCoach("Lock the transfer rule.");
  mountEquationBuild(overlay, {
    scene: "motionRule", title: "Name the Transfer Rule", instructions: "Tap in order.",
    tokens: [{ id: "a", html: "Linked" }, { id: "b", html: "parts" }, { id: "c", html: "transfer" }, { id: "d", html: "motion" }],
    correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
    onDone: () => mountTapContinue(overlay, {
      scene: "motionRule", badge: LAB_ASSET_PATHS.rule,
      html: `<h3>Rule locked</h3><p>Linked parts transfer motion along the path.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}

function s7({ overlay, setCoach, completeSub }) {
  setCoach("Fan belt, school kit, rickshaw, conveyor, lab.");
  mountTapContinue(overlay, {
    scene: "motionStretch", html: `<h3>Places</h3><p>Tap each place - same transfer idea.</p>`,
    onDone: () => mountQuiz(overlay, {
      scene: "motionStretch", title: "Transfer",
      q: "A bike chain's job is to...",
      opts: ["Pass pedal motion to the wheel", "Only decorate the frame", "Block all spinning forever", "Replace the rider"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s8({ overlay, setCoach, completeSub }) {
  setCoach("Bust motion myths.");
  mountMythCards(overlay, {
    scene: "motionMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
    myths: [
      { claim: "Wheels only look round for fun", truth: "Wheels and axles cut friction and carry motion", sceneMyth: 0 },
      { claim: "A belt never needs to be tight", truth: "Loose belts slip - motion fails to transfer", sceneMyth: 1 },
      { claim: "Brakes add motion to the chain", truth: "Brakes block or slow motion on purpose", sceneMyth: 2 },
      { claim: "Only engines create linked motion", truth: "Belts, chains, and pulleys pass motion along", sceneMyth: 3 },
      { claim: "A jammed belt still transfers perfectly", truth: "A jam blocks the path - fix the link", sceneMyth: 4 }
    ],
    onDone: completeSub,
  });
}

function s9({ overlay, setCoach, completeSub }) {
  setCoach("Quick motion fluency.");
  mountSpeedDrill(overlay, {
    scene: "motionDrill", title: "Fluency Drill", passScene: "motionMastery",
    items: [
      { q: "Belt can transfer spin?", opts: ["Yes", "No"], ok: 0, prompt: "Belt?" },
      { q: "Brake locks motion?", opts: ["Yes", "No"], ok: 0, prompt: "Brake?" },
      { q: "Loose rock is a drive link?", opts: ["No", "Yes"], ok: 0, prompt: "Rock?" },
      { q: "Chain links pedals to wheel?", opts: ["Yes", "No"], ok: 0, prompt: "Chain?" },
      { q: "Jam helps transfer?", opts: ["No", "Yes"], ok: 0, prompt: "Jam?" },
      { q: "Pulley can redirect a rope?", opts: ["Yes", "No"], ok: 0, prompt: "Pulley?" }
    ],
    onDone: completeSub,
  });
}

function s10({ overlay, setCoach, completeSub }) {
  setCoach("Mastery - Motion Scout.");
  mountOrderSteps(overlay, {
    scene: "motionMastery", title: "Motion Scout Mastery", instructions: "Order your journey.",
    items: [{ id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" }, { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "win", html: "Win" }],
    correctIds: ["meet", "sort", "lab", "rule", "myth", "win"],
    onDone: () => mountTapContinue(overlay, {
      scene: "motionMastery", badge: LAB_ASSET_PATHS.m2,
      html: `<h3>\ud83d\udeb2 Motion Scout!</h3><p>You can explain how linked parts pass motion along.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}
