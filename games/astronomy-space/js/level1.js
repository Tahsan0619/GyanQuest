/**
 * Astronomy & Space - Mission 1: Solar Family
 * Script: Opening + 4 Bruner spirals (gravity → types → members → scale) + recap.
 */
import { labState, LAB_ASSET_PATHS, resetSolarState, initSolarSub } from "./lab-state.js?v=solar4";
import { mountGate, mountSpiralMap, mountTapContinue, badgeHtml } from "./lab-activities.js?v=solar4";

export const L1_META = {
 objective:
  "By the end of this mission, you'll explain orbits, gravity, terrestrial vs gas/ice giants, name the eight planets in order, and why Earth's place in the habitable zone matters.",
 bdHook:
  "Night sky planets, Mars news, Saturn photos - eight siblings of one star, held by the same gravity that keeps your feet on the ground.",
 predict: {
  q: "What keeps Earth from flying off into space or falling into the Sun?",
  options: [
   "A balance: the Sun's gravity pulls in while Earth's sideways motion carries it around",
   "Invisible ropes tying every planet to the Sun",
   "Planets don't move - the sky just looks that way",
  ],
  ok: 0,
 },
 kidTitle: "Solar Family",
 theme: "meet the Sun's eight children",
 emoji: "☀️",
 rewardName: "Solar Scout",
 intro:
  "The solar system is a family. The Sun is the parent; eight planets are its children - four rocky and close, four giant and far. Today you meet them properly, held together by gravity.",
 everyday: ["Night sky wanderers", "Mars rover news", "Saturn's rings"],
 subTitles: [
  "Meet the Family",
  "Find the Balance",
  "Gravity & Orbits",
  "Sort the Family",
  "Rocky vs Giants",
  "Family Portraits",
  "In Order from the Sun",
  "Walk the Scale",
  "Home & Exploration",
  "The Whole Family",
 ],
};

export function runL1Sub(subIndex, api) {
 const { registerTryAgain } = api;
 initSolarSub(subIndex);
 const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => {
  api.overlay.innerHTML = "";
  resetSolarState();
  initSolarSub(subIndex);
  fn(api);
 });
 fn(api);
}

function n(text) {
 return `<p class="tiny-narration">${text}</p>`;
}

function orbitReady() {
 const s = labState.solarOrbitSeen || {};
 return !!(s.slow && s.fast && s.orbit);
}

function s1_opening({ overlay, setCoach, completeSub }) {
 setCoach("Tap Meet the Family - eight faint worlds around one star.");
 const t0 = Date.now();
 mountGate(overlay, {
  scene: "solarOpen",
  badge: "Opening",
  title: "Solar Family: Meet the Sun's Eight Children",
  pulse: true,
  autoAdvanceOnReady: true,
  ready: () => labState.solarOpenReady || Date.now() - t0 > 4500,
  readyText: "Today we get the full family introduction.",
  doneLabel: "Continue ▶",
  controlsHtml: `<p class="drag-hint">Or tap here:</p>
 <button type="button" class="btn secondary" id="gate-meet-family">Meet the Family →</button>`,
  bind: (host, { finish, signalGateReady: signal }) => {
   host.querySelector("#gate-meet-family")?.addEventListener("click", () => {
    labState.solarOpenReady = true;
    signal?.({ forceAdvance: true });
    finish();
   });
  },
  html: `${badgeHtml(LAB_ASSET_PATHS.m1, "solar")}
 ${n(
  "You have seven siblings you've probably never properly met - poisonous clouds, ice rings, planet-flattening winds. They're all orbiting the same star you do. Welcome to the Solar Family.",
 )}`,
  onDone: completeSub,
 });
}

function s2_orbit({ overlay, setCoach, completeSub }) {
 setCoach("Release the planet too slow, too fast, then just right for a stable orbit.");
 mountGate(overlay, {
  scene: "solarOrbit1",
  badge: "Spiral 1 · Enactive",
  title: "One Big Family, Held Together by Gravity",
  pulse: true,
  ready: orbitReady,
  readyText: "Orbit = gravity pulling in + sideways motion carrying past.",
  doneLabel: "Continue ▶",
  html: n(
   "An orbit isn't resisting gravity or gravity failing - it's a balanced disagreement. Gravity pulls in; sideways motion carries past. Neither wins. That standoff is the orbit.",
  ),
  onDone: completeSub,
 });
}

function s3_diagram({ overlay, setCoach, completeSub }) {
 setCoach("See the two arrows make a circle - then learn the formal words.");
 mountGate(overlay, {
  scene: "solarDiagram1",
  badge: "Spiral 1 · Iconic",
  title: "Pulled In, Moving Sideways",
  ready: () => true,
  html: n(
   "This is happening to all eight planets all the time - a permanent tug-of-war between falling in and flying off, resolved into a stable loop.",
  ),
  onDone: () => {
   mountTapContinue(overlay, {
    scene: "solarTerms1",
    html: `<h3>Spiral 1 · Symbolic</h3>
 <p><strong>Solar system</strong> - the Sun and everything orbiting it.</p>
 <p><strong>Gravity</strong> - the pull between masses; the Sun holds the family.</p>
 <p><strong>Orbit</strong> - the repeating path balanced between pull and sideways motion.</p>`,
    onDone: completeSub,
   });
  },
 });
}

function s4_sort({ overlay, setCoach, completeSub }) {
 setCoach("Sort all eight planets into Rocky & Small or Huge & Gassy.");
 mountGate(overlay, {
  scene: "solarSort2",
  badge: "Spiral 2 · Enactive",
  title: "The Rocky Siblings vs the Gas Giants",
  pulse: true,
  ready: () => labState.solarSortDone,
  readyText: "Four and four - the split lines up with distance from the Sun.",
  doneLabel: "Continue ▶",
  html: n(
   "The split isn't random - four and four, lined up with distance from the Sun. That's a fingerprint of how the family formed.",
  ),
  onDone: completeSub,
 });
}

function s5_size({ overlay, setCoach, completeSub }) {
 setCoach("See the size jump past the frost line - then name the planet types.");
 mountGate(overlay, {
  scene: "solarSize2",
  badge: "Spiral 2 · Iconic",
  title: "Close and Rocky · Far and Enormous",
  ready: () => true,
  html: n(
   "Near the Sun it was too hot for ice and gas to stay solid - only rock and metal built small worlds. Past the frost line, ice and gas built giants.",
  ),
  onDone: () => {
   mountTapContinue(overlay, {
    scene: "solarTerms2",
    html: `<h3>Spiral 2 · Symbolic</h3>
 <p><strong>Terrestrial</strong> - Mercury, Venus, Earth, Mars.</p>
 <p><strong>Gas giants</strong> - Jupiter, Saturn.</p>
 <p><strong>Ice giants</strong> - Uranus, Neptune.</p>`,
    onDone: completeSub,
   });
  },
 });
}

function s6_gallery({ overlay, setCoach, completeSub }) {
 setCoach("Click each of the eight planets to pin its family portrait.");
 mountGate(overlay, {
  scene: "solarGallery3",
  badge: "Spiral 3 · Enactive",
  title: "Meet the Family Members",
  pulse: true,
  ready: () => labState.solarGalleryDone,
  readyText: "Eight distinct worlds - not just names in order.",
  doneLabel: "Continue ▶",
  html: n(
   "Eight completely distinct personalities - each shaped by size, position, and history - not just slots in a memorized list.",
  ),
  onDone: completeSub,
 });
}

function s7_order({ overlay, setCoach, completeSub }) {
 setCoach("See them in true order with signature traits - then the formal lineup.");
 mountGate(overlay, {
  scene: "solarOrder3",
  badge: "Spiral 3 · Iconic",
  title: "In Order from the Sun",
  ready: () => true,
  html: n(
   "Laid out together, family resemblance and differences are obvious - small and varied close in, then a jump to giants, each still recognizable.",
  ),
  onDone: () => {
   mountTapContinue(overlay, {
    scene: "solarTerms3",
    html: `<h3>Spiral 3 · Symbolic</h3>
 <p><strong>Order:</strong> Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.</p>
 <p><em>Extended family:</em> asteroid belt (Mars-Jupiter); Kuiper Belt beyond Neptune (dwarf planets like Pluto).</p>`,
    onDone: completeSub,
   });
  },
 });
}

function s8_scale({ overlay, setCoach, completeSub }) {
 setCoach("Guess Earth's distance if the Sun were a basketball - then reveal.");
 mountGate(overlay, {
  scene: "solarScale4",
  badge: "Spiral 4 · Enactive",
  title: "Why Scale Actually Matters",
  pulse: true,
  ready: () => labState.solarScaleDone,
  readyText: "Space is mostly empty space.",
  doneLabel: "Continue ▶",
  html: n(
   "Almost everyone guesses too close. The solar system isn't a tidy bunched diagram - it's staggeringly empty between family members.",
  ),
  onDone: completeSub,
 });
}

function s9_explore({ overlay, setCoach, completeSub }) {
 setCoach("Exploration montage - then Earth's place in the habitable zone.");
 mountGate(overlay, {
  scene: "solarExplore4",
  badge: "Spiral 4 · Iconic",
  title: "We've Already Visited the Family",
  ready: () => true,
  html: n(
   "Humans have sent spacecraft to fly past, orbit, or land on nearly every planet - some even sail past Neptune into interstellar space.",
  ),
  onDone: () => {
   mountTapContinue(overlay, {
    scene: "solarTerms4",
    html: `<h3>Spiral 4 · Symbolic</h3>
 <p><strong>Habitable zone</strong> - distances where liquid water can exist.</p>
 <p>Earth sits right there. Next: what's beyond our own family of one star?</p>`,
    onDone: completeSub,
   });
  },
 });
}

function s10_closing({ overlay, setCoach, completeSub }) {
 setCoach("Watch the full labeled family portrait - then open the recap map.");
 const t0 = Date.now();
 mountGate(overlay, {
  scene: "solarClose",
  badge: "Closing",
  title: "The Whole Family, Together",
  html: n(
   "Those eight faint dots were never strangers - they're your family, held by the same gravity keeping your feet on the ground. That's the whole family. Welcome home.",
  ),
  ready: () => labState.solarCloseU >= 0.5 || Date.now() - t0 > 7000,
  readyText: "Eight worlds. One star. One shared family.",
  doneLabel: "Open the recap map ▶",
  onDone: () => {
   setCoach("Tap a spiral number to replay, then finish Solar Family.");
   mountSpiralMap(overlay, {
    scene: "solarSpiral",
    title: "Your recap map",
    finishLabel: "Finish Solar Family ▶",
    narration: "The four numbers are the four spirals you finished. Tap to replay, then finish when ready.",
    statusIdle: "Tap a number to replay, or finish now.",
    stops: [
     { n: 1, label: "1: Gravity" },
     { n: 2, label: "2: Types" },
     { n: 3, label: "3: Members" },
     { n: 4, label: "4: Scale" },
    ],
    onDone: completeSub,
   });
  },
 });
}

const s1 = s1_opening;
const s2 = s2_orbit;
const s3 = s3_diagram;
const s4 = s4_sort;
const s5 = s5_size;
const s6 = s6_gallery;
const s7 = s7_order;
const s8 = s8_scale;
const s9 = s9_explore;
const s10 = s10_closing;
