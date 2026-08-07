/**
 * Electrical Basics - Mission 3: Safe Power (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
  mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
  mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L3_META = {
  objective: "By the end of this mission, you'll be able to explain dry hands / insulation / respect live wires in your own words.",
  bdHook: "Bangladesh everyday: notice dry hands / insulation / respect live wires around you — then connect it to Safe Power.",
  predict: {
    q: "Before we start — what do you think matters most in Safe Power?",
    options: [
      "Guessing without checking",
      "Looking for a clear pattern or rule",
      "Skipping the practice steps",
    ],
    ok: 1,
  },

  kidTitle: "Safe Power",
  theme: "dry hands / insulation / respect live wires",
  emoji: "\u26d1\ufe0f",
  rewardName: "Safety Star",
  intro: "Stay safe: dry hands, good insulation, and never poke live sockets or frayed wires.",
  everyday: ["Home outlets", "School lab rules", "Street poles / wires"],
  subTitles: [
    "Meet Safe Power", "Safety Dial Lab", "Sort Safe / Unsafe", "Safer Habits Lab",
    "Safety Steps", "Name the Safe Rule", "Stretch: Places", "Myth Bust",
    "Fluency Drill", "Safety Star Mastery",
  ],
};

export function runL3Sub(subIndex, api) {
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
  setCoach("Hook: dry hands, insulation, respect live power.");
  mountMotionChain(overlay, {
    title: "Meet Safe Power",
    beats: [
      { scene: "safeMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000,
        html: `${badgeHtml(LAB_ASSET_PATHS.m3, "safe")}<p><strong>Act 1:</strong> Drag dry-hands, insulator, and warning signs.</p>` },
      { scene: "safeMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200,
        html: `<p><strong>Act 2:</strong> Wet hands + live socket = danger.</p>` },
      { scene: "safeMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000,
        html: `<p><strong>Act 3:</strong> Ask an adult - never poke outlets or frayed cords.</p>` },
    ],
    onDone: () => mountQuiz(overlay, {
      scene: "safeMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
      q: "Best habit near wall sockets?",
      opts: ["Dry hands; never poke with metal or wet fingers", "Stick keys in for fun", "Ignore frayed cords", "Play with open wires outside"],
      ok: 0, onDone: () => mountTapContinue(overlay, {
        scene: "safeMeet", badge: LAB_ASSET_PATHS.m3,
        html: `<h3>Safety ready</h3><p>Next: safety dial lab.</p>`,
        onDone: completeSub, advanceAfterDone: true,
      }),
    }),
  });
}

function s2({ overlay, setCoach, completeSub }) {
  setCoach("Raise your safety habits score.");
  labState.heat = 0.25;
  mountHeatLab(overlay, {
    scene: "safeLab", title: "Safety Dial Lab",
    html: `<p>Drag until safety &gt;= 65%.</p>`,
    goalText: "Goal &gt;= 65%", doneLabel: "Habits checked", threshold: 0.65, startHeat: 0.25,
    axis: "x", canvasAction: "stretch", sliderLabel: "Safety", badge: LAB_ASSET_PATHS.m3,
    onDone: completeSub,
  });
}

function s3({ overlay, setCoach, completeSub }) {
  setCoach("Sort safe habits vs unsafe actions.");
  mountTapContinue(overlay, {
    scene: "safeSort",
    html: `<h3>Guide</h3><p><strong>Safe:</strong> dry hands, insulated plug, adult help, unplug by plug body.<br><strong>Unsafe:</strong> wet hands, metal in socket, frayed cord, climb poles.<br><strong>Ask adult:</strong> strange spark / smell.</p>`,
    onDone: () => mountDragSort(overlay, {
      scene: "safeSort", title: "Sort safe / unsafe",
      instructions: "Drag into Safe / Unsafe / Ask an adult.",
      successText: "Safety sorted!",
      chips: [
        { id: "dry", text: "Dry hands before plugs", short: "Dry hands", color: 0x22c55e },
        { id: "plug", text: "Hold the plug body", short: "Plug body", color: 0x4ade80 },
        { id: "ins", text: "Use insulated cord", short: "Insulation", color: 0x86efac },
        { id: "wet", text: "Wet hands on switch", short: "Wet hands", color: 0xef4444 },
        { id: "key", text: "Metal key in socket", short: "Metal in", color: 0xf87171 },
        { id: "fray", text: "Use frayed cord", short: "Frayed", color: 0xf97316 },
        { id: "pole", text: "Climb street poles", short: "Climb", color: 0xdc2626 },
        { id: "spark", text: "Smell burning / sparks", short: "Sparks", color: 0xfbbf24 },
      ],
      zones: [
        { id: "safe", label: "Safe habit", accept: ["dry", "plug", "ins"] },
        { id: "unsafe", label: "Unsafe", accept: ["wet", "key", "fray", "pole"] },
        { id: "adult", label: "Tell an adult", accept: ["spark"] },
      ],
      onDone: completeSub,
    }),
  });
}

function s4({ overlay, setCoach, completeSub }) {
  setCoach("Push safety habits higher.");
  labState.heat = 0.4;
  mountHeatLab(overlay, {
    scene: "safeLab", title: "Safer Habits Lab", html: `<p>Reach &gt;= 80%.</p>`,
    goalText: "Goal &gt;= 80%", doneLabel: "Lab done", threshold: 0.8, startHeat: 0.4,
    axis: "x", canvasAction: "stretch", sliderLabel: "Safety", badge: LAB_ASSET_PATHS.m3,
    onDone: completeSub,
  });
}

function s5({ overlay, setCoach, completeSub }) {
  setCoach("Order safety steps.");
  mountOrderSteps(overlay, {
    scene: "safeMeet", sceneArgs: { phase: "settle" }, title: "Safety steps",
    instructions: "Order the safe path.",
    items: [
      { id: "check", html: "Check: dry hands, good cord" },
      { id: "plug", html: "Plug in carefully by the plug body" },
      { id: "use", html: "Use the device as intended" },
      { id: "stop", html: "Stop and tell an adult if sparks/smell" },
    ],
    correctIds: ["check", "plug", "use", "stop"],
    onDone: completeSub,
  });
}

function s6({ overlay, setCoach, completeSub }) {
  setCoach("Lock the safe-power rule.");
  mountEquationBuild(overlay, {
    scene: "safeRule", title: "Name the Safe Rule", instructions: "Tap in order.",
    tokens: [
      { id: "a", html: "Dry" }, { id: "b", html: "insulate" },
      { id: "c", html: "respect" }, { id: "d", html: "live wires" },
    ],
    correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
    onDone: () => mountTapContinue(overlay, {
      scene: "safeRule", badge: LAB_ASSET_PATHS.rule,
      html: `<h3>Rule locked</h3><p>Dry hands / insulate / respect live wires.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}

function s7({ overlay, setCoach, completeSub }) {
  setCoach("Home, school, street, BD shop, lab.");
  mountTapContinue(overlay, {
    scene: "safeStretch", html: `<h3>Places</h3><p>Same safety idea everywhere.</p>`,
    onDone: () => mountQuiz(overlay, {
      scene: "safeStretch", title: "Transfer",
      q: "Near a broken street wire you should...",
      opts: ["Stay away and tell an adult / authority", "Touch it to test", "Climb closer for photos", "Pour water on it"],
      ok: 0, onDone: completeSub,
    }),
  });
}

function s8({ overlay, setCoach, completeSub }) {
  setCoach("Bust electricity safety myths.");
  mountMythCards(overlay, {
    scene: "safeMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
    myths: [
      { claim: "Wet hands are fine on switches", truth: "Water helps shock - dry your hands", sceneMyth: 0 },
      { claim: "Plastic toys stuck in sockets are a fun game", truth: "Never put objects in sockets", sceneMyth: 1 },
      { claim: "Frayed cords are still perfectly safe", truth: "Frayed cords can shock or start fires - stop using them", sceneMyth: 2 },
      { claim: "Birds prove wires are always safe to touch", truth: "Birds sit without a path to ground; you can complete a path", sceneMyth: 3 },
      { claim: "Kids should fix wall wiring alone", truth: "Leave wiring to trained adults", sceneMyth: 4 },
    ],
    onDone: completeSub,
  });
}

function s9({ overlay, setCoach, completeSub }) {
  setCoach("Quick safety fluency.");
  mountSpeedDrill(overlay, {
    scene: "safeDrill", title: "Fluency Drill", passScene: "safeMastery",
    items: [
      { q: "Dry hands near plugs?", opts: ["Yes", "No"], ok: 0, prompt: "Dry?" },
      { q: "Metal in socket OK?", opts: ["No", "Yes"], ok: 0, prompt: "Metal" },
      { q: "Frayed cord OK to keep using?", opts: ["No", "Yes"], ok: 0, prompt: "Fray" },
      { q: "Tell adult about sparks?", opts: ["Yes", "Ignore"], ok: 0, prompt: "Spark" },
      { q: "Climb street poles?", opts: ["No", "Yes"], ok: 0, prompt: "Pole" },
      { q: "Pull cord by the wire only?", opts: ["No - hold plug", "Yes always"], ok: 0, prompt: "Pull" },
    ],
    onDone: completeSub,
  });
}

function s10({ overlay, setCoach, completeSub }) {
  setCoach("Mastery - Safety Star.");
  mountOrderSteps(overlay, {
    scene: "safeMastery", title: "Safety Star Mastery", instructions: "Order your journey.",
    items: [
      { id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" },
      { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "star", html: "Star" },
    ],
    correctIds: ["meet", "sort", "lab", "rule", "myth", "star"],
    onDone: () => mountTapContinue(overlay, {
      scene: "safeMastery", badge: LAB_ASSET_PATHS.m3,
      html: `<h3>\u26d1\ufe0f Safety Star!</h3><p>You can keep dry hands, use insulation, and respect live wires.</p>`,
      onDone: completeSub, advanceAfterDone: true,
    }),
  });
}
