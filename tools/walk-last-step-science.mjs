/**
 * QA last step (10/10) only for Force Fighter, Chemistry, Biology — 3 missions each.
 * Usage: node walk-last-step-science.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.GQ_BASE || "http://127.0.0.1:5502";
const SUB = 9; // step 10

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const MISSIONS = [
  { cluster: "Force", name: "The Lazy Rock", path: "force-fighter", key: "gq-force-fighter-save-v2", level: 0, play: "Play The Lazy Rock" },
  { cluster: "Force", name: "Push Power", path: "force-fighter", key: "gq-force-fighter-save-v2", level: 1, play: "Play Push Power" },
  { cluster: "Force", name: "Push & Pull", path: "force-fighter", key: "gq-force-fighter-save-v2", level: 2, play: "Play Push & Pull" },
  { cluster: "Chem", name: "Tiny Bits", path: "chemistry-lab", key: "gq-chemistry-lab-save-v1", level: 0, play: "Play Tiny Bits", chemPlay: true },
  { cluster: "Chem", name: "Element Hunt", path: "chemistry-lab", key: "gq-chemistry-lab-save-v1", level: 1, play: "Play Element Hunt", chemPlay: true },
  { cluster: "Chem", name: "Bond Buddies", path: "chemistry-lab", key: "gq-chemistry-lab-save-v1", level: 2, play: "Play Bond Buddies", chemPlay: true },
  { cluster: "Bio", name: "Living or Not", path: "bio-explorer", key: "gq-bio-explorer-save-v2", level: 0, play: "Play Living or Not" },
  { cluster: "Bio", name: "Cell City", path: "bio-explorer", key: "gq-bio-explorer-save-v2", level: 1, play: "Play Cell City" },
  { cluster: "Bio", name: "Plant Power", path: "bio-explorer", key: "gq-bio-explorer-save-v2", level: 2, play: "Play Plant Power" },
];

async function seedLastStep(page, key, level) {
  await page.evaluate(
    ({ key, level, sub }) => {
      const completed = Array.from({ length: 10 }, () => Array(10).fill(false));
      for (let i = 0; i < sub; i++) completed[level][i] = true;
      if (level >= 1) completed[0] = Array(10).fill(true);
      if (level >= 2) completed[1] = Array(10).fill(true);
      const introSeen = Array(10).fill(false);
      introSeen[level] = true;
      localStorage.setItem(
        key,
        JSON.stringify({
          level,
          sub,
          completed,
          rewards: Array.from({ length: 10 }, () => ({ earned: false, stars: 0 })),
          introSeen,
          inHub: false,
        })
      );
      sessionStorage.setItem("gq-qa-jump", "1");
    },
    { key, level, sub: SUB }
  );
}

async function waitGate(page, ms = 12000) {
  await page.waitForSelector("#tiny-gate-go", { timeout: 20000 });
  await page.waitForFunction(
    () => {
      const b = document.querySelector("#tiny-gate-go");
      return b && !b.disabled;
    },
    null,
    { timeout: ms }
  );
  await clickEval(page, "#tiny-gate-go");
}

async function clickEval(page, selector) {
  await page.waitForSelector(selector, { timeout: 20000 });
  await page.evaluate((sel) => document.querySelector(sel)?.click(), selector);
  await sleep(200);
}

async function finishSpiral(page) {
  await page.waitForSelector("#spiral-go", { timeout: 15000 });
  const hasStop = await page.evaluate(() => !!document.querySelector("[data-stop='1']"));
  if (hasStop) {
    await clickEval(page, "[data-stop='1']");
    await sleep(500);
  }
  await clickEval(page, "#spiral-go");
}

async function auditPage(page) {
  return page.evaluate(() => {
    const brokenImgs = [...document.querySelectorAll("img")]
      .filter((img) => img.naturalWidth === 0 && img.src && !img.src.startsWith("data:"))
      .map((img) => img.src);
    const title = document.querySelector(".chem-card h3")?.textContent?.trim() || "";
    const hasClaim = !!document.querySelector("#ff-claim") || !!document.querySelector("#chem-claim");
    return { title, brokenImgs, hasClaim };
  });
}

async function testLastStep(page, m) {
  const qs = m.chemPlay ? "?play=1" : "";
  await page.goto(`${BASE}/games/${m.path}/index.html${qs}`, { waitUntil: "networkidle" });
  await seedLastStep(page, m.key, m.level);
  await page.reload({ waitUntil: "networkidle" });

  await page.waitForSelector("#tiny-gate-go", { timeout: 25000 });
  const mounted = await auditPage(page);

  await waitGate(page, 12000);
  await sleep(300);
  await finishSpiral(page);
  await sleep(400);

  await page.waitForFunction(
    () => document.querySelector("#ff-claim") || document.querySelector("#chem-claim"),
    null,
    { timeout: 10000 }
  );

  const after = await auditPage(page);
  return { mounted, after, ok: after.hasClaim };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const results = [];

  try {
    for (const m of MISSIONS) {
      process.stdout.write(`${m.cluster} · ${m.name} step 10 … `);
      try {
        const r = await testLastStep(page, m);
        if (r.after.brokenImgs.length) {
          console.log("FAIL (broken img)", r.after.brokenImgs[0]);
          results.push({ ...m, ok: false, error: "broken-img", ...r });
        } else if (r.ok) {
          console.log("ok —", r.mounted.title);
          results.push({ ...m, ok: true, title: r.mounted.title });
        } else {
          console.log("FAIL (no claim button)");
          results.push({ ...m, ok: false, error: "no-claim" });
        }
      } catch (e) {
        console.log("FAIL", e.message?.split("\n")[0]);
        results.push({ ...m, ok: false, error: String(e.message || e) });
      }
      await sleep(400);
    }
  } finally {
    await browser.close();
  }

  const pass = results.filter((r) => r.ok).length;
  console.log(`\n=== LAST STEP REPORT ===`);
  console.log(`${pass}/9 missions passed step 10`);
  for (const r of results.filter((r) => !r.ok)) {
    console.log(`  FAIL: ${r.cluster} ${r.name} — ${r.error}`);
  }
  if (pass < 9) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
