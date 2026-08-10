/** Scale dwell timers so lessons feel paced but not slow. */
export const SCENE_MOTION_MULT = 1;

export function scaledDwellMs(base = 2200) {
 return Math.max(900, Math.round(base * 0.85));
}
