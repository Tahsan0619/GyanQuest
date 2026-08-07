const fs = require("fs");
const p = require("path").join(__dirname, "../js/main.js");
let s = fs.readFileSync(p, "utf8");

const D = (cls, inner) => "<" + "div" + (cls ? ' class="' + cls + '"' : "") + ">" + inner + "</" + "motion" + ">".replace("motion", "div");

const block = `function getProgressEls() {
  return {
    levelTitle,
    levelSelect,
    subDots,
    scoresEl,
    progressFill,
    progressLabel,
    rewardSlot,
    labDepth: document.getElementById("lab-depth"),
    checkpointBadge,
    onJumpSub: (i) => {
      state.sub = i;
      showNext(false);
      runCurrent();
    },
    checkpointAfter: (lv) => LEVELS[lv]?.checkpointAfter,
  };
}

function updateProgressUI() {
  updateKidProgressUI(getProgressEls(), state);
}

function showToast(msg) {
  if (!toastRoot) return;
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  toastRoot.appendChild(el);
  setTimeout(() => { toastRoot.innerHTML = ""; }, 2200);
}

function showLevelIntro(onGo) {
  const m = LEVEL_META[state.level];
  const card = document.createElement("motion");
  card.className = "card modal-card level-intro";
  card.innerHTML =
    '<p class="intro-emoji">' + m.emoji + '</p>' +
    '<h2>Mission ' + (state.level + 1) + ': ' + m.kidTitle + '</h2>' +
    '<p>' + m.intro + '</p>' +
    '<p class="level-gate__sub">Examples: ' + m.everyday.join(' · ') + '</p>' +
    '<button type="button" class="btn primary" id="intro-go">Let\\'s play!</button>';
  modalRoot.innerHTML = "";
  modalRoot.appendChild(card);
  const tagFix = modalRoot.querySelector(".level-intro");
  if (tagFix && tagFix.tagName === "MOTION") {
    const d = document.createElement("div");
    d.className = tagFix.className;
    d.innerHTML = tagFix.innerHTML;
    modalRoot.replaceChild(d, tagFix);
  }
  modalRoot.setAttribute("aria-hidden", "false");
  document.getElementById("intro-go").onclick = () => {
    state.introSeen[state.level] = true;
    saveGame(state);
    modalRoot.setAttribute("aria-hidden", "true");
    modalRoot.innerHTML = "";
    onGo();
  };
}

function openLevelQuiz(levelIdx, onPass) {
  const pool = LEVEL_META[levelIdx].quiz;
  let idx = 0;
  modalRoot.setAttribute("aria-hidden", "false");
  const m = LEVEL_META[levelIdx];
  function renderQ() {
    if (idx >= pool.length) {
      state.rewards[levelIdx] = { earned: true, stars: pool.length };
      saveGame(state);
      modalRoot.innerHTML =
        '<div class="card modal-card level-gate"><p class="intro-emoji">' + REWARD_ICONS[levelIdx] +
        '</p><h2>You earned: ' + m.rewardName + '!</h2>' +
        '<button type="button" class="btn primary" id="quiz-done">Awesome!</button></div>';
      document.getElementById("quiz-done").onclick = () => {
        modalRoot.setAttribute("aria-hidden", "true");
        modalRoot.innerHTML = "";
        updateProgressUI();
        onPass();
      };
      return;
    }
    const item = pool[idx];
    modalRoot.innerHTML =
      '<motion class="card modal-card"><h2>Level quiz (' + (idx + 1) + '/' + pool.length + ')</h2>' +
      '<p>' + item.q + '</p><div class="mc-grid" id="lv-quiz"></div>' +
      '<p id="lv-qfb" class="mcq-feedback"></p></motion>';
    modalRoot.innerHTML = modalRoot.innerHTML.replace(/<motion/g, "<").replace(/motion class/g, "motion class").replace(/<motion/g, "<div").replace(/motion class/g, "div class").replace(/<motion/g, "<div").replace(/<\/motion>/g, "</div>");
    const mc = modalRoot.querySelector("#lv-quiz");
    const fb = modalRoot.querySelector("#lv-qfb");
    item.opts.forEach((text, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "mcq-choice";
      b.textContent = text;
      b.onclick = () => {
        if (i === item.ok) {
          b.classList.add("correct-pick");
          if (fb) fb.textContent = "Great!";
          setTimeout(() => { idx++; renderQ(); }, 500);
        } else {
          b.classList.add("wrong-pick");
          if (fb) fb.textContent = "Try again!";
          setTimeout(() => b.classList.remove("wrong-pick"), 400);
        }
      };
      mc.appendChild(b);
    });
  }
  renderQ();
}`;

// Fix accidental motion tags in block string
let cleanBlock = block.replace(/<motion/g, "<__DIV__").replace(/<\/motion>/g, "</__DIV__>").replace(/<__DIV__/g, "<div").replace(/<\/__DIV__>/g, "</motion>").replace(/<\/motion>/g, "</div>");
cleanBlock = cleanBlock.replace(/createElement\("motion"\)/g, 'createElement("motion")'.replace("motion", "div"));
cleanBlock = cleanBlock.replace(/tagName === "MOTION"/g, 'tagName === "DIV"');

if (!s.includes("function getProgressEls")) {
  s = s.replace(/function updateProgressUI\(\) \{[\s\S]*?\n\}/, cleanBlock);
}

fs.writeFileSync(p, s);
console.log("patch-main2 done");
