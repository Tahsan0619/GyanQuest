/**
 * Electronics & Robotics - Mission 1: Sensor Bot (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
  mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
  mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L1_META = {
  objective: "By the end of this mission, you'll be able to explain sense act in your own words.",
  bdHook: "Bangladesh everyday: notice sense act around you — then connect it to Sensor Bot.",
  predict: {
    q: "Before we start — what do you think matters most in Sensor Bot?",
    options: [
      "Guessing without checking",
      "Looking for a clear pattern or rule",
      "Skipping the practice steps",
    ],
    ok: 1,
  },

  kidTitle: "Sensor Bot",
  theme: "sense act",
  emoji: "\ud83d\udce1",
  rewardName: "Bot Builder",
  intro: "Sensors sense, code decides, actuators act - that is the robot loop.",
  everyday: ["Line follower", "Bump-and-turn", "Auto door"],
  subTitles: [
    "Meet Sensor Bot", "Loop Dial Lab", "Sort Sense Decide Act", "Stronger Loop Lab",
    "Why the Bot Moves", "Name the Bot Rule", "Stretch: Places", "Myth Bust",
    "Fluency Drill", "Bot Builder Mastery",
  ],
};

export function runL1Sub(subIndex, api) {
  const { registerTryAgain } = api;
  labState.reveal = false; labState.tokenProgress = 0; labState.masteryStep = 0;
  labState.placed = {}; labState.selectedId = null; labState.mythPhase = "claim";
  labState.heat = 0.25; labState.phase = "desk"; labState.mode = "school";
  const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
  const fn = runners[subIndex] || runners[0];
  registerTryAgain(() => { api.overlay.innerHTML = ""; fn(api); });
  fn(api);
}

function s1({ overlay, setCoach, completeSub }) {
  setCoach("Hook: sense, decide, act.");
  mountMotionChain(overlay, {
    title: "Meet Sensor Bot",
    beats: [
      { scene: "botMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000, html: `${badgeHtml(LAB_ASSET_PATHS.m1, "bot")}<p><strong>Act 1:</strong> Sensors gather clues.</p>` },
      { scene: "botMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200, html: `<p><strong>Act 2:</strong> Code decides what to do.</p>` },
      { scene: "botMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000, html: `<p><strong>Act 3:</strong> Motors and LEDs act.</p>` }
    ],
    onDone: () => mountQuiz(overlay, {
      scene: "botMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
      q: "A robot loop in order is...",
      opts: ["Sense, then decide, then act", "Act forever with no sensors", "Only wishing", "Decide without any code idea"],
      ok: 0, onDone: () => mountTapContinue(overlay, {
        scene: "botMeet", badge: LAB_ASSET_PATHS.m1,
        html: `<h3>Ready</h3><p>Next: dial the robot loop.</p>`,
        onDone: completeSub, advanceAfterDone: true,
      }),
    }),
  });
}

function s2({ overlay, setCoach, completeSub }) {
  setCoach("Complete the sense-decide-act loop.");
  labState.heat = 0.25;
  mountHeatLab(overlay, {
    scene: "botLab", title: "Loop Dial Lab",
    html: `<p>Drag until loop &gt;= 60%.</p>`,
    goalText: "Goal >= 60%", doneLabel: "Dial checked", threshold: 0.6, startHeat: 0.25,
    axis: "x", canvasAction: "stretch", sliderLabel: "Loop", badge: LAB_ASSET_PATHS.m1,
    onDone: completeSub,
  });
}

function s3({ overlay, setCoach, completeSub }) {
  setCoach("Sort sense, decide, and act parts.");
  mountTapContinue(overlay, {
    scene: "botSort",
    html: `<h3>Guide</h3><p><strong>Sense:</strong> light, bump, mic.<br><strong>Decide:</strong> if/then code, choose path.<br><strong>Act:</strong> motor, servo, LED.</p>`,
    onDone: () => mountDragSort(overlay, {
      scene: "botSort", title: "Sort Sense Decide Act",
      instructions: "Drag into Sense / Decide / Act.",
      successText: "Bot parts sorted!",
      chips: [
        { id: "eye", text: "Light sensor", short: "Light", color: 0x38bdf8 },
        { id: "bump", text: "Bump sensor", short: "Bump", color: 0x22c55e },
        { id: "mic", text: "Mic sensor", short: "Mic", color: 0x4ade80 },
        { id: "code", text: "If/then code", short: "Code", color: 0xfbbf24 },
        { id: "plan", text: "Choose path", short: "Choose", color: 0xfb923c },
        { id: "motor", text: "Drive motor", short: "Motor", color: 0xf97316 },
        { id: "servo", text: "Arm servo", short: "Servo", color: 0xa78bfa },
        { id: "led", text: "LED output", short: "LED", color: 0xfde68a }
      ],
      zones: [
        { id: "sense", label: "Sense", accept: ["eye", "bump", "mic"] },
        { id: "decide", label: "Decide", accept: ["code", "plan"] },
        { id: "act", label: "Act", accept: ["motor", "servo", "led"] }
      ],
      onDone: completeSub,
    }),
  });
}

function s4({ overlay, setCoach, completeSub }) {
  setCoach("Push the loop further.");
  labState.heat = 0.4;
  mountHeatLab(overlay, {
    scene: "botLab", title: "Stronger Loop Lab", html: `<p>Reach &gt;= 75% loop.</p>`,
    goalText: "Goal >= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
    axis: "x", canvasAction: "stretch", sliderLabel: "Loop", badge: LAB_ASSET_PATHS.m1,
    onDone: completeSub,
  });
}

function s5({ overlay, setCoach, completeSub }) {
  setCoach("Order why the bot moves.");
  mountOrderSteps(overlay, {
    scene: "botMeet", sceneArgs: { phase: "settle" }, title: "Why the Bot Moves",
    instructions: "Order the story.",
    items: [{ id: "s", html: "Sensor reads the world" }, { id: "d", html: "Code decides the next move" }, { id: "a", html: "Motor or LED acts" }, { id: "r", html: "Loop repeats with new senses" }],
    correctIds: ["s", "d", "a", "r"],
    onDone: () => mountQuiz(overlay, {
      scene: "botMeet", title: "Check",
      q: "A motor without any sensing or deciding...",
      opts: ["Cannot respond smartly to the world", "Is always a complete robot loop", "Replaces all sensors", "Writes its own code"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s6({ overlay, setCoach, completeSub }) {
  setCoach("Lock the bot rule.");
  mountEquationBuild(overlay, {
    scene: "botRule", title: "Name the Bot Rule", instructions: "Tap in order.",
    tokens: [{ id: "a", html: "Sense" }, { id: "b", html: "->" }, { id: "c", html: "decide" }, { id: "d", html: "-> act" }],
    correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
    onDone: () => mountTapContinue(overlay, {
      scene: "botRule", badge: LAB_ASSET_PATHS.rule,
      html: `<h3>Rule locked</h3><p>Sense -> decide -> act.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}

function s7({ overlay, setCoach, completeSub }) {
  setCoach("Home vacuum, school kit, street lights, shop door, lab.");
  mountTapContinue(overlay, {
    scene: "botStretch", html: `<h3>Places</h3><p>Tap each place - same bot loop.</p>`,
    onDone: () => mountQuiz(overlay, {
      scene: "botStretch", title: "Transfer",
      q: "A line-follower mostly...",
      opts: ["Senses the line, decides, then drives", "Only wishes to stay on the line", "Acts with zero sensors forever", "Ignores all code"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s8({ overlay, setCoach, completeSub }) {
  setCoach("Bust robot myths.");
  mountMythCards(overlay, {
    scene: "botMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
    myths: [
      { claim: "Robots move with no sensing", truth: "Sensors feed data so the bot can decide", sceneMyth: 0 },
      { claim: "Code is optional decoration", truth: "Code decides what to do with sensor data", sceneMyth: 1 },
      { claim: "Motors sense the world alone", truth: "Motors act; sensors sense", sceneMyth: 2 },
      { claim: "Wishing hard steers the robot", truth: "Sense, decide, then act - not wishes", sceneMyth: 3 },
      { claim: "Only factory robots use this loop", truth: "School bots use sense-decide-act too", sceneMyth: 4 }
    ],
    onDone: completeSub,
  });
}

function s9({ overlay, setCoach, completeSub }) {
  setCoach("Quick bot fluency.");
  mountSpeedDrill(overlay, {
    scene: "botDrill", title: "Fluency Drill", passScene: "botMastery",
    items: [
      { q: "Sensors gather clues?", opts: ["Yes", "No"], ok: 0, prompt: "Sense?" },
      { q: "Code helps decide?", opts: ["Yes", "No"], ok: 0, prompt: "Decide?" },
      { q: "Motors are actuators?", opts: ["Yes", "No"], ok: 0, prompt: "Act?" },
      { q: "Wish alone steers the bot?", opts: ["No", "Yes"], ok: 0, prompt: "Wish?" },
      { q: "LED can be an act output?", opts: ["Yes", "No"], ok: 0, prompt: "LED?" },
      { q: "Bump sensor is an actuator?", opts: ["No", "Yes"], ok: 0, prompt: "Bump?" }
    ],
    onDone: completeSub,
  });
}

function s10({ overlay, setCoach, completeSub }) {
  setCoach("Mastery - Bot Builder.");
  mountOrderSteps(overlay, {
    scene: "botMastery", title: "Bot Builder Mastery", instructions: "Order your journey.",
    items: [{ id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" }, { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "win", html: "Win" }],
    correctIds: ["meet", "sort", "lab", "rule", "myth", "win"],
    onDone: () => mountTapContinue(overlay, {
      scene: "botMastery", badge: LAB_ASSET_PATHS.m1,
      html: `<h3>\ud83d\udce1 Bot Builder!</h3><p>You can explain the sense-decide-act robot loop.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}
