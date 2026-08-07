import { initI18n, setLocale, getLocale, onLocaleChange, t, applyShellI18n, getLevelMeta } from "./i18n.js";
import { createForceArena } from "./scene3d.js";
import { runAdvancedLevel } from "./levels-advanced.js";
import {
  mountDemoWithDwell,
  mountMotionChain,
  mountDragZones,
  runChain,
  mountRevealSteps,
  replayArenaScene,
  applyArenaScene,
} from "./lab-dnd.js";
import { mountPlaygroundUI } from "./playground-ui.js";
import { bindAimDragPush } from "./aim-drag.js";
import { scaledDwellMs, SCENE_MOTION_MULT, ROCK_PROGRESS_FRAMES_CAP } from "./timings.js";
import {
  LEVEL_META,
  LEVEL_DEMO_SCENES,
  loadSave,
  saveGame,
  clearSave,
  defaultRewards,
  normalizeCompleted,
  normalizeIntroSeen,
  normalizeRewards,
  updateKidProgressUI,
  REWARD_ICONS,
} from "./game-core.js";
import { initAssetLoader } from "./asset-loader.js";
import { bindGameUI } from "./game-ui.js";
import {
  stopVoice,
  playVoice,
  voiceKey,
  ensureVoiceButton,
  plainTextFromHtml,
  showVoiceCaption,
} from "/engine/js/voice.js";
import {
  ensureMissionHubStyles,
  setMissionHubMode,
  mountMissionHub,
  missionsFromLevels,
} from "/engine/js/mission-hub.js";

const THREE = window.THREE;
const GAME_VOICE_ID = "force-fighter";
const voiceCaption = document.getElementById("voice-caption");
const headActions = document.querySelector(".play-dock__head-actions");
let activeVoiceKey = null;

function buildLevels() {
  const meta = getLevelMeta();
  return meta.map((m, i) => ({
    title: `${i + 1}: ${m.kidTitle}`,
    subtitle: m.kidTitle,
    forceTheme: m.forceTheme,
    checkpointAfter: i === 2 ? "quiz" : i === 4 ? "exam" : i === 9 ? "final" : null,
  }));
}
let LEVELS = [];

function syncLevelsAndProgress() {
  LEVELS = buildLevels();
  const n = LEVELS.length || LEVEL_META.length;
  state.completed = normalizeCompleted(state.completed, n, 10);
  state.introSeen = normalizeIntroSeen(state.introSeen, n);
  state.rewards = normalizeRewards(state.rewards, n);
  state.level = Math.min(Math.max(0, state.level), Math.max(0, n - 1));
  state.sub = Math.min(9, Math.max(0, state.sub));
}

const canvas = document.getElementById("c3d");
const overlay = document.getElementById("overlay");
const viewportHud = document.getElementById("viewport-hud");
const coachText = document.getElementById("coach-text");
const coachActions = document.getElementById("coach-actions");
const levelSelect = document.getElementById("level-select");
const levelTitle = document.getElementById("level-title");
const subDots = document.getElementById("sub-dots");
const scoresEl = document.getElementById("scores");
const btnHint = document.getElementById("btn-hint");
const btnTryAgain = document.getElementById("btn-try-again");
const btnRestart = btnTryAgain;
const btnNext = document.getElementById("btn-next");
const checkpointBadge = document.getElementById("checkpoint-badge");
const hubRoot = document.getElementById("mission-hub-root");
const playChrome = document.getElementById("play-chrome");
const btnMissions = document.getElementById("btn-missions");
let inHub = true;
const modalRoot = document.getElementById("modal-root");
const btnTogglePanel = document.getElementById("btn-toggle-panel");
const btnNextDock = document.getElementById("btn-next-dock");
const playDock = document.getElementById("play-dock");
const stageEl = document.querySelector(".stage");
const progressFill = document.getElementById("progress-fill");
const progressLabel = document.getElementById("progress-label");
const rewardSlot = document.getElementById("reward-slot");
const toastRoot = document.getElementById("toast-root");
const btnPlayground = document.getElementById("btn-playground");
const btnResetAll = document.getElementById("btn-reset-all");
const langSelect = document.getElementById("lang-select");
const appRoot = document.getElementById("app");

const arena = createForceArena(canvas);
if (typeof window !== "undefined") {
  window.__arena = arena;
}
let raf = 0;
/** @type {null | (() => void)} */
let detachInteract = null;

function loop(t) {
  raf = requestAnimationFrame(loop);
  arena.tick(t);
}
raf = requestAnimationFrame(loop);

function resizeAll() {
  arena.resize();
  paginateOverlayPanel();
}
window.addEventListener("resize", resizeAll);
if (typeof ResizeObserver !== "undefined") {
  new ResizeObserver(resizeAll).observe(document.getElementById("viewport"));
}

function populateLevelSelect() {
  if (!levelSelect) return;
  levelSelect.innerHTML = "";
  LEVELS.forEach((L, i) => {
    const o = document.createElement("option");
    o.value = String(i);
    o.textContent = `${i + 1}. ${L.subtitle}`;
    levelSelect.appendChild(o);
  });
  levelSelect.value = String(state.level);
}

const state = {
  level: 0,
  sub: 0,
  completed: normalizeCompleted(null, LEVEL_META.length, 10),
  hintLevel: 0,
  levelEnteredAt: Date.now(),
  introSeen: normalizeIntroSeen(null, LEVEL_META.length),
  rewards: defaultRewards(),
};
let tryAgainHandler = null;

const saved = loadSave();
if (saved) {
  if (typeof saved.level === "number") state.level = Math.min(9, Math.max(0, saved.level));
  if (typeof saved.sub === "number") state.sub = Math.min(9, Math.max(0, saved.sub));
  if (Array.isArray(saved.completed)) {
    state.completed = normalizeCompleted(saved.completed, LEVEL_META.length, 10);
  }
  if (Array.isArray(saved.rewards)) {
    state.rewards = normalizeRewards(saved.rewards, LEVEL_META.length);
  }
  if (Array.isArray(saved.introSeen)) {
    state.introSeen = normalizeIntroSeen(saved.introSeen, LEVEL_META.length);
  }
}

let gameUI;
let playgroundCtl = null;
let inPlayground = false;

function syncPlaygroundButton() {
  if (!btnPlayground) return;
  if (inPlayground) {
    btnPlayground.disabled = false;
    btnPlayground.textContent = t("shell.backToGame");
    btnPlayground.title = t("shell.backToGameTitle");
    btnPlayground.setAttribute("aria-label", t("shell.backToGameAria"));
    btnPlayground.classList.add("is-active", "btn-playground--exit");
  } else {
    btnPlayground.disabled = false;
    btnPlayground.textContent = `🧪 ${t("shell.playground")}`;
    btnPlayground.title = t("shell.playgroundTitle");
    btnPlayground.setAttribute("aria-label", t("shell.playgroundAria"));
    btnPlayground.classList.remove("is-active", "btn-playground--exit");
  }
}

function enterPlaygroundMode() {
  if (inPlayground) return;
  inPlayground = true;
  stopVoice();
  showVoiceCaption(voiceCaption, "");
  syncPlaygroundButton();
  invokeInteractCleanup();
  showNext(false);
  appRoot?.classList.add("app--playground");
  playDock?.classList.remove("is-collapsed");
  stageEl?.classList.remove("stage--dock-collapsed");
  if (btnTogglePanel) btnTogglePanel.textContent = "−";
  levelSelect.disabled = true;
  btnPlayground?.classList.add("is-active");
  if (viewportHud) {
    viewportHud.innerHTML = `
      <button type="button" class="btn primary viewport-hud__exit" id="pg-hud-exit">${t("shell.backToGame")}</button>
      <span class="viewport-hud__chip">🧪 ${t("playground.hudChip")}</span>`;
    document.getElementById("pg-hud-exit")?.addEventListener("click", exitPlaygroundMode);
  }
  setCoach(t("playground.welcomeCoach"), "");
  clearOverlay();
  mountOverlay(`<div class="card playground-card"><div id="pg-host"></div></div>`);
  const host = document.getElementById("pg-host");
  if (!playgroundCtl) {
    playgroundCtl = mountPlaygroundUI({
      arena,
      canvas,
      setCoach,
      onExit: exitPlaygroundMode,
    });
  }
  arena.enterPlayground();
  if (host) {
    playgroundCtl.mountPanel(host);
    import("./asset-loader.js").then(({ whenAllAssetsReady }) => {
      whenAllAssetsReady().then(() => playgroundCtl?.refreshAssetSpawn?.());
    });
  }
  registerTryAgain(() => {
    arena.enterPlayground();
    playgroundCtl?.updateCount();
  });
  saveGame(state);
}

function exitPlaygroundMode() {
  if (!inPlayground) return;
  inPlayground = false;
  syncPlaygroundButton();
  appRoot?.classList.remove("app--playground");
  levelSelect.disabled = false;
  playgroundCtl?.cleanup();
  arena.exitPlayground();
  dismissModals();
  clearOverlay();
  clearViewportHud();
  registerTryAgain(null);
  saveGame(state);
  replayArenaScene();
  runCurrent();
}

function setCoach(html, actionsHtml = "") {
  coachText.innerHTML = html;
  coachActions.innerHTML = actionsHtml;
  const caption = plainTextFromHtml(html);
  showVoiceCaption(voiceCaption, caption);
  schedulePaginate();
}

function wireForceVoiceButton() {
  ensureVoiceButton(headActions, {
    gameId: GAME_VOICE_ID,
    locale: getLocale(),
    getKey: () => activeVoiceKey,
    getText: () => (voiceCaption?.textContent || coachText?.textContent || "").trim(),
  });
}

function narrateForceStep(kind = "sub") {
  const key = kind === "intro" ? voiceKey(state.level, "intro") : voiceKey(state.level, "sub", state.sub);
  activeVoiceKey = key;
  wireForceVoiceButton();
  const text = (voiceCaption?.textContent || coachText?.textContent || "").trim();
  if (key) playVoice(GAME_VOICE_ID, getLocale(), key, text);
}

function updateProgressUI() {
  if (gameUI) gameUI.updateProgressUI();
}

function showNext(show) {
  btnNext.classList.toggle("hidden", !show);
  if (btnNextDock) btnNextDock.classList.toggle("hidden", !show);
  let label = t("shell.next");
  if (show) {
    const lastSub = state.sub >= 9;
    const L = LEVELS[state.level];
    if (lastSub) {
      if (state.level >= 9) {
        label = L.checkpointAfter ? t("ui.nextFinal") : t("ui.nextComplete");
      } else {
        label = L.checkpointAfter
          ? t("ui.nextCheckpoint")
          : t("ui.nextFinishLevel", { cur: state.level + 1, cur2: state.level + 2 });
      }
    } else {
      label = t("ui.nextStepLabel", { n: state.sub + 2 });
    }
  }
  btnNext.textContent = label;
  if (btnNextDock) btnNextDock.textContent = t("shell.nextDock");
}

function showLevelCompleteModal(finishedIdx, onBeginNext) {
  const cur = LEVELS[finishedIdx];
  const nxt = LEVELS[finishedIdx + 1];
  modalRoot.innerHTML = `
    <div class="card modal-card level-gate">
      <h2>${t("ui.levelGateTitle", { n: finishedIdx + 1 })}</h2>
      <p class="level-gate__prev">${cur.title}</p>
      <p>${t("ui.levelGateBody")}</p>
      <p class="level-gate__next"><strong>${t("ui.nextMission")}</strong> ${nxt.title}</p>
      <p class="level-gate__sub">${nxt.subtitle}</p>
      <button type="button" class="btn primary" id="gate-go">${t("ui.beginLevel", { n: finishedIdx + 2 })}</button>
    </div>`;
  modalRoot.setAttribute("aria-hidden", "false");
  document.getElementById("gate-go").onclick = () => {
    modalRoot.setAttribute("aria-hidden", "true");
    modalRoot.innerHTML = "";
    onBeginNext();
  };
}

function dismissModals() {
  if (!modalRoot) return;
  modalRoot.setAttribute("aria-hidden", "true");
  modalRoot.innerHTML = "";
}

function applyFreshGameState() {
  state.level = 0;
  state.sub = 0;
  state.completed = normalizeCompleted(null, LEVEL_META.length, 10);
  state.hintLevel = 0;
  state.levelEnteredAt = Date.now();
  state.introSeen = normalizeIntroSeen(null, LEVEL_META.length);
  state.rewards = defaultRewards();
}

function resetAllProgress() {
  if (inPlayground) {
    playgroundCtl?.cleanup();
    arena.exitPlayground();
    inPlayground = false;
    syncPlaygroundButton();
    appRoot?.classList.remove("app--playground");
    levelSelect.disabled = false;
    registerTryAgain(null);
  }
  invokeInteractCleanup();
  dismissModals();
  applyFreshGameState();
  syncLevelsAndProgress();
  clearSave();
  saveGame(state);
  if (levelSelect) {
    populateLevelSelect();
    levelSelect.value = "0";
  }
  showNext(false);
  clearOverlay();
  clearViewportHud();
  arena.clearExtras();
  if (typeof arena.playExample === "function") {
    try {
      arena.playExample("idle", {});
    } catch (_) {
      /* ignore */
    }
  }
  syncPlaygroundButton();
  updateProgressUI();
  runCurrent();
  if (gameUI) gameUI.showToast(t("ui.resetToast"));
}

function openResetConfirmModal() {
  if (!modalRoot) {
    resetAllProgress();
    return;
  }
  modalRoot.innerHTML = `
    <div class="card modal-card">
      <h2>${t("ui.resetConfirmTitle")}</h2>
      <p>${t("ui.resetConfirmBody")}</p>
      <p class="drag-hint">${t("ui.resetCannotUndo")}</p>
      <div class="btn-row">
        <button type="button" class="btn secondary" id="reset-cancel">${t("ui.resetKeep")}</button>
        <button type="button" class="btn primary" id="reset-go">${t("ui.resetYes")}</button>
      </div>
    </div>`;
  modalRoot.setAttribute("aria-hidden", "false");
  document.getElementById("reset-cancel").onclick = dismissModals;
  document.getElementById("reset-go").onclick = () => {
    dismissModals();
    resetAllProgress();
  };
}

function clearViewportHud() {
  if (viewportHud) viewportHud.innerHTML = "";
}

function clearOverlay() {
  overlay.className = "play-dock__tasks";
  overlay.innerHTML = "";
}

function buildL1ChainApi() {
  return { state, clearOverlay, mountOverlay, completeCurrentSub, setCoach, btnRestart };
}

let interactCleanupBusy = false;

function invokeInteractCleanup() {
  const prev = detachInteract;
  detachInteract = null;
  if (!inPlayground) playgroundCtl?.cleanup();
  if (!prev || interactCleanupBusy) return;
  interactCleanupBusy = true;
  try {
    prev();
  } finally {
    interactCleanupBusy = false;
  }
}

function setInteractCleanup(fn) {
  const next = typeof fn === "function" ? fn : null;
  if (interactCleanupBusy) {
    if (next) detachInteract = next;
    return;
  }
  const prev = detachInteract;
  detachInteract = next;
  if (!prev || prev === next) return;
  interactCleanupBusy = true;
  try {
    prev();
  } finally {
    interactCleanupBusy = false;
  }
}

function registerTryAgain(fn) {
  tryAgainHandler = typeof fn === "function" ? fn : null;
  if (btnTryAgain) btnTryAgain.onclick = () => tryAgainHandler?.();
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

/**
 * @param {string} innerHtml
 * @param {{ passThrough?: boolean; dock?: 'bottom' }} [opts] dock ignored (lab panel is below canvas)
 */
function mountOverlay(innerHtml, opts = {}) {
  clearOverlay();
  const wrap = document.createElement("div");
  wrap.innerHTML = innerHtml;
  const el = wrap.firstElementChild || wrap;
  if (opts.passThrough) el.classList.add("pass-through");
  overlay.appendChild(el);
  schedulePaginate();
}

/* ---------- Pagination: split tall content into Part 1 / Part 2 (no scroll) ---------- */
let _paginateRaf = 0;
function schedulePaginate() {
  cancelAnimationFrame(_paginateRaf);
  _paginateRaf = requestAnimationFrame(() => requestAnimationFrame(paginateOverlayPanel));
}

function findPaginationTarget(host) {
  let cur = host;
  while (cur && cur.children && cur.children.length === 1) {
    cur = cur.firstElementChild;
  }
  return cur;
}

function unwrapOverlayPages(target) {
  if (!target) return;
  const oldNav = target.querySelector(":scope > .overlay-page-nav");
  if (oldNav) oldNav.remove();
  const pages = [...target.querySelectorAll(":scope > .overlay-page")];
  pages.forEach((p) => {
    while (p.firstChild) target.insertBefore(p.firstChild, p);
    p.remove();
  });
}

function paginateOverlayPanel() {
  const card = overlay.querySelector(":scope > .card");
  if (!card) return;

  const explicit = card.querySelector("[data-paginate]");
  if (!explicit) {
    const legacy = findPaginationTarget(card);
    if (legacy) unwrapOverlayPages(legacy);
    /* Without `[data-paginate]`, never split the whole card - that hid bottom
       actions (Continue) on “Part 2” and broke many sub-levels (e.g. Level 4). */
    return;
  }

  const target = explicit;
  unwrapOverlayPages(target);

  /* Lab shells (`mountMotionChain`, `mountDemoWithDwell`, `mountRevealSteps`) ship
     their own Continue / Next controls; overlay “Part Next” duplicated them. */
  if (explicit.closest(".lab-demo") || explicit.closest(".lab-reveal")) {
    return;
  }

  const panelRect = overlay.getBoundingClientRect();
  if (panelRect.height < 80) return;

  const targetStyle = getComputedStyle(target);
  const padTop = parseFloat(targetStyle.paddingTop) || 0;
  const padBot = parseFloat(targetStyle.paddingBottom) || 0;

  // Use the target's allotted box height (post-layout) as the ceiling.
  // For `[data-paginate]` regions we trust CSS to give them the right flex slot.
  const targetH = target.getBoundingClientRect().height;
  const NAV_H = 42;
  const maxTargetH = explicit
    ? targetH
    : (() => {
        const targetRect = target.getBoundingClientRect();
        const ceilTop = panelRect.bottom - panelRect.height + 12;
        return panelRect.bottom - Math.max(targetRect.top, ceilTop) - 8;
      })();
  const available = Math.max(80, maxTargetH - padTop - padBot - NAV_H - 8);

  // Already fits?
  if (target.scrollHeight <= maxTargetH + 4) return;

  const children = [...target.children];
  if (children.length <= 1) return;

  const pages = [];
  let cur = [];
  let h = 0;
  for (const child of children) {
    const ch = Math.max(child.offsetHeight, 0);
    if (cur.length > 0 && h + ch > available) {
      pages.push(cur);
      cur = [];
      h = 0;
    }
    cur.push(child);
    h += ch + 4;
  }
  if (cur.length > 0) pages.push(cur);
  if (pages.length <= 1) return;

  const wrappers = pages.map((items, i) => {
    const w = document.createElement("div");
    w.className = "overlay-page";
    if (i !== 0) w.style.display = "none";
    items.forEach((it) => w.appendChild(it));
    return w;
  });
  wrappers.forEach((w) => target.appendChild(w));

  const nav = document.createElement("div");
  nav.className = "overlay-page-nav";
  nav.innerHTML = `
    <button type="button" class="btn secondary page-prev" disabled aria-label="${t("lab.pagePrevAria")}">◀ ${t("lab.pagePrev")}</button>
    <span class="overlay-page-count">${t("lab.pageOf", { cur: 1, total: pages.length })}</span>
    <button type="button" class="btn secondary page-next" aria-label="${t("lab.pageNextAria")}">${t("lab.pageNext")} ▶</button>
  `;
  target.appendChild(nav);

  const prev = nav.querySelector(".page-prev");
  const next = nav.querySelector(".page-next");
  const count = nav.querySelector(".overlay-page-count");
  let curIdx = 0;
  const show = (i) => {
    curIdx = i;
    wrappers.forEach((w, idx) => {
      w.style.display = idx === i ? "" : "none";
    });
    prev.disabled = i === 0;
    next.disabled = i === wrappers.length - 1;
    count.textContent = t("lab.pageOf", { cur: i + 1, total: wrappers.length });
  };
  prev.addEventListener("click", () => show(Math.max(0, curIdx - 1)));
  next.addEventListener("click", () => show(Math.min(wrappers.length - 1, curIdx + 1)));
}

if (typeof window !== "undefined") {
  window.__paginateOverlay = schedulePaginate;
}

/* ---------- Raycasting for rock drag ---------- */
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

function ndcFromEvent(e, rect) {
  const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  pointer.set(x, y);
}

function pointOnGround(e) {
  const rect = canvas.getBoundingClientRect();
  ndcFromEvent(e, rect);
  raycaster.setFromCamera(pointer, arena.camera);
  const out = new THREE.Vector3();
  raycaster.ray.intersectPlane(plane, out);
  return out;
}

function hitsRock(e) {
  const rect = canvas.getBoundingClientRect();
  ndcFromEvent(e, rect);
  raycaster.setFromCamera(pointer, arena.camera);
  const hits = raycaster.intersectObject(arena.rock, true);
  return hits.length > 0;
}

/* ---------- Level 1 (full) ---------- */
function runLevel1() {
  const sub = state.sub;
  clearOverlay();
  clearViewportHud();
  showNext(false);
  state.hintLevel = 0;

  if (sub === 0) l1_sub1_intro();
  else if (sub === 1) l1_sub2_glide();
  else if (sub === 2) l1_sub3_forceOrNot();
  else if (sub === 3) l1_sub4_wall();
  else if (sub === 4) l1_sub5_explain();
  else if (sub === 5) l1_sub6_law();
  else if (sub === 6) l1_sub7_space();
  else if (sub === 7) l1_sub8_misconception();
  else if (sub === 8) l1_sub9_drill();
  else l1_sub10_mastery();
}

function completeCurrentSub() {
  state.completed[state.level][state.sub] = true;
  saveGame(state);
  showNext(true);
  updateProgressUI();
  if (gameUI) gameUI.showToast(t("ui.stepDoneToast", { n: state.sub + 1 }));
}

function advanceSub() {
  btnNext.classList.add("hidden");
  btnNext.textContent = t("main.m0022");
  if (state.sub < 9) {
    state.sub++;
    saveGame(state);
    showNext(false);
    runCurrent();
    return;
  }
  const finished = state.level;
  const meta = LEVELS[finished];
  const proceedAfterLevel = () => {
    if (finished >= 9) {
      goToNextLevel();
      return;
    }
    showLevelCompleteModal(finished, () => goToNextLevel());
  };
  const afterQuiz = () => {
    if (meta.checkpointAfter) openCheckpointModal(meta.checkpointAfter, proceedAfterLevel);
    else proceedAfterLevel();
  };
  if (gameUI) gameUI.openLevelQuiz(finished, afterQuiz);
  else afterQuiz();
}

function goToNextLevel() {
  dismissModals();
  if (state.level < 9) {
    state.level++;
    state.sub = 0;
    saveGame(state);
    showNext(false);
    runCurrent();
  } else {
    setCoach(t("main.m0006"), "");
    showNext(false);
  }
  updateProgressUI();
}

function openCheckpointModal(type, onPass) {
  modalRoot.innerHTML = "";
  modalRoot.setAttribute("aria-hidden", "false");
  const pool =
    type === "quiz"
      ? [
          {
            q: t("main.l1.k0003"),
            opts: [t("main.l1.k0043"), t("main.l1.k0020"), t("main.l1.k0022")],
            ok: 1,
          },
          {
            q: t("main.l1.k0026"),
            opts: [t("main.l1.k0016"), t("main.l1.k0067"), t("main.l1.k0013")],
            ok: 1,
          },
          {
            q: t("main.l1.k0040"),
            opts: [t("main.l1.k0033"), t("main.l1.k0032"), t("main.l1.k0034")],
            ok: 0,
          },
        ]
      : type === "exam"
        ? [
            {
              q: t("main.l1.k0039"),
              opts: [t("main.l1.k0001"), t("main.l1.k0002"), t("main.l1.k0000")],
              ok: 0,
            },
            {
              q: t("main.l1.k0006"),
              opts: [t("main.l1.k0049"), t("main.l1.k0078"), t("main.l1.k0062")],
              ok: 1,
            },
            {
              q: t("main.l1.k0065"),
              opts: [t("main.l1.k0063"), t("main.l1.k0024"), t("main.l1.k0008")],
              ok: 1,
            },
          ]
        : [
            {
              q: t("main.l1.k0012"),
              opts: [t("main.l1.k0028"), t("main.l1.k0029"), t("main.l1.k0036")],
              ok: 1,
            },
            {
              q: t("main.l1.k0050"),
              opts: [t("main.l1.k0068"), t("main.l1.k0031"), t("main.l1.k0058")],
              ok: 1,
            },
            {
              q: t("main.l1.k0048"),
              opts: [t("main.l1.k0007"), t("main.l1.k0054"), t("main.l1.k0053")],
              ok: 1,
            },
          ];

  let idx = 0;
  let correct = 0;

  function renderQ() {
    if (idx >= pool.length) {
      modalRoot.innerHTML = "";
      modalRoot.setAttribute("aria-hidden", "true");
      onPass();
      return;
    }
    const item = pool[idx];
    modalRoot.innerHTML = `
      <div class="card modal-card">
        <h2>${type === "quiz" ? t("ui.checkpointQuiz") : type === "exam" ? t("ui.checkpointExam") : t("ui.checkpointFinal")} (${idx + 1}/${pool.length})</h2>
        <p>${item.q}</p>
        <div class="mc-grid" id="cp-mc"></div>
      </div>`;
    const mc = modalRoot.querySelector("#cp-mc");
    item.opts.forEach((text, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = text;
      b.addEventListener("click", () => {
        if (i === item.ok) {
          correct++;
          idx++;
          renderQ();
        } else {
          b.classList.add("wrong-flash");
          setTimeout(() => b.classList.remove("wrong-flash"), 400);
        }
      });
      mc.appendChild(b);
    });
  }
  renderQ();
}

/* --- L1 sublevels --- */
function l1_sub1_intro() {
  setCoach(
    "Things stay still until you push them! Read the everyday examples, then wake the rock in 3D.",
    ""
  );
  mountOverlay(
    `<div class="card">
      <div id="l1-dwell"></div>
    </div>`,
  );
  mountMotionChain(document.getElementById("l1-dwell"), {
    title: t("main.l1.k0019"),
    beats: [
      {
        scene: "drift",
        sceneArgs: { withTrack: true, speed: 0, vehicle: "delivery" },
        dwellMs: 4200,
        html: `<p><strong>Motion 1 - Parked wheels:</strong> A CNG or rickshaw stays still until engine push beats friction and inertia.</p>
          <p>On the canvas a <strong>delivery van sits still</strong> on the blue lane (engines off).</p>`,
      },
      {
        scene: "glide",
        sceneArgs: { speed: 1.5, prop: "tire" },
        dwellMs: 4000,
        html: `<p><strong>Motion 2 - Curling stone:</strong> On ice, the stone keeps sliding; almost nothing pulls it backward.</p>
          <p>Watch the <strong>orange tire</strong> glide steadily on the blue track.</p>`,
      },
      {
        scene: "orbit",
        dwellMs: 3800,
        html: `<p><strong>Motion 3 - Orbit story:</strong> A satellite keeps curving because gravity keeps bending its path - no air drag in this toy view.</p>
          <p>Watch the <strong>top-down orbit</strong> path on the canvas.</p>`,
      },
      {
        scene: "rock",
        dwellMs: 4000,
        html: `<p><strong>Motion 4 - Your turn next:</strong> This sleepy rock has been still for ages.</p>
          <p>After the chain, <strong>you</strong> will drag on the canvas to wake it with a real push!</p>`,
      },
    ],
    onDone: () => {
      clearOverlay();
      l1_sub1_wakeRock();
    },
  });
  btnRestart.onclick = () => l1_sub1_intro();
}

function l1_sub1_wakeRock() {
  arena.playExample("rock");
  setCoach(
    "This rock has been sleeping for 1000 years! It refuses to move. <strong>Wake it up:</strong> click the rock, drag to the right, and release to push.",
    ""
  );
  mountOverlay(
    `
    <div class="card">
      <h2>Wake Up the Rock!</h2>
      <p>Drag from the rock toward the right. Longer drag = stronger shove.</p>
      <p class="drag-hint" id="drag-hint"></p>
    </div>`,
  );

  let hintT = setTimeout(() => {
    const el = document.getElementById("drag-hint");
    if (el) el.textContent = t("main.m0018");
  }, scaledDwellMs(5000));

  let aimCleanup = null;

  function cleanup() {
    clearTimeout(hintT);
    aimCleanup?.();
    aimCleanup = null;
    if (typeof arena.setRockAimDrag === "function") arena.setRockAimDrag(false);
    if (detachInteract === cleanup) detachInteract = null;
  }
  detachInteract = cleanup;

  aimCleanup = bindAimDragPush({
    canvas,
    pointOnGround,
    onPick: (e) => (hitsRock(e) ? arena.rock : null),
    getOrigin: () => arena.rockPosition(),
    onAimStart: () => {
      if (typeof arena.setRockAimDrag === "function") arena.setRockAimDrag(true);
    },
    onAimEnd: () => {
      if (typeof arena.setRockAimDrag === "function") arena.setRockAimDrag(false);
    },
    onMiss: () => setCoach(t("main.m0024"), ""),
    onShortDrag: () => setCoach(t("main.m0043"), ""),
    validateRelease: (dx) => (dx < 0.1 ? t("main.m0028") : null),
    onValidateFail: (msg) => setCoach(msg, ""),
    onImpulse: (_target, dx, dz, len) => {
      arena.applyImpulseToRock(dx, dz, Math.min(6, 1.5 + len * 0.35));
      const startPos = arena.rockPosition();
      aimCleanup?.();
      aimCleanup = null;
      if (detachInteract === cleanup) detachInteract = null;
      setCoach(t("main.m0005"), "");
      let frames = 0;
      const check = () => {
        frames++;
        const dist = arena.rockPosition().distanceTo(startPos);
        const slow = arena.rockVel.lengthSq() < 1e-4;
        if (dist > 1.35 || slow || frames > ROCK_PROGRESS_FRAMES_CAP) {
          cancelAnimationFrame(wait);
          completeCurrentSub();
          return;
        }
        wait = requestAnimationFrame(check);
      };
      let wait = requestAnimationFrame(check);
    },
    setArrow: (from, to) => arena.setArrow(from, to),
    clearArrow: () => arena.clearArrow(),
    arrowYOffset: 0.85,
    minLen: 0.35,
  });

  btnRestart.onclick = () => {
    cleanup();
    l1_sub1_intro();
  };
}

function l1_sub2_glide() {
  setCoach(t("main.m0040"), "");
  mountOverlay(
    `<div class="card">
      <div id="l2-dwell"></div>
    </div>`,
  );
  mountMotionChain(document.getElementById("l2-dwell"), {
    title: t("main.l1.k0035"),
    beats: [
      {
        scene: "drift",
        sceneArgs: { speed: 2.15, vehicle: "tire" },
        dwellMs: 4200,
        html: `<p><strong>Glide 1 - Hockey puck:</strong> Watch the <strong>orange tire</strong> zip on super-smooth ice. Almost no backward push from the surface.</p>`,
      },
      {
        scene: "glide",
        sceneArgs: { speed: 0.75, prop: "crate" },
        dwellMs: 4000,
        html: `<p><strong>Glide 2 - Ferry drum:</strong> A <strong>heavy wide crate</strong> creeps along a smooth gangway - same idea, slower because it is massive.</p>`,
      },
      {
        scene: "glide",
        sceneArgs: { speed: 1.85, prop: "rock" },
        dwellMs: 3800,
        html: `<p><strong>Glide 3 - Your rock lab:</strong> Our <strong>sleepy rock</strong> on the blue lane keeps a steady horizontal speed. Next you label that on a graph!</p>`,
      },
    ],
    onDone: () => {
      clearOverlay();
      l1_sub2_glideHandsOn();
    },
  });
  btnRestart.onclick = () => l1_sub2_glide();
}

function l1_sub2_glideHandsOn() {
  arena.startFrictionlessSlide();
  setCoach(t("main.m0038"), "");
  mountOverlay(
    `
    <div class="card">
      <h2>Glide lab</h2>
      <p class="readout" id="speed-read">Speed ≈ ${(2.2 / SCENE_MOTION_MULT).toFixed(2)} m/s (horizontal, long glide)</p>
      <div id="l2-dz"></div>
    </div>`,
  );
  mountDragZones(document.getElementById("l2-dz"), {
    title: t("main.l1.k0037"),
    instructions: t("main.l1.k0081"),
    zones: [{ id: "v", label: t("main.l1.k0025"), accept: ["flat"] }],
    chips: [
      { id: "flat", text: t("main.l1.k0066") },
      { id: "down", text: t("main.l1.k0064") },
      { id: "up", text: t("main.l1.k0030") },
    ],
    onDone: () => {
      clearOverlay();
      setCoach(
        "<strong>Exactly.</strong> With almost no net force along the track, speed does not decay “by itself.” That is Newton’s first law in straight-line form.",
        ""
      );
      completeCurrentSub();
    },
  });
  btnRestart.onclick = () => l1_sub2_glide();
}

function runMultiSceneQuiz(scenes, onDone) {
  applyArenaScene("drift", { withTrack: true });
  let i = 0;
  function step() {
    if (i >= scenes.length) {
      onDone();
      return;
    }
    const s = scenes[i];
    mountOverlay(`
      <div class="card">
        <h2>${s.title}</h2>
        <p>${s.prompt}</p>
        <div class="mc-grid" id="mq"></div>
      </div>`);
    const mq = document.getElementById("mq");
    s.choices.forEach((c, idx) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = c;
      b.onclick = () => {
        if (idx === s.correct) {
          i++;
          step();
        } else {
          b.classList.add("wrong-flash");
          setCoach(s.hintWrong, "");
        }
      };
      mq.appendChild(b);
    });
    setCoach(s.coach, "");
  }
  step();
}

function l1_sub3_forceOrNot() {
  const api = buildL1ChainApi();
  setCoach(t("main.m0012"), "");
  runChain(api, [
    (a, next) => {
      a.mountOverlay(`<div class="card"><div id="s3a"></div></div>`);
      mountMotionChain(document.getElementById("s3a"), {
        title: t("main.l1.k0059"),
        beats: [
          {
            scene: "drift",
            sceneArgs: { withTrack: true, speed: 0, vehicle: "delivery" },
            dwellMs: 3600,
            html: `<p><strong>Beat 1:</strong> Repair pod in deep space. Engines <strong>off</strong> - the van is parked on the lane.</p>`,
          },
          {
            scene: "drift",
            sceneArgs: { withTrack: true, speed: 1.9, vehicle: "kart" },
            dwellMs: 3400,
            html: `<p><strong>Beat 2:</strong> A gentle drift at steady speed - no new thrust in this story.</p>`,
          },
          {
            scene: "glide",
            sceneArgs: { speed: 2.0, prop: "tire" },
            dwellMs: 3200,
            html: `<p><strong>Beat 3:</strong> The tire keeps gliding - nothing fires, nothing pulls it backward here.</p>`,
          },
        ],
        onDone: () => {
          a.clearOverlay();
          next();
        },
      });
    },
    (a, next) => {
      a.mountOverlay(`<div class="card"><div id="dz3a"></div></div>`);
      mountDragZones(document.getElementById("dz3a"), {
        title: t("main.l1.k0074"),
        instructions: t("main.l1.k0017"),
        zones: [{ id: "z", label: t("main.l1.k0018"), accept: ["calm"] }],
        chips: [
          { id: "calm", text: t("main.l1.k0046") },
          { id: "wrong1", text: t("main.l1.k0004") },
          { id: "wrong2", text: t("main.l1.k0021") },
        ],
        onDone: () => {
          a.clearOverlay();
          next();
        },
      });
    },
    (a, next) => {
      a.mountOverlay(`<div class="card"><div id="s3b"></div></div>`);
      mountMotionChain(document.getElementById("s3b"), {
        title: t("main.l1.k0060"),
        beats: [
          {
            scene: "rest",
            sceneArgs: { shape: "ball", color: 0xd92d20, arrows: false, wobble: true },
            dwellMs: 3600,
            html: `<p><strong>Beat 1:</strong> Soccer ball at rest on turf - it does not fall through the ground.</p>`,
          },
          {
            scene: "rest",
            sceneArgs: { shape: "ball", color: 0xd92d20, arrows: true, wobble: true },
            dwellMs: 3400,
            html: `<p><strong>Beat 2:</strong> Earth pulls down (weight). The field pushes up (normal force) - see the arrows.</p>`,
          },
          {
            scene: "rest",
            sceneArgs: { shape: "wide", color: 0xc4a574, arrows: true, wobble: false },
            dwellMs: 3200,
            html: `<p><strong>Beat 3:</strong> A heavy crate parked on a dock - balanced forces, zero velocity. Still real forces!</p>`,
          },
        ],
        onDone: () => {
          a.clearOverlay();
          next();
        },
      });
    },
    (a, next) => {
      a.mountOverlay(`<div class="card"><div id="dz3b"></div></div>`);
      mountDragZones(document.getElementById("dz3b"), {
        title: t("main.l1.k0073"),
        instructions: t("main.l1.k0071"),
        zones: [{ id: "z", label: t("main.l1.k0010"), accept: ["bal"] }],
        chips: [
          { id: "bal", text: t("main.l1.k0080") },
          { id: "w1", text: t("main.l1.k0051") },
          { id: "w2", text: t("main.l1.k0045") },
        ],
        onDone: () => {
          a.clearOverlay();
          next();
        },
      });
    },
    (a, next) => {
      a.mountOverlay(`<div class="card"><div id="s3c"></div></div>`);
      mountMotionChain(document.getElementById("s3c"), {
        title: t("main.l1.k0061"),
        beats: [
          {
            scene: "shove",
            sceneArgs: { phase: "contact", vehicle: "kart" },
            dwellMs: 3600,
            html: `<p><strong>Beat 1:</strong> Your hand touches the kart - contact begins (short push arrow).</p>`,
          },
          {
            scene: "shove",
            sceneArgs: { phase: "accel", vehicle: "sports" },
            dwellMs: 3400,
            html: `<p><strong>Beat 2:</strong> While the shove lasts, the sports car speeds up - an unbalanced push.</p>`,
          },
          {
            scene: "shove",
            sceneArgs: { phase: "coast", vehicle: "delivery" },
            dwellMs: 3200,
            html: `<p><strong>Beat 3:</strong> Motion is not a force; the <strong>push</strong> from your hand was the force.</p>`,
          },
        ],
        onDone: () => {
          a.clearOverlay();
          next();
        },
      });
    },
    (a, next) => {
      a.mountOverlay(`<div class="card"><div id="dz3c"></div></div>`);
      mountDragZones(document.getElementById("dz3c"), {
        title: t("main.l1.k0077"),
        instructions: t("main.l1.k0083"),
        zones: [{ id: "z", label: t("main.l1.k0082"), accept: ["unb"] }],
        chips: [
          { id: "unb", text: t("main.l1.k0009") },
          { id: "w1", text: t("main.l1.k0044") },
          { id: "w2", text: t("main.l1.k0038") },
        ],
        onDone: () => {
          a.clearOverlay();
          next();
        },
      });
    },
    (a, next, finish) => {
      a.mountOverlay(`<div class="card"><h2>Recap question</h2>
        <p>Which scene was written so that <strong>no unbalanced force</strong> acts on the main object?</p>
        <div class="mc-grid" id="sum3"></div></div>`);
      const opts = [
        { t: "Drifting pod with engines off (Scene A)", ok: true },
        { t: "Ball parked on the ground (Scene B)", ok: false },
        { t: "Car pushed by a hand (Scene C)", ok: false },
      ];
      const g = document.getElementById("sum3");
      opts.forEach((o) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = o.t;
        b.onclick = () => {
          if (o.ok) {
            a.clearOverlay();
            a.setCoach(
              "Strong work. Scene A had no push or pull in the story, so <strong>no force</strong>. B and C both involve real forces on the object (balanced or unbalanced).",
              ""
            );
            finish();
          } else {
            b.classList.add("wrong-flash");
            a.setCoach(
              "Balanced forces are still forces. Scene A was the only “nothing pushes” drift in this set.",
              ""
            );
          }
        };
        g.appendChild(b);
      });
    },
  ]);
}

function l1_sub4_wall() {
  arena.startWallDemo();
  const api = buildL1ChainApi();
  setCoach(t("main.m0015"), "");
  runChain(api, [
    (a, next) => {
      a.mountOverlay(`<div class="card"><div id="w4d"></div></div>`);
      mountMotionChain(document.getElementById("w4d"), {
        title: t("main.l1.k0079"),
        beats: [
          {
            scene: "wall",
            sceneArgs: { phase: "approach", speed: 2.4 },
            dwellMs: 3800,
            html: `<p><strong>Beat 1:</strong> Rock rolls straight toward a rigid wall (green forward arrow).</p>`,
          },
          {
            scene: "wall",
            sceneArgs: { phase: "impact" },
            dwellMs: 3600,
            html: `<p><strong>Beat 2:</strong> Contact - the wall pushes <em>back</em> (red arrow) while the rock shoves forward (yellow).</p>`,
          },
          {
            scene: "wall",
            sceneArgs: { phase: "stop" },
            dwellMs: 3400,
            html: `<p><strong>Beat 3:</strong> Motion stops - the backward push from the wall stole the forward speed. Next you pick the arrow direction!</p>`,
          },
        ],
        onDone: () => {
          a.clearOverlay();
          next();
        },
      });
    },
    (a, next, finish) => {
      arena.startWallDemo();
      a.setCoach(t("main.m0027"), "");
      a.mountOverlay(`
    <div class="card">
      <h2>The wall stops the rock</h2>
      <p>Replay the slow hit on the canvas, then answer in the lab.</p>
      <div class="btn-row">
        <button type="button" class="btn primary" id="play-hit">Play slow hit</button>
      </div>
      <div id="arrow-pick" class="hidden" style="margin-top:0.75rem">
        <p>Rock was moving to the <strong>right</strong>. The wall’s force on the rock points:</p>
        <div class="btn-row">
          <button type="button" class="btn secondary" data-dir="left">← Left</button>
          <button type="button" class="btn secondary" data-dir="right">→ Right</button>
          <button type="button" class="btn secondary" data-dir="up">↑ Up</button>
        </div>
      </div>
    </div>`);

      document.getElementById("play-hit").onclick = () => {
        arena.startWallDemo();
        const pick = document.getElementById("arrow-pick");
        pick.classList.remove("hidden");
        pick.querySelectorAll("button[data-dir]").forEach((btn) => {
          btn.onclick = () => {
            if (btn.dataset.dir === "left") {
              a.clearOverlay();
              a.setCoach(t("main.m0003"), "");
              finish();
            } else {
              btn.classList.add("wrong-flash");
              setTimeout(() => btn.classList.remove("wrong-flash"), 400);
              a.setCoach(t("main.m0030"), "");
            }
          };
        });
      };
    },
  ]);
}

function l1_sub5_explain() {
  const api = buildL1ChainApi();
  arena.playExample("drift", { withTrack: true });
  setCoach(t("main.m0033"), "");
  runChain(api, [
    (a, next) => {
      a.mountOverlay(`<div class="card"><div id="r5"></div></div>`);
      mountRevealSteps(document.getElementById("r5"), {
        title: t("main.l1.k0070"),
        stepScenes: [
          { scene: "glide", sceneArgs: { prop: "tire", speed: 1.7 } },
          { scene: "drift", sceneArgs: { withTrack: true, speed: 1.4, vehicle: "delivery" } },
          { scene: "glide", sceneArgs: { prop: "crate", speed: 1.2 } },
        ],
        steps: [
          "Curling stone on pebbled ice: sideways grip is tiny, so the stone glides a long way before sweepers add controlled friction.",
          "Airport baggage belt: rollers keep a trunk gliding until a corner bumper or your hand applies a new sideways push.",
          "Astronaut toolkit released beside station: it drifts at nearly constant speed until a tether or jetpack gives a fresh force.",
        ],
        onDone: () => {
          a.clearOverlay();
          next();
        },
      });
    },
    (a, next, finish) => {
      a.setCoach(t("main.m0025"), "");
      a.mountOverlay(`
    <div class="card">
      <h2>Your explanation</h2>
      <textarea id="exp" placeholder="Try words like inertia, keep moving, no force..."></textarea>
      <div class="btn-row">
        <button type="button" class="btn primary" id="sub-exp">Submit</button>
      </div>
    </div>`);
      document.getElementById("sub-exp").onclick = () => {
        const v = document.getElementById("exp").value.trim().toLowerCase();
        if (v.length < 5) {
          a.setCoach(t("main.m0007"), "");
          return;
        }
        let reply =
          "Nice! Without unbalanced forces, motion doesn’t change. Physicists package that as <strong>inertia</strong>.";
        if (v.includes("inertia"))
          reply = "You said <strong>inertia</strong>. That’s the precise label. Objects resist changes to velocity.";
        else if (v.includes("keep") && v.includes("move"))
          reply =
            "You captured the idea: it keeps moving unless a force interferes. We call that property <strong>inertia</strong>.";
        a.clearOverlay();
        a.setCoach(
          reply + " Lock it in with the mantra button.",
          '<button type="button" class="btn primary" id="repeat">First law mantra</button>'
        );
        document.getElementById("repeat").onclick = () => {
          a.setCoach(
            "First law mantra: <em>rest stays rest; motion stays motion</em> unless an unbalanced force acts.",
            ""
          );
          finish();
        };
      };
    },
  ]);
}

function l1_sub6_law() {
  setCoach(t("main.m0017"), "");
  let stage = 0;
  const defs = {
    inertia: "Resistance of an object to changes in its motion",
    unbalanced: "A force that isn’t fully canceled; it changes velocity",
    rest: "Staying still (velocity = 0)",
  };
  const cards = [
    ["INERTIA", "inertia"],
    ["UNBALANCED FORCE", "unbalanced"],
    ["REST", "rest"],
  ];

  function showCard() {
    if (stage >= cards.length) {
      runMatch();
      return;
    }
    const [title, key] = cards[stage];
    mountOverlay(`
      <div class="card">
        <h2>Vocabulary card ${stage + 1}/3</h2>
        <p><strong>${title}</strong></p>
        <p>${defs[key]}</p>
        <div class="btn-row"><button type="button" class="btn primary" id="flip-next">Next card</button></div>
      </div>`);
    document.getElementById("flip-next").onclick = () => {
      stage++;
      showCard();
    };
  }

  function runMatch() {
    mountOverlay(`
      <div class="card">
        <h2>Match term → meaning</h2>
        <p>Click a term, then its meaning.</p>
        <div class="match-row">
          <div>
            <button type="button" class="term" data-t="inertia">INERTIA</button>
            <button type="button" class="term" data-t="unbalanced">UNBALANCED FORCE</button>
            <button type="button" class="term" data-t="rest">REST</button>
          </div>
          <div>
            <button type="button" class="mean" data-m="rest">Staying still</button>
            <button type="button" class="mean" data-m="inertia">Resistance to change in motion</button>
            <button type="button" class="mean" data-m="unbalanced">Net push that changes motion</button>
          </div>
        </div>
        <p id="match-status" class="drag-hint"></p>
      </div>`);
    let selT = null;
    const pairs = new Set();
    overlay.querySelectorAll(".term").forEach((b) => {
      b.onclick = () => {
        overlay.querySelectorAll(".term").forEach((x) => x.classList.remove("selected"));
        b.classList.add("selected");
        selT = b.dataset.t;
      };
    });
    overlay.querySelectorAll(".mean").forEach((b) => {
      b.onclick = () => {
        if (!selT) return;
        const ok = selT === b.dataset.m;
        const st = document.getElementById("match-status");
        if (ok) {
          pairs.add(selT);
          st.textContent = `Matched ${selT}! (${pairs.size}/3)`;
          if (pairs.size === 3) {
            clearOverlay();
            setCoach(t("main.m0020"), "");
            completeCurrentSub();
          }
        } else {
          st.textContent = t("main.m0034");
        }
      };
    });
  }

  showCard();
  btnRestart.onclick = () => l1_sub6_law();
}

function l1_sub7_space() {
  arena.playExample("orbit");
  if (viewportHud) {
    viewportHud.innerHTML =
      '<div class="hud-label">🛰 Satellite in orbit - no engine, constant speed</div>';
  }
  setCoach(
    "Pick the correct inertia line in the lab, then tap the <strong>asteroid button on the canvas</strong> (corner HUD) to supply the force.",
    ""
  );
  mountOverlay(`
    <div class="card">
      <h2>Save the space station</h2>
      <p>Which prediction matches Newton’s first law in this story?</p>
      <div class="mc-grid" id="stq"></div>
      <p id="bump-hint" class="drag-hint hidden">Use the glowing <strong>Asteroid</strong> control on the 3D view (does not cover the scene).</p>
    </div>`);
  const stq = document.getElementById("stq");
  const lines = [
    "It keeps drifting at the same speed until a force changes it",
    "It slows down by itself in empty space",
    "It speeds up because space is empty",
  ];
  let picked = false;
  lines.forEach((t, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = t;
    b.onclick = () => {
      if (i !== 0) {
        b.classList.add("wrong-flash");
        return;
      }
      picked = true;
      setCoach(t("main.m0029"), "");
      document.getElementById("bump-hint").classList.remove("hidden");
      if (viewportHud) {
        viewportHud.innerHTML = `<button type="button" class="btn primary hud-asteroid" id="hud-ast" aria-label="Nudge asteroid">★ Asteroid: tap to nudge</button>`;
        document.getElementById("hud-ast").onclick = () => {
          if (!picked) return;
          clearViewportHud();
          clearOverlay();
          setCoach(
            "You changed its motion with a bump: outside force, new velocity. Station lives to fight another day.",
            ""
          );
          completeCurrentSub();
        };
      }
    };
    stq.appendChild(b);
  });
  btnRestart.onclick = () => {
    clearViewportHud();
    l1_sub7_space();
  };
}

function l1_sub8_misconception() {
  const api = buildL1ChainApi();
  setCoach(t("main.m0039"), "");
  runChain(api, [
    (a, next) => {
      a.mountOverlay(`<div class="card"><div id="m8d"></div></div>`);
      mountDemoWithDwell(document.getElementById("m8d"), {
        rawDwellMs: 9000,
        scene: "kickedBall",
        html: `<p><strong>Cadet Smith claims:</strong> “The soccer ball keeps rolling because the kick keeps pushing it.”</p>
          <p><strong>Reality check:</strong> after your foot leaves the ball, contact from the foot is gone. Grass friction steals speed. Inertia is what keeps motion going <em>until</em> forces change it.</p>`,
        onContinue: () => {
          a.clearOverlay();
          next();
        },
      });
    },
    (a, next) => {
      a.mountOverlay(`<div class="card"><div id="m8z"></div></div>`);
      mountDragZones(document.getElementById("m8z"), {
        title: t("main.l1.k0076"),
        instructions: t("main.l1.k0014"),
        zones: [{ id: "z", label: t("main.l1.k0056"), accept: ["inert"] }],
        chips: [
          { id: "inert", text: t("main.l1.k0027") },
          { id: "kick", text: t("main.l1.k0072") },
          { id: "air", text: t("main.l1.k0057") },
        ],
        onDone: () => {
          a.clearOverlay();
          next();
        },
      });
    },
    (a, next, finish) => {
      a.setCoach(t("main.m0014"), "");
      a.mountOverlay(`
    <div class="card">
      <h2>Spot the misconception</h2>
      <div class="mc-grid" id="mis"></div>
    </div>`);
      const mis = document.getElementById("mis");
      [
        "Inertia carries motion; friction slows it, no forward force needed to keep rolling",
        "Air secretly pushes forward forever",
        "Smith is fully correct",
      ].forEach((t, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = t;
        b.onclick = () => {
          if (i === 0) {
            a.clearOverlay();
            a.setCoach(
              "Exactly: friction is why it slows; inertia is why it kept going after the foot stopped pushing.",
              ""
            );
            finish();
          } else {
            b.classList.add("wrong-flash");
            a.setCoach(t("main.m0036"), "");
          }
        };
        mis.appendChild(b);
      });
    },
  ]);
}

function l1_sub9_drill() {
  const api = buildL1ChainApi();
  setCoach(t("main.m0032"), "");
  runChain(api, [
    (a, next) => {
      a.mountOverlay(`<div class="card"><div id="r9"></div></div>`);
      mountRevealSteps(document.getElementById("r9"), {
        title: t("main.l1.k0011"),
        stepScenes: [
          { scene: "rest", sceneArgs: { shape: "ball", arrows: true } },
          { scene: "glide", sceneArgs: { prop: "rock", speed: 1.6 } },
          { scene: "orbit", sceneArgs: { radius: 2.2, showGravity: true } },
        ],
        steps: [
          "Separate what you <em>see</em> (velocity) from what <em>acts</em> (forces). Same motion can hide different force stories.",
          "Zero acceleration can pair with motion that is not zero, like a probe coasting in deep space.",
          "Ready: the next card fires three tap-to-answer shots back-to-back.",
        ],
        onDone: () => {
          a.clearOverlay();
          next();
        },
      });
    },
    (a, next, finish) => {
      runMultiSceneQuiz(
        [
          {
            title: "Q1",
            prompt: "A book on a table doesn’t move because…",
            choices: ["No forces", "Forces balance", t("main.l1.k0022")],
            correct: 1,
            coach: t("main.l1.k0069"),
            hintWrong: t("main.l1.k0023"),
          },
          {
            title: "Q2",
            prompt: "Throw a ball in empty space with no drag or gravity. It will…",
            choices: ["Stop after 100 m", "Keep the same speed forever", "Speed up alone"],
            correct: 1,
            coach: t("main.l1.k0042"),
            hintWrong: t("main.l1.k0041"),
          },
          {
            title: "Q3",
            prompt: "Shuttle moves left at 50 m/s. Which unbalanced force changes path to bend rightward?",
            choices: ["Push forward (left)", "Push from the left side (has a rightward component)", "Push straight up only"],
            correct: 1,
            coach: t("main.l1.k0005"),
            hintWrong: t("main.l1.k0085"),
          },
        ],
        () => {
          a.clearOverlay();
          a.setCoach(t("main.m0011"), "");
          finish();
        }
      );
    },
  ]);
}

function l1_sub10_mastery() {
  const api = buildL1ChainApi();
  setCoach(t("main.m0021"), "");
  runChain(api, [
    (a, next) => {
      a.mountOverlay(`<div class="card"><div id="t10d"></div></div>`);
      mountDemoWithDwell(document.getElementById("t10d"), {
        rawDwellMs: 8000,
        scene: "rest",
        sceneArgs: { shape: "box", color: 0x5b8cff },
        html: `<p><strong>Impossible lunch:</strong> can an object’s <em>velocity</em> change (faster, slower, or new direction) while the <strong>vector sum of every real force on it is exactly zero</strong>?</p>
          <p>Newton’s first law ties unbalanced forces to changes in motion. Zero net force means zero acceleration.</p>`,
        onContinue: () => {
          a.clearOverlay();
          next();
        },
      });
    },
    (a, next) => {
      a.mountOverlay(`<div class="card"><div id="t10z"></div></div>`);
      mountDragZones(document.getElementById("t10z"), {
        title: t("main.l1.k0075"),
        instructions: t("main.l1.k0015"),
        zones: [{ id: "z", label: t("main.l1.k0055"), accept: ["no"] }],
        chips: [
          { id: "no", text: t("main.l1.k0047") },
          { id: "yes", text: t("main.l1.k0084") },
          { id: "magic", text: t("main.l1.k0052") },
        ],
        onDone: () => {
          a.clearOverlay();
          next();
        },
      });
    },
    (a, next, finish) => {
      a.setCoach(t("main.m0009"), "");
      a.mountOverlay(`
    <div class="card">
      <h2>Inertia badge</h2>
      <p>Which case breaks physics (motion changes with zero force)?</p>
      <div class="mc-grid" id="bdg"></div>
    </div>`);
      const bdg = document.getElementById("bdg");
      const opts = [
        { t: "Drifting asteroid at constant speed", ok: false },
        { t: "Rocket with engines firing (speeding up)", ok: false },
        { t: "Satellite spinning steadily", ok: false },
        { t: "None: any change needs a force", ok: true },
      ];
      opts.forEach((o) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = o.t;
        b.onclick = () => {
          if (o.ok) {
            a.clearOverlay();
            a.setCoach(
              "<strong>Badge earned!</strong> Any change in speed or spin needs a force. Use the footer <strong>Next</strong> to finish Level 1 and open the level-complete gate for Level 2.",
              ""
            );
            finish();
          } else {
            b.classList.add("wrong-flash");
            a.setCoach(t("main.m0019"), "");
          }
        };
        bdg.appendChild(b);
      });
    },
  ]);
}

function runSubContent() {
  if (inPlayground) return;
  invokeInteractCleanup();
  registerTryAgain(null);
  arena.clearExtras();
  clearViewportHud();
  if (state.sub === 0) state.levelEnteredAt = Date.now();
  updateProgressUI();
  stopVoice();
  if (state.level === 0) runLevel1();
  else runAdvancedLevel(buildLevelApi());
  // Narrate after coach text is set by the level runner
  queueMicrotask(() => narrateForceStep("sub"));
}

function runCurrent() {
  const go = () => runSubContent();
  if (gameUI) gameUI.maybeRunWithIntro(go);
  else go();
}

btnNext.addEventListener("click", () => {
  btnNext.classList.add("hidden");
  if (btnNextDock) btnNextDock.classList.add("hidden");
  advanceSub();
});

if (btnNextDock) {
  btnNextDock.addEventListener("click", () => btnNext.click());
}

levelSelect.addEventListener("change", () => {
  if (inPlayground) exitPlaygroundMode();
  dismissModals();
  state.level = parseInt(levelSelect.value, 10);
  state.sub = 0;
  saveGame(state);
  showNext(false);
  runCurrent();
});

if (btnPlayground) {
  btnPlayground.addEventListener("click", () => {
    if (inPlayground) exitPlaygroundMode();
    else enterPlaygroundMode();
  });
}

if (btnResetAll) {
  btnResetAll.addEventListener("click", openResetConfirmModal);
}

btnHint.addEventListener("click", () => {
  state.hintLevel++;
  const hints = [0, 1, 2, 3].map((i) => t(`hints.${i}`));
  setCoach(`<em>${t("shell.hint")} ${state.hintLevel}:</em> ${hints[(state.hintLevel - 1) % hints.length]}`, coachActions.innerHTML);
});

if (btnTogglePanel && playDock) {
  btnTogglePanel.addEventListener("click", () => {
    const collapsed = playDock.classList.toggle("is-collapsed");
    if (stageEl) stageEl.classList.toggle("stage--dock-collapsed", collapsed);
    btnTogglePanel.textContent = collapsed ? "▢" : "−";
    btnTogglePanel.setAttribute("aria-label", collapsed ? t("shell.showPanel") : t("shell.hidePanel"));
    if (!collapsed) schedulePaginate();
    resizeAll();
  });
}

function onLanguageChanged() {
  syncLevelsAndProgress();
  populateLevelSelect();
  applyShellI18n();
  syncPlaygroundButton();
  updateProgressUI();
  wireForceVoiceButton();
  if (inPlayground) {
    const host = document.getElementById("pg-host");
    if (host && playgroundCtl) {
      playgroundCtl.mountPanel(host);
      playgroundCtl.refreshAssetSpawn?.();
    }
    setCoach(t("playground.welcomeCoach"), "");
  } else {
    runSubContent();
  }
}

/* boot */
initI18n()
  .then(() => {
    syncLevelsAndProgress();
    if (langSelect) langSelect.value = getLocale();
    populateLevelSelect();
    applyShellI18n();
    syncPlaygroundButton();
    onLocaleChange(onLanguageChanged);
    if (langSelect) {
      langSelect.addEventListener("change", () => {
        const code = langSelect.value === "bn" ? "bn" : "en";
        setLocale(code);
      });
    }
    startGame();
  })
  .catch((err) => {
    console.error(err);
    syncLevelsAndProgress();
    startGame();
  });

function startGame() {
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

  if (btnTryAgain) btnTryAgain.onclick = () => tryAgainHandler?.();

  ensureMissionHubStyles();
  btnMissions?.addEventListener("click", () => {
    if (inPlayground) exitPlaygroundMode();
    showForceHub();
  });

  updateProgressUI();
  wireForceVoiceButton();
  showForceHub();
}

function showForceHub() {
  inHub = true;
  ensureMissionHubStyles();
  stopVoice();
  showVoiceCaption(voiceCaption, "");
  showNext(false);
  clearOverlay();
  if (inPlayground) exitPlaygroundMode();
  document.getElementById("btn-playground")?.classList.add("hidden");
  setMissionHubMode(true, { hubRoot, btnMissions, playChrome });
  const meta = getLevelMeta();
  const source =
    Array.isArray(meta) && meta.length >= 10 && meta[0]?.kidTitle ? meta : LEVEL_META;
  const missions = missionsFromLevels(source, { playable: false }).map((m, i) => ({
    ...m,
    emoji: m.emoji && m.emoji !== "📘" ? m.emoji : LEVEL_META[i]?.emoji || "🪨",
  }));
  if (!hubRoot) {
    console.error("Force Fighter: missing #mission-hub-root");
    return;
  }
  mountMissionHub(hubRoot, {
    gameTitle: "Force Fighter",
    subtitle:
      "Force Fighter is being remade (3D → 2D labs). Missions are locked for now - play Chemistry Lab Tiny Bits & Element Hunt.",
    missions,
    completed: state.completed,
    forceAllLocked: true,
    unlockByProgress: false,
    onSelect: () => {},
    onLockedClick: () => {
      gameUI?.showToast?.(
        "Force Fighter is locked while we remake it. Play Chemistry Lab for now.",
      );
    },
  });
  requestAnimationFrame(() => hubRoot?.scrollTo?.({ top: 0 }));
}

function enterForceMission(idx) {
  inHub = false;
  setMissionHubMode(false, { hubRoot, btnMissions, playChrome });
  document.getElementById("btn-playground")?.classList.remove("hidden");
  state.level = Math.min(LEVEL_META.length - 1, Math.max(0, idx));
  state.sub = 0;
  saveGame(state);
  populateLevelSelect();
  updateProgressUI();
  syncPlaygroundButton();
  wireForceVoiceButton();
  requestAnimationFrame(() => {
    arena?.resize?.();
    runCurrent();
  });
}

initAssetLoader().then(() => {
  if (arena.applyKenneyAssets) arena.applyKenneyAssets();
  if (inPlayground) return;
  const sceneEntry = typeof window !== "undefined" ? window.__lastDemoScene : null;
  if (sceneEntry?.scene) {
    replayArenaScene();
    return;
  }
  const preset = LEVEL_DEMO_SCENES[state.level];
  if (preset?.scene && typeof arena.playExample === "function") {
    try {
      arena.playExample(preset.scene, preset.sceneArgs || {});
    } catch (_) {
      /* ignore */
    }
  }
});
