/**
 * Kid-friendly activity wrappers: short MCQ, everyday hooks, gentle number checks.
 */
import { mountRevealSteps } from "./lab-dnd.js";
import { runChain } from "./lab-dnd.js";
import { shortCoach } from "./game-core.js";
import { t, getLevelMeta } from "./i18n.js";
import { LEVEL_HOOK_STEP_SCENES } from "./level-hook-scenes.js";
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function showEverydayHook(api, next) {
  const { setCoach, mountOverlay, clearOverlay, state } = api;
  const meta = getLevelMeta()[state.level];
  setCoach(t("ui.everydayHook", { emoji: meta.emoji }), "");
  mountOverlay('<div class="card card--hook"><div id="hook-host"></div></div>');
  const host = document.getElementById("hook-host");
  if (!host) {
    next();
    return;
  }
  const hookScenes = LEVEL_HOOK_STEP_SCENES[state.level] || LEVEL_HOOK_STEP_SCENES[0];
  mountRevealSteps(host, {
    title: t("ui.everydayTitle"),
    steps: meta.everyday,
    stepScenes: hookScenes,
    onDone: () => {
      clearOverlay();
      next();
    },
  });
}

/**
 * @param {object} api
 * @param {{ title: string; question: string; choices: string[]; okIndex: number; coachShort?: string }} cfg
 * @param {() => void} [onDone]
 */
export function kidMcq(api, cfg, onDone) {
  const { setCoach, mountOverlay, clearOverlay, completeCurrentSub } = api;
  const coachShort = cfg.coachShort || t("ui.quizGreat");
  setCoach(t("ui.pickBest"), "");
  mountOverlay(
    `<div class="card card--mcq">
      <h2>${cfg.title}</h2>
      <p class="mcq-q">${cfg.question}</p>
      <div class="mc-grid" id="kid-mcq"></div>
      <p id="mcq-feedback" class="mcq-feedback" aria-live="polite"></p>
    </div>`
  );
  const root = document.getElementById("kid-mcq");
  const fb = document.getElementById("mcq-feedback");
  if (!root) return;

  cfg.choices.forEach((label, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "mcq-choice";
    b.textContent = label;
    b.onclick = () => {
      if (i === cfg.okIndex) {
        b.classList.add("correct-pick");
        if (fb) fb.textContent = `✅ ${shortCoach(coachShort, 56)}`;
        setCoach(`✅ ${shortCoach(coachShort, 56)}`, "");
        setTimeout(() => {
          clearOverlay();
          if (onDone) onDone();
          else completeCurrentSub();
        }, 650);
      } else {
        b.classList.add("wrong-pick");
        if (fb) fb.textContent = t("ui.notQuite");
        setTimeout(() => b.classList.remove("wrong-pick"), 400);
      }
    };
    root.appendChild(b);
  });
}

export function kidMcqDock(api, title, question, choices, okIndex, coachWin) {
  const coachShort = shortCoach(coachWin, 64);
  runChain(api, [
    (a, next) => showEverydayHook(a, next),
    (a, _next, finish) => {
      kidMcq(a, { title, question, choices, okIndex, coachShort }, finish);
    },
  ]);
  api.btnRestart.onclick = () => kidMcqDock(api, title, question, choices, okIndex, coachWin);
}

export function kidNumberChoice(api, title, prompt, correctNum, coachWin) {
  const c = Math.round(correctNum);
  const opts = shuffle([
    { label: `About ${c}`, val: c },
    { label: `About ${Math.max(1, Math.round(c * 0.4))}`, val: Math.max(1, Math.round(c * 0.4)) },
    { label: `About ${Math.round(c * 1.8)}`, val: Math.round(c * 1.8) },
  ]);
  const okIndex = opts.findIndex((o) => o.val === c);
  kidMcqDock(
    api,
    title,
    prompt.replace(/Formula:.*$/i, "").trim() || "Pick the closest answer:",
    opts.map((o) => o.label),
    okIndex,
    coachWin
  );
}
