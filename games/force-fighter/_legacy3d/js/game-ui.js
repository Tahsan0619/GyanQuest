/**

 * Kid UI: progress, intros, quizzes, toasts, try-again handler.

 */

import {

  saveGame,

  updateKidProgressUI,

  REWARD_ICONS,

} from "./game-core.js";

import { t, getLevelMeta, getLocale } from "./i18n.js";
import { playVoice, stopVoice, voiceKey, showVoiceCaption } from "/engine/js/voice.js";



export function bindGameUI(ctx) {

  const {

    state,

    LEVELS,

    modalRoot,

    toastRoot,

    getEls,

    showNext,

    runCurrent,

  } = ctx;



  function updateProgressUI() {

    updateKidProgressUI(

      {

        ...getEls(),

        onJumpSub: (i) => {

          if (modalRoot) {

            modalRoot.setAttribute("aria-hidden", "true");

            modalRoot.innerHTML = "";

          }

          state.sub = i;

          saveGame(state);

          showNext(false);

          runCurrent();

        },

        checkpointAfter: (lv) => LEVELS[lv]?.checkpointAfter,

      },

      state

    );

  }



  function showToast(msg) {

    if (!toastRoot) return;

    const el = document.createElement("div");

    el.className = "toast";

    el.textContent = msg;

    toastRoot.appendChild(el);

    setTimeout(() => {

      toastRoot.innerHTML = "";

    }, 2200);

  }



  function showLevelIntro(onGo) {

    const m = getLevelMeta()[state.level];

    const introHtml = [

      `<p class="intro-emoji">${m.emoji}</p>`,

      `<h2>${t("ui.missionN", { n: state.level + 1, title: m.kidTitle })}</h2>`,

      `<p>${m.intro}</p>`,

      `<p class="level-gate__sub">${t("ui.introExamples", { list: m.everyday.join(" · ") })}</p>`,

      `<button type="button" class="btn primary" id="intro-go">${t("ui.introLetsPlay")}</button>`,

    ].join("");

    modalRoot.innerHTML = "";

    const node = document.createElement("div");

    node.className = "card modal-card level-intro";

    node.innerHTML = introHtml;

    modalRoot.appendChild(node);

    modalRoot.setAttribute("aria-hidden", "false");

    const introSpeak = [m.kidTitle, m.intro, (m.everyday || []).join(". ")].filter(Boolean).join(". ");
    const captionEl = document.getElementById("voice-caption");
    showVoiceCaption(captionEl, introSpeak);
    const coachEl = document.getElementById("coach-text");
    if (coachEl) coachEl.textContent = introSpeak;
    playVoice("force-fighter", getLocale(), voiceKey(state.level, "intro"), introSpeak);

    document.getElementById("intro-go").onclick = () => {

      state.introSeen[state.level] = true;

      saveGame(state);

      stopVoice();

      modalRoot.setAttribute("aria-hidden", "true");

      modalRoot.innerHTML = "";

      onGo();

    };

  }



  function openLevelQuiz(levelIdx, onPass) {

    const pool = getLevelMeta()[levelIdx].quiz;

    const m = getLevelMeta()[levelIdx];

    let idx = 0;

    modalRoot.setAttribute("aria-hidden", "false");



    function renderQ() {

      if (idx >= pool.length) {

        state.rewards[levelIdx] = { earned: true, stars: pool.length };

        saveGame(state);

        modalRoot.innerHTML = "";

        const gate = document.createElement("div");

        gate.className = "card modal-card level-gate";

        gate.innerHTML = `<p class="intro-emoji">${REWARD_ICONS[levelIdx]}</p>

          <h2>${t("ui.earnedReward", { name: m.rewardName })}</h2>

          <button type="button" class="btn primary" id="quiz-done">${t("ui.awesome")}</button>`;

        modalRoot.appendChild(gate);

        document.getElementById("quiz-done").onclick = () => {

          modalRoot.setAttribute("aria-hidden", "true");

          modalRoot.innerHTML = "";

          updateProgressUI();

          showToast(t("ui.rewardUnlocked", { icon: REWARD_ICONS[levelIdx], name: m.rewardName }));

          onPass();

        };

        return;

      }

      const item = pool[idx];

      modalRoot.innerHTML = "";

      const card = document.createElement("div");

      card.className = "card modal-card";

      card.innerHTML = `<h2>${t("ui.quizTitle", { cur: idx + 1, total: pool.length })}</h2>

        <p>${item.q}</p>

        <div class="mc-grid" id="lv-quiz"></div>

        <p id="lv-qfb" class="mcq-feedback"></p>`;

      modalRoot.appendChild(card);

      const mc = document.getElementById("lv-quiz");

      const fb = document.getElementById("lv-qfb");

      item.opts.forEach((text, i) => {

        const b = document.createElement("button");

        b.type = "button";

        b.className = "mcq-choice";

        b.textContent = text;

        b.onclick = () => {

          if (i === item.ok) {

            b.classList.add("correct-pick");

            if (fb) fb.textContent = `✅ ${t("ui.quizGreat")}`;

            setTimeout(() => {

              idx++;

              renderQ();

            }, 500);

          } else {

            b.classList.add("wrong-pick");

            if (fb) fb.textContent = t("ui.quizTryAgain");

            setTimeout(() => b.classList.remove("wrong-pick"), 400);

          }

        };

        mc.appendChild(b);

      });

    }

    renderQ();

  }



  function maybeRunWithIntro(runFn) {

    if (state.sub === 0 && !state.introSeen[state.level]) {

      showLevelIntro(runFn);

    } else {

      runFn();

    }

  }



  return {

    updateProgressUI,

    showToast,

    showLevelIntro,

    openLevelQuiz,

    maybeRunWithIntro,

  };

}

