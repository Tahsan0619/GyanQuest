/**
 * Spectator pacing: keep at 1 for responsive play. Raise slightly (e.g. 1.25) only if you want a calmer demo.
 */
export const LAB_DWELL_MULT = 1;

/** 1 = normal 3D motion; higher values slow the arena for “slow motion” demos only. */
export const SCENE_MOTION_MULT = 1;

export function scaledDwellMs(baseMs) {
  return Math.round(baseMs * LAB_DWELL_MULT);
}

export function spectatorPauseMs(baseMs) {
  return Math.round(baseMs * SCENE_MOTION_MULT);
}

/** After a rock push, safety cap on RAF loops before forcing sub-level completion. */
export const ROCK_PROGRESS_FRAMES_CAP = 600 * SCENE_MOTION_MULT;
