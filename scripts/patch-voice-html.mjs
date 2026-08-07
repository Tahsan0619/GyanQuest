import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const gamesDir = path.join(root, "games");
const voiceLink = `  <link rel="stylesheet" href="/engine/css/voice.css" />`;
const caption = `              <p id="voice-caption" class="voice-caption" hidden></p>`;

let n = 0;
for (const name of fs.readdirSync(gamesDir)) {
  const htmlPath = path.join(gamesDir, name, "index.html");
  if (!fs.existsSync(htmlPath)) continue;
  let c = fs.readFileSync(htmlPath, "utf8");
  const orig = c;
  if (!c.includes("voice.css")) {
    if (c.includes("concept-viz.css")) {
      c = c.replace(
        /(<link rel="stylesheet" href="[^"]*concept-viz\.css"\s*\/>)/,
        `$1\n${voiceLink}`,
      );
    } else if (c.includes("kid-theme.css")) {
      c = c.replace(
        /(<link rel="stylesheet" href="[^"]*kid-theme\.css"\s*\/>)/,
        `$1\n${voiceLink}`,
      );
    } else {
      c = c.replace("</head>", `${voiceLink}\n</head>`);
    }
  }
  if (!c.includes('id="voice-caption"')) {
    c = c.replace(
      '<p id="coach-text" class="coach-text"></p>',
      `<p id="coach-text" class="coach-text"></p>\n${caption}`,
    );
  }
  if (c !== orig) {
    fs.writeFileSync(htmlPath, c);
    n += 1;
    console.log("updated", name);
  }
}
console.log("total", n);
