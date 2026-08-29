/**
 * What is AI? DOM overlay - apprentice metaphor with photo training deck + animated UI.
 */
import { labState, pulseFailFeedback, pulseSuccessFeedback } from "./lab-state.js?v=appr6";

function advanceGate() {
  if (typeof window.__gqSignalGateReady === "function") {
    window.__gqSignalGateReady({ forceAdvance: true });
  }
}

const ROOT_ID = "apprentice-root";
const P = "/games/ai-lab/assets/photos";
const U = "/games/ai-lab/assets/ui";

const TRAINING_PHOTOS = [
  { id: "t1", label: "Tabby", answer: "Cat", src: `${P}/photo-cat-tabby.png` },
  { id: "t2", label: "Beagle", answer: "Dog", src: `${P}/photo-dog-beagle.png` },
  { id: "t3", label: "Siamese", answer: "Cat", src: `${P}/photo-cat-siamese.png` },
  { id: "t4", label: "Poodle", answer: "Dog", src: `${P}/photo-dog-poodle.png` },
  { id: "t5", label: "Fluffy", answer: "Cat", src: `${P}/photo-cat-fluffy.png` },
];

const NEW_PHOTOS = [
  { id: "n1", label: "Pointy-eared dog", answer: "Dog", src: `${P}/photo-dog-husky.png`, aOk: true, bOk: false },
  { id: "n2", label: "Floppy-eared cat", answer: "Cat", src: `${P}/photo-cat-floppy.png`, aOk: true, bOk: false },
  { id: "n3", label: "Husky", answer: "Dog", src: `${P}/photo-dog-husky.png`, aOk: true, bOk: true },
  { id: "n4", label: "Kitten", answer: "Cat", src: `${P}/photo-cat-kitten.png`, aOk: true, bOk: false },
  { id: "n5", label: "Mixed breed", answer: "Dog", src: `${P}/photo-dog-mixed.png`, aOk: true, bOk: false },
];

const APP_MATCHES = [
  { app: "voice", label: "Voice assistant", data: "speech", icon: "🎙️" },
  { app: "photo", label: "Photo tags", data: "photos", icon: "🏷️" },
  { app: "music", label: "Music app", data: "music", icon: "🎧" },
  { app: "spam", label: "Spam filter", data: "spam", icon: "🛡️" },
];

const DATA_TRAY = [
  { id: "speech", text: "Speech + correct text" },
  { id: "photos", text: "Labeled photos" },
  { id: "music", text: "Play vs skip history" },
  { id: "spam", text: "Spam / not spam emails" },
];

let lastRenderKey = "";
let liveHandlers = [];

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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

function track(el, event, fn) {
  if (!el) return;
  el.addEventListener(event, fn);
  liveHandlers.push(() => el.removeEventListener(event, fn));
}

function charHtml(kind, title, extra = "") {
  const src = kind === "employee" ? `${U}/ui-employee.png` : `${U}/ui-apprentice.png`;
  return `
    <div class="ap-character ap-character--${kind}">
      <img class="ap-char-img ap-pop" src="${src}" alt="" />
      <div class="ap-char-meta">
        <span class="ap-char-title">${title}</span>
        ${extra}
      </div>
    </div>`;
}

function confMeter(pct) {
  return `
    <div class="ap-conf-wrap" aria-label="Confidence ${pct}%">
      <div class="ap-conf-label">Confidence ${pct}%</div>
      <div class="ap-conf-meter"><div class="ap-conf-fill" style="width:${pct}%"></div></div>
    </div>`;
}

function photoCard(src, label, extraClass = "") {
  return `
    <div class="ap-card ${extraClass}">
      <img class="ap-card-img" src="${src}" alt="${esc(label)}" draggable="false" />
      <span class="ap-card-cap">${esc(label)}</span>
    </div>`;
}

function renderOpen() {
  return `
    <div class="ap-open">
      <div class="ap-phone ap-float">
        <img class="ap-phone-frame" src="${U}/ui-phone.png" alt="Phone tagging a dog" />
        <div class="ap-tag is-correct ap-tag-pop">Dog ✓</div>
      </div>
      <p class="ap-caption">Nobody wrote a rule for every dog photo - yet the app got it right.</p>
      ${labState.aiOpenReady ? "" : `<button type="button" class="btn primary" id="ap-enroll">Meet the Apprentice →</button>`}
    </div>`;
}

function renderRules1() {
  const phase = labState.aiRulePhase || "pick";
  const patches = labState.aiRulePatches || 0;
  const fed = labState.aiExamplesFed || 0;
  return `
    <div class="ap-rules-scene">
      ${phase === "pick" || phase === "fail" ? `
        ${charHtml("employee", "Rulebook Employee")}
        <p class="ap-hint">Pick a sorting rule:</p>
        <div class="ap-rule-btns">
          <button type="button" class="btn secondary" data-rule="ears">IF pointy ears → Cat</button>
          <button type="button" class="btn secondary" data-rule="size">IF small → Cat</button>
        </div>
        ${labState.aiRulesFailed ? `<p class="ap-note ap-note--warn">There's always one more exception. Rules never quite catch up.</p>` : ""}
        ${phase === "fail" && patches < 2 ? `<button type="button" class="btn secondary" id="ap-patch">Add exception patch</button>` : ""}
        ${labState.aiRulesFailed ? `<button type="button" class="btn primary" id="ap-to-apprentice">Try the Apprentice instead →</button>` : ""}
      ` : `
        ${charHtml("apprentice", "Apprentice")}
        <p class="ap-hint">Feed labeled examples (${fed}/5)</p>
        <div class="ap-feed-zone ${fed >= 5 ? "is-full" : ""}" id="ap-feed-zone">
          <div class="ap-feed-stack">
            ${TRAINING_PHOTOS.slice(0, fed).map((p) =>
              `<img class="ap-feed-thumb ap-pop" src="${p.src}" alt="${esc(p.label)}" />`,
            ).join("")}
          </div>
          <span>${fed >= 5 ? "Deck loaded ✓" : "Drop examples here"}</span>
        </div>
        <div class="ap-tray">
          <div class="ap-tray-chip ap-tray-chip--deck" draggable="true" data-feed="stack">
            <img src="${P}/photo-cat-tabby.png" alt="" />
            <img src="${P}/photo-dog-beagle.png" alt="" />
            <span>Labeled cat & dog photos</span>
          </div>
        </div>
        ${fed >= 5 ? `
          <p class="ap-hint">Test tricky photos the rules broke on:</p>
          <div class="ap-photo-row">
            <button type="button" class="ap-photo-btn" data-test="1">
              <img src="${P}/photo-dog-husky.png" alt="" /><span>Pointy-eared dog</span>
            </button>
            <button type="button" class="ap-photo-btn" data-test="2">
              <img src="${P}/photo-cat-floppy.png" alt="" /><span>Floppy cat</span>
            </button>
          </div>
          ${labState.aiApprenticeTrained ? `<p class="ap-note ap-note--ok">No rules written. Just examples - tricky ones sorted correctly.</p>` : ""}
        ` : ""}
      `}
    </div>`;
}

function renderSplit1() {
  return `
    <div class="ap-split">
      <div class="ap-split-side ap-split-side--rules ap-rise">
        <img class="ap-split-icon" src="${U}/ui-employee.png" alt="" />
        <strong>Traditional programming</strong>
        <p>IF… THEN… branches, exceptions piled up</p>
      </div>
      <div class="ap-split-side ap-split-side--learn ap-rise" style="animation-delay:.08s">
        <img class="ap-split-icon" src="${U}/ui-apprentice.png" alt="" />
        <strong>AI / ML</strong>
        <p>Examples → Learned Pattern cloud</p>
      </div>
    </div>
    <p class="ap-caption">Rules written one exception at a time vs patterns learned from examples.</p>`;
}

function renderTerms1() {
  return `
    <ul class="ap-term-list ap-rise">
      <li><strong>Traditional programming</strong> - human writes explicit step-by-step rules</li>
      <li><strong>Artificial Intelligence (AI)</strong> - systems that perform tasks requiring human-like intelligence</li>
      <li><strong>Machine learning</strong> - learns patterns from example data, not explicit rules</li>
    </ul>`;
}

function renderTrain2() {
  const round = labState.aiTrainingRound || 0;
  const conf = Math.round((labState.aiConfidence || 0.2) * 100);
  const photo = TRAINING_PHOTOS[round];
  const revealed = labState.aiRoundRevealed;
  const guess = labState.aiLastGuess;
  return `
    <div class="ap-train-scene">
      ${charHtml("apprentice", "Apprentice", confMeter(conf))}
      ${round < 5 ? `
        <div class="ap-training-card ap-flip-in">
          ${photoCard(photo.src, photo.label, revealed ? (guess === photo.answer ? "is-ok" : "is-miss") : "")}
          ${!revealed ? `
            <p class="ap-guess">Guess: <strong>${guess || "?"}</strong></p>
            <div class="ap-guess-btns">
              <button type="button" class="btn secondary" id="ap-guess-cat">Guess: Cat</button>
              <button type="button" class="btn secondary" id="ap-guess-dog">Guess: Dog</button>
            </div>` : `
            <p class="ap-guess">Answer: <strong>${photo.answer}</strong> ${guess === photo.answer ? "✓" : "→ adjusting…"}</p>
            <button type="button" class="btn primary" id="ap-next-round">Next round ▶</button>`}
        </div>
        <div class="ap-round-dots">${TRAINING_PHOTOS.map((_, i) =>
          `<span class="ap-dot ${i < round ? "is-done" : i === round ? "is-now" : ""}"></span>`,
        ).join("")}</div>
        <p class="ap-caption">Round ${round + 1} of 5 - guess → reveal → adjust</p>
      ` : `<p class="ap-note ap-note--ok ap-pop">Five rounds complete - confidence climbing.</p>`}
    </div>`;
}

function renderGraph2() {
  const conf = Math.round((labState.aiConfidence || 0.2) * 100);
  const y = Math.max(12, 72 - conf * 0.55);
  return `
    <div class="ap-graph ap-rise">
      <svg viewBox="0 0 200 80" class="ap-graph-svg">
        <defs>
          <linearGradient id="apAccGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#7c3aed"/><stop offset="100%" stop-color="#c084fc"/>
          </linearGradient>
        </defs>
        <polyline class="ap-graph-line" points="0,70 40,65 80,50 120,35 160,22 200,${y}" fill="none" stroke="url(#apAccGrad)" stroke-width="3" stroke-linecap="round"/>
        <circle class="ap-graph-dot" cx="200" cy="${y}" r="5" fill="#f5d0fe"/>
      </svg>
      <div class="ap-graph-legend">Accuracy rising with training rounds</div>
    </div>
    <p class="ap-caption">5 rounds by hand. Real training: thousands - same loop, faster.</p>`;
}

function renderTerms2() {
  return `
    <ul class="ap-term-list ap-rise">
      <li><strong>Training data</strong> - labeled examples (input + correct answer)</li>
      <li><strong>Model</strong> - the thing being trained (the Apprentice)</li>
      <li><strong>Prediction</strong> - the model's guess</li>
      <li><strong>Training</strong> - guess → compare → adjust → repeat</li>
    </ul>`;
}

function renderTest3() {
  const tested = labState.aiTestDone;
  const peek = labState.aiPeekInside;
  return `
    <div class="ap-test-scene">
      <div class="ap-duo">
        <div class="ap-apprentice-card ${tested ? "is-a" : ""} ap-rise">
          <img class="ap-mini-char" src="${U}/ui-apprentice.png" alt="" />
          <span>Apprentice A</span>
          <small>Training: 100%</small>
          ${tested ? `<span class="ap-score">New data: 4/5 ✓</span>` : ""}
          ${peek ? `<p class="ap-inside">Flexible cat/dog features</p>` : ""}
        </div>
        <div class="ap-apprentice-card ${tested ? "is-b-bad" : ""} ap-rise" style="animation-delay:.06s">
          <img class="ap-mini-char" src="${U}/ui-apprentice.png" alt="" />
          <span>Apprentice B</span>
          <small>Training: 100%</small>
          ${tested ? `<span class="ap-score ap-score--bad">New data: 1/5 ✗</span>` : ""}
          ${peek ? `<p class="ap-inside">Memorized exact 20 photos</p>` : ""}
        </div>
      </div>
      ${tested ? `
        <div class="ap-new-strip">
          ${NEW_PHOTOS.map((p, i) => `
            <div class="ap-new-chip ap-pop" style="animation-delay:${i * 0.05}s">
              <img src="${p.src}" alt="${esc(p.label)}" />
              <span class="ap-new-a ${p.aOk ? "ok" : "bad"}">A</span>
              <span class="ap-new-b ${p.bOk ? "ok" : "bad"}">B</span>
            </div>`).join("")}
        </div>` : ""}
      ${!tested ? `<button type="button" class="btn primary" id="ap-run-test">Give them 5 new photos ▶</button>` : ""}
      ${tested && !peek ? `<button type="button" class="btn secondary" id="ap-peek">Peek inside both</button>` : ""}
    </div>`;
}

function renderExam3() {
  return `
    <div class="ap-exam">
      <div class="ap-exam-col ap-rise"><span>📖 Many practice problems</span><small>Understands pattern → new exam OK</small></div>
      <div class="ap-exam-col ap-rise" style="animation-delay:.06s"><span>📝 Memorized answers</span><small>Fails when questions change</small></div>
    </div>
    <p class="ap-caption">Understanding generalizes. Memorizing exact answers doesn't.</p>`;
}

function renderTerms3() {
  return `
    <ul class="ap-term-list ap-rise">
      <li><strong>Generalization</strong> - handles new unseen examples (Apprentice A)</li>
      <li><strong>Overfitting</strong> - memorizes training data, fails on new data (Apprentice B)</li>
      <li><strong>Test data</strong> - fresh examples kept apart from training</li>
    </ul>`;
}

function renderMatch4() {
  const matched = labState.aiMatches || {};
  return `
    <div class="ap-match-scene">
      <div class="ap-apps">
        ${APP_MATCHES.map((a) => `
          <div class="ap-app-slot ${matched[a.app] ? "is-matched" : ""}" data-app="${a.app}">
            <span class="ap-app-icon">${a.icon}</span>
            <strong>${a.label}</strong>
            ${matched[a.app] ? `<small>← ${DATA_TRAY.find((d) => d.id === a.data)?.text || ""}</small>` : ""}
          </div>`).join("")}
      </div>
      <div class="ap-tray">
        ${DATA_TRAY.filter((d) => !Object.values(matched).includes(d.id)).map((d) =>
          `<div class="ap-tray-chip" draggable="true" data-data="${d.id}">${d.text}</div>`,
        ).join("")}
      </div>
    </div>`;
}

function renderMontage4() {
  return `
    <div class="ap-montage">
      <div class="ap-montage-card ap-montage-card--good ap-rise">✓ Spam filter catches junk</div>
      <div class="ap-montage-card ap-montage-card--bad ap-rise" style="animation-delay:.06s">✗ Recommendation misses your taste</div>
    </div>
    <p class="ap-caption">Useful - but only as good as the examples it learned from.</p>`;
}

function renderTerms4() {
  return `
    <ul class="ap-term-list ap-term-list--summary ap-rise">
      <li>AI → broad goal · ML → patterns from data</li>
      <li>Training data → Model → Prediction → Training loop</li>
      <li>Generalization (good) vs Overfitting (bad) → test data</li>
      <li class="ap-term-note"><em>Next: what's inside the Apprentice's head - neural networks?</em></li>
    </ul>`;
}

function renderClose(u) {
  const t = Math.min(1, u || 0);
  return `
    <div class="ap-close" style="--ap-close:${t}">
      <div class="ap-phone ap-float">
        <img class="ap-phone-frame" src="${U}/ui-phone.png" alt="" />
        <div class="ap-tag is-correct">Dog ✓</div>
      </div>
      <div class="ap-journey" style="opacity:${t}">
        <span>Examples flash by</span><span>Confidence climbs</span><span>Tested on new data ✓</span>
      </div>
    </div>`;
}

function renderStage(mode) {
  switch (mode) {
    case "open": return renderOpen();
    case "rules1": return renderRules1();
    case "split1": return renderSplit1();
    case "terms1": return renderTerms1();
    case "train2": return renderTrain2();
    case "graph2": return renderGraph2();
    case "terms2": return renderTerms2();
    case "test3": return renderTest3();
    case "exam3": return renderExam3();
    case "terms3": return renderTerms3();
    case "match4": return renderMatch4();
    case "montage4": return renderMontage4();
    case "terms4": return renderTerms4();
    case "close": return renderClose(labState.aiCloseU);
    default: return renderOpen();
  }
}

function bindRules1(root, onChange) {
  if ((labState.aiRulePhase || "pick") !== "apprentice") {
    root.querySelectorAll("[data-rule]").forEach((btn) => {
      track(btn, "click", () => {
        labState.aiRulePhase = "fail";
        labState.aiRulePatches = 0;
        pulseFailFeedback(280);
        syncApprentice("rules1", { onChange });
        onChange?.();
      });
    });
    track(root.querySelector("#ap-patch"), "click", () => {
      labState.aiRulePatches = (labState.aiRulePatches || 0) + 1;
      if (labState.aiRulePatches >= 2) labState.aiRulesFailed = true;
      pulseFailFeedback(220);
      syncApprentice("rules1", { onChange });
      onChange?.();
    });
    track(root.querySelector("#ap-to-apprentice"), "click", () => {
      labState.aiRulePhase = "apprentice";
      pulseSuccessFeedback(200);
      syncApprentice("rules1", { onChange });
      onChange?.();
    });
    return;
  }
  root.querySelectorAll("[data-feed]").forEach((chip) => {
    track(chip, "dragstart", (e) => e.dataTransfer.setData("text/feed", "stack"));
    track(chip, "click", () => {
      if ((labState.aiExamplesFed || 0) < 5) {
        labState.aiExamplesFed = (labState.aiExamplesFed || 0) + 1;
        pulseSuccessFeedback(160);
        syncApprentice("rules1", { onChange });
        onChange?.();
      }
    });
  });
  const zone = root.querySelector("#ap-feed-zone");
  if (zone) {
    track(zone, "dragover", (e) => e.preventDefault());
    track(zone, "drop", (e) => {
      e.preventDefault();
      if ((labState.aiExamplesFed || 0) < 5) {
        labState.aiExamplesFed = (labState.aiExamplesFed || 0) + 1;
        pulseSuccessFeedback(160);
        syncApprentice("rules1", { onChange });
        onChange?.();
      }
    });
  }
  root.querySelectorAll("[data-test]").forEach((btn) => {
    track(btn, "click", () => {
      labState.aiApprenticeTrained = true;
      pulseSuccessFeedback(260);
      syncApprentice("rules1", { onChange });
      onChange?.();
    });
  });
}

function bindTrain2(root, onChange) {
  const doGuess = (g) => {
    labState.aiLastGuess = g;
    labState.aiRoundRevealed = true;
    const photo = TRAINING_PHOTOS[labState.aiTrainingRound || 0];
    if (g === photo?.answer) {
      labState.aiConfidence = Math.min(1, (labState.aiConfidence || 0.2) + 0.15);
      pulseSuccessFeedback(200);
    } else {
      labState.aiConfidence = Math.min(1, (labState.aiConfidence || 0.2) + 0.08);
      pulseFailFeedback(180);
    }
    syncApprentice("train2", { onChange });
    onChange?.();
  };
  track(root.querySelector("#ap-guess-cat"), "click", () => doGuess("Cat"));
  track(root.querySelector("#ap-guess-dog"), "click", () => doGuess("Dog"));
  track(root.querySelector("#ap-next-round"), "click", () => {
    labState.aiTrainingRound = (labState.aiTrainingRound || 0) + 1;
    labState.aiRoundRevealed = false;
    labState.aiLastGuess = "";
    if (labState.aiTrainingRound >= 5) labState.aiTrainingDone = true;
    syncApprentice("train2", { onChange });
    onChange?.();
  });
}

function bindTest3(root, onChange) {
  track(root.querySelector("#ap-run-test"), "click", () => {
    labState.aiTestDone = true;
    pulseSuccessFeedback(240);
    syncApprentice("test3", { onChange });
    onChange?.();
  });
  track(root.querySelector("#ap-peek"), "click", () => {
    labState.aiPeekInside = true;
    pulseSuccessFeedback(180);
    syncApprentice("test3", { onChange });
    onChange?.();
  });
}

function bindMatch4(root, onChange) {
  root.querySelectorAll("[data-data]").forEach((chip) => {
    track(chip, "dragstart", (e) => e.dataTransfer.setData("text/data", chip.dataset.data));
    track(chip, "click", () => {
      const dataId = chip.dataset.data;
      const target = APP_MATCHES.find((a) => a.data === dataId && !(labState.aiMatches || {})[a.app]);
      if (target) {
        labState.aiMatches = { ...(labState.aiMatches || {}), [target.app]: dataId };
        pulseSuccessFeedback(200);
        syncApprentice("match4", { onChange });
        onChange?.();
      }
    });
  });
  root.querySelectorAll("[data-app]").forEach((slot) => {
    track(slot, "dragover", (e) => e.preventDefault());
    track(slot, "drop", (e) => {
      e.preventDefault();
      const dataId = e.dataTransfer.getData("text/data");
      const app = slot.dataset.app;
      const expected = APP_MATCHES.find((a) => a.app === app);
      if (expected?.data === dataId) {
        labState.aiMatches = { ...(labState.aiMatches || {}), [app]: dataId };
        pulseSuccessFeedback(200);
        syncApprentice("match4", { onChange });
        onChange?.();
      } else {
        pulseFailFeedback(280);
      }
    });
  });
}

function bindOpen(root, onChange) {
  track(root.querySelector("#ap-enroll"), "click", () => {
    labState.aiOpenReady = true;
    pulseSuccessFeedback(220);
    syncApprentice("open", { onChange });
    onChange?.();
    advanceGate();
  });
}

function bindInteractions(root, onChange) {
  clearLiveHandlers();
  const mode = labState.aiMode;
  if (mode === "open") bindOpen(root, onChange);
  if (mode === "rules1") bindRules1(root, onChange);
  if (mode === "train2") bindTrain2(root, onChange);
  if (mode === "test3") bindTest3(root, onChange);
  if (mode === "match4") bindMatch4(root, onChange);
}

const BANNERS = {
  open: "A photo tagged Dog instantly - no rule for every angle.",
  rules1: "Rulebook Employee vs blank-slate Apprentice.",
  split1: "Rules vs learned patterns - the philosophical split.",
  terms1: "Programming · AI · Machine learning.",
  train2: "Guess → reveal → adjust - five training rounds.",
  graph2: "Accuracy climbs over many rounds.",
  terms2: "Training data · Model · Prediction · Training.",
  test3: "Both scored 100% in training - only one generalizes.",
  exam3: "Pattern understanding vs memorized answers.",
  terms3: "Generalization · Overfitting · Test data.",
  match4: "Match each app to its training data.",
  montage4: "Powerful - but not infallible.",
  terms4: "Full vocabulary - apprentice understood.",
  close: "Behind one instant tag: a well-trained apprentice.",
};

export function mountApprentice(viewport, onChange) {
  if (!viewport) return () => {};
  unmountApprentice(viewport);

  const root = document.createElement("div");
  root.id = ROOT_ID;
  root.className = "apprentice-root";
  root.innerHTML = `<p class="ap-banner" id="ap-banner"></p><div class="ap-stage" id="ap-stage"></div>`;
  viewport.appendChild(root);
  viewport.classList.add("viewport--apprentice");

  syncApprentice(labState.aiMode || "open", { onChange });
  return () => unmountApprentice(viewport);
}

export function syncApprentice(mode, opts = {}) {
  labState.aiMode = mode || labState.aiMode || "open";
  const root = document.getElementById(ROOT_ID);
  if (!root) return;

  const renderKey = [
    labState.aiMode,
    labState.aiRulePhase,
    labState.aiRulePatches,
    labState.aiRulesFailed ? 1 : 0,
    labState.aiExamplesFed,
    labState.aiApprenticeTrained ? 1 : 0,
    labState.aiTrainingRound,
    labState.aiRoundRevealed ? 1 : 0,
    labState.aiLastGuess,
    Math.round((labState.aiConfidence || 0) * 20),
    labState.aiTrainingDone ? 1 : 0,
    labState.aiTestDone ? 1 : 0,
    labState.aiPeekInside ? 1 : 0,
    JSON.stringify(labState.aiMatches || {}),
    Math.floor((labState.aiCloseU || 0) * 20),
    labState.aiOpenReady ? 1 : 0,
  ].join("|");

  const stage = root.querySelector("#ap-stage");
  const banner = root.querySelector("#ap-banner");

  if (stage && renderKey !== lastRenderKey) {
    stage.innerHTML = renderStage(labState.aiMode);
    lastRenderKey = renderKey;
    bindInteractions(root, opts.onChange);
    if (labState.aiMode === "open" && !labState.aiOpenReady) {
      setTimeout(() => {
        if (!labState.aiOpenReady) {
          labState.aiOpenReady = true;
          opts.onChange?.();
          syncApprentice("open", opts);
        }
      }, 4000);
    }
  } else if (labState.aiMode === "close" && stage) {
    stage.style.setProperty("--ap-close", String(labState.aiCloseU || 0));
  }

  if (banner) banner.textContent = opts.banner || BANNERS[labState.aiMode] || "";
}

export function unmountApprentice(viewport) {
  lastRenderKey = "";
  clearLiveHandlers();
  document.getElementById(ROOT_ID)?.remove();
  viewport?.classList.remove("viewport--apprentice");
}
