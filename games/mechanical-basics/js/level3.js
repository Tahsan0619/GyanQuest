/**
 * Mechanical Basics - Mission 3: Forces at Work (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
  mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
  mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L3_META = {
  objective: "By the end of this mission, you'll be able to explain force & work in your own words.",
  bdHook: "Bangladesh everyday: notice force & work around you — then connect it to Forces at Work.",
  predict: {
    q: "Before we start — what do you think matters most in Forces at Work?",
    options: [
      "Guessing without checking",
      "Looking for a clear pattern or rule",
      "Skipping the practice steps",
    ],
    ok: 1,
  },

  kidTitle: "Forces at Work",
  theme: "force & work",
  emoji: "\ud83c\udfcb\ufe0f",
  rewardName: "Work Warrior",
  intro: "Work happens when a force moves something through a distance.",
  everyday: ["Push a crate", "Lift a bag", "Pull a wagon"],
  subTitles: [
    "Meet Force & Work", "Work Dial Lab", "Sort Work Cases", "Bigger Work Lab",
    "Why Work Happens", "Name the Work Rule", "Stretch: Places", "Myth Bust",
    "Fluency Drill", "Work Warrior Mastery",
  ],
};

export function runL3Sub(subIndex, api) {
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
  setCoach("Hook: force through a distance does work.");
  mountMotionChain(overlay, {
    title: "Meet Force & Work",
    beats: [
      { scene: "workMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000, html: `${badgeHtml(LAB_ASSET_PATHS.m3, "work")}<p><strong>Act 1:</strong> Force arrow meets a crate.</p>` },
      { scene: "workMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200, html: `<p><strong>Act 2:</strong> Crate moves a distance - that is work.</p>` },
      { scene: "workMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000, html: `<p><strong>Act 3:</strong> Force with no move (like a wall) is not work.</p>` }
    ],
    onDone: () => mountQuiz(overlay, {
      scene: "workMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
      q: "Mechanical work needs...",
      opts: ["Force and distance in that direction", "Only thinking hard", "Force with zero distance always", "A battery only"],
      ok: 0, onDone: () => mountTapContinue(overlay, {
        scene: "workMeet", badge: LAB_ASSET_PATHS.m3,
        html: `<h3>Ready</h3><p>Next: dial force x distance.</p>`,
        onDone: completeSub, advanceAfterDone: true,
      }),
    }),
  });
}

function s2({ overlay, setCoach, completeSub }) {
  setCoach("Grow work until the crate travels.");
  labState.heat = 0.25;
  mountHeatLab(overlay, {
    scene: "workLab", title: "Work Dial Lab",
    html: `<p>Drag until work &gt;= 60%.</p>`,
    goalText: "Goal >= 60%", doneLabel: "Dial checked", threshold: 0.6, startHeat: 0.25,
    axis: "x", canvasAction: "stretch", sliderLabel: "Work", badge: LAB_ASSET_PATHS.m3,
    onDone: completeSub,
  });
}

function s3({ overlay, setCoach, completeSub }) {
  setCoach("Sort work, force-only, or neither.");
  mountTapContinue(overlay, {
    scene: "workSort",
    html: `<h3>Guide</h3><p><strong>Work:</strong> push/lift/pull/slide a distance.<br><strong>Force, no work:</strong> push wall, hold still.<br><strong>Neither:</strong> sitting, only thinking.</p>`,
    onDone: () => mountDragSort(overlay, {
      scene: "workSort", title: "Sort Work Cases",
      instructions: "Drag into Does work / Force no work / Neither.",
      successText: "Work cases sorted!",
      chips: [
        { id: "push", text: "Push crate far", short: "Push far", color: 0x22c55e },
        { id: "lift", text: "Lift bag up", short: "Lift", color: 0x38bdf8 },
        { id: "pull", text: "Pull wagon", short: "Pull", color: 0xfbbf24 },
        { id: "wall", text: "Push wall", short: "Wall", color: 0xf97316 },
        { id: "hold", text: "Hold still", short: "Hold", color: 0xa78bfa },
        { id: "sit", text: "Sit resting", short: "Sit", color: 0x94a3b8 },
        { id: "dream", text: "Just thinking", short: "Think", color: 0x78716c },
        { id: "slide", text: "Slide box", short: "Slide", color: 0x4ade80 }
      ],
      zones: [
        { id: "work", label: "Does work", accept: ["push", "lift", "pull", "slide"] },
        { id: "force", label: "Force, no work", accept: ["wall", "hold"] },
        { id: "none", label: "Neither", accept: ["sit", "dream"] }
      ],
      onDone: completeSub,
    }),
  });
}

function s4({ overlay, setCoach, completeSub }) {
  setCoach("Push work higher.");
  labState.heat = 0.4;
  mountHeatLab(overlay, {
    scene: "workLab", title: "Bigger Work Lab", html: `<p>Reach &gt;= 75% work.</p>`,
    goalText: "Goal >= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
    axis: "x", canvasAction: "stretch", sliderLabel: "Work", badge: LAB_ASSET_PATHS.m3,
    onDone: completeSub,
  });
}

function s5({ overlay, setCoach, completeSub }) {
  setCoach("Order why work happens.");
  mountOrderSteps(overlay, {
    scene: "workMeet", sceneArgs: { phase: "settle" }, title: "Why Work Happens",
    instructions: "Order the story.",
    items: [{ id: "f", html: "Apply a force" }, { id: "d", html: "Object moves a distance" }, { id: "w", html: "Work = force x distance" }, { id: "z", html: "Zero distance means ~zero work" }],
    correctIds: ["f", "d", "w", "z"],
    onDone: () => mountQuiz(overlay, {
      scene: "workMeet", title: "Check",
      q: "Holding a heavy bag still means...",
      opts: ["Force yes, mechanical work ~0", "Infinite work always", "Distance without force", "No force at all"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s6({ overlay, setCoach, completeSub }) {
  setCoach("Lock the work rule.");
  mountEquationBuild(overlay, {
    scene: "workRule", title: "Name the Work Rule", instructions: "Tap in order.",
    tokens: [{ id: "a", html: "Work" }, { id: "b", html: "=" }, { id: "c", html: "force" }, { id: "d", html: "x distance" }],
    correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
    onDone: () => mountTapContinue(overlay, {
      scene: "workRule", badge: LAB_ASSET_PATHS.rule,
      html: `<h3>Rule locked</h3><p>Work = force x distance (same direction).</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}

function s7({ overlay, setCoach, completeSub }) {
  setCoach("Bags, desks, rickshaw, shop crates, lab.");
  mountTapContinue(overlay, {
    scene: "workStretch", html: `<h3>Places</h3><p>Tap each place - same work idea.</p>`,
    onDone: () => mountQuiz(overlay, {
      scene: "workStretch", title: "Transfer",
      q: "Carrying groceries up stairs is work because...",
      opts: ["You apply force through a height distance", "You only sit on the sofa", "The bags never move", "Thinking lifts them"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s8({ overlay, setCoach, completeSub }) {
  setCoach("Bust work myths.");
  mountMythCards(overlay, {
    scene: "workMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
    myths: [
      { claim: "Any push is always work", truth: "Work needs force AND distance in that direction", sceneMyth: 0 },
      { claim: "Holding a bag still does lots of work", truth: "No distance moved = no mechanical work", sceneMyth: 1 },
      { claim: "Pushing a wall hard moves it for you", truth: "If the wall does not move, work is ~0", sceneMyth: 2 },
      { claim: "Only huge machines do work", truth: "Kids do work lifting bags and sliding boxes", sceneMyth: 3 },
      { claim: "Distance does not matter for work", truth: "Work = force x distance", sceneMyth: 4 }
    ],
    onDone: completeSub,
  });
}

function s9({ overlay, setCoach, completeSub }) {
  setCoach("Quick work fluency.");
  mountSpeedDrill(overlay, {
    scene: "workDrill", title: "Fluency Drill", passScene: "workMastery",
    items: [
      { q: "Work needs distance?", opts: ["Yes", "No"], ok: 0, prompt: "Distance?" },
      { q: "Push wall (no move) = work?", opts: ["No", "Yes"], ok: 0, prompt: "Wall?" },
      { q: "Lift bag up = work?", opts: ["Yes", "No"], ok: 0, prompt: "Lift?" },
      { q: "W = F x d?", opts: ["Yes", "No"], ok: 0, prompt: "Formula?" },
      { q: "Only thinking does work?", opts: ["No", "Yes"], ok: 0, prompt: "Think?" },
      { q: "Slide box across floor = work?", opts: ["Yes", "No"], ok: 0, prompt: "Slide?" }
    ],
    onDone: completeSub,
  });
}

function s10({ overlay, setCoach, completeSub }) {
  setCoach("Mastery - Work Warrior.");
  mountOrderSteps(overlay, {
    scene: "workMastery", title: "Work Warrior Mastery", instructions: "Order your journey.",
    items: [{ id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" }, { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "win", html: "Win" }],
    correctIds: ["meet", "sort", "lab", "rule", "myth", "win"],
    onDone: () => mountTapContinue(overlay, {
      scene: "workMastery", badge: LAB_ASSET_PATHS.m3,
      html: `<h3>\ud83c\udfcb\ufe0f Work Warrior!</h3><p>You can explain work as force through a distance.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}
