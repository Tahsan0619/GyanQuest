/**
 * Force Fighter - 10 mission catalog (hub cards).
 * Live: Lazy Rock (M1) + Push Power (M2) + Push & Pull Pairs (M3).
 */
export const MISSIONS = [
  {
    id: "lazy-rock",
    kidTitle: "The Lazy Rock",
    theme: "inertia",
    emoji: "🪨",
    rewardName: "Rock Rookie",
    hook: "Wake a sleepy rock - still until an unbalanced push.",
    accent: "#f59e0b",
    accent2: "#b45309",
    icon: "rock",
    playable: true,
  },
  {
    id: "push-power",
    kidTitle: "Push Power",
    theme: "F = m·a",
    emoji: "🏎️",
    rewardName: "Speed Star",
    hook: "Same push - light things accelerate more.",
    accent: "#f97316",
    accent2: "#c2410c",
    icon: "bolt",
    playable: true,
  },
  {
    id: "force-pairs",
    kidTitle: "Push & Pull Pairs",
    theme: "Newton 3",
    emoji: "🤝",
    rewardName: "Team Force",
    hook: "Every push has a partner push back.",
    accent: "#a78bfa",
    accent2: "#6d28d9",
    icon: "pair",
    playable: true,
  },
  {
    id: "friction-fun",
    kidTitle: "Friction Fun",
    theme: "friction",
    emoji: "🛞",
    rewardName: "Grip Guru",
    hook: "Friction helps you stop - brakes and muddy paths.",
    accent: "#94a3b8",
    accent2: "#475569",
    icon: "shield",
    playable: false,
  },
  {
    id: "forces-balance",
    kidTitle: "Forces in Balance",
    theme: "equilibrium",
    emoji: "⚖️",
    rewardName: "Balance Boss",
    hook: "When forces balance, motion stays steady.",
    accent: "#38bdf8",
    accent2: "#0284c7",
    icon: "states",
    playable: false,
  },
  {
    id: "ramp-slide",
    kidTitle: "Ramp & Slide",
    theme: "ramps",
    emoji: "📐",
    rewardName: "Slope Scout",
    hook: "On a slide, gravity helps you roll downhill.",
    accent: "#34d399",
    accent2: "#047857",
    icon: "table",
    playable: false,
  },
  {
    id: "rope-rescue",
    kidTitle: "Rope Rescue",
    theme: "tension",
    emoji: "🪢",
    rewardName: "Rope Ranger",
    hook: "Ropes and chains pull - tug and lift.",
    accent: "#f472b6",
    accent2: "#be185d",
    icon: "bond",
    playable: false,
  },
  {
    id: "push-pull-together",
    kidTitle: "Push & Pull Together",
    theme: "vectors",
    emoji: "🧭",
    rewardName: "Direction Pro",
    hook: "Forces have direction - push vs friction.",
    accent: "#22d3ee",
    accent2: "#0e7490",
    icon: "mix",
    playable: false,
  },
  {
    id: "force-mix",
    kidTitle: "Force Mix",
    theme: "combined",
    emoji: "🧲",
    rewardName: "Magnet Master",
    hook: "Many forces at once - push, gravity, magnet.",
    accent: "#e879f9",
    accent2: "#a21caf",
    icon: "flask",
    playable: false,
  },
  {
    id: "force-boss",
    kidTitle: "Force Boss",
    theme: "synthesis",
    emoji: "👑",
    rewardName: "Force Champion",
    hook: "Bring every Force Fighter skill into one finale.",
    accent: "#facc15",
    accent2: "#a16207",
    icon: "crown",
    playable: false,
  },
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
  switch (kind) {
    case "rock":
      return `<svg ${common}><ellipse cx="32" cy="36" rx="20" ry="16"/><path d="M20 32c4-8 20-8 24 0"/></svg>`;
    case "pair":
      return `<svg ${common}><circle cx="20" cy="32" r="10"/><circle cx="44" cy="32" r="10"/><path d="M28 28l8-8M36 36l8 8"/></svg>`;
    case "bolt":
      return `<svg ${common}><path d="M34 8L18 36h14L28 56l20-32H34L38 8z" fill="currentColor" stroke="none"/></svg>`;
    case "flask":
      return `<svg ${common}><path d="M26 8h12v14l14 28a8 8 0 01-7 12H19a8 8 0 01-7-12l14-28V8z"/></svg>`;
    case "bond":
      return `<svg ${common}><circle cx="18" cy="32" r="10"/><circle cx="46" cy="32" r="10"/><path d="M28 32h8"/></svg>`;
    case "mix":
      return `<svg ${common}><rect x="10" y="18" width="20" height="28" rx="4"/><rect x="34" y="18" width="20" height="28" rx="4"/><path d="M20 32h24"/></svg>`;
    case "states":
      return `<svg ${common}><rect x="8" y="36" width="16" height="16" rx="2"/><ellipse cx="32" cy="44" rx="10" ry="8"/><circle cx="52" cy="20" r="3"/></svg>`;
    case "table":
      return `<svg ${common}><path d="M12 44L32 16l20 28"/><path d="M16 44h32"/></svg>`;
    case "shield":
      return `<svg ${common}><path d="M32 8l20 8v16c0 14-10 22-20 26C22 54 12 46 12 32V16l20-8z"/></svg>`;
    case "crown":
      return `<svg ${common}><path d="M10 44h44L48 22l-10 10L32 14 26 32 16 22 10 44z" fill="currentColor" stroke="none"/></svg>`;
    default:
      return `<svg ${common}><circle cx="32" cy="32" r="14"/><path d="M18 32h28"/></svg>`;
  }
}
