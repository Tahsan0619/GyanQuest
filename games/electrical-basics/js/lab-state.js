/**
 * Electrical Basics shared lab state (Chem / Bruner pattern).
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
 prompt: "Elec drill!",
 flashColor: 0xfacc15,
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
 /** Mission 1: Circuit Loop (water-park metaphor) */
 circMode: "open",
 circOpenReady: false,
 circGaps: {},
 circLoopClosed: false,
 circLoopEverClosed: false,
 circLoopBroken: false,
 circBattery: "medium",
 circBatteriesTried: {},
 circWireThick: false,
 circBulbRemoved: false,
 circFlowSeen: false,
 circThickSwapped: false,
 circResistanceDone: false,
 circSwitchAdded: false,
 circSwitchClosed: false,
 circSwitchToggles: 0,
 circCloseU: 0,
 spiralStop: 0,
 spiralUntil: 0,
 spiralFinish: false,
};

export const chemLabState = labState;

export const LAB_ASSET_PATHS = {
 rule: "/games/electrical-basics/assets/rule.svg",
 myth: "/games/electrical-basics/assets/myth.svg",
 m1: "/games/electrical-basics/assets/m1.svg",
 m2: "/games/electrical-basics/assets/m2.svg",
 m3: "/games/electrical-basics/assets/m3.svg",
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

export function resetCircuitLoopState() {
 initCircSub(0);
 labState.circGaps = {};
 labState.circLoopClosed = false;
 labState.circLoopEverClosed = false;
 labState.circLoopBroken = false;
 labState.circBattery = "medium";
 labState.circBatteriesTried = {};
 labState.circWireThick = false;
 labState.circBulbRemoved = false;
 labState.circFlowSeen = false;
 labState.circThickSwapped = false;
 labState.circResistanceDone = false;
 labState.circSwitchAdded = false;
 labState.circSwitchClosed = false;
 labState.circSwitchToggles = 0;
 labState.circCloseU = 0;
 labState.spiralStop = 0;
 labState.spiralUntil = 0;
 labState.spiralFinish = false;
}

/** Prepare lab state for one substep without wiping the whole mission. */
export function initCircSub(subIndex) {
 switch (subIndex) {
 case 0:
 labState.circMode = "open";
 labState.circOpenReady = false;
 break;
 case 1:
 labState.circMode = "loop1";
 labState.circGaps = {};
 labState.circLoopClosed = false;
 labState.circLoopEverClosed = false;
 labState.circLoopBroken = false;
 break;
 case 2:
 labState.circMode = "pipe1";
 break;
 case 3:
 labState.circMode = "battery2";
 labState.circBattery = "medium";
 labState.circBatteriesTried = {};
 labState.circGaps = { g1: true, g2: true, g3: true, g4: true };
 labState.circLoopClosed = true;
 labState.circLoopBroken = false;
 break;
 case 4:
 labState.circMode = "pump2";
 break;
 case 5:
 labState.circMode = "flow3";
 labState.circWireThick = false;
 labState.circBulbRemoved = false;
 labState.circFlowSeen = false;
 labState.circThickSwapped = false;
 labState.circResistanceDone = false;
 labState.circGaps = { g1: true, g2: true, g3: true, g4: true };
 labState.circLoopClosed = true;
 break;
 case 6:
 labState.circMode = "wheel3";
 break;
 case 7:
 labState.circMode = "switch4";
 labState.circSwitchAdded = false;
 labState.circSwitchClosed = false;
 labState.circSwitchToggles = 0;
 labState.circGaps = { g1: true, g2: true, g3: false, g4: true };
 labState.circLoopClosed = false;
 break;
 case 8:
 labState.circMode = "valve4";
 break;
 case 9:
 labState.circMode = "close";
 labState.circCloseU = 0;
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
