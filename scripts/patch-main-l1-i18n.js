import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const l1 = JSON.parse(fs.readFileSync(path.join(__dirname, "../locales/main-l1-extract.json"), "utf8")).l1;
let src = fs.readFileSync(path.join(__dirname, "../js/main.js"), "utf8");
const entries = Object.entries(l1).sort((a, b) => b[1].length - a[1].length);
let n = 0;
for (const [key, text] of entries) {
  const call = `t("main.l1.${key}")`;
  for (const field of ["title", "instructions", "text", "label", "q", "coach", "hintWrong"]) {
    const from1 = `${field}: "${text}"`;
    const from2 = `${field}: '${text}'`;
    if (src.includes(from1)) {
      src = src.split(from1).join(`${field}: ${call}`);
      n++;
    }
    if (src.includes(from2)) {
      src = src.split(from2).join(`${field}: ${call}`);
      n++;
    }
  }
  const opt = `"${text}"`;
  if (src.includes(opt) && !src.includes(call)) {
    const replaced = src.split(opt).join(call);
    if (replaced !== src) {
      src = replaced;
      n++;
    }
  }
}
fs.writeFileSync(path.join(__dirname, "../js/main.js"), src);
console.log("l1 patches", n);
