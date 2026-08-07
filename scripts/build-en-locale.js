/**
 * Build locales/en.json from game-core meta + adv extract + static shell keys.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read LEVEL_META by eval-free import: parse from game-core export via dynamic import
const { LEVEL_META } = await import("../js/game-core.js");
const advExtract = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../locales/adv-en-extract.json"), "utf8")
);

const shell = {
  appTitle: "Force Fighter - Learn Forces!",
  brandMark: "Force Fighter",
  brandH1: "Learn Push, Pull & More!",
  subjectTag: "Fun physics for kids",
  mission: "Mission",
  playground: "Playground",
  playgroundOpen: "Playground (open)",
  playgroundTitle: "Open the free-play Force Lab sandbox",
  playgroundOpenTitle: "Use “Back to missions” in the panel below to return to your lesson",
  playgroundAriaOpen: "Playground is open",
  playgroundAria: "Open playground",
  resetAll: "Reset all",
  resetAllTitle: "Clear all saved progress and start over",
  hint: "Hint",
  nextStep: "Next step",
  stepsLeft: "{n} step{s} left in this level",
  stepsLeftOne: "1 step left in this level",
  levelCompleteQuiz: "Level complete! Take the quiz",
  stepOf: "Step {n} of 10",
  stepDone: "Step {n}, done",
  stepCurrent: "Step {n}, current",
  coachName: "Coach Force",
  tryAgain: "Try again",
  tryAgainTitle: "Try this step again",
  hidePanel: "Hide panel",
  showPanel: "Show panel",
  canvasAria: "3D play area",
  coachDockAria: "Coach and activities",
  subDotsAria: "Steps in this level",
  levelSelectAria: "Choose mission",
  levelWord: "Level",
  bonusQuizTitle: "Bonus quiz",
  langLabel: "Language",
  langEn: "English",
  langBn: "বাংলা",
  langBnLatin: "Bengali",
  todayForce: "Today: {force} force · {example}",
  levelProgress: "{emoji} Level {cur}/10 · Steps done: {done}/10",
  rewardEarned: " · {icon} {name}",
  rewardLocked: "Win: {name}",
  checkpointBonus: "Bonus quiz ahead",
  checkpointFinal: "Big quiz at the end",
  next: "Next",
  nextDock: "Next",
};

const ui = {
  introLetsPlay: "Let's play!",
  introExamples: "Examples: {list}",
  missionN: "Mission {n}: {title}",
  quizTitle: "Level quiz ({cur}/{total})",
  quizGreat: "Great!",
  quizTryAgain: "Try again!",
  earnedReward: "You earned: {name}!",
  awesome: "Awesome!",
  rewardUnlocked: "{icon} {name} unlocked!",
  stepDoneToast: "Step {n} done! Tap Next.",
  pickBest: "Pick the best answer.",
  notQuite: "Not quite - try again!",
  everydayHook: "{emoji} Think about everyday forces!",
  everydayTitle: "Everyday examples",
  resetConfirmTitle: "Reset everything?",
  resetConfirmBody:
    "This clears all missions, step checkmarks, badges, and saved place. You will start again at Level 1, Step 1.",
  resetCannotUndo: "This cannot be undone.",
  resetKeep: "Keep my progress",
  resetYes: "Yes, reset all",
  resetToast: "All progress reset. Starting from Level 1, Step 1.",
  levelGateTitle: "Level {n} complete",
  levelGateBody:
    "You finished all 10 guided blocks for this mission. When you are ready, open the next course block.",
  nextMission: "Next mission:",
  beginLevel: "Begin Level {n}",
  clearedGame: "You cleared Force Fighter! Replay any level from the menu.",
  nextStepLabel: "Next step ({n}/10)",
  nextFinishLevel: "Next: finish Level {cur} → begin Level {cur2}",
  nextCheckpoint: "Next: checkpoint, then level gate",
  nextFinal: "Next: final checkpoint, then victory screen",
  nextComplete: "Next: complete Force Fighter",
  checkpointQuiz: "Checkpoint quiz",
  checkpointExam: "Checkpoint exam",
  checkpointFinal: "Final exam",
};

const lab = {
  demoBadge: "Example / demonstration",
  dwellWait: "Glance at the 3D scene, read the notes, then continue when the timer finishes.",
  dwellContinue: "Continue to your turn",
  dwellLook: "Look at the scene ({n}s)…",
  dwellYourTurn: "Your turn - try it!",
  dragWrong: "That label doesn't belong here.",
  dragRight: "Nice sorting!",
  orderWrong: "Not quite - check the order.",
  orderRight: "Perfect order!",
  revealNext: "Next example",
  revealDone: "Continue",
  chainContinue: "Continue",
  pagePrev: "Prev",
  pageNext: "Next",
  pageOf: "Part {cur} of {total}",
  pagePrevAria: "Previous part",
  pageNextAria: "Next part",
};

const forceNames = {
  push: "push",
  pull: "pull",
  gravity: "gravity",
  friction: "friction",
  magnetic: "magnetic",
};

const levels = LEVEL_META.map((m, i) => ({
  kidTitle: m.kidTitle,
  rewardName: m.rewardName,
  intro: m.intro,
  everyday: m.everyday,
  quiz: m.quiz,
  forceTheme: m.forceTheme,
  emoji: m.emoji,
}));

const mainExtract = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../locales/main-en-extract.json"), "utf8")
);
const main = {};
for (const [k, v] of Object.entries(mainExtract.main)) {
  if (v.length > 3 && !v.startsWith("<motion") && !v.startsWith("<motion class")) main[k] = v;
}
const l1Extract = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../locales/main-l1-extract.json"), "utf8")
);
main.l1 = l1Extract.l1;

const playground = {
  panelTitle: "Force Lab Playground",
  panelLead:
    "Try every lesson-style demo below, spawn toys, and push them. Toys collide with equal-and-opposite pushes (Newton's 3rd law)!",
  orbitHint: "Ctrl + drag on the canvas to rotate the view · Drag a toy (no Ctrl) to push",
  guidedTitle: "Guided experiments (all examples)",
  assetsTitle: "3D asset library",
  worldTitle: "World switches",
  iceLane: "Ice lane (low friction)",
  wallRight: "Wall on the right",
  frictionLabel: "Rough ground friction",
  clearToys: "Clear toys",
  resetLab: "Reset lab",
  backMissions: "← Back to missions",
  objectsCount: "Objects on canvas:",
  spawnTitle: "Spawn {label}",
  presetCoach: "{label} - {tip} Watch the canvas, then push toys yourself!",
  ctrlDragCoach:
    "Hold Ctrl and drag to rotate the view. Without Ctrl, drag a toy to push it.",
  hudChip: "Playground - Ctrl+drag to rotate · drag toys to push",
  welcomeCoach:
    "Welcome to the Force Lab Playground! Try a guided experiment, spawn toys, then drag on the 3D canvas to push them.",
  groups: {
    motion: "Motion & inertia",
    compare: "Compare forces",
    pairs: "Pairs & collisions",
    forces: "Forces on objects",
    ramps: "Ramps, ropes & pulleys",
    orbit: "Orbit, drag & magnets",
  },
  assetGroups: {
    vehicles: "Cars & trucks",
    props: "Rocks & boxes",
    factory: "Factory kit",
    city: "City kit",
  },
  presets: {
    drift: { label: "🚗 Drift car", tip: "Race car coasts on ice lane" },
    glideRock: { label: "🪨 Glide rock", tip: "Rock slides with tiny friction" },
    glideTire: { label: "🛞 Hockey puck", tip: "Tire glides like a puck" },
    glideCrate: { label: "📦 Heavy glide", tip: "Wide crate creeps on ice" },
    puckDrift: { label: "🏒 Tire drift", tip: "Fast tire on blue lane" },
    shove: { label: "👆 Shove car", tip: "Push keeps adding speed" },
    wakeRock: { label: "😴 Wake the rock", tip: "Sleepy rock - drag to push" },
    kickedBall: { label: "⚽ Ball slows down", tip: "Tire rolls then friction wins" },
    race: { label: "🏁 Light vs heavy", tip: "Same push, different mass" },
    forceCompare: { label: "💪 Weak vs strong push", tip: "Two crates, different shoves" },
    frictionCompare: { label: "🛑 Ice vs rough stop", tip: "Same start, different slide" },
    recoil: { label: "↔️ Recoil crates", tip: "Newton 3: equal push apart" },
    wall: { label: "🧱 Hit the wall", tip: "Wall pushes back" },
    tugWar: { label: "🪢 Tug-of-war", tip: "Teams pull the knot" },
    balancedBall: { label: "⚖️ Balanced forces", tip: "Weight + support cancel" },
    forceVectors: { label: "🧭 Force arrows", tip: "Combine pushes like vectors" },
    rocketPush: { label: "🚀 Rocket thrust", tip: "Exhaust down, rocket up" },
    rampSlide: { label: "📐 Ramp slide", tip: "Block on a slope" },
    ropeLift: { label: "🏗️ Rope tension", tip: "Cable lifts a crate" },
    pulley: { label: "⚙️ Pulley pair", tip: "Two masses, one string" },
    elevator: { label: "🛗 Elevator", tip: "Cab goes up and down" },
    orbit: { label: "🛰️ Orbit path", tip: "Satellite curves around Earth" },
    magnetLift: { label: "🧲 Magnet lift", tip: "Magnetic pull on metal" },
    parachute: { label: "🪂 Parachute", tip: "Air drag + weight" },
  },
  assets: {
    wall: "Wall",
    boxLarge: "Big crate",
    boxSmall: "Small crate",
    boxWide: "Wide crate",
    magnet: "Magnet",
    crane: "Crane",
    conveyor: "Conveyor",
    rampPlank: "Ramp",
    structure: "Factory",
    robotArm: "Robot arm",
    carSports: "Sports car",
    carRace: "Race car",
    carSedan: "Sedan",
    truck: "Truck",
    kart: "Kart",
    delivery: "Delivery van",
    van: "Van",
    tire: "Tire",
    cone: "Cone",
    barrel: "Barrel",
    rocks: "Rocks",
    parasol: "Parasol",
    building: "Building",
  },
};

const hints = [
  "Read Coach Force slowly. Every sub-level has one main idea.",
  "Forces are pushes/pulls on a body; motion can continue without new forces (inertia) unless friction or other forces intervene.",
  "Draw vectors: direction matters as much as size.",
  "Net force = vector sum of all forces on one object.",
];

const en = {
  shell,
  ui,
  lab,
  forceNames,
  levels,
  adv: advExtract.adv,
  main,
  playground,
  hints,
};

fs.writeFileSync(path.join(__dirname, "../locales/en.json"), JSON.stringify(en, null, 2));
console.log("Wrote locales/en.json", Object.keys(advExtract.adv).length, "adv keys");
