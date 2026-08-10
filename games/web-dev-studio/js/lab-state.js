/**
 * Web Dev Studio shared lab state (Chem / ICT pattern).
 */
export const labState = {
 heat: 0.2,
 heatTarget: 0.2,
 energy: 0.55,
 energyTarget: 0.55,
 phase: "desk",
 mode: "home",
 myth: 0,
 mythPhase: "claim",
 mythBusted: false,
 bustedAt: 0,
 reveal: false,
 prompt: "Web drill!",
 flashColor: 0xea580c,
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
 /** HTML House - how many tag-rooms are open */
 tagBuild: 0.2,
 /** CSS Style - style dial strength */
 styleHeat: 0.2,
 /** JS Click - tap / energy counter */
 clickCount: 0,
};

export const chemLabState = labState;

export const LAB_ASSET_PATHS = {
 rule: "/games/web-dev-studio/assets/rule.svg",
 myth: "/games/web-dev-studio/assets/myth.svg",
 m1: "/games/web-dev-studio/assets/m1.svg",
 m2: "/games/web-dev-studio/assets/m2.svg",
 m3: "/games/web-dev-studio/assets/m3.svg",
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
