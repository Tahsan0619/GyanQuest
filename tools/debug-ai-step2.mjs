import { chromium } from "playwright";

const BASE = "http://127.0.0.1:5502";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function clickEval(page, selector) {
  await page.waitForSelector(selector, { timeout: 20000 });
  await page.evaluate((sel) => document.querySelector(sel)?.click(), selector);
  await sleep(200);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

await page.goto(`${BASE}/games/ai-lab/`, { waitUntil: "networkidle" });
await page.evaluate(() => localStorage.removeItem("gq-ai-lab-save-v2"));
await page.reload({ waitUntil: "networkidle" });
await page.getByRole("button", { name: "Play What is AI?" }).click();
await page.click("#ff-intro-go");
await sleep(5000); // opening auto-advance

console.log("title:", await page.evaluate(() => document.querySelector(".chem-card h3")?.textContent));

await clickEval(page, "#apprentice-root [data-rule='ears']");
await clickEval(page, "#ap-patch");
await clickEval(page, "#ap-patch");
await clickEval(page, "#ap-to-apprentice");
for (let i = 0; i < 5; i++) await clickEval(page, "#apprentice-root [data-feed='stack']");
await clickEval(page, "#apprentice-root [data-test='1']");
await clickEval(page, "#apprentice-root [data-test='2']");

const state = await page.evaluate(() => ({
  gateDisabled: document.querySelector("#tiny-gate-go")?.disabled,
  aiApprenticeTrained: window.__labState?.aiApprenticeTrained,
}));
console.log("after interactions:", state);

const labState = await page.evaluate(() => {
  // try import path - check global
  return {
    patch: document.querySelector("#ap-patch")?.textContent,
    feed: document.querySelector("[data-feed]")?.textContent,
    gate: document.querySelector("#tiny-gate-go")?.disabled,
  };
});
console.log("dom:", labState);

await browser.close();
