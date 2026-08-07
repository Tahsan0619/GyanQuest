/**
 * All Force Lab playground guided experiments (matches lesson scene types).
 * @typedef {{ kind: string; x?: number; z?: number; vel?: [number, number]; frictionMult?: number }} PlaygroundSpawn
 * @typedef {{
 *   id: string;
 *   label: string;
 *   tip: string;
 *   ice?: boolean;
 *   wall?: boolean;
 *   lessonScene?: string;
 *   sceneArgs?: object;
 *   spawns?: PlaygroundSpawn[];
 *   handler?: string;
 * }} PlaygroundPreset
 */

/** @type {{ id: string; title: string; presets: PlaygroundPreset[] }[]} */
export const PLAYGROUND_PRESET_GROUPS = [
  {
    id: "motion",
    title: "Motion & inertia",
    presets: [
      { id: "drift", label: "🚗 Drift car", tip: "Race car coasts on ice lane", ice: true, handler: "drift" },
      { id: "glideRock", label: "🪨 Glide rock", tip: "Rock slides with tiny friction", ice: true, handler: "glide" },
      { id: "glideTire", label: "🛞 Tire slide", tip: "Tire glides with low friction", ice: true, handler: "glideTire" },
      { id: "glideCrate", label: "📦 Heavy glide", tip: "Wide crate creeps on ice", ice: true, handler: "glideCrate" },
      { id: "puckDrift", label: "🛞 Fast tire", tip: "Fast tire on blue lane", ice: true, handler: "puckDrift" },
      { id: "shove", label: "👆 Shove car", tip: "Push keeps adding speed", ice: false, handler: "shove" },
      { id: "wakeRock", label: "😴 Wake the rock", tip: "Sleepy rock - drag to push", ice: false, handler: "wakeRock" },
      { id: "kickedBall", label: "🛞 Rolling tire", tip: "Tire rolls then friction wins", ice: false, handler: "kickedBall" },
    ],
  },
  {
    id: "compare",
    title: "Compare forces",
    presets: [
      { id: "race", label: "🏁 Light vs heavy", tip: "Same push, different mass", ice: true, handler: "race" },
      { id: "forceCompare", label: "💪 Weak vs strong push", tip: "Two crates, different shoves", ice: true, handler: "forceCompare" },
      { id: "frictionCompare", label: "🛑 Ice vs rough stop", tip: "Same start, different slide", ice: false, handler: "frictionCompare" },
    ],
  },
  {
    id: "pairs",
    title: "Pairs & collisions",
    presets: [
      { id: "recoil", label: "↔️ Recoil crates", tip: "Newton 3: equal push apart", ice: false, handler: "recoil" },
      { id: "wall", label: "🧱 Hit the wall", tip: "Wall pushes back", ice: false, wall: true, handler: "wall" },
      { id: "tugWar", label: "🪢 Tug-of-war", tip: "Teams pull the knot", ice: false, lessonScene: "tugOfWar", sceneArgs: { left: 2.8, right: 2.8, snapshot: true }, handler: "tugWar" },
    ],
  },
  {
    id: "forces",
    title: "Forces on objects",
    presets: [
      {
        id: "balancedBall",
        label: "⚖️ Balanced forces",
        tip: "Weight + support cancel",
        lessonScene: "rest",
        sceneArgs: { shape: "ball", arrows: true },
        spawns: [{ kind: "tire", x: 2.5, z: 0 }],
      },
      {
        id: "forceVectors",
        label: "🧭 Force arrows",
        tip: "Combine pushes like vectors",
        lessonScene: "vector",
        sceneArgs: { fx: 1.1, fy: 0.65 },
        spawns: [{ kind: "rocks", x: -2, z: 1.2 }],
      },
      {
        id: "rocketPush",
        label: "🚀 Rocket thrust",
        tip: "Exhaust down, rocket up",
        lessonScene: "recoil",
        sceneArgs: { variant: "thrust" },
        spawns: [
          { kind: "boxSmall", x: -1.5, z: 0 },
          { kind: "boxSmall", x: 1.5, z: 0 },
        ],
      },
    ],
  },
  {
    id: "ramps",
    title: "Ramps, ropes & pulleys",
    presets: [
      {
        id: "rampSlide",
        label: "📐 Ramp slide",
        tip: "Block on a slope",
        lessonScene: "ramp",
        sceneArgs: { angleDeg: 32, massKg: 6 },
        spawns: [{ kind: "cone", x: 3, z: 0 }],
      },
      {
        id: "ropeLift",
        label: "🏗️ Rope tension",
        tip: "Cable lifts a crate",
        lessonScene: "rope",
        spawns: [{ kind: "boxLarge", x: 2, z: -1.5 }],
      },
      {
        id: "pulley",
        label: "⚙️ Pulley pair",
        tip: "Two masses, one string",
        lessonScene: "pulley",
        sceneArgs: { mLeft: 4, mRight: 7 },
        spawns: [{ kind: "barrel", x: -2.5, z: 0 }],
      },
      {
        id: "elevator",
        label: "🛗 Elevator",
        tip: "Cab goes up and down",
        lessonScene: "elevator",
        spawns: [{ kind: "kart", x: 2.8, z: 0 }],
      },
    ],
  },
  {
    id: "orbit",
    title: "Orbit, drag & magnets",
    presets: [
      {
        id: "orbit",
        label: "🛰️ Orbit path",
        tip: "Satellite curves around Earth",
        lessonScene: "orbit",
        sceneArgs: { radius: 2.4, showGravity: true },
        spawns: [
          { kind: "carSedan", x: -2, z: 0 },
          { kind: "tire", x: 2, z: 0 },
        ],
      },
      {
        id: "magnetLift",
        label: "🧲 Magnet lift",
        tip: "Magnetic pull on metal",
        lessonScene: "magnet",
        sceneArgs: { focus: "both" },
        spawns: [{ kind: "barrel", x: 2, z: 0 }],
      },
      {
        id: "parachute",
        label: "🪂 Parachute",
        tip: "Air drag + weight",
        lessonScene: "parachute",
        spawns: [{ kind: "cone", x: -2.5, z: 0 }],
      },
    ],
  },
];

const PRESET_BY_ID = new Map();
for (const g of PLAYGROUND_PRESET_GROUPS) {
  for (const p of g.presets) PRESET_BY_ID.set(p.id, p);
}

export function getPlaygroundPreset(id) {
  return PRESET_BY_ID.get(id) || null;
}

export function allPlaygroundPresetIds() {
  return [...PRESET_BY_ID.keys()];
}
