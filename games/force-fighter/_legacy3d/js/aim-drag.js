/**
 * Shared canvas interaction: pick → drag aim arrow → release applies impulse.
 * Object stays still until pointerup (no click-to-push / no move-while-dragging).
 */
const THREE = window.THREE;

/**
 * @param {{
 *   canvas: HTMLCanvasElement;
 *   pointOnGround: (e: PointerEvent) => THREE.Vector3;
 *   onPick: (e: PointerEvent) => unknown | null;
 *   getOrigin: (target: unknown) => THREE.Vector3;
 *   onAimStart?: (target: unknown) => void;
 *   onAimEnd?: (target: unknown | null) => void;
 *   onMiss?: (e: PointerEvent) => void;
 *   validateRelease?: (dx: number, dz: number, len: number) => string | null;
 *   onShortDrag?: () => void;
 *   onValidateFail?: (message: string) => void;
 *   onImpulse: (target: unknown, dx: number, dz: number, len: number) => void;
 *   setArrow: (from: THREE.Vector3, to: THREE.Vector3) => void;
 *   clearArrow: () => void;
 *   arrowYOffset?: number;
 *   minLen?: number;
 * }} opts
 */
export function bindAimDragPush(opts) {
  const {
    canvas,
    pointOnGround,
    onPick,
    getOrigin,
    onAimStart,
    onAimEnd,
    onMiss,
    validateRelease,
    onShortDrag,
    onValidateFail,
    onImpulse,
    setArrow,
    clearArrow,
    arrowYOffset = 0.85,
    minLen = 0.35,
  } = opts;

  let active = false;
  let pointerId = null;
  /** @type {THREE.Vector3 | null} */
  let start = null;
  /** @type {unknown} */
  let target = null;

  function stopDocDrag() {
    document.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerup", onUp);
    document.removeEventListener("pointercancel", onUp);
  }

  function cleanup() {
    stopDocDrag();
    canvas.removeEventListener("pointerdown", onDown);
    clearArrow();
    if (active && onAimEnd) onAimEnd(target);
    active = false;
    pointerId = null;
    start = null;
    target = null;
  }

  function onDown(e) {
    if (e.button != null && e.button !== 0) return;
    const picked = onPick(e);
    if (!picked) {
      onMiss?.(e);
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    target = picked;
    active = true;
    pointerId = e.pointerId;
    start = getOrigin(picked).clone();
    onAimStart?.(picked);
    clearArrow();
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch (_) {
      /* ignore */
    }
    stopDocDrag();
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    document.addEventListener("pointercancel", onUp);
  }

  function onMove(e) {
    if (!active || (pointerId != null && e.pointerId !== pointerId) || !start) return;
    e.preventDefault();
    const p = pointOnGround(e);
    const arrowY = start.y + arrowYOffset;
    setArrow(
      new THREE.Vector3(start.x, arrowY, start.z),
      new THREE.Vector3(p.x, arrowY, p.z)
    );
  }

  function onUp(e) {
    if (!active || (pointerId != null && e.pointerId !== pointerId) || !start) return;
    e.preventDefault();
    const capId = e.pointerId;
    const picked = target;
    const origin = start.clone();
    active = false;
    pointerId = null;
    target = null;
    start = null;
    stopDocDrag();
    onAimEnd?.(picked);
    try {
      canvas.releasePointerCapture(capId);
    } catch (_) {
      /* ignore */
    }
    const p = pointOnGround(e);
    const dx = p.x - origin.x;
    const dz = p.z - origin.z;
    const len = Math.hypot(dx, dz);
    clearArrow();
    if (len < minLen) {
      onShortDrag?.();
      return;
    }
    const err = validateRelease?.(dx, dz, len);
    if (err) {
      onValidateFail?.(err);
      return;
    }
    onImpulse(picked, dx, dz, len);
  }

  canvas.addEventListener("pointerdown", onDown);
  return cleanup;
}
