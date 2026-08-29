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
 /** Living or Not */
 lifeScore: 0,
 sprout: 0,
 /** Cell City */
 cellZoom: 0.2,
 organelle: "membrane",
 /** Plant Power */
 sun: 0.3,
 rootWater: 0.2,
 beeVisit: 0,
 /** Mission 1: Bits - kitchen metaphor (Bruner spirals) */
 bitsMode: "open",
 bitsOpenReady: false,
 bitsSwitches: [0, 0, 0, 0, 0, 0, 0, 0],
 bitsSwitchFlips: 0,
 bitsMaxFound: false,
 bitsChefExecuted: false,
 bitsSpeedLevel: 0,
 bitsChefDropped: {},
 bitsFetchCounter: false,
 bitsFetchPantry: false,
 bitsPowerOff: false,
 bitsProgramStep: 0,
 bitsCrampedSeen: false,
 bitsCloseU: 0,
 bitsPantryWalk: 0,
 bitsReinterpretPhase: 0,
 bitsLoopPhase: 0,
 spiralStop: 0,
 spiralUntil: 0,
 spiralFinish: false,
 /** Mission 2: I/O - kitchen windows metaphor (Bruner spirals) */
 ioMode: "open",
 ioOpenReady: false,
 ioOrderWindow: false,
 ioTypedSealed: false,
 ioTypedWindow: false,
 ioServingWindow: false,
 ioServeAttempts: 0,
 ioOutputsAdded: { monitor: false, speaker: false, printer: false },
 ioTouchIn: false,
 ioTouchOut: false,
 ioSortPlaced: {},
 ioSortDone: false,
 ioSortSelected: null,
 ioCycleStep: 0,
 ioCycleDone: false,
 ioAccessibleSwap: false,
 ioGalleryPhase: 0,
 ioCloseU: 0,
 ioTypedText: "",
};

export const chemLabState = labState;

export const LAB_ASSET_PATHS = {
 "rule": "/games/ict-fundamentals/assets/rule.svg",
 "myth": "/games/ict-fundamentals/assets/myth.svg",
 "m1": "/games/ict-fundamentals/assets/m1.svg",
 "m2": "/games/ict-fundamentals/assets/m2.svg",
 "m3": "/games/ict-fundamentals/assets/m3.svg"
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

export function resetBitsKitchenState() {
 initBitsSub(0);
 labState.bitsOpenReady = false;
 labState.bitsSwitches = [0, 0, 0, 0, 0, 0, 0, 0];
 labState.bitsSwitchFlips = 0;
 labState.bitsMaxFound = false;
 labState.bitsChefExecuted = false;
 labState.bitsSpeedLevel = 0;
 labState.bitsChefDropped = {};
 labState.bitsFetchCounter = false;
 labState.bitsFetchPantry = false;
 labState.bitsPowerOff = false;
 labState.bitsProgramStep = 0;
 labState.bitsCrampedSeen = false;
 labState.bitsCloseU = 0;
 labState.bitsPantryWalk = 0;
 labState.bitsReinterpretPhase = 0;
 labState.bitsLoopPhase = 0;
 labState.spiralStop = 0;
 labState.spiralUntil = 0;
 labState.spiralFinish = false;
}

export function initBitsSub(subIndex) {
 switch (subIndex) {
 case 0:
 labState.bitsMode = "open";
 labState.bitsOpenReady = false;
 break;
 case 1:
 labState.bitsMode = "switches1";
 labState.bitsSwitches = [0, 0, 0, 0, 0, 0, 0, 0];
 labState.bitsSwitchFlips = 0;
 labState.bitsMaxFound = false;
 break;
 case 2:
 labState.bitsMode = "reinterpret1";
 labState.bitsReinterpretPhase = 0;
 break;
 case 3:
 labState.bitsMode = "chef2";
 labState.bitsChefExecuted = false;
 labState.bitsSpeedLevel = 0;
 labState.bitsChefDropped = {};
 break;
 case 4:
 labState.bitsMode = "loop2";
 labState.bitsLoopPhase = 0;
 break;
 case 5:
 labState.bitsMode = "kitchen3";
 labState.bitsFetchCounter = false;
 labState.bitsFetchPantry = false;
 labState.bitsPowerOff = false;
 labState.bitsPantryWalk = 0;
 break;
 case 6:
 labState.bitsMode = "compare3";
 labState.bitsPowerOff = false;
 break;
 case 7:
 labState.bitsMode = "program4";
 labState.bitsProgramStep = 0;
 labState.bitsCrampedSeen = false;
 break;
 case 8:
 labState.bitsMode = "spec4";
 break;
 case 9:
 labState.bitsMode = "close";
 labState.bitsCloseU = 0;
 break;
 default:
 labState.bitsMode = "open";
 }
}

export function bitsBinaryString() {
 return (labState.bitsSwitches || []).map((b) => (b ? "1" : "0")).join("");
}

export function bitsDecimalValue() {
 let v = 0;
 (labState.bitsSwitches || []).forEach((b, i) => {
 if (b) v += 2 ** (7 - i);
 });
 return v;
}

export function resetIoKitchenState() {
 initIoSub(0);
 labState.ioOpenReady = false;
 labState.ioOrderWindow = false;
 labState.ioTypedSealed = false;
 labState.ioTypedWindow = false;
 labState.ioServingWindow = false;
 labState.ioServeAttempts = 0;
 labState.ioOutputsAdded = { monitor: false, speaker: false, printer: false };
 labState.ioTouchIn = false;
 labState.ioTouchOut = false;
 labState.ioSortPlaced = {};
 labState.ioSortDone = false;
 labState.ioSortSelected = null;
 labState.ioCycleStep = 0;
 labState.ioCycleDone = false;
 labState.ioAccessibleSwap = false;
 labState.ioGalleryPhase = 0;
 labState.ioCloseU = 0;
 labState.ioTypedText = "";
 labState.placed = {};
 labState.spiralStop = 0;
 labState.spiralUntil = 0;
 labState.spiralFinish = false;
}

export function initIoSub(subIndex) {
 switch (subIndex) {
 case 0:
 labState.ioMode = "open";
 labState.ioOpenReady = false;
 break;
 case 1:
 labState.ioMode = "input1";
 labState.ioOrderWindow = false;
 labState.ioTypedSealed = false;
 labState.ioTypedWindow = false;
 labState.ioTypedText = "";
 break;
 case 2:
 labState.ioMode = "inputGallery";
 labState.ioGalleryPhase = 0;
 break;
 case 3:
 labState.ioMode = "output1";
 labState.ioServingWindow = false;
 labState.ioServeAttempts = 0;
 labState.ioOutputsAdded = { monitor: false, speaker: false, printer: false };
 break;
 case 4:
 labState.ioMode = "outputGallery";
 labState.ioGalleryPhase = 0;
 break;
 case 5:
 labState.ioMode = "both1";
 labState.ioTouchIn = false;
 labState.ioTouchOut = false;
 labState.ioSortPlaced = {};
 labState.ioSortDone = false;
 labState.ioSortSelected = null;
 labState.placed = {};
 break;
 case 6:
 labState.ioMode = "bothDiagram";
 break;
 case 7:
 labState.ioMode = "cycle4";
 labState.ioCycleStep = 0;
 labState.ioCycleDone = false;
 labState.ioAccessibleSwap = false;
 break;
 case 8:
 labState.ioMode = "access4";
 break;
 case 9:
 labState.ioMode = "close";
 labState.ioCloseU = 0;
 break;
 default:
 labState.ioMode = "open";
 }
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
