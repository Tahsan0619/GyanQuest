/**
 * Split EDITOR-CURRICULUM-BIBLE.md into 5 owner category docs, then emit .md files.
 * Run: node scripts/split-editor-curriculum-by-owner.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "EDITOR-CURRICULUM-BIBLE.md");
const OUT_DIR = path.join(ROOT, "editor-packs");

/** @type {Record<string, { file: string; title: string; owner: string; games: string[] }>} */
const CATEGORIES = {
  tahsan: {
    file: "Curriculum-Tahsan",
    title: "Editor Curriculum - Tahsan",
    owner: "Tahsan",
    games: [
      "Force Fighter",
      "Machine Learning",
      "Data Science",
      "Electrical Basics",
      "Mechanical Basics",
      "Astronomy & Space",
    ],
  },
  mohaimenul: {
    file: "Curriculum-Mohaimenul",
    title: "Editor Curriculum - Mohaimenul Vai",
    owner: "Mohaimenul Vai",
    games: ["Chemistry Lab", "Bio Explorer", "Math Quest", "ICT Fundamentals"],
  },
  mufrid: {
    file: "Curriculum-Mufrid",
    title: "Editor Curriculum - Mufrid Vai",
    owner: "Mufrid Vai",
    games: ["Web Dev Studio", "Backend Builder", "Database & SQL", "Cyber Shield"],
  },
  tanha: {
    file: "Curriculum-Tanha",
    title: "Editor Curriculum - Tanha",
    owner: "Tanha",
    games: [
      "OS & Hardware",
      "Artificial Intelligence",
      "Statistics & Probability",
      "Geometry & Trigonometry",
    ],
  },
  comingSoon: {
    file: "Curriculum-Coming-Soon",
    title: "Editor Curriculum - Coming Soon",
    owner: "Coming Soon (unassigned / later)",
    games: [
      "Eco Guardian",
      "Networking & Internet", // no owner listed in assignment sheet
      "Civil Basics",
      "Electronics & Robotics",
      "Green Tech",
      "Geology & Earth",
      "Human Anatomy & Health",
      "Genetics & Biotech",
      "Calculus & Analysis",
      "Discrete Math & Logic",
    ],
  },
};

const full = fs.readFileSync(SRC, "utf8");

/** Split into preamble + per-game sections (## N. Title) */
const gameHeaderRe = /^## (\d+)\. (.+)$/gm;
const matches = [...full.matchAll(gameHeaderRe)];
const preambleEnd = matches[0]?.index ?? 0;
const howToPreamble = full.slice(0, preambleEnd);

/** @type {Map<string, string>} */
const sectionsByTitle = new Map();
for (let i = 0; i < matches.length; i++) {
  const title = matches[i][2].trim();
  const start = matches[i].index;
  const end = i + 1 < matches.length ? matches[i + 1].index : full.length;
  let body = full.slice(start, end).trimEnd();
  // Drop trailing --- separators between games
  body = body.replace(/\n---\s*$/, "").trimEnd();
  sectionsByTitle.set(title, body);
}

const allAssigned = new Set(Object.values(CATEGORIES).flatMap((c) => c.games));
const missing = [...sectionsByTitle.keys()].filter((t) => !allAssigned.has(t));
const orphan = Object.values(CATEGORIES)
  .flatMap((c) => c.games)
  .filter((t) => !sectionsByTitle.has(t));

if (missing.length || orphan.length) {
  console.warn("Unassigned games in bible:", missing);
  console.warn("Named but not found in bible:", orphan);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

/**
 * Full editor playbook - injected into every owner pack DOCX.
 * This is the contract: how to build sub-levels, keep the spiral, stay organized.
 */
const EDITOR_PLAYBOOK = `# Editor Playbook - Build Like Force Fighter

> Read this section **before** filling any story cell.  
> Gold reference game: **Force Fighter** (hand-authored labs, rewards, checkpoints).  
> Your job is not “write 100 quizzes.” Your job is to **teach one idea in 10 gentle steps**, then the next idea, then a boss remix.

---

## 1. The big picture (what you are building)

Every ImpactX / GyanQuest subject is one **game**. Every game has the same skeleton:

| Layer | Count | What it is | Example (Force Fighter) |
|---|---:|---|---|
| **Game** | 1 | One subject, one coach, one mood | Force Fighter · Coach Force |
| **Topic (Level)** | 10 | One chapter of the subject | Level 1: *The Lazy Rock* (inertia) |
| **Subtopic (Step)** | 10 per topic | One bite of that chapter | Step 3: *Force or Not?* |
| **Level quiz** | after 10 steps | Prove this chapter stuck | 2-3 kid-friendly questions |
| **Reward** | 1 per topic | Badge / title for finishing | *Rock Rookie* |
| **Boss topic** | Topic 10 | Remix earlier chapters | *Force Boss* |

**Total per game:** 10 × 10 = **100 subtopics** (+ quizzes & reward names).

**Critical rule:** Step 10 of Topic 3 is *not* “hardest physics in the world.” It is “you own *this* chapter.” Difficulty rises **inside** a topic (gentle spiral), and topics themselves go from concrete → more abstract across the game.

---

## 2. Spiral curriculum - how to keep it healthy

We use a **Bruner-style spiral**: revisit ideas from concrete action → pictures/icons → light symbols/rules → synthesis.

### Across the 10 topics (the whole game)

| Topic band | Brunner stage | Editor feeling | What players should feel |
|---:|---|---|---|
| **1-3** | **Enactive** (do / touch) | Hands, props, push/pull, sort piles | “I can *do* this” |
| **4-6** | **Iconic** (see / diagrams) | Arrows, scenes, compare panels | “I can *see* the pattern” |
| **7-9** | **Symbolic** (name / light formal) | Short rules, equations-lite, labels | “I can *say* the rule” |
| **10** | **Synthesis (Boss)** | Remix old topics, no brand-new chapter | “I can *use* everything together” |

### Inside each topic (the 10 subtopics)

This is the **Force Fighter spiral**. Copy it for every topic you write:

| Sub | Role | Player feeling | What you must design |
|---:|---|---|---|
| **1** | **Hook** | “I already know this feeling” | Familiar everyday moment + coach warm invite |
| **2** | **Watch** | “Oh, that’s what it looks like” | Demo / 3D scene / reveal - *observe first* |
| **3** | **Sort** | “I can tell them apart” | Real vs fake · is-it / isn’t-it drag |
| **4** | **Try** | “I did it myself” | Hands-on lab (tune, push, build, place) |
| **5** | **Explain** | “I can say why” | Chain of everyday stories that share one cause |
| **6** | **Name the rule** | “That’s the pattern / law” | Light formal naming - still kid voice |
| **7** | **Stretch** | “It still works here” | New context or extreme case (space, monsoon, big scale) |
| **8** | **Myth bust** | “I won’t fall for that trap” | One common misconception - crush it kindly |
| **9** | **Drill** | “Fast and confident” | 2-4 quick checks, no new content |
| **10** | **Mastery** | “This topic is mine” | Mini-boss for *this* topic only |

**Spiral health checks (do these every topic):**

1. Subs 1-4 never require a formula the player hasn’t *felt* yet.  
2. Sub 6 names something they already *did* in 1-5 - don’t dump a textbook definition cold.  
3. Sub 7 is a *new place*, same idea - not a new chapter.  
4. Sub 8 fights a *real* student myth (ask a teacher / remember your own confusion).  
5. Sub 9 introduces **zero** new vocabulary.  
6. Sub 10 only remixed this topic’s idea - save cross-topic remix for Topic 10 Boss.

---

## 3. How to make each sub-level (step-by-step recipe)

For **every** subtopic cell, write a **Story Card**. Use this exact template in the *Editor story notes* column (or a side sheet):

### Story Card template (copy-paste)

\`\`\`
SUB: [Topic name] · Step [1-10] · [Subtopic title]
GOAL (1 line): After this step the player can…
HOOK (everyday, BD-friendly): …
COACH SAYS (1-2 sentences, kid voice): …
PLAYER DOES (one clear action): watch / drag / tap / tune / order / quiz / build …
SCENE / PROPS (what appears in 3D or panel): …
WIN CONDITION (how we know they got it): …
FAIL / HINT (gentle, not shame): …
MYTH TO AVOID (esp. steps 8 & 10): …
NEXT BEAT (how this sets up the next step): …
\`\`\`

### Recipes by step number

**Step 1 - Hook**  
- Open with a *felt* moment (door push, rickshaw brake, phone unlock, half a roti…).  
- Coach invites; do **not** lecture.  
- Win = player continues after noticing / tiny tap.  
- Force Fighter vibe: *Wake the Sleepy Rock*.

**Step 2 - Watch**  
- Demo or 3D dwell: player *looks* before they act.  
- Point out 1 thing to notice (“orange tire glides steadily”).  
- Win = watched + tapped Continue (timer ok).  
- Activity types: \`demo\`, \`scene3d\`, \`reveal\`.

**Step 3 - Sort**  
- 4-6 chips: half belong, half don’t.  
- Labels must be kid-clear (“Force” vs “Not a force”).  
- Win = all chips in correct zones.  
- Activity type: \`drag\`.

**Step 4 - Try**  
- One interactive lab: slider, push button, place object, flip switch.  
- One success criterion (reach target, match pair, light the bulb).  
- Keep controls to **one idea**.  
- Activity types: \`tap\`, \`drag\`, custom lab.

**Step 5 - Explain**  
- 3 everyday beats that share the same cause.  
- Player unfolds or orders the story.  
- Win = correct order / all reveals seen.  
- Activity types: \`reveal\`, \`order\`.

**Step 6 - Name the rule**  
- Give the *short* name after they felt it (“Law of inertia”, “F = ma idea”, “SELECT picks columns”).  
- Optional: arrange word tokens into a sentence.  
- Still playful - no exam tone.  
- Activity types: \`equation\`, \`order\`, \`quiz\`.

**Step 7 - Stretch**  
- Same rule, weird or big context (deep space, cyclone prep, hospital, village solar…).  
- Win = apply the familiar rule correctly in the new scene.  
- Do **not** introduce a second major concept.

**Step 8 - Myth bust**  
- State the myth in student words (“Motion itself is a force”).  
- Prove it wrong with a sort or one decisive demo.  
- Coach stays kind: “Lots of people think that - here’s the trap.”

**Step 9 - Drill**  
- 2-4 rapid questions or micro-tasks.  
- Only vocabulary from steps 1-8.  
- Win = threshold score (e.g. 2/3).  
- Activity type: \`quiz\` / short \`tap\`.

**Step 10 - Mastery (topic mini-boss)**  
- Short gauntlet remixing *this* topic’s hook + rule + myth.  
- End with reward teaser (“You earned Rock Rookie!”).  
- Activity type: \`boss\` (or multi-part lab).

### Engine activity types (what the code already supports)

Use these names when you hand off to developers:

| Type | Best for steps | Player action |
|---|---|---|
| \`demo\` | 1-2 | Watch a scripted moment |
| \`scene3d\` | 2, 7 | Explore / notice the 3D scene |
| \`reveal\` | 2, 5 | Tap through example cards |
| \`drag\` | 3, 4, 8 | Sort chips into zones |
| \`order\` | 5-6 | Put steps / tokens in order |
| \`equation\` | 6 | Build a light formal sentence |
| \`tap\` | 4, 9 | Quick choices / buttons |
| \`quiz\` | 9, level quiz | Multiple choice |
| \`boss\` | 10, Topic 10 | Harder check / synthesis |

Default template cycle in generated games:  
\`demo → drag → reveal → order → quiz → scene3d → equation → tap → drag → boss\`  
**You may rearrange** to fit the spiral above - the spiral roles matter more than the type order.

---

## 4. How to organize everything properly

### A. Folder-in-your-head (and in this document)

\`\`\`
Game
├── Topic 1 … Topic 9   ← teach one idea each
├── Topic 10 Boss       ← remix only
│
Each Topic
├── Intro line (kid voice) + emoji + reward name
├── 2-3 everyday hooks (prefer Bangladesh-familiar)
├── 10 Story Cards (subs 1-10)
└── Level quiz (2-3 questions) after mastery
\`\`\`

### B. Naming rules (keep the catalog clean)

| Thing | Rule | Good | Avoid |
|---|---|---|---|
| Topic title | Short, playful, memorable | *The Lazy Rock*, *Tiny Bits* | *Introduction to Newton’s First Law* |
| Subtopic title | Verb or mission feel | *Force or Not?*, *Wake the Sleepy Rock* | *Sub-level 3* |
| Reward name | Title the kid earns | *Rock Rookie*, *Grip Guru* | *Badge 1* |
| Coach lines | Spoken, warm, short | “Push the sleepy rock!” | Walls of theory |

### C. Everyday hooks

- Prefer **Dhaka / Bangladesh** life when it fits: rickshaw, monsoon mud, Hilsa, Padma, school lab, cricket score, taka, cha in a bowl…  
- Hooks must match props the player can *see* (bottle, cup, tire, desk…) when the game has 3D props.  
- Every topic needs **at least 2** hooks before you write sub 1.

### D. Topic 10 Boss rules

- **No new subject chapter.** Only remix Topics 1-9.  
- Structure Boss steps as Challenge 1… Crown (already titled in this pack).  
- End with celebration + “replay any mission” energy.

### E. Checkpoints (optional, Force Fighter style)

Force Fighter places bigger checks after bands (e.g. after topics 3, 5, 10).  
If you add checkpoints: keep them **short**, celebrate progress, don’t block joy.

### F. Work order for editors (stay sane)

1. Play / skim **Force Fighter** Level 1 end-to-end.  
2. For *your* game: lock the **10 topic titles** (already listed below).  
3. Write **Topic 1** fully (10 Story Cards + quiz + reward) before Topic 2.  
4. Peer-review Topic 1 against the spiral health checks.  
5. Clone the rhythm for Topics 2-9; write Boss last.  
6. Only then ask engineering to replace template steps with your stories.

### G. Handoff to developers

When a topic is “ready,” deliver:

- Topic intro + everyday[] + rewardName + emoji  
- 10 Story Cards (complete)  
- Level quiz (2-3 items)  
- Suggested activity \`type\` per step  
- Prop / scene notes  

Do **not** hand off half-filled topics.

---

## 5. Quality bar - “properly organized” checklist

Tick these before you mark a topic done:

### Per subtopic
- [ ] Story Card complete (goal, hook, coach, action, win, hint)  
- [ ] One job only - no double lessons  
- [ ] Kid voice (age ~10-15 friendly; no jargon without a feeling first)  
- [ ] Win condition is testable in-game  
- [ ] Sets up the next step (spiral link)

### Per topic
- [ ] Subs 1→10 follow Hook…Mastery roles  
- [ ] Sub 9 has no new words  
- [ ] Sub 8 kills a real myth  
- [ ] Level quiz uses only taught ideas  
- [ ] Reward name is fun and unique in this game

### Per game
- [ ] Topics 1-3 concrete; 7-9 more formal; 10 remix only  
- [ ] No topic steals another topic’s main idea  
- [ ] Coach personality consistent  
- [ ] 100 Story Cards accounted for  

### Red flags (fix immediately)
- Jumping to formulas in Step 1-2  
- Step 10 inventing a new chapter  
- Three ideas crammed into one sub  
- Shame-y fail text (“Wrong! You’re bad at science”)  
- English-only elite examples when a local hook exists  
- Copy-pasting the same story across five topics  

---

## 6. Mini example (Force Fighter · Topic 1 energy)

| Sub | Title | One-line goal |
|---:|---|---|
| 1 | Wake the Sleepy Rock | Feel that still things need a push/pull |
| 2 | Low-Friction Glide Watch | See steady motion when friction is tiny |
| 3 | Force or Not? | Sort real forces from “just motion” |
| 4 | Wall Stop Surprise | Feel a force change motion |
| 5 | Everyday Motion Stories | Connect door / kick / van to the idea |
| 6 | Name the Law of Inertia | Give the pattern a name |
| 7 | Deep-Space Drift | Same law, extreme place |
| 8 | Myth Bust: Motion Isn’t a Force | Crush the #1 misconception |
| 9 | Inertia Speed Drill | Fast confidence |
| 10 | Rock Rookie Mastery | Own the chapter → earn reward |

**Steal this energy** for Chemistry, Math, SQL, AI - different content, **same spiral spine**.

---

## 7. Your mission in this pack

1. Open your games listed below.  
2. For each subtopic row, fill **Editor story notes** using the Story Card template.  
3. Keep the spiral healthy (Section 2).  
4. Use the checklists (Section 5) before marking a topic done.  
5. When stuck, ask: *“What would Force Fighter do for Step N?”*

---
`;

const written = [];

for (const cat of Object.values(CATEGORIES)) {
  const toc = cat.games
    .map((g, i) => {
      const anchor = g
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-+$/g, "");
      return `${i + 1}. [${g}](#${i + 1}-${anchor})`;
    })
    .join("\n");

  const gameBodies = cat.games.map((g, i) => {
    const raw = sectionsByTitle.get(g);
    if (!raw) return `## ${i + 1}. ${g}\n\n_Missing from bible - check source._\n`;
    // Renumber heading to local pack index
    let body = raw.replace(/^## \d+\. /, `## ${i + 1}. `);
    // Upgrade blank story notes into a short fill prompt
    body = body.replace(
      /\| _What the player sees, says, and does…_ \|/g,
      "| Goal · Hook · Coach · Player does · Win · Hint · Myth · Next… |",
    );
    return body;
  });

  const cells = cat.games.length * 100;
  const md = `# ${cat.title}

> **Owner:** ${cat.owner}  
> **Games in this pack:** ${cat.games.length}  
> **Subtopic cells to populate:** **${cells}** (games × 10 topics × 10 subtopics)  
> Split from \`EDITOR-CURRICULUM-BIBLE.md\` for team editing.  
> **Read the Editor Playbook first** - then fill Story Cards for every subtopic.

---

${EDITOR_PLAYBOOK}

## Games in this pack

${toc}

---

${gameBodies.join("\n\n---\n\n")}

---

## Pack delivery checklist (owner sign-off)

| Game | Topic 1 done | Topics 2-9 done | Boss done | Quizzes + rewards | Stories done? |
|---|:---:|:---:|:---:|:---:|:---:|
${cat.games.map((g) => `| ${g} | ☐ | ☐ | ☐ | ☐ | ☐ |`).join("\n")}

### Owner pledge
I, **${cat.owner}**, will keep the Force Fighter spiral in every topic, fill Story Cards before handoff, and not ship empty template steps as “done.”

*Pack generated for: ${cat.owner}*
`;

  const mdPath = path.join(OUT_DIR, `${cat.file}.md`);
  fs.writeFileSync(mdPath, md, "utf8");
  written.push({ cat: cat.file, games: cat.games.length, mdPath });
  console.log(`Wrote ${mdPath} (${cat.games.length} games)`);
}

// Also write a tiny index
const index = `# Editor packs (by owner)

Each DOCX opens with the full **Editor Playbook**: how to build every sub-level, keep the spiral curriculum healthy, and stay organized (Force Fighter pattern).

| Pack | Owner | Games | Files |
|---|---|---:|---|
${Object.values(CATEGORIES)
  .map(
    (c) =>
      `| ${c.title} | ${c.owner} | ${c.games.length} | \`${c.file}.md\` / \`${c.file}.docx\` |`,
  )
  .join("\n")}

**Note:** *Networking & Internet* had no name on the assignment list, so it sits in **Coming Soon**. Move it to Mufrid’s pack if that was the intent.

Regenerate: \`node scripts/split-editor-curriculum-by-owner.mjs\` then convert each \`.md\` → \`.docx\`.
`;
fs.writeFileSync(path.join(OUT_DIR, "README.md"), index, "utf8");
console.log(JSON.stringify(written, null, 2));
