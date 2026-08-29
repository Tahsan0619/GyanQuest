/**
 * Statistics & Probability - Mission 1: Mean & Mode
 * Script: Opening + 4 Bruner spirals (typical → mean → mode → choose) + recap.
 */
import { labState, LAB_ASSET_PATHS, resetMeanState, initMeanSub } from "./lab-state.js?v=mean3";
import { mountGate, mountSpiralMap, mountTapContinue, badgeHtml } from "./lab-activities.js?v=mean3";

export const L1_META = {
 objective:
  "By the end of this mission, you'll explain mean (even share / sum÷count) and mode (most frequent), and choose which fits the question.",
 bdHook:
  "Class mark lists, cricket run totals, shop price tags - notice the balance average vs the value that shows up most.",
 predict: {
  q: "Before we start - what mainly separates mean from mode?",
  options: [
   "They are always the same number",
   "Mean balances (sum÷count); mode is the value that appears most",
   "Only the biggest value in the list matters",
  ],
  ok: 1,
 },
 kidTitle: "Mean & Mode",
 theme: "finding the 'typical' number",
 emoji: "📊",
 rewardName: "Mean Scout",
 intro:
  "An ice cream truck, a line of kids, and one tricky question: how many scoops does a kid typically get? Mean and mode both answer honestly - but they answer different versions of the question.",
 everyday: ["Class mark lists", "Cricket run totals", "Shop price tags"],
 subTitles: [
  "Meet the Line",
  "Pick What's Typical",
  "Central Tendency",
  "Share It Out Evenly",
  "The Mean Formula",
  "Most Popular Flavor",
  "What Is the Mode?",
  "Outlier vs Most Common",
  "When to Use Which",
  "The Right Question",
 ],
};

export function runL1Sub(subIndex, api) {
 const { registerTryAgain } = api;
 initMeanSub(subIndex);
 const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => {
  api.overlay.innerHTML = "";
  resetMeanState();
  initMeanSub(subIndex);
  fn(api);
 });
 fn(api);
}

function n(text) {
 return `<p class="tiny-narration">${text}</p>`;
}

function s1({ overlay, setCoach, completeSub }) {
 setCoach("Tap Meet the Line - scoops 2, 3, 2, 5, 2, 3, 4.");
 const t0 = Date.now();
 mountGate(overlay, {
  scene: "meanOpen",
  badge: "Opening",
  title: "Mean & Mode: Finding the 'Typical' Number",
  pulse: true,
  autoAdvanceOnReady: true,
  ready: () => labState.meanOpenReady || Date.now() - t0 > 4500,
  readyText: "Today: two completely valid ways to answer 'what's typical.'",
  doneLabel: "Continue ▶",
  controlsHtml: `<p class="drag-hint">Or tap here:</p>
 <button type="button" class="btn secondary" id="gate-meet-line">Meet the Line →</button>`,
  bind: (host, { finish, signalGateReady: signal }) => {
   host.querySelector("#gate-meet-line")?.addEventListener("click", () => {
    labState.meanOpenReady = true;
    signal?.({ forceAdvance: true });
    finish();
   });
  },
  html: `${badgeHtml(LAB_ASSET_PATHS.m1, "mean")}
 ${n(
  "Somebody asks: so, how many scoops does a kid typically get from this truck? Look at that line - 2, 3, 2, 5, 2, 3, 4. There's no single obvious answer sitting right there. Today we learn two completely different, both completely valid ways to answer - and when to reach for each one.",
 )}`,
  onDone: completeSub,
 });
}

function s2({ overlay, setCoach, completeSub }) {
 setCoach("Tap one dot that feels most typical - there isn't only one right pick.");
 mountGate(overlay, {
  scene: "meanPick1",
  badge: "Spiral 1 · Enactive",
  title: "What's 'Typical'? Why We Need One Number",
  pulse: true,
  ready: () => labState.meanPickDone,
  readyText: "A pile of real data, and a genuine need for one fair number.",
  doneLabel: "Continue ▶",
  html: n(
   "Notice there wasn't a clearly wrong answer, and there wasn't an obviously perfect one either. That's exactly the problem statisticians run into constantly.",
  ),
  onDone: completeSub,
 });
}

function s3({ overlay, setCoach, completeSub }) {
 setCoach("See two markers, then name data and central tendency.");
 mountGate(overlay, {
  scene: "meanTwin1",
  badge: "Spiral 1 · Iconic",
  title: "Two Honest Summaries",
  ready: () => true,
  html: n(
   "Both markers are legitimate answers to 'what's typical here' - they're just answering slightly different versions of the question. One is about total quantity, shared out evenly. The other is about which value actually showed up the most.",
  ),
  onDone: () => {
   mountTapContinue(overlay, {
    scene: "meanTerms1",
    html: `<h3>Spiral 1 · Symbolic</h3>
 <p><strong>Data</strong> - a collected set of values (here, 7 kids' scoop counts).</p>
 <p><strong>Central tendency</strong> - a single value used to represent or summarize an entire set of data.</p>
 <p>Mean and mode are two different, well-established ways of measuring central tendency - neither one is "more correct" than the other.</p>`,
    onDone: completeSub,
   });
  },
 });
}

function s4({ overlay, setCoach, completeSub }) {
 setCoach("Move scoops until every cup has exactly 3 - that's the mean by hand.");
 mountGate(overlay, {
  scene: "meanShare2",
  badge: "Spiral 2 · Enactive",
  title: "Balance It Out: What Is the Mean?",
  pulse: true,
  ready: () => labState.meanShareDone,
  readyText: "21 scoops ÷ 7 kids = 3 each. You found the mean with your hands.",
  doneLabel: "Continue ▶",
  html: n(
   "You just found the mean without a single calculation - you physically redistributed every scoop until everyone had an identical, fair share. That perfectly balanced number, 3, is exactly what the mean actually represents.",
  ),
  onDone: completeSub,
 });
}

function s5({ overlay, setCoach, completeSub }) {
 setCoach("See the balance beam, then the formula that matches what you did.");
 mountGate(overlay, {
  scene: "meanBeam2",
  badge: "Spiral 2 · Iconic",
  title: "The Balance Point of the Data",
  ready: () => true,
  html: n(
   "This is a genuinely useful way to picture the mean forever afterward: it's not just a formula, it's the literal balance point of the data - the spot where the values above it and below it perfectly cancel out.",
  ),
  onDone: () => {
   mountTapContinue(overlay, {
    scene: "meanFormula2",
    html: `<h3>Spiral 2 · Symbolic</h3>
 <p><strong>Mean</strong> = (sum of all values) ÷ (number of values)</p>
 <p>(2 + 3 + 2 + 5 + 2 + 3 + 4) ÷ 7 = 21 ÷ 7 = <strong>3</strong></p>
 <p>The mean is what most people casually call "the average."</p>`,
    onDone: completeSub,
   });
  },
 });
}

function s6({ overlay, setCoach, completeSub }) {
 setCoach("Try to average flavors (it fails), then tally votes - Chocolate wins.");
 mountGate(overlay, {
  scene: "meanFlavors3",
  badge: "Spiral 3 · Enactive",
  title: "What's Most Popular? What Is the Mode?",
  pulse: true,
  ready: () => labState.meanFlavorDone,
  readyText: "Chocolate showed up most - that's a different kind of 'typical.'",
  doneLabel: "Continue ▶",
  html: n(
   "The mean just failed completely - not because you did anything wrong, but because 'average flavor' isn't a real thing. Counting which flavor showed up most often worked perfectly.",
  ),
  onDone: completeSub,
 });
}

function s7({ overlay, setCoach, completeSub }) {
 setCoach("See the tallest bar, then name the mode.");
 mountGate(overlay, {
  scene: "meanBars3",
  badge: "Spiral 3 · Iconic",
  title: "The Tallest Bar",
  ready: () => true,
  html: n(
   "Whenever you can turn a question into 'which bar is tallest,' you're looking for the mode - and unlike the mean, this same idea works just as well on numbers as it does on flavors, colors, or any other category you can count up.",
  ),
  onDone: () => {
   mountTapContinue(overlay, {
    scene: "meanTerms3",
    html: `<h3>Spiral 3 · Symbolic</h3>
 <p><strong>Mode</strong> - the value that appears most frequently in a data set.</p>
 <p>A data set can have one mode, more than one (a tie), or no mode at all if every value appears equally often.</p>`,
    onDone: completeSub,
   });
  },
 });
}

function s8({ overlay, setCoach, completeSub }) {
 setCoach("Share evenly (mean ≈5.3), then tally - mode is 2.");
 mountGate(overlay, {
  scene: "meanOutlier4",
  badge: "Spiral 4 · Enactive",
  title: "Same Data, Different Story",
  pulse: true,
  ready: () => labState.meanOutDone,
  readyText: "Neither number is wrong - they answer different questions.",
  doneLabel: "Continue ▶",
  html: n(
   "The mean got dragged upward by a single unusually large value. The mode ignored that outlier and correctly reported what most kids actually experienced.",
  ),
  onDone: completeSub,
 });
}

function s9({ overlay, setCoach, completeSub }) {
 setCoach("See mean pulled toward 20 while mode stays at 2 - then when to use which.");
 mountGate(overlay, {
  scene: "meanCompare4",
  badge: "Spiral 4 · Iconic",
  title: "Outlier Pulls the Mean",
  ready: () => true,
  html: n(
   "An average can be quietly distorted by even a single extreme value, while the mode stays anchored to whatever's actually most common. The right statistic depends entirely on the question and the data.",
  ),
  onDone: () => {
   mountTapContinue(overlay, {
    scene: "meanTerms4",
    html: `<h3>Spiral 4 · Symbolic</h3>
 <p><strong>Mean</strong> - best for numeric data without extreme outliers, when you want an evenly shared total.</p>
 <p><strong>Mode</strong> - best for categories, or the single most common value even alongside outliers.</p>
 <p><em>Bonus:</em> the median - the middle value in order - often handles outliers better than the mean. A great next thing to explore.</p>`,
    onDone: completeSub,
   });
  },
 });
}

function s10({ overlay, setCoach, completeSub }) {
 setCoach("Both answers on the original line - then replay any spiral.");
 const t0 = Date.now();
 mountGate(overlay, {
  scene: "meanClose",
  badge: "Closing",
  title: "The Right Number for the Right Question",
  ready: () => Date.now() - t0 > 2800,
  readyText: "Mean 3 · Mode 2 - both honestly true.",
  doneLabel: "Open recap map ▶",
  html: n(
   "That original question - 'how many scoops does a kid typically get?' - never actually had one single correct answer. It had two, both completely honest: 3 scoops for a fair shared total, and 2 scoops for what most kids individually walked away with.",
  ),
  onDone: () => {
   mountSpiralMap(overlay, {
    scene: "meanSpiral",
    badge: "Closing",
    title: "Your Mean & Mode map",
    narration: "Tap a spiral number to replay its key idea, then finish when ready.",
    finishLabel: "Finish Mean & Mode ▶",
    stops: [
     { n: 1, label: "1: Typical" },
     { n: 2, label: "2: Mean" },
     { n: 3, label: "3: Mode" },
     { n: 4, label: "4: Choose" },
    ],
    onDone: completeSub,
   });
  },
 });
}
