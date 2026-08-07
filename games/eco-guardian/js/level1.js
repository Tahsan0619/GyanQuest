/**
 * Eco Guardian - Mission 1: Waste Watch (deepened)
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
  objective: "By the end of this mission, you'll be able to explain reduce / reuse / recycle in your own words.",
  bdHook: "Bangladesh everyday: notice reduce / reuse / recycle around you — then connect it to Waste Watch.",
  predict: {
    q: "Before we start — what do you think matters most in Waste Watch?",
    options: [
      "Guessing without checking",
      "Looking for a clear pattern or rule",
      "Skipping the practice steps",
    ],
    ok: 1,
  },

  kidTitle: "Waste Watch",
  theme: "reduce / reuse / recycle",
  emoji: "♻️",
  rewardName: "Waste Watcher",
  intro: "Sort smart - recycle, compost, or landfill. Reduce first whenever you can.",
  everyday: ["Kitchen peels", "School paper", "Market plastic bags"],
  subTitles: [
    "Meet the Bins",
    "Fill Recycle Goal",
    "Sort the Litter",
    "Clean-up Lab",
    "Why Reduce First",
    "Name the 3R Rule",
    "Stretch: BD Places",
    "Myth Bust",
    "Fluency Drill",
    "Waste Watcher Mastery",
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
  labState.heat = 0.25;
  labState.phase = "desk";
  labState.mode = "home";

  const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
  const fn = runners[subIndex] || runners[0];
  registerTryAgain(() => {
    api.overlay.innerHTML = "";
    fn(api);
  });
  fn(api);
}

function s1({ overlay, setCoach, completeSub }) {
  setCoach("Hook: litter has a right home - recycle, compost, or landfill.");
  mountMotionChain(overlay, {
    title: "Meet the Bins",
    beats: [
      {
        scene: "wasteMeet",
        sceneArgs: { phase: "desk" },
        dwellMs: 4000,
        html: `${badgeHtml(LAB_ASSET_PATHS.m1, "waste")}
          <p><strong>Act 1:</strong> Drag bottle, peel, bag, can - everyday litter.</p>`,
      },
      {
        scene: "wasteMeet",
        sceneArgs: { phase: "bins" },
        dwellMs: 4200,
        html: `<p><strong>Act 2:</strong> Three bins appear - Recycle  /  Compost  /  Landfill.</p>`,
      },
      {
        scene: "wasteMeet",
        sceneArgs: { phase: "settle" },
        dwellMs: 4000,
        html: `<p><strong>Act 3:</strong> Big idea - <strong>Reduce -> Reuse -> Recycle</strong>.</p>`,
      },
    ],
    onDone: () => {
      mountQuiz(overlay, {
        scene: "wasteMeet",
        sceneArgs: { phase: "settle" },
        title: "Exit check",
        q: "Banana peels usually belong in...",
        opts: ["Compost", "Recycle with bottles", "Nowhere - throw in the river", "Battery bin"],
        ok: 0,
        onDone: () => {
          mountTapContinue(overlay, {
            scene: "wasteMeet",
            badge: LAB_ASSET_PATHS.m1,
            html: `<h3>Bins unlocked</h3><p>Next: fill the recycle goal dial.</p>`,
            onDone: completeSub,
            advanceAfterDone: true,
          });
        },
      });
    },
  });
}

function s2({ overlay, setCoach, completeSub }) {
  setCoach("Fill the recycle bin to the goal line.");
  labState.heat = 0.25;
  mountHeatLab(overlay, {
    scene: "wasteLab",
    title: "Fill Recycle Goal",
    html: `<p>Drag until recycle fill ≥ 60%.</p>`,
    goalText: "Goal ≥ 60%",
    doneLabel: "Recycle filled",
    threshold: 0.6,
    startHeat: 0.25,
    axis: "x",
    canvasAction: "stretch",
    sliderLabel: "Recycle fill",
    badge: LAB_ASSET_PATHS.m1,
    onDone: completeSub,
  });
}

function s3({ overlay, setCoach, completeSub }) {
  setCoach("Sort litter into the right bins.");
  mountTapContinue(overlay, {
    scene: "wasteSort",
    html: `<h3>Bin guide</h3>
      <p><strong>Recycle:</strong> bottle, can, clean paper, glass.</p>
      <p><strong>Compost:</strong> peel, leaves.</p>
      <p><strong>Landfill / special:</strong> dirty chip bag, battery.</p>`,
    onDone: () => {
      mountDragSort(overlay, {
        scene: "wasteSort",
        title: "Sort the litter",
        instructions: "Drag into Recycle, Compost, or Landfill / special.",
        successText: "Clean sort!",
        chips: [
          { id: "bottle", text: "Plastic bottle", short: "Bottle", color: 0x38bdf8 },
          { id: "peel", text: "Banana peel", short: "Peel", color: 0xfbbf24 },
          { id: "can", text: "Metal can", short: "Can", color: 0xa3e635 },
          { id: "paper", text: "Clean paper", short: "Paper", color: 0xe2e8f0 },
          { id: "bag", text: "Dirty chip bag", short: "Chip bag", color: 0x94a3b8 },
          { id: "leaf", text: "Dry leaves", short: "Leaves", color: 0x4ade80 },
          { id: "battery", text: "Battery", short: "Battery", color: 0xf87171 },
          { id: "glass", text: "Glass jar", short: "Glass", color: 0x67e8f9 },
        ],
        zones: [
          { id: "recycle", label: "Recycle", accept: ["bottle", "can", "paper", "glass"] },
          { id: "compost", label: "Compost", accept: ["peel", "leaf"] },
          { id: "landfill", label: "Landfill / special", accept: ["bag", "battery"] },
        ],
        onDone: completeSub,
      });
    },
  });
}

function s4({ overlay, setCoach, completeSub }) {
  setCoach("Push recycle fill higher.");
  labState.heat = 0.4;
  mountHeatLab(overlay, {
    scene: "wasteLab",
    title: "Clean-up Lab",
    html: `<p>Reach ≥ 75% recycle fill.</p>`,
    goalText: "Goal ≥ 75%",
    doneLabel: "Lab done",
    threshold: 0.75,
    startHeat: 0.4,
    axis: "x",
    canvasAction: "stretch",
    sliderLabel: "Recycle fill",
    badge: LAB_ASSET_PATHS.m1,
    onDone: completeSub,
  });
}

function s5({ overlay, setCoach, completeSub }) {
  setCoach("Order why reduce comes first.");
  mountOrderSteps(overlay, {
    scene: "wasteMeet",
    sceneArgs: { phase: "settle" },
    title: "Why reduce first",
    instructions: "Best waste path order.",
    items: [
      { id: "reduce", html: "Reduce what you buy/use" },
      { id: "reuse", html: "Reuse containers" },
      { id: "recycle", html: "Recycle what you can" },
      { id: "respect", html: "Respect shared spaces" },
    ],
    correctIds: ["reduce", "reuse", "recycle", "respect"],
    onDone: () => {
      mountQuiz(overlay, {
        scene: "wasteMeet",
        sceneArgs: { phase: "settle" },
        title: "Check",
        q: "Best first step when shopping?",
        opts: ["Carry a reusable bag (reduce)", "Buy more plastic then recycle later", "Dump near the drain", "Ignore packaging"],
        ok: 0,
        onDone: completeSub,
      });
    },
  });
}

function s6({ overlay, setCoach, completeSub }) {
  setCoach("Lock the Waste Watch rule.");
  mountEquationBuild(overlay, {
    scene: "wasteRule",
    title: "Name the 3R Rule",
    instructions: "Tap tokens in order.",
    tokens: [
      { id: "a", html: "Reduce" },
      { id: "b", html: "Reuse" },
      { id: "c", html: "Recycle" },
      { id: "d", html: "Respect" },
    ],
    correctIds: ["a", "b", "c", "d"],
    badge: LAB_ASSET_PATHS.rule,
    onDone: () => {
      mountTapContinue(overlay, {
        scene: "wasteRule",
        badge: LAB_ASSET_PATHS.rule,
        html: `<h3>Rule locked</h3><p>Reduce -> Reuse -> Recycle -> Respect.</p>`,
        onDone: completeSub,
        advanceAfterDone: true,
      });
    },
  });
}

function s7({ overlay, setCoach, completeSub }) {
  setCoach("Home, school, market, park, river.");
  mountTapContinue(overlay, {
    scene: "wasteStretch",
    html: `<h3>BD places</h3><p>Tap each place - same sort idea.</p>`,
    onDone: () => {
      mountQuiz(overlay, {
        scene: "wasteStretch",
        title: "Transfer",
        q: "Litter in a river...",
        opts: ["Harms fish, people, and floods", "Just washes away safely", "Helps compost underwater", "Is the same as recycling"],
        ok: 0,
        onDone: completeSub,
      });
    },
  });
}

function s8({ overlay, setCoach, completeSub }) {
  setCoach("Bust waste myths.");
  mountMythCards(overlay, {
    scene: "wasteMyth",
    title: "Myth Bust",
    badge: LAB_ASSET_PATHS.myth,
    myths: [
      { claim: "All plastic can go in recycle", truth: "Dirty or mixed plastics often can’t", sceneMyth: 0 },
      { claim: "Food waste belongs in recycle", truth: "Food scraps usually compost", sceneMyth: 1 },
      { claim: "Recycling alone fixes everything", truth: "Reduce and reuse come first", sceneMyth: 2 },
      { claim: "Batteries are normal trash", truth: "Batteries need special care", sceneMyth: 3 },
      { claim: "River litter just washes away", truth: "It harms ecosystems and people", sceneMyth: 4 },
    ],
    onDone: completeSub,
  });
}

function s9({ overlay, setCoach, completeSub }) {
  setCoach("Quick waste fluency.");
  mountSpeedDrill(overlay, {
    scene: "wasteDrill",
    title: "Fluency Drill",
    passScene: "wasteMastery",
    items: [
      { q: "Clean plastic bottle -> ?", opts: ["Recycle", "Compost"], ok: 0, prompt: "Bottle" },
      { q: "Banana peel -> ?", opts: ["Compost", "Recycle"], ok: 0, prompt: "Peel" },
      { q: "Best first R?", opts: ["Reduce", "Recycle only"], ok: 0, prompt: "3R" },
      { q: "Battery in normal trash?", opts: ["No", "Yes"], ok: 0, prompt: "Battery" },
      { q: "Dirty chip bag -> often?", opts: ["Landfill", "Compost"], ok: 0, prompt: "Bag" },
      { q: "River dumping OK?", opts: ["No", "Yes"], ok: 0, prompt: "River" },
    ],
    onDone: completeSub,
  });
}

function s10({ overlay, setCoach, completeSub }) {
  setCoach("Mastery - Waste Watcher.");
  mountOrderSteps(overlay, {
    scene: "wasteMastery",
    title: "Waste Watcher Mastery",
    instructions: "Order your journey.",
    items: [
      { id: "meet", html: "Meet" },
      { id: "sort", html: "Sort" },
      { id: "lab", html: "Lab" },
      { id: "rule", html: "Rule" },
      { id: "myth", html: "Myth" },
      { id: "watch", html: "Watch" },
    ],
    correctIds: ["meet", "sort", "lab", "rule", "myth", "watch"],
    onDone: () => {
      mountTapContinue(overlay, {
        scene: "wasteMastery",
        badge: LAB_ASSET_PATHS.m1,
        html: `<h3>♻️ Waste Watcher!</h3><p>You can sort smart and explain Reduce -> Reuse -> Recycle.</p>`,
        onDone: completeSub,
        advanceAfterDone: true,
      });
    },
  });
}
