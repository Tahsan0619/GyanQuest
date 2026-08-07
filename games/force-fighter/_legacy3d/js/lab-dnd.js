/**
 * Hands-on lab primitives: demos (dwell time), drag-drop, ordering, equation building.
 * Designed for “learn by doing” (not MC-only flows).
 */

import { scaledDwellMs } from "./timings.js";
import { t } from "./i18n.js";

function makePointerClone(el, x, y) {
  const clone = el.cloneNode(true);
  clone.style.cssText = `position:fixed;left:${x}px;top:${y}px;transform:translate(-50%,-50%);z-index:10000;pointer-events:none;opacity:0.92;margin:0;`;
  document.body.appendChild(clone);
  return clone;
}

/** Pointer/touch fallback for draggable chips (does not replace HTML5 drag). */
function attachChipPointerDrag(chips, onDropAtPoint) {
  chips.forEach((chip) => {
    chip.style.touchAction = "none";
    let clone = null;
    let startX = 0;
    let startY = 0;
    let chipId = null;
    let sourceChip = null;

    const cleanup = () => {
      if (clone) clone.remove();
      clone = null;
      chipId = null;
      sourceChip = null;
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
    };

    const onMove = (e) => {
      if (!chipId) return;
      if (!clone && Math.hypot(e.clientX - startX, e.clientY - startY) > 8) {
        clone = makePointerClone(sourceChip, e.clientX, e.clientY);
      }
      if (clone) {
        clone.style.left = `${e.clientX}px`;
        clone.style.top = `${e.clientY}px`;
      }
    };

    const onUp = (e) => {
      if (!chipId) {
        cleanup();
        return;
      }
      const id = chipId;
      const x = e.clientX;
      const y = e.clientY;
      cleanup();
      onDropAtPoint(id, x, y);
    };

    chip.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.preventDefault();
      chipId = chip.dataset.chip;
      sourceChip = chip;
      startX = e.clientX;
      startY = e.clientY;
      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
      document.addEventListener("pointercancel", onUp);
    });
  });
}

/** Play / queue the 3D lesson scene (re-applied after Kenney assets finish loading). */
export function applyArenaScene(scene, sceneArgs = {}) {
  if (!scene || typeof window === "undefined") return;
  window.__lastDemoScene = { scene, sceneArgs };
  const arena = window.__arena;
  if (arena && typeof arena.playExample === "function") {
    try {
      arena.playExample(scene, sceneArgs);
    } catch (_) {
      /* canvas demo failed, keep the lesson going */
    }
  }
}

export function replayArenaScene() {
  const last = typeof window !== "undefined" ? window.__lastDemoScene : null;
  if (last?.scene) applyArenaScene(last.scene, last.sceneArgs || {});
}

/**
 * @param {HTMLElement} host
 * @param {{ html: string; minDwellMs?: number; rawDwellMs?: number; scene?: string; sceneArgs?: object; onContinue: () => void }} opts
 */
export function mountDemoWithDwell(host, opts) {
  const minMs =
    opts.rawDwellMs != null ? Math.max(0, opts.rawDwellMs) : scaledDwellMs(opts.minDwellMs ?? 2200);
  applyArenaScene(opts.scene, opts.sceneArgs);
  host.innerHTML = `
    <div class="lab-demo">
      <div class="lab-demo__badge">${t("lab.demoBadge")}</div>
      <div class="lab-demo__body">${opts.html}</div>
      <p class="lab-demo__timer" id="lab-dwell-msg">${t("lab.dwellWait")}</p>
      <button type="button" class="btn primary" id="lab-dwell-go" disabled>${t("lab.dwellContinue")}</button>
    </div>`;
  const btn = host.querySelector("#lab-dwell-go");
  const t0 = Date.now();
  const iv = setInterval(() => {
    const left = Math.max(0, Math.ceil((minMs - (Date.now() - t0)) / 1000));
    const msg = host.querySelector("#lab-dwell-msg");
    if (msg) msg.textContent = left > 0 ? t("lab.dwellLook", { n: left }) : t("lab.dwellYourTurn");
    if (Date.now() - t0 >= minMs) {
      btn.disabled = false;
      clearInterval(iv);
    }
  }, 250);
  btn.onclick = () => {
    if (btn.disabled) return;
    clearInterval(iv);
    opts.onContinue();
  };
  return () => clearInterval(iv);
}

/**
 * Series of 3D motion beats before the kid continues (more engaging than one clip).
 * @param {HTMLElement} host
 * @param {{
 *   title?: string;
 *   beats: { scene: string; sceneArgs?: object; html: string; dwellMs?: number; rawDwellMs?: number }[];
 *   onDone: () => void;
 * }} cfg
 */
export function mountMotionChain(host, cfg) {
  let i = 0;
  let cancelIv = null;

  function render() {
    if (i >= cfg.beats.length) {
      cfg.onDone();
      return;
    }
    const b = cfg.beats[i];
    const total = cfg.beats.length;
    applyArenaScene(b.scene, b.sceneArgs || {});
    const minMs =
      b.rawDwellMs != null ? Math.max(0, b.rawDwellMs) : scaledDwellMs(b.dwellMs ?? 3200);
    host.innerHTML = `
      <div class="lab-demo lab-demo--chain">
        <div class="lab-demo__badge">Motion ${i + 1} of ${total}</div>
        <h3 class="lab-chain-title">${cfg.title || "Watch the story unfold"}</h3>
        <div class="lab-demo__body">${b.html}</div>
        <p class="lab-demo__timer" id="chain-msg">Watch the 3D canvas…</p>
        <div class="btn-row">
          <button type="button" class="btn secondary" id="chain-skip" ${i === 0 ? "disabled" : ""}>◀ Prev</button>
          <button type="button" class="btn primary" id="chain-go" disabled>Next motion ▶</button>
        </div>
      </div>`;
    const t0 = Date.now();
    const msg = host.querySelector("#chain-msg");
    const btn = host.querySelector("#chain-go");
    const prev = host.querySelector("#chain-skip");
    if (prev) {
      prev.onclick = () => {
        if (i > 0) {
          i--;
          if (cancelIv) clearInterval(cancelIv);
          render();
        }
      };
    }
    cancelIv = setInterval(() => {
      const left = Math.max(0, Math.ceil((minMs - (Date.now() - t0)) / 1000));
      if (msg) msg.textContent = left > 0 ? `Watch motion ${i + 1} (${left}s)…` : "Ready for next motion!";
      if (Date.now() - t0 >= minMs && btn) btn.disabled = false;
    }, 250);
    btn.onclick = () => {
      if (btn.disabled) return;
      if (cancelIv) clearInterval(cancelIv);
      i++;
      render();
    };
  }
  render();
  return () => {
    if (cancelIv) clearInterval(cancelIv);
  };
}

/**
 * Native HTML5 DnD: drag chips from bank into drop zones (one chip per zone).
 * @param {HTMLElement} host
 * @param {{
 *   title: string;
 *   instructions: string;
 *   zones: { id: string; label: string; accept: string[] }[];
 *   chips: { id: string; text: string }[];
 *   onDone: () => void;
 *   showReplayDemo?: () => void;
 * }} cfg
 */
export function mountDragZones(host, cfg) {
  const bankIds = cfg.chips.map((c) => c.id).sort().join(",");
  const zoneHtml = cfg.zones
    .map(
      (z) => `
    <div class="dz-wrap">
      <span class="dz-label">${z.label}</span>
      <div class="drop-zone" data-zone="${z.id}" data-accept="${z.accept.join(",")}"></div>
    </div>`
    )
    .join("");
  const chipsHtml = cfg.chips.map((c) => `<div class="chip" draggable="true" data-chip="${c.id}">${c.text}</div>`).join("");

  host.innerHTML = `
    <div class="lab-drag">
      <h3>${cfg.title}</h3>
      <p class="lab-drag__hint">${cfg.instructions}</p>
      ${cfg.showReplayDemo ? `<button type="button" class="btn secondary lab-replay" id="lab-replay">Replay example</button>` : ""}
      <div class="dz-row">${zoneHtml}</div>
      <div class="chip-bank" id="chip-bank">${chipsHtml}</div>
      <p id="drag-progress" class="drag-progress"></p>
      <p id="lab-drag-status" class="drag-hint"></p>
    </div>`;

  const bank = host.querySelector("#chip-bank");
  const status = host.querySelector("#lab-drag-status");
  const dragProg = host.querySelector("#drag-progress");

  function updateDragProgress() {
    if (!dragProg) return;
    const placed = cfg.zones.filter((z) => {
      const el = host.querySelector(`[data-zone="${z.id}"]`);
      const chip = el?.querySelector(".chip")?.getAttribute("data-chip");
      return chip && z.accept.includes(chip);
    }).length;
    dragProg.textContent = `Placed ${placed} of ${cfg.zones.length}`;
  }
  updateDragProgress();

  host.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", chip.dataset.chip);
      e.dataTransfer.effectAllowed = "move";
    });
  });

  let done = false;

  function tryDropChip(zone, id) {
    if (done) return;
    const accept = zone.getAttribute("data-accept").split(",");
    if (!accept.includes(id)) {
      status.textContent = t("lab.dragWrong");
      return;
    }
    const prev = zone.querySelector(".chip");
    if (prev) bank.appendChild(prev);
    const chip = host.querySelector(`.chip[data-chip="${id}"]`);
    if (chip) zone.appendChild(chip);
    status.textContent = "";
    updateDragProgress();
    if (
      cfg.zones.every((z) => {
        const el = host.querySelector(`[data-zone="${z.id}"]`);
        const placed = el?.querySelector(".chip")?.getAttribute("data-chip");
        return placed && z.accept.includes(placed);
      })
    ) {
      done = true;
      status.textContent = t("lab.dragRight");
      cfg.onDone();
    }
  }

  host.querySelectorAll(".drop-zone").forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
      zone.classList.add("dz-hover");
    });
    zone.addEventListener("dragleave", () => zone.classList.remove("dz-hover"));
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      zone.classList.remove("dz-hover");
      tryDropChip(zone, e.dataTransfer.getData("text/plain"));
    });
  });

  attachChipPointerDrag(host.querySelectorAll(".chip"), (id, x, y) => {
    host.querySelectorAll(".drop-zone").forEach((z) => z.classList.remove("dz-hover"));
    const under = document.elementFromPoint(x, y);
    const zone = under?.closest?.(".drop-zone");
    if (zone && host.contains(zone)) tryDropChip(zone, id);
  });

  if (cfg.showReplayDemo) {
    host.querySelector("#lab-replay").onclick = () => cfg.showReplayDemo();
  }

  /** Reset chips to bank */
  return function resetDragLab() {
    host.querySelectorAll(".drop-zone .chip").forEach((c) => bank.appendChild(c));
    if (status) status.textContent = "";
  };
}

/**
 * Learner reveals example bullets one tap at a time (interactive “unfold”, not a wall of text).
 * @param {HTMLElement} host
 * @param {{ title: string; steps: string[]; scene?: string; sceneArgs?: object; onDone: () => void }} cfg
 */
export function mountRevealSteps(host, cfg) {
  let i = 0;

  function applyStepScene(idx) {
    const stepScene = cfg.stepScenes?.[idx];
    if (stepScene?.scene) {
      applyArenaScene(stepScene.scene, stepScene.sceneArgs || {});
    } else if (cfg.scene) {
      applyArenaScene(cfg.scene, cfg.sceneArgs || {});
    }
  }

  function render() {
    applyStepScene(i);
    const body = cfg.steps
      .slice(0, i + 1)
      .map((s, j) => `<p class="reveal-step ${j === i ? "reveal-step--new" : ""}">${s}</p>`)
      .join("");
    const last = i >= cfg.steps.length - 1;
    host.innerHTML = `
      <div class="lab-reveal">
        <h3>${cfg.title}</h3>
        <div class="reveal-body">${body}</div>
        <button type="button" class="btn primary" id="reveal-go">${last ? "Continue" : "Reveal next example"}</button>
      </div>`;
    host.querySelector("#reveal-go").onclick = () => {
      if (last) cfg.onDone();
      else {
        i++;
        render();
      }
    };
  }
  render();
}

/**
 * Drag tokens onto a single equation rail (left to right order).
 */
export function mountEquationRail(host, { tokens, onDone }) {
  const shuffled = [...tokens].sort(() => Math.random() - 0.5);
  host.innerHTML = `
    <div class="lab-eq">
      <h3>Build the law</h3>
      <p>Drag the tiles onto the rail <strong>in the correct order</strong> (snap left-to-right).</p>
      <div class="eq-rail" id="eq-rail"></div>
      <div class="chip-bank" id="eq-bank">${shuffled.map((t) => `<div class="chip" draggable="true" data-chip="${t.id}">${t.html}</div>`).join("")}</div>
      <p id="eq-st" class="drag-hint"></p>
    </div>`;
  const rail = host.querySelector("#eq-rail");
  const bank = host.querySelector("#eq-bank");
  const target = tokens.map((t) => t.id).join(",");

  host.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", chip.dataset.chip);
    });
  });

  rail.addEventListener("dragover", (e) => e.preventDefault());
  let eqDone = false;
  const st = host.querySelector("#eq-st");

  function tryDropOnRail(id) {
    if (eqDone) return;
    const chip = host.querySelector(`.chip[data-chip="${id}"]`);
    if (!chip) return;
    rail.appendChild(chip);
    const order = [...rail.querySelectorAll(".chip")].map((c) => c.dataset.chip).join(",");
    if (order === target) {
      eqDone = true;
      st.textContent = "Equation locked in!";
      onDone();
    } else if (rail.children.length >= tokens.length) {
      st.textContent = "Order isn’t right yet. Drag tiles back to the bank to reorder.";
    }
  }

  function tryDropOnBank(id) {
    const chip = host.querySelector(`.chip[data-chip="${id}"]`);
    if (chip) bank.appendChild(chip);
  }

  rail.addEventListener("drop", (e) => {
    e.preventDefault();
    tryDropOnRail(e.dataTransfer.getData("text/plain"));
  });

  bank.addEventListener("dragover", (e) => e.preventDefault());
  bank.addEventListener("drop", (e) => {
    e.preventDefault();
    tryDropOnBank(e.dataTransfer.getData("text/plain"));
  });

  attachChipPointerDrag(host.querySelectorAll(".chip"), (id, x, y) => {
    const under = document.elementFromPoint(x, y);
    if (under?.closest?.("#eq-rail")) tryDropOnRail(id);
    else if (under?.closest?.("#eq-bank")) tryDropOnBank(id);
  });
}

/**
 * Reorder list by drag; user must match target order (by id).
 */
export function mountOrderRail(host, { items, correctIds, onDone }) {
  const row = items
    .map((it) => `<div class="order-tile" draggable="true" data-id="${it.id}">${it.html}</div>`)
    .join("");
  host.innerHTML = `
    <div class="lab-order">
      <h3>Put the steps in order</h3>
      <p>Drag tiles to reorder the story of what happens in time.</p>
      <div class="order-list" id="ord-list">${row}</div>
      <button type="button" class="btn primary" id="ord-check">Check order</button>
      <p id="ord-msg" class="drag-hint"></p>
    </div>`;
  const list = host.querySelector("#ord-list");
  let dragEl = null;

  function reorderBeforeTile(tile, y) {
    if (!dragEl || dragEl === tile) return;
    const rect = tile.getBoundingClientRect();
    const before = y < rect.top + rect.height / 2;
    list.insertBefore(dragEl, before ? tile : tile.nextSibling);
  }

  list.querySelectorAll(".order-tile").forEach((tile) => {
    tile.style.touchAction = "none";
    tile.addEventListener("dragstart", () => {
      dragEl = tile;
    });
    tile.addEventListener("dragover", (e) => {
      e.preventDefault();
      reorderBeforeTile(tile, e.clientY);
    });
    tile.addEventListener("drop", (e) => e.preventDefault());

    let ptrClone = null;
    let ptrTile = null;

    const ptrCleanup = () => {
      if (ptrClone) ptrClone.remove();
      ptrClone = null;
      ptrTile = null;
      dragEl = null;
      document.removeEventListener("pointermove", onPtrMove);
      document.removeEventListener("pointerup", onPtrUp);
      document.removeEventListener("pointercancel", onPtrUp);
    };

    const onPtrMove = (e) => {
      if (!ptrTile) return;
      if (!ptrClone) ptrClone = makePointerClone(ptrTile, e.clientX, e.clientY);
      ptrClone.style.left = `${e.clientX}px`;
      ptrClone.style.top = `${e.clientY}px`;
      const under = document.elementFromPoint(e.clientX, e.clientY);
      const target = under?.closest?.(".order-tile");
      if (target && list.contains(target)) reorderBeforeTile(target, e.clientY);
    };

    const onPtrUp = () => ptrCleanup();

    tile.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.preventDefault();
      dragEl = tile;
      ptrTile = tile;
      document.addEventListener("pointermove", onPtrMove);
      document.addEventListener("pointerup", onPtrUp);
      document.addEventListener("pointercancel", onPtrUp);
    });
  });
  host.querySelector("#ord-check").onclick = () => {
    const got = [...list.querySelectorAll(".order-tile")].map((t) => t.dataset.id);
    const ok = got.join(",") === correctIds.join(",");
    const msg = host.querySelector("#ord-msg");
    if (ok) {
      msg.textContent = "Perfect sequence.";
      onDone();
    } else msg.textContent = "Not yet. Think cause → effect along the timeline.";
  };
}

/**
 * Multi-step lab: each step receives (api, next, finish).
 * - Call `next()` between segments.
 * - Call `finish()` on the last segment (completes the sub-level via api.completeCurrentSub).
 * @param {object} api
 * @param {Array<(api: object, next: () => void, finish: () => void) => void>} steps
 */
export function runChain(api, steps) {
  let i = 0;
  function finish() {
    i = 1e9;
    api.clearOverlay();
    api.completeCurrentSub();
  }
  function next() {
    if (i >= steps.length) return;
    api.clearOverlay();
    const fn = steps[i++];
    fn(api, next, finish);
  }
  const restart = () => {
    i = 0;
    api.clearOverlay();
    next();
  };
  if (typeof api.registerTryAgain === "function") api.registerTryAgain(restart);
  else api.btnRestart.onclick = restart;
  next();
}
