/**
 * Geometry & Trigonometry shared lab state (Chem / Math Quest pattern).
 */
export const labState = {
  heat: 0.12,
  heatTarget: 0.12,
  energy: 0.55,
  energyTarget: 0.55,
  phase: "desk",
  mode: "signs",
  myth: 0,
  mythPhase: "claim",
  mythBusted: false,
  bustedAt: 0,
  reveal: false,
  prompt: "Geo drill!",
  flashColor: 0x93c5fd,
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
  /** Shape Studio */
  shapeKind: "triangle",
  sideCount: 3,
  /** Angle Adventures */
  angleDeg: 45,
  angleKind: "acute",
};

export const chemLabState = labState;

export const LAB_ASSET_PATHS = {
  rule: "/games/geometry-trig/assets/rule.svg",
  myth: "/games/geometry-trig/assets/myth.svg",
  m1: "/games/geometry-trig/assets/m1.svg",
  m2: "/games/geometry-trig/assets/m2.svg",
  triangle: "/games/geometry-trig/assets/triangle.svg",
  square: "/games/geometry-trig/assets/square.svg",
  circleShape: "/games/geometry-trig/assets/circle-shape.svg",
  acuteAngle: "/games/geometry-trig/assets/acute-angle.svg",
  rightAngle: "/games/geometry-trig/assets/right-angle.svg",
  obtuseAngle: "/games/geometry-trig/assets/obtuse-angle.svg",
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
