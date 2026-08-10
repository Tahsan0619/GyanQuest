/** Persistence helpers for curriculum games. (ped3: fluency/predict/streak/hint/conceptLog) */

export const REWARD_ICONS = ["⭐", "🏅", "🎖️", "🌟", "💫", "🎯", "🔥", "✨", "🎁", "👑"];

export const SOLO_TIERS = [
 "unistructural",
 "multistructural",
 "relational",
 "extended-abstract",
];

/** Map star count (1-4+) to SOLO tier name. Decision: additive field; stars still primary. */
export function soloTierFromStars(stars) {
 const n = typeof stars === "number" ? stars : 0;
 if (n >= 4) return "extended-abstract";
 if (n >= 3) return "relational";
 if (n >= 2) return "multistructural";
 if (n >= 1) return "unistructural";
 return null;
}

export function loadSave(storageKey) {
 try {
 const raw = localStorage.getItem(storageKey);
 if (!raw) return null;
 return JSON.parse(raw);
 } catch {
 return null;
 }
}

export function saveGame(storageKey, state) {
 try {
 localStorage.setItem(
 storageKey,
 JSON.stringify({
 level: state.level,
 sub: state.sub,
 // Which screen was open - hub vs in-mission play (restore on reload).
 inHub: state.inHub !== false,
 completed: state.completed,
 rewards: state.rewards || [],
 introSeen: state.introSeen || [],
 // Additive fields - older saves omit these; normalize* fills defaults on load.
 fluencyScores: state.fluencyScores || [],
 predictions: state.predictions || [],
 streaks: state.streaks || { wrong: 0, correct: 0 },
 hintTiers: state.hintTiers || {},
 conceptLog: state.conceptLog || [],
 }),
 );
 } catch {
 /* private */
 }
 // Optional Sanctum sync - never blocks gameplay (auth-api may be absent offline).
 try {
 const gameId = gameIdFromStorageKey(storageKey);
 if (gameId && typeof window !== "undefined") {
 import("/engine/js/auth-api.js?v=1")
 .then((m) => m.syncProgress?.(gameId, state))
 .catch(() => {});
 }
 } catch {
 /* ignore */
 }
}

function gameIdFromStorageKey(storageKey) {
 const m = String(storageKey || "").match(/^gq-(.+)-save-v\d+$/);
 return m ? m[1] : null;
}

export function clearSave(storageKey) {
 try {
 localStorage.removeItem(storageKey);
 } catch {
 /* ignore */
 }
}

export function normalizeCompleted(completed, nLevels = 10, nSubs = 10) {
 const out = [];
 for (let l = 0; l < nLevels; l++) {
 const row = Array.isArray(completed?.[l]) ? completed[l] : [];
 out.push(Array.from({ length: nSubs }, (_, i) => Boolean(row[i])));
 }
 return out;
}

export function normalizeIntroSeen(introSeen, nLevels = 10) {
 return Array.from({ length: nLevels }, (_, i) => Boolean(introSeen?.[i]));
}

export function normalizeRewards(rewards, nLevels = 10) {
 const base = Array.from({ length: nLevels }, () => ({
 earned: false,
 stars: 0,
 tier: null,
 }));
 if (!Array.isArray(rewards)) return base;
 return base.map((def, i) => {
 const r = rewards[i];
 if (!r || typeof r !== "object") return def;
 const stars = typeof r.stars === "number" ? r.stars : 0;
 const earned = Boolean(r.earned);
 // Prefer saved tier; else derive from stars when earned (additive, non-breaking).
 const tier =
 typeof r.tier === "string" && r.tier
 ? r.tier
 : earned
 ? soloTierFromStars(stars)
 : null;
 return { earned, stars, tier };
 });
}

/** Fluency ratio per level (0-1). Absent → 0. */
export function normalizeFluencyScores(scores, nLevels = 10) {
 return Array.from({ length: nLevels }, (_, i) => {
 const v = Array.isArray(scores) ? scores[i] : 0;
 return typeof v === "number" && v >= 0 ? Math.min(1, v) : 0;
 });
}

/** Per-level prediction answer index or null. */
export function normalizePredictions(preds, nLevels = 10) {
 return Array.from({ length: nLevels }, (_, i) => {
 const v = Array.isArray(preds) ? preds[i] : null;
 return v === null || v === undefined ? null : v;
 });
}

export function normalizeStreaks(streaks) {
 if (!streaks || typeof streaks !== "object") return { wrong: 0, correct: 0 };
 return {
 wrong: typeof streaks.wrong === "number" ? streaks.wrong : 0,
 correct: typeof streaks.correct === "number" ? streaks.correct : 0,
 };
}

export function normalizeHintTiers(hintTiers) {
 return hintTiers && typeof hintTiers === "object" ? { ...hintTiers } : {};
}

export function normalizeConceptLog(log) {
 if (!Array.isArray(log)) return [];
 return log
 .filter((e) => e && typeof e.term === "string")
 .map((e) => ({
 term: e.term,
 subject: e.subject || "",
 level: typeof e.level === "number" ? e.level : 0,
 timestamp: e.timestamp || 0,
 }))
 .slice(-200);
}

export function levelDoneCount(completed, levelIdx) {
 const row = completed?.[levelIdx];
 return Array.isArray(row) ? row.filter(Boolean).length : 0;
}

/** Mastery (sub index 9) requires fluency sub (index 8) score >= 0.8 or that sub completed. */
export function canEnterMastery(state, levelIdx) {
 const fluency = state.fluencyScores?.[levelIdx] ?? 0;
 if (fluency >= 0.8) return true;
 // Decision: if fluency sub marked complete, treat as passed (mountSpeedDrill already gates onDone).
 return Boolean(state.completed?.[levelIdx]?.[8]);
}
