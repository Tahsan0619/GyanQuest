/**
 * Eco Guardian shared lab state (Bruner Waste Watch + shared chem fields).
 */
export const labState = {
 heat: 0.12,
 heatTarget: 0.12,
 energy: 0.55,
 energyTarget: 0.55,
 phase: "desk",
 mode: "home",
 myth: 0,
 mythPhase: "claim",
 mythBusted: false,
 bustedAt: 0,
 reveal: false,
 prompt: "Waste drill!",
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
 recycleFill: 0.25,
 reducedMotion: false,
 _placedVersion: 0,
 /** Mission 1: Waste Watch */
 wasteMode: "open",
 wasteOpenReady: false,
 wasteFollowStep: 0,
 wasteTimelapseSeen: false,
 wasteMapTrucks: 0,
 wasteRecyclePlaced: {},
 wasteRecycleDone: false,
 wasteLoopPhase: 0,
 wasteCompostPlaced: {},
 wasteCompostSorted: false,
 wasteCompostFF: 0,
 wasteCompostDone: false,
 wasteFullIdx: 0,
 wasteFullScore: 0,
 wasteFullDone: false,
 wasteSelected: null,
 wasteRejectMsg: "",
 wasteCloseU: 0,
 spiralStop: 0,
 spiralUntil: 0,
 spiralFinish: false,
};

export const chemLabState = labState;

export const LAB_ASSET_PATHS = {
 rule: "/games/eco-guardian/assets/rule.svg",
 myth: "/games/eco-guardian/assets/myth.svg",
 m1: "/games/eco-guardian/assets/m1.svg",
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

export function resetWasteState() {
 initWasteSub(0);
 labState.wasteOpenReady = false;
 labState.wasteFollowStep = 0;
 labState.wasteTimelapseSeen = false;
 labState.wasteMapTrucks = 0;
 labState.wasteRecyclePlaced = {};
 labState.wasteRecycleDone = false;
 labState.wasteLoopPhase = 0;
 labState.wasteCompostPlaced = {};
 labState.wasteCompostSorted = false;
 labState.wasteCompostFF = 0;
 labState.wasteCompostDone = false;
 labState.wasteFullIdx = 0;
 labState.wasteFullScore = 0;
 labState.wasteFullDone = false;
 labState.wasteSelected = null;
 labState.wasteRejectMsg = "";
 labState.wasteCloseU = 0;
 labState.spiralStop = 0;
 labState.spiralUntil = 0;
 labState.spiralFinish = false;
}

export function initWasteSub(subIndex) {
 switch (subIndex) {
  case 0:
   labState.wasteMode = "open";
   labState.wasteOpenReady = false;
   break;
  case 1:
   labState.wasteMode = "follow1";
   labState.wasteFollowStep = 0;
   labState.wasteTimelapseSeen = false;
   break;
  case 2:
   labState.wasteMode = "map1";
   labState.wasteMapTrucks = 0;
   break;
  case 3:
   labState.wasteMode = "recycle2";
   labState.wasteRecyclePlaced = {};
   labState.wasteRecycleDone = false;
   labState.wasteSelected = null;
   labState.wasteRejectMsg = "";
   break;
  case 4:
   labState.wasteMode = "loop2";
   labState.wasteLoopPhase = 0;
   break;
  case 5:
   labState.wasteMode = "compost3";
   labState.wasteCompostPlaced = {};
   labState.wasteCompostSorted = false;
   labState.wasteCompostFF = 0;
   labState.wasteCompostDone = false;
   labState.wasteSelected = null;
   labState.wasteRejectMsg = "";
   break;
  case 6:
   labState.wasteMode = "nature3";
   break;
  case 7:
   labState.wasteMode = "full4";
   labState.wasteFullIdx = 0;
   labState.wasteFullScore = 0;
   labState.wasteFullDone = false;
   labState.wasteRejectMsg = "";
   break;
  case 8:
   labState.wasteMode = "split4";
   break;
  case 9:
   labState.wasteMode = "close";
   labState.wasteCloseU = 0;
   break;
  default:
   labState.wasteMode = "open";
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
