/**
 * Build audio/<gameId>/<locale>/scripts.json from curricula + Force Fighter levels.
 * Run: node scripts/build-voice-scripts.mjs
 */
import fs from "fs";
import path from "path";
import { pathToFileURL, fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const audioRoot = path.join(root, "audio");

function pad2(n) {
  return String(n).padStart(2, "0");
}

function stripHtml(html) {
  return String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function introText(m) {
  const everyday = Array.isArray(m.everyday) ? m.everyday.join(". ") : "";
  return [m.kidTitle, m.intro, everyday ? `Examples: ${everyday}` : ""]
    .filter(Boolean)
    .join(". ");
}

function activityText(act, level) {
  const bits = [];
  if (act?.coach) bits.push(stripHtml(act.coach));
  if (act?.html) bits.push(stripHtml(act.html));
  if (act?.title) bits.push(String(act.title));
  if (act?.instructions) bits.push(String(act.instructions));
  if (act?.body) bits.push(stripHtml(act.body));
  if (act?.q) bits.push(String(act.q));
  if (!bits.length && level?.intro) bits.push(String(level.intro));
  return bits.filter(Boolean).join(" ");
}

function writeScripts(gameId, locale, scripts) {
  const dir = path.join(audioRoot, gameId, locale);
  fs.mkdirSync(dir, { recursive: true });
  const out = path.join(dir, "scripts.json");
  fs.writeFileSync(out, JSON.stringify(scripts, null, 2));
  console.log(`wrote ${out} (${Object.keys(scripts).length} clips)`);
}

async function fromCurriculum(gameFolder) {
  const curriculumPath = path.join(root, "games", gameFolder, "curriculum.js");
  const manifestPath = path.join(root, "games", gameFolder, "manifest.js");
  if (!fs.existsSync(curriculumPath) || !fs.existsSync(manifestPath)) return null;

  const { curriculum } = await import(pathToFileURL(curriculumPath).href);
  const { manifest } = await import(pathToFileURL(manifestPath).href);
  const gameId = manifest.id || gameFolder;
  const scripts = {};
  (curriculum.levels || []).forEach((level, li) => {
    const L = pad2(li + 1);
    scripts[`l${L}-intro`] = introText(level);
    (level.subs || []).forEach((act, si) => {
      scripts[`l${L}-s${pad2(si + 1)}`] = activityText(act, level);
    });
  });
  writeScripts(gameId, "en", scripts);
  return gameId;
}

function fromForceFighter() {
  const enPath = path.join(root, "games", "force-fighter", "locales", "en.json");
  const bnPath = path.join(root, "games", "force-fighter", "locales", "bn.json");
  const en = JSON.parse(fs.readFileSync(enPath, "utf8"));
  const levels = en.levels || [];
  const scripts = {};
  levels.forEach((level, li) => {
    const L = pad2(li + 1);
    scripts[`l${L}-intro`] = introText(level);
    const everyday = Array.isArray(level.everyday) ? level.everyday : [];
    for (let si = 0; si < 10; si++) {
      const hook = everyday[si % Math.max(1, everyday.length)] || "";
      scripts[`l${L}-s${pad2(si + 1)}`] = [
        `Level ${li + 1}, step ${si + 1}.`,
        level.kidTitle,
        level.intro,
        hook ? `Everyday example: ${hook}.` : "",
        "Follow Coach Force on screen.",
      ]
        .filter(Boolean)
        .join(" ");
    }
  });
  writeScripts("force-fighter", "en", scripts);

  if (fs.existsSync(bnPath)) {
    try {
      const bn = JSON.parse(fs.readFileSync(bnPath, "utf8"));
      const bnLevels = bn.levels || [];
      if (bnLevels.length) {
        const bnScripts = {};
        bnLevels.forEach((level, li) => {
          const L = pad2(li + 1);
          bnScripts[`l${L}-intro`] = introText(level);
          const everyday = Array.isArray(level.everyday) ? level.everyday : [];
          for (let si = 0; si < 10; si++) {
            const hook = everyday[si % Math.max(1, everyday.length)] || "";
            bnScripts[`l${L}-s${pad2(si + 1)}`] = [
              `লেভেল ${li + 1}, ধাপ ${si + 1}।`,
              level.kidTitle,
              level.intro,
              hook ? `উদাহরণ: ${hook}।` : "",
            ]
              .filter(Boolean)
              .join(" ");
          }
        });
        writeScripts("force-fighter", "bn", bnScripts);
      }
    } catch (e) {
      console.warn("bn force-fighter scripts skipped:", e.message);
    }
  }
}

async function main() {
  fs.mkdirSync(audioRoot, { recursive: true });
  const games = fs.readdirSync(path.join(root, "games"));
  for (const g of games) {
    if (g === "force-fighter") continue;
    try {
      await fromCurriculum(g);
    } catch (e) {
      console.warn("skip", g, e.message);
    }
  }
  fromForceFighter();
  console.log("done");
}

main();
