/**
 * Bio Explorer activity mounts - panel + canvas share forceLabState / intents.
 */
import { scaledDwellMs } from "/engine/js/timings.js";
import { clearConceptViz } from "/engine/js/concept-viz.js";
import {
  ATOM_ASSET_PATHS,
  chemLabState,
  setHeatTarget,
  pulseFailFeedback,
  pulseSuccessFeedback,
} from "./lab-state.js";
import { createActivitySession, stopActivitySession, heatPhase } from "./activity-controller.js";

let activeCleanup = null;

export function cancelActiveActivity() {
  if (typeof activeCleanup === "function") {
    try {
      activeCleanup();
    } catch {
      /* ignore */
    }
  }
  activeCleanup = null;
  stopActivitySession();
  const arena = window.__arena;
  // Clear panel intent only - scenes own hit regions + sceneIntent.
  arena?.setIntentHandler?.(null);
}

function trackCleanup(fn) {
  cancelActiveActivity();
  activeCleanup = fn || null;
  return fn;
}

function once(fn) {
  let done = false;
  return (...args) => {
    if (done) return;
    done = true;
    fn(...args);
  };
}

export function playScene(name, opts = {}) {
  const arena = window.__arena;
  Object.assign(chemLabState, opts);
  if (opts.phase) {
    chemLabState.phase = opts.phase;
  }
  if (opts.heat != null) {
    chemLabState.heatTarget = opts.heat;
    chemLabState.heat = opts.heat;
  }
  if (opts.energy != null) {
    chemLabState.energyTarget = opts.energy;
    chemLabState.energy = opts.energy;
  }
  if (opts.dwellMs != null) chemLabState.animDuration = opts.dwellMs;
  if (opts.placed) chemLabState.placed = { ...opts.placed };
  if (arena?.playExample) arena.playExample(name, opts);
  const hud = document.getElementById("viewport-hud");
  if (hud) clearConceptViz(hud);
}

export function badgeHtml(src, alt) {
  return `<img class="chem-asset" src="${src}" alt="${alt || ""}" width="56" height="56" />`;
}

export function mountMotionChain(host, cfg) {
  let i = 0;
  let cancelIv = null;
  let cancelled = false;
  const session = createActivitySession({ phase: cfg.beats[0]?.sceneArgs?.phase || "zoom" });

  function render() {
    if (cancelled) return;
    if (i >= cfg.beats.length) {
      cfg.onDone();
      return;
    }
    const b = cfg.beats[i];
    const total = cfg.beats.length;
    const minMs =
      b.rawDwellMs != null ? Math.max(0, b.rawDwellMs) : scaledDwellMs(b.dwellMs ?? 3200);
    chemLabState.animDuration = minMs;
    if (b.sceneArgs?.phase) {
      chemLabState.phase = b.sceneArgs.phase;
      session.dispatch({ type: "SET_PHASE", phase: b.sceneArgs.phase });
    }
    playScene(b.scene, { ...(b.sceneArgs || {}), dwellMs: minMs });
    host.innerHTML = `
      <div class="lab-demo lab-demo--chain chem-card">
        <div class="lab-demo__badge">Act ${i + 1} of ${total}</div>
        <h3 class="lab-chain-title">${cfg.title || "Watch the story unfold"}</h3>
        <div class="lab-demo__body">${b.html}</div>
        <p class="lab-demo__timer" id="chain-msg" aria-live="polite">Watch / interact with the canvas\u2026</p>
        <div class="btn-row">
          <button type="button" class="btn secondary" id="chain-skip" ${i === 0 ? "disabled" : ""}>Prev</button>
          <button type="button" class="btn primary" id="chain-go" disabled>Next</button>
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
    if (cancelIv) clearInterval(cancelIv);
    cancelIv = setInterval(() => {
      if (cancelled) {
        clearInterval(cancelIv);
        return;
      }
      const left = Math.max(0, Math.ceil((minMs - (Date.now() - t0)) / 1000));
      if (msg) msg.textContent = left > 0 ? `Explore act ${i + 1} (${left}s)\u2026` : "Ready for next act!";
      if (Date.now() - t0 >= minMs && btn) btn.disabled = false;
    }, 250);
    btn.onclick = () => {
      if (btn.disabled) return;
      if (cancelIv) clearInterval(cancelIv);
      i++;
      render();
    };

    const arena = window.__arena;
    arena?.setIntentHandler?.((intent) => {
      if (intent.type === "CANVAS_TAP" && intent.meta?.action === "pour") {
        chemLabState.scale = Math.min(1, (chemLabState.scale || 0) + 0.12);
      }
      // Only auto-advance when tapping empty canvas, not props / tools / chips.
      if (intent.type === "CANVAS_TAP" && !btn.disabled) {
        const a = intent.meta?.action;
        const interactive =
          intent.meta?.propId ||
          intent.meta?.chipId ||
          intent.meta?.zoneId ||
          intent.meta?.pick ||
          intent.meta?.mode ||
          a === "pour" ||
          a === "heat" ||
          a === "pack" ||
          a === "link" ||
          a === "gap" ||
          a === "nudge" ||
          a === "merge" ||
          a === "split" ||
          a === "stretch" ||
          a === "snap" ||
          a === "focus" ||
          a === "scale";
        if (!interactive) btn.click();
      }
    });
  }

  render();
  return trackCleanup(() => {
    cancelled = true;
    if (cancelIv) clearInterval(cancelIv);
    session.stop();
  });
}

export function mountDragSort(host, cfg) {
  const finish = once(() => cfg.onDone());
  const chips = cfg.chips;
  const session = createActivitySession({ placed: {}, selectedId: null, placedVersion: 0 });
  chemLabState.placed = {};
  chemLabState.sortPlaced = 0;
  chemLabState.reveal = false;
  chemLabState.selectedId = null;
  chemLabState._placedVersion = 0;
  playScene(cfg.scene, {
    ...(cfg.sceneArgs || {}),
    items: chips.map((c) => ({
      id: c.id,
      label: c.short || c.text.split(" ")[0],
      matter: cfg.zones.find((z) => z.id === "yes")?.accept.includes(c.id),
      color: c.color || 0x38bdf8,
    })),
    itemCount: chips.length,
  });

  const zoneHtml = cfg.zones
    .map(
      (z) => `
    <div class="dz-wrap">
      <span class="dz-label" id="lbl-${z.id}">${z.label}</span>
      <div class="drop-zone drop-zone--multi" data-zone="${z.id}" data-accept="${z.accept.join(",")}"
        tabindex="0" role="listbox" aria-labelledby="lbl-${z.id}"></div>
      <button type="button" class="btn secondary chem-zone-btn" data-zone-btn="${z.id}">Place here</button>
    </div>`,
    )
    .join("");
  const chipsHtml = chips
    .map(
      (c) =>
        `<button type="button" class="chip" draggable="true" data-chip="${c.id}" aria-pressed="false">${c.text}</button>`,
    )
    .join("");
  host.innerHTML = `
    <div class="lab-drag chem-card">
      <h3>${cfg.title}</h3>
      <p class="lab-drag__hint">${cfg.instructions} Drag on the <strong>canvas</strong> or use chips here €\u201D both stay in sync.</p>
      <div class="dz-row">${zoneHtml}</div>
      <div class="chip-bank" id="chip-bank" role="listbox" aria-label="Chips">${chipsHtml}</div>
      <p id="lab-drag-status" class="drag-hint" aria-live="polite">0 of ${chips.length} placed</p>
      <button type="button" class="btn secondary" id="sort-reset">Reset sort</button>
    </div>`;

  const bank = host.querySelector("#chip-bank");
  const status = host.querySelector("#lab-drag-status");
  let selectedId = null;
  let lastSyncKey = "";
  let finished = false;
  let raf = 0;

  function selectChip(id) {
    selectedId = id;
    chemLabState.selectedId = id;
    session.dispatch({ type: "SELECT_CHIP", id });
    host.querySelectorAll(".chip").forEach((c) => {
      const on = c.dataset.chip === id;
      c.classList.toggle("chip--selected", on);
      c.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function syncPlacedUI() {
    const placed = chemLabState.placed || {};
    chips.forEach((c) => {
      const chip = host.querySelector(`.chip[data-chip="${c.id}"]`);
      if (!chip) return;
      const zoneId = placed[c.id];
      if (zoneId && typeof zoneId === "string") {
        const zone = host.querySelector(`[data-zone="${zoneId}"]`);
        if (zone && chip.parentElement !== zone) zone.appendChild(chip);
      } else if (chip.parentElement !== bank) {
        bank.appendChild(chip);
      }
    });
    const n = Object.keys(placed).filter((k) => typeof placed[k] === "string").length;
    chemLabState.sortPlaced = n;
    if (status && !finished) status.textContent = `${n} of ${chips.length} placed`;
  }

  function checkComplete() {
    const placed = chemLabState.placed || {};
    if (Object.keys(placed).length < chips.length) return false;
    return chips.every((c) => {
      const zoneId = placed[c.id];
      const zdef = cfg.zones.find((z) => z.id === zoneId);
      return zdef?.accept.includes(c.id);
    });
  }

  function tryPlace(zoneId, id) {
    if (!id || !zoneId) return;
    const zdef = cfg.zones.find((z) => z.id === zoneId);
    if (!zdef?.accept.includes(id)) {
      status.textContent = "Hmm - that belongs in another bin.";
      pulseFailFeedback(480);
      return;
    }
    // Avoid double-success flash if canvas already placed this chip
    const already = chemLabState.placed?.[id] === zoneId;
    chemLabState.placed = { ...chemLabState.placed, [id]: zoneId };
    chemLabState.sortPlaced = Object.keys(chemLabState.placed).length;
    session.dispatch({ type: "PLACE_CHIP", chipId: id, zoneId, accept: zdef.accept });
    syncPlacedUI();
    if (!already) pulseSuccessFeedback(220);
    status.textContent = `${chemLabState.sortPlaced} of ${chips.length} placed`;
    if (!finished && checkComplete()) {
      finished = true;
      status.textContent = cfg.successText || "Nice sort - all chips placed!";
      chemLabState.reveal = true;
      session.dispatch({ type: "SET_REVEAL", value: true });
      pulseSuccessFeedback(400);
      finish();
    }
  }

  function tickSync() {
    const placed = chemLabState.placed || {};
    const key = `${chemLabState._placedVersion || 0}|${JSON.stringify(placed)}|${chemLabState.selectedId || ""}`;
    if (key !== lastSyncKey) {
      lastSyncKey = key;
      syncPlacedUI();
      host.querySelectorAll(".chip").forEach((c) => {
        const on = c.dataset.chip === chemLabState.selectedId;
        c.classList.toggle("chip--selected", on);
        c.setAttribute("aria-pressed", on ? "true" : "false");
      });
      selectedId = chemLabState.selectedId;
      if (!finished && checkComplete()) {
        finished = true;
        status.textContent = cfg.successText || "Nice sort - all chips placed!";
        chemLabState.reveal = true;
        session.dispatch({ type: "SET_REVEAL", value: true });
        pulseSuccessFeedback(400);
        finish();
      }
    }
    raf = requestAnimationFrame(tickSync);
  }
  raf = requestAnimationFrame(tickSync);

  host.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", chip.dataset.chip);
      selectChip(chip.dataset.chip);
    });
    chip.addEventListener("click", () => selectChip(chip.dataset.chip));
  });

  host.querySelectorAll(".drop-zone").forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
      zone.classList.add("dz-hover");
    });
    zone.addEventListener("dragleave", () => zone.classList.remove("dz-hover"));
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      zone.classList.remove("dz-hover");
      tryPlace(zone.dataset.zone, e.dataTransfer.getData("text/plain"));
    });
    zone.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.key === " ") && selectedId) {
        e.preventDefault();
        tryPlace(zone.dataset.zone, selectedId);
      }
    });
  });

  host.querySelectorAll("[data-zone-btn]").forEach((btn) => {
    btn.onclick = () => {
      if (selectedId) tryPlace(btn.dataset.zoneBtn, selectedId);
      else status.textContent = "Select a chip first, then place it.";
    };
  });

  host.querySelector("#sort-reset").onclick = () => {
    chemLabState.placed = {};
    chemLabState.sortPlaced = 0;
    chemLabState.reveal = false;
    finished = false;
    session.dispatch({ type: "RESET_SORT" });
    syncPlacedUI();
    status.textContent = "Sort reset.";
    lastSyncKey = "";
  };

  const arena = window.__arena;
  arena?.setIntentHandler?.((intent) => {
    if (intent.type === "CANVAS_TAP" && intent.meta?.chipId) {
      selectChip(intent.meta.chipId);
      status.textContent = `Selected ${intent.meta.chipId} - drop on a bin or Place here.`;
    }
    if (intent.type === "CANVAS_UP" && intent.meta?.chipId) {
      const zoneId = intent.dropMeta?.zoneId;
      if (zoneId) tryPlace(zoneId, intent.meta.chipId);
      else syncPlacedUI();
    }
    if (intent.type === "CANVAS_TAP" && intent.meta?.zoneId && selectedId) {
      tryPlace(intent.meta.zoneId, selectedId);
    }
  });

  return trackCleanup(() => {
    cancelAnimationFrame(raf);
    session.stop();
    arena?.setIntentHandler?.(null);
  });
}

export function mountHeatLab(host, cfg) {
  const finish = once(() => cfg.onDone());
  const startH = cfg.startHeat ?? 0.12;
  const threshold = cfg.threshold ?? 0.78;
  const axis = cfg.axis || "y";
  const canvasAction = cfg.canvasAction || "heat";
  const sliderLabel = cfg.sliderLabel || "Heat energy";
  const session = createActivitySession({ heat: startH, energy: startH });
  chemLabState.heat = startH;
  chemLabState.energy = startH;
  setHeatTarget(startH);
  playScene(cfg.scene, { heat: startH, energy: startH, ...(cfg.sceneArgs || {}) });

  host.innerHTML = `
    <div class="chem-card chem-heat">
      ${badgeHtml(cfg.badge || ATOM_ASSET_PATHS.life, "force lab")}
      <h3>${cfg.title}</h3>
      <p>${cfg.html}</p>
      <label class="chem-heat__label" for="chem-heat">${sliderLabel}</label>
      <div class="chem-heat__controls">
        <button type="button" class="btn secondary chem-heat__nudge" id="chem-heat-down" aria-label="Decrease">ˆ\u2019</button>
        <input id="chem-heat" class="chem-heat__range" type="range" min="0" max="100" step="1"
          value="${Math.round(startH * 100)}" aria-valuemin="0" aria-valuemax="100"
          aria-valuenow="${Math.round(startH * 100)}" />
        <button type="button" class="btn secondary chem-heat__nudge" id="chem-heat-up" aria-label="Increase">+</button>
      </div>
      <p class="chem-heat__readout" id="chem-heat-read" aria-live="polite">Cold</p>
      <p class="chem-heat__goal">${cfg.goalText}</p>
      <button type="button" class="btn primary" id="chem-heat-go" disabled>${cfg.doneLabel || "Continue"}</button>
    </div>`;

  const range = host.querySelector("#chem-heat");
  const read = host.querySelector("#chem-heat-read");
  const btn = host.querySelector("#chem-heat-go");
  let cancelled = false;

  function applyHeat(raw) {
    const pct = Math.max(0, Math.min(100, Math.round(Number(raw) || 0)));
    const h = pct / 100;
    range.value = String(pct);
    range.setAttribute("aria-valuenow", String(pct));
    chemLabState.heat = h;
    chemLabState.energy = h;
    setHeatTarget(h);
    if (cfg.syncKey === "pushForce") chemLabState.pushForce = h;
    if (cfg.syncKey === "rockVx") chemLabState.rockVx = h;
    if (cfg.syncKey === "pairGap") {
      chemLabState.pairGap = 1 - h;
      chemLabState.recoil = h;
    }
    session.dispatch({ type: "SET_HEAT", value: h });
    const phase = heatPhase(h);
    const labels = cfg.readoutLabels || {
      cold: "Cold - molecules locked / slow",
      melting: "Melting - lattice softening",
      liquid: "Liquid - free to slide",
      simmer: "Hot - vapor escaping",
    };
    read.textContent = labels[phase] || "Working\u2026";
    if (h >= threshold) {
      btn.disabled = false;
      read.textContent += " œ\u201C Goal reached";
    } else btn.disabled = true;
  }

  range.addEventListener("input", () => applyHeat(range.value));
  range.addEventListener("change", () => applyHeat(range.value));
  host.querySelector("#chem-heat-down").onclick = () => applyHeat(Number(range.value) - 10);
  host.querySelector("#chem-heat-up").onclick = () => applyHeat(Number(range.value) + 10);
  applyHeat(startH * 100);

  const arena = window.__arena;
  arena?.setIntentHandler?.((intent) => {
    if (intent.type === "CANVAS_DRAG" && intent.meta?.action === canvasAction) {
      if (axis === "x") {
        const aw = arena.width || 640;
        const next = Math.max(0, Math.min(1, (intent.x - aw * 0.2) / (aw * 0.6)));
        applyHeat(next * 100);
      } else {
        const base = intent.meta.dragBaseHeat ?? chemLabState.heat;
        const next = Math.max(0, Math.min(1, base + (-(intent.dy || 0)) * 0.004));
        applyHeat(next * 100);
      }
    }
    if (intent.type === "CANVAS_DOWN" && intent.meta?.action === canvasAction) {
      intent.meta.dragBaseHeat = chemLabState.heat;
    }
  });

  const iv = setInterval(() => {
    if (cancelled) return;
    if (chemLabState.heat >= threshold) {
      btn.disabled = false;
      applyHeat(chemLabState.heat * 100);
    }
  }, 200);

  btn.onclick = () => {
    cancelled = true;
    clearInterval(iv);
    finish();
  };

  return trackCleanup(() => {
    cancelled = true;
    clearInterval(iv);
    session.stop();
    arena?.setIntentHandler?.(null);
  });
}

export function mountRevealSteps(host, cfg) {
  playScene(cfg.scene, cfg.sceneArgs || {});
  let i = 0;
  let finished = false;
  host.innerHTML = `
    <div class="chem-card">
      <h3>${cfg.title}</h3>
      <ol class="chem-reveal" id="chem-reveal"></ol>
      <button type="button" class="btn primary" id="chem-reveal-btn">Reveal next</button>
    </div>`;
  const list = host.querySelector("#chem-reveal");
  const btn = host.querySelector("#chem-reveal-btn");
  const finish = once(() => cfg.onDone());

  btn.onclick = () => {
    if (finished) {
      finish();
      return;
    }
    if (i >= cfg.steps.length) {
      finished = true;
      btn.textContent = "Continue";
      return;
    }
    const li = document.createElement("li");
    li.className = "chem-reveal__item";
    li.innerHTML = cfg.steps[i];
    list.appendChild(li);
    if (cfg.onStep) cfg.onStep(i);
    i++;
    if (i >= cfg.steps.length) {
      finished = true;
      btn.textContent = "I get it - continue";
    }
  };
  btn.click();
  return trackCleanup(() => {});
}

export function mountEquationBuild(host, cfg) {
  const finish = once(() => cfg.onDone());
  const session = createActivitySession({ tokenOrder: [] });
  playScene(cfg.scene, cfg.sceneArgs || {});
  chemLabState.tokenProgress = 0;
  const order = [];
  host.innerHTML = `
    <div class="chem-card">
      ${cfg.badge ? badgeHtml(cfg.badge, "rule badge") : ""}
      <h3>${cfg.title}</h3>
      <p>${cfg.instructions}</p>
      <div class="chem-eq-bank" id="eq-bank">
        ${cfg.tokens.map((t) => `<button type="button" class="chip eq-chip" data-id="${t.id}">${t.html}</button>`).join("")}
      </div>
      <div class="chem-eq-rail" id="eq-rail" aria-label="Your sentence"></div>
      <p id="eq-status" class="drag-hint" aria-live="polite"></p>
      <div class="btn-row">
        <button type="button" class="btn secondary" id="eq-undo">Undo</button>
        <button type="button" class="btn secondary" id="eq-reset">Reset</button>
        <button type="button" class="btn primary hidden" id="eq-done">Continue</button>
      </div>
    </div>`;
  const bank = host.querySelector("#eq-bank");
  const rail = host.querySelector("#eq-rail");
  const status = host.querySelector("#eq-status");
  const doneBtn = host.querySelector("#eq-done");
  const correct = cfg.correctIds;

  function refresh() {
    chemLabState.tokenProgress = order.length;
    session.dispatch({ type: "PATCH", patch: { tokenOrder: [...order] } });
    rail.innerHTML = order
      .map((id) => {
        const t = cfg.tokens.find((x) => x.id === id);
        return `<span class="eq-placed">${t?.html || id}</span>`;
      })
      .join(" ");
    bank.querySelectorAll(".eq-chip").forEach((b) => {
      b.disabled = order.includes(b.dataset.id);
    });
    if (order.length === correct.length) {
      const ok = order.every((id, idx) => id === correct[idx]);
      if (ok) {
        status.textContent = "Rule locked in. Continue to the scale scrubber.";
        status.classList.add("ok");
        pulseSuccessFeedback(400);
        doneBtn?.classList.remove("hidden");
      } else {
        status.textContent = "Almost - undo and rebuild the rule in order.";
        doneBtn?.classList.add("hidden");
        pulseFailFeedback(400);
      }
    } else {
      doneBtn?.classList.add("hidden");
    }
  }

  bank.querySelectorAll(".eq-chip").forEach((b) => {
    b.onclick = () => {
      if (order.includes(b.dataset.id)) return;
      order.push(b.dataset.id);
      refresh();
    };
  });
  host.querySelector("#eq-undo").onclick = () => {
    order.pop();
    status.textContent = "";
    refresh();
  };
  host.querySelector("#eq-reset").onclick = () => {
    order.length = 0;
    status.textContent = "";
    refresh();
  };
  doneBtn.onclick = () => finish();
  return trackCleanup(() => session.stop());
}

export function mountScaleLab(host, cfg) {
  const finish = once(() => cfg.onDone());
  chemLabState.scale = cfg.start ?? 0;
  playScene(cfg.scene, { ...(cfg.sceneArgs || {}), scale: chemLabState.scale });
  host.innerHTML = `
    <div class="chem-card chem-heat">
      <h3>${cfg.title}</h3>
      <p>${cfg.html}</p>
      <label class="chem-heat__label" for="chem-scale">Zoom scale: grain †\u2019 ions †\u2019 atom model</label>
      <input id="chem-scale" class="chem-heat__range" type="range" min="0" max="100" value="${Math.round((cfg.start || 0) * 100)}" />
      <p class="chem-heat__readout" id="chem-scale-read" aria-live="polite">Everyday grain</p>
      <p class="chem-heat__goal">Left canvas follows the same order: grain †\u2019 ions †\u2019 orbitals.</p>
      <button type="button" class="btn primary" id="chem-scale-go" disabled>Continue</button>
    </div>`;
  const range = host.querySelector("#chem-scale");
  const read = host.querySelector("#chem-scale-read");
  const btn = host.querySelector("#chem-scale-go");
  function apply(v) {
    const s = Math.max(0, Math.min(1, v / 100));
    chemLabState.scale = s;
    chemLabState.tokenProgress = s < 0.33 ? 0 : s < 0.66 ? 1 : s < 0.9 ? 2 : 3;
    if (s < 0.33) read.textContent = "Everyday salt grain";
    else if (s < 0.66) read.textContent = "Crystal of ions (model)";
    else read.textContent = "Optional simplified atom shells";
    if (s >= (cfg.threshold ?? 0.85)) btn.disabled = false;
  }
  range.oninput = () => apply(Number(range.value));
  apply(Number(range.value));
  btn.onclick = () => finish();
  return trackCleanup(() => {});
}

export function mountQuiz(host, cfg) {
  const finish = once(() => cfg.onDone());
  playScene(cfg.scene, cfg.sceneArgs || {});
  let timer = null;
  host.innerHTML = `
    <div class="chem-card chem-quiz">
      <h3>${cfg.title || "Check"}</h3>
      <p class="chem-quiz__q">${cfg.q}</p>
      <div class="chem-quiz__opts">
        ${cfg.opts
          .map((o, i) => `<button type="button" class="btn secondary chem-opt" data-i="${i}">${o}</button>`)
          .join("")}
      </div>
      <p id="quiz-status" class="drag-hint" aria-live="polite"></p>
    </div>`;
  const status = host.querySelector("#quiz-status");
  host.querySelectorAll(".chem-opt").forEach((btn) => {
    btn.onclick = () => {
      const i = Number(btn.dataset.i);
      if (i === cfg.ok) {
        btn.classList.add("chem-opt--ok");
        status.textContent = cfg.success || "Yes!";
        pulseSuccessFeedback(350);
        host.querySelectorAll(".chem-opt").forEach((b) => (b.disabled = true));
        timer = setTimeout(() => finish(), 650);
      } else {
        btn.classList.add("chem-opt--bad");
        status.textContent = cfg.fail || "Not quite - watch the canvas and try again.";
        pulseFailFeedback(480);
      }
    };
  });
  return trackCleanup(() => {
    if (timer) clearTimeout(timer);
  });
}

export function mountSpeedDrill(host, cfg) {
  let idx = 0;
  let correct = 0;
  const items = cfg.items;
  const passRatio = cfg.passRatio ?? 0.8;
  const finish = once(() => cfg.onDone());

  function render() {
    if (idx >= items.length) {
      const pass = correct / items.length >= passRatio;
      playScene(cfg.passScene || cfg.scene || "traitMastery");
      host.innerHTML = `
        <div class="chem-card">
          <h3>${pass ? "Drill passed!" : "Almost - review & retry"}</h3>
          <p>You scored <strong>${correct}</strong> of <strong>${items.length}</strong> (${Math.round((correct / items.length) * 100)}%).</p>
          <p>${pass ? cfg.passMessage || "Nice fluency - keep going." : `Need ${Math.round(passRatio * 100)}% to continue.`}</p>
          <div class="btn-row">
            ${pass ? `<button type="button" class="btn primary" id="drill-done">Continue</button>` : ""}
            <button type="button" class="btn secondary" id="drill-retry">Retry drill</button>
          </div>
        </div>`;
      host.querySelector("#drill-done")?.addEventListener("click", () => {
        try { window.__gqPed?.setFluencyScore?.(correct / items.length); } catch (e) {}
        finish();
      });
      host.querySelector("#drill-retry").onclick = () => {
        idx = 0;
        correct = 0;
        render();
      };
      return;
    }
    const it = items[idx];
    chemLabState.prompt = it.prompt || it.q;
    chemLabState.flashColor = 0x38bdf8;
    playScene(cfg.scene || "traitDrill", { prompt: chemLabState.prompt, flashColor: chemLabState.flashColor });
    host.innerHTML = `
      <div class="chem-card chem-drill">
        <div class="lab-demo__badge">Q ${idx + 1} / ${items.length}</div>
        <p class="chem-drill__q">${it.q}</p>
        <div class="chem-quiz__opts">
          ${it.opts
            .map((o, i) => `<button type="button" class="btn secondary chem-opt" data-i="${i}">${o}</button>`)
            .join("")}
        </div>
        <p id="drill-status" class="drag-hint" aria-live="polite"></p>
      </div>`;
    const status = host.querySelector("#drill-status");
    host.querySelectorAll(".chem-opt").forEach((btn) => {
      btn.onclick = () => {
        const i = Number(btn.dataset.i);
        const isOk = i === it.ok;
        if (isOk) {
          correct++;
          status.textContent = "Correct!";
          pulseSuccessFeedback(280);
        } else {
          status.textContent = "Miss - try again.";
          pulseFailFeedback(320);
        }
        try { window.__gqPed?.recordAnswer?.(isOk); } catch (e) { /* ped optional */ }
        host.querySelectorAll(".chem-opt").forEach((b) => (b.disabled = true));
        setTimeout(() => {
          idx++;
          render();
        }, 450);
      };
    });
  }
  render();
  return trackCleanup(() => {});
}

export function mountOrderSteps(host, cfg) {
  const finish = once(() => cfg.onDone());
  playScene(cfg.scene, cfg.sceneArgs || {});
  chemLabState.masteryStep = 0;
  const shuffled = [...cfg.items].sort(() => Math.random() - 0.5);
  host.innerHTML = `
    <div class="chem-card">
      <h3>${cfg.title}</h3>
      <p>${cfg.instructions}</p>
      <div class="chem-order" id="chem-order">
        ${shuffled.map((it) => `<button type="button" class="chip order-chip" data-id="${it.id}">${it.html}</button>`).join("")}
      </div>
      <div class="chem-eq-rail" id="order-rail" aria-label="Story order"></div>
      <p id="order-status" class="drag-hint" aria-live="polite"></p>
      <button type="button" class="btn secondary" id="order-reset">Reset</button>
    </div>`;
  const picked = [];
  const rail = host.querySelector("#order-rail");
  const status = host.querySelector("#order-status");
  const bank = host.querySelector("#chem-order");

  function refresh() {
    chemLabState.masteryStep = picked.length;
    rail.innerHTML = picked
      .map((id) => {
        const it = cfg.items.find((x) => x.id === id);
        return `<span class="eq-placed">${it?.html || id}</span>`;
      })
      .join(" †\u2019 ");
    bank.querySelectorAll(".order-chip").forEach((b) => {
      b.disabled = picked.includes(b.dataset.id);
    });
    if (picked.length === cfg.correctIds.length) {
      const ok = picked.every((id, i) => id === cfg.correctIds[i]);
      if (ok) {
        status.textContent = "Sequence locked - mastery path clear!";
        pulseSuccessFeedback(400);
        finish();
      } else {
        status.textContent = "Order is off - reset and try the story sequence again.";
        pulseFailFeedback(400);
      }
    }
  }

  bank.querySelectorAll(".order-chip").forEach((b) => {
    b.onclick = () => {
      picked.push(b.dataset.id);
      refresh();
    };
  });
  host.querySelector("#order-reset").onclick = () => {
    picked.length = 0;
    status.textContent = "";
    refresh();
  };
  return trackCleanup(() => {});
}

export function mountMythCards(host, cfg) {
  let i = 0;
  let cancelled = false;
  const finish = once(() => cfg.onDone());

  function show() {
    if (cancelled) return;
    if (i >= cfg.myths.length) {
      finish();
      return;
    }
    const m = cfg.myths[i];
    chemLabState.myth = m.sceneMyth;
    chemLabState.mythPhase = "claim";
    chemLabState.mythBusted = false;
    chemLabState.bustedAt = 0;
    playScene(cfg.scene || "traitMyth", { myth: m.sceneMyth });
    host.innerHTML = `
      <div class="chem-card chem-myth">
        ${badgeHtml(ATOM_ASSET_PATHS.myth, "myth bust")}
        <div class="lab-demo__badge">Myth ${i + 1} of ${cfg.myths.length}</div>
        <h3>${m.title || `Myth ${i + 1}`}</h3>
        <p class="chem-myth__claim"><strong>Claim:</strong> ${m.claim}</p>
        <p>What do you think?</p>
        <div class="btn-row">
          <button type="button" class="btn secondary" data-v="myth">Sounds true</button>
          <button type="button" class="btn primary" data-v="bust">Bust it - it's false</button>
        </div>
        <p id="myth-status" class="drag-hint" aria-live="polite"></p>
        <div class="btn-row">
          <button type="button" class="btn primary hidden" id="myth-next">Next myth</button>
        </div>
      </div>`;
    const status = host.querySelector("#myth-status");
    const nextBtn = host.querySelector("#myth-next");
    host.querySelectorAll("[data-v]").forEach((btn) => {
      btn.onclick = () => {
        if (btn.dataset.v === "bust") {
          chemLabState.mythPhase = "truth";
          chemLabState.mythBusted = true;
          chemLabState.bustedAt = performance.now();
          status.innerHTML = `<strong>Correct - you busted the myth.</strong><br/>Truth: ${m.truth}`;
          pulseSuccessFeedback(350);
          host.querySelectorAll("[data-v]").forEach((b) => (b.disabled = true));
          nextBtn.classList.remove("hidden");
          const last = i >= cfg.myths.length - 1;
          nextBtn.textContent = last ? "Continue" : "Next myth";
          nextBtn.onclick = () => {
            if (last) {
              finish();
              requestAnimationFrame(() => {
                document.getElementById("btn-next-dock")?.click();
              });
              return;
            }
            i++;
            show();
          };
        } else {
          chemLabState.mythPhase = "wrong";
          status.innerHTML = `<strong>That claim is a myth.</strong> Hit €œBust it€ to see the evidence on the canvas.<br/><em>Hint:</em> ${m.truth}`;
          pulseFailFeedback(480);
        }
      };
    });
  }
  show();
  return trackCleanup(() => {
    cancelled = true;
  });
}

export function mountTapContinue(host, cfg) {
  playScene(cfg.scene, cfg.sceneArgs || {});
  host.innerHTML = `
    <div class="chem-card">
      ${cfg.badge ? badgeHtml(cfg.badge, "lesson badge") : ""}
      <div class="lab-demo__body">${cfg.html}</div>
      <button type="button" class="btn primary" id="tap-go">Continue</button>
    </div>`;
  host.querySelector("#tap-go").onclick = once(() => {
    cfg.onDone();
    if (cfg.advanceAfterDone) {
      requestAnimationFrame(() => {
        document.getElementById("btn-next-dock")?.click();
      });
    }
  });
  return trackCleanup(() => {});
}

export function mountMultiQuiz(host, cfg) {
  let idx = 0;
  let correct = 0;
  const items = cfg.items;
  const finish = once(() => cfg.onDone());

  function render() {
    if (idx >= items.length) {
      host.innerHTML = `
        <div class="chem-card">
          <h3>${cfg.doneTitle || "Checks complete"}</h3>
          <p>Score: <strong>${correct}</strong> / ${items.length}</p>
          <button type="button" class="btn primary" id="mq-done">Continue</button>
        </div>`;
      host.querySelector("#mq-done").onclick = () => finish();
      return;
    }
    const it = items[idx];
    playScene(it.scene || cfg.scene, it.sceneArgs || cfg.sceneArgs || {});
    host.innerHTML = `
      <div class="chem-card chem-quiz">
        <div class="lab-demo__badge">Check ${idx + 1} / ${items.length}</div>
        <h3>${it.title || cfg.title || "Check"}</h3>
        <p class="chem-quiz__q">${it.q}</p>
        <div class="chem-quiz__opts">
          ${it.opts.map((o, i) => `<button type="button" class="btn secondary chem-opt" data-i="${i}">${o}</button>`).join("")}
        </div>
        <p id="quiz-status" class="drag-hint" aria-live="polite"></p>
      </div>`;
    const status = host.querySelector("#quiz-status");
    host.querySelectorAll(".chem-opt").forEach((btn) => {
      btn.onclick = () => {
        const i = Number(btn.dataset.i);
        if (i === it.ok) {
          correct++;
          status.textContent = "Yes!";
          pulseSuccessFeedback(300);
        } else {
          status.textContent = it.fail || "Not quite.";
          pulseFailFeedback(400);
        }
        host.querySelectorAll(".chem-opt").forEach((b) => (b.disabled = true));
        setTimeout(() => {
          idx++;
          render();
        }, 550);
      };
    });
  }
  render();
  return trackCleanup(() => {});
}

