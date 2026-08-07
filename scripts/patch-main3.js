const fs = require("fs");
const p = require("path").join(__dirname, "../js/main.js");
let s = fs.readFileSync(p, "utf8");

if (!s.includes("bindGameUI")) {
  s = s.replace(
    'import { initAssetLoader } from "./asset-loader.js";',
    `import { initAssetLoader } from "./asset-loader.js";
import { bindGameUI } from "./game-ui.js";`
  );
}

if (!s.includes("introSeen")) {
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
}

if (!s.includes("const gameUI = bindGameUI")) {
  s = s.replace(
    "function setCoach(html, actionsHtml = \"\") {",
    `let gameUI;

function setCoach(html, actionsHtml = "") {`
  );

  s = s.replace(
    "function updateProgressUI() {\n  const L = LEVELS[state.level];",
    `function updateProgressUI() {
  if (gameUI) gameUI.updateProgressUI();
  return;
  const L = LEVELS[state.level];`
  );
}

// completeCurrentSub
if (!s.includes("saveGame(state)")) {
  s = s.replace(
    `function completeCurrentSub() {
  state.completed[state.level][state.sub] = true;
  const totalDone = state.completed.flat().filter(Boolean).length;
  scoresEl.textContent = \`⭐ \${totalDone} / 100 sub-levels · Level \${state.level + 1} · \${state.completed[state.level].filter(Boolean).length}/10 done\`;
  showNext(true);
  updateProgressUI();
}`,
    `function completeCurrentSub() {
  state.completed[state.level][state.sub] = true;
  saveGame(state);
  showNext(true);
  if (gameUI) {
    gameUI.updateProgressUI();
    gameUI.showToast("Step " + (state.sub + 1) + " done! Tap Next.");
  }
  playSubCompleteFx();
}`
  );
}

// advanceSub - add level quiz
s = s.replace(
  `  const finished = state.level;
  const meta = LEVELS[finished];
  const proceedAfterLevel = () => {
    if (finished >= 9) {
      goToNextLevel();
      return;
    }
    showLevelCompleteModal(finished, () => goToNextLevel());
  };
  if (meta.checkpointAfter) {
    openCheckpointModal(meta.checkpointAfter, proceedAfterLevel);
  } else {
    proceedAfterLevel();
  }`,
  `  const finished = state.level;
  const proceedAfterLevel = () => {
    if (finished >= 9) {
      goToNextLevel();
      return;
    }
    showLevelCompleteModal(finished, () => goToNextLevel());
  };
  const meta = LEVELS[finished];
  const afterQuiz = () => {
    if (meta.checkpointAfter) openCheckpointModal(meta.checkpointAfter, proceedAfterLevel);
    else proceedAfterLevel();
  };
  if (gameUI) gameUI.openLevelQuiz(finished, afterQuiz);
  else afterQuiz();`
);

// runCurrent
s = s.replace(
  `function runCurrent() {
  if (detachInteract) {
    detachInteract();
    detachInteract = null;
  }
  arena.clearExtras();
  clearViewportHud();
  if (state.sub === 0) state.levelEnteredAt = Date.now();
  updateProgressUI();
  if (state.level === 0) runLevel1();
  else runAdvancedLevel(buildLevelApi());
}`,
  `function playSubCompleteFx() {
  if (subDots) {
    const cur = subDots.querySelector(".sub-dot.current");
    if (cur) cur.classList.add("step-done-flash");
  }
}

function runSubContent() {
  if (detachInteract) {
    detachInteract();
    detachInteract = null;
  }
  arena.clearExtras();
  clearViewportHud();
  if (state.sub === 0) state.levelEnteredAt = Date.now();
  updateProgressUI();
  if (state.level === 0) runLevel1();
  else runAdvancedLevel(buildLevelApi());
}

function runCurrent() {
  const go = () => runSubContent();
  if (gameUI) gameUI.maybeRunWithIntro(go);
  else go();
}`
);

// boot
s = s.replace(
  `/* boot */
updateProgressUI();
runCurrent();`,
  `function registerTryAgain(fn) {
  tryAgainHandler = fn;
  if (btnTryAgain) btnTryAgain.onclick = () => { if (tryAgainHandler) tryAgainHandler(); };
}

function buildLevelApi() {
  return {
    state,
    arena,
    THREE,
    setCoach,
    mountOverlay,
    clearOverlay,
    completeCurrentSub,
    btnRestart,
    setInteractCleanup,
    registerTryAgain,
  };
}

/* boot */
gameUI = bindGameUI({
  state,
  LEVELS,
  modalRoot,
  toastRoot,
  getEls: () => ({
    levelTitle,
    levelSelect,
    subDots,
    scoresEl,
    progressFill,
    progressLabel,
    rewardSlot,
    labDepth: document.getElementById("lab-depth"),
    checkpointBadge,
  }),
  showNext,
  runCurrent: runSubContent,
});

initAssetLoader().then(() => {
  if (arena.applyKenneyAssets) arena.applyKenneyAssets();
});

updateProgressUI();
runCurrent();`
);

// Remove duplicate buildLevelApi if we added second one - check
const count = (s.match(/function buildLevelApi/g) || []).length;
if (count > 1) {
  s = s.replace(/\nfunction buildLevelApi\(\) \{\n  return \{\n    state,\n    arena,\n    THREE,\n    setCoach,\n    mountOverlay,\n    clearOverlay,\n    completeCurrentSub,\n    btnRestart,\n    setInteractCleanup,\n  \};\n\}\n/, "\n");
}

// Remove btnResetArena if references missing element
s = s.replace(
  /if \(btnResetArena\) \{\s*btnResetArena\.addEventListener\("click", \(\) => btnRestart\.click\(\)\);\s*\}\s*/,
  ""
);

// Fix hints
s = s.replace(
  /setCoach\(coachText\.innerHTML \+ `<br\/><em>Hint/,
  "setCoach(`<em>Hint"
);

// showNext labels kid friendly
s = s.replace(
  /label = `Next: go to sub-level \$\{state\.sub \+ 2\}\/10`;/,
  'label = `Next step (${state.sub + 2}/10)`;'
);

fs.writeFileSync(p, s);
console.log("patch-main3 done, buildLevelApi count:", count);
