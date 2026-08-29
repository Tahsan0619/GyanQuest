/**
 * Astronomy & Space shared lab state (Solar Family + Day/Night fields).
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
 prompt: "Space drill!",
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
 labMode: "clarity",
 reducedMotion: false,
 _placedVersion: 0,
 /** Mission 1: Solar Family */
 solarMode: "open",
 solarOpenReady: false,
 solarOrbitSpeed: 50,
 solarOrbitOutcome: "",
 solarOrbitSeen: {},
 solarOrbitDone: false,
 solarSortPlaced: {},
 solarSortDone: false,
 solarSortHint: "",
 solarSelected: null,
 solarGallerySeen: {},
 solarGalleryCard: null,
 solarGalleryDone: false,
 solarScalePos: 15,
 solarScaleGuessed: false,
 solarScaleRevealed: false,
 solarScaleDone: false,
 solarCloseU: 0,
 spiralStop: 0,
 spiralUntil: 0,
 spiralFinish: false,
};

export const chemLabState = labState;

export const LAB_ASSET_PATHS = {
 rule: "/games/astronomy-space/assets/rule.svg",
 myth: "/games/astronomy-space/assets/myth.svg",
 m1: "/games/astronomy-space/assets/m1.svg",
 m2: "/games/astronomy-space/assets/m2.svg",
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

export function resetSolarState() {
 initSolarSub(0);
 labState.solarOpenReady = false;
 labState.solarOrbitSpeed = 50;
 labState.solarOrbitOutcome = "";
 labState.solarOrbitSeen = {};
 labState.solarOrbitDone = false;
 labState.solarSortPlaced = {};
 labState.solarSortDone = false;
 labState.solarSortHint = "";
 labState.solarSelected = null;
 labState.solarGallerySeen = {};
 labState.solarGalleryCard = null;
 labState.solarGalleryDone = false;
 labState.solarScalePos = 15;
 labState.solarScaleGuessed = false;
 labState.solarScaleRevealed = false;
 labState.solarScaleDone = false;
 labState.solarCloseU = 0;
 labState.spiralStop = 0;
 labState.spiralUntil = 0;
 labState.spiralFinish = false;
}

export function initSolarSub(subIndex) {
 switch (subIndex) {
  case 0:
   labState.solarMode = "open";
   labState.solarOpenReady = false;
   break;
  case 1:
   labState.solarMode = "orbit1";
   labState.solarOrbitSpeed = 50;
   labState.solarOrbitOutcome = "";
   labState.solarOrbitSeen = {};
   labState.solarOrbitDone = false;
   break;
  case 2:
   labState.solarMode = "diagram1";
   break;
  case 3:
   labState.solarMode = "sort2";
   labState.solarSortPlaced = {};
   labState.solarSortDone = false;
   labState.solarSortHint = "";
   labState.solarSelected = null;
   break;
  case 4:
   labState.solarMode = "size2";
   break;
  case 5:
   labState.solarMode = "gallery3";
   labState.solarGallerySeen = {};
   labState.solarGalleryCard = null;
   labState.solarGalleryDone = false;
   break;
  case 6:
   labState.solarMode = "order3";
   break;
  case 7:
   labState.solarMode = "scale4";
   labState.solarScalePos = 15;
   labState.solarScaleGuessed = false;
   labState.solarScaleRevealed = false;
   labState.solarScaleDone = false;
   break;
  case 8:
   labState.solarMode = "explore4";
   break;
  case 9:
   labState.solarMode = "close";
   labState.solarCloseU = 0;
   break;
  default:
   labState.solarMode = "open";
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
