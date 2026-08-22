import { CATALOG, SUBJECTS, modelUrl, loc } from "./catalog.js";
import { COPY } from "./i18n.js";
import { clonePins } from "./annotations.js";
import { SpecimenViewer } from "./viewer.js";

const LS_LOCALE = "gyanquest-locale";
const LS_PINS = "gq-3d-lab-pins-v1";

const $ = (id) => document.getElementById(id);

function readStore() {
  try {
    return JSON.parse(localStorage.getItem(LS_PINS) || "{}") || {};
  } catch {
    return {};
  }
}
function writeStore(all) {
  try {
    localStorage.setItem(LS_PINS, JSON.stringify(all));
  } catch {
    /* quota / private */
  }
}

function loadLocale() {
  try {
    const s = localStorage.getItem(LS_LOCALE);
    if (s === "bn" || s === "en") return s;
  } catch {
    /* */
  }
  return "en";
}

const state = {
  locale: loadLocale(),
  subject: "all",
  modelId: null,
  pins: [],
  selected: null,
  editing: false,
};

function t(key) {
  return COPY[state.locale]?.[key] ?? COPY.en[key] ?? key;
}

function applyCopy() {
  document.documentElement.lang = state.locale === "bn" ? "bn" : "en";
  document.body.classList.toggle("locale-bn", state.locale === "bn");
  document.querySelectorAll("[data-i]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i"));
  });
  $("btn-lang").textContent = t("lang");
  $("btn-edit").textContent = state.editing ? t("placing") : t("placePins");
}

function currentEntry() {
  return CATALOG.find((m) => m.id === state.modelId) || null;
}

function pinsFor(modelId) {
  const stored = readStore()[modelId];
  if (Array.isArray(stored) && stored.length) return stored.map((p) => ({ ...p, title: { ...p.title }, body: { ...p.body } }));
  return clonePins(modelId);
}

function persistPins() {
  if (!state.modelId) return;
  const all = readStore();
  all[state.modelId] = state.pins;
  writeStore(all);
}

function renderSubjects() {
  const host = $("subjects");
  host.innerHTML = "";
  SUBJECTS.forEach((s) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = loc(s, state.locale);
    b.className = s.id === state.subject ? "is-on" : "";
    b.addEventListener("click", () => {
      state.subject = s.id;
      renderSubjects();
      renderCatalog();
    });
    host.appendChild(b);
  });
}

function renderCatalog() {
  const host = $("catalog");
  host.innerHTML = "";
  CATALOG.filter((m) => state.subject === "all" || m.subject === state.subject).forEach((m, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lab-card" + (m.id === state.modelId ? " is-on" : "");
    btn.innerHTML = `
      <span class="lab-card__idx">${String(i + 1).padStart(2, "0")}</span>
      <h3>${loc(m.title, state.locale)}</h3>
      <p>${loc(m.blurb, state.locale)}</p>`;
    btn.addEventListener("click", () => openModel(m.id));
    host.appendChild(btn);
  });
}

function renderParts() {
  const host = $("partlist");
  const empty = $("parts-empty");
  host.innerHTML = "";
  if (!state.pins.length) {
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");
  state.pins
    .slice()
    .sort((a, b) => a.n - b.n)
    .forEach((p) => {
      const li = document.createElement("li");
      const b = document.createElement("button");
      b.type = "button";
      b.className = p.id === state.selected ? "is-on" : "";
      b.innerHTML = `<b>${p.n}</b><span>${loc(p.title, state.locale) || ""}</span>`;
      b.addEventListener("click", () => selectPin(p.id, true));
      li.appendChild(b);
      host.appendChild(li);
    });
}

let leaderDrawFor = null;

function fillCallout(pin) {
  $("callout-n").textContent = String(pin.n).padStart(2, "0");
  $("callout-title").textContent = loc(pin.title, state.locale) || "";
  $("callout-body").textContent = loc(pin.body, state.locale) || "";
}

function hideCallout() {
  $("callout").classList.add("is-off");
  $("leader").classList.add("is-off");
  const path = $("leader-path");
  path.removeAttribute("d");
  path.style.strokeDasharray = "none";
  path.style.strokeDashoffset = "0";
  path.style.transition = "none";
  leaderDrawFor = null;
}

function syncCallout() {
  const pin = state.pins.find((p) => p.id === state.selected);
  const show = !!(pin && viewer.focusId === pin.id && !state.editing);
  const card = $("callout");
  const svg = $("leader");
  const path = $("leader-path");
  const dot = $("leader-dot");
  const end = $("leader-end");
  const well = $("well");
  if (!show || !well) {
    hideCallout();
    return;
  }

  fillCallout(pin);
  card.classList.remove("is-off");
  svg.classList.remove("is-off");

  const w = well.clientWidth;
  const h = well.clientHeight;
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  svg.setAttribute("width", String(w));
  svg.setAttribute("height", String(h));

  const pinEl = well.querySelector(`[data-pin="${pin.id}"]`);
  if (!pinEl || pinEl.style.display === "none") {
    path.setAttribute("d", "");
    return;
  }

  const wellRect = well.getBoundingClientRect();
  const pr = pinEl.getBoundingClientRect();
  const px = pr.left + pr.width / 2 - wellRect.left;
  const py = pr.top + pr.height / 2 - wellRect.top;

  const pad = 14;
  const cardW = Math.min(272, Math.max(188, card.offsetWidth || 240));
  const cardH = card.offsetHeight || 120;
  const roomRight = w - px > cardW + 56;
  const side = roomRight ? "right" : "left";
  const cardX = side === "right" ? w - cardW - pad : pad;
  let cardY = py - Math.min(40, cardH * 0.32);
  cardY = Math.max(pad, Math.min(cardY, h - cardH - pad - 36));
  card.style.width = `${cardW}px`;
  card.style.left = `${cardX}px`;
  card.style.top = `${cardY}px`;
  card.dataset.side = side;

  const ax = side === "right" ? cardX : cardX + cardW;
  const ay = cardY + 28;
  const span = Math.abs(ax - px) || 1;
  const pinR = 16;
  const vx = ax - px;
  const vy = ay - py;
  const vlen = Math.hypot(vx, vy) || 1;
  const sx = px + (vx / vlen) * pinR;
  const sy = py + (vy / vlen) * pinR;
  const bulge = Math.max(48, Math.min(130, span * 0.42));
  const c1x = sx + (side === "right" ? bulge : -bulge);
  const c2x = ax + (side === "right" ? -36 : 36);
  const d = `M ${sx.toFixed(1)} ${sy.toFixed(1)} C ${c1x.toFixed(1)} ${sy.toFixed(1)}, ${c2x.toFixed(1)} ${ay.toFixed(1)}, ${ax.toFixed(1)} ${ay.toFixed(1)}`;
  path.setAttribute("d", d);
  dot.setAttribute("cx", sx.toFixed(1));
  dot.setAttribute("cy", sy.toFixed(1));
  end.setAttribute("cx", ax.toFixed(1));
  end.setAttribute("cy", ay.toFixed(1));

  if (leaderDrawFor !== pin.id) {
    leaderDrawFor = pin.id;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const len = path.getTotalLength?.() || 0;
    if (!reduce && len > 1) {
      path.style.transition = "none";
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = `${len}`;
      requestAnimationFrame(() => {
        path.style.transition = "stroke-dashoffset 0.42s ease";
        path.style.strokeDashoffset = "0";
      });
      window.setTimeout(() => {
        path.style.strokeDasharray = "none";
        path.style.strokeDashoffset = "0";
        path.style.transition = "none";
      }, 480);
    } else {
      path.style.strokeDasharray = "none";
      path.style.strokeDashoffset = "0";
    }
  }
}

function renderCredit() {
  const entry = currentEntry();
  const el = $("credit");
  if (!entry) {
    el.innerHTML = "";
    return;
  }
  el.innerHTML = `<strong>${t("credit")}</strong> · ${entry.credit}`;
}

function renderEditor() {
  const pin = state.pins.find((p) => p.id === state.selected);
  $("editor").classList.toggle("hidden", !state.editing);
  if (!state.editing) return;
  $("ed-title").value = pin ? loc(pin.title, state.locale) : "";
  $("ed-body").value = pin ? loc(pin.body, state.locale) : "";
  if (pin?.position) {
    const [x, y, z] = pin.position;
    $("ed-xyz").textContent = `${x.toFixed(3)}, ${y.toFixed(3)}, ${z.toFixed(3)}`;
  } else {
    $("ed-xyz").textContent = pin?.target ? `target: ${pin.target}` : "";
  }
  const snap = $("ed-snap");
  if (!pin) snap.textContent = "";
  else if (pin.pinned) snap.textContent = t("manual");
  else if (pin.target) snap.textContent = `${t("snapped")}: ${pin.target}`;
  else snap.textContent = t("manual");
}

function refreshPinsOnViewer() {
  viewer.setPins(state.pins);
  if (state.selected) viewer.focusPin(state.selected);
}

function selectPin(id, focus) {
  state.selected = id;
  renderParts();
  renderEditor();
  if (focus && id) viewer.focusPin(id);
  else if (!id) viewer.clearFocus();
  syncCallout();
}

function nextNumber() {
  return state.pins.reduce((n, p) => Math.max(n, p.n), 0) + 1;
}

function addPinAt(local) {
  const n = nextNumber();
  const id = `pin-${Date.now().toString(36)}`;
  const pin = {
    id,
    n,
    title: {
      en: state.locale === "en" ? `Part ${n}` : `অংশ ${n}`,
      bn: `অংশ ${n}`,
    },
    body: { en: "", bn: "" },
    position: [local.x, local.y, local.z],
    pinned: true,
  };
  state.pins.push(pin);
  persistPins();
  refreshPinsOnViewer();
  selectPin(id, true);
}

function movePin(id, local) {
  const pin = state.pins.find((p) => p.id === id);
  if (!pin) return;
  pin.position = [local.x, local.y, local.z];
  pin.pinned = true;
  persistPins();
  viewer.setPins(state.pins);
  state.selected = id;
  renderEditor();
  renderParts();
}

async function openModel(id) {
  const entry = CATALOG.find((m) => m.id === id);
  if (!entry) return;
  state.modelId = id;
  state.pins = pinsFor(id);
  state.selected = state.pins[0]?.id || null;
  history.replaceState(null, "", `#${id}`);
  $("specimen-name").textContent = loc(entry.title, state.locale);
  renderCatalog();
  renderCredit();
  renderParts();
  renderEditor();
  $("rail").classList.remove("is-open");
  $("btn-catalog").setAttribute("aria-expanded", "false");

  const load = $("load");
  load.classList.remove("hidden");
  $("load-bar").style.width = "0%";
  $("load-heavy").classList.toggle("hidden", !entry.heavy);
  $("fail").classList.add("hidden");
  viewer.clearFocus();
  syncCallout();
  await viewer.load(modelUrl(entry));
}

function downloadPins() {
  const payload = {
    modelId: state.modelId,
    updated: new Date().toISOString(),
    pins: state.pins,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `pins-${state.modelId || "lab"}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function importPins(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result));
      const pins = Array.isArray(data) ? data : data.pins;
      if (!Array.isArray(pins)) return;
      state.pins = pins;
      persistPins();
      refreshPinsOnViewer();
      state.selected = pins[0]?.id || null;
      renderParts();
      syncCallout();
      renderEditor();
    } catch {
      /* ignore bad file */
    }
  };
  reader.readAsText(file);
}

applyCopy();
renderSubjects();
renderCatalog();

if (!window.WebGLRenderingContext) {
  $("fail").classList.remove("hidden");
  $("fail").textContent = t("webglFail");
}

const viewer = new SpecimenViewer({
  canvas: $("c3d"),
  pinLayer: $("pins"),
  irisEl: $("iris"),
  onPinSelect: (id) => selectPin(id, !state.editing),
  onPinsUpdated: () => syncCallout(),
  onSurfacePlace: (local) => {
    if (state.editing) addPinAt(local);
  },
  onPinMove: (id, local) => movePin(id, local),
  onProgress: (r) => {
    $("load-bar").style.width = `${Math.round(Math.min(1, r) * 100)}%`;
  },
  onLoad: () => {
    $("load").classList.add("hidden");
    viewer.setPins(state.pins);
    renderEditor();
    if (state.selected && !state.editing) {
      /* keep overview first so the specimen is readable */
    }
  },
  onError: () => {
    $("load").classList.add("hidden");
    $("fail").classList.remove("hidden");
    $("fail").textContent = t("webglFail");
  },
});

$("btn-lang").addEventListener("click", () => {
  state.locale = state.locale === "en" ? "bn" : "en";
  try {
    localStorage.setItem(LS_LOCALE, state.locale);
  } catch {
    /* */
  }
  applyCopy();
  renderSubjects();
  renderCatalog();
  renderParts();
  syncCallout();
  renderCredit();
  renderEditor();
  const entry = currentEntry();
  if (entry) $("specimen-name").textContent = loc(entry.title, state.locale);
});

$("btn-catalog").addEventListener("click", () => {
  const open = $("rail").classList.toggle("is-open");
  $("btn-catalog").setAttribute("aria-expanded", String(open));
});

$("btn-reset").addEventListener("click", () => viewer.resetView());
$("btn-clear").addEventListener("click", () => {
  state.selected = null;
  viewer.clearFocus();
  renderParts();
  syncCallout();
  renderEditor();
});

$("btn-edit").addEventListener("click", () => {
  state.editing = !state.editing;
  viewer.setEditMode(state.editing);
  $("btn-edit").setAttribute("aria-pressed", String(state.editing));
  $("btn-edit").textContent = state.editing ? t("placing") : t("placePins");
  $("hint").textContent = state.editing ? t("addPin") : t("orbitHint");
  renderEditor();
  syncCallout();
});

$("ed-title").addEventListener("input", () => {
  const pin = state.pins.find((p) => p.id === state.selected);
  if (!pin) return;
  pin.title[state.locale] = $("ed-title").value;
  if (!pin.title.en) pin.title.en = $("ed-title").value;
  persistPins();
  renderParts();
  syncCallout();
});
$("ed-body").addEventListener("input", () => {
  const pin = state.pins.find((p) => p.id === state.selected);
  if (!pin) return;
  pin.body[state.locale] = $("ed-body").value;
  if (!pin.body.en) pin.body.en = $("ed-body").value;
  persistPins();
  syncCallout();
});
$("btn-del").addEventListener("click", () => {
  if (!state.selected) return;
  state.pins = state.pins.filter((p) => p.id !== state.selected);
  state.pins.forEach((p, i) => {
    p.n = i + 1;
  });
  state.selected = state.pins[0]?.id || null;
  persistPins();
  refreshPinsOnViewer();
  renderParts();
  syncCallout();
  renderEditor();
});
$("btn-export").addEventListener("click", downloadPins);
$("ed-import").addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  if (file) importPins(file);
  e.target.value = "";
});
$("btn-restore").addEventListener("click", () => {
  if (!state.modelId) return;
  const all = readStore();
  delete all[state.modelId];
  writeStore(all);
  state.pins = clonePins(state.modelId);
  state.selected = state.pins[0]?.id || null;
  refreshPinsOnViewer();
  renderParts();
  syncCallout();
  renderEditor();
});
$("btn-copy").addEventListener("click", async () => {
  const text = $("ed-xyz").textContent;
  try {
    await navigator.clipboard.writeText(`${state.modelId} ${state.selected} ${text}`);
    $("btn-copy").textContent = t("copied");
    setTimeout(() => {
      $("btn-copy").textContent = t("copyCoords");
    }, 1200);
  } catch {
    /* */
  }
});

window.addEventListener("keydown", (e) => {
  if (e.target.matches("input, textarea")) return;
  if (e.key === "Escape") {
    state.selected = null;
    viewer.clearFocus();
    renderParts();
    syncCallout();
  }
  if (e.key.toLowerCase() === "e" && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    $("btn-edit").click();
  }
  const n = Number(e.key);
  if (n >= 1 && n <= 9) {
    const pin = state.pins.find((p) => p.n === n);
    if (pin) selectPin(pin.id, true);
  }
});

const hash = (location.hash || "").replace("#", "");
const start = CATALOG.some((m) => m.id === hash) ? hash : "animal-cell";
openModel(start);

if (new URLSearchParams(location.search).has("edit")) {
  $("btn-edit").click();
}
