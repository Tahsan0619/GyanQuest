/**
 * Mean & Mode - ice cream truck DOM overlay (Bruner spirals).
 */
import {
 labState,
 MEAN_SCOOPS,
 MEAN_FLAVORS,
 MEAN_OUTLIER,
 pulseFailFeedback,
 pulseSuccessFeedback,
} from "./lab-state.js?v=mean3";

const ROOT_ID = "mean-root";
let lastRenderKey = "";
let liveHandlers = [];

function advanceGate() {
 window.__gqSignalGateReady?.({ forceAdvance: true });
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

function setCanvasOverlayMode(viewport, on) {
 const canvas = viewport?.querySelector?.("#c3d") || document.getElementById("c3d");
 if (!canvas) return;
 if (on) {
  canvas.style.pointerEvents = "none";
  canvas.style.opacity = "0";
 } else {
  canvas.style.pointerEvents = "";
  canvas.style.opacity = "";
 }
}

function scoopsHtml(n, big = false, flavor = null) {
 const count = Math.max(0, Math.round(Number(n) || 0));
 const show = Math.min(count, big ? 12 : 8);
 const cls =
  flavor === "Vanilla" ? "mm-scoop-ball--v" : flavor === "Chocolate" ? "mm-scoop-ball--c" : flavor === "Strawberry" ? "mm-scoop-ball--s" : "";
 const dots = Array.from({ length: show }, (_, i) => `<span class="mm-scoop-ball ${cls}" style="--i:${i}"></span>`).join("");
 const more = count > show ? `<span class="mm-more">+${count - show}</span>` : "";
 return `<div class="mm-scoops ${big ? "mm-scoops--big" : ""}">${dots}${more}</div>`;
}

function kidRow(cups, opts = {}) {
 const { flavors = null, labels = true, pooling = false, sharing = false } = opts;
 return `
 <div class="mm-line ${pooling ? "is-pooling" : ""} ${sharing ? "is-sharing" : ""}">
  ${cups
   .map((c, i) => {
    const flav = flavors?.[i];
    return `<div class="mm-kid" data-i="${i}" style="--ki:${i}">
   <div class="mm-face-disc" aria-hidden="true"></div>
   ${flav ? `<div class="mm-cone">${scoopsHtml(1, false, flav)}</div>` : scoopsHtml(c)}
   ${labels ? `<span class="mm-count">${flav || c}</span>` : ""}
  </div>`;
   })
   .join("")}
 </div>`;
}

function workflow(steps, activeIdx) {
 return `<div class="mm-workflow">${steps
  .map((s, i) => `<span class="mm-wf-step ${i === activeIdx ? "is-on" : ""}">${s}</span>`)
  .join("")}</div>`;
}

function renderOpen() {
 const ready = labState.meanOpenReady;
 return `
 <div class="mm-open">
  ${workflow(["Line", "Typical?", "Mean", "Mode", "Choose"], 0)}
  <div class="mm-truck-block" aria-hidden="true"></div>
  ${kidRow(MEAN_SCOOPS)}
  <p class="mm-caption">${
   ready
    ? "Same line, two honest answers coming up."
    : "Scoops: 2, 3, 2, 5, 2, 3, 4 - how many does a kid typically get?"
  }</p>
  ${ready ? "" : `<button type="button" class="btn primary mm-pulse" id="mm-meet">Meet the Line →</button>`}
 </div>`;
}

function renderPick1() {
 const vals = MEAN_SCOOPS;
 const picked = labState.meanPickVal;
 return `
 <div class="mm-pick">
  <p class="mm-banner">Pick the single dot that feels most "typical."</p>
  <div class="mm-numberline" role="list">
   ${[0, 1, 2, 3, 4, 5, 6]
    .map(
     (n) => `<div class="mm-tick" style="--n:${n}"><span>${n}</span></div>`,
    )
    .join("")}
   ${vals
    .map((v, i) => {
     const countAt = vals.filter((x) => x === v).length;
     const stack = vals.slice(0, i).filter((x) => x === v).length;
     return `<button type="button" class="mm-dot ${picked === v ? "is-picked" : ""}" data-val="${v}" style="--v:${v};--stack:${stack};--count:${countAt}" aria-label="Scoop count ${v}"></button>`;
    })
    .join("")}
  </div>
  ${
   labState.meanPickDone
    ? `<p class="mm-note mm-note--ok">Reasonable pick - but someone else might've picked differently, for an equally good reason.</p>
       <p class="mm-caption">7 different values. No single one of them is obviously "the" answer.</p>`
    : `<p class="mm-hint">Tap one of the dots on the number line.</p>`
  }
 </div>`;
}

function renderTwin1() {
 return `
 <div class="mm-twin">
  <p class="mm-banner">Two different, equally reasonable ways to summarize the exact same 7 numbers.</p>
  <div class="mm-twin-row">
   <div class="mm-panel">
    <div class="mm-mini-line">
     ${MEAN_SCOOPS.map((v) => `<span class="mm-mini-dot" style="--v:${v}"></span>`).join("")}
     <span class="mm-marker mm-marker--mean" style="--v:3"></span>
    </div>
    <p>Balanced middle (quantity shared evenly)</p>
   </div>
   <div class="mm-panel">
    <div class="mm-mini-line">
     ${MEAN_SCOOPS.map((v) => `<span class="mm-mini-dot" style="--v:${v}"></span>`).join("")}
     <span class="mm-marker mm-marker--mode" style="--v:2"></span>
    </div>
    <p>Most repeated value</p>
   </div>
  </div>
 </div>`;
}

function renderTerms1() {
 return `
 <div class="mm-terms">
  <dl class="mm-def-list">
   <dt>Data</dt>
   <dd>A collected set of values (here, 7 kids' scoop counts).</dd>
   <dt>Central tendency</dt>
   <dd>A single value used to represent or summarize an entire set of data.</dd>
  </dl>
  <p class="mm-note mm-note--ok">Mean and mode are two different, well-established ways of measuring central tendency - neither one is "more correct" than the other.</p>
 </div>`;
}

function flavorChip(f) {
 const cls = f === "Vanilla" ? "mm-scoop-ball--v" : f === "Chocolate" ? "mm-scoop-ball--c" : "mm-scoop-ball--s";
 return `<span class="mm-scoop-ball ${cls}"></span> ${f}`;
}

function renderShare2() {
 const cups = labState.meanCups || [...MEAN_SCOOPS];
 const done = labState.meanShareDone;
 const selected = labState.meanPickCup;
 return `
 <div class="mm-share">
  ${workflow(["Pool", "Move scoops", "Even share = mean"], done ? 2 : 1)}
  <p class="mm-banner">Share it out evenly - move scoops until every cup matches.</p>
  <div class="mm-cup-row ${done ? "is-sharing" : ""}">
   ${cups
    .map(
     (c, i) => `<button type="button" class="mm-cup ${selected === i ? "is-selected" : ""} ${done ? "is-level" : ""}" data-cup="${i}" style="--ki:${i}">
    <div class="mm-face-disc" aria-hidden="true"></div>
    ${scoopsHtml(c)}
    <strong>${Number.isInteger(c) ? c : c.toFixed(1)}</strong>
   </button>`,
    )
    .join("")}
  </div>
  ${
   done
    ? `<p class="mm-note mm-note--ok">21 total scoops, shared evenly across 7 kids: 3 each.</p>`
    : `<p class="mm-hint">Tap a fuller cup, then an emptier one - or Balance all.</p>
       <div class="mm-actions">
        <button type="button" class="btn secondary" id="mm-level-one">Level one scoop →</button>
        <button type="button" class="btn primary" id="mm-auto-balance">Balance all →</button>
       </div>`
  }
 </div>`;
}

function renderBeam2() {
 return `
 <div class="mm-beam-scene">
  ${workflow(["Weights", "Balance point", "Mean = 3"], 2)}
  <p class="mm-banner">The mean is where the values balance.</p>
  <div class="mm-beam">
   <div class="mm-beam-plank"></div>
   <div class="mm-beam-pivot"></div>
   ${MEAN_SCOOPS.map((v, i) => `<span class="mm-weight" style="left:${(v / 6) * 90 + 5}%;animation-delay:${i * 0.05}s">${v}</span>`).join("")}
  </div>
  <p class="mm-caption">Like weights on a beam - the balance point is the mean.</p>
 </div>`;
}

function renderFormula2() {
 return `
 <div class="mm-terms">
  ${workflow(["Sum", "Divide", "Mean"], 2)}
  <div class="mm-formula-box">
   <p class="mm-banner">Mean = sum ÷ count</p>
   <p class="mm-formula">${[2, 3, 2, 5, 2, 3, 4].map((n, i) => `<span class="mm-sum-piece" style="--i:${i}">${n}</span>`).join(" + ")} ÷ 7 = <strong>3</strong></p>
  </div>
  <p class="mm-caption">The formula describes what you already did by hand.</p>
 </div>`;
}

function renderFlavors3() {
 const placed = labState.meanFlavorPlaced || {};
 const fail = labState.meanFlavorFail;
 const done = labState.meanFlavorDone;
 const left = MEAN_FLAVORS.map((f, i) => ({ f, i })).filter((x) => !placed[x.i]);
 const counts = { Chocolate: 0, Vanilla: 0, Strawberry: 0 };
 Object.values(placed).forEach((f) => {
  if (counts[f] != null) counts[f] += 1;
 });
 return `
 <div class="mm-flavors">
  ${workflow(["Try mean?", "Fail", "Tally = mode"], done ? 2 : fail ? 1 : 0)}
  <p class="mm-banner">${fail ? "Tally the votes instead." : "Try to average the flavors…"}</p>
  ${kidRow(MEAN_SCOOPS, { flavors: MEAN_FLAVORS })}
  ${
   !fail
    ? `<button type="button" class="btn primary mm-pulse" id="mm-try-mean">Calculate the mean flavor →</button>
       <p class="mm-hint">There's no add button that can combine Chocolate and Vanilla into a number.</p>`
    : `<p class="mm-note mm-note--warn">You can't add up flavors. The mean doesn't work here.</p>
       ${
        done
         ? `<p class="mm-note mm-note--ok">Chocolate wins frequency - that is the mode.</p>
            <div class="mm-chart">${["Chocolate", "Vanilla", "Strawberry"]
             .map(
              (f, bi) => `<div class="mm-bar-col"><div class="mm-bar-track"><div class="mm-bar-fill ${f === "Chocolate" ? "is-mode" : ""}" style="--h:${(counts[f] / 4) * 100}%;--bi:${bi}"></div></div><span>${f}</span><strong>${counts[f]}</strong></div>`,
             )
             .join("")}</div>`
         : `<div class="mm-tally">
             ${["Chocolate", "Vanilla", "Strawberry"]
              .map(
               (f) => `<button type="button" class="mm-col" data-bin="${f}"><strong>${flavorChip(f)}</strong><span>${counts[f]}</span></button>`,
              )
              .join("")}
            </div>
            <div class="mm-tray">${left
             .map(
              (x) =>
               `<button type="button" class="mm-card ${labState.meanFlavorSelected === x.i ? "is-selected" : ""}" data-cone="${x.i}">${flavorChip(x.f)}</button>`,
             )
             .join("")}</div>
            <p class="mm-hint">Tap a cone, then its tally column - or dump all at once.</p>
            <button type="button" class="btn secondary" id="mm-tally-all">Tally all →</button>`
       }`
  }
 </div>`;
}

function renderBars3() {
 return `
 <div class="mm-bars">
  ${workflow(["Count", "Tallest bar", "Mode"], 2)}
  <p class="mm-banner">The tallest bar. The most frequent value. That's the mode.</p>
  <div class="mm-chart">
   <div class="mm-bar-col"><div class="mm-bar-track"><div class="mm-bar-fill is-mode" style="--h:100%;--bi:0"></div></div><span>Chocolate</span><strong>4</strong></div>
   <div class="mm-bar-col"><div class="mm-bar-track"><div class="mm-bar-fill" style="--h:50%;--bi:1"></div></div><span>Vanilla</span><strong>2</strong></div>
   <div class="mm-bar-col"><div class="mm-bar-track"><div class="mm-bar-fill" style="--h:25%;--bi:2"></div></div><span>Strawberry</span><strong>1</strong></div>
  </div>
 </div>`;
}

function renderTerms3() {
 return `
 <div class="mm-terms">
  <dl class="mm-def-list">
   <dt>Mode</dt>
   <dd>The value that appears most frequently in a data set.</dd>
  </dl>
  <p class="mm-note mm-note--ok">A data set can have one mode, more than one (a tie), or no mode at all if every value appears equally often.</p>
 </div>`;
}

function renderOutlier4() {
 const cups = labState.meanOutCups || [...MEAN_OUTLIER];
 const shareDone = labState.meanOutShareDone;
 const tallyDone = labState.meanOutTallyDone;
 const done = labState.meanOutDone;
 const tally = labState.meanOutTally || {};
 return `
 <div class="mm-outlier">
  <p class="mm-banner">Same tools, one wild cup of 20 scoops.</p>
  <div class="mm-cup-row">
   ${cups
    .map(
     (c, i) => `<div class="mm-cup ${c >= 10 ? "is-outlier" : ""} ${shareDone ? "is-level" : ""}">
    <div class="mm-face">🧒</div>
    ${scoopsHtml(c, true)}
    <strong>${typeof c === "number" && !Number.isInteger(c) ? c.toFixed(1) : c}</strong>
   </div>`,
    )
    .join("")}
  </div>
  ${
   !shareDone
    ? `<p class="mm-hint">First: share every scoop evenly (like Spiral 2).</p>
       <button type="button" class="btn primary" id="mm-out-share">Share evenly →</button>`
    : !tallyDone
      ? `<p class="mm-note mm-note--warn">Mean ≈ 5.3 - dragged up by one unusual cup. Now tally which count shows up most.</p>
         <div class="mm-tally">
          ${[2, 3, 20]
           .map((v) => {
            const n = tally[v] || 0;
            return `<button type="button" class="mm-col" data-out-val="${v}"><strong>${v}</strong><div class="mm-stack">${"▮".repeat(n)}</div><span>${n}</span></button>`;
           })
           .join("")}
         </div>
         <button type="button" class="btn secondary" id="mm-out-tally-all">Tally all values →</button>`
      : `<p class="mm-note mm-note--ok">Mean: about 5.3 - skewed upward by one unusual cup. Mode: 2 - what most kids actually got.</p>`
  }
 </div>`;
}

function renderCompare4() {
 return `
 <div class="mm-compare">
  <p class="mm-banner">One extreme value can drag the mean far from where most of the data sits. The mode doesn't budge.</p>
  <div class="mm-numberline mm-numberline--wide">
   ${[0, 5, 10, 15, 20]
    .map((n) => `<div class="mm-tick" style="--n:${n / 20}"><span>${n}</span></div>`)
    .join("")}
   ${MEAN_OUTLIER.map((v) => `<span class="mm-dot-static" style="--v:${v / 20}"></span>`).join("")}
   <span class="mm-marker mm-marker--mean" style="--v:${5.333 / 20}">mean ≈5.3</span>
   <span class="mm-marker mm-marker--mode" style="--v:${2 / 20}">mode 2</span>
  </div>
 </div>`;
}

function renderTerms4() {
 return `
 <div class="mm-terms">
  <dl class="mm-def-list">
   <dt>Mean - best for</dt>
   <dd>Numeric data without extreme outliers, when you want a value reflecting the overall total shared evenly.</dd>
   <dt>Mode - best for</dt>
   <dd>Categorical data (flavors, colors, choices), or highlighting the single most common value, even alongside outliers.</dd>
  </dl>
  <p class="mm-note mm-note--ok">Bonus: a third tool, the median - the middle value when data is lined up in order - is often used specifically to handle outliers better than the mean. A great next thing to explore.</p>
 </div>`;
}

function renderClose() {
 return `
 <div class="mm-close">
  <div class="mm-truck">🚚🍨</div>
  ${kidRow(MEAN_SCOOPS)}
  <div class="mm-both">
   <div class="mm-answer"><strong>Mean: 3 scoops</strong><span>fair, evenly shared total</span></div>
   <div class="mm-answer mm-answer--mode"><strong>Mode: 2 scoops</strong><span>most common individual value</span></div>
  </div>
  <p class="mm-caption">Knowing which question you're actually asking is most of what statistics really is.</p>
 </div>`;
}

const BANNERS = {
 open: "Ice cream truck · the line",
 pick1: "What's typical?",
 twin1: "Two honest summaries",
 terms1: "Central tendency",
 share2: "Share it out evenly",
 beam2: "Balance point",
 formula2: "Mean formula",
 flavors3: "What's most popular?",
 bars3: "Tallest bar",
 terms3: "Mode",
 outlier4: "Same data, different story",
 compare4: "Mean vs mode on a line",
 terms4: "When to use which",
 close: "The right number for the right question",
};

function renderStage(mode) {
 switch (mode) {
  case "open":
   return renderOpen();
  case "pick1":
   return renderPick1();
  case "twin1":
   return renderTwin1();
  case "terms1":
   return renderTerms1();
  case "share2":
   return renderShare2();
  case "beam2":
   return renderBeam2();
  case "formula2":
   return renderFormula2();
  case "flavors3":
   return renderFlavors3();
  case "bars3":
   return renderBars3();
  case "terms3":
   return renderTerms3();
  case "outlier4":
   return renderOutlier4();
  case "compare4":
   return renderCompare4();
  case "terms4":
   return renderTerms4();
  case "close":
   return renderClose();
  default:
   return renderOpen();
 }
}

function cupsEqual(cups, target) {
 return cups.every((c) => Math.abs(c - target) < 0.01);
}

function levelOneScoop() {
 const cups = [...(labState.meanCups || MEAN_SCOOPS)];
 let maxI = 0;
 let minI = 0;
 for (let i = 1; i < cups.length; i++) {
  if (cups[i] > cups[maxI]) maxI = i;
  if (cups[i] < cups[minI]) minI = i;
 }
 if (cups[maxI] === cups[minI]) return cups;
 cups[maxI] -= 1;
 cups[minI] += 1;
 return cups;
}

function checkFlavorDone(onChange) {
 const placed = labState.meanFlavorPlaced || {};
 if (Object.keys(placed).length < MEAN_FLAVORS.length) return;
 const counts = { Chocolate: 0, Vanilla: 0, Strawberry: 0 };
 Object.values(placed).forEach((f) => {
  if (counts[f] != null) counts[f] += 1;
 });
 if (counts.Chocolate >= counts.Vanilla && counts.Chocolate >= counts.Strawberry) {
  labState.meanFlavorDone = true;
  pulseSuccessFeedback(280);
  advanceGate();
 }
 onChange?.();
}

function checkOutDone(onChange) {
 if (labState.meanOutShareDone && labState.meanOutTallyDone) {
  labState.meanOutDone = true;
  pulseSuccessFeedback(280);
  advanceGate();
 }
 onChange?.();
}

function bindInteractions(root, onChange) {
 clearLiveHandlers();
 const mode = labState.meanMode;

 if (mode === "open") {
  track(root.querySelector("#mm-meet"), "click", () => {
   labState.meanOpenReady = true;
   pulseSuccessFeedback(200);
   syncMean("open", { onChange });
   onChange?.();
   advanceGate();
  });
 }

 if (mode === "pick1") {
  root.querySelectorAll(".mm-dot").forEach((el) => {
   track(el, "click", () => {
    labState.meanPickVal = Number(el.dataset.val);
    labState.meanPickDone = true;
    pulseSuccessFeedback(200);
    syncMean("pick1", { onChange });
    onChange?.();
    advanceGate();
   });
  });
 }

 if (mode === "share2") {
  root.querySelectorAll("[data-cup]").forEach((el) => {
   track(el, "click", () => {
    if (labState.meanShareDone) return;
    const i = Number(el.dataset.cup);
    const cups = [...(labState.meanCups || MEAN_SCOOPS)];
    if (labState.meanPickCup == null) {
     labState.meanPickCup = i;
     syncMean("share2", { onChange });
     onChange?.();
     return;
    }
    const from = labState.meanPickCup;
    labState.meanPickCup = null;
    if (from === i || cups[from] <= 0) {
     syncMean("share2", { onChange });
     return;
    }
    cups[from] -= 1;
    cups[i] += 1;
    labState.meanCups = cups;
    if (cupsEqual(cups, 3)) {
     labState.meanShareDone = true;
     pulseSuccessFeedback(280);
     advanceGate();
    }
    syncMean("share2", { onChange });
    onChange?.();
   });
  });
  track(root.querySelector("#mm-level-one"), "click", () => {
   if (labState.meanShareDone) return;
   labState.meanCups = levelOneScoop();
   labState.meanPickCup = null;
   if (cupsEqual(labState.meanCups, 3)) {
    labState.meanShareDone = true;
    pulseSuccessFeedback(280);
    advanceGate();
   }
   syncMean("share2", { onChange });
   onChange?.();
  });
  track(root.querySelector("#mm-auto-balance"), "click", () => {
   labState.meanCups = MEAN_SCOOPS.map(() => 3);
   labState.meanShareDone = true;
   labState.meanPickCup = null;
   pulseSuccessFeedback(280);
   syncMean("share2", { onChange });
   onChange?.();
   advanceGate();
  });
 }

 if (mode === "flavors3") {
  track(root.querySelector("#mm-try-mean"), "click", () => {
   labState.meanFlavorFail = true;
   pulseFailFeedback(320);
   syncMean("flavors3", { onChange });
   onChange?.();
  });
  root.querySelectorAll("[data-cone]").forEach((el) => {
   track(el, "click", () => {
    labState.meanFlavorSelected = Number(el.dataset.cone);
    syncMean("flavors3", { onChange });
    onChange?.();
   });
  });
  root.querySelectorAll("[data-bin]").forEach((el) => {
   track(el, "click", () => {
    const bin = el.dataset.bin;
    const sel = labState.meanFlavorSelected;
    if (sel == null) return;
    const expected = MEAN_FLAVORS[sel];
    if (expected !== bin) {
     pulseFailFeedback(220);
     return;
    }
    labState.meanFlavorPlaced = { ...(labState.meanFlavorPlaced || {}), [sel]: bin };
    labState.meanFlavorSelected = null;
    pulseSuccessFeedback(140);
    syncMean("flavors3", { onChange });
    checkFlavorDone(onChange);
   });
  });
  track(root.querySelector("#mm-tally-all"), "click", () => {
   const placed = {};
   MEAN_FLAVORS.forEach((f, i) => {
    placed[i] = f;
   });
   labState.meanFlavorPlaced = placed;
   labState.meanFlavorSelected = null;
   syncMean("flavors3", { onChange });
   checkFlavorDone(onChange);
  });
 }

 if (mode === "outlier4") {
  track(root.querySelector("#mm-out-share"), "click", () => {
   const mean = 32 / 6;
   labState.meanOutCups = MEAN_OUTLIER.map(() => mean);
   labState.meanOutShareDone = true;
   pulseSuccessFeedback(200);
   syncMean("outlier4", { onChange });
   onChange?.();
  });
  track(root.querySelector("#mm-out-tally-all"), "click", () => {
   labState.meanOutTally = { 2: 3, 3: 2, 20: 1 };
   labState.meanOutTallyDone = true;
   syncMean("outlier4", { onChange });
   checkOutDone(onChange);
  });
  root.querySelectorAll("[data-out-val]").forEach((el) => {
   track(el, "click", () => {
    const v = Number(el.dataset.outVal);
    const need = MEAN_OUTLIER.filter((x) => x === v).length;
    const cur = { ...(labState.meanOutTally || {}) };
    cur[v] = Math.min(need, (cur[v] || 0) + 1);
    labState.meanOutTally = cur;
    const complete = [2, 3, 20].every((k) => (cur[k] || 0) >= MEAN_OUTLIER.filter((x) => x === k).length);
    if (complete) labState.meanOutTallyDone = true;
    pulseSuccessFeedback(140);
    syncMean("outlier4", { onChange });
    checkOutDone(onChange);
   });
  });
 }
}

export function mountMean(viewport, onChange) {
 if (!viewport) return () => {};
 unmountMean(viewport);
 const root = document.createElement("div");
 root.id = ROOT_ID;
 root.className = "mean-root";
 root.innerHTML = `<p class="mm-banner" id="mm-banner"></p><div class="mm-stage" id="mm-stage"></div>`;
 viewport.appendChild(root);
 viewport.classList.add("viewport--mean");
 setCanvasOverlayMode(viewport, true);
 syncMean(labState.meanMode || "open", { onChange });
 return () => unmountMean(viewport);
}

export function syncMean(mode, opts = {}) {
 labState.meanMode = mode || labState.meanMode || "open";
 const root = document.getElementById(ROOT_ID);
 if (!root) return;

 const renderKey = [
  labState.meanMode,
  labState.meanOpenReady ? 1 : 0,
  labState.meanPickDone ? 1 : 0,
  labState.meanPickVal ?? "",
  JSON.stringify(labState.meanCups || []),
  labState.meanShareDone ? 1 : 0,
  labState.meanPickCup ?? "",
  labState.meanFlavorFail ? 1 : 0,
  JSON.stringify(labState.meanFlavorPlaced || {}),
  labState.meanFlavorSelected ?? "",
  labState.meanFlavorDone ? 1 : 0,
  JSON.stringify(labState.meanOutCups || []),
  labState.meanOutShareDone ? 1 : 0,
  JSON.stringify(labState.meanOutTally || {}),
  labState.meanOutTallyDone ? 1 : 0,
  labState.meanOutDone ? 1 : 0,
  Math.floor((labState.meanCloseU || 0) * 20),
 ].join("|");

 const stage = root.querySelector("#mm-stage");
 const banner = root.querySelector("#mm-banner");

 if (stage && renderKey !== lastRenderKey) {
  stage.innerHTML = renderStage(labState.meanMode);
  lastRenderKey = renderKey;
  bindInteractions(root, opts.onChange);
 } else if (labState.meanMode === "close" && stage) {
  stage.style.setProperty("--mm-close", String(labState.meanCloseU || 0));
 }

 if (banner) banner.textContent = opts.banner || BANNERS[labState.meanMode] || "";
}

export function unmountMean(viewport) {
 lastRenderKey = "";
 clearLiveHandlers();
 document.getElementById(ROOT_ID)?.remove();
 viewport?.classList.remove("viewport--mean");
 setCanvasOverlayMode(viewport, false);
}
