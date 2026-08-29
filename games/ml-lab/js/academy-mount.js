/**
 * Teach the Model - training academy with photo deck + animated meters.
 */
import { labState, pulseFailFeedback, pulseSuccessFeedback } from "./lab-state.js?v=acad6";

function advanceGate() {
  if (typeof window.__gqSignalGateReady === "function") {
    window.__gqSignalGateReady({ forceAdvance: true });
  }
}

const ROOT_ID = "academy-root";
const P = "/games/ml-lab/assets/photos";
const U = "/games/ml-lab/assets/ui";

const CLEAN_CARDS = [
  { id: "c1", label: "Tabby", issue: "mislabel", wrong: "Dog", fix: "Relabel → Cat", src: `${P}/photo-cat-tabby.png` },
  { id: "c2", label: "Beagle", issue: "dup", fix: "Discard duplicate", src: `${P}/photo-dog-beagle.png` },
  { id: "c3", label: "Blurry smear", issue: "blur", fix: "Discard unusable", src: `${P}/photo-blur.png` },
  { id: "c4", label: "Siamese", issue: null, src: `${P}/photo-cat-siamese.png` },
  { id: "c5", label: "Poodle", issue: null, src: `${P}/photo-dog-poodle.png` },
  { id: "c6", label: "Kitten", issue: null, src: `${P}/photo-cat-kitten.png` },
];

const EPOCH_CURVE = [
  { error: 85, check: 80 },
  { error: 70, check: 65 },
  { error: 58, check: 52 },
  { error: 48, check: 45 },
  { error: 40, check: 48 },
  { error: 35, check: 55 },
  { error: 32, check: 62 },
  { error: 30, check: 68 },
];

const SWEET_EPOCH = 3;

let lastRenderKey = "";
let liveHandlers = [];

function track(el, event, fn) {
  if (!el) return;
  el.addEventListener(event, fn);
  liveHandlers.push(() => el.removeEventListener(event, fn));
}

function clearLiveHandlers() {
  liveHandlers.forEach((fn) => {
    try {
      fn();
    } catch {
      /* ignore */
    }
  });
  liveHandlers = [];
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function meterBar(label, pct, kind) {
  return `
    <div class="ac-meter ac-meter--${kind}">
      <div class="ac-meter-head"><span>${label}</span><strong>${pct}%</strong></div>
      <div class="ac-meter-track"><div class="ac-meter-fill" style="width:${pct}%"></div></div>
    </div>`;
}

function curvePolylines(epoch) {
  const n = Math.max(1, Math.min(epoch + 1, EPOCH_CURVE.length));
  const errPts = [];
  const chkPts = [];
  for (let i = 0; i < n; i++) {
    const x = (i / Math.max(1, EPOCH_CURVE.length - 1)) * 190 + 5;
    const e = EPOCH_CURVE[i];
    errPts.push(`${x},${8 + e.error * 0.55}`);
    chkPts.push(`${x},${8 + e.check * 0.55}`);
  }
  const sweetX = (SWEET_EPOCH / Math.max(1, EPOCH_CURVE.length - 1)) * 190 + 5;
  const sweetY = 8 + EPOCH_CURVE[SWEET_EPOCH].check * 0.55;
  return { errPts: errPts.join(" "), chkPts: chkPts.join(" "), sweetX, sweetY, showSweet: epoch >= SWEET_EPOCH };
}

function renderOpen() {
  return `
    <div class="ac-open">
      <img class="ac-building-img ac-float" src="${U}/ui-academy.png" alt="Training academy" />
      <p class="ac-sign">Apprentice Training Academy - Enrolling Now</p>
      <p class="ac-caption">Empty halls - ready to run a real training cycle.</p>
      ${labState.mlOpenReady ? "" : `<button type="button" class="btn primary" id="ac-enroll">Enroll the Apprentice →</button>`}
    </div>`;
}

function renderClean1() {
  const phase = labState.mlCleanPhase || "clean";
  const fixed = labState.mlFixedCards || {};
  const idx = labState.mlCleanIdx || 0;
  const card = CLEAN_CARDS[idx];
  if (phase === "compare") {
    return `
      <div class="ac-compare">
        <div class="ac-duo">
          <div class="ac-apprentice-card is-bad ac-rise">
            <img class="ac-mini-char" src="${U}/ui-apprentice.png" alt="" />
            <span>Messy-deck apprentice</span>
            <small>New photos: 2/4 ✗</small>
          </div>
          <div class="ac-apprentice-card is-good ac-rise" style="animation-delay:.06s">
            <img class="ac-mini-char" src="${U}/ui-apprentice.png" alt="" />
            <span>Clean-deck apprentice</span>
            <small>New photos: 4/4 ✓</small>
          </div>
        </div>
        ${labState.mlCompareDone ? `<p class="ac-note ac-note--ok">Same process - only the material quality differed.</p>` : `
          <button type="button" class="btn primary" id="ac-run-compare">Train both side by side ▶</button>`}
      </div>`;
  }
  const count = Math.min(12, (labState.mlCleanCount || 0) + Object.keys(fixed).length);
  return `
    <div class="ac-clean">
      <p class="ac-hint">Clean the practice deck - Cards cleaned: <strong>${labState.mlCleanCount || count}</strong> / 12</p>
      ${card && idx < CLEAN_CARDS.length ? `
        <div class="ac-flashcard ac-flip-in ${card.issue && !fixed[card.id] ? "has-issue" : "is-clean"}">
          <img class="ac-flash-img" src="${card.src}" alt="${esc(card.label)}" />
          <div class="ac-flash-meta">
            <strong>${esc(card.label)}</strong>
            ${card.wrong && !fixed[card.id] ? `<small class="ac-wrong">labeled "${esc(card.wrong)}"</small>` : ""}
            ${fixed[card.id] ? `<small class="ac-fixed">Fixed ✓</small>` : ""}
          </div>
        </div>
        ${card.issue && !fixed[card.id] ? `<button type="button" class="btn secondary" data-fix="${card.id}">${card.fix}</button>` : ""}
        ${!card.issue || fixed[card.id] ? `<button type="button" class="btn secondary" id="ac-next-card">Keep & next ▶</button>` : ""}
      ` : labState.mlCleanDone ? `
        <p class="ac-note ac-note--ok ac-pop">A clean deck: correctly labeled, no duplicates, no unusable cards.</p>
        <div class="ac-deck-preview">
          ${CLEAN_CARDS.filter((c) => c.issue !== "blur" && c.issue !== "dup").map((c) =>
            `<img src="${c.src}" alt="${esc(c.label)}" />`,
          ).join("")}
        </div>
        <button type="button" class="btn primary" id="ac-to-compare">Train two apprentices ▶</button>
      ` : ""}
    </div>`;
}

function renderFunnel1() {
  return `
    <div class="ac-funnel ac-rise">
      <div class="ac-funnel-top">
        <div class="ac-funnel-thumbs">
          <img src="${P}/photo-blur.png" alt="" />
          <img src="${P}/photo-cat-tabby.png" alt="" />
          <img src="${P}/photo-dog-beagle.png" alt="" />
        </div>
        Raw messy data ↓
      </div>
      <div class="ac-funnel-mid ac-pulse">Cleaning filter</div>
      <div class="ac-funnel-bot">
        <div class="ac-funnel-thumbs">
          <img src="${P}/photo-cat-tabby.png" alt="" />
          <img src="${P}/photo-dog-beagle.png" alt="" />
          <img src="${P}/photo-cat-siamese.png" alt="" />
        </div>
        Ready to Train ✓
      </div>
    </div>
    <p class="ac-caption">Raw data almost never arrives ready - cleaning is real work.</p>`;
}

function renderTerms1() {
  return `
    <ul class="ac-term-list ac-rise">
      <li><strong>Dataset</strong> - full collection of examples used to teach a model</li>
      <li><strong>Data cleaning</strong> - fix labels, remove duplicates, discard unusable rows</li>
      <li class="ac-term-note"><em>Garbage in, garbage out.</em></li>
    </ul>`;
}

function renderSplit2() {
  const practice = labState.mlSplitPractice || 0;
  const vault = labState.mlSplitVault || 0;
  const sealed = labState.mlVaultSealed;
  return `
    <div class="ac-split-scene">
      <p class="ac-hint">100-card deck - split before training starts.</p>
      <div class="ac-piles">
        <div class="ac-pile ${practice >= 80 ? "is-full" : ""}">
          <div class="ac-pile-art">
            ${[0, 1, 2].map((i) => `<img src="${CLEAN_CARDS[i % CLEAN_CARDS.length].src}" alt="" style="--i:${i}" />`).join("")}
          </div>
          <strong>Practice Pile</strong>
          <div class="ac-pile-bar"><div style="width:${(practice / 80) * 100}%"></div></div>
          <span>${practice} / 80</span>
          ${!sealed ? `<button type="button" class="btn secondary" id="ac-add-practice">+10 cards</button>` : ""}
        </div>
        <div class="ac-pile ac-pile--vault ${sealed ? "is-sealed" : ""}">
          <img class="ac-vault-img" src="${U}/ui-vault.png" alt="Vault" />
          <strong>Sealed Vault</strong>
          <div class="ac-pile-bar"><div style="width:${(vault / 20) * 100}%"></div></div>
          <span>${vault} / 20</span>
          ${!sealed ? `<button type="button" class="btn secondary" id="ac-add-vault">+10 cards</button>` : ""}
          ${sealed ? `<span class="ac-lock ac-pop">Latched shut</span>` : ""}
        </div>
      </div>
      ${!sealed && practice >= 80 && vault >= 20 ? `<button type="button" class="btn primary" id="ac-seal-vault">Confirm split & seal vault ▶</button>` : ""}
      ${sealed ? `
        <button type="button" class="btn secondary" id="ac-peek-vault">Peek at the Vault</button>
        ${labState.mlPeekAttempted ? `<p class="ac-note ac-note--warn">No peeking - that would make the final exam meaningless.</p>` : ""}
      ` : ""}
    </div>`;
}

function renderRooms2() {
  return `
    <div class="ac-rooms">
      <div class="ac-room ac-room--practice ac-rise">
        <img src="${P}/photo-dog-poodle.png" alt="" />
        <strong>Practice Room</strong><small>80 cards - active study</small>
      </div>
      <div class="ac-room ac-room--vault ac-rise" style="animation-delay:.06s">
        <img src="${U}/ui-vault.png" alt="" />
        <strong>Vault Room</strong><small>20 cards - locked until training ends</small>
      </div>
    </div>
    <p class="ac-caption">Same building, two rooms - learning vs final exam.</p>`;
}

function renderTerms2() {
  return `
    <ul class="ac-term-list ac-rise">
      <li><strong>Training set</strong> - data the model learns from (~80%)</li>
      <li><strong>Test set</strong> - held out, never used during training (~20%)</li>
      <li class="ac-term-note">Split happens first - vault stays sealed.</li>
    </ul>`;
}

function renderTrain3() {
  const epoch = labState.mlEpochs || 0;
  const pt = EPOCH_CURVE[Math.min(epoch, EPOCH_CURVE.length - 1)];
  const stopped = labState.mlStopDone;
  const curve = curvePolylines(epoch);
  return `
    <div class="ac-train-scene">
      <div class="ac-train-head">
        <img class="ac-mini-char ac-spin-soft" src="${U}/ui-apprentice.png" alt="" />
        <div class="ac-epoch-badge">Epoch ${epoch}</div>
      </div>
      <div class="ac-meters">
        ${meterBar("Error Score", pt.error, "error")}
        ${meterBar("Check Score", pt.check, "check")}
      </div>
      <div class="ac-graph-mini">
        <svg viewBox="0 0 200 70" class="ac-graph-svg">
          <polyline class="ac-graph-line ac-graph-line--err" points="${curve.errPts}" fill="none" stroke="#f472b6" stroke-width="2.5" stroke-linecap="round"/>
          <polyline class="ac-graph-line ac-graph-line--chk" points="${curve.chkPts}" fill="none" stroke="#94a3b8" stroke-width="2.5" stroke-dasharray="4" stroke-linecap="round"/>
          ${curve.showSweet ? `<circle class="ac-sweet" cx="${curve.sweetX}" cy="${curve.sweetY}" r="5" fill="#fbbf24"/>` : ""}
        </svg>
        <small>Pink = error · Gray dashed = check score</small>
      </div>
      ${!stopped ? `
        <button type="button" class="btn secondary" id="ac-run-epoch">Run one full pass (epoch ${epoch + 1})</button>
        <button type="button" class="btn primary" id="ac-stop-train">Stop training ▶</button>
      ` : `<p class="ac-note ac-note--ok ac-pop">${labState.mlStopNote || "Training stopped."}</p>`}
    </div>`;
}

function renderGraph3() {
  const curve = curvePolylines(EPOCH_CURVE.length - 1);
  return `
    <div class="ac-graph-full ac-rise">
      <svg viewBox="0 0 200 80" class="ac-graph-svg">
        <polyline points="${curve.errPts}" fill="none" stroke="#f472b6" stroke-width="2.5"/>
        <polyline points="${curve.chkPts}" fill="none" stroke="#94a3b8" stroke-width="2.5" stroke-dasharray="4"/>
        <circle cx="${curve.sweetX}" cy="${curve.sweetY}" r="5" fill="#fbbf24"/>
        <text x="${curve.sweetX + 6}" y="${curve.sweetY - 4}" font-size="8" fill="#fbbf24">sweet spot</text>
      </svg>
    </div>
    <p class="ac-caption">Stop right where the check score is lowest - before it creeps back up.</p>`;
}

function renderTerms3() {
  return `
    <ul class="ac-term-list ac-rise">
      <li><strong>Epoch</strong> - one full pass through the training set</li>
      <li><strong>Loss / error</strong> - how wrong predictions are; training shrinks it</li>
      <li><strong>Overfitting</strong> - memorizing training quirks instead of the pattern</li>
      <li><strong>Early stopping</strong> - halt when unseen-style performance stops improving</li>
    </ul>`;
}

function renderExam4() {
  const done = labState.mlExamDone;
  const score = labState.mlExamScore ?? 0;
  return `
    <div class="ac-exam-scene">
      <div class="ac-vault ${done ? "is-open" : ""} ac-float">
        <img src="${U}/ui-vault.png" alt="Sealed vault" />
        <span>${done ? "Vault unlocked" : "Sealed Vault (20 cards)"}</span>
      </div>
      ${!done ? `<button type="button" class="btn primary" id="ac-unlock-exam">Unlock vault - run final exam ▶</button>` : `
        <div class="ac-scoreboard ac-pop"><strong>${score} / 20 correct</strong> - ${Math.round((score / 20) * 100)}% accuracy</div>
        <div class="ac-exam-thumbs">
          ${[0, 1, 2, 3].map((i) => `<img src="${CLEAN_CARDS[i].src}" alt="" class="ac-pop" style="animation-delay:${i * 0.05}s" />`).join("")}
        </div>
        <p class="ac-note ac-note--ok">Nothing in this vault was ever used to teach the apprentice.</p>
        <button type="button" class="btn secondary" id="ac-cheater">Compare to a cheater (optional)</button>
        ${labState.mlCheaterShown ? `<p class="ac-note ac-note--warn">Cheater scored 100% - meaningless, since vault cards were seen during training.</p>` : ""}
      `}
    </div>`;
}

function renderCycle4() {
  const steps = ["Collect", "Clean", "Split", "Train", "Evaluate"];
  return `
    <div class="ac-cycle">
      ${steps.map((s, i) => `
        <span class="ac-cycle-step ac-rise" style="animation-delay:${i * 0.07}s">${s}</span>
        ${i < steps.length - 1 ? `<span class="ac-cycle-arrow">→</span>` : ""}
      `).join("")}
    </div>
    <p class="ac-caption">One continuous cycle - every real ML project runs through it.</p>`;
}

function renderTerms4() {
  return `
    <ul class="ac-term-list ac-term-list--summary ac-rise">
      <li>Dataset → Cleaning → Train/Test Split → Epochs & Loss → Early Stopping → Evaluation</li>
      <li><strong>Accuracy</strong> - percent of test examples predicted correctly</li>
      <li class="ac-term-note"><em>Next: learning without an answer key - unsupervised learning?</em></li>
    </ul>`;
}

function renderClose(u) {
  const t = Math.min(1, u || 0);
  return `
    <div class="ac-close" style="--ac-close:${t}">
      <img class="ac-building-img is-live ac-float" src="${U}/ui-academy.png" alt="" />
      <div class="ac-journey" style="opacity:${t}">
        <span>Deck cleaned</span><span>Vault sealed</span><span>Error falling</span><span>Exam scored honestly ✓</span>
      </div>
    </div>`;
}

function renderStage(mode) {
  switch (mode) {
    case "open": return renderOpen();
    case "clean1": return renderClean1();
    case "funnel1": return renderFunnel1();
    case "terms1": return renderTerms1();
    case "split2": return renderSplit2();
    case "rooms2": return renderRooms2();
    case "terms2": return renderTerms2();
    case "train3": return renderTrain3();
    case "graph3": return renderGraph3();
    case "terms3": return renderTerms3();
    case "exam4": return renderExam4();
    case "cycle4": return renderCycle4();
    case "terms4": return renderTerms4();
    case "close": return renderClose(labState.mlCloseU);
    default: return renderOpen();
  }
}

function bindClean1(root, onChange) {
  root.querySelectorAll("[data-fix]").forEach((btn) => {
    track(btn, "click", () => {
      const id = btn.dataset.fix;
      labState.mlFixedCards = { ...(labState.mlFixedCards || {}), [id]: true };
      labState.mlCleanCount = Math.min(12, (labState.mlCleanCount || 0) + 1);
      pulseSuccessFeedback(180);
      syncAcademy("clean1", { onChange });
      onChange?.();
    });
  });
  track(root.querySelector("#ac-next-card"), "click", () => {
    labState.mlCleanIdx = (labState.mlCleanIdx || 0) + 1;
    labState.mlCleanCount = Math.min(12, (labState.mlCleanCount || 0) + 1);
    if (labState.mlCleanIdx >= CLEAN_CARDS.length) {
      labState.mlCleanCount = 12;
      labState.mlCleanDone = true;
    }
    pulseSuccessFeedback(140);
    syncAcademy("clean1", { onChange });
    onChange?.();
  });
  track(root.querySelector("#ac-to-compare"), "click", () => {
    labState.mlCleanPhase = "compare";
    syncAcademy("clean1", { onChange });
    onChange?.();
  });
  track(root.querySelector("#ac-run-compare"), "click", () => {
    labState.mlCompareDone = true;
    pulseSuccessFeedback(260);
    syncAcademy("clean1", { onChange });
    onChange?.();
  });
}

function bindSplit2(root, onChange) {
  track(root.querySelector("#ac-add-practice"), "click", () => {
    if ((labState.mlSplitPractice || 0) < 80) {
      labState.mlSplitPractice = Math.min(80, (labState.mlSplitPractice || 0) + 10);
      pulseSuccessFeedback(120);
      syncAcademy("split2", { onChange });
      onChange?.();
    }
  });
  track(root.querySelector("#ac-add-vault"), "click", () => {
    if ((labState.mlSplitVault || 0) < 20) {
      labState.mlSplitVault = Math.min(20, (labState.mlSplitVault || 0) + 10);
      pulseSuccessFeedback(120);
      syncAcademy("split2", { onChange });
      onChange?.();
    }
  });
  track(root.querySelector("#ac-seal-vault"), "click", () => {
    labState.mlVaultSealed = true;
    pulseSuccessFeedback(240);
    syncAcademy("split2", { onChange });
    onChange?.();
  });
  track(root.querySelector("#ac-peek-vault"), "click", () => {
    labState.mlPeekAttempted = true;
    pulseFailFeedback(280);
    syncAcademy("split2", { onChange });
    onChange?.();
  });
}

function bindTrain3(root, onChange) {
  track(root.querySelector("#ac-run-epoch"), "click", () => {
    if ((labState.mlEpochs || 0) < EPOCH_CURVE.length) {
      labState.mlEpochs = (labState.mlEpochs || 0) + 1;
      pulseSuccessFeedback(160);
      syncAcademy("train3", { onChange });
      onChange?.();
    }
  });
  track(root.querySelector("#ac-stop-train"), "click", () => {
    const e = labState.mlEpochs || 0;
    if (e < 2) {
      labState.mlStopNote = "Stopped early - still improving; more epochs would help.";
    } else if (e === SWEET_EPOCH || e === SWEET_EPOCH + 1) {
      labState.mlStopNote = "Sweet spot - check score near its lowest. Good call.";
      pulseSuccessFeedback(280);
    } else if (e > SWEET_EPOCH + 1) {
      labState.mlStopNote = "Stopped late - check score rising again (overfitting starting).";
      pulseFailFeedback(200);
    } else {
      labState.mlStopNote = "Reasonable stop - error still falling.";
      pulseSuccessFeedback(200);
    }
    labState.mlStopDone = true;
    syncAcademy("train3", { onChange });
    onChange?.();
  });
}

function bindExam4(root, onChange) {
  track(root.querySelector("#ac-unlock-exam"), "click", () => {
    labState.mlExamScore = 18;
    labState.mlExamDone = true;
    pulseSuccessFeedback(260);
    syncAcademy("exam4", { onChange });
    onChange?.();
  });
  track(root.querySelector("#ac-cheater"), "click", () => {
    labState.mlCheaterShown = true;
    pulseFailFeedback(180);
    syncAcademy("exam4", { onChange });
    onChange?.();
  });
}

function bindOpen(root, onChange) {
  track(root.querySelector("#ac-enroll"), "click", () => {
    labState.mlOpenReady = true;
    pulseSuccessFeedback(220);
    syncAcademy("open", { onChange });
    onChange?.();
    advanceGate();
  });
}

function bindInteractions(root, onChange) {
  clearLiveHandlers();
  const mode = labState.mlMode;
  if (mode === "open") bindOpen(root, onChange);
  if (mode === "clean1") bindClean1(root, onChange);
  if (mode === "split2") bindSplit2(root, onChange);
  if (mode === "train3") bindTrain3(root, onChange);
  if (mode === "exam4") bindExam4(root, onChange);
}

const BANNERS = {
  open: "Apprentice Training Academy - enrolling now.",
  clean1: "Clean the deck, then compare messy vs clean training.",
  funnel1: "Raw data → cleaning → ready to train.",
  terms1: "Dataset · Data cleaning · garbage in, garbage out.",
  split2: "Split 80 practice / 20 sealed vault - before training.",
  rooms2: "Practice room vs vault room.",
  terms2: "Training set · Test set · split first.",
  train3: "Run epochs - watch error fall, know when to stop.",
  graph3: "Sweet spot where check score is lowest.",
  terms3: "Epoch · Loss · Overfitting · Early stopping.",
  exam4: "Unlock the vault - honest final exam.",
  cycle4: "Collect → Clean → Split → Train → Evaluate.",
  terms4: "Full ML workflow vocabulary.",
  close: "The apprentice, properly trained.",
};

export function mountAcademy(viewport, onChange) {
  if (!viewport) return () => {};
  unmountAcademy(viewport);
  const root = document.createElement("div");
  root.id = ROOT_ID;
  root.className = "academy-root";
  root.innerHTML = `<p class="ac-banner" id="ac-banner"></p><div class="ac-stage" id="ac-stage"></div>`;
  viewport.appendChild(root);
  viewport.classList.add("viewport--academy");
  syncAcademy(labState.mlMode || "open", { onChange });
  return () => unmountAcademy(viewport);
}

export function syncAcademy(mode, opts = {}) {
  labState.mlMode = mode || labState.mlMode || "open";
  const root = document.getElementById(ROOT_ID);
  if (!root) return;

  const renderKey = [
    labState.mlMode,
    labState.mlCleanPhase,
    labState.mlCleanIdx,
    labState.mlCleanCount,
    labState.mlCleanDone ? 1 : 0,
    labState.mlCompareDone ? 1 : 0,
    JSON.stringify(labState.mlFixedCards || {}),
    labState.mlSplitPractice,
    labState.mlSplitVault,
    labState.mlVaultSealed ? 1 : 0,
    labState.mlPeekAttempted ? 1 : 0,
    labState.mlEpochs,
    labState.mlStopDone ? 1 : 0,
    labState.mlStopNote,
    labState.mlExamDone ? 1 : 0,
    labState.mlExamScore,
    labState.mlCheaterShown ? 1 : 0,
    Math.floor((labState.mlCloseU || 0) * 20),
    labState.mlOpenReady ? 1 : 0,
  ].join("|");

  const stage = root.querySelector("#ac-stage");
  const banner = root.querySelector("#ac-banner");

  if (stage && renderKey !== lastRenderKey) {
    stage.innerHTML = renderStage(labState.mlMode);
    lastRenderKey = renderKey;
    bindInteractions(root, opts.onChange);
    if (labState.mlMode === "open" && !labState.mlOpenReady) {
      setTimeout(() => {
        if (!labState.mlOpenReady) {
          labState.mlOpenReady = true;
          opts.onChange?.();
          syncAcademy("open", opts);
        }
      }, 4000);
    }
  } else if (labState.mlMode === "close" && stage) {
    stage.style.setProperty("--ac-close", String(labState.mlCloseU || 0));
  }

  if (banner) banner.textContent = opts.banner || BANNERS[labState.mlMode] || "";
}

export function unmountAcademy(viewport) {
  lastRenderKey = "";
  clearLiveHandlers();
  document.getElementById(ROOT_ID)?.remove();
  viewport?.classList.remove("viewport--academy");
}
