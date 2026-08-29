/**
 * Walk Astronomy Solar Family - 10 steps.
 * GQ_BASE=http://127.0.0.1:5500 node walk-solar-family.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.GQ_BASE || "http://127.0.0.1:5500";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getTitle(page) {
  return page.evaluate(() => document.querySelector(".chem-card h3")?.textContent?.trim() || "");
}

async function waitGate(page, ms = 45000, mountTitle = "") {
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
    if (await tap.isVisible({ timeout: 700 }).catch(() => false)) {
      await tap.click();
      await sleep(350);
    } else break;
  }
}

async function click(page, sel) {
  await page.waitForSelector(sel, { timeout: 15000 });
  await page.evaluate((s) => document.querySelector(s).click(), sel);
}

async function setRange(page, sel, val) {
  await page.waitForSelector(sel, { timeout: 15000 });
  await page.locator(sel).evaluate((el, v) => {
    el.value = String(v);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }, val);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  try {
    await page.goto(`${BASE}/games/astronomy-space/`, { waitUntil: "networkidle" });
    await page.evaluate(() => localStorage.removeItem("gq-astronomy-space-save-v2"));
    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Play Solar Family/i }).click();
    await page.click("#ff-intro-go");
    await sleep(500);

    const steps = [
      async () => {
        await sleep(4200);
      },
      async () => {
        await setRange(page, "#sf-speed", 15);
        await click(page, "#sf-release");
        await sleep(200);
        await setRange(page, "#sf-speed", 90);
        await click(page, "#sf-release");
        await sleep(200);
        await setRange(page, "#sf-speed", 50);
        await click(page, "#sf-release");
      },
      async () => {
        await sleep(200);
      },
      async () => {
        const rocky = ["mercury", "venus", "earth", "mars"];
        const gas = ["jupiter", "saturn", "uranus", "neptune"];
        for (const id of rocky) {
          await click(page, `#solar-root [data-planet='${id}']`);
          await click(page, `#solar-root [data-bin='rocky']`);
          await sleep(80);
        }
        for (const id of gas) {
          await click(page, `#solar-root [data-planet='${id}']`);
          await click(page, `#solar-root [data-bin='gas']`);
          await sleep(80);
        }
      },
      async () => {
        await sleep(200);
      },
      async () => {
        for (const id of ["mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus", "neptune"]) {
          await click(page, `#solar-root [data-planet='${id}']`);
          await sleep(80);
        }
      },
      async () => {
        await sleep(200);
      },
      async () => {
        await setRange(page, "#sf-scale-range", 25);
        await click(page, "#sf-lock-guess");
        await click(page, "#sf-reveal-scale");
      },
      async () => {
        await sleep(200);
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
        await sleep(350);
        console.log(`step ${i + 1}/10 ok`);
      } catch (e) {
        errors.push({ step: i + 1, error: String(e.message || e) });
        console.error(`FAIL ${i + 1}:`, e.message);
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
