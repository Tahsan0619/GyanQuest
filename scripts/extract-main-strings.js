import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = fs.readFileSync(path.join(__dirname, "../js/main.js"), "utf8");
const patterns = [
  /setCoach\(\s*["']([^"']+)["']/g,
  /setCoach\(\s*`([^`]+)`/g,
  /showToast\(["']([^"']+)["']/g,
  /textContent\s*=\s*["']([^"']{3,200})["']/g,
  /innerHTML\s*=\s*["']([^"']{3,120})["']/g,
  /btn\.\w+\s*=\s*["']([^"']{3,80})["']/g,
];
const set = new Set();
for (const p of patterns) {
  let m;
  while ((m = p.exec(src))) {
    const s = m[1].replace(/\s+/g, " ").trim();
    if (s.length > 2 && s.length < 400 && !s.includes("${") && !s.includes("<motion")) set.add(s);
  }
}
const main = {};
[...set].sort().forEach((s, i) => {
  main[`m${String(i).padStart(4, "0")}`] = s;
});
fs.writeFileSync(path.join(__dirname, "../locales/main-en-extract.json"), JSON.stringify({ main }, null, 2));
console.log("main strings:", Object.keys(main).length);
