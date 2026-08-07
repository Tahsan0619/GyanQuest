/**
 * Force Fighter - Mission 2: Push Power (Newton 2 / F = m / a)
 */
import { forceLabState, FORCE_ASSET_PATHS } from "./force-state.js";
import {
  mountMotionChain,
  mountDragSort,
  mountHeatLab,
  mountEquationBuild,
  mountQuiz,
  mountSpeedDrill,
  mountMythCards,
  mountTapContinue,
  mountOrderSteps,
  badgeHtml,
} from "./force-activities.js";

export const L2_META = {
  objective: "By the end of this mission, you'll be able to explain F = m / a / Newton 2 in your own words.",
  bdHook: "Bangladesh everyday: notice F = m / a / Newton 2 around you — then connect it to Push Power.",
  predict: {
    q: "Before we start — what do you think matters most in Push Power?",
    options: [
      "Guessing without checking",
      "Looking for a clear pattern or rule",
      "Skipping the practice steps",
    ],
    ok: 1,
  },

  kidTitle: "Push Power",
  theme: "F = m / a / Newton 2",
  emoji: "🏎️",
  rewardName: "Speed Star",
  intro: "A small push moves light things faster. A heavy thing needs a bigger push to get going!",
  everyday: ["Kicking a light ball vs rolling a heavy drum", "Pushing a chair vs a sofa"],
  subTitles: [
    "Meet Push Power",
    "Watch F, m, a",
    "Sort: Force  /  Mass  /  Accel",
    "Crate Push Lab",
    "Live F = m / a Sim",
    "Name the Second Law",
    "Stretch: New Contexts",
    "Myth Bust",
    "Number Drill",
    "Push Power Mastery",
  ],
};

export function runL2Sub(subIndex, api) {
  const { registerTryAgain } = api;
  forceLabState.reveal = false;
  forceLabState.tokenProgress = 0;
  forceLabState.masteryStep = 0;
  forceLabState.placed = {};
  forceLabState.selectedId = null;
  forceLabState.mythPhase = "claim";
  forceLabState.raceDone = false;
  forceLabState.pushForce = 0.35;
  forceLabState.massKg = 100;
  forceLabState.heat = 0.35;
  forceLabState.phase = "race";
  forceLabState.mode = "truck";

  const runners = [
    sub1_meet,
    sub2_watch,
    sub3_sort,
    sub4_crate,
    sub5_sim,
    sub6_rule,
    sub7_stretch,
    sub8_myths,
    sub9_drill,
    sub10_mastery,
  ];
  const fn = runners[subIndex] || runners[0];
  registerTryAgain(() => {
    api.overlay.innerHTML = "";
    fn(api);
  });
  fn(api);
}

function sub1_meet({ overlay, setCoach, completeSub }) {
  setCoach("Hook: same push - light car accelerates more than the heavy tank.");
  mountMotionChain(overlay, {
    title: "Meet Push Power",
    beats: [
      {
        scene: "pushMeet",
        sceneArgs: { phase: "predict" },
        dwellMs: 4000,
        html: `${badgeHtml(FORCE_ASSET_PATHS.push, "push")}
          <p><strong>Act 1:</strong> Predict - same force on sports car vs tank. Who gains speed faster?</p>`,
      },
      {
        scene: "pushMeet",
        sceneArgs: { phase: "race" },
        dwellMs: 4800,
        html: `<p><strong>Act 2:</strong> Tap GO. Same push - smaller mass means bigger acceleration.</p>`,
      },
      {
        scene: "pushMeet",
        sceneArgs: { phase: "idea" },
        dwellMs: 4000,
        html: `<p><strong>Act 3:</strong> Big idea - <strong>a = F / m</strong> (or F = m  /  a).</p>`,
      },
    ],
    onDone: () => {
      mountQuiz(overlay, {
        scene: "pushMeet",
        sceneArgs: { phase: "idea" },
        title: "Exit check",
        q: "Same force, less mass -> acceleration...",
        opts: ["Increases", "Decreases", "Stays identical always", "Becomes zero"],
        ok: 0,
        onDone: completeSub,
      });
    },
  });
}

function sub2_watch({ overlay, setCoach, completeSub }) {
  setCoach("Watch the three pieces: Force, Mass, Acceleration.");
  mountTapContinue(overlay, {
    scene: "pushSim",
    badge: FORCE_ASSET_PATHS.race,
    html: `<h3>F, m, and a</h3>
      <p><strong>F</strong> - how hard you push (newtons).</p>
      <p><strong>m</strong> - how much stuff (kilograms).</p>
      <p><strong>a</strong> - how quickly velocity changes (m/s²).</p>
      <p>They link as <strong>F = m  /  a</strong>.</p>`,
    onDone: completeSub,
  });
}

function sub3_sort({ overlay, setCoach, completeSub }) {
  setCoach("Sort chips into Force, Mass, or Acceleration bins.");
  mountDragSort(overlay, {
    scene: "pushSort",
    title: "Sort F  /  m  /  a",
    instructions: "Drag into Force, Mass, or Acceleration.",
    successText: "Nice sort - F, m, and a!",
    chips: [
      { id: "f1", text: "Push hard", short: "Push", color: 0xf97316 },
      { id: "f2", text: "Shove (N)", short: "Force", color: 0xfb923c },
      { id: "m1", text: "Heavy crate", short: "Mass", color: 0x94a3b8 },
      { id: "m2", text: "kg amount", short: "kg", color: 0xa8a29e },
      { id: "a1", text: "Speeds up", short: "a↑", color: 0x38bdf8 },
      { id: "a2", text: "m/s²", short: "m/s²", color: 0x0ea5e9 },
      { id: "f3", text: "Net force", short: "Fnet", color: 0xfbbf24 },
      { id: "a3", text: "Slows down", short: "a↓", color: 0x67e8f9 },
    ],
    zones: [
      { id: "force", label: "Force F", accept: ["f1", "f2", "f3"] },
      { id: "mass", label: "Mass m", accept: ["m1", "m2"] },
      { id: "accel", label: "Accel a", accept: ["a1", "a2", "a3"] },
    ],
    onDone: () => {
      forceLabState.reveal = true;
      mountQuiz(overlay, {
        scene: "pushSort",
        title: "Check",
        q: "m/s² is a unit of...",
        opts: ["Acceleration", "Mass only", "Force only", "Temperature"],
        ok: 0,
        onDone: completeSub,
      });
    },
  });
}

function sub4_crate({ overlay, setCoach, completeSub }) {
  setCoach("Try: 100 kg needs less force than 400 kg for the same a.");
  forceLabState.massKg = 100;
  forceLabState.heat = 0.25;
  mountHeatLab(overlay, {
    scene: "pushCrate",
    title: "Crate Push Lab",
    html: `<p>Drag the force handle. Readout shows F and a for the crate mass.</p>
      <p>Tip: heavier mass -> smaller a for the same F.</p>`,
    goalText: "Goal: push ≥ 75%.",
    doneLabel: "Crate pushed ▶",
    threshold: 0.75,
    startHeat: 0.25,
    axis: "x",
    canvasAction: "stretch",
    sliderLabel: "Push force",
    syncKey: "pushForce",
    readoutLabels: {
      cold: "Gentle push",
      melting: "Medium push",
      liquid: "Strong push",
      simmer: "Max push - watch a!",
    },
    badge: FORCE_ASSET_PATHS.push,
    onDone: () => {
      mountQuiz(overlay, {
        scene: "pushCrate",
        title: "Check",
        q: "100 kg @ 5 m/s² needs about...",
        opts: ["500 N", "5 N", "100 N", "0 N"],
        ok: 0,
        onDone: completeSub,
      });
    },
  });
}

function sub5_sim({ overlay, setCoach, completeSub }) {
  setCoach("Live sim: tap mass chips and drag force - a = F/m.");
  forceLabState.massKg = 100;
  forceLabState.heat = 0.4;
  mountHeatLab(overlay, {
    scene: "pushSim",
    title: "Live F = m / a",
    html: `<p>Drag force on the canvas. Tap 100 / 400 / 800 kg. Watch a update.</p>`,
    goalText: "Goal: force slider ≥ 70%.",
    doneLabel: "Sim done ▶",
    threshold: 0.7,
    startHeat: 0.4,
    axis: "x",
    canvasAction: "stretch",
    sliderLabel: "Force",
    syncKey: "pushForce",
    readoutLabels: {
      cold: "Small F",
      melting: "Building F...",
      liquid: "Strong F",
      simmer: "Peak F - a = F/m",
    },
    badge: FORCE_ASSET_PATHS.race,
    onDone: completeSub,
  });
}

function sub6_rule({ overlay, setCoach, completeSub }) {
  setCoach("Build F = m  /  a.");
  mountEquationBuild(overlay, {
    scene: "pushRule",
    title: "Build the second-law rule",
    instructions: "Tap tokens in order: F = m  /  a",
    badge: FORCE_ASSET_PATHS.rule,
    tokens: [
      { id: "f", html: "F" },
      { id: "eq", html: "=" },
      { id: "m", html: "m" },
      { id: "dot", html: " / " },
      { id: "a", html: "a" },
    ],
    correctIds: ["f", "eq", "m", "dot", "a"],
    onDone: () => {
      mountQuiz(overlay, {
        scene: "pushRule",
        title: "Which is the 2nd law?",
        q: "Best statement?",
        opts: [
          "Net force equals mass times acceleration",
          "Objects never move",
          "Forces only come in pairs (that’s 3rd)",
          "Rest means no forces exist",
        ],
        ok: 0,
        onDone: completeSub,
      });
    },
  });
}

function sub7_stretch({ overlay, setCoach, completeSub }) {
  setCoach("Stretch: truck, bike, sofa, rocket, elevator.");
  const modes = [
    { mode: "truck", title: "Truck", blurb: "More mass -> smaller a for same F." },
    { mode: "bike", title: "Bike", blurb: "Light - same kick, bigger a." },
    { mode: "sofa", title: "Sofa", blurb: "Heavy furniture needs bigger push." },
    { mode: "rocket", title: "Rocket", blurb: "Huge thrust -> huge a." },
    { mode: "elevator", title: "Elevator", blurb: "Net F changes how fast you accelerate." },
  ];
  let i = 0;
  function step() {
    if (i >= modes.length) {
      mountQuiz(overlay, {
        scene: "pushStretch",
        title: "Transfer",
        q: "Loaded truck climbs slower with the same engine force mainly because...",
        opts: ["More mass -> less acceleration", "Gravity turned off", "Force became infinite", "Mass became zero"],
        ok: 0,
        onDone: completeSub,
      });
      return;
    }
    const m = modes[i++];
    forceLabState.mode = m.mode;
    mountTapContinue(overlay, {
      scene: "pushStretch",
      html: `<h3>${m.title}</h3><p>${m.blurb}</p>`,
      onDone: step,
    });
  }
  step();
}

function sub8_myths({ overlay, setCoach, completeSub }) {
  setCoach("Bust F=ma myths.");
  mountMythCards(overlay, {
    scene: "pushMyth",
    title: "Push myths",
    myths: [
      { title: "Heavy always", claim: "Heavier things always need more force to move at all.", truth: "Any net F accelerates; heavier just gets smaller a for the same F.", sceneMyth: 0 },
      { title: "Force = speed", claim: "Force is the same as speed.", truth: "Force changes velocity; speed is not force.", sceneMyth: 1 },
      { title: "Add myth", claim: "F = m + a", truth: "F = m  /  a (multiply).", sceneMyth: 2 },
      { title: "Zero F", claim: "Zero force means zero velocity.", truth: "Zero net force means constant velocity (including rest).", sceneMyth: 3 },
      { title: "Rockets only", claim: "Only rockets use F=ma.", truth: "Every net force and mass pair follows it.", sceneMyth: 4 },
    ],
    onDone: completeSub,
  });
}

function sub9_drill({ overlay, setCoach, completeSub }) {
  setCoach("Numbers: 150 kg × 4 m/s² -> 600 N; double F -> double a.");
  mountSpeedDrill(overlay, {
    scene: "pushDrill",
    title: "Number drill",
    items: [
      { q: "150 kg × 4 m/s² -> F = ?", opts: ["600 N", "154 N", "37.5 N", "0 N"], ok: 0, prompt: "F = m / a" },
      { q: "Double F, same m -> a...", opts: ["Doubles", "Halves", "Unchanged", "Becomes zero"], ok: 0, prompt: "Scale a" },
      { q: "1 N equals...", opts: ["1 kg / m/s²", "1 kg only", "1 m/s only", "1 watt"], ok: 0, prompt: "Unit" },
    ],
    onDone: completeSub,
  });
}

function sub10_mastery({ overlay, setCoach, completeSub }) {
  setCoach("Mastery - claim Speed Star.");
  forceLabState.masteryStep = 5;
  mountOrderSteps(overlay, {
    scene: "pushMastery",
    title: "Build the story",
    instructions: "Order the second-law story.",
    items: [
      { id: "s1", html: "Apply net force F" },
      { id: "s2", html: "Object has mass m" },
      { id: "s3", html: "Acceleration a = F/m" },
      { id: "s4", html: "Velocity changes" },
    ],
    correctIds: ["s1", "s2", "s3", "s4"],
    onDone: () => {
      forceLabState.masteryStep = 6;
      mountQuiz(overlay, {
        scene: "pushMastery",
        title: "Mastery",
        q: "Double the force on the same mass. Acceleration...",
        opts: ["Doubles", "Halves", "Squares", "Disappears"],
        ok: 0,
        onDone: completeSub,
      });
    },
  });
}
