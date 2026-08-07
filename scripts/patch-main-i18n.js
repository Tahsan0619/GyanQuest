import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const extract = JSON.parse(fs.readFileSync(path.join(__dirname, "../locales/main-en-extract.json"), "utf8"));
let src = fs.readFileSync(path.join(__dirname, "../js/main.js"), "utf8");

if (!src.includes('from "./i18n.js"')) {
  src = `import { initI18n, setLocale, getLocale, onLocaleChange, t, tHtml, applyShellI18n } from "./i18n.js";\n` + src;
}

const entries = Object.entries(extract.main).sort((a, b) => b[1].length - a[1].length);
let count = 0;
for (const [key, text] of entries) {
  const call = `t("main.${key}")`;
  const pairs = [
    [`setCoach("${text}"`, `setCoach(${call}`],
    [`setCoach('${text}'`, `setCoach(${call}`],
    [`showToast("${text}"`, `showToast(${call}`],
    [`textContent = "${text}"`, `textContent = ${call}`],
    [`textContent = '${text}'`, `textContent = ${call}`],
    [`btnNext.textContent = "${text}"`, `btnNext.textContent = ${call}`],
    [`btnPlayground.textContent = "${text}"`, `btnPlayground.textContent = ${call}`],
  ];
  for (const [from, to] of pairs) {
    if (src.includes(from)) {
      src = src.split(from).join(to);
      count++;
    }
  }
}
fs.writeFileSync(path.join(__dirname, "../js/main.js"), src);
console.log("main patched", count);
