/**
 * Bio Explorer shared lab state (Chem / Force pattern).
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
 prompt: "Bio drill!",
 flashColor: 0x22c55e,
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
 // Mission 1: Teach the Model (academy metaphor)
 mlMode: "open",
 mlOpenReady: false,
 mlCleanPhase: "clean",
 mlCleanIdx: 0,
 mlCleanCount: 0,
 mlFixedCards: {},
 mlCleanDone: false,
 mlCompareDone: false,
 mlSplitPractice: 0,
 mlSplitVault: 0,
 mlVaultSealed: false,
 mlPeekAttempted: false,
 mlEpochs: 0,
 mlStopDone: false,
 mlStopNote: "",
 mlExamScore: 0,
 mlExamDone: false,
 mlCheaterShown: false,
 mlCloseU: 0,
 spiralStop: 0,
 spiralUntil: 0,
 spiralFinish: false,
};

export function resetTeachModelState() {
 initMlSub(0);
 labState.mlCleanPhase = "clean";
 labState.mlCleanIdx = 0;
 labState.mlCleanCount = 0;
 labState.mlFixedCards = {};
 labState.mlCleanDone = false;
 labState.mlCompareDone = false;
 labState.mlSplitPractice = 0;
 labState.mlSplitVault = 0;
 labState.mlVaultSealed = false;
 labState.mlPeekAttempted = false;
 labState.mlEpochs = 0;
 labState.mlStopDone = false;
 labState.mlStopNote = "";
 labState.mlExamScore = 0;
 labState.mlExamDone = false;
 labState.mlCheaterShown = false;
 labState.mlCloseU = 0;
 labState.spiralStop = 0;
 labState.spiralUntil = 0;
 labState.spiralFinish = false;
}

/** Prepare lab state for one substep without wiping the whole mission. */
export function initMlSub(subIndex) {
 switch (subIndex) {
 case 0:
 labState.mlMode = "open";
 labState.mlOpenReady = false;
 break;
 case 1:
 labState.mlMode = "clean1";
 labState.mlCleanPhase = "clean";
 labState.mlCleanIdx = 0;
 labState.mlCleanCount = 0;
 labState.mlFixedCards = {};
 labState.mlCleanDone = false;
 labState.mlCompareDone = false;
 break;
 case 2:
 labState.mlMode = "funnel1";
 break;
 case 3:
 labState.mlMode = "split2";
 labState.mlSplitPractice = 0;
 labState.mlSplitVault = 0;
 labState.mlVaultSealed = false;
 labState.mlPeekAttempted = false;
 break;
 case 4:
 labState.mlMode = "rooms2";
 break;
 case 5:
 labState.mlMode = "train3";
 labState.mlEpochs = 0;
 labState.mlStopDone = false;
 labState.mlStopNote = "";
 break;
 case 6:
 labState.mlMode = "graph3";
 break;
 case 7:
 labState.mlMode = "exam4";
 labState.mlExamScore = 0;
 labState.mlExamDone = false;
 labState.mlCheaterShown = false;
 break;
 case 8:
 labState.mlMode = "cycle4";
 break;
 case 9:
 labState.mlMode = "close";
 labState.mlCloseU = 0;
 labState.spiralStop = 0;
 labState.spiralUntil = 0;
 labState.spiralFinish = false;
 break;
 default:
 break;
 }
}

export const chemLabState = labState;

export const LAB_ASSET_PATHS = {
 "rule": "/games/ml-lab/assets/rule.svg",
 "myth": "/games/ml-lab/assets/myth.svg",
 "m1": "/games/ml-lab/assets/m1.svg"
};

export const ATOM_ASSET_PATHS = LAB_ASSET_PATHS;

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
