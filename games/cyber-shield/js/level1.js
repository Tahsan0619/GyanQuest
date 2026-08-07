/**
 * Cyber Shield - Mission 1: Password Power (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
  mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
  mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L1_META = {
  objective: "By the end of this mission, you'll be able to explain long unique secrets beat short easy ones in your own words.",
  bdHook: "Bangladesh everyday: notice long unique secrets beat short easy ones around you — then connect it to Password Power.",
  predict: {
    q: "Before we start — what do you think matters most in Password Power?",
    options: [
      "Guessing without checking",
      "Looking for a clear pattern or rule",
      "Skipping the practice steps",
    ],
    ok: 1,
  },

  kidTitle: "Password Power",
  theme: "long unique secrets beat short easy ones",
  emoji: "\ud83d\udd10",
  rewardName: "Password Pro",
  intro: "Strong passwords are long, unique, and hard to guess - not your name or 1234.",
  everyday: [
    "School login",
    "Game account",
    "Family email"
  ],
  subTitles: [
    "Meet Passwords",
    "Watch Strength Dial",
    "Sort Strong vs Weak",
    "Stronger Secret Lab",
    "Why Length Helps",
    "Name the Password Rule",
    "Stretch: Places",
    "Myth Bust",
    "Fluency Drill",
    "Password Pro Mastery"
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
  setCoach("Hook: long unique secrets beat short easy ones.");
  mountMotionChain(overlay, {
    title: "Meet Passwords",
    beats: [
      { scene: "passMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000, html: `${badgeHtml(LAB_ASSET_PATHS.m1, "pass")}<p><strong>Act 1:</strong> See a short easy password get guessed fast.</p>` },
      { scene: "passMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200, html: `<p><strong>Act 2:</strong> A longer unique secret lights a stronger shield.</p>` },
      { scene: "passMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000, html: `<p><strong>Act 3:</strong> One password per important account - do not reuse.</p>` }
    ],
    onDone: () => mountQuiz(overlay, {
      scene: "passMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
      q: "Which password idea is safest?",
      opts: ["Long, unique, hard to guess", "Your name plus 1234", "The same short password everywhere", "Writing it on the classroom board"],
      ok: 0, onDone: () => mountTapContinue(overlay, {
        scene: "passMeet", badge: LAB_ASSET_PATHS.m1,
        html: `<h3>Shield ready</h3><p>Next: dial password strength.</p>`,
        onDone: completeSub, advanceAfterDone: true,
      }),
    }),
  });
}

function s2({ overlay, setCoach, completeSub }) {
  setCoach("Raise password strength to the goal.");
  labState.heat = 0.25;
  mountHeatLab(overlay, {
    scene: "passLab", title: "Watch Strength Dial",
    html: `<p>Drag until strength &gt;= 60%.</p>`,
    goalText: "Goal >= 60%", doneLabel: "Dial checked", threshold: 0.6, startHeat: 0.25,
    axis: "x", canvasAction: "stretch", sliderLabel: "Strength", badge: LAB_ASSET_PATHS.m1,
    onDone: completeSub,
  });
}

function s3({ overlay, setCoach, completeSub }) {
  setCoach("Sort strong, weak, and tricky secrets.");
  mountTapContinue(overlay, {
    scene: "passSort",
    html: `<h3>Guide</h3><p><strong>Strong:</strong> long unique phrases.<br><strong>Weak:</strong> name, 1234, password.<br><strong>Tricky:</strong> reused "strong" password on many sites.</p>`,
    onDone: () => mountDragSort(overlay, {
      scene: "passSort", title: "Sort Strong vs Weak",
      instructions: "Drag into Strong / Weak / Tricky.",
      successText: "Password sorts locked!",
      chips: [
        { id: "long", text: "Long unique phrase", short: "Long", color: 2278750 },
        { id: "mix", text: "Mixed letters+digits", short: "Mixed", color: 4906624 },
        { id: "uniq", text: "Unique per account", short: "Unique", color: 3718648 },
        { id: "name", text: "Your name123", short: "Name", color: 16281969 },
        { id: "num", text: "123456", short: "1234", color: 15680580 },
        { id: "word", text: "password", short: "password", color: 9741240 },
        { id: "reuse", text: "Same "strong" everywhere", short: "Reuse", color: 16347926 },
        { id: "board", text: "Written on board", short: "Board", color: 7893356 }
      ],
      zones: [
        { id: "strong", label: "Strong", accept: ["long", "mix", "uniq"] },
        { id: "weak", label: "Weak", accept: ["name", "num", "word", "board"] },
        { id: "tricky", label: "Tricky", accept: ["reuse"] }
      ],
      onDone: completeSub,
    }),
  });
}

function s4({ overlay, setCoach, completeSub }) {
  setCoach("Push strength higher.");
  labState.heat = 0.4;
  mountHeatLab(overlay, {
    scene: "passLab", title: "Stronger Secret Lab", html: `<p>Reach strength &gt;= 75%.</p>`,
    goalText: "Goal >= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
    axis: "x", canvasAction: "stretch", sliderLabel: "Strength", badge: LAB_ASSET_PATHS.m1,
    onDone: completeSub,
  });
}

function s5({ overlay, setCoach, completeSub }) {
  setCoach("Order how a strong password is built.");
  mountOrderSteps(overlay, {
    scene: "passMeet", sceneArgs: { phase: "settle" }, title: "Why Length Helps",
    instructions: "Order the story.",
    items: [
      { id: "long", html: "Make it long enough" },
      { id: "unique", html: "Keep it unique per account" },
      { id: "hard", html: "Avoid names and 1234" },
      { id: "store", html: "Store safely - never share" }
    ],
    correctIds: ["long", "unique", "hard", "store"],
    onDone: () => mountQuiz(overlay, {
      scene: "passMeet", title: "Check",
      q: "Reusing one password on every site is risky because...",
      opts: ["One leak can open many accounts", "It makes every site safer", "Hackers dislike reuse", "Length no longer matters"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s6({ overlay, setCoach, completeSub }) {
  setCoach("Lock: long + unique + hard to guess.");
  mountEquationBuild(overlay, {
    scene: "passRule", title: "Name the Password Rule", instructions: "Tap in order.",
    tokens: [ { id: "a", html: "Long" }, { id: "b", html: "+ unique" }, { id: "c", html: "=" }, { id: "d", html: "stronger" } ],
    correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
    onDone: () => mountTapContinue(overlay, {
      scene: "passRule", badge: LAB_ASSET_PATHS.rule,
      html: `<h3>Rule locked</h3><p>Long + unique + hard to guess = stronger password.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}

function s7({ overlay, setCoach, completeSub }) {
  setCoach("School, game, email, BD shop Wi-Fi, lab.");
  mountTapContinue(overlay, {
    scene: "passStretch", html: `<h3>Places</h3><p>Tap each mode - same core idea.</p>`,
    onDone: () => mountQuiz(overlay, {
      scene: "passStretch", title: "Transfer",
      q: "For a school login you should...",
      opts: ["Use a long unique secret and not share it", "Write it on the board", "Use 1234 for speed", "Reuse your game password everywhere"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s8({ overlay, setCoach, completeSub }) {
  setCoach("Bust password myths.");
  mountMythCards(overlay, {
    scene: "passMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
    myths: [
      { claim: "Short passwords are fine if secret", truth: "Short easy secrets are guessed faster", sceneMyth: 0 },
      { claim: "Name + birthday is clever", truth: "Personal facts are easy to try", sceneMyth: 1 },
      { claim: "One password for all sites is smart", truth: "Reuse spreads damage after one leak", sceneMyth: 2 },
      { claim: "Sharing with friends is okay", truth: "Passwords are private keys - do not share", sceneMyth: 3 },
      { claim: "Kids cannot make strong secrets", truth: "Kids can use long unique phrases safely", sceneMyth: 4 }
    ],
    onDone: completeSub,
  });
}

function s9({ overlay, setCoach, completeSub }) {
  setCoach("Quick password fluency.");
  mountSpeedDrill(overlay, {
    scene: "passDrill", title: "Fluency Drill", passScene: "passMastery",
    items: [
      { q: "Longer usually stronger?", opts: ["Yes", "No"], ok: 0, prompt: "Long?" },
      { q: "Is 1234 strong?", opts: ["No", "Yes"], ok: 0, prompt: "1234?" },
      { q: "Reuse everywhere?", opts: ["No", "Yes"], ok: 0, prompt: "Reuse?" },
      { q: "Share on the board?", opts: ["No", "Yes"], ok: 0, prompt: "Share?" },
      { q: "Unique per account helps?", opts: ["Yes", "No"], ok: 0, prompt: "Unique?" },
      { q: "Name123 is weak?", opts: ["Yes", "No"], ok: 0, prompt: "Name?" }
    ],
    onDone: completeSub,
  });
}

function s10({ overlay, setCoach, completeSub }) {
  setCoach("Mastery - Password Pro.");
  mountOrderSteps(overlay, {
    scene: "passMastery", title: "Password Pro Mastery", instructions: "Order your journey.",
    items: [ { id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" }, { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "pass", html: "Pass" } ],
    correctIds: ["meet", "sort", "lab", "rule", "myth", "pass"],
    onDone: () => mountTapContinue(overlay, {
      scene: "passMastery", badge: LAB_ASSET_PATHS.m1,
      html: `<h3>\ud83d\udd10 Password Pro!</h3><p>You can pick long unique passwords and avoid weak ones.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}
