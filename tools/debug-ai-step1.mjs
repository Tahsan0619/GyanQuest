import { chromium } from "playwright";

const BASE = "http://127.0.0.1:5502";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

await page.goto(`${BASE}/games/ai-lab/`, { waitUntil: "networkidle" });
await page.evaluate(() => localStorage.removeItem("gq-ai-lab-save-v2"));
await page.reload({ waitUntil: "networkidle" });

const playBtn = page.getByRole("button", { name: "Play What is AI?" });
console.log("play visible:", await playBtn.isVisible());
await playBtn.click();
await page.click("#ff-intro-go");
await sleep(500);

for (const t of [0, 2000, 4000, 5000, 6000]) {
  if (t) await sleep(t === 0 ? 0 : 2000);
  const info = await page.evaluate(() => ({
    title: document.querySelector(".chem-card h3")?.textContent,
    gateDisabled: document.querySelector("#tiny-gate-go")?.disabled,
    gateExists: !!document.querySelector("#tiny-gate-go"),
    apprentice: !!document.getElementById("apprentice-root"),
    sub: document.querySelector("#play-dock")?.dataset?.sub,
  }));
  console.log(`at ${t}ms:`, info);
}

await browser.close();
