/**
 * Walk all 50 steps: Web Dev (3x10) + Backend (1x10) + Database (1x10).
 * Usage: node walk-five-missions.mjs
 * Screenshots: GQ_SHOTS=1 node walk-five-missions.mjs
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.GQ_BASE || "http://127.0.0.1:5502";
const SLOW = Number(process.env.GQ_SLOW || 0);
const SHOT_DIR = process.env.GQ_SHOTS
  ? path.join(
      __dirname,
      "screenshots-qa",
      new Date().toISOString().slice(0, 19).replace(/:/g, "-")
    )
  : null;

let shotIndex = 0;
const visualIssues = [];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms + SLOW));

async function auditPage(page, ctx) {
  const audit = await page.evaluate(() => {
    const emDash = [];
    const walk = (el) => {
      if (el.nodeType === 3 && el.textContent?.includes("\u2014")) {
        emDash.push(el.textContent.trim().slice(0, 120));
      }
      el.childNodes?.forEach(walk);
    };
    walk(document.body);
    const brokenImgs = [...document.querySelectorAll("img")]
      .filter((img) => img.naturalWidth === 0 && img.src && !img.src.startsWith("data:"))
      .map((img) => img.src);
    const gate = document.querySelector("#tiny-gate-go");
    return {
      title: document.querySelector(".chem-card h3")?.textContent?.trim() || "",
      gateDisabled: gate?.disabled ?? null,
      emDashCount: emDash.length,
      emDashSample: emDash.slice(0, 3),
      brokenImgs,
    };
  });
  if (audit.emDashCount > 0) {
    visualIssues.push({ ctx, type: "em-dash", ...audit });
  }
  if (audit.brokenImgs.length > 0) {
    visualIssues.push({ ctx, type: "broken-img", ...audit });
  }
  return audit;
}

async function captureShot(page, label) {
  if (!SHOT_DIR) return;
  fs.mkdirSync(SHOT_DIR, { recursive: true });
  shotIndex += 1;
  const safe = label.replace(/[^a-z0-9_-]+/gi, "-").slice(0, 80);
  const file = path.join(SHOT_DIR, `${String(shotIndex).padStart(2, "0")}-${safe}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`    screenshot: ${path.basename(file)}`);
}

async function waitGate(page, ms = 45000) {
  await page.waitForFunction(
    () => {
      const b = document.querySelector("#tiny-gate-go");
      return b && !b.disabled;
    },
    { timeout: ms }
  );
  await page.click("#tiny-gate-go");
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

async function waitScene(page, selector, ms = 20000) {
  await page.waitForSelector(selector, { timeout: ms });
  await sleep(350);
}

async function clickEval(page, selector) {
  await page.waitForSelector(selector, { timeout: 20000 });
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) throw new Error(`missing ${sel}`);
    el.click();
  }, selector);
}

async function fireDrop(page, chipSel, targetSel, dataKey, dataValue) {
  await page.waitForSelector(chipSel, { timeout: 20000 });
  await page.waitForSelector(targetSel, { timeout: 20000 });
  await page.evaluate(
    ({ chipSel, targetSel, dataKey, dataValue }) => {
      const chip = document.querySelector(chipSel);
      const target = document.querySelector(targetSel);
      if (!chip || !target) throw new Error(`drop missing: ${chipSel} -> ${targetSel}`);
      const dt = new DataTransfer();
      dt.setData(dataKey, dataValue);
      chip.dispatchEvent(new DragEvent("dragstart", { bubbles: true, cancelable: true, dataTransfer: dt }));
      target.dispatchEvent(new DragEvent("dragover", { bubbles: true, cancelable: true, dataTransfer: dt }));
      target.dispatchEvent(new DragEvent("drop", { bubbles: true, cancelable: true, dataTransfer: dt }));
    },
    { chipSel, targetSel, dataKey, dataValue }
  );
  await sleep(250);
}

async function pieceToSlot(page, pieceId, slotKey, zone = false) {
  const rootSel = "#html-house-root";
  const slotAttr = zone ? "data-zone" : "data-slot";
  await page.waitForSelector(`${rootSel} [data-piece="${pieceId}"]`, { timeout: 20000 });
  await page.waitForSelector(`${rootSel} [${slotAttr}="${slotKey}"]`, { timeout: 20000 });
  await page.evaluate(
    ({ pieceId, slotKey, zone }) => {
      const root = document.getElementById("html-house-root");
      const p = root.querySelector(`[data-piece="${pieceId}"]`);
      const s = zone
        ? root.querySelector(`[data-zone="${slotKey}"]`)
        : root.querySelector(`[data-slot="${slotKey}"]`);
      p.click();
      s.click();
    },
    { pieceId, slotKey, zone }
  );
  await sleep(250);
}

async function waitStepMount(page) {
  await page.waitForSelector("#tiny-gate-go", { timeout: 20000 });
  await sleep(500);
}

async function setSlider(page, name, val) {
  const sel = `#css-house-root [data-slider="${name}"]`;
  await page.waitForSelector(sel, { timeout: 20000 });
  await page.locator(sel).evaluate((el, v) => {
    el.value = String(v);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }, val);
  await sleep(150);
}

async function paintRoom(page, room, colorHex) {
  await clickEval(page, "#css-house-root #ch-pointer");
  await clickEval(page, `#css-house-root .ch-room[data-room="${room}"]`);
  await clickEval(page, `#css-house-root .ch-swatch[data-color="${colorHex}"]`);
}

async function startMission(page, url, storageKey, playLabel) {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate((key) => localStorage.removeItem(key), storageKey);
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: playLabel }).click();
  await page.click("#ff-intro-go");
  await sleep(500);
}

async function finishMission(page) {
  const claim = page.locator("#ff-claim");
  if (await claim.isVisible({ timeout: 3000 }).catch(() => false)) {
    await claim.click();
  }
  const fin = page.locator("#ff-fin");
  if (await fin.isVisible({ timeout: 3000 }).catch(() => false)) {
    await fin.click();
  }
  await sleep(400);
}

const htmlSteps = [
  async () => {
    await sleep(3500);
  },
  async (page) => {
    await pieceToSlot(page, "open", "open");
    await pieceToSlot(page, "content", "content");
    await pieceToSlot(page, "close", "close");
    await pieceToSlot(page, "open", "open");
    await pieceToSlot(page, "content", "content");
  },
  async () => {
    await sleep(200);
  },
  async (page) => {
    await waitTitle(page, "Nest");
    for (const s of ["outer-open", "inner-open", "inner-close", "outer-close"]) {
      await pieceToSlot(page, s, s);
    }
    for (const s of ["outer-open", "inner-open", "outer-close", "inner-close"]) {
      await pieceToSlot(page, s, s);
    }
  },
  async () => {
    await sleep(200);
  },
  async (page) => {
    await waitTitle(page, "Furnish");
    for (const z of ["header", "hero", "main", "footer", "div"]) {
      await pieceToSlot(page, z, z, true);
    }
  },
  async () => {
    await sleep(200);
  },
  async (page) => {
    await waitTitle(page, "Cut a Window");
    await pieceToSlot(page, "iframe", "iframe");
    await pieceToSlot(page, "src", "src");
  },
  async () => {
    await sleep(200);
  },
  async () => {
    await sleep(7500);
  },
];

const cssSteps = [
  async () => {
    await sleep(3500);
  },
  async (page) => {
    await paintRoom(page, "main", "#7dd3fc");
    await paintRoom(page, "header", "#fda4af");
  },
  async () => {
    await sleep(200);
  },
  async (page) => {
    await waitTitle(page, "Box Model");
    await setSlider(page, "padding", 20);
    await setSlider(page, "border", 6);
    await setSlider(page, "margin", 16);
  },
  async () => {
    await sleep(200);
  },
  async (page) => {
    await waitTitle(page, "Resize");
    await setSlider(page, "width", 320);
    await setSlider(page, "height", 180);
    for (const a of ["left", "center", "right"]) {
      await clickEval(page, `#css-house-root .ch-align[data-align="${a}"]`);
    }
  },
  async () => {
    await sleep(200);
  },
  async (page) => {
    await waitTitle(page, "Style Them All");
    for (let i = 0; i < 3; i++) {
      await clickEval(page, "#css-house-root [data-rule='cozy']");
    }
    await clickEval(page, "#css-house-root [data-rule='override']");
  },
  async () => {
    await sleep(200);
  },
  async () => {
    await sleep(7500);
  },
];

const jsSteps = [
  async () => {
    await sleep(3500);
  },
  async (page) => {
    await fireDrop(page, "#js-house-root [data-drag='wire']", "#js-wire-slot", "text/js-drag", "wire");
    await fireDrop(page, "#js-house-root [data-drag='connector']", "#js-connector-slot", "text/js-drag", "connector");
    await clickEval(page, "#js-switch-wired");
    await clickEval(page, "#js-switch-unwired");
  },
  async () => {
    await sleep(200);
  },
  async (page) => {
    await waitTitle(page, "Write the Instructions");
    const ids = ["yellow", "bright", "sign"];
    for (let i = 0; i < 3; i++) {
      await fireDrop(
        page,
        `#js-house-root [data-step="${ids[i]}"]`,
        `#js-house-root [data-slot="${i}"]`,
        "text/step",
        ids[i]
      );
    }
    await clickEval(page, "#js-name-recipe");
    await sleep(400);
    for (const id of ["kitchen", "hallway", "bedroom"]) {
      await clickEval(page, `#js-house-root [data-drop-recipe="${id}"]`);
    }
  },
  async () => {
    await sleep(200);
  },
  async (page) => {
    await waitTitle(page, "Ring the Bell");
    await waitScene(page, "#js-doorbell");
    for (let i = 0; i < 4; i++) await clickEval(page, "#js-doorbell");
  },
  async () => {
    await sleep(200);
  },
  async (page) => {
    await waitTitle(page, "Build a Real Toggle");
    for (const p of ["variable", "function", "listener"]) {
      await fireDrop(
        page,
        `#js-house-root [data-piece="${p}"]`,
        `#js-house-root [data-slot="${p}"]`,
        "text/piece",
        p
      );
    }
    for (let i = 0; i < 4; i++) await clickEval(page, "#js-toggle-switch");
  },
  async () => {
    await sleep(200);
  },
  async () => {
    await sleep(7500);
  },
];

const backendSteps = [
  async (page) => {
    await clickEval(page, "#rs-sim-click");
    await sleep(2000);
  },
  async (page) => {
    await clickEval(page, "#rs-call-btn");
    await fireDrop(page, "#restaurant-root [data-drag='kitchen']", "#rs-kitchen-slot", "text/rest-drag", "kitchen");
    await fireDrop(page, "#restaurant-root [data-drag='hallway']", "#rs-hallway-slot", "text/rest-drag", "hallway");
    await clickEval(page, "#rs-call-btn");
  },
  async () => {
    await sleep(200);
  },
  async (page) => {
    await waitTitle(page, "Place an Order");
    await waitScene(page, "#restaurant-root [data-order='home']");
    await clickEval(page, "#restaurant-root [data-order='home']");
    await sleep(1100);
    await clickEval(page, "#restaurant-root [data-order='secret']");
    await sleep(1100);
  },
  async () => {
    await sleep(200);
  },
  async (page) => {
    await waitTitle(page, "Run a Busy Shift");
    await waitScene(page, "#rs-start-service");
    await clickEval(page, "#rs-start-service");
    await page.waitForFunction(
      () => (window.__gqGetState?.()?.completed?.[0]?.filter(Boolean).length || 0) >= 0,
      { timeout: 1 }
    ).catch(() => {});
    await sleep(10000);
  },
  async () => {
    await sleep(200);
  },
  async (page) => {
    await waitTitle(page, "Find the Restaurant");
    await waitScene(page, "#rs-domain-input");
    await page.fill("#rs-domain-input", "PixelBistro.com");
    await clickEval(page, "#rs-dns-go");
    await sleep(3000);
  },
  async () => {
    await sleep(200);
  },
  async () => {
    await sleep(7500);
  },
];

const dbSteps = [
  async (page) => {
    await clickEval(page, "#sr-open-door");
    await sleep(1200);
  },
  async (page) => {
    for (let n = 0; n < 20; n++) {
      const rivera = page.locator("#storage-room-root .sr-slip").filter({ hasText: "J. Rivera" });
      if (await rivera.isVisible({ timeout: 400 }).catch(() => false)) {
        await rivera.click();
        break;
      }
      const next = page.locator("#sr-next-slip");
      if (await next.isVisible({ timeout: 300 }).catch(() => false)) {
        await next.click();
      } else {
        await page.locator("#storage-room-root [data-slip]").first().click();
      }
      await sleep(150);
    }
    await waitScene(page, "#sr-to-organized");
    await clickEval(page, "#sr-to-organized");
    await sleep(500);
    await clickEval(page, "#storage-room-root [data-folder='R']");
  },
  async () => {
    await sleep(200);
  },
  async (page) => {
    await waitTitle(page, "Build the Customers Shelf");
    for (const h of ["name", "email", "city"]) {
      await fireDrop(
        page,
        `#storage-room-root [data-header-chip="${h}"]`,
        `#storage-room-root [data-header="${h}"]`,
        "text/header",
        h
      );
    }
    for (let i = 0; i < 3; i++) {
      await page.fill("#sr-in-name", `User ${i}`);
      await page.fill("#sr-in-email", `u${i}@test.com`);
      await page.fill("#sr-in-city", "Austin");
      await clickEval(page, "#sr-add-card");
      await sleep(250);
    }
  },
  async () => {
    await sleep(200);
  },
  async (page) => {
    await waitTitle(page, "Try to Break the Rules");
    await waitScene(page, "#sr-schema-name");
    await page.fill("#sr-schema-name", "");
    await page.fill("#sr-schema-phone", "abc");
    await clickEval(page, "#sr-schema-submit");
    await sleep(400);
    await page.fill("#sr-schema-name", "Jane");
    await page.fill("#sr-schema-email", "j@test.com");
    await page.fill("#sr-schema-phone", "5551234");
    await clickEval(page, "#sr-schema-submit");
    await sleep(300);
  },
  async () => {
    await sleep(200);
  },
  async (page) => {
    await waitTitle(page, "Fill Out a Request Form");
    for (const q of ["select", "from", "where"]) {
      await clickEval(page, `#storage-room-root [data-q="${q}"]`);
    }
    await sleep(400);
  },
  async () => {
    await sleep(200);
  },
  async () => {
    await sleep(7500);
  },
];

async function walkSteps(page, steps, missionSlug) {
  const errors = [];
  for (let i = 0; i < 10; i++) {
    const stepNum = i + 1;
    const tag = `${missionSlug}-step${stepNum}`;
    try {
      console.log(`  step ${stepNum}/10`);
      await waitStepMount(page);
      await captureShot(page, `${tag}-mounted`);
      await steps[i](page);
      await auditPage(page, `${tag}-ready`);
      await captureShot(page, `${tag}-interactive`);
      await waitGate(page);
      await tapContinues(page);
      await spiralFinish(page);
      await sleep(800);
    } catch (e) {
      errors.push({ step: stepNum, error: String(e.message || e) });
      console.error(`  FAIL step ${stepNum}:`, e.message);
      await captureShot(page, `${tag}-FAIL`);
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

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const report = [];

  if (SHOT_DIR) {
    fs.mkdirSync(SHOT_DIR, { recursive: true });
    console.log(`Screenshots -> ${SHOT_DIR}`);
  }

  try {
    console.log("=== HTML House ===");
    await startMission(page, `${BASE}/games/web-dev-studio/`, "gq-web-dev-studio-save-v2", "Play HTML House");
    report.push({ mission: "HTML House", errors: await walkSteps(page, htmlSteps, "html") });
    await finishMission(page);
    await page.click("#btn-missions").catch(() => {});
    await sleep(800);

    console.log("=== CSS Style ===");
    await page.getByRole("button", { name: "Play CSS Style" }).click();
    await page.click("#ff-intro-go");
    report.push({ mission: "CSS Style", errors: await walkSteps(page, cssSteps, "css") });
    await finishMission(page);
    await page.click("#btn-missions").catch(() => {});
    await sleep(800);

    console.log("=== JS Clicks ===");
    await page.getByRole("button", { name: "Play JS Clicks" }).click();
    await page.click("#ff-intro-go");
    report.push({ mission: "JS Clicks", errors: await walkSteps(page, jsSteps, "js") });
    await finishMission(page);

    console.log("=== Server Basics ===");
    await startMission(page, `${BASE}/games/backend-builder/`, "gq-backend-builder-save-v2", "Play Server Basics");
    report.push({ mission: "Server Basics", errors: await walkSteps(page, backendSteps, "backend") });
    await finishMission(page);

    console.log("=== Tables & Rows ===");
    await startMission(page, `${BASE}/games/database-sql/`, "gq-database-sql-save-v2", "Play Tables & Rows");
    report.push({ mission: "Tables & Rows", errors: await walkSteps(page, dbSteps, "db") });
    await finishMission(page);
  } finally {
    await browser.close();
  }

  const totalFail = report.reduce((n, r) => n + r.errors.length, 0);
  console.log("\n=== REPORT ===");
  for (const r of report) {
    console.log(`${r.mission}: ${10 - r.errors.length}/10 ok`, r.errors.length ? r.errors : "");
  }
  console.log(`Total: ${50 - totalFail}/50 steps passed`);
  if (SHOT_DIR) {
    console.log(`Screenshots: ${shotIndex} files in ${SHOT_DIR}`);
  }
  if (visualIssues.length) {
    console.log("\n=== VISUAL AUDIT ===");
    for (const v of visualIssues) {
      console.log(v.type, v.ctx, v.emDashSample || v.brokenImgs);
    }
  } else if (SHOT_DIR) {
    console.log("Visual audit: no em dashes or broken <img> detected.");
  }
  if (SHOT_DIR) {
    fs.writeFileSync(
      path.join(SHOT_DIR, "report.json"),
      JSON.stringify({ report, visualIssues, shotCount: shotIndex }, null, 2)
    );
  }
  if (totalFail > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
