/**
 * Force Fighter shared lab state + feedback helpers (Chem pattern).
 */
export const forceLabState = {
  heat: 0.12,
  heatTarget: 0.12,
  energy: 0.55,
  energyTarget: 0.55,
  phase: "desk",
  mode: "door",
  myth: 0,
  mythPhase: "claim",
  mythBusted: false,
  bustedAt: 0,
  reveal: false,
  prompt: "Force drill!",
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
  /** Lazy Rock */
  rockAwake: false,
  rockVx: 0,
  rockX: 0.35,
  wallHit: 0,
  /** Push Power */
  pushForce: 0.35,
  massKg: 100,
  accel: 0,
  raceDone: false,
  /** Pairs */
  pairGap: 1,
  recoil: 0,
  ropeT: 0.5,
  walkStep: 0,
};

/** Alias so force-activities (Chem mount copy) keeps working */
export const chemLabState = forceLabState;

export const FORCE_ASSET_PATHS = {
  rock: "/games/force-fighter/assets/lazy-rock.svg",
  push: "/games/force-fighter/assets/push-power.svg",
  pair: "/games/force-fighter/assets/force-pairs.svg",
  arrow: "/games/force-fighter/assets/force-arrow.svg",
  race: "/games/force-fighter/assets/mass-race.svg",
  rocket: "/games/force-fighter/assets/rocket-pair.svg",
  myth: "/games/force-fighter/assets/force-myth.svg",
  rule: "/games/force-fighter/assets/force-rule.svg",
};

export const ATOM_ASSET_PATHS = FORCE_ASSET_PATHS;

export function setHeatTarget(v) {
  forceLabState.heatTarget = Math.max(0, Math.min(1, v));
}

export function pulseFailFeedback(ms = 420) {
  forceLabState.failPulse = performance.now() + ms;
}

export function pulseSuccessFeedback(ms = 320) {
  forceLabState.successPulse = performance.now() + ms;
}

if (typeof window !== "undefined") {
  window.__chemMirror = (s) => {
    if (!s) return;
    if (s.heat != null) {
      forceLabState.heat = s.heat;
      forceLabState.heatTarget = s.heat;
    }
    if (s.energy != null) {
      forceLabState.energy = s.energy;
      forceLabState.energyTarget = s.energy;
    }
    if (s.placed != null && s.placedVersion != null && s.placedVersion !== forceLabState._placedVersion) {
      forceLabState.placed = { ...s.placed };
      forceLabState.sortPlaced = Object.keys(s.placed).length;
      forceLabState._placedVersion = s.placedVersion;
    }
    if (s.selectedId !== undefined) forceLabState.selectedId = s.selectedId;
    if (s.reveal != null) forceLabState.reveal = s.reveal;
    if (s.tokenOrder) forceLabState.tokenProgress = s.tokenOrder.length;
    if (s.masteryOrder) forceLabState.masteryStep = s.masteryOrder.length;
  };
}
