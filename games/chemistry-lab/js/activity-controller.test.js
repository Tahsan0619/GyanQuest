/**
 * Focused unit checks for Chemistry Lab Level 1 helpers.
 * Run: node games/chemistry-lab/js/activity-controller.test.js
 */
import {
  createActivitySession,
  sortSlotPositions,
  heatPhase,
  shellCountsForProgress,
  pointOnRotatedEllipse,
  stopActivitySession,
} from "./activity-controller.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function approx(a, b, eps = 1e-6) {
  return Math.abs(a - b) < eps;
}

// Heat phases
assert(heatPhase(0.1) === "cold", "cold phase");
assert(heatPhase(0.4) === "melting", "melting phase");
assert(heatPhase(0.65) === "liquid", "liquid phase");
assert(heatPhase(0.9) === "simmer", "simmer phase");

// Shell counts 2 / 8 / 8
assert(JSON.stringify(shellCountsForProgress(0)) === "[]", "0 shells");
assert(JSON.stringify(shellCountsForProgress(1)) === "[2]", "shell 1");
assert(JSON.stringify(shellCountsForProgress(2)) === "[2,8]", "shell 2");
assert(JSON.stringify(shellCountsForProgress(3)) === "[2,8,8]", "shell 3");
assert(JSON.stringify(shellCountsForProgress(4)) === "[2,8,8]", "shell 3 capped");

// Rotated ellipse: electron path must match ring sample at ang=0
{
  const p0 = pointOnRotatedEllipse(100, 100, 40, 22, 0.4, 0);
  const expected = {
    x: 100 + 40 * Math.cos(0.4),
    y: 100 + 40 * Math.sin(0.4),
  };
  assert(approx(p0.x, expected.x, 1e-6), "ellipse x at ang0");
  assert(approx(p0.y, expected.y, 1e-6), "ellipse y at ang0");
}

// Sort slots do not collapse to one point
{
  const zone = { x: 0, y: 0, w: 300, h: 120 };
  const a = sortSlotPositions(zone, 4, 0);
  const b = sortSlotPositions(zone, 4, 1);
  const c = sortSlotPositions(zone, 4, 2);
  assert(a.x !== b.x || a.y !== b.y, "slots differ 0/1");
  assert(b.x !== c.x || b.y !== c.y, "slots differ 1/2");
}

// Session: place by id, complete once
{
  const s = createActivitySession();
  s.dispatch({ type: "PLACE_CHIP", chipId: "salt", zoneId: "yes", accept: ["salt", "ice"] });
  assert(s.getState().placed.salt === "yes", "placed salt");
  s.dispatch({ type: "PLACE_CHIP", chipId: "light", zoneId: "yes", accept: ["salt"] });
  // wrong zone should not place when accept rejects - reducer returns early after notify
  // (placed unchanged for light)
  assert(!s.getState().placed.light, "reject wrong chip");

  let completes = 0;
  s.dispatch({ type: "ACTIVITY_COMPLETE" });
  completes++;
  s.dispatch({ type: "ACTIVITY_COMPLETE" });
  completes++;
  assert(s.getState().completed === true, "completed flag");
  // second complete is latched - state stays completed; mount once() handles UI
  stopActivitySession();
}

// Heat set
{
  const s = createActivitySession({ heat: 0.1 });
  s.dispatch({ type: "SET_HEAT", value: 0.9 });
  assert(approx(s.getState().heat, 0.9), "heat set");
  s.dispatch({ type: "NUDGE_HEAT", delta: 0.2 });
  assert(approx(s.getState().heat, 1), "heat clamp");
  stopActivitySession();
}

console.log("activity-controller tests: OK");
