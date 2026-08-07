/**
 * Machine Learning - Mission 1: Teach the Model (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
  mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
  mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L1_META = {
  objective: "By the end of this mission, you'll be able to explain train vs test - more good examples in your own words.",
  bdHook: "Bangladesh everyday: notice train vs test - more good examples around you — then connect it to Teach the Model.",
  predict: {
    q: "Before we start — what do you think matters most in Teach the Model?",
    options: [
      "Guessing without checking",
      "Looking for a clear pattern or rule",
      "Skipping the practice steps",
    ],
    ok: 1,
  },

  kidTitle: "Teach the Model",
  theme: "train vs test - more good examples",
  emoji: "\ud83c\udf93",
  rewardName: "Model Mentor",
  intro: "A model learns from training examples, then we test it on new ones it has not memorized.",
  everyday: [
    "Sorting fruit photos",
    "Handwriting samples",
    "Spam vs real mail"
  ],
  subTitles: [
    "Meet Training",
    "Watch Train Dial",
    "Sort Train vs Test",
    "Stronger Train Lab",
    "Why Models Learn",
    "Name the Train Rule",
    "Stretch: Places",
    "Myth Bust",
    "Fluency Drill",
    "Model Mentor Mastery"
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
  setCoach("Hook: feed good examples, then test on fresh ones.");
  mountMotionChain(overlay, {
    title: "Meet Training",
    beats: [
      { scene: "mlMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000, html: `${badgeHtml(LAB_ASSET_PATHS.m1, "ml")}<p><strong>Act 1:</strong> Stack labeled examples the model can study.</p>` },
      { scene: "mlMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200, html: `<p><strong>Act 2:</strong> Training glow - the model adjusts from those examples.</p>` },
      { scene: "mlMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000, html: `<p><strong>Act 3:</strong> Hold out a fresh test set - no peeking during train.</p>` }
    ],
    onDone: () => mountQuiz(overlay, {
      scene: "mlMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
      q: "What is the fair way to check a model?",
      opts: ["Test on new examples it did not train on", "Only reuse the exact training set", "Never check at all", "Delete all labels"],
      ok: 0, onDone: () => mountTapContinue(overlay, {
        scene: "mlMeet", badge: LAB_ASSET_PATHS.m1,
        html: `<h3>Train ready</h3><p>Next: dial training strength.</p>`,
        onDone: completeSub, advanceAfterDone: true,
      }),
    }),
  });
}

function s2({ overlay, setCoach, completeSub }) {
  setCoach("Add training strength until the model looks ready.");
  labState.heat = 0.25;
  mountHeatLab(overlay, {
    scene: "mlLab", title: "Watch Train Dial",
    html: `<p>Drag until training strength &gt;= 60%.</p>`,
    goalText: "Goal >= 60%", doneLabel: "Dial checked", threshold: 0.6, startHeat: 0.25,
    axis: "x", canvasAction: "stretch", sliderLabel: "Train", badge: LAB_ASSET_PATHS.m1,
    onDone: completeSub,
  });
}

function s3({ overlay, setCoach, completeSub }) {
  setCoach("Sort train examples, test examples, and junk.");
  mountTapContinue(overlay, {
    scene: "mlSort",
    html: `<h3>Guide</h3><p><strong>Train:</strong> labeled examples used to teach.<br><strong>Test:</strong> fresh examples for checking.<br><strong>Junk:</strong> blank / wrong labels.</p>`,
    onDone: () => mountDragSort(overlay, {
      scene: "mlSort", title: "Sort Train vs Test",
      instructions: "Drag into Train / Test / Junk.",
      successText: "Train vs test sorted!",
      chips: [
        { id: "t1", text: "Labeled mango photo", short: "Train A", color: 16020150 },
        { id: "t2", text: "Labeled banana photo", short: "Train B", color: 16478597 },
        { id: "t3", text: "Labeled apple photo", short: "Train C", color: 2278750 },
        { id: "x1", text: "Fresh fruit photo", short: "Test A", color: 3718648 },
        { id: "x2", text: "New handwriting", short: "Test B", color: 959977 },
        { id: "j1", text: "Blank card", short: "Blank", color: 9741240 },
        { id: "j2", text: "Wrong label mess", short: "Wrong", color: 16347926 },
        { id: "t4", text: "More labeled samples", short: "Train D", color: 10980346 }
      ],
      zones: [
        { id: "train", label: "Train set", accept: ["t1", "t2", "t3", "t4"] },
        { id: "test", label: "Test set", accept: ["x1", "x2"] },
        { id: "junk", label: "Junk", accept: ["j1", "j2"] }
      ],
      onDone: completeSub,
    }),
  });
}

function s4({ overlay, setCoach, completeSub }) {
  setCoach("Push training quality higher.");
  labState.heat = 0.4;
  mountHeatLab(overlay, {
    scene: "mlLab", title: "Stronger Train Lab", html: `<p>Reach training strength &gt;= 75%.</p>`,
    goalText: "Goal >= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
    axis: "x", canvasAction: "stretch", sliderLabel: "Train", badge: LAB_ASSET_PATHS.m1,
    onDone: completeSub,
  });
}

function s5({ overlay, setCoach, completeSub }) {
  setCoach("Order how teaching a model works.");
  mountOrderSteps(overlay, {
    scene: "mlMeet", sceneArgs: { phase: "settle" }, title: "Why Models Learn",
    instructions: "Order the story.",
    items: [
      { id: "collect", html: "Collect labeled examples" },
      { id: "train", html: "Train the model on them" },
      { id: "test", html: "Test on fresh examples" },
      { id: "improve", html: "Improve with better data" }
    ],
    correctIds: ["collect", "train", "test", "improve"],
    onDone: () => mountQuiz(overlay, {
      scene: "mlMeet", title: "Check",
      q: "Using only the training set to "prove" success is...",
      opts: ["Unfair - it may have memorized", "The only correct method", "Required by light switches", "How clocks work"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s6({ overlay, setCoach, completeSub }) {
  setCoach("Lock: train on examples, test on new ones.");
  mountEquationBuild(overlay, {
    scene: "mlRule", title: "Name the Train Rule", instructions: "Tap in order.",
    tokens: [ { id: "a", html: "Train" }, { id: "b", html: "on examples" }, { id: "c", html: "->" }, { id: "d", html: "test new" } ],
    correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
    onDone: () => mountTapContinue(overlay, {
      scene: "mlRule", badge: LAB_ASSET_PATHS.rule,
      html: `<h3>Rule locked</h3><p>Train on examples -> test on new ones you held out.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}

function s7({ overlay, setCoach, completeSub }) {
  setCoach("Fruit, handwriting, mail, BD shop tags, lab.");
  mountTapContinue(overlay, {
    scene: "mlStretch", html: `<h3>Places</h3><p>Tap each mode - same core idea.</p>`,
    onDone: () => mountQuiz(overlay, {
      scene: "mlStretch", title: "Transfer",
      q: "Spam filters improve when you...",
      opts: ["Give more correctly labeled mail examples", "Never check on new mail", "Remove all labels", "Only use blank cards"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s8({ overlay, setCoach, completeSub }) {
  setCoach("Bust ML myths.");
  mountMythCards(overlay, {
    scene: "mlMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
    myths: [
      { claim: "More random junk always helps", truth: "Quality labeled examples matter more than junk", sceneMyth: 0 },
      { claim: "Testing on the train set is enough", truth: "Hold out fresh examples to check for real", sceneMyth: 1 },
      { claim: "Models never need updates", truth: "Better data and checks improve them", sceneMyth: 2 },
      { claim: "One example teaches everything", truth: "Many varied examples usually teach better", sceneMyth: 3 },
      { claim: "Kids cannot teach a simple model idea", truth: "Train vs test is a kid-friendly rule", sceneMyth: 4 }
    ],
    onDone: completeSub,
  });
}

function s9({ overlay, setCoach, completeSub }) {
  setCoach("Quick train/test fluency.");
  mountSpeedDrill(overlay, {
    scene: "mlDrill", title: "Fluency Drill", passScene: "mlMastery",
    items: [
      { q: "Train set teaches the model?", opts: ["Yes", "No"], ok: 0, prompt: "Train?" },
      { q: "Test should be fresh?", opts: ["Yes", "No"], ok: 0, prompt: "Fresh?" },
      { q: "Blank cards help training?", opts: ["No", "Yes"], ok: 0, prompt: "Blank?" },
      { q: "Wrong labels hurt?", opts: ["Yes", "No"], ok: 0, prompt: "Wrong?" },
      { q: "Memorizing train = mastery?", opts: ["No", "Yes"], ok: 0, prompt: "Memo?" },
      { q: "More good examples help?", opts: ["Yes", "No"], ok: 0, prompt: "More?" }
    ],
    onDone: completeSub,
  });
}

function s10({ overlay, setCoach, completeSub }) {
  setCoach("Mastery - Model Mentor.");
  mountOrderSteps(overlay, {
    scene: "mlMastery", title: "Model Mentor Mastery", instructions: "Order your journey.",
    items: [ { id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" }, { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "ml", html: "Ml" } ],
    correctIds: ["meet", "sort", "lab", "rule", "myth", "ml"],
    onDone: () => mountTapContinue(overlay, {
      scene: "mlMastery", badge: LAB_ASSET_PATHS.m1,
      html: `<h3>\ud83c\udf93 Model Mentor!</h3><p>You can teach with a train set and check with a test set.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}
