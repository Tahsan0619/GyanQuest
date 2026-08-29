/**
 * Walk Mission 1 (10 steps each) for 5 STEM games = 50 steps.
 * Usage: node walk-stem-missions.mjs
 * Screenshots: GQ_SHOTS=1 node walk-stem-missions.mjs
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.GQ_BASE || "http://127.0.0.1:5502";
const SLOW = Number(process.env.GQ_SLOW || 0);
const ONLY = process.env.GQ_ONLY || "";
const SHOT_DIR = process.env.GQ_SHOTS
  ? path.join(__dirname, "screenshots-qa", `stem-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}`)
  : null;

let shotIndex = 0;
const visualIssues = [];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms + SLOW));

async function getStepTitle(page) {
  return await page.evaluate(() => document.querySelector(".chem-card h3")?.textContent?.trim() || "");
}

async function waitGate(page, ms = 45000, mountTitle = "") {
  const titleBefore = await getStepTitle(page);

  const gateReady = async () =>
    page.evaluate(() => {
      const b = document.querySelector("#tiny-gate-go");
      return Boolean(b && !b.disabled);
    });

  if (await gateReady()) {
    await page.click("#tiny-gate-go");
    return;
  }

  const start = Date.now();
  while (Date.now() - start < ms) {
    const titleNow = await getStepTitle(page);
    if (mountTitle && mountTitle !== titleNow) return;
    if (titleBefore && titleBefore !== titleNow) return;
    if (await gateReady()) {
      await page.click("#tiny-gate-go");
      return;
    }
    const gateCount = await page.locator("#tiny-gate-go").count();
    if (!gateCount) return;
    await sleep(250);
  }

  const titleAfter = await getStepTitle(page);
  if (mountTitle && mountTitle !== titleAfter) return;
  if (titleBefore && titleBefore !== titleAfter) return;
  const gateCount = await page.locator("#tiny-gate-go").count();
  if (!gateCount) return;
  throw new Error(`Gate stuck: "${titleAfter || titleBefore || "?"}"`);
}

async function tapContinues(page) {
  for (let i = 0; i < 10; i++) {
    const tap = page.locator("#tap-go");
    try {
      await tap.waitFor({ state: "visible", timeout: 4000 });
      await tap.click();
      await sleep(500);
    } catch {
      break;
    }
  }
  await sleep(700);
}

async function waitTitle(page, text) {
  await page.waitForFunction(
    (t) => (document.querySelector(".chem-card h3")?.textContent || "").includes(t),
    text,
    { timeout: 30000 }
  );
  await sleep(300);
}

async function spiralFinish(page) {
  const fin = page.locator("#spiral-go");
  if (await fin.isVisible({ timeout: 800 }).catch(() => false)) {
    await fin.click();
    await sleep(300);
  }
}

async function clickEval(page, selector) {
  await page.waitForSelector(selector, { timeout: 20000 });
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) throw new Error(`missing ${sel}`);
    el.click();
  }, selector);
}

async function setInput(page, selector, val) {
  await page.waitForSelector(selector, { timeout: 20000 });
  await page.locator(selector).evaluate((el, v) => {
    el.value = String(v);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }, val);
  await sleep(150);
}

async function holdMouse(page, selector, ms = 2500) {
  const el = page.locator(selector);
  await el.waitFor({ state: "visible", timeout: 20000 });
  const box = await el.boundingBox();
  if (!box) throw new Error(`no box for ${selector}`);
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await sleep(ms);
  await page.mouse.up();
}

async function waitStepMount(page) {
  await page.waitForSelector("#tiny-gate-go", { timeout: 20000 });
  await sleep(500);
}

async function captureShot(page, label) {
  if (!SHOT_DIR) return;
  fs.mkdirSync(SHOT_DIR, { recursive: true });
  shotIndex += 1;
  const safe = label.replace(/[^a-z0-9_-]+/gi, "-").slice(0, 80);
  await page.screenshot({ path: path.join(SHOT_DIR, `${String(shotIndex).padStart(2, "0")}-${safe}.png`) });
}

async function auditPage(page, ctx) {
  const audit = await page.evaluate(() => {
    const emDash = [];
    const walk = (el) => {
      if (el.nodeType === 3 && el.textContent?.includes("\u2014")) emDash.push(el.textContent.trim().slice(0, 80));
      el.childNodes?.forEach(walk);
    };
    walk(document.body);
    const brokenImgs = [...document.querySelectorAll("img")]
      .filter((img) => img.naturalWidth === 0 && img.src && !img.src.startsWith("data:"))
      .map((img) => img.src);
    return { emDashCount: emDash.length, emDashSample: emDash.slice(0, 2), brokenImgs };
  });
  if (audit.emDashCount > 0) visualIssues.push({ ctx, type: "em-dash", ...audit });
  if (audit.brokenImgs.length > 0) visualIssues.push({ ctx, type: "broken-img", ...audit });
}

async function startMission(page, gamePath, storageKey, playLabel) {
  await page.goto(`${BASE}/games/${gamePath}/`, { waitUntil: "networkidle" });
  await page.evaluate((key) => localStorage.removeItem(key), storageKey);
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: playLabel }).click();
  await page.click("#ff-intro-go");
  await sleep(500);
}

async function finishMission(page) {
  const claim = page.locator("#ff-claim");
  if (await claim.isVisible({ timeout: 3000 }).catch(() => false)) await claim.click();
  const fin = page.locator("#ff-fin");
  if (await fin.isVisible({ timeout: 3000 }).catch(() => false)) await fin.click();
  await sleep(400);
}

const aiSteps = [
  async () => {
    await sleep(4200);
  },
  async (page) => {
    await waitTitle(page, "Not Programmed");
    await clickEval(page, "#apprentice-root [data-rule='ears']");
    await clickEval(page, "#ap-patch");
    await clickEval(page, "#ap-patch");
    await clickEval(page, "#ap-to-apprentice");
    for (let i = 0; i < 5; i++) {
      await clickEval(page, "#apprentice-root [data-feed='stack']");
    }
    await clickEval(page, "#apprentice-root [data-test='1']");
    await clickEval(page, "#apprentice-root [data-test='2']");
  },
  async () => {
    await sleep(200);
  },
  async (page) => {
    await waitTitle(page, "Apprentice Learns");
    for (let i = 0; i < 5; i++) {
      await clickEval(page, "#apprentice-root #ap-guess-cat");
      await clickEval(page, "#apprentice-root #ap-next-round");
      await sleep(200);
    }
  },
  async () => {
    await sleep(200);
  },
  async (page) => {
    await waitTitle(page, "Actually Learn");
    await clickEval(page, "#apprentice-root #ap-run-test");
  },
  async () => {
    await sleep(200);
  },
  async (page) => {
    await waitTitle(page, "AI All Around");
    for (const d of ["speech", "photos", "music", "spam"]) {
      await clickEval(page, `#apprentice-root [data-data='${d}']`);
    }
  },
  async () => {
    await sleep(200);
  },
  async () => {
    await sleep(3000);
  },
];

const mlSteps = [
  async () => {
    await sleep(4200);
  },
  async (page) => {
    await waitTitle(page, "Gathering Good");
    for (let round = 0; round < 20; round++) {
      const fix = page.locator("#academy-root [data-fix]").first();
      if (await fix.isVisible({ timeout: 400 }).catch(() => false)) {
        await fix.click();
        await sleep(150);
      } else {
        const next = page.locator("#ac-next-card");
        if (await next.isVisible({ timeout: 400 }).catch(() => false)) {
          await next.click();
          await sleep(150);
        } else break;
      }
    }
    await clickEval(page, "#ac-to-compare");
    await clickEval(page, "#ac-run-compare");
  },
  async () => {
    await sleep(200);
  },
  async (page) => {
    await waitTitle(page, "Split Before");
    for (let i = 0; i < 8; i++) await clickEval(page, "#ac-add-practice");
    for (let i = 0; i < 2; i++) await clickEval(page, "#ac-add-vault");
    await clickEval(page, "#ac-seal-vault");
    await clickEval(page, "#ac-peek-vault");
  },
  async () => {
    await sleep(200);
  },
  async (page) => {
    await waitTitle(page, "Practice Loop");
    for (let i = 0; i < 4; i++) await clickEval(page, "#ac-run-epoch");
    await clickEval(page, "#ac-stop-train");
  },
  async () => {
    await sleep(200);
  },
  async (page) => {
    await waitTitle(page, "Report Card");
    await clickEval(page, "#ac-unlock-exam");
  },
  async () => {
    await sleep(200);
  },
  async () => {
    await sleep(3000);
  },
];

const circSteps = [
  async () => {
    await sleep(4200);
  },
  async (page) => {
    await waitTitle(page, "Close the Loop");
    for (const g of ["g1", "g2", "g3", "g4"]) {
      await clickEval(page, `#circuit-root [data-gap='${g}']`);
    }
    await clickEval(page, "#circuit-root [data-gap='g2']");
  },
  async () => {
    await sleep(200);
  },
  async (page) => {
    await waitTitle(page, "Swap the Battery");
    for (const b of ["weak", "medium", "strong"]) {
      await clickEval(page, `#circuit-root [data-battery='${b}']`);
    }
  },
  async () => {
    await sleep(200);
  },
  async (page) => {
    await waitTitle(page, "Flow");
    await clickEval(page, "#ck-see-flow");
    await sleep(400);
    await clickEval(page, "#ck-thick-wire");
    await clickEval(page, "#ck-remove-bulb");
    await clickEval(page, "#ck-restore-bulb");
  },
  async () => {
    await sleep(200);
  },
  async (page) => {
    await waitTitle(page, "Add a Switch");
    await clickEval(page, "#ck-add-switch");
    await clickEval(page, "#ck-toggle-switch");
    await clickEval(page, "#ck-toggle-switch");
    await clickEval(page, "#ck-toggle-switch");
  },
  async () => {
    await sleep(200);
  },
  async () => {
    await sleep(3000);
  },
];

const structSteps = [
  async () => {
    await sleep(4200);
  },
  async (page) => {
    await waitTitle(page, "Push the Square");
    await setInput(page, "#st-push-range", 80);
    await clickEval(page, "#st-add-diagonal");
    await setInput(page, "#st-braced-push-range", 65);
  },
  async () => {
    await sleep(200);
  },
  async (page) => {
    await waitTitle(page, "Wide Base");
    await clickEval(page, "#st-wind-narrow");
    await clickEval(page, "#st-wind-wide");
  },
  async () => {
    await sleep(200);
  },
  async (page) => {
    await waitTitle(page, "Trace the Load");
    await clickEval(page, "#st-drop-good");
    await clickEval(page, "#st-drop-weak");
  },
  async () => {
    await sleep(200);
  },
  async (page) => {
    await waitTitle(page, "Load Them Both");
    await setInput(page, "#st-load-slider", 40);
  },
  async () => {
    await sleep(200);
  },
  async () => {
    await sleep(3000);
  },
];

const levSteps = [
  async () => {
    await sleep(4200);
  },
  async (page) => {
    await waitTitle(page, "Lift It By Hand");
    await holdMouse(page, "#lv-hand-push", 2800);
    await clickEval(page, "#lv-plank-push");
  },
  async () => {
    await sleep(200);
  },
  async (page) => {
    await waitTitle(page, "Where You Push");
    await setInput(page, "#lv-fulcrum-range", 25);
    await clickEval(page, "#lv-fulcrum-push");
    await setInput(page, "#lv-fulcrum-range", 75);
    await clickEval(page, "#lv-fulcrum-push");
  },
  async () => {
    await sleep(200);
  },
  async (page) => {
    await waitTitle(page, "Turning Force");
    await clickEval(page, "#lv-crank-lift");
    await clickEval(page, "#lv-crank-reverse");
  },
  async () => {
    await sleep(200);
  },
  async (page) => {
    await waitTitle(page, "Sort the Simple");
    const pairs = [
      ["scissors", "lever"],
      ["opener", "lever"],
      ["wheelbarrow", "lever"],
      ["seesaw", "lever"],
      ["clock", "gear"],
      ["gearshift", "gear"],
    ];
    for (const [item, bin] of pairs) {
      await clickEval(page, `#lever-root .lv-assign[data-item='${item}'][data-bin='${bin}']`);
    }
  },
  async () => {
    await sleep(200);
  },
  async () => {
    await sleep(3000);
  },
];

async function walkSteps(page, steps, tag) {
  const errors = [];
  for (let i = 0; i < 10; i++) {
    const stepNum = i + 1;
    const label = `${tag}-step${stepNum}`;
    try {
      console.log(`  step ${stepNum}/10`);
      await waitStepMount(page);
      const titleAtMount = await getStepTitle(page);
      await captureShot(page, `${label}-mounted`);
      await steps[i](page);
      await auditPage(page, label);
      await captureShot(page, `${label}-interactive`);
      await waitGate(page, 45000, titleAtMount);
      await tapContinues(page);
      await spiralFinish(page);
      await sleep(400);
      console.log(`  step ${stepNum}/10 ok`);
    } catch (e) {
      errors.push({ step: stepNum, error: String(e.message || e) });
      console.error(`  FAIL step ${stepNum}:`, e.message);
      await captureShot(page, `${label}-FAIL`);
      try {
        const go = page.locator("#tiny-gate-go");
        if (await go.isVisible({ timeout: 500 }) && !(await go.isDisabled())) {
          await go.click();
          await tapContinues(page);
          await spiralFinish(page);
        }
      } catch (_) {}
      await sleep(400);
    }
  }
  return errors;
}

const MISSIONS = [
  { name: "What is AI?", path: "ai-lab", key: "gq-ai-lab-save-v2", play: "Play What is AI?", steps: aiSteps, tag: "ai" },
  { name: "Teach the Model", path: "ml-lab", key: "gq-ml-lab-save-v2", play: "Play Teach the Model", steps: mlSteps, tag: "ml" },
  { name: "Circuit Loop", path: "electrical-basics", key: "gq-electrical-basics-save-v2", play: "Play Circuit Loop", steps: circSteps, tag: "circ" },
  { name: "Strong Structures", path: "civil-basics", key: "gq-civil-basics-save-v2", play: "Play Strong Structures", steps: structSteps, tag: "struct" },
  { name: "Levers & Gears", path: "mechanical-basics", key: "gq-mechanical-basics-save-v2", play: "Play Levers & Gears", steps: levSteps, tag: "lev" },
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const report = [];

  if (SHOT_DIR) {
    fs.mkdirSync(SHOT_DIR, { recursive: true });
    console.log(`Screenshots -> ${SHOT_DIR}`);
  }

  try {
    for (const m of MISSIONS.filter((x) => !ONLY || x.tag === ONLY || x.name.toLowerCase().includes(ONLY.toLowerCase()))) {
      console.log(`=== ${m.name} ===`);
      await startMission(page, m.path, m.key, m.play);
      report.push({ mission: m.name, errors: await walkSteps(page, m.steps, m.tag) });
      await finishMission(page);
      await sleep(600);
    }
  } finally {
    await browser.close();
  }

  const totalFail = report.reduce((n, r) => n + r.errors.length, 0);
  const totalSteps = report.length * 10;
  console.log("\n=== REPORT ===");
  for (const r of report) {
    console.log(`${r.mission}: ${10 - r.errors.length}/10 ok`, r.errors.length ? r.errors : "");
  }
  console.log(`Total: ${totalSteps - totalFail}/${totalSteps} steps passed`);
  if (SHOT_DIR) console.log(`Screenshots: ${shotIndex} in ${SHOT_DIR}`);
  if (visualIssues.length) {
    console.log("\n=== VISUAL AUDIT ===");
    for (const v of visualIssues) console.log(v.type, v.ctx);
  }
  if (SHOT_DIR) {
    fs.writeFileSync(path.join(SHOT_DIR, "report.json"), JSON.stringify({ report, visualIssues }, null, 2));
  }
  if (totalFail > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
