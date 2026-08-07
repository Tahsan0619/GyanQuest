import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = fs.readFileSync(path.join(__dirname, "../js/main.js"), "utf8");
const patterns = [
  /title:\s*["']([^"']+)["']/g,
  /instructions:\s*["']([^"']+)["']/g,
  /text:\s*["']([^"']+)["']/g,
  /label:\s*["']([^"']+)["']/g,
  /q:\s*["']([^"']+)["']/g,
  /opts:\s*\[([^\]]+)\]/g,
  /coach:\s*["']([^"']+)["']/g,
  /hintWrong:\s*["']([^"']+)["']/g,
];
const set = new Set();
for (const p of patterns) {
  let m;
  while ((m = p.exec(src))) {
    if (p.source.includes("opts")) {
      const inner = m[1];
      const opts = inner.match(/["']([^"']+)["']/g);
      opts?.forEach((o) => set.add(o.slice(1, -1)));
    } else {
      const s = m[1].trim();
      if (s.length > 2 && s.length < 300 && !s.includes("${")) set.add(s);
    }
  }
}
const l1 = {};
[...set].sort().forEach((s, i) => {
  l1[`k${String(i).padStart(4, "0")}`] = s;
});
const existing = JSON.parse(fs.readFileSync(path.join(__dirname, "../locales/main-en-extract.json"), "utf8"));
fs.writeFileSync(
  path.join(__dirname, "../locales/main-l1-extract.json"),
  JSON.stringify({ l1 }, null, 2)
);
console.log("l1 config strings:", Object.keys(l1).length);
