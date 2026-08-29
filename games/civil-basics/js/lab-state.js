/**
 * Civil Basics shared lab state (Bruner spiral pattern).
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
 prompt: "Civil drill!",
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
 /** Mission 1: Strong Structures */
 structMode: "open",
 structOpenReady: false,
 structSquarePushed: false,
 structDiagonalAdded: false,
 structBracedPushTried: false,
 structWindNarrow: false,
 structWindWide: false,
 structLoadGood: false,
 structLoadWeak: false,
 structLoadAmount: 0,
 structWeakCollapsed: false,
 structLoadTestDone: false,
 structCloseU: 0,
 spiralStop: 0,
 spiralUntil: 0,
 spiralFinish: false,
};

export const chemLabState = labState;

export const LAB_ASSET_PATHS = {
 rule: "/games/civil-basics/assets/rule.svg",
 myth: "/games/civil-basics/assets/myth.svg",
 m1: "/games/civil-basics/assets/m1.svg",
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

export function resetStructState() {
 initStructSub(0);
 labState.structOpenReady = false;
 labState.structSquarePushed = false;
 labState.structDiagonalAdded = false;
 labState.structBracedPushTried = false;
 labState.structWindNarrow = false;
 labState.structWindWide = false;
 labState.structLoadGood = false;
 labState.structLoadWeak = false;
 labState.structLoadAmount = 0;
 labState.structWeakCollapsed = false;
 labState.structLoadTestDone = false;
 labState.structCloseU = 0;
 labState.spiralStop = 0;
 labState.spiralUntil = 0;
 labState.spiralFinish = false;
}

/** Prepare lab state for one substep without wiping the whole mission. */
export function initStructSub(subIndex) {
 switch (subIndex) {
 case 0:
 labState.structMode = "open";
 labState.structOpenReady = false;
 break;
 case 1:
 labState.structMode = "square1";
 labState.structSquarePushed = false;
 labState.structDiagonalAdded = false;
 labState.structBracedPushTried = false;
 break;
 case 2:
 labState.structMode = "compare1";
 break;
 case 3:
 labState.structMode = "tower2";
 labState.structWindNarrow = false;
 labState.structWindWide = false;
 break;
 case 4:
 labState.structMode = "cog2";
 break;
 case 5:
 labState.structMode = "bridge3";
 labState.structLoadGood = false;
 labState.structLoadWeak = false;
 break;
 case 6:
 labState.structMode = "real3";
 break;
 case 7:
 labState.structMode = "load4";
 labState.structLoadAmount = 0;
 labState.structWeakCollapsed = false;
 labState.structLoadTestDone = false;
 break;
 case 8:
 labState.structMode = "safe4";
 break;
 case 9:
 labState.structMode = "close";
 labState.structCloseU = 0;
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
 if (s.mythIndex != null) labState.myth = s.mythIndex;
 if (s.mythPhase) labState.mythPhase = s.mythPhase;
 labState.mythBusted = s.mythPhase === "truth";
 if (s.scale != null) labState.scale = s.scale;
 if (s.prompt != null) labState.prompt = s.prompt;
 };
}
