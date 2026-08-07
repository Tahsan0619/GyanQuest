/**
 * Bio Explorer - Mission 2: Cell City
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

export const L2_META = {
  objective: "By the end of this mission, you'll be able to explain cells in your own words.",
  bdHook: "Bangladesh everyday: notice cells around you — then connect it to Cell City.",
  predict: {
    q: "Before we start — what do you think matters most in Cell City?",
    options: [
      "Guessing without checking",
      "Looking for a clear pattern or rule",
      "Skipping the practice steps",
    ],
    ok: 1,
  },

  kidTitle: "Cell City",
  theme: "cells",
  emoji: "🔬",
  rewardName: "Cell Scout",
  intro: "Living things are made of tiny living rooms called cells - the basic units of life.",
  everyday: ["Skin cells", "Mango leaf cells", "Pond microbes"],
  subTitles: [
    "Meet Cell City",
    "Zoom Lab",
    "Sort: Cell Stories",
    "Membrane Peek",
    "Cell Jobs",
    "Name the Cell Rule",
    "Stretch: New Contexts",
    "Myth Bust",
    "Fluency Drill",
    "Cell Scout Mastery",
  ],
};

export function runL2Sub(subIndex, api) {
  const { registerTryAgain } = api;
  bioLabState.reveal = false;
  bioLabState.tokenProgress = 0;
  bioLabState.masteryStep = 0;
  bioLabState.placed = {};
  bioLabState.selectedId = null;
  bioLabState.mythPhase = "claim";
  bioLabState.cellZoom = 0.2;
  bioLabState.heat = 0.2;
  bioLabState.phase = "wall";
  bioLabState.mode = "pond";

  const runners = [
    sub1_meet,
    sub2_zoom,
    sub3_sort,
    sub4_membrane,
    sub5_jobs,
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
  setCoach("Hook: bricks make a wall - cells make a body.");
  mountMotionChain(overlay, {
    title: "Meet Cell City",
    beats: [
      {
        scene: "cellMeet",
        sceneArgs: { phase: "wall" },
        dwellMs: 4000,
        html: `${badgeHtml(BIO_ASSET_PATHS.cell, "cell")}
          <p><strong>Act 1:</strong> Bricks -> wall. Cells -> living body.</p>`,
      },
      {
        scene: "cellMeet",
        sceneArgs: { phase: "zoom" },
        dwellMs: 4500,
        html: `<p><strong>Act 2:</strong> Zoom into one cell - a tiny living room.</p>`,
      },
      {
        scene: "cellMeet",
        sceneArgs: { phase: "settle" },
        dwellMs: 4000,
        html: `<p><strong>Act 3:</strong> Big idea - cells are the basic units of life.</p>`,
      },
    ],
    onDone: () => {
      mountQuiz(overlay, {
        scene: "cellMeet",
        sceneArgs: { phase: "settle" },
        title: "Exit check",
        q: "What are the basic living units that make up plants and animals?",
        opts: ["Cells", "Bricks", "Only organs", "Only atoms"],
        ok: 0,
        onDone: () => {
          mountTapContinue(overlay, {
            scene: "cellMeet",
            badge: BIO_ASSET_PATHS.cell,
            html: `<h3>Welcome to Cell City</h3><p>Next: drag-zoom into membrane and nucleus jobs.</p>`,
            onDone: completeSub,
            advanceAfterDone: true,
          });
        },
      });
    },
  });
}

function sub2_zoom({ overlay, setCoach, completeSub }) {
  setCoach("Lab: zoom into membrane (door) and nucleus (office).");
  bioLabState.heat = 0.25;
  bioLabState.cellZoom = 0.25;
  mountHeatLab(overlay, {
    scene: "cellLab",
    title: "Zoom Lab",
    html: `<p>Drag the zoom handle - peek membrane and nucleus.</p>`,
    goalText: "Goal: zoom ≥ 65%.",
    doneLabel: "Zoom checked ▶",
    threshold: 0.65,
    startHeat: 0.25,
    axis: "x",
    canvasAction: "stretch",
    sliderLabel: "Zoom",
    syncKey: "cellZoom",
    readoutLabels: {
      cold: "Far view - whole cell",
      melting: "Membrane edge",
      liquid: "Nucleus office",
      simmer: "Cell City jobs visible!",
    },
    badge: BIO_ASSET_PATHS.cell,
    onDone: completeSub,
  });
}

function sub3_sort({ overlay, setCoach, completeSub }) {
  setCoach("Sort: one cell, many cells, or not a cell story.");
  mountTapContinue(overlay, {
    scene: "cellSort",
    html: `<h3>Cell stories</h3>
      <p><strong>A cell:</strong> skin, leaf, pond microbe.</p>
      <p><strong>Many cells:</strong> tissue, organ.</p>
      <p><strong>Not a cell:</strong> brick, atom, phone.</p>`,
    onDone: () => {
      mountDragSort(overlay, {
        scene: "cellSort",
        title: "Sort cell stories",
        instructions: "Drag into A cell, Many cells, or Not a cell.",
        successText: "Cell City sorted!",
        chips: [
          { id: "skin", text: "Skin cell", short: "Skin", color: 0xfbbf24 },
          { id: "leaf", text: "Leaf cell", short: "Leaf", color: 0x22c55e },
          { id: "pond", text: "Pond microbe", short: "Microbe", color: 0x38bdf8 },
          { id: "brick", text: "Clay brick", short: "Brick", color: 0x78716c },
          { id: "atom", text: "Atom", short: "Atom", color: 0xa78bfa },
          { id: "tissue", text: "Muscle tissue", short: "Tissue", color: 0xf472b6 },
          { id: "organ", text: "Heart organ", short: "Organ", color: 0xf87171 },
          { id: "phone", text: "Phone", short: "Phone", color: 0x94a3b8 },
        ],
        zones: [
          { id: "cell", label: "A cell", accept: ["skin", "leaf", "pond"] },
          { id: "many", label: "Many cells", accept: ["tissue", "organ"] },
          { id: "not", label: "Not a cell", accept: ["brick", "atom", "phone"] },
        ],
        onDone: completeSub,
      });
    },
  });
}

function sub4_membrane({ overlay, setCoach, completeSub }) {
  setCoach("Membrane is the cell’s door - controls what goes in/out (kid level).");
  bioLabState.heat = 0.5;
  bioLabState.cellZoom = 0.5;
  mountHeatLab(overlay, {
    scene: "cellLab",
    title: "Membrane Peek",
    html: `<p>Zoom past 70% - notice the membrane edge around the cell.</p>`,
    goalText: "Goal: zoom ≥ 70%.",
    doneLabel: "Membrane peeked ▶",
    threshold: 0.7,
    startHeat: 0.5,
    axis: "x",
    canvasAction: "stretch",
    sliderLabel: "Zoom",
    syncKey: "cellZoom",
    badge: BIO_ASSET_PATHS.cell,
    onDone: () => {
      mountQuiz(overlay, {
        scene: "cellLab",
        title: "Check",
        q: "The membrane mainly acts like a...",
        opts: ["Door / boundary for the cell", "Wheel", "Battery charger", "Brick wall with no doors"],
        ok: 0,
        onDone: completeSub,
      });
    },
  });
}

function sub5_jobs({ overlay, setCoach, completeSub }) {
  setCoach("Nucleus is like a city office - it helps run the cell (kid metaphor).");
  mountOrderSteps(overlay, {
    scene: "cellMeet",
    sceneArgs: { phase: "settle" },
    title: "Cell jobs",
    instructions: "Order simple cell-city jobs.",
    items: [
      { id: "door", html: "Membrane = door" },
      { id: "office", html: "Nucleus = office" },
      { id: "room", html: "Whole cell = living room" },
      { id: "city", html: "Many cells = body city" },
    ],
    correctIds: ["door", "office", "room", "city"],
    onDone: completeSub,
  });
}

function sub6_rule({ overlay, setCoach, completeSub }) {
  setCoach("Build: living things are made of cells.");
  mountEquationBuild(overlay, {
    scene: "cellRule",
    title: "Name the Cell Rule",
    instructions: "Tap tokens in order.",
    tokens: [
      { id: "a", html: "Living" },
      { id: "b", html: "things" },
      { id: "c", html: "are made" },
      { id: "d", html: "of cells" },
    ],
    correctIds: ["a", "b", "c", "d"],
    badge: BIO_ASSET_PATHS.cellRule,
    onDone: () => {
      mountTapContinue(overlay, {
        scene: "cellRule",
        badge: BIO_ASSET_PATHS.cellRule,
        html: `<h3>Cell rule locked</h3><p>Cells are the basic units of life.</p>`,
        onDone: completeSub,
        advanceAfterDone: true,
      });
    },
  });
}

function sub7_stretch({ overlay, setCoach, completeSub }) {
  setCoach("Same cell idea in pond, leaf, skin, yeast, blood.");
  mountTapContinue(overlay, {
    scene: "cellStretch",
    html: `<h3>Stretch</h3><p>Tap modes - cells show up in many living places.</p>`,
    onDone: () => {
      mountQuiz(overlay, {
        scene: "cellStretch",
        title: "Transfer",
        q: "Yeast used in bread dough is...",
        opts: ["Living cells (fungus)", "Just flour dust", "Plastic beads", "Only atoms with no cells"],
        ok: 0,
        onDone: completeSub,
      });
    },
  });
}

function sub8_myths({ overlay, setCoach, completeSub }) {
  setCoach("Bust cell myths.");
  mountMythCards(overlay, {
    scene: "cellMyth",
    title: "Myth Bust",
    badge: BIO_ASSET_PATHS.myth,
    myths: [
      { claim: "Only animals have cells", truth: "Plants, fungi, and microbes have cells too", sceneMyth: 0 },
      { claim: "Cells are the same as atoms", truth: "Atoms are much smaller; cells are living units", sceneMyth: 1 },
      { claim: "Blood isn’t made of cells", truth: "Blood contains living cells (and plasma)", sceneMyth: 2 },
      { claim: "A brick is a cell", truth: "Bricks are only an analogy - not alive", sceneMyth: 3 },
      { claim: "One cell can’t be a whole organism", truth: "Many pond microbes are one-celled organisms", sceneMyth: 4 },
    ],
    onDone: completeSub,
  });
}

function sub9_drill({ overlay, setCoach, completeSub }) {
  setCoach("Quick cell fluency.");
  mountSpeedDrill(overlay, {
    scene: "cellDrill",
    title: "Fluency Drill",
    passScene: "cellMastery",
    items: [
      { q: "Skin cell - a cell?", opts: ["Yes", "No"], ok: 0, prompt: "Skin" },
      { q: "Clay brick - a cell?", opts: ["Yes", "No"], ok: 1, prompt: "Brick" },
      { q: "Heart - many cells?", opts: ["Yes", "No"], ok: 0, prompt: "Heart" },
      { q: "Atom - a cell?", opts: ["Yes", "No"], ok: 1, prompt: "Atom" },
      { q: "Pond microbe - can be one cell?", opts: ["Yes", "No"], ok: 0, prompt: "Microbe" },
      { q: "Phone - a cell?", opts: ["Yes", "No"], ok: 1, prompt: "Phone" },
    ],
    onDone: completeSub,
  });
}

function sub10_mastery({ overlay, setCoach, completeSub }) {
  setCoach("Mastery - Cell Scout.");
  mountOrderSteps(overlay, {
    scene: "cellMastery",
    title: "Cell Scout Mastery",
    instructions: "Order your Cell City journey.",
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
        scene: "cellMastery",
        badge: BIO_ASSET_PATHS.cell,
        html: `<h3>🔬 Cell Scout!</h3><p>You know cells are the basic units of life.</p>`,
        onDone: completeSub,
        advanceAfterDone: true,
      });
    },
  });
}
