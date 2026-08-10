/**
 * Bio Explorer - 10 mission catalog.
 * Live: Living or Not (M1) + Cell City (M2) + Plant Power (M3).
 */
export const MISSIONS = [
 {
 id: "living-or-not",
 kidTitle: "Living or Not",
 theme: "life",
 emoji: "🌱",
 rewardName: "Living Rookie",
 hook: "Sort living from not-living - cats, seeds, rocks, and phones.",
 accent: "#22c55e",
 accent2: "#15803d",
 icon: "leaf",
 playable: true,
 },
 {
 id: "cell-city",
 kidTitle: "Cell City",
 theme: "cells",
 emoji: "🔬",
 rewardName: "Cell Scout",
 hook: "Bodies and plants are cities of tiny living rooms called cells.",
 accent: "#4ade80",
 accent2: "#16a34a",
 icon: "cell",
 playable: true,
 },
 {
 id: "plant-power",
 kidTitle: "Plant Power",
 theme: "plants",
 emoji: "🍃",
 rewardName: "Plant Explorer",
 hook: "Leaves, roots, and flowers - how plants make food and more plants.",
 accent: "#86efac",
 accent2: "#166534",
 icon: "plant",
 playable: true,
 },
 {
 id: "body-systems",
 kidTitle: "Body Systems",
 theme: "systems",
 emoji: "🫀",
 rewardName: "Systems Scout",
 hook: "Organs team up so your body can move, breathe, and think.",
 accent: "#f87171",
 accent2: "#b91c1c",
 icon: "heart",
 playable: false,
 },
 {
 id: "food-chains",
 kidTitle: "Food Chains",
 theme: "ecology",
 emoji: "🦋",
 rewardName: "Chain Ranger",
 hook: "Who eats whom - energy flows through living links.",
 accent: "#fbbf24",
 accent2: "#b45309",
 icon: "chain",
 playable: false,
 },
 {
 id: "micro-worlds",
 kidTitle: "Micro Worlds",
 theme: "microbes",
 emoji: "🦠",
 rewardName: "Micro Scout",
 hook: "Tiny life you can’t see still changes food, health, and soil.",
 accent: "#a78bfa",
 accent2: "#6d28d9",
 icon: "micro",
 playable: false,
 },
 {
 id: "genetics-sparks",
 kidTitle: "Genetics Sparks",
 theme: "traits",
 emoji: "🧬",
 rewardName: "Trait Tracker",
 hook: "Traits pass along - a gentle intro to genes.",
 accent: "#38bdf8",
 accent2: "#0284c7",
 icon: "dna",
 playable: false,
 },
 {
 id: "health-habits",
 kidTitle: "Health Habits",
 theme: "health",
 emoji: "💪",
 rewardName: "Habit Hero",
 hook: "Sleep, food, water, and movement keep living systems strong.",
 accent: "#fb7185",
 accent2: "#be123c",
 icon: "health",
 playable: false,
 },
 {
 id: "biodiversity-bd",
 kidTitle: "Biodiversity BD",
 theme: "biodiversity",
 emoji: "🐅",
 rewardName: "Bio Guardian",
 hook: "Bangladesh’s living variety - protect habitats and species.",
 accent: "#34d399",
 accent2: "#047857",
 icon: "wild",
 playable: false,
 },
 {
 id: "bio-boss",
 kidTitle: "Bio Boss",
 theme: "synthesis",
 emoji: "👑",
 rewardName: "Bio Champion",
 hook: "Bring every Bio Explorer skill into one finale.",
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
 case "leaf":
 return `<svg ${common}><path d="M12 40c20-28 40-28 40-8-12 20-28 24-40 8z"/><path d="M20 36c8 4 16 4 24 0"/></svg>`;
 case "cell":
 return `<svg ${common}><ellipse cx="32" cy="32" rx="22" ry="16"/><circle cx="32" cy="32" r="6"/></svg>`;
 case "plant":
 return `<svg ${common}><path d="M32 52V28"/><path d="M32 36c-10-8-16-4-16 4 8 2 12 0 16-4z"/><path d="M32 36c10-8 16-4 16 4-8 2-12 0-16-4z"/></svg>`;
 case "heart":
 return `<svg ${common}><path d="M32 52C12 38 10 24 20 18c6-4 12 0 12 6 0-6 6-10 12-6 10 6 8 20-12 34z"/></svg>`;
 case "chain":
 return `<svg ${common}><circle cx="18" cy="32" r="8"/><circle cx="32" cy="32" r="8"/><circle cx="46" cy="32" r="8"/></svg>`;
 case "micro":
 return `<svg ${common}><circle cx="32" cy="32" r="14"/><circle cx="26" cy="28" r="2" fill="currentColor"/><circle cx="38" cy="34" r="2" fill="currentColor"/></svg>`;
 case "dna":
 return `<svg ${common}><path d="M20 12c8 8 16 32 24 40M44 12c-8 8-16 32-24 40"/><path d="M24 24h16M22 36h20"/></svg>`;
 case "health":
 return `<svg ${common}><path d="M28 12h8v16h16v8H36v16h-8V36H12v-8h16V12z"/></svg>`;
 case "wild":
 return `<svg ${common}><circle cx="32" cy="28" r="12"/><path d="M20 48c4-8 20-8 24 0"/></svg>`;
 case "crown":
 return `<svg ${common}><path d="M10 44h44L48 22l-10 10L32 14 26 32 16 22 10 44z" fill="currentColor" stroke="none"/></svg>`;
 default:
 return `<svg ${common}><circle cx="32" cy="32" r="14"/></svg>`;
 }
}
