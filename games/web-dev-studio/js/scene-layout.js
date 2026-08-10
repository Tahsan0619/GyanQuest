/**
 * Shared responsive lab layout - one desk/stove baseline for all scenes.
 */

export function computeLabLayout(w, h) {
 const s = Math.min(w, h) / 420;
 const deskTop = h * 0.62;
 const deskH = Math.max(18, h * 0.055);
 const floorY = h * 0.78;
 const margin = Math.max(16, w * 0.04);

 return {
 w,
 h,
 s,
 deskTop,
 deskH,
 deskY: deskTop + deskH * 0.35,
 floorY,
 margin,
 // Prop feet sit ON the desk surface
 leftProp: { x: w * 0.18, footY: deskTop },
 midProp: { x: w * 0.48, footY: deskTop },
 rightProp: { x: w * 0.78, footY: deskTop },
 center: { x: w * 0.5, y: h * 0.38 },
 stove: {
 x: w * 0.62,
 y: deskTop,
 w: Math.min(160, w * 0.28),
 h: Math.max(14, h * 0.035),
 },
 sortZones: {
 yes: { x: margin, y: h * 0.1, w: w * 0.42, h: h * 0.22 },
 no: { x: w * 0.52, y: h * 0.1, w: w * 0.42 - margin * 0.2, h: h * 0.22 },
 },
 bankY: deskTop - Math.max(70, h * 0.16),
 labelY: h * 0.09,
 orbitRadii: [Math.max(28, 36 * s), Math.max(48, 58 * s), Math.max(68, 82 * s)],
 };
}

export function footAlign(footY, localBottomOffset) {
 return footY - localBottomOffset;
}

/** Cup local geometry: bottom at +30 when scale=1 */
export const CUP_FOOT = 30;
/** Bottle local geometry: bottom at +48 when scale=1 */
export const BOTTLE_FOOT = 48;
/** Pan local geometry: bottom of flames ~+28, pan body bottom ~+10 */
export const PAN_FOOT = 10;
/** Salt shaker local bottom ~+18 */
export const SHAKER_FOOT = 18;
