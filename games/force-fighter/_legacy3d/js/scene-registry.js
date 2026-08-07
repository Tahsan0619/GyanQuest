/**
 * Single source of truth: which 3D visuals belong to each lesson scene.
 * drift  = car on blue glide lane (no rock)
 * glide  = rock sliding on blue glide lane (no car)
 * rock   = rock at center for push/wake labs (no car, no lane unless withTrack)
 */
export const SCENES = {
  drift: {
    hero: false,
    track: true,
    label: "Object drifts on low-friction lane (car, tire, etc.)",
  },
  glide: {
    hero: true,
    track: true,
    heroSlides: true,
    label: "Rock or prop glides on low-friction lane",
  },
  rock: {
    hero: true,
    track: false,
    label: "Rock at center - push to wake",
  },
  rest: { hero: false, track: false, label: "Balanced forces on object" },
  shove: { hero: false, track: true, label: "Car accelerates from a push" },
  massCompare: { hero: false, track: true, label: "Light vs heavy car race" },
  forceCompare: { hero: false, track: true, label: "Weak vs strong push on crates" },
  frictionLoop: { hero: false, track: true, label: "Friction compare on lane" },
  recoil: { hero: false, track: false, label: "Two crates recoil apart" },
  wall: { hero: true, track: false, wall: true, label: "Rock hits wall" },
  vector: { hero: true, track: false, label: "Force arrows on rock" },
  ramp: { hero: false, track: false, label: "Block on ramp" },
  rope: { hero: false, track: false, label: "Rope tension on crate" },
  orbit: { hero: false, track: false, label: "Orbit path" },
  kickedBall: { hero: false, track: false, label: "Ball slows from friction" },
  magnet: { hero: false, track: false, label: "Magnet lift demo" },
  idle: { hero: true, track: false, label: "Rock ready" },
};

/** Per-level default canvas when no step-specific scene is set. */
export const LEVEL_DEMO_SCENES = [
  { scene: "drift", sceneArgs: { withTrack: true } },
  { scene: "massCompare" },
  { scene: "recoil" },
  { scene: "frictionLoop" },
  { scene: "rest", sceneArgs: { shape: "ball" } },
  { scene: "ramp" },
  { scene: "rope" },
  { scene: "vector" },
  { scene: "kickedBall" },
  { scene: "magnet" },
];
