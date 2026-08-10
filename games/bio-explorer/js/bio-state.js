/**
 * Bio Explorer shared lab state (Chem / Force pattern).
 */
export const bioLabState = {
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
 labFocus: "water",
 /** Cell City */
 cellZoom: 0.2,
 organelle: "membrane",
 /** Plant Power */
 sun: 0.3,
 rootWater: 0.2,
 beeVisit: 0,
};

export const chemLabState = bioLabState;

export const BIO_ASSET_PATHS = {
 life: "/games/bio-explorer/assets/living-or-not.svg",
 cell: "/games/bio-explorer/assets/cell-city.svg",
 plant: "/games/bio-explorer/assets/plant-power.svg",
 rule: "/games/bio-explorer/assets/life-rule.svg",
 cellRule: "/games/bio-explorer/assets/cell-rule.svg",
 plantRule: "/games/bio-explorer/assets/plant-rule.svg",
 myth: "/games/bio-explorer/assets/bio-myth.svg",
 sprout: "/games/bio-explorer/assets/seed-sprout.svg",
};

export const ATOM_ASSET_PATHS = BIO_ASSET_PATHS;

export function setHeatTarget(v) {
 bioLabState.heatTarget = Math.max(0, Math.min(1, v));
}

export function pulseFailFeedback(ms = 420) {
 bioLabState.failPulse = performance.now() + ms;
}

export function pulseSuccessFeedback(ms = 320) {
 bioLabState.successPulse = performance.now() + ms;
}

if (typeof window !== "undefined") {
 window.__chemMirror = (s) => {
 if (!s) return;
 if (s.heat != null) {
 bioLabState.heat = s.heat;
 bioLabState.heatTarget = s.heat;
 }
 if (s.energy != null) {
 bioLabState.energy = s.energy;
 bioLabState.energyTarget = s.energy;
 }
 if (s.placed != null && s.placedVersion != null && s.placedVersion !== bioLabState._placedVersion) {
 bioLabState.placed = { ...s.placed };
 bioLabState.sortPlaced = Object.keys(s.placed).length;
 bioLabState._placedVersion = s.placedVersion;
 }
 if (s.selectedId !== undefined) bioLabState.selectedId = s.selectedId;
 if (s.reveal != null) bioLabState.reveal = s.reveal;
 if (s.tokenOrder) bioLabState.tokenProgress = s.tokenOrder.length;
 if (s.masteryOrder) bioLabState.masteryStep = s.masteryOrder.length;
 };
}
