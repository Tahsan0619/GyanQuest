/**
 * Replace extracted English literals in levels-advanced.js with t('adv.KEY') calls.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const extract = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../locales/adv-en-extract.json"), "utf8")
);
const filePath = path.join(__dirname, "../js/levels-advanced.js");
let src = fs.readFileSync(filePath, "utf8");

if (!src.includes('from "./i18n.js"')) {
  src =
    'import { t } from "./i18n.js";\n' +
    src.replace(
      /^import \{/m,
      "import {"
    );
  // Insert after first import block
  const firstImportEnd = src.indexOf('import { spectatorPauseMs');
  if (firstImportEnd > 0) {
    src = src.slice(0, firstImportEnd) + 'import { t } from "./i18n.js";\n' + src.slice(firstImportEnd);
  }
}

const entries = Object.entries(extract.adv).sort((a, b) => b[1].length - a[1].length);

function escRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

let count = 0;
for (const [key, text] of entries) {
  const call = `t("adv.${key}")`;
  const patterns = [
    [`setCoach("${text}"`, `setCoach(${call}`],
    [`setCoach('${text}'`, `setCoach(${call}`],
    [`title: "${text}"`, `title: ${call}`],
    [`title: '${text}'`, `title: ${call}`],
    [`label: "${text}"`, `label: ${call}`],
    [`label: '${text}'`, `label: ${call}`],
    [`instructions: "${text}"`, `instructions: ${call}`],
    [`text: "${text}"`, `text: ${call}`],
    [`question: "${text}"`, `question: ${call}`],
    [`coachShort: "${text}"`, `coachShort: ${call}`],
    [`hintWrong: "${text}"`, `hintWrong: ${call}`],
    [`textContent = "${text}"`, `textContent = ${call}`],
    [`textContent = '${text}'`, `textContent = ${call}`],
  ];
  for (const [from, to] of patterns) {
    if (src.includes(from)) {
      src = src.split(from).join(to);
      count++;
    }
  }
}

fs.writeFileSync(filePath, src);
console.log("Patched", count, "replacements in levels-advanced.js");
