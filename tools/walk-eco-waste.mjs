/**
 * Walk Eco Guardian Waste Watch - 10 steps.
 * Usage: GQ_BASE=http://127.0.0.1:5500 node walk-eco-waste.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.GQ_BASE || "http://127.0.0.1:5500";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getTitle(page) {
  return page.evaluate(() => document.querySelector(".chem-card h3")?.textContent?.trim() || "");
}

async function waitGate(page, ms = 40000, mountTitle = "") {
  const start = Date.now();
  while (Date.now() - start < ms) {
    const titleNow = await getTitle(page);
    if (mountTitle && mountTitle !== titleNow) return;
    const ready = await page.evaluate(() => {
      const b = document.querySelector("#tiny-gate-go");
      return Boolean(b && !b.disabled);
    });
    if (ready) {
      await page.click("#tiny-gate-go");
      return;
    }
    if (!(await page.locator("#tiny-gate-go").count())) return;
    await sleep(250);
  }
  throw new Error(`Gate stuck: ${await getTitle(page)}`);
}

async function tapContinues(page) {
  for (let i = 0; i < 8; i++) {
    const tap = page.locator("#tap-go");
    if (await tap.isVisible({ timeout: 800 }).catch(() => false)) {
      await tap.click();
      await sleep(400);
    } else break;
  }
}

async function click(page, sel) {
  await page.waitForSelector(sel, { timeout: 15000 });
  await page.evaluate((s) => document.querySelector(s).click(), sel);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  try {
    await page.goto(`${BASE}/games/eco-guardian/`, { waitUntil: "networkidle" });
    await page.evaluate(() => localStorage.removeItem("gq-eco-guardian-save-v2"));
    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Play Waste Watch/i }).click();
    await page.click("#ff-intro-go");
    await sleep(600);

    const steps = [
      async () => {
        await sleep(4200);
      },
      async () => {
        for (let i = 0; i < 3; i++) await click(page, "#ww-follow");
      },
      async () => {
        await sleep(300);
      },
      async () => {
        const order = ["al_can", "glass", "cardboard", "plastic", "pizza", "foam"];
        const bins = { al_can: "recycle", glass: "recycle", cardboard: "recycle", plastic: "recycle", pizza: "landfill", foam: "landfill" };
        for (const id of order) {
          await click(page, `#waste-root [data-item='${id}']`);
          await click(page, `#waste-root [data-bin='${bins[id]}']`);
          await sleep(120);
        }
      },
      async () => {
        await sleep(300);
      },
      async () => {
        const order = [
          ["banana", "compost"],
          ["coffee", "compost"],
          ["eggshell", "compost"],
          ["leaves", "compost"],
          ["pfork", "landfill"],
          ["spoon", "recycle"],
        ];
        for (const [id, bin] of order) {
          await click(page, `#waste-root [data-item='${id}']`);
          await click(page, `#waste-root [data-bin='${bin}']`);
          await sleep(120);
        }
        await click(page, "#ww-fast-forward");
      },
      async () => {
        await sleep(300);
      },
      async () => {
        const answers = ["landfill", "recycle", "compost", "landfill", "recycle", "compost", "recycle", "landfill", "compost", "landfill"];
        for (const bin of answers) {
          await click(page, `#waste-root [data-bin='${bin}']`);
          await sleep(100);
        }
      },
      async () => {
        await sleep(300);
      },
      async () => {
        await sleep(3000);
      },
    ];

    for (let i = 0; i < 10; i++) {
      try {
        console.log(`step ${i + 1}/10`);
        await page.waitForSelector("#tiny-gate-go", { timeout: 20000 });
        const title = await getTitle(page);
        await steps[i]();
        await waitGate(page, 45000, title);
        await tapContinues(page);
        const fin = page.locator("#spiral-go");
        if (await fin.isVisible({ timeout: 600 }).catch(() => false)) await fin.click();
        await sleep(400);
        console.log(`step ${i + 1}/10 ok`);
      } catch (e) {
        errors.push({ step: i + 1, error: String(e.message || e) });
        console.error(`FAIL step ${i + 1}:`, e.message);
        try {
          const go = page.locator("#tiny-gate-go");
          if (await go.isVisible({ timeout: 400 }) && !(await go.isDisabled())) {
            await go.click();
            await tapContinues(page);
          }
        } catch (_) {}
      }
    }
  } finally {
    await browser.close();
  }
  console.log(`\nRESULT: ${10 - errors.length}/10`, errors.length ? errors : "");
  if (errors.length) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
