/**
 * Shared activity controller - one reducer, dual views (canvas + panel).
 * Canvas hits and dock controls dispatch the same intents.
 */

let activeSession = null;
const listeners = new Set();

export function getActiveSession() {
 return activeSession;
}

export function createActivitySession(initial = {}) {
 stopActivitySession();
 const state = {
 completed: false,
 selectedId: null,
 placed: {}, // chipId -> zoneId
 heat: 0.12,
 energy: 0.12,
 tokenOrder: [],
 masteryOrder: [],
 mythIndex: 0,
 mythPhase: "claim", // claim | wrong | truth
 mythChoice: null,
 drillIndex: 0,
 drillCorrect: 0,
 scale: 0,
 mode: "balloon",
 phase: "zoom",
 reveal: false,
 prompt: "",
 bustedAt: 0,
 ...initial,
 };

 const cleanups = [];
 let completedLatch = false;

 function getState() {
 return state;
 }

 function notify() {
 for (const fn of listeners) {
 try {
 fn(state);
 } catch {
 /* ignore */
 }
 }
 // Mirror into chemLabState for scene ticks that still read the bag.
 if (typeof window !== "undefined" && window.__chemMirror) {
 window.__chemMirror(state);
 }
 }

 function subscribe(fn) {
 listeners.add(fn);
 return () => listeners.delete(fn);
 }

 function dispatch(intent) {
 if (!intent || typeof intent !== "object") return state;
 const type = intent.type;

 switch (type) {
 case "SELECT_CHIP":
 state.selectedId = intent.id || null;
 break;
 case "PLACE_CHIP": {
 const { chipId, zoneId, accept } = intent;
 if (!chipId || !zoneId) break;
 if (Array.isArray(accept) && !accept.includes(chipId)) {
 notify();
 return { ...state, _lastError: "wrong_zone" };
 }
 state.placed[chipId] = zoneId;
 state.selectedId = null;
 state.placedVersion = (state.placedVersion || 0) + 1;
 break;
 }
 case "RESET_SORT":
 state.placed = {};
 state.selectedId = null;
 state.reveal = false;
 state.completed = false;
 completedLatch = false;
 state.placedVersion = (state.placedVersion || 0) + 1;
 break;
 case "SET_HEAT": {
 const v = Math.max(0, Math.min(1, Number(intent.value) || 0));
 state.heat = v;
 state.energy = v;
 break;
 }
 case "NUDGE_HEAT": {
 const v = Math.max(0, Math.min(1, state.heat + (Number(intent.delta) || 0)));
 state.heat = v;
 state.energy = v;
 break;
 }
 case "PUSH_TOKEN":
 if (intent.id && !state.tokenOrder.includes(intent.id)) {
 state.tokenOrder = [...state.tokenOrder, intent.id];
 }
 break;
 case "UNDO_TOKEN":
 state.tokenOrder = state.tokenOrder.slice(0, -1);
 break;
 case "RESET_TOKENS":
 state.tokenOrder = [];
 state.completed = false;
 completedLatch = false;
 break;
 case "PUSH_MASTERY":
 if (intent.id && !state.masteryOrder.includes(intent.id)) {
 state.masteryOrder = [...state.masteryOrder, intent.id];
 }
 break;
 case "RESET_MASTERY":
 state.masteryOrder = [];
 state.completed = false;
 completedLatch = false;
 break;
 case "SET_MYTH":
 state.mythIndex = intent.index ?? 0;
 state.mythPhase = "claim";
 state.mythChoice = null;
 state.bustedAt = 0;
 break;
 case "MYTH_CHOOSE":
 state.mythChoice = intent.choice;
 if (intent.choice === "bust") {
 state.mythPhase = "truth";
 state.bustedAt = performance.now();
 } else {
 state.mythPhase = "wrong";
 }
 break;
 case "SET_DRILL":
 state.drillIndex = intent.index ?? 0;
 state.prompt = intent.prompt || "";
 break;
 case "DRILL_ANSWER":
 if (intent.correct) state.drillCorrect += 1;
 state.drillIndex += 1;
 break;
 case "SET_SCALE":
 state.scale = Math.max(0, Math.min(1, Number(intent.value) || 0));
 break;
 case "SET_MODE":
 state.mode = intent.mode || state.mode;
 break;
 case "SET_PHASE":
 state.phase = intent.phase || state.phase;
 break;
 case "SET_REVEAL":
 state.reveal = !!intent.value;
 break;
 case "ACTIVITY_COMPLETE":
 if (completedLatch) return state;
 completedLatch = true;
 state.completed = true;
 break;
 case "PATCH":
 Object.assign(state, intent.patch || {});
 break;
 default:
 break;
 }

 notify();
 return state;
 }

 function onCleanup(fn) {
 if (typeof fn === "function") cleanups.push(fn);
 }

 function stop() {
 for (const fn of cleanups.splice(0)) {
 try {
 fn();
 } catch {
 /* ignore */
 }
 }
 listeners.clear();
 if (activeSession === api) activeSession = null;
 }

 const api = { getState, dispatch, subscribe, onCleanup, stop };
 activeSession = api;
 notify();
 return api;
}

export function stopActivitySession() {
 if (activeSession) {
 try {
 activeSession.stop();
 } catch {
 /* ignore */
 }
 }
 activeSession = null;
}

/** Pure helpers used by tests and mounts */
export function sortSlotPositions(zoneRect, count, index) {
 const cols = Math.min(3, Math.max(1, count));
 const rows = Math.ceil(count / cols);
 const col = index % cols;
 const row = Math.floor(index / cols);
 const padX = zoneRect.w * 0.12;
 const padY = zoneRect.h * 0.18;
 const cellW = (zoneRect.w - padX * 2) / cols;
 const cellH = (zoneRect.h - padY * 2) / rows;
 return {
 x: zoneRect.x + padX + cellW * (col + 0.5),
 y: zoneRect.y + padY + cellH * (row + 0.5),
 };
}

export function heatPhase(heat) {
 const h = Math.max(0, Math.min(1, heat));
 if (h < 0.28) return "cold";
 if (h < 0.55) return "melting";
 if (h < 0.78) return "liquid";
 return "simmer";
}

export function shellCountsForProgress(progress) {
 const p = Math.max(0, Math.floor(progress));
 if (p <= 0) return [];
 if (p === 1) return [2];
 if (p === 2) return [2, 8];
 return [2, 8, 8];
}

export function pointOnRotatedEllipse(cx, cy, rx, ry, rot, ang) {
 const cosR = Math.cos(rot);
 const sinR = Math.sin(rot);
 const lx = Math.cos(ang) * rx;
 const ly = Math.sin(ang) * ry;
 return {
 x: cx + lx * cosR - ly * sinR,
 y: cy + lx * sinR + ly * cosR,
 };
}
