/**
 * Force Fighter - Mission 3: Push & Pull Pairs (Newton 3)
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

export const L3_META = {
  objective: "By the end of this mission, you'll be able to explain Newton 3 / pairs in your own words.",
  bdHook: "Bangladesh everyday: notice Newton 3 / pairs around you — then connect it to Push & Pull Pairs.",
  predict: {
    q: "Before we start — what do you think matters most in Push & Pull Pairs?",
    options: [
      "Guessing without checking",
      "Looking for a clear pattern or rule",
      "Skipping the practice steps",
    ],
    ok: 1,
  },

  kidTitle: "Push & Pull Pairs",
  theme: "Newton 3 / pairs",
  emoji: "🤝",
  rewardName: "Team Force",
  intro: "When you push, something pushes back! Pull a rope and the rope pulls you too.",
  everyday: ["Pulling a rope in tug-of-war", "Walking - you push the ground, it pushes you back"],
  subTitles: [
    "Meet Force Pairs",
    "Watch the Pair",
    "Sort: Action  /  Reaction",
    "Rocket Pair Lab",
    "Rope Scale Lab",
    "Walking Pairs",
    "Name the Pair Rule",
    "Stretch: New Contexts",
    "Myth Bust",
    "Pairs Mastery",
  ],
};

export function runL3Sub(subIndex, api) {
  const { registerTryAgain } = api;
  forceLabState.reveal = false;
  forceLabState.tokenProgress = 0;
  forceLabState.masteryStep = 0;
  forceLabState.placed = {};
  forceLabState.selectedId = null;
  forceLabState.mythPhase = "claim";
  forceLabState.recoil = 0;
  forceLabState.ropeT = 0.5;
  forceLabState.walkStep = 0;
  forceLabState.heat = 0.2;
  forceLabState.phase = "desk";
  forceLabState.mode = "balloon";

  const runners = [
    sub1_meet,
    sub2_watch,
    sub3_sort,
    sub4_rocket,
    sub5_rope,
    sub6_walk,
    sub7_rule,
    sub8_stretch,
    sub9_myths,
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
  setCoach("Hook: shove apart - equal and opposite pair forces.");
  mountMotionChain(overlay, {
    title: "Meet Force Pairs",
    beats: [
      {
        scene: "pairMeet",
        sceneArgs: { phase: "desk" },
        dwellMs: 4000,
        html: `${badgeHtml(FORCE_ASSET_PATHS.pair, "pairs")}
          <p><strong>Act 1:</strong> Tap PUSH - skaters shove apart.</p>`,
      },
      {
        scene: "pairMeet",
        sceneArgs: { phase: "pair" },
        dwellMs: 4200,
        html: `<p><strong>Act 2:</strong> Arrows are equal size, opposite directions.</p>`,
      },
      {
        scene: "pairMeet",
        sceneArgs: { phase: "glow" },
        dwellMs: 4000,
        html: `<p><strong>Act 3:</strong> One interaction - two forces (action & reaction).</p>`,
      },
      {
        scene: "pairMeet",
        sceneArgs: { phase: "settle" },
        dwellMs: 3600,
        html: `<p><strong>Act 4:</strong> Every push has a partner push back.</p>`,
      },
    ],
    onDone: () => {
      mountQuiz(overlay, {
        scene: "pairMeet",
        sceneArgs: { phase: "settle" },
        title: "Exit check",
        q: "When two skaters push apart, the forces between them are...",
        opts: [
          "Equal size, opposite direction",
          "Bigger on the lighter skater only",
          "Zero while touching",
          "Only gravity",
        ],
        ok: 0,
        onDone: completeSub,
      });
    },
  });
}

function sub2_watch({ overlay, setCoach, completeSub }) {
  setCoach("Watch: rower - oar pushes water, water pushes boat forward.");
  mountTapContinue(overlay, {
    scene: "pairStretch",
    html: `<h3>Rower pair</h3>
      <p>Tap <strong>rower</strong> on the canvas.</p>
      <p>Oar pushes water backward  /  water pushes boat forward - a pair.</p>`,
    onDone: () => {
      forceLabState.mode = "rower";
      mountQuiz(overlay, {
        scene: "pairStretch",
        title: "Check",
        q: "The water’s push on the boat is best called the...",
        opts: ["Reaction partner of the oar’s push on water", "Proof forces cancel on one object", "Source of new mass", "Only friction myth"],
        ok: 0,
        onDone: completeSub,
      });
    },
  });
}

function sub3_sort({ overlay, setCoach, completeSub }) {
  setCoach("Sort Action / Reaction / Interaction.");
  mountDragSort(overlay, {
    scene: "pairSort",
    title: "Sort pair stories",
    instructions: "Drag into Action, Reaction, or Interaction.",
    successText: "Nice sort - action, reaction, interaction!",
    chips: [
      { id: "a1", text: "Foot pushes ground back", short: "Foot->", color: 0xf472b6 },
      { id: "r1", text: "Ground pushes foot forward", short: "←Ground", color: 0x38bdf8 },
      { id: "i1", text: "Walking pair", short: "Walk", color: 0xa78bfa },
      { id: "a2", text: "Exhaust gas down", short: "Exhaust", color: 0xf472b6 },
      { id: "r2", text: "Rocket pushed up", short: "Rocket↑", color: 0x38bdf8 },
      { id: "i2", text: "Rocket interaction", short: "Rocket", color: 0xa78bfa },
      { id: "a3", text: "You pull rope left", short: "You←", color: 0xf472b6 },
      { id: "r3", text: "Rope pulls you right", short: "Rope->", color: 0x38bdf8 },
    ],
    zones: [
      { id: "action", label: "Action", accept: ["a1", "a2", "a3"] },
      { id: "reaction", label: "Reaction", accept: ["r1", "r2", "r3"] },
      { id: "interact", label: "Interaction", accept: ["i1", "i2"] },
    ],
    onDone: completeSub,
  });
}

function sub4_rocket({ overlay, setCoach, completeSub }) {
  setCoach("Rocket: exhaust down ↔ vehicle up.");
  forceLabState.heat = 0.2;
  mountHeatLab(overlay, {
    scene: "pairRocket",
    title: "Rocket Pair Lab",
    html: `<p>Slide thrust. Exhaust pushes down; rocket is pushed up - equal & opposite.</p>`,
    goalText: "Goal: thrust ≥ 75%.",
    doneLabel: "Launch feel ▶",
    threshold: 0.75,
    startHeat: 0.2,
    axis: "x",
    canvasAction: "stretch",
    sliderLabel: "Thrust",
    syncKey: "pairGap",
    readoutLabels: {
      cold: "Idle",
      melting: "Throttle up...",
      liquid: "Climbing",
      simmer: "Pair forces roaring!",
    },
    badge: FORCE_ASSET_PATHS.rocket,
    onDone: () => {
      mountQuiz(overlay, {
        scene: "pairRocket",
        title: "Check",
        q: "Rocket exhaust pushes gases down. The pair force on the rocket...",
        opts: ["Pushes the rocket up", "Cancels gravity forever", "Removes mass to zero", "Only heats the cabin"],
        ok: 0,
        onDone: completeSub,
      });
    },
  });
}

function sub5_rope({ overlay, setCoach, completeSub }) {
  setCoach("Mid-rope scale with equal pulls reads ~one side’s tension - not 0 or 240.");
  forceLabState.ropeT = 0.5;
  forceLabState.heat = 0.5;
  mountHeatLab(overlay, {
    scene: "pairRope",
    title: "Rope Scale Lab",
    html: `<p>Each side pulls. The scale in the middle reads about the tension (~120 N style), not zero and not double.</p>`,
    goalText: "Goal: tension slider ≥ 70%.",
    doneLabel: "Scale checked ▶",
    threshold: 0.7,
    startHeat: 0.5,
    axis: "x",
    canvasAction: "stretch",
    sliderLabel: "Tension",
    readoutLabels: {
      cold: "Soft pull",
      melting: "Medium tension",
      liquid: "Firm tug",
      simmer: "Strong - scale ≈ one side",
    },
    badge: FORCE_ASSET_PATHS.pair,
    onDone: () => {
      mountQuiz(overlay, {
        scene: "pairRope",
        title: "Check",
        q: "Two people each pull 120 N on a mid-rope scale. Reading is closest to...",
        opts: ["~120 N", "0 N", "240 N", "∞ N"],
        ok: 0,
        onDone: completeSub,
      });
    },
  });
}

function sub6_walk({ overlay, setCoach, completeSub }) {
  setCoach("Walking: foot pushes ground back; ground pushes you forward.");
  forceLabState.walkStep = 0;
  mountMotionChain(overlay, {
    title: "Walking pairs",
    beats: [
      {
        scene: "pairWalk",
        dwellMs: 5000,
        html: `<p><strong>Act 1:</strong> Tap STEP several times. Pink arrow = foot on ground; blue = ground on you.</p>`,
      },
      {
        scene: "pairWalk",
        dwellMs: 4000,
        html: `<p><strong>Act 2:</strong> You move forward because the ground pushes you - the pair partner.</p>`,
      },
    ],
    onDone: () => {
      mountQuiz(overlay, {
        scene: "pairWalk",
        title: "Check",
        q: "To walk forward, your foot mainly...",
        opts: [
          "Pushes the ground backward (ground pushes you forward)",
          "Pulls gravity sideways",
          "Deletes friction",
          "Creates new mass under the shoe",
        ],
        ok: 0,
        onDone: completeSub,
      });
    },
  });
}

function sub7_rule({ overlay, setCoach, completeSub }) {
  setCoach("Build: equal & opposite pairs.");
  mountEquationBuild(overlay, {
    scene: "pairRule",
    title: "Build the pair rule",
    instructions: "Tap tokens in order.",
    badge: FORCE_ASSET_PATHS.rule,
    tokens: [
      { id: "a", html: "Equal" },
      { id: "b", html: "&" },
      { id: "c", html: "opposite" },
      { id: "d", html: "pairs" },
    ],
    correctIds: ["a", "b", "c", "d"],
    onDone: () => {
      mountQuiz(overlay, {
        scene: "pairRule",
        title: "Rule check",
        q: "Pair forces act on...",
        opts: [
          "Two different objects (they don’t cancel on one body)",
          "Only one object so nothing can move",
          "Light only",
          "Massless ghosts",
        ],
        ok: 0,
        onDone: completeSub,
      });
    },
  });
}

function sub8_stretch({ overlay, setCoach, completeSub }) {
  setCoach("Stretch: balloon, rower, weight, bug, tug.");
  const modes = [
    { mode: "balloon", title: "Balloon", blurb: "Air one way  /  balloon the other." },
    { mode: "rower", title: "Rower", blurb: "Oar-water pair moves the boat." },
    { mode: "weight", title: "Weight", blurb: "You pull Earth  /  Earth pulls you." },
    { mode: "bug", title: "Bug", blurb: "Bug/glass forces equal magnitude." },
    { mode: "tug", title: "Tug", blurb: "Partners pull each other." },
  ];
  let i = 0;
  function step() {
    if (i >= modes.length) {
      mountQuiz(overlay, {
        scene: "pairStretch",
        title: "Transfer",
        q: "Your weight’s reaction partner is mainly...",
        opts: [
          "You pull Earth up while Earth pulls you down",
          "Only the floor forever with no Earth pair",
          "Air drag alone",
          "No partner exists",
        ],
        ok: 0,
        onDone: completeSub,
      });
      return;
    }
    const m = modes[i++];
    forceLabState.mode = m.mode;
    mountTapContinue(overlay, {
      scene: "pairStretch",
      html: `<h3>${m.title}</h3><p>${m.blurb}</p>`,
      onDone: step,
    });
  }
  step();
}

function sub9_myths({ overlay, setCoach, completeSub }) {
  setCoach("Bust pair myths.");
  mountMythCards(overlay, {
    scene: "pairMyth",
    title: "Pair myths",
    myths: [
      { title: "Bigger wins", claim: "The bigger object wins the force pair.", truth: "Pair forces are equal in size - accelerations differ by mass.", sceneMyth: 0 },
      { title: "Later reaction", claim: "Action happens first, then reaction.", truth: "They are simultaneous - one interaction.", sceneMyth: 1 },
      { title: "Scale zero", claim: "A mid-rope scale should read zero.", truth: "It reads the tension (~one side’s pull), not zero.", sceneMyth: 2 },
      { title: "No Earth push", claim: "You don’t push the Earth when you jump.", truth: "You push Earth down; Earth pushes you up.", sceneMyth: 3 },
      { title: "Cancel myth", claim: "Pairs cancel so nothing can move.", truth: "Each force acts on a different object.", sceneMyth: 4 },
    ],
    onDone: completeSub,
  });
}

function sub10_mastery({ overlay, setCoach, completeSub }) {
  setCoach("Mastery - Team Force badge.");
  forceLabState.masteryStep = 5;
  mountOrderSteps(overlay, {
    scene: "pairMastery",
    title: "Pair story",
    instructions: "Order the third-law story.",
    items: [
      { id: "s1", html: "Two objects interact" },
      { id: "s2", html: "Equal & opposite forces appear" },
      { id: "s3", html: "Each force acts on a different body" },
      { id: "s4", html: "Accelerations can differ (by mass)" },
    ],
    correctIds: ["s1", "s2", "s3", "s4"],
    onDone: () => {
      forceLabState.masteryStep = 6;
      mountSpeedDrill(overlay, {
        scene: "pairDrill",
        title: "Final checks",
        items: [
          {
            q: "Bug on a windshield - force magnitudes are...",
            opts: ["Equal", "Always larger on the bug", "Always zero", "Undefined"],
            ok: 0,
            prompt: "Bug/glass",
          },
          {
            q: "Balloon release flies opposite the air rush because...",
            opts: ["Pair forces", "Air has no mass", "Gravity flipped", "Inertia vanished"],
            ok: 0,
            prompt: "Balloon",
          },
        ],
        onDone: completeSub,
      });
    },
  });
}
