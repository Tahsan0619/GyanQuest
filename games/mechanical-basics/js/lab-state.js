/**
 * Mechanical Basics shared lab state (Bruner spiral pattern).
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
 prompt: "Mech drill!",
 flashColor: 0xfdba74,
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
 /** Mission 1: Levers & Gears */
 levMode: "open",
 levOpenReady: false,
 levHandPushed: false,
 levHandFailed: false,
 levPlankUsed: false,
 levFulcrumPos: 0.25,
 levFulcrumTriedNearLoad: false,
 levFulcrumTriedNearEffort: false,
 levGearPhase: "lift",
 levGearCranked: false,
 levGearReversed: false,
 levSortSlots: {},
 levSortDone: false,
 levBikeBothFound: false,
 levCloseU: 0,
 spiralStop: 0,
 spiralUntil: 0,
 spiralFinish: false,
};

export const chemLabState = labState;

export const LAB_ASSET_PATHS = {
 rule: "/games/mechanical-basics/assets/rule.svg",
 myth: "/games/mechanical-basics/assets/myth.svg",
 m1: "/games/mechanical-basics/assets/m1.svg",
 m2: "/games/mechanical-basics/assets/m2.svg",
 m3: "/games/mechanical-basics/assets/m3.svg",
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

export function resetLeverGearState() {
 initLevSub(0);
 labState.levHandPushed = false;
 labState.levHandFailed = false;
 labState.levPlankUsed = false;
 labState.levFulcrumPos = 0.25;
 labState.levFulcrumTriedNearLoad = false;
 labState.levFulcrumTriedNearEffort = false;
 labState.levGearPhase = "lift";
 labState.levGearCranked = false;
 labState.levGearReversed = false;
 labState.levSortSlots = {};
 labState.levSortDone = false;
 labState.levBikeBothFound = false;
 labState.levCloseU = 0;
 labState.spiralStop = 0;
 labState.spiralUntil = 0;
 labState.spiralFinish = false;
}

/** Prepare lab state for one substep without wiping the whole mission. */
export function initLevSub(subIndex) {
 switch (subIndex) {
 case 0:
 labState.levMode = "open";
 labState.levOpenReady = false;
 break;
 case 1:
 labState.levMode = "lever1";
 labState.levHandPushed = false;
 labState.levHandFailed = false;
 labState.levPlankUsed = false;
 break;
 case 2:
 labState.levMode = "seesaw1";
 break;
 case 3:
 labState.levMode = "fulcrum2";
 labState.levFulcrumPos = 0.25;
 labState.levFulcrumTriedNearLoad = false;
 labState.levFulcrumTriedNearEffort = false;
 break;
 case 4:
 labState.levMode = "arms2";
 break;
 case 5:
 labState.levMode = "gears3";
 labState.levGearPhase = "lift";
 labState.levGearCranked = false;
 labState.levGearReversed = false;
 break;
 case 6:
 labState.levMode = "bike3";
 break;
 case 7:
 labState.levMode = "sort4";
 labState.levSortSlots = {};
 labState.levSortDone = false;
 labState.levBikeBothFound = false;
 break;
 case 8:
 labState.levMode = "montage4";
 break;
 case 9:
 labState.levMode = "close";
 labState.levCloseU = 0;
 labState.spiralStop = 0;
 labState.spiralUntil = 0;
 labState.spiralFinish = false;
 break;
 default:
 break;
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
