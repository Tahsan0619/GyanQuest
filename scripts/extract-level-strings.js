/**
 * One-off: extract user-facing strings from levels-advanced.js for locale files.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = fs.readFileSync(path.join(__dirname, "../js/levels-advanced.js"), "utf8");

const patterns = [
  /setCoach\(\s*["']([^"']+)["']/g,
  /setCoach\(\s*`([^`]+)`/g,
  /title:\s*["']([^"']+)["']/g,
  /label:\s*["']([^"']+)["']/g,
  /instructions:\s*["']([^"']+)["']/g,
  /text:\s*["']([^"']+)["']/g,
  /question:\s*["']([^"']+)["']/g,
  /coachShort:\s*["']([^"']+)["']/g,
  /hintWrong:\s*["']([^"']+)["']/g,
  /textContent\s*=\s*["']([^"']+)["']/g,
  /innerHTML\s*=\s*["']([^"']{4,120})["']/g,
];

const set = new Set();
for (const p of patterns) {
  let m;
  while ((m = p.exec(src))) {
    const s = m[1].replace(/\s+/g, " ").trim();
    if (s.length > 2 && s.length < 400 && !s.includes("${")) set.add(s);
  }
}

const sorted = [...set].sort();
const adv = {};
sorted.forEach((s, i) => {
  const key = `s${String(i).padStart(4, "0")}`;
  adv[key] = s;
});

const out = { adv };
fs.writeFileSync(path.join(__dirname, "../locales/adv-en-extract.json"), JSON.stringify(out, null, 2));
console.log("Extracted", sorted.length, "strings -> locales/adv-en-extract.json");
