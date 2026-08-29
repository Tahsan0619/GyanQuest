/**
 * Statistics & Probability shared lab state (Chem / Math Quest pattern).
 */
export const labState = {
 heat: 0.12,
 heatTarget: 0.12,
 energy: 0.55,
 energyTarget: 0.55,
 phase: "desk",
 mode: "marks",
 myth: 0,
 mythPhase: "claim",
 mythBusted: false,
 bustedAt: 0,
 reveal: false,
 prompt: "Stats drill!",
 flashColor: 0xfbbf24,
 animDuration: 3200,
 failPulse: 0,
 successPulse: 0,
 tokenProgress: 0,
 sortPlaced: 0,
 placed: {},
 selectedId: null,
 masteryStep: 0,
 scale: 0,
 reducedMotion: false,
 _placedVersion: 0,
 /** Legacy mean fields */
 dataVals: [2, 3, 2, 5, 2, 3, 4],
 meanVal: 3,
 modeVal: 2,
 outlier: 0,
 labMode: "outlier",
 /** Mission 1: Mean & Mode (ice cream truck) */
 meanMode: "open",
 meanOpenReady: false,
 meanPickDone: false,
 meanPickVal: null,
 meanCups: [2, 3, 2, 5, 2, 3, 4],
 meanShareDone: false,
 meanPickCup: null,
 meanFlavorFail: false,
 meanFlavorPlaced: {},
 meanFlavorSelected: null,
 meanFlavorDone: false,
 meanOutCups: [2, 2, 3, 2, 3, 20],
 meanOutShareDone: false,
 meanOutTally: {},
 meanOutTallyDone: false,
 meanOutDone: false,
 meanCloseU: 0,
 spiralStop: 0,
 spiralUntil: 0,
 spiralFinish: false,
 /** Chance Games */
 coinBias: 0.5,
 dieFace: 1,
 trials: 0,
};

export const chemLabState = labState;

export const LAB_ASSET_PATHS = {
 rule: "/games/statistics-probability/assets/rule.svg",
 myth: "/games/statistics-probability/assets/myth.svg",
 m1: "/games/statistics-probability/assets/m1.svg",
 m2: "/games/statistics-probability/assets/m2.svg",
 dataBars: "/games/statistics-probability/assets/data-bars.svg",
 meanLine: "/games/statistics-probability/assets/mean-line.svg",
 modePeak: "/games/statistics-probability/assets/mode-peak.svg",
 coinFair: "/games/statistics-probability/assets/coin-fair.svg",
 dieSix: "/games/statistics-probability/assets/die-six.svg",
 chanceSpin: "/games/statistics-probability/assets/chance-spin.svg",
};

export const ATOM_ASSET_PATHS = LAB_ASSET_PATHS;

export const MEAN_SCOOPS = [2, 3, 2, 5, 2, 3, 4];
export const MEAN_FLAVORS = [
 "Chocolate",
 "Vanilla",
 "Chocolate",
 "Strawberry",
 "Chocolate",
 "Vanilla",
 "Chocolate",
];
export const MEAN_OUTLIER = [2, 2, 3, 2, 3, 20];

export function setHeatTarget(v) {
 labState.heatTarget = Math.max(0, Math.min(1, v));
}

export function pulseFailFeedback(ms = 420) {
 labState.failPulse = performance.now() + ms;
}

export function pulseSuccessFeedback(ms = 320) {
 labState.successPulse = performance.now() + ms;
}

export function resetMeanState() {
 labState.meanOpenReady = false;
 labState.meanPickDone = false;
 labState.meanPickVal = null;
 labState.meanCups = [...MEAN_SCOOPS];
 labState.meanShareDone = false;
 labState.meanPickCup = null;
 labState.meanFlavorFail = false;
 labState.meanFlavorPlaced = {};
 labState.meanFlavorSelected = null;
 labState.meanFlavorDone = false;
 labState.meanOutCups = [...MEAN_OUTLIER];
 labState.meanOutShareDone = false;
 labState.meanOutTally = {};
 labState.meanOutTallyDone = false;
 labState.meanOutDone = false;
 labState.meanCloseU = 0;
 labState.spiralStop = 0;
 labState.spiralUntil = 0;
 labState.spiralFinish = false;
 labState.meanMode = "open";
}

export function initMeanSub(subIndex) {
 resetMeanState();
 const modes = [
  "open",
  "pick1",
  "twin1",
  "share2",
  "beam2",
  "flavors3",
  "bars3",
  "outlier4",
  "compare4",
  "close",
 ];
 labState.meanMode = modes[subIndex] || "open";
 if (subIndex === 3) labState.meanCups = [...MEAN_SCOOPS];
 if (subIndex === 7) labState.meanOutCups = [...MEAN_OUTLIER];
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
