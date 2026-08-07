const fs = require("fs");
const p = require("path").join(__dirname, "../js/main.js");
let s = fs.readFileSync(p, "utf8");

if (!s.includes("game-core.js")) {
  s = s.replace(
    'import { scaledDwellMs, SCENE_MOTION_MULT, ROCK_PROGRESS_FRAMES_CAP } from "./timings.js";',
    `import { scaledDwellMs, SCENE_MOTION_MULT, ROCK_PROGRESS_FRAMES_CAP } from "./timings.js";
import {
  LEVEL_META, loadSave, saveGame, defaultRewards, updateKidProgressUI, REWARD_ICONS,
} from "./game-core.js";
import { initAssetLoader } from "./asset-loader.js";`
  );
}

s = s.replace(
  /const LEVELS = \[[\s\S]*?\];/,
  `const LEVELS = LEVEL_META.map((m, i) => ({
  title: \`Level \${i + 1}: \${m.kidTitle}\`,
  subtitle: m.kidTitle,
  forceTheme: m.forceTheme,
  checkpointAfter: i === 2 ? "quiz" : i === 4 ? "exam" : i === 9 ? "final" : null,
}));`
);

if (!s.includes("btn-try-again")) {
  s = s.replace(
    'const btnRestart = document.getElementById("btn-restart");',
    `const btnTryAgain = document.getElementById("btn-try-again");
const btnRestart = btnTryAgain;`
  );
}

if (!s.includes("progress-fill")) {
  s = s.replace(
    'const stageEl = document.querySelector(".stage");',
    `const stageEl = document.querySelector(".stage");
const progressFill = document.getElementById("progress-fill");
const progressLabel = document.getElementById("progress-label");
const rewardSlot = document.getElementById("reward-slot");
const toastRoot = document.getElementById("toast-root");`
  );
}

s = s.replace(
  /const state = \{[\s\S]*?levelEnteredAt: Date\.now\(\),\n\};/,
  `const state = {
  level: 0,
  sub: 0,
  completed: LEVELS.map(() => Array(10).fill(false)),
  hintLevel: 0,
  levelEnteredAt: Date.now(),
  introSeen: LEVELS.map(() => false),
  rewards: defaultRewards(),
};
let tryAgainHandler = null;

const saved = loadSave();
if (saved) {
  if (typeof saved.level === "number") state.level = Math.min(9, Math.max(0, saved.level));
  if (typeof saved.sub === "number") state.sub = Math.min(9, Math.max(0, saved.sub));
  if (Array.isArray(saved.completed)) state.completed = saved.completed;
  if (Array.isArray(saved.rewards)) state.rewards = saved.rewards;
  if (Array.isArray(saved.introSeen)) state.introSeen = saved.introSeen;
}`
);

fs.writeFileSync(p, s);
console.log("patch-main.js done");
