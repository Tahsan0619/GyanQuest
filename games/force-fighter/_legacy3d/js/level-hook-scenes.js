/**
 * Per-level everyday-hook 3D scenes (one distinct visual per tap-reveal step).
 * Scenes MUST match locale everyday copy - only use props that exist in asset-loader.
 */
export const LEVEL_HOOK_STEP_SCENES = [
  // L1 Lazy Rock - rock stays; tire rolls like a kicked ball; delivery van push
  [
    { scene: "rock" },
    { scene: "kickedBall" },
    { scene: "drift", sceneArgs: { withTrack: true, speed: 1.5, vehicle: "delivery" } },
  ],
  // L2 Push Power - light sports car vs heavy truck
  [
    { scene: "massCompare" },
    { scene: "drift", sceneArgs: { vehicle: "kart", speed: 2.1 } },
    { scene: "drift", sceneArgs: { vehicle: "truck", speed: 0.55 } },
  ],
  // L3 Push & Pull - recoil crates, rope tug, shove sports car
  [
    { scene: "recoil", sceneArgs: { variant: "pair" } },
    { scene: "rope" },
    { scene: "shove", sceneArgs: { phase: "accel", vehicle: "sports" } },
  ],
  // L4 Friction - crates stop, rock glides then slows, tire rolls then friction wins
  [
    { scene: "frictionLoop" },
    { scene: "glide", sceneArgs: { speed: 1.5, frictionMu: 0.35, prop: "rock" } },
    { scene: "kickedBall" },
  ],
  // L5 Balance - resting tire, tug balance, parachute float (parasol prop)
  [
    { scene: "rest", sceneArgs: { shape: "ball", arrows: true } },
    { scene: "tugOfWar", sceneArgs: { left: 2.5, right: 2.5, snapshot: true } },
    { scene: "parachute" },
  ],
  // L6 Ramp - gentle ramp, steep ramp, crate glide
  [
    { scene: "ramp", sceneArgs: { angleDeg: 18, massKg: 8 } },
    { scene: "ramp", sceneArgs: { angleDeg: 42, massKg: 5 } },
    { scene: "glide", sceneArgs: { prop: "crate", speed: 1.1 } },
  ],
  // L7 Rope - pulley imbalance, balanced pulley, crane rope
  [
    { scene: "pulley", sceneArgs: { mLeft: 3, mRight: 7 } },
    { scene: "pulley", sceneArgs: { mLeft: 5, mRight: 5 } },
    { scene: "rope" },
  ],
  // L8 Vectors - angled push, force compare, recoil
  [
    { scene: "vector", sceneArgs: { fx: 1.2, fy: 0.3 } },
    { scene: "forceCompare" },
    { scene: "recoil", sceneArgs: { variant: "pair" } },
  ],
  // L9 Magnet - clip, coin-like tire bits, car race (many forces)
  [
    { scene: "magnet", sceneArgs: { focus: "clip" } },
    { scene: "magnet", sceneArgs: { focus: "coin" } },
    { scene: "drift", sceneArgs: { vehicle: "race", speed: 1.4, withTrack: true } },
  ],
  // L10 Boss - rolling tire, mass compare, wall impact (no fake orbit-as-bike)
  [
    { scene: "kickedBall" },
    { scene: "massCompare" },
    { scene: "wall", sceneArgs: { phase: "impact" } },
  ],
];
