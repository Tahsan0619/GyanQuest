/**
 * One-shot: builds EDITOR-CURRICULUM-BIBLE.md for content editors.
 * Topics come from Force Fighter locales + gen-curricula PACKS.
 * Subtopic titles follow the Force Fighter spiral (hook → mastery).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

/** Force Fighter - real missions + named steps (from main.js / levels-advanced.js) */
const FORCE_FIGHTER = {
  title: "Force Fighter",
  id: "forceFighter",
  slug: "force-fighter",
  tagline: "Learn Push, Pull & More!",
  coach: "Coach Force",
  subject: "Fun physics for kids",
  status: "Flagship - ~40-50% of the full vision; hand-authored labs",
  topics: [
    {
      name: "The Lazy Rock",
      theme: "Inertia / 1st law",
      reward: "Rock Rookie",
      subs: [
        "Wake the Sleepy Rock",
        "Low-Friction Glide Watch",
        "Force or Not?",
        "Wall Stop Surprise",
        "Everyday Motion Stories",
        "Name the Law of Inertia",
        "Deep-Space Drift",
        "Myth Bust: Motion Isn't a Force",
        "Inertia Speed Drill",
        "Rock Rookie Mastery",
      ],
    },
    {
      name: "Push Power",
      theme: "Second law (F = ma)",
      reward: "Speed Star",
      subs: [
        "Acceleration Trials",
        "Race Breakdown",
        "Dual-Crate Push Lab",
        "Acceleration Simulator",
        "Force vs Mass Cards",
        "Build F = ma",
        "Same Push, Different Mass",
        "Tuning + Verify",
        "Newton II Quick Drill",
        "Speed Star Mastery",
      ],
    },
    {
      name: "Push & Pull Pairs",
      theme: "Third law",
      reward: "Team Force",
      subs: [
        "Recoil Lab",
        "Equal & Opposite Intro",
        "Match Action-Reaction Pairs",
        "Skater Push-Apart",
        "Foot vs Ground",
        "Pair Direction Sort",
        "Rocket / Balloon Reaction",
        "Myth: Who Pushes Harder?",
        "Third-Law Drill",
        "Team Force Mastery",
      ],
    },
    {
      name: "Friction Fun",
      theme: "Friction",
      reward: "Grip Guru",
      subs: [
        "Friction Compare",
        "Surface Feel (μ dial)",
        "Static vs Kinetic Sort",
        "Brake Designers",
        "Dual-μ Lab",
        "Rubber vs Wood",
        "Static Limit Hunt",
        "Heat & Grip Myths",
        "Target Friction Force",
        "Grip Guru Mastery",
      ],
    },
    {
      name: "Forces in Balance",
      theme: "Net force / equilibrium",
      reward: "Balance Boss",
      subs: [
        "Vector Builder",
        "Forces on a Crate (1D)",
        "Net Force Zero?",
        "Find Balance",
        "Accelerating Upward",
        "Slowing While Moving Up",
        "Ramp Component Peek",
        "Apparent Weight Lab",
        "Vector Targets Drill",
        "Balance Boss Mastery",
      ],
    },
    {
      name: "Ramp & Slide",
      theme: "Ramps / components of gravity",
      reward: "Slope Scout",
      subs: [
        "Ramp Components (Observe)",
        "Three Forces on the Block",
        "Steeper = More Slide?",
        "Ramp Equilibrium Hunt",
        "Hill Prediction A",
        "Hill Prediction B",
        "Dual Targets",
        "Kinetic Friction on Slope",
        "Switchback Story",
        "Slope Scout Mastery",
      ],
    },
    {
      name: "Rope Rescue",
      theme: "Tension / ropes",
      reward: "Rope Ranger",
      subs: [
        "Meet the Rope Pull",
        "Target Acceleration",
        "Tension Equals Weight?",
        "Tension Tuner",
        "Friction + Hanger",
        "Two Ropes, One Knot",
        "Steady Lift Check",
        "Tension Myths",
        "Tension Check Drill",
        "Rope Ranger Mastery",
      ],
    },
    {
      name: "Push & Pull Together",
      theme: "Applied forces & direction",
      reward: "Direction Pro",
      subs: [
        "Vector Shove Lab",
        "Four-Force Sketch",
        "Same Line vs Angle",
        "Perpendicular Components",
        "Cancel the Pair",
        "Friction Opposes Push",
        "Diagonal Resultant",
        "Direction Myths",
        "Vector Direction Drill",
        "Direction Pro Mastery",
      ],
    },
    {
      name: "Force Mix",
      theme: "Combined forces (incl. magnetic)",
      reward: "Magnet Master",
      subs: [
        "Honest Checklist",
        "Many Forces at Once",
        "F & m Tuner",
        "Magnet vs Gravity",
        "Colinear Accountant",
        "Air Drag + Rolling",
        "Inertia Duel",
        "Mix-Up Myths",
        "Force Mix Drill",
        "Magnet Master Mastery",
      ],
    },
    {
      name: "Force Boss",
      theme: "Synthesis / championship",
      reward: "Force Champion",
      subs: [
        "Boss Warm-Up: Spot the Force",
        "Boss 2 - Newton II Tuner",
        "Boss 3 - Action-Reaction Replay",
        "Boss 4 - Friction Budget",
        "Boss 5 - Balance or Accelerate?",
        "Boss 6 - Ramp Challenge",
        "Boss 7 - Rope Rescue Replay",
        "Boss 8 - Vector Showdown",
        "Boss 9 - Mixed-Force Gauntlet",
        "Champion Crown",
      ],
    },
  ],
};

/** Extract PACKS topics by evaluating gen-curricula source lightly */
function loadPackTopics() {
  const src = fs.readFileSync(path.join(ROOT, "scripts", "gen-curricula.mjs"), "utf8");
  const packs = [];
  // Split on pack objects that have id + title + topics
  const chunks = src.split(/\n  \{\n    id: "/).slice(1);
  for (const chunk of chunks) {
    const id = chunk.match(/^([^"]+)"/)?.[1];
    const title = chunk.match(/title: "([^"]+)"/)?.[1];
    const tagline = chunk.match(/tagline: "([^"]+)"/)?.[1];
    const coach = chunk.match(/coachName: "([^"]+)"/)?.[1];
    const subject = chunk.match(/subjectTag: "([^"]+)"/)?.[1];
    const slug = chunk.match(/slug: "([^"]+)"/)?.[1];
    // Non-greedy to next pack-level `],` after `topics:` (4-space indent)
    const topicsBlock = chunk.match(/\n    topics: \[([\s\S]*?)\n    \],/)?.[1];
    if (!id || !title || !topicsBlock) {
      console.warn("skip meta", id, title);
      continue;
    }
    const topics = [];
    // Supports single-line and multiline topic entries (Chemistry Lab)
    const re = /\[\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*\[([\s\S]*?)\]\s*,?\s*\]/g;
    let m;
    while ((m = re.exec(topicsBlock))) {
      const hooks = [...m[3].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
      topics.push({ name: m[1], theme: m[2], hooks });
    }
    if (topics.length === 10) {
      packs.push({ id, title, tagline, coach, subject, slug, topics });
    } else {
      console.warn(`skip topics count ${topics.length}:`, id, title);
    }
  }
  return packs;
}

/**
 * Force Fighter pedagogical spiral - 10 named steps per topic.
 * Gradual: hook → see → sort → try → explain → rule → stretch → myth → drill → mastery.
 */
function spiralSubs(topicName, theme, hooks, isBoss) {
  const h0 = hooks[0] || topicName;
  const h1 = hooks[1] || hooks[0] || topicName;
  const h2 = hooks[2] || hooks[1] || hooks[0] || topicName;
  const short = topicName.replace(/\s*Boss$/, "").trim();

  if (isBoss || /Boss$/i.test(topicName)) {
    return [
      `${short} Warm-Up - Spot the Idea`,
      `${short} Challenge 2 - Replay the Basics`,
      `${short} Challenge 3 - Sort Real vs Fake`,
      `${short} Challenge 4 - Hands-On Lab`,
      `${short} Challenge 5 - Explain the Story`,
      `${short} Challenge 6 - Apply the Rule`,
      `${short} Challenge 7 - Stretch Case`,
      `${short} Challenge 8 - Bust the Myth`,
      `${short} Challenge 9 - Speed Gauntlet`,
      `${topicName} Crown`,
    ];
  }

  return [
    `Meet ${topicName}`,
    `Watch It Happen: ${h0}`,
    `Sort: Is It ${theme}?`,
    `Try It: ${h1}`,
    `Explain Why: ${h2}`,
    `Name the Rule for ${theme}`,
    `Stretch Case - New Context`,
    `Myth Bust: Common Mix-Ups`,
    `${topicName} Speed Drill`,
    `${topicName} Mastery`,
  ];
}

function esc(s) {
  return String(s);
}

function renderGame(game, index) {
  const lines = [];
  lines.push(`## ${index}. ${esc(game.title)}`);
  lines.push("");
  lines.push(`| | |`);
  lines.push(`|---|---|`);
  lines.push(`| **Catalog id** | \`${game.id}\` |`);
  if (game.slug) lines.push(`| **Folder** | \`games/${game.slug}/\` |`);
  if (game.tagline) lines.push(`| **Tagline** | ${esc(game.tagline)} |`);
  if (game.coach) lines.push(`| **Coach** | ${esc(game.coach)} |`);
  if (game.subject) lines.push(`| **Subject tag** | ${esc(game.subject)} |`);
  if (game.status) lines.push(`| **Status** | ${esc(game.status)} |`);
  else lines.push(`| **Status** | Scaffold / template engine - needs editor stories like Force Fighter |`);
  lines.push("");
  lines.push(`### 10 Main Levels (Topics)`);
  lines.push("");

  game.topics.forEach((topic, ti) => {
    const n = ti + 1;
    const theme = topic.theme || "";
    const reward = topic.reward ? ` · Reward: **${topic.reward}**` : "";
    lines.push(`#### Level ${n}: ${esc(topic.name)}`);
    if (theme) lines.push(`*Theme:* ${esc(theme)}${reward}`);
    if (topic.hooks?.length) {
      lines.push(`*Everyday hooks:* ${topic.hooks.map((h) => `“${h}”`).join(" · ")}`);
    }
    lines.push("");
    lines.push(`| Sub | Subtopic name | Editor story notes (fill in) |`);
    lines.push(`|---:|---|---|`);
    topic.subs.forEach((sub, si) => {
      lines.push(`| ${si + 1} | **${esc(sub)}** | _What the player sees, says, and does…_ |`);
    });
    lines.push("");
  });

  return lines.join("\n");
}

const packs = loadPackTopics();
if (packs.length !== 27) {
  console.warn(`Expected 27 packs, got ${packs.length}`);
}

const games = [
  FORCE_FIGHTER,
  ...packs.map((p) => ({
    ...p,
    topics: p.topics.map((t, i) => ({
      name: t.name,
      theme: t.theme,
      hooks: t.hooks,
      subs: spiralSubs(t.name, t.theme, t.hooks, i === 9),
    })),
  })),
];

const toc = games
  .map((g, i) => `${i + 1}. [${g.title}](#${i + 1}-${g.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, "")})`)
  .join("\n");

const body = `# GyanQuest / ImpactX - Editor Curriculum Bible

> **Purpose:** One place for editors to see every game, its **10 main levels (topics)**, and **10 subtopics per level** - so you can populate each cell with a story, props, coach lines, and activities in the **Force Fighter** pattern.
>
> **Generated for editors** · Source topics from \`games/force-fighter\` + \`scripts/gen-curricula.mjs\` · Subtopic *names* for non-Force Fighter packs are **proposed spiral titles** (ready for you to rewrite).

---

## How to use this (Force Fighter pattern)

ImpactX is built as **28 subjects = 28 games**. Each game teaches one subject through:

1. **10 topics (main levels)** - the big chapters of the subject  
2. **10 subtopics (steps) per topic** - gradual parts that explain that chapter  
3. Difficulty rises **gently** inside a topic (not a sudden jump to “level 10 = hardest subject”). A learner should leave each topic understanding *that slice* clearly.

### The Force Fighter spiral (copy this energy)

Inside each topic, steps usually move like this:

| Step | Job | Feel |
|---:|---|---|
| 1 | **Hook** - meet the idea with something familiar | “I already know this feeling” |
| 2 | **Watch** - see it happen in the 3D / demo | “Oh, that’s what it looks like” |
| 3 | **Sort** - force-or-not / real-vs-fake | “I can tell them apart” |
| 4 | **Try** - hands-on lab | “I did it myself” |
| 5 | **Explain** - everyday story chain | “I can say why” |
| 6 | **Name the rule** - light formal idea | “That’s the law / pattern” |
| 7 | **Stretch** - new or extreme context | “It still works here” |
| 8 | **Myth bust** - common misconception | “I won’t fall for that trap” |
| 9 | **Drill** - quick checks | “Fast and confident” |
| 10 | **Mastery** - mini-boss for this topic | “This topic is mine” |

Topic **10** of every game is a **Boss / synthesis** level that remixes earlier ideas.

### Editor checklist per subtopic cell

For each of the **2,800** cells (28 × 10 × 10), fill:

- **Story beat** - one sentence the coach could say  
- **Everyday hook** - Bangladesh-friendly example when possible  
- **Player action** - drag / tap / tune / quiz / 3D explore  
- **Win condition** - what proves they got it  
- **Misconception to crush** (especially steps 8 & 10)

### Reality check (honest status)

| Slice | Ready-ness |
|---|---|
| **Force Fighter** | Closest to the full ideology - hand labs, rich steps, rewards, checkpoints |
| **Other 27** | Same **10×10 shell** exists; topics are named; sub-steps are still mostly **template activity types** (demo → drag → … → boss), not unique stories yet |
| **This MD** | Gives editors the **named map** so stories can be written game-by-game |

---

## Master list - all 28 games

${toc}

---

${games.map((g, i) => renderGame(g, i + 1)).join("\n---\n\n")}

---

## Quick counts

| Item | Count |
|---|---:|
| Games / subjects | ${games.length} |
| Topics per game | 10 |
| Subtopics per topic | 10 |
| Total topic cells | ${games.length * 10} |
| Total subtopic cells to populate | **${games.length * 10 * 10}** |

---

## Suggested editor workflow

1. Start with **Force Fighter** as the gold reference - play a full topic and note the spiral.  
2. Pick one under-built game (e.g. **Chemistry Lab** or **Math Quest**) and rewrite its 10×10 story grid in this file first.  
3. Only then implement in code (\`curriculum.js\` / hand labs) - names here are the contract.  
4. Keep **Level 10 = Boss** as a remix, not a brand-new unrelated chapter.  
5. Prefer **gradual clarity** over sudden hardness: step 10 of topic 3 can still feel friendly.

---

*File path: \`EDITOR-CURRICULUM-BIBLE.md\` · Regenerate with \`node scripts/gen-editor-curriculum-md.mjs\`*
`;

const out = path.join(ROOT, "EDITOR-CURRICULUM-BIBLE.md");
fs.writeFileSync(out, body, "utf8");
console.log(`Wrote ${out}`);
console.log(`Games: ${games.length}; subtopic cells: ${games.length * 100}`);
