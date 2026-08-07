/**
 * GyanQuest shared mission boot - data-driven curriculum runner.
 * Each game folder imports this with its manifest + curriculum.
 */
import { initI18n, setLocale, getLocale, onLocaleChange, t, applyShellI18n } from "./i18n.js";
import { createArena } from "./arena.js";
import { initAssetLoader, playgroundAssetCatalog, whenAllAssetsReady } from "./asset-loader.js";
import {
  loadSave,
  saveGame,
  clearSave,
  normalizeCompleted,
  normalizeIntroSeen,
  normalizeRewards,
  levelDoneCount,
  REWARD_ICONS,
} from "./persist.js";
import {
  mountIntro,
  mountDemo,
  mountDrag,
  mountReveal,
  mountEquation,
  mountOrder,
  mountQuiz,
  mountTapContinue,
  applyArenaScene,
} from "./activities.js";
import { clearConceptViz } from "./concept-viz.js";
import {
  stopVoice,
  playVoice,
  voiceKey,
  ensureVoiceButton,
  plainTextFromHtml,
  showVoiceCaption,
} from "./voice.js";
import {
  ensureMissionHubShell,
  setMissionHubMode,
  mountMissionHub,
  missionsFromLevels,
} from "./mission-hub.js";

/**
 * @param {{
 *   manifest: object,
 *   curriculum: { levels: object[] },
 *   engineBase?: string
 * }} opts
 */
export async function bootGame(opts) {
  const { manifest, curriculum } = opts;
  const levels = curriculum.levels || [];
  const nLevels = levels.length;
  const storageKey = manifest.storageKey || `gq-${manifest.id}-save`;

  await initI18n({ localeStorageKey: manifest.localeKey || `gq-${manifest.id}-locale` });

  // Theme CSS vars
  if (manifest.theme) {
    const root = document.documentElement;
    if (manifest.theme.accent) root.style.setProperty("--gq-accent", manifest.theme.accent);
    if (manifest.theme.accent2) root.style.setProperty("--gq-accent2", manifest.theme.accent2);
  }

  applyShellI18n(manifest);
  if (manifest.coachName) {
    const coach = document.querySelector(".coach-inline-name");
    if (coach) coach.textContent = manifest.coachName;
  }
  if (manifest.emoji) {
    const av = document.querySelector(".coach-inline-avatar");
    if (av) av.textContent = manifest.emoji;
  }

  const canvas = document.getElementById("c3d");
  const overlay = document.getElementById("overlay");
  const coachText = document.getElementById("coach-text");
  const coachActions = document.getElementById("coach-actions");
  const voiceCaption = document.getElementById("voice-caption");
  const headActions = document.querySelector(".play-dock__head-actions");
  const levelSelect = document.getElementById("level-select");
  let activeVoiceKey = null;
  const levelTitle = document.getElementById("level-title");
  const subDots = document.getElementById("sub-dots");
  const scoresEl = document.getElementById("scores");
  const btnHint = document.getElementById("btn-hint");
  const btnTryAgain = document.getElementById("btn-try-again");
  const btnNext = document.getElementById("btn-next");
  const checkpointBadge = document.getElementById("checkpoint-badge");
  const modalRoot = document.getElementById("modal-root");
  const toastRoot = document.getElementById("toast-root");
  const btnTogglePanel = document.getElementById("btn-toggle-panel");
  const btnNextDock = document.getElementById("btn-next-dock");
  const playDock = document.getElementById("play-dock");
  const stageEl = document.querySelector(".stage");
  const progressFill = document.getElementById("progress-fill");
  const progressLabel = document.getElementById("progress-label");
  const rewardSlot = document.getElementById("reward-slot");
  const btnPlayground = document.getElementById("btn-playground");
  const btnResetAll = document.getElementById("btn-reset-all");
  const langSelect = document.getElementById("lang-select");
  const labDepth = document.getElementById("lab-depth");
  const viewportHud = document.getElementById("viewport-hud");
  const appRoot = document.getElementById("app");
  const playChromeEl = document.getElementById("play-chrome");
  const shell = ensureMissionHubShell();
  const hubRoot = shell.hubRoot;
  const btnMissions = shell.btnMissions;
  const playChrome = shell.playChrome || playChromeEl;

  // Curriculum games: hub first; missions locked until Force Fighter path opens them.
  const forceAllLocked = manifest.hubUnlocked !== true;
  document.documentElement.classList.add("gq-hub-scroll");
  appRoot?.classList.add("app--mission-hub");
  appRoot?.classList.remove("app--playing");
  setMissionHubMode(true, { hubRoot, btnMissions, playChrome });
  if (hubRoot && !hubRoot.querySelector(".gq-hub-card")) {
    hubRoot.innerHTML = `<div class="gq-hub"><p class="gq-hub__sub" style="text-align:center;padding:2rem">Loading missions…</p></div>`;
  }

  const state = {
    level: 0,
    sub: 0,
    completed: normalizeCompleted(null, nLevels, 10),
    introSeen: normalizeIntroSeen(null, nLevels),
    rewards: normalizeRewards(null, nLevels),
    hintLevel: 0,
  };

  const saved = loadSave(storageKey);
  if (saved) {
    if (typeof saved.level === "number") state.level = Math.min(nLevels - 1, Math.max(0, saved.level));
    if (typeof saved.sub === "number") state.sub = Math.min(9, Math.max(0, saved.sub));
    state.completed = normalizeCompleted(saved.completed, nLevels, 10);
    state.rewards = normalizeRewards(saved.rewards, nLevels);
    state.introSeen = normalizeIntroSeen(saved.introSeen, nLevels);
  }

  /**
   * Locked-hub path: never create WebGL / load 3D assets on first paint.
   * Missions are not playable yet (Force Fighter only), so the hub is the whole experience.
   */
  if (forceAllLocked) {
    let tryAgainHandler = null;
    let inPlayground = false;
    let showNextFlag = false;
    let inHub = true;

    function showToast(msg) {
      if (!toastRoot) return;
      toastRoot.innerHTML = `<div class="toast">${msg}</div>`;
      setTimeout(() => {
        toastRoot.innerHTML = "";
      }, 2200);
    }

    function showHub() {
      inHub = true;
      setMissionHubMode(true, { hubRoot, btnMissions, playChrome });
      const missions = missionsFromLevels(levels, { playable: false });
      mountMissionHub(hubRoot, {
        gameTitle: manifest.title || "GyanQuest",
        missions,
        completed: state.completed,
        forceAllLocked: true,
        unlockByProgress: false,
        onSelect: () => showToast("Coming soon - play Force Fighter for now."),
        onLockedClick: () => showToast("Coming soon - play Force Fighter for now."),
      });
      requestAnimationFrame(() => hubRoot?.scrollTo?.({ top: 0 }));
    }

    btnMissions?.addEventListener("click", () => showHub());
    btnPlayground?.addEventListener("click", () => {
      showToast("Coming soon - play Force Fighter for now.");
    });
    btnResetAll?.addEventListener("click", () => {
      clearSave(storageKey);
      state.level = 0;
      state.sub = 0;
      state.completed = normalizeCompleted(null, nLevels, 10);
      state.rewards = normalizeRewards(null, nLevels);
      state.introSeen = normalizeIntroSeen(null, nLevels);
      showToast(t("ui.resetToast"));
      showHub();
    });
    if (langSelect) {
      langSelect.value = getLocale();
      langSelect.addEventListener("change", () => {
        setLocale(langSelect.value);
        applyShellI18n(manifest);
        if (manifest.coachName) {
          const coach = document.querySelector(".coach-inline-name");
          if (coach) coach.textContent = manifest.coachName;
        }
        showHub();
      });
    }
    showHub();
    return;
  }

  const arena = createArena(canvas, {
    sky: manifest.theme?.sky,
    floor: manifest.theme?.floor,
    fog: manifest.theme?.fog,
    defaultScene: manifest.defaultScene || "default",
  });
  window.__arena = arena;

  let raf = 0;
  function loop() {
    raf = requestAnimationFrame(loop);
    arena.tick();
  }
  raf = requestAnimationFrame(loop);

  function resizeAll() {
    arena.resize();
  }
  window.addEventListener("resize", resizeAll);
  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(resizeAll).observe(document.getElementById("viewport"));
  }

  // Load all props for this game before mission UI so text/scene never disagree via cubes
  await initAssetLoader(manifest.assetKeys);
  await whenAllAssetsReady();
  arena.playExample(levels[state.level]?.scene || manifest.defaultScene || "default");

  let tryAgainHandler = null;
  let inPlayground = false;
  let showNextFlag = false;
  let inHub = true;

  function showHub() {
    inHub = true;
    if (inPlayground) exitPlaygroundMode();
    stopVoice();
    showVoiceCaption(voiceCaption, "");
    showNext(false);
    clearOverlay();
    setMissionHubMode(true, { hubRoot, btnMissions, playChrome });
    const missions = missionsFromLevels(levels, { playable: !forceAllLocked });
    mountMissionHub(hubRoot, {
      gameTitle: manifest.title || "GyanQuest",
      missions,
      completed: state.completed,
      forceAllLocked,
      unlockByProgress: !forceAllLocked,
      onSelect: (idx) => enterMission(idx),
      onLockedClick: () => {
        showToast("Coming soon - play Force Fighter for now.");
      },
    });
    requestAnimationFrame(() => hubRoot?.scrollTo?.({ top: 0 }));
  }

  function showPlay() {
    inHub = false;
    setMissionHubMode(false, { hubRoot, btnMissions, playChrome });
    requestAnimationFrame(() => arena.resize());
  }

  function enterMission(idx) {
    if (forceAllLocked) {
      showToast("Coming soon - play Force Fighter for now.");
      return;
    }
    state.level = Math.min(nLevels - 1, Math.max(0, idx));
    state.sub = 0;
    persist();
    showPlay();
    runCurrent();
  }

  function persist() {
    saveGame(storageKey, state);
  }

  function setCoach(html, actionsHtml = "") {
    if (coachText) coachText.innerHTML = html;
    if (coachActions) coachActions.innerHTML = actionsHtml || "";
  }

  function activityNarration(act, level) {
    const bits = [];
    if (act?.coach) bits.push(plainTextFromHtml(act.coach));
    if (act?.html) bits.push(plainTextFromHtml(act.html));
    if (act?.title) bits.push(String(act.title));
    if (act?.instructions) bits.push(String(act.instructions));
    if (act?.body) bits.push(plainTextFromHtml(act.body));
    if (act?.q) bits.push(String(act.q));
    if (!bits.length && level?.intro) bits.push(String(level.intro));
    return bits.filter(Boolean).join(" ");
  }

  function introNarration(m) {
    if (!m) return "";
    const everyday = Array.isArray(m.everyday) ? m.everyday.join(". ") : "";
    return [m.kidTitle, m.intro, everyday ? `Examples: ${everyday}` : ""]
      .filter(Boolean)
      .join(". ");
  }

  function wireVoiceButton() {
    ensureVoiceButton(headActions, {
      gameId: manifest.id,
      locale: getLocale(),
      getKey: () => activeVoiceKey,
      getText: () => (voiceCaption?.textContent || coachText?.textContent || "").trim(),
    });
  }

  function narrateStep(key, speakText) {
    activeVoiceKey = key;
    const text = (speakText || "").trim();
    showVoiceCaption(voiceCaption, text);
    wireVoiceButton();
    if (key && text) playVoice(manifest.id, getLocale(), key, text);
  }

  function clearOverlay() {
    if (overlay) overlay.innerHTML = "";
  }

  function mountOverlay(html) {
    if (!overlay) return;
    if (typeof html === "string") overlay.innerHTML = html;
  }

  function showNext(v) {
    showNextFlag = !!v;
    btnNext?.classList.toggle("hidden", !v);
    btnNextDock?.classList.toggle("hidden", !v);
  }

  function showToast(msg) {
    if (!toastRoot) return;
    toastRoot.innerHTML = `<div class="toast">${msg}</div>`;
    setTimeout(() => {
      toastRoot.innerHTML = "";
    }, 2200);
  }

  function checkpointAfter(i) {
    if (i === 2) return "quiz";
    if (i === 4) return "exam";
    if (i === nLevels - 1) return "final";
    return null;
  }

  function updateProgressUI() {
    const m = levels[state.level];
    if (!m) return;
    const doneInLevel = levelDoneCount(state.completed, state.level);
    const left = 10 - doneInLevel;
    if (levelTitle) {
      levelTitle.textContent = `${m.emoji || "📘"} ${m.kidTitle} · ${t("shell.stepOf", { n: state.sub + 1 })}`;
    }
    if (levelSelect) levelSelect.value = String(state.level);
    if (subDots) {
      subDots.innerHTML = "";
      for (let i = 0; i < 10; i++) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "sub-dot";
        b.textContent = String(i + 1);
        if (i === state.sub) b.classList.add("current");
        if (state.completed[state.level][i]) b.classList.add("done");
        if (state.completed[state.level][i] || i === state.sub) {
          b.onclick = () => {
            state.sub = i;
            persist();
            showNext(false);
            runCurrent();
          };
        } else b.disabled = true;
        subDots.appendChild(b);
      }
    }
    if (progressFill) progressFill.style.width = `${(doneInLevel / 10) * 100}%`;
    if (progressLabel) {
      progressLabel.textContent =
        doneInLevel >= 10
          ? t("shell.levelCompleteQuiz")
          : left === 1
            ? t("shell.stepsLeftOne")
            : t("shell.stepsLeft", { n: left });
    }
    if (scoresEl) {
      const rw = state.rewards[state.level];
      const badge = rw?.earned
        ? t("shell.rewardEarned", { icon: REWARD_ICONS[state.level], name: m.rewardName })
        : "";
      scoresEl.textContent =
        t("shell.levelProgress", { emoji: m.emoji || "📘", cur: state.level + 1, done: doneInLevel }) + badge;
    }
    if (rewardSlot) {
      const rw = state.rewards[state.level];
      rewardSlot.innerHTML = rw?.earned
        ? `<span class="reward-pill earned">${REWARD_ICONS[state.level]} ${m.rewardName}</span>`
        : `<span class="reward-pill locked">🔒 ${t("shell.rewardLocked", { name: m.rewardName })}</span>`;
    }
    if (labDepth) {
      labDepth.textContent = t("shell.todayTopic", {
        topic: m.theme || m.kidTitle,
        example: (m.everyday && m.everyday[0]) || "",
      });
    }
    if (checkpointBadge) {
      const cp = checkpointAfter(state.level);
      checkpointBadge.classList.toggle("hidden", !cp);
      if (cp) {
        checkpointBadge.textContent =
          cp === "final" ? t("shell.checkpointFinal") : t("shell.checkpointBonus");
      }
    }
  }

  function populateLevelSelect() {
    if (!levelSelect) return;
    levelSelect.innerHTML = "";
    levels.forEach((L, i) => {
      const o = document.createElement("option");
      o.value = String(i);
      o.textContent = `${i + 1}. ${L.kidTitle}`;
      levelSelect.appendChild(o);
    });
    levelSelect.value = String(state.level);
  }

  function completeCurrentSub() {
    state.completed[state.level][state.sub] = true;
    persist();
    updateProgressUI();
    showToast(t("ui.stepDoneToast", { n: state.sub + 1 }));
    showNext(true);
  }

  function registerTryAgain(fn) {
    tryAgainHandler = fn;
  }

  function openModal(html) {
    if (!modalRoot) return;
    modalRoot.setAttribute("aria-hidden", "false");
    modalRoot.innerHTML = `<div class="modal-backdrop"><div class="modal">${html}</div></div>`;
  }

  function dismissModals() {
    if (!modalRoot) return;
    modalRoot.setAttribute("aria-hidden", "true");
    modalRoot.innerHTML = "";
  }

  function runLevelQuiz(then) {
    const m = levels[state.level];
    const quiz = m.quiz || [];
    if (!quiz.length) {
      then?.();
      return;
    }
    let qi = 0;
    function showQ() {
      const item = quiz[qi];
      openModal(`
        <h3>${t("ui.quizTitle", { cur: qi + 1, total: quiz.length })}</h3>
        <p>${item.q}</p>
        <div id="mq-opts"></div>
        <p id="mq-msg"></p>`);
      const box = document.getElementById("mq-opts");
      const msg = document.getElementById("mq-msg");
      item.opts.forEach((label, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "btn secondary";
        b.style.display = "block";
        b.style.width = "100%";
        b.style.margin = "0.35rem 0";
        b.textContent = label;
        b.onclick = () => {
          if (i === item.ok) {
            msg.textContent = t("ui.quizGreat");
            qi++;
            if (qi >= quiz.length) {
              state.rewards[state.level] = { earned: true, stars: 3 };
              persist();
              showToast(t("ui.rewardUnlocked", { icon: REWARD_ICONS[state.level], name: m.rewardName }));
              setTimeout(() => {
                dismissModals();
                then?.();
              }, 600);
            } else setTimeout(showQ, 400);
          } else {
            msg.textContent = t("ui.quizTryAgain");
          }
        };
        box.appendChild(b);
      });
    }
    showQ();
  }

  function afterLevelComplete() {
    runLevelQuiz(() => {
      if (state.level >= nLevels - 1) {
        openModal(`
          <h3>${t("ui.awesome")}</h3>
          <p>${t("ui.clearedGame")}</p>
          <button type="button" class="btn primary" id="mq-ok">${t("lab.tapContinue")}</button>`);
        document.getElementById("mq-ok")?.addEventListener("click", dismissModals);
        return;
      }
      const next = levels[state.level + 1];
      openModal(`
        <h3>${t("ui.levelGateTitle", { n: state.level + 1 })}</h3>
        <p>${t("ui.levelGateBody")}</p>
        <p><strong>${t("ui.nextMission")}</strong> ${next.emoji || ""} ${next.kidTitle}</p>
        <button type="button" class="btn primary" id="mq-next">${t("ui.beginLevel", { n: state.level + 2 })}</button>`);
      document.getElementById("mq-next")?.addEventListener("click", () => {
        dismissModals();
        state.level++;
        state.sub = 0;
        persist();
        populateLevelSelect();
        runCurrent();
      });
    });
  }

  function advanceSub() {
    showNext(false);
    if (state.sub < 9) {
      state.sub++;
      persist();
      runCurrent();
      return;
    }
    // finished all 10 subs
    afterLevelComplete();
  }

  function maybeIntro(go) {
    const m = levels[state.level];
    if (state.sub === 0 && !state.introSeen[state.level] && m) {
      clearOverlay();
      stopVoice();
      setCoach(t("ui.everydayHook", { emoji: m.emoji || "📘" }), "");
      narrateStep(voiceKey(state.level, "intro"), introNarration(m));
      mountIntro(overlay, {
        title: m.kidTitle,
        body: m.intro,
        everyday: m.everyday,
        emoji: m.emoji,
        scene: m.scene || manifest.defaultScene,
        viz: m.viz || null,
        onContinue: () => {
          state.introSeen[state.level] = true;
          persist();
          stopVoice();
          go();
        },
      });
      return;
    }
    go();
  }

  function runActivity(act) {
    clearOverlay();
    registerTryAgain(() => runActivity(act));
    const done = () => completeCurrentSub();
    const scene = act.scene || levels[state.level]?.scene || manifest.defaultScene;
    const viz = act.viz || levels[state.level]?.viz || null;
    const level = levels[state.level];

    setCoach(act.coach || level?.intro || "", "");
    narrateStep(voiceKey(state.level, "sub", state.sub), activityNarration(act, level));

    switch (act.type) {
      case "intro":
        mountIntro(overlay, {
          title: act.title || levels[state.level].kidTitle,
          body: act.body || levels[state.level].intro,
          everyday: act.everyday || levels[state.level].everyday,
          emoji: act.emoji || levels[state.level].emoji,
          scene,
          viz,
          onContinue: done,
        });
        break;
      case "demo":
        mountDemo(overlay, {
          html: act.html,
          scene,
          viz,
          minDwellMs: act.minDwellMs,
          onContinue: done,
        });
        break;
      case "tap":
        mountTapContinue(overlay, { html: act.html, scene, viz, onContinue: done });
        break;
      case "drag":
        mountDrag(overlay, {
          title: act.title,
          instructions: act.instructions,
          chips: act.chips,
          zones: act.zones,
          scene,
          viz,
          onDone: done,
        });
        break;
      case "reveal":
        mountReveal(overlay, {
          title: act.title,
          steps: act.steps,
          scene,
          viz,
          onDone: done,
        });
        break;
      case "equation":
        mountEquation(overlay, { tokens: act.tokens, scene, viz, onDone: done });
        break;
      case "order":
        mountOrder(overlay, {
          items: act.items,
          correctIds: act.correctIds,
          scene,
          viz,
          onDone: done,
        });
        break;
      case "quiz":
      case "boss":
        mountQuiz(overlay, {
          q: act.q,
          opts: act.opts,
          ok: act.ok,
          scene,
          viz,
          onDone: done,
        });
        break;
      case "scene3d":
        applyArenaScene(scene, viz);
        mountTapContinue(overlay, {
          html: act.html || `<p>${act.coach || "Explore the 3D scene, then continue."}</p>`,
          scene,
          viz,
          onContinue: done,
        });
        break;
      default:
        mountTapContinue(overlay, {
          html: act.html || `<p>${act.coach || "Continue"}</p>`,
          scene,
          viz,
          onContinue: done,
        });
    }
  }

  function runSubContent() {
    if (inPlayground) return;
    arena.clearExtras();
    if (viewportHud) {
      clearConceptViz(viewportHud);
      // keep non-viz HUD clear for mission mode
      [...viewportHud.querySelectorAll(":scope > :not([data-cviz-root])")].forEach((n) => n.remove());
    }
    updateProgressUI();
    const m = levels[state.level];
    const act = m?.subs?.[state.sub];
    if (!act) {
      setCoach("Missing activity - skipping.", "");
      completeCurrentSub();
      return;
    }
    runActivity(act);
  }

  function runCurrent() {
    maybeIntro(() => runSubContent());
  }

  // Playground
  function syncPlaygroundButton() {
    if (!btnPlayground) return;
    if (inPlayground) {
      btnPlayground.textContent = t("shell.backToGame");
      btnPlayground.classList.add("is-active");
    } else {
      btnPlayground.textContent = `🧪 ${t("shell.playground")}`;
      btnPlayground.classList.remove("is-active");
    }
  }

  function exitPlaygroundMode() {
    if (!inPlayground) return;
    inPlayground = false;
    arena.exitPlayground();
    appRoot?.classList.remove("app--playground");
    levelSelect && (levelSelect.disabled = false);
    if (viewportHud) viewportHud.innerHTML = "";
    syncPlaygroundButton();
    runCurrent();
  }

  function enterPlaygroundMode() {
    if (inPlayground) return;
    inPlayground = true;
    stopVoice();
    showVoiceCaption(voiceCaption, "");
    showNext(false);
    clearOverlay();
    arena.enterPlayground();
    appRoot?.classList.add("app--playground");
    if (levelSelect) levelSelect.disabled = true;
    syncPlaygroundButton();
    setCoach(t("lab.playgroundWelcome"), "");
    if (viewportHud) {
      viewportHud.innerHTML = `
        <button type="button" class="btn primary viewport-hud__exit" id="pg-hud-exit">${t("shell.backToGame")}</button>
        <span class="viewport-hud__chip">🧪 ${t("lab.hudChip")}</span>`;
      document.getElementById("pg-hud-exit")?.addEventListener("click", exitPlaygroundMode);
    }
    const groups = playgroundAssetCatalog(
      manifest.playgroundGroups || [{ id: "all", title: "Props", keys: manifest.assetKeys }],
    );
    mountOverlay(`<div class="card playground-card"><h3>🧪 ${t("shell.playground")}</h3><div id="pg-spawn"></div>
      <button type="button" class="btn secondary" id="pg-exit">${t("shell.backToGame")}</button></div>`);
    const spawn = document.getElementById("pg-spawn");
    groups.forEach((g) => {
      const h = document.createElement("h4");
      h.textContent = g.title || g.id;
      spawn.appendChild(h);
      const row = document.createElement("div");
      row.className = "pg-spawn-row";
      g.items.forEach((it) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "btn secondary";
        b.textContent = it.label;
        b.disabled = !it.ready;
        b.onclick = () => arena.spawnPlaygroundProp(it.key);
        row.appendChild(b);
      });
      spawn.appendChild(row);
    });
    document.getElementById("pg-exit")?.addEventListener("click", exitPlaygroundMode);
  }

  // Wire UI
  populateLevelSelect();
  syncPlaygroundButton();

  btnNext?.addEventListener("click", () => {
    btnNext.classList.add("hidden");
    btnNextDock?.classList.add("hidden");
    advanceSub();
  });
  btnNextDock?.addEventListener("click", () => btnNext?.click());

  levelSelect?.addEventListener("change", () => {
    if (inHub) return;
    if (inPlayground) exitPlaygroundMode();
    dismissModals();
    state.level = parseInt(levelSelect.value, 10);
    state.sub = 0;
    persist();
    showNext(false);
    runCurrent();
  });

  btnMissions?.addEventListener("click", () => {
    dismissModals();
    showHub();
  });

  btnPlayground?.addEventListener("click", () => {
    if (forceAllLocked || inHub) {
      showToast("Coming soon - play Force Fighter for now.");
      return;
    }
    if (inPlayground) exitPlaygroundMode();
    else enterPlaygroundMode();
  });

  btnResetAll?.addEventListener("click", () => {
    openModal(`
      <h3>${t("ui.resetConfirmTitle")}</h3>
      <p>${t("ui.resetConfirmBody")}</p>
      <p><em>${t("ui.resetCannotUndo")}</em></p>
      <button type="button" class="btn secondary" id="reset-keep">${t("ui.resetKeep")}</button>
      <button type="button" class="btn primary" id="reset-yes">${t("ui.resetYes")}</button>`);
    document.getElementById("reset-keep")?.addEventListener("click", dismissModals);
    document.getElementById("reset-yes")?.addEventListener("click", () => {
      clearSave(storageKey);
      state.level = 0;
      state.sub = 0;
      state.completed = normalizeCompleted(null, nLevels, 10);
      state.rewards = normalizeRewards(null, nLevels);
      state.introSeen = normalizeIntroSeen(null, nLevels);
      persist();
      dismissModals();
      showToast(t("ui.resetToast"));
      populateLevelSelect();
      showHub();
    });
  });

  btnHint?.addEventListener("click", () => {
    state.hintLevel++;
    const hints = [0, 1, 2, 3].map((i) => t(`hints.${i}`));
    setCoach(`<em>${t("shell.hint")} ${state.hintLevel}:</em> ${hints[(state.hintLevel - 1) % hints.length]}`, coachActions?.innerHTML || "");
  });

  btnTryAgain?.addEventListener("click", () => {
    if (tryAgainHandler) tryAgainHandler();
    else runCurrent();
  });

  btnTogglePanel?.addEventListener("click", () => {
    const collapsed = playDock?.classList.toggle("is-collapsed");
    stageEl?.classList.toggle("stage--dock-collapsed", collapsed);
    btnTogglePanel.textContent = collapsed ? "▢" : "−";
  });

  if (langSelect) {
    langSelect.value = getLocale();
    langSelect.addEventListener("change", () => {
      setLocale(langSelect.value);
      applyShellI18n(manifest);
      if (manifest.coachName) {
        const coach = document.querySelector(".coach-inline-name");
        if (coach) coach.textContent = manifest.coachName;
      }
      syncPlaygroundButton();
      if (inHub) showHub();
      else {
        updateProgressUI();
        if (!inPlayground) runCurrent();
      }
    });
  }

  onLocaleChange(() => {
    applyShellI18n(manifest);
    if (inHub) showHub();
    else updateProgressUI();
    wireVoiceButton();
  });

  wireVoiceButton();
  showHub();
}
