/**
 * Web Dev Studio - Mission 2: CSS Style (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
  mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
  mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L2_META = {
  objective: "By the end of this mission, you'll be able to explain look & layout in your own words.",
  bdHook: "Bangladesh everyday: notice look & layout around you — then connect it to CSS Style.",
  predict: {
    q: "Before we start — what do you think matters most in CSS Style?",
    options: [
      "Guessing without checking",
      "Looking for a clear pattern or rule",
      "Skipping the practice steps",
    ],
    ok: 1,
  },

  kidTitle: "CSS Style",
  theme: "look & layout",
  emoji: "\ud83c\udfa8",
  rewardName: "Style Star",
  intro: "CSS paints the HTML rooms. Color, size, and spacing make a page clear to read.",
  everyday: ["School poster colors", "Shop product card gaps", "Rickshaw ad that must read from far"],
  subTitles: [
    "Meet Color Size Space", "Style Dial Lab", "Sort CSS Look", "Stronger Style Lab",
    "Why Clear Look", "Name the Style Rule", "Stretch: Surfaces", "Myth Bust",
    "Fluency Drill", "Style Star Mastery",
  ],
};

export function runL2Sub(subIndex, api) {
  const { registerTryAgain } = api;
  labState.reveal = false; labState.tokenProgress = 0; labState.masteryStep = 0;
  labState.placed = {}; labState.selectedId = null; labState.mythPhase = "claim";
  labState.heat = 0.2; labState.phase = "desk"; labState.mode = "poster";
  labState.styleHeat = 0.2;
  const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
  const fn = runners[subIndex] || runners[0];
  registerTryAgain(() => { api.overlay.innerHTML = ""; fn(api); });
  fn(api);
}

function s1({ overlay, setCoach, completeSub }) {
  setCoach("Hook: paint pots - color, size, space.");
  mountMotionChain(overlay, {
    title: "Meet Color Size Space",
    beats: [
      { scene: "cssMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000,
        html: `${badgeHtml(LAB_ASSET_PATHS.m2, "css")}<p><strong>Act 1:</strong> Drag the color, size, and space pots.</p>` },
      { scene: "cssMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200,
        html: `<p><strong>Act 2:</strong> Lines link pots to the preview page.</p>` },
      { scene: "cssMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000,
        html: `<p><strong>Act 3:</strong> CSS chooses how the page looks - not the tag names.</p>` },
    ],
    onDone: () => mountQuiz(overlay, {
      scene: "cssMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
      q: "Which job is mainly CSS?",
      opts: ["Pick color, size, and spacing", "Name the <body> room only", "Save files forever", "Run CPU math"],
      ok: 0, onDone: () => mountTapContinue(overlay, {
        scene: "cssMeet", badge: LAB_ASSET_PATHS.m2,
        html: `<h3>Style online</h3><p>Next: dial the look stronger.</p>`,
        onDone: completeSub, advanceAfterDone: true,
      }),
    }),
  });
}

function s2({ overlay, setCoach, completeSub }) {
  setCoach("Dial until the page look is clear (>= 60%).");
  labState.heat = 0.2;
  mountHeatLab(overlay, {
    scene: "cssLab", title: "Style Dial Lab",
    html: `<p>Drag until style clarity >= 60%.</p>`,
    goalText: "Goal >= 60%", doneLabel: "Look checked", threshold: 0.6, startHeat: 0.2,
    axis: "x", canvasAction: "stretch", sliderLabel: "Style", badge: LAB_ASSET_PATHS.m2,
    onDone: completeSub,
  });
}

function s3({ overlay, setCoach, completeSub }) {
  setCoach("Sort CSS look vs HTML structure vs not.");
  mountTapContinue(overlay, {
    scene: "cssSort",
    html: `<h3>Guide</h3><p><strong>CSS:</strong> color, font-size, margin, background.<br><strong>HTML:</strong> &lt;h1&gt;, &lt;p&gt;.<br><strong>Not:</strong> onclick, rice.</p>`,
    onDone: () => mountDragSort(overlay, {
      scene: "cssSort", title: "Sort CSS Look",
      instructions: "Drag into CSS / HTML / Not.",
      successText: "Look sorted!",
      chips: [
        { id: "color", text: "Text color", short: "color", color: 0x38bdf8 },
        { id: "font", text: "How big text is", short: "font-size", color: 0x0ea5e9 },
        { id: "margin", text: "Outside gap", short: "margin", color: 0x22c55e },
        { id: "bg", text: "Background fill", short: "background", color: 0x67e8f9 },
        { id: "h1", text: "Heading tag", short: "<h1>", color: 0xea580c },
        { id: "p", text: "Paragraph tag", short: "<p>", color: 0xf97316 },
        { id: "click", text: "Click script", short: "onclick", color: 0xa78bfa },
        { id: "rice", text: "A bowl of rice", short: "Rice", color: 0xf472b6 },
      ],
      zones: [
        { id: "css", label: "CSS look", accept: ["color", "font", "margin", "bg"] },
        { id: "html", label: "HTML structure", accept: ["h1", "p"] },
        { id: "not", label: "Not CSS", accept: ["click", "rice"] },
      ],
      onDone: completeSub,
    }),
  });
}

function s4({ overlay, setCoach, completeSub }) {
  setCoach("Push style strength higher.");
  labState.heat = 0.4;
  mountHeatLab(overlay, {
    scene: "cssLab", title: "Stronger Style Lab", html: `<p>Reach >= 75%.</p>`,
    goalText: "Goal >= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
    axis: "x", canvasAction: "stretch", sliderLabel: "Style", badge: LAB_ASSET_PATHS.m2,
    onDone: completeSub,
  });
}

function s5({ overlay, setCoach, completeSub }) {
  setCoach("Order why clear look helps.");
  mountOrderSteps(overlay, {
    scene: "cssMeet", sceneArgs: { phase: "settle" }, title: "Why Clear Look",
    instructions: "Order the story.",
    items: [
      { id: "pick", html: "Select what to style" },
      { id: "set", html: "Set color, size, space" },
      { id: "see", html: "People see a clear page" },
      { id: "fix", html: "Fix until it is readable" },
    ],
    correctIds: ["pick", "set", "see", "fix"],
    onDone: () => mountQuiz(overlay, {
      scene: "cssMeet", title: "Check",
      q: "Tiny cramped text on a phone usually...",
      opts: ["Harder to read - size and space matter", "Always looks more professional", "Deletes HTML tags", "Turns into JavaScript"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s6({ overlay, setCoach, completeSub }) {
  setCoach("Lock the CSS style rule.");
  mountEquationBuild(overlay, {
    scene: "cssRule", title: "Name the Style Rule", instructions: "Tap in order.",
    tokens: [
      { id: "a", html: "Select" }, { id: "b", html: "Style" },
      { id: "c", html: "Look" }, { id: "d", html: "Clear" },
    ],
    correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
    onDone: () => mountTapContinue(overlay, {
      scene: "cssRule", badge: LAB_ASSET_PATHS.rule,
      html: `<h3>Rule locked</h3><p>Select  /  Style  /  Look  /  Clear.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}

function s7({ overlay, setCoach, completeSub }) {
  setCoach("Poster, school, shop, BD ad, app - same CSS ideas.");
  mountTapContinue(overlay, {
    scene: "cssStretch", html: `<h3>Surfaces</h3><p>Tap each mode - color, size, space still apply.</p>`,
    onDone: () => mountQuiz(overlay, {
      scene: "cssStretch", title: "Transfer",
      q: "A rickshaw ad needs...",
      opts: ["Clear color and readable size from far", "Only secret tiny text", "No spacing ever", "HTML tags with zero look"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s8({ overlay, setCoach, completeSub }) {
  setCoach("Bust CSS myths.");
  mountMythCards(overlay, {
    scene: "cssMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
    myths: [
      { claim: "More colors always look better", truth: "A few clear colors beat a messy rainbow", sceneMyth: 0 },
      { claim: "CSS and HTML are the same job", truth: "HTML structures; CSS styles the look", sceneMyth: 1 },
      { claim: "Tiny text is fine on phones", truth: "Readable size and spacing help everyone", sceneMyth: 2 },
      { claim: "Spacing does not matter", truth: "Gap and margin guide the eye", sceneMyth: 3 },
      { claim: "Only designers can learn CSS", truth: "Kids can learn color, size, and space", sceneMyth: 4 },
    ],
    onDone: completeSub,
  });
}

function s9({ overlay, setCoach, completeSub }) {
  setCoach("Quick CSS fluency.");
  mountSpeedDrill(overlay, {
    scene: "cssDrill", title: "Fluency Drill", passScene: "cssMastery",
    items: [
      { q: "font-size mainly changes...", opts: ["How big text is", "The CPU brand"], ok: 0, prompt: "Size" },
      { q: "Is margin a CSS idea?", opts: ["Yes", "No"], ok: 0, prompt: "Margin" },
      { q: "<h1> is mainly...", opts: ["HTML structure", "A CSS color"], ok: 0, prompt: "h1" },
      { q: "Clear spacing helps...", opts: ["Reading", "Deleting pages"], ok: 0, prompt: "Space" },
      { q: "Rice is a CSS property?", opts: ["No", "Yes"], ok: 0, prompt: "Rice" },
      { q: "CSS paints...", opts: ["How the page looks", "Only file names"], ok: 0, prompt: "CSS" },
    ],
    onDone: completeSub,
  });
}

function s10({ overlay, setCoach, completeSub }) {
  setCoach("Mastery - Style Star.");
  mountOrderSteps(overlay, {
    scene: "cssMastery", title: "Style Star Mastery", instructions: "Order your journey.",
    items: [
      { id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" },
      { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "win", html: "Star" },
    ],
    correctIds: ["meet", "sort", "lab", "rule", "myth", "win"],
    onDone: () => mountTapContinue(overlay, {
      scene: "cssMastery", badge: LAB_ASSET_PATHS.m2,
      html: `<h3>Style Star!</h3><p>Color, size, and space make pages clear.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}
