/**
 * Eco Guardian - Mission 1: Waste Watch
 * Script: Opening + 4 Bruner spirals (away/landfill → recycling → composting → full sort) + recap.
 */
import { labState, LAB_ASSET_PATHS, resetWasteState, initWasteSub } from "./lab-state.js?v=waste1";
import { mountGate, mountSpiralMap, mountTapContinue, badgeHtml } from "./lab-activities.js?v=waste1";

export const L1_META = {
 objective:
  "By the end of this mission, you'll explain waste, landfill, recycling, contamination, composting, and why sorting at the crossroads decides each item's journey.",
 bdHook:
  "Home bins, school canteens, city trucks - every piece of trash takes a real road: landfill, recycle loop, or compost.",
 predict: {
  q: "When the trash lid closes on a juice bottle, what actually happened?",
  options: [
   "It started a journey to a real place - usually a landfill unless sorted elsewhere",
   "It disappeared forever into nowhere called 'away'",
   "It instantly became new soil under the can",
  ],
  ok: 0,
 },
 kidTitle: "Waste Watch",
 theme: "every piece of trash takes a journey",
 emoji: "♻️",
 rewardName: "Waste Watcher",
 intro:
  "'Away' is not a place. Every discarded item travels one of three roads - landfill, recycling loop, or compost. Today you run the sorting station where that decision is made.",
 everyday: ["Juice bottle in a bin", "Greasy pizza box", "Banana peel", "Aluminum can"],
 subTitles: [
  "Open the Sorting Station",
  "Follow the Bottle",
  "Where Away Goes",
  "Sort into Recycling",
  "The Recycling Loop",
  "Sort into Compost",
  "Nature's Loop",
  "Full Sorting Station",
  "Why Sorting Matters",
  "The Journey, Chosen Well",
 ],
};

export function runL1Sub(subIndex, api) {
 const { registerTryAgain } = api;
 initWasteSub(subIndex);
 const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => {
  api.overlay.innerHTML = "";
  resetWasteState();
  initWasteSub(subIndex);
  fn(api);
 });
 fn(api);
}

function n(text) {
 return `<p class="tiny-narration">${text}</p>`;
}

function s1_opening({ overlay, setCoach, completeSub }) {
 setCoach("Tap Open the Sorting Station - the bottle's journey is just beginning.");
 const t0 = Date.now();
 mountGate(overlay, {
  scene: "wasteOpen",
  badge: "Opening",
  title: "Waste Watch: Every Piece of Trash Takes a Journey",
  pulse: true,
  autoAdvanceOnReady: true,
  ready: () => labState.wasteOpenReady || Date.now() - t0 > 4500,
  readyText: "'Away' is never actually a place.",
  doneLabel: "Continue ▶",
  controlsHtml: `<p class="drag-hint">Or tap here:</p>
 <button type="button" class="btn secondary" id="gate-open-station">Open the Sorting Station →</button>`,
  bind: (host, { finish, signalGateReady: signal }) => {
   host.querySelector("#gate-open-station")?.addEventListener("click", () => {
    labState.wasteOpenReady = true;
    signal?.({ forceAdvance: true });
    finish();
   });
  },
  html: `${badgeHtml(LAB_ASSET_PATHS.m1, "waste")}
 ${n(
  "That bottle didn't disappear when the lid closed - 'away' is never actually a place. It started a journey down one of three very different roads. Today you're running the crossroads where that decision happens.",
 )}`,
  onDone: completeSub,
 });
}

function s2_follow({ overlay, setCoach, completeSub }) {
 setCoach("Tap Follow It - pipe, truck, landfill - then optional time-lapse.");
 mountGate(overlay, {
  scene: "wasteFollow1",
  badge: "Spiral 1 · Enactive",
  title: "Where Does 'Away' Actually Go?",
  pulse: true,
  ready: () => (labState.wasteFollowStep || 0) >= 3,
  readyText: "A landfill. A real place. Getting bigger every day.",
  doneLabel: "Continue ▶",
  html: n(
   "The trash can's lid closing wasn't the end - it was the start of a real trip to a real place that's still growing. Nothing about throwing something 'away' makes it stop existing.",
  ),
  onDone: completeSub,
 });
}

function s3_map({ overlay, setCoach, completeSub }) {
 setCoach("Watch the default road to the landfill mound - then name waste and landfill.");
 mountGate(overlay, {
  scene: "wasteMap1",
  badge: "Spiral 1 · Iconic",
  title: "One Road Out of the House",
  ready: () => true,
  html: n(
   "By default, this is the only road most waste travels - straight from a bin to a landfill. Necessary for some things - but a lot of what ends up here didn't need to be on this road at all.",
  ),
  onDone: () => {
   mountTapContinue(overlay, {
    scene: "wasteTerms1",
    html: `<h3>Spiral 1 · Symbolic</h3>
 <p><strong>Waste</strong> - any material discarded after its original use.</p>
 <p><strong>Landfill</strong> - a managed site where waste is buried; the default destination unless diverted.</p>`,
    onDone: completeSub,
   });
  },
 });
}

function s4_recycle({ overlay, setCoach, completeSub }) {
 setCoach("Sort six items into Recycle - grease and foam will be rejected.");
 mountGate(overlay, {
  scene: "wasteRecycle2",
  badge: "Spiral 2 · Enactive",
  title: "Give It New Life: Sort into Recycling",
  pulse: true,
  ready: () => labState.wasteRecycleDone,
  readyText: "Four got a second life. Contamination and material type matter.",
  doneLabel: "Continue ▶",
  html: n(
   "Sorting correctly isn't guessing - it's knowing what a material is and what condition it's in. Grease can ruin a whole batch; some foam simply isn't accepted.",
  ),
  onDone: completeSub,
 });
}

function s5_loop({ overlay, setCoach, completeSub }) {
 setCoach("Watch the can loop: melt → reshape → use → recycle again.");
 mountGate(overlay, {
  scene: "wasteLoop2",
  badge: "Spiral 2 · Iconic",
  title: "Not a Dead End - A Loop",
  ready: () => true,
  html: n(
   "Instead of a one-way trip to a landfill, that can entered a loop - broken down, rebuilt, used again, able to go around many more times.",
  ),
  onDone: () => {
   mountTapContinue(overlay, {
    scene: "wasteTerms2",
    html: `<h3>Spiral 2 · Symbolic</h3>
 <p><strong>Recycling</strong> - reprocessing materials into new products instead of discarding them.</p>
 <p><strong>Contamination</strong> - food, grease, or liquid residue that can ruin an entire recycling batch.</p>`,
    onDone: completeSub,
   });
  },
 });
}

function s6_compost({ overlay, setCoach, completeSub }) {
 setCoach("Sort organics into Compost, reject plastic/metal, then Fast-Forward.");
 mountGate(overlay, {
  scene: "wasteCompost3",
  badge: "Spiral 3 · Enactive",
  title: "Let Nature Recycle: Compost",
  pulse: true,
  ready: () => labState.wasteCompostDone,
  readyText: "Time, worms, and microbes - scraps become soil.",
  doneLabel: "Continue ▶",
  html: n(
   "Recycling needs a factory. Composting just needs nature - if organic scraps get the chance instead of being sealed in a landfill.",
  ),
  onDone: completeSub,
 });
}

function s7_nature({ overlay, setCoach, completeSub }) {
 setCoach("Food → compost → soil → plants → food - then name the terms.");
 mountGate(overlay, {
  scene: "wasteNature3",
  badge: "Spiral 3 · Iconic",
  title: "A Natural Loop",
  ready: () => true,
  html: n(
   "This loop has run as long as life on Earth. Composting doesn't invent anything new - it makes sure scraps rejoin that cycle instead of being buried where decomposition barely happens.",
  ),
  onDone: () => {
   mountTapContinue(overlay, {
    scene: "wasteTerms3",
    html: `<h3>Spiral 3 · Symbolic</h3>
 <p><strong>Compost</strong> · <strong>Decomposition</strong> · <strong>Organic waste</strong></p>
 <p>Recycling reprocesses mechanically. Composting lets biology do the same basic job.</p>`,
    onDone: completeSub,
   });
  },
 });
}

function s8_full({ overlay, setCoach, completeSub }) {
 setCoach("Sort all 10 mixed items into Landfill, Recycle, or Compost.");
 mountGate(overlay, {
  scene: "wasteFull4",
  badge: "Spiral 4 · Enactive",
  title: "Run the Full Sorting Station",
  pulse: true,
  ready: () => labState.wasteFullDone,
  readyText: "Every correct sort is one less unnecessary landfill trip.",
  doneLabel: "Continue ▶",
  html: n(
   "Real stations and households make dozens of these small decisions every day. None seem huge alone - but you just felt how much judgment each item needs.",
  ),
  onDone: completeSub,
 });
}

function s9_split({ overlay, setCoach, completeSub }) {
 setCoach("Compare poor vs good community sorting - then the full summary.");
 mountGate(overlay, {
  scene: "wasteSplit4",
  badge: "Spiral 4 · Iconic",
  title: "Same Waste, Different Outcomes",
  ready: () => true,
  html: n(
   "Zoom out to a whole community: this sorting decision, repeated by thousands of households, is the difference between a landfill filling too fast and useful material staying in circulation.",
  ),
  onDone: () => {
   mountTapContinue(overlay, {
    scene: "wasteTerms4",
    html: `<h3>Spiral 4 · Symbolic</h3>
 <ul class="ww-summary-list">
 <li><strong>Waste → Landfill</strong> · <strong>Recycling</strong> · <strong>Composting</strong></li>
 <li><em>Bonus:</em> Reduce, Reuse, Recycle - Reduce is most powerful.</li>
 <li><em>Next:</em> what does it take to reduce waste before it's created?</li>
 </ul>`,
    onDone: completeSub,
   });
  },
 });
}

function s10_closing({ overlay, setCoach, completeSub }) {
 setCoach("Watch the bottle choose the recycle loop - then open the recap map.");
 const t0 = Date.now();
 mountGate(overlay, {
  scene: "wasteClose",
  badge: "Closing",
  title: "The Journey, Chosen Well",
  html: n(
   "That bottle from the start didn't have only one road. It had three real options - and which one it took came down to a sorting decision like the ones you just practiced. 'Away' was never the end of the story.",
  ),
  ready: () => labState.wasteCloseU >= 0.5 || Date.now() - t0 > 7000,
  readyText: "Three roads. Sorting chooses the journey.",
  doneLabel: "Open the recap map ▶",
  onDone: () => {
   setCoach("Tap a spiral number to replay, then finish Waste Watch.");
   mountSpiralMap(overlay, {
    scene: "wasteSpiral",
    title: "Your recap map",
    finishLabel: "Finish Waste Watch ▶",
    narration:
     "The four numbers are the four spirals you finished. Tap a number to replay a highlight, then finish when ready.",
    statusIdle: "Tap a number to replay, or finish now.",
    stops: [
     { n: 1, label: "1: Away" },
     { n: 2, label: "2: Recycle" },
     { n: 3, label: "3: Compost" },
     { n: 4, label: "4: Sort" },
    ],
    onDone: completeSub,
   });
  },
 });
}

const s1 = s1_opening;
const s2 = s2_follow;
const s3 = s3_map;
const s4 = s4_recycle;
const s5 = s5_loop;
const s6 = s6_compost;
const s7 = s7_nature;
const s8 = s8_full;
const s9 = s9_split;
const s10 = s10_closing;
