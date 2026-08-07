/**
 * Chemistry Lab - 10 mission catalog (hub cards + progression).
 * Live: Tiny Bits (M1) + Element Hunt (M2) + Bond Buddies (M3).
 * Unlock next mission after previous mission’s 10 steps are done.
 */
export const MISSIONS = [
  {
    id: "tiny-bits",
    kidTitle: "Tiny Bits",
    theme: "particles of matter",
    emoji: "⚗️",
    rewardName: "Tiny Rookie",
    hook: "Salt, ice, and steam reveal tiny moving particles.",
    accent: "#0ea5e9",
    accent2: "#0369a1",
    icon: "atom",
    playable: true,
  },
  {
    id: "element-hunt",
    kidTitle: "Element Hunt",
    theme: "elements",
    emoji: "🔎",
    rewardName: "Element Scout",
    hook: "Hunt pure substances and name the building blocks.",
    accent: "#22d3ee",
    accent2: "#0e7490",
    icon: "flask",
    playable: true,
  },
  {
    id: "bond-buddies",
    kidTitle: "Bond Buddies",
    theme: "bonds",
    emoji: "🤝",
    rewardName: "Bond Explorer",
    hook: "See how atoms link up as friends and families.",
    accent: "#a78bfa",
    accent2: "#6d28d9",
    icon: "bond",
    playable: true,
  },
  {
    id: "mix-match",
    kidTitle: "Mix & Match",
    theme: "mixtures",
    emoji: "🧪",
    rewardName: "Mix Builder",
    hook: "Separate, dissolve, and sort everyday mixtures.",
    accent: "#34d399",
    accent2: "#047857",
    icon: "mix",
    playable: false,
  },
  {
    id: "reaction-time",
    kidTitle: "Reaction Time",
    theme: "reactions",
    emoji: "⚡",
    rewardName: "Reaction Analyst",
    hook: "Watch matter rearrange when reactions fire.",
    accent: "#fbbf24",
    accent2: "#b45309",
    icon: "bolt",
    playable: false,
  },
  {
    id: "acid-base",
    kidTitle: "Acid & Base",
    theme: "acids",
    emoji: "🍋",
    rewardName: "Acid Strategist",
    hook: "Taste-safe clues for sour, soapy, and neutral.",
    accent: "#f472b6",
    accent2: "#be185d",
    icon: "ph",
    playable: false,
  },
  {
    id: "states-matter",
    kidTitle: "States of Matter",
    theme: "states",
    emoji: "🧊",
    rewardName: "States Guardian",
    hook: "Solid, liquid, gas - same stuff, different motion.",
    accent: "#7dd3fc",
    accent2: "#0369a1",
    icon: "states",
    playable: false,
  },
  {
    id: "periodic-path",
    kidTitle: "Periodic Path",
    theme: "periodic",
    emoji: "🗺️",
    rewardName: "Periodic Scholar",
    hook: "Walk the table’s neighborhoods and patterns.",
    accent: "#67e8f9",
    accent2: "#0f766e",
    icon: "table",
    playable: false,
  },
  {
    id: "lab-safety",
    kidTitle: "Lab Safety",
    theme: "safety",
    emoji: "🥽",
    rewardName: "Lab Mentor",
    hook: "Gear up and keep the lab safe for everyone.",
    accent: "#fb923c",
    accent2: "#c2410c",
    icon: "shield",
    playable: false,
  },
  {
    id: "chem-boss",
    kidTitle: "Chem Boss",
    theme: "synthesis",
    emoji: "👑",
    rewardName: "Chem Champion",
    hook: "Bring every Tiny Bits skill into one final challenge.",
    accent: "#facc15",
    accent2: "#a16207",
    icon: "crown",
    playable: false,
  },
];

export function missionUnlocked(index, completed) {
  // Live missions with playable:true are always open (Tiny Bits, Element Hunt, Bond Buddies).
  if (MISSIONS[index]?.playable) return true;
  if (index === 0) return true;
  // Unlock next "Soon" mission only after previous mission’s 10 subs are done.
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

/** Inline SVG icons for hub cards (no external assets required). */
export function missionIconSvg(kind) {
  const common = 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5"';
  switch (kind) {
    case "flask":
      return `<svg ${common}><path d="M26 8h12v14l14 28a8 8 0 01-7 12H19a8 8 0 01-7-12l14-28V8z"/><path d="M22 40h20"/></svg>`;
    case "bond":
      return `<svg ${common}><circle cx="18" cy="32" r="10"/><circle cx="46" cy="32" r="10"/><path d="M28 32h8"/></svg>`;
    case "mix":
      return `<svg ${common}><rect x="10" y="18" width="20" height="28" rx="4"/><rect x="34" y="18" width="20" height="28" rx="4"/><path d="M20 32h24"/></svg>`;
    case "bolt":
      return `<svg ${common}><path d="M34 8L18 36h14L28 56l20-32H34L38 8z" fill="currentColor" stroke="none"/></svg>`;
    case "ph":
      return `<svg ${common}><path d="M20 12c0 20 24 20 24 40"/><circle cx="20" cy="12" r="4" fill="currentColor"/><circle cx="44" cy="52" r="4" fill="currentColor"/></svg>`;
    case "states":
      return `<svg ${common}><rect x="8" y="36" width="16" height="16" rx="2"/><ellipse cx="32" cy="44" rx="10" ry="8"/><circle cx="52" cy="20" r="3"/><circle cx="46" cy="28" r="2"/><circle cx="56" cy="30" r="2.5"/></svg>`;
    case "table":
      return `<svg ${common}><rect x="8" y="12" width="48" height="40" rx="4"/><path d="M8 24h48M8 36h48M24 12v40M40 12v40"/></svg>`;
    case "shield":
      return `<svg ${common}><path d="M32 8l20 8v16c0 14-10 22-20 26C22 54 12 46 12 32V16l20-8z"/></svg>`;
    case "crown":
      return `<svg ${common}><path d="M10 44h44L48 22l-10 10L32 14 26 32 16 22 10 44z" fill="currentColor" stroke="none"/></svg>`;
    case "atom":
    default:
      return `<svg ${common}><circle cx="32" cy="32" r="6" fill="currentColor" stroke="none"/><ellipse cx="32" cy="32" rx="22" ry="10"/><ellipse cx="32" cy="32" rx="22" ry="10" transform="rotate(60 32 32)"/><ellipse cx="32" cy="32" rx="22" ry="10" transform="rotate(-60 32 32)"/></svg>`;
  }
}
