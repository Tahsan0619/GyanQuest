/**
 * Math Quest shared lab state (Chem / Force pattern).
 */
export const labState = {
 heat: 0.12,
 heatTarget: 0.12,
 energy: 0.55,
 energyTarget: 0.55,
 phase: "desk",
 mode: "cat",
 myth: 0,
 mythPhase: "claim",
 mythBusted: false,
 bustedAt: 0,
 reveal: false,
 prompt: "",
 flashColor: 0x38bdf8,
 animDuration: 3200,
 failPulse: 0,
 successPulse: 0,
 tokenProgress: 0,
 sortPlaced: 0,
 placed: {},
 selectedId: null,
 masteryStep: 0,
 tens: 2,
 ones: 3,
 fracParts: 2,
 fracShaded: 1,
 buildTotal: 23,
 scale: 0,
 reducedMotion: false,
 _placedVersion: 0,
 spiralStop: 0,
 spiralUntil: 0,
 spiralFinish: false,
 /** Number Sense */
 numOpenU: 0,
 numSeen: false,
 numApples: {},
 numCountDone: false,
 numDots: [],
 numCounted: {},
 numSlowDone: false,
 numBundlePhase: "slow",
 numSelected: {},
 numBundled: {},
 numBundles: 0,
 numBundleDone: false,
 numSlowStarted: 0,
 numBuildTens: 0,
 numBuildOnes: 0,
 numBuildPick: null,
 numBuildDone: false,
 numBankL: false,
 numBankR: false,
 numComparePick: null,
 numCompareDone: false,
 numCloseU: 0,
};

export const chemLabState = labState;

export const LAB_ASSET_PATHS = {
 rule: "/games/math-quest/assets/rule.svg",
 myth: "/games/math-quest/assets/myth.svg",
 m1: "/games/math-quest/assets/m1.svg",
 m2: "/games/math-quest/assets/m2.svg",
};

export const ATOM_ASSET_PATHS = LAB_ASSET_PATHS;

export const NUM_TOTAL = 47;
export const NUM_SLOW_NEED = 12;
export const NUM_TENS_NEED = 4;
export const NUM_ONES_NEED = 7;

export const NUM_EXAMPLES = [
 { n: 47, tens: 4, ones: 7 },
 { n: 82, tens: 8, ones: 2 },
 { n: 15, tens: 1, ones: 5 },
 { n: 30, tens: 3, ones: 0 },
];

export function makeNumDots(n = NUM_TOTAL) {
 const dots = [];
 let s = 1103515245;
 const rnd = () => {
  s = (s * 1664525 + 1013904223) >>> 0;
  return s / 4294967296;
 };
 for (let i = 0; i < n; i++) {
  dots.push({ id: i, nx: 0.1 + rnd() * 0.8, ny: 0.18 + rnd() * 0.58 });
 }
 return dots;
}

export function resetNumberState() {
 labState.numOpenU = 0;
 labState.numSeen = false;
 labState.numApples = {};
 labState.numCountDone = false;
 labState.numDots = makeNumDots();
 labState.numCounted = {};
 labState.numSlowDone = false;
 labState.numBundlePhase = "slow";
 labState.numSelected = {};
 labState.numBundled = {};
 labState.numBundles = 0;
 labState.numBundleDone = false;
 labState.numSlowStarted = 0;
 labState.numBuildTens = 0;
 labState.numBuildOnes = 0;
 labState.numBuildPick = null;
 labState.numBuildDone = false;
 labState.numBankL = false;
 labState.numBankR = false;
 labState.numComparePick = null;
 labState.numCompareDone = false;
 labState.numCloseU = 0;
 labState.phase = "open";
 labState.prompt = "";
 labState.placed = {};
 labState.selectedId = null;
 labState.reveal = false;
 labState.spiralStop = 0;
 labState.spiralUntil = 0;
 labState.spiralFinish = false;
 labState.tens = 0;
 labState.ones = 0;
}

export function setHeatTarget(v) {
 labState.heatTarget = Math.max(0, Math.min(1, v));
}

export function pulseFailFeedback(ms = 420) {
 labState.failPulse = performance.now() + ms;
}

export function pulseSuccessFeedback(ms = 320) {
 labState.successPulse = performance.now() + ms;
}

if (typeof window !== "undefined") {
 window.__chemMirror = (s) => {
  if (!s) return;
  if (s.heat != null) {
   labState.heat = s.heat;
   labState.heatTarget = s.heat;
  }
  if (s.energy != null) {
   labState.energy = s.energy;
   labState.energyTarget = s.energy;
  }
  if (s.placed != null && s.placedVersion != null && s.placedVersion !== labState._placedVersion) {
   labState.placed = { ...s.placed };
   labState.sortPlaced = Object.keys(s.placed).length;
   labState._placedVersion = s.placedVersion;
  }
  if (s.selectedId !== undefined) labState.selectedId = s.selectedId;
  if (s.reveal != null) labState.reveal = s.reveal;
  if (s.tokenOrder) labState.tokenProgress = s.tokenOrder.length;
  if (s.masteryOrder) labState.masteryStep = s.masteryOrder.length;
 };
}
