/**
 * GyanQuest 3-tier mission status (Playable / Under Development / Coming Soon).
 * FINISHED SET = uniqueness-pass complete. Other playable:true → Under Development.
 */

/** @type {Record<string, number[]>} slug → 0-based mission indices */
export const FINISHED_SET = {
 "chemistry-lab": [0, 1, 2],
 "force-fighter": [0, 1, 2],
 "bio-explorer": [0, 1, 2],
 "math-quest": [0],
 "eco-guardian": [0],
 "ict-fundamentals": [0, 1],
 "web-dev-studio": [0, 1, 2],
 "backend-builder": [0],
 "database-sql": [0],
 "ai-lab": [0],
 "ml-lab": [0],
 "electrical-basics": [0],
 "mechanical-basics": [0],
 "civil-basics": [0],
 "astronomy-space": [0],
 "statistics-probability": [0],
};

/** @returns {string} game folder slug from /games/{slug}/ */
export function detectGameSlug(pathname = typeof location !== "undefined" ? location.pathname : "") {
 const m = String(pathname || "").match(/\/games\/([^/]+)/);
 return m?.[1] || "";
}

/**
 * @param {string} gameSlug
 * @param {number} missionIndex
 * @param {boolean} playable
 * @returns {{ id: "playable"|"dev"|"soon", label: string }}
 */
export function missionContentTier(gameSlug, missionIndex, playable) {
 if (!playable) return { id: "soon", label: "Coming Soon" };
 const finished = (FINISHED_SET[gameSlug] || []).includes(missionIndex);
 if (finished) return { id: "playable", label: "Playable" };
 return { id: "dev", label: "Under Development" };
}

/**
 * Catalog-card tier for a game slug.
 * @param {string} gameSlug
 * @param {boolean} hasAnyPlayable
 * @returns {{ id: "playable"|"dev"|"soon", label: string }}
 */
export function catalogGameTier(gameSlug, hasAnyPlayable = true) {
 const finished = FINISHED_SET[gameSlug] || [];
 if (finished.length > 0) return { id: "playable", label: "Playable" };
 if (hasAnyPlayable) return { id: "dev", label: "Under Development" };
 return { id: "soon", label: "Coming Soon" };
}
