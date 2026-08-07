/**
 * Artificial Intelligence - Mission 1: What is AI? (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
  mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
  mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L1_META = {
  objective: "By the end of this mission, you'll be able to explain patterns from examples, not magic in your own words.",
  bdHook: "Bangladesh everyday: notice patterns from examples, not magic around you — then connect it to What is AI?.",
  predict: {
    q: "Before we start — what do you think matters most in What is AI??",
    options: [
      "Guessing without checking",
      "Looking for a clear pattern or rule",
      "Skipping the practice steps",
    ],
    ok: 1,
  },

  kidTitle: "What is AI?",
  theme: "patterns from examples, not magic",
  emoji: "\ud83e\udde0",
  rewardName: "AI Rookie",
  intro: "AI spots patterns in examples - it is not magic and it does not think like a person.",
  everyday: [
    "Phone photo tags",
    "Voice assistant guesses",
    "Map route suggestions"
  ],
  subTitles: [
    "Meet AI",
    "Watch Pattern Dial",
    "Sort: AI or Not?",
    "Stronger Pattern Lab",
    "Why AI Guesses",
    "Name the AI Rule",
    "Stretch: Places",
    "Myth Bust",
    "Fluency Drill",
    "AI Rookie Mastery"
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
  setCoach("Hook: AI finds patterns in examples - not magic brains.");
  mountMotionChain(overlay, {
    title: "Meet AI",
    beats: [
      { scene: "aiMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000, html: `${badgeHtml(LAB_ASSET_PATHS.m1, "ai")}<p><strong>Act 1:</strong> See photos, voice, and maps - tools that guess from past examples.</p>` },
      { scene: "aiMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200, html: `<p><strong>Act 2:</strong> Patterns light up - similar inputs lead to similar outputs.</p>` },
      { scene: "aiMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000, html: `<p><strong>Act 3:</strong> AI is pattern spotting from data - not a human mind inside the box.</p>` }
    ],
    onDone: () => mountQuiz(overlay, {
      scene: "aiMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
      q: "What does AI mainly do with examples?",
      opts: ["Spot patterns to make a guess", "Feel emotions like a person", "Skip all data forever", "Only store passwords"],
      ok: 0, onDone: () => mountTapContinue(overlay, {
        scene: "aiMeet", badge: LAB_ASSET_PATHS.m1,
        html: `<h3>AI ready</h3><p>Next: dial pattern clarity.</p>`,
        onDone: completeSub, advanceAfterDone: true,
      }),
    }),
  });
}

function s2({ overlay, setCoach, completeSub }) {
  setCoach("Turn up pattern clarity until the guess looks solid.");
  labState.heat = 0.25;
  mountHeatLab(overlay, {
    scene: "aiLab", title: "Watch Pattern Dial",
    html: `<p>Drag until pattern clarity &gt;= 60%.</p>`,
    goalText: "Goal >= 60%", doneLabel: "Dial checked", threshold: 0.6, startHeat: 0.25,
    axis: "x", canvasAction: "stretch", sliderLabel: "Pattern", badge: LAB_ASSET_PATHS.m1,
    onDone: completeSub,
  });
}

function s3({ overlay, setCoach, completeSub }) {
  setCoach("Sort real AI tools, not-AI tools, and tricky lookalikes.");
  mountTapContinue(overlay, {
    scene: "aiSort",
    html: `<h3>Guide</h3><p><strong>AI:</strong> photo tagger, voice helper, map suggest.<br><strong>Not AI:</strong> plain calculator, light switch.<br><strong>Tricky:</strong> scripted chatbot FAQ.</p>`,
    onDone: () => mountDragSort(overlay, {
      scene: "aiSort", title: "Sort: AI or Not?",
      instructions: "Drag into AI tool / Not AI / Tricky.",
      successText: "AI sorts locked!",
      chips: [
        { id: "photo", text: "Photo tagger", short: "Photos", color: 12616956 },
        { id: "voice", text: "Voice helper", short: "Voice", color: 10980346 },
        { id: "map", text: "Map route guess", short: "Maps", color: 3718648 },
        { id: "calc", text: "Plain calculator", short: "Calc", color: 9741240 },
        { id: "switch", text: "Light switch", short: "Switch", color: 7893356 },
        { id: "faq", text: "Fixed FAQ bot", short: "FAQ bot", color: 16347926 },
        { id: "spell", text: "Spell check suggest", short: "Spell", color: 2278750 },
        { id: "clock", text: "Wall clock", short: "Clock", color: 6583435 }
      ],
      zones: [
        { id: "ai", label: "AI tool", accept: ["photo", "voice", "map", "spell"] },
        { id: "not", label: "Not AI", accept: ["calc", "switch", "clock"] },
        { id: "tricky", label: "Tricky", accept: ["faq"] }
      ],
      onDone: completeSub,
    }),
  });
}

function s4({ overlay, setCoach, completeSub }) {
  setCoach("Push pattern strength higher for a clearer guess.");
  labState.heat = 0.4;
  mountHeatLab(overlay, {
    scene: "aiLab", title: "Stronger Pattern Lab", html: `<p>Reach pattern clarity &gt;= 75%.</p>`,
    goalText: "Goal >= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
    axis: "x", canvasAction: "stretch", sliderLabel: "Pattern", badge: LAB_ASSET_PATHS.m1,
    onDone: completeSub,
  });
}

function s5({ overlay, setCoach, completeSub }) {
  setCoach("Order how an AI guess is made.");
  mountOrderSteps(overlay, {
    scene: "aiMeet", sceneArgs: { phase: "settle" }, title: "Why AI Guesses",
    instructions: "Order the story.",
    items: [
      { id: "data", html: "Collect many examples" },
      { id: "pattern", html: "Find patterns in the data" },
      { id: "guess", html: "Make a guess on new input" },
      { id: "check", html: "Check and improve with feedback" }
    ],
    correctIds: ["data", "pattern", "guess", "check"],
    onDone: () => mountQuiz(overlay, {
      scene: "aiMeet", title: "Check",
      q: "If the examples are messy, the AI guess often...",
      opts: ["Gets worse or biased", "Becomes perfect forever", "Stops needing data", "Turns into a light switch"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s6({ overlay, setCoach, completeSub }) {
  setCoach("Lock: AI learns patterns from examples.");
  mountEquationBuild(overlay, {
    scene: "aiRule", title: "Name the AI Rule", instructions: "Tap in order.",
    tokens: [ { id: "a", html: "AI" }, { id: "b", html: "learns" }, { id: "c", html: "patterns" }, { id: "d", html: "from examples" } ],
    correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
    onDone: () => mountTapContinue(overlay, {
      scene: "aiRule", badge: LAB_ASSET_PATHS.rule,
      html: `<h3>Rule locked</h3><p>AI learns patterns from examples - then guesses on new cases.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}

function s7({ overlay, setCoach, completeSub }) {
  setCoach("Home, school, street, BD shop, lab - same idea.");
  mountTapContinue(overlay, {
    scene: "aiStretch", html: `<h3>Places</h3><p>Tap each mode - same core idea.</p>`,
    onDone: () => mountQuiz(overlay, {
      scene: "aiStretch", title: "Transfer",
      q: "A photo app tags your cat because...",
      opts: ["It saw many cat photo patterns before", "It feels love for cats", "It ignores all photos", "It is a plain light switch"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s8({ overlay, setCoach, completeSub }) {
  setCoach("Bust AI myths.");
  mountMythCards(overlay, {
    scene: "aiMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
    myths: [
      { claim: "AI is a magic brain that thinks like humans", truth: "AI spots statistical patterns in examples", sceneMyth: 0 },
      { claim: "AI never needs data", truth: "Good examples are the fuel for pattern learning", sceneMyth: 1 },
      { claim: "One wrong guess means AI is useless", truth: "Guesses improve with better data and checks", sceneMyth: 2 },
      { claim: "Every automated button is AI", truth: "Simple switches and fixed scripts are not AI", sceneMyth: 3 },
      { claim: "Only adults can understand AI", truth: "Kids can learn: examples -> patterns -> guesses", sceneMyth: 4 }
    ],
    onDone: completeSub,
  });
}

function s9({ overlay, setCoach, completeSub }) {
  setCoach("Quick AI fluency.");
  mountSpeedDrill(overlay, {
    scene: "aiDrill", title: "Fluency Drill", passScene: "aiMastery",
    items: [
      { q: "AI mainly spots...?", opts: ["Patterns", "Feelings"], ok: 0, prompt: "Spot?" },
      { q: "Does AI need examples?", opts: ["Yes", "Never"], ok: 0, prompt: "Data?" },
      { q: "Is a light switch AI?", opts: ["No", "Yes"], ok: 0, prompt: "Switch?" },
      { q: "Can AI guesses be wrong?", opts: ["Yes", "Never"], ok: 0, prompt: "Wrong?" },
      { q: "Is AI the same as a human mind?", opts: ["No", "Yes"], ok: 0, prompt: "Mind?" },
      { q: "Better examples can help?", opts: ["Yes", "No"], ok: 0, prompt: "Better?" }
    ],
    onDone: completeSub,
  });
}

function s10({ overlay, setCoach, completeSub }) {
  setCoach("Mastery - AI Rookie.");
  mountOrderSteps(overlay, {
    scene: "aiMastery", title: "AI Rookie Mastery", instructions: "Order your journey.",
    items: [ { id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" }, { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "ai", html: "Ai" } ],
    correctIds: ["meet", "sort", "lab", "rule", "myth", "ai"],
    onDone: () => mountTapContinue(overlay, {
      scene: "aiMastery", badge: LAB_ASSET_PATHS.m1,
      html: `<h3>\ud83e\udde0 AI Rookie!</h3><p>You can explain AI as pattern spotting from examples.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}
