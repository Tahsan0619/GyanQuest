/**
 * Bio Explorer - Mission 1: Living or Not
 */
import { bioLabState, BIO_ASSET_PATHS } from "./bio-state.js";
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
} from "./bio-activities.js";

export const L1_META = {
  objective: "By the end of this mission, you'll be able to explain life in your own words.",
  bdHook: "Bangladesh everyday: notice life around you — then connect it to Living or Not.",
  predict: {
    q: "Before we start — what do you think matters most in Living or Not?",
    options: [
      "Guessing without checking",
      "Looking for a clear pattern or rule",
      "Skipping the practice steps",
    ],
    ok: 1,
  },

  kidTitle: "Living or Not",
  theme: "life",
  emoji: "🌱",
  rewardName: "Living Rookie",
  intro: "Living things grow, need energy, respond, and can make more life - even quiet seeds!",
  everyday: ["A sleeping cat", "A mango seed", "A phone that ‘moves’ when you touch it"],
  subTitles: [
    "Meet Living Clues",
    "Seed Sprout Lab",
    "Sort: Living or Not?",
    "Watch Growth",
    "Why Seeds Count",
    "Name the Life Rule",
    "Stretch: New Contexts",
    "Myth Bust",
    "Fluency Drill",
    "Living Rookie Mastery",
  ],
};

export function runL1Sub(subIndex, api) {
  const { registerTryAgain } = api;
  bioLabState.reveal = false;
  bioLabState.tokenProgress = 0;
  bioLabState.masteryStep = 0;
  bioLabState.sortPlaced = 0;
  bioLabState.placed = {};
  bioLabState.selectedId = null;
  bioLabState.mythBusted = false;
  bioLabState.mythPhase = "claim";
  bioLabState.heat = 0.15;
  bioLabState.heatTarget = 0.15;
  bioLabState.sprout = 0.15;
  bioLabState.phase = "desk";
  bioLabState.mode = "cat";

  const runners = [
    sub1_meet,
    sub2_sprout,
    sub3_sort,
    sub4_watch,
    sub5_explain,
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
  setCoach("Hook: living is more than moving - growth, energy, response, new life.");
  mountMotionChain(overlay, {
    title: "Meet Living Clues",
    beats: [
      {
        scene: "lifeMeet",
        sceneArgs: { phase: "desk" },
        dwellMs: 4000,
        html: `${badgeHtml(BIO_ASSET_PATHS.life, "life")}
          <p><strong>Act 1:</strong> Drag the cat, seed, rock, and phone - which feel alive?</p>`,
      },
      {
        scene: "lifeMeet",
        sceneArgs: { phase: "grow" },
        dwellMs: 4200,
        html: `<p><strong>Act 2:</strong> Living things can grow and change over time.</p>`,
      },
      {
        scene: "lifeMeet",
        sceneArgs: { phase: "respond" },
        dwellMs: 4000,
        html: `<p><strong>Act 3:</strong> They respond - a cat wakes, a plant leans to light.</p>`,
      },
      {
        scene: "lifeMeet",
        sceneArgs: { phase: "settle" },
        dwellMs: 3800,
        html: `<p><strong>Act 4:</strong> Big idea - living ≠ “moves when you poke it.”</p>`,
      },
    ],
    onDone: () => {
      mountQuiz(overlay, {
        scene: "lifeMeet",
        sceneArgs: { phase: "settle" },
        title: "Exit check",
        q: "A phone lights up when you tap it. Is it living?",
        opts: [
          "No - it needs a human + battery; it doesn’t grow or make more phones",
          "Yes - anything that moves is living",
          "Yes - screens are alive",
          "Only if it has apps",
        ],
        ok: 0,
        onDone: () => {
          mountTapContinue(overlay, {
            scene: "lifeMeet",
            sceneArgs: { phase: "desk" },
            badge: BIO_ASSET_PATHS.life,
            html: `<h3>You met living clues</h3><p>Next: water a seed and watch a living process.</p>`,
            onDone: completeSub,
            advanceAfterDone: true,
          });
        },
      });
    },
  });
}

function sub2_sprout({ overlay, setCoach, completeSub }) {
  setCoach("Lab: seeds can be dormant living plants - water helps them sprout.");
  bioLabState.heat = 0.2;
  bioLabState.sprout = 0.2;
  mountHeatLab(overlay, {
    scene: "lifeSprout",
    title: "Seed Sprout Lab",
    html: `<p>Drag the water handle. Watch the seed sprout - a living change.</p>`,
    goalText: "Goal: sprout ≥ 60%.",
    doneLabel: "Sprout checked ▶",
    threshold: 0.6,
    startHeat: 0.2,
    axis: "x",
    canvasAction: "stretch",
    sliderLabel: "Water / sprout",
    syncKey: "sprout",
    readoutLabels: {
      cold: "Dry seed - still living, waiting",
      melting: "Water soaks in",
      liquid: "Root peek!",
      simmer: "Sprout rising - living process",
    },
    badge: BIO_ASSET_PATHS.sprout,
    onDone: () => {
      mountQuiz(overlay, {
        scene: "lifeSprout",
        title: "Check",
        q: "Before it sprouts, a dry mango seed is...",
        opts: [
          "Still living (dormant) if it can grow later",
          "Definitely dead forever",
          "The same as a pebble",
          "Only living after you paint it green",
        ],
        ok: 0,
        onDone: completeSub,
      });
    },
  });
}

function sub3_sort({ overlay, setCoach, completeSub }) {
  setCoach("Sort: living, not living, or tricky myths.");
  mountTapContinue(overlay, {
    scene: "lifeSort",
    html: `<h3>Living or not?</h3>
      <p><strong>Living:</strong> cat, seed, tree, fish.</p>
      <p><strong>Not living:</strong> rock, phone, car.</p>
      <p><strong>Tricky:</strong> fire looks “alive” but isn’t an organism.</p>`,
    onDone: () => {
      mountDragSort(overlay, {
        scene: "lifeSort",
        title: "Sort living stories",
        instructions: "Drag into Living, Not living, or Tricky.",
        successText: "Nice sort - life is more than motion!",
        chips: [
          { id: "cat", text: "Cat", short: "Cat", color: 0xf59e0b },
          { id: "rock", text: "Rock", short: "Rock", color: 0x78716c },
          { id: "seed", text: "Seed", short: "Seed", color: 0x92400e },
          { id: "phone", text: "Phone", short: "Phone", color: 0x38bdf8 },
          { id: "tree", text: "Mango tree", short: "Tree", color: 0x22c55e },
          { id: "car", text: "Car", short: "Car", color: 0x94a3b8 },
          { id: "fire", text: "Campfire", short: "Fire", color: 0xf97316 },
          { id: "fish", text: "Fish", short: "Fish", color: 0x0ea5e9 },
        ],
        zones: [
          { id: "living", label: "Living", accept: ["cat", "seed", "tree", "fish"] },
          { id: "notliving", label: "Not living", accept: ["rock", "phone", "car"] },
          { id: "tricky", label: "Tricky / myth", accept: ["fire"] },
        ],
        onDone: completeSub,
      });
    },
  });
}

function sub4_watch({ overlay, setCoach, completeSub }) {
  setCoach("Watch growth again - living change takes time and energy.");
  bioLabState.heat = 0.35;
  bioLabState.sprout = 0.35;
  mountHeatLab(overlay, {
    scene: "lifeSprout",
    title: "Watch Growth",
    html: `<p>Push sprout past 70% - living things change as they grow.</p>`,
    goalText: "Goal: growth ≥ 70%.",
    doneLabel: "Growth watched ▶",
    threshold: 0.7,
    startHeat: 0.35,
    axis: "x",
    canvasAction: "stretch",
    sliderLabel: "Growth",
    syncKey: "sprout",
    badge: BIO_ASSET_PATHS.sprout,
    onDone: completeSub,
  });
}

function sub5_explain({ overlay, setCoach, completeSub }) {
  setCoach("Order the life clues - what makes something living?");
  mountOrderSteps(overlay, {
    scene: "lifeMeet",
    sceneArgs: { phase: "settle" },
    title: "Why seeds count",
    instructions: "Put the living clues in a sensible order.",
    items: [
      { id: "energy", html: "Need energy / materials" },
      { id: "grow", html: "Can grow or develop" },
      { id: "respond", html: "Can respond to the world" },
      { id: "more", html: "Can make more life (reproduce)" },
    ],
    correctIds: ["energy", "grow", "respond", "more"],
    onDone: () => {
      mountQuiz(overlay, {
        scene: "lifeMeet",
        sceneArgs: { phase: "settle" },
        title: "Check",
        q: "Fire spreads and ‘uses’ fuel. Why isn’t it living?",
        opts: [
          "It isn’t an organism that grows, reproduces as life does",
          "Because it’s hot",
          "Because scientists hate campfires",
          "It is living",
        ],
        ok: 0,
        onDone: completeSub,
      });
    },
  });
}

function sub6_rule({ overlay, setCoach, completeSub }) {
  setCoach("Build the life rule from tokens.");
  mountEquationBuild(overlay, {
    scene: "lifeRule",
    title: "Name the Life Rule",
    instructions: "Tap tokens in order to lock the idea.",
    tokens: [
      { id: "a", html: "Living" },
      { id: "b", html: "things" },
      { id: "c", html: "grow," },
      { id: "d", html: "respond," },
      { id: "e", html: "make more" },
    ],
    correctIds: ["a", "b", "c", "d", "e"],
    badge: BIO_ASSET_PATHS.rule,
    onDone: () => {
      mountTapContinue(overlay, {
        scene: "lifeRule",
        badge: BIO_ASSET_PATHS.rule,
        html: `<h3>Life rule locked</h3><p>Living ≠ merely moving. Seeds can wait and still be alive.</p>`,
        onDone: completeSub,
        advanceAfterDone: true,
      });
    },
  });
}

function sub7_stretch({ overlay, setCoach, completeSub }) {
  setCoach("Same idea in new Bangladesh / everyday contexts.");
  mountTapContinue(overlay, {
    scene: "lifeStretch",
    html: `<h3>Stretch contexts</h3><p>Tap modes: rice seed, street cat, rickshaw, river fish.</p>`,
    onDone: () => {
      mountQuiz(overlay, {
        scene: "lifeStretch",
        title: "Transfer",
        q: "A parked rickshaw rolls when you push it. Living?",
        opts: ["No - machines aren’t organisms", "Yes - it moved", "Yes - wheels are cells", "Only in rain"],
        ok: 0,
        onDone: completeSub,
      });
    },
  });
}

function sub8_myths({ overlay, setCoach, completeSub }) {
  setCoach("Bust myths about living things.");
  mountMythCards(overlay, {
    scene: "lifeMyth",
    title: "Myth Bust",
    badge: BIO_ASSET_PATHS.myth,
    myths: [
      { claim: "Only things that move are living", truth: "Seeds and trees are living even when still", sceneMyth: 0 },
      { claim: "Fire is a living thing", truth: "Fire is a chemical process, not an organism", sceneMyth: 1 },
      { claim: "Phones are alive because they respond", truth: "Phones are designed machines, not living", sceneMyth: 2 },
      { claim: "Dry seeds are dead", truth: "Many seeds are dormant living plants", sceneMyth: 3 },
      { claim: "Rocks grow like plants", truth: "Rocks don’t grow as living organisms do", sceneMyth: 4 },
    ],
    onDone: completeSub,
  });
}

function sub9_drill({ overlay, setCoach, completeSub }) {
  setCoach("Quick fluency - living or not?");
  mountSpeedDrill(overlay, {
    scene: "lifeDrill",
    title: "Fluency Drill",
    passScene: "lifeMastery",
    items: [
      { q: "Mango seed - living?", opts: ["Yes", "No"], ok: 0, prompt: "Seed" },
      { q: "Granite rock - living?", opts: ["Yes", "No"], ok: 1, prompt: "Rock" },
      { q: "Sleeping cat - living?", opts: ["Yes", "No"], ok: 0, prompt: "Cat" },
      { q: "Campfire - living?", opts: ["Yes", "No"], ok: 1, prompt: "Fire" },
      { q: "River fish - living?", opts: ["Yes", "No"], ok: 0, prompt: "Fish" },
      { q: "Smartphone - living?", opts: ["Yes", "No"], ok: 1, prompt: "Phone" },
    ],
    onDone: completeSub,
  });
}

function sub10_mastery({ overlay, setCoach, completeSub }) {
  setCoach("Mastery - Living Rookie.");
  bioLabState.masteryStep = 0;
  mountOrderSteps(overlay, {
    scene: "lifeMastery",
    title: "Living Rookie Mastery",
    instructions: "Order your journey badges.",
    items: [
      { id: "meet", html: "Meet" },
      { id: "sort", html: "Sort" },
      { id: "lab", html: "Lab" },
      { id: "rule", html: "Rule" },
      { id: "myth", html: "Myth" },
      { id: "rookie", html: "Rookie" },
    ],
    correctIds: ["meet", "sort", "lab", "rule", "myth", "rookie"],
    onDone: () => {
      mountTapContinue(overlay, {
        scene: "lifeMastery",
        badge: BIO_ASSET_PATHS.life,
        html: `<h3>🌱 Living Rookie!</h3><p>You can sort living from not-living - and explain why seeds count.</p>`,
        onDone: completeSub,
        advanceAfterDone: true,
      });
    },
  });
}
