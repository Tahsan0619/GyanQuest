/**
 * Kid-friendly meta, persistence, rewards, progress UI, and level quizzes.
 */
import { t, getLevelMeta, tForceTheme } from "./i18n.js";

export const STORAGE_KEY = "force-fighter-save-v2";

/** @type {const} */
export const FORCE_TYPES = ["push", "pull", "gravity", "friction", "magnetic"];

export { LEVEL_DEMO_SCENES } from "./scene-registry.js";

export const LEVEL_META = [
  {
    kidTitle: "The Lazy Rock",
    forceTheme: "push",
    emoji: "🪨",
    rewardName: "Rock Rookie",
    intro:
      "Things stay still until something pushes or pulls them. You will wake a sleepy rock - just like pushing a door open!",
    everyday: ["Pushing a door open", "Kicking a football", "Pushing a shopping trolley"],
    quiz: [
      { q: "A ball on the grass stops because…", opts: ["Friction slows it", "Magic", "It gets heavier"], ok: 0 },
      { q: "Before you push a toy car, it…", opts: ["Stays still", "Moves by itself", "Flies away"], ok: 0 },
    ],
  },
  {
    kidTitle: "Push Power",
    forceTheme: "push",
    emoji: "🏎️",
    rewardName: "Speed Star",
    intro: "A small push moves light things faster. A heavy thing needs a bigger push to get going!",
    everyday: ["Kicking a light ball vs rolling a heavy drum", "Pushing a chair vs a sofa"],
    quiz: [
      {
        q: "A toy car (500 g) and a real car (1500 kg) both get pushed with the same force. The toy car accelerates…",
        opts: ["Faster (less mass)", "Slower (more surface)", "Identically"],
        ok: 0,
      },
      {
        q: "You double the force on a 5 kg block. The acceleration…",
        opts: ["Doubles", "Halves", "Stays the same"],
        ok: 0,
      },
    ],
  },
  {
    kidTitle: "Push & Pull Pairs",
    forceTheme: "pull",
    emoji: "🤝",
    rewardName: "Team Force",
    intro: "When you push, something pushes back! Pull a rope and the rope pulls you too.",
    everyday: ["Pulling a rope in tug-of-war", "Walking - you push the ground, it pushes you back"],
    quiz: [
      {
        q: "You shove a heavy sofa and a stack of textbooks with the same push. Which shows a smaller acceleration?",
        opts: ["The lighter stack", "The heavier sofa", "Neither - always identical"],
        ok: 1,
      },
      {
        q: "Two ice skaters push apart. Forces between them are…",
        opts: ["Equal size, opposite direction", "Bigger on the lighter skater", "Zero while touching"],
        ok: 0,
      },
    ],
  },
  {
    kidTitle: "Friction Fun",
    forceTheme: "friction",
    emoji: "🛞",
    rewardName: "Grip Guru",
    intro: "Friction helps you stop - like bicycle brakes or shoes on a muddy path.",
    everyday: ["Bicycle brakes", "Sliding slowly on a slide", "Shoes stuck in mud"],
    quiz: [
      {
        q: "Monsoon mud coats your flip-flop soles during a Dhaka lane walk-why do you slip easier?",
        opts: ["Rubber became lighter", "Effective friction under you dropped", "Gravity turned off"],
        ok: 1,
      },
      {
        q: "Cycle brake pads squeeze the wheel rim mainly using…",
        opts: ["Static levitation", "Kinetic friction to remove speed", "Magnetic sleep"],
        ok: 1,
      },
    ],
  },
  {
    kidTitle: "Forces in Balance",
    forceTheme: "gravity",
    emoji: "⚖️",
    rewardName: "Balance Boss",
    intro: "When forces balance, things move steadily. When one force wins, motion changes!",
    everyday: ["Apple falling from a tree", "Parachute floating down", "Ball dropping to the ground"],
    quiz: [
      {
        q: "A Buriganga ferry rope holds equal left/right crew pulls for a moment. The knot’s net force is…",
        opts: ["Massive to the left", "About zero", "Always downward only"],
        ok: 1,
      },
      {
        q: "A Padma bus accelerates forward from rest. Net force on the bus points…",
        opts: ["Backward", "Forward", "Straight up only"],
        ok: 1,
      },
    ],
  },
  {
    kidTitle: "Ramp & Slide",
    forceTheme: "gravity",
    emoji: "📐",
    rewardName: "Slope Scout",
    intro: "On a slide or ramp, gravity helps you roll downhill!",
    everyday: ["Playground slide", "Ball rolling down a hill", "Skateboard on a ramp"],
    quiz: [
      {
        q: "A Sylhet tea-truck uses switchbacks instead of a straight cliff road mainly to…",
        opts: ["Remove gravity", "Reduce the effective slope for tires", "Delete friction"],
        ok: 1,
      },
      {
        q: "Steepening a playground slide while keeping the same kid increases which downhill gravity component?",
        opts: ["The part parallel to the ramp", "Only the part into the ramp surface", "Neither-they stay fixed"],
        ok: 0,
      },
    ],
  },
  {
    kidTitle: "Rope Rescue",
    forceTheme: "pull",
    emoji: "🪢",
    rewardName: "Rope Ranger",
    intro: "Ropes and chains pull! Think tug-of-war or lifting a bucket on a string.",
    everyday: ["Pulling a dog leash", "Tug-of-war", "Lifting with a rope"],
    quiz: [
      {
        q: "A CNG roof rack is tied with one rope left and one rope right while parked on flat Tejgaon road. The balanced knot’s net force is…",
        opts: ["Huge sideways", "Roughly zero", "Always upward"],
        ok: 1,
      },
      {
        q: "Studio cables lift a musician’s speaker at steady speed. Tension compared with weight is…",
        opts: ["Less than weight", "Equal to weight (≈)", "Double weight always"],
        ok: 1,
      },
    ],
  },
  {
    kidTitle: "Push & Pull Together",
    forceTheme: "push",
    emoji: "🧭",
    rewardName: "Direction Pro",
    intro: "Forces have direction. Push a crate forward - friction may pull the other way!",
    everyday: ["Pushing a crate while friction pulls back", "Kicking a ball at an angle"],
    quiz: [
      {
        q: "You shove a crate toward the river loading dock while kinetic friction pushes the other way at constant speed. Net horizontal force on the crate is…",
        opts: ["Zero", "Forward only", "Backward only"],
        ok: 0,
      },
      {
        q: "Two crew members push on a crate at right angles. The crate “feels” one combined push that points…",
        opts: ["Along the diagonal of their arrows", "Opposite both", "Straight up"],
        ok: 0,
      },
    ],
  },
  {
    kidTitle: "Force Mix",
    forceTheme: "magnetic",
    emoji: "🧲",
    rewardName: "Magnet Master",
    intro: "Many forces can act at once - push, pull, gravity, friction, and even magnet pull!",
    everyday: ["Magnet pulling paper clips", "Coins sticking to a magnet", "Car engine + friction + air"],
    quiz: [
      {
        q: "A Cox’s Bazar hotel magnet yanks a paperclip upward faster than gravity alone. Which extra force helps?",
        opts: ["Magnetic pull from the pole", "Pure normal force sideways", "Buoyancy only"],
        ok: 0,
      },
      {
        q: "A varsity cyclist on Hatirjheel track fights which pair hardest at high speed?",
        opts: ["Air drag + rolling losses", "Only static friction sideways", "No forces at all"],
        ok: 0,
      },
    ],
  },
  {
    kidTitle: "Force Boss",
    forceTheme: "push",
    emoji: "👑",
    rewardName: "Force Champion",
    intro: "You have met push, pull, gravity, friction, and magnet forces. Show what you know!",
    everyday: ["Everyday sports", "Riding a bike", "Dropping a ball"],
    quiz: [
      {
        q: "A Jamuna sand barge coasts in still water with engines off (ignore tiny drag). Net horizontal force is…",
        opts: ["Huge forward", "About zero", "Always downward"],
        ok: 1,
      },
      {
        q: "A metro coach turns a curve at steady speed. Net force on the coach is…",
        opts: ["Zero everywhere", "Non-zero toward the center of the bend", "Forward only"],
        ok: 1,
      },
      {
        q: "A stall magnet lifts a spoon toward a kid’s nose-what interaction dominates?",
        opts: ["Magnetic attraction", "Sound waves", "Only heat"],
        ok: 0,
      },
    ],
  },
];

export const REWARD_ICONS = ["⭐", "🏅", "🎖️", "🌟", "💫", "🎯", "🔥", "✨", "🎁", "👑"];

export function loadSave() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveGame(state, rewards) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        level: state.level,
        sub: state.sub,
        completed: state.completed,
        rewards: rewards || state.rewards || [],
        introSeen: state.introSeen || [],
      })
    );
  } catch {
    /* private mode */
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* private mode */
  }
}

export function defaultRewards() {
  return LEVEL_META.map(() => ({ earned: false, stars: 0 }));
}

export function countDone(completed) {
  if (!Array.isArray(completed)) return 0;
  return completed.reduce(
    (n, row) => n + (Array.isArray(row) ? row.filter(Boolean).length : 0),
    0
  );
}

export function levelDoneCount(completed, levelIdx) {
  const row = completed?.[levelIdx];
  return Array.isArray(row) ? row.filter(Boolean).length : 0;
}

/** Ensure saved progress matches level/sub grid (handles old or corrupt saves). */
export function normalizeCompleted(completed, nLevels = LEVEL_META.length, nSubs = 10) {
  const out = [];
  for (let l = 0; l < nLevels; l++) {
    const row = Array.isArray(completed?.[l]) ? completed[l] : [];
    out.push(Array.from({ length: nSubs }, (_, i) => Boolean(row[i])));
  }
  return out;
}

export function normalizeIntroSeen(introSeen, nLevels = LEVEL_META.length) {
  return Array.from({ length: nLevels }, (_, i) => Boolean(introSeen?.[i]));
}

export function normalizeRewards(rewards, nLevels = LEVEL_META.length) {
  const base = defaultRewards();
  if (!Array.isArray(rewards)) return base;
  return base.map((def, i) => {
    const r = rewards[i];
    if (!r || typeof r !== "object") return def;
    return {
      earned: Boolean(r.earned),
      stars: typeof r.stars === "number" ? r.stars : 0,
    };
  });
}

/**
 * @param {object} els
 * @param {object} state
 * @param {typeof LEVEL_META} meta
 */
export function updateKidProgressUI(els, state, meta) {
  const levels = meta || getLevelMeta();
  const m = levels[state.level];
  if (!m) return;
  const doneInLevel = levelDoneCount(state.completed, state.level);
  const leftInLevel = 10 - doneInLevel;
  const onSub = state.sub + 1;

  if (els.levelTitle) {
    els.levelTitle.textContent = `${m.emoji} ${m.kidTitle} · ${t("shell.stepOf", { n: onSub })}`;
  }
  if (els.levelSelect) els.levelSelect.value = String(state.level);

  if (els.subDots) {
    els.subDots.innerHTML = "";
    for (let i = 0; i < 10; i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "sub-dot";
      b.textContent = String(i + 1);
      b.setAttribute(
        "aria-label",
        state.completed[state.level][i]
          ? t("shell.stepDone", { n: i + 1 })
          : i === state.sub
            ? t("shell.stepCurrent", { n: i + 1 })
            : t("shell.stepOf", { n: i + 1 })
      );
      if (i === state.sub) b.classList.add("current");
      if (state.completed[state.level][i]) b.classList.add("done");
      if (state.completed[state.level][i] || i === state.sub) {
        b.onclick = () => {
          if (state.completed[state.level][i] || i === state.sub) {
            els.onJumpSub?.(i);
          }
        };
      } else b.disabled = true;
      els.subDots.appendChild(b);
    }
  }

  if (els.progressFill) {
    const pct = (doneInLevel / 10) * 100;
    els.progressFill.style.width = `${pct}%`;
  }
  if (els.progressLabel) {
    els.progressLabel.textContent =
      doneInLevel >= 10
        ? t("shell.levelCompleteQuiz")
        : leftInLevel === 1
          ? t("shell.stepsLeftOne")
          : t("shell.stepsLeft", { n: leftInLevel, s: "" });
  }

  if (els.scoresEl) {
    const rw = state.rewards?.[state.level];
    const badge = rw?.earned
      ? t("shell.rewardEarned", { icon: REWARD_ICONS[state.level], name: m.rewardName })
      : "";
    els.scoresEl.textContent = t("shell.levelProgress", {
      emoji: m.emoji,
      cur: state.level + 1,
      done: doneInLevel,
    }) + badge;
  }

  if (els.rewardSlot) {
    const rw = state.rewards?.[state.level];
    els.rewardSlot.innerHTML = rw?.earned
      ? `<span class="reward-pill earned">${REWARD_ICONS[state.level]} ${m.rewardName}</span>`
      : `<span class="reward-pill locked">🔒 ${t("shell.rewardLocked", { name: m.rewardName })}</span>`;
  }

  if (els.labDepth) {
    els.labDepth.textContent = t("shell.todayForce", {
      force: tForceTheme(m.forceTheme),
      example: m.everyday[0],
    });
  }

  if (els.checkpointBadge) {
    const cp = state.checkpointAfter?.(state.level);
    els.checkpointBadge.classList.toggle("hidden", !cp);
    if (cp) {
      els.checkpointBadge.textContent =
        cp === "final" ? t("shell.checkpointFinal") : t("shell.checkpointBonus");
    }
  }
}

export function shortCoach(msg, max = 72) {
  const t = msg.replace(/<[^>]+>/g, "").trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1) + "…";
}
