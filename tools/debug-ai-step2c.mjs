import { chromium } from "playwright";

const BASE = "http://127.0.0.1:5502";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto(`${BASE}/games/ai-lab/`, { waitUntil: "networkidle" });
await page.evaluate(() => localStorage.removeItem("gq-ai-lab-save-v2"));
await page.reload({ waitUntil: "networkidle" });
await page.getByRole("button", { name: "Play What is AI?" }).click();
await page.click("#ff-intro-go");
await sleep(5000);

await page.click("#apprentice-root [data-rule='ears']");
await sleep(300);
await page.click("#ap-patch");
await sleep(300);
await page.click("#ap-patch");
await sleep(300);
await page.click("#ap-to-apprentice");
await sleep(500);
for (let i = 0; i < 5; i++) {
  await page.click("#apprentice-root [data-feed='stack']");
  await sleep(150);
}
await page.click("#apprentice-root [data-test='1']");
await sleep(200);
await page.click("#apprentice-root [data-test='2']");
await sleep(300);

const dom = await page.evaluate(() => ({
  hints: [...document.querySelectorAll(".ap-hint")].map((h) => h.textContent),
  tests: [...document.querySelectorAll("[data-test]")].map((b) => b.dataset.test),
  okNote: document.querySelector(".ap-note--ok")?.textContent,
}));
console.log("dom:", dom);

await page.evaluate(() => window.__gqSignalGateReady?.());
await sleep(200);

const gate = await page.evaluate(() => ({
  disabled: document.querySelector("#tiny-gate-go")?.disabled,
  status: document.querySelector("#tiny-gate-status")?.textContent,
}));
console.log("gate:", gate);

await browser.close();
