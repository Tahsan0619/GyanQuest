/**
 * Statistics & Probability - Mission 1: Mean & Mode (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
  mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
  mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L1_META = {
  objective: "By the end of this mission, you'll be able to explain averages / typical values in your own words.",
  bdHook: "Bangladesh everyday: notice averages / typical values around you — then connect it to Mean & Mode.",
  predict: {
    q: "Before we start — what do you think matters most in Mean & Mode?",
    options: [
      "Guessing without checking",
      "Looking for a clear pattern or rule",
      "Skipping the practice steps",
    ],
    ok: 1,
  },

  kidTitle: "Mean & Mode",
  theme: "averages / typical values",
  emoji: "\u1f4ca",
  rewardName: "Mean Scout",
  intro: "Mean balances all values into one typical number. Mode is the value that appears most.",
  everyday: ["Class mark list", "Cricket run totals", "Shop price tags in BD markets"],
  subTitles: [
    "Meet Mean & Mode",
    "Balance the Mean",
    "Sort: Mean, Mode, or Not?",
    "Data Peak Lab",
    "Why Both Summaries",
    "Name the Average Rule",
    "Stretch: BD Data Stories",
    "Myth Bust",
    "Fluency Drill",
    "Mean Scout Mastery",
  ],
};

export function runL1Sub(subIndex, api) {
  const { registerTryAgain } = api;
  labState.reveal = false; labState.tokenProgress = 0; labState.masteryStep = 0;
  labState.placed = {}; labState.selectedId = null; labState.mythPhase = "claim";
  labState.heat = 0.25; labState.phase = "desk"; labState.mode = "marks";
  labState.dataVals = [2, 4, 4, 5, 5]; labState.meanVal = 4; labState.modeVal = 4;
  const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
  const fn = runners[subIndex] || runners[0];
  registerTryAgain(() => { api.overlay.innerHTML = ""; fn(api); });
  fn(api);
}

function s1({ overlay, setCoach, completeSub }) {
  setCoach("Hook: mean balances; mode is the most common.");
  mountMotionChain(overlay, {
    title: "Meet Mean & Mode",
    beats: [
      {
        scene: "meanMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000,
        html: `${badgeHtml(LAB_ASSET_PATHS.m1, "mean mode")}
          <p><strong>Act 1:</strong> Drag the data bars - each bar is a value in the set.</p>`,
      },
      {
        scene: "meanMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200,
        html: `<p><strong>Act 2:</strong> Watch the mean line - it balances the set.</p>`,
      },
      {
        scene: "meanMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000,
        html: `<p><strong>Act 3:</strong> Mode stacks highest - the value that shows up most.</p>`,
      },
    ],
    onDone: () => mountQuiz(overlay, {
      scene: "meanMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
      q: "In 2, 4, 4, 5, 5 - which is the mode?",
      opts: ["4 and 5 (tie - both appear twice)", "Only 2", "The mean line alone", "Any random number"],
      ok: 0,
      onDone: () => mountTapContinue(overlay, {
        scene: "meanMeet", badge: LAB_ASSET_PATHS.m1,
        html: `<h3>Summaries unlocked</h3><p>Next: dial until the mean balance is clear.</p>`,
        onDone: completeSub, advanceAfterDone: true,
      }),
    }),
  });
}

function s2({ overlay, setCoach, completeSub }) {
  setCoach("Push the dial - watch bars and mean line settle.");
  labState.heat = 0.25;
  mountHeatLab(overlay, {
    scene: "meanLab", title: "Balance the Mean",
    html: `<p>Drag until mean balance clarity \u2265 60%.</p>`,
    goalText: "Goal \u2265 60%", doneLabel: "Mean balanced", threshold: 0.6, startHeat: 0.25,
    axis: "x", canvasAction: "stretch", sliderLabel: "Balance", badge: LAB_ASSET_PATHS.m1,
    readoutLabels: {
      cold: "Data scattered - keep balancing",
      melting: "Mean line rising\u2026",
      liquid: "Near balance",
      simmer: "Mean clear - typical value found!",
    },
    onDone: () => mountQuiz(overlay, {
      scene: "meanLab", title: "Check",
      q: "Mean of 2, 4, 6 is\u2026",
      opts: ["4 (add then divide by 3)", "6 only", "2 only", "12 without dividing"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s3({ overlay, setCoach, completeSub }) {
  setCoach("Sort stories into mean, mode, or not a summary.");
  mountTapContinue(overlay, {
    scene: "meanSort",
    html: `<h3>Mean, mode, or not?</h3>
      <p><strong>Mean:</strong> add-and-divide, balance line, fair share of total.</p>
      <p><strong>Mode:</strong> most common mark, peak stack, appears most.</p>
      <p><strong>Not:</strong> favorite color, random guess with no data.</p>`,
    onDone: () => mountDragSort(overlay, {
      scene: "meanSort", title: "Sort: Mean, Mode, or Not?",
      instructions: "Drag into Mean / Mode / Not a summary.",
      successText: "Sharp sort - summaries sorted!",
      chips: [
        { id: "adddiv", text: "Add then divide", short: "Add/div", color: 0xfbbf24 },
        { id: "peak", text: "Most common value", short: "Most", color: 0xf59e0b },
        { id: "balance", text: "Balance line", short: "Balance", color: 0xfde68a },
        { id: "stack", text: "Tallest stack", short: "Stack", color: 0xd97706 },
        { id: "share", text: "Fair share of total", short: "Share", color: 0xfbbf24 },
        { id: "color", text: "Favorite color", short: "Color", color: 0x94a3b8 },
        { id: "guess", text: "Random guess", short: "Guess", color: 0x78716c },
        { id: "ties", text: "Two peaks tied", short: "Tie mode", color: 0xf97316 },
      ],
      zones: [
        { id: "mean", label: "Mean idea", accept: ["adddiv", "balance", "share"] },
        { id: "mode", label: "Mode idea", accept: ["peak", "stack", "ties"] },
        { id: "not", label: "Not a summary", accept: ["color", "guess"] },
      ],
      onDone: completeSub,
    }),
  });
}

function s4({ overlay, setCoach, completeSub }) {
  setCoach("Push higher - spot the mode peak clearly.");
  labState.heat = 0.4;
  mountHeatLab(overlay, {
    scene: "meanLab", title: "Data Peak Lab",
    html: `<p>Reach \u2265 75% - mode peak and mean line both visible.</p>`,
    goalText: "Goal \u2265 75%", doneLabel: "Peak checked", threshold: 0.75, startHeat: 0.4,
    axis: "x", canvasAction: "stretch", sliderLabel: "Clarity", badge: LAB_ASSET_PATHS.m1,
    onDone: completeSub,
  });
}

function s5({ overlay, setCoach, completeSub }) {
  setCoach("Order why we need both mean and mode.");
  mountOrderSteps(overlay, {
    scene: "meanMeet", sceneArgs: { phase: "settle" }, title: "Why Both Summaries",
    instructions: "Put the story in order.",
    items: [
      { id: "list", html: "List the data values" },
      { id: "mean", html: "Find the mean (balance)" },
      { id: "mode", html: "Find the mode (most common)" },
      { id: "tell", html: "Tell what each summary means" },
    ],
    correctIds: ["list", "mean", "mode", "tell"],
    onDone: () => mountQuiz(overlay, {
      scene: "meanMeet", title: "Check",
      q: "Why keep both mean and mode?",
      opts: [
        "They answer different questions about the same set",
        "Mean and mode are always identical",
        "Mode ignores the data",
        "Mean never uses division",
      ],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s6({ overlay, setCoach, completeSub }) {
  setCoach("Lock the average rule.");
  mountEquationBuild(overlay, {
    scene: "meanRule", title: "Name the Average Rule", instructions: "Tap tokens in order.",
    tokens: [
      { id: "a", html: "Sum" }, { id: "b", html: "/" },
      { id: "c", html: "Count" }, { id: "d", html: "= Mean" },
    ],
    correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
    onDone: () => mountTapContinue(overlay, {
      scene: "meanRule", badge: LAB_ASSET_PATHS.rule,
      html: `<h3>Rule locked</h3><p>Mean = sum / count. Mode = value that appears most.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}

function s7({ overlay, setCoach, completeSub }) {
  setCoach("Marks, cricket, shops, bus, weather - same summaries.");
  mountTapContinue(overlay, {
    scene: "meanStretch",
    html: `<h3>Bangladesh data stretch</h3><p>Tap modes: marks, cricket, shop, bus, weather.</p>`,
    onDone: () => mountQuiz(overlay, {
      scene: "meanStretch", title: "Transfer",
      q: "Class marks 70, 80, 80 - the mode is\u2026",
      opts: ["80 (appears twice)", "70 only", "75 always", "No mode ever"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s8({ overlay, setCoach, completeSub }) {
  setCoach("Bust mean/mode myths.");
  mountMythCards(overlay, {
    scene: "meanMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
    myths: [
      { claim: "Mean and mode are always the same number", truth: "They can differ - mean balances; mode is most common", sceneMyth: 0 },
      { claim: "Mode needs every value to appear once", truth: "Mode is the value that appears most (ties allowed)", sceneMyth: 1 },
      { claim: "Mean ignores how many values you have", truth: "Mean divides by the count of values", sceneMyth: 2 },
      { claim: "Only adults use averages", truth: "Kids use mean/mode for marks, scores, and prices", sceneMyth: 3 },
      { claim: "One outlier never moves the mean", truth: "A very large or small value can pull the mean", sceneMyth: 4 },
    ],
    onDone: completeSub,
  });
}

function s9({ overlay, setCoach, completeSub }) {
  setCoach("Quick mean/mode fluency.");
  mountSpeedDrill(overlay, {
    scene: "meanDrill", title: "Fluency Drill", passScene: "meanMastery",
    items: [
      { q: "Mean of 3, 5, 7?", opts: ["5", "7", "15", "3"], ok: 0, prompt: "3,5,7" },
      { q: "Mode of 2, 2, 9?", opts: ["2", "9", "5.5", "None"], ok: 0, prompt: "2,2,9" },
      { q: "Mean needs\u2026", opts: ["Sum then divide", "Only the biggest", "Only color", "Guess"], ok: 0, prompt: "Mean" },
      { q: "Mode is\u2026", opts: ["Most common", "Always the mean", "Never a number", "Only odd"], ok: 0, prompt: "Mode" },
      { q: "Can mean \u2260 mode?", opts: ["Yes", "Never"], ok: 0, prompt: "Differ?" },
      { q: "Favorite color is a mean?", opts: ["No", "Yes"], ok: 0, prompt: "Color?" },
    ],
    onDone: completeSub,
  });
}

function s10({ overlay, setCoach, completeSub }) {
  setCoach("Mastery - Mean Scout.");
  mountOrderSteps(overlay, {
    scene: "meanMastery", title: "Mean Scout Mastery", instructions: "Order your journey.",
    items: [
      { id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" },
      { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "scout", html: "Scout" },
    ],
    correctIds: ["meet", "sort", "lab", "rule", "myth", "scout"],
    onDone: () => mountTapContinue(overlay, {
      scene: "meanMastery", badge: LAB_ASSET_PATHS.m1,
      html: `<h3>\u1f4ca Mean Scout!</h3><p>You can find mean and mode - and explain what each summary tells.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}
