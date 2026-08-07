import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), "../js/playground-ui.js");
let s = fs.readFileSync(file, "utf8");
const d = "di" + "v";
const block =
  '        <h3 class="playground-sub">${t("playground.guidedTitle")}</h3>\r\n' +
  `        <${d} class="playground-preset-scroll" id="pg-presets"></${d}>\r\n\r\n` +
  '        <h3 class="playground-sub">${t("playground.assetsTitle")}</h3>\r\n' +
  `        <${d} class="playground-spawn-scroll" id="pg-spawn"></${d}>`;
const swapped =
  '        <h3 class="playground-sub">${t("playground.assetsTitle")}</h3>\r\n' +
  `        <${d} class="playground-spawn-scroll" id="pg-spawn"></${d}>\r\n\r\n` +
  '        <h3 class="playground-sub">${t("playground.guidedTitle")}</h3>\r\n' +
  `        <${d} class="playground-preset-scroll" id="pg-presets"></${d}>`;
if (!s.includes(block)) {
  console.error("block not found");
  process.exit(1);
}
fs.writeFileSync(file, s.replace(block, swapped));
console.log("reordered");
