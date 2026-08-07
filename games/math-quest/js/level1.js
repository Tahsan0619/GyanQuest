/**
 * Math Quest - Mission 1: Number Sense (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
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
} from "./lab-activities.js";

export const L1_META = {
  objective: "By the end of this mission, you'll be able to explain tens & ones / place value in your own words.",
  bdHook: "Bangladesh everyday: notice tens & ones / place value around you — then connect it to Number Sense.",
  predict: {
    q: "Before we start — what do you think matters most in Number Sense?",
    options: [
      "Guessing without checking",
      "Looking for a clear pattern or rule",
      "Skipping the practice steps",
    ],
    ok: 1,
  },

  kidTitle: "Number Sense",
  theme: "tens & ones / place value",
  emoji: "🔢",
  rewardName: "Number Scout",
  intro: "Numbers have places - tens and ones. A ten-rod is ten ones bundled together.",
  everyday: ["Counting eggs in tens", "Reading a cricket score", "Making change with 10-taka notes"],
  subTitles: [
    "Meet Tens & Ones",
    "Build a Number",
    "Sort: Tens or Ones?",
    "Place Chart Lab",
    "Why Place Matters",
    "Name the Place Rule",
    "Stretch: BD Stories",
    "Myth Bust",
    "Fluency Drill",
    "Number Scout Mastery",
  ],
};

export function runL1Sub(subIndex, api) {
  const { registerTryAgain } = api;
  labState.reveal = false;
  labState.tokenProgress = 0;
  labState.masteryStep = 0;
  labState.placed = {};
  labState.selectedId = null;
  labState.mythPhase = "claim";
  labState.heat = 0.3;
  labState.phase = "desk";
  labState.mode = "eggs";
  labState.tens = 2;
  labState.ones = 3;

  const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
  const fn = runners[subIndex] || runners[0];
  registerTryAgain(() => {
    api.overlay.innerHTML = "";
    fn(api);
  });
  fn(api);
}

function s1({ overlay, setCoach, completeSub }) {
  setCoach("Hook: a ten-rod is ten ones glued - place names the value.");
  mountMotionChain(overlay, {
    title: "Meet Tens & Ones",
    beats: [
      {
        scene: "numMeet",
        sceneArgs: { phase: "desk" },
        dwellMs: 4200,
        html: `${badgeHtml(LAB_ASSET_PATHS.m1, "number sense")}
          <p><strong>Act 1:</strong> Drag the ten-rod, cubes, and egg carton - counting tools.</p>`,
      },
      {
        scene: "numMeet",
        sceneArgs: { phase: "glow" },
        dwellMs: 4200,
        html: `<p><strong>Act 2:</strong> See the place chart - <strong>TENS</strong> and <strong>ONES</strong>.</p>`,
      },
      {
        scene: "numMeet",
        sceneArgs: { phase: "settle" },
        dwellMs: 4000,
        html: `<p><strong>Act 3:</strong> Big idea - 2 tens + 3 ones = <strong>23</strong>, not 2+3.</p>`,
      },
    ],
    onDone: () => {
      mountQuiz(overlay, {
        scene: "numMeet",
        sceneArgs: { phase: "settle" },
        title: "Exit check",
        q: "In 23, the digit 2 stands for...",
        opts: ["2 tens (twenty)", "Just the number two", "2 ones", "Nothing - only 3 matters"],
        ok: 0,
        onDone: () => {
          mountTapContinue(overlay, {
            scene: "numMeet",
            badge: LAB_ASSET_PATHS.m1,
            html: `<h3>You met place value</h3><p>Next: build a number with the dial and columns.</p>`,
            onDone: completeSub,
            advanceAfterDone: true,
          });
        },
      });
    },
  });
}

function s2({ overlay, setCoach, completeSub }) {
  setCoach("Lab: build toward 25+ using tens and ones.");
  labState.tens = 1;
  labState.ones = 5;
  labState.heat = 0.2;
  mountHeatLab(overlay, {
    scene: "numLab",
    title: "Build a Number",
    html: `<p>Drag the dial or tap TENS / ONES columns. Goal: total ≥ 25.</p>`,
    goalText: "Goal: number ≥ 25",
    doneLabel: "Number built",
    threshold: 0.35,
    startHeat: 0.2,
    axis: "x",
    canvasAction: "stretch",
    sliderLabel: "Build value",
    badge: LAB_ASSET_PATHS.m1,
    readoutLabels: {
      cold: "Small number - add tens",
      melting: "Growing...",
      liquid: "Near 25",
      simmer: "25+ - place value power!",
    },
    onDone: () => {
      mountQuiz(overlay, {
        scene: "numLab",
        title: "Check",
        q: "34 means...",
        opts: ["3 tens + 4 ones", "3 + 4", "34 ones only", "3 ones + 4 tens"],
        ok: 0,
        onDone: completeSub,
      });
    },
  });
}

function s3({ overlay, setCoach, completeSub }) {
  setCoach("Sort stories into tens, ones, or not place value.");
  mountTapContinue(overlay, {
    scene: "numSort",
    html: `<h3>Tens or ones?</h3>
      <p><strong>Tens:</strong> ten-rod, 2 rods, 10-taka, bundle of 10 eggs.</p>
      <p><strong>Ones:</strong> single cube, 5 ones.</p>
      <p><strong>Not:</strong> letter A, blue color.</p>`,
    onDone: () => {
      mountDragSort(overlay, {
        scene: "numSort",
        title: "Sort place-value stories",
        instructions: "Drag into Tens, Ones, or Not place value.",
        successText: "Sharp sort - tens vs ones!",
        chips: [
          { id: "rod", text: "One ten-rod", short: "Ten-rod", color: 0x0ea5e9 },
          { id: "cube", text: "One cube", short: "One", color: 0x38bdf8 },
          { id: "twenty", text: "2 ten-rods", short: "2 tens", color: 0x0284c7 },
          { id: "letter", text: "Letter A", short: "Letter", color: 0x94a3b8 },
          { id: "five", text: "5 ones", short: "5 ones", color: 0x7dd3fc },
          { id: "taka", text: "10-taka note", short: "10 taka", color: 0xfbbf24 },
          { id: "color", text: "Blue color", short: "Color", color: 0xa78bfa },
          { id: "bundle", text: "Bundle of 10 eggs", short: "10 eggs", color: 0xf59e0b },
        ],
        zones: [
          { id: "tens", label: "Tens (10s)", accept: ["rod", "twenty", "taka", "bundle"] },
          { id: "ones", label: "Ones (1s)", accept: ["cube", "five"] },
          { id: "not", label: "Not place value", accept: ["letter", "color"] },
        ],
        onDone: completeSub,
      });
    },
  });
}

function s4({ overlay, setCoach, completeSub }) {
  setCoach("Push the build higher - watch tens and ones update together.");
  labState.heat = 0.45;
  labState.tens = 2;
  labState.ones = 8;
  mountHeatLab(overlay, {
    scene: "numLab",
    title: "Place Chart Lab",
    html: `<p>Reach a clearer build (dial ≥ 70%). Notice rods and cubes match the chart.</p>`,
    goalText: "Goal: dial ≥ 70%",
    doneLabel: "Chart checked",
    threshold: 0.7,
    startHeat: 0.45,
    axis: "x",
    canvasAction: "stretch",
    sliderLabel: "Build value",
    badge: LAB_ASSET_PATHS.m1,
    onDone: completeSub,
  });
}

function s5({ overlay, setCoach, completeSub }) {
  setCoach("Order why place matters.");
  mountOrderSteps(overlay, {
    scene: "numMeet",
    sceneArgs: { phase: "settle" },
    title: "Why place matters",
    instructions: "Put the place-value story in order.",
    items: [
      { id: "bundle", html: "Bundle ones into tens" },
      { id: "columns", html: "Write tens | ones" },
      { id: "value", html: "Read the total value" },
      { id: "compare", html: "Compare 32 vs 23" },
    ],
    correctIds: ["bundle", "columns", "value", "compare"],
    onDone: () => {
      mountQuiz(overlay, {
        scene: "numMeet",
        sceneArgs: { phase: "settle" },
        title: "Check",
        q: "Why is 32 different from 23?",
        opts: [
          "Digits sit in different places (value changes)",
          "They use different ink",
          "32 is always odd",
          "Place never matters",
        ],
        ok: 0,
        onDone: completeSub,
      });
    },
  });
}

function s6({ overlay, setCoach, completeSub }) {
  setCoach("Lock the place-value rule.");
  mountEquationBuild(overlay, {
    scene: "numRule",
    title: "Name the Place Rule",
    instructions: "Tap tokens in order.",
    tokens: [
      { id: "a", html: "10 ones" },
      { id: "b", html: "=" },
      { id: "c", html: "1 ten" },
      { id: "d", html: " /  place" },
    ],
    correctIds: ["a", "b", "c", "d"],
    badge: LAB_ASSET_PATHS.rule,
    onDone: () => {
      mountTapContinue(overlay, {
        scene: "numRule",
        badge: LAB_ASSET_PATHS.rule,
        html: `<h3>Rule locked</h3><p>10 ones = 1 ten. Place tells the value.</p>`,
        onDone: completeSub,
        advanceAfterDone: true,
      });
    },
  });
}

function s7({ overlay, setCoach, completeSub }) {
  setCoach("Eggs, taka, cricket, bus, beads - same place value.");
  mountTapContinue(overlay, {
    scene: "numStretch",
    html: `<h3>Bangladesh stretch</h3><p>Tap modes: eggs, taka, cricket, bus, beads.</p>`,
    onDone: () => {
      mountQuiz(overlay, {
        scene: "numStretch",
        title: "Transfer",
        q: "25 eggs as tens and ones is...",
        opts: ["2 tens + 5 ones", "25 tens", "5 tens + 2 ones", "Only ones"],
        ok: 0,
        onDone: completeSub,
      });
    },
  });
}

function s8({ overlay, setCoach, completeSub }) {
  setCoach("Bust place-value myths.");
  mountMythCards(overlay, {
    scene: "numMyth",
    title: "Myth Bust",
    badge: LAB_ASSET_PATHS.myth,
    myths: [
      { claim: "23 means 2 + 3", truth: "23 means 2 tens + 3 ones = 20 + 3", sceneMyth: 0 },
      { claim: "A ten-rod is just a longer one", truth: "A ten-rod stands for ten ones bundled", sceneMyth: 1 },
      { claim: "Place doesn’t matter - 32 = 23", truth: "Place changes value - 32 ≠ 23", sceneMyth: 2 },
      { claim: "Zero in ones is useless", truth: "30 needs 0 to show 3 tens and no ones", sceneMyth: 3 },
      { claim: "Only school blocks teach this", truth: "Eggs, taka, and scores use the same idea", sceneMyth: 4 },
    ],
    onDone: completeSub,
  });
}

function s9({ overlay, setCoach, completeSub }) {
  setCoach("Quick place-value fluency.");
  mountSpeedDrill(overlay, {
    scene: "numDrill",
    title: "Fluency Drill",
    passScene: "numMastery",
    items: [
      { q: "In 41, the 4 means...", opts: ["4 tens", "4 ones", "41 tens", "Nothing"], ok: 0, prompt: "41" },
      { q: "10 ones equal...", opts: ["1 ten", "10 tens", "0", "100"], ok: 0, prompt: "10 ones" },
      { q: "Is 23 the same as 32?", opts: ["No", "Yes"], ok: 0, prompt: "23 vs 32" },
      { q: "A 10-taka note is like...", opts: ["1 ten", "1 one", "10 tens", "A letter"], ok: 0, prompt: "Taka" },
      { q: "In 70, the 0 means...", opts: ["0 ones (no ones)", "Delete the 7", "70 ones only", "Error"], ok: 0, prompt: "70" },
      { q: "2 ten-rods show...", opts: ["20", "2", "12", "200"], ok: 0, prompt: "2 rods" },
    ],
    onDone: completeSub,
  });
}

function s10({ overlay, setCoach, completeSub }) {
  setCoach("Mastery - Number Scout.");
  mountOrderSteps(overlay, {
    scene: "numMastery",
    title: "Number Scout Mastery",
    instructions: "Order your Number Sense journey.",
    items: [
      { id: "meet", html: "Meet" },
      { id: "sort", html: "Sort" },
      { id: "lab", html: "Lab" },
      { id: "rule", html: "Rule" },
      { id: "myth", html: "Myth" },
      { id: "scout", html: "Scout" },
    ],
    correctIds: ["meet", "sort", "lab", "rule", "myth", "scout"],
    onDone: () => {
      mountTapContinue(overlay, {
        scene: "numMastery",
        badge: LAB_ASSET_PATHS.m1,
        html: `<h3>🔢 Number Scout!</h3><p>You can read tens and ones - and explain why place matters.</p>`,
        onDone: completeSub,
        advanceAfterDone: true,
      });
    },
  });
}
