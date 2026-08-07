/**
 * Force Fighter - Mission 1: The Lazy Rock (Newton 1 / inertia)
 */
import { forceLabState } from "./force-state.js";
import { FORCE_ASSET_PATHS } from "./force-state.js";
import {
  mountMotionChain,
  mountDragSort,
  mountHeatLab,
  mountRevealSteps,
  mountEquationBuild,
  mountQuiz,
  mountSpeedDrill,
  mountMythCards,
  mountTapContinue,
  mountOrderSteps,
  badgeHtml,
} from "./force-activities.js";

export const L1_META = {
  objective: "By the end of this mission, you'll be able to explain inertia / Newton 1 in your own words.",
  bdHook: "Bangladesh everyday: notice inertia / Newton 1 around you — then connect it to The Lazy Rock.",
  predict: {
    q: "Before we start — what do you think matters most in The Lazy Rock?",
    options: [
      "Guessing without checking",
      "Looking for a clear pattern or rule",
      "Skipping the practice steps",
    ],
    ok: 1,
  },

  kidTitle: "The Lazy Rock",
  theme: "inertia / Newton 1",
  emoji: "🪨",
  rewardName: "Rock Rookie",
  intro:
    "Things stay still until something pushes or pulls them. Wake a sleepy rock - just like pushing a door open!",
  everyday: ["Pushing a door open", "Kicking a football", "Pushing a shopping trolley"],
  subTitles: [
    "Meet the Lazy Rock",
    "Coast & Glide",
    "Sort: Force or Not?",
    "Wall Hit Lab",
    "Why It Coasts",
    "Name the Inertia Rule",
    "Stretch: New Contexts",
    "Myth Bust",
    "Fluency Drill",
    "Lazy Rock Mastery",
  ],
};

export function runL1Sub(subIndex, api) {
  const { registerTryAgain } = api;
  forceLabState.reveal = false;
  forceLabState.tokenProgress = 0;
  forceLabState.masteryStep = 0;
  forceLabState.sortPlaced = 0;
  forceLabState.placed = {};
  forceLabState.selectedId = null;
  forceLabState.mythBusted = false;
  forceLabState.mythPhase = "claim";
  forceLabState.rockAwake = false;
  forceLabState.rockVx = 0.2;
  forceLabState.wallHit = 0;
  forceLabState.heat = 0.2;
  forceLabState.heatTarget = 0.2;
  forceLabState.phase = "desk";
  forceLabState.mode = "door";

  const runners = [
    sub1_meet,
    sub2_glide,
    sub3_sort,
    sub4_wall,
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
  setCoach("Hook: still things stay still until an unbalanced push or pull.");
  mountMotionChain(overlay, {
    title: "Meet the Lazy Rock",
    beats: [
      {
        scene: "rockMeet",
        sceneArgs: { phase: "desk" },
        dwellMs: 4000,
        html: `${badgeHtml(FORCE_ASSET_PATHS.rock, "rock")}
          <p><strong>Act 1:</strong> Drag the door, ball, and sleepy rock - everyday clues about push.</p>`,
      },
      {
        scene: "rockMeet",
        sceneArgs: { phase: "wake" },
        dwellMs: 4500,
        html: `<p><strong>Act 2:</strong> Flick or drag the rock awake. An unbalanced force starts motion.</p>`,
      },
      {
        scene: "rockMeet",
        sceneArgs: { phase: "glide" },
        dwellMs: 4000,
        html: `<p><strong>Act 3:</strong> After the push ends, the rock can coast - speed stays roughly flat.</p>`,
      },
      {
        scene: "rockMeet",
        sceneArgs: { phase: "settle" },
        dwellMs: 3800,
        html: `<p><strong>Act 4:</strong> Big idea - objects keep doing what they are doing until an unbalanced force acts.</p>`,
      },
    ],
    onDone: () => {
      mountQuiz(overlay, {
        scene: "rockMeet",
        sceneArgs: { phase: "settle" },
        title: "Exit check",
        q: "A parked van stays put mainly because...",
        opts: [
          "Forces on it are balanced (net force ≈ 0)",
          "It is afraid of moving",
          "Gravity turned off",
          "Only heavy things can rest",
        ],
        ok: 0,
        onDone: () => {
          mountTapContinue(overlay, {
            scene: "rockMeet",
            sceneArgs: { phase: "desk" },
            badge: FORCE_ASSET_PATHS.rock,
            html: `<h3>You met the Lazy Rock</h3><p>Next: watch coasting speed on a low-friction lane.</p>`,
            onDone: completeSub,
            advanceAfterDone: true,
          });
        },
      });
    },
  });
}

function sub2_glide({ overlay, setCoach, completeSub }) {
  setCoach("Watch: with almost no net force, speed stays about the same - inertia.");
  forceLabState.rockVx = 0.45;
  forceLabState.heat = 0.45;
  mountHeatLab(overlay, {
    scene: "rockGlide",
    title: "Coast & Glide",
    html: `<p>Drag the handle (or use +/−). The rock keeps coasting - speed readout stays flat without a new force.</p>`,
    goalText: "Goal: set coast speed ≥ 60%.",
    doneLabel: "Glide checked ▶",
    threshold: 0.6,
    startHeat: 0.45,
    axis: "x",
    canvasAction: "stretch",
    sliderLabel: "Coast speed",
    syncKey: "rockVx",
    readoutLabels: {
      cold: "Slow coast",
      melting: "Medium coast",
      liquid: "Fast coast - still flat speed",
      simmer: "Speedy coast - inertia!",
    },
    badge: FORCE_ASSET_PATHS.arrow,
    onDone: () => {
      mountQuiz(overlay, {
        scene: "rockGlide",
        title: "Check",
        q: "After the push ends on smooth ice, the rock keeps moving mainly because of...",
        opts: ["Inertia (no new net force needed to keep coasting)", "A hidden forever-push", "Magic", "Air always pushing forward"],
        ok: 0,
        onDone: completeSub,
      });
    },
  });
}

function sub3_sort({ overlay, setCoach, completeSub }) {
  setCoach("Sort stories: coasting, balanced rest, or unbalanced push.");
  mountTapContinue(overlay, {
    scene: "rockSort",
    html: `<h3>Force or not?</h3>
      <p><strong>No net / coast:</strong> ice drift, space coast.</p>
      <p><strong>Balanced:</strong> rock at rest, parked van, book on table.</p>
      <p><strong>Unbalanced:</strong> shove, kick, sudden brake.</p>`,
    onDone: () => {
      mountDragSort(overlay, {
        scene: "rockSort",
        title: "Sort force stories",
        instructions: "Drag into No net force, Balanced, or Unbalanced.",
        successText: "Nice sort - coast, balance, or push!",
        chips: [
          { id: "drift", text: "Ice drift (no push)", short: "Drift", color: 0x38bdf8 },
          { id: "rest", text: "Rock at rest", short: "Rest", color: 0xa8a29e },
          { id: "shove", text: "Hard shove", short: "Shove", color: 0xfbbf24 },
          { id: "kick", text: "Kick a ball", short: "Kick", color: 0x22c55e },
          { id: "park", text: "Parked van", short: "Park", color: 0x94a3b8 },
          { id: "space", text: "Coast in space", short: "Space", color: 0xa78bfa },
          { id: "brake", text: "Sudden brake", short: "Brake", color: 0xf87171 },
          { id: "table", text: "Book on table", short: "Table", color: 0xd6d3d1 },
        ],
        zones: [
          { id: "none", label: "No net / coast", accept: ["drift", "space"] },
          { id: "balanced", label: "Balanced", accept: ["rest", "park", "table"] },
          { id: "unbalanced", label: "Unbalanced", accept: ["shove", "kick", "brake"] },
        ],
        onDone: () => {
          forceLabState.reveal = true;
          mountQuiz(overlay, {
            scene: "rockSort",
            title: "Justify",
            q: "A sudden brake is unbalanced because...",
            opts: [
              "A new force changes the velocity quickly",
              "Brakes remove all mass",
              "The car becomes lighter",
              "Forces always cancel when braking",
            ],
            ok: 0,
            onDone: completeSub,
          });
        },
      });
    },
  });
}

function sub4_wall({ overlay, setCoach, completeSub }) {
  setCoach("Try it: hit the wall - the wall force points opposite the motion.");
  forceLabState.heat = 0.15;
  forceLabState.wallHit = 0;
  mountHeatLab(overlay, {
    scene: "rockWall",
    title: "Wall Hit Lab",
    html: `<p>Slide the rock into the wall. When it hits, the wall pushes back the other way.</p>`,
    goalText: "Goal: hit ≥ 85%.",
    doneLabel: "Wall hit ▶",
    threshold: 0.85,
    startHeat: 0.15,
    axis: "x",
    canvasAction: "stretch",
    sliderLabel: "Approach",
    readoutLabels: {
      cold: "Far from wall",
      melting: "Closing in...",
      liquid: "Almost there",
      simmer: "HIT - wall force opposite!",
    },
    badge: FORCE_ASSET_PATHS.arrow,
    onDone: () => {
      mountQuiz(overlay, {
        scene: "rockWall",
        title: "Check",
        q: "When the rock hits the wall moving right, the wall force on the rock points...",
        opts: ["Left (opposite the motion)", "Right (same way)", "Straight up only", "Nowhere"],
        ok: 0,
        onDone: completeSub,
      });
    },
  });
}

function sub5_explain({ overlay, setCoach, completeSub }) {
  setCoach("Explain: ice, belt, space - when forces change, motion changes.");
  mountRevealSteps(overlay, {
    scene: "rockMeet",
    sceneArgs: { phase: "glide" },
    title: "Why it coasts",
    steps: [
      { html: "<p>A short push changes velocity - then it can end.</p>" },
      { html: "<p>With little friction, the rock keeps nearly the same speed.</p>" },
      { html: "<p>That stubborn keep-going / stay-put idea is <strong>inertia</strong>.</p>" },
    ],
    onDone: () => {
      mountQuiz(overlay, {
        scene: "rockMeet",
        sceneArgs: { phase: "settle" },
        title: "Name it",
        q: "Best word for “keeps doing what it’s doing until unbalanced force”?",
        opts: ["Inertia", "Brightness", "Volume", "Temperature"],
        ok: 0,
        onDone: completeSub,
      });
    },
  });
}

function sub6_rule({ overlay, setCoach, completeSub }) {
  setCoach("Symbolic: build the inertia rule.");
  mountEquationBuild(overlay, {
    scene: "rockRule",
    title: "Build the inertia rule",
    instructions: "Tap tokens in order.",
    badge: FORCE_ASSET_PATHS.rule,
    tokens: [
      { id: "a", html: "Stay still" },
      { id: "b", html: "or coast" },
      { id: "c", html: "until" },
      { id: "d", html: "FORCE" },
    ],
    correctIds: ["a", "b", "c", "d"],
    onDone: () => {
      mountQuiz(overlay, {
        scene: "rockRule",
        title: "Rule check",
        q: "Newton’s first-law idea in this lab is closest to...",
        opts: [
          "Motion stays the same until unbalanced force acts",
          "Force equals mass times acceleration only",
          "Every push has a pair push",
          "Friction always helps you go faster",
        ],
        ok: 0,
        onDone: completeSub,
      });
    },
  });
}

function sub7_stretch({ overlay, setCoach, completeSub }) {
  setCoach("Stretch: door, ice, space, belt, asteroid - same inertia idea.");
  const modes = [
    { mode: "door", title: "Door", blurb: "Stays shut until you push." },
    { mode: "ice", title: "Ice", blurb: "Low friction - coasts longer." },
    { mode: "space", title: "Space", blurb: "Almost no force - keeps velocity." },
    { mode: "belt", title: "Belt", blurb: "Conveyor force changes motion." },
    { mode: "asteroid", title: "Asteroid", blurb: "Tap to nudge - force changes velocity." },
  ];
  let i = 0;
  function step() {
    if (i >= modes.length) {
      mountQuiz(overlay, {
        scene: "rockStretch",
        title: "Transfer",
        q: "Nudging an asteroid changes its velocity because...",
        opts: ["You applied an unbalanced force", "Asteroids dislike stillness", "Space removes mass", "Light pushes forever"],
        ok: 0,
        onDone: completeSub,
      });
      return;
    }
    const m = modes[i++];
    forceLabState.mode = m.mode;
    mountTapContinue(overlay, {
      scene: "rockStretch",
      sceneArgs: { mode: m.mode },
      html: `<h3>${m.title}</h3><p>${m.blurb}</p>`,
      onDone: step,
    });
  }
  step();
}

function sub8_myths({ overlay, setCoach, completeSub }) {
  setCoach("Myth bust: forever-kick, constant push, rest means no forces...");
  mountMythCards(overlay, {
    scene: "rockMyth",
    title: "Inertia myths",
    myths: [
      { title: "Forever kick", claim: "A kick keeps pushing the ball forever.", truth: "The kick is short; then inertia + friction rule.", sceneMyth: 0 },
      { title: "Need push", claim: "Moving things need a constant push to keep going.", truth: "Only net force changes velocity - coasting needs none.", sceneMyth: 1 },
      { title: "Heavy want", claim: "Heavier objects fall because they want to stop more.", truth: "Inertia resists change - gravity is a separate story.", sceneMyth: 2 },
      { title: "Must have force", claim: "If something is moving there must be a force on it now.", truth: "It can coast with zero net force after the push ends.", sceneMyth: 3 },
      { title: "Rest = no forces", claim: "Rest means no forces at all.", truth: "Rest can mean forces are balanced (net zero).", sceneMyth: 4 },
    ],
    onDone: completeSub,
  });
}

function sub9_drill({ overlay, setCoach, completeSub }) {
  setCoach("Quick checks - balance, space coast, redirect.");
  mountSpeedDrill(overlay, {
    scene: "rockDrill",
    title: "Fluency drill",
    items: [
      { q: "Book resting on a table - net force is...", opts: ["About zero (balanced)", "Huge upward", "Huge downward only", "Infinite"], ok: 0, prompt: "Balanced?" },
      { q: "Empty space, engines off, ignore drag - the craft...", opts: ["Keeps its velocity", "Must stop instantly", "Speeds up forever", "Turns into light"], ok: 0, prompt: "Space coast" },
      { q: "A wall hit can...", opts: ["Redirect / stop by applying force", "Create new mass", "Delete inertia", "Remove gravity"], ok: 0, prompt: "Wall force" },
    ],
    onDone: completeSub,
  });
}

function sub10_mastery({ overlay, setCoach, completeSub }) {
  setCoach("Mastery: velocity cannot change with zero net force.");
  forceLabState.masteryStep = 5;
  mountOrderSteps(overlay, {
    scene: "rockMastery",
    title: "Story order",
    instructions: "Put the inertia story in order.",
    items: [
      { id: "s1", html: "Object at rest or coasting" },
      { id: "s2", html: "Unbalanced force acts" },
      { id: "s3", html: "Velocity changes" },
      { id: "s4", html: "Force can end - then coast again" },
    ],
    correctIds: ["s1", "s2", "s3", "s4"],
    onDone: () => {
      forceLabState.masteryStep = 6;
      mountQuiz(overlay, {
        scene: "rockMastery",
        title: "Mastery claim",
        q: "With truly zero net force, velocity...",
        opts: ["Cannot change", "Must increase", "Must become zero", "Becomes random"],
        ok: 0,
        onDone: completeSub,
      });
    },
  });
}
