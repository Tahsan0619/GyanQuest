import { chromium } from "playwright";

const BASE = "http://127.0.0.1:5502";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function snap(page, label) {
  const info = await page.evaluate(() => ({
    title: document.querySelector(".chem-card h3")?.textContent,
    gate: document.querySelector("#tiny-gate-go")?.disabled,
    patch: !!document.querySelector("#ap-patch"),
    toApp: !!document.querySelector("#ap-to-apprentice"),
    feed: !!document.querySelector("[data-feed]"),
    test1: !!document.querySelector("[data-test='1']"),
    rules: [...document.querySelectorAll("[data-rule]")].map((b) => b.dataset.rule),
  }));
  console.log(label, info);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto(`${BASE}/games/ai-lab/`, { waitUntil: "networkidle" });
await page.evaluate(() => localStorage.removeItem("gq-ai-lab-save-v2"));
await page.reload({ waitUntil: "networkidle" });
await page.getByRole("button", { name: "Play What is AI?" }).click();
await page.click("#ff-intro-go");
await sleep(5000);
await snap(page, "step2 start");

await page.click("#apprentice-root [data-rule='ears']");
await sleep(400);
await snap(page, "after ears");

await page.click("#ap-patch");
await sleep(300);
await snap(page, "after patch1");

await page.click("#ap-patch");
await sleep(300);
await snap(page, "after patch2");

await browser.close();
