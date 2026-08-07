/**
 * Mission catalog
 */
export const MISSIONS = [
  {
    "id": "password-power",
    "kidTitle": "Password Power",
    "theme": "long unique secrets beat short easy ones",
    "emoji": "\ud83d\udd10",
    "rewardName": "Password Pro",
    "hook": "Strong passwords are long, unique, and hard to guess - not your name or 1234.",
    "accent": "#f87171",
    "accent2": "#b91c1c",
    "icon": "leaf",
    "playable": true
  },
  {
    "id": "soon-2",
    "kidTitle": "Mission 2",
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
    "id": "soon-3",
    "kidTitle": "Mission 3",
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
