import fs from "fs";
import path from "path";

const gamesDir = path.resolve("games");
const games = fs
  .readdirSync(gamesDir)
  .filter((d) => fs.statSync(path.join(gamesDir, d)).isDirectory())
  .sort();

function grab(src, key) {
  const re = new RegExp(`["']?${key}["']?\\s*:\\s*["']([^"']+)["']`);
  const m = src.match(re);
  return m ? m[1] : "";
}

const TRACKS = {
  "force-fighter": "core",
  "chemistry-lab": "core",
  "bio-explorer": "core",
  "math-quest": "core",
  "eco-guardian": "core",
  "ict-fundamentals": "cs",
  "web-dev-studio": "cs",
  "backend-builder": "cs",
  "database-sql": "cs",
  "networking-internet": "cs",
  "cyber-shield": "cs",
  "os-hardware": "cs",
  "ai-lab": "cs",
  "ml-lab": "cs",
  "data-science": "cs",
  "electrical-basics": "eng",
  "mechanical-basics": "eng",
  "civil-basics": "eng",
  "electronics-robotics": "eng",
  "green-tech": "eng",
  "astronomy-space": "adv",
  "geology-earth": "adv",
  "human-anatomy": "adv",
  "genetics-biotech": "adv",
  "statistics-probability": "math",
  "geometry-trig": "math",
  "calculus-analysis": "math",
  "discrete-math": "math",
};

const rows = [];
const typeTotals = {};

for (const g of games) {
  const manPath = path.join(gamesDir, g, "manifest.js");
  const curPath = path.join(gamesDir, g, "curriculum.js");
  let title = g,
    emoji = "",
    coach = "",
    accent = "",
    accent2 = "",
    tagline = "",
    subjectTag = "",
    defaultScene = "";
  let levels = 0,
    activities = 0,
    quizzes = 0;
  const types = {};
  let levelTitles = [];
  let rewardNames = [];

  if (fs.existsSync(manPath)) {
    const m = fs.readFileSync(manPath, "utf8");
    title = grab(m, "title") || g;
    emoji = grab(m, "emoji");
    coach = grab(m, "coachName");
    tagline = grab(m, "tagline");
    subjectTag = grab(m, "subjectTag");
    defaultScene = grab(m, "defaultScene");
    accent = grab(m, "accent");
    accent2 = grab(m, "accent2");
  }

  if (fs.existsSync(curPath)) {
    const c = fs.readFileSync(curPath, "utf8");
    levelTitles = [...c.matchAll(/"kidTitle"\s*:\s*"([^"]+)"/g)].map((x) => x[1]);
    levels = levelTitles.length;
    rewardNames = [...c.matchAll(/"rewardName"\s*:\s*"([^"]+)"/g)].map((x) => x[1]);
    const acts = [...c.matchAll(/"type"\s*:\s*"(\w+)"/g)].map((x) => x[1]);
    activities = acts.length;
    for (const t of acts) {
      types[t] = (types[t] || 0) + 1;
      typeTotals[t] = (typeTotals[t] || 0) + 1;
    }
    quizzes = (c.match(/"q"\s*:/g) || []).length;
  } else if (g === "force-fighter") {
    const core = fs.readFileSync(path.join(gamesDir, g, "js", "game-core.js"), "utf8");
    levelTitles = [...core.matchAll(/kidTitle:\s*["']([^"']+)["']/g)].map((x) => x[1]);
    rewardNames = [...core.matchAll(/rewardName:\s*["']([^"']+)["']/g)].map((x) => x[1]);
    levels = levelTitles.length || 10;
    activities = levels * 10;
    title = "Force Fighter";
    emoji = "🪨";
    coach = "Coach Force";
    tagline = "Push, pull, friction & gravity";
    subjectTag = "Fun physics for kids";
    accent = "#f59e0b";
    accent2 = "#ea580c";
    defaultScene = "forceLab";
    types.custom = activities;
    typeTotals.custom = (typeTotals.custom || 0) + activities;
    quizzes = (core.match(/q:\s*["']/g) || []).length;
  }

  rows.push({
    slug: g,
    track: TRACKS[g] || "other",
    title,
    emoji,
    coach,
    accent,
    accent2,
    tagline,
    subjectTag,
    defaultScene,
    levels,
    activities,
    types,
    quizzes,
    levelTitles,
    rewardNames,
    href: `games/${g}/`,
  });
}

const out = {
  totals: {
    games: rows.length,
    levels: rows.reduce((a, r) => a + r.levels, 0),
    activities: rows.reduce((a, r) => a + r.activities, 0),
    quizzes: rows.reduce((a, r) => a + r.quizzes, 0),
    activityTypes: typeTotals,
  },
  games: rows,
};

fs.writeFileSync("scripts/_scan-out.json", JSON.stringify(out, null, 2), "utf8");
console.log(JSON.stringify(out.totals, null, 2));
for (const r of rows) {
  console.log(
    `${r.emoji} ${r.title} | L${r.levels} A${r.activities} Q${r.quizzes} | ${r.coach} | ${r.accent}`
  );
}
