/**
 * Mission catalog
 */
export const MISSIONS = [
 {
 "id": "tables-rows",
 "kidTitle": "Tables & Rows",
 "theme": "rows columns",
 "emoji": "\u25a6",
 "rewardName": "Table Scout",
 "hook": "Data lives in neat rows and columns.",
 "accent": "#2dd4bf",
 "accent2": "#0f766e",
 "icon": "leaf",
 "playable": true
 },
 {
 "id": "select-stories",
 "kidTitle": "SELECT Stories",
 "theme": "query basics",
 "emoji": "\ud83d\udd0e",
 "rewardName": "Query Kid",
 "hook": "Ask the table - SELECT finds the answer.",
 "accent": "#2dd4bf",
 "accent2": "#0f766e",
 "icon": "leaf",
 "playable": true
 },
 {
 "id": "keys-joins",
 "kidTitle": "Keys & Joins",
 "theme": "linking tables",
 "emoji": "\ud83d\udd17",
 "rewardName": "Join Junior",
 "hook": "Keys link tables so stories stay connected.",
 "accent": "#2dd4bf",
 "accent2": "#0f766e",
 "icon": "leaf",
 "playable": true
 },
 {
 "id": "soon-4",
 "kidTitle": "Mission 4",
 "theme": "soon",
 "emoji": "\ud83d\udd12",
 "rewardName": "Soon",
 "hook": "Coming soon - this mission is still being built.",
 "accent": "#64748b",
 "accent2": "#334155",
 "icon": "leaf",
 "playable": false
 },
 {
 "id": "soon-5",
 "kidTitle": "Mission 5",
 "theme": "soon",
 "emoji": "\ud83d\udd12",
 "rewardName": "Soon",
 "hook": "Coming soon - this mission is still being built.",
 "accent": "#64748b",
 "accent2": "#334155",
 "icon": "leaf",
 "playable": false
 },
 {
 "id": "soon-6",
 "kidTitle": "Mission 6",
 "theme": "soon",
 "emoji": "\ud83d\udd12",
 "rewardName": "Soon",
 "hook": "Coming soon - this mission is still being built.",
 "accent": "#64748b",
 "accent2": "#334155",
 "icon": "leaf",
 "playable": false
 },
 {
 "id": "soon-7",
 "kidTitle": "Mission 7",
 "theme": "soon",
 "emoji": "\ud83d\udd12",
 "rewardName": "Soon",
 "hook": "Coming soon - this mission is still being built.",
 "accent": "#64748b",
 "accent2": "#334155",
 "icon": "leaf",
 "playable": false
 },
 {
 "id": "soon-8",
 "kidTitle": "Mission 8",
 "theme": "soon",
 "emoji": "\ud83d\udd12",
 "rewardName": "Soon",
 "hook": "Coming soon - this mission is still being built.",
 "accent": "#64748b",
 "accent2": "#334155",
 "icon": "leaf",
 "playable": false
 },
 {
 "id": "soon-9",
 "kidTitle": "Mission 9",
 "theme": "soon",
 "emoji": "\ud83d\udd12",
 "rewardName": "Soon",
 "hook": "Coming soon - this mission is still being built.",
 "accent": "#64748b",
 "accent2": "#334155",
 "icon": "leaf",
 "playable": false
 },
 {
 "id": "soon-10",
 "kidTitle": "Mission 10",
 "theme": "soon",
 "emoji": "\ud83d\udd12",
 "rewardName": "Soon",
 "hook": "Coming soon - this mission is still being built.",
 "accent": "#64748b",
 "accent2": "#334155",
 "icon": "leaf",
 "playable": false
 }
];

export function missionUnlocked(index, completed) {
 if (MISSIONS[index]?.playable) return true;
 if (index === 0) return true;
 const prev = completed?.[index - 1];
 if (!Array.isArray(prev)) return false;
 return prev.every(Boolean);
}

export function subUnlocked(levelIdx, subIdx, completed, currentSub) {
 if (subIdx === currentSub) return true;
 const row = completed?.[levelIdx];
 if (!row) return subIdx === 0;
 if (row[subIdx]) return true;
 if (subIdx === 0) return true;
 return !!row[subIdx - 1];
}

export function missionIconSvg(kind) {
 const common = 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5"';
 return `<svg ${common}><circle cx="32" cy="32" r="14"/></svg>`;
}
