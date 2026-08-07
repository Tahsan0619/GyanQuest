/**
 * Mission catalog
 */
export const MISSIONS = [
  {
    "id": "circuit-loop",
    "kidTitle": "Circuit Loop",
    "theme": "closed path lights the bulb",
    "emoji": "\ud83d\udd0c",
    "rewardName": "Loop Learner",
    "hook": "Battery, wires, switch, bulb - one closed path.",
    "accent": "#facc15",
    "accent2": "#a16207",
    "icon": "leaf",
    "playable": true
  },
  {
    "id": "voltage-current",
    "kidTitle": "Voltage & Current",
    "theme": "V pushes / I flows",
    "emoji": "\ud83d\udd0b",
    "rewardName": "Volt Scout",
    "hook": "Voltage is the push. Current is the flow.",
    "accent": "#facc15",
    "accent2": "#a16207",
    "icon": "leaf",
    "playable": true
  },
  {
    "id": "safe-power",
    "kidTitle": "Safe Power",
    "theme": "dry hands / insulation / respect live wires",
    "emoji": "\u26d1\ufe0f",
    "rewardName": "Safety Star",
    "hook": "Dry hands, good insulation, never poke live sockets.",
    "accent": "#facc15",
    "accent2": "#a16207",
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
